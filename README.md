<div align="center">

<img src="frontend/assets/logo_bw.png" alt="CertiChain Logo" width="80" />

# CertiChain

**Tamper-proof certificate issuance and verification — powered by a custom blockchain.**

<br/>

[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Blockchain](https://img.shields.io/badge/Core-Custom%20Blockchain-F7931A?style=flat-square&logo=bitcoin&logoColor=white)](#-blockchain-design)
[![Status](https://img.shields.io/badge/Status-Experimental-orange?style=flat-square)](#)

</div>

---

## ✨ Features

- 🔗 &nbsp;Custom blockchain with SHA-256 hashing and proof-of-work
- 🎓 &nbsp;Issue verifiable certificates stored as immutable blocks
- 📱 &nbsp;QR code generation with embedded verification URL
- 🔍 &nbsp;One-click certificate verification by block hash
- 🧭 &nbsp;Chain Explorer UI to browse the entire blockchain
- 🛡️ &nbsp;Tamper detection via chain integrity validation
- 💾 &nbsp;Optional JSON persistence between server restarts

---

## 🧠 Core Idea

Every certificate is a **block on the chain**. Each block contains the certificate data, a SHA-256 hash of its own contents, and the hash of the block before it — forming an immutable linked sequence. Modifying any certificate breaks the chain hash, making tampering instantly detectable.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Frontend | React, Vite |
| Hashing | SHA-256 (Node.js `crypto`) |
| QR Codes | `qrcode` |
| IDs | `uuid` v4 |
| Persistence | JSON file (optional) |

---

## 📁 Project Structure

```
CertiChain/
├── backend/
│   ├── blockchain.js          # Block & Blockchain core logic
│   ├── server.js              # Express app entry point
│   ├── routes/
│   │   └── certificates.js    # API route handlers
│   └── data/
│       └── blockchain.json    # Optional chain persistence
│
└── frontend/
	├── src/
	│   ├── components/        # UI components (Issue, Verify, Explorer)
	│   ├── hooks/             # Custom React hooks
	│   └── lib/               # API client
	└── index.html
```

---

## ⚙️ Setup

### Prerequisites

- Node.js v16+
- npm

### Backend

```bash
cd backend
npm install
npm start
# Server runs at http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# UI runs at http://localhost:5173
```

> The frontend connects to the backend at `http://localhost:3000` by default.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/issue` | Issue a new certificate |
| `GET` | `/api/verify/:hash` | Verify a certificate by block hash |
| `GET` | `/api/chain` | Fetch full blockchain data |
| `GET` | `/api/chain/validate` | Validate chain integrity |

<details>
<summary><strong>POST /api/issue</strong> — Request & Response</summary>

**Request**
```json
{
  "studentName": "Anirudh Chourey",
  "course": "Information Technology",
  "issuer": "UIETH, PUSSGRC",
  "date": "16-08-2023",
  "grade": "distinction"
}
```

**Response**
```json
{
  "success": true,
  "certificate": {
	"certificateId": "uuid-v4",
	"studentName": "Anirudh Chourey",
	"blockHash": "00b72e1a...",
	"blockIndex": 1,
	"timestamp": "2023-08-16T10:00:00.000Z"
  },
  "qrCode": "data:image/png;base64,...",
  "verifyUrl": "http://localhost:3000/verify/00b72e1a..."
}
```
</details>

<details>
<summary><strong>GET /api/verify/:hash</strong> — Response</summary>

```json
{
  "valid": true,
  "status": "VERIFIED",
  "certificate": {
	"studentName": "Anirudh Chourey",
	"course": "Information Technology"
  },
  "chainIntegrity": "INTACT"
}
```
</details>

---

## 🎬 Demo

<div align="center">

![Demo GIF](frontend/assets/CertChain.gif)

*Issuing a certificate, scanning the QR code, and verifying on-chain — in seconds.*

</div>

---

## 🔍 Example Flow

```
1. Admin fills the Issue form (name, course, issuer, grade, date)
		↓
2. Backend mines a new block and appends it to the chain
		↓
3. A QR code is generated containing the block hash URL
		↓
4. Anyone scans the QR → hits GET /api/verify/:hash
		↓
5. System recomputes hash, checks chain integrity → returns VERIFIED or INVALID
```

---

## ⛓ Blockchain Design

```
┌──────────────────────────┐
│   GENESIS BLOCK  (#0)    │
│   hash:    00a3f9bc...   │
│   prevHash: "0"          │
└────────────┬─────────────┘
			 │
┌────────────▼─────────────┐
│   BLOCK #1               │
│   student: Anirudh       │
│   hash:    00b72e1a...   │
│   prevHash: 00a3f9bc...  │
└────────────┬─────────────┘
			 │
┌────────────▼─────────────┐
│   BLOCK #2               │
│   student: Piyush        │
│   hash:    00c41d88...   │
│   prevHash: 00b72e1a...  │
└──────────────────────────┘
```

- **Hash input:** `index + timestamp + certData + previousHash + nonce`
- **Proof-of-work:** Hash must begin with `00` (difficulty = 2)
- **Tamper detection:** Any mutation breaks subsequent `previousHash` links

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| Immutability | SHA-256 hash over all block data |
| Chain linking | `previousHash` in every block |
| Tamper detection | `validateChain()` recomputes every hash |
| Proof of work | Mining loop with difficulty prefix |
| Public verification | Hash-based URL — no account required |

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server and routing |
| `cors` | Cross-origin request handling |
| `qrcode` | QR code generation |
| `uuid` | Unique certificate identifiers |

---

## 🚀 Production Ideas

- [ ] Swap in-memory chain for **MongoDB** persistence
- [ ] Add **JWT authentication** to protect `/api/issue`
- [ ] Deploy backend on **Railway** or **Render**
- [ ] Serve frontend via **Vercel** or **nginx**
- [ ] Update `BASE_URL` in frontend to your production domain

---

## 💡 Future Improvements

- [ ] Multi-issuer support with role-based access
- [ ] Email delivery of certificates with embedded QR
- [ ] Public certificate registry with search
- [ ] Docker Compose setup for one-command deployment
- [ ] Unit and integration test suite (Jest / Supertest)

---

## 🤝 Contributing

Contributions are welcome. To get started:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feat/your-feature

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push and open a Pull Request
git push origin feat/your-feature
```

Please keep PRs focused and include a short description of the change.

---

## 👨‍💻 Author

<div align="center">

Built with intent by **Anirudh Chourey**

[![GitHub](https://img.shields.io/badge/GitHub-@0xAnirudh-181717?style=flat-square&logo=github)](https://github.com/0xAnirudh)
&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/8055anirudh/)

*If you found this useful, consider giving it a ⭐ — it helps more than you think.*

</div>
