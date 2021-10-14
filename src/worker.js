let isIncludeList = (tokensBasicForm, saidList, index)=>{
  if (saidList.filter(w=>tokensBasicForm.includes(w)).length==saidList.length) {
    return index
  }
  return false;
}
let searchReply = (reply_dictionary, tokensBasicForm, idList, valueList)=>{
  let resIndexList = valueList.map((saidList, index)=>isIncludeList(tokensBasicForm, saidList, index)).filter(Boolean)
  let resIdIndex = resIndexList[0];
  if (resIdIndex==undefined) {
    return undefined;
  }
  let resIdWithIndex = idList[resIdIndex];
  if (resIdWithIndex==undefined) {
    return undefined;
  }
  let resId = resIdWithIndex.split('-')[1];
  if (resId==undefined) {
    return undefined;
  }
  return reply_dictionary.filter(e=>e.id==resId)[0];
}
self.onmessage = (e)=>{
  let reply_dictionary = e.data.dic;
  let tokens = e.data.tokens;
  let tokensBasicForm = tokens.map(e=>e.basic_form);
  let tokensReadingForm = tokens.map(e=>e.reading);
  if (reply_dictionary==undefined||reply_dictionary.length<=0||tokensBasicForm==undefined) {
    self.postMessage([]);
    return false;
  }
  // 探索のための配列を生成する。(1次元配列にすることで高速化を狙う。)
  let idList = [];
  let valueList = [];
  reply_dictionary.forEach(e=>{
    e.utterance.forEach((f, i)=>{
      idList.push(i.toString()+"-"+e.id);
      valueList.push(Object.values(f))
    })
  });
  let replyObj = searchReply(reply_dictionary, tokensBasicForm, idList, valueList);
  if (replyObj==undefined) {
    let replyObj_reading = searchReply(reply_dictionary, tokensReadingForm, idList, valueList);
    self.postMessage(replyObj_reading);
  } else {
    self.postMessage(replyObj);
  }
};