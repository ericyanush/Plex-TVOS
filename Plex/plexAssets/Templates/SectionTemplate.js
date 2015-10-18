//This file outlines the Section Template.
var Template = function(opts) { 

    var items = "";
    for (var item in opts) {
        var imgURL = this.BASEURL + opts[item].thumb;
        var curr = `<listItemLockup data-id="${opts[item].ratingKey}" data-media-type="${opts[item].type}" data-title="${opts[item].title.escapeXML()}">
                        <title>${opts[item].title.escapeXML()}</title>
                        <relatedContent>
                            <lockup>
                                <img src="${imgURL}" />
                                <title>${opts[item].title.escapeXML()}</title>
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
                        <title>Series</title>
                        <section>
                            ${items}
                        </section>
                    </list>
                </listTemplate>
            </document>`
}