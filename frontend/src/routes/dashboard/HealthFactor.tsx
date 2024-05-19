import { useHealthFactor } from "@/hooks/useHealthFactor";

export const HealthFactor = () => {
  const { healthFactor } = useHealthFactor();
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Health Factor</h1>
      <div className="text-4xl text-gray-600 font-semibold">
        {healthFactor.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </div>
    </div>
  );
};
