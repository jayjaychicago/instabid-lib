# Universal trading UI

This creates a universal trading UI

## to install

Create an account on https://instabid.io to get an API key
```
npx create-react-app myInstabidClient
cd myInstabidClient
npm install instabid
```

then in the App.js add the following imports
```
import Instabid from "instabid";
import "bootstrap/dist/css/bootstrap.min.css";
```        
and in the main render method, add the following component
```
      <Instabid exchange="Insta" product="prod" user="YOUR_USER_IDENTIFIER" devModeApiKey="YOUR_API_KEY"></Instabid>
```

Do NOT use dev mode publicly to avoid making your secret key visible
For secure Prod, use your own self-autenticated API proxy to hide your secret API keys:
```
      <Instabid exchange="Insta" product="prod" user="YOUR_USER_IDENTIFIER" apiProxy="https://myapi.proxy.com/order"></Instabid>
```