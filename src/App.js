//import InstaTable from "./components/InstaTable";
import {DepthTable} from "./components/DepthTable";
import InstaForm from "./components/InstaForm";
import Button from "react-bootstrap/Button";
import Instabid from "./components/Instabid";
//import {Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() { 

  return (
      <main >
        <Instabid exchange="Insta" product="prod" user="julien"></Instabid>
      </main>
  );
}

export default App;