# GitHub Actions Secrets Setup

This document explains how to set up the required secrets for the GitHub Actions deployment workflow.

## Required Secrets

Add these secrets to your GitHub repository at `Settings > Secrets and variables > Actions`:

### Azure Authentication
- `AZURE_CLIENT_ID` - Application (client) ID from Azure App Registration
- `AZURE_TENANT_ID` - Directory (tenant) ID from Azure
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID

### How to Get These Values

#### Option 1: Use the setup script (Recommended)
Run the setup script from the infrastructure repository:
```bash
cd /path/to/infra-marsshot-prosono-mvp
./setup-github-actions.sh <your-github-username> <repository-name>
```

#### Option 2: Manual setup
1. **Create Azure App Registration:**
   ```bash
   az ad app create --display-name "GitHub-Actions-marsshot-prosono-mvp"
   ```

2. **Create Service Principal:**
   ```bash
   az ad sp create --id <app-id-from-step-1>
   ```

3. **Configure OIDC federated credentials:**
   ```bash
   az ad app federated-credential create --id <app-id> --parameters '{
     "name": "github-actions-marsshot-prosono-mvp",
     "issuer": "https://token.actions.githubusercontent.com",
     "subject": "repo:<username>/<repo>:ref:refs/heads/main",
     "audiences": ["api://AzureADTokenExchange"]
   }'
   ```

4. **Grant permissions:**
   ```bash
   az role assignment create \
     --assignee <app-id> \
     --role Contributor \
     --scope "/subscriptions/<subscription-id>"
   ```

5. **Get the required values:**
   ```bash
   # Client ID (from step 1)
   echo "AZURE_CLIENT_ID: <app-id>"
   
   # Tenant ID
   az account show --query tenantId -o tsv
   
   # Subscription ID
   az account show --query id -o tsv
   ```

## Workflow Behavior

The workflow will:
1. Trigger on pushes to `main` branch
2. Build the Docker container using the Dockerfile in the repository root
3. Push the image to Azure Container Registry
4. Deploy to Azure Container Apps
5. Run health checks

## Infrastructure Requirements

The workflow expects the following Azure resources to exist (created by Terraform):
- Resource Group: `rg-marsshot-prosono-mvp-prod`
- Azure Container Registry: `acrmarsshotprosonoprod`
- Container App Environment
- PostgreSQL Flexible Server
- Network and security configurations

## Security Notes

- Uses OIDC authentication (no long-lived secrets)
- Database passwords should be stored in Azure Key Vault (not hardcoded)
- Container images are scanned for vulnerabilities
- All resources use managed identities where possible