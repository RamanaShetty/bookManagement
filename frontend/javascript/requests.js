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

const status_colors = {
  pending: "#FFA000",
  approved: "#28A745",
  denied: "#DC3545",
};

const requestContainer = document.querySelector(".request-container");

function loadData(data) {
  requestContainer.innerHTML = "";
  data.forEach((request) => {
    createCard(request);
  });
}

function createCard(request) {
  const singleContainer = document.createElement("div");
  singleContainer.classList.add("request-card");
  singleContainer.id = request.id;

  const status = status_colors[request.status];

  let singleData = `
    <p>Book Title: <span>${request.title}</span></p>
    <p>Author Name: <span>${request.author}</span></p>
    <p>Book Genre: <span>${request.genre}</span></p>
    <p>Publication Year: <span>${request.publication_year}</span></p>
    <p style="font-weight: bold;">Request Status: <span style="color: ${status}">${request.status}</span></p>`;

  singleContainer.innerHTML = singleData;
  requestContainer.appendChild(singleContainer);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRequest();
});

function fetchRequest() {
  const token = getCookie("token");
  fetch("http://localhost:8080/api/requests", {
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
