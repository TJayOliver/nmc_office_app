import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render Examiners Pack forms (GET)
export const examinersPackView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/examinerspack', {PageTitle: "EXAMINERS PACK", action:'ADD', staffName:staffName, req:req})
}

// render Examiners Pack forms (POST)
export const examinersPackForm = async(req,res)=>{
    const {registrationNumber, amountPaid} = req.body;
    const registrationNumberr = registrationNumber.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('Examiners Pack Forms Connection Successful');
        // retrieving registration numbers from the client details table
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?';
        const ErrorParameters = [registrationNumberr];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
        // if theres no error in the connection and registration number exist (data.length > 0 means that the registration exist)
        if(data.length > 0){
            // SQL query to insert user input to database table
            const sqlquery = `INSERT INTO examiners_pack 
            SET 
            registration_number=?,  
            amount_paid=?,
            attended_to_by_client_service=?`;
            const parameters = [registrationNumberr, amountPaid, attended_to_by_client_service];
            // making query to the database
            const [data] = await database.query(sqlquery, parameters)
            req.flash('Success', 'SAVED! ALL GOOD!'); 
            res.redirect('/examiners-pack');
        }else{
            // if the registration number does not exist, display an error message
            req.flash('Unavailable', 'OOPS! CLIENT DOES NOT EXIST, REGISTER CLIENT HERE');
            res.redirect('/client-details')
        }
    }catch(error){
        console.log(error);
        res.status(500).render('errors/servererror')
    }
}

// render Examiners Pack edit forms
export const examinersPackEdit = async(req, res)=>{
    try{
        console.log('EDIT Examiners Pack forms successful')
        const editQuery = 'SELECT * FROM examiners_pack WHERE id=?', editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters);
        const staffName = req.user.name;
        res.render('forms/examinerspack', {PageTitle: "EXAMINERS PACK", action:'EDIT', data:data, staffName:staffName, req:req});
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update Examiners Pack edit forms
export const examinersPackUpdate = async(req,res)=>{
    const {registrationNumber, amountPaid, bank, receiptNumber, transactionRef} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase(), transactionReff = transactionRef.toUpperCase();     
    let attended_to_by_account_office = "", modified_by_client_service = "",modified_by_account_office = "";   
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
        console.log('Examiners Pack Update Connection Succcessful');
        // retrieving account office user name
        const CheckQuery = `SELECT * FROM examiners_pack WHERE attended_to_by_account_office=?`;
        //checking if account user name exist in database, 
        // if account user has inserted payments details then modified_by_account_office 
        // column should have the name of the account user who initiated the update, 
        // else if is a new insertion by account user, save the name to the attended_to_by_account column
        const [data] = await database.query(CheckQuery,[attended_to_by_account_office])
        if(data.length > 0){
            // updated by 
            const updateQuery = `UPDATE examiners_pack 
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
            const updateParameter = [registrationNumberr, amountPaid, bank, receiptNumber, transactionReff,attended_to_by_account_office,modified_by_client_service,modified_by_account_office, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/examiners-pack')
        }
        else{
            // new insertion
            const updateQuery = `UPDATE examiners_pack 
            SET 
            registration_number=?,  
            amount_paid=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, amountPaid, bank, receiptNumber, transactionReff,attended_to_by_account_office,modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter);
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/examiners-pack')
        }    
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from Examiners Pack form
export const examinersPackDelete = async(req,res)=>{
    try{
        console.log('delete Examiners Pack connection successfull');
        const deleteQuery = 'DELETE FROM examiners_pack WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await database.query(deleteQuery, deleteParameter);
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/examiners-pack')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const examinersPackExport = async(req, res) =>{
    try{
        console.log('export connected')
        const exportQuery = `SELECT 
        registration_number,  
        amount_paid,
        bank,
        receipt_number,
        DATE_FORMAT(date_of_request, '%d/%M/%Y') AS date_of_request,
        transaction_reference_number,
        attended_to_by_client_service,
        attended_to_by_account_office,
        DATE_FORMAT(date_modified, '%d/%M/%Y') AS date_modified,
        modified_by_client_service,
        modified_by_account_office
        FROM examiners_pack`;
        const [data] = await database.query(exportQuery)
        console.log('export query successful');
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data)),
        jsonfile = new excel({file}),
        excelfile = jsonfile.parse(file);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=EXAMINERS PACK RECORDS.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}