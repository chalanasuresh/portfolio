/**
 * CHALANA M S — PORTFOLIO JAVASCRIPT
 * Interactive features, animations, navigation, modal, and utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initHeaderScroll();
  initMobileNav();
  initActiveNavObserver();
  initSkillsFilter();
  initClipboardCopy();
  initProjectModal();
  initContactForm();
  initBackToTop();
  initCardSpotlights();
  updateCurrentYear();
});

/* --------------------------------------------------------------------------
   1. TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'Computer Science & Engineering Student',
    'Aspiring Software Engineer',
    'Full-Stack Developer (MERN)',
    'Algorithmic Problem Solver'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeStep() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      el.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

/* --------------------------------------------------------------------------
   2. HEADER SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggleBtn || !mobileNav) return;

  const toggleMenu = (isOpen) => {
    const shouldOpen = isOpen !== undefined ? isOpen : !mobileNav.classList.contains('open');
    if (shouldOpen) {
      mobileNav.classList.add('open');
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.classList.remove('open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close when clicking mobile links
  const mobileLinks = mobileNav.querySelectorAll('[data-close]');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   4. ACTIVE NAVIGATION LINK TRACKING (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-list .mobile-nav-link');

  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Update Desktop nav
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update Mobile nav
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   5. SKILLS FILTERING TABS
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-container .filter-btn');
  const skillBlocks = document.querySelectorAll('.skill-category-block');

  if (!filterBtns.length || !skillBlocks.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillBlocks.forEach(block => {
        const category = block.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          block.classList.remove('is-hidden');
          block.style.opacity = '0';
          setTimeout(() => {
            block.style.opacity = '1';
          }, 40);
        } else {
          block.classList.add('is-hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. CLIPBOARD COPY UTILITY WITH TOAST
   -------------------------------------------------------------------------- */
function initClipboardCopy() {
  const copyButtons = document.querySelectorAll('[data-clipboard]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.classList.add('copied');
        showToast(`Copied to clipboard: ${textToCopy}`);

        setTimeout(() => {
          btn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        // Fallback for non-https or older browser permissions
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          btn.classList.add('copied');
          showToast(`Copied: ${textToCopy}`);
          setTimeout(() => btn.classList.remove('copied'), 2200);
        } catch (copyErr) {
          showToast(`Unable to copy automatically.`, 'error');
        }
        document.body.removeChild(textArea);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<polyline points="20 6 9 17 4 12"/>' 
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 3.2s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

/* --------------------------------------------------------------------------
   8. PROJECT MODAL (CODESYNC)
   -------------------------------------------------------------------------- */
function initProjectModal() {
  const modal = document.getElementById('codesync-modal');
  const openBtn = document.getElementById('open-project-details-btn');
  const closeBtn = document.getElementById('modal-close-btn');
  const dismissBtn = document.getElementById('modal-dismiss-btn');
  const contactCta = document.getElementById('modal-contact-cta');

  if (!modal || !openBtn) return;

  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (contactCta) contactCta.addEventListener('click', closeModal);

  // Close when clicking backdrop outside modal card
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   9. CONTACT FORM INTERACTION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const alertBox = document.getElementById('form-status-alert');
  if (!form || !alertBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    let isValid = true;

    // Reset error states
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
    alertBox.className = 'form-status-alert';
    alertBox.style.display = 'none';

    // Name validation
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Message validation
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) {
      alertBox.textContent = 'Please fill out all required fields with valid details.';
      alertBox.className = 'form-status-alert error';
      alertBox.style.display = 'block';
      return;
    }

    // Prepare mailto link
    const recipient = 'chalanams@gmail.com';
    const subject = encodeURIComponent(subjectInput.value.trim() || `Portfolio Inquiry from ${nameInput.value.trim()}`);
    const body = encodeURIComponent(
      `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
    );

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // Display success confirmation message
    alertBox.innerHTML = `
      <strong>Message Prepared!</strong> Opening your default mail client to deliver your message to <strong>chalanams@gmail.com</strong>.
    `;
    alertBox.className = 'form-status-alert success';
    alertBox.style.display = 'block';

    showToast('Launching email client...');

    // Open mail client after slight pause
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 400);
  });
}

/* --------------------------------------------------------------------------
   10. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
}

/* --------------------------------------------------------------------------
   11. CARD SPOTLIGHT EFFECT (MODERN CURSOR GLOW)
   -------------------------------------------------------------------------- */
function initCardSpotlights() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   12. CURRENT YEAR HELPER
   -------------------------------------------------------------------------- */
function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
