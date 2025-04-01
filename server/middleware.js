const jwt = require("jsonwebtoken");
const { fetchVendorDetails } = require("./utils/vendor");
const { fetchCustomerDetails } = require("./utils/customer");

module.exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.signedCookies.token;
        if (!token) return res.status(401).send("unauthenticated")//res.redirect("/user/login");

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // get user details and store in req.user
        if (user && user.role === 'vendor') {
            // change req.user to req.vendor
            req.user = await fetchVendorDetails(user); // user.id from jwt
        } else if (user && user.role === 'customer') {
            req.user = await fetchCustomerDetails(user);
        } else {
            throw new Error("Unauthenticated");
            // return res.status(403).send("Unauthorized");
        }
        console.log(req.user);
        next()

    } catch (err) {
        console.log(err);
        err.status = 401;
        next(err);
        // return res.status(401).send("Unauthenticated");
    }
}

module.exports.verifyRole = (role) => {
    
    return (req, res, next) => {
        console.log(req.user.user.role, " === ", role);
        
        if (req.user.user.role === role) {
            return next();
        }
        
        const error = new Error("Unauthorized");
        error.status = 403;
        return next(error);
    };

    // return (req, res, next)=>{
    //     return next(req.user?.role === role ? undefined : Object.assign(new Error("Unauthorized"), { status: 403 }));
    // }
}

module.exports.verifyVendor = (req, res, next) => {
    try {
        console.log(`storeName: ${req.user.storeName}, storeAddress: ${req.user.storeAddress}`);
        console.log(!req.user.storeName && !req.user.storeAddress);
        if (!req.user.storeName && !req.user.storeAddress) {
            throw new Error("You're unauthorized: Please register your store's name and address");
        }

        next();
    } catch (err) {
        err.status = 403;
        next(err);
    }
}

// const handleRefreshToken = (req, res, next)=>{
//     console.log(req.cookies);
//     const refreshToken = req.cookies.refreshToken;
//     console.log("refresh Token");
//     console.log(typeof refreshToken+"\n"+ (!refreshToken))
//     if(!refreshToken) return res.sendStatus(401);//use -> .redirect("/user/login"); if API and webpage_URL server is same

//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
//         if (err) return res.status(403).send("invalid refresh token");

//         const accessToken = jwt.sign({username: user.username, role:user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'});

//         res.cookie('token', accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "Strict",
//             maxAge: 15*60*1000
//         });

//         req.user = user;
//         return next();
//     })
// };

// module.exports.verifyUser = (req, res, next)=>{
//     const token = req.cookies.token;
//     console.log("access token");
//     console.log(typeof token+"\n"+ (!token))
//     // const refreshToken = req.cookies.refreshToken;
//     if (!token) return handleRefreshToken(req, res, next);//res.redirect("/user/login");

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
//         if(err){
//             if(err.name === 'TokenExpiredError'){
//                 return handleRefreshToken(req, res, next);
//             }
//             return res.sendStatus(403);
//         }

//         req.user = user;
//         return next();
//     });
// }

// module.exports.verifyUser = (req, res, next) => {
//     // const token = req.cookies.token;
//     const token = req.signedCookies.token;
//     if (!token) return res.status(401).send("unauthenticated")//res.redirect("/user/login");

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         // console.log(user);
//         if (err) {
//             return res.sendStatus(403);
//         }
//         // req.user = user;  //storing the user details (in token) in req.user object
//         next();
//     });
// }

// module.exports.verifyRole = (role) => {
//     return (req, res, next) => {
//         if (req.user && req.user.role === role) {
//             return next();
//             // return next(req.user?.role === role ? undefined : Object.assign(new Error("Unauthorized"), { status: 403 }));

//         } else {
//             return next(new Error("Unauthorized"));
//             // return next(new Error({message: "Unauthorized", status: 403}))
//         }
//     }
// }

// module.exports.verifyRole2 = (user, role) => {
//     // return (req, res, next) => {
//     //     if (req.user && req.user.role === role) {
//     //         return true
//     //         // return next(req.user?.role === role ? undefined : Object.assign(new Error("Unauthorized"), { status: 403 }));

//     //     } else {
//     //         return next(new Error("Unauthorized"));
//     //         // return next(new Error({message: "Unauthorized", status: 403}))
//     //     }
//     // }

//     return (user && user.role === role);
// }