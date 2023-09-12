# Setup

For Frontend, create a `./frontend/.env.local` file like this:
```
ALCHEMY_API_KEY= # Fill in your key (though I could not get Alchemy to work)
ALCHEMY_NETWORK=ETH_GOERLI
NEXT_PUBLIC_ALCHEMY_NETWORK=ETH_GOERLI
NEXT_PUBLIC_DEFAULT_CHAIN=goerli
INFURA_API_KEY= # Fill in your key
```

For Backend, create a `./project-name/.env` file like this:
```
# Sharable private key, so team can 
PRIVATE_KEY="4990e3e661ae5c64ca4819d2961f3f98dc58fc801ad34a906ffaa61361b06335"

# This is where the private key deploy the ERC20Votes Contract on Sepolia
ERC20_CONTRACT_ADDRESS="0xb78ea56431102C43BEa7cD373C986ce2145282f3"

# Fill in your key. This has been working with Alchemy
INFURA_API_KEY="********************************"
INFURA_API_SECRET="********************************"
ALCHEMY_API_KEY="********************************"
ETHERSCAN_API_KEY="********************************"

RPC_ENDPOINT_URL="" # Fill in your RPC URL
```

In one CLI terminal, run the frontend:
```
cd frontend
npm run dev
```

In a second CLI terminal, run the backend:
```
cd project-name
npm run start:dev
```

# Out of the Box README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
