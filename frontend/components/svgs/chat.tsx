import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Chat = (props:any) => (
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
      d="M8.056 11.64h.009m3.405 0h.008m3.405 0h.008m4.259 7.56-2.837-1.396a3.564 3.564 0 0 0-.435-.196 1.74 1.74 0 0 0-.308-.072c-.118-.016-.238-.016-.478-.016H6.52c-.956 0-1.434 0-1.799-.183a1.694 1.694 0 0 1-.745-.734c-.186-.36-.186-.83-.186-1.77V8.447c0-.94 0-1.411.186-1.77.163-.317.424-.574.745-.735.365-.183.843-.183 1.8-.183h9.898c.956 0 1.434 0 1.799.183.32.161.582.418.745.734.187.36.187.83.187 1.771V19.2Z"
    />
  </Svg>
)

export default Chat;