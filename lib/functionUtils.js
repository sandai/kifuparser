/* ---------- header ---------- */
"use strict";
/* ---------- header ---------- */

// util.inheritsは使わない
function inherits(c, p) {
  function F () {}
  F.prototype = p.prototype;
  c.prototype = new F();
  c.prototype.constructor = c;
}

var trim = (function() {
  return (!String.prototype.trim) ?
    function(str) { return str.replace(/^[\s　]+|[\s　]+$/g,''); } :
  function(str) { return String.prototype.trim.call(str); };
})();

function toLines(source) {
  var res = [],
      lines = source.split(/\r?(?:\n|\r)/);

  for (var i = 0, l = lines.length; i < l; i++) {
    if (lines[i] !== '') {
      res.push(lines[i]);
    }

  }

  return res;
}

function validateDate(value) {
  // ひと通りの形式は問題ないはず
  // yyyy/mm/dd
  // yyyy/mm/dd hh:mm
  // yyyy/mm/dd hh:mm:ss

  var reg = new RegExp('^(?:[0-9]{4})\\/' +
                       '(?:(0?2)\\/([12][0-9]|0?[1-9])' +
                       '|' +
                       '(0?[469]|11)\\/(30|[12][0-9]|0?[1-9])' +
                       '|' +
                       '(0?[13578]|1[02])\\/(3[01]|[12][0-9]|0?[1-9]))' +
                       '(?:$|[\\s　]+(?:2[0-3]|[01][0-9]):(?:[0-5][0-9])(?:$|:(?:[0-5][0-9])$))');

  return reg.test(value);
}

function isEmptyObject(obj) {
  var name;
	for (name in obj ) {
    if(typeof name !== 'undefined') {
      return false;
    }
  }
	return true;
}

// https://github.com/douglascrockford/JSON-js
var jsonStringify = (function() {
  var escapable,
      gap,
      indent,
      meta,
      rep;

  escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  meta = {    // table of character substitutions
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"' : '\\"',
    '\\': '\\\\'
  };

  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
      var c = meta[a];
      return typeof c === 'string' ?
        c :
        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }

  function str(key, holder) {
    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];

    if (value && typeof value === 'object' &&
        typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }

    switch (typeof value) {
    case 'string':
      return quote(value);
    case 'number':
      return isFinite(value) ? String(value) : 'null';
    case 'boolean':
    case 'null':
      return String(value);
    case 'object':
      if (!value) {
        return 'null';
      }

      gap += indent;
      partial = [];

      if (Object.prototype.toString.apply(value) === '[object Array]') {
        length = value.length;
        for (i = 0; i < length; i += 1) {
          partial[i] = str(i, value) || 'null';
        }

        v = partial.length === 0 ?
          '[]' :
          gap ?
          '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
          '[' + partial.join(',') + ']';
        gap = mind;
        return v;
      }

      if (rep && typeof rep === 'object') {
        length = rep.length;
        for (i = 0; i < length; i += 1) {
          k = rep[i];
          if (typeof k === 'string') {
            v = str(k, value);
            if (v) {
              partial.push(quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        }
      } else {
        for (k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
            v = str(k, value);
            if (v) {
              partial.push(quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        }
      }

      v = partial.length === 0 ?
        '{}' :
        gap ?
        '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
        '{' + partial.join(',') + '}';
      gap = mind;
      return v;
    default:break;
    }
  }

  // JSON.stringifyがあればそちらを使う
  return (typeof JSON.stringify === 'function') ?
    JSON.stringify :
    function (value, replacer, space) {
      var i;
      gap = '';
      indent = '';

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }
      } else if (typeof space === 'string') {
        indent = space;
      }

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
          (typeof replacer !== 'object' ||
           typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }

      return str('', {'': value});
    };
})();

var functionUtils = {
  'inherits': inherits,
  'trim': trim,
  'toLines': toLines,
  'validateDate': validateDate,
  'isEmptyObject': isEmptyObject,
  'jsonStringify': jsonStringify
};

/* ---------- exports ---------- */
module.exports = functionUtils;
/* ---------- exports ---------- */
