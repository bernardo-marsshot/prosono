#!/usr/bin/env bash

set -euo pipefail

# === CONFIG ===
RESOURCE_GROUP="rg-marsshot-prosono-mvp-dev"
LOCATION="westeurope"
VNET_NAME="vnet-prosono-mvp-dev"
DB_SUBNET="snet-db-prosono-mvp-dev"
POSTGRES_SERVER="postgres-addup-prod"
POSTGRES_RESOURCE_GROUP="rg-addup-shared-services-prod"
PRIVATE_ENDPOINT_NAME="pe-psql-prosono-mvp-dev"
PRIVATE_DNS_ZONE="privatelink.postgres.database.azure.com"

echo "🔗 Setting up private endpoint for PostgreSQL..."

# Get the PostgreSQL server resource ID
POSTGRES_ID=$(az postgres flexible-server show \
  --name "$POSTGRES_SERVER" \
  --resource-group "$POSTGRES_RESOURCE_GROUP" \
  --query "id" \
  --output tsv)

# Get the subnet ID
SUBNET_ID="/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME/subnets/$DB_SUBNET"

# Create private DNS zone if it doesn't exist
if ! az network private-dns zone show --name "$PRIVATE_DNS_ZONE" --resource-group "$RESOURCE_GROUP" > /dev/null 2>&1; then
  echo "🌐 Creating private DNS zone..."
  az network private-dns zone create \
    --name "$PRIVATE_DNS_ZONE" \
    --resource-group "$RESOURCE_GROUP"
fi

# Link DNS zone to VNet
echo "🔗 Linking DNS zone to VNet..."
az network private-dns link vnet create \
  --name "link-$VNET_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --zone-name "$PRIVATE_DNS_ZONE" \
  --virtual-network "$VNET_NAME" \
  --registration-enabled false

# Create private endpoint
echo "🔒 Creating private endpoint..."
az network private-endpoint create \
  --name "$PRIVATE_ENDPOINT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --subnet "$SUBNET_ID" \
  --private-connection-resource-id "$POSTGRES_ID" \
  --group-ids postgresqlServer \
  --connection-name "connection-postgres"

# Create private DNS zone group
echo "🏷️  Creating DNS zone group..."
az network private-endpoint dns-zone-group create \
  --name "default" \
  --endpoint-name "$PRIVATE_ENDPOINT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --private-dns-zone "$PRIVATE_DNS_ZONE" \
  --zone-name "postgres"

echo "✅ Private endpoint setup complete!"
echo "💡 Your Container App can now connect to PostgreSQL using:"
echo "   postgresql://username:password@postgres-addup-prod.postgres.database.azure.com:5432/postgres"