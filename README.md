# Healer Bio — Trang bio kèm đếm lượt bấm

Trang bio link-in-bio của Healer, build bằng Next.js 14 (App Router), deploy lên Vercel.
Người xem bấm vào nút link nào thì lượt bấm được lưu lên Vercel KV (server),
Healer xem tổng hợp tại trang `/stats` (khóa bằng mật khẩu).

## Cấu trúc

```
healer-bio/
├── app/
│   ├── layout.js          # Khung HTML, tiêu đề, font, chống nháy theme
│   ├── globals.css        # Toàn bộ CSS của trang bio + trang /stats
│   ├── page.js            # Trang bio công khai (client)
│   ├── api/
│   │   ├── click/route.js # POST {id} → tăng lượt bấm trong KV
│   │   └── stats/route.js # POST {pw}  → trả số liệu (cần đúng mật khẩu)
│   └── stats/page.js      # Trang thống kê, chỉ Healer xem được
├── public/
│   ├── avatar.jpg         # Ảnh đại diện
│   ├── stk.jpg            # QR ngân hàng (tab Donate)
│   ├── zypage.jpg         # QR Zypage (tab Donate)
│   ├── zalo-nhom.jpg      # QR nhóm Zalo
│   └── zalo-ca-nhan.jpg   # QR Zalo cá nhân
├── .env.example           # Mẫu biến môi trường
├── next.config.js
└── package.json
```

## Các bước deploy lên Vercel

### 1. Chuẩn bị ảnh
5 file ảnh (`avatar.jpg`, `stk.jpg`, `zypage.jpg`, `zalo-nhom.jpg`, `zalo-ca-nhan.jpg`)
đã nằm sẵn trong thư mục `public/`. Nếu Healer đổi ảnh mới thì copy đè vào đây,
giữ nguyên tên file.

### 2. Đưa code lên GitHub (hoặc dùng Vercel CLI)
- **Cách 1 (khuyên dùng):** tạo repo mới trên GitHub, push toàn bộ thư mục này lên,
  rồi vào [vercel.com](https://vercel.com) → *Add New → Project* → *Import* repo đó.
- **Cách 2:** cài Vercel CLI rồi chạy trong thư mục project:
  ```
  npx vercel
  ```
  làm theo hướng dẫn trên màn hình để deploy.

### 3. Tạo database KV
Trong dashboard của project trên Vercel:
*Storage* → *Create Database* → chọn **KV** → đặt tên (ví dụ `healer-bio-kv`)
→ *Connect* vào project. Vercel sẽ tự thêm `KV_REST_API_URL` và
`KV_REST_API_TOKEN` vào biến môi trường — Healer không cần điền tay.

### 4. Đặt mật khẩu xem thống kê
Vào *Settings → Environment Variables* của project, thêm biến:
- Tên: `STATS_PASSWORD`
- Giá trị: một chuỗi bí mật Healer tự đặt (ví dụ `healer-xem-2026`)

Nhớ bấm **Redeploy** để biến môi trường có hiệu lực.

### 5. Xong! Kiểm tra
- Trang bio công khai: `https://<domain-cua-healer>/`
- Trang thống kê: `https://<domain-cua-healer>/stats` — nhập mật khẩu ở bước 4.

## Chạy thử trên máy (không bắt buộc)

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Lưu ý: API đếm lượt bấm cần Vercel KV nên khi chạy
local mà chưa cấu hình KV thì lượt bấm sẽ không lưu được (trang vẫn hiển thị bình thường).
Muốn test full local thì tạo file `.env.local` từ `.env.example` và điền
`KV_REST_API_URL` + `KV_REST_API_TOKEN` lấy từ Upstash/Vercel.

## Ghi chú
- Lượt bấm của khách được gửi bằng `navigator.sendBeacon` (có fallback `fetch`),
  nên không làm chậm hay chặn điều hướng khi bấm link.
- Trang `/stats` không có trong sitemap/menu công khai — chỉ ai biết link và
  đúng mật khẩu mới xem được.
