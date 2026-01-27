# Dream Pack - Vue 3 E-commerce App

A modern, fully-functional e-commerce frontend application built with Vue 3, featuring a clean marketplace design for packaging materials. The app works with mock data by default and is structured to easily switch to a real Laravel API backend.

## 🚀 Features

- **Modern Tech Stack**: Vue 3 + Composition API + Vite + TypeScript
- **State Management**: Pinia stores for auth, products, cart, and orders
- **Styling**: TailwindCSS with custom design system
- **Routing**: Vue Router with authentication guards
- **API Ready**: Axios client prepared for Laravel Sanctum integration
- **Mock Data**: 30+ products with full e-commerce functionality
- **Responsive Design**: Mobile-first, responsive layout
- **Toast Notifications**: User-friendly feedback system

## 📱 Pages & Routes

- **/ (Home)**: Hero banner + featured products + categories
- **/shop**: Product listing with search, filters, and pagination
- **/product/:id**: Product details with image gallery
- **/cart**: Shopping cart with quantity controls
- **/checkout**: Shipping form + order summary
- **/login & /register**: Authentication pages
- **/account**: User profile management
- **/orders**: Order history and tracking

## 🛠 Tech Stack

### Core Framework
- **Vue 3** with Composition API
- **Vite** for fast development
- **TypeScript** for type safety

### State & Routing
- **Pinia** for state management
- **Vue Router** with route guards

### UI & Styling
- **TailwindCSS** for utility-first styling
- **Custom components** for reusability

### Data & API
- **Axios** for HTTP requests
- **Mock data** for development
- **Laravel Sanctum** ready authentication

## 📦 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.vue
│   ├── Toast.vue
│   ├── ProductCard.vue
│   ├── CategorySidebar.vue
│   └── Pagination.vue
├── pages/             # Page components
│   ├── HomePage.vue
│   ├── ShopPage.vue
│   ├── ProductPage.vue
│   ├── CartPage.vue
│   ├── CheckoutPage.vue
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── AccountPage.vue
│   └── OrdersPage.vue
├── stores/            # Pinia stores
│   ├── auth.ts
│   ├── products.ts
│   ├── cart.ts
│   └── orders.ts
├── services/          # API services
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── productService.ts
│   └── orderService.ts
├── mocks/             # Mock data
│   ├── products.ts
│   ├── categories.ts
│   ├── orders.ts
│   └── users.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── router/            # Vue Router configuration
│   └── index.ts
├── App.vue           # Main application component
└── main.ts           # Application entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and setup**
```bash
git clone <your-repo-url>
cd onlishoping
npm install
```

2. **Environment Configuration**
```bash
# Copy example environment file
cp .env.example .env

# Configure your settings
# VITE_API_BASE_URL=http://localhost:8000  # Your Laravel API URL
# VITE_USE_MOCKS=true                    # Use mock data (true) by default or real API (false)
```

3. **Start Development Server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Demo Account
For testing, use these credentials:
- **Email**: demo@example.com
- **Password**: password

## 🔧 Configuration

### Mock Mode (Default)
The app runs in mock mode by default with 30+ products, categories, and sample orders. No backend required.

### Real API Mode
To connect to your Laravel backend:

1. **Set environment variables**:
```env
VITE_API_BASE_URL=http://your-laravel-api.com
VITE_USE_MOCKS=false
```

2. **Configure Laravel Sanctum**:
- Ensure your Laravel API has Sanctum installed
- Set up CORS for your frontend domain
- Implement authentication endpoints

### Expected Laravel Endpoints

#### Authentication
- `POST /login` - User login
- `POST /register` - User registration  
- `POST /logout` - User logout
- `GET /api/user` - Get current user
- `GET /sanctum/csrf-cookie` - CSRF token

#### Products
- `GET /api/products` - List products (with pagination, filters, search)
- `GET /api/products/{id}` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/categories` - Get categories

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get single order

## 🎨 Features Overview

### Shopping Experience
- **Product Discovery**: Browse, search, and filter products
- **Product Details**: View images, descriptions, ratings, and stock
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout Process**: Shipping information, order summary
- **Order Management**: View order history and status

### User Experience
- **Authentication**: Register and login with email/password
- **Profile Management**: Update user information
- **Responsive Design**: Works seamlessly on all devices
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Smooth loading indicators

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **State Persistence**: Cart and auth data in localStorage
- **Error Handling**: Comprehensive error management
- **Performance**: Optimized components and lazy loading
- **SEO Ready**: Meta tags and semantic HTML

## 🔄 Switching Between Mock and Real API

The app uses the `VITE_USE_MOCKS` environment variable to switch between mock data and real API calls:

### Mock Mode (`VITE_USE_MOCKS=true`)
- Uses local mock data files
- Simulates API latency (300-600ms)
- No backend required
- Perfect for development and demos

### API Mode (`VITE_USE_MOCKS=false`)
- Calls real Laravel API endpoints
- Handles CSRF tokens for Sanctum
- Manages authentication cookies
- Production-ready

## 🎯 Development Notes

### Adding New Features
1. Create types in `src/types/index.ts`
2. Add mock data in `src/mocks/`
3. Create service functions in `src/services/`
4. Update Pinia stores as needed
5. Build UI components

### API Integration
- All API calls go through the centralized `apiClient`
- Services handle both mock and real API modes
- Authentication automatically includes tokens
- Error handling is centralized

### Styling Guidelines
- Use TailwindCSS utility classes
- Follow existing component patterns
- Maintain responsive design
- Use semantic HTML

## 🚀 Production Deployment

### Build the Application
```bash
npm run build
```

### Environment Setup
1. Set `VITE_USE_MOCKS=false`
2. Configure `VITE_API_BASE_URL` to your production API
3. Ensure CORS is properly configured

### Static Hosting
The built app can be deployed to any static hosting service:
- Vercel, Netlify, GitHub Pages
- Nginx, Apache servers
- CDN services

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support:
- Create an issue in the repository
- Check the documentation
- Review the example implementations

---

**Built with ❤️ using Vue 3 and modern web technologies**