let currentPageMain = 1;
let currentPageUserBooks = 1;
let currentPageGenreBooks = 1;
const rowsPerPageMain = 4;
const rowsPerPageAdditional = 4;
let auditData = [];
let userBooksData = [];
let genreBooksData = [];

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

function fetchAudit() {
  const token = getCookie("token");
  fetch("http://localhost:8080/api/audit-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((fetchedData) => {
      auditData = fetchedData;
      loadAuditData();
    })
    .catch((error) => console.error("Error fetching audit data:", error));
}

function fetchUserBooks() {
  const token = getCookie("token");
  fetch("http://localhost:8080/api/user-books", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((fetchedData) => {
      userBooksData = fetchedData;
      loadUserBooksData();
    })
    .catch((error) => console.error("Error fetching user books data:", error));
}

function fetchGenreBooks() {
  const token = getCookie("token");
  fetch("http://localhost:8080/api/genre-books", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((fetchedData) => {
      genreBooksData = fetchedData;
      loadGenreBooksData();
    })
    .catch((error) => console.error("Error fetching genre books data:", error));
}

function loadAuditData() {
  const start = (currentPageMain - 1) * rowsPerPageMain;
  const end = start + rowsPerPageMain;
  const paginatedData = auditData.slice(start, end);

  const tableBody = document.querySelector("#audit-table tbody");
  tableBody.innerHTML = "";

  paginatedData.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.book_title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.publication_year}</td>
        <td style="color: #ff5722; font-weight: bold;">${book.added_by}</td>
      `;
    tableBody.appendChild(row);
  });

  updatePagination("main");
}

function loadUserBooksData() {
  const start = (currentPageUserBooks - 1) * rowsPerPageAdditional;
  const end = start + rowsPerPageAdditional;
  const paginatedData = userBooksData.slice(start, end);

  const tableBody = document.querySelector("#user-books-table tbody");
  tableBody.innerHTML = "";

  paginatedData.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${record.user_id}</td>
        <td>${record.username}</td>
        <td>${record.book_count}</td>
      `;
    tableBody.appendChild(row);
  });

  updatePagination("userBooks");
}

function loadGenreBooksData() {
  const start = (currentPageGenreBooks - 1) * rowsPerPageAdditional;
  const end = start + rowsPerPageAdditional;
  const paginatedData = genreBooksData.slice(start, end);

  const tableBody = document.querySelector("#genre-books-table tbody");
  tableBody.innerHTML = "";

  paginatedData.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${record.id}</td>
        <td>${record.genre}</td>
        <td>${record.book_count}</td>
      `;
    tableBody.appendChild(row);
  });

  updatePagination("genreBooks");
}

function updatePagination(type) {
  let currentPage, totalRows, rowsPerPage;

  switch (type) {
    case "main":
      currentPage = currentPageMain;
      totalRows = auditData.length;
      rowsPerPage = rowsPerPageMain;
      break;
    case "userBooks":
      currentPage = currentPageUserBooks;
      totalRows = userBooksData.length;
      rowsPerPage = rowsPerPageAdditional;
      break;
    case "genreBooks":
      currentPage = currentPageGenreBooks;
      totalRows = genreBooksData.length;
      rowsPerPage = rowsPerPageAdditional;
      break;
  }

  document.getElementById(
    `${type}-page-info`
  ).textContent = `Page ${currentPage} of ${Math.ceil(
    totalRows / rowsPerPage
  )}`;

  document.getElementById(`${type}-prev`).disabled = currentPage === 1;
  document.getElementById(`${type}-next`).disabled =
    currentPage === Math.ceil(totalRows / rowsPerPage);
}

function nextPage(type) {
  switch (type) {
    case "main":
      if (currentPageMain * rowsPerPageMain < auditData.length) {
        currentPageMain++;
        loadAuditData();
      }
      break;
    case "userBooks":
      if (currentPageUserBooks * rowsPerPageAdditional < userBooksData.length) {
        currentPageUserBooks++;
        loadUserBooksData();
      }
      break;
    case "genreBooks":
      if (
        currentPageGenreBooks * rowsPerPageAdditional <
        genreBooksData.length
      ) {
        currentPageGenreBooks++;
        loadGenreBooksData();
      }
      break;
  }
}

function prevPage(type) {
  switch (type) {
    case "main":
      if (currentPageMain > 1) {
        currentPageMain--;
        loadAuditData();
      }
      break;
    case "userBooks":
      if (currentPageUserBooks > 1) {
        currentPageUserBooks--;
        loadUserBooksData();
      }
      break;
    case "genreBooks":
      if (currentPageGenreBooks > 1) {
        currentPageGenreBooks--;
        loadGenreBooksData();
      }
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAudit();
  fetchUserBooks();
  fetchGenreBooks();
});
