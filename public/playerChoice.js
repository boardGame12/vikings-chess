
  let popup = document.querySelector("#popupForm");
  let openBtn = document.querySelector("#openPopupBtn");
  let closeBtn = document.querySelector("#closePopupBtn");

  openBtn.onclick = function() {
    popup.style.display = "block";
  }
  closeBtn.onclick = function() {
    popup.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == popup) {
      popup.style.display = "none";
    }
  }

  // Add event listener for form submission
  document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get email and password from form inputs
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Data to be sent in the POST request
    const data = {
      email: email,
      password: password
    };

    try {
      // Send POST request to /v1/auth/login
      const response = await fetch("/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Handle successful login
        console.log("Login successful");
        // You can redirect the user or perform other actions here
      } else {
        // Handle failed login
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error during login:", error);
    }
  });