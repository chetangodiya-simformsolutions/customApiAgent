export const domain: string = 'test.page.link';

export const bundleId: string = 'com.simform.test';

export const deepLinkPrefixes = ['test://', `${domain}//`, `https://${domain}`];

export enum DeepLink {
  // test://magic_link&lang=en&tenantId=austin-electrical-qqm76
  MagicLink = 'magic_link',
  // test://forgot_password&lang=en&tenantId=austin-electrical-qqm76
  ForgotPassword = 'forgot_password',
  // test://?toastMessage=<message content>
  ToastMessage = 'toastMessage'
}

export default DeepLink;
