import { Badge, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

const PriceTags = ({
  price = 0,
  billing_cycle = 30,
  currency = "￥",
  expired_at = Date.now() + 30 * 24 * 60 * 60 * 1000,
  tags = "",
  ip4 = "",
  ip6 = "",
  ...props
}: {
  expired_at?: string | number;
  price?: number;
  billing_cycle?: number;
  currency?: string;
  tags?: string;
  ip4?: any;
  ip6?: any;
} & React.ComponentProps<typeof Flex>) => {
  const [t] = useTranslation();

  // `expired_at` can arrive as null, an empty string or an unparsable value.
  // Treat all of those as "no expiry" instead of rendering a bogus NaN badge.
  const expiryTimestamp =
    expired_at === null || expired_at === "" || expired_at === undefined
      ? Number.NaN
      : new Date(expired_at).getTime();
  const expiryDays = Number.isFinite(expiryTimestamp)
    ? Math.ceil((expiryTimestamp - Date.now()) / 86_400_000)
    : null;

  if (price == 0) {
    return (
      <Flex gap="1" {...props} wrap="wrap" className="km-price-tags">
        <CustomTags tags={tags} />
      </Flex>
    );
  }

  return (
    <Flex gap="1" {...props} wrap="wrap" className="km-price-tags">
      {ip4 && (
        <Badge size="1" variant="soft" className="text-sm" color="green">
          <label className="flex justify-center items-center gap-1 text-xs">
            <div className="border-2 rounded-4xl border-green-500"></div>
            V4
          </label>
        </Badge>
      )}

      {ip6 && (
        <Badge size="1" variant="soft" className="text-sm" color="green">
          <label className="flex justify-center items-center gap-1 text-xs">
            <div className="border-2 rounded-4xl border-green-500"></div>
            V6
          </label>
        </Badge>
      )}

      <Badge color="iris" size="1" variant="soft" className="text-sm">
        <label className="text-xs">
          {price == -1 ? t("common.free") : `${currency}${price}`}/
          {(() => {
            if (billing_cycle >= 27 && billing_cycle <= 32) {
              return t("common.monthly");
            } else if (billing_cycle >= 87 && billing_cycle <= 95) {
              return t("common.quarterly");
            } else if (billing_cycle >= 175 && billing_cycle <= 185) {
              return t("common.semi_annual");
            } else if (billing_cycle >= 360 && billing_cycle <= 370) {
              return t("common.annual");
            } else if (billing_cycle >= 720 && billing_cycle <= 750) {
              return t("common.biennial");
            } else if (billing_cycle >= 1080 && billing_cycle <= 1150) {
              return t("common.triennial");
            } else if (billing_cycle >= 1800 && billing_cycle <= 1850) {
              return t("common.quinquennial");
            } else if (billing_cycle == -1) {
              return t("common.once");
            } else {
              return `${billing_cycle} ${t("nodeCard.time_day")}`;
            }
          })()}
        </label>
      </Badge>
      {expiryDays !== null && (
        <Badge
          color={expiryDays <= 7 ? "red" : expiryDays <= 15 ? "orange" : "green"}
          size="1"
          variant="soft"
          className="text-sm"
        >
          <label className="text-xs">
            {expiryDays <= 0
              ? t("common.expired")
              : expiryDays > 36500
                ? t("common.long_term")
                : t("common.expired_in", { days: expiryDays })}
          </label>
        </Badge>
      )}
      <CustomTags tags={tags} />
    </Flex>
  );
};

const CustomTags = ({ tags }: { tags?: string }) => {
  if (!tags || tags.trim() === "") {
    return <></>;
  }
  const tagList = tags.split(";").filter((tag) => tag.trim() !== "");
  const colors: Array<
    | "ruby"
    | "gray"
    | "gold"
    | "bronze"
    | "brown"
    | "yellow"
    | "amber"
    | "orange"
    | "tomato"
    | "red"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "jade"
    | "green"
    | "grass"
    | "lime"
    | "mint"
    | "sky"
  > = [
    "ruby",
    "gray",
    "gold",
    "bronze",
    "brown",
    "yellow",
    "amber",
    "orange",
    "tomato",
    "red",
    "crimson",
    "pink",
    "plum",
    "purple",
    "violet",
    "iris",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "jade",
    "green",
    "grass",
    "lime",
    "mint",
    "sky",
  ];

  // 解析带颜色的标签
  const parseTagWithColor = (tag: string) => {
    const colorMatch = tag.match(/<(\w+)>$/);
    if (colorMatch) {
      const color = colorMatch[1].toLowerCase();
      const text = tag.replace(/<\w+>$/, "");
      // 检查颜色是否在支持的颜色列表中
      if (colors.includes(color as any)) {
        return { text, color: color as (typeof colors)[number] };
      }
    }
    return { text: tag, color: null };
  };

  return (
    <>
      {tagList.map((tag, index) => {
        const { text, color } = parseTagWithColor(tag);
        const badgeColor = color || colors[index % colors.length];

        return (
          <Badge
            key={index}
            color={badgeColor}
            variant="soft"
            className="text-sm"
          >
            <label className="text-xs">{text}</label>
          </Badge>
        );
      })}
    </>
  );
};

export default PriceTags;
