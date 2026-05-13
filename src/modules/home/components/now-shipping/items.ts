import { BookOpenText, PlaneLanding } from 'lucide';
import { renderIcon } from '../../../../lib/icon';

export interface ShippingItem {
  icon: string;
  name: string;
  status: string;
}

export const items: ShippingItem[] = [
  {
    icon: renderIcon(PlaneLanding),
    name: 'I learned to reason errors... with the Air France 447',
    status: '99%',
  },
  {
    icon: renderIcon(BookOpenText),
    name: 'How I am teaching my daughter to think numbers',
    status: 'Coming in May',
  },
];
