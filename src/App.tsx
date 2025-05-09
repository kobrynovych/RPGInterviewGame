import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import Confetti from 'react-confetti';
import { Wand2, Sword, Trophy, XCircle, Coffee, Sparkles, Zap, Heart, Star, Flame, Lightbulb, Rocket, Magnet as Magic, Check, AlertCircle, Box, Syringe, Hammer, Map, Filter, Radar, Shield, Repeat2, RadioTower } from 'lucide-react';
import clickSfx from './sounds/click.mp3';
import winSfx from './sounds/win.mp3';
import failSfx from './sounds/fail.mp3';

// Type definitions
interface QuestionOption {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  effect: ReactNode;
}

interface Hero {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  color: string;
  questions: QuestionOption[];
  background: string;
  powerIcon: ReactNode;
  powerName: string;
}

interface Ending {
  text: string;
  icon: ReactNode;
  description: string;
}

interface Endings {
  good: Ending;
  bad: Ending;
  neutral: Ending;
}

interface AnswerHistory {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

type EndingType = keyof Endings | "";

const reactQuestions: QuestionOption[] = [
  {
    question: "Поясни useEffect котику 🐱",
    options: [
      "Мур-мур, це як будильник для компонента - прокидається коли щось змінюється і робить свої котячі справи",
      "Це магічна паличка, махнув - і все працює. Або не працює...",
      "А що тут пояснювати? Клацаєш useEffect і йдеш пити каву ☕"
    ],
    correct: 0,
    explanation: "useEffect - це хук для побічних ефектів, як підписки на події, запити до API, або зміни DOM. Він виконується після рендеру.",
    effect: <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
  },
  {
    question: "Що таке React.memo() і коли його використовувати? 🤔",
    options: [
      "Це як фотографія компонента - зберігає його вигляд, поки пропси не зміняться. Економить нерви і CPU",
      "Це функція для запам'ятовування паролів в React. Дуже корисно!",
      "Memo - це коли компонент пише мемуари про своє життя"
    ],
    correct: 0,
    explanation: "React.memo() - це HOC для оптимізації, який запобігає перерендеру компонента, якщо його пропси не змінилися.",
    effect: <Zap className="w-6 h-6 text-yellow-500 animate-bounce" />
  },
  {
    question: "useCallback vs useMemo: в чому різниця? 🎯",
    options: [
      "useCallback для функцій, useMemo для значень. Як близнюки, але один любить дії, інший - результати",
      "Це одне й те саме, просто React розробники люблять ускладнювати життя",
      "useCallback для колбеків, useMemo для мемів. Очевидно ж!"
    ],
    correct: 0,
    explanation: "useCallback мемоізує функції, а useMemo - значення. Різні інструменти для різних задач оптимізації.",
    effect: <Heart className="w-6 h-6 text-red-500 animate-pulse" />
  },
  {
    question: "Що таке React Fiber? 🕸️",
    options: [
      "Це як операційна система для React - керує всіма процесами і може їх призупиняти. Як батьки, які кажуть: 'Почекай хвилинку!'",
      "Це дієта для важких компонентів React",
      "Fiber - це коли код такий заплутаний, що став схожий на волокна"
    ],
    correct: 0,
    explanation: "React Fiber - новий механізм узгодження, що дозволяє призупиняти і відновлювати рендеринг для кращої продуктивності.",
    effect: <Star className="w-6 h-6 text-purple-500 animate-spin" />
  },
  {
    question: "Як працює StrictMode в React? 🔍",
    options: [
      "Це як суворий вчитель - змушує компоненти робити домашку двічі, щоб знайти помилки",
      "Забороняє писати погані жарти в коментарях",
      "Це режим, де React стає дуже серйозним і перестає розуміти жарти"
    ],
    correct: 0,
    explanation: "StrictMode допомагає знаходити баги, навмисно подвоюючи рендер компонентів у розробці.",
    effect: <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
  },
  {
    question: "Що робити, коли useState не оновлює стан? 🤯",
    options: [
      "Спочатку перевірити, чи не забув дужки в setState, потім медитувати над документацією React",
      "Спробувати переконати useState, що він має змінитися. Можливо, він просто вредний",
      "Оголосити useState застарілим і написати свій власний"
    ],
    correct: 0,
    explanation: "Часто проблема в асинхронності або неправильному використанні попереднього стану. setState((prev) => ...) допоможе!",
    effect: <Sparkles className="w-6 h-6 text-blue-500 animate-spin" />
  },
  {
    question: "Навіщо потрібен key в списках React? 🔑",
    options: [
      "Це як бейджик для елементів списку - React може їх впізнати в натовпі і не плутати",
      "Це декоративний елемент, просто React любить ключі",
      "Key потрібен, щоб відкривати секретні функції React"
    ],
    correct: 0,
    explanation: "Key допомагає React ефективно оновлювати списки, визначаючи, які елементи змінилися, додалися чи видалилися.",
    effect: <Zap className="w-6 h-6 text-yellow-500 animate-bounce" />
  },
  {
    question: "Що таке React Portal? 🚪",
    options: [
      "Це як телепорт для компонентів - дозволяє їм з'являтися де завгодно в DOM, як справжня магія!",
      "Це портал в інший вимір, де всі баги стають фічами",
      "Portal - це коли компонент втомився і вирішив переїхати в інший div"
    ],
    correct: 0,
    explanation: "Portal дозволяє рендерити дочірні елементи в DOM-вузол, що знаходиться поза ієрархією батьківського компонента.",
    effect: <Star className="w-6 h-6 text-purple-500 animate-pulse" />
  },
  {
    question: "Як працює Virtual DOM? 🌳",
    options: [
      "Це як чернетка для DOM - React спочатку малює там, а потім показує тільки різницю. Економно!",
      "Це віртуальна реальність для DOM елементів, де вони відпочивають",
      "Virtual DOM - це коли DOM працює віддалено з дому"
    ],
    correct: 0,
    explanation: "Virtual DOM - це легка копія реального DOM, яка дозволяє React ефективно порівнювати і оновлювати тільки змінені елементи.",
    effect: <Flame className="w-6 h-6 text-orange-500 animate-spin" />
  },
  {
    question: "Що таке React Context? 🌍",
    options: [
      "Це як групова розсилка в чаті - всі підписані компоненти отримують оновлення, не треба передавати через всіх",
      "Context - це коли компоненти збираються разом і пліткують",
      "Це спеціальний контейнер для зберігання секретів React"
    ],
    correct: 0,
    explanation: "Context надає спосіб передавати дані через дерево компонентів без необхідності передавати пропси вручну на кожному рівні.",
    effect: <Heart className="w-6 h-6 text-red-500 animate-bounce" />
  }
];

const vueQuestions: QuestionOption[] = [
  {
    question: "Що таке Vue Reactivity System? 🔄",
    options: [
      "Це як розумний помічник, який слідкує за вашими даними і оновлює все автоматично. Магія Vue!",
      "Це система для реакції на погоду у Vue додатках",
      "Reactivity - це коли Vue реагує на ваші помилки сумним смайликом"
    ],
    correct: 0,
    explanation: "Vue використовує Proxy для відстеження змін у даних і автоматичного оновлення DOM.",
    effect: <Sparkles className="w-6 h-6 text-green-500 animate-pulse" />
  },
  {
    question: "Composition API vs Options API: що обрати? 🤹",
    options: [
      "Composition API - як конструктор LEGO, можна збирати логіку як завгодно. Options API - як готовий набір меблів з IKEA",
      "Options API, бо воно має більше опцій. Очевидно ж!",
      "Composition API для композиторів, Options API для оптимістів"
    ],
    correct: 0,
    explanation: "Composition API пропонує більше гнучкості та кращу TypeScript підтримку, тоді як Options API простіше для початківців.",
    effect: <Zap className="w-6 h-6 text-emerald-500 animate-bounce" />
  },
  {
    question: "Що таке Vue Watchers? 👀",
    options: [
      "Це як охоронці даних - слідкують за змінами і роблять все, що ви накажете. Дуже слухняні!",
      "Watchers - це спеціальні окуляри для Vue розробників",
      "Це спостерігачі, які дивляться серіали разом з вашим кодом"
    ],
    correct: 0,
    explanation: "Watchers дозволяють реагувати на зміни даних і виконувати складні операції або асинхронні дії.",
    effect: <Star className="w-6 h-6 text-teal-500 animate-spin" />
  },
  {
    question: "Навіщо потрібні Vue Directives? 📝",
    options: [
      "Це як чарівні слова - додаєш v- і HTML починає робити круті речі. Абракадабра!",
      "Щоб давати вказівки молодшим розробникам",
      "Directives - це коли Vue намагається бути директором"
    ],
    correct: 0,
    explanation: "Vue директиви розширюють можливості HTML елементів, додаючи реактивну поведінку та спеціальні функції.",
    effect: <Flame className="w-6 h-6 text-lime-500 animate-pulse" />
  },
  {
    question: "Як працює v-model? 🎮",
    options: [
      "Це як телепатія між формою і даними - вони завжди знають, що відбувається одне з одним",
      "v-model - це віртуальна модель, яка дефілює по вашому коду",
      "Це спеціальний режим для v-подібних компонентів"
    ],
    correct: 0,
    explanation: "v-model забезпечує двостороннє зв'язування даних між формами та станом компонента.",
    effect: <Heart className="w-6 h-6 text-pink-500 animate-bounce" />
  },
  {
    question: "Що таке Vue Mixins? 🎨",
    options: [
      "Це як рецепти - додаєте готові шматочки функціоналу в компонент. Смачно!",
      "Mixins - це коли змішуєте всі компоненти в блендері",
      "Це спеціальні міксини для вечірки Vue розробників"
    ],
    correct: 0,
    explanation: "Mixins дозволяють повторно використовувати функціонал між компонентами, хоча в Vue 3 краще використовувати композицію.",
    effect: <Sparkles className="w-6 h-6 text-violet-500 animate-spin" />
  },
  {
    question: "Навіщо потрібен key в v-for? 🔑",
    options: [
      "Це як бірка на одязі - Vue може швидко знайти потрібний елемент і не плутати його з іншими",
      "key потрібен, щоб відкривати секретне меню Vue",
      "Це ключ від серверної кімнати, де живе Vue"
    ],
    correct: 0,
    explanation: "key допомагає Vue ефективно оновлювати списки, визначаючи унікальність кожного елемента.",
    effect: <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
  },
  {
    question: "Що таке Vue Slots? 🎰",
    options: [
      "Це як контейнери для контенту - можна вставляти що завгодно, як в чарівну сумку!",
      "Slots - це ігрові автомати в казино Vue",
      "Це спеціальні слоти для паркування компонентів"
    ],
    correct: 0,
    explanation: "Slots дозволяють створювати гнучкі компоненти, які можуть приймати різний контент від батьківського компонента.",
    effect: <Star className="w-6 h-6 text-indigo-500 animate-bounce" />
  },
  {
    question: "Як працює Vue Router? 🛣️",
    options: [
      "Це як GPS для вашого додатку - прокладає маршрути між компонентами і не дає заблукати",
      "Router - це робот, який роутить пакети по інтернету",
      "Це спеціальний маршрутизатор для доставки пропсів"
    ],
    correct: 0,
    explanation: "Vue Router керує навігацією у Vue додатках, дозволяючи створювати SPA з різними маршрутами та переходами.",
    effect: <Flame className="w-6 h-6 text-orange-500 animate-spin" />
  },
  {
    question: "Що таке Vuex/Pinia? 🏪",
    options: [
      "Це як супермаркет для стану додатку - всі компоненти можуть взяти що треба з одного місця",
      "Це місце, де Vue зберігає свої секрети",
      "Vuex - це коли Vue грає в X і O"
    ],
    correct: 0,
    explanation: "Vuex і Pinia - це менеджери стану для Vue, які допомагають керувати даними на рівні всього додатку.",
    effect: <Heart className="w-6 h-6 text-red-500 animate-pulse" />
  }
];

const angularQuestions: QuestionOption[] = [
  {
    question: "Що таке Angular Module? 📦",
    options: [
      "Це як валіза для коду — складаєш туди компоненти, сервіси і пайпи, щоб усе було на місці",
      "Це як модуль погоди — показує дощ з багів",
      "Module — це коли Angular хоче виглядати дуже серйозно і модульно"
    ],
    correct: 0,
    explanation: "Angular Module — це контейнер для групи пов’язаних частин додатку: компонентів, директив, сервісів тощо.",
    effect: <Box className="w-6 h-6 text-blue-500 animate-pulse" />
  },
  {
    question: "Поясни Dependency Injection в Angular 💉",
    options: [
      "Це як магічний холодильник - просто говориш 'дай сервіс' і Angular підставляє його тобі в конструктор!",
      "Це коли Angular вводить залежності між розробниками, щоб вони не сварились",
      "DI - це коли тобі вводять код за допомогою шприца"
    ],
    correct: 0,
    explanation: "DI - це патерн, де клас отримує залежності ззовні, а не створює їх сам, що робить код більш тестованим і гнучким.",
    effect: <Zap className="w-6 h-6 text-blue-500 animate-bounce" />
  },
  {
    question: "Що таке двостороннє зв'язування ([(ngModel)])? 🔁",
    options: [
      "Це як телепатія між полем вводу і твоїми даними - змінив одне, інше одразу знає! Магія, та й годі!",
      "Це коли дані пов'язані так сильно, що не можуть розлучитися",
      "Це модель, яка дивиться в обидві сторони перед тим, як перейти дорогу"
    ],
    correct: 0,
    explanation: "Двостороннє зв'язування даних [(ngModel)] синхронізує дані між моделлю компонента і представленням (view).",
    effect: <Repeat2 className="w-6 h-6 text-purple-500 animate-spin" />
  },
  {
    question: "Що таке Angular Pipes? 🚰",
    options: [
      "Це як фільтри для даних — пропускають значення через трубу і видають гарний результат!",
      "Pipes — це коли Angular будує водопровід",
      "Це спеціальні труби для транспортування компонентів",
    ],
    correct: 0,
    explanation: "Pipes трансформують дані в шаблонах, наприклад, форматують дати чи змінюють регістр тексту.",
    effect: <Zap className="w-6 h-6 text-blue-500 animate-bounce" />
  },
  {
    question: "Поясни Angular Change Detection котику 😼",
    options: [
      "Мяу! Це як пильний вартовий, який слідкує за кожним муркотінням (зміною) в компоненті і миттєво все оновлює!",
      "Це коли Angular намагається вгадати, що змінилося. Іноді вгадує...",
      "Change Detection? Це коли ти змінюєш колір котика на екрані"
    ],
    correct: 0,
    explanation: "Angular Change Detection - механізм, який визначає, коли потрібно оновити DOM після зміни стану компонента.",
    effect: <Rocket className="w-6 h-6 text-red-500 animate-pulse" />
  },
  {
    question: "Що таке Angular Decorators @Component, @Injectable тощо? 🧙‍♂️",
    options: [
      "Це як чарівні заклинання, які додають суперсили до класів. @Component робить клас компонентом, @Injectable - сервісом!",
      "Це просто якісь символи перед класами, Angular їх любить",
      "Декоратори? Це коли ти прикрашаєш свій код бантиками"
    ],
    correct: 0,
    explanation: "Декоратори - це метадані, які додають функціональність до класів, методів або властивостей в Angular.",
    effect: <Hammer className="w-6 h-6 text-gray-700 animate-spin" />
  },
  {
    question: "Як працюють Angular Components? 🧱",
    options: [
      "Це як цеглинки LEGO - з них будується весь інтерфейс. Кожна цеглинка має свою роботу і вигляд!",
      "Компоненти - це коли Angular компонує ваш код в одну велику кашу",
      "Це спеціальні елементи, які роблять ваш сайт інтерактивним, ніби магія!"
    ],
    correct: 0,
    explanation: "Компоненти - це будівельні блоки UI в Angular, які включають HTML-шаблон, TypeScript-клас і CSS-стилі.",
    effect: <Map className="w-6 h-6 text-orange-500 animate-bounce" />
  },
  {
    question: "RxJS і Observables в Angular - це що за звірі? 📡",
    options: [
      "Це як підписка на улюблений YouTube-канал: ти підписуєшся (subscribe) на потік даних (Observable) і отримуєш сповіщення, коли щось нове з'являється.",
      "Це коли твій код настільки реактивний, що вибухає від нових даних",
      "RxJS - це рецепти для JavaScript, а Observables - це дуже спостережливі компоненти"
    ],
    correct: 0,
    explanation: "RxJS - це бібліотека для реактивного програмування, що використовує Observables для роботи з асинхронними потоками даних та подіями.",
    effect: <RadioTower className="w-6 h-6 text-pink-500 animate-bounce" />
  },
  {
    question: "Що таке Angular Forms (Template-driven vs Reactive)? 📝 vs 🧪",
    options: [
      "Template-driven - це як малювання по номерах, HTML задає структуру. Reactive - це як хімічний експеримент, ви контролюєте все в коді!",
      "Template-driven форми для тих, хто любить шаблони, Reactive - для реактивних людей",
      "Це два способи створити форму: один легкий, інший - дуже складний"
    ],
    correct: 0,
    explanation: "Template-driven forms покладаються на директиви в шаблоні, а Reactive forms керуються класом компонента і надають більше гнучкості.",
    effect: <Filter className="w-6 h-6 text-teal-500 animate-pulse" />
  },
  {
    question: "Що таке Angular Router? 🛤️",
    options: [
      "Це як провідник у поїзді — веде тебе між компонентами без перезавантаження сторінки!",
      "Router — це коли Angular роумує по інтернету",
      "Це спеціальний роутер для Wi-Fi в Angular",
    ],
    correct: 0,
    explanation: "Angular Router керує навігацією в SPA, дозволяючи переходити між компонентами за URL.",
    effect: <Radar className="w-6 h-6 text-purple-500 animate-bounce" />
  },
];

const heroes: Hero[] = [
  {
    id: "react-wizard",
    name: "React Wizard",
    icon: <Wand2 className="w-8 h-8" />,
    description: "Майстер хуків та життєвих циклів",
    color: "blue",
    questions: reactQuestions,
    background: "from-blue-50 to-purple-50",
    powerIcon: <Magic className="w-6 h-6 text-blue-500" />,
    powerName: "Хук-заклинання"
  },
  {
    id: "vue-ninja",
    name: "Vue Ninja",
    icon: <Sword className="w-8 h-8" />,
    description: "Експерт з реактивності та компонентної магії",
    color: "green",
    questions: vueQuestions,
    background: "from-green-50 to-emerald-50",
    powerIcon: <Rocket className="w-6 h-6 text-green-500" />,
    powerName: "Реактивний удар"
  },
  {
    id: "angular-knight",
    name: "Angular Knight",
    icon: <Shield className="w-8 h-8" />,
    description: "Хранитель модулів та святий лицар DI",
    color: "red",
    questions: angularQuestions,
    background: "from-red-50 to-orange-50",
    powerIcon: <Syringe className="w-6 h-6 text-red-500" />,
    powerName: "Ін'єкція могутності"
  },
];

const endings: Endings = {
  good: {
    text: "✨ Рекрутер: Вау! Ти просто неймовірний! Готуй резюме, ми тебе забираємо! І так, твої жарти теж сподобались! 🌟",
    icon: <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />,
    description: "Ти довів, що володієш не тільки знаннями, але й почуттям гумору! Подвійна перемога! 🎉"
  },
  bad: {
    text: "💫 Рекрутер: Хм... Може, спробуєш стати стендап-коміком? Твої відповіді були... дуже креативними! 😅",
    icon: <XCircle className="w-12 h-12 text-red-500 animate-pulse" />,
    description: "Не засмучуйся! Навіть найкращі герої іноді промахуються. Спробуй ще раз! 🎯"
  },
  neutral: {
    text: "🎭 Рекрутер: Цікаво... Дуже цікаво... Настільки цікаво, що ми не знаємо, чи сміятися чи плакати! 🤔",
    icon: <Coffee className="w-12 h-12 text-brown-500 animate-spin" />,
    description: "Ти десь посередині між джуном і сеньйором. Час випити кави і повторити! ☕"
  }
};

const powerUpMessages: string[] = [
  "Супер комбо! 🎯",
  "Неймовірно! ⚡",
  "Ти рулиш! 🚀",
  "Просто вогонь! 🔥",
  "Геніально! 🧠"
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface ShuffledOption {
  text: string;
  originalIndex: number;
}

function App() {
  const [step, setStep] = useState<number>(-1);
  const [score, setScore] = useState<number>(0);
  const [ending, setEnding] = useState<EndingType>("");
  const [hero, setHero] = useState<Hero | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [playClick] = useSound(clickSfx);
  const [playWin] = useSound(winSfx);
  const [playFail] = useSound(failSfx);
  const [currentEffect, setCurrentEffect] = useState<ReactNode>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [powerUpMessage, setPowerUpMessage] = useState<string>("");
  const [combo, setCombo] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[][]>([]);
  const [showAnswerReview, setShowAnswerReview] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Frontend RPG Interview";
  }, []);

  useEffect(() => {
    if (hero) {
      const shuffled = hero.questions.map(q => 
        shuffleArray(q.options.map((text, originalIndex) => ({ text, originalIndex })))
      );
      setShuffledOptions(shuffled);
    }
  }, [hero]);

  const handleHeroPick = (choice: Hero) => {
    playClick();
    setHero(choice);
    setStep(0);
    setAnswerHistory([]);
  };

  const handleAnswerSelect = (index: number) => {
    playClick();
    setSelectedAnswer(index);
  };

  const handleAnswerConfirm = () => {
    if (selectedAnswer === null || !hero) return;

    const currentQuestion = hero.questions[step];
    const selectedOptionOriginalIndex = shuffledOptions[step][selectedAnswer].originalIndex;
    const isCorrect = selectedOptionOriginalIndex === currentQuestion.correct;
    
    setAnswerHistory([...answerHistory, {
      question: currentQuestion.question,
      selectedAnswer: shuffledOptions[step][selectedAnswer].text,
      correctAnswer: currentQuestion.options[currentQuestion.correct],
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
      setCurrentEffect(currentQuestion.effect);
      setCombo(combo + 1);
      if (combo >= 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setPowerUpMessage(powerUpMessages[Math.floor(Math.random() * powerUpMessages.length)]);
        setTimeout(() => setPowerUpMessage(""), 2000);
      }
    } else {
      setCombo(0);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const nextStep = step + 1;
    setShowExplanation(false);
    setCurrentEffect(null);
    setPowerUpMessage("");
    setSelectedAnswer(null);
    
    if (hero && nextStep < hero.questions.length) {
      setStep(nextStep);
    } else {
      let final: EndingType;
      if (score === hero?.questions.length) {
        final = 'good';
        playWin();
        setShowConfetti(true);
      } else if (score === 0) {
        final = 'bad';
        playFail();
      } else {
        final = 'neutral';
      }
      setEnding(final);
    }
  };

  const resetGame = () => {
    setStep(-1);
    setScore(0);
    setEnding("");
    setHero(null);
    setShowExplanation(false);
    setCurrentEffect(null);
    setShowConfetti(false);
    setPowerUpMessage("");
    setCombo(0);
    setSelectedAnswer(null);
    setAnswerHistory([]);
    setShowAnswerReview(false);
  };

  if (step === -1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-2 sm:p-6 flex items-center justify-center">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-center mb-8">🧙‍♂️ Frontend RPG Interview</h1>
          <p className="text-gray-600 mb-8 text-center">Обери свого героя та пройди співбесіду!</p>
          <div className="grid gap-4">
            {heroes.map((h) => (
              <motion.button
                key={h.id}
                onClick={() => handleHeroPick(h)}
                className={`p-4 rounded-xl text-left flex items-center gap-4 transition-all
                  ${h.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100' : h.color === 'green' ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`p-3 rounded-lg ${h.color === 'blue' ? 'bg-blue-100' : h.color === 'green' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {h.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{h.name}</h3>
                  <p className="text-gray-600">{h.description}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {h.powerIcon}
                  <span className="text-sm text-gray-500">{h.powerName}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (ending) {
    return (
      <motion.div
        className={`min-h-screen bg-gradient-to-br ${hero?.background || ''} p-2 sm:p-6 flex items-center justify-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {showConfetti && <Confetti />}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 max-w-xl w-full">
          <div className="flex justify-center mb-6">
            {endings[ending].icon}
          </div>
          <h1 className="text-2xl font-bold mb-4 text-center">🎉 Результати співбесіди</h1>
          <p className="text-lg mb-4 text-center">Твій герой: {hero?.name}</p>
          <p className="text-lg mb-4 text-center">{endings[ending].text}</p>
          <p className="text-gray-600 mb-6 text-center">{endings[ending].description}</p>
          <p className="text-xl mb-6 text-center">Правильних відповідей: {score} з {hero?.questions.length}</p>

          <div className="mb-6">
            <button
              onClick={() => setShowAnswerReview(!showAnswerReview)}
              className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
            >
              {showAnswerReview ? "Сховати відповіді" : "Переглянути відповіді"}
              <AlertCircle className="w-5 h-5" />
            </button>
          </div>

          {showAnswerReview && (
            <div className="mb-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Огляд відповідей:</h2>
              {answerHistory.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    answer.isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <p className="font-medium mb-2">{answer.question}</p>
                  <div className="flex items-start gap-2">
                    <div className={`mt-1 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {answer.isCorrect ? <Check className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        Твоя відповідь: {answer.selectedAnswer}
                      </p>
                      {!answer.isCorrect && (
                        <p className="text-green-600 mt-1">
                          Правильна відповідь: {answer.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <motion.button
            onClick={resetGame}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Спробувати ще раз
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        className={`min-h-screen bg-gradient-to-br ${hero?.background || ''} p-2 sm:p-6 flex items-center justify-center`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {showConfetti && <Confetti style={{ maxWidth: '100%' }}/>}
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Рівень {step + 1}/{hero?.questions.length}</h1>
              {combo > 2 && (
                <div className="hidden sm:block px-3 py-1 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800">
                  Комбо x{combo} 🔥
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${hero?.color === 'blue' ? 'bg-blue-100' : hero?.color === 'green' ? 'bg-green-100' : 'bg-red-100'}`}>
                {hero?.icon}
              </div>
              <span className="font-medium">{hero?.name}</span>
            </div>
          </div>
          
          {powerUpMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center text-xl font-bold text-purple-600 mb-4"
            >
              {powerUpMessage}
            </motion.div>
          )}
          
          <div className="mb-6">
            {hero && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-lg font-medium">{hero.questions[step].question}</p>
                  {currentEffect && <div className="ml-2">{currentEffect}</div>}
                </div>
                <div className="space-y-3">
                  {shuffledOptions[step]?.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      className={`w-full p-4 rounded-xl text-left transition-all
                        ${showExplanation 
                          ? opt.originalIndex === hero.questions[step].correct 
                            ? 'bg-green-100' 
                            : selectedAnswer === idx
                              ? 'bg-red-100'
                              : 'bg-gray-50'
                          : selectedAnswer === idx
                            ? 'bg-purple-100'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }
                        ${showExplanation && 'cursor-default'}`}
                      onClick={() => !showExplanation && handleAnswerSelect(idx)}
                      disabled={showExplanation}
                      whileHover={!showExplanation ? { scale: 1.01 } : {}}
                      whileTap={!showExplanation ? { scale: 0.99 } : {}}
                    >
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </div>

          {!showExplanation && selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleAnswerConfirm}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Check className="w-5 h-5" />
                Підтвердити відповідь
              </motion.button>
            </motion.div>
          )}

          {showExplanation && hero && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 rounded-xl"
            >
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Пояснення:
              </h3>
              <p className="text-gray-600">{hero.questions[step].explanation}</p>
            </motion.div>
          )}

          {showExplanation && hero && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step + 1 === hero.questions.length ? "Завершити" : "Наступне питання"}
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;