






const data = {
  key:null,
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
}

let counter = 0



function loadcourse(courseid, reload=true) {

  function show_in_table(table, item, reindex=true) {
    const row = table
      .append("div")
      .attr("class", "canvas-row")
      .on("click", () => data.left.html(item.rawbody))
    // row
    //  .append("div")
    //  .text(++counter)
    //  .style("position", "absolute")
    row
      .append("div")
      .attr("class", "canvas-item canvas-id")
      .append("a")
      .attr("href", item.pagelink)
      .attr("target", "_blank")
      .text(item.id)

    row
      .append("div")
      .attr("class", "canvas-item canvas-name")
      .text(item.title)
    row
      .append("div")
      .attr("class", "canvas-item canvas-type")
      .text(item.loader.type)
    row
      .append("div")
      .attr("class", "canvas-item canvas-html")
      .text(item.rawbody)
    if (data.list.filtered)
      data.list.filtered()
    if (data.list.searched)
      data.list.search()
    if (reindex) data.list.reIndex()
  }

  function makelist() {
    const valueNames = [ 'canvas-id', 'canvas-type', 'canvas-name', 'canvas-html' ]
    data.list = new List('body', {valueNames})
  }

  function load(courseid) {
    displaycourses()
    const hash = data.hash = Math.random()
    const table = data.right
      .append("section")
      .attr("class", "list table")
    makelist()
    const call = (r, e) => data.hash !== hash
            || show_in_table(table, r, true)
 
     data.course = data.courses[courseid]
    data.course.getcontent(call)
  }

  function nonreload() {
    displaycourses()
    const table = data.right
      .append("section")
      .attr("class", "list table")
    makelist()
    Object
      .values(data.course.subs)
      .forEach(c => show_in_table(table, c, false))
    data.list.reIndex()
  }


  return reload ? load(courseid) : nonreload()

}

function showloadbar() {
  d3.select("div.modal")
    .style("display", "block")
  d3.select("div.inner-bar")
    .style("width", "0%")
}

function updateloadbar(prop) {
  d3.select("div.inner-bar")
    .style("width", prop * 100 + "%")
}

function hideloadbar(prop) {
  d3.select("div.modal")
    .style("display", "none")
  d3.select("div.inner-bar")
    .style("width", "0%")
}


function replace() {

  function main() {
    const searchquery = document
      .getElementById('searchquery')
      .value
    const replacequery = document
      .getElementById("replacequery")
      .value


    const checked = row =>
          row.children[0].children[0].checked

    const rows = Array
      .from(document.getElementsByClassName("match-row"))
      .filter(checked)
      .map(item => item.getAttribute("value"))
      .map(value => data.matches[value])
    const message = `replace ${rows.length} instance(s) of `
                  + ` "${searchquery}" with "${replacequery}"?`
    if (!window.confirm(message)) return
        const searchers = {}
    rows.forEach(r =>
          searchers[r.object.id]
        ? searchers[r.object.id].push(r)
        : searchers[r.object.id] = [r])
    Object
      .values(searchers)
      .forEach(s =>
              s[0].object.replace(s, replacequery))

    const items = Object.values(searchers)
      .map(s => s[0].object)

    let counter = 0
    showloadbar()
    items.forEach(s => s.push(r => {
      s.fromnewresponse(JSON.parse(r.body))
      updateloadbar(++counter / items.length)
      if (counter === items.length) {
        hideloadbar()
        data.hidd
          .transition()
          .style("transform", "translateX(55%)")
        loadcourse(undefined, false)
              }
    }))
  }

  return main()
}




function search() {

  function totext(m) {
    return `(${m.object.id})-(${m.key})-(${m.m.s}, ${m.m.e})`
  }

  function inithidd(matches) {
    data.hidd.html("")
    const topheader = data.hidd
      .append("section")
        .attr("class", "hidd-header")
    topheader
      .append("div")
        .attr("class", "close-hidd")
        .on("click", () => data.hidd
          .transition()
          .style("transform", "translateX(55%)"))
    const inputtext = topheader
      .append("div")
        .attr("class", "input-text-match")

    document.onkeydown = e => {
        e = e || window.event;
        const esc = "key" in e
          ? e.key == "Escape" || e.key == "Esc"
          : e.keyCode == 27
        if (esc)
          event.preventDefault(),
          data.hidd
            .transition()
            .style("transform", "translateX(55%)")
      }

    const names = [
      {label:"asg", name:"assignments"},
      {label:"dsc", name:"discussion_topics"},
      {label:"qzz", name:"quizzes"},
      {label:"pag", name:"pages"},
      {label:"ann", name:"announcements"}
    ]

    inputtext
      .selectAll("label")
      .data(names)
      .enter()
      .append("label")
        .attr("class", "match-type")
        .html(d => d.label)
      .append("input")
        .attr("class", "check-type")
        .attr("type", "checkbox")
        .attr("value", d => d.name)
        .attr("checked", "")
        .on("change", d => {
          const checks = document
            .getElementsByClassName("check-type")
          const values = Array
            .from(checks)
            .filter(x => x.checked)
            .map(x => x.value)
          const setvalues = new Set(values)
          data.matchlist.filter(item =>
            setvalues.has(item._values["match-type"]))
        })
        

    inputtext
      .append("form")
        .attr("class", "replaceform")
        .attr("onsubmit", "event.preventDefault(), replace()")
      .append("input")
        .attr("type", "text")
        .attr("id", "replacequery")
        .attr("placeholder", "replace")
        .attr("class", "replaceinput")

    const matchbody = data.hidd
      .append("div")
        .attr("class", "match-body")
    const header = matchbody
      .append("div")
      .attr("class", "match-header")

    header.append("div")
      .attr("class", "sort match-head head-match-text")
      .attr("data-sort", "match-text")
      .text("text")
    header.append("div")
      .attr("class", "sort match-head head-match-id")
      .attr("data-sort", "match-id")
      .text("id")
    header.append("div")
      .attr("class", "sort match-head head-match-name")
      .attr("data-sort", "match-name")
      .text("name")
    header.append("div")
      .attr("class", "sort match-head head-match-type")
      .attr("data-sort", "match-type")
      .text("type")

    data.hidd
      .transition()
      .style("transform", "translateX(0)")
    return matchbody
  }

  function showmatches(matches, matchbody) {
    const table = matchbody
      .append("section")
      .attr("class", "list match-table")
      .selectAll("div")
      .data(matches)
      .enter()

    const row = table
      .append("div")
      .attr("class", "match-row")
      .attr("value", totext)
      .on("click", d => data.left.html(d.object.rawbody))

    row
      .append("div")
        .attr("class", "match-item match-check")
      .append("input")
        .attr("type", "checkbox")
        .attr("checked", "")

    row
      .append("div")
        .attr("class", "match-item match-text")
        .html(d => `${d.m.before}<b>${d.m.text}</b>${d.m.after}`)
    row
      .append("div")
        .attr("class", "match-item match-id")
        .append("a")
          .attr("href", d => d.object.pagelink)
          .attr("target", "_blank")
          .text(d => d.object.id)
    row
      .append("div")
        .attr("class", "match-item match-name")
        .html(d => d.object.title)
    row
      .append("div")
        .attr("class", "match-item match-type")
        .html(d => d.object.loader.type)
  }

  function main() {
    const query = document.getElementById('searchquery')
    const ashtml = document.getElementById('ashtml')
    if (!query) return
    const matches = data.course.search(query.value, "i", ashtml.checked)
    const matchbody = inithidd(matches)
    showmatches(matches, matchbody)
    data.matches = {}
    matches
      .forEach(m => data.matches[totext(m)] = m)

    const valueNames = [ 'match-text', 'match-id', 'match-name', 'match-type' ]
    data.matchlist = new List('hidd', {valueNames})

  }

  return main()
}




function displaycourses() {

  function initheader(right) {
    const header = right
      .append("div")
      .attr("class", "contain-header")
    header
      .append("div")
      .attr("class", "sort row-header head-id")
      .attr("data-sort", "canvas-id")
      .text("id")
    header
      .append("div")
      .attr("class", "sort row-header head-name")
      .attr("data-sort", "canvas-name")
      .text("title")
    header
      .append("div")
      .attr("class", "sort row-header head-type")
      .attr("data-sort", "canvas-type")
      .text("type")
  }

  function makeleft(body) {
    const left = data.left
          ? data.left
      : data.left = body
        .append("section")
        .attr("class", "left")
    return left
  }

  function makehidd(body) {
    if (!data.hidd) {
      data.hidd = d3
        .select("body")
        .append("section")
        .attr("class", "hidd")
        .attr("id", "hidd")
    }
    data.hidd
      .append("section")
        .attr("class", "hidd-header")
      .append("div")
        .attr("class", "close-hidd")
      .on("click", () => data.hidd
        .transition()
        .style("transform", "translateX(55%)"))
}

  function makeright(body) {
    const right = data.right
      ? data.right
            : data.right = body
        .append("section")
        .attr("class", "right")
        .attr("id", "right")
    initheader(right)
  }

  function modheader() {
    const input = d3.select("section.body")
      .append("div")
      .attr("class", "input-text")

    const select = input
      .append("select")
            .attr("class", "course-selection")
    data.input = input
    data.courseselection = select

    input
      .append("input")
      .attr('type', "checkbox")
      .attr("class", "ashtml")
      .attr("id", "ashtml")


    const form = input
      .append("form")
      .attr("class", "searchform")
      .attr("onsubmit", "event.preventDefault(), search()")
    form
      .append("input")
            .attr("class", "search")
      .attr("id", "searchquery")
      .attr("placeholder", "search")

    $('.course-selection')
      .select2()
      .on("change", (e) => loadcourse(e.target.value))

  }

  function makeloadbar() {
    const modal = d3.select("body")
      .append("div")
      .attr("class", "modal")
      .append("div")
      .attr("class", "outer-bar")
      .append("div")
      .attr("class", "inner-bar")
  }


  function main() {
    const body = d3
      .select("section.body")
    if (data.initialized)
      data.left.html(""),
      data.right.html("")
    else
          body.html(""),
      modheader(),
      makeloadbar()
    const left = makeleft(body)
    const right = makeright(body)
    const hidd = makehidd(body)
   
     }

  function loaderror() { return }

  function check() {
    const courses = canvas(data.key)
    courses.loadcourse((r, e) => {
      if (e) return loaderror(e)
      if (!data.initialized)
              main(),
        data.initialized = true
      data.courses[r.course] = r
      d3.select("select.course-selection")
        .append("option")
        .text(r.name)
        .attr("value", r.course)
    })

  }

  return data.initialized ? main() : check()
}

function init() {

  function makeinput(body) {

    const div = body
      .append("div")
      .attr("class", "keyinput")
    const form = div
      .append("form")
      .attr("class", "keyinput")

    form
      .append("input")
      .attr("id", "apikey")
      .attr("type", "text")
      .attr("class", "keyinput")
      .attr("placeholder", "api key")

    form.on("submit", () => {
      event.preventDefault()
      const key = document.getElementById("apikey")
      data.key = key.value
      displaycourses()
    })

  }

  function main() {
    const body = d3.select("section.body")
    makeinput(body)
  }

  return main()
}

init()

