const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");

const app = express();

/* Serve static files */
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

/* Home page */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

/* Form submit */
app.post("/", (req, res) => {
  const { fName, lName, email } = req.body;

  if (!email || !email.includes("@")) {
    return res.sendFile(path.join(__dirname, "failure.html"));
  }

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/a9ce337200";

  const options = {
    method: "POST",
    auth: "sai:" + process.env.MAILCHIMP_API_KEY,
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, "success.html"));
    } else {
      res.sendFile(path.join(__dirname, "failure.html"));
    }
  });

  request.write(jsonData);
  request.end();
});

/* Required for Vercel */
module.exports = app;
