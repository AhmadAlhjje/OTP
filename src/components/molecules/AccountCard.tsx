
import { FC } from "react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/CardContent";
import Button from "@/components/atoms/Button";
import useTranslation from "@/hooks/useTranslation";

interface Props {
  account: {
    id: string;
    name: string;
    phone: string;
  };
  onDelete: (id: string) => void;
}

const AccountCard: FC<Props> = ({ account, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full shadow-md dark:shadow-white/10">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="font-bold dark:text-white">{account.name}</p>
          <p className="text-sm text-muted-foreground dark:text-white">{account.phone}</p>
        </div>
        <Button variant="danger" onClick={() => onDelete(account.id)}>
          {t("delete")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
