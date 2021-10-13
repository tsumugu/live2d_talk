import { SpeechRecognitionClass } from './speechrecognition';

export let s_instance: MyUI = null;
export class MyUI {
  public isMuting: Boolean = true;
  constructor() {
  }
  public static getInstance(): MyUI {
    if (s_instance == null) {
      s_instance = new MyUI();
    }
    return s_instance;
  }
  public initialize(): void {
    // 画面にマウスオーバーされたときだけUIを表示するための処理
    const bodyElm = document.body;
    const uiElm = document.getElementById("ui");
    let timerId = null;
    let showUI = ()=>{
      uiElm.classList.remove('fadeout');
      uiElm.classList.add('fadein');
    };
    let hideUI = ()=>{
      uiElm.classList.remove('fadein');
      uiElm.classList.add('fadeout');
    };
    bodyElm.addEventListener('mouseover', () => {
      if (document.fullscreenElement==null) {
        showUI();
      } else {
        if (timerId!=null) {
          clearTimeout(timerId);
        }
        hideUI();
      }
    });
    bodyElm.addEventListener('mousemove', () => {
      if (document.fullscreenElement==null) {
        showUI();
      } else {
        showUI();
        if (timerId!=null) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(()=>{
          hideUI();
        }, 1000);
      }
    });
    bodyElm.addEventListener('mouseleave', () => {
      if (timerId!=null) {
        clearTimeout(timerId);
      }
      hideUI();
    });

    // フルスクリーンボタンが押されたときの処理
    const FullScreenButtonElm = document.getElementById("fullscreen-button");
    FullScreenButtonElm.addEventListener("click", ()=>{
      if (document.fullscreenElement!=null) {
        document.exitFullscreen();
        // アイコンを書き換える
        let beforeSpan = FullScreenButtonElm.getElementsByTagName("span")[0];
        let iconSpan = document.createElement("span");
        iconSpan.classList.add("material-icons", "icon-fullscreen");
        iconSpan.innerHTML = "fullscreen";
        FullScreenButtonElm.replaceChild(iconSpan, beforeSpan);
      } else {
        bodyElm.requestFullscreen();
        // アイコンを書き換える
        let beforeSpan = FullScreenButtonElm.getElementsByTagName("span")[0];
        let iconSpan = document.createElement("span");
        iconSpan.classList.add("material-icons", "icon-fullscreen");
        iconSpan.innerHTML = "fullscreen_exit";
        FullScreenButtonElm.replaceChild(iconSpan, beforeSpan);
      }
    });

    // ミュート切り替えボタンが押されたときの処理
    const MuteButtonElm = document.getElementById("mute-button");
    MuteButtonElm.addEventListener("click", ()=>{
      if (this.isMuting) {
        let beforeSpan = MuteButtonElm.getElementsByTagName("span")[0];
        let iconSpan = document.createElement("span");
        iconSpan.classList.add("material-icons", "icon-volume");
        iconSpan.innerHTML = "volume_up";
        MuteButtonElm.replaceChild(iconSpan, beforeSpan);
        this.isMuting = false;
      } else {
        let beforeSpan = MuteButtonElm.getElementsByTagName("span")[0];
        let iconSpan = document.createElement("span");
        iconSpan.classList.add("material-icons", "icon-volume");
        iconSpan.innerHTML = "volume_off";
        MuteButtonElm.replaceChild(iconSpan, beforeSpan);
        this.isMuting = true;
      }
    });
  }
  public getIsMuting() {
    return this.isMuting;
  }
  // ロード中の表示を消す
  public hideLoadingDialog(): void {
    console.log("load finished");
    document.getElementById("loading").style.display = "none";
    // 音声認識を初期化・開始する
    SpeechRecognitionClass.getInstance().initialize();
  }
}