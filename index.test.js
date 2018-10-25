const TEST_SUITE = [
    {
        title: 'Sample test case one',
        tests: [
            {
                screen: 'dashboard',
                action: 'helpButtonWorks'
            },
            {
                screen: 'dashboard',
                action: 'helpMenuItemsWork'
            }
        ]
    },
    {
        title: 'Sample test case two',
        tests: [
            {
                screen: 'dashboard',
                action: 'helpButtonWorks'
            },
            {
                screen: 'dashboard',
                action: 'helpMenuItemsWork'
            },
            {
                screen: 'dashboard',
                action: 'createSandbox'
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
            require(`./tests/${test.screen}/${test.action}`);
        });
    });
});