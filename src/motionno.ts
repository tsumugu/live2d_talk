export let s_instance: MotionNo = null;
export class MotionNo {
  private motionNumber: number = 0;
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
  }
  public getMotionNo(): number {
    return this.motionNumber;
  }
}