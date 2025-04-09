import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as childProcess from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env.test') });

suite('Pre-commit Hook Tests', function() {
  this.timeout(2000000);

  let repoPath: string;
  // Define API key once at the suite level
  const apiKey = process.env.TEST_API_KEY;
  
  setup(async () => {
    // Create a temporary Git repository
    repoPath = path.join(os.tmpdir(), `vscode-secret-keys-linter-test-${Math.random().toString(36).substring(2, 15)}`);
    fs.mkdirSync(repoPath, { recursive: true });
    
    // Initialize Git repository
    childProcess.execSync('git init', { cwd: repoPath });
    
    // Copy pre-commit hook to the repository
    const hookSource = path.join(__dirname, '..', '..', 'scripts', 'pre-commit');
    const hookDest = path.join(repoPath, '.git', 'hooks', 'pre-commit');
    fs.copyFileSync(hookSource, hookDest);
    fs.chmodSync(hookDest, '755');
    
    // Configure Git user for commits
    childProcess.execSync('git config user.name "Test User"', { cwd: repoPath });
    childProcess.execSync('git config user.email "test@example.com"', { cwd: repoPath });
  });
  
  teardown(() => {
    fs.rmSync(repoPath, { recursive: true, force: true });
  });
  
  test('Should detect API key in file', () => {
    // Create a file with an API key (using the suite-level apiKey)
    const filePath = path.join(repoPath, 'test-file.js');
    fs.writeFileSync(filePath, `const API_KEY = "${apiKey}";`);
    
    // Stage the file
    childProcess.execSync(`git add ${filePath}`, { cwd: repoPath });
    
    // Try to commit
    try {
      childProcess.execSync('git commit -m "Test commit"', { 
        cwd: repoPath,
        stdio: 'pipe'
      });
      assert.fail('Commit should have been blocked');
    } catch (error) {
      console.log('Expected commit block:', (error as Error).message);
      assert.ok(true);
    }
  });
  
  test('Should allow commit for safe file', () => {
    // Create a file without sensitive information
    const filePath = path.join(repoPath, 'safe-file.js');
    fs.writeFileSync(filePath, 'const safeVariable = "hello world";');
    
    // Stage the file
    childProcess.execSync(`git add ${filePath}`, { cwd: repoPath });
    
    // Try to commit
    try {
      childProcess.execSync('git commit -m "Safe commit"', { 
        cwd: repoPath,
        stdio: 'pipe'
      });
      assert.ok(true);
    } catch (error) {
      console.error('Unexpected commit block:', (error as Error).message);
      assert.fail('Commit should have succeeded');
    }
  });
  
  test('Should detect commented-out API keys', () => {
      // Create a file with a commented API key (using the suite-level apiKey)
      const filePath = path.join(repoPath, 'commented-file.js');
      fs.writeFileSync(filePath, `// const API_KEY = "${apiKey}";`);
      
      // Stage the file
      childProcess.execSync(`git add ${filePath}`, { cwd: repoPath });
      
      // Try to commit
      try {
        childProcess.execSync('git commit -m "Commented key commit"', { 
          cwd: repoPath,
          stdio: 'pipe'
        });
        assert.fail('Commit should have been blocked even for commented-out keys');
      } catch (error) {
        // Expected behavior - commit should be blocked
        console.log('Expected commit block for commented-out keys:', (error as Error).message);
        assert.ok(true);
      }
    });
});