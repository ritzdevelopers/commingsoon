/* ============================================
   COMING SOON — main1.js
============================================ */

/* ============================================
   CURSOR PARALLAX BACKGROUND

   How it works:
   - Mouse position is normalised to -1 → +1
     from the centre of the screen.
   - The bg element is translated in the
     OPPOSITE direction (classic parallax).
   - A lerp (linear interpolation) loop gives
     buttery-smooth easing — no CSS animation
     fighting the transform.
   - On touch devices: drag touch = parallax.
   - On mobile tilt: deviceorientation = parallax.
   - bg has inset:-5% / 110% size so the extra
     image area is always off-screen.
============================================ */

const bg = document.querySelector('.bg');

/* Max pixel shift at screen edge */
const STRENGTH = 28;

/* Lerp ease — lower = smoother, higher = snappier */
const EASE = 0.055;

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
let rafId = null;

/* ── Lerp helper ── */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/* ── Apply transform ── */
function applyTransform() {
    bg.style.transform = `translate(${currentX}px, ${currentY}px)`;
}

/* ── Animation loop ── */
function tick() {
    currentX = lerp(currentX, targetX, EASE);
    currentY = lerp(currentY, targetY, EASE);

    applyTransform();

    const doneX = Math.abs(targetX - currentX) < 0.04;
    const doneY = Math.abs(targetY - currentY) < 0.04;

    if (!doneX || !doneY) {
        rafId = requestAnimationFrame(tick);
    } else {
        /* Snap to exact target and stop loop (saves CPU/battery) */
        currentX = targetX;
        currentY = targetY;
        applyTransform();
        rafId = null;
    }
}

function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(tick);
}

/* ── Mouse move ── */
document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2; /* -1 to +1 */
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;

    targetX = -nx * STRENGTH;
    targetY = -ny * STRENGTH;

    startLoop();
});

/* ── Mouse leaves window → drift back to centre ── */
document.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    startLoop();
});

/* ── Touch drag (mobile) ── */
document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const nx = (t.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (t.clientY / window.innerHeight - 0.5) * 2;

    targetX = -nx * STRENGTH;
    targetY = -ny * STRENGTH;

    startLoop();
}, { passive: true });

document.addEventListener('touchend', () => {
    targetX = 0;
    targetY = 0;
    startLoop();
}, { passive: true });

/* ── Device tilt (gyroscope on phones) ── */
window.addEventListener('deviceorientation', (e) => {
    if (e.gamma === null || e.beta === null) return;

    /*
     * gamma = left/right tilt  (-90° … +90°)
     * beta  = forward/back tilt (-180° … +180°),
     *         offset by ~20° (typical hold angle)
     */
    const nx = Math.max(-1, Math.min(1, e.gamma / 25));
    const ny = Math.max(-1, Math.min(1, (e.beta - 20) / 35));

    targetX = -nx * STRENGTH;
    targetY = -ny * STRENGTH;

    startLoop();
});

/* ============================================
   NEWSLETTER FORM
============================================ */

const emailInput  = document.getElementById('emailInput');
const sendBtn     = document.getElementById('sendBtn');
const formMessage = document.getElementById('formMessage');

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className   = 'form-message ' + type;
    clearTimeout(formMessage._timer);
    formMessage._timer = setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className   = 'form-message';
    }, 4000);
}

function handleSubmit() {
    const email = emailInput.value.trim();

    if (!email) {
        showMessage('Please enter your email address.', 'error');
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
    }

    sendBtn.disabled    = true;
    sendBtn.textContent = '...';

    /*
     * ── Replace with your real API call ──
     *
     * fetch('/api/subscribe', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ email })
     * })
     * .then(res => res.json())
     * .then(() => {
     *   showMessage("You're on the list! 🎉", 'success');
     *   emailInput.value    = '';
     *   sendBtn.disabled    = false;
     *   sendBtn.textContent = 'SEND';
     * })
     * .catch(() => {
     *   showMessage('Something went wrong. Try again.', 'error');
     *   sendBtn.disabled    = false;
     *   sendBtn.textContent = 'SEND';
     * });
     */
    setTimeout(() => {
        showMessage("You're on the list! We'll be in touch 🎉", 'success');
        emailInput.value    = '';
        sendBtn.disabled    = false;
        sendBtn.textContent = 'SEND';
    }, 1000);
}

sendBtn.addEventListener('click', handleSubmit);

emailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubmit();
});

emailInput.addEventListener('input', () => {
    if (formMessage.classList.contains('error')) {
        formMessage.textContent = '';
        formMessage.className   = 'form-message';
    }
});