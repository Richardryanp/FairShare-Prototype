document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. DYNAMIC TASK COUNT & CHECKBOX LOGIC
    // ==========================================
    const taskCards = document.querySelectorAll('.task-card');
    
    function updateTaskCounts() {
        const counts = { all: 0, progress: 0, soon: 0, overdue: 0, completed: 0 };
        
        taskCards.forEach(card => {
            counts.all++;
            const status = card.getAttribute('data-status');
            if (counts[status] !== undefined) counts[status]++;
        });

        // Update the badges in the DOM
        document.querySelector('[data-filter="all"] .task-count').textContent = counts.all;
        document.querySelector('[data-filter="progress"] .task-count').textContent = counts.progress;
        document.querySelector('[data-filter="soon"] .task-count').textContent = counts.soon;
        document.querySelector('[data-filter="overdue"] .task-count').textContent = counts.overdue;
        document.querySelector('[data-filter="completed"] .task-count').textContent = counts.completed;
    }

    // Save original status and handle checking/unchecking
    const taskChecks = document.querySelectorAll('.task-check');
    taskChecks.forEach(check => {
        const card = check.closest('.task-card');
        card.dataset.origStatus = card.dataset.status; // Backup original state
        
        check.addEventListener('change', function() {
            if (this.checked) {
                card.classList.add('is-completed');
                card.dataset.status = 'completed';
                card.querySelector('.badge').className = 'badge badge-done';
                card.querySelector('.badge').textContent = 'Completed';
            } else {
                card.classList.remove('is-completed');
                card.dataset.status = card.dataset.origStatus; // Revert
                
                // Revert badge visually
                const badge = card.querySelector('.badge');
                if(card.dataset.origStatus === 'overdue') { badge.className = 'badge badge-late'; badge.textContent = 'Overdue'; }
                else if(card.dataset.origStatus === 'soon') { badge.className = 'badge badge-warning'; badge.textContent = 'Due Soon'; }
                else { badge.className = 'badge badge-progress'; badge.textContent = 'In Progress'; }
            }
            
            updateTaskCounts(); // Recalculate instantly
            
            // If the user is currently looking at a specific filter, hide the item gracefully
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            if(activeFilterBtn && activeFilterBtn.dataset.filter !== 'all') {
                if (card.dataset.status !== activeFilterBtn.dataset.filter) {
                    card.classList.add('fade-out');
                    setTimeout(() => card.classList.add('hidden'), 300); // Wait for CSS transition
                }
            }
        });
    });

    updateTaskCounts();


    // ==========================================
    // 2. SMOOTH FILTER TABS LOGIC
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const emptyState = document.getElementById('empty-state');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            let visibleCount = 0;

            taskCards.forEach(card => {
                const status = card.getAttribute('data-status');
                
                if (filterValue === 'all' || status === filterValue) {
                    card.classList.remove('hidden');
                    setTimeout(() => card.classList.remove('fade-out'), 10); 
                    visibleCount++;
                } else {
                    card.classList.add('fade-out');
                    setTimeout(() => {
                        if (card.classList.contains('fade-out')) card.classList.add('hidden');
                    }, 300); 
                }
            });

            // Toggle Empty State UI smoothly
            setTimeout(() => {
                if (visibleCount === 0) {
                    emptyState.classList.remove('hidden');
                } else {
                    emptyState.classList.add('hidden');
                }
            }, 300);
        });
    });


    // ==========================================
    // 3. DYNAMIC CALENDAR & INTERACTIONS (IMPROVED)
    // ==========================================
    const calendarDaysGrid = document.getElementById('calendarDays');
    const currentMonthYearTitle = document.getElementById('currentMonthYear');
    const btnPrevMonth = document.getElementById('prevMonthBtn');
    const btnNextMonth = document.getElementById('nextMonthBtn');

    const selectedDateTitle = document.getElementById('selected-date-title');
    const selectedDateTasks = document.getElementById('selected-date-tasks');

    // Create dynamic tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'cal-tooltip';
    tooltip.className = 'cal-tooltip';
    document.body.appendChild(tooltip);

    // Initial Date Config (May 2026 based on given context)
    let currentDate = new Date(2026, 4, 1); 
    const realToday = new Date(); // To highlight true current day

    // Dummy Task Database (YYYY-MM-DD standard format prevents bugs)
    const calendarData = {
        "2026-05-02": [{ title: "Create Group Schema", time: "10:00 AM", dot: "bg-green" }],
        "2026-05-04": [{ title: "Backend API Integration", time: "07:30 PM", dot: "bg-red" }],
        "2026-05-05": [
            { title: "UI Design Revision", time: "02:00 PM", dot: "bg-yellow" },
            { title: "Team Sync", time: "04:00 PM", dot: "bg-blue" } 
        ],
        "2026-05-08": [{ title: "Testing Phase Setup", time: "09:00 AM", dot: "bg-blue" }]
    };

    function renderCalendar() {
        // Trigger subtle animation
        calendarDaysGrid.classList.add('cal-fade');

        setTimeout(() => {
            calendarDaysGrid.innerHTML = '';
            
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            currentMonthYearTitle.textContent = `${monthNames[month]} ${year}`;

            // Calendar Math
            const firstDayIndex = new Date(year, month, 1).getDay(); // Hari pertama bulan ini
            const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total hari bulan ini
            const daysInPrevMonth = new Date(year, month, 0).getDate(); // Total hari bulan sebelumnya

            // Render Previous Month "Empty/Muted" Days
            for (let i = firstDayIndex; i > 0; i--) {
                const cell = document.createElement('div');
                cell.className = 'cal-cell empty';
                cell.textContent = daysInPrevMonth - i + 1;
                calendarDaysGrid.appendChild(cell);
            }

            // Render Current Month Days
            for (let i = 1; i <= daysInMonth; i++) {
                const cell = document.createElement('div');
                cell.className = 'cal-cell';
                
                // Format tanggal YYYY-MM-DD
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const displayTitle = `${monthNames[month]} ${i}`;
                
                cell.setAttribute('data-date', dateString);
                
                // Masukkan angka tanggal
                const numSpan = document.createElement('span');
                numSpan.className = 'date-num';
                numSpan.textContent = i;
                cell.appendChild(numSpan);

                // Logika Highlighting Hari Ini
                if (year === realToday.getFullYear() && month === realToday.getMonth() && i === realToday.getDate()) {
                    cell.classList.add('is-today');
                }

                // Cek apakah ada tugas di hari tersebut
                const tasks = calendarData[dateString] || [];
                if (tasks.length > 0) {
                    cell.classList.add('has-task');
                    const dotsContainer = document.createElement('div');
                    dotsContainer.className = 'task-dots';
                    
                    tasks.forEach(t => {
                        const dot = document.createElement('span');
                        dot.className = `dot ${t.dot}`;
                        dotsContainer.appendChild(dot);
                    });
                    cell.appendChild(dotsContainer);
                }

                // Interaction: Mouse Enter (Show Tooltip)
                cell.addEventListener('mouseenter', () => {
                    let html = `<div class="tooltip-header">${displayTitle}</div>`;
                    
                    if (tasks.length > 0) {
                        tasks.forEach(t => {
                            html += `
                            <div class="tooltip-task">
                                <span class="dot ${t.dot}"></span>
                                <div>
                                    <p style="margin:0; color:var(--text-primary); font-weight: 500;">${t.title}</p>
                                    <p class="time">${t.time}</p>
                                </div>
                            </div>`;
                        });
                    } else {
                        html += `
                        <div class="tooltip-empty">
                            No tasks scheduled.
                            <br><span class="add-shortcut">+ Add Task</span>
                        </div>`;
                    }

                    tooltip.innerHTML = html;
                    tooltip.style.display = 'block';

                    // BugFix: Dynamic Positioning calculations
                    const rect = cell.getBoundingClientRect();
                    let topPos = rect.top + window.scrollY - tooltip.offsetHeight - 10;
                    
                    // Kalau mentok ke atas layar, pop up muncul ke bawah element
                    if (topPos < window.scrollY) {
                        topPos = rect.bottom + window.scrollY + 10;
                    }
                    
                    tooltip.style.left = `${rect.left + window.scrollX - (tooltip.offsetWidth / 2) + (rect.width / 2)}px`;
                    tooltip.style.top = `${topPos}px`;
                    tooltip.classList.add('show');
                });

                // Interaction: Mouse Leave (Hide Tooltip)
                cell.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('show');
                });

                // Interaction: Click Date
                cell.addEventListener('click', () => {
                    document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('active'));
                    cell.classList.add('active');

                    selectedDateTitle.textContent = `Tasks on ${displayTitle}`;

                    if (tasks.length > 0) {
                        selectedDateTasks.innerHTML = tasks.map(t => `
                            <div class="mini-task">
                                <span class="dot ${t.dot}"></span>
                                <p>${t.title} <span class="muted">(${t.time})</span></p>
                            </div>
                        `).join('');
                    } else {
                        selectedDateTasks.innerHTML = `
                            <div style="text-align: center; padding: 16px; background: rgba(255,255,255,0.02); color: var(--text-secondary); font-size: 0.85rem; border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle);">
                                No tasks scheduled for this day.
                            </div>
                        `;
                    }
                });

                calendarDaysGrid.appendChild(cell);
            }

            // Render Next Month Fillers
            const totalCellsRendered = calendarDaysGrid.children.length;
            const remainingCells = 42 - totalCellsRendered; // Kalender grid selalu fix 42 cell (6 baris)
            for (let i = 1; i <= remainingCells; i++) {
                const cell = document.createElement('div');
                cell.className = 'cal-cell empty';
                cell.textContent = i;
                calendarDaysGrid.appendChild(cell);
            }

            // Akhiri animasi
            calendarDaysGrid.classList.remove('cal-fade');
        }, 200); 
    }

    // Trigger Navigasi
    if(btnPrevMonth && btnNextMonth) {
        btnPrevMonth.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        btnNextMonth.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    // Jalankan pertama kali saat load
    renderCalendar();
});

