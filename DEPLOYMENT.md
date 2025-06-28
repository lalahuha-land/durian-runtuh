# 🚀 Deployment Guide - Netlify + PostgreSQL

This guide will help you deploy DurianRuntuh to Netlify with a PostgreSQL database.

## 📋 Prerequisites

- GitHub account
- Netlify account (free)
- PostgreSQL database (Supabase, Railway, or Neon)

## 🗄️ Step 1: Set up PostgreSQL Database

### Option A: Supabase (Recommended - Free Tier)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub
   - Create a new project

2. **Get Database Connection String**
   - Go to Settings → Database
   - Copy the connection string
   - Format: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

3. **Enable Row Level Security (Optional)**
   - Go to Authentication → Policies
   - Enable RLS on tables if needed

### Option B: Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Create a new project

2. **Add PostgreSQL Service**
   - Click "New Service" → "Database" → "PostgreSQL"
   - Copy the connection string from the service

### Option C: Neon

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub
   - Create a new project

2. **Get Connection String**
   - Copy the connection string from the dashboard

## 🌐 Step 2: Deploy to Netlify

### Method A: Deploy from GitHub (Recommended)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Click "Deploy site"

### Method B: Deploy from Local Files

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

## ⚙️ Step 3: Configure Environment Variables

In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add these variables:

   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   ADMIN_PASSWORD=your-secure-admin-password
   DATABASE_URL=your-postgresql-connection-string
   ```

3. **Important:** Use strong, unique values for JWT_SECRET and ADMIN_PASSWORD

## 🔧 Step 4: Update Netlify Functions (if needed)

The project already includes Netlify Functions in the `netlify/functions/` directory:

- `adminLogin.js` - Admin authentication
- `getAllStalls.js` - Get all stalls (admin)
- `addStall.js` - Add new stall (admin)
- `editStall.js` - Edit stall (admin)
- `deleteStall.js` - Delete stall (admin)

These functions will automatically be deployed with your site.

## 🧪 Step 5: Test Your Deployment

1. **Visit your Netlify site**
   - Your site will be available at `https://your-site-name.netlify.app`

2. **Test Public Features**
   - Home page loads correctly
   - Map displays stalls
   - Filtering works

3. **Test Admin Features**
   - Go to `https://your-site-name.netlify.app/admin-login`
   - Login with admin credentials
   - Test CRUD operations

4. **Check Database Connection**
   - Add a test stall
   - Verify it appears on the map
   - Check your database to confirm data is saved

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Netlify build logs
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version (18+)

2. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check database is accessible from Netlify
   - Ensure SSL is enabled for production

3. **Functions Not Working**
   - Check Netlify Functions logs
   - Verify environment variables are set
   - Test functions locally with `netlify dev`

4. **CORS Issues**
   - Functions should handle CORS automatically
   - Check browser console for errors

### Debug Commands:

```bash
# Test locally with Netlify Functions
netlify dev

# Check function logs
netlify functions:list

# Invoke function locally
netlify functions:invoke getAllStalls
```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Restrict database access

3. **Admin Access**
   - Use strong admin password
   - Consider IP restrictions
   - Monitor admin access logs

## 📈 Monitoring

1. **Netlify Analytics**
   - Enable in Site settings
   - Monitor traffic and performance

2. **Database Monitoring**
   - Check connection pool usage
   - Monitor query performance
   - Set up alerts for errors

3. **Error Tracking**
   - Check Netlify Function logs
   - Monitor browser console errors
   - Set up error reporting

## 🚀 Going Live

Once everything is working:

1. **Custom Domain** (Optional)
   - Add custom domain in Netlify settings
   - Configure DNS records

2. **SSL Certificate**
   - Netlify provides free SSL
   - Automatically enabled

3. **Performance Optimization**
   - Enable asset optimization
   - Configure caching headers
   - Monitor Core Web Vitals

## 📞 Support

If you encounter issues:

1. Check Netlify documentation
2. Review PostgreSQL provider docs
3. Check browser console for errors
4. Review Netlify Function logs

---

**🎉 Congratulations!** Your DurianRuntuh app is now live on Netlify with PostgreSQL! 