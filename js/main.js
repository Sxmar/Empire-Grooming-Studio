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
  // Ensure service cards and add-service-items have reveal-up
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

  document.querySelectorAll('.service-card, .add-service-item').forEach(el => {
    observer.observe(el);
  });
})();
