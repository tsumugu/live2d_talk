// 返答リストの質問文(reply_dictionary[i].said)の中に、ユーザからの質問文(tokensBasicForm)が含まれているかを調べる関数
let isMatchList = (said, tokensBasicForm)=>{
  return said.filter(saidList=>saidList.filter(w=>tokensBasicForm.includes(w)).length==saidList.length).length!=0;
}

self.onmessage = (e)=>{
  // 処理時間計測用
  const startTime = performance.now();
  // 返答リスト
  let reply_dictionary = e.data.dic;
  // 形態素解析の結果の配列
  let tokens = e.data.tokens;
  // 形態素解析の結果の配列をbasic_form(基本形)の配列に変換 (詳しくはkuromojiのドキュメント: https://www.atilika.org/)
  let tokensBasicForm = tokens.map(e=>{
    if (e.basic_form==undefined) {
      return e.surface_form;
    }
    return e.basic_form;
  });
  // 形態素解析の結果の配列をreading(読み方)の配列に変換
  let tokensReadingForm = tokens.map(e=>e.reading);
  if (reply_dictionary==undefined||tokensBasicForm==undefined) {
    self.postMessage([]);
    return false;
  }
  // 返答を探す処理
  // 1. reply_dictionaryのうち、isMatchList()からの結果がtrueのものだけ
  let replyObj = reply_dictionary.filter(e=>isMatchList(e.utterance.map(f=>Object.values(f)), tokensBasicForm))[0];
  if (replyObj==undefined) {
    // 3. replyObjが空だったら、読みのほうでも返答を探してみる
    let replyObj_reading = reply_dictionary.filter(e=>isMatchList(e.utterance.map(f=>Object.values(f)), tokensReadingForm))[0];
    // 4. もし読みで探しても見つからなかったらユーザからの呼びかけをそのまま返却するので、それを代入
    if (replyObj_reading==undefined) {
      replyObj_reading = e.data.text;
    }
    // 返答を返却して終了
    self.postMessage(replyObj_reading);
    // 処理時間を表示
    const endTime = performance.now();
    console.log(endTime - startTime);
  } else {
    // 2. もしreplyObjが空ではなかったら返答を返却して終了
    self.postMessage(replyObj);
    // 処理時間を表示
    const endTime = performance.now();
    console.log(endTime - startTime);
  }
};