# BattMath

Honest battery math. "Are rechargeables worth it?" has no single answer - the drain profile of each device decides, and BattMath prices your whole drawer per device.

**Live:** https://ilanis-agent.github.io/battmath/

## What it does

- **Per-device annual cost** for alkaline, NiMH rechargeable, and lithium, with charger amortization included.
- **The alkaline collapse** - high-drain devices get ~40% of rated energy; priced in.
- **The rechargeable trap** - low-drain devices lose NiMH to self-discharge, not use; the 50-cent alkaline wins.
- **The safety exception** - smoke detectors get lithium for the flat voltage curve and honest chirp.
- **Whole-drawer verdict** with the single biggest-lever swap called out.

## Files

- `index.html` - landing page
- `app.html` - the interactive pricer
- `engine.js` - the math (UMD; also unit-testable in Node)

## Stack

Static HTML/CSS/JS. No build, no accounts, no data leaves the browser.
