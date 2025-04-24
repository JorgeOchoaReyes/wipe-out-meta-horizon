import * as hz from 'horizon/core';
import { PropTypes, Entity, Player, CodeBlockEvents, Vec3 } from 'horizon/core';

class BouncePadScript extends hz.Component<typeof BouncePadScript> {
  static propsDefinition = {
    bounceForce: { type: PropTypes.Number, default: 10 },
    playerDetectionRadius: { type: PropTypes.Number, default: 1 }
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
    const playerPosition = player.position.get();
    const platformPosition = this.entity.position.get();
    const distance = playerPosition.sub(platformPosition).magnitude();

    if (distance < this.playerDetectionRadius) {
      const bounceDirection = new Vec3(0, 1, 0);  
      const bounceVelocity = bounceDirection.mul(this.bounceForce);
      player.velocity.set(bounceVelocity);
    }
  }
 

}
hz.Component.register(BouncePadScript);
 