
const get_class = name => document.getElementsByClassName(name)
const get_id = id => document.getElementById(id)
const wrapper_options = {
  valueNames: ['object-id', 'object-title', 'object-page-type', 'object-text']
}

const results_options = {
  valueNames: ['result-match', 'result-id', 'result-title', 'result-type']
}
let course = null
let access_key = null
const canvaslist = new List('holder', wrapper_options)
const resultlist = new List('results-holder', results_options)

CanvasObject.prototype.bindto = function(tr)  {
  if (this.course_id !== course.course) return 
  const type = this.loader.type.split("_").join(" ")
  const header = '<h1>' + this.title + '</h1><br><br>'
  const htmltext = header + this.rawbody
  tr.attr("class", 'object-row')
    .attr("id", this.id)
    .on('click', () => d3.select('div.html-content').html(htmltext))
  tr.append("td")
      .attr("class", "object-id")
    .append('a')
      .attr('href', this.pagelink)
      .text(this.id)
  tr.append("td")
      .attr("class", "object-title")
      .text(this.title)
  tr.append("td")
      .attr("class", "object-page-type")
      .text(type)
  tr.append("td")
      .attr("class", "object-text")
      .text(this.text)
}


CanvasCourse.prototype.reindex = function(object, forced=false) {
  const self = this
  const tbody = d3
    .select('table.wrapper')
    .select('tbody.list')
  if (!forced && !canvaslist.filtered && !canvaslist.searched) {
    if (object) 
      object.bindto(tbody.append('tr'))
    return canvaslist.reIndex()
  }
  tbody.html("")
  Object
    .values(this.subs)
    .map(object => object.bindto(tbody.append('tr')))
  canvaslist.reIndex()
}

function loadcourses() {

  function hide_api() {
    d3.select("p.access-key")
      .style("display", "none")
    d3.select("p.top-access-key")
      .style("display", "none")
    d3.select("input.access-key")
      .transition()
      .duration(750)
      .style('width', '0')
  }

  function show_api() {
    d3.select("p.access-key")
      .style("display", "initial")
     d3.select("p.top-access-key")
      .style("display", "initial")
    d3.select("input.access-key")
      .style("display", "initial")
      .transition()
      .duration(400)
      .style('width', '60%')
  }

  function hide_section() {
    d3.select("section.access-key")
      .transition()
      .duration(1000)
      .style("height", "0")
    d3.select("section.access-key")
      .transition()
      .delay(1000)
      .style("display", "none")
  }

  function main() {
    const key = get_id('input-key').value
    const loader = new CourseLoader(key)
    hide_api()

    const onerror = () => {
      show_api()
      get_id('api-key-error')
        .innerHTML = "api key error"
    }

    loader.listcourse((courses, error) => {
      if (error) return onerror()
      access_key = key
      hide_section()
      d3.select('select.coursebar')
        .html("<option value=''>course</option>")
        .selectAll('option') // doesn't matter here
        .data(courses)
        .enter()
        .append('option')
          .attr('value', d=>d.id)
          .text(d => d.name)
    })

  }
  
  return main()
}


function loadcontent() {
  const course_id = get_id('course-id').value
  if (!course_id) return
  let newcourse = course = new CanvasCourse(access_key, course_id)
  course.reindex(null, true)
  newcourse.getcontent(object => {
    course.reindex(object)
  })
}

function hideresults() {

  const results = d3
    .select("section.results")
    .style("width", "0%")

  results
    .transition()
    .delay(500)
    .style("border-left", "none")

  d3.select("section.results-head")
    .style("width", "0%")

  d3.select("div.close")
    .style("display", "none")
}


function searchcourse() {


  function showresults() {
    d3.select("div.close")
    .style("display", "initial")
    d3.select("section.results-head")
      .style("width", "50%")
    d3.select("section.results")
      .style("width", "50%")
      .style("border-left", "solid medium black")
  }

  function main() {
    const query = get_id('input-search').value
    if (course === null)
      return window.alert('Pick a course first.')
    else if (!query)
      return hideresults()
    else if (query.length < 3)
      return window.alert('Query too short.')

    course.reindex(null, true)
    const data = course.search(query, false, 19)
    const tbody = d3
      .select('table.results')
      .select('tbody.list')
        .html("")
    const tr = tbody
        .selectAll('tbody') // doesn't matter here just don't use tr
          .data(data)
          .enter()
        .append('tr')

    tr.on('click', m => {
      const object = m.match.object
      const header = '<h1>' + object.title + '</h1><br><br>'
      const htmltext = header + object.rawbody
      d3.select('div.html-content').html(htmltext)
    })

    const matchtd = tr
      .append('td')
      .attr('class', 'result-match')
    matchtd
      .append('p')
      .text(m => m.left)
    matchtd
      .append('p')
      .text(m => m.curr)
      .style('font-weight', 'bold')
    matchtd
      .append('p')
      .text(m => m.right)

    tr.append('td')
        .attr('class', 'result-id') 
      .append('a')
        .text(m => m.match.object.id)
        .attr('href', m => m.match.object.pagelink)

    tr.append('td')
      .attr('class', 'result-title')
      .text(m => m.match.object.title)

    tr.append('td')
      .attr('class', 'result-type')
      .text(m => m.match.object.loader.type)

    showresults()
    resultlist.reIndex()
  }

  return main()
}


function update() {
  const classes = get_class('topic-select')
  const types = Array.from(classes)
    .filter(item => item.checked)
    .map(item => item.value)

  resultlist.filter(item => types.includes(item._values['result-type']))
}