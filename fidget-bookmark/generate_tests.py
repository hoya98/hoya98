#!/usr/bin/env python3
"""
Test prints for the telescoping hexagon fidget.

  fidget_test_coupon.stl  - one fidget on a small base (quick mechanism test)
  clearance_test_comb.stl - five fidgets at 0.30/0.35/0.40/0.45/0.50 mm
                            clearance, each marked with 1..5 dots, so ONE
                            small print tells you which tolerance your P1S
                            likes. Then set CLR in generate_bookmark.py to
                            match and print the real bookmark.

Print flat, no supports. Twist/pull each knob after printing; pick the
loosest one that still feels captive and doesn't wobble.
"""

import math
import numpy as np
import trimesh
from manifold3d import Manifold, CrossSection, JoinType

SEG = 96
# fidget geometry (matches generate_bookmark.py)
R_STEM, FLANGE_R, FLANGE_H = 2.2, 4.0, 1.5
SLEEVE_HEX, SLEEVE_H, NECK_H, KNOB_H = 8.0, 9.0, 2.0, 3.0
BASE_T, BASE_R = 1.2, 10.0


def hexagon(r):
    return CrossSection([[(r * math.cos(math.radians(90 + 60 * i)),
                           r * math.sin(math.radians(90 + 60 * i))) for i in range(6)]])


def cyl(r0, h, z0, r1=None):
    return Manifold.cylinder(h, r0, r0 if r1 is None else r1, SEG).translate([0, 0, z0])


def fidget(clr):
    """Return (fixed, plunger) manifolds for one fidget at clearance `clr`."""
    r_neck = R_STEM + clr
    r_bore = FLANGE_R + clr
    wall_top = BASE_T + SLEEVE_H
    neck_top = wall_top + NECK_H
    flange_bot = BASE_T + clr
    flange_top = flange_bot + FLANGE_H
    knob_bot = neck_top + clr
    knob_top = knob_bot + KNOB_H

    base = cyl(BASE_R, BASE_T, 0)
    sleeve = hexagon(SLEEVE_HEX).extrude(SLEEVE_H).translate([0, 0, BASE_T]) \
        - cyl(r_bore, SLEEVE_H + 2, BASE_T - 1)
    neck = hexagon(SLEEVE_HEX).extrude(NECK_H).translate([0, 0, wall_top]) \
        - cyl(r_bore, NECK_H + 1, wall_top - 0.5, r1=r_neck)
    fixed = base + sleeve + neck

    plunger = cyl(FLANGE_R, FLANGE_H, flange_bot) \
        + cyl(R_STEM, knob_bot - flange_top, flange_top) \
        + hexagon(SLEEVE_HEX).extrude(KNOB_H).translate([0, 0, knob_bot])
    return fixed, plunger, knob_top


def dots(n, clr_unused):
    """n marker dots on the base edge to identify the clearance."""
    d = None
    for i in range(n):
        x = -BASE_R + 2.5 + i * 2.4
        c = cyl(0.7, 0.6, BASE_T).translate([x, -BASE_R + 2.2, 0])
        d = c if d is None else d + c
    return d


def to_tri(man):
    m = man.to_mesh()
    return trimesh.Trimesh(np.asarray(m.vert_properties)[:, :3].astype(float),
                           np.asarray(m.tri_verts).astype(np.int64), process=False)


def coupon(clr, idx):
    fixed, plunger, _ = fidget(clr)
    fixed += dots(idx, clr)
    inter = (fixed ^ plunger).volume()
    return fixed + plunger, inter


def main():
    # single coupon at the recommended 0.40
    one, inter = coupon(0.40, 4)
    to_tri(one).export("fidget_test_coupon.stl")
    print(f"fidget_test_coupon.stl  (CLR 0.40, intersection {inter:.3f})")

    # comb of five clearances
    clrs = [0.30, 0.35, 0.40, 0.45, 0.50]
    comb = None
    pitch = 2 * BASE_R + 4
    for i, clr in enumerate(clrs):
        c, inter = coupon(clr, i + 1)
        c = c.translate([i * pitch, 0, 0])
        comb = c if comb is None else comb + c
        print(f"  {i+1} dot(s) -> CLR {clr:.2f} mm  (intersection {inter:.3f} mm^3)")
    to_tri(comb).export("clearance_test_comb.stl")
    print("clearance_test_comb.stl  (1 dot=0.30 ... 5 dots=0.50)")


if __name__ == "__main__":
    main()
