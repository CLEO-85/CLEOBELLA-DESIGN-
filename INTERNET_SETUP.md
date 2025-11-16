# 🌐 Making Your Website Internet-Based

Your CLEOBELLA DESING website is now ready to run on the internet! Follow these steps:

## Step 1: Start the Server

Open PowerShell in this folder and run:

```powershell
node server.js
```

Or use npm:

```powershell
npm start
```

You should see:
```
🎉 CLEOBELLA DESING Website is LIVE!

📱 Local Access:     http://localhost:3000
🌐 Network Access:   http://<YOUR_IP_ADDRESS>:3000

✨ Press Ctrl+C to stop the server
```

## Step 2: Access Your Website

### Locally (Same Computer):
- Open browser and go to: **http://localhost:3000**

### From Other Devices (Same Network):
1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (usually starts with 192.168.x.x)

2. From another device on the same network, go to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: http://192.168.1.100:3000

## Step 3: Share Globally (Internet-Wide Access)

To make your website accessible from anywhere on the internet, use one of these services:

### Option A: Ngrok (Easiest)
1. Download from: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. You'll get a public URL like: `https://abc123.ngrok.io`
4. Share this link with anyone

### Option B: Cloudflare Tunnel (Free & Secure)
1. Install Wrangler: `npm install -g wrangler`
2. Run: `wrangler tunnel --url http://localhost:3000`
3. Get a free public URL

### Option C: Host on Free Platforms
- **Vercel**: `npm i -g vercel` → `vercel deploy`
- **Netlify**: Upload files directly to Netlify
- **GitHub Pages**: Push to GitHub and enable Pages

## Troubleshooting

**Port 3000 already in use?**
```powershell
# Change PORT in server.js or use different port:
$env:PORT=5000; node server.js
```

**Files not loading?**
- Make sure all files (index.html, styles.css, script.js, images/, videos/) are in the same folder
- Check browser console (F12) for errors

**Images/Videos not showing?**
- Ensure image/video files exist in `images/` and `videos/` folders
- Check file paths in script.js (lines 12-48)

## Current Features Working Over Internet

✅ Product showcase with images & videos
✅ Shopping cart functionality
✅ Checkout via email & WhatsApp
✅ Customer reviews (saved locally)
✅ Comments section (saved locally)
✅ Newsletter signup (EmailJS integration)
✅ Responsive design (works on mobile & desktop)

## Next Steps

- **Custom Domain**: Buy domain from GoDaddy, Namecheap, etc., and point to your server
- **Database**: Add backend to store data permanently (MongoDB, Firebase, etc.)
- **Payment**: Integrate payment gateway (Stripe, Paypal, Flutterwave, etc.)
- **Email**: Configure SMTP server for direct email sending

Enjoy your internet-based website! 🚀
