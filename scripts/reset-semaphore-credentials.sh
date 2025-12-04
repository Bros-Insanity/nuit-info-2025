#!/bin/bash

# Commande simple pour réinitialiser les identifiants Semaphore
# Usage: ./reset-semaphore-credentials.sh [username] [password]

USERNAME=${1:-admin}
PASSWORD=${2:-admin123}

echo "🔐 Réinitialisation Semaphore..."

# Générer hash bcrypt
HASH=$(python3 -c "import bcrypt; print(bcrypt.hashpw(b'${PASSWORD}', bcrypt.gensalt()).decode())" 2>/dev/null || echo "")

if [ -z "$HASH" ]; then
    pip3 install bcrypt --quiet
    HASH=$(python3 -c "import bcrypt; print(bcrypt.hashpw(b'${PASSWORD}', bcrypt.gensalt()).decode())")
fi

# Vérifier/créer utilisateur
sudo -u postgres psql -d semaphore <<EOF
INSERT INTO "user" (username, password, name, email, admin, created)
VALUES ('${USERNAME}', '${HASH}', 'Admin', 'admin@example.com', true, NOW())
ON CONFLICT (username) DO UPDATE SET password = '${HASH}';
EOF

echo "✅ Identifiants:"
echo "   Username: $USERNAME"
echo "   Password: $PASSWORD"
