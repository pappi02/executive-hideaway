import assert from "node:assert/strict";
import test from "node:test";
import { isWithinSpaHours } from "./site-config";

test("appointments can start from opening up to and including closing", () => {
  for (const time of ["09:00", "12:30", "21:45", "22:00"]) assert.equal(isWithinSpaHours(time), true, time);
  for (const time of ["00:00", "08:59", "22:01", "23:30"]) assert.equal(isWithinSpaHours(time), false, time);
});
