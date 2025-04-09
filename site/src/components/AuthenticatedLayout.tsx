import Header from "./Header";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <div className="p-5">{children}</div>
    </div>
  );
}
