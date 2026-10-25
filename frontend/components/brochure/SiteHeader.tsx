import Link from "next/link";
import { RegistrationMark } from "./PrintMarks";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center px-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-sm text-[17px] font-semibold tracking-[-0.01em] text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <RegistrationMark size={22} className="text-reg" />
          AutoBrochure
        </Link>
      </div>
    </header>
  );
}
