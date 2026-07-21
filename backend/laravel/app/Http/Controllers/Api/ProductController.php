<?php

namespace App\Http\Controllers\Api;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{public function store(Request $request)
{
    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'price'       => 'required|numeric|min:0',
        'stock'       => 'required|integer|min:0',
        'category'    => 'required|string',
        'description' => 'nullable|string',
        'image'       => 'nullable|string',
    ]);

    // category name diye category_id ber kora, na thakle create kore fela
    $category = Category::firstOrCreate(
        ['name' => $validated['category']],
        ['slug' => Str::slug($validated['category'])]
    );

    $product = Product::create([
        'category_id' => $category->id,
        'name'        => $validated['name'],
        'slug'        => Str::slug($validated['name']) . '-' . uniqid(),
        'description' => $validated['description'] ?? null,
        'price'       => $validated['price'],
        'stock'       => $validated['stock'],
        'image'       => $validated['image'] ?? null,
        'is_active'   => true,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Product created successfully!',
        'data' => $product->load('category')
    ], 201);
}


    // Fetch all active products
    public function index()
    {
        $products = Product::with('category')->where('is_active', true)->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ], 200);
    }

    // Fetch single product details
    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ], 200);
    }
}