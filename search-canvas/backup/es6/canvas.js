class CanvasMatch {

  constructor(object, key, query, cased) {
    const string = JSON.stringify(object[key])
    const regex = util.regex(query)
    const array = string.split(regex)

    this.object = object
    this.string = string
    this.query = query
    this.cased = cased
    this.regex = regex
    this.key = key

    this.array = array
    this.indices = util.indicesof(array, x => regex.test(x))
    this.count = this.array.length
  }

  // reupdate the match object
  update() {
    this.constructor(this.object, this.key, this.query, this.cased)
  }

  enumerate(slice=20) {
    const self = this
    const plus = x => Math.max(0, x)
    const array = self.array
    const qulen = self.query.length
    return self.indices.map(i => {
      const head = self.array.slice(0,i).join("")
      const tail = self.array.slice(i+1).join("")
      const lstr = head.slice(-slice)
      const rstr = tail.slice(0, slice)
      return {
        "left": lstr, 
        "curr": array[i], 
        "right": rstr,
        "match": self,
        "index": i,
      }
    })
  }
}


class CanvasObject {

  // does nothing since it is already a base object
  fromobject(object) {
    return this
  }

  constructor(response, loader) {
    const self = this

    // extract course id and page type from given url
    function parse(url) {
      const l = url.split("/")
      const start = l.indexOf("courses")
      // url formats are of the form /courses/course_id/page_type/page_id
      const [course_id, type] = l.slice(start+1, start+3)
      return [course_id, type]
    }

    function main(response, loader) {
      const link = response.html_url.includes(endpoint)
        ? response.html_url
        : response.html_url.replace(baselink, endpoint)
      const [course_id, page_type] = parse(link)
      self.pagelink = response.html_url
      self.course_id = course_id
      self.page_type = page_type
      self.response = response
      self.loader = loader
      self.link = link
      self.fromobject(self)
    }

    return main(response, loader)
  }

  assert_type(type) {
    if (this.page_type !== type)
      throw "wrong canvas object type"
  }

  assert_id(id) {
    const resp_id = (this.response.id || this.response.course_id)
    if (this.id != resp_id)
      throw `inconsistent object id: ${resp_id} vs ${this.id}`
    else if (id && this.id != id)
      throw `false assert id: ${id} vs ${this.id}`
  }

  // returns url for getting and posting 
  arrayurl() {
    return ["courses", this.course_id, this.page_type, this.id]  
  }

  push(callback) {
    throw "not implemented"
    const load = this.loader
    const url_array = this.arrayurl()
    const url = load.to_url(url_array)
    load.putlink(url, callback, this.sendobject())
  }

  search(query, cased=false, slice=20) {
    const self = this
    // const extend = array => coll.push.apply(coll, array)
    return self.matchables()
      .map(name => new CanvasMatch(self, name, query, cased))
      .reduce((coll, match) => {
        coll.push(...match.enumerate(slice))
        return coll
      }, [])
  }

}


class CanvasQuiz extends CanvasObject {

  updateresponse() {
    throw "not implemented"
    const response = this.response
    response.title = this.title
    response.description = this.rawbody
    if (this.id !== response.id)
      throw "object id does not match with response id"
  }

  fromobject(object) {
    const response = object.response
    Object.assign(this, object)
    this.id = response.id
    this.title = response.title
    this.rawbody = response.description
    this.text = util.textfromhtml(this.rawbody)
    this.assert_type("quizzes")
    return this
  }

  matchables() {
    return ["id","title", "rawbody"]
  }


}


class CanvasPage extends CanvasObject {

  fromobject(object) {
    const response = object.response
    Object.assign(this, object)
    this.id = response.page_id
    this.title = response.title
    this.rawbody = response.body
    this.text = util.textfromhtml(this.rawbody)
    this.assert_type("pages")
    return this
  }

  matchables() {
    return ["id","title", "rawbody"]
  }


}



class CanvasDiscussion extends CanvasObject {

  fromobject(object) {
    const response = object.response
    Object.assign(this, object)
    this.id = response.id
    this.title = response.title
    this.rawbody = response.message
    this.text = util.textfromhtml(this.rawbody)
    this.assert_type("discussion_topics")
    return this
  }

  matchables() {
    return ["id","title", "rawbody"]
  }

}


class CanvasAnnouncement extends CanvasObject {

  fromobject(object) {
    const response = object.response
    Object.assign(this, object)
    this.id = response.id
    this.title = response.title
    this.rawbody = response.message
    this.text = util.textfromhtml(this.rawbody)
    this.assert_type("discussion_topics")
    return this
  }

  matchables() {
    return ["id","title", "rawbody"]
  }

}

class CanvasAssignment extends CanvasObject {

  fromobject(object) {
    const response = object.response
    Object.assign(this, object)
    this.id = response.id
    this.title = response.name
    this.rawbody = response.description
    this.text = util.textfromhtml(this.rawbody)
    this.assert_type("assignments")
    return this
  }

  matchables() {
    return ["id","title", "rawbody"]
  }

}

const prototypes = {
  'object': CanvasObject.prototype,
  'pages': CanvasPage.prototype,
  'quizzes': CanvasQuiz.prototype,
  'assignments': CanvasAssignment.prototype,
  'announcements': CanvasAnnouncement.prototype,
  'discussion_topics': CanvasDiscussion.prototype
}

// returns to corresponding
// canvas object judging from response
function fromresponse(response, loader) {
const object = new CanvasObject(response, loader)
const type = loader.type // object.page_type 

return Object
  .create(prototypes[type])
  .fromobject(object)
}

class CanvasCourse {

  constructor(key, id, name) {
    name = name || id
    this.key = key
    this.subs = {}
    this.name = name // name doesn't have to be defined
    this.course = id // course id does have to be defined
    this.loaders = makeloaders(key)
  }

  getcontent(callback=r=>r) {
    const self = this
    const course = self.course
    const setval = loader => response => {
      const object = fromresponse(response, loader)
      self.subs[object.id] = object
      callback(object)
    }

    Object
      .values(this.loaders)
      .forEach(load => load.getcourse(course, setval(load)))
  }

  search(query, cased=false, slice=20) {
    const regex = util.regex(query, cased)
    // const extend = array => array.forEach(match => console.log(match)coll.push)
    return Object
      .values(this.subs)
      .reduce((coll, object) => {
        coll.push(...object.search(regex, cased, slice))
        return coll
      }, [])
  }

  // number of requests that are being waited on
  limbo() {
    return Object
      .values(this.loaders)
      .reduce((coll, val) => coll + val.wait.length, 0)
  }

}

class CourseList {
  constructor(key) {
    this.key = key
    this.course = []
    this.loader = new CourseLoader(key)
  }

  loadcourse(callback, headers={}) {
    const courselist = this.course
    const call = r => {
      let course = new CanvasCourse(key, r.id, r.name)
      courselist.push(course)
      callback(course)
    }

    return this.loader.loadcourse(callback, headers)
  }
}

