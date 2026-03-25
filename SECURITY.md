# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue.

Instead, report it privately by emailing the maintainer or using [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability).

You should receive a response within 48 hours. We will work with you to understand the issue and coordinate a fix before any public disclosure.

## Scope

react-table-craft is a UI component library. Security concerns are most likely to involve:

- XSS through unsanitized user content rendered in table cells
- Prototype pollution in the config merge system
- Dependency vulnerabilities

We take all reports seriously regardless of severity.
