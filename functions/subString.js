function subStr(value){
      value = value.substring(value.lastIndexOf('/')+1,value.length);    
      return value;
  }

  module.exports = subStr