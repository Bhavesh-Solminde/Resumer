# 🚀 Deployment Guide: Resumer (Monorepo)

Complete guide for deploying **Resumer** frontend to Vercel and backend to Azure App Service with automated CI/CD through GitHub Actions.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Vercel Frontend Deployment](#vercel-frontend-deployment)
4. [Azure Backend Deployment](#azure-backend-deployment)
5. [GitHub Secrets Configuration](#github-secrets-configuration)
6. [OAuth Provider Setup](#oauth-provider-setup)
7. [Email Configuration](#email-configuration)
8. [Payment Setup (Razorpay)](#payment-setup-razorpay)
9. [Testing Deployment](#testing-deployment)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting deployment, ensure you have:

- [ ] **GitHub repository** with your code
- [ ] **Vercel account** (free tier works)
- [ ] **Azure account** with active subscription
- [ ] **MongoDB Atlas** account (free tier M0 works)
- [ ] **Google Cloud Console** account (for OAuth)
- [ ] **GitHub Developer** settings access (for OAuth)
- [ ] **Razorpay account** (if using payments)
- [ ] **SMTP email service** (Gmail, SendGrid, etc.)

---

## 🗄️ MongoDB Atlas Setup

### 1. Create Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project: "Resumer Production"
3. Build a cluster (FREE M0 tier is sufficient)
4. Choose your preferred cloud provider and region

### 2. Configure Security
1. **Database Access:**
   - Go to Database Access → Add New Database User
   - Authentication Method: Password
   - Username: `resumer-prod`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Atlas admin" or "Read and write to any database"

2. **Network Access:**
   - Go to Network Access → Add IP Address
   - Add: `0.0.0.0/0` (Allow access from anywhere - required for Azure)
   - Click Confirm

### 3. Get Connection String
1. Go to Database → Connect
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string:
   ```
   mongodb+srv://resumer-prod:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `mongodb+srv://...mongodb.net/resumer?retryWrites=true&w=majority`

---

## 🎨 Vercel Frontend Deployment

### 1. Install Vercel CLI (Optional)
```bash
pnpm add -g vercel
```

### 2. Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Configure Project:**
   - **Framework Preset:** Other (We use custom build command)
   - **Root Directory:** `frontend`
   - **Build Command:** Leave empty (uses vercel.json)
   - **Output Directory:** `dist`
   - **Install Command:** Leave empty (uses vercel.json)

### 3. Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.azurewebsites.net/api/v1` | Production |

**Note:** Replace `your-backend` with your actual Azure App Service name (see Azure section below).

### 4. Get Vercel Tokens (for GitHub Actions)
```bash
# Login to Vercel CLI
vercel login

# Link to your project
cd frontend
vercel link

# Get project info (creates .vercel folder)
cat .vercel/project.json
```

Copy these values:
- `projectId` → `VERCEL_PROJECT_ID`
- `orgId` → `VERCEL_ORG_ID`

Generate Vercel token:
1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Create new token: "GitHub Actions Resumer"
3. Copy token → `VERCEL_TOKEN`

### 5. Configure Custom Domain (Optional)
1. Go to Vercel Project → Settings → Domains
2. Add your domain: `resumer.com` or `www.resumer.com`
3. Update DNS records at your domain provider:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`
4. Wait for DNS propagation (can take up to 48 hours)

---

## ☁️ Azure Backend Deployment

### 1. Create Azure App Service

#### Via Azure Portal:
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Web App"
3. **Configure:**
   - **Subscription:** Your subscription
   - **Resource Group:** Create new → "resumer-production"
   - **Name:** `resumer-backend` (must be globally unique!)
     - Final URL: `https://resumer-backend.azurewebsites.net`
   - **Publish:** Code
   - **Runtime stack:** Node 20 LTS
   - **Operating System:** Linux
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Basic B1 (or F1 Free for testing)
4. Click "Review + Create" → "Create"

### 2. Configure App Service Settings
1. Go to your App Service → Configuration → Application settings
2. Click "New application setting" for EACH variable from `backend/.env.example`:

#### Required Environment Variables:
```bash
# Server
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://your-domain.vercel.app

# Database
MONGODB_URI=mongodb+srv://resumer-prod:password@cluster0.xxxxx.mongodb.net/resumer?retryWrites=true&w=majority

# Cloudinary (get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI (get from https://ai.google.dev/)
GEMINI_API_KEY=your_gemini_api_key

# JWT Secrets (generate random strings)
ACCESS_TOKEN_SECRET=<64-char-random-string>
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_SECRET=<64-char-random-string>
REFRESH_TOKEN_EXPIRY=10d

# OAuth Google (see OAuth section below)
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_CALLBACK_URL=https://resumer-backend.azurewebsites.net/api/v1/auth/google/callback

# OAuth GitHub (see OAuth section below)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_secret
GITHUB_CALLBACK_URL=https://resumer-backend.azurewebsites.net/api/v1/auth/github/callback

# Razorpay (see Payment section below)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email SMTP (see Email section below)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@resumer.com
ADMIN_EMAIL=admin@resumer.com
```

3. Click "Save" (app will restart)

**Generate JWT Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Enable HTTPS Only
1. Go to your App Service → Settings → Configuration
2. General settings tab
3. **HTTPS Only:** On
4. Click "Save"

### 4. Get Publish Profile (for GitHub Actions)
1. Go to your App Service → Overview
2. Click "Download publish profile" (downloads XML file)
3. Open the file and copy ENTIRE contents
4. Save as `AZURE_WEBAPP_PUBLISH_PROFILE` secret (see GitHub Secrets section)

---

## 🔐 GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### Required Secrets:

#### For Frontend (Vercel):
```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>
VITE_API_URL=https://resumer-backend.azurewebsites.net/api/v1
```

#### For Backend (Azure):
```
AZURE_WEBAPP_NAME=resumer-backend
AZURE_WEBAPP_PUBLISH_PROFILE=<entire-xml-content-from-publish-profile>
```

---

## 🔑 OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Resumer Production"
3. Enable APIs: "Google+ API"
4. Go to Credentials → Create Credentials → OAuth client ID
5. Application type: Web application
6. Name: "Resumer Production"
7. **Authorized JavaScript origins:**
   ```
   https://your-domain.vercel.app
   https://resumer-backend.azurewebsites.net
   ```
8. **Authorized redirect URIs:**
   ```
   https://resumer-backend.azurewebsites.net/api/v1/auth/google/callback
   ```
9. Click "Create"
10. Copy:
    - **Client ID** → `GOOGLE_CLIENT_ID`
    - **Client Secret** → `GOOGLE_CLIENT_SECRET`

### GitHub OAuth

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. **Application name:** Resumer Production
4. **Homepage URL:** `https://your-domain.vercel.app`
5. **Authorization callback URL:**
   ```
   https://resumer-backend.azurewebsites.net/api/v1/auth/github/callback
   ```
6. Click "Register application"
7. Click "Generate a new client secret"
8. Copy:
    - **Client ID** → `GITHUB_CLIENT_ID`
    - **Client Secret** → `GITHUB_CLIENT_SECRET`

---

## 📧 Email Configuration

### Option 1: Gmail SMTP

1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select app: Mail
   - Select device: Other (Custom name) → "Resumer Backend"
   - Click "Generate"
   - Copy the 16-character password

3. Environment Variables:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=<16-char-app-password>
   SMTP_FROM=noreply@resumer.com
   ADMIN_EMAIL=admin@resumer.com
   ```

### Option 2: SendGrid
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API key
3. Variables:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=<your-sendgrid-api-key>
   ```

---

## 💳 Payment Setup (Razorpay)

1. Sign up at [Razorpay](https://dashboard.razorpay.com/signup)
2. Complete KYC verification
3. Go to Settings → API Keys
4. Generate Live Keys (or use Test Keys for testing)
5. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

### Webhook Setup:
1. Go to Settings → Webhooks → Add New Webhook
2. Webhook URL:
   ```
   https://resumer-backend.azurewebsites.net/api/v1/payment/webhook
   ```
3. Events to track: `payment.captured`, `payment.failed`
4. Click "Create Webhook"
5. Copy **Webhook Secret** → `RAZORPAY_WEBHOOK_SECRET`

---

## ✅ Testing Deployment

### 1. Trigger Deployment

#### Auto-deploy (when CI/CD is set up):
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

#### Manual deploy:
- Go to GitHub → Actions → Select workflow → Run workflow

### 2. Monitor Deployment

#### Vercel:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Watch build logs in real-time
3. Once complete, visit your URL

#### Azure:
1. Go to Azure Portal → Your App Service → Deployment Center
2. Check deployment status
3. View logs in "Log stream"

### 3. Verify Health Endpoints
```bash
# Backend health check
curl https://resumer-backend.azurewebsites.net/api/v1/health

# Expected response:
{
  "uptime": 123.45,
  "message": "OK",
  "timestamp": 1738901234567,
  "environment": "production",
  "database": "connected"
}
```

### 4. Test Frontend
1. Visit your Vercel URL or custom domain
2. Check browser console for errors
3. Test features:
   - [ ] Login/Register
   - [ ] Google OAuth
   - [ ] GitHub OAuth
   - [ ] Resume upload
   - [ ] Resume analysis
   - [ ] Resume optimization
   - [ ] Payment flow

### 5. Test Cross-Domain Cookies
1. Open browser DevTools → Network tab
2. Login to your app
3. Check Response Headers for `Set-Cookie`:
   ```
   Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=None
   Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=None
   ```
4. Verify cookies are saved in Application tab → Cookies

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **CORS Errors**
**Symptom:** Browser console shows "CORS policy" errors

**Solution:**
- Verify `CORS_ORIGIN` in Azure matches your Vercel URL EXACTLY
- Check for trailing slashes (use `https://domain.com` NOT `https://domain.com/`)
- Ensure Azure app restarted after changing env vars

#### 2. **Cookies Not Saving**
**Symptom:** User logs in but immediately logged out

**Solution:**
- Verify both frontend and backend use HTTPS in production
- Check `sameSite: "none"` is set (we fixed this in code)
- Ensure `secure: true` for production cookies
- Check browser cookie settings (not blocking third-party cookies)

#### 3. **OAuth Redirect Errors**
**Symptom:** "Redirect URI mismatch" after OAuth login

**Solution:**
- Verify callback URLs EXACTLY match in:
  - Azure environment variables
  - Google Cloud Console authorized URIs
  - GitHub OAuth app settings
- URLs are case-sensitive and must include protocol (https://)

#### 4. **Build Failures (Monorepo)**
**Symptom:** GitHub Actions fails with "Cannot find module '@resumer/shared-types'"

**Solution:**
- Ensure shared-types builds BEFORE frontend/backend
- Check workflow builds shared-types first:
  ```yaml
  - name: Build shared types
    run: pnpm --filter @resumer/shared-types build
  ```

#### 5. **Azure App Not Starting**
**Symptom:** Azure shows "Application Error" or 503

**Solution:**
- Check Azure → Log stream for errors
- Verify Node version matches (Node 20 LTS)
- Ensure all required env vars are set
- Check MongoDB connection string is correct
- Verify `web.config` exists in backend folder

#### 6. **Database Connection Failed**
**Symptom:** Health endpoint shows `"database": "disconnected"`

**Solution:**
- Verify MongoDB Atlas IP allowlist includes `0.0.0.0/0`
- Check connection string format (includes `/resumer` database name)
- Verify username/password are correct (no special characters without encoding)
- Test connection locally with same connection string

#### 7. **Vercel Build Timeout**
**Symptom:** Build fails after 10 minutes

**Solution:**
- Optimize build command in `vercel.json`
- Use pnpm cache in GitHub Actions
- Consider upgrading Vercel plan for more build time

#### 8. **Payment Webhook Not Working**
**Symptom:** Payments succeed but credits not added

**Solution:**
- Verify webhook URL in Razorpay dashboard
- Check webhook secret matches `RAZORPAY_WEBHOOK_SECRET`
- View Azure logs during payment to see webhook POST

---

## 📊 Monitoring & Maintenance

### Application Insights (Azure)
1. Enable in Azure → Your App Service → Application Insights
2. Monitor:
   - Request rates
   - Response times
   - Failure rates
   - Dependencies (MongoDB, external APIs)

### Log Monitoring
```bash
# Azure logs (real-time)
az webapp log tail --name resumer-backend --resource-group resumer-production

# Vercel logs
vercel logs <deployment-url>
```

### Update Dependencies
```bash
# Check for updates
pnpm outdated

# Update all non-breaking
pnpm update

# Test locally
pnpm build
pnpm typecheck

# Deploy
git push origin main
```

---

## 🔄 Continuous Deployment Flow

### Normal Development Flow:
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit
3. Push and create PR to `main`
4. GitHub Actions runs type check
5. After PR merge to `main`:
   - Frontend workflow triggers (if frontend/** or shared-types/** changed)
   - Backend workflow triggers (if backend/** or shared-types/** changed)
6. Automated deployment to production

### Hotfix Flow:
1. Create hotfix branch from `main`
2. Fix critical issue
3. Push directly to `main` (or quick PR)
4. Deployment auto-triggers

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

## ✨ Success Checklist

After completing deployment, verify:

- [ ] Frontend accessible via Vercel URL or custom domain
- [ ] Backend health endpoint returns 200 OK
- [ ] MongoDB connection successful
- [ ] User registration/login works
- [ ] Google OAuth works
- [ ] GitHub OAuth works
- [ ] Resume upload works (Cloudinary)
- [ ] Resume analysis works (Gemini AI)
- [ ] Resume optimization works
- [ ] Payment flow works (Razorpay)
- [ ] Email notifications work
- [ ] CORS works (no console errors)
- [ ] Cookies persist across sessions
- [ ] GitHub Actions workflows run successfully
- [ ] All environment variables set correctly

---

**🎉 Congratulations! Your Resumer app is now deployed to production!**

For issues or questions, check the troubleshooting section or create an issue in the repository.
