document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================================
    // --- 1. TAB SWITCHING LOGIC ---
    // =========================================================
    const tabs = document.querySelectorAll('.settings-tab');
    const sections = document.querySelectorAll('.settings-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            sections.forEach(section => section.classList.remove('active'));
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // =========================================================
    // --- 2. PROFILE SECTION (Dynamic UI & Smart Save) ---
    // =========================================================
    const profileNameInput = document.getElementById('profile-name');
    const profileEmailInput = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const btnSaveProfile = document.getElementById('btn-save-profile');
    const lastUpdatedProfile = document.getElementById('last-updated-profile');
    const profileForm = document.getElementById('form-profile');

    // Store initial values to track if user actually made changes
    let initialName = profileNameInput.value;
    let initialEmail = profileEmailInput.value;

    const updateProfileUI = () => {
        const currentName = profileNameInput.value.trim();
        const currentEmail = profileEmailInput.value.trim();
        
        // Dynamic Avatar Letter (takes first letter of name)
        profileAvatar.textContent = currentName ? currentName.charAt(0).toUpperCase() : '?';

        // Disable "Save Changes" if nothing was actually modified
        if (currentName !== initialName || currentEmail !== initialEmail) {
            btnSaveProfile.disabled = false;
        } else {
            btnSaveProfile.disabled = true;
        }
    };

    profileNameInput.addEventListener('input', updateProfileUI);
    profileEmailInput.addEventListener('input', updateProfileUI);

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 1. Loading State
            btnSaveProfile.disabled = true;
            btnSaveProfile.textContent = "Saving...";
            lastUpdatedProfile.classList.add('hidden'); // Hide until saved

            // 2. Fake API Delay
            setTimeout(() => {
                // Success Feedback
                btnSaveProfile.textContent = "Changes saved successfully";
                btnSaveProfile.classList.add('btn-success');
                lastUpdatedProfile.classList.remove('hidden');

                // Update baseline values so button disables again
                initialName = profileNameInput.value.trim();
                initialEmail = profileEmailInput.value.trim();

                // 3. Reset Button State
                setTimeout(() => {
                    btnSaveProfile.textContent = "Save Changes";
                    btnSaveProfile.classList.remove('btn-success');
                    updateProfileUI(); // Re-evaluate if button should be disabled
                }, 2000);
            }, 1000); // 1s save delay
        });
    }

    // =========================================================
    // --- 3. SECURITY SECTION (Inline Validation & Save) ---
    // =========================================================
    const newPwdInput = document.getElementById('new-password');
    const confPwdInput = document.getElementById('confirm-password');
    const btnUpdatePwd = document.getElementById('btn-update-pwd');
    const errNewPwd = document.getElementById('err-new-pwd');
    const errConfPwd = document.getElementById('err-conf-pwd');
    const lastUpdatedSecurity = document.getElementById('last-updated-security');
    const securityForm = document.getElementById('form-security');

    const validateSecurity = () => {
        const pwd1 = newPwdInput.value;
        const pwd2 = confPwdInput.value;
        let isValid = true;

        // Check min 6 chars (only show error if user has started typing)
        if (pwd1.length > 0 && pwd1.length < 6) {
            errNewPwd.classList.remove('hidden');
            isValid = false;
        } else {
            errNewPwd.classList.add('hidden');
        }

        // Check if passwords match (only show error if confirm is filled)
        if (pwd2.length > 0 && pwd1 !== pwd2) {
            errConfPwd.classList.remove('hidden');
            isValid = false;
        } else {
            errConfPwd.classList.add('hidden');
        }

        // Final check to enable button
        if (pwd1 === '' || pwd2 === '' || pwd1.length < 6 || pwd1 !== pwd2) {
            isValid = false;
        }

        btnUpdatePwd.disabled = !isValid;
    };

    newPwdInput.addEventListener('input', validateSecurity);
    confPwdInput.addEventListener('input', validateSecurity);

    if (securityForm) {
        securityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 1. Loading State
            btnUpdatePwd.disabled = true;
            btnUpdatePwd.textContent = "Saving...";
            lastUpdatedSecurity.classList.add('hidden');

            // 2. Fake API Delay
            setTimeout(() => {
                // Success Feedback
                btnUpdatePwd.textContent = "Password Updated ✓";
                btnUpdatePwd.classList.add('btn-success');
                lastUpdatedSecurity.classList.remove('hidden');

                // 3. Reset Fields and Button
                setTimeout(() => {
                    btnUpdatePwd.textContent = "Update Password";
                    btnUpdatePwd.classList.remove('btn-success');
                    newPwdInput.value = '';
                    confPwdInput.value = '';
                    validateSecurity(); // Re-run validation to disable button
                }, 2000);
            }, 1000);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        // 1. Cek local storage saat halaman settings dimuat
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            darkModeToggle.checked = false;
        }

        // 2. Event Listener saat toggle switch diklik
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});