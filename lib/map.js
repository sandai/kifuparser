/* ---------- header ---------- */
"use strict";

var csaHandicapMap = require('./map/csaHandicapMap'),
    csaHeaderMap =require('./map/csaHeaderMap'),
    csaPieceMap = require('./map/csaPieceMap'),
    csaSpecialMoveMap = require('./map/csaSpecialMoveMap'),
    formatMap = require('./map/formatMap'),
    handicapMap = require('./map/handicapMap'),
    headerMap = require('./map/headerMap'),
    initialPlacementMap = require('./map/initialPlacementMap'),
    kansujiMap = require('./map/kansujiMap'),
    pieceMap = require('./map/pieceMap'),
    promotedPieceMap = require('./map/promotedPieceMap'),
    // resultMap = require('./map/resultMap'),
    specialMoveMap = require('./map/specialMoveMap'),
    zenkakuNumberMap = require('./map/zenkakuNumberMap');
/* ---------- header ---------- */

var map = {
  handicap: function(key) {
    return (typeof handicapMap[key] !== 'undefined') ?
      handicapMap[key] : handicapMap['その他'];
  },
  csaHandicap: function(key) {
    return (typeof csaHandicapMap[key] !== 'undefined') ?
      csaHandicapMap[key] : csaHandicapMap['その他'];
  },
  initialPlacement: function(key) {
    return (typeof initialPlacementMap[key] !== 'undefined') ?
      initialPlacementMap[key] : null;
  },
  // result: function(key) {
  //     return (typeof resultMap[key] !== 'undefined') ?
  //         resultMap[key] : 'その他';
  // },
  specialMove: function(key) {
    return (typeof specialMoveMap[key] !== 'undefined') ?
      specialMoveMap[key] : null;
  },
  csaSpecialMove: function(key) {
    return (typeof csaSpecialMoveMap[key] !== 'undefined') ?
      csaSpecialMoveMap[key] : null;
  },
  format: function(key) {
    return (typeof formatMap[key] !== 'undefined') ?
      formatMap[key] : null;
  },
  piece: function(key) {
    return (typeof pieceMap[key] !== 'undefined') ?
      pieceMap[key] : null;
  },
  promotedPiece: function(key) {
    return (typeof promotedPieceMap[key] !== 'undefined') ?
      promotedPieceMap[key] : null;
  },
  csaPiece: function(key) {
    return (typeof csaPieceMap[key] !== 'undefined') ?
      csaPieceMap[key] : null;
  },
  zenkakNumber: function(key) {
    return (typeof zenkakuNumberMap[key] !== 'undefined') ?
      zenkakuNumberMap[key] : null;
  },
  kansuji: function(key) {
    return (typeof kansujiMap[key] !== 'undefined') ?
      kansujiMap[key] : null;
  },
  header: function(key) {
    return (typeof headerMap[key] !== 'undefined') ?
      headerMap[key] : null;
  },
  csaHeader: function(key) {
    return (typeof csaHeaderMap[key] !== 'undefined') ?
      csaHeaderMap[key] : null;
  },
  /* element => prop */
  pieceToPieceMapKey: function(piece) {
    for(var key in pieceMap) {
      if(pieceMap[key] === piece) {
        return key;
      }
    }

    return null;
  },
  pieceToCsaPieceMapKey: function(piece) {
    for(var key in csaPieceMap) {
      if(csaPieceMap[key] === piece) {
        return key;
      }
    }

    return null;
  }
};

/* ---------- exports ---------- */
module.exports = map;
/* ---------- exports ---------- */
