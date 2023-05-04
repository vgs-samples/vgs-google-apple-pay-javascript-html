const fs = require('fs')
const tls = require('tls')
const { curly } = require('node-libcurl')
const {EOL} = require('os');

const certFilePath = './/sandbox.pem'
const ca = '/tmp/vgs-outbound-proxy-ca.pem'
const tlsData = tls.rootCertificates.join(EOL)
const vgsSelfSigned = fs.readFileSync(certFilePath).toString('utf-8')
const systemCaAndVgsCa = tlsData + EOL + vgsSelfSigned;
fs.writeFileSync(ca, systemCaAndVgsCa)

async function run() {
    return curly.post("apple-pay-gateway.apple.com:443/paymentSession", {
      postFields: JSON.stringify({
      "merchantIdentifier": "merchant.verygoodsecurity.demo.applepay",
      "displayName": "Very Good Security",
      "initiative": "web",
      "initiativeContext": "Demo",
    }),
      httpHeader: ["Content-type: application/json"],
      caInfo: ca,
      sslVerifyPeer: false,
      sslVerifyHost: false,
      proxy: "UShVs1e5xaNLtknFZSwqJ6dC:013c259c-ff95-42c6-ab5f-a075052b110e@tntq31aihwk.SANDBOX.verygoodproxy.com:8080",
      verbose: true,
    })
}

run()
    .then((data) =>
        console.log(
            data
        ),
    )
    .catch((error) => console.error(`Something went wrong`, { error }))