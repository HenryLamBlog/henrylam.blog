import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// CSS Token Parsing Helpers
// ---------------------------------------------------------------------------

const globalsPath = path.resolve(__dirname, 'globals.css');
const cssContent = fs.readFileSync(globalsPath, 'utf-8');

/**
 * Extract CSS custom property definitions from a given selector block.
 * Returns a Map of property name → raw value string (e.g. "245 124 0").
 */
function parseTokensFromSelector(css: string, selectorPattern: RegExp): Map<string, string> {
  const tokens = new Map<string, string>();
  const selectorMatch = css.match(selectorPattern);
  if (!selectorMatch) return tokens;

  // Find the block after the selector match
  const startIdx = css.indexOf('{', selectorMatch.index!);
  if (startIdx === -1) return tokens;

  let depth = 0;
  let blockStart = -1;
  let blockEnd = -1;
  for (let i = startIdx; i < css.length; i++) {
    if (css[i] === '{') {
      if (depth === 0) blockStart = i + 1;
      depth++;
    } else if (css[i] === '}') {
      depth--;
      if (depth === 0) {
        blockEnd = i;
        break;
      }
    }
  }

  if (blockStart === -1 || blockEnd === -1) return tokens;
  const block = css.slice(blockStart, blockEnd);

  const propRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = propRegex.exec(block)) !== null) {
    tokens.set(`--${match[1]}`, match[2].trim());
  }
  return tokens;
}

const lightTokens = parseTokensFromSelector(cssContent, /:root\s*\{/);
const darkTokens = parseTokensFromSelector(cssContent, /\.dark\s*\{/);


// ---------------------------------------------------------------------------
// Color Utility Functions (WCAG 2.1 Contrast Ratio)
// ---------------------------------------------------------------------------

/**
 * Parse an RGB triplet string like "245 124 0" into [r, g, b].
 */
function parseRgbTriplet(value: string): [number, number, number] {
  const parts = value.split(/\s+/).map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid RGB triplet: "${value}"`);
  }
  return [parts[0], parts[1], parts[2]];
}

/**
 * Compute relative luminance per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.04045
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Compute contrast ratio between two colors.
 * Returns a value >= 1.
 */
function contrastRatio(
  fg: [number, number, number],
  bg: [number, number, number],
): number {
  const l1 = relativeLuminance(...fg);
  const l2 = relativeLuminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Token Pair Definitions
// ---------------------------------------------------------------------------

/** Text tokens that must contrast against backgrounds */
const textTokenNames = ['--color-text', '--color-text-muted'];

/** Background tokens */
const bgTokenNames = ['--color-bg', '--color-surface'];

/** Semantic tokens that must also contrast against backgrounds */
const semanticTokenNames = ['--color-success', '--color-warning', '--color-error'];

/** All foreground tokens to check (text + semantic) */
const allFgTokenNames = [...textTokenNames, ...semanticTokenNames];

type ModeName = 'light' | 'dark';

interface TokenPair {
  mode: ModeName;
  fgName: string;
  bgName: string;
  fgValue: string;
  bgValue: string;
}

function buildTokenPairs(): TokenPair[] {
  const pairs: TokenPair[] = [];
  const modes: { name: ModeName; tokens: Map<string, string> }[] = [
    { name: 'light', tokens: lightTokens },
    { name: 'dark', tokens: darkTokens },
  ];

  for (const { name, tokens } of modes) {
    for (const fgName of allFgTokenNames) {
      for (const bgName of bgTokenNames) {
        const fgValue = tokens.get(fgName);
        const bgValue = tokens.get(bgName);
        if (fgValue && bgValue) {
          pairs.push({ mode: name, fgName, bgName, fgValue, bgValue });
        }
      }
    }
  }
  return pairs;
}

const tokenPairs = buildTokenPairs();


// ---------------------------------------------------------------------------
// Property 2: WCAG AA contrast for all text/background token pairs
// Feature: portfolio-visual-redesign, Property 2: WCAG AA contrast for all
//   text/background token pairs
// Validates: Requirements 1.5, 2.5
// ---------------------------------------------------------------------------

describe('Feature: portfolio-visual-redesign, Property 2: WCAG AA contrast for all text/background token pairs', () => {
  /**
   * **Validates: Requirements 1.5, 2.5**
   *
   * For any combination of a text color token (text, text-muted) and a
   * background color token (bg, surface) in either light or dark mode, the
   * computed contrast ratio should be at least 4.5:1 (WCAG AA for normal
   * text). For semantic color tokens (success, warning, error) against both
   * bg and surface, the contrast ratio should also meet 4.5:1.
   */
  it('every text/semantic foreground token meets WCAG AA 4.5:1 contrast against every background token in both modes', () => {
    // Sanity: we should have pairs to test
    expect(tokenPairs.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(
        fc.constantFrom(...tokenPairs),
        (pair: TokenPair) => {
          const fg = parseRgbTriplet(pair.fgValue);
          const bg = parseRgbTriplet(pair.bgValue);
          const ratio = contrastRatio(fg, bg);

          // WCAG AA requires >= 4.5 for normal text
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        },
      ),
      {
        numRuns: 100,
        verbose: true,
      },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Light and dark token sets define identical token names
// Feature: portfolio-visual-redesign, Property 4: Light and dark token sets
//   define identical token names
// Validates: Requirements 1.7
// ---------------------------------------------------------------------------

describe('Feature: portfolio-visual-redesign, Property 4: Light and dark token sets define identical token names', () => {
  const lightNames = Array.from(lightTokens.keys()).sort();
  const darkNames = Array.from(darkTokens.keys()).sort();

  /**
   * **Validates: Requirements 1.7**
   *
   * For any CSS custom property name defined in the :root selector of
   * globals.css, the same property name should also be defined in the .dark
   * selector, and vice versa.
   */
  it('every token in :root is also defined in .dark', () => {
    // Sanity: we should have tokens
    expect(lightNames.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(
        fc.constantFrom(...lightNames),
        (tokenName: string) => {
          expect(darkTokens.has(tokenName)).toBe(true);
        },
      ),
      {
        numRuns: 100,
        verbose: true,
      },
    );
  });

  it('every token in .dark is also defined in :root', () => {
    expect(darkNames.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(
        fc.constantFrom(...darkNames),
        (tokenName: string) => {
          expect(lightTokens.has(tokenName)).toBe(true);
        },
      ),
      {
        numRuns: 100,
        verbose: true,
      },
    );
  });
});
