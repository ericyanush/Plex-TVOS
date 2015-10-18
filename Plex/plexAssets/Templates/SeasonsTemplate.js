//This file outlines the Sections Template.
var Template = function(opts) { 

    var seriesTitle = opts.series;
    var seasons = opts.seasons;

    var items = "";
    for (var season in seasons) {
        var imgURL = this.BASEURL + seasons[season].thumb;
        var curr = `<listItemLockup data-id="${seasons[season].key}" data-season-title="${seasons[season].title}" data-series-title="${seriesTitle}">
                        <title>${seasons[season].title.escapeXML()}</title>
                        <relatedContent>
                            <lockup>
                                <img src="${imgURL}" />
                                <title>${seasons[season].title.escapeXML()}</title>
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
                        <section>
                            ${items}
                        </section>
                    </list>
                </listTemplate>
            </document>`
}