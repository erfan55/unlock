type Config = Record<
  'gaId' | 'gaTmId' | 'baseURL' | 'appURL' | 'gApiKey',
  string
>

const devConfig: Config = {
  gaId: process.env.NEXT_PUBLIC_UNLOCK_GA_ID ?? '0',
  gaTmId: process.env.NEXT_PUBLIC_UNLOCK_GA_TM_ID ?? '0',
  baseURL:
    process.env.NEXT_PUBLIC_URL_BASE ?? 'https://staging.unlock-protocol.com',
  appURL:
    process.env.NEXT_PUBLIC_UNLOCK_APP_URI ??
    'https://staging-app.unlock-protocol.com',
  gApiKey: 'AIzaSyBqLebWxCpOw_HO4k0KhYkWhkrS__O3XME',
}

const stagingConfig: Config = {
  gaId: '0',
  gaTmId: '0',
  baseURL: 'https://staging.unlock-protocol.com',
  appURL:
    process.env.NEXT_PUBLIC_UNLOCK_APP_URI ??
    'https://staging-app.unlock-protocol.com',
  gApiKey: 'AIzaSyBqLebWxCpOw_HO4k0KhYkWhkrS__O3XME',
}

const productionConfig: Config = {
  gaId: 'UA-142114767-1',
  gaTmId: 'GTM-ND2KDWB',
  baseURL: 'https://unlock-protocol.com',
  appURL: 'https://app.unlock-protocol.com',
  gApiKey: 'AIzaSyBqLebWxCpOw_HO4k0KhYkWhkrS__O3XME',
}

function getUnlockConfig(environment?: string) {
  switch (environment) {
    case 'prod':
      return productionConfig
    case 'staging':
      return stagingConfig
    default:
      return devConfig
  }
}

export const unlockConfig = getUnlockConfig(process.env.NEXT_PUBLIC_UNLOCK_ENV)
