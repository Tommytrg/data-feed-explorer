import {
  FeedConfig,
  FeedParamsConfig,
  Network,
  NetworksConfig,
  RouterDataFeedsConfig,
} from '../../types'
import { getNetworksListByChain, sortAlphabeticallyByLabel } from '../utils'
import { NetworkInfo } from './NetworkRouter'
import { getProvider } from './provider'

export class Configuration {
  private configurationFile: RouterDataFeedsConfig

  constructor(json: RouterDataFeedsConfig) {
    this.configurationFile = json
  }

  public getDefaultAddress() {
    return this.configurationFile.contracts['2.0'].address
  }

  // normalize config to fit network schema
  public normalizeNetworkConfig(
    config: RouterDataFeedsConfig,
  ): Array<Omit<NetworksConfig, 'logo'>> {
    // Get a list of networks where every element of the array contains another array with networks that belong to a chain.
    const networks = getNetworksListByChain(config)

    // Put all networks at the same level removing the nested arrays
    const networkConfig = networks.flatMap((network) => network)

    const testnetNetworks = networkConfig.filter((network) => !network.mainnet)
    const mainnetNetworks = networkConfig.filter((network) => network.mainnet)
    return [
      ...sortAlphabeticallyByLabel(mainnetNetworks),
      ...sortAlphabeticallyByLabel(testnetNetworks),
    ]
  }

  // List networks using the price feeds router contract
  public listNetworksUsingPriceFeedsContract(): Array<NetworkInfo> {
    return Object.values(this.configurationFile.chains).flatMap((chain) =>
      Object.entries(chain.networks)
        .filter(([_, network]) => network.version === '2.0')
        .map(([networkKey, network]) =>
          this.createNetworkInfo(chain.name, networkKey, network),
        ),
    )
  }

  public getFeedConfiguration(
    priceFeedName: string,
    network: Network,
  ): FeedParamsConfig {
    const defaultConfiguration = this.configurationFile.conditions.default
    const defaultFeed = this.configurationFile.conditions[priceFeedName]
    const specificFeedConfiguration =
      this.getNetworkConfiguration(network)?.feeds?.[priceFeedName]

    return {
      ...defaultConfiguration,
      ...defaultFeed,
      ...specificFeedConfiguration,
      label: this.getFeedCurrencySymbol(priceFeedName),
    }
  }

  public getNetworkConfiguration(network: Network) {
    const { address, pollingPeriod } = this.configurationFile.contracts['2.0']
    return {
      address,
      pollingPeriod,
      ...this.configurationFile.chains[getChain(network)].networks[
        networkToKey(network)
      ],
    }
  }

  public getFeedCurrencySymbol(priceFeedName: string) {
    // Example: Price-TOKEN/CURRENCY-6
    const currency = priceFeedName.split('/')[1].split('-')[0]

    return this.configurationFile.currencies[currency] || ' '
  }

  private fromNetworkKeyToNetwork(networkKey: string): Network {
    return networkKey.replaceAll('.', '-') as Network
  }

  // Helper to create a NetworkInfo
  private createNetworkInfo(
    chainName: string,
    networkKey: string,
    network: FeedConfig,
  ): NetworkInfo {
    const { address, pollingPeriod } = this.configurationFile.contracts['2.0']

    return {
      chain: chainName,
      provider:
        network.blockProvider ||
        getProvider(this.fromNetworkKeyToNetwork(networkKey)) ||
        '',
      address: network.address || address,
      pollingPeriod: network.pollingPeriod || pollingPeriod,
      key: this.fromNetworkKeyToNetwork(networkKey),
      networkName: network.name,
    }
  }
}

export function getChain(network: Network) {
  return network.split('-')[0]
}
export function networkToKey(network: Network) {
  return network.replaceAll('-', '.')
}
