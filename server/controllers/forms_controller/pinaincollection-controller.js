import {database} from '../../database/database.js'
import excela from 'json2csv'
const excel = excela.Parser

// render Pin Ain Collection forms (GET)
export const pinainCollectionView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/pinaincollection', {PageTitle: "PIN/AIN COLLECTION", action:'ADD', staffName:staffName, req:req})
}

// render Pin Ain Collection forms (POST)
export const pinainCollectionForm = async(req,res)=>{
    const {registrationNumber, collectionType, CollectedBy, takenby, takenphone} = req.body; 
    const registrationNumberr = registrationNumber.toUpperCase(), takenbyy = takenby.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        console.log('Pin Ain Collection Forms Connection Successful');
        // retrieving registration numbers from the client details table
        const ErrorCheckQuery = 'SELECT * FROM clientdetails WHERE registration_number=?';
        const ErrorParameters = [registrationNumberr];
        // SQL query to insert user input to database table if registration number exist
        const [data] = await database.query(ErrorCheckQuery, ErrorParameters)
        if(data.length > 0){
            // if registration number exist
            // SQL query to insert user input to database table
            const sqlquery = `INSERT INTO pin_ain_collection 
            SET 
            registration_number=?, 
            collection_type=?,
            collected_by=?,
            taken_by=?,
            taken_phone=?,
            attended_to_by_client_service=?`;
            // name attribute for input fields in MYSQL query
            const parameters = [registrationNumberr, collectionType, CollectedBy, takenbyy, takenphone, attended_to_by_client_service];
            // making query to the database
            const [data] = await database.query(sqlquery, parameters)
            req.flash('Success', 'SAVED! ALL GOOD!'); 
            res.redirect('/pin-ain-collection')  
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

// render Pin Ain Collection edit forms
export const pinainCollectionEdit = async(req, res)=>{
    try{
        console.log('EDIT  Pin Ain Collection forms successful')
        const editQuery = 'SELECT * FROM pin_ain_collection WHERE id=?', editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters)
        const staffName = req.user.name;
        res.render('forms/pinaincollection', {PageTitle: "PIN/AIN COLLECTION", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update Pin Ain Collection forms
export const pinainCollectionUpdate = async(req,res)=>{
    try{
        console.log('Pin Ain Collection Update Connection Succcessful');
        const {registrationNumber, collectionType, CollectedBy, takenby, takenphone} = req.body; 
        const registrationNumberr = registrationNumber.toUpperCase(), takenbyy = takenby.toUpperCase();    
        let modified_by_client_service = "";  
        if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
            modified_by_client_service = req.user.name;
        }
        const updateQuery = `UPDATE pin_ain_collection 
        SET 
        registration_number=?, 
        collection_type=?,
        collected_by=?, 
        taken_by=?,
        taken_phone=?,
        modified_by_client_service=? 
        WHERE id=?`;
        const updateParameter = [registrationNumberr, collectionType, CollectedBy,takenbyy, takenphone,modified_by_client_service, req.params.id];
        const [data] = await database.query(updateQuery, updateParameter) 
        req.flash('Updated', 'SUCCESSFULLY UPDATED');
        res.redirect('/records/pin-ain-collection')  
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from  Pin Ain Collection form
export const pinainCollectionDelete = async(req,res)=>{
    try{
        console.log('delete  Pin Ain Collection connection successfull');
        const deleteQuery = 'DELETE FROM pin_ain_collection WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await database.query(deleteQuery, deleteParameter)
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/pin-ain-collection')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const pinainCollectionExport = async(req, res) =>{
    try{
        console.log('export connected')
        const exportQuery = `SELECT 
        registration_number,  
        collection_type,
        collected_by,
        taken_by,
        taken_phone,
        DATE_FORMAT(date_of_collection, '%d/%M/%Y') AS date_of_collection,
        attended_to_by_client_service,
        DATE_FORMAT(date_modified, '%d/%M/%Y') AS date_modified,
        modified_by_client_service
        FROM pin_ain_collection`;
        const [data] = await database.query(exportQuery)
        console.log('export query successful');
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data)), 
        jsonfile = new excel({file}), 
        excelfile = jsonfile.parse(file)
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=PIN AIN COLLECTION RECORDS.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

