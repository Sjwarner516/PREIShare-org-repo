/**
 * Live ranking check for Sprint 5 verification.
 * Run: npx tsx scripts/verify-semantic-search.ts
 */
import { searchPropertiesByText } from '../src/lib/property-search'
import sampleFile from '../data/sample-properties.json' with { type: 'json' }

const QUERIES = [
  'quiet cabin near water with good rental upside',
  'family-friendly home close to good schools',
  'downtown condo walkable to restaurants',
  'flat irrigated farmland for row crops',
  'peaceful place I can rent out on weekends',
] as const

const TRAP_WORDS = ['cabin', 'water', 'quiet', 'rental', 'upside'] as const

type Sample = {
  id: string
  title: string
  description: string
}

function keywordHits(query: string, listings: Sample[]): Sample[] {
  const words = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3)
  return listings.filter((listing) => {
    const text = `${listing.title} ${listing.description}`.toLowerCase()
    return words.some((word) => text.includes(word))
  })
}

async function main() {
  const listings = (sampleFile as { properties: Sample[] }).properties
  const cedar = listings.find((p) => p.title.startsWith('Cedar'))
  if (!cedar) throw new Error('Cedar hideaway missing from sample JSON')

  const cedarText = `${cedar.title} ${cedar.description}`.toLowerCase()
  const cedarKeywordHits = TRAP_WORDS.filter((w) => cedarText.includes(w))

  console.log('=== keyword-trap listing ===')
  console.log(cedar.title)
  console.log('trap words found in listing:', cedarKeywordHits.length ? cedarKeywordHits : '(none)')

  console.log('\n=== semantic queries ===')
  for (const query of QUERIES) {
    const results = await searchPropertiesByText(query, 5)
    const kw = keywordHits(query, listings)
    console.log(`\nQ: ${query}`)
    console.log(
      'keyword hits:',
      kw.length ? kw.map((p) => p.title).join(' | ') : '(none)',
    )
    results.forEach((row, i) => {
      console.log(
        `  ${i + 1}. ${row.title}  sim=${row.similarity.toFixed(4)}  city=${row.city ?? ''}`,
      )
    })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
