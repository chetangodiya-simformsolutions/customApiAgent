/**
 * A list of all the possible regular expressions used in the application.
 * @type {Object}
 */
export default Object.freeze({
  urlParams: /[?&]([^=#]+)=([^&#]*)/g,
  deepLinkQueryParamsMatch: /\?(.+)/,
  routeReplace: /.*?:\/\//g,
  paramReplace: /\/([^\\/]+)\/?$/
});
