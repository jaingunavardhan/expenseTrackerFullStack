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
    localStorage.clear();
    const loginDiv = document.getElementById('login-div');
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
            localStorage.setItem('ispremiumuser', loggedUser.data.ispremiumuser);
            window.location.href = "expenses.html";
        })
        .catch(error=>{
            console.log("Error page...", error.response);
            loginDiv.lastElementChild.innerHTML = error.response.data.toString();
        })
}



function checkPremiumUser()
{
    console.log("button loaded...", typeof localStorage.getItem('ispremiumuser'));
    if(localStorage.getItem('ispremiumuser') == 'true')
    {
        document.getElementById('premium-button').style.display = 'none';

        const premium_msg = document.getElementById('premium-message');
        premium_msg.innerHTML = "You are now a premium user";
        premium_msg.style.color = "blue";
        premium_msg.style.fontSize = '13pt'

        const leaderboardButton = document.createElement('button');
        leaderboardButton.innerHTML = "Show Leaderboard";
        leaderboardButton.setAttribute('id', 'leaderboard-button');
        leaderboardButton.onclick = (event)=>{
            showLeaderboard();
        }
        document.getElementById('form-div').appendChild(leaderboardButton);
    }
}


function showLeaderboard()
{
    console.log("Inside Leaderboard show....")
    axios.get('http://localhost:4000/premium/getLeaderboard', {headers:{'token':localStorage.getItem('token')}})
        .then(response=>{
            const leadersList = response.data;
            console.log(leadersList)
            for(var i=0; i<leadersList.length; i++)
            {
                showLeader(leadersList[i]);
            }
            const h2 = document.createElement('h2');
            h2.innerHTML = "Leaderboard";

            const ulList = document.getElementById('leaderboard-list');
            document.getElementById('leaderboard-div').insertBefore(h2, ulList);
        })
}

function showLeader(leader)
{
    const ulList = document.getElementById('leaderboard-list');

    const listItem = document.createElement('li');
    listItem.innerHTML = ` <h3>${leader.username} - Total Expenses: ${leader.total_expenses} </h3>`;

    ulList.appendChild(listItem);    
}


function showExpenses(checkPremiumUser)
{
    console.log("loaded window...");
    checkPremiumUser();
    axios.get('http://localhost:4000/expenses/', { headers: {'token' : localStorage.getItem('token')} })
        .then(result=>{
            const existingExpenses = result.data;
            for(var i=0; i<existingExpenses.length; i++)
            {
                showExpense(existingExpenses[i]);
            }
        })
        .catch(error=>{
            console.log("Error...",error);
            alert("Please Login to proceed..")
            window.location.href = 'login.html';
        });
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

async function purchaseMembershipClicked(event)
{
    console.log("Client pruchase clicked....");
    const response = await axios.get('http://localhost:4000/purchase/purchaseMembership', {
        headers:{'token':localStorage.getItem('token')}});
    console.log("response from server...", response.data);
    const options = {
        "key":response.data.key_id,
        "order_id": response.data.createdOrder.order_id,
        "handler": async function(rzp_success){
            console.log("handler function - success...",rzp_success);
            const success_prom = await axios.post('http://localhost:4000/purchase/updateTransactionStatus',{
                order_id : rzp_success.razorpay_order_id,
                payment_id: rzp_success.razorpay_payment_id,
                status:"SUCCESS"
            }, {headers:{'token':localStorage.getItem('token')}});

            localStorage.setItem('ispremiumuser', success_prom.data.ispremiumuser);
            checkPremiumUser();
            alert("Payment Successful.. You are a premium member now!!!")
        }
    }

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', async function(rzp_failure){
        console.log(rzp_failure);
        await axios.post('http://localhost:4000/purchase/updateTransactionStatus', {
            order_id: rzp_failure.error.metadata.order_id,
            payment_id: rzp_failure.error.metadata.payment_id,
            status: "FAILED"
        }, {headers:{'token':localStorage.getItem('token')}} );
        alert("Payment failed, Please try again...");
    })   
}
