RS Lang task RSSchool
# RS Lang – приложение для изучения иностранных слов, включающее электронный учебник с базой слов для изучения, мини-игры для их повторения, страницу статистики для отслеживания индивидуального прогресса.

### Task: https://github.com/rolling-scopes-school/tasks/blob/master/tasks/stage-2/rs-lang/rslang.md

### Deploy:  https://profound-kleicha-051fda.netlify.app/

### Backend: https://rs-lang-rsschool-task.herokuapp.com/

### Done 05.09.2022 / deadline 06.09.2022

![rslang](https://user-images.githubusercontent.com/94520585/188501722-d70c41ec-d4cd-48ed-9505-3c36561701af.png)

## Проект реализован с использованием TypeScript, SCSS , HTML5.0, Chart.js, Eslint , Webpack, MaterializeCSS, Axios, 

## Коллабораторы
- [Михаил Дружинин](https://github.com/pini86)
- [Наташа Приданова](https://github.com/natashapridanova)
- [Павел Альтов](https://github.com/user0k)

## Наставник
- [Дмитрий Ермошкин](https://github.com/spanb4)

## Структура и функционал приложения

### Главная страница приложения +40
  - главная страница приложения содержит:
    - меню с навигацией по учебнику, ссылками на мини-игры и статистику. Меню или иконка меню отображается на всех страницах приложения (+10)
    - описание возможностей и преимуществ приложения (+10)
    - раздел "О команде" с фото или аватарками и ссылками на гитхабы всех участников команды, описанием вклада в разработку приложения каждого из них.  (+10)
    - footer со ссылками на гитхабы авторов приложения, год создания приложения, логотип курса со ссылкой на курс.  (+10)

### Авторизация +50
  - реализована авторизация и регистрация пользователя (+10)
  - при перезагрузке приложения данные о пользователе и полученный при авторизации токен сохраняются в localStorage (+10)
  - электронный учебник (без раздела "Сложные слова", без отображения прогресса изучения слов и изученных слов) и мини-игры доступны без авторизации (+10)
  - у авторизованных пользователей отображается раздел "Сложные слова", прогресс изучения слов, изученные слова и статистика (+10)
  - при логауте данные пользователя и токен удаляются из localStorage, а пользователь становится анонимным (+10)

### Электронный учебник +80
  - вёрстка, дизайн, UI страниц электронного учебника (+10)
  - электронный учебник генерируется на основе коллекции исходных данных и состоит из шести разделов, в каждом разделе 30 страниц, на каждой странице 20 слов для изучения (+10)
  - седьмой раздел учебника - "Сложные слова" изначально пустой. Этот раздел состоит из слов, которые пользователь отметил как сложные. (+10)
  - на каждой странице учебника отображается: 
    - меню или иконка меню (+10)
    - список из 20 слов (в разделе "Сложные слова" слов может быть больше) (+10)
    - ссылки на мини-игры "Аудиовызов" и "Спринт" (+10)
    - навигация по страницам учебника (+10)
    - при перезагрузке страницы открывается последняя открытая страница приложения (+10)

### Список слов +80
  - вёрстка, дизайн, UI списка слов (+10)
  - для каждого слова отображается:
    - само слово, транскрипция, перевод (+5)
    - предложение с объяснением значения слова, перевод предложения (+5)
    - предложение с примером использования изучаемого слова, перевод предложения
    - картинка-ассоциация к изучаемому слову (+5)
    - иконка аудио, при клике по которой последовательно звучит произношение изучаемого слова, произношение предложения с объяснением его значения, произношение предложения с примером его использования   (+5)
  - только у авторизированных пользователей отображаются:
    - кнопка, при клике по которой слово можно отметить как сложное (в разделе "Сложные слова" на её месте отображается кнопка, снимающая отметку что это сложное слово и удаляющая его из данного раздела) (+10)
    - кнопка, при клике по которой слово можно отметить как изученное (+10)
    - если слово отмечено как сложное, оно остаётся на странице учебника и выделяется стилем, указывающим, что данное слово относится к сложным словам. Также данное слово добавляется в раздел "Сложные слова" (+10)
    - если слово отмечено как изученное, оно остаётся на странице учебника и выделяется стилем, указывающим, что данное слово относится к изученным словам (+10)
    - если все слова на странице относятся к изученным словам или к изученным и сложным словам, такая страница считается полностью изученной и выделяется стилем.  (+10)

### Мини-игры "Аудиовызов" и "Спринт" +200 (100 баллов за игру)

- функционал мини-игр "Аудиовызов" и "Спринт" полностью повторяет функционал одноимённых мини-игр приложения Lingualeo (+20, +20)
- по окончанию каждой игры выводятся результаты мини-игры (+20, +20)
- управлять игрой можно как мышкой, так и клавишами на клавиатуре, как это реализовано в оригинальных играх (+20, +20)
- если мини-игра запускается из меню, в ней можно выбрать один из шести уровней сложности, которые отличаются тем, слова какого из шести разделов коллекции исходных данных в ней задействованы (+20, +20)
- если мини-игра запускается со страницы учебника, в ней используются слова из той страницы учебника, на которой размещена ссылка на игру.  (+20, +20)

###  Прогресс изучения +50

- новые слова - это слова, которые впервые использовались в мини-играх вне зависимости от того, открывались мини-игры на странице учебника или по ссылке в меню (+25)
- возле каждого слова, которое использовалось в мини-играх, на странице учебника указывается прогресс его изучения за весь период: было ли слово правильно угадано в мини-играх, или пользователь ошибался (+25)

### Изученные слова +60

- также слова считаются изученными по результатам их угадывания в мини-играх. (+15)
- если сложное слово стало изученным, оно перестаёт быть сложными и удаляется из раздела "Сложные слова" (+15)
- изученные слова не задействуются в мини-играх, которые запускаются на страницах учебника, но задействуются в мини-играх, которые открываются по ссылке в меню (+15)
- если при угадывании изученного слова в мини-игре пользователь ошибся, слово удаляется из категории изученных (+15)

###  Страница статистики +60

- в краткосрочной статистике по мини-играм указываются результаты по каждой мини-игре отдельно
  - количество новых слов за день (+10)
  - процент правильных ответов  (+10)
  - самая длинная серия правильных ответов (+10)
- в краткосрочной статистике по словам указываются
  - количество новых слов за день (+10)
  - количество изученных слов за день (+10)
  - процент правильных ответов за день (+10)

### Дополнительный функционал +80
- долгосрочная статистика за весь период изучения в которой представлены два графика 
  - график, отображающий количество новых слов за каждый день изучения (+20)
  - график, отображающий увеличение общего количества изученных слов за весь период обучения по дням (+20)
- дополнительный функционал(использование технологии кеширования (только для анонимного пользователя), обновление просроченного токена)  (+40)

## Общий балл за задание: 620 баллов
