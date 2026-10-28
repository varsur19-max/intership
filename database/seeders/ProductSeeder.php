<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@gmail.com'],
            [
                'id' => 1,
                'name' => 'admin',
                'username' => 'admin',
                'password' => Hash::make('admin'),
                'role' => 'admin',
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'user@gmail.com'],
            [
                'id' => 2,
                'name' => 'user',
                'username' => 'user',
                'password' => Hash::make('user'),
                'role' => 'user'
            ]
        );

        $user = DB::table('users')
            ->where('email', 'admin@gmail.com')
            ->first();

        DB::table('products')->updateOrInsert(
            ['id' => 1],
            [
                'name' => 'test product1',
                'description' => 'test product1',
                'price' => 1,
                'stock' => 1,
                'image' => 'products/mlfC9Hycs3Msf66xLh4zcaAzOdZ0r2cxZt8hMCTw.jpg',
                'category_id' => null,
                'sort_order' => 0,
                'user_id' => $user->id,
            ]
        );
    }
}
