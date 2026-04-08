import React from 'react';
import { 
  House, 
  ShoppingBasket, 
  Landmark, 
  User, 
  ChevronRight, 
  Menu, 
  BotMessageSquare, 
  ChevronLeft,
  CupSoda,
  Bike,
  CarFront,
} from 'lucide-react';

type IconProps = React.ComponentPropsWithoutRef<typeof House>;

export const Icons = {
  // 하단 네비게이션용
  Home: (props: IconProps) => <House size={24} {...props} />,
  Shop: (props: IconProps) => <ShoppingBasket size={24} {...props} />,
  Bank: (props: IconProps) => <Landmark size={24} {...props} />,
  MyPage: (props: IconProps) => <User size={24} {...props} />,
  
  // 상단 바 및 카드 내부용
  Chat: (props: IconProps) => <BotMessageSquare size={24} {...props} />, // 챗봇 아이콘
  Menu: (props: IconProps) => <Menu size={24} {...props} />,              // 전체 메뉴(햄버거)
  ArrowRight: (props: IconProps) => <ChevronRight size={20} {...props} />, // 이동 화살표
  Back: (props: IconProps) => <ChevronLeft size={24} {...props} />, // 뒤로가기 아이콘
  Tumbler: (props: IconProps) => <CupSoda size={24} {...props} />,
  Bicycle: (props: IconProps) => <Bike size={24} {...props} />,
  EvCharger: (props: IconProps) => <CarFront size={24} {...props} />,
};
