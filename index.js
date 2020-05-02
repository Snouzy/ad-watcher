const utip = require('./utip');

(async () => {
    const USERNAME = '';
    const PASSWORD = '';
    
    await utip.initialize();
    
    await utip.login(USERNAME, PASSWORD);
    
    /* Le pseudo de la personne à qui regarde les pubs */
    await utip.supportUser("");

  // await browser.close();

})();

