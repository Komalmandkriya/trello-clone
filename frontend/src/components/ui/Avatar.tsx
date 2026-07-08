import { getInitials } from "../../utils/getInitials";

interface AvatarProps {
  name: string;
  url?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_STYLES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

export default function Avatar({ name, url, size = "md" }: AvatarProps) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`shrink-0 rounded-full object-cover ${SIZE_STYLES[size]}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white ${SIZE_STYLES[size]}`}
    >
      {getInitials(name)}
    </div>
  );
}
