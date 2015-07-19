/* ---------- header ---------- */
"use strict";

var funcUtils = require('./functionUtils'),
    map = require('./map'),
    KifuBuilder = require('./KifuBuilder');
/* ---------- header ---------- */

function CsaParser(source, format) {
  this.source = source;
  this.format = format;
}

CsaParser.prototype.parseHeaderBoard = function(board) {
  var res = [], player = '', piece = '';

  for(var i = 0, sj = 0; i < 9; i++) {
    sj = 2;

    if(board[i].slice(0, sj) === 'P' + (i + 1)) {
      for(var j = 0; j < 9; j++, sj += 3) {
        piece = board[i].slice(sj, sj + 3);
        player = piece.charAt(0);

        if(player === '-' || player === '+') {
          piece = map.csaPiece(piece.slice(1));

          if(piece === null) { return null; }

          piece = (player === '-') ? 0 - piece : piece;

        } else {
          // どうしようかな
          if(piece === ' * ' || (piece === ' *')) {
            piece = 0;
          } else {
            return null;
          }

        }

        res.push(piece);
      }
    }
  }

  return res;
};

CsaParser.prototype.parseHeaderHand = function(hand) {
  var res = {},
      piece = 0,
      kind = '';

  for(var i = 0, sl = 2, l = (hand.length - 2) / 4; i < l; i++, sl += 4) {
    piece = map.csaPiece(hand.slice(sl + 2, sl + 4));
    kind = map.pieceToCsaPieceMapKey(piece);

    if(piece === null) { return null; }

    res[kind] = (typeof res[kind] === 'undefined') ? 1 : res[kind] + 1;
  }

  return res;
};

CsaParser.prototype.parseHeader = function(header) {
  var res = KifuBuilder.createHeaderObject(),
      key = '',
      value = '',
      format = null,
      nextLine = this.nextLine(funcUtils.toLines(header));

  for(var line = nextLine(); line; line = nextLine()) {
    format = line.match(/^((?:\+|\-)$|P|V|N(?:\+|\-)|\$)(.*)$/);

    // フォーマット通りでない行は無視
    if(format === null) { continue; }

    key = format[1];
    value = funcUtils.trim(format[2]);

    switch(key) {
    case '+': case '-':
      res.turn = (key === '+') ? true : false;
      continue;
    case 'N+':
    case 'N-':
      if(!res.players) { res.players = {}; }
      res.players[(key === 'N+') ? 'black' : 'white'] = value;
      continue;
    case '$':
      format = line.match(/^(.+?):(.*)$/);

      // フォーマット通りでない行は無視
      if(format === null) { continue; }

      key = map.csaHeader(format[1]);
      value = funcUtils.trim(format[2]);

      switch(key) {
      case 'start': case 'end':
        if(!funcUtils.validateDate(value)) { continue; }
        if(!res.date) {res.date = {}; }
        res.date[key] = value;
        break;
      case 'event':
      case 'opening':
      case 'site':
        res[key] = value;
        break;
      case 'limit':
        if(!res.time) {res.time = {}; }
        res.time[key] = value;
        break;
      default:
        // スルー
        break;
      }
      continue;
    case 'P':
      switch(value.charAt(0)) {
      case 'I': break; // 平手初期配置と駒落ちは現状スルー
      case '1':
        var board = line, arrboard = [line], order = 2;

        while(order <= 9) {
          line = nextLine();

          if(line === null ||
             line.charAt(0) !== 'P') {
            throw new Error('position figure is invalid.');
          }

          // NaNになるケースもあるが問題ないはず
          if(parseInt(line.charAt(1), 10) === order) {
            board += line;

            // 盤面図用
            arrboard.push(line);
          } else {
            throw new Error('position figure is invalid.');
          }

          order += 1;
        }

        res.handicap = map.csaHandicap(board);

        if(res.handicap === map.csaHandicap('その他')) {
          // Csaのその他は平手に強制
          res.handicap = map.csaHandicap('平手');
          board = this.parseHeaderBoard(arrboard);

          if(board === null) {
            throw new Error('position figure is invalid.');
          }

          res.board = board;
        }

        break;
      case '-': case '+':
        var hand = this.parseHeaderHand(line);

        if(hand === null) {
          throw new Error('hand piece is Invlid.');
        }

        if(typeof res.hands === 'undefined') { res.hands = {}; }
        res.hands[(value.charAt(0) === '+') ? 'black' : 'white'] = hand;
        break;
      default: break;
      }
      continue;
    case 'V':
      // フォーマットのバージョン
      // とくになんもせん
      continue;
    default: continue;
    }
  }

  return (!funcUtils.isEmptyObject(res)) ? res : null;
};

CsaParser.prototype.parseBodyComment = function(obj, comment) {
  if(!obj.comment) {
    obj.comment = comment;
  } else {
    obj.comment += (comment === '\n') ?
      comment : ('\n' + comment);
  }
};

CsaParser.prototype.parseBody = function(body) {
  var main = KifuBuilder.createMainObject(),
      key = '',
      turn = '',
      nextLine = null;

  // 行で分割して、さらに棋譜中にあるコンマで分割している
  nextLine = this.nextLine(this.eachSepComma(funcUtils.toLines(body)));

  // bodyの先頭は必ず手番なのでそれを格納
  turn = nextLine();

  for(var line = nextLine(); line; line = nextLine()) {
    key = line.charAt(0);

    switch(key) {
    case '+': case '-':
      var move = this.parseMove(line);

      // 手番が正しいか確認
      turn = this.turnCheck(turn, move.turn);

      main.push({
        'move': {
          'turn': this.turnToBoolean(move.turn),
          'to': move.to,
          'from': move.from,
          'piece': move.piece,
          'time': 0 // かならずtimeはつける。実際の時間はcase 'T':でつけられる
        }});
      continue;
    case '\'':
      // コメントでないならcontinue
      if(line.charAt(1) !== '*') { continue; }

      var comment = (line === "/'*") ? '\n' : line.slice(2);
      this.parseBodyComment(main[main.length - 1], comment);
      continue;
    case 'T':
      var time = parseInt(line.slice(1), 10);

      if(isNaN(time) === false &&
         main[main.length - 1].move) {
        main[main.length - 1].move.time = time;
      }

      continue;
    case '%':
      if(map.csaSpecialMove(line) !== null) {
        main.push({'special': line});
      }
      continue;
    default: continue;
    }
  }

  // 本筋の棋譜がない
  if(main.length === 1) {
    throw new Error('This file is invalid.');
  }

  return {'main': main};
};

CsaParser.prototype.turnToBoolean = function(turn) {
  return (turn === '+') ? true : false;
};

CsaParser.prototype.turnCheck = function(turn, mturn) {
  if(turn !== mturn) {
    throw new Error('turn symbol is invalid.');
  }

  return (turn === '+') ? '-' : '+';
};

CsaParser.prototype.parseMovePiece = function(piece) {
  return map.csaPiece(piece);
};

CsaParser.prototype.parseMoveLine = function(line) {
  // res[手番,移動前の位置,移動後の位置,移動後の駒種]
  return line.match(/^([+-])(\d{2})(\d{2})([A-Z]{2})$/);
};

CsaParser.prototype.parseMove = function(line) {
  var turn = '', to = [], from = [], piece = '',
      res = this.parseMoveLine(line);

  if(res === null) {
    throw new Error('move is syntax error.');
  }

  turn = res[1];
  from = [parseInt(res[2].charAt(0), 10), parseInt(res[2].charAt(1), 10)];
  to = [parseInt(res[3].charAt(0), 10), parseInt(res[3].charAt(1), 10)];
  piece = this.parseMovePiece(res[4]);

  if(piece === null) {
    throw new Error('move is syntax error.');
  }

  return {
    'turn': turn,
    'to': to,
    'from': from,
    'piece': piece
  };
};

CsaParser.prototype.eachSepComma = function(lines) {
  var res = [],
      line = '';

  for(var i = 0, l = lines.length; i< l; i++) {
    line = funcUtils.trim(lines[i]);

    switch(line.charAt(0)) {
    case '+': case '-': case 'T': case '%':
      var jlines = line.split(/,/);

      for(var j = 0, jl = jlines.length; j < jl; j++) {
        if(jlines[j] !== '') {
          res.push(jlines[j]);
        }
      }

      continue;
    default:
      res.push(lines[i]);
      continue;
    }
  }

  return res;
};

CsaParser.prototype.nextLine = function(lines) {
  var index = -1;

  return function nextLine() {
    var line = '';
    index += 1;
    line = lines[index];

    if(typeof line === 'undefined') {
      return null;
    }

    if(line.charAt(0) === '\'' &&
       line.charAt(1) !== '*') {
      index += 1;
    }

    // linesの最後が''*'から始まる場合はundefinedになるのでnullにして返す
    return lines[index] ? funcUtils.trim(lines[index]) : null;
  };
};

CsaParser.prototype.separatorSource = function(source) {
  // "/"で区切ってはじめの要素を返す
  return source.split(/(?:\n|\r)\/\r?(?:\n|\r)/, 1)[0];
};

CsaParser.prototype.splitSource = function(source) {
  // + or - で区切り、+や-はheaderとbodyに含める
  var headerReg = new RegExp('(' +
                             '^(?:[\\s\\S]+?' +
                             '\\r?(?:\\n|\\r))?' +
                             '(?:\\+|\\-)' +
                             ')' +
                             '\\r?(?:\\n|\\r)'),
      bodyReg = new RegExp('^(?:[\\s\\S]+?' +
                           '\\r?(?:\\n|\\r))?' +
                           '((?:\\+|\\-)\\r?(?:\\n|\\r)' +
                           '[\\s\\S]+)$');

  var header = source.match(headerReg),
      body = source.match(bodyReg);

  return (header !== null && body !== null) ? [header[1], body[1]] : null;

  // return source.match(/^(?:([\s\S]+?)?\r?(?:\n|\r))?((?:\+|\-)\r?(?:\n|\r)[\s\S]+)$/);
};

CsaParser.prototype.parse = function() {
  // セパレータ"/"があった場合にはじめの棋譜だけパース対象とする
  var res = this.separatorSource(this.source);

  res = this.splitSource(res);

  if(res === null) {
    throw new Error('This file is invalid.');
  }

  return {
    'header': this.parseHeader(res[0]),
    'body': this.parseBody(res[1])
  };
};

/* ---------- exports ---------- */
module.exports = CsaParser;
/* ---------- exports ---------- */
