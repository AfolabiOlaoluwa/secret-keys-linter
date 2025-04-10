# Secret Keys Linter

A VS Code extension that helps prevent committing sensitive information like API keys and tokens into version control.

## Features

This extension provides several layers of protection to prevent secrets from being committed to your repository:

### 1. Real-time Secret Detection

The extension automatically scans your files when you save them, looking for potential secrets such as:
- API keys
- Secret keys
- GitHub tokens
- Supabase credentials
- Access keys
- Authentication tokens
- Passwords
- Private keys
- AWS credentials
- Firebase keys
- And more...

### 2. Warning Notifications

The extension shows a warning message when secrets are detected, advising you to move them to a .env file.

### 3. Git Pre-commit Hook

The extension includes a pre-commit hook script that provides an additional layer of protection:
- Blocks commits containing .env files (but allows .env.example files)
- Scans staged files for sensitive information patterns
- Auto-installs itself to ensure it's always active

## Installation

1. Install the extension from the VS Code Marketplace
2. The pre-commit hook will be automatically installed when you run it for the first time

## Usage

The extension works automatically in the background:

1. Edit your code as usual
2. If you save a file containing potential secrets, you'll see warnings
3. Move your secrets to a .env file and add it to .gitignore
4. The pre-commit hook provides a final safety net to prevent accidental commits

## Requirements

- VS Code 1.75.0 or higher
- Git (for the pre-commit hook functionality)

## Extension Settings

This extension doesn't require any configuration to work out of the box.

## Known Issues

- The pattern matching for secrets may occasionally produce false positives
- The pre-commit hook needs to be manually installed in each repository

## TODO

- [x] Implement basic pattern matching for secret detection
- [x] Create pre-commit hook for Git integration
- [x] Add visual highlighting in the editor
- [ ] Implement entropy checking for detecting random strings that might be secrets
- [ ] Improve entropy checking to only flag actual secrets, not code like pattern definitions
- [ ] Reduce false positives by better distinguishing between actual secrets and code examples
- [ ] Add configuration options for customizing detection sensitivity

## Release Notes

### 0.0.1

- Initial release
- Real-time secret detection
- Warning notifications
- Git pre-commit hook

---

## Privacy and Security

This extension operates entirely locally. No data is sent to any external servers, and all scanning happens on your machine.

**Enjoy coding securely!**
