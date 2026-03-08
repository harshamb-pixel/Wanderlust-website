const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require ("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const  MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";  // MongoDB connection URL and it creates a collection named "wanderlust" if it doesn't exist

main()
.then((res) =>{
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs'); // Set EJS as the view engine for rendering templates
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true})); // Middleware to parse URL-encoded data from the request body
app.use(methodOverride('_method')); // Middleware to override HTTP methods using a query parameter named "_method"
app.engine('ejs', ejsMate); // Set EJS as the template engine for rendering views
app.use(express.static(path.join(__dirname, '/public'))); // Serve static files from the "public" directory

const sessionOptions ={
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Set cookie expiration to 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7, // Set maximum age of the cookie to 7 days
        httpOnly: true,
    }
};

app.get("/",(req, res) => {
    res.send("Hi, I am the root");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get("/demouser", async (req,res) => {
//      let fakeUser = new User({
//         email : "student@example.com",
//         username : "delta-student"
//      });
//      let registeredUser =await User.register(fakeUser,"helloworld");
//         res.send(registeredUser);
// })



// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });
 
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/", userRouter);

// app.all("/*",(req,res,next) => {
//     next(new ExpressError(404,"Page Not Found"))
// });
app.use((req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req,res,next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(8080, () => {  //start the server on port 8080   
    console.log('Server is running on port 8080');
});