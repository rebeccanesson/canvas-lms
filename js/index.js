'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = function () {
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

  function addparams(url, headers) {
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
    var linkhead = result.get("Link");
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

  function print(x) {
    console.log(x);
    return x;
  }

  function boxkeys(boxname, object) {
    var box = function box(s) {
      return boxname + '[' + s + ']';
    };
    var newobj = {};
    Object.entries(object).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];

      return newobj[box(key)] = value;
    });
    return newobj;
  }

  return {
    watch: watch, regex: regex, getnext: getnext, serialize: serialize, addparams: addparams, indicesof: indicesof,
    splitmatch: splitmatch, textfromhtml: textfromhtml, reinitialize: reinitialize, parselinkheader: parselinkheader,
    pairs_to_object: pairs_to_object, MultiSet: MultiSet, print: print, boxkeys: boxkeys
  };
}();
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var load = function () {

  var endpoint = "https://canvas.brown.edu/api/v1/";
  var baselink = "https://canvas.brown.edu/";
  var local = "https://canvas.brown.edu/api/v1/";

  var Loader = function () {
    function Loader(key) {
      _classCallCheck(this, Loader);

      this.wait = new util.MultiSet();
      this.type = "generic";
      this.token = key;
      this.param = {}; // { "per_page": 1000 }

      this.head = {
        "Authorization": "Bearer " + key,
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    }

    _createClass(Loader, [{
      key: "to_url",
      value: function to_url(arglist) {
        var section = arglist.join("/");
        // const querystr = util.serialize(this.headers)
        return "" + local + section;
      }

      // load a given link, replacing the base with the local
      // and adding predefined headers

    }, {
      key: "loadxhr",
      value: function loadxhr(method, link, _ref, callback) {
        var _this = this;

        var data = _ref.data,
            param = _ref.param,
            head = _ref.head;

        // these two lines keep track of the number of objects 
        // that are still being waited on 
        var body = data;
        var params = Object.assign({}, this.param, param);
        var headers = Object.assign({}, this.head, head);
        var preurl = link.includes(endpoint) ? link.replace(endpoint, local) : link.replace(baselink, local);
        var url = util.addparams(preurl, params);
        this.wait.add(url);
        var call = function call(r, e) {
          // console.log(r)
          _this.wait.remove(url);
          callback(r, e);
          if (e) console.log("Error", e);
        };

        return popsicle.request({ method: method, url: url, body: body, headers: headers }).then(call).catch(function (x) {
          return console.log("error", x);
        });
      }
    }, {
      key: "putcontent",
      value: function putcontent(link, metadata) {
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (r) {
          return r;
        };

        return this.loadxhr('PUT', link, metadata, callback);
      }
    }, {
      key: "loadlink",
      value: function loadlink(method, link, metadata, callback) {
        var call = function call(r, e) {
          return e ? callback(r, e) : callback(JSON.parse(r.body), e);
        };
        return this.loadxhr(method, link, metadata, call);
      }
    }, {
      key: "loadall",
      value: function loadall(method, link, metadata, callback) {
        var self = this;
        var recursive_call = function recursive_call(r, e) {
          if (e) console.log("error", e);
          var resp = JSON.parse(r.body);
          if (e || resp.errors) return callback(resp, e);
          resp.forEach(function (r) {
            return callback(r);
          });
          var next = util.getnext(r);
          if (next) self.loadxhr(method, next, metadata, recursive_call);
        };

        return self.loadxhr(method, link, metadata, recursive_call);
      }
    }, {
      key: "putlink",
      value: function putlink(link, metadata, callback) {
        return this.loadlink('PUT', link, metadata, callback);
      }
    }, {
      key: "getlink",
      value: function getlink(link, metadata, callback) {
        return this.loadlink('GET', link, metadata, callback);
      }

      // get and reget following the next link

    }, {
      key: "getall",
      value: function getall(link, metadata, callback) {
        return this.loadall('GET', link, metadata, callback);
      }
    }, {
      key: "getcourse",
      value: function getcourse(course, metadata, callback) {
        if (this.type === "generic") throw "unspecified class for loader";
        var link = this.to_url(["courses", course, this.type]);
        return this.getall(link, metadata, callback);
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
      value: function getcourse(course, _ref2, callback) {
        var headers = _ref2.headers,
            param = _ref2.param,
            data = _ref2.data;

        var course_str = "course_" + course;
        var link = this.to_url(["courses", course, "discussion_topics"]);
        param = Object.assign({ 'only_announcements': true }, param);
        return this.getall(link, { headers: headers, param: param, data: data }, callback);
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
      value: function getcourse(course, metadata, callback) {
        var self = this;
        return _get(PageLoader.prototype.__proto__ || Object.getPrototypeOf(PageLoader.prototype), "getcourse", this).call(this, course, {}, function (response, error) {
          if (error) console.log("error", error), callback(response, error);
          self.getlink(response.html_url, metadata, callback);
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
      value: function getcourse(course, metadata, callback) {
        throw "not supported";
      }
    }, {
      key: "listcourse",
      value: function listcourse(callback, metadata) {
        var link = this.to_url(["courses"]);
        return this.getlink(link, metadata, function (ret) {
          return ret.forEach(callback);
        });
      }
    }]);

    return CourseLoader;
  }(Loader);

  // course loader not included cuz 
  // well, its kind of different


  var courses = function courses(key) {
    return new CourseLoader(key);
  };
  var loaders = function loaders(key) {
    return {
      'pages': new PageLoader(key),
      'quizzes': new QuizLoader(key),
      'assignments': new AssignmentLoader(key),
      'announcements': new AnnouncementLoader(key),
      'discussion_topics': new DiscussionLoader(key)
    };
  };

  return { courses: courses, loaders: loaders };
}();
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// NOTE: doesn't work when we have
// str<br>ing</br> and we search for string.

var Search = function () {

  var l = function l(i) {
    return 2 * i + 1;
  }; // index of left child
  var r = function r(i) {
    return 2 * i + 2;
  }; // index of right child
  var p = function p(i) {
    return i - 1 >> 1;
  }; // index of parent
  // largest power of two greater than or equal to x
  var ceillog = function ceillog(x) {
    return Math.ceil(Math.log2(x));
  };

  function assert_str_eq() {}

  function onespace(s) {
    while (s.includes("  ")) {
      s = s.replace(/  /g, " ");
    }while (s.includes("\n ")) {
      s = s.replace(/\n /g, "\n");
    }while (s.includes(" \n")) {
      s = s.replace(/ \n/g, "\n");
    }return s;
  }

  var Html = function () {
    _createClass(Html, [{
      key: "heapify",


      // binary tree stores the length of the text stored in the tree
      value: function heapify() {
        var size = this.size = 2 ** ceillog(this.items.length);
        var heap = this.heap = Array(size << 1 + 1).fill(0);
        this.items.forEach(function (s, i) {
          return heap[i + size] = !s.attr * s.text.length;
        });

        for (var i = size - 1; i >= 0; --i) {
          heap[i] = heap[l(i)] + heap[r(i)];
        }
      }
    }]);

    function Html(html) {
      var ashtml = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _classCallCheck(this, Html);

      var match = /(<..*?>)/g;
      this.raw = html;
      this.items = ashtml ? html.split(match).map(function (s) {
        return s.trim();
      }).filter(function (s) {
        return s !== '';
      }).map(function (s) {
        return { "attr": /^<..*?>$/g.test(s), "text": s };
      }) : html.split(/ /g).map(function (s) {
        return { "attr": false, "text": s };
      });
      if (ashtml) this.items.forEach(function (d) {
        return d.attr ? null : d.text = onespace(d.text + " ");
      });
      this.heapify();
    }

    // update the tree to preserve the property


    _createClass(Html, [{
      key: "update",
      value: function update(i) {

        var heap = this.heap;
        this.asserttext(i);
        heap[i + this.size] = this.items[i].text.length;
        i += this.size;
        while (i >>= 1) {
          heap[i] = heap[l(i)] + heap[r(i)];
        }
      }

      // find the item containing
      // character at index i in the text

    }, {
      key: "itemindex",
      value: function itemindex(i) {
        var curr = 0;
        var heap = this.heap;
        while (curr < this.size) {
          curr = i < heap[l(curr)] ? l(curr) : (i -= heap[l(curr)], r(curr));
        } // cute
        return curr - this.size;
      }

      // returns the starting index
      // in the text of item at index i

    }, {
      key: "textindex",
      value: function textindex(i) {
        var ind = 0;
        i += this.size;
        while (i = p(i)) {
          // only adds the size of left child if you are the right child
          ind += !(i % 2) * this.heap[l(p(i))];
        }return ind;
      }
    }, {
      key: "text",
      value: function text() {
        return this.items.filter(function (s) {
          return !s.attr;
        }).map(function (s) {
          return s.text;
        }).join("").trim();
      }
    }, {
      key: "html",
      value: function html() {
        return this.items.map(function (s) {
          return s.text.trim();
        }).join("");
      }
    }, {
      key: "search",
      value: function search(pattern, options) {
        var csize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 18;

        if (!pattern) throw "empty search pattern";
        if (pattern[0] == '(' && pattern[pattern.length - 1] == ')') pattern = pattern.slice(1, pattern.length - 1);
        var match = 0;
        var pos = function pos(x) {
          return Math.max(x, 0);
        };
        var regex = new RegExp("(" + pattern + ")", options);
        var strict = new RegExp("^" + pattern + "$", options);
        var text = this.text();
        return text.split(regex).map(function (str) {
          return [str, match, match += str.length];
        }).filter(function (t) {
          return strict.test(t[0]);
        }) // dont switch filter with map here
        .map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              str = _ref2[0],
              start = _ref2[1],
              end = _ref2[2];

          return {
            "text": str,
            "s": start,
            "e": end,
            'before': text.slice(pos(start - csize), start),
            'after': text.slice(end, end + csize)
          };
        });
      }

      // returns -1 if this is the last
      // instance of text

    }, {
      key: "nexttextitem",
      value: function nexttextitem(i) {
        while (++i < this.items.length) {
          if (!this.items[i].attr) return i;
        }return -1;
      }
    }, {
      key: "asserttext",
      value: function asserttext(i) {
        if (this.items[i].attr) throw "not an editable text";
      }
    }, {
      key: "replace",
      value: function replace(match, newstr) {

        function split(text) {
          for (var _len = arguments.length, pairs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            pairs[_key - 1] = arguments[_key];
          }

          pairs.unshift(0);
          var mapper = function mapper(_, i) {
            return text.slice(pairs[i], pairs[i + 1]);
          };
          return pairs.map(mapper);
        }

        function finalize(self, match, tochange, affected) {
          var removedtext = tochange.map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 3),
                _ = _ref4[0],
                oldtext = _ref4[1],
                __ = _ref4[2];

            return oldtext;
          }).join("");

          if (removedtext !== match.text) throw "text to replace is different from text found: \"" + match.text + "\" vs \"" + removedtext + "\"";

          tochange.map(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 3),
                item = _ref6[0],
                _ = _ref6[1],
                newtext = _ref6[2];

            return item.text = newtext;
          });
          affected.forEach(function (i) {
            return self.update(i);
          });
        }

        function main(self, match, newstr) {
          if (newstr === undefined) throw 'no replace string given';
          var i = self.itemindex(match.s);
          self.asserttext(i);
          var t = self.textindex(i);
          var affected = [i];

          var curr = self.items[i];
          var start = match.s - t,
              stop = match.e - t;

          var _split = split(curr.text, start, stop),
              _split2 = _slicedToArray(_split, 3),
              l = _split2[0],
              m = _split2[1],
              r = _split2[2];

          var tochange = [[curr, m, l + newstr + r]];
          var overflow = stop - curr.text.length;

          while (overflow > 0 && (i = self.nexttextitem(i)) > -1) {
            var _curr = self.items[i];
            tochange.push([_curr].concat(_toConsumableArray(split(_curr.text, overflow))));
            affected.push(i);
            overflow -= _curr.text.length;
          }

          return finalize(self, match, tochange, affected);
        }

        return main(this, match, newstr);
      }
    }, {
      key: "replaceall",
      value: function replaceall(matches, newstr) {
        var _this = this;

        matches.sort(function (ma, mb) {
          return mb.s - ma.s;
        });
        for (var i = 0; i < matches.length - 1; ++i) {
          if (matches[i].s < matches[i + 1].e) throw "overlap in matches to be replaced";
        } // replace from the back since
        // sizes in the heap are preserved up to the
        // index of replacement
        matches.forEach(function (m) {
          return _this.replace(m, newstr);
        });
      }
    }]);

    return Html;
  }();

  return Html;
}();
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = function () {
  // local is set in case we're using a server relay
  var local = "https://canvas.brown.edu/api/v1/";
  var endpoint = "https://canvas.brown.edu/api/v1/";
  var baselink = "https://canvas.brown.edu/";

  var CanvasObject = function () {
    _createClass(CanvasObject, [{
      key: "transferrable",
      value: function transferrable() {
        return {};
      }
    }, {
      key: "matchable",
      value: function matchable() {
        return [];
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
            courseid = _l$slice2[0],
            pagetype = _l$slice2[1];

        return [courseid, pagetype];
      }

      // bad name
      function runprotocol(self) {
        // transfer things in transferrable to self
        Object.entries(self.transferrable()).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          return self[key] = response[value];
        });

        // create a search object for each searchable string
        // then set this.text to their concatenation
      }

      function main(response, loader) {
        var link = response.html_url.includes(endpoint) ? response.html_url : response.html_url.replace(baselink, endpoint);

        var _parse = parse(link),
            _parse2 = _slicedToArray(_parse, 2),
            courseid = _parse2[0],
            pagetype = _parse2[1];

        self.pagelink = response.html_url;
        self.courseid = courseid;
        self.pagetype = pagetype;
        self.response = response;
        self.searcher = {};
        self.loader = loader;
        self.link = link;

        runprotocol(self);
      }

      return main(response, loader);
    }

    _createClass(CanvasObject, [{
      key: "fromnewresponse",
      value: function fromnewresponse(response) {
        this.constructor(response, this.loader);
      }
    }, {
      key: "text",
      value: function text() {
        var _this = this;

        return this.matchable().map(function (key) {
          return "--[" + _this.searcher[key].text() + "]--";
        }).join("");
      }
    }, {
      key: "assert_type",
      value: function assert_type(type) {
        if (this.pagetype !== type) throw "wrong canvas object type. expected " + type + ", got " + this.page_type;
      }
    }, {
      key: "assert_id",
      value: function assert_id(id) {
        var resp_id = this.response.id || this.response.courseid;
        if (this.id != resp_id) throw "inconsistent object id: " + resp_id + " vs " + this.id;else if (id && this.id != id) throw "false assert id: " + id + " vs " + this.id;
      }

      // returns url for getting and posting 

    }, {
      key: "arrayurl",
      value: function arrayurl() {
        return ["courses", this.courseid, this.pagetype, this.id];
      }
    }, {
      key: "reload",
      value: function reload() {
        throw "not implemented";
      }
    }, {
      key: "altered",
      value: function altered() {
        var _this2 = this;

        var retval = {};
        Object.entries(this.transferrable()).map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];

          if (_this2[key] !== _this2.response[value]) retval[value] = _this2[key];
        });
        return retval;
      }
    }, {
      key: "search",
      value: function search(query, option) {
        var ashtml = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var result = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var object = this;
        var search = object.searcher = {};
        object.matchable().map(function (key) {
          return search[key] = new Search(object[key], ashtml);
        });

        Object.entries(search).map(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              key = _ref6[0],
              s = _ref6[1];

          return [key, s.search(query, option)];
        }).map(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              key = _ref8[0],
              r = _ref8[1];

          return r.map(function (m) {
            return result.push({ key: key, object: object, m: m });
          });
        });

        return result;
      }
    }, {
      key: "replace",
      value: function replace(matches, newstr) {
        var _this3 = this;

        var cats = {};
        matches.map(function (_ref9) {
          var object = _ref9.object,
              key = _ref9.key,
              m = _ref9.m;
          return cats[[object.id, key]] ? cats[[object.id, key]].match.push(m) : cats[[object.id, key]] = { object: object, key: key, match: [m] };
        });
        Object.values(cats).map(function (_ref10) {
          var object = _ref10.object,
              key = _ref10.key,
              match = _ref10.match;

          object.searcher[key].replaceall(match, newstr);
          _this3[key] = object.searcher[key].html();
        });
      }
    }, {
      key: "push",
      value: function push(callback) {
        var load = this.loader;
        // const url_array = this.arrayurl()
        // const url = load.to_url(url_array)
        var link = this.link;
        var data = this.updatename ? util.boxkeys(this.updatename, this.altered()) : this.altered();
        load.putcontent(link, { data: data }, callback);
      }
    }]);

    return CanvasObject;
  }();

  var CanvasQuiz = function (_CanvasObject) {
    _inherits(CanvasQuiz, _CanvasObject);

    _createClass(CanvasQuiz, [{
      key: "transferrable",
      value: function transferrable() {
        return {
          "id": "id",
          "title": "title",
          "rawbody": "description"
        };
      }
    }, {
      key: "matchable",
      value: function matchable() {
        return ["title", "rawbody"];
      }
    }]);

    function CanvasQuiz(response, loader) {
      _classCallCheck(this, CanvasQuiz);

      var _this4 = _possibleConstructorReturn(this, (CanvasQuiz.__proto__ || Object.getPrototypeOf(CanvasQuiz)).call(this, response, loader));

      _this4.assert_type("quizzes");
      _this4.updatename = 'quiz';
      return _this4;
    }

    return CanvasQuiz;
  }(CanvasObject);

  var CanvasPage = function (_CanvasObject2) {
    _inherits(CanvasPage, _CanvasObject2);

    _createClass(CanvasPage, [{
      key: "transferrable",
      value: function transferrable() {
        return {
          "id": "page_id",
          "title": "title",
          "rawbody": "body"
        };
      }
    }, {
      key: "matchable",
      value: function matchable() {
        return ["title", "rawbody"];
      }
    }]);

    function CanvasPage(response, loader) {
      _classCallCheck(this, CanvasPage);

      var _this5 = _possibleConstructorReturn(this, (CanvasPage.__proto__ || Object.getPrototypeOf(CanvasPage)).call(this, response, loader));

      _this5.assert_type("pages");
      _this5.updatename = 'wiki_page';
      return _this5;
    }

    return CanvasPage;
  }(CanvasObject);

  var CanvasDiscussion = function (_CanvasObject3) {
    _inherits(CanvasDiscussion, _CanvasObject3);

    _createClass(CanvasDiscussion, [{
      key: "transferrable",
      value: function transferrable() {
        return {
          "id": "id",
          "title": "title",
          "rawbody": "message"
        };
      }
    }, {
      key: "matchable",
      value: function matchable() {
        return ["title", "rawbody"];
      }
    }]);

    function CanvasDiscussion(response, loader) {
      _classCallCheck(this, CanvasDiscussion);

      var _this6 = _possibleConstructorReturn(this, (CanvasDiscussion.__proto__ || Object.getPrototypeOf(CanvasDiscussion)).call(this, response, loader));

      _this6.assert_type("discussion_topics");
      _this6.updatename = null;
      return _this6;
    }

    return CanvasDiscussion;
  }(CanvasObject);

  var CanvasAnnouncement = function (_CanvasObject4) {
    _inherits(CanvasAnnouncement, _CanvasObject4);

    _createClass(CanvasAnnouncement, [{
      key: "transferrable",
      value: function transferrable() {
        return {
          "id": "id",
          "title": "title",
          "rawbody": "message"
        };
      }
    }, {
      key: "matchable",
      value: function matchable() {
        return ["title", "rawbody"];
      }
    }]);

    function CanvasAnnouncement(response, loader) {
      _classCallCheck(this, CanvasAnnouncement);

      var _this7 = _possibleConstructorReturn(this, (CanvasAnnouncement.__proto__ || Object.getPrototypeOf(CanvasAnnouncement)).call(this, response, loader));

      _this7.assert_type("discussion_topics");
      _this7.updatename = null;
      return _this7;
    }

    return CanvasAnnouncement;
  }(CanvasObject);

  var CanvasAssignment = function (_CanvasObject5) {
    _inherits(CanvasAssignment, _CanvasObject5);

    _createClass(CanvasAssignment, [{
      key: "transferrable",
      value: function transferrable() {
        return {
          "id": "id",
          "title": "name",
          "rawbody": "description"
        };
      }
    }, {
      key: "matchable",
      value: function matchable() {
        return ["title", "rawbody"];
      }
    }]);

    function CanvasAssignment(response, loader) {
      _classCallCheck(this, CanvasAssignment);

      var _this8 = _possibleConstructorReturn(this, (CanvasAssignment.__proto__ || Object.getPrototypeOf(CanvasAssignment)).call(this, response, loader));

      _this8.assert_type("assignments");
      _this8.updatename = 'assignment';
      return _this8;
    }

    return CanvasAssignment;
  }(CanvasObject);

  var CanvasCourse = function () {
    function CanvasCourse(loaders, id, name) {
      _classCallCheck(this, CanvasCourse);

      name = name || id;
      this.subs = {};
      this.name = name; // name doesn't have to be defined
      this.course = id; // course id does have to be defined
      this.loaders = loaders;
    }

    _createClass(CanvasCourse, [{
      key: "getcontent",
      value: function getcontent() {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (r) {
          return r;
        };


        // returns to corresponding
        // canvas object judging from response
        function fromresponse(response, loader) {

          var prototypes = function prototypes(type, response, loader) {
            return new {
              'object': CanvasObject,
              'pages': CanvasPage,
              'quizzes': CanvasQuiz,
              'assignments': CanvasAssignment,
              'announcements': CanvasAnnouncement,
              'discussion_topics': CanvasDiscussion
            }[type](response, loader);
          };

          var type = loader.type; // object.page_type 
          return prototypes(type, response, loader);
        }

        function main(self, callback) {
          var course = self.course;
          var setval = function setval(loader) {
            return function (response) {
              var object = fromresponse(response, loader);
              self.subs[object.id] = object;
              callback(object);
            };
          };

          return Object.values(self.loaders)
          // .filter(load => load.type !== 'announcements')
          // .filter(load => load.type !== 'discussion_topics')
          // .filter(load => load.type !== 'pages')
          // .filter(load => load.type !== 'quizzes')
          // .filter(load => load.type !== 'assignments')
          .forEach(function (load) {
            return load.getcourse(course, {}, setval(load));
          });
        }

        return main(this, callback);
      }
    }, {
      key: "search",
      value: function search(query, options) {
        var ashtml = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var result = [];
        Object.values(this.subs).map(function (s) {
          return s.search(query, options, ashtml, result);
        });
        return result;
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
      this.courses = [];
      this.loader = load.courses(key);
    }

    _createClass(CourseList, [{
      key: "loadcourse",
      value: function loadcourse(callback) {
        var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var courselist = this.courses;
        var loaders = load.loaders(this.key);
        var call = function call(r, e) {
          var course = new CanvasCourse(loaders, r.id, r.name);
          courselist.push(course);
          callback(course);
        };

        return this.loader.listcourse(call, metadata);
      }
    }]);

    return CourseList;
  }();

  return function (key) {
    return new CourseList(key);
  };
  /*
  objectcall = cvobj => {
    // if (!cvobj.title.toLowerCase().includes('a'))
    let matches = cvobj.search('goethe', 'i')
    // if (!matches.length) return
    // console.log(matches)
    cvobj.replace(matches, "goethe now")
    console.log(cvobj.altered())
    // cvobj.push()
  }
   callback = course => {
    if (course.course !== 1074403)
      return 
    else
      course.search('a', 'i')
  }
  let cl = new CourseList(apikey)
  cl.loadcourse(callback)
  */
}();
"use strict";

var data = {
  key: null,
  initialized: false,
  courseselection: null,
  courses: {},
  course: null,
  right: null,
  left: null,
  hidd: null,
  loaders: null,
  hash: null,
  list: null,
  input: null,
  matches: {},
  matchlist: null
};

var counter = 0;

function loadcourse(courseid) {
  var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


  function show_in_table(table, item) {
    var reindex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var row = table.append("div").attr("class", "canvas-row").on("click", function () {
      return data.left.html(item.rawbody);
    });
    // row
    //  .append("div")
    //  .text(++counter)
    //  .style("position", "absolute")
    row.append("div").attr("class", "canvas-item canvas-id").append("a").attr("href", item.pagelink).attr("target", "_blank").text(item.id);

    row.append("div").attr("class", "canvas-item canvas-name").text(item.title);
    row.append("div").attr("class", "canvas-item canvas-type").text(item.loader.type);
    row.append("div").attr("class", "canvas-item canvas-html").text(item.rawbody);
    if (data.list.filtered) data.list.filtered();
    if (data.list.searched) data.list.search();
    if (reindex) data.list.reIndex();
  }

  function makelist() {
    var valueNames = ['canvas-id', 'canvas-type', 'canvas-name', 'canvas-html'];
    data.list = new List('body', { valueNames: valueNames });
  }

  function load(courseid) {
    displaycourses();
    var hash = data.hash = Math.random();
    var table = data.right.append("section").attr("class", "list table");
    makelist();
    var call = function call(r, e) {
      return data.hash !== hash || show_in_table(table, r, true);
    };

    data.course = data.courses[courseid];
    data.course.getcontent(call);
  }

  function nonreload() {
    displaycourses();
    var table = data.right.append("section").attr("class", "list table");
    makelist();
    Object.values(data.course.subs).forEach(function (c) {
      return show_in_table(table, c, false);
    });
    data.list.reIndex();
  }

  return reload ? load(courseid) : nonreload();
}

function showloadbar() {
  d3.select("div.modal").style("display", "block");
  d3.select("div.inner-bar").style("width", "0%");
}

function updateloadbar(prop) {
  d3.select("div.inner-bar").style("width", prop * 100 + "%");
}

function hideloadbar(prop) {
  d3.select("div.modal").style("display", "none");
  d3.select("div.inner-bar").style("width", "0%");
}

function replace() {

  function main() {
    var searchquery = document.getElementById('searchquery').value;
    var replacequery = document.getElementById("replacequery").value;

    var checked = function checked(row) {
      return row.children[0].children[0].checked;
    };

    var rows = Array.from(document.getElementsByClassName("match-row")).filter(checked).map(function (item) {
      return item.getAttribute("value");
    }).map(function (value) {
      return data.matches[value];
    });
    var message = "replace " + rows.length + " instance(s) of " + (" \"" + searchquery + "\" with \"" + replacequery + "\"?");
    if (!window.confirm(message)) return;
    var searchers = {};
    rows.forEach(function (r) {
      return searchers[r.object.id] ? searchers[r.object.id].push(r) : searchers[r.object.id] = [r];
    });
    Object.values(searchers).forEach(function (s) {
      return s[0].object.replace(s, replacequery);
    });

    var items = Object.values(searchers).map(function (s) {
      return s[0].object;
    });

    var counter = 0;
    showloadbar();
    items.forEach(function (s) {
      return s.push(function (r) {
        s.fromnewresponse(JSON.parse(r.body));
        updateloadbar(++counter / items.length);
        if (counter === items.length) {
          hideloadbar();
          data.hidd.transition().style("transform", "translateX(55%)");
          loadcourse(undefined, false);
        }
      });
    });
  }

  return main();
}

function search() {

  function totext(m) {
    return "(" + m.object.id + ")-(" + m.key + ")-(" + m.m.s + ", " + m.m.e + ")";
  }

  function inithidd(matches) {
    data.hidd.html("");
    var topheader = data.hidd.append("section").attr("class", "hidd-header");
    topheader.append("div").attr("class", "close-hidd").on("click", function () {
      return data.hidd.transition().style("transform", "translateX(55%)");
    });
    var inputtext = topheader.append("div").attr("class", "input-text-match");

    document.onkeydown = function (e) {
      e = e || window.event;
      var esc = "key" in e ? e.key == "Escape" || e.key == "Esc" : e.keyCode == 27;
      if (esc) event.preventDefault(), data.hidd.transition().style("transform", "translateX(55%)");
    };

    var names = [{ label: "asg", name: "assignments" }, { label: "dsc", name: "discussion_topics" }, { label: "qzz", name: "quizzes" }, { label: "pag", name: "pages" }, { label: "ann", name: "announcements" }];

    inputtext.selectAll("label").data(names).enter().append("label").attr("class", "match-type").html(function (d) {
      return d.label;
    }).append("input").attr("class", "check-type").attr("type", "checkbox").attr("value", function (d) {
      return d.name;
    }).attr("checked", "").on("change", function (d) {
      var checks = document.getElementsByClassName("check-type");
      var values = Array.from(checks).filter(function (x) {
        return x.checked;
      }).map(function (x) {
        return x.value;
      });
      var setvalues = new Set(values);
      data.matchlist.filter(function (item) {
        return setvalues.has(item._values["match-type"]);
      });
    });

    inputtext.append("form").attr("class", "replaceform").attr("onsubmit", "event.preventDefault(), replace()").append("input").attr("type", "text").attr("id", "replacequery").attr("placeholder", "replace").attr("class", "replaceinput");

    var matchbody = data.hidd.append("div").attr("class", "match-body");
    var header = matchbody.append("div").attr("class", "match-header");

    header.append("div").attr("class", "sort match-head head-match-text").attr("data-sort", "match-text").text("text");
    header.append("div").attr("class", "sort match-head head-match-id").attr("data-sort", "match-id").text("id");
    header.append("div").attr("class", "sort match-head head-match-name").attr("data-sort", "match-name").text("name");
    header.append("div").attr("class", "sort match-head head-match-type").attr("data-sort", "match-type").text("type");

    data.hidd.transition().style("transform", "translateX(0)");
    return matchbody;
  }

  function showmatches(matches, matchbody) {
    var table = matchbody.append("section").attr("class", "list match-table").selectAll("div").data(matches).enter();

    var row = table.append("div").attr("class", "match-row").attr("value", totext).on("click", function (d) {
      return data.left.html(d.object.rawbody);
    });

    row.append("div").attr("class", "match-item match-check").append("input").attr("type", "checkbox").attr("checked", "");

    row.append("div").attr("class", "match-item match-text").html(function (d) {
      return d.m.before + "<b>" + d.m.text + "</b>" + d.m.after;
    });
    row.append("div").attr("class", "match-item match-id").append("a").attr("href", function (d) {
      return d.object.pagelink;
    }).attr("target", "_blank").text(function (d) {
      return d.object.id;
    });
    row.append("div").attr("class", "match-item match-name").html(function (d) {
      return d.object.title;
    });
    row.append("div").attr("class", "match-item match-type").html(function (d) {
      return d.object.loader.type;
    });
  }

  function main() {
    var query = document.getElementById('searchquery');
    var ashtml = document.getElementById('ashtml');
    if (!query) return;
    var matches = data.course.search(query.value, "i", ashtml.checked);
    var matchbody = inithidd(matches);
    showmatches(matches, matchbody);
    data.matches = {};
    matches.forEach(function (m) {
      return data.matches[totext(m)] = m;
    });

    var valueNames = ['match-text', 'match-id', 'match-name', 'match-type'];
    data.matchlist = new List('hidd', { valueNames: valueNames });
  }

  return main();
}

function displaycourses() {

  function initheader(right) {
    var header = right.append("div").attr("class", "contain-header");
    header.append("div").attr("class", "sort row-header head-id").attr("data-sort", "canvas-id").text("id");
    header.append("div").attr("class", "sort row-header head-name").attr("data-sort", "canvas-name").text("title");
    header.append("div").attr("class", "sort row-header head-type").attr("data-sort", "canvas-type").text("type");
  }

  function makeleft(body) {
    var left = data.left ? data.left : data.left = body.append("section").attr("class", "left");
    return left;
  }

  function makehidd(body) {
    if (!data.hidd) {
      data.hidd = d3.select("body").append("section").attr("class", "hidd").attr("id", "hidd");
    }
    data.hidd.append("section").attr("class", "hidd-header").append("div").attr("class", "close-hidd").on("click", function () {
      return data.hidd.transition().style("transform", "translateX(55%)");
    });
  }

  function makeright(body) {
    var right = data.right ? data.right : data.right = body.append("section").attr("class", "right").attr("id", "right");
    initheader(right);
  }

  function modheader() {
    var input = d3.select("section.body").append("div").attr("class", "input-text");

    var select = input.append("select").attr("class", "course-selection");
    data.input = input;
    data.courseselection = select;

    input.append("input").attr('type', "checkbox").attr("class", "ashtml").attr("id", "ashtml");

    var form = input.append("form").attr("class", "searchform").attr("onsubmit", "event.preventDefault(), search()");
    form.append("input").attr("class", "search").attr("id", "searchquery").attr("placeholder", "search");

    $('.course-selection').select2().on("change", function (e) {
      return loadcourse(e.target.value);
    });
  }

  function makeloadbar() {
    var modal = d3.select("body").append("div").attr("class", "modal").append("div").attr("class", "outer-bar").append("div").attr("class", "inner-bar");
  }

  function main() {
    var body = d3.select("section.body");
    if (data.initialized) data.left.html(""), data.right.html("");else body.html(""), modheader(), makeloadbar();
    var left = makeleft(body);
    var right = makeright(body);
    var hidd = makehidd(body);
  }

  function loaderror() {
    return;
  }

  function check() {
    var courses = canvas(data.key);
    courses.loadcourse(function (r, e) {
      if (e) return loaderror(e);
      if (!data.initialized) main(), data.initialized = true;
      data.courses[r.course] = r;
      d3.select("select.course-selection").append("option").text(r.name).attr("value", r.course);
    });
  }

  return data.initialized ? main() : check();
}

function init() {

  function makeinput(body) {

    var div = body.append("div").attr("class", "keyinput");
    var form = div.append("form").attr("class", "keyinput");

    form.append("input").attr("id", "apikey").attr("type", "text").attr("class", "keyinput").attr("placeholder", "api key");

    form.on("submit", function () {
      event.preventDefault();
      var key = document.getElementById("apikey");
      data.key = key.value;
      displaycourses();
    });
  }

  function main() {
    var body = d3.select("section.body");
    makeinput(body);
  }

  return main();
}

init();
