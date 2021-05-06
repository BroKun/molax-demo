import React from 'react';
import { useInject } from 'molax/lib/use';
import { ToDoManager } from '../manager';

export const ToDoCount: React.FC = () => {
  const manager = useInject<ToDoManager>(ToDoManager);
  return (
    <div>count: {manager.count}</div>
  );
};
