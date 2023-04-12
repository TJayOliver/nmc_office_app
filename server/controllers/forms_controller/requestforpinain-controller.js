import{database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render request for pin ain forms (GET)
export const requestforpinainView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/requestforpinain', {PageTitle: "REQUEST FOR PIN/AIN", action:'ADD', staffName:staffName, req:req})
}

// render request for pin ain forms (POST)
export const requestforpinainForm = async(req,res)=>{
    const {registrationNumber, requestType} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('request for pin ain Forms Connection Successful');
        // retrieving registration numbers from the client details table
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?', ErrorParameters = [registrationNumberr];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
            // if registration number exist 
            if(data.length > 0){
                const sqlquery = `INSERT INTO request_for_pin_ain 
                SET 
                registration_number=?, 
                request_type=?, 
                attended_to_by_client_service=?`;
                const parameters = [registrationNumberr, requestType, attended_to_by_client_service];
                const [data] = await database.query(sqlquery, parameters)
                req.flash('Success', 'SAVED! ALL GOOD!');
                res.redirect('/request-for-pin-ain')
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

// render request for pin ain edit forms
export const requestforpinainEdit = async(req, res)=>{
    try{
        console.log('EDIT request for pin ain forms successful')
        const editQuery = 'SELECT * FROM request_for_pin_ain WHERE id=?', editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters)
        const staffName = req.user.name;
        res.render('forms/requestforpinain', {PageTitle: "REQUEST FOR PIN/AIN", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update request for pin ain edit forms
export const requestforpinainUpdate = async(req,res)=>{
    const {registrationNumber, requestType} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase();
    let modified_by_client_service = "";    
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        modified_by_client_service = req.user.name;
    }
    try{
        // new insertion
        const updateQuery = `UPDATE request_for_pin_ain 
        SET 
        registration_number=?, 
        request_type=?, 
        modified_by_client_service=?
        WHERE id=?`;
        const updateParameter = [registrationNumberr, requestType, modified_by_client_service, req.params.id];
        const [data] = await database.query(updateQuery, updateParameter)
        req.flash('Updated', 'SUCCESSFULLY UPDATED');
        res.redirect('/records/request-for-pin-ain')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from request for pin ain form
export const requestforpinainDelete = async(req,res)=>{
    try{
        console.log('delete request for pin ain connection successfull');
        const deleteQuery = 'DELETE FROM request_for_pin_ain WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await database.query(deleteQuery, deleteParameter)
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/request-for-pin-ain')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const requestforpinainExport = async(req, res) =>{
    try{
        console.log('export connected')
        const exportQuery = `SELECT 
        registration_number,  
        request_type,
        DATE_FORMAT(date_of_request, '%d/%M/%Y') AS date_of_request,
        attended_to_by_client_service,
        DATE_FORMAT(date_modified, '%d/%M/%Y') AS date_modified,
        modified_by_client_service,
        FROM request_for_pin_ain`;
        const [data] = await database.query(exportQuery)
        console.log('export query successful');
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data)),
        jsonfile = new excel({file}),
        excelfile = jsonfile.parse(file);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=REQUEST FOR PIN AIN.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}