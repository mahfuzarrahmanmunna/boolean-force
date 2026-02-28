/**
 * Register once per process so MongoDB connection rejections don't print
 * Node's default "Unhandled Rejection" stack. Only runs in Node.js
 * (not Edge). Import this first in any file that uses MongoDB.
 */
const isNode =
  typeof process !== "undefined" &&
  typeof process.on === "function" &&
  process.versions?.node;

let lastDbErrorLog = 0;
const DB_ERROR_THROTTLE_MS = 10000;

if (isNode && !process.__dbUnhandledRejectionHandled) {
  process.__dbUnhandledRejectionHandled = true;
  process.on("unhandledRejection", (reason) => {
    const msg =
      reason?.message ?? (typeof reason === "string" ? reason : "");
    const isDbError =
      msg.includes("ECONNREFUSED") ||
      msg.includes("querySrv") ||
      msg.includes("mongodb");
    if (isDbError) {
      const now = Date.now();
      if (now - lastDbErrorLog >= DB_ERROR_THROTTLE_MS) {
        lastDbErrorLog = now;
        console.warn("[DB] Connection error:", msg);
      }
      return;
    }
    console.warn("[Unhandled Rejection]", msg || reason);
  });
}
