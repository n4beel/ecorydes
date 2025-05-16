interface ThemeColors {
    dark: string;
    purple: string;
    white: string;
    primary: string;
    light_gray: string;
    gray: string;
    border: string;
    success: string;
    blue: string;
    golden: string;
    lightgreen: string;
    red: string;
    light_red: string;
    light_blue:string;
    mid_green:string;
    mid_red:string;
}


const themeColors: ThemeColors = {
    dark: '#000000',
    purple: '#4A26CC',
    white: '#FFFFFF',
    // primary: '#20FF8F',
    primary:'#5EF188',
    light_gray: '#F6F7FA',
    gray: '#CDCDCD',
    border: '#EEEEEE',
    success: '#1EBC2E',
    blue: 'blue',
    golden: '#E8C341',
    lightgreen: '#E0FFE9',
    red: '#E9504B',
    light_red: '#FFBFBD',
    light_blue:'#E0EAFF',
    mid_green:'#ADEAC2',
    mid_red:"#FFF8F8"

}

const theme: { color: ThemeColors } = {
    color: themeColors,
}

export default theme
