// Set up your OpenAI API key here
const OPENAI_API_KEY = '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';

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

    // Send the user input to OpenAI
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4', // Use the correct model name (replace 'gpt-4o-mini' if incorrect)
                messages: [{ role: 'user', content: userMessage }],
                max_tokens: 100,
                temperature: 0.7 // Optional: Adjust the temperature if needed
            })
        });

        const data = await response.json();
        console.log('OpenAI API Response:', data); // Log the API response

        if (data.choices && data.choices.length > 0) {
            const botMessage = data.choices[0].message.content.trim();

            // Display AI response
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('chat-message', 'bot-message');
            botMessageDiv.textContent = 'Buddy AI: ' + botMessage;
            chatBox.appendChild(botMessageDiv);

            // Scroll to the bottom to see the latest message
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            console.error('No response choices available');
            alert('No response received from OpenAI.');
        }
    } catch (error) {
        console.error('Error fetching response:', error);
        alert('Error communicating with OpenAI. Please try again later.');
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
