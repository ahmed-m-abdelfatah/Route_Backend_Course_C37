const getSymbolKey = (obj, symbolKeyStr) => {
  // symbolKeyStr key is a string
  // function should called out of try catch block
  // https://stackoverflow.com/a/50453836/16107539
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols

  const symbolKey = Reflect.ownKeys(obj).find(key => key.toString() === symbolKeyStr);
  return obj[symbolKey];
};

module.exports = getSymbolKey;
