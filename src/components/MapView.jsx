import { useState, useEffect, useRef, useMemo } from 'react'
import mapboxgl from 'mapbox-gl'
import { computeHexScores, LR_LABELS } from '../utils/lrIndex'
import LRLegend from './LRLegend'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

const CATEGORIES = {
  synagogue: { label: 'Synagogues', dotColor: '#3B82F6', icon: '✡️' },
  kosher_restaurant: { label: 'Kosher Restaurants', dotColor: '#F59E0B', icon: '🍽️' },
  kosher_grocery: { label: 'Kosher Grocery', dotColor: '#22C55E', icon: '🛒' },
  jewish_school: { label: 'Jewish Schools', dotColor: '#EC4899', icon: '🏫' },
  community_center: { label: 'Community Centers', dotColor: '#A855F7', icon: '🏛️' },
  jewish_jewelry: { label: 'Jewelry & Judaica', dotColor: '#F97316', icon: '💎' },
  high_end_store: { label: 'High-End Stores', dotColor: '#E11D48', icon: '👜' },
}

const HEX_SOURCE_ID = 'lr-hex'
const HEX_FILL_LAYER = 'lr-hex-fill'
const HEX_LINE_LAYER = 'lr-hex-line'
const MARKERS_SOURCE_ID = 'places-source'

export default function MapView() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const mapReady = useRef(false)

  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState('')
  const [places, setPlaces] = useState([])
  const [activeFilters, setActiveFilters] = useState(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [noToken, setNoToken] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)

  // Count places per category
  const categoryCounts = useMemo(() => {
    const counts = {}
    for (const key of Object.keys(CATEGORIES)) {
      counts[key] = places.filter(p => p.category === key).length
    }
    return counts
  }, [places])

  // Filtered places based on active filters
  const filteredPlaces = useMemo(
    () => places.filter(p => activeFilters[p.category]),
    [places, activeFilters]
  )

  // GeoJSON for markers
  const markersGeojson = useMemo(() => ({
    type: 'FeatureCollection',
    features: filteredPlaces.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        name: p.name,
        category: p.category,
        address: p.address || '',
        phone: p.phone || '',
        website: p.website || '',
      },
    })),
  }), [filteredPlaces])

  // Load places data
  useEffect(() => {
    async function loadPlaces() {
      setLoading(true)
      setLoadingProgress('Loading places...')
      try {
        const res = await fetch('/data/places.json')
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        console.log('Loaded', data.length, 'places')
        setPlaces(data)
      } catch (err) {
        console.error('Failed to load places:', err)
      } finally {
        setLoading(false)
        setLoadingProgress('')
      }
    }
    loadPlaces()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setNoToken(true)
      return
    }
    if (map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-95.7, 39.8],
      zoom: 4,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      console.log('Map loaded')

      // Add hex source and layers for heatmap
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

      // Add markers source
      map.current.addSource(MARKERS_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      // Add a circle layer for ALL markers (single layer, colored by category)
      map.current.addLayer({
        id: 'places-circles',
        type: 'circle',
        source: MARKERS_SOURCE_ID,
        paint: {
          'circle-color': [
            'match', ['get', 'category'],
            'synagogue', '#3B82F6',
            'kosher_restaurant', '#F59E0B',
            'kosher_grocery', '#22C55E',
            'jewish_school', '#EC4899',
            'community_center', '#A855F7',
            'jewish_jewelry', '#F97316',
            'high_end_store', '#E11D48',
            '#888888'
          ],
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 4, 8, 7, 12, 10],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })

      // Click handler for markers
      map.current.on('click', 'places-circles', (e) => {
        if (!e.features || e.features.length === 0) return
        const props = e.features[0].properties
        setSelectedPlace({
          id: props.id,
          name: props.name,
          category: props.category,
          address: props.address,
          phone: props.phone,
          website: props.website,
        })
      })

      map.current.on('mouseenter', 'places-circles', () => {
        map.current.getCanvas().style.cursor = 'pointer'
      })

      map.current.on('mouseleave', 'places-circles', () => {
        map.current.getCanvas().style.cursor = ''
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
        const label = props.label
        const labelInfo = LR_LABELS.find(lr => score >= lr.min && score <= lr.max) || LR_LABELS[0]

        hexPopup
          .setLngLat(e.lngLat)
          .setHTML(`<div class="hex-popup-inner"><div class="hex-popup-score">${score}<span>/100</span></div><div class="hex-popup-label" style="color:${labelInfo.color}">${label}</div></div>`)
          .addTo(map.current)
      })

      map.current.on('mouseleave', HEX_FILL_LAYER, () => {
        map.current.getCanvas().style.cursor = ''
        hexPopup.remove()
      })

      mapReady.current = true
      console.log('Map ready, layers added')
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
        mapReady.current = false
      }
    }
  }, [])

  // Update markers when data or filters change
  useEffect(() => {
    if (!map.current) return

    const updateMarkers = () => {
      const source = map.current?.getSource(MARKERS_SOURCE_ID)
      if (source && markersGeojson.features.length > 0) {
        source.setData(markersGeojson)
        console.log('Updated markers:', markersGeojson.features.length)
      } else if (markersGeojson.features.length > 0 && !mapReady.current) {
        // Map not ready yet, try again
        setTimeout(updateMarkers, 100)
      }
    }

    updateMarkers()
  }, [markersGeojson])

  // Update hex heatmap
  useEffect(() => {
    if (!map.current || !mapReady.current) return

    const source = map.current.getSource(HEX_SOURCE_ID)
    if (!source) return

    if (!showHeatmap || filteredPlaces.length === 0) {
      source.setData({ type: 'FeatureCollection', features: [] })
      return
    }

    const geojson = computeHexScores(filteredPlaces)
    source.setData(geojson)
  }, [filteredPlaces, showHeatmap])

  // Toggle dots visibility based on heatmap state
  useEffect(() => {
    if (!map.current || !mapReady.current) return

    const layer = map.current.getLayer('places-circles')
    if (layer) {
      map.current.setLayoutProperty(
        'places-circles',
        'visibility',
        showHeatmap ? 'none' : 'visible'
      )
    }
  }, [showHeatmap])

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
          <p>Create a <code>.env</code> file with VITE_MAPBOX_TOKEN</p>
        </div>
      </section>
    )
  }

  return (
    <section className="map-section">
      <div className="map-wrapper">
        <div ref={mapContainer} className="map-container" />

        {/* Search bar */}
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

        {/* Sidebar */}
        <div className="map-sidebar">
          <button
            className={`lr-index-toggle ${showHeatmap ? 'active' : ''}`}
            onClick={() => setShowHeatmap(prev => !prev)}
          >
            <span className="lr-index-label">LR Index</span>
            <span className={`lr-index-indicator ${showHeatmap ? 'on' : ''}`}>
              {showHeatmap ? 'ON' : 'OFF'}
            </span>
          </button>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <div className="sidebar-section-title">Filters</div>
            <div className="sidebar-filters">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  className={`sidebar-filter-item ${activeFilters[key] ? 'active' : ''}`}
                  onClick={() => toggleFilter(key)}
                >
                  <span className="sidebar-dot" style={{ background: activeFilters[key] ? cat.dotColor : 'rgba(255,255,255,0.2)' }} />
                  <span className="sidebar-label">{cat.label}</span>
                  <span className="sidebar-count">{categoryCounts[key]?.toLocaleString() || 0}</span>
                </button>
              ))}
            </div>
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
