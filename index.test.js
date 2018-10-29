/*
-------------- HEADER TESTERS --------------
 */
let { helpMenuButtonTest } = require('./tests/header/helpButtonWorks');
let { helpMenuItemsTest } = require('./tests/header/helpMenuItemsWork');
let { notificationsWork } = require('./tests/header/notificationsWork');
let { toggleSideMenu } = require('./tests/header/toggleSideMenu');
let { signOut } = require('./tests/header/signOut');
let { userMenuWorks } = require('./tests/header/userMenuWorks');
/*
-------------- NAVIGATION TESTERS --------------
 */
let {testNavigation} = require('./tests/navigation/testNavigation');
/*
-------------- DASHBOARD TESTERS --------------
 */
let { createSandbox } = require('./tests/dashboard/createSandbox');
let { selectSandbox } = require('./tests/dashboard/selectSandbox');
/*
-------------- SETTINGS TESTERS --------------
 */
let { deleteSandbox } = require('./tests/settings/deleteSandbox');

const ACTIONS = { helpMenuButtonTest, helpMenuItemsTest, createSandbox, deleteSandbox, notificationsWork, userMenuWorks, signOut, toggleSideMenu, selectSandbox, testNavigation };

const UTILS = require('./tests/utils');

const TEST_SUITE = [
    {
        title: 'Sample test case one',
        tests: [
            {
                screen: 'header',
                action: 'helpMenuButtonTest'
            },
            {
                screen: 'header',
                action: 'notificationsWork'
            },
            {
                screen: 'header',
                action: 'userMenuWorks'
            },
            // {
            //     screen: 'header',
            //     action: 'helpMenuItemsTest'
            // },
            // {
            //     screen: 'dashboard',
            //     action: 'createSandbox'
            // },
            {
                screen: 'dashboard',
                action: 'selectSandbox'
            },
            {
                screen: 'header',
                action: 'toggleSideMenu'
            },
            {
                screen: 'navigation',
                action: 'testNavigation'
            }
        ]
    },
    {
        title: 'Sample test case two',
        tests: [
            // {
            //     screen: 'dashboard',
            //     action: 'deleteSandbox'
            // },
            {
                screen: 'header',
                action: 'signOut'
            }
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
            ACTIONS[test.action]();
        });
    });
});

describe('Finish the testing', function () {
    it('should close the browser and finish the tests', async () => {
        await UTILS.closeTab();
    });
});