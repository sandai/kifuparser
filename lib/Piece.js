/* ---------- header ---------- */
"use strict";

var map = require('./map');
/* ---------- header ---------- */

function Piece(piece, player, file, rank) {
  this.piece = piece;
  this.player = player;
  this.file = file;
  this.rank = rank;
}

Piece.prototype.getPiece = function() {
  return this.piece;
};

Piece.prototype.getFile = function() {
  return this.file;
};

Piece.prototype.getRank = function() {
  return this.rank;
};

Piece.prototype.getPlayer = function() {
  return this.player;
};

Piece.prototype.update = function(args) {
  if(typeof args.piece !== 'undefined') { this.piece =args.piece; }
  if(typeof args.player !== 'undefined') { this.player =args.player; }
  if(typeof args.file !== 'undefined') { this.file =args.file; }
  if(typeof args.rank !== 'undefined') { this.rank =args.rank; }
};

Piece.prototype.promote = function() {
  this.piece = map.promotedPiece(map.pieceToPieceMapKey(this.piece) + '成');
};

Piece.prototype.demote = function() {
  // 微妙だがこれでいいや
  switch(this.piece) {
  case map.piece('と'):
    this.piece = map.piece('歩');
    break;
  case map.piece('成香'):
    this.piece = map.piece('香');
    break;
  case map.piece('成桂'):
    this.piece = map.piece('桂');
    break;
  case map.piece('成銀'):
    this.piece = map.piece('銀');
    break;
  case map.piece('馬'):
    this.piece = map.piece('角');
    break;
  case map.piece('龍'):
    this.piece = map.piece('飛');
    break;
  default: break;
  }
};

Piece.prototype.captured = function() {
  this.player = (this.player === 'black') ? 'white' : 'black';
  this.file = 0;
  this.rank = 0;

  this.demote();
};

Piece.prototype.matchMovement = function(move) {
  return this['case' + map.pieceToCsaPieceMapKey(move.piece)](move);
};

Piece.prototype.checkRelative = function(move, dfile) {
  var base = 0;

  // baseは条件によって1, -1, 0のいずれかの値になる
  if((move.piece === map.piece('馬') ||
      move.piece === map.piece('龍'))) {
    // 馬か龍のうち、後手+右と先手+左の組み合わせは-1、そうでなければ1
    if((move.relative === '右' && this.player === 'white') ||
       (move.relative === '左' && this.player === 'black')) {
      base = -1;
    } else {
      base = 1;
    }
  }

  switch(move.relative) {
  case '右':
    if(this.player === 'black') {
      // 0以上がだめ
      // 1以上がだめ
      if(dfile >= base) { return false; }
    } else {
      // 0以下がだめ
      // -1以下がだめ
      if(dfile <= base) { return false; }
    }
    break;
  case '左':
    if(this.player === 'black') {
      // 0以下がだめ
      // -1以下がだめ
      if(dfile <= base) { return false; }
    } else {
      // 0以上がだめ
      // 1以上がだめ
      if(dfile >= base) { return false; }
    }
    break;
  case '直':
    if(dfile !== 0) { return false; }
    break;
  default: break;
  }

  return true;
};

Piece.prototype.checkMotion = function(move, drank) {
  switch(move.motion) {
  case '上':
    if(this.player === 'black') {
      if(drank <= 0) { return false; }
    } else {
      if(drank >= 0) { return false; }
    }
    break;
  case '引':
    if(this.player === 'black') {
      if(drank >= 0) { return false; }
    } else {
      if(drank <= 0) { return false; }
    }
    break;
  case '寄':
    if(drank !== 0) { return false; }
    break;
  default: break;
  }

  return true;
};

// 前
Piece.prototype.checkDestForward = function(file, rank) {
  var m = (this.player === 'black') ? -1 : 1;

  if(this.file === file && this.rank + m === rank) {
    return true;
  }

  return false;
};

// 後
Piece.prototype.checkDestBackward = function(file, rank) {
  var m = (this.player === 'black') ? 1 : -1;

  if(this.file === file && this.rank + m === rank) {
    return true;
  }

  return false;
};

// 左上
Piece.prototype.checkDestUpperLeft = function(file, rank) {
  var fm = (this.player === 'black') ? 1 : -1,
      rm = (this.player === 'black') ? -1 : 1;

  if(this.file + fm === file && this.rank + rm === rank) {
    return true;
  }

  return false;
};

// 左
Piece.prototype.checkDestLeft = function(file, rank) {
  var m = (this.player === 'black') ? 1 : -1;

  if(this.file + m === file && this.rank === rank) {
    return true;
  }
  return false;
};

// 左下
Piece.prototype.checkDestBottomLeft = function(file, rank) {
  var fm = (this.player === 'black') ? 1 : -1,
      rm = (this.player === 'black') ? 1 : -1;

  if(this.file + fm === file && this.rank + rm === rank) {
    return true;
  }

  return false;
};

// 右上
Piece.prototype.checkDestUpperRight = function(file, rank) {
  var fm = (this.player === 'black') ? -1 : 1,
      rm = (this.player === 'black') ? -1 : 1;

  if(this.file + fm === file && this.rank + rm === rank) {
    return true;
  }

  return false;
};

// 右
Piece.prototype.checkDestRight = function(file, rank) {
  var m = (this.player === 'black') ? -1 : 1;

  if(this.file + m  === file && this.rank === rank) {
    return true;
  }
  return false;
};

// 右下
Piece.prototype.checkDestBottomRight = function(file, rank) {
  var fm = (this.player === 'black') ? -1 : 1,
      rm = (this.player === 'black') ? 1 : -1;

  if(this.file + fm === file && this.rank + rm === rank) {
    return true;
  }

  return false;
};

// 直線
Piece.prototype.checkDestDirectly = function(file, rank) {
  var l = (this.player === 'black') ? this.rank : 10 - this.rank;

  for(var i = 1; --l; i++) {
    if(this.file === file &&
       this.rank + ((this.player === 'black') ? -i : i) === rank) {
      return true;
    }
  }

  return false;
};

// 斜め
Piece.prototype.checkDestDiagonal = function(file, rank) {
  var pfile = 0, prank = 0;

  // 左上
  pfile = this.file + 1;
  prank = this.rank - 1;
  for(; pfile <= 9 && prank >= 1; pfile++, prank--) {
    if(pfile === file && prank === rank) {
      return true;
    }
  }

  // 左下
  pfile = this.file + 1;
  prank = this.rank + 1;
  for(; pfile <= 9 && prank <= 9; pfile++, prank++) {
    if(pfile === file && prank === rank) {
      return true;
    }
  }

  // 右上
  pfile = this.file - 1;
  prank = this.rank - 1;
  for(; pfile >= 1 && prank >= 1; pfile--, prank--) {
    if(pfile === file && prank === rank) {
      return true;
    }
  }

  // 右下
  pfile = this.file - 1;
  prank = this.rank + 1;
  for(; pfile >= 1 && prank <= 9; pfile--, prank++) {
    if(pfile === file && prank === rank) {
      return true;
    }
  }

  return false;
};

// 縦横
Piece.prototype.checkDestOrthogonal = function(file, rank) {
  var pfile = 0, prank = 0;

  // 左
  pfile = this.file + 1;
  for(; pfile <= 9; pfile++) {
    if(pfile === file && this.rank === rank) {
      return true;
    }
  }

  // 上
  prank = this.rank - 1;
  for(; prank >= 1; prank--) {
    if(this.file === file && prank === rank) {
      return true;
    }
  }

  // 右
  pfile = this.file - 1;
  for(; pfile >= 1; pfile--) {
    if(pfile === file && this.rank === rank) {
      return true;
    }
  }

  // 下
  prank = this.rank + 1;
  for(; prank <= 9; prank++) {
    if(this.file === file && prank === rank) {
      return true;
    }
  }

  return false;
};

Piece.prototype.caseFU = function(move) {
  return (this.checkDestForward(move.to[0], move.to[1])) ? true : false;
};

Piece.prototype.caseKY = function(move) {
  return (this.checkDestDirectly(move.to[0], move.to[1])) ? true : false;
};

Piece.prototype.caseKE = function(move) {
  var dfile = this.file - move.to[0];

  if(!this.checkRelative(move, dfile)) {
    return false;
  }

  // relativeが無いのであればpieceのfileだけ確認
  // どっちかであれば問題ない
  if(!(dfile === 1 || dfile === -1)) {
    return false;
  }

  return ((this.rank + ((this.player === 'black') ? -2 : 2)) === move.to[1]) ? true : false;
};

Piece.prototype.caseGI = function(move) {
  var dfile = this.file - move.to[0],
      drank = this.rank - move.to[1];

  if(!this.checkRelative(move, dfile)) { return false; }
  if(!this.checkMotion(move, drank)) { return false; }

  if(this.checkDestUpperLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBottomLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestUpperRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBottomRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestForward(move.to[0], move.to[1])) { return true; }

  return false;
};

Piece.prototype.caseKI = function(move) {
  var dfile = this.file - move.to[0],
      drank = this.rank - move.to[1];

  if(!this.checkRelative(move, dfile)) { return false; }
  if(!this.checkMotion(move, drank)) { return false; }

  if(this.checkDestUpperLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestUpperRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestForward(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBackward(move.to[0], move.to[1])) { return true; }

  return false;
};

Piece.prototype.caseKA = function(move) {
  var dfile = this.file - move.to[0],
      drank = this.rank - move.to[1];

  if(!this.checkRelative(move, dfile)) { return false; }
  if(!this.checkMotion(move, drank)) { return false; }

  return (this.checkDestDiagonal(move.to[0], move.to[1])) ? true : false;

};

Piece.prototype.caseHI = function(move) {
  var dfile = this.file - move.to[0],
      drank = this.rank - move.to[1];

  if(!this.checkRelative(move, dfile)) { return false; }
  if(!this.checkMotion(move, drank)) { return false; }

  return (this.checkDestOrthogonal(move.to[0], move.to[1])) ? true : false;
};

Piece.prototype.caseOU = function(move) {
  if(this.checkDestUpperLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBottomLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestUpperRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBottomRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestForward(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBackward(move.to[0], move.to[1])) { return true; }

  return false;

};

Piece.prototype.caseTO = function(move) {
  return this.caseKI(move);
};

Piece.prototype.caseNY = function(move) {
  return this.caseKI(move);
};

Piece.prototype.caseNK = function(move) {
  return this.caseKI(move);
};

Piece.prototype.caseNG = function(move) {
  return this.caseKI(move);
};

Piece.prototype.caseUM = function(move) {
  var dfile = this.file - move.to[0],
      drank = this.rank - move.to[1];

  if(!this.checkRelative(move, dfile)) { return false; }
  if(!this.checkMotion(move, drank)) { return false; }

  if(this.checkDestUpperLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBottomLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestUpperRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBottomRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestForward(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBackward(move.to[0], move.to[1])) { return true; }
  if(this.checkDestDiagonal(move.to[0], move.to[1])) { return true; }

  return false;
};

Piece.prototype.caseRY = function(move) {
  var dfile = this.file - move.to[0],
      drank = this.rank - move.to[1];

  if(!this.checkRelative(move, dfile)) { return false; }
  if(!this.checkMotion(move, drank)) { return false; }

  if(this.checkDestUpperLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBottomLeft(move.to[0], move.to[1])) { return true; }
  if(this.checkDestUpperRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBottomRight(move.to[0], move.to[1])) { return true; }
  if(this.checkDestForward(move.to[0], move.to[1])) { return true; }
  if(this.checkDestBackward(move.to[0], move.to[1])) { return true; }
  if(this.checkDestOrthogonal(move.to[0], move.to[1])){ return true; }

  return  false;
};

/* ---------- exports ---------- */
module.exports = Piece;
/* ---------- exports ---------- */
