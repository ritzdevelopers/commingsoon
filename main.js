    /* ============================================
    COMING SOON — main1.js
    ============================================ */

    /* ============================================
    1. CURSOR PARALLAX BACKGROUND
    ============================================ */
    const bg = document.querySelector('.bg');

    const STRENGTH = 28;
    const EASE     = 0.055;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function applyTransform() {
        bg.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    function tick() {
        currentX = lerp(currentX, targetX, EASE);
        currentY = lerp(currentY, targetY, EASE);
        applyTransform();

        if (Math.abs(targetX - currentX) > 0.04 || Math.abs(targetY - currentY) > 0.04) {
            rafId = requestAnimationFrame(tick);
        } else {
            currentX = targetX;
            currentY = targetY;
            applyTransform();
            rafId = null;
        }
    }

    function startLoop() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    /* Mouse */
    document.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        targetX = -nx * STRENGTH;
        targetY = -ny * STRENGTH;
        startLoop();
    });

    document.addEventListener('mouseleave', () => {
        targetX = 0; targetY = 0;
        startLoop();
    });

    /* Touch */
    document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        const nx = (t.clientX / window.innerWidth  - 0.5) * 2;
        const ny = (t.clientY / window.innerHeight - 0.5) * 2;
        targetX = -nx * STRENGTH;
        targetY = -ny * STRENGTH;
        startLoop();
    }, { passive: true });

    document.addEventListener('touchend', () => {
        targetX = 0; targetY = 0;
        startLoop();
    }, { passive: true });

    /* Device tilt */
    window.addEventListener('deviceorientation', (e) => {
        if (e.gamma === null || e.beta === null) return;
        const nx = Math.max(-1, Math.min(1, e.gamma / 25));
        const ny = Math.max(-1, Math.min(1, (e.beta - 20) / 35));
        targetX = -nx * STRENGTH;
        targetY = -ny * STRENGTH;
        startLoop();
    });

    /* ============================================
    2. MODAL — open / close
    ============================================ */
    const overlay      = document.getElementById('modalOverlay');
    const glassForm    = document.getElementById('glassForm');
    const openBtn      = document.getElementById('getInTouchBtn');
    const closeBtn     = document.getElementById('modalClose');

    function openModal() {
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        // Focus first input after transition
        setTimeout(() => {
            const first = glassForm.querySelector('.glass-input');
            if (first) first.focus();
        }, 420);
    }

    function closeModal() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        clearForm();
    }

    /* Open on button click */
    openBtn.addEventListener('click', openModal);

    /* Close on X button */
    closeBtn.addEventListener('click', closeModal);

    /* Close on overlay backdrop click */
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    /* Close on Escape key */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    /* ============================================
    3. CONTACT FORM — validation & submit
    ============================================ */
    const submitBtn      = document.getElementById('submitBtn');
    const successMsg     = document.getElementById('glassSuccessMsg');

    const inputName  = document.getElementById('inputName');
    const inputEmail = document.getElementById('inputEmail');
    const inputPhone = document.getElementById('inputPhone');
    const inputMsg   = document.getElementById('inputMsg');

    function isValidEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }

    function isValidPhone(v) {
        return v.trim() === '' || /^[\+\d\s\-\(\)]{7,20}$/.test(v.trim());
    }

    function showMsg(text, type) {
        successMsg.textContent = text;
        successMsg.className   = 'glass-success-msg ' + type;
        clearTimeout(successMsg._timer);
        if (type !== 'success') {
            successMsg._timer = setTimeout(() => {
                successMsg.textContent = '';
                successMsg.className   = 'glass-success-msg';
            }, 4000);
        }
    }

    function clearForm() {
        [inputName, inputEmail, inputPhone, inputMsg].forEach(el => {
            el.value = '';
            el.style.borderColor = '';
        });
        successMsg.textContent = '';
        successMsg.className   = 'glass-success-msg';
        submitBtn.disabled     = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
    }

    function markError(input) {
        input.style.borderColor = 'rgba(248, 113, 113, 0.7)';
        input.focus();
    }

    function clearError(input) {
        input.style.borderColor = '';
    }

    /* Clear error highlight on input */
    [inputName, inputEmail, inputPhone, inputMsg].forEach(el => {
        el.addEventListener('input', () => clearError(el));
    });

    function handleFormSubmit() {
        const name  = inputName.value.trim();
        const email = inputEmail.value.trim();
        const phone = inputPhone.value.trim();
        const msg   = inputMsg.value.trim();

        /* ── Validation ── */
        if (!name) {
            markError(inputName);
            showMsg('Please enter your name.', 'error');
            return;
        }

        if (!email || !isValidEmail(email)) {
            markError(inputEmail);
            showMsg('Please enter a valid email address.', 'error');
            return;
        }

        if (!isValidPhone(phone)) {
            markError(inputPhone);
            showMsg('Please enter a valid phone number.', 'error');
            return;
        }

        if (!msg) {
            markError(inputMsg);
            showMsg('Please write a message.', 'error');
            return;
        }

        /* ── Submit ── */
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending…';

        /*
        * Replace the setTimeout with your real API call:
        *
        * fetch('/api/contact', {
        *   method: 'POST',
        *   headers: { 'Content-Type': 'application/json' },
        *   body: JSON.stringify({ name, email, phone, message: msg })
        * })
        * .then(res => res.json())
        * .then(() => {
        *   showMsg('Message sent! We\'ll be in touch soon 🎉', 'success');
        *   submitBtn.querySelector('span').textContent = 'Sent ✓';
        *   setTimeout(closeModal, 2200);
        * })
        * .catch(() => {
        *   showMsg('Something went wrong. Please try again.', 'error');
        *   submitBtn.disabled = false;
        *   submitBtn.querySelector('span').textContent = 'Send Message';
        * });
        */
        setTimeout(() => {
            showMsg("Message sent! We'll be in touch soon 🎉", 'success');
            submitBtn.querySelector('span').textContent = 'Sent ✓';
            // Auto close after 2.2s
            setTimeout(closeModal, 2200);
        }, 1000);
    }

    submitBtn.addEventListener('click', handleFormSubmit);

    /* Allow Enter to submit (but not inside textarea) */
    glassForm.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            handleFormSubmit();
        }
    });