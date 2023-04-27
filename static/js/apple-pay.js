
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

  console.log(session)

  session.onshippingcontactselected = event => {
    // Do things
  }
  
  session.onpaymentauthorized = token => {
    fetch(url, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: token
    })
      .then(function (response) {
        state.success = 'Success!'
        session.completePayment({ "status": 0 })
        state.response = JSON.stringify(JSON.parse(response.data.data), null, 2)
        passToParent(state)
      })
      .catch(function (error) {
        state.error = error
        session.completePayment({
          "status": 1,
          "errors": [error]
        })
        passToParent(state)
      });
  }
  session.begin()
}