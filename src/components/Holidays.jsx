import { useState } from 'react'

const HOLIDAYS = [
  {
    name: 'Rosh Hashanah',
    hebrew: 'ראש השנה',
    emoji: '🍎',
    color: '#E11D48',
    description: 'The Jewish New Year, celebrating creation and new beginnings. Marked by prayer, reflection, and the sounding of the shofar (ram\'s horn).',
    traditions: ['Sounding the shofar', 'Eating apples & honey', 'Tashlich ceremony'],
    month: 'Tishrei (Sept/Oct)',
  },
  {
    name: 'Yom Kippur',
    hebrew: 'יום כיפור',
    emoji: '🕊️',
    color: '#FFFFFF',
    description: 'The Day of Atonement, the holiest day of the year. A solemn day of fasting, prayer, and seeking forgiveness.',
    traditions: ['25-hour fast', 'Prayer services', 'Wearing white'],
    month: 'Tishrei (Sept/Oct)',
  },
  {
    name: 'Sukkot',
    hebrew: 'סוכות',
    emoji: '🌿',
    color: '#22C55E',
    description: 'The Feast of Tabernacles, commemorating the Israelites\' 40 years in the desert. People build and eat in temporary shelters called sukkahs.',
    traditions: ['Building a sukkah', 'Waving the lulav & etrog', 'Hosting guests'],
    month: 'Tishrei (Sept/Oct)',
  },
  {
    name: 'Simchat Torah',
    hebrew: 'שמחת תורה',
    emoji: '📜',
    color: '#8B5CF6',
    description: 'Celebrates completing and restarting the annual Torah reading cycle. A joyous celebration with dancing and singing.',
    traditions: ['Dancing with Torah scrolls', 'Completing Torah reading', 'Starting Genesis anew'],
    month: 'Tishrei (Sept/Oct)',
  },
  {
    name: 'Hanukkah',
    hebrew: 'חנוכה',
    emoji: '🕎',
    color: '#3B82F6',
    description: 'The Festival of Lights, celebrating the rededication of the Second Temple and the miracle of the oil lasting eight days.',
    traditions: ['Lighting the menorah', 'Playing dreidel', 'Eating latkes & sufganiyot'],
    month: 'Kislev (Nov/Dec)',
  },
  {
    name: 'Purim',
    hebrew: 'פורים',
    emoji: '🎭',
    color: '#EC4899',
    description: 'Celebrates the story of Esther saving the Jewish people in Persia. A festive day of joy and celebration.',
    traditions: ['Reading Megillat Esther', 'Wearing costumes', 'Giving mishloach manot'],
    month: 'Adar (Feb/Mar)',
  },
  {
    name: 'Passover',
    hebrew: 'פסח',
    emoji: '🍷',
    color: '#DC2626',
    description: 'Commemorates the Exodus from Egypt. A celebration of freedom and liberation from slavery.',
    traditions: ['Seder meal', 'Eating matzah', 'Four cups of wine'],
    month: 'Nisan (Mar/Apr)',
  },
  {
    name: 'Shavuot',
    hebrew: 'שבועות',
    emoji: '🧀',
    color: '#F59E0B',
    description: 'Celebrates receiving the Torah at Mount Sinai. A time of study and spiritual renewal.',
    traditions: ['All-night Torah study', 'Eating dairy foods', 'Reading Book of Ruth'],
    month: 'Sivan (May/Jun)',
  },
  {
    name: 'Tisha B\'Av',
    hebrew: 'תשעה באב',
    emoji: '🕯️',
    color: '#6B7280',
    description: 'A day of mourning for the destruction of the First and Second Temples in Jerusalem.',
    traditions: ['Fasting', 'Reading Lamentations', 'Sitting low'],
    month: 'Av (Jul/Aug)',
  },
  {
    name: 'Tu B\'Shevat',
    hebrew: 'ט״ו בשבט',
    emoji: '🌳',
    color: '#16A34A',
    description: 'The New Year for Trees, celebrating nature and the Land of Israel.',
    traditions: ['Planting trees', 'Eating fruits from Israel', 'Tu B\'Shevat seder'],
    month: 'Shevat (Jan/Feb)',
  },
]

export default function Holidays() {
  const [expandedHoliday, setExpandedHoliday] = useState(null)

  return (
    <section className="holidays-section">
      <div className="holidays-header">
        <h1>
          <span className="holidays-title-en">Jewish Holidays</span>
          <span className="holidays-title-he">חגים יהודיים</span>
        </h1>
        <p>Celebrating faith, freedom, and tradition throughout the year</p>
      </div>

      <div className="holidays-grid">
        {HOLIDAYS.map((holiday, index) => (
          <div
            key={holiday.name}
            className={`holiday-card ${expandedHoliday === index ? 'expanded' : ''}`}
            onClick={() => setExpandedHoliday(expandedHoliday === index ? null : index)}
            style={{ '--accent-color': holiday.color }}
          >
            <div className="holiday-card-header">
              <span className="holiday-emoji">{holiday.emoji}</span>
              <div className="holiday-names">
                <h2>{holiday.name}</h2>
                <span className="holiday-hebrew">{holiday.hebrew}</span>
              </div>
              <span className="holiday-expand-icon">{expandedHoliday === index ? '−' : '+'}</span>
            </div>

            <p className="holiday-description">{holiday.description}</p>

            {expandedHoliday === index && (
              <div className="holiday-details">
                <div className="holiday-month">
                  <span className="holiday-label">When:</span> {holiday.month}
                </div>
                <div className="holiday-traditions">
                  <span className="holiday-label">Traditions:</span>
                  <ul>
                    {holiday.traditions.map((tradition, i) => (
                      <li key={i}>{tradition}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="holiday-accent-bar" style={{ background: holiday.color }} />
          </div>
        ))}
      </div>

      <div className="holidays-footer">
        <p>
          Jewish holidays follow the Hebrew lunisolar calendar, so dates vary each year on the Gregorian calendar.
        </p>
      </div>
    </section>
  )
}
