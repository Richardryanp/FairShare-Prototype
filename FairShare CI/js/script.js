if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. NAVBAR SCROLL INTERACTION (Slower, Apple-like threshold)
    // 1. NAVBAR SCROLL INTERACTION (Optimized with State Guard & requestAnimationFrame)
    const navbar = document.querySelector('.navbar');
    let isScrolled = false; // State guard untuk mengunci eksekusi berulang
    
    const handleScroll = () => {
        const shouldScroll = window.scrollY > 60;
        
        // Hanya eksekusi jika status scroll berubah dari sebelumnya
        if (shouldScroll !== isScrolled) {
            isScrolled = shouldScroll;
            
            requestAnimationFrame(() => {
                if (isScrolled) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. HERO 3D SCROLL ANIMATION (Subtle Premium Reveal)
    const heroVisual = document.querySelector('.hero-visual');
    
    // Desktop only to preserve mobile performance
    if (heroVisual && window.innerWidth > 900) {
        // Reduced initial rotation drastically for a realistic subtle effect
        heroVisual.style.transform = `rotateX(5deg) scale(0.97)`;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // Smoother math: 5deg -> 0deg over 600px of scrolling
            let rotation = Math.max(0, 5 - (scrollY / 120));
            // Slight scale: 0.97 -> 1.0
            let scale = Math.min(1, 0.97 + (scrollY / 3000));
            
            if (scrollY < window.innerHeight) {
                requestAnimationFrame(() => {
                    heroVisual.style.transform = `rotateX(${rotation}deg) scale(${scale})`;
                });
            }
        }, { passive: true });
    }

    // 3. MOBILE MENU TOGGLE
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if(navLinks.classList.contains('active')) {
            navbar.style.background = 'rgba(255, 255, 255, 0.96)';
        } else {
            navbar.style.background = '';
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navbar.style.background = '';
        });
    });

    // 4. HERO TYPING ANIMATION
    const typedTextSpan = document.querySelector(".typed-text");
    const textArray = ["Group projects shouldn’t feel this chaotic."];
    const typingDelay = 45; 
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[0].length) {
            typedTextSpan.textContent += textArray[0].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(() => {
                document.querySelector('.cursor').style.opacity = '0';
            }, 2500);
        }
    }

    setTimeout(type, 500);

    // 5. SCROLL REVEAL ANIMATION (Smooth Staggering)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1, 
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            if (entry.target.classList.contains('stagger')) {
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.stagger'));
                const index = siblings.indexOf(entry.target);
                // Apple-like transition stagger
                entry.target.style.transitionDelay = `${index * 0.15}s`;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); 
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

});

// ==========================================================================
// SCRIPT: Circular Magnifying Glass System (Grup FairShare)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Targetkan kontainer gambar di seksi showcase
    const showcaseContainers = document.querySelectorAll('.showcase-main, .image-card');

    showcaseContainers.forEach(container => {
        const img = container.querySelector('.img-placeholder');
        if (!img) return;

        // Bikin elemen bulatan pembesar secara dinamis (HTML lu aman ga perlu diubah)
        let glass = container.querySelector('.img-magnifier-glass');
        if (!glass) {
            glass = document.createElement('div');
            glass.className = 'img-magnifier-glass';
            container.appendChild(glass);
        }

        // Jalankan fungsi tracking saat mouse bergerak di dalam area gambar
        container.addEventListener('mousemove', (e) => {
            glass.style.display = 'block';
            const rect = img.getBoundingClientRect();
            
            // Hitung posisi kursor relatif terhadap gambar asli
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            // Batasi lensa agar tidak keluar dari frame gambar
            if (x > rect.width) x = rect.width;
            if (x < 0) x = 0;
            if (y > rect.height) y = rect.height;
            if (y < 0) y = 0;

            // Atur posisi lensa bulat agar tepat berada di tengah kursor mouse
            const glassWidth = glass.offsetWidth;
            const glassHeight = glass.offsetHeight;
            glass.style.left = (x - glassWidth / 2) + "px";
            glass.style.top = (y - glassHeight / 2) + "px";

            // Set rasio pembesaran di dalam bulatan (2 berarti 2x lipat lebih besar)
            const zoom = 2;
            glass.style.backgroundImage = `url('${img.src}')`;
            glass.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
            
            // Geser gambar di dalam lensa bulat secara dinamis mengikuti arah kursor
            const bgX = (x * zoom) - glassWidth / 2;
            const bgY = (y * zoom) - glassHeight / 2;
            glass.style.backgroundPosition = `-${bgX}px -${bgY}px`;
        });

        // Sembunyikan bulatan pembesar saat mouse keluar dari area gambar
        container.addEventListener('mouseleave', () => {
            glass.style.display = 'none';
        });
    });
});
