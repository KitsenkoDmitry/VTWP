# Должно быть установлено

node.js - https://nodejs.org/ + npm

gulp - сборщик
npm i gulp-cli -g

yarn - пакетный менеджер. Все зависимости устанавливаем через него.
см. доку https://yarnpkg.com/en/docs/install


# Директории
* рабочая директория: /html/src/
* результат development: /html/build/
* результат production: /public/assets/build/


## Зависимости и запуск

В директории /html/
```bash
yarn install
gulp или yarn dev
```
Запустится сервер http://localhost:3000

## Сборка
Настроено 2 сборки, development и production.

**development** - дефолтная, запускается при выполнении команды gulp или yarn dev, при этом запускается сервер http://localhost:3000. Собирается в /html/build/.

**production** - запускается при выполнении команды yarn prod или gulp --env=prod. Собирается в /public/assets/build/ этот путь можно менять в /gulp/config.js.
Так же в production есть минификация стилей и js.

### ВАЖНО
**!!** Ни чего не меняем руками в папке build.

Также **можно запускать отдельно нужные таски сборки**, например:
**Список всех тасков** (все таски, кроме html, watch и serve, доступны с параметром --env=prod):

Список всех тасков можно посмотреть так:

```bash
gulp --tasks
```

* gulp (запускает сервер со статикой http://localhost:3000, делает полную сборку и запускает watch)
* gulp build (делает полную сборку)
* gulp clean (удаляет содержимое папки build)
* gulp watch (мониторит все изменения и запускает нужные таски)
* gulp postcss
* gulp postcssInternal
* gulp postcssExternal
* gulp js
* gulp jsInternal
* gulp jsExternal
* gulp images
* gulp cleanSvgSprite
* gulp generateSvgSprite
* gulp copySvgSprite
* gulp fonts
* gulp html
* gulp serve

Вся работа (до и после интеграции) ведется в /html/src/

# Что есть

**px to rem** - автоматически заменяет пиксели на rem в размерах шрифтов
**precss** - включает поддержку возможностей SASS
**sassy-mixins** - позволяет использовать миксины как написанные на sass, так и postcss
**postcss-next** - позволяет использовать CSS4 http://cssnext.io/features/
**animate.css** - классы для разнообразных анимаций https://github.com/daneden/animate.css/
**gulp-file-include** - используется для "шаблонизации", позволяет импортировать один файл в другой с передачей каких-либо параметров см. https://www.npmjs.com/package/gulp-file-include
**browsersync** - вебсервер.
**lazysizes** - lazy loading для картинок. Использовать вместо src у тега img – data-src!

**gulp-svg-sprites** - генерит svg спрайт из файлов /src/img/svg/sprite/*.svg см. https://github.com/shakyshane/gulp-svg-sprites
Использование:
```
<svg class="icon icon--load"><use xlink:href="#icon-load"></use></svg>
```

**postcss-inline-svg** - позволяет вставлять инлайн svg в css, к сожалению без возможности использовать transition см. https://github.com/TrySound/postcss-inline-svg
!!Внимание: использовать данный плагин только при сильной необходимости, в остальном использовать svg спрайт, иначе слиьно раздувает итоговый css файл.
использование в css:
```
background-image: svg-load('load.svg', fill=#f00);
```
