/* ---------- header ---------- */
"use strict";

var funcUtils = require('./functionUtils'),
    map = require('./map'),
    KifuBuilder = require('./KifuBuilder');
/* ---------- header ---------- */

function KifParser(source, format) {
  this.source = source;
  this.format = format;
  // 棋譜の変化用スタック
  this.stack = [];
}

KifParser.prototype.parseHeaderUsed = function(value) {
  return value.match(/(\d+)▲(\d+)△(\d+)$/);
};

KifParser.prototype.parseHeaderBoard = function(board) {
  var res = [];

  if(board[0] !== '+---------------------------+' &&
     board[9] !== '+---------------------------+') {
    return null;
  }

  for(var i = 1, j = 0, jl = 0; i <= 9; i++ ) {
    j = 0;
    jl = board[i].length;

    if(board[i].charAt(j) !== '|') { return null; }

    // "|"の次の文字から判定できるように
    j += 1;
    // -2をすることでちょうど最後の"|"までになる
    jl -= 2;
    for(var player = '', piece = ''; j < jl; j+=2) {
      player = board[i].charAt(j);
      piece = board[i].charAt(j + 1);

      if(player === 'v') {
        if(map.piece(piece) === null) { return null; }

        // whiteの駒なのでマイナスにする
        piece = 0 - map.piece(piece);
      } else if(player === ' ') {
        if(piece === '・') {
          // 駒なし
          piece = 0;
        } else {
          if(map.piece(piece) === null) { return null; }

          piece = map.piece(piece);
        }
      } else {
        // ここにきたらフォーマット通りでないということ
        return null;
      }

      res.push(piece);
    }

    if(board[i].charAt(j) !== '|') { return null; }

    // 最後の漢数字を判定
    j += 1;
    if(i !== map.kansuji(board[i].charAt(j))) {
      return null;
    }
  }

  return res;
};

KifParser.prototype.parseHeaderHand = function(hands) {
  var res = {},
      piece = 0,
      kind = '',
      num = 0,
      // ホワイトスペースでsplit
      list = hands.split(/[\s　]/);

  for(var i = 0, l = list.length; i < l; i++) {
    piece = map.piece(list[i].charAt(0));
    kind = map.pieceToCsaPieceMapKey(piece);

    // list[i].charAt(1)が''のときは駒がひとつのとき
    num = (list[i].charAt(1) === '') ?
      1 :
      map.kansuji(list[i].charAt(1));

    if(piece === null || num === null) { return null; }

    res[kind] = num;
  }

  return res;
};

KifParser.prototype.parseHeader = function(header) {
  var res = KifuBuilder.createHeaderObject(),
      key = '',
      value = '',
      format = null,
      nextLine = this.nextLine(funcUtils.toLines(header));

  for(var line = nextLine(); line; line = nextLine()) {

    // 初期盤面かどうか判定
    // もっとすっきりできんもんか
    if(line === '９ ８ ７ ６ ５ ４ ３ ２ １') {
      key = map.header(line.charAt(0));
    } else {
      format = line.match(/^(.+?)：(.+)$/);

      // フォーマット通りでない行は無視
      if(format === null) { continue; }

      key = map.header(funcUtils.trim(format[1]));
      value = funcUtils.trim(format[2]);
    }

    switch(key) {
    case 'start': case 'end':
      if(!funcUtils.validateDate(value)) { continue; }

      if(typeof res.date === 'undefined') { res.date = {}; }
      res.date[key] = value;
      continue;
    case 'title':
    case 'event':
    case 'opening':
    case 'site':
      res[key] = value;
      continue;
    case 'limit':
      if(typeof res.time === 'undefined') { res.time = {}; }
      res.time[key] = value;
      continue;
    case 'handicap':
      // 先にboardを読み込んでいればhandicapは必ずその他となっているので手をつけない
      if(!res.handicap) { res[key] = map.handicap(value); }
      continue;
    case 'tactics_black': case 'tactics_white':
      if(typeof res.tactics === 'undefined') { res.tactics = {}; }
      res.tactics[key.split('_')[1]] = value;
      continue;
    case 'player_black': case 'player_white':
      if(typeof res.players === 'undefined') { res.players = {}; }
      res.players[key.split('_')[1]] = value;
      continue;
    case 'used':
      var used = this.parseHeaderUsed(value);
      if(used === null) { continue; }

      if(typeof res.time === 'undefined') { res.time = {}; }
      res.moves = parseInt(used[1], 10);
      res.time[key] = {
        'black': parseInt(used[2], 10),
        'white': parseInt(used[3], 10)
      };
      continue;
    case 'board':
      var board = [];

      for(var i = 0; i <= 10; i++) {
        line = nextLine();

        if(line === null ||
           (line.charAt(0) !== '+' && line.charAt(0) !== '|')) {
          throw new Error('position figure is invalid.');
        }

        board.push(line);
      }

      board = this.parseHeaderBoard(board);

      if(board === null) {
        throw new Error('position figure is invalid.');
      }

      res.board = board;
      // handicapは強制的にその他
      res.handicap = map.handicap('その他');
      continue;
    case 'hand_black':
    case 'hand_white':
      var hand = this.parseHeaderHand(value);

      if(hand === null) {
        throw new Error('hand piece is invalid.');
      }

      if(typeof res.hands === 'undefined') { res.hands = {}; }
      res.hands[key.split('_')[1]] = hand;
      continue;
    case 'turn':
      // 初期手番
      // 後手番のみつくので先手の場合はres.turnはundefined
      res.turn = false;
      continue;
    default: continue;
    }
  }

  return (!funcUtils.isEmptyObject(res)) ? res : null;
};

KifParser.prototype.parseBodyComment = function(obj, comment) {
  if(!obj.comment) {
    obj.comment = comment;
  } else {
    obj.comment += (comment === '\n') ?
      comment : ('\n' + comment);
  }
};

KifParser.prototype.parseBodyVariation = function(value) {
  var variation = [], node = null, moves = 0;

  node = this.stack[this.stack.length - 1];
  moves = value - node[0];

  // スタックの整理
  if(0 < moves) {
    this.stack.push([value, variation]);
  } else {
    do {
      this.stack.pop();
      node = this.stack[this.stack.length - 1];
      moves = value - node[0];
    } while(moves <= 0);

    this.stack.push([value, variation]);
  }

  // 現在の変化の棋譜を保存していくオブジェクトを返す
  return variation;
};

KifParser.prototype.parseBodySpecialMove = function(result) {
  switch(result) {
  case '先手の勝ち':
  case '後手の勝ち':
  case '上手の勝ち':
  case '下手の勝ち':
    return map.specialMove('投了');
  case '千日手':
  case '中断':
  case '持将棋':
    return map.specialMove(result);
  case '詰':
    return map.specialMove('詰み');
  case '先手の反則負け':
  case '後手の反則負け':
  case '上手の反則負け':
  case '下手の反則負け':
    return map.specialMove('反則負け');
  default: break;
  }

  return null;
};

KifParser.prototype.parseBodyFirstMove = function(body) {
  var nextLine = this.nextLine(funcUtils.toLines(body)),
      move = null;

  for(var line = nextLine(), key = ''; line; line = nextLine()) {
    key = line.charAt(0);

    switch(key) {
    case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8':
    case '9':
      move = this.parseMove(line);
      return move;
    default:
      continue;
    }

    break;
  }

  return null;
};

KifParser.prototype.parseBodyFirstTurn = function(header) {
  // なにもなければ先手
  if(header === null) {
    return true;
  }

  // 要素がなければ先手
  if(typeof header.turn === 'undefined') {
    return true;
  }

  // header.turnには後手を意味するfalseしか入ってないのでそれ返す
  return header.turn;
};

KifParser.prototype.parseBody = function(body, header) {
  var main = KifuBuilder.createMainObject(),
      variations = KifuBuilder.createVariationsObject(),
      key = '',
      value = '',
      order = 0,
      firstMove = null,
      turnBase = 0,
      firstTurn = true,
      variline = null,
      pointer = null;

  // [手数, moveを追加するオブジェクト]
  this.stack.push([0, main]);
  // pointerを使って棋譜を保存するオブジェクトを切り替えていく
  pointer = main;

  // 最初の指し手を取得
  firstMove = this.parseBodyFirstMove(body);
  // 開始の数値を取得
  order =  firstMove.num;
  // 先後を判定するための基準値
  turnBase = order % 2;
  // 最初の手番
  firstTurn = this.parseBodyFirstTurn(header);

  var nextLine = this.nextLine(funcUtils.toLines(body));

  for(var line = nextLine(); line; line = nextLine()) {
    key = line.charAt(0);

    // 変化：の場合はkeyとvalueに値を入れる
    variline = line.match(/^(.+?)：[\s　]*(\d+)[\s　]*手$/);

    if(variline !== null) {
      key = funcUtils.trim(variline[1]);
      value = parseInt(variline[2], 10);
    }

    switch(key) {
    case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8':
    case '9':
      var move = this.parseMove(line);

      //手数が順になっているか
      order = this.checkMoves(order, move.num);
      // 同 ○のためにmoveオブジェクトを保存
      this.storeMove(move);

      if(move.special) {
        pointer.push({
          'special': move.special
        });
        continue;
      }

      pointer.push({
        'move': {
          'turn': this.takeTurn(turnBase, firstTurn, move.num),
          'to': move.to,
          'from': move.from,
          'piece': move.piece
        },
        'time': move.time});

      continue;
    case '*':
      var comment = (line === '*') ? '\n' : line.slice(1);
      this.parseBodyComment(pointer[pointer.length - 1], comment);
      continue;
    case '変化':
      var variation = [], node = null, moves = 0;

      if((order - 1) < value) {
        // ここにたどり着くということは、変化の値がおかしいということ
        throw new Error('moves of variation is invalid.');
      }
      // 変化の手数に変える
      order = value;

      // 棋譜を保存するオブジェクトを現在の変化に切り替える
      variation = this.parseBodyVariation(value);
      variations.push([value, variation]);
      pointer = variation;

      // 変化直後の同 ○のために前のmoveオブジェクトを保存
      node = this.stack[this.stack.length - 2];
      moves = (value - 1) - node[0];
      this.storeMove(node[1][moves].move);
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

KifParser.prototype.takeTurn = function(base, firstTurn, num) {
  if(base % 2 === num % 2) {
    return firstTurn;
  }

  return ! firstTurn;
};

KifParser.prototype.checkMoves = function(order, num) {
  if(order !== num) {
    throw new Error('moves is not in the order.');
  }

  return order + 1;
};

KifParser.prototype.storeMove = function(move) {
  this.move = move;
};

KifParser.prototype.loadMove = function() {
  return this.move;
};

KifParser.prototype.parseMoveTo = function(move) {
  var file = 0, rank = 0;

  if(move.charAt(0) === '同') {
    // shallow copy
    return this.loadMove().to.concat();
  }

  file = map.zenkakNumber(move.charAt(0));
  rank = map.kansuji(move.charAt(1));

  if(file !== null && rank !== null) {
    return [file, rank];
  }

  return null;
};

KifParser.prototype.parseMoveFrom = function(modifier, from) {
  var file = 0, rank = 0;

  // 打ち駒は移動元が駒台である[0, 0]を返す
  if(modifier === '打') {
    return [0, 0];
  }

  if(typeof from !== 'undefined') {
    file = parseInt(from.charAt(0), 10);
    rank = parseInt(from.charAt(1), 10);

    if(file && rank) {
      return [file, rank];
    }
  }

  //modifierが"打"でなくfromもundefinedである場合はnullを返す
  return null;
};

KifParser.prototype.parseMovePiece = function(move, modifier) {
  if(modifier === '成') {
    return map.promotedPiece(move.slice(2) + '成');
  }

  // this.refPieceMapでpieceが見つからなければnullを返す
  return map.piece(move.slice(2));
};

KifParser.prototype.parseMoveTime = function(time) {
  var used = time.match(/^(\d+):(\d+).*$/);
  if(used !== null) {
    return (parseInt(used[1], 10) * 60) + parseInt(used[2], 10);
  }

  return null;
};

KifParser.prototype.parseMoveLine = function(line) {
  // res[手数, 指し手, 装飾子(成|打), 移動元, 時間]
  var reg = new RegExp('^(\\d{1,3})\\s+' +
                       '(' +
                       '(?:(?:同　|[１２３４５６７８９][一二三四五六七八九]成?)|[^同１２３４５６７８９])[^ (\\d)打成]+' +
                       ')' +
                       '(打|成)?' +
                       '(?:\\((\\d{2})\\))?' +
                       '(?:$|\\s*\\(\\s*([^ ]+)\\s*\\)$)');

  return line.match(reg);
};

KifParser.prototype.parseMove = function(line) {
  var num = 0, to = [], from = [], piece = 0, time = 0,
      res = this.parseMoveLine(line);

  if(res === null) {
    throw new Error('move is syntax error.');
  }

  num = parseInt(res[1], 10);

  if(map.specialMove(res[2]) !== null) {
    return {
      'num': num,
      'special': map.specialMove(res[2])
    };
  }

  to = this.parseMoveTo(res[2]);
  piece = this.parseMovePiece(res[2], res[3]);
  from = this.parseMoveFrom(res[3], res[4]);
  // timeはかならずつけるため0を入れていて、nullの場合だけエラーとする
  time = (typeof time !== 'undefined') ? this.parseMoveTime(funcUtils.trim(res[5])) : 0;

  // エラーを表示するかもしれないのでここで一度に評価しておく
  if(to === null || from === null ||  piece === null || time === null) {
    throw new Error('move is syntax error.');
  }

  return  {
    'num': num,
    'to': to,
    'from': from,
    'piece': piece,
    'time': time
  };
};

KifParser.prototype.nextLine = function(lines) {
  var index = -1;

  return function nextLine() {
    var line = '';
    index += 1;
    line = lines[index];

    if(typeof line === 'undefined') {
      return null;
    }

    if(line.charAt(0) === '#') { index += 1; }

    // linesの最後が'#'から始まる場合はundefinedになるのでnullにして返す
    return lines[index] ? funcUtils.trim(lines[index]) : null;
  };
};

KifParser.prototype.splitSource = function(source) {
  // "\r?\n|\r手数----指手---------消費時間--\r?\n|\r"で区切る
  return source.match(/^([\s\S]+?)\r?(?:\n|\r)手数----指手---------消費時間--\r?(?:\n|\r)([\s\S]+)$/);
};

KifParser.prototype.parse = function() {
  var res = this.splitSource(this.source),
      header = null;

  if(res === null) {
    return {
      'header': null,
      'body': this.parseBody(this.source, null)
    };
  }

  header = this.parseHeader(res[1]);

  return {
    'header': header,
    'body': this.parseBody(res[2], header)
  };
};

/* ---------- exports ---------- */
module.exports = KifParser;
/* ---------- exports ---------- */
