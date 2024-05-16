# camp-subgraph

A subgraph that indexes camp specific nouns data. This is meant to augment [nouns-subgraph](https://github.com/nounsDAO/nouns-monorepo/tree/master/packages/nouns-subgraph), not replace.

## Initial setup

Install dependencies:

```sh
yarn install
```

Generate AssemblyScript types from the schema and abis:

```sh
yarn codegen
```

## Running a local deployment

Configure contract addresses and start blocks in `networks.json`, and an Ethereum RPC endpoint in `.env` (copy `.env.template`).

Start your local graph node with Docker by running:

```sh
docker-compose up
```

Then in a new terminal run:

```sh
yarn deploy-local --network mainnet
```

Make sure the specified network is configured in `networks.json` and matches the `NETWORK` in `.env`.

## Running tests

```sh
yarn test
```

## Deploying to a hosted service

The deployment procedure differs between providers. See the relevant docs for up-to-date instructions.

- [The Graph](https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-studio/)
- [Goldsky](https://docs.goldsky.com/subgraphs/deploying-subgraphs)
- [Alchemy](https://docs.alchemy.com/reference/deploying-a-subgraph)
