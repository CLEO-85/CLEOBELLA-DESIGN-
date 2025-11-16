# CLEOBELLA DESING — Static Demo Site

This is a small static demo website for the fashion brand "CLEOBELLA DESING". It provides:

- A product listing with images and videos
- A shopping cart with add/remove functionality
- Checkout via email or WhatsApp
- Customer reviews section (sample testimonials)
- Comments section where customers can leave feedback (stored in browser)
- Modern, responsive design with animations

## Features

- **Product Listing**: Beautiful product grid with images and videos
- **Shopping Cart**: Add/remove items, adjust quantities
- **Checkout**: Email or WhatsApp order submission
- **Featured Collection**: Highlight your signature pieces with benefits list
- **Sizing Guide**: Three helpful cards with measurement tips and care instructions
- **Newsletter Signup**: Email subscription form with success message
- **FAQ Section**: 6 common customer questions answered
- **Social Media Links**: Connect on Instagram, Facebook, TikTok, Twitter
- **Customer Reviews**: Display of testimonials 
- **Comments Section**: Customers can leave comments (stored in your browser's localStorage)
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern Styling**: Elegant animations and gradients
- **Currency**: All prices displayed in Nigerian Naira (₦)

How to use
1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. Browse products and click "Add to cart".
3. Click the "Cart" button to open the cart, then "Checkout".
4. Fill in your name, email, phone and address.
5. Click "Send Order via Email" — your email client will open with the order details filled in and recipient set to ijerheanthonia@gmail.com.
6. Or click "Send via WhatsApp" which opens WhatsApp Web/Mobile with a pre-filled message.
7. Scroll down to explore:
   - **Featured Collection**: Your signature pieces with key benefits
   - **Sizing Guide**: Help customers measure correctly
   - **Newsletter**: Subscribe for updates
   - **FAQ**: Answer common questions
   - **Social Media**: Link to your social accounts
   - **Customer Reviews**: Testimonials section
   - **Comments**: Where visitors share feedback

Notes & assumptions
- The site is static; there is no backend. Orders are sent by opening the user's mail client (mailto) or WhatsApp.
- Comments are stored in your browser (localStorage) — they will persist even after closing the browser, but will be lost if you clear your browser data.
- The phone number used: `08165712215` with country code `+243` (Democratic Republic of Congo).
- Brand name: "CLEOBELLA DESING".

## Customizing Comments & Reviews

**Add more reviews**: Edit `script.js` and add more objects to the `sampleReviews` array at the top.

**Clear all comments**: Open browser DevTools (F12), go to Console, and type:
```javascript
localStorage.removeItem('cleobella-comments');
location.reload();
```

## Newsletter Email Setup

Your newsletter uses **EmailJS** — a FREE service for sending emails directly from your static website.

**How it works:**
1. Visitor enters email and clicks "Subscribe"
2. **Two emails are automatically sent:**
   - **Admin notification** → ijerheanthonia@gmail.com (you're notified of new subscriber)
   - **Welcome email** → Subscriber's email (they get a welcome message)
3. All from your static website — no backend needed!

**Setup Required (one-time, ~5 minutes):**
1. Create free account at [emailjs.com](https://www.emailjs.com)
2. Connect your Gmail account (or Outlook/Yahoo)
3. Create 2 email templates in EmailJS dashboard
4. Copy your EmailJS Public Key to `script.js`

**After setup:**
- Newsletter subscriptions work automatically
- You receive admin notifications
- Subscribers get welcome emails
- FREE tier: 200 emails/month (upgrade available for more)

**📖 For detailed step-by-step instructions, see `EMAILJS_SETUP_GUIDE.md`**

## Next steps / improvements (suggested)
- Replace sample images with real product photography.
- Add a server-side backend to persist orders and comments in a database.
- Add payment integration (Stripe, PayPal) if you want online payments.
- Add an admin panel to manage reviews.
- or wire a simple backend to accept orders automatically.
 - or wire a simple backend to accept orders automatically.

Replacing product images/videos
1. Put your image and video files in an `images/` and `videos/` folders next to `index.html`. Example:
   - `images/product1.jpg`
   - `images/product2.jpg`
   - `videos/video1.mp4`
   - `videos/video2.mp4`

2. Open `script.js` in a text editor and find the `products` array at the top. Update product titles, prices, and media paths (`src` values) to match your files.

3. Save and open `index.html` in your browser. The product grid will use your images/videos automatically.

Notes about videos
- MP4 is widely supported. For best compatibility, provide an MP4 encoded with H.264.
- Use the `poster` property to point to a preview image for the video (recommended).

If you want, I can:
- Add more products by extending the `products` array in `script.js`, or
- Accept image/video files and wire them into the product data for you.