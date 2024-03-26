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
        .catch(error=>{
            console.log("AXIOS fail...", error.response.data);
            signupDiv.lastElementChild.innerHTML = error.response.data.toString();
            console.log(error);
        })
}



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
    axios.post('http://localhost:4000/users/login', loginUser)
        .then(loggedUser=>{
            console.log("AXIOS done...", loggedUser);
            localStorage.setItem('token', loggedUser.data.token);
            //window.location.href = 'C:/Users/jaing/Sharpener/expenseTrackerComplete/frontend/html/expenses.html';
            window.location.href = "expenses.html";
        })
        .catch(error=>{
            console.log("Error page...", error.response);
            loginDiv.lastElementChild.innerHTML = error.response.data.toString();
        })
}




function showExpenses()
{
    console.log("loaded window...")
    axios.get('http://localhost:4000/expenses/', { headers: {'token' : localStorage.getItem('token')} })
        .then(result=>{
            const existingExpenses = result.data;
            for(var i=0; i<existingExpenses.length; i++)
            {
                showExpense(existingExpenses[i]);
            }
        })
        .catch(error=>console.log(error));
}

function showExpense(newExpense)
{
    const ulList = document.getElementById('expenses-list');

    const listItem = document.createElement('li');
    listItem.setAttribute('name', 'id');
    listItem.setAttribute('value', newExpense.id);

    const div_one = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.innerHTML = `${newExpense.category} - ${newExpense.amount}`;

        const p = document.createElement('p');
        p.innerHTML = `${newExpense.description}`;
    div_one.appendChild(h3);
    div_one.appendChild(p);

    const div_two = document.createElement('div');
        const delete_btn = document.createElement('button');
        delete_btn.setAttribute('id', 'delete-btn');
        delete_btn.innerHTML = "Delete Expense";
        delete_btn.onclick = (event)=>{
            const expenseId = newExpense.id;
            axios.delete(`http://localhost:4000/expenses/${expenseId}`, { headers:{'token':localStorage.getItem('token')}})
                .then(result=>{
                    ulList.removeChild(listItem);
                })
        }
    div_two.appendChild(delete_btn);

    listItem.appendChild(div_one);
    listItem.appendChild(div_two);

    ulList.appendChild(listItem);
}

function addExpenseClicked(event)
{
    event.preventDefault();

    const newExpense = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
    }

    axios.post('http://localhost:4000/expenses/', newExpense, {headers:{'token':localStorage.getItem('token')}})
        .then(result=>{
            const createdExpense = result.data;
            showExpense(createdExpense)
        })
        .catch(error=>console.log(error));
}