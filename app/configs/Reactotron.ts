/**
 * Configures and returns the Reactotron settings.
 * @returns {Array} An array of configuration settings for Reactotron.
 */
export const getReactotronEnhancer = () => {
  const Reactotron = require('../configs/ReactotronConfig').default;
  return [Reactotron.createEnhancer()];
};
