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
    const imageReplacements = [
      {
        selector: 'img[src$="assets/images/hero.webp"]',
        src: 'https://source.unsplash.com/1600x900/?beauty,salon,interior',
        alt: '\u7709\u6bdb\u30b5\u30ed\u30f3\u306e\u5e97\u5185\u306e\u96f0\u56f2\u6c17\uff08\u30a4\u30e1\u30fc\u30b8\uff09'
      },
      {
        selector: 'img[src$="assets/images/before.webp"]',
        src: 'https://source.unsplash.com/600x400/?eyebrow,closeup,beauty',
        alt: '\u65bd\u8853\u524d\u306e\u7709\u306e\u72b6\u614b\uff08\u30a4\u30e1\u30fc\u30b8\uff09'
      },
      {
        selector: 'img[src$="assets/images/after.webp"]',
        src: 'https://source.unsplash.com/600x400/?eyebrow,styling,beauty',
        alt: '\u65bd\u8853\u5f8c\u306b\u6574\u3063\u305f\u7709\uff08\u30a4\u30e1\u30fc\u30b8\uff09'
      }
    ];

    imageReplacements.forEach(cfg => {
      const el = document.querySelector(cfg.selector);
      if (el) {
        el.setAttribute('src', cfg.src);
        if (cfg.alt) el.setAttribute('alt', cfg.alt);
      }
    });
  } catch (e) {
    console.warn('画像差し替えに失敗しました:', e);
  }
});

