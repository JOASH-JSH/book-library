// Dialog box
const dialogBoxAdd = document.getElementById("dialog-box-add");
const dialogBoxEdit = document.getElementById("dialog-box-edit");

// Dialog box open and close button  
const dialogBoxAddOpenButton = document.getElementById("dialog-box-add-open-btn");
const dialogBoxAddCloseButton = document.getElementById("dialog-box-add-close-btn");
const dialogBoxEditCloseButton = document.getElementById("dialog-box-edit-close-btn");

// Form add and edit
const formAdd = document.getElementById("form-add");
const formEdit = document.getElementById("form-edit");

// Bookshelf (wish-list, reading, completed)
const shelfBooksAreaWishList = document.getElementById("shelf-books-area-wish-list");
const shelfBooksAreaReading = document.getElementById("shelf-books-area-reading");
const shelfBooksAreaCompleted = document.getElementById("shelf-books-area-completed");

// Constructor function to create Book object
function Book(title, author, publisher, year, status) {
    this.title = title;
    this.author = author;
    this.publisher = publisher;
    this.year = year;
    this.status = status;
}

// Dummy books
const dummyBook1 = new Book("The Self-taught Programmer: The Definitive Guide to Programming Professionally", "Cory Althoff", "Triangle Connection LLC.", 2017, 2);
const dummyBook2 = new Book("Sapiens: A Brief History of Humankind", "Yuval Noah Harari", "Harper", 2015, 0);
const dummyBook3 = new Book("Ikigai: The Japanese Secret to a Long and Happy Life", "Héctor García and Francesc Miralles", "Penguin Books", 2016, 2);
const dummyBook4 = new Book("1984", "George Orwell", "Secker & Warburg", 1949, 1);

// To store array book objects
const myLibrary = [dummyBook1, dummyBook2, dummyBook3, dummyBook4]; 

// This global variable tracks the index of the book to be edited when the user clicks the edit button
let editBookIndex = -1;

// Add book object to the library
function addBookToLibrary() {
    const newBook = getFormData(formAdd);
    myLibrary.push(newBook);
    return newBook;
}

// Remove book object from the library
function removeBookFromLibrary(index) {
    myLibrary.splice(index, 1);
    renderLibrary();
}

// Get data from the new book form and return newly created book object
function getFormData(form) {
    const formData = new FormData(form);
    const { title, author, publisher, year, status } = Object.fromEntries(formData);
    return new Book(title.trim(), author.trim(), publisher.trim(), year, parseInt(status));
}

// Create card HTML element from the book object and return the card HTML element
function createCard(book, bookIndex) {
    // Create card fields HTML based on book details
    const createCardFields = (book) => {
        const fields = ["title", "author", "publisher", "year"];
        return fields.map((field) => {
            const tag = (field === "year") ? "span" : "p";
            return `
                <div class="card-field">
                    <${tag} class="card-label">${field} : </${tag}>
                    <${tag} class="card-book-info">${book[field]}</${tag}>
                </div>
            `;
        }).join("");
    }

    // header colors
    const cardHeaderColors = ["#1877f2", "#ff4500", "#008000"];

    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.bookIndex = bookIndex;
    card.innerHTML = `
        <div class="card-header" style="background-color: ${cardHeaderColors[book.status]}">
            <p class="card-heading-text">Book</p>
            <button class="card-remove-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="card-book-details">
            ${createCardFields(book)}
            <div class="card-field">
                <button type="button" class="dialog-box-edit-open-btn">
                    <i class="fa-solid fa-edit"></i>
                </button>
            </div>
        </div>
    `;

    // Setup remove and edit event listener 
    setupRemoveCardEventListener(card);
    setupEditCardEventListener(card, book);

    // Return card HTML element
    return card;
}

// setup remove card event listener to the card remove button
function setupRemoveCardEventListener(card) {
    const cardRemoveButton = card.querySelector(".card-remove-btn");

    cardRemoveButton.addEventListener("click", (event) => {
        if (event.target.closest(".card-remove-btn")) {
            const bookIndex = parseInt(card.dataset.bookIndex);
            removeBookFromLibrary(bookIndex);
        }
    });
}

// Setup edit card event listener to the card edit button
function setupEditCardEventListener(card, book) {
    const dialogBoxEditOpenButton = card.querySelector(".dialog-box-edit-open-btn");
    
    dialogBoxEditOpenButton.addEventListener("click", (event) => {
        // Set the book number to be edited
        editBookIndex = card.dataset.bookIndex;
        
        // Show the edit dialog box
        dialogBoxEdit.showModal();
        
        // Populate the form with the book details
        ["title", "author", "publisher", "year", "status"].forEach((key) => {
            formEdit.querySelector(`#form-edit-book-${key}`).value = book[key];
        });
    });
}

// render the entire library of books onto shelves
function renderLibrary() {
    const bookshelf = [shelfBooksAreaWishList, shelfBooksAreaReading, shelfBooksAreaCompleted];
    bookshelf.forEach((shelf) => (shelf.innerHTML = ""));
    myLibrary.forEach((book, bookIndex) => renderBookCard(book, bookIndex));
}

// render a single book card onto the appropriate shelf
function renderBookCard(newBook, bookIndex) {
    const newCard = createCard(newBook, bookIndex);

    if (newBook.status === 0) {
        shelfBooksAreaWishList.appendChild(newCard);
    } else if (newBook.status === 1) {
        shelfBooksAreaReading.appendChild(newCard);
    } else {
        shelfBooksAreaCompleted.appendChild(newCard);
    }
}

renderLibrary();

// form add related
dialogBoxAddOpenButton.addEventListener("click", (event) => dialogBoxAdd.showModal());
dialogBoxAddCloseButton.addEventListener("click", (event) => dialogBoxAdd.close());
formAdd.addEventListener("submit", (event) => {
    event.preventDefault();
    const newBook = addBookToLibrary();
    renderBookCard(newBook, myLibrary.length - 1);
});

// form edit related
dialogBoxEditCloseButton.addEventListener("click", (event) => dialogBoxEdit.close() );
formEdit.addEventListener("submit", (event) => {
    event.preventDefault();
    myLibrary[editBookIndex] = getFormData(formEdit);
    dialogBoxEdit.close();
    editBookIndex = -1;
    renderLibrary();
});
