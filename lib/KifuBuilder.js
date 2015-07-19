/* ---------- header ---------- */
"use strict";

var funcUtils = require('./functionUtils'),
    map = require('./map');
/* ---------- header ---------- */

/*
 パースした棋譜情報と棋譜をまとめてオブジェクトにする

 headerには必ずhandicap、movesが挿入され、turn,board,handsがあれば削除される
 initialには必ずturnが挿入され、あればboardとhandsも挿入される

 変化があれば本筋の棋譜と合わせて構造化される
 */
function KifuBuilder(obj) {
  this.kifu = {};
  // obj.headerがnullであれば{}を代入
  this.header = obj.header || {};
  // bodyは各xxx.parseからbody.mainとbody.variationsを受けとっている
  this.body = obj.body;
}

KifuBuilder.createMainObject = function() {
  // 最初のオブジェクトは0手目を表す
  return [{}];
};

KifuBuilder.createVariationsObject = function() {
  return [];
};

KifuBuilder.createHeaderObject = function() {
  return {};
};

KifuBuilder.prototype.getKifuObject = function() {
  return this.kifu;
};

KifuBuilder.prototype.getKifuJSON = function() {
  return funcUtils.jsonStringify(this.kifu);
};

KifuBuilder.prototype.build = function() {
  var initial = this.buildInitial(),
      header = this.buildHeader(),
      sources = this.buildBody();

  this.kifu  = {
    'header': header,
    'initial': initial,
    'sources': sources
  };
};

KifuBuilder.prototype.buildInitial = function() {
  var initial = {};

  // 手番がなければ強制的に先手: 先手はtrue
  if(typeof this.header.turn === 'undefined') {
    initial.turn = true;
  } else {
    // 手番があればコピーして削除
    initial.turn = this.header.turn;
    delete this.header.turn;
  }

  // boardがあればコピーして削除
  if(typeof this.header.board  !== 'undefined') {
    initial.board = this.header.board;
    delete this.header.board;
  }

  // handsがあればコピーして削除
  if(typeof this.header.hands !== 'undefined') {
    initial.hands = this.header.hands;
    delete this.header.hands;
  }

  return initial;
};

KifuBuilder.prototype.buildHeader = function() {
  // handicapがなければ強制的に平手
  if(typeof this.header.handicap === 'undefined') {
    this.header.handicap = map.handicap('平手');
  }

  // 変化のある棋譜でも本筋(this.body.main)がmovesに入る
  if(typeof this.header.moves === 'undefined') {
    this.addMovesToHeader();
  }

  return this.header;
};

KifuBuilder.prototype.addMovesToHeader = function() {
  var count = this.body.main.length - 1;

  // 最終手がある場合はそれも除くので-1をする
  if(typeof this.body.main[count].special !== 'undefined') {
    count -= 1;
  }

  this.header.moves = count;
};

KifuBuilder.prototype.addVariation = function(obj, variation) {
  if(typeof obj.variations !== 'undefined') {
    obj.variations.push(variation);
  } else {
    obj.variations = [variation];
  }
};

KifuBuilder.prototype.getVariationMove = function(stack, moves) {
  var node = stack[stack.length - 1],
      margin = moves - node[0];

  while(margin <= 0) {
    stack.pop();
    node = stack[stack.length - 1];
    margin = moves - node[0];
  }

  return node[1][margin];
};

KifuBuilder.prototype.buildBody = function() {
  var stack = [],
      main = this.body.main,
      variations = this.body.variations || null,
      move = {};

  stack.push([0, main]);

  if(variations !== null) {
    for(var i = 0, l = variations.length; i < l; i++) {
      move = this.getVariationMove(stack, variations[i][0]);
      this.addVariation(move, variations[i][1]);
      stack.push([variations[i][0], variations[i][1]]);
    }
  }

  return main;
};

/* ---------- exports ---------- */
module.exports =KifuBuilder;
/* ---------- exports ---------- */
