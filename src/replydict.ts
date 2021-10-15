import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore/lite'
import { collection, getDocs } from 'firebase/firestore/lite'
import {MyUI} from "./myui";

export let s_instance: ReplyDict = null;
export class ReplyDict {
  docs: any;
  searchObj: Object;
  constructor() {
  }
  public static getInstance(): ReplyDict {
    if (s_instance == null) {
      s_instance = new ReplyDict();
    }
    return s_instance;
  }
  public initialize(): void {
    const firebaseConfig = {
      apiKey: "AIzaSyChVdRIHkz6R5lPOH1tttIB0Aoaydq_N0g",
      authDomain: "csderf-1352.firebaseapp.com",
      databaseURL: "https://csderf-1352-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "csderf-1352",
      storageBucket: "csderf-1352.appspot.com",
      messagingSenderId: "936872253266",
      appId: "1:936872253266:web:43a38183e8f0b0ba244c8b"
    }
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app);
    const col = collection(db, 'live2d_talk');
    this.docs = [];
    this.searchObj ={};
    getDocs(col).then(res=>{
      console.log(res);
      let replayIndex = 0;
      let resSize = res.size;
      res.forEach(doc=>{
        let d = doc.data();
        this.docs.push(Object.assign({id: doc.id}, d))
        d.utterance.forEach(f=>{
          this.searchObj[Object.values(f).toString()] = replayIndex;
        })
        replayIndex++;
        if (replayIndex==resSize) {
          MyUI.getInstance().finishReplyDict();
        }
      })
    });
  }
  public getDictionary(): Array<Object> {
    if (this.docs==null) {
      return [];
    }
    return this.docs;
  }
  public getSearchObj(): Object {
    if (this.searchObj==undefined) {
      return {};
    } else {
      return this.searchObj;
    }
  }
  private getUniqueStr(): String {
    return new Date().getTime().toString(16)  + Math.floor(1000*Math.random()).toString(16)
  }
  public initialize_DEBUG(): Array<Object> {
    const size = 1000000;
    this.docs = [];
    this.searchObj ={};
    for (let i=0;i<size;i++) {
      let d = {
        "id": this.getUniqueStr()+i.toString(),
        "utterance": [["名前", "教える"], ["名前", "何"]],
        "reply": "私の名前は花子です",
        "emotion_name": "fun"
      };
      this.docs.push(d);
      d.utterance.forEach(f=>{
        this.searchObj[Object.values(f).toString()] = i;
      })
    }
    let d2 = {
      "id": this.getUniqueStr()+size.toString(),
      "utterance": [["これ", "テスト"]],
      "reply": "私の名前は花子です",
      "emotion_name": "fun"
    };
    this.docs.push(d2);
    d2.utterance.forEach(f=>{
      this.searchObj[Object.values(f).toString()] = size;
    })
    MyUI.getInstance().finishReplyDict();
    return this.docs;

    /*
    var reply_dictionary = [
      {
        "utterance": [["名前", "教える"], ["名前", "何"]],
        "reply": "私の名前は花子です",
        "emotion_name": "fun"
      },
      {
        "utterance": [["犬", "好き"]],
        "reply": "犬よりも猫のほうが好きです",
        "emotion_name": "sad"
      },
      {
        "utterance": [["ねむい"],["眠い"]],
        "reply": "そうですか。",
        "emotion_name": ""
      }
    ];
    return reply_dictionary;
    */
  }
}