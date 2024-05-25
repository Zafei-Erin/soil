import { IconProps } from "./types";

export const SwapIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20.914 15L13.5 22.414L13.5 2L15.5 2L15.5 17.586L19.5 13.586L20.914 15ZM10.5 22L8.5 22L8.5 6.414L4.5 10.414L3.086 9L10.5 1.586L10.5 22Z" />
    </svg>
  );
};
