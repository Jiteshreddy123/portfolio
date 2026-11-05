/**
 * Y. Jitesh Reddy — Portfolio Experience Scripts
 * Purpose: Smooth UI micro-interactions, peaceful filtering, dynamic time, and 1-click clipboard actions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Dynamic Year in Footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Elevation on Scroll
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 3. Hover-to-navigate without clicking ("land into them on hover")
  const scrollToTarget = (targetSelector) => {
    if (!targetSelector) return;
    try {
      const target = document.querySelector(targetSelector);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) {
      // safe fallback
    }
  };

  // Header Navigation Items (Projects, Experience, Philosophy, Background, Brand, Contact)
  const headerLinks = document.querySelectorAll('.site-header .nav-link, .site-header .brand-signature, .site-header .btn-glass-nav');
  headerLinks.forEach(link => {
    let hoverTimer = null;
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
          scrollToTarget(href);
        }, 180);
      });
      link.addEventListener('mouseleave', () => {
        if (hoverTimer) clearTimeout(hoverTimer);
      });
    }
  });

  // Hero Pillar Cards (hover or click to glide into corresponding sections)
  const interactivePillars = document.querySelectorAll('.interactive-pillar');
  interactivePillars.forEach(pillar => {
    let hoverTimer = null;
    const target = pillar.getAttribute('data-target');
    if (target) {
      pillar.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
          scrollToTarget(target);
        }, 220);
      });
      pillar.addEventListener('mouseleave', () => {
        if (hoverTimer) clearTimeout(hoverTimer);
      });
      pillar.addEventListener('click', () => {
        if (hoverTimer) clearTimeout(hoverTimer);
        scrollToTarget(target);
      });
    }
  });

  // 4. Project Filtering System (Care, Optimization, Data, All)
  const filterChips = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.project-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Update active chip state
      filterChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');

      const filterValue = chip.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Add gentle entry animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.transition = 'opacity 260ms ease, transform 260ms ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 5. Active Nav Link Tracking with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
  }

  // 6. Copy-to-Clipboard with Serene Toast
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  };

  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'mail4y.jitesh@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback method
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        showToast(`Copied ${email} to clipboard!`);
      } catch (err) {
        showToast(`Email: ${email}`);
      }
    });
  });

});
