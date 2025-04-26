import * as hz from 'horizon/core';

class ResetTrigger extends hz.Component<typeof ResetTrigger> {
  static propsDefinition = {
    spawnPoint: { type: hz.PropTypes.Entity },
  };

  start() {

    

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.onPlayerEnter(player);
    });
  }
  onPlayerEnter(player: hz.Player) {
    console.log("Player entered reset trigger");
    const spawnPoint = this.props.spawnPoint?.as(hz.SpawnPointGizmo); 
    if (spawnPoint) {
      spawnPoint.teleportPlayer(player)
    }
  }

}
hz.Component.register(ResetTrigger);