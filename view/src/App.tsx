import React from 'react';
import {useState} from 'react';
import { IServer } from './model/IServer';

function App() {
  const [servers, setServers] = useState<IServer[]>([]);
  
  return (
    <div className="App">
      <div className="container pt-5">
        
        <h3 className="mb-5">Servers</h3>

        <div className="card" style={{ width: '24rem' }}>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="btn btn-primary">Open</a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
