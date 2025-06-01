// atoms/IconWrapper.tsx
import React from "react";
import { Icon } from "lucide-react";

interface IconWrapperProps {
  icon: React.ElementType;
  size?: number;
  color?: string;
  className?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon: IconComponent, 
  size = 24, 
  color = "currentColor", 
  className = "" 
}) => (
  <IconComponent size={size} color={color} className={className} />
);

export default IconWrapper;