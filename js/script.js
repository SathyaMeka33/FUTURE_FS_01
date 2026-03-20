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

  doc.querySelectorAll('a.page-link[href$=".html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || link.target === '_blank') return;

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

  const applyProjectExternalLinks = () => {
    doc.querySelectorAll('.project-card[data-category]').forEach((card) => {
      const githubUrl = (card.dataset.github || '').trim();
      const liveUrl = (card.dataset.live || '').trim();

      const githubLink = card.querySelector('.project-github-link');
      const liveLink = card.querySelector('.project-live-link');

      if (githubLink instanceof HTMLAnchorElement) {
        githubLink.href = githubUrl || '#';
      }

      if (liveLink instanceof HTMLAnchorElement) {
        liveLink.href = liveUrl || '#';
      }
    });
  };

  // Projects filter
  const filterButtons = doc.querySelectorAll('.filter-btn');
  if (filterButtons.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        doc.querySelectorAll('.project-card[data-category]').forEach((card) => {
          const cardCategory = card.dataset.category;
          const show = category === 'all' || category === cardCategory;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  applyProjectExternalLinks();

  // Project modal
  const modal = doc.getElementById('projectModal');
  const modalTitle = doc.getElementById('modalTitle');
  const modalText = doc.getElementById('modalText');
  const modalTags = doc.getElementById('modalTags');
  const modalClose = doc.getElementById('modalClose');

  if (modal && modalTitle && modalText && modalTags) {
    doc.addEventListener('click', (event) => {
      const btn = event.target instanceof Element ? event.target.closest('.open-project-modal') : null;
      if (!btn) return;

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

  const pathName = window.location.pathname.toLowerCase();
  const isStaticIndexPage = pathName === '/' || /\/index\.html$/i.test(pathName);
  const isStaticAboutPage = /\/about\.html$/i.test(pathName);
  const isStaticProjectsPage = /\/projects\.html$/i.test(pathName);
  const isStaticSkillsPage = /\/skills\.html$/i.test(pathName);
  const isStaticContactPage = /\/contact\.html$/i.test(pathName);

  const extractList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.results)) return payload.results;
    return [];
  };

  const normalizeApiUrl = (path) => {
    if (/^https?:\/\//i.test(path)) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const firstItem = (payload) => extractList(payload)[0] || null;

  const renderSkillTiles = (items) =>
    items
      .map((skill) => {
        const icon = normalizeApiUrl(skill.icon_source || 'images/brain-circuit.png');
        return `<article class="skill-tile magnetic"><div class="skill-icon"><img src="${escapeHtml(icon)}" alt="${escapeHtml(skill.name || 'Skill')} icon" /></div><p class="skill-name">${escapeHtml(String(skill.name || '').toUpperCase())}</p></article>`;
      })
      .join('');

  const renderTimelineCards = (items) =>
    items
      .map(
        (entry) =>
          `<article class="timeline-card timeline-item"><p class="meta">${escapeHtml(entry.meta_label || '')}</p><h3>${escapeHtml(entry.title || '')}</h3><p>${escapeHtml(entry.description || '')}</p></article>`
      )
      .join('');

  const renderProjectCard = (project) => {
    const category = escapeHtml(project.category || 'other');
    const title = escapeHtml(project.title || 'Untitled');
    const description = escapeHtml(project.description || '');
    const image = normalizeApiUrl(project.image_source || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
    const tags = (project.tech_stack || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join('');
    const modalTags = escapeHtml(project.tech_stack || 'Project');
    const github = escapeHtml(project.github_link || '');
    const liveDemo = escapeHtml(project.live_demo_link || '');

    return `<article class="project-card" data-category="${category}" data-modal-title="${title}" data-modal-text="${description}" data-modal-tags="${modalTags}" data-github="${github}" data-live="${liveDemo}"><div class="project-visual"><img src="${escapeHtml(image)}" alt="${title} preview" /><div class="project-overlay"></div></div><div class="project-content"><h3>${title}</h3><p>${description}</p><div class="tags">${tags}</div><div class="project-actions"><a href="#" class="magnetic project-github-link" target="_blank" rel="noopener noreferrer">GitHub</a><a href="#" class="magnetic project-live-link" target="_blank" rel="noopener noreferrer">Live Demo</a><button class="open-project-modal magnetic" type="button">Details</button></div></div></article>`;
  };

  const renderCertificationCard = (certification) => {
    const title = escapeHtml(certification.title || 'Certification');
    const issuer = escapeHtml(certification.issuer || '');
    const description = escapeHtml(certification.description || '');
    const image = certification.image_source ? normalizeApiUrl(certification.image_source) : '';
    const credentialUrl = certification.credential_url || '';
    const imageHtml = image
      ? `<figure class="achievement-media"><img src="${escapeHtml(image)}" alt="${title}" /></figure>`
      : '';
    const credentialHtml = credentialUrl
      ? `<div class="section-actions" style="justify-content:center; margin-top:8px;"><a href="${escapeHtml(credentialUrl)}" class="btn-outline magnetic" target="_blank" rel="noopener noreferrer">View Credential</a></div>`
      : '';

    return `<article class="achievement-card">${imageHtml}<h3>${title}</h3>${issuer ? `<p><strong>${issuer}</strong></p>` : ''}${description ? `<p>${description}</p>` : ''}${credentialHtml}</article>`;
  };

  const renderCodingProfileCard = (codingProfile) => {
    const platform = escapeHtml(codingProfile.platform || 'other');
    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
    const username = escapeHtml(codingProfile.username || 'profile');
    const profileUrl = escapeHtml(codingProfile.profile_url || '#');
    const rating = escapeHtml(codingProfile.rating || '');

    return `<article class="achievement-card"><h3>${platformName}</h3><p><strong>${username}</strong></p>${rating ? `<p>Rating: ${rating}</p>` : ''}<div class="section-actions" style="justify-content:center; margin-top:8px;"><a href="${profileUrl}" class="btn-outline magnetic" target="_blank" rel="noopener noreferrer">Open Profile</a></div></article>`;
  };

  const applyStaticIndexData = async () => {
    if (!isStaticIndexPage) return;

    try {
      const [aboutRes, skillsRes, projectsRes, achievementsRes, timelineRes, certificationsRes, codingProfilesRes] = await Promise.all([
        fetch('/api/about/', { cache: 'no-store' }),
        fetch('/api/skills/', { cache: 'no-store' }),
        fetch('/api/projects/', { cache: 'no-store' }),
        fetch('/api/achievements/', { cache: 'no-store' }),
        fetch('/api/timeline/', { cache: 'no-store' }),
        fetch('/api/certifications/', { cache: 'no-store' }),
        fetch('/api/coding-profiles/', { cache: 'no-store' })
      ]);

      if (!aboutRes.ok || !skillsRes.ok || !projectsRes.ok || !achievementsRes.ok || !timelineRes.ok || !certificationsRes.ok || !codingProfilesRes.ok) {
        return;
      }

      const [aboutData, skillsData, projectsData, achievementsData, timelineData, certificationsData, codingProfilesData] = await Promise.all([
        aboutRes.json(),
        skillsRes.json(),
        projectsRes.json(),
        achievementsRes.json(),
        timelineRes.json(),
        certificationsRes.json(),
        codingProfilesRes.json()
      ]);

      const aboutItems = extractList(aboutData);
      const skills = extractList(skillsData);
      const projects = extractList(projectsData);
      const achievements = extractList(achievementsData).filter((item) => item.is_active);
      const timeline = extractList(timelineData).filter((item) => item.is_active && item.page === 'home');
      const certifications = extractList(certificationsData).filter((item) => item.is_active);
      const codingProfiles = extractList(codingProfilesData).filter((item) => item.is_active);

      const about = aboutItems[0];
      if (about) {
        const aboutSubtitle = doc.getElementById('aboutSubtitle');
        const careerObjective = doc.getElementById('careerObjective');
        const educationSnapshot = doc.getElementById('educationSnapshot');
        const profileImage = doc.querySelector('.person-img');

        if (aboutSubtitle && about.subtitle) aboutSubtitle.textContent = about.subtitle;
        if (careerObjective && about.career_objective) careerObjective.textContent = about.career_objective;
        if (educationSnapshot && about.education_snapshot) educationSnapshot.textContent = about.education_snapshot;

        if (profileImage instanceof HTMLImageElement && about.profile_image_source) {
          profileImage.src = normalizeApiUrl(about.profile_image_source);
        }
      }

      const skillCounter = doc.querySelector('.about-stats .stat-card:nth-child(2) .count-value');
      const projectCounter = doc.querySelector('.about-stats .stat-card:nth-child(1) .count-value');
      const cgpaCounter = doc.querySelector('.about-stats .stat-card:nth-child(3) .count-value');
      if (skillCounter) skillCounter.dataset.target = String(skills.length);
      if (projectCounter) projectCounter.dataset.target = String(projects.length);
      if (cgpaCounter && about && about.cgpa !== null && about.cgpa !== undefined) {
        cgpaCounter.dataset.target = String(about.cgpa);
      }

      const skillsGrid = doc.getElementById('homeSkillsGrid');
      if (skillsGrid) {
        skillsGrid.innerHTML = '';
        skills.forEach((skill) => {
          const icon = normalizeApiUrl(skill.icon_source || 'images/brain-circuit.png');
          skillsGrid.insertAdjacentHTML(
            'beforeend',
            `<article class="skill-tile magnetic"><div class="skill-icon"><img src="${escapeHtml(icon)}" alt="${escapeHtml(skill.name)} icon" /></div><p class="skill-name">${escapeHtml(String(skill.name || '').toUpperCase())}</p></article>`
          );
        });
      }

      const projectsGrid = doc.getElementById('homeProjectsGrid');
      if (projectsGrid) {
        projectsGrid.innerHTML = '';
        projects.slice(0, 3).forEach((project, index) => {
          const actions = index === 1 || index === 0
            ? '<div class="section-actions"><a href="projects.html" class="btn page-link magnetic">Explore Projects</a></div>'
            : '';

          projectsGrid.insertAdjacentHTML(
            'beforeend',
            `<article class="preview-card"><h3>${escapeHtml(project.title || 'Untitled')}</h3><p>${escapeHtml(project.description || '')}</p>${actions}</article>`
          );
        });
      }

      const achievementsGrid = doc.getElementById('homeAchievementsGrid');
      if (achievementsGrid) {
        achievementsGrid.innerHTML = '';
        achievements.slice(0, 3).forEach((achievement) => {
          const image = achievement.image_source ? normalizeApiUrl(achievement.image_source) : '';
          const imageHtml = image
            ? `<figure class="achievement-media"><img src="${escapeHtml(image)}" alt="${escapeHtml(achievement.title || 'Achievement')}" /></figure>`
            : '';

          achievementsGrid.insertAdjacentHTML(
            'beforeend',
            `<article class="achievement-card">${imageHtml}<h3>${escapeHtml(achievement.title || 'Achievement')}</h3><p>${escapeHtml(achievement.description || '')}</p></article>`
          );
        });
      }

      const certificationsGrid = doc.getElementById('homeCertificationsGrid');
      if (certificationsGrid) {
        certificationsGrid.innerHTML = certifications.length
          ? certifications.map(renderCertificationCard).join('')
          : '<article class="achievement-card"><h3>No Certifications Yet</h3><p>Add certifications from admin to display them here.</p></article>';
      }

      const codingProfilesGrid = doc.getElementById('homeCodingProfilesGrid');
      if (codingProfilesGrid) {
        codingProfilesGrid.innerHTML = codingProfiles.length
          ? codingProfiles.map(renderCodingProfileCard).join('')
          : '<article class="achievement-card"><h3>No Coding Profiles Yet</h3><p>Add LeetCode, CodeChef, and Codeforces links from admin.</p></article>';
      }

      const timelineWrap = doc.getElementById('homeTimeline');
      if (timelineWrap && timeline.length) {
        timelineWrap.innerHTML = '';
        timeline.forEach((entry) => {
          timelineWrap.insertAdjacentHTML(
            'beforeend',
            `<article class="timeline-card timeline-item"><p class="meta">${escapeHtml(entry.meta_label || '')}</p><h3>${escapeHtml(entry.title || '')}</h3><p>${escapeHtml(entry.description || '')}</p></article>`
          );
        });
      }
    } catch (_error) {
      // If API is unavailable, keep static fallback content.
    }
  };

  const applyStaticAboutData = async () => {
    if (!isStaticAboutPage) return;

    try {
      const [aboutRes, skillsRes, projectsRes, timelineRes, achievementsRes, certificationsRes] = await Promise.all([
        fetch('/api/about/', { cache: 'no-store' }),
        fetch('/api/skills/', { cache: 'no-store' }),
        fetch('/api/projects/', { cache: 'no-store' }),
        fetch('/api/timeline/', { cache: 'no-store' }),
        fetch('/api/achievements/', { cache: 'no-store' }),
        fetch('/api/certifications/', { cache: 'no-store' })
      ]);

      if (!aboutRes.ok || !skillsRes.ok || !projectsRes.ok || !timelineRes.ok || !achievementsRes.ok || !certificationsRes.ok) return;

      const [aboutData, skillsData, projectsData, timelineData, achievementsData, certificationsData] = await Promise.all([
        aboutRes.json(),
        skillsRes.json(),
        projectsRes.json(),
        timelineRes.json(),
        achievementsRes.json(),
        certificationsRes.json()
      ]);

      const about = firstItem(aboutData);
      const skills = extractList(skillsData);
      const projects = extractList(projectsData);
      const timeline = extractList(timelineData).filter((item) => item.is_active && item.page === 'about');
      const achievements = extractList(achievementsData).filter((item) => item.is_active).slice(0, 3);
      const certifications = extractList(certificationsData).filter((item) => item.is_active);

      if (about) {
        const subtitle = doc.getElementById('aboutPageSubtitle');
        const introPrimary = doc.getElementById('aboutIntroPrimary');
        const introSecondary = doc.getElementById('aboutIntroSecondary');
        const profileImage = doc.getElementById('aboutPageProfileImage');

        if (subtitle) subtitle.textContent = about.subtitle || about.description || subtitle.textContent;
        if (introPrimary) introPrimary.textContent = about.career_objective || about.description || introPrimary.textContent;
        if (introSecondary) introSecondary.textContent = about.intro_secondary || introSecondary.textContent;
        if (profileImage instanceof HTMLImageElement && about.profile_image_source) {
          profileImage.src = normalizeApiUrl(about.profile_image_source);
        }
      }

      const chipsWrap = doc.getElementById('aboutPageChips');
      if (chipsWrap) {
        chipsWrap.innerHTML = skills
          .slice(0, 4)
          .map((skill) => `<span class="chip magnetic">${escapeHtml(skill.name || 'Skill')}</span>`)
          .join('');
      }

      const skillCounter = doc.querySelector('.about-stats .stat-card:nth-child(2) .count-value');
      const projectCounter = doc.querySelector('.about-stats .stat-card:nth-child(1) .count-value');
      const cgpaCounter = doc.querySelector('.about-stats .stat-card:nth-child(3) .count-value');
      if (skillCounter) skillCounter.dataset.target = String(skills.length);
      if (projectCounter) projectCounter.dataset.target = String(projects.length);
      if (cgpaCounter && about && about.cgpa !== null && about.cgpa !== undefined) {
        cgpaCounter.dataset.target = String(about.cgpa);
      }

      const timelineWrap = doc.getElementById('aboutPageTimeline');
      if (timelineWrap && timeline.length) {
        timelineWrap.innerHTML = renderTimelineCards(timeline);
      }

      const highlightsWrap = doc.getElementById('aboutPageHighlights');
      if (highlightsWrap && achievements.length) {
        highlightsWrap.innerHTML = achievements
          .map(
            (achievement) =>
              `<article class="highlight-card"><h3>${escapeHtml(achievement.title || 'Achievement')}</h3><p>${escapeHtml(achievement.description || '')}</p></article>`
          )
          .join('');
      }

      const certificationsWrap = doc.getElementById('aboutPageCertifications');
      if (certificationsWrap) {
        certificationsWrap.innerHTML = certifications.length
          ? certifications.map(renderCertificationCard).join('')
          : '<article class="achievement-card"><h3>No Certifications Yet</h3><p>Add certifications from admin to display them here.</p></article>';
      }
    } catch (_error) {
      // Keep fallback content when API is unavailable.
    }
  };

  const applyStaticProjectsData = async () => {
    if (!isStaticProjectsPage) return;

    try {
      const response = await fetch('/api/projects/', { cache: 'no-store' });
      if (!response.ok) return;
      const projects = extractList(await response.json());

      const subtitle = doc.getElementById('projectsPageSubtitle');
      if (subtitle) subtitle.textContent = `Showing ${projects.length} project(s) managed from admin.`;

      const grid = doc.getElementById('projectsPageGrid');
      if (!grid) return;

      grid.innerHTML = projects.map(renderProjectCard).join('');
      applyProjectExternalLinks();
    } catch (_error) {
      // Keep fallback content when API is unavailable.
    }
  };

  const applyStaticSkillsData = async () => {
    if (!isStaticSkillsPage) return;

    try {
      const response = await fetch('/api/skills/', { cache: 'no-store' });
      if (!response.ok) return;
      const skills = extractList(await response.json());

      const subtitle = doc.getElementById('skillsPageSubtitle');
      if (subtitle) subtitle.textContent = `Showing ${skills.length} skill(s) managed from admin.`;

      const showcase = doc.getElementById('skillsPageShowcase');
      if (!showcase) return;

      const groups = [
        { key: 'frontend', label: 'FRONTEND' },
        { key: 'programming', label: 'PROGRAMMING LANGUAGES' },
        { key: 'tools', label: 'TOOLS & CORE CONCEPTS' },
        { key: 'other', label: 'OTHER' }
      ]
        .map((group) => ({ ...group, items: skills.filter((skill) => skill.category === group.key) }))
        .filter((group) => group.items.length);

      showcase.innerHTML = groups
        .map(
          (group, index) =>
            `${index > 0 ? `<div class="skills-band reveal"><h3 class="skills-band-title">${group.label}</h3></div>` : ''}<div class="skill-card-grid">${renderSkillTiles(group.items)}</div>`
        )
        .join('');
    } catch (_error) {
      // Keep fallback content when API is unavailable.
    }
  };

  const applyStaticContactData = async () => {
    if (!isStaticContactPage) return;

    try {
      const response = await fetch('/api/contact-info/', { cache: 'no-store' });
      if (!response.ok) return;

      const info = firstItem(await response.json());
      if (!info) return;

      const subtitle = doc.getElementById('contactPageSubtitle');
      const reachText = doc.getElementById('contactReachText');
      const location = doc.getElementById('contactLocation');
      const phone = doc.getElementById('contactPhone');
      const email = doc.getElementById('contactEmail');
      const linkedin = doc.getElementById('contactLinkedin');
      const leetcode = doc.getElementById('contactLeetcode');

      if (subtitle && info.contact_subtitle) subtitle.textContent = info.contact_subtitle;
      if (reachText && info.contact_subtitle) reachText.textContent = info.contact_subtitle;
      if (location) location.innerHTML = `<strong>Location:</strong> ${escapeHtml(info.location || '')}`;
      if (phone) phone.innerHTML = `<strong>Phone:</strong> ${escapeHtml(info.phone || '')}`;
      if (email) email.innerHTML = `<strong>Email:</strong> ${escapeHtml(info.email || '')}`;
      if (linkedin instanceof HTMLAnchorElement && info.linkedin_url) linkedin.href = info.linkedin_url;
      if (leetcode instanceof HTMLAnchorElement && info.leetcode_url) leetcode.href = info.leetcode_url;
    } catch (_error) {
      // Keep fallback content when API is unavailable.
    }
  };

  applyStaticIndexData();
  applyStaticAboutData();
  applyStaticProjectsData();
  applyStaticSkillsData();
  applyStaticContactData();

  // Admin-driven live refresh on static pages.
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
      // API might be unreachable if page is opened outside Django host.
    }
  };

  pollPortfolioSignature();
  window.setInterval(pollPortfolioSignature, 10000);
})();
