#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Helpers
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const readText = (p) => fs.readFileSync(p, 'utf8');
const writeText = (p, s) => fs.writeFileSync(p, s, 'utf8');

// Paths
const repoRoot = path.join(__dirname, '..');
const rootPkgPath = path.join(repoRoot, 'package.json');
const packagesDir = path.join(repoRoot, 'packages');

// Read root version
const rootPackage = readJson(rootPkgPath);
const targetVersion = rootPackage.version;

console.log(`Syncing all package versions to: \`${targetVersion}\``);

// Discover package dirs
const packageDirs = fs.readdirSync(packagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

// Collect internal package names (scoped names) -> Set
const internalNames = new Set();
for (const dir of packageDirs) {
    const p = path.join(packagesDir, dir, 'package.json');
    if (!fs.existsSync(p)) continue;
    try {
        const pkg = readJson(p);
        if (pkg.name) internalNames.add(pkg.name);
    } catch { /* ignore */ }
}

const depFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

// Util: replace one dep version string in the raw JSON text, preserving formatting
function replaceDepVersionInText(raw, depName, newVersion) {
    // Match:  "depName": "value"
    // Capture current value to decide on prefix (^/~) and protocols.
    const pattern = new RegExp(`("${depName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}"\\s*:\\s*")([^"]+)(")`, 'g');

    return raw.replace(pattern, (_m, p1, value, p3) => {
        // Skip workspace protocol
        if (value.startsWith('workspace:')) return _m;

        // Preserve ^ or ~ if present
        const m = value.match(/^(\^|~)?(\d+\.\d+\.\d+.*)$/);
        if (!m) {
            // If it's not a plain semver (e.g., "*", "file:", "link:", "github:") — skip
            return _m;
        }
        const prefix = m[1] ?? '';
        const next = `${prefix}${newVersion}`;
        return `${p1}${next}${p3}`;
    });
}

for (const packageName of packageDirs) {
    const packageJsonPath = path.join(packagesDir, packageName, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
        console.log(`⚠️  Package \`${packageName}\` has no package.json, skipping...`);
        continue;
    }

    const raw = readText(packageJsonPath);
    let updatedContent = raw;

    // Parse for decisions
    let pkg;
    try {
        pkg = JSON.parse(raw);
    } catch (e) {
        console.error(`❌ ${packageName}: invalid JSON, skipping.`, e.message);
        continue;
    }

    const currentVersion = pkg.version;

    // 1) Update "version" in-place via regex (preserves formatting)
    if (currentVersion !== targetVersion) {
        const versionRegex = /("version"\s*:\s*")[^"]+(")/;
        updatedContent = updatedContent.replace(versionRegex, `$1${targetVersion}$2`);
        console.log(`🔄 ${packageName}: \`${currentVersion}\` → \`${targetVersion}\``);
    } else {
        console.log(`✅ ${packageName}: already at version ${targetVersion}`);
    }

    // 2) Update internal dependency versions across known dep fields
    // We use the parsed object only to know which fields/dep names exist;
    // replacement is done on the raw text to preserve formatting.
    for (const field of depFields) {
        const map = pkg[field];
        if (!map) continue;

        for (const depName of Object.keys(map)) {
            if (!internalNames.has(depName)) continue;

            const before = updatedContent;
            updatedContent = replaceDepVersionInText(updatedContent, depName, targetVersion);

            if (before !== updatedContent) {
                // Log only when a replacement actually happened
                const fromVal = map[depName];
                // cosmetic log: preserve seen prefix if semver
                const prefix = (/^(\^|~)/.exec(fromVal)?.[1]) || '';
                console.log(`   ↳ ${packageName} ${field}.${depName}: \`${fromVal}\` → \`${prefix}${targetVersion}\``);
            }
        }
    }

    // Write back if changed
    if (updatedContent !== raw) {
        writeText(packageJsonPath, updatedContent);
    }
}

console.log('✅ Version + internal deps sync complete!');
