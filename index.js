const axios = require("axios")
const enforce = require('express-sslify');
const express = require("express");
const https = require("https")
const fs = require("fs")
// Instantiate an Express application
const app = express();

app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(express.static('static'))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is runing at port ${process.env.PORT || 3000}`);
  });

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


  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // (NOTE: this will disable client verification)
    cert: fs.readFileSync("./cert.pem"),
    key: fs.readFileSync("./key.pem"),
    passphrase: "ISBN5o6o12o1623;."
  })
  
  axios.post(url, data,  { httpsAgent }).then(({ data }) => {
      console.log(data);
  }).catch((error) => {
      console.error(error);
  });
  
})