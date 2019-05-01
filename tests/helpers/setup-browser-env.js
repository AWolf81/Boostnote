import browserEnv from 'browser-env'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'
browserEnv(['window', 'document', 'navigator'])

// for CodeMirror mockup
document.body.createTextRange = function () {
  return {
    setEnd: function () {},
    setStart: function () {},
    getBoundingClientRect: function () {
      return {right: 0}
    },
    getClientRects: function () {
      return {
        length: 0,
        left: 0,
        right: 0
      }
    }
  }
}

window.localStorage = {
  // polyfill
  getItem () {
    return '{}'
  }
}

// React 15 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })
