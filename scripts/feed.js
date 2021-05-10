'use strict';

const xml = require("xml");
const podcast = require("podcast");

hexo.extend.generator.register("feed", (locals) => {

    // Load config
    const config = hexo.config;
    const theme = hexo.theme.config;
    const urler = hexo.extend.helper.get("url_for").bind(hexo);
    const strip = hexo.extend.helper.get("strip_html").bind(hexo);
    if (!theme.rss || !theme.rss.enable) return;

    // Render for site config
    const feed = new podcast({
        title: config.title,
        description: config.description,
        copyright: theme.copyright,
        language: config.language.slice(0, 2),
        siteUrl: config.url,
        imageUrl: theme.logo,
        itunesSubtitle: config.subtitle,
        itunesSummary: config.description,
        itunesAuthor: config.author,
        itunesExplicit: theme.rss.config.explicit,
        itunesCategory: theme.rss.config.category,
        itunesOwner: {
            name: config.author,
            email: theme.rss.config.email
        }
    });

    // Rendor for podcasts
    locals.posts.sort('date', -1).each(function (post) {
        if (!post.podcast) return;
        feed.addItem({
            title: post.title,
            description: post.excerpt,
            url: config.url + urler(post.path),
            guid: config.url + urler(post.path),
            author: post.podcast.authors.join(', '),
            date: post.date,
            enclosure: {
                url: post.podcast.media.url,
                type: post.podcast.media.type,
                size: post.podcast.media.size
            },
            itunesAuthor: post.podcast.authors.join(', '),
            itunesExplicit: theme.rss.config.explicit,
            itunesSubtitle: post.podcast.subtitle,
            itunesSummary: strip(post.excerpt),
            itunesCategory: theme.rss.config.category,
            itunesDuration: post.podcast.duration
        });
    });

    return {
        path: theme.rss.path,
        data: feed.buildXml()
    };
});
