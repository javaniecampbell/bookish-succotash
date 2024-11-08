This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Things We Need
- We need a tool that generate the base64 encoded information for each branch
- Generate both a QR Code & Data Matrix Barcode (which will be added to the manual for each branch) with instructions for what to do
- A form will be given on the start up of kiosk if not configured will show the form asking to scan the barcode or qr code generated
- When the code is scanned then it should populate a mask input field
- Then register will be highlighted to configure the kiosk presenting a loading page that redirects you to the tablet default landing page with the branch name now visible
