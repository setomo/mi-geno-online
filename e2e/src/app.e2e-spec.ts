import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';

const expectedH1 = 'Tour of Heroes';
const expectedTitle = `${expectedH1}`;
const targetHero = { id: 15, name: 'Magneta' };
const targetHeroDashboardIndex = 3;
const nameSuffix = 'X';
const newHeroName = targetHero.name + nameSuffix;

class Rjob {
  constructor(public id: number, public name: string) {}

  // Factory methods

  // Rjob from string formatted as '<id> <name>'.
  static fromString(s: string): Rjob {
    return new Rjob(
      +s.substr(0, s.indexOf(' ')),
      s.substr(s.indexOf(' ') + 1),
    );
  }

  // Rjob from rjob list <li> element.
  static async fromLi(li: ElementFinder): Promise<Rjob> {
    const stringsFromA = await li.all(by.css('a')).getText();
    const strings = stringsFromA[0].split(' ');
    return { id: +strings[0], name: strings[1] };
  }

  // Rjob id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Rjob> {
    // Get rjob id from the first <div>
    const id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    const name = await detail.element(by.css('h2')).getText();
    return {
      id: +id.substr(id.indexOf(' ') + 1),
      name: name.substr(0, name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appHeroesHref: navElts.get(0),
      appHeroes: element(by.css('app-root app-rjobs')),
      allHeroes: element.all(by.css('app-root app-rjobs li')),
      selectedHeroSubview: element(by.css('app-root app-rjobs >  div a')),

      appDashboardHref: navElts.get(1),
      appDashboard: element(by.css('app-root app-dashboard')),
      topHeroes: element.all(by.css('app-root app-dashboard >  div:last-child')),


      rjobDetail: element(by.css('app-root app-rjob-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, async () => {
      expect(await browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, async () => {
      await expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Heroes'];
    it(`has views ${expectedViewNames}`, async () => {
      const viewNames = await getPageElts().navElts.map(el => el!.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', async () => {
      const page = getPageElts();
      expect(await page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top rjobs', async () => {
      const page = getPageElts();
      expect(await page.topHeroes.count()).toEqual(4);
    });

    it(`selects and routes to ${targetHero.name} details`, dashboardSelectTargetHero);

    it(`updates rjob name (${newHeroName}) in details view`, updateHeroNameInDetailView);

    it(`cancels and shows ${targetHero.name} in Dashboard`, async () => {
      await element(by.buttonText('go back')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetHeroElt = getPageElts().topHeroes.get(targetHeroDashboardIndex);
      expect(await targetHeroElt.getText()).toEqual(targetHero.name);
    });

    it(`selects and routes to ${targetHero.name} details`, dashboardSelectTargetHero);

    it(`updates rjob name (${newHeroName}) in details view`, updateHeroNameInDetailView);

    it(`saves and shows ${newHeroName} in Dashboard`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetHeroElt = getPageElts().topHeroes.get(targetHeroDashboardIndex);
      expect(await targetHeroElt.getText()).toEqual(newHeroName);
    });

  });

  describe('Heroes tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Heroes view', async () => {
      await getPageElts().appHeroesHref.click();
      const page = getPageElts();
      expect(await page.appHeroes.isPresent()).toBeTruthy();
      expect(await page.allHeroes.count()).toEqual(10, 'number of rjobs');
    });

    it('can route to rjob details', async () => {
      await getHeroLiEltById(targetHero.id).click();

      const page = getPageElts();
      expect(await page.rjobDetail.isPresent()).toBeTruthy('shows rjob detail');
      const rjob = await Rjob.fromDetail(page.rjobDetail);
      expect(rjob.id).toEqual(targetHero.id);
      expect(rjob.name).toEqual(targetHero.name.toUpperCase());
    });

    it(`updates rjob name (${newHeroName}) in details view`, updateHeroNameInDetailView);

    it(`shows ${newHeroName} in Heroes list`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular();
      const expectedText = `${targetHero.id} ${newHeroName}`;
      expect(await getHeroAEltById(targetHero.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newHeroName} from Heroes list`, async () => {
      const rjobsBefore = await toHeroArray(getPageElts().allHeroes);
      const li = getHeroLiEltById(targetHero.id);
      await li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(await page.appHeroes.isPresent()).toBeTruthy();
      expect(await page.allHeroes.count()).toEqual(9, 'number of rjobs');
      const rjobsAfter = await toHeroArray(page.allHeroes);
      // console.log(await Rjob.fromLi(page.allHeroes[0]));
      const expectedHeroes =  rjobsBefore.filter(h => h.name !== newHeroName);
      expect(rjobsAfter).toEqual(expectedHeroes);
      // expect(page.selectedHeroSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetHero.name}`, async () => {
      const addedHeroName = 'Alice';
      const rjobsBefore = await toHeroArray(getPageElts().allHeroes);
      const numHeroes = rjobsBefore.length;

      await element(by.css('input')).sendKeys(addedHeroName);
      await element(by.buttonText('Add rjob')).click();

      const page = getPageElts();
      const rjobsAfter = await toHeroArray(page.allHeroes);
      expect(rjobsAfter.length).toEqual(numHeroes + 1, 'number of rjobs');

      expect(rjobsAfter.slice(0, numHeroes)).toEqual(rjobsBefore, 'Old rjobs are still there');

      const maxId = rjobsBefore[rjobsBefore.length - 1].id;
      expect(rjobsAfter[numHeroes]).toEqual({id: maxId + 1, name: addedHeroName});
    });

    it('displays correctly styled buttons', async () => {
      const buttons = await element.all(by.buttonText('x'));

      for (const button of buttons) {
        // Inherited styles from styles.css
        expect(await button.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
        expect(await button.getCssValue('border')).toContain('none');
        expect(await button.getCssValue('padding')).toBe('1px 10px 3px');
        expect(await button.getCssValue('border-radius')).toBe('4px');
        // Styles defined in rjobs.component.css
        expect(await button.getCssValue('left')).toBe('210px');
        expect(await button.getCssValue('top')).toBe('5px');
      }

      const addButton = element(by.buttonText('Add rjob'));
      // Inherited styles from styles.css
      expect(await addButton.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
      expect(await addButton.getCssValue('border')).toContain('none');
      expect(await addButton.getCssValue('padding')).toBe('8px 24px');
      expect(await addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive rjob search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      await getPageElts().searchBox.sendKeys('Ma');
      await browser.sleep(1000);

      expect(await getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      await getPageElts().searchBox.sendKeys('g');
      await browser.sleep(1000);
      expect(await getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetHero.name}`, async () => {
      await getPageElts().searchBox.sendKeys('n');
      await browser.sleep(1000);
      const page = getPageElts();
      expect(await page.searchResults.count()).toBe(1);
      const rjob = page.searchResults.get(0);
      expect(await rjob.getText()).toEqual(targetHero.name);
    });

    it(`navigates to ${targetHero.name} details view`, async () => {
      const rjob = getPageElts().searchResults.get(0);
      expect(await rjob.getText()).toEqual(targetHero.name);
      await rjob.click();

      const page = getPageElts();
      expect(await page.rjobDetail.isPresent()).toBeTruthy('shows rjob detail');
      const rjob2 = await Rjob.fromDetail(page.rjobDetail);
      expect(rjob2.id).toEqual(targetHero.id);
      expect(rjob2.name).toEqual(targetHero.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetHero() {
    const targetHeroElt = getPageElts().topHeroes.get(targetHeroDashboardIndex);
    expect(await targetHeroElt.getText()).toEqual(targetHero.name);
    await targetHeroElt.click();
    await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    const page = getPageElts();
    expect(await page.rjobDetail.isPresent()).toBeTruthy('shows rjob detail');
    const rjob = await Rjob.fromDetail(page.rjobDetail);
    expect(rjob.id).toEqual(targetHero.id);
    expect(rjob.name).toEqual(targetHero.name.toUpperCase());
  }

  async function updateHeroNameInDetailView() {
    // Assumes that the current view is the rjob details view.
    await addToHeroName(nameSuffix);

    const page = getPageElts();
    const rjob = await Rjob.fromDetail(page.rjobDetail);
    expect(rjob.id).toEqual(targetHero.id);
    expect(rjob.name).toEqual(newHeroName.toUpperCase());
  }

});

async function addToHeroName(text: string): Promise<void> {
  const input = element(by.css('input'));
  await input.sendKeys(text);
}

async function expectHeading(hLevel: number, expectedText: string): Promise<void> {
  const hTag = `h${hLevel}`;
  const hText = await element(by.css(hTag)).getText();
  expect(hText).toEqual(expectedText, hTag);
}

function getHeroAEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getHeroLiEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toHeroArray(allHeroes: ElementArrayFinder): Promise<Rjob[]> {
  return allHeroes.map(rjob => Rjob.fromLi(rjob!));
}
