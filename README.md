## Plex For TVOS
====

This is a POC that I hacked together for my Dev Kit. It uses a modified version of the PlexAPI from phillipj/node-plex-api, along with the Swifter Pod.

What works:
- Basic Media section population
- Display of On Deck, Recently Added, Recently Aired, Recently Watched media
- Playback/Resume

Caveats:
- Requires media on PMS to be in format directly playable on ATV4 (Direct Play), as Transcoding functionality has not been built into Plex for TVOS
- Support for a single PMS
- PMS address is hardcoded in AppDelegate.swift