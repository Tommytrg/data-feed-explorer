import { AbiItem } from 'web3-utils'
import { ResultRequestDbObject } from './src/generated/types'
import { FeedRepository } from './src/repository/Feed'
import { ResultRequestRepository } from './src/repository/ResultRequest'
import DataLoader from 'dataloader'
import { Configuration } from './src/web3Middleware/Configuration'

export * from './src/generated/types'
export { Db, Collection, WithId } from 'mongodb'
export { AbiItem } from 'web3-utils'
export { Contract } from 'web3-eth-contract'

export type WithoutId<T> = Omit<T, '_id' | 'id'>

export type Loaders = {
  lastResult: DataLoader<string, ResultRequestDbObjectNormalized, string>
  requests: DataLoader<
    | string
    | {
        feedFullName: string
        timestamp: number
      },
    ResultRequestDbObjectNormalized,
    string
  >
  logos: DataLoader<string, string, string>
}

export interface Context {
  feedRepository: FeedRepository
  resultRequestRepository: ResultRequestRepository
  config: {
    networksConfig: Array<NetworksConfig>
    configuration: Configuration
  }
  loaders: Loaders
}

export type ConfigByFullName = {
  [key: string]: FeedInfo
}

export enum Network {
  ArbitrumOne = 'arbitrum-one',
  ArbitrumGoerli = 'arbitrum-goerli',
  AvalancheMainnet = 'avalanche-mainnet',
  AvalancheFuji = 'avalanche-fuji',
  BobaEthereumMainnet = 'boba-ethereum-mainnet',
  BobaEthereumGoerli = 'boba-ethereum-goerli',
  BobaBnbMainnet = 'boba-bnb-mainnet',
  BobaBnbTestnet = 'boba-bnb-testnet',
  CeloAlfajores = 'celo-alfajores',
  CeloMainnet = 'celo-mainnet',
  ConfluxCoreMainnet = 'conflux-core-mainnet',
  ConfluxEspaceMainnet = 'conflux-espace-mainnet',
  ConfluxCoreTestnet = 'conflux-core-testnet',
  ConfluxEspaceTestnet = 'conflux-espace-testnet',
  CronosTestnet = 'cronos-testnet',
  CronosMainnet = 'cronos-mainnet',
  CubeTestnet = 'cube-testnet',
  DogechainTestnet = 'dogechain-testnet',
  DogechainMainnet = 'dogechain-mainnet',
  ElastosMainnet = 'elastos-mainnet',
  ElastosTestnet = 'elastos-testnet',
  EthereumGoerli = 'ethereum-goerli',
  EthereumSepolia = 'ethereum-sepolia',
  EthereumMainnet = 'ethereum-mainnet',
  FuseTestnet = 'fuse-testnet',
  GnosisTestnet = 'gnosis-testnet',
  KavaMainnet = 'kava-mainnet',
  KavaTestnet = 'kava-testnet',
  KccTestnet = 'kcc-testnet',
  KccMainnet = 'kcc-mainnet',
  KlaytnMainnet = 'klaytn-mainnet',
  KlaytnTestnet = 'klaytn-testnet',
  MantleTestnet = 'mantle-testnet',
  MantleMainnet = 'mantle-mainnet',
  MetisGoerli = 'metis-goerli',
  MeterTestnet = 'meter-testnet',
  MeterMainnet = 'meter-mainnet',
  MoonbeamMainnet = 'moonbeam-mainnet',
  MoonbeamMoonbase = 'moonbeam-moonbase',
  MoonbeamMoonriver = 'moonbeam-moonriver',
  OkxX1Sepolia = 'okx-x1-sepolia',
  OkxOkxchainTestnet = 'okx-okxchain-testnet',
  OptimismGoerli = 'optimism-goerli',
  OptimismMainnet = 'optimism-mainnet',
  PolygonGoerli = 'polygon-goerli',
  PolygonMainnet = 'polygon-mainnet',
  PolygonZkevmGoerli = 'polygon-zkevm-goerli',
  PolygonZkevmMainnet = 'polygon-zkevm-mainnet',
  ReefTestnet = 'reef-testnet',
  ReefMainnet = 'reef-mainnet',
  ScrollMainnet = 'scroll-mainnet',
  ScrollSepolia = 'scroll-sepolia',
  SmartbchAmber = 'smartbch-amber',
  SyscoinTestnet = 'syscoin-testnet',
  SyscoinMainnet = 'syscoin-mainnet',
  SyscoinRolluxTestnet = 'syscoin-rollux-testnet',
  UltronTestnet = 'ultron-testnet',
  UltronMainnet = 'ultron-mainnet',
}

export type FeedInfoGeneric<ABI> = {
  feedFullName: string
  id: string
  abi: ABI
  routerAbi: ABI
  address: string
  routerAddress: string
  isRouted: boolean
  // Network is the network key to identify a feed from a specific network in the database
  network: Network
  // NetworkName is the label of the network to show in the ui
  networkName: string
  chain: string
  name: string
  pollingPeriod: number
  label: string
  contractId: string
  color: string
  blockExplorer: string
  deviation: string | null
  heartbeat: string | null
  finality: string
}

export type NetworksConfig = {
  chain: string
  label: string
  key: string
  logo: string
}

export type FeedInfo = FeedInfoGeneric<Array<AbiItem>>

export type PaginatedFeedsObject = {
  feeds: Array<FeedInfo>
  total: number
}

export type ResultRequestDbObjectNormalized = ResultRequestDbObject & {
  id: string
}

export type Repositories = {
  feedRepository: FeedRepository
  resultRequestRepository: ResultRequestRepository
}

export type FeedInfoRouterConfigMap = {
  [key: string]: FeedParamsConfig
}

export type FeedParamsConfig = {
  label?: string
  isRouted?: boolean
  deviationPercentage?: number
  maxSecsBetweenUpdates?: number
  minSecsBetweenUpdates?: number
}

export type FeedConfig = {
  version?: '2.0'
  address?: string
  blockExplorer: string
  blockProvider?: string
  hide?: boolean
  mainnet?: boolean
  color: string
  name: string
  pollingPeriod?: number
  feeds?: FeedInfoRouterConfigMap
}

export type Chain = {
  name: string
  hide?: boolean
  networks: Record<string, FeedConfig>
}

export type RouterDataFeedsConfig = {
  contracts: {
    '2.0': {
      abi: string
      address: string
      pollingPeriod: number
    }
  }
  chains: Record<string, Chain>
  conditions: FeedInfoRouterConfigMap & {
    default: {
      deviationPercentage: number
      maxSecsBetweenUpdates: number
      minSecsBetweenUpdates: number
    }
  }
  currencies: Record<string, string>
}
