import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AdminInputError,
  isSafeLink,
  oneOf,
  reorderedIds,
  optionalImagePath,
  optionalInteger,
  optionalText,
  requiredInteger,
  requiredText,
  slugify,
} from "./admin-action";

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

test("links stay on this site or use https", () => {
  for (const link of ["/booking", "/services#offers", "https://example.com/a"]) {
    assert.equal(isSafeLink(link), true, link);
  }
  for (const link of ["//example.com", "/\\example.com", "\\\\example.com", "http://example.com", "javascript:alert(1)", "data:text/html,x", "plain"]) {
    assert.equal(isSafeLink(link), false, link);
  }
});

test("moving a row swaps it with its neighbour, and stops at the ends", () => {
  assert.deepEqual(reorderedIds(["a", "b", "c"], "b", "up"), ["b", "a", "c"]);
  assert.deepEqual(reorderedIds(["a", "b", "c"], "b", "down"), ["a", "c", "b"]);
  assert.equal(reorderedIds(["a", "b"], "a", "up"), null);
  assert.equal(reorderedIds(["a", "b"], "b", "down"), null);
  assert.equal(reorderedIds(["a", "b"], "x", "up"), null);
  assert.equal(reorderedIds(["a", "b"], "a", "sideways"), null);
});

test("slugify keeps letters and digits, collapsing everything else", () => {
  assert.equal(slugify("  Hot Stone Massage! "), "hot-stone-massage");
  assert.equal(slugify("Café & Bar"), "caf-bar");
  assert.equal(slugify("!!!"), "");
});

test("text fields trim, treat blank as missing, and enforce length", () => {
  assert.equal(optionalText(form({ a: "  hi  " }), "a", { label: "A" }), "hi");
  assert.equal(optionalText(form({ a: "   " }), "a", { label: "A" }), null);
  assert.equal(optionalText(form({}), "a", { label: "A" }), null);
  assert.throws(() => requiredText(form({ a: " " }), "a", { label: "Name" }), /Name is required/);
  assert.throws(() => optionalText(form({ a: "x".repeat(11) }), "a", { label: "A", max: 10 }), AdminInputError);
});

test("integers must be whole numbers within range", () => {
  assert.equal(optionalInteger(form({ p: "" }), "p", { label: "Price" }), null);
  assert.equal(optionalInteger(form({ p: " 1500 " }), "p", { label: "Price" }), 1500);
  for (const bad of ["abc", "12.5", "-1", "1e9", "Infinity"]) {
    assert.throws(() => optionalInteger(form({ p: bad }), "p", { label: "Price" }), AdminInputError, bad);
  }
  assert.throws(() => requiredInteger(form({ d: "" }), "d", { label: "Duration", min: 1 }), /Duration is required/);
  assert.throws(() => requiredInteger(form({ d: "0" }), "d", { label: "Duration", min: 1 }), AdminInputError);
});

test("oneOf only allows listed values and defaults to the first", () => {
  assert.equal(oneOf(form({}), "s", ["onyx", "bone"] as const, "style"), "onyx");
  assert.equal(oneOf(form({ s: "bone" }), "s", ["onyx", "bone"] as const, "style"), "bone");
  assert.throws(() => oneOf(form({ s: "red" }), "s", ["onyx", "bone"] as const, "style"), AdminInputError);
});

test("image paths must point at files under /public", () => {
  assert.equal(optionalImagePath(form({ i: "/images/services/facial.webp" }), "i", "Image"), "/images/services/facial.webp");
  assert.equal(optionalImagePath(form({ i: "" }), "i", "Image"), null);
  for (const bad of [
    "https://example.com/a.png",
    "//example.com/a.png",
    "/images/../secret.png",
    "images/a.png",
    "/images/a.txt",
    "javascript:alert(1)",
    "/images/a.png) , url(https://x",
  ]) {
    assert.throws(() => optionalImagePath(form({ i: bad }), "i", "Image"), AdminInputError, bad);
  }
});
