# CLI Reference 📟

Complete reference for all Lumos command-line interface commands.

## Core Commands

### `lumos analyze`

Analyze error messages with AI intelligence.

```bash
lumos analyze <error> [options]
```

**Arguments:**

- `<error>` - Error message or file path containing error

**Options:**

- `-f, --file <path>` - Path to file containing error log
- `-c, --context <path>` - Additional context directory (e.g., src/)
- `--research` - Include web research in analysis
- `--fix-suggestions` - Generate fix suggestions
- `--confidence <threshold>` - Minimum confidence threshold (0-1) (default: 0.7)
- `--max-suggestions <count>` - Maximum number of suggestions (default: 5)

**Examples:**

```bash
# Basic error analysis
lumos analyze "TypeError: Cannot read property 'click' of null"

# Analyze with file context
lumos analyze "ReferenceError: variable is not defined" --file tests/login.spec.ts

# Include research and fixes
lumos analyze "Network timeout" --research --fix-suggestions

# Set confidence threshold
lumos analyze "DOM element not found" --confidence 0.9
```

### `lumos validate`

Validate test quality and coverage.

```bash
lumos validate [testPath] [options]
```

**Arguments:**

- `[testPath]` - Path to test directory or file (default: tests/)

**Options:**

- `--threshold <score>` - Minimum quality score (0-100) (default: 70)
- `--detailed` - Show detailed breakdown
- `--fix` - Auto-fix simple issues
- `--format <type>` - Output format (json, table, html) (default: table)

**Examples:**

```bash
# Validate all tests
lumos validate

# Validate specific directory
lumos validate tests/e2e/

# Set quality threshold
lumos validate --threshold 85

# Get detailed report
lumos validate --detailed --format json
```

### `lumos debug`

Visual debugging with Playwright integration.

```bash
lumos debug [options]
```

**Options:**

- `--url <url>` - URL to debug
- `--viewport <size>` - Viewport size (default: 1920x1080)
- `--device <name>` - Device preset (mobile, tablet, desktop)
- `--save-screenshots` - Save screenshots for analysis
- `--interactive` - Launch interactive browser
- `--headless` - Run in headless mode

**Examples:**

```bash
# Debug a webpage
lumos debug --url http://localhost:3000

# Debug with mobile viewport
lumos debug --url http://localhost:3000 --device mobile

# Save screenshots for analysis
lumos debug --url http://localhost:3000 --save-screenshots

# Interactive debugging
lumos debug --url http://localhost:3000 --interactive
```

## Utility Commands

### `lumos init`

Initialize Lumos configuration.

```bash
lumos init [options]
```

**Options:**

- `--force` - Overwrite existing configuration
- `--template <name>` - Use configuration template
- `--interactive` - Interactive setup wizard

**Examples:**

```bash
# Basic initialization
lumos init

# Force overwrite existing config
lumos init --force

# Interactive setup
lumos init --interactive
```

### `lumos research`

Research solutions from community sources.

```bash
lumos research <query> [options]
```

**Arguments:**

- `<query>` - Search query or error message

**Options:**

- `--sources <list>` - Data sources (stackoverflow, github, docs) (default: all)
- `--limit <count>` - Maximum results (default: 10)
- `--format <type>` - Output format (json, table) (default: table)

**Examples:**

```bash
# Research an error
lumos research "TimeoutError waiting for selector"

# Research from specific sources
lumos research "React hooks error" --sources stackoverflow,github

# Limit results
lumos research "Playwright timeout" --limit 5
```

### `lumos watch`

Real-time file monitoring and analysis.

```bash
lumos watch [directory] [options]
```

**Arguments:**

- `[directory]` - Directory to watch (default: tests/)

**Options:**

- `--auto-analyze` - Automatically analyze errors
- `--debounce <ms>` - Debounce delay (default: 1000)
- `--ignore <patterns>` - Ignore patterns
- `--verbose` - Verbose output

**Examples:**

```bash
# Watch test directory
lumos watch tests/

# Auto-analyze on changes
lumos watch --auto-analyze

# Watch with custom debounce
lumos watch --debounce 2000
```

## Advanced Commands

### `lumos benchmark`

Performance benchmarking and analysis.

```bash
lumos benchmark [options]
```

**Options:**

- `--iterations <count>` - Number of iterations (default: 10)
- `--warmup <count>` - Warmup iterations (default: 3)
- `--output <path>` - Output file path
- `--compare <baseline>` - Compare with baseline

**Examples:**

```bash
# Run benchmark
lumos benchmark

# Compare with baseline
lumos benchmark --compare baseline.json

# Custom iterations
lumos benchmark --iterations 20 --warmup 5
```

### `lumos learn`

Pattern learning from logs and history.

```bash
lumos learn [options]
```

**Options:**

- `--from-logs <path>` - Learn from log files
- `--from-history` - Learn from analysis history
- `--update-patterns` - Update pattern database
- `--export <path>` - Export learned patterns

**Examples:**

```bash
# Learn from test logs
lumos learn --from-logs test-results.xml

# Learn from analysis history
lumos learn --from-history

# Update pattern database
lumos learn --update-patterns
```

## Utility Sub-commands

### `lumos utils config`

Configuration management utilities.

```bash
# Validate configuration
lumos utils config validate

# Show current configuration
lumos utils config show

# Reset to defaults
lumos utils config reset

# Migrate from old version
lumos utils config migrate
```

### `lumos utils cache`

Cache management utilities.

```bash
# Clear all caches
lumos utils cache clear

# Show cache statistics
lumos utils cache stats

# Validate cache integrity
lumos utils cache validate

# Set cache size limit
lumos utils cache limit 1GB
```

### `lumos utils status`

System status and diagnostics.

```bash
# Check system status
lumos utils status

# Check AI provider connectivity
lumos utils status --providers

# Run diagnostics
lumos utils status --diagnostics

# Export status report
lumos utils status --export status-report.json
```

## Global Options

Available for all commands:

- `-V, --version` - Output version number
- `-v, --verbose` - Enable verbose output
- `-q, --quiet` - Suppress output except errors
- `--config <path>` - Path to configuration file
- `-h, --help` - Display help for command

## Configuration

### Environment Variables

```bash
# NeuroLink API Configuration
NEUROLINK_API_KEY=your-api-key

# Lumos Configuration
LUMOS_CONFIG_PATH=./lumos.config.yaml
LUMOS_LOG_LEVEL=info|debug|warn|error
LUMOS_CACHE_ENABLED=true|false
LUMOS_CACHE_DIR=./.lumos-cache

# Debug Settings
LUMOS_DEBUG_SCREENSHOTS=true|false
LUMOS_DEBUG_SAVE_LOGS=true|false
```

### Exit Codes

- `0` - Success
- `1` - General error
- `2` - Configuration error
- `3` - Network error
- `4` - AI provider error
- `5` - Validation failure

## Examples by Use Case

### CI/CD Integration

```bash
# In your CI pipeline
lumos validate tests/ --threshold 80 --format json > test-quality.json
lumos analyze "$(cat test-failures.log)" --research --fix-suggestions
```

### Development Workflow

```bash
# Start file watching during development
lumos watch tests/ --auto-analyze &

# Run specific analysis when needed
lumos analyze "Your specific error" --context src/

# Check test quality before commit
lumos validate --threshold 85
```

### Debugging Session

```bash
# Start interactive debugging
lumos debug --url http://localhost:3000 --interactive

# Analyze any errors found
lumos analyze "Error from debugging" --fix-suggestions

# Research community solutions
lumos research "Similar error pattern"
```

---

**Need help with a specific command?** Use `lumos <command> --help` for detailed
information.
