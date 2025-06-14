const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if(username && password && isValid(username)) {
        users.push({username, password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    return res.status(404).json({message: "User already exists or data missing."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const ISBN = req.params.isbn;
    res.send(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    const filtered_books = Object.entries(books)
        .filter(([id, book]) => book.author === author)
        .map(([id, book]) => ({ id, ...book }));

    if (filtered_books.length === 0) {
        return res.status(404).send({ error: "No books found for this author" });
    }
    res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    const filtered_books = Object.entries(books)
        .filter(([id,book]) => book.title === title) 
        .map(([id, book]) => ({id, ...book}));
    
    if (filtered_books.length === 0) {
        return res.status(404).send({ error: "No books found with this title" });
    }
    
    res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const ISBN = req.params.isbn;
    if(ISBN) {
        res.send(books[ISBN].reviews);
    } else {
        res.status(404).send({ error: "Book not found" });
    }
});

module.exports.general = public_users;
