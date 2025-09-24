# Lumos Documentation

This directory contains the complete documentation for the Lumos AI Testing
Intelligence Platform, built with MkDocs and Material for MkDocs theme.

## 📁 Documentation Structure

```
docs/
├── index.md                    # Homepage
├── getting-started/
│   ├── index.md               # Getting started overview
│   ├── installation.md       # Installation guide
│   ├── quick-start.md         # Quick start tutorial
│   └── first-analysis.md      # First analysis walkthrough
├── cli/
│   └── commands.md            # CLI reference
├── sdk/
│   └── integration.md         # SDK and integrations
├── advanced/
│   └── configuration.md       # Advanced configuration
├── reference/
│   └── api.md                 # API reference
├── examples/                  # Usage examples (planned)
├── contributing/              # Contributing guides (planned)
├── stylesheets/
│   └── extra.css              # Custom styling
└── javascripts/
    └── mathjax.js             # MathJax configuration
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ installed
- Node.js 18+ (for the main project)

### Setup Documentation Environment

1. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Serve documentation locally:**

   ```bash
   npm run docs:serve
   # or directly:
   mkdocs serve
   ```

3. **Build documentation:**

   ```bash
   npm run docs:build
   # or directly:
   mkdocs build
   ```

4. **Deploy to GitHub Pages:**
   ```bash
   npm run docs:deploy
   # or directly:
   mkdocs gh-deploy
   ```

## 🎨 Theme and Customization

The documentation uses **Material for MkDocs** with custom Lumos branding:

### Custom Styling

- **Primary Color**: Indigo (`#6366f1`)
- **Secondary Color**: Purple (`#8b5cf6`)
- **Accent Color**: Cyan (`#06b6d4`)

### Features Enabled

- 🌙 Dark/Light mode toggle
- 🔍 Advanced search with highlighting
- 📱 Mobile-responsive design
- 🎯 Navigation tabs and sections
- 📝 Code copy buttons
- 🔗 Social links integration
- 📊 Git revision dates

## 📝 Writing Documentation

### Markdown Features

The documentation supports advanced Markdown features through PyMdown
Extensions:

#### Admonitions

````markdown
!!! tip "Pro Tip" Use `--context` flag for better analysis results

!!! warning "Important" Always review AI suggestions before applying

!!! example "Example" `bash     lumos analyze "error message" --research     `
````

#### Code Blocks with Syntax Highlighting

````markdown
```typescript
const result = await lumos.analyze(error);
console.log(result.suggestions);
```
````

#### Feature Cards (Custom CSS)

```html
<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon">🎯</div>
    <h3>Feature Title</h3>
    <p>Feature description</p>
    <a href="link.md" class="lumos-button">Learn More</a>
  </div>
</div>
```

#### Status Badges

```html
<span class="status-badge new">New</span>
<span class="status-badge deprecated">Deprecated</span>
<span class="status-badge experimental">Experimental</span>
```

### Navigation Structure

The navigation is defined in `mkdocs.yml`. To add new pages:

1. Create the Markdown file in the appropriate directory
2. Add it to the `nav` section in `mkdocs.yml`
3. Rebuild the documentation

## 🔧 Configuration

### MkDocs Configuration (`mkdocs.yml`)

Key configuration sections:

- **Site Information**: Name, description, URL
- **Theme Configuration**: Material theme with custom colors
- **Plugins**: Search, minification, git dates
- **Markdown Extensions**: Advanced syntax support
- **Navigation**: Site structure and page organization

### Requirements (`requirements.txt`)

Core dependencies:

- `mkdocs>=1.5.0` - Static site generator
- `mkdocs-material>=9.4.0` - Material Design theme
- `mkdocs-minify-plugin>=0.7.0` - HTML/CSS minification
- `mkdocs-git-revision-date-localized-plugin>=1.2.0` - Git dates
- `pymdown-extensions>=10.3.0` - Advanced Markdown features

## 🚢 Deployment

### GitHub Pages (Recommended)

The documentation is configured for GitHub Pages deployment:

```bash
# Deploy to gh-pages branch
npm run docs:deploy
```

### Manual Deployment

1. Build the site:

   ```bash
   mkdocs build
   ```

2. Deploy the `site/` directory to your web server

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Setup Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.x'

- name: Install dependencies
  run: pip install -r requirements.txt

- name: Build documentation
  run: mkdocs build

- name: Deploy to GitHub Pages
  run: mkdocs gh-deploy --force
```

## 📊 Analytics and Monitoring

### Google Analytics

Update the Google Analytics property in `mkdocs.yml`:

```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX # Replace with your GA4 ID
```

### Search Analytics

Material for MkDocs includes built-in search analytics to track popular
searches.

## 🤝 Contributing to Documentation

### Writing Guidelines

1. **Use clear, concise language**
2. **Include practical examples**
3. **Add code snippets where helpful**
4. **Use admonitions for important information**
5. **Test all commands and code examples**

### Review Process

1. Create documentation in a feature branch
2. Test locally with `mkdocs serve`
3. Submit a Pull Request
4. Documentation team reviews
5. Deploy after approval

## 🆘 Troubleshooting

### Common Issues

**Build Errors:**

```bash
# Check MkDocs version
mkdocs --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Styling Issues:**

- Check `docs/stylesheets/extra.css` for custom styles
- Verify Material theme version compatibility

**Navigation Issues:**

- Validate `mkdocs.yml` syntax
- Ensure all referenced files exist

### Getting Help

- 📖 [MkDocs Documentation](https://www.mkdocs.org/)
- 🎨 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- 🐛 [Report Documentation Issues](https://github.com/lumos/lumos/issues)

## 📚 Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [Material Design](https://material.io/design)
- [PyMdown Extensions](https://facelessuser.github.io/pymdown-extensions/)
