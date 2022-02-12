export enum Difficulty {
  PEACEFUL  = 0,
  EASY      = 1,
  NORMAL    = 2,
  HARD      = 3
}

export enum Gamemode {
  SURVIVAL  = 0,
  CREATIVE  = 1,
  ADVENTURE = 2,
  SPECTATOR = 3
}

export interface IProperties {
  'allow-flight'                        ?: boolean;
  'allow-nether'                        ?: boolean;
  'broadcast-console-to-ops'            ?: boolean;
  'broadcast-rcon-to-ops'               ?: boolean;
  'difficulty'                          ?: Difficulty;
  'enable-command-block'                ?: boolean;
  'enable-jmx-monitoring'               ?: boolean;
  'enable-query'                        ?: boolean;
  'enable-rcon'                         ?: boolean;
  'enable-status'                       ?: boolean;
  'enforce-whitelist'                   ?: boolean;
  'entity-broadcast-range-percentage'   ?: number;
  'force-gamemode'                      ?: boolean;
  'function-permission-level'           ?: number;
  'gamemode'                            ?: Gamemode;
  'hardcore'                            ?: boolean;
  'hide-online-players'                 ?: boolean;
  'level-name'                          ?: string;
  'max-players'                         ?: number;
  'max-tick-time'                       ?: number;
  'max-world-size'                      ?: number;
  'motd'                                ?: string;
  'network-compression-threshold'       ?: number;
  'online-mode'                         ?: boolean;
  'op-permission-level'                 ?: number;
  'player-idle-timeout'                 ?: number;
  'prevent-proxy-connections'           ?: boolean;
  'pvp'                                 ?: boolean;
  'query.port'                          ?: number;
  'rate-limit'                          ?: number;
  'rcon.password'                       ?: string;
  'rcon.port'                           ?: number;
  'require-resource-pack'               ?: boolean;
  'resource-pack-prompt'                ?: string;
  'resource-pack-sha1'                  ?: string;
  'resource-pack'                       ?: string;
  'server-ip'                           ?: string;
  'server-port'                         ?: number;
  'simulation-distance'                 ?: number;
  'spawn-animals'                       ?: boolean;
  'spawn-monsters'                      ?: boolean;
  'spawn-npcs'                          ?: boolean;
  'spawn-protection'                    ?: number;
  'sync-chunk-writes'                   ?: boolean;
  'text-filtering-config'               ?: string | unknown;
  'use-native-transport'                ?: boolean;
  'view-distance'                       ?: number;
  'white-list'                          ?: boolean;
}

/**
#Minecraft server properties
#Sun Jan 16 01:02:31 SGT 2022
enable-jmx-monitoring=false
rcon.port=3033
enable-command-block=false
gamemode=survival
enable-query=false
level-name=Survival LT 2
motd=[1.18] Part 2
query.port=25565
pvp=true
difficulty=normal
network-compression-threshold=256
max-tick-time=60000
require-resource-pack=false
max-players=20
use-native-transport=true
online-mode=false
enable-status=true
allow-flight=true
broadcast-rcon-to-ops=true
view-distance=14
server-ip=
resource-pack-prompt=
allow-nether=true
server-port=55555
enable-rcon=true
sync-chunk-writes=true
op-permission-level=4
prevent-proxy-connections=false
hide-online-players=false
resource-pack=
entity-broadcast-range-percentage=100
simulation-distance=10
rcon.password=55512fqwefiuna
player-idle-timeout=0
force-gamemode=false
rate-limit=0
hardcore=false
white-list=false
broadcast-console-to-ops=true
spawn-npcs=true
spawn-animals=true
function-permission-level=2
text-filtering-config=
spawn-monsters=true
enforce-whitelist=false
resource-pack-sha1=
spawn-protection=16
max-world-size=29999984
*/
