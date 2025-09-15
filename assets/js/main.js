document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Hamburger Menu ---
  const hamburger = document.getElementById('hamburger-button');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isExpanded));
    });
  }

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger && hamburger.classList.remove('active');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Smooth Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = header ? header.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Form Validation & Submission ---
  const form = document.getElementById('reserve-form');
  const successToast = document.getElementById('form-success-toast');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        console.log('Form submitted successfully');
        showToast();
        form.reset();
      } else {
        console.log('Form validation failed');
      }
    });
  }

  function validateForm() {
    if (!form) return true;
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      const container = field.closest('.form-group, .form-group-checkbox');
      const errorMsgElement = container ? container.querySelector('.error-message') : null;
      if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
        isValid = false;
        if (errorMsgElement) {
          errorMsgElement.textContent = '\u3053\u306e\u9805\u76ee\u306f\u5fc5\u9808\u3067\u3059\u3002'; // この項目は必須です。
          errorMsgElement.style.display = 'block';
        }
      } else if (errorMsgElement) {
        errorMsgElement.textContent = '';
        errorMsgElement.style.display = 'none';
      }
    });
    return isValid;
  }

  function showToast() {
    if (!successToast) return;
    successToast.classList.add('show');
    setTimeout(() => {
      successToast.classList.remove('show');
    }, 4000);
  }

  // --- v1.01 External image fallback (Unsplash) ---
  // 画像ファイルが未配置の間、外部CDN画像へ差し替えます。
  // ローカル最適化画像へ移行（v1.02）時に削除してください。
  try {
    const makePlaceholder = (w, h, label) => {
      const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f0e7dc"/><stop offset="100%" stop-color="#d7c1ad"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#5a4a3f" font-family="Arial, sans-serif" font-size="${Math.round(Math.min(w,h)/18)}">${label}</text></svg>`;
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    };

    const setWithFallback = (img, url, alt, placeholderLabel, eager=false) => {
      if (!img) return;
      const placeholder = makePlaceholder(img.width || 600, img.height || 400, placeholderLabel);
      // show placeholder immediately
      img.src = placeholder;
      img.alt = alt;
      if (eager) img.loading = 'eager';

      // preload real image, then swap if success
      const real = new Image();
      real.onload = () => { img.src = url; };
      real.onerror = () => { /* keep placeholder */ };
      real.referrerPolicy = 'no-referrer';
      real.src = url;
    };

    // Hero image
    const heroImg = document.querySelector('.hero-image-container img');
    setWithFallback(
      heroImg,
      'https://source.unsplash.com/1600x900/?beauty,salon,interior',
      '\u7709\u6bdb\u30b5\u30ed\u30f3\u306e\u5e97\u5185\u306e\u96f0\u56f2\u6c17\uff08\u30a4\u30e1\u30fc\u30b8\uff09',
      'Brow Salon',
      true
    );

    // Case images (Before/After)
    const caseImgs = document.querySelectorAll('#case .case-images img');
    if (caseImgs && caseImgs.length >= 2) {
      setWithFallback(
        caseImgs[0],
        'https://source.unsplash.com/600x400/?eyebrow,closeup,beauty',
        '\u65bd\u8853\u524d\u306e\u7709\u306e\u72b6\u614b\uff08\u30a4\u30e1\u30fc\u30b8\uff09',
        'Before'
      );
      setWithFallback(
        caseImgs[1],
        'https://source.unsplash.com/600x400/?eyebrow,styling,beauty',
        '\u65bd\u8853\u5f8c\u306b\u6574\u3063\u305f\u7709\uff08\u30a4\u30e1\u30fc\u30b8\uff09',
        'After'
      );
    }
  } catch (e) {
    console.warn('画像差し替えに失敗しました:', e);
  }
});
