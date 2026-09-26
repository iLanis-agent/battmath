/* BattMath engine - honest battery math. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BattMath = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  var CELLS = {
    alkaline: { name: 'Alkaline', costEach: 0.50, cycles: 1, note: 'the disposable default' },
    nimh:     { name: 'NiMH rechargeable (LSD)', costEach: 2.50, cycles: 500, note: 'the workhorse' },
    lithium:  { name: 'Lithium AA', costEach: 1.50, cycles: 1, note: 'the cold-weather specialist' }
  };

  var DEVICES = {
    remote:   { name: 'TV remote', cells: 2, daysPerSet: 540, drain: 'low' },
    clock:    { name: 'Wall clock', cells: 1, daysPerSet: 365, drain: 'low' },
    mouse:    { name: 'Wireless mouse', cells: 1, daysPerSet: 90, drain: 'low' },
    toy:      { name: "Kid's motorized toy", cells: 4, daysPerSet: 21, drain: 'high' },
    camera:   { name: 'Camera flash', cells: 4, daysPerSet: 14, drain: 'high' },
    xbox:     { name: 'Game controller', cells: 2, daysPerSet: 30, drain: 'medium' },
    smoke:    { name: 'Smoke detector', cells: 1, daysPerSet: 365, drain: 'critical' }
  };

  function setsPerYear(daysPerSet) {
    if (daysPerSet <= 0) return 0;
    return Math.round(365 / daysPerSet * 100) / 100;
  }

  // Alkaline honesty: at high drain, an alkaline delivers roughly 40% of its rated energy - the rating assumes a clock, not a motor.
  function effectiveAlkalineSets(daysPerSet, drain) {
    var sets = setsPerYear(daysPerSet);
    if (drain === 'high') return Math.round(sets / 0.4 * 100) / 100; // you buy more because each does less
    return sets;
  }

  // Annual cost for one device on one chemistry.
  function annualCost(cellId, device, chargerAmortPerYear) {
    var cell = CELLS[cellId];
    var sets = effectiveAlkalineSets(device.daysPerSet, device.drain);
    if (cellId === 'nimh') {
      var perUse = cell.costEach * device.cells / cell.cycles + 0.01 * device.cells; // wear + charge electricity
      var base = setsPerYear(device.daysPerSet) * perUse;
      return Math.round((base + (chargerAmortPerYear || 0)) * 100) / 100;
    }
    var mult = 1;
    if (cellId === 'lithium' && device.drain === 'high') mult = 1 / 3; // lithium lasts ~3x in high drain
    return Math.round(sets * device.cells * cell.costEach * mult * 100) / 100;
  }

  function recommendation(device) {
    if (device.drain === 'critical') return { pick: 'lithium', why: 'Safety devices get lithium: flat voltage curve and 10-year shelf life - a chirping detector at 3 AM is the alkaline tax.' };
    if (device.drain === 'high') return { pick: 'nimh', why: 'High drain is where alkaline collapses to 40% of its rating. NiMH pays for itself in about five recharges and delivers full power every time.' };
    if (device.drain === 'medium') return { pick: 'nimh', why: 'Monthly swaps make rechargeables worth it - the charger amortizes in about a year of one controller.' };
    return { pick: 'alkaline', why: 'Low drain is the rechargeable trap: a remote sips so slowly that self-discharge, not use, eats a NiMH. A 50-cent alkaline wins for a decade.' };
  }

  function verdict(device, cells) {
    var costs = {};
    Object.keys(cells).forEach(function (id) { costs[id] = cells[id]; });
    var rec = recommendation(device);
    return { costs: costs, rec: rec };
  }

  return {
    CELLS: CELLS,
    DEVICES: DEVICES,
    setsPerYear: setsPerYear,
    effectiveAlkalineSets: effectiveAlkalineSets,
    annualCost: annualCost,
    recommendation: recommendation,
    verdict: verdict
  };
});
