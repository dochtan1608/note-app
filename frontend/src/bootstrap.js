/**
 * This script runs before the application starts and checks if the required
 * dependencies are properly installed. If not, it will show a helpful message.
 */

function checkDependencies() {
  const missingDependencies = [];

  try {
    require("framer-motion");
  } catch (e) {
    missingDependencies.push("framer-motion");
  }

  try {
    require("date-fns");
  } catch (e) {
    missingDependencies.push("date-fns");
  }

  if (missingDependencies.length > 0) {
    console.error(`
      ----------------------------------------
      MISSING DEPENDENCIES: ${missingDependencies.join(", ")}
      
      Please install the missing dependencies by running:
      npm run fix-deps
      
      Or manually using:
      npm install ${missingDependencies.join(" ")}
      ----------------------------------------
    `);
  } else {
    console.log(
      "All dependencies are properly installed. Starting application..."
    );
  }
}

module.exports = { checkDependencies };
