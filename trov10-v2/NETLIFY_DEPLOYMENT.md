# Netlify Deployment Guide for Trov10-v2

## 🚀 Quick Deployment Steps

### 1. Connect to Netlify
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub/GitLab/Bitbucket repository
4. Select your `trov10-v2` repository

### 2. Configure Build Settings
Netlify will automatically detect the settings from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18

### 3. Set Environment Variables
In Netlify Dashboard > Site Settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Deploy
Click "Deploy site" and wait for the build to complete.

## 📁 Files Created for Netlify

### `netlify.toml`
- Build configuration
- Redirect rules for SPA routing
- Security headers
- Cache optimization

### `public/_redirects`
- Client-side routing support
- API route handling
- Fallback to index.html

### `next.config.mjs`
- Static export enabled
- Image optimization disabled for static hosting
- Trailing slash support

### `netlify-env.example`
- Template for environment variables
- Copy values to Netlify dashboard

## 🔧 Configuration Details

### Build Process
1. `npm run build` creates static files in `out/` directory
2. Netlify serves files from `out/` directory
3. `_redirects` file handles client-side routing

### Security Headers
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### Cache Optimization
- Static assets cached for 1 year
- JS/CSS files cached with immutable flag
- Font files cached for performance

## 🌐 Custom Domain Setup

1. In Netlify Dashboard > Domain Settings
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

## 📊 Performance Features

- **Static Generation**: All pages pre-rendered
- **CDN**: Global content delivery network
- **Compression**: Automatic gzip/brotli compression
- **Image Optimization**: Optimized for web delivery

## 🔄 Continuous Deployment

- **Automatic Deploys**: Push to main branch triggers deploy
- **Preview Deploys**: Pull requests get preview URLs
- **Rollback**: Easy rollback to previous versions

## 🐛 Troubleshooting

### Build Failures
- Check Node.js version (should be 18)
- Verify all dependencies are in package.json
- Check for TypeScript errors

### Routing Issues
- Ensure `_redirects` file is in `public/` directory
- Verify `netlify.toml` redirect rules

### Environment Variables
- Double-check variable names match exactly
- Ensure no trailing spaces in values
- Test locally with same variables

## 📈 Analytics & Monitoring

Netlify provides built-in analytics:
- Page views and unique visitors
- Build times and deploy history
- Form submissions (if using Netlify Forms)

## 🔗 Useful Links

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)
