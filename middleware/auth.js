const auth = (req,res,next)=>{
    if(req.session.userInfo==null)
    {
        res.redirect("/user/login");
    }
    else
    {
        next();
    }
}

module.exports=auth;