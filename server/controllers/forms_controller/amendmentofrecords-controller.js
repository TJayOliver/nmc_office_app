import {database} from '../../database/database.js'
import excela from 'json2csv'
import nodecache from 'node-cache'
const mycache = new nodecache(),
excel = excela.Parser

// render amendment of records forms (GET)
export const amendmentOfRecordsView = (req, res) => {
    const staffName = req.user.name;
    res.render('forms/amendmentofrecords', { PageTitle: "AMENDMENT OF RECORDS", action: 'ADD', staffName: staffName, req:req })
}

// render amendment of records forms (POST)
export const amendmentOfRecordsForm = async(req, res) => {
    const { registrationNumber, amendmentType, amountPaid} = req.body;
    const registrationNumberr = registrationNumber.toUpperCase();
    let attended_to_by_client_service = "";
    if (req.user.role === 'CLIENT SERVICE' || req.user.role === 'ADMIN') {
        attended_to_by_client_service = req.user.name;
    }
    try{
        const ErrorCheckQuery = `SELECT * FROM clientdetails WHERE registration_number=?`, 
        ErrorParameters = [registrationNumberr];
        const [data] = await database.query(ErrorCheckQuery,ErrorParameters);
        console.log('Amendment of Records Forms Connection Successful');
        if(data.length > 0){
            console.log('Registration Number Exist');
            const sqlquery = `INSERT INTO amendment_of_records SET registration_number=?, request_type=?, amount_paid=?, attended_to_by_client_service=?`,
            parameters = [registrationNumberr, amendmentType, amountPaid, attended_to_by_client_service];
            const [data] = await database.query(sqlquery, parameters);
            console.log('Amendment of records input inserted');
            req.flash('Success', 'SAVED! ALL GOOD!');
            res.redirect('/amendment-of-records');
        }else{
            console.log('Registration Number Does Not Exist');
            req.flash('Unavailable', 'OOPS! CLIENT DOES NOT EXIST');
            res.redirect('/client-details')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// render amendment of records edit forms
export const amendmentOfRecordsEdit = async(req, res) => {
    const editQuery = 'SELECT * FROM amendment_of_records WHERE id=?', editParameters = [req.params.id];
    try{
        console.log('Amendment of Records Edit Connection Successful')
        const [data] = await database.query(editQuery, editParameters);
        const staffName = req.user.name;
        console.log('Amendment of Records Editing Done')
        res.render('forms/amendmentofrecords', { PageTitle: "AMENDMENT OF RECORDS", action: 'EDIT', data: data, staffName: staffName, req:req });
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// update amendment of records edit forms
export const amendmentOfRecordsUpdate = async(req, res) => {
    const { registrationNumber, amendmentType, amountPaid, documents, bank, receiptNumber, transactionRef } = req.body;
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
    const CheckQuery = `SELECT * FROM amendment_of_records WHERE attended_to_by_account_office=?`;
    try{
        const [data] = await database.query(CheckQuery, [attended_to_by_account_office]);
        if(data.length > 0){
            console.log('Accounts Officer has added Bank and Receipt Details');
            const updateQuery = `UPDATE amendment_of_records SET registration_number=?, request_type=?, amount_paid=?,bank=?,receipt_number=?,transaction_reference_number=?,modified_by_account_office=?,modified_by_client_service=? WHERE id=?`;
            const updateParameter = [registrationNumberr, amendmentType, amountPaid, bank, receiptNumber, transactionReff, modified_by_account_office,modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter);
            console.log('Account Officer has Successfully Updated the form');
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/amendment-of-records')
        }else{
            console.log('Client Officer has Updated the form');
            const updateQuery = `UPDATE amendment_of_records SET registration_number=?, request_type=?, 
            amount_paid=?,bank=?,receipt_number=?,transaction_reference_number=?,attended_to_by_account_office=?,modified_by_client_service=? WHERE id=?`;
            const updateParameter = [registrationNumberr, amendmentType, amountPaid, bank, receiptNumber, transactionReff, attended_to_by_account_office,modified_by_client_service, req.params.id];
            const [data] = await database.query(updateQuery, updateParameter);
            console.log('Client Officer has Successfully Updated the form');
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/records/amendment-of-records');
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// delete record from amendment of records form
export const amendmentOfRecordsDelete = async(req, res) => {
    const deleteQuery = 'DELETE FROM amendment_of_records WHERE id=?', 
    deleteParameter = [req.params.id];
    try{
        const [data] = await database.query(deleteQuery, deleteParameter);
        console.log('Amendment Record Deleted')
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/amendment-of-records')
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting record to excel
export const amendmentOfRecordsExport = async(req, res) =>{
    const exportQuery = `SELECT registration_number, request_type, amount_paid,
    bank,receipt_number,transaction_reference_number,DATE_FORMAT(date_of_request, '%d/%M/%Y') AS date_of_request FROM amendment_of_records`;
    try{
        console.log('Exporting Amendment of Record Connection Successful');
        const [data] = await database.query(exportQuery);
        const file = await JSON.parse(JSON.stringify(data)),
        jsonfile = new excel({file});
        console.log('converting data into excel file')
        excelfile = jsonfile.parse(file);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=AMENDMENT OF RECORDS.csv");
        console.log('File exported')
        res.status(200).end(excelfile)
    }catch(error){
        console.log(excel)
    }
}