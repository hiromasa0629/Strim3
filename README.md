# Strim3

A p2p streaming platform utilizing decentralised technologies, Huddle01 and NFT.storage.

Anyone would be able to create a room and start a stream and share his roomId so others could join. Like twitch, **Strim3** provides the ability to record/clip the stream.

At the end of the stream, host could mint the whole stream as NFT and all the clips that were minted during the stream were all linked to the host's stream. This way, host/streamer could see how many clips were there and who clipped them. It also could provides an income to the host if the clips were traded.

Besides stream, there _will_ be also p2p chat service that is communicated through p2p.

---

This project is being developed while participating in **ETHGlobal HackFS 2023** and unfortunately is not as complete as I wanted to due to some unforeseen circumstances during the hackathon period.

Here are some features that already implemented:

- Huddle01 SDK
  - Create/Join room
  - Room title/description
  - Fetch/Produce/Stop Video and Audio
- Able to record the stream using `MediaRecorder()` and could be used to mint as NFT
- Has a working ERC721 smart contract that tracks each clips to host stream.

Here are the features that I planned to implement but did not:

- Integrate the ERC721 smart contract into the app
- Upload the recorded stream/clips to IPFS using NFT.storage
- Token gated
- Pages to list all owned stream/clips

---

1. To start, npm install in 3 times in each different directory.

```bash
# /
npm install
# app/
npm install
# backend
npm install
```

2. Follow the env examples in each directory
3. Run the local hardhat blockchain

```bash
# /
npx hardhat node
```

4. Start the backend

```bash
# backend/
npm run start:dev
```

5. Start the frontend

```bash
# app/
npm run dev
```
