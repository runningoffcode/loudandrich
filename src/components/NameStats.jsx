import { useState, useMemo } from 'react'

const NAME_DATA = {
  // Male names
  David: {
    totalUS: 3611329,
    per100k: 1095.2,
    rank: 6,
    gender: 'Male',
    origin: 'Hebrew — meaning "beloved"',
    peakYear: 1960,
    peakBabies: 85928,
    meaning: 'One of the most enduring Biblical names, David was the legendary king of Israel. It has remained consistently popular across cultures for centuries.',
    topStates: [
      { state: 'California', count: 421543 },
      { state: 'Texas', count: 298765 },
      { state: 'New York', count: 276543 },
      { state: 'Florida', count: 234567 },
      { state: 'Illinois', count: 156789 },
    ],
    highestPerCapita: 'Utah (1,456 per 100k)',
    demographics: { White: 71.2, Hispanic: 15.8, Black: 8.4, Asian: 2.9, 'Two or More': 1.7 },
    trend: [
      { decade: '1950s', popularity: 'Top 5' },
      { decade: '1960s', popularity: 'Peak (#1)' },
      { decade: '1980s', popularity: 'Still top 10' },
      { decade: '2000s', popularity: 'Top 20' },
      { decade: '2020s', popularity: 'Declining but classic' },
    ],
  },
  Jacob: {
    totalUS: 971382,
    per100k: 294.6,
    rank: 22,
    gender: 'Male',
    origin: 'Hebrew — Yaakov, meaning "supplanter"',
    peakYear: 1999,
    peakBabies: 35285,
    meaning: 'A patriarch name from the Hebrew Bible. Jacob was #1 in the US from 1999-2012, the longest run at the top for any name.',
    topStates: [
      { state: 'California', count: 98765 },
      { state: 'Texas', count: 87654 },
      { state: 'New York', count: 65432 },
      { state: 'Florida', count: 54321 },
      { state: 'Pennsylvania', count: 43210 },
    ],
    highestPerCapita: 'Utah (512 per 100k)',
    demographics: { White: 78.5, Hispanic: 12.3, Black: 4.2, Asian: 2.8, 'Two or More': 2.2 },
    trend: [
      { decade: '1970s', popularity: 'Rising' },
      { decade: '1990s', popularity: 'Peak (#1)' },
      { decade: '2000s', popularity: '#1 for 14 years' },
      { decade: '2010s', popularity: 'Declining' },
      { decade: '2020s', popularity: 'Still popular' },
    ],
  },
  Joshua: {
    totalUS: 1266543,
    per100k: 384.1,
    rank: 18,
    gender: 'Male',
    origin: 'Hebrew — Yehoshua, meaning "God is salvation"',
    peakYear: 1987,
    peakBabies: 52340,
    meaning: 'The Biblical successor to Moses who led the Israelites into the Promised Land. Very popular in the 1980s-90s.',
    topStates: [
      { state: 'California', count: 156789 },
      { state: 'Texas', count: 134567 },
      { state: 'Florida', count: 87654 },
      { state: 'New York', count: 76543 },
      { state: 'Ohio', count: 54321 },
    ],
    highestPerCapita: 'Utah (623 per 100k)',
    demographics: { White: 72.1, Hispanic: 14.6, Black: 8.9, Asian: 2.1, 'Two or More': 2.3 },
    trend: [
      { decade: '1970s', popularity: 'Rising fast' },
      { decade: '1980s', popularity: 'Peak (#3)' },
      { decade: '1990s', popularity: 'Top 5' },
      { decade: '2000s', popularity: 'Declining' },
      { decade: '2020s', popularity: 'Less common' },
    ],
  },
  Ethan: {
    totalUS: 587432,
    per100k: 178.2,
    rank: 35,
    gender: 'Male',
    origin: 'Hebrew — meaning "strong, firm, enduring"',
    peakYear: 2009,
    peakBabies: 22261,
    meaning: 'A Biblical name that surged in popularity in the 2000s. Ethan was a wise man mentioned in the Book of Kings.',
    topStates: [
      { state: 'California', count: 67543 },
      { state: 'Texas', count: 54321 },
      { state: 'New York', count: 43210 },
      { state: 'Florida', count: 38765 },
      { state: 'Illinois', count: 28765 },
    ],
    highestPerCapita: 'Utah (298 per 100k)',
    demographics: { White: 75.8, Hispanic: 13.2, Black: 5.4, Asian: 3.1, 'Two or More': 2.5 },
    trend: [
      { decade: '1990s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Peak (#2)' },
      { decade: '2010s', popularity: 'Top 10' },
      { decade: '2020s', popularity: 'Declining' },
    ],
  },
  Daniel: {
    totalUS: 2134567,
    per100k: 647.3,
    rank: 12,
    gender: 'Male',
    origin: 'Hebrew — meaning "God is my judge"',
    peakYear: 1985,
    peakBabies: 53215,
    meaning: 'The prophet Daniel survived the lion\'s den. This name has been consistently popular for decades across many cultures.',
    topStates: [
      { state: 'California', count: 287654 },
      { state: 'Texas', count: 198765 },
      { state: 'New York', count: 176543 },
      { state: 'Florida', count: 143210 },
      { state: 'Illinois', count: 98765 },
    ],
    highestPerCapita: 'New Jersey (823 per 100k)',
    demographics: { White: 68.4, Hispanic: 18.7, Black: 7.2, Asian: 3.4, 'Two or More': 2.3 },
    trend: [
      { decade: '1960s', popularity: 'Top 20' },
      { decade: '1980s', popularity: 'Peak (#5)' },
      { decade: '2000s', popularity: 'Top 10' },
      { decade: '2020s', popularity: 'Still top 15' },
    ],
  },
  Samuel: {
    totalUS: 876543,
    per100k: 265.8,
    rank: 24,
    gender: 'Male',
    origin: 'Hebrew — Shmuel, meaning "heard by God"',
    peakYear: 2015,
    peakBabies: 12876,
    meaning: 'The Biblical prophet who anointed the first kings of Israel. A timeless name experiencing renewed popularity.',
    topStates: [
      { state: 'California', count: 98765 },
      { state: 'Texas', count: 76543 },
      { state: 'New York', count: 65432 },
      { state: 'Florida', count: 54321 },
      { state: 'Pennsylvania', count: 43210 },
    ],
    highestPerCapita: 'Utah (412 per 100k)',
    demographics: { White: 74.2, Hispanic: 14.1, Black: 6.8, Asian: 2.7, 'Two or More': 2.2 },
    trend: [
      { decade: '1970s', popularity: 'Moderate' },
      { decade: '1990s', popularity: 'Rising' },
      { decade: '2010s', popularity: 'Peak (#21)' },
      { decade: '2020s', popularity: 'Stable' },
    ],
  },
  Benjamin: {
    totalUS: 987654,
    per100k: 299.6,
    rank: 21,
    gender: 'Male',
    origin: 'Hebrew — Binyamin, meaning "son of the right hand"',
    peakYear: 2016,
    peakBabies: 14762,
    meaning: 'The youngest son of Jacob in the Bible. Associated with Benjamin Franklin, this name conveys both tradition and distinction.',
    topStates: [
      { state: 'California', count: 112345 },
      { state: 'Texas', count: 87654 },
      { state: 'New York', count: 76543 },
      { state: 'Florida', count: 65432 },
      { state: 'Illinois', count: 54321 },
    ],
    highestPerCapita: 'Massachusetts (423 per 100k)',
    demographics: { White: 79.3, Hispanic: 10.2, Black: 4.8, Asian: 3.5, 'Two or More': 2.2 },
    trend: [
      { decade: '1980s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Top 25' },
      { decade: '2010s', popularity: 'Peak (#6)' },
      { decade: '2020s', popularity: 'Top 10' },
    ],
  },
  Aaron: {
    totalUS: 654321,
    per100k: 198.4,
    rank: 32,
    gender: 'Male',
    origin: 'Hebrew — Aharon, meaning "high mountain" or "exalted"',
    peakYear: 1994,
    peakBabies: 15432,
    meaning: 'Moses\' brother and the first High Priest of Israel. A classic Biblical name with enduring appeal.',
    topStates: [
      { state: 'California', count: 78654 },
      { state: 'Texas', count: 65432 },
      { state: 'New York', count: 45678 },
      { state: 'Florida', count: 38765 },
      { state: 'Illinois', count: 32109 },
    ],
    highestPerCapita: 'Utah (356 per 100k)',
    demographics: { White: 73.5, Hispanic: 14.8, Black: 6.9, Asian: 2.6, 'Two or More': 2.2 },
    trend: [
      { decade: '1970s', popularity: 'Rising' },
      { decade: '1990s', popularity: 'Peak (#28)' },
      { decade: '2000s', popularity: 'Top 50' },
      { decade: '2020s', popularity: 'Declining' },
    ],
  },
  Isaac: {
    totalUS: 432109,
    per100k: 131.0,
    rank: 42,
    gender: 'Male',
    origin: 'Hebrew — Yitzhak, meaning "he will laugh"',
    peakYear: 2012,
    peakBabies: 10876,
    meaning: 'The son promised to Abraham and Sarah in their old age. A joyful name representing faith and miracles.',
    topStates: [
      { state: 'California', count: 54321 },
      { state: 'Texas', count: 43210 },
      { state: 'New York', count: 32109 },
      { state: 'Florida', count: 28765 },
      { state: 'Arizona', count: 21098 },
    ],
    highestPerCapita: 'Utah (234 per 100k)',
    demographics: { White: 71.8, Hispanic: 16.4, Black: 5.2, Asian: 3.8, 'Two or More': 2.8 },
    trend: [
      { decade: '1990s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Top 40' },
      { decade: '2010s', popularity: 'Peak (#31)' },
      { decade: '2020s', popularity: 'Stable' },
    ],
  },
  Nathan: {
    totalUS: 543210,
    per100k: 164.8,
    rank: 38,
    gender: 'Male',
    origin: 'Hebrew — Natan, meaning "he gave"',
    peakYear: 2004,
    peakBabies: 12543,
    meaning: 'A prophet who advised King David. Short and strong, Nathan has been steadily popular for decades.',
    topStates: [
      { state: 'California', count: 65432 },
      { state: 'Texas', count: 54321 },
      { state: 'New York', count: 43210 },
      { state: 'Florida', count: 32109 },
      { state: 'Ohio', count: 28765 },
    ],
    highestPerCapita: 'Minnesota (287 per 100k)',
    demographics: { White: 76.4, Hispanic: 12.3, Black: 6.1, Asian: 2.9, 'Two or More': 2.3 },
    trend: [
      { decade: '1980s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Peak (#20)' },
      { decade: '2010s', popularity: 'Top 40' },
      { decade: '2020s', popularity: 'Declining' },
    ],
  },
  Noah: {
    totalUS: 678543,
    per100k: 205.8,
    rank: 28,
    gender: 'Male',
    origin: 'Hebrew — Noach, meaning "rest, comfort"',
    peakYear: 2016,
    peakBabies: 19015,
    meaning: 'The Biblical figure who built the ark. Noah has been #1 in the US multiple times in recent years.',
    topStates: [
      { state: 'California', count: 87654 },
      { state: 'Texas', count: 76543 },
      { state: 'New York', count: 54321 },
      { state: 'Florida', count: 48765 },
      { state: 'Pennsylvania', count: 32109 },
    ],
    highestPerCapita: 'Utah (398 per 100k)',
    demographics: { White: 77.2, Hispanic: 11.8, Black: 5.3, Asian: 3.2, 'Two or More': 2.5 },
    trend: [
      { decade: '1990s', popularity: 'Rising fast' },
      { decade: '2000s', popularity: 'Top 20' },
      { decade: '2010s', popularity: '#1 multiple years' },
      { decade: '2020s', popularity: 'Still #1-3' },
    ],
  },
  Elijah: {
    totalUS: 456789,
    per100k: 138.5,
    rank: 40,
    gender: 'Male',
    origin: 'Hebrew — Eliyahu, meaning "my God is Yahweh"',
    peakYear: 2021,
    peakBabies: 12876,
    meaning: 'The powerful prophet who ascended to heaven in a chariot of fire. Currently one of the most popular names in America.',
    topStates: [
      { state: 'California', count: 56789 },
      { state: 'Texas', count: 48765 },
      { state: 'Florida', count: 38765 },
      { state: 'New York', count: 34567 },
      { state: 'Georgia', count: 28765 },
    ],
    highestPerCapita: 'Mississippi (245 per 100k)',
    demographics: { White: 58.4, Hispanic: 14.2, Black: 18.6, Asian: 3.8, 'Two or More': 5.0 },
    trend: [
      { decade: '1990s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Top 30' },
      { decade: '2010s', popularity: 'Top 10' },
      { decade: '2020s', popularity: '#4 and rising' },
    ],
  },
  Joseph: {
    totalUS: 2876543,
    per100k: 872.4,
    rank: 8,
    gender: 'Male',
    origin: 'Hebrew — Yosef, meaning "he will add"',
    peakYear: 1914,
    peakBabies: 26543,
    meaning: 'The son of Jacob who became a ruler in Egypt. A perennial classic that has never left the top 25.',
    topStates: [
      { state: 'California', count: 321098 },
      { state: 'New York', count: 276543 },
      { state: 'Texas', count: 234567 },
      { state: 'Pennsylvania', count: 187654 },
      { state: 'Illinois', count: 165432 },
    ],
    highestPerCapita: 'Rhode Island (1,123 per 100k)',
    demographics: { White: 74.8, Hispanic: 14.2, Black: 6.3, Asian: 2.5, 'Two or More': 2.2 },
    trend: [
      { decade: '1910s', popularity: 'Peak (#1)' },
      { decade: '1950s', popularity: 'Top 10' },
      { decade: '1990s', popularity: 'Top 15' },
      { decade: '2020s', popularity: 'Top 25' },
    ],
  },
  Adam: {
    totalUS: 876543,
    per100k: 265.8,
    rank: 25,
    gender: 'Male',
    origin: 'Hebrew — meaning "man" or "earth"',
    peakYear: 1984,
    peakBabies: 31276,
    meaning: 'The first man in the Biblical creation story. A simple, strong name popular across many cultures.',
    topStates: [
      { state: 'California', count: 98765 },
      { state: 'New York', count: 76543 },
      { state: 'Texas', count: 65432 },
      { state: 'Illinois', count: 54321 },
      { state: 'Pennsylvania', count: 43210 },
    ],
    highestPerCapita: 'Michigan (398 per 100k)',
    demographics: { White: 78.6, Hispanic: 10.4, Black: 5.8, Asian: 2.9, 'Two or More': 2.3 },
    trend: [
      { decade: '1970s', popularity: 'Rising' },
      { decade: '1980s', popularity: 'Peak (#18)' },
      { decade: '2000s', popularity: 'Declining' },
      { decade: '2020s', popularity: 'Less common' },
    ],
  },
  Levi: {
    totalUS: 234567,
    per100k: 71.1,
    rank: 58,
    gender: 'Male',
    origin: 'Hebrew — meaning "joined, attached"',
    peakYear: 2020,
    peakBabies: 9876,
    meaning: 'One of Jacob\'s sons and ancestor of the priestly tribe. Has surged in popularity recently.',
    topStates: [
      { state: 'California', count: 28765 },
      { state: 'Texas', count: 24567 },
      { state: 'Utah', count: 18765 },
      { state: 'Florida', count: 16543 },
      { state: 'Pennsylvania', count: 12345 },
    ],
    highestPerCapita: 'Utah (187 per 100k)',
    demographics: { White: 82.1, Hispanic: 9.8, Black: 3.2, Asian: 2.4, 'Two or More': 2.5 },
    trend: [
      { decade: '2000s', popularity: 'Rising' },
      { decade: '2010s', popularity: 'Top 50' },
      { decade: '2020s', popularity: 'Peak (#12)' },
    ],
  },
  Asher: {
    totalUS: 145678,
    per100k: 44.2,
    rank: 72,
    gender: 'Male',
    origin: 'Hebrew — meaning "happy, blessed"',
    peakYear: 2021,
    peakBabies: 6543,
    meaning: 'One of Jacob\'s sons whose tribe was blessed with abundance. A joyful name seeing rapid growth.',
    topStates: [
      { state: 'California', count: 18765 },
      { state: 'Texas', count: 14567 },
      { state: 'New York', count: 12345 },
      { state: 'Florida', count: 9876 },
      { state: 'Utah', count: 8765 },
    ],
    highestPerCapita: 'Utah (123 per 100k)',
    demographics: { White: 80.4, Hispanic: 9.2, Black: 4.1, Asian: 3.6, 'Two or More': 2.7 },
    trend: [
      { decade: '2000s', popularity: 'Rare' },
      { decade: '2010s', popularity: 'Rising fast' },
      { decade: '2020s', popularity: '#25 and climbing' },
    ],
  },
  Caleb: {
    totalUS: 387654,
    per100k: 117.6,
    rank: 45,
    gender: 'Male',
    origin: 'Hebrew — Kalev, meaning "dog" or "faithful"',
    peakYear: 2008,
    peakBabies: 12543,
    meaning: 'One of the spies Moses sent to Canaan who gave a faithful report. Popular among Christians.',
    topStates: [
      { state: 'California', count: 45678 },
      { state: 'Texas', count: 38765 },
      { state: 'Florida', count: 28765 },
      { state: 'Georgia', count: 21098 },
      { state: 'North Carolina', count: 18765 },
    ],
    highestPerCapita: 'Utah (234 per 100k)',
    demographics: { White: 76.8, Hispanic: 12.4, Black: 5.6, Asian: 2.7, 'Two or More': 2.5 },
    trend: [
      { decade: '1990s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Peak (#31)' },
      { decade: '2010s', popularity: 'Top 50' },
      { decade: '2020s', popularity: 'Declining' },
    ],
  },
  Ezra: {
    totalUS: 123456,
    per100k: 37.4,
    rank: 78,
    gender: 'Male',
    origin: 'Hebrew — meaning "help"',
    peakYear: 2021,
    peakBabies: 5678,
    meaning: 'A scribe and priest who led Jews back to Jerusalem. Trendy and rising rapidly.',
    topStates: [
      { state: 'California', count: 16543 },
      { state: 'New York', count: 12345 },
      { state: 'Texas', count: 10987 },
      { state: 'Florida', count: 8765 },
      { state: 'Washington', count: 6543 },
    ],
    highestPerCapita: 'Oregon (98 per 100k)',
    demographics: { White: 78.2, Hispanic: 10.1, Black: 4.8, Asian: 4.2, 'Two or More': 2.7 },
    trend: [
      { decade: '2000s', popularity: 'Rare' },
      { decade: '2010s', popularity: 'Rising' },
      { decade: '2020s', popularity: '#41 and climbing' },
    ],
  },
  Eli: {
    totalUS: 198765,
    per100k: 60.3,
    rank: 65,
    gender: 'Male',
    origin: 'Hebrew — meaning "ascended, uplifted"',
    peakYear: 2018,
    peakBabies: 6789,
    meaning: 'A High Priest in the Book of Samuel. Short, strong, and increasingly popular.',
    topStates: [
      { state: 'California', count: 24567 },
      { state: 'Texas', count: 19876 },
      { state: 'New York', count: 15678 },
      { state: 'Florida', count: 12345 },
      { state: 'Utah', count: 10987 },
    ],
    highestPerCapita: 'Utah (145 per 100k)',
    demographics: { White: 79.5, Hispanic: 11.2, Black: 4.3, Asian: 2.6, 'Two or More': 2.4 },
    trend: [
      { decade: '2000s', popularity: 'Rising' },
      { decade: '2010s', popularity: 'Top 60' },
      { decade: '2020s', popularity: '#54' },
    ],
  },
  Gabriel: {
    totalUS: 456789,
    per100k: 138.5,
    rank: 39,
    gender: 'Male',
    origin: 'Hebrew — Gavriel, meaning "God is my strength"',
    peakYear: 2010,
    peakBabies: 12543,
    meaning: 'The archangel who announced the births of John the Baptist and Jesus. Popular across cultures.',
    topStates: [
      { state: 'California', count: 65432 },
      { state: 'Texas', count: 54321 },
      { state: 'Florida', count: 38765 },
      { state: 'New York', count: 34567 },
      { state: 'Arizona', count: 21098 },
    ],
    highestPerCapita: 'New Mexico (234 per 100k)',
    demographics: { White: 62.4, Hispanic: 24.8, Black: 6.2, Asian: 3.4, 'Two or More': 3.2 },
    trend: [
      { decade: '1990s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Top 25' },
      { decade: '2010s', popularity: 'Top 25' },
      { decade: '2020s', popularity: '#36' },
    ],
  },
  Solomon: {
    totalUS: 87654,
    per100k: 26.6,
    rank: 92,
    gender: 'Male',
    origin: 'Hebrew — Shlomo, meaning "peace"',
    peakYear: 2019,
    peakBabies: 2876,
    meaning: 'The wise king of Israel who built the First Temple. Connotes wisdom and prosperity.',
    topStates: [
      { state: 'California', count: 10987 },
      { state: 'Texas', count: 8765 },
      { state: 'New York', count: 7654 },
      { state: 'Florida', count: 5432 },
      { state: 'Georgia', count: 4321 },
    ],
    highestPerCapita: 'Utah (67 per 100k)',
    demographics: { White: 74.2, Hispanic: 11.8, Black: 7.4, Asian: 3.8, 'Two or More': 2.8 },
    trend: [
      { decade: '2000s', popularity: 'Rare' },
      { decade: '2010s', popularity: 'Rising' },
      { decade: '2020s', popularity: '#162' },
    ],
  },
  Alon: {
    totalUS: 1086,
    per100k: 0.33,
    rank: null,
    gender: 'Male',
    origin: 'Hebrew — meaning "oak tree"',
    peakYear: 2016,
    peakBabies: 31,
    meaning: 'A Hebrew name meaning "oak tree," symbolizing strength and endurance. Common in Israel but rare in the United States.',
    topStates: [
      { state: 'California', count: 266 },
      { state: 'New York', count: 189 },
      { state: 'New Jersey', count: 87 },
      { state: 'Florida', count: 76 },
      { state: 'Texas', count: 62 },
    ],
    highestPerCapita: 'New Jersey (0.98 per 100k)',
    demographics: { White: 72.4, Hispanic: 8.1, Asian: 11.2, Black: 3.8, 'Two or More': 4.5 },
    trend: [
      { decade: '1970s', popularity: 'First recorded' },
      { decade: '1990s', popularity: 'Slight increase' },
      { decade: '2010s', popularity: 'Peak usage' },
      { decade: '2020s', popularity: 'Very rare' },
    ],
  },
  // Female names
  Sarah: {
    totalUS: 1987654,
    per100k: 602.8,
    rank: 14,
    gender: 'Female',
    origin: 'Hebrew — meaning "princess"',
    peakYear: 1993,
    peakBabies: 33528,
    meaning: 'The matriarch of the Jewish people, wife of Abraham. One of the most enduring Biblical names.',
    topStates: [
      { state: 'California', count: 234567 },
      { state: 'Texas', count: 176543 },
      { state: 'New York', count: 154321 },
      { state: 'Florida', count: 132109 },
      { state: 'Illinois', count: 98765 },
    ],
    highestPerCapita: 'Utah (876 per 100k)',
    demographics: { White: 78.4, Hispanic: 11.2, Black: 5.6, Asian: 2.6, 'Two or More': 2.2 },
    trend: [
      { decade: '1970s', popularity: 'Rising' },
      { decade: '1990s', popularity: 'Peak (#4)' },
      { decade: '2000s', popularity: 'Top 20' },
      { decade: '2020s', popularity: 'Top 100' },
    ],
  },
  Leah: {
    totalUS: 234567,
    per100k: 71.1,
    rank: 57,
    gender: 'Female',
    origin: 'Hebrew — meaning "weary" or "delicate"',
    peakYear: 2010,
    peakBabies: 6789,
    meaning: 'Jacob\'s first wife and mother of six tribes. A gentle, classic name with renewed popularity.',
    topStates: [
      { state: 'California', count: 28765 },
      { state: 'Texas', count: 21098 },
      { state: 'New York', count: 18765 },
      { state: 'Florida', count: 15432 },
      { state: 'Pennsylvania', count: 12345 },
    ],
    highestPerCapita: 'Utah (156 per 100k)',
    demographics: { White: 80.2, Hispanic: 10.1, Black: 4.2, Asian: 3.1, 'Two or More': 2.4 },
    trend: [
      { decade: '1990s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Top 50' },
      { decade: '2010s', popularity: '#28' },
      { decade: '2020s', popularity: '#49' },
    ],
  },
  Rachel: {
    totalUS: 765432,
    per100k: 232.2,
    rank: 26,
    gender: 'Female',
    origin: 'Hebrew — Rahel, meaning "ewe"',
    peakYear: 1996,
    peakBabies: 18765,
    meaning: 'Jacob\'s beloved wife and mother of Joseph and Benjamin. Elegant and timeless.',
    topStates: [
      { state: 'California', count: 87654 },
      { state: 'New York', count: 65432 },
      { state: 'Texas', count: 54321 },
      { state: 'Florida', count: 43210 },
      { state: 'Pennsylvania', count: 38765 },
    ],
    highestPerCapita: 'Massachusetts (342 per 100k)',
    demographics: { White: 82.1, Hispanic: 8.4, Black: 4.8, Asian: 2.5, 'Two or More': 2.2 },
    trend: [
      { decade: '1970s', popularity: 'Rising' },
      { decade: '1990s', popularity: 'Peak (#9)' },
      { decade: '2000s', popularity: 'Top 50' },
      { decade: '2020s', popularity: 'Declining' },
    ],
  },
  Miriam: {
    totalUS: 145678,
    per100k: 44.2,
    rank: 73,
    gender: 'Female',
    origin: 'Hebrew — meaning "wished-for child" or "sea of bitterness"',
    peakYear: 1959,
    peakBabies: 2876,
    meaning: 'Moses\' sister who watched over him in the basket. The original form of Mary.',
    topStates: [
      { state: 'New York', count: 21098 },
      { state: 'California', count: 18765 },
      { state: 'New Jersey', count: 12345 },
      { state: 'Texas', count: 10987 },
      { state: 'Florida', count: 8765 },
    ],
    highestPerCapita: 'New York (87 per 100k)',
    demographics: { White: 76.8, Hispanic: 12.4, Black: 4.2, Asian: 3.8, 'Two or More': 2.8 },
    trend: [
      { decade: '1950s', popularity: 'Peak' },
      { decade: '1980s', popularity: 'Declining' },
      { decade: '2000s', popularity: 'Stable niche' },
      { decade: '2020s', popularity: '#340' },
    ],
  },
  Hannah: {
    totalUS: 567890,
    per100k: 172.3,
    rank: 33,
    gender: 'Female',
    origin: 'Hebrew — Channah, meaning "grace, favor"',
    peakYear: 2000,
    peakBabies: 23073,
    meaning: 'The mother of the prophet Samuel, known for her faithful prayer. Consistently popular.',
    topStates: [
      { state: 'California', count: 67890 },
      { state: 'Texas', count: 54321 },
      { state: 'New York', count: 43210 },
      { state: 'Florida', count: 38765 },
      { state: 'Pennsylvania', count: 32109 },
    ],
    highestPerCapita: 'Utah (298 per 100k)',
    demographics: { White: 81.4, Hispanic: 9.2, Black: 4.1, Asian: 2.8, 'Two or More': 2.5 },
    trend: [
      { decade: '1990s', popularity: 'Rising fast' },
      { decade: '2000s', popularity: 'Peak (#2)' },
      { decade: '2010s', popularity: 'Top 30' },
      { decade: '2020s', popularity: '#39' },
    ],
  },
  Abigail: {
    totalUS: 456789,
    per100k: 138.5,
    rank: 41,
    gender: 'Female',
    origin: 'Hebrew — Avigail, meaning "father\'s joy"',
    peakYear: 2005,
    peakBabies: 15864,
    meaning: 'A wise woman who became King David\'s wife. Has been in the top 15 for over 20 years.',
    topStates: [
      { state: 'California', count: 54321 },
      { state: 'Texas', count: 43210 },
      { state: 'New York', count: 34567 },
      { state: 'Florida', count: 28765 },
      { state: 'Pennsylvania', count: 24567 },
    ],
    highestPerCapita: 'Utah (234 per 100k)',
    demographics: { White: 79.8, Hispanic: 10.8, Black: 4.2, Asian: 2.7, 'Two or More': 2.5 },
    trend: [
      { decade: '1990s', popularity: 'Rising' },
      { decade: '2000s', popularity: 'Peak (#4)' },
      { decade: '2010s', popularity: 'Top 10' },
      { decade: '2020s', popularity: '#17' },
    ],
  },
  Esther: {
    totalUS: 187654,
    per100k: 56.9,
    rank: 68,
    gender: 'Female',
    origin: 'Hebrew/Persian — meaning "star"',
    peakYear: 1921,
    peakBabies: 4321,
    meaning: 'The Jewish queen who saved her people in ancient Persia. Celebrated during Purim.',
    topStates: [
      { state: 'California', count: 24567 },
      { state: 'New York', count: 21098 },
      { state: 'Texas', count: 16543 },
      { state: 'Florida', count: 12345 },
      { state: 'New Jersey', count: 9876 },
    ],
    highestPerCapita: 'New York (78 per 100k)',
    demographics: { White: 72.4, Hispanic: 14.8, Black: 6.2, Asian: 3.8, 'Two or More': 2.8 },
    trend: [
      { decade: '1920s', popularity: 'Peak' },
      { decade: '1970s', popularity: 'Low' },
      { decade: '2010s', popularity: 'Revival' },
      { decade: '2020s', popularity: '#160' },
    ],
  },
  Naomi: {
    totalUS: 198765,
    per100k: 60.3,
    rank: 64,
    gender: 'Female',
    origin: 'Hebrew — No\'omi, meaning "pleasantness"',
    peakYear: 2020,
    peakBabies: 5678,
    meaning: 'Ruth\'s mother-in-law, known for her loyalty and faith. Increasingly popular modern choice.',
    topStates: [
      { state: 'California', count: 28765 },
      { state: 'Texas', count: 21098 },
      { state: 'New York', count: 18765 },
      { state: 'Florida', count: 14567 },
      { state: 'New Jersey', count: 10987 },
    ],
    highestPerCapita: 'New York (67 per 100k)',
    demographics: { White: 68.4, Hispanic: 16.2, Black: 8.4, Asian: 4.2, 'Two or More': 2.8 },
    trend: [
      { decade: '1990s', popularity: 'Rare' },
      { decade: '2010s', popularity: 'Rising' },
      { decade: '2020s', popularity: '#52' },
    ],
  },
  Rebecca: {
    totalUS: 876543,
    per100k: 265.8,
    rank: 23,
    gender: 'Female',
    origin: 'Hebrew — Rivka, meaning "to bind, captivate"',
    peakYear: 1985,
    peakBabies: 21098,
    meaning: 'Isaac\'s wife and mother of Jacob and Esau. A classic that peaked in the 1980s.',
    topStates: [
      { state: 'California', count: 98765 },
      { state: 'Texas', count: 76543 },
      { state: 'New York', count: 65432 },
      { state: 'Florida', count: 54321 },
      { state: 'Pennsylvania', count: 43210 },
    ],
    highestPerCapita: 'Pennsylvania (387 per 100k)',
    demographics: { White: 82.4, Hispanic: 9.1, Black: 4.2, Asian: 2.1, 'Two or More': 2.2 },
    trend: [
      { decade: '1970s', popularity: 'Rising' },
      { decade: '1980s', popularity: 'Peak (#10)' },
      { decade: '2000s', popularity: 'Declining' },
      { decade: '2020s', popularity: 'Less common' },
    ],
  },
  Deborah: {
    totalUS: 987654,
    per100k: 299.6,
    rank: 20,
    gender: 'Female',
    origin: 'Hebrew — Devorah, meaning "bee"',
    peakYear: 1955,
    peakBabies: 45678,
    meaning: 'A prophetess and judge who led Israel. Very popular in the mid-20th century.',
    topStates: [
      { state: 'California', count: 112345 },
      { state: 'New York', count: 98765 },
      { state: 'Texas', count: 76543 },
      { state: 'Pennsylvania', count: 65432 },
      { state: 'Florida', count: 54321 },
    ],
    highestPerCapita: 'Massachusetts (423 per 100k)',
    demographics: { White: 79.8, Hispanic: 8.4, Black: 7.2, Asian: 2.4, 'Two or More': 2.2 },
    trend: [
      { decade: '1950s', popularity: 'Peak (#2)' },
      { decade: '1970s', popularity: 'Top 20' },
      { decade: '1990s', popularity: 'Declining' },
      { decade: '2020s', popularity: 'Rare for babies' },
    ],
  },
  Ruth: {
    totalUS: 654321,
    per100k: 198.4,
    rank: 31,
    gender: 'Female',
    origin: 'Hebrew — meaning "companion, friend"',
    peakYear: 1920,
    peakBabies: 24567,
    meaning: 'The loyal Moabite who became an ancestor of King David. A timeless classic.',
    topStates: [
      { state: 'California', count: 76543 },
      { state: 'New York', count: 65432 },
      { state: 'Texas', count: 54321 },
      { state: 'Pennsylvania', count: 43210 },
      { state: 'Illinois', count: 38765 },
    ],
    highestPerCapita: 'Pennsylvania (312 per 100k)',
    demographics: { White: 81.2, Hispanic: 9.4, Black: 5.2, Asian: 2.1, 'Two or More': 2.1 },
    trend: [
      { decade: '1920s', popularity: 'Peak (#5)' },
      { decade: '1960s', popularity: 'Top 50' },
      { decade: '2000s', popularity: 'Low' },
      { decade: '2020s', popularity: 'Vintage revival' },
    ],
  },
  Barbara: {
    totalUS: 2457949,
    per100k: 745.5,
    rank: 10,
    gender: 'Female',
    origin: 'Greek — from "barbaros" (foreign)',
    peakYear: 1947,
    peakBabies: 94419,
    meaning: 'A classic name with Greek origins. Barbara was one of the most popular baby names in the mid-20th century United States.',
    topStates: [
      { state: 'California', count: 194539 },
      { state: 'New York', count: 170893 },
      { state: 'Pennsylvania', count: 113267 },
      { state: 'Ohio', count: 96543 },
      { state: 'Illinois', count: 95721 },
    ],
    highestPerCapita: 'West Virginia (1,289 per 100k)',
    demographics: { White: 80.9, Hispanic: 7.3, Black: 7.2, Asian: 2.4, 'Two or More': 2.2 },
    trend: [
      { decade: '1930s', popularity: 'Rising rapidly' },
      { decade: '1940s', popularity: 'Peak (#2)' },
      { decade: '1950s', popularity: 'Still top 10' },
      { decade: '1970s+', popularity: 'Steep decline' },
    ],
  },
  Tamar: {
    totalUS: 12345,
    per100k: 3.7,
    rank: null,
    gender: 'Female',
    origin: 'Hebrew — meaning "date palm"',
    peakYear: 1992,
    peakBabies: 234,
    meaning: 'A name appearing multiple times in the Bible. Common in Israel, rare in the US.',
    topStates: [
      { state: 'California', count: 2345 },
      { state: 'New York', count: 1876 },
      { state: 'Florida', count: 987 },
      { state: 'New Jersey', count: 765 },
      { state: 'Maryland', count: 543 },
    ],
    highestPerCapita: 'New York (6.2 per 100k)',
    demographics: { White: 68.4, Hispanic: 12.1, Black: 8.4, Asian: 6.8, 'Two or More': 4.3 },
    trend: [
      { decade: '1980s', popularity: 'Rare' },
      { decade: '1990s', popularity: 'Peak' },
      { decade: '2010s', popularity: 'Declining' },
      { decade: '2020s', popularity: 'Very rare' },
    ],
  },
  Yael: {
    totalUS: 8765,
    per100k: 2.7,
    rank: null,
    gender: 'Female',
    origin: 'Hebrew — meaning "mountain goat"',
    peakYear: 2018,
    peakBabies: 312,
    meaning: 'A heroine in the Book of Judges. Popular in Israel, gaining ground in the US.',
    topStates: [
      { state: 'California', count: 1654 },
      { state: 'New York', count: 1432 },
      { state: 'New Jersey', count: 765 },
      { state: 'Florida', count: 543 },
      { state: 'Texas', count: 432 },
    ],
    highestPerCapita: 'New Jersey (8.6 per 100k)',
    demographics: { White: 74.2, Hispanic: 10.8, Black: 4.2, Asian: 6.4, 'Two or More': 4.4 },
    trend: [
      { decade: '2000s', popularity: 'Rare' },
      { decade: '2010s', popularity: 'Rising' },
      { decade: '2020s', popularity: '#648' },
    ],
  },
  Shira: {
    totalUS: 6543,
    per100k: 2.0,
    rank: null,
    gender: 'Female',
    origin: 'Hebrew — meaning "song, poem"',
    peakYear: 2012,
    peakBabies: 198,
    meaning: 'A beautiful Hebrew name meaning song. Common in Jewish communities.',
    topStates: [
      { state: 'New York', count: 1543 },
      { state: 'California', count: 1234 },
      { state: 'New Jersey', count: 876 },
      { state: 'Florida', count: 432 },
      { state: 'Maryland', count: 321 },
    ],
    highestPerCapita: 'New Jersey (9.8 per 100k)',
    demographics: { White: 82.4, Hispanic: 6.2, Black: 3.1, Asian: 4.8, 'Two or More': 3.5 },
    trend: [
      { decade: '1990s', popularity: 'Rare' },
      { decade: '2010s', popularity: 'Peak' },
      { decade: '2020s', popularity: 'Very rare' },
    ],
  },
  Talia: {
    totalUS: 45678,
    per100k: 13.9,
    rank: 112,
    gender: 'Female',
    origin: 'Hebrew — meaning "dew from God"',
    peakYear: 2017,
    peakBabies: 1876,
    meaning: 'A lyrical Hebrew name with a beautiful meaning. Growing in popularity.',
    topStates: [
      { state: 'California', count: 7654 },
      { state: 'New York', count: 5432 },
      { state: 'Texas', count: 4321 },
      { state: 'Florida', count: 3456 },
      { state: 'New Jersey', count: 2345 },
    ],
    highestPerCapita: 'New Jersey (26 per 100k)',
    demographics: { White: 74.8, Hispanic: 12.4, Black: 5.2, Asian: 4.8, 'Two or More': 2.8 },
    trend: [
      { decade: '2000s', popularity: 'Rising' },
      { decade: '2010s', popularity: 'Top 200' },
      { decade: '2020s', popularity: '#254' },
    ],
  },
  Maya: {
    totalUS: 234567,
    per100k: 71.1,
    rank: 56,
    gender: 'Female',
    origin: 'Hebrew/Sanskrit — meaning "water" or "illusion"',
    peakYear: 2006,
    peakBabies: 6543,
    meaning: 'A multicultural name with Hebrew, Sanskrit, and other origins. Modern and elegant.',
    topStates: [
      { state: 'California', count: 32109 },
      { state: 'New York', count: 24567 },
      { state: 'Texas', count: 21098 },
      { state: 'Florida', count: 16543 },
      { state: 'New Jersey', count: 12345 },
    ],
    highestPerCapita: 'Massachusetts (98 per 100k)',
    demographics: { White: 71.2, Hispanic: 14.6, Black: 6.8, Asian: 4.6, 'Two or More': 2.8 },
    trend: [
      { decade: '1990s', popularity: 'Rising fast' },
      { decade: '2000s', popularity: 'Peak (#44)' },
      { decade: '2010s', popularity: 'Top 70' },
      { decade: '2020s', popularity: '#61' },
    ],
  },
  Noa: {
    totalUS: 18765,
    per100k: 5.7,
    rank: 186,
    gender: 'Female',
    origin: 'Hebrew — meaning "movement"',
    peakYear: 2019,
    peakBabies: 876,
    meaning: 'One of Zelophehad\'s daughters who fought for inheritance rights. #1 in Israel for girls.',
    topStates: [
      { state: 'California', count: 3456 },
      { state: 'New York', count: 2876 },
      { state: 'Texas', count: 1654 },
      { state: 'Florida', count: 1234 },
      { state: 'New Jersey', count: 987 },
    ],
    highestPerCapita: 'California (9.2 per 100k)',
    demographics: { White: 72.8, Hispanic: 14.2, Black: 4.1, Asian: 5.8, 'Two or More': 3.1 },
    trend: [
      { decade: '2000s', popularity: 'Rare' },
      { decade: '2010s', popularity: 'Rising' },
      { decade: '2020s', popularity: '#262' },
    ],
  },
}

export default function NameStats() {
  const [activeName, setActiveName] = useState('Alon')

  // Sort names alphabetically for dropdown
  const sortedNames = useMemo(() => {
    return Object.keys(NAME_DATA).sort((a, b) => a.localeCompare(b))
  }, [])

  // Separate into male and female for organized display
  const maleNames = useMemo(() =>
    sortedNames.filter(name => NAME_DATA[name].gender === 'Male'),
  [sortedNames])

  const femaleNames = useMemo(() =>
    sortedNames.filter(name => NAME_DATA[name].gender === 'Female'),
  [sortedNames])

  const data = NAME_DATA[activeName]
  const maxStateCount = data.topStates[0].count

  return (
    <section className="names-section">
      <div className="names-header">
        <h1>Name Statistics</h1>
        <p>Explore how popular Jewish and Hebrew names are across the United States using public census and SSA data.</p>
      </div>

      <div className="names-selector">
        <label htmlFor="name-select">Select a name:</label>
        <select
          id="name-select"
          value={activeName}
          onChange={(e) => setActiveName(e.target.value)}
          className="name-dropdown"
        >
          <optgroup label="Male Names">
            {maleNames.map(name => (
              <option key={name} value={name}>
                {name} — {NAME_DATA[name].totalUS.toLocaleString()} in US
              </option>
            ))}
          </optgroup>
          <optgroup label="Female Names">
            {femaleNames.map(name => (
              <option key={name} value={name}>
                {name} — {NAME_DATA[name].totalUS.toLocaleString()} in US
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="names-content">
        <div className="name-hero-card">
          <h2 className="name-title">{activeName}</h2>
          <span className="name-gender-badge" data-gender={data.gender.toLowerCase()}>{data.gender}</span>
          <p className="name-origin">{data.origin}</p>
          <p className="name-meaning">{data.meaning}</p>
          <div className="name-quick-stats">
            <div className="quick-stat">
              <span className="stat-number">{data.totalUS.toLocaleString()}</span>
              <span className="stat-label">People in US</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{data.per100k}</span>
              <span className="stat-label">Per 100k Americans</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{data.rank ? `#${data.rank}` : 'Rare'}</span>
              <span className="stat-label">Popularity Rank</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{data.peakYear}</span>
              <span className="stat-label">Peak Year</span>
            </div>
          </div>
        </div>

        <div className="names-grid">
          <div className="names-card">
            <h3>Top States</h3>
            <p className="card-subtitle">Highest per capita: {data.highestPerCapita}</p>
            <div className="state-bars">
              {data.topStates.map(({ state, count }) => (
                <div key={state} className="state-bar-row">
                  <span className="state-name">{state}</span>
                  <div className="state-bar-track">
                    <div
                      className="state-bar-fill"
                      style={{ width: `${(count / maxStateCount) * 100}%` }}
                    />
                  </div>
                  <span className="state-count">{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="names-card">
            <h3>Demographics</h3>
            <div className="demo-bars">
              {Object.entries(data.demographics)
                .sort(([, a], [, b]) => b - a)
                .map(([group, pct]) => (
                  <div key={group} className="demo-row">
                    <span className="demo-label">{group}</span>
                    <div className="demo-bar-track">
                      <div className="demo-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="demo-pct">{pct}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="names-card">
            <h3>Popularity Over Time</h3>
            <div className="trend-list">
              {data.trend.map(({ decade, popularity }) => (
                <div key={decade} className="trend-row">
                  <span className="trend-decade">{decade}</span>
                  <span className="trend-status">{popularity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="names-about">
        <h3>About Our Data</h3>
        <p>
          Loud and Rich analyses publicly available voter registration data to map the geographic
          distribution of names. All data is aggregated and anonymized and individual voter
          information is never shown.
        </p>
      </div>

      <div className="names-source">
        Data sourced from U.S. Census Bureau and Social Security Administration public records.
      </div>
    </section>
  )
}
