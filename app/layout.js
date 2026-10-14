import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'Làm chung sức ib zalo',
  description: 'Liên hệ & theo dõi Healer tại đây: Zalo, YouTube, TikTok, Discord, Facebook, Donate',
};

export const viewport = {
  themeColor: '#6366f1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Đọc theme đã lưu trước khi vẽ để tránh nháy giao diện */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('healer-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
