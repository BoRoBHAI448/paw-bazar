<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'image',
    ];

    // Define relationship: A category has many Products
    public function categoryProducts()
    {
        return $this->hasMany(Product::class);
    }
}