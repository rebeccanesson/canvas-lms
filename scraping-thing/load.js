
const fs = require("fs")
const util = require("./util.js")
const request = require("request")
const mustache = require("mustache")

// for loading
const match_name  = "Pre-Work"
const endpoint = "https://canvas.brown.edu/api/v1"
const baseurl = "https://canvas.brown.edu"

// for generation
const template = fs.readFileSync("./template.html", "utf-8")
const summary_page_url = "summary-pre-works"
const summary_name = "Summary: Pre-Works"

class Thing {

  constructor(key) {
    this.key = key
    this.wait = new util.MultiSet()
    this.head = { "Authorization": `Bearer ${key}` }
    this.course = {}
  }

  rawrequest(method, url, callback, heads={}, extras={}) {
    const wait = this.wait
    const headers = {...heads, ...this.head}
    const idstring = `(${method}) - ${url}`
    wait.add(idstring)
    const call = (e, r) => e
      ? console.log(e)
      : (callback(r), this.wait.remove(idstring))
    return request({method, url, headers, ...extras}, call)
  }

  get(url, callback, heads={}, extras={}) {
    return this.rawrequest("GET", url, callback, heads, extras)
  }

  put(url, callback, heads={}, extras={}) {
    return this.rawrequest("PUT", url, callback, heads, extras)
  }

  // make a get request to receive a JSON
  // array and apply callback to each element
  // of the array while checking to see if a
  // next header exists.
  getlist(url, callback, headers={}) {
    const call = r => {
      JSON
        .parse(r.body)
        .map(mod => callback(mod))
      if (url = util.getnext(r.headers))
        this.get(url, call, headers)
    }

    return this.get(url, call, headers)
  }

  load_course(id) {
    const url = `${endpoint}/courses/${id}`
    const call = mod => {
      const course = this.course[id]
      course.mod[mod.id] = mod
      mod.items = {}
      const back = item =>
        mod.items[item.id] = item
      this.getlist(mod.items_url, back)
    }

    const init = course => {
      course = JSON.parse(course.body)
      course.mod = {}
      this.course[id] = course
      this.getlist(`${url}/modules`, call)
    }
    this.get(url, init)
  }


  prepare_summary(courses) {
    const top = id => this.course[id]
      .map(({name, mod}) => ({name, mod}))
    const match = i =>
      i.title.slice(0, match_name.length) === match_name

    const filter_items = m => Object
      .values(m.items)
      .filter(match)
      .filter(i => i.published)
      .sort((m, n) => m.position - n.position)
      .map(({title, html_url}) => ({name : title, url : html_url}))

    const filter_mods = id => Object
      .values(this.course[id].mod)
      .filter(i => i.published)
      .sort((m, n) => m.position - n.position)
      .map(m => ({
        name : m.name,
        url  : `${baseurl}/courses/${id}/modules/${m.id}`,
        item : filter_items(m)
      }))
      .filter(m => m.item.length)

    const course = courses
      .map(id => this.course[id])
      .map(({id, name}) => ({
        name,
        mod : filter_mods(id),
        url : `${baseurl}/courses/${id}`
      }))

    return mustache.render(template, { course })
  }

  summarize(courses, dump) {
    const formData = {
      "wiki_page[published]": "true",
      "wiki_page[title]": summary_name,
      "wiki_page[body]": this.prepare_summary(courses)
    }
    const call = r => {
      console.log(JSON.parse(r.body))
    }
    const url = `${endpoint}/courses/${dump}/pages/${summary_page_url}`
    this.put(url, call, {}, {formData})
  }

  watch(callback) {
    util.watch(() =>
      this.wait.length > 0 || 0 * callback(this))
  }

  run(courses, dump) {
    courses.map(c => this.load_course(c))
    this.watch(() => thing.summarize(courses, dump))
  }

}

const key = "<access_token>"
const courses = ["<course_id>", "<course_id>"]
const dump = "<course_id>"
const thing = new Thing(key)
thing.run(courses, dump)

