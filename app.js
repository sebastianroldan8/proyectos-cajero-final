// Simulación de usuarios
let users = JSON.parse(localStorage.getItem("users")) || [
  { username: "juan", password: "1234", name: "Juan", id: "111", accountType: "ahorros", balance: 1000, transactions: [] },
  { username: "ana", password: "abcd", name: "Ana", id: "222", accountType: "corriente", balance: 1500, transactions: [] }
];
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}


let attempts = 3;
let currentUser = null;


document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const userInput = document.getElementById("username").value.trim();
  const passInput = document.getElementById("password").value.trim();
  const message = document.getElementById("loginMessage");

  const user = users.find(u => u.username === userInput && u.password === passInput);

  if (user) {
    message.style.color = "green";
    message.textContent = "Inicio de sesión exitoso.";
    
    setTimeout(() => {
        loginContainer.style.display = "none";
        document.querySelector(".menu-container").style.display = "block";
        document.getElementById("welcomeMessage").textContent = 
        `Bienvenido, ${user.username}`;
        currentUser = user;      
    }, 500);
  } else {
    attempts--;
    message.style.color = "red";
    if (attempts > 0) {
      message.textContent = `Datos incorrectos. Intentos restantes: ${attempts}`;
    } else {
      message.textContent = "Has agotado los intentos. Intenta más tarde.";
      document.getElementById("username").disabled = true;
      document.getElementById("password").disabled = true;
      e.target.querySelector("button").disabled = true;
    }
  }
});

document.getElementById("registerLink").addEventListener("click", function (e) {
  e.preventDefault();
  alert("Aquí iría la pantalla de registro de nuevos usuarios.");
});
const registerLink = document.getElementById("registerLink");
const backToLogin = document.getElementById("backToLogin");
const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");

registerLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginContainer.style.display = "none";
  registerContainer.style.display = "block";
});

backToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerContainer.style.display = "none";
  loginContainer.style.display = "block";
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const id = document.getElementById("regId").value.trim();
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const accountType = document.getElementById("regAccountType").value;

  const message = document.getElementById("registerMessage");

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    message.style.color = "red";
    message.textContent = "El nombre de usuario ya está en uso.";
    return;
  }

  const newUser = {
    username,
    password,
    name,
    id,
    accountType,
    balance: 0,
    transactions: []
  };

  users.push(newUser);
  saveUsers();
  message.style.color = "green";
  message.textContent = "Usuario registrado correctamente.";

  setTimeout(() => {
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  }, 1500);
});

function showBalance() {
  document.getElementById("menuOutput").textContent =
    `Saldo actual: $${currentUser.balance.toFixed(2)}`;
}

function showDeposit() {
  const amount = parseFloat(prompt("Ingrese el monto a consignar:"));
  if (!isNaN(amount) && amount > 0) {
    currentUser.balance += amount;
    currentUser.transactions.push({
      tipo: "Consignación",
      monto: amount,
      fecha: new Date().toLocaleString()
    });
    saveUsers();
    showBalance();
  } else {
    alert("Monto inválido.");
  }
}

function showWithdraw() {
  const amount = parseFloat(prompt("Ingrese el monto a retirar:"));
  if (!isNaN(amount) && amount > 0 && amount <= currentUser.balance) {
    currentUser.balance -= amount;
    currentUser.transactions.push({
      tipo: "Retiro",
      monto: amount,
      fecha: new Date().toLocaleString()
    });
    saveUsers();
    showBalance();
  } else {
    alert("Fondos insuficientes o monto inválido.");
  }
}

function showTransfer() {
  const recipientUsername = prompt("Ingrese el usuario destino:");
  const recipient = users.find(u => u.username === recipientUsername);
  if (!recipient || recipient.username === currentUser.username) {
    alert("Usuario no válido.");
    return;
  }
  const amount = parseFloat(prompt("Ingrese el monto a transferir:"));
  if (!isNaN(amount) && amount > 0 && amount <= currentUser.balance) {
    currentUser.balance -= amount;
    recipient.balance += amount;
    const now = new Date().toLocaleString();

    currentUser.transactions.push({
      tipo: `Transferencia a ${recipient.username}`,
      monto: amount,
      fecha: now
    });

    recipient.transactions.push({
      tipo: `Transferencia de ${currentUser.username}`,
      monto: amount,
      fecha: now
    });
    saveUsers();
    showBalance();
  } else {
    alert("Fondos insuficientes o monto inválido.");
  }
}

function showMovements() {
  const output = currentUser.transactions
    .map(t => `${t.fecha} - ${t.tipo}: $${t.monto}`)
    .join("\n");

  document.getElementById("menuOutput").textContent = output || "No hay movimientos.";
}

function logout() {
  currentUser = null;
  document.querySelector(".menu-container").style.display = "none";
  loginContainer.style.display = "block";
  document.getElementById("loginMessage").textContent = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

