import * as hz from 'horizon/core'; 

import { setPlayerCheckpoints, playerCheckpoints } from 'GameManager'; 

class CheckpointReached extends hz.Component<typeof CheckpointReached> {
  static propsDefinition = {
    soundFx: { type: hz.PropTypes.Entity, },
    checkpoint: { type: hz.PropTypes.Entity, },
    particleFx: { type: hz.PropTypes.Entity, },
  };

  private playerCheckpoints: Map<number, hz.SpawnPointGizmo> = new Map();

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.onPlayerEnter(player);
    });
    this.connectLocalBroadcastEvent(playerCheckpoints, (data) => { 
      this.playerCheckpoints = data;
    });
    this.connectLocalBroadcastEvent(setPlayerCheckpoints, (data) => { 
      this.playerCheckpoints = data;
    }); 
  }
  onPlayerEnter(player: hz.Player) { 
    if (this.props.checkpoint) {
      const sound = this.props.soundFx?.as(hz.AudioGizmo);
      if (sound && this.props.checkpoint?.as(hz.SpawnPointGizmo).id !== this.playerCheckpoints.get(player.id)?.id) {
        sound.play({
          fade: 0,
          players: [player],
        });
      }
      if(this.props.particleFx && this.props.checkpoint?.as(hz.SpawnPointGizmo).id !== this.playerCheckpoints.get(player.id)?.id) {
        const particle = this.props.particleFx?.as(hz.ParticleGizmo);
        if (particle) {
          particle.play({ 
            players: [player],
          });
        }
      }
      const checkpoint = this.props.checkpoint?.as(hz.SpawnPointGizmo)!;
      this.playerCheckpoints.set(player.id, checkpoint);
      this.sendLocalBroadcastEvent(playerCheckpoints, this.playerCheckpoints); 
     
    }
  }
}
hz.Component.register(CheckpointReached);