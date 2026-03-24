'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

interface InteractiveHoverButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  > {
  text?: string;
  classes?: string;
  href?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  hoverIcon?: React.ReactNode;
  hoverIconPosition?: 'left' | 'right';
  showArrow?: boolean;
}

export default function InteractiveHoverButton({
  text = 'Button',
  classes,
  href,
  download,
  target,
  rel,
  icon,
  iconPosition = 'left',
  hoverIcon,
  hoverIconPosition = 'right',
  showArrow = true,
  ...props
}: InteractiveHoverButtonProps) {
  const content = (
    <motion.div
      className='flex items-center gap-2'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='bg-primary h-2 w-2 rounded-full transition-all duration-500 group-hover:scale-[40]' />
      <span className='inline-flex items-center gap-2 transition-all duration-500 group-hover:translate-x-20 group-hover:opacity-0'>
        {icon && iconPosition === 'left' ? <span className='inline-flex items-center'>{icon}</span> : null}
        <span>{text}</span>
        {icon && iconPosition === 'right' ? <span className='inline-flex items-center'>{icon}</span> : null}
      </span>
      <div className='text-primary-foreground absolute top-0 left-0 z-10 flex h-full w-full -translate-x-16 items-center justify-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100'>
        {(hoverIcon ? hoverIconPosition === 'left' : iconPosition === 'left')
          ? <span className='inline-flex items-center'>{hoverIcon ?? icon}</span>
          : null}
        <span className='whitespace-nowrap'>{text}</span>
        {(hoverIcon ? hoverIconPosition === 'right' : iconPosition === 'right')
          ? <span className='inline-flex items-center'>{hoverIcon ?? icon}</span>
          : null}
        {showArrow ? <ArrowRight className='h-4 w-4' /> : null}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        download={download}
        target={target}
        rel={rel}
        className={cn(
          'group bg-background relative inline-flex min-w-40 items-center justify-center overflow-hidden rounded-full border p-2 px-6 font-semibold',
          classes
        )}
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={cn(
        'group bg-background relative flex min-w-40 items-center justify-center overflow-hidden rounded-full border p-2 px-6 font-semibold',
        classes
      )}
      type='button'
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}
