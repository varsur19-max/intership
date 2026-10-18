<!DOCTYPE html>
<html lang="hy">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#173f35">
    <title>Intership · Catalog</title>
    <link rel="icon" href="data:,">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}?v={{ filemtime(public_path('css/app.css')) }}">
    <script>
        const englishTranslations = {{ Illuminate\Support\Js::from(json_decode(file_get_contents(lang_path('en.json')), true, 512, JSON_THROW_ON_ERROR)) }};
    </script>
    @foreach (['language', 'common', 'drag-drop', 'auth', 'products', 'menu', 'app'] as $script)
        <script src="{{ asset('js/'.$script.'.js') }}?v={{ filemtime(public_path('js/'.$script.'.js')) }}" defer></script>
    @endforeach
</head>
<body>
    <div class="page-shell">
        <header class="site-header">
            <a class="brand" href="{{ route('home') }}" aria-label="Intership"><span class="brand-mark" aria-hidden="true">i.</span>intership<span class="brand-dot">®</span></a>
            <div id="language-switcher" aria-label="Language"></div>
        </header>
        <nav id="navigation" aria-label="Navigation"></nav>
        <section class="hero" aria-labelledby="hero-title">
            <div class="hero-copy">
                <span class="hero-label"><span aria-hidden="true"></span> INTERSHIP / COLLECTION</span>
                <h1 id="hero-title" data-i18n="Հավաքիր՝ քո ձևով։">Հավաքիր՝ քո ձևով։</h1>
                <p data-i18n="Բացահայտիր, ավելացրու և կազմակերպիր ապրանքները մեկ տեղում։">Բացահայտիր, ավելացրու և կազմակերպիր ապրանքները մեկ տեղում։</p>
            </div>
            <div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="art-tile tile-one">↗</div><div class="art-tile tile-two">✳</div><span class="art-caption">CREATED BY YOU</span></div>
        </section>
        <div class="workspace">
            <aside class="sidebar"><p class="eyebrow">EXPLORE</p><h2 data-i18n="Կատեգորիաներ">Կատեգորիաներ</h2><div id="category-menu"></div><span class="sidebar-bottom" aria-hidden="true">A PLACE FOR EVERYTHING. ↗</span></aside>
            <div class="main-panel"><p id="message" role="alert" aria-live="polite"></p><main id="content" tabindex="-1"></main></div>
        </div>
        <footer><span>intership<span class="brand-dot">®</span></span><span data-i18n="Քո տարածքը։ Քո ընտրությունը։">Քո տարածքը։ Քո ընտրությունը։</span><span>MADE TO ORGANIZE ↗</span></footer>
    </div>
</body>
</html>
