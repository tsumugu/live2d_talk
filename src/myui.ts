import { MotionNo } from './motionno';

export let s_instance: MyUI = null;
export class MyUI {
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

    // DEBUG: モーション設定テスト (Groupについてはlappmodel.tsの464行目で変更可)
    /*
    setTimeout(()=>{
      console.log("fire");
      MotionNo.getInstance().setMotionNo(1);
    }, 10000)
    */
  }
  // ロード中の表示を消す
  public hideLoadingDialog(): void {
    console.log("load finished");
    document.getElementById("loading").style.display = "none";
  }
}