# Netlify Deployment Guide for Nested Folder Structure

## 🚀 Quick Deployment Steps for trov10-v2

### 1. Repository Structure
Your repository structure should look like this:
```
your-repo/
├── trov10-v2/          ← Your Next.js project is here
│   ├── app/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── netlify.toml     ← Updated with base directory
│   └── ...
└── other-files/         ← Any other files in root
```

### 2. Connect to Netlify
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub/GitLab/Bitbucket repository
4. Select your repository

### 3. Configure Build Settings
Netlify will automatically detect settings from `netlify.toml`:

**✅ Automatic Detection:**
- **Base directory**: `trov10-v2` (specified in netlify.toml)
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18

**🔧 Manual Override (if needed):**
If automatic detection fails, manually set:
- **Base directory**: `trov10-v2`
- **Build command**: `npm run build`
- **Publish directory**: `trov10-v2/out`

### 4. Set Environment Variables
In Netlify Dashboard > Site Settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Deploy
Click "Deploy site" and wait for the build to complete.

## 📁 Key Configuration Changes

### Updated `netlify.toml`
```toml
[build]
  base = "trov10-v2"        ← This tells Netlify where your project is
  command = "npm run build"
  publish = "out"
```

### Build Process
1. Netlify changes to `trov10-v2/` directory
2. Runs `npm run build` from that directory
3. Publishes files from `trov10-v2/out/` directory
4. Serves your site from the correct location

## 🔧 Alternative Deployment Methods

### Method 1: Manual Directory Selection
1. In Netlify Dashboard > Site Settings > Build & Deploy
2. Set **Base directory** to: `trov10-v2`
3. Set **Build command** to: `npm run build`
4. Set **Publish directory** to: `trov10-v2/out`

### Method 2: Move Project to Root
If you prefer, you can move your project to the repository root:
```bash
# Move all files from trov10-v2/ to root
mv trov10-v2/* .
mv trov10-v2/.* . 2>/dev/null || true
rmdir trov10-v2
```

Then update `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "out"
  # Remove the base = "trov10-v2" line
```

## 🐛 Troubleshooting

### Build Failures
**Error**: "Cannot find package.json"
**Solution**: Ensure `base = "trov10-v2"` is set in netlify.toml

**Error**: "Build command failed"
**Solution**: Check that npm dependencies are installed in trov10-v2/

### Directory Issues
**Error**: "Publish directory not found"
**Solution**: Verify `publish = "out"` points to correct location

**Error**: "Base directory not found"
**Solution**: Ensure trov10-v2/ exists in your repository

### Environment Variables
**Error**: "Environment variables not loading"
**Solution**: Variables are set at site level, not directory level

## 📊 Expected Build Output

### Successful Build Log:
```
Build command: npm run build
Base directory: trov10-v2
Publish directory: trov10-v2/out

✓ Installing dependencies
✓ Running build command
✓ Deploying to CDN
```

### File Structure After Build:
```
trov10-v2/out/
├── index.html
├── auth/
│   ├── login/
│   └── register/
├── _next/
│   └── static/
└── _redirects
```

## 🌐 Custom Domain Setup

1. In Netlify Dashboard > Domain Settings
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

## 📈 Performance Features

- **Static Generation**: All pages pre-rendered
- **CDN**: Global content delivery network
- **Compression**: Automatic gzip/brotli compression
- **Image Optimization**: Optimized for web delivery

## 🔄 Continuous Deployment

- **Automatic Deploys**: Push to main branch triggers deploy
- **Preview Deploys**: Pull requests get preview URLs
- **Rollback**: Easy rollback to previous versions

## 🔗 Useful Links

- [Netlify Base Directory Documentation](https://docs.netlify.com/configure-builds/overview/#definitions)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)

## ✅ Verification Checklist

- [ ] Repository contains `trov10-v2/` folder
- [ ] `netlify.toml` has `base = "trov10-v2"`
- [ ] Environment variables set in Netlify dashboard
- [ ] Build command runs successfully
- [ ] Site deploys without errors
- [ ] All pages accessible
- [ ] Authentication pages work
- [ ] Custom domain configured (if applicable)
