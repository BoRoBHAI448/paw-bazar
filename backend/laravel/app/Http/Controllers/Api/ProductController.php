<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
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