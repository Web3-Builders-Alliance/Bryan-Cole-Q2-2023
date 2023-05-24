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
    const image = await readFile("./images/generug.png")
    const metaplex_image = toMetaplexFile(image, "generug.png")
    const uri = await metaplex.storage().upload(metaplex_image)
    console.log(`${uri}`)

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// https://arweave.net/WnqK6sE32S-8wAn__gLoXQXA8G2F59aqcNTQv6ZQa6Q