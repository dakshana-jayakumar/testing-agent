# Scripts

This directory contains utility scripts for the Lumos project.

## Directory Structure

```
scripts/
├── git/                    # Git-related scripts
│   └── commit-validation.cjs   # Enhanced commit message validation
└── README.md              # This documentation
```

## Git Scripts

### commit-validation.cjs

Enhanced commit message validation script that enforces conventional commit standards with additional features.

#### Features

- **Conventional Commits Validation**: Enforces proper format with type, scope, and description
- **Enhanced Type Support**: Includes `hotfix` type for critical production fixes
- **Rich Error Messages**: Detailed feedback with examples and suggestions
- **Colored Output**: Visual feedback with color-coded results
- **Breaking Change Detection**: Validates breaking change indicators and footers
- **Hotfix Guidelines**: Special validation for critical production fixes
- **Configurable Rules**: Easy to customize validation parameters

#### Supported Commit Types

| Type | Description | Usage |
|------|-------------|-------|
| `feat` | A new feature | New functionality |
| `fix` | A bug fix | Bug fixes |
| `hotfix` | Critical production fixes | Emergency patches |
| `docs` | Documentation changes | README, API docs, etc. |
| `style` | Code style changes | Formatting, semicolons |
| `refactor` | Code refactoring | No feature/bug changes |
| `perf` | Performance improvements | Optimization |
| `test` | Test additions/changes | Unit, integration tests |
| `chore` | Build/tool changes | Package updates, configs |
| `ci` | CI configuration | GitHub Actions, pipelines |
| `build` | Build system changes | Webpack, dependencies |
| `revert` | Revert previous commit | Rollback changes |

#### Suggested Scopes

| Scope | Description |
|-------|-------------|
| `cli` | CLI interface and commands |
| `ai` | AI provider integrations |
| `analysis` | Error analysis and pattern engine |
| `config` | Configuration management |
| `test` | Testing framework and utilities |
| `docs` | Documentation changes |
| `deps` | Dependency updates |
| `api` | API endpoints and interfaces |
| `ui` | User interface components |
| `db` | Database related changes |
| `auth` | Authentication and authorization |
| `security` | Security improvements and fixes |

#### Usage

The script is automatically executed by the Husky `commit-msg` hook:

```bash
# Automatic execution via Git hook
git commit -m "feat(cli): add new analyze command"
```

**Manual testing:**

```bash
# Test a specific commit message
echo "feat: add new feature" | node scripts/git/commit-validation.cjs /dev/stdin

# Test with a file
echo "hotfix(security): resolve critical JWT vulnerability" > test-commit.txt
node scripts/git/commit-validation.cjs test-commit.txt
```

#### Examples

**✅ Valid commit messages:**

```bash
feat: add new error analysis pattern
fix(cli): resolve TypeScript compilation errors
hotfix(auth): resolve critical JWT validation bypass
docs: update API documentation
feat(analysis)!: redesign pattern engine interface
```

**❌ Invalid commit messages:**

```bash
Add new feature                    # Missing type
feat add new feature              # Missing colon
feat: Add new feature             # Should start with lowercase
feat:add new feature              # Missing space after colon
feat: a                           # Too short
feat: this is a very long commit message that exceeds fifty characters  # Too long
```

#### Hotfix Guidelines

Hotfix commits have special validation rules:

- **Use sparingly**: Only for critical production issues
- **Include urgency keywords**: Use words like "critical", "security", "production"
- **Provide detailed body**: Explain the issue and solution
- **Examples**:
  ```bash
  hotfix(auth): resolve critical JWT validation bypass
  
  Security vulnerability allowing token validation bypass.
  Added proper signature verification and expiration checks.
  
  Fixes: CVE-2024-12345
  ```

#### Configuration

The validation rules can be customized by editing the `config` object in `commit-validation.cjs`:

```javascript
const config = {
  maxSubjectLength: 50,     // Maximum subject line length
  maxBodyLineLength: 72,    // Maximum body line length
  minSubjectLength: 10,     // Minimum subject line length
  // ... other settings
};
```

#### Integration with Semantic Release

This validation script works seamlessly with `semantic-release`:

- `feat:` triggers **minor** version bump
- `fix:` and `hotfix:` trigger **patch** version bump
- `!` or `BREAKING CHANGE:` triggers **major** version bump
- Other types don't trigger releases but appear in changelog

#### Troubleshooting

**Common Issues:**

1. **Script not executable**: Run `chmod +x scripts/git/commit-validation.cjs`
2. **Node.js not found**: Ensure Node.js ≥18.0.0 is installed
3. **File not found**: Verify the script path in `.husky/commit-msg`

**Debug Mode:**

```bash
# Run with debug information
DEBUG=1 node scripts/git/commit-validation.cjs commit-msg-file
```

#### Contributing

When adding new validation rules:

1. Update the `config` object with new rules
2. Add corresponding validation methods
3. Update this documentation
4. Add test cases for the new rules
5. Update the help text in `displayHelp()` method

For questions or issues with the commit validation, please open an issue in the project repository.
