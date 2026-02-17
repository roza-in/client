/**
 * Enum Consistency Checker
 * Compares client TypeScript enum values against server PostgreSQL enum definitions.
 * Usage: npx tsx scripts/check-enum-consistency.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Paths ────────────────────────────────────────────────────────────────────

const CLIENT_ENUMS_PATH = path.resolve(__dirname, '../types/enums.ts');
const SERVER_ENUMS_PATH = path.resolve(
    __dirname,
    '../../server/src/database/migrations/001_extensions_enums.sql',
);

// ── Parsing helpers ──────────────────────────────────────────────────────────

/** Extract client union-type values from:  export type Foo = 'a' | 'b' | 'c'; */
function parseClientEnums(source: string): Map<string, string[]> {
    const map = new Map<string, string[]>();
    // Match multi-line union types: export type TypeName = 'val1' | 'val2' ...;
    const typeRegex = /export\s+type\s+(\w+)\s*=\s*([\s\S]*?);/g;
    let m: RegExpExecArray | null;
    while ((m = typeRegex.exec(source)) !== null) {
        const name = m[1];
        const body = m[2];
        const values: string[] = [];
        const valRegex = /'([^']+)'/g;
        let v: RegExpExecArray | null;
        while ((v = valRegex.exec(body)) !== null) {
            values.push(v[1]);
        }
        if (values.length > 0) {
            map.set(name, values);
        }
    }
    return map;
}

/** Extract server enum values from: CREATE TYPE type_name AS ENUM ('a','b','c'); */
function parseServerEnums(sql: string): Map<string, string[]> {
    const map = new Map<string, string[]>();
    const enumRegex = /CREATE\s+TYPE\s+(\w+)\s+AS\s+ENUM\s*\(([\s\S]*?)\)/gi;
    let m: RegExpExecArray | null;
    while ((m = enumRegex.exec(sql)) !== null) {
        const name = m[1];
        const body = m[2];
        const values: string[] = [];
        const valRegex = /'([^']+)'/g;
        let v: RegExpExecArray | null;
        while ((v = valRegex.exec(body)) !== null) {
            values.push(v[1]);
        }
        if (values.length > 0) {
            map.set(name, values);
        }
    }
    return map;
}

/** Convert PascalCase to snake_case */
function toSnake(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
    const clientSource = fs.readFileSync(CLIENT_ENUMS_PATH, 'utf-8');
    const serverSource = fs.readFileSync(SERVER_ENUMS_PATH, 'utf-8');

    const clientEnums = parseClientEnums(clientSource);
    const serverEnums = parseServerEnums(serverSource);

    // Build snake-case lookup for server enums
    const serverLookup = new Map<string, { dbName: string; values: string[] }>();
    for (const [name, values] of serverEnums) {
        serverLookup.set(name, { dbName: name, values });
    }

    // Known aliases (client name → server name when they differ)
    const aliases: Record<string, string> = {
        RelationshipType: 'family_relationship',
        RefundReason: 'refund_reason',
        RefundType: 'refund_reason', // alias
    };

    let totalChecked = 0;
    let totalMismatches = 0;
    const mismatches: string[] = [];
    const clientOnly: string[] = [];

    for (const [clientName, clientValues] of clientEnums) {
        const snakeName = aliases[clientName] || toSnake(clientName);
        const serverEntry = serverLookup.get(snakeName);

        if (!serverEntry) {
            clientOnly.push(clientName);
            continue;
        }

        totalChecked++;
        const serverValues = serverEntry.values;
        const clientSet = new Set(clientValues);
        const serverSet = new Set(serverValues);

        const onlyInClient = clientValues.filter(v => !serverSet.has(v));
        const onlyInServer = serverValues.filter(v => !clientSet.has(v));

        if (onlyInClient.length > 0 || onlyInServer.length > 0) {
            totalMismatches++;
            const lines: string[] = [`  ❌ ${clientName} ↔ ${snakeName}`];
            if (onlyInClient.length) lines.push(`     Client-only: ${onlyInClient.join(', ')}`);
            if (onlyInServer.length) lines.push(`     Server-only: ${onlyInServer.join(', ')}`);
            mismatches.push(lines.join('\n'));
        }
    }

    // ── Report ───────────────────────────────────────────────────────────────
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║       Enum Consistency Check Report          ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    console.log(`Enums compared:   ${totalChecked}`);
    console.log(`Mismatches found: ${totalMismatches}`);
    console.log(`Client-only types (no DB enum): ${clientOnly.length}`);

    if (clientOnly.length > 0) {
        console.log(`\n📋 Client-only types (acceptable — defined in app code only):`);
        clientOnly.forEach(n => console.log(`   • ${n}`));
    }

    if (mismatches.length > 0) {
        console.log(`\n🔴 Mismatched enums:\n`);
        mismatches.forEach(m => console.log(m));
        console.log('');
        process.exit(1);
    } else {
        console.log('\n✅ All shared enums are consistent between client and server.\n');
    }
}

main();
