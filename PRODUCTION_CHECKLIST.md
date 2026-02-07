# 🚀 Production Configuration Checklist

## ✅ Code Changes (COMPLETED)
- [x] OAuth buttons use `VITE_API_URL` environment variable (not hardcoded localhost)
- [x] GitHub strategy uses `ENV` object (not process.env)
- [x] Backend CORS configured to accept `ENV.CORS_ORIGIN`
- [x] Cookie sameSite set to "none" for production cross-domain auth
- [x] Health check endpoints created for Azure monitoring

## 📋 Environment Variables

### Frontend (Vercel)
✅ **Already Added as GitHub Secret:**
- `VITE_API_URL` → Must point to: `https://resumer-backend-fyapfggzacejf2dv.centralindia-01.azurewebsites.net/api/v1`

### Backend (Azure App Service)
🔴 **CRITICAL - Must Configure in Azure Portal:**

Navigate to: **Azure Portal → Resumer-backend → Configuration → Application settings**

Add these settings:

#### Core Configuration
```
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

#### Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumer?retryWrites=true&w=majority
```

#### Cloudinary (File Storage)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Google Gemini AI
```
GEMINI_API_KEY=your_gemini_api_key
```

#### JWT Secrets
```
ACCESS_TOKEN_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_SECRET=<generate different secret>
REFRESH_TOKEN_EXPIRY=10d
```

#### OAuth: Google
```
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://resumer-backend-fyapfggzacejf2dv.centralindia-01.azurewebsites.net/api/v1/auth/google/callback
```

#### OAuth: GitHub
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://resumer-backend-fyapfggzacejf2dv.centralindia-01.azurewebsites.net/api/v1/auth/github/callback
```

#### Razorpay (Payment Gateway)
```
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

#### Email (SMTP)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM=noreply@resumer.com
ADMIN_EMAIL=bhaveshsolminde@gmail.com
```

## 🔐 OAuth Provider Configuration

### Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client ID
3. Add **Authorized JavaScript origins:**
   - `https://your-vercel-domain.vercel.app`
   - `https://resumer-backend-fyapfggzacejf2dv.centralindia-01.azurewebsites.net`
4. Add **Authorized redirect URIs:**
   - `https://resumer-backend-fyapfggzacejf2dv.centralindia-01.azurewebsites.net/api/v1/auth/google/callback`

### GitHub OAuth App
1. Go to: https://github.com/settings/developers
2. Edit your OAuth App
3. Set **Homepage URL:** `https://your-vercel-domain.vercel.app`
4. Set **Authorization callback URL:** 
   - `https://resumer-backend-fyapfggzacejf2dv.centralindia-01.azurewebsites.net/api/v1/auth/github/callback`

## 🧪 Testing Checklist

After deployment, verify:

- [ ] Health endpoint responds: `https://resumer-backend-fyapfggzacejf2dv.centralindia-01.azurewebsites.net/api/v1/health`
- [ ] Frontend loads without errors
- [ ] Google OAuth login redirects to backend (check URL in browser)
- [ ] GitHub OAuth login redirects to backend (check URL in browser)
- [ ] Login successfully sets cookies and redirects back to frontend
- [ ] API calls from frontend reach Azure backend (check Network tab)
- [ ] CORS allows requests from Vercel domain

## 🎯 Current Status

**Frontend:** Ready to deploy once Vercel authentication is complete
**Backend:** Waiting for Azure environment variables configuration
**OAuth:** Needs configuration in Google Cloud Console and GitHub

## 🚨 Common Issues

### Issue: "Not allowed by CORS"
**Fix:** Ensure `CORS_ORIGIN` in Azure matches your Vercel domain exactly (no trailing slash)

### Issue: OAuth redirects to localhost
**Fix:** ✅ FIXED - OAuth buttons now use `VITE_API_URL`

### Issue: Cookies not being set
**Fix:** ✅ FIXED - sameSite set to "none" with secure: true

### Issue: "Cannot read ENV.GITHUB_CLIENT_ID"
**Fix:** ✅ FIXED - GitHub strategy now uses ENV object

## 📝 Next Steps

1. **Configure Azure Environment Variables** (all 25+ variables above)
2. **Update OAuth Providers** (Google Cloud Console + GitHub)
3. **Get Vercel Frontend URL** (after first deployment)
4. **Update Backend CORS_ORIGIN** with Vercel URL
5. **Test OAuth flows** end-to-end
6. **Monitor Azure logs** for any runtime errors
