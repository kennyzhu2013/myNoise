import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { callsFor, sceneListeningNote, sharedBedStems, stemCredits, stemFor } from "./stems.ts";

const root = path.resolve(import.meta.dirname, "../..");

test("each fader in a scene has its own bed file", () => {
  assert.deepEqual(sharedBedStems(), []);
});

test("the four original scenes keep their stem mapping", () => {
  assert.equal(stemFor("eave-rain", "curtain")?.id, "rain-roof");
  assert.equal(stemFor("eave-rain", "threads")?.id, "rain-leaves");
  assert.equal(stemFor("eave-rain", "distant")?.id, "rainfall");
  assert.equal(stemFor("eave-rain", "wind")?.id, "wind-trees");
  assert.equal(stemFor("eave-rain", "eaves"), null);
  assert.equal(stemFor("coast", "deep")?.id, "ocean-calm");
  assert.equal(stemFor("coast", "horizon")?.id, "ocean-far");
  assert.equal(stemFor("coast", "break")?.id, "shingle");
  assert.equal(stemFor("coast", "foam")?.id, "sea-foam");
  assert.equal(stemFor("coast", "ripples")?.id, "tide-lap");
  assert.equal(stemFor("coast", "wash")?.id, "shore-wash");
  assert.equal(stemFor("coast", "breeze")?.id, "wind-open");
  assert.equal(callsFor("coast", "gulls").length, 5);
  assert.equal(stemFor("forest", "canopy")?.id, "leaves-wind");
  assert.equal(stemFor("forest", "leaves")?.id, "dry-leaves");
  assert.equal(stemFor("forest", "under")?.id, "forest-bed");
  assert.equal(stemFor("forest", "gust")?.id, "wind-trees");
  assert.equal(stemFor("forest", "floor")?.id, "forest-quiet");
  assert.equal(stemFor("creek", "main")?.id, "creek-close");
  assert.equal(stemFor("creek", "shallows")?.id, "creek-trickle");
  assert.equal(stemFor("creek", "seep")?.id, "seep");
  assert.equal(stemFor("creek", "pool")?.id, "river");
  assert.equal(stemFor("creek", "far")?.id, "brook-far");
  assert.equal(stemFor("creek", "bank")?.id, "grass-wind");
});

test("the five extended scenes map recordings and leave the unmatched layers on synth", () => {
  for (const id of ["roar", "sheet", "mist", "pool", "side"]) {
    assert.ok(stemFor("waterfall", id));
  }
  assert.equal(stemFor("waterfall", "gap"), null);
  assert.equal(stemFor("waterfall", "sub"), null);
  assert.ok(callsFor("waterfall", "spray").length >= 3);
  assert.ok(callsFor("waterfall", "drops").length >= 3);

  for (const id of ["rain", "threads", "wetwind", "burst"]) {
    assert.ok(stemFor("thunder-night", id));
  }
  assert.equal(stemFor("thunder-night", "indoor"), null);
  assert.equal(stemFor("thunder-night", "pressure"), null);
  assert.ok(callsFor("thunder-night", "drips").length >= 3);
  assert.ok(callsFor("thunder-night", "far").length >= 3);
  assert.ok(callsFor("thunder-night", "near").length >= 3);

  for (const id of ["field", "grass", "low", "far", "gap", "dust", "blast", "twigs"]) {
    assert.ok(stemFor("wind", id));
  }
  assert.equal(stemFor("wind", "ear"), null);

  for (const id of ["crickets", "other", "katydid", "night-wind", "grassbed", "low-night"]) {
    assert.ok(stemFor("night-insects", id));
  }
  assert.ok(callsFor("night-insects", "frogs").length >= 3);
  assert.ok(callsFor("night-insects", "dew").length >= 2);
  assert.ok(callsFor("night-insects", "night-bird").length >= 3);

  assert.ok(stemFor("campfire", "bed"));
  assert.ok(stemFor("campfire", "heat"));
  assert.equal(stemFor("campfire", "coal"), null);
  assert.equal(stemFor("campfire", "night"), null);
  assert.equal(stemFor("campfire", "ember"), null);
  assert.equal(callsFor("campfire", "shift").length, 0);
  assert.ok(callsFor("campfire", "crackle").length >= 3);
  assert.ok(callsFor("campfire", "pops").length >= 3);
  assert.ok(callsFor("campfire", "sparks").length >= 3);
});

test("every scene with recordings has a listening note and a real file", () => {
  for (const slug of ["eave-rain", "coast", "forest", "creek", "waterfall", "thunder-night", "wind", "night-insects", "campfire"]) {
    assert.match(sceneListeningNote(slug) ?? "", /CC0/);
  }
  const seen = new Set();
  for (const stem of stemCredits()) {
    assert.equal(stem.license, "CC0 1.0");
    assert.match(stem.sourceUrl, /^https:\/\/freesound\.org\/s\/\d+\/$/);
    const file = path.join(root, "public", stem.src);
    assert.equal(fs.existsSync(file), true, stem.src);
    seen.add(stem.id);
  }
  assert.equal(seen.size, stemCredits().length);
});
