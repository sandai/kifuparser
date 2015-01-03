// "use strict";

// var main = require('../lib/main'),
//     funcUtils =require('../lib/functionUtils');

// var KifParser = require('../lib/KifParser'),
//     Ki2Parser = require('../lib/Ki2Parser'),
//     CsaParser = require('../lib/CsaParser');

// var kif_source = require('raw!./sample/kif.kif'),
//     ki2_source = require('raw!./sample/ki2.ki2'),
//     csa_source = require('raw!./sample/csa.csa');

// describe('main.js', function() {
//   // プライベート関数
//   describe('parserFactory(source, format)', function() {
//     it('parserFactory()はエラーを返す', function() {
//       expect(function() { main.parserFactory(); }).toThrow();
//     });
//     it('棋譜ファイル以外を受け取ったらエラーを返す', function() {
//       expect(function() { main.parserFactory('foobarhoge'); }).toThrow();
//     });

//     describe('parserFactory(source)', function() {
//       it('parserFactory(kif_source)はKifのインスタンスを生成', function() {
//         var parser = main.parserFactory(kif_source);
//         expect(parser instanceof KifParser).toBeTruthy();
//         expect(parser.source).toEqual(kif_source);
//         expect(parser.format).toEqual('Kif');
//       });
//       it('parserFactory(ki2_source)はKi2のインスタンスを生成', function() {
//         var parser = main.parserFactory(ki2_source);
//         expect(parser instanceof Ki2Parser).toBeTruthy();
//         expect(parser.source).toEqual(ki2_source);
//         expect(parser.format).toEqual('Ki2');

//       });
//       it('parserFactory(csa_source)はCsaのインスタンスを生成', function() {
//         var parser = main.parserFactory(csa_source);
//         expect(parser instanceof CsaParser).toBeTruthy();
//         expect(parser.source).toEqual(csa_source);
//         expect(parser.format).toEqual('Csa');
//       });
//     });

//     describe('parserFactory(source, format)', function() {
//       it('parserFactory(kif_source, "Kif")はKifのインスタンスを生成', function() {
//         var parser = main.parserFactory(kif_source);
//         expect(parser instanceof KifParser).toBeTruthy();
//         expect(parser.source).toEqual(kif_source);
//         expect(parser.format).toEqual('Kif');
//       });
//       it('parserFactory(ki2_source, "Ki2")はKi2のインスタンスを生成', function() {
//         var parser = main.parserFactory(ki2_source);
//         expect(parser instanceof Ki2Parser).toBeTruthy();
//         expect(parser.source).toEqual(ki2_source);
//         expect(parser.format).toEqual('Ki2');

//       });
//       it('parserFactory(csa_source, "Csa")はCsaのインスタンスを生成', function() {
//         var parser = main.parserFactory(csa_source);
//         expect(parser instanceof CsaParser).toBeTruthy();
//         expect(parser.source).toEqual(csa_source);
//         expect(parser.format).toEqual('Csa');
//       });
//     });
//   });

//   describe('checkFormat(source, format)', function() {
//     describe('sourceとformatが対応しているケース', function() {
//       it('"Kif"を返す', function() {
//         expect(main.checkFormat(['   1 ７六歩(77) ( 0:00/00:00:00)'], 'Kif')).toEqual('Kif');
//       });
//       it('"Ki2"を返す"', function() {
//         expect(main.checkFormat(['▲７六歩'], 'Ki2')).toEqual('Ki2');
//         expect(main.checkFormat(['▼７六歩'], 'Ki2')).toEqual('Ki2');
//         expect(main.checkFormat(['△７六歩'], 'Ki2')).toEqual('Ki2');
//         expect(main.checkFormat(['▽７六歩'], 'Ki2')).toEqual('Ki2');
//       });
//       it('"Csa"を返す', function() {
//         expect(main.checkFormat(['+7776FU,T0'], 'Csa')).toEqual('Csa');
//         expect(main.checkFormat(['-8384FU,T0'], 'Csa')).toEqual('Csa');
//       });
//       it('"noformat"を返す', function() {
//         expect(main.checkFormat(['foobarhoge'], 'noformat')).toEqual('noformat');
//       });
//     });

//     describe('sourceとformatが対応していないケース', function() {
//       it('"Kif"を返す', function() {
//         expect(main.checkFormat(['   1 ７六歩(77) ( 0:00/00:00:00)'], 'Ki2')).toEqual('Kif');
//       });
//       it('"Ki2"を返す"', function() {
//         expect(main.checkFormat(['▲７六歩'], 'Csa')).toEqual('Ki2');
//         expect(main.checkFormat(['▼７六歩'], 'Csa')).toEqual('Ki2');
//         expect(main.checkFormat(['△７六歩'], 'Csa')).toEqual('Ki2');
//         expect(main.checkFormat(['▽７六歩'], 'Csa')).toEqual('Ki2');
//       });
//       it('"Csa"を返す', function() {
//         expect(main.checkFormat(['+7776FU,T0'], 'Kif')).toEqual('Csa');
//         expect(main.checkFormat(['-8384FU,T0'], 'Kif')).toEqual('Csa');
//       });
//       it('"noformat"を返す', function() {
//         expect(main.checkFormat(['foobarhoge'], 'Kif')).toEqual('noformat');
//       });

//     });

//     describe('formatの指定がされていないケース', function() {
//       it('"Kif"を返す', function() {
//         expect(main.checkFormat(['   1 ７六歩(77) ( 0:00/00:00:00)'], 'noformat')).toEqual('Kif');
//       });
//       it('"Ki2"を返す"', function() {
//         expect(main.checkFormat(['▲７六歩'], 'noformat')).toEqual('Ki2');
//         expect(main.checkFormat(['▼７六歩'], 'noformat')).toEqual('Ki2');
//         expect(main.checkFormat(['△７六歩'], 'noformat')).toEqual('Ki2');
//         expect(main.checkFormat(['▽７六歩'], 'noformat')).toEqual('Ki2');
//       });
//       it('"Csa"を返す', function() {
//         expect(main.checkFormat(['+7776FU,T0'], 'noformat')).toEqual('Csa');
//         expect(main.checkFormat(['-8384FU,T0'], 'noformat')).toEqual('Csa');

//       });
//       it('"noformat"を返す', function() {
//         expect(main.checkFormat(['foobarhoge'], 'noformat')).toEqual('noformat');
//       });
//     });

//     describe('formatが全て小文字のケース', function() {
//       it('"Kif"を返す', function() {
//         expect(main.checkFormat(['   1 ７六歩(77) ( 0:00/00:00:00)'], 'kif')).toEqual('Kif');
//       });
//       it('"Ki2"を返す"', function() {
//         expect(main.checkFormat(['▲７六歩'], 'ki2')).toEqual('Ki2');
//         expect(main.checkFormat(['▼７六歩'], 'ki2')).toEqual('Ki2');
//         expect(main.checkFormat(['△７六歩'], 'ki2')).toEqual('Ki2');
//         expect(main.checkFormat(['▽７六歩'], 'ki2')).toEqual('Ki2');
//       });
//       it('"Csa"を返す', function() {
//         expect(main.checkFormat(['+7776FU,T0'], 'csa')).toEqual('Csa');
//         expect(main.checkFormat(['-8384FU,T0'], 'csa')).toEqual('Csa');

//       });
//     });

//     describe('formatが全て大文字ケース', function() {
//       it('"Kif"を返す', function() {
//         expect(main.checkFormat(['   1 ７六歩(77) ( 0:00/00:00:00)'], 'KIF')).toEqual('Kif');
//       });
//       it('"Ki2"を返す"', function() {
//         expect(main.checkFormat(['▲７六歩'], 'KI2')).toEqual('Ki2');
//         expect(main.checkFormat(['▼７六歩'], 'KI2')).toEqual('Ki2');
// 				expect(main.checkFormat(['△７六歩'], 'KI2')).toEqual('Ki2');
// 				expect(main.checkFormat(['▽７六歩'], 'KI2')).toEqual('Ki2');
//       });
//       it('"Csa"を返す', function() {
//         expect(main.checkFormat(['+7776FU,T0'], 'CSA')).toEqual('Csa');
//         expect(main.checkFormat(['-8384FU,T0'], 'csa')).toEqual('Csa');
//       });
//     });
//   });
// });



