
// GET LOGIN ELEMENTS
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");
const takeoffOverlay = document.getElementById("takeoffOverlay");

// DEMO LOGIN CREDENTIALS
const DEMO_EMAIL = "admin@airport.com";
const DEMO_PASSWORD = "123";

// SHOW / HIDE PASSWORD
togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "◎";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "◉";
    }

});

// LOGIN FORM
loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // CHECK LOGIN DETAILS
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {

        alert("Login successful! Welcome to Airport Ops.");

        
takeoffOverlay.classList.add("active");

const plane = document.querySelector(".takeoff-plane");

function checkPlanePosition() {

    const planeRect = plane.getBoundingClientRect();

    // Actual centre of the plane
    const planeCenter = planeRect.left + planeRect.width / 2;

    // Centre of the screen
    const screenCenter = window.innerWidth / 2;

    if (planeCenter <= screenCenter) {

        // Stop checking and open dashboard
        window.location.href = "index.html";

        return;
    }

    requestAnimationFrame(checkPlanePosition);
}

// Start tracking the plane
requestAnimationFrame(checkPlanePosition);


setTimeout(function () {
    window.location.href = "index.html";
}, 2800);

    } else {

        alert("Invalid email or password. Please try again.");

    }

});
