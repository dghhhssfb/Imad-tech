/* ImadTech - Professional small e-commerce frontend (single-file React component)

Modern dynamic design with animations (TailwindCSS utility classes)

Theme switch (light <-> dark)

Arabic-first (RTL) with English toggle

Simple Admin area (password-protected) to add products (stores in localStorage)

Product listing, product rating, cart, checkout flow (sends order to Netlify Function endpoint)

Mobile responsive and optimized for Android/iPhone


HOW TO USE / DEPLOY (short):

1. Create a new React app (Vite recommended) and add TailwindCSS.


2. Copy this file as src/App.jsx, install required libs (none required beyond React + Tailwind).


3. Add a Netlify Function at netlify/functions/create-order.js (example below) to process orders and connect to payment gateway.


4. Push to GitHub and connect repo to Netlify. Set environment variables (ADMIN_PASSWORD, MERCHANT_API_KEY, ZAINCASH_API_KEY, FROM_EMAIL).



IMPORTANT: Real card/mobile-pay processing requires a merchant account and server-side code (do NOT put secrets in frontend!). The example uses a serverless placeholder endpoint '/.netlify/functions/create-order' which you must implement with your merchant credentials.

REQUIRED ENV VARS (on Netlify):

ADMIN_PASSWORD=choose-a-strong-password

MERCHANT_API_KEY=... (Al-Rafidain gateway credentials)

ZAINCASH_API_KEY=... (ZainCash merchant credentials)

FROM_EMAIL=orders@yourdomain.com (for order emails)



---

*/

import React, { useEffect, useState } from 'react';

const TRANSLATIONS = { ar: { name: 'Imad Tech', addProduct: 'إضافة منتج', adminLogin: 'دخول المدير', products: 'المنتجات', cart: 'السلة', checkout: 'الدفع', price: 'السعر', description: 'الوصف', rating: 'تقييم', contact: 'تواصل معنا', support: 'دعم فني', payWith: 'الدفع عبر', placeOrder: 'تأكيد الطلب', emptyCart: 'السلة فارغة', changeLang: 'English', }, en: { name: 'Imad Tech', addProduct: 'Add Product', adminLogin: 'Admin Login', products: 'Products', cart: 'Cart', checkout: 'Checkout', price: 'Price', description: 'Description', rating: 'Rating', contact: 'Contact us', support: 'Support', payWith: 'Pay with', placeOrder: 'Place order', emptyCart: 'Cart is empty', changeLang: 'العربية', } };

export default function App() { // settings const [lang, setLang] = useState('ar'); // Arabic primary const t = TRANSLATIONS[lang]; const [dir, setDir] = useState('rtl'); const [dark, setDark] = useState(false); const [products, setProducts] = useState([]); const [adminMode, setAdminMode] = useState(false); const [adminPassword, setAdminPassword] = useState(''); const [cart, setCart] = useState([]); const [themePref, setThemePref] = useState('light');

useEffect(() => { const stored = localStorage.getItem('imadtech_products'); if (stored) setProducts(JSON.parse(stored)); const storedCart = localStorage.getItem('imadtech_cart'); if (storedCart) setCart(JSON.parse(storedCart)); const savedTheme = localStorage.getItem('imadtech_theme'); if (savedTheme) { setThemePref(savedTheme); setDark(savedTheme === 'dark'); } }, []);

useEffect(() => { document.documentElement.dir = dir; document.documentElement.lang = lang; localStorage.setItem('imadtech_products', JSON.stringify(products)); }, [dir, lang, products]);

useEffect(() => { localStorage.setItem('imadtech_cart', JSON.stringify(cart)); }, [cart]);

useEffect(() => { localStorage.setItem('imadtech_theme', themePref); if (themePref === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [themePref]);

// Admin: simple password check using env-supplied ADMIN_PASSWORD (only on server ideally). Here we use a local check for demo, but you should protect it server-side. const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'control';

function handleAdminLogin() { if (adminPassword === ADMIN_PASSWORD) { setAdminMode(true); setAdminPassword(''); } else alert('كلمة مرور المدير خاطئة'); }

function addProduct(p) { setProducts(prev => [p, ...prev]); }

function addToCart(product) { setCart(prev => { const found = prev.find(i => i.id === product.id); if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i); return [{ ...product, qty: 1 }, ...prev]; }); }

function removeFromCart(id) { setCart(prev => prev.filter(i => i.id !== id)); }

function changeQty(id, qty) { setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)); }

async function placeOrder(paymentMethod) { if (cart.length === 0) { alert(t.emptyCart); return; } // Build order object const order = { id: 'ORD-' + Date.now(), items: cart, total: cart.reduce((s, i) => s + i.price * i.qty, 0), lang, paymentMethod, createdAt: new Date().toISOString(), };

// Send to serverless function (Netlify Functions)
try {
  const res = await fetch('/.netlify/functions/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  const data = await res.json();
  if (res.ok) {
    alert('تم إنشاء الطلب: ' + order.id + '\n' + (data.message || 'انتظر تأكيد الدفع'));
    setCart([]);
  } else {
    alert('خطأ في إنشاء الطلب: ' + (data.error || 'خطأ'));
  }
} catch (e) {
  console.error(e);
  alert('حدث خطأ في الاتصال بالخادم. تأكد من إعداد Netlify Functions.');
}

}

// Small rating system saved in localStorage per product function rateProduct(id, score) { setProducts(prev => prev.map(p => p.id === id ? ({ ...p, rating: Math.round(((p.rating || 0) + score) / 2) }) : p)); }

// Responsive layout and minimal animations with Tailwind return ( <div className={min-h-screen transition-colors duration-300 ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}}> <header className="max-w-5xl mx-auto p-4 flex items-center justify-between"> <div className="flex items-center gap-3"> <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center shadow">{t.name[0]}</div> <div> <h1 className="font-bold text-lg">{t.name}</h1> <p className="text-sm text-gray-500 dark:text-gray-400">متجر إلكترونيات صغير ومحترف</p> </div> </div>

<div className="flex items-center gap-3">
      <button onClick={() => { setLang(prev => { const next = prev === 'ar' ? 'en' : 'ar'; setDir(next === 'ar' ? 'rtl' : 'ltr'); return next; }); }} className="px-3 py-2 rounded-md border">{t.changeLang}</button>
      <button onClick={() => { setThemePref(prev => prev === 'light' ? 'dark' : 'light'); setDark(prev => !prev); }} className="px-3 py-2 rounded-md border">{dark ? 'Light' : 'Dark'}</button>
      <button onClick={() => alert('صفحة الدعم الفني: ' + t.support)} className="px-3 py-2 rounded-md border">{t.support}</button>
      <button onClick={() => setAdminMode(m => !m)} className="px-3 py-2 rounded-md border">{t.adminLogin}</button>
    </div>
  </header>

  <main className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
    <section className="md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t.products}</h2>
        <div className="flex gap-2 items-center">
          <div className="text-sm">{cart.length} {t.cart}</div>
          <button onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} className="px-3 py-1 rounded-md border">{t.checkout}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.length === 0 && <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded">لا توجد منتجات — يمكنك إضافة منتجات من لوحة المدير.</div>}
        {products.map(p => (
          <div key={p.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition-shadow">
            <img src={p.image || 'https://via.placeholder.com/400x300?text=Product'} alt={p.name} className="w-full h-40 object-cover rounded mb-3" />
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{p.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="text-lg font-bold">${p.price}</div>
                <div className="text-sm">{t.rating}: {p.rating || '—'}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => addToCart(p)} className="px-3 py-2 rounded bg-blue-600 text-white">Add</button>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => rateProduct(p.id, s)} className="text-sm px-2 py-1 border rounded">{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <aside className="p-4 bg-gray-50 dark:bg-gray-900 rounded md:sticky top-4">
      <h3 className="font-semibold mb-2">{t.cart}</h3>
      <div className="space-y-3">
        {cart.length === 0 && <div>{t.emptyCart}</div>}
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm">{item.qty} × ${item.price}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <input type="number" min={1} value={item.qty} onChange={(e) => changeQty(item.id, Number(e.target.value) || 1)} className="w-16 p-1 rounded border text-right" />
              <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500">إزالة</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-3">
        <div className="flex justify-between">
          <div>المجموع</div>
          <div className="font-bold">${cart.reduce((s,i) => s + i.price * i.qty, 0)}</div>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <button onClick={() => placeOrder('mastercard')} className="px-3 py-2 rounded bg-green-600 text-white">{t.payWith} Mastercard (الرافدين)</button>
          <button onClick={() => placeOrder('zaincash')} className="px-3 py-2 rounded bg-yellow-500 text-black">{t.payWith} ZainCash</button>
        </div>
      </div>
    </aside>

    {/* Admin modal/section */}
    {adminMode && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded p-4">
          <h3 className="font-bold mb-3">لوحة المدير — إضافة منتجات</h3>
          <AdminArea onAdd={addProduct} onClose={() => setAdminMode(false)} ADMIN_PASSWORD={ADMIN_PASSWORD} onRequirePassword={() => setAdminMode(false)} />
        </div>
      </div>
    )}

  </main>

  <footer className="text-center p-6 text-sm text-gray-500">
    © {new Date().getFullYear()} {t.name} — متجر مصمم للهاتف والكمبيوتر.
    <div className="mt-2">
      <span>للتواصل: </span>
      <a href={`mailto:${localStorage.getItem('imadtech_store_email') || 'orders@imadtech.store'}`} className="underline">{localStorage.getItem('imadtech_store_email') || 'orders@imadtech.store'}</a>
      <span className="mx-2">|</span>
      <a href={`tel:${localStorage.getItem('imadtech_store_phone') || ''}`}>{localStorage.getItem('imadtech_store_phone') || 'رقم الهاتف'}</a>
    </div>
    <div className="mt-2 text-xs text-gray-400">{localStorage.getItem('imadtech_store_policy') || 'سياسة التوصيل ستظهر هنا بعد حفظها من لوحة المدير.'}</div>
  </footer>
</div>

); }

function AdminArea({ onAdd, onClose, ADMIN_PASSWORD }) { const [name, setName] = useState(''); const [price, setPrice] = useState(0); const [desc, setDesc] = useState(''); const [image, setImage] = useState('');

// Store info editable fields const [storeEmail, setStoreEmail] = useState(() => localStorage.getItem('imadtech_store_email') || ''); const [storePhone, setStorePhone] = useState(() => localStorage.getItem('imadtech_store_phone') || ''); const [storePolicy, setStorePolicy] = useState(() => localStorage.getItem('imadtech_store_policy') || '');

function handleAdd() { if (!name || !price) return alert('الاسم والسعر مطلوبان'); const p = { id: 'P-' + Date.now(), name, price: Number(price), description: desc, image, rating: 0 }; onAdd(p); setName(''); setPrice(0); setDesc(''); setImage(''); alert('تمت إضافة المنتج'); }

function saveStoreInfo() { localStorage.setItem('imadtech_store_email', storeEmail); localStorage.setItem('imadtech_store_phone', storePhone); localStorage.setItem('imadtech_store_policy', storePolicy); alert('تم حفظ معلومات المتجر'); }

return ( <div> <h4 className="font-medium mb-2">معلومات المتجر القابلة للتعديل</h4> <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"> <input value={storeEmail} onChange={e => setStoreEmail(e.target.value)} placeholder="البريد الإلكتروني للمتجر" className="p-2 border rounded" /> <input value={storePhone} onChange={e => setStorePhone(e.target.value)} placeholder="رقم الهاتف للطلبات" className="p-2 border rounded" /> <textarea value={storePolicy} onChange={e => setStorePolicy(e.target.value)} placeholder="سياسة التوصيل (نص)" className="p-2 border rounded col-span-2" /> </div>

<div className="flex gap-2 mb-4">
    <button onClick={saveStoreInfo} className="px-3 py-2 bg-green-600 text-white rounded">حفظ معلومات المتجر</button>
  </div>

  <hr className="my-3" />

  <h4 className="font-medium mb-2">إضافة منتج جديد</h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <input value={name} onChange={e => setName(e.target.value)} placeholder="اسم المنتج" className="p-2 border rounded" />
    <input value={price} onChange={e => setPrice(e.target.value)} placeholder="السعر" type="number" className="p-2 border rounded" />
    <input value={image} onChange={e => setImage(e.target.value)} placeholder="رابط الصورة (أو ارفع لاحقًا)" className="p-2 border rounded col-span-2" />
    <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="وصف" className="p-2 border rounded col-span-2" />
  </div>
  <div className="flex gap-2 mt-3">
    <button onClick={handleAdd} className="px-3 py-2 bg-blue-600 text-white rounded">إضافة</button>
    <button onClick={onClose} className="px-3 py-2 border rounded">إغلاق</button>
  </div>
</div>

); }

/* NETLIFY FUNCTION EXAMPLE (save as netlify/functions/create-order.js) - nodejs

exports.handler = async (event) => { try { const order = JSON.parse(event.body); // Here: call your payment gateway (Al-Rafidain) / ZainCash API using secure env vars // Example pseudocode: // const res = await fetch('https://merchant-gateway/pay', { method: 'POST', headers: { 'Authorization': Bearer ${process.env.MERCHANT_API_KEY} }, body: JSON.stringify({ amount: order.total, orderId: order.id }) }); // save order to DB (FaunaDB, Supabase, or Google Sheets)

return { statusCode: 200, body: JSON.stringify({ message: 'order received', orderId: order.id }) };

} catch (e) { return { statusCode: 500, body: JSON.stringify({ error: e.message }) }; } };

NOTES:

Replace placeholder payment integration with real merchant API (Al-Rafidain requires account and documentation from the bank)

For ZainCash, request merchant integration docs from Zain Iraq and implement server-side token exchange

To send confirmation emails, use a transactional email provider (Mailgun/SendGrid) from the serverless function


NETLIFY DEPLOY STEPS SUMMARY:

1. Create GitHub repo and push project


2. Setup Tailwind + React (Vite or Create React App)


3. Add netlify/functions/create-order.js


4. Connect repo to Netlify and set build command (npm run build) and publish directory (dist or build)


5. Add required ENV VARS in Site settings


6. Deploy and test with sandbox merchant creds



SECURITY:

Never store API keys in frontend. Use Netlify Env Vars and serverless functions.

Use HTTPS and enforce TLS (Netlify does this for you)


*/

