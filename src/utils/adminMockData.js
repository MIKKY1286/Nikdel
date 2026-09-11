export const mockProducts = [
  {
    id: "PRD-001",
    name: "Heavy Duty Hammer Drill",
    category: "power-tools",
    price: 120.0,
    stock: 45,
    status: "active",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-10T10:00:00Z"
  },
  {
    id: "PRD-002",
    name: "Premium Roofing Sheet",
    category: "building-materials",
    price: 85.0,
    stock: 12,
    status: "active",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-12T14:30:00Z"
  },
  {
    id: "PRD-003",
    name: "Jubaili Backpack Sprayer",
    category: "agriculture",
    price: 299.99,
    stock: 0,
    status: "out_of_stock",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-15T09:15:00Z"
  },
  {
    id: "PRD-004",
    name: "Value Paint 20L Bucket",
    category: "paints",
    price: 18.50,
    stock: 120,
    status: "active",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-18T11:45:00Z"
  },
  {
    id: "PRD-005",
    name: "Professional Angle Grinder",
    category: "power-tools",
    price: 349.0,
    stock: 8,
    status: "low_stock",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-20T16:20:00Z"
  },
  {
    id: "PRD-006",
    name: "Industrial Cement Mixer",
    category: "building-materials",
    price: 25.0,
    stock: 50,
    status: "active",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-21T10:00:00Z"
  },
  {
    id: "PRD-007",
    name: "Upholstery Leather Roll",
    category: "building-materials",
    price: 60.0,
    stock: 30,
    status: "active",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-22T10:00:00Z"
  },
  {
    id: "PRD-008",
    name: "Heavy Duty Wheelbarrow",
    category: "agriculture",
    price: 45.0,
    stock: 20,
    status: "active",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-23T10:00:00Z"
  },
  {
    id: "PRD-009",
    name: "Top Bond Adhesive Glue",
    category: "paints",
    price: 35.0,
    stock: 40,
    status: "active",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-24T10:00:00Z"
  },
  {
    id: "PRD-010",
    name: "Set of Chair Castors",
    category: "building-materials",
    price: 29.99,
    stock: 100,
    status: "active",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-25T10:00:00Z"
  },
  {
    id: "PRD-011",
    name: "Farm Chemicals Bundle",
    category: "agriculture",
    price: 15.0,
    stock: 200,
    status: "active",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&auto=format&fit=crop",
    dateAdded: "2026-08-25T11:00:00Z"
  }
];

export const mockCategories = [
  { id: "CAT-001", name: "Power Tools", productCount: 156, status: "active", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&auto=format&fit=crop" },
  { id: "CAT-002", name: "Building Materials", productCount: 243, status: "active", image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=200&auto=format&fit=crop" },
  { id: "CAT-003", name: "Agriculture", productCount: 42, status: "active", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&auto=format&fit=crop" },
  { id: "CAT-004", name: "Paints & Finishes", productCount: 89, status: "active", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop" },
  { id: "CAT-005", name: "Hardware & Fasteners", productCount: 112, status: "active", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=200&auto=format&fit=crop" }
];

export const mockCustomers = [
  { id: "CUS-9812", name: "Alice Freeman", email: "alice.f@example.com", totalOrders: 14, totalSpent: 1250.00, status: "active", lastActive: "2026-08-21T08:30:00Z" },
  { id: "CUS-9813", name: "Bob Martin", email: "bmartin22@example.com", totalOrders: 2, totalSpent: 185.50, status: "active", lastActive: "2026-08-19T14:15:00Z" },
  { id: "CUS-9814", name: "Charlie Davis", email: "cdavis@example.com", totalOrders: 0, totalSpent: 0.00, status: "inactive", lastActive: "2026-07-10T09:00:00Z" },
  { id: "CUS-9815", name: "Diana Prince", email: "d.prince@example.com", totalOrders: 8, totalSpent: 940.25, status: "active", lastActive: "2026-08-21T10:45:00Z" },
  { id: "CUS-9816", name: "Evan Wright", email: "evan.w@example.com", totalOrders: 1, totalSpent: 45.00, status: "suspended", lastActive: "2026-05-22T16:20:00Z" }
];

export const mockCoupons = [
  { id: "CPN-101", code: "WELCOME10", type: "percentage", value: 10, usageCount: 452, expiryDate: "2026-12-31", status: "active" },
  { id: "CPN-102", code: "SUMMER50", type: "fixed", value: 50, usageCount: 89, expiryDate: "2026-08-31", status: "active" },
  { id: "CPN-103", code: "FREESHIP", type: "free_shipping", value: 0, usageCount: 1205, expiryDate: "2027-01-01", status: "active" },
  { id: "CPN-104", code: "FLASH20", type: "percentage", value: 20, usageCount: 30, expiryDate: "2026-08-15", status: "expired" }
];

// Helper to load data either from localStorage or fallback to these mocks
export const getAdminData = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(`nikdel_admin_v2_${key}`);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(`Error loading admin data for ${key}`, e);
  }
  return defaultData;
};

export const saveAdminData = (key, data) => {
  localStorage.setItem(`nikdel_admin_v2_${key}`, JSON.stringify(data));
};
