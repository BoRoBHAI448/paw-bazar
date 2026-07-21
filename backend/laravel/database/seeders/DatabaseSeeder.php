<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ✅ 1. Admin User Create / Update
        User::updateOrCreate(
            ['email' => 'admin@pawbazar.com'],
            [
                'name' => 'Pawbazar Owner',
                'password' => Hash::make('admin123456'),
                'role' => 'admin', // Role must be admin
            ]
        );

        // ✅ 2. Other Seeders
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}