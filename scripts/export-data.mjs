#!/usr/bin/env node
/**
 * Fetches all Jewish community resource data from Overpass API
 * and saves it as a static JSON file for instant page loads.
 *
 * Usage: node scripts/export-data.mjs
 */

const US_HALVES = [
  { name: 'West', bbox: '24,-125,50,-95' },
  { name: 'East', bbox: '24,-95,50,-66' },
]

function buildCoreQuery(bbox) {
  const lines = ['[out:json][timeout:90];', '(']
  const queries = [
    `node["cuisine"="kosher"](${bbox})`,
    `way["cuisine"="kosher"](${bbox})`,
    `node["diet:kosher"="yes"](${bbox})`,
    `way["diet:kosher"="yes"](${bbox})`,
    `node["diet:kosher"="only"](${bbox})`,
    `way["diet:kosher"="only"](${bbox})`,
    `node["shop"]["kosher"="yes"](${bbox})`,
    `way["shop"]["kosher"="yes"](${bbox})`,
    `node["shop"]["diet:kosher"="yes"](${bbox})`,
    `way["shop"]["diet:kosher"="yes"](${bbox})`,
    `node["amenity"="place_of_worship"]["religion"="jewish"](${bbox})`,
    `way["amenity"="place_of_worship"]["religion"="jewish"](${bbox})`,
    `relation["amenity"="place_of_worship"]["religion"="jewish"](${bbox})`,
    `node["building"="synagogue"](${bbox})`,
    `way["building"="synagogue"](${bbox})`,
    `node["amenity"="school"]["religion"="jewish"](${bbox})`,
    `way["amenity"="school"]["religion"="jewish"](${bbox})`,
    `node["amenity"="community_centre"]["religion"="jewish"](${bbox})`,
    `way["amenity"="community_centre"]["religion"="jewish"](${bbox})`,
    `node["shop"="jewelry"]["religion"="jewish"](${bbox})`,
    `way["shop"="jewelry"]["religion"="jewish"](${bbox})`,
  ]
  for (const q of queries) lines.push(q + ';')
  lines.push(');', 'out center body;')
  return lines.join('\n')
}

function buildBrandQuery(bbox) {
  const lines = ['[out:json][timeout:90];', '(']
  const queries = [
    `node["shop"="clothes"]["brand"~"Gucci|Louis Vuitton|Prada|Chanel|Dior|Hermès|Hermes|Burberry|Versace|Fendi|Balenciaga|Cartier|Tiffany|Rolex|Bulgari|Valentino|Saint Laurent|YSL|Givenchy|Bottega Veneta|Alexander McQueen|Tom Ford|Dolce.*Gabbana"](${bbox})`,
    `way["shop"="clothes"]["brand"~"Gucci|Louis Vuitton|Prada|Chanel|Dior|Hermès|Hermes|Burberry|Versace|Fendi|Balenciaga|Cartier|Tiffany|Rolex|Bulgari|Valentino|Saint Laurent|YSL|Givenchy|Bottega Veneta|Alexander McQueen|Tom Ford|Dolce.*Gabbana"](${bbox})`,
    `node["shop"="jewelry"]["brand"~"Cartier|Tiffany|Bulgari|Harry Winston|Van Cleef|Chopard|David Yurman|Rolex"](${bbox})`,
    `way["shop"="jewelry"]["brand"~"Cartier|Tiffany|Bulgari|Harry Winston|Van Cleef|Chopard|David Yurman|Rolex"](${bbox})`,
    `node["shop"="department_store"]["brand"~"Nordstrom|Neiman Marcus|Saks Fifth Avenue|Bloomingdale|Barneys"](${bbox})`,
    `way["shop"="department_store"]["brand"~"Nordstrom|Neiman Marcus|Saks Fifth Avenue|Bloomingdale|Barneys"](${bbox})`,
  ]
  for (const q of queries) lines.push(q + ';')
  lines.push(');', 'out center body;')
  return lines.join('\n')
}

const HIGH_END_BRANDS = /gucci|louis vuitton|prada|chanel|dior|herm[eè]s|burberry|versace|fendi|balenciaga|cartier|tiffany|rolex|bulgari|valentino|saint laurent|ysl|givenchy|bottega veneta|alexander mcqueen|tom ford|dolce.*gabbana|harry winston|van cleef|chopard|david yurman|neiman marcus|saks fifth|bloomingdale|barneys|nordstrom/i

function isJewishByContext(tags) {
  if (tags.religion === 'jewish') return true
  if (tags.denomination && /orthodox|reform|conservative|reconstructionist|hasidic|chabad/.test(tags.denomination.toLowerCase())) return true
  const name = (tags.name || '').toLowerCase()
  if (/synagogue|chabad|bnai|b'nai|beth\b|beit\b|shul\b|shalom|torah|jewish|hebrew|yeshiva|hillel|hadassah|judaica/.test(name)) return true
  return false
}

function categorizeElement(tags) {
  const name = (tags.name || '').toLowerCase()
  const brand = (tags.brand || '').toLowerCase()
  const religion = (tags.religion || '').toLowerCase()

  if (HIGH_END_BRANDS.test(brand) || HIGH_END_BRANDS.test(name)) {
    if (['clothes', 'jewelry', 'jewellery', 'department_store', 'fashion', 'boutique'].includes(tags.shop)) {
      return 'high_end_store'
    }
  }

  if (religion && religion !== 'jewish') return null

  if (tags.amenity === 'place_of_worship' && tags.religion === 'jewish') return 'synagogue'
  if (tags.building === 'synagogue') return 'synagogue'
  if (/synagogue|chabad|shul\b|bnai|b'nai/.test(name) && !tags.shop) return 'synagogue'
  if (/congregation/.test(name) && !tags.shop && isJewishByContext(tags)) return 'synagogue'

  if (tags.amenity === 'school' && tags.religion === 'jewish') return 'jewish_school'
  if (/yeshiva|hebrew.*academy|jewish.*school|torah.*academy|hebrew.*day/.test(name)) return 'jewish_school'

  if (tags.amenity === 'community_centre' && tags.religion === 'jewish') return 'community_center'
  if (/jewish community|^jcc$|jcc\b|jewish federation|hillel|chabad house|jewish family/.test(name)) return 'community_center'

  if ((tags.shop === 'jewelry' || tags.shop === 'jewellery') && isJewishByContext(tags)) return 'jewish_jewelry'
  if (tags.shop && /judaica/.test(name)) return 'jewish_jewelry'

  if (tags.shop && (tags.kosher === 'yes' || tags['diet:kosher'] === 'yes' || tags['diet:kosher'] === 'only')) return 'kosher_grocery'
  if (tags.shop && /kosher/.test(name)) return 'kosher_grocery'

  if (tags.cuisine === 'kosher' || tags['diet:kosher'] === 'yes' || tags['diet:kosher'] === 'only') return 'kosher_restaurant'

  return null
}

async function fetchQuery(label, query) {
  console.log(`  Fetching ${label}...`)
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!response.ok) throw new Error(`Overpass returned ${response.status} for ${label}`)
  const data = await response.json()
  console.log(`  ${label}: ${data.elements?.length || 0} raw elements`)
  return data.elements || []
}

async function main() {
  const { writeFileSync } = await import('fs')
  const { resolve } = await import('path')

  console.log('Fetching core Jewish community data...')
  const coreResults = await Promise.all(
    US_HALVES.map(r => fetchQuery(`Core ${r.name}`, buildCoreQuery(r.bbox)))
  )

  console.log('\nWaiting before brand queries...')
  await new Promise(r => setTimeout(r, 3000))

  console.log('Fetching high-end brand data...')
  // Full US in one query for brands (smaller result set)
  const brandResults = await fetchQuery('Brands US', buildBrandQuery('24,-125,50,-66'))

  const allElements = [...coreResults.flat(), ...brandResults]
  console.log(`\nTotal raw elements: ${allElements.length}`)

  const places = allElements
    .filter(el => el.tags && el.tags.name)
    .map(el => {
      const category = categorizeElement(el.tags)
      if (!category) return null
      return {
        id: el.id,
        name: el.tags.name,
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
        category,
        address: [el.tags['addr:street'], el.tags['addr:city'], el.tags['addr:state']]
          .filter(Boolean)
          .join(', '),
        phone: el.tags.phone || el.tags['contact:phone'] || '',
        website: el.tags.website || el.tags['contact:website'] || '',
      }
    })
    .filter(p => p && p.lat && p.lng)

  const unique = Array.from(new Map(places.map(p => [p.id, p])).values())

  // Category breakdown
  const counts = {}
  for (const p of unique) {
    counts[p.category] = (counts[p.category] || 0) + 1
  }
  console.log('\nCategory breakdown:')
  for (const [cat, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`)
  }
  console.log(`\nTotal unique places: ${unique.length}`)

  const outPath = resolve('public', 'data', 'places.json')
  const { mkdirSync } = await import('fs')
  mkdirSync(resolve('public', 'data'), { recursive: true })
  writeFileSync(outPath, JSON.stringify(unique))
  const sizeMB = (Buffer.byteLength(JSON.stringify(unique)) / 1024 / 1024).toFixed(2)
  console.log(`\nSaved to ${outPath} (${sizeMB} MB)`)
  console.log('Done! The map will now load instantly from this file.')
}

main().catch(err => {
  console.error('Export failed:', err)
  process.exit(1)
})
