import { Check, CircleAlert } from "lucide-react";
import { useToast } from "./ui/toast/use-toast";

export const useShowToast = () => {
  const { toast } = useToast();
  const showSuccessToast = (message?: string) =>
    toast({
      duration: 3_000,
      title: (
        <div className="flex items-center justify-start gap-2">
          <Check className="w-4 h-4 stroke-green-bright" />
          <span className="font-satoshi text-green-bright">Successful</span>
        </div>
      ),
      description: <div className="font-satoshi text-xs">{message}</div>,
    });

    const showFailToast = (message?: string) =>
      toast({
        duration: 1500,
        title: (
          <div className="flex items-center justify-start gap-2">
            <CircleAlert className="w-4 h-4 stroke-red-400" />
            <span className="font-satoshi text-red-400">Failed</span>
          </div>
        ),
        description: <div className="font-satoshi text-xs">{message}</div>,
      });

  return { showSuccessToast, showFailToast };
};
