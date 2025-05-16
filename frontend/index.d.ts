declare module '*.jpg'
declare module '*.png'
declare module '*.svg'
declare module '*.gif'
declare module '*.svg' {
    import * as React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}