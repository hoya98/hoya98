#!/usr/bin/env python3
"""
Quick previews for the telescoping-vortex bookmark (no slicer needed).

Renders, from the live geometry in generate_bookmark.py:
  - top-down view (collapsed)      -> the concentric spiral-hex "vortex"
  - isometric (collapsed)          -> how it prints, flat
  - isometric (extended)           -> the telescoped cone
  - X=0 cross-section (extended)   -> the nested rings + capture hooks

Writes preview.png (4-up) and preview_section.png (the cross-section alone).
"""

import matplotlib
matplotlib.use("Agg")
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

import generate_bookmark as gb

FIXED_C  = "#3c6e9c"   # body + base + fixed ring
MOVE_C   = "#d98a3d"   # moving rings + plug


def mesh_of(man):
    m = gb.to_trimesh(man)
    return m


def shade(mesh, base, light=(0.4, 0.3, 0.85)):
    n = mesh.face_normals
    l = np.array(light) / np.linalg.norm(light)
    b = np.array(matplotlib.colors.to_rgb(base))
    inten = 0.55 + 0.45 * np.clip(n @ l, 0, 1)
    return np.clip(b[None, :] * inten[:, None], 0, 1)


def add_mesh(ax, mesh, base):
    tris = mesh.vertices[mesh.faces]
    pc = Poly3DCollection(tris, linewidths=0)
    pc.set_facecolor(shade(mesh, base))
    ax.add_collection3d(pc)


def set_iso(ax, meshes, elev, azim):
    V = np.vstack([m.vertices for m in meshes])
    c = V.mean(0)
    r = (V.max(0) - V.min(0)).max() / 2
    ax.set_xlim(c[0] - r, c[0] + r)
    ax.set_ylim(c[1] - r, c[1] + r)
    ax.set_zlim(c[2] - r, c[2] + r)
    ax.set_box_aspect((1, 1, 1))
    ax.view_init(elev=elev, azim=azim)
    ax.set_axis_off()


def section_xy(meshes_colors, x0, ax, focus=None):
    """Plot the X=x0 cross-section as true (y, z) outlines: y horizontal
    (bookmark length), z vertical (height). Outlines keep the nested rings and
    chevron capture hooks legible."""
    for mesh, col in meshes_colors:
        sec = mesh.section(plane_origin=[x0, 0, 0], plane_normal=[1, 0, 0])
        if sec is None:
            continue
        for loop in sec.discrete:            # list of (n,3) closed polylines
            ax.plot(loop[:, 1], loop[:, 2], color=col, lw=1.1)
    ax.set_aspect("equal")
    ax.grid(True, lw=0.3, alpha=0.4)
    if focus:
        ax.set_xlim(*focus[0])
        ax.set_ylim(*focus[1])


def main():
    fixed   = gb.build_fixed()
    moving  = gb.build_moving()
    ext     = gb.build_extended(moving)

    mf  = mesh_of(fixed)
    mm  = [mesh_of(m) for m in moving]
    me  = [mesh_of(m) for m in ext]
    allc = [mf] + mm
    alle = [mf] + me

    fig = plt.figure(figsize=(14, 10))

    ax = fig.add_subplot(2, 2, 1, projection="3d")
    add_mesh(ax, mf, FIXED_C)
    for m in mm:
        add_mesh(ax, m, MOVE_C)
    set_iso(ax, allc, elev=90, azim=-90)            # straight down
    ax.set_title("Top-down (collapsed) — the vortex", fontsize=11)

    ax = fig.add_subplot(2, 2, 2, projection="3d")
    add_mesh(ax, mf, FIXED_C)
    for m in mm:
        add_mesh(ax, m, MOVE_C)
    set_iso(ax, allc, elev=22, azim=-60)            # iso collapsed
    ax.set_title("Isometric (collapsed) — how it prints, flat", fontsize=11)

    ax = fig.add_subplot(2, 2, 3, projection="3d")
    add_mesh(ax, mf, FIXED_C)
    for m in me:
        add_mesh(ax, m, MOVE_C)
    set_iso(ax, alle, elev=14, azim=-60)            # iso extended
    ax.set_title("Isometric (extended) — telescoped cone", fontsize=11)

    yfoc = (gb.HEAD_CY - 23, gb.HEAD_CY + 23)
    zext = gb.FLOOR_Z + gb.ring_rise(gb.N_RING) + gb.RING_H + 4
    ax = fig.add_subplot(2, 2, 4)
    section_xy([(mf, FIXED_C)] + [(m, MOVE_C) for m in me], gb.SPIN_C[0], ax,
               focus=(yfoc, (-2, zext)))
    ax.set_title("X=0 section (extended) — nested rings + capture hooks",
                 fontsize=11)
    ax.set_xlabel("y — length (mm)"); ax.set_ylabel("z — height (mm)")

    fig.suptitle(
        f"Hexagon telescoping-vortex bookmark — {gb.N_RING} rings + plug, "
        f"{gb.TWIST[-1]:.0f}° twist, ~{gb.ring_rise(gb.N_RING):.0f} mm extension, "
        f"CLR {gb.CLR} mm", fontsize=13)
    fig.tight_layout(rect=[0, 0, 1, 0.97])
    fig.savefig("preview.png", dpi=110)
    print("wrote preview.png")

    # standalone, taller cross-section (collapsed vs extended side by side)
    zcol = gb.FLOOR_Z + gb.RING_H + gb.PLUG_PROUD + 3
    fig2, axes = plt.subplots(1, 2, figsize=(11, 7))
    section_xy([(mf, FIXED_C)] + [(mesh_of(m), MOVE_C) for m in moving],
               gb.SPIN_C[0], axes[0], focus=(yfoc, (-2, zext)))
    axes[0].set_title("Collapsed (as printed)")
    section_xy([(mf, FIXED_C)] + [(m, MOVE_C) for m in me], gb.SPIN_C[0], axes[1],
               focus=(yfoc, (-2, zext)))
    axes[1].set_title("Extended (pulled up)")
    for a in axes:
        a.set_xlabel("y — length (mm)"); a.set_ylabel("z — height (mm)")
    fig2.suptitle("X=0 cross-section — fixed (blue) vs moving (orange)")
    fig2.tight_layout()
    fig2.savefig("preview_section.png", dpi=120)
    print("wrote preview_section.png")


if __name__ == "__main__":
    main()
