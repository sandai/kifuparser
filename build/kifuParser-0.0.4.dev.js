/**
 * kifuParser.js v0.0.4
 *
 * Copyright (c) 2015 sandai <sandai310@gmail.com>
 * Released under the MIT license
 */

(function(global) {
"use strict";

var csaHandicapMap = {};
// 平手
csaHandicapMap['P1-KY-KE-GI-KI-OU-KI-GI-KE-KY'+
               'P2 * -HI *  *  *  *  * -KA *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 0;
// 香落ち
csaHandicapMap['P1-KY-KE-GI-KI-OU-KI-GI-KE *' +
               'P2 * -HI *  *  *  *  * -KA *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 1;
// 右香落ち
csaHandicapMap['P1 * -KE-GI-KI-OU-KI-GI-KE-KY' +
               'P2 * -HI *  *  *  *  * -KA *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 2;
// 角落ち
csaHandicapMap['P1-KY-KE-GI-KI-OU-KI-GI-KE-KY' +
               'P2 * -HI *  *  *  *  *  *  *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 3;
// 飛車落ち
csaHandicapMap['P1-KY-KE-GI-KI-OU-KI-GI-KE-KY' +
               'P2 *  *  *  *  *  *  * -KA *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 4;
// 飛香落ち
csaHandicapMap['P1-KY-KE-GI-KI-OU-KI-GI-KE *' +
               'P2 *  *  *  *  *  *  * -KA *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 5;
// 二枚落ち
csaHandicapMap['P1-KY-KE-GI-KI-OU-KI-GI-KE-KY' +
               'P2 *  *  *  *  *  *  *  *  *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 6;
// 四枚落ち
csaHandicapMap['P1 * -KE-GI-KI-OU-KI-GI-KE *' +
               'P2 *  *  *  *  *  *  *  *  *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 7;
// 五枚落ち
csaHandicapMap['P1 *  * -GI-KI-OU-KI-GI-KE *' +
               'P2 *  *  *  *  *  *  *  *  *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 8;
// 左五枚落ち
csaHandicapMap['P1 * -KE-GI-KI-OU-KI-GI *  *' +
               'P2 *  *  *  *  *  *  *  *  *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 9;
// 六枚落ち
csaHandicapMap['P1 *  * -GI-KI-OU-KI-GI *  *' +
               'P2 *  *  *  *  *  *  *  *  *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 10;
// 八枚落ち
csaHandicapMap['P1 *  *  * -KI-OU-KI *  *  *' +
               'P2 *  *  *  *  *  *  *  *  *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 11;
// 十枚落ち
csaHandicapMap['P1 *  *  *  * -OU *  *  *  *' +
               'P2 *  *  *  *  *  *  *  *  *' +
               'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 12;
// 玉一枚
csaHandicapMap['P1 *  *  *  * -OU *  *  *  *' +
               'P2 *  *  *  *  *  *  *  *  *' +
               'P3 *  *  *  *  *  *  *  *  *' +
               'P4 *  *  *  *  *  *  *  *  *' +
               'P5 *  *  *  *  *  *  *  *  *' +
               'P6 *  *  *  *  *  *  *  *  *' +
               'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
               'P8 * +KA *  *  *  *  * +HI *' +
               'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'] = 13;
csaHandicapMap['その他'] = 14;

var csaHeaderMap = {
  '$START_TIME' : 'start',
  '$END_TIME'   : 'end',
  '$EVENT'      : 'event',
  '$OPENING'    : 'opening',
  '$TIME_LIMIT' : 'limit',
  '$SITE'       : 'site'
};

var csaPieceMap = {
  /* 0は駒無し */
  'FU' : 1,
  'KY' : 2,
  'KE' : 3,
  'GI' : 4,
  'KI' : 5,
  'KA' : 6,
  'HI' : 7,
  'OU' : 8,
  'TO' : 9,
  'NY' : 10,
  'NK' : 11,
  'NG' : 12,
  'UM' : 13,
  'RY' : 14
};

var csaSpecialMoveMap = {
  '%TORYO'        : '%TORYO',
  '%TSUMI'        : '%TSUMI',
  '%SENNICHITE'   : '%SENNICHITE',
  '%CHUDAN'       : '%CHUDAN',
  '%JISHOGI'      : '%JISHOGI',
  '%ILLEGAL_MOVE' : '%ILLEGAL_MOVE'
};

var formatMap = {
  'kif': 'Kif',
  'Kif': 'Kif',
  'KIF': 'Kif',

  'ki2': 'Ki2',
  'Ki2': 'Ki2',
  'KI2': 'Ki2',

  'csa': 'Csa',
  'Csa': 'Csa',
  'CSA': 'Csa',

  'noformat' : 'noformat'
};

var handicapMap = {
  '平手'       : 0,
  '香落ち'     : 1,
  '右香落ち'   : 2,
  '角落ち'     : 3,
  '飛車落ち'   : 4,
  '飛香落ち'   : 5,
  '二枚落ち'   : 6,
  '四枚落ち'   : 7,
  '五枚落ち'   : 8,
  '左五枚落ち' : 9,
  '六枚落ち'   : 10,
  '八枚落ち'   : 11,
  '十枚落ち'   : 12,
  '玉一枚'     : 13,
  'その他'     : 14
};

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

// 初期配置のboardを返すためのものなので"その他"はいらない
var initialPlacementMap = [
  /* 平手 */
  [-2,-3,-4,-5,-8,-5,-4,-3,-2,
   0,-7, 0, 0, 0, 0, 0,-6, 0,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   1, 1, 1, 1, 1, 1, 1, 1, 1,
   0, 6, 0, 0, 0, 0, 0, 7, 0,
   2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 香落ち */
  [-2,-3,-4,-5,-8,-5,-4,-3, 0,
   0,-7, 0, 0, 0, 0, 0,-6, 0,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   1, 1, 1, 1, 1, 1, 1, 1, 1,
   0, 6, 0, 0, 0, 0, 0, 7, 0,
   2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 右香落ち */
  [ 0,-3,-4,-5,-8,-5,-4,-3,-2,
    0,-7, 0, 0, 0, 0, 0,-6, 0,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 6, 0, 0, 0, 0, 0, 7, 0,
    2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 角落ち */
  [-2,-3,-4,-5,-8,-5,-4,-3,-2,
   0,-7, 0, 0, 0, 0, 0, 0, 0,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   1, 1, 1, 1, 1, 1, 1, 1, 1,
   0, 6, 0, 0, 0, 0, 0, 7, 0,
   2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 飛車落ち */
  [-2,-3,-4,-5,-8,-5,-4,-3,-2,
   0, 0, 0, 0, 0, 0, 0,-6, 0,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   1, 1, 1, 1, 1, 1, 1, 1, 1,
   0, 6, 0, 0, 0, 0, 0, 7, 0,
   2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 飛香落ち */
  [-2,-3,-4,-5,-8,-5,-4,-3, 0,
   0, 0, 0, 0, 0, 0, 0,-6, 0,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   1, 1, 1, 1, 1, 1, 1, 1, 1,
   0, 6, 0, 0, 0, 0, 0, 7, 0,
   2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 二枚落ち */
  [-2,-3,-4,-5,-8,-5,-4,-3,-2,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
   1, 1, 1, 1, 1, 1, 1, 1, 1,
   0, 6, 0, 0, 0, 0, 0, 7, 0,
   2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 四枚落ち */
  [ 0,-3,-4,-5,-8,-5,-4,-3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 6, 0, 0, 0, 0, 0, 7, 0,
    2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 五枚落ち */
  [ 0, 0,-4,-5,-8,-5,-4,-3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 6, 0, 0, 0, 0, 0, 7, 0,
    2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 左五枚落ち */
  [ 0,-3,-4,-5,-8,-5,-4, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 6, 0, 0, 0, 0, 0, 7, 0,
    2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 六枚落ち */
  [ 0, 0,-4,-5,-8,-5,-4, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 6, 0, 0, 0, 0, 0, 7, 0,
    2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 八枚落ち */
  [ 0, 0, 0,-5,-8,-5, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 6, 0, 0, 0, 0, 0, 7, 0,
    2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 十枚落ち */
  [ 0, 0, 0, 0,-8, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 6, 0, 0, 0, 0, 0, 7, 0,
    2, 3, 4, 5, 8, 5, 4, 3, 2
  ],
  /* 玉一枚 */
  [ 0, 0, 0, 0,-8, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 6, 0, 0, 0, 0, 0, 7, 0,
    2, 3, 4, 5, 8, 5, 4, 3, 2
  ]
];

var kansujiMap = {
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
  '七': 7,
  '八': 8,
  '九': 9,
  '十': 10
};

var pieceMap = {
  /* 0は駒無しお前は玉なし */
  '歩'   : 1,
  '香'   : 2,
  '桂'   : 3,
  '銀'   : 4,
  '金'   : 5,
  '角'   : 6,
  '飛'   : 7,
  '王'   : 8,
  '玉'   : 8,
  'と'   : 9,
  '成香' : 10,
  '杏'   : 10,
  '成桂' : 11,
  '圭'   : 11,
  '成銀' : 12,
  '全'   : 12,
  '馬'   : 13,
  '龍'   : 14
};

var promotedPieceMap = {
  '歩成': 9,
  '香成': 10,
  '桂成': 11,
  '銀成': 12,
  '角成': 13,
  '飛成': 14
};

var resultMap = {
  '先手勝ち' : 0,
  '後手勝ち' : 1,
  '持将棋'   : 2,
  '千日手'   : 3,
  '反則負け' : 4,
  '中断'     : 5,
  '下手勝ち' : 6,
  '上手勝ち' : 7,
  'その他'   : 8
};

var specialMoveMap = {
  '投了'     : '%TORYO',
  '詰み'     : '%TSUMI',
  '千日手'   : '%SENNICHITE',
  '中断'     : '%CHUDAN',
  '持将棋'   : '%JISHOGI',
  '反則負け' : '%ILLEGAL_MOVE'
};

var zenkakuNumberMap = {
  '１': 1,
  '２': 2,
  '３': 3,
  '４': 4,
  '５': 5,
  '６': 6,
  '７': 7,
  '８': 8,
  '９': 9
};

var map = {
  handicap: function(key) {
    return (typeof handicapMap[key] !== 'undefined') ?
      handicapMap[key] : handicapMap['その他'];
  },
  csaHandicap: function(key) {
    return (typeof csaHandicapMap[key] !== 'undefined') ?
      csaHandicapMap[key] : csaHandicapMap['その他'];
  },
  initialPlacement: function(key) {
    return (typeof initialPlacementMap[key] !== 'undefined') ?
      initialPlacementMap[key] : null;
  },
  // result: function(key) {
  //     return (typeof resultMap[key] !== 'undefined') ?
  //         resultMap[key] : 'その他';
  // },
  specialMove: function(key) {
    return (typeof specialMoveMap[key] !== 'undefined') ?
      specialMoveMap[key] : null;
  },
  csaSpecialMove: function(key) {
    return (typeof csaSpecialMoveMap[key] !== 'undefined') ?
      csaSpecialMoveMap[key] : null;
  },
  format: function(key) {
    return (typeof formatMap[key] !== 'undefined') ?
      formatMap[key] : null;
  },
  piece: function(key) {
    return (typeof pieceMap[key] !== 'undefined') ?
      pieceMap[key] : null;
  },
  promotedPiece: function(key) {
    return (typeof promotedPieceMap[key] !== 'undefined') ?
      promotedPieceMap[key] : null;
  },
  csaPiece: function(key) {
    return (typeof csaPieceMap[key] !== 'undefined') ?
      csaPieceMap[key] : null;
  },
  zenkakNumber: function(key) {
    return (typeof zenkakuNumberMap[key] !== 'undefined') ?
      zenkakuNumberMap[key] : null;
  },
  kansuji: function(key) {
    return (typeof kansujiMap[key] !== 'undefined') ?
      kansujiMap[key] : null;
  },
  header: function(key) {
    return (typeof headerMap[key] !== 'undefined') ?
      headerMap[key] : null;
  },
  csaHeader: function(key) {
    return (typeof csaHeaderMap[key] !== 'undefined') ?
      csaHeaderMap[key] : null;
  },
  /* element => prop */
  pieceToPieceMapKey: function(piece) {
    for(var key in pieceMap) {
      if(pieceMap[key] === piece) {
        return key;
      }
    }

    return null;
  },
  pieceToCsaPieceMapKey: function(piece) {
    for(var key in csaPieceMap) {
      if(csaPieceMap[key] === piece) {
        return key;
      }
    }

    return null;
  }
};

// util.inheritsは使わない
function inherits(c, p) {
  function F () {}
  F.prototype = p.prototype;
  c.prototype = new F();
  c.prototype.constructor = c;
}

var trim = (function() {
  return (!String.prototype.trim) ?
    function(str) { return str.replace(/^[\s　]+|[\s　]+$/g,''); } :
  function(str) { return String.prototype.trim.call(str); };
})();

function toLines(source) {
  var res = [],
      lines = source.split(/\r?(?:\n|\r)/);

  for (var i = 0, l = lines.length; i < l; i++) {
    if (lines[i] !== '') {
      res.push(lines[i]);
    }

  }

  return res;
}

function validateDate(value) {
  // ひと通りの形式は問題ないはず
  // yyyy/mm/dd
  // yyyy/mm/dd hh:mm
  // yyyy/mm/dd hh:mm:ss

  var reg = new RegExp('^(?:[0-9]{4})\\/' +
                       '(?:(0?2)\\/([12][0-9]|0?[1-9])' +
                       '|' +
                       '(0?[469]|11)\\/(30|[12][0-9]|0?[1-9])' +
                       '|' +
                       '(0?[13578]|1[02])\\/(3[01]|[12][0-9]|0?[1-9]))' +
                       '(?:$|[\\s　]+(?:2[0-3]|[01][0-9]):(?:[0-5][0-9])(?:$|:(?:[0-5][0-9])$))');

  return reg.test(value);
}

function isEmptyObject(obj) {
  var name;
	for (name in obj ) {
    if(typeof name !== 'undefined') {
      return false;
    }
  }
	return true;
}

// https://github.com/douglascrockford/JSON-js
var jsonStringify = (function() {
  var escapable,
      gap,
      indent,
      meta,
      rep;

  escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  meta = {    // table of character substitutions
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"' : '\\"',
    '\\': '\\\\'
  };

  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
      var c = meta[a];
      return typeof c === 'string' ?
        c :
        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }

  function str(key, holder) {
    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];

    if (value && typeof value === 'object' &&
        typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }

    switch (typeof value) {
    case 'string':
      return quote(value);
    case 'number':
      return isFinite(value) ? String(value) : 'null';
    case 'boolean':
    case 'null':
      return String(value);
    case 'object':
      if (!value) {
        return 'null';
      }

      gap += indent;
      partial = [];

      if (Object.prototype.toString.apply(value) === '[object Array]') {
        length = value.length;
        for (i = 0; i < length; i += 1) {
          partial[i] = str(i, value) || 'null';
        }

        v = partial.length === 0 ?
          '[]' :
          gap ?
          '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
          '[' + partial.join(',') + ']';
        gap = mind;
        return v;
      }

      if (rep && typeof rep === 'object') {
        length = rep.length;
        for (i = 0; i < length; i += 1) {
          k = rep[i];
          if (typeof k === 'string') {
            v = str(k, value);
            if (v) {
              partial.push(quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        }
      } else {
        for (k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
            v = str(k, value);
            if (v) {
              partial.push(quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        }
      }

      v = partial.length === 0 ?
        '{}' :
        gap ?
        '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
        '{' + partial.join(',') + '}';
      gap = mind;
      return v;
    default:break;
    }
  }

  // JSON.stringifyがあればそちらを使う
  return (typeof JSON.stringify === 'function') ?
    JSON.stringify :
    function (value, replacer, space) {
      var i;
      gap = '';
      indent = '';

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }
      } else if (typeof space === 'string') {
        indent = space;
      }

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
          (typeof replacer !== 'object' ||
           typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }

      return str('', {'': value});
    };
})();

var functionUtils = {
  'inherits': inherits,
  'trim': trim,
  'toLines': toLines,
  'validateDate': validateDate,
  'isEmptyObject': isEmptyObject,
  'jsonStringify': jsonStringify
};

/*
 パースした棋譜情報と棋譜をまとめてオブジェクトにする
 this.header.handicapとthis.header.movesがなければここで強制的に追加される
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
  this.kifu.header = this.buildHeader();
  this.kifu.sources = this.buildBody();
};

KifuBuilder.prototype.buildHeader = function() {
  // handicapがなければ強制的に平手
  if(typeof this.header.handicap === 'undefined') {
    this.addHandicapToHeader(map.handicap('平手'));
  }

  // 変化のある棋譜でも本筋(this.body.main)がmovesに入る
  if(typeof this.header.moves === 'undefined') {
    this.addMovesToHeader();
  }

  // 手番がなければ強制的に先手: 先手はtrue
  if(typeof this.header.turn === 'undefined') {
    this.addTurnToHeader();
  }

  return this.header;
};

KifuBuilder.prototype.addTurnToHeader = function() {
  this.header.turn = true;
};

KifuBuilder.prototype.addHandicapToHeader = function(handicap) {
  this.header.handicap = handicap;
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
        'move': {
          'turn': this.turnToBoolean(move.turn),
          'to': move.to,
          'from': move.from,
          'piece': move.piece
        },
        'time': 0});
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

      // かならずtimeはつける。実際の時間はcase 'T':でつけられる
      main.push({
        'move': {
          'turn': this.turnToBoolean(move.turn),
          'to': move.to,
          'from': move.from,
          'piece': move.piece
        },
        'time': 0});
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
         main[main.length - 1].time !== undefined) {
        main[main.length - 1].time = time;
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
    throw new Error('KifuParser(source <-I need it yesterday!, format, json)');
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

if ("process" in global) {
  module["exports"] = kifuParser;
}

global["kifuParser" in global ? "kifuParser_" : "kifuParser"] = kifuParser;


})((this || 0).self || global);
