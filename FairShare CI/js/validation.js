document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================================
    // --- 1. STATE MANAGEMENT & FILTERING ---
    // =========================================================
    let tasks = [];
    let currentFilter = 'all';

    document.querySelectorAll('.validation-card').forEach(card => {
        tasks.push({ element: card, status: card.getAttribute('data-status') || 'pending' });
    });

    const updateCounts = () => {
        const counts = { all: tasks.length, pending: 0, approved: 0, rejected: 0 };
        tasks.forEach(t => counts[t.status]++);
        
        const elAll = document.getElementById('count-all');
        const elApp = document.getElementById('count-approved');
        const elRej = document.getElementById('count-rejected');
        
        if(elAll) elAll.textContent = `(${counts.all})`;
        if(elApp) elApp.textContent = `(${counts.approved})`;
        if(elRej) elRej.textContent = `(${counts.rejected})`;
    };

    const renderTasks = () => {
        tasks.forEach(t => {
            if (currentFilter === 'all' || t.status === currentFilter) {
                t.element.style.display = 'flex';
            } else {
                t.element.style.display = 'none';
            }
        });
    };

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentFilter = e.currentTarget.getAttribute('data-filter');
            renderTasks();
        });
    });

    document.querySelectorAll('.validation-card').forEach(card => {
        const approveBtn = card.querySelector('.approve-btn') || card.querySelector('.btn-approve');
        const rejectBtn = card.querySelector('.reject-btn') || card.querySelector('.btn-reject');
        const badge = card.querySelector('.badge') || card.querySelector('.status-badge');
        
        if (approveBtn && badge) {
            approveBtn.addEventListener('click', () => {
                card.setAttribute('data-status', 'approved');
                badge.className = 'badge badge-success';
                badge.textContent = 'Approved';
                badge.style.background = 'rgba(16, 185, 129, 0.2)';
                badge.style.color = '#10B981';
                updateCardState(card, 'approved');
            });
        }

        if (rejectBtn && badge) {
            rejectBtn.addEventListener('click', () => {
                card.setAttribute('data-status', 'rejected');
                badge.className = 'badge badge-danger';
                badge.textContent = 'Rejected';
                badge.style.background = 'rgba(239, 68, 68, 0.2)';
                badge.style.color = '#EF4444';
                updateCardState(card, 'rejected');
            });
        }
    });

    function updateCardState(card, status) {
        const taskObj = tasks.find(t => t.element === card);
        if(taskObj) taskObj.status = status;
        updateCounts();
        if(currentFilter !== 'all') setTimeout(() => renderTasks(), 300);
    }
    updateCounts();


    // =========================================================
    // --- 2. FAKE AI CHATBOT SYSTEM (GOD TIER UPGRADE) 🚀 ---
    // =========================================================
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiMessages = document.getElementById('aiMessages');
    const aiStatus = document.getElementById('aiStatus');
    const suggestedPrompts = document.querySelectorAll('.prompt-chip');

    let aiMemory = [];
    let isThinking = false;

    // OTOMATIS TAMBAHKAN PESAN AWAL (STANDBY)
    if (aiMessages && aiMessages.children.length === 0) {
        aiMessages.innerHTML = `
            <div class="msg msg-ai">
                <div class="msg-ai-label">AI Assistant</div>
                <p>Halo! 👋 Ada yang bisa saya bantu terkait validasi tugas? Kamu bisa klik "✨ Analyze Task" di sebelah kiri, atau ketik nama anggota (misal: "Cek tugas Wilbert") untuk analisis otomatis.</p>
            </div>
        `;
    }

    const aiKnowledgeBase = {
        deadline: [
            { struct: "Good", clarity: "Needs improvement", missing: "Exact time of day", rec: "revision", txt: "The deadline is visible, but clarifying the exact time of day could prevent confusion." },
            { struct: "Excellent", clarity: "Good", missing: "Timezone specification", rec: "approve", txt: "Scheduling looks solid, though adding a timezone helps remote team members." },
        ],
        group: [
            { struct: "Needs Work", clarity: "Good", missing: "Role delegation", rec: "revision", txt: "Collaboration tasks are mentioned, but specific role assignments are missing." },
            { struct: "Good", clarity: "Excellent", missing: "None", rec: "approve", txt: "Team structure is well defined. Ready for collaborative work." }
        ],
        clarity: [
            { struct: "Good", clarity: "Needs improvement", missing: "Actionable steps", rec: "revision", txt: "The intent is clear, but breaking it down into actionable steps will help." },
            { struct: "Excellent", clarity: "Excellent", missing: "None", rec: "approve", txt: "The description is extremely clear and straightforward." }
        ],
        default: [
            { struct: "Good", clarity: "Good", missing: "Minor details", rec: "approve", txt: "I've reviewed the request. The task structure looks organized and standard. It's generally ready." },
            { struct: "Average", clarity: "Needs review", missing: "Supporting files/links", rec: "revision", txt: "It seems okay based on the input, but ensure all necessary reference links or files are clearly stated." }
        ]
    };

    const scrollToBottom = () => {
        if(!aiMessages) return;
        aiMessages.scrollTop = aiMessages.scrollHeight;
    };

    const appendUserMessage = (text) => {
        if(!aiMessages) return;
        const msgHtml = `<div class="msg msg-user"><p>${text}</p></div>`;
        aiMessages.insertAdjacentHTML('beforeend', msgHtml);
        scrollToBottom();
        aiMemory.push({ role: 'user', text: text.toLowerCase() });
        if(aiMemory.length > 5) aiMemory.shift(); 
    };

    const showTypingIndicator = () => {
        if(!aiMessages) return null;
        const typingId = 'typing-' + Date.now();
        const typingHtml = `
            <div class="msg msg-ai" id="${typingId}">
                <div class="msg-ai-label">AI Assistant</div>
                <div style="display:flex; align-items:center;">
                    <div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
                    <span class="thinking-text" id="thinking-text-${typingId}">Analyzing input...</span>
                </div>
            </div>`;
        aiMessages.insertAdjacentHTML('beforeend', typingHtml);
        scrollToBottom();
        return typingId;
    };

    const generateSmartResponse = (text) => {
        let matchCategory = 'default';
        const lowerText = text.toLowerCase();

        if (lowerText.includes('deadline') || lowerText.includes('late') || lowerText.includes('time') || lowerText.includes('waktu')) matchCategory = 'deadline';
        else if (lowerText.includes('team') || lowerText.includes('group') || lowerText.includes('collab') || lowerText.includes('tim')) matchCategory = 'group';
        else if (lowerText.includes('clarity') || lowerText.includes('improve') || lowerText.includes('review') || lowerText.includes('analyze') || lowerText.includes('cek')) matchCategory = 'clarity';

        const options = aiKnowledgeBase[matchCategory];
        const selected = options[Math.floor(Math.random() * options.length)];
        const confidence = Math.floor(Math.random() * (98 - 75 + 1)) + 75; 

        return { ...selected, confidence: confidence };
    };

    // 🌟 UPGRADE 1: FUNGSI TYPEWRITER (TEKS STREAMING)
    const appendAiWithTypewriter = (data, extractedContext) => {
        if(!aiMessages) return;
        
        const msgId = 'ai-msg-' + Date.now();
        
        let structIcon = data.struct.includes("Good") || data.struct.includes("Excellent") ? '<span class="icon-green">✔</span>' : '<span class="icon-yellow">⚠</span>';
        let clarityIcon = data.clarity.includes("Good") || data.clarity.includes("Excellent") ? '<span class="icon-green">✔</span>' : '<span class="icon-yellow">⚠</span>';
        let missingIcon = data.missing === "None" ? '<span class="icon-green">✔</span>' : '<span class="icon-red">❌</span>';
        let recClass = data.rec === 'approve' ? 'approve' : 'revision';
        let recText = data.rec === 'approve' ? '✅ <strong>Recommended:</strong> Approve' : '⚠ <strong>Recommended:</strong> Needs Revision';

        // Siapkan kerangka HTML kosong untuk diisi
        const msgHtml = `
            <div class="msg msg-ai" id="${msgId}">
                <div class="msg-ai-label">AI Analysis Result</div>
                <p class="ai-typing-text"></p>
                <div class="ai-feedback" style="display:none; opacity:0; transition: opacity 0.5s ease; margin-top:12px;">
                    <div class="feedback-item">${structIcon} <strong>Structure:</strong> ${data.struct}</div>
                    <div class="feedback-item">${clarityIcon} <strong>Clarity:</strong> ${data.clarity}</div>
                    <div class="feedback-item">${missingIcon} <strong>Missing:</strong> ${data.missing}</div>
                    <hr class="ai-divider">
                    <div class="feedback-rec ${recClass}">${recText}</div>
                    <div class="feedback-score">⚡ Confidence Score: ${data.confidence}%</div>
                </div>
            </div>`;
        
        aiMessages.insertAdjacentHTML('beforeend', msgHtml);
        scrollToBottom();

        const msgContainer = document.getElementById(msgId);
        const textElement = msgContainer.querySelector('.ai-typing-text');
        const feedbackContainer = msgContainer.querySelector('.ai-feedback');

        // Gabungkan teks dengan konteks (jika mendeteksi nama orang dari HTML)
        let finalOutputText = data.txt;
        if(extractedContext) {
            finalOutputText = `I detected you are referring to a specific task in the list. Based on "${extractedContext}", here is my analysis: ` + finalOutputText;
        }

        // Jalankan Efek Mengetik Huruf per Huruf
        let i = 0;
        function typeWriter() {
            if (i < finalOutputText.length) {
                textElement.innerHTML += finalOutputText.charAt(i);
                i++;
                scrollToBottom();
                setTimeout(typeWriter, 15); // Kecepatan ketik (15ms)
            } else {
                // Selesai mengetik, munculkan Feedback Box dengan animasi Fade-in
                feedbackContainer.style.display = 'flex';
                setTimeout(() => {
                    feedbackContainer.style.opacity = '1';
                    scrollToBottom();
                    
                    // BUKA KUNCI UI SETELAH SELESAI MENGETIK
                    isThinking = false;
                    if(aiSendBtn) aiSendBtn.disabled = false;
                    if(aiInput) {
                        aiInput.disabled = false;
                        aiInput.focus();
                    }
                    if(aiStatus) {
                        aiStatus.textContent = "Ready";
                        aiStatus.classList.remove('thinking');
                    }
                }, 50);
            }
        }
        typeWriter();
    };

    const processAiResponse = (userText, isAnalyzeContext = false, extractedContext = "") => {
        if(isThinking || !aiInput || !aiSendBtn) return;
        isThinking = true;
        
        aiSendBtn.disabled = true;
        aiInput.disabled = true;
        
        if(aiStatus) {
            aiStatus.textContent = "Analyzing...";
            aiStatus.classList.add('thinking');
        }

        const typingId = showTypingIndicator();

        // Waktu berpikir lebih dinamis tergantung panjang request
        let thinkTime = 1200;
        if(extractedContext !== "") thinkTime = 2200;

        setTimeout(() => { 
            const t = document.getElementById(`thinking-text-${typingId}`);
            if(t) t.textContent = extractedContext ? "Reading DOM context..." : "Checking clarity..."; 
        }, thinkTime * 0.4);
        
        setTimeout(() => { 
            const t = document.getElementById(`thinking-text-${typingId}`);
            if(t) t.textContent = "Generating response..."; 
        }, thinkTime * 0.7);
        
        setTimeout(() => {
            const typingIndicator = document.getElementById(typingId);
            if(typingIndicator) typingIndicator.remove();
            
            // Gabungkan teks user dengan rahasia extractedContext agar AI tau
            const responseData = generateSmartResponse(userText + " " + extractedContext);
            
            // Panggil fungsi Typewriter (Teks Streaming)
            appendAiWithTypewriter(responseData, extractedContext);
            
            // Note: UI Unlock dipindah ke dalam callback typeWriter() agar user tidak bisa memotong
        }, thinkTime);
    };

    // =========================================================
    // --- 3. EVENT BINDING AMAN (ANTI-MACET) ---
    // =========================================================

    const executeChatSend = () => {
        if (isThinking || !aiInput || !aiSendBtn) return;
        const text = aiInput.value.trim();
        if (text === '') return; 

        aiInput.value = '';
        aiSendBtn.disabled = true;

        appendUserMessage(text);

        // 🌟 UPGRADE 2: AUTO-CONTEXT AWARENESS (MATA AI)
        // Jika user mengetik nama orang di daftar tugas, AI akan baca diam-diam!
        let extractedContext = "";
        const lowerText = text.toLowerCase();
        document.querySelectorAll('.validation-card').forEach(card => {
            const userNameEl = card.querySelector('.val-user h4');
            const taskTitleEl = card.querySelector('h3');
            if(userNameEl && taskTitleEl) {
                const userName = userNameEl.textContent.toLowerCase();
                if (lowerText.includes(userName)) {
                    extractedContext = `${taskTitleEl.textContent}`;
                }
            }
        });

        processAiResponse(text, false, extractedContext);
    };

    if(aiInput && aiSendBtn) {
        aiInput.addEventListener('input', () => { 
            aiSendBtn.disabled = (aiInput.value.trim() === '' || isThinking); 
        });

        aiInput.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') {
                e.preventDefault(); 
                if (!aiSendBtn.disabled && !isThinking) executeChatSend();
            }
        });

        aiSendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!aiSendBtn.disabled && !isThinking) executeChatSend();
        });
    }

    // Tombol di kartu "Analyze Task"
    document.querySelectorAll('.analyze-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(isThinking) return;
            const card = e.target.closest('.validation-card');
            if(!card) return;
            
            const titleEl = card.querySelector('h3');
            const descEl = card.querySelector('.task-desc');
            const title = titleEl ? titleEl.textContent : "Task";
            const desc = descEl ? descEl.textContent : "";
            
            const prompt = `Analyze task: "${title}"`;
            appendUserMessage(prompt);

            const extractedContext = `${title} - ${desc}`; // Kirim konteks rahasia ke AI
            processAiResponse(prompt, true, extractedContext);
        });
    });

    // Chip cepat di bawah input
    if(suggestedPrompts) {
        suggestedPrompts.forEach(chip => {
            chip.addEventListener('click', (e) => {
                if(isThinking) return;
                const text = e.target.textContent;
                appendUserMessage(text);
                processAiResponse(text, false, "");
            });
        });
    }
});