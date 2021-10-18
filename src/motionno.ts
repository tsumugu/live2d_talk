export let s_instance: MotionNo = null;
export class MotionNo {
  // モーション番号を保存しておくキュー
  private motionNumberQueue: any = [];
  private beforeMotionNo: number = 0;
  constructor() {
  }
  public static getInstance(): MotionNo {
    if (s_instance == null) {
      s_instance = new MotionNo();
    }
    return s_instance;
  }
  // モーション名が渡されるので、それをモーション番号に変更して、setMotionNo()で設定する
  public setMotion(name): void {
    // モーション番号は/Resources/kkk/kkk.model3.jsonで定義している。モーションファイルは/Resources/kkk/motions/に配置する。
    const motionObj = {
      "fun": 0,
      "angry": 1,
      "flattering": 2,
      "sad": 3,
      "listening": 4,
      "thinking": 5,
      "none": 6
    };
    let motionNo = motionObj[name];
    if (motionNo==undefined) {
      motionNo = 6;
    }
    this.setMotionNo(motionNo);
  }
  private setMotionNo(no): void {
    // まだキューになかったらpush (setMotionは重複して呼び出されることがあるのでその対策)
    if (this.beforeMotionNo!=no) {
      this.motionNumberQueue.push(no);
      this.beforeMotionNo = no;
    }
  }
  // この関数はlappmodel.tsの469行目から呼び出される
  public getMotionNo(): number {
    // shiftする
    return this.motionNumberQueue.shift();
  }
}