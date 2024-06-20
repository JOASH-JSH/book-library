// Dialog box elements
const dialogBoxAdd = document.getElementById("dialog-box-add"); // Dialog box for adding a new book
const dialogBoxEdit = document.getElementById("dialog-box-edit"); // Dialog box for editing an existing book

// Buttons for opening and closing dialog boxes
const dialogBoxAddOpenButton = document.getElementById("dialog-box-add-open-btn"); // Button to open the add dialog box
const dialogBoxAddCloseButton = document.getElementById("dialog-box-add-close-btn"); // Button to close the add dialog box
const dialogBoxEditCloseButton = document.getElementById("dialog-box-edit-close-btn"); // Button to close the edit dialog box

// Form elements within the dialog boxes
const formAdd = document.getElementById("form-add"); // Form inside the add dialog box
const formEdit = document.getElementById("form-edit"); // Form inside the edit dialog box

/**
 * Constructor function to create a Book object.
 * @param {Object} param0 - The book details.
 * @param {string} param0.title - The title of the book.
 * @param {string} param0.author - The author of the book.
 * @param {string} param0.publisher - The publisher of the book.
 * @param {string|number} param0.year - The publication year of the book.
 * @param {string|number} param0.status - The status of the book.
 */
function Book({ title, author, publisher, year, status }) {
    this.title = title.trim(); // Trim whitespace from the title
    this.author = author.trim(); // Trim whitespace from the author
    this.publisher = publisher.trim(); // Trim whitespace from the publisher
    this.year = parseInt(year); // Convert the year to an integer
    this.status = parseInt(status); // Convert the status to an integer
}

/**
 * Get the data from the form, convert it into a Book object,
 * and return the Book object.
 * @param {HTMLFormElement} form - The form element containing book data.
 * @returns {Book} The Book object created from form data.
 */
function getFormDataAndConvertToBook(form) {
    const data = new FormData(form); // Extract form data
    return new Book(Object.fromEntries(data)); // Convert form data to an object and create a new Book
}

// myLibrary module
const myLibrary = (function () {
    let bookList = []; // stores the list of books
    let replaceBookIndex = -1; // index of the book to be replaced

    /**
     * Adds a new book to the bookList.
     * @param {Object} book - The book to add.
     */
    function addBook(book) {
        bookList.push(book);
    }

    /**
     * Removes a book from the bookList by index.
     * @param {number} index - The index of the book to remove.
     */
    function removeBook(index) {
        bookList.splice(index, 1);
    }

    /**
     * Retrieves a book from the bookList by index. 
     * @param {number} index - The index of the book to retrieve.
     * @returns {object | null} - The book object or null if the index is out of bounds.
     */
    function getBook(index) {
        return bookList[index] ?? null;
    }

    /**
     * Replaces the book at the specified replaceBookIndex with a new book.
     * @param {object} book - The new book to replace the old one.
     */
    function replaceBook(book) {
        bookList[replaceBookIndex] = book;
        setReplaceBookIndex(-1);
    }

    /**
     * Gets the total count of books in the bookList
     * @returns {number} - The total number of books.
     */
    function getTotalBooksCount() {
        return bookList.length;
    }

    /**
     * Retrieves all books in the bookList.
     * @returns {Array} - A shallow copy of the bookList.
     */
    function getAllBooks() {
        return [...bookList];
    }

    /**
     * Sets the index of the book to be replaced.
     * @param {number} index - The index to set for replacement.
     */
    function setReplaceBookIndex(index) {
        replaceBookIndex = index;
    }

    // Return the public methods
    return { 
        addBook, 
        removeBook, 
        getBook, 
        replaceBook, 
        getTotalBooksCount, 
        getAllBooks, 
        setReplaceBookIndex,
    };
})();

// bookshelf module
const bookshelf = (function () {
    // Get references to the DOM elements representing the different book shelves
    const shelfWishList = document.getElementById("shelf-books-area-wish-list"); // Shelf for books in the wish list
    const shelfReading = document.getElementById("shelf-books-area-reading"); // Shelf for books currently being read
    const shelfCompleted = document.getElementById("shelf-books-area-completed"); // Shelf for books that have been completed

    /**
     * Adds a book card to the wish list shelf.
     * @param {HTMLElement} card - The book card element to add.
     */
    function addToWishList(card) {
        shelfWishList.appendChild(card); // Append the card to the wish list shelf
    }

    /**
     * Adds a book card to the reading shelf.
     * @param {HTMLElement} card - The book card element to add.
     */
    function addToReading(card) {
        shelfReading.appendChild(card); // Append the card to the reading shelf
    }

    /**
     * Adds a book card to the completed shelf.
     * @param {HTMLElement} card - The book card element to add.
     */
    function addToCompleted(card) {
        shelfCompleted.appendChild(card); // Append the card to the completed shelf
    }

    /**
     * Clears all books from the wish list, reading, and completed shelves.
     */
    function clearAllInnerHTML() {
        // Clear the inner HTML of all shelves
        [shelfWishList, shelfReading, shelfCompleted].forEach((shelf) => shelf.innerHTML = "");
    }

    // Return the public methods
    return { addToWishList, addToReading, addToCompleted, clearAllInnerHTML };
})();

// card module
const card = (function () {
    /**
     * Creates a card element for a given book.
     * @param {Object} book - The book object containing its details.
     * @param {number} bookIndex - The index of the book in the library.
     * @returns {HTMLElement} The created card element.
     */
    function create(book, bookIndex) {
        const cardEl = document.createElement("div");

        cardEl.setAttribute("class", "card");
        cardEl.setAttribute("data-book-index", bookIndex);

        const headerColors = ["#1877f2", "#ff4500", "#008000"]; // Colors for different book statuses

        // HTML content for the card element
        const cardContent = `
            <div class="card-header" style="background-color: ${headerColors[book.status]}">
                <p class="card-heading-text">Book</p>
                <button class="card-remove-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="card-main">
                ${createCardFields(book)}
                <div class="card-field">
                    <button type="button" class="dialog-box-edit-open-btn">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                </div>
            </div>
        `;

        cardEl.innerHTML = cardContent;

        // Setup event listeners for the card
        setupRemoveCardEventListener.call(this, cardEl);
        setupEditCardEventListener.call(this, cardEl);

        return cardEl;
    }

    /**
     * Creates the HTML content for the book fields.
     * @param {Object} book - The book object containing its details.
     * @returns {string} The HTML string for the book fields.
     */
    function createCardFields(book) {
        const fields = ["title", "author", "publisher", "year"];

        return fields.map((field) => {
            const tag = field === "year" ? "span" : "p";

            return `
                <div class="card-field">
                    <${tag} class="card-label">${field} : </${tag}>
                    <${tag} class="card-book-info">${book[field]}</${tag}>
                </div>
            `;
        }).join("");
    }

    /**
     * Sets up the event listener for removing the card.
     * @param {HTMLElement} card - The card element.
     */
    function setupRemoveCardEventListener(card) {
        const cardRemoveButton = card.querySelector(".card-remove-btn");

        cardRemoveButton.addEventListener("click", (event) => {
            if (event.target.closest(".card-remove-btn")) {
                myLibrary.removeBook(parseInt(card.dataset.bookIndex)); // Remove the book from the library
                render.multipleCard(); // Re-render the cards
            }
        });
    }

    /**
     * Sets up the event listener for editing the card.
     * @param {HTMLElement} card - The card element.
     */
    function setupEditCardEventListener(card) {
        const dialogBoxEditOpenButton = card.querySelector(".dialog-box-edit-open-btn");
        const bookIndex = parseInt(card.dataset.bookIndex);
        
        dialogBoxEditOpenButton.addEventListener("click", (event) => {
            myLibrary.setReplaceBookIndex(bookIndex); // Set the book index to be replaced
            const book = myLibrary.getBook(bookIndex); // Get the book details

            dialogBoxEdit.showModal(); // Show the edit dialog box
    
            const fields = ["title", "author", "publisher", "year", "status"];

            // Populate the edit form with the book details
            fields.forEach((field) => formEdit.querySelector(`#form-edit-book-${field}`).value = book[field]);
        });
    }

    // return the public method
    return { create };
})();

// render module
const render = (function () {
    /**
     * Renders a single book card and appends it to the appropriate shelf.
     * @param {Object} book - The book object containing its details.
     * @param {number} bookIndex - The index of the book in the library.
     */
    function singleCard(book, bookIndex) {
        const cardEl = card.create(book, bookIndex); // Create a card element for the book
        const shelfIndex = book.status; // Determine which shelf the book belongs to

        // Append the card to the appropriate shelf based on the book's status
        if (shelfIndex === 0) {
            bookshelf.addToWishList(cardEl);
        } else if (shelfIndex === 1) {
            bookshelf.addToReading(cardEl);
        } else {
            bookshelf.addToCompleted(cardEl);
        }
    }

    /**
     * Clears all book shelves and renders all books as cards.
     */
    function multipleCard() {
        bookshelf.clearAllInnerHTML(); // Clear all shelves

        const bookList = myLibrary.getAllBooks(); // Get the list of all books

        // Render each book as a card and append it to the appropriate shelf
        bookList.forEach((book, bookIndex) => singleCard(book, bookIndex));
    }

    // return the public methods
    return { singleCard, multipleCard };
})();

// Render dummy book cards
(function () {
    // Dummy book data
    const dummyBooks = [
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

    // Add dummy books to the library
    dummyBooks.forEach((bookInfo) => myLibrary.addBook(new Book(bookInfo)));

    // Render all cards after adding dummy books
    render.multipleCard();
})();

// Form related functions

/**
 * Clears input fields of the add book form.
 * @param {HTMLFormElement} form - The form element to clear.
 */
function clearFormInputField(form) {
    const fields = ["title", "author", "publisher", "year", "status"];

    // Clear each input field in the form
    fields.forEach((field) => form.querySelector(`#form-add-book-${field}`).value = "");
}

/**
 * Handles the form submission for adding a book.
 * @param {Event} event - The submit event object.
 */
function handleFormAddSubmit(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const book = getFormDataAndConvertToBook(formAdd); // Convert form data to Book object

    myLibrary.addBook(book); // Add book to the library
    render.singleCard(book, myLibrary.getTotalBooksCount() - 1); // Render the new book card

    clearFormInputField(formAdd); // Clear input fields in the add book form
}

/**
 * Handles the closing of the edit form dialog.
 */
function handleFormEditClose() {
    myLibrary.setReplaceBookIndex(-1); // Reset replace book index in the library
    dialogBoxEdit.close(); // Close the edit dialog box
}

/**
 * Handles the form submission for editing a book.
 * @param {Event} event - The submit event object.
 */
function handleFormEditSubmit(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const book = getFormDataAndConvertToBook(formEdit); // Convert form data to Book object

    myLibrary.replaceBook(book); // Replace the book in the library
    dialogBoxEdit.close(); // Close the edit dialog box
    render.multipleCard(); // Re-render all book cards
}

// Event listeners for form and dialog box interactions

// Add form related event listeners
dialogBoxAddOpenButton.addEventListener("click", (event) => dialogBoxAdd.showModal()); // Open add book dialog box
dialogBoxAddCloseButton.addEventListener("click", (event) => dialogBoxAdd.close()); // Close add book dialog box
formAdd.addEventListener("submit", (event) => handleFormAddSubmit(event)); // Handle add book form submission

// Edit form related event listeners
dialogBoxEditCloseButton.addEventListener("click", (event) => handleFormEditClose()); // Handle closing edit dialog box
formEdit.addEventListener("submit", (event) => handleFormEditSubmit(event)); // Handle edit book form submission

