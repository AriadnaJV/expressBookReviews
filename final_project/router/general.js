const express = require('express');
const axios = require('axios');
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

//getting list of books available using async-await with Axios.
async function getBooks(callback) {
  try {
    const response = await axios.get('http://localhost:5000/');
    callback(null, response.data);
  } catch (error) {
    callback(error);
  }
}

//TEST
/*
if (require.main === module) {
  getBooks((err, data) => {
    if (err) {
      console.error("Error:", err.message);
    } else {
      console.log("Books:\n", data);
    }
  });
}
*/

//getting the book details based on ISBN using Promises
const getBookByISBN = (isbn) => {
    const req = axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Fetching book with ISBN ${isbn}...`); 
  
    req.then(resp => {
      console.log("Fulfilled");
      console.log(resp.data);
    }).catch(err => {
      console.log("Rejected");
      console.log(err.message);
    });
};
  
//TEST
/*
if (require.main === module) {
    getBookByISBN(8);
}
*/

//getting books based on author using Promises
const getBookByAuthor = (author) => {
    const req = axios.get(`http://localhost:5000/author/${author}`);
    console.log(`Fetching books by author ${author}...`);

    req.then(resp => {
        console.log("Fulfilled");
        console.log(resp.data);
    }).catch(err => {
        console.log("Rejected");
        console.log(err);
    });
};

// TEST
/*
if (require.main === module) {
    getBookByAuthor("Unknown");
}
*/

const getBookByTitle = (title) => {
    const req = axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Fetching book details by title ${title}...`);

    req.then(resp => {
        console.log("Fulfilled");
        console.log(resp.data);
    }).catch(err => {
        console.log("Rejected");
        console.log(err);
    });
};

//TEST
/*
if (require.main === module) {
    getBookByTitle("Things Fall Apart");
}
*/

module.exports.general = public_users;
