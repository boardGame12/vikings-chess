async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const email = document.getElementById('email').value;
    const user_name = document.getElementById("userName").value;
    const password = document.getElementById('pwd').value;
    const confirm_password = document.getElementById('reenter_password').value;

    const data = {
        "email": email,
        "user_name": user_name,
        "password": password,
        "confirm_password": confirm_password
    };

    try {
        const response = await fetch('v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let responseMessage;

        if (response.ok) {
            responseMessage = 'Registration successful:';
        } else {
            responseMessage = 'Registration failed:';
        }

        try {
            const responseData = await response.json();
            if (responseData && responseData.message) {
                responseMessage += ' ' + responseData.message;
            }
        } catch (error) {}

        console.log(responseMessage);
        document.getElementById('registerAnnounce').textContent = responseMessage;

    } catch (error) {
        console.error('Error occurred during registration:', error);
        document.getElementById('registerAnnounce').textContent = 'Error occurred during registration: ' + error.message;
    }
}

function fetchUserNameAndUpdate() {
    // Make a GET request to fetch the user_name after successful login
    fetch("v1/user")
        .then(response => {
            // Check if the response is OK (status code 200)
            if (response.ok) {
                // Parse the JSON response
                return response.json();
            } else {
                // If response is not OK, throw an error
                throw new Error("Failed to fetch user data");
            }
        })
        .then(data => {
            // Extract the user_name from the response data
            const userName = data.user_name;
            // Check if username exists
            if (userName) {
                // Update the UI with the user_name
                console.log("User Name:", userName);
                document.getElementById("usernameDisplay").textContent = userName;
            } else {
                console.log("No user name found");
            }
        })
        .catch(error => {
            // Log any errors that occur during the process
            console.error("Error:", error.message);
        });
  }
  
  window.onload = function() {
    fetchUserNameAndUpdate();
  };

  document.addEventListener("DOMContentLoaded", function() {
    var logoutButton = document.querySelector(".logout");
    logoutButton.addEventListener("click", function() {
     
      logout();
    });
  });
  
  
      function logout() {
      fetch('v1/auth/logout', {
          method: 'GET',
          credentials: 'same-origin', // include cookies in the request if any
      })
      .then(response => {
          if (response.ok) {
            document.getElementById("usernameDisplay").textContent = "";
              // If logout was successful, redirect to the login page or perform any other action
              console.log("logged out successfully")
          } else {
              console.error('Logout failed');
          }
      })
      .catch(error => {
          // Handle network errors
          console.error('Network error:', error);
      });
  }
  

const registerButton = document.getElementById("registerBtn");
registerButton.addEventListener('click', registerUser);
