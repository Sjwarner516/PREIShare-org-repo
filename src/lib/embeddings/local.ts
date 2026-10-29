/**
 * Deterministic 1536-d meaning embedding used when EMBEDDING_API_KEY is unset.
 *
 * This is not the dummy sine vector (EMBEDDING_MOCK=1). Tokens activate
 * synonym groups (water≈lake, cabin≈cottage, quiet≈serene) plus a hashed
 * unigram tail so the vector still depends on the rest of the sentence.
 * Length matches properties.embedding vector(1536). Cosine distance is the
 * same formula as pgvector <=> .
 */
import { EMBEDDING_DIMENSIONS } from './types'

const CONCEPT_DIMS = 24
const HASH_START = CONCEPT_DIMS
const CONCEPT_WEIGHT = 6
const HASH_WEIGHT = 0.35
const LOCAL_MODEL = 'local:synonym-hash-1536'

/**
 * Synonym groups share one axis so a buyer word and a listing word can match
 * without being identical. Groups are general English, not listing ids.
 */
const CONCEPT_GROUPS: readonly (readonly string[])[] = [
  [
    'water',
    'lake',
    'lakeside',
    'shore',
    'shoreline',
    'dock',
    'kayak',
    'river',
    'pond',
    'creek',
    'beach',
    'coast',
    'harbor',
    'harbour',
  ],
  [
    'cabin',
    'cottage',
    'hideaway',
    'lodging',
    'stay',
    'overnight',
    'guest',
    'guests',
    'vacation',
    'getaway',
    'chalet',
  ],
  [
    'quiet',
    'serene',
    'peaceful',
    'still',
    'calm',
    'tranquil',
    'restful',
  ],
  [
    'rental',
    'rent',
    'upside',
    'occupancy',
    'weekend',
    'weekends',
    'income',
    'shortterm',
    'turnover',
    'calendar',
    'calendars',
    'saturday',
    'sunday',
  ],
  [
    'family',
    'children',
    'child',
    'kids',
    'household',
    'households',
    'backyard',
    'yard',
    'playground',
    'fenced',
  ],
  ['school', 'schools', 'elementary', 'campus', 'district', 'middle'],
  [
    'downtown',
    'urban',
    'city',
    'loft',
    'condo',
    'flat',
    'business',
    'core',
    'sidewalk',
  ],
  [
    'walkable',
    'walk',
    'walking',
    'foot',
    'dining',
    'restaurant',
    'restaurants',
    'food',
    'meals',
    'block',
  ],
  [
    'farm',
    'farmland',
    'crop',
    'crops',
    'acre',
    'acres',
    'irrigated',
    'irrigation',
    'agricultural',
    'agriculture',
    'corn',
    'soybean',
    'tile',
    'tiled',
    'pivot',
    'fields',
    'cropland',
    'row',
  ],
  [
    'nightlife',
    'bars',
    'bar',
    'music',
    'midnight',
    'neon',
    'crowd',
    'noise',
    'noisy',
    'party',
    'venues',
  ],
  [
    'warehouse',
    'industrial',
    'freight',
    'truck',
    'loading',
    'logistics',
    'assembly',
    'storage',
    'bay',
  ],
  [
    'house',
    'home',
    'residential',
    'bedroom',
    'bedrooms',
    'suburban',
    'culdesac',
    'street',
    'tenancy',
  ],
  ['tenant', 'tenants', 'month', 'monthly', 'leased', 'duplex', 'yield'],
  ['pine', 'pines', 'forest', 'woods', 'secluded', 'tucked', 'private'],
]

const STOP = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'have',
  'has',
  'are',
  'was',
  'were',
  'been',
  'being',
  'can',
  'out',
  'near',
  'good',
  'want',
  'who',
  'not',
  'never',
  'into',
  'onto',
  'over',
  'under',
  'than',
  'then',
  'them',
  'they',
  'their',
  'its',
  'also',
  'just',
  'very',
  'more',
  'most',
  'some',
  'such',
  'only',
  'own',
  'other',
  'about',
  'into',
  'place',
  'people',
  'part',
])

const NEGATORS = new Set(['not', 'never', 'no'])

const TERM_TO_CONCEPT = new Map<string, number>()
CONCEPT_GROUPS.forEach((group, index) => {
  for (const term of group) {
    TERM_TO_CONCEPT.set(term, index)
  }
})

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOP.has(t))
}

function fnv1a(token: string): number {
  let h = 2166136261
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function l2Normalize(values: number[]): number[] {
  let sumSquares = 0
  for (const value of values) {
    sumSquares += value * value
  }
  const norm = Math.sqrt(sumSquares)
  if (norm === 0) {
    return values
  }
  return values.map((value) => value / norm)
}

/**
 * Embed raw text (query as typed, or listing `{title}\\n\\n{description}`).
 * Always returns length 1536, L2-normalized so cosine distance = 1 - dot.
 */
export function localSemanticEmbedding(text: string): number[] {
  const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0)
  const tokens = tokenize(text)
  const raw = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)

  let negatedRemaining = 0
  for (const rawToken of raw) {
    if (NEGATORS.has(rawToken)) {
      negatedRemaining = 3
      continue
    }
    if (negatedRemaining > 0) {
      negatedRemaining -= 1
      continue
    }
    if (rawToken.length < 3 || STOP.has(rawToken)) continue

    const concept = TERM_TO_CONCEPT.get(rawToken)
    if (concept !== undefined) {
      vector[concept] += CONCEPT_WEIGHT
    }

    const hashDim = HASH_START + (fnv1a(rawToken) % (EMBEDDING_DIMENSIONS - HASH_START))
    vector[hashDim] += HASH_WEIGHT
  }

  // Keep tokenize() in the recipe so title-only vs full text still differ even
  // if stopword filtering on the raw stream dropped everything.
  if (tokens.length === 0) {
    vector[0] = 1
  }

  return l2Normalize(vector)
}

export const LOCAL_EMBEDDING_MODEL = LOCAL_MODEL
