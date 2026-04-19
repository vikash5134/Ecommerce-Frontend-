# E-commerce Frontend

Modern, production-grade e-commerce frontend built with React 19, Vite 7, Tailwind CSS, and Zustand.

## Features

- **Modern UI/UX**: Amazon/Shopify-inspired design with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first approach, works on all devices
- **State Management**: Zustand for global state (auth, cart, theme)
- **API Integration**: Axios with interceptors for JWT authentication
- **Product Features**:
  - Advanced filtering and search
  - Product detail pages with image gallery
  - Star ratings and reviews
  - Category filtering
  - Price sorting
- **Shopping Cart**: Real-time cart management
- **Checkout Flow**: Streamlined checkout process
- **Order History**: Track all orders
- **Admin Dashboard**: Statistics and order management
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton loaders for better UX
- **Protected Routes**: Role-based access control

## Tech Stack

- **React 19.2.0** - UI library
- **Vite 7.3.1** - Build tool & dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Zustand 4.5** - State management
- **Axios 1.6** - HTTP client with interceptors
- **React Icons 5.0** - Icon library

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The frontend connects to the backend API at `http://localhost:5000` by default. Update `src/lib/axios.js` if your backend runs on a different port.

### 3. Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation with search, cart, user menu
│   │   ├── Footer.jsx           # Footer component
│   │   ├── ProductCard.jsx      # Product card component
│   │   ├── LoadingSkeleton.jsx  # Loading skeleton
│   │   ├── Toast.jsx            # Toast notifications
│   │   ├── Breadcrumb.jsx       # Breadcrumb navigation
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── pages/
│   │   ├── Home.jsx             # Homepage with hero & featured products
│   │   ├── Products.jsx         # Product listing with filters
│   │   ├── ProductDetail.jsx    # Product detail page
│   │   ├── Cart.jsx             # Shopping cart
│   │   ├── Checkout.jsx         # Checkout page
│   │   ├── Orders.jsx           # Order history
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx         # Registration page
│   │   └── Dashboard.jsx        # Admin dashboard
│   ├── store/
│   │   ├── authStore.js         # Authentication state
│   │   ├── cartStore.js         # Cart state
│   │   └── themeStore.js        # Theme state
│   ├── lib/
│   │   └── axios.js             # Axios instance with interceptors
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles with Tailwind
├── public/
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Key Features Explained

### State Management with Zustand

Three stores manage global state:

1. **authStore**: User authentication, login, register, logout
2. **cartStore**: Cart operations, add/remove items, quantities
3. **themeStore**: Dark/light mode toggle with persistence

### Axios Interceptors

- Automatically adds JWT token to requests
- Handles 401 errors and redirects to login
- Centralized error handling

### Tailwind CSS

- Custom color palette with primary colors
- Dark mode support with `dark:` variants
- Reusable component classes (btn-primary, input-field, card)
- Custom animations (fade-in, slide-up)
- Responsive breakpoints (sm, md, lg, xl)

### Protected Routes

Routes are protected based on authentication and role:
- `/cart`, `/checkout`, `/orders` - Require authentication
- `/admin/dashboard` - Require admin role

### Toast Notifications

User feedback for actions:
- Success: Green toast
- Error: Red toast
- Warning: Yellow toast

## Demo Accounts

After seeding the backend database:

- **Admin**: admin@example.com / admin123
- **User**: john@example.com / john123

## Pages Overview

### Home
- Hero section with CTA
- Feature highlights (shipping, security, returns)
- Featured products grid

### Products
- Search functionality
- Category filters
- Price sorting
- Pagination
- Responsive grid layout

### Product Detail
- Large product image
- Product information
- Quantity selector
- Add to cart
- Reviews section

### Cart
- Item list with images
- Quantity adjustment
- Remove items
- Order summary
- Proceed to checkout

### Checkout
- Shipping address form
- Payment method selection
- Order summary
- Place order

### Orders
- Order history
- Order status tracking
- Order details

### Admin Dashboard
- Statistics cards (orders, revenue, products, users)
- Recent orders table
- Order status management

## Customization

### Colors

Edit `tailwind.config.js` to change the primary color palette:

```js
colors: {
  primary: {
    // Your custom colors
  }
}
```

### API Endpoint

Update `src/lib/axios.js`:

```js
const api = axios.create({
  baseURL: 'YOUR_API_URL',
});
```

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of images
- Skeleton loaders for perceived performance
- Optimized re-renders with Zustand
- Tailwind CSS purging for smaller bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
"# Ecommerce-Frontend" 
