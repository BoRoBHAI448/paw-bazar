<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // ─────────────────────────────────────────
    // Helper: Check if current user is Admin
    // ─────────────────────────────────────────
    private function isAdmin(Request $request): bool
    {
        return $request->user() && $request->user()->role === 'admin';
    }

    // ─────────────────────────────────────────
    // GET /products  (Public — supports ?search= and ?category=)
    // ─────────────────────────────────────────
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        // Search filter: name or description
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm);
            });
        }

        // Category filter: by category name
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->category . '%');
            });
        }

        $products = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $products
        ], 200);
    }

    // ─────────────────────────────────────────
    // GET /products/{id}  (Public)
    // ─────────────────────────────────────────
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
            'data'    => $product
        ], 200);
    }

    // ─────────────────────────────────────────
    // POST /products  (Admin only)
    // ─────────────────────────────────────────
    public function store(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category'    => 'required|string',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
        ]);

        // Category name দিয়ে category_id বের করা; না থাকলে তৈরি
        $category = Category::firstOrCreate(
            ['name' => $validated['category']],
            ['slug' => Str::slug($validated['category'])]
        );

        $product = Product::create([
            'category_id' => $category->id,
            'name'        => $validated['name'],
            'slug'        => Str::limit(Str::slug($validated['name']), 200, '') . '-' . uniqid(),
            'description' => $validated['description'] ?? null,
            'price'       => $validated['price'],
            'stock'       => $validated['stock'],
            'image'       => $validated['image'] ?? null,
            'is_active'   => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully!',
            'data'    => $product->load('category')
        ], 201);
    }

    // ─────────────────────────────────────────
    // PUT /products/{id}  (Admin only)
    // ─────────────────────────────────────────
    public function update(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'price'       => 'sometimes|required|numeric|min:0',
            'stock'       => 'sometimes|required|integer|min:0',
            'category'    => 'sometimes|required|string',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'is_active'   => 'sometimes|boolean',
        ]);

        // Category আপডেট করা যদি নতুন category দেওয়া হয়
        if (!empty($validated['category'])) {
            $category = Category::firstOrCreate(
                ['name' => $validated['category']],
                ['slug' => Str::slug($validated['category'])]
            );
            $product->category_id = $category->id;
            unset($validated['category']);
        }

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully!',
            'data'    => $product->load('category')
        ], 200);
    }

    // ─────────────────────────────────────────
    // DELETE /products/{id}  (Admin only)
    // ─────────────────────────────────────────
    public function destroy(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Soft delete: is_active = false এর বদলে সরাসরি delete
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully!'
        ], 200);
    }
}