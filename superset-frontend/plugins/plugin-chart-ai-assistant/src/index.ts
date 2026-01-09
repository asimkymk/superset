import { ChartMetadata, ChartPlugin } from '@superset-ui/core';
import AIAssistant from './AIAssistant';
import transformProps from './transformProps';
import buildQuery from './buildQuery';
import thumbnail from './images/thumbnail.png';

const metadata = new ChartMetadata({
  category: 'Tools',
  description: 'AI Assistant to chat with your dashboard data',
  name: 'AI Assistant',
  thumbnail,
  useLegacyApi: false,
});

export default class AIAssistantPlugin extends ChartPlugin {
  constructor() {
    super({
      buildQuery,
      metadata,
      transformProps,
      loadChart: () => Promise.resolve(AIAssistant),
    });
  }
}
