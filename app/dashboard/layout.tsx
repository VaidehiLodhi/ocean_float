import localFont from "next/font/local";

const kernFont = localFont({
  src: "../fonts/kern_regular.ttf",
});

const shinkaFont = localFont({
  src: "../fonts/shinkamono_thin.woff",
});

export default function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <html lang="en" className={shinkaFont.className}>
        <body>{children}</body>
      </html>
  );
}
