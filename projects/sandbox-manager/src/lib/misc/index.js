import getMuiTheme from "material-ui/styles/getMuiTheme";
import { pink100, lightBlue100 } from "material-ui/styles/colors";

export function customizeTheme(theme) {
    const newTheme = Object.assign({tableRow: {}, tabs: {}}, theme);

    newTheme.palette.primary1Color = "#1b9f7d";
    newTheme.palette.primary3Color = "#005778";
    newTheme.palette.canvasColor = "#fff";
    newTheme.palette.accent1Color = "#005778";
    newTheme.palette.accent4Color = pink100;
    newTheme.palette.accent5Color = lightBlue100;
    newTheme.tableRow.hoverColor = 'rgba(0, 0, 0, 0.15)';
    newTheme.tableRow.stripeColor = 'whitesmoke';
    newTheme.tabs.backgroundColor = 'white';
    newTheme.tabs.textColor = 'gray';
    newTheme.tabs.selectedTextColor = '#005778';

    return getMuiTheme(newTheme);
}

export function getPatientAnswer(index) {
    switch (index) {
    case 1: return "estimator.survey.q.agree_plus";
    case 2: return "estimator.survey.q.agree";
    case 3: return "estimator.survey.q.agree_minus";
    case 4: return "estimator.survey.q.disagree_minus";
    case 5: return "estimator.survey.q.disagree";
    case 6:
    default: return "estimator.survey.q.disagree_plus";
    }
}
