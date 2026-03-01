## Project overview

- This is a expense tracker application built using React/esbuild(bundler) frontend, NestJS backend and Postgres Database.
- This application has below features:
    - User authentication using email/phone number and password
    - OTP based signup for users.
    - User preferences for selecting currency and the application theme.
    - Dashboard showing expenses in the selected month by the user.
    - Add expense along with category, price, currency, amount, notes.
    - Split expense between different users from their contacts. Simplify debts feature.
    - Chat feature between users in a split expense.

## Code style guidelines

- Give a clear and concise code following design patterns for all the features.
- Write comments to only complex code in backend and frontend in a clear and concise manner.
- Check for any SQL database security vulnerabilities in the code and give proven alternatives to those problems.
- Add validations on body of the request for POST, PUT types in backend.

### Frontend(React/esbuild):
- Follow react design patterns like Composition while coding components in frontend.
- Use @phosphor-icons/react for icons wherever needed. Do not give a background to icon unless mentioned.
- Give a standard UI for standard components like dialogs, calendar, accordions such that each section is divided visually.

## Build and test commands

- Run `pnpm run app-dev` in root directory of the project to build and run docker containers.
- Use `pnpm run et-web eslint-check-only` in root directory of the project to check for any lint errors in frontend and run `eslint-fix` to fix those errors.
- Use `pnpm run et-backend` in root directory of the project to check for any lint errors in backend.

## PR instructions

- Group similiar changes and commit based on each group.
- Title format: [<feat_name>] <Title>
- Always run `pnpm run et-web eslint-check-only` before committing to check for any linting errors in frontend.