# A simple analog clock in canvas
<p align="center">
  <img src="./assets/image.PNG" alt="clock" width="200"/>
</p>

This small project consists of an analog clock, rendered in canvas, with two modes:
* A regular mode that shows the current time with three hands: hours, minutes and seconds
* A stopwatch mode with three hands: minutes, seconds and deciseconds. Notice that this means that the stopwatch is limited to 60 minutes laps. It's a stopwatch for a 100 meters race not for marathons :P

The clock has 3 buttons. The top one is used to start/pause the stopwatch while in that mode, the bottom one is used to reset the stopwatch while in that mode and the middle one is used to change between the regular and stopwatch modes

You can see it live [here](https://ibesora.github.io/canvas-clock/)

## Running locally
1. Clone the repo
2. Run `npm install`
3. Run `npm run start`
4. Open a browser pointing at `http://localhost:8080`

### Building
After cloning the repo, run `npm run build`. All the needed static files will be built and ready to deploy at the `dist` folder

### Running tests
Just run `npm run test` to run unit tests