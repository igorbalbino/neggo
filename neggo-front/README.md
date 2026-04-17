# Neggo Marketplace

A modern, chat-first peer-to-peer marketplace platform for products and services.

## Features

- **Multi-language Support**: Full internationalization for Portuguese (pt-BR), Spanish, English, and Guaraní.
- **P2P Chat**: Real-time communication between buyers and sellers powered by Firebase.
- **Offer Management**: Create and manage detailed listings for products and services.
- **Flexible Locations**: Support for local, multiple city, or national coverage for advertisements.
- **User Profiles**: Minimalist profile management with rating system.
- **Boost System**: Visibility boost options for ads to appear at the top of searches.
- **Advanced SEO**: Dynamically optimized meta tags and language attributes for better organic ranking.
- **JWT Authentication**: Secure email and password based session management.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite.
- **Styling**: Tailwind CSS 4.
- **Animations**: Framer Motion.
- **Real-time**: Firebase Firestore & Auth (Live Chat).
- **Icons**: Lucide React.
- **SEO**: React Helmet Async.

## Backend Integration

The frontend is configured to communicate with a decoupled backend API. 
- All data, business logic, and billing are handled server-side.
- Standard response format: `{ success, error, data }`.
- Detailed endpoint documentation can be found in `endpoints_documentation.txt`.

## Getting Started

1. Set up your environment variables as per `.env.example`.
2. Install dependencies: `npm install`.
3. Start development server: `npm run dev`.
4. Build for production: `npm run build`.
