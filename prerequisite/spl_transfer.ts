import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "./wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("62EqfNWAvUtFGrnGFuYY1Ri5xzixDbpEgf98anrgGBdC");

// Recipient address
const to = new PublicKey("tiosTcRdt9TW7baDB3BLL3LY16w5pP5XsTbeQNZJKjD");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromtokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
          )
          console.log(fromtokenAccount.address.toBase58());

          const totokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
          )
          console.log(totokenAccount.address.toBase58());

        // Transfer the new token to the "toTokenAccount" we just created
          const tx = await transfer(
            connection,
            keypair,
            fromtokenAccount.address,
            totokenAccount.address,
            keypair.publicKey,
            100_000_000  // or 1e8
          )

          console.log(`${tx}`)

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();