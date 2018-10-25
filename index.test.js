let { helpMenuButtonTest } = require('./tests/dashboard/helpButtonWorks');
let { helpMenuItemsTest } = require('./tests/dashboard/helpMenuItemsWork');
let { createSandbox } = require('./tests/dashboard/createSandbox');
let { deleteSandbox } = require('./tests/dashboard/deleteSandbox');
const ACTIONS = { helpMenuButtonTest, helpMenuItemsTest, createSandbox, deleteSandbox };

const TEST_SUITE = [
    {
        title: 'Sample test case one',
        tests: [
            {
                screen: 'dashboard',
                action: 'helpMenuButtonTest'
            },
            // {
            //     screen: 'dashboard',
            //     action: 'helpMenuItemsTest'
            // },
            {
                screen: 'dashboard',
                action: 'createSandbox'
            },
            {
                screen: 'dashboard',
                action: 'deleteSandbox'
            }
        ]
    },
    {
        title: 'Sample test case two',
        tests: [
            {
                screen: 'dashboard',
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