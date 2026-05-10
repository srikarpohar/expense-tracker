# Expense Tracker

Track your expenses and check on monthly spending. Split your expenses with other users, chat with them and mark split expense as paid or not paid.
Made using React.js, NestJS, PostgreSQL and Docker.

# Steps to run application locally:

## Prerequisites to install:

1. Install pnpm - [Link](https://pnpm.io/installation)
2. Install docker from [official website](https://docs.docker.com/engine/install/)

## Using Docker:

1. Create `secrets/db_credentials.env` in the root of the application.
    `mkdir -p secrets/db_credentials.env`
2. Add the following credentials to authenticate the database in the container.
    ```
    POSTGRES_DB=db name
    POSTGRES_USER=userid
    POSTGRES_PASSWORD=password
    ```
    **Note**:Data from the application is stored in a docker volume and the path inside the database container is `/var/lib/postgresql`.
3. Finally, Run the following command at the root of the application:
    `pnpm run app-build && pnpm run app-dev`
4. The application will run in `http://localhost:4200`.

## Without using Docker:

1. Run `pnpm install` in the root of the application.
2. Start a terminal session and change directory to shared(`cd shared`). Run the shared app using `pnpm run build:watch` command.
3. In the root directory, run the frontend application      
    `pnpm run et-web dev` 
4. Run the backend application using `pnpm run et-backend start:dev`
5. The application will run in `http://localhost:4200`.

# Further Reference

[Link](https://app.eraser.io/workspace/jYw7zQJ140LYhqg0yxg5)

# Deployment URL:

1. Frontend:
[Dashboard](https://vercel.com/srikarpohars-projects/expense-tracker)
[URL](https://expense-tracker-cyan-ten-25.vercel.app/login?redirect=%2F)

2. Backend
[Dashboard](https://dashboard.render.com/web/srv-d7uoiqe7r5hc73baldu0/events)
[URL](https://expense-tracker-z918.onrender.com)

3. Database
[Dashboard](https://supabase.com/dashboard/project/gvmkptdlvhouhaiykkpc)