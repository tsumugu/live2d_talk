let isIncludeList = (tokensBasicForm, saidList)=>{
  if (saidList.split(",").filter(w=>tokensBasicForm.includes(w)).length==saidList.length) {
    return saidList;
  }
  return false;
}
let searchReply = (replyDictionary, tokensBasicForm, searchDict)=>{
  let keys = Object.keys(searchDict);
  let resIndexList = keys.map(saidList=>isIncludeList(tokensBasicForm, saidList)).filter(Boolean);
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
  const startTime = performance.now();
  let replyDictionary = e.data.dic;
  let searchDict = e.data.search;
  let tokens = e.data.tokens;
  let tokensBasicForm = tokens.map(e=>{
    if (e.basic_form==undefined) {
      return e.surface_form;
    }
    return e.basic_form;
  });
  let tokensReadingForm = tokens.map(e=>e.reading);
  if (replyDictionary==undefined||replyDictionary.length<=0||searchDict==undefined||searchDict.length<=0||tokensBasicForm==undefined) {
    self.postMessage([]);
  }
  let replyObj = searchReply(replyDictionary, tokensBasicForm, searchDict);
  if (replyObj==undefined) {
    let replyObj_reading = searchReply(replyDictionary, tokensReadingForm, searchDict);
    self.postMessage(replyObj_reading);
    const endTime = performance.now();
    console.log(endTime - startTime);
  } else {
    self.postMessage(replyObj);
    const endTime = performance.now();
    console.log(endTime - startTime);
  }
}