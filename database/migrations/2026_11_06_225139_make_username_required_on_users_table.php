<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Հին օգտագործողները, որոնք օգտանուն չունեն, ստանում են user_<id>
        foreach (DB::table('users')->whereNull('username')->pluck('id') as $id) {
            $username = 'user_'.$id;

            while (DB::table('users')->where('username', $username)->exists()) {
                $username .= '_1';
            }

            DB::table('users')->where('id', $id)->update(['username' => $username]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 50)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 50)->nullable()->change();
        });
    }
};
