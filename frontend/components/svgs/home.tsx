import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Home = (props: any) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={24}
        fill="none"
        {...props}
    >
        <Path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.5 15c-2.21 1.333-5.792 1.333-8 0m11-6.29-5.333-4.148a2.666 2.666 0 0 0-3.274 0L5.56 8.71a2.665 2.665 0 0 0-1.029 2.105v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.2c0-.823-.38-1.6-1.03-2.105Z"
        />
    </Svg>
)
export default Home;