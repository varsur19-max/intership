<?php

namespace Database\Seeders;

use Hash;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->updateOrInsert([
            'id' => 1,
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin'),
            'username' => 'admin',
            'role' => 'admin',
        ]);

        DB::table('products')->updateOrInsert([
            'id' => 1,
            'name' => 'test product1',
            'description' => 'test product1',
            'price' => 1,
            'stock' => 1,
            'image' => 'products/mlfC9Hycs3Msf66xLh4zcaAzOdZ0r2cxZt8hMCTw.jpg',
            'category_id' => 1,
            'sort_order' => 0,
            'user_id' => 1,
        ]);
    }
}
