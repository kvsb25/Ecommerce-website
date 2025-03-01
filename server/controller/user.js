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

        const accessToken = jwt.sign({ username: newUser.username, role: newUser.role }, process.env.ACCESS_TOKEN_SECRET);

        res.cookie('token', accessToken, {
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
            const accessToken = jwt.sign({ username: foundUser.username, role: foundUser.role }, process.env.ACCESS_TOKEN_SECRET);

            res.cookie('token', accessToken, {
                httpOnly: true,
                // secure: true, 
                sameSite: 'Strict'
            });

            return res.status(200).send(accessToken);

        } else {
            return res.status(403).send("wrong password");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send("server error");
    }
}