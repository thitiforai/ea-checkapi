// ===== RENDER CHECKLIST =====
function renderChecklist() {
  const container = document.getElementById('checklist');
  CHECKLIST_ITEMS.forEach(item => {
    const div = document.createElement('div');
    div.className = 'checklist-item';
    div.id = `item-${item.id}`;
    div.innerHTML = `
      <input type="checkbox" id="chk-${item.id}" 
             onchange="toggleItem(${item.id})" />
      <label for="chk-${item.id}">${item.text}</label>
    `;
    container.appendChild(div);
  });
  updateProgress();
}

function toggleItem(id) {
  const div = document.getElementById(`item-${id}`);
  const chk = document.getElementById(`chk-${id}`);
  div.classList.toggle('done', chk.checked);
  updateProgress();
}

function updateProgress() {
  const total = CHECKLIST_ITEMS.length;
  const checked = document.querySelectorAll('.checklist input:checked').length;
  const pct = total ? (checked / total * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${checked} / ${total} รายการ`;
}

// ===== CHATBOT =====
function toggleChat() {
  const win = document.getElementById('chatWindow');
  win.classList.toggle('open');
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    const reply = getReply(text);
    appendMessage(reply, 'bot');
  }, 400);
}

// ✅ ใหม่
function appendMessage(text, who) {
  const box = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${who}`;

  if (who === 'bot') {
    // แปลง \n เป็น <br> และ **text** เป็น <strong>
    div.innerHTML = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  } else {
    div.textContent = text; // user message ใช้ textContent ปกติ (ปลอดภัย)
  }

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function getReply(text) {
  const lower = text.toLowerCase();
  for (const qa of QA_DATA) {
    if (qa.keywords.some(k => lower.includes(k))) {
      return qa.answer;
    }
  }
  return "ขอโทษนะครับ ยังไม่มีข้อมูลตรงนี้ ลองถามเรื่อง EA, TOGAF, หรือการเตรียมสอบได้เลยครับ 😊";
}

// ===== INIT =====
renderChecklist();
