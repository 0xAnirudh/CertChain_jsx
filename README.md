# CertiChain

CertiChain is a proof-of-concept blockchain-based certificate issuance and verification system. It includes a Node.js/Express backend that maintains a small custom blockchain and a React + Vite frontend to issue, verify, and explore certificates.

## Key Features

- Custom in-memory blockchain with SHA-256 hashing and simple proof-of-work
- Issue verifiable certificates (UUID + QR code + verification URL)
- Frontend UI with Issue / Verify / Chain Explorer tabs (React + Vite)
- REST API for issuing and verifying certificates

## Project Structure

```
CertiChain/
├── backend/
│   ├── blockchain.js        # Block & Blockchain implementation
│   ├── server.js            # Express app and API routes
│   ├── routes/
│   │   └── certificates.js  # /api endpoints
│   ├── data/
│   │   └── blockchain.json  # persisted chain (optional)
│   └── package.json
├── frontend/                # React + Vite app
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # custom hooks
│   │   └── lib/             # API client
│   ├── index.html
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v16+ recommended)
- npm

## Installation & Run (Development)

1. Backend

```bash
cd backend
npm install
npm start       # starts server (default PORT=3000)
```

2. Frontend

```bash
cd frontend
npm install
npm run dev     # starts Vite dev server (usually http://localhost:5173)
```

Open the frontend (Vite) URL in your browser. The frontend communicates with the backend API (default http://localhost:3000).

## API (summary)

- `POST /api/issue` — issue a new certificate. Expects certificate data (studentName, course, issuer, date, grade). Returns the created certificate, QR image data, and verify URL.
- `GET /api/verify/:hash` — verify a certificate by its block hash; returns validity and certificate data.
- `GET /api/chain` — returns the full blockchain data.
- `GET /api/chain/validate` — validates chain integrity and returns a boolean result.

Refer to `backend/routes/certificates.js` for current request/response formats.

---

## REST API Reference

### `POST /api/issue`
Issue a new certificate and add a block to the blockchain.

**Request body example:**

```json
{
	"studentName": "Anirudh Chourey",
	"course": "Information Technology",
	"issuer": "UIETH, PUSSGRC",
	"date": "16-08-2023",
	"grade": "distinction"
}
```

**Response example:**

```json
{
	"success": true,
	"certificate": {
		"certificateId": "uuid-v4",
		"studentName": "Anirudh Chourey",
		"blockHash": "sha256hex...",
		"blockIndex": 1,
		"timestamp": "ISO-8601"
	},
	"qrCode": "data:image/png;base64,...",
	"verifyUrl": "http://localhost:3000/verify/<hash>"
}
```

### `GET /api/verify/:hash`
Verify a certificate by its SHA-256 block hash.

**Response (valid) example:**

```json
{
	"valid": true,
	"status": "VERIFIED",
	"certificate": { "studentName": "...", "course": "..." },
	"chainIntegrity": "INTACT"
}
```

### `GET /api/chain`
Returns the full blockchain (all blocks + stats).

### `GET /api/chain/validate`
Validates the entire blockchain integrity.

```json
{ "valid": true, "stats": { "totalBlocks": 5, "totalCertificates": 4 } }
```

---

## How the Blockchain Works

```
┌─────────────────────────────────┐
│  GENESIS BLOCK (#0)             │
│  hash: 00a3f9bc...              │
│  prevHash: "0"                 │
└────────────────┬────────────────┘
								 │ prevHash links →
┌────────────────▼────────────────┐
│  BLOCK #1  [Certificate]        │
│  student: Anirudh Chourey       │
│  hash: 00b72e1a...              │
│  prevHash: 00a3f9bc...          │
└────────────────┬────────────────┘
								 │
┌────────────────▼────────────────┐
│  BLOCK #2  [Certificate]        │
│  student: Piyush Maurya         │
│  hash: 00c41d88...              │
│  prevHash: 00b72e1a...          │
└─────────────────────────────────┘
```

- Each block's **hash** is computed from: `index + timestamp + certData + previousHash + nonce`
- If anyone modifies a certificate, the hash changes → the next block's `previousHash` no longer matches → **chain invalid**
- Proof-of-work (difficulty=2): hashes must start with `00` to be accepted

---

## Security Design

| Feature | Implementation |
|---|---|
| Immutability | SHA-256 hash of all block data |
| Chain linking | `previousHash` field in every block |
| Tamper detection | `validateChain()` recomputes every hash |
| Proof of work | Mining loop with difficulty prefix |
| QR verification | URL contains the unique block hash |

---

## Using QR Codes

1. Issue a certificate → a QR code is generated
2. The QR encodes: `http://your-domain/verify/<sha256-hash>`
3. Anyone can scan the QR → frontend auto-verifies the certificate
4. No account needed to verify — fully public

---

## Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server |
| `cors` | Cross-origin requests |
| `qrcode` | QR code generation |
| `uuid` | Unique certificate IDs |

---

## Production Deployment

1. Update `BASE_URL` in `frontend/index.html` to your domain
2. Optionally add MongoDB (replace in-memory chain with persistent storage)
3. Add JWT auth for the admin `/issue` endpoint
4. Deploy backend to Railway, Render, or VPS
5. Serve frontend via nginx or Vercel

## Data & Persistence

- The repo includes `backend/data/blockchain.json` which can be used to persist the chain between restarts. By default the blockchain may be kept in memory — check `blockchain.js` and `server.js` for the exact behavior.

## Configuration

- `PORT` — server port (default `3000`)
- Proof-of-work `difficulty` — configured in `blockchain.js`

You can run the backend on a different port:

```bash
PORT=8080 npm start
```

## Development Notes

- Frontend is built with React and Vite. See `frontend/src` for components and hooks.
- Backend is a minimal Express server exposing the API and serving data.

## Next steps / Ideas

- Add persistent storage (MongoDB) to store blocks and certificates
- Add authentication/authorization for issuing certificates
- Add CI, tests, and Docker deployment configs

---

If you'd like, I can also:

- Add a short CONTRIBUTING section
- Create a usage example that issues a certificate via curl
- Commit these changes for you
