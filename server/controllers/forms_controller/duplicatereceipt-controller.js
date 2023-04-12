import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render Duplicate Receipt forms (GET)
export const duplicateReceiptView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/duplicatereceipt', {PageTitle: "DUPLICATE RECEIPT", action:"ADD", staffName:staffName, req:req})
}

// render Duplicate Receipt forms (POST)
export const duplicateReceiptForm = async(req,res)=>{
    const {registrationNumber, amountPaid, bank, receiptNumber} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('Duplicate Receipt Forms Connection Successful');
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?';
        const ErrorParameters = [registrationNumberr];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
        // if registration number exist
        if(data.length > 0){
            // SQL query to insert user input to database table
            const sqlquery = `INSERT INTO duplicate_receipt 
            SET 
            registration_number=?,  
            amount_paid=?,
            attended_to_by_client_service=?`;
            const parameters = [registrationNumberr, amountPaid, attended_to_by_client_service];
            const [data] = await database.query(sqlquery, parameters);
            req.flash('Success', 'SAVED! ALL GOOD!');
            res.redirect('/duplicate-receipt')
        }
        // if the registration number does not exist, display an error message
        else{
            req.flash('Unavailable', 'OOPS! CLIENT DOES NOT EXIST');
            res.redirect('/client-details')
        }
    }catch(error){
        console.log(error);
        res.status(500).render('errors/servererror')
    }
}

// render Duplicate Receipt edit forms
export const duplicateReceiptEdit = async(req, res)=>{
    try{
        console.log('EDIT Duplicate Receipt forms successful')
        const editQuery = 'SELECT * FROM duplicate_receipt WHERE id=?', editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters)
        const staffName = req.user.name;
        res.render('forms/duplicateReceipt', {PageTitle: "DUPLICATE RECEIPT", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error);
        res.status(500).render('errors/servererror')
    }   
}

// update Duplicate Receipt edit forms
export const duplicateReceiptUpdate = async(req,res)=>{
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
        console.log('Duplicate Receipt Update Connection Succcessful');
        // retrieving account office user name
        const CheckQuery = `SELECT * FROM duplicate_receipt WHERE attended_to_by_account_office=?`;
        const [data] = await database.query(CheckQuery,[attended_to_by_account_office]);
        //checking if account user name exist in database, 
    // if account user has inserted payments details then modified_by_account_office 
    // column should have the name of the account user who initiated the update, 
    // else if is a new insertion by account user, save the name to the attended_to_by_account column
        if(data.length > 0){
            const updateQuery = `UPDATE duplicate_receipt 
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
            res.redirect('/records/duplicate-receipt');
        }else{
        // new insertion
            const updateQuery = `UPDATE duplicate_receipt 
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
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/duplicate-receipt')
        }
    }catch(error){
        console.log(error)
    }
}

// delete record from Duplicate Receipt form
export const duplicateReceiptDelete = async(req,res)=>{
    try{
    console.log('delete Duplicate Receipt connection successfull');
    const deleteQuery = 'DELETE FROM duplicate_receipt WHERE id=?', deleteParameter = [req.params.id];
    const [data] = await database.query(deleteQuery, deleteParameter)
    req.flash('Deleted', 'SUCCESSFULLY DELETED');
    res.redirect('/records/duplicate-receipt')
    }catch(error){
        console.log(error)
    }
}

// exporting record to excel
export const duplicateReceiptExport = async(req, res) =>{
    try{
        const exportQuery = `SELECT 
        registration_number,  
        amount_paid,
        bank,
        receipt_number,
        transaction_reference_number,
        DATE_FORMAT(date_of_request, '%d/%M/%Y') AS date_of_request,
        attended_to_by_client_service,
        attended_to_by_account_office,
        DATE_FORMAT(date_modified, '%d/%M/%Y') AS date_modified,
        modified_by_client_service,
        modified_by_account_office
        FROM duplicate_receipt`;
        const [data] = await database.query(exportQuery)
        console.log('export query successful');
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data)), 
        jsonfile = new excel({file}), 
        excelfile = jsonfile.parse(file);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=DUPLICATE RECEIPT RECORDS.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error);
        res.status(500).render('errors/servererror')
    }
}