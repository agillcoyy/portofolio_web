/**
 * Modern Presentation / Slide-Deck Portfolio
 * Ragil Eka Putra - Full-Stack Web & Mobile Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Slide Deck State ---
  let currentSlide = 0;
  const slidePanels = document.querySelectorAll('.slide-panel');
  const navPills = document.querySelectorAll('.nav-pill-btn');
  const slideIndicators = document.querySelectorAll('.slide-indicator-num');
  const slideProgress = document.getElementById('slideProgressBar');
  const totalSlides = slidePanels.length;

  // Slide Hashes
  const slideHashes = ['summary', 'projects', 'education-skills', 'contact'];

  /**
   * Navigate to target slide
   * @param {number} targetIndex 
   */
  function goToSlide(targetIndex) {
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex >= totalSlides) targetIndex = totalSlides - 1;

    currentSlide = targetIndex;

    // Update Panels
    slidePanels.forEach((panel, idx) => {
      if (idx === currentSlide) {
        panel.classList.add('active');
        const scrollableArea = panel.querySelector('.slide-scroll-area');
        if (scrollableArea) scrollableArea.scrollTop = 0;
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Top Pill Navigation
    navPills.forEach((btn, idx) => {
      if (idx === currentSlide) {
        btn.classList.add('glass-nav-active', 'text-white');
        btn.classList.remove('text-slate-700', 'hover:text-blue-600');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('glass-nav-active', 'text-white');
        btn.classList.add('text-slate-700', 'hover:text-blue-600');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update slide number display (e.g. "01 / 04")
    slideIndicators.forEach(el => {
      el.textContent = `0${currentSlide + 1} / 0${totalSlides}`;
    });

    // Update progress bar
    if (slideProgress) {
      const percentage = ((currentSlide + 1) / totalSlides) * 100;
      slideProgress.style.width = `${percentage}%`;
    }

    // Update URL hash smoothly
    if (history.pushState) {
      history.pushState(null, null, `#${slideHashes[currentSlide]}`);
    }

    // Scroll window smoothly to top for mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Bind Top Pill Buttons
  navPills.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(idx);
    });
  });

  // Presentation Quick Nav Buttons (Next / Prev Slide)
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
    });
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
    });
  }

  // Keyboard Slide Presentation Control
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      if (e.key === ' ') e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      goToSlide(currentSlide - 1);
    } else if (e.key === 'Home') {
      goToSlide(0);
    } else if (e.key === 'End') {
      goToSlide(totalSlides - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullScreen();
    }
  });

  // Toggle Full Screen Presentation
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  const fullscreenBtn = document.getElementById('toggleFullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullScreen);
  }

  // Read initial hash on load
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const foundIndex = slideHashes.indexOf(hash);
  if (foundIndex !== -1) {
    goToSlide(foundIndex);
  } else {
    goToSlide(0);
  }

  // --- TAB 2: PROJECTS PAGINATION / CAROUSEL ---
  let currentProjectPage = 0;
  const projectPages = document.querySelectorAll('.project-page');
  const prevProjectBtn = document.getElementById('prevProjectBtn');
  const nextProjectBtn = document.getElementById('nextProjectBtn');
  const projectPageDots = document.querySelectorAll('.project-dot');

  function setProjectPage(pageIndex) {
    if (pageIndex < 0) pageIndex = 0;
    if (pageIndex >= projectPages.length) pageIndex = projectPages.length - 1;

    currentProjectPage = pageIndex;

    projectPages.forEach((page, idx) => {
      if (idx === currentProjectPage) {
        page.classList.remove('hidden');
        page.classList.add('grid');
      } else {
        page.classList.add('hidden');
        page.classList.remove('grid');
      }
    });

    projectPageDots.forEach((dot, idx) => {
      if (idx === currentProjectPage) {
        dot.classList.add('bg-blue-600', 'w-8');
        dot.classList.remove('bg-sky-300', 'w-3');
      } else {
        dot.classList.remove('bg-blue-600', 'w-8');
        dot.classList.add('bg-sky-300', 'w-3');
      }
    });

    if (prevProjectBtn) prevProjectBtn.disabled = (currentProjectPage === 0);
    if (nextProjectBtn) nextProjectBtn.disabled = (currentProjectPage === projectPages.length - 1);
  }

  if (prevProjectBtn) {
    prevProjectBtn.addEventListener('click', () => setProjectPage(currentProjectPage - 1));
  }
  if (nextProjectBtn) {
    nextProjectBtn.addEventListener('click', () => setProjectPage(currentProjectPage + 1));
  }
  projectPageDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => setProjectPage(idx));
  });

  // Initialize Project page
  setProjectPage(0);

  // --- LIGHTBOX IMAGE MODAL ---
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalPreviewImage');
  const modalTitle = document.getElementById('modalImageTitle');
  const modalDesc = document.getElementById('modalImageDesc');
  const closeModalBtn = document.getElementById('closeModalBtn');

  document.querySelectorAll('.zoomable-image').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-img-src') || item.getAttribute('src');
      const title = item.getAttribute('data-title') || 'Dokumentasi Sistem';
      const desc = item.getAttribute('data-desc') || 'Screenshot antarmuka sistem dan fitur arsitektur.';

      if (modalImg) modalImg.src = src;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (imageModal) imageModal.classList.add('active');
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (imageModal) imageModal.classList.remove('active');
    });
  }

  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.classList.remove('active');
      }
    });
  }

  // --- COPY EMAIL FUNCTIONALITY ---
  const copyEmailBtns = document.querySelectorAll('.copy-email-action');
  const emailAddress = 'ragilekaputra748@gmail.com';

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailAddress).then(() => {
        showCopyNotification('✓ Alamat email ragilekaputra748@gmail.com berhasil disalin!');
      }).catch(() => {
        const temp = document.createElement('input');
        temp.value = emailAddress;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showCopyNotification('✓ Alamat email berhasil disalin!');
      });
    });
  });

  function showCopyNotification(msg) {
    const toasts = document.querySelectorAll('.copy-feedback-toast');
    toasts.forEach(toast => {
      toast.textContent = msg;
      toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
      }, 2500);
    });
  }

  // --- DOWNLOAD CV SIMULATION ---
  const downloadCvBtns = document.querySelectorAll('.download-cv-btn');
  downloadCvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showCopyNotification('📄 Menyiapkan dokumen Curriculum Vitae Ragil Eka Putra...');
      setTimeout(() => {
        window.print();
      }, 600);
    });
  });

  // Escape key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (imageModal && imageModal.classList.contains('active')) {
        imageModal.classList.remove('active');
      }
    }
  });

  // Touch Swipe for Mobile Slide Deck
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    const swipeThreshold = 60;
    if (touchEndX < touchStartX - swipeThreshold) {
      goToSlide(currentSlide + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      goToSlide(currentSlide - 1);
    }
  }

  // Jump from Slide CTA buttons
  document.querySelectorAll('[data-jump-slide]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = parseInt(btn.getAttribute('data-jump-slide'), 10);
      goToSlide(target);
    });
  });
});
