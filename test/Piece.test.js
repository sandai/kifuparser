"use strict";

var Piece = require('../lib/Piece'),
    map = require('../lib/map');

describe('Piece.js', function() {
  var piece;

  beforeEach(function() {
    piece = new Piece(1, 'black', 0, 0);
  });


  describe('Piece Constructor', function() {
    // めんどくせいらね
  });

  describe('Piece.prototype.getPiece()', function() {
    it('this.pieceを返す', function() {
      expect(piece.getPiece()).toEqual(1);
    });
  });

  describe('Piece.prototype.getFile()', function() {
    it('this.fileを返す', function() {
      expect(piece.getFile()).toEqual(0);
    });
  });

  describe('Piece.prototype.getRank()', function() {
    it('this.rankを返す', function() {
      expect(piece.getRank()).toEqual(0);
    });
  });

  describe('Piece.prototype.getPlayer()', function() {
    it('this.playerを返す', function() {
      expect(piece.getPlayer()).toEqual('black');
    });
  });

  describe('Piece.prototype.update(args)', function() {
    it('Pieceのフィールドの内容を引数で指定された値に変更する', function() {
      piece.update({
        'piece': 5,
        'file': 6,
        'rank': 5,
        'player': 'white'
      });

      expect(piece.getPiece()).toEqual(5);
      expect(piece.getFile()).toEqual(6);
      expect(piece.getRank()).toEqual(5);
      expect(piece.getPlayer()).toEqual('white');
    });
  });

  describe('Piece.prototype.promote()', function() {
    it('this.pieceの値を歩→と', function() {
      piece.update({'piece': map.piece('歩')});
      piece.promote();
      expect(piece.getPiece()).toEqual(map.piece('と'));
    });
    it('this.pieceの値を香→成香', function() {
      piece.update({'piece': map.piece('香')});
      piece.promote();
      expect(piece.getPiece()).toEqual(map.piece('成香'));
    });
    it('this.pieceの値を桂→成桂', function() {
      piece.update({'piece': map.piece('桂')});
      piece.promote();
      expect(piece.getPiece()).toEqual(map.piece('成桂'));
    });
    it('this.pieceの値を銀→成銀', function() {
      piece.update({'piece': map.piece('銀')});
      piece.promote();
      expect(piece.getPiece()).toEqual(map.piece('成銀'));
    });
    it('this.pieceの値を角→馬', function() {
      piece.update({'piece': map.piece('角')});
      piece.promote();
      expect(piece.getPiece()).toEqual(map.piece('馬'));
    });
    it('this.pieceの値を飛→龍', function() {
      piece.update({'piece': map.piece('飛')});
      piece.promote();
      expect(piece.getPiece()).toEqual(map.piece('龍'));
    });
  });

  describe('Piece.prototype.demote()', function() {
    it('this.pieceの値をと→歩', function() {
      piece.update({'piece': map.piece('と')});
      piece.captured();
      expect(piece.getPiece()).toEqual(map.piece('歩'));
    });
    it('this.pieceの値を成香→香', function() {
      piece.update({'piece': map.piece('成香')});
      piece.captured();
      expect(piece.getPiece()).toEqual(map.piece('香'));
    });
    it('this.pieceの値を成桂→桂', function() {
      piece.update({'piece': map.piece('成桂')});
      piece.captured();
      expect(piece.getPiece()).toEqual(map.piece('桂'));
    });
    it('this.pieceの値を成銀→銀', function() {
      piece.update({'piece': map.piece('成銀')});
      piece.captured();
      expect(piece.getPiece()).toEqual(map.piece('銀'));
    });
    it('this.pieceの値を馬→角', function() {
      piece.update({'piece': map.piece('馬')});
      piece.captured();
      expect(piece.getPiece()).toEqual(map.piece('角'));
    });
    it('this.pieceの値を龍→飛', function() {
      piece.update({'piece': map.piece('龍')});
      piece.captured();
      expect(piece.getPiece()).toEqual(map.piece('飛'));
    });
  });


  describe('Piece.prototype.captured()', function() {
    beforeEach(function () {
      spyOn(piece, 'demote');
    });

    it('fileとrankを0にして、playerを反転させ駒を降格させる', function() {
      piece.update({'player': 'black'});

      piece.captured();
      expect(piece.getFile()).toEqual(0);
      expect(piece.getRank()).toEqual(0);
      expect(piece.getPlayer()).toEqual('white');
      expect(piece.demote).toHaveBeenCalled();
    });
  });

  describe('Piece.prototype.matchMovement(move)', function() {
    beforeEach(function () {
      // パッと見わかりにくいがspyを仕込んでいる
      for(var i = 1, l = map.csaPiece('RY'); i <= l; i++) {
        spyOn(piece, 'case' + map.pieceToCsaPieceMapKey(i));
      }
    });

    it('駒に対応する関数を呼び出す', function() {
      var move = {
        'turn': 'black',
        'to': [0, 0],
        'piece': 1
      };

      for(var i = 1, l = map.csaPiece('RY'); i <= l; i++) {
        move.piece = i;
        piece.matchMovement(move);
        expect(piece['case' + map.pieceToCsaPieceMapKey(i)]).toHaveBeenCalled();
      }
    });
  });

  describe('Piece.prototype.checkRelative(move, dfile)', function() {
    /*
     先手と後手両方判定しているのでそこは気にしなくていい
     */
    var move, players;

    beforeEach(function () {
      move = {
        'turn': 'black',
        'to': [5, 5],
        'piece': undefined,
        'relative': undefined
      };

      players = ['black', 'white'];
    });

    it('引数move.relativeが"右"でfileの位置も右側であればtrueを返す', function() {
      var dfile = 0,
          pos = [[4, 6], [6,4]];

      move.relative = '右';
      piece.update({'piece': map.csaPiece('GI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        dfile = piece.getFile() - move.to[0];
        expect(piece.checkRelative(move, dfile)).toBeTruthy();
      }
    });
    it('引数move.relativeが"右"でfileの位置が同じか左側であればfalseを返す', function() {
      var dfile = 0,
          pos = [[5, 6], [5, 4],
                 [6, 6], [4, 4]];

      move.relative = '右';
      piece.update({'piece': map.csaPiece('GI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        dfile = piece.getFile() - move.to[0];
        expect(piece.checkRelative(move, dfile)).toBeFalsy();
      }
    });
    it('引数move.relativeが"左"でfileの位置も左側であればtrueを返す', function() {
      var dfile = 0,
          pos = [[6, 6], [4,4]];

      move.relative = '左';
      piece.update({'piece': map.csaPiece('GI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        dfile = piece.getFile() - move.to[0];
        expect(piece.checkRelative(move, dfile)).toBeTruthy();
      }
    });
    it('引数move.relativeが"左"でfileの位置が同じか右側であればfalseを返す', function() {
      var dfile = 0,
          pos = [[5, 6], [5, 4],
                 [4, 6], [6, 4]];

      move.relative = '左';
      piece.update({'piece': map.csaPiece('GI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        dfile = piece.getFile() - move.to[0];
        expect(piece.checkRelative(move, dfile)).toBeFalsy();
      }
    });

    /*
     馬と龍のケース
     */
    it('馬と龍で引数move.relativeが"右"でfileも右側か同じ位置であればtrueを返す', function() {
      var dfile = 0,
          pos = [[4, 6], [6, 4],
                 [5, 6], [5, 4]],
          pieces = [map.csaPiece('UM'), map.csaPiece('RY')];

      move.relative = '右';

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        for(var j = 0, jl = pieces.length; j < jl; j++) {
          move.piece = pieces[j];
          piece.update({'piece': pieces[j]});

          dfile = piece.getFile() - move.to[0];
          expect(piece.checkRelative(move, dfile)).toBeTruthy();
        }
      }
    });
    it('馬と龍で引数move.relativeが"右"でfileが左側の位置であればfalseを返す', function() {
      var dfile = 0,
          pos = [[6, 6], [4, 4]],
          pieces = [map.csaPiece('UM'), map.csaPiece('RY')];

      move.relative = '右';

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        for(var j = 0, jl = pieces.length; j < jl; j++) {
          move.piece = pieces[j];
          piece.update({'piece': pieces[j]});

          dfile = piece.getFile() - move.to[0];
          expect(piece.checkRelative(move, dfile)).toBeFalsy();
        }
      }
    });
    it('馬と龍で引数move.relativeが"左"でfileも左側か同じ位置であればtrueを返す', function() {
      var dfile = 0,
          pos = [[6, 6], [4, 6],
                 [5, 6], [5, 4]],
          pieces = [map.csaPiece('UM'), map.csaPiece('RY')];

      move.relative = '左';

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        for(var j = 0, jl = pieces.length; j < jl; j++) {
          move.piece = pieces[j];
          piece.update({'piece': pieces[j]});

          dfile = piece.getFile() - move.to[0];
          expect(piece.checkRelative(move, dfile)).toBeTruthy();
        }
      }
    });
    it('馬と龍で引数move.relativeが"左"でfileが右側の位置であればfalseを返す', function() {
      var dfile = 0,
          pos = [[4, 6], [6, 4]],
          pieces = [map.csaPiece('UM'), map.csaPiece('RY')];

      move.relative = '左';

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        for(var j = 0, jl = pieces.length; j < jl; j++) {
          move.piece = pieces[j];
          piece.update({'piece': pieces[j]});

          dfile = piece.getFile() - move.to[0];
          expect(piece.checkRelative(move, dfile)).toBeFalsy();
        }
      }
    });

    it('引数move.relativeが"直"でfileの位置が同じであればtrueを返す', function() {
      var dfile = 0;

      move.relative = '直';

      piece.update({
        'piece': map.csaPiece('GI'),
        'player': 'black',
        'file': 5,
        'rank': 6
      });

      dfile = piece.getFile() - move.to[0];

      expect(piece.checkRelative(move, dfile)).toBeTruthy();
    });
    it('引数move.relativeが"直"でfileの位置が同じでなければfalseを返す', function() {
      var dfile = 0;

      move.relative = '直';

      piece.update({
        'piece': map.csaPiece('GI'),
        'player': 'black',
        'file': 5,
        'rank': 6
      });

      // fileが右側になるのであればfalse
      piece.update({'file': 4});
      dfile = piece.getFile() - move.to[0];

      expect(piece.checkRelative(move, dfile)).toBeFalsy();

      // fileが左側になるのであればfalse
      piece.update({'file': 6});
      dfile = piece.getFile() - move.to[0];

      expect(piece.checkRelative(move, dfile)).toBeFalsy();
    });
  });

  describe('Piece.prototype.checkMotion(move)', function() {
    /*
     先手と後手両方判定しているのでそれは気にしなくていい
     */
    var move, players;

    beforeEach(function () {
      move = {
        'turn': 'black',
        'to': [5, 5],
        'piece': undefined,
        'motion': undefined
      };

      players = ['black', 'white'];
    });

    it('引数move.motionが"上"でrankの位置がpieceより下側の位置であればtrueを返す', function() {
      var drank = 0,
          pos = [[4, 6], [6, 4]];

      move.motion = '上';
      piece.update({'piece': map.csaPiece('GI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        drank = piece.getRank() - move.to[0];
        expect(piece.checkMotion(move, drank)).toBeTruthy();
      }
    });
    it('引数move.motionが"上"でrankの位置がpieceと同じであればfalseを返す', function() {
      var drank = 0,
          pos = [[4, 5], [5, 6]];

      move.motion = '上';
      piece.update({'piece': map.csaPiece('GI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        drank = piece.getRank() - move.to[0];
        expect(piece.checkMotion(move, drank)).toBeFalsy();
      }
    });

    it('引数move.motionが"引"でrankの位置がpieceより上側の位置であればtrueを返す', function() {
      var drank = 0,
          pos = [[4, 4], [4, 6]];

      move.motion = '引';
      piece.update({'piece': map.csaPiece('GI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        drank = piece.getRank() - move.to[0];
        expect(piece.checkMotion(move, drank)).toBeTruthy();
      }
    });
    it('引数move.motionが"引"でrankの位置がpieceと同じであればfalseを返す', function() {
      var drank = 0,
          pos = [[4, 5], [6, 5]];

      move.motion = '引';
      piece.update({'piece': map.csaPiece('KI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        drank = piece.getRank() - move.to[0];
        expect(piece.checkMotion(move, drank)).toBeFalsy();
      }
    });
    it('引数move.motionが"寄"でrankの位置がpieceと同じであればtrueを返す', function() {
      var drank = 0,
          pos = [[4, 5], [6, 5]];

      move.motion = '寄';
      piece.update({'piece': map.csaPiece('KI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        drank = piece.getRank() - move.to[0];
        expect(piece.checkMotion(move, drank)).toBeTruthy();
      }
    });
    it('引数move.motionが"寄"でrankの位置がpieceと同じでなければfalseを返す', function() {
      var drank = 0,
          pos = [[4, 6], [6, 4]];

      move.motion = '寄';
      piece.update({'piece': map.csaPiece('KI')});

      for(var i = 0, l = players.length; i < l; i++) {
        piece.update({
          'player': players[i],
          'file': pos[i][0],
          'rank': pos[i][1]
        });

        drank = piece.getRank() - move.to[0];
        expect(piece.checkMotion(move, drank)).toBeFalsy();
      }
    });
  });


  describe('Piece.prototype.checkDestForward(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 4]
      };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestForward(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(後手)trueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [5, 6]
      };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestForward(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(先手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [4, 5], [4, 4], [5, 5]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestForward(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 4], [4, 6], [4, 5], [4, 4], [5, 5]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestForward(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestBackward(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 6]
      };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestBackward(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(後手)trueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [5, 4]
      };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestBackward(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(先手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 4], [4, 6], [4, 5], [4, 4], [5, 5]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestBackward(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [4, 5], [4, 4], [5, 5]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestBackward(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestUpperLeft(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [6, 4]
      };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestUpperLeft(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(後手)trueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [4, 6]
      };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestUpperLeft(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(先手)falseを返す', function() {
      var to = [[6, 5], [6, 6], [5, 6], [4, 6], [4, 5], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestUpperLeft(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 6], [4, 5], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestUpperLeft(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestLeft(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [6, 5]
      };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestLeft(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(後手)trueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [4, 5]
      };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestLeft(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(先手)falseを返す', function() {
      var to = [[6, 4], [6, 6], [5, 6], [4, 6], [4, 5], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestLeft(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestLeft(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestBottomLeft(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [6, 6]
      };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestBottomLeft(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(後手)trueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [4, 4]
      };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestBottomLeft(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(先手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [5, 6], [4, 6], [4, 5], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestBottomLeft(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 6], [4, 5], [4, 6], [5, 4], [5, 5]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestBottomLeft(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestUpperRight(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [4, 4]
      };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestUpperRight(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(後手)trueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [6, 6]
      };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestUpperRight(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(先手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [4, 5], [5, 4], [5, 5]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestUpperRight(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [5, 6], [4, 6], [4, 5], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestUpperRight(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestRight(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [4, 5]
      };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestRight(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(後手)trueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [6, 5]
      };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestRight(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(先手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestRight(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[6, 4], [6, 6], [5, 6], [4, 6], [4, 5], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestRight(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestBottomrRight(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [4, 6]
      };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestBottomRight(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(後手)trueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [6, 4]
      };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      expect(piece.checkDestBottomRight(move.to[0], move.to[1])).toBeTruthy();
    });
    it('(先手)falseを返す', function() {
      var to = [[6, 4], [6, 5], [6, 6], [5, 6], [4, 5], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestBottomRight(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[6, 5], [6, 6], [5, 6], [4, 6], [4, 5], [4, 4], [5, 4], [5, 5]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestBottomRight(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestDirectly(file, rank)', function() {
    it('(先手)trueを返す', function() {
      var to = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8]],
          move = {
            'turn': 'black',
            'to': []
          };


      piece.update({
        'player': 'black',
        'file': 1,
        'rank': 9
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestDirectly(move.to[0], move.to[1])).toBeTruthy();
      }
    });
    it('(後手)trueを返す', function() {
      var to = [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 1,
        'rank': 1
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestDirectly(move.to[0], move.to[1])).toBeTruthy();
      }
    });
    it('(先手)falseを返す', function() {
      var to = [[1, 9], [2, 1]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 1,
        'rank': 9
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestDirectly(move.to[0], move.to[1])).toBeFalsy();
      }
    });
    it('(後手)falseを返す', function() {
      var to = [[1, 1], [2, 9]],
          move = {
            'turn': 'white',
            'to': []
          };

      piece.update({
        'player': 'white',
        'file': 1,
        'rank': 1
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestDirectly(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestDiagonal(file, rank)', function() {
    it('(先後同じ)trueを返す', function() {
      var to = [
        [6, 4], [7, 3], [8, 2], [9, 1],
        [6, 6], [7, 7], [8, 8], [9, 9],
        [4, 4], [3, 3], [2, 2], [1, 1],
        [4, 6], [3, 7], [2, 8], [1, 9]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestDiagonal(move.to[0], move.to[1])).toBeTruthy();
      }
    });
    it('falseを返す', function() {
      var to = [
        [5, 5],
        [5, 6], [6, 5], [5, 4], [4, 5],
        [10, 0], [5, 0], [0, 0], [0, 10]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestDiagonal(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.checkDestOrthogonal(file, rank)', function() {
    it('(先後同じ)trueを返す', function() {
      var to = [
        [6, 5], [7, 5], [8, 5], [9, 5],
        [5, 4], [5, 3], [5, 2], [5, 1],
        [4, 5], [3, 5], [2, 5], [1, 5],
        [5, 6], [5, 7], [5, 8], [5, 9]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestOrthogonal(move.to[0], move.to[1])).toBeTruthy();
      }
    });
    it('falseを返す', function() {
      var to = [
        [5, 5],
        [6, 4], [6, 6], [4, 4], [4, 6],
        [10, 5], [5, 0], [0, 5], [5, 10]],
          move = {
            'turn': 'black',
            'to': []
          };

      piece.update({
        'player': 'black',
        'file': 5,
        'rank': 5
      });

      for(var i = 0, l = to.length; i < l; i++) {
        move.to = to[i];
        expect(piece.checkDestOrthogonal(move.to[0], move.to[1])).toBeFalsy();
      }
    });
  });


  describe('Piece.prototype.caseFU(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('FU'),
        'file': 5,
        'rank': 5
      });
    });

    it('(先手)移動前の歩に該当すればtrueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 4],
        'piece': map.csaPiece('FU')
      };

      piece.update({'player': 'black'});
      expect(piece.caseFU(move)).toBeTruthy();
    });
    it('(後手)移動前の歩に該当すればtrueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [5, 6],
        'piece': map.csaPiece('FU')
      };

      piece.update({'player': 'white'});
      expect(piece.caseFU(move)).toBeTruthy();
    });
    it('移動前の歩に該当しなければfalseを返す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 6],
        'piece': map.csaPiece('FU')
      };

      piece.update({'player': 'black'});
      expect(piece.caseFU(move)).toBeFalsy();
    });
  });

  describe('Piece.prototype.caseKY(move)', function() {
    it('(先手)移動前の香に該当すればtrueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [1, 1],
        'piece': map.csaPiece('KY')
      };

      piece.update({
        'piece': map.csaPiece('KY'),
        'player': 'black',
        'file': 1,
        'rank': 9
      });

      expect(piece.caseKY(move)).toBeTruthy();
    });
    it('(後手)移動前の香に該当すればtrueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [1, 9],
        'piece': map.csaPiece('KY')
      };

      piece.update({
        'piece': map.csaPiece('KY'),
        'player': 'white',
        'file': 1,
        'rank': 1
      });

      expect(piece.caseKY(move)).toBeTruthy();
    });
    it('移動前の香に該当しなければfalseを返す', function() {
      var move = {
        'turn': 'black',
        'to': [1, 5],
        'piece': map.csaPiece('KY')
      };

      piece.update({
        'piece': map.csaPiece('KY'),
        'player': 'black',
        'file': 1,
        'rank': 2
      });

      expect(piece.caseKY(move)).toBeFalsy();
    });

  });

  describe('Piece.prototype.caseKE(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('KE'),
        'file': 5,
        'rank': 5
      });
    });

    it('(先手)移動前の桂に該当すればtrueを返す', function() {
      var move = {
        'turn': 'black',
        'to': [6, 3],
        'piece': map.csaPiece('KE')
      };

      piece.update({'player': 'black'});
      expect(piece.caseKE(move)).toBeTruthy();
    });
    it('(後手)移動前の桂に該当すればtrueを返す', function() {
      var move = {
        'turn': 'white',
        'to': [6, 7],
        'piece': map.csaPiece('KE')
      };

      piece.update({'player': 'white'});
      expect(piece.caseKE(move)).toBeTruthy();
    });
    it('移動前の桂に該当しなければfalseを返す', function() {
      var move = {
        'turn': 'black',
        'to': [6, 2],
        'piece': map.csaPiece('KE')
      };

      piece.update({'player': 'black'});
      expect(piece.caseKE(move)).toBeFalsy();
    });
  });

  describe('Piece.prototype.caseGI(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('GI'),
        'file': 5,
        'rank': 5
      });
    });

    it('(先手)移動前の銀に該当すればtrueを返す', function() {
      var pos = [[4, 6], [6, 6], [6, 4], [4, 4], [5, 4]],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('GI')
          };

      piece.update({'player': 'black'});

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseGI(move)).toBeTruthy();
      }
    });
    it('(後手)移動前の銀に該当すればtrueを返す', function() {
      var pos = [[4, 6], [6, 6], [6, 4], [4, 4], [5, 6]],
          move = {
            'turn': 'white',
            'to': [],
            'piece': map.csaPiece('GI')
          };

      piece.update({'player': 'white'});

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseGI(move)).toBeTruthy();
      }
    });
    it('移動前の銀に該当しなければfalseを返す', function() {
      var pos = [[4, 5], [6, 5], [5, 6], [5, 5]],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('GI')
          };

      piece.update({'player': 'black'});

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseGI(move)).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.caseKI(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('KI'),
        'file': 5,
        'rank': 5
      });
    });

    it('(先手)移動前の金に該当すればtrueを返す', function() {
      var pos = [[5, 4], [4, 4], [4, 5], [5, 6], [6, 5], [6, 4]],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('KI')
          };

      piece.update({'player': 'black'});

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseKI(move)).toBeTruthy();
      }
    });
    it('(後手)移動前の金に該当すればtrueを返す', function() {
      var pos = [[5, 6], [6, 6], [6, 5], [5, 4], [4, 5], [4, 6]],
          move = {
            'turn': 'white',
            'to': [],
            'piece': map.csaPiece('KI')
          };

      piece.update({'player': 'white'});

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseKI(move)).toBeTruthy();
      }
    });
    it('移動前の金に該当しなければfalseを返す', function() {
      var pos = [[6, 6], [4, 6], [5, 5]],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('KI')
          };

      piece.update({'player': 'black'});

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseKI(move)).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.caseKA(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('KA'),
        'file': 5,
        'rank': 5
      });
    });

    it('(先後同じ)移動前の角に該当すればtrueを返す', function() {
      var pos = [],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('KA')
          };

      piece.update({'player': 'black'});

      pos = [
        [6, 4], [7, 3], [8, 2], [9, 1],
        [6, 6], [7, 7], [8, 8], [9, 9],
        [4, 4], [3, 3], [2, 2], [1, 1],
        [4, 6], [3, 7], [2, 8], [1, 9]
      ];

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseKA(move)).toBeTruthy();
      }
    });
    it('移動前の角に該当しなければfalseを返す', function() {
      var pos = [],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('KA')
          };

      piece.update({'player': 'black'});

      pos = [
        [5, 5],
        [5, 6], [6, 5], [5, 4], [4, 5],
        [10, 0], [5, 0], [0, 0], [0, 10],
      ];

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseKA(move)).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.caseHI(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('HI'),
        'file': 5,
        'rank': 5
      });
    });

    it('(先後同じ)移動前の飛車に該当すればtrueを返す', function() {
      var pos = [],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('HI')
          };

      piece.update({'player': 'black'});

      pos = [
        [6, 5], [7, 5], [8, 5], [9, 5],
        [5, 4], [5, 3], [5, 2], [5, 1],
        [4, 5], [3, 5], [2, 5], [1, 5],
        [5, 6], [5, 7], [5, 8], [5, 9]
      ];

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseHI(move)).toBeTruthy();
      }
    });
    it('移動前の飛車に該当しなければfalseを返す', function() {
      var pos = [],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('HI')
          };

      piece.update({'player': 'black'});

      pos = [
        [5, 5],
        [6, 4], [6, 6], [4, 4], [4, 6],
        [10, 5], [5, 0], [0, 5], [5, 10]
      ];

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseHI(move)).toBeFalsy();
      }
    });
  });

  describe('Piece.prototype.caseOU(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('OU'),
        'player': 'black',
        'file': 5,
        'rank': 5
      });
    });

    it('(先後同じ)移動前の王に該当すればtrueを返す', function() {
      var pos = [[5, 4], [4, 4], [4, 5], [4, 6], [5, 6], [6, 6], [6, 5], [6, 4]],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('OU')
          };

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseOU(move)).toBeTruthy();
      }
    });
    it('移動前の王に該当しなければfalseを返す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 5],
        'piece': map.csaPiece('OU')
      };

      expect(piece.caseOU(move)).toBeFalsy();
    });
  });

  describe('Piece.prototype.caseUM(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('UM'),
        'player': 'black',
        'file': 5,
        'rank': 5
      });
    });
    it('(先後同じ)移動前の馬に該当すればtrueを返す', function() {
      var pos = [],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('UM')
          };

      pos = [
        [6, 4], [7, 3], [8, 2], [9, 1],
        [6, 6], [7, 7], [8, 8], [9, 9],
        [4, 4], [3, 3], [2, 2], [1, 1],
        [4, 6], [3, 7], [2, 8], [1, 9],
        [5, 4], [4, 5], [5, 6], [6, 5]
      ];

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseUM(move)).toBeTruthy();
      }
    });
    it('移動前の馬に該当しなければfalseを返す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 5],
        'piece': map.csaPiece('UM')
      };

      expect(piece.caseUM(move)).toBeFalsy();
    });
  });

  describe('Piece.prototype.caseRY(move)', function() {
    beforeEach(function() {
      piece.update({
        'piece': map.csaPiece('RY'),
        'player': 'black',
        'file': 5,
        'rank': 5
      });
    });
    it('(先後同じ)移動前の龍に該当すればtrueを返す', function() {
      var pos = [],
          move = {
            'turn': 'black',
            'to': [],
            'piece': map.csaPiece('RY')
          };

      pos = [
        [6, 5], [7, 5], [8, 5], [9, 5],
        [5, 4], [5, 3], [5, 2], [5, 1],
        [4, 5], [3, 5], [2, 5], [1, 5],
        [5, 6], [5, 7], [5, 8], [5, 9],
        [4, 4], [4, 6], [6, 6], [6, 4]
      ];

      for(var i = 0, l = pos.length; i < l; i++) {
        move.to = pos[i];
        expect(piece.caseRY(move)).toBeTruthy();
      }
    });
    it('移動前の龍に該当しなければfalseを返す', function() {
      var move = {
        'turn': 'black',
        'to': [5, 5],
        'piece': map.csaPiece('RY')
      };

      expect(piece.caseRY(move)).toBeFalsy();
    });
  });
});
