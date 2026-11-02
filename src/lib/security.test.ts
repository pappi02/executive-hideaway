import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { attemptKeys, clientIp, isOverLimit } from "./login-throttle";
import { isRateLimited } from "./rate-limit";
import { decryptTotpSecret, encryptTotpSecret, generateTotpSecret, matchTotpStep, totpCode } from "./totp";

const ADMIN_DIR = path.resolve(import.meta.dirname, "../app/admin/(dashboard)");

function actionFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return actionFiles(full);
    return name === "actions.ts" ? [full] : [];
  });
}

// A new admin action that forgets its session check would otherwise pass every
// other check and ship. adminAction() is what calls requireAdmin().
test("every exported admin action runs inside adminAction", () => {
  const files = actionFiles(ADMIN_DIR);
  assert.ok(files.length >= 6, "expected the admin action files to be found");

  for (const file of files) {
    const exported = readFileSync(file, "utf8").split(/^export /m).slice(1);
    for (const declaration of exported) {
      if (!declaration.startsWith("async function")) {
        assert.fail(`${file} exports something other than an async function`);
      }
      const name = declaration.match(/^async function (\w+)/)?.[1];
      assert.match(declaration, new RegExp(`return adminAction\\("${name}", async`), `${file}: ${name}`);
    }
  }
});

test("every admin page checks the session itself", () => {
  const pages = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) return pages(full);
      return name === "page.tsx" ? [full] : [];
    });

  for (const file of pages(ADMIN_DIR)) {
    assert.match(readFileSync(file, "utf8"), /await requireAdmin\(\)/, file);
  }
});

test("sign-in codes match the RFC 6238 test vector", () => {
  // Base32 of "12345678901234567890", at 59 seconds: the RFC's 94287082, cut to six digits.
  const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
  assert.equal(totpCode(secret, 1), "287082");
  assert.equal(matchTotpStep(secret, "287082", 59_000), 1);
});

test("sign-in codes tolerate one step of clock drift and nothing more", () => {
  const secret = generateTotpSecret();
  const at = 1_800_000_000_000;
  const step = Math.floor(at / 30_000);
  assert.equal(matchTotpStep(secret, totpCode(secret, step - 1), at), step - 1);
  assert.equal(matchTotpStep(secret, totpCode(secret, step + 1), at), step + 1);
  assert.equal(matchTotpStep(secret, "abc123", at), null);
  assert.equal(matchTotpStep(secret, "", at), null);
});

test("stored sign-in secrets are encrypted and tamper-evident", () => {
  process.env.AUTH_SECRET ??= "test-secret-for-this-test-only";
  const secret = generateTotpSecret();
  const stored = encryptTotpSecret(secret);
  assert.ok(!stored.includes(secret));
  assert.equal(decryptTotpSecret(stored), secret);

  const [iv, tag, data] = stored.split(".");
  const flipped = (data.startsWith("A") ? "B" : "A") + data.slice(1);
  assert.throws(() => decryptTotpSecret([iv, tag, flipped].join(".")));
});

test("the login limits lock one source quickly but leave a high bar for one email", () => {
  assert.equal(isOverLimit({ pair: 5, ip: 5, email: 5 }), false);
  assert.equal(isOverLimit({ pair: 6, ip: 6, email: 6 }), true);
  assert.equal(isOverLimit({ pair: 1, ip: 21, email: 1 }), true);
  assert.equal(isOverLimit({ pair: 1, ip: 1, email: 50 }), false);
  assert.equal(isOverLimit({ pair: 1, ip: 1, email: 51 }), true);
});

test("login attempts are stored without readable addresses", () => {
  const keys = attemptKeys("owner@example.com", "203.0.113.9");
  for (const key of Object.values(keys)) {
    assert.ok(!key.includes("owner") && !key.includes("203.0.113.9"), key);
  }
});

test("the client address comes from the first forwarded entry", () => {
  const request = { headers: new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }) };
  assert.equal(clientIp(request), "203.0.113.9");
  assert.equal(clientIp({ headers: new Headers() }), "unknown");
});

test("the rate limiter allows the limit, refuses beyond it, and resets", () => {
  const key = `test:${Math.random()}`;
  for (let hit = 0; hit < 3; hit += 1) assert.equal(isRateLimited(key, 3, 1000, 5000), false);
  assert.equal(isRateLimited(key, 3, 1000, 5000), true);
  assert.equal(isRateLimited(key, 3, 1000, 6000), false);
});
