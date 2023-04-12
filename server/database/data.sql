CREATE TABLE `administrator`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `amendment_of_records`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `date_of_request` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `request_type` ENUM('CHANGE OF NAME', 'CHANGE OF DATE OF BIRTH') NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `certificate_collection`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `working_institution` ENUM('CHAG', 'QUASI', 'PRIVATE', 'GOVERNMENT') NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `badge_issued` ENUM('YES', 'NO') NOT NULL,
    `induction_items_issued` ENUM('YES', 'NO') NOT NULL,
    `date_on_certificate` DATE NOT NULL,
    `request_type` ENUM('PENALTY FOR CERTIFICATE', 'NO') NOT NULL,
    `amount_paid_for_penalty` INT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50)  NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `clientdetails`(
    `id` INT NOT NULL UNIQUE AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `middle_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `programme` ENUM('AM','AMAM','AMCAMH','AMCMH','AMEN','AMHN','AMNICN','AMNN','AMNPN','AMNSN','AMON','AMPCN','AMPO','AMWH','AMWWC','AN','CAMH','CCN','CMHR','EGN','EMN','EN','ENT','ENUR','FPN','HAC','HN','ID','MAM','MAN','MCAMH','MCMIR','MEN','MHN','MID','MNICN','MNN','MNPN','MNSN','MON','MPCN','MPN','MPO','MWH','MWWC','NAC','NAP','NICN','NN','NP','NPN','NSN','ON','OPHN','OPN','OPTH','PAED','PCN','PHN','PN','PO','PON','QRM','RCMN','RCN','RCPN','RGN','RM','RMN','RNP','SAM','SCAMH','SCMHR','SEN','SHN''SID','SNICN','SNN','SNPN','SON','SOPHN','SPN','SPO','SRN','SWH','SWWC','WH','WWC') NOT NULL,
    `email_address` VARCHAR(50) NOT NULL,
    `contact_address` VARCHAR(50) NOT NULL,
    `phone_number` INT NOT NULL,
    `index_number` VARCHAR(50) NOT NULL,
    `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`registration_number`) 
);

CREATE TABLE `duplicate_receipt`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `request_type` VARCHAR(50) NOT NULL 'DUPLICATE RECEIPT',
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT  NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `examiners_pack`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `request_type` VARCHAR(50) NOT NULL DEFAULT 'EXAMINERS PACK',
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `logbook_submission`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `facility` VARCHAR(50) NOT NULL,
    `date_of_commencement_of_school` DATE NOT NULL,
    `date_of_completion` DATE NOT NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `pin_ain_collection`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `collection_type` ENUM('NEW PIN', 'NEW AIN', 'RENEWAL', 'REPLACEMENT', 'CHANGE OF CARD') NOT NULL,
    `collected_by` ENUM('SELF', 'ON BEHALF') NOT NULL,
    `taken_by` VARCHAR(50) NULL,
    `taken_phone` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `pin_ain_renewal`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `request_type` ENUM('PIN RENEWAL', 'AIN RENEWAL') NOT NULL,
    `pin_ain_number` VARCHAR(50) NOT NULL,
    `date_pin_ain_issued` DATE NOT NULL,
    `date_pin_ain_expired` DATE NOT NULL,
    `amount_paid` INT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `registration`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `request_type`,VARCHAR(50) NOT NULL DEFAULT 'REGISTRATION',
    `name_of_institution` VARCHAR(50) NOT NULL,
    `logbook_issued` ENUM('YES', 'NO') NOT NULL,
    `code_of_conduct` ENUM('YES', 'NO') NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `amount_paid` INT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `late_registration` ENUM('PENALTY FOR REGISTRATION', 'NO') NULL,
    `late_registration_amount` INT NULL,
    `late_registration_bank` ENUM('GCB', 'ADB') NULL,
    `late_registration_receipt_number` INT NULL,
    `late_registration_transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `request_for_results_slip`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `request_type`, VARCHAR(50) NOT NULL DEFAULT `REQUEST FOR RESULT SLIP`
    `date_of_request` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB')  NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50)  NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `re_engagement`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `request_type` VARCHAR(50) NOT NULL DEFAULT 'RE-ENGAGEMENT',
    `date_of_request` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `request_for_pin_ain`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `request_type` ENUM('REQUEST FOR PIN', 'REQUEST FOR AIN') NOT NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `request_for_certificate`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `request_type` ENUM('CORRECTION OF NAME ON CERTIFICATE', 'CORRECTION OF REGISTRATION NUMBER ON CERTIFICATE', 'CORRECTION OF DATE ON CERTIFICATE','DUPLICATE CERTIFICATE','REQUEST FROM OTHER REGIONS') NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `request_for_logbook`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `request_type`, VARCHAR(50) NOT NULL DEFAULT 'REQUEST FOR LOGBOOK',
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `replacement_of_pin_ain`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `request_type` ENUM('VALID BUT DEFECTIVE PIN/AIN','MISPLACED PIN/AIN') NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

CREATE TABLE `staffdetails`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `role` ENUM('CLIENT SERVICE', 'ADMIN', 'ACCOUNTS') NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `verification`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(50) NOT NULL,
    `date_of_request` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `verification_type` ENUM('LOCAL VERIFICATION', 'FOREIGN VERIFICATION') NOT NULL,
    `amount_paid` INT NOT NULL,
    `bank` ENUM('GCB', 'ADB') NULL,
    `receipt_number` INT NULL,
    `transaction_reference_number` VARCHAR(50) NULL,
    `attended_to_by_client_service` VARCHAR(50) NOT NULL,
    `attended_to_by_account_office` VARCHAR(50) NOT NULL,
    `date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `modified_by_client_service` VARCHAR(50) NOT NULL,
    `modified_by_account_office` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`registration_number`) REFERENCES `clientdetails`(`registration_number`)
);

