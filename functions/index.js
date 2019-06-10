const functions = require('firebase-functions');
const express = require('express');
var bodyParser = require("body-parser");
const firebase = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const app = express();
var nodemailer = require('nodemailer');
var admin = require("firebase-admin");
const { check, validationResult } = require('express-validator/check');

//app.use(express.static(__dirname +));
let reqPath = path.join(__dirname, '../')
app.use(express.static(reqPath+"/public/index.html"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: xxx
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure:'false',
    port:'25',
    auth:{
        user:config.uname,
        pass:config.pwd
    },
    tls:{
        rejectUnauthorized: false
    }
});

let HelperOption = {
    from: '"Rishabh Verma" <support@rishabhverma.in',
    to: 'someone@gmail.com',
    subject: 'Hello World from Node!',
    text: 'Its Amazing!!'
};

app.get('/timestamp', (request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Node Js working on firebase, Current time is ");
    response.write(`${Date.now()}`);
    response.end();
});

app.get('/index', (request, response) => {
    var uid = request.params.uid,
        path = request.params[0] ? request.params[0] : 'index.html';
    //response.sendfile(path, { root: '../public' });
    response.sendFile(reqPath +"/public/index.html");
});
app.post('/login', function (req, res) {
    var name = req.body.user;
    var message = req.body.password;
    console.log("Name = " + name + ", message is " + message);
    res.end("yes");
});

app.post('/send', [
    // username must be an email.
    check('email').isEmail(),
    // name must be at least 5 chars long.
    check('name').isLength({ min: 3 }),
    // Message must not be empty.
    check('message').isLength({ min: 10 })
], (request, response) => {

    const errors = validationResult(request);
    console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    var name = request.body.name;
    var message = request.body.message;
    var email = request.body.email;
    console.log("Name = " + name + ", Message = " + message + ", Email = " + email);
    //console.log(request.body);
    var mailOptions = {
        name,
        message,
        email
    }
    HelperOption.from = '"Rishabh Verma" <support@rishabhverma.in';
    HelperOption.subject = 'Test Mail from '+email;
    HelperOption.to = 'someone@gmail.com';
    HelperOption.text = message;

    transporter.sendMail(HelperOption, (error, info) => {
        if (error) {
            console.log(error);
            response.end('error');
        } else {
            console.log('Mail Sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            console.log(info);
            console.log("Message sent: " + response.message);
            response.end('sent');
        }
    });
    transporter.close();
});
exports.app = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
