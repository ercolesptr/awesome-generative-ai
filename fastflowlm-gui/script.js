const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const modelSelect = document.getElementById('model-select');
const attachButton = document.getElementById('attach-button');
const fileInput = document.getElementById('file-input');
const fileNameSpan = document.getElementById('file-name');

let conversationHistory = [];
let attachedFile = null;

function populateModels() {
    // Hardcoded list of models. Users can edit this array.
    const models = [
        "llama3.2:1b",
        "gemma:2b",
        "mistral:7b",
        "qwen:4b"
    ];

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', populateModels);

attachButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            attachedFile = {
                name: file.name,
                type: file.type,
                data: event.target.result,
            };
            fileNameSpan.textContent = file.name;
        };

        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else {
            // Handle other file types or show an error
            fileNameSpan.textContent = "Unsupported file type.";
            attachedFile = null;
        }
    }
});

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value;
    if (!userMessage) return;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.textContent = userMessage;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const userMessageForHistory = {
        role: 'user',
        content: userMessage,
    };

    if (attachedFile) {
        if (attachedFile.type.startsWith('image/')) {
            userMessageForHistory.content = [
                { type: 'text', text: userMessage },
                { type: 'image_url', image_url: { url: attachedFile.data } },
            ];
        } else if (attachedFile.type === 'text/plain') {
            userMessageForHistory.content = `Attached file "${attachedFile.name}":\n\n${attachedFile.data}\n\n---\n\n${userMessage}`;
        }
    }
    conversationHistory.push(userMessageForHistory);

    chatInput.value = '';

    try {
        const response = await fetch('http://localhost:11434/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelSelect.value,
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

    // Clear the attachment after sending the message
    attachedFile = null;
    fileNameSpan.textContent = '';
    fileInput.value = '';

    } catch (error) {
        console.error('Error connecting to the server:', error);
        const errorElement = document.createElement('div');
        errorElement.classList.add('message', 'assistant-message');
        errorElement.textContent = 'Could not connect to the FastflowLM server. Please make sure it is running.';
        chatWindow.appendChild(errorElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});
