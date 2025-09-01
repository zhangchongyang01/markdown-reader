# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do not** open a public issue
2. Email us at: [security@example.com](mailto:security@example.com)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- We will acknowledge receipt within 48 hours
- We will provide a detailed response within 7 days
- We will keep you informed of our progress

## Security Best Practices

### For Users

- Keep your dependencies updated
- Use HTTPS when possible
- Be cautious with user-generated content
- Regularly review and audit your content

### For Developers

- Follow secure coding practices
- Validate all inputs
- Use HTTPS for all communications
- Keep dependencies updated
- Regular security audits

## Security Considerations

This project is a client-side application that:

- Renders markdown content
- Handles file navigation
- Processes user input for search/filtering

### Potential Risks

- XSS through malicious markdown content
- Path traversal in file navigation
- Information disclosure through error messages

### Mitigations

- Content sanitization for markdown rendering
- Input validation for file paths
- Proper error handling without sensitive information

## Updates

This security policy will be updated as needed. Please check back regularly for updates.

Last updated: 2024-01-01
