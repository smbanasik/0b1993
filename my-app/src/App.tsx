import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

interface FormData {
  $schema: string,
  branches: Array<object>,
  category: string,
  description: string,
  edges: Array<object>,
  forms: Array<object>,
  id: string,
  name: string,
  nodes: Array<object>,
  tenant_id: string,
  triggers: Array<object>,
}

function App() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function getFormData() {
      const ip = "127.0.0.1";
      const port = "3000";
      const tenant_id = "1";
      const blueprint_id = "bp_345";

      const url = "http://" + ip + ":" + port
      + "/api/v1/" + tenant_id 
      + "/actions/blueprints/" + blueprint_id 
      + "/graph";

      const response = await fetch(url, {method: 'GET'});
      const data: FormData = await response.json();
      setFormData(data);
      setLoading(false);
    }

    getFormData();
  }, []);

  if(!loading) {
    if(!formData) {
      console.log("Form data not found!");
    } else {
      console.log(formData);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          
        </a>
        {loading ? (<p>Loading...</p>) : (<p>{formData?.$schema}</p>)}
      </header>
    </div>
  );
}

export default App;
