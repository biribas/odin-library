const addBookHeaderButton = document.querySelector('header .add-book-button');

const addBookModal = document.querySelector('.add-book-modal');
const addBookModalButton = document.querySelector('form .add-book-button')
const addBookModalCheckbox = document.querySelector('.add-book-modal input[type="checkbox"]');

const inputFields = document.querySelectorAll('input:not([type="checkbox"])');

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
  const totalPages = +document.getElementById('total-pages').value;
  const isRead = document.getElementById('isRead').checked;
  const pagesRead = isRead ? totalPages : +document.getElementById('pages-read').value;

  return new Book(name, author, totalPages, pagesRead, isRead);
}

function setUpListeners() {
  inputFields.forEach(input => {
    input.addEventListener('focusout', () => !input.checkValidity() && input.classList.add('invalid'));
    input.addEventListener('input', () => input.checkValidity() && input.classList.remove('invalid'));
  });

  addBookHeaderButton.onclick = openAddBookModal;
  overlay.onclick = hideModal;

  addBookModal.addEventListener('transitionend', resetInputValues);

  addBookModalCheckbox.addEventListener('input', toggleInput);
  document.addEventListener('submit', submitForm);
}

function submitForm(event) {
  event.preventDefault();
  let validate;

  if (event.target.id == "add-book-form") {
    validate = validateAddBookForm;
  }

  if (!validate(event.target)) return;

  hideModal();
  addBook();
  updateBooksGrid();
}

function validateInputs(form) {
  const inputs = form.querySelectorAll('input:not([type="checkbox"])');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.checkValidity()) {
      input.classList.add('invalid');
      isValid = false;
    }
  });

  return isValid;
}

function validateAddBookForm(form) {
  let isValid = validateInputs(form);

  const totalPagesInput = document.getElementById('total-pages');
  const isRead = document.getElementById('isRead').checked;

  if (!totalPagesInput.checkValidity() || isRead)
    return isValid;

  const pagesReadInput = document.getElementById('pages-read');

  const totalPages = +totalPagesInput.value;
  const pagesRead = +pagesReadInput.value;

  if (pagesRead > totalPages) {
    isValid = false;
    pagesReadInput.classList.add('invalid');
  }

  return isValid;
}

function toggleInput(event) {
  const pagesReadInput = document.querySelector('#pages-read');
  pagesReadInput.disabled = event.target.checked;

  if (event.target.checked) {
    pagesReadInput.value = "";
    pagesReadInput.classList.remove('invalid');
  }
}

function openAddBookModal() {
  addBookModal.classList.add('active');
  overlay.classList.add('active');
}

function hideModal() {
  document.querySelectorAll('.active').forEach(query => query.classList.remove('active'));
}

function resetInputValues(event) {
  if (event.target != event.currentTarget) return;

  const inputs = event.target.querySelectorAll('input:not([type="checkbox"])');
  inputs.forEach(input => {
    input.classList.remove('invalid');
    input.value = "";
  });

  document.querySelector('#pages-read').disabled = false;
  const checkbox = event.target.querySelector('input[type="checkbox"]');
  checkbox.checked = false;
}

document.addEventListener('DOMContentLoaded', main);

