/**
 * @class Offer
 */
 module.exports = class Offer {
  /**
   * @constructor
   */
  constructor(params) {
    // Receive Polux params and translate them to Provider's values
  }

  translateParamX(poluxAttributeValue) {
    // This is an example and can be done in other ways depending on the 'translations'
    const poluxValuesTranslation = {
      poluxValue1: 'providerValueA',
      poluxValue2: 'providerValueB',
      poluxValue3: 'providerValueC',
      poluxValue4: 'providerValueC',
      poluxValue5: 'providerValueC'
    }

    return poluxValuesTranslation[poluxAttributeValue];
  }
};
