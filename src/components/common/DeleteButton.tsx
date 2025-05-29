import  Button  from "@/components/atoms/Button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export default function DeleteButton({ onClick, label = "حذف", disabled }: DeleteButtonProps) {
  return (
    <Button variant="danger" size="sm" onClick={onClick} disabled={disabled}>
      <Trash2 className="w-4 h-4 ml-1" />
      {label}
    </Button>
  );
}
