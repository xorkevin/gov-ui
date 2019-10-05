import {configure, addParameters, addDecorator} from '@storybook/react';
import {themes} from '@storybook/theming';
import {withContexts} from '@storybook/addon-contexts/react';
import {contexts} from './contexts';

addParameters({
  options: {
    theme: themes.dark,
  },
});

addDecorator(withContexts(contexts));

configure(require.context('../src', true, /\.stories\.js$/), module);
