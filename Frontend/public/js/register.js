let $registerFormContainer = $('#registerFormContainer');
if ($registerFormContainer.length != 0) {
    console.log('Registration form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'http://44.195.161.226:5000';
        let fullName = $('#fullNameInput').val();
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();
        let webFormData = new FormData();
        webFormData.append('fullName', fullName);
        webFormData.append('email', email);
        webFormData.append('password', password);
        axios({
                method: 'post',
                url: baseUrl + '/api/user/register',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {
                //Handle success
                console.dir(response);
                new Noty({
                    type: 'success',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'bootstrap-v4',
                    text: 'You have registered. Please <a href="login.html" class=" class="btn btn-default btn-sm" >Login</a>',
                }).show();
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    timeout: '6000',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to register.',
                }).show();
            });
    });

} //End of checking for $registerFormContainer jQuery object

$('#passwordInput').on('input', (event) => {
    const fullName = $('#fullNameInput').val();
    const email = $('#emailInput').val();
    const pwdStrength = zxcvbn(event.target.value,
        ['Design', 'Competition', 'Design Competition', fullName, email]);

    const pwdScoreResultEl = $('#passwordScoreResult');
    const pwdScoreProgressBarEl = $('#passwordScoreProgressBar');
    const pwdSuggestionsResultEl = $('#passwordSuggestionsResult');
    const pwdWarningsResultEl = $('#passwordWarningsResult');
    if (event.target.value.length == 0) {
        pwdScoreResultEl.text('(Please enter your password to view the score)');
        pwdScoreProgressBarEl.css('width', '0');
        pwdScoreProgressBarEl.attr('aria-valuenow', '0');
        pwdWarningsResultEl.text('(Please enter your password to view warnings)');
        pwdSuggestionsResultEl.text('(Please enter your password to view suggestions)');
    } else {
        if (pwdStrength) {
            if ('score' in pwdStrength) {
                pwdScoreResultEl.text(`Score: ${pwdStrength.score + 1} | Guesses needed: ${pwdStrength.guesses}`);

                // Progress-bar
                pwdScoreProgressBarEl.css('width', `${(pwdStrength.score + 1) / 5 * 100}%`);
                pwdScoreProgressBarEl.attr('aria-valuenow', `${(pwdStrength.score + 1) / 5 * 100}`);
                switch (pwdStrength.score) {
                    case 0:
                    case 1:
                        // Dangerous scores
                        pwdScoreProgressBarEl.removeClass('bg-success');
                        pwdScoreProgressBarEl.removeClass('bg-warning');
                        pwdScoreProgressBarEl.addClass('bg-danger');
                        break;
                    case 2:
                        // Ok scores
                        pwdScoreProgressBarEl.removeClass('bg-success');
                        pwdScoreProgressBarEl.addClass('bg-warning');
                        pwdScoreProgressBarEl.removeClass('bg-danger');
                        break;
                    case 3:
                    case 4:
                        // Great scores
                        pwdScoreProgressBarEl.addClass('bg-success');
                        pwdScoreProgressBarEl.removeClass('bg-warning');
                        pwdScoreProgressBarEl.removeClass('bg-danger');
                        break;

                }
            }

            if ('feedback' in pwdStrength) {
                const pwdFeedback = pwdStrength.feedback;
                if (Array.isArray(pwdFeedback.suggestions)) {
                    if (pwdFeedback.suggestions.length > 0) {
                        pwdSuggestionsResultEl.text(pwdFeedback.suggestions.join('\n- '));
                    } else {
                        pwdSuggestionsResultEl.text('(No suggestions)');
                    }
                }
                if ('warning' in pwdFeedback) {
                    pwdWarningsResultEl.text(pwdFeedback.warning || 'Your password looks good!');
                }
            }
        }
    }
});
