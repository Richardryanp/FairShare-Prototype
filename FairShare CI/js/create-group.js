document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. UX Polish: Auto Focus & Validation ---
    const groupNameInput = document.getElementById('groupName');
    const submitBtn = document.getElementById('submitGroupBtn');

    // Auto-focus the main input on load
    groupNameInput.focus();

    // Enable/Disable Create button based on Name
    groupNameInput.addEventListener('input', () => {
        if (groupNameInput.value.trim().length > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });


    // --- 2. Dynamic Member Invite Logic ---
    let invitedMembers = [];
    const memberInput = document.getElementById('memberInput');
    const memberRole = document.getElementById('memberRole');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const membersList = document.getElementById('membersList');
    const emptyMembersText = document.getElementById('emptyMembersText');

    function renderMembers() {
        // Toggle Empty State Text
        if (invitedMembers.length > 0) {
            emptyMembersText.style.display = 'none';
        } else {
            emptyMembersText.style.display = 'block';
        }

        // Clean up current dynamic chips (keep creator and empty text)
        document.querySelectorAll('.member-chip:not(.is-creator)').forEach(el => el.remove());

        // Render Array
        invitedMembers.forEach((member, index) => {
            const chip = document.createElement('div');
            chip.className = 'member-chip';
            // Get first letter for avatar
            const initial = member.name.charAt(0).toUpperCase();
            
            chip.innerHTML = `
                <div class="avatar-sm bg-teal">${initial}</div>
                <div class="chip-info">
                    <span class="chip-name">${member.name}</span>
                    <span class="chip-role muted">${member.role}</span>
                </div>
                <button type="button" class="remove-btn" data-index="${index}" title="Remove">✕</button>
            `;
            membersList.appendChild(chip);
        });

        // Re-attach remove listeners
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                const chipEl = this.closest('.member-chip');
                
                chipEl.classList.add('fade-out');
                setTimeout(() => {
                    invitedMembers.splice(idx, 1);
                    renderMembers();
                }, 200); 
            });
        });
    }

    addMemberBtn.addEventListener('click', () => {
        const val = memberInput.value.trim();
        if (val !== '') {
            invitedMembers.push({
                name: val,
                role: memberRole.value
            });
            memberInput.value = ''; 
            memberInput.focus(); // Keep focus for rapid entry
            renderMembers();
        }
    });

    // Press "Enter" to add member (prevent form submission)
    memberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            addMemberBtn.click();
        }
    });


    // --- 3. Copy Link Logic ---
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const inviteLinkInput = document.getElementById('inviteLinkInput');

    copyLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(inviteLinkInput.value).then(() => {
            const originalHTML = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = 'Copied!';
            copyLinkBtn.style.backgroundColor = 'rgba(255,255,255,0.1)';
            copyLinkBtn.style.color = 'var(--text-primary)';
            copyLinkBtn.style.borderColor = 'var(--text-primary)';

            setTimeout(() => {
                copyLinkBtn.innerHTML = originalHTML;
                copyLinkBtn.style = ''; 
            }, 1500);
        });
    });


    // --- 4. Form Submit & Success State ---
    const createForm = document.getElementById('createGroupForm');
    const toast = document.getElementById('successToast');

    createForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        // 1. Enter Loading State
        submitBtn.innerHTML = `Creating... <svg width="16" height="16" style="margin-left:8px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;
        submitBtn.classList.add('btn-loading');

        // Add a simple spin keyframe programmatically if missing in CSS
        if (!document.getElementById('spinKeyframe')) {
            const style = document.createElement('style');
            style.id = 'spinKeyframe';
            style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        // 2. Show Success Toast early to feel fast
        setTimeout(() => {
            toast.classList.remove('hidden');
            void toast.offsetWidth; 
            toast.classList.add('show');
            
            // Fade out the form for smooth transition
            createForm.style.transition = "opacity 0.4s ease";
            createForm.style.opacity = "0.3";
            createForm.style.pointerEvents = "none";
        }, 500);

        // 3. Redirect to Dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1800);
    });

});