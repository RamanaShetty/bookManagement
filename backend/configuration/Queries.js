exports.find_user_by_username = "select * from users where username=?";

exports.add_user_query =
  "INSERT INTO users(username,password,role) VALUES (?,?,?);";

exports.get_all_books_query = `SELECT 
    Books.*,
    CASE WHEN PersonalBookshelf.book_id IS NOT NULL THEN 'Yes' ELSE 'No'
    END AS in_personal_bookshelf FROM  Books
    LEFT JOIN PersonalBookshelf ON Books.id = PersonalBookshelf.book_id  AND PersonalBookshelf.user_id = ?;`;

exports.get_books_to_personal_query = `SELECT 
  Books.id AS book_id, 
  Books.title, 
  Books.author, 
  Books.genre, 
  Books.publication_year,
  Users.username AS added_by_username, 
  PersonalBookshelf.added_date 
  FROM PersonalBookshelf 
  JOIN Books ON PersonalBookshelf.book_id = Books.id 
  JOIN Users ON PersonalBookshelf.added_by = Users.id 
  WHERE PersonalBookshelf.user_id = ?`;

exports.delete_book_from_personal_query = `DELETE FROM PersonalBookshelf WHERE book_id = ?;`;

exports.insert_a_book_query =
  "INSERT INTO Books (title, author, genre, publication_year, added_by) VALUES (?, ?, ?, ?, ?);";

exports.request_insert_query =
  "INSERT INTO BookRequests (user_id, book_id) VALUES (?, ?)";

exports.request_all_query = `SELECT 
    br.id AS request_id,
    b.title,
    b.author,
    b.genre,
    b.publication_year,
    br.status FROM BookRequests br
    JOIN Books b ON br.book_id = b.id WHERE  br.user_id = ? ORDER BY 
    CASE 
        WHEN br.status = 'pending' THEN 1
        WHEN br.status = 'approved' THEN 2
        WHEN br.status = 'denied' THEN 3
    END;`;

exports.audit_books_query = `SELECT 
    b.id, 
    b.title AS book_title, 
    b.author, 
    b.genre, 
    b.publication_year, 
    u.username AS added_by
    FROM books b JOIN users u ON b.added_by = u.id ORDER BY b.id;`;

exports.user_books_query = `SELECT 
    u.id AS user_id,
    u.username,
    COUNT(b.id) AS book_count
    FROM Users u
    LEFT JOIN Books b ON u.id = b.added_by
    WHERE u.role = 'user'
    GROUP BY u.id, u.username
    ORDER BY u.id;`;

exports.genre_books_query = `SELECT 
    @row_number := @row_number + 1 AS id,
    b.genre AS genre,
    COUNT(b.id) AS book_count
    FROM books b
    JOIN (SELECT @row_number := 0) AS rn
    GROUP BY b.genre
    ORDER BY id;`;

exports.user_info_query = "SELECT id,username FROM Users where role='user';";

exports.request_info_query = `SELECT 
    br.id AS id,
    b.title AS book_title,
    u.username AS requested_by,
    br.status
    FROM BookRequests br
    JOIN Books b ON br.book_id = b.id
    JOIN Users u ON br.user_id = u.id
    WHERE br.status = 'pending';`;

exports.request_approve_query =
  "UPDATE BookRequests SET status = 'approved' WHERE id = ? AND status = 'pending';";

exports.insert_into_personal = `INSERT INTO PersonalBookshelf (user_id, book_id, added_by) SELECT ?, ?, b.added_by
FROM Books b WHERE b.id = ?;`;

exports.request_decline_query =
  "UPDATE BookRequests SET status = 'denied' WHERE id = ? AND status = 'pending';";

exports.user_delete_query = "DELETE FROM Users WHERE id = ?;" ;