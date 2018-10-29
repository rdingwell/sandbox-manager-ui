let { helpMenuButtonTest } = require('./tests/header/helpButtonWorks');
let { helpMenuItemsTest } = require('./tests/header/helpMenuItemsWork');
let { notificationsWork } = require('./tests/header/notificationsWork');
let { signOut } = require('./tests/header/signOut');
let { userMenuWorks } = require('./tests/header/userMenuWorks');
let { createSandbox } = require('./tests/dashboard/createSandbox');
let { deleteSandbox } = require('./tests/settings/deleteSandbox');
const ACTIONS = { helpMenuButtonTest, helpMenuItemsTest, createSandbox, deleteSandbox, notificationsWork, userMenuWorks, signOut };

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
            {
                screen: 'header',
                action: 'signOut'
            },
            // {
            //     screen: 'header',
            //     action: 'helpMenuItemsTest'
            // },
            // {
            //     screen: 'dashboard',
            //     action: 'createSandbox'
            // },
            // {
            //     screen: 'dashboard',
            //     action: 'deleteSandbox'
            // }
        ]
    },
    {
        title: 'Sample test case two',
        tests: [
            {
                screen: 'header',
                action: 'helpMenuButtonTest'
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