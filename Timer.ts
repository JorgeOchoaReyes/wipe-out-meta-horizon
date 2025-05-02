import * as hz from 'horizon/core';

class Timer extends hz.Component<typeof Timer> {
  static propsDefinition = {
    startTrigger: { type: hz.PropTypes.Entity },
    endTrigger: { type: hz.PropTypes.Entity },
    timerText: { type: hz.PropTypes.Entity },
  };

  private startTime!: number;
  private isTimerRunning = false;
  private updateLoop!: hz.EventSubscription;

  start() {
    this.connectCodeBlockEvent(this.props.startTrigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => this.StartTimer());
    this.connectCodeBlockEvent(this.props.endTrigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => this.StopTimer());
  }

  StartTimer() {
    if (!this.isTimerRunning) {
      this.startTime = Date.now();
      this.isTimerRunning = true;
      this.updateLoop = this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => this.UpdateTimer(data.deltaTime));
    }
  }

  StopTimer() {
    if (this.isTimerRunning) {
      this.isTimerRunning = false;
      this.updateLoop.disconnect();
      const endTime = Date.now();
      const elapsedTime = (endTime - this.startTime) / 1000;
      console.log(`Timer stopped. Elapsed time: ${elapsedTime} seconds`);
      this.props.timerText!.as(hz.TextGizmo)!.text.set(`Time: ${elapsedTime.toFixed(2)} seconds`);
    }
  }

  UpdateTimer(deltaTime: number) {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime) / 1000;
    this.props.timerText!.as(hz.TextGizmo)!.text.set(`Time: ${elapsedTime.toFixed(2)} seconds`);
  }
}

hz.Component.register(Timer);