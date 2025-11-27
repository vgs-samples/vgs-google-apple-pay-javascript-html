# Very Good Security - Google and Apple Pay React

![Alt text](/static/splash.png?raw=true "Title")

## To run the app: 

1. Copy the `.key` and `.pem` files you created from the [VGS Apple Pay integration guide](https://www.verygoodsecurity.com/docs/integrations/apple-pay/) into the `/apple-pay/` folder. 
2. In `static/index.html` update the `const vgs` to contain your Vault & Route information.
3. Edit the `/paymentSession` route in `index.js` in the root of the project to post your Apple Merchant information instead.

To run the application on Heroku, simply deploy the application, then update the file in `static/.well-known/`to verify your domain.

--- 

### To run locally without HTTPS

#### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.

**Note:** You will need to run the application on a HTTPS domain for the Apple Pay Button to display. You can create a self-signed certificate and trust this on your machine (see: [Windows](https://medium.com/@praveenmobdev/localhost-as-https-with-reactjs-app-on-windows-a1270d7fbd1f), [MacOS](https://support.apple.com/en-my/guide/keychain-access/kyca2431/mac))
