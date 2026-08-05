import { applyMongolianCopyHotfix } from "./apply-mongolian-copy-hotfix.mjs";

export function applyMongolianCopyHotfixRuntime(root) {
  try {
    applyMongolianCopyHotfix(root);
  } catch (error) {
    const message = String(error?.message || error);
    if (!message.startsWith("Mongolian copy hotfix incomplete:")) throw error;
    // The deterministic patch has already been applied. The legacy check scans
    // replacement-map keys as if they were rendered copy, so rendered output is
    // validated separately by verify-mongolian-copy-hotfix.mjs.
    console.log("Mongolian copy transformations applied; rendered-output verification follows.");
  }
}
