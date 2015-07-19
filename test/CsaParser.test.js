"use strict";

var CsaParser = require('../lib/CsaParser');

var csa_source = require('raw!./sample/csa.csa');

describe('CsaParser.js', function() {
  var parser;

  beforeEach(function() {
    parser = new CsaParser(csa_source, 'Csa');
  });

  describe('Csa Constructor', function() {
    it('this.sourceは引数のsourceである', function() {
      expect(parser.source).toEqual(csa_source);
    });
    it('this.formatは"Kif"文字列である', function() {
      expect(parser.format).toEqual('Csa');
    });
  });

  describe('Kif.prototype.parseHeaderBoard(board)', function() {
    it('開始盤面をパースしてそれぞれ駒の数値を持った配列を返す',function() {
      var board =
            ['P1-KY-KE-GI-KI-OU-KI-GI-KE-KY',
             'P2 * -HI *  *  *  *  * -KA * ',
             'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU',
             'P4 *  *  *  *  *  *  *  *  * ',
             'P5 *  *  *  *  *  *  *  *  * ',
             'P6 *  *  *  *  *  *  *  *  * ',
             'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU',
             'P8 * +KA *  *  *  *  * +HI * ',
             'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY'];

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

  describe('Csa.prototype.parseHeaderHand(hand)', function() {
    it('持ち駒をひとつずつ数値で表し配列でまとめて返す',function() {
      var hand = 'P+00KA00KE00KY00FU00FU',
          comp = {'KA': 1, 'KE': 1, 'KY': 1, 'FU': 2};

      expect(parser.parseHeaderHand(hand)).toEqual(comp);
    });
  });

  describe('Csa.prototype.parseHeader(header)', function() {
    it('棋譜情報をパースして決められた形式のオブジェクトで返す', function() {
      var header =
            'V2.2\n' +
            'N+中村太地\n' +
            'N-羽生善治\n' +
            '$EVENT:第61期王座戦五番勝負　第１局\n' +
            '$SITE:宮城・仙台ロイヤルパークホテル\n' +
            '$START_TIME:2013/09/04 09:00\n' +
            '$END_TIME:2013/09/04 22:21\n' +
            '$TIME_LIMIT:各５時間\n' +
            '$OPENING:横歩取り\n'  +
            'P1-KY-KE-GI-KI-OU-KI-GI-KE-KY\n' +
            'P2 * -HI *  *  *  *  * -KA * \n' +
            'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU\n' +
            'P4 *  *  *  *  *  *  *  *  * \n' +
            'P5 *  *  *  *  *  *  *  *  * \n' +
            'P6 *  *  *  *  *  *  *  *  * \n' +
            'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU\n' +
            'P8 * +KA *  *  *  *  * +HI * \n' +
            'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY\n' +
            '+';

      var comp = {
        'date': {
          'start': '2013/09/04 09:00',
          'end': '2013/09/04 22:21'
        },
        'event': '第61期王座戦五番勝負　第１局',
        'time': {
          'limit': '各５時間'
        },
        'site': '宮城・仙台ロイヤルパークホテル',
        'handicap': 0,
        'players': {
          'black': '中村太地',
          'white': '羽生善治'
        },
        'opening': '横歩取り',
        'turn': true
      };

      expect(parser.parseHeader(header)).toEqual(comp);
    });
    it('局面図が正しくない場合エラーを返す', function() {
      // Pがない
      var header1 =
            'P1-KY-KE-GI-KI-OU-KI-GI-KE-KY\n' +
            'P2 * -HI *  *  *  *  * -KA * \n' +
            'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU\n' +
            '4 *  *  *  *  *  *  *  *  * \n' +
            'P5 *  *  *  *  *  *  *  *  * \n' +
            'P6 *  *  *  *  *  *  *  *  * \n' +
            'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU\n' +
            'P8 * +KA *  *  *  *  * +HI * \n' +
            'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY';

      // Pに続く数値が間違っている
      var header2 =
            'P1-KY-KE-GI-KI-OU-KI-GI-KE-KY\n' +
            'P2 * -HI *  *  *  *  * -KA * \n' +
            'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU\n' +
            'P5 *  *  *  *  *  *n  *  *  * \n' +
            'P5 *  *  *  *  *  *  *  *  * \n' +
            'P6 *  *  *  *  *  *  *  *  * \n' +
            'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU\n' +
            'P8 * +KA *  *  *  *  * +HI * \n' +
            'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY';

      expect(function() { parser.parseHeader(header1); }).toThrow();
      expect(function() { parser.parseHeader(header2); }).toThrow();
    });
  });

  describe('Csa.prototype.parseBodyComment(comment)', function() {
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

  describe('Csa.prototype.parseBody(body)', function() {
    it('棋譜をパースして決められた形式のオブジェクトで返す', function() {
      var body = '+\n' +
            '+6437KA\n' +
            'T0\n' +
            '\'*コメントあいうえお\n' +
            '\'*\n' +
            '\'*コメントあいうえお\n' +
            '-2637RY\n' +
            'T100\n' +
            '+3837GI\n' +
            'Tmisstime\n' +
            '%TORYO';

      var comp = {'main':[
        {},
        {'move':{'turn': true, 'to':[3,7], 'from':[6,4], 'piece':6},
         'time':0,
         'comment':'コメントあいうえお\n\nコメントあいうえお'},
        {'move':{'turn': false, 'to':[3,7], 'from':[2,6], 'piece':14},
         'time':100},
        {'move':{'turn': true, 'to':[3,7], 'from':[3,8], 'piece':4},
         'time':0},
        {'special':'%TORYO'}]};

      expect(parser.parseBody(body)).toEqual(comp);
    });
    it('本筋の棋譜が無ければエラーを返す', function() {
      expect(function() {parser.parseBody('');}).toThrow();
    });
  });

  describe('Csa.prototype.turnToBoolean(turn)', function() {
    it('引数turnが"+"であればtrueを返し、"-"であればfalseを返す', function() {
      expect(parser.turnToBoolean('+')).toBeTruthy();
      expect(parser.turnToBoolean('-')).toBeFalsy();
    });
  });

  describe('Csa.prototype.turnCheck(turn, mturn)', function() {
    it('引数turnとmturnの値が同じでなければエラーを返す', function() {
      var mturn = '-';

      expect(function() { parser.turnCheck('+', mturn); }).toThrow();
    });
    it('引数turnが"+"であれば"-"を返し、"-"であれば"+"を返す', function() {
      var mturn1 = '+',
          mturn2 = '-';

      expect(parser.turnCheck('+', mturn1)).toEqual('-');
      expect(parser.turnCheck('-', mturn2)).toEqual('+');
    });
  });

  describe('Csa.prototype.parseMovePiece(piece)', function() {
    it('Util.prototype.refCsaPiece(key)のテストが通っていれば問題ない', function() {
      // Util.prototype.refCsaPiece(key)のテストが通っていれば問題ない
    });
    it('駒を判定できなければnullを返す', function() {
      expect(parser.parseMovePiece('FF')).toBeNull();
    });
  });

  describe('Csa.prototype.parseMoveLine(line)', function() {
    it('"手番", "移動前の位置", "移動後の位置", "移動後の駒種"でキャプチャ', function() {
      var res = parser.parseMoveLine('+7776FU');

      expect(res[1]).toEqual('+');
      expect(res[2]).toEqual('77');
      expect(res[3]).toEqual('76');
      expect(res[4]).toEqual('FU');
    });
    it('マッチしなければnullを返す', function() {
      // 順番が間違い
      expect(parser.parseMoveLine('+FU2819')).toBeNull();
      // 駒種が小文字
      expect(parser.parseMoveLine('+7776fu')).toBeNull();
      // 数値がおかしい
      expect(parser.parseMoveLine('+76776fu')).toBeNull();
    });
  });

  describe('Csa.prototype.parseMove(line)', function() {
    it('構文通りでない棋譜はエラーを返す', function() {
      expect(function() { parser.parseMove('+-7776FU'); }).toThrow();
      expect(function() { parser.parseMove('+ 7776FU'); }).toThrow();
      expect(function() { parser.parseMove('7776FU'); }).toThrow();
      expect(function() { parser.parseMove('+7776HA'); }).toThrow();
    });
    it('構文通りであれば必要なデータをオブジェクトで包んで返す', function() {
      var o = parser.parseMove('+7776FU');
      expect(o.turn).toBeDefined();
      expect(o.to).toBeDefined();
      expect(o.from).toBeDefined();
      expect(o.piece).toBeDefined();
    });
  });

  describe('Csa.prototype.eachSepComma(lines)', function() {
    it('配列の各要素のうち","があれば分割して無かった要素と共にひとつの配列で返す', function() {
      var body = [
        '+7776FU,T0',
        '-7776FU',
        'T0',
        '%TORYO',
        '\'*あいうえお',
        '-7776FU,T10,+7776FU,T0'];
      var comp = [
        '+7776FU',
        'T0',
        '-7776FU',
        'T0',
        '%TORYO',
        '\'*あいうえお',
        '-7776FU',
        'T10',
        '+7776FU',
        'T0'];

      expect(parser.eachSepComma(body)).toEqual(comp);
    });
  });

  describe('Csa.prototype.nextLine(lines)', function() {
    it('配列中のコメントを除いた要素を順に返し、最後はnullを返す', function() {
      var lines = ['foo', 'bar', '\'foo', 'hoge'],
          nextline = parser.nextLine(lines);

      expect(nextline()).toEqual('foo');
      expect(nextline()).toEqual('bar');
      expect(nextline()).toEqual('hoge');
      expect(nextline()).toBeNull();
    });
    it('最後の要素がコメントであるときnullを返す', function() {
      var lines = ['foo', '\'bar'],
          nextline = parser.nextLine(lines);

      expect(nextline()).toEqual('foo');
      expect(nextline()).toBeNull();
    });
  });

  describe('Csa.prototype.separatorSource(source)', function() {
    it('文字列が正常に区切られている', function() {
      var source1 = 'header1 body1',
          source2 = 'header2 body2',
          source3 = 'header3 body3',
          sep = '\n\/\n';

      var res = parser.separatorSource(source1 + sep + source2 + sep + source3);
      expect(res).toEqual(source1);
    });
    it('セパレータとなる文字列がなければそのままの値を返す', function() {
      var source = 'header1 body1';

      var res = parser.separatorSource(source);
      expect(res).toEqual(source);
    });
  });

  describe('Csa.prototype.splitSource(source)', function() {
    var sep1, sep2;

    beforeEach(function() {
      sep1 = '\n+\n';
      sep2 = '\r-\r';
    });

    it('文字列が正常に区切られている', function() {
      var header = 'header',
          body = 'body';

      var res1 = parser.splitSource(header + sep1 + body);
      expect(res1[0]).toEqual('header\n+');
      expect(res1[1]).toEqual('+\nbody');

      var res2 = parser.splitSource(header + sep2 + body);
      expect(res2[0]).toEqual('header\r-');
      expect(res2[1]).toEqual('-\rbody');
    });
    it('セパレータが複数存在する場合は最短マッチで区切る', function() {
      var source =
            'header' +
            '\n+\n' +
            'body' +
            '\n+\n' +
            'body2',
          res = parser.splitSource(source);

      expect(res[0]).toEqual('header\n+');
      expect(res[1]).toEqual('+\nbody\n+\nbody2');
    });
    it('セパレータとなる文字列がなければnullを返す', function() {
      var source =
            'header' +
            'body',
          res = parser.splitSource(source);

      expect(res).toBeNull();
    });
  });

  describe('Csa.prototype.parse()', function() {
    it('手番がなければエラーを返す', function() {
      parser.source =
        '+6437KA\n' +
        'T0\n' +
        '\'*コメントあいうえお\n' +
        '\'*\n' +
        '\'*コメントあいうえお\n' +
        '-2637RY\n' +
        'T100\n' +
        '+3837GI\n' +
        'T0\n' +
        '%TORYO';

      expect(function() {parser.parse();}).toThrow();
    });
    it('ヘッダ情報があればheaderとbodyプロパティを持つオブジェクトを返す', function() {
      var p = parser.parse();

      expect(p.header).toBeDefined();
      expect(p.body).toBeDefined();
    });
    it('ヘッダ情報がなければheaderプロパティが必ず手番のみでbodyプロパティを持つオブジェクトを返す', function() {
      parser.source =
        '-\n' +
        '-6437KA\n' +
        'T0\n' +
        '\'*コメントあいうえお\n' +
        '\'*\n' +
        '\'*コメントあいうえお\n' +
        '+2637RY\n' +
        'T100\n' +
        '-3837GI\n' +
        'T0\n' +
        '%TORYO';

      var p = parser.parse();
      expect(p.header).toEqual({'turn':false});
      expect(p.body).toBeDefined();
    });
  });
});
