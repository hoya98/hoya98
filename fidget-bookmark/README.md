# Hexagon Telescoping-Fidget Bookmark — for Bambu Lab P1S

A standard-style **flat clip bookmark** with a **telescoping hexagon fidget** on top.

- **Body:** a flat **1 mm** decorative bookmark — an **outer outline (frame)**
  with an **inner tongue**, separated by two side slots. Thread a page through
  the slots to clip it on. Single plane, prints flat, no supports.
- **Top fidget:** a print-in-place **telescoping hexagon** — a hex knob on a
  captive plunger you pull **up** and push **down** (expands/retracts along its
  axis) and that **spins freely**. A conical neck traps the plunger's flange so
  it can never pull off. ~7 mm of travel.

Prints as **one piece, flat on the bed, no supports, no assembly.** The slide/
spin axis is vertical, so it's a clean print-in-place.

![preview](preview.png)

- **Size:** 24 × 104 mm, body 1 mm thick. Fidget ~15 mm tall collapsed, ~22 mm extended.
- **Clearance:** 0.40 mm (free slide + spin). **Slots:** 1.8 mm.
- **Material:** PLA.

## Files

| File | What it is |
|------|------------|
| `hexagon_telescope_bookmark.stl` | The bookmark + print-in-place telescoping hexagon fidget. |
| `flat_clip_bookmark.stl` | Same flat clip body with a flat engraved hexagon (no moving parts — safe fallback). |
| `generate_bookmark.py` | Parametric generator — change body size, slots, clearance, fidget travel, etc. |
| `preview.png` | Top + isometric render. |

## How the fidget is captured (so it can't fall apart)

```
        [ hex knob ]      <- grab + spin + pull up
            | |  stem
        ===/   \===  conical neck  (narrow hole, self-supporting overhang)
        |  flange  |  <- wider than the neck hole -> trapped
        |  (slides)|
        |  sleeve  |  (fixed to the bookmark)
   _____|__________|_____  1 mm flat body
```

Pull the knob: the plunger rises until its flange catches under the neck.
Push it: the flange settles back to the body. Round stem in a round hole = it
also spins. All gaps are 0.40 mm so the slicer prints it free.

## Test print first (recommended — a few minutes)

Print-in-place success depends on your machine's calibration, so validate the
fit before committing to the full bookmark:

| File | Use |
|------|-----|
| `fidget_test_coupon.stl` | Just the fidget on a small base. Prints in a few minutes — twist/pull it to confirm it slides and spins free. |
| `clearance_test_comb.stl` | Five fidgets at **0.30 / 0.35 / 0.40 / 0.45 / 0.50 mm** clearance, marked **1–5 dots** (1 dot = 0.30, 5 dots = 0.50). Print once, then pick the **loosest one that still feels captive and doesn't wobble**. |

Then set `CLR` in `generate_bookmark.py` to the winning value and re-run to bake
it into the bookmark. (Regenerate the tests with `python3 generate_tests.py`.)

## Print settings (Bambu Studio / Orca, P1S, 0.4 mm nozzle)

**Orientation:** load the STL **as-is, flat on the plate** (body down, fidget up).
Do **not** rotate. **No supports.**

1. **Layer height:** 0.20 mm (0.16 mm = silkier spin/slide).
2. **Walls:** 2–3. **Top/bottom:** 4. **Infill:** 15 %.
3. **Seam → `Aligned`**, and **paint the seam onto the sleeve, not the moving
   knob/stem** — a fat seam across the gap is the usual cause of a seized fidget.
4. **First layer clean, not over-squished:** the plunger flange floats 0.4 mm
   above the body; a fat first layer can fuse it. If your first layer is squishy,
   nudge Z-offset up a hair or drop flow ~2 %.
5. The sleeve's neck is a **self-supporting cone** — no supports needed.
6. **Brim:** not needed (good flat footprint).

**After printing:** push the knob down and pull it up firmly once to crack any
stringing — it then telescopes and spins freely.

### Tuning (edit the top of `generate_bookmark.py`, then re-run)

- **Fidget stuck:** raise `CLR` to `0.45`–`0.50` (and fix the seam first).
- **Fidget loose/rattly:** lower `CLR` to `0.30`.
- **More travel / taller pop-up:** raise `SLEEVE_H`.
- **Bigger/smaller hex:** `SLEEVE_HEX`. **Slots grip tighter:** lower `SLOT`.
- **Longer/shorter bookmark:** `SLOT_TOP`, `SLOT_BOT`, `HEAD_H`, `W`, `TONGUE_W`.

## Regenerating

```bash
pip install numpy manifold3d trimesh
python3 generate_bookmark.py
```
