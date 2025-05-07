import * as hz from 'horizon/core';
import { PropTypes, Entity, Player, CodeBlockEvents, Vec3 } from 'horizon/core';

class BouncePadScript extends hz.Component<typeof BouncePadScript> {
  static propsDefinition = {
    bounceForce: { type: PropTypes.Number, default: 10 },
    playerDetectionRadius: { type: PropTypes.Number, default: 1 },
    soundFx: { type: PropTypes.Entity},
    particleFx: { type: PropTypes.Entity },
  };
   
  private playerDetectionRadius!: number; 

  start() { 
    this.playerDetectionRadius = this.props.playerDetectionRadius!; 

    
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
      this.onPlayerLanded(player);
    }); 
  }

  onPlayerLanded(player: Player) {  
    const playerPosition = player.position.get();
    const platformPosition = this.entity.position.get(); 
 
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
    const bounceDirection = new Vec3(0, 1, 0);  
    const bounceVelocity = bounceDirection.mul(this.props.bounceForce!);
    player.velocity.set(playerVelocity.add(bounceVelocity)); 
  }
}
hz.Component.register(BouncePadScript);
 
 