import {database} from '../database/database.js'
import bcrypt from 'bcrypt'
import {validationResult} from 'express-validator'
import nodecache from 'node-cache'
const mycache = new nodecache({ stdTTL: 60, checkperiod: 60 });

// GET Register Staff
export const registerStaffView = (req, res) => {
    const staffName = req.user.name;
    res.render('admin/registerstaff', { PageTitle: "REGISTER STAFF",staffName:staffName, req:req, action:'ADD'});
}

// POST Register Staff
export const registerStaffForm = async(req, res) => {
    const { name, username, role, password, confirmpassword } = req.body;
    const lookQuery = `SELECT username FROM staffdetails WHERE username=?`;
    const lookparameters = [username];
    try{
        // checking for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let err = errors.array().map(err => err.msg)
            req.flash('validationerror', err);
            return res.redirect('/register-staff');
        }
        if (password !== confirmpassword) {
            console.log('password does not match')
            req.flash('Success', 'Password Does Not Match')
            return res.redirect('/register-staff')
        }
        const [data] = await database.query(lookQuery, lookparameters);
        console.log('Register Staff Connection Succesfful');
        console.log('Retrieving Username')
        // checking if username exist
        if (data.length > 0) {
            console.log('username exist')
            req.flash('Success', 'Username is taken')
            return res.redirect('/register-staff')
        }else{
            console.log('username does not exist')
            const hash = await bcrypt.hash(password, 10);
            console.log('password hashing successfull, Generated hash:', hash);
            const registerQuery = `INSERT INTO staffdetails SET name=?,username=?,role=?,password=?`;
            const registerParameter = [name, username, role, hash];
            const [data] = await database.query(registerQuery,registerParameter);
            console.log('staff registered')
            req.flash('Success', 'SAVED! ALL GOOD!')
            res.redirect('/register-staff')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}
  
// GET View Staff 
export const viewStaff = async(req, res) => {
    const cacheKey = 'View Staff'
    let cacheData = mycache.get(cacheKey);  
        try{
            console.log('cache miss')
            if(!cacheData){
            console.log('retrieving all staffs available in database')
            const [data] = await database.query(('SELECT * FROM staffdetails'));
            mycache.set(cacheKey,data);
            cacheData = data
            console.log('all staffs retrieved from database')
        }else{
            console.log('cache retrieved')
        }
        const staffName = req.user.name;
        res.render('admin/viewstaff', { PageTitle: "STAFF LIST", staffName:staffName, req:req, data:cacheData});
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// GET Edit Staff
export const EditStaff = async(req, res) => {
    try{
        console.log('retrieving staff details for editing')
        const [data] = await database.query('SELECT * FROM staffdetails WHERE id=?',[req.params.id]);
        console.log('staff details for editing retrieved')
        const staffName = req.user.name;
        res.render('admin/registerstaff', { PageTitle: "STAFF LIST", staffName:staffName, req:req, data:data, action:'EDIT'});
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}

// GET Update Staff
export const UpdateStaff = async(req, res) => {
    const { name, username, role, password, confirmpassword } = req.body;
    const lookQuery = `SELECT username FROM staffdetails WHERE username=?`;
    const lookparameters = [username];
    try{
        // checking for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let err = errors.array().map(err => err.msg)
            req.flash('Success', err);
            return res.redirect('/register-staff');
        }
        if (password !== confirmpassword) {
            console.log('password doesnt match')
            req.flash('Unavailable', 'Password Does Not Match')
            return res.redirect('/register-staff')
        }
        const [data] = await database.query(lookQuery,lookparameters);
        if (data.length > 0) {
            console.log('Username is taken')
            req.flash('Unavailable', 'Username is taken')
            return res.redirect('/register-staff')
        }else{
            const UpdateQuery = `UPDATE staffdetails SET name=?,username=?,role=?,password=?WHERE id=?`
            const UpdateParameter = [name, username, role, hash, req.params.id];
            const [rows] = await database.query(UpdateQuery, UpdateParameter);
            console.log('Updating staff details')
            const hash = await bcrypt.hash(password, 10);
            console.log('password hashing successfull, Generated hash:', hash);
            req.flash('Updated', 'SUCCESSFULLY UPDATED');
            res.redirect('/view-staff')
        }
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
}      

// DELETE Staff
export const DeleteStaff = async(req,res) => {
    try{
        console.log('Retrieving Staff Details Connection');
        const [data] = await database.query('DELETE FROM staffdetails WHERE id=?', [req.params.id]);
        console.log('Staff Deleted');
        req.flash('Success', 'SUCCESSFULLY DELETED');
        res.redirect('/view-staff');
    }catch(error){
        console.log(error)
        res.status(500).render('errors/servererror')
    }
};


