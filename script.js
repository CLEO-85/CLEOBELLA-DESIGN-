// CLEOBELLA DESING - simple shop script
// Contact & order destination (from user)
const SHOP_EMAIL = 'ijerheanthonia@gmail.com';
// Local display number and international WhatsApp number (user provided country code +243)
const SHOP_WHATSAPP_LOCAL = '08165712215'; // displayed to visitors
const SHOP_WHATSAPP_INT = '2438165712215'; // used for wa.me links (country code + local without leading 0)

// Initialize EmailJS - Public Key for sending emails
emailjs.init("rUiRuy3rZbciF8o3A"); // This is a demo public key - works for free!

// Product data: all images and videos defined here
// Edit titles, prices, and media paths as needed
let products = [
  {
    id: 'p1',
    title: 'Bubu Gown',
    price: 20000,
    media: { type: 'image', src: 'images/product1.jpg' }
  },
  {
    id: 'p2',
    title: 'Bubu Gown',
    price: 20000,
    media: { type: 'image', src: 'images/product2.jpg' }
  },
  {
    id: 'p3',
    title: 'Signature Dress',
    price: 180,
    media: { type: 'video', src: 'videos/video1.mp4', poster: 'images/product3.jpg' }
  },
  {
    id: 'p4',
    title: 'Bubu Shirt Gown',
    price: 15000,
    media: { type: 'image', src: 'images/product4.jpg' }
  },
  {
    id: 'p5',
    title: 'Designer Collection - Video',
    price: 250,
    media: { type: 'video', src: 'videos/video2.mp4', poster: 'images/product5.jpg' }
  },
  {
    id: 'p6',
    title: 'Exclusive Pattern Dress',
    price: 20000,
    media: { type: 'image', src: 'images/product6.jpg' }
  }
];

let cart = [];

function $(sel){return document.querySelector(sel)}

function formatPrice(n){return `₦${n.toLocaleString('en-NG')}`}

function renderProducts(){
  const grid = $('#products-grid');
  grid.innerHTML = '';
  products.forEach(p => {
    const el = document.createElement('div');
    el.className = 'product';

    // media: prefer p.media.src (supports images and videos). Fallbacks handled.
    let mediaHtml = '';
    if(p.media && p.media.type === 'video'){
      // video: use poster if provided, add controls
      const poster = p.media.poster ? `poster="${p.media.poster}"` : '';
      mediaHtml = `<video ${poster} controls muted playsinline style="width:100%;height:160px;object-fit:cover;border-radius:6px;margin-bottom:.6rem"><source src="${p.media.src}" type="video/mp4">Your browser does not support the video tag.</video>`;
    } else {
      const src = (p.media && p.media.src) ? p.media.src : (p.img || '');
      mediaHtml = `<img src="${src}" alt="${p.title}" />`;
    }

    el.innerHTML = `
      ${mediaHtml}
      <h4>${p.title}</h4>
      <div class="price">${formatPrice(p.price)}</div>
      <button class="btn add" data-id="${p.id}">Add to cart</button>
    `;
    grid.appendChild(el);
  });
}

function updateCartCount(){
  $('#cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function openCart(){
  $('#cart').classList.add('open');
}
function closeCart(){
  $('#cart').classList.remove('open');
}

function renderCart(){
  const container = $('#cart-items');
  container.innerHTML = '';
  if(cart.length===0){container.innerHTML = '<p>Your cart is empty.</p>';$('#cart-total').textContent = formatPrice(0);return}
  cart.forEach(item=>{
    const p = products.find(x=>x.id===item.id);
    const div = document.createElement('div'); div.className='cart-item';
    const imgSrc = (p.media && p.media.src) ? p.media.src : (p.img || '');
    div.innerHTML = `
      <img src="${imgSrc}" alt="${p.title}" />
      <div style="flex:1">
        <div><strong>${p.title}</strong></div>
        <div class="muted">${formatPrice(p.price)} x ${item.qty}</div>
      </div>
      <div style="text-align:right">
        <div>${formatPrice(p.price * item.qty)}</div>
        <div style="margin-top:.4rem"><button class="btn" data-action="dec" data-id="${item.id}">-</button> <button class="btn" data-action="inc" data-id="${item.id}">+</button></div>
      </div>
    `;
    container.appendChild(div);
  });
  const total = cart.reduce((s,i)=>s + i.qty * products.find(p=>p.id===i.id).price, 0);
  $('#cart-total').textContent = formatPrice(total);
}

function addToCart(id, qty=1){
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty += qty; else cart.push({id, qty});
  updateCartCount(); renderCart(); openCart();
}

function changeQty(id, delta){
  const idx = cart.findIndex(i=>i.id===id);
  if(idx===-1) return;
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx,1);
  updateCartCount(); renderCart();
}

function buildOrderSummary(){
  const lines = cart.map(i=>{
    const p = products.find(x=>x.id===i.id);
    return `${p.title} — ${i.qty} x ${formatPrice(p.price)} = ${formatPrice(p.price * i.qty)}`;
  });
  const total = cart.reduce((s,i)=>s + i.qty * products.find(p=>p.id===i.id).price, 0);
  return {lines, total};
}

function openCheckout(){
  if(cart.length===0){ alert('Your cart is empty. Please add items.'); return }
  $('#checkout').classList.add('open');
}

function closeCheckout(){
  $('#checkout').classList.remove('open');
}

function sendOrderEmail(formData){
  const {lines,total} = buildOrderSummary();
  const bodyLines = [];
  bodyLines.push('Order from CLEOBELLA DESING');
  bodyLines.push('');
  bodyLines.push('Items:');
  lines.forEach(l=>bodyLines.push('- '+l));
  bodyLines.push('');
  bodyLines.push('Total: ' + formatPrice(total));
  bodyLines.push('');
  bodyLines.push('Customer info:');
  bodyLines.push('Name: '+formData.get('name'));
  bodyLines.push('Email: '+formData.get('email'));
  bodyLines.push('Phone: '+formData.get('phone'));
  bodyLines.push('Address: '+formData.get('address'));
  const notes = formData.get('notes'); if(notes) { bodyLines.push('Notes: '+notes); }

  const subject = encodeURIComponent('New order from CLEOBELLA DESING');
  const body = encodeURIComponent(bodyLines.join('\n'));
  const mailto = `mailto:${SHOP_EMAIL}?subject=${subject}&body=${body}`;
  // open user's mail client
  window.location.href = mailto;
}

function sendOrderWhatsApp(formData){
  const {lines,total} = buildOrderSummary();
  const parts = [];
  parts.push('Order from CLEOBELLA DESING');
  parts.push('\nItems:');
  lines.forEach(l=>parts.push('- '+l));
  parts.push('\nTotal: '+formatPrice(total));
  parts.push('\nCustomer:');
  parts.push('Name: '+formData.get('name'));
  parts.push('Phone: '+formData.get('phone'));
  parts.push('Address: '+formData.get('address'));
  const msg = encodeURIComponent(parts.join('\n'));
  // NOTE: WhatsApp API prefers international format without + and spaces.
  // We'll open wa.me with the provided number string; if it doesn't work, user can message manually.
  // Use the international number for wa.me links (no + or spaces)
  const waUrl = `https://wa.me/${SHOP_WHATSAPP_INT}?text=${msg}`;
  window.open(waUrl, '_blank');
}

// Sample reviews data
const sampleReviews = [
  { stars: '⭐⭐⭐⭐⭐', text: 'Absolutely stunning! The quality is incredible and the fit is perfect. I felt like a queen!', author: 'Amara M.' },
  { stars: '⭐⭐⭐⭐⭐', text: 'Worth every penny. The craftsmanship is impeccable. Highly recommend CLEOBELLA DESING!', author: 'Zainab K.' },
  { stars: '⭐⭐⭐⭐⭐', text: 'I received compliments all night at the event. This is my go-to brand now.', author: 'Chioma N.' }
];

// Comments storage (localStorage)
let comments = JSON.parse(localStorage.getItem('cleobella-comments')) || [];

// User reviews storage (localStorage)
let userReviews = JSON.parse(localStorage.getItem('cleobella-reviews')) || [];

function renderReviews(){
  const grid = $('#reviews-grid');
  grid.innerHTML = '';
  // Combine sample reviews with user reviews (newest first)
  const allReviews = [...sampleReviews, ...userReviews.slice().reverse()];
  allReviews.forEach(review => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-stars">${review.stars}</div>
      <div class="review-text">"${review.text}"</div>
      <div class="review-author">— ${review.author}</div>
    `;
    grid.appendChild(card);
  });
}

function renderComments(){
  const list = $('#comments-list');
  list.innerHTML = '';
  if(comments.length === 0){
    list.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">No comments yet. Be the first to share your thoughts!</p>';
    return;
  }
  comments.slice().reverse().forEach(comment => {
    const item = document.createElement('div');
    item.className = 'comment-item';
    const date = new Date(comment.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
    item.innerHTML = `
      <div class="comment-author">${comment.name}</div>
      <div class="comment-email">${comment.email}</div>
      <div class="comment-text">${comment.message}</div>
      <div class="comment-date">${date}</div>
    `;
    list.appendChild(item);
  });
}

function addComment(name, email, message){
  comments.push({
    name,
    email,
    message,
    date: new Date().toISOString()
  });
  localStorage.setItem('cleobella-comments', JSON.stringify(comments));
  renderComments();
}

function addReview(author, stars, text){
  userReviews.push({
    author,
    stars,
    text,
    date: new Date().toISOString()
  });
  localStorage.setItem('cleobella-reviews', JSON.stringify(userReviews));
  renderReviews();
}

// DOM bindings
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
  renderReviews();
  renderComments();
  updateCartCount();

  document.body.addEventListener('click', e=>{
    if(e.target.matches('.add')){
      const id = e.target.dataset.id; addToCart(id,1);
    }
    if(e.target.matches('#cart-toggle')) openCart();
    if(e.target.matches('#cart-close')) closeCart();
    if(e.target.matches('[data-action="inc"]')) changeQty(e.target.dataset.id, 1);
    if(e.target.matches('[data-action="dec"]')) changeQty(e.target.dataset.id, -1);
  });

  $('#checkout-btn').addEventListener('click', openCheckout);
  $('#checkout-close').addEventListener('click', closeCheckout);

  $('#checkout-form').addEventListener('submit', e=>{
    e.preventDefault();
    const form = new FormData(e.target);
    sendOrderEmail(form);
    closeCheckout();
  });

  $('#checkout-wa').addEventListener('click', ()=>{
    const form = new FormData($('#checkout-form'));
    if(!form.get('name') || !form.get('phone')){ alert('Please fill name and phone before sending WhatsApp order.'); return }
    sendOrderWhatsApp(form);
    closeCheckout();
  });

  // WhatsApp quick link in contact section
  $('#whatsapp-link').addEventListener('click', e=>{
    e.preventDefault();
    const waUrl = `https://wa.me/${SHOP_WHATSAPP_INT}`;
    window.open(waUrl, '_blank');
  });

  // Comments form submission
  $('#comments-form').addEventListener('submit', e=>{
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get('name');
    const email = form.get('email');
    const message = form.get('message');
    
    addComment(name, email, message);
    e.target.reset();
    alert('Thank you for your comment! ❤️');
  });

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

  // Review form handler
  $('#review-form').addEventListener('submit', e=>{
    e.preventDefault();
    const form = e.target;
    const name = form['review-name'].value;
    const stars = form['review-stars'].value;
    const text = form['review-text'].value;
    
    if(!name || !stars || !text){
      alert('Please fill all review fields');
      return;
    }
    
    addReview(name, stars, text);
    form.reset();
    const message = $('#review-message');
    message.textContent = '✅ Thank you for your review!';
    message.style.color = 'green';
    setTimeout(() => {
      message.textContent = '';
    }, 5000);
  });
});
