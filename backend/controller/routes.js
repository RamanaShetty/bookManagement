const { Router } = require("express");

const loginRegistrations = require("../services/login_registration");
const booksServices = require("../services/booksService");
const adminServices = require("../services/adminServices");
const verifyToken = require("../middleware/verifyToken");

const router = Router({ strict: true });

router.post("/api/register", loginRegistrations.register);
router.post("/api/login", loginRegistrations.login);
router.get("/api/books", verifyToken, booksServices.getAllBooks);
router.post("/api/books", verifyToken, booksServices.insertABook);
router.get(
  "/api/personal-books",
  verifyToken,
  booksServices.getBooksForPersonal
);
router.delete(
  "/api/books/:id",
  verifyToken,
  booksServices.deleteBookFromPersonal
);
router.get("/api/requests", verifyToken, booksServices.requestAll);
router.post("/api/book-requests/:id", verifyToken, booksServices.requestBook);

router.get("/api/audit-info", verifyToken, adminServices.auditBooks);
router.get("/api/user-books", verifyToken, adminServices.userBooks);
router.get("/api/genre-books", verifyToken, adminServices.genreBooks);
router.get("/api/users", verifyToken, adminServices.userInfo);
router.get("/api/requests-info", verifyToken, adminServices.requestInfo);
router.delete("/api/delete-user/:id", verifyToken, adminServices.deleteUser);
router.put(
  "/api/requests-decline/:id",
  verifyToken,
  adminServices.requestDecline
);
router.put(
  "/api/request-approve/:id",
  verifyToken,
  adminServices.requestApprove
);

module.exports = router;
