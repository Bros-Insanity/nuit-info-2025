#!/bin/bash

# Commande simple pour lister les utilisateurs Semaphore
sudo -u postgres psql -d semaphore -c "SELECT username, email, admin FROM \"user\";"

