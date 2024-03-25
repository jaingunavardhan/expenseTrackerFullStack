function loginClicked(event)
{
    event.preventDefault();
    const loginDiv = document.getElementById('login-div');
    console.log(loginDiv.lastChild)
    loginDiv.lastElementChild.innerHTML = '';

    const loginUser = {
        email: event.target.email.value,
        password: event.target.password.value
    }
    console.log("loginUser...", loginUser);
    axios.post('http://localhost:4000/login', loginUser)
        .then(loggedUser=>{
            console.log("AXIOS done...", loggedUser.data);
            loginDiv.lastElementChild.innerHTML = loggedUser.data.toString();
        })
        .catch(error=>console.log(error));
}