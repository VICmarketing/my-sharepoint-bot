// <<<< ------ ใส่ URL ของ n8n Webhook ของคุณที่นี่ ------ >>>>
const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL';
// <<<< -------------------------------------------------- >>>>

const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const chatForm = document.getElementById('chat-form');

// เมื่อฟอร์มถูกส่ง (กด Enter หรือคลิกปุ่ม)
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้ารีโหลด
    const userMessage = messageInput.value.trim();

    if (!userMessage) return;

    // แสดงข้อความของผู้ใช้บนหน้าจอ
    addMessageToHistory(userMessage, 'user-message');
    messageInput.value = '';

    try {
        // ส่งข้อความไปที่ n8n
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // ส่งข้อมูลในรูปแบบ JSON โดยมี key ชื่อ "message"
            // ซึ่งต้องตรงกับที่เรารอรับในโหนด Code ของ n8n
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // รับคำตอบจาก n8n ที่เป็น JSON กลับมา
        const botResponseData = await response.json();
        
        // แสดงข้อความของบอท
        addMessageToHistory(botResponseData.response, 'bot-message');

    } catch (error) {
        console.error('Error sending message to n8n:', error);
        addMessageToHistory('ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อ', 'bot-message');
    }
});

// ฟังก์ชันสำหรับเพิ่มข้อความลงในหน้าต่างแชท
function addMessageToHistory(message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);
    // เลื่อนลงไปล่างสุด
    chatHistory.scrollTop = chatHistory.scrollHeight;
}