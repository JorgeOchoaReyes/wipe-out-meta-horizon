import * as hz from 'horizon/core';
import { PropTypes, CodeBlockEvents, Player, Vec3 } from 'horizon/core';

class ScukerPunchTrigger extends hz.Component<typeof ScukerPunchTrigger> {
  static propsDefinition = {
    bounceForce: { type: PropTypes.Number, default: 10 },
    playerDetectionRadius: { type: PropTypes.Number, default: 1 },
    soundFx: { type: PropTypes.Entity},
    particleFx: { type: PropTypes.Entity },
  }; 
  start() {   
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
      this.onPlayerLanded(player);
    }); 
  }

  onPlayerLanded(player: Player) {   
  
    if(this.props.soundFx) { 
      this.props.soundFx.as(hz.AudioGizmo).play({
        fade: 0,
        players: [player],
      })
    }
    if(this.props.particleFx) { 
      const particle = this.props.particleFx?.as(hz.ParticleGizmo);
      if (particle) {
        particle.play({ 
          players: [player],
        });
      }
    }
    
    const playerVelocity = player.velocity.get();
    const bounceDirection = new Vec3(0, 0, 3);  
    const bounceVelocity = bounceDirection.mul(this.props.bounceForce!);
    player.velocity.set(playerVelocity.add(bounceVelocity)); 
  }
}
hz.Component.register(ScukerPunchTrigger);