FROM node:22-bookworm

RUN apt-get update \
    && apt-get install -y php-cli php-mysql php-mbstring php-xml unzip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /app
COPY . .
RUN cp uploads.ini /etc/php/$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')/cli/conf.d/99-uploads.ini

RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

ENV SESSION_SECURE_COOKIE=true

CMD ["sh", "-c", "php -S 127.0.0.1:8000 index.php & node server.cjs"]
