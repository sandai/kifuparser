"use strict";

var KifParser = require('../lib/KifParser'),
    map = require('../lib/map');
var kif_source = require('raw!./sample/kif.kif');

describe('KifParser.js', function() {
  var parser;

  beforeEach(function() {
    parser = new KifParser(kif_source, 'Kif');
  });

  describe('Kif Constructor', function() {
    it('this.sourceは引数のsourceである', function() {
      expect(parser.source).toEqual(kif_source);
    });
    it('this.formatは"Kif"文字列である', function() {
      expect(parser.format).toEqual('Kif');
    });
    it('this.stackは空配列である', function() {
      expect(parser.stack).toEqual([]);
    });
  });

  describe('Kif.prototype.parseHeaderUsed(value)', function() {
    it('xx▲xxx△xxxの形式にマッチしてキャプチャ', function() {
      var used = parser.parseHeaderUsed('141▲294△299');

      expect(used[1]).toEqual('141');
      expect(used[2]).toEqual('294');
      expect(used[3]).toEqual('299');
    });
  });

  describe('Kif.prototype.parseHeaderBoard(board)', function() {
    it('開始盤面をパースしてそれぞれ駒の数値を持った配列を返す',function() {
      var board =
            ['+---------------------------+',
             '|v香v桂v銀v金v玉v金v銀v桂v香|一',
             '| ・v飛 ・ ・ ・ ・ ・v角 ・|二',
             '|v歩v歩v歩v歩v歩v歩v歩v歩v歩|三',
             '| ・ ・ ・ ・ ・ ・ ・ ・ ・|四',
             '| ・ ・ ・ ・ ・ ・ ・ ・ ・|五',
             '| ・ ・ ・ ・ ・ ・ ・ ・ ・|六',
             '| 歩 歩 歩 歩 歩 歩 歩 歩 歩|七',
             '| ・ 角 ・ ・ ・ ・ ・ 飛 ・|八',
             '| 香 桂 銀 金 玉 金 銀 桂 香|九',
             '+---------------------------+'] ;

      var comp = [-2,-3,-4,-5,-8,-5,-4,-3,-2,
                  0,-7,0,0,0,0,0,-6,0,
                  -1,-1,-1,-1,-1,-1,-1,-1,-1,
                  0,0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,0,
                  1,1,1,1,1,1,1,1,1,
                  0,6,0,0,0,0,0,7,0,
                  2,3,4,5,8,5,4,3,2
                 ];

      expect(parser.parseHeaderBoard(board)).toEqual(comp);
    });
  });

  describe('Kif.prototype.parseHeaderHand(hands)', function() {
    it('持ち駒をひとつずつ数値で表し配列でまとめて返す',function() {
      var hands = '飛二 角　金四 銀三　桂　香二　歩九',
          comp = {'FU': 9, 'KY': 2, 'KE': 1, 'GI': 3, 'KI': 4, 'KA': 1, 'HI': 2};

      expect(parser.parseHeaderHand(hands)).toEqual(comp);
    });
  });

  describe('Kif.prototype.parseHeader(header)', function() {
    it('棋譜情報をパースして決められた形式のオブジェクトで返す', function() {
      var header =
            '開始日時：2013/09/04 09:00\n' +
            '終了日時：2013/09/04 22:21\n' +
            '表題：王座戦\n' +
            '棋戦：第61期王座戦五番勝負　第１局\n' +
            '持ち時間：各５時間\n' +
            '消費時間：141▲294△299\n' +
            '場所：宮城・仙台ロイヤルパークホテル\n' +
            '手合割：平手　　\n' +
            '先手：中村太地\n' +
            '後手：羽生善治\n' +
            '戦型：横歩取り\n' +
            '先手戦術：わかんない\n' +
            '後手戦術：わかんなーい\n' +
            '後手の持駒：\n' +
            '  ９ ８ ７ ６ ５ ４ ３ ２ １\n' +
            '+---------------------------+\n' +
            '|v香v桂v銀v金v玉v金v銀v桂 ・|一\n' +
            '| ・ ・ ・ ・ ・ ・ ・ ・ ・|二\n' +
            '|v歩v歩v歩v歩v歩v歩v歩v歩v歩|三\n' +
            '| ・ ・ ・ ・ ・ ・ ・ ・ ・|四\n' +
            '| ・ ・ ・ ・ ・ ・ ・ ・ ・|五\n' +
            '| ・ ・ ・ ・ ・ ・ ・ ・ ・|六\n' +
            '| 歩 歩 歩 歩 歩 歩 歩 歩 歩|七\n' +
            '| ・ 角 ・ ・ ・ ・ ・ 飛 ・|八\n' +
            '| 香 桂 銀 金 玉 金 銀 桂 香|九\n' +
            '+---------------------------+\n' +
            '先手の持駒：飛　角 香';

      // 香落ちなので手合割が何であれhandicapはその他になっていることに注意
      var comp = {
        'date': {
          'start': '2013/09/04 09:00',
          'end': '2013/09/04 22:21'
        },
        'title': '王座戦',
        'event': '第61期王座戦五番勝負　第１局',
        'board': [-2,-3,-4,-5,-8,-5,-4,-3,0,
                  0,0,0,0,0,0,0,0,0,
                  -1,-1,-1,-1,-1,-1,-1,-1,-1,
                  0,0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,0,
                  1,1,1,1,1,1,1,1,1,
                  0,6,0,0,0,0,0,7,0,
                  2,3,4,5,8,5,4,3,2
                 ],
        'time': {
          'limit': '各５時間',
          'used': {
            'black': 294,
            'white': 299
          }
        },
        'moves': 141,
        'site': '宮城・仙台ロイヤルパークホテル',
        'handicap': 14,
        'players': {
          'black': '中村太地',
          'white': '羽生善治'
        },
        'opening': '横歩取り',
        'tactics': {
          'black': 'わかんない',
          'white': 'わかんなーい'
        },
        'hands': {
          'black':{'HI': 1, 'KA': 1, 'KY': 1}
        }
      };

      expect(parser.parseHeader(header)).toEqual(comp);
    });
  });

  describe('Kif.prototype.parseBodyComment(obj, comment)', function() {
    var obj;

    beforeEach(function() {
      obj = {};
    });

    it('obj.commentとしてcommentを格納', function() {
      parser.parseBodyComment(obj, 'bar');
      expect(obj).toEqual({'comment': 'bar'});
    });
    it('obj.commentがあるならcommentの頭に"\\n"をつけて追加', function() {
      parser.parseBodyComment(obj, 'bar');
      parser.parseBodyComment(obj, 'foo');
      expect(obj).toEqual({'comment': 'bar\nfoo'});
    });
    it('commentが改行("\\n")だけであればそのまま追加', function() {
      parser.parseBodyComment(obj, 'bar');
      parser.parseBodyComment(obj, 'foo');
      parser.parseBodyComment(obj, '\n');
      expect(obj).toEqual({'comment': 'bar\nfoo\n'});
    });
  });

  describe('Kif.prototype.parseBodyVariation(value)', function() {
    it('引数valueの値がスタックの長さより大きければ規定されたオブジェクトを追加する', function() {
      var obj = {
        stack: [
          [0, []],
          [5, []],
        ]
      },
          value = 6;

      parser.parseBodyVariation.call(obj, value);

      expect(obj.stack[2]).toEqual([6, []]);
    });
    it('引数valueの値がスタックの長さより小さければ、this.stackの各配列が持つvalueの値より大きくなるまでスタックを削除して最後に規定されたオブジェクトを追加する', function() {
      var obj = {
        stack: [
          [0, []],
          [7, []],
          [5, []],
          [3, []],
        ]
      },
          value = 2;

      parser.parseBodyVariation.call(obj, value);

      expect(obj.stack[1]).toEqual([2, []]);
    });
  });

  describe('Kif.prototype.parseBodySpecialMove(result)', function() {
    it('引数resultに対応する文字列を返す', function() {
      expect(parser.parseBodySpecialMove('先手の勝ち')).toEqual(map.specialMove('投了'));
      expect(parser.parseBodySpecialMove('後手の勝ち')).toEqual(map.specialMove('投了'));
      expect(parser.parseBodySpecialMove('上手の勝ち')).toEqual(map.specialMove('投了'));
      expect(parser.parseBodySpecialMove('下手の勝ち')).toEqual(map.specialMove('投了'));
      expect(parser.parseBodySpecialMove('千日手')).toEqual(map.specialMove('千日手'));
      expect(parser.parseBodySpecialMove('中断')).toEqual(map.specialMove('中断'));
      expect(parser.parseBodySpecialMove('持将棋')).toEqual(map.specialMove('持将棋'));
      expect(parser.parseBodySpecialMove('詰')).toEqual(map.specialMove('詰み'));
      expect(parser.parseBodySpecialMove('先手の反則負け')).toEqual(map.specialMove('反則負け'));
      expect(parser.parseBodySpecialMove('後手の反則負け')).toEqual(map.specialMove('反則負け'));
      expect(parser.parseBodySpecialMove('上手の反則負け')).toEqual(map.specialMove('反則負け'));
      expect(parser.parseBodySpecialMove('下手の反則負け')).toEqual(map.specialMove('反則負け'));
      expect(parser.parseBodySpecialMove('適当')).toBeNull();
    });
  });

  describe('Kif.prototype.parseBodyFirstMove(body)', function() {
    it('最初の棋譜だけをパースしてオブジェクトで返す', function() {
      var body =
            '1 ７六歩(77)   ( 0:00/00:00:00)\n' +
            '2 ３四歩(33)   ( 0:00/00:00:00)\n' +
            '3 ２二角成(88) ( 0:00/00:00:00)\n' +
            '4 同　銀(31)   ( 0:00/00:00:00)\n';

      var move = parser.parseBodyFirstMove(body);

      expect(move).toEqual({'num':1,'to':[7,6],'from':[7,7],'piece':1,'time':0});
    });
  });

  describe('Kif.prototype.parseBodyFirstTurn(header)', function() {
    it('引数headerがnullであればtrueを返す', function() {
      expect(parser.parseBodyFirstTurn(null)).toBeTruthy();
    });
    it('引数headerのturnプロパティがundefinedであればtrueを返す', function() {
      expect(parser.parseBodyFirstTurn(null)).toBeTruthy();
    });
    it('それ以外は引数header.turnを返す', function() {
      expect(parser.parseBodyFirstTurn({'turn':false})).toBeFalsy();
    });

  });

  describe('Kif.prototype.parseBody(body, header)', function() {
    it('【変化有り】全ての棋譜をパースして決められた形式のオブジェクトで返す', function() {
      var body =
            '1 ７六歩(77)   ( 0:00/00:00:00)\n' +
            '2 ３四歩(33)   ( 0:00/00:00:00)\n' +
            '3 ２二角成(88) ( 0:00/00:00:00)\n' +
            '4 同　銀(31)   ( 0:00/00:00:00)\n' +
            '変化：4手\n' +
            '4 同　飛(82)   ( 0:00/00:00:00)\n' +
            '変化：4手\n' +
            '4 ８四歩(83)   ( 0:00/00:00:00)\n' +
            '5 ２六歩(27)   ( 0:00/00:00:00)\n' +
            '6 ８五歩(84)   ( 0:00/00:00:00)\n' +
            '7 ２五歩(26)   ( 0:00/00:00:00)\n' +
            '8 ２二銀(31)   ( 0:00/00:00:00)\n' +
            '変化：6手\n' +
            '6 ２二銀(31)   ( 0:00/00:00:00)\n' +
            '7 ２五歩(26)   ( 0:00/00:00:00)\n' +
            '8 ８五歩(84)   ( 0:00/00:00:00)\n' +
            '変化：2手\n' +
            '2 ８四歩(83)   ( 0:00/00:00:00)\n' +
            '3 ２六歩(27)   ( 0:00/00:00:00)';

      var comp = {
        'main':[
          {},
          {'move':{'turn':true,'to':[7,6],'from':[7,7],'piece':1,'time':0}},
          {'move':{'turn':false,'to':[3,4],'from':[3,3],'piece':1,'time':0}},
          {'move':{'turn':true,'to':[2,2],'from':[8,8],'piece':13,'time':0}},
          {'move':{'turn':false,'to':[2,2],'from':[3,1],'piece':4,'time':0}}
        ],
        'variations':[
          [4,[{'move':{'turn':false,'to':[2,2],'from':[8,2],'piece':7,'time':0}}]],
          [4,[{'move':{'turn':false,'to':[8,4],'from':[8,3],'piece':1,'time':0}},
              {'move':{'turn':true,'to':[2,6],'from':[2,7],'piece':1,'time':0}},
              {'move':{'turn':false,'to':[8,5],'from':[8,4],'piece':1,'time':0}},
              {'move':{'turn':true,'to':[2,5],'from':[2,6],'piece':1,'time':0}},
              {'move':{'turn':false,'to':[2,2],'from':[3,1],'piece':4,'time':0}}]],
          [6,[{'move':{'turn':false,'to':[2,2],'from':[3,1],'piece':4,'time':0}},
              {'move':{'turn':true,'to':[2,5],'from':[2,6],'piece':1,'time':0}},
              {'move':{'turn':false,'to':[8,5],'from':[8,4],'piece':1,'time':0}}]],
          [2,[{'move':{'turn':false,'to':[8,4],'from':[8,3],'piece':1,'time':0}},
              {'move':{'turn':true,'to':[2,6],'from':[2,7],'piece':1,'time':0}}]]
        ]};

      expect(parser.parseBody(body, null)).toEqual(comp);
    });
    it('【変化無し】全ての棋譜をパースして決められた形式のオブジェクトで返す', function() {
      var body =
            '1 ７六歩(77)   ( 0:01/00:00:01)\n' +
            '2 ３四歩(33)   ( 0:01/00:00:01)\n'+
            '*コメント1\n'+
            '*\n'+
            '*コメント2\n'+
            '3 ２六歩(27)   ( 0:00/00:00:01)\n'+
            '4 ４二飛(82)   ( 0:01/00:00:02)\n'+
            '5 ６八玉(59)   ( 0:01/00:00:02)\n'+
            '6 ８八角成(22) ( 0:02/00:00:04)\n'+
            '7 同　銀(79)   ( 0:01/00:00:03)\n'+
            '8 ２二銀(31)   ( 0:02/00:00:06)\n'+
            '9 ７八玉(68)   ( 0:01/00:00:04)';

      var comp = {'main':[
        {},
        {'move':{'turn':true,'to':[7,6],'from':[7,7],'piece':1,'time':1}},
        {'move':{'turn':false,'to':[3,4],'from':[3,3],'piece':1,'time':1},
         'comment': 'コメント1\n\nコメント2'},
        {'move':{'turn':true,'to':[2,6],'from':[2,7],'piece':1,'time':0}},
        {'move':{'turn':false,'to':[4,2],'from':[8,2],'piece':7,'time':1}},
        {'move':{'turn':true,'to':[6,8],'from':[5,9],'piece':8,'time':1}},
        {'move':{'turn':false,'to':[8,8],'from':[2,2],'piece':13,'time':2}},
        {'move':{'turn':true,'to':[8,8],'from':[7,9],'piece':4,'time':1}},
        {'move':{'turn':false,'to':[2,2],'from':[3,1],'piece':4,'time':2}},
        {'move':{'turn':true,'to':[7,8],'from':[6,8],'piece':8,'time':1}}]};

      expect(parser.parseBody(body, null)).toEqual(comp);
    });
    it('変化直後に同 ○があるmoveのtoプロパティが正しい値を持つ', function() {
      var body = '1 ７六歩(77)   ( 0:00/00:00:00)\n' +
            '2 ３四歩(33)   ( 0:00/00:00:00)\n' +
            '3 ２二角成(88) ( 0:00/00:00:00)\n' +
            '4 ８四歩(83)   ( 0:00/00:00:00)\n' +
            '変化：4手\n' +
            '4 同　飛(82)   ( 0:00/00:00:00)';

      var comp = {
        'main':[
          {},
          {'move':{'turn':true,'to':[7,6],'from':[7,7],'piece':1,'time':0}},
          {'move':{'turn':false,'to':[3,4],'from':[3,3],'piece':1,'time':0}},
          {'move':{'turn':true,'to':[2,2],'from':[8,8],'piece':13,'time':0}},
          {'move':{'turn':false,'to':[8,4],'from':[8,3],'piece':1,'time':0}}],
        'variations':[
          [4,[{'move':{'turn':false,'to':[2,2],'from':[8,2],'piece':7,'time':0}}]]]};

      var res = parser.parseBody(body, null);

      expect(parser.parseBody(body, null)).toEqual(comp);
      expect(res.variations[0][1][0].move.to).toEqual([2, 2]);
    });
    it('本筋の棋譜が無ければエラーを返す', function() {
      expect(function() {parser.parseBody('', null);}).toThrow();
    });
    it('変化の数値に問題があればエラーを返す', function() {
      var body = '1 ７六歩(77)   ( 0:00/00:00:00)\n' +
            '2 ３四歩(33)   ( 0:00/00:00:00)\n' +
            '3 ２二角成(88) ( 0:00/00:00:00)\n' +
            '4 同　銀(31)   ( 0:00/00:00:00)\n' +
            '変化：10手\n' + // 10になっている
            '4 同　飛(82)   ( 0:00/00:00:00)';

      expect(function() {parser.parseBody(body, null);} ).toThrow();
    });
  });

  describe('Kif.prototype.takeTurn(base, firstTurn, num)', function() {
    it('引数baseと引数numが偶数か奇数かで同じなら引数firstTurnをそのまま返す', function() {
      expect(parser.takeTurn(1, true, 7)).toBeTruthy();
    });
    it('同じでないなら引数firstTurnを反転して返す', function() {
      expect(parser.takeTurn(1, true, 6)).toBeFalsy();
    });
  });

  describe('Kif.prototype.checkMoves(order, num)', function() {
    it('orderとnumが同じ数値であればorderに+1をして返す', function() {
      expect(parser.checkMoves(1, 1)).toEqual(2);
    });
    it('orderとnumが同じ数値でなければエラーを返す', function() {
      expect(function() { parser.checkMoves(1, 2); }).toThrow();
    });
  });

  describe('Kif.prototype.storeMove(move)', function() {
    it('this.moveにデータを保存する', function() {
      var move = {
        to: [7, 6],
        from: [7, 7],
        piece: 0,
        time: 2
      };

      parser.storeMove(move);
      expect(parser.move).toBe(move);
    });
  });

  describe('Kif.prototype.loadMove()', function() {
    it('this.moveに保存したデータを返す', function() {
      var move = {
        'to': [7, 6],
        'from': [7, 7],
        'piece': 0,
        'time': 2
      };

      parser.storeMove(move);
      expect(parser.loadMove()).toBe(move);

    });
  });

  describe('Kif.prototype.parseMoveTo(move)', function() {
    var move;

    beforeEach(function() {
      move = {
        'to': [7, 6],
        'from': [7, 7],
        'piece': 0,
        'time': 2
      };

      parser.storeMove(move);
    });

    it('文字列の先頭が"同"であればthis.moveのtoプロパティをコピーして返す', function() {
      expect(parser.parseMoveTo('同　銀')).toEqual(move.to);
    });
    it('文字列の先頭が全角数字かつ次の文字が漢数字であればそれらを数値にして配列で返す', function() {
      expect(parser.parseMoveTo('７七')).toEqual([7, 7]);
    });
    it('いずれの条件にもあてはまなければnullを返す', function() {
      expect(parser.parseMoveTo('7７七')).toBeNull();
    });
  });

  describe('Kif.prototype.parseMoveFrom(modifier, from)', function() {
    it('引数modifierが"打"のとき[0, 0]を返す', function() {
      expect(parser.parseMoveFrom('打', '')).toEqual([0, 0]);
    });
    it('引数fromが2桁の数字であるときそれらを分割して配列で返す', function() {
      expect(parser.parseMoveFrom(undefined, '88')).toEqual([8, 8]);
    });
    it('いずれの条件にもあてはまらなければnullを返す', function() {
      expect(parser.parseMoveFrom('', undefined)).toBeNull();
      expect(parser.parseMoveFrom('', '８８')).toBeNull();
    });
  });

  describe('Kif.prototype.parseMovePiece(move, modifier)', function() {
    it('駒の種類を判定してそれぞれ数値で返す', function() {
      // 他のパターンも同じだからこれだけで良い
      expect(parser.parseMovePiece('７六歩', undefined)).toEqual(map.piece('歩'));
      expect(parser.parseMovePiece('９一成香', undefined)).toEqual(map.piece('成香'));
      expect(parser.parseMovePiece('５七桂', '成')).toEqual(map.promotedPiece('桂成'));
      expect(parser.parseMovePiece('同　銀', undefined)).toEqual(map.piece('銀'));
      expect(parser.parseMovePiece('同　桂', '成')).toEqual(map.promotedPiece('桂成'));
      expect(parser.parseMovePiece('同　成銀', undefined)).toEqual(map.piece('成銀'));
      expect(parser.parseMovePiece('８八角', '成')).toEqual(map.promotedPiece('角成'));
    });
    it('駒種を判定できなければnullを返す', function() {
      expect(parser.parseMovePiece('７八金銀', '打')).toBeNull();
      expect(parser.parseMovePiece('９一飛角', undefined)).toBeNull();
      expect(parser.parseMovePiece('９一金', '成')).toBeNull();
    });
  });

  describe('Kif.prototype.parseMoveTime(time)', function() {
    it('消費時間を秒になおして返す', function() {
      expect(parser.parseMoveTime('0:10/00:00:00')).toEqual(10);
      expect(parser.parseMoveTime('10:20')).toEqual(620);
    });
    it('マッチしなければnullを返す', function() {
      expect(parser.parseMoveTime('10')).toBeNull();
    });
  });

  describe('Kif.prototype.parseMoveLine(line)', function() {
    it('"手数","指し手","移動元"でキャプチャ', function() {
      var res = parser.parseMoveLine('1 ７六歩(77)');

      expect(res[1]).toEqual('1');
      expect(res[2]).toEqual('７六歩');
      expect(res[3]).toBeUndefined();
      expect(res[4]).toEqual('77');
      expect(res[5]).toBeUndefined();

    });
    it('"手数","指し手(成銀)","移動元","時間"でキャプチャ', function() {
      var res = parser.parseMoveLine('1 ７三成銀(74)( 0:01/00:00:01)');

      expect(res[1]).toEqual('1');
      expect(res[2]).toEqual('７三成銀');
      expect(res[3]).toBeUndefined();
      expect(res[4]).toEqual('74');
      expect(res[5]).toEqual('0:01/00:00:01');
    });
    it('"手数","指し手J,"移動元","時間"でキャプチャ', function() {
      var res = parser.parseMoveLine('1 ７六歩(77)( 0:01/00:00:01)');

      expect(res[1]).toEqual('1');
      expect(res[2]).toEqual('７六歩');
      expect(res[3]).toBeUndefined();
      expect(res[4]).toEqual('77');
      expect(res[5]).toEqual('0:01/00:00:01');
    });

    it('"手数","指し手","装飾子(打)","時間"でキャプチャ', function() {
      var res = parser.parseMoveLine('31 ４三角打( 0:02/00:00:48)');

      expect(res[1]).toEqual('31');
      expect(res[2]).toEqual('４三角');
      expect(res[3]).toEqual('打');
      expect(res[4]).toBeUndefined();
      expect(res[5]).toEqual('0:02/00:00:48');
    });
    it('"手数","指し手","装飾子(成)","時間"でキャプチャ', function() {
      var res = parser.parseMoveLine('31 ４三角成(44)( 0:02/00:00:48)');

      expect(res[1]).toEqual('31');
      expect(res[2]).toEqual('４三角');
      expect(res[3]).toEqual('成');
      expect(res[4]).toEqual('44');
      expect(res[5]).toEqual('0:02/00:00:48');
    });

    it('マッチしなければnullを返す', function() {
      var res = parser.parseMoveLine('４三角打( 0:02/00:00:48)');

      expect(res).toBeNull();
    });
  });

  describe('Kif.prototype.parseMove(line)', function() {
    it('構文通りでない棋譜であればエラーを返す', function() {
      expect(function() { parser.parseMove('1 ７  六歩(77)   ( 0:01/00:00:01)');}).toThrow();
      expect(function() { parser.parseMove('1 ７6歩(77)   ( 0:01/00:00:01)');}).toThrow();
      expect(function() { parser.parseMove('1 ７六鳥(77)   ( 0:01/00:00:01)');}).toThrow();
      expect(function() { parser.parseMove('1 ７六(777)   ( 0:01/00:00:01)');}).toThrow();
    });
    it('最終手を意味する棋譜であればspecialプロパティを持つオブジェクトを返す', function() {
      expect(parser.parseMove('1 投了').special).toEqual('%TORYO');
      expect(parser.parseMove('1 詰み').special).toEqual('%TSUMI');
      expect(parser.parseMove('1 千日手').special).toEqual('%SENNICHITE');
      expect(parser.parseMove('1 中断').special).toEqual('%CHUDAN');
      expect(parser.parseMove('1 持将棋').special).toEqual('%JISHOGI');
      expect(parser.parseMove('1 反則負け').special).toEqual('%ILLEGAL_MOVE');
    });
    it('(timeあり)構文通りであれば必要なデータをオブジェクトで包んで返す', function() {
      var o = parser.parseMove('1 ７六歩(77)   ( 0:01/00:00:01)');
      expect(o.num).toBeDefined();
      expect(o.to).toBeDefined();
      expect(o.from).toBeDefined();
      expect(o.piece).toBeDefined();
      expect(o.time).toBeDefined();
    });
  });

  describe('Kif.prototype.nextLine(lines)', function() {
    it('配列中のコメントを除いた要素を順に返し、最後はnullを返す', function() {
      var line = ['foo', 'bar', '#foo', 'hoge'],
          nextline = parser.nextLine(line);

      expect(nextline()).toEqual('foo');
      expect(nextline()).toEqual('bar');
      expect(nextline()).toEqual('hoge');
      expect(nextline()).toBeNull();
    });
    it('最後の要素がコメントであるときnullを返す', function() {
      var line = ['foo', '#bar'],
          nextline = parser.nextLine(line);

      expect(nextline()).toEqual('foo');
      expect(nextline()).toBeNull();
    });
  });

  describe('Kif.prototype.splitSource(source)', function() {
    var sep1, sep2;

    beforeEach(function() {
      sep1 = '\n手数----指手---------消費時間--\n';
      sep2 = '\r手数----指手---------消費時間--\r';
    });


    it('文字列が正常にで区切られている', function() {
      var header = 'header',
          body = 'body';

      var res1 = parser.splitSource(header + sep1 + body);
      expect(res1[1]).toEqual('header');
      expect(res1[2]).toEqual('body');

      var res2 = parser.splitSource(header + sep2 + body);
      expect(res2[1]).toEqual('header');
      expect(res2[2]).toEqual('body');
    });
    it('セパレータが複数存在する場合は最短マッチで区切る', function() {
      var source =
            'header' +
            sep1 +
            'body' +
            sep1 +
            'body2',
          res = parser.splitSource(source);

      expect(res[1]).toEqual('header');
      expect(res[2]).toEqual('body\n手数----指手---------消費時間--\nbody2');
    });
    it('セパレータとなる文字列がなければnullを返す', function() {
      var source =
            'header' +
            '手数----指手---------消費時間--' + // 行頭と行末の改行がない
            'body',
          res = parser.splitSource(source);

      expect(res).toBeNull();
    });
  });


  describe('Kif.prototype.parse()', function() {
    it('ヘッダ情報があればheaderとbodyプロパティを持つオブジェクトを返す', function() {
      var p = parser.parse();
      expect(p.header).toBeDefined();
      expect(p.body).toBeDefined();
    });
    it('ヘッダ情報がなければheaderプロパティが必ずnullでbodyプロパティを持つオブジェクトを返す', function() {
      parser.source =
        '1 ７六歩(77)   ( 0:01/00:00:01)\n' +
        '2 ３四歩(33)   ( 0:01/00:00:01)\n'+
        '3 ２六歩(27)   ( 0:00/00:00:01)\n'+
        '4 ４二飛(82)   ( 0:01/00:00:02)\n'+
        '5 ６八玉(59)   ( 0:01/00:00:02)\n'+
        '6 ８八角成(22) ( 0:02/00:00:04)\n'+
        '7 同　銀(79)   ( 0:01/00:00:03)\n'+
        '8 ２二銀(31)   ( 0:02/00:00:06)\n'+
        '9 ７八玉(68)   ( 0:01/00:00:04)';

      var p = parser.parse();
      expect(p.header).toBeNull();
      expect(p.body).toBeDefined();
    });
  });
});
