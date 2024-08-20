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

function validateForm(form) {
  const bookTitle = form["title"].value;
  const bookAuthor = form["author"].value;
  const bookGenre = form["genre"].value;
  const publicationYear = form["publication_year"].value;

  if (!bookTitle) {
    alert("Title is required.");
    return false;
  }
  if (!bookAuthor) {
    alert("Author is required.");
    return false;
  }
  if (!bookGenre) {
    alert("Genre is required.");
    return false;
  }
  if (!publicationYear) {
    alert("Publication Year is required.");
    return false;
  }

  return true;
}

const rootContainer = document.querySelector(".root-container");
const addNewBtn = document.querySelector(".addNew");
const addDiv = document.querySelector(".add-container");
const mainHead = document.querySelector(".main-head");
const addBtn = document.getElementById("add-btn");

function loadData(data) {
  rootContainer.innerHTML = "";
  data.forEach((book) => {
    createCard(book);
  });
}

function createCard(book) {
  const singleContainer = document.createElement("div");
  singleContainer.classList.add("single-card");
  singleContainer.id = book.id;

  let singleData = `
    <p>Book Title: <span>${book.title}</span></p>
    <p>Author Name: <span>${book.author}</span></p>
    <p>Book Genre: <span>${book.genre}</span></p>
    <p>Publication Year: <span>${book.publication_year}</span></p>`;

  if (book.in_personal_bookshelf === "No") {
    singleData += `<div class="buttons">
      <button class="request-btn" onclick="requestBook(this)">Request</button>
    </div>`;
  }
  singleContainer.innerHTML = singleData;
  rootContainer.appendChild(singleContainer);
}

function requestBook(btn) {
  const token = getCookie("token");
  const requestBookId = btn.closest(".single-card").id;

  fetch(`http://localhost:8080/api/book-requests/${requestBookId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create book request");
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
      alert("Book request sent successfully!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to send book request.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
});

function fetchBooks() {
  const token = getCookie("token");
  fetch("http://localhost:8080/api/books", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => loadData(data))
    .catch((error) => console.error("Error fetching books:", error));
}

addNewBtn.onclick = (event) => {
  event.preventDefault();

  addDiv.classList.remove("active");
  mainHead.classList.add("active");
  rootContainer.classList.add("active");
};

addBtn.onclick = (event) => {
  event.preventDefault();

  const form = document.forms["myform"];
  const token = getCookie("token");

  if (!validateForm(form)) {
    return;
  }

  const bookData = {
    title: form["title"].value,
    author: form["author"].value,
    genre: form["genre"].value,
    publication_year: form["publication_year"].value,
  };

  fetch("http://localhost:8080/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(bookData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    })
    .catch((error) => console.error("Error adding book:", error));
};
