let isIncludeList = (tokensBasicForm, saidList, index)=>{
  if (saidList.filter(w=>tokensBasicForm.includes(w)).length==saidList.length) {
    return index;
  }
  return false;
}
let searchReply = (replyDictionary, tokensBasicForm, searchDict)=>{
  let keys = Object.keys(searchDict);
  let resIndexList = keys.map(saidListStr=>isIncludeList(tokensBasicForm, saidListStr.split(","), saidListStr)).filter(Boolean);
  if (resIndexList.length<=0) {
    return undefined;
  }
  let replyDictionaryIndex = searchDict[resIndexList[0]];
  if (replyDictionaryIndex==undefined) {
    return undefined;
  }
  return replyDictionary[replyDictionaryIndex];
}
self.onmessage = (e)=>{
  //const startTime = performance.now();
  let replyDictionary = e.data.dic;
  let searchDict = e.data.search;
  let tokens = e.data.tokens;
  let tokensBasicForm = tokens.map(e=>e.basic_form);
  let tokensReadingForm = tokens.map(e=>e.reading);
  if (replyDictionary==undefined||replyDictionary.length<=0||searchDict==undefined||searchDict.length<=0||tokensBasicForm==undefined) {
    self.postMessage([]);
    return false;
  }
  let replyObj = searchReply(replyDictionary, tokensBasicForm, searchDict);
  if (replyObj==undefined) {
    let replyObj_reading = searchReply(replyDictionary, tokensReadingForm, searchDict);
    self.postMessage(replyObj_reading);
    return false;
  } else {
    self.postMessage(replyObj);
    //const endTime = performance.now();
    //console.log(endTime - startTime);
    return false;
  }
}