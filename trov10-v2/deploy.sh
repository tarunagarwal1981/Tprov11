#!/bin/bash
# Deployment script for trov10-v2

echo "🚀 Preparing trov10-v2 for Netlify deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the trov10-v2 directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ -d "out" ]; then
    echo "✅ Build successful! Static files generated in 'out' directory."
    echo "📁 Build output:"
    ls -la out/
    echo ""
    echo "🌐 Ready for Netlify deployment!"
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub/GitLab/Bitbucket"
    echo "2. Connect repository to Netlify"
    echo "3. Set base directory to 'trov10-v2'"
    echo "4. Add environment variables in Netlify dashboard"
    echo "5. Deploy!"
else
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi
