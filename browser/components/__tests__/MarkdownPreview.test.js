import React from 'react'
import { shallow } from 'enzyme'
import MarkdownPreview from '../MarkdownPreview'

describe('MarkdownPreview component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<MarkdownPreview />)
  })

  it('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  xit('should rewrite with todolist preview mode (active)', () => {
    expect(true).toBeFalsy()
  })
})
