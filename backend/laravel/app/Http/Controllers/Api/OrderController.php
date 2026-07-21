<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Place a new order
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'phone' => 'required|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        // Total price calculate
        $totalAmount = 0;
        foreach ($request->items as $item) {
            $totalAmount += $item['price'] * $item['quantity'];
        }

        // Create Order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'total_amount' => $totalAmount,
            'shipping_address' => $request->shipping_address,
            'phone' => $request->phone,
            'status' => 'pending',
        ]);

        // Create Order Items
        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully!',
            'order' => $order->load('items.product')
        ], 201);
    }

    // Get Logged-in user's order history
    public function index(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }
}