import * as hz from 'horizon/core';
import { PropTypes, Entity, Player, CodeBlockEvents, Vec3 } from 'horizon/core';

class BouncePadScript extends hz.Component<typeof BouncePadScript> {
  static propsDefinition = {
    bounceForce: { type: PropTypes.Number, default: 10 },
    playerDetectionRadius: { type: PropTypes.Number, default: 1 },
    soundFx: { type: PropTypes.Entity},
  };
  
  private bounceForce!: number;
  private playerDetectionRadius!: number; 

  start() {
    this.bounceForce = this.props.bounceForce!;
    this.playerDetectionRadius = this.props.playerDetectionRadius!; 
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
      this.onPlayerLanded(player);
    }); 
  }

  onPlayerLanded(player: Player) { 
    console.log("Player landed on bounce pad");
    const playerPosition = player.position.get();
    const platformPosition = this.entity.position.get();
    const distance = playerPosition.sub(platformPosition).magnitude();
    const direction = playerPosition.sub(platformPosition).normalize();
    const force = direction.mul(this.bounceForce)

    if (distance < this.playerDetectionRadius) {   
      player.applyForce(force);
      if(this.props.soundFx) { 
        this.props.soundFx.as(hz.AudioGizmo).play({
          fade: 0,
          players: [player],
        })
      }
    }
  }
}
hz.Component.register(BouncePadScript);
 