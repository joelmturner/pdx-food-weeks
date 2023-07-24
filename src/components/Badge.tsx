import { css } from "@/styled-system/css";
import { PropsWithChildren } from "react";

export function Badge({
  children,
  active,
  ...rest
}: HTMLDivElement &
  PropsWithChildren<{
    active: boolean;
    className: string;
  }>) {
  return (
    <div
      {...(rest as any)}
      className={css({
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transitionProperty:
          "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
        transitionTimingFunction: "in-out",
        transitionDuration: "200ms",
        h: "5",
        fontSize: "sm",
        lineHeight: "loose",
        borderRadius: "md",
        borderColor: "text.muted",
        px: "3",
        py: "2",
        fontWeight: "bold",
        color: active ? "bg.muted" : "text.muted",
        bg: active ? "secondary" : "bg.muted",
      })}
    >
      {children}
    </div>
  );
}
