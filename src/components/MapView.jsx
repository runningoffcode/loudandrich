import { useState, useEffect, useRef, useMemo } from 'react'
import mapboxgl from 'mapbox-gl'
import { computeHexScores, LR_LABELS } from '../utils/lrIndex'
import LRLegend from './LRLegend'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

const CATEGORIES = {
  synagogue: { label: 'Synagogues', dotColor: '#3B82F6', icon: '✡️' },        // Blue
  kosher_restaurant: { label: 'Kosher Restaurants', dotColor: '#F59E0B', icon: '🍽️' }, // Amber
  kosher_grocery: { label: 'Kosher Grocery', dotColor: '#22C55E', icon: '🛒' },  // Green
  jewish_school: { label: 'Schools', dotColor: '#EC4899', icon: '🏫' },   // Pink
  community_center: { label: 'Community Centers', dotColor: '#8B5CF6', icon: '🏛️' }, // Purple
  jewish_jewelry: { label: 'Jewelry & Judaica', dotColor: '#14B8A6', icon: '💎' }, // Teal
  high_end_store: { label: 'High-End Stores', dotColor: '#E11D48', icon: '👜' },  // Red
  bagel_shop: { label: 'Bagel Shops', dotColor: '#A855F7', icon: '🥯' },        // Violet
  jewish_bakery: { label: 'Kosher Bakeries', dotColor: '#F472B6', icon: '🥐' },  // Light Pink
  jewish_cemetery: { label: 'Cemeteries', dotColor: '#6B7280', icon: '🪦' }, // Gray
}

const HEX_SOURCE_ID = 'lr-hex'
const HEX_FILL_LAYER = 'lr-hex-fill'
const HEX_LINE_LAYER = 'lr-hex-line'
const MARKERS_SOURCE_ID = 'places-source'

export default function MapView() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const mapReady = useRef(false)
  const filtersDropdownRef = useRef(null)
  const placePopupRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState('')
  const [places, setPlaces] = useState([])
  const [activeFilters, setActiveFilters] = useState(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [noToken, setNoToken] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [filtersDropdownOpen, setFiltersDropdownOpen] = useState(false)

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
      center: [-118.25, 34.05],
      zoom: 8,
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
      // Start with visibility 'none' since heatmap is on by default
      map.current.addLayer({
        id: 'places-circles',
        type: 'circle',
        source: MARKERS_SOURCE_ID,
        layout: {
          'visibility': 'none',
        },
        paint: {
          'circle-color': [
            'match', ['get', 'category'],
            'synagogue', '#3B82F6',
            'kosher_restaurant', '#F59E0B',
            'kosher_grocery', '#22C55E',
            'jewish_school', '#EC4899',
            'community_center', '#8B5CF6',
            'jewish_jewelry', '#14B8A6',
            'high_end_store', '#E11D48',
            'bagel_shop', '#A855F7',
            'jewish_bakery', '#F472B6',
            'jewish_cemetery', '#6B7280',
            '#888888'
          ],
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 2, 8, 4, 12, 6],
          'circle-stroke-width': 0,
          'circle-stroke-color': 'transparent',
        },
      })

      // Place popup for markers
      placePopupRef.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        className: 'place-popup',
        maxWidth: '300px',
      })

      // Click handler for markers
      map.current.on('click', 'places-circles', (e) => {
        if (!e.features || e.features.length === 0) return
        const feature = e.features[0]
        const props = feature.properties
        const coordinates = feature.geometry.coordinates.slice()
        const cat = CATEGORIES[props.category] || {}

        const html = `
          <div class="place-popup-content">
            <div class="place-category-badge" style="background: ${cat.dotColor}">
              ${cat.icon || ''} ${cat.label || props.category}
            </div>
            <h3>${props.name}</h3>
            ${props.address ? `<p class="place-address">${props.address}</p>` : ''}
            ${props.phone ? `<p class="place-phone"><a href="tel:${props.phone}">${props.phone}</a></p>` : ''}
            ${props.website ? `<p class="place-website"><a href="${props.website}" target="_blank" rel="noopener">Visit Website</a></p>` : ''}
          </div>
        `

        placePopupRef.current
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(map.current)
      })

      map.current.on('mouseenter', 'places-circles', () => {
        map.current.getCanvas().style.cursor = 'pointer'
      })

      map.current.on('mouseleave', 'places-circles', () => {
        map.current.getCanvas().style.cursor = ''
      })

      // Hex hover popup (desktop)
      const hexHoverPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'hex-popup',
      })

      // Hex click popup (mobile - with close button)
      const hexClickPopup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        className: 'hex-popup hex-popup-mobile',
      })

      const getHexPopupHTML = (props) => {
        const score = props.score
        const label = props.label
        const labelInfo = LR_LABELS.find(lr => score >= lr.min && score <= lr.max) || LR_LABELS[0]

        // Parse categories and build list
        let categoriesHTML = ''
        try {
          const categories = JSON.parse(props.categories || '{}')
          const entries = Object.entries(categories).filter(([_, count]) => count > 0)
          if (entries.length > 0) {
            categoriesHTML = '<div class="hex-popup-categories">'
            for (const [catKey, count] of entries) {
              const cat = CATEGORIES[catKey] || { label: catKey, icon: '', dotColor: '#888' }
              categoriesHTML += `<div class="hex-popup-category-item"><span class="hex-cat-dot" style="background:${cat.dotColor}"></span><span class="hex-cat-label">${cat.label}</span><span class="hex-cat-count">${count}</span></div>`
            }
            categoriesHTML += '</div>'
          }
        } catch (e) {
          console.error('Failed to parse categories:', e)
        }

        return `<div class="hex-popup-inner"><div class="hex-popup-score">${score}<span>/100</span></div><div class="hex-popup-label" style="color:${labelInfo.color}">${label}</div>${categoriesHTML}</div>`
      }

      // Desktop: hover behavior
      map.current.on('mousemove', HEX_FILL_LAYER, (e) => {
        if (!e.features || e.features.length === 0) return
        map.current.getCanvas().style.cursor = 'pointer'
        const props = e.features[0].properties
        hexHoverPopup
          .setLngLat(e.lngLat)
          .setHTML(getHexPopupHTML(props))
          .addTo(map.current)
      })

      map.current.on('mouseleave', HEX_FILL_LAYER, () => {
        map.current.getCanvas().style.cursor = ''
        hexHoverPopup.remove()
      })

      // Mobile: click/tap behavior
      map.current.on('click', HEX_FILL_LAYER, (e) => {
        if (!e.features || e.features.length === 0) return
        const props = e.features[0].properties
        // Remove hover popup if visible
        hexHoverPopup.remove()
        // Show click popup at tap location
        hexClickPopup
          .setLngLat(e.lngLat)
          .setHTML(getHexPopupHTML(props))
          .addTo(map.current)
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
    if (!map.current) return

    const updateHeatmap = () => {
      const source = map.current?.getSource(HEX_SOURCE_ID)
      if (!source) {
        // Map not ready yet, try again
        if (filteredPlaces.length > 0 && showHeatmap) {
          setTimeout(updateHeatmap, 100)
        }
        return
      }

      if (!showHeatmap || filteredPlaces.length === 0) {
        source.setData({ type: 'FeatureCollection', features: [] })
        return
      }

      const geojson = computeHexScores(filteredPlaces)
      source.setData(geojson)
    }

    updateHeatmap()
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

  // Close filters dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filtersDropdownOpen && filtersDropdownRef.current && !filtersDropdownRef.current.contains(e.target)) {
        setFiltersDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [filtersDropdownOpen])

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

  // Count active filters for mobile badge
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

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

        {/* Mobile controls - LR Index + Filters dropdown + Search */}
        <div className="mobile-controls">
          <div className="mobile-controls-row">
            <button
              className={`mobile-lr-toggle ${showHeatmap ? 'active' : ''}`}
              onClick={() => setShowHeatmap(prev => !prev)}
            >
              <span>LR Index</span>
              <span className={`mobile-lr-indicator ${showHeatmap ? 'on' : ''}`}>
                {showHeatmap ? 'ON' : 'OFF'}
              </span>
            </button>
            <div className="mobile-filters-wrapper" ref={filtersDropdownRef}>
              <button
                className={`mobile-filters-toggle ${filtersDropdownOpen ? 'active' : ''}`}
                onClick={() => setFiltersDropdownOpen(prev => !prev)}
              >
                <span>Filters</span>
                <span className="mobile-filters-badge">{activeFilterCount}</span>
              </button>
              {/* Mobile filters dropdown - overlays on top */}
              {filtersDropdownOpen && (
                <div className="mobile-filters-dropdown">
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <button
                      key={key}
                      className={`mobile-filter-item ${activeFilters[key] ? 'active' : ''}`}
                      onClick={() => toggleFilter(key)}
                    >
                      <span className="mobile-filter-dot" style={{ background: activeFilters[key] ? cat.dotColor : 'rgba(255,255,255,0.2)' }} />
                      <span className="mobile-filter-label">{cat.label}</span>
                      <span className="mobile-filter-count">{categoryCounts[key]?.toLocaleString() || 0}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search city or zip..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit">Go</button>
          </form>
        </div>

        {/* Desktop search bar */}
        <div className="map-search-overlay desktop-only">
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

        {/* Desktop Sidebar */}
        <div className="map-sidebar desktop-only">
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


        {showHeatmap && <LRLegend />}
      </div>
    </section>
  )
}
