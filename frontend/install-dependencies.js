const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const packagesToInstall = ["framer-motion@10.16.4", "date-fns@2.30.0"];

function isPackageInstalled(packageName) {
  try {
    const packageJsonPath = path.join(__dirname, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const dependencies = packageJson.dependencies || {};
    const packageNameWithoutVersion = packageName.split("@")[0];
    return !!dependencies[packageNameWithoutVersion];
  } catch (error) {
    console.error("Error checking if package is installed:", error);
    return false;
  }
}

function installDependencies() {
  console.log("Checking dependencies...");

  const packagesToActuallyInstall = packagesToInstall.filter((pkg) => {
    const packageName = pkg.split("@")[0];
    const isInstalled = isPackageInstalled(packageName);
    if (isInstalled) {
      console.log(`${packageName} is already installed.`);
      return false;
    }
    return true;
  });

  if (packagesToActuallyInstall.length === 0) {
    console.log("All required packages are already installed.");
    return;
  }

  console.log(
    `Installing dependencies: ${packagesToActuallyInstall.join(", ")}`
  );

  try {
    execSync(`npm install ${packagesToActuallyInstall.join(" ")}`, {
      stdio: "inherit",
      cwd: __dirname,
    });
    console.log("Dependency installation completed successfully.");
  } catch (error) {
    console.error("Failed to install dependencies:", error.message);
    process.exit(1);
  }
}

installDependencies();
