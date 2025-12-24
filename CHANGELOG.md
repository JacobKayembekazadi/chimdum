# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **BREAKING:** Migrated from Google Gemini API to DeepSeek API
- Updated API service to use OpenAI-compatible DeepSeek endpoints
- Changed environment variable from `GEMINI_API_KEY` to `DEEPSEEK_API_KEY` (backward compatible)
- Voice assessment temporarily disabled (DeepSeek doesn't support live voice API)

### Added
- Error boundary component for better error handling
- Retry logic with exponential backoff for API calls
- Environment validation utilities
- API key validation
- Input validation and sanitization
- Rate limiting to prevent API abuse
- Comprehensive test suite with Vitest
- ESLint and Prettier configuration
- TypeScript strict mode
- Accessibility improvements (ARIA labels, keyboard navigation)
- Performance monitoring utilities
- SEO meta tags and structured data
- PWA manifest and service worker support
- CI/CD pipeline with GitHub Actions
- Comprehensive documentation

### Changed
- Enhanced error handling throughout the application
- Improved user feedback for errors
- Better loading states

### Fixed
- Missing CSS file issue
- Environment variable handling
- Error display in ResultsView

## [0.1.0] - 2024-01-01

### Added
- Initial release
- Text-based assessment wizard
- Voice-based assessment
- Results display
- Gemini API integration

