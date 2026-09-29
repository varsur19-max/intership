# Laravel-ի առաջին փոքր քայլը քո intership նախագծում

## 1. Ի՞նչ ենք ավելացրել

Laravel-ը PHP-ով գրված պատրաստի գործիքների հավաքածու է՝ framework։ Այն կարող է կառավարել հասցեները, հարցումները, բազայի աշխատանքը և շատ այլ բաներ։ Սկզբի համար վերցրել ենք միայն պաշտոնական Illuminate բաղադրիչները՝ Router, Request և JsonResponse, և ավելացրել մեկ Controller։

**Սա ամբողջական Laravel հավելված չէ։** Քո գործող PHP նախագիծն է՝ Laravel-ի բաղադրիչների փոքր կիրառությամբ։ Այստեղ չկան Artisan, Eloquent, Blade, migrations, Laravel-ի login համակարգ կամ ավտոմատ Laravel CSRF պաշտպանություն։ Նախկին session-ը, CSRF ստուգումը և իրավունքների ստուգումները շարունակում են աշխատել իրենց ֆայլերում։ Միայն GET ապրանքային ընթերցումն է անցնում նոր Router-ով։

Ընտրված է Illuminate 12.x ճյուղը, որը համատեղելի է նախագծի PHP 8.2/8.3 միջավայրի հետ։ Դա ամենանոր Laravel ճյուղը ներկայացնելու փորձ չէ։ Composer-ի `platform.php = 8.2.0` կարգավորումը օգնում է ընտրել նաև հին Docker միջավայրին համապատասխան կախվածություններ։ Իրական PHP-ի պահանջները ստուգում ենք `composer check-platform-reqs` հրամանով։

## 2. Ի՞նչ է փոխվել՝ ֆայլ առ ֆայլ

| Ֆայլ | Փոփոխություն և պատճառ |
|---|---|
| `composer.json` | Նոր է․ սահմանում է պահանջվող PHP-ն, `mysqli`, `mbstring` և Laravel-ի երկու հիմնական փաթեթները, ինչպես նաև `App` դասերի տեղը։ |
| `routes/api.php` | Նոր է․ ընդամենը երկու հասցե կապում է երկու ֆունկցիայի հետ։ |
| `app/Http/Controllers/ProductController.php` | Նոր է․ ապրանքների ցուցակն ու մեկ ապրանքի դիտումը այստեղ են։ |
| `bootstrap/laravel.php` | Նոր է․ միացնում է Composer-ը, Router-ը և Controller-ին տալիս բազայի կապն ու հարցումը։ |
| `api/index.php` | Երկու GET հարցում ուղարկում է նոր Router-ին։ Մյուս հարցումների ընթացքը պահպանված է։ |
| `index.php` | Cookie-ի `secure` դրոշն այլևս միշտ `true` չէ․ տեղական HTTP-ում մուտքը կարող է պահպանվել, իսկ Railway-ում միացված է։ |
| `Dockerfile` | Ավելացվել են Composer-ը, `php-mbstring`, `php-xml`, `unzip` և կախվածությունների տեղադրումը։ Railway-ի cookie-ն հստակ միացված է։ |
| `.gitignore` | `vendor` և `.env` չեն ուղարկվում Git։ `composer.lock`-ը չի անտեսվում։ |
| `.dockerignore` | Հին տեղական `vendor`, Git պատմություն և `.env` չեն պատճենվում Docker image։ |
| `README_HY.md`, հին `docs/*.md` | Ավելացվել է նշում, որ այս նոր ուղեցույցն առաջնայինն է։ Հին ուղեցույցներում հիշատակված որոշ SQL ֆայլեր այս փաթեթում չկան։ |
| `docs/LARAVEL_HY.md` | Այս մանրամասն բացատրությունն է։ |

`crud/all.php` և `crud/show.php` հին ֆայլերը թողել եմ համեմատելու համար։ Դրանք այլևս չեն կանչվում API router-ից. փոփոխություն անելու տեղը նոր `ProductController.php`-ն է։

`script.js`, `style.css`, `db.php`, `intership.sql`, գրանցումը, մուտքը, ավելացումը, խմբագրումը, ջնջումը, մենյուն և Node proxy-ն չեմ փոխել։ Նոր բազա կամ աղյուսակ պետք չէ։ Ապրանքի հեղինակը, `updated_at`-ը, կատեգորիան և `is_del` պայմանը պահպանված են։

Նոր Controller-ում ID-ն ստուգվում է `filter_var(..., FILTER_VALIDATE_INT)`-ով, առանց regex-ի կամ `ctype_digit`-ի։ Սովորական `1`, `2`, `15` արժեքները ընդունվում են, իսկ `abc`, `1.5`, `0`, բացասականները՝ մերժվում։ Այս ֆիլտրը, ի տարբերություն հին ստուգման, չի ընդունում `01` ձևը. կայքի հղումները սովորական ամբողջ թվեր են ուղարկում։ Բազայի հարցման ձախողումը վերադարձնում է տվյալների սխալ, ոչ թե «Ապրանքներ դեռ չկան»։ Իսկ իրապես դատարկ ցանկը վերադարձնում է `products: []` և 200։

ZIP-ի մեջ Git-ի ներքին պատմությունը չեմ ներառել։ Քո համակարգչի գործող նախագծի `.git` պանակը պահիր։ Սկզբնական ZIP-ում գործող `.osp` ֆայլ չի եղել, նոր OSPanel կարգավորում չեմ հորինել։

## 3. Ինչպե՞ս է հիմա աշխատում հարցումը

Օրինակ՝ բացում ես բոլոր ապրանքները։

1. `script.js`-ը հարցում է ուղարկում `/intership/api/products` հասցեին։
2. Գլխավոր `index.php`-ը հասցեից հանում է `/intership` մասը, սկսում session-ը և միացնում `db.php`-ն։
3. `api/index.php`-ը ստուգում է մեթոդն ու մուտքային տվյալները։
4. Այդ երկու ապրանքային GET հասցեների դեպքում միացվում է `bootstrap/laravel.php`-ն։
5. `routes/api.php`-ում Router-ը գտնում է համապատասխան ֆունկցիան։
6. `ProductController::index()`-ը կարդում է բազան։
7. `JsonResponse`-ը վերադարձնում է JSON, իսկ քո JavaScript-ը ցուցադրում է ապրանքները։

Հասցեները և JSON դաշտերի անունները նույնն են, ուստի ամբողջ frontend-ը վերագրելու կարիք չկա։

## 4. Route. հասցեն կապել ֆունկցիայի հետ

Բացիր `routes/api.php`․

```php
use App\Http\Controllers\ProductController;

$router->get('/api/products', [ProductController::class, 'index']);
$router->get('/api/product', [ProductController::class, 'show']);
```

- `use`-ը թույլ է տալիս կարճ անունով դիմել ուրիշ պանակում սահմանված դասին։ Ֆայլը բեռնում է Composer-ի autoload-ը։
- `$router`-ը հասցեներն ընտրող օբյեկտն է։
- `->get(...)` նշանակում է՝ գրանցել GET հարցման հասցե։ GET-ը այստեղ տվյալներ կարդալու համար է։
- Առաջին տեքստը հասցեն է։ Այստեղ `/intership` չենք գրում, որովհետև այն արդեն հեռացվել է։
- `ProductController::class`-ը PHP-ից ստանում է այդ դասի ամբողջ անունը։
- `'index'`-ը կանչվող ֆունկցիայի անունն է։ Երկրորդ հասցեն կանչում է `'show'`-ը։

Ամբողջական Laravel նախագծում հաճախ կտեսնես `Route::get(...)`։ Մեր փոքր տարբերակում աշխատում ենք անմիջապես նույն պաշտոնական Router բաղադրիչի `$router` օբյեկտով։ Այստեղ Laravel-ի ամբողջ հավելվածը և Facade միջավայրը չեն գործարկվում։

## 5. Controller. ֆունկցիաների մեկ պարզ խումբ

`class ProductController`-ը կարելի է պատկերացնել որպես ապրանքներին վերաբերող ֆունկցիաների մեկ խումբ։ `index`-ը վերադարձնում է ցանկը, իսկ `show`-ը՝ մեկ ապրանքը։

```php
private $db;

public function __construct(mysqli $db)
{
    $this->db = $db;
}
```

- `private $db`-ը այդ օբյեկտի ներսում պահվող բազայի կապն է։
- `public function`-ը ֆունկցիա է, որը դրսից էլ կարելի է կանչել։
- `__construct`-ը հատուկ ֆունկցիա է․ ավտոմատ աշխատում է օբյեկտը ստեղծելիս։
- `mysqli $db` նշանակում է՝ սպասվում է mysqli կապի օբյեկտ։
- `$this` նշանակում է «այս օբյեկտը»։ `$this->db = $db`-ն պահում է ստացած կապը։
- Նոր կապ չենք բացում. օգտագործվում է քո `db.php`-ի նույն կապը։

Այս կառուցվածքը պետք է, որ երկու ֆունկցիաներն էլ կարողանան օգտագործել նույն բազան՝ առանց գլոբալ փոփոխականների։

## 6. Request. ստանալ հասցեի տվյալները

```php
public function show(Request $request)
{
    $id = $request->query('id', '');
    // ...
}
```

`Request`-ը հարցման տվյալները պահող օբյեկտ է։ Router-ն այն փոխանցում է ֆունկցիային։ `query('id', '')`-ը կարդում է URL-ի `?id=5` մասը, իսկ եթե `id` չկա, վերադարձնում է դատարկ տեքստ։ Նախկինում դա գրում էինք `$_GET['id'] ?? ''`։

Ստուգման մեջ `is_string`-ը պահանջում է տեքստային մեկ արժեք, `strlen`-ը սահմանափակում է երկարությունը, `filter_var`-ը ստուգում է ամբողջ թիվ լինելը, `intval`-ը դարձնում է ամբողջ թիվ։ SQL-ի մեջ տեղադրվում է միայն ստուգված և ամբողջ թվի վերածված արժեքը։ Գնի կամ մյուս գործողությունների validation-ը այս քայլում չեմ փոխել։

Ցանկի դեպքում `category_id` չլինելիս ֆիլտր չկա, այսինքն՝ «Բոլորը» շարունակում է բերել բոլոր չջնջված ապրանքները։

## 7. JsonResponse. վերադարձնել արդյունքը

Նախկին ձևը՝

```php
http_response_code(200);
echo json_encode(['products' => $products]);
exit;
```

Նոր ձևը՝

```php
return new JsonResponse(['products' => $products]);
```

`new`-ը ստեղծում է պատասխան ներկայացնող օբյեկտ, իսկ `return`-ը այն վերադարձնում է Router-ին։ 200-ը լռելյայն հաջողության կոդն է։ Եթե սխալ կա՝

```php
return new JsonResponse(['error' => 'Սխալ ID։'], 422);
```

| Կոդ | Այս նախագծում նշանակությունը |
|---|---|
| 200 | Հարցումը հաջողվեց։ |
| 422 | ID-ն կամ կատեգորիան սխալ ձևով են ուղարկվել։ |
| 404 | Այդ ապրանքը չկա կամ ջնջված է։ |
| 500 | Բազայի կամ ծրագրի ներքին սխալ է։ |
| 503 | Composer-ի կախվածությունները դեռ չեն տեղադրվել։ |

Հայերենը JSON-ի տեքստում երբեմն կարող է երևալ `\u....` տեսքով, բայց JavaScript-ի `response.json()`-ը այն վերականգնում է որպես սովորական հայերեն։

## 8. Bootstrap. տեխնիկական միացումը

`bootstrap/laravel.php`-ը պետք է կարդալ վերջինը։ Ամենօրյա ապրանքային փոփոխությունները կատարելու տեղը Controller-ն է։

1. `__DIR__`-ը ընթացիկ ֆայլի պանակն է։ Դրանով գտնում ենք `vendor/autoload.php`-ն՝ անկախ տերմինալի պանակից։
2. `is_file`-ը ստուգում է, թե կախվածությունները տեղադրվա՞ծ են։ Եթե ոչ, վերադարձվում է 503 և հստակ հրահանգ։
3. `require_once`-ը միացնում է Composer-ի բեռնիչը մեկ անգամ։ Այն գտնում է պահանջվող PHP դասերի ֆայլերը։
4. `Container`-ը հիշում է՝ եթե Controller-ը `mysqli` կամ `Request` խնդրի, որ պատրաստի օբյեկտը տալ նրան։
5. `instance(mysqli::class, $db)`-ը գրանցում է արդեն բացված բազայի կապը։
6. `Request::create($url, 'GET', $_GET)`-ը ստեղծում է նորմալացված հարցումը։ Այստեղ միայն GET է հասնում. POST-ը շարունակում է հին ճանապարհով։
7. `Dispatcher`-ը Router-ի պահանջած իրադարձությունների գործիքն է։ Այս փուլում սեփական իրադարձություններ չենք գրում։
8. `new Router(...)`-ը ստեղծում է հասցեներն ընտրող գործիքը։
9. `require ... routes/api.php`-ն գրանցում է երկու հասցեները։
10. `dispatch($request)`-ը գտնում և կանչում է համապատասխան Controller-ի ֆունկցիան։
11. `try/catch`-ը սխալի դեպքում մանրամասները գրում է սերվերի log-ում և օգտատիրոջը վերադարձնում ընդհանուր JSON սխալ։
12. `Cache-Control: no-store`-ը թույլ չի տալիս պահել հնացած ապրանքային պատասխան։ `send()`-ը ուղարկում է պատասխանը, `exit`-ը ավարտում է PHP հարցումը։

## 9. Տեղադրումը Windows / VS Code-ում

### Քայլ 1. Նախապատրաստել նախագիծը

Պահուստավորիր քո գործող `intership` պանակը։ ZIP-ի ներսի `intership` պանակի պարունակությունը պատճենիր `C:\OSPanel\home\intership`։ Չստացվի կրկնակի `intership\intership` պանակ։ Քո հին `.git` և OSPanel-ի տեղական կարգավորումները պահիր։ Գործող բազան մի վերաներմուծիր. աղյուսակների փոփոխություն չկա։

### Քայլ 2. Տեղադրել Composer

Բացիր https://getcomposer.org/download/ և ներբեռնիր Windows-ի `Composer-Setup.exe` տեղադրիչը։ PHP executable ընտրելիս նշիր՝

```text
C:\OSPanel\modules\PHP-8.3\php.exe
```

Տեղադրումից հետո փակիր ու նորից բացիր VS Code-ը, որ նոր PATH-ը հասանելի լինի։ Composer-ը PHP-ի կախվածությունների տեղադրիչն է, ինչպես npm-ը՝ JavaScript-ի համար։

### Քայլ 3. Բացել PowerShell terminal-ը

VS Code-ում ընտրիր Terminal → New Terminal։ Հրամանները գրիր այդ տերմինալում, ոչ թե Node.js-ի `>` միջավայրում։ Ստորև տողերը կատարիր հերթով․

```powershell
cd C:\OSPanel\home\intership
$env:Path = "C:\OSPanel\modules\PHP-8.3;" + $env:Path
php -v
composer --version
php --ini
php -m
composer install
composer check-platform-reqs
```

| Հրաման | Ի՞նչ է անում |
|---|---|
| `cd ...` | Տերմինալին տեղափոխում է նախագծի պանակ։ |
| `$env:Path = ...` | Միայն ընթացիկ terminal-ի համար PHP-ի պանակն ավելացնում է որոնման ճանապարհին։ Windows-ի մշտական PATH-ը չի փոխում։ |
| `php -v` | Ցույց է տալիս օգտագործվող PHP-ի տարբերակը։ Պետք է լինի 8.2 կամ նոր, այս նախագծի համար հարմար է քո 8.3-ը։ |
| `composer --version` | Ստուգում է՝ Composer-ը հասանելի՞ է։ |
| `php --ini` | Ցույց է տալիս, թե որ php.ini-ն է կարդում այս PHP-ն։ |
| `php -m` | Ցույց է տալիս միացված PHP ընդլայնումները։ |
| `composer install` | Ընթերցում է composer.json-ը և ներբեռնում պահանջվող փաթեթները vendor պանակ։ |
| `composer check-platform-reqs` | Ստուգում է իրական PHP-ի և extensions-ի համապատասխանությունը տեղադրված փաթեթներին։ |

Այս ZIP-ում `vendor` և `composer.lock` չկան. այստեղ PHP/Composer գործարկում և փաթեթների ներբեռնում հասանելի չէին։ Առաջին `composer install`-ը կընտրի համատեղելի տարբերակներ և կստեղծի `composer.lock`։ Հետագայում պահիր ու Git ուղարկիր այդ lock ֆայլը, որպեսզի Railway-ն էլ տեղադրի նույն տարբերակները։ `composer update`-ը սովորական գործարկման համար պետք չէ։

Եթե Composer-ը հայտնում է `ext-mbstring` կամ `ext-mysqli` բացակայություն, `php --ini`-ով գտիր հենց CLI-ի php.ini-ն և միացրու համապատասխան ընդլայնումը (`extension=mbstring`, `extension=mysqli`)։ Եթե նշում է այլ extension, միացրու հենց նշվածը։ Ներբեռնման/ZIP բացելու համար կարող է պետք լինել `extension=zip` կամ 7-Zip։ Եթե php.ini չի բեռնվում, նախ կարգավորիր այդ PHP-ի ini-ն OSPanel-ի միջավայրում։ Մի օգտագործիր `--ignore-platform-reqs`․ դա չի լուծում բացակայող ընդլայնումը։

### Քայլ 4. Գործարկել տեղական կայքը

OSPanel-ում միացրու MySQL-ը։ Արդեն գործող `intership` բազան պահպանիր։ `db.php`-ի լռելյայն host-ը `MySQL-8.0` է։ Եթե այդ անունը չի լուծվում, օգտագործիր OSPanel-ում տվյալ MySQL ծառայության իրական host/port-ը՝ ներքևի օրինակային արժեքները համապատասխան փոխելով։

```powershell
$env:MYSQLHOST = "MySQL-8.0"
$env:MYSQLPORT = "3306"
$env:MYSQLUSER = "root"
$env:MYSQLDATABASE = "intership"
$env:SESSION_SECURE_COOKIE = "false"
php -S 127.0.0.1:8000 index.php
```

Եթե տեղական բազան գաղտնաբառ ունի, մինչև սերվերի գործարկումը այդ terminal-ում սահմանիր նաև `MYSQLPASSWORD` միջավայրային փոփոխականը քո իրական գաղտնաբառով։ Դատարկ տեղական root գաղտնաբառի դեպքում `db.php`-ի լռելյայն արժեքը բավարար է։ Այս PowerShell փոփոխականները գործում են միայն տվյալ terminal-ի և նրանից մեկնարկած ծրագրերի համար։

Բացիր **http://127.0.0.1:8000/intership/**։

- `php -S`-ը միացնում է PHP-ի տեղական փորձնական սերվերը։
- `127.0.0.1` նշանակում է քո համակարգիչը։
- `8000`-ը պորտն է։
- `index.php`-ն router ֆայլն է, որը ստանում է հարցումները։
- `Ctrl+C`-ով կանգնեցնում ես սերվերը։ Terminal-ը պետք է բաց մնա։
- `SESSION_SECURE_COOKIE=false`-ը նախատեսված է այս տեղական HTTP փորձի համար։ Railway-ում այն `true` է։

Եթե `php` անունը դեռ չի ճանաչվում, նույն հրամանի ամբողջ ճանապարհով տարբերակն է՝

```powershell
& "C:\OSPanel\modules\PHP-8.3\php.exe" -S 127.0.0.1:8000 index.php
```

PowerShell-ի `&` նշանը գործարկում է չակերտների մեջ գրված ծրագրի ճանապարհը։

**Node.js-ը տեղական այս տարբերակի համար պարտադիր չէ։** Եթե ուզում ես նախկին 3000 պորտը, PHP terminal-ը բաց թող և երկրորդ PowerShell terminal-ում գրիր՝

```powershell
cd C:\OSPanel\home\intership
npm.cmd start
```

`npm.cmd start`-ը կատարում է `package.json`-ի `start` հրամանը՝ `node server.cjs`։ Այն բացում է 3000 պորտը և հարցումները փոխանցում PHP-ի 8000 պորտին։ Այժմ բացիր http://127.0.0.1:3000/intership/։ `.cmd` ձևը խուսափում է քո նախկին `npm.ps1` execution policy խնդրից։ Այս նախագծում npm փաթեթ տեղադրել կամ frontend build անել պետք չէ։

## 10. Ինչպե՞ս ստուգել արդյունքը

Նախ կատարիր PHP-ի շարահյուսության ստուգումը նախագծի PowerShell terminal-ից՝

```powershell
php -l index.php
php -l api/index.php
php -l bootstrap/laravel.php
php -l routes/api.php
php -l app/Http/Controllers/ProductController.php
composer validate --strict
```

`php -l`-ը ֆայլը չի գործարկում և բազան չի փոխում. միայն ստուգում է PHP-ի շարահյուսությունը։ `composer validate --strict`-ը ստուգում է Composer ֆայլերի կառուցվածքն ու առկա lock-ի համապատասխանությունը։

Գործարկված սերվերի դեպքում բրաուզերում բացիր՝

| Հասցե՝ `http://127.0.0.1:8000`-ից հետո | Սպասվող արդյունքը |
|---|---|
| `/intership/api/products` | `products` ցուցակ, դատարկ բազայի դեպքում՝ դատարկ զանգված։ |
| `/intership/api/products?category_id=1` | Միայն 1 կատեգորիայի չջնջված ապրանքներ։ Եթե այդ կատեգորիայում ապրանք չկա՝ դատարկ ցուցակ։ |
| `/intership/api/product?id=1` | Եթե 1 ապրանքը գոյություն ունի՝ `product`, հեղինակ, կատեգորիա։ Հակառակ դեպքում՝ 404։ |
| `/intership/api/product?id=abc` | 422, սխալ ID։ |
| `/intership/api/product?id=0` | 422, սխալ ID։ |
| `/intership/api/products?category_id=abc` | 422, սխալ կատեգորիա։ |
| `/intership/api/products?category_id[]=1` | 422, API-ի մուտքային տվյալների ստուգման սխալ։ |

Կոդերը տեսնելու համար բրաուզերում բացիր F12 → Network։ Նաև կայքի միջերեսով ստուգիր՝ մուտք, ավելացում, փոփոխում, հեղինակ, «փոփոխված» նշում, ջնջում, կատեգորիա, «Բոլորը», admin մենյու։ Հեղինակից տարբեր սովորական օգտատերը չպետք է կարողանա փոխել ուրիշի ապրանքը։ POST հարցման առանց ճիշտ CSRF token-ի մերժումը պետք է պահպանվի։

**Այս փաթեթի ստուգման սահմանը.** փոփոխությունները համեմատվել են քո ուղարկած ZIP-ի հետ, ստուգվել են Composer JSON-ը, երկու route-ի կապերը և frontend-ի JSON դաշտերի համատեղելիությունը։ JavaScript-ի և Node-ի շարահյուսությունը ստուգվել է։ Այստեղ PHP, Composer և MySQL հասանելի չեն, ուստի Laravel-ի կախվածությունների տեղադրումը, PHP lint-ը, HTTP և բազայի ամբողջական փորձարկումները չեն կատարվել։ Railway deployment նույնպես չի կատարվել։

## 11. Railway-ի համար ի՞նչ փոխվեց

Dockerfile-ը շարունակում է աշխատեցնել քո նախկին Node + PHP կառուցվածքը, բայց build-ի ընթացքում նաև տեղադրում է PHP-ի նոր պահանջներն ու Composer-ի փաթեթները։

```text
composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
```

- `install`՝ տեղադրել composer.lock-ում ամրագրված տարբերակները, իսկ դրա բացակայության դեպքում ընտրել composer.json-ից։
- `--no-dev`՝ չտեղադրել միայն մշակման համար նախատեսված փաթեթներ։
- `--prefer-dist`՝ նախընտրել պատրաստի արխիվներով ներբեռնումը։
- `--no-interaction`՝ build-ի ընթացքում հարցերի պատասխան չպահանջել։
- `--optimize-autoloader`՝ ստեղծել դասերի բեռնման ավելի արագ քարտեզ։

`apt-get update`-ը թարմացնում է Linux փաթեթների ցուցակը, իսկ `apt-get install -y`-ը տեղադրում է PHP CLI, MySQL, mbstring, XML ընդլայնումները և unzip-ը։ `-y`-ը հաստատում է տեղադրումը։ `rm -rf /var/lib/apt/lists/*`-ը մաքրում է միայն Docker image-ի ներսի ներբեռնված փաթեթացուցակները. դա Windows-ում կատարելու հրաման չէ։ `COPY --from=composer:2`-ը պատրաստի Composer image-ից պատճենում է Composer ծրագիրը։ `WORKDIR /app`-ը սահմանում է աշխատանքային պանակը, `COPY . .`-ը պատճենում է նախագիծը։

`ENV SESSION_SECURE_COOKIE=true`-ը Railway-ի HTTPS տարբերակում պաշտպանում է session cookie-ն։ `CMD`-ի `php ... & node ...` մասը PHP սերվերը մեկնարկում է ֆոնում, իսկ Node proxy-ն՝ հիմնական գործընթացով։ Սա ժառանգված պարզ deployment կառուցվածքն է. այս թարմացումը production սերվերի վերակառուցում չէ։

Նախ տեղական ստուգումներից հետո քո գործող Git պանակում կարող ես անել՝

```powershell
git status
git add composer.json composer.lock app routes bootstrap api/index.php index.php Dockerfile .gitignore .dockerignore README_HY.md docs
git commit -m "Add beginner Laravel routing for product reads"
git push origin main
```

`git status`-ը ցույց է տալիս փոփոխությունները։ `git add`-ը ընտրում է ուղարկվող ֆայլերը, ներառյալ առաջին `composer install`-ից ստեղծված `composer.lock`-ը։ `git commit`-ը պահում է տեղական տարբերակը նկարագրությամբ։ `git push origin main`-ը այն ուղարկում է քո արդեն կարգավորված GitHub repository-ի main ճյուղ։ Եթե Railway-ը միացված է այդ repository-ին, դրա deployment կարգավորումներից կախված կարող է սկսվել նոր build։ Այդ գործողությունները այս փաթեթը պատրաստելիս չեն կատարվել։

Railway-ի գոյություն ունեցող `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` արժեքները պահիր։ Բազայի նոր ներմուծում պետք չէ։ Եթե deployment-ում առանձին սահմանել ես `SESSION_SECURE_COOKIE=false`, փոխիր այն `true`։

## 12. Ի՞նչ հրամաններ այստեղ պետք չեն

`php artisan serve`, `php artisan migrate`, `php artisan make:controller`, `php artisan key:generate` հրամաններն այս տարբերակում չեն աշխատի, որովհետև սա ամբողջական Laravel skeleton չէ և `artisan` ֆայլ չունի։ Controller-ը արդեն պատրաստ է։ Չկա նոր `.env` կարգավորում կամ `config.php`։

Սովորելու հերթականությունդ թող լինի՝ `routes/api.php` → `ProductController.php`-ի `index()` → `show()` → `bootstrap/laravel.php`։ Սկզբի հիմնական միտքն է՝ **հասցեն ընտրում է ֆունկցիան, ֆունկցիան կարդում է տվյալները, պատասխանն ուղարկվում է JavaScript-ին**։

Պաշտոնական աղբյուրներ՝

- Router API՝ https://api.laravel.com/docs/12.x/Illuminate/Routing/Router.html
- Laravel routing՝ https://laravel.com/docs/12.x/routing
- Composer տեղադրում՝ https://getcomposer.org/doc/00-intro.md
- Composer install և lock ֆայլ՝ https://getcomposer.org/doc/01-basic-usage.md
