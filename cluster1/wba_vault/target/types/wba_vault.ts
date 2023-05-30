export type WbaVault = {
  "version": "0.1.0",
  "name": "wba_vault",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultAuth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "vaultState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "authBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          },
          {
            "name": "score",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

export const IDL: WbaVault = {
  "version": "0.1.0",
  "name": "wba_vault",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultAuth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "vaultState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "authBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          },
          {
            "name": "score",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
