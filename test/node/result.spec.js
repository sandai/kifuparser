"use strict";

var kifuParser = require('../../index.js'),
    fs = require('fs');

var kif_source = fs.readFileSync('./test/sample/kif.kif', 'utf-8'),
    ki2_source = fs.readFileSync('./test/sample/ki2.ki2', 'utf-8'),
    csa_source = fs.readFileSync('./test/sample/csa.csa', 'utf-8'),
    kif_v_source = fs.readFileSync('./test/sample/kif_variation.kif', 'utf-8'),
    ki2_v_source = fs.readFileSync('./test/sample/ki2_variation.ki2', 'utf-8'),
    kif_b_source = fs.readFileSync('./test/sample/kif_board.kif', 'utf-8'),
    ki2_b_source = fs.readFileSync('./test/sample/ki2_board.ki2', 'utf-8'),
    csa_b_source = fs.readFileSync('./test/sample/csa_board.csa', 'utf-8');

describe('Parser result Test for Node', function() {
  var excludeTimeTest;

  beforeEach(function() {
    // move.timeはki2とkifでは絶対にtoEqualにはならないので、timeを除いて検査
    excludeTimeTest = function(a, b) {
      for(var i = 0, l = a.length; i < l; i++) {
        if(typeof(a[i].move) === 'undefined') {
          expect(a[i]).toEqual(b[i]);
          continue;
        }

        if(typeof(a[i].variations) !== 'undefined') {
          for(var j = 0, jl =  a[i].variations.length; j < jl; j++) {
            excludeTimeTest(a[i].variations[j], b[i].variations[j]);
          }
        }

        expect(a[i].comment).toEqual(b[i].comment);
        expect(a[i].move.to).toEqual(b[i].move.to);
        expect(a[i].move.from).toEqual(b[i].move.from);
        expect(a[i].move.piece).toEqual(b[i].move.piece);
        expect(a[i].move.turn).toEqual(b[i].move.turn);
      }
    };
  });

  describe('Output', function() {
    it('JavaScriptオブジェクトの棋譜データを返す', function() {
      var kif = kifuParser(kif_source, 'Kif', false);
      expect(typeof(kif)).toEqual('object');
      expect(kif.source).toBeDefined();
    });
    it('JSON形式の棋譜データを返す', function() {
      var kif = kifuParser(kif_source, 'Kif', true);
      expect(typeof(kif)).toEqual('string');
      expect(kif).toEqual(JSON.stringify(kifuParser(kif_source, 'Kif', false)));
    });
  });


  describe('Normal', function() {
    it('Kif形式とKi2形式のパーサ結果が等しい',function() {
      var kif = kifuParser(kif_source, 'Kif', false),
          ki2 = kifuParser(ki2_source, 'Ki2', false);

      expect(kif.header).toEqual(ki2.header);
      expect(kif.source).toEqual(ki2.source);
    });
    it('Kif形式とCsa形式のパーサ結果が等しい',function() {
      var kif = kifuParser(kif_source, 'Kif', false),
          csa = kifuParser(csa_source, 'Csa', false);

      // Csa形式にはない棋譜情報なのでテスト用につけている
      csa.header.moves = 141;
      csa.header.title = '王座戦';
      csa.header.time.used = {
        'black': 294,
        'white': 299
      };

      expect(kif.header).toEqual(csa.header);
      expect(kif.source).toEqual(csa.source);
    });
    it('Ki2形式とcsa形式のパーサ結果が等しい',function() {
      var ki2 = kifuParser(ki2_source, 'Ki2', false),
          csa = kifuParser(csa_source, 'Csa', false);

      // Csa形式にはない棋譜情報なのでテスト用につけている
      csa.header.moves = 141;
      csa.header.title = '王座戦';
      csa.header.time.used = {
        'black': 294,
        'white': 299
      };

      expect(ki2.header).toEqual(csa.header);
      expect(ki2.source).toEqual(csa.source);
    });
  });

  describe('Variations', function() {
    it('Kif形式とKi2形式の変化がある棋譜のパーサ結果が等しい',function() {
      var kif = kifuParser(kif_v_source, 'Kif', false);
      var ki2 = kifuParser(ki2_v_source, 'Ki2', false);

      expect(kif.header).toEqual(ki2.header);

      // move.time以外を検査
      excludeTimeTest(kif.source, ki2.source);
    });
  });

  describe('Have board', function() {
    it('Kif形式とKi2形式の開始局面がある棋譜のパーサ結果が等しい',function() {
      var kif = kifuParser(kif_b_source, 'Kif', false);
      var ki2 = kifuParser(ki2_b_source, 'Ki2', false);

      expect(kif.header).toEqual(ki2.header);

      // move.time以外を検査
      excludeTimeTest(kif.source, ki2.source);
    });
    it('Ki2形式とCsa形式の開始局面がある棋譜のパーサ結果が等しい',function() {
      var ki2 = kifuParser(ki2_b_source, 'Ki2', false);
      var csa = kifuParser(csa_b_source, 'Csa', false);

      expect(ki2.header).toEqual(csa.header);

      // move.time以外を検査
      excludeTimeTest(ki2.source, csa.source);
    });
  });
});
