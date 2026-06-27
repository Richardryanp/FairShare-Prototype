// --- THEME INITIALIZATION ---
// Jalankan paling atas untuk mencegah kedipan putih (flash of light mode)
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Staggered Entrance Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -20px 0px" };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            if (entry.target.classList.contains('stagger')) {
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.stagger'));
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); 
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 2. Desktop Sidebar Collapse Logic (With SVG Swap) ---
    const collapseBtn = document.getElementById('collapseBtn');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
            
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            const icon = collapseBtn.querySelector('.toggle-icon');
            
            if (isCollapsed) {
                collapseBtn.title = "Expand Sidebar";
                icon.innerHTML = '<path d="m9 18 6-6-6-6"/>'; 
            } else {
                collapseBtn.title = "Collapse Sidebar";
                icon.innerHTML = '<path d="m15 18-6-6 6-6"/>'; 
            }
        });
    }

    // --- 3. Mobile Sidebar & Navbar Logic (BULLETPROOF VERSION) ---
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-sidebar-btn');
    const overlay = document.querySelector('.sidebar-overlay');
    const navItems = document.querySelectorAll('.nav-item'); 
    const navLinks = document.querySelector('.nav-links');

    function toggleMenu() {
        if (sidebar) {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        } else if (navLinks) {
            navLinks.classList.toggle('active');
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    if (navItems.length > 0 && sidebar) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (sidebar.classList.contains('open')) toggleMenu();
            });
        });
    }

    if (navLinks) {
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) toggleMenu();
            });
        });
    }

    // --- 4. EXTENDED LOGIC: Quick Add, Dynamic View All Toggles & Smart Eraser System ---
    const addInput = document.querySelector('.quick-add-input');
    const addBtn = document.querySelector('.quick-add .btn-primary');
    const taskList = document.querySelector('.task-list');
    const statValues = document.querySelectorAll('.stat-card .stat-value');
    const viewAllPriorityBtn = document.querySelector('.task-overview .view-all');
    const viewAllActivityBtn = document.querySelector('.activity-log .view-all');
    const notiBtn = document.querySelector('.notification-trigger');
    const headerNewTaskBtn = document.querySelector('.dashboard-header .btn-primary');

    const notiDropdown = document.querySelector('.noti-dropdown');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileBtn = document.querySelector('.profile-trigger-btn');
    const shareReportBtn = document.querySelector('.dashboard-header .btn-secondary');
    const toastContainer = document.getElementById('toastContainer');

    function executeAddTask() {
        const taskTitle = addInput.value.trim();
        if (taskTitle === '') return;

        if (taskList) {
            const newTaskHTML = `
                <a href="#" class="task-item task-blue" style="animation: reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 1; transform: translateY(0);">
                    <div class="task-info">
                        <h3 class="task-title">${taskTitle}</h3>
                        <span class="task-meta text-blue">🔵 Due in 7 days</span>
                    </div>
                    <div class="task-actions">
                        <span class="badge badge-progress">In Progress</span>
                        <div class="avatar-sm" title="Assigned to Yofi">Y</div>
                        <button class="task-delete-btn" title="Delete Task">&times;</button>
                    </div>
                </a>
            `;
            taskList.insertAdjacentHTML('beforeend', newTaskHTML);
        }

        if (statValues.length >= 5) {
            let currentTotal = parseInt(statValues[0].textContent) || 0;
            statValues[0].textContent = currentTotal + 1;

            let currentInProgress = parseInt(statValues[2].textContent) || 0;
            statValues[2].textContent = currentInProgress + 1;
        }

        if (addBtn) {
            const originalText = addBtn.textContent;
            addBtn.textContent = 'Added!';
            addBtn.style.backgroundColor = 'var(--status-done)';
            addBtn.style.color = '#fff';
            
            setTimeout(() => {
                addBtn.textContent = originalText;
                addBtn.style.backgroundColor = '';
                addBtn.style.color = '';
            }, 1000);
        }
        addInput.value = '';
    }

    if (addBtn && addInput) {
        addBtn.addEventListener('click', executeAddTask);
        addInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeAddTask();
        });
    }

    if (viewAllPriorityBtn) {
        viewAllPriorityBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const extraTasks = document.querySelectorAll('.task-list .extra-task');
            if (extraTasks.length === 0) return;

            const areHidden = extraTasks[0].style.display === 'none';

            extraTasks.forEach(task => {
                task.style.display = areHidden ? 'flex' : 'none';
            });

            viewAllPriorityBtn.textContent = areHidden ? 'Show less' : 'View all';
        });
    }

    if (viewAllActivityBtn) {
        viewAllActivityBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const extraActivities = document.querySelectorAll('.activity-feed .extra-activity');
            if (extraActivities.length === 0) return;

            const areHidden = extraActivities[0].style.display === 'none';

            extraActivities.forEach(act => {
                act.style.display = areHidden ? 'flex' : 'none';
            });

            viewAllActivityBtn.textContent = areHidden ? 'Show less' : 'View all';
        });
    }

    if (taskList) {
        taskList.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.task-delete-btn');
            if (!deleteBtn) return;

            e.preventDefault();
            e.stopPropagation();

            const taskItem = deleteBtn.closest('.task-item');
            if (!taskItem) return;

            let taskType = '';
            if (taskItem.classList.contains('task-blue')) taskType = 'progress';
            else if (taskItem.classList.contains('task-yellow')) taskType = 'warning';
            else if (taskItem.classList.contains('task-red')) taskType = 'late';

            taskItem.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            taskItem.style.opacity = '0';
            taskItem.style.transform = 'translateX(30px)';

            setTimeout(() => {
                taskItem.remove();

                if (statValues.length >= 5) {
                    let total = parseInt(statValues[0].textContent) || 0;
                    if (total > 0) statValues[0].textContent = total - 1;

                    if (taskType === 'progress') {
                        let count = parseInt(statValues[2].textContent) || 0;
                        if (count > 0) statValues[2].textContent = count - 1;
                    } else if (taskType === 'warning') {
                        let count = parseInt(statValues[3].textContent) || 0;
                        if (count > 0) statValues[3].textContent = count - 1;
                    } else if (taskType === 'late') {
                        let count = parseInt(statValues[4].textContent) || 0;
                        if (count > 0) statValues[4].textContent = count - 1;
                    }
                }
            }, 300);
        });
    }

    if (headerNewTaskBtn && addInput) {
        headerNewTaskBtn.addEventListener('click', () => {
            addInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                addInput.focus();
                addInput.classList.add('highlight-focus');
                setTimeout(() => {
                    addInput.classList.remove('highlight-focus');
                }, 1200);
            }, 400);
        });
    }

    // --- 5. BULLETPROOF UI STATE CONTROLLER: Dropdowns Class Toggles ---
    
    // Handler Klik Notifikasi (State Class Mode)
    if (notiBtn && notiDropdown) {
        notiBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            
            const dot = notiBtn.querySelector('.noti-badge-dot');
            if (dot) {
                dot.style.opacity = '0'; 
                setTimeout(() => dot.remove(), 200);
            }
            
            if (profileDropdown) profileDropdown.classList.remove('active');
            notiDropdown.classList.toggle('active');
        });
    }

    // Handler Klik Profil (State Class Mode)
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (notiDropdown) notiDropdown.classList.remove('active');
            profileDropdown.classList.toggle('active');
        });
    }

    // Menghentikan penutupan saat area dalam kartu dropdown diklik
    document.querySelectorAll('.header-dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', (e) => e.stopPropagation());
    });

    // Penutupan Global (Klik di luar komponen otomatis membersihkan seluruh state aktif)
    document.addEventListener('click', () => {
        if (notiDropdown) notiDropdown.classList.remove('active');
        if (profileDropdown) profileDropdown.classList.remove('active');
    });

    // Toast Clipboard Notification Emitter
    if (shareReportBtn && toastContainer) {
        shareReportBtn.addEventListener('click', () => {
            const newToast = document.createElement('div');
            newToast.className = 'toast-notification';
            newToast.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--status-done);"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span>Workspace report link copied to clipboard!</span>
            `;
            
            toastContainer.appendChild(newToast);
            
            setTimeout(() => {
                newToast.classList.add('fade-out');
                setTimeout(() => {
                    newToast.remove();
                }, 300);
            }, 2500);
        });
    }

});