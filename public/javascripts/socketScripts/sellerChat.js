const socket = io();

socket.emit('joinRoom', 'roomName');

socket.on('client_connected', (data) => {
    console.log(data);
});

function sendMessage(customerId, sellerId) {
    const messageInput = document.querySelector('#message');
    const messageContent = messageInput.value;
    const sender = 'seller' // Getting the sender from the role element
    socket.emit('sendMessage', {
        customerId,  // Pass the customer ID
        sellerId,    // Pass the seller ID
        message: {   // Construct the message object
            sender: sender,
            content: messageContent  // Corrected 'content' typo
        }
    });
    messageInput.value = ''; // Clear input after sending
    const chatMessages = document.querySelector('#chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

socket.on('newMessage', (messageData) => {
    console.log('got the message!!');
    const { content, sender, timestamp } = messageData;
    console.log(content, sender, timestamp);
    const chatMessages = document.querySelector('#chatMessages');
    const messageElement = document.createElement('p');
    const timestamp1 = new Date(timestamp);

    // Set innerHTML for messageElement
    if (sender == 'seller') {
        messageElement.innerHTML = `<strong>${sender}: &nbsp;&nbsp; </strong> ${content} &nbsp;  ${timestamp1.getHours() % 12 || 12} : ${String(timestamp1.getMinutes()).padStart(2, '0')} &nbsp; <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-check2-all mt-1" viewBox="0 0 16 16">
<path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/>
<path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
</svg>`;
    } else {
        messageElement.innerHTML = `<strong>${sender}: &nbsp;&nbsp; </strong> ${content} &nbsp;  ${timestamp1.getHours() % 12 || 12} : ${String(timestamp1.getMinutes()).padStart(2, '0')} &nbsp; `;
    }

    // Apply styles based on sender
    if (sender == 'seller') {
        messageElement.classList.add('seller');
    } else {
        messageElement.classList.add('customer');
    }

    // Append messageElement to chatMessages
    chatMessages.appendChild(messageElement);

    // Scroll to the bottom of the chat container
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


const chatMessages = document.querySelector('#chatMessages');
chatMessages.scrollTop = chatMessages.scrollHeight;