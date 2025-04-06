/**
 * This script removes the old .js files that have been converted to .jsx
 * Run with: node cleanup.js
 */

const fs = require("fs");
const path = require("path");

// Directories to check
const directories = [
  path.join(__dirname, "src", "components"),
  path.join(__dirname, "src", "pages"),
];

// List of files to keep (even if .jsx exists)
const filesToKeep = ["index.js", "setupTests.js", "reportWebVitals.js"];

// Count statistics
let removed = 0;
let kept = 0;
let errors = 0;

// Process each directory
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Directory doesn't exist: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  // Find all .js files that have a .jsx equivalent
  const jsFiles = files.filter((file) => file.endsWith(".js"));

  jsFiles.forEach((jsFile) => {
    const baseName = jsFile.slice(0, -3); // Remove .js
    const jsxFile = `${baseName}.jsx`;

    // If there's a .jsx version and it's not in the keep list
    if (files.includes(jsxFile) && !filesToKeep.includes(jsFile)) {
      const jsPath = path.join(dir, jsFile);

      try {
        console.log(`Removing ${jsPath}`);
        fs.unlinkSync(jsPath);
        removed++;
      } catch (error) {
        console.error(`Failed to delete ${jsPath}: ${error.message}`);
        errors++;
      }
    } else {
      kept++;
    }
  });
});

console.log("\nCleanup completed:");
console.log(`- Removed: ${removed} files`);
console.log(`- Kept: ${kept} files`);
console.log(`- Errors: ${errors}`);
console.log(
  "\nNote: Only .js files with corresponding .jsx files were removed."
);
