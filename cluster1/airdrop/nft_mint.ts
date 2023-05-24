import { Commitment, Connection, Keypair } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";
import { readFile } from "fs/promises"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair))
    .use(bundlrStorage ({
    address: "https://devnet.bundlr.network",
    providerUrl: "https://api.devnet.solana.com",
    timeout: 60_000 
}));

(async () => {
    try {
    const mint = await metaplex.nfts().create({
        uri: "https://arweave.net/Y6AjlOW7H_vn-jwSc8QcdM0Mgfw_GV-44Q79idSUN-E",
        name: "rugged",
        symbol: "rug",
        creators: [
            {  // you can add multiple creators
              address: keypair.publicKey,
              share: 100
            }
        ],
        sellerFeeBasisPoints: 500,
        isMutable: true
    })
    console.log(`${mint.nft.address.toBase58()}`)

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()