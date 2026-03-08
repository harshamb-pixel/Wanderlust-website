const express = require("express");
const app = express();
// const users = require("./routes/user.js");
// const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave : false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
    let {name = "Anonymous"} = req.query;
    req.session.name = name;
    res.flash("Success","User registered successfully");
    res.redirect("/hello");
});

app.get ("/hello", (req, res) => {
    console.log(req.flash("Success"));
    res.render("page.ejs", {name: req.session.name});
});
// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`you sent request ${req.session.count} times`);
// });

app.get('/test', (req,res) => {
    res.send("test succesfull!");
});




app.listen(3000, (req,res) => {
    console.log("Server is listening at port 3000");

});