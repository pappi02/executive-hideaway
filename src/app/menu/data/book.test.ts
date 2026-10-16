import assert from "node:assert/strict";
import { test } from "node:test";
import { bookFor, buildSheets } from "./book";
import { chapters } from "./menu";
import { contentHeight } from "../lib/metrics";
import { columnHeight } from "../lib/paginate";

const editions = ["spread", "single"] as const;

test("no list page overflows its columns in either edition, drafts included", () => {
  for (const mode of editions) {
    const book = bookFor(mode, chapters);
    const budget = contentHeight(book.metrics);
    for (const page of book.pages) {
      if (page.kind !== "list") continue;
      for (const column of [page.columnA, page.columnB]) {
        const height = columnHeight(column, book.metrics, page.columns);
        assert.ok(height <= budget, `${mode} ${page.id}: ${Math.round(height)}px > ${budget}px`);
      }
    }
  }
});

test("every chapter has a contents entry that lands on its first page", () => {
  for (const mode of editions) {
    const book = bookFor(mode, chapters);
    assert.equal(book.contents.length, chapters.length, mode);
    book.contents.forEach((entry, i) => {
      const page = book.pages[entry.pageIndex];
      assert.ok(page.kind === "chapter" || page.kind === "list", `${mode} ${entry.label}`);
      assert.equal(page.chapterId, chapters[i].id, `${mode} ${entry.label}`);
      assert.equal(page.folio, entry.folio, `${mode} ${entry.label}`);
    });
  }
});

test("every dish is printed exactly once", () => {
  const expected = chapters.flatMap((c) => c.sections.flatMap((s) => s.dishes.map((d) => d.id))).sort();
  for (const mode of editions) {
    const printed = bookFor(mode, chapters)
      .pages.flatMap((page) =>
        page.kind === "list" ? [...page.columnA, ...page.columnB].flatMap((s) => s.dishes.map((d) => d.id)) : [],
      )
      .sort();
    assert.deepEqual(printed, expected, mode);
  }
});

test("the spread edition pairs into whole leaves", () => {
  for (const published of [chapters, chapters.filter((c) => c.published !== false)]) {
    const book = bookFor("spread", published);
    assert.equal(book.pages.length % 2, 0);
    assert.ok(buildSheets(book.pages, "spread").every((sheet) => sheet.back !== null));
  }
});
