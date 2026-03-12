# ENERGIZE — Employment Application Form System

A production-ready Node.js web application that lets candidates fill out a multi-step employment application form online. When submitted, the server generates a professional PDF matching the ENERGIZE application template and emails it to the HR department.

## Features

- 📝 **5-step multi-page form** with validation, photo upload, and dynamic add/remove rows
- 📄 **Automatic PDF generation** — complete 4-page employment application PDF
- 📧 **Email to HR** — PDF attached with an applicant summary email
- 📱 **Mobile responsive** — works on all devices
- 🚀 **Deploy-ready** — configured for Render.com free tier

---

## Folder Structure

```
energize-form/
├── server.js            Express server, routes, multer
├── generatePDF.js       Puppeteer PDF generation
├── pdfTemplate.js       HTML template for the PDF
├── emailSender.js       Nodemailer Gmail SMTP
├── public/
│   └── index.html       Frontend form (HTML/CSS/JS)
├── uploads/             Temp photo storage (auto-created)
├── .env.example         Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/energize-form.git
cd energize-form
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

| Variable | Description |
|---|---|
| `GMAIL_USER` | Your Gmail address (e.g. `hr-portal@gmail.com`) |
| `GMAIL_APP_PASSWORD` | Gmail App Password (see below) |
| `HR_EMAIL` | Recipient email for applications |
| `PORT` | Server port (default: `3000`) |

### 4. Start the server

```bash
node server.js
```

Open **http://localhost:3000** in your browser.

---

## Gmail App Password Setup

You **must** use a Gmail App Password (not your regular password). Here's how:

1. Go to [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Make sure **2-Step Verification** is turned ON
3. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select **"Mail"** as the app and **"Other"** as the device
5. Enter a name like `Energize HR Portal`
6. Click **Generate**
7. Copy the 16-character password (e.g. `abcd efgh ijkl mnop`)
8. Paste it into your `.env` as `GMAIL_APP_PASSWORD`

> ⚠️ **Never** commit your `.env` file to Git. It's already in `.gitignore`.

---

## Changing the HR Recipient Email

Edit the `.env` file and change:

```
HR_EMAIL=new-hr-email@company.com
```

Restart the server for changes to take effect.

---

## Render.com Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/energize-form.git
git push -u origin main
```

### 2. Create a Web Service on Render

1. Go to [https://render.com](https://render.com) and sign in
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Configure:

| Setting | Value |
|---|---|
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Node Version** | `18` or higher |

### 3. Set Environment Variables in Render Dashboard

Go to **Environment** tab and add:

| Key | Value |
|---|---|
| `GMAIL_USER` | your Gmail address |
| `GMAIL_APP_PASSWORD` | your 16-char app password |
| `HR_EMAIL` | hr@yourcompany.com |
| `IS_PRODUCTION` | `true` |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/google-chrome-stable` |

### 4. Deploy

Click **Manual Deploy → Deploy latest commit**. Your app will be live at `https://your-app.onrender.com`.

> 💡 Free tier services spin down after 15 minutes of inactivity. The first request after that may take ~30 seconds.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **PDF Generation:** Puppeteer (HTML → PDF)
- **Email:** Nodemailer with Gmail SMTP
- **File Upload:** Multer
- **Frontend:** Vanilla HTML / CSS / JS
- **Fonts:** DM Sans, DM Serif Display (Google Fonts)

---

## License

ISC
