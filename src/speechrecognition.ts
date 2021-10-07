// 形態素解析ライブラリをimport
import {tokenize} from "kuromojin";

export let s_instance: SpeechRecognitionClass = null;
export class SpeechRecognitionClass {
  worker: any;
  constructor() {
    this.worker = new Worker('./src/worker.js');
  }
  public static getInstance(): SpeechRecognitionClass {
    if (s_instance == null) {
      s_instance = new SpeechRecognitionClass();
    }
    return s_instance;
  }
  public initialize(): void {
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
    var reply_dictionary = [
      {
        "said": [["名前", "教える"], ["名前", "何"]],
        "reply": "私の名前は花子です",
        "motion": 0,
        "intimacy": ["+", 10]
      },
      {
        "said": [["犬", "好き"]],
        "reply": "犬よりも猫のほうが好きです",
        "motion_num": 0,
        "intimacy": ["-", 10]
      }
    ];
    tokenize(text).then(tokens => {
      let tokensBasicForm = tokens.map(e=>e.basic_form);
      // Web Workersを使えばUIがカクつくのを防げるかと思ったけど、そんなことなかった...。
      this.worker.addEventListener('message', function(e) {
        let replyObj = e.data;
        if (replyObj!=undefined) {
          let replyText = replyObj.reply;
          //console.log("ユーザ: ", text);
          //console.log("AI: ", replyText);
        } else {
          // 会話APIに投げる
        }
      }, false);
      this.worker.postMessage({dic: reply_dictionary, tokens: tokensBasicForm});
    });
  }
}