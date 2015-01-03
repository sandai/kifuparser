"use strict";

var PieceList = require('../lib/PieceList'),
    Piece = require('../lib/Piece');

describe('PieceList.js', function() {
  var piecelist, piece;

  beforeEach(function() {
    piecelist = new PieceList(14);
    piece = new Piece(0, 'black', 7, 6);
  });

  describe('Piecelist.prototype.initialize(num)', function() {
    it('this.listを初期化する', function() {
      var p = new PieceList(5);
      expect(p.list).toEqual([[], [], [], [], [], []]);
    });
  });

  describe('Piecelist.prototype.add(piece)', function() {
    it('引数piece.pieceの値に対応するthis.listの要素の配列にpieceを追加する', function() {
      piecelist.add(piece);
      expect(piecelist.list[piece.piece][0]).toBe(piece);
    });
  });

  describe('Piecelist.prototype.remove(piece, pieceindex)', function() {

    beforeEach(function() {
      spyOn(piecelist, 'getPieceIndex');
    });

    it('引数piece.pieceの値に対応するthis.listの要素の配列からpieceを削除する', function() {
      var p1 = new Piece(0, 'black', 7, 6),
          p2 = new Piece(0, 'black', 1, 6),
          p3 = new Piece(0, 'white', 4, 6);

      piecelist.add(p1);
      expect(piecelist.list[p1.piece][0]).toBe(p1);
      piecelist.add(p2);
      expect(piecelist.list[p2.piece][1]).toBe(p2);
      piecelist.add(p3);
      expect(piecelist.list[p2.piece][2]).toBe(p3);

      piecelist.remove(p2, 1);
      expect(piecelist.list[p2.piece][1]).toBe(p3);
      piecelist.remove(p3, 1);
      expect(piecelist.list[p3.piece][1]).toBeUndefined();
      piecelist.remove(p1, 0);
      expect(piecelist.list[p1.piece][0]).toBeUndefined();
    });
    it('引数pieceindexがundefinedであればthis.getPieceIndex()を呼び出して削除する', function() {
      piecelist.add(piece);
      expect(piecelist.list[piece.piece][0]).toBe(piece);

      piecelist.remove(piece);
      expect(piecelist.list[piece.piece][0]).toBeUndefined();
      expect(piecelist.getPieceIndex).toHaveBeenCalled();
    });
  });

  describe('Piecelist.prototype.getPieces(listIndex)', function() {
    it('引数listIndexをインデックスにthis.listの要素を取得する', function() {
      expect(piecelist.getPieces(5)).toBe(piecelist.list[5]);
    });
  });

  describe('Piecelist.prototype.getPiecesCount(listIndex)', function() {
    it('引数listIndexをインデックスにthis.listの長さを取得する', function() {
      var p1 = new Piece(0, 'black', 7, 6),
          p2 = new Piece(0, 'black', 1, 6),
          p3 = new Piece(0, 'white', 4, 6);

      piecelist.add(p1);
      expect(piecelist.list[p1.piece][0]).toBe(p1);
      piecelist.add(p2);
      expect(piecelist.list[p2.piece][1]).toBe(p2);
      piecelist.add(p3);
      expect(piecelist.list[p2.piece][2]).toBe(p3);

      expect(piecelist.getPiecesCount(0)).toBe(3);
    });
  });

  describe('Piecelist.prototype.getPieceIndex(piece)', function() {
    it('引数pieceのインデックスを返す', function() {
      var p1 = new Piece(0, 'black', 7, 6),
          p2 = new Piece(0, 'black', 1, 6),
          p3 = new Piece(0, 'white', 4, 6);

      piecelist.add(p1);
      expect(piecelist.list[p1.piece][0]).toBe(p1);
      piecelist.add(p2);
      expect(piecelist.list[p2.piece][1]).toBe(p2);
      piecelist.add(p3);
      expect(piecelist.list[p2.piece][2]).toBe(p3);

      expect(piecelist.getPieceIndex(p1)).toBe(0);
      expect(piecelist.getPieceIndex(p2)).toBe(1);
      expect(piecelist.getPieceIndex(p3)).toBe(2);
    });
  });
});
