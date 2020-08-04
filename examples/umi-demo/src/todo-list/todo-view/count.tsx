import React from 'react';
import { useInstance } from 'molax/lib/use';
import { ToDoManager } from '../manager';

export const ToDoCount: React.FC = () => {
  const manager = useInstance<ToDoManager>(ToDoManager);
  return (
    <div>count: {manager.count}</div>
  );
};
