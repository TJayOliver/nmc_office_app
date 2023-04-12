import excela from 'json2csv'
const excel = excela.Parser
import {database}  from '../database/database.js'

export const generateReport = (req, res)=>{
    const staffName = req.user.name;
    res.render('generate-report', { PageTitle: "ALL RECORDS", staffName: staffName, req:req })
}

// all records view
export const allRecordsView = (req, res) => {
    const staffName = req.user.name;
    res.render('records/allRecords', { PageTitle: "ALL RECORDS", staffName: staffName, req:req })
}

// displaying all records on the table
export const allRecordsTable = async(req, res) => {
    const amendmentQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request 
        FROM amendment_of_records 
        INNER JOIN clientdetails 
        ON amendment_of_records.registration_number = clientdetails.registration_number`, 
        certificatecollectionQuery = `SELECT first_name,middle_name,last_name,
        bank, receipt_number, transaction_reference_number, request_type, amount_paid,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM certificate_collection 
        INNER JOIN clientdetails 
        ON certificate_collection.registration_number = clientdetails.registration_number`,
        duplicateQuery = `SELECT first_name,middle_name,last_name, 
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request 
        FROM duplicate_receipt 
        INNER JOIN clientdetails 
        ON duplicate_receipt.registration_number = clientdetails.registration_number`,
        examinerspackQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request 
        FROM examiners_pack 
        INNER JOIN clientdetails 
        ON examiners_pack.registration_number = clientdetails.registration_number`,
        pinainRenewalQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number,request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM pin_ain_renewal 
        INNER JOIN clientdetails 
        ON pin_ain_renewal.registration_number = clientdetails.registration_number`,
        registrationQuery = `SELECT first_name,middle_name,last_name, 
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM registration 
        INNER JOIN clientdetails 
        ON registration.registration_number = clientdetails.registration_number`,
        registrationPenaltyQuery = `SELECT first_name,middle_name,last_name, 
        late_registration_amount AS amount_paid, late_registration_bank AS bank, 
        late_registration_receipt_number AS receipt_number , 
        late_registration_transaction_reference_number AS transaction_reference_number, 
        late_registration AS request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM registration 
        INNER JOIN clientdetails 
        ON registration.registration_number = clientdetails.registration_number`,
        reEngagementQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request 
        FROM re_engagement 
        INNER JOIN clientdetails 
        ON re_engagement.registration_number = clientdetails.registration_number`,
        resultsSlipQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM request_for_results_slip
        INNER JOIN clientdetails 
        ON request_for_results_slip.registration_number = clientdetails.registration_number`,
        replacementQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM replacement_of_pin_ain
        INNER JOIN clientdetails 
        ON replacement_of_pin_ain.registration_number = clientdetails.registration_number`,
        requestforCertificateQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM request_for_certificate
        INNER JOIN clientdetails 
        ON request_for_certificate.registration_number = clientdetails.registration_number`,
        requestforLogbookQuery = `SELECT first_name,middle_name,last_name, 
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM request_for_logbook
        INNER JOIN clientdetails 
        ON request_for_logbook.registration_number = clientdetails.registration_number`,
        verificationQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, verification_type AS request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM verification
        INNER JOIN clientdetails 
        ON verification.registration_number = clientdetails.registration_number`
    ;
    try{
        let results = {}; // an object to hold the results of each query
        console.log('All records Table Displayed')
        const [data1] = await database.query(amendmentQuery);
        results.amendment = data1;
        const [data2] = await database.query(certificatecollectionQuery);
        results.certificate = data2;
        const [data3] = await database.query(duplicateQuery);
        results.duplicate = data3;
        const [data4] = await database.query(examinerspackQuery);
        results.examinerspack = data4;
        const [data5] = await database.query(pinainRenewalQuery);
        results.pinainrenewal = data5;
        const [data6] = await database.query(registrationQuery);
        results.registration = data6;
        const [data7] = await database.query(registrationPenaltyQuery);
        results.registrationPenalty = data7;
        const [data8] = await database.query(reEngagementQuery);
        results.reengagement = data8;
        const [data9] = await database.query(replacementQuery);
        results.replacement = data9;
        const [data10] = await database.query(requestforCertificateQuery);
        results.requestforcertificate = data10;
        const [data11] = await database.query(requestforLogbookQuery);
        results.requestforlogbook = data11;
        const [data12] = await database.query(resultsSlipQuery);
        results.resultsslip = data12;
        const [data13] = await database.query(verificationQuery);
        results.verification = data13;

        const staffName = req.user.name;
        res.render("records/allRecords", {PageTitle: "ALL RECORDS", 
        amendment: results.amendment, certificate:results.certificate, reengagement: results.reengagement, duplicate:results.duplicate, examinerspack:results.examinerspack,
        pinainrenewal:results.pinainrenewal,registration:results.registration, replacement:results.replacement, resultsslip:results.resultsslip, requestforcertificate : results.requestforcertificate, requestforlogbook:results.requestforlogbook,
        verification:results.verification, registrationPenalty : results.registrationPenalty, staffName : staffName, req:req });
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// exporting all records to excel
export const allRecordsExport = async(req, res) => {
    let results = {}; // an object to hold the results of each query

    const amendmentQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request 
        FROM amendment_of_records 
        INNER JOIN clientdetails 
        ON amendment_of_records.registration_number = clientdetails.registration_number`, 

        certificatecollectionQuery = `SELECT first_name,middle_name,last_name,
        bank, receipt_number, transaction_reference_number, request_type,amount_paid,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM certificate_collection 
        INNER JOIN clientdetails 
        ON certificate_collection.registration_number = clientdetails.registration_number`,

        duplicateQuery = `SELECT first_name,middle_name,last_name, 
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request 
        FROM duplicate_receipt 
        INNER JOIN clientdetails 
        ON duplicate_receipt.registration_number = clientdetails.registration_number`,

        examinerspackQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request 
        FROM examiners_pack 
        INNER JOIN clientdetails 
        ON examiners_pack.registration_number = clientdetails.registration_number`,

        pinainRenewalQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, renewal_type AS request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM pin_ain_renewal 
        INNER JOIN clientdetails 
        ON pin_ain_renewal.registration_number = clientdetails.registration_number`,

        registrationQuery = `SELECT first_name,middle_name,last_name, 
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM registration 
        INNER JOIN clientdetails 
        ON registration.registration_number = clientdetails.registration_number`,

        registrationPenaltyQuery = `SELECT first_name,middle_name,last_name, 
        late_registration_amount AS amount_paid, late_registration_bank AS bank, 
        late_registration_receipt_number AS receipt_number , 
        late_registration_transaction_reference_number AS transaction_reference_number, 
        late_registration AS request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM registration 
        INNER JOIN clientdetails 
        ON registration.registration_number = clientdetails.registration_number`,

        reEngagementQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request 
        FROM re_engagement 
        INNER JOIN clientdetails 
        ON re_engagement.registration_number = clientdetails.registration_number`,

        resultsSlipQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM request_for_results_slip
        INNER JOIN clientdetails 
        ON request_for_results_slip.registration_number = clientdetails.registration_number`,

        replacementQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM replacement_of_pin_ain
        INNER JOIN clientdetails 
        ON replacement_of_pin_ain.registration_number = clientdetails.registration_number`,

        requestforCertificateQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM request_for_certificate
        INNER JOIN clientdetails 
        ON request_for_certificate.registration_number = clientdetails.registration_number`,

        requestforLogbookQuery = `SELECT first_name,middle_name,last_name, 
        amount_paid, bank, receipt_number, transaction_reference_number, request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM request_for_logbook
        INNER JOIN clientdetails 
        ON request_for_logbook.registration_number = clientdetails.registration_number`,

        verificationQuery = `SELECT first_name,middle_name,last_name,
        amount_paid, bank, receipt_number, transaction_reference_number, verification_type AS request_type,
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request 
        FROM verification
        INNER JOIN clientdetails 
        ON verification.registration_number = clientdetails.registration_number`
    ;
    try{
        console.log('All records Table Displayed')
        const [data1] = await database.query(amendmentQuery);
        results.amendment = data1;
        const [data2] = await database.query(certificatecollectionQuery);
        results.certificate = data2;
        const [data3] = await database.query(duplicateQuery);
        results.duplicate = data3;
        const [data4] = await database.query(examinerspackQuery);
        results.examinerspack = data4;
        const [data5] = await database.query(pinainRenewalQuery);
        results.pinainrenewal = data5;
        const [data6] = await database.query(registrationQuery);
        results.registration = data6;
        const [data7] = await database.query(registrationPenaltyQuery);
        results.registrationPenalty = data7;
        const [data8] = await database.query(reEngagementQuery);
        results.reengagement = data8;
        const [data9] = await database.query(replacementQuery);
        results.replacement = data9;
        const [data10] = await database.query(requestforCertificateQuery);
        results.requestforcertificate = data10;
        const [data11] = await database.query(requestforLogbookQuery);
        results.requestforlogbook = data11;
        const [data12] = await database.query(resultsSlipQuery);
        results.resultsslip = data12;
        const [data13] = await database.query(verificationQuery);
        results.verification = data13;

        const amendment = results.amendment, certificate = results.certificate, reengagement = results.reengagement,
        duplicate = results.duplicate, examinerspack = results.examinerspack, pinainrenewal = results.pinainrenewal,
        registration= results.registration, replacement=results.replacement, resultsslip = results.resultsslip,
        requestforcertificate=results.requestforcertificate, requestforlogbook=results.requestforlogbook,
        verification=results.verification, registrationPenalty=results.registrationPenalty ;
        
        const data = registration.concat(registrationPenalty,pinainrenewal, replacement, 
        certificate,duplicate, amendment , examinerspack,requestforcertificate,
        requestforlogbook, resultsslip,reengagement, verification );
        
        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data));
        const jsonfile = new excel({file});
        const excelfile = jsonfile.parse(file)
        
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=All RECORDS.csv");
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// select specific record POST
export const selectRecord = async(req, res) =>{
    const {selectrecord, selectdatefrom, selectdateto} = req.body;
    const recordname = selectrecord.toUpperCase(), datefrom = selectdatefrom, dateto = selectdateto;
    try{
        console.log('Connected to Database to retrieved records')
        const selectQuery = `SELECT *, first_name, middle_name, last_name, 
        DATE_FORMAT(date_of_request, '%d/%m/%Y') AS date_of_request
        FROM ${selectrecord} 
        INNER JOIN clientdetails
        ON ${selectrecord}.registration_number = clientdetails.registration_number
        WHERE date_of_request BETWEEN ? AND ?`;
        const [data] = await database.query(selectQuery, [selectdatefrom, selectdateto]);
        console.log('Records Retrieved')

        const total = data.length;

        const staffName = req.user.name;
        res.render('records/select-record-table',{ PageTitle: "SELECT RECORD", staffName: staffName, data:data, req:req, recordname, datefrom, dateto, total })
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror');
    }
}

// export specific record POST
export const selectExport = async(req, res) =>{
    const {selectrecord, selectdatefrom, selectdateto} = req.query;
    const recordname = selectrecord, datefrom = selectdatefrom, dateto = selectdateto;
    try{
        console.log('Connected to Database to export records')
        const selectQuery = `SELECT first_name,middle_name,last_name,
        bank, receipt_number, transaction_reference_number, request_type, amount_paid,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM ${selectrecord} 
        INNER JOIN clientdetails
        ON ${selectrecord}.registration_number = clientdetails.registration_number
        WHERE date_of_request BETWEEN ? AND ?`;
        const [data] = await database.query(selectQuery, [selectdatefrom, selectdateto]);
        console.log('Records Retrieved')

        // converting data into excel 
        const file = await JSON.parse(JSON.stringify(data));
        const jsonfile = new excel({file});
        const excelfile = jsonfile.parse(file)
        
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${recordname}-${datefrom}to${dateto}.csv`);
        res.status(200).end(excelfile)
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror');
    }
}

// export detailed record POST
export const detailedReport = async(req, res)=>{
    const {selectrecord, selectdatefrom, selectdateto} = req.body;
    const recordname = selectrecord.toUpperCase(), datefrom = selectdatefrom, dateto = selectdateto;
    try{
        console.log('Connected to Database to export records')
        const selectQuery = `SELECT *,
        DATE_FORMAT(date_of_request,'%d/%m/%Y') AS date_of_request  
        FROM ${selectrecord} 
        INNER JOIN clientdetails
        ON ${selectrecord}.registration_number = clientdetails.registration_number
        WHERE date_of_request BETWEEN ? AND ?`;
        const [data] = await database.query(selectQuery, [selectdatefrom, selectdateto]);
        console.log('Records Retrieved');
        // total number
        const totalnumber = data.length;
        // total programs
        const RGN = data.filter(prog => prog.programme === 'RGN'), RGNcount = RGN.length,
            RM = data.filter(prog => prog.programme === 'RM'), RMcount = RM.length,
            RMN = data.filter(prog => prog.programme === 'RMN'), RMNcount = RMN.length,
            RCN = data.filter(prog => prog.programme === 'RCN'), RCNcount = RCN.length,
            MID = data.filter(prog => prog.programme === 'MID'), MIDcount = MID.length,
            PHN = data.filter(prog => prog.programme === 'PHN'), PHNcount = PHN.length,
            HAC = data.filter(prog => prog.programme === 'HAC'), HACcount = HAC.length,
            NAC = data.filter(prog => prog.programme === 'NAC'), NACcount = NAC.length,
            NAP = data.filter(prog => prog.programme === 'NAP'), NAPcount = NAP.length,
            CHN = data.filter(prog => prog.programme === 'CHN'), CHNcount = CHN.length,
            SSN = data.filter(prog => prog.programme === 'SSN'), SSNcount = SSN.length,
            NP = data.filter(prog => prog.programme === 'NP'), NPcount = NP.length,
            OPN = data.filter(prog => prog.programme === 'OPN'), OPNcount = OPN.length,
            PON = data.filter(prog => prog.programme === 'PON'), PONcount = PON.length,
            AMEN = data.filter(prog => prog.programme === 'AMEN'), AMENcount = AMEN.length,
            ENT = data.filter(prog => prog.programme === 'ENT'), ENTcount = ENT.length,
            CCN = data.filter(prog => prog.programme === 'CCN'), CCNcount = CCN.length,
            ENUR = data.filter(prog => prog.programme === 'CCN'), ENURcount = ENUR.length
        ;
        // total service request
        const amendmentChangeofname = data.filter(request => request.request_type === 'CHANGE OF NAME'), 
            changeofname = amendmentChangeofname.length,
            amendmentChangeofdob = data.filter(request => request.request_type === 'CHANGE OF DATE OF BIRTH'),
            changeofdob = amendmentChangeofdob.length,
            // certification collection
            certificatepenalty = data.filter(request => request.request_type === 'PENALTY FOR CERTIFICATE'), certpenalty = certificatepenalty.length,
            // pin/ain collection
            collectpinnew = data.filter(request => request.request_type === 'NEW PIN'), 
            newpin = collectpinnew.length,
            collectainnew = data.filter(request =>request.request_type === 'NEW AIN'), 
            newain = collectainnew.length, 
            collectionrenewal = data.filter(request =>request.request_type === 'RENEWAL'), 
            collectrenewal = collectionrenewal.length, 
            collectionreplacement = data.filter(request =>request.request_type === 'REPLACEMENT'), collectreplacement = collectionreplacement.length, 
            collectionchangeofcard = data.filter(request =>request.request_type === 'CHANGE OF CARD'), collectchangeofcard = collectionchangeofcard.length,
            // pin/ain renewal
            renewpin = data.filter(request => request.request_type === 'PIN RENEWAL'),
            pinrenewal = renewpin.length,
            renewain = data.filter(request => request.request_type === 'AIN RENEWAL'),
            ainrenewal = renewain.length,
            //registration
            lateregistration = data.filter(request => request.late_registration === 'PENALTY FOR REGISTRATION'),
            penaltyforregistration = lateregistration.length,
            // request for pin
            pinrequest = data.filter(request => request.request_type === 'REQUEST FOR PIN'),
            requestforpin = pinrequest.length,
            ainrequest = data.filter(request => request.request_type === 'REQUEST FOR AIN'),
            requestforain = ainrequest.length,
            // request for certificate
            correctionofname = data.filter(request => request.request_type === 'CORRECTION OF NAME ON CERTIFICATE'), 
            correctname = correctionofname.length,
            correctionofregistrationnumber = data.filter(request => request.request_type === 'CORRECTION OF REGISTRATION NUMBER ON CERTIFICATE'), 
            correctregistrationnumber = correctionofregistrationnumber.length,
            correctionofdate = data.filter(request => request.request_type === 'CORRECTION OF DATE ON CERTIFICATE'), 
            correctdate = correctionofdate.length,
            duplicatecertificate = data.filter(request => request.request_type === 'DUPLICATE CERTIFICATE'), 
            collectduplicatecertificate = duplicatecertificate.length,
            otherregions = data.filter(request => request.request_type === 'REQUEST FROM OTHER REGIONS'), 
            collectotherregion = otherregions.length,
            // replacement of pin ain
            defectivepinain = data.filter(request => request.request_type === 'VALID BUT DEFECTIVE PIN/AIN'),
            defective = defectivepinain.length,
            misplacepinain = data.filter(request => request.request_type === 'MISPLACED PIN/AIN'),
            misplaced = misplacepinain.length
        ;

        const staffName = req.user.name;
        res.render('detailed-report', { PageTitle: "DETAILED REPORT", staffName: staffName, req:req, data:data, recordname,datefrom, dateto,totalnumber,RGNcount, RMcount,RMNcount,RCNcount,MIDcount,PHNcount,HACcount,NACcount,NAPcount,CHNcount,SSNcount,NPcount,OPNcount,PONcount,AMENcount,ENTcount,CCNcount, ENURcount, changeofname, changeofdob, certpenalty, newpin, newain, collectrenewal, collectreplacement, collectchangeofcard, pinrenewal, ainrenewal, penaltyforregistration, requestforpin, requestforain, correctname, correctregistrationnumber,correctdate, collectduplicatecertificate,collectotherregion, defective, misplaced});
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror');
    }
    
}