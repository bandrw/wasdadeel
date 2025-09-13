#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read root package.json to get the version
const rootPackagePath = path.join(__dirname, 'package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const targetVersion = rootPackage.version;

console.log(`Syncing all package versions to: \`${targetVersion}\``);

// Get all package directories
const packagesDir = path.join(__dirname, 'packages');
const packageDirs = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Update each package.json
packageDirs.forEach(packageName => {
  const packageJsonPath = path.join(packagesDir, packageName, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`⚠️  Package \`${packageName}\` has no package.json, skipping...`);
    return;
  }

  // Read the current package.json content as string to preserve formatting
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  
  // Parse to get current version
  const packageJson = JSON.parse(packageJsonContent);
  const currentVersion = packageJson.version;
  
  if (currentVersion === targetVersion) {
    console.log(`✅ ${packageName}: already at version ${targetVersion}`);
    return;
  }

  // Replace version in the string content using regex to preserve formatting
  // This will match "version": "1.2.3" and replace just the version number
  const versionRegex = /("version"\s*:\s*")[^"]+(")/;
  const updatedContent = packageJsonContent.replace(versionRegex, `$1${targetVersion}$2`);
  
  // Write back the updated content
  fs.writeFileSync(packageJsonPath, updatedContent, 'utf8');
  
  console.log(`🔄 ${packageName}: \`${currentVersion}\` → \`${targetVersion}\``);
});

console.log('✅ Version sync complete!');
