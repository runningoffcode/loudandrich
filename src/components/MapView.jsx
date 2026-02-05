import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import mapboxgl from 'mapbox-gl'
import { computeHexScores, LR_LABELS } from '../utils/lrIndex'
import LRLegend from './LRLegend'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

const CATEGORIES = {
  kosher_restaurant: { label: 'Kosher Restaurants', dotColor: '#F59E0B', icon: '🍽️' },
  kosher_grocery: { label: 'Kosher Grocery', dotColor: '#22C55E', icon: '🛒' },
  synagogue: { label: 'Synagogues', dotColor: '#3B82F6', icon: '✡️' },
  jewish_school: { label: 'Jewish Schools', dotColor: '#EC4899', icon: '🏫' },
  community_center: { label: 'Community Centers', dotColor: '#A855F7', icon: '🏛️' },
  jewish_jewelry: { label: 'Jewelry & Judaica', dotColor: '#F97316', icon: '💎' },
  high_end_store: { label: 'High-End Stores', dotColor: '#E11D48', icon: '👜' },
}

function buildDetailQuery(bounds) {
  const { _sw, _ne } = bounds
  const bbox = `${_sw.lat},${_sw.lng},${_ne.lat},${_ne.lng}`
  const lines = [
    '[out:json][timeout:60];',
    '(',
  ]
  const queries = [
    `node["amenity"]["name"~"[Ss]ynagogue|[Cc]habad|[Bb]nai|[Bb]'nai"](${bbox})`,
    `way["amenity"]["name"~"[Ss]ynagogue|[Cc]habad|[Bb]nai|[Bb]'nai"](${bbox})`,
    `node["amenity"]["name"~"[Yy]eshiva|[Hh]ebrew.*[Aa]cademy|[Tt]orah"](${bbox})`,
    `way["amenity"]["name"~"[Yy]eshiva|[Hh]ebrew.*[Aa]cademy|[Tt]orah"](${bbox})`,
    `node["amenity"]["name"~"JCC|[Jj]ewish [Cc]ommunity|[Jj]ewish [Ff]ederation|[Hh]illel"](${bbox})`,
    `way["amenity"]["name"~"JCC|[Jj]ewish [Cc]ommunity|[Jj]ewish [Ff]ederation|[Hh]illel"](${bbox})`,
    `node["shop"]["name"~"[Kk]osher"](${bbox})`,
    `way["shop"]["name"~"[Kk]osher"](${bbox})`,
    `node["shop"="jewelry"]["name"~"[Jj]ewish|[Hh]ebrew|[Jj]udaica|[Ss]tar of [Dd]avid|[Mm]enorah"](${bbox})`,
    `way["shop"="jewelry"]["name"~"[Jj]ewish|[Hh]ebrew|[Jj]udaica|[Ss]tar of [Dd]avid|[Mm]enorah"](${bbox})`,
    `node["shop"]["name"~"[Jj]udaica"](${bbox})`,
    `way["shop"]["name"~"[Jj]udaica"](${bbox})`,
  ]
  for (const q of queries) {
    lines.push(q + ';')
  }
  lines.push(');')
  lines.push('out center body;')
  return lines.join('\n')
}

function isJewishByContext(tags) {
  if (tags.religion === 'jewish') return true
  if (tags.denomination && /orthodox|reform|conservative|reconstructionist|hasidic|chabad/.test(tags.denomination.toLowerCase())) return true
  const name = (tags.name || '').toLowerCase()
  if (/synagogue|chabad|bnai|b'nai|beth\b|beit\b|shul\b|shalom|torah|jewish|hebrew|yeshiva|hillel|hadassah|judaica/.test(name)) return true
  return false
}

const HIGH_END_BRANDS = /gucci|louis vuitton|prada|chanel|dior|herm[eè]s|burberry|versace|fendi|balenciaga|cartier|tiffany|rolex|bulgari|valentino|saint laurent|ysl|givenchy|bottega veneta|alexander mcqueen|tom ford|dolce.*gabbana|harry winston|van cleef|chopard|david yurman|neiman marcus|saks fifth|bloomingdale|barneys|nordstrom/i

function categorizeElement(tags) {
  const name = (tags.name || '').toLowerCase()
  const brand = (tags.brand || '').toLowerCase()
  const religion = (tags.religion || '').toLowerCase()

  // High-end stores — check brand first
  if (HIGH_END_BRANDS.test(brand) || HIGH_END_BRANDS.test(name)) {
    if (tags.shop === 'clothes' || tags.shop === 'jewelry' || tags.shop === 'jewellery' ||
        tags.shop === 'department_store' || tags.shop === 'fashion' || tags.shop === 'boutique') {
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

function parseOverpassElements(elements) {
  return elements
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
        tags: el.tags,
        address: [el.tags['addr:street'], el.tags['addr:city'], el.tags['addr:state']]
          .filter(Boolean)
          .join(', '),
        phone: el.tags.phone || el.tags['contact:phone'] || '',
        website: el.tags.website || el.tags['contact:website'] || '',
      }
    })
    .filter(p => p && p.lat && p.lng)
}

async function fetchOverpass(query, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      if (response.status === 429 || response.status === 504) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
        continue
      }
      if (!response.ok) continue
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('json')) continue
      const data = await response.json()
      return data.elements || []
    } catch {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
      }
    }
  }
  return []
}

const DETAIL_ZOOM = 10
const HEX_SOURCE_ID = 'lr-hex'
const HEX_FILL_LAYER = 'lr-hex-fill'
const HEX_LINE_LAYER = 'lr-hex-line'
const MARKER_LAYER_PREFIX = 'lr-marker-'
const MARKER_SOURCE_ID = 'lr-markers-unclustered'

export default function MapView() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const hexLayerAdded = useRef(false)
  const markerLayersAdded = useRef(false)
  const [markerLayersReady, setMarkerLayersReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState('')
  const [nationalData, setNationalData] = useState([])
  const [viewportData, setViewportData] = useState([])
  const [activeFilters, setActiveFilters] = useState(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [noToken, setNoToken] = useState(false)
  const [zoom, setZoom] = useState(4)
  const [showHeatmap, setShowHeatmap] = useState(false)

  const allResults = useMemo(() => {
    const combined = new Map()
    for (const p of nationalData) combined.set(p.id, p)
    for (const p of viewportData) combined.set(p.id, p)
    return Array.from(combined.values())
  }, [nationalData, viewportData])

  const filteredResults = useMemo(
    () => allResults.filter(p => activeFilters[p.category]),
    [allResults, activeFilters]
  )

  const markerGeojson = useMemo(() => ({
    type: 'FeatureCollection',
    features: allResults.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        name: p.name,
        category: p.category,
        address: p.address,
        phone: p.phone,
        website: p.website,
      },
    })),
  }), [allResults])

  const addHexLayers = useCallback(() => {
    if (!map.current || hexLayerAdded.current) return
    if (!map.current.isStyleLoaded()) return
    try {
      map.current.addSource(HEX_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })
      map.current.addLayer({
        id: HEX_FILL_LAYER,
        type: 'fill',
        source: HEX_SOURCE_ID,
        paint: {
          'fill-color': [
            'interpolate', ['linear'], ['get', 'score'],
            0, '#F97316', 20, '#F97316',
            40, '#FBBF24', 60, '#22C55E',
            80, '#06B6D4', 100, '#1A4FD0',
          ],
          'fill-opacity': 0.55,
        },
      })
      map.current.addLayer({
        id: HEX_LINE_LAYER,
        type: 'line',
        source: HEX_SOURCE_ID,
        paint: {
          'line-color': 'rgba(255,255,255,0.08)',
          'line-width': 0.5,
        },
      })

      // Hex hover popup
      const hexPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'hex-popup',
      })

      map.current.on('mousemove', HEX_FILL_LAYER, (e) => {
        if (!e.features || e.features.length === 0) return
        map.current.getCanvas().style.cursor = 'pointer'
        const props = e.features[0].properties
        const score = props.score
        const rank = props.rank
        const total = props.totalHexes
        const label = props.label

        // Get the color for this score's label
        const labelInfo = LR_LABELS.find(lr => score >= lr.min && score <= lr.max) || LR_LABELS[0]
        const labelColor = labelInfo.color

        let breakdownHtml = ''
        try {
          const cats = JSON.parse(props.categories)
          const entries = Object.entries(cats).sort((a, b) => b[1] - a[1])
          breakdownHtml = entries.map(([cat, count]) => {
            const info = CATEGORIES[cat]
            if (!info) return ''
            return `<div class="hex-popup-cat-row"><span class="hex-popup-cat-dot" style="background:${info.dotColor}"></span><span class="hex-popup-cat-name">${info.label}</span><span class="hex-popup-cat-count">${count}</span></div>`
          }).join('')
        } catch { /* ignore */ }

        hexPopup
          .setLngLat(e.lngLat)
          .setHTML(
            `<div class="hex-popup-inner">` +
            `<div class="hex-popup-score">${score}<span>/100</span></div>` +
            `<div class="hex-popup-label" style="color:${labelColor}">${label}</div>` +
            `<div class="hex-popup-rank">#${rank} of ${total} areas</div>` +
            (breakdownHtml ? `<div class="hex-popup-breakdown">${breakdownHtml}</div>` : '') +
            `</div>`
          )
          .addTo(map.current)
      })

      map.current.on('mouseleave', HEX_FILL_LAYER, () => {
        map.current.getCanvas().style.cursor = ''
        hexPopup.remove()
      })

      hexLayerAdded.current = true
    } catch (e) {
      console.warn('Could not add hex layers:', e)
    }
  }, [])

  const addMarkerLayers = useCallback(() => {
    if (!map.current || markerLayersAdded.current) return
    if (!map.current.isStyleLoaded()) return

    try {
      // Unclustered source for showing individual category dots
      map.current.addSource(MARKER_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      // Add individual category layers - visible by default
      for (const [catKey, cat] of Object.entries(CATEGORIES)) {
        map.current.addLayer({
          id: MARKER_LAYER_PREFIX + catKey,
          type: 'circle',
          source: MARKER_SOURCE_ID,
          filter: ['==', ['get', 'category'], catKey],
          layout: { visibility: 'visible' },
          paint: {
            'circle-color': cat.dotColor,
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 5, 8, 7, 12, 10],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        })
      }

      // Click handlers for category dots
      for (const catKey of Object.keys(CATEGORIES)) {
        map.current.on('click', MARKER_LAYER_PREFIX + catKey, (e) => {
          const feature = e.features[0]
          if (!feature) return
          const props = feature.properties
          setSelectedPlace({
            id: props.id, name: props.name, category: props.category,
            address: props.address, phone: props.phone, website: props.website,
            lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0],
          })
        })
        map.current.on('mouseenter', MARKER_LAYER_PREFIX + catKey, () => {
          map.current.getCanvas().style.cursor = 'pointer'
        })
        map.current.on('mouseleave', MARKER_LAYER_PREFIX + catKey, () => {
          map.current.getCanvas().style.cursor = ''
        })
      }

      markerLayersAdded.current = true
      setMarkerLayersReady(true)
      console.log('Marker layers added successfully')
    } catch (e) {
      console.warn('Could not add marker layers:', e)
    }
  }, [])

  const fetchNationalData = useCallback(async () => {
    setLoading(true)
    setLoadingProgress('Loading places...')
    try {
      const res = await fetch('/data/places.json')
      if (!res.ok) throw new Error(`Failed to load data: ${res.status}`)
      const places = await res.json()
      console.log('Fetched places:', places.length)
      setNationalData(places)
      setLoadingProgress('')
    } catch (err) {
      console.error('Failed to load national data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchViewportData = useCallback(async () => {
    if (!map.current) return
    const z = map.current.getZoom()
    if (z < DETAIL_ZOOM) {
      setViewportData([])
      return
    }
    try {
      const bounds = map.current.getBounds()
      const query = buildDetailQuery(bounds)
      const elements = await fetchOverpass(query)
      const places = parseOverpassElements(elements)
      const unique = Array.from(new Map(places.map(p => [p.id, p])).values())
      setViewportData(unique)
    } catch (err) {
      console.error('Viewport fetch error:', err)
    }
  }, [])

  useEffect(() => {
    if (!MAPBOX_TOKEN) { setNoToken(true); return }
    if (map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-95.7, 39.8],
      zoom: 4,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
      }),
      'top-right'
    )

    map.current.on('load', () => {
      addHexLayers()
      addMarkerLayers()
      fetchNationalData()
    })

    map.current.on('moveend', () => {
      const z = map.current.getZoom()
      setZoom(z)
      if (z >= DETAIL_ZOOM) fetchViewportData()
    })

    map.current.on('zoom', () => setZoom(map.current.getZoom()))

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
        hexLayerAdded.current = false
        markerLayersAdded.current = false
        setMarkerLayersReady(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current || !markerLayersReady) return
    const source = map.current.getSource(MARKER_SOURCE_ID)
    if (source && markerGeojson.features.length > 0) {
      source.setData(markerGeojson)
      console.log('Marker data set:', markerGeojson.features.length, 'features')
    }
  }, [markerGeojson, markerLayersReady])

  useEffect(() => {
    if (!map.current || !markerLayersReady) return

    // Dots always show based on category filters (independent of heatmap)
    for (const catKey of Object.keys(CATEGORIES)) {
      const layerId = MARKER_LAYER_PREFIX + catKey
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', activeFilters[catKey] ? 'visible' : 'none')
      }
    }
  }, [activeFilters, markerLayersReady])

  useEffect(() => {
    if (!map.current || !hexLayerAdded.current) return
    const source = map.current.getSource(HEX_SOURCE_ID)
    if (!source) return
    if (!showHeatmap || filteredResults.length === 0) {
      source.setData({ type: 'FeatureCollection', features: [] })
      return
    }
    const geojson = computeHexScores(filteredResults)
    source.setData(geojson)
  }, [filteredResults, showHeatmap])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim() || !map.current) return
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&country=us&limit=1`
      )
      const data = await res.json()
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center
        map.current.flyTo({ center: [lng, lat], zoom: 12 })
      }
    } catch (err) {
      console.error('Geocoding error:', err)
    }
  }

  const toggleFilter = (key) => {
    setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (noToken) {
    return (
      <section className="map-section">
        <div className="map-no-token">
          <h2>Mapbox Token Required</h2>
          <p>Create a <code>.env</code> file in the project root with:</p>
          <pre>VITE_MAPBOX_TOKEN=your_mapbox_public_token_here</pre>
          <p>Get a free token at{' '}
            <a href="https://account.mapbox.com/auth/signup/" target="_blank" rel="noopener">mapbox.com</a>
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="map-section">
      <div className="map-wrapper">
        <div ref={mapContainer} className="map-container" />

        {/* Search bar overlay */}
        <div className="map-search-overlay">
          <form className="map-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search a city or zip code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        {/* Sidebar filter panel */}
        <div className="map-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Categories</div>
            <div className="sidebar-filters">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  className={`sidebar-filter-item ${activeFilters[key] ? 'active' : ''}`}
                  onClick={() => toggleFilter(key)}
                >
                  <span className="sidebar-dot" style={{ background: activeFilters[key] ? cat.dotColor : 'rgba(255,255,255,0.2)' }} />
                  <span className="sidebar-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-section">
            <div className="sidebar-section-title">Overlay</div>
            <button
              className={`sidebar-filter-item lr-toggle ${showHeatmap ? 'active' : ''}`}
              onClick={() => setShowHeatmap(prev => !prev)}
            >
              <span className="sidebar-dot lr-dot" style={{ background: showHeatmap ? '#1A4FD0' : 'rgba(255,255,255,0.2)' }} />
              <span className="sidebar-label">LR Index</span>
              <span className={`sidebar-toggle-indicator ${showHeatmap ? 'on' : ''}`}>
                {showHeatmap ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="map-loading">
            <div className="spinner" />
            {loadingProgress || 'Loading...'}
          </div>
        )}

        {selectedPlace && (
          <div className="place-detail">
            <button className="place-close" onClick={() => setSelectedPlace(null)}>&times;</button>
            <div className="place-category-badge" style={{ background: CATEGORIES[selectedPlace.category]?.dotColor }}>
              {CATEGORIES[selectedPlace.category]?.icon} {CATEGORIES[selectedPlace.category]?.label}
            </div>
            <h3>{selectedPlace.name}</h3>
            {selectedPlace.address && <p className="place-address">{selectedPlace.address}</p>}
            {selectedPlace.phone && (
              <p className="place-phone">
                <a href={`tel:${selectedPlace.phone}`}>{selectedPlace.phone}</a>
              </p>
            )}
            {selectedPlace.website && (
              <p className="place-website">
                <a href={selectedPlace.website} target="_blank" rel="noopener">Visit Website</a>
              </p>
            )}
          </div>
        )}

        {showHeatmap && <LRLegend />}

      </div>
    </section>
  )
}
