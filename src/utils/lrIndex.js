import { latLngToCell, cellToBoundary, gridDisk } from 'h3-js'

export const CATEGORY_WEIGHTS = {
  synagogue: 5,
  jewish_school: 5,
  community_center: 5,
  kosher_restaurant: 3,
  kosher_grocery: 3,
  jewish_jewelry: 2,
  high_end_store: 1,
}

export const LR_LABELS = [
  { min: 0, max: 20, label: 'Comfortable', color: '#F97316' },
  { min: 21, max: 40, label: 'Well Off', color: '#FBBF24' },
  { min: 41, max: 60, label: 'Affluent', color: '#22C55E' },
  { min: 61, max: 80, label: 'Wealthy', color: '#06B6D4' },
  { min: 81, max: 100, label: 'Super Rich', color: '#1A4FD0' },
]

// Fixed H3 resolution for consistent hex sizes across all zoom levels
// Resolution 7 = ~5 km² average hex area
export const H3_RESOLUTION = 7

export function computeHexScores(places) {
  if (!places || places.length === 0) {
    return { type: 'FeatureCollection', features: [] }
  }

  const cellScores = new Map()

  for (const place of places) {
    const h3Index = latLngToCell(place.lat, place.lng, H3_RESOLUTION)
    if (!cellScores.has(h3Index)) {
      cellScores.set(h3Index, { raw: 0, count: 0, categories: {} })
    }
    const cell = cellScores.get(h3Index)
    cell.raw += CATEGORY_WEIGHTS[place.category] || 1
    cell.count += 1
    cell.categories[place.category] = (cell.categories[place.category] || 0) + 1
  }

  const smoothed = new Map()
  for (const [h3Index, data] of cellScores) {
    const neighbors = gridDisk(h3Index, 1).filter(n => n !== h3Index)
    let neighborSum = 0
    let neighborCount = 0
    for (const n of neighbors) {
      if (cellScores.has(n)) {
        neighborSum += cellScores.get(n).raw
        neighborCount++
      }
    }
    const neighborAvg = neighborCount > 0 ? neighborSum / neighborCount : 0
    smoothed.set(h3Index, {
      score: data.raw + neighborAvg * 0.3,
      count: data.count,
      categories: data.categories,
    })
  }

  const SCORE_CAP = 20

  const scored = []
  for (const [h3Index, { score, count, categories }] of smoothed) {
    const normalized = Math.min(100, Math.round((score / SCORE_CAP) * 100))
    scored.push({ h3Index, normalized, count, categories })
  }

  scored.sort((a, b) => b.normalized - a.normalized)

  const features = []
  for (let i = 0; i < scored.length; i++) {
    const { h3Index, normalized, count, categories } = scored[i]
    const boundary = cellToBoundary(h3Index)
    const coordinates = boundary.map(([lat, lng]) => [lng, lat])
    coordinates.push(coordinates[0])

    let label = 'No Resources'
    for (const lr of LR_LABELS) {
      if (normalized >= lr.min && normalized <= lr.max) {
        label = lr.label
        break
      }
    }

    features.push({
      type: 'Feature',
      properties: {
        h3Index,
        score: normalized,
        poiCount: count,
        rank: i + 1,
        totalHexes: scored.length,
        label,
        categories: JSON.stringify(categories),
      },
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
    })
  }

  return { type: 'FeatureCollection', features }
}
