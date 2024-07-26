function Validation(values) {
    let error = {};

    const username_pattern = /^[A-Za-z]\w{5,29}$/;
    const password_pattern = /^(?=.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    console.log('Validating:', values); 
    console.log(values.username[0]);

    if (values.username[0].trim() === "") {
        error.username = "Username should not be empty";
    } else if (!username_pattern.test(values.username)) {
        error.username = "Username did not match the pattern";
    }

    if (values.password[0].trim() === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit or special character";
    }

    console.log('Errors:', error); 

    return error;
}

export default Validation;