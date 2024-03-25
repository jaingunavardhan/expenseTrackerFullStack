
function showExpenses()
{
    axios.get('http://localhost:4000/expenses/')
        .then(result=>{
            const existingExpenses = result.data;
            for(var i=0; i<existingExpenses.length; i++)
            {
                showExpense(existingExpenses[i]);
            }
        })
}
showExpenses();

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
            const expenseId = event.target.parentElement.value;
            axios.delete(`http://localhost:4000/expenses/${expenseId}`)
                .then(result=>{
                    ulList.removeChild(event.target.parentElement);
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

    axios.post('http://localhost:4000/expenses/', newExpense)
        .then(result=>{
            const createdExpense = result.data;
            showExpense(createdExpense)
        })
        .catch(error=>console.log(error));
}