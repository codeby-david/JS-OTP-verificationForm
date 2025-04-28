const OTPinputs = document.querySelectorAll("input");
const button = document.querySelector("button");

window.addEventListener("load", () => OTPinputs[0].focus());

OTPinputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    const currentInput = e.target;
    const nextInput = currentInput.nextElementSibling;

    // Ensure only one digit is entered
    if (currentInput.value.length > 1) {
      currentInput.value = currentInput.value.slice(0, 1);
    }

    // Enable next input if available
    if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    // Check if all fields are filled
    const allFilled = Array.from(OTPinputs).every(input => input.value !== "");
    if (allFilled) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  input.addEventListener("keyup", (e) => {
    if (e.key === "Backspace") {
      if (input.previousElementSibling !== null && currentInput.value === "") {
        input.previousElementSibling.focus();
      }
    }
  });
});

button.addEventListener("click", (e) => {
  e.preventDefault();
  const otp = Array.from(OTPinputs).map(input => input.value).join("");
  if (otp.length === 4) {
    alert(`OTP Submitted: ${otp}`);
    // Here you would typically verify the OTP with your backend
  } else {
    alert("Please enter complete OTP");
  }
});