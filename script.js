const addBookHeaderButton = document.querySelector('header .add-book-button');

const addBookModal = document.querySelector('#add-book-modal');
const addBookModalButton = document.querySelector('#add-book-modal .add-book-button')
const addBookModalCheckbox = document.querySelector('#add-book-modal input[type="checkbox"]');

const updateReadingModal = document.querySelector('#update-reading-modal');
const updateReadingModalButton = document.querySelector('#update-reading-modal .update-reading-button')
const updateReadingModalCheckbox = document.querySelector('#update-reading-modal input[type="checkbox"]');

const inputFields = document.querySelectorAll('input:not([type="checkbox"])');

const overlay = document.querySelector('.overlay');

// Pagemeter 
const pagemeter = document.querySelector('.pagemeter');
const totalPagesRead = pagemeter.firstElementChild;
const totalPages = pagemeter.lastElementChild;

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

  updateReading(pages) {
    this.pagesRead = pages;
    this.isRead = this.pagesRead == this.pages;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  find(bookName) {
    return this.books.findIndex(book => book.name === bookName);
  }

  getTotalPages() {
    return this.books.reduce((previus, current) => previus + current.pages, 0);
  }

  getPagesRead() {
    return this.books.reduce((previus, current) => previus + current.pagesRead, 0);
  }
}

const library = new Library();
library.books = [new Book('The name of the wind', 'Patrick Rothfuss', 650, 300, false), new Book('The wise man\'s fear', 'Patrick Rothfuss', 980, 500, false)];

function main() {
  setUpListeners();
  updateBooksGrid();
  updatePagemeter();
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
  bookPagemeter.innerHTML = `<span class="pages-read">${book.pagesRead}</span> out of <span class="total-pages">${book.pages}</span> pages read`;

  wrapper.appendChild(title);
  wrapper.appendChild(author);
  bookCardContent.appendChild(wrapper);
  bookCardContent.appendChild(bookPagemeter);
  bookCard.appendChild(bookCardContent);
  booksGrid.appendChild(bookCard);

  bookCard.addEventListener('click', openUpdateReadingModal);
}

function updateBookCard(pages, index) {
  const bookCard = document.querySelector(`.book-card:nth-child(${index + 1})`);
  bookCard.querySelector('.pages-read').innerText = pages;
}

function updateBooksGrid() {
  booksGrid.innerHTML = "";
  library.books.forEach(book => createBookCard(book));
}

function updatePagemeter() {
  totalPagesRead.innerText = library.getPagesRead();
  totalPages.innerText = library.getTotalPages();
}

function addBook() {
  const book = getBookFromInput();
  book.addBookToLibrary();
  createBookCard(book);
  updatePagemeter();
}

function updateReading() {
  const index = +updateReadingModal.dataset.index;
  const book = library.books[index];
  const isRead = updateReadingModalCheckbox.checked;
  const pages = isRead ? book.pages : +document.getElementById('update-pages-read').value;

  book.updateReading(pages);
  updateBookCard(book.pagesRead, index);
  updatePagemeter();
}

function getBookFromInput() {
  const name = document.getElementById('book-title').value;
  const author = document.getElementById('author-name').value;
  const totalPages = +document.getElementById('total-pages').value;
  const isRead = document.getElementById('add-isread').checked;
  const pagesRead = isRead ? totalPages : +document.getElementById('add-pages-read').value;

  return new Book(name, author, totalPages, pagesRead, totalPages == pagesRead);
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

  updateReadingModal.addEventListener('transitionend', resetInputValues);
  updateReadingModalCheckbox.addEventListener('input', toggleInput);

  document.addEventListener('submit', submitForm);
}

function submitForm(event) {
  event.preventDefault();

  let validate;
  let action;

  const form = event.target;

  if (form.id === "add-book-form") {
    validate = validateAddBookForm;
    action = addBook;
  }
  else if (form.id === "update-reading-form") {
    validate = validateUpdateReadingForm;
    action = updateReading;
  }

  if (validate(form)) {
    action();
    hideModal();
    inputFields.forEach(input => input.blur());
  }
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
  const isRead = document.getElementById('add-isread').checked;

  if (!totalPagesInput.checkValidity() || isRead)
    return isValid;

  const pagesReadInput = document.getElementById('add-pages-read');

  const totalPages = +totalPagesInput.value;
  const pagesRead = +pagesReadInput.value;

  if (pagesRead > totalPages) {
    isValid = false;
    pagesReadInput.classList.add('invalid');
  }

  return isValid;
}

function validateUpdateReadingForm(form) {
  if (!validateInputs(form)) return false

  const index = +updateReadingModal.dataset.index;
  const book = library.books[index];

  const pagesReadInput = document.querySelector('#update-pages-read');
  const pagesRead = +pagesReadInput.value;

  if (pagesRead > book.pages) {
    pagesReadInput.classList.add('invalid');
    return false;
  }

  return true;
}

function openAddBookModal() {
  addBookModal.classList.add('active');
  overlay.classList.add('active');
}

function openUpdateReadingModal(event) {
  const bookName = event.currentTarget.querySelector('.book-title').innerText;
  const index = library.find(bookName);
  const book = library.books[index];

  updateReadingModal.dataset.index = index;
  updateReadingModal.classList.add('active');
  updateReadingModalCheckbox.checked = book.isRead;
  document.getElementById('update-pages-read').disabled = book.isRead;

  overlay.classList.add('active');
}

function hideModal() {
  document.querySelectorAll('.active').forEach(query => query.classList.remove('active'));
}

function toggleInput(event) {
  const checkbox = event.target;

  let modal;
  if (addBookModal.contains(checkbox))
    modal = addBookModal;
  else if (updateReadingModal.contains(checkbox))
    modal = updateReadingModal

  const pagesReadInput = modal.querySelector('[name="pages-read"]');
  pagesReadInput.disabled = checkbox.checked;

  if (checkbox.checked) {
    pagesReadInput.value = "";
    pagesReadInput.classList.remove('invalid');
  }
}

function resetInputValues(event) {
  const modal = event.currentTarget;

  if (event.target != modal) return;

  const scaleY = modal.getBoundingClientRect().width / modal.offsetWidth;
  if (scaleY != 0) return;

  const inputs = modal.querySelectorAll('input:not([type="checkbox"])');
  inputs.forEach(input => {
    input.classList.remove('invalid');
    input.value = "";
  });

  modal.querySelector('[name="pages-read"]').disabled = false;
  const checkbox = modal.querySelector('input[type="checkbox"]');
  checkbox.checked = false;
}

document.addEventListener('DOMContentLoaded', main);

