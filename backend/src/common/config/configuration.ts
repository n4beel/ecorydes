export default () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    salt: parseInt(process.env.SALT, 10),
    baseURL: 'https://ctv-admin-dev.blockapex.io',
    projectName: 'CTV',
    secret: process.env.SECRET,
    database: {
        uri: process.env.MONGODB_URI
        //   host: process.env.DATABASE_HOST,
        //   port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    },
    email: {
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
        templateDir: process.env.EMAIL_TEMPLATES,
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    web3Auth: {
        clientId: process.env.WEB3AUTH_CLIENT_ID,
        clientSecret: process.env.WEB3AUTH_CLIENT_SECRET
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        s3Region: process.env.AWS_REGION,
        s3BucketName: process.env.AWS_BUCKET,
        s3FileURL: "https://ctv-media.s3.ap-southeast-2.amazonaws.com/"
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        assistantId: process.env.OPENAI_ASSISTANT_ID
    },
    moonpay: {
        apiKey: process.env.MOONPAY_API_KEY,
        apiSecret: process.env.MOONPAY_API_SECRET,
        baseURL: process.env.MOONPAY_BASE_URL
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        baseURL: `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${process.env.CLOUDINARY_CLOUD_NAME}`
    },
    solana: {
        rpc: process.env.SOLANA_RPC,
        wss: process.env.SOLANA_WSS,
        privateKey: process.env.SOLANA_PRIVATE_KEY,
    },
    weightages: {
        distance: 1,
        duration: 0.5,
        occupancy: 2,
        fare: 1,
        co2Saved: 1.5,
    },
    ecorydes: {
        authority: process.env.ECORYDES_AUTHORITY,
        mint: process.env.ECORYDES_MINT,
    },
    pusher: {
        key: process.env.PUSHER_KEY,
        appId: process.env.PUSHER_APP_ID,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
    },
});