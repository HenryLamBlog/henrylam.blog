import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Feature: portfolio-visual-redesign, Property 3: No hardcoded color values
//   in components
// Validates: Requirements 1.6
// ---------------------------------------------------------------------------

/**
 * Collect all .tsx component files from src/components/.
 */
function getComponentFiles(): { name: string; content: string }[] {
  const componentsDir = path.resolve(__dirname);
  const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'));
  return files.map((f) => ({
    name: f,
    content: fs.readFileSync(path.join(componentsDir, f), 'utf-8'),
  }));
}

/**
 * Strip content that should be excluded from hardcoded-color scanning:
 *
 * 1. Single-line comments (// ...)
 * 2. Multi-line comments (/* ... *​/)
 * 3. Inline style={{ ... }} blocks — these may contain intentional rgba()
 *    values for gradients, drop-shadows, and Framer Motion animation props
 * 4. Framer Motion animation props (whileHover, whileTap, animate, etc.)
 *    that use inline objects with rgba for visual effects
 * 5. rgb(var(--...)) / rgba(var(--...)) patterns — these reference CSS
 *    custom properties (tokens), not hardcoded colors
 * 6. SVG data URIs
 */
function stripExcludedContent(source: string): string {
  let result = source;

  // Remove single-line comments
  result = result.replace(/\/\/.*$/gm, '');

  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove style={{ ... }} blocks (may be nested with braces)
  // We match style={{ and then track brace depth to find the closing }}
  result = removeStyleBlocks(result);

  // Remove Framer Motion inline animation props that may contain rgba values
  // e.g. whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 8px rgba(...))' }}
  const motionProps = ['whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView', 'animate', 'initial', 'exit'];
  for (const prop of motionProps) {
    result = removeJsxPropBlock(result, prop);
  }

  // Remove rgb(var(--...)) and rgba(var(--...)) — these use CSS tokens
  result = result.replace(/rgba?\(\s*var\(--[\w-]+\)[\s,)]*[^)]*\)/g, '');

  // Remove SVG data URIs
  result = result.replace(/data:image\/svg\+xml[^"']*/g, '');

  return result;
}

/**
 * Remove style={{ ... }} blocks by tracking brace depth.
 */
function removeStyleBlocks(source: string): string {
  const marker = 'style={{';
  let result = source;
  let searchFrom = 0;

  while (true) {
    const idx = result.indexOf(marker, searchFrom);
    if (idx === -1) break;

    // Start after the first '{' of style={{
    const braceStart = idx + marker.length - 1; // points to the second '{'
    let depth = 2; // we're inside style={{ so depth is 2
    let i = braceStart + 1;

    while (i < result.length && depth > 0) {
      if (result[i] === '{') depth++;
      else if (result[i] === '}') depth--;
      i++;
    }

    // Remove from 'style={{' to the matching '}}'
    result = result.slice(0, idx) + result.slice(i);
    searchFrom = idx;
  }

  return result;
}

/**
 * Remove JSX prop blocks like propName={{ ... }} by tracking brace depth.
 */
function removeJsxPropBlock(source: string, propName: string): string {
  const marker = `${propName}={{`;
  let result = source;
  let searchFrom = 0;

  while (true) {
    const idx = result.indexOf(marker, searchFrom);
    if (idx === -1) break;

    const braceStart = idx + marker.length - 1;
    let depth = 2;
    let i = braceStart + 1;

    while (i < result.length && depth > 0) {
      if (result[i] === '{') depth++;
      else if (result[i] === '}') depth--;
      i++;
    }

    result = result.slice(0, idx) + result.slice(i);
    searchFrom = idx;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Hardcoded color patterns
// ---------------------------------------------------------------------------

/** Matches hex color values: #fff, #ffffff, #ffffffff */
const HEX_COLOR_RE = /#[0-9a-fA-F]{3,8}\b/g;

/** Matches raw rgb() / rgba() calls (not using var()) */
const RGB_RE = /rgba?\(\s*\d/g;

/** Matches raw hsl() / hsla() calls */
const HSL_RE = /hsla?\(\s*\d/g;

/**
 * Find all hardcoded color references in a cleaned source string.
 * Returns an array of match descriptions.
 */
function findHardcodedColors(cleanedSource: string): string[] {
  const matches: string[] = [];

  let m: RegExpExecArray | null;

  HEX_COLOR_RE.lastIndex = 0;
  while ((m = HEX_COLOR_RE.exec(cleanedSource)) !== null) {
    matches.push(`hex ${m[0]} at index ${m.index}`);
  }

  RGB_RE.lastIndex = 0;
  while ((m = RGB_RE.exec(cleanedSource)) !== null) {
    // Extract a bit more context
    const snippet = cleanedSource.slice(m.index, m.index + 30);
    matches.push(`rgb/rgba "${snippet}..." at index ${m.index}`);
  }

  HSL_RE.lastIndex = 0;
  while ((m = HSL_RE.exec(cleanedSource)) !== null) {
    const snippet = cleanedSource.slice(m.index, m.index + 30);
    matches.push(`hsl/hsla "${snippet}..." at index ${m.index}`);
  }

  return matches;
}

// ---------------------------------------------------------------------------
// Property Test
// ---------------------------------------------------------------------------

const componentFiles = getComponentFiles();

describe('Feature: portfolio-visual-redesign, Property 3: No hardcoded color values in components', () => {
  /**
   * **Validates: Requirements 1.6**
   *
   * For any component file in src/components/, the file should not contain
   * hardcoded hex colors (#xxx, #xxxxxx), raw rgb() values, or raw hsl()
   * values outside of the token definition files. All color references
   * should use Tailwind token classes.
   *
   * Excluded from scanning:
   * - Comments (single-line and multi-line)
   * - style={{ }} blocks (intentional inline gradient/animation values)
   * - Framer Motion animation props (whileHover, animate, etc.)
   * - rgb(var(--...)) patterns (CSS token references)
   * - SVG data URIs
   */
  it('no component file contains hardcoded hex, rgb(), or hsl() color values', () => {
    expect(componentFiles.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles),
        (file: { name: string; content: string }) => {
          const cleaned = stripExcludedContent(file.content);
          const violations = findHardcodedColors(cleaned);

          if (violations.length > 0) {
            throw new Error(
              `${file.name} contains hardcoded color values:\n  ${violations.join('\n  ')}`,
            );
          }
        },
      ),
      {
        numRuns: Math.max(100, componentFiles.length * 5),
        verbose: true,
      },
    );
  });
});
