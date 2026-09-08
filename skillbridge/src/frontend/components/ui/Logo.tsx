import Image from 'next/image';

interface LogoProps {
  /** Tiny label shown below the wordmark, e.g. "Student Career Hub" */
  subtitle?: string;
  /** Height of the logo image in px (width scales automatically). Default 36. */
  size?: number;
  /** Extra classes on the root wrapper */
  className?: string;
}

/**
 * SkillBridge brand logo — uses the official image.png from /public.
 * Drop this anywhere a brand mark is needed.
 */
export function Logo({ subtitle, size = 36, className = '' }: LogoProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/image.png"
        alt="SkillBridge"
        width={size * 3.2}   // logo is wider than tall (≈3.2:1 ratio)
        height={size}
        priority
        className="object-contain"
      />
      {subtitle && (
        <span className="text-[10px] font-extrabold text-[#4F46E5] uppercase tracking-wider hidden sm:block">
          {subtitle}
        </span>
      )}
    </span>
  );
}
