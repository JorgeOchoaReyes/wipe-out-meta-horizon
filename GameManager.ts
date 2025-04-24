import * as hz from 'horizon/core'; 

class GameManager extends hz.Component<typeof GameManager> {
  static propsDefinition = {
    backgroundMusic: { type: hz.PropTypes.Entity },
    checkpoint: { type: hz.PropTypes.Entity },
  };

  start() {
 
  }
}
hz.Component.register(GameManager); 