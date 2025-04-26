import * as hz from 'horizon/core'; 
import { PropTypes, Quaternion, Vec3, World } from 'horizon/core';

class PlatformSpin extends hz.Component<typeof PlatformSpin> {
  static propsDefinition = {
    spinSpeed: { type: PropTypes.Number, default: 5 },
    direction: { type: PropTypes.String, default: 'left' },
};

private rotation!: Quaternion;
private spinSpeed!: number;

  start() {
      this.spinSpeed = this.props.spinSpeed!;
      this.rotation = this.entity.rotation.get();
      this.connectLocalBroadcastEvent(World.onUpdate, (data) => this.update(data.deltaTime));
  }
  
  update(deltaTime: number) {
      const direction = this.props.direction!;
      if (direction === 'right') {
          this.spinSpeed = -Math.abs(this.spinSpeed);
      } else if (direction === 'left') {
          this.spinSpeed = Math.abs(this.spinSpeed);
      } else { 
          this.spinSpeed = Math.abs(this.spinSpeed);
      }
      const rotationAmount = this.spinSpeed * deltaTime;
      const rotationAxis = new Vec3(0, 1, 0);  
      const newRotation = Quaternion.fromAxisAngle(rotationAxis, rotationAmount);
      this.rotation = Quaternion.mul(this.rotation, newRotation);
      this.entity.rotation.set(this.rotation);
  }
}
hz.Component.register(PlatformSpin);