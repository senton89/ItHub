#!/bin/bash

# IThub Aggregator Start Script
# This script handles the .config file conflict with Prisma

PROJECT_DIR="/home/z/my-project"
cd "$PROJECT_DIR"

# Backup .config file if it exists
if [ -f ".config" ]; then
    mv .config .config_backup
fi

# Start Next.js dev server
echo "Starting IThub Aggregator..."
echo "Access the application at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"

npm run dev

# Restore .config on exit
trap 'if [ -f ".config_backup" ]; then mv .config_backup .config; fi' EXIT
