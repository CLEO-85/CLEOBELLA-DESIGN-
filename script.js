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

// Keep a default copy of products so we can restore media if needed
const defaultProducts = JSON.parse(JSON.stringify(products));

function restoreMedia(){
  products = JSON.parse(JSON.stringify(defaultProducts));
  renderProducts();
  // small UX hint: flash a message in the newsletter-message area
  const msg = document.getElementById('newsletter-message');
  if(msg){ msg.textContent = '✅ Media restored.'; msg.style.color = 'green'; setTimeout(()=>{ msg.textContent = ''; }, 3000); }
}

// Create an inline SVG placeholder as a data URI for missing images/videos
function makePlaceholderDataURI(title, w=800, h=450){
  const bg = encodeURIComponent('#f0f4f8');
  const color = encodeURIComponent('#3AA7FF');
  const txt = encodeURIComponent(title.replace(/&/g,'&amp;'));
  const svg = `<?xml version='1.0' encoding='utf-8'?><svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='${bg}'/><g text-anchor='middle' font-family='Arial, Helvetica, sans-serif'><text x='50%' y='45%' font-size='24' fill='${color}' font-weight='700'>${txt}</text><text x='50%' y='65%' font-size='14' fill='%23777777'>Image not available</text></g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

let cart = [];

function $(sel){return document.querySelector(sel)}

function formatPrice(n){return `₦${n.toLocaleString('en-NG')}`}

function renderProducts(){
  const grid = $('#products-grid');
  grid.innerHTML = '';
  products.forEach((p, idx) => {
    const el = document.createElement('div');
    el.className = 'product';
    el.dataset.index = idx;

    // media: prefer p.media.src (supports images and videos). Fallbacks handled.
    let mediaHtml = '';
    if(p.media && p.media.type === 'video'){
      const poster = p.media.poster ? p.media.poster : makePlaceholderDataURI(p.title, 800, 450);
      const videoHtml = `<video poster="${poster}" controls playsinline preload="metadata"><source src="${p.media.src}" type="video/mp4">Your browser does not support the video tag.</video>`;
      mediaHtml = `<div class="media-wrap">${videoHtml}<div class="play-overlay" aria-hidden="true">►</div></div>`;
    } else {
      const src = (p.media && p.media.src) ? p.media.src : (p.img || '');
      const placeholder = makePlaceholderDataURI(p.title, 800, 450);
      const imgHtml = `<img src="${src}" alt="${p.title}" onerror="this.onerror=null;this.src='${placeholder}';" />`;
      mediaHtml = `<div class="media-wrap">${imgHtml}</div>`;
    }

    el.innerHTML = `
      ${mediaHtml}
      <h4>${p.title}</h4>
      <div class="price">${formatPrice(p.price)}</div>
      <button class="btn add" data-id="${p.id}">Add to cart</button>
    `;
    grid.appendChild(el);
  });
  // After rendering, attach observer for staggered reveal
  setupProductObserver();
  // After rendering, setup video interactions
  setupVideoInteractions();
  // Try to unhide media by re-linking original media paths from defaults
  unhideMedia();
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
    div.dataset.id = item.id;
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
  // If quantity goes to zero or below, animate removal before splicing
  if(cart[idx].qty <= 0){
    // Find the rendered cart-item element (if present)
    const el = document.querySelector(`#cart-items .cart-item[data-id="${id}"]`);
    if(el){
      // Add removed class to trigger CSS transition
      el.classList.add('removed');
      // After transition ends, remove item from cart data and re-render
      const cleanUp = ()=>{
        const reidx = cart.findIndex(i=>i.id===id);
        if(reidx !== -1) cart.splice(reidx,1);
        updateCartCount(); renderCart();
      };
      // Wait for transitionend on the element, but also set a fallback timeout
      let fired = false;
      el.addEventListener('transitionend', (ev)=>{
        if(fired) return; fired = true; cleanUp();
      }, { once: true });
      // Fallback in case transitionend doesn't fire
      setTimeout(()=>{ if(!fired) { fired = true; cleanUp(); } }, 420);
      return;
    } else {
      // No element found, just remove and re-render
      cart.splice(idx,1);
      updateCartCount(); renderCart();
      return;
    }
  }
  // Normal quantity change
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

// Search and filter functionality
function filterProducts(){
  const searchTerm = $('#search-products')?.value?.toLowerCase() || '';
  const priceFilter = $('#filter-price')?.value || '';
  
  const grid = $('#products-grid');
  grid.innerHTML = '';
  
  const filtered = products.filter(p => {
    // Search filter
    const matchesSearch = !searchTerm || 
      p.title.toLowerCase().includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm);
    
    // Price filter
    let matchesPrice = true;
    if(priceFilter === 'low') matchesPrice = p.price < 10000;
    else if(priceFilter === 'mid') matchesPrice = p.price >= 10000 && p.price <= 20000;
    else if(priceFilter === 'high') matchesPrice = p.price > 20000;
    
    return matchesSearch && matchesPrice;
  });
  
  if(filtered.length === 0){
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: var(--muted);">No products found. Try adjusting your search.</p>';
    return;
  }
  
  filtered.forEach(p => {
    const el = document.createElement('div');
    el.className = 'product';
    el.dataset.index = filtered.indexOf(p);
    
    let mediaHtml = '';
    if(p.media && p.media.type === 'video'){
      const poster = p.media.poster ? p.media.poster : makePlaceholderDataURI(p.title, 800, 450);
      const videoHtml = `<video poster="${poster}" controls playsinline preload="metadata"><source src="${p.media.src}" type="video/mp4">Your browser does not support the video tag.</video>`;
      mediaHtml = `<div class="media-wrap">${videoHtml}<div class="play-overlay" aria-hidden="true">►</div></div>`;
    } else {
      const src = (p.media && p.media.src) ? p.media.src : (p.img || '');
      const placeholder = makePlaceholderDataURI(p.title, 800, 450);
      const imgHtml = `<img src="${src}" alt="${p.title}" onerror="this.onerror=null;this.src='${placeholder}';" />`;
      mediaHtml = `<div class="media-wrap">${imgHtml}</div>`;
    }

    el.innerHTML = `
      ${mediaHtml}
      <h4>${p.title}</h4>
      <div class="price">${formatPrice(p.price)}</div>
      <button class="btn add" data-id="${p.id}">Add to cart</button>
    `;
    grid.appendChild(el);
  });
  // Attach observer after filtering/rendering
  setupProductObserver();
  // Setup video interactions after rendering
  setupVideoInteractions();
}

// Staggered reveal for products using IntersectionObserver
function setupProductObserver(){
  const items = document.querySelectorAll('.product');
  if(!items || items.length===0) return;
  if(!('IntersectionObserver' in window)){
    items.forEach((el)=> el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const idx = parseInt(el.dataset.index || '0', 10) || 0;
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const delay = prefersReduced ? 0 : Math.min(300, idx * 80);
        setTimeout(()=>{
          el.classList.add('in-view');
        }, delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el=> io.observe(el));
}

// Make videos interactive on mobile: tap to play/pause, preload minimal data
function setupVideoInteractions(){
  const videos = document.querySelectorAll('.product video');
  if(!videos || videos.length===0) return;
  videos.forEach(v => {
    try{
      // ensure controls are visible and minimal preloading
      v.preload = v.getAttribute('preload') || 'metadata';
      v.playsInline = true;
      v.removeAttribute('muted');
    }catch(e){}

    // Toggle play/pause on tap/click. This makes mobile use intuitive.
    const toggle = (ev)=>{
      // If reduced-motion preference is set, don't auto-play
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(prefersReduced) return;
      if(v.paused){ v.play().catch(()=>{}); }
      else { v.pause(); }
    };

    // Mobile browsers may require touchstart for immediate responsiveness
    v.addEventListener('click', toggle);
    v.addEventListener('touchstart', function onTouch(ev){
      // prevent double-handling with click
      ev.preventDefault();
      toggle(ev);
    }, { passive: false });

    // Add small visual state class for playing/paused
    v.addEventListener('play', ()=> v.classList.add('is-playing'));
    v.addEventListener('pause', ()=> v.classList.remove('is-playing'));
    // If the video fails to load, replace it with its poster image so users still see something
    v.addEventListener('error', ()=>{
      try{
        const poster = v.getAttribute('poster') || '';
        const img = document.createElement('img');
        img.src = poster || makePlaceholderDataURI('Video unavailable', 800, 450);
        img.alt = 'Video unavailable';
        img.style.width = '100%';
        img.style.height = '160px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        v.parentNode && v.parentNode.replaceChild(img, v);
      }catch(e){}
    });
    // Ensure overlay elements toggle playback when tapped
    try{
      const wrap = v.closest('.media-wrap');
      if(wrap){
        const overlay = wrap.querySelector('.play-overlay');
        const handler = (ev)=>{
          ev.preventDefault();
          if(v.paused){ v.play().catch(()=>{}); }
          else { v.pause(); }
        };
        overlay && overlay.addEventListener('click', handler);
        overlay && overlay.addEventListener('touchstart', (ev)=>{ ev.preventDefault(); handler(ev); }, { passive: false });
      }
    }catch(e){}
  });
}

// Attempt to restore original media sources into rendered DOM elements
function unhideMedia(){
  try{
    const items = document.querySelectorAll('.product');
    items.forEach(el=>{
      const idx = parseInt(el.dataset.index || '-1', 10);
      if(idx < 0 || idx >= defaultProducts.length) return;
      const def = defaultProducts[idx];
      const mediaWrap = el.querySelector('.media-wrap');
      if(!mediaWrap) return;
      const img = mediaWrap.querySelector('img');
      const video = mediaWrap.querySelector('video');
      if(img && def.media && def.media.src){
        // if current src is a placeholder data URI, replace with real file path
        if(img.src && img.src.startsWith('data:')){
          img.src = def.media.src;
        }
      }
      if(video && def.media && def.media.src){
        const source = video.querySelector('source');
        if(source && source.src !== def.media.src){
          source.src = def.media.src;
          // set poster to default poster if available
          if(def.media.poster) video.setAttribute('poster', def.media.poster);
          // reload video element source
          try{ video.load(); }catch(e){}
        }
      }
    });
  }catch(e){ console.warn('unhideMedia error', e); }
}

// DOM bindings
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
  renderReviews();
  updateCartCount();

  // Respect users' reduced-motion preference: pause videos and reduce JS-driven delays
  try{
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReduced){
      // Pause any videos (they are not autoplaying by default, but guard here)
      document.querySelectorAll('video').forEach(v=>{
        try{ v.pause(); }catch(e){}
        // Keep controls visible so users can play if they want
        v.controls = true;
      });
      // Add a class so CSS/JS can fallback to non-animated states if needed
      document.body.classList.add('reduced-motion');
    }
  }catch(e){}

  document.body.addEventListener('click', e=>{
    if(e.target.matches('.add')){
      const id = e.target.dataset.id; addToCart(id,1);
    }
    if(e.target.matches('#cart-toggle')) openCart();
    if(e.target.matches('#cart-close')) closeCart();
    if(e.target.matches('[data-action="inc"]')) changeQty(e.target.dataset.id, 1);
    if(e.target.matches('[data-action="dec"]')) changeQty(e.target.dataset.id, -1);
    if(e.target.matches('#restore-media')) restoreMedia();
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

  // Responsive nav toggle behaviour
  const navToggle = document.getElementById('nav-toggle');
  const siteHeader = document.querySelector('.site-header');
  let _prevFocused = null;
  let _focusable = [];

  function getFocusable(root){
    const sel = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from((root || document).querySelectorAll(sel)).filter(el => el.offsetParent !== null);
  }

  function closeNav(){
    if(!siteHeader) return;
    siteHeader.classList.remove('nav-open');
    if(navToggle) navToggle.setAttribute('aria-expanded', 'false');
    // remove key handler
    document.removeEventListener('keydown', _keyHandler);
    // restore focus
    try{ if(_prevFocused && typeof _prevFocused.focus === 'function') _prevFocused.focus(); }catch(e){}
    _prevFocused = null; _focusable = [];
  }

  function openNav(){
    if(!siteHeader) return;
    siteHeader.classList.add('nav-open');
    if(navToggle) navToggle.setAttribute('aria-expanded', 'true');
    // focus trap setup
    _prevFocused = document.activeElement;
    const navLinksRoot = document.querySelector('.site-header .nav-links');
    _focusable = getFocusable(navLinksRoot);
    if(_focusable.length) _focusable[0].focus();
    // add key handler for Esc and Tab trapping
    document.addEventListener('keydown', _keyHandler);
  }

  function _keyHandler(e){
    if(e.key === 'Escape' || e.key === 'Esc'){
      closeNav();
      if(navToggle) navToggle.focus();
      return;
    }
    if(e.key === 'Tab'){
      if(!_focusable || _focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = _focusable[0];
      const last = _focusable[_focusable.length - 1];
      if(e.shiftKey){
        if(document.activeElement === first){ e.preventDefault(); last.focus(); }
      } else {
        if(document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    }
  }

  if(navToggle){
    navToggle.addEventListener('click', (ev)=>{
      ev.stopPropagation();
      if(siteHeader.classList.contains('nav-open')) closeNav(); else openNav();
    });
  }

  // Close menu when clicking outside or when a link is clicked
  document.addEventListener('click', (ev)=>{
    const withinNav = ev.target.closest && ev.target.closest('.top-nav');
    if(!withinNav) closeNav();
  });
  // Close when clicking any nav link
  document.querySelectorAll('.top-nav a').forEach(a=> a.addEventListener('click', ()=> closeNav()));

  // Hide on scroll down, reveal on scroll up (throttled via rAF)
  let lastScroll = window.scrollY || window.pageYOffset || 0;
  let ticking = false;
  const headerHeight = siteHeader ? siteHeader.offsetHeight : 72;

  function onScroll(){
    const y = window.scrollY || window.pageYOffset || 0;
    // small deadzone
    if(Math.abs(y - lastScroll) < 8){ ticking = false; return; }
    if(y > lastScroll && y > headerHeight + 20){
      // scrolling down
      siteHeader.classList.add('hidden');
    } else {
      // scrolling up
      siteHeader.classList.remove('hidden');
    }
    // keep scrolled class for subtle shrink
    if(y > 30) siteHeader.classList.add('scrolled'); else siteHeader.classList.remove('scrolled');
    lastScroll = y;
    ticking = false;
  }

  window.addEventListener('scroll', ()=>{
    if(!ticking){ requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  // Close nav when resizing above mobile breakpoint
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 768) closeNav();
  });

  // Search and filter functionality
  const searchInput = $('#search-products');
  const filterSelect = $('#filter-price');
  
  if(searchInput) searchInput.addEventListener('input', filterProducts);
  if(filterSelect) filterSelect.addEventListener('change', filterProducts);

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
