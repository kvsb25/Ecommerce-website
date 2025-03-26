require('dotenv').config();
const User = require("../models/user.js");
const Customer = require("../models/customer.js");
const Vendor = require("../models/vendor.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { returnErrorMessages } = require('../utils/mongoValidation.js');
const Cart = require('../models/cart.js');

module.exports.signUpUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) return res.status(400).send("send valid credentials!");

        // hash and overwriting the password
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // creating and registering the new user to the platform
        let newUser = new User(req.body);
        await newUser.save();
        if (newUser.role === "customer") {
            const cart = new Cart();
            await cart.save();
            await (new Customer({ userId: newUser._id, cart: cart._id })).save();
        } else if (newUser.role === "vendor") {
            await (new Vendor({ userId: newUser._id })).save();
        }

        // set expiry jwt and cookie, refresh token for jwt
        const accessToken = jwt.sign({ _id: newUser._id.toString(), username: newUser.username, role: newUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ _id: newUser._id.toString(), username: newUser.username, role: newUser.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        if(!accessToken || !refreshToken) return res.status(500).send("Internal Server Error");

        res.cookie('token', accessToken, {
            signed: true,
            httpOnly: true,
            // secure: true,
            maxAge: 15 * 60 * 1000, 
            // sameSite: 'Strict'
        });
        res.cookie('refreshToken', refreshToken, {
            signed: true,
            httpOnly: true,
            // secure: true, 
            maxAge: 15 * 60 * 1000,
            // sameSite: 'Strict'
        });

        return res.status(200).send('user registered');
    } catch (e) {
        console.error(e);
        console.log(e._message);
        // if (e.cause.errorResponse.code === 11000) return res.status(400).send("this User already Exists!");
        if(e.cause){
            if (e.cause.errorResponse.code === 11000) return res.status(400).send("this User already Exists!");
        }
        if (e._message === 'user validation failed') return res.status(400).send(returnErrorMessages(e));
        return res.status(403).send(e);
    }
}

module.exports.loginUser = async (req, res) => {
    console.log(req.body);

    if (!req.body.username) return res.status(400).send("no username entered");

    // find the user using its username
    let foundUser = await User.findOne({ username: req.body.username });

    // check if user exists
    if (!foundUser) return res.status(401).send("Incorrect username");

    // console.log(foundUser._id.toString()); // gives the id in string

    // match the input password with original password, if true send token to client
    if (await bcrypt.compare(req.body.password, foundUser.password)) {
        const accessToken = jwt.sign({ _id: foundUser._id.toString() , username: foundUser.username, role: foundUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ _id: foundUser._id.toString() , username: foundUser.username, role: foundUser.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.cookie('token', accessToken, {
            signed: true,
            httpOnly: true,
            // secure: true, 
            maxAge: 15 * 60 * 1000,
            // sameSite: 'Strict'
        });
        res.cookie('refreshToken', refreshToken, {
            signed: true,
            httpOnly: true,
            // secure: true, 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            // sameSite: 'Strict'
        });

        return res.status(200).send(`${accessToken}`); /*, ${refreshToken }`);*/

    } else {
        return res.status(401).send("Incorrect password");
    }
}

module.exports.generateToken = (req, res) => {
    const refreshToken = req.signedCookies.refreshToken;
    if (!refreshToken) return res.status(403).send("No refresh token found, login again");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

        if(err) return res.sendStatus(403);

        // const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
        const accessToken = jwt.sign({ _id: user._id, username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });

        res.cookie('token', accessToken, {
            signed: true,
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "Strict",
            maxAge: 15 * 60 * 1000,
            // path: "/"
        });
        // return next();
        return res.sendStatus(200);
    })
}