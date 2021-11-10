const express= require('express');
const cookieParser=require('cookie-parser');
const app=express();
const expressLayouts = require('express-ejs-layouts');
const port= 8000;
const db = require('./config/mongoose');
//use for session cookie
const session= require('express-session');
const passport = require('passport');
const passportLocal=require('./config/passport-local-strategy')
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    /* Options */
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'compressed',
    prefix: '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
app.use(express.urlencoded());

app.use(cookieParser());
app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



app.set('view engine','ejs');
app.set('views','./views');


app.use(session({
    name:'codeg',
    secret: 'blahsomethings',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 6000000
},
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codeg_development',
        mongooseConnection: db,
        autoRemove: 'disabled'
    },
        function (err) {
            console.log(err || 'connect-mongodb setup ok');
        })

}))

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use('/', require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log("error",err);
    }
    console.log(`Server is running on port: ${port}`);
})