const { execSync } = require("child_process");

const order = [
    "@wasdadeel/common",
    "@wasdadeel/emitter",
    "@wasdadeel/state",
    "@wasdadeel/react",
];

const task = process.argv[2];

if (!task) {
    console.error("Usage: node scripts/workspaces-run.js <script name>");
    process.exit(1);
}

for (const pkg of order) {
    console.log(`\n=== ${task} ${pkg} ===`);
    try {
        execSync(`yarn workspace ${pkg} run ${task}`, {
            stdio: "inherit",
        });
    } catch (err) {
        console.error(`❌ Failed on ${pkg}`);
        process.exit(err.status || 1);
    }
}
