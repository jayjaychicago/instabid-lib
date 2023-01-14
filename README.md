# Universal trading UI

This creates a universal trading UI

## to install

npx create-react-app myInstabidClient
cd myInstabidClient
npm install instabidclient-dev

then in the App.js add the following imports
```
import Instabid from "instabidclient-dev";
import "bootstrap/dist/css/bootstrap.min.css";
```        
and in the main render method, add the following component
`      <Instabid exchange="Insta" product="prod" user="julien"></Instabid>`