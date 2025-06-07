## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/OrbitScript.s.sol --rpc-url base-sepolia --account dev --sender 0x965b0e63e00e7805569ee3b428cf96330dfc57ef --via-ir --optimize --optimizer-runs 10000 --broadcast --verify -vvvv
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## Deployed Contracts

- OrbitRewards: 0x0e3Bad7d5e076788B8535E6b9fAB5D5FF9868cAb
- OrbitRewardsNFT: 0xbfE6e81928C67694027f863e2593E832c6fa7CD7
