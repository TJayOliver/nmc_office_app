// Locking admin pages for Admin Only
export const AdminLock = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('loginpageMsg', 'Access denied');
    res.redirect('/');
};
  
// Locking client service page for Client Service and Admin
export const ClientLock = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'CLIENT SERVICE') {
        return next();
    }
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        return next();
    }
    req.flash('loginpageMsg', 'Please Login');
    res.redirect('/');
};

// Locking accounts pages for Accounts and Admin
export const AccountsLock = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'ACCOUNTS') {
        return next();
    }
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        return next();
    }
    req.flash('loginpageMsg', 'Please Login');
    res.redirect('/');
};

// Locking edit page for All roles
export const EditLock = (req, res, next) =>{
    if(req.isAuthenticated() && req.user.role === 'ACCOUNTS'){
        return next()
    }
    if (req.isAuthenticated() && req.user.role === 'CLIENT SERVICE') {
        return next();
    }
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        return next();
    }
    req.flash('loginpageMsg', 'Access denied');
    res.redirect('/');
}