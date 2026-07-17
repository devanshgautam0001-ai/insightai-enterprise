## Description
Provide a concise description of the changes introduced in this PR. Why are these changes necessary? What problems do they solve?

Related Issue: # (issue number)

## Type of Change
Please check the options that are relevant:
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Architectural refinement (refactoring, database migration, performance optimization)
- [ ] CI/CD, DevOps, or Infrastructure updates

## Validation & Quality Checklist
Before requesting code review, please confirm the following:
- [ ] The code compiles locally with `npm run build` and has no TypeScript compiler warnings.
- [ ] The code follows the style guidelines and passes the linter check (`npm run lint`).
- [ ] If changing the database, a database migration script has been generated and validated.
- [ ] New and existing unit/integration tests pass with full code coverage.
- [ ] UI visual checking has been done (responsive styles, color contrasts, layout spacing).
- [ ] Secure practices are followed (no hardcoded secrets, proper sanitization, XSS, rate limiting).

## Screenshots / Visual Enhancements (If Applicable)
If there are visual UI changes, please provide screenshots or screen recordings showing them before and after your edits.

## Database or Cache Changes (If Applicable)
Please describe any modifications made to database schemas, seeders, or Redis caching logic:
- List any migrations or seeders included.
- List any new environment variables required.
