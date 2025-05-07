import * as hz from 'horizon/core';  

const MyEvent = new hz.LocalEvent<{ name: string, broken: boolean, parentId: bigint }>('brokenglass');

class BrokenGlassPanel extends hz.Component<typeof BrokenGlassPanel> {
  static propsDefinition = {
    glassBreakSound: { type: hz.PropTypes.Entity, default: null },  
    neighborPanel: { type: hz.PropTypes.Entity, default: null },
    panel: { type: hz.PropTypes.Entity, default: null },
    particleFx: { type: hz.PropTypes.Entity, default: null },
  };

  shouldIBreak!: boolean;
  glassBreakSound!: hz.Entity; 
  panel!: hz.Entity;
  neighborPanel!: hz.Entity;
  parentId!: bigint;
  timeoutToReset: number = 120;
  particleFx!: hz.Entity;

  start() { 
    this.glassBreakSound = this.props.glassBreakSound!; 
    this.panel = this.props.panel!;
    this.neighborPanel = this.props.neighborPanel!; 
    this.particleFx = this.props.particleFx!;

    this.shouldIBreak = Math.random() > 0.5;   
    this.panel.collidable.set(this.shouldIBreak); 

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
      }  
    }); 

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (_p) => { 
      this.onPlayerLanded(this.shouldIBreak, _p);
    });

    this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
      if (this.timeoutToReset > 0) {
        this.timeoutToReset -= data.deltaTime;
      } else {
        this.timeoutToReset = 120;
        this.panel.visible.set(true);
        this.glassBreakSound.as(hz.AudioGizmo)?.stop();
      }
    });
  } 

  onPlayerLanded(broken: boolean, player: hz.Player) {  
    if(!broken && this.panel.visible.get()) {   
      const glassSound = this.glassBreakSound!.as(hz.AudioGizmo)!;
      const particle = this.particleFx!.as(hz.ParticleGizmo);
      if (particle) {
        particle.play({
          players: [player],
        });
      }
      this.panel.visible.set(false);
      glassSound.play({
        fade: 1,
        players: [player],
      });
    } 
  }
 
}
hz.Component.register(BrokenGlassPanel);

