/* ---------- header ---------- */
"use strict";
/* ---------- header ---------- */

var headerMap = {
  '開始日時'   : 'start',
  '終了日時'   : 'end',
  '表題'       : 'title',
  '棋戦'       : 'event',
  '戦型'       : 'opening',
  '先手戦術'   : 'tactics_black',
  '後手戦術'   : 'tactics_white',
  '持ち時間'   : 'limit',
  '消費時間'   : 'used',
  '場所'       : 'site',
  '手合割'     : 'handicap',
  /* 盤面下をblack, 上をwhiteとしている */
  '先手'       : 'player_black',
  '下手'       : 'player_black',
  '後手'       : 'player_white',
  '上手'       : 'player_white',
  /* 初期盤面の最初の文字は９ */
  '９'         : 'board',
  '先手の持駒' : 'hand_black',
  '下手の持駒' : 'hand_black',
  '上手の持駒' : 'hand_white',
  '後手の持駒' : 'hand_white',
  /* 後手番で始まる場合にこの文字列がつく */
  '後手番'     : 'turn'
};

/* ---------- exports ---------- */
module.exports = headerMap;
/* ---------- exports ---------- */
