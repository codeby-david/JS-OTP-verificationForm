const OTPinputs = document.querySelectorAll("input");
const button = document.querySelector("button");
const resendBtn = document.getElementById("resend-btn");
let canResend = true;
let resendTimeout;

// Initialize first input
window.addEventListener("load", () => OTPinputs[0].focus());

// Handle OTP input
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
    checkOTPCompletion();
  });

  input.addEventListener("keyup", (e) => {
    if (e.key === "Backspace") {
      const prevInput = input.previousElementSibling;
      if (prevInput && input.value === "") {
        prevInput.focus();
      }
    }
  });
});

// Verify OTP
button.addEventListener("click", async (e) => {
  e.preventDefault();
  const otp = Array.from(OTPinputs).map(input => input.value).join("");
  
  if (otp.length !== 4) {
    alert("Please enter complete OTP");
    return;
  }

  // Show loading state
  button.disabled = true;
  button.innerHTML = '<div class="spinner"></div> Verifying...';
  
  try {
    // Simulate API call (replace with actual fetch in production)
    const isValid = await verifyOTP(otp);
    
    if (isValid) {
      alert("OTP Verified Successfully!");
      // Redirect or show success message
      window.location.href = "/dashboard.html"; // Example redirect
    } else {
      alert("Invalid OTP. Please try again.");
      resetOTPInputs();
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  } finally {
    button.disabled = false;
    button.textContent = "Verify OTP";
  }
});

// Resend OTP
resendBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  
  if (!canResend) {
    alert(`Please wait ${Math.ceil(getRemainingResendTime()/1000)} seconds before resending`);
    return;
  }
  
  try {
    // Simulate API call (replace with actual fetch in production)
    await sendOTP();
    startResendTimer();
    alert("New OTP sent successfully!");
  } catch (error) {
    console.error("Error resending OTP:", error);
    alert("Failed to resend OTP. Please try again.");
  }
});

// Helper functions
function checkOTPCompletion() {
  const allFilled = Array.from(OTPinputs).every(input => input.value !== "");
  button.classList.toggle("active", allFilled);
}

function resetOTPInputs() {
  OTPinputs.forEach((input, index) => {
    input.value = "";
    if (index > 0) input.setAttribute("disabled", true);
  });
  OTPinputs[0].focus();
  button.classList.remove("active");
}

function startResendTimer() {
  canResend = false;
  const cooldown = 30000; // 30 seconds
  
  resendBtn.style.color = "#999";
  resendBtn.style.cursor = "not-allowed";
  
  resendTimeout = setTimeout(() => {
    canResend = true;
    resendBtn.style.color = "";
    resendBtn.style.cursor = "";
  }, cooldown);
}

function getRemainingResendTime() {
  if (!resendTimeout) return 0;
  return setTimeout._idleStart + setTimeout._idleTimeout - Date.now();
}

// Mock API functions (replace with actual fetch calls)
async function sendOTP() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("OTP sent to user");
      resolve();
    }, 1000);
  });
}

async function verifyOTP(otp) {
  return new Promise(resolve => {
    setTimeout(() => {
      // In a real app, this would check against your backend
      resolve(otp === "1234"); // Demo: accepts 1234 as valid OTP
    }, 1500);
  });
}