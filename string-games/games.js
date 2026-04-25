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
    category: "Foundations",
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
    category: "Cat's Cradle Sequence",
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
    category: "Classic Figures",
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
    category: "Classic Figures",
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
    category: "Classic Figures",
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
    category: "Classic Figures",
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
    category: "Classic Figures",
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

  // ----------------------------------------------------------------------
  {
    id: "soldiers-bed",
    title: "Soldier's Bed",
    category: "Cat's Cradle Sequence",
    difficulty: 1,
    minutes: 2,
    blurb:
      "The first transform out of Cat's Cradle. A neat rectangle with two long parallel rails and a pair of slanting bars across the middle.",
    steps: [
      {
        title: "Have a partner hold Cat's Cradle",
        body:
          "Your partner stretches Cat's Cradle between their hands. Stand facing them with your palms open.",
        strings: [
          { from: "L2", to: "R2", curve: -70 },
          { from: "L5", to: "R5", curve: 70 },
          { from: "L3", to: "R3", curve: -25 },
          { from: "L3", to: "R3", curve: 25 },
          { points: ["L2", "R3"], curve: -10 },
          { points: ["R2", "L3"], curve: -10 },
        ],
      },
      {
        title: "Pinch the two crosses",
        body:
          "Reach into the figure and pinch each X (where the centre strings cross) between your thumb and index finger — left X with your left hand, right X with your right.",
        strings: [
          { from: "L2", to: "R2", curve: -70 },
          { from: "L5", to: "R5", curve: 70 },
          { points: ["L2", "R3"], curve: -10, new: true },
          { points: ["R2", "L3"], curve: -10, new: true },
        ],
      },
      {
        title: "Down, around, up through the middle",
        body:
          "Pull the two pinched crossings out to your sides, down under the outer strings, and back up through the centre. As you spread your hands, your partner releases.",
        tip:
          "Keep the pinch tight while you swing under — if the X slips you'll get a tangle instead of the bed.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "R1", curve: 0, new: true },
          { from: "L1", to: "R1", curve: -10, new: true },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "candles",
    title: "Candles",
    category: "Cat's Cradle Sequence",
    difficulty: 2,
    minutes: 2,
    blurb:
      "Also called Chopsticks. Two long, perfectly parallel strings — the next handoff after Soldier's Bed.",
    steps: [
      {
        title: "Start with Soldier's Bed on a partner",
        body:
          "Your partner holds Soldier's Bed (two parallel rails plus crossed centre bars).",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "R1", curve: 0 },
          { from: "L1", to: "R1", curve: -10 },
        ],
      },
      {
        title: "Hook the centre crossings with little fingers",
        body:
          "Reach your little fingers in from the outside and hook each centre crossing — left pinky catches the left X, right pinky catches the right.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "R1", curve: 0 },
          { from: "L1", to: "R1", curve: -10 },
          { points: ["L5", "Lpalm"], curve: 0, new: true },
          { points: ["R5", "Rpalm"], curve: 0, new: true },
        ],
      },
      {
        title: "Pull down and out, then up through the rails",
        body:
          "Drag the crossings down and outward, then sweep up between the two long rails. Spread your thumbs and pinkies as your partner lets go.",
        tip:
          "If you don't see two clean parallel verticals, you've snagged a rail — drop the loops, ask your partner to redo Soldier's Bed, and try again.",
        strings: [
          { from: "L1", to: "L5" },
          { from: "R1", to: "R5" },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "manger-diamonds",
    title: "Diamonds",
    category: "Cat's Cradle Sequence",
    difficulty: 2,
    minutes: 2,
    blurb:
      "Also called Cat's Eye or the Manger. Two diamond-shaped windows centred between your hands.",
    steps: [
      {
        title: "Start with Candles on a partner",
        body:
          "Your partner holds Candles — two parallel verticals stretched between their hands.",
        strings: [
          { from: "L1", to: "L5" },
          { from: "R1", to: "R5" },
        ],
      },
      {
        title: "Thumbs and indexes in, from above",
        body:
          "Bring both thumbs in from outside-below the candles and both index fingers in from above. Pinch each candle between thumb and index.",
        strings: [
          { from: "L1", to: "L5" },
          { from: "R1", to: "R5" },
          { points: ["L1", "L2"], curve: 0, new: true },
          { points: ["R1", "R2"], curve: 0, new: true },
        ],
      },
      {
        title: "Twist away, take the figure",
        body:
          "Roll your wrists outward — thumbs sweep down and away, indexes sweep up — so each candle twists into a diamond. Spread to set the shape as your partner releases.",
        strings: [
          { from: "L1", to: "R1", curve: 30 },
          { from: "L2", to: "R2", curve: -30 },
          { points: ["L1", [240, 200], "L2"] },
          { points: ["R1", [360, 200], "R2"] },
          { points: ["L2", [300, 170], "R2"] },
          { points: ["L1", [300, 240], "R1"] },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "fish-in-a-dish",
    title: "Fish in a Dish",
    category: "Cat's Cradle Sequence",
    difficulty: 2,
    minutes: 2,
    blurb:
      "The traditional last figure of the Cat's Cradle handoff sequence — an oval dish with a fish-shaped lozenge inside.",
    steps: [
      {
        title: "Start with Diamonds on a partner",
        body:
          "Your partner holds Diamonds (two diamond windows side by side).",
        strings: [
          { from: "L1", to: "R1", curve: 30 },
          { from: "L2", to: "R2", curve: -30 },
          { points: ["L1", [240, 200], "L2"] },
          { points: ["R1", [360, 200], "R2"] },
          { points: ["L2", [300, 170], "R2"] },
          { points: ["L1", [300, 240], "R1"] },
        ],
      },
      {
        title: "Pinch the centre triangles",
        body:
          "Reach in and pinch the small triangles at the centre top and centre bottom of the figure between thumb and index of each hand.",
        strings: [
          { from: "L1", to: "R1", curve: 30 },
          { from: "L2", to: "R2", curve: -30 },
          { points: ["L2", [300, 170], "R2"], new: true },
          { points: ["L1", [300, 240], "R1"], new: true },
        ],
      },
      {
        title: "Lift up and spread",
        body:
          "Pull the pinched triangles up and apart while your partner releases. The outer strings round into a dish; the inner strings settle into a fish-shaped lozenge.",
        tip:
          "Wiggle one wrist gently — the 'fish' inside the dish will swim.",
        strings: [
          { points: ["L1", [300, 320], "R1"], curve: 0 },
          { points: ["L2", [300, 80], "R2"], curve: 0 },
          { points: ["L3", [260, 200], "R3", [340, 200], "L3"], curve: 0 },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "apache-door",
    title: "Apache Door",
    category: "Classic Figures",
    difficulty: 3,
    minutes: 5,
    blurb:
      "A wide curtain with an opening down the middle — the entrance to a brush house. One of the great showpiece figures.",
    steps: [
      {
        title: "Start with Opening A",
        body:
          "Make Opening A on your hands.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
        ],
      },
      {
        title: "Thumbs over and pick up the far middle string",
        body:
          "Bring each thumb over the near index string, over both middle strings, and under the far middle string. Lift to bring it back on the thumb.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { from: "L1", to: "R1", curve: -25, new: true },
        ],
      },
      {
        title: "Drop the middle fingers",
        body:
          "Release both middle finger loops. Spread to take up the slack.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "R1", curve: -25 },
          { from: "L3", to: "R3", curve: -10, loose: true },
          { from: "L3", to: "R3", curve: 10, loose: true },
        ],
      },
      {
        title: "Pass the index loops over the thumbs",
        body:
          "Lift each index loop over your thumb and let it drop behind. Each thumb now has the original thumb loop and the old index loop above it.",
        strings: [
          { from: "L1", to: "R1", curve: -25 },
          { from: "L1", to: "R1", curve: -10, new: true },
          { from: "L5", to: "R5", curve: 60 },
        ],
      },
      {
        title: "Navaho the thumbs",
        body:
          "On each hand, pick up the lower thumb loop with your teeth or other hand and lift it over the upper loop, dropping it off the thumb. Only the upper loop remains.",
        strings: [
          { from: "L1", to: "R1", curve: -10 },
          { from: "L5", to: "R5", curve: 60 },
        ],
      },
      {
        title: "Turn the palms forward to open the door",
        body:
          "Rotate your hands so palms face away. Bend your indexes down toward you to catch the far thumb string, then straighten. The figure unfolds into a wide curtain split down the middle.",
        tip:
          "If the door's edges look ragged, gently tug your pinkies outward and down to set the side rails.",
        strings: [
          { from: "L1", to: "L5", curve: 0 },
          { from: "R1", to: "R5", curve: 0 },
          { points: ["L1", [260, 200], "L5"] },
          { points: ["R1", [340, 200], "R5"] },
          { from: "L2", to: "R2", curve: -40 },
          { from: "L1", to: "R1", curve: 60 },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "many-stars",
    title: "Many Stars",
    category: "Classic Figures",
    difficulty: 3,
    minutes: 6,
    blurb:
      "A row of small star shapes across the centre of the figure. Sometimes called Five Stars or Six Stars depending on how it settles.",
    steps: [
      {
        title: "Position One",
        body:
          "Loop the string behind the four fingers of each hand.",
        strings: [
          { from: "L2", to: "R2", curve: -60, new: true },
          { from: "L5", to: "R5", curve: 60, new: true },
        ],
      },
      {
        title: "Thumbs pick up the far pinky string",
        body:
          "Reach each thumb over the near string, then under the far string and back. Each thumb now carries a loop.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "R1", curve: -20, new: true },
        ],
      },
      {
        title: "Indexes pick up the far thumb string",
        body:
          "Bring each index finger from above down between the thumb strings, hook the far thumb string, and pull it back.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "R1", curve: -20 },
          { from: "L2", to: "R2", curve: 0, new: true },
        ],
      },
      {
        title: "Twist the index loops",
        body:
          "Rotate each index downward, away from you, and back up — putting one full twist in each index loop.",
        strings: [
          { from: "L2", to: "R2", curve: -40 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L1", to: "R1", curve: -20 },
          { from: "L2", to: "R2", curve: 5 },
          { points: ["L2", [240, 160], "R2", [360, 160], "L2"], curve: 0, new: true },
        ],
      },
      {
        title: "Pinkies pick up the far index string from below",
        body:
          "Bend each pinky over the far pinky string and back under the new far index string, picking it up. Drop the original pinky string.",
        strings: [
          { from: "L2", to: "R2", curve: -40 },
          { from: "L1", to: "R1", curve: -20 },
          { from: "L5", to: "R5", curve: 60, new: true },
          { points: ["L2", [240, 160], "R2", [360, 160], "L2"], curve: 0 },
        ],
      },
      {
        title: "Drop the thumbs and turn out",
        body:
          "Release the thumb loops. Rotate your hands so the palms face forward and pull gently. A row of small stars appears across the middle.",
        tip:
          "Don't yank — Many Stars settles slowly. Apply tension by inches, not by feet.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          // five stars across
          ...starsRow(5),
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "inuit-butterfly",
    title: "Inuit Butterfly",
    category: "World Traditions",
    difficulty: 2,
    minutes: 4,
    blurb:
      "A symmetrical figure from the Arctic — two outstretched wings meeting at a slim body in the middle.",
    steps: [
      {
        title: "Start with Opening A",
        body:
          "Loop behind the fingers, then catch each palm string with the opposite middle finger.",
        strings: [
          { from: "L2", to: "R2", curve: -60 },
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
        ],
      },
      {
        title: "Pass the index loops over the wrist",
        body:
          "Lift the loop on each index finger up, over your hand, and let it drop behind your wrist.",
        strings: [
          { from: "L5", to: "R5", curve: 60 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { from: "Lwrist", to: "Rwrist", curve: -120, new: true },
        ],
      },
      {
        title: "Pass the pinky loops over the wrist too",
        body:
          "Now lift each pinky loop up, over the hand, and drop it behind the wrist alongside the index loops.",
        strings: [
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { from: "Lwrist", to: "Rwrist", curve: -120 },
          { from: "Lwrist", to: "Rwrist", curve: 120, new: true },
        ],
      },
      {
        title: "Bring the middle loops down between the wrist strings",
        body:
          "Bend each middle finger forward and down, carrying its loop between the two strings on its wrist. Then straighten the fingers up.",
        strings: [
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { from: "Lwrist", to: "Rwrist", curve: -120 },
          { from: "Lwrist", to: "Rwrist", curve: 120 },
          { points: ["L3", "Lwrist"], new: true },
          { points: ["R3", "Rwrist"], new: true },
        ],
      },
      {
        title: "Spread to open the wings",
        body:
          "Pull your hands smoothly apart. The wrist strings flare outward like wings; the centre loops form the slim body of the butterfly.",
        strings: [
          { points: ["L3", "Lwrist"], curve: 0 },
          { points: ["R3", "Rwrist"], curve: 0 },
          { from: "L3", to: "R3", curve: -10 },
          { from: "L3", to: "R3", curve: 10 },
          { points: ["Lwrist", [220, 350], [300, 280], [380, 350], "Rwrist"], curve: 0 },
          { points: ["Lwrist", [220, 60], [300, 130], [380, 60], "Rwrist"], curve: 0 },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  {
    id: "cutting-off-head",
    title: "Cutting Off the Head",
    category: "Tricks & Magic",
    difficulty: 2,
    minutes: 2,
    blurb:
      "A magic-trick figure: the loop seems to wrap around your friend's neck, then comes free without touching them. Always do it gently and with consent.",
    steps: [
      {
        title: "Hold the loop horizontally",
        body:
          "Stretch the loop between both hands, palms facing your friend, the string running side to side at neck height.",
        strings: [
          { from: "L1", to: "R1", curve: -10, new: true },
          { from: "L1", to: "R1", curve: 10, new: true },
        ],
      },
      {
        title: "Cross your wrists",
        body:
          "Cross your right hand over your left so the strings form an X in front of you. Make sure each hand still holds its own end.",
        strings: [
          { points: ["L1", [350, 220], "R1"], new: true },
          { points: ["L1", [250, 220], "R1"], new: true },
        ],
      },
      {
        title: "Loop around the neck (gently)",
        body:
          "Bring the front strand around behind your friend's neck so the loop appears to encircle them. The crossed wrists hide the trick.",
        strings: [
          { points: ["L1", [300, 100], "R1"], curve: 0 },
          { points: ["L1", [300, 280], "R1"], curve: 0 },
        ],
      },
      {
        title: "Snap your hands apart",
        body:
          "Quickly pull your hands straight out. Because of the cross, the string slides cleanly past — appearing to pass through the neck.",
        tip:
          "Practise it on a chair back first. Pull only along the line of the string; never yank toward yourself.",
        strings: [
          { from: "L1", to: "R1", curve: -10 },
          { from: "L1", to: "R1", curve: 10 },
        ],
      },
    ],
  },
];

/* Helpers used by some of the diagrams above. */
function starsRow(n) {
  const out = [];
  const left = 180;
  const right = 420;
  const step = (right - left) / (n - 1);
  const y = 200;
  for (let i = 0; i < n; i++) {
    const cx = left + step * i;
    out.push({ points: starShape(cx, y, 18), curve: 0 });
  }
  return out;
}

function starShape(cx, cy, r) {
  // 5-point star polyline
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const a = (-Math.PI / 2) + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push([Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr)]);
  }
  return pts;
}
