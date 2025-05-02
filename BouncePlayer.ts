import * as hz from 'horizon/core';
import {
  PropTypes,
  CodeBlockEvents,
  Player,
  Vec3,
  AudioGizmo
} from 'horizon/core';

class BouncePlayer extends hz.Component<typeof BouncePlayer> {
  static propsDefinition = {
    bounceForce: { type: PropTypes.Number, default: 20 },
    soundFx:   { type: PropTypes.Entity }
  };

  private bounceForce!: number;

  start() {
    // cache the force
    this.bounceForce = this.props.bounceForce!;

    // when a player enters the Trigger, call bounce()
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterTrigger,
      (player: Player) => this.bounce(player)
    );
  }

  private bounce(player: Player) {
    // positions
    const ballPos   = this.entity.position.get();
    const playerPos = player.position.get();

    // direction from ball to player
    const dir = playerPos.sub(ballPos).normalize();

    // build impulse (outward * force, plus a little up)
    const impulse = dir.mul(this.bounceForce).add(new Vec3(0, 10, 0));

    // apply it
    player.applyForce(impulse);

    // optional sound
    if (this.props.soundFx) {
      this.props.soundFx.as(AudioGizmo).play({
        players: [player],
        fade:    0
      });
    }
  }
}

hz.Component.register(BouncePlayer);
