const socket = io();

// Elements
const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const chatContainer = document.getElementById("chat-container");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const chatForm = document.getElementById("chat-form");

const loginUsernameInput = document.getElementById("login-username-input");
const loginPasswordInput = document.getElementById("login-password-input");
const signupUsernameInput = document.getElementById("signup-username-input");
const signupPasswordInput = document.getElementById("signup-password-input");

const messageInput = document.getElementById("message-input");
const chatMessages = document.getElementById("chat-messages");
const typingIndicator = document.getElementById("typing-indicator");
const userList = document.getElementById("user-list");

// Show signup form
document
  .getElementById("show-signup")
  .addEventListener("click", showSignupForm);

// Show login form
document.getElementById("show-login").addEventListener("click", showLoginForm);

// Handle login
loginForm.addEventListener("submit", handleLogin);

// Handle signup
signupForm.addEventListener("submit", handleSignup);

// Submit message
chatForm.addEventListener("submit", submitMessage);

// Typing indicator
messageInput.addEventListener("input", () => {
  socket.emit("typing");
});

// Socket event listeners
socket.on("chat message", createMessage);
socket.on("typing", displayTypingIndicator);
socket.on("user connected", handleUserConnected);
socket.on("user disconnected", handleUserDisconnected);
socket.on("user list", populateUserList);
socket.on("connect_error", handleError);
socket.on("connect_timeout", handleTimeout);
socket.on("error", handleError);

// Functions

function showSignupForm() {
  loginContainer.classList.add("hidden");
  signupContainer.classList.remove("hidden");
}

function showLoginForm() {
  signupContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
}

function handleLogin(e) {
  e.preventDefault();
  const username = loginUsernameInput.value;
  const password = loginPasswordInput.value;

  fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      const authToken = data.token;
      if (authToken) {
        loginContainer.classList.add("hidden");
        chatContainer.classList.remove("hidden");
        socket.emit("join", username);
        fetchChatHistory(authToken);
      } else {
        alert("Error getting chat history");
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    });
}

function handleSignup(e) {
  e.preventDefault();
  const username = signupUsernameInput.value;
  const password = signupPasswordInput.value;

  fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        signupContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
      } else {
        alert("Error creating user");
      }
    })
    .catch((error) => {
      console.error("Error during signup:", error);
      alert("An error occurred during signup. Please try again.");
    });
}

function submitMessage(e) {
  e.preventDefault();
  const message = messageInput.value;
  socket.emit("chat message", message);
  messageInput.value = "";
}

function fetchChatHistory(authToken) {
  fetch("/api/chat/history", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.reverse().forEach((entry) => {
        const { username, message } = entry;
        const concatedMessage = `${username}: ${message}`;
        createMessage(concatedMessage);
      });
    })
    .catch((error) => {
      console.error("Error getting messages:", error);
      alert("An error occurred while getting messages.");
    });
}

function createMessage(msg) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.textContent = msg;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayTypingIndicator(username) {
  typingIndicator.textContent = `${username} is typing...`;
  setTimeout(() => {
    typingIndicator.textContent = "";
  }, 3000);
}

function handleUserConnected(username) {
  createNotification(`${username} connected`, "user-connected");
  addUserToList(username);
}

function handleUserDisconnected(username) {
  createNotification(`${username} disconnected`, "user-disconnected");
  removeUserFromList(username);
}

function createNotification(message, className) {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add(className);
  notificationElement.textContent = message;
  chatMessages.appendChild(notificationElement);
}

function addUserToList(username) {
  const userElement = document.createElement("li");
  userElement.textContent = username;
  userElement.id = `user-${username}`;
  userList.appendChild(userElement);
}

function removeUserFromList(username) {
  const userElement = document.getElementById(`user-${username}`);
  if (userElement) {
    userList.removeChild(userElement);
  }
}

function populateUserList(users) {
  userList.innerHTML = "";
  users.forEach((username) => {
    addUserToList(username);
  });
}

function handleError(error) {
  console.error("Socket error:", error);
  alert("An error occurred with the chat server. Please try again later.");
}

function handleTimeout(timeout) {
  console.error("Connection timeout:", timeout);
  alert("Connection to the chat server timed out. Please try again later.");
}
