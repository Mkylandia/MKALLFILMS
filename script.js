function openSite(url) {
    const clickedCard = event.currentTarget;

    // Klick-Animation
    clickedCard.style.transform = 'scale(0.95) rotateX(8deg)';
    clickedCard.style.transition = 'transform 0.15s ease-out';

    // Ripple-Effekt
    createRipple(event);

    setTimeout(() => {
        clickedCard.style.transform = '';
        clickedCard.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        window.open(url, '_blank');
    }, 150);
}

function createRipple(event) {
    const ripple = document.createElement('div');
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = 
        `position: absolute;
         left: ${x}px;
         top: ${y}px;
         width: ${size}px;
         height: ${size}px;
         border-radius: 50%;
         background: radial-gradient(
             circle,
             rgba(255,215,0,0.5) 0%,
             rgba(255,215,0,0.2) 50%,
             transparent 100%
         );
         transform: scale(0);
         animation: rippleAnim 0.7s ease-out;
         pointer-events: none;
         z-index: 1000;`;

    event.currentTarget.appendChild(ripple);

    setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 700);
}

document.addEventListener('DOMContentLoaded', function () {
    // Intersection Observer für Karten-Einblendung
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 150);
            }
        });
    }, options);

    document.querySelectorAll('.site-card').forEach(card => {
        observer.observe(card);
    });

    // Parallax für Hintergrund-Elemente
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.floating-element').forEach((el, idx) => {
            const speed = 0.1 + idx * 0.07;
            const yPos = scrolled * speed;
            const rot = scrolled * (0.04 + idx * 0.015);
            el.style.transform = `translateY(${yPos}px) rotate(${rot}deg)`;
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Cursor-Effekt
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = 
        `position: fixed;
         width: 16px;
         height: 16px;
         background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%);
         border-radius: 50%;
         pointer-events: none;
         z-index: 9999;
         transition: transform 0.1s ease;
         display: none;`;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 8 + 'px';
        cursor.style.top = e.clientY - 8 + 'px';
    });

    document.querySelectorAll('.site-card, .visit-btn, .social-icon').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.display = 'block';
            cursor.style.transform = 'scale(1.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
            cursor.style.transform = 'scale(1)';
        });
    });

    // Inject zusätzlicher CSS-Regeln (Ripple-Animation & Cursor)
    const styleSheet = document.createElement('style');
    styleSheet.textContent = 
        `@keyframes rippleAnim {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }

        .custom-cursor {
            mix-blend-mode: difference;
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }`;
    document.head.appendChild(styleSheet);
});
