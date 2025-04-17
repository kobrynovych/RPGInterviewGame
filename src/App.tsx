import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import Confetti from 'react-confetti';
import { Wand2, Sword, Trophy, XCircle, Coffee, Sparkles, Zap, Heart, Star, Flame, Brain, Lightbulb, Rocket, Magnet as Magic } from 'lucide-react';

// Using direct URLs for sounds from a CDN
// const clickSfx = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';
// const winSfx = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';
// const failSfx = 'https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3';

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

type EndingType = keyof Endings | "";

// const questions = [
//   {
//     question: "Поясни hoisting в JS котику 🐱",
//     options: [
//       "Мур-мур, змінні як котики — спочатку підстрибують вгору файлу, але undefined, поки їх не погладили (ініціалізували).",
//       "Це як try-catch, тільки без try і без catch. Взагалі не пам’ятаю.",
//       "Коти не слухають пояснення. Вони самі себе хостять."
//     ],
//     correct: 0
//   },
//   {
//     question: "У вас дедлайн вчора. useEffect не працює. Що робиш?",
//     options: [
//       "Спочатку — глибокий вдих. Потім — console.log усього, включно з совістю.",
//       "Змінюю професію на баристу. Там менше стресу.",
//       "Іду в ліс. useEffect не працює в лісі — це вже точно."
//     ],
//     correct: 0
//   },
//   {
//     question: "Коли можна використовувати !important?",
//     options: [
//       "Лише в крайніх випадках. !important — як emergency-чай: не зловживати.",
//       "Ставлю !important на все. Якщо не працює — двічі!",
//       "!important — мій найкращий друг. Ми навіть код разом писали."
//     ],
//     correct: 0
//   },
//   {
//     question: "Що ти робиш, якщо компонент не ререндериться?",
//     options: [
//       "Перевіряю залежності useEffect та setState. Зазвичай там собака зарита.",
//       "Кричу на монітор. Це не допомагає, але відчуваю себе краще.",
//       "Перезапускаю все і сподіваюся, що прокляття знято."
//     ],
//     correct: 0
//   },
//   {
//     question: "Яка різниця між null і undefined?",
//     options: [
//       "undefined — коли не визначили, null — коли навмисно нічого.",
//       "null — це коли нуль, а undefined — це баг.",
//       "Це просто різні способи JS сказати: 'я не знаю, що ти хочеш'."
//     ],
//     correct: 0
//   }
// ];

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
  }
];

const endings: Endings = {
  good: {
    text: "✨ Рекрутер: Вау! Ти просто неймовірний! Готуй резюме, ми тебе забираємо! І так, твої жарти теж сподобались! 🌟",
    // text: "✅ Рекрутер: Нам все сподобалось. Вітаємо, оффер твій! І ще бонус за гумор 😎",
    icon: <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />,
    description: "Ти довів, що володієш не тільки знаннями, але й почуттям гумору! Подвійна перемога! 🎉"
  },
  bad: {
    text: "💫 Рекрутер: Хм... Може, спробуєш стати стендап-коміком? Твої відповіді були... дуже креативними! 😅",
    // text: "❌ Рекрутер: Дякуємо за час. Але ми шукаємо когось з... іншим баченням.",
    icon: <XCircle className="w-12 h-12 text-red-500 animate-pulse" />,
    description: "Не засмучуйся! Навіть найкращі герої іноді промахуються. Спробуй ще раз! 🎯"
  },
  neutral: {
    text: "🎭 Рекрутер: Цікаво... Дуже цікаво... Настільки цікаво, що ми не знаємо, чи сміятися чи плакати! 🤔",
    // text: "🤡 Рекрутер: Ми вам передзвонимо. Якщо щось… колись…",
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
  
  // Adding a new state to store shuffled options
  const [shuffledOptions, setShuffledOptions] = useState<string[][]>([]);

  useEffect(() => {
    document.title = "Frontend RPG Interview";
  }, []);

  // Update useEffect to initialize shuffled variants
  useEffect(() => {
    if (hero) {
      setShuffledOptions(hero.questions.map(q => shuffleArray(q.options)));
    }
  }, [hero]);

  const handleHeroPick = (choice: Hero) => {
    playClick();
    setHero(choice);
    setStep(0);
  };

  const handleAnswer = (index: number) => {
    playClick();
    if (hero && index === hero.questions[step].correct) {
      setScore(score + 1);
      setCurrentEffect(hero.questions[step].effect);
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
    
    if (hero && nextStep < hero.questions.length) {
      setStep(nextStep);
    } else {
      let final: EndingType;
      // if (hero && score + 1 === hero.questions.length) {
      if (hero && score === hero.questions.length) {
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
  };

  if (step === -1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-2 sm:p-6">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-center mb-8">🧙‍♂️ Frontend RPG Interview</h1>
          <p className="text-gray-600 mb-8 text-center">Обери свого героя та пройди співбесіду!</p>
          <div className="grid gap-4">
            {heroes.map((h) => (
              <motion.button
                key={h.id}
                onClick={() => handleHeroPick(h)}
                className={`p-4 rounded-xl text-left flex items-center gap-4 transition-all
                  ${h.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100' : 'bg-green-50 hover:bg-green-100'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`p-3 rounded-lg ${h.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'}`}>
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
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 max-w-xl w-full text-center">
          <div className="flex justify-center mb-6">
            {endings[ending].icon}
          </div>
          <h1 className="text-2xl font-bold mb-4">🎉 Результати співбесіди</h1>
          <p className="text-lg mb-4">Твій герой: {hero?.name}</p>
          <p className="text-lg mb-4">{endings[ending].text}</p>
          <p className="text-gray-600 mb-6">{endings[ending].description}</p>
          <p className="text-xl mb-6">Правильних відповідей: {score} з {hero?.questions.length}</p>
          <motion.button
            onClick={resetGame}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
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
        className={`min-h-screen bg-gradient-to-br ${hero?.background || ''} p-2 sm:p-6`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {showConfetti && <Confetti style={{ maxWidth: '100%' }}/>}
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* <h1 className="text-2xl font-bold">Рівень {step + 1}</h1> */}
              <h1 className="text-2xl font-bold">Рівень {step + 1}/{shuffledOptions.length}</h1>
              {combo > 2 && (
                <div className="hidden sm:block px-3 py-1 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800">
                  Комбо x{combo} 🔥
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${hero?.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'}`}>
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
                  {shuffledOptions[step]?.map((opt, idx) => {
                    // We find the original index of the correct answer
                    const originalIndex = hero.questions[step].options.indexOf(opt);
                    const isCorrect = originalIndex === hero.questions[step].correct;
                    
                    return (
                      <motion.button
                        key={idx}
                        className={`w-full p-4 rounded-xl text-left transition-all
                          ${showExplanation 
                            ? isCorrect
                              ? 'bg-green-100' 
                              : 'bg-red-50'
                            : 'bg-gray-50 hover:bg-gray-100'
                          }
                          ${showExplanation && 'cursor-default'}`}
                        onClick={() => !showExplanation && handleAnswer(originalIndex)}
                        disabled={showExplanation}
                        whileHover={!showExplanation ? { scale: 1.01 } : {}}
                        whileTap={!showExplanation ? { scale: 0.99 } : {}}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

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