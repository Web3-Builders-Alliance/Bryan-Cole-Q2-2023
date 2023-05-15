import { Connection, Keypair, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { WbaVault, IDL } from "./programs/wba_vault";
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import wallet from "./wba-wallet.json"
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// get vaultstate public key
const vaultstate = new PublicKey("HVXjF8r7cpznWxt9DzcELq1QR7hs79gBrmPTpB2YyxBm")


// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// spl mint for kalcoin
const mint = new PublicKey("62EqfNWAvUtFGrnGFuYY1Ri5xzixDbpEgf98anrgGBdC");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<WbaVault>(IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address, provider);

// Create vault auth PDA
const vault_auth_seed = [Buffer.from("auth"), vaultstate.toBuffer()];
const vault_auth = PublicKey.findProgramAddressSync(vault_auth_seed, program.programId)[0];

// create vault system program
const vault_seed = [Buffer.from("vault"), vault_auth.toBuffer()];
const vault = PublicKey.findProgramAddressSync(vault_seed, program.programId)[0];

// Execute our enrollment transaction
(async () => {
    try {
        const ownerAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
          )
        
          const vaultAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            vault_auth,
            true
          )
        const txhash = await program.methods
        .depositSpl(
            new BN(10)
        )     
        .accounts({
            owner: keypair.publicKey,
            vaultState: vaultstate,
            vaultAuth: vault_auth,
            systemProgram: SystemProgram.programId,
            ownerAta: ownerAta.address,
            vaultAta: vaultAta.address,
            tokenMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID
        })
        .signers([
            keypair
        ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();