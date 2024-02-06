async function registerUser() {
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

        if (response.ok) {
            
            const responseData = await response.json();
            console.log('Registration successful:', responseData);
           
        } else {
            
            let errorMessage = 'Registration failed: ' + response.statusText;
            
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage += ' - ' + errorData.message;
                }
            } catch (error) {
                
            }
            console.error(errorMessage);
            
        }
    } catch (error) {
        console.error('Error occurred during registration:', error);
    }
}

const registerButton = document.getElementById("registerBtn");
registerButton.addEventListener('click', registerUser);
