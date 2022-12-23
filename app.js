const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public")); //so that you can use a static folder and apply your css file
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const fistName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const listId = "b54dd39a12"

    mailchimp.setConfig({
        apiKey: "05b7b4f5cf3bd0999d0b340df365ef1a-us12",
        server: "us12",
      });

    const run = async () => {
    try {
        const response = await mailchimp.lists.batchListMembers(listId, {
            members: [{
                email_address: email,
                status: "pending",
                merge_fields: {
                    FNAME: fistName,
                    LNAME: lastName,
                }
            }],
        });

        if (response.error_count < 1) {
            console.log(response.new_members[0].status);
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
            console.log(response.errors[0].error);
        }

    } catch (err) {
        console.log(err.status);
        res.sendFile(__dirname + "/failure.html");
    }

    }
    run();

});

app.post("/fail", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});
