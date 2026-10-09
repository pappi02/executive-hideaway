import assert from "node:assert/strict";
import { test } from "node:test";
import { createAccommodationRequestLink } from "./actions";

// The action is public, so malformed input must be rejected before it reaches
// the database. None of these cases needs a database connection.
test("rejects malformed or oversized input without querying the database", async () => {
  const valid = {
    slug: "deluxe-room",
    checkIn: "2099-01-01",
    checkOut: "2099-01-03",
    guests: 2,
    name: "Guest",
    phone: "0712345678",
    request: "",
  };

  const cases: unknown[] = [
    null,
    "not an object",
    { ...valid, name: 42 },
    { ...valid, slug: undefined },
    { ...valid, guests: { n: 2 } },
    { ...valid, request: "x".repeat(501) },
    { ...valid, name: "x".repeat(101) },
    { ...valid, checkIn: "2099-01-01T00:00:00.000Z" },
  ];

  for (const input of cases) {
    const result = await createAccommodationRequestLink(input as never);
    assert.deepEqual(result, { error: "Please check your details and try again." }, JSON.stringify(input));
  }
});
