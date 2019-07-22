import {indigo, teal,pink, lightBlue, deepOrange} from "@material-ui/core/colors";

export function customizeTheme() {
    return {
        p1: '#1B9F7D',
        p2: '#0E5676',
        p3: '#757575',
        p4: '#9C0227',
        p5: '#F5F5F5',
        p6: '#3D3D3D',
        p7: '#D7D7D7',
        p8: 'whitesmoke',
        a1: '#9D0072',
        a2: '#9E7B20',
        a3: '#759F27',
        a4: pink,
        a5: lightBlue,
        palette: {
            primary: teal,
            secondary: indigo,
            error: deepOrange
        }
    };
}

export function isUrlValid(userInput) {
    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(userInput);
}