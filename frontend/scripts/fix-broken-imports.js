/**
 * Script to fix broken relative imports (from bad @/ replacement)
 * Fixes paths with too many ../ levels
 * Run with: node scripts/fix-broken-imports.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, "..", "src");

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

function getRelativePath(fromFile, toPath) {
  const fromDir = path.dirname(fromFile);
  const targetPath = path.join(srcDir, toPath);
  let relative = path.relative(fromDir, targetPath);
  // Convert to forward slashes
  relative = relative.replace(/\\/g, "/");
  // Add ./ prefix if needed
  if (!relative.startsWith(".")) {
    relative = "./" + relative;
  }
  return relative;
}

function extractSrcPath(brokenPath) {
  // Match patterns like ../../../../../../components/ui/button
  // Extract just the src-relative part (components/ui/button, lib/utils, store/Build.store etc.)
  const match = brokenPath.match(/(?:\.\.\/)+(.+)$/);
  if (match) {
    const extracted = match[1];
    // Check if extracted path is valid (starts with known src folders)
    if (
      extracted.startsWith("components/") ||
      extracted.startsWith("lib/") ||
      extracted.startsWith("store/") ||
      extracted.startsWith("hooks/") ||
      extracted.startsWith("pages/") ||
      extracted.startsWith("layouts/") ||
      extracted.startsWith("assets/")
    ) {
      return extracted;
    }
  }
  return null;
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;

  // Match import statements with potentially broken relative paths (3+ levels of ../)
  const importRegex = /(from\s+["'])((?:\.\.\/){3,}[^"']+)(["'])/g;

  content = content.replace(
    importRegex,
    (match, prefix, importPath, suffix) => {
      const srcRelativePath = extractSrcPath(importPath);
      if (srcRelativePath) {
        const relativePath = getRelativePath(filePath, srcRelativePath);
        console.log(`  ${importPath} -> ${relativePath}`);
        return `${prefix}${relativePath}${suffix}`;
      }
      return match;
    }
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Fixed: ${path.relative(srcDir, filePath)}`);
    return true;
  }
  return false;
}

const files = getAllFiles(srcDir);
let fixedCount = 0;

for (const file of files) {
  if (fixImports(file)) {
    fixedCount++;
  }
}

console.log(`\nDone! Fixed ${fixedCount} files.`);
