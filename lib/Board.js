/* ---------- header ---------- */
"use strict";

var map = require('./map'),
    PieceList = require('./PieceList'),
    Piece = require('./Piece');
/* ---------- header ---------- */

function Board(board, turn, hands) {
  this.initialize.call(this, board, turn, hands);
}

Board.prototype.initialize = function(board, turn, hands) {
  /*
   this.boardPieces = [[歩のリスト], [香のリスト], [桂のリスト],....];
   という形で駒の種類をインデックスに駒を保持する仕組みになっている
   持ち駒も同じだがこちらは飛車までということ
   */
  this.boardPieces = new PieceList(map.piece('龍'));
  this.handPieces = new PieceList(map.piece('飛'));

  // 手番
  this.turn = turn;

  // 盤
  this.board = this.initializeBoard(board);

  // 持ち駒
  if(typeof hands !== 'undefined') {
    this.initializeHand(hands);
  }

  // 操作した手を記録するスタック
  this.record = [];
};

Board.prototype.initializeHand = function(hands) {
  // 持ち駒の実装を変えたので複雑になってるがまあいいや
  for(var key in hands) {
    for(var csapiece in hands[key]) {
      for(var i = 0, l = hands[key][csapiece]; i < l; i++) {
        this.handPieces.add(new Piece(map.csaPiece(csapiece), key, 0, 0));
      }
    }
  }
};

Board.prototype.initializeBoard = function(board) {
  // 関数内でthis.boardPiecesを利用しているので実行順に注意
  var piece = null,
      index = 0,
      b = [];

  for(var i = 1; i <= 9; i++) {
    b[i] = [];
  }

  // 将棋の座標と同じ形式で配列から読み出せる処理をしている
  for(i = 1; i <= 9; i++) {
    for(var j = 9; j >= 1; j--) {
      if(0 < board[index]) {
        piece = new Piece(board[index], 'black', j, i);
      } else if(0 > board[index]) {
        piece = new Piece(board[index] * -1, 'white', j, i);
      } else {
        // 駒無し
        piece = null;
      }

      if(piece !== null) {
        this.boardPieces.add(piece);
      }

      b[j][i] = piece;
      index += 1;
    }
  }
  return b;
};


Board.prototype.setTurn = function(turn) {
  this.turn = turn;
};

Board.prototype.getTurn = function() {
  return this.turn;
};

Board.prototype.getRecord = function() {
  return this.record;
};

Board.prototype.findPiece = function(move) {
  var i = 0, l = 0, piece = null, pieces = [];

  // 盤上の駒
  if(move.modifier !== '打') {
    pieces = this.boardPieces.getPieces(move.piece);

    for(i = 0, l = this.boardPieces.getPiecesCount(move.piece); i < l; i++) {
      piece = pieces[i];

      if(piece.getPlayer() === move.turn &&
         piece.matchMovement(move)) {
        if(!this.checkPowerOfMove(piece, move)) {
          return piece;
        }
      }
    }
  }

  // 打ち駒
  // 打のつかない打ち駒もここにくる
  pieces = this.handPieces.getPieces(move.piece);

  for(i = 0, l = this.handPieces.getPiecesCount(move.piece); i < l; i++) {
    piece = pieces[i];

    if(piece.getPlayer() === move.turn &&
       !this.checkPowerOfMove(piece, move)) {
      this.handPieces.remove(piece, i);
      this.boardPieces.add(piece);
      return piece;
    }
  }

  // ここまできたらわけわからん駒を指定している
  return null;
};

Board.prototype.capturePiece = function(file, rank) {
  var piece = this.board[file][rank];

  if(piece === null) {
    return null;
  }

  // 移動先の駒を削除
  this.boardPieces.remove(piece);
  // 駒のデータを駒台に変更
  piece.captured();
  // 移動先にある駒はhandPiecesに移動
  this.handPieces.add(piece);

  return piece;
};

Board.prototype.promotePiece = function(piece) {
  this.boardPieces.remove(piece);
  // 駒のデータを成り駒に変更
  piece.promote();
  // 成り駒は新しいリストに移動
  this.boardPieces.add(piece);
};

Board.prototype.movePiece = function(piece, file, rank) {
  // 打ち駒はなにもしない
  if(piece.getFile() !== 0 && piece.getRank() !== 0) {
    this.board[piece.getFile()][piece.getRank()] = null;
  }

  this.board[file][rank] = piece;

  // 駒のデータを更新
  piece.update({'file': file, 'rank': rank});
};

Board.prototype.checkPowerOfMove = function(piece, move) {
  var fbase = piece.getFile() - move.to[0],
      rbase = piece.getRank() - move.to[1],
      pieceDest = this.board[move.to[0]][move.to[1]];


  // 自分の駒とってどうすんねん
  if(pieceDest !== null && pieceDest.getPlayer() === move.turn) {
    return true;
  }

  // 桂馬はさいなら
  if(piece.getPiece() === map.piece('桂')) {
    return false;
  }

  // 打ち駒
  if(piece.getFile() === 0 && piece.getRank() === 0) {
    // 打った先に駒があるならだめーん
    if(pieceDest !== null) {
      return true;
    }

    return false;
  }

  // こまの移動先によってbaseを作る
  // ダサいなあこれ
  if(fbase > 0) {
    fbase = -1;
  } else if(fbase < 0) {
    fbase = 1;
  }
  if(rbase > 0) {
    rbase = -1;
  } else if(rbase < 0) {
    rbase = 1;
  }

  // baseをかけることでプラスかマイナスに
  for(var i = 1;
      !((piece.getFile() + (i * fbase)) === move.to[0] &&
        (piece.getRank() + (i * rbase)) === move.to[1]); i++ ) {
          if(this.board[piece.getFile() + (i * fbase)][piece.getRank() + (i * rbase)] !== null) {
            return true;
          }
        }

  return false;
};

Board.prototype.saveMoveRecord = function(movePiece, move) {
  var obj = {},
      capturePiece = this.board[move.to[0]][move.to[1]];

  obj.turn = move.turn;

  obj.movedPieceData = {
    'pieceObject': movePiece,
    'originPiece': movePiece.getPiece(),
    'originPosition': [movePiece.getFile(), movePiece.getRank()],
    'modifier': move.modifier
  };

  if(capturePiece !== null) {
    obj.capturedPieceData = {
      'pieceObject': capturePiece,
      'originPiece': capturePiece.getPiece(),
      'originPosition': [capturePiece.getFile(), capturePiece.getRank()],
      'player': capturePiece.getPlayer()
    };
  }

  this.record.push(obj);
};

Board.prototype.restoreDropPiece = function(data) {
  // 駒を打った座標をnullに
  this.board[data.pieceObject.getFile()][data.pieceObject.getRank()] = null;

  // handPiecesに戻す
  this.boardPieces.remove(data.pieceObject);
  this.handPieces.add(data.pieceObject);

  data.pieceObject.update({'file': 0, 'rank': 0});
};

Board.prototype.restoreMovedPiece = function(data) {
  // pieceを元の位置に戻す
  this.board[data.pieceObject.getFile()][data.pieceObject.getRank()] = null;
  this.board[data.originPosition[0]][data.originPosition[1]] = data.pieceObject;

  // 成り駒であればリストから削除
  if(data.modifier === '成') {
    this.boardPieces.remove(data.pieceObject);
  }

  // 駒を元の内容に戻す
  // this.boardPieces.addする前に駒の種類を更新するため下記よりこちらが先
  data.pieceObject.update({'piece': data.originPiece,
                           'file': data.originPosition[0],
                           'rank':data.originPosition[1]});

  // 成り駒であれば元のリストに追加
  if(data.modifier === '成') {
    this.boardPieces.add(data.pieceObject);
  }
};

Board.prototype.restoreCapturedPiece = function(data) {
  // 取られた駒を元の位置の戻す
  this.board[data.originPosition[0]][data.originPosition[1]] = data.pieceObject;

  this.handPieces.remove(data.pieceObject);

  // 駒を取られる前の情報に戻す
  // this.boardPieces.addする前に駒の種類を更新するため下記よりこちらが先
  data.pieceObject.update({'piece': data.originPiece,
                           'player': data.player,
                           'file': data.originPosition[0],
                           'rank':data.originPosition[1]});

  this.boardPieces.add(data.pieceObject);
};

Board.prototype.restoreMoveRecord = function(index) {
  var node = null;

  // スタック側が1つ多いので-1をする
  index -= 1;
  for(var l = this.record.length - 1; index <= l; l--) {
    node = this.record.pop();

    // 手番
    this.turn = node.turn;

    // 打駒
    if(node.movedPieceData.originPosition[0] === 0 &&
       node.movedPieceData.originPosition[1] === 0) {
      this.restoreDropPiece(node.movedPieceData);
      continue;
    }

    // 動かした駒
    this.restoreMovedPiece(node.movedPieceData);

    // 取った駒
    if(typeof node.capturedPieceData !== 'undefined') {
      this.restoreCapturedPiece(node.capturedPieceData);
    }
  }
};

/* ---------- exports ---------- */
module.exports = Board;
/* ---------- exports ---------- */
