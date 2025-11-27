
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// The script will be in frontend/, so __dirname is correct.
const nodeModulesPath = path.join(__dirname, 'node_modules'); 
const packageJsonPath = path.join(__dirname, 'package.json');

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json not found. Make sure you run this script from your project root (e.g., /frontend).');
    process.exit(1);
}

const packageJson = require(packageJsonPath);
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
const packageNames = Object.keys(dependencies);

console.log('Starting automatic patching process for Android namespaces...');

for (const packageName of packageNames) {
  const packagePath = path.join(nodeModulesPath, packageName);
  
  // Define potential paths for android files
  const androidManifestPath = path.join(packagePath, 'android/src/main/AndroidManifest.xml');
  const buildGradlePath = path.join(packagePath, 'android/build.gradle');

  // Check if both manifest and gradle file exist
  if (fs.existsSync(androidManifestPath) && fs.existsSync(buildGradlePath)) {
    console.log(`\n--- Checking [${packageName}] ---`);
    try {
      // 1. Read AndroidManifest.xml to find the package name (namespace)
      const manifestContent = fs.readFileSync(androidManifestPath, 'utf8');
      const packageMatch = manifestContent.match(/package="([^"]+)"/);

      if (!packageMatch || !packageMatch[1]) {
        console.log(`  > Could not find package name in AndroidManifest.xml. Skipping.`);
        continue;
      }
      const namespace = packageMatch[1];
      console.log(`  > Found namespace: ${namespace}`);
      
      // 2. Read build.gradle to check if namespace is already set
      let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

      if (buildGradleContent.includes('namespace')) {
        console.log(`  > 'namespace' already exists in build.gradle. Skipping.`);
        continue;
      }

      // 3. Add namespace to the android {} block
      const androidBlockRegex = /(\bandroid\s*\{)/;
      if (!androidBlockRegex.test(buildGradleContent)) {
          console.log(`  > Could not find 'android' block in build.gradle. Skipping.`);
          continue;
      }
      
      buildGradleContent = buildGradleContent.replace(
        androidBlockRegex,
        `$1\n    namespace '${namespace}'`
      );

      fs.writeFileSync(buildGradlePath, buildGradleContent);
      console.log(`  > Successfully modified ${packageName}'s build.gradle.`);

      // 4. Run patch-package to create the patch file
      console.log(`  > Creating patch with 'npx patch-package ${packageName}'...`);
      execSync(`npx patch-package ${packageName}`, { cwd: __dirname, stdio: 'inherit' });
      console.log(`  > Patch created successfully for [${packageName}].`);

    } catch (error) {
      console.error(`  > FAILED to patch [${packageName}]: ${error.message}`);
    }
  }
}

console.log('\n--- Patching process finished! ---');
console.log("Please review the generated files in the 'patches' directory and commit them to your repository.");
