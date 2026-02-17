/**
 * Bundle Size Checker
 * Verifies that heavy SDKs (video, payment) are NOT in common/shared chunks.
 * Usage: npx tsx scripts/check-bundle-size.ts
 *
 * Pre-requisite: Run `npm run build` first to generate .next/
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Config ───────────────────────────────────────────────────────────────────

const NEXT_DIR = path.resolve(__dirname, '../.next');

/** Patterns that should NOT appear in shared/common chunks */
const HEAVY_MODULES = [
    { name: 'agora-rtc-sdk-ng', pattern: /agora[_-]?rtc/i },
    { name: 'zego-express-engine-webrtc', pattern: /zego[_-]?express/i },
    { name: 'razorpay checkout', pattern: /razorpay/i },
    { name: 'recharts', pattern: /recharts/i },
];

/** Max allowed total client JS bundle size (KB) — adjust as needed */
const MAX_TOTAL_JS_KB = 1500;

/** Max allowed single chunk size (KB) — first-load chunks above this are flagged */
const MAX_CHUNK_KB = 300;

// ── Helpers ──────────────────────────────────────────────────────────────────

function walk(dir: string, ext: string): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walk(full, ext));
        } else if (entry.name.endsWith(ext)) {
            results.push(full);
        }
    }
    return results;
}

function fileSizeKB(filePath: string): number {
    return fs.statSync(filePath).size / 1024;
}

function isCommonChunk(relPath: string): boolean {
    // Common chunks are typically in _next/static/chunks/ with framework/commons names
    const normalized = relPath.replace(/\\/g, '/');
    return (
        normalized.includes('chunks/framework') ||
        normalized.includes('chunks/main') ||
        normalized.includes('chunks/webpack') ||
        normalized.includes('chunks/commons') ||
        normalized.includes('chunks/polyfills') ||
        // Pages router: _app chunk
        normalized.includes('chunks/pages/_app')
    );
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║         Bundle Size Check Report             ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    const staticDir = path.join(NEXT_DIR, 'static');
    if (!fs.existsSync(staticDir)) {
        console.log('⚠️  .next/static not found. Run `npm run build` first.\n');
        process.exit(0);
    }

    const jsFiles = walk(staticDir, '.js');
    console.log(`Found ${jsFiles.length} JS files in .next/static/\n`);

    // 1. Check total bundle size
    let totalKB = 0;
    const largeChunks: { file: string; size: number }[] = [];

    for (const file of jsFiles) {
        const size = fileSizeKB(file);
        totalKB += size;
        if (size > MAX_CHUNK_KB) {
            largeChunks.push({ file: path.relative(NEXT_DIR, file), size });
        }
    }

    console.log(`Total JS bundle:   ${totalKB.toFixed(0)} KB  (limit: ${MAX_TOTAL_JS_KB} KB)`);
    if (totalKB > MAX_TOTAL_JS_KB) {
        console.log('🔴 Total bundle exceeds size limit!');
    } else {
        console.log('✅ Total bundle within size limit.');
    }

    if (largeChunks.length > 0) {
        console.log(`\n⚠️  ${largeChunks.length} chunk(s) exceed ${MAX_CHUNK_KB} KB:`);
        largeChunks
            .sort((a, b) => b.size - a.size)
            .forEach(c => console.log(`   ${c.size.toFixed(0)} KB  ${c.file}`));
    }

    // 2. Check heavy modules in common chunks
    console.log('\n── Heavy Module Isolation Check ──\n');
    let leaks = 0;

    const commonChunks = jsFiles.filter(f => isCommonChunk(path.relative(NEXT_DIR, f)));
    console.log(`Common/framework chunks: ${commonChunks.length}`);

    for (const chunkFile of commonChunks) {
        const content = fs.readFileSync(chunkFile, 'utf-8');
        const relPath = path.relative(NEXT_DIR, chunkFile);

        for (const mod of HEAVY_MODULES) {
            if (mod.pattern.test(content)) {
                leaks++;
                console.log(`🔴 ${mod.name} found in common chunk: ${relPath}`);
            }
        }
    }

    if (leaks === 0) {
        console.log('✅ No heavy SDKs leaked into common/framework chunks.');
    }

    // 3. Summary
    console.log('\n── Summary ──\n');
    const passed = totalKB <= MAX_TOTAL_JS_KB && leaks === 0;
    if (passed) {
        console.log('✅ Bundle size check passed.\n');
    } else {
        console.log('❌ Bundle size check failed. Review items above.\n');
        process.exit(1);
    }
}

main();
