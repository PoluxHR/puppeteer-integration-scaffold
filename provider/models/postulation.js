/**
 * @class Postulation
 */
 module.exports = class Postulation {
  /**
   * @constructor
   */
  constructor(params) {
    // Receive Provider's params and translate them to Polux's values
  }

  translateParamX(providerAttributeValue) {
    // This is an example and can be done in other ways depending on the 'translations'
    const providerValuesTranslation = {
      providerValue1: 'poluxValueA',
      providerValue2: 'poluxValueB',
      providerValue3: 'poluxValueC',
      providerValue4: 'poluxValueC',
      providerValue5: 'poluxValueC'
    }

    return providerValuesTranslation[providerAttributeValue];
  }
};
