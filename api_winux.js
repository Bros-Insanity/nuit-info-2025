#!/usr/bin/env node
/**
 * API Winux - Backend Node.js/Express compatible avec nginx
 * API simple pour gérer les sessions Winux temporaires
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configuration
const SESSIONS_FILE = '/tmp/winux_sessions.json';
const SESSION_DURATION_MINUTES = 30;
const CONTAINER_ID_MIN = 30001;
const CONTAINER_ID_MAX = 30999;

// Middleware
app.use(cors()); // Permet les requêtes cross-origin
app.use(express.json()); // Parse les requêtes JSON

/**
 * Charge les sessions depuis le fichier JSON
 */
async function loadSessions() {
    try {
        const data = await fs.readFile(SESSIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {};
        }
        console.error('Erreur lors du chargement des sessions:', error);
        return {};
    }
}

/**
 * Sauvegarde les sessions dans le fichier JSON
 */
async function saveSessions(sessions) {
    try {
        await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des sessions:', error);
    }
}

/**
 * Trouve un container ID disponible
 */
function getAvailableContainerId(sessions) {
    const usedIds = new Set();
    
    for (const session of Object.values(sessions)) {
        const containerId = parseInt(session.container_id, 10);
        if (containerId >= CONTAINER_ID_MIN && containerId <= CONTAINER_ID_MAX) {
            usedIds.add(containerId);
        }
    }
    
    for (let containerId = CONTAINER_ID_MIN; containerId <= CONTAINER_ID_MAX; containerId++) {
        if (!usedIds.has(containerId)) {
            return containerId;
        }
    }
    return null;
}

/**
 * Calcule l'IP du container basée sur son ID
 */
function calculateIp(containerId) {
    // IP = 10.0.0.{container_id % 254 + 1}
    const ipLastOctet = (containerId % 254) + 1;
    return `10.0.0.${ipLastOctet}`;
}

/**
 * Calcule le nombre de secondes restantes avant expiration
 */
function calculateRemainingSeconds(expiresAtStr) {
    try {
        const expiresAt = new Date(expiresAtStr);
        const now = new Date();
        const remaining = Math.floor((expiresAt - now) / 1000);
        return Math.max(0, remaining);
    } catch (error) {
        return 0;
    }
}

/**
 * Supprime les sessions expirées
 */
async function cleanupExpiredSessions() {
    try {
        const sessions = await loadSessions();
        const now = new Date();
        const expired = [];
        
        for (const [sessionId, session] of Object.entries(sessions)) {
            try {
                const expiresAt = new Date(session.expires_at);
                if (now >= expiresAt) {
                    expired.push(sessionId);
                }
            } catch (error) {
                expired.push(sessionId);
            }
        }
        
        for (const sessionId of expired) {
            delete sessions[sessionId];
        }
        
        if (expired.length > 0) {
            await saveSessions(sessions);
            console.log(`Nettoyage: ${expired.length} session(s) expirée(s) supprimée(s)`);
        }
        
        return expired.length;
    } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
        return 0;
    }
}

// Routes API

/**
 * GET /api/winux/health
 * Endpoint de santé de l'API
 */
app.get('/api/winux/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        message: 'API Winux opérationnelle'
    });
});

/**
 * GET /api/winux/sessions
 * Liste toutes les sessions actives
 */
app.get('/api/winux/sessions', async (req, res) => {
    try {
        let sessions = await loadSessions();
        await cleanupExpiredSessions();
        sessions = await loadSessions(); // Recharger après nettoyage
        
        // Convertir en liste et calculer remaining_seconds
        const sessionsList = [];
        for (const [sessionId, session] of Object.entries(sessions)) {
            const remaining = calculateRemainingSeconds(session.expires_at);
            if (remaining > 0) {
                sessionsList.push({
                    ...session,
                    remaining_seconds: remaining
                });
            }
        }
        
        res.json({
            success: true,
            sessions: sessionsList
        });
    } catch (error) {
        console.error('Erreur lors de la liste des sessions:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/winux/sessions
 * Crée une nouvelle session Winux
 */
app.post('/api/winux/sessions', async (req, res) => {
    try {
        const durationMinutes = req.body.duration_minutes || SESSION_DURATION_MINUTES;
        
        // Vérifier qu'il n'y a pas déjà une session active
        let sessions = await loadSessions();
        await cleanupExpiredSessions();
        sessions = await loadSessions();
        
        const activeSessions = Object.values(sessions).filter(session => {
            const remaining = calculateRemainingSeconds(session.expires_at);
            return remaining > 0;
        });
        
        if (activeSessions.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Une session est déjà active. Veuillez la terminer avant d\'en créer une nouvelle.'
            });
        }
        
        // Trouver un container ID disponible
        const containerId = getAvailableContainerId(sessions);
        if (containerId === null) {
            return res.status(503).json({
                success: false,
                error: 'Aucun container ID disponible. Tous les containers sont utilisés.'
            });
        }
        
        // Créer la session
        const sessionId = uuidv4();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
        
        const session = {
            session_id: sessionId,
            container_id: containerId,
            container_ip: calculateIp(containerId),
            created_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            duration_minutes: durationMinutes,
            remaining_seconds: durationMinutes * 60
        };
        
        sessions[sessionId] = session;
        await saveSessions(sessions);
        
        console.log(`Session créée: ${sessionId} (container ${containerId}, IP ${session.container_ip})`);
        
        res.status(201).json({
            success: true,
            session: session
        });
    } catch (error) {
        console.error('Erreur lors de la création de la session:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/winux/sessions/:sessionId
 * Obtient les informations d'une session spécifique
 */
app.get('/api/winux/sessions/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        let sessions = await loadSessions();
        await cleanupExpiredSessions();
        sessions = await loadSessions();
        
        if (!sessions[sessionId]) {
            return res.status(404).json({
                success: false,
                error: 'Session non trouvée'
            });
        }
        
        const session = sessions[sessionId];
        const remaining = calculateRemainingSeconds(session.expires_at);
        
        if (remaining <= 0) {
            return res.status(410).json({
                success: false,
                error: 'Session expirée'
            });
        }
        
        res.json({
            success: true,
            session: {
                ...session,
                remaining_seconds: remaining
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/winux/sessions/:sessionId
 * Supprime une session
 */
app.delete('/api/winux/sessions/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const sessions = await loadSessions();
        
        if (!sessions[sessionId]) {
            return res.status(404).json({
                success: false,
                error: 'Session non trouvée'
            });
        }
        
        const session = sessions[sessionId];
        delete sessions[sessionId];
        await saveSessions(sessions);
        
        console.log(`Session supprimée: ${sessionId} (container ${session.container_id})`);
        
        res.json({
            success: true,
            message: 'Session supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la session:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/winux/cleanup
 * Nettoie manuellement les sessions expirées
 */
app.post('/api/winux/cleanup', async (req, res) => {
    try {
        const count = await cleanupExpiredSessions();
        res.json({
            success: true,
            message: `${count} session(s) expirée(s) supprimée(s)`
        });
    } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Nettoyage automatique toutes les minutes
setInterval(async () => {
    try {
        await cleanupExpiredSessions();
    } catch (error) {
        console.error('Erreur dans le nettoyage automatique:', error);
    }
}, 60000); // 60 secondes

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
// Dans un container Docker, écouter sur 0.0.0.0 pour être accessible depuis l'extérieur
// En local, utiliser 127.0.0.1 pour la sécurité
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');

app.listen(PORT, HOST, () => {
    console.log(`🚀 API Winux démarrée sur http://${HOST}:${PORT}`);
    console.log(`📁 Fichier de sessions: ${SESSIONS_FILE}`);
    console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

