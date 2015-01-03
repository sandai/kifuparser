/* ---------- header ---------- */
"use strict";
/* ---------- header ---------- */

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

/* ---------- exports ---------- */
module.exports = csaHandicapMap;
/* ---------- exports ---------- */
