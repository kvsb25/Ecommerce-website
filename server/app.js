const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user.js");
const customerRouter = require("./routes/customer.js");
const vendorRouter = require("./routes/vendor.js");
const ordersRouter = require("./routes/order.js");
const generalPlatformRouter = require("./routes/generalPlatform.js");
const ExpressError = require("./utils/ExpressError.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerceTest');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/views"));
app.use(express.static(path.join(__dirname, "../client/public")));
app.engine("ejs", ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/", generalPlatformRouter);
app.use("/user", userRouter);
app.use("/customer", customerRouter); //routes imitating a different platform, customer specific platform 
app.use("/vendor", vendorRouter); //routes imitating a different platform, vendor specific platform
app.use("/order", ordersRouter);

// Middleware for page not found
app.use((req, res, next)=>{
  const error = new ExpressError(404, "Page Not Found!");
  next(error);
})

// Error handling middleware
app.use((error, req, res, next)=>{
  return res.json({status: error.status, message: error.message});
});

app.listen(3000, ()=>{console.log("Listening at 3000")});