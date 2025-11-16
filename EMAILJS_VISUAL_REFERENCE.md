# EmailJS Setup Visual Reference

This guide shows you EXACTLY what to look for in the EmailJS dashboard.

## 1. Account Page - Find Your Public Key

**Where to look:**
- EmailJS Dashboard
- Click **Account** (top right corner)
- Scroll down to **API Keys** section

**What you'll see:**
```
API KEYS
├── Public Key: l3T3lAHxY7p6xQ-sY          ← COPY THIS
├── Service ID: service_xxxxx (if created)
└── Template ID: template_xxxxx (if created)
```

**Action:**
- Copy your Public Key (the long string)
- Paste into `script.js` line ~2:
  ```javascript
  emailjs.init('YOUR_PUBLIC_KEY_HERE');
  ```

---

## 2. Email Services Page - Connect Gmail

**Where to look:**
- EmailJS Dashboard
- **Email Services** (left sidebar)

**What you'll see:**
```
EMAIL SERVICES
├── + Add Service
└── [No services yet - if first time]
```

**Action:**
1. Click **+ Add Service**
2. Choose **Gmail** from the list
3. Click **Connect Account**
4. Login with `ijerheanthonia@gmail.com`
5. Grant permissions
6. Wait for success message (usually says "Service connected!")
7. You'll get a **Service ID** (usually: `service_gmail_xxxxx` or just `gmail`)

**After connection, you'll see:**
```
EMAIL SERVICES
├── Gmail ✓ Connected
│   └── Service ID: service_gmail_xxxxx (or shown as just connected)
```

---

## 3. Email Templates Page - Create Templates

**Where to look:**
- EmailJS Dashboard
- **Email Templates** (left sidebar)

**What you'll see:**
```
EMAIL TEMPLATES
├── + Create New Template
└── [No templates yet - if first time]
```

### Creating Template 1: `template_newsletter`

**Click: + Create New Template**

**In the template editor, you'll see form fields:**
```
Template Name: [______________________]  ← Type: template_newsletter
Template ID:   [______________________]  ← Type: template_newsletter
Status:        [Save Draft] [Publish]
```

**Below that:**
```
TEMPLATE VARIABLES (click to add)
To Email:    {{to_email}}
Subject:     New Newsletter Subscriber

Body:
[Large text editor area]
┌─────────────────────────────────────────┐
│ A new subscriber has joined!            │
│                                         │
│ Email: {{subscriber_email}}             │
│                                         │
│ Thank you for building our community.   │
│                                         │
│ —CLEOBELLA DESING                       │
└─────────────────────────────────────────┘
```

**Action:**
1. Fill in all fields above
2. Click **Save**
3. Message appears: "Template saved!" ✓

### Creating Template 2: `template_confirmation`

**Repeat same process with:**
```
Template Name: template_confirmation
Template ID:   template_confirmation
To Email:      {{to_email}}
Subject:       Welcome to CLEOBELLA DESING! 🎉

Body:
┌─────────────────────────────────────────┐
│ Welcome! 👋                             │
│                                         │
│ Thank you for subscribing to our        │
│ newsletter!                             │
│                                         │
│ You'll receive:                         │
│ ✓ New design previews                   │
│ ✓ Special offers                        │
│ ✓ Fashion tips                          │
│                                         │
│ Stay fabulous!                          │
│ —CLEOBELLA DESING                       │
│ 📧 ijerheanthonia@gmail.com             │
│ 📱 +243 816 571 2215                    │
└─────────────────────────────────────────┘
```

**After both created, you'll see:**
```
EMAIL TEMPLATES
├── template_newsletter ✓
│   └── Status: Published
│       Template ID: template_newsletter
└── template_confirmation ✓
    └── Status: Published
        Template ID: template_confirmation
```

---

## 4. Verify Everything is Connected

**Checklist before testing:**

✅ **Public Key found and copied to `script.js` line ~2**
```javascript
emailjs.init('YOUR_ACTUAL_PUBLIC_KEY_HERE');
```

✅ **Gmail service connected** (shows "Connected" badge in Email Services)

✅ **Both templates created:**
   - `template_newsletter` 
   - `template_confirmation`

✅ **Both templates published** (status shows "Published")

---

## 5. Test Newsletter Form

**Step by step:**
1. Open your website (`index.html` in browser)
2. Scroll to "Newsletter" section
3. Enter your test email: `test@example.com`
4. Click **Subscribe** button

**Expected result:**
- ✅ Page shows: "Success! Confirmation email sent. Check your inbox!"
- ✅ Check your test email inbox → Should have welcome email
- ✅ Check ijerheanthonia@gmail.com → Should have admin notification

**If you see errors:**
- Open DevTools: **F12 key**
- Click **Console** tab
- Look for red error messages
- Common errors:
  - `"Invalid Public Key"` → Wrong key in script.js
  - `"Service not found"` → Gmail service not connected
  - `"Template not found"` → Template IDs don't match exactly

---

## 6. Variable Mapping Reference

The website sends these variables to EmailJS:

```javascript
{
  to_email: ijerheanthonia@gmail.com,        // For admin notification
  subscriber_email: user@example.com,        // Subscriber's email
  message: "New newsletter subscriber",      // Auto-generated
  subject: "New Newsletter Subscriber"       // Auto-generated
}
```

**For `template_newsletter`:**
- Use `{{to_email}}` → Becomes: ijerheanthonia@gmail.com
- Use `{{subscriber_email}}` → Becomes: user@example.com

**For `template_confirmation`:**
- Use `{{to_email}}` → Becomes: user@example.com (the subscriber)

---

## 7. Troubleshooting Checklist

| Problem | Solution |
|---------|----------|
| "Invalid Public Key" | Copy public key again from Account page, no spaces |
| "Service not found" | Verify Gmail service created and shows "Connected" |
| "Template not found" | Check template IDs match EXACTLY: `template_newsletter` and `template_confirmation` |
| Emails to spam folder | Check from address is your Gmail |
| No emails at all | Check browser console (F12) for JavaScript errors |
| Rate limit error | You've sent 200+ emails (free tier limit) |

---

## Quick Reference

**File to update:** `script.js` line ~2
```javascript
emailjs.init('YOUR_PUBLIC_KEY');
```

**Templates needed:**
1. `template_newsletter` — sends to admin
2. `template_confirmation` — sends to subscriber

**Service needed:**
- Gmail (connected to `ijerheanthonia@gmail.com`)

**Variables used:**
- `{{to_email}}`
- `{{subscriber_email}}`

---

**You've got this!** 🚀 Let us know if you need help!
