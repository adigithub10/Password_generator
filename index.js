const inputslider = document.querySelector("#length_slider");
const lengthdisplay = document.querySelector(".lengthnum");
const passdisplay = document.querySelector("#password");
const copybtn = document.querySelector(".cpy_btn");
const copymsg = document.querySelector(".cpy_msg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const indicator_circle = document.querySelector(".indicator");
const generate_Btn = document.querySelector(".generate_btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "`~!@#$%^&*()-_=+[{]}|;:,<.>/?";

// default pass
let password = "";
let pass_len = 10;
let checkcount = 0;
handleSlider();

// Set strength indicator to grey initially
setIndicator("#ccc");

// Set password length
function handleSlider() {
  inputslider.value = pass_len;
  lengthdisplay.innerText = pass_len;
}

// Set indicator color
function setIndicator(color) {
  indicator_circle.style.backgroundColor = color;
}

// Generate a random integer between min and max (inclusive)
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random number
function generateRandomNumber() {
  return getRndInteger(0, 9);
}

// Generate a random uppercase letter
function generateUppercase() {
  return String.fromCharCode(getRndInteger(65, 90));
}

// Generate a random lowercase letter
function generateLowercase() {
  return String.fromCharCode(getRndInteger(97, 122));
}

// Generate a random symbol
function generateSymbol() {
  const randIndex = getRndInteger(0, symbols.length - 1);
  return symbols.charAt(randIndex);
}

// Shuffle the password using Fisher-Yates method
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// Calculate the strength of the password
function calcStrength() {
  let hasUpper = uppercaseCheck.checked;
  let hasLower = lowercaseCheck.checked;
  let hasNum = numbersCheck.checked;
  let hasSym = symbolsCheck.checked;

  if (hasUpper && hasLower && (hasNum || hasSym) && pass_len >= 8) {
    setIndicator("#0f0"); // Green
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && pass_len >= 6) {
    setIndicator("#ff0"); // Yellow
  } else {
    setIndicator("#f00"); // Red
  }
}

// Copy password to clipboard
async function copyPassword() {
  try {
    await navigator.clipboard.writeText(passdisplay.value);
    copymsg.innerText = "Copied";
  } catch (e) {
    copymsg.innerText = "Failed to copy";
  }
  copymsg.classList.add("active");
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

// Handle checkbox change
function handleCheckboxChange() {
  checkcount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkcount++;
  });
  if (pass_len < checkcount) {
    pass_len = checkcount;
    handleSlider();
  }
}

// Add event listeners to checkboxes
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

// Handle slider input
inputslider.addEventListener("input", (e) => {
  pass_len = e.target.value;
  handleSlider();
});

// Handle copy button click
copybtn.addEventListener("click", () => {
  if (passdisplay.value) copyPassword();
});

// Handle generate button click
generate_Btn.addEventListener("click", () => {
  if (checkcount <= 0) return;

  if (pass_len < checkcount) {
    pass_len = checkcount;
    handleSlider();
  }

  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUppercase);
  if (lowercaseCheck.checked) funcArr.push(generateLowercase);
  if (numbersCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  // Add required characters
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // Add remaining characters
  for (let i = 0; i < pass_len - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length - 1);
    password += funcArr[randIndex]();
  }

  // Shuffle the password
  password = shufflePassword(Array.from(password));

  // Display the password
  passdisplay.value = password;

  // Calculate the strength of the password
  calcStrength();
});
