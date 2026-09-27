import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const textSize = size === "large" ? "text-3xl" : "text-xl";
  return (
    <Link href="/" className="flex items-center gap-2">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg bg-medical-600 text-sm font-bold text-white ${
          size === "large" ? "h-12 w-12 text-lg" : ""
        }`}
      >
        FX
      </div>
      <div>
        <span className={`font-bold tracking-tight text-navy-900 ${textSize}`}>
          Fynavo<span className="text-medical-600">X</span>
        </span>
        {size === "large" && (
          <p className="text-sm text-slate-500">Healthcare Intelligence</p>
        )}
      </div>
    </Link>
  );
}
