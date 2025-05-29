// Get DOM elements
const sendButton = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Your Azure OpenAI endpoint and key (do NOT expose these in frontend for production!)
const AZURE_OPENAI_ENDPOINT ;
const OPENAI_API_KEY ; // ⚠️ For production, never expose API keys in the frontend!

// Send message to Azure OpenAI and display response
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Show user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'user-message');
    userMessageDiv.textContent = userMessage;
    chatBox.appendChild(userMessageDiv);
    userInput.value = '';

    try {
        const response = await fetch(AZURE_OPENAI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': OPENAI_API_KEY
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are Buddy, a friendly multilingual AI tutor for South African high school students." },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const botReply = data.choices[0].message.content.trim();
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('chat-message', 'bot-message');
            botMessageDiv.textContent = 'Buddy AI: ' + botReply;
            chatBox.appendChild(botMessageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            console.error('No choices returned from Azure OpenAI:', data);
            alert('No response received from Buddy AI.');
        }

    } catch (error) {
        console.error('Error communicating with Azure OpenAI:', error);
        alert('An error occurred. Please try again.');
    }
}

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message on Enter key
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
