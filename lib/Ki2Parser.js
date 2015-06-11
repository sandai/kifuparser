/* ---------- header ---------- */
"use strict";

var funcUtils = require('./functionUtils'),
    map = require('./map'),
    KifuBuilder = require('./KifuBuilder'),
    KifParser = require('./KifParser'),
    Ki2Completion = require('./Ki2Completion');
/* ---------- header ---------- */

function Ki2Parser(source, format) {
  this.source = source;
  this.format = format;
  // 棋譜の変化用スタック
  this.stack = [];
}

// extend
funcUtils.inherits(Ki2Parser, KifParser);

Ki2Parser.prototype.parseBodyTurn = function(body) {
  return this.unityTurnMark(body.match(/(?:^|^[\s\S]+?(?:\r?(?:\n|\r)))([▲▼△▽])/)[1]);
} ;

Ki2Parser.prototype.parseBody = function(body, header) {
  var main = KifuBuilder.createMainObject(),
      variations = KifuBuilder.createVariationsObject(),
      key = '',
      value = '',
      variline = null,
      turn = '',
      pointer = null,
      nextLine = null,
      ki2comp = null;

  // [手数, moveを追加するオブジェクト]
  this.stack.push([0, main]);
  // pointerを使って棋譜を保存するオブジェクトを切り替えていく
  pointer = main;

  // 最初の手番を取得
  turn = this.parseBodyTurn(body);

  // 行で分割し、さらに横並びの棋譜も分割してnextLineに渡す
  nextLine = this.nextLine(this.bodyToLines(funcUtils.toLines(body)));

  // 移動元座標を得るためのオブジェクト
  ki2comp = new Ki2Completion(header, turn);

  for(var line = nextLine(); line; line = nextLine()) {
    key = line.charAt(0);

    // 変化：の場合はkeyとvalueに値を入れる
    variline = line.match(/^(.+?)：[\s　]*(\d+)[\s　]*手$/);

    if(variline !== null) {
      key = funcUtils.trim(variline[1]);
      value = parseInt(variline[2], 10);
    }

    switch(key) {
    case '▲': case '▼': case '△': case '▽':
      var move = this.parseMove(line);

      // 手番が順になっているか
      turn = this.turnCheck(turn, move.turn);
      // 同○○のためにmoveオブジェクトを保存
      this.storeMove(move);

      // 棋譜の足りない情報を補完(移動元座標と成り駒)
      move = ki2comp.complementMove(move);

      // ki2の仕様に時間は無いがKifuParserはtimeが必要なので0を入れておく
      pointer.push({
        move: {
          'turn': this.turnToBoolean(move.turn),
          'to': move.to,
          'from': move.from,
          'piece': move.piece,
          'time': 0
        }});
      continue;
    case '*':
      var comment = (line === '*') ? '\n' : line.slice(1);
      this.parseBodyComment(pointer[pointer.length - 1], comment);
      continue;
    case '変化':
      var variation = [], node = null, moves = 0;

      if(ki2comp.checkVariationNumber(value) === false) {
        // ここにたどり着くということは、変化の値がおかしいということ
        throw new Error('moves of variation is invalid.');
      }

      // 棋譜を保存するオブジェクトを現在の変化に切り替える
      variation = this.parseBodyVariation(value);
      variations.push([value, variation]);
      pointer = variation;

      // 変化直後の同 ○のために前のmoveオブジェクトを保存
      node = this.stack[this.stack.length - 2];
      moves = (value - 1) - node[0];
      this.storeMove(node[1][moves].move);

      // boardを変化の局面まで戻す
      ki2comp.recessionBoard(value);

      // turnを変化の棋譜に合わせる
      turn = ki2comp.getLastMoveTurn();
      continue;
    case 'ま':
      var special = '',
      res = line.match(/^まで\d{1,3}手で(.*)$/);

      // 最終手がなければ組み入れる
      if(res !== null && typeof pointer[pointer.length - 1].special === 'undefined') {
        special = this.parseBodySpecialMove(res[1]);

        if(special !== null) {
          pointer.push({
            'special': special
          });
        }
      }
      continue;
    default:
      continue;
    }
  }

  // 本筋の棋譜がない
  if(main.length === 1) {
    throw new Error('This is invalid file.');
  }

  if(variations.length === 0) {
    return {'main': main};
  }

  return {'main': main, 'variations': variations};
};

Ki2Parser.prototype.turnToBoolean = function(turn) {
  return (turn === 'black') ? true : false;
};

Ki2Parser.prototype.turnCheck = function(turn, mturn) {
  if(turn !== mturn) {
    throw new Error('turn symbol is invalid.');
  }

  return (turn === 'black') ? 'white' : 'black';
};

Ki2Parser.prototype.unityTurnMark = function(turn) {
  return (/^[▲▼]$/.test(turn)) ? 'black' : 'white';
};

Ki2Parser.prototype.parseMoveMotion = function(motion) {
  // 行と入は上に統一
  if(motion === '行' || motion === '入') {
    return '上';
  }

  // 下は引に統一
  if(motion === '下') {
    return '引';
  }

  // それら以外はそのまま返す
  return motion;
};

Ki2Parser.prototype.parseMovePiece = function(move) {
  // 成についてはここで判定せずにKi2Completion Objectで行っている

  //同○○, 同○成, 同○○不成, 同成銀, 同成香等
  if(/^同(?!　)/.test(move)) {
    return map.piece(move.slice(1));
  }

  // 同　○, ○○成銀, ○○成香等, ○○成, 通常の棋譜等
  return map.piece(move.slice(2));
};

Ki2Parser.prototype.parseMoveLine = function(line) {
  var reg = new RegExp('^([▲▼△▽])' +
                       '(' +
                       '(?:同|同　|[１２３４５６７８９][一二三四五六七八九])' +
                       '成?[^右左直上行入引下寄成不打\\s　]+' +
                       ')' +
                       '([右左直])?([上行入引下寄])?([成打]|不成)?$');

  // res[手番,棋譜,相対位置,駒の動作,装飾子]
  return line.match(reg);
};

Ki2Parser.prototype.parseMove = function(line) {
  var turn = '', to = [], piece = 0, motion = '',
      res = this.parseMoveLine(line);

  if(res === null) {
    throw new Error('move is syntax error.');
  }

  turn = this.unityTurnMark(res[1]);
  to = this.parseMoveTo(res[2]);
  piece = this.parseMovePiece(res[2]);
  motion = this.parseMoveMotion(res[4]);

  if(to === null || piece === null) {
    throw new Error('move is syntax error.');
  }

  return {
    'turn': turn,
    'to': to,
    'piece': piece,
    'relative': res[3],
    'motion': motion,
    'modifier': res[5]
  };
};

Ki2Parser.prototype.bodyToLines = function(lines) {
  // △同　歩 ▲４三角みたいな横並びの棋譜を行に分割する
  var res = [],
      line = '',
      fn = function(match) {
        return '/' + match;
      };

  for(var i = 0, l = lines.length; i < l; i++) {
    line = funcUtils.trim(lines[i]);

    if(/[▲▼△▽]/.test(line.charAt(0)) === false) {
      res.push(line);
      continue;
    }

    // 手番の前にセパレータを入れてそれをsplitする仕組み
    line = line.replace(/[▲▼△▽]/g, fn);
    line = line.split('/');

    for(var j = 0, jl = line.length; j < jl; j++) {
      if(line[j] !== '') {
        res.push(line[j]);
      }
    }
  }

  return res;
};

Ki2Parser.prototype.splitSource = function(source) {
  // コメントか棋譜だけで始まる棋譜
  if(/^\r?(?:\n|\r)*[\s　]*[*▲▼△▽]/.test(source)) {
    return [undefined, undefined, source];
  }

  // 棋譜情報がある棋譜
  return source.match(/^([\s\S]+?)\r?(?:\n|\r)[\s　]*([*▲▼△▽][\s\S]+?)$/);
};

Ki2Parser.prototype.parse = function() {
  var res = this.splitSource(this.source),
      header = null;

  if(res === null) {
    throw new Error('This file is invalid.');
  }

  if(typeof res[1] === 'undefined') {
    return {
      'header': header,
      'body': this.parseBody(this.source, header)
    };
  }

  header = this.parseHeader(res[1]);

  return {
    'header': header,
    'body': this.parseBody(res[2], header)
  };
};

/* ---------- exports ---------- */
module.exports = Ki2Parser;
/* ---------- exports ---------- */
