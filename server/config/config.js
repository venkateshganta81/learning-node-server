module.exports = {
    jwt: {
        secret: "hatsai@321#1",
    },
    sendGrid:{
        apiKey:'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',
        adminEmail:'akhilatpi@gmail.com',
        senderEmail:'akhilatpi@gmail.com'
       },
    port:3001,
    bodyParserLimit: '50mb',
   
    /* Data Base for Development */
    DB:{
        url: "mongodb://localhost:27017/abhibus",
        /* user: 'hatsai',
        password: 'hatsai@123#' */
    }
   
    /* Data Base for Server */
    /* DB:{
        url: "mongodb://localhost/hats-ai",
        user: 'hatsai',
        password: 'hatsai@123#MTW>81'
    } */


   
};


