/**
 * Philippine public holidays — regular and special non-working days.
 * Used to skip non-working days when projecting the OJT estimated end date.
 *
 * Sources: Republic Act 9492 (holiday rationalization), annual presidential proclamations.
 * Eid al-Fitr and Eid al-Adha dates are approximate; official dates are declared yearly.
 */

const HOLIDAYS = new Set([

  // ════════════════════════════════════════════════════════════════
  //  2026
  // ════════════════════════════════════════════════════════════════

  // Regular Holidays
  '2026-01-01', // New Year's Day
  '2026-04-02', // Maundy Thursday
  '2026-04-03', // Good Friday
  '2026-04-09', // Araw ng Kagitingan (Day of Valor)
  '2026-05-01', // Labor Day
  '2026-06-12', // Independence Day
  '2026-08-31', // National Heroes Day (last Monday of August)
  '2026-11-30', // Bonifacio Day
  '2026-12-25', // Christmas Day
  '2026-12-30', // Rizal Day

  // Holy Week (special non-working)
  '2026-04-04', // Black Saturday

  // Special Non-Working Days
  '2026-01-02', // Special non-working day (post-New Year bridge)
  '2026-02-25', // EDSA People Power Revolution Anniversary
  '2026-08-21', // Ninoy Aquino Day
  '2026-11-01', // All Saints' Day
  '2026-11-02', // All Souls' Day
  '2026-12-08', // Feast of the Immaculate Conception
  '2026-12-24', // Christmas Eve
  '2026-12-31', // New Year's Eve

  // Eid holidays (approximate — officially declared each year)
  '2026-03-20', // Eid al-Fitr (approximate)
  '2026-05-27', // Eid al-Adha (approximate)

  // ════════════════════════════════════════════════════════════════
  //  2027
  // ════════════════════════════════════════════════════════════════

  // Regular Holidays
  '2027-01-01', // New Year's Day
  '2027-03-25', // Maundy Thursday
  '2027-03-26', // Good Friday
  '2027-04-09', // Araw ng Kagitingan (Day of Valor)
  '2027-05-01', // Labor Day
  '2027-06-12', // Independence Day
  '2027-08-30', // National Heroes Day (last Monday of August)
  '2027-11-30', // Bonifacio Day
  '2027-12-25', // Christmas Day
  '2027-12-30', // Rizal Day

  // Holy Week (special non-working)
  '2027-03-27', // Black Saturday

  // Special Non-Working Days
  '2027-02-25', // EDSA People Power Revolution Anniversary
  '2027-08-21', // Ninoy Aquino Day
  '2027-11-01', // All Saints' Day
  '2027-11-02', // All Souls' Day
  '2027-12-08', // Feast of the Immaculate Conception
  '2027-12-24', // Christmas Eve
  '2027-12-31', // New Year's Eve

  // Eid holidays (approximate — officially declared each year)
  '2027-03-09', // Eid al-Fitr (approximate)
  '2027-05-17', // Eid al-Adha (approximate)

])

export default HOLIDAYS
