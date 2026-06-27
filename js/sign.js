if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const confirmPassInput = document.getElementById('confirm-password');
    const termsCheck = document.getElementById('terms');
    
    const submitBtn = document.getElementById('submitBtn');
    const errorBanner = document.getElementById('error-banner');
    const errorText = document.getElementById('error-text');
    
    // Requirement nodes
    const reqLen = document.getElementById('req-len');
    const reqUp = document.getElementById('req-up');
    const reqLow = document.getElementById('req-low');
    const reqNum = document.getElementById('req-num');

    // Helper to show errors using the exact UI from the login page
    const showError = (msg) => {
        errorText.textContent = msg;
        errorBanner.style.display = 'flex';
        void errorBanner.offsetWidth; // Trigger reflow to restart CSS animation
        errorBanner.classList.add('show');
    };

    const hideError = () => {
        errorBanner.classList.remove('show');
        setTimeout(() => { errorBanner.style.display = 'none'; }, 300);
    };

    // --- 1. Real-Time Validation ---
    const validateInputs = () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const pass = passInput.value;
        const confirmPass = confirmPassInput.value;
        const isTermsChecked = termsCheck.checked;
        
        // Password rules
        const isLen = pass.length >= 8;
        const isUp = /[A-Z]/.test(pass);
        const isLow = /[a-z]/.test(pass);
        const isNum = /\d/.test(pass);

        // Update checklist UI smoothly
        reqLen.className = isLen ? 'valid' : 'invalid';
        reqUp.className = isUp ? 'valid' : 'invalid';
        reqLow.className = isLow ? 'valid' : 'invalid';
        reqNum.className = isNum ? 'valid' : 'invalid';

        // Unlock button only if ALL rules pass
        const isPassValid = isLen && isUp && isLow && isNum;
        const arePassesMatched = pass === confirmPass && pass !== "";
        
        const isValid = name !== "" && email !== "" && isPassValid && arePassesMatched && isTermsChecked;
        
        submitBtn.disabled = !isValid;
    };

    // Listen to input events
    nameInput.addEventListener('input', validateInputs);
    emailInput.addEventListener('input', validateInputs);
    passInput.addEventListener('input', validateInputs);
    confirmPassInput.addEventListener('input', validateInputs);
    termsCheck.addEventListener('change', validateInputs);

    // --- 2. Form Submission ---
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        hideError();
        
        if (submitBtn.disabled) return;
        
        // Final sanity checks on submit
        if (passInput.value !== confirmPassInput.value) {
            showError('Passwords do not match. Please try again.');
            return;
        }

        // UX Simulation: Loading state
        const originalText = submitBtn.textContent;
        submitBtn.style.cursor = 'wait';
        submitBtn.textContent = 'Creating account...';
        
        // Simulate network request
        setTimeout(() => {
            // Simulated error handling
            if (emailInput.value === 'taken@university.edu') {
                submitBtn.style.cursor = 'pointer';
                submitBtn.textContent = originalText;
                showError('This email is already registered.');
            } else {
                // Success route
                window.location.href = 'groups.html';
            }
        }, 1200);
    });

    // --- 3. Multiple Password Visibility Toggles ---
    const toggleBtns = document.querySelectorAll('.password-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentPassInput = this.previousElementSibling; 
            const isPassword = currentPassInput.type === 'password';
            currentPassInput.type = isPassword ? 'text' : 'password';
            
            this.innerHTML = isPassword 
                ? `<svg class="eye-off-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>` 
                : `<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
        });
    });
});