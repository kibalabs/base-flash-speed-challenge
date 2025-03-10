// eslint-disable-next-line import/no-extraneous-dependencies
import { MetaTag, Tag } from '@kibalabs/build/scripts/plugins/injectSeoPlugin.js';

const title = 'Base FlashBlock Speed Challenge';
const description = 'Experience how insanely fast the new FlashBlocks are on Base';
const url = 'https://base-flashblock-speed-challenge.tokenpage.xyz';
// const imageUrl = `${url}/assets/banner.png`;

const seoTags = [
  new MetaTag('description', description),
  new Tag('meta', { property: 'og:title', content: title }),
  new Tag('meta', { property: 'og:description', content: description }),
  new Tag('meta', { property: 'og:url', content: url }),
  // new Tag('meta', { property: 'og:image', content: imageUrl }),
  new MetaTag('twitter:card', 'summary_large_image'),
  new MetaTag('twitter:site', '@krishan711'),
  new Tag('link', { rel: 'canonical', href: url }),
  new Tag('link', { rel: 'icon', type: 'image/png', href: '/assets/icon.png' }),
];

export default (config) => {
  const newConfig = config;
  newConfig.seoTags = seoTags;
  newConfig.title = title;
  newConfig.analyzeBundle = false;
  return newConfig;
};
