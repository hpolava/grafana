import { e2e } from '../index';

export const login = (username: string = 'admin', password: string = 'admin') => {
  e2e().logToConsole('Trying to login with username:', username);
  e2e.pages.Login.visit();
  e2e.pages.Login.username()
    .should('be.visible') // prevents flakiness
    .type(username);
  e2e.pages.Login.password().type(password);
  e2e.pages.Login.submit().click();

  // Local tests will have insecure credentials
  e2e()
    .url()
    .then(url => {
      if (/^https?:\/\/localhost/.test(url)) {
        e2e.pages.Login.skip()
          .should('be.visible')
          .click();
      }
    });

  e2e()
    .get('.login-page')
    .should('not.exist');

  // Remember nothing from previous sessions
  // @todo https://github.com/javierbrea/cypress-localstorage-commands/issues/93
  e2e()
    .wrap({ clearLocalStorage: () => localStorage.clear() })
    .invoke('clearLocalStorage');

  e2e().logToConsole('Logged in with username:', username);
};
