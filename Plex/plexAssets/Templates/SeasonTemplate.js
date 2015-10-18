//This file outlines the Season Template.
var Template = function(opts) { 

    var seriesTitle = opts.series;
    var seasonTitle = opts.season
    var episodes = opts.episodes;

    var items = "";
    for (var ep in episodes) {
        var imgURL = this.BASEURL + episodes[ep].thumb;
        var curr = `<listItemLockup data-id="${episodes[ep].key}" data-season-title="${seasonTitle}" data-series-title="${seriesTitle}">
                        <title>${episodes[ep].index}. ${episodes[ep].title.escapeXML()}</title>
                        <relatedContent>
                            <lockup>
                                <img src="${imgURL}" />
                                <title>${episodes[ep].title.escapeXML()}</title>
                            </lockup>
                        </relatedContent>
                    </listItemLockup>
                    `;
        items += curr;
    }

    return `<?xml version="1.0" encoding="UTF-8" ?>
            <document>
                <listTemplate> 
                    <list>
                        <title>${seriesTitle}</title>
                        <header><title>${seasonTitle}</title></header>
                        <section>
                            ${items}
                        </section>
                    </list>
                </listTemplate>
            </document>`
}