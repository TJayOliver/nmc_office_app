import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render registration forms (GET)
export const registrationView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/registration', {PageTitle: "REGISTRATION OF CLIENT", action:'ADD', staffName:staffName, req:req})
}

// render registration forms (POST)
export const registrationForm = async(req,res)=>{
    const {registrationNumber, nameofinstitution, codeofconduct, logbookissued, amountPaid, lateRegistration, lateregistrationamount} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase(), nameofinstitutionn = nameofinstitution.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('registration Forms Connection Successful');
        // retrieving registration numbers from the client details table
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?', ErrorParameters = [registrationNumberr];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
        // if registration number exist 
        if(data.length > 0){
            const sqlquery = `INSERT INTO registration 
            SET 
            registration_number=?,
            name_of_institution=?,
            code_of_conduct=?,
            logbook_issued=?,
            amount_paid=?,
            late_registration=?,
            late_registration_amount=?,
            attended_to_by_client_service=?`;
            const parameters = [registrationNumberr, nameofinstitutionn, codeofconduct, logbookissued, amountPaid, lateRegistration, lateregistrationamount, attended_to_by_client_service];
            const [data] = await database.query(sqlquery, parameters)                
            req.flash('Success', 'SAVED! ALL GOOD!');
            res.redirect('/registration')
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

// render  registration edit forms
export const registrationEdit = async(req, res)=>{
    try{
        console.log('EDIT  registration forms successful')
        const editQuery = 'SELECT * FROM registration WHERE id=?', editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters)
        const staffName = req.user.name;
        res.render('forms/registration', {PageTitle: "REGISTRATION OF CLIENT", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update  registration edit forms
export const registrationUpdate = async(req,res)=>{
    console.log('registration Update Connection Succcessful');
    const {registrationNumber, nameofinstitution, codeofconduct, logbookissued, amountPaid, lateRegistration, lateregistrationamount, penaltybank, penaltyreceipt,penaltytransactionRef, bank, receiptNumber, transactionRef} = req.body;
    const registrationNumberr = registrationNumber.toUpperCase(), nameofinstitutionn = nameofinstitution.toUpperCase(), transactionReff = transactionRef.toUpperCase(),penaltytransactionReff = penaltytransactionRef.toUpperCase();   
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
        const CheckQuery = `SELECT * FROM registration WHERE attended_to_by_account_office=?`;
        //checking if account user name exist in database, 
        // if account user has inserted payments details, then, modified_by_account_office 
        // column should have the name of the account user who initiated the update, 
        // else if its a new insertion by account user, save the name to the attended_to_by_account column
        const [data] = database.query(CheckQuery,[attended_to_by_account_office])
        // updated by 
        if(data.length > 0){
            const updateQuery = `UPDATE registration 
            SET 
            registration_number=?,
            name_of_institution=?,
            code_of_conduct=?,
            logbook_issued=?,
            amount_paid=?,
            late_registration=?,
            late_registration_amount=?,
            late_registration_bank=?,
            late_registration_receipt_number=?,
            late_registration_transaction_reference_number=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?,
            modified_by_account_office=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, nameofinstitutionn, codeofconduct, logbookissued, amountPaid, lateRegistration, lateregistrationamount, penaltybank, penaltyreceipt,penaltytransactionReff, bank, receiptNumber, transactionReff,attended_to_by_account_office,modified_by_client_service,modified_by_account_office, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/registration')
        }else{
            // new insertion
            const updateQuery = `UPDATE registration 
            SET 
            registration_number=?,
            name_of_institution=?,
            code_of_conduct=?,
            logbook_issued=?,
            amount_paid=?,
            late_registration=?,
            late_registration_amount=?,
            late_registration_bank=?,
            late_registration_receipt_number=?,
            late_registration_transaction_reference_number=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, nameofinstitutionn, codeofconduct, logbookissued, amountPaid, lateRegistration, lateregistrationamount, penaltybank, penaltyreceipt,penaltytransactionRef, bank, receiptNumber, transactionReff,attended_to_by_account_office,modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/registration')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from registration form
export const registrationDelete = async(req,res)=>{
    try{
        console.log('delete registration connection successfull');
        const deleteQuery = 'DELETE FROM registration WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await database.query(deleteQuery, deleteParameter)
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/registration')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const registrationExport = async(req, res) =>{
    try{
        console.log('export connected')
        const exportQuery = `SELECT 
        registration_number,
        name_of_institution,
        logbook_issued,
        code_of_conduct,  
        amount_paid,
        bank,
        receipt_number,
        transaction_reference_number,
        late_registration,
        late_registration_amount,
        late_registration_bank,
        late_registration_receipt_number,
        late_registration_transaction_reference_number,
        DATE_FORMAT(date_of_registration, '%d/%M/%Y') AS date_of_registration,
        attended_to_by_client_service,
        attended_to_by_account_office,
        DATE_FORMAT(date_modified, '%d/%M/%Y') AS date_modified,
        modified_by_client_service,
        modified_by_account_office
        FROM registration`;
        const [data] = await database.query(exportQuery)
        console.log('export query successful');
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data)),
        jsonfile = new excel({file}), 
        excelfile = jsonfile.parse(file);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=REGISTRATION RECORDS.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}