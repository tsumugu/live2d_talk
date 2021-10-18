import clm from 'clmtrackr/build/clmtrackr';

export let s_instance: EyeTracking = null;
export class EyeTracking {
  private eyeX: number = 0.0;
  private eyeY: number = 0.0;
  private w: number = 0.0;
  private h: number = 0.0;
  private resetTimerId: any = null;
  
  public static getInstance(): EyeTracking {
    if (s_instance == null) {
      s_instance = new EyeTracking();
    }
    return s_instance;
  }

  public initialize(): void {
    // Property 'srcObject' does not exist on type 'HTMLElement'.などとエラーが出るのでHTMLElementをHTMLVideoElementにキャスト
    let video = document.getElementById("video") as HTMLVideoElement;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    video.setAttribute("width", this.w.toString());
    video.setAttribute("height", this.h.toString());
    video.setAttribute("autoplay", "true");
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: this.w,
        height: this.h
      }
    })
    .then((stream)=>{
      video.srcObject = stream;
      // すこし待つとうまくいく
      setTimeout(()=>{
        console.log("tracking start");
        this.initializeFaceDetector(video);
      }, 500);
    })
    .catch((err)=>{
      console.log(err.name+": "+err.message);
    });
  }

  private initializeFaceDetector(video): void {
    // 顔認識を開始する
    var ctracker = new clm.tracker();
    ctracker.init();
    ctracker.start(video);
    const drawLoop = ()=>{
      requestAnimationFrame(drawLoop);
      // 顔位置を取得
      let facePoint = ctracker.getCurrentPosition();
      if (facePoint==undefined) {
        return false;
      }
      // 瞳の位置を左右それぞれ取得
      let leftEyePos = facePoint[27];
      if (leftEyePos==undefined) {
        return false;
      }
      let rightEyePos = facePoint[32];
      if (rightEyePos==undefined) {
        return false;
      }
      if (this.resetTimerId!=null&&this.resetTimerId!=undefined) {
        clearTimeout(this.resetTimerId);
      }
      // 左右の中心、こめかみあたりを軽鎖
      let posCenterX = (leftEyePos[0]+rightEyePos[0])/2;
      let posCenterY = (leftEyePos[1]+rightEyePos[1])/2;
      // 眼球の位置を取得した座標に応じて設定
      this.eyeX = this.convertScreenPosToLive2DPram(this.w, posCenterX);
      this.eyeY = this.convertScreenPosToLive2DPram(this.h, posCenterY);
      // 一定時間顔が検出されなかったら眼球を初期位置に戻す。
      this.resetTimerId = setTimeout(()=>{
        this.eyeX = 0;
        this.eyeY = 0;
      }, 1000);
      // console.log(this.eyeX, this.eyeY);
    }
    drawLoop();
  }

  // -1~1の範囲に変換する関数
  private convertScreenPosToLive2DPram(wh, xy): number {
    // -1.0~1.0の21段階
    const num = 21;
    const step = wh/num*num;
    return ((xy/step)-0.5)*-2;
  }

  // lappmodel.tsの498, 499行目から呼び出される
  public getEyeX(): number {
    return this.eyeX;
  }
  public getEyeY(): number {
    return this.eyeY;
  }
}