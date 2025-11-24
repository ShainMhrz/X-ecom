# 🏺 Handcrafted Heritage Store (Portable Edition)

> A scalable E-Commerce platform for traditional handcrafted vessels.
> **Portable Version:** Runs on a local SQLite database (No Docker required).

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)
![Tech](https://img.shields.io/badge/Stack-Next.js_15_%7C_Tailwind_%7C_SQLite-black?style=flat-square)

---

## ✨ Features

*   🛒 **Guest Checkout:** Buy without creating an account.
*   🎨 **Dynamic Themes:** "Earthen" color palette.
*   📦 **Inventory:** Real-time stock tracking.
*   📂 **Zero-Config Database:** Uses a local `dev.db` file.

---

## 🚀 Quick Start Guide

Follow these steps to run the store on your computer.

### 1. Prerequisites
You only need **one thing** installed:
*   [Node.js](https://nodejs.org/) (LTS Version 18 or higher)

### 2. Setup
Open your terminal (Command Prompt or VS Code Terminal) in this folder and run:

```bash
# Install dependencies
npm install
```
### 3. Creating Database
```bash
# 1. Create the 'dev.db' file
npx prisma migrate dev --name init_sqlite

# 2. Add the products (Copper/Brass/Clay Vessels)
npx tsx prisma/seed.ts
```

### 4. Run the website
```bash
npm run dev
```
Open your browser and go to:
👉 http://localhost:3000

# For any Error you can use help of AI 😂😂
