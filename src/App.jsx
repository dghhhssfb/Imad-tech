import React, { useEffect, useState } from "react";

const TRANSLATIONS = {
  ar: {
    name: "Imad Tech",
    addProduct: "إضافة منتج",
    adminLogin: "دخول المدير",
    products: "المنتجات",
    cart: "السلة",
    checkout: "الدفع",
    price: "السعر",
    description: "الوصف",
    rating: "التقييم",
    contact: "تواصل معنا",
    support: "دعم فني",
    payWith: "الدفع عبر",
    placeOrder: "تأكيد الطلب",
    emptyCart: "السلة فارغة",
    changeLang: "English",
    add: "إضافة",
    remove: "إزالة",
    total: "المجموع",
    noProducts: "لا توجد منتجات حاليًا.",
    adminPanel: "لوحة المدير",
    storeInfo: "معلومات المتجر",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    deliveryPolicy: "سياسة التوصيل",
    save: "حفظ",
    close: "إغلاق",
    productName: "اسم المنتج",
    imageUrl: "رابط صورة المنتج",
    productDescription: "وصف المنتج",
    required: "الاسم والسعر مطلوبان",
    productAdded: "تمت إضافة المنتج",
    infoSaved: "تم حفظ معلومات المتجر",
    password: "كلمة مرور المدير",
    wrongPassword: "كلمة المرور غير صحيحة",
    login: "دخول",
    light: "فاتح",
    dark: "داكن",
    storeDescription: "متجر إلكترونيات صغير ومحترف",
    supportPage: "صفحة الدعم الفني",
    orderCreated: "تم إنشاء الطلب",
    serverError: "حدث خطأ في الاتصال بالخادم.",
  },
  en: {
    name: "Imad Tech",
    addProduct: "Add Product",
    adminLogin: "Admin Login",
    products: "Products",
    cart: "Cart",
    checkout: "Checkout",
    price: "Price",
    description: "Description",
    rating: "Rating",
    contact: "Contact us",
    support: "Support",
    payWith: "Pay with",
    placeOrder: "Place order",
    emptyCart: "Cart is empty",
    changeLang: "العربية",
    add: "Add",
    remove: "Remove",
    total: "Total",
    noProducts: "No products available.",
    adminPanel: "Admin Panel",
    storeInfo: "Store Information",
    email: "Email",
    phone: "Phone",
    deliveryPolicy: "Delivery policy",
    save: "Save",
    close: "Close",
    productName: "Product name",
    imageUrl: "Product image URL",
    productDescription: "Product description",
    required: "Name and price are required",
    productAdded: "Product added",
    infoSaved: "Store information saved",
    password: "Admin password",
    wrongPassword: "Incorrect password",
    login: "Login",
    light: "Light",
    dark: "Dark",
    storeDescription: "Professional small electronics store",
    supportPage: "Technical support",
    orderCreated: "Order created",
    serverError: "Server connection error.",
  },
};

const DEFAULT_ADMIN_PASSWORD = "control";

function loadJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState("ar");
  const [dir, setDir] = useState("rtl");
  const [dark, setDark] = useState(false);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [adminMode, setAdminMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const t = TRANSLATIONS[lang];

  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storePolicy, setStorePolicy] = useState("");

  useEffect(() => {
    const savedProducts = loadJSON("imadtech_products", []);
    const savedCart = loadJSON("imadtech_cart", []);

    setProducts(savedProducts);
    setCart(savedCart);

    const savedLang = localStorage.getItem("imadtech_lang");

    if (savedLang === "en") {
      setLang("en");
      setDir("ltr");
    }

    const savedTheme = localStorage.getItem("imadtech_theme");

    if (savedTheme === "dark") {
      setDark(true);
    }

    setStoreEmail(
      localStorage.getItem("imadtech_store_email") || ""
    );

    setStorePhone(
      localStorage.getItem("imadtech_store_phone") || ""
    );

    setStorePolicy(
      localStorage.getItem("imadtech_store_policy") || ""
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "imadtech_products",
      JSON.stringify(products)
    );
  }, [products]);

  useEffect(() => {
    localStorage.setItem(
      "imadtech_cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("imadtech_lang", lang);
  }, [lang, dir]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(
      "imadtech_theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  function toggleLanguage() {
    const nextLang = lang === "ar" ? "en" : "ar";

    setLang(nextLang);
    setDir(nextLang === "ar" ? "rtl" : "ltr");
  }

  function handleAdminLogin() {
    const configuredPassword =
      import.meta.env.VITE_ADMIN_PASSWORD ||
      DEFAULT_ADMIN_PASSWORD;

    if (adminPassword === configuredPassword) {
      setAdminMode(true);
      setShowLogin(false);
      setAdminPassword("");
    } else {
      alert(t.wrongPassword);
    }
  }

  function addProduct(product) {
    setProducts((current) => [product, ...current]);
  }

  function deleteProduct(id) {
    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          qty: 1,
        },
      ];
    });
  }

  function removeFromCart(id) {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function changeQty(id, qty) {
    const newQty = Math.max(1, Number(qty) || 1);

    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, qty: newQty }
          : item
      )
    );
  }

  function rateProduct(id, score) {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const oldRating = Number(product.rating || 0);

        const newRating =
          oldRating === 0
            ? score
            : Math.round((oldRating + score) / 2);

        return {
          ...product,
          rating: newRating,
        };
      })
    );
  }

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  async function placeOrder(paymentMethod) {
    if (cart.length === 0) {
      alert(t.emptyCart);
      return;
    }

    const order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      total: cartTotal,
      lang,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "/.netlify/functions/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          `${t.orderCreated}: ${order.id}\n${
            data.message || ""
          }`
        );

        setCart([]);
      } else {
        alert(
          data.error ||
            "حدث خطأ أثناء إنشاء الطلب."
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        `${t.serverError}\n\n${
          error.message || ""
        }`
      );
    }
  }

  function saveStoreInfo() {
    localStorage.setItem(
      "imadtech_store_email",
      storeEmail
    );

    localStorage.setItem(
      "imadtech_store_phone",
      storePhone
    );

    localStorage.setItem(
      "imadtech_store_policy",
      storePolicy
    );

    alert(t.infoSaved);
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      <header className="max-w-6xl mx-auto p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center shadow font-bold">
            {t.name[0]}
          </div>

          <div>
            <h1 className="font-bold text-lg">
              {t.name}
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.storeDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-md border dark:border-gray-600"
          >
            {t.changeLang}
          </button>

          <button
            onClick={() => setDark((value) => !value)}
            className="px-3 py-2 rounded-md border dark:border-gray-600"
          >
            {dark ? t.light : t.dark}
          </button>

          <button
            onClick={() =>
              alert(t.supportPage)
            }
            className="px-3 py-2 rounded-md border dark:border-gray-600"
          >
            {t.support}
          </button>

          <button
            onClick={() => setShowLogin(true)}
            className="px-3 py-2 rounded-md bg-blue-600 text-white"
          >
            {t.adminLogin}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {t.products}
            </h2>

            <div className="text-sm">
              {cart.length} {t.cart}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              {t.noProducts}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/400x300?text=Product"
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />

                  <h3 className="font-semibold text-lg">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 gap-3">
                    <div>
                      <div className="text-lg font-bold">
                        ${product.price}
                      </div>

                      <div className="text-sm">
                        {t.rating}:{" "}
                        {product.rating || "—"}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        addToCart(product)
                      }
                      className="px-3 py-2 rounded bg-blue-600 text-white"
                    >
                      {t.add}
                    </button>
                  </div>

                  <div className="flex gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map(
                      (score) => (
                        <button
                          key={score}
                          onClick={() =>
                            rateProduct(
                              product.id,
                              score
                            )
                          }
                          className="text-sm px-2 py-1 border rounded dark:border-gray-600"
                        >
                          {score}
                        </button>
                      )
                    )}
                  </div>

                  {adminMode && (
                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="mt-3 text-sm text-red-500"
                    >
                      {t.remove}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg lg:sticky lg:top-4 h-fit">
          <h3 className="font-semibold mb-4">
            {t.cart}
          </h3>

          {cart.length === 0 ? (
            <div className="text-gray-500">
              {t.emptyCart}
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b dark:border-gray-700 pb-3"
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      <div className="font-medium">
                        {item.name}
                      </div>

                      <div className="text-sm text-gray-500">
                        ${item.price}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="text-red-500 text-sm"
                    >
                      {t.remove}
                    </button>
                  </div>

                  <div className="mt-2">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(event) =>
                        changeQty(
                          item.id,
                          event.target.value
                        )
                      }
                      className="w-20 p-2 rounded border text-black"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-between border-t dark:border-gray-700 pt-3">
                <span>{t.total}</span>

                <strong>
                  ${cartTotal.toFixed(2)}
                </strong>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    placeOrder("mastercard")
                  }
                  className="px-3 py-3 rounded bg-green-600 text-white"
                >
                  {t.payWith} Mastercard
                </button>

                <button
                  onClick={() =>
                    placeOrder("zaincash")
                  }
                  className="px-3 py-3 rounded bg-yellow-500 text-black"
                >
                  {t.payWith} ZainCash
                </button>
              </div>
            </div>
          )}
        </aside>
      </main>

      <footer className="text-center p-8 text-sm text-gray-500">
        <div>
          © {new Date().getFullYear()} {t.name}
        </div>

        <div className="mt-3">
          {storeEmail && (
            <a
              href={`mailto:${storeEmail}`}
              className="underline"
            >
              {storeEmail}
            </a>
          )}

          {storePhone && (
            <>
              <span className="mx-2">|</span>

              <a
                href={`tel:${storePhone}`}
                className="underline"
              >
                {storePhone}
              </a>
            </>
          )}
        </div>

        {storePolicy && (
          <div className="mt-3 max-w-2xl mx-auto">
            {storePolicy}
          </div>
        )}
      </footer>

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">
              {t.adminLogin}
            </h3>

            <input
              type="password"
              value={adminPassword}
              onChange={(event) =>
                setAdminPassword(
                  event.target.value
                )
              }
              placeholder={t.password}
              className="w-full p-3 border rounded text-black mb-3"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAdminLogin();
                }
              }}
            />

            <div className="flex gap-2">
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-4 py-2 rounded bg-blue-600 text-white"
              >
                {t.login}
              </button>

              <button
                onClick={() => {
                  setShowLogin(false);
                  setAdminPassword("");
                }}
                className="px-4 py-2 rounded border"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {adminMode && (
        <AdminArea
          t={t}
          onAdd={addProduct}
          onClose={() => setAdminMode(false)}
          storeEmail={storeEmail}
          setStoreEmail={setStoreEmail}
          storePhone={storePhone}
          setStorePhone={setStorePhone}
          storePolicy={storePolicy}
          setStorePolicy={setStorePolicy}
          onSaveStoreInfo={saveStoreInfo}
        />
      )}
    </div>
  );
}

function AdminArea({
  t,
  onAdd,
  onClose,
  storeEmail,
  setStoreEmail,
  storePhone,
  setStorePhone,
  storePolicy,
  setStorePolicy,
  onSaveStoreInfo,
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] =
    useState("");
  const [image, setImage] = useState("");

  function handleAdd() {
    if (!name.trim() || !price) {
      alert(t.required);
      return;
    }

    const product = {
      id: `P-${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      image: image.trim(),
      rating: 0,
    };

    onAdd(product);

    setName("");
    setPrice("");
    setDescription("");
    setImage("");

    alert(t.productAdded);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-40 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {t.adminPanel}
          </h2>

          <button
            onClick={onClose}
            className="px-3 py-2 border rounded"
          >
            {t.close}
          </button>
        </div>

        <section>
          <h3 className="font-semibold mb-3">
            {t.storeInfo}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={storeEmail}
              onChange={(event) =>
                setStoreE
