"use strict";

var KifuBuilder = require('../lib/KifuBuilder'),
    map = require('../lib/map');

describe('KifuBuilder.js', function() {
  var kifubuilder, header, body;

  beforeEach(function() {
    header = {'dummy': 'dymmy'};
    body = {'main': [{}]};

    kifubuilder = new KifuBuilder({'header': header, 'body': body});
  });

  describe('KifuBuilder Constructor', function() {
    it('this.kifuは空のオブジェクトである', function() {
      expect(kifubuilder.kifu).toEqual({});
    });
    it('this.headerはobj.headerである', function() {
      expect(kifubuilder.header).toEqual(header);
    });
    it('obj.headerがnullであればthis.headerには空オブジェクトが入る', function() {
      var header = null;
      kifubuilder = new KifuBuilder({'header': header, 'body': body});
      expect(kifubuilder.header).toEqual({});
    });
    it('this.bodyはobj.bodyである', function() {
      expect(kifubuilder.body).toEqual(body);
    });
  });

  describe('KifuBuilder Class Method', function() {
    it('KifuBuilder.createMainObject()は空オブジェクトを持つ配列を返す', function() {
      expect(KifuBuilder.createMainObject()).toEqual([{}]);
    });
    it('KifuBuilder.createVariationsObject()は空配列を返す', function() {
      expect(KifuBuilder.createVariationsObject()).toEqual([]);
    });
    it('KifuBuilder.createHeaderObject()は空オブジェクトを返す', function() {
      expect(KifuBuilder.createHeaderObject()).toEqual({});
    });
  });

  describe('KifuBuilder.prototype.getKifuObject()', function() {
    it('this.kifuを返す', function() {
      expect(kifubuilder.getKifuObject()).toBe(kifubuilder.kifu);
    });
  });

  describe('KifuBuilder.prototype.getKifuJSON()', function() {
    it('this.kifuをJSONにして返す', function() {
      kifubuilder.build();
      expect(kifubuilder.getKifuJSON()).toBe('{"header":{"dummy":"dymmy","handicap":0,"moves":0,"turn":true},"source":[{}]}');
    });
  });

  describe('KifuBuilder.prototype.build()', function() {
    beforeEach(function () {
      spyOn(kifubuilder, 'buildHeader');
      spyOn(kifubuilder, 'buildBody');
    });

    it('buildHeader()とbuildBody()を呼び出している', function() {
      kifubuilder.build();
      expect(kifubuilder.buildHeader).toHaveBeenCalled();
      expect(kifubuilder.buildBody).toHaveBeenCalled();
    });
  });

  describe('KifuBuilder.prototype.buildHeader()', function() {
    beforeEach(function () {
      spyOn(kifubuilder, 'addTurnToHeader');
      spyOn(kifubuilder, 'addHandicapToHeader');
      spyOn(kifubuilder, 'addMovesToHeader');
    });

    it('this.header.turnがundefinedならaddTurnToHeader()を呼び出している', function() {
      kifubuilder.buildHeader();
      expect(kifubuilder.addTurnToHeader).toHaveBeenCalled();
    });
    it('this.header.handicapがundefinedならaddHandicapToHeader()を呼び出している', function() {
      kifubuilder.buildHeader();
      expect(kifubuilder.addHandicapToHeader).toHaveBeenCalled();
    });
    it('this.header.movesがundefinedならaddMovesToHeader()を呼び出している', function() {
      kifubuilder.buildHeader();
      expect(kifubuilder.addMovesToHeader).toHaveBeenCalled();
    });
    it('this.headerを返す', function() {
      expect(kifubuilder.buildHeader()).toBe(kifubuilder.header);
    });
  });

  describe('KifuBuilder.prototype.addTurnToHeader()', function() {
    it('this.header.turnがなければ強制的に先手を意味するtrueを追加', function() {
      kifubuilder.addTurnToHeader();
      expect(kifubuilder.header.turn).toBeTruthy();
    });
  });

  describe('KifuBuilder.prototype.addHandicapToHeader(handicap)', function() {
    it('this.header.handicapに引数handicapの値を代入', function() {
      kifubuilder.addHandicapToHeader(map.handicap('平手'));
      expect(kifubuilder.header.handicap).toEqual(map.handicap('平手'));
    });
  });

  describe('KifuBuilder.prototype.addMovesToHeader()', function() {
    it('obj.movesがなければthis.bodyのオブジェクトの数を数えて追加', function() {
      kifubuilder.addMovesToHeader();
      expect(kifubuilder.header.moves).toEqual(kifubuilder.body.main.length - 1);
    });
  });

  describe('KifuBuilder.prototype.addVariation(obj, variation)', function() {
    it('obj.variationsがなければvariationを配列で包んで作成', function() {
      var obj = {},
          variation = ['dummy'];

      kifubuilder.addVariation(obj, variation);
      expect(obj.variations).toEqual([['dummy']]);
    });
    it('既にobj.variationsがあるならvariationsにvariationを追加', function() {
      var obj = {},
          variation = ['dummy'];

      kifubuilder.addVariation(obj, variation);
      kifubuilder.addVariation(obj, variation);
      expect(obj.variations).toEqual([['dummy'], ['dummy']]);
    });
  });

  describe('KifuBuilder.prototype.getVariationMove(stack, moves)', function() {
    var stack, moves, ret;

    beforeEach(function () {
      stack = [
        [0, ['棋譜1','棋譜2']],
        [1, ['棋譜3']],
        [2, ['棋譜4']]];
      moves = 1;
    });

    it('「moves <= ノードが持つ数値」にあてはまるノードを全て削除', function() {
      ret = kifubuilder.getVariationMove(stack, moves);
      expect(stack).toEqual([ [0, ['棋譜1','棋譜2'] ] ]);
    });

    it('残ったトップノードの棋譜を持つ配列からmovesをインデックスに値を返す', function() {
      expect(ret).toEqual('棋譜2');
    });
  });

  describe('KifuBuilder.prototype.buildBody()', function() {
    it('変化があれば本筋の棋譜に追加して返す', function() {
      var body = {
        'main':[
          {},
          {'move': '棋譜1'},
          {'move': '棋譜2'},
          {'move': '棋譜3'},
          {'move': '棋譜4'}],
        'variations': [
          [2, [{'move': '棋譜5'}, {'move': '棋譜6'}]],
          [3, [{'move': '棋譜7'}]],
          [1, [{'move': '棋譜8'}]],
          [1, [{'move': '棋譜9'}]]
        ]
      },
          obj  = [
            {},
            {'move': '棋譜1', 'variations': [[{'move': '棋譜8'}], [{'move': '棋譜9'}]]},
            {'move': '棋譜2',
             'variations': [[{'move': '棋譜5'}, {'move': '棋譜6', 'variations': [[{'move': '棋譜7'}]]}]]},
            {'move': '棋譜3'},
            {'move': '棋譜4'}];

      kifubuilder.body = body;

      expect(kifubuilder.buildBody()).toEqual(obj);
    });
  });
});
