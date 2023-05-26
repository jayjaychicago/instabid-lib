# Universal trading UI

This creates a universal trading UI

## to install

Create an account on https://instabid.io to get an API key
Create an exchange and product to trade
```
npx create-react-app myInstabidClient
cd myInstabidClient
npm install instabid
```

then in the App.js add the following imports
```
import Instabid from "instabid";
import {OrderTable} from "instabid";
import {FillTable} from "instabid";
import "bootstrap/dist/css/bootstrap.min.css";
```        
and in the main render method, add the following component
```
<div>
  <h1>INSTABID</h1>
      <Instabid exchange="YOUR_EXCHANGE" product="YOUR_PRODUCT" user="YOUR_USER_IDENTIFIER" devModeApiKey="YOUR_API_KEY"></Instabid>
  <h1>ORDERS</h1>
      <OrderTable exchange="YOUR_EXCHANGE" product="YOUR_PRODUCT" user="YOUR_USER_IDENTIFIER" devModeApiKey="YOUR_API_KEY"></OrderTable>
  <h1>FILLS</h1>
      <FillTable exchange="YOUR_EXCHANGE" product="YOUR_PRODUCT" user="YOUR_USER_IDENTIFIER" devModeApiKey="YOUR_API_KEY"></FillTable>
</div>

```

Do NOT use dev mode publicly to avoid making your secret key visible
For secure Prod, use your own self-autenticated API proxy to hide your secret API keys:
```
      <Instabid exchange="Insta" product="prod" user="YOUR_USER_IDENTIFIER" apiProxy="https://myapi.proxy.com/order"></Instabid>
```