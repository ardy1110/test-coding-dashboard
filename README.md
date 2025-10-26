# Product Dashboard

Dashboard aplikasi manajemen produk yang dibangun dengan Next.js 14, TypeScript, dan Ant Design untuk Technical Test Junior Frontend Developer Position - Summit Global Teknologi.


### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** Ant Design (antd)
- **HTTP Client:** Axios
- **State Management:** React Hooks (useState, useEffect)

### Backend Integration
- **Architecture:** Next.js API Routes sebagai proxy/middleware
- **Flow:** Frontend → Next.js API Routes → External Backend API

## 📁 Project Structure

```
product-dashboard/
├── app/
│   ├── api/                    # API Routes (Proxy Layer)
│   │   ├── products/
│   │   │   └── route.ts       # GET /api/products
│   │   └── product/
│   │       └── route.ts       # GET, POST, PUT, DELETE /api/product
│   ├── products/
│   │   └── page.tsx           # Main products page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (redirect to products)
│   └── globals.css            # Global styles
├── types/
│   └── product.ts             # TypeScript interfaces
├── lib/                       # Utilities
├── components/                # Reusable components
├── .env.local                 # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm atau yarn
- Backend API running (port 8001)

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd product-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup environment variables**
   
   Buat file `.env.local` di root folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8001
   ```

4. **Setup Backend**
   
   Pastikan backend API sudah running di port 8001:
   ```bash
   cd backend-folder
   yarn dev
   # atau
   npm run dev
   ```

5. **Run development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

6. **Open browser**
   
   Akses aplikasi di [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Create Product
1. Click button **"Add New Product"**
2. Isi form:
   - Product Title (required)
   - Price (required, number)
   - Category (optional)
   - Description (optional)
   - Image URL (optional)
3. Click **"Create"**

### Edit Product
1. Click icon **Edit** (✏️) pada row product
2. Update data di form
3. Click **"Update"**

### Delete Product
1. Click icon **Delete** (🗑️) pada row product
2. Confirm deletion di modal
3. Product akan dihapus

### Search Products
1. Ketik keyword di search box
2. Search akan otomatis trigger setelah 300ms (debounce)
3. Results akan filter berdasarkan title, description, atau category

### Pagination
1. Gunakan pagination controls di bawah table
2. Click nomor page atau next/previous
3. Data akan load berdasarkan page yang dipilih
