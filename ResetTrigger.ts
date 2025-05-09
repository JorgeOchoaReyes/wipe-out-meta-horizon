import * as hz from 'horizon/core';
import { playerCheckpoints, setPlayerCheckpoints } from 'GameManager';  

class ResetTrigger extends hz.Component<typeof ResetTrigger> {
  static propsDefinition = {
    spawnPoint: { type: hz.PropTypes.Entity },
    deathSfx: { type: hz.PropTypes.Entity },
    waterParticleFx: { type: hz.PropTypes.Entity },
    splashSfx: { type: hz.PropTypes.Entity },
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
    const spawnPoint = this.playerCheckpoints.get(player.id);
    if (!spawnPoint) {
      console.log("No spawn point found for player", player);
      return;
    }  
    try {
      const sound = this.props.deathSfx?.as(hz.AudioGizmo);
      const particle = this.props.waterParticleFx?.as(hz.ParticleGizmo);
      const splash = this.props.splashSfx?.as(hz.AudioGizmo);
      if (splash) {
        splash.play({
          fade: 0,
          players: [player],
        });
      }
      if (particle) {
        particle.position.set(player.position.get());
        particle.play({
          players: [player],
        });
      }
      if (sound) {
        sound.play({
          fade: 0,
          players: [player],
        });
      }
      spawnPoint.teleportPlayer(player);
    } catch (error) {
      console.error("Error teleporting player:", error);
    }
    
  }

}
hz.Component.register(ResetTrigger);