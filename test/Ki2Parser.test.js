"use strict";

var Ki2Parser = require('../lib/Ki2Parser'),
    map = require('../lib/map');

var ki2_source = require('raw!./sample/ki2.ki2');

describe('Ki2Praser.js', function() {
  var parser;

  beforeEach(function() {
    parser = new Ki2Parser(ki2_source, 'Ki2');
  });

  describe('Ki2 Constructor', function() {
    it('this.sourceは引数のsourceである', function() {
      expect(parser.source).toEqual(ki2_source);
    });
    it('this.formatは"Kif"文字列である', function() {
      expect(parser.format).toEqual('Ki2');
    });
    it('this.stackは空配列である', function() {
      expect(parser.stack).toEqual([]);
    });
  });

  describe('Ki2.prototype.parseBodyTurn(body)', function() {
    it('最初に現れる棋譜の手番のマークを取得する', function() {
      var body1 =
            '▲７六歩\n' +
            '△３四歩\n' +
            '▲２六歩\n' +
            '△８四歩\n' +
            '▲２五歩\n' +
            '△８五歩\n' +
            '▲２四歩\n' +
            '△同　歩\n' +
            '▲同　飛\n';

      var body2 =
            '*コメント\n' +
            '▲７六歩\n' +
            '△３四歩\n' +
            '▲２六歩\n' +
            '△８四歩\n' +
            '▲２五歩\n' +
            '△８五歩\n' +
            '▲２四歩\n' +
            '△同　歩\n' +
            '▲同　飛\n';

      expect(parser.parseBodyTurn(body1)).toEqual('black');
      expect(parser.parseBodyTurn(body2)).toEqual('black');
    });
  });

  describe('Ki2.prototype.parseBody(body)', function() {
    it('【変化有り】全ての棋譜をパースして決められた形式のオブジェクトで返す', function() {
      var body =
            '▲７六歩\n' +
            '△３四歩\n' +
            '▲２六歩\n' +
            '△８四歩\n' +
            '▲２五歩\n' +
            '△８五歩\n' +
            '▲２四歩\n' +
            '△同　歩\n' +
            '▲同　飛\n' +

            '変化：   4手\n' +
            '△４四歩\n' +
            '▲２五歩\n' +
            'まで5手で中断\n' +
            '変化：   2手\n' +
            '△８四歩\n' +
            '▲３六歩\n' +
            'まで3手で中断\n' +
            '変化：   1手\n' +
            '▲２六歩\n' +
            '△８四歩\n' +
            'まで2手で中断';

      var comp = {'main':[
        {},
        {'move':{'turn': true, 'to':[7,6],'from':[7,7],'piece':1,'time':0}},
        {'move':{'turn': false, 'to':[3,4],'from':[3,3],'piece':1,'time':0}},
        {'move':{'turn': true, 'to':[2,6],'from':[2,7],'piece':1,'time':0}},
        {'move':{'turn': false, 'to':[8,4],'from':[8,3],'piece':1,'time':0}},
        {'move':{'turn': true, 'to':[2,5],'from':[2,6],'piece':1,'time':0}},
        {'move':{'turn': false, 'to':[8,5],'from':[8,4],'piece':1,'time':0}},
        {'move':{'turn': true, 'to':[2,4],'from':[2,5],'piece':1,'time':0}},
        {'move':{'turn': false, 'to':[2,4],'from':[2,3],'piece':1,'time':0}},
        {'move':{'turn': true, 'to':[2,4],'from':[2,8],'piece':7,'time':0}}],
                  'variations':[[4,[{'move':{'turn': false, 'to':[4,4],'from':[4,3],'piece':1,'time':0}},
                                    {'move':{'turn': true, 'to':[2,5],'from':[2,6],'piece':1,'time':0}},
                                    {'special':'%CHUDAN'}]],
                                [2,[{'move':{'turn': false, 'to':[8,4],'from':[8,3],'piece':1,'time':0}},
                                    {'move':{'turn': true, 'to':[3,6],'from':[3,7],'piece':1,'time':0}},
                                    {'special':'%CHUDAN'}]],
                                [1,[{'move':{'turn': true, 'to':[2,6],'from':[2,7],'piece':1,'time':0}},
                                    {'move':{'turn': false, 'to':[8,4],'from':[8,3],'piece':1,'time':0}},
                                    {'special':'%CHUDAN'}]
                                ]]};

      expect(parser.parseBody(body, null)).toEqual(comp);
    });
    it('【変化無し】全ての棋譜をパースして決められた形式のオブジェクトで返す', function() {
      var body =
            '▲７六歩\n' +
            '△３四歩\n' +
            '▲２六歩\n' +
            '△８四歩\n' +
            '▲２五歩\n' +
            '△８五歩\n' +
            '▲２四歩\n' +
            '△同　歩\n' +
            '▲同　飛\n';

      var comp = {'main':[
        {},
        {'move':{'turn': true, 'to':[7,6],'from':[7,7],'piece':1,'time':0}},
        {'move':{'turn': false, 'to':[3,4],'from':[3,3],'piece':1,'time':0}},
        {'move':{'turn': true, 'to':[2,6],'from':[2,7],'piece':1,'time':0}},
        {'move':{'turn': false, 'to':[8,4],'from':[8,3],'piece':1,'time':0}},
        {'move':{'turn': true, 'to':[2,5],'from':[2,6],'piece':1,'time':0}},

        {'move':{'turn': false, 'to':[8,5],'from':[8,4],'piece':1,'time':0}},
        {'move':{'turn': true, 'to':[2,4],'from':[2,5],'piece':1,'time':0}},
        {'move':{'turn': false, 'to':[2,4],'from':[2,3],'piece':1,'time':0}},
        {'move':{'turn': true, 'to':[2,4],'from':[2,8],'piece':7,'time':0}}]};

      expect(parser.parseBody(body, null)).toEqual(comp);
    });
    it('変化直後に同 ○があるmoveのtoプロパティが正しい値を持つ', function() {
      var body =
            '▲７六歩\n' +
            '△３四歩\n' +
            '▲２二角成\n' +
            '△８四歩\n' +
            '変化：   4手\n' +
            '△同　飛\n';

      var res = parser.parseBody(body, null);
      expect(res.variations[0][1][0].move.to).toEqual([2, 2]);
    });
    it('本筋の棋譜が無ければエラーを返す', function() {
      expect(function() {parser.parseBody('', null);}).toThrow();
    });
    it('変化の数値に問題があればエラーを返す', function() {
      var body =
            '▲７六歩\n' +
            '△３四歩\n' +
            '▲２二角成\n' +
            '△８四歩\n' +
            '変化：   10手\n' + // 本当は4手
            '△同　飛\n';

      expect(function() {parser.parseBody(body, null);} ).toThrow();
    });
  });

  describe('Ki2.prototype.turnToBoolean(turn)', function() {
    it('引数turnが"black"であればtrueを返し、"white"であればfalseを返す', function() {
      expect(parser.turnToBoolean('black')).toBeTruthy();
      expect(parser.turnToBoolean('white')).toBeFalsy();
    });
  });

  describe('Ki2.prototype.TurnCheck(turn, mturn)', function() {
    it('引数mturnが"black"であれば"white"を返す', function() {
      expect(parser.turnCheck('black', 'black')).toEqual('white');
    });
    it('引数mturnが"white"であれば"black"を返す', function() {
      expect(parser.turnCheck('white', 'white')).toEqual('black');
    });
    it('引数turnとmturnが同じ値で無ければエラーを返す', function() {
      expect(function() { parser.turnCheck('black', 'white'); }).toThrow();
    });
  });

  describe('Ki2.prototype.unityTurnMark(turn)', function() {
    it('引数turnが"▲▼"であれば"black"を返す', function() {
      expect(parser.unityTurnMark('▲')).toEqual('black');
      expect(parser.unityTurnMark('▼')).toEqual('black');
    });
    it('引数turnが"△▽"であれば"white"を返す', function() {
      expect(parser.unityTurnMark('△')).toEqual('white');
      expect(parser.unityTurnMark('▽')).toEqual('white');
    });
  });

  describe('Ki2.prototype.parseMoveMotion(motion)', function() {
    it('引数motionが"行"や"入"であれば"上"を返す', function() {
      expect(parser.parseMoveMotion('行')).toEqual('上');
      expect(parser.parseMoveMotion('入')).toEqual('上');
    });
    it('引数motionが"下"であれば"引"を返す', function() {
      expect(parser.parseMoveMotion('下')).toEqual('引');
    });
    it('引数motionが"行","入","下"以外であれば値をそのまま返す', function() {
      expect(parser.parseMoveMotion('上')).toEqual('上');
      expect(parser.parseMoveMotion('引')).toEqual('引');
      expect(parser.parseMoveMotion('寄')).toEqual('寄');
    });
  });

  describe('Ki2.prototype.parseMovePiece(move, modifier)', function() {
    it('駒の種類を判定してそれぞれ数値で返す', function() {
      // 他のパターンもこれらと同じなのでテストしなくて良い
      expect(parser.parseMovePiece('同飛')).toEqual(map.piece('飛'));
      expect(parser.parseMovePiece('同成香')).toEqual(map.piece('成香'));
      expect(parser.parseMovePiece('同　金')).toEqual(map.piece('金'));
      expect(parser.parseMovePiece('９一成銀')).toEqual(map.piece('成銀'));
      expect(parser.parseMovePiece('５四歩')).toEqual(map.piece('歩'));
    });
    it('駒を判定できなければnullを返す', function() {
      expect(parser.parseMovePiece('同銀銀', '')).toBeNull();
      expect(parser.parseMovePiece('４八銅', '')).toBeNull();
      expect(parser.parseMovePiece('４八銀　', '')).toBeNull();
      expect(parser.parseMovePiece('４八金銀', '')).toBeNull();
      expect(parser.parseMovePiece('４八成銀金', '')).toBeNull();
    });
  });

  describe('Ki2.prototype.parseMoveLine(line)', function() {
    it('"手番","指し手"でキャプチャ', function() {
      var res = parser.parseMoveLine('▲２八銀');

      expect(res[1]).toEqual('▲');
      expect(res[2]).toEqual('２八銀');
      expect(res[3]).toBeUndefined();
      expect(res[4]).toBeUndefined();
      expect(res[5]).toBeUndefined();
    });
    it('"手番","指し手","相対位置"でキャプチャ', function() {
      var res = parser.parseMoveLine('▲７八銀直');

      expect(res[1]).toEqual('▲');
      expect(res[2]).toEqual('７八銀');
      expect(res[3]).toEqual('直');
      expect(res[4]).toBeUndefined();
      expect(res[5]).toBeUndefined();
    });
    it('"手番","指し手","相対位置","動作"でキャプチャ', function() {
      var res = parser.parseMoveLine('▲７八銀右上');

      expect(res[1]).toEqual('▲');
      expect(res[2]).toEqual('７八銀');
      expect(res[3]).toEqual('右');
      expect(res[4]).toEqual('上');
      expect(res[5]).toBeUndefined();
    });
    it('"手番","指し手","相対位置","動作","装飾子"でキャプチャ', function() {
      var res = parser.parseMoveLine('▲７八銀左上不成');

      expect(res[1]).toEqual('▲');
      expect(res[2]).toEqual('７八銀');
      expect(res[3]).toEqual('左');
      expect(res[4]).toEqual('上');
      expect(res[5]).toEqual('不成');
    });
    it('マッチしなければnullを返す', function() {
      var res = parser.parseMoveLine('▲４七銀　右');

      expect(res).toBeNull();
    });
  });

  describe('Ki2.prototype.parseMove(line)', function() {
    it('構文通りでない棋譜であればエラーを返す', function() {
      expect(function() { parser.parseMove('▲４七銀成直');}).toThrow();
      expect(function() { parser.parseMove('▲4七銀成直');}).toThrow();
      expect(function() { parser.parseMove('▲４七銀成不成');}).toThrow();
      expect(function() { parser.parseMove('▲４七成成銀');}).toThrow();
      expect(function() { parser.parseMove('▲４七銀右左');}).toThrow();
      expect(function() { parser.parseMove('▲４七銀寄右');}).toThrow();
      expect(function() { parser.parseMove('▲４七銀打成');}).toThrow();
      expect(function() { parser.parseMove('▲４ 七銀');}).toThrow();

      // 同　○の場合これがないと判定しようがない
      parser.storeMove({
        'to': [1, 1]
      });
      // 全角スペースでないといけない
      expect(function() { parser.parseMove('▲同 金');}).toThrow();
    });
    it('構文通りであれば必要なデータをオブジェクトで包んで返す', function() {
      // 棋譜によってはundefinedの要素がある
      var o = parser.parseMove('▲６三銀左');
      expect(o.turn).toBeDefined();
      expect(o.to).toBeDefined();
      expect(o.piece).toBeDefined();
      expect(o.relative).toBeDefined();
      expect(o.motion).toBeUndefined();
      expect(o.modifier).toBeUndefined();

      // 全ての要素が埋まる場合
      o = parser.parseMove('▲６三銀左上不成');
      expect(o.turn).toBeDefined();
      expect(o.to).toBeDefined();
      expect(o.piece).toBeDefined();
      expect(o.relative).toBeDefined();
      expect(o.motion).toBeDefined();
      expect(o.modifier).toBeDefined();
    });
  });

  describe('Ki2.prototype.bodyTolines(lines)', function() {
    it('文字列中の▲▼△▽をセパレータとして区切り▲▼△▽を残して配列で返す', function() {
      var lines = ['▲hoge△piyo', '▼fuga', '▽bar', '▲foo ▲faaa　▽gooo' ,'▲geee ▽guuu ▲buooo'],
          comp = ['▲hoge', '△piyo', '▼fuga', '▽bar', '▲foo ', '▲faaa　','▽gooo' ,'▲geee ', '▽guuu ', '▲buooo'];
      expect(parser.bodyToLines(lines)).toEqual(comp);
    });
  });

  describe('Ki2.prototype.splitSource(source)', function() {
    it('棋譜情報と棋譜があった場合に正常に区切られている', function() {
      var sep1 = '\n*',
          sep2 = '\n▲',
          sep3 = '\n▼',
          sep4 = '\n△',
          sep5 = '\n▽';

      var header = 'header',
          body = 'body';

      var res1 = parser.splitSource(header + sep1 + body);
      expect(res1[1]).toEqual('header');
      expect(res1[2]).toEqual('*body');

      var res2 = parser.splitSource(header + sep2 + body);
      expect(res2[1]).toEqual('header');
      expect(res2[2]).toEqual('▲body');

      var res3 = parser.splitSource(header + sep3 + body);
      expect(res3[1]).toEqual('header');
      expect(res3[2]).toEqual('▼body');

      var res4 = parser.splitSource(header + sep4 + body);
      expect(res4[1]).toEqual('header');
      expect(res4[2]).toEqual('△body');

      var res5 = parser.splitSource(header + sep5 + body);
      expect(res5[1]).toEqual('header');
      expect(res5[2]).toEqual('▽body');
    });
    it('コメントと棋譜のみであれば配列の最後にsourceを入れて返す', function() {
      var body1 = '*comment\n▲body';
      var body2 = '▲body*comment';

      var res1 = parser.splitSource(body1);
      expect(res1[1]).toBeUndefined();
      expect(res1[2]).toEqual(body1);

      var res2 = parser.splitSource(body2);
      expect(res2[1]).toBeUndefined();
      expect(res2[2]).toEqual(body2);
    });
    it('棋譜がなく棋譜情報だけであればnullを返す', function() {
      var header = 'header',
          res = parser.splitSource(header);

      expect(res).toBeNull();
    });
  });


  describe('Ki2.prototype.parse()', function() {
    it('ヘッダ情報があればheaderとbodyプロパティを持つオブジェクトを返す', function() {
      var p = parser.parse();
      expect(p.header).toBeDefined();
      expect(p.body).toBeDefined();
    });
    it('ヘッダ情報がなければheaderプロパティがnullでbodyプロパティにデータを持つオブジェクトを返す', function() {
      parser.source =  '▲７六歩\n' +
        '△３四歩\n' +
        '▲２六歩\n' +
        '△８四歩\n' +
        '▲２五歩\n' +
        '△８五歩\n' +
        '▲２四歩\n' +
        '△同　歩\n' +
        '▲同　飛\n';

      var p = parser.parse();
      expect(p.header).toBeNull();
      expect(p.body).toBeDefined();
    });
  });
});
