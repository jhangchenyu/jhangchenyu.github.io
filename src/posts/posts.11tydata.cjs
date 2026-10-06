module.exports = {
  layout: 'article.njk',
  eleventyComputed: {
    permalink: data => data.status === 'published' ? `/articles/${data.slug}/index.html` : false,
    eleventyExcludeFromCollections: data => data.status !== 'published',
    navSection: data => require('../_data/topics.json').find(topic => topic.id === data.category)?.section
  }
};
