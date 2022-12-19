//import InstaTable from "./components/InstaTable";
import {DepthTable} from "./components/DepthTable";
import InstaForm from "./components/InstaForm";
import Button from "react-bootstrap/Button";
//import {Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {

  return (
      <main className="column">
        
        <DepthTable exchange="Insta" product="prod"></DepthTable>
        <InstaForm></InstaForm>

      </main>
  );
}

export default App;