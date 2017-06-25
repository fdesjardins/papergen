/* global describe, it */

const assert = require('chai').assert
const paperGen = require('./index')

describe('paper-gen', () => {
  it('should exist', done => {
    assert(paperGen !== undefined)
    done()
  })
})
