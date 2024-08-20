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

const rootContainer = document.querySelector(".root-container");

function loadData(data) {
  rootContainer.innerHTML = "";

  data.forEach((book) => {
    createCard(book);
  });
}

function createCard(book) {
  const singleContainer = document.createElement("div");
  singleContainer.classList.add("single-card");
  singleContainer.id = book.book_id;

  let singleData = `
    <p>Book Title: <span>${book.title}</span></p>
    <p>Author Name: <span>${book.author}</span></p>
    <p>Book Genre: <span>${book.genre}</span></p>
    <p>Publication Year: <span>${book.publication_year}</span></p>`;

  singleData += `
    <div class="buttons">
      <button class="delete-btn" onclick="deleteUser(this)">Delete</button>
    </div>`;
  singleContainer.innerHTML = singleData;
  rootContainer.appendChild(singleContainer);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
});

function deleteUser(btn) {
  const token = getCookie("token");
  const deleteUserId = btn.closest(".single-card").id;
  fetch(`http://localhost:8080/api/books/${deleteUserId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      fetchBooks();
    })
    .catch((error) => console.error("Error deleting book:", error));
}

function fetchBooks() {
  const token = getCookie("token");
  fetch("http://localhost:8080/api/personal-books", {
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
