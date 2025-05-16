# 🚗 Eco Rydes – Blockchain-Powered Ride Sharing

A decentralized carpooling platform that incentivizes eco-friendly commuting by rewarding both drivers and passengers with **carbon credit tokens (RYD)**. The system leverages **Solana blockchain** to handle payments and token minting, while integrating **real-time ride management** and **on-chain reward distribution**.

---

## 📖 Project Overview

This project addresses urban congestion and carbon emissions by enabling verified users to share rides in a transparent, trust-minimized ecosystem. Here's how it works:

1. **Users** sign up via Google and complete **KYC**.
2. Each user is assigned a **Solana wallet**.
3. **Passengers** top up their wallet with USDC via MoonPay or direct crypto transfer.
4. **Drivers** submit vehicle details and post ride offers.
5. **Passengers** filter and book available rides.
6. At ride time, real-time tracking is handled via **Pusher**.
7. Upon ride completion:
   - **Drivers receive fare**
   - **All users are rewarded with RYD tokens** based on eco-impact metrics.

---

## 🛠️ Monorepo Structure

```

carpool-app/
├── frontend/     # React Native mobile application
├── backend/      # NestJS API with blockchain & database integrations
└── README.md     # Root documentation

````

---

## 🧱 Tech Stack

| Layer        | Tech                      |
| ------------ | ------------------------- |
| Frontend     | React Native              |
| Backend      | NestJS (Node.js + TS)     |
| Database     | MongoDB                   |
| Blockchain   | Solana (USDC, RYD tokens) |
| Real-time    | Pusher (driver tracking)  |
| Auth         | Google OAuth              |
| Fiat On-Ramp | MoonPay                   |

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js ≥ 18
- Yarn or npm
- MongoDB (local or Atlas)
- Solana Wallet & RPC
- Pusher account
- MoonPay account

### 2. Install Dependencies

```bash
cd frontend && yarn install
cd ../backend && yarn install
````

### 3. Environment Configuration

Each subfolder has its own `.env.example`. You must configure:

* MongoDB URI
* Google OAuth keys
* Pusher keys
* MoonPay API keys
* Solana RPC + private key

---

## 🚀 Run the Project

```bash
# Start the backend
cd backend
yarn start:dev

# Start the frontend (Expo)
cd ../frontend
yarn start
```

---

## 🧠 Key Features

* 🚀 Blockchain-based wallet + on-chain transactions
* 🔒 Secure KYC onboarding
* 💸 Crypto and fiat top-up options
* 🚘 Live driver location (via Pusher)
* 🪙 Carbon credit token rewards (RYD)
* 🎯 CO2-saving gamification (coming soon)

---

## 📄 License

MIT © 2025 – Clean Mobility Powered by Blockchain
