const addBookHeaderButton = document.querySelector('header .add-book-button');

const addBookModal = document.querySelector('.add-book-modal');
const addBookModalButton = document.querySelector('form .add-book-button')

const inputs = document.querySelectorAll('input');
const overlay = document.querySelector('.overlay');

// Pagemeter 
const pagemeter = document.querySelector('.pagemeter');
const totalPages = pagemeter.firstElementChildChild;
const totalPagesRead = pagemeter.lastElementChild;

const booksGrid = document.querySelector('.books-grid');

class Book {
  constructor(name, author, pages, pagesRead, isRead = false) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.pagesRead = pagesRead;
    this.isRead = isRead;
  }

  addBookToLibrary() {
    library.books.push(this);
  }

  updateBook() {

  }
}

class Library {
  constructor() {
    this.books = []
  }
}

const library = new Library();
library.books = [new Book('The name of the wind', 'Patrick Rothfuss', 650, 300, true), new Book('The wise man\'s fear', 'Patrick Rothfuss', 980, 500, false)];

function main() {
  setUpListeners();
  updateBooksGrid();
}

function createBookCard(book) {
  const bookCard = document.createElement('div');
  const bookCardContent = document.createElement('div');
  const wrapper = document.createElement('div');
  const title = document.createElement('h2');
  const author = document.createElement('h3');
  const bookPagemeter = document.createElement('div');

  bookCard.classList.add('book-card');
  bookCardContent.classList.add('book-card-content');
  wrapper.classList.add('wrapper');
  title.classList.add('book-title');
  author.classList.add('book-author');
  bookPagemeter.classList.add('bookPagemeter');

  title.innerText = book.name;
  author.innerText = book.author;
  bookPagemeter.innerText = `${book.pagesRead} out of ${book.pages} pages read`;

  wrapper.appendChild(title);
  wrapper.appendChild(author);
  bookCardContent.appendChild(wrapper);
  bookCardContent.appendChild(bookPagemeter);
  bookCard.appendChild(bookCardContent);
  booksGrid.appendChild(bookCard);
}

function updateBooksGrid() {
  booksGrid.innerHTML = "";
  library.books.forEach(book => createBookCard(book));
}

function addBook() {
  const book = getBookFromInput();
  book.addBookToLibrary();
}

function getBookFromInput() {
  const name = document.getElementById('book-title').value;
  const author = document.getElementById('author-name').value;
  const totalPages = document.getElementById('total-pages').value;
  const pagesRead = document.getElementById('pages-read').value;
  const isRead = document.getElementById('isRead').checked;

  return new Book(name, author, totalPages, pagesRead, isRead);
}

function setUpListeners() {
  inputs.forEach(input => {
    input.addEventListener('focusout', () => !input.checkValidity() && input.classList.add('invalid'));
    input.addEventListener('input', () => input.checkValidity() && input.classList.remove('invalid'));
  });

  document.addEventListener('submit', submitForm);

  addBookHeaderButton.onclick = openAddBookModal;
  overlay.onclick = hideModal;
}

function submitForm(event) {
  if (!validateForm(event)) return;

  addBook();

  updateBooksGrid();
}

function validateForm(event) {
  inputs.forEach(input => {
    if (!input.checkValidity()) {
      input.classList.add('invalid');
      event.preventDefault();
    }
  });

  return !event.defaultPrevented;
}

function openAddBookModal() {
  addBookModal.classList.add('active');
  overlay.classList.add('active');
}

function hideModal() {
  document.querySelectorAll('.active').forEach(query => query.classList.remove('active'));
}

document.addEventListener('DOMContentLoaded', main)

