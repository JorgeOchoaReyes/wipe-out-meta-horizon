import * as hz from 'horizon/core';
import { Entity } from 'horizon/core';

class GameManager extends hz.Component<typeof GameManager> {
  static propsDefinition = {
    backgroundMusic: { type: hz.PropTypes.Entity },
    checkpoint: { type: hz.PropTypes.Entity },
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      const backgroundMusicGizmo = this.props.backgroundMusic!.as(hz.AudioGizmo)!;
      backgroundMusicGizmo.play({ fade: 0, players: [player] });
      backgroundMusicGizmo.volume.set(0.5); // Optional: Set the volume to 50%
      // how to loop? 
    });
  }
}
hz.Component.register(GameManager); 