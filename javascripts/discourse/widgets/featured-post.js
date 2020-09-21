import { createWidget } from 'discourse/widgets/widget';
import { escapeExpression } from "discourse/lib/utilities";
import RawHtml from "discourse/widgets/raw-html";
import { h } from 'virtual-dom';

let layouts;

try {
  layouts = requirejs('discourse/plugins/discourse-layouts/discourse/lib/layouts');
} catch(error) {
  layouts = { createLayoutsWidget: createWidget };
  console.error(error);
}

export default layouts.createLayoutsWidget('featured-post', {
  shouldRender(attrs) {
    const featuredTags = settings.featured_post_tags.split('|');
    if (!featuredTags.length) return true;
    return attrs.topic.tags.filter(t => {
      return featuredTags.includes(t);
    }).length;
  },
  
  html(attrs, state) {
    let result = [h('h3.featured-post-title', settings.featured_post_title)];
    if (state.featuredPost) {
      result.push(
        new RawHtml({ html: `<span>${state.featuredPost.cooked}</span>` }) 
      );
    } else {
      this.loadFeaturedPost();
    }
    return result;
  },
  
  loadFeaturedPost() {
    this.attrs.topic.firstPost().then(post => {
      this.state.featuredPost = post;
      this.scheduleRerender();
    });
  }
});