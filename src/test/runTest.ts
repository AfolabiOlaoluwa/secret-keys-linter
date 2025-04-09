import * as path from 'path';
import { runTests, downloadAndUnzipVSCode } from '@vscode/test-electron';

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './index');

    // Download VS Code with increased timeout
    console.log('Downloading VS Code...');
    const vscodeExecutablePath = await downloadAndUnzipVSCode({
      version: 'stable',
      timeout: 60000
    });
    console.log('VS Code downloaded successfully');

    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ['--disable-extensions']
    });
  } catch (err) {
    console.error('Failed to run tests', err);
    process.exit(1);
  }
}

main();