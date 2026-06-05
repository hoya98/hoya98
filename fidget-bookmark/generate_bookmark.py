#!/usr/bin/env python3
"""
Hexagon Telescoping-Fidget Bookmark generator (print-in-place).

BODY: a standard flat decorative clip bookmark, 1 mm thick, single plane.
  It clips onto a page by having an OUTER OUTLINE (frame) and an INNER
  TONGUE joined at the top, separated by side slots -- you thread the page
  between the frame and the tongue.

TOP: a print-in-place TELESCOPING hexagon fidget. A hex knob on a captive
  plunger that pulls UP and pushes DOWN (expands/retracts along its axis)
  and SPINS freely, trapped inside a fixed hex sleeve by a neck so it can
  never pull off.

Prints as ONE piece, flat on the bed, no supports, no assembly. The slide/
spin axis is vertical (Z) -> clean print-in-place; the only bridges are the
sleeve's conical neck (self-supporting) and the plunger flange (0.4 mm gap).

Output: hexagon_telescope_bookmark.stl  (+ a no-fidget flat variant)
Units: millimetres. Tune the PARAMETERS block and re-run.
"""

import math
import numpy as np
import trimesh
from manifold3d import Manifold, CrossSection, JoinType

# --------------------------------------------------------------------------
# PARAMETERS (mm)
# --------------------------------------------------------------------------
CLR        = 0.40    # print-in-place clearance (slide + spin fit)
BASE_T     = 1.0     # flat bookmark thickness (standard decorative bookmark)

# --- flat clip body (outline + inner tongue) ---
W          = 24.0    # bookmark width
SLOT_BOT   = 9.0     # slots start this far up (leaves a closed bottom of the frame)
SLOT_TOP   = 80.0    # slots end this far up (closed frame all around the tongue)
HEAD_H     = 24.0    # solid head area at the top (holds the fidget)
TONGUE_W   = 12.0    # width of the inner tongue
SLOT       = 1.8     # side-slot width (the gap the page threads through)
CORNER     = 8.0     # outer corner rounding

# --- telescoping hexagon fidget (axis = Z) ---
SLEEVE_HEX = 8.0     # sleeve / knob hexagon circumradius
SLEEVE_H   = 9.0     # height of the fixed sleeve (≈ telescoping travel)
NECK_H     = 2.0     # conical neck at sleeve top (self-supporting overhang)
R_STEM     = 2.2     # plunger stem radius
FLANGE_R   = 4.0     # plunger bottom flange (what the neck traps)
FLANGE_H   = 1.5
KNOB_H     = 3.0     # the hex you grab and spin
SEGMENTS   = 96

# --- derived ---
R_NECK   = R_STEM + CLR          # neck hole (stem slides/spins through it)
R_BORE   = FLANGE_R + CLR        # sleeve bore (flange slides/spins inside)
L        = SLOT_TOP + HEAD_H     # total length
SPIN_C   = (0.0, SLOT_TOP + HEAD_H / 2)   # fidget centre on the head

# vertical stack (head top = z = BASE_T)
SLEEVE_WALL_TOP = BASE_T + SLEEVE_H
NECK_TOP        = SLEEVE_WALL_TOP + NECK_H
FLANGE_BOT      = BASE_T + CLR
FLANGE_TOP      = FLANGE_BOT + FLANGE_H
KNOB_BOT        = NECK_TOP + CLR
KNOB_TOP        = KNOB_BOT + KNOB_H

print(f"Flat clip bookmark {W:.0f} x {L:.0f} x {BASE_T} mm; "
      f"telescoping hex fidget, collapsed height {KNOB_TOP:.1f} mm, "
      f"~{SLEEVE_WALL_TOP - FLANGE_TOP:.0f} mm of travel, clearance {CLR} mm")


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
def hexagon(circum_r):
    pts = [(circum_r * math.cos(math.radians(90 + 60 * i)),
            circum_r * math.sin(math.radians(90 + 60 * i))) for i in range(6)]
    return CrossSection([pts])


def rrect(w, l, cx, cy, r):
    s = CrossSection.square([w - 2 * r, l - 2 * r], center=True)
    return s.offset(r, JoinType.Round, circular_segments=SEGMENTS).translate([cx, cy])


def rect(w, h, cx, cy):
    return CrossSection.square([w, h], center=True).translate([cx, cy])


def cyl(r0, h, z0, r1=None):
    r1 = r0 if r1 is None else r1
    return Manifold.cylinder(h, r0, r1, SEGMENTS).translate([0, 0, z0])


# --------------------------------------------------------------------------
# flat body: outer outline + inner tongue (joined at the top), side slots
# --------------------------------------------------------------------------
def body_outline():
    plate = rrect(W, L, 0, L / 2, CORNER)
    # two side slots between SLOT_BOT and SLOT_TOP -> closed outer frame
    # (outline) with an inner tongue joined to it at both ends; thread the
    # page through the slots to clip onto a page.
    xo = TONGUE_W / 2 + SLOT / 2
    h  = SLOT_TOP - SLOT_BOT
    cy = (SLOT_TOP + SLOT_BOT) / 2
    left  = rrect(SLOT, h, -xo, cy, SLOT / 2)
    right = rrect(SLOT,  h,  xo, cy, SLOT / 2)
    return plate - (left + right)


# --------------------------------------------------------------------------
# FIXED parts: body + sleeve (walls + conical neck)
# --------------------------------------------------------------------------
def build_fixed():
    body = body_outline().extrude(BASE_T)

    sleeve_wall = (hexagon(SLEEVE_HEX).extrude(SLEEVE_H).translate([0, 0, BASE_T])
                   - cyl(R_BORE, SLEEVE_H + 2, BASE_T - 1))
    # neck: hex cap whose bore is a cone (wide at the bottom, narrow at the top)
    # so the inward overhang that traps the plunger is self-supporting.
    neck = hexagon(SLEEVE_HEX).extrude(NECK_H).translate([0, 0, SLEEVE_WALL_TOP])
    neck -= cyl(R_BORE, NECK_H + 1, SLEEVE_WALL_TOP - 0.5, r1=R_NECK)

    body += (sleeve_wall + neck).translate([SPIN_C[0], SPIN_C[1], 0])
    return body


# --------------------------------------------------------------------------
# MOVING part: plunger = bottom flange + stem + hex knob
# --------------------------------------------------------------------------
def build_plunger():
    flange = cyl(FLANGE_R, FLANGE_H, FLANGE_BOT)
    stem   = cyl(R_STEM, KNOB_BOT - FLANGE_TOP, FLANGE_TOP)
    knob   = hexagon(SLEEVE_HEX).extrude(KNOB_H).translate([0, 0, KNOB_BOT])
    return (flange + stem + knob).translate([SPIN_C[0], SPIN_C[1], 0])


def to_trimesh(man):
    m = man.to_mesh()
    v = np.asarray(m.vert_properties)[:, :3].astype(np.float64)
    f = np.asarray(m.tri_verts).astype(np.int64)
    return trimesh.Trimesh(vertices=v, faces=f, process=False)


def main():
    fixed   = build_fixed()
    plunger = build_plunger()
    inter = (fixed ^ plunger).volume()
    print(f"fixed/plunger intersection: {inter:.4f} mm^3 (must be ~0 -> free to move)")

    mesh = to_trimesh(fixed + plunger)
    mesh.export("hexagon_telescope_bookmark.stl")
    print(f"wrote hexagon_telescope_bookmark.stl ({len(mesh.faces)} faces, "
          f"watertight={mesh.is_watertight})")

    # no-fidget variant: same flat clip body + a flat engraved hexagon
    flat = body_outline().extrude(BASE_T)
    ring = (hexagon(SLEEVE_HEX) - hexagon(SLEEVE_HEX - 1.4)).extrude(0.6) \
        .translate([SPIN_C[0], SPIN_C[1], BASE_T - 0.6])
    flat -= ring
    fm = to_trimesh(flat)
    fm.export("flat_clip_bookmark.stl")
    print(f"wrote flat_clip_bookmark.stl ({len(fm.faces)} faces)")


if __name__ == "__main__":
    main()
