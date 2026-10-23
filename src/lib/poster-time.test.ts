import assert from "node:assert/strict";
import { test } from "node:test";
import { endOfSunday, fromNairobiInput, nairobiDay, toNairobiInput } from "./poster-time";

test("the pop-up day turns over at midnight Nairobi time, not UTC", () => {
  assert.equal(nairobiDay(new Date("2026-10-24T20:59:00Z")), "2026-10-24");
  assert.equal(nairobiDay(new Date("2026-10-24T21:00:00Z")), "2026-10-25");
});

test("admin times are read and shown in Nairobi time", () => {
  assert.equal(fromNairobiInput("2026-10-25T23:59")?.toISOString(), "2026-10-25T20:59:00.000Z");
  assert.equal(toNairobiInput(new Date("2026-10-25T20:59:00Z")), "2026-10-25T23:59");
  assert.equal(fromNairobiInput("not a date"), null);
  assert.equal(fromNairobiInput(""), null);
});

test("until Sunday midnight runs to the end of the coming Sunday", () => {
  const sundayEnd = "2026-10-25T20:59:59.999Z";
  assert.equal(endOfSunday(new Date("2026-10-23T09:00:00Z")).toISOString(), sundayEnd); // Friday
  assert.equal(endOfSunday(new Date("2026-10-25T18:00:00Z")).toISOString(), sundayEnd); // Sunday evening
  // Sunday 00:30 Nairobi is still Sunday, even though it's Saturday in UTC.
  assert.equal(endOfSunday(new Date("2026-10-24T21:30:00Z")).toISOString(), sundayEnd);
  // Monday rolls over to the next Sunday.
  assert.equal(endOfSunday(new Date("2026-10-26T06:00:00Z")).toISOString(), "2026-11-01T20:59:59.999Z");
});
