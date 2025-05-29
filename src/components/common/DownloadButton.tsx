import  Button  from "@/components/atoms/Button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export default function DownloadButton({ onClick, label = "تحميل", disabled }: DownloadButtonProps) {
  return (
    <Button variant="success" size="sm" onClick={onClick} disabled={disabled}>
      <Download className="w-4 h-4" />
      {/* {label} */}
    </Button>
  );
}
