const express= require('express');
const cookieParser=require('cookie-parser');
const app=express();
const expressLayouts = require('express-ejs-layouts');
const port= 8000;
const db = require('./config/mongoose');


app.use(express.urlencoded());

app.use(cookieParser());
app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use('/',require('./routes'));

app.set('view engine','ejs');
app.set('views','./views');


app.listen(port,function(err){
    if(err){
        console.log("error",err);
    }
    console.log(`Server is running on port: ${port}`);
})