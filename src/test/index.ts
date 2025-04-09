import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 10000 // Add longer timeout for VSCode operations
  });

  const testsRoot = path.resolve(__dirname, '.');

  return new Promise<void>((resolve, reject) => {
    // Change the pattern to look for both .js and .ts files
    glob('**/*.test.{js,ts}', { cwd: testsRoot })
      .then((files: string[]) => {
        if (files.length === 0) {
          console.warn('No test files found!');
        }
        
        // Log found test files for debugging
        console.log('Found test files:', files);
        
        // Add files to the test suite
        files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

        try {
          // Run the mocha test
          mocha.run((failures: number) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              resolve();
            }
          });
        } catch (err) {
          console.error('Error running tests:', err);
          reject(err);
        }
      })
      .catch((err: Error) => {
        console.error('Error finding test files:', err);
        reject(err);
      });
  });
}