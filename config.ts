const env = process.env as any;
export const VERIFIER_PLUS_URL = env['VERIFIER_PLUS_URL'] || 'https://verifierplus.org';

export const KnownDidRegistries = [
  {
    'name': 'OpSecId Dev Registry',
    'url': 'https://registry.opsec.id/dev.json'
  }
];

export const LinkConfig = {
  schemes: {
    customProtocol: ['dccrequest://', 'org.dcconsortium://'],
    universalAppLink: 'https://lcw.app/mobile'
  },
  registerWalletUrl: 'https://lcw.app/register-wallet.html',
  appWebsite: {
    home: 'https://lcw.app',
    // FAQ page assumes #public-link,
    //   #public-link-unshare, and #add-to-linkedin sections
    faq: 'https://lcw.app/faq.html'
  }
};
