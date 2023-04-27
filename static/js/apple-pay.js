
const ApplePaySession = window.ApplePaySession

const onApplePayLoaded = () => {

  const ApplePaySession = window.ApplePaySession

  if (ApplePaySession) {
    var merchantIdentifier = 'merchant.verygoodsecurity.demo.applepay';
    if (ApplePaySession.canMakePayments(merchantIdentifier)) {
      document.querySelectorAll("#apple .not-supported")[0].classList.add("hidden")
    } 
  } 
  
  // See: https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/checking_for_apple_pay_availability
  // if (ApplePay) {
  //   var merchantIdentifier = 'merchant.verygoodsecurity.demo.applepay';
  //   var promise = ApplePay.canMakePaymentsWithActiveCard(merchantIdentifier);
  //   promise.then(function (canMakePayments) {
  //     if (canMakePayments) {
  //       document.querySelectorAll("#apple .not-supported")[0].classList.add("hidden")
  //     }
  //   })
  // }

}


const createApplePaySession = () => {

  console.log("TEETETETETE")

  const backend = "https://localhost:3000/session"
  const url = `https://${vgs.VAULT_ID}-${vgs.APPLE_PAY_ROUTE_ID}.sandbox.verygoodproxy.com/post`
  const ApplePaySession = window.ApplePaySession

  var request = {
    countryCode: 'US',
    currencyCode: 'USD',
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
    merchantCapabilities: ['supports3DS'],
    total: { label: 'Very Good Security', amount: '10.00' },
  }
  var session = new ApplePaySession(8, request);

  session.onvalidatemerchant = event => {

    console.log(event)

    // Call your own server to request a new merchant session.
    // See: https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/requesting_an_apple_pay_payment_session
    fetch(backend, {
      method: "GET", 
    }).then(res => res.json()) // Parse response as JSON.
      .then(merchantSession => {
        session.completeMerchantValidation(merchantSession);
      })
      .catch(err => {
        console.error("Error fetching merchant session", err);
      })
  };

  session.onshippingcontactselected = event => {
    // Do things
  }
  
  session.onpaymentauthorized = token => {

    // show returned data in developer console for debugging
    console.log(token);
    // @todo pass payment token to your gateway to process payment
    // @note DO NOT save the payment credentials for future transactions,

    let url = `https://${vgs.VAULT_ID}-${vgs.APPLE_PAY_ROUTE_ID}.sandbox.verygoodproxy.com/post`
    let successEl = document.querySelectorAll('#apple-pay .success p')[0]
    let errorEl = document.querySelectorAll('#apple-pay .error p')[0]
    let requestEl = document.querySelectorAll('#apple-pay .request p')[0]
    let responseEl = document.querySelectorAll('#apple-pay .response p')[0]

    requestEl.innerHTML = JSON.stringify(payload, null, 2)
  
    fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({token: token})
    }).then(res => {
      if (res.status != 200) res.text().then(res => errorEl.innerHTML = res )
      else {
        successEl.innerHTML = 'Success!'
        res.json().then(json => {
          responseEl.innerHTML = JSON.stringify(JSON.parse(json.data))
        })
      }
    }).catch(error => {
        // Not a processing error, code/fetch error
        console.log(error)
      });
    
  }

  session.begin()
}