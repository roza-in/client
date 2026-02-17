/**
 * Dead Endpoint Detection
 * Scans client code for API endpoint strings and checks them against
 * both the endpoint registry and the server route definitions.
 * Usage: npx tsx scripts/check-dead-endpoints.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Collect all API call paths from client source ────────────────────────────

const CLIENT_ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['features', 'lib/api', 'hooks', 'components', 'store'];

/** Recursively list .ts/.tsx files */
function walk(dir: string): string[] {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walk(full));
        } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
            files.push(full);
        }
    }
    return files;
}

/** Extract API paths from source — matches api.get('/foo/bar', ...) or string '/foo/bar' in an api call context */
function extractApiPaths(source: string): string[] {
    const paths: string[] = [];

    // Pattern 1: api.method('/path...')  or request('/path...')
    const callPattern = /(?:api\.\w+|request|apiClient\.\w+)\s*(?:<[^>]*>)?\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let m: RegExpExecArray | null;
    while ((m = callPattern.exec(source)) !== null) {
        paths.push(m[1]);
    }

    // Pattern 2: endpoints.xxx or endpoint constants — captured via the endpoints file itself
    // We'll resolve from the endpoint registry separately

    return paths;
}

// ── Read the endpoint registry ───────────────────────────────────────────────

function extractEndpointRegistryPaths(source: string): string[] {
    const paths: string[] = [];
    // Match string literals that look like API paths
    const strPattern = /'(\/[a-z][a-zA-Z0-9/_-]*(?:\$\{[^}]+\})?[a-zA-Z0-9/_-]*)'/g;
    let m: RegExpExecArray | null;
    while ((m = strPattern.exec(source)) !== null) {
        // Normalize dynamic segments: /foo/${id}/bar → /foo/:id/bar
        const normalized = m[1].replace(/\$\{[^}]+\}/g, ':id');
        paths.push(normalized);
    }
    // Also match template literals
    const templatePattern = /`(\/[a-z][a-zA-Z0-9/_-]*(?:\$\{[^}]+\})?[a-zA-Z0-9/_-]*)`/g;
    while ((m = templatePattern.exec(source)) !== null) {
        const normalized = m[1].replace(/\$\{[^}]+\}/g, ':id');
        paths.push(normalized);
    }
    return paths;
}

// ── Build server route prefixes ──────────────────────────────────────────────

function extractServerRoutes(routesSource: string): string[] {
    const prefixes: string[] = [];
    const routePattern = /router\.use\(\s*['"]([^'"]+)['"]/g;
    let m: RegExpExecArray | null;
    while ((m = routePattern.exec(routesSource)) !== null) {
        prefixes.push(m[1]);
    }
    return prefixes;
}

/** Normalize a path to its route prefix (first 1-2 segments) */
function getRoutePrefix(apiPath: string): string {
    // Remove leading slash, split
    const segments = apiPath.replace(/^\//, '').split('/');
    // First segment is the module (auth, doctors, etc.)
    return '/' + segments[0];
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║       Dead Endpoint Detection Report         ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    // 1. Collect all files
    const allFiles: string[] = [];
    for (const dir of SCAN_DIRS) {
        allFiles.push(...walk(path.join(CLIENT_ROOT, dir)));
    }
    console.log(`Scanned ${allFiles.length} source files.\n`);

    // 2. Extract all API call paths from client code
    const apiCallPaths = new Set<string>();
    for (const file of allFiles) {
        const source = fs.readFileSync(file, 'utf-8');
        for (const p of extractApiPaths(source)) {
            // Normalize dynamic segments
            const normalized = p.replace(/\$\{[^}]+\}/g, ':id');
            apiCallPaths.add(normalized);
        }
    }

    // 3. Extract endpoint registry paths
    const endpointsFile = path.join(CLIENT_ROOT, 'lib/api/endpoints.ts');
    const configApiFile = path.join(CLIENT_ROOT, 'config/api.ts');
    const registryPaths = new Set<string>();
    for (const file of [endpointsFile, configApiFile]) {
        if (fs.existsSync(file)) {
            const source = fs.readFileSync(file, 'utf-8');
            for (const p of extractEndpointRegistryPaths(source)) {
                registryPaths.add(p);
            }
        }
    }

    // Combine all known client paths
    const allClientPaths = new Set([...apiCallPaths, ...registryPaths]);

    // 4. Read server route prefixes
    const serverRoutesFile = path.resolve(__dirname, '../../server/src/routes/index.ts');
    let serverPrefixes: string[] = [];
    if (fs.existsSync(serverRoutesFile)) {
        const routesSource = fs.readFileSync(serverRoutesFile, 'utf-8');
        serverPrefixes = extractServerRoutes(routesSource);
    } else {
        console.log('⚠️  Server routes file not found — skipping server route validation.\n');
    }

    // 5. Check each client path's prefix against server routes
    const serverPrefixSet = new Set(serverPrefixes);
    const orphanedPaths: string[] = [];
    const validPaths: string[] = [];

    for (const clientPath of allClientPaths) {
        const prefix = getRoutePrefix(clientPath);
        if (serverPrefixSet.has(prefix)) {
            validPaths.push(clientPath);
        } else {
            orphanedPaths.push(clientPath);
        }
    }

    // ── Report ───────────────────────────────────────────────────────────────
    console.log(`Total unique API paths found:  ${allClientPaths.size}`);
    console.log(`Server route modules:          ${serverPrefixes.length}`);
    console.log(`Matched (prefix exists):       ${validPaths.length}`);
    console.log(`Orphaned (no server module):   ${orphanedPaths.length}`);

    if (serverPrefixes.length > 0) {
        console.log(`\n📦 Server route modules:`);
        serverPrefixes.forEach(p => console.log(`   ${p}`));
    }

    if (orphanedPaths.length > 0) {
        console.log(`\n🔴 Orphaned client API paths (no matching server module):\n`);
        orphanedPaths.sort().forEach(p => console.log(`   ${p}`));
        console.log('\n   These may be dead endpoints or use a different routing convention.');
        console.log('   Review manually to confirm.\n');
    } else {
        console.log('\n✅ All client API paths map to a known server route module.\n');
    }
}

main();
