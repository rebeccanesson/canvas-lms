
const fs = require("fs")
const util = require("./util.js")
const request = require("request")
const mustache = require("mustache")

const summary_page_url = "summary-pre-works"
const module_name = "Summary: Pre-Works"
const match_name  = "Pre-Work"
const endpoint = "https://canvas.brown.edu/api/v1"
const baseurl = "https://canvas.brown.edu"
const template = fs.readFileSync("./template.html", "utf-8")



class Thing {

  constructor(key, course_id) {
    this.token = key
    this.param = {} // { "per_page": 1000 }
    this.wait = new util.MultiSet()
    this.course_id = course_id
    this.endpoint = `${endpoint}/courses/${course_id}`
    this.baseurl =  `${baseurl}/courses/${course_id}`
    this.head = { "Authorization": `Bearer ${key}` }
    this.modules = {}
  }

  loadmodules(lastcall=x=>console.log(x), headers={}) {
    const callback = mod => {
      mod.items = {}
      this.modules[mod.id] = mod
      const call = item => mod.items[item.id] = item
      this.loadjsonarrays(mod.items_url, call, headers)
    }
    const url = `${this.endpoint}/modules`
    this.loadjsonarrays(url, callback, headers)
    util.watch(() => 
      this.wait.length > 0 || 0 * lastcall(this))
  }

  loadjsonarrays(url, callback, headers={}) {
    const call = r => {
      JSON
        .parse(r.body)
        .map(mod => callback(mod))
      if (url = util.getnext(r.headers)) 
        this.get(url, call, headers)
    }
    
    return this.get(url, call, headers)
  }

  rawrequest(method, url, callback, heads={}, extras={}) {
    const wait = this.wait
    const headers = {...heads, ...this.head}
    wait.add(url)
    const call = (e, r) => e 
      ? console.log(e)
      : (callback(r), this.wait.remove(url))
    return request({method, url, headers, ...extras}, call)
  }

  get(url, callback, heads={}, extras={}) {
    return this.rawrequest("GET", url, callback, heads, extras)
  }

  put(url, callback, heads={}, extras={}) {
    return this.rawrequest("PUT", url, callback, heads, extras)
  }

  prepare_summary() {
    const match = i => 
      i.title.slice(0, match_name.length) === match_name
    const filter_prework = m => Object
      .values(m.items)
      .filter(match)
      .filter(i => i.published)
      .sort((a, b) => a.position - b.position)

    const parse_url = m => `${this.baseurl}/modules/${m.id}`
    const get_prework = m => 
      ({ ...m, preworks: filter_prework(m), html_url:parse_url(m) })
    const prework_list = Object
      .values(this.modules)
      .map(get_prework)
      .filter(m => m.published)
      .filter(m => m.preworks.length)
    return mustache.render(template, { prework_list })
  }

  push_summary(callback=x=>console.log(x)) {
    const url = `${this.endpoint}/pages/${summary_page_url}`
    const formData = {
      "wiki_page[title]": module_name,
      "wiki_page[published]": "true",
      "wiki_page[body]": this.prepare_summary()
    }
    const call = r => callback(JSON.parse(r.body))
    return this.put(url, call, {}, {formData})

  }

}



const thing = new Thing("<apikey>", "<course_id>")
thing.loadmodules(t => t.push_summary())
