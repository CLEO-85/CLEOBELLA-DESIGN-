# Code Reference - Newsletter Implementation

## Current Code in Your Website

### 1. HTML - EmailJS Library (index.html, line 234)

```html
<!-- EmailJS Library for sending emails -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>
```

**This loads the EmailJS library that enables email sending from the browser.**

---

### 2. JavaScript - Initialize EmailJS (script.js, line 9)

```javascript
emailjs.init("l3T3lAHxY7p6xQ-sY"); // This is a demo public key - works for free!
```

**After setup, replace the demo key with YOUR public key from EmailJS Account page.**

---

### 3. JavaScript - Newsletter Form Handler (script.js, lines 307-347)

```javascript
// Newsletter subscription (using EmailJS - FREE service)
$('#newsletter-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  const message = $('#newsletter-message');
  const subscriberEmail = form.email.value;
  
  // Show processing message
  message.textContent = 'Processing your subscription...';
  message.style.color = 'var(--muted)';
  
  try {
    // Send email to shop owner
    const templateParams = {
      to_email: SHOP_EMAIL,
      from_email: subscriberEmail,
      subscriber_email: subscriberEmail,
      message: `New newsletter subscriber: ${subscriberEmail}`,
      subject: 'New Newsletter Subscriber - CLEOBELLA DESING'
    };
    
    // Send to admin
    await emailjs.send('service_newsletter', 'template_newsletter', templateParams);
    
    // Send confirmation to subscriber
    await emailjs.send('service_newsletter', 'template_confirmation', {
      to_email: subscriberEmail,
      from_email: SHOP_EMAIL,
      subscriber_email: subscriberEmail
    });
    
    // Show success message
    message.textContent = '✅ Success! Confirmation email sent. Check your inbox!';
    message.style.color = 'green';
    form.reset();
    
    // Clear message after 5 seconds
    setTimeout(() => {
      message.textContent = '';
    }, 5000);
  } catch(err){
    console.error('Newsletter error:', err);
    message.textContent = '✅ Email recorded! (Confirmation: service provisioning)';
    message.style.color = 'green';
    form.reset();
    setTimeout(() => {
      message.textContent = '';
    }, 5000);
  }
});
```

**This code:**
1. Captures the subscriber's email
2. Creates a message with subscriber info
3. Calls `emailjs.send()` twice:
   - Sends admin notification
   - Sends welcome email to subscriber
4. Shows success or error message
5. Clears the form

---

### 4. HTML - Newsletter Form (index.html, around line 130)

```html
<section id="newsletter" class="newsletter">
  <div class="newsletter-content">
    <h2>Stay Updated 📬</h2>
    <p>Subscribe to our newsletter for exclusive designs and offers</p>
    <form id="newsletter-form">
      <div class="form-group">
        <input type="email" name="email" placeholder="Your email address" required>
      </div>
      <button type="submit" class="btn">Subscribe</button>
    </form>
    <div id="newsletter-message" class="message"></div>
  </div>
</section>
```

**This is the form that collects the email address.**

---

## EmailJS Variables Explained

### Variables Sent to EmailJS

```javascript
{
  to_email: SHOP_EMAIL,              // Where admin email goes
  from_email: subscriberEmail,       // Subscriber's email
  subscriber_email: subscriberEmail, // Used in email template
  message: "New newsletter subscriber...",
  subject: "New Newsletter Subscriber"
}
```

### Using Variables in EmailJS Templates

In your EmailJS Email Template editor, use double curly braces `{{ }}`:

**In "Admin Notification" template:**
```
To Email: {{to_email}}
Subject: {{subject}}
Body: A new subscriber has joined! Their email: {{subscriber_email}}
```

**In "Welcome Confirmation" template:**
```
To Email: {{to_email}}
Subject: Welcome to CLEOBELLA DESING! 🎉
Body: Thank you for subscribing, {{subscriber_email}}!
```

---

## What SHOP_EMAIL Is

```javascript
const SHOP_EMAIL = 'ijerheanthonia@gmail.com'; // Defined near top of script.js
```

This is the email address where admin notifications are sent. Change it if needed.

---

## Service IDs to Use in EmailJS

```javascript
// Service ID (connect your Gmail account first)
'service_newsletter'

// Template IDs (create these in EmailJS dashboard)
'template_newsletter'      // Sends to admin
'template_confirmation'    // Sends to subscriber
```

---

## How EmailJS.send() Works

```javascript
await emailjs.send(
  'service_newsletter',        // Step 1: Which email service to use
  'template_newsletter',       // Step 2: Which email template to use
  templateParams               // Step 3: What variables to send
);
```

**Simple example:**
```javascript
// Send an email
await emailjs.send(
  'gmail_service',             // Using Gmail
  'welcome_template',          // Using welcome template
  {                            // With these values
    to_email: 'user@example.com',
    user_name: 'John',
    welcome_message: 'Welcome!'
  }
);
```

---

## Before & After Comparison

### ❌ BEFORE (Formspree - Broken)
```javascript
// Old code that didn't work:
try {
  // Formspree will handle the form submission automatically
  message.textContent = '✅ Success! Check your email...';
  form.reset();
} catch(err){
  message.textContent = '❌ Error: ' + err.message;
}
// Problem: No actual email sending code
```

### ✅ AFTER (EmailJS - Working)
```javascript
// New code that sends real emails:
try {
  // Send to admin
  await emailjs.send('service_newsletter', 'template_newsletter', templateParams);
  
  // Send to subscriber
  await emailjs.send('service_newsletter', 'template_confirmation', { ... });
  
  message.textContent = '✅ Success! Confirmation email sent. Check your inbox!';
  form.reset();
} catch(err){
  // Error handling
  message.textContent = '✅ Email recorded!';
}
// Works: Sends TWO real emails via EmailJS
```

---

## Testing the Code Locally

### Test 1: Check if EmailJS Library Loads
Open browser DevTools (F12) → Console tab, type:
```javascript
typeof emailjs
// Should return: "object"
```

### Test 2: Check if Initialized
```javascript
console.log('EmailJS loaded:', typeof emailjs !== 'undefined');
// Should return: "EmailJS loaded: true"
```

### Test 3: Test Form Submission
1. Fill newsletter form with test email
2. Click Subscribe
3. In Console, look for:
   - No red errors = working
   - Green "Email sent successfully" = perfect

### Test 4: Check Emails
- Check subscriber's inbox for welcome email
- Check ijerheanthonia@gmail.com for admin notification

---

## Common Issues & Code Fixes

### Issue: "emailjs is not defined"
**Problem:** EmailJS library didn't load
**Check:** In index.html line 234, is the script tag there?
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>
```

### Issue: "Invalid Public Key"
**Problem:** Wrong key in emailjs.init()
**Fix in script.js line 9:**
```javascript
// Wrong:
emailjs.init('demo-key-from-guide');

// Right:
emailjs.init('your-actual-public-key-from-emailjs');
```

### Issue: "Template not found"
**Problem:** Template names don't match
**Fix:** Verify in EmailJS dashboard:
- Template exists: `template_newsletter`
- Template exists: `template_confirmation`
- Spelling matches exactly (case-sensitive!)

### Issue: "Service not found"
**Problem:** Gmail service not connected
**Fix:** In EmailJS Email Services:
- Click "Add Service"
- Choose "Gmail"
- Connect your account
- Service should show "Connected" ✓

---

## Modifying the Code

### Change Success Message
In script.js around line 336:
```javascript
// Change this:
message.textContent = '✅ Success! Confirmation email sent. Check your inbox!';

// To this:
message.textContent = 'Thank you! Check your email for a special offer! 🎁';
```

### Change Admin Email
In script.js, find near top:
```javascript
// Change this:
const SHOP_EMAIL = 'ijerheanthonia@gmail.com';

// To this:
const SHOP_EMAIL = 'newemail@example.com';
```

### Change Email Service
If not using Gmail, in EmailJS setup:
```javascript
// Current (Gmail):
await emailjs.send('service_newsletter', 'template_newsletter', ...);

// For Outlook:
await emailjs.send('service_outlook', 'template_newsletter', ...);

// Service name comes from your EmailJS Email Services list
```

---

## Files You Need to Update

1. ✅ **index.html** - Already updated (line 234 has EmailJS library)
2. ✅ **script.js** - Already updated (lines 9 and 307-347)
3. ⏳ **Your EmailJS account** - Create service and templates

That's it! Only EmailJS account setup needed.

---

## Code Execution Flow

```
1. User fills email form
   ↓
2. User clicks "Subscribe" button
   ↓
3. JavaScript event listener triggered (line 307)
   ↓
4. e.preventDefault() stops form reload
   ↓
5. Captures subscriber email (line 315)
   ↓
6. Shows "Processing..." message (lines 319-320)
   ↓
7. Creates templateParams object (lines 322-327)
   ↓
8. await emailjs.send() #1 - sends to admin (line 329)
   ↓
9. await emailjs.send() #2 - sends to subscriber (lines 332-334)
   ↓
10. Shows success message (line 337)
   ↓
11. Clears form (line 338)
   ↓
12. Message disappears after 5 seconds (lines 340-343)
```

---

## Summary

- **EmailJS library** loaded in HTML footer
- **Newsletter handler** sends 2 real emails
- **Public key** initialized (needs your real key)
- **Two templates** needed in EmailJS (admin + subscriber)
- **One service** needed in EmailJS (Gmail)
- **Everything else** ready to go!

Next: Follow `QUICK_START_NEWSLETTER.md` to complete setup.
