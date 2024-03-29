
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

  const backend = document.location.href + "paymentSession"
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
    axios.post(backend, { appleUrl: event.validationURL },
      {
        headers: {
          "Content-Type": "application/json",
        }
    }).then(res => {
        console.log(res.data)
        session.completeMerchantValidation(res.data);
      })
      .catch(err => {
        console.error("Error fetching merchant session", err);
      })
  };


  session.onpaymentauthorized = function (event) {
      performTransaction(event.payment, function (outcome) {
        if (outcome.approved) {
          session.completePayment(ApplePaySession.STATUS_SUCCESS)
          console.log(outcome)
        } else {
          session.completePayment(ApplePaySession.STATUS_FAILURE)
          console.log(outcome)
        }
      })
  }


  const performTransaction = (details, callback) => {

    const backend = `https://${vgs.VAULT_ID}-${vgs.APPLE_PAY_ROUTE_ID}.sandbox.verygoodproxy.com/post`

    let successEl = document.querySelectorAll('#apple-pay .success p')[0]
    let errorEl = document.querySelectorAll('#apple-pay .error p')[0]
    let requestEl = document.querySelectorAll('#apple-pay .request p')[0]
    let responseEl = document.querySelectorAll('#apple-pay .response p')[0]
    

    requestEl.innerHTML = JSON.stringify(details.token, null, 2)
    
    axios.post(backend, details.token,
      {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        },
      }).then(res => {
        if (res.status != 200){
          errorEl.innerHTML = res
          callback({ approved: false })
      } else {
        successEl.innerHTML = 'Success!'
        console.log(res.data.json)
        responseEl.innerHTML = JSON.stringify(res.data.json, null, 4)
        callback({approved: true})
      }
    }).catch(error => {
        // Not a processing error, code/fetch error
        callback({approved: false})
        console.log(error)
      });
  }
  session.begin()
}