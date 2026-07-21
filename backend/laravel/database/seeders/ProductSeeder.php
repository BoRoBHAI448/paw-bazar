<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $dryFood = Category::where('slug', 'dry-food')->first();
        $wetFood = Category::where('slug', 'wet-food')->first();

        $products = [
            [
                'category_id' => $dryFood?->id ?? 1,
                'name' => 'Whiskas Ocean Fish Dry Cat Food 1.2kg',
                'slug' => Str::slug('Whiskas Ocean Fish Dry Cat Food 1.2kg'),
                'description' => 'Delicious ocean fish flavor dry food for adult cats.',
                'price' => 850.00,
                'stock' => 20,
                'image' => null,
            ],
            [
                'category_id' => $dryFood?->id ?? 1,
                'name' => 'Reflex Plus Adult Cat Food Chicken 1.5kg',
                'slug' => Str::slug('Reflex Plus Adult Cat Food Chicken 1.5kg'),
                'description' => 'Premium quality dry cat food with chicken flavor.',
                'price' => 1250.00,
                'stock' => 15,
                'image' => null,
            ],
            [
                'category_id' => $wetFood?->id ?? 2,
                'name' => 'Me-O Wet Food Tuna Pouch 80g',
                'slug' => Str::slug('Me-O Wet Food Tuna Pouch 80g'),
                'description' => 'Real tuna wet food pouch for cats.',
                'price' => 95.00,
                'stock' => 50,
                'image' => null,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}