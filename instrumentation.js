/**
 * Next.js instrumentation – runs in both Node and Edge runtimes.
 * Do not import registerDbRejection here; it uses process.on() which is
 * Node-only. The DB rejection handler is registered when API routes load
 * dbConnect or mongodbAdapter (Node only).
 */
export async function register() {}
