# Carty

A modern Angular 21 ecommerce frontend built with standalone components, reactive forms, signals, and a clean Bootstrap-based UI. Carty covers the full customer shopping flow: browsing products, viewing product details, managing the cart, checking out, placing orders, and updating profile information.

## Overview

Carty is designed as a polished single-page shopping experience connected to a backend API. The app includes authentication, product browsing, cart management, checkout, orders, profile editing, and a product details page with an image gallery and quantity controls.

## Features

- Authentication with login and signup
- Protected main area with route guarding
- Product listing and category filtering
- Product details page with image gallery
- Cart management with quantity controls
- Checkout and payment flow
- Orders page for past purchases
- Profile update page
- Header navigation with dropdown actions
- Notification feedback for user actions
- Shared UI styling with Bootstrap and custom CSS

## Tech Stack

- Angular 21
- TypeScript
- RxJS
- Bootstrap 5
- Bootstrap Icons
- ngx-stripe
- Stripe.js

## Project Structure

```text
src/
  app/
    app.config.ts
    app.routes.ts
    app.css
    components/
      about-us/
      cart/
      chatpot/
      footer/
      header/
      home/
      login/
      main/
      notification/
      orders/
      payment/
      product-card/
      product-details/
      profile/
      signup/
      side-bar/
    guards/
    interceptors/
    models/
    Services/
    Types/
  environment.ts
  index.html
  main.ts
  styles.css
public/
```

## Main Pages

- `Login` and `Signup` for user authentication
- `Home` for product browsing
- `Product Details` for viewing images, pricing, and quantity selection
- `Cart` for order summary and item management
- `Payment` for checkout and payment submission
- `Orders` for viewing previous purchases
- `Profile` for editing user information
- `About Us` for store information

## Getting Started

### Prerequisites

- Node.js installed
- npm installed
- Backend API running on `http://localhost:5000`

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm start
```

Open the app in your browser at the local development URL shown in the terminal.

## Available Scripts

- `npm start` - starts the Angular development server
- `npm run build` - builds the app for production
- `npm run watch` - rebuilds on file changes in development mode
- `npm test` - runs unit tests

## Backend Notes

This frontend expects an API that provides authentication, products, cart, orders, profile update, and payment-related endpoints. The app uses a bearer token stored in `localStorage` and attached through an HTTP interceptor.

## Design Notes

The UI uses a mix of Bootstrap utility classes and custom styles to keep the layout responsive and consistent. Shared styles that are used in multiple components are placed in `src/app/app.css` to avoid duplication.

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Run the app and verify the affected flow.
4. Open a pull request with a clear summary of the change.

## License

This project is provided for educational purposes as part of an Angular ecommerce application.
