module.exports = {
    port: 3500,
    bodyParserLimit: '50MB',
    jwt: {
        secret: "GMI#123@MTW$456token",
        options: { expiresIn: 365 * 60 * 60 * 24 } // 365 days
    },
    dbConfig: {
        url: "mongodb://localhost:27017/learning",
       /*  user: 'gmi',
        password: 'GMI@MTW#MIB>81' */
    },
    passwordLength: 8
}