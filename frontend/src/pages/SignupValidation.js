function Validation(values) {
    let error = {};
    const username_pattern = /^[A-Za-z]\w{5,29}$/;
    const password_pattern = /^(?=.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    if (values.firstname.trim() === "") {
        error.firstname = "First Name should not be empty";
    } else {
        error.firstname = "";
    }
    if (values.lastname.trim() === "") {
        error.lastname = "Last Name should not be empty";
    } else {
        error.lastname = "";
    }

    if (values.username.trim() === "") {
        error.username = "Username should not be empty";
    } else if (!username_pattern.test(values.username)) {
        error.username = "Username did not match the pattern";
    } else {
        error.username = "";
    }

    if (values.password.trim() === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit or special character";
    } else {
        error.password = "";
    }

    
    if (values.education === "") {
        error.education= "Please select an option from the dropdown";
    } else {
        error.education = "";
    }

    if (values.academic === "") {
        error.academic = "Please select an option from the dropdown";
    } else {
        error.academic = "";
    }

   
    if (!values.gender) {
        error.gender = "Please select one of the options";
    } else {
        error.gender = "";
    }

    return error;
}

export default Validation;
