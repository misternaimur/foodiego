export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fg-auth-shell flex min-h-screen flex-col bg-white">{children}</div>
  );
}