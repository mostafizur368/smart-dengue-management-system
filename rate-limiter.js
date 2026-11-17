"use strict";

function createRateLimiter(options = {}) {
  const windowMs = Math.max(1000, Number(options.windowMs) || 60_000);
  const max = Math.max(1, Number(options.max) || 60);
  const keyGenerator = typeof options.keyGenerator === "function"
    ? options.keyGenerator
    : request => request.ip || request.socket?.remoteAddress || "unknown";
  const buckets = new Map();
  const maxKeys = Math.max(100, Number(options.maxKeys) || 5000);

  return function rateLimitMiddleware(request, response, next) {
    const now = Date.now();
    const key = String(keyGenerator(request) || "unknown").slice(0, 160);
    let bucket = buckets.get(key);

    if (!bucket || now - bucket.startedAt >= windowMs) {
      bucket = { startedAt: now, count: 0 };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    const resetSeconds = Math.max(1, Math.ceil((windowMs - (now - bucket.startedAt)) / 1000));

    response.setHeader("X-RateLimit-Limit", String(max));
    response.setHeader("X-RateLimit-Remaining", String(remaining));
    response.setHeader("X-RateLimit-Reset", String(resetSeconds));

    if (bucket.count > max) {
      response.setHeader("Retry-After", String(resetSeconds));
      return response.status(429).json({
        success: false,
        error: "rate_limit_exceeded",
        message: "Too many requests. Please wait and try again."
      });
    }

    if (buckets.size > maxKeys) {
      for (const [storedKey, stored] of buckets) {
        if (now - stored.startedAt >= windowMs) buckets.delete(storedKey);
        if (buckets.size <= maxKeys) break;
      }
      if (buckets.size > maxKeys) {
        const firstKey = buckets.keys().next().value;
        if (firstKey) buckets.delete(firstKey);
      }
    }

    return next();
  };
}

module.exports = { createRateLimiter };
