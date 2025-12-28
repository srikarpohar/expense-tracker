export default () => {

    return {
        jwt: {
            secret: process.env.JWT_SECRET || 'pirates-dreams-never-die',
            expiresIn: process.env.JWT_EXPIRATION_INTERVAL || 600
        },
        password_salt: parseInt(process.env.HASH_SALT_ROUNDS || '10'),
        storage: {
            assetsPath: process.env.STORAGE_ASSETS_PATH || 'storage/assets'
        },
        primaryDb: {
            connectionUri: process.env.DATABASE_URL,
            databaseOptions: {}
        },
        sms: {
            enable: false,
            twilio: {
                accountSid: process.env.TWILIO_ACCOUNT_SID || '',
                authToken: process.env.TWILIO_AUTH_TOKEN || '',
                senderPhone: process.env.TWILIO_SENDER_PHONE || '',
                verifyServiceId: process.env.TWILIO_VERIFY_SERVICE_SID
            },
            firebase: {
                apiKey: process.env.FIREBASE_API_KEY || '',
                authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
                projectId: process.env.FIREBASE_PROJECT_ID || '',
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
                messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
                appId: process.env.FIREBASE_APP_ID || '',
                measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
            }
        }
    }
};