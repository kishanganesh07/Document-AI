# Document-AI (DocuFlow) 🤖📝

DocuFlow is a modern, full-stack AI-powered document generation and management workspace. It allows users to write natural language prompts and instantly generate structured documents like **invoices, certificates, offer letters, quotations, reports, and question papers** using Google Gemini.

## Features
- **AI Document Assistant**: Chat naturally to generate, fill, and refine complex documents.
- **Dynamic Field Editor**: Modify AI-extracted fields manually with real-time sync.
- **Live HTML Preview**: View rendered document layouts instantly on the side.
- **Clean Architecture**: Follows MVC structure in the backend with Express, Mongoose, and a clean flattened React/Vite structure in the frontend.

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas URI)
- Gemini API Key

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
