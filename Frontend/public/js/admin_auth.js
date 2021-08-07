console.log('Checking if user is authorised.');

const baseUrl = 'http://44.195.161.226:5000';
const userId = localStorage.getItem('user_id');
if (userId) {
    axios.get(`${baseUrl}/api/user/${userId}`, {
        headers: { user: userId }
    }).then(response => {
        const data = response.data;
        if (data.userdata) {
            if (data.userdata.role_id === 2) {
                console.log('User is not an administrator.');
                alert('You do not have access to view this page.');
                // Redirect to the home page
                window.location.href = '/user/manage_submission.html';
            }
        } else {
            console.error('No user details were returned.');
            alert('Could not retrieve user details. Please try again later.');
            // Redirect to the home page
            window.location.href = '/';
        }
    }, error => {
        console.error('An error occurred while attempting to retrieve the user details:', error);
        alert('Could not retrieve user details. Please try again later.');
        // Redirect to the home page
        window.location.href = '/';
    });
} else {
    // Not logged in

    // We are using alert instead of Noty as the Noty UI may not appear in the
    // process of being redirected.
    alert('Please login to access this page.');
    // Redirect to the login page
    window.location.href = '/login.html';
}
