const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let found=undefined
 found=users.find(item=>item.username===username)

  if(found===undefined)
  {
    return true;
  }
  return false;
}


const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username && user.password === password);
  if(user===undefined)
  {
    return false;
  }
  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; 
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}
  if (authenticatedUser(username, password)) {
    // Generate a JWT token
    const token = jwt.sign({data:password}, 'accessToken', { expiresIn: 60*60 });

    req.session.authorization = {
      token,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  };
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session;
  const reviewText = req.body.review;

  if (books[isbn]) {
    
    if (books[isbn].reviews[username]) {
      // Modify the existing review
      books[isbn].reviews[username] = reviewText;
      return res.status(200).json({ message: 'Review modified successfully.' });
    } else {
      // Add a new review for the book
      books[isbn].reviews[username] = reviewText;
      return res.status(201).json({ message: 'Review added successfully.' });
    }
  } else {
    return res.status(404).json({ message: 'Book not found.' });
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session;
  
    if (books[isbn]) {
      const book = books[isbn];
      
      // Check if the book has reviews
      if (!book.reviews) {
        return res.status(404).json({ message: 'No reviews found for this book.' });
      }
      
      if (book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({ message: 'Review deleted successfully.' });
      } else {
        return res.status(404).json({ message: 'You have not reviewed this book.' });
      }
    } else {
      return res.status(404).json({ message: 'Book not found.' });
    }
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
