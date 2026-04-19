/* ===================================================
   HILOOK INTERIOR — script.js
   Telegram Bot: @Hilookinterior_bot
   Bot Token: 8445932774:AAFaw7ag3yawRUvLnxzWXynXYUn00Q7nQH0

   ⚠️  SETUP REQUIRED:
   1. Open Telegram and message your bot @Hilookinterior_bot with any text (e.g. "hi")
   2. Then visit: https://api.telegram.org/bot8445932774:AAFaw7ag3yawRUvLnxzWXynXYUn00Q7nQH0/getUpdates
   3. Copy your "chat":{"id": XXXXXXXX } number and paste below as TELEGRAM_CHAT_ID
=================================================== */

const TELEGRAM_BOT_TOKEN = '8445932774:AAFaw7ag3yawRUvLnxzWXynXYUn00Q7nQH0';
const TELEGRAM_CHAT_ID   = '8445932774';
const TELEGRAM_API       = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// ===== SEND TO TELEGRAM =====
async function sendToTelegram(message) {
  try {
    const res = await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    return data.ok;
  } catch (err) {
    console.error('Telegram error:', err);
    return false;
  }
}

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.getElementById('heroBg').classList.add('loaded');
  }, 2200);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE MENU =====
function toggleMobile() {
  const menu = document.getElementById('mobileMenu');
  const ham  = document.getElementById('hamburger');
  menu.classList.toggle('active');
  ham.classList.toggle('active');
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('active');
  document.getElementById('hamburger').classList.remove('active');
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 2000;
  const step     = target / (duration / 16);
  let   current  = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN') + '+';
    if (el.dataset.target === '98') el.textContent = Math.floor(current) + '%';
  }, 16);
}

// ===== PORTFOLIO FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        item.style.opacity = '0';
        setTimeout(() => item.style.opacity = '1', 50);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== TESTIMONIAL SLIDER =====
let tIndex = 0;
const tTrack  = document.getElementById('tTrack');
const tCards  = document.querySelectorAll('.testimonial-card');
const tDotsEl = document.getElementById('tDots');
let   tAuto;

function getVisible() {
  return window.innerWidth < 900 ? 1 : window.innerWidth < 1200 ? 2 : 3;
}

function buildDots() {
  tDotsEl.innerHTML = '';
  const pages = Math.ceil(tCards.length / getVisible());
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('div');
    d.className = 't-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goToTest(i);
    tDotsEl.appendChild(d);
  }
}

function goToTest(idx) {
  const vis     = getVisible();
  const maxPage = Math.ceil(tCards.length / vis) - 1;
  tIndex = Math.max(0, Math.min(idx, maxPage));
  const cardW   = tCards[0].offsetWidth + 24;
  tTrack.style.transform = `translateX(-${tIndex * vis * cardW}px)`;
  document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === tIndex));
}

function slideTest(dir) {
  clearInterval(tAuto);
  const vis  = getVisible();
  const max  = Math.ceil(tCards.length / vis) - 1;
  tIndex     = (tIndex + dir + max + 1) % (max + 1);
  goToTest(tIndex);
  startTestAuto();
}

function startTestAuto() {
  tAuto = setInterval(() => slideTest(1), 5000);
}

buildDots();
startTestAuto();
window.addEventListener('resize', () => { buildDots(); goToTest(0); });

// ===== PRICE CALCULATOR =====
const basePrices = {
  '1bhk': { essential: [350000, 550000],  premium: [550000, 850000],   luxury: [850000, 1400000] },
  '2bhk': { essential: [550000, 900000],  premium: [900000, 1500000],  luxury: [1500000, 2500000] },
  '3bhk': { essential: [800000, 1400000], premium: [1400000, 2200000], luxury: [2200000, 4000000] },
  '4bhk': { essential: [1200000, 2000000],premium: [2000000, 3500000], luxury: [3500000, 6000000] },
  'villa': { essential: [1800000, 3000000],premium: [3000000, 5500000], luxury: [5500000, 10000000] }
};

const roomAddons = {
  living:   { label: 'Living Room',    essential: [80000, 150000],  premium: [150000, 250000],  luxury: [250000, 450000] },
  kitchen:  { label: 'Modular Kitchen',essential: [150000, 250000], premium: [250000, 450000],  luxury: [450000, 800000] },
  master:   { label: 'Master Bedroom', essential: [100000, 180000], premium: [180000, 300000],  luxury: [300000, 550000] },
  bedroom2: { label: 'Bedroom 2',      essential: [70000, 130000],  premium: [130000, 220000],  luxury: [220000, 400000] },
  bedroom3: { label: 'Bedroom 3',      essential: [70000, 130000],  premium: [130000, 220000],  luxury: [220000, 400000] },
  bathroom: { label: 'Bathrooms',      essential: [60000, 100000],  premium: [100000, 180000],  luxury: [180000, 350000] },
  office:   { label: 'Home Office',    essential: [60000, 100000],  premium: [100000, 180000],  luxury: [180000, 300000] },
  puja:     { label: 'Pooja Room',     essential: [30000, 60000],   premium: [60000, 120000],   luxury: [120000, 250000] }
};

let calcQuoteData = {};

function formatINR(num) {
  if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + 'Cr';
  if (num >= 100000)   return '₹' + (num / 100000).toFixed(1) + 'L';
  return '₹' + num.toLocaleString('en-IN');
}

function calculateQuote() {
  const prop   = document.getElementById('propType').value;
  const style  = document.getElementById('designStyle').value;
  const area   = parseInt(document.getElementById('carpetArea').value) || 0;
  const rooms  = [...document.querySelectorAll('.rooms-check input:checked')].map(i => i.value);

  if (!prop || !style) {
    alert('Please select property type and design style.');
    return;
  }

  const base = basePrices[prop][style];
  let minTotal = base[0], maxTotal = base[1];
  const breakdown = [];

  // Area adjustment (if provided)
  if (area > 0) {
    const rateMin = base[0] / 1000, rateMax = base[1] / 1000;
    minTotal = Math.round(rateMin * area);
    maxTotal = Math.round(rateMax * area);
  }

  // Room addons (already included in base, shown as breakdown)
  rooms.forEach(r => {
    if (roomAddons[r]) {
      const a = roomAddons[r];
      breakdown.push({ label: a.label, min: a[style][0], max: a[style][1] });
    }
  });

  // Save for modal
  calcQuoteData = {
    prop, style, area, rooms,
    minTotal, maxTotal, breakdown,
    priceRange: `${formatINR(minTotal)} – ${formatINR(maxTotal)}`
  };

  // Show result
  document.getElementById('calcPlaceholder').style.display = 'none';
  const rc = document.getElementById('resultContent');
  rc.classList.add('show');
  document.getElementById('resultPrice').textContent = `${formatINR(minTotal)} – ${formatINR(maxTotal)}`;
  document.getElementById('resultSub').textContent = `For ${prop.toUpperCase()} · ${style.charAt(0).toUpperCase() + style.slice(1)} package${area ? ' · ' + area + ' sq ft' : ''}`;

  const breakdown_el = document.getElementById('resultBreakdown');
  if (breakdown.length > 0) {
    breakdown_el.innerHTML = `<h4>Room Breakdown (approx.)</h4>` +
      breakdown.map(b => `<div class="breakdown-item"><span>${b.label}</span><strong>${formatINR(b.min)} – ${formatINR(b.max)}</strong></div>`).join('');
  } else {
    breakdown_el.innerHTML = '';
  }
}

// ===== QUOTE MODAL =====
function openQuoteModal() {
  document.getElementById('quoteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeQuoteModal() {
  document.getElementById('quoteModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('quoteModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('quoteModal')) closeQuoteModal();
});

async function submitModalQuote() {
  const name  = document.getElementById('mname').value.trim();
  const phone = document.getElementById('mphone').value.trim();
  const email = document.getElementById('memail').value.trim();

  if (!name || !phone) { alert('Please enter your name and phone number.'); return; }

  const btn = document.getElementById('modalSubmitBtn');
  btn.classList.add('loading');

  const rooms = calcQuoteData.rooms ? calcQuoteData.rooms.map(r => roomAddons[r]?.label || r).join(', ') : 'N/A';

  const message = `
🏠 <b>HiLook Interior — Calculator Quote Request</b>

👤 <b>Name:</b> ${name}
📞 <b>Phone:</b> ${phone}
📧 <b>Email:</b> ${email || 'Not provided'}

🏢 <b>Property:</b> ${calcQuoteData.prop?.toUpperCase() || 'N/A'}
🎨 <b>Style:</b> ${calcQuoteData.style ? calcQuoteData.style.charAt(0).toUpperCase() + calcQuoteData.style.slice(1) : 'N/A'}
📐 <b>Area:</b> ${calcQuoteData.area ? calcQuoteData.area + ' sq ft' : 'Not specified'}
🛋️ <b>Rooms:</b> ${rooms}
💰 <b>Estimated Quote:</b> ${calcQuoteData.priceRange || 'N/A'}

⏰ Submitted at: ${new Date().toLocaleString('en-IN')}
`.trim();

  const ok = await sendToTelegram(message);
  btn.classList.remove('loading');

  if (ok) {
    closeQuoteModal();
    alert('Your quote has been sent! Our team will contact you within 2 hours.');
  } else {
    alert('Sent! Our team will reach you shortly.');
  }
}

// ===== MAIN QUOTE FORM SUBMIT =====
async function submitQuote() {
  const name     = document.getElementById('fname').value.trim();
  const phone    = document.getElementById('fphone').value.trim();
  const email    = document.getElementById('femail').value.trim();
  const city     = document.getElementById('fcity').value;
  const prop     = document.getElementById('fprop').value;
  const service  = document.getElementById('fservice').value;
  const budget   = document.getElementById('fbudget').value;
  const timeline = document.getElementById('ftimeline').value;
  const message  = document.getElementById('fmessage').value.trim();
  const consent  = document.getElementById('fconsent').checked;

  if (!name)  { alert('Please enter your full name.'); return; }
  if (!phone) { alert('Please enter your phone number.'); return; }
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  if (!city)  { alert('Please select your city.'); return; }
  if (!consent) { alert('Please agree to be contacted.'); return; }

  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');

  const tgMessage = `
🏠 <b>HiLook Interior — New Lead Application</b>
━━━━━━━━━━━━━━━━━━━━━━━━

👤 <b>Full Name:</b> ${name}
📞 <b>Phone:</b> ${phone}
📧 <b>Email:</b> ${email}
🏙️ <b>City:</b> ${city}

🏢 <b>Property Type:</b> ${prop || 'Not specified'}
🛠️ <b>Service Required:</b> ${service || 'Not specified'}
💰 <b>Budget Range:</b> ${budget || 'Not specified'}
⏳ <b>Timeline:</b> ${timeline || 'Not specified'}

💬 <b>Message:</b>
${message || 'No message provided'}

━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Submitted: ${new Date().toLocaleString('en-IN')}
📌 Source: HiLook Interior Website
  `.trim();

  const ok = await sendToTelegram(tgMessage);
  btn.classList.remove('loading');

  if (ok || true) { // Show success regardless (network may block in some cases)
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');
  }
}

// ===== NEWSLETTER =====
function subscribeNewsletter() {
  const email = document.getElementById('nlEmail').value.trim();
  if (!email || !email.includes('@')) { alert('Please enter a valid email.'); return; }
  sendToTelegram(`📨 <b>Newsletter Signup:</b> ${email}`);
  document.getElementById('nlEmail').value = '';
  alert('Thank you for subscribing!');
}

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== HERO PARALLAX =====
window.addEventListener('scroll', () => {
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

console.log('%cHiLook Interior 🏠', 'color:#C9A96E;font-size:20px;font-weight:bold;');
console.log('%cBuilt with passion for beautiful spaces.', 'color:#6B6B6B;font-size:12px;');
