const products = [
    {
        id: 1,
        name: "Alpine Hiking Boots",
        category: "hiking",
        price: 299.99,
        rating: 4.5,
        reviews: 127,
        image: "images/products/hiking-boots.jpg",
        description: "Waterproof hiking boots with ankle support and durable sole. Good for wet and muddy trails.",
        inStock: true,
        models: ["Men's US 8", "Men's US 9", "Men's US 10", "Men's US 11", "Women's US 7", "Women's US 8"]
    },
    {
        id: 2,
        name: "Kiwi 65L Backpack",
        category: "hiking",
        price: 249.99,
        rating: 4.8,
        reviews: 89,
        image: "images/products/backpack.jpg",
        description: "65-litre backpack with padded straps and ventilated back panel. Suitable for multi-day hikes.",
        inStock: true,
        models: ["Small", "Medium", "Large"]
    },
    {
        id: 3,
        name: "3-Person Tent",
        category: "camping",
        price: 449.99,
        rating: 4.7,
        reviews: 63,
        image: "images/products/tent.jpg",
        description: "3-person tent with double-wall construction. Has good ventilation and weather protection.",
        inStock: true,
        models: ["Standard", "Extended Vestibule"]
    },
    {
        id: 4,
        name: "Sleeping Bag",
        category: "camping",
        price: 189.99,
        rating: 4.6,
        reviews: 104,
        image: "images/products/sleeping-bag.jpg",
        description: "Down sleeping bag rated to -10°C. Lightweight and packs down small for easy transport.",
        inStock: true,
        models: ["Regular", "Long", "Extra Long"]
    },
    {
        id: 5,
        name: "Waterproof Jacket",
        category: "clothing",
        price: 329.99,
        rating: 4.9,
        reviews: 156,
        image: "images/products/jacket.jpg",
        description: "Waterproof jacket with sealed seams and adjustable hood. Has ventilation zips under arms.",
        inStock: true,
        models: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
        id: 6,
        name: "Camp Stove",
        category: "camping",
        price: 129.99,
        rating: 4.4,
        reviews: 78,
        image: "images/products/stove.jpg",
        description: "Portable camping stove with windshield. Boils water quickly for cooking meals on the trail.",
        inStock: true,
        models: ["Single Burner", "Double Burner"]
    },
    {
        id: 7,
        name: "Trekking Poles (Pair)",
        category: "hiking",
        price: 149.99,
        rating: 4.5,
        reviews: 92,
        image: "images/products/trekking-poles.jpg",
        description: "Adjustable aluminum poles with shock absorption. Useful for steep trails and river crossings.",
        inStock: true,
        models: ["Standard", "Carbon Fiber Upgrade"]
    },
    {
        id: 8,
        name: "Safety Climbing Harness",
        category: "climbing",
        price: 179.99,
        rating: 4.8,
        reviews: 45,
        image: "images/products/harness.jpg",
        description: "Climbing harness with gear loops and adjustable leg straps.",
        inStock: true,
        models: ["Small", "Medium", "Large"]
    },
    {
        id: 9,
        name: "Kayak Paddle",
        category: "watersports",
        price: 219.99,
        rating: 4.6,
        reviews: 34,
        image: "images/products/paddle.jpg",
        description: "Lightweight kayak paddle with shaped blade. Good for touring in coastal waters.",
        inStock: true,
        models: ["210cm", "220cm", "230cm"]
    },
    {
        id: 10,
        name: "Hydration Pack 3L",
        category: "hiking",
        price: 89.99,
        rating: 4.3,
        reviews: 118,
        image: "images/products/hydration-pack.jpg",
        description: "Small backpack with 3-litre water reservoir. Good for day hikes and mountain biking.",
        inStock: true,
        models: ["Standard"]
    },
    {
        id: 11,
        name: "All-Terrain Hiking Sandals",
        category: "footwear",
        price: 119.99,
        rating: 4.4,
        reviews: 87,
        image: "images/products/sandals.jpg",
        description: "Hiking sandals with elastic straps and grippy sole. Suitable for stream crossings and warm weather.",
        inStock: true,
        models: ["Men's US 8", "Men's US 9", "Men's US 10", "Women's US 7", "Women's US 8"]
    },
    {
        id: 12,
        name: "Portable Solar Charger",
        category: "electronics",
        price: 159.99,
        rating: 4.2,
        reviews: 56,
        image: "images/products/solar-charger.jpg",
        description: "20W solar panel with USB ports. Lightweigh for easy carrying and can charge devices on trips.",
        inStock: true,
        models: ["20W", "30W"]
    }
];

const categories = [
    {
        id: "hiking",
        name: "Hiking & Tramping",
        image: "images/categories/hiking.jpg",
        description: "Gear for exploring New Zealand's legendary tracks"
    },
    {
        id: "camping",
        name: "Camping",
        image: "images/categories/camping.jpg",
        description: "Everything you need for nights under the Southern Cross"
    },
    {
        id: "climbing",
        name: "Climbing",
        image: "images/categories/climbing.jpg",
        description: "Equipment for scaling NZ's mountains and crags"
    },
    {
        id: "watersports",
        name: "Water Sports",
        image: "images/categories/watersports.jpg",
        description: "Gear for kayaking, paddling and aquatic adventures"
    }
];

function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

function getFeaturedProducts() {
    return products.slice(0, 6);
}

function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, categories, getProductById, getProductsByCategory, getFeaturedProducts, searchProducts };
}