// Visualisations interactives pour la documentation IA

// Configuration globale Chart.js
Chart.defaults.color = '#cbd5e1';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.backgroundColor = 'rgba(99, 102, 241, 0.1)';

// 1. Graphique Réseau de Neurones
function createNeuralNetworkChart() {
    const ctx = document.getElementById('neuralNetworkChart');
    if (!ctx) return;

    // Simulation d'un réseau de neurones simple
    const data = {
        labels: ['Époque 1', 'Époque 2', 'Époque 3', 'Époque 4', 'Époque 5', 'Époque 6', 'Époque 7', 'Époque 8', 'Époque 9', 'Époque 10'],
        datasets: [
            {
                label: 'Perte (Loss)',
                data: [2.5, 1.8, 1.2, 0.8, 0.5, 0.3, 0.2, 0.15, 0.12, 0.1],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Précision (Accuracy)',
                data: [0.3, 0.45, 0.6, 0.72, 0.82, 0.88, 0.92, 0.94, 0.96, 0.97],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }
        ]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Courbe d\'Apprentissage d\'un Réseau de Neurones',
                    color: '#f1f5f9'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Perte'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Précision'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// 2. Graphique RNN/LSTM
function createRNNChart() {
    const ctx = document.getElementById('rnnChart');
    if (!ctx) return;

    const data = {
        labels: ['t-3', 't-2', 't-1', 't', 't+1', 't+2', 't+3'],
        datasets: [
            {
                label: 'Entrée',
                data: [0.2, 0.4, 0.6, 0.8, null, null, null],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 2,
                pointRadius: 5
            },
            {
                label: 'État caché',
                data: [0.1, 0.3, 0.5, 0.7, 0.65, 0.6, 0.55],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 5
            },
            {
                label: 'Prédiction',
                data: [null, null, null, null, 0.75, 0.7, 0.65],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 2,
                pointRadius: 5
            }
        ]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Flux d\'Information dans un RNN/LSTM',
                    color: '#f1f5f9'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Valeur'
                    }
                }
            }
        }
    });
}

// 3. Graphique Émissions Carbone
function createCarbonChart() {
    const ctx = document.getElementById('carbonChart');
    if (!ctx) return;

    const data = {
        labels: ['GPT-3', 'GPT-4', 'BERT', 'T5', 'LLaMA-65B', 'Mistral-7B'],
        datasets: [
            {
                label: 'CO₂ (tonnes) - Entraînement',
                data: [284, 500, 0.65, 47, 48, 12],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderColor: [
                    '#ef4444',
                    '#ef4444',
                    '#10b981',
                    '#f59e0b',
                    '#f59e0b',
                    '#10b981'
                ],
                borderWidth: 2
            }
        ]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Émissions de CO₂ par Modèle (Entraînement)',
                    color: '#f1f5f9'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' tonnes CO₂';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tonnes de CO₂'
                    }
                }
            }
        }
    });
}

// 4. Comparaison des Modèles
function createModelComparisonChart() {
    const ctx = document.getElementById('modelComparisonChart');
    if (!ctx) return;

    const data = {
        labels: ['Paramètres', 'Données (TB)', 'Énergie (MWh)', 'CO₂ (tonnes)', 'Temps (jours)'],
        datasets: [
            {
                label: 'GPT-3 (175B)',
                data: [175, 45, 1287, 284, 30],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                tension: 0.4
            },
            {
                label: 'LLaMA-65B',
                data: [65, 20, 184, 48, 21],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.4
            },
            {
                label: 'Mistral-7B',
                data: [7, 8, 28, 12, 7],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                tension: 0.4
            }
        ]
    };

    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Comparaison Multi-Critères des Modèles',
                    color: '#f1f5f9'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 50
                    }
                }
            }
        }
    });
}

// 5. Efficacité des LLM
function createLLMEfficiencyChart() {
    const ctx = document.getElementById('llmEfficiencyChart');
    if (!ctx) return;

    const data = {
        labels: ['GPT-3', 'GPT-4', 'LLaMA-65B', 'Mistral-7B', 'LLaMA-7B'],
        datasets: [
            {
                label: 'Performance (Score)',
                data: [85, 95, 88, 82, 75],
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: '#6366f1',
                borderWidth: 2
            },
            {
                label: 'Efficacité Énergétique (Score inversé)',
                data: [20, 15, 60, 85, 90],
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: '#10b981',
                borderWidth: 2
            }
        ]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Performance vs Efficacité Énergétique',
                    color: '#f1f5f9'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Score (0-100)'
                    }
                }
            }
        }
    });
}

// 6. Impact des LLM
function createLLMImpactChart() {
    const ctx = document.getElementById('llmImpactChart');
    if (!ctx) return;

    // Données d'impact au fil du temps
    const data = {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025 (est.)'],
        datasets: [
            {
                label: 'Entraînement (MWh)',
                data: [500, 1200, 2500, 4500, 8000, 12000],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Inférence (MWh)',
                data: [100, 300, 800, 2000, 5000, 10000],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Total CO₂ (tonnes)',
                data: [150, 400, 900, 1800, 3600, 6000],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }
        ]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Évolution de la Consommation Énergétique des LLM',
                    color: '#f1f5f9'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Énergie (MWh)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'CO₂ (tonnes)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// Initialisation de toutes les visualisations
document.addEventListener('DOMContentLoaded', function() {
    // Attendre un peu pour que MathJax se charge
    setTimeout(() => {
        createNeuralNetworkChart();
        createRNNChart();
        createCarbonChart();
        createModelComparisonChart();
        createLLMEfficiencyChart();
        createLLMImpactChart();
        
        // Animation des barres de progression
        animateBreakdownBars();
    }, 500);
});

// Animation des barres de progression
function animateBreakdownBars() {
    const bars = document.querySelectorAll('.breakdown-fill');
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.width = width;
        }, 100);
    });
}

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les cartes pour animation
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.model-card, .impact-card, .llm-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
});

