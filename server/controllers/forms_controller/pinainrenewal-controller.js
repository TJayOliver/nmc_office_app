import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render Pin Ain Renewal forms (GET)
export const pinainRenewalView = (req,res)=>{
    const staffName =req.user.name;
    res.render('forms/pinainrenewal', {PageTitle: "PIN/AIN RENEWAL", action:'ADD', staffName:staffName, req:req})
}

// render Pin Ain Renewal forms (POST)
export const pinainRenewalForm = async(req,res)=>{
    const {registrationNumber, renewalType, pinainnumber, amountPaid, pinainissued, pinainexpiry, bank, receiptNumber, transactionRef} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase(), pinainnumberr = pinainnumber.toUpperCase(), transactionReff = transactionRef.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('Pin Ain Renewal Forms Connection Successful');
        // retrieving registration numbers from the client details table
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?';
        const ErrorParameters = [registrationNumberr];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
        // if registration number exist
        if(data.length > 0){
            const sqlquery = `INSERT INTO pin_ain_renewal 
            SET 
            registration_number=?, 
            request_type=?,
            pin_ain_number=?, 
            amount_paid=?,
            date_pin_ain_issued=?,
            date_pin_ain_expired=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_client_service=?`;
            const parameters = [registrationNumberr, renewalType, pinainnumberr, amountPaid, pinainissued, pinainexpiry, bank, receiptNumber, transactionReff, attended_to_by_client_service];
            const [data] = await database.query(sqlquery, parameters)
            req.flash('Success', 'SAVED! ALL GOOD!'); 
            res.redirect('/pin-ain-renewal');
        }
        else{
            req.flash('Unavailable', 'OOPS! CLIENT DOES NOT EXIST, REGISTER CLIENT HERE!');
            res.redirect('/client-details');
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// render  Pin Ain Renewal edit forms
export const pinainRenewalEdit = async(req, res)=>{
    try{
        console.log('EDIT  Pin Ain Renewal forms successful')
        const editQuery = `SELECT *, DATE_FORMAT(date_pin_ain_issued, '%Y-%m-%d') AS date_pin_ain_issued, DATE_FORMAT(date_pin_ain_expired, '%Y-%m-%d') AS date_pin_ain_expired  FROM pin_ain_renewal WHERE id=?`;
        const editParameters = [req.params.id];
        const [data] =  await database.query(editQuery, editParameters)
        const staffName = req.user.name;
        res.render('forms/pinainrenewal', {PageTitle: "PIN/AIN RENEWAL", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update  Pin Ain Renewal edit forms
export const pinainRenewalUpdate = async(req,res)=>{
    console.log(' Pin Ain Renewal Update Connection Succcessful');
    const {registrationNumber, renewalType, pinainnumber, amountPaid, pinainissued, pinainexpiry, bank, receiptNumber, transactionRef} = req.body;
    const registrationNumberr = registrationNumber.toUpperCase(), pinainnumberr = pinainnumber.toUpperCase(), transactionReff = transactionRef.toUpperCase();     
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
        const CheckQuery = `SELECT * FROM pin_ain_renewal WHERE attended_to_by_account_office=?`;
        //checking if account user name exist in database, 
        // if account user has inserted payments details, then, modified_by_account_office 
        // column should have the name of the account user who initiated the update, 
        // else if its a new insertion by account user, save the name to the attended_to_by_account column
        const [data] = await database.query(CheckQuery,[attended_to_by_account_office])
        // updated by 
        if(data.length > 0){
            const updateQuery = `UPDATE pin_ain_renewal 
            SET 
            registration_number=?, 
            request_type=?,
            pin_ain_number=?, 
            amount_paid=?,
            date_pin_ain_issued=?,
            date_pin_ain_expired=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?,
            modified_by_account_office=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, renewalType, pinainnumberr, amountPaid, pinainissued, pinainexpiry, bank, receiptNumber, transactionReff, receiptNumber,attended_to_by_account_office,modified_by_client_service,modified_by_account_office, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/pin-ain-renewal')
        }else{
            // new insertion
            const updateQuery = `UPDATE pin_ain_renewal 
            SET 
            registration_number=?, 
            request_type=?,
            pin_ain_number=?, 
            amount_paid=?,
            date_pin_ain_issued=?,
            date_pin_ain_expired=?,
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?
            WHERE id=?`;
            const updateParameter = [registrationNumber, renewalType, pinainnumber, amountPaid, pinainissued, pinainexpiry, bank, receiptNumber, transactionRef, attended_to_by_account_office,modified_by_client_service, req.params.id];
    
            connection.query(updateQuery, updateParameter, (error, data)=>{
                if(!error){
                    req.flash('Updated', 'SUCCESSFULLY UPDATED');
                    res.redirect('/records/pin-ain-renewal')
                }
                else{console.log(error)}
                res.status(500).render('errors/servererror')})

        }
        
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from  Pin Ain Renewal form
export const pinainRenewalDelete = async(req,res)=>{
    try{
        console.log('delete  Pin Ain Renewal connection successfull');
        const deleteQuery = 'DELETE FROM pin_ain_renewal WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await database.query(deleteQuery, deleteParameter)
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/pin-ain-renewal')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const pinainRenewalExport = async(req, res) =>{
    try{
        console.log('export connected')
        const exportQuery = `SELECT 
        registration_number,  
        request_type,
        pin_ain_number,
        DATE_FORMAT(date_pin_ain_issued, '%d/%M/%Y') AS date_pin_ain_issued,
        DATE_FORMAT(date_pin_ain_expired, '%d/%M/%Y') AS date_pin_ain_expired,
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
        FROM pin_ain_renewal`;
        const [data] = await database.query(exportQuery)
        console.log('export query successful');
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data)), 
        jsonfile = new excel({file}), 
        excelfile = jsonfile.parse(file)
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=PIN AIN RENEWAL RECORDS.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}