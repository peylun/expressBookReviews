const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user name is valid (not registered)
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered."});
        } else {
            return res.status(400).json({message: "User already exists!"});
        }
    } else {
        // Return error if username or password is missing
        return res.status(404).json({message: "Unable to register user."});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const bookList = Object.values(books);
    return res.send(JSON.stringify(bookList, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const foundBook = books[req.params.isbn];
    if (foundBook) {
        return res.send(JSON.stringify(foundBook, null, 4))
    } else {
        return res.send(null);
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Searching with insensitive casing using includes as it seems more logical for a search
    // Task has not been explicit on this
    const authorLowerCase = req.params.author.toLowerCase();
    const foundBooks = Object.values(books).filter(({author}) => author.toLowerCase().includes(authorLowerCase));
    if (foundBooks) {
        return res.send(JSON.stringify(foundBooks, null, 4))
    } else {
        return res.send(null);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Searching with insensitive casing using includes as it seems more logical for a search
    // Task has not been explicit on this
    const titleLowerCase = req.params.title.toLowerCase();
    const foundBooks = Object.values(books).filter(({title}) => title.toLowerCase().includes(titleLowerCase));
    if (foundBooks) {
        return res.send(JSON.stringify(foundBooks, null, 4))
    } else {
        return res.send(null);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const foundBook = books[req.params.isbn];
    if (foundBook) {
        // Should omit returning username; skipping here as this is mainly for illustration
        return res.send(JSON.stringify(foundBook.reviews, null, 4))
    } else {
        return res.send(null);
    }
});

module.exports.general = public_users;
