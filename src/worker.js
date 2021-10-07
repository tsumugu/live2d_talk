// 返答リストの質問文(reply_dictionary[i].said)の中に、ユーザからの質問文(tokensBasicForm)が含まれているかを調べる関数
let isMatchList = (said, tokensBasicForm)=>{
  return said.filter(saidList=>saidList.filter(w=>tokensBasicForm.includes(w)).length==saidList.length).length!=0;
}
self.onmessage = (e)=>{
  var reply_dictionary = e.data.dic;
  var tokensBasicForm = e.data.tokens;
  if (reply_dictionary==undefined||tokensBasicForm==undefined) {
    self.postMessage([]);
    return false;
  }
  let replyObj = reply_dictionary.filter(e=>isMatchList(e.said, tokensBasicForm))[0];
  self.postMessage(replyObj);
};