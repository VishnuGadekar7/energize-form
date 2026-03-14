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
| `RESEND_API_KEY` | Your Resend.com API Key (see below) |
| `HR_EMAIL` | Recipient email for applications |
| `PORT` | Server port (default: `3000`) |

### 4. Start the server

```bash
node server.js
```

Open **http://localhost:3000** in your browser.

## Resend API Setup (Email)

We use Resend to send emails reliably. You need a free Resend account and an API key.

1. Go to [https://resend.com](https://resend.com) and sign up.
2. In the dashboard, click on **API Keys** in the left sidebar.
3. Click **Create API Key**.
4. Give it a name like `Energize HR Portal` and assign it "Full Access" or "Sending access".
5. Copy the generated API string (e.g., `re_xxxxxxxxx`).
6. Paste it into your `.env` file as `RESEND_API_KEY`.

> ⚠️ **Never** commit your `.env` file to Git. It's already in `.gitignore`.

---

## MongoDB Atlas Setup (Database)

To store applicant data securely, we use MongoDB. You need a free MongoDB Atlas cluster and its connection string.

1. Go to [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database) and sign up/log in.
2. Click **Build a Database** (choose the FREE shared cluster).
3. Once the cluster is created, go to **Database Access** (left sidebar) and create a new database user. Remember the password.
4. Go to **Network Access** (left sidebar) and click **Add IP Address**. Choose **Allow Access from Anywhere** (0.0.0.0/0) so Render can connect to it.
5. Go back to **Database** (left sidebar) and click the **Connect** button on your cluster.
6. Choose **Connect your application** (Drivers).
7. Copy the connection string provided. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
8. Paste it into your `.env` file as `MONGODB_URI`.
9. **CRITICAL:** Replace `<username>` and `<password>` in the connection string with the user credentials you created in Step 3. Add a database name (like `energize_db`) before the `?` if you wish.

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
| `RESEND_API_KEY` | your Resend API key |
| `HR_EMAIL` | hr@yourcompany.com |
| `IS_PRODUCTION` | `true` |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/google-chrome-stable` |
| `MONGODB_URI` | your MongoDB Atlas connection string |

### 4. Deploy

Click **Manual Deploy → Deploy latest commit**. Your app will be live at `https://your-app.onrender.com`.

> 💡 Free tier services spin down after 15 minutes of inactivity. The first request after that may take ~30 seconds.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **PDF Generation:** Puppeteer (HTML → PDF)
- **Email:** Resend API
- **File Upload:** Multer
- **Frontend:** Vanilla HTML / CSS / JS
- **Fonts:** DM Sans, DM Serif Display (Google Fonts)

---

## License

ISC
