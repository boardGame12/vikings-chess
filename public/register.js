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
        const response = await fetch('/v1/auth/register', {
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

const registerButton = document.getElementById("registerBtn");
registerButton.addEventListener('click', registerUser);
