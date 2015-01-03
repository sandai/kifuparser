/* ---------- header ---------- */
"use strict";
/* ---------- header ---------- */

function PieceList(num) {
  this.initialize.call(this, num);
}

PieceList.prototype.initialize = function(num) {
  this.list = [];

  for(var i = 0; i <= num; i++) {
    this.list[i] = [];
  }
};

PieceList.prototype.add = function(piece) {
  this.list[piece.getPiece()].push(piece);
};

PieceList.prototype.remove = function(piece, pieceIndex) {
  if(typeof pieceIndex === 'undefined') {
    pieceIndex = this.getPieceIndex(piece);

    if(pieceIndex === -1) {
      throw new Error('[PieceList.prototype.remove] Internal error.');
    }
  }

  this.list[piece.getPiece()].splice(pieceIndex, 1);
};

PieceList.prototype.getPieces = function(listIndex) {
  return this.list[listIndex];
};

PieceList.prototype.getPiecesCount = function(listIndex) {
  return this.list[listIndex].length;
};

PieceList.prototype.getPieceIndex = function(piece) {
  var p = this.getPieces(piece.getPiece());

  for(var i = 0, l = this.getPiecesCount(piece.getPiece()); i < l; i++) {
    if(piece === p[i]) {
      return i;
    }
  }

  // なければ-1
  return -1;
};

/* ---------- exports ---------- */
module.exports = PieceList;
/* ---------- exports ---------- */
