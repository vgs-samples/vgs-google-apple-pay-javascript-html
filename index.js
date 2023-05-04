const express = require("express");
const https = require("https")
const fs = require("fs")
const path = require('path')

// Instantiate an Express application
const app = express();

app.use(express.static('static'))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is runing at port ${process.env.PORT || 3000}`);
  });

app.get('/', (req,res)=>{
    res.sendFile("index.html")
})

app.post('/paymentSession', async (req, res) => {
    const { appleUrl } = req.body;

    // use set the certificates for the POST request
    httpsAgent = new https.Agent({
        rejectUnauthorized: false,
        cert: fs.readFileSync(path.join(__dirname, './apple-pay/certificate.pem')),
        key: fs.readFileSync(path.join(__dirname, './apple-pay/sandbox.key')),
    })

    response = await axios.post(
        appleUrl,
        {
            merchantIdentifier: 'merchant.verygoodsecurity.demo.applepay',
            domainName: 'vgs-google-apple-pay-demo-js.herokuapp.com',
            displayName: 'VGS Demo',
        },
        {
            httpsAgent,
        }
    )
  res.send(response.data)
  
})