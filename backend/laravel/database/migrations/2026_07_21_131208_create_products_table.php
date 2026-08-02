<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        
        // Foreign Key Relation (Category-er sathe Product-er link)
        $table->foreignId('category_id')->constrained()->onDelete('cascade'); 
        
        $table->string('name');                      // Whiskas Adult Chicken
        $table->string('slug')->unique();            // whiskas-adult-chicken
        $table->text('description')->nullable();
        $table->decimal('price', 10, 2);             // 450.00
        $table->integer('stock')->default(0);        // Available stock
        $table->text('image')->nullable();
        $table->boolean('is_active')->default(true); // Active/Inactive
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
