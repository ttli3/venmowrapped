# Venmo Wrapped

Your year in payments, unwrapped. A beautiful, insightful summary of your Venmo transactions. View prod version at https://www.venmowrapped.com/

## Features

- 📊 Transaction Analysis: Deep insights into your payment patterns
- 🔒 Privacy-First: All processing happens client-side
- 📱 Shareable Stories: Generate Instagram-style stories from your insights
- ✨ Modern UI: Clean, responsive design built with Next.js 13
- 🎨 Interactive Visualizations: Engaging data presentation

## Tech Stack

Next.js 13, TypeScript, Tailwind CSS

## Self-Host Setup

1. Clone the repository:
```bash
git clone https://github.com/ttli3/venmowrapped.git
cd venmowrapped
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Use

1. Download your Venmo transaction history (CSV) from Venmo.com
   [https://id.venmo.com/signin?country.x=US&locale.x=en&ctxId=AAHWOMeoSzmlyeyCfLGFjHN5qBw0bDAPnCs8KzBKLvKYJHSF21whFWY4DAA4cw1i6p4fz_y8w7jbX7nVpKUzWD8=]
   Use this customized link to download full-year data (Venmo only allows for 1 month download at once)
3. Visit Venmo Wrapped and upload your CSV
4. View your personalized insights and stories
5. Share your stories with friends

## Privacy

All transaction processing happens in your browser. No transaction data is stored on servers or streamed anywhere outside of your setup.

## Contributing

Feel free to open issues/Pull requests or simply provide any feedback to venmowrapped@gmail.com!
