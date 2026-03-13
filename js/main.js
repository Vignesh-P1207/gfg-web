// =============================================
// GFG Student Chapter - Main JavaScript
// =============================================

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
if (navbar && !navbar.classList.contains('scrolled')) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  // Close when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// ---- Animated counter ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

// ---- Intersection Observer for animations ----
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;

      // Counter animation
      if (el.classList.contains('stat-number')) {
        animateCounter(el);
        observer.unobserve(el);
      }

      // Mission cards stagger
      if (el.classList.contains('mission-card')) {
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }

      // Progress bars
      if (el.classList.contains('path-fill')) {
        el.style.width = el.getAttribute('data-width') || el.style.width;
        observer.unobserve(el);
      }
    }
  });
}, observerOptions);

// Observe stat numbers
document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
document.querySelectorAll('.mission-card').forEach(el => observer.observe(el));

// ---- Progress bars: store initial width and animate on scroll ----
document.querySelectorAll('.path-fill').forEach(el => {
  const w = el.style.width;
  el.setAttribute('data-width', w);
  el.style.width = '0%';
  observer.observe(el);
});

// ---- Smooth active link detection ----
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');
if (sections.length && navLinkEls.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));
}

// ---- Button ripple effect ----
document.querySelectorAll('.btn-primary, .btn-outline, .btn-white').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      width: 10px;
      height: 10px;
      left: ${e.clientX - rect.left - 5}px;
      top: ${e.clientY - rect.top - 5}px;
      animation: ripple-anim 0.6s linear forwards;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(30); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// ---- Card hover parallax (subtle) ----
document.querySelectorAll('.team-card, .event-card, .mission-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- XP bar animation on dashboard ----
const xpBar = document.querySelector('.xp-bar-fill');
if (xpBar) {
  setTimeout(() => {
    xpBar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
    xpBar.style.width = '62%';
  }, 500);
}

console.log('%cGFG Student Chapter 🚀', 'color: #2f8e47; font-size: 18px; font-weight: bold;');
