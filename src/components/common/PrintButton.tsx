import  Button  from "@/components/atoms/Button";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export default function PrintButton({ onClick, label = "طباعة", disabled }: PrintButtonProps) {
  return (
    <Button variant="success" size="sm" onClick={onClick} disabled={disabled}>
      <Printer className="w-4 h-4" />
      {/* {label} */}
    </Button>
  );
}
