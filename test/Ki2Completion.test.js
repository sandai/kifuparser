"use strict";

var Board = require('../lib/Board'),
    map = require('../lib/map'),
    Ki2Completion = require('../lib/Ki2Completion');

describe('Ki2Completion.js', function() {
  var ki2comp;

  beforeEach(function() {
    var header = {
      'handicap': 0 // 平手のhandicap
    },
        turn = 'black';

    ki2comp = new Ki2Completion(header, turn);
  });

  describe('Ki2Completion.prototype.initialize(header, turn)', function() {
    it('引数headerがnullであればthis.boardには平手のthis.boardが生成される', function() {
      var header = null,
          turn = 'black',
          comp = new Ki2Completion(header, turn);

      expect(comp.board.board).toEqual(ki2comp.board.board);
    });
    it('引数header.handicapがundefinedであればthis.boardには平手のthis.boardが生成される', function() {
      var header = {
        'handicap': undefined
      },
          turn = 'black',
          comp = new Ki2Completion(header, turn);

      expect(comp.board.board).toEqual(ki2comp.board.board);
    });
    it('引数header.handicapが"その他"でheader.boardがundefinedであればエラーを返す', function() {
      var header = {
        'handicap': map.handicap('その他'),
        'board': undefined
      };

      expect(function() {new Ki2Completion(header, 'black');}).toThrow();
    });
    it('引数header.handicapとheader.boardが存在した場合にはheader.boardを優先してthis.boardを生成する', function() {
      // boardは平手の配置ではない
      var header = {
        'handicap': map.handicap('平手'),
        'board': [0,-3,-4,-5,-8,-5,-4,-3,-2,
                  0,-7,0,0,0,0,0,-6,0,
                  -1,-1,-1,-1,-1,-1,-1,-1,-1,
                  0,0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,0,
                  0,0,1,0,0,0,0,0,0,
                  1,1,0,1,1,1,1,1,1,
                  0,6,0,5,0,0,0,7,0,
                  2,3,4,0,8,5,4,3,2]
      },
          comp = new Ki2Completion(header, 'black'),
          board = new Board(header.board, 'black', undefined);

      expect(comp.board.board).toEqual(board.board);
    });
    it('引数header.handicapが存在しheader.boardがundefinedであればheader.handicapのboardを生成する', function() {
      var header = {
        'handicap': map.handicap('香落ち'),
        'board': undefined
      },
          b = [-2,-3,-4,-5,-8,-5,-4,-3,0,
               0,-7,0,0,0,0,0,-6,0,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,
               0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,
               1,1,1,1,1,1,1,1,1,
               0,6,0,0,0,0,0,7,0,
               2,3,4,5,8,5,4,3,2],
          comp = new Ki2Completion(header, 'black'),
          board = new Board(b, 'black', undefined);

      expect(comp.board.board).toEqual(board.board);
    });
  });

  describe('Ki2Completion.prototype.complementMove(move)', function() {
    it('引数moveに移動元であるfromプロパティを追加して返す', function() {
      var move = {
        'turn': 'black',
        'to': [7, 6],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      },
          moveresult = {
            'turn': 'black',
            'to': [7, 6],
            'from': [7, 7],
            'piece': map.piece('歩'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined

          };

      expect(ki2comp.complementMove(move)).toEqual(moveresult);

    });

    it('引数moveに移動元であるfromプロパティを追加し成り駒であれば対応する数値に変換して返す', function() {
      var move1 = {
        'turn': 'black',
        'to': [7, 6],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      },
          move2 = {
            'turn': 'white',
            'to': [8, 4],
            'piece': map.piece('歩'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          },
          move3 = {
            'turn': 'black',
            'to': [3, 3],
            'piece': map.piece('角'),
            'relative': undefined,
            'motion': undefined,
            'modifier': '成'
          },
          moveresult = {
            'turn': 'black',
            'to': [3, 3],
            'from': [8, 8],
            'piece': map.piece('馬'),
            'relative': undefined,
            'motion': undefined,
            'modifier': '成'

          };

      // 角道あける
      ki2comp.complementMove(move1);
      // 後手の適当な手
      ki2comp.complementMove(move2);

      expect(ki2comp.complementMove(move3)).toEqual(moveresult);

    });
  });
  describe('Ki2Completion.prototype.advanceBoard(move)', function() {
    it('盤上で動かしようのない手を指していたらエラーを返す', function() {
      // 打ちようも指しようもない駒
      var move1 = {
        'turn': 'black',
        'to': [5, 5],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      },
          // 想定の動きと違う駒
          move2 = {
            'turn': 'black',
            'to': [7, 5],
            'piece': map.piece('歩'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          };

      // その他いろいろあるが、まあいいや

      expect(function() {ki2comp.advanceBoard(move1);}).toThrow();
      expect(function() {ki2comp.advanceBoard(move2);}).toThrow();
    });

    it('fromとpieceプロパティを持つオブジェクトを返す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 6],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      },
          obj = ki2comp.advanceBoard(move);

      expect(obj.from).toBeDefined();
      expect(obj.piece).toBeDefined();
    });
  });
  describe('Ki2Completion.prototype.recessionBoard(index)', function() {
    it('board.restoreMoveRecord()が問題なければこれも大丈夫', function() {
      // だいじょーぶ
    });
  });

  describe('Ki2Completion.prototype.getLastMoveTurn()', function() {
    it('board.getTurn()が問題なければだいじょうぶ', function() {
      // だいじょうぶだいじょうぶ
    });
  });
  describe('Ki2Completion.prototype.checkVariationNumber(num)', function() {
    it('変化の値がboard.recordより小さければtrueを返しそうでなければfalseを返す', function() {
      var move1 = {
        'turn': 'black',
        'to': [7, 6],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      },
          move2 = {
            'turn': 'white',
            'to': [8, 4],
            'piece': map.piece('歩'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          },
          move3 = {
            'turn': 'black',
            'to': [3, 3],
            'piece': map.piece('角'),
            'relative': undefined,
            'motion': undefined,
            'modifier': '成'
          };

      ki2comp.complementMove(move1);
      ki2comp.complementMove(move2);
      ki2comp.complementMove(move3);

      expect(ki2comp.checkVariationNumber(3)).toBeTruthy();
      expect(ki2comp.checkVariationNumber(4)).toBeFalsy();
    });
  });
  describe('Ki2Completion.prototype.getInitPlacement(key)', function() {
    // Util.prototype.refInitialPlacementMapが問題なければ大丈夫
    it('強制的に平手を返す', function() {
      expect(ki2comp.getInitPlacement(100)).toEqual(map.initialPlacement(map.handicap('平手')));
    });
  });
});
