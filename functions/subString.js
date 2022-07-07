function subString(value){
    var flag = true;
    var mess = '';
    var str = value.toString();
    if(str.trim() == ''){
      mess = 'Empty'
    } else {
      mess = str.substring(str.lastIndexOf('/')+1,str.length);
    }
      return mess;
  }

  module.exports = subString