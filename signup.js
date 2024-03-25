function signupClicked(event)
{
    event.preventDefault();
    const signupDiv = document.getElementById('signup-div');
    console.log(signupDiv.lastChild)
    signupDiv.lastElementChild.innerHTML = '';

    const newUser = {
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value
    }
    console.log("newUser...", newUser);
    axios.post('http://localhost:4000/users/signup', newUser)
        .then(createdUser=>{
            console.log("AXIOS done...", createdUser.data);
            signupDiv.lastElementChild.innerHTML = createdUser.data.toString();
        })
        .catch(error=>console.log(error));
}