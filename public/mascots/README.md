# Mascots

Four mascots — Harold (pink heart), Blue (gorilla), White (lion), Yellow
(cloud) — each with a palette of moods. Filenames match the entries in
`src/lib/mascots.ts`.

## Current files

| File | Mascot | Mood |
|---|---|---|
| `harold.png` | Harold (pink heart) | default (peaceful) |
| `harold-happy.png` | Harold | cheering, arms up |
| `harold-peaceful.png` | Harold | eyes closed, hands clasped |
| `harold-sad.png` | Harold | shy, shoulders in |
| `harold-angry.png` | Harold | scowling |
| `harold-love.png` | Harold | heart eyes |
| `blue-happy.png` | Blue | leaping, excited |
| `blue-peaceful.png` | Blue | eyes closed, praying |
| `blue-cry.png` | Blue | crying |
| `blue-angry.png` | Blue | fierce, arms wide |
| `blue-worried.png` | Blue | hands over mouth |
| `white-happy.png` | White | arms up celebrating |
| `white-peaceful.png` | White | eyes closed, praying |
| `white-cry.png` | White | crying |
| `white-angry.png` | White | scowling, mane flared |
| `white-worried.png` | White | hands over mouth |
| `white-calm.png` | White | self-hug, content |
| `yellow-happy.png` | Yellow | cheering, fists up |
| `yellow-peaceful.png` | Yellow | eyes closed, hands clasped |
| `yellow-sad.png` | Yellow | frowning |
| `yellow-tired.png` | Yellow | head down |
| `yellow-cry.png` | Yellow | crying |
| `yellow-angry.png` | Yellow | scowling |

## Adding new mascots / moods

1. Drop the PNG in `/public/mascots/` (transparent bg, PNG @3x recommended)
2. Add the name to `MascotName` in `src/lib/mascots.ts` and map it in `SOURCES`
3. Reference it with `<MascotImage name="your-name" />` anywhere

Missing files silently fall back to `harold.png`, so uploads can land
before code changes without breaking the site.
