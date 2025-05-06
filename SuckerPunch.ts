import * as hz from 'horizon/core';

class SuckerPunch extends hz.Component<typeof SuckerPunch> {
  static propsDefinition = {
    speed: { type: hz.PropTypes.Number, default: 1 },
    amplitude: { type: hz.PropTypes.Number, default: 1 },
  };

  private originalPos!: hz.Vec3;
  private targetPos!: hz.Vec3;
  private direction: number = 1;
  private randomDelay: number = Math.random() * 1 + 1;  

  start() {
    this.originalPos = this.entity.position.get();
    this.targetPos = this.originalPos.add(new hz.Vec3(0, 0, -this.props.amplitude!));
    this.connectLocalBroadcastEvent(hz.World.onUpdate, this.onUpdate.bind(this));
  }

  onUpdate({ deltaTime }: { deltaTime: number }) {
    if (this.randomDelay > 0) {
      this.randomDelay -= deltaTime;
      return; 
    }
    if (this.randomDelay <= 0) {
      this.randomDelay = 0; 
    }
    const currentPos = this.entity.position.get();
    const newPos = currentPos.add(new hz.Vec3(0, 0, this.props.speed! * this.direction * deltaTime));
   

    if (this.direction > 0 && newPos.z >= this.targetPos.z) { 
      this.direction = -1;
      this.targetPos = this.originalPos;
    } else if (this.direction < 0 && newPos.z <= this.targetPos.z) { 
      this.direction = 1;
      this.targetPos = this.originalPos.add(new hz.Vec3(0, 0, -this.props.amplitude!));
    }

    this.entity.position.set(newPos);
  }
}
hz.Component.register(SuckerPunch);
 
