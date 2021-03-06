// 形態素解析ライブラリをimport
//import {tokenize} from "kuromojin";
import {MyUI} from "./myui";
import {ReplyDict} from "./replydict";
import { MotionNo } from './motionno';
import { LAppModel } from './lappmodel';

export let s_instance: SpeechRecognitionClass = null;
export class SpeechRecognitionClass {
  private worker: Worker;
  constructor() {
  }
  public static getInstance(): SpeechRecognitionClass {
    if (s_instance == null) {
      s_instance = new SpeechRecognitionClass();
    }
    return s_instance;
  }
  public initialize(): void {
    // workerを作成 (Web Workersを使えばLive2Dのカクつきを防げるかと思ったけど、そんなことなかった...。)
    // workerとworker_oldがあって、workerのほうが高速
    this.worker = new Worker('./src/worker.js');
    const _this = this;
    this.worker.addEventListener('message', function(e) {
      let replyObj = e.data;
      console.log(replyObj);
      if (replyObj!=undefined) {
        if (replyObj.reply!=undefined) {
          _this.speak(replyObj.reply, replyObj.emotion_name);
        } else {
          //_this.speak("理解できませんでした", "sad");
          _this.replyfromapi(replyObj);
        }
      } else {
        //_this.speak("理解できませんでした", "sad");
        _this.replyfromapi(replyObj);
      }
    }, false);
    // 音声認識について設定
    let speechRecognitionFunc = ()=>{
      // TypeScriptではSpeechRecognitionについて型定義しないといけないらしい。 (参考: https://github.com/eguchi-asial/auto-text-recorder/blob/master/src/views/Home.vue)
      const { webkitSpeechRecognition, SpeechRecognition } = window as any;
      const speechRecognition = webkitSpeechRecognition || SpeechRecognition;
      const recognition = new speechRecognition();
      recognition.lang = "ja-JP";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onerror = (e)=>{
        speechRecognitionFunc();
      };
      recognition.onsoundend = (e)=>{
        speechRecognitionFunc();
      };
      recognition.onresult = (e)=>{
        this.showListeningCaption();
        let results = e.results[0];
        if (results.isFinal) {
          let resultTxt = results[0].transcript;
          // 返答
          this.reply(resultTxt);
          //
          speechRecognitionFunc();
        }
      };
      recognition.start();
    };
    // 音声認識を開始
    speechRecognitionFunc();
  }
  private reply(text): void {
    this.showLoadingCaption();
    const tokens = MyUI.getInstance().getKuromojiTokenizer().tokenize(text);
    let replyDictionary = ReplyDict.getInstance().getDictionary();
    let replySearchObj = ReplyDict.getInstance().getSearchObj();
    this.worker.postMessage({dic: replyDictionary, search: replySearchObj, text: text, tokens: tokens});
  }
  private replyfromapi(text): void {
    console.log(text);
    // 返答候補がなかったときに「理解できません」とか言うのは味気ないので、Chaplus API(雑談API)に投げてなにかしら返答する。
    const obj = {
      agentState: {
        "agentName": "凛",
        "age":"0",
        "tone":"normal"
      },
      utterance: text
    };
    const method = "POST";
    const body = JSON.stringify(obj);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    fetch("https://tsumugu2626.xyz/chaplus.php?apikey=615ef2feaa3b3", {method, headers, body}).then(res=>{
      res.text().then((resStr)=>{
        this.speak(resStr, "fun");
      });
    }).catch(error=>console.error(error));
  }
  private showListeningCaption(): void {
    MotionNo.getInstance().setMotion("listening");
    const captionElm = document.getElementById("caption");
    captionElm.innerHTML = "listening...";
  }
  private showLoadingCaption(): void {
    //MotionNo.getInstance().setMotion("thinking");
    const captionElm = document.getElementById("caption");
    captionElm.innerHTML = "loading...";
  }
  private speak(text, motionName): void {
    if (MyUI.getInstance().getIsMuting()) {
      // モーション設定 (Groupについてはlappmodel.tsの464行目で変更可)
      MotionNo.getInstance().setMotion(motionName);
      // 字幕の書き換え
      this.changeCaption(text);
    } else {
      // 音声合成 (音声の合成に1文字あたり5pt(=5円)かかるのでなるべく呼び出さない方向で...。初回クレジットが5万ptあるのでしばらくはなんとかなるはず。)
      // 直接CoeFont APIにアクセスしたいが、CORSでエラーになってしまうので仕方なくプロキシ
      fetch('https://tsumugu2626.xyz/coefont.php?text='+encodeURI(text)).then(response => response.json()).then(data=>{
        const WAVfileUrl = data.fileurl;
        if (WAVfileUrl!=undefined&&WAVfileUrl!=null) {
          // 字幕の書き換え
          this.changeCaption(text);
          //
          const asyncFileLoad = async () => {
            return fetch(WAVfileUrl).then(responce => {
              return responce.arrayBuffer();
            });
          };
          const asyncWavFileManager = (async () => {
            let buffer = await asyncFileLoad();
            // リップシンクのために音声ファイルのパスを指定
            LAppModel.getInstance().setWAVArrayBuffer(buffer);
            // 再生する   
            this.AudioBufferPlayer(buffer, ()=>{
              // 再生終了後にモーションを再生する (同時だと口が動かない)
              MotionNo.getInstance().setMotion(motionName);
            });        
            //
          })();
          //let audioElem = new Audio();
          //audioElem.src = WAVfileUrl;
          //audioElem.play();
        } else {
          console.log("音声の生成に失敗しました", data);
          // モーション設定 (Groupについてはlappmodel.tsの464行目で変更可)
          MotionNo.getInstance().setMotion(motionName);
          // 字幕の書き換え
          this.changeCaption(text);
          //
        }
      });
    }
  }
  private AudioBufferPlayer(buffer, callback): void {
    const { webkitAudioContext, AudioContext } = window as any;
    let mAudioContext = AudioContext || webkitAudioContext;
    var context = new mAudioContext();
    var source = context.createBufferSource();
    context.decodeAudioData(buffer, (buffer)=>{
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
      source.onended = callback
    },(e)=>console.log("Error with decoding audio data" + e)); 
  }
  private changeCaption(text): void {
    const captionElm = document.getElementById("caption");
    captionElm.innerHTML = text;
  }
}