import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  
  if (workspaceFolders) {
    workspaceFolders.forEach(folder => {
      const gitDir = path.join(folder.uri.fsPath, '.git');
      
      if (fs.existsSync(gitDir)) {
        try {
          const hookSource = path.join(context.extensionPath, 'scripts', 'pre-commit');
          const hookDest = path.join(gitDir, 'hooks', 'pre-commit');
          
          fs.copyFileSync(hookSource, hookDest);
          fs.chmodSync(hookDest, '755'); 
          
          console.log('Installed pre-commit hook in:', folder.name);
        } catch (err) {
          console.error('Failed to install git hook:', err);
        }
      }
    });
  }
}
export function deactivate() {}