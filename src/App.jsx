import React, { useEffect, useMemo, useState } from "react";

const FALLBACK = {
  marketplaceItems: [
    {
      id: 1,
      title: "Станок промышленный X-100",
      minOrder: "5 шт.",
      region: "Москва",
      price: "от 15 000 ₽",
      rating: 4.8,
      deals: 120,
      image:
        "https://plus.unsplash.com/premium_photo-1664303499312-917c50e411fe?q=80&w=400&auto=format&fit=crop",
      top: true,
    },
    {
      id: 2,
      title: "Набор креплений ProFix",
      minOrder: "50 шт.",
      region: "Казань",
      price: "от 850 ₽",
      rating: 4.5,
      deals: 84,
      image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=400&auto=format&fit=crop",
      top: false,
    },
  ],
  tenders: [
    {
      id: 1,
      title: "Закупка 500 кг нержавеющей стали 12Х18Н10Т",
      company: "ООО МеталлСервис",
      dueDate: "15.03.2026",
      offers: 4,
      urgent: true,
    },
  ],
  subscriptions: [
    {
      key: "basic",
      title: "Базовый",
      price: "0 ₽",
      period: "/ мес",
      features: ["До 5 объявлений", "Доступ к поиску"],
      cta: "Текущий план",
      theme: "basic",
    },
    {
      key: "standard",
      title: "Стандарт",
      price: "2 900 ₽",
      period: "/ мес",
      features: [
        "Приоритет в поиске",
        "До 50 объявлений",
        "Базовая аналитика",
      ],
      cta: "Выбрать",
      theme: "standard",
      badge: "ПОПУЛЯРНЫЙ",
    },
    {
      key: "premium",
      title: "Премиум",
      price: "9 900 ₽",
      period: "/ мес",
      features: ['Значок "ТОП"', "Закреп в категории", "Расширенная аналитика"],
      cta: "Заказать VIP",
      theme: "premium",
    },
  ],
  profile: {
    companyName: 'ООО "ПромСнаб-Мост"',
    inn: "7701234567",
    requisites: "р/с 40702810900000000001, АО Банк Развития, БИК 044525225",
    description: "Оптовые поставки металлопроката и крепежа по РФ.",
    logoUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=300&auto=format&fit=crop",
    region: "Москва",
    rating: 4.9,
    deals: 152,
    accountType: "supplier",
    documents: [
      { name: "Устав_компании.pdf", type: "application/pdf", size: 284553 },
      { name: "Свидетельство_ИНН.pdf", type: "application/pdf", size: 145092 },
    ],
    reviews: [
      {
        id: "r1",
        author: "ООО СтройМаркет",
        score: 5,
        text: "Поставки в срок, документы всегда в порядке.",
      },
      {
        id: "r2",
        author: "ИП ЛогистикПро",
        score: 4.8,
        text: "Оперативная обратная связь и гибкие условия отгрузки.",
      },
    ],
    referralLink: "most.ru/ref/id42",
  },
};

const FEATURES = [
  {
    title: "Умный поиск",
    text: "Фильтры по региону, категориям и рейтингу для быстрого нахождения лучшей цены.",
    box: "bg-blue-100",
    color: "text-blue-600",
    path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    title: "Тендеры",
    text: "Публикуйте запросы и выбирайте лучшее предложение от проверенных поставщиков.",
    box: "bg-green-100",
    color: "text-green-600",
    path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Аналитика",
    text: "Следите за просмотрами ваших объявлений и эффективностью воронки продаж.",
    box: "bg-violet-100",
    color: "text-violet-600",
    path: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const REGISTER_FORM_INIT = {
  accountType: "supplier",
  companyName: "",
  inn: "",
  requisites: "",
  description: "",
  region: "",
  logoUrl: "",
  documents: [],
};

function getAccountTypeLabel(type) {
  return type === "buyer" ? "Покупатель" : "Поставщик";
}

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [authOpen, setAuthOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authStep, setAuthStep] = useState(1);
  const [login, setLogin] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [registrationToken, setRegistrationToken] = useState("");
  const [registerForm, setRegisterForm] = useState(REGISTER_FORM_INIT);
  const [data, setData] = useState(FALLBACK);
  const [profileData, setProfileData] = useState(FALLBACK.profile);
  const [message, setMessage] = useState("");

  const modalOpen = useMemo(() => authOpen || chatOpen, [authOpen, chatOpen]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/bootstrap");
        if (!res.ok) throw new Error();
        const payload = await res.json();
        if (mounted) {
          setData(payload);
          if (payload.profile) setProfileData(payload.profile);
        }
      } catch {
        if (mounted) setMessage("Сервер не отвечает, использованы локальные данные.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
  }, [modalOpen]);

  const sectionClass = (id, maxw) =>
    `section ${activeSection === id ? "active-section" : "hidden-section"} ${maxw} mx-auto px-4 sm:px-6 lg:px-8`;
  const profile = profileData || data.profile;

  function go(section) {
    if (section === "profile" && !authed) return openAuth();
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openAuth(mode = "login") {
    setAuthMode(mode);
    setAuthOpen(true);
    setAuthStep(1);
    setCode(["", "", "", "", "", ""]);
    setRegistrationToken("");
    setRegisterForm(REGISTER_FORM_INIT);
  }

  function formatPhoneValue(rawValue) {
    const digitsOnly = rawValue.replace(/\D/g, "");
    if (!digitsOnly) return rawValue === "" ? "" : "+7 (";

    let localDigits = digitsOnly;
    if (localDigits.startsWith("7") || localDigits.startsWith("8")) {
      localDigits = localDigits.slice(1);
    }
    localDigits = localDigits.slice(0, 10);

    let result = "+7 (";
    result += localDigits.slice(0, 3);
    if (localDigits.length >= 3) result += ")";
    if (localDigits.length > 3) result += ` ${localDigits.slice(3, 6)}`;
    if (localDigits.length > 6) result += `-${localDigits.slice(6, 8)}`;
    if (localDigits.length > 8) result += `-${localDigits.slice(8, 10)}`;
    return result;
  }

  function handleLoginChange(rawValue) {
    const hasEmailChars = /[a-zA-Z@]/.test(rawValue);
    if (hasEmailChars) {
      setLogin(rawValue);
      return;
    }

    setLogin(formatPhoneValue(rawValue));
  }

  async function sendCode() {
    if (!login.trim()) return setMessage("Введите телефон или email.");
    if (!login.includes("@")) {
      const phoneDigits = login.replace(/\D/g, "");
      if (phoneDigits.length !== 11) {
        return setMessage("Введите номер полностью: +7 (000) 000-00-00");
      }
    }
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: login.trim(), mode: authMode }),
    });
    const payload = await res.json();
    if (!res.ok) return setMessage(payload.message || "Ошибка отправки кода.");
    if (typeof payload.testCode === "string" && /^\d{6}$/.test(payload.testCode)) {
      setCode(payload.testCode.split(""));
      setMessage("Тестовый код подставлен автоматически.");
    } else {
      setCode(["", "", "", "", "", ""]);
      setMessage("Код отправлен.");
    }
    setAuthStep(2);
  }

  async function verifyCode() {
    const value = code.join("");
    if (value.length !== 6) return setMessage("Введите 6 цифр.");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value, login, mode: authMode }),
    });
    const payload = await res.json();
    if (!res.ok) return setMessage(payload.message || "Ошибка авторизации.");

    if (payload.requiresRegistration) {
      setRegistrationToken(payload.registrationToken || "");
      setAuthStep(3);
      setMessage("Код подтвержден. Заполните профиль компании.");
      return;
    }

    setAuthed(true);
    setAuthOpen(false);
    setActiveSection("profile");
    if (payload.user) setProfileData(payload.user);
    setMessage(`Вход выполнен: ${payload.user?.companyName || "Профиль"}`);
  }

  function updateRegisterField(field, value) {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleDocumentsChange(files) {
    const mapped = Array.from(files || []).map((file) => ({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size || 0,
    }));
    updateRegisterField("documents", mapped);
  }

  async function completeRegistration() {
    const requiredFields = [
      registerForm.companyName,
      registerForm.inn,
      registerForm.requisites,
      registerForm.description,
      registerForm.region,
    ];

    if (requiredFields.some((item) => !String(item || "").trim())) {
      return setMessage("Заполните все обязательные поля профиля.");
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: login.trim(),
        registrationToken,
        accountType: registerForm.accountType,
        companyName: registerForm.companyName,
        inn: registerForm.inn,
        requisites: registerForm.requisites,
        description: registerForm.description,
        region: registerForm.region,
        logoUrl: registerForm.logoUrl,
        documents: registerForm.documents,
      }),
    });

    const payload = await res.json();
    if (!res.ok) return setMessage(payload.message || "Ошибка регистрации.");

    setAuthed(true);
    setAuthOpen(false);
    setActiveSection("profile");
    if (payload.user) setProfileData(payload.user);
    setMessage(`Профиль создан: ${payload.user?.companyName || "Компания"}`);
  }

  function setDigit(index, nextValue) {
    const digit = nextValue.replace(/\D/g, "").slice(0, 1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button className="flex items-center gap-2" onClick={() => go("home")}>
              <IconBridge />
              <span className="text-2xl font-bold tracking-tight text-blue-600 italic">МОСТ</span>
            </button>
            <div className="hidden md:flex space-x-8 items-center text-sm font-medium text-slate-600">
              <button onClick={() => go("marketplace")} className="nav-link">Маркетплейс</button>
              <button onClick={() => go("tenders")} className="nav-link">Тендеры</button>
              <button onClick={() => go("subscriptions")} className="nav-link">Подписки</button>
            </div>
            {!authed ? (
              <button onClick={() => openAuth("login")} className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-semibold">Войти</button>
            ) : (
              <button onClick={() => go("profile")} className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200"><IconProfile /></button>
            )}
          </div>
        </div>
      </nav>

      <main className="mt-20 pb-20">
        <section id="home" className={sectionClass("home", "max-w-7xl")}>
          <div className="py-12 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Ваш надежный <span className="text-blue-600">мост</span> <br />к выгодным поставкам
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">B2B-платформа для упрощения онлайн-поставок, поиска товаров и расширения клиентской базы.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => go("marketplace")} className="btn-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg">Найти товар</button>
              <button onClick={() => openAuth("register")} className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">Стать поставщиком</button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {FEATURES.map((item) => (
              <article key={item.title} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className={`w-12 h-12 ${item.box} rounded-lg flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 ${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.path} /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="marketplace" className={sectionClass("marketplace", "max-w-7xl")}>
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-4">Фильтры</h3>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Применить</button>
              </div>
            </aside>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-6">Найдено <span className="text-blue-600">{data.marketplaceItems.length}</span> товара</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.marketplaceItems.map((item) => (
                  <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="h-48 bg-slate-200 relative">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                      {item.top ? <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">ТОП</span> : null}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-1 text-yellow-500 mb-2"><IconStar /><span className="text-xs font-bold text-slate-800">{item.rating} ({item.deals} сделок)</span></div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-sm mb-4">Минимальный заказ: {item.minOrder}. Регион: {item.region}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-slate-900">{item.price}</span>
                        <button onClick={() => setChatOpen(true)} className="p-2 rounded-full border border-slate-200 hover:bg-slate-50"><IconMessage /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="tenders" className={sectionClass("tenders", "max-w-5xl")}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold">Активные тендеры</h2>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md">Опубликовать запрос</button>
          </div>
          <div className="space-y-4">
            {data.tenders.map((tender) => (
              <article key={tender.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  {tender.urgent ? <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-2">СРОЧНО</div> : null}
                  <h3 className="text-xl font-bold">{tender.title}</h3>
                  <p className="text-slate-500 text-sm">Размещено {tender.company} • до {tender.dueDate}</p>
                </div>
                <div className="text-right"><div className="text-lg font-bold mb-2">Предложений: {tender.offers}</div><button className="px-6 py-2 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-colors">Участвовать</button></div>
              </article>
            ))}
          </div>
        </section>

        <section id="subscriptions" className={sectionClass("subscriptions", "max-w-6xl")}>
          <h2 className="text-3xl font-extrabold text-center mb-12">Выберите свой план роста</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {data.subscriptions.map((plan) => (
              <article key={plan.key} className={plan.theme === "premium" ? "bg-slate-900 text-white p-8 rounded-3xl border border-slate-800" : plan.theme === "standard" ? "bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-xl relative" : "bg-white p-8 rounded-3xl border border-slate-200"}>
                {plan.badge ? <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-bold">{plan.badge}</div> : null}
                <h3 className={`text-xl font-bold mb-4 italic ${plan.theme === "premium" ? "text-blue-400" : ""}`}>{plan.title}</h3>
                <div className="text-4xl font-black mb-6">{plan.price} <span className={`text-sm font-normal ${plan.theme === "premium" ? "text-slate-500" : "text-slate-400"}`}>{plan.period}</span></div>
                <ul className={`space-y-3 mb-8 ${plan.theme === "premium" ? "text-slate-300" : "text-slate-600"}`}>
                  {plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><IconCheck color={plan.theme === "premium" ? "text-blue-400" : "text-green-500"} />{feature}</li>)}
                </ul>
                <button className={plan.theme === "premium" ? "w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors" : plan.theme === "standard" ? "btn-primary w-full py-3 text-white rounded-xl font-bold shadow-md" : "w-full py-3 border border-slate-300 rounded-xl font-bold hover:bg-slate-50"}>{plan.cta}</button>
              </article>
            ))}
          </div>
        </section>

        <section id="profile" className={sectionClass("profile", "max-w-5xl")}>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700" />
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
                  {profile.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt="Логотип компании"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center font-bold text-2xl text-blue-600">
                      ООО
                    </div>
                  )}
                </div>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">Редактировать</button>
              </div>
              <h2 className="text-3xl font-bold mb-2">{profile.companyName}</h2>
              <p className="text-slate-500 mb-6">{profile.description}</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-400 uppercase">ИНН / реквизиты</div>
                  <div className="text-sm font-semibold mt-1">{profile.inn || "Не указано"}</div>
                  <div className="text-xs text-slate-600 mt-1">{profile.requisites || "Не указано"}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-400 uppercase">Регион / тип аккаунта</div>
                  <div className="text-sm font-semibold mt-1">{profile.region || "Не указано"}</div>
                  <div className="text-xs text-slate-600 mt-1">{getAccountTypeLabel(profile.accountType)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-xl"><div className="text-xs text-slate-400 uppercase">Рейтинг</div><div className="text-lg font-bold">{profile.rating}</div></div>
                <div className="p-4 bg-slate-50 rounded-xl"><div className="text-xs text-slate-400 uppercase">Сделок</div><div className="text-lg font-bold">{profile.deals}</div></div>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="font-bold mb-2">Реферальная ссылка</h3>
                <div className="flex gap-2">
                  <input type="text" readOnly value={profile.referralLink} className="flex-1 bg-white border border-blue-200 text-xs p-2 rounded" />
                  <button className="p-2 bg-blue-600 rounded-lg text-white">Коп.</button>
                </div>
              </div>
              <div className="mt-6 p-6 bg-white rounded-2xl border border-slate-200">
                <h3 className="font-bold mb-3">Документы компании</h3>
                {(profile.documents || []).length ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {(profile.documents || []).map((doc) => (
                      <li key={`${doc.name}-${doc.size}`} className="flex justify-between gap-4">
                        <span>{doc.name}</span>
                        <span className="text-slate-400">{Math.max(1, Math.round((doc.size || 0) / 1024))} КБ</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">Документы пока не загружены.</p>
                )}
              </div>
              <div className="mt-6 p-6 bg-white rounded-2xl border border-slate-200">
                <h3 className="font-bold mb-3">Отзывы</h3>
                {(profile.reviews || []).length ? (
                  <div className="space-y-3">
                    {(profile.reviews || []).map((review, index) => (
                      <article key={review.id || index} className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold text-sm">{review.author || "Покупатель"}</span>
                          <span className="text-sm text-blue-600 font-semibold">{review.score || "5.0"}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{review.text || "Без комментария"}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Пока нет отзывов.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {message ? <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-xl">{message}</div> : null}

      {authOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="modal-overlay absolute inset-0" onClick={() => setAuthOpen(false)} />
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full relative z-10 shadow-2xl">
            <button onClick={() => setAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><IconClose /></button>
            <h3 className="text-2xl font-bold mb-2">{authMode === "register" ? "Создать профиль" : "Войти"}</h3>
            <p className="text-slate-500 text-sm mb-6">
              {authMode === "register"
                ? "Создайте профиль, чтобы продолжить работу"
                : "Авторизуйтесь, чтобы продолжить работу"}
            </p>

            {authStep === 1 && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Телефон или Email</label>
                <input type="text" value={login} onFocus={() => !login && setLogin("+7 (")} onChange={(e) => handleLoginChange(e.target.value)} placeholder="+7 (000) 000-00-00" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <button onClick={sendCode} className="btn-primary w-full py-3 text-white rounded-xl font-bold shadow-md mt-4">Получить код</button>
              </div>
            )}

            {authStep === 2 && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Код из сообщения</label>
                <div className="flex justify-between gap-2 mt-1">
                  {code.map((digit, i) => <input key={i} value={digit} onChange={(e) => setDigit(i, e.target.value)} maxLength={1} className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-bold" />)}
                </div>
                <button onClick={verifyCode} className="btn-primary w-full py-3 text-white rounded-xl font-bold shadow-md mt-4">Подтвердить</button>
              </div>
            )}

            {authStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Тип аккаунта</label>
                  <select
                    value={registerForm.accountType}
                    onChange={(e) => updateRegisterField("accountType", e.target.value)}
                    className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="supplier">Поставщик</option>
                    <option value="buyer">Покупатель</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={registerForm.companyName}
                    onChange={(e) => updateRegisterField("companyName", e.target.value)}
                    placeholder="Название компании"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={registerForm.inn}
                    onChange={(e) => updateRegisterField("inn", e.target.value)}
                    placeholder="ИНН / реквизиты"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <input
                  type="text"
                  value={registerForm.requisites}
                  onChange={(e) => updateRegisterField("requisites", e.target.value)}
                  placeholder="Банковские реквизиты"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />

                <input
                  type="text"
                  value={registerForm.region}
                  onChange={(e) => updateRegisterField("region", e.target.value)}
                  placeholder="Регион"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />

                <input
                  type="text"
                  value={registerForm.logoUrl}
                  onChange={(e) => updateRegisterField("logoUrl", e.target.value)}
                  placeholder="Ссылка на логотип (опционально)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />

                <textarea
                  value={registerForm.description}
                  onChange={(e) => updateRegisterField("description", e.target.value)}
                  placeholder="Описание компании"
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Документы компании</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleDocumentsChange(e.target.files)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  {!!registerForm.documents.length && (
                    <div className="mt-2 text-xs text-slate-500">
                      Загружено: {registerForm.documents.map((doc) => doc.name).join(", ")}
                    </div>
                  )}
                </div>

                <button onClick={completeRegistration} className="btn-primary w-full py-3 text-white rounded-xl font-bold shadow-md">Завершить регистрацию</button>
              </div>
            )}

            <p className="text-[10px] text-slate-400 mt-6 text-center leading-tight">
              Нажимая на кнопку, я соглашаюсь с правилами пользования торговой площадки и политикой конфиденциальности.
            </p>
          </div>
        </div>
      ) : null}

      {chatOpen ? (
        <div className="fixed bottom-4 right-4 z-[100]">
          <div className="bg-white w-80 sm:w-96 h-[500px] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <div><div className="text-sm font-bold">Менеджер TechDrive</div><div className="text-[10px] opacity-80 italic">Онлайн</div></div>
              <button onClick={() => setChatOpen(false)}><IconClose /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
              <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none mr-8">Приветствуем! По какому товару у вас вопрос?</div>
              <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none ml-8">Интересует X-100. Какая скидка при заказе от 20 шт?</div>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-2">
              <input type="text" placeholder="Пишите..." className="flex-1 bg-slate-50 border-none rounded-full px-4 text-sm focus:ring-0" />
              <button className="p-2 bg-blue-600 text-white rounded-full">→</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="project-watermark" aria-hidden="true" />
    </>
  );
}

function IconBridge() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M3 12C3 12 5 6 12 6C19 6 21 12 21 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 12C3 12 5 18 12 18C19 18 21 12 21 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 9V15" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconProfile() {
  return <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}

function IconStar() {
  return <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
}

function IconMessage() {
  return <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
}

function IconCheck({ color }) {
  return <svg className={`w-5 h-5 ${color}`} fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>;
}

function IconClose() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" /></svg>;
}

export default App;
