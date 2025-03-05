require('dotenv').config();
const User = require("../models/user.js");
const Customer = require("../models/customer.js");
const Vendor = require("../models/vendor.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { returnErrorMessages } = require('../utils/mongoValidation.js');

module.exports.signUpUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) return res.status(400).send("send valid credentials!");

        // hash and overwriting the password
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // creating and registering the new user to the platform
        let newUser = new User(req.body);
        await newUser.save();
        if (newUser.role === "customer") {
            await (new Customer({ userId: newUser._id })).save();
        } else if (newUser.role === "vendor") {
            await (new Vendor({ userId: newUser._id })).save();
        }

        // set expiry jwt and cookie, refresh token for jwt
        const accessToken = jwt.sign({ username: newUser.username, role: newUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ username: newUser.username, role: newUser.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.cookie('token', accessToken, {
            httpOnly: true,
            // secure: true, 
            sameSite: 'Strict'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: true, 
            sameSite: 'Strict'
        });

        return res.status(200).send('user registered');
    } catch (e) {
        console.error(e);
        console.log(e);
        if (e.cause.errorResponse.code === 11000) return res.status(400).send("this User already Exists!");
        if (e._message === 'user validation failed') return res.status(400).send(returnErrorMessages(e));
        return res.status(403).send(e);
    }
}

module.exports.loginUser = async (req, res) => {

    try {
        console.log(req.body);

        if (!req.body.username) return res.status(400).send("username might be wrong");

        let foundUser = await User.findOne({ username: req.body.username });

        if (!foundUser) return res.status(400).send("Incorrect username");

        if (await bcrypt.compare(req.body.password, foundUser.password)) {
            const accessToken = jwt.sign({ username: foundUser.username, role: foundUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ username: foundUser.username, role: foundUser.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            res.cookie('token', accessToken, {
                signed: true,
                httpOnly: true,
                // secure: true, 
                sameSite: 'Strict'
            });
            res.cookie('refreshToken', refreshToken, {
                signed: true,
                httpOnly: true,
                // secure: true, 
                sameSite: 'Strict'
            });

            return res.status(200).send(`${accessToken}`); /*, ${refreshToken }`);*/

        } else {
            return res.status(403).send("wrong password");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send("server error");
    }
}

module.exports.generateToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

        if(err) return res.sendStatus(403);

        const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000,
            path: "/"
        });

        req.user = user;
        return next();
    })
}