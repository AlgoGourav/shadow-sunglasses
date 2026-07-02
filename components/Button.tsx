import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "ghost" | "onDark" | "ghostOnDark";

type CommonProps = {
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type Props = ButtonAsButton | ButtonAsAnchor;

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const classes = `${styles.button} ${styles[variant]} ${className}`;

  if ("href" in props && props.href) {
    return <a className={classes} {...props} />;
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)} />
  );
}
