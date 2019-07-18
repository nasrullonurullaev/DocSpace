import React from 'react';
import { storiesOf } from '@storybook/react';
import { Toast, toastr } from 'asc-web-components';
import Section from '../../../.storybook/decorators/section';

storiesOf('Components|Toast', module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .addParameters({ options: { showAddonPanel: false } })
  .add('all', () => {
    return (
      <>
      <Toast/> 
      <Section>
        <button onClick = {()=> {
              toastr.success('Demo text for success Toast');
              toastr.error('Demo text for error Toast');
              toastr.warning('Demo text for warning Toast');
              toastr.info('Demo text for info Toast');
              
              toastr.success('Demo text for success Toast with title', 'Demo title');
              toastr.error('Demo text for error Toast with title', 'Demo title');
              toastr.warning('Demo text for warning Toast with title', 'Demo title');
              toastr.info('Demo text for info Toast with title', 'Demo title');

              toastr.success('Demo text for success manual closed Toast', null, false);
              toastr.error('Demo text for error manual closed Toast', null, false);
              toastr.warning('Demo text for warning manual closed Toast', null, false);
              toastr.info('Demo text for info manual closed Toast', null, false);

              toastr.success('Demo text for success manual closed Toast with title', 'Demo title', false);
              toastr.error('Demo text for error manual closed Toast with title', 'Demo title', false);
              toastr.warning('Demo text for warning manual closed Toast with title', 'Demo title', false);
              toastr.info('Demo text for info manual closed Toast with title', 'Demo title', false);

               }}>Show all Toastr</button>

      </Section>
    </>
   );
});
   