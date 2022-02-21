import { merge } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IServer } from "../model/IServer";
import { IServerIni, MemoryMb } from "../model/IServerIni";
import { Difficulty, Gamemode, IServerProps } from "../model/IServerProps";
import { IRestClient } from "../rest/IRestClient";
import Spinner from "./Spinner";


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


const propForm = {
  'allow-flight'                        : 'boolean',
  'allow-nether'                        : 'boolean',
  'broadcast-console-to-ops'            : 'boolean',
  'broadcast-rcon-to-ops'               : 'boolean',
  'difficulty'                          : [
                                            Difficulty.PEACEFUL,
                                            Difficulty.EASY,
                                            Difficulty.NORMAL,
                                            Difficulty.HARD,
                                          ],
  'enable-command-block'                : 'boolean',
  'enable-jmx-monitoring'               : 'boolean',
  'enable-query'                        : 'boolean',
  'enable-rcon'                         : 'boolean',
  'enable-status'                       : 'boolean',
  'enforce-whitelist'                   : 'boolean',
  'entity-broadcast-range-percentage'   : 'number',
  'force-gamemode'                      : 'boolean',
  'function-permission-level'           : 'number',
  'gamemode'                            : [
                                            Gamemode.SURVIVAL,
                                            Gamemode.CREATIVE,
                                            Gamemode.ADVENTURE,
                                            Gamemode.SPECTATOR,
                                          ],
  'hardcore'                            : 'boolean',
  'hide-online-players'                 : 'boolean',
  'level-name'                          : 'text',
  'level-type'                          : 'text',
  'max-players'                         : 'number',
  'max-tick-time'                       : 'number',
  'max-world-size'                      : 'number',
  'motd'                                : 'text',
  'network-compression-threshold'       : 'number',
  'online-mode'                         : 'boolean',
  'op-permission-level'                 : 'number',
  'player-idle-timeout'                 : 'number',
  'prevent-proxy-connections'           : 'boolean',
  'pvp'                                 : 'boolean',
  'query.port'                          : 'number',
  'rate-limit'                          : 'number',
  'rcon.password'                       : 'text',
  'rcon.port'                           : 'number',
  'require-resource-pack'               : 'boolean',
  'resource-pack-prompt'                : 'text',
  'resource-pack-sha1'                  : 'text',
  'resource-pack'                       : 'text',
  'server-ip'                           : 'text',
  'server-port'                         : 'number',
  'simulation-distance'                 : 'number',
  'spawn-animals'                       : 'boolean',
  'spawn-monsters'                      : 'boolean',
  'spawn-npcs'                          : 'boolean',
  'spawn-protection'                    : 'number',
  'sync-chunk-writes'                   : 'boolean',
  'text-filtering-config'               : 'text',
  'use-native-transport'                : 'boolean',
  'view-distance'                       : 'number',
  'white-list'                          : 'boolean',
};


function ServerView(props: {restClient: IRestClient}) {
  const navigate    = useNavigate();
  const restClient  = props.restClient;
  const id: string  = useParams().id || '';

  const defaultProps: any = {
    'server-ip'                           : '',         // Sekai recommended
    'server-port'                         : '25565',    // Sekai recommended
    'motd'                                : '',         // Sekai recommended
    'online-mode'                         : 'false',    // Sekai recommended
    'allow-flight'                        : 'true',     // Sekai recommended
    'allow-nether'                        : 'Default',
    'broadcast-console-to-ops'            : 'Default',
    'broadcast-rcon-to-ops'               : 'Default',
    'difficulty'                          : 'Default',
    'enable-command-block'                : 'Default',
    'enable-jmx-monitoring'               : 'Default',
    'enable-query'                        : 'Default',
    'enable-rcon'                         : 'Default',
    'enable-status'                       : 'Default',
    'enforce-whitelist'                   : 'Default',
    'entity-broadcast-range-percentage'   : 'Default',
    'force-gamemode'                      : 'Default',
    'function-permission-level'           : 'Default',
    'gamemode'                            : 'Default',
    'hardcore'                            : 'Default',
    'hide-online-players'                 : 'Default',
    'level-name'                          : 'Default',
    'level-type'                          : 'Default',
    'max-players'                         : 'Default',
    'max-tick-time'                       : 'Default',
    'max-world-size'                      : 'Default',
    'network-compression-threshold'       : 'Default',
    'op-permission-level'                 : 'Default',
    'player-idle-timeout'                 : 'Default',
    'prevent-proxy-connections'           : 'Default',
    'pvp'                                 : 'Default',
    'query.port'                          : 'Default',
    'rate-limit'                          : 'Default',
    'rcon.password'                       : 'Default',
    'rcon.port'                           : 'Default',
    'require-resource-pack'               : 'Default',
    'resource-pack-prompt'                : 'Default',
    'resource-pack-sha1'                  : 'Default',
    'resource-pack'                       : 'Default',
    'simulation-distance'                 : 'Default',
    'spawn-animals'                       : 'Default',
    'spawn-monsters'                      : 'Default',
    'spawn-npcs'                          : 'Default',
    'spawn-protection'                    : 'Default',
    'sync-chunk-writes'                   : 'Default',
    'text-filtering-config'               : 'Default',
    'use-native-transport'                : 'Default',
    'view-distance'                       : 'Default',
    'white-list'                          : 'Default',
  };

  const defaultValues: IServer = {
    ini: {
      name: '',
      templateName: '',
      javaName: '',
      usableRam: 1024,
    },
    props: defaultProps,
  };

  const [srv, setSrv]                   = useState<IServer>(defaultValues);
  const [javaVersions, setJavaVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading]       = useState<boolean>(true);
  const [isShowingMore, setShowingMore] = useState<boolean>(false);
  const [isUpdating, setIsUpdating]     = useState<boolean>(false);
  const [isStarting, setIsStarting]     = useState<boolean>(false);
  const [isOnline, setIsOnline]         = useState<boolean>(false);

  const updateModel = (updates: IPartialServer) => {
    // @ts-ignore
    const newModel  = merge({}, srv, updates);

    // @ts-ignore
    setSrv(newModel);
    console.dir(newModel);
  };

  const updateServer = async () => {
    setIsUpdating(true);
    setIsLoading(true);

    let result;

    if (srv.ini.id !== undefined) {
      result = await restClient.updateServer(srv.ini.id, srv);
    } else {
      // @ts-ignore
      window.alert(`Server ID not found. Try refreshing the page.`);
      setIsUpdating(false);
      setIsLoading(false);
    }
    
    // @ts-ignore
    if (result !== undefined && result.error === undefined) {
      // @ts-ignore
      setSrv(result);
      setIsUpdating(false);
      setIsLoading(false);
    } else {
      // @ts-ignore
      window.alert(JSON.stringify(result, null, 4));
      setIsUpdating(false);
      setIsLoading(false);
    }
  };

  const runServer = async () => {
    if (srv.ini.id !== undefined) {
      setIsLoading(true);
      setIsStarting(true);
      await restClient.runServer(srv.ini.id);
      
      var pingInterval = setInterval(async function () {
        console.log('Pinging server..');

        if (await restClient.isServerUp(id)) {        
          setIsOnline(true);
          setIsLoading(false);
          setIsStarting(false);
          clearInterval(pingInterval);
        }
      }, 5000);

    } else {
      window.alert(`Server ${srv?.ini.name} has no ID.`);
    }
  }

  useEffect(() => {
    (async () => {
      // Fetch the templates and java versions
      const javas = await restClient.getJavaVersions();
      setJavaVersions(javas);
      console.log('called get templates and javas');

      // Nav back to home if no templates/javas
      if (javas.length > 0) {
        updateModel({
          ini: {
            templateName: '',
            javaName: javas[javas.length-1],
          }
        });
      } else {
        window.alert('No templates or Java versions found.');
        navigate('/');
      }

      // Fetch the server
      const srvResult = await restClient.getServer(id);
      setSrv(srvResult);
      console.log('called get server');
      const pingResult = await restClient.isServerUp(id);
      setIsOnline(pingResult);
      console.log('pinged server');
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    if (isUpdating) {
      return (
        <div className="w-100 max-w-md mx-auto px-5 pt-1">
          <div className='w-full flex justify-center mt-5 py-5'>
            <Spinner message='Updating server info' />
          </div>
        </div>
      );
    }
    else if (isStarting) {
      return (
        <div className="w-100 max-w-md mx-auto px-5 pt-1">
          <div className='w-full flex justify-center mt-5 py-5'>
            <Spinner message='Starting up' />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="w-100 max-w-md mx-auto px-5 pt-1">
          <div className='w-full flex justify-center mt-5 py-5'>
            <Spinner message='Loading' />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="w-100 max-w-md mx-auto px-5 pt-1">
      <div className='flex flex-col gap-4 mt-5'>
        {
          // @ts-ignore
          (isOnline) ? (
            <div className="flex gap-2">
              <div className="flex gap-2 px-3 py-1 border border-gray-500 rounded-full">
                <span className="mt-1 inline-block w-2 h-2 rounded-full bg-green-700 text-transparent text-sm text-right"></span>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex gap-2 px-3 py-1 border border-gray-500 rounded-full">
                <span className="mt-1 inline-block w-2 h-2 rounded-full bg-gray-500 text-transparent text-sm text-right"></span>
                <p className="text-xs text-gray-500">Offline</p>
              </div>
            </div>
          )
        }
        {/* SERVER NAME */}
        <div className='flex flex-col gap-1'>
          <span className="text-xs opacity-50">server / {srv?.ini.id}</span>
          <div className="flex justify-start gap-4">
            <input type="text" 
                className="w-full pb-1 font-bold text-2xl bg-transparent border border-transparent border-b-2 border-b-transparent outline-none hover:border-b-slate-800 focus:border-b-slate-600"
                  // @ts-ignore
                value={srv.ini.name}
                disabled={isLoading}
                onChange={ev => {
                  updateModel({ 
                    ini: {
                      // @ts-ignore
                      name: ev.target.value,
                    }
                  });
                }}
            />
          </div>

          <div className="flex justify-start gap-1 my-2">
            {
              (!isOnline) ? (
                <button className='text-sm px-2 py-1 rounded bg-green-700 opacity-80 hover:opacity-100 active:opacity-60'
                  onClick={() => runServer()}
                >
                Start
              </button>
              ) : (
                <button className='text-sm px-2 py-1 rounded bg-red-700 opacity-80 hover:opacity-100 active:opacity-60'
                  onClick={async () => {
                    if (srv?.ini.id !== undefined) {
                      window.alert(`TODO: Not implemented.`);
                    } else {
                      window.alert(`Server ${srv?.ini.name} has no ID.`);
                    }
                  }}>
                Stop
              </button>
              )
            }
          </div>
        </div>
        
        {/* TEMPLATE AND JAVA */}
        <div className="flex justify-center gap-2">
          {/* TEMPLATE NAME */}
          <div className='w-full flex flex-col'>
            <div className="flex justify-between">
              <span className='opacity-50 text-sm'>Template</span>
            </div>
            <span className="text-gray-100 text-base">
              {toReadableName(srv.ini.templateName)}
            </span>
          </div>
          {/* DATE CREATED */}
          <div className='w-full flex flex-col'>
            <div className="flex justify-between">
              <span className='opacity-50 text-sm'>Date created</span>
            </div>
            <span className="text-gray-100 text-base">
              yyyy/mm/dd
            </span>
          </div>
          {/* LAST RAN */}
          <div className='w-full flex flex-col'>
            <div className="flex justify-between">
              <span className='opacity-50 text-sm'>Last ran</span>
            </div>
            <span className="text-gray-100 text-base">
              yyyy/mm/dd
            </span>
          </div>
        </div>
        
        {/* GAMEMODE */}
        <div className='flex flex-col gap-1'>
          <div className="flex justify-between">
            <span className='opacity-50 text-sm'>Gamemode</span>
          </div>
          <select className='form-select'
              // @ts-ignore
              value={srv.props.gamemode}
              disabled={isLoading}
              onChange={ev => {
                updateModel({ 
                  props: {
                    // @ts-ignore
                    gamemode: ev.target.value,
                  }
                });
              }}
          >
            <option disabled>─────── Modern ───────</option>
            <option value='survival'>Survival</option>
            <option value='creative'>Creative</option>
            <option value='adventure'>Adventure</option>
            <option value='spectator'>Spectator</option>
            <option disabled>────── Before 1.12 ──────</option>
            <option value={Gamemode.SURVIVAL}>Survival (legacy)</option>
            <option value={Gamemode.CREATIVE}>Creative (legacy)</option>
            <option value={Gamemode.ADVENTURE}>Adventure (legacy)</option>
            <option value={Gamemode.SPECTATOR}>Spectator (legacy)</option>
          </select>
        </div>

        {/* DIFFICULTY */}
        <div className='flex flex-col gap-1'>
          <div className="flex justify-between">
            <span className='opacity-50 text-sm'>Difficulty</span>
          </div>
          <select className='form-select'
              // @ts-ignore
              value={srv.props.difficulty}
              disabled={isLoading}
              onChange={ev => {
                updateModel({ 
                  props: {
                    // @ts-ignore
                    difficulty: ev.target.value,
                  }
                });
              }}
          >
            <option disabled>─────── Modern ───────</option>
            <option value='peaceful'>Peaceful</option>
            <option value='easy'>Easy</option>
            <option value='normal'>Normal</option>
            <option value='hard'>Hard</option>
            <option disabled>────── Before 1.12 ──────</option>
            <option value={Difficulty.PEACEFUL}>Peaceful (legacy)</option>
            <option value={Difficulty.EASY}>Easy (legacy)</option>
            <option value={Difficulty.NORMAL}>Normal (legacy)</option>
            <option value={Difficulty.HARD}>Hard (legacy)</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className='flex flex-col gap-1'>
          <div className="flex justify-between">
            <span className='opacity-50 text-sm'>Description</span>
          </div>
          <input type="text" className='form-input'
              disabled={isLoading}
              value={srv.props.motd}
              onChange={ev => {
                updateModel({
                  props: {
                    motd: ev.target.value
                  }
                });
              }}
          />
        </div>

        <div className="flex justify-between gap-3">
          {/* USABLE RAM */}
          <div className='w-1/3 flex flex-col gap-1'>
            <div className="flex justify-between">
              <span className='opacity-50 text-sm'>Usable memory</span>
            </div>
            <select className='form-select'
                value={srv.ini.usableRam}
                disabled={isLoading}
                onChange={ev => {
                  updateModel({ 
                    ini: {
                      usableRam: Number(ev.target.value) as MemoryMb,
                    }
                  });
                }}
            >
              <option value={512}>Very low (512MB)</option>
              <option value={1024}>Low (1GB)</option>
              <option value={2048}>Medium (2GB)</option>
              <option value={4096}>High (4GB)</option>
              <option value={6144}>Ultra (6GB)</option>
            </select>
          </div>
          {/* PORT */}
          <div className='w-1/3 flex flex-col gap-1'>
            <div className="flex justify-between">
              <span className='opacity-50 text-sm'>Port</span>
            </div>
            <input type="text" className='form-input'
                disabled={isLoading}
                value={srv.props['server-port']}
                onChange={ev => {
                  updateModel({
                    props: {
                      // @ts-ignore
                      'server-port': ev.target.value
                    }
                  });
                }}
            />
          </div>
          {/* JAVA VERSION NAME */}
          <div className='w-1/3 flex flex-col gap-1'>
            <div className="flex justify-between">
              <span className='opacity-50 text-sm'>Java version</span>
            </div>
            <select className='form-select'
                disabled={isLoading}
                value={srv.ini.javaName}
                onChange={ev => {
                  updateModel({ 
                    ini: {
                      javaName: ev.target.value,
                    }
                  });
                }}
            >
              {
                javaVersions.map(javaName => (
                  <option value={javaName} key={javaName}>
                    {toReadableName(javaName)}
                  </option>
                ))
              }
            </select>
          </div>
        </div>
        
        {
          (!isShowingMore) ? (
            <button
                className="bg-transparent text-blue-600 opacity-80 mt-1 hover:opacity-100 active:opacity-60"
                onClick={() => setShowingMore(true)}>
              + Show advanced settings
            </button>
          ) : (
            <>
              <button 
                  className="bg-transparent text-blue-600 mt-1 hover:opacity-100 active:opacity-60"
                  onClick={() => setShowingMore(false)}>
                - Hide advanced settings
              </button>
              {
                Object.entries(propForm).map(([k, v]) => {
                  if (v === 'text' || v === 'number') {
                    return (
                      <div className='flex flex-col gap-1'>
                        <div className="flex justify-between">
                          <span className='opacity-50 text-sm'>{k.replace(/-/g, ' ')}</span>
                        </div>
                        <input type='text' className='form-input'
                            // @ts-ignore
                            value={srv.props[k]}
                            disabled={isLoading}
                            onChange={ev => {
                              updateModel({
                                props: {
                                  [k]: ev.target.value,
                                }
                              });
                            }}
                        />
                      </div>
                    );
                  }
                  else if (v === 'boolean') {
                    return (
                      <div className='flex flex-col gap-1'>
                        <div className="flex justify-between">
                          <span className='opacity-50 text-sm'>{k.replace(/-/g, ' ')}</span>
                        </div>
                        <select className='form-select'
                            // @ts-ignore
                            value={srv.props[k]}
                            disabled={isLoading}
                            onChange={ev => {
                              updateModel({ 
                                props: {
                                  [k]: ev.target.value,
                                }
                              });
                            }}
                        >
                          <option value='Default'>Default</option>
                          <option value='true'>Yes</option>
                          <option value='false'>No</option>
                        </select>
                      </div>
                    );
                  }
                  else {
                    return (
                      <div className='flex flex-col gap-1'>
                        <div className="flex justify-between">
                          <span className='opacity-50 text-sm'>{k.replace(/-/g, ' ')}</span>
                        </div>
                        <select className='form-select'
                            // @ts-ignore
                            value={srv.props[k]}
                            disabled={isLoading}
                            onChange={ev => {
                              updateModel({ 
                                props: {
                                  [k]: ev.target.value,
                                }
                              });
                            }}
                        >
                          <option value='Default'>Default</option>
                          {
                            // @ts-ignore
                            v.map((choice) => (
                              <option value={choice}>{choice}</option>
                            ))
                          }
                        </select>
                      </div>
                    );
                  }
                })
              }
            </>
          )
        }


        {/* CREATE BTN */}
        <div className='flex flex-col gap-1 mt-2'>
          <button
              disabled={isLoading} 
              className='btn-sm-blue py-3 mb-5'
              onClick={updateServer}
          >
            Save changes
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default ServerView;