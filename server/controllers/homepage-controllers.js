// client service home page
export const clientServiceHomepage = ( req,res)=>{
    const staffName = req.user.name;
    res.render('clientservice-homepage', {PageTitle: "CLIENT SERVICE HOMEPAGE", staffName : staffName, req:req})
}

// accounts office home page
export const accountOfficeHomepage = (req,res)=>{
    const staffName = req.user.name;
    res.render('accounts-homepage',  {PageTitle: "ACCOUNT OFFICE HOMEPAGE", staffName : staffName, req:req})
}

// admin home page
export const adminHomepage = (req,res)=>{
    const staffName = req.user.name;
    res.render('admin-homepage',  {PageTitle: "ADMINISTRATOR HOMEPAGE",staffName : staffName, req:req })
}

// records home page
export const recordsHomepage = (req,res)=>{
    const staffName = req.user.name;
    res.render('records-page',  {PageTitle: "RECORDS HOMEPAGE", staffName : staffName, req:req})
}

