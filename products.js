// Shared products and utilities module for all pages
const SHOP_EMAIL = 'ijerheanthonia@gmail.com';
const SHOP_WHATSAPP_LOCAL = '08165712215';
const SHOP_WHATSAPP_INT = '2438165712215';

// Product data shared across all pages
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

const defaultProducts = JSON.parse(JSON.stringify(products));

// Utility functions
function $(sel){ return document.querySelector(sel); }
function formatPrice(n){ return `₦${n.toLocaleString('en-NG')}`; }

function makePlaceholderDataURI(title, w=800, h=450){
  const bg = encodeURIComponent('#f0f4f8');
  const color = encodeURIComponent('#3AA7FF');
  const txt = encodeURIComponent(title.replace(/&/g,'&amp;'));
  const svg = `<?xml version='1.0' encoding='utf-8'?><svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='${bg}'/><g text-anchor='middle' font-family='Arial, Helvetica, sans-serif'><text x='50%' y='45%' font-size='24' fill='${color}' font-weight='700'>${txt}</text><text x='50%' y='65%' font-size='14' fill='%23777777'>Image not available</text></g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function renderProductGrid(containerId){
  const grid = document.getElementById(containerId);
  if(!grid) return;
  grid.innerHTML = '';
  products.forEach((p, idx) => {
    const el = document.createElement('div');
    el.className = 'product';
    el.dataset.index = idx;

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
  unhideMedia();
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

// Video interactions
function setupVideoInteractions(){
  const videos = document.querySelectorAll('.product video');
  if(!videos || videos.length===0) return;
  videos.forEach(v => {
    try{
      v.preload = v.getAttribute('preload') || 'metadata';
      v.playsInline = true;
      v.removeAttribute('muted');
    }catch(e){}

    const toggle = (ev)=>{
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(prefersReduced) return;
      if(v.paused){ v.play().catch(()=>{}); }
      else { v.pause(); }
    };

    v.addEventListener('click', toggle);
    v.addEventListener('touchstart', function onTouch(ev){
      ev.preventDefault();
      toggle(ev);
    }, { passive: false });

    v.addEventListener('play', ()=> v.classList.add('is-playing'));
    v.addEventListener('pause', ()=> v.classList.remove('is-playing'));
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

// Unhide media
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
        if(img.src && img.src.startsWith('data:')){
          img.src = def.media.src;
        }
      }
      if(video && def.media && def.media.src){
        const source = video.querySelector('source');
        if(source && source.src !== def.media.src){
          source.src = def.media.src;
          if(def.media.poster) video.setAttribute('poster', def.media.poster);
          try{ video.load(); }catch(e){}
        }
      }
    });
  }catch(e){ console.warn('unhideMedia error', e); }
}
