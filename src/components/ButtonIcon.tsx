import { HTMLStyledProps, styled } from "@/styled-system/jsx";
import { cloneElement, isValidElement } from "react";

export const ButtonIcon = (
  props: HTMLStyledProps<"span"> & { icon: string }
) => {
  const { children, ...rest } = props;

  const _children = isValidElement(children)
    ? cloneElement(children, {
        // @ts-expect-error typings are wrong
        "aria-hidden": true,
        focusable: false,
      })
    : children;

  return <styled.span {...rest}>{_children}</styled.span>;
};
