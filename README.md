# LuxeMarket - Premium E-commerce Platform

![LuxeMarket Banner](/public/curated-luxury.png)

LuxeMarket is a sophisticated e-commerce platform built with Next.js, offering a premium shopping experience with a focus on quality products and seamless user interactions.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)

## Features

### User Experience

- **Responsive Design**: Fully responsive across all device sizes
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Animations**: Smooth transitions and micro-interactions using Framer Motion
- **Offline Support**: Service worker implementation for offline functionality

### Shopping Experience

- **Product Browsing**: Filter and sort products by category, price, rating, etc.
- **Product Details**: Detailed product views with image gallery and specifications
- **Search Functionality**: Search products by name, category, or description
- **Drag and Drop**: Intuitive drag-and-drop interface for adding products to cart

### User Management

- **Authentication**: Secure user authentication with Clerk
- **User Profiles**: Customizable user profiles with order history
- **Wishlist**: Save products for later purchase
- **Order Tracking**: Track order status and history

### Cart and Checkout

- **Shopping Cart**: Add, remove, and update quantities
- **Persistent Cart**: Cart state persists across sessions
- **Checkout Process**: Multi-step checkout with form validation
- **Order Confirmation**: Detailed order confirmation with summary

### Additional Features

- **Analytics Dashboard**: User-specific purchase analytics and insights
- **Contact Form**: Interactive contact form with validation
- **About Page**: Company information with team profiles and milestones
- **FAQ Section**: Frequently asked questions with accordion interface

## Tech Stack

- **Framework**: Next.js 15.1.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Chart.js
- **Offline Support**: Service Worker API

## Setup Instructions

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayan471/luxecart.git
   cd luxemarket
   npm i --legacy-peer-deps
   ```
