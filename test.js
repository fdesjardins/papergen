/* global describe, it */

const assert = require('chai').assert
const papergen = require('./index')

describe('papergen', () => {
  it('should exist', done => {
    assert(papergen !== undefined)
    done()
  })
})
