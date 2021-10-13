export let s_instance: MotionNo = null;
export class MotionNo {
  private motionNumber: number = 0;
  private timestamp: number = 0;
  constructor() {
  }
  public static getInstance(): MotionNo {
    if (s_instance == null) {
      s_instance = new MotionNo();
    }
    return s_instance;
  }
  public setMotionNo(no): void {
    this.motionNumber = no;
    this.setTimestamp();
  }
  private setTimestamp(): void {
    this.timestamp = Date.now();
  }
  public getMotionNo(): number {
    return this.motionNumber;
  }
  public getMotionSetedTimestamp(): number {
    return this.timestamp;
  }
}