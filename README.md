# بهار — فروشگاه آنلاین آرایشی و مراقبت پوست

فرانت‌اند React متصل به API بک‌اند Bahar (OpenAPI).

## اجرا

```bash
npm install
cp .env.example .env
npm run dev
```

بک‌اند باید روی آدرس `VITE_API_BASE_URL` (پیش‌فرض `http://localhost:3000`) در حال اجرا باشد.

## امکانات

- فروشگاه: محصولات، سبد خرید محلی، ثبت سفارش روی API
- احراز هویت: `/register`، `/login`، `/me` با JWT
- پروفایل کاربر: `PUT /me` (نام، تلفن، آدرس، ایمیل، رمز)
- حساب کاربری: سفارش‌های کاربر (`/orders/my`)
- پنل مدیریت (`/admin`): CRUD محصولات و سفارش‌ها (نیاز به کاربر `is_admin`)
- پرداخت آزمایشی در فرانت (درگاه واقعی هنوز نیست)

## ورود مدیر

از همان صفحه `/login` وارد شوید. اگر کاربر `is_admin=true` باشد به `/admin` هدایت می‌شود.

## ساختار

```
src/
├── app/                 # مسیریابی
├── contexts/            # Auth + Cart
├── services/
│   ├── api/             # کلاینت HTTP + JWT
│   ├── auth/
│   ├── products/
│   ├── orders/
│   ├── cart/            # سبد محلی (localStorage)
│   └── admin/           # APIهای مدیریتی
├── pages/admin/         # پنل مدیریت
└── ...
```
