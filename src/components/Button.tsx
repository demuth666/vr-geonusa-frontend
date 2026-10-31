import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'amber' | 'outline' | 'ghost';

/** Tombol "tactile arcade press" LFS (.btn kids.css). */
const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  amber: 'btn-amber',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({ variant = 'primary', className = '', type = 'button', ...rest }: Props) {
  return <button type={type} className={`btn ${variants[variant]} ${className}`.trim()} {...rest} />;
}
