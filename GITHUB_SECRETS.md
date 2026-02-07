# 🔐 GitHub Secrets Quick Reference

Copy this checklist when setting up GitHub Secrets for CI/CD.

## 📍 Location
Repository → Settings → Secrets and variables → Actions → Repository secrets

---

## ✅ Required Secrets

### Frontend Deployment (Vercel)

| Secret Name | How to Get | Example Value |
|-------------|-----------|---------------|
| `VERCEL_TOKEN` | [Vercel Account → Tokens](https://vercel.com/account/tokens) → Create Token | `xxxxxxxAbCdEfGh1234567890` |
| `VERCEL_ORG_ID` | Run `vercel link` in frontend folder → Check `.vercel/project.json` | `team_aBcDeFgHiJkLmNoPqRsTuVwXyZ` |
| `VERCEL_PROJECT_ID` | Run `vercel link` in frontend folder → Check `.vercel/project.json` | `prj_aBcDeFgHiJkLmNoPqRsTuVwXyZ` |
| `VITE_API_URL` | Your Azure backend URL + `/api/v1` | `https://resumer-backend.azurewebsites.net/api/v1` |

### Backend Deployment (Azure)

| Secret Name | How to Get | Example Value |
|-------------|-----------|---------------|
| `AZURE_WEBAPP_NAME` | Your Azure App Service name (from Azure Portal) | `resumer-backend` |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Azure Portal → App Service → Overview → Download publish profile (paste ENTIRE XML file) | `<publishData>...</publishData>` (multi-line XML) |

---

## 🎯 Setup Commands

### Get Vercel Project Info:
```bash
# Install Vercel CLI (if not installed)
pnpm add -g vercel

# Login
vercel login

# Link project (run from frontend folder)
cd frontend
vercel link

# View project info
cat .vercel/project.json
```

Output will show:
```json
{
  "orgId": "team_XXX",
  "projectId": "prj_XXX"
}
```

### Get Azure Publish Profile:
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service
3. Click "Overview" in left sidebar
4. Click "Get publish profile" or "Download publish profile"
5. Open downloaded XML file in text editor
6. Copy **ALL contents** (including `<?xml` declaration)
7. Paste in GitHub Secret `AZURE_WEBAPP_PUBLISH_PROFILE`

---

## ✔️ Verification

After adding all secrets, you should see **6 secrets** in your repository:

```
✓ VERCEL_TOKEN
✓ VERCEL_ORG_ID
✓ VERCEL_PROJECT_ID
✓ VITE_API_URL
✓ AZURE_WEBAPP_NAME
✓ AZURE_WEBAPP_PUBLISH_PROFILE
```

---

## 🧪 Test Workflows

After adding secrets:

1. Go to **Actions** tab in GitHub
2. Select **Deploy Frontend to Vercel** workflow
3. Click **Run workflow** → **Run workflow**
4. Watch it execute (should succeed if secrets are correct)
5. Repeat for **Deploy Backend to Azure** workflow

---

## 🚨 Common Mistakes

❌ **Copying only part of publish profile**
✅ Copy the ENTIRE XML file (starts with `<?xml`, ends with `</publishData>`)

❌ **Using test Vercel token instead of production token**
✅ Generate token specifically for GitHub Actions

❌ **Wrong API URL format**
✅ Must end with `/api/v1` (no trailing slash after)

❌ **Secrets with extra spaces or newlines**
✅ Trim whitespace before/after secret values

---

## 🔄 Updating Secrets

To update a secret:
1. Repository → Settings → Secrets and variables → Actions
2. Click on the secret name
3. Click "Update secret"
4. Paste new value
5. Click "Update secret"

**Note:** You cannot view existing secret values (only update/delete)

---

## 📖 Related Documentation

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide
- See [backend/.env.example](./backend/.env.example) for backend environment variables
- See [frontend/.env.example](./frontend/.env.example) for frontend environment variables
