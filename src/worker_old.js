// 返答リストの質問文(reply_dictionary[i].said)の中に、ユーザからの質問文(tokensBasicForm)が含まれているかを調べる関数
let isMatchList = (said, tokensBasicForm)=>{
  return said.filter(saidList=>saidList.filter(w=>tokensBasicForm.includes(w)).length==saidList.length).length!=0;
}
self.onmessage = (e)=>{
  let reply_dictionary = e.data.dic;
  let tokens = e.data.tokens;
  let tokensBasicForm = tokens.map(e=>e.basic_form);
  let tokensReadingForm = tokens.map(e=>e.reading);
  if (reply_dictionary==undefined||tokensBasicForm==undefined) {
    self.postMessage([]);
    return false;
  }
  //let replyObj = reply_dictionary.filter(e=>isMatchList(e.utterance, tokensBasicForm))[0];
  let replyObj = reply_dictionary.filter(e=>isMatchList(e.utterance.map(f=>Object.values(f)), tokensBasicForm))[0];
  if (replyObj==undefined) {
    let replyObj_reading = reply_dictionary.filter(e=>isMatchList(e.utterance.map(f=>Object.values(f)), tokensReadingForm))[0];
    self.postMessage(replyObj_reading);
  } else {
    self.postMessage(replyObj);
  }
};