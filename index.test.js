/*
-------------- HEADER TESTERS --------------
 */
let { helpMenuButtonTest } = require('./tests/header/helpButtonWorks');
let { helpMenuItemsTest } = require('./tests/header/helpMenuItemsWork');
let { notificationsWork } = require('./tests/header/notificationsWork');
let { toggleSideMenu } = require('./tests/header/toggleSideMenu');
let { signOut } = require('./tests/header/signOut');
let { userMenuWorks } = require('./tests/header/userMenuWorks');
let { testHomeButton } = require('./tests/header/homeButtonWorks');
/*
-------------- NAVIGATION TESTERS --------------
 */
let { testNavigation } = require('./tests/navigation/testNavigation');
/*
-------------- DASHBOARD TESTERS --------------
 */
let { createSandbox } = require('./tests/dashboard/createSandbox');
let { testSandboxSelection } = require('./tests/dashboard/selectSandbox');
/*
-------------- APPS TESTERS --------------
 */
let { testAppCreation } = require('./tests/apps/testAppCreation');
/*
-------------- SETTINGS TESTERS --------------
 */
let { deleteSandbox } = require('./tests/settings/deleteSandbox');

const ACTIONS = {
    helpMenuButtonTest, helpMenuItemsTest, createSandbox, deleteSandbox, notificationsWork, userMenuWorks, signOut, toggleSideMenu, testSandboxSelection, testNavigation, testHomeButton, testAppCreation
};

const UTILS = require('./tests/utils');

const TEST_SUITE = [
    {
        title: 'Sample test case one',
        tests: [
            'helpMenuButtonTest', 'notificationsWork', 'userMenuWorks', 'helpMenuItemsTest', 'createSandbox', 'testHomeButton', 'testSandboxSelection', 'toggleSideMenu', 'testNavigation', 'testAppCreation'
        ]
    },
    {
        title: 'Sample test case two',
        tests: [
            'deleteSandbox', 'signOut'
        ]
    }
];

//Initialize the app
describe('Initialize', function () {
    require('./tests/Init/init');
    require('./tests/Init/login');
});

TEST_SUITE.map(testCase => {
    describe(testCase.title, function () {
        testCase.tests.map(test => {
            test.indexOf('__') !== 0 && ACTIONS[test]();
        });
    });
});

describe('Finish the testing', function () {
    it('should close the browser and finish the tests', async () => {
        await UTILS.closeTab();
    });
});