#!/bin/bash

# ============================================================================
# Azure Deployment Script for Backend (Monorepo)
# ============================================================================
# This script runs on Azure during deployment
# It builds the shared-types package first, then the backend

set -e

echo "Starting Azure deployment for Resumer Backend..."

# Navigate to repository root
cd ..

echo "Installing dependencies with pnpm..."
npm install -g pnpm@9
pnpm install --frozen-lockfile

echo "Building shared-types package..."
pnpm --filter @resumer/shared-types build

echo "Building backend..."
pnpm --filter backend build

echo "Deployment complete!"
