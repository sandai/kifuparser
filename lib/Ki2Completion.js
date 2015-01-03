/* ---------- header ---------- */
"use strict";

var map = require('./map'),
    Board = require('./Board');
/* ---------- header ---------- */

function Ki2Completion(header, turn) {
  this.initialize.call(this, header, turn);
}

Ki2Completion.prototype.initialize = function(header, turn) {
  var handicap = 0,
      board = [];

  // headerがないなら平手でれっつごー
  if(header === null) {
    this.board = new Board(this.getInitPlacement(map.handicap('平手')), turn);
    return;
  }

  if(typeof header.handicap === 'undefined') {
    // 強制的に平手
    handicap = map.handicap('平手');
  } else {
    handicap = header.handicap;
  }

  // その他の上に開始局面がなければどうしようもないのでエラー
  if(handicap === map.handicap('その他') && typeof header.board === 'undefined') {
    throw new Error('Check the board and handicap in kifu.');
  }

  // 開始局面と手合割があった場合は開始局面を優先
  board = (typeof header.board !== 'undefined') ? header.board : this.getInitPlacement(handicap);

  // header.handsはあってもなくても渡す
  // いずれにしろundefinedかどうか向こうで処理すればいい
  this.board = new Board(board, turn, header.hands);
};

Ki2Completion.prototype.complementMove = function(move) {
  var obj = this.advanceBoard(move);

  move.from = obj.from;
  if(move.modifier === '成') {
    move.piece = obj.piece.getPiece();
  }

  return move;
};

Ki2Completion.prototype.advanceBoard = function(move) {
  var from = [],
      motionPiece = null,
      capturedPiece = null;

  // 動かす駒を検索
  motionPiece = this.board.findPiece(move);

  // わけわからん駒ならエラー
  if(motionPiece === null) {
    throw new Error('Have specified a piece that can not be used.');
  }

  this.board.setTurn(move.turn);

  // 指し手を保存
  this.board.saveMoveRecord(motionPiece, move);

  // 移動先に駒があれば取る
  capturedPiece = this.board.capturePiece(move.to[0], move.to[1]);

  // 駒の移動元座標を取得
  from = [motionPiece.getFile(), motionPiece.getRank()];
  // 駒を動かす
  this.board.movePiece(motionPiece, move.to[0], move.to[1]);

  // 成の場合は駒を成り駒にする
  if(move.modifier === '成') {
    this.board.promotePiece(motionPiece);
  }

  return {'from': from, 'piece': motionPiece};
};

Ki2Completion.prototype.recessionBoard = function(index) {
  this.board.restoreMoveRecord(index);
};

Ki2Completion.prototype.getLastMoveTurn = function() {
  return this.board.getTurn();
};
Ki2Completion.prototype.checkVariationNumber = function(num) {
  var record = this.board.getRecord();
  return (num <= record.length) ?  true : false;
};

Ki2Completion.prototype.getInitPlacement = function(key) {
  var p = map.initialPlacement(key);

  // 該当しなければ強制的に平手
  if(p === null) {
    return map.initialPlacement(map.handicap('平手'));
  }

  return p;
};

/* ---------- exports ---------- */
module.exports = Ki2Completion;
/* ---------- exports ---------- */
