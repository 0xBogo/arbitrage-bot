"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteContract = exports.deleteSubwallet = exports.verifyUser = exports.addUser = exports.getContractData = exports.getAllSubwallets = exports.getAllMainWallets = exports.getMainWalletData = exports.updateTradingData = exports.addContracts = exports.addSubwallet = exports.addMainWallet = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var server = "https://sandwitchbackend.vercel.app"; // const server = "http://localhost:5000";

var addMainWallet = function addMainWallet(publicKey) {
  return regeneratorRuntime.async(function addMainWallet$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/add/main_wallet", {
            publicKey: publicKey
          }));

        case 3:
          _context.next = 8;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0.message);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.addMainWallet = addMainWallet;

var addSubwallet = function addSubwallet(mainWallet, publicKey, privateKey) {
  var result;
  return regeneratorRuntime.async(function addSubwallet$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/add/subwallet", {
            mainWallet: mainWallet,
            publicKey: publicKey,
            privateKey: privateKey
          }));

        case 3:
          result = _context2.sent;
          _context2.next = 9;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0.message);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.addSubwallet = addSubwallet;

var addContracts = function addContracts(subwallet, contracts) {
  return regeneratorRuntime.async(function addContracts$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/add/contracts", {
            subwallet: subwallet,
            contracts: contracts
          }));

        case 3:
          _context3.next = 8;
          break;

        case 5:
          _context3.prev = 5;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0.message);

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.addContracts = addContracts;

var updateTradingData = function updateTradingData(subwallet, contract, buy, sell, gasSpent) {
  return regeneratorRuntime.async(function updateTradingData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/update", {
            subwallet: subwallet,
            contract: contract,
            buy: buy,
            sell: sell,
            gasSpent: gasSpent
          }));

        case 3:
          _context4.next = 8;
          break;

        case 5:
          _context4.prev = 5;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0.message);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.updateTradingData = updateTradingData;

var getMainWalletData = function getMainWalletData(publicKey) {
  var mainWalletData;
  return regeneratorRuntime.async(function getMainWalletData$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/get/main_wallet", {
            publicKey: publicKey
          }));

        case 3:
          mainWalletData = _context5.sent;
          return _context5.abrupt("return", mainWalletData.data);

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getMainWalletData = getMainWalletData;

var getAllMainWallets = function getAllMainWallets() {
  var allMainWalletsData;
  return regeneratorRuntime.async(function getAllMainWallets$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/get/main_wallets"));

        case 3:
          allMainWalletsData = _context6.sent;
          return _context6.abrupt("return", allMainWalletsData.data);

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0.message);

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getAllMainWallets = getAllMainWallets;

var getAllSubwallets = function getAllSubwallets() {
  var allSubwalletsData;
  return regeneratorRuntime.async(function getAllSubwallets$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/get/subwallets"));

        case 3:
          allSubwalletsData = _context7.sent;
          return _context7.abrupt("return", allSubwalletsData.data);

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0.message);

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getAllSubwallets = getAllSubwallets;

var getContractData = function getContractData(subwallet) {
  var contractData;
  return regeneratorRuntime.async(function getContractData$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/get/wallet_contracts", {
            subwallet: subwallet
          }));

        case 3:
          contractData = _context8.sent;
          return _context8.abrupt("return", contractData.data);

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0.message);

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getContractData = getContractData;

var addUser = function addUser(email, pwd) {
  var result;
  return regeneratorRuntime.async(function addUser$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/add/user", {
            email: email,
            pwd: pwd
          }));

        case 3:
          result = _context9.sent;
          return _context9.abrupt("return", result.data);

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0.message);

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.addUser = addUser;

var verifyUser = function verifyUser(email, pwd) {
  var result;
  return regeneratorRuntime.async(function verifyUser$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/verify/user", {
            email: email,
            pwd: pwd
          }));

        case 3:
          result = _context10.sent;
          return _context10.abrupt("return", result.data.state);

        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0.message);

        case 10:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.verifyUser = verifyUser;

var deleteSubwallet = function deleteSubwallet(publicKey) {
  return regeneratorRuntime.async(function deleteSubwallet$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/delete/subwallet", {
            publicKey: publicKey
          }));

        case 3:
          _context11.next = 8;
          break;

        case 5:
          _context11.prev = 5;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0.message);

        case 8:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.deleteSubwallet = deleteSubwallet;

var deleteContract = function deleteContract(publicKey, contract) {
  return regeneratorRuntime.async(function deleteContract$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(server + "/delete/contract", {
            subwallet: publicKey,
            contract: contract
          }));

        case 3:
          console.log("success");
          _context12.next = 9;
          break;

        case 6:
          _context12.prev = 6;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0.message);

        case 9:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.deleteContract = deleteContract;