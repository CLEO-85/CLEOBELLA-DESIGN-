// Shop page script - handles product rendering, filtering, cart, and navigation on shop.html
// Depends on products.js being loaded first

emailjs.init("rUiRuy3rZbciF8o3A");

let cart = [];

document.addEventListener('DOMContentLoaded', ()=>{
  // Initialize header interactions for all pages
  initNavToggle();
  initReducedMotion();
  
  // Render products on shop page
  renderProductGrid('products-grid');
  
  // Setup filter/search
  const searchInput = document.getElementById('search-products');
  const filterSelect = document.getElementById('filter-price');
  if(searchInput) searchInput.addEventListener('input', filterProducts);
  if(filterSelect) filterSelect.addEventListener('change', filterProducts);
  
  // Setup cart interactions
  setupCartUI();
  
  // Setup checkout form
  setupCheckoutForm();
});

function initNavToggle(){
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
    document.removeEventListener('keydown', _keyHandler);
    try{ if(_prevFocused && typeof _prevFocused.focus === 'function') _prevFocused.focus(); }catch(e){}
    _prevFocused = null; _focusable = [];
  }

  function openNav(){
    if(!siteHeader) return;
    siteHeader.classList.add('nav-open');
    if(navToggle) navToggle.setAttribute('aria-expanded', 'true');
    _prevFocused = document.activeElement;
    const navLinksRoot = document.querySelector('.site-header .nav-links');
    _focusable = getFocusable(navLinksRoot);
    if(_focusable.length) _focusable[0].focus();
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

  document.addEventListener('click', (ev)=>{
    const withinNav = ev.target.closest && ev.target.closest('.top-nav');
    if(!withinNav) closeNav();
  });

  document.querySelectorAll('.top-nav a').forEach(a=> a.addEventListener('click', ()=> closeNav()));

  // Hide on scroll down, reveal on scroll up (throttled via rAF)
  let lastScroll = window.scrollY || window.pageYOffset || 0;
  let ticking = false;
  const headerHeight = siteHeader ? siteHeader.offsetHeight : 72;

  function onScroll(){
    const y = window.scrollY || window.pageYOffset || 0;
    if(Math.abs(y - lastScroll) < 8){ ticking = false; return; }
    if(y > lastScroll && y > headerHeight + 20){
      siteHeader.classList.add('hidden');
    } else {
      siteHeader.classList.remove('hidden');
    }
    if(y > 30) siteHeader.classList.add('scrolled'); else siteHeader.classList.remove('scrolled');
    lastScroll = y;
    ticking = false;
  }

  window.addEventListener('scroll', ()=>{
    if(!ticking){ requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 768) closeNav();
  });
}

function initReducedMotion(){
  try{
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReduced){
      document.querySelectorAll('video').forEach(v=>{
        try{ v.pause(); }catch(e){}
        v.controls = true;
      });
      document.body.classList.add('reduced-motion');
    }
  }catch(e){}
}

function filterProducts(){
  const searchTerm = document.getElementById('search-products')?.value?.toLowerCase() || '';
  const priceFilter = document.getElementById('filter-price')?.value || '';
  
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';
  
  const filtered = products.filter(p => {
    const matchesSearch = !searchTerm || 
      p.title.toLowerCase().includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm);
    
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
  setupProductObserver();
  setupVideoInteractions();
}

function setupCartUI(){
  document.body.addEventListener('click', e=>{
    if(e.target.matches('.add')){
      const id = e.target.dataset.id;
      addToCart(id, 1);
    }
    if(e.target.matches('#cart-toggle')) openCart();
    if(e.target.matches('#cart-close')) closeCart();
    if(e.target.matches('[data-action="inc"]')) changeQty(e.target.dataset.id, 1);
    if(e.target.matches('[data-action="dec"]')) changeQty(e.target.dataset.id, -1);
  });
}

function addToCart(id, qty=1){
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty += qty; else cart.push({id, qty});
  updateCartCount();
  renderCart();
  openCart();
}

function changeQty(id, delta){
  const idx = cart.findIndex(i=>i.id===id);
  if(idx===-1) return;
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0){
    const el = document.querySelector(`#cart-items .cart-item[data-id="${id}"]`);
    if(el){
      el.classList.add('removed');
      const cleanUp = ()=>{
        const reidx = cart.findIndex(i=>i.id===id);
        if(reidx !== -1) cart.splice(reidx,1);
        updateCartCount();
        renderCart();
      };
      let fired = false;
      el.addEventListener('transitionend', (ev)=>{
        if(fired) return; fired = true; cleanUp();
      }, { once: true });
      setTimeout(()=>{ if(!fired) { fired = true; cleanUp(); } }, 420);
      return;
    } else {
      cart.splice(idx,1);
      updateCartCount();
      renderCart();
      return;
    }
  }
  updateCartCount();
  renderCart();
}

function updateCartCount(){
  const el = document.getElementById('cart-count');
  if(el) el.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function renderCart(){
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  if(cart.length===0){
    container.innerHTML = '<p>Your cart is empty.</p>';
    const totalEl = document.getElementById('cart-total');
    if(totalEl) totalEl.textContent = formatPrice(0);
    return;
  }
  cart.forEach(item=>{
    const p = products.find(x=>x.id===item.id);
    if(!p) return;
    const div = document.createElement('div');
    div.className='cart-item';
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
  const totalEl = document.getElementById('cart-total');
  if(totalEl) totalEl.textContent = formatPrice(total);
}

function openCart(){
  const cartEl = document.getElementById('cart');
  if(cartEl) cartEl.classList.add('open');
}

function closeCart(){
  const cartEl = document.getElementById('cart');
  if(cartEl) cartEl.classList.remove('open');
}

function setupCheckoutForm(){
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout');
  const checkoutClose = document.getElementById('checkout-close');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutWA = document.getElementById('checkout-wa');

  if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{
    if(cart.length===0){ alert('Your cart is empty. Please add items.'); return; }
    if(checkoutModal) checkoutModal.classList.add('open');
  });

  if(checkoutClose) checkoutClose.addEventListener('click', ()=>{
    if(checkoutModal) checkoutModal.classList.remove('open');
  });

  if(checkoutForm) checkoutForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const form = new FormData(e.target);
    sendOrderEmail(form);
    if(checkoutModal) checkoutModal.classList.remove('open');
  });

  if(checkoutWA) checkoutWA.addEventListener('click', ()=>{
    const form = new FormData(document.getElementById('checkout-form'));
    if(!form.get('name') || !form.get('phone')){ alert('Please fill name and phone before sending WhatsApp order.'); return; }
    sendOrderWhatsApp(form);
    if(checkoutModal) checkoutModal.classList.remove('open');
  });
}

function buildOrderSummary(){
  const lines = cart.map(i=>{
    const p = products.find(x=>x.id===i.id);
    return `${p.title} — ${i.qty} x ${formatPrice(p.price)} = ${formatPrice(p.price * i.qty)}`;
  });
  const total = cart.reduce((s,i)=>s + i.qty * products.find(p=>p.id===i.id).price, 0);
  return {lines, total};
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
  const waUrl = `https://wa.me/${SHOP_WHATSAPP_INT}?text=${msg}`;
  window.open(waUrl, '_blank');
}
