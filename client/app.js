const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");
const socket = io();


let userName = "";
let messageContent='';
socket.on('message',  ({ author, content }) => addMessage(author, content));
socket.on('join' , ({ author }) => {
  addSystemMessage('ChatBot', `${author} has joined the chat`);
})
socket.on('disconnectUser' , ({ author }) => {
  addSystemMessage('ChatBot', `${author} has left the chat`);
})

const login = (e) => {
  e.preventDefault();
  if(!userNameInput.value){
      alert('You need to type in user name before submiting');
      return;
      }else{
      userName = userNameInput.value;
      loginForm.classList.remove('show');
      messagesSection.classList.add('show');
      socket.emit('login', userName);
  }
}

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  author === userName && message.classList.add('message--self')
  
  message.innerHTML = `
      <h3 class="message__author">
          ${author === userName ? 'You' : author}
      </h3>
      <div class="message__content">
          ${content}
      </div>
  `;
  messagesList.appendChild(message);
}

const sendMessage = (e) => {
  e.preventDefault();
  let messageContent = messageContentInput.value;
  if (!messageContent.length) {
    alert("Nic nie napisałeś");
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = "";
  }
};

const addSystemMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--system');
  message.innerHTML = `
      <h3 class="message__author">
          ${author === userName ? 'You' : author}
      </h3>
      <div class="message__content">
          ${content}
      </div>
  `;
  messagesList.appendChild(message);
}

loginForm.addEventListener("submit", login);
addMessageForm.addEventListener("submit", sendMessage);
