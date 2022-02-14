const express = require("express");   //importing express....
const { engine } = require("express-handlebars"); //importing engine of handlebar
import mongoose from 'mongoose'; //importing mongoose
import nodemailer from 'nodemailer';
const app = express(); //calling top level function..
import path from 'path';
import ContactModel from './Model/Contact';

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//database connection....starts here
let mongodbURL = "mongodb://localhost:27017/student";
mongoose.connect(mongodbURL, err => {
    if (err) throw err;
    console.log("database connected..")
});
//database connection...ends here

//start of middleware block.......
app.use(express.static(path.join(__dirname, "public")));
//body[parser]
app.use(express.urlencoded({ entended: true }))//without this we will get undefined..
//end of middleware block....

//basic route
app.get("/", (req, res) => {
    res.render("home",{title:"welcome to jspiders world"}) //dynamic template...
})
app.get("/contact", (req, res) => {
    res.render("contact",{title:"contact us"});

});

//fetch contact from database..
app.get('/fetch-students', async (req, res) => {
    //connect database use mongoose model...
    let allStudents = await ContactModel.find({}).lean({}).then(students => {
        console.log('students')
    }).catch(err => {
        console.log(err);
    });
    res.send("ok")
})
// All post request starts Headers...
app.post("/contact", async (req, res) => {
    let payload = await res.body;
     nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ait.17bcs4511@gmail.com",
            pass:"golu2410",
        },
    }).sendMail({
        from: "ait.17bcs4511@gmail.com" ,
        to: [req.body.email, "priyanka.km@testyantra.com"],
        subject: "contact form ",
        html: `<h1>${req.body.firstname} ${req.body.lastname}  </h1>
               <p>${req.body.email}</p>
               <p>${req.body.phone}></p>
               <p>${req.body.description}</p>
       `

    })
    let data = await ContactModel.create(payload);
    res.send({ data, text: "successfully created" });

});
// All post request ends Headers...

//listening to port...
let port = 5000;
app.listen(port, err => {
  if (err) throw err;
  console.log("server is listening to port number 5000");
});
