(() => {
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  const preloader = doc.getElementById('preloader');
  const nav = doc.getElementById('nav');
  const navToggle = doc.getElementById('navToggle');
  const navMenu = doc.getElementById('navMenu');
  const progressBar = doc.getElementById('scrollProgress');
  const scrollTopBtn = doc.getElementById('scrollTopBtn');
  const progressCircle = doc.querySelector('.progress-ring__circle');
  const progressValue = doc.querySelector('.scroll-progress-value');
  const themeToggle = doc.getElementById('themeToggle');
  const themeIcon = doc.getElementById('themeIcon');
  const blobs = Array.from(doc.querySelectorAll('.blob'));
  const isHomePage = /\/index\.html$/i.test(window.location.pathname) || window.location.pathname.endsWith('/');
  const typewriterTextEl = doc.getElementById('typewriterText');

  const setThemeIcon = () => {
    if (!themeIcon) return;
    themeIcon.textContent = root.dataset.theme === 'dark' ? '☾' : '☼';
  };

  const applyStoredTheme = () => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'light') {
      root.dataset.theme = saved;
    }
    setThemeIcon();
  };

  applyStoredTheme();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('portfolio-theme', next);
      setThemeIcon();
    });
  }

  const bootAt = performance.now();
  window.addEventListener('load', () => {
    const minIntroMs = isHomePage ? 1200 : 220;
    const elapsed = performance.now() - bootAt;
    const wait = Math.max(120, minIntroMs - elapsed);
    setTimeout(() => {
      if (preloader) preloader.classList.add('hide');
    }, wait);
  });

  let circleLength = 0;
  if (progressCircle) {
    const radius = Number(progressCircle.getAttribute('r') || 26);
    circleLength = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circleLength}`;
    progressCircle.style.strokeDashoffset = `${circleLength}`;
  }

  const updateScrollUI = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('shadow', y > 8);

    const scrollHeight = doc.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (y / scrollHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', y > 100);

      const percent = Math.max(0, Math.min(100, Math.round(progress)));
      if (progressValue) {
        progressValue.textContent = `${percent}%`;
      }

      if (progressCircle && circleLength > 0) {
        const offset = circleLength - (percent / 100) * circleLength;
        progressCircle.style.strokeDashoffset = `${offset}`;
      }

      scrollTopBtn.classList.toggle('complete', percent >= 100);
    }
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => smoothScrollTo(0, 700));
  }

  const footerTopBtn = doc.querySelector('[data-footer-scroll-top]');
  if (footerTopBtn) {
    footerTopBtn.addEventListener('click', () => smoothScrollTo(0, 760));
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open') ? 'true' : 'false');
    });

    navMenu.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches('a')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function smoothScrollTo(targetY, duration = 750) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOut(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  doc.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const section = doc.querySelector(href);
      if (!section) return;

      event.preventDefault();
      const navOffset = nav ? nav.offsetHeight : 0;
      const targetY = section.getBoundingClientRect().top + window.scrollY - navOffset + 1;
      smoothScrollTo(targetY, 780);
      history.replaceState(null, '', href);
    });
  });

  // Fade transition between pages
  body.classList.add('fade-enter');
  requestAnimationFrame(() => {
    body.classList.add('fade-enter-active');
  });

  setTimeout(() => {
    body.classList.remove('fade-enter', 'fade-enter-active');
  }, 520);

  doc.querySelectorAll('a.page-link[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      body.classList.add('fade-leave', 'fade-leave-active');
      setTimeout(() => {
        window.location.href = href;
      }, 290);
    });
  });

  // Section reveal animations
  const revealItems = doc.querySelectorAll('.reveal');
  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (entry.target.classList.contains('timeline')) {
            entry.target.classList.add('in-view');
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // About section live counters
  const statsWrap = doc.querySelector('.about-stats');
  if (statsWrap) {
    const counters = statsWrap.querySelectorAll('.count-value');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        counters.forEach((counter) => {
          const target = Number(counter.dataset.target || 0);
          const decimals = Number(counter.dataset.decimals || 0);
          const suffix = counter.dataset.suffix || '';
          const duration = 1400;
          const startAt = performance.now();

          const render = (now) => {
            const t = Math.min((now - startAt) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = target * eased;
            const output = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
            counter.textContent = `${output}${suffix}`;
            if (t < 1) requestAnimationFrame(render);
          };

          requestAnimationFrame(render);
        });

        counterObserver.disconnect();
      });
    }, { threshold: 0.35 });

    counterObserver.observe(statsWrap);
  }

  // Active links by section on home
  const sectionIds = ['home', 'about', 'projects', 'achievements', 'certifications', 'coding-profiles', 'skills', 'contact'];
  const sections = sectionIds
    .map((id) => doc.getElementById(id))
    .filter(Boolean);

  if (sections.length > 1) {
    const linkMap = new Map();
    doc.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) linkMap.set(href.slice(1), link);
    });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        const active = linkMap.get(id);
        if (!active) return;
        linkMap.forEach((link) => link.classList.remove('active'));
        active.classList.add('active');
      });
    }, { threshold: 0.45 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Magnetic hover effects
  doc.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  // Background parallax
  let raf = 0;
  const updateParallax = (mouseX = window.innerWidth * 0.5, mouseY = window.innerHeight * 0.5) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      blobs.forEach((blob, idx) => {
        const depth = (idx + 1) * 0.9;
        const moveX = ((mouseX / window.innerWidth) - 0.5) * 18 * depth;
        const moveY = ((mouseY / window.innerHeight) - 0.5) * 10 * depth + scrollY * 0.03 * (idx + 1);
        blob.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });
  };

  doc.addEventListener('mousemove', (event) => {
    updateParallax(event.clientX, event.clientY);
  }, { passive: true });

  window.addEventListener('scroll', () => updateParallax(), { passive: true });

  // Hero typewriter animation (home page only)
  if (isHomePage && typewriterTextEl) {
    const roles = [
      'Data Science Student',
      'Python Developer',
      'Java Developer',
      'Django Developer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentRole = roles[roleIndex];
      charIndex += isDeleting ? -1 : 1;

      typewriterTextEl.textContent = currentRole.slice(0, charIndex);

      const typedWholeWord = !isDeleting && charIndex === currentRole.length;
      const erasedWord = isDeleting && charIndex === 0;

      if (typedWholeWord) {
        isDeleting = true;
        setTimeout(tick, 1500);
        return;
      }

      if (erasedWord) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 260);
        return;
      }

      const delay = isDeleting
        ? 52 + Math.random() * 22
        : 88 + Math.random() * 36;
      setTimeout(tick, delay);
    };

    tick();
  }

  // Projects filter
  const filterButtons = doc.querySelectorAll('.filter-btn');
  const projectCards = doc.querySelectorAll('.project-card[data-category]');

  // Apply per-project external links from card data attributes.
  projectCards.forEach((card) => {
    const githubUrl = (card.dataset.github || '').trim();
    const liveUrl = (card.dataset.live || '').trim();

    const githubLink = card.querySelector('.project-github-link');
    const liveLink = card.querySelector('.project-live-link');

    if (githubLink instanceof HTMLAnchorElement) {
      if (githubUrl) {
        githubLink.href = githubUrl;
      } else {
        githubLink.href = '#';
        githubLink.addEventListener('click', (event) => event.preventDefault());
      }
    }

    if (liveLink instanceof HTMLAnchorElement) {
      if (liveUrl) {
        liveLink.href = liveUrl;
      } else {
        liveLink.href = '#';
        liveLink.addEventListener('click', (event) => event.preventDefault());
      }
    }
  });

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach((card) => {
          const cardCategory = card.dataset.category;
          const show = category === 'all' || category === cardCategory;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Project modal
  const modal = doc.getElementById('projectModal');
  const modalTitle = doc.getElementById('modalTitle');
  const modalText = doc.getElementById('modalText');
  const modalTags = doc.getElementById('modalTags');
  const modalClose = doc.getElementById('modalClose');

  if (modal && modalTitle && modalText && modalTags) {
    doc.querySelectorAll('.open-project-modal').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.project-card');
        if (!card) return;

        const title = card.dataset.modalTitle || 'Project details';
        const description = card.dataset.modalText || 'Detailed project information.';
        const tags = (card.dataset.modalTags || '').split(',').filter(Boolean);

        modalTitle.textContent = title;
        modalText.textContent = description;
        modalTags.innerHTML = tags.map((tag) => `<span class="tag">${tag.trim()}</span>`).join('');

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      });
    });

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Contact form inline validation
  const contactForm = doc.getElementById('contactForm');
  if (contactForm) {
    const nameField = doc.getElementById('name');
    const emailField = doc.getElementById('email');
    const messageField = doc.getElementById('message');
    const success = doc.getElementById('formSuccess');

    const setError = (field, message) => {
      const errorEl = doc.getElementById(`${field.id}Error`);
      if (errorEl) errorEl.textContent = message;
    };

    const validate = () => {
      let valid = true;
      setError(nameField, '');
      setError(emailField, '');
      setError(messageField, '');

      if (!nameField.value.trim()) {
        setError(nameField, 'Please enter your name.');
        valid = false;
      }

      const emailValue = emailField.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValue) {
        setError(emailField, 'Please enter your email.');
        valid = false;
      } else if (!emailPattern.test(emailValue)) {
        setError(emailField, 'Please enter a valid email address.');
        valid = false;
      }

      if (!messageField.value.trim()) {
        setError(messageField, 'Please write a short message.');
        valid = false;
      }

      return valid;
    };

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validate()) {
        if (success) success.classList.remove('show');
        return;
      }

      if (success) {
        success.classList.add('show');
        success.textContent = 'Thank you. Your message has been sent successfully.';
      }
      contactForm.reset();
    });
  }

  // Admin-driven live refresh: reload page only when portfolio data changes.
  const signatureEndpoint = '/api/portfolio-signature/';
  let currentSignature = null;
  let isRefreshing = false;

  const pollPortfolioSignature = async () => {
    if (isRefreshing || document.hidden) return;

    try {
      const response = await fetch(signatureEndpoint, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) return;
      const data = await response.json();
      if (!data || typeof data.signature !== 'string' || !data.signature) return;

      if (!currentSignature) {
        currentSignature = data.signature;
        return;
      }

      if (currentSignature !== data.signature) {
        isRefreshing = true;
        window.location.reload();
      }
    } catch (_error) {
      // Network hiccups should not interrupt page behavior.
    }
  };

  pollPortfolioSignature();
  window.setInterval(pollPortfolioSignature, 10000);
})();
