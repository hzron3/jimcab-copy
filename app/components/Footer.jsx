"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-600">
      © Copyright {currentYear} Jimcab | Built by{" "}
      <a
        href="https://ujuzicode.com"
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ujuzi Code™
      </a>
    </footer>
  );
}
