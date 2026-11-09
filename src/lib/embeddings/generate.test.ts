import { describe, expect, it } from 'vitest'
import { EMBEDDING_DIMENSIONS } from './types'
import {
  assertEmbeddingDimension,
  buildEmbeddingText,
  embeddingDimensionSelfCheck,
} from './generate'

describe('buildEmbeddingText', () => {
  it('joins title and description with a blank line', () => {
    expect(
      buildEmbeddingText({
        title: ' Cedar hideaway ',
        description: ' Dock on the lake. ',
      }),
    ).toBe('Cedar hideaway\n\nDock on the lake.')
  })

  it('does not include city or id', () => {
    const text = buildEmbeddingText({
      title: 'Loft',
      description: 'Walk to dinner.',
    })
    expect(text).not.toMatch(/minneapolis/i)
    expect(text).not.toMatch(/uuid/i)
  })
})

describe('assertEmbeddingDimension', () => {
  it('accepts a 1536-length finite vector', () => {
    const vector = Array.from({ length: EMBEDDING_DIMENSIONS }, () => 0)
    expect(assertEmbeddingDimension(vector)).toBe(true)
  })

  it('rejects the wrong length', () => {
    expect(assertEmbeddingDimension([1, 2, 3])).toBe(false)
  })
})

describe('embeddingDimensionSelfCheck', () => {
  it('matches the data-model dimension', () => {
    const check = embeddingDimensionSelfCheck()
    expect(check.ok).toBe(true)
    expect(check.expected).toBe(1536)
    expect(check.actual).toBe(1536)
  })
})
