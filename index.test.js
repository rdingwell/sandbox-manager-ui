let { helpMenuButtonTest } = require('./tests/dashboard/helpButtonWorks');
let { helpMenuItemsTest } = require('./tests/dashboard/helpMenuItemsWork');
let { createSandbox } = require('./tests/dashboard/createSandbox');
const ACTIONS = { helpMenuButtonTest, helpMenuItemsTest, createSandbox };

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