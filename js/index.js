'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MultiSet = function () {
  function MultiSet() {
    _classCallCheck(this, MultiSet);

    this.set = {};
    this.length = 0;
  }

  _createClass(MultiSet, [{
    key: 'add',
    value: function add(string) {
      this.length += 1;
      if (this.set[string]) this.set[string] += 1;else this.set[string] = 1;
    }
  }, {
    key: 'remove',
    value: function remove(string) {
      if (!this.set[string]) throw "removing element not in MultiSet";else if (this.set[string] === 1) delete this.set[string];else this.set[string] -= 1;
      this.length -= 1;
    }
  }]);

  return MultiSet;
}();

var util = function () {

  function watch(callback) {
    var call = function call() {
      callback() && setTimeout(call);
    };
    setTimeout(call, 500);
  }

  function serialize(object) {
    var enc = encodeURIComponent;
    var args = [];
    var cond = function cond(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          val = _ref2[1];

      return val instanceof Array ? val.forEach(function (v) {
        return args.push([enc(key) + '[]', enc(v)]);
      }) : args.push([enc(key), enc(val)]);
    };
    Object.entries(object).forEach(cond);
    return args.map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          k = _ref4[0],
          v = _ref4[1];

      return k + '=' + v;
    }).join('&');
  }

  function addheader(url, headers) {
    return url.includes("?") ? url + '&' + serialize(headers) : url + '?' + serialize(headers);
  }

  function pairs_to_object(list) {
    return list.reduce(function (dict, pairs) {
      var _pairs = _slicedToArray(pairs, 2),
          key = _pairs[0],
          value = _pairs[1];

      dict[key] = value;
      return dict;
    }, {});
  }

  function reinitialize(dict_a, dict_b) {
    for (i in dict_a) {
      delete dict_a[i];
    }for (i in dict_b) {
      dict_a[i] = dict_b[i];
    }
  }

  function parselinkheader(rawtext) {

    var trim = function trim(x) {
      return x.slice(1, x.length - 1);
    };
    var items = rawtext.split(",");
    var pairs = items.map(function (s) {
      var _s$split = s.split(";"),
          _s$split2 = _slicedToArray(_s$split, 2),
          rawlink = _s$split2[0],
          rawrel = _s$split2[1];

      var _rawrel$split = rawrel.split("="),
          _rawrel$split2 = _slicedToArray(_rawrel$split, 2),
          _ = _rawrel$split2[0],
          rel = _rawrel$split2[1];

      return [trim(rel), trim(rawlink)];
    });

    return pairs_to_object(pairs);
  }

  function getnext(result) {
    var linkhead = result.getResponseHeader("Link");
    return linkhead ? parselinkheader(linkhead).next : undefined;
  }

  function textfromhtml(html) {
    var body = document.createElement("html");
    body.innerHTML = html;
    return body.textContent;
  }

  function regex(query, cased) {
    var modifier = cased ? "g" : "ig";
    return query instanceof RegExp ? query : new RegExp('(' + query + ')', modifier);
  }

  function splitmatch(item, query) {
    var cased = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var string = JSON.stringify(item);
    var regex = util.regex(query, cased);
    return string.split(regex);
  }

  function includes(string, query) {
    var cased = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!cased) string = string.toLowerCase(), query = query.toLowercase();
    return string.includes(query);
  }

  function truncate(string, n) {
    return string.length > n ? string.slice(0, n - 3) + "..." : string;
  }

  function indicesof(array, _check) {
    var coll = [];
    if (!_check instanceof Function) _check = function check(x) {
      return x === _check;
    };
    array.forEach(function (val, ind) {
      if (_check(val)) coll.push(ind);
    });
    return coll;
  }

  return {
    "watch": watch,
    "regex": regex,
    "getnext": getnext,
    "serialize": serialize,
    "addheader": addheader,
    "indicesof": indicesof,
    "splitmatch": splitmatch,
    "textfromhtml": textfromhtml,
    "reinitialize": reinitialize,
    "parselinkheader": parselinkheader,
    "pairs_to_object": pairs_to_object
  };
}();
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var endpoint = "https://canvas.brown.edu/api/v1/",
    baselink = "https://canvas.brown.edu/",

// local = "http://localhost:5000/"
local = "https://canvas.brown.edu/api/v1/";

var Loader = function () {
  function Loader(key) {
    _classCallCheck(this, Loader);

    this.wait = new MultiSet();
    this.type = "generic";
    this.token = key;
    this.headers = {
      "per_page": 1000
    };
  }

  _createClass(Loader, [{
    key: "to_url",
    value: function to_url(arglist) {
      var section = arglist.join("/");
      // const querystr = util.serialize(this.headers)
      return "" + local + section;
    }
  }, {
    key: "to_link",
    value: function to_link(arglist) {
      var section = arglist.join("/");
      var querystr = util.serialize(this.headers);
      return "" + local + section + "?" + querystr;
    }

    // load a given link, replacing the base with the local
    // and adding predefined headers

  }, {
    key: "loadxhr",
    value: function loadxhr(method, link, callback) {
      var _this = this;

      var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      // these two lines keep track of the number of objects 
      // that are still being waited on 
      var head = Object.assign({}, this.headers, headers);
      var redi = link.includes(endpoint) ? link.replace(endpoint, local) : link.replace(baselink, local);
      var curl = util.addheader(redi, head);
      var call = function call(e, r) {
        _this.wait.remove(redi);
        callback(r, e);
        if (e) console.log("Error", e);
      };
      this.wait.add(redi);
      return d3.request(curl).header('Authorization', 'Bearer ' + this.token).get(method, call);
    }
  }, {
    key: "loadlink",
    value: function loadlink(method, link, callback) {
      var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var call = function call(r, e) {
        return e ? callback(r, e) : callback(JSON.parse(r.response), e);
      };
      return this.loadxhr(method, link, call, headers);
    }
  }, {
    key: "loadall",
    value: function loadall(method, link, callback) {
      var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var self = this;
      var recursive_call = function recursive_call(result, error) {
        var resp = JSON.parse(result.response);
        if (error || resp.errors) return callback(resp, error);
        resp.forEach(function (r, index) {
          return callback(r);
        });
        var next = util.getnext(result);
        if (next) self.loadxhr(method, next, recursive_call, headers);
      };

      return self.loadxhr(method, link, recursive_call, headers);
    }
  }, {
    key: "putlink",
    value: function putlink(link, callback) {
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.loadlink('PUT', link, callback, headers);
    }
  }, {
    key: "getlink",
    value: function getlink(link, callback) {
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.loadlink('GET', link, callback, headers);
    }
  }, {
    key: "getall",
    value: function getall(link, callback) {
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.loadall('GET', link, callback, headers);
    }
  }, {
    key: "getcourse",
    value: function getcourse(course, callback) {
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (this.type === "generic") throw "unspecified class for loader";
      var url = this.to_url(["courses", course, this.type]);
      return this.getall(url, callback, headers);
    }
  }]);

  return Loader;
}();

var QuizLoader = function (_Loader) {
  _inherits(QuizLoader, _Loader);

  function QuizLoader(key) {
    _classCallCheck(this, QuizLoader);

    var _this2 = _possibleConstructorReturn(this, (QuizLoader.__proto__ || Object.getPrototypeOf(QuizLoader)).call(this, key));

    _this2.type = "quizzes";
    return _this2;
  }

  return QuizLoader;
}(Loader);

var AssignmentLoader = function (_Loader2) {
  _inherits(AssignmentLoader, _Loader2);

  function AssignmentLoader(key) {
    _classCallCheck(this, AssignmentLoader);

    var _this3 = _possibleConstructorReturn(this, (AssignmentLoader.__proto__ || Object.getPrototypeOf(AssignmentLoader)).call(this, key));

    _this3.type = "assignments";
    return _this3;
  }

  return AssignmentLoader;
}(Loader);

var DiscussionLoader = function (_Loader3) {
  _inherits(DiscussionLoader, _Loader3);

  function DiscussionLoader(key) {
    _classCallCheck(this, DiscussionLoader);

    var _this4 = _possibleConstructorReturn(this, (DiscussionLoader.__proto__ || Object.getPrototypeOf(DiscussionLoader)).call(this, key));

    _this4.type = "discussion_topics";
    return _this4;
  }

  return DiscussionLoader;
}(Loader);

var AnnouncementLoader = function (_Loader4) {
  _inherits(AnnouncementLoader, _Loader4);

  _createClass(AnnouncementLoader, [{
    key: "getcourse",
    value: function getcourse(course, callback) {
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var course_str = "course_" + course;
      headers.context_codes instanceof Array ? headers.context_codes.push(course_str) : headers.context_codes = [course_str];

      var url = this.to_url(["announcements"]);
      return this.getall(url, callback, headers);
    }
  }]);

  function AnnouncementLoader(key) {
    _classCallCheck(this, AnnouncementLoader);

    var _this5 = _possibleConstructorReturn(this, (AnnouncementLoader.__proto__ || Object.getPrototypeOf(AnnouncementLoader)).call(this, key));

    _this5.type = "announcements";
    return _this5;
  }

  return AnnouncementLoader;
}(Loader);

var PageLoader = function (_Loader5) {
  _inherits(PageLoader, _Loader5);

  function PageLoader(key) {
    _classCallCheck(this, PageLoader);

    var _this6 = _possibleConstructorReturn(this, (PageLoader.__proto__ || Object.getPrototypeOf(PageLoader)).call(this, key));

    _this6.type = "pages";
    return _this6;
  }

  _createClass(PageLoader, [{
    key: "getcourse",
    value: function getcourse(course, callback) {
      var self = this;
      return _get(PageLoader.prototype.__proto__ || Object.getPrototypeOf(PageLoader.prototype), "getcourse", this).call(this, course, function (response, error) {
        if (error) console.log("error", error), callback(response, error);
        self.getlink(response.html_url, callback);
      });
    }
  }]);

  return PageLoader;
}(Loader);

var CourseLoader = function (_Loader6) {
  _inherits(CourseLoader, _Loader6);

  function CourseLoader(key) {
    _classCallCheck(this, CourseLoader);

    var _this7 = _possibleConstructorReturn(this, (CourseLoader.__proto__ || Object.getPrototypeOf(CourseLoader)).call(this, key));

    _this7.type = "courses";
    return _this7;
  }

  // ironic


  _createClass(CourseLoader, [{
    key: "getcourse",
    value: function getcourse(course, callback) {
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      throw "not supported";
    }
  }, {
    key: "listcourse",
    value: function listcourse(callback, headers) {
      var link = this.to_url(["courses"]);
      return this.getlink(link, callback, headers);
    }
  }]);

  return CourseLoader;
}(Loader);

// course loader not included cuz 
// well, its find of different


var makeloaders = function makeloaders(key) {
  return {
    'pages': new PageLoader(key),
    'quizzes': new QuizLoader(key),
    'assignments': new AssignmentLoader(key),
    'announcements': new AnnouncementLoader(key),
    'discussion_topics': new DiscussionLoader(key)
  };
};
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasMatch = function () {
  function CanvasMatch(object, key, query, cased) {
    _classCallCheck(this, CanvasMatch);

    var string = JSON.stringify(object[key]);
    var regex = util.regex(query);
    var array = string.split(regex);

    this.object = object;
    this.string = string;
    this.query = query;
    this.cased = cased;
    this.regex = regex;
    this.key = key;

    this.array = array;
    this.indices = util.indicesof(array, function (x) {
      return regex.test(x);
    });
    this.count = this.array.length;
  }

  // reupdate the match object


  _createClass(CanvasMatch, [{
    key: "update",
    value: function update() {
      this.constructor(this.object, this.key, this.query, this.cased);
    }
  }, {
    key: "enumerate",
    value: function enumerate() {
      var slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

      var self = this;
      var plus = function plus(x) {
        return Math.max(0, x);
      };
      var array = self.array;
      var qulen = self.query.length;
      return self.indices.map(function (i) {
        var head = self.array.slice(0, i).join("");
        var tail = self.array.slice(i + 1).join("");
        var lstr = head.slice(-slice);
        var rstr = tail.slice(0, slice);
        return {
          "left": lstr,
          "curr": array[i],
          "right": rstr,
          "match": self,
          "index": i
        };
      });
    }
  }]);

  return CanvasMatch;
}();

var CanvasObject = function () {
  _createClass(CanvasObject, [{
    key: "fromobject",


    // does nothing since it is already a base object
    value: function fromobject(object) {
      return this;
    }
  }]);

  function CanvasObject(response, loader) {
    _classCallCheck(this, CanvasObject);

    var self = this;

    // extract course id and page type from given url
    function parse(url) {
      var l = url.split("/");
      var start = l.indexOf("courses");
      // url formats are of the form /courses/course_id/page_type/page_id

      var _l$slice = l.slice(start + 1, start + 3),
          _l$slice2 = _slicedToArray(_l$slice, 2),
          course_id = _l$slice2[0],
          type = _l$slice2[1];

      return [course_id, type];
    }

    function main(response, loader) {
      var link = response.html_url.includes(endpoint) ? response.html_url : response.html_url.replace(baselink, endpoint);

      var _parse = parse(link),
          _parse2 = _slicedToArray(_parse, 2),
          course_id = _parse2[0],
          page_type = _parse2[1];

      self.pagelink = response.html_url;
      self.course_id = course_id;
      self.page_type = page_type;
      self.response = response;
      self.loader = loader;
      self.link = link;
      self.fromobject(self);
    }

    return main(response, loader);
  }

  _createClass(CanvasObject, [{
    key: "assert_type",
    value: function assert_type(type) {
      if (this.page_type !== type) throw "wrong canvas object type";
    }
  }, {
    key: "assert_id",
    value: function assert_id(id) {
      var resp_id = this.response.id || this.response.course_id;
      if (this.id != resp_id) throw "inconsistent object id: " + resp_id + " vs " + this.id;else if (id && this.id != id) throw "false assert id: " + id + " vs " + this.id;
    }

    // returns url for getting and posting 

  }, {
    key: "arrayurl",
    value: function arrayurl() {
      return ["courses", this.course_id, this.page_type, this.id];
    }
  }, {
    key: "push",
    value: function push(callback) {
      throw "not implemented";
      var load = this.loader;
      var url_array = this.arrayurl();
      var url = load.to_url(url_array);
      load.putlink(url, callback, this.sendobject());
    }
  }, {
    key: "search",
    value: function search(query) {
      var cased = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var slice = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

      var self = this;
      // const extend = array => coll.push.apply(coll, array)
      return self.matchables().map(function (name) {
        return new CanvasMatch(self, name, query, cased);
      }).reduce(function (coll, match) {
        coll.push.apply(coll, _toConsumableArray(match.enumerate(slice)));
        return coll;
      }, []);
    }
  }]);

  return CanvasObject;
}();

var CanvasQuiz = function (_CanvasObject) {
  _inherits(CanvasQuiz, _CanvasObject);

  function CanvasQuiz() {
    _classCallCheck(this, CanvasQuiz);

    return _possibleConstructorReturn(this, (CanvasQuiz.__proto__ || Object.getPrototypeOf(CanvasQuiz)).apply(this, arguments));
  }

  _createClass(CanvasQuiz, [{
    key: "updateresponse",
    value: function updateresponse() {
      throw "not implemented";
      var response = this.response;
      response.title = this.title;
      response.description = this.rawbody;
      if (this.id !== response.id) throw "object id does not match with response id";
    }
  }, {
    key: "fromobject",
    value: function fromobject(object) {
      var response = object.response;
      Object.assign(this, object);
      this.id = response.id;
      this.title = response.title;
      this.rawbody = response.description;
      this.text = util.textfromhtml(this.rawbody);
      this.assert_type("quizzes");
      return this;
    }
  }, {
    key: "matchables",
    value: function matchables() {
      return ["id", "title", "rawbody"];
    }
  }]);

  return CanvasQuiz;
}(CanvasObject);

var CanvasPage = function (_CanvasObject2) {
  _inherits(CanvasPage, _CanvasObject2);

  function CanvasPage() {
    _classCallCheck(this, CanvasPage);

    return _possibleConstructorReturn(this, (CanvasPage.__proto__ || Object.getPrototypeOf(CanvasPage)).apply(this, arguments));
  }

  _createClass(CanvasPage, [{
    key: "fromobject",
    value: function fromobject(object) {
      var response = object.response;
      Object.assign(this, object);
      this.id = response.page_id;
      this.title = response.title;
      this.rawbody = response.body;
      this.text = util.textfromhtml(this.rawbody);
      this.assert_type("pages");
      return this;
    }
  }, {
    key: "matchables",
    value: function matchables() {
      return ["id", "title", "rawbody"];
    }
  }]);

  return CanvasPage;
}(CanvasObject);

var CanvasDiscussion = function (_CanvasObject3) {
  _inherits(CanvasDiscussion, _CanvasObject3);

  function CanvasDiscussion() {
    _classCallCheck(this, CanvasDiscussion);

    return _possibleConstructorReturn(this, (CanvasDiscussion.__proto__ || Object.getPrototypeOf(CanvasDiscussion)).apply(this, arguments));
  }

  _createClass(CanvasDiscussion, [{
    key: "fromobject",
    value: function fromobject(object) {
      var response = object.response;
      Object.assign(this, object);
      this.id = response.id;
      this.title = response.title;
      this.rawbody = response.message;
      this.text = util.textfromhtml(this.rawbody);
      this.assert_type("discussion_topics");
      return this;
    }
  }, {
    key: "matchables",
    value: function matchables() {
      return ["id", "title", "rawbody"];
    }
  }]);

  return CanvasDiscussion;
}(CanvasObject);

var CanvasAnnouncement = function (_CanvasObject4) {
  _inherits(CanvasAnnouncement, _CanvasObject4);

  function CanvasAnnouncement() {
    _classCallCheck(this, CanvasAnnouncement);

    return _possibleConstructorReturn(this, (CanvasAnnouncement.__proto__ || Object.getPrototypeOf(CanvasAnnouncement)).apply(this, arguments));
  }

  _createClass(CanvasAnnouncement, [{
    key: "fromobject",
    value: function fromobject(object) {
      var response = object.response;
      Object.assign(this, object);
      this.id = response.id;
      this.title = response.title;
      this.rawbody = response.message;
      this.text = util.textfromhtml(this.rawbody);
      this.assert_type("discussion_topics");
      return this;
    }
  }, {
    key: "matchables",
    value: function matchables() {
      return ["id", "title", "rawbody"];
    }
  }]);

  return CanvasAnnouncement;
}(CanvasObject);

var CanvasAssignment = function (_CanvasObject5) {
  _inherits(CanvasAssignment, _CanvasObject5);

  function CanvasAssignment() {
    _classCallCheck(this, CanvasAssignment);

    return _possibleConstructorReturn(this, (CanvasAssignment.__proto__ || Object.getPrototypeOf(CanvasAssignment)).apply(this, arguments));
  }

  _createClass(CanvasAssignment, [{
    key: "fromobject",
    value: function fromobject(object) {
      var response = object.response;
      Object.assign(this, object);
      this.id = response.id;
      this.title = response.name;
      this.rawbody = response.description;
      this.text = util.textfromhtml(this.rawbody);
      this.assert_type("assignments");
      return this;
    }
  }, {
    key: "matchables",
    value: function matchables() {
      return ["id", "title", "rawbody"];
    }
  }]);

  return CanvasAssignment;
}(CanvasObject);

var prototypes = {
  'object': CanvasObject.prototype,
  'pages': CanvasPage.prototype,
  'quizzes': CanvasQuiz.prototype,
  'assignments': CanvasAssignment.prototype,
  'announcements': CanvasAnnouncement.prototype,
  'discussion_topics': CanvasDiscussion.prototype

  // returns to corresponding
  // canvas object judging from response
};function fromresponse(response, loader) {
  var object = new CanvasObject(response, loader);
  var type = loader.type; // object.page_type 

  return Object.create(prototypes[type]).fromobject(object);
}

var CanvasCourse = function () {
  function CanvasCourse(key, id, name) {
    _classCallCheck(this, CanvasCourse);

    name = name || id;
    this.key = key;
    this.subs = {};
    this.name = name; // name doesn't have to be defined
    this.course = id; // course id does have to be defined
    this.loaders = makeloaders(key);
  }

  _createClass(CanvasCourse, [{
    key: "getcontent",
    value: function getcontent() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (r) {
        return r;
      };

      var self = this;
      var course = self.course;
      var setval = function setval(loader) {
        return function (response) {
          var object = fromresponse(response, loader);
          self.subs[object.id] = object;
          callback(object);
        };
      };

      Object.values(this.loaders).forEach(function (load) {
        return load.getcourse(course, setval(load));
      });
    }
  }, {
    key: "search",
    value: function search(query) {
      var cased = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var slice = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

      var regex = util.regex(query, cased);
      // const extend = array => array.forEach(match => console.log(match)coll.push)
      return Object.values(this.subs).reduce(function (coll, object) {
        coll.push.apply(coll, _toConsumableArray(object.search(regex, cased, slice)));
        return coll;
      }, []);
    }

    // number of requests that are being waited on

  }, {
    key: "limbo",
    value: function limbo() {
      return Object.values(this.loaders).reduce(function (coll, val) {
        return coll + val.wait.length;
      }, 0);
    }
  }]);

  return CanvasCourse;
}();

var CourseList = function () {
  function CourseList(key) {
    _classCallCheck(this, CourseList);

    this.key = key;
    this.course = [];
    this.loader = new CourseLoader(key);
  }

  _createClass(CourseList, [{
    key: "loadcourse",
    value: function loadcourse(callback) {
      var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var courselist = this.course;
      var call = function call(r) {
        var course = new CanvasCourse(key, r.id, r.name);
        courselist.push(course);
        callback(course);
      };

      return this.loader.loadcourse(callback, headers);
    }
  }]);

  return CourseList;
}();
'use strict';

var get_class = function get_class(name) {
  return document.getElementsByClassName(name);
};
var get_id = function get_id(id) {
  return document.getElementById(id);
};
var wrapper_options = {
  valueNames: ['object-id', 'object-title', 'object-page-type', 'object-text']
};

var results_options = {
  valueNames: ['result-match', 'result-id', 'result-title', 'result-type']
};
var course = null;
var access_key = null;
var canvaslist = new List('holder', wrapper_options);
var resultlist = new List('results-holder', results_options);

CanvasObject.prototype.bindto = function (tr) {
  if (this.course_id !== course.course) return;
  var type = this.loader.type.split("_").join(" ");
  var header = '<h1>' + this.title + '</h1><br><br>';
  var htmltext = header + this.rawbody;
  tr.attr("class", 'object-row').attr("id", this.id).on('click', function () {
    return d3.select('div.html-content').html(htmltext);
  });
  tr.append("td").attr("class", "object-id").append('a').attr('href', this.pagelink).text(this.id);
  tr.append("td").attr("class", "object-title").text(this.title);
  tr.append("td").attr("class", "object-page-type").text(type);
  tr.append("td").attr("class", "object-text").text(this.text);
};

CanvasCourse.prototype.reindex = function (object) {
  var forced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var self = this;
  var tbody = d3.select('table.wrapper').select('tbody.list');
  if (!forced && !canvaslist.filtered && !canvaslist.searched) {
    if (object) object.bindto(tbody.append('tr'));
    return canvaslist.reIndex();
  }
  tbody.html("");
  Object.values(this.subs).map(function (object) {
    return object.bindto(tbody.append('tr'));
  });
  canvaslist.reIndex();
};

function loadcourses() {

  function hide_api() {
    d3.select("p.access-key").style("display", "none");
    d3.select("p.top-access-key").style("display", "none");
    d3.select("input.access-key").transition().duration(750).style('width', '0');
  }

  function show_api() {
    d3.select("p.access-key").style("display", "initial");
    d3.select("p.top-access-key").style("display", "initial");
    d3.select("input.access-key").style("display", "initial").transition().duration(400).style('width', '60%');
  }

  function hide_section() {
    d3.select("section.access-key").transition().duration(1000).style("height", "0");
    d3.select("section.access-key").transition().delay(1000).style("display", "none");
  }

  function main() {
    var key = get_id('input-key').value;
    var loader = new CourseLoader(key);
    hide_api();

    var onerror = function onerror() {
      show_api();
      get_id('api-key-error').innerHTML = "api key error";
    };

    loader.listcourse(function (courses, error) {
      if (error) return onerror();
      access_key = key;
      hide_section();
      d3.select('select.coursebar').html("<option value=''>course</option>").selectAll('option') // doesn't matter here
      .data(courses).enter().append('option').attr('value', function (d) {
        return d.id;
      }).text(function (d) {
        return d.name;
      });
    });
  }

  return main();
}

function loadcontent() {
  var course_id = get_id('course-id').value;
  if (!course_id) return;
  var newcourse = course = new CanvasCourse(access_key, course_id);
  course.reindex(null, true);
  newcourse.getcontent(function (object) {
    course.reindex(object);
  });
}

function hideresults() {

  var results = d3.select("section.results").style("width", "0%");

  results.transition().delay(500).style("border-left", "none");

  d3.select("section.results-head").style("width", "0%");

  d3.select("div.close").style("display", "none");
}

function searchcourse() {

  function showresults() {
    d3.select("div.close").style("display", "initial");
    d3.select("section.results-head").style("width", "50%");
    d3.select("section.results").style("width", "50%").style("border-left", "solid medium black");
  }

  function main() {
    var query = get_id('input-search').value;
    if (course === null) return window.alert('Pick a course first.');else if (!query) return hideresults();else if (query.length < 3) return window.alert('Query too short.');

    course.reindex(null, true);
    var data = course.search(query, false, 19);
    var tbody = d3.select('table.results').select('tbody.list').html("");
    var tr = tbody.selectAll('tbody') // doesn't matter here just don't use tr
    .data(data).enter().append('tr');

    tr.on('click', function (m) {
      var object = m.match.object;
      var header = '<h1>' + object.title + '</h1><br><br>';
      var htmltext = header + object.rawbody;
      d3.select('div.html-content').html(htmltext);
    });

    var matchtd = tr.append('td').attr('class', 'result-match');
    matchtd.append('p').text(function (m) {
      return m.left;
    });
    matchtd.append('p').text(function (m) {
      return m.curr;
    }).style('font-weight', 'bold');
    matchtd.append('p').text(function (m) {
      return m.right;
    });

    tr.append('td').attr('class', 'result-id').append('a').text(function (m) {
      return m.match.object.id;
    }).attr('href', function (m) {
      return m.match.object.pagelink;
    });

    tr.append('td').attr('class', 'result-title').text(function (m) {
      return m.match.object.title;
    });

    tr.append('td').attr('class', 'result-type').text(function (m) {
      return m.match.object.loader.type;
    });

    showresults();
    resultlist.reIndex();
  }

  return main();
}

function update() {
  var classes = get_class('topic-select');
  var types = Array.from(classes).filter(function (item) {
    return item.checked;
  }).map(function (item) {
    return item.value;
  });

  resultlist.filter(function (item) {
    return types.includes(item._values['result-type']), console.log(item._values['result-type']);
  });
}
