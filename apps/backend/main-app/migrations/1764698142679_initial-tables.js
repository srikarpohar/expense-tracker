/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(
        `CREATE TABLE IF NOT EXISTS users (
            user_id INT GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
            email VARCHAR(40),
            country_code VARCHAR(5) NOT NULL,
            phone_number VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            username VARCHAR(200) UNIQUE NOT NULL,
            profile_pic_url VARCHAR(200),
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            PRIMARY KEY(user_id)
        );

        CREATE TYPE user_signup_verification_status AS ENUM('USER_CREATED', 'OTP_SENT', 'OTP_VERIFIED', 'OTP_EXPIRED', 'OTP_RESENT', 'FAILED');

        CREATE TABLE IF NOT EXISTS user_signup_verifications (
            verification_id INT GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
            user_id INT NOT NULL,
            verification_status user_signup_verification_status,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            no_of_attempts INT DEFAULT 0,
            PRIMARY KEY(verification_id),
            CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id)
        );
        
        CREATE TYPE device_type AS ENUM('Android phone', 'Tablet', 'IOS Phone', 'Web browser');

        CREATE TABLE IF NOT EXISTS user_devices (
            user_id INT NOT NULL,
            device_id INT GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            type device_type,
            PRIMARY KEY(user_id, device_id),
            CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS expense_category (
            expense_cat_id INT GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            thumbnailUrl VARCHAR(200),
            description VARCHAR(200)
        );

        CREATE TYPE recurring_expense_freq AS ENUM('day', 'month', 'week', 'year');

        CREATE TABLE IF NOT EXISTS expense (
            expense_id BIGINT GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            cat_id INT,
            description VARCHAR(300),
            amount NUMERIC CHECK(amount > 0),
            currency CHAR(1) NOT NULL,
            paid_on TIMESTAMP NOT NULL,
            created_by INT NOT NULL,
            recurring_frequency recurring_expense_freq,
            bill_image_url VARCHAR(200),
            CONSTRAINT fk_cat_id FOREIGN KEY(cat_id) REFERENCES expense_category(expense_cat_id) ON DELETE SET NULL,
            CONSTRAINT fk_user_id FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
        );

        CREATE TYPE user_transaction_type AS ENUM('Debit', 'Credit');

        CREATE TABLE IF NOT EXISTS user_transactions (
            user_expense_id BIGINT GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) PRIMARY KEY,
            user_id INT NOT NULL,
            expense_id BIGINT NOT NULL,
            isRecurringExpense BOOLEAN DEFAULT false,
            transaction_type user_transaction_type NOT NULL,
            amount NUMERIC CHECK(amount > 0),
            CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            CONSTRAINT fk_expense_id FOREIGN KEY(expense_id) REFERENCES expense(expense_id) ON DELETE CASCADE
        );
        `
    )
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS users, user_devices, expense_category, expense, user_transactions CASCADE;
    `)
};
        // DROP TYPE IF EXISTS device_type, recurring_expense_freq, user_transaction_type, user_signup_verification_status;

