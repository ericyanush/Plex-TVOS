//This file outlines the Season Template.
var Template = function(opts) { 
    
    var ondeckItems = "";
    var recentlyAddedItems = "";
    var recentlyViewedItems = "";
    var recentlyAiredItems = "";

    for (var item in opts.ondeck) {
        var thumbKey = opts.ondeck[item].hasOwnProperty('grandparentThumb')? "grandparentThumb" : "thumb";
        var curr = `<lockup data-id="${opts.ondeck[item].key}">
                        <img src="${this.BASEURL}${opts.ondeck[item][thumbKey]}" width="182" height="274"/>
                        <title>${opts.ondeck[item].title.escapeXML()}</title>
                    </lockup>
                    `;
        ondeckItems += curr;
    }
    for (var item in opts.recentlyAdded) {
        var thumbKey = opts.recentlyAdded[item].hasOwnProperty('grandparentThumb')? "grandparentThumb" : "thumb";
        var curr = `<lockup data-id="${opts.recentlyAdded[item].key}">
                        <img src="${this.BASEURL}${opts.recentlyAdded[item][thumbKey]}" width="182" height="274"/>
                        <title>${opts.recentlyAdded[item].title.escapeXML()}</title>
                    </lockup>
                    `;
        recentlyAddedItems += curr;
    }

    for (var item in opts.recentlyViewed) {
        var thumbKey = opts.recentlyViewed[item].hasOwnProperty('grandparentThumb')? "grandparentThumb" : "thumb";
        var curr = `<lockup data-id="${opts.recentlyViewed[item].key}">
                        <img src="${this.BASEURL}${opts.recentlyViewed[item][thumbKey]}" width="182" height="274"/>
                        <title>${opts.recentlyViewed[item].title.escapeXML()}</title>
                    </lockup>
                    `;
        recentlyViewedItems += curr;
    }

    for (var item in opts.recentlyAired) {
        var thumbKey = opts.recentlyAired[item].hasOwnProperty('grandparentThumb')? "grandparentThumb" : "thumb";
        var curr = `<lockup data-id="${opts.recentlyAired[item].key}">
                        <img src="${this.BASEURL}${opts.recentlyAired[item][thumbKey]}" width="182" height="274"/>
                        <title>${opts.recentlyAired[item].title.escapeXML()}</title>
                    </lockup>
                    `;
        recentlyAiredItems += curr;
    }

    return `<?xml version="1.0" encoding="UTF-8" ?>
            <document>
                <stackTemplate>
                    <banner>
                        <title>On Deck</title>
                    </banner>
                    <collectionList>
                        <shelf>
                            <section>
                                <header>
                                    <title>On Deck</title>
                                </header>
                                ${ondeckItems}
                            </section>
                        </shelf>
                        <shelf>
                            <section>
                                <header>
                                    <title>Recently Added</title>
                                </header>
                                ${recentlyAddedItems}
                            </section>
                        </shelf>
                        <shelf>
                            <section>
                                <header>
                                    <title>Recently Aired</title>
                                </header>
                                ${recentlyAiredItems}
                            </section>
                        </shelf>
                        <shelf>
                            <section>
                                <header>
                                    <title>Recently Viewed</title>
                                </header>
                                ${recentlyViewedItems}
                            </section>
                        </shelf>
                    </collectionList>
                </stackTemplate>
            </document>`
}