//This file outlines the Season Template.
var Template = function(opts) { 

    var mediaInfo;
    for (var el in opts._children) {
        if (opts._children[el]._elementType == 'Media') {
            mediaInfo = opts._children[el];
            break;
        }
    }
    var imgURL = this.BASEURL + opts.thumb;
    
    return `<?xml version="1.0" encoding="UTF-8" ?>
            <document>
                <productTemplate>
                    <banner>
                        <infoList>
                        </infoList>
                        <stack>
                            <title>${opts.title.escapeXML()}</title>
                            <row>
                                <text>${moment.duration(opts.duration).humanize()}</text>
                                <text>${opts.year}</text>
                            </row>
                            <description allowsZooming="true" moreLabel="more">${opts.summary.escapeXML()}</description>
                            <row>
                                <buttonLockup data-video-url="${mediaInfo._children[0].key}">
                                    <badge src="resource://button-play" />
                                    <title>Play</title>
                                </buttonLockup>
                            </row>
                        </stack>
                        <heroImg src="${imgURL}" />
                    </banner>
                </productTemplate>
            </document>`
}