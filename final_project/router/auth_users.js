const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    const foundUser = users.find((user) => user.username === username);

    return !foundUser;
}

const authenticatedUser = (username,password)=>{
    const foundUser = users.find((user) => user.username === username && user.password === password);

    return Boolean(foundUser);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            username,
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!req.query.review) {
        return res.status(400).json({ message: "Invalid request." });
    }

    const foundBook = books[req.params.isbn];
    if (foundBook) {
        foundBook.reviews[req.user.username] = req.query.review;
        return res.status(200).send("Added book review.");
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const foundBook = books[req.params.isbn];
    if (foundBook) {
        delete foundBook.reviews[req.user.username];
        return res.status(200).send("Deleted book review.");
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
