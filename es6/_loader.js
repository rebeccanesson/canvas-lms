
const endpoint = "https://canvas.brown.edu/api/v1/",
      baselink = "https://canvas.brown.edu/",
      // local = "http://localhost:5000/"
      local = "https://canvas.brown.edu/api/v1/"

class Loader {

  constructor(key) {
    this.wait = new MultiSet()
    this.type = "generic"
    this.token = key
    this.headers = {
      "per_page": 1000
    }
  }

  to_url(arglist) {
    const section = arglist.join("/")
    // const querystr = util.serialize(this.headers)
    return `${local}${section}`
  }

  to_link(arglist) {
    const section = arglist.join("/")
    const querystr = util.serialize(this.headers)
    return `${local}${section}?${querystr}`
  }

  // load a given link, replacing the base with the local
  // and adding predefined headers
  loadxhr(method, link, callback, headers={}) {
    // these two lines keep track of the number of objects 
    // that are still being waited on 
    const head = Object.assign({}, this.headers, headers)
    const redi = link.includes(endpoint)
      ? link.replace(endpoint, local)
      : link.replace(baselink, local)
    const curl = util.addheader(redi, head)
    const call = (e, r) => {
      this.wait.remove(redi)
      callback(r, e)
      if (e) console.log("Error", e);
    }
    this.wait.add(redi)
     return d3
      .request(curl)
      .header('Authorization', 'Bearer ' + this.token)
      .get(method, call)

  }

  loadlink(method, link, callback, headers={}) {
    const call = (r, e) => e 
      ? callback(r, e)
      : callback(JSON.parse(r.response), e)
    return this.loadxhr(method, link, call, headers)
  }

  loadall(method, link, callback, headers={}) {
    const self = this
    const recursive_call = (result, error) => {
      const resp = JSON.parse(result.response)
      if (error || resp.errors) 
        return callback(resp, error)
      resp.forEach((r, index) => callback(r))
      const next = util.getnext(result)
      if (next)
        self.loadxhr(method, next, recursive_call, headers)
    }

    return self.loadxhr(method, link, recursive_call, headers)
  }

  putlink(link, callback, headers={}) {
    return this.loadlink('PUT', link, callback, headers) 
  }

  getlink(link, callback, headers={}) {
    return this.loadlink('GET', link, callback, headers) 
  }

  getall(link, callback, headers={}) {
    return this.loadall('GET', link, callback, headers)
  }


  getcourse(course, callback, headers={}) {
    if (this.type === "generic")
      throw "unspecified class for loader"
    const url = this.to_url(["courses", course, this.type])
    return this.getall(url, callback, headers)
  }

}



class QuizLoader extends Loader {

	constructor(key) {
		super(key)
    this.type = "quizzes"
	}

}


class AssignmentLoader extends Loader {

  constructor(key) {
    super(key)
    this.type = "assignments"
  }

}


class DiscussionLoader extends Loader {

  constructor(key) {
    super(key)
    this.type = "discussion_topics"
  }

}


class AnnouncementLoader extends Loader {



  getcourse(course, callback, headers={}) {
    const course_str = `course_${course}`
    headers.context_codes instanceof Array
      ? headers.context_codes.push(course_str)
      : headers.context_codes = [course_str]

    const url = this.to_url(["announcements"])
    return this.getall(url, callback, headers)
  }

  constructor(key) {
    super(key)
    this.type = "announcements"
  }

}

class PageLoader extends Loader {

  constructor(key) {
    super(key)
    this.type = "pages"
  }

  getcourse(course, callback) {
    const self = this
    return super.getcourse(course, (response, error) => {
      if (error) 
        console.log("error", error),
        callback(response, error)
      self.getlink(response.html_url, callback)
    })
  }

}



class CourseLoader extends Loader {

  constructor(key) {
    super(key)
    this.type = "courses"
  }

  // ironic
  getcourse(course, callback, headers={}) {
    throw "not supported"
  }


  listcourse(callback, headers) {
    const link = this.to_url(["courses"])
    return this.getlink(link, callback, headers)
  }
}


// course loader not included cuz 
// well, its find of different
const makeloaders = (key) => ({
  'pages': new PageLoader(key),
  'quizzes': new QuizLoader(key),
  'assignments': new AssignmentLoader(key),
  'announcements': new AnnouncementLoader(key),
  'discussion_topics': new DiscussionLoader(key)
})
