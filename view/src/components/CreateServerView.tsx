import { merge } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IServerConfig } from "../model/IServerConfig";
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


function CreateServerView(props: {restClient: IRestClient}) {
  const restClient = props.restClient;
  const navigate = useNavigate();

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

  const defaultValues: IServerConfig = {
    ini: {
      name: '',
      owner: '',
      templateName: '',
      javaName: '',
      usableRam: 1024,
    },
    props: defaultProps,
  };

  const [srv, setSrv]                   = useState<IServerConfig>(defaultValues);
  const [templates, setTemplates]       = useState<string[]>([]);
  const [javaVersions, setJavaVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading]       = useState<boolean>(true);
  const [isShowingMore, setShowingMore] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const updateModel = (updates: IPartialServer) => {
    // @ts-ignore
    const newModel  = merge({}, srv, updates);

    // @ts-ignore
    setSrv(newModel);
    console.dir(newModel);
  };

  const submitServer = async () => {
    setIsSubmitting(true);
    setIsLoading(true);

    const rawSrvProps = srv.props;
    const cleanProps: IServerProps = {};

    // Delete all default values from props
    for (const [k, v] of Object.entries(rawSrvProps)) {
      if (v !== 'Default') {
        let cleanVal = v;
        try {
          cleanVal = JSON.parse(v);
        } catch (err) {
          cleanVal = `${v}`;
        }
        // @ts-ignore
        cleanProps[k] = cleanVal;
      }
    }

    const result = await restClient.createServer(srv.ini, cleanProps);
    
    // @ts-ignore
    if (result.error === undefined) {
      navigate(`/server/${result.ini.id}`);
    } else {
      // @ts-ignore
      window.alert(JSON.stringify(result, null, 4));
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
        const tmpls = await restClient.getTemplates();
        const javas = await restClient.getJavaVersions();
        setTemplates(tmpls);
        setJavaVersions(javas);
        console.log('called get templates and javas');
        setIsLoading(false);

        if (tmpls.length > 0 && javas.length > 0) {
          updateModel({
            ini: {
              templateName: tmpls[tmpls.length-1],
              javaName: javas[javas.length-1],
            }
          });
        } else {
          window.alert('No templates or Java versions found.');
          navigate('/');
        }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="w-100 max-w-md mx-auto px-5 pt-1">
        <div className='w-full flex justify-center mt-5 py-5'>
          <Spinner message={isSubmitting ? 'Creating server' : ''} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 max-w-md mx-auto px-5 pt-1">
      <div className='flex flex-col gap-4 mt-5'>

        {/* SERVER NAME */}
        <div className='flex flex-col gap-1'>
          <div className="flex justify-between">
            <span className='opacity-50 text-sm'>Server name</span>
            {
              (srv.ini.id !== undefined && srv.ini.id !== '')
                ? <span className='opacity-50 text-sm'>ID: {srv.ini.id}</span>
                : <></>
            }
          </div>
          <input type="text" className='form-input'
              disabled={isLoading}
              value={srv.ini.name}
              onChange={ev => {
                updateModel({
                  ini: {
                    name: ev.target.value,
                    id: generateSrvId(ev.target.value),
                  }
                });
              }}
          />
          <span className="text-xs text-gray-600 italic">
            The ID is permanent and must be unique.
          </span>
        </div>
        
        {/* OWNER */}
        <div className='flex flex-col gap-1'>
          <div className="flex justify-between">
            <span className='opacity-50 text-sm'>Owner</span>
          </div>
          <input type="text" className='form-input'
              disabled={isLoading}
              value={srv.ini.owner}
              onChange={ev => {
                updateModel({
                  ini: {
                    owner: ev.target.value
                  }
                });
              }}
          />
          <span className="text-xs text-gray-600 italic">
            Your name or Minecraft username.
          </span>
        </div>

        {/* TEMPLATE AND JAVA */}
        {/* <div className="flex justify-center gap-2"> */}
          {/* TEMPLATE NAME */}
          <div className='w-full flex flex-col gap-1'>
            <div className="flex justify-between">
              <span className='opacity-50 text-sm'>Template</span>
            </div>
            <select className='form-select '
                disabled={isLoading}
                value={srv.ini.templateName}
                onChange={ev => {
                  updateModel({ 
                    ini: {
                      templateName: ev.target.value,
                    }
                  });
                }}
            >
              {
                templates.map(templateName => (
                  <option value={templateName} key={templateName}>
                    {toReadableName(templateName)}
                  </option>
                ))
              }
            </select>
            <span className="text-xs text-gray-600 italic">
              Minecraft version or modpack.
            </span>
          </div>

          {/* JAVA VERSION NAME */}
          <div className='w-full flex flex-col gap-1'>
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
            <span className="text-xs text-gray-600 italic">
              Minecraft uses different Java versions. Use the latest one that works.
            </span>
          </div>
        {/* </div> */}
        
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
            <option value='Default'>Default</option>
            <option value={Gamemode.SURVIVAL}>Survival</option>
            <option value={Gamemode.CREATIVE}>Creative</option>
            <option value={Gamemode.ADVENTURE}>Adventure</option>
            <option value={Gamemode.SPECTATOR}>Spectator</option>
          </select>
          <span className="text-xs text-gray-600 italic">
              Default will use the template's default gamemode.
          </span>
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
            <option value='Default'>Default</option>
            <option value={Difficulty.PEACEFUL}>Peaceful</option>
            <option value={Difficulty.EASY}>Easy</option>
            <option value={Difficulty.NORMAL}>Normal</option>
            <option value={Difficulty.HARD}>Hard</option>
          </select>
          <span className="text-xs text-gray-600 italic">
              Default will use the template's default difficulty.
          </span>
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
          <span className="text-xs text-gray-600 italic">
            This will also be shown in the server list in-game.
          </span>
        </div>

        {/* USABLE RAM */}
        <div className='flex flex-col gap-1'>
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
          <span className="text-xs text-gray-600 italic">
            Low to Medium is enough for a small number of players.
          </span>
        </div>

        {/* PORT */}
        <div className='flex flex-col gap-1'>
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
          <span className="text-xs text-gray-600 italic">
            Keep at 25565 if you don't plan to run this alongside other servers.
          </span>
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
              onClick={submitServer}
          >
            Create
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default CreateServerView;