# Newsletter Setup Guide

## How Newsletter Email Delivery Works

Your newsletter form is now connected to **Formspree**, a free service that handles email delivery automatically.

### Current Setup
- ✅ Newsletter form collects subscriber emails
- ✅ Emails are sent to: **ijerheanthonia@gmail.com**
- ✅ Subscribers receive a confirmation message

### How It Works

1. **Visitor subscribes** → Enters email and clicks "Subscribe"
2. **Form submitted** → Formspree receives the data
3. **Email sent** → ijerheanthonia@gmail.com receives the subscription notification
4. **Confirmation shows** → Visitor sees "Success! Check your email..."

### First Time Setup (One-time only)

**The first time someone subscribes**, you'll need to verify your email:

1. Open your email (ijerheanthonia@gmail.com)
2. Look for an email from **Formspree**
3. Click the verification link
4. After verification, all future submissions will work automatically

**That's it!** After verification, every newsletter subscription will automatically send an email to your inbox.

### What You'll Receive

When someone subscribes, you'll get an email with:
- Their email address
- Timestamp of subscription
- Subject: "New Newsletter Subscriber - CLEOBELLA DESING"

### Viewing All Submissions

To see all newsletter submissions:
1. Visit: https://formspree.io
2. Log in with the email you used
3. Create a free account if you haven't already
4. Your form dashboard shows all submissions

### Customizing Email Content

To send a **custom welcome email** to subscribers:

**Option 1: Use Formspree Automation** (Free)
1. Go to formspree.io dashboard
2. Set up auto-responses for subscribers

**Option 2: Use a Service like Mailchimp** (Free for up to 500 subscribers)
1. Create a Mailchimp list
2. Update the form to submit to Mailchimp instead
3. Set up automated welcome emails

**Option 3: Connect to Backend** (Advanced)
- Send to a Node.js/Python backend that handles email delivery
- More control but requires server hosting

### Testing

To test the newsletter:
1. Open the website in your browser
2. Scroll to "📧 Subscribe to Our Newsletter"
3. Enter a test email and click Subscribe
4. Check the inbox (you'll see a Formspree verification email first time only)

### Troubleshooting

**Problem**: "Form not working"
- **Solution**: Check that you've verified the email in Formspree (check your inbox for verification link)

**Problem**: "Not receiving subscriber emails"
- **Solution**: Check spam/promotions folder; Formspree emails sometimes go there

**Problem**: "Want to change the email that receives submissions"
- **Solution**: Update the Formspree endpoint in `index.html` line 109

### Need Help?

- **Formspree Documentation**: https://formspree.io/docs
- **Formspree Status**: https://formspree.io

---

**Your current form endpoint**: https://formspree.io/f/xyzpwvzo
(Change this if you want emails sent to a different address)
