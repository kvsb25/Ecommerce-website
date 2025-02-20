const express = require("express");
const app = express();
const homeRouter = require("./routes/home.js");

app.get('/', (req, res)=>{
    res.redirect("/home");
})

app.use("/home", homeRouter);

app.listen(3000, ()=>{console.log("Listening at 3000")});