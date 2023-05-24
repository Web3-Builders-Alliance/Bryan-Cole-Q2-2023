import { Commitment, Connection, Keypair } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";

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
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: "rugged",
            symbol: "rug",
            description: "The literal rug that rugged you.",
            image: "https://arweave.net/WnqK6sE32S-8wAn__gLoXQXA8G2F59aqcNTQv6ZQa6Q",
            attributes: [
                {trait_type: 'Feature', value: 'Vaporwave Pink'},
                {trait_type: 'Style', value: 'Pixelated'},
                {trait_type: 'Background', value: 'Minty Green'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://arweave.net/WnqK6sE32S-8wAn__gLoXQXA8G2F59aqcNTQv6ZQa6Q"
                    }
                ]
            },
            creators: [
                {  // you can add multiple creators
                  address: keypair.publicKey.toBase58(),
                  share: 100
                }
            ]
        })
        console.log(`${uri}`)

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// https://arweave.net/Y6AjlOW7H_vn-jwSc8QcdM0Mgfw_GV-44Q79idSUN-E