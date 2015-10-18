//This file outlines the catalogTemplate.
var Template = function() { return `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
    <catalogTemplate> 
      <banner> 
        <title>RWDevConHighlights</title>
      </banner>
      <list> 
        <section> 
    <listItemLockup> 
      <title>Inspiration Videos</title>
      <decorationLabel>13</decorationLabel>
            //1. add from here
      <relatedContent> 
        <grid>
          <section> 
                  //2
      <lockup videoURL="http://www.rwdevcon.com/videos/Ray-Wenderlich-Teamwork.mp4">
        <img src="${this.BASEURL}images/ray.png" width="500" height="308" />
      </lockup>
      <lockup videoURL="http://www.rwdevcon.com/videos/Ryan-Nystrom-Contributing.mp4">
        <img src="${this.BASEURL}images/ryan.png" width="500" height="308" />
      </lockup>                 
            <lockup videoURL="http://www.rwdevcon.com/videos/Matthijs-Hollemans-Math-Isnt-Scary.mp4">
        <img src="${this.BASEURL}images/matthijs.png" width="500" height="308" />
      </lockup>                 
      <lockup videoURL="http://www.rwdevcon.com/videos/Vicki-Wenderlich-Identity.mp4">
        <img src="${this.BASEURL}images/vicki.png" width="500" height="308" />
      </lockup>                 
            <lockup videoURL="http://www.rwdevcon.com/videos/Alexis-Gallagher-Identity.mp4">
        <img src="${this.BASEURL}images/alexis.png" width="500" height="308" />
            </lockup>                 
      <lockup videoURL="http://www.rwdevcon.com/videos/Marin-Todorov-RW-Folklore.mp4">
        <img src="${this.BASEURL}images/marin.png" width="500" height="308" />
      </lockup>                 
      <lockup videoURL="http://www.rwdevcon.com/videos/Chris-Wagner-Craftsmanship.mp4">
        <img src="${this.BASEURL}images/chris.png" width="500" height="308" />
            </lockup>                 
      <lockup videoURL="http://www.rwdevcon.com/videos/Cesare-Rocchi-Cognition.mp4">
        <img src="${this.BASEURL}images/cesare.png" width="500" height="308" />
      </lockup>                 
      <lockup videoURL="http://www.rwdevcon.com/videos/Ellen-Shapiro-Starting-Over.mp4">
        <img src="${this.BASEURL}images/ellen.png" width="500" height="308" />
      </lockup>                 
      <lockup videoURL="http://www.rwdevcon.com/videos/Jake-Gundersen-Opportunity.mp4">
        <img src="${this.BASEURL}images/jake.png" width="500" height="308" />
      </lockup>                 
      <lockup videoURL="http://www.rwdevcon.com/videos/Kim-Pedersen-Finishing.mp4">
        <img src="${this.BASEURL}images/kim.png" width="500" height="308" />
      </lockup>                 
            <lockup videoURL="http://www.rwdevcon.com/videos/Tammy-Coron-Possible.mp4">
        <img src="${this.BASEURL}images/tammy.png" width="500" height="308" />
      </lockup>                 
      <lockup videoURL="http://www.rwdevcon.com/videos/Saul-Mora-NSBrief.mp4">
        <img src="${this.BASEURL}images/saul.png" width="500" height="308" />
      </lockup>   
    </section>
        </grid>
      </relatedContent>
    </listItemLockup>
        </section>
      </list>
    </catalogTemplate>
  </document>`
}