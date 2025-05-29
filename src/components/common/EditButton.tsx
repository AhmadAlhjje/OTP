import  Button  from "@/components/atoms/Button";
import { Pencil } from "lucide-react";

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export default function EditButton({ onClick, label = "تعديل", disabled }: EditButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      <Pencil className="w-4 h-4 ml-1" />
      {/* {label} */}
    </Button>
  );
}
