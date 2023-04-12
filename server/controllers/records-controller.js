import {database} from '../database/database.js'
import nodecache from 'node-cache'
const mycache = new nodecache({ stdTTL: 60, checkperiod: 60 });

// clientdetails records
export const clientdetailsRecords = async(req,res)=>{
    try{
        console.log("Client Details Records connection Successful")
        const cacheKey = 'clientdetails';
        let cacheData = mycache.get(cacheKey);

        if(!cacheData){
            console.log('cache miss')
            const sqlquery = `SELECT *, 
            DATE_FORMAT(date_of_birth, '%d/%m/%Y') AS date_of_birth
            FROM clientdetails ORDER BY date_created DESC`;
            const [data] = await database.query(sqlquery);
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('cache hit')
        }
        const staffName = req.user.name
        res.render('records/client-records', {PageTitle: "CLIENT RECORDS-RECORDS", data:cacheData, staffName:staffName, req:req})
        
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
// search for data in clientdetails records
export const clientdetailsRecordsSearch = async(req, res)=>{
    try{
        console.log('Client Details search connected successfully');
        // retrieving user search input
        const clientDetailsSearch = req.body.clientDetailsSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_birth, '%d/%m/%Y') AS date_of_birth 
        FROM clientdetails WHERE registration_number LIKE? 
        OR last_name LIKE?`;
        const searchParameter = ['%' + clientDetailsSearch + '%','%' + clientDetailsSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/client-records', {PageTitle: "CLIENT RECORDS-RECORDS", data:data,staffName:staffName, req:req })
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
};

// registration records
export const registrationRecords = async(req,res)=>{
    const cacheKey = 'Registration';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log('Registration Records Connected Successfully')
            console.log('cache miss')
            const sqlquery = `SELECT
            registration.id, 
            first_name, 
            middle_name, 
            last_name,
            registration.registration_number,
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
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,  
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM registration
            INNER JOIN clientdetails 
            ON registration.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Cache hit')
        }
        const staffName = req.user.name
        res.render('records/registration-records', {PageTitle: "REGISTRATION OF CLIENT RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
};
// search for data in registration records
export const registrationRecordsSearch = async(req, res)=>{
    try{
        console.log('Registration Records search connected successfully');
        // retrieving user search input
        const registrationSearch = req.body.registrationSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified
        FROM registration
        INNER JOIN clientdetails 
        ON registation.registration_number = clientdetails.registration_number
        WHERE registration.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + registrationSearch + '%', '%' + registrationSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/registration-records', {PageTitle: "REGISTRATION OF CLIENT RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// amendment of records records
export const amendmentOfRecords = async(req,res)=>{
    const cacheKey = 'Amendment';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log('Amendment of Records Records Successfully Connected')
            console.log('cache miss')
            const sqlquery = `SELECT 
            amendment_of_records.id, 
            first_name, 
            middle_name, 
            last_name,
            amendment_of_records.registration_number,
            request_type,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office, 
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM amendment_of_records
            INNER JOIN clientdetails 
            ON amendment_of_records.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Amendment cache hit')
        }
        const staffName = req.user.name
        res.render('records/amendmentofrecords-records', {PageTitle: "AMENDMENT OF RECORDS-RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
// search for data in amendment of reords records
export const amendmentOfRecordsSearch = async(req, res)=>{
    try{
        console.log('amendment of records search connected successfully');
        // retrieving user search input
        const amendmentSearch = req.body.amendmentSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_request, '%d.%m.%Y %H:%i') AS date_of_request, 
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM amendment_of_records 
        INNER JOIN clientdetails 
        ON amendment_of_records.registration_number = clientdetails.registration_number
        WHERE amendment_of_records.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + amendmentSearch + '%', '%' + amendmentSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter, )
        const staffName = req.user.name
        res.render('records/amendmentofrecords-records', {PageTitle: "AMENDMENT OF RECORDS-RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// certificate collection records
export const certificateCollectionRecords = async(req,res)=>{
    const cacheKey = 'Certificate Collection';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log('Certificate collection Records successfully connected')
            console.log('cache miss')
            const sqlquery = `SELECT
            certificate_collection.id, 
            first_name, 
            middle_name, 
            last_name,
            certificate_collection.registration_number,
            working_institution,
            badge_issued,
            induction_items_issued,
            request_type,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office, 
            DATE_FORMAT(date_on_certificate, '%d/%m/%Y') AS date_on_certificate,
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM certificate_collection 
            INNER JOIN clientdetails 
            ON certificate_collection.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Amendment cache hit')
        }
        const staffName = req.user.name
        res.render('records/certificatecollection-records', {PageTitle: "CERTIFICATE COLLECTION RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
// search for data in certificate collection records
export const certificateCollectionRecordsSearch = async(req, res)=>{
    try{
        console.log('certificate collection search connected successfully');
        // retrieving user search input
        const certificatecollectionSearch = req.body.certificatecollectionSearch;
        const searchQuery = `SELECT *,
        DATE_FORMAT(date_on_certificate, '%d/%m/%Y') AS date_on_certificate, 
        DATE_FORMATdate_of_request, '%d/%m/%Y') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM certificate_collection 
        INNER JOIN clientdetails ON certificate_collection.registration_number = clientdetails.registration_number
        WHERE certificate_collection.registration_number LIKE? 
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + certificatecollectionSearch + '%', '%' + certificatecollectionSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter, )
        const staffName = req.user.name
        res.render('records/certificatecollection-records', {PageTitle: "CERTIFICATE COLLECTION RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// duplicate receipt records
export const duplicateReceiptRecords  = async(req,res)=>{
    const cacheKey = 'duplicate';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Duplicate Receipt Records Successfull")
            console.log('cache miss')
            const sqlquery = `SELECT 
            duplicate_receipt.id, 
            first_name, 
            middle_name, 
            last_name,
            duplicate_receipt.registration_number,
            request_type,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,  
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM duplicate_receipt
            INNER JOIN clientdetails 
            ON duplicate_receipt.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)        
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Duplicate Receipt cache hit')
        } 
        const staffName = req.user.name
        res.render('records/duplicatereceipt-records', {PageTitle: "DUPLICATE RECEIPT RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
// search for data in duplicate receipt records
export const duplicateReceiptRecordsSearch = async(req, res)=>{
    try{
        console.log('duplicate receipt search connected successfully');
        // retrieving user search input
        const duplicateSearch = req.body.duplicateSearch;
        const searchQuery = `SELECT *,  
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM duplicate_receipt
        INNER JOIN clientdetails ON duplicate_receipt.registration_number = clientdetails.registration_number
        WHERE duplicate_receipt.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + duplicateSearch + '%', '%' + duplicateSearch + '%' ];
        const [data] = await database.query(searchQuery, searchParameter, )
        const staffName = req.user.name
        res.render('records/duplicatereceipt-records', {PageTitle: "DUPLICATE RECEIPT RECORDS", data:data, staffName:staffName,req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// examiners pack records
export const examinersPackRecords  = async(req,res)=>{
    const cacheKey = 'examiners';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Examiners Pack Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            examiners_pack.id, 
            first_name, 
            middle_name, 
            last_name,
            examiners_pack.registration_number,
            request_type,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,   
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM examiners_pack
            INNER JOIN clientdetails 
            ON examiners_pack.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Examiners Pack cache hit')
        } 
        const staffName = req.user.name
        res.render('records/examinerspack-records', {PageTitle: "EXAMINERS PACK RECORDS", data:cacheData, staffName:staffName, req:req});
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
// search for data in examiners pack records
export const examinersPackRecordsSearch = async(req, res)=>{
    try{
        console.log('examiners pack search connected successfully');
        // retrieving user search input
        const examinersSearch = req.body.examinersSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM examiners_pack 
        INNER JOIN clientdetails 
        ON examiners_pack.registration_number = clientdetails.registration_number
        WHERE examiners_pack.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + examinersSearch + '%', '%' + examinersSearch + '%' ];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/examinerspack-records', {PageTitle: "EXAMINERS PACK RECORDS", data:data, staffName:staffName, req:req});
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// logbook submission records
export const logbookSubmissionRecords  = async(req,res)=>{
    const cacheKey = 'logbook submission';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Logbook Submission Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            logbook_submission.id, 
            first_name, 
            middle_name, 
            last_name,
            logbook_submission.registration_number,
            facility,
            attended_to_by_client_service,
            modified_by_client_service,   
            DATE_FORMAT(date_of_submission, '%d/%m/%Y %H:%i') AS date_of_submission,  
            DATE_FORMAT(date_of_commencement_of_school, '%d/%m/%Y') AS date_of_commencement_of_school, DATE_FORMAT(date_of_completion, '%d/%m/%Y') AS date_of_completion,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified
            FROM logbook_submission
            INNER JOIN clientdetails 
            ON logbook_submission.registration_number = clientdetails.registration_number 
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Logbook Submission cache hit')
        }
        const staffName = req.user.name
        res.render('records/logbooksubmission-records', {PageTitle: "LOGBOOK SUBMISSION RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
// search for data in logbook submission records
export const logbookSubmissionRecordsSearch = async(req, res)=>{
    try{
        console.log('Logbook submission search connected successfully');
        // retrieving user search input
        const logbookSearch = req.body.logbookSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_submission, '%d/%m/%Y %H:%i') AS date_of_submission, 
        DATE_FORMAT(date_of_commencement_of_school, '%d/%m/%Y') AS date_of_commencement_of_school, DATE_FORMAT(date_of_completion, '%d/%m/%Y') AS date_of_completion,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM logbook_submission 
        INNER JOIN clientdetails 
        ON logbook_submission.registration_number = clientdetails.registration_number
        WHERE logbook_submission.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + logbookSearch + '%', '%' + logbookSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/logbooksubmission-records', {PageTitle: "LOGBOOK SUBMISSION RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// pin ain collection records
export const pinainCollectionRecords = async(req,res)=>{
    const cacheKey = 'pin ain collection';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Pin Ain Collection Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            pin_ain_collection.id, 
            first_name, 
            middle_name, 
            last_name,
            pin_ain_collection.registration_number,
            collection_type,
            collected_by,
            taken_by,
            taken_phone,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,    
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified
            FROM pin_ain_collection 
            INNER JOIN clientdetails 
            ON pin_ain_collection.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Pin Ain Collection cache hit')
        }
        const staffName = req.user.name
        res.render('records/pinaincollection-records', {PageTitle: "PIN/AIN COLLECTION RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
// search for data in pin ain collection records
export const pinainCollectionRecordsSearch = async(req, res)=>{
    try{
        console.log('pin ain collection search connected successfully');
        // retrieving user search input
        const pinaincollectionSearch = req.body.pinaincollectionSearch;
        const searchQuery = `SELECT *,
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request, 
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified,
        FROM pin_ain_collection 
        INNER JOIN clientdetails 
        ON pin_ain_collection.registration_number = clientdetails.registration_number
        WHERE pin_ain_collection.registration_number LIKE
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + pinaincollectionSearch + '%', '%' + pinaincollectionSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/pinaincollection-records', {PageTitle: "PIN/AIN COLLECTION RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// pin ain renewal records
export const pinainRenewalRecords = async(req,res)=>{
    const cacheKey = 'pin ain renewal';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Pin Ain Renewal Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            pin_ain_renewal.id, 
            first_name, 
            middle_name, 
            last_name,
            pin_ain_renewal.registration_number,
            request_type,
            pin_ain_number,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office, 
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_pin_ain_issued, '%d/%m/%Y') AS date_pin_ain_issued, 
            DATE_FORMAT(date_pin_ain_expired, '%d/%m/%Y') AS date_pin_ain_expired, 
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM pin_ain_renewal 
            INNER JOIN clientdetails 
            ON pin_ain_renewal.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Pin Ain Renewal cache hit')
        } 
        const staffName = req.user.name
        res.render('records/pinainrenewal-records', {PageTitle: "PIN/AIN RENEWAL RECORDS", data:cacheData, staffName:staffName, req:req})  
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    } 
}
// search for data in pin ain renewal collection records
export const pinainRenewalRecordsSearch = async(req, res)=>{
    try{
        console.log('pin ain renewal search connected successfully');
        // retrieving user search input
        const renewalSearch = req.body.renewalSearch;
        const searchQuery = `SELECT *,
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_pin_ain_issued, '%d/%m/%Y') AS date_pin_ain_issued, 
        DATE_FORMAT(date_pin_ain_expired, '%d/%m/%Y') AS date_pin_ain_expired, 
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified
        FROM pin_ain_renewal 
        INNER JOIN clientdetails 
        ON pin_ain_renewal.registration_number = clientdetails.registration_number
        WHERE pin_ain_renewal.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + renewalSearch + '%', '%' + renewalSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/pinainrenewal-records', {PageTitle: "PIN/AIN RENEWAL RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// re engagement records
export const reEngagementRecords = async(req,res)=>{
    const cacheKey = 're engagement';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Re-Engagement Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            re_engagement.id, 
            first_name, 
            middle_name, 
            last_name,
            re_engagement.registration_number,
            request_type,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,  
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM re_engagement 
            INNER JOIN clientdetails 
            ON re_engagement.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Re-Engagement cache hit')
        }
        const staffName = req.user.name
        res.render('records/reengagement-records', {PageTitle: "RE-ENGAGEMENT OF CLIENT RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
export const reEngagementRecordsSearch = async(req, res)=>{
    try{
        console.log('re engagement records search connected successfully');
        // retrieving user search input
        const reengagementSearch = req.body.reengagementSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request, 
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM re_engagement 
        INNER JOIN clientdetails 
        ON re_engagement.registration_number = clientdetails.registration_number
        WHERE re_engagement.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + reengagementSearch + '%', '%' + reengagementSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/reengagement-records', {PageTitle: "RE-ENGAGEMENT OF CLIENT RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// replacement records
export const replacementRecords = async(req,res)=>{
    const cacheKey = 'replacement';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Replacement of Pin Ain Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            replacement_of_pin_ain.id, 
            first_name, 
            middle_name, 
            last_name,
            replacement_of_pin_ain.registration_number,
            request_type,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,   
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM replacement_of_pin_ain
            INNER JOIN clientdetails 
            ON replacement_of_pin_ain.registration_number = clientdetails.registration_number 
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Replacement cache hit')
        }
        const staffName = req.user.name
        res.render('records/replacement-records', {PageTitle: "REPLACEMENT OF PIN/AIN RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
export const replacementRecordsSearch = async(req, res)=>{
    try{
        console.log('replacement records search connected successfully');
        // retrieving user search input
        const replacementSearch = req.body.replacementSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM replacement_of_pin_ain 
        INNER JOIN clientdetails 
        ON replacement_of_pin_ain.registration_number = clientdetails.registration_number
        WHERE replacement_of_pin_ain.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + replacementSearch + '%','%' + replacementSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/replacement-records', {PageTitle: "REPLACEMENT OF PIN/AIN RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// verification records
export const verificationRecords = async(req,res)=>{
    const cacheKey = 'verification';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Verification Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            verification.id, 
            first_name, 
            middle_name, 
            last_name,
            verification.registration_number,
            verification_type,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,   
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM verification
            INNER JOIN clientdetails 
            ON verification.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Verification cache hit')
        }
        const staffName = req.user.name
        res.render('records/verification-records', {PageTitle: "VERIFICATION OF CLIENT RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
export const verificationRecordsSearch = async(req, res)=>{
    try{
        console.log('verification records search connected successfully');
        // retrieving user search input
        const verificationSearch = req.body.verificationSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM verification 
        INNER JOIN clientdetails 
        ON verification.registration_number = clientdetails.registration_number
        WHERE verification.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + verificationSearch + '%', '%' + verificationSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/verification-records', {PageTitle: "VERIFICATION OF CLIENT RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// request for certificate
export const requestForCertificateRecords = async(req,res)=>{
    const cacheKey = 'request for certificate';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Request for Certificate Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            request_for_certificate.id, 
            first_name, 
            middle_name, 
            last_name,
            request_for_certificate.registration_number,
            request_type,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,   
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM request_for_certificate
            INNER JOIN clientdetails 
            ON request_for_certificate.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Request for Certificate cache hit')
        }
        const staffName = req.user.name
        res.render('records/requestforcertificate-records', {PageTitle: "REQUEST FOR CERTIFICATE RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
export const requestForCertificateRecordsSearch = async(req, res)=>{
    try{
        console.log('request for certificate records search connected successfully');
        // retrieving user search input
        const requestforcertificateSearch = req.body.requestforcertificateSearch;
        const searchQuery = `SELECT *,
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM request_for_certificate 
        INNER JOIN clientdetails 
        ON request_for_certificate.registration_number = clientdetails.registration_number
        WHERE request_for_certificate.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + requestforcertificateSearch + '%', '%' + requestforcertificateSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/requestforcertificate-records', {PageTitle: "REQUEST FOR CERTIFICATE RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// request for logbook
export const requestForLogbookRecords = async(req,res)=>{
    const cacheKey = 'request for certificate';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Request for Logbook Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            request_for_logbook.id, 
            first_name, 
            middle_name, 
            last_name,
            request_for_logbook.registration_number,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,    
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM request_for_logbook 
            INNER JOIN clientdetails 
            ON request_for_logbook.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Request for Logbook cache hit')
        }
        const staffName = req.user.name
        res.render('records/requestforlogbook-records', {PageTitle: "REQUEST FOR LOGBOOK RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
export const requestForLogbookRecordsSearch = async(req, res)=>{
    try{
        console.log('request for logbook records search connected successfully');
        // retrieving user search input
        const requestforlogbookSearch = req.body.requestforlogbookSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM request_for_logbook 
        INNER JOIN clientdetails 
        ON request_for_logbook.registration_number = clientdetails.registration_number
        WHERE request_for_logbook.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + requestforlogbookSearch + '%', '%' + requestforlogbookSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter)
        const staffName = req.user.name
        res.render('records/requestforlogbook-records', {PageTitle: "REQUEST FOR LOGBOOK RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// request for pin ain
export const requestforpinainRecords = async(req,res)=>{
    const cacheKey = 'request for pin ain';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Request For Pin Ain Records connection Successful");
            console.log('cache miss')
            const sqlquery = 
            `SELECT 
            request_for_pin_ain.id, 
            first_name, 
            middle_name, 
            last_name,
            request_for_pin_ain.registration_number,
            attended_to_by_client_service,
            modified_by_client_service,   
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM request_for_pin_ain
            INNER JOIN clientdetails 
            ON request_for_pin_ain.registration_number = clientdetails.registration_number 
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Request For Pin Ain cache hit')
        }
        const staffName = req.user.name
        res.render('records/requestforpinain-records', {PageTitle: "REQUEST FOR PIN/AIN RECORDS", data:cacheData, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
export const requestforpinainRecordsSearch = async(req, res)=>{
    try{
        console.log('request for pin ain search connected successfully');
        // retrieving user search input
        const requestforpinainSearch = req.body.requestforpinainSearch;
        const searchQuery = `SELECT *, 
        DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
        DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
        FROM request_for_pin_ain 
        INNER JOIN clientdetails 
        ON request_for_pin_ain.registration_number = clientdetails.registration_number
        WHERE request_for_pin_ain.registration_number LIKE?
        OR clientdetails.last_name LIKE?`;
        const searchParameter = ['%' + requestforpinainSearch + '%', '%' + requestforpinainSearch + '%'];
        const [data] = await database.query(searchQuery, searchParameter, )
        const staffName = req.user.name
        res.render('records/requestforpinain-records', {PageTitle: "REQUEST FOR PIN/AIN RECORDS", data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// request for results slip
export const requestForResultsSlipRecords = async(req,res)=>{
    const cacheKey = 'request for results slip';
    let cacheData = mycache.get(cacheKey)
    try{
        if(!cacheData){
            console.log("Results Slip Records connection Successful");
            console.log('cache miss')
            const sqlquery = `SELECT 
            request_for_results_slip.id, 
            first_name, 
            middle_name, 
            last_name,
            request_for_results_slip.registration_number,
            amount_paid,
            bank,
            receipt_number,
            transaction_reference_number,
            attended_to_by_client_service,
            attended_to_by_account_office,
            modified_by_client_service,
            modified_by_account_office,    
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM request_for_results_slip 
            INNER JOIN clientdetails 
            ON request_for_results_slip.registration_number = clientdetails.registration_number
            ORDER BY date_of_request DESC`;
            const [data] = await database.query(sqlquery)       
            mycache.set(cacheKey,data);
            cacheData = data;
        }else{
            console.log('Results Slip Records cache hit')
        }
        const staffName = req.user.name
        res.render('records/requestforresultsslip-records', {PageTitle: "REQUEST FOR RESULTS SLIP RECORDS", data:cacheData, staffName:staffName, req:req});
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
export const requestForResultsSlipRecordsSearch = async(req, res)=>{
    try{
        if(!cacheData){
            console.log('request for results slip search connected successfully');
            // retrieving user search input
            const requestforresultsslipSearch = req.body.requestforresultsslipSearch;
            const searchQuery = `SELECT *,  
            DATE_FORMAT(date_of_request, '%d/%m/%Y %H:%i') AS date_of_request,
            DATE_FORMAT(date_modified, '%d/%m/%Y %H:%i') AS date_modified 
            FROM request_for_results_slip 
            INNER JOIN clientdetails 
            ON request_for_results_slip.registration_number = clientdetails.registration_number
            WHERE request_for_results_slip.registration_number LIKE?
            OR clientdetails.last_name LIKE?`;
            const searchParameter = ['%' + requestforresultsslipSearch + '%', '%' + requestforresultsslipSearch + '%'];
            const [data] = await database.query(searchQuery, searchParameter)
        
        }else{
            console.log('requestforresultsslip cache hit')
        }
        const staffName = req.user.name
        res.render('records/requestforresultsslip-records', {PageTitle: "REQUEST FOR RESULTS SLIP RECORDS", data:data, staffName:staffName, req:req});
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}



