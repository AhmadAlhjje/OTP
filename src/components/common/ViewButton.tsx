import  Button  from "@/components/atoms/Button";
import { Eye } from "lucide-react";

interface ViewButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export default function ViewButton({ onClick, label = "عرض", disabled }: ViewButtonProps) {
  return (
    <Button variant="secondary" size="sm" onClick={onClick} disabled={disabled}>
      <Eye className="w-4 h-4" />
      {/* {label} */}
    </Button>
  );
}
