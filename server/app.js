const express = require("express");
const app = express();
const userRouter = require("./routes/user.js");
const customerRouter = require("./routes/customer.js");
const vendorRouter = require("./routes/vendor.js");
const ordersRouter = require("./routes/order.js");
const generalPlatformRouter = require("./routes/generalPlatform.js");

app.use("/", generalPlatformRouter);
app.use("/user", userRouter);
app.use("/customer", customerRouter); //routes imitating a different platform, customer specific platform 
app.use("/vendor", vendorRouter); //routes imitating a different platform, vendor specific platform
app.use("/order", ordersRouter);

app.listen(3000, ()=>{console.log("Listening at 3000")});