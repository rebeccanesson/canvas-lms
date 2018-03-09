
import Vue from 'vue'


class App {

  constructor() {

    function loadapp(self) {

      const tmpl = Vue.compile(require('../data/tmpl/index.vue'))
      const data = { 
        event  : 0, 
        person : 0,
        data   : self.data,
        app    : self,
        active : '',
      }

      const computed = {
        p : () => self.data[data.person],
        e : () => self.data[data.person].event[data.event],
        text : () => self.data[data.person].event[data.event].data[data.active]
      }

      const options = {
        el              : '#mainapp',
        data            : data,
        computed        : computed,
        render          : tmpl.render,
        staticRenderFns : tmpl.staticRenderFns,
      }

      return new Vue(options)
    }

    function main(self) {
      self.temp = { person: 0, event: 0 }
      self.data = require("../data/data.json")
      self.vue = loadapp(self)
    }

    return main(this)

  }


  log(item) {
    console.log(item)
  }

  show(key) {

  }
}

const app = window.app = new App()

const data = require("../data/data.json")
console.log(data)