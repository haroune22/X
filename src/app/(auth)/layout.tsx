
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
          <body className="flex items-center justify-center w-full h-full">
              {children}
          </body>
      </html>
  );
}
