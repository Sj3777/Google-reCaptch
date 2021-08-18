const express = require ("express");
const bodyParser = require("body-parser");
const request =  require( "request");
const { response } = require("express");

const fetch = require('node-fetch');
const { stringify } = require('querystring');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.post("/subscribe", async(req,res)=>{
     if(req.body.captcha===undefined || req.body.captcha==="" || req.body.captcha===null){
         return res.json({"sucess":false, "msg":"Please select captcha"});
     } 
     //secret key
    const secretKey ="6LdJgQscAAAAANrOrtPGIHlM3AextCG3fFrCC5GK";
    // const verify url
    const query = stringify({
        secret: secretKey,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    // Make a request to verifyURL
    const body = await fetch(verifyURL).then(res => res.json());
    console.log(body)
    // If not successful
    if (body.success !== undefined && !body.success)
        return res.json({ success: false, msg: 'Failed captcha verification' });

    // If successful
    return res.json({ success: true, msg: 'Captcha passed' });
})
app.listen(2000,()=>{
    console.log("server started on port 2000");
})