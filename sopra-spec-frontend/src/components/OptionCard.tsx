import Link from "next/link";
import Image from "next/image";

export default function OptionCard({
  href = "#",
  title,
  image,
  fit = "cover",
  optionCount = 1,
  textOnly = false,
  width = 500,
  selected = false,
  onClick,
}: {
  href?: string;
  title: string;
  image?: string;
  fit?: "cover" | "contain";
  optionCount?: number;
  textOnly?: boolean;
  width?: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  // Height logic
  let height: number;
  if (textOnly) {
    height = 150;
  } else {
    height = optionCount >= 1 && optionCount <= 3 ? 600 : 300;
  }

  const card = (
    <div
      className={[
        "hover:cursor-pointer relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border",
        selected
          ? "border-[#0072CE] ring-2 ring-[#0072CE]"
          : "border-transparent",
      ].join(" ")}
      style={{ width, height }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {image ? (
        <div className="absolute inset-0">
          <Image src={image} alt={title} fill style={{ objectFit: fit }} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gray-200 hover:bg-[#0072CE] flex items-center justify-center">
          <h3
            className={
              selected ? "text-white" : "text-[#7C878E] group-hover:!text-white"
            }
          >
            {title}
          </h3>
        </div>
      )}

      {image && (
        <div className="absolute inset-0 bg-white/70 opacity-0 hover:opacity-100 transition flex items-center justify-center">
          <h3 className="text-center">{title}</h3>
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="group block focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {card}
      </button>
    );
  }

  return (
    <Link href={href} className="group block">
      {card}
    </Link>
  );
}
