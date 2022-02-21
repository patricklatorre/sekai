import { setUncaughtExceptionCaptureCallback } from 'process';
import React, { useEffect, useState } from 'react';
import { merge } from 'lodash';

import { useNavigate, useParams } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IServer } from './model/IServer';
import { IServerIni, MemoryMb } from './model/IServerIni';
import { IServerProps } from './model/IServerProps';
import { IRestClient } from './rest/IRestClient';
import RestClientV1 from './rest/RestClientV1';
import CreateServerView from './components/CreateServerView';
import ServerView from './components/ServerView';
import Spinner from './components/Spinner';

interface IPartialServer {
  ini?: Partial<IServerIni>;
  props?: Partial<IServerProps>;
}

function generateSrvId(name: string) {
  return name.replace(/[\W_]+/g, '').toLowerCase();
}

function toReadableName(name: string) {
  return name.replace(/[_-]/g, ' ');
}

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="fixed flex flex-col justify-start items-center pt-2 top-0 left-0 right-0 z-50 bg-slate-900">
      <div className="max-w-3xl px-5 w-full flex justify-between mx-5">
        <div className="flex justify-between">
          <h1 className="inline-block px-2 text-xl font-bold text-left cursor-pointer opacity-80 hover:opacity-100"
            onClick={() => navigate('/')}
          >
            sekai.
          </h1>
        </div>
        <button className='btn-sm-blue' onClick={() => navigate('/new')}>Create server</button>
      </div>
      <hr className="mt-3 opacity-10 w-full"/>
      {/* <a href="/" className="text-xl font-bold text-center w-full">sekai.</a> */}
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


function ServerListView(props: {restClient: IRestClient, srvs:IServer[]}) {
  const navigate = useNavigate();
  const srvs = props.srvs;
  const restClient = props.restClient;
  const [filtered, setFiltered]   = useState<IServer[]>(srvs);
  const [searchKey, setSearchKey] = useState<string>('');
  const [onlineMap, setOnlineMap] = useState<{[key:string]: boolean}>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const filterServers = (key: string) => {
    if (key === '') {
      setFiltered(srvs);
      return;
    }

    const rawKey      = (String.raw`` + key).replace(/\W+/g, '');
    const rule        = new RegExp(rawKey, 'i');
    const afterFilter = srvs.filter(srv => srv.ini.name.match(rule));
    setFiltered(afterFilter);
  }

  useEffect(() => {
    setFiltered(srvs);

    (async () => {
      const newOnlineMap: {[key:string]: boolean} = {};
  
      for (const srv of srvs) {
        const srvId = srv.ini.id as string;
        newOnlineMap[srvId] = await restClient.isServerUp(srvId);
      }
  
      setOnlineMap(newOnlineMap);
      setIsLoading(false);
    })();
  }, [srvs]);

  if (isLoading) {
    return (
      <div className="w-100 max-w-3xl mx-auto px-5 pt-1">
        <div className='w-full flex justify-center mt-5 py-5'>
          <Spinner message='Loading..' />
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 max-w-3xl mx-auto">
        {/* SERVER LIST */}
        <div className="flex justify-center align-center mt-5 pt-1">
          <input
              type="text"
              className='py-1 px-2 rounded-full my-4 mx-4 w-full max-w-md bg-slate-800 text-slate-100 text-center opacity-80 focus:opacity-100'
              value={searchKey}
              placeholder='search'
              onChange={(ev) => {
                filterServers(ev.target.value);
                setSearchKey(ev.target.value);
              }}
          />
        </div>
        <ul className='flex flex-wrap gap-2 mt-5 mx-4 justify-center align-center'>
          {
            filtered.map((srv, index) => (
              <li key={srv.ini.id} className="py-3 px-5 bg-gray-400 text-gray-800 border border-black rounded shadow-md w-full max-w-md cursor-pointer opacity-80 hover:opacity-100"
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/server/${srv.ini.id}`);
                }}
              >
                <div className="flex flex-row justify-between">
                  <div className="flex justify-start gap-4">
                    {
                      // @ts-ignore
                      (onlineMap[srv.ini.id])
                        ? <span className="mt-2 inline-block w-2 h-2 rounded-full bg-green-700 text-transparent text-sm text-right">.</span>
                        : <span className="mt-2 inline-block w-2 h-2 rounded-full bg-gray-500 text-transparent text-sm text-right">Offline</span>
                    }
                    <div className="flex flex-col justify-start">
                      <h6>
                        {srv.ini.name}
                      </h6>
                      <p className="text-gray-500 text-sm">
                        <em>{srv.props.motd}</em>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <p className='text-gray-600 text-sm'>
                      {toReadableName(srv.ini.templateName)}
                    </p>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
  );
}

/*
function ServerView(props: {restClient: IRestClient}) {
  const restClient = props.restClient;
  const id: string = useParams().id || '';

  const [server, setServer] = useState<IServer>();

  useEffect(() => {
    (async () => {
      const srvResult = await restClient.getServer(id);
      setServer(srvResult);
      console.log('called get server');
    })();
  }, []);

  return (
    <div className="w-100 max-w-3xl mx-auto px-5">
      <div className='flex flex-col gap-3 mt-5'>
        <div className="flex justify-between">
          <h2 className='font-bold text-2xl'>{server?.ini.name}</h2>
          <button className='px-2 py-1 rounded bg-green-900'
            onClick={async () => {
              if (server?.ini.id !== undefined) {
                await restClient.runServer(server?.ini.id);
              } else {
                window.alert(`Server ${server?.ini.name} has no ID.`);
              }
            }}>
            Run
          </button>
        </div>
        <textarea
            className='text-xs w-full opacity-25 bg-transparent text-white'
            rows={30}
            value={JSON.stringify(server, null, 4)}
            disabled
        ></textarea>
      </div>
    </div>
  );
}
*/

function App() {
  const restClient: IRestClient = new RestClientV1();

  const [servers, setServers]     = useState<IServer[]>([]);
  const [promptMsg, setPromptMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      const srvs = await restClient.getServers();
      setServers(srvs);
      console.log(`called get servers`);
    })();
  }, []);

  /* CONDITIONAL RENDERS */

  return (
    <div className="App">
      {/* NAVBAR */}
      <Navbar />

      {/* NAVBAR SPACER */}
      <div className="py-5 mb-2"></div>

      {/* PROMPTS */}
      <PromptMessage msg={promptMsg}/>
      
      <Routes>
        <Route path="/" element={<ServerListView restClient={restClient} srvs={servers} />} />
        <Route path="/new" element={<CreateServerView restClient={restClient} />} />
        <Route path="/server/:id" element={<ServerView restClient={restClient} />} />
      </Routes>
      
    </div>
  );
}

export default App;
