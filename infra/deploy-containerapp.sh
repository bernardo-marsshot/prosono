#!/usr/bin/env bash

set -euo pipefail

# === CONFIG ===
RESOURCE_GROUP="rg-marsshot-prosono-mvp-dev"
LOCATION="westeurope"
APP_NAME="ca-marsshot-prosono-mvp-dev"
APP_SOURCE="."
TARGET_PORT=8000

# Network configuration - Use existing PostgreSQL VNet
VNET_NAME="vnet-postgres-prod"  # This will be created by Terraform
VNET_RESOURCE_GROUP="rg-addup-shared-services-prod"  # PostgreSQL resource group
CONTAINERAPP_SUBNET="snet-containerapp-prosono-mvp-dev"
CONTAINER_ENV_NAME="cae-prosono-mvp-dev"

# === AZURE LOGIN CHECK ===
echo "🔐 Checking Azure login..."
az account show > /dev/null 2>&1 || {
  echo "⚠️  Not logged in to Azure. Run 'az login' and try again."
  exit 1
}

# === NETWORK SETUP ===
echo "🌐 Setting up network infrastructure..."

# Check if PostgreSQL VNet exists (should be created by Terraform)
if ! az network vnet show --name "$VNET_NAME" --resource-group "$VNET_RESOURCE_GROUP" > /dev/null 2>&1; then
  echo "❌ PostgreSQL VNet not found. Please apply Terraform first:"
  echo "   cd /Users/pedroafonso/dev/addup/infra-shared-services"
  echo "   terraform apply"
  exit 1
fi

# Create Container App subnet in the PostgreSQL VNet
if ! az network vnet subnet show --name "$CONTAINERAPP_SUBNET" --vnet-name "$VNET_NAME" --resource-group "$VNET_RESOURCE_GROUP" > /dev/null 2>&1; then
  echo "🏗️  Creating Container App subnet in PostgreSQL VNet..."
  az network vnet subnet create \
    --name "$CONTAINERAPP_SUBNET" \
    --resource-group "$VNET_RESOURCE_GROUP" \
    --vnet-name "$VNET_NAME" \
    --address-prefix 10.1.2.0/23 \
    --delegations Microsoft.App/environments
fi

# Create Container Apps Environment with VNet integration if it doesn't exist
if ! az containerapp env show --name "$CONTAINER_ENV_NAME" --resource-group "$RESOURCE_GROUP" > /dev/null 2>&1; then
  echo "🏢 Creating Container Apps Environment with VNet integration..."
  SUBNET_ID="/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$VNET_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME/subnets/$CONTAINERAPP_SUBNET"
  
  az containerapp env create \
    --name "$CONTAINER_ENV_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --infrastructure-subnet-resource-id "$SUBNET_ID" \
    --internal-only false
fi

# === DEPLOY CONTAINER APP ===
echo "🚀 Deploying container app '$APP_NAME' from '$APP_SOURCE'..."

az containerapp up \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --source "$APP_SOURCE" \
  --target-port "$TARGET_PORT" \
  --ingress external \
  --environment "$CONTAINER_ENV_NAME" \
  --verbose

echo "✅ Deployment complete."

# === GET URL ===
APP_URL=$(az containerapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "🌍 App available at: https://$APP_URL"