"use strict";

var Board = require('../lib/Board'),
    Piece = require('../lib/Piece'),
    map = require('../lib/map');

describe('Board.js', function() {
  var board, advanceBoard;

  beforeEach(function() {
    var b =
          [-2,-3,-4,-5,-8,-5,-4,-3,-2,
           0,-7,0,0,0,0,0,-6,0,
           -1,-1,-1,-1,-1,-1,-1,-1,-1,
           0,0,0,0,0,0,0,0,0,
           0,0,0,0,0,0,0,0,0,
           0,0,0,0,0,0,0,0,0,
           1,1,1,1,1,1,1,1,1,
           0,6,0,0,0,0,0,7,0,
           2,3,4,5,8,5,4,3,2],
        turn = 'black',
        hands;

    board = new Board(b, turn, hands);

    advanceBoard = function(board, move) {
      var motionPiece = null,
          capturedPiece = null;

      motionPiece = board.findPiece(move);
      board.setTurn(move.turn);
      board.saveMoveRecord(motionPiece, move);
      capturedPiece = board.capturePiece(move.to[0], move.to[1]);
      board.movePiece(motionPiece, move.to[0], move.to[1]);

      if(move.modifier === '成') {
        board.promotePiece(motionPiece);
      }
    };
  });

  describe('Board.prototype.initialize(board, turn, hands)', function() {
    it('初期化処理', function() {
      var b =
            [-2,-3,-4,-5,-8,-5,-4,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,-1,-1,-1,-1,-1,-1,-1,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             1,1,1,1,1,1,1,1,1,
             0,6,0,0,0,0,0,7,0,
             2,3,4,5,8,5,4,3,2],
          turn = 'black',
          hands;

      var board = new Board(b, turn, hands);

      expect(board.boardPieces).toBeDefined();
      expect(board.handPieces).toBeDefined();
      expect(board.turn).toEqual('black');
      expect(board.board).toBeDefined();
      expect(board.record).toBeDefined();
    });
  });

  describe('Board.prototype.initializeHand(hands)', function() {
    it('引数handsを元にthis.HandPiecesを初期化', function() {
      var hands = {
        'black': {'HI': 2, 'KA': 1, 'KY': 1, 'FU': 1},
        'white': {'KA': 1, 'GI': 1, 'KE': 1, 'KY': 1}
      };

      board.initializeHand(hands);
      expect(board.handPieces.list[1].length).toEqual(1);
      expect(board.handPieces.list[2].length).toEqual(2);
      expect(board.handPieces.list[3].length).toEqual(1);
      expect(board.handPieces.list[4].length).toEqual(1);
      expect(board.handPieces.list[6].length).toEqual(2);
      expect(board.handPieces.list[7].length).toEqual(2);
    });
  });

  describe('Board.prototype.initializeBoard(board)', function() {
    it('引数boardを元にthis.boardを初期化', function() {
      var b =
            [-2,-3,-4,-5,-8,-5,-4,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,-1,-1,-1,-1,-1,-1,-1,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             1,1,1,1,1,1,1,1,1,
             0,6,0,0,0,0,0,7,0,
             2,3,4,5,8,5,4,3,2],
          index = 0;

      for(var i = 1; i <= 9; i++) {
        for(var j = 9; j >= 1; j--) {
          if(board.board[j][i] !== null) {
            if(board.board[j][i].player === 'black') {
              expect(board.board[j][i].piece).toEqual(b[index]);
            } else {
              expect(board.board[j][i].piece).toEqual(-b[index]);
            }
          }
          index += 1;
        }
      }
    });
  });

  describe('Board.prototype.setTurn(turn)', function() {
    it('引数turnをthis.turnに代入', function() {
      board.setTurn('てすと');
      expect(board.turn).toEqual('てすと');
    });
  });

  describe('Board.prototype.getTurn()', function() {
    it('this.turnを取得', function() {
      expect(board.getTurn()).toBe(board.turn);
    });
  });

  describe('Board.prototype.getRecord()', function() {
    it('this.recordを取得', function() {
      expect(board.getRecord()).toBe(board.record);
    });
  });

  describe('Board.prototype.findPiece(move)', function() {
    it('駒の動作に該当する駒を盤上から探しだして返す', function() {
      var movefu = {
        turn: 'black',
        to: [7, 6],
        piece: map.piece('歩'),
        relative: undefined,
        motion: undefined,
        modifier: undefined
      };

      var moveky = {
        turn: 'white',
        to: [1, 2],
        piece: map.piece('香'),
        relative: undefined,
        motion: undefined,
        modifier: undefined
      };

      var movegi = {
        turn: 'white',
        to: [7, 2],
        piece: map.piece('銀'),
        relative: undefined,
        motion: undefined,
        modifier: undefined
      };

      var moveki = {
        turn: 'black',
        to: [6, 8],
        piece: map.piece('金'),
        relative: undefined,
        motion: undefined,
        modifier: undefined
      };

      // これいじょうはめんどい
      expect(board.findPiece(movefu)).toBe(board.board[7][7]);
      expect(board.findPiece(moveky)).toBe(board.board[1][1]);
      expect(board.findPiece(movegi)).toBe(board.board[7][1]);
      expect(board.findPiece(moveki)).toBe(board.board[6][9]);
    });
    it('打ち駒を駒台から探しだして返す', function() {
      var b =
            [0,-3,-4,0,-8,-5,0,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,-1,-1,-1,-1,-1,-1,-1,
             0,0,0,0,0,-4,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,5,0,0,0,0,0,
             1,1,1,1,1,1,1,1,1,
             0,6,0,0,0,0,0,0,0,
             2,3,4,5,8,5,0,3,2],
          turn = 'black',
          hands = {
            'black': {'KI': 1, 'KY': 1},
            'white': {'HI': 1, 'GI': 1}
          };

      board = new Board(b, turn, hands);

      var moveki = {
        turn: 'black',
        to: [5, 5],
        piece: map.piece('金'),
        relative: undefined,
        motion: undefined,
        modifier: '打'
      };

      var moveky = {
        turn: 'black',
        to: [9, 8],
        piece: map.piece('香'),
        relative: undefined,
        motion: undefined,
        modifier: '打'
      };

      var movehi = {
        turn: 'white',
        to: [7, 2],
        piece: map.piece('飛'),
        relative: undefined,
        motion: undefined,
        modifier: '打'
      };

      var movegi = {
        turn: 'white',
        to: [4, 5],
        piece: map.piece('銀'),
        relative: undefined,
        motion: undefined,
        modifier: '打'
      };

      var piece = board.handPieces.list[5][0];
      expect(board.findPiece(moveki)).toBe(piece);

      piece = board.handPieces.list[2][0];
      expect(board.findPiece(moveky)).toBe(piece);

      piece = board.handPieces.list[7][0];
      expect(board.findPiece(movehi)).toBe(piece);

      piece = board.handPieces.list[4][0];
      expect(board.findPiece(movegi)).toBe(piece);
    });
    it('打ち駒だが"打"とついていない駒を駒台から探しだして返す', function() {
      var b =
            [0,-3,-4,0,-8,-5,0,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,-1,-1,-1,-1,-1,-1,-1,
             0,0,0,0,0,-4,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,5,0,0,0,0,0,
             1,1,1,1,1,1,1,1,1,
             0,6,0,0,0,0,0,0,0,
             2,3,4,5,8,5,0,3,2],
          turn = 'black',
          hands = {
            'black': {'KI': 1, 'KY': 1},
            'white': {'HI': 1, 'GI': 1}
          };

      board = new Board(b, turn, hands);

      var moveki = {
        turn: 'black',
        to: [5, 4],
        piece: map.piece('金'),
        relative: undefined,
        motion: undefined,
        modifier: undefined
      };

      var moveky = {
        turn: 'black',
        to: [9, 4],
        piece: map.piece('香'),
        relative: undefined,
        motion: undefined,
        modifier: '打'
      };

      var movehi = {
        turn: 'white',
        to: [7, 5],
        piece: map.piece('飛'),
        relative: undefined,
        motion: undefined,
        modifier: '打'
      };

      var movegi = {
        turn: 'white',
        to: [9, 5],
        piece: map.piece('銀'),
        relative: undefined,
        motion: undefined,
        modifier: '打'
      };

      var piece = board.handPieces.list[5][0];
      expect(board.findPiece(moveki)).toBe(piece);

      piece = board.handPieces.list[2][0];
      expect(board.findPiece(moveky)).toBe(piece);

      piece = board.handPieces.list[7][0];
      expect(board.findPiece(movehi)).toBe(piece);

      piece = board.handPieces.list[4][0];
      expect(board.findPiece(movegi)).toBe(piece);
    });
    it('いずれの駒にも該当しなければnullを返す', function() {
      var b =
            [0,-3,-4,0,-8,-5,0,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,-1,-1,-1,-1,-1,-1,-1,
             0,0,0,0,0,-4,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,5,0,0,0,0,0,
             1,1,1,1,1,1,1,1,1,
             0,6,0,0,0,0,0,0,0,
             2,3,4,5,8,5,0,3,2],
          turn = 'black',
          hands = {
            'black': {'KI': 1, 'KY': 1},
            'white': {'HI': 1, 'GI': 1}
          };

      board = new Board(b, turn, hands);

      var moveka = {
        turn: 'black',
        to: [5, 5],
        piece: map.piece('角'),
        relative: undefined,
        motion: undefined,
        modifier: undefined
      };

      var moveke = {
        turn: 'black',
        to: [7, 8],
        piece: map.piece('桂'),
        relative: undefined,
        motion: undefined,
        modifier: undefined
      };

      var movefu = {
        turn: 'white',
        to: [1, 5],
        piece: map.piece('歩'),
        relative: undefined,
        motion: undefined,
        modifier: '打'
      };

      var movehi = {
        turn: 'white',
        to: [5, 5],
        piece: map.piece('角'),
        relative: undefined,
        motion: undefined,
        modifier: undefined
      };

      expect(board.findPiece(moveka)).toBeNull();
      expect(board.findPiece(moveke)).toBeNull();
      expect(board.findPiece(movefu)).toBeNull();
      expect(board.findPiece(movehi)).toBeNull();
    });
  });

  describe('Board.prototype.capturePiece(file, rank)', function() {
    beforeEach(function() {
      spyOn(board.boardPieces, 'remove');
      spyOn(board.handPieces, 'add');
    });

    it('引数fileとrankの位置にある駒を取った場合に駒のデータを駒台用に変えて返す', function() {
      // piecesの中身も検査するように
      var piece = board.board[7][7];

      expect(piece.getPlayer()).toEqual('black');
      expect(piece.getFile()).toEqual(7);
      expect(piece.getRank()).toEqual(7);

      expect(board.capturePiece(7, 7)).toBe(board.board[7][7]);

      expect(piece.getPlayer()).toEqual('white');
      expect(piece.getFile()).toEqual(0);
      expect(piece.getRank()).toEqual(0);

      expect(board.boardPieces.remove).toHaveBeenCalled();
      expect(board.handPieces.add).toHaveBeenCalled();
    });
    it('引数fileとrankの位置に駒がなければnullを返す', function() {
      expect(board.board[7][6]).toBeNull();
    });
  });

  describe('Board.prototype.promotePiece(piece)', function() {
    beforeEach(function() {
      spyOn(board.boardPieces, 'add');
      spyOn(board.boardPieces, 'remove');
    });

    it('指した駒を成り駒のデータに変える', function() {
      var piece = board.board[7][9];

      expect(piece.getPiece()).toEqual(map.piece('銀'));

      board.promotePiece(piece);

      expect(piece.getPiece()).toEqual(map.piece('成銀'));
      expect(board.boardPieces.add).toHaveBeenCalled();
      expect(board.boardPieces.remove).toHaveBeenCalled();
    });
  });

  describe('Board.prototype.movePiece(piece, file, rank)', function() {
    it('this.board上で駒を移動させて移動先のデータに更新する', function() {
      var piece = board.board[7][7],
          file = 7,
          rank = 6;

      board.movePiece(piece, file, rank);
      expect(board.board[7][7]).toBeNull();
      expect(board.board[file][rank]).toBe(piece);
    });

    it('打ち駒であればthis.boardの移動元は変更しない', function() {
      var piece = new Piece(map.piece('銀'), 'black', 0, 0),
          file = 4,
          rank = 5;

      board.movePiece(piece, file, rank);

      expect(board.board[0]).toBeUndefined();
      expect(board.board[file][rank]).toBe(piece);
    });
  });

  describe('Board.prototype.checkPowerOfMove(piece, move)', function() {
    beforeEach(function() {
      var b =
            [0,-3,-4,-5,-8,-5,-4,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,-1,-1,-1,-1,-1,-1,-1,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,1,0,0,0,0,0,0,
             1,1,0,1,1,1,1,1,1,
             0,6,0,5,0,0,0,7,0,
             2,3,4,0,8,5,4,3,2],
          turn = 'black',
          hands;

      board = new Board(b, turn, hands);
    });

    it('自分の駒が移動先にあった場合にtrueを返す', function() {
      var piece = board.board[7][9],
          move = {
            'turn': 'black',
            'to': [6, 8],
            'piece': map.piece('銀'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          };

      expect(board.checkPowerOfMove(piece, move)).toBeTruthy();
    });
    it('駒が桂馬であればfalseを返す', function() {
      var piece = board.board[8][9],
          move = {
            'turn': 'black',
            'to': [7, 7],
            'piece': map.piece('桂'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          };

      expect(board.checkPowerOfMove(piece, move)).toBeFalsy();
    });
    it('打った先に駒があるならtrueでなければfalseを返す', function() {
      var piece = new Piece(map.piece('銀'), 'black', 0, 0),
          move1 = {
            'turn': 'black',
            'to': [5, 7],
            'piece': map.piece('銀'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          },
          move2 = {
            'turn': 'black',
            'to': [7, 8],
            'piece': map.piece('銀'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          };

      expect(board.checkPowerOfMove(piece, move1)).toBeTruthy();
      expect(board.checkPowerOfMove(piece, move2)).toBeFalsy();
    });
    it('飛車や角などの移動で移動先までに駒にぶつかればtrueでなければfalseを返す', function() {
      var piece1 = board.board[2][8],
          move1 = {
            'turn': 'black',
            'to': [7, 8],
            'piece': map.piece('飛'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          },
          piece2 = board.board[8][8],
          move2 = {
            'turn': 'black',
            'to': [3, 3],
            'piece': map.piece('角'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          },
          piece3 = board.board[2][2],
          move3 = {
            'turn': 'white',
            'to': [5, 5],
            'piece': map.piece('角'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          };

      expect(board.checkPowerOfMove(piece1, move1)).toBeTruthy();
      expect(board.checkPowerOfMove(piece2, move2)).toBeFalsy();
      expect(board.checkPowerOfMove(piece3, move3)).toBeTruthy();
    });
  });

  describe('Board.prototype.saveMoveRecord(movePiece, move)', function() {
    it('this.recordに一手ごとに必要なデータをオブジェクトで保持する', function() {
      var movePiece = new Piece(map.piece('飛'), 'black', 2, 8),
          move = {
            'turn': 'black',
            'to': [5, 8],
            'piece': map.piece('飛'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          };

      var movedPieceData = {
        'pieceObject': movePiece,
        'originPiece': movePiece.getPiece(),
        'originPosition': [movePiece.getFile(), movePiece.getRank()],
        'modifier': move.modifier
      };

      board.saveMoveRecord(movePiece, move);

      expect(board.record[0].turn).toEqual('black');
      expect(board.record[0].movedPieceData).toEqual(movedPieceData);
    });
    it('移動先に取る駒がある場合', function() {
      var movePiece = new Piece(map.piece('角'), 'black', 8, 8),
          move = {
            'turn': 'black',
            'to': [3, 3],
            'piece': map.piece('角'),
            'relative': undefined,
            'motion': undefined,
            'modifier': undefined
          },
          capturePiece = board.board[3][3];

      var movedPieceData = {
        'pieceObject': movePiece,
        'originPiece': movePiece.getPiece(),
        'originPosition': [movePiece.getFile(), movePiece.getRank()],
        'modifier': move.modifier
      },
          capturedPieceData = {
            'pieceObject': capturePiece,
            'originPiece': capturePiece.getPiece(),
            'originPosition': [capturePiece.getFile(), capturePiece.getRank()],
            'player': capturePiece.getPlayer()
          };

      board.saveMoveRecord(movePiece, move);

      expect(board.record[0].turn).toEqual('black');
      expect(board.record[0].movedPieceData).toEqual(movedPieceData);
      expect(board.record[0].capturedPieceData).toEqual(capturedPieceData);
    });
  });

  describe('Board.prototype.restoreDropPiece(data)', function() {
    beforeEach(function() {
      var b =
            [-2,-3,0,-5,-8,-5,-4,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,-1,-1,-1,-1,-1,-1,-1,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             1,1,1,1,1,1,1,1,1,
             0,6,0,0,0,0,0,7,0,
             2,3,4,5,8,5,4,3,2],
          turn = 'black',
          hands = {
            'black': {'GI': 1}
          };

      board = new Board(b, turn, hands);

      spyOn(board.boardPieces, 'remove');
      spyOn(board.boardPieces, 'add');
    });

    it('this.board上で打った駒を元に戻す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 5],
        'piece': map.piece('銀'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      };

      advanceBoard(board, move);

      var data = board.record[0].movedPieceData,
          piece = data.pieceObject;

      expect(board.board[5][5]).toBe(piece);

      board.restoreDropPiece(data);

      expect(board.board[5][5]).toBeNull();
      expect(board.boardPieces.remove).toHaveBeenCalled();
      expect(board.boardPieces.add).toHaveBeenCalled();
      expect(piece.getFile()).toEqual(0);
      expect(piece.getRank()).toEqual(0);
    });
  });

  describe('Board.prototype.restoreMovedPiece(data)', function() {
    beforeEach(function() {
      var b =
            [-2,-3,-4,-5,-8,-5,-4,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,0,-1,-1,-1,-1,-1,-1,
             0,0,1,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             1,1,0,1,1,1,1,1,1,
             0,6,0,0,0,0,0,7,0,
             2,3,4,5,8,5,4,3,2],
          turn = 'black',
          hands;

      board = new Board(b, turn, hands);

      spyOn(board.boardPieces, 'remove');
      spyOn(board.boardPieces, 'add');
    });

    it('this.board上で動かした駒を元に戻す', function() {
      var move = {
        'turn': 'white',
        'to': [9, 4],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      };

      advanceBoard(board, move);

      var data = board.record[0].movedPieceData,
          piece = data.pieceObject;

      expect(board.board[9][4]).toEqual(piece);
      expect(board.board[9][3]).toBeNull();

      board.restoreMovedPiece(data);

      expect(board.board[9][4]).toBeNull();
      expect(board.board[9][3]).toEqual(piece);
      expect(board.boardPieces.remove.calls.any()).toBeFalsy();
      expect(board.boardPieces.add.calls.any()).toBeFalsy();
    });
    it('this.board上で動かした成駒を元に戻す', function() {
      var move = {
        'turn': 'black',
        'to': [7, 3],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': '成'
      };

      advanceBoard(board, move);

      var data = board.record[0].movedPieceData,
          piece = data.pieceObject;

      expect(board.board[7][3]).toEqual(piece);
      expect(board.board[7][4]).toBeNull();

      board.restoreMovedPiece(data);

      expect(board.board[7][3]).toBeNull();
      expect(board.board[7][4]).toEqual(piece);
      expect(board.boardPieces.remove).toHaveBeenCalled();
      expect(board.boardPieces.add).toHaveBeenCalled();
    });
  });
  describe('Board.prototype.restoreCapturedPiece(data)', function() {
    beforeEach(function() {
      var b =
            [-2,-3,-4,-5,-8,-5,-4,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,0,-1,-1,-1,-14,-1,-1,
             0,0,1,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             1,1,0,1,1,1,1,1,1,
             0,6,0,0,0,0,0,0,0,
             2,3,4,5,8,5,4,3,2],
          turn = 'black',
          hands;

      board = new Board(b, turn, hands);

      spyOn(board.boardPieces, 'remove');
      spyOn(board.boardPieces, 'add');
    });


    it('this.board上で取った駒を元に戻す', function() {
      var move = {
        'turn': 'black',
        'to': [3, 3],
        'piece': map.piece('角'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      };

      advanceBoard(board, move);

      var data = board.record[0].capturedPieceData,
          piece = board.record[0].movedPieceData.pieceObject;

      expect(board.board[3][3]).toEqual(piece);
      expect(data.pieceObject.getPiece()).toEqual(map.piece('飛'));
      expect(data.pieceObject.getPlayer()).toEqual('black');
      expect(data.pieceObject.getFile()).toEqual(0);
      expect(data.pieceObject.getRank()).toEqual(0);

      board.restoreCapturedPiece(data);

      expect(board.board[3][3]).toBe(data.pieceObject);
      expect(data.pieceObject.getPiece()).toEqual(map.piece('龍'));
      expect(data.pieceObject.getPlayer()).toEqual('white');
      expect(data.pieceObject.getFile()).toEqual(3);
      expect(data.pieceObject.getRank()).toEqual(3);

      expect(board.boardPieces.remove).toHaveBeenCalled();
      expect(board.boardPieces.add).toHaveBeenCalled();
    });
  });

  describe('Board.prototype.restoreMoveRecord(index)', function() {
    beforeEach(function() {
      var b =
            [-2,-3,-4,-5,-8,-5,-4,-3,-2,
             0,-7,0,0,0,0,0,-6,0,
             -1,-1,-1,-1,-1,-1,-1,-1,-1,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,
             1,1,0,1,1,1,1,1,1,
             0,6,0,0,0,0,0,0,0,
             2,3,4,5,8,5,4,3,2],
          turn = 'black',
          hands = {
            'black': {'FU': 1}
          };

      board = new Board(b, turn, hands);

      spyOn(board, 'restoreDropPiece');
      spyOn(board, 'restoreMovedPiece');
      spyOn(board, 'restoreCapturedPiece');
    });

    it('this.board上で打ち駒を一手戻す場合にthis.restoreDropPieceだけを呼び出す', function() {
      var move = {
        'turn': 'black',
        'to': [7, 5],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      };

      advanceBoard(board, move);
      board.restoreMoveRecord(1);
      expect(board.restoreDropPiece).toHaveBeenCalled();
      expect(board.restoreMovedPiece.calls.any()).toBeFalsy();
      expect(board.restoreCapturedPiece.calls.any()).toBeFalsy();
    });

    it('this.board上で一手戻す場合にthis.restoreMovedPieceだけを呼び出している', function() {
      var move = {
        'turn': 'white',
        'to': [2, 4],
        'piece': map.piece('歩'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      };

      advanceBoard(board, move);
      board.restoreMoveRecord(1);
      expect(board.restoreDropPiece.calls.any()).toBeFalsy();
      expect(board.restoreMovedPiece).toHaveBeenCalled();
      expect(board.restoreCapturedPiece.calls.any()).toBeFalsy();
    });

    it('this.board上で打ち駒を一手戻す場合にthis.restoreDropPieceを呼び出している', function() {
      var move = {
        'turn': 'black',
        'to': [3, 3],
        'piece': map.piece('角'),
        'relative': undefined,
        'motion': undefined,
        'modifier': undefined
      };

      advanceBoard(board, move);
      board.restoreMoveRecord(1);
      expect(board.restoreDropPiece.calls.any()).toBeFalsy();
      expect(board.restoreMovedPiece).toHaveBeenCalled();
      expect(board.restoreCapturedPiece).toHaveBeenCalled();
    });
  });
});
