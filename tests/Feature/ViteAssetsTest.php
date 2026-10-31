<?php

namespace Tests\Feature;

use Tests\TestCase;

class ViteAssetsTest extends TestCase
{
    public function test_home_page_no_longer_uses_the_old_css_file(): void
    {
        $this->withoutVite();

        $this->get('/')
            ->assertOk()
            ->assertDontSee('css/app.css?v=', false);
    }
}
