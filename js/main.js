/**
 * Empire Grooming Studio — Main JavaScript
 * Features: Preloader, Navbar scroll, Mobile menu, Scroll animations, Smooth scroll
 */

/* ──────────────────────────────────────────────
   1. PRELOADER
────────────────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // After 2.2s the fill animation is done — fade out preloader
  const dismiss = () => {
    preloader.classList.add('fade-out');
    document.body.classList.remove('no-scroll');
    preloader.addEventListener('transitionend', () => {
      preloader.remove();
    }, { once: true });
  };

  // Prevent body scroll while loading
  document.body.classList.add('no-scroll');

  // Wait for window load OR timeout (whichever comes first)
  let dismissed = false;
  const safeDismiss = () => {
    if (!dismissed) {
      dismissed = true;
      dismiss();
    }
  };

  window.addEventListener('load', () => {
    // Buffer allows the fill animation to complete visually
    setTimeout(safeDismiss, 1200);
  });

  // Hard fallback
  setTimeout(safeDismiss, 5500);
})();


/* ──────────────────────────────────────────────
   2. NAVBAR — scroll state & active link
────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  if (!navbar) return;

  const onScroll = () => {
    // Scrolled style
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link detection
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ──────────────────────────────────────────────
   3. MOBILE MENU
────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger     = document.getElementById('hamburger');
  const mobileMenu    = document.getElementById('mobileMenu');
  const mobileClose   = document.getElementById('mobileClose');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks   = document.querySelectorAll('.mobile-link, .mobile-book-btn');

  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('show');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ──────────────────────────────────────────────
   SHOP DATA — single source of truth
────────────────────────────────────────────── */
const SHOP = {
  booksy: 'https://booksy.com/en-ca/instant-experiences/widget/7507?instant_experiences_enabled=true&ig_ix=true&staffer_id=36879&utm_source=ig&utm_medium=social&utm_content=link_in_bio',
  staff: [
    'Shiv (Owner)', 'GillCutzz', 'Karan (KV)',
    'Preet', 'Shaan', 'Sukhman (SG)', 'Sumeet',
  ],
  services: {
    popular: [
      { name: 'Haircut',         price: '$25 - $50', duration: '30-45 min' },
      { name: 'Haircut & Beard', price: '$35 - $60', duration: '45-60 min' },
      { name: 'Line Up & Beard', price: '$15 - $40', duration: '15-30 min' },
    ],
    other: [
      { name: 'House Calls',         price: '$200+', duration: '2h'    },
      { name: 'High School Special', price: '$20',   duration: '45min' },
    ],
    packages: [
      { name: 'Bronze Package', price: '$45 - $70', duration: '45min - 1h'    },
      { name: 'Silver Package', price: '$55 - $80', duration: '1h - 1h 15min' },
      { name: 'Gold Package',   price: '$100',       duration: '1h 15min'      },
    ],
    additional: [
      { name: 'Eyebrow Line Up',           price: '$5',  duration: '5min'  },
      { name: 'Facial Waxing',             price: '$30', duration: '30min' },
      { name: 'Hair Colour (Scalp/Beard)', price: '$30', duration: '15min' },
      { name: 'Hair Colour (Both)',        price: '$50', duration: '30min' },
      { name: 'Hot Towel',                 price: '$10', duration: '15min' },
      { name: 'Design',                    price: '$10', duration: '15min' },
    ],
  },
};


/* ──────────────────────────────────────────────
   SERVICE RENDERER — builds services from data
────────────────────────────────────────────── */
(function initServicesRenderer() {
  const container = document.getElementById('services-render');
  if (!container) return;

  const SVC_ICONS = {
    'Haircut':             'fa-cut',
    'Haircut & Beard':     'fa-user-tie',
    'Line Up & Beard':     'fa-magic',
    'House Calls':         'fa-car',
    'High School Special': 'fa-graduation-cap',
    'Bronze Package':      'fa-award',
    'Silver Package':      'fa-star',
    'Gold Package':        'fa-crown',
  };

  const SVC_DESCS = {
    'Haircut':             'Clean, precise cuts tailored to your personal style and structure.',
    'Haircut & Beard':     'Complete look — a sharp cut paired with a defined, sculpted beard.',
    'Line Up & Beard':     'Crisp edges and a polished beard for a refined, clean finish.',
    'House Calls':         'We come to you — professional grooming at your home or event.',
    'High School Special': 'Quality cuts at a student-friendly price. Show your student ID.',
    'Bronze Package':      'Haircut + Beard Trim + Style Finish — the essentials, done right.',
    'Silver Package':      'Bronze + Eyebrow Line Up + Hot Towel — elevated grooming.',
    'Gold Package':        'Full premium treatment — our complete Empire experience, all-in.',
  };

  const PKG_BADGES = {
    'Silver Package': { label: 'Most Popular', cls: '' },
    'Gold Package':   { label: 'Ultimate',     cls: 'gold-badge' },
  };

  const ADD_ICONS = {
    'Eyebrow Line Up':           'fa-bezier-curve',
    'Facial Waxing':             'fa-spa',
    'Hair Colour (Scalp/Beard)': 'fa-paint-brush',
    'Hair Colour (Both)':        'fa-palette',
    'Hot Towel':                 'fa-fire',
    'Design':                    'fa-pen-nib',
  };

  function serviceCard(svc, featured) {
    const icon  = SVC_ICONS[svc.name] || 'fa-cut';
    const desc  = SVC_DESCS[svc.name] || '';
    const badge = featured ? (PKG_BADGES[svc.name] || null) : null;
    const badgeHTML = badge
      ? `<div class="card-badge${badge.cls ? ' ' + badge.cls : ''}">${badge.label}</div>`
      : '';
    return `
      <div class="service-card${featured ? ' featured-card' : ''}">
        ${badgeHTML}
        <div class="service-card-inner">
          <div class="service-icon"><i class="fas ${icon}"></i></div>
          <h4 class="service-name">${svc.name}</h4>
          <p class="service-desc">${desc}</p>
          <div class="service-footer">
            <span class="service-price">${svc.price}</span>
            <span class="service-time"><i class="far fa-clock"></i> ${svc.duration}</span>
          </div>
          <a href="${SHOP.booksy}" target="_blank" rel="noopener noreferrer"
             class="btn btn-gold-sm ripple-btn">Book</a>
        </div>
      </div>`;
  }

  function addItem(item) {
    const icon = ADD_ICONS[item.name] || 'fa-plus';
    return `
      <div class="add-service-item">
        <div class="add-icon"><i class="fas ${icon}"></i></div>
        <div class="add-info">
          <h4>${item.name}</h4>
          <span class="add-time"><i class="far fa-clock"></i> ${item.duration}</span>
        </div>
        <span class="add-price">${item.price}</span>
      </div>`;
  }

  function servicesBlock(label, catIcon, cardsHTML) {
    return `
      <div class="services-block reveal-up">
        <h3 class="service-category">
          <span class="category-icon"><i class="fas ${catIcon}"></i></span>
          ${label}
        </h3>
        <div class="services-grid">${cardsHTML}</div>
      </div>`;
  }

  const html = [
    servicesBlock(
      'Popular Services', 'fa-scissors',
      SHOP.services.popular.map(s => serviceCard(s, false)).join('')
    ),
    servicesBlock(
      'More Services', 'fa-plus-circle',
      SHOP.services.other.map(s => serviceCard(s, false)).join('')
    ),
    servicesBlock(
      'Packages', 'fa-crown',
      SHOP.services.packages.map(s => serviceCard(s, true)).join('')
    ),
    `<div class="services-block reveal-up">
      <h3 class="service-category">
        <span class="category-icon"><i class="fas fa-plus-circle"></i></span>
        Additional Services
      </h3>
      <div class="add-services-grid">
        ${SHOP.services.additional.map(s => addItem(s)).join('')}
      </div>
    </div>`,
  ].join('');

  container.innerHTML = html;
})();


/* ──────────────────────────────────────────────
   BARBERS RENDERER — builds team from data
────────────────────────────────────────────── */
(function initBarbersRenderer() {
  const container = document.getElementById('barbers-render');
  if (!container) return;

  function getInitials(name) {
    const clean = name.replace(/\s*\([^)]+\)\s*/g, '').trim();
    const words = clean.split(/\s+/);
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    const first = words[0];
    const extra = first.slice(1).match(/[A-Z]/);
    return extra ? (first[0] + extra[0]).toUpperCase() : first.slice(0, 2).toUpperCase();
  }

  function getDisplayName(name) {
    return name.replace(/\s*\([^)]+\)/g, '').trim();
  }

  function barberCard(name, index) {
    const isOwner  = name.includes('(Owner)');
    const shown    = getDisplayName(name);
    const abbr     = getInitials(name);
    const role     = isOwner ? 'Owner &amp; Master Barber' : 'Barber';
    const badge    = isOwner ? ' <span class="barber-badge">Owner</span>' : '';
    const colorIdx = (index % 7) + 1;
    const delay    = (index * 0.07).toFixed(2);
    return `
      <div class="barber-card reveal-up" style="--delay:${delay}s">
        <div class="barber-avatar bc-${colorIdx}">
          <span class="barber-initials">${abbr}</span>
        </div>
        <div class="barber-info">
          <h4 class="barber-name">${shown}${badge}</h4>
          <p class="barber-role">${role}</p>
        </div>
        <a href="${SHOP.booksy}" target="_blank" rel="noopener noreferrer"
           class="btn btn-gold-sm barber-book">Book</a>
      </div>`;
  }

  container.innerHTML = SHOP.staff.map((name, i) => barberCard(name, i)).join('');
})();


/* ──────────────────────────────────────────────
   4. SCROLL-TRIGGERED REVEAL ANIMATIONS
   Uses IntersectionObserver for performance
────────────────────────────────────────────── */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation triggers (one-shot)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   5. SMOOTH SCROLL — respect prefers-reduced-motion
────────────────────────────────────────────── */
(function initSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const NAV_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
})();


/* ──────────────────────────────────────────────
   6. FOOTER — current year
────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ──────────────────────────────────────────────
   7. BOOKING BUTTON — ripple + glow on click
────────────────────────────────────────────── */
(function initBookingButtonEffect() {
  const bookingBtns = document.querySelectorAll('.ripple-btn');
  bookingBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Brief scale pop on click for tactile feedback
      this.style.transform = 'scale(0.97)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
})();


/* ──────────────────────────────────────────────
   8. SERVICE CARDS — staggered reveal
   Cards within each grid get their reveal-up
   class applied so the IntersectionObserver
   picks them up automatically. Additional
   stagger is handled via CSS --delay vars.
────────────────────────────────────────────── */
(function initCardStagger() {
  document.querySelectorAll('.barber-card').forEach((card, i) => {
    card.classList.add('reveal-up');
  });

  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.classList.add('reveal-up');
    card.style.setProperty('--delay', `${i * 0.1}s`);
  });

  document.querySelectorAll('.add-service-item').forEach((item, i) => {
    item.classList.add('reveal-up');
    item.style.setProperty('--delay', `${i * 0.08}s`);
  });

  // Re-run observer to pick up newly added elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.service-card, .add-service-item, .barber-card').forEach(el => {
    observer.observe(el);
  });
})();
