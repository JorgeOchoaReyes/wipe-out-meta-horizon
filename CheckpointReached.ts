import * as hz from 'horizon/core';

class CheckpointReached extends hz.Component<typeof CheckpointReached> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.onPlayerEnter(player);
    });
  }
  onPlayerEnter(player: hz.Player) {
    console.log("Player entered checkpoint trigger"); 
  }
}
hz.Component.register(CheckpointReached);