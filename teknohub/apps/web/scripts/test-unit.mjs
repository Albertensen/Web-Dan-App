import assert from "node:assert/strict";

// Test 1: HTML Sanitizer
import { sanitizeHtml } from "../src/lib/sanitize.ts";

console.log("▶ Testing HTML Sanitizer...");
const dirtyHtml = '<p>Halo <script>alert("XSS")</script><a href="javascript:alert(1)" onclick="steal()">Link</a></p>';
const cleanHtml = sanitizeHtml(dirtyHtml);
assert.equal(cleanHtml.includes("<script>"), false, "Script tag must be stripped");
assert.equal(cleanHtml.includes("onclick"), false, "Onclick must be stripped");
assert.equal(cleanHtml.includes("javascript:"), false, "Javascript protocol must be stripped");
console.log("  ✔ HTML Sanitizer passed");

// Test 2: Rate Limiter
import { rateLimit } from "../src/lib/rateLimit.ts";

console.log("▶ Testing Rate Limiter...");
const testIp = "192.168.1.100";
assert.equal(rateLimit(testIp, { limit: 2, windowSec: 10 }), true, "1st request allowed");
assert.equal(rateLimit(testIp, { limit: 2, windowSec: 10 }), true, "2nd request allowed");
assert.equal(rateLimit(testIp, { limit: 2, windowSec: 10 }), false, "3rd request must be blocked (limit=2)");
console.log("  ✔ Rate Limiter passed");

// Test 3: Zod Validation Auth & Checkout
import { loginSchema, registerSchema } from "../src/lib/validations/auth.ts";
import { checkoutSchema } from "../src/lib/validations/checkout.ts";

console.log("▶ Testing Zod Validations...");
assert.equal(loginSchema.safeParse({ email: "invalid-email", password: "123" }).success, false);
assert.equal(loginSchema.safeParse({ email: "test@tekno.zone", password: "password123" }).success, true);

assert.equal(
  registerSchema.safeParse({
    username: "user1",
    email: "user1@tekno.zone",
    password: "password123",
    confirmPassword: "password123",
    terms: true,
  }).success,
  true
);

assert.equal(
  checkoutSchema.safeParse({
    name: "Budi",
    phone: "081234567890",
    address: "Jl. Sudirman No 123 Jakarta",
    city: "Jakarta",
    postal_code: "12345",
    courier: "jne",
  }).success,
  true
);
console.log("  ✔ Zod Validations passed");

console.log("\n🎉 ALL UNIT TESTS PASSED SUCCESSFULLY!");
