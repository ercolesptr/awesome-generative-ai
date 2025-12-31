const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

let conversationHistory = [];

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value;
    if (!userMessage) return;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.textContent = userMessage;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    conversationHistory.push({ role: 'user', content: userMessage });

    chatInput.value = '';

    try {
        const response = await fetch('http://localhost:11434/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'default-model', // IMPORTANT: Replace with your model name
                messages: conversationHistory,
                stream: true,
            }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';
        let assistantMessageElement = null;

        assistantMessageElement = document.createElement('div');
        assistantMessageElement.classList.add('message', 'assistant-message');
        chatWindow.appendChild(assistantMessageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data.trim() === '[DONE]') {
                        break;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || '';
                        if (content) {
                            assistantMessage += content;
                            assistantMessageElement.textContent = assistantMessage;
                            chatWindow.scrollTop = chatWindow.scrollHeight;
                        }
                    } catch (error) {
                        console.error('Error parsing stream data:', error);
                    }
                }
            }
        }

        if (assistantMessage) {
            conversationHistory.push({ role: 'assistant', content: assistantMessage });
        }
    } catch (error) {
        console.error('Error connecting to the server:', error);
        const errorElement = document.createElement('div');
        errorElement.classList.add('message', 'assistant-message');
        errorElement.textContent = 'Could not connect to the FastflowLM server. Please make sure it is running.';
        chatWindow.appendChild(errorElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});
