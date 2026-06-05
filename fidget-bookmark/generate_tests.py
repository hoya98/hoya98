#!/usr/bin/env python3
"""
Test prints for the telescoping hexagon VORTEX (print-in-place).

  fidget_test_coupon.stl  - one small vortex on a round base (quick test)
  clearance_test_comb.stl - five small vortexes at 0.20/0.25/0.30/0.35/0.40 mm
                            FLAT clearance, each marked with 1..5 dots, so ONE
                            small print tells you which tolerance your P1S
                            likes. Then set CLR in generate_bookmark.py to
                            match and print the real bookmark.

Each coupon is the SAME mechanism as the bookmark (built by vortex_rings), just
a smaller stack so it prints in a few minutes. Print flat, no supports. After
printing, push each centre down and pull it up: pick the loosest clearance that
still pops up captive and doesn't rattle sideways.
"""

import generate_bookmark as gb

R_OUT_T = 9.0          # small outer ring for a quick test stack (~4-5 rings)
R_MIN_T = 2.5
PLATE_H = 1.0          # round base plate (bed adhesion + clearance dots)
PLATE_R = R_OUT_T + 2.5
FLOOR_Z = PLATE_H + gb.BASE_DISC
CLRS    = [0.20, 0.25, 0.30, 0.35, 0.40]


def coupon(clr, n_dots):
    fixed, moving, meta = gb.vortex_rings(clr, R_OUT_T, R_MIN_T, FLOOR_Z)
    fixed = fixed + gb.cyl(PLATE_R, PLATE_H, 0.0)          # round base plate
    for i in range(n_dots):                                # 1..5 dots = clearance
        x = -R_OUT_T + 1.5 + i * 2.2
        fixed += gb.cyl(0.7, 0.6, PLATE_H).translate([x, -(PLATE_R - 1.6), 0])
    allmove = moving[0]
    for m in moving[1:]:
        allmove += m
    inter = (fixed ^ allmove).volume()
    return fixed + allmove, inter, meta["n"]


def main():
    one, inter, n = coupon(0.30, 3)
    gb.to_trimesh(one).export("fidget_test_coupon.stl")
    print(f"fidget_test_coupon.stl  (CLR 0.30, {n} rings, intersection {inter:.3f})")

    comb, pitch_x = None, 2 * PLATE_R + 2
    for i, clr in enumerate(CLRS):
        c, inter, n = coupon(clr, i + 1)
        c = c.translate([i * pitch_x, 0, 0])
        comb = c if comb is None else comb + c
        flag = "" if inter < 1e-3 else "  <-- FUSED!"
        print(f"  {i+1} dot(s) -> CLR {clr:.2f} mm  ({n} rings, "
              f"intersection {inter:.3f} mm^3){flag}")
    gb.to_trimesh(comb).export("clearance_test_comb.stl")
    print("clearance_test_comb.stl  (1 dot=0.20 ... 5 dots=0.40)")


if __name__ == "__main__":
    main()
