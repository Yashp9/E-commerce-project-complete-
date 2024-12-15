"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProductStore = void 0;

var _zustand = require("zustand");

var _reactHotToast = _interopRequireDefault(require("react-hot-toast"));

var _axios = _interopRequireDefault(require("../lib/axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var useProductStore = (0, _zustand.create)(function (set) {
  return {
    products: [],
    loading: false,
    setProducts: function setProducts(products) {
      return set({
        products: products
      });
    },
    createProduct: function createProduct(productData) {
      var res;
      return regeneratorRuntime.async(function createProduct$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              set({
                loading: true
              });
              _context.prev = 1;
              _context.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].post("/products", productData));

            case 4:
              res = _context.sent;
              set(function (prevState) {
                return {
                  products: [].concat(_toConsumableArray(prevState.products), [res.data]),
                  loading: false
                };
              });
              _context.next = 12;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);

              _reactHotToast["default"].error(_context.t0.response.data.error);

              set({
                loading: false
              });

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[1, 8]]);
    },
    fetchAllProducts: function fetchAllProducts() {
      var response;
      return regeneratorRuntime.async(function fetchAllProducts$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              set({
                loading: true
              });
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get("/products"));

            case 4:
              response = _context2.sent;
              set({
                products: response.data.products,
                loading: false
              });
              _context2.next = 12;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              set({
                error: "Failed to fetch products",
                loading: false
              });

              _reactHotToast["default"].error(_context2.t0.response.data.error || "Failed to fetch products");

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[1, 8]]);
    },
    fetchProductsByCategory: function fetchProductsByCategory(category) {
      var response;
      return regeneratorRuntime.async(function fetchProductsByCategory$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              set({
                loading: true
              });
              _context3.prev = 1;
              _context3.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get("/products/category/".concat(category)));

            case 4:
              response = _context3.sent;
              set({
                products: response.data.products,
                loading: false
              });
              _context3.next = 12;
              break;

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](1);
              set({
                error: "Failed to fetch products",
                loading: false
              });

              _reactHotToast["default"].error(_context3.t0.response.data.error || "Failed to fetch products");

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[1, 8]]);
    },
    deleteProduct: function deleteProduct(productId) {
      return regeneratorRuntime.async(function deleteProduct$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              set({
                loading: true
              });
              _context4.prev = 1;
              _context4.next = 4;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]("/products/".concat(productId)));

            case 4:
              set(function (prevProducts) {
                return {
                  products: prevProducts.products.filter(function (product) {
                    return product._id !== productId;
                  }),
                  loading: false
                };
              });
              _context4.next = 11;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](1);
              set({
                loading: false
              });

              _reactHotToast["default"].error(_context4.t0.response.data.error || "Failed to delete product");

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[1, 7]]);
    },
    toggleFeaturedProduct: function toggleFeaturedProduct(productId) {
      var response;
      return regeneratorRuntime.async(function toggleFeaturedProduct$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              set({
                loading: true
              });
              _context5.prev = 1;
              _context5.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].patch("/products/".concat(productId)));

            case 4:
              response = _context5.sent;
              // this will update the isFeatured prop of the product
              set(function (prevProducts) {
                return {
                  products: prevProducts.products.map(function (product) {
                    return product._id === productId ? _objectSpread({}, product, {
                      isFeatured: response.data.isFeatured
                    }) : product;
                  }),
                  loading: false
                };
              });
              _context5.next = 12;
              break;

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](1);
              set({
                loading: false
              });

              _reactHotToast["default"].error(_context5.t0.response.data.error || "Failed to update product");

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[1, 8]]);
    },
    fetchFeaturedProducts: function fetchFeaturedProducts() {
      var response;
      return regeneratorRuntime.async(function fetchFeaturedProducts$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              set({
                loading: true
              });
              _context6.prev = 1;
              _context6.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get("/products/featured"));

            case 4:
              response = _context6.sent;
              set({
                products: response.data,
                loading: false
              });
              _context6.next = 12;
              break;

            case 8:
              _context6.prev = 8;
              _context6.t0 = _context6["catch"](1);
              set({
                error: "Failed to fetch products",
                loading: false
              });
              console.log("Error fetching featured products:", _context6.t0);

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[1, 8]]);
    }
  };
});
exports.useProductStore = useProductStore;