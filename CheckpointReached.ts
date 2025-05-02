import * as hz from 'horizon/core'; 

import { setPlayerCheckpoints, playerCheckpoints } from 'GameManager'; 

class CheckpointReached extends hz.Component<typeof CheckpointReached> {
  static propsDefinition = {
    soundFx: { type: hz.PropTypes.Entity, },
    checkpoint: { type: hz.PropTypes.Entity, },
  };

  private playerCheckpoints: Map<number, hz.SpawnPointGizmo> = new Map();

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.onPlayerEnter(player);
    });
 
    this.connectLocalBroadcastEvent(setPlayerCheckpoints, (data) => {
      this.playerCheckpoints = data;
    });
  }
  onPlayerEnter(player: hz.Player) { 
    if (this.props.checkpoint) {
      const checkpoint = this.props.checkpoint?.as(hz.SpawnPointGizmo)!;
      this.playerCheckpoints.set(player.id, checkpoint);
      this.sendLocalBroadcastEvent(playerCheckpoints, this.playerCheckpoints); 
    }
  }
}
hz.Component.register(CheckpointReached);