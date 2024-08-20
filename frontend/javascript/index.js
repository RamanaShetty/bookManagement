function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
}

function showRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const data = {
    username: username,
    password: password,
  };

  fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        console.log(data.token);
        setCookie("token", data.token, 7);
      }
      if (data.role === "admin") {
        window.location.href = "/frontend/adminPages/admin.html";
      } else {
        window.location.href = "/frontend/userPages/bookshelf.html";
      }
    });
}

function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById(
    "register-confirm-password"
  ).value;
  const isAdmin = document.getElementById("is-admin").checked;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const data = {
    username: username,
    password: password,
    role: isAdmin === true ? "admin" : "user",
  };

  fetch("http://localhost:8080/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        setCookie("token", data.token, 7);
      }
      if (data.role === "admin") {
        window.location.href = "/frontend/adminPages/admin.html";
      } else {
        window.location.href = "/frontend/userPages/bookshelf.html";
      }
    });
}
