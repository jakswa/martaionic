# deprecated - look at jakswa/marta_ui

# martaionic [![Gitter](https://badges.gitter.im/jakswa/martaionic.svg)](https://gitter.im/jakswa/martaionic?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is where the common UI lives for http://marta.io and its sister mobile apps (on [android](https://play.google.com/store/apps/details?id=com.ionicframework.martaionic451202) and [iOS](https://itunes.apple.com/us/app/marta.io/id1082012161)).

## Features
marta.io displays realtime MARTA API results for trains, updated every 10s. It breaks this data down into three views:

1. Dashboard

  The main view, a list of stations shows when you first launch the app. If location access is granted, the three closest stations stick to the top. Dragging left on a station lets you star it, which will put it at the very top of your list for quick access.

  ![img](http://i.imgur.com/cILuvvp.gif)

2. Station View

  Tap a station on the dashboard and you can see its upcoming trains, with schedule data mixed in if no realtime data is present for a given direction.

3. Train View

  After drilling down to station view, a second tap on a train takes you to that train's estimates. This is useful if you want to know when your train is estimated to arrive at a future station.

## Developing
I'm so new to ionic that I don't know the official instructions for
cloning and running this locally, but I bet it's close to something like:

1. Clone the repo, `cd` into it
2. run `npm install`
3. run `npm install -g ionic cordova`
3. run `ionic serve` and follow directions (might need to install a couple more things, I forget)
