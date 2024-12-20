// Function to open a modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Function to close a modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Reset forms and messages when closing
    if (modalId === 'forgotPasswordModal') {
        document.getElementById('forgotPasswordForm').reset();
        document.getElementById('otpInputContainer').style.display = 'none';
        const sendOtpButton = document.getElementById('sendOtpButton');
        sendOtpButton.textContent = 'Send OTP';
        sendOtpButton.onclick = sendOtpHandler;
    } else if (modalId === 'resetPasswordModal') {
        document.getElementById('resetPasswordForm').reset();
        document.getElementById('passwordMessage').textContent = '';
    }
}

// Function to toggle password visibility
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const passwordToggleButton = document.querySelector('.password-toggle img');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordToggleButton.src = 'https://cdn.builder.io/api/v1/image/assets/TEMP/576cce65a6f5a54005d0c024121ec174dd368897178c9898196255f404df8f5f?placeholderIfAbsent=true&apiKey=e9d236d8c0c94057ac283d5229bb03b9'; // Eye Opened icon
    } else {
        passwordField.type = 'password';
        passwordToggleButton.src = "https://cdn.builder.io/api/v1/image/assets/TEMP/482a3c01cbff113ec02eb181752319c28b143aad3dd3547789a587c4e45bbfe3?placeholderIfAbsent=true&apiKey=e9d236d8c0c94057ac283d5229bb03b9";
    }
}

// Function to fetch CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Initialize Supabase client globally
const supabaseUrl = 'https://sodghnhticinsggmbber.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log('Supabase client successfully created:', supabaseClient);

// Handle Auth State Changes
supabaseClient.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state changed:", event, session);
    
    if (event === "SIGNED_IN" && session) {
        console.log("User signed in successfully. Sending token to backend...");
        const accessToken = session.access_token;

        try {
            const response = await fetch("/verify-token/", { // Ensure this URL is correctly mapped in Django
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify({ token: accessToken }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log("Backend verification successful.");
                    window.location.href = data.redirect_url; // Redirect to your protected page
                } else {
                    console.error("Backend verification failed:", data);
                    alert("Authentication failed on the server.");
                }
            } else {
                const errorData = await response.json();
                console.error("Backend verification failed:", errorData);
                alert("Authentication failed on the server.");
            }
        } catch (error) {
            console.error("Error sending token to backend:", error);
            alert("An error occurred while communicating with the server.");
        }
    } else if (event === "SIGNED_OUT") {
        console.log("User signed out.");
    }
});

// Check session on page load
function checkSession() {
    const sessionid = getCookie('sessionid'); // Django's default session cookie name

    if (sessionid) {
        console.log("Session exists. Redirecting to profile page...");
        window.location.href = '/profile/'; 
    }
}

window.onload = function() {
    checkSession();
};

// Handle Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form's default submission behavior

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch("/login/", { // Ensure this URL is correctly mapped in Django
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect_url;
        } else if (data.error) {
            alert(data.error);
        } else {
            alert("An error occurred. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
    });
});

// Handle Google Login
document.getElementById("google-login-btn").onclick = async () => {
    try {
        console.log("Google login initiated...");

        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin, // Ensure proper redirect after login
            },
        });

        if (error) {
            console.error("Error during Google login:", error.message);
            alert("Google login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during Google login:", error);
        alert("An error occurred. Please try again.");
    }
};

// Function to handle sending OTP
function sendOtpHandler() {
    const email = document.getElementById('forgotEmail').value;

    if (email === '') {
        alert('Please enter your email address.');
        return;
    }

    // Send OTP to backend
    fetch('/forget-password/', { // Ensure this URL is correctly mapped in Django
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ email: email }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('OTP has been sent to ' + email);
            // Show the OTP input container
            const otpInputContainer = document.getElementById('otpInputContainer');
            otpInputContainer.style.display = 'block'; // Make OTP box visible

            // Update the button text to "Verify OTP"
            const sendOtpButton = document.getElementById('sendOtpButton');
            sendOtpButton.textContent = 'Verify OTP';
            sendOtpButton.onclick = verifyOtpHandler;
        } else {
            // To prevent email enumeration, show generic message
            alert('If the email exists, an OTP has been sent.');
            // Optionally, hide the modal
            closeModal('forgotPasswordModal');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while sending OTP. Please try again.");
    });
}

// Function to handle verifying OTP
function verifyOtpHandler() {
    const email = document.getElementById('forgotEmail').value;
    const otp = document.getElementById('otp').value;
    
    if (otp === '') {
        alert('Please enter the OTP.');
        return;
    }

    // Verify OTP with backend
    fetch('/verify-otp/', { // Ensure this URL is correctly mapped in Django
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ email: email, otp: otp }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('OTP verified successfully!');
            closeModal('forgotPasswordModal'); // Close the modal after verification
            // Open the reset password modal
            openModal('resetPasswordModal');
        } else {
            // Show error message
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while verifying OTP. Please try again.");
    });
}

// Function to handle resetting the password
function resetPasswordHandler() {
    const email = document.getElementById('forgotEmail').value;
    const otp = document.getElementById('otp').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordMessage = document.getElementById('passwordMessage');

    if (!newPassword || !confirmPassword) {
        passwordMessage.style.color = 'red';
        passwordMessage.textContent = 'Please fill in both fields.';
        return;
    }

    if (newPassword.length < 8) {
        passwordMessage.style.color = 'red';
        passwordMessage.textContent = 'Password must be at least 8 characters long.';
        return;
    }

    if (newPassword !== confirmPassword) {
        passwordMessage.style.color = 'red';
        passwordMessage.textContent = 'Passwords do not match.';
        return;
    }

    // Reset password via backend
    fetch('/reset-password/', { // Ensure this URL is correctly mapped in Django
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            email: email,
            otp: otp,
            new_password: newPassword,
            confirm_password: confirmPassword,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            passwordMessage.style.color = 'green';
            passwordMessage.textContent = 'Password successfully reset!';
            // Optionally, close the modal after a short delay
            setTimeout(() => {
                closeModal('resetPasswordModal');
                alert('Your password has been reset. Please log in with your new password.');
                window.location.href = '/login/'; // Redirect to login page
            }, 2000);
        } else {
            passwordMessage.style.color = 'red';
            passwordMessage.textContent = data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        passwordMessage.style.color = 'red';
        passwordMessage.textContent = 'An error occurred while resetting your password.';
    });
}
