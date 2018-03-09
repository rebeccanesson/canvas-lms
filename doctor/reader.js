const fs = require("fs")
const xml = require('xml-js')
const util = require("util")


const path ='patientlist.xml'

function loadxml(path) {
  const raw = fs.readFileSync(path, 'utf-8');
  return xml.xml2js(raw)
    .elements
}

function delve(item, depth) {
  for (let i = 0; i < depth; ++i)
    item = item.elements[0]
  return item
}

function convert(arr, f=item=>item, id='name') {
  const obj = {}
  for (let item of arr)
    obj[item[id]] = f(item)
  return obj
}

class Display {

  constructor(data) {
    if (!data)
      this.visible = true
    else
      this.visible = data.attributes.visible === 'true'

    if (!data || !data.elements)
      this.items = []
    else
      this.items = data.elements.map(item => ({
          title : item.attributes.title,
          body : delve(item, 4).cdata
      }))
  }

  transfer() {
    return {
      visible : this.visible,
      items : this.items
    }
  }
}

class ListItem {

  constructor(data, keys) {
    // this.keys = keys
    const item = convert(data.elements)
    this.name = item.xhtml.elements[0].text // not pretty
    for (const key of this.keys())
      if (item[key] && item[key].elements)
        this[key] = item[key].elements[0].text

  }

  static readlist(list, cons) {
    if (!list || !list.elements)
      return []
    else
      return list.elements.map(i => new this(i))
  }

  transfer() {
    const obj = []
    for (const key of this.keys())
      obj[key] = this[key]
  }

}


class Physical {

  constructor(_data) {
    if (!_data.elements || !_data.elements.length)
      return
    const [sign, data] = _data.elements
    if (data.name !== "data")
      [data, sign] = [sign, data]
    this.visible = _data.attributes.visible === 'true'
    this.data = {
      title : data.attributes.title,
      body : delve(data, 4).cdata
    }
    this.sign = sign.elements
      .map(i => convert(i.elements, x=>x.elements))
      .map(i => ({
        name : i.name[0].text,
        units : i.units[0].cdata,
        ident : i.ident[0].text,
        value : i.value ? i.value[0].text : undefined,
      }))
      .filter(i => i.value)
  }

  transfer() {
    return {
      sign : this.sign,
      data : this.data,
      visible : this.visible
    }
  }
}



class Investigate {

  constructor(data) {

    function readresult(data) {
      const newobj = convert(data)
      if (!newobj.units || !newobj.units.elements)
        newobj.units = { elements : [{ text : '' }]}
      if (!newobj.name.elements
       || !newobj.value.elements
       || !newobj.range.attributes) return

      return {
        range : newobj.range.attributes,
        name  : newobj.name.elements[0].text,
        value : newobj.value.elements[0].text,
        units : newobj.units.elements
          .map(i => ({
            type : i.name === "sup" ? 'sup' : 'flat',
            text : i.name === "sup" ? i.elements[0].text : i.text }))
      }
    }

    function readtable(item) {
      return {
        name : item.name,
        title : item.attributes.title,
        data : item.name === "data"
          ? delve(item, 4)
          : item.elements
              .map(i => readresult(i.elements))
              .filter(i => i)
      }
    }

    function main(self, data) {
      self.data = []
      self.results = []
      self.visible = data.attributes.visible === 'true'
      if (!data.elements)
        return

      for (const i of data.elements)
        if (i.name === "data")
          self.data.push(readtable(i))
        else
          self.results.push(readtable(i))
    }

    return main(this, data)
  }

  transfer() {
    return {
      data : this.data,
      results : this.results,
      visible : this.visible
    }
  }
}

class Inbox extends Display {}
class History extends Display {}
class Procedure extends Display {}
class Management extends Display {}
class Drug extends ListItem {
  keys() { return ['state', 'dose'] }
}

class Problem extends ListItem {
  keys() { return ['state'] }
}

class guide {
  constructor() {

  }

  transfer() {
    return {}
  }
}

class Event {

  constructor(event, guide) {
    this.title = event.attributes.title
    this.elapsed = event.attributes.elapsedtime
    const rawdata = convert(event.elements)
    this.data = {
      inbox       : new Inbox(rawdata.inbox),
      history     : new History(rawdata.history),
      procedure   : new Procedure(rawdata.procedure),
      management  : new Management(rawdata.management),
      physical    : new Physical(rawdata.physical),
      investigate : new Investigate(rawdata.investigate),
      druglist    : Drug.readlist(rawdata.druglist),
      problemlist : Problem.readlist(rawdata.problemlist),
    }
  }

  transfer() {
    return {
      title   : this.title,
      elapsed : this.elapsed,
      data    : {
        inbox       : this.data.inbox.transfer(),
        history     : this.data.history.transfer(),
        procedure   : this.data.procedure.transfer(),
        management  : this.data.management.transfer(),
        physical    : this.data.physical.transfer(),
        investigate : this.data.investigate.transfer(),
        druglist    : this.data.druglist.map(x => x.transfer()),
        problemlist : this.data.problemlist.map(x => x.transfer()),
      }
    }
  }

}

class GuideList {

  constructor(guide) {
    this.dict = {}
    for (const item of guide[0].elements)
      this.dict[item.attributes.title] = item
  }
}

class Patient {

  constructor(data, guide, path) {
    this.path = path
    // this.rawdata = data
    // this.rawguide = guide
    this.events = []
    this.guide = new GuideList(guide)
    const dict = this.guide.dict
    const extractor = i => i.elements && i.elements.length
      ? i.elements[0].text
      : undefined
    for (const item of data[0].elements)
      if (item.name === 'character')
        this.person = convert(item.elements, extractor),
        this.person.face = '.' + path+item.attributes.filename
      else {
        const title = item.attributes.title
        this.events.push(new Event(item, dict[title]))
      }
    }

  transfer() {
    return {
      path    : this.path,
      person  : this.person,
      event   : this.events.map(e => e.transfer())
    }
  }


  static readfile(base, path) {
    const data = loadxml(base + path)
    return data[0]
      .elements
      .map(p => p.attributes)
      .map(a => ({
        folder : base + a.folder + "/",
        data   : loadxml(`${base}${a.folder}/${a.file}`),
        guide  : loadxml(`${base}${a.folder}/${a.studyguidefile}`)
      }))
      .map(i => new Patient(i.data, i.guide, i.folder))
  }

}


const p = Patient.readfile('./page/data/data/', path)
const data = p.map(p => p.transfer())
const string = JSON.stringify(data)

fs.writeFile("./page/data/data.json", string, (err) => console.log(err))
