const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(!req.body.username || !req.body.password)
  return res.status(400).json({message: "Please provide both username and password"});
  
  if(isValid(req.body.username))
  {
    users.push({username:req.body.username,password:req.body.password})
    return res.status(300).json({message: "User added succesfully"});
  }

  return res.status(400).json({message: "User already exists"});
    
});

// Get the book list available in the shop using async await

public_users.get('/', async function (req, res) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    const bookList = JSON.stringify(books);
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.status(300).json(JSON.stringify(books));
// });


// Get book details by ISBN by async await
public_users.get('/isbn/:isbn', async function (req, res) {
  const requestedISBN = req.params.isbn;

  if (books.hasOwnProperty(requestedISBN)) {
    const book = books[requestedISBN];
    
    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const requestedISBN = req.params.isbn;
  
//   if (books.hasOwnProperty(requestedISBN)) {
//       const book = books[requestedISBN];
//       return res.status(300).json(book);
//   } else {
//       return res.status(404).json({ message: "Book not found" });
//   }
// });
  

// Get books by author using async await
public_users.get('/author/:author', async function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    let booksByAuthor = null;

    for (const isbn in books) {
      const book = books[isbn];
      if (book.author === requestedAuthor) {
        booksByAuthor = book;
        break;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (booksByAuthor) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const requestedAuthor = req.params.author;
  
//   let booksByAuthor = null;
  
//   for (const isbn in books) {
//       const book = books[isbn];
//       if (book.author === requestedAuthor) {
//           booksByAuthor=book
//           break
//       }
//   }
  
//   if (booksByAuthor) {
//       return res.status(300).json(booksByAuthor);
//   } else {
//       return res.status(404).json({ message: "No books found by this author" });
//   }
// });

// Get book by title using async await 
public_users.get('/title/:title', async function (req, res) {
  try {
    const requestedTitle = req.params.title;
    let bookByTitle = null;

    for (const isbn in books) {
      const book = books[isbn];
      if (book.title === requestedTitle) {
        bookByTitle = book;
        break;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    if (bookByTitle) {
      return res.status(200).json(bookByTitle);
    } else {
      return res.status(404).json({ message: "No books found by this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const requestedTitle = req.params.title;
  
//   let bookByTitle =null;
  
//   for (const isbn in books) {
//       const book = books[isbn];
//       if (book.title === requestedTitle) {
//           bookByTitle=book
//           break
//       }
//   }
  
//   if (bookByTitle) {
//       return res.status(300).json(bookByTitle);
//   } else {
//       return res.status(404).json({ message: "No books found by this title" });
//   }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const requestedISBN = req.params.isbn;
  
  if (books.hasOwnProperty(requestedISBN)) {
      const book = books[requestedISBN];
      return res.status(300).json(book.reviews);
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});



module.exports.general = public_users;
