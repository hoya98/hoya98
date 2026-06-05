#!/usr/bin/env python3
"""
Hexagon Fidget Bookmark generator (print-in-place spinners).

Generates a slim bookmark with a vertical column of captive hexagonal
spinners running the full length. Each spinner is a hex disc held on a
central post by a mushroom cap, resting on a small collar so it spins
freely. All clearances are real geometric gaps so the whole thing prints
as ONE object on a Bambu Lab P1S (0.4 mm nozzle, PLA) with no supports
and no assembly.

Output: hexagon_fidget_bookmark.stl  (+ a flat no-fidget variant)

Tuned units are millimetres. Edit the PARAMETERS block and re-run.
"""

import math
import numpy as np
import trimesh
from manifold3d import Manifold, CrossSection, JoinType

# --------------------------------------------------------------------------
# PARAMETERS  (all mm)  -- tweak these, then re-run: python3 generate_bookmark.py
# --------------------------------------------------------------------------
N_SPINNERS      = 5      # how many spinners down the length

# print-in-place clearance. 0.4 = very safe / guaranteed free on a P1S.
# Drop to 0.30 for a tighter, lower-wobble spin if your machine is dialed in.
CLR             = 0.40

# spinner geometry
DISC_R          = 11.0   # hex spinner circumradius (point-to-centre)
DISC_T          = 3.0    # spinner thickness
POST_R          = 2.0    # central fixed post radius
COLLAR_R        = 3.0    # little shelf the disc rests/spins on (low friction)
COLLAR_H        = 0.6    # collar height above the floor
CAP_R           = 3.4    # mushroom cap radius (retains the disc). overhang = CAP_R-(POST_R+CLR)
CAP_T           = 0.8    # cap thickness

# frame / bookmark body
FLOOR_T         = 0.8    # solid floor under each spinner (4 layers @0.2)
WALL            = 4.0    # frame material around / between pockets
CORNER_R        = 4.0    # rounded outer corners
TASSEL_HOLE_R   = 2.5    # hole at the top for a tassel/ribbon
SEGMENTS        = 96     # roundness of circles

# derived ------------------------------------------------------------------
HOLE_R    = POST_R + CLR                 # disc centre bore
POCKET_R  = DISC_R + CLR                 # hex pocket the disc sits in (circumradius)

# vertical stack (z up = spin axis; printed flat on the bed)
FLOOR_TOP   = FLOOR_T
COLLAR_TOP  = FLOOR_TOP + COLLAR_H
DISC_BOT    = COLLAR_TOP + CLR           # printed gap; disc settles onto collar
DISC_TOP    = DISC_BOT + DISC_T
CAP_BOT     = DISC_TOP + CLR
CAP_TOP     = CAP_BOT + CAP_T
FRAME_TOP   = DISC_TOP - 0.5            # disc stands 0.5 mm proud -> grabbable

# layout: point-up hexagons stacked along Y (the length)
PITCH_Y   = 2 * POCKET_R + WALL          # centre-to-centre spacing
HEX_FW    = 2 * POCKET_R * math.cos(math.radians(30))  # pocket flat-to-flat (across width)

WIDTH     = HEX_FW + 2 * WALL
LENGTH    = (N_SPINNERS - 1) * PITCH_Y + 2 * POCKET_R + 2 * WALL + 14  # +14 for top tab

print(f"Bookmark: {WIDTH:.1f} x {LENGTH:.1f} mm, max thickness {CAP_TOP:.1f} mm, "
      f"{N_SPINNERS} spinners, clearance {CLR} mm")


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
def hexagon(circum_r, point_up=True):
    """Regular hexagon CrossSection of given circumradius."""
    off = 90 if point_up else 0
    pts = [(circum_r * math.cos(math.radians(off + 60 * i)),
            circum_r * math.sin(math.radians(off + 60 * i))) for i in range(6)]
    return CrossSection([pts])


def rounded_rect(w, l, r):
    """Rounded rectangle CrossSection centred on origin."""
    rect = CrossSection.square([w - 2 * r, l - 2 * r], center=True)
    return rect.offset(r, JoinType.Round, circular_segments=SEGMENTS)


def cyl(r, h, z0):
    return Manifold.cylinder(h, r, r, SEGMENTS).translate([0, 0, z0])


def spinner_centers():
    y0 = -LENGTH / 2 + WALL + POCKET_R
    return [y0 + i * PITCH_Y for i in range(N_SPINNERS)]


# --------------------------------------------------------------------------
# build the FIXED body: frame + floor + posts + collars + caps
# --------------------------------------------------------------------------
def build_fixed():
    body = rounded_rect(WIDTH, LENGTH, CORNER_R).extrude(FRAME_TOP)

    ys = spinner_centers()
    # carve hex pockets (down to the floor) so each disc has a home
    pocket = hexagon(POCKET_R).extrude(FRAME_TOP - FLOOR_TOP).translate([0, 0, FLOOR_TOP])
    for y in ys:
        body -= pocket.translate([0, y, 0])

    # tassel hole near the top
    top_y = LENGTH / 2 - WALL - TASSEL_HOLE_R - 1.0
    body -= cyl(TASSEL_HOLE_R, FRAME_TOP + 1, -0.5).translate([0, top_y, 0])

    # posts + collars + caps at each spinner centre
    for y in ys:
        post   = cyl(POST_R,   CAP_BOT,            0.0)        # base -> under cap
        collar = cyl(COLLAR_R, COLLAR_H,           FLOOR_TOP)  # the spin shelf
        cap    = cyl(CAP_R,    CAP_T,              CAP_BOT)     # retaining mushroom
        body += (post + collar + cap).translate([0, y, 0])

    return body


# --------------------------------------------------------------------------
# build the SPINNERS: floating hex discs with a centre bore (one per pocket)
# --------------------------------------------------------------------------
def build_spinners():
    discs = None
    for y in spinner_centers():
        disc = hexagon(DISC_R).extrude(DISC_T).translate([0, 0, DISC_BOT])
        disc -= cyl(HOLE_R, DISC_T + 2, DISC_BOT - 1)   # centre bore
        disc = disc.translate([0, y, 0])
        discs = disc if discs is None else (discs + disc)
    return discs


def to_trimesh(man):
    m = man.to_mesh()
    v = np.asarray(m.vert_properties)[:, :3].astype(np.float64)
    f = np.asarray(m.tri_verts).astype(np.int64)
    return trimesh.Trimesh(vertices=v, faces=f, process=False)


def main():
    fixed    = build_fixed()
    spinners = build_spinners()

    # union of disjoint solids -> one multi-body STL the slicer prints together
    combined = fixed + spinners
    mesh = to_trimesh(combined)
    out = "hexagon_fidget_bookmark.stl"
    mesh.export(out)
    print(f"wrote {out}  ({len(mesh.vertices)} verts, {len(mesh.faces)} faces, "
          f"watertight={mesh.is_watertight})")

    # bonus: a plain flat hexagon-pattern bookmark (no moving parts, bulletproof print)
    flat = rounded_rect(WIDTH, LENGTH, CORNER_R).extrude(2.0)
    top_y = LENGTH / 2 - WALL - TASSEL_HOLE_R - 1.0
    flat -= cyl(TASSEL_HOLE_R, 4, -1).translate([0, top_y, 0])
    for y in spinner_centers():
        # shallow engraved hex outline
        ring = (hexagon(DISC_R) - hexagon(DISC_R - 1.2)).extrude(0.6).translate([0, y, 1.4])
        flat -= ring.translate([0, 0, 0])
    fm = to_trimesh(flat)
    fm.export("flat_hexagon_bookmark.stl")
    print(f"wrote flat_hexagon_bookmark.stl  ({len(fm.faces)} faces)")


if __name__ == "__main__":
    main()
