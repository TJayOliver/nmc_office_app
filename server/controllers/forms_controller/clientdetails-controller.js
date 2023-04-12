import {database} from '../../database/database.js'

// render client details forms (GET)
export const clientDetailsView = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/clientdetails', {PageTitle: "CLIENT DETAILS", action:'ADD', staffName:staffName, req:req})
}

// render client details forms (POST)
export const clientDetailsForm = async(req,res)=>{
    const {firstname, middlename, lastname, dateofbirth, gender, phonenumber, contactaddress, emailaddress, programme, registrationnumber, indexnumber} = req.body; 
    const firstnamee = firstname.toUpperCase(),middlenamee = middlename.toUpperCase(),
    lastnamee = lastname.toUpperCase(), contactaddresss = contactaddress.toUpperCase(),
    registrationnumberr = registrationnumber.toUpperCase(), indexnumberr = indexnumber.toUpperCase();
    const regnum = programme.concat(registrationnumber);
    
    try{
        console.log('Client Details Forms Connection Successful');
        const retrieveQuery = `SELECT * FROM clientdetails WHERE registration_number=?`;
        const [check] = await database.query(retrieveQuery, [registrationnumberr]);
        console.log(check)
        // if registration number does not exist .. save
        if(!check.length > 0){
            const sqlquery = `INSERT INTO clientdetails 
            SET 
            first_name=?, 
            middle_name=?, 
            last_name=?,
            date_of_birth=?,
            gender=?,
            phone_number=?,
            contact_address=?,
            email_address=?,
            programme=?,
            registration_number=?,
            index_number=?`;
            const parameters = [firstnamee, middlenamee, lastnamee, dateofbirth, gender, phonenumber, contactaddresss, emailaddress, programme, regnum, indexnumberr];
            const [data] = await database.query(sqlquery, parameters);
            req.flash('Success', 'SAVED! ALL GOOD!'); 
            res.redirect('/client-details')
        }else{
            req.flash('Success', `CLIENT ${registrationnumberr} EXIST ALREADY`); 
            res.redirect('/client-details')
        }
    }catch(error){
        console.log(error)
    }
}

// render client details edit forms
export const clientDetailsEdit = async(req,res)=>{
    try{
        console.log('Edit client details forms successful')
        const editQuery = `SELECT *, 
        DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth 
        FROM clientdetails WHERE id=?`;
        const editParameters = [req.params.id];
        const [data] = await database.query(editQuery, editParameters);
        const staffName = req.user.name;
        res.render('forms/clientdetails', {PageTitle: "CLIENT DETAILS", action:'EDIT', data:data, staffName:staffName, req:req})
    }catch(error){
        console.log(error)
    }
}

// update client details edit forms
export const clientDetailsUpdate = async(req,res)=>{
    try{
        console.log('client details Update Connection Succcessful');
        const {firstname, middlename, lastname, dateofbirth, gender, phonenumber, contactaddress, emailaddress, programme, registrationnumber, indexnumber} = req.body; 
        const updateQuery = `UPDATE clientdetails 
        SET 
        first_name=?, 
        middle_name=?, 
        last_name=?,
        date_of_birth=?,
        gender=?,
        phone_number=?,
        contact_address=?,
        email_address=?,
        programme=?,
        registration_number=?,
        index_number=?
        WHERE id=?`;
        const updateParameter = [firstname, middlename, lastname, dateofbirth, gender, phonenumber, contactaddress, emailaddress, programme, registrationnumber ,indexnumber, req.params.id];
        const [data] = await database.query(updateQuery, updateParameter)
        req.flash('Updated', 'SUCCESSFULLY UPDATED');
        res.redirect('/records/client-details')
    }catch(error){
        console.log(error);
        res.status(500).render('errors/servererror')
    }
}

// delete record from client details form
export const clientDetailsDelete = async(req,res)=>{
    try{
        console.log('delete client details connection successfull');
        const deleteQuery = 'DELETE FROM clientdetails WHERE id=?', deleteParameter = [req.params.id];
        const [data] = await database.query(deleteQuery, deleteParameter);
        req.flash('Deleted', 'SUCCESSFULLY DELETED');
        res.redirect('/records/client-details')
    }catch(error){
        console.log(error);
        res.status(500).render('errors/servererror')
    }    
}

// render first Registration GET
export const FirstRegistration = (req,res)=>{
    const staffName = req.user.name;
    res.render('forms/registration-one', {PageTitle: "REGISTRATION", staffName:staffName, req:req})
}

// first Registration POST (client details)
export const FirstRegistrationForm = async(req,res)=>{
    const {firstname, middlename, lastname, dateofbirth, gender, phonenumber, contactaddress, emailaddress, programme, registrationnumber, indexnumber} = req.body; 
    const firstnamee = firstname.toUpperCase(), middlenamee = middlename.toUpperCase(), lastnamee = lastname.toUpperCase(), contactaddresss = contactaddress.toUpperCase(), registrationnumberr = registrationnumber.toUpperCase(),indexnumberr = indexnumber.toUpperCase();
    const regnum = programme.concat(registrationnumber);
    console.log(regnum)
    try{
        console.log('Client Details Forms Connection Successful');
        const retrieveQuery = `SELECT * FROM clientdetails WHERE registration_number=?`;
        const [check] = await database.query(retrieveQuery, [registrationnumberr]);
        console.log(check)
        // if registration number does not exist .. save
        if(!check.length > 0){
            const sqlquery = `INSERT INTO clientdetails 
            SET 
            first_name=?, 
            middle_name=?, 
            last_name=?,
            date_of_birth=?,
            gender=?,
            phone_number=?,
            contact_address=?,
            email_address=?,
            programme=?,
            registration_number=?,
            index_number=?`;
            const parameters = [firstnamee, middlenamee, lastnamee, dateofbirth, gender, phonenumber, contactaddresss, emailaddress, programme, regnum, indexnumberr];
            const [data] = await database.query(sqlquery, parameters);
            res.redirect('/registration')
        }else{
            req.flash('Success', `CLIENT ${registrationnumberr} EXIST ALREADY`); 
            res.redirect('/client-details')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
