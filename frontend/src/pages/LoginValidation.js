function Validation(values){

    let error ={}
    const username_pattern = "^[A-Za-z]\\w{5, 29}$"
    const password_pattern = "(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"

    if (values.username === ""){
        error.username = "Username should not be empty"
    }
    else if(!username_pattern.test(values.username)){
        error.username = "Username did not match"
    }else{
        error.username = ""
    }
    if (values.password === ""){
        error.password = "Password should not be empty"
    }
    else if(!password_pattern.test(values.password)){
        error.password = "Password did not match"
    }else{
        error.password = ""
    }
    return error;
}

export default Validation;