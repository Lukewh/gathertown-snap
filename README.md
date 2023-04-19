<h1 align="center">
  <img src="gather-logo.svg" alt="Gather Town - Linux" width="256" />
  <br />
  Gather Town - Linux
</h1>

<p align="center"><b>An electron wrapper for Gather Town, for linux.</b></p>
<div align="center">
  <img src="https://dashboard.snapcraft.io/site_media/appmedia/2022/05/gathertown-screenshot.png" alt="Gather Town screenshot" />
</div>

<div align="center">
  <a href="https://snapcraft.io/gathertown"><img src="https://snapcraft.io/gathertown/badge.svg" alt="gathertown" /></a>
  <a href="https://snapcraft.io/gathertown"><img src="https://snapcraft.io/gathertown/trending.svg?name=0" alt="gathertown" /></a>
</div>

## Introduction

There is no official version of Gather Town for linux ([download page](https://www.gather.town/download)), and I like to keep Gather open at all times, not hiding in a browser tab. I use this snap daily and try to stay on top of issues I come across. It's not perfect, and the biggest "hack" is screensharing, I'd like to improve the code around that in the future.

This version of the app gives access to developer tools so you can still work with 3rd-party plugins and mods. 

## Installation

From the [Canonical Snap Store](https://snapcraft.io/gathertown):

```
sudo snap install gathertown
```

Side-load from [Github releases](https://github.com/Lukewh/gathertown-snap/releases):

```
sudo snap install --dangerous gathertown_x.x.x_amd64.snap
```

To enable your microphone and camera do the following:
```
snap connect gathertown:audio-record
snap connect gathertown:camera
```
