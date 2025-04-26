import * as hz from 'horizon/core';

class BallSwing extends hz.Component<typeof BallSwing> {
  static propsDefinition = {
    chainLength: { type: hz.PropTypes.Number, default: 5 },
    ballMass: { type: hz.PropTypes.Number, default: 10 },
  };

  private ballEntity!: hz.PhysicalEntity;
  private chainEntity!: hz.Entity;

  start() {
    this.ballEntity = this.entity.children.get()[0].as(hz.PhysicalEntity);
    this.chainEntity = this.entity.children.get()[1];

    this.ballEntity.gravityEnabled.set(true);
    // Removed setting mass as it's not a valid property

    this.chainEntity.as(hz.PhysicalEntity).gravityEnabled.set(true);
    this.chainEntity.as(hz.PhysicalEntity).locked.set(false);

    this.connectLocalBroadcastEvent(hz.World.onUpdate, this.onUpdate.bind(this));
  }

  onUpdate(data: { deltaTime: number }) {
    const ballPosition = this.ballEntity.position.get();
    const chainPosition = this.chainEntity.position.get();
    const distance = ballPosition.distance(chainPosition);

    if (distance > this.props.chainLength!) {
      const direction = chainPosition.sub(ballPosition).normalize();
      const force = direction.mul(this.props.chainLength! - distance);
      this.ballEntity.applyForce(force, hz.PhysicsForceMode.Force);
    }
  }
}
hz.Component.register(BallSwing);
 