import React from 'react';
import { House, ShoppingBasket, Landmark, User, ChevronRight } from 'lucide-react';

type IconProps = React.ComponentPropsWithoutRef<typeof House>;

export const Icons = {
  Home: (props: IconProps) => <House size={24} {...props} />,
  Shop: (props: IconProps) => <ShoppingBasket size={24} {...props} />,
  Bank: (props: IconProps) => <Landmark size={24} {...props} />,
  MyPage: (props: IconProps) => <User size={24} {...props} />,
  ArrowRight: (props: IconProps) => <ChevronRight size={20} {...props} />,
};