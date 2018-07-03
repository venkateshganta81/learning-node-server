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
    mgs91: {
        auth_Key: "141290AU0QFzYBzRl58a2beed",
        sender_id: "TMXGMI",
        route: "4"
    },
    passwordLength: 8,
    sendGrid: {
        apiKey: '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',
        senderEmail : "venkatesh.g@mtwlabs.com"
    }
}