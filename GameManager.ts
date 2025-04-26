import * as hz from 'horizon/core'; 

export const playerCheckpoints = new hz.LocalEvent<Map<hz.Player, hz.SpawnPointGizmo>>('playerCheckpoints');
export const setPlayerCheckpoints = new hz.LocalEvent<Map<hz.Player, hz.SpawnPointGizmo>>('setPlayerCheckpoints');

class GameManager extends hz.Component<typeof GameManager> {
  static propsDefinition = { 
    checkpoint1: { type: hz.PropTypes.Entity },
    checkpoint2: { type: hz.PropTypes.Entity },
    checkpoint3: { type: hz.PropTypes.Entity },
    checkpoint4: { type: hz.PropTypes.Entity },
    checkpoint5: { type: hz.PropTypes.Entity },
  };

  private playerCheckpoints: Map<hz.Player, hz.SpawnPointGizmo> = new Map();

  start() {
    
    this.connectLocalBroadcastEvent(setPlayerCheckpoints, (data) => { 
      this.playerCheckpoints = data;
    }); 

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      this.setPlayerCheckpoint(player, this.props.checkpoint1?.as(hz.SpawnPointGizmo)!);
    }); 
  }

  setPlayerCheckpoint(player: hz.Player, checkpoint: hz.SpawnPointGizmo) {
    this.playerCheckpoints.set(player, checkpoint);
    this.sendLocalBroadcastEvent(playerCheckpoints, this.playerCheckpoints);
  }
  
}
hz.Component.register(GameManager); 