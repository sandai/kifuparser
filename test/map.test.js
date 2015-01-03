"use strict";

var map = require('../lib/map');

describe('map.js', function() {
  describe('keyに対応する値を返す', function() {
    it('handicap(key)', function() {
      var ref = map.handicap;

      expect(ref('平手')).toEqual(0);
      expect(ref('香落ち')).toEqual(1);
      expect(ref('右香落ち')).toEqual(2);
      expect(ref('角落ち')).toEqual(3);
      expect(ref('飛車落ち')).toEqual(4);
      expect(ref('飛香落ち')).toEqual(5);
      expect(ref('二枚落ち')).toEqual(6);
      expect(ref('四枚落ち')).toEqual(7);
      expect(ref('五枚落ち')).toEqual(8);
      expect(ref('左五枚落ち')).toEqual(9);
      expect(ref('六枚落ち')).toEqual(10);
      expect(ref('八枚落ち')).toEqual(11);
      expect(ref('十枚落ち')).toEqual(12);
      expect(ref('玉一枚')).toEqual(13);
      expect(ref('その他')).toEqual(14);
      expect(ref('てきとう')).toEqual(14);
    });
    it('csaHandicap(key)', function() {
      var ref = map.csaHandicap,
          refr = map.handicap;

      expect(ref('P1-KY-KE-GI-KI-OU-KI-GI-KE-KY' +
                 'P2 * -HI *  *  *  *  * -KA *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('平手'));
      expect(ref('P1-KY-KE-GI-KI-OU-KI-GI-KE *' +
                 'P2 * -HI *  *  *  *  * -KA *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('香落ち'));
      expect(ref('P1 * -KE-GI-KI-OU-KI-GI-KE-KY' +
                 'P2 * -HI *  *  *  *  * -KA *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('右香落ち'));
      expect(ref('P1-KY-KE-GI-KI-OU-KI-GI-KE-KY' +
                 'P2 * -HI *  *  *  *  *  *  *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('角落ち'));
      expect(ref('P1-KY-KE-GI-KI-OU-KI-GI-KE-KY' +
                 'P2 *  *  *  *  *  *  * -KA *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('飛車落ち'));
      expect(ref('P1-KY-KE-GI-KI-OU-KI-GI-KE *' +
                 'P2 *  *  *  *  *  *  * -KA *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('飛香落ち'));
      expect(ref('P1-KY-KE-GI-KI-OU-KI-GI-KE-KY' +
                 'P2 *  *  *  *  *  *  *  *  *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('二枚落ち'));
      expect(ref('P1 * -KE-GI-KI-OU-KI-GI-KE *' +
                 'P2 *  *  *  *  *  *  *  *  *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('四枚落ち'));
      expect(ref('P1 *  * -GI-KI-OU-KI-GI-KE *' +
                 'P2 *  *  *  *  *  *  *  *  *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('五枚落ち'));
      expect(ref('P1 * -KE-GI-KI-OU-KI-GI *  *' +
                 'P2 *  *  *  *  *  *  *  *  *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('左五枚落ち'));
      expect(ref('P1 *  * -GI-KI-OU-KI-GI *  *' +
                 'P2 *  *  *  *  *  *  *  *  *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('六枚落ち'));
      expect(ref('P1 *  *  * -KI-OU-KI *  *  *' +
                 'P2 *  *  *  *  *  *  *  *  *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('八枚落ち'));
      expect(ref('P1 *  *  *  * -OU *  *  *  *' +
                 'P2 *  *  *  *  *  *  *  *  *' +
                 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('十枚落ち'));
      expect(ref('P1 *  *  *  * -OU *  *  *  *' +
                 'P2 *  *  *  *  *  *  *  *  *' +
                 'P3 *  *  *  *  *  *  *  *  *' +
                 'P4 *  *  *  *  *  *  *  *  *' +
                 'P5 *  *  *  *  *  *  *  *  *' +
                 'P6 *  *  *  *  *  *  *  *  *' +
                 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU' +
                 'P8 * +KA *  *  *  *  * +HI *' +
                 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY')).toEqual(refr('玉一枚'));
      expect(ref('てきとう')).toEqual(refr('その他'));
    });
    it('initialPlacement(key)', function() {
      var ref = map.initialPlacement,
          refr = map.handicap;

      expect(ref(refr('平手'))).toEqual([-2,-3,-4,-5,-8,-5,-4,-3,-2,
                                         0,-7,0,0,0,0,0,-6,0,
                                         -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                         0,0,0,0,0,0,0,0,0,
                                         0,0,0,0,0,0,0,0,0,
                                         0,0,0,0,0,0,0,0,0,
                                         1,1,1,1,1,1,1,1,1,
                                         0,6,0,0,0,0,0,7,0,
                                         2,3,4,5,8,5,4,3,2
                                        ]);
      expect(ref(refr('香落ち'))).toEqual([-2,-3,-4,-5,-8,-5,-4,-3,0,
                                           0,-7,0,0,0,0,0,-6,0,
                                           -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                           0,0,0,0,0,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           1,1,1,1,1,1,1,1,1,
                                           0,6,0,0,0,0,0,7,0,
                                           2,3,4,5,8,5,4,3,2
                                          ]);
      expect(ref(refr('右香落ち'))).toEqual([0,-3,-4,-5,-8,-5,-4,-3,-2,
                                             0,-7,0,0,0,0,0,-6,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('角落ち'))).toEqual([-2,-3,-4,-5,-8,-5,-4,-3,-2,
                                           0,-7,0,0,0,0,0,0,0,
                                           -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                           0,0,0,0,0,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           1,1,1,1,1,1,1,1,1,
                                           0,6,0,0,0,0,0,7,0,
                                           2,3,4,5,8,5,4,3,2
                                          ]);
      expect(ref(refr('飛車落ち'))).toEqual([-2,-3,-4,-5,-8,-5,-4,-3,-2,
                                             0,0,0,0,0,0,0,-6,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('飛香落ち'))).toEqual([-2,-3,-4,-5,-8,-5,-4,-3,0,
                                             0,0,0,0,0,0,0,-6,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('二枚落ち'))).toEqual([-2,-3,-4,-5,-8,-5,-4,-3,-2,
                                             0,0,0,0,0,0,0,0,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('四枚落ち'))).toEqual([0,-3,-4,-5,-8,-5,-4,-3,0,
                                             0,0,0,0,0,0,0,0,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('五枚落ち'))).toEqual([0,0,-4,-5,-8,-5,-4,-3,0,
                                             0,0,0,0,0,0,0,0,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('左五枚落ち'))).toEqual([0,-3,-4,-5,-8,-5,-4,0,0,
                                               0,0,0,0,0,0,0,0,0,
                                               -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                               0,0,0,0,0,0,0,0,0,
                                               0,0,0,0,0,0,0,0,0,
                                               0,0,0,0,0,0,0,0,0,
                                               1,1,1,1,1,1,1,1,1,
                                               0,6,0,0,0,0,0,7,0,
                                               2,3,4,5,8,5,4,3,2
                                              ]);
      expect(ref(refr('六枚落ち'))).toEqual([0,0,-4,-5,-8,-5,-4,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('八枚落ち'))).toEqual([0,0,0,-5,-8,-5,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('十枚落ち'))).toEqual([0,0,0,0,-8,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             -1,-1,-1,-1,-1,-1,-1,-1,-1,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             0,0,0,0,0,0,0,0,0,
                                             1,1,1,1,1,1,1,1,1,
                                             0,6,0,0,0,0,0,7,0,
                                             2,3,4,5,8,5,4,3,2
                                            ]);
      expect(ref(refr('玉一枚'))).toEqual([0,0,0,0,-8,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           0,0,0,0,0,0,0,0,0,
                                           1,1,1,1,1,1,1,1,1,
                                           0,6,0,0,0,0,0,7,0,
                                           2,3,4,5,8,5,4,3,2
                                          ]);
    });

    it('specialMove(key)', function() {
      var ref = map.specialMove;
      expect(ref('投了')).toEqual('%TORYO');
      expect(ref('詰み')).toEqual('%TSUMI');
      expect(ref('千日手')).toEqual('%SENNICHITE');
      expect(ref('中断')).toEqual('%CHUDAN');
      expect(ref('持将棋')).toEqual('%JISHOGI');
      expect(ref('反則負け')).toEqual('%ILLEGAL_MOVE');
      expect(ref('適当')).toBeNull();
    });
    it('csaSpecialMove(key)', function() {
      var ref = map.csaSpecialMove;
      expect(ref('%TORYO')).toEqual('%TORYO');
      expect(ref('%TSUMI')).toEqual('%TSUMI');
      expect(ref('%SENNICHITE')).toEqual('%SENNICHITE');
      expect(ref('%CHUDAN')).toEqual('%CHUDAN');
      expect(ref('%JISHOGI')).toEqual('%JISHOGI');
      expect(ref('%ILLEGAL_MOVE')).toEqual('%ILLEGAL_MOVE');
      expect(ref('適当')).toBeNull();
    });
    it('format(key)', function() {
      var ref = map.format;
      expect(ref('kif')).toEqual('Kif');
      expect(ref('Kif')).toEqual('Kif');
      expect(ref('KIF')).toEqual('Kif');
      expect(ref('ki2')).toEqual('Ki2');
      expect(ref('Ki2')).toEqual('Ki2');
      expect(ref('KI2')).toEqual('Ki2');
      expect(ref('csa')).toEqual('Csa');
      expect(ref('Csa')).toEqual('Csa');
      expect(ref('CSA')).toEqual('Csa');
      expect(ref('適当')).toBeNull();
    });
    it('piece(key)', function() {
      var ref = map.piece;
      expect(ref('歩')).toEqual(1);
      expect(ref('香')).toEqual(2);
      expect(ref('桂')).toEqual(3);
      expect(ref('銀')).toEqual(4);
      expect(ref('金')).toEqual(5);
      expect(ref('角')).toEqual(6);
      expect(ref('飛')).toEqual(7);
      expect(ref('王')).toEqual(8);
      expect(ref('玉')).toEqual(8);
      expect(ref('と')).toEqual(9);
      expect(ref('成香')).toEqual(10);
      expect(ref('杏')).toEqual(10);
      expect(ref('成桂')).toEqual(11);
      expect(ref('圭')).toEqual(11);
      expect(ref('成銀')).toEqual(12);
      expect(ref('全')).toEqual(12);
      expect(ref('馬')).toEqual(13);
      expect(ref('龍')).toEqual(14);
      expect(ref('適当')).toBeNull();
    });
    it('promotedPiece(key)', function() {
      var ref = map.promotedPiece;
      expect(ref('歩成')).toEqual(9);
      expect(ref('香成')).toEqual(10);
      expect(ref('桂成')).toEqual(11);
      expect(ref('銀成')).toEqual(12);
      expect(ref('角成')).toEqual(13);
      expect(ref('飛成')).toEqual(14);
      expect(ref('適当')).toBeNull();
    });
    it('csaPiece(key)', function() {
      var ref = map.csaPiece;
      expect(ref('FU')).toEqual(1);
      expect(ref('KY')).toEqual(2);
      expect(ref('KE')).toEqual(3);
      expect(ref('GI')).toEqual(4);
      expect(ref('KI')).toEqual(5);
      expect(ref('KA')).toEqual(6);
      expect(ref('HI')).toEqual(7);
      expect(ref('OU')).toEqual(8);
      expect(ref('TO')).toEqual(9);
      expect(ref('NY')).toEqual(10);
      expect(ref('NK')).toEqual(11);
      expect(ref('NG')).toEqual(12);
      expect(ref('UM')).toEqual(13);
      expect(ref('RY')).toEqual(14);
      expect(ref('適当')).toBeNull();
    });
    it('zenkakNumber(key)', function() {
      var ref = map.zenkakNumber;
      expect(ref('１')).toEqual(1);
      expect(ref('２')).toEqual(2);
      expect(ref('３')).toEqual(3);
      expect(ref('４')).toEqual(4);
      expect(ref('５')).toEqual(5);
      expect(ref('６')).toEqual(6);
      expect(ref('７')).toEqual(7);
      expect(ref('８')).toEqual(8);
      expect(ref('９')).toEqual(9);
      expect(ref('適当')).toBeNull();
    });
    it('kansuji(key)', function() {
      var ref = map.kansuji;
      expect(ref('一')).toEqual(1);
      expect(ref('二')).toEqual(2);
      expect(ref('三')).toEqual(3);
      expect(ref('四')).toEqual(4);
      expect(ref('五')).toEqual(5);
      expect(ref('六')).toEqual(6);
      expect(ref('七')).toEqual(7);
      expect(ref('八')).toEqual(8);
      expect(ref('九')).toEqual(9);
      expect(ref('十')).toEqual(10);
      expect(ref('適当')).toBeNull();
    });
    it('header(key)', function() {
      var ref = map.header;
      expect(ref('開始日時')).toEqual('start');
      expect(ref('終了日時')).toEqual('end');
      expect(ref('表題')).toEqual('title');
      expect(ref('棋戦')).toEqual('event');
      expect(ref('戦型')).toEqual('opening');
      expect(ref('先手戦術')).toEqual('tactics_black');
      expect(ref('後手戦術')).toEqual('tactics_white');
      expect(ref('持ち時間')).toEqual('limit');
      expect(ref('消費時間')).toEqual('used');
      expect(ref('場所')).toEqual('site');
      expect(ref('手合割')).toEqual('handicap');
      expect(ref('先手')).toEqual('player_black');
      expect(ref('後手')).toEqual('player_white');
      expect(ref('後手番')).toEqual('turn');
      expect(ref('適当')).toBeNull();
    });
    it('csaHeader(key)', function() {
      var ref = map.csaHeader;
      expect(ref('$START_TIME')).toEqual('start');
      expect(ref('$END_TIME')).toEqual('end');
      expect(ref('$EVENT')).toEqual('event');
      expect(ref('$OPENING')).toEqual('opening');
      expect(ref('$TIME_LIMIT')).toEqual('limit');
      expect(ref('$SITE')).toEqual('site');
      expect(ref('適当')).toBeNull();
    });

    it('pieceToPieceMapKey(piece)', function() {
      var func = map.pieceToPieceMapKey,
          ref = map.piece;
      expect(func(ref('歩'))).toEqual('歩');
      expect(func(ref('香'))).toEqual('香');
      expect(func(ref('桂'))).toEqual('桂');
      expect(func(ref('銀'))).toEqual('銀');
      expect(func(ref('金'))).toEqual('金');
      expect(func(ref('角'))).toEqual('角');
      expect(func(ref('飛'))).toEqual('飛');
      expect(func(ref('王'))).toEqual('王');
      expect(func(ref('と'))).toEqual('と');
      expect(func(ref('成香'))).toEqual('成香');
      expect(func(ref('成桂'))).toEqual('成桂');
      expect(func(ref('成銀'))).toEqual('成銀');
      expect(func(ref('馬'))).toEqual('馬');
      expect(func(ref('龍'))).toEqual('龍');
    });

    it('pieceToCsaPieceMapKey(piece)', function() {
      var func = map.pieceToCsaPieceMapKey,
          ref = map.csaPiece;
      expect(func(ref('FU'))).toEqual('FU');
      expect(func(ref('KY'))).toEqual('KY');
      expect(func(ref('KE'))).toEqual('KE');
      expect(func(ref('GI'))).toEqual('GI');
      expect(func(ref('KI'))).toEqual('KI');
      expect(func(ref('KA'))).toEqual('KA');
      expect(func(ref('HI'))).toEqual('HI');
      expect(func(ref('OU'))).toEqual('OU');
      expect(func(ref('TO'))).toEqual('TO');
      expect(func(ref('NY'))).toEqual('NY');
      expect(func(ref('NK'))).toEqual('NK');
      expect(func(ref('NG'))).toEqual('NG');
      expect(func(ref('UM'))).toEqual('UM');
      expect(func(ref('RY'))).toEqual('RY');
    });
  });
});
