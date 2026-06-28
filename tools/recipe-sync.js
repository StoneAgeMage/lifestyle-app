#!/usr/bin/env node
'use strict';

// recipe-sync.js
// Full-replace sync: reads ALL Umami .txt exports + Cronometer .csv exports
// and rebuilds RECIPE_CATALOG and INGREDIENT_CATALOG from scratch.
//
// Running this again after renaming a recipe in Umami will correctly replace
// the old entry rather than adding a duplicate.
//
// Usage:
//   node tools/recipe-sync.js
//
// Drop files here before running:
//   tools/exports/umami/      ← Umami .txt exports (one file per recipe)
//   tools/exports/cronometer/ ← Cronometer CSV exports ("servings" export)
//
// Cronometer: log each recipe as "1.00 full recipe" in your diary, then
// export the diary as CSV. Only rows with "full recipe" in Amount are used.
//
// Umami Notes section: add these two lines at the TOP so the script reads them:
//   Rank: A
//   Source: https://example.com/recipe

const fs   = require('fs');
const path = require('path');

// ─── Paths ────────────────────────────────────────────────────────────────────
const ROOT       = path.join(__dirname, '..');
const UMAMI_DIR  = path.join(__dirname, 'exports', 'umami');
const CRONO_DIR  = path.join(__dirname, 'exports', 'cronometer');
const RECIPES_JS = path.join(ROOT, 'js', 'data-recipes.js');
const INGRED_JS  = path.join(ROOT, 'js', 'data-ingredients.js');

// ─── Encoding fix ─────────────────────────────────────────────────────────────
// Handles UTF-8 bytes that were misread as Latin-1 (e.g. Â¼ → ¼).
function fixEncoding(str) {
  return str
    .replace(/Â¼/g, '¼').replace(/Â½/g, '½').replace(/Â¾/g, '¾')
    .replace(/Â·/g, '·').replace(/Ã©/g, 'é').replace(/Ã¨/g, 'è')
    .replace(/Ã¢/g, 'â').replace(/Ã /g, 'à').replace(/Ã®/g, 'î')
    .replace(/â€™/g, "'").replace(/â€œ/g, '"').replace(/â€\x9D/g, '"');
}

// ─── Slug ─────────────────────────────────────────────────────────────────────
function toSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

// ─── Title case ───────────────────────────────────────────────────────────────
function toTitle(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Category auto-assignment ─────────────────────────────────────────────────
// Condiment is checked BEFORE produce/grains so that compound names like
// "rice vinegar" (not grains) and "avocado oil" (not produce) are correct.
const CATEGORY_RULES = [
  ['protein',   /chicken|beef|pork|turkey|salmon|tuna|fish|shrimp|scallop|egg|tofu|tempeh|lentil|chickpea|bean|edamame|lamb|bison|venison|cod|tilapia|halibut/i],
  ['frozen',    /frozen/i],
  ['condiment', /\bsauce\b|\boil\b|vinegar|\bhoney\b|syrup|mayo|mustard|ketchup|\bsoy\b|tahini|salsa|miso|sriracha|sambal|hoisin|worcestershire|coconut milk|broth|stock|\bpaste\b|jam|spread|dressing|aioli/i],
  ['spice',     /cinnamon|cumin|paprika|turmeric|coriander|chili flake|chili powder|black pepper|white pepper|\bsalt\b|oregano|thyme|bay leaf|curry powder|cayenne|garam masala|za'atar|sumac|cardamom|clove|nutmeg|allspice|anise|sesame seed|red pepper flake/i],
  ['dairy',     /\bmilk\b|cheese|yogurt|butter|\bcream\b|feta|parmesan|mozzarella|ricotta|ghee|cheddar|cottage/i],
  ['grains',    /\boat\b|\boats\b|\brice\b|quinoa|pasta|bread|flour|tortilla|barley|couscous|noodle|pita|wheat|bulgur|farro|polenta|cornmeal/i],
  ['produce',   /bell pepper|onion|garlic|tomato|spinach|kale|broccoli|carrot|celery|asparagus|mushroom|zucchini|cucumber|lettuce|cabbage|apple|blueberr|banana|lemon|lime|herb|cilantro|basil|mint|scallion|ginger|arugula|avocado|mango|peach|pear|\bcorn\b|squash|beet|radish|fennel|leek|chard|sweet potato|potato|grape|strawberr|raspberry|blackberr|cherry|pineapple|papaya/i],
];

function assignCategory(name) {
  for (const [cat, re] of CATEGORY_RULES) {
    if (re.test(name)) return cat;
  }
  return 'pantry';
}

// ─── Ingredient line parser ───────────────────────────────────────────────────
const UNIT_WORDS = new Set([
  'cup', 'cups', 'tbsp', 'tsp', 'tablespoon', 'tablespoons',
  'teaspoon', 'teaspoons', 'oz', 'lb', 'lbs', 'pound', 'pounds',
  'g', 'kg', 'ml', 'l', 'c', 't', 'bunch', 'bunches', 'can', 'cans',
  'clove', 'cloves', 'stalk', 'stalks', 'sprig', 'sprigs',
  'piece', 'pieces', 'slice', 'slices', 'medium', 'large', 'small',
  'pinch', 'dash', 'handful', 'head', 'block', 'fillet', 'fillets',
  'inch', 'inches', 'package', 'packages', 'pkg',
]);

function isNumericToken(t) {
  return /^[\d\/½¼¾⅓⅔⅛⅜⅝⅞.,]+$/.test(t);
}

function parseIngredientLine(line) {
  const tokens = line.split(/\s+/);
  let i = 0;

  // Eat leading numeric tokens
  while (i < tokens.length && isNumericToken(tokens[i])) i++;

  // Handle range: "1 to 2 tablespoons"
  if (i < tokens.length && tokens[i].toLowerCase() === 'to'
      && i + 1 < tokens.length && isNumericToken(tokens[i + 1])) {
    i += 2;
  }

  // Eat optional unit word
  if (i < tokens.length && UNIT_WORDS.has(tokens[i].toLowerCase())) i++;

  // Eat optional "of"
  if (i < tokens.length && tokens[i].toLowerCase() === 'of') i++;

  if (i === 0) return { qty: '', name: line };

  return {
    qty:  tokens.slice(0, i).join(' '),
    name: tokens.slice(i).join(' ') || line,
  };
}

// ─── Parse Umami .txt export ──────────────────────────────────────────────────
function parseUmami(rawText) {
  const text  = fixEncoding(rawText);
  const lines = text.split(/\r?\n/);
  const recipe = { name: '', servings: 1, rank: null, source: null, ingredients: [] };

  for (const line of lines) {
    if (line.trim()) { recipe.name = line.trim(); break; }
  }

  const servM = text.match(/Servings?:\s*(\d+)/i);
  if (servM) recipe.servings = parseInt(servM[1], 10);

  let section = '';
  for (const line of lines) {
    const t = line.trim();
    if (t === 'Ingredients') { section = 'ingredients'; continue; }
    if (t === 'Directions')  { section = 'directions';  continue; }
    if (t === 'Notes')       { section = 'notes';       continue; }

    if (section === 'ingredients' && t.startsWith('-')) {
      const content = t.slice(1).trim();
      if (!content || content.endsWith(':')) continue; // skip sub-headers
      recipe.ingredients.push(parseIngredientLine(content));
    }

    if (section === 'notes' && t) {
      const rankM = t.match(/^Rank:\s*(.+)/i);
      if (rankM) { recipe.rank = rankM[1].trim(); continue; }
      const srcM = t.match(/^Source:\s*(\S+)/i);
      if (srcM)  { recipe.source = srcM[1].trim(); }
    }
  }

  return recipe;
}

// ─── Parse Cronometer CSV export ──────────────────────────────────────────────
function parseCSVRow(line) {
  const cols = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  cols.push(cur.trim());
  return cols;
}

function parseCronometer(rawText) {
  const text  = fixEncoding(rawText);
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]);
  const col = name => headers.findIndex(h => h.trim() === name);

  const iName    = col('Food Name');
  const iAmount  = col('Amount');
  const iKcal    = col('Energy (kcal)');
  const iSodium  = col('Sodium (mg)');
  const iCarbs   = col('Carbs (g)');
  const iFat     = col('Fat (g)');
  const iProtein = col('Protein (g)');

  if ([iName, iAmount, iKcal, iSodium, iCarbs, iFat, iProtein].includes(-1)) {
    console.error('ERROR: Cronometer CSV missing expected columns.');
    console.error('  Found headers:', headers.slice(0, 10).join(', '), '...');
    return [];
  }

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    if (!cols[iAmount] || !cols[iAmount].toLowerCase().includes('full recipe')) continue;
    results.push({
      name:     (cols[iName] || '').trim(),
      calories: Math.round(parseFloat(cols[iKcal])   || 0),
      proteinG: parseFloat(cols[iProtein]) || 0,
      fatG:     parseFloat(cols[iFat])     || 0,
      carbsG:   parseFloat(cols[iCarbs])   || 0,
      sodiumMg: Math.round(parseFloat(cols[iSodium]) || 0),
    });
  }
  return results;
}

// ─── Fuzzy name match ─────────────────────────────────────────────────────────
function normName(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function findCronoMatch(umamiName, cronoEntries) {
  return cronoEntries.find(c => c.name === umamiName)
    || cronoEntries.find(c => c.name.toLowerCase() === umamiName.toLowerCase())
    || cronoEntries.find(c => normName(c.name) === normName(umamiName))
    || null;
}

// ─── JS string literal ────────────────────────────────────────────────────────
function jsStr(s) {
  if (s === null || s === undefined) return 'null';
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

// ─── Build recipe JS entry ────────────────────────────────────────────────────
function buildRecipeEntry(slug, recipe, macros) {
  const lines = [];
  lines.push(`  '${slug}': {`);
  lines.push(`    id: ${jsStr(slug)},`);
  lines.push(`    name: ${jsStr(recipe.name)},`);
  lines.push(`    servings: ${recipe.servings},`);
  if (recipe.rank)   lines.push(`    rank: ${jsStr(recipe.rank)},`);
  if (recipe.source) lines.push(`    source: ${jsStr(recipe.source)},`);
  lines.push(`    _ingredients: [`);
  for (const ing of recipe.ingredients) {
    lines.push(`      { id: ${jsStr(ing.name)}, qty: ${jsStr(ing.qty)} },`);
  }
  lines.push(`    ],`);
  if (macros) {
    lines.push(`    _totalMacros: { calories: ${macros.calories}, proteinG: ${macros.proteinG}, fatG: ${macros.fatG}, carbsG: ${macros.carbsG}, sodiumMg: ${macros.sodiumMg} },`);
  } else {
    lines.push(`    _totalMacros: { calories: 0, proteinG: 0, fatG: 0, carbsG: 0, sodiumMg: 0 }, // TODO: log in Cronometer as "1.00 full recipe" and re-run sync`);
  }
  lines.push(`  },`);
  return lines.join('\n');
}

// ─── Build ingredient catalog JS entry ───────────────────────────────────────
function buildIngredientEntry(name) {
  const category    = assignCategory(name);
  const displayName = toTitle(name);
  const key         = jsStr(name); // always quoted — may contain spaces/punctuation
  return `  ${key}: { name: ${jsStr(displayName)}, category: '${category}' },`;
}

// ─── Replace RECIPE_CATALOG content ──────────────────────────────────────────
function replaceRecipeCatalog(src, entries) {
  const OPEN  = 'const RECIPE_CATALOG = {';
  const CLOSE = '\n};\n\n// Lock _ingredients and _totalMacros';
  const openPos  = src.indexOf(OPEN);
  const closePos = src.indexOf(CLOSE);
  if (openPos === -1 || closePos === -1) {
    throw new Error('Cannot find RECIPE_CATALOG boundaries in data-recipes.js');
  }
  const before = src.slice(0, openPos + OPEN.length);
  const after  = src.slice(closePos);
  const body   = entries.length > 0 ? '\n\n' + entries.join('\n\n') + '\n' : '\n';
  return before + body + after;
}

// ─── Replace INGREDIENT_CATALOG content ──────────────────────────────────────
function replaceIngredientCatalog(src, entries) {
  const OPEN = 'const INGREDIENT_CATALOG = {';
  const openPos   = src.indexOf(OPEN);
  const lastClose = src.lastIndexOf('\n};');
  if (openPos === -1 || lastClose === -1) {
    throw new Error('Cannot find INGREDIENT_CATALOG boundaries in data-ingredients.js');
  }
  const before = src.slice(0, openPos + OPEN.length);
  const after  = src.slice(lastClose);
  const body   = entries.length > 0 ? '\n' + entries.join('\n') + '\n' : '\n';
  return before + body + after;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('\n=== recipe-sync.js (full replace) ===\n');

  // Parse Cronometer CSVs
  const cronoFiles   = fs.readdirSync(CRONO_DIR).filter(f => /\.csv$/i.test(f));
  const cronoEntries = [];
  for (const f of cronoFiles) {
    cronoEntries.push(...parseCronometer(fs.readFileSync(path.join(CRONO_DIR, f), 'utf8')));
  }
  console.log(`Cronometer entries (full-recipe rows): ${cronoEntries.length}`);
  cronoEntries.forEach(e => console.log(`  • "${e.name}" → ${e.calories} kcal`));

  // Parse Umami .txt files
  const umamiFiles = fs.readdirSync(UMAMI_DIR).filter(f => /\.txt$/i.test(f));
  console.log(`\nUmami files: ${umamiFiles.length}`);

  const recipeEntries  = [];
  const ingredEntries  = [];
  const seenIngredIds  = new Set(); // dedup across recipes in this run
  let warnings = 0;

  for (const f of umamiFiles) {
    const recipe = parseUmami(fs.readFileSync(path.join(UMAMI_DIR, f), 'utf8'));
    const slug   = toSlug(recipe.name);

    console.log(`\n── "${recipe.name}"  [${slug}]`);

    // Match Cronometer macros
    const macros = findCronoMatch(recipe.name, cronoEntries);
    if (macros) {
      console.log(`   macros: ${macros.calories} kcal | ${macros.proteinG}g P | ${macros.fatG}g F | ${macros.carbsG}g C | ${macros.sodiumMg}mg Na`);
    } else {
      console.log(`   WARNING: no Cronometer match — zero macros will be written.`);
      if (cronoEntries.length > 0) {
        console.log(`            Cronometer names: ${cronoEntries.map(c => `"${c.name}"`).join(', ')}`);
      }
      warnings++;
    }

    // Collect unique ingredients
    for (const ing of recipe.ingredients) {
      if (!seenIngredIds.has(ing.name)) {
        seenIngredIds.add(ing.name);
        const cat = assignCategory(ing.name);
        ingredEntries.push(buildIngredientEntry(ing.name));
        console.log(`   + [${cat}] "${ing.name}"  qty: "${ing.qty}"`);
      }
    }

    recipeEntries.push(buildRecipeEntry(slug, recipe, macros));
  }

  if (recipeEntries.length === 0) {
    console.log('\nNo Umami files found — nothing to write.\n');
    return;
  }

  // Write (normalize CRLF → LF before boundary search so indexOf works on Windows)
  const recipesJs = fs.readFileSync(RECIPES_JS, 'utf8').replace(/\r\n/g, '\n');
  const ingredJs  = fs.readFileSync(INGRED_JS,  'utf8').replace(/\r\n/g, '\n');

  fs.writeFileSync(RECIPES_JS, replaceRecipeCatalog(recipesJs, recipeEntries),    'utf8');
  fs.writeFileSync(INGRED_JS,  replaceIngredientCatalog(ingredJs, ingredEntries), 'utf8');

  console.log(`\n✓ Wrote ${recipeEntries.length} recipe(s)    → data-recipes.js`);
  console.log(`✓ Wrote ${ingredEntries.length} ingredient(s) → data-ingredients.js`);
  if (warnings > 0) {
    console.log(`\n⚠  ${warnings} recipe(s) have zero macros.`);
    console.log(`   Fix: log each in Cronometer as "1.00 full recipe", export CSV, re-run sync.`);
  }
  console.log('\n  Remember to bump service-worker.js CACHE_NAME before deploying.\n');
}

main();
