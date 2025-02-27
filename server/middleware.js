const jwt = require("jsonwebtoken");

module.exports.verifyUser = (req, res, next)=>{
    authCookie = res.headers["set-cookie"].find(c => c.startsWith("token="));
    if(!authCookie) return res.redirect("/user/login");

    
    const token = authCookie?.split(";")[0].split("=")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}