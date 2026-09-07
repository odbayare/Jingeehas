function declarationMap(source) {
  const declarations = new Map();
  const pattern = /const\s+([A-Z][A-Z0-9_]*)\s*=\s*(?:"([^"]+)"|([A-Z][A-Z0-9_]*))\s*;/g;
  for (const match of String(source || "").matchAll(pattern)) {
    declarations.set(match[1], match[2] ? { literal: match[2] } : { reference: match[3] });
  }
  return declarations;
}

function resolveDeclaration(name, declarations, seen = new Set()) {
  if (!name || seen.has(name)) return null;
  const declaration = declarations.get(name);
  if (!declaration) return null;
  if (declaration.literal) return declaration.literal;
  if (!declaration.reference) return null;
  return resolveDeclaration(declaration.reference, declarations, new Set([...seen, name]));
}

export function resolveCurrentQuestionnaireVersion(source) {
  const declarations = declarationMap(source);
  return resolveDeclaration("CURRENT_QUESTIONNAIRE_VERSION", declarations)
    || resolveDeclaration("QUESTIONNAIRE_VERSION", declarations)
    || null;
}

export function questionnaireVersionIsCurrent(source, expectedVersion) {
  if (!expectedVersion) return false;
  return resolveCurrentQuestionnaireVersion(source) === expectedVersion;
}
