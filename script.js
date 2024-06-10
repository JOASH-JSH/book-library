const myLibrary = [];

// constructor function to create book object
function Book(title, author, pages, read) {
    this.title = title; // string
    this.author = author; // string
    this.pages = pages; // string
    this.read = read; // boolean
}

function addBookToLibrary(currBook) {
    myLibrary.push(currBook);
}

function displayBook(currBook) {
    const booksArea = document.querySelector(".books-area");
}
