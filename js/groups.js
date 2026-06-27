if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

const STORAGE_JOINED = 'fairshare_joined_groups';
const STORAGE_PENDING = 'fairshare_pending_invites';
const STORAGE_ACTIVE = 'fairshare_active_group_id';

const MOCK_JOINED = [
    {
        id: 'grp_ci4',
        name: 'CI Group 4',
        description: 'Creativity Innovation final project team.',
        createdAt: '2026-01-15T10:00:00.000Z',
        memberCount: 5,
        role: 'Member'
    }
];

const MOCK_PENDING = [
    {
        id: 'grp_mobile_dev',
        name: 'Mobile Dev Studio',
        description: 'Cross-platform app project for Creativity & Innovation course.',
        createdAt: '2026-06-20T09:00:00.000Z',
        invitedBy: 'Richard',
        rules: [
            'Complete all tasks before the deadline.',
            'Post progress updates at least every 2 days.',
            'No plagiarism or unedited AI-generated content.',
            'Participate in peer evaluation for every task.'
        ],
        consequences: [
            'Overdue tasks will be reassigned.',
            'Contribution score decreases for incomplete tasks.',
            'Members late more than twice are marked inactive.',
            'Skipping peer evaluation forfeits contribution score for that task.'
        ]
    },
    {
        id: 'grp_research',
        name: 'UX Research Pod',
        description: 'Weekly usability studies and collaborative report writing.',
        createdAt: '2026-06-22T11:00:00.000Z',
        invitedBy: 'Yofi',
        rules: [
            'Attend all scheduled research sessions.',
            'Submit findings within 48 hours of each session.',
            'Cite all sources and research materials properly.'
        ],
        consequences: [
            'Missed sessions require a written summary within 24 hours.',
            'Repeated absences may result in role reassignment.'
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initializeFromTemplates();
    initNotifications();
    initCreateGroupModal();
    renderJoinedGroups();
    renderPendingInvites();
});

function initializeFromTemplates() {
    localStorage.setItem(STORAGE_JOINED, JSON.stringify(MOCK_JOINED));
    localStorage.setItem(STORAGE_PENDING, JSON.stringify(MOCK_PENDING));
}

function getJoinedGroups() {
    return JSON.parse(localStorage.getItem(STORAGE_JOINED) || '[]');
}

function getPendingInvites() {
    return JSON.parse(localStorage.getItem(STORAGE_PENDING) || '[]');
}

function saveJoinedGroups(groups) {
    localStorage.setItem(STORAGE_JOINED, JSON.stringify(groups));
}

function savePendingInvites(invites) {
    localStorage.setItem(STORAGE_PENDING, JSON.stringify(invites));
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

function initNotifications() {
    const trigger = document.getElementById('notiTrigger');
    const dropdown = document.getElementById('notiDropdown');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        dropdown.classList.remove('active');
    });
}

function renderJoinedGroups() {
    const groups = getJoinedGroups();
    const grid = document.getElementById('joinedGroupsGrid');
    const empty = document.getElementById('joinedEmpty');
    const count = document.getElementById('joinedCount');

    count.textContent = groups.length;
    grid.innerHTML = '';

    if (groups.length === 0) {
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');

    groups.forEach(group => {
        const initial = group.name.charAt(0).toUpperCase();
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'group-card';
        card.innerHTML = `
            <div class="group-card-top">
                <div class="group-card-icon">${escapeHtml(initial)}</div>
                <span class="badge badge-progress">${escapeHtml(group.role || 'Member')}</span>
            </div>
            <span class="group-card-title">${escapeHtml(group.name)}</span>
            <p class="group-card-desc">${escapeHtml(group.description || 'No description provided.')}</p>
            <div class="group-card-meta">
                <span class="meta-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Created ${formatDate(group.createdAt)}
                </span>
                <span class="meta-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                    ${group.memberCount || 1} members
                </span>
            </div>
            <span class="group-card-enter">Enter group →</span>
        `;

        card.addEventListener('click', () => {
            localStorage.setItem(STORAGE_ACTIVE, group.id);
            window.location.href = 'dashboard.html';
        });

        grid.appendChild(card);
    });
}

function renderPendingInvites() {
    const invites = getPendingInvites();
    const list = document.getElementById('pendingInvitesList');
    const empty = document.getElementById('pendingEmpty');
    const count = document.getElementById('pendingCount');

    count.textContent = invites.length;
    list.innerHTML = '';

    if (invites.length === 0) {
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');

    invites.forEach(invite => {
        const initial = invite.name.charAt(0).toUpperCase();
        const card = document.createElement('div');
        card.className = 'invite-card';
        card.dataset.id = invite.id;

        const rulesHtml = (invite.rules || []).map(r => `<li>${escapeHtml(r)}</li>`).join('');
        const consequencesHtml = (invite.consequences || []).map(c => `<li>${escapeHtml(c)}</li>`).join('');

        card.innerHTML = `
            <div class="invite-card-header">
                <div class="group-card-icon">${escapeHtml(initial)}</div>
                <div class="invite-card-body">
                    <h3 class="invite-card-title">${escapeHtml(invite.name)}</h3>
                    <p class="invite-card-desc">${escapeHtml(invite.description || '')}</p>
                    <div class="invite-card-meta">
                        <span>Invited by <strong>${escapeHtml(invite.invitedBy || 'Unknown')}</strong></span>
                        <span>Created ${formatDate(invite.createdAt)}</span>
                    </div>
                </div>
                <span class="invite-badge">Pending</span>
            </div>

            <div class="agreement-panel">
                <p class="agreement-panel-title">Group Agreement</p>
                <div class="agreement-block">
                    <h4>Rules</h4>
                    <ul class="agreement-list">${rulesHtml || '<li>No rules specified.</li>'}</ul>
                </div>
                <div class="agreement-block">
                    <h4>Consequences</h4>
                    <ul class="agreement-list">${consequencesHtml || '<li>No consequences specified.</li>'}</ul>
                </div>
                <label class="agreement-checkbox">
                    <input type="checkbox" class="agreement-check">
                    <span>I have read and understand the rules.</span>
                </label>
            </div>

            <div class="invite-actions">
                <button type="button" class="btn btn-decline decline-btn">Decline Invitation</button>
                <button type="button" class="btn btn-primary btn-accept accept-btn" disabled>Accept & Join</button>
            </div>
        `;

        const checkbox = card.querySelector('.agreement-check');
        const acceptBtn = card.querySelector('.accept-btn');
        const declineBtn = card.querySelector('.decline-btn');

        checkbox.addEventListener('change', () => {
            acceptBtn.disabled = !checkbox.checked;
        });

        acceptBtn.addEventListener('click', () => {
            if (!checkbox.checked) return;
            acceptInvitation(invite, card);
        });

        declineBtn.addEventListener('click', () => {
            declineInvitation(invite.id, card);
        });

        list.appendChild(card);
    });
}

function acceptInvitation(invite, cardEl) {
    const joined = getJoinedGroups();
    joined.unshift({
        id: invite.id,
        name: invite.name,
        description: invite.description,
        rules: invite.rules,
        consequences: invite.consequences,
        createdAt: invite.createdAt,
        memberCount: invite.memberCount || 2,
        role: 'Member'
    });
    saveJoinedGroups(joined);

    const pending = getPendingInvites().filter(i => i.id !== invite.id);
    savePendingInvites(pending);

    cardEl.classList.add('removing');
    showToast(`You joined ${invite.name}`);

    setTimeout(() => {
        renderJoinedGroups();
        renderPendingInvites();
    }, 320);
}

function declineInvitation(inviteId, cardEl) {
    const pending = getPendingInvites().filter(i => i.id !== inviteId);
    savePendingInvites(pending);

    cardEl.classList.add('removing');
    showToast('Invitation declined');

    setTimeout(() => {
        renderPendingInvites();
    }, 320);
}

function initCreateGroupModal() {
    const modal = document.getElementById('createGroupModal');
    const openBtn = document.getElementById('openCreateGroupBtn');
    const closeBtn = document.getElementById('closeCreateGroupBtn');
    const cancelBtn = document.getElementById('cancelCreateGroupBtn');
    const createForm = document.getElementById('createGroupForm');
    const groupNameInput = document.getElementById('groupName');
    const groupRulesInput = document.getElementById('groupRules');
    const groupConsequencesInput = document.getElementById('groupConsequences');
    const submitBtn = document.getElementById('submitGroupBtn');
    const memberInput = document.getElementById('memberInput');
    const memberRole = document.getElementById('memberRole');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const membersList = document.getElementById('membersList');
    const emptyMembersText = document.getElementById('emptyMembersText');

    let invitedMembers = [];

    function isFormValid() {
        return groupNameInput.value.trim().length > 0
            && groupRulesInput.value.trim().length > 0
            && groupConsequencesInput.value.trim().length > 0;
    }

    function updateSubmitState() {
        submitBtn.disabled = !isFormValid();
    }

    function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => groupNameInput.focus(), 150);
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function resetForm() {
        createForm.reset();
        invitedMembers = [];
        document.querySelectorAll('.member-chip:not(.is-creator)').forEach(el => el.remove());
        emptyMembersText.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Create Group';
        submitBtn.classList.remove('btn-loading');
    }

    function renderMembers() {
        emptyMembersText.style.display = invitedMembers.length > 0 ? 'none' : 'block';
        document.querySelectorAll('.member-chip:not(.is-creator)').forEach(el => el.remove());

        invitedMembers.forEach((member, index) => {
            const chip = document.createElement('div');
            chip.className = 'member-chip';
            const initial = member.name.charAt(0).toUpperCase();
            chip.innerHTML = `
                <div class="avatar-sm bg-teal">${initial}</div>
                <div class="chip-info">
                    <span class="chip-name">${escapeHtml(member.name)}</span>
                    <span class="chip-role muted">${escapeHtml(member.role)}</span>
                </div>
                <button type="button" class="remove-btn" data-index="${index}" title="Remove">✕</button>
            `;
            membersList.appendChild(chip);
        });

        membersList.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const idx = parseInt(this.getAttribute('data-index'), 10);
                const chipEl = this.closest('.member-chip');
                chipEl.classList.add('fade-out');
                setTimeout(() => {
                    invitedMembers.splice(idx, 1);
                    renderMembers();
                }, 200);
            });
        });
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', () => { closeModal(); resetForm(); });
    cancelBtn.addEventListener('click', () => { closeModal(); resetForm(); });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
            resetForm();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
            resetForm();
        }
    });

    [groupNameInput, groupRulesInput, groupConsequencesInput].forEach(input => {
        input.addEventListener('input', updateSubmitState);
    });

    addMemberBtn.addEventListener('click', () => {
        const val = memberInput.value.trim();
        if (val !== '') {
            invitedMembers.push({ name: val, role: memberRole.value });
            memberInput.value = '';
            memberInput.focus();
            renderMembers();
        }
    });

    memberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addMemberBtn.click();
        }
    });

    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        const groupId = 'grp_' + Date.now().toString(36);
        const groupData = {
            id: groupId,
            name: groupNameInput.value.trim(),
            description: document.getElementById('groupDesc').value.trim(),
            rules: groupRulesInput.value.split('\n').map(l => l.trim()).filter(Boolean),
            consequences: groupConsequencesInput.value.split('\n').map(l => l.trim()).filter(Boolean),
            invitedMembers: invitedMembers,
            createdAt: new Date().toISOString(),
            memberCount: invitedMembers.length + 1,
            role: 'Leader'
        };

        const joined = getJoinedGroups();
        joined.unshift(groupData);
        saveJoinedGroups(joined);
        localStorage.setItem(STORAGE_ACTIVE, groupId);

        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;

        setTimeout(() => {
            closeModal();
            resetForm();
            renderJoinedGroups();
            showToast(`Group "${groupData.name}" created`);
        }, 600);
    });
}
