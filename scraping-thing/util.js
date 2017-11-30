const util = module.exports = (() => {

  class MultiSet {

    constructor() {
      this.set = {}
      this.length = 0
    }

    add(string) {
      this.length += 1
      if (this.set[string])
        this.set[string] += 1
      else
        this.set[string] = 1
    }

    remove(string) {
      if (!this.set[string])
        throw "removing element not in MultiSet"
      else if (this.set[string] === 1)
        delete this.set[string]
      else
        this.set[string] -= 1
      this.length -= 1

    }

  }

    function getnext(headers) {

        if (headers.link) {
            const links = headers.link
            const sublinks = links.split(",")
            for (link of sublinks) {
                const [qlink, rawtype] = link.split("; ")
                const [rel, qtype] = rawtype.split("=")
                const purelink = qlink.slice(1, -1)
                const puretype = qtype.slice(1, -1)
                if (puretype === 'next')
                    return purelink
            }
        }

    }

  function watch(callback, delay=500) {
    const call = () => { callback() && setTimeout(call, delay) }
    setTimeout(call, delay)
  }

  function print(x) {
    console.log(x)
    return x
  }

  return { print, watch, getnext, MultiSet }

})()

