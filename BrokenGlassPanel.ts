import * as hz from 'horizon/core';  

const MyEvent = new hz.LocalEvent<{ name: string, broken: boolean, parentId: bigint }>('brokenglass');

class BrokenGlassPanel extends hz.Component<typeof BrokenGlassPanel> {
  static propsDefinition = {
    glassBreakSound: { type: hz.PropTypes.Entity, default: null },
    glassBreakEffect: { type: hz.PropTypes.String, default: 'glass_break_effect' },
    glassBreakForce: { type: hz.PropTypes.Number, default: 10 },
    neighborPanel: { type: hz.PropTypes.Entity, default: null },
    panel: { type: hz.PropTypes.Entity, default: null },
  };

  shouldIBreak!: boolean;
  glassBreakSound!: hz.Entity;
  glassBreakEffect!: string;
  panel!: hz.Entity;
  neighborPanel!: hz.Entity;
  parentId!: bigint;

  start() { 
    this.glassBreakSound = this.props.glassBreakSound!;
    this.glassBreakEffect = this.props.glassBreakEffect!;
    this.panel = this.props.panel!;
    this.neighborPanel = this.props.neighborPanel!; 
    this.shouldIBreak = Math.random() < 0.5;   
    this.panel.collidable.set(this.shouldIBreak);
    this.panel.visible.set(this.shouldIBreak); 

    this.parentId = this.entity.parent.get()?.parent.get()?.parent?.get()?.id ?? (1 as unknown as bigint);
    
    this.sendLocalBroadcastEvent(MyEvent, { 
      name: this.panel.name.get(), 
      broken: this.shouldIBreak, 
      parentId: this.parentId
    });

    this.connectLocalBroadcastEvent(MyEvent, (data) => {
      if(data.name !== this.panel.name.get() && data.parentId === this.parentId) {
        console.log(`${this.panel.name.get()} ${this.parentId} ---> ${data.name}, ${data.broken} ${data.parentId}`); 
        this.shouldIBreak = !data.broken;
        this.panel.collidable.set(!data.broken);
        this.panel.visible.set(!data.broken); 
      }  
    });

    if(this.shouldIBreak) {
      this.neighborPanel.collidable.set(true);  
    } else {
      this.neighborPanel.collidable.set(false); 
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => { 
      this.onPlayerLanded(player);
    });
  } 

  onPlayerLanded(player: hz.Player) { 
    if(this.shouldIBreak) {
      // this.entity.visible.set(false);  
      // const glassSound = this.glassBreakSound!.as(hz.AudioGizmo)!;
      // glassSound.play();
    } 
  }
 
}
hz.Component.register(BrokenGlassPanel);

