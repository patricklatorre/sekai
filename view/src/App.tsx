import React from 'react';
import {useState} from 'react';
import { IServer } from './model/IServer';

function Navbar() {
  return (
    <div className="fixed pt-2 top-0 left-0 right-0 z-50 bg-gray-900">
      <h1 className="text-xl font-bold text-center">sekai.</h1>
      <hr className="mt-3 opacity-10"/>
    </div>
  );
}


function PromptMessage(props: {msg:string}) {
  if (props.msg === undefined || props.msg === '') {
    return (<></>);
  }

  return (
    <div className="w-100 max-w-2xl mx-auto bg-blue-700">
      {props.msg}
    </div>
  );
}


function App() {
  const [servers, setServers]     = useState<IServer[]>([]);
  const [promptMsg, setPromptMsg] = useState<string>('');

  /* CONDITIONAL RENDERS */

  return (
    <div className="App">
      {/* NAVBAR */}
      <Navbar />
      
      {/* NAVBAR SPACER */}
      <div className="py-5 mb-2"></div>
      
      {/* PROMPTS */}
      <PromptMessage msg={promptMsg}/>

      {/* SERVER LIST */}
      <div className="w-100 max-w-3xl mx-auto">
        
        <ul>
          <li>srv</li>
          <li>srv</li>
          <li>srv</li>
          <li>srv</li>
          <li>srv</li>
        </ul>

      </div>
    </div>
  );
}

export default App;
