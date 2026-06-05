#!/usr/bin/env python3
"""
Hexagon Fidget CLIP Bookmark generator (print-in-place).

A classic clip-on bookmark:
  - a long slim blade that goes down between the pages,
  - a sleeve / slot clip near the top that grips the page edge,
  - a decorative head carrying ONE print-in-place hexagon spinner that
    stands proud of the face (spins on an axis perpendicular to the blade
    -- "facing out"), held captive by a mushroom cap.

Prints as ONE piece, flat on the bed, no supports, no assembly. The spin
axis is vertical (Z) so the spinner is a clean print-in-place. The clip's
upper plate bridges the slot (short span, good cooling handles it on a P1S).

Output: hexagon_clip_bookmark.stl  (+ a no-fidget flat clip variant)
Units: millimetres. Tune the PARAMETERS block and re-run.
"""

import math
import numpy as np
import trimesh
from manifold3d import Manifold, CrossSection, JoinType

# --------------------------------------------------------------------------
# PARAMETERS (mm)
# --------------------------------------------------------------------------
CLR        = 0.40    # print-in-place clearance (0.40 = guaranteed free on a P1S)

# --- bookmark body / blade ---
BASE_T     = 1.6     # blade + lower-clip + head plate thickness (slim, some spring)
TIP_W      = 7.0     # width at the bottom tip
BLADE_W    = 14.0    # width where the blade meets the clip
BLADE_LEN  = 70.0    # how far the blade reaches down into the book

# --- the page-gripping slot clip ---
CLIP_W     = 16.0    # clip width
CLIP_LEN   = 11.0    # length of the gripping slot (short = bridges cleanly)
SLOT       = 1.0     # slot gap the page edge slides into
CLIP_T     = 1.0     # thickness of the outer clip plate
FOLD       = 1.6     # length of the solid fold joining the two plates

# --- decorative head ---
HEAD_W     = 26.0
HEAD_L     = 24.0
CORNER_R   = 4.0

# --- the hexagon spinner (sits ON TOP of the head face, spins on Z) ---
DISC_R     = 10.0    # hex circumradius
DISC_T     = 3.0
POST_R     = 2.0
COLLAR_R   = 3.0
COLLAR_H   = 0.6
CAP_R      = 3.4
CAP_T      = 0.8

TASSEL_R   = 0.0     # set >0 to add a tassel hole in the head (e.g. 2.5)
SEGMENTS   = 96

# --- derived ---
HOLE_R     = POST_R + CLR
# layout along +Y; blade tip at Y=0, head at the top
CLIP_Y0    = BLADE_LEN - 2.0                 # slot mouth (page enters here)
CLIP_Y1    = CLIP_Y0 + CLIP_LEN              # fold end of the slot
# head sits above the clip so the spinning disc fully clears the clip plate
HEAD_CY    = CLIP_Y1 + FOLD + 2.0 + DISC_R   # head centre
SPIN_C     = (0.0, HEAD_CY)                  # spinner centre

# spinner vertical stack (on top of the head plate)
COLLAR_TOP = BASE_T + COLLAR_H
DISC_BOT   = COLLAR_TOP + CLR
DISC_TOP   = DISC_BOT + DISC_T
CAP_BOT    = DISC_TOP + CLR
CAP_TOP    = CAP_BOT + CAP_T

# clip vertical stack
SLOT_BOT   = BASE_T
UPPER_BOT  = BASE_T + SLOT
UPPER_TOP  = UPPER_BOT + CLIP_T

TOTAL_LEN  = HEAD_CY + HEAD_L / 2

print(f"Clip bookmark: ~{HEAD_W:.0f} mm wide head, {TOTAL_LEN:.0f} mm long, "
      f"blade {BLADE_LEN:.0f} mm, slot {SLOT} mm, spinner cap height {CAP_TOP:.1f} mm")


# --------------------------------------------------------------------------
# 2D / 3D helpers
# --------------------------------------------------------------------------
def hexagon(circum_r):
    pts = [(circum_r * math.cos(math.radians(90 + 60 * i)),
            circum_r * math.sin(math.radians(90 + 60 * i))) for i in range(6)]
    return CrossSection([pts])


def rrect(w, l, cx, cy, r):
    s = CrossSection.square([w - 2 * r, l - 2 * r], center=True)
    return s.offset(r, JoinType.Round, circular_segments=SEGMENTS).translate([cx, cy])


def poly(pts):
    return CrossSection([pts])


def cyl(r, h, z0):
    return Manifold.cylinder(h, r, r, SEGMENTS).translate([0, 0, z0])


def box(w, l, h, cx, cy, z0):
    return Manifold.cube([w, l, h], center=False).translate([cx - w / 2, cy - l / 2, z0])


# --------------------------------------------------------------------------
# 2D outline of the flat body (blade + clip pad + head)
# --------------------------------------------------------------------------
def body_outline():
    blade = poly([(-TIP_W / 2, 0.0), (TIP_W / 2, 0.0),
                  (BLADE_W / 2, BLADE_LEN), (-BLADE_W / 2, BLADE_LEN)])
    clip_pad = rrect(CLIP_W, CLIP_LEN + FOLD + 6, 0, (CLIP_Y0 + CLIP_Y1) / 2 + 1, 3)
    head = rrect(HEAD_W, HEAD_L, *SPIN_C, CORNER_R)
    outline = blade + clip_pad + head
    # smooth the seams / round the tip
    outline = outline.offset(1.2, JoinType.Round, circular_segments=SEGMENTS) \
                     .offset(-1.2, JoinType.Round, circular_segments=SEGMENTS)
    return outline


# --------------------------------------------------------------------------
# fixed body: base plate + clip upper plate + fold + spinner post/collar/cap
# --------------------------------------------------------------------------
def build_fixed():
    base = body_outline().extrude(BASE_T)

    # outer clip plate (bridges the slot) + the fold that joins it to the base
    cx, cymid = 0.0, (CLIP_Y0 + CLIP_Y1) / 2
    upper = box(CLIP_W - 2.0, CLIP_LEN + FOLD, CLIP_T, cx, cymid + FOLD / 2, UPPER_BOT)
    fold  = box(CLIP_W - 2.0, FOLD, UPPER_TOP - BASE_T, cx, CLIP_Y1 + FOLD / 2, BASE_T)
    body  = base + upper + fold

    # spinner mechanism (fixed parts), centred on the head
    post   = cyl(POST_R,   CAP_BOT,  0.0)
    collar = cyl(COLLAR_R, COLLAR_H, BASE_T)
    cap    = cyl(CAP_R,    CAP_T,    CAP_BOT)
    body  += (post + collar + cap).translate([SPIN_C[0], SPIN_C[1], 0])

    if TASSEL_R > 0:
        body -= cyl(TASSEL_R, BASE_T + 2, -1).translate(
            [0, HEAD_CY + HEAD_L / 2 - TASSEL_R - 2.0, 0])
    return body


def build_spinner():
    disc = hexagon(DISC_R).extrude(DISC_T).translate([0, 0, DISC_BOT])
    disc -= cyl(HOLE_R, DISC_T + 2, DISC_BOT - 1)
    return disc.translate([SPIN_C[0], SPIN_C[1], 0])


def to_trimesh(man):
    m = man.to_mesh()
    v = np.asarray(m.vert_properties)[:, :3].astype(np.float64)
    f = np.asarray(m.tri_verts).astype(np.int64)
    return trimesh.Trimesh(vertices=v, faces=f, process=False)


def main():
    fixed = build_fixed()
    spin  = build_spinner()
    inter = (fixed ^ spin).volume()
    print(f"frame/spinner intersection: {inter:.4f} mm^3 (must be ~0 -> spins free)")

    mesh = to_trimesh(fixed + spin)
    mesh.export("hexagon_clip_bookmark.stl")
    print(f"wrote hexagon_clip_bookmark.stl ({len(mesh.faces)} faces, "
          f"watertight={mesh.is_watertight})")

    # no-fidget variant: same clip + a flat engraved hexagon (bulletproof print)
    flat = body_outline().extrude(BASE_T)
    flat += box(CLIP_W - 2.0, CLIP_LEN + FOLD, CLIP_T, 0,
                (CLIP_Y0 + CLIP_Y1) / 2 + FOLD / 2, UPPER_BOT)
    flat += box(CLIP_W - 2.0, FOLD, UPPER_TOP - BASE_T, 0, CLIP_Y1 + FOLD / 2, BASE_T)
    ring = (hexagon(DISC_R) - hexagon(DISC_R - 1.4)).extrude(0.6) \
        .translate([SPIN_C[0], SPIN_C[1], BASE_T - 0.6])
    flat -= ring
    fm = to_trimesh(flat)
    fm.export("flat_clip_bookmark.stl")
    print(f"wrote flat_clip_bookmark.stl ({len(fm.faces)} faces)")


if __name__ == "__main__":
    main()
