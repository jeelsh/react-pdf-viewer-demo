'use client';
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../../button';

const IndexToggleButton = ({ isIndexVisible, onToggle, className }) => {
  return (
    <Button
      onClick={onToggle}
      variant='ghost'
      size='icon'
      className='size-9 min-w-9 rounded-full hover:bg-white/10 transition-all'
      aria-label={isIndexVisible ? "Ocultar índice" : "Mostrar índice"}
      title={isIndexVisible ? "Ocultar índice" : "Mostrar índice"}
    >
      <Menu className="size-5 min-w-5 text-foreground" />
    </Button>
  );
};

export default IndexToggleButton;
