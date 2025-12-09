#!/usr/bin/env bash

set -euo pipefail

cd backend

# === CONFIG ===
RESOURCE_GROUP="rg-marsshot-prosono-mvp-prod"
LOCATION="westeurope"
APP_NAME="ca-marsshot-prosono-mvp-prod"
TARGET_PORT=8000
CONTAINER_ENV_NAME="cae-prosono-mvp-prod"

# === AZURE LOGIN CHECK ===
echo "🔐 Checking Azure login..."
az account show > /dev/null 2>&1 || {
  echo "⚠️  Not logged in to Azure. Run 'az login' and try again."
  exit 1
}

# === CREATE RESOURCE GROUP IF NOT EXISTS ===
echo "📦 Ensuring resource group exists..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output none 2>/dev/null || true

# === CREATE CONTAINER APPS ENVIRONMENT ===
# Create Container Apps Environment without VNet integration
if ! az containerapp env show --name "$CONTAINER_ENV_NAME" --resource-group "$RESOURCE_GROUP" > /dev/null 2>&1; then
  echo "🏢 Creating Container Apps Environment (public)..."
  az containerapp env create \
    --name "$CONTAINER_ENV_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION"
fi

# === DEPLOY CONTAINER APP WITH CUSTOM DOCKERFILE ===
echo "🚀 Deploying container app '$APP_NAME' with production Dockerfile..."

# First, rename the production Dockerfile temporarily
mv Dockerfile Dockerfile.original 2>/dev/null || true
cp Dockerfile.prod Dockerfile

# Deploy
az containerapp up \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --source "." \
  --target-port "$TARGET_PORT" \
  --ingress external \
  --environment "$CONTAINER_ENV_NAME" \
  --verbose

# Restore original Dockerfile
mv Dockerfile.original Dockerfile 2>/dev/null || true

echo "✅ Deployment complete."

# === GET URL ===
APP_URL=$(az containerapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "🌍 App available at: https://$APP_URL"
echo ""
echo "📝 Remember to set your environment variables in the Container App:"
echo "   - DATABASE_URL (with public PostgreSQL connection string)"
echo "   - JWT_SECRET_KEY"
echo "   - Any other required environment variables"