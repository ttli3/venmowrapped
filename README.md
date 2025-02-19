# Venmo Wrapped

Your year in payments, unwrapped. A beautiful, insightful summary of your Venmo transactions. View prod version at https://www.venmowrapped.com/

## Features

- 📊 Transaction Analysis: Deep insights into your payment patterns
- 🔒 Privacy-First: All processing happens client-side
- 📱 Shareable Stories: Generate Instagram-style stories from your insights
- ✨ Modern UI: Clean, responsive design built with Next.js 13
- 🎨 Interactive Visualizations: Engaging data presentation

## Tech Stack

- Frontend: Next.js 13, TypeScript, Tailwind CSS
- Data Processing: Python
- Storage: Redis (optional)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/ttli3/venmowrapped.git
cd venmowrapped
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Use

1. Download your Venmo transaction history (CSV) from Venmo.com
2. Visit Venmo Wrapped and upload your CSV
3. View your personalized insights and stories
4. Share your stories with friends

## Privacy

Your privacy is our priority. All transaction processing happens in your browser. No transaction data is stored on our servers.

## Contributing

Feel free to open issues and pull requests!
