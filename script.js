"use strict";

// Define the Form class to handle form-related operations
class Form {
    static #formInputFields = ["title", "author", "publisher", "year", "status"];
    #form = undefined;
    #formId = undefined;

    constructor(form) {
        this.#form = form;
        this.#formId = form.id;
    }

    getFormData() {
        return new FormData(this.#form);
    }

    populateFormInputField(book) {
        Form.#formInputFields.forEach((field) => {
            this.#form.querySelector(`#${this.#formId}-book-${field}`)
                .value = book[field];
        });
    }

    clearFormInputField() {
        Form.#formInputFields.forEach((field) => {
            this.#form.querySelector(`#${this.#formId}-book-${field}`)
                .value = ""; 
        });
    }

    addFormSubmitEventListener(eventHandler) {
        this.#form.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = this.getFormData(); 
            const { title, author, publisher, year, status } = Object.fromEntries(formData); 
            const newBook = new Book(title, author, publisher, year, status);

            eventHandler(newBook);
        });
    }
}

// Define the Book class to represent a book
class Book {
    constructor(title, author, publisher, year, status) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.year = year;
        this.status = status;
    }

    get title() {
        return this._title;
    }

    set title(newTitle) {
        this._title = newTitle.trim();
    }

    get author() {
        return this._author;
    }

    set author(newAuthor) {
        this._author = newAuthor.trim();
    }

    get publisher() {
        return this._publisher;
    }

    set publisher(newPublisher) {
        this._publisher = newPublisher.trim();
    }

    get year() {
        return this._year;
    }

    set year(newYear) {
        this._year = parseInt(newYear);
    }

    get status() {
        return this._status;
    }

    set status(newStatus) {
        this._status = parseInt(newStatus);
    }
}

// Define the Library class to manage a collection of books
class Library {
    #bookList = [];
    #replaceBookSerial = -1;

    constructor() {}

    addBook(newBook) {
        this.#bookList.push(newBook);
    }

    removeBook(serial) {
        this.#bookList.splice(serial, 1);
    } 

    getBook(serial) {
        return this.#bookList[serial];
    }

    setReplaceBookIndex(serial) {
        this.#replaceBookSerial = serial;
    }

    replaceBook(newBook) {
        this.#bookList[this.#replaceBookSerial] = newBook;
        this.#replaceBookSerial = -1;
    }

    getAllBooks() {
        return [...this.#bookList];
    }

    getTotalBookCount() {
        return this.#bookList.length;
    }
}

// Define the Card class to handle the creation of book cards
class Card {
    static #CARD_HEADER_COLORS = ["#1877f2", "#ff4500", "#008000"];

    static create(book, serial) {
        const cardEl = document.createElement("div");

        cardEl.setAttribute("class", "card");

        const headerColor = Card.#CARD_HEADER_COLORS[book.status];

        // card content
        cardEl.innerHTML = `
            <div class="card-header" style="background-color: ${headerColor}">
                <p class="card-heading-text">Book</p>
                <button class="card-remove-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="card-main">
                <div class="card-field">
                    <p class="card-label">title : </p>
                    <p class="card-book-info">${book.title}</p>
                </div>
                <div class="card-field">
                    <p class="card-label">author : </p>
                    <p class="card-book-info">${book.author}</p>
                </div>
                <div class="card-field">
                    <p class="card-label">publisher : </p>
                    <p class="card-book-info">${book.publisher}</p>
                </div>
                <div class="card-field">
                    <span class="card-label">year : </span>
                    <span class="card-book-info">${book.year}</span>
                </div>
                <div class="card-field">
                    <button type="button" class="dialog-box-edit-open-btn">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                </div>
            </div>
        `;

        cardEl.querySelector(".card-remove-btn")
            .addEventListener("click", Card.#addRemoveEventHandler(serial))

        cardEl.querySelector(".dialog-box-edit-open-btn")
            .addEventListener("click", Card.#addEditEventHandler(serial))

        return cardEl;
    }

    static #addRemoveEventHandler(serial) {
        return function (event) {
            myLibrary.removeBook(serial); 
            UI.renderAllCards();
        };
    }

    static #addEditEventHandler(serial) {
        return function (event) {
            myLibrary.setReplaceBookIndex(serial);
            formEditBook.populateFormInputField(myLibrary.getBook(serial));
            dialogBoxEdit.showModal();
        };
    }
}

// Define the UI class to handle rendering of book cards
class UI {
    static #shelfWishList = document.getElementById("shelf-books-area-wish-list");
    static #shelfReading = document.getElementById("shelf-books-area-reading");
    static #shelfCompleted = document.getElementById("shelf-books-area-completed"); 

    static renderCard(book, serial) {
        const card = Card.create(book, serial);
        const { status } = book;

        if (status === 0) {
            UI.#shelfWishList.appendChild(card);
        } else if (status === 1) {
            UI.#shelfReading.appendChild(card);
        } else {
            UI.#shelfCompleted.appendChild(card);
        }
    }

    static renderAllCards() {
        UI.#clearBookshelf();
        myLibrary.getAllBooks()
            .forEach((book, serial) => UI.renderCard(book, serial));
    }

    static #clearBookshelf() {
        [
            UI.#shelfWishList, 
            UI.#shelfReading, 
            UI.#shelfCompleted
        ].forEach((shelf) => shelf.innerHTML = "");
    }
}

// Function to load default books into the library
function loadDefaultBooks() {
    const defaultBooks = [
        {
            title: "The Self-taught Programmer: The Definitive Guide to Programming Professionally",
            author: "Cory Althoff",
            publisher: "Triangle Connection LLC.",
            year: 2017,
            status: 2, // Completed
        },
        {
            title: "Sapiens: A Brief History of Humankind",
            author: "Yuval Noah Harari",
            publisher: "Harper",
            year: 2015,
            status: 0, // Wish List
        },
        {
            title: "Ikigai: The Japanese Secret to a Long and Happy Life",
            author: "Héctor García and Francesc Miralles",
            publisher: "Penguin Books",
            year: 2016,
            status: 2, // Completed
        },
        {
            title: "1984",
            author: "George Orwell",
            publisher: "Secker & Warburg",
            year: 1949,
            status: 1, // Reading
        },
    ];

    defaultBooks.forEach((bookInfo) => {
        const { title, author, publisher, year, status } = bookInfo; 
        myLibrary.addBook(new Book(title, author, publisher, year, status));
    });

    UI.renderAllCards();
}

/* * * * * * * * * * * MAIN * * * * * * * *  * */

// Dialog box elements
const dialogBoxAdd = document.getElementById("dialog-box-add"); // Dialog box for adding a new book
const dialogBoxEdit = document.getElementById("dialog-box-edit"); // Dialog box for editing an existing book

// Buttons for opening and closing dialog boxes
const dialogBoxAddOpenButton = document.getElementById("dialog-box-add-open-btn"); // Button to open the add dialog box
const dialogBoxAddCloseButton = document.getElementById("dialog-box-add-close-btn"); // Button to close the add dialog box
const dialogBoxEditCloseButton = document.getElementById("dialog-box-edit-close-btn"); // Button to close the edit dialog box

// Class instances
const formAddBook = new Form(document.getElementById("form-add"));
const formEditBook = new Form(document.getElementById("form-edit")); 
const myLibrary = new Library();

// load dummy book cards to webpage
loadDefaultBooks();

// Add form related event listeners
dialogBoxAddOpenButton.addEventListener("click", (e) => dialogBoxAdd.showModal()); 
dialogBoxAddCloseButton.addEventListener("click", (e) => dialogBoxAdd.close()); 

formAddBook.addFormSubmitEventListener((newBook) => {
    myLibrary.addBook(newBook);
    UI.renderCard(newBook, myLibrary.getTotalBookCount() - 1); 
    formAddBook.clearFormInputField();
});

// Edit form related event listeners
dialogBoxEditCloseButton.addEventListener("click", (e) => dialogBoxEdit.close());

formEditBook.addFormSubmitEventListener((newBook) => {
    myLibrary.replaceBook(newBook);
    UI.renderAllCards(); 
    dialogBoxEdit.close(); 
}); 