# EmailJS Newsletter Setup Guide

## Overview
The CLEOBELLA DESING website now uses **EmailJS** for newsletter subscriptions. This is a FREE service that allows sending emails directly from your static website without a backend server.

## Step 1: Create EmailJS Account

1. Go to **[emailjs.com](https://www.emailjs.com)** (FREE account)
2. Click **Sign Up** 
3. Create account with your email (ijerheanthonia@gmail.com recommended)
4. Verify your email

## Step 2: Get Your Public Key

1. In EmailJS dashboard, click **Account** (top right)
2. Find your **Public Key** (long string like: `l3T3lAHxY7p6xQ-sY`)
3. Keep this safe - it's in `script.js` line ~2

## Step 3: Add Email Service

1. In EmailJS, go to **Email Services** (left menu)
2. Click **Add Service**
3. Choose your email provider:
   - **Gmail** ✅ (Recommended - easier)
   - **Outlook/Office365** ✅
   - **Yahoo Mail** ✅

### For Gmail:
1. Select "Gmail" service
2. Click "Connect Account"
3. Sign in with ijerheanthonia@gmail.com
4. Grant EmailJS permission to send emails
5. Your service ID will appear (save it!)

## Step 4: Create Email Templates

### Template 1: Admin Notification (new subscriber)

1. Go to **Email Templates** (left menu)
2. Click **Create New Template**
3. **Template Name**: `template_newsletter`
4. **Template ID**: `template_newsletter`
5. **To Email**: `{{to_email}}`
6. **Subject**: `{{subject}}`
7. **Email Body**:
```
Hello! 

A new subscriber has joined your newsletter:

📧 Email: {{subscriber_email}}

This person will receive your future updates.

---
CLEOBELLA DESING Newsletter Signup
```
8. Click **Save**

### Template 2: Confirmation to Subscriber

1. Click **Create New Template**
2. **Template Name**: `template_confirmation`
3. **Template ID**: `template_confirmation`
4. **To Email**: `{{to_email}}`
5. **Subject**: `Welcome to CLEOBELLA DESING Newsletter! 🎉`
6. **Email Body**:
```
Hello! 👋

Welcome to the CLEOBELLA DESING newsletter! 

We're thrilled to have you join our community of fashion lovers.

🎁 You'll receive:
✓ Exclusive design previews
✓ Special offers and discounts
✓ Fashion tips and styling guides
✓ New collection announcements

Stay fabulous!

---
CLEOBELLA DESING
📧 ijerheanthonia@gmail.com
📱 WhatsApp: +243 816 5712215
```
7. Click **Save**

## Step 5: Update script.js with Your IDs

Open `script.js` and find line ~2 where it says:
```javascript
emailjs.init('l3T3lAHxY7p6xQ-sY');
```

Replace with YOUR public key from Step 2.

## Step 6: Test the Newsletter Form

1. Open your website in a browser
2. Scroll to **Newsletter** section
3. Enter your email
4. Click **Subscribe**
5. You should see: ✅ **Success! Confirmation email sent. Check your inbox!**
6. Check both:
   - Your email (you should receive welcome email)
   - Your shop email (ijerheanthonia@gmail.com) should receive notification

## Troubleshooting

### "Invalid Public Key"
- Copy your public key from EmailJS Account page again
- Make sure there are no extra spaces

### "Service not found"
- Check that you created `Gmail` service in EmailJS
- Get the exact Service ID and update script.js if needed

### Emails not sending
- Check EmailJS console for errors (F12 → Console tab)
- Verify Gmail account is connected in EmailJS
- Check spam/junk folder for emails

### Template errors
- Make sure Template IDs match exactly:
  - `template_newsletter` (admin notification)
  - `template_confirmation` (subscriber confirmation)
- Verify `{{to_email}}` variable is used in template

## How It Works

1. **User enters email** in newsletter form
2. **JavaScript sends to EmailJS service**
3. **EmailJS sends 2 emails**:
   - Admin notification → `ijerheanthonia@gmail.com`
   - Welcome email → Subscriber's email
4. **Success message displays**

## FAQ

**Q: Is it really free?**
A: Yes! EmailJS free tier allows 200 emails/month.

**Q: Do I need a backend server?**
A: No! EmailJS runs directly in the browser.

**Q: Can I change the email templates?**
A: Yes! Customize the text in EmailJS Email Templates dashboard.

**Q: Can I add more templates?**
A: Yes! Create as many as you need in EmailJS.

**Q: What if I reach the 200 email limit?**
A: Upgrade to paid plan (~$20-50/month) for unlimited emails.

## Production Checklist

- ✅ Create EmailJS account
- ✅ Connect Gmail service
- ✅ Create both email templates
- ✅ Update public key in script.js
- ✅ Test newsletter form
- ✅ Deploy website
- ✅ Test from production domain

## Security Note

Your Public Key is visible in the browser - that's OK! It's designed to be public. Never share your:
- Secret Keys
- Service IDs (optional to hide, but public key is safe)

---

**Questions?** Visit [emailjs.com/docs](https://www.emailjs.com/docs) for full documentation.
