'use client'
import { useEffect } from 'react'
import './game.css'

// ═══════════════════════════════════════
// LEVELS
// ═══════════════════════════════════════
interface BonusQ {
  q: string;
  choices: string[];
  answer: string;
  explain: string;
}
interface Level {
  world: string;
  title: string;
  desc: string;
  hint: string;
  startEq: string;
  stars: { x: number; y: number }[];
  presets: string[];
  bonusQ?: BonusQ;
  allowedTypes?: string[];
  startX?: number;
}

const LEVELS: Level[] = [
  // ── WORLD 1: LINEAR FUNCTIONS ──────────────────────────────
  {
    world: 'WORLD 1-1', title: 'POSITIVE GRADIENT',
    desc: 'Straight line rising to the right: y = ax + b',
    hint: 'Bait at (4, 6). With gradient 1: 4 + b = 6 → b = 2. Try y = x + 2.',
    startEq: 'x',
    stars: [{ x: 4, y: 6 }],
    presets: ['x', 'x + 1', 'x + 2'],
    bonusQ: {
      q: 'What is the gradient of y = x + 2?',
      choices: ['−2', '0', '1', '2'],
      answer: '1',
      explain: 'In y = mx + b, gradient m is the coefficient of x. No number in front of x means m = 1.',
    },
  },
  {
    world: 'WORLD 1-2', title: 'NEGATIVE GRADIENT',
    desc: 'A line with a negative slope falls as x increases',
    hint: 'Bait at (6, 4). Gradient = −1: −6 + b = 4 → b = 10. Try y = −x + 10.',
    startEq: '-x + 8',
    stars: [{ x: 6, y: 4 }],
    presets: ['-x + 8', '-x + 9', '-x + 10'],
    bonusQ: {
      q: 'Does the point (3, 7) lie on the line y = −x + 10?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Substitute x = 3 into y = −x + 10: y = −3 + 10 = 7. That matches, so (3, 7) is on the line.',
    },
  },
  {
    world: 'WORLD 1-3', title: 'RISE OVER RUN',
    desc: 'Gradient = (y₂ − y₁) ÷ (x₂ − x₁)',
    hint: 'Bait at (4, 9), line starts at (0, 1). Gradient = (9−1)÷(4−0) = 2. So y = 2x + 1.',
    startEq: 'x + 1',
    stars: [{ x: 4, y: 9 }],
    presets: ['x + 1', '1.5x + 1', '2x + 1'],
    bonusQ: {
      q: 'The line passes through (0, 1) and (4, 9). What is the gradient?',
      choices: ['0.5', '1', '2', '4'],
      answer: '2',
      explain: 'Gradient = rise ÷ run = (9 − 1) ÷ (4 − 0) = 8 ÷ 4 = 2.',
    },
  },
  {
    world: 'WORLD 1-4', title: 'Y-INTERCEPT',
    desc: 'b in y = ax + b sets where the line crosses the y-axis',
    hint: 'Both hoops lie on y = x + 2. At x=3: 5 ✓. At x=9: 11 ✓.',
    startEq: 'x',
    stars: [{ x: 3, y: 5 }, { x: 9, y: 11 }],
    presets: ['x', 'x + 1', 'x + 2'],
    bonusQ: {
      q: 'Where does y = x + 2 cross the y-axis?',
      choices: ['(0, −2)', '(0, 1)', '(0, 2)', '(2, 0)'],
      answer: '(0, 2)',
      explain: 'The y-intercept is b in y = mx + b. Set x = 0: y = 0 + 2 = 2, so the line crosses at (0, 2).',
    },
  },
  {
    world: 'WORLD 1-5', title: 'CROSSING ZERO',
    desc: 'A negative gradient line eventually dips below y = 0',
    hint: 'Bait at (8, −2). Try y = −0.5x + 2. At x=8: −4+2=−2. ✓',
    startEq: '-0.5x + 4',
    stars: [{ x: 8, y: -2 }],
    presets: ['-0.5x + 4', '-0.5x + 3', '-0.5x + 2'],
    bonusQ: {
      q: 'Where does y = −0.5x + 2 cross the x-axis?',
      choices: ['x = 2', 'x = 4', 'x = 8', 'x = −2'],
      answer: 'x = 4',
      explain: 'Set y = 0: 0 = −0.5x + 2 → 0.5x = 2 → x = 4. The line crosses the x-axis at x = 4.',
    },
  },
  {
    world: 'WORLD 1-6', title: 'TWO POINTS, ONE LINE',
    desc: 'Two baits pin down a single line — match BOTH gradient and intercept',
    hint: 'Gradient = (9 − 1) ÷ (6 − 2) = 2. Then 1 = 2(2) + b → b = −3. Try y = 2x − 3.',
    startEq: '2x',
    stars: [{ x: 2, y: 1 }, { x: 6, y: 9 }],
    presets: ['2x', '2x - 1', '2x - 3'],
    allowedTypes: ['LINEAR'],
    bonusQ: {
      q: 'A line passes through (2, 1) and (6, 9). What is its gradient?',
      choices: ['1', '2', '3', '4'],
      answer: '2',
      explain: 'Gradient = rise ÷ run = (9 − 1) ÷ (6 − 2) = 8 ÷ 4 = 2.',
    },
  },
  {
    world: 'WORLD 1-7', title: 'FALLING THROUGH BOTH',
    desc: 'A steeper negative line — only one slope hits both baits',
    hint: 'Gradient = (−3 − 9) ÷ (8 − 2) = −2. Then 9 = −2(2) + b → b = 13. Try y = −2x + 13.',
    startEq: '-x + 10',
    stars: [{ x: 2, y: 9 }, { x: 8, y: -3 }],
    presets: ['-x + 10', '-2x + 12', '-2x + 13'],
    allowedTypes: ['LINEAR'],
    bonusQ: {
      q: 'Through (2, 9) and (8, −3), what is the gradient?',
      choices: ['−1', '−2', '−3', '2'],
      answer: '−2',
      explain: 'Gradient = (−3 − 9) ÷ (8 − 2) = −12 ÷ 6 = −2. A falling line has a negative gradient.',
    },
  },
  {
    world: 'WORLD 1-8', title: 'FRACTIONAL GRADIENT',
    desc: 'The gradient can be a fraction — rise over run still works',
    hint: 'Gradient = (6 − 2) ÷ (10 − 2) = 0.5. Then 2 = 0.5(2) + b → b = 1. Try y = 0.5x + 1.',
    startEq: 'x + 3',
    stars: [{ x: 2, y: 2 }, { x: 10, y: 6 }],
    presets: ['x + 3', '0.5x + 2', '0.5x + 1'],
    allowedTypes: ['LINEAR'],
    bonusQ: {
      q: 'Through (2, 2) and (10, 6), the gradient is:',
      choices: ['0.25', '0.5', '1', '2'],
      answer: '0.5',
      explain: 'Gradient = (6 − 2) ÷ (10 − 2) = 4 ÷ 8 = 0.5.',
    },
  },

  // ── WORLD 2: QUADRATIC — VERTEX FORM ──────────────────────
  {
    world: 'WORLD 2-1', title: 'MAXIMUM POINT',
    desc: 'y = −(x−p)² + q has a maximum at (p, q)',
    hint: 'Bait at (4, 9). Place the vertex there: p=4, q=9. Raise q step by step.',
    startEq: '-(x-4)^2 + 4',
    stars: [{ x: 4, y: 9 }],
    presets: ['-(x-4)^2 + 4', '-(x-4)^2 + 7', '-(x-4)^2 + 9'],
    bonusQ: {
      q: 'Does (2, 5) lie on y = −(x − 4)² + 9?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Sub x = 2: y = −(2−4)² + 9 = −4 + 9 = 5. That matches, so (2, 5) is on the curve.',
    },
  },
  {
    world: 'WORLD 2-2', title: 'MINIMUM POINT',
    desc: 'y = (x−p)² + q has a minimum at (p, q)',
    hint: 'Bait is at the very bottom (7, 1). Set p=7 and lower q until q=1.',
    startEq: '(x-7)^2 + 5',
    stars: [{ x: 7, y: 1 }],
    presets: ['(x-7)^2 + 5', '(x-7)^2 + 3', '(x-7)^2 + 1'],
    bonusQ: {
      q: 'What is the minimum point of y = (x − 7)² + 1?',
      choices: ['(1, 7)', '(7, −1)', '(−7, 1)', '(7, 1)'],
      answer: '(7, 1)',
      explain: 'In y = (x − p)² + q the minimum is at (p, q). Here p = 7, q = 1, so the minimum is (7, 1).',
    },
  },
  {
    world: 'WORLD 2-3', title: 'AXIS OF SYMMETRY',
    desc: 'A parabola is symmetric about x = p',
    hint: 'Same height on both sides → axis at x=7 (halfway between 5 and 9). Try −(x−7)²+9.',
    startEq: '-(x-7)^2 + 6',
    stars: [{ x: 5, y: 5 }, { x: 9, y: 5 }],
    presets: ['-(x-7)^2 + 6', '-(x-7)^2 + 8', '-(x-7)^2 + 9'],
    bonusQ: {
      q: 'Does (5, 5) lie on y = −(x − 7)² + 9?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Sub x = 5: y = −(5−7)² + 9 = −4 + 9 = 5. Matches! And by symmetry, (9, 5) also lies on the curve.',
    },
  },
  {
    world: 'WORLD 2-4', title: 'NEGATIVE COEFFICIENT',
    desc: 'Negative a flips the parabola — peak instead of trough',
    hint: 'Three hoops: peak at (7, 8), sides at y=4. Try a=−1: −(x−7)²+8.',
    startEq: '-0.5(x-7)^2 + 8',
    stars: [{ x: 5, y: 4 }, { x: 7, y: 8 }, { x: 9, y: 4 }],
    presets: ['-0.5(x-7)^2 + 8', '-(x-7)^2 + 6', '-(x-7)^2 + 8'],
    bonusQ: {
      q: 'What is the maximum value of y = −(x − 7)² + 8?',
      choices: ['7', '8', '−8', '49'],
      answer: '8',
      explain: 'The maximum occurs at the vertex (7, 8). Subbing x = 7: y = −0 + 8 = 8.',
    },
  },
  {
    world: 'WORLD 2-5', title: 'NEGATIVE VERTEX',
    desc: 'y = (x−p)² + q dips below zero when q is negative',
    hint: 'Bait below zero at (6, −4). Set p=6, q=−4: y = (x−6)²−4.',
    startEq: '(x-6)^2 - 1',
    stars: [{ x: 6, y: -4 }],
    presets: ['(x-6)^2 - 1', '(x-6)^2 - 2', '(x-6)^2 - 4'],
    bonusQ: {
      q: 'What is the minimum value of y = (x − 6)² − 4?',
      choices: ['−6', '−4', '0', '4'],
      answer: '−4',
      explain: 'The minimum is at the vertex (6, −4). Subbing x = 6: y = 0 − 4 = −4.',
    },
  },
  {
    world: 'WORLD 2-6', title: 'STEEPER PEAK',
    desc: 'The coefficient a controls how narrow the parabola is',
    hint: 'Peak at (6, 10). Through (8, 2): 2 = a(8−6)² + 10 → 4a = −8 → a = −2. Try y = −2(x−6)² + 10.',
    startEq: '-(x-6)^2 + 10',
    stars: [{ x: 6, y: 10 }, { x: 8, y: 2 }],
    presets: ['-(x-6)^2 + 10', '-1.5(x-6)^2 + 10', '-2(x-6)^2 + 10'],
    allowedTypes: ['QUADRATIC'],
    bonusQ: {
      q: 'In y = −2(x − 6)² + 10, a larger size of a makes the parabola…',
      choices: ['Wider', 'Narrower', 'Flatter', 'Shift up'],
      answer: 'Narrower',
      explain: 'A larger magnitude of a makes the parabola steeper and narrower; a smaller |a| makes it wider.',
    },
  },

  // ── WORLD 3: QUADRATIC — FACTORED & STANDARD FORM ─────────
  {
    world: 'WORLD 3-1', title: 'FACTORED FORM',
    desc: 'y = a(x−r₁)(x−r₂) has x-intercepts at x = r₁ and x = r₂',
    hint: 'Roots at x=3 and x=9 → peak at x=6. Scale a toward −1: y=−(x−3)(x−9).',
    startEq: '-0.5(x-3)(x-9)',
    stars: [{ x: 6, y: 9 }],
    presets: ['-0.5(x-3)(x-9)', '-0.8(x-3)(x-9)', '-(x-3)(x-9)'],
    bonusQ: {
      q: 'Where does y = −(x − 3)(x − 9) cross the x-axis?',
      choices: ['x = 3 only', 'x = 9 only', 'x = 3 and x = 9', 'x = 6'],
      answer: 'x = 3 and x = 9',
      explain: 'Set y = 0: −(x−3)(x−9) = 0 → x = 3 or x = 9. These are the roots (x-intercepts).',
    },
  },
  {
    world: 'WORLD 3-2', title: 'STANDARD FORM',
    desc: 'y = ax² + bx + c — expand vertex form to find standard form',
    hint: '-(x−6)²/2+8 expands to −x²/2+6x−10. Adjust c until both hoops sit at y=6.',
    startEq: '-x^2/2 + 6x - 16',
    stars: [{ x: 4, y: 6 }, { x: 8, y: 6 }],
    presets: ['-x^2/2 + 6x - 16', '-x^2/2 + 6x - 13', '-x^2/2 + 6x - 10'],
    bonusQ: {
      q: 'Does (6, 8) lie on y = −x²/2 + 6x − 10?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Sub x = 6: y = −36/2 + 36 − 10 = −18 + 36 − 10 = 8. It does!',
    },
  },
  {
    world: 'WORLD 3-3', title: 'SCALED ROOTS',
    desc: 'Roots set where it crosses zero; a stretches the curve vertically',
    hint: 'Roots at x=2 and x=10 (peak at x=6). Through (6, 8): 8 = a(6−2)(6−10) = −16a → a = −0.5. Try y = −0.5(x−2)(x−10).',
    startEq: '-(x-2)(x-10)',
    stars: [{ x: 6, y: 8 }, { x: 4, y: 6 }],
    presets: ['-(x-2)(x-10)', '-0.8(x-2)(x-10)', '-0.5(x-2)(x-10)'],
    allowedTypes: ['QUADRATIC', 'FACTORED'],
    bonusQ: {
      q: 'Where does y = −0.5(x − 2)(x − 10) cross the x-axis?',
      choices: ['x = 2 and x = 10', 'x = 6 only', 'x = −2 and x = −10', 'x = 0.5'],
      answer: 'x = 2 and x = 10',
      explain: 'Set y = 0: (x − 2)(x − 10) = 0 → x = 2 or x = 10. The roots are the x-intercepts.',
    },
  },

  // ── WORLD 4: POWER FUNCTIONS y = axⁿ ─────────────────────
  {
    world: 'WORLD 4-1', title: 'CONSTANT (n=0)',
    desc: 'y = c is a horizontal line — gradient is always zero',
    hint: 'All three hoops sit at y=4. A flat line y=4 passes through all of them!',
    startEq: '2',
    allowedTypes: ['CONSTANT'],
    stars: [{ x: 3, y: 4 }, { x: 7, y: 4 }, { x: 11, y: 4 }],
    presets: ['2', '3', '4'],
    bonusQ: {
      q: 'What is the gradient of the line y = 4?',
      choices: ['−4', '0', '4', 'Undefined'],
      answer: '0',
      explain: 'A constant function is a flat horizontal line — it never rises or falls, so gradient = 0.',
    },
  },
  {
    world: 'WORLD 4-2', title: 'CUBIC (n=3)',
    desc: 'y = x³ ÷ k — a cubic curve that rises faster than a parabola',
    hint: 'Bait at (6, 8). 6³ = 216. What divides 216 to get 8? 216÷27=8. So y = x³÷27.',
    startEq: 'x^3/50',
    allowedTypes: ['CUBIC'],
    stars: [{ x: 6, y: 8 }],
    presets: ['x^3/50', 'x^3/35', 'x^3/27'],
    bonusQ: {
      q: 'Does (3, 1) lie on y = x³ ÷ 27?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Sub x = 3: y = 3³ ÷ 27 = 27 ÷ 27 = 1. So (3, 1) is on the curve.',
    },
  },
  {
    world: 'WORLD 4-3', title: 'RECIPROCAL (n=−1)',
    desc: 'y = k/x — a hyperbola. As x grows, y shrinks.',
    hint: 'Bait at (3, 4): k÷3=4 → k=12. Try y = 12/x.',
    startEq: '6/x',
    allowedTypes: ['LINEAR'],
    stars: [{ x: 3, y: 4 }],
    presets: ['6/x', '9/x', '12/x'],
    startX: 0.5,
    bonusQ: {
      q: 'Does (4, 3) lie on y = 12/x?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Sub x = 4: y = 12 ÷ 4 = 3. So (4, 3) lies on the curve.',
    },
  },
  {
    world: 'WORLD 4-4', title: 'INVERSE SQUARE (n=−2)',
    desc: 'y = k/x² drops off faster than 1/x',
    hint: 'Bait at (2, 4): k÷2²=4 → k÷4=4 → k=16. Try y = 16/x².',
    startEq: '8/x^2',
    allowedTypes: ['QUADRATIC'],
    stars: [{ x: 2, y: 4 }],
    presets: ['8/x^2', '12/x^2', '16/x^2'],
    startX: 0.5,
    bonusQ: {
      q: 'Does (4, 1) lie on y = 16/x²?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Sub x = 4: y = 16 ÷ 4² = 16 ÷ 16 = 1. So (4, 1) is on the curve.',
    },
  },
  {
    world: 'WORLD 4-5', title: 'LINEAR & SQUARE (n=1, 2)',
    desc: 'Mix n=1 and n=2 terms: y = x²/a + x/b',
    hint: 'Bait at (4, 6). Try y = x²/4 + x/2. At x=4: 16/4 + 4/2 = 4+2 = 6. ✓',
    startEq: 'x^2/4',
    allowedTypes: ['QUADRATIC'],
    stars: [{ x: 4, y: 6 }],
    presets: ['x^2/4', 'x^2/4 + x/4', 'x^2/4 + x/2'],
    bonusQ: {
      q: 'What is the y-intercept of y = x²/4 + x/2?',
      choices: ['y = −1', 'y = 0', 'y = 0.5', 'y = 1'],
      answer: 'y = 0',
      explain: 'Set x = 0: y = 0/4 + 0/2 = 0. The curve passes through the origin (0, 0).',
    },
  },
  {
    world: 'WORLD 4-6', title: 'POWER SUMS',
    desc: 'Combine power terms: y = ax² + bx + c',
    hint: 'Both hoops at y=6. Try −x²/2+5x−2: at x=2: −2+10−2=6 ✓, at x=8: −32+40−2=6 ✓.',
    startEq: '-x^2/2 + 5x - 6',
    allowedTypes: ['QUADRATIC'],
    stars: [{ x: 2, y: 6 }, { x: 8, y: 6 }],
    presets: ['-x^2/2 + 5x - 6', '-x^2/2 + 5x - 4', '-x^2/2 + 5x - 2'],
    bonusQ: {
      q: 'Does (4, 10) lie on y = −x²/2 + 5x − 2?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Sub x = 4: y = −16/2 + 20 − 2 = −8 + 20 − 2 = 10. It does!',
    },
  },

  // ── WORLD 5: EXPONENTIAL FUNCTIONS y = k·aˣ ───────────────
  {
    world: 'WORLD 5-1', title: 'BASE 2',
    desc: 'y = 2^x doubles with every step.',
    hint: 'At x=3, 2³=8. The hoop is right there! Try y = 2^x.',
    startEq: '0.5(2^x)',
    stars: [{ x: 3, y: 8 }],
    presets: ['0.5(2^x)', '0.75(2^x)', '2^x'],
    bonusQ: {
      q: 'What is the y-intercept of y = 2^x?',
      choices: ['y = 0', 'y = 1', 'y = 2', 'No y-intercept'],
      answer: 'y = 1',
      explain: 'Set x = 0: y = 2⁰ = 1. Any base raised to the power 0 equals 1, so the y-intercept is 1.',
    },
  },
  {
    world: 'WORLD 5-2', title: 'SCALING k',
    desc: 'y = k·2^x — k stretches or shrinks the curve vertically',
    hint: 'Bait at (3, 4). k×2³=4 → k×8=4 → k=0.5. Try y = 0.5(2^x).',
    startEq: '2^x',
    stars: [{ x: 3, y: 4 }],
    presets: ['2^x', '0.75(2^x)', '0.5(2^x)'],
    bonusQ: {
      q: 'Does (4, 8) lie on y = 0.5 × 2^x?',
      choices: ['Yes', 'No'],
      answer: 'Yes',
      explain: 'Sub x = 4: y = 0.5 × 2⁴ = 0.5 × 16 = 8. So (4, 8) is on the curve.',
    },
  },
  {
    world: 'WORLD 5-3', title: 'BASE 3',
    desc: 'y = 3^x triples with every step — even faster than base 2',
    hint: 'At x=2, 3²=9. Try y = 3^x to land right on the bait!',
    startEq: '0.2(3^x)',
    stars: [{ x: 2, y: 9 }],
    presets: ['0.2(3^x)', '0.5(3^x)', '3^x'],
    bonusQ: {
      q: 'What is the value of y when x = 3 on y = 3^x?',
      choices: ['9', '18', '27', '81'],
      answer: '27',
      explain: '3³ = 3 × 3 × 3 = 27. Exponentials grow fast — each step multiplies by the base.',
    },
  },
];

// ═══════════════════════════════════════
// EQUATION PARSER — safe AST evaluator
// ═══════════════════════════════════════
const _SAFE_CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E };
const _SAFE_FUNS: Record<string, (x: number) => number> = { sqrt: Math.sqrt, abs: Math.abs, sin: Math.sin, cos: Math.cos, tan: Math.tan };

interface Token { t: string; v?: number | string; }
interface ASTNode { op: string; v?: ASTNode; l?: ASTNode; r?: ASTNode; fn?: string; a?: ASTNode; n?: number; }

function _tokenize(s: string): Token[] {
  const toks: Token[] = [];
  let i = 0;
  while (i < s.length) {
    if (/\s/.test(s[i])) { i++; continue; }
    if (/\d/.test(s[i]) || (s[i] === '.' && /\d/.test(s[i + 1] || ''))) {
      let n = '';
      while (i < s.length && (/\d/.test(s[i]) || s[i] === '.')) n += s[i++];
      toks.push({ t: 'NUM', v: parseFloat(n) });
    } else if (/[a-zA-Z]/.test(s[i])) {
      let id = '';
      while (i < s.length && /[a-zA-Z]/.test(s[i])) id += s[i++];
      toks.push({ t: 'ID', v: id.toLowerCase() });
    } else {
      const map: Record<string, string> = { '+': 'ADD', '-': 'SUB', '*': 'MUL', '/': 'DIV', '^': 'POW', '(': 'LP', ')': 'RP' };
      const ch = s[i++];
      if (!(ch in map)) throw new Error('bad char: ' + ch);
      toks.push({ t: map[ch] });
    }
  }
  toks.push({ t: 'EOF' });
  return toks;
}

function _insertImplicitMul(toks: Token[]): Token[] {
  const ENDS   = new Set(['NUM', 'ID', 'RP']);
  const STARTS = new Set(['NUM', 'ID', 'LP']);
  const out: Token[] = [];
  for (let i = 0; i < toks.length; i++) {
    out.push(toks[i]);
    if (i + 1 < toks.length && ENDS.has(toks[i].t) && STARTS.has(toks[i + 1].t))
      out.push({ t: 'MUL' });
  }
  return out;
}

function _buildAST(toks: Token[]): ASTNode {
  let pos = 0;
  const peek   = () => toks[pos];
  const eat    = () => toks[pos++];
  const expect = (type: string) => { if (peek().t !== type) throw new Error('expected ' + type); return eat(); };

  function addSub(): ASTNode {
    let node = mulDiv();
    while (peek().t === 'ADD' || peek().t === 'SUB') {
      const op = eat().t;
      node = { op, l: node, r: mulDiv() };
    }
    return node;
  }
  function mulDiv(): ASTNode {
    let node = unary();
    while (peek().t === 'MUL' || peek().t === 'DIV') {
      const op = eat().t;
      node = { op, l: node, r: unary() };
    }
    return node;
  }
  function unary(): ASTNode {
    if (peek().t === 'SUB') { eat(); return { op: 'NEG', v: power() }; }
    if (peek().t === 'ADD') { eat(); return power(); }
    return power();
  }
  function power(): ASTNode {
    const base = primary();
    if (peek().t === 'POW') { eat(); return { op: 'POW', l: base, r: unary() }; }
    return base;
  }
  function primary(): ASTNode {
    const t = peek();
    if (t.t === 'NUM') { eat(); return { op: 'NUM', n: t.v as number }; }
    if (t.t === 'ID') {
      eat();
      if (t.v === 'x')         return { op: 'X' };
      if (t.v as string in _SAFE_CONSTS) return { op: 'NUM', n: _SAFE_CONSTS[t.v as string] };
      if (t.v as string in _SAFE_FUNS)  { expect('LP'); const a = addSub(); expect('RP'); return { op: 'FN', fn: t.v as string, a }; }
      throw new Error('unknown identifier: ' + t.v);
    }
    if (t.t === 'LP') { eat(); const node = addSub(); expect('RP'); return node; }
    throw new Error('unexpected token: ' + t.t);
  }

  const ast = addSub();
  if (peek().t !== 'EOF') throw new Error('trailing input');
  return ast;
}

function _evalAST(node: ASTNode, x: number): number {
  switch (node.op) {
    case 'NUM': return node.n!;
    case 'X':   return x;
    case 'ADD': return _evalAST(node.l!, x) + _evalAST(node.r!, x);
    case 'SUB': return _evalAST(node.l!, x) - _evalAST(node.r!, x);
    case 'MUL': return _evalAST(node.l!, x) * _evalAST(node.r!, x);
    case 'DIV': return _evalAST(node.l!, x) / _evalAST(node.r!, x);
    case 'POW': return Math.pow(_evalAST(node.l!, x), _evalAST(node.r!, x));
    case 'NEG': return -_evalAST(node.v!, x);
    case 'FN':  return _SAFE_FUNS[node.fn!](_evalAST(node.a!, x));
    default:    throw new Error('unknown op: ' + node.op);
  }
}

function parseRHS(rhs: string): { valid: boolean; fn?: (x: number) => number } {
  if (!rhs || !rhs.trim()) return { valid: false };
  try {
    const toks = _insertImplicitMul(_tokenize(rhs.trim()));
    const ast  = _buildAST(toks);
    const fn = (x: number) => {
      try {
        const v = _evalAST(ast, x);
        return (isFinite(v) && !isNaN(v)) ? v : NaN;
      } catch(e) { return NaN; }
    };
    for (let tx = 0; tx <= 14; tx += 2) {
      if (typeof fn(tx) !== 'number') return { valid: false };
    }
    return { valid: true, fn };
  } catch(e) { return { valid: false }; }
}

function safeEval(fn: ((x: number) => number) | null, x: number): number | null {
  if (!fn) return null;
  try { const v = fn(x); return (isFinite(v) && !isNaN(v)) ? v : null; }
  catch(e) { return null; }
}

function detectType(rhs: string): string {
  const s = rhs.replace(/\s/g, '');
  if (/\*\*3(?!\d)|\^3(?!\d)/.test(s))   return 'CUBIC';
  if (/\*\*2(?!\d)|\^2(?!\d)/.test(s))   return 'QUADRATIC';
  if (/sin|cos|tan/.test(s))             return 'TRIG';
  if (/\d\*\*x|\d\^x/.test(s))          return 'EXPONENTIAL';
  if ((s.match(/\([^)]*x[^)]*\)/g) || []).length >= 2) return 'FACTORED';
  if (/x/.test(s))                       return 'LINEAR';
  return 'CONSTANT';
}

const WORLD_ALLOWED_TYPES: (string[] | null)[] = [
  ['LINEAR'],
  ['QUADRATIC'],
  ['QUADRATIC', 'FACTORED'],
  null,
  ['EXPONENTIAL'],
];

const WORLD_TYPE_NAMES = ['Linear', 'Quadratic', 'Quadratic / Factored', 'Mixed', 'Exponential'];
const WORLD_STARTS = [0, 8, 14, 17, 23];

// ═══════════════════════════════════════
// CANVAS SETUP (module-level mutable state)
// ═══════════════════════════════════════
const X_MIN = 0, X_MAX = 14;        // gameplay range (trajectory, launch, stars)
const Y_MIN = -12, Y_MAX = 12;
const ML = 52, MB = 36, MT = 16, MR = 16;

let gameCanvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let GW = 0, GH = 0, CW = 0, CH = 0, DPR = 1;
let PPU = 1;     // pixels-per-unit (identical on both axes — square cells)
let gridX0 = ML; // left edge of grid in canvas px — updated by resize()
let gridY0 = MT; // top  edge of grid in canvas px — updated by resize()

// Visible coordinate window. The CONTENT range (X_MIN..Y_MAX above) is the
// gameplay area; the VISIBLE range is widened on the slack axis in resize()
// so the square-pixel grid fills the whole canvas instead of leaving a
// letter-boxed strip. Updated every resize().
let VX_MIN = X_MIN, VX_MAX = X_MAX, VY_MIN = Y_MIN, VY_MAX = Y_MAX;

function resize() {
  const panel = document.getElementById('right-panel');
  if (!panel || !gameCanvas) return;
  DPR = window.devicePixelRatio || 1;
  CW  = panel.clientWidth  || 300;
  CH  = panel.clientHeight || 300;
  gameCanvas.width  = Math.round(CW * DPR);
  gameCanvas.height = Math.round(CH * DPR);
  const availW = CW - ML - MR;
  const availH = CH - MT - MB;

  // Enforce SQUARE pixels so a gradient of 1 renders at a true 45°. ppu is
  // identical on both axes; the smaller content fit keeps the whole gameplay
  // area (X:0–14, Y:-12–12) visible.
  const xRange = X_MAX - X_MIN;
  const yRange = Y_MAX - Y_MIN;
  const ppu = Math.min(availW / xRange, availH / yRange);
  PPU = ppu;

  // The grid fills the whole canvas; the slack axis shows extra graph paper
  // (with seaweed on the seabed) rather than leaving empty letter-box margins.
  GW = availW;
  GH = availH;
  gridX0 = ML;
  gridY0 = MT;
  // X anchored at 0, extended rightward to fill; Y anchored at the seabed.
  VX_MIN = X_MIN;  VX_MAX = X_MIN + availW / ppu;
  VY_MIN = Y_MIN;  VY_MAX = Y_MIN + availH / ppu;

  // Re-grow the seaweed so it covers the full visible seabed width.
  makeClouds();
}

function m2c(mx: number, my: number): [number, number] {
  const cx = gridX0 + (mx - VX_MIN) / (VX_MAX - VX_MIN) * GW;
  const cy = gridY0 + GH - (my - VY_MIN) / (VY_MAX - VY_MIN) * GH;
  return [cx, cy];
}

// ═══════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════
let levelIdx   = 0;
let eqFn: ((x: number) => number) | null = null;
let eqValid    = false;
interface Star { x: number; y: number; collected: boolean; scale: number; flash: number; }
let stars: Star[] = [];
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number; }
let particles: Particle[] = [];
interface Cloud { x: number; y: number; w: number; }
let clouds: Cloud[] = [];

let animRunning  = false;
let animX        = 0;
const animSpeed  = 8.0;
let launchTimer: ReturnType<typeof setTimeout> | null = null;
let levelComplete = false;
let score        = 0;
const scoredLevels       = new Set<number>();
const bonusScoredLevels  = new Set<number>();
let bonusAnswered = false;
let tangentMode  = false;
let tangentX: number | null = null;
let prevAnimX    = 0;
let ballAngle    = 0;
let lastTs       = 0;
let launchDelay: ReturnType<typeof setTimeout> | null = null;
let gameLoopRaf: number | null = null;

function getWorldIdx(): number {
  return WORLD_STARTS.findIndex((start, i) => {
    const next = WORLD_STARTS[i + 1] ?? LEVELS.length;
    return levelIdx >= start && levelIdx < next;
  });
}

function updateScoreDisplay() {
  const el = document.getElementById('score-current');
  if (!el) return;
  el.textContent = String(score);
  el.classList.remove('bump');
  requestAnimationFrame(() => el.classList.add('bump'));
  setTimeout(() => el.classList.remove('bump'), 250);
}

function initScoreDisplay() {
  const el = document.getElementById('score-total');
  if (el) el.textContent = String(LEVELS.length * 2);
  updateScoreDisplay();
}

function makeClouds() {
  // Seaweed clumps span the ENTIRE visible seabed (including any extended
  // region past x=14), so the floor never looks bare. Positions/widths are
  // deterministic per index so they stay stable frame-to-frame.
  clouds = [];
  const spacing = 0.85;
  let i = 0;
  for (let x = VX_MIN + 0.6; x <= VX_MAX; x += spacing) {
    // stable pseudo-random in [0,1) from the index
    const r  = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
    const r2 = Math.abs((Math.sin(i * 78.233) * 12543.1234) % 1);
    const w  = 0.7 + r * 0.8;                 // width 0.7 .. 1.5
    const jx = (r2 - 0.5) * 0.4;              // small horizontal jitter
    clouds.push({ x: x + jx, y: 0, w });
    i++;
  }
}

function spawnStarBurst(mx: number, my: number) {
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    const s = 1.5 + Math.random() * 3;
    particles.push({
      x: mx, y: my,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      life: 0.9 + Math.random() * 0.5, maxLife: 1.4,
      size: 3 + Math.random() * 5,
      hue: 20 + Math.random() * 25,
    });
  }
}

function spawnTrail(mx: number, my: number) {
  if (Math.random() > 0.4) return;
  particles.push({
    x: mx + (Math.random() - 0.5) * 0.3,
    y: my,
    vx: (Math.random() - 0.5) * 0.15,
    vy: 0.3 + Math.random() * 0.4,
    life: 0.6, maxLife: 0.6,
    size: 2 + Math.random() * 4,
    hue: 0,
  });
}

function updateParticles(dt: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x   += p.vx * dt;
    p.y   += p.vy * dt;
    p.vy  -= 3 * dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function showWorldError(title: string, typeMsg: string) {
  const t = document.getElementById('world-error-title');
  const m = document.getElementById('world-error-type');
  const w = document.getElementById('world-error');
  if (t) t.textContent = title;
  if (m) m.textContent = typeMsg;
  if (w) w.classList.add('show');
}

function hideWorldError() {
  const w = document.getElementById('world-error');
  if (w) w.classList.remove('show');
}

function renderStarPips() {
  const row = document.getElementById('stars-row');
  if (!row) return;
  row.innerHTML = '';
  stars.forEach(s => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'star-pip');
    svg.setAttribute('viewBox', '0 0 20 20');
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    star.setAttribute('points', '10,1 12.9,7 19.5,7.6 14.8,12.1 16.2,18.5 10,15.4 3.8,18.5 5.2,12.1 0.5,7.6 7.1,7');
    star.setAttribute('fill', s.collected ? '#FFD700' : '#44444488');
    star.setAttribute('stroke', s.collected ? '#FFD70088' : '#33333388');
    star.setAttribute('stroke-width', '0.5');
    svg.appendChild(star);
    row.appendChild(svg);
  });
}

function renderTargetCoords(starList: { x: number; y: number }[]) {
  const el = document.getElementById('target-coords');
  if (!el) return;
  el.innerHTML = starList.map(s =>
    `<span class="target-pill">
      <svg width="11" height="11" viewBox="0 0 20 20" fill="#FFD700">
        <polygon points="10,1 12.9,7 19.5,7.6 14.8,12.1 16.2,18.5 10,15.4 3.8,18.5 5.2,12.1 0.5,7.6 7.1,7"/>
      </svg>
      (${s.x}, ${s.y})
    </span>`
  ).join('');
}

function updateWorldTabs() {
  const tabs = document.querySelectorAll('.world-tab');
  const currentWorld = WORLD_STARTS.findIndex((start, i) => {
    const next = WORLD_STARTS[i + 1] ?? LEVELS.length;
    return levelIdx >= start && levelIdx < next;
  });
  tabs.forEach((tab, i) => tab.classList.toggle('active', i === currentWorld));
}

function renderEqDisplay(raw: string) {
  const body = document.getElementById('eq-render-body');
  if (!body) return;
  body.textContent = '';
  if (!raw) {
    const ph = document.createElement('span');
    ph.style.opacity = '0.3';
    ph.textContent = '…';
    body.appendChild(ph);
    return;
  }
  let i = 0;
  while (i < raw.length) {
    if (raw[i] === '^') {
      i++;
      let exp = '';
      if (raw[i] === '(') {
        i++;
        while (i < raw.length && raw[i] !== ')') exp += raw[i++];
        if (i < raw.length) i++;
      } else {
        while (i < raw.length && /[0-9a-zA-Z]/.test(raw[i])) exp += raw[i++];
      }
      if (exp) { const sup = document.createElement('sup'); sup.textContent = exp; body.appendChild(sup); }
    } else {
      let text = '';
      while (i < raw.length && raw[i] !== '^') text += raw[i++];
      if (text) body.appendChild(document.createTextNode(text));
    }
  }
}

function applyEquation(raw: string, autoLaunch = true) {
  const eqWrap   = document.getElementById('eq-wrap');
  const eqStatus = document.getElementById('eq-status');
  const result   = parseRHS(raw);

  if (result.valid && result.fn) {
    eqFn   = result.fn;
    eqValid = true;
    if (eqWrap) { eqWrap.classList.remove('error'); }
    if (eqStatus) { eqStatus.classList.remove('error'); eqStatus.textContent = ''; }

    const worldIdx = getWorldIdx();
    const allowed  = LEVELS[levelIdx].allowedTypes ?? WORLD_ALLOWED_TYPES[worldIdx];
    const eqType   = detectType(raw);
    if (allowed !== null && !allowed.includes(eqType)) {
      showWorldError(
        'WRONG TYPE',
        `This level wants a ${WORLD_TYPE_NAMES[worldIdx]} equation — you typed a ${eqType.charAt(0) + eqType.slice(1).toLowerCase()} one`
      );
      if (launchDelay) clearTimeout(launchDelay);
      const ef = document.getElementById('err-flash');
      if (ef) ef.classList.remove('show');
      return;
    }

    let inWindow = false;
    for (let x = X_MIN; x <= X_MAX; x += 0.5) {
      const y = safeEval(result.fn, x);
      if (y !== null && y >= Y_MIN && y <= Y_MAX) { inWindow = true; break; }
    }
    if (!inWindow) {
      showWorldError(
        'CURVE OFF SCREEN',
        `Nothing to see here — your curve is outside the graph (y needs to be between −12 and 12)`
      );
      if (launchDelay) clearTimeout(launchDelay);
      const ef = document.getElementById('err-flash');
      if (ef) ef.classList.remove('show');
      return;
    }

    hideWorldError();

    if (autoLaunch) {
      if (launchDelay) clearTimeout(launchDelay);
      launchDelay = setTimeout(() => startRun(), 800);
    }

    const ef = document.getElementById('err-flash');
    if (ef) ef.classList.remove('show');
  } else {
    eqFn   = null;
    eqValid = false;
    if (eqWrap) eqWrap.classList.add('error');
    if (eqStatus) { eqStatus.classList.add('error'); eqStatus.textContent = "That equation isn't valid — double-check it"; }
    if (launchDelay) clearTimeout(launchDelay);

    hideWorldError();
    const ef = document.getElementById('err-flash');
    if (ef) {
      ef.classList.add('show');
      setTimeout(() => ef.classList.remove('show'), 400);
    }
  }
}

function triggerEquationChange(raw: string) {
  const eqInput = document.getElementById('eq-input') as HTMLTextAreaElement | null;
  const clean = raw.replace(/\n/g, '');
  if (eqInput && eqInput.value !== clean) eqInput.value = clean;
  renderEqDisplay(clean);
  applyEquation(clean);
}

function startRun() {
  if (!eqFn || levelComplete) return;
  animRunning = true;
  animX       = LEVELS[levelIdx].startX ?? 0;
  prevAnimX   = animX;
  ballAngle   = 0;
  const eqStatus = document.getElementById('eq-status');
  if (eqStatus) eqStatus.textContent = '';
  const lp = document.getElementById('launch-prompt');
  if (lp) lp.classList.add('hide');
}

function checkStarCollections() {
  let allCollected = true;
  stars.forEach(s => {
    if (s.collected) return;
    if (s.x >= prevAnimX - 0.05 && s.x <= animX + 0.05) {
      const charY = safeEval(eqFn, s.x);
      if (charY !== null && Math.abs(charY - s.y) < 0.55) {
        s.collected = true;
        s.flash     = 1.0;
        spawnStarBurst(s.x, s.y);
        renderStarPips();
      }
    }
    if (!s.collected) allCollected = false;
  });

  if (allCollected && animRunning && !levelComplete) {
    levelComplete = true;
    setTimeout(showLevelComplete, 600);
  }
}

function showNextBtn() {
  const btn = document.getElementById('next-btn');
  if (btn) {
    btn.classList.add('visible');
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  const rb = document.getElementById('mobile-replay-btn');
  if (rb) rb.classList.add('visible');
}

export function replayLevel() {
  const wf = document.getElementById('win-flash');
  const nb = document.getElementById('next-btn');
  const rb = document.getElementById('mobile-replay-btn');
  if (wf) wf.classList.remove('show');
  if (nb) nb.classList.remove('visible');
  if (rb) rb.classList.remove('visible');

  levelComplete = false;
  stars.forEach(s => { s.collected = false; s.flash = 0; });
  renderStarPips();

  animRunning  = false;
  animX        = LEVELS[levelIdx].startX ?? 0;
  prevAnimX    = animX;
  ballAngle    = 0;
  particles    = [];

  if (launchDelay) clearTimeout(launchDelay);
  eqFn   = null;
  eqValid = false;
  const input = document.getElementById('eq-input') as HTMLTextAreaElement | null;
  if (input) input.value = '';
  renderEqDisplay('');
  const eqStatus = document.getElementById('eq-status');
  if (eqStatus) eqStatus.textContent = '';
  const eqWrap = document.getElementById('eq-wrap');
  if (eqWrap) eqWrap.classList.remove('error');

  const lp = document.getElementById('launch-prompt');
  if (lp) lp.classList.remove('hide');
  if (input) input.focus();
}

export function nextLevel() {
  if (levelIdx + 1 < LEVELS.length) {
    loadLevel(levelIdx + 1);
  } else {
    const wt = document.querySelector('#win-flash .win-text');
    if (wt) wt.textContent = 'ALL OCEANS CLEARED';
    const wf = document.getElementById('win-flash');
    if (wf) wf.classList.add('show');
  }
}

export function jumpToWorld(worldNum: number) {
  loadLevel(WORLD_STARTS[worldNum]);
}

export function toggleTangentMode() {
  tangentMode = !tangentMode;
  if (!tangentMode) tangentX = null;
  const btn = document.getElementById('tangent-btn');
  if (!btn) return;
  btn.classList.toggle('active', tangentMode);
  const svgTan = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:-1px" aria-hidden="true"><path d="M3 21L21 3M3 21l6-2M3 21l2-6"/></svg> ';
  btn.innerHTML = tangentMode ? svgTan + 'Click the curve to place tangent' : svgTan + 'Draw tangent';
  const tInfoEl = document.getElementById('tangent-info');
  if (tInfoEl) {
    tInfoEl.textContent = tangentMode ? 'Click anywhere on the curve to drop a tangent line' : '';
    tInfoEl.classList.toggle('show', tangentMode);
  }
}

export function insertAtCursor(text: string) {
  const el = document.getElementById('eq-input') as HTMLTextAreaElement | null;
  if (!el) return;
  const start = el.selectionStart;
  const end   = el.selectionEnd;
  el.value = el.value.slice(0, start) + text + el.value.slice(end);
  el.selectionStart = el.selectionEnd = start + text.length;
  el.focus();
  el.dispatchEvent(new Event('input'));
}

export function insertSupN() {
  const el  = document.getElementById('eq-input') as HTMLTextAreaElement | null;
  if (!el) return;
  const pos = el.selectionStart;
  const before = el.value.slice(0, pos);
  const insert = before.trim() === '' ? 'x^' : '^';
  insertAtCursor(insert);
}

function toggleHint() {
  const hint = document.getElementById('level-hint');
  const btn  = document.getElementById('hint-btn');
  if (!hint || !btn) return;
  const showing = hint.classList.toggle('show');
  btn.innerHTML = showing
    ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:-1px" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg> Hide Hint'
    : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:-1px" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Show Hint';
}

function numericalGradient(fn: (x: number) => number, x: number): number | null {
  const h = 0.0001;
  const y1 = safeEval(fn, x - h);
  const y2 = safeEval(fn, x + h);
  if (y1 === null || y2 === null) return null;
  return (y2 - y1) / (2 * h);
}

function drawTangent() {
  if (!ctx || tangentX === null || !eqFn) return;
  const y0 = safeEval(eqFn, tangentX);
  if (y0 === null) return;
  const slope = numericalGradient(eqFn, tangentX);
  if (slope === null || !isFinite(slope)) return;

  ctx.save();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 5]);
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  let first = true;
  for (let tx = X_MIN; tx <= X_MAX; tx += 0.5) {
    const ty = y0 + slope * (tx - tangentX);
    if (ty < Y_MIN - 2 || ty > Y_MAX + 2) { first = true; continue; }
    const [px, py] = m2c(tx, ty);
    if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  const [ptX, ptY] = m2c(tangentX, y0);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.arc(ptX, ptY, 6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(ptX, ptY, 6, 0, Math.PI * 2); ctx.stroke();

  const labelX = ptX + 10, labelY = ptY - 10;
  const label = `m ≈ ${slope.toFixed(2)}`;
  ctx.font = 'bold 13px Arial';
  const tw = ctx.measureText(label).width;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(labelX - 4, labelY - 14, tw + 10, 20, 4);
  else ctx.rect(labelX - 4, labelY - 14, tw + 10, 20);
  ctx.fill();
  ctx.fillStyle = '#FFD700';
  ctx.fillText(label, labelX + 1, labelY);

  ctx.restore();
}

function showBonusQ(bq: BonusQ) {
  const panel   = document.getElementById('bonus-panel');
  const qEl     = document.getElementById('bonus-q');
  const choices  = document.getElementById('bonus-choices');
  const result  = document.getElementById('bonus-result');
  if (!panel || !qEl || !choices || !result) return;

  qEl.textContent = bq.q;
  choices.innerHTML = '';
  result.classList.remove('show');
  result.innerHTML = '';

  bq.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'bonus-choice';
    btn.textContent = c;
    btn.onclick = () => handleBonusAnswer(c, bq);
    choices.appendChild(btn);
  });

  panel.classList.add('show');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function handleBonusAnswer(chosen: string, bq: BonusQ) {
  if (bonusAnswered) return;
  bonusAnswered = true;

  const btns = document.querySelectorAll('.bonus-choice');
  const correct = chosen === bq.answer;

  btns.forEach(btn => {
    btn.classList.add('answered');
    if (btn.textContent === bq.answer) btn.classList.add(correct ? 'correct' : 'reveal');
    else if (btn.textContent === chosen && !correct) btn.classList.add('wrong');
  });

  const result = document.getElementById('bonus-result');
  if (result) {
    result.textContent = '';
    const line = document.createElement('div');
    line.className = `result-line ${correct ? 'ok' : 'bad'}`;
    line.textContent = correct ? 'Correct!' : "Not quite — here's why:";
    const explain = document.createElement('span');
    explain.textContent = bq.explain;
    result.appendChild(line);
    result.appendChild(explain);
    result.classList.add('show');
  }

  if (correct && !bonusScoredLevels.has(levelIdx)) {
    bonusScoredLevels.add(levelIdx);
    score++;
    updateScoreDisplay();
  }

  if (levelComplete) {
    setTimeout(() => showNextBtn(), correct ? 800 : 1400);
  }
}

function showLevelComplete() {
  const isLast = levelIdx + 1 >= LEVELS.length;

  if (!scoredLevels.has(levelIdx)) {
    scoredLevels.add(levelIdx);
    score++;
    updateScoreDisplay();
  }

  const wf = document.getElementById('win-flash');
  if (wf) wf.classList.add('show');
  const lp = document.getElementById('launch-prompt');
  if (lp) lp.classList.add('hide');
  const ws = document.getElementById('win-sub');
  if (ws) ws.textContent = isLast ? 'Every ocean cleared' : 'Hit next to keep going';

  const canvasBtn = document.getElementById('canvas-next-btn');
  if (canvasBtn) {
    if (isLast) {
      canvasBtn.textContent = 'Play Again';
      (canvasBtn as HTMLButtonElement).onclick = () => { window.location.href = '/'; };
    } else {
      canvasBtn.textContent = 'Next Level →';
      (canvasBtn as HTMLButtonElement).onclick = nextLevel;
    }
  }

  const lv = LEVELS[levelIdx];
  showNextBtn();
  if (lv.bonusQ && !bonusAnswered && window.innerWidth > 900) {
    showBonusQ(lv.bonusQ);
  }
}

function loadLevel(idx: number) {
  levelIdx     = idx;
  levelComplete = false;
  animRunning  = false;
  animX        = LEVELS[idx].startX ?? 0;
  eqFn         = null;
  eqValid      = false;
  particles    = [];

  const lv = LEVELS[idx];
  stars = lv.stars.map(s => ({ ...s, collected: false, scale: 1, flash: 0 }));

  const lt = document.getElementById('level-title');
  const ld = document.getElementById('level-desc');
  const lh = document.getElementById('level-hint');
  const bw = document.getElementById('banner-world');
  const bt = document.getElementById('banner-title');
  if (lt) lt.textContent = lv.world;
  if (ld) ld.textContent = lv.desc;
  if (lh) lh.textContent = lv.hint;
  if (bw) bw.textContent = lv.world;
  if (bt) bt.textContent = lv.title;

  renderStarPips();
  renderTargetCoords(lv.stars);

  const eqInput = document.getElementById('eq-input') as HTMLTextAreaElement | null;
  if (eqInput) {
    eqInput.value = lv.startEq;
    eqInput.classList.remove('error');
  }
  renderEqDisplay(lv.startEq);
  applyEquation(lv.startEq, false);

  const nb = document.getElementById('next-btn');
  const rb = document.getElementById('mobile-replay-btn');
  const wf = document.getElementById('win-flash');
  const lp = document.getElementById('launch-prompt');
  const bp = document.getElementById('bonus-panel');
  const bc = document.getElementById('bonus-choices');
  const br = document.getElementById('bonus-result');
  if (nb) nb.classList.remove('visible');
  if (rb) rb.classList.remove('visible');
  if (wf) wf.classList.remove('show');
  if (lp) lp.classList.remove('hide');
  if (bp) bp.classList.remove('show');
  if (bc) bc.innerHTML = '';
  if (br) br.classList.remove('show');
  bonusAnswered = false;

  if (LEVELS[idx].bonusQ) {
    showBonusQ(LEVELS[idx].bonusQ!);
  }

  if (lh) lh.classList.remove('show');
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) hintBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:-1px" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Show Hint';

  tangentX = null;
  tangentMode = false;
  const tBtn = document.getElementById('tangent-btn');
  if (tBtn) { tBtn.classList.remove('active'); tBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:-1px" aria-hidden="true"><path d="M3 21L21 3M3 21l6-2M3 21l2-6"/></svg> Draw tangent'; }
  const tInfo = document.getElementById('tangent-info');
  if (tInfo) { tInfo.textContent = ''; tInfo.classList.remove('show'); }

  const showTangent = idx >= 5 && idx <= 11;
  const ts = document.getElementById('tangent-section');
  if (ts) ts.style.display = showTangent ? '' : 'none';

  const totalLevels = LEVELS.length;
  const pct = ((idx + 1) / totalLevels) * 100;
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = (idx + 1) + ' / ' + totalLevels;

  updateWorldTabs();
}

// ═══════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════
function drawCaustics(W: number, H: number) {
  if (!ctx) return;
  const t = Date.now() / 2000;
  ctx.save();
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 6; i++) {
    const x = (i / 6 + t * 0.05) % 1 * W;
    const g = ctx.createLinearGradient(x, 0, x + 60, H * 0.5);
    g.addColorStop(0, '#aaffee');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 30, H * 0.5);
    ctx.lineTo(x + 60, 0);
    ctx.fill();
  }
  ctx.restore();
}

function drawGrid() {
  if (!ctx) return;
  ctx.lineWidth = 1;

  // Integer bounds of the visible window (may run negative / beyond the
  // gameplay area when the canvas is wider/taller than the content).
  const gx0 = Math.ceil(VX_MIN),  gx1 = Math.floor(VX_MAX);
  const gy0 = Math.ceil(VY_MIN),  gy1 = Math.floor(VY_MAX);

  ctx.strokeStyle = 'rgba(100,220,255,0.08)';
  for (let x = gx0; x <= gx1; x++) {
    const [cx] = m2c(x, 0);
    ctx.beginPath(); ctx.moveTo(cx, gridY0); ctx.lineTo(cx, gridY0 + GH); ctx.stroke();
  }
  for (let y = gy0; y <= gy1; y++) {
    const [, cy] = m2c(0, y);
    ctx.beginPath(); ctx.moveTo(gridX0, cy); ctx.lineTo(gridX0 + GW, cy); ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(100,220,255,0.2)';
  for (let x = gx0 + ((gx0 % 2) + 2) % 2; x <= gx1; x += 2) {
    const [cx] = m2c(x, 0);
    ctx.beginPath(); ctx.moveTo(cx, gridY0); ctx.lineTo(cx, gridY0 + GH); ctx.stroke();
  }
  for (let y = gy0 + ((gy0 % 2) + 2) % 2; y <= gy1; y += 2) {
    const [, cy] = m2c(0, y);
    ctx.beginPath(); ctx.moveTo(gridX0, cy); ctx.lineTo(gridX0 + GW, cy); ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(100,220,255,0.5)';
  ctx.lineWidth = 2;
  const [axX] = m2c(0, 0);
  ctx.beginPath(); ctx.moveTo(axX, gridY0); ctx.lineTo(axX, gridY0 + GH); ctx.stroke();
  const [, axY] = m2c(0, 0);
  ctx.strokeStyle = 'rgba(150,240,255,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(gridX0, axY); ctx.lineTo(gridX0 + GW, axY); ctx.stroke();
  if (VY_MIN < 0) {
    const [, zeroY]  = m2c(0, 0);
    const [, floorY] = m2c(0, VY_MIN);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(gridX0, zeroY, GW, floorY - zeroY);
  }

  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  for (let x = gx0 + ((gx0 % 2) + 2) % 2; x <= gx1; x += 2) {
    if (x === 0) continue;
    const [cx] = m2c(x, 0);
    const lbl = String(x);
    const tw = ctx.measureText(lbl).width;
    const ph = 20;
    const py = Math.min(Math.max(axY + 4, gridY0 + 2), gridY0 + GH - ph - 2);
    const px = cx - tw/2 - 7, pw = tw + 14;
    ctx.fillStyle = 'rgba(3,20,42,0.75)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(px, py, pw, ph, 5);
    else ctx.rect(px, py, pw, ph);
    ctx.fill();
    ctx.fillStyle = 'rgba(219,234,254,0.90)';
    ctx.fillText(lbl, cx, py + 14);
  }

  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  for (let y = gy0 + ((gy0 % 2) + 2) % 2; y <= gy1; y += 2) {
    if (y === 0) continue;
    const [, cy] = m2c(0, y);
    const lbl = String(y);
    const tw = ctx.measureText(lbl).width;
    const px = gridX0 - tw - 16, py = cy - 10, pw = tw + 14, ph = 20;
    ctx.fillStyle = y < 0 ? 'rgba(3,10,30,0.80)' : 'rgba(3,20,42,0.72)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(px, py, pw, ph, 5);
    else ctx.rect(px, py, pw, ph);
    ctx.fill();
    ctx.fillStyle = y < 0 ? '#93c5fd' : 'rgba(219,234,254,0.88)';
    ctx.fillText(lbl, gridX0 - 8, cy + 5);
  }
  ctx.textAlign = 'left';
}

function drawBlade(bx: number, by: number, h: number, angle: number, swayT: number, bladeW: number) {
  if (!ctx) return;
  const segs = 10;
  const spine: {x:number,y:number,frac:number}[] = [];

  for (let k = 0; k <= segs; k++) {
    const frac = k / segs;
    const curve = Math.sin(swayT + frac * 2.8) * 14 * frac * frac;
    spine.push({
      x: bx + Math.sin(angle) * h * frac + curve,
      y: by - Math.cos(angle) * h * frac,
      frac
    });
  }

  const px2 =  Math.cos(angle);
  const py2 = -Math.sin(angle);

  const left: {x:number,y:number}[] = [], right: {x:number,y:number}[] = [];
  for (let k = 0; k <= segs; k++) {
    const { x, y, frac } = spine[k];
    const w = bladeW * (1 - frac * 0.82);
    const notch = Math.sin(k * 3.1 + swayT) * w * 0.18;
    left.push ({ x: x - px2 * (w + notch), y: y - py2 * (w + notch) });
    right.push({ x: x + px2 * (w - notch), y: y + py2 * (w - notch) });
  }

  ctx.save();
  ctx.lineCap  = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for (let k = 1; k <= segs; k++) {
    const mx2 = (left[k-1].x + left[k].x) / 2;
    const my2 = (left[k-1].y + left[k].y) / 2;
    ctx.quadraticCurveTo(left[k-1].x, left[k-1].y, mx2, my2);
  }
  ctx.lineTo(spine[segs].x, spine[segs].y);
  for (let k = segs - 1; k >= 0; k--) {
    const mx2 = (right[k+1].x + right[k].x) / 2;
    const my2 = (right[k+1].y + right[k].y) / 2;
    ctx.quadraticCurveTo(right[k+1].x, right[k+1].y, mx2, my2);
  }
  ctx.closePath();

  const tip  = spine[segs];
  const grad = ctx.createLinearGradient(bx, by, tip.x, tip.y);
  grad.addColorStop(0,    '#0a1410');
  grad.addColorStop(0.35, '#173320');
  grad.addColorStop(0.75, '#1f4528');
  grad.addColorStop(1,    '#275535');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(4, 9, 6, 0.95)';
  ctx.lineWidth   = 1.8;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(65, 110, 72, 0.55)';
  ctx.lineWidth   = Math.max(1, bladeW * 0.18);
  ctx.beginPath();
  ctx.moveTo(spine[0].x, spine[0].y);
  for (let k = 1; k <= segs; k++) {
    const mx2 = (spine[k-1].x + spine[k].x) / 2;
    const my2 = (spine[k-1].y + spine[k].y) / 2;
    ctx.quadraticCurveTo(spine[k-1].x, spine[k-1].y, mx2, my2);
  }
  ctx.stroke();

  ctx.restore();
}

function drawSeaweed() {
  if (!ctx) return;
  const t = Date.now() / 1500;

  const variants = [
    [-0.30, -0.08, 0.10, 0.32],
    [-0.22,  0.06, 0.28],
    [-0.35, -0.12, 0.08, 0.30, 0.50],
    [-0.18,  0.02, 0.22, 0.42],
  ];

  clouds.forEach((s, i) => {
    const [bx, by] = m2c(s.x, Y_MIN);
    const baseH  = GH * (0.16 + s.w * 0.045);
    const bladeW = Math.max(6, PPU * (X_MAX - X_MIN) * 0.013) * s.w;
    const angles = variants[i % variants.length];

    ctx!.save();

    angles.forEach((a, fi) => {
      if (fi % 2 !== 0) return;
      const sway  = Math.sin(t * 0.85 + i * 1.4 + fi * 1.9) * 0.08;
      const hMult = 0.85 + (fi * 0.04);
      ctx!.globalAlpha = 0.75;
      drawBlade(bx, by, baseH * hMult, a + sway, t * 0.9 + i * 1.7 + fi * 1.3, bladeW * 0.88);
    });

    angles.forEach((a, fi) => {
      if (fi % 2 === 0) return;
      const sway  = Math.sin(t * 0.85 + i * 1.4 + fi * 1.9) * 0.08;
      const hMult = 0.78 + (fi * 0.03);
      ctx!.globalAlpha = 1.0;
      drawBlade(bx, by, baseH * hMult, a + sway, t * 0.9 + i * 1.7 + fi * 1.3, bladeW);
    });

    ctx!.globalAlpha = 1;

    if (i % 3 === 0) {
      const bT   = (t * 0.55 + i * 0.9) % 1;
      const bAlp = Math.sin(bT * Math.PI) * 0.5;
      const bRad = 2 + (i % 3);
      ctx!.globalAlpha = bAlp;
      ctx!.strokeStyle = 'rgba(120, 200, 215, 1)';
      ctx!.lineWidth   = 1;
      ctx!.beginPath();
      ctx!.arc(bx + Math.sin(t + i) * 4, by - bT * baseH * 1.5, bRad, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.fillStyle = 'rgba(160, 220, 235, 0.12)';
      ctx!.fill();
      ctx!.globalAlpha = 1;
    }

    ctx!.restore();
  });
}

function drawGround() {
  if (!ctx) return;
  // Seabed spans the full visible width, not just the gameplay range.
  const [x0, y0] = m2c(VX_MIN, Y_MIN);
  const [x1]     = m2c(VX_MAX, Y_MIN);
  const floorH   = Math.max(16, GH * 0.055);

  const sandGrad = ctx.createLinearGradient(0, y0, 0, y0 + floorH);
  sandGrad.addColorStop(0, '#c8a86b');
  sandGrad.addColorStop(1, '#8b6a30');
  ctx.fillStyle = sandGrad;
  ctx.fillRect(x0, y0, x1 - x0, floorH);

  ctx.fillStyle = 'rgba(100,70,30,0.35)';
  for (let i = 0; i < 18; i++) {
    const px = x0 + (i / 18) * (x1 - x0) + 10;
    const pr = 2 + (i % 3);
    ctx.beginPath();
    ctx.ellipse(px, y0 + floorH * 0.4, pr * 1.6, pr * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#5a3a10';
  ctx.fillRect(x0, y0 + floorH, x1 - x0, 4);
}

const TRAJ_SAMPLE = 280;

function drawTrajectory() {
  if (!ctx || !eqFn) return;
  ctx.save();
  ctx.setLineDash([8, 5]);
  ctx.strokeStyle = 'rgba(80,220,255,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= TRAJ_SAMPLE; i++) {
    // Sample across the full VISIBLE x-axis (not just the 0–14 gameplay range)
    // so every equation's curve is drawn all the way to the right edge.
    const x = VX_MIN + (i / TRAJ_SAMPLE) * (VX_MAX - VX_MIN);
    const y = safeEval(eqFn, x);
    if (y === null || y < VY_MIN || y > VY_MAX) { started = false; continue; }
    const [cx, cy] = m2c(x, y);
    if (!started) { ctx.moveTo(cx, cy); started = true; }
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
  ctx.restore();
}

function drawTreasure(cx: number, cy: number, ppu: number, collected: boolean, flash: number, sx: number, sy: number) {
  if (!ctx) return;
  const r = Math.max(18, ppu * 0.40);
  ctx.save();
  ctx.globalAlpha = collected ? 0.2 : 1.0;
  ctx.translate(cx, cy);

  if (flash > 0) {
    ctx.shadowBlur  = 28 * flash;
    ctx.shadowColor = '#ff6080';
  }

  if (!collected) {
    const starPath = (outer: number, inner: number) => {
      ctx!.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI / 5) - Math.PI / 2;
        const rad   = i % 2 === 0 ? outer : inner;
        const x = Math.cos(angle) * rad;
        const y = Math.sin(angle) * rad;
        i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.closePath();
    };

    ctx.shadowBlur  = 18;
    ctx.shadowColor = '#FFD700';

    const starG = ctx.createRadialGradient(0, -r*0.2, r*0.1, 0, 0, r);
    starG.addColorStop(0, '#fff6a0');
    starG.addColorStop(0.5, '#FFD700');
    starG.addColorStop(1, '#cc8800');
    ctx.fillStyle = starG;
    starPath(r, r * 0.42);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#cc8800'; ctx.lineWidth = r * 0.08;
    starPath(r, r * 0.42);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,220,0.55)';
    ctx.beginPath();
    ctx.ellipse(-r*0.18, -r*0.32, r*0.22, r*0.13, -0.6, 0, Math.PI*2);
    ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(255,215,0,0.12)';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI*2); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const bx = (i - 1.5) * r * 0.32;
      const by = -r * 0.3 - i * r * 0.22;
      ctx.strokeStyle = 'rgba(255,220,80,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(bx, by, r * 0.09, 0, Math.PI*2); ctx.stroke();
    }
  }

  ctx.shadowBlur = 0;

  if (!collected) {
    const fs = Math.max(11, Math.round(ppu * 0.24));
    ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    const txt = `(${sx}, ${sy})`;
    const tw = ctx.measureText(txt).width;
    const lx = 0, ly = -r * 1.62;
    const ph = fs + 6, pw = tw + 14;
    ctx.fillStyle = 'rgba(3,20,42,0.82)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(lx - pw/2, ly - ph + 4, pw, ph, ph/2);
    else ctx.rect(lx - pw/2, ly - ph + 4, pw, ph);
    ctx.fill();
    ctx.strokeStyle = '#FFD70040';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.fillText(txt, lx, ly);
  }

  ctx.restore();
}

function drawHoops() {
  stars.forEach(s => {
    if (s.flash > 0) s.flash = Math.max(0, s.flash - 0.05);
    const [cx, cy] = m2c(s.x, s.y);
    const ppu = GW / (VX_MAX - VX_MIN);
    drawTreasure(cx, cy, ppu, s.collected, s.flash, s.x, s.y);
  });
}

function drawParticles() {
  if (!ctx) return;
  for (const p of particles) {
    const [cx, cy] = m2c(p.x, p.y);
    const a = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = a * 0.7;
    const r = p.size * 0.9;
    ctx.strokeStyle = `hsla(${180 + p.hue * 0.3}, 80%, 75%, 1)`;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = `hsla(200, 90%, 90%, 0.4)`;
    ctx.beginPath(); ctx.arc(cx - r*0.25, cy - r*0.25, r*0.3, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawShark(cx: number, cy: number, wag: number, angle = 0) {
  if (!ctx) return;
  const r = Math.max(20, PPU * (X_MAX - X_MIN) * 0.042);
  const tailWag = Math.sin(wag * 2.5) * 0.3;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle); // rotate entire shark to follow the curve tangent

  ctx.save();
  ctx.rotate(tailWag);
  ctx.fillStyle = '#5a7a8a';
  ctx.beginPath();
  ctx.moveTo(-r * 0.55, 0);
  ctx.lineTo(-r * 1.6,  -r * 0.65);
  ctx.quadraticCurveTo(-r * 1.1, 0, -r * 1.6, r * 0.65);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const bodyG = ctx.createLinearGradient(-r, -r * 0.5, r, r * 0.5);
  bodyG.addColorStop(0,   '#7a9aaa');
  bodyG.addColorStop(0.4, '#5a7a8a');
  bodyG.addColorStop(1,   '#3a5060');
  ctx.fillStyle = bodyG;
  ctx.shadowBlur  = 12;
  ctx.shadowColor = 'rgba(60,100,140,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(220,235,240,0.75)';
  ctx.beginPath();
  ctx.ellipse(r * 0.1, r * 0.18, r * 0.65, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4a6a7a';
  ctx.beginPath();
  ctx.moveTo(r * 0.05, -r * 0.38);
  ctx.lineTo(r * 0.35, -r * 1.1);
  ctx.lineTo(r * 0.6,  -r * 0.38);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#4a6878';
  ctx.beginPath();
  ctx.moveTo(r * 0.05, r * 0.1);
  ctx.lineTo(-r * 0.3, r * 0.72);
  ctx.lineTo(r * 0.45, r * 0.25);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(r * 0.55, -r * 0.1, r * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(r * 0.57, -r * 0.13, r * 0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#c8d8e0';
  ctx.beginPath();
  ctx.moveTo(r * 0.85, -r * 0.08);
  ctx.lineTo(r * 1.05, r * 0.04);
  ctx.lineTo(r * 0.85, r * 0.14);
  ctx.quadraticCurveTo(r * 0.7, r * 0.06, r * 0.85, -r * 0.08);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 3; i++) {
    const tx = r * 0.9 + i * r * 0.055;
    ctx.beginPath();
    ctx.moveTo(tx, -r * 0.04);
    ctx.lineTo(tx + r * 0.04, r * 0.04);
    ctx.lineTo(tx + r * 0.025, -r * 0.04);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(50,70,90,0.5)';
  ctx.lineWidth = Math.max(1.5, r * 0.06);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(r * 0.3, 0, r * 0.3, -0.6, 0.6);
  ctx.stroke();

  ctx.restore();
}

function drawLauncher() {
  if (!eqFn) return;
  const sx0 = LEVELS[levelIdx]?.startX ?? 0;
  const startY = safeEval(eqFn, sx0) ?? 0;
  const [sx, sy] = m2c(sx0, startY);
  // Show the shark already pointing along the curve before launch
  let launchAngle = 0;
  const ddx = 0.05;
  const startY2 = safeEval(eqFn, sx0 + ddx);
  if (startY2 !== null) {
    const [sx2, sy2] = m2c(sx0 + ddx, startY2);
    launchAngle = Math.atan2(sy2 - sy, sx2 - sx);
  }
  drawShark(sx, sy, 0, launchAngle);
}

function drawCharacter() {
  if (!eqFn) return;
  const rawY = safeEval(eqFn, animX) ?? 0;
  const [cx, cy] = m2c(animX, rawY);
  // Compute orientation from the curve's tangent in canvas-pixel space.
  // Using a delta in math-x and converting both points to canvas coords
  // automatically accounts for any axis scaling, so the angle is visually exact.
  let sharkAngle = 0;
  const ddx = 0.05;
  const rawY2 = safeEval(eqFn, animX + ddx);
  if (rawY2 !== null) {
    const [cx2, cy2] = m2c(animX + ddx, rawY2);
    sharkAngle = Math.atan2(cy2 - cy, cx2 - cx);
  }
  spawnTrail(animX, rawY);
  drawShark(cx, cy, ballAngle, sharkAngle);
}

function render() {
  if (!ctx) return;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const W = CW, H = CH;

  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0,    '#1a8fa0');
  ocean.addColorStop(0.35, '#0e5f7a');
  ocean.addColorStop(0.75, '#083050');
  ocean.addColorStop(1,    '#03142a');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);

  drawCaustics(W, H);

  const vignette = ctx.createRadialGradient(W * 0.5, 0, 0, W * 0.5, 0, W * 0.75);
  vignette.addColorStop(0,   'rgba(0,0,0,0.18)');
  vignette.addColorStop(0.6, 'rgba(0,0,0,0.06)');
  vignette.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H * 0.55);

  drawGrid();

  const [floorX0] = m2c(VX_MIN, Y_MIN);
  const [floorX1, floorY] = m2c(VX_MAX, Y_MIN);
  const glowH = GH * 0.15;
  const floorGlow = ctx.createLinearGradient(0, floorY - glowH, 0, floorY);
  floorGlow.addColorStop(0, 'rgba(0,0,0,0)');
  floorGlow.addColorStop(1, 'rgba(0,8,4,0.45)');
  ctx.fillStyle = floorGlow;
  ctx.fillRect(floorX0, floorY - glowH, floorX1 - floorX0, glowH);

  drawSeaweed();
  drawGround();

  if (eqFn) drawTrajectory();
  drawTangent();

  drawHoops();
  drawParticles();

  if (animRunning) drawCharacter();
  else if (eqFn) drawLauncher();
}

function gameLoop(ts: number) {
  const dt = Math.min((ts - lastTs) / 1000, 0.033);
  lastTs = ts;

  if (animRunning && eqFn) {
    prevAnimX  = animX;
    animX     += animSpeed * dt;
    ballAngle += animSpeed * dt * 2.8;
    checkStarCollections();

    // Let the shark swim all the way to the end of the VISIBLE curve, not just
    // the gameplay range — so flat lines like y=3 don't stop mid-axis.
    if (animX > VX_MAX) {
      animRunning = false;
      animX = VX_MAX;

      if (!levelComplete) {
        stars.forEach(s => { s.collected = false; s.flash = 0; });
        renderStarPips();

        setTimeout(() => {
          if (!levelComplete) {
            const lp = document.getElementById('launch-prompt');
            if (lp) lp.classList.remove('hide');
          }
        }, 1000);
      }
    }
  }

  updateParticles(dt);
  stars.forEach(s => { if (s.flash > 0) s.flash -= dt * 2; });

  render();
  gameLoopRaf = requestAnimationFrame(gameLoop);
}

function init() {
  makeClouds();
  initScoreDisplay();
  loadLevel(0);
  gameLoopRaf = requestAnimationFrame(gameLoop);
}

// ═══════════════════════════════════════
// REACT COMPONENT
// ═══════════════════════════════════════
export default function GamePage() {
  useEffect(() => {
    gameCanvas = document.getElementById('game') as HTMLCanvasElement;
    if (!gameCanvas) return;
    ctx = gameCanvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize);

    // Equation input events
    const eqInput  = document.getElementById('eq-input') as HTMLTextAreaElement | null;
    const eqWrap   = document.getElementById('eq-wrap');

    if (eqInput && eqWrap) {
      eqInput.addEventListener('focus', () => eqWrap.classList.add('focused'));
      eqInput.addEventListener('blur',  () => eqWrap.classList.remove('focused'));
      eqWrap.addEventListener('click',  () => eqInput.focus());

      eqInput.addEventListener('input', function(this: HTMLTextAreaElement) {
        triggerEquationChange(this.value);
      });
      eqInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); if (launchDelay) clearTimeout(launchDelay); startRun(); }
      });
    }

    // Canvas click → tangent
    gameCanvas.addEventListener('click', function(e: MouseEvent) {
      if (!tangentMode || !eqFn) return;
      const rect = (this as HTMLCanvasElement).getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const mx = VX_MIN + (px - gridX0) / GW * (VX_MAX - VX_MIN);
      if (mx < X_MIN || mx > X_MAX) return;
      tangentX = mx;
      const slope = numericalGradient(eqFn, tangentX);
      const y0    = safeEval(eqFn, tangentX);
      if (slope !== null && isFinite(slope) && y0 !== null) {
        const info = document.getElementById('tangent-info');
        if (info) {
          info.textContent = `x=${tangentX.toFixed(2)}, y=${y0.toFixed(2)}  ∴  m ≈ ${slope.toFixed(3)}`;
          info.classList.add('show');
        }
      }
    });

    // ── ONBOARDING ──
    const overlay = document.getElementById('onboard-overlay');
    const onboardBtn = document.getElementById('onboard-btn');
    const onboardSkip = document.getElementById('onboard-skip');

    let dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      if (!overlay) return;
      overlay.classList.remove('visible');
      overlay.classList.add('fading');
      setTimeout(() => {
        overlay.remove();
        if (eqInput) eqInput.focus();
      }, 400);
    }

    setTimeout(() => {
      requestAnimationFrame(() => { if (overlay) overlay.classList.add('visible'); });
    }, 160);

    if (onboardBtn) onboardBtn.addEventListener('click', dismiss);
    if (onboardSkip) onboardSkip.addEventListener('click', dismiss);
    if (overlay) overlay.addEventListener('click', (e: Event) => { if (e.target === overlay) dismiss(); });
    document.addEventListener('keydown', dismiss, { once: true });
    setTimeout(dismiss, 20000);

    init();

    return () => {
      window.removeEventListener('resize', resize);
      if (gameLoopRaf) cancelAnimationFrame(gameLoopRaf);
      if (launchDelay) clearTimeout(launchDelay);
    };
  }, []);

  return (
    <div id="game-root">
      {/* ONBOARDING OVERLAY */}
      <div id="onboard-overlay">
        <div id="onboard-card">
          <div id="onboard-shark-icon">
            <svg width="48" height="38" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 20 L2 13 L2 27 Z" fill="#FFD700"/>
              <path d="M9 20 C9 12 15 8 25 8 C36 8 44 13 44 20 C44 27 36 32 25 32 C15 32 9 28 9 20Z" fill="#FFD700"/>
              <path d="M16 24 C16 21 20 19 26 19 C32 19 38 21 38 24 C38 27 32 29 26 29 C20 29 16 27 16 24Z" fill="#FFF3B0" opacity="0.6"/>
              <path d="M21 8 L27 8 L25 4 Z" fill="#E6C200"/>
              <circle cx="35" cy="17" r="5.5" fill="white"/>
              <circle cx="36" cy="17" r="2.8" fill="#0b1726"/>
              <circle cx="37.2" cy="15.5" r="1.1" fill="white"/>
              <rect x="30" y="12" width="10" height="9" rx="3" fill="none" stroke="#0b1726" strokeWidth="2"/>
              <line x1="40" y1="15.5" x2="44" y2="14.5" stroke="#0b1726" strokeWidth="2" strokeLinecap="round"/>
              <path d="M29 25 Q33 29 39 25" fill="none" stroke="#0b1726" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>

          <div id="onboard-eyebrow">HOW TO PLAY</div>
          <h2 id="onboard-title">Key in the equation and make the shark reach the star</h2>

          <div id="onboard-steps">
            <div className="onboard-step">
              <div className="onboard-step-num">1</div>
              <div className="onboard-step-body">
                <div className="onboard-step-label">Type an equation below</div>
                <div className="onboard-step-eg">e.g. &nbsp;<code>y = x + 2</code></div>
              </div>
            </div>
            <div className="onboard-step">
              <div className="onboard-step-num">2</div>
              <div className="onboard-step-body">
                <div className="onboard-step-label">The shark follows your curve</div>
              </div>
            </div>
            <div className="onboard-step">
              <div className="onboard-step-num">3</div>
              <div className="onboard-step-body">
                <div className="onboard-step-label">Guide it through every <span className="onboard-star">★</span> to advance</div>
              </div>
            </div>
          </div>

          <button id="onboard-btn">Let&apos;s go &rarr;</button>
          <div id="onboard-skip">Press any key to skip</div>
        </div>
      </div>

      {/* LEFT PANEL */}
      <div id="left-panel">
        <div id="mobile-disclaimer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          Best played on desktop
        </div>
        <a className="back-btn" href="/">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          All games
        </a>

        <div className="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,opacity:0.9}} aria-hidden="true">
            <path d="M2 12C2 12 4 5 12 5C18 5 22 9 22 12C22 14 20 16 18 17L20 20H15L13 17C12.3 17.1 11.7 17.1 11 17L9 20H4L6 17C4 16 2 14 2 12Z" fill="#FFD700" opacity="0.85"/>
            <circle cx="16" cy="11" r="1.2" fill="#04080f"/>
          </svg>
          Shark Equation
        </div>

        <div className="rule"></div>

        <div id="progress-row" style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div id="progress-track" style={{flex:1,height:'4px',background:'var(--surface)',borderRadius:'4px',overflow:'hidden'}}>
            <div id="progress-fill" style={{height:'100%',background:'linear-gradient(90deg,var(--gold-dim),var(--gold))',borderRadius:'4px',width:'0%',transition:'width 0.5s ease'}}></div>
          </div>
          <div id="progress-label" style={{fontFamily:"'Nunito',sans-serif",fontSize:'13px',fontWeight:800,color:'var(--text-dim)',letterSpacing:'0.5px',whiteSpace:'nowrap'}}>1 / 21</div>
        </div>

        <div id="eq-wrap">
          <div id="eq-render"><span className="eq-prefix-r">y =</span><span id="eq-render-body"></span></div>
          <textarea id="eq-input" spellCheck={false} autoComplete="off" onChange={() => {}} />
        </div>
        <div id="superscript-btns">
          <button className="sup-btn" onClick={() => insertAtCursor('^2')}>x²</button>
          <button className="sup-btn" onClick={() => insertAtCursor('^3')}>x³</button>
          <button className="sup-btn" onClick={() => insertSupN()}>x<sup>n</sup></button>
          <button className="sup-btn" onClick={() => insertAtCursor('(')}>(</button>
          <button className="sup-btn" onClick={() => insertAtCursor(')')}>)</button>
        </div>
        <div id="eq-status"></div>

        <div id="world-tabs">
          <div className="world-tab active" onClick={() => jumpToWorld(0)}>W1<br /><span style={{fontSize:'11px',fontWeight:600,opacity:0.7}}>Linear</span></div>
          <div className="world-tab" onClick={() => jumpToWorld(1)}>W2<br /><span style={{fontSize:'11px',fontWeight:600,opacity:0.7}}>Quadratic</span></div>
          <div className="world-tab" onClick={() => jumpToWorld(2)}>W3<br /><span style={{fontSize:'11px',fontWeight:600,opacity:0.7}}>Factored</span></div>
          <div className="world-tab" onClick={() => jumpToWorld(3)}>W4<br /><span style={{fontSize:'11px',fontWeight:600,opacity:0.7}}>Mixed</span></div>
          <div className="world-tab" onClick={() => jumpToWorld(4)}>W5<br /><span style={{fontSize:'11px',fontWeight:600,opacity:0.7}}>Exp</span></div>
        </div>

        <div id="level-title"  style={{display:'none'}}></div>
        <div id="level-desc"   style={{display:'none'}}></div>
        <div id="level-hint"   style={{display:'none'}}></div>
        <button id="hint-btn"  style={{display:'none'}} onClick={toggleHint}></button>

        <div id="tangent-section">
          <button id="tangent-btn" onClick={() => toggleTangentMode()}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{verticalAlign:'-1px'}} aria-hidden="true"><path d="M3 21L21 3M3 21l6-2M3 21l2-6"/></svg>
            Draw tangent
          </button>
          <div id="tangent-info"></div>
        </div>

        <div id="bonus-panel">
          <div className="bonus-header">
            <span className="bonus-label">Bonus Question</span>
            <span className="bonus-pts">+1 point</span>
          </div>
          <p id="bonus-q"></p>
          <div id="bonus-choices"></div>
          <div id="bonus-result"></div>
        </div>

        <div id="score-panel">
          <div id="score-eyebrow">POINTS</div>
          <div id="score-display">
            <span id="score-current">0</span><span id="score-denom"> / <span id="score-total">42</span></span>
          </div>
          <div id="target-coords"></div>
          <div id="stars-row"></div>
        </div>

        <button id="next-btn" onClick={() => nextLevel()}>Next Level →</button>
        <button id="mobile-replay-btn" onClick={() => replayLevel()}>Play again</button>
      </div>

      {/* RIGHT PANEL */}
      <div id="right-panel">
        <canvas id="game"></canvas>

        <div id="level-banner">
          <div id="banner-world">WORLD 1-1</div>
          <div id="banner-title">FIRST LAUNCH</div>
        </div>

        <div id="launch-prompt">Tweak your equation and the shark goes again</div>

        <div id="win-flash">
          <div className="win-text">YOU NAILED IT</div>
          <div className="win-sub" id="win-sub">All hoops cleared</div>
          <div id="canvas-btn-row">
            <button id="canvas-replay-btn" onClick={() => replayLevel()}>Play again</button>
            <button id="canvas-next-btn" onClick={() => nextLevel()}>Next Level →</button>
          </div>
        </div>

        <div id="err-flash"></div>

        <div id="world-error">
          <div id="world-error-icon">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          </div>
          <div id="world-error-title"></div>
          <div id="world-error-type"></div>
          <div id="world-error-sub">Fix your equation on the left to keep going</div>
        </div>
      </div>
    </div>
  )
}
