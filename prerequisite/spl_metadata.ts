import { Commitment, Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import wallet from "./wba-wallet.json"
import { createCreateMetadataAccountV2Instruction, createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Define our Mint address
const mint = new PublicKey("62EqfNWAvUtFGrnGFuYY1Ri5xzixDbpEgf98anrgGBdC")

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

// Create PDA for token metadata
const metadata_seeds = [
    Buffer.from('metadata'),
    token_metadata_program_id.toBuffer(),
    mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);

(async () => {
    try {
       const instruction = createCreateMetadataAccountV3Instruction(
        {
            metadata: metadata_pda,
            mint: mint,
            mintAuthority: keypair.publicKey,
            payer: keypair.publicKey,
            updateAuthority: keypair.publicKey
        },
        {
            createMetadataAccountArgsV3: {
                data: {
                name: "KalCoin",
                symbol: "KC",
                uri: "", // symbol/logo
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null
                },
                isMutable: true,
                collectionDetails: null
            },   
        })

        const tx = new Transaction(    
        ).add(instruction)
        
        const txhash = await sendAndConfirmTransaction(
            connection,
            tx,
            [keypair]
        )
        console.log(`${txhash}`)
       
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();