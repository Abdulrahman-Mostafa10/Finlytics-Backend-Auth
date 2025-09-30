# Security Policy

## Supported Versions
The following table lists which versions of the Cashlytics Backend components are actively maintained.

| Component         | Version   | Supported          |
| ----------------- | --------- | ------------------ |
| Backend-Auth      | `main`    | ✅                 |
(More to be added as we continue development)
---

## Security Guidelines
- **No Secrets in Code**  
  API keys, credentials, tokens, and sensitive configs must never be committed. Use environment variables or secure secret stores.

- **Protected Branches**  
  All code changes must be submitted via Pull Request to protected branches (e.g., `main`) and reviewed before merging.

- **Dependencies**  
  Keep dependencies up to date. Address all high/critical vulnerabilities flagged by automated scanners before merging.

- **Secure Coding Practices**  
  Follow OWASP Top 10 and the secure coding guidelines provided to you. Pay attention to input validation, output encoding, and authentication logic.

- **Testing & CI**  
  All security-related automated checks must pass before merging. This includes static analysis, dependency scanning, and secret detection.

---

## Reporting Security Issues
If you discover a security vulnerability in any Cashlytics repository:
1. Create a **private** GitHub Security Advisory for the affected repository.  
2. Provide as much detail as possible (steps to reproduce, potential impact, suggested fixes).  
3. Do not open a public issue until a fix has been implemented and merged.

---

## Acknowledgements
We appreciate all contributors who help keep Cashlytics secure.  
Following this policy ensures the safety of our users, data, and infrastructure.
