const styleTag = document.querySelector('style');
const addBookButton = document.getElementById('add-book-button');

const addBookModal = document.getElementById('add-book-modal');
const addBookModalButton = addBookModal.querySelector('button')
const addBookModalCheckbox = addBookModal.querySelector('input[type="checkbox"]');

const updateReadingModal = document.getElementById('update-reading-modal');
const updateReadingModalButton = updateReadingModal.querySelector('button')
const updateReadingModalCheckbox = updateReadingModal.querySelector('input[type="checkbox"]');

const removeBookModal = document.getElementById('remove-book-modal');
const removeBookButtons = removeBookModal.querySelector('.buttons');

const inputFields = document.querySelectorAll('input:not([type="checkbox"])');

const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlay-content');

const emptyLibraryMessage = document.getElementById('empty-library-message-wrapper');

// Pagemeter 
const pagemeter = document.getElementById('pagemeter');
const totalPagesRead = pagemeter.firstElementChild;
const totalPages = pagemeter.lastElementChild;

const booksGrid = document.getElementById('books-grid');

class Book {
  constructor(name, author, pages, pagesRead, isRead = false) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.pagesRead = pagesRead;
    this.isRead = isRead;
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

  add(book) {
    this.books.push(book);
  }

  remove(index) {
    this.books.splice(index, 1);
  }

  find(bookName) {
    bookName = bookName.toLowerCase();
    return this.books.findIndex(book => book.name.toLowerCase() === bookName);
  }

  get size() {
    return this.books.length;
  }

  get totalPages() {
    return this.books.reduce((previus, current) => previus + current.pages, 0);
  }

  get pagesRead() {
    return this.books.reduce((previus, current) => previus + current.pagesRead, 0);
  }
}

const library = new Library();

function createBookCard(book) {
  const bookCard = document.createElement('div');
  const removeCard = document.createElement('i');
  const bookCardContent = document.createElement('div');
  const wrapper = document.createElement('div');
  const title = document.createElement('h2');
  const author = document.createElement('h3');
  const bookPagemeter = document.createElement('div');

  bookCard.classList.add('book-card');
  removeCard.classList.add('ph-x-fill', 'remove-card-button');
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
  bookCard.appendChild(removeCard);
  bookCard.appendChild(bookCardContent);
  booksGrid.appendChild(bookCard);

  bookCard.addEventListener('click', openUpdateReadingModal);
  removeCard.addEventListener('click', openRemoveCardModal);
}

function removeBookCard(index) {
  const bookCard = document.querySelector(`.book-card:nth-child(${index + 1})`);
  bookCard.remove();
}

function updateBookCard(pages, index) {
  const bookCard = document.querySelector(`.book-card:nth-child(${index + 1})`);
  bookCard.querySelector('.pages-read').innerText = pages;
}

function updatePagemeter() {
  totalPagesRead.innerText = library.pagesRead;
  totalPages.innerText = library.totalPages;
}

function addBook() {
  const book = getBookFromInput();

  library.add(book);
  if (library.size === 1)
    toggleEmptyMessge();

  createBookCard(book);
  updatePagemeter();
}

function removeBook() {
  const index = +removeBookModal.dataset.index;

  library.remove(index);
  if (library.size === 0)
    toggleEmptyMessge();

  removeBookCard(index);
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

function handleRemoveBook(event) {
  if (event.target.tagName != "BUTTON") return;

  if (event.target.className === "yes")
    removeBook();

  hideModal();
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

  const nameInput = form.querySelector('#book-title');
  const bookName = nameInput.value;
  if (library.find(bookName) != -1) {
    nameInput.classList.add('invalid');
    return false;
  }

  const totalPagesInput = document.getElementById('total-pages');
  const isRead = document.getElementById('add-isread').checked;

  if (!totalPagesInput.checkValidity() || isRead)
    return isValid;

  const pagesReadInput = document.getElementById('add-pages-read');

  const totalPages = +totalPagesInput.value;
  const pagesRead = +pagesReadInput.value;

  if (pagesRead > totalPages) {
    pagesReadInput.classList.add('invalid');
    return false;
  }

  return isValid;
}

function validateUpdateReadingForm(form) {
  if (!validateInputs(form))
    return false;

  const index = +updateReadingModal.dataset.index;
  const book = library.books[index];

  const pagesReadInput = document.getElementById('update-pages-read');
  const pagesRead = +pagesReadInput.value;

  if (pagesRead > book.pages) {
    pagesReadInput.classList.add('invalid');
    return false;
  }

  return true;
}

function openModal(modal) {
  document.body.classList.add('overlay-active');
  modal.classList.add('active');
  overlayContent.classList.add('active');
  changeOverlayMinHeight(modal);
}

function openAddBookModal() {
  openModal(addBookModal);
}

function openUpdateReadingModal(event) {
  if (event.target.className.includes('remove-card-button')) return;

  const bookName = event.currentTarget.querySelector('.book-title').innerText;
  const index = library.find(bookName);
  const book = library.books[index];

  updateReadingModal.dataset.index = index;
  updateReadingModal.querySelector('.name').innerText = bookName;
  updateReadingModal.querySelector('.author').innerText = book.author;
  updateReadingModalCheckbox.checked = book.isRead;
  document.getElementById('update-pages-read').disabled = book.isRead;

  openModal(updateReadingModal);
}

function openRemoveCardModal(event) {
  const bookName = event.target.parentNode.querySelector('.book-title').innerText;
  const index = library.find(bookName);

  removeBookModal.dataset.index = index;
  removeBookModal.querySelector('.book-name').innerText = bookName;

  openModal(removeBookModal)
}

function hideModal() {
  document.querySelectorAll('.active').forEach(element => element.classList.remove('active'));
}

function changeOverlayMinHeight(modal) {
  const modalHeight = modal.offsetHeight;
  styleTag.innerHTML = `#overlay-content {min-height: ${(modalHeight * 1.15).toFixed(1)}px}`
}

function hideOverlay(event) {
  if (event.target != this) return;

  const scale = this.getBoundingClientRect().width / this.offsetWidth;
  if (scale != 0) return;

  document.body.classList.remove('overlay-active');
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
  const modal = this;
  if (event.target != modal) return;

  const scale = modal.getBoundingClientRect().width / modal.offsetWidth;
  if (scale != 0) return;

  const inputs = modal.querySelectorAll('input:not([type="checkbox"])');
  inputs.forEach(input => {
    input.classList.remove('invalid');
    input.value = "";
  });

  modal.querySelector('[name="pages-read"]').disabled = false;
  const checkbox = modal.querySelector('input[type="checkbox"]');
  checkbox.checked = false;
}

function toggleEmptyMessge() {
  emptyLibraryMessage.classList.toggle('hidden');
  pagemeter.classList.toggle('hidden');
}

function setUpListeners() {
  inputFields.forEach(input => {
    input.addEventListener('focusout', () => !input.checkValidity() && input.classList.add('invalid'));
    input.addEventListener('input', () => input.checkValidity() && input.classList.remove('invalid'));
  });

  addBookButton.onclick = openAddBookModal;
  overlay.addEventListener('click', event => event.target === overlayContent && hideModal());

  document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('transitionend', hideOverlay));

  addBookModal.addEventListener('transitionend', resetInputValues);
  addBookModalCheckbox.addEventListener('input', toggleInput);

  updateReadingModal.addEventListener('transitionend', resetInputValues);
  updateReadingModalCheckbox.addEventListener('input', toggleInput);

  removeBookButtons.addEventListener('click', handleRemoveBook);

  document.addEventListener('submit', submitForm);
}

function setUpBooksGrid() {
  if (library.size === 0) return;

  toggleEmptyMessge();
  updatePagemeter();
  library.books.forEach(book => createBookCard(book));
}

function setUp() {
  setUpListeners();
  setUpBooksGrid();
}

document.addEventListener('DOMContentLoaded', setUp);

