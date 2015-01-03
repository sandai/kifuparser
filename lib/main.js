/* ---------- header ---------- */
"use strict";

var funcUtils = require('./functionUtils'),
    map = require('./map'),
    KifuBuilder = require('./KifuBuilder'),
    KifParser = require('./KifParser'),
    Ki2Parser = require('./Ki2Parser'),
    CsaParser = require('./CsaParser');
/* ---------- header ---------- */

var parsers = {
  Kif: KifParser,
  Ki2: Ki2Parser,
  Csa: CsaParser
};

/*
 受け取った棋譜のフォーマットを判定してパーサを生成する関数
 */
function parserFactory(source, format) {
  var trueFormat = '';

  if(source === null || typeof(source) !== 'string') {
    throw new Error('KifuParser(source <-I need it yesterday!, format)');
  }

  trueFormat = checkFormat(funcUtils.toLines(source), format);

  // 棋譜データとして扱えない場合
  if(trueFormat === 'noformat') {
    throw new Error('This is not a kifu.');
  }

  return new parsers[trueFormat](source, trueFormat);
}

function checkFormat(source, format) {
  var factFormat = 'noformat';

  // 行頭の文字からフォーマットを判定
  // たったこれだけだがそれなりに精度はあるはず
  for(var i = 0, l= source.length, ch = ''; i < l; i++) {
    ch = funcUtils.trim(source[i]).charAt(0);

    switch(ch) {
    case '1':
      factFormat = map.format('Kif');
      break;
    case '▲':
    case '△':
    case '▼':
    case '▽' :
      factFormat = map.format('Ki2');
      break;
    case '+': case '-':
      // kifやki2の初期盤面で+や-が使われているので、
      // 続く文字が数字の場合にCsaと判断し、そうでなければcontinue
      if(/\d/.test(funcUtils.trim(source[i]).charAt(1))){
        factFormat = map.format('Csa');
        break;
      }
      continue;
    default:
      // ループに戻る
      continue;
    }

    // ループを抜ける
    break;
  }

  if(factFormat === map.format(format)) {
    return map.format(format);
  }

  return factFormat;
}

function kifuParser(source, format, json) {
  var parser = parserFactory(source, format),
      kifubuilder = new KifuBuilder(parser.parse());

  kifubuilder.build();

  if(json !== true) {
    return kifubuilder.getKifuObject();
  }

  return kifubuilder.getKifuJSON();
}


/* ---------- exports ---------- */
module.exports = kifuParser;
/* ---------- exports ---------- */
