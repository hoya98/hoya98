#!/usr/bin/env python3
"""
Hexagon Telescoping-Vortex Bookmark generator (print-in-place).

BODY: a flat decorative clip bookmark, 1 mm thick, single plane. An OUTER
  OUTLINE (frame) joined to an INNER TONGUE, separated by two side slots --
  thread a page through the slots to clip it on. The top widens into a round
  "lollipop" head that carries the fidget.

TOP: a print-in-place TELESCOPING HEXAGON VORTEX (driven by the reference
  photos). Many concentric hexagonal rings nested inside one another. Prints
  COLLAPSED and flat (~11 mm tall, looks like concentric spiral hexagons);
  pull the centre and it telescopes UP into a tapering, twisting cone, then
  pushes back down flat. Each ring is captured by the one outside it: an
  outward FOOT chevron at its base tucks under an inward NECK chevron at the
  next ring's top, so nothing can pull off. A gentle per-ring twist makes the
  corners spiral -> the "vortex" moire.

Prints as ONE piece, flat on the bed, no supports, no assembly. The only
overhangs are the gentle (~30 deg) chevron faces and the thin floating ring
bottoms (they float CLR above the base, like a print-in-place flange).

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
CLR        = 0.30    # print-in-place FLAT clearance (comb-tuned; drives gaps)

BASE_T     = 1.0     # flat bookmark thickness (standard decorative bookmark)

# --- flat clip body (outline + inner tongue + lollipop head) ---
W          = 24.0    # strap (body) width
SLOT_BOT   = 9.0     # slots start this far up (closed bottom of the frame)
SLOT_TOP   = 70.0    # slots end this far up (closed frame around the tongue)
TONGUE_W   = 12.0    # width of the inner tongue
SLOT       = 1.8     # side-slot width (the gap the page threads through)
CORNER     = 8.0     # outer corner rounding (strap)
HEAD_D     = 40.0    # round lollipop head diameter (carries the vortex)

# --- telescoping hexagon vortex (axis = Z) ---
R_OUT      = 19.0    # outer (fixed) ring OUTER-face circumradius
WALL       = 0.90    # ring wall thickness (2 perimeters at 0.4 mm nozzle)
RING_H     = 7.0     # height of every ring (collapsed stack height)
FOOT_H     = 1.30    # foot-chevron centre, measured up from the ring base
NECK_H     = 1.30    # neck-chevron centre, measured down from the ring top
CHEV_H     = 0.90    # chevron half-height (sets the catch-face overhang angle)
CAP        = 0.22    # capture lip overlap (how far the foot tucks under a neck)
TWIST_SAFE = 0.62    # fraction of each ring's max safe twist to use (vortex)
TWIST_CAP  = 7.0     # hard cap on per-ring twist (deg), keeps it tasteful
R_MIN      = 2.6     # smallest ring; below this a solid centre plug fills in
PLUG_PROUD = 1.6     # how far the centre pull-knob stands above the rings
BASE_DISC  = 1.2     # solid hex floor under the vortex (the photo's base band)
SEGMENTS   = 96

# --- derived ---
COS30      = math.cos(math.radians(30))
HEAD_CY    = 84.0                       # vortex / head centre (y)
L          = HEAD_CY + HEAD_D / 2       # total length
SPIN_C     = (0.0, HEAD_CY)
FLOOR_Z    = BASE_T + BASE_DISC         # top of the solid base disc (ring floor)

WELD       = 0.4                              # ring0 dips into the base (one fixed body)

# per-ring travel until the foot catches under the next ring's neck
TRAVEL_K   = RING_H - NECK_H - FOOT_H         # ring k vs ring k-1 (k>=2)
TRAVEL_1   = TRAVEL_K - CLR - WELD            # ring1 vs fixed ring0 (lowered by WELD)


# --------------------------------------------------------------------------
# 2D / solid primitives
# --------------------------------------------------------------------------
def hexagon(circum_r, rot_deg=0.0):
    pts = [(circum_r * math.cos(math.radians(90 + rot_deg + 60 * i)),
            circum_r * math.sin(math.radians(90 + rot_deg + 60 * i)))
           for i in range(6)]
    return CrossSection([pts])


def rrect(w, l, cx, cy, r):
    s = CrossSection.square([w - 2 * r, l - 2 * r], center=True)
    return s.offset(r, JoinType.Round, circular_segments=SEGMENTS).translate([cx, cy])


def disc(r, cx, cy):
    return CrossSection.circle(r, SEGMENTS).translate([cx, cy])


def cyl(r0, h, z0, r1=None):
    r1 = r0 if r1 is None else r1
    return Manifold.cylinder(h, r0, r1, SEGMENTS).translate([0, 0, z0])


def hex_prism(rc, z0, h, rot=0.0):
    return hexagon(rc, rot).extrude(h).translate([0, 0, z0])


def hex_frustum(rc_bot, rc_top, z0, h, rot=0.0):
    """Hex frustum: circumradius rc_bot at z0 -> rc_top at z0+h."""
    s = max(rc_top / rc_bot, 1e-4)
    return hexagon(rc_bot, rot).extrude(h, scale_top=(s, s)).translate([0, 0, z0])


def chevron(r_far, r_near, zc, rot):
    """Filled hex 'diamond': circumradius r_far at zc, tapering back to r_near
    at zc +/- CHEV_H. Both faces are self-supporting overhangs, and the catch
    radius sits at the CENTRE so a foot and a neck actually meet when a ring is
    pulled up (a base/top-anchored taper would slip past instead)."""
    lo = hex_frustum(r_near, r_far, zc - CHEV_H, CHEV_H, rot)
    up = hex_frustum(r_far, r_near, zc, CHEV_H, rot)
    return lo + up


# --------------------------------------------------------------------------
# one telescoping ring (hollow hex tube + capture chevrons), z-bottom at z0
#   foot : outward chevron near the base -> caught by the ring outside it
#   neck : inward  chevron near the top  -> catches the ring inside it
# --------------------------------------------------------------------------
def make_ring(ro, z0, rot, catch, foot=True, neck=True):
    ri = ro - WALL
    zc_f = z0 + FOOT_H                  # foot-chevron centre (near base)
    zc_n = z0 + RING_H - NECK_H         # neck-chevron centre (near top)
    outer = hex_prism(ro, z0, RING_H, rot)
    if foot:
        outer += chevron(ro + catch, ro, zc_f, rot)
    if neck:                           # bore pinched inward (to ri-catch) at neck
        bore = (hex_prism(ri, z0 - 1, (zc_n - CHEV_H) - (z0 - 1), rot)
                + hex_frustum(ri, ri - catch, zc_n - CHEV_H, CHEV_H, rot)
                + hex_frustum(ri - catch, ri, zc_n, CHEV_H, rot)
                + hex_prism(ri, zc_n + CHEV_H, (z0 + RING_H + 1) - (zc_n + CHEV_H), rot))
    else:
        bore = hex_prism(ri, z0 - 1, RING_H + 2, rot)
    return outer - bore


def make_plug(ro, z0, rot, catch):
    """Solid centre pull-knob with an outward foot (captured by the last ring)."""
    h = RING_H + PLUG_PROUD
    plug = hex_prism(ro, z0, h, rot)
    plug += chevron(ro + catch, ro, z0 + FOOT_H, rot)
    plug -= cyl(0.5, 1.0, z0 + h - 0.6)        # tiny centre dimple (the pinhole)
    return plug


def safe_twist(ro_outer, ro_inner, catch):
    """Max relative rotation (deg) before the inner ring's foot vertex stabs
    the outer ring's inner flat (the tightest interface). We use TWIST_SAFE of
    it. Large rings afford almost none, small inner rings a lot -> the spiral
    tightens toward the centre, like the reference photos."""
    a = ro_outer - WALL          # outer ring inner-face circumradius (flat = COS30*a)
    b = ro_inner + catch         # inner ring foot circumradius (vertex = b)
    rhs = COS30 * a / b          # = cos(30 - dmax)
    dmax = TWIST_CAP if rhs >= 1.0 else 30.0 - math.degrees(math.acos(rhs))
    return min(TWIST_CAP, TWIST_SAFE * dmax)


# --------------------------------------------------------------------------
# the whole vortex at a given clearance: returns the FIXED stack (base disc +
# outer ring) and the list of MOVING rings (+ centre plug), all centred at the
# origin with the ring floor at floor_z. Reused by the bookmark and the tests.
# --------------------------------------------------------------------------
def vortex_rings(clr, r_out, r_min, floor_z):
    clr_c = clr / COS30                 # CLR is a FLAT gap -> circumradius gap
    catch = CAP + clr_c                 # foot/neck radial protrusion
    pitch = WALL + CAP + 2 * clr_c      # radial step per ring (gap = CAP + 2*clr_c)

    ros, ro = [], r_out
    while ro >= r_min:
        ros.append(round(ro, 4))
        ro -= pitch
    n = len(ros)
    plug_ro = ros[-1] - pitch

    tw = [0.0]
    for k in range(1, n + 1):
        ro_in = ros[k] if k < n else plug_ro
        tw.append(tw[-1] + safe_twist(ros[k - 1], ro_in, catch))

    # base disc dips WELD below the body top and ring0 dips WELD into the base,
    # so body + base + ring0 fuse into ONE fixed body (no coincident-plane seams)
    base  = hex_prism(r_out, floor_z - BASE_DISC - WELD, BASE_DISC + WELD)
    ring0 = make_ring(ros[0], floor_z - WELD, tw[0], catch, foot=False, neck=True)
    fixed_stack = base + ring0

    z = floor_z + clr                   # moving rings float CLR above the floor
    moving = [make_ring(ros[k], z, tw[k], catch, foot=True, neck=True)
              for k in range(1, n)]
    moving.append(make_plug(plug_ro, z, tw[n], catch))

    meta = dict(ros=ros, twist=tw, n=n, plug_ro=plug_ro, catch=catch, pitch=pitch)
    return fixed_stack, moving, meta


# instantiate the bookmark's vortex once (CLR fixed for the real part)
FIX_STACK, MOVING_LOCAL, META = vortex_rings(CLR, R_OUT, R_MIN, FLOOR_Z)
N_RING, TWIST = META["n"], META["twist"]
RING_RO, PLUG_RO = META["ros"], META["plug_ro"]

print(f"Lollipop clip bookmark {W:.0f}/{HEAD_D:.0f} x {L:.0f} x {BASE_T} mm; "
      f"telescoping hex vortex: {N_RING} rings + centre plug, "
      f"collapsed ~{FLOOR_Z + RING_H + PLUG_PROUD:.1f} mm, "
      f"~{TRAVEL_1 + (N_RING - 1) * TRAVEL_K:.0f} mm extension, "
      f"vortex twist {TWIST[-1]:.0f}° total, CLR {CLR} mm")


# --------------------------------------------------------------------------
# flat body: lollipop outline (strap + round head) + inner tongue, side slots
# --------------------------------------------------------------------------
def body_outline():
    strap = rrect(W, HEAD_CY, 0, HEAD_CY / 2, CORNER)
    plate = strap + disc(HEAD_D / 2, 0, HEAD_CY)
    xo = TONGUE_W / 2 + SLOT / 2
    h  = SLOT_TOP - SLOT_BOT
    cy = (SLOT_TOP + SLOT_BOT) / 2
    left  = rrect(SLOT, h, -xo, cy, SLOT / 2)
    right = rrect(SLOT, h,  xo, cy, SLOT / 2)
    return plate - (left + right)


def build_fixed():
    body = body_outline().extrude(BASE_T)
    return body + FIX_STACK.translate([SPIN_C[0], SPIN_C[1], 0])


def build_moving():
    return [m.translate([SPIN_C[0], SPIN_C[1], 0]) for m in MOVING_LOCAL]


def ring_rise(k):
    """Absolute extension height of moving ring k (1..N) when fully pulled."""
    return TRAVEL_1 + max(0, k - 1) * TRAVEL_K


def build_extended(moving):
    """Raise each moving ring to its captured (fully pulled) position -- for
    preview only; shows the telescoped cone."""
    return [m.translate([0, 0, ring_rise(k)]) for k, m in enumerate(moving, start=1)]


# --------------------------------------------------------------------------
# verification
# --------------------------------------------------------------------------
def capture_ok(fixed, moving):
    """A ring is captured iff, as it slides up, its foot must pass THROUGH the
    next ring's neck -- impossible, because the foot (circumradius ro+CATCH) is
    wider than the neck hole (ri-CATCH). We verify directly: hold the outer
    neighbour fixed, raise the ring to peak engagement and confirm a solid
    interference volume. The lip overlap is CAP mm by construction."""
    chain = [fixed] + moving
    rises = [0.0] + [ring_rise(k) for k in range(1, len(chain))]
    ok = True
    print(f"capture check (peak engagement must collide; lip overlap {CAP} mm):")
    for k in range(1, len(chain)):
        outer = chain[k - 1].translate([0, 0, rises[k - 1]])
        v = max((outer ^ chain[k].translate([0, 0, rises[k] + d])).volume()
                for d in (-0.4, -0.2, 0.0, 0.2, 0.4))
        held = "captured" if v > 5e-3 else "LOOSE - can pull off!"
        ok = ok and v > 5e-3
        lab = "plug" if k == len(chain) - 1 else f"ring{k}"
        print(f"  {lab:>6}: peak interference {v:7.3f} mm^3  -> {held}")
    return ok


def to_trimesh(man):
    m = man.to_mesh()
    v = np.asarray(m.vert_properties)[:, :3].astype(np.float64)
    f = np.asarray(m.tri_verts).astype(np.int64)
    return trimesh.Trimesh(vertices=v, faces=f, process=False)


def main():
    fixed  = build_fixed()
    moving = build_moving()

    chain = [fixed] + moving
    labels = ["fixed"] + [f"ring{k}" for k in range(1, N_RING)] + ["plug"]
    worst = 0.0
    print("adjacent-pair intersection (collapsed, must be ~0):")
    for i in range(len(chain) - 1):
        v = (chain[i] ^ chain[i + 1]).volume()
        worst = max(worst, v)
        flag = "" if v < 1e-3 else "  <-- FUSED!"
        print(f"  {labels[i]:>6} ^ {labels[i+1]:<6}: {v:8.4f} mm^3{flag}")
    allmove = moving[0]
    for m in moving[1:]:
        allmove += m
    print(f"fixed ^ (all moving): {(fixed ^ allmove).volume():.4f} mm^3  "
          f"(worst pair {worst:.4f})")
    capture_ok(fixed, moving)

    mesh = to_trimesh(fixed + allmove)
    mesh.export("hexagon_telescope_bookmark.stl")
    print(f"wrote hexagon_telescope_bookmark.stl ({len(mesh.faces)} faces, "
          f"watertight={mesh.is_watertight})")

    # no-fidget variant: lollipop clip body + flat engraved concentric hexes
    flat = body_outline().extrude(BASE_T)
    eng = None
    for k, ro in enumerate(RING_RO):
        rr = hexagon(ro, TWIST[k]) - hexagon(ro - 0.7, TWIST[k])
        eng = rr if eng is None else eng + rr
    flat -= eng.extrude(0.6).translate([SPIN_C[0], SPIN_C[1], BASE_T - 0.6])
    fm = to_trimesh(flat)
    fm.export("flat_clip_bookmark.stl")
    print(f"wrote flat_clip_bookmark.stl ({len(fm.faces)} faces)")


if __name__ == "__main__":
    main()
