import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render replacement of pin ain forms (GET)
export const replacementofpinainView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/replacement', {PageTitle: "REPLACEMENT OF PIN/AIN", action:'ADD', staffName:staffName, req:req})
}

// render replacement of pin ain forms (POST)
export const replacementofpinainForm = async(req,res)=>{
    const {registrationNumber, replacementType, amountPaid} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('replacement of pin ain Forms Connection Successful');
        // retrieving registration numbers from the client details table
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?', ErrorParameters = [registrationNumberr];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
        // if registration number exist
        if(data.length > 0){
            const sqlquery = `INSERT INTO replacement_of_pin_ain 
            SET 
            registration_number=?,  
            replacement_type=?,
            amount_paid=?,
            attended_to_by_client_service=?`;
            const parameters = [registrationNumberr, replacementType, amountPaid, attended_to_by_client_service];
            const [data] = await database.query(sqlquery, parameters)
            req.flash('Success', 'SAVED! ALL GOOD!'); 
            res.redirect('/replacement-of-pin-ain')
        }else{
            req.flash('Unavailable', 'OOPS! CLIENT DOES NOT EXIST, REGISTER CLIENT HERE!');
            res.redirect('/client-details');
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// render replacement of pin ain edit forms
export const replacementofpinainEdit = async(req, res)=>{
    try{
        console.log('EDIT   replacement of pin ain forms successful')
        const editQuery = 'SELECT * FROM replacement_of_pin_ain WHERE id=?', editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters)
        const staffName = req.user.name;
        res.render('forms/replacement', {PageTitle: "REPLACEMENT OF PIN/AIN", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update replacement of pin ain edit forms
export const replacementofpinainUpdate = async(req,res)=>{
    const {registrationNumber, replacementType, amountPaid,  bank, receiptNumber, transactionRef} = req.body; 
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
        const CheckQuery = `SELECT * FROM replacement_of_pin_ain WHERE attended_to_by_account_office=?`;
        //checking if account user name exist in database, 
        // if account user has inserted payments details, then, modified_by_account_office 
        // column should have the name of the account user who initiated the update, 
        // else if its a new insertion by account user, save the name to the attended_to_by_account column
        const [data] = await database.query(CheckQuery,[attended_to_by_account_office])
        // updated by 
        if(data.length > 0){
            const updateQuery = `UPDATE replacement_of_pin_ain 
            SET 
            registration_number=?,  
            replacement_type=?,
            amount_paid=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?,
            modified_by_account_office=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, replacementType, amountPaid,  bank, receiptNumber, transactionReff, attended_to_by_account_office, modified_by_client_service,modified_by_account_office, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/replacement-of-pin-ain')
        }else{
        // new insertion
            const updateQuery = `UPDATE replacement_of_pin_ain 
            SET 
            registration_number=?,  
            replacement_type=?,
            amount_paid=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, replacementType, amountPaid, bank, receiptNumber, transactionReff, attended_to_by_account_office, modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter);
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/replacement-of-pin-ain')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from replacement of pin ain form
export const replacementofpinainDelete = async(req,res)=>{
    try{
        console.log('delete replacement of pin ain connection successfull');
        const deleteQuery = 'DELETE FROM replacement_of_pin_ain WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await database.query(deleteQuery, deleteParameter)
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/replacement-of-pin-ain')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const replacementofpinainExport = async(req, res) =>{
    try{
        console.log('export connected')
        const exportQuery = `SELECT 
        registration_number, 
        replacement_type, 
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
        FROM replacement_of_pin_ain`;
        const [data] = await database.query(exportQuery)
            console.log('export query successful');
            // converting data into excel 
            const file = await JSON.parse(JSON.stringify(data)),
            jsonfile = new excel({file}),
            excelfile = jsonfile.parse(file);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=REPLACEMENT OF PINAIN RECORDS.csv");
            res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}