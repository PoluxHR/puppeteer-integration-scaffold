const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const htmlParser = require('node-html-parser');

const Offer = require('./models/offer');
const { decryptPassword } = require('./credentials');

/**
 * @class Provider
 */
module.exports = class Provider {
  /**
   * @constructor
   */
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;
    this.page.on('console', consoleObj => console.log(consoleObj.text()));
  }

  async takeScreenshot(page, offerId, action) {
    const client = new S3Client({region: 'sa-east-1'});
    const screenshot = await page.screenshot({fullPage: true});
    const command = new PutObjectCommand(
      {Bucket: 'polux-lambdas', Key: `[provider]/${offerId}/${(new Date()).getTime()}-${action}.jpg`, Body: screenshot}
    );
    const response = await client.send(command);
    console.log(response);
  }

  /**
   * @method login
   */
  async login(username, encryptedPassword, iv) {
    // Logic to login
  }

  /**
   * @method createOffer
  */
  async createOffer(payload) {
    // Logic to create offer
    return {reference_number: poluxOfferId, offer_id: publishedOfferId};
  }

  /**
   * @method scrapePostulations
  */
  async scrapePostulations(offerId) {
    // Logic to scrape postulations
    return {applicants: postulationsArray};
  }
};
