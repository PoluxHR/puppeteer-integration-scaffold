const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const chromium = require('chrome-aws-lambda');
const { addExtra } = require('puppeteer-extra');
const puppeteerExtra = addExtra(chromium.puppeteer);
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(StealthPlugin());

const Provider = require('./provider/scraper');

const lambdaHandler = async (event, context) => {
  await Promise.all(event.Records.map(async (record) => {
    const messageId = record.messageId;
    console.log(`Start of processing message ${messageId}`);
    const response = await executeAction(record);
    console.log(`Response ${JSON.stringify(response, null, 2)}`);
    // Send SQS message with reponse
    const client = new SQSClient({ region: "sa-east-1" });
    const command = new SendMessageCommand({
      MessageBody: JSON.stringify(response), QueueUrl: process.env.RESULTS_QUEUE_URL, MessageGroupId: '[provider]-integration'
    });
    await client.send(command);
    console.log(`End of processing message ${messageId}`);
  }));
};

const executeAction = async (record) => {
  const { body } = record;
  console.log(`Body: ${JSON.stringify(body, null, 2)}`);
  const { action, params } = JSON.parse(body);
  const executablePath = await chromium.executablePath;

  const browser = await puppeteerExtra.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true
  });

  const page = (await browser.pages())[0];
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');

  const { email, encrypted_password, iv } = params.credentials;
  let result = {request: {params: params}, response: {}};
  try {
    const provider = new Provider(browser, page);
    await provider.login(email, encrypted_password, iv);
    switch (action) {
      case 'build_offer':
        result.request.action = 'build_offer';
        console.log('Creating offer');
        const offerResult = await provider.createOffer(params.offer);
        result.response.status = 201;
        result.response.body = offerResult;
        break;
      case 'get_applicants':
        result.request.action = 'get_applicants';
        console.log('Scraping postulations');
        const applicantsResult = await provider.scrapePostulations(params.offer.id);
        result.response.status = 201;
        result.response.body = applicantsResult;
        break;
      default:
        console.log('Error: wrong action')
        break;
    }
  } catch (error) {
    result.response.status = 500;
    result.response.body = {error: error};
    console.error(error);
  } finally {
    await browser.close();
    return result;
  }
};

module.exports.lambdaHandler = lambdaHandler;
