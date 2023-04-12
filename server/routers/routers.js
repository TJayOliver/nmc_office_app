import express from 'express'
export const router = express.Router();

import passport from 'passport'
import {valid} from '../../configurations/validation.js' // User Input validation
import {AdminLock, ClientLock, AccountsLock, EditLock} from '../../configurations/ensureAuthentication.js' // authentication for all pages
import {Administrator, AdministratorForm} from '../controllers/administrator.js' // Administrator Controller
import {clientServiceHomepage, accountOfficeHomepage, adminHomepage, recordsHomepage} from '../controllers/homepage-controllers.js' // homepage controllers
import {detailedReport, generateReport,allRecordsTable,allRecordsExport, selectRecord, selectExport} from '../controllers/generate-report.js' // all records
import {amendmentOfRecords,amendmentOfRecordsSearch, certificateCollectionRecords, certificateCollectionRecordsSearch,clientdetailsRecords,clientdetailsRecordsSearch,duplicateReceiptRecords,duplicateReceiptRecordsSearch,examinersPackRecords,examinersPackRecordsSearch,logbookSubmissionRecords,logbookSubmissionRecordsSearch,pinainCollectionRecords,pinainCollectionRecordsSearch,pinainRenewalRecords,pinainRenewalRecordsSearch,reEngagementRecords,reEngagementRecordsSearch,registrationRecords,registrationRecordsSearch,replacementRecords,replacementRecordsSearch,requestForCertificateRecords,requestForCertificateRecordsSearch,requestForLogbookRecords,requestForLogbookRecordsSearch,requestForResultsSlipRecords,requestForResultsSlipRecordsSearch,requestforpinainRecords,requestforpinainRecordsSearch,verificationRecords,verificationRecordsSearch} from '../controllers/records-controller.js' // records controllers
import {registerStaffForm,registerStaffView,viewStaff, EditStaff, UpdateStaff, DeleteStaff} from '../controllers/admin-controller.js' // Admin controllers
import {clientDetailsDelete,clientDetailsEdit,clientDetailsForm,clientDetailsUpdate,clientDetailsView,FirstRegistration,FirstRegistrationForm} from '../controllers/forms_controller/clientdetails-controller.js' // forms controllers
import {registrationDelete,registrationEdit,registrationExport,registrationForm,registrationUpdate,registrationView} from '../controllers/forms_controller/registration-controller.js'
import {amendmentOfRecordsDelete,amendmentOfRecordsEdit,amendmentOfRecordsExport,amendmentOfRecordsForm,amendmentOfRecordsUpdate,amendmentOfRecordsView} from '../controllers/forms_controller/amendmentofrecords-controller.js'
import {pinainRenewalDelete,pinainRenewalEdit,pinainRenewalExport,pinainRenewalForm,pinainRenewalUpdate,pinainRenewalView} from '../controllers/forms_controller/pinainrenewal-controller.js'
import {certificateCollectionDelete,certificateCollectionEdit,certificateCollectionExport,certificateCollectionForm,certificateCollectionUpdate,certificateCollectionView} from '../controllers/forms_controller/certificatecollection-controller.js'
import {duplicateReceiptDelete,duplicateReceiptEdit,duplicateReceiptExport,duplicateReceiptForm,duplicateReceiptUpdate,duplicateReceiptView} from '../controllers/forms_controller/duplicatereceipt-controller.js'
import {logbookSubmissionDelete,logbookSubmissionEdit,logbookSubmissionExport,logbookSubmissionForm,logbookSubmissionUpdate,logbookSubmissionView} from '../controllers/forms_controller/logbooksubmission-controller.js'
import {pinainCollectionDelete,pinainCollectionEdit,pinainCollectionExport,pinainCollectionForm,pinainCollectionUpdate,pinainCollectionView} from '../controllers/forms_controller/pinaincollection-controller.js'
import {examinersPackDelete,examinersPackEdit,examinersPackExport,examinersPackForm,examinersPackUpdate,examinersPackView} from '../controllers/forms_controller/examinerspack-controller.js'
import {reEngagementDelete,reEngagementEdit,reEngagementExport,reEngagementForm,reEngagementUpdate,reEngagementView} from '../controllers/forms_controller/reengagement-controller.js'
import {requestforpinainDelete,requestforpinainEdit,requestforpinainExport,requestforpinainForm,requestforpinainUpdate,requestforpinainView} from '../controllers/forms_controller/requestforpinain-controller.js'
import {verificationDelete,verificationEdit,verificationExport,verificationForm,verificationUpdate,verificationView} from '../controllers/forms_controller/verification-controller.js'
import {replacementofpinainDelete,replacementofpinainEdit,replacementofpinainExport,replacementofpinainForm,replacementofpinainUpdate,replacementofpinainView} from '../controllers/forms_controller/replacement-controller.js'
import {requestForCertificateDelete,requestForCertificateEdit,requestForCertificateExport,requestForCertificateForm,requestForCertificateUpdate,requestForCertificateView} from '../controllers/forms_controller/requestforcertificate-controller.js'
import {requestForLogbookView,requestForLogbookForm,requestForLogbookEdit,requestForLogbookUpdate,requestForLogbookDelete,requestForLogbookExport} from '../controllers/forms_controller/requestforlogbook-controller.js'
import {requestForResultsSlipDelete,requestForResultsSlipEdit,requestForResultsSlipExport,requestForResultsSlipForm,requestForResultsSlipUpdate,requestForResultsSlipView} from '../controllers/forms_controller/requestforresultslip-controller.js'

// login 
router.get('/', (req, res)=>{
    res.render('login')
}); 

router.post('/', passport.authenticate('staff-login', {failureRedirect:'/'}), (req, res)=>{
    if(req.user.role === 'ADMIN'){
        res.redirect('/admin-homepage')
    }
    if(req.user.role === 'CLIENT SERVICE'){
        res.redirect('/clientservice-homepage')
    }
    if(req.user.role === 'ACCOUNTS'){
        res.redirect('/accountoffice-homepage')
    }
});

// logout
router.get('/logout', (req, res)=>{
    req.session.destroy();
    console.log('Logged Out')
    res.redirect('/')
});

// administrator
router.get('/administrator', Administrator);
router.post('/administrator',  passport.authenticate('administrator-login', {failureRedirect:'/administrator'}), (req, res)=>{
    res.redirect('/register-administrator')
});
router.get('/register-administrator', AdministratorForm)

// homepages routes
router.get('/clientservice-homepage', ClientLock, clientServiceHomepage) // clientservice home page
router.get('/accountoffice-homepage', AccountsLock, accountOfficeHomepage) // accountoffice home page
router.get('/admin-homepage', AdminLock, adminHomepage) // admin home page
router.get('/records',ClientLock, recordsHomepage) // records home page
router.get('/generate-report', EditLock, generateReport) // generate report home page

// staff registration routes
router.get('/register-staff', AdminLock, registerStaffView);
router.post('/register-staff', valid.validation, registerStaffForm);
router.get('/view-staff', AdminLock, viewStaff);
router.get('/edit-staff/:id', AdminLock, EditStaff);
router.post('/edit-staff/:id',valid.validation, AdminLock, UpdateStaff);
router.get('/delete-staff/:id', AdminLock, DeleteStaff);

// forms routes
router.get('/client-details', ClientLock, clientDetailsView) // client details forms
router.post('/client-details', ClientLock, clientDetailsForm)
router.get('/client-details/edit/:id', ClientLock, clientDetailsEdit)
router.post('/client-details/edit/:id', ClientLock, clientDetailsUpdate) 
router.get('/client-details/delete/:id', ClientLock, clientDetailsDelete)

router.get('/first-registration', ClientLock, FirstRegistration) // initial registration forms
router.post('/first-registration', ClientLock, FirstRegistrationForm)

router.get('/registration', ClientLock, registrationView) // registration forms
router.post('/registration', ClientLock, registrationForm)
router.get('/registration/edit/:id', EditLock, registrationEdit)
router.post('/registration/edit/:id',EditLock, registrationUpdate)
router.get('/registration/delete/:id',EditLock, registrationDelete)
router.get('/registration/export',EditLock, registrationExport)

router.get('/amendment-of-records',ClientLock, amendmentOfRecordsView) // amendment of records forms
router.post('/amendment-of-records',ClientLock, amendmentOfRecordsForm)
router.get('/amendment-of-records/edit/:id',EditLock, amendmentOfRecordsEdit)
router.post('/amendment-of-records/edit/:id',EditLock, amendmentOfRecordsUpdate)
router.get('/amendment-of-records/delete/:id',EditLock, amendmentOfRecordsDelete)
router.get('/amendment-of-records/export', EditLock, amendmentOfRecordsExport)

router.get('/certificate-collection',ClientLock, certificateCollectionView) // certificate collection forms
router.post('/certificate-collection',ClientLock, certificateCollectionForm)
router.get('/certificate-collection/edit/:id',EditLock, certificateCollectionEdit)
router.post('/certificate-collection/edit/:id',EditLock, certificateCollectionUpdate)
router.get('/certificate-collection/delete/:id',EditLock, certificateCollectionDelete)
router.get('/certificate-collection/export', EditLock, certificateCollectionExport)

router.get('/duplicate-receipt',ClientLock, duplicateReceiptView) // duplicate receipt forms
router.post('/duplicate-receipt',ClientLock, duplicateReceiptForm)
router.get('/duplicate-receipt/edit/:id',EditLock, duplicateReceiptEdit)
router.post('/duplicate-receipt/edit/:id',EditLock, duplicateReceiptUpdate)
router.get('/duplicate-receipt/delete/:id',EditLock, duplicateReceiptDelete)
router.get('/duplicate-receipt/export', EditLock, duplicateReceiptExport)

router.get('/examiners-pack',ClientLock, examinersPackView) // examiners pack forms
router.post('/examiners-pack',ClientLock, examinersPackForm)
router.get('/examiners-pack/edit/:id',EditLock, examinersPackEdit)
router.post('/examiners-pack/edit/:id',EditLock, examinersPackUpdate)
router.get('/examiners-pack/delete/:id',EditLock, examinersPackDelete)
router.get('/examiners-pack/export', EditLock, examinersPackExport)

router.get('/logbook-submission',ClientLock, logbookSubmissionView) // logbook submission forms
router.post('/logbook-submission',ClientLock, logbookSubmissionForm)
router.get('/logbook-submission/edit/:id',EditLock, logbookSubmissionEdit)
router.post('/logbook-submission/edit/:id',EditLock, logbookSubmissionUpdate)
router.get('/logbook-submission/delete/:id',EditLock, logbookSubmissionDelete)
router.get('/logbook-submission/export', EditLock, logbookSubmissionExport)

router.get('/pin-ain-collection',ClientLock, pinainCollectionView) // pin ain collection forms
router.post('/pin-ain-collection',ClientLock, pinainCollectionForm)
router.get('/pin-ain-collection/edit/:id',EditLock, pinainCollectionEdit)
router.post('/pin-ain-collection/edit/:id',EditLock, pinainCollectionUpdate)
router.get('/pin-ain-collection/delete/:id',EditLock, pinainCollectionDelete)
router.get('/pin-ain-collection/export', pinainCollectionExport)

router.get('/pin-ain-renewal',ClientLock, pinainRenewalView) // pin ain renewal forms
router.post('/pin-ain-renewal',ClientLock, pinainRenewalForm)
router.get('/pin-ain-renewal/edit/:id',EditLock, pinainRenewalEdit)
router.post('/pin-ain-renewal/edit/:id',EditLock, pinainRenewalUpdate)
router.get('/pin-ain-renewal/delete/:id',EditLock, pinainRenewalDelete)
router.get('/pin-ain-renewal/export',EditLock, pinainRenewalExport)

router.get('/re-engagement',ClientLock, reEngagementView) // re engagement forms
router.post('/re-engagement',ClientLock, reEngagementForm)
router.get('/re-engagement/edit/:id',EditLock, reEngagementEdit)
router.post('/re-engagement/edit/:id',EditLock, reEngagementUpdate)
router.get('/re-engagement/delete/:id',EditLock, reEngagementDelete)
router.get('/re-engagement/export',EditLock, reEngagementExport)

router.get('/replacement-of-pin-ain',ClientLock, replacementofpinainView) // replacement forms
router.post('/replacement-of-pin-ain',ClientLock, replacementofpinainForm)
router.get('/replacement-of-pin-ain/edit/:id',EditLock, replacementofpinainEdit)
router.post('/replacement-of-pin-ain/edit/:id',EditLock, replacementofpinainUpdate)
router.get('/replacement-of-pin-ain/delete/:id',EditLock, replacementofpinainDelete)
router.get('/replacement-of-pin-ain/export',EditLock, replacementofpinainExport)

router.get('/request-for-certificate',ClientLock, requestForCertificateView) // request for certificate forms
router.post('/request-for-certificate',ClientLock, requestForCertificateForm) 
router.get('/request-for-certificate/edit/:id',EditLock, requestForCertificateEdit)
router.post('/request-for-certificate/edit/:id',EditLock, requestForCertificateUpdate)
router.get('/request-for-certificate/delete/:id',EditLock, requestForCertificateDelete)
router.get('/request-for-certificate/export',EditLock, requestForCertificateExport)

router.get('/request-for-logbook',ClientLock, requestForLogbookView) // request for logbook forms 
router.post('/request-for-logbook',ClientLock, requestForLogbookForm)
router.get('/request-for-logbook/edit/:id',EditLock, requestForLogbookEdit)
router.post('/request-for-logbook/edit/:id',EditLock, requestForLogbookUpdate)
router.get('/request-for-logbook/delete/:id',EditLock, requestForLogbookDelete)
router.get('/request-for-logbook/export',EditLock, requestForLogbookExport)

router.get('/request-for-pin-ain',ClientLock, requestforpinainView) // request for pin ain
router.post('/request-for-pin-ain',ClientLock, requestforpinainForm) 
router.get('/request-for-pin-ain/edit/:id',EditLock, requestforpinainEdit) 
router.post('/request-for-pin-ain/edit/:id',EditLock, requestforpinainUpdate)
router.get('/request-for-pin-ain/delete/:id',EditLock, requestforpinainDelete)  
router.get('/request-for-pin-ain/export',EditLock, requestforpinainExport)  

router.get('/request-for-results-slip',ClientLock, requestForResultsSlipView) // request for results slip
router.post('/request-for-results-slip',ClientLock, requestForResultsSlipForm)
router.get('/request-for-results-slip/edit/:id',EditLock, requestForResultsSlipEdit)
router.post('/request-for-results-slip/edit/:id',EditLock, requestForResultsSlipUpdate)
router.get('/request-for-results-slip/delete/:id',EditLock, requestForResultsSlipDelete)
router.get('/request-for-results-slip/export',EditLock, requestForResultsSlipExport)

router.get('/verification',ClientLock, verificationView) // verification forms
router.post('/verification',ClientLock, verificationForm)
router.get('/verification/edit/:id',EditLock, verificationEdit)
router.post('/verification/edit/:id',EditLock, verificationUpdate)
router.get('/verification/delete/:id',EditLock, verificationDelete)
router.get('/verification/export',EditLock, verificationExport)

// records router
router.post('/records/select-record', EditLock, selectRecord) // select record
router.get('/records/select-export', EditLock, selectExport)

router.get('/records/all-records', EditLock, allRecordsTable) // all records
router.get('/records/all-records-export', EditLock, allRecordsExport)

router.post('/records/detailed-report', EditLock, detailedReport)

router.get('/records/client-details',EditLock, clientdetailsRecords) // client details records
router.post('/records/client-details',EditLock, clientdetailsRecordsSearch) 

router.get('/records/registration',EditLock, registrationRecords) // registration records
router.post('/records/registration',EditLock, registrationRecordsSearch)

router.get('/records/amendment-of-records',EditLock, amendmentOfRecords) // amendment of records records
router.post('/records/amendment-of-records',EditLock, amendmentOfRecordsSearch)

router.get('/records/certificate-collection',EditLock, certificateCollectionRecords) // certificate collection records
router.post('/records/certificate-collection',EditLock, certificateCollectionRecordsSearch)

router.get('/records/duplicate-receipt',EditLock, duplicateReceiptRecords) // duplicate receipt records
router.post('/records/duplicate-receipt',EditLock, duplicateReceiptRecordsSearch)

router.get('/records/examiners-pack',EditLock, examinersPackRecords) // examiners pack records
router.post('/records/examiners-pack',EditLock, examinersPackRecordsSearch)

router.get('/records/logbook-submission',EditLock, logbookSubmissionRecords) // logbook submission records
router.post('/records/logbook-submission',EditLock, logbookSubmissionRecordsSearch)

router.get('/records/pin-ain-collection',EditLock, pinainCollectionRecords) // pin ain collection records
router.post('/records/pin-ain-collection',EditLock, pinainCollectionRecordsSearch)

router.get('/records/pin-ain-renewal',EditLock, pinainRenewalRecords) // pin ain renewal records
router.post('/records/pin-ain-renewal',EditLock, pinainRenewalRecordsSearch)

router.get('/records/re-engagement',EditLock, reEngagementRecords) // re engagement records
router.post('/records/re-engagement',EditLock, reEngagementRecordsSearch)

router.get('/records/replacement-of-pin-ain',EditLock, replacementRecords) // replacement records
router.post('/records/replacement-of-pin-ain',EditLock, replacementRecordsSearch)

router.get('/records/request-for-certificate',EditLock, requestForCertificateRecords) // request for certificate records
router.post('/records/request-for-certificate',EditLock, requestForCertificateRecordsSearch) 

router.get('/records/request-for-logbook',EditLock, requestForLogbookRecords) // request for logbook records 
router.post('/records/request-for-logbook',EditLock, requestForLogbookRecordsSearch)

router.get('/records/request-for-pin-ain',EditLock, requestforpinainRecords) // request for pin ain records
router.post('/records/request-for-pin-ain',EditLock, requestforpinainRecordsSearch) 

router.get('/records/request-for-results-slip',EditLock, requestForResultsSlipRecords) // request for results slip records
router.post('/records/request-for-results-slip',EditLock, requestForResultsSlipRecordsSearch)

router.get('/records/verification',EditLock, verificationRecords) // verification records
router.post('/records/verification',EditLock, verificationRecordsSearch)

