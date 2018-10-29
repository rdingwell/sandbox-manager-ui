const {PAGES, navigateTo} = require('./navigateTo');

exports.testNavigation = () => describe('Testing all the sandbox manager\'s pages', function () {
    it('should navigate to launch scenarios page', async () => {
        await navigateTo(PAGES.LAUNCH_SCENARIOS);
    });
    it('should navigate to personas page', async () => {
        await navigateTo(PAGES.PERSONAS);
    });
    it('should navigate to patients page', async () => {
        await navigateTo(PAGES.PATIENT);
    });
    it('should navigate to practitioners page', async () => {
        await navigateTo(PAGES.PRACTITIONER);
    });
    it('should navigate to data manger page', async () => {
        await navigateTo(PAGES.DATA_MANAGER);
    });
    it('should navigate to settings page', async () => {
        await navigateTo(PAGES.SETTINGS);
    });
    it('should navigate to apps page', async () => {
        await navigateTo(PAGES.APPS);
    });
});