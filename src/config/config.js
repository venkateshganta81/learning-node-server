module.exports = {
    port: 3500,
    bodyParserLimit: '50MB',
    jwt: {
        secret: "123@MTW$456tokenDummy",
        options: { expiresIn:  60 * 60 * 24 } // 1 day
    },
    dbConfig: {
        url: "mongodb://localhost:27017/learning",
    },
    passwordLength: 8
}