# Integration Guide

## Setting Up the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/chimdum.git
   cd chimdum
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your DEEPSEEK_API_KEY
   # Or use the provided .env.local file
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Environment Variables

### Required
- `DEEPSEEK_API_KEY` - Your DeepSeek API key from [DeepSeek Platform](https://platform.deepseek.com/)

### Optional
- `API_TIMEOUT` - API request timeout in milliseconds (default: 30000)
- `API_RETRY_ATTEMPTS` - Number of retry attempts (default: 3)

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## Deployment

The project can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload `dist` folder to S3 bucket
- **GitHub Pages**: Use GitHub Actions workflow

## CI/CD

The project includes GitHub Actions workflows:
- `ci.yml` - Runs tests, linting, and builds on push/PR
- `deploy.yml` - Deploys to production on main branch

