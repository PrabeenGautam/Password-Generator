const password = document.querySelector(".password");
const copyIcons = document.querySelector(".icons");
const count = document.querySelector(".count");
const generateBtn = document.querySelector(".buttons");
const slider = document.querySelector("input[type='range']");
const checkboxes = document.querySelectorAll("input[type='checkbox']");
const checkboxContainer = document.querySelector(".checkboxs");
const error = document.querySelector(".error");
const bar = document.querySelectorAll(".bar");
const category = document.querySelector(".category");

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcderghijklmnopqrstuvwxyz";
const number = "1234567890";
const chars = "!@#$%^&*()+_";
const checkedList = [0, 0, 0, 0];
const characterList = [uppercase, lowercase, number, chars];

const counter = function (array) {
  let count = 0;
  array.forEach((value) => value === 1 && count++);
  return count;
};

class PasswordGenerator {
  constructor() {
    this.passLength = 8;
    this.generatedString = "";
  }

  set passwordLength(length) {
    this.passLength = length;
  }

  get passwordLength() {
    return this.passLength;
  }

  generateCustom(char, count) {
    let string = "";
    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * char.length);
      string += char[value];
    }
    return string;
  }

  generate() {
    const count = counter(checkedList);
    const perChar = Math.floor(this.passLength / count);
    const remainChar = this.passLength - perChar * count;

    let generatedString = "";
    let randomFinalString = "";

    checkedList.forEach((list, index) => {
      if (list === 1 && index === 0) {
        generatedString += this.generateCustom(
          characterList[index],
          perChar + remainChar
        );
      }

      if (list === 1 && index !== 0) {
        generatedString += this.generateCustom(characterList[index], perChar);
      }
    });

    let length = generatedString.length;
    const arrayGenerate = generatedString.split("");

    for (let i = 0; i < generatedString.length; i++) {
      const index = Math.floor(Math.random() * length);
      randomFinalString += arrayGenerate[index];
      arrayGenerate.splice(index, 1);
      length--;
    }

    this.generatedString = randomFinalString;
  }
}

const generator = new PasswordGenerator();
generator.passLength = Number(slider.value);
count.textContent = slider.value;

slider.addEventListener("input", function () {
  generator.passLength = Number(this.value);
  count.textContent = generator.passwordLength;
});

generateBtn.addEventListener("click", function (e) {
  checkboxes.forEach((checkbox, index) =>
    checkbox.checked ? (checkedList[index] = 1) : (checkedList[index] = 0)
  );

  error.classList.toggle("hidden", !checkedList.every((value) => value === 0));
  if (!error.classList.contains("hidden")) return;
  generator.generate();
  password.textContent = generator.generatedString;

  const strengthValue = calculateStength(generator.generatedString);
  category.textContent = strengthValue.label;

  bar.forEach((b) => b.classList.remove("active"));

  for (let i = 0; i < strengthValue.index; i++) {
    bar[i].classList.add("active");
  }
});

const calculateStength = function (string) {
  const count = counter(checkedList);
  if (count === 1) return { index: 1, label: "Weak" };
  if (count === 2) return { index: 2, label: "Medium" };
  if (count === 3) return { index: 3, label: "Strong" };
  if (count === 4) return { index: 4, label: "Super Strong" };
};

copyIcons.addEventListener("click", function (e) {
  navigator.clipboard.writeText(password.textContent);
});
