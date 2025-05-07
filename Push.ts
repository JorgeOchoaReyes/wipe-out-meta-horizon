import * as hz from 'horizon/core';
import { PropTypes, CodeBlockEvents, Player } from 'horizon/core';

class HorizaontalPush extends hz.Component<typeof HorizaontalPush> {
  static propsDefinition = {
    bounceForce: { type: PropTypes.Number, default: 10 }, 
    soundFx: { type: PropTypes.Entity},
    particleFx: { type: PropTypes.Entity },
  };
  
  private bounceForce!: number;  

  start() {
    this.bounceForce = this.props.bounceForce!;  
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
      this.onPlayerLanded(player);
    }); 
  }

  onPlayerLanded(player: Player) {  
    const playerPosition = player.position.get();
    const platformPosition = this.entity.position.get(); 
    const direction = playerPosition.sub(platformPosition).normalize();
    const force = direction.mul(this.bounceForce)
 
    if(this.props.soundFx) { 
      this.props.soundFx.as(hz.AudioGizmo).play({
        fade: 0,
        players: [player],
      })
    } 
    if(this.props.particleFx) { 
      const particle = this.props.particleFx?. as(hz.ParticleGizmo);
      if (particle) {
        particle.play({ 
          players: [player],
        });
      }
    }
    
    player.applyForce(force);
  }
}
hz.Component.register(HorizaontalPush);