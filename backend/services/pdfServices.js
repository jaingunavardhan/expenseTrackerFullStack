const pt = require('puppeteer');

exports.generatePDF = async (existingExpenses, total_expenses, request)=>{

    const htmlContent = generateHTML(existingExpenses, total_expenses, request);

    const date = new Date();
    const filename = `Report${request.user.id}_${date.getTime()}.pdf`;

    const browser = await pt.launch({headless:true});
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({path: filename, printBackground:true});
    await browser.close();

    return filename;
}


function generateHTML(existingExpenses, total_expenses, request)
{
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Expenses Report</title>
        <style>
            body{
                background-color: rgb(198, 255, 186);
            }
            h1{
                text-align: center;
                color: rgb(255, 0, 0);        
            }
            table, td, th{
                border: 2px solid;
                border-color: rgb(255, 255, 255);
            }
            table{
                text-align: center;
                margin: 0 20px;
                border-style:solid;
                background-color: rgb(198, 255, 186);
                border-collapse: collapse;
            }
            th{
                width:200px;
                text-align: left;
                padding: 8px;    
                color: rgb(255, 255, 255);
                background-color: rgb(0, 187, 9);
            }
            td{
                text-align: left;
                padding: 6px;
                background-color: rgb(175, 255, 179);   
            }
        </style>
    </head>
    <body>
        <h1>Your Expenses Report</h1>
        <table id="report-table">
            <thead id="report-head">
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody id="report-body">

            </tbody>
        </table>
    </body>
    <script>
    function generateReport()
    {
        console.log("In generate runninggggg report...");
        const expensesList = ${existingExpenses}; 
        const total_expenses = ${total_expenses};  
        console.log("executing...")             
                for(var i=0; i<expensesList.length; i++)
                {
                    const entry =  {
                        category : expensesList[i].category,
                        amount: expensesList[i].amount,
                        description: expensesList[i].description,
                        date : expensesList[i].date
                    };
                    addRow(entry);
                }
                addTotalRow('Total Expenses', total_expenses);
    }

    function addRow(entry)
    {
        const tbody = document.getElementById('report-body');
            const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                td1.innerHTML = entry.date;
                //toLocaleString('default', {month:'long'})

                const td2 = document.createElement('td');
                td2.innerHTML = entry.category;

                const td3 = document.createElement('td');
                td3.innerHTML = entry.description;

                const td4 = document.createElement('td');
                td4.innerHTML = entry.amount;
            
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
        tbody.appendChild(tr);
    }

    function addTotalRow(text, amount)
    {
        const tbody = document.getElementById('report-body');
            const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                td1.setAttribute('colspan', '3');
                td1.style.textAlign = 'right';
                td1.style.backgroundColor = 'antiquewhite';
                td1.innerHTML = text;

                const td2 = document.createElement('td');
                td2.style.backgroundColor = 'antiquewhite';
                td2.innerHTML = amount;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.style.fontWeight = 'bold';
        tbody.appendChild(tr);
    }
    generateReport();
    </script>
    </html>
    `

    return htmlContent;
}
