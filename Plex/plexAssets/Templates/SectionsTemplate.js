//This file outlines the Sections Template.
var Template = function(opts) { 

    var sections = "";
    for (var section in opts) {
        var curr = `<listItemLockup data-id="${opts[section].key}">
                        <title>${opts[section].title.escapeXML()}</title>
                    </listItemLockup>
                    `;
        sections += curr;
    }

    return `<?xml version="1.0" encoding="UTF-8" ?>
            <document>
                <listTemplate> 
                    <banner>
                        <title>Library Sections</title>
                    </banner>
                    <list>
                        <section>
                            ${sections}
                        </section>
                    </list>
                </listTemplate>
            </document>`
}