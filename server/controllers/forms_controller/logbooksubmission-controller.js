import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render Logbook Submission forms (GET)
export const logbookSubmissionView = (req,res)=>{
    const staffName = req.user.name;
   res.render('forms/logbooksubmission', {PageTitle: "LOGBOOK SUBMISSION", action:'ADD', staffName:staffName, req:req})
}

// render Logbook Submission forms (POST)
export const logbookSubmissionForm = async(req,res)=>{
    const {registrationNumber, facilityname, commencementofschool, completionofschool} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase(), facilitynamee = facilityname.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('Logbook Submission Forms Connection Successful');
        // retrieving registration numbers from the client details table
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?', ErrorParameters = [registrationNumberr];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
        // if theres no error in the connection and registration number exist (data.length > 0 means that the registration exist)
        if(data.length > 0){
            const sqlquery = `INSERT INTO logbook_submission 
            SET 
            registration_number=?, 
            facility=?, 
            date_of_commencement_of_school=?,
            date_of_completion=?,
            attended_to_by_client_service=?`;
            const parameters = [registrationNumberr, facilitynamee, commencementofschool, completionofschool , attended_to_by_client_service];
            const [data] = await database.query(sqlquery, parameters)
            req.flash('Success', 'SAVED! ALL GOOD!'); 
            res.redirect('/logbook-submission')
        }
        else{
            // if the registration number does not exist, display an error message
            req.flash('Unavailable', 'OOPS! CLIENT DOES NOT EXIST, REGISTER CLIENT HERE!');
            res.redirect('/client-details')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// render Logbook Submission edit forms
export const logbookSubmissionEdit = async(req, res)=>{
    try{
        console.log('EDIT Logbook Submission forms successful')
        const editQuery = `SELECT *, 
        DATE_FORMAT(date_of_commencement_of_school, '%Y-%m-%d') AS date_of_commencement_of_school, 
        DATE_FORMAT(date_of_completion, '%Y-%m-%d') AS date_of_completion  
        FROM logbook_submission WHERE id=?`;
        const editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters)
        const staffName = req.user.name;
        res.render('forms/logbooksubmission', {PageTitle: "LOGBOOK SUBMISSION", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update Logbook Submission edit forms
export const logbookSubmissionUpdate = async(req,res)=>{
    const {registrationNumber, facilityname, commencementofschool, completionofschool } = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase(), facilitynamee = facilityname.toUpperCase();     
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
        console.log('Logbook Submission Update Connection Succcessful');
        // retrieving account office user name
        const CheckQuery = `SELECT * FROM logbook_submission WHERE attended_to_by_account_office=?`;
        //checking if account user name exist in database, 
        // if account user has inserted payments details, then, modified_by_account_office 
        // column should have the name of the account user who initiated the update, 
        // else if its a new insertion by account user, save the name to the attended_to_by_account column
        const [data] = await database.query(CheckQuery,[attended_to_by_account_office])
        if(data.length > 0){
            // updated by 
            const updateQuery = `UPDATE logbook_submission 
            SET 
            registration_number=?, 
            facility=?, 
            date_of_commencement_of_school=?,
            date_of_completion=?,
            modified_by_client_service=?,
            modified_by_account_office=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, facilitynamee, commencementofschool, completionofschool ,modified_by_client_service,modified_by_account_office, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter)
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/logbook-submission');
        }else{
            // new insertion
            const updateQuery = `UPDATE logbook_submission 
            SET 
            registration_number=?, 
            facility=?, 
            date_of_commencement_of_school=?,
            date_of_completion=?,
            
            modified_by_client_service=?
            WHERE id=?`;
            const updateParameter = [registrationNumberr, facilitynamee, commencementofschool, completionofschool ,modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter);
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/logbook-submission')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from Logbook Submission form
export const logbookSubmissionDelete = async(req,res)=>{
    try{
        console.log('delete Logbook Submission connection successfull');
        const deleteQuery = 'DELETE FROM logbook_submission WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await database.query(deleteQuery, deleteParameter)
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/logbook-submission')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const logbookSubmissionExport = async(req, res) =>{
    try{
        console.log('export connected')
        const exportQuery = `SELECT 
        registration_number,  
        facility,
        DATE_FORMAT(date_of_commencement_of_school, '%d/%M/%Y') AS date_of_commencement_of_school,
        DATE_FORMAT(date_of_completion, '%d/%M/%Y') AS date_of_completion,
        DATE_FORMAT(date_of_submission, '%d/%M/%Y') AS date_of_submission,
        attended_to_by_client_service,
        attended_to_by_account_office,
        DATE_FORMAT(date_modified, '%d/%M/%Y') AS date_modified,
        modified_by_client_service,
        modified_by_account_office
        FROM logbook_submission`;
        const [data] = await database.query(exportQuery)
        console.log('export query successful');
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data)),
        jsonfile = new excel({file}), 
        excelfile = jsonfile.parse(file)
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=LOGBOOK SUBMISSION RECORDS RECORDS.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error);
        res.status(500).render('errors/servererror')
    }
}