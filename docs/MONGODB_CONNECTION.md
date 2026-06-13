# Fixing "querySrv ECONNREFUSED" / Database Unavailable

## What this error means

- **`querySrv ECONNREFUSED _mongodb._tcp.cluster0....mongodb.net`** means your app **cannot reach MongoDB Atlas** from this machine.
- It is a **network/connectivity** issue, not an application bug. The code is correct; the server cannot talk to the database.

## How to fix it

### 1. Check internet and DNS

- Ensure this machine has internet access.
- Try: `ping cluster0.bcb6bbw.mongodb.net` (or your cluster host). If it fails, your network or DNS is blocking MongoDB.

### 2. MongoDB Atlas Network Access (most common)

- Log in to [MongoDB Atlas](https://cloud.mongodb.com) → your project → **Network Access**.
- Add an IP address:
  - For **local dev**: add your current IP, or use **"Allow Access from Anywhere"** (`0.0.0.0/0`) only for development.
- Wait 1–2 minutes and try again.

### 3. Firewall / VPN / corporate network

- Firewalls or corporate networks often block outbound connections to MongoDB (or to non‑HTTP ports).
- Try from another network (e.g. mobile hotspot) to confirm. If it works there, the issue is your main network.
- Some networks block **SRV DNS** lookups. In that case, in Atlas use **"Connect" → "Drivers"** and choose the **non‑SRV** connection string (standard `mongodb://` with explicit hostnames) and put that in `MONGODB_URI` in `.env.local`.

### 4. Check `.env` / `.env.local`

- `MONGODB_URI` and `DB_NAME` must be set.
- Use the connection string from Atlas (Connect → Drivers → Node.js). Do not commit real credentials to the repo.

## What the app does when the DB is down

- Login shows: **"Database is unavailable. Check your internet connection and try again."**
- Manage-clients and other pages show an error state with a **Try again** button.
- APIs return **503** with a clear message. Once the database is reachable again, things work without code changes.
