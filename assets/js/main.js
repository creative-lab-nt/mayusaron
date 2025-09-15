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

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Form Validation & Submission ---
    const form = document.getElementById('reserve-form');
    const successToast = document.getElementById('form-success-toast');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            // Mock submission
            console.log('Form submitted successfully');
            showToast();
            form.reset();
        } else {
            console.log('Form validation failed');
        }
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            const errorMsgElement = field.closest('.form-group, .form-group-checkbox').querySelector('.error-message');
            if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
                isValid = false;
                errorMsgElement.textContent = 'この項目は必須です。';
                errorMsgElement.style.display = 'block';
            } else {
                errorMsgElement.textContent = '';
                errorMsgElement.style.display = 'none';
            }
        });

        return isValid;
    }

    function showToast() {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 4000);
    }

    // --- v1.01 External image fallback (Unsplash) ---
    // 画像ファイルがレポジトリに未配置の場合に、外部CDN画像へ差し替えます。
    // 将来的にローカル最適化画像を追加したら、このブロックは削除してOKです。
    try {
        const imageReplacements = [
            {
                selector: 'img[src$="assets/images/hero.webp"]',
                src: 'https://source.unsplash.com/1600x900/?beauty,salon,interior',
                alt: '眉毛サロンの店内の雰囲気（イメージ）'
            },
            {
                selector: 'img[src$="assets/images/before.webp"]',
                src: 'https://source.unsplash.com/600x400/?eyebrow,closeup,beauty',
                alt: '施術前の眉の状態（イメージ）'
            },
            {
                selector: 'img[src$="assets/images/after.webp"]',
                src: 'https://source.unsplash.com/600x400/?eyebrow,styling,beauty',
                alt: '施術後に整った眉（イメージ）'
            }
        ];

        imageReplacements.forEach(cfg => {
            const el = document.querySelector(cfg.selector);
            if (el) {
                // 404対策で一旦差し替え
                el.setAttribute('src', cfg.src);
                if (cfg.alt) el.setAttribute('alt', cfg.alt);
            }
        });
    } catch (e) {
        console.warn('画像差し替えに失敗しました:', e);
    }
});
