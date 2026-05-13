# AGENTS.md

## Project Overview
โปรเจกต์นี้เป็นเว็บแอป Next.js ใช้ TypeScript, Tailwind CSS, Prisma และ SQLite สำหรับทำ resume 

## Commands
- Install dependencies: pnpm install
- Start dev server: pnpm dev
- Run lint: pnpm lint
- Run build: pnpm build
- Run Prisma migration: pnpm prisma migrate dev

## Project Structure
- app/ ใช้สำหรับ routes และ pages ตาม Next.js App Router
- components/ ใช้เก็บ UI components
- lib/ ใช้เก็บ utility functions และ database client
- prisma/ ใช้เก็บ schema และ migration files

## Code Style
- ใช้ TypeScript เท่านั้น
- ตั้งชื่อ component เป็น PascalCase
- ตั้งชื่อ function เป็น camelCase
- ใช้ Tailwind CSS สำหรับ styling
- หลีกเลี่ยงการเขียน logic ใหญ่ๆ รวมไว้ใน component เดียว

## Testing and Validation
ก่อนส่งงานต้องตรวจสอบ:
- pnpm lint
- pnpm build
- ตรวจสอบว่าไม่มี TypeScript error

## Boundaries
- ห้ามแก้ database schema โดยไม่อธิบายเหตุผล
- ห้ามลบไฟล์สำคัญโดยไม่แจ้งก่อน
- ห้ามเปลี่ยน package manager จาก pnpm เป็น npm
- ถ้าไม่แน่ใจ ให้ถามหรือเสนอ plan ก่อนแก้