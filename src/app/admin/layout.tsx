import Link from "next/link";
import { requireStaff } from "@/lib/session";
import { SignOutButton } from "./SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();

  const links = [
    { href: "/admin/products", label: "Products" },
    ...(user.role === "boss" ? [{ href: "/admin/staff", label: "Staff" }] : []),
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-char text-parchment">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <Link href="/admin" className="font-display text-xl font-bold">
            Smoked Style
          </Link>
          <nav className="flex flex-1 gap-1 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-md px-3 py-1.5 hover:bg-white/10">
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="hidden text-xs text-parchment/70 sm:inline">{user.name}</span>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
