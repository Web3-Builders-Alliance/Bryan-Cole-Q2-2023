import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { WbaVault, IDL } from "../target/types/wba_vault";
import { Connection, Keypair, Commitment, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import wallet from "../../../wba-wallet.json"

describe("wba_vault", () => {
  // // We're going to import our keypair from the wallet file
  // const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

  const keypair = Keypair.generate();
  console.log(`${keypair.publicKey}`)

  const vaultState = Keypair.generate()
  console.log(`${vaultState.publicKey}`)

  // Create a Solana local connection
  // const commitment: Commitment = "confirmed";
  // const connection = new Connection("http://localhost:8899/", "confirmed") ;
  const connection = new Connection("http://localhost:8899/");


  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(keypair), { commitment: "finalized" } );

  // //Create a Solana devnet connection
  // const commitment: Commitment = "confirmed";
  // const connection = new Connection("https://api.devnet.solana.com", commitment);
   
  // // anchor program
  // const program = anchor.workspace.WbaVault as Program<WbaVault>;

  // Program address
  const programAddres = new anchor.web3.PublicKey("2nT8HjQ7KkqNycxE6iBYDKNiXmkF7TFzCo8h9tF7st11");

  // Create program
  const program = new Program<WbaVault>(IDL, programAddres, provider);

  // Create vault auth PDA
  const vault_auth_seed = [Buffer.from("vault_auth"), vaultState.publicKey.toBuffer()];
  const vault_auth = PublicKey.findProgramAddressSync(vault_auth_seed, program.programId)[0];

  // create vault system program
  const vault_seed = [Buffer.from("vault"), vault_auth.toBuffer()];
  const vault = PublicKey.findProgramAddressSync(vault_seed, program.programId)[0];

  it("Airdopping tokens", async () => {
    // testing airdrops
    try {
      // We're going to claim 2 devnet SOL tokens
      // const txhash = await connection.requestAirdrop(keypair.publicKey, 1000 * LAMPORTS_PER_SOL);
      const signature = await provider.connection.requestAirdrop(keypair.publicKey, 100*anchor.web3.LAMPORTS_PER_SOL);

      const latestBlockhash = await connection.getLatestBlockhash();

      await provider.connection.confirmTransaction(
        {
          signature,
          ...latestBlockhash,
        },
        "finalized"
        );
        
      console.log(`Success! Check out your TX here: 
      https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
  });

  it("Is initialized!", async () => {
    try {
      const txhash = await program.methods
      .initialize()
      .accounts({
          owner: keypair.publicKey,
          vaultState: vaultState.publicKey,
          vaultAuth: vault_auth,
          vault: vault,
          systemProgram: SystemProgram.programId,
      })
      .signers([
          keypair,
          vaultState
      ]).rpc();
      console.log(`Success! Check out your TX here: 
      https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
  });
});
