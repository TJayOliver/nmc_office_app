import {database} from '../server/database/database.js'
import bcrypt from 'bcrypt'
import LocalStrategyy from 'passport-local'
const LocalStrategy = LocalStrategyy.Strategy

export default async(passport)=>{

    passport.use('staff-login', 
    new LocalStrategy(
        {usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
        },async(req, username, password, done)=>{
        try{
            const lookQuery = 'SELECT * FROM staffdetails WHERE username=?';
            console.log('Passport Connection to MYSQL successful');
            const [data] = await database.query(lookQuery, [username]);
            console.log('Data Retrieved from MYSQL');
            if(!data.length > 0){
                console.log('Username Not Found')
                return done(null, false, req.flash('loginpageMsg', 'Username Does Not Exist'));
            };
            if(data.length > 0){
                console.log('Username is Found')
                const user = data[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch){
                    console.log('Password was not found')
                    return done(null, false, req.flash('loginpageMsg', 'Password is Incorrect'));
                }else{
                    console.log('Password was found')
                    return done(null, user)
                }
            }
        }catch(error){
            console.log(error)
        }
    }));

    passport.use('administrator-login', 
    new LocalStrategy(
        {usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
        }, async(req, username, password, done)=>{
        try{
            const lookQuery = 'SELECT * FROM administrator WHERE username=?';
            const [data] = await database.query(lookQuery, [username]);
            console.log('Passport Connection to Administrator Database successful');
            if(!data.length > 0){
                console.log('Username is found')
                return done(null, false, req.flash('loginpageMsg', 'Username Does Not Exist'));
            }
            if(!(data[0].password == password)){
                console.log('Password is not found')
                return done(null, false, req.flash('loginpageMsg', 'Password Does Not Exist'));
            }else{
                console.log('Administrator Logged in')
                return done(null, data[0])
            }

        }catch(error){
            console.log(error)
        }
    }));

    passport.serializeUser( (user, done)=>{
        done(null, user.id)
    });     
        
    passport.deserializeUser( async(id, done)=>{
        try{
            const [data] = await database.query('SELECT * FROM staffdetails WHERE id=?', [id]);
            if(data){
                return done(null, data[0])
            }
        }catch(error){
            console.log(error)
            done(error)
        }
    });
};







    










