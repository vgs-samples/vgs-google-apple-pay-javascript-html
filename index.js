// Import builtin NodeJS modules to instantiate the service
const https = require("https");
const fs = require("fs");
const path = require("path")


// Import the express module
const express = require("express");

// Instantiate an Express application
const app = express();

app.use(express.static('static'))

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is runing at port " + process.env.PORT);
  });

// Create an try point route for the Express app listening on port 4000.
// This code tells the service to listed to any request coming to the / route.
// Once the request is received, it will display a message "Hello from express server."
app.get('/', (req,res)=>{
    res.sendFile("index.html")
})

app.get('/session', (req, res) => {

  const url = 'https://apple-pay-gateway.apple.com/paymentSession'
  const data = {
      merchantIdentifier: "merchant.verygoodsecurity.demo.applepay",
      displayName: "Very Good Security",
      initiative: "web",
      initiativeContext: "Demo"
    };
  const customHeaders = {
      "Content-Type": "application/json",
  }

  fetch(url, {
      method: "POST",
      headers: customHeaders,
      body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.send(data)
    });

})