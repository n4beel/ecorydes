import * as React from "react"
import Svg, { Path } from "react-native-svg"
const User = (props:any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855M3 12a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12Zm6-2a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"
    />
  </Svg>
)
export default User;