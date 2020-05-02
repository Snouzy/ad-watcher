const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhoneX = devices['iPhone X'];

const BASE_URL = 'https://utip.io/';
const LOGIN_URL = 'https://utip.io/login';
const USERNAME_URL = (username) => `https://utip.io/${username}`;

let browser = null;
let page = null;

// cookie exporté by google chrome (plugin) 
var cookie = [ 
    {
        "domain": "utip.io",
        "expirationDate": 1597288045,
        "hostOnly": false,
        "httpOnly": false,
        "name": "key",
        "path": "/",
        "sameSite": "None",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "value!",
        "id": 1
    }
]
const utip = {

    // Lancement et direction utip
    initialize: async () => {
        browser = await puppeteer.launch({ headless: false, args: ['--disable-web-security'] });
        page = await browser.newPage();
        //Sinon ça marche pas je sais pas pourquoi, plus de sécurité sur l'ordi ??
        await page.emulate(iPhoneX); 
        page.setCookie(...cookie);
        await page.goto(BASE_URL);

    },

    // Connexion
    login: async (username, password) => {
        await page.goto(LOGIN_URL);
        await page.waitFor(1000);

        /* On s'identifie par username & password (par mail) */
        await page.waitFor('#login > div > div > div.login-form > div:nth-child(7) > div');
        await page.click('#login > div > div > div.login-form > div:nth-child(7) > div');

        await page.waitFor('input[name="_username"]');
        await page.type('input[name="_username"]', username, { delay: 100 });
        await page.type('input[name="_password"]', password, { delay: 70 });
        await page.click('button[class="login-submit"]');
    },

    // Regarde les pubs depuis un certain user
    supportUser: async (username) => {
        page.setCookie(...cookie);
        let url = await page.url();
        if(url != USERNAME_URL(username)) {
            await page.goto(USERNAME_URL(username));
        }

        /* Clic sur regarder une pub */
        await page.waitFor('div[class="support-btn-wrapper"] > div');
        await page.click('div[class="support-btn-wrapper"] > div');

        /* Attends que la pub se finisse */
        await page.waitForSelector('header[class="utip-modal-header"] > span', {timeout: 0});
        utip.supportUser(username);

    },

    //Se rend sur la page d'un user
    searchUser: async (user) => {
        let url = await page.url();
        // On va sur la page d'acceuil
        if(url != BASE_URL) {
            await page.goto(BASE_URL);
        }
        
        await page.waitFor('input[placeholder="Rechercher un créateur"]');
        await page.type('input[placeholder="Rechercher un créateur"]', user, { delay: 70 });
        await page.click('#tweet-box-home-timeline');
        await page.waitFor(500);
        await page.keyboard.type(message, { delay: 50 });
        await page.click('button[class="tweet-action EdgeButton EdgeButton--primary js-tweet-btn"]');
    },

    end: async () => await browser.close()

};

module.exports = utip;