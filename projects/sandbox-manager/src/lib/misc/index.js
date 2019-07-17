import {indigo, teal} from "@material-ui/core/colors";
import {pink, lightBlue} from "@material-ui/core/colors";

export function customizeTheme(theme) {
    // const newTheme = Object.assign({tableRow: {}, tabs: {}}, theme);
    //
    // newTheme.palette.primary1Color = "#1B9F7D";
    // newTheme.palette.primary2Color = "#0E5676";
    // newTheme.palette.primary3Color = "#757575";
    // newTheme.palette.primary4Color = "#9C0227";
    // newTheme.palette.primary5Color = "#F5F5F5";
    // newTheme.palette.primary6Color = "#3D3D3D";
    // newTheme.palette.primary7Color = "#D7D7D7";
    // newTheme.palette.canvasColor = "#fff";
    // newTheme.palette.accent1Color = "#9D0072";
    // newTheme.palette.accent2Color = "#9E7B20";
    // newTheme.palette.accent3Color = "#759F27";
    // newTheme.palette.accent4Color = pink;
    // newTheme.palette.accent5Color = lightBlue;
    // newTheme.tableRow.hoverColor = 'rgba(0, 0, 0, 0.15)';
    // newTheme.tableRow.stripeColor = 'whitesmoke';
    // newTheme.tabs.backgroundColor = 'white';
    // newTheme.tabs.textColor = 'gray';
    // newTheme.tabs.selectedTextColor = '#005778';

    return {
        p1: '#1B9F7D',
        p2: '#0E5676',
        p3: '#757575',
        p4: '#9C0227',
        p5: '#F5F5F5',
        p6: '#3D3D3D',
        p7: '#D7D7D7',
        palette: {
            primary: teal,
            secondary: indigo,
            error: {
                light: '#1B9F7D',
                main: '#0E5676',
                dark: '#757575',
                contrastText: '#9C0227'
            }
        }
    };
}

export function getPatientAnswer(index) {
    switch (index) {
        case 1:
            return "estimator.survey.q.agree_plus";
        case 2:
            return "estimator.survey.q.agree";
        case 3:
            return "estimator.survey.q.agree_minus";
        case 4:
            return "estimator.survey.q.disagree_minus";
        case 5:
            return "estimator.survey.q.disagree";
        case 6:
        default:
            return "estimator.survey.q.disagree_plus";
    }
}

export function isUrlValid(userInput) {
    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(userInput);
}