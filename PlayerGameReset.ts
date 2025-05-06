import * as hz from 'horizon/core';
import { playerCheckpoints, setPlayerCheckpoints } from 'GameManager';  

class PlayerGameReset extends hz.Component<typeof PlayerGameReset> {
  static propsDefinition = {
    startOverSpawn: { type: hz.PropTypes.Entity },
    tpSfx: { type: hz.PropTypes.Entity },
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
    if (this.props.startOverSpawn) {
      const sound = this.props.tpSfx?.as(hz.AudioGizmo);
      if (sound) {
        sound.play({
          fade: 0,
          players: [player],
        });
      }
      const checkpoint = this.props.startOverSpawn?.as(hz.SpawnPointGizmo)!;
      this.playerCheckpoints.set(player.id, checkpoint);
      this.sendLocalBroadcastEvent(playerCheckpoints, this.playerCheckpoints); 
      this.props.startOverSpawn?.as(hz.SpawnPointGizmo).teleportPlayer(player);
    }
  }
}
hz.Component.register(PlayerGameReset);