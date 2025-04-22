 
import { AudioGizmo, AvatarGripPoseAnimationNames, ButtonIcon, CodeBlockEvents, Color, EventSubscription, LayerType, Player, PlayerControls, PlayerDeviceType, PlayerInput, PlayerInputAction, PlayerVisibilityMode, ProjectileLauncherGizmo, PropTypes, RaycastGizmo, RaycastTargetType, TextGizmo, World } from "horizon/core";
import { Component } from "horizon/core";
 
class Gun extends Component<typeof Gun> {

  static propsDefinition = {
    projectileLauncher: {type: PropTypes.Entity},
    ammoPerclip: {type: PropTypes.Number, default: 20},
    clipAmmoDisplay: {type: PropTypes.Entity},
    totalAmmo: {type: PropTypes.Number, default: 100},
    totalAmmoDisplay: {type: PropTypes.Entity},
    laserGizmo: {type: PropTypes.Entity},
    laserPointer: {type: PropTypes.Entity},
    smokeFx: {type: PropTypes.Entity},
    gunFireSFX: {type: PropTypes.Entity},
    gunReloadSFX: {type: PropTypes.Entity},
    projectileLauncherCooldownMs: {type: PropTypes.Number, default: 100},
    projectileSpeed: {type: PropTypes.Number, default: 10},
    projectileGravity: {type: PropTypes.Number, default: 0},
    useLaserTargeting: {type: PropTypes.Boolean, default: true}, 
    laserToDisplay: {type: PropTypes.Entity},
  };

  private projLaunchGizmo!: ProjectileLauncherGizmo; 
  
  private connectedAimInput!: PlayerInput; 
  private connectedFireInput!: PlayerInput; 
  private connectedReloadInput!: PlayerInput;

  private lastShotTimestamp!: number;
  private aimingEventSub!: EventSubscription; 
  
  private grabbingEventSub!: EventSubscription;
  private droppingEventSub!: EventSubscription; 
  private ammoLeft!: number; 
  private totalAmmo!: number;  

  start() {
    const owner = this.entity.owner.get(); 

    if(owner === this.world.getServerPlayer()) {
      console.log("script owned by server, or in other words no user is using this gun");
    } else {
      // Subscrite to the who is holding this gun currently
      this.grabbingEventSub = this.connectCodeBlockEvent(
        this.entity,
        CodeBlockEvents.OnGrabStart, 
        this.onWeaponGrabbed.bind(this)
      );
    }
    this.droppingEventSub = this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnGrabEnd,
      this.onWeaponDropped.bind(this)
    );

  }

  private onWeaponGrabbed(isRightHand: boolean, player: Player) {
    console.log(this.entity.name.get() + " grabbed by ", player.name.get());

    // Update vars
    this.projLaunchGizmo = this.props.projectileLauncher!.as(ProjectileLauncherGizmo)!;
    this.projLaunchGizmo.projectileGravity.set(this.props.projectileGravity); 
    this.lastShotTimestamp = 0; 
    this.ammoLeft = this.props.ammoPerclip!;
    this.totalAmmo = this.props.totalAmmo!;
    this.updateAmmoDisplay();

    this.projLaunchGizmo.owner.set(player);

    // On Aim
    this.connectedAimInput = PlayerControls.connectLocalInput(
      PlayerInputAction.LeftTrigger, 
      ButtonIcon.Aim, 
      this,
    );
    this.connectedAimInput.registerCallback(this.onPlayerAiming.bind(this));

    // On Fire
    this.connectedFireInput = PlayerControls.connectLocalInput(
      PlayerInputAction.RightTrigger, 
      ButtonIcon.Aim, 
      this,
    );
    this.connectedFireInput.registerCallback(this.onPlayerFire.bind(this));
    
    // On Reload 
    this.connectedReloadInput = PlayerControls.connectLocalInput(
      PlayerInputAction.RightPrimary,
      ButtonIcon.Reload, 
      this,
    );
    this.connectedReloadInput.registerCallback(this.onPlayerReload.bind(this)); 
  }

  private onWeaponDropped(player: Player) {
    console.log(this.entity.name.get() + " dropped by ", player.name.get());
    this.projLaunchGizmo.owner.set(this.world.getServerPlayer());
    this.connectedAimInput.disconnect(); 
    this.connectedFireInput.disconnect();
    this.connectedReloadInput.disconnect();
    this.aimingEventSub.disconnect();
  }

  private onPlayerAiming(action: PlayerInputAction, pressed: boolean) {
    if(this.entity.owner.get().deviceType.get() !== PlayerDeviceType.VR) {
      return;
    }
    this.props.laserPointer?.visible.set(pressed); 
    if(!pressed) { 
      this.props.laserPointer?.setVisibilityForPlayers([], PlayerVisibilityMode.HiddenFrom);; 
    }
    if(pressed && this.props.useLaserTargeting) { 
      this.aimingEventSub = this.connectLocalBroadcastEvent(World.onUpdate, this.onUpdateAim.bind(this));
    } else this.aimingEventSub.disconnect(); 
  }

  private onPlayerFire(action: PlayerInputAction, pressed: boolean) {
    console.log("onPlayerFire", pressed);
    if(!pressed) {
      return;
    }
 
    if(this.ammoLeft > 0 && Date.now() > this.lastShotTimestamp + this.props.projectileLauncherCooldownMs) {   
      this.entity.owner.get().playAvatarGripPoseAnimationByName(AvatarGripPoseAnimationNames.Fire);
      this.lastShotTimestamp = Date.now();
      this.projLaunchGizmo.launch({
        speed: this.props.projectileSpeed,
      }); 
      this.ammoLeft--;
      this.updateAmmoDisplay();
      this.props.gunFireSFX?.as(AudioGizmo)?.play();
    } else {
      console.log("You are either out of ammo or the gun is on cooldown");
    }
  }

  private onPlayerReload(action: PlayerInputAction, pressed: boolean) {
    if(!pressed) {
      this.props.gunReloadSFX?.as(AudioGizmo)?.play();
      const ammoToReload = Math.min(this.props.totalAmmo - this.ammoLeft, this.props.ammoPerclip - this.ammoLeft); 
      this.ammoLeft += ammoToReload;
      this.totalAmmo -= ammoToReload;
      this.updateAmmoDisplay();
    }
  }

  private onUpdateAim(_date: {deltaTime: number}) {
    if(this.props.projectileLauncher && this.props.laserGizmo) {
      const raycastPos = this.props.laserGizmo.position.get(); 
      const raycastForw = this.props.laserGizmo.forward.get(); 
      const laserGizmo = this.props.laserGizmo.as(RaycastGizmo)!;
      const hit = laserGizmo.raycast(raycastPos, raycastForw, {
        layerType: LayerType.Both, 
        maxDistance: 100,
      });
      if(hit) {
        this.props.laserPointer?.setVisibilityForPlayers([this.entity.owner.get()], PlayerVisibilityMode.VisibleTo);
        this.props.laserPointer?.position.set(hit.hitPoint); 
        if(hit.targetType == RaycastTargetType.Entity) {
          this.props.laserPointer?.color.set(Color.red);
        }
        if(hit.targetType == RaycastTargetType.Entity) {
          this.props.laserPointer?.color.set(Color.green);
        }
      } else {
        this.props.laserPointer?.setVisibilityForPlayers(
          [this.entity.owner.get()],
          PlayerVisibilityMode.HiddenFrom,
        );
      }
    }
  }

  private updateAmmoDisplay() {
    this.props.clipAmmoDisplay?.as(TextGizmo)?.text.set(this.ammoLeft.toString());
    this.props.totalAmmoDisplay?.as(TextGizmo)?.text.set(this.totalAmmo.toString());
  }

}
Component.register(Gun);