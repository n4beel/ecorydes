import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Dollar = (props:any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={19}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.625 5.542H1.708m1.917 7.666H1.708m1.917-3.833H.75m3.833-7.173a8.625 8.625 0 1 1 0 14.345m6.709-9.568c-.48-.119-1.26-.123-1.917-.119m0 0c-.22.002-.087-.008-.383 0-.774.024-1.532.346-1.534 1.257-.001.97.959 1.258 1.917 1.258.958 0 1.917.221 1.917 1.258 0 .779-.774 1.12-1.739 1.233h-.178m0-5.006V5.542m0 6.324c-.652.003-1.036.015-1.917-.095m1.917.095v1.342"
    />
  </Svg>
)
export default Dollar
