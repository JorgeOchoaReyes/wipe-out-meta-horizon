import * as hz from 'horizon/core';
import { PropTypes, CodeBlockEvents, Player, Vec3 } from 'horizon/core';

class ScukerPunchTrigger extends hz.Component<typeof ScukerPunchTrigger> {
  static propsDefinition = {
    bounceForce: { type: PropTypes.Number, default: 10 },
    playerDetectionRadius: { type: PropTypes.Number, default: 1 },
    soundFx: { type: PropTypes.Entity},
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
    const distance = playerPosition.sub(platformPosition).magnitude(); 

    if (distance < this.playerDetectionRadius) {  
      if(this.props.soundFx) { 
        this.props.soundFx.as(hz.AudioGizmo).play({
          fade: 0,
          players: [player],
        })
      }
      
      const playerVelocity = player.velocity.get();
      const bounceDirection = new Vec3(0, 0, 3);  
      const bounceVelocity = bounceDirection.mul(this.props.bounceForce!);
      player.velocity.set(playerVelocity.add(bounceVelocity));
    }
  }
}
hz.Component.register(ScukerPunchTrigger);