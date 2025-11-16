# 🚀 CLEOBELLA DESING Website - Quick Start

## ✅ Your Website is Ready!

All files are in: `C:\Users\USER\Desktop\New folder (5)`

## 📂 File Structure

```
index.html           ← Main website file
styles.css           ← All styling and layout
script.js            ← All functionality
README.md            ← Full documentation
NEWSLETTER_SETUP.md  ← Email setup guide

images/              ← Your product images
  product1.jpg
  product2.jpg
  product3.jpg
  product4.jpg
  product5.jpg
  product6.jpg

videos/              ← Your product videos
  video1.mp4
  video2.mp4
```

## 🎯 How to Use

### 1. Open the Website
- Right-click on `index.html`
- Select "Open with Browser" or double-click
- Or drag it into your browser window

### 2. Test All Features
- ✅ Browse products
- ✅ Add items to cart
- ✅ Checkout (sends to email/WhatsApp)
- ✅ Leave comments
- ✅ Subscribe to newsletter
- ✅ View FAQs & Sizing Guide

### 3. Newsletter Setup (Important!)
When someone subscribes:
1. You'll get an email from Formspree asking to verify
2. Click the verification link
3. After that, all subscriptions go straight to your inbox

**See `NEWSLETTER_SETUP.md` for detailed instructions**

## 🎨 Customization Guide

### Change Product Names & Prices
**File**: `script.js` (lines 10-44)

Edit the `products` array with your items:
```javascript
{
  id: 'p1',
  title: 'Your Product Name',
  price: 25000,  // in Nigerian Naira
  media: { type: 'image', src: 'images/product1.jpg' }
}
```

### Add Videos
**File**: `script.js` (in products array)

```javascript
{
  id: 'p3',
  title: 'Video Product Name',
  price: 30000,
  media: { 
    type: 'video', 
    src: 'videos/video1.mp4', 
    poster: 'images/product3.jpg'  // Preview image
  }
}
```

### Update Contact Info
**File**: `script.js` (lines 3-6)

```javascript
const SHOP_EMAIL = 'your-email@gmail.com';
const SHOP_WHATSAPP_LOCAL = 'your local number';
const SHOP_WHATSAPP_INT = 'country code + number';
```

### Add Customer Reviews
**File**: `script.js` (lines 205-209)

```javascript
const sampleReviews = [
  { stars: '⭐⭐⭐⭐⭐', text: 'Amazing quality!', author: 'Customer Name' },
  // Add more...
];
```

### Update FAQs
**File**: `index.html` (search for "FAQ")

Add/edit FAQ items:
```html
<div class="faq-item">
  <h4>Your Question?</h4>
  <p>Your answer here.</p>
</div>
```

### Update Social Media Links
**File**: `index.html` (search for "Social")

```html
<a href="https://instagram.com/yourprofile" class="social-btn">📸 Instagram</a>
```

### Update Newsletter Email
**File**: `index.html` (line 109)

Change the form action to a different Formspree endpoint or email service

## 📱 Mobile Responsive
Your site works perfectly on:
- ✅ Phones
- ✅ Tablets
- ✅ Desktops

Test by resizing your browser window

## 🌐 How to Deploy (Share Online)

### Option 1: Free Hosting (Netlify)
1. Go to netlify.com
2. Drag & drop your entire folder
3. Get a free URL instantly

### Option 2: Free Hosting (Vercel)
1. Go to vercel.com
2. Upload your files
3. Get a live link

### Option 3: GitHub Pages
1. Create a GitHub account
2. Upload files to a repository
3. Enable GitHub Pages
4. Get a free GitHub domain

## 💾 Backup Your Work
Keep a copy of your files:
1. Copy the entire "New folder (5)" folder
2. Store it in cloud (Google Drive, OneDrive)
3. Or on USB drive

## 🆘 Troubleshooting

**Images not showing?**
- Check that image files are in `images/` folder with exact filenames

**Videos not playing?**
- Make sure video files are in `videos/` folder
- Use MP4 format for best compatibility

**Newsletter not working?**
- See `NEWSLETTER_SETUP.md` for email verification steps

**Cart not working?**
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser

**Prices not in Naira?**
- Check that you're using the latest version
- Refresh page (Ctrl+F5)

## 📞 Contact & Support

**Brand**: CLEOBELLA DESING
**Email**: ijerheanthonia@gmail.com
**Phone/WhatsApp**: +243 8165712215 (08165712215 locally)
**Country**: Democratic Republic of Congo

## 🎉 You're All Set!

Your beautiful, professional fashion website is ready to showcase CLEOBELLA DESING!

**Next Steps:**
1. Test all features locally
2. Customize with your content
3. Deploy to free hosting
4. Share with customers!

Enjoy! 💚
