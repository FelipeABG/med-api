export default () => ({
    PORT: process.env.PORT || 8080,
    DB_URL: process.env.DB_URL,
    SECRET_KEY: process.env.SECRET_KEY,
});
