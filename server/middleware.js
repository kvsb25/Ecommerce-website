const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports.verifyUser = (req, res, next)=>{
    const token = req.cookies.token;
    if (!token) return res.redirect("/user/login");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}