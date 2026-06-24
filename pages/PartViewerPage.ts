import { Page, Locator } from 'playwright';

class PartViewerPage {
  private page: Page;
  private searchBox: Locator;
  private searchButton: Locator;
  private firstPartButton: Locator;
  private partGroupButton: Locator;
  private backSideButton: Locator;
  private topSideButton: Locator;
  private bottomSideButton: Locator;
  private leftSideButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByRole('textbox', { name: 'Search by name' });
    this.searchButton = page.locator('.svg-inline--fa.fa-magnifying-glass');
    this.firstPartButton = page.locator(
      '.cell > .flex > div > div > .u2p-iconbutton-next > .u2p-iconbutton-next-icon > .svg-inline--fa'
    ).first();
    this.partGroupButton = page.getByRole('button', { name: 'Test' });
    this.backSideButton = page.getByRole('button', { name: 'Machining side back' });
    this.topSideButton = page.getByRole('button', { name: 'Machining side top' });
    this.bottomSideButton = page.getByRole('button', { name: 'Machining side bottom' });
    this.leftSideButton = page.getByRole('button', { name: 'Machining side left' });
  }

  async navigateTo(): Promise<void> {
    await this.page.getByRole('link', { name: 'autoCAM' }).click();
    await this.searchBox.click();
    await this.searchBox.fill('10030_AP214 3-1');
    await this.searchButton.click();
    await this.firstPartButton.click();
    await this.partGroupButton.click();
  }

  async selectBack(): Promise<void> {
    await this.backSideButton.click();
  }

  async selectTop(): Promise<void> {
    await this.topSideButton.click();
  }

  async selectBottom(): Promise<void> {
    await this.bottomSideButton.click();
  }

  async selectLeft(): Promise<void> {
    await this.leftSideButton.click();
  }
}

export default PartViewerPage;