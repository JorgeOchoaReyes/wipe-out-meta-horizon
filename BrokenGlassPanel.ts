import * as hz from 'horizon/core';  

const MyEvent = new hz.LocalEvent<{ name: string, broken: boolean, parentId: bigint }>('brokenglass');

class BrokenGlassPanel extends hz.Component<typeof BrokenGlassPanel> {
  static propsDefinition = {
    glassBreakSound: { type: hz.PropTypes.Entity, default: null },  
    neighborPanel: { type: hz.PropTypes.Entity, default: null },
    panel: { type: hz.PropTypes.Entity, default: null },
  };

  shouldIBreak!: boolean;
  glassBreakSound!: hz.Entity; 
  panel!: hz.Entity;
  neighborPanel!: hz.Entity;
  parentId!: bigint;

  start() { 
    this.glassBreakSound = this.props.glassBreakSound!; 
    this.panel = this.props.panel!;
    this.neighborPanel = this.props.neighborPanel!; 

    this.shouldIBreak = Math.random() > 0.5;   
    this.panel.collidable.set(this.shouldIBreak);
    // this.panel.visible.set(this.shouldIBreak); // DEV ONLY

    this.parentId = this.entity.parent.get()?.parent.get()?.parent?.get()?.id ?? (1 as unknown as bigint);
 
    this.sendLocalBroadcastEvent(MyEvent, { 
      name: this.panel.name.get(), 
      broken: this.shouldIBreak, 
      parentId: this.parentId
    }); 
 
    this.connectLocalBroadcastEvent(MyEvent, (data) => {
      if(data.name !== this.panel.name.get() && data.parentId === this.parentId) {
        this.shouldIBreak = !data.broken;
        this.panel.collidable.set(!data.broken);
        // this.panel.visible.set(!data.broken); // DEV ONLY
      }  
    }); 

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (_p) => { 
      this.onPlayerLanded(this.shouldIBreak);
    });
  } 

  onPlayerLanded(broken: boolean) {  
    if(!broken) { 
      const glassSound = this.glassBreakSound!.as(hz.AudioGizmo)!;
      this.panel.visible.set(false);
      glassSound.play({
        fade: 1
      });
    } 
  }
 
}
hz.Component.register(BrokenGlassPanel);

