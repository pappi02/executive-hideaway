import assert from "node:assert/strict";
import { test } from "node:test";
import { isKenyanMobile, isValidPhone, normalizePhone } from "./phone";

test("accepts Kenyan mobile numbers in local and international form", () => {
  for (const number of ["0712345678", "0112345678", "+254712345678", "254112345678", "0712 345 678", "(0712) 345-678"]) {
    assert.equal(isKenyanMobile(number), true, number);
  }
});

test("rejects landlines, wrong lengths and other countries", () => {
  for (const number of ["0202345678", "071234567", "07123456789", "+255712345678", "", "07l2345678"]) {
    assert.equal(isKenyanMobile(number), false, number);
  }
});

test("international numbers need a + and a sensible length", () => {
  for (const number of ["+447911123456", "+1 415 555 2671", "+255712345678", "0712345678"]) {
    assert.equal(isValidPhone(number), true, number);
  }
  for (const number of ["447911123456", "+0123456789", "+12345", "0202345678", ""]) {
    assert.equal(isValidPhone(number), false, number);
  }
});

test("normalizePhone strips spaces, brackets and dashes only", () => {
  assert.equal(normalizePhone(" (0712) 345-678 "), "0712345678");
  assert.equal(normalizePhone("+254 712"), "+254712");
});
