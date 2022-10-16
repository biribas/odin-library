const addButton = document.querySelector(".add-book-button");
const inputs = document.querySelectorAll("input");

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
}


document.addEventListener("DOMContentLoaded", main)
