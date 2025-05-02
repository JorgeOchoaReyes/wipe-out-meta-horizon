import * as hz from 'horizon/core';
import { PropTypes } from 'horizon/core';
import { Quaternion, Vec3, World } from 'horizon/core';

class BallSwing extends hz.Component<typeof BallSwing> {
  static propsDefinition = {
    minAngle: { type: PropTypes.Number, default: -45 },
    maxAngle: { type: PropTypes.Number, default: 45 },
    swingSpeed: { type: PropTypes.Number, default: 1 },
    initialAngle: { type: PropTypes.Number, default: 0 },
  };

  private angle!: number;
  private direction!: number;

  start() {
    this.angle = this.props.initialAngle!;
    this.direction = 1;
    this.updateRotation();

    this.connectLocalBroadcastEvent(World.onUpdate, (data: { deltaTime: number }) => {
      this.update(data.deltaTime);
    });
  }

  update(deltaTime: number) {
    this.angle += this.props.swingSpeed! * this.direction * deltaTime;

    if (this.angle > this.props.maxAngle!) {
      this.angle = this.props.maxAngle!;
      this.direction = -1;
    } else if (this.angle < this.props.minAngle!) {
      this.angle = this.props.minAngle!;
      this.direction = 1;
    }

    this.updateRotation();
  }

  updateRotation() {
    const rotation = Quaternion.fromEuler(new Vec3(0, this.angle, 0));
    this.entity.rotation.set(rotation);
  }
}

hz.Component.register(BallSwing);
 