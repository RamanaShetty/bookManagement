let currentPageUsers = 1;
let currentPageRequests = 1;
const rowsPerPage = 10;
let usersData = [];
let requestsData = [];

function fetchData() {
  const token = getCookie("token");
  fetch("http://localhost:8080/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((fetchedData) => {
      usersData = fetchedData;
      loadUsersData();
    })
    .catch((error) => console.error("Error fetching users:", error));

  fetch("http://localhost:8080/api/requests-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((fetchedData) => {
      requestsData = fetchedData;
      loadRequestsData();
    })
    .catch((error) => console.error("Error fetching requests:", error));
}

function loadUsersData() {
  const start = (currentPageUsers - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = usersData.slice(start, end);

  const tableBody = document.querySelector("#users-table tbody");
  tableBody.innerHTML = "";

  paginatedData.forEach((user) => {
    renderUserTable(user);
  });

  document.getElementById(
    "users-page-info"
  ).textContent = `Page ${currentPageUsers} of ${Math.ceil(
    usersData.length / rowsPerPage
  )}`;

  document.getElementById("prev-users").disabled = currentPageUsers === 1;
  document.getElementById("next-users").disabled =
    currentPageUsers === Math.ceil(usersData.length / rowsPerPage);
}

function renderUserTable(user) {
  const tableBody = document.querySelector("#users-table tbody");
  const row = document.createElement("tr");
  row.id = user.id;

  row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td class="action-buttons">
      <button class="delete" onclick="deleteUser(this)">Delete</button>
    </td>`;

  tableBody.appendChild(row);
}

function loadRequestsData() {
  const start = (currentPageRequests - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = requestsData.slice(start, end);

  const tableBody = document.querySelector("#requests-table tbody");
  tableBody.innerHTML = "";

  if (requestsData.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='5'>No requests</td></tr>";
  } else {
    paginatedData.forEach((request) => {
      renderRequestTable(request);
    });

    document.getElementById(
      "requests-page-info"
    ).textContent = `Page ${currentPageRequests} of ${Math.ceil(
      requestsData.length / rowsPerPage
    )}`;

    document.getElementById("prev-requests").disabled =
      currentPageRequests === 1;
    document.getElementById("next-requests").disabled =
      currentPageRequests === Math.ceil(requestsData.length / rowsPerPage);
  }
}

function renderRequestTable(request) {
  const tableBody = document.querySelector("#requests-table tbody");
  const row = document.createElement("tr");
  row.id = request.id;

  row.innerHTML = `
    <td>${request.id}</td>
    <td>${request.book_title}</td>
    <td>${request.requested_by}</td>
    <td>${request.status}</td>
    <td class="action-buttons">
      <button class="accept" onclick="acceptRequest(this)">Accept</button>
      <button class="decline" onclick="declineRequest(this)">Decline</button>
    </td>`;

  tableBody.appendChild(row);
}

function nextPage(type) {
  if (type === "users" && currentPageUsers * rowsPerPage < usersData.length) {
    currentPageUsers++;
    loadUsersData();
  } else if (
    type === "requests" &&
    currentPageRequests * rowsPerPage < requestsData.length
  ) {
    currentPageRequests++;
    loadRequestsData();
  }
}

function prevPage(type) {
  if (type === "users" && currentPageUsers > 1) {
    currentPageUsers--;
    loadUsersData();
  } else if (type === "requests" && currentPageRequests > 1) {
    currentPageRequests--;
    loadRequestsData();
  }
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

function deleteCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999; path=/;";
}

function handleLogout() {
  deleteCookie("token");
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

function deleteUser(btn) {
  const deleteUser = btn.closest("tr").id;
  console.log(deleteUser);
  const token = getCookie("token");
  fetch(`http://localhost:8080/api/delete-user/${deleteUser}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update the request status");
      }
      location.reload();
    })
    .catch((error) => console.error("Error updating request status:", error));
}

function acceptRequest(btn) {
  const requestId = btn.closest("tr").id;
  const token = getCookie("token");
  fetch(`http://localhost:8080/api/request-approve/${requestId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update the request status");
      }
      location.reload();
    })
    .catch((error) => console.error("Error updating request status:", error));
}

function declineRequest(btn) {
  const declineRequest = btn.closest("tr").id;
  const token = getCookie("token");
  fetch(`http://localhost:8080/api/requests-decline/${declineRequest}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update the request status");
      }
      location.reload();
    })
    .catch((error) => console.error("Error updating request status:", error));
}
