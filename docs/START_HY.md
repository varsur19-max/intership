# Laravel-ի փոքր հավելումով տարբերակ

Ստորև նախորդ տարբերակի ուղեցույցն է։ Այս թարմացման փոփոխությունների, տեղադրման հրամանների և ստուգումների համար նախ կարդա `docs/LARAVEL_HY.md` (docs պանակում՝ `LARAVEL_HY.md`)։ Այս փաթեթում բազայի ֆայլը `intership.sql` է. հին տեքստում նշված `database.sql` և `update.sql` ֆայլերը այստեղ չկան։ Գործող բազան վերաներմուծելու կարիք չկա։ Նախկին ստուգումների նկարագրությունը նոր Laravel մասի գործարկման ապացույց չէ։

---

# Գործարկման մանրամասն ուղեցույց՝ Windows, PHP, MySQL, Node.js

## 1. Պատրաստել ֆայլերը և բազան

Սա վերափոխված intership նախագծի ամբողջական տարբերակն է։ Քո նախորդ նախագծի պանակը նախ պատճենիր ապահով տեղ։ ZIP-ը բացիր առանձին պանակում, օրինակ՝ `C:\Projects\intership`։ Այս ուղեցույցի ճանապարհները օրինակներ են․ քո տեղադրության ճանապարհն օգտագործիր։

Միացրու Open Server-ի MySQL-8.0 մոդուլը։ Բացիր phpMyAdmin-ը, ընտրիր Import/Импорт, ընտրիր `database.sql`, կատարիր ներմուծումը։ Ֆայլը ստեղծում է `intership` բազան և 4 աղյուսակ՝ users, products, menu_items, menu_lock։

Բացիր `db.php`․

```php
$dbHost = 'MySQL-8.0';
$dbUser = 'root';
$dbPassword = '';
$dbName = 'intership';
```

Կայքի հասցեն և cookie-ի կարգավորումը գտնվում են `index.php`-ի սկզբում․

```php
$basePath = '/intership';
$secureCookies = false;
```

`MySQL-8.0`-ը քո նախկին նախագծի host-ն է։ Եթե այս միջավայրից այդ անունը չի լուծվում, օգտագործիր MySQL մոդուլի իրական host/IP-ը և անհրաժեշտության դեպքում `mysqli_connect`-ում հինգերորդ պարամետրով port-ը։ Մի ենթադրիր, որ յուրաքանչյուր Open Server տեղադրման համար դա 127.0.0.1:3306 է։ Միացումն օգտագործում է հենց քո մոդուլի կարգավորումները։

## 2. Տեղական PHP սերվեր

Այս տարբերակով Apache-ի document root և domain կարգավորումներ պետք չեն։ Անհրաժեշտ են PHP 8.2+ և mysqli extension։ Բացիր Open Server-ի PHP միջավայրով տերմինալը կամ PowerShell-ը, որտեղ php հրամանը հասանելի է։

```powershell
php -v
php -m
```

Երկրորդ ցուցակում պետք է լինի `mysqli`։ Եթե `php`-ը չի ճանաչվում, գործարկիր PHP-ի քո տեղադրման `php.exe`-ն ամբողջ ճանապարհով կամ օգտվիր Open Server-ի տերմինալից։ PowerShell-ում ամբողջ ճանապարհի օրինակն է՝

```powershell
& 'C:\քո-իրական-ճանապարհը\php.exe' -v
```

Մտիր նոր նախագծի պանակ և միացրու սերվերը․

```powershell
cd C:\Projects\intership
php -S 127.0.0.1:8000 index.php
```

Մի՛ փակիր տերմինալը։ Բացիր `http://127.0.0.1:8000/intership/`։ Սկզբում ապրանքներն ու մենյուն դատարկ են, դա նորմալ է։ `index.php`-ն router է նաև PHP-ի built-in սերվերի համար։ Ուղղակի ֆայլը կրկնակի սեղմելով կամ VS Code Live Server-ով PHP backend-ը չի գործարկվի։

## 3. Դառնալ ադմին

1. Բացիր «Գրանցում» էջը։
2. Գրանցվիր սեփական email-ով, անունով և առնվազն 8 բայթ գաղտնաբառով։
3. phpMyAdmin-ում ընտրիր `intership` բազան և SQL բաժինը։
4. Կատարիր հետևյալը՝ փոխարինելով email-ը քո գրանցած email-ով․

```sql
UPDATE users SET status = 'admin' WHERE email = 'your-email@example.com';
```

5. Մուտք գործիր կամ թարմացրու էջը։
6. Նախ ստեղծիր կատեգորիաները ստորև նշված քայլերով, հետո «Ավելացնել ապրանք» էջում ընտրիր կատեգորիան և ստեղծիր առաջին ապրանքը։ Ավելացումը հասանելի է նաև user-ին։
7. «Ադմին» էջում ստեղծիր «Ապրանքներ» տարրը՝ առանց ծնողի։
8. Նրա կողքի «Ենթամենյու +» կոճակով ստեղծիր «Էլեկտրոնիկա», ապա նույն եղանակով «Հեռախոսներ», «Սմարթֆոններ» և շարունակիր այնքան, որքան անհրաժեշտ է։
9. Ձախ մենյուում սլաքին սեղմելիս կբացվեն երեխաները, իսկ կատեգորիայի անվան վրա սեղմելիս՝ նրա ապրանքները։
10. «Խմբագրել»-ով փոխիր ծնողին՝ տեղափոխելով ամբողջ ենթաճյուղը։

## 4. Ինչ դեր ունի Node.js-ը

Backend-ը պահանջով PHP է։ Node.js-ն այստեղ լրացուցիչ proxy սերվեր է․ browser-ի հարցումները փոխանցում է PHP սերվերին, իսկ պատասխանը՝ browser-ին։ MySQL-ի հետ աշխատում է PHP-ն։ Node.js-ը չի փոխարինում PHP-ին կամ MySQL-ին, և միայն այն միացնելով հանրային URL չի ստեղծվում։

Այս ZIP-ում `server.cjs`-ն արդեն պատրաստ է, արտաքին npm package պետք չէ։

Ներբեռնիր Node.js-ի պաշտոնական էջից առաջարկվող LTS Windows Installer-ը՝ https://nodejs.org/en/download ։ Տեղադրելուց հետո բացիր նոր PowerShell ու ստուգիր․

```powershell
node -v
npm -v
```

Բացիր երկրորդ տերմինալը․ առաջինում PHP-ն շարունակում է աշխատել։

```powershell
cd C:\Projects\intership
node server.cjs
```

Կարելի է նաև `npm start`։ `npm install` պետք չէ, dependencies չկան։

Հիմա բացիր `http://127.0.0.1:3000/intership/`։ Node-ը լսում է 3000 պորտը և հարցումները փոխանցում 8000 պորտի PHP սերվերին։ Մուտքն ու CSRF-ն աշխատում են նույն հասցեով՝ CORS կարգավորելու կարիք չկա։

## 5. Հանրային հղում՝ ընկերներին կամ դասախոսին ցույց տալու համար

Cloudflare Quick Tunnel-ը թույլ է տալիս ժամանակավոր հանրային HTTPS հղումով բացել տեղական սերվերը։ Այն նախատեսված է փորձարկման/ցուցադրման համար, ոչ մշտական production հոսթինգի։

Ներբեռնիր Windows-ին համապատասխան cloudflared executable-ը պաշտոնական էջի Windows բաժնից՝
https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/

Ֆայլը կարող ես վերանվանել `cloudflared.exe` և պահել `C:\Tools` պանակում։ Սա առանձին գործիք է, Node.js-ի մաս չէ։

Հանրային HTTPS հասցեով աշխատելուց առաջ `index.php`-ում դիր՝

```php
$secureCookies = true;
```

Այդ պահից մուտքը ստուգիր HTTPS հանրային հասցեով։ Սովորական տեղական HTTP հասցեում secure cookie-ն կարող է չուղարկվել։ Տեղական աշխատանքին վերադառնալիս արժեքը փոխիր false։

Բացիր երրորդ PowerShell-ը․

```powershell
cd C:\Tools
.\cloudflared.exe tunnel --url http://127.0.0.1:3000
```

Կստանաս `https://պատահական-անուն.trycloudflare.com` տեսքի հասցե։ Ուղարկիր ամբողջ հասցեն՝ ավելացնելով `/intership/`․

```text
https://պատահական-անուն.trycloudflare.com/intership/
```

Սա օրինակ է, ոչ պատրաստի գործող հղում։ Քո իրական հասցեն ցույց կտա քո տերմինալը։ Այլ մարդը կարող է այն բացել browser-ով այլ ինտերնետից․ իրեն PHP/Node/MySQL պետք չեն։ Ստուգիր նաև հեռախոսի mobile internet-ով։

Պետք է միացված մնան համակարգիչը, ինտերնետը, MySQL-ը և բոլոր երեք գործընթացները՝ PHP, Node, cloudflared։ Գործընթացը կանգնեցնելու համար տերմինալում Ctrl+C։ Tunnel-ը կրկին միացնելիս հասցեն կարող է փոխվել։ Բազայի տվյալները շարունակում են մնալ քո MySQL-ում։

## 6. Եթե ցանկանում ես օգտագործել Open Server-ի Apache-ը

Կարող ես PHP built-in սերվերի փոխարեն օգտագործել արդեն կարգավորված Apache/PHP կայքը։ Այն պետք է իրականում բացվի browser-ով և մշակի `.htaccess`-ի rewrite կանոնները։ Այս նախագիծը պահանջում է mod_rewrite, AllowOverride-ի թույլտվություն և PHP handler։ Բոլոր հարցումները անցնում են index.php-ով, իսկ թույլատրելի JS/CSS ֆայլերը router-ը տալիս է ինքնուրույն։ SQL/db/ուղեցույցի ֆայլերը չեն մատուցվում որպես static։

Ենթադրենք քո Apache կայքը բացվում է `http://shop.local/intership/`-ով և իրականում լսում է 127.0.0.1:80 հասցեում։ Այդ կոնկրետ դեպքում Node-ի տերմինալում՝

```powershell
$env:PHP_HOST='127.0.0.1'
$env:PHP_PORT='80'
$env:PHP_VHOST='shop.local'
node server.cjs
```

Սրանք օրինակային արժեքներ են․ օգտագործիր քո Apache-ի իրական IP/port/domain-ը։ Եթե նախագիծը domain-ի root-ում է, `index.php`-ում `$basePath = '';`, և հանրային URL-ից հեռացրու `/intership/` մասը։ Node-ի մեկնարկի հաղորդագրությունը օրինակային `/intership/` հասցե է տպում, բայց փոխանցում է նաև root հարցումները։

Նույն PowerShell-ում built-in տարբերակին վերադառնալու համար՝

```powershell
$env:PHP_HOST='127.0.0.1'
$env:PHP_PORT='8000'
$env:PHP_VHOST='127.0.0.1'
node server.cjs
```

## 7. Մշտական հանրային կայք

Միշտ հասանելի կայքի համար պետք է մշտապես աշխատող սերվեր կամ PHP + MySQL հոսթինգ։ PHP-ի built-in `php -S` սերվերը production-ի համար նախատեսված չէ։

Սովորական PHP/MySQL հոսթինգի դեպքում Node-ը պարտադիր չէ․ Apache/PHP-ն կարող է անմիջապես սպասարկել կայքը։ Եթե ցանկանում ես պահպանել Node-ը, VPS-ում միացրու Apache/PHP և MySQL, Node proxy-ն՝ որպես ավտոմատ վերագործարկվող service, իսկ domain-ի HTTPS-ը՝ reverse proxy-ով կամ մշտական managed tunnel-ով։ Օգտագործիր `/intership` կամ root basePath՝ համապատասխան public URL-ին։

Մշտական շահագործումից առաջ անհրաժեշտ են առանձին գաղտնաբառով սահմանափակ DB օգտատեր, HTTPS, բազայի backup-ներ, login/register հարցումների հաճախականության սահմանափակում և սերվերի մոնիթորինգ։ Այս ուսումնական տարբերակում anti-bruteforce/rate limiting և password recovery չկան։ Այն առանց լրացուցիչ կարգավորումների մեծածավալ production համակարգ ներկայացնելը ճիշտ չի լինի։

## 8. Սխալների լուծում

| Սխալ | Ինչ ստուգել |
|---|---|
| php/node հրամանը չի ճանաչվում | Տեղադրումը, PATH-ը կամ executable-ի ամբողջ ճանապարհը |
| Call to undefined function mysqli_connect | PHP-ում mysqli extension-ը միացված չէ |
| Բազայի կապը չհաջողվեց | MySQL մոդուլը, host/user/password/db անունը |
| JSON պատասխան չկա | PHP error log, basePath և router-ը |
| 502 / PHP սերվերը հասանելի չէ | PHP/Apache-ը միացվա՞ծ է, PHP_HOST/PHP_PORT-ը ճի՞շտ են |
| 404 | URL-ի /intership մասը, basePath-ը, Apache rewrite-ը |
| Token-ի սխալ | Թարմացրու էջը, ստուգիր cookie-ները, HTTP/HTTPS և secureCookies-ը |
| Ադմին կոճակ չկա | Քո օգտատիրոջ status-ը admin է՞, թարմացրե՞լ ես էջը |
| Պորտը զբաղված է | Օգտագործիր այլ PORT կամ PHP_PORT՝ համապատասխան երկու կողմում |
| Այլ մարդը չի բացում localhost-ը | Ուղարկիր իրական tunnel HTTPS հասցեն, ոչ localhost-ը |

Պաշտոնական աղբյուրներ՝ Node.js https://nodejs.org/en/download , PHP built-in server https://www.php.net/manual/en/features.commandline.webserver.php , Cloudflare Quick Tunnels https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/ ։

Գործող բազան նախ պահուստավորիր, ընտրիր phpMyAdmin-ում և ներմուծիր `update.sql`-ը։ Այն ավելացնում է բացակայող category_id, stock և user_id դաշտերը և օգտանվան UNIQUE սահմանափակումը։ Եթե հայտնվեն կրկնվող անուններ, ձեռքով տարբերակիր դրանք և կրկին ներմուծիր ֆայլը։ Առանց հայտնի հեղինակի հին ապրանքները կառավարում է միայն ադմինը։ Նոր, դատարկ բազայի համար օգտագործիր `database.sql`-ը։
