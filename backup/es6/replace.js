// NOTE: doesn't work when we have
// str<br>ing</br> and we search for string.


let HtmlSearch = (() => {

  const l = i => 2 * i + 1 // index of left child
  const r = i => 2 * i + 2 // index of right child
  const p = i => (i - 1) >> 1 // index of parent
  // largest power of two greater than or equal to x
  const ceillog = x => Math.ceil(Math.log2(x))

  function onespace(s) {
    while (s.includes("  "))
      s = s.replace(/  /g, " ")

    while (s.includes("\n "))
      s = s.replace(/\n /g, "\n")

    while (s.includes(" \n"))
      s = s.replace(/ \n/g, "\n")

    return s
  }

  class Html {

    // binary tree stores the length of the text stored in the tree
    heapify() {
      const size = this.size = 2**ceillog(this.items.length)
      const heap = this.heap = (new Array(size<<1)).fill(0)

      this.items.forEach((s, i) => 
        heap[i+size] = !s.attr * s.text.length)

      for (let i = size - 1; i--;)
        heap[i] = heap[l(i)] + heap[r(i)]

    }

    // update the tree to preserve the property
    update(i) {
      const heap = this.heap
      this.asserttext(i)
      heap[i+this.size] = this.items[i].text.length
      i += this.size
      while (i >>= 1) 
        heap[i] = heap[l(i)] + heap[r(i)]
    }

    // find the item containing 
    // character at index i in the text
    itemindex(i) {
      let curr = 0
      const heap = this.heap
      while (curr < this.size)
        curr = i < heap[l(curr)]
          ? l(curr)
          : (i -= heap[l(curr)], r(curr)) // cute
      return curr - this.size 
    }

    // returns the starting index
    // in the text of item at index i
    textindex(i) {
      let ind = 0
      i += this.size
      while (i = p(i))
        // only adds the size of left child if you are the right child
        ind += !(i%2) * this.heap[l(p(i))] 
      return ind
    }

    constructor(html) {
      const match = /(<..*?>)/g
      this.raw = html
      this.items = html
        .split(match)
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => ({ "attr": /^<..*?>$/g.test(s), "text":s }))
      this.items.forEach(d => d.attr ? null : d.text = onespace(d.text+" "))
      this.heapify()
    }

    text() {
      return this.items
        .filter(s => !s.attr)
        .map(s => s.text)
        .join("")
        .trim()
    }

    html() {
      return this.items
        .map(s => s.text.trim())
        .join("")
    }

    search(pattern, options) {
      let match = 0
      const regex  = new RegExp(`(${pattern})`, options)
      const strict = new RegExp(`^${pattern}$`, options)
      return this.text()
        .split(regex)
        .map(s => [s, match, match += s.length])
        .filter(t => strict.test(t[0]))
        .map(([s, start, end]) => ({"text":s, "s":start, "e":end}))
    }

    // returns -1 if this is the last
    // instance of text
    nexttextitem(i) {
      while (++i < this.items.length)
        if (!this.items[i].attr) 
          return i
      return -1
    }

    asserttext(i) {
      if (this.items[i].attr) 
        throw "not an editable text"
    }

    replace(m, newstr) {
      let i = this.itemindex(m.s)
      const t = this.textindex(i)
      const affected = [i]
      this.asserttext(i)

      let start = m.s - t
      let stop  = m.e - t
      let curr  = this.items[i]
      let overflow = stop - curr.text.length

      curr.text = (curr.text.slice(0, start)
                 + newstr 
                 + curr.text.slice(stop))

      while ((i = this.nexttextitem(i)) > 0 && overflow > 0) {
        curr = this.items[i]
        affected.push(i)
        if (curr.text.length < overflow) {
          overflow -= curr.text.length
          curr.text = ''
        } else {
          curr.text = curr.text.slice(overflow)
          break
        }
      }

      affected.forEach(i => this.update(i))
    }

    replaceall(ms, newstr) {
      ms.sort((ma, mb) => mb.s - ma.s)
      for (let i = 0; i < ms.length - 1; ++i) 
        if (ms[i].s < ms[i+1].e)
          throw "overlap in matches to be replaced"
      // replace from the back since
      // sizes in the heap are preserved up to the 
      // index of replacement
      ms.forEach((m) => this.replace(m, newstr)) 
    }
  }

  return Html

})()