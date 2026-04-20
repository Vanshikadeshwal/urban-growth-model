# Urban Growth Intelligence — Predictive Real Estate Model
### Assignment: Problem Statement 3 — Predictive Urban Growth Modeling

---

## What This App Does

This is a fully functional Predictive Geospatial Analytics Engine built for real estate investment intelligence. It:

- Calculates a **Growth Velocity Score (GVS)** for each urban zone using 4 data streams
- Tracks **municipal declarations** (tenders, CLU changes, infrastructure projects)
- Projects **24 / 36 / 60 month price appreciation** with compound interest modeling
- Detects **undervalued zones** using rental yield vs appreciation scatter analysis
- Allows **live data ingestion** — add new zones or tenders at runtime
- Supports **3 cities**: Delhi NCR, Mumbai MMR, Bangalore

---

## File Structure

```
urban-growth-model/
├── index.html          ← Main app entry point
├── vercel.json         ← Deployment config for Vercel
├── css/
│   └── style.css       ← All styling
├── js/
│   ├── model.js        ← GVS calculation engine & data logic
│   ├── charts.js       ← Chart.js rendering (projection, yield scatter)
│   └── app.js          ← UI rendering, tab navigation, data ingest
└── data/
    └── zones.js        ← Zone dataset + city data
```

---

## Step-by-Step: Run Locally

1. Download/unzip the project folder
2. Open `index.html` directly in your browser (Chrome or Firefox)
3. No server needed — it's pure HTML/CSS/JS

---

## Step-by-Step: Deploy to Vercel (Free Live Link)

### Step 1 — Create a GitHub Account
Go to https://github.com and sign up (free).

### Step 2 — Create a New Repository
1. Click the **+** button → **New repository**
2. Name it: `urban-growth-model`
3. Set to **Public**
4. Click **Create repository**

### Step 3 — Upload Your Files
1. Click **uploading an existing file** on the repository page
2. Drag and drop ALL files and folders:
   - `index.html`
   - `vercel.json`
   - `css/` folder
   - `js/` folder
   - `data/` folder
3. Click **Commit changes**

### Step 4 — Deploy on Vercel
1. Go to https://vercel.com
2. Click **Sign Up** → choose **Continue with GitHub**
3. Click **New Project**
4. Select your `urban-growth-model` repository
5. Leave all settings as default
6. Click **Deploy**

### Step 5 — Get Your Link
After ~30 seconds, Vercel gives you a live link like:
```
https://urban-growth-model.vercel.app
```
Share this link for your assignment submission!

---

## How the GVS Model Works

```
GVS = (Municipal Score × 0.35)
    + (Pricing Velocity × 0.25)
    + (Listing Density × 0.20)
    + (Rental Absorption × 0.20)
```

| GVS Range | Grade    | Meaning                          |
|-----------|----------|----------------------------------|
| 80–100    | Prime    | Invest immediately               |
| 70–79     | Emerging | Strong opportunity, 24–36 months |
| 60–69     | Moderate | Monitor closely, 36–48 months    |
| < 60      | Watch    | Not ready yet, 48–60 months      |

---

## How to Add Real Data

Edit `data/zones.js` to replace the simulated data with real values:

```javascript
{ 
  name: 'Your Zone Name',
  muni: 80,          // Score 0-100: How many municipal declarations/tenders exist
  listing: 65,       // Score 0-100: Listing density from 99acres/MagicBricks
  pricing: 72,       // Score 0-100: Price appreciation velocity (normalized)
  rental: 68,        // Score 0-100: Rental absorption rate
  yield: 4.2,        // Actual rental yield percentage
  appreciation: 9.5  // Actual YoY price appreciation percentage
}
```

---

## Data Sources (for real deployment)

| Data Stream | Where to get it |
|---|---|
| Municipal Declarations | MCD / DDA / NCRPB official portals |
| Listing Density | 99acres.com, MagicBricks APIs |
| Pricing Velocity | NHB RESIDEX, PropEquity |
| Rental Absorption | NoBroker, Housing.com portals |

---

Built for: Company Assignment — Problem Statement 3
Model: Predictive Urban Growth Intelligence Engine
