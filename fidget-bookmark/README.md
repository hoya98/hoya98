# Hexagon Fidget Bookmark — for Bambu Lab P1S

A slim bookmark with a **column of 5 print-in-place hexagon spinners running the
full length**. Each hex disc is captured on a central post by a little mushroom
cap and rests on a low-friction collar, so it spins with a thumb-flick. The
whole thing prints as **one piece, no supports, no assembly** — the gaps are
built into the model.

![preview](preview.png)

- **Size:** ~27.7 mm wide × 152 mm long, max thickness 6 mm (the spinner caps).
- **Designed clearance:** 0.40 mm (very safe / guaranteed free on a P1S).
- **Material:** PLA.

## Files

| File | What it is |
|------|------------|
| `hexagon_fidget_bookmark.stl` | The fidget bookmark — 5 spinners, print-in-place. |
| `flat_hexagon_bookmark.stl` | Backup plan: a plain ~2 mm flat bookmark with engraved hexagons, no moving parts (bulletproof print). |
| `generate_bookmark.py` | Parametric generator — change spinner count, size, clearance, etc. and re-run. |
| `preview.png` | Render. |

## Print settings (Bambu Studio / Orca, P1S, 0.4 mm nozzle)

The #1 rule for print-in-place: **don't let the slicer weld the moving parts.**

1. **Slice the STL as-is** — keep it flat on the plate (spin axis = Z). Do **not** add supports.
2. **Layer height:** 0.20 mm (0.16 mm gives a smoother spin if you want it).
3. **Walls:** 2–3. **Top/bottom layers:** 3–4. **Infill:** 15 % gyroid is plenty.
4. **Seam position → `Aligned`**, and crucially turn **Seam gap** up a touch / keep
   the seam off the spinners. A fat blobby seam is the most common cause of a
   fused, non-spinning fidget. Painting the seam to the bookmark's outer edge
   (Orca's seam painter) is the surest fix.
5. **Disable "Elephant foot compensation" → no**, but **do** keep a clean first
   layer; an over-squished first layer can bridge the bottom gap. If your first
   layer is fat, drop flow ~2–3 % or raise Z-offset a hair.
6. **No "merge"/"union" of parts**, and leave **wipe/retraction** at defaults.
7. **Brim:** not needed (large flat footprint). Add a 3 mm brim only if a corner lifts.
8. Print speed: defaults are fine. PLA temps per your filament.

**After printing:** let it cool, then give each spinner a firm twist to crack any
tiny stringing bridges. They'll free up and spin. If one is stuck, a drop of
twisting force + flexing usually does it; if truly fused, bump clearance (below).

### If spinners are stuck or too loose

Edit the top of `generate_bookmark.py` and re-run `python3 generate_bookmark.py`:

- **Stuck / won't spin:** raise `CLR` to `0.45` or `0.50`, and fix your seam first.
- **Too loose / wobbly:** lower `CLR` to `0.30` (only if your P1S is well dialed-in).
- **Fewer/more spinners:** change `N_SPINNERS`.
- **Thinner bookmark:** lower `DISC_T` and `CAP_T` (less proud, slimmer).

## Regenerating

```bash
pip install numpy manifold3d trimesh
python3 generate_bookmark.py
```

## Proven existing models (if you'd rather just download)

You asked for "both" — here are vetted, popular print-in-place designs. None are
*bookmarks* specifically (a full-length multi-spinner bookmark is unusual, which
is why the custom file above exists), but these are excellent single fidgets and
several come with ready-made P1S profiles:

- [Hexagon Fidget — Print In Place (3D-Printing Nerds)](https://makerworld.com/en/models/1005807-hexagon-fidget-print-in-place)
- [Hexagon Gyro Card Fidget — Print in Place](https://makerworld.com/en/models/1407430-hexagon-gyro-card-fidget-print-in-place)
- [Hexagon Gyro — Fidget Spinner — Print In Place](https://makerworld.com/en/models/823168-hexagon-gyro-fidget-spinner-print-in-place)
- [Fidget Hexagon Twist](https://makerworld.com/en/models/521944-fidget-hexagon-twist)
- [Hexagonal Fidget Toy Keychain — Print-in-Place](https://makerworld.com/en/models/894951)
- [Print in Place Fidget Spinner (Printables)](https://www.printables.com/model/186682-print-in-place-fidget-spinner)
- [Fidget Spinner Keychain — Parametric — Print in Place (Printables)](https://www.printables.com/model/1285263-fidget-spinner-keychain-parametric-print-in-place)

> Tip from the community for any print-in-place spinner on Bambu machines: watch
> the **seam size** — a large seam can fuse the bearing to the body and stop it
> spinning. Paint the seam onto the body, not the moving ring.
