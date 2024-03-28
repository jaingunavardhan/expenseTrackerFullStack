const AWS = require('aws-sdk');
require('dotenv').config();
const fs = require('fs');

exports.uploadTos3 = async (filename)=>{
    const s3 = new AWS.S3({
        accessKeyId : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
    });

    const fileBody = fs.readFileSync(filename);

    const params = {
        Bucket: 'gunaexpensetracker',
        Key: filename,
        Body: fileBody,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject)=>{
        s3.upload(params, async (error, s3response)=>{
            if(error)
                reject(error);
            if(s3response)
            {
                console.log('success...', s3response);
                resolve(s3response.Location);
            }
        })
    })
    
}
