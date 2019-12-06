const auth = (req,res,next)=>{
    if(req.session.user==null)
    {
        res.redirect("/user/login");
    }
    else
    {
        next();
    }
}

module.exports=auth;