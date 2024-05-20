import { IconProps } from "./types";

export const Loader: React.FC<IconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
      <circle r="15" cx="40" cy="65">
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="1"
          values="65;135;65;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.4"
        ></animate>
      </circle>
      <circle r="15" cx="100" cy="65">
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="1"
          values="65;135;65;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.2"
        ></animate>
      </circle>
      <circle r="15" cx="160" cy="65">
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="1"
          values="65;135;65;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="0"
        ></animate>
      </circle>
    </svg>
  );
};
