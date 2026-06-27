if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const errorBanner = document.getElementById('error-banner');
    
    // Requirement nodes
    const reqLen = document.getElementById('req-len');
    const reqUp = document.getElementById('req-up');
    const reqLow = document.getElementById('req-low');
    const reqNum = document.getElementById('req-num');

    // --- 1. Real-Time Password Validation ---
    const validateInputs = () => {
        const pass = passInput.value;
        const email = emailInput.value.trim();
        
        const isLen = pass.length >= 8;
        const isUp = /[A-Z]/.test(pass);
        const isLow = /[a-z]/.test(pass);
        const isNum = /\d/.test(pass);

        // Update checklist UI
        reqLen.className = isLen ? 'valid' : 'invalid';
        reqUp.className = isUp ? 'valid' : 'invalid';
        reqLow.className = isLow ? 'valid' : 'invalid';
        reqNum.className = isNum ? 'valid' : 'invalid';

        // Unlock button only if all rules pass
        const isValid = isLen && isUp && isLow && isNum && email !== "";
        submitBtn.disabled = !isValid;
    };

    passInput.addEventListener('input', validateInputs);
    emailInput.addEventListener('input', validateInputs);

    // --- 2. Form Submission & Error Handling ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        if (submitBtn.disabled) return;
        
        // Hide existing errors
        errorBanner.classList.remove('show');
        setTimeout(() => { errorBanner.style.display = 'none'; }, 300);
        
        // UX Simulation: Loading state
        const originalText = submitBtn.textContent;
        submitBtn.style.cursor = 'wait';
        submitBtn.textContent = 'Logging in...';
        
        setTimeout(() => {
            // Simulated fake error condition for demonstration
            if (emailInput.value === 'fail@university.edu') {
                // Reset button
                submitBtn.style.cursor = 'pointer';
                submitBtn.textContent = originalText;
                
                // Show animated error banner
                errorBanner.style.display = 'flex';
                // Trigger reflow to restart CSS animation
                void errorBanner.offsetWidth; 
                errorBanner.classList.add('show');
            } else {
                // Success
                window.location.href = 'groups.html';
            }
        }, 1200);
    });

    // --- 3. Password Visibility Toggle ---
    const toggleBtn = document.querySelector('.password-toggle');
    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passInput.type === 'password';
            passInput.type = isPassword ? 'text' : 'password';
            
            toggleBtn.innerHTML = isPassword 
                ? `<svg class="eye-off-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>` 
                : `<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
        });
    }
});