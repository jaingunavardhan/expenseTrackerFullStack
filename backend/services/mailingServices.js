require('dotenv').config();
const Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

const sender = {
    email: 'jaingunavardhan@gmail.com',
    name: 'Gunavardhan Jain'
}

exports.sendResetLink = async (receivers, forgotPasswordId)=>{
    try{
        const transEmailApi = new Sib.TransactionalEmailsApi();

        return await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Password Reset Link',
            htmlContent: `  <p>Hello user, Greetings from Gunavardhan's Expense Tracker!!</p><br>
                            <p>Below is the link to reset your password</p>
                            <h4>
                                <a href="http://localhost:4000/password/resetpassword/${forgotPasswordId}">
                                    Click here to Reset Password
                                </a>
                            </h4>`,
        })
    }
    catch(error)
    {
        console.log(error);
        return error;
    }
}