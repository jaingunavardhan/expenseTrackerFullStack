async function signupClicked(event)
{
    try{
        event.preventDefault();
        const message = document.getElementById('message');
        message.innerHTML = '';
    
        const newUser = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value
        }
        const createdUser = await axios.post('http://localhost:4000/users/signup', newUser)
        message.innerHTML = createdUser.data.toString();
    }
    catch(error)
    {
        console.log("errro...",error);
        if(error.message == 'Network Error')
            alert("Network Error... Please try again");
        else
        {
            message.innerHTML = error.response.data.toString();
        }
    }
}

async function loginClicked(event)
{
    try{
        event.preventDefault();
        localStorage.clear();
        const message = document.getElementById('message');
        message.innerHTML = '';
    
        const loginUser = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        const tokenData = await axios.post('http://localhost:4000/users/login', loginUser)
        localStorage.setItem('token', tokenData.data.token);
        window.location.href = "expenses.html";
    }
    catch(error)
    {
        console.log("errro...",error);
        if(error.message == 'Network Error')
            alert("Network Error... Please try again");
        else
        {
            message.innerHTML = error.response.data.toString();
        }
    } 
}


function decodeJWT(token)
{
    if(!token)
    {
        alert("Please Login to fetch data..")
        window.location.href = 'login.html';
    }
    const base64Url = token.split('.')[1];
    const user = window.atob(base64Url);
    //console.log(window.btoa(user)); //Used to encode
    return JSON.parse(user);
}


function checkPremiumUser()
{
    const user = decodeJWT(localStorage.getItem('token'));
    if(user.ispremiumuser == true)
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

        const reports = document.createElement('button');
        reports.innerHTML = 'Reports';
        reports.setAttribute('id', 'report-button');
        reports.onclick = (event)=>{
            window.location.href = 'reports.html';
        }

        document.getElementById('form-div').appendChild(leaderboardButton);
        document.getElementById('form-div').appendChild(reports);
    }
}


async function showExpenses(checkPremiumUser)
{
    try{
        checkPremiumUser();
        const result = await axios.get('http://localhost:4000/expenses/', { headers: {'token' : localStorage.getItem('token')} })
        const existingExpenses = result.data;
        for(var i=0; i<existingExpenses.length; i++)
        {
            showExpense(existingExpenses[i]);
        }
    }  
    catch(error)
    {
        if(error.message = 'Network Error')
            alert("Network Error... Please try again");
        else if(error.response.status == 401)
        {
            alert("Please Login to fetch data..")
            window.location.href = 'login.html';                
        }
        else
            alert("Unable to fetch data, please try again...");      
    }
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
        delete_btn.onclick = async (event)=>{
            try{
                const expenseId = newExpense.id;
                await axios.delete(`http://localhost:4000/expenses/${expenseId}`,
                                                { headers:{'token':localStorage.getItem('token')}})
                ulList.removeChild(listItem);
            }
            catch(error)
            {
                alert("Unable to fetch data, please try again...");                     
            }
        }
    div_two.appendChild(delete_btn);

    listItem.appendChild(div_one);
    listItem.appendChild(div_two);

    ulList.appendChild(listItem);
}

async function addExpenseClicked(event)
{
    event.preventDefault();
    const newExpense = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
    }

    try{
        const result = await axios.post(
            'http://localhost:4000/expenses/',
            newExpense,
            { headers:{'token':localStorage.getItem('token')} }
        )
        const createdExpense = result.data;
        showExpense(createdExpense)
    }
    catch(error)
    {
        alert("Something went wrong... Please try again");
    }
}

async function purchaseMembershipClicked(event)
{
    const response = await axios.get('http://localhost:4000/purchase/purchaseMembership', {
        headers:{'token':localStorage.getItem('token')}});
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

            localStorage.setItem('token', success_prom.data.token);
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



async function forgotSubmitted(event)
{
    event.preventDefault();
    const errorMsg = document.getElementById('error-msg');
    errorMsg.innerHTML = '';
    try{
        const result = await axios.post('http://localhost:4000/password/forgotpassword', {email:event.target.email.value})
        errorMsg.innerHTML = result.data.toString();
    }
    catch(error)
    {
        console.log("errro...",error);
        if(error.message == 'Network Error')
            alert("Network Error... Please try again");
        else
            errorMsg.innerHTML = error.response.data.toString();
    } 
}



//******************************************************************** */
//PREMIUM USER FUNCTIONALITY
/********************************************************************* */

async function showLeaderboard()
{
    console.log("Inside Leaderboard show....")
    const ulList = document.getElementById('leaderboard-list');
    ulList.innerHTML='';
    const h2 = document.getElementById('leaderboard-h2');
    h2.innerHTML = '';
    try{
        const response = await axios.get('http://localhost:4000/premium/getLeaderboard',
                                        {headers:{'token':localStorage.getItem('token')}});
        const leadersList = response.data;
        for(var i=0; i<leadersList.length; i++)
        {
            showLeader(leadersList[i]);
        }
        h2.innerHTML = "Leaderboard";
    
        document.getElementById('leaderboard-div').insertBefore(h2, ulList);
    }
    catch(error)
    {
        alert("Something went wrong... Please try again");
    }  
}

function showLeader(leader)
{
    const ulList = document.getElementById('leaderboard-list');

    const listItem = document.createElement('li');
    listItem.innerHTML = ` <h3>${leader.username} - Total Expenses: ${leader.total_expenses} </h3>`;

    ulList.appendChild(listItem);    
}


async function showAllLinks()
{
    const user = decodeJWT(localStorage.getItem('token'));
    if(user.ispremiumuser == true)
    {
        try{
            const result = await axios.get('http://localhost:4000/download/old',
                                        {headers:{'token':localStorage.getItem('token')}})
            
            const links = result.data;
            for(var i=0; i<links.length; i++)
            {
                showLink(links[i].url);
            }
        }
        catch(error)
        {
            if(error.response.status == 401)
            {
                alert("Please Login to fetch data..")
                window.location.href = 'login.html';                
            }
            else if(error.message = 'Network Error')
                alert("Network Error... Please try again"); 
            else
                alert("Unable to fetch data, please try again...");
        }
    }
    else
    {
        alert("Please buy premium to avail this feature...");
    }
}

function showLink(url)
{
    const ulList = document.getElementById('report-links-list');
    
    const listItem = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', `${url}`);
        a.innerHTML = `${url}`
    listItem.appendChild(a);

    ulList.appendChild(listItem);
}

async function getLink()
{
    const user = decodeJWT(localStorage.getItem('token'));
    if(user.ispremiumuser == true)
    {
        try{
            console.log("In getlink.....");
            const result = await axios.get('http://localhost:4000/download/',
                                            {headers:{'token':localStorage.getItem('token')}})
            console.log(result.data);
        }
        catch(error)
        {
            if(error.response.status == 401)
            {
                alert("Please Login to fetch data..")
                window.location.href = 'login.html';                
            }
            else if(error.message = 'Network Error')
                alert("Network Error... Please try again"); 
            else
                alert("Unable to fetch data, please try again...");
        }
    }
    else
    {
        alert("Please buy premium to avail this feature...");
    }
}






// function generateReport()
// {
//     console.log("In generate report...");
//     const date = new Date();
//     //console.log(".....", date.toLocaleString())
//     axios.get('http://localhost:4000/expenses/', {headers:{'token':localStorage.getItem('token')}})
//         .then(response=>{
//             const expensesList = response.data.existingExpenses;
//             const total_expenses = response.data.total_expenses;
            
//             for(var i=0; i<expensesList.length; i++)
//             {
//                 const entry =  {
//                     category : expensesList[i].category,
//                     amount: expensesList[i].amount,
//                     description: expensesList[i].description,
//                     date : expensesList[i].date
//                 };
//                 addRow(entry);
//             }
//             addTotalRow('Total Expenses', total_expenses);
//         })
//         .catch(error=>{
//             console.log(error);
//             if(error.response.status==401)
//             {
//                 alert("Please Login to fetch data..")
//                 window.location.href = 'login.html';                
//             }
//         });
// }

// function addRow(entry)
// {
//     const tbody = document.getElementById('report-body');
//         const tr = document.createElement('tr');
//             const td1 = document.createElement('td');
//             td1.innerHTML = `${ entry.date }`;
//             //toLocaleString('default', {month:'long'})

//             const td2 = document.createElement('td');
//             td2.innerHTML = `${entry.category}`;

//             const td3 = document.createElement('td');
//             td3.innerHTML = `${entry.description}`;

//             const td4 = document.createElement('td');
//             td4.innerHTML = `${entry.amount}`;
        
//         tr.appendChild(td1);
//         tr.appendChild(td2);
//         tr.appendChild(td3);
//         tr.appendChild(td4);
//     tbody.appendChild(tr);

// }

// function addTotalRow(text, amount)
// {
//     const tbody = document.getElementById('report-body');
//         const tr = document.createElement('tr');
//             const td1 = document.createElement('td');
//             td1.setAttribute('colspan', '3');
//             td1.style.textAlign = 'right';
//             td1.style.backgroundColor = 'antiquewhite';
//             td1.innerHTML = text;

//             const td2 = document.createElement('td');
//             td2.style.backgroundColor = 'antiquewhite';
//             td2.innerHTML = `${amount}`;
//         tr.appendChild(td1);
//         tr.appendChild(td2);
//         tr.style.fontWeight = 'bold';
//     tbody.appendChild(tr);
// }
