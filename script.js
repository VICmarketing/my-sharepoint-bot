// ใส่ URL ของ n8n Webhook
const N8N_WEBHOOK_URL = 'http://vic-n8n.store:3001/webhook-test/d102148d-d88b-4754-aecc-39054c4dde00';

const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const chatForm = document.getElementById('chat-form');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  addMessageToHistory(userMessage, 'user-message');
  messageInput.value = '';

  try {
    // ส่งแบบ form-urlencoded เพื่อลดปัญหา CORS preflight
    const body = new URLSearchParams({ message: userMessage });

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json().catch(() => ({}));
    const botText = data?.response ?? data?.reply ?? data?.text ?? JSON.stringify(data);

    addMessageToHistory(botText, 'bot-message');

  } catch (error) {
    console.error('Error sending message to n8n:', error);
    addMessageToHistory('ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อ', 'bot-message');
  }
});

function addMessageToHistory(message, className) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', className);
  messageElement.textContent = message;
  chatHistory.appendChild(messageElement);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}
