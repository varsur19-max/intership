<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Mail\ContactMail;
use Illuminate\Support\Facades\Mail;

class ProjectRegressionTest extends TestCase
{
    use LazilyRefreshDatabase;

    private function product(User $user, array $attributes = []): Product
    {
        return $user->products()->create(array_merge([
            'name' => 'Desk lamp',
            'description' => 'A warm light',
            'price' => '12500.50',
            'stock' => 3,
        ], $attributes));
    }

    private function payload(array $attributes = []): array
    {
        return array_merge([
            'name' => 'New lamp',
            'description' => 'Updated description',
            'price' => '200.20',
            'stock' => 5,
            'category_id' => null
        ], $attributes);
    }

    private function admin(): User
    {
        $user = User::factory()->create();
        $user->role = 'admin';
        $user->save();

        return $user;
    }

    public function test_guest_cannot_create_products(): void
    {
        $this->postJson('/products', $this->payload())->assertUnauthorized();
        $this->assertDatabaseCount('products', 0);
    }

    public function test_guest_html_request_redirects_to_home_instead_of_missing_login_route(): void
    {
        $this->post('/products', $this->payload())->assertRedirect('/');
    }

    public function test_registration_ignores_requested_admin_role(): void
    {
        $this->postJson('/register', [
            'name' => 'Test User',
            'username' => 'test_user',
            'email' => 'test@example.test',
            'password' => 'secure-pass-123',
            'password_confirmation' => 'secure-pass-123',
            'role' => 'admin',
        ])->assertCreated();

        $this->assertDatabaseHas('users', ['username' => 'test_user', 'role' => 'user']);
        $this->assertAuthenticated();
    }

    public function test_long_multibyte_bcrypt_password_returns_validation_error(): void
    {
        $password = str_repeat('ա', 37);
        $this->postJson('/register', [
            'name' => 'Test',
            'username' => 'test_user',
            'email' => 'test@example.test',
            'password' => $password,
            'password_confirmation' => $password,
        ])->assertUnprocessable()->assertJsonValidationErrors(['password'])
            ->assertJsonPath('errors.password.0', 'Գաղտնաբառը չի կարող գերազանցել 72 բայթը։');

        $this->assertDatabaseCount('users', 0);
    }

    public function test_login_and_logout_keep_authentication_contract(): void
    {
        User::factory()->create(['username' => 'member', 'password' => 'password']);
        $this->postJson('/login', ['username' => 'member', 'password' => 'password'])->assertOk();
        $this->getJson('/auth/user')->assertOk()->assertJsonPath('user.username', 'member')
            ->assertJsonMissingPath('user.password')->assertJsonMissingPath('user.email');
        $this->postJson('/logout')->assertOk();
        $this->assertGuest();
    }

    public function test_invalid_login_does_not_authenticate(): void
    {
        User::factory()->create(['username' => 'member']);
        $this->postJson('/login', ['username' => 'member', 'password' => 'wrong'])
            ->assertUnprocessable()->assertJsonValidationErrors(['username']);
        $this->assertGuest();
    }

    public function test_other_user_cannot_edit_delete_or_move_a_product(): void
    {
        $owner = User::factory()->create();
        $product = $this->product($owner);
        $this->actingAs(User::factory()->create());

        $this->putJson('/products/' . $product->id, $this->payload())->assertForbidden();
        $this->patchJson('/products/' . $product->id . '/category', ['category_id' => null])->assertForbidden();
        $this->deleteJson('/products/' . $product->id)->assertForbidden();
        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Desk lamp', 'deleted_at' => null]);
    }

    public function test_created_product_belongs_to_authenticated_user(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $this->actingAs($owner)->postJson('/products', $this->payload(['user_id' => $other->id]))->assertCreated();
        $this->assertDatabaseHas('products', ['name' => 'New lamp', 'user_id' => $owner->id]);
    }

    public function test_product_store_rejects_missing_name(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/products', $this->payload(['name' => '']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);

        $this->assertDatabaseCount('products', 0);
    }

    public function test_product_store_returns_armenian_validation_message(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/products', $this->payload(['name' => '']))
            ->assertJsonValidationErrors(['name' => 'Գրիր ապրանքի անունը։']);
    }

    public function test_owner_update_with_invalid_data_returns_validation_error(): void
    {
        $owner = User::factory()->create();
        $product = $this->product($owner);

        $this->actingAs($owner)
            ->putJson('/products/' . $product->id, $this->payload(['price' => 'abc']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['price']);

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Desk lamp']);
    }

    public function test_other_user_gets_forbidden_even_with_invalid_update_data(): void
    {
        $product = $this->product(User::factory()->create());

        $this->actingAs(User::factory()->create())
            ->putJson('/products/' . $product->id, $this->payload(['name' => '']))
            ->assertForbidden();
    }

    public function test_product_update_without_upload_preserves_image(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('products/old.png', 'old image');
        $owner = User::factory()->create();
        $product = $this->product($owner, ['image' => 'products/old.png']);

        $this->actingAs($owner)->putJson('/products/' . $product->id, $this->payload())->assertOk();
        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'New lamp', 'image' => 'products/old.png']);
        Storage::disk('public')->assertExists('products/old.png');
    }

    public function test_upload_replaces_old_image_after_database_update(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('products/old.png', 'old image');
        $owner = User::factory()->create();
        $product = $this->product($owner, ['image' => 'products/old.png']);

        $this->actingAs($owner)->postJson('/products/' . $product->id, $this->payload([
            '_method' => 'PUT',
            'image' => UploadedFile::fake()->image('lamp.png'),
        ]))->assertOk();

        Storage::disk('public')->assertMissing('products/old.png');
        Storage::disk('public')->assertExists($product->fresh()->image);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'New lamp']);
    }

    public function test_invalid_upload_preserves_existing_product(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('products/old.png', 'old image');
        $owner = User::factory()->create();
        $product = $this->product($owner, ['image' => 'products/old.png']);

        $this->actingAs($owner)->postJson('/products/' . $product->id, $this->payload([
            '_method' => 'PUT',
            'image' => UploadedFile::fake()->create('script.php', 10, 'text/plain'),
        ]))->assertUnprocessable()->assertJsonValidationErrors(['image']);

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Desk lamp', 'image' => 'products/old.png']);
        Storage::disk('public')->assertExists('products/old.png');
    }

    public function test_owner_can_soft_delete_and_public_show_excludes_deleted_products(): void
    {
        $owner = User::factory()->create();
        $product = $this->product($owner);
        $this->actingAs($owner)->deleteJson('/products/' . $product->id)->assertOk();
        $this->assertSoftDeleted($product);
        $this->getJson('/products/' . $product->id)->assertNotFound();
        $this->getJson('/products')->assertJsonPath('total', 0);
    }

    public function test_category_filter_and_pagination_keep_their_contract(): void
    {
        $owner = User::factory()->create();
        $category = MenuItem::create(['title' => 'Lighting', 'parent_id' => null, 'sort_order' => 0]);
        for ($i = 0; $i < 6; $i++) {
            $this->product($owner, ['category_id' => $category->id]);
        }
        $this->product($owner);

        $this->getJson('/products?category_id=' . $category->id . '&page=2')->assertOk()
            ->assertJsonPath('total', 6)->assertJsonPath('current_page', 2)->assertJsonCount(1, 'data');
        $this->getJson('/products?page=-1')->assertUnprocessable()->assertJsonValidationErrors(['page']);
    }

    public function test_parent_category_includes_products_from_all_descendants(): void
    {
        $owner = User::factory()->create();

        $parent = MenuItem::create(['title' => 'Parent', 'parent_id' => null, 'sort_order' => 0]);
        $child = MenuItem::create(['title' => 'Child', 'parent_id' => $parent->id, 'sort_order' => 0]);
        $grandchild = MenuItem::create(['title' => 'Grandchild', 'parent_id' => $child->id, 'sort_order' => 0]);

        $this->product($owner, ['category_id' => $parent->id]);
        $this->product($owner, ['category_id' => $child->id]);
        $this->product($owner, ['category_id' => $grandchild->id]);
        $this->product($owner);

        $this->getJson('/products?category_id=' . $parent->id)
            ->assertOk()
            ->assertJsonPath('total', 3);

        $this->getJson('/products?category_id=' . $child->id)
            ->assertJsonPath('total', 2);

        $this->getJson('/products?category_id=' . $grandchild->id)
            ->assertJsonPath('total', 1);
    }

    public function test_search_filters_products_by_name_and_category(): void
    {
        $owner = User::factory()->create();

        $lighting = MenuItem::create(['title' => 'Lighting', 'parent_id' => null, 'sort_order' => 0]);
        $furniture = MenuItem::create(['title' => 'Furniture', 'parent_id' => null, 'sort_order' => 1]);

        $this->product($owner, ['name' => 'Desk lamp', 'category_id' => $lighting->id]);
        $this->product($owner, ['name' => 'Floor lamp', 'category_id' => $furniture->id]);
        $this->product($owner, ['name' => 'Chair', 'category_id' => $furniture->id]);

        $this->getJson('/products?search=lamp')
            ->assertOk()
            ->assertJsonPath('total', 2);

        $this->getJson('/products?search=LAMP')
            ->assertJsonPath('total', 2);

        $this->getJson('/products?search=lamp&category_id=' . $lighting->id)
            ->assertJsonPath('total', 1)
            ->assertJsonPath('data.0.name', 'Desk lamp');

        $this->getJson('/products?search=zzzz')
            ->assertJsonPath('total', 0);

        $this->getJson('/products?search=' . urlencode('%'))
            ->assertJsonPath('total', 0);
    }

    public function test_search_suggests_only_close_matches(): void
    {
        $owner = User::factory()->create();

        $this->product($owner, ['name' => 'Desk lamp']);
        $this->product($owner, ['name' => 'Chair']);
        $this->product($owner, ['name' => 'Սեղանի լամպ']);

        $this->getJson('/products?search=' . urlencode('Desk lmap'))
            ->assertOk()
            ->assertJsonPath('total', 0)
            ->assertJsonPath('suggestions.0', 'Desk lamp');

        $this->getJson('/products?search=' . urlencode('Սեղանի լամփ'))
            ->assertJsonPath('total', 0)
            ->assertJsonPath('suggestions.0', 'Սեղանի լամպ');

        $this->getJson('/products?search=xqzkwv')
            ->assertJsonPath('total', 0)
            ->assertJsonPath('suggestions', []);

        $this->getJson('/products?search=lamp')
            ->assertJsonPath('suggestions', []);

    }

    public function test_home_page_contains_search_form_and_script(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('id="search-form"', false)
            ->assertSee('id="search-input"', false);
            // ->assertSee('js/search.js', false);
    }

    public function test_regular_user_cannot_manage_categories_or_reorder(): void
    {
        $user = User::factory()->create();
        $product = $this->product($user);
        $category = MenuItem::create(['title' => 'Lighting']);
        $this->actingAs($user);

        $this->postJson('/menu-items', ['title' => 'Blocked', 'parent_id' => null, 'sort_order' => 0])->assertForbidden();
        $this->patchJson('/menu-items/' . $category->id . '/parent', ['parent_id' => null])->assertForbidden();
        $this->deleteJson('/menu-items/' . $category->id)->assertForbidden();
        $this->patchJson('/products/' . $product->id . '/position', ['before_id' => $product->id])->assertForbidden();
        $this->assertModelExists($category);
        $this->assertDatabaseCount('menu_items', 1);
    }

    public function test_category_cannot_move_under_its_descendant(): void
    {
        $parent = MenuItem::create(['title' => 'Parent']);
        $child = MenuItem::create(['title' => 'Child', 'parent_id' => $parent->id]);
        $this->actingAs($this->admin())->patchJson('/menu-items/' . $parent->id . '/parent', ['parent_id' => $child->id])
            ->assertUnprocessable()->assertJsonValidationErrors(['parent_id']);
        $this->assertDatabaseHas('menu_items', ['id' => $parent->id, 'parent_id' => null]);
    }

    public function test_category_move_ignores_stale_title_and_sort_order(): void
    {
        $parent = MenuItem::create(['title' => 'Parent']);
        $child = MenuItem::create(['title' => 'Latest title', 'sort_order' => 7]);
        $this->actingAs($this->admin())->patchJson('/menu-items/' . $child->id . '/parent', [
            'parent_id' => $parent->id,
            'title' => 'Stale title',
            'sort_order' => 0,
        ])->assertOk();
        $this->assertDatabaseHas('menu_items', ['id' => $child->id, 'title' => 'Latest title', 'sort_order' => 7, 'parent_id' => $parent->id]);
    }

    public function test_category_deletion_preserves_products_and_promotes_children(): void
    {
        $parent = MenuItem::create(['title' => 'Parent']);
        $child = MenuItem::create(['title' => 'Child', 'parent_id' => $parent->id]);
        $product = $this->product(User::factory()->create(), ['category_id' => $parent->id]);
        $this->actingAs($this->admin())->deleteJson('/menu-items/' . $parent->id)->assertOk();

        $this->assertDatabaseMissing('menu_items', ['id' => $parent->id]);
        $this->assertDatabaseHas('menu_items', ['id' => $child->id, 'parent_id' => null]);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'category_id' => null, 'deleted_at' => null]);
    }

    public function test_admin_reorder_does_not_mark_products_as_edited(): void
    {
        $this->freezeTime();
        $admin = $this->admin();
        $first = $this->product($admin, ['sort_order' => 1]);
        $second = $this->product($admin, ['sort_order' => 2]);
        $third = $this->product($admin, ['sort_order' => 3]);
        $originalUpdatedAt = $third->updated_at->toDateTimeString();
        $this->travel(1)->hour();

        $this->actingAs($admin)->patchJson('/products/' . $third->id . '/position', ['before_id' => $first->id])->assertOk();
        $this->assertSame([$third->id, $first->id, $second->id], Product::orderBy('sort_order')->pluck('id')->all());
        $this->assertSame($originalUpdatedAt, $third->fresh()->updated_at->toDateTimeString());
    }

    public function test_guest_cannot_send_contact_message(): void
    {
        Mail::fake();

        $this->postJson('/contact', ['message' => 'Hello this is a test.'])
            ->assertUnauthorized();

        Mail::assertNothingSent();
    }

    public function test_user_can_send_contact_message(): void
    {
        Mail::fake();
        config(['services.contact.email' => 'owner@example.test']);
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/contact', ['message' => 'Hello this is a test'])
            ->assertOk();

        Mail::assertSent(ContactMail::class, function (ContactMail $mail) use ($user) {
            return $mail->sender->is($user)
                && $mail->hasTo('owner@example.test');
        });
    }
}
