const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filtered_users = users.filter((user) => user.username === username);
    return filtered_users.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
    // Generate JWT access token
        let accessToken = jwt.sign({
               data: password
            }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const ISBN = req.params.isbn;
    const book = books[ISBN];
    if(book) {
        const username = req.session.authorization?.username;
        const review = req.query.review;

        const isNewReview = !book.reviews[username];
        book.reviews[username] = review;

        if (isNewReview) {
            return res.send("Review added successfully.");
        } else {
            return res.send("Review updated successfully.");
        }
    } else {
        return res.status(404).send("Unable to find book.");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.session.authorization?.username;

    const book = books[ISBN];
    if(book) {
        if(book.reviews[username]) {
            delete book.reviews[username];
            return res.send("Review deleted successfully.");
        } else {
            return res.status(400).send("Review not found for this user.");
        }
    } else {
        res.status(400).send("Book not found.");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
