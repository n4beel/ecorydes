import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Bank = (props:any) => (
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
      d="M3 21h18M4 18h16M6 18v-5m4 5v-5m4 5v-5m4 5v-5m-6-5.993L12.007 7M21 10l-6.874-6.11c-.752-.669-1.128-1.003-1.553-1.13a2 2 0 0 0-1.146 0c-.425.127-.8.461-1.553 1.13L3 10h18Z"
    />
  </Svg>
)
export default Bank
