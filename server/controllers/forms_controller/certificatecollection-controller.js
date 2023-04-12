import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render Certificate Collection forms (GET)
export const certificateCollectionView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/certificatecollection', {PageTitle: "CERTIFICATE COLLECTION", action:"ADD",staffName:staffName, req:req})
}

// render Certificate Collection forms (POST)
export const certificateCollectionForm = async(req,res)=>{
    const {registrationNumber, workingInstitution,  dateoncertificate, badgeissued, inductionitems, penaltyforcollection, amountPaid} = req.body;
    const registrationNumberr = registrationNumber.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    // retrieving registration numbers from the client details table
    const ErrorCheckQuery = `SELECT * FROM clientdetails WHERE registration_number=?`,
    ErrorParameters = [registrationNumberr];
    try{
        console.log('Certificate Collection Forms Connection Successful');
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters);
        if(data.length > 0){
            console.log('registration number exist')
            // SQL query to insert user input to database table
            const sqlquery = `INSERT INTO certificate_collection 
            SET 
            registration_number=?,
            working_institution=?,
            date_on_certificate=?,
            badge_issued=?,
            induction_items_issued=?,
            request_type=?,
            amount_paid=?,  
            attended_to_by_client_service=?`;
            // name attribute for input fields in MYSQL query
            const parameters = [registrationNumberr, workingInstitution, dateoncertificate, badgeissued, inductionitems, penaltyforcollection, amountPaid,attended_to_by_client_service];
            const [data] = await database.query(sqlquery, parameters);
            req.flash('Success', 'SAVED! ALL GOOD!')
            res.redirect('/certificate-collection')
        }else{
            req.flash('Unavailable', 'OOPS! CLIENT DOES NOT EXIST, PLEASE REGISTER CLIENT HERE!')
            res.redirect('/client-details')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// render certificate collection edit forms
export const certificateCollectionEdit = async(req, res)=>{
    const editQuery = `SELECT *, DATE_FORMAT(date_on_certificate, '%Y-%m-%d') AS date_on_certificate FROM certificate_collection WHERE id=?`,
    editParameters = [req.params.id];
    try{
        console.log('EDIT certificate collection forms successful')
        const [data] = await database.query(editQuery, editParameters);
        const staffName = req.user.name;
        res.render('forms/certificatecollection', {PageTitle: "CERTIFICATE COLLECTION",  action:'EDIT', data:data, staffName:staffName, req:req});
    }catch(error){
        console.log(error);
        res.status(500).render('errors/servererror')
    }
}

// update certificate collection edit forms
export const certificateCollectionUpdate = async(req,res)=>{
    const {registrationNumber, workingInstitution, dateoncertificate, badgeissued, inductionitems, penaltyforcollection, amountPaid, bank, receiptNumber, transactionRef} = req.body;
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
        console.log('Certificate Collection Update Connection Succcessful');
        // retrieving account office user name
        const CheckQuery = `SELECT * FROM certificate_collection WHERE attended_to_by_account_office=?`;
        // checking if account user name exist in database, 
        // if account user has inserted payments details then modified_by_account_office 
        // column should have the name of the account user who initiated the update, 
        // else if is a new insertion by account user, save the name to the attended_to_by_account column
        const [data] = await database.query(CheckQuery,[attended_to_by_account_office]);
        if(data.length > 0){
            const updateQuery = `UPDATE certificate_collection 
            SET 
            registration_number=?,
            working_institution=?,
            date_on_certificate=?,
            badge_issued=?,
            induction_items_issued=?,
            request_type=?,
            amount_paid=?,  
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_account_office=?,
            modified_by_client_service=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, workingInstitution, dateoncertificate, badgeissued, inductionitems, penaltyforcollection, amountPaid, bank, receiptNumber, transactionReff,attended_to_by_account_office, modified_by_account_office,modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter);
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/certificate-collection')
        }else{
            // new insertion
            const updateQuery = `UPDATE certificate_collection 
            SET 
            registration_number=?,
            working_institution=?,
            date_on_certificate=?,
            badge_issued=?,
            induction_items_issued=?,
            request_type=?,
            amount_paid=?,  
            bank=?,
            receipt_number=?,
            transaction_reference_number=?,
            attended_to_by_account_office=?,
            modified_by_client_service=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, workingInstitution, dateoncertificate, badgeissued, inductionitems, penaltyforcollection, amountPaid, bank, receiptNumber, transactionReff,attended_to_by_account_office, modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter);
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/certificate-collection')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from certificate collection form
export const certificateCollectionDelete = async(req,res)=>{
    const deleteQuery = 'DELETE FROM certificate_collection WHERE id=?',
    deleteParameter = [req.params.id];
    try{
        console.log('Deleting Certificate Connection Successful');
        const [data] = await database.query(deleteQuery, deleteParameter);
        console.log('Record Deleted')
        req.flash('Deleted', 'SUCCESSFULLY DELETED')
        res.redirect('/records/certificate-collection')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const certificateCollectionExport = async(req, res) =>{
    const exportQuery = `SELECT 
    registration_number,
    working_institution,  
    DATE_FORMAT(date_on_certificate, '%d/%M/%Y') AS date_on_certificate,
    badge_issued,
    induction_items_issued,
    DATE_FORMAT(date_of_collection, '%d/%M/%Y') AS date_of_collection,
    request_type,
    amount_paid,
    bank,
    receipt_number,
    transaction_reference_number,
    attended_to_by_client_service,
    attended_to_by_account_office,
    DATE_FORMAT(date_modified, '%d/%M/%Y') AS date_modified,
    modified_by_client_service,
    modified_by_account_office
    FROM certificate_collection`;
    try{
        console.log('Certificate Collection Export Connection Successful');
        const [data] = await database.query(exportQuery);
        console.log('converting data into excel')
        const file = await JSON.parse(JSON.stringify(data)), 
        jsonfile = new excel({file}),
        excelfile = jsonfile.parse(file);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=CERTIFICATE COLLECTION RECORDS.csv");
        console.log('File Exported')
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}