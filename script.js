const addBookHeaderButton = document.querySelector('header .add-book-button');

const addBookModal = document.querySelector('.add-book-modal');
const inputs = document.querySelectorAll('input');
const overlay = document.querySelector('.overlay');

const pagemeter = document.querySelector('.pagemeter');
const totalPages = pagemeter.firstElementChildChild;
const totalPagesRead = pagemeter.lastElementChild;

const booksGrid = document.querySelector('.books-grid');

class Book {
  constructor(name, author, pages, pagesRead, isRead) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.pagesRead = pagesRead;
    this.isRead = isRead;
  }

  addBookToLibrary() {

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
}

function setUpListeners() {
  inputs.forEach(input => {
    input.addEventListener('focusout', () => {
      if (!input.checkValidity())
        input.classList.add('invalid');
    });

    input.addEventListener('input', () => {
      if (input.checkValidity())
        input.classList.remove('invalid');
    });
  });

  document.addEventListener('submit', validateForm);

  addBookHeaderButton.addEventListener('click', showModal);
  overlay.addEventListener('click', hideModal);
}

function validateForm(event) {
  inputs.forEach(input => {
    if (!input.checkValidity()) {
      input.classList.add('invalid');
      event.preventDefault();
    }
  });
}

function showModal() {
  addBookModal.classList.add('active');
  overlay.classList.add('active');
}

function hideModal() {
  document.querySelectorAll('.active').forEach(query => query.classList.remove('active'));
}

document.addEventListener('DOMContentLoaded', main)

