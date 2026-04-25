/* Anchor points on the two-hand diagram.
 * Coordinate system: 600 x 400 SVG viewBox.
 * Each finger has a tip point used to anchor strings.
 *  L1..L5 = left hand thumb..pinky
 *  R1..R5 = right hand thumb..pinky
 *  Lpalm / Rpalm  = palm centers (used for "across the palm" strings)
 *  Lwrist / Rwrist = wrist anchors (Jacob's Ladder release etc.)
 */
const ANCHORS = {
  L1: [120, 215], // thumb
  L2: [142, 130], // index
  L3: [165, 110], // middle
  L4: [188, 122], // ring
  L5: [210, 152], // pinky
  Lpalm: [165, 200],
  Lwrist: [165, 290],

  R1: [480, 215],
  R2: [458, 130],
  R3: [435, 110],
  R4: [412, 122],
  R5: [390, 152],
  Rpalm: [435, 200],
  Rwrist: [435, 290],
};

/* A string segment is described as either:
 *   { from: "L2", to: "R2" }                     -> straight line
 *   { from: "L2", to: "R2", curve: -40 }         -> quadratic curve, +/- vertical bend
 *   { points: ["L2","L3","R3","R2"], curve: -20} -> polyline through anchors
 *   add `new: true` to highlight the strand added in this step
 *   add `loose: true` to render as dashed (slack/ released)
 */

const GAMES = [
  // ----------------------------------------------------------------------
  {
    id: "opening-a",
    title: "Opening A",
    difficulty: 1,
    minutes: 2,
    blurb:
      "The starting position for dozens of figures, including Cat's Cradle, Cup and Saucer, and the Eiffel Tower. Learn this once and the rest unlocks.",
    steps: [
      {
        title: "Loop the string around your hands",
        body:
          "Slip the loop of string over both hands so it rests behind your four fingers (not the thumbs). The string runs across the back of your fingers and across your palms.",
        tip:
          "Keep your palms facing each other, fingers pointing up, hands about 25 cm apart.",
        strings: [
          { from: "L5", to: "R5", curve: 60, new: true }, // near string (palm side)
          { from: "L2", to: "R2", curve: -60, new: true }, // far string (back side)
        ],
      },
      {
        title: "Catch the palm string with your right middle finger",
        body:
          "Reach your right middle finger across and slide it under the string lying across your left palm. Pull that strand back toward your right hand.",
        strings: [
          { from: "L5", to: "R5", curve: 60 },
          { from: "L2", to: "R2", curve: -60 },
          {
            points: ["Lpalm", "R3"],
            curve: 30,
            new: true,
          },
        ],
      },
      {
        title: "Catch the palm string with your left middle finger",
        body:
          "Now reach your left middle finger under the string crossing your right palm and pull it back. Spread your hands gently to take up the slack.",
        tip:
          "You should now see two triangles meeting in the middle — the classic 'Opening A' shape.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10, new: true },
          { from: "L3", to: "R3", curve: 10, new: true },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "cats-cradle",
    title: "Cat's Cradle",
    difficulty: 1,
    minutes: 3,
    blurb:
      "The figure that gives the whole tradition its name. A two-player back-and-forth — but you can also pose it solo as a study.",
    steps: [
      {
        title: "Wrap the loop twice around each hand",
        body:
          "Slip the loop over both hands and let it sit across the back of the four fingers. Then bring the loop around the back of each hand once more so the string crosses your palm twice.",
        strings: [
          { from: "L5", to: "R5", curve: 70, new: true },
          { from: "L5", to: "R5", curve: 30, new: true },
          { from: "L2", to: "R2", curve: -30, new: true },
          { from: "L2", to: "R2", curve: -70, new: true },
        ],
      },
      {
        title: "Hook the far palm string with the right middle finger",
        body:
          "Bring your right middle finger under the string that crosses your left palm and pull it back to your right hand.",
        strings: [
          { from: "L5", to: "R5", curve: 70 },
          { from: "L5", to: "R5", curve: 30 },
          { from: "L2", to: "R2", curve: -30 },
          { from: "L2", to: "R2", curve: -70 },
          { points: ["Lpalm", "R3"], curve: 20, new: true },
        ],
      },
      {
        title: "Hook the other palm string with the left middle finger",
        body:
          "Reach your left middle finger under the string that now crosses your right palm and bring it back. Spread your hands to set the figure.",
        tip:
          "If both middle fingers are looped through the centre and your palms still hold the wraps, you've made Cat's Cradle.",
        strings: [
          { from: "L2", to: "R2", curve: -70 },
          { from: "L5", to: "R5", curve: 70 },
          { from: "L3", to: "R3", curve: -25, new: true },
          { from: "L3", to: "R3", curve: 25, new: true },
          { points: ["L2", "R3"], curve: -10 },
          { points: ["R2", "L3"], curve: -10 },
        ],
      },
      {
        title: "Hand it off (optional)",
        body:
          "A partner pinches the two crossings between thumb and index finger of each hand, slides under the outer strings, and lifts away — transforming Cat's Cradle into the next figure (Soldier's Bed).",
        tip:
          "No partner? Just admire the symmetry. The figure is also called The Manger in some traditions.",
        strings: [
          { from: "L2", to: "R2", curve: -70 },
          { from: "L5", to: "R5", curve: 70 },
          { from: "L3", to: "R3", curve: -25 },
          { from: "L3", to: "R3", curve: 25 },
          { points: ["L2", "R3"], curve: -10 },
          { points: ["R2", "L3"], curve: -10 },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "cup-and-saucer",
    title: "Cup and Saucer",
    difficulty: 1,
    minutes: 3,
    blurb:
      "A small cup balanced on a flat saucer. One of the most satisfying single-figure tricks because the shape is unmistakable.",
    steps: [
      {
        title: "Begin with Opening A",
        body:
          "Make Opening A on your hands (loop behind the four fingers, then catch each palm string with the opposite middle finger).",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
        ],
      },
      {
        title: "Drop the thumb loops (there aren't any yet)",
        body:
          "Bring both thumbs over the near string and under the far string, then up — picking up the far string on the back of each thumb.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { from: "L1", to: "R1", curve: -20, new: true },
        ],
      },
      {
        title: "Release the little fingers",
        body:
          "Let the loops slip off both pinkies. The string near your palms drops away, leaving the cup's body suspended between your thumbs and middle fingers.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { from: "L1", to: "R1", curve: -20 },
          { from: "L5", to: "R5", curve: 60, loose: true },
        ],
      },
      {
        title: "Reveal the cup",
        body:
          "Pull your hands apart smoothly. The two horizontal strands form the rim of the cup; the centre triangles form the base; the bottom strand is the saucer.",
        tip:
          "Tilt your hands so the saucer faces forward. Pour imaginary tea.",
        strings: [
          { from: "L1", to: "R1", curve: -10 }, // top of cup
          { from: "L3", to: "R3", curve: 10 }, // bottom of cup
          { points: ["L1", "L3"], curve: 0 },
          { points: ["R1", "R3"], curve: 0 },
          { from: "L2", to: "R2", curve: -45 }, // saucer
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "witchs-broom",
    title: "Witch's Broom",
    difficulty: 2,
    minutes: 3,
    blurb:
      "A long handle with a frayed sweep at one end. Builds on Cup and Saucer with one extra move.",
    steps: [
      {
        title: "Make Cup and Saucer first",
        body:
          "Form the Cup and Saucer on your hands (start with Opening A, lift the far string with both thumbs, drop the pinkies).",
        strings: [
          { from: "L1", to: "R1", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { points: ["L1", "L3"], curve: 0 },
          { points: ["R1", "R3"], curve: 0 },
          { from: "L2", to: "R2", curve: -45 },
        ],
      },
      {
        title: "Tip the cup forward",
        body:
          "Bring both index fingers up and over the saucer string, then poke them down through the cup. You will end up holding the figure pointed away from you like a torch.",
        strings: [
          { from: "L1", to: "R1", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { points: ["L1", "L3"], curve: 0 },
          { points: ["R1", "R3"], curve: 0 },
          { from: "L2", to: "R2", curve: -45 },
          { points: ["L2", "Lpalm"], new: true },
          { points: ["R2", "Rpalm"], new: true },
        ],
      },
      {
        title: "Release the thumbs",
        body:
          "Let the thumb loops drop. The figure swings into a long handle with a bushy end — the witch's broom.",
        tip:
          "Hold one hand above the other to make the broom 'stand up.'",
        strings: [
          { from: "L3", to: "R3", curve: 10 },
          { points: ["L1", "L3"], curve: 0, loose: true },
          { points: ["R1", "R3"], curve: 0, loose: true },
          { from: "L2", to: "R2", curve: -45 },
          { points: ["L2", "Lwrist"], curve: -10, new: true },
          { points: ["R2", "Rwrist"], curve: 10, new: true },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "eiffel-tower",
    title: "Eiffel Tower",
    difficulty: 2,
    minutes: 4,
    blurb:
      "A tall, narrow lattice with two spreading legs. A crowd-pleaser and a great study in symmetry.",
    steps: [
      {
        title: "Begin with Opening A",
        body:
          "Loop the string behind your fingers, then catch each palm string with the opposite middle finger. You should see two triangles meeting in the middle.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
        ],
      },
      {
        title: "Thumbs over and up",
        body:
          "Bring both thumbs over the near index string and the near middle string, then under the far middle string. Lift to bring the far middle string back toward you on the back of each thumb.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { from: "L1", to: "R1", curve: -25, new: true },
        ],
      },
      {
        title: "Release the index and middle fingers",
        body:
          "Let the loops drop off both index fingers and both middle fingers at the same time. The string snaps into a long diamond.",
        tip:
          "Lift slightly with your thumbs and pinkies as the loops fall — it helps the figure settle cleanly.",
        strings: [
          { from: "L1", to: "R1", curve: -25 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "L5", curve: -10, new: true },
          { from: "R1", to: "R5", curve: 10, new: true },
          { from: "L3", to: "R3", curve: -10, loose: true },
          { from: "L3", to: "R3", curve: 10, loose: true },
        ],
      },
      {
        title: "Hold it up to the light",
        body:
          "Turn your hands so your palms face away from you and tilt them downward. The diamond stretches into the tower's silhouette: a narrow top, a wide arched base, and the long lattice in between.",
        strings: [
          { from: "L1", to: "R1", curve: -25 },
          { from: "L5", to: "R5", curve: 70 },
          { from: "L1", to: "L5", curve: -10 },
          { from: "R1", to: "R5", curve: 10 },
          { points: ["L1", "Lpalm", "L5"], curve: 0 },
          { points: ["R1", "Rpalm", "R5"], curve: 0 },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "jacobs-ladder",
    title: "Jacob's Ladder",
    difficulty: 3,
    minutes: 6,
    blurb:
      "Five neat diamonds in a row — also called the Osage Diamonds. The most famous of the longer figures, and the gateway to advanced string work.",
    steps: [
      {
        title: "Position One",
        body:
          "Loop the string behind your four fingers (not the thumbs) so it rests across the back of each hand and across each palm.",
        strings: [
          { from: "L5", to: "R5", curve: 60, new: true },
          { from: "L2", to: "R2", curve: -60, new: true },
        ],
      },
      {
        title: "Pick up with the thumbs",
        body:
          "Bring each thumb under the near string and pick it up. You now have a loop on each thumb and a loop on each pinky.",
        strings: [
          { from: "L5", to: "R5", curve: 60 },
          { from: "L2", to: "R2", curve: -60 },
          { from: "L1", to: "R1", curve: -20, new: true },
        ],
      },
      {
        title: "Index hooks across the palm",
        body:
          "Reach your right index finger under the string that crosses your left palm and pull it back. Then do the same with your left index finger under the right palm string.",
        strings: [
          { from: "L5", to: "R5", curve: 60 },
          { from: "L2", to: "R2", curve: -60 },
          { from: "L1", to: "R1", curve: -20 },
          { points: ["Lpalm", "R2"], curve: 10, new: true },
          { points: ["Rpalm", "L2"], curve: 10, new: true },
        ],
      },
      {
        title: "Drop the thumbs",
        body:
          "Release both thumb loops. Let them fall away.",
        strings: [
          { from: "L5", to: "R5", curve: 60 },
          { from: "L2", to: "R2", curve: -60 },
          { from: "L1", to: "R1", curve: -20, loose: true },
          { points: ["Lpalm", "R2"], curve: 10 },
          { points: ["Rpalm", "L2"], curve: 10 },
        ],
      },
      {
        title: "Thumbs back through",
        body:
          "Bring each thumb under the far pinky string and over the far index string, then pull back. New thumb loops are formed from the deep string.",
        strings: [
          { from: "L5", to: "R5", curve: 60 },
          { from: "L2", to: "R2", curve: -60 },
          { from: "L1", to: "R1", curve: 30, new: true },
          { points: ["Lpalm", "R2"], curve: 10 },
          { points: ["Rpalm", "L2"], curve: 10 },
        ],
      },
      {
        title: "Pinkies over and pick up",
        body:
          "Bend each pinky over the near index string and pick up the far thumb string from below, returning it to the pinky.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L1", to: "R1", curve: 30 },
          { points: ["Lpalm", "R2"], curve: 10 },
          { points: ["Rpalm", "L2"], curve: 10 },
          { from: "L5", to: "R5", curve: 30, new: true },
          { points: ["L5", "L1"], curve: -5, new: true },
          { points: ["R5", "R1"], curve: -5, new: true },
        ],
      },
      {
        title: "Drop the thumbs again, then turn out",
        body:
          "Drop both thumb loops. Rotate your hands so the palms face away and the fingers point up — letting the index loop slide off as you turn. The figure settles into five diamonds in a row.",
        tip:
          "If a diamond looks tangled, gently work the strings between two fingers — the figure usually loosens into shape if you keep tension.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { points: ["L2", "Lpalm"], curve: 0 },
          { points: ["R2", "Rpalm"], curve: 0 },
          // five diamonds
          { points: [[150, 200], [210, 170], [270, 200], [210, 230], [150, 200]] },
          { points: [[210, 170], [270, 140], [330, 170], [270, 200], [210, 170]] },
          { points: [[270, 200], [330, 170], [390, 200], [330, 230], [270, 200]] },
          { points: [[330, 170], [390, 140], [450, 170], [390, 200], [330, 170]] },
          { points: [[390, 200], [450, 170], [450, 200], [390, 230], [390, 200]] },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "cats-whiskers",
    title: "Cat's Whiskers",
    difficulty: 2,
    minutes: 3,
    blurb:
      "A small face with crisp diagonal whiskers. A nice short figure once you're comfortable with thumb pickups.",
    steps: [
      {
        title: "Begin with Opening A",
        body: "Same opening as Cat's Cradle: loop behind the fingers, then catch each palm string with the opposite middle finger.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
        ],
      },
      {
        title: "Thumbs into the small triangles",
        body:
          "Push each thumb into the small near triangle on its own side (between the index and middle finger strings) from below.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { points: ["L1", "L2"], new: true },
          { points: ["R1", "R2"], new: true },
        ],
      },
      {
        title: "Pinkies into the small triangles",
        body:
          "Now push each pinky into the small far triangle on its own side, mirroring the thumbs.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { points: ["L1", "L2"] },
          { points: ["R1", "R2"] },
          { points: ["L5", "L4"], new: true },
          { points: ["R5", "R4"], new: true },
        ],
      },
      {
        title: "Drop the middles and stretch",
        body:
          "Release both middle fingers and pull your hands gently apart. Two crisp diagonal whiskers cross the centre — the cat is staring back at you.",
        tip:
          "Rock your hands forward and back to make the whiskers twitch.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "R5", curve: 0, new: true },
          { from: "R1", to: "L5", curve: 0, new: true },
        ],
      },
    ],
  },
];
