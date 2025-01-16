// Set up your Azure OpenAI API key and endpoint here
require('dotenv').config();

const OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;


// Get DOM elements
const sendButton = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Function to send message to OpenAI and display the response
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Display user message in the chat
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'user-message');
    userMessageDiv.textContent = userMessage;
    chatBox.appendChild(userMessageDiv);
    userInput.value = ''; // Clear the input field

    // Send the user input to Azure OpenAI
    try {
        const response = await fetch(AZURE_OPENAI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userMessage, // Set the prompt to the user message
                max_tokens: 100,
                temperature: 0.7, // Optional: Adjust the temperature if needed
                stop: ["\n"], // Optional: Adjust the stopping condition
            })
        });

        const data = await response.json();
        console.log('Azure OpenAI Response:', data); // Log the API response

        if (data.choices && data.choices.length > 0) {
            const botMessage = data.choices[0].text.trim();

            // Display AI response
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('chat-message', 'bot-message');
            botMessageDiv.textContent = 'Buddy AI: ' + botMessage;
            chatBox.appendChild(botMessageDiv);

            // Scroll to the bottom to see the latest message
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            console.error('No response choices available');
            alert('No response received from Azure OpenAI.');
        }
    } catch (error) {
        console.error('Error fetching response:', error);
        alert('Error communicating with Azure OpenAI. Please try again later.');
    }
}

// Event listener for send button
sendButton.addEventListener('click', sendMessage);

// Allow pressing Enter to send a message
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
