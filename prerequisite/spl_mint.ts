import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "./wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("62EqfNWAvUtFGrnGFuYY1Ri5xzixDbpEgf98anrgGBdC");

(async () => {
    try {
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
          )
          console.log(tokenAccount.address.toBase58());
          
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            tokenAccount.address,
            keypair,
            100000n * token_decimals // because decimals for the mint are set to 9 
        )
        console.log(`${mintTx}`)
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()