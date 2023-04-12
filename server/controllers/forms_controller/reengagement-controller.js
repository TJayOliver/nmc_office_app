import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render re-engagement forms (GET)
export const reEngagementView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/reengagement', {PageTitle: "RE-ENGAGEMENT OF CLIENT", action:'ADD', staffName:staffName, req:req})
}

// render re-engagement forms (POST)
export const reEngagementForm = async(req,res)=>{
    const {registrationNumber, amountPaid} = req.body;
    const registrationNumberr = registrationNumber.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('re-engagement Forms Connection Successful');
        // retrieving registration numbers from the client details table
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?', ErrorParameters = [registrationNumber];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
        // if registration number exist
        if(data.length > 0){
            // SQL query to insert user input to database table
            const sqlquery = `INSERT INTO re_engagement 
            SET 
            registration_number=?,  
            amount_paid=?,
            attended_to_by_client_service=?`;
            // name attribute for input fields in MYSQL query
            const parameters = [registrationNumberr, amountPaid, attended_to_by_client_service];
            const [data] = await database.query(sqlquery, parameters)
            req.flash('Success', 'SAVED! ALL GOOD!');
            res.redirect('/re-engagement')
        }
        // if the registration number does not exist, display an error message
        else{
            req.flash('Unavailable', 'OOPS! CLIENT DOES NOT EXIST, REGISTER CLIENT HERE!');
            res.redirect('/client-details');
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// render re-engagement edit forms
export const reEngagementEdit = async(req, res)=>{
    try{
        console.log('EDIT re-engagement forms successful')
        const editQuery = 'SELECT * FROM re_engagement WHERE id=?', editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters)
        const staffName = req.user.name;
        res.render('forms/reengagement', {PageTitle: "RE-ENGAGEMENT OF CLIENT", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update re-engagement edit forms
export const reEngagementUpdate = async(req,res)=>{
    console.log(' re-engagement Update Connection Succcessful');
    const {registrationNumber, amountPaid, bank, receiptNumber, transactionRef} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase(), transactionReff = transactionRef.toUpperCase();      
    let attended_to_by_account_office = "", modified_by_client_service = "", modified_by_account_office = "";
    if (req.user.role === 'ACCOUNTS' || req.user.role === 'ADMIN') {
        attended_to_by_account_office = req.user.name;
    }
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        modified_by_client_service = req.user.name;
    }
    if (req.user.role === 'ACCOUNTS' || req.user.role === 'ADMIN') {
        modified_by_account_office = req.user.name;
    }
    try{
        // retrieving account office user name
        const CheckQuery = `SELECT * FROM re_engagement WHERE attended_to_by_account_office=?`;
        //checking if account user name exist in database, 
        // if account user has inserted payments details, then, modified_by_account_office 
        // column should have the name of the account user who initiated the update, 
        // else if its a new insertion by account user, save the name to the attended_to_by_account column
        const [data] = await database.query(CheckQuery,[attended_to_by_account_office])
        // updated by 
        if(data.length > 0){
            const updateQuery = `UPDATE re_engagement 
            SET 
            registration_number=?,  
            amount_paid=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?,
            modified_by_account_office=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, amountPaid, bank, receiptNumber, transactionReff,attended_to_by_account_office,modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/re-engagement')
        }else{
            // new insertion
            const updateQuery = `UPDATE re_engagement 
            SET 
            registration_number=?,  
            amount_paid=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?
            WHERE id=?`;
            const updateParameter = [registrationNumber, amountPaid, bank, receiptNumber, transactionReff, attended_to_by_account_office, modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/re-engagement')
        } 
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from  re-engagement form
export const reEngagementDelete = async(req,res)=>{
    try{
        console.log('delete  re-engagement connection successfull');
        const deleteQuery = 'DELETE FROM re_engagement WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await connection.query(deleteQuery, deleteParameter)
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/re-engagement')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const reEngagementExport = async(req, res) =>{
    try{
        console.log('export connected')
        const exportQuery = `SELECT 
        registration_number,  
        amount_paid,
        bank,
        receipt_number,
        transaction_reference_number,
        DATE_FORMAT(date_of_renewal, '%d/%M/%Y') AS date_of_renewal,
        attended_to_by_client_service,
        attended_to_by_account_office,
        DATE_FORMAT(date_modified, '%d/%M/%Y') AS date_modified,
        modified_by_client_service,
        modified_by_account_office
        FROM re_engagement`;
        const [data] = await database.query(exportQuery);
        console.log('export query successful');
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data)),
        jsonfile = new excel({file}), excelfile = jsonfile.parse(file);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=RE ENGAGEMENT RECORDS.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}