<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Fetch all categories
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'success' => true,
            'data' => $categories
        ], 200);
    }

    // Fetch single category with its products
    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category
        ], 200);
    }
}