"use strict";

var funcUtils = require('../lib/functionUtils');

describe('functionUtils.js', function() {
  describe('trim(str)', function() {
    it('行頭・行末半角空白を除去', function() {
      expect(funcUtils.trim('  foo  ')).toEqual('foo');
    });
    it('行頭・行末全角空白を除去', function() {
      expect(funcUtils.trim('　foo　')).toEqual('foo');
    });
    it('行頭・行末半角全角空白混合を除去', function() {
      expect(funcUtils.trim('  　 foo 　 ')).toEqual('foo');
    });
  });

  describe('toLines(source)', function() {
    it('テキストをCR+LF,CR,LFで分割し配列で返す', function() {
      var s = 'CR+LF\r\nCR\rLF\nLFCRCRLF\n\r\r\n';
      var l = ['CR+LF', 'CR', 'LF', 'LFCRCRLF'];
      expect(funcUtils.toLines(s).toString()).toEqual(l.toString());
    });
  });

  describe('validateDate(value)', function() {
    it('yyyy/mm/dd形式', function() {
      expect(funcUtils.validateDate('2014/06/25')).toBeTruthy();
    });
    it('yyyy/mm/dd hh:mm形式', function() {
      expect(funcUtils.validateDate('2014/06/25 00:11')).toBeTruthy();
    });
    it('yyyy/mm/dd hh:mm:ss形式', function() {
      expect(funcUtils.validateDate('2014/06/25 00:11:22')).toBeTruthy();
    });
  });

  describe('isEmptyObject(value)', function() {
    it('オブジェクトが空であればtrueを返しそうでばけれfalseを返す', function() {
      expect(funcUtils.isEmptyObject({})).toBeTruthy();
      expect(funcUtils.isEmptyObject({'prop': 'prop'})).toBeFalsy();
    });
  });

  describe('jsonStringify(value, replacer, space)', function() {
    var value;

    beforeEach(function() {
      value = {
        'string': 'string',
        'num': '2014',
        'bool': true,
        'array': [1, 'string', true],
        'object': {
          'string': 'string',
          'num': 1,
          'bool': false,
          'array': [1, 'string', true],
          'object': {
            'string': 'string',
            'num': '2014',
            'bool': true,
            'array': [1, 'string', true],
            'object': {
              'string': 'string',
              'num': 1,
              'bool': false,
              'array': [1, 'string', true]
            }
          }
        }
      };
    });

    it('JavaScriptオブジェクトをJSONに変換', function() {
      expect(funcUtils.jsonStringify(value)).toBe(
        '{"string":"string","num":"2014","bool":true,"array":[1,"string",true]' +
          ',"object":{"string":"string","num":1,"bool":false,"array":[1,"string",true]' +
          ',"object":{"string":"string","num":"2014","bool":true,"array":[1,"string",true],' +
          '"object":{"string":"string","num":1,"bool":false,"array":[1,"string",true]}}}}');
    });
  });
});
