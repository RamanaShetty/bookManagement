**Book CRUD ASSIGNMENT**

_Installation_
Follow these steps to set up the project on your local machine:

_bash_
npm install - this installs all the necessary dependencies.

_Set up your environment variables:_
Create a .env file in the root of the project with the following contents:

_PORT: The port number the server will listen on._
_MYSQL_HOST: The hostname of your MySQL database._
_MYSQL_USER: The username for accessing your MySQL database._
_MYSQL_PASSWORD: The password for your MySQL user._
_MYSQL_DATABASE: The name of the MySQL database to connect to._

_Start the server_
node server.js
The server will start running at http://localhost:8080.

_Usage_
To use the frontend, please hit the URL "http://localhost:8080/"
To use this API, you can interact with it using tools like Postman or curl.

_Database Schema_
The books table in the MySQL database should be created as follows:
sql:
There are total of 4 tables:

-- Create Users table
CREATE TABLE Users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role ENUM('admin', 'user') NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Books table
CREATE TABLE Books (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
author VARCHAR(255) NOT NULL,
genre VARCHAR(100),
publication_year INT,
added_by INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (added_by) REFERENCES Users(id) ON DELETE SET NULL
);

-- Create BookRequests table
CREATE TABLE BookRequests (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
book_id INT,
status ENUM('pending', 'approved', 'denied') DEFAULT 'pending',
date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE
);

-- Create PersonalBookshelf table
CREATE TABLE PersonalBookshelf (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
book_id INT,
added_by INT,
added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE,
FOREIGN KEY (added_by) REFERENCES Users(id) ON DELETE CASCADE,
UNIQUE (user_id, book_id)
);

**Sample Data**
For users & admins:
Use Registration.

For books:
Use Inventory of the user UI to add books.

For Bookshelf:
Use request button in inventory of User UI to request for books.
