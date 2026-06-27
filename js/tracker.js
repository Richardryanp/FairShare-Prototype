document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Reveal Animations on Load ---
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        el.classList.add('fade-up');
    });

    // --- 2. Animate Contribution Progress Bars ---
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.js-bar');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            // Pastikan bar merespon width untuk memicu CSS transition
            if(bar && targetWidth) bar.style.width = targetWidth;
        });
    }, 400); 

    // --- 3. Animate Weekly Progress Chart Bars ---
    setTimeout(() => {
        const chartBars = document.querySelectorAll('.js-chart-bar');
        chartBars.forEach(bar => {
            const targetHeight = bar.getAttribute('data-height');
            // Pastikan bar merespon height untuk memicu CSS transition
            if(bar && targetHeight) bar.style.height = targetHeight;
        });
    }, 600); 
    
    // --- 4. Optional Tooltip Interaction for Chart ---
    const chartBarsInteractive = document.querySelectorAll('.js-chart-bar');
    chartBarsInteractive.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

});