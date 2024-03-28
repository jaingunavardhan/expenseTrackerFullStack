const PdfServices = require('../services/pdfServices');
const DatabaseServices = require('../services/databaseServices');
const S3Services = require('../services/s3Services');

exports.getLink = async (request, response, next)=>{
    if(request.user.ispremiumuser != true)
        return response.status(403).json("Please buy premium to avail this feature...");
    try{
        console.log("Inside getlink...");
        const existingExpenses = await DatabaseServices.getExpenses({
            where:{userId:request.user.id},
            attributes: ['id', 'amount', 'description', 'category', 'date'],
            raw: true
        });
        
        console.log("Databaseservices completed... starting pdf service....");
        const filename = await PdfServices.generatePDF( JSON.stringify(existingExpenses), request.user.total_expenses, request );

        console.log("pdf done completed... starting S3 service....", filename);
        const s3Link = await S3Services.uploadTos3(filename);
        console.log("s3 done...", s3Link);

        await DatabaseServices.addFileurl(s3Link, request);
        
        return response.json(s3Link);
    }
    catch(error)
    {
        return response.status(500).json('Cannot Generate Report at the moment, please try again later...');
    }
}

exports.getAllLinks = async (request, response, next)=>{
    const existingFileurls = await DatabaseServices.getFileurls(request);
    return response.json(existingFileurls);
}