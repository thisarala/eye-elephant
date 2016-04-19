/**
 * Created by thisara on 4/19/16.
 */
import React, { PropTypes, Component } from 'react';
import styles from './ElephantPage.css';
import withStyles from '../../decorators/withStyles';
import socketClient from 'socket.io-client';
import { getUser, removeUser } from './../../core/CommonUtils';
var Victor = require('victor');

@withStyles(styles)
class ElephantPage extends Component {

  constructor() {
    super();
    this.state = {
      attempt: 1,
      remainingTime: 15,
      points: 0
    };

    this.timer = null;
    this.interval = null;

    this.gridSize = 23;
    this.drawEye = this.drawEye.bind(this);
    this.startTimer = this.startTimer.bind(this);

    this.handleNextButton= this.handleNextButton.bind(this);
  }


  drawEye(x, y) {


    var rect = new Konva.Circle({
      x: x * this.gridSize + this.gridSize / 2,
      y: y * this.gridSize + this.gridSize / 2,

      radius: this.gridSize / 2,

      fill: '#ff8400',
      stroke: 'black',
      strokeWidth: 1
    });


    return rect;

  }

  handleNextButton(e) {
    e.preventDefault();
    this.savePlayer(getUser(), 100, 10 ,20);
  }

  componentDidMount() {

    this.setupRealtime();

    const scale = 1;
    const width = 1024;
    const height = 768;

    const gridSize = this.gridSize;

    const gridRows = Math.floor(height * scale / gridSize);
    const gridColumns = Math.floor(width * scale / gridSize);
    const eyeX = 8, eyeY = 7;

    /*
     * col: 40
     * row: 30
     * */


    /*
    * random ball logic
    * */

/*
    var dx = 0;
    var dy = 0;
    var delta = 5; // range (from 0) of possible dx or dy change
    var max = 15; // maximum dx or dy values
*/


    /*
    * Random ball logic 2
    * */
    var x = width/2;
    var y = height/2;
    var dx = 15;
    var dy = -15;
    var ballRadius = this.gridSize / 2;



    var directionX =0, directionY = 0;
    var hexagon;

    /*
    * Generation of points map based on distance
    * */
    const pointsMap = [];
    // init map
    for (var x = 0; x <= gridColumns; x++) {
      pointsMap[x] = [];


      for (var y = 0; y <= gridRows; y++) {

        pointsMap[x][y] = 0;


        // points based on distance to thr point
        const dist = Math.sqrt(Math.pow((x - eyeX), 2) + Math.pow((y - eyeY), 2));
        pointsMap[x][y] = Math.ceil(((gridColumns - dist) * 2) / 10) * 10;


        if ((x >= 6 && x <= 10) && (y >= 5 && y <= 9)) {
          pointsMap[x][y] = 80;
        }

        if ((x >= 7 && x <= 9) && (y >= 6 && y <= 8)) {
          pointsMap[x][y] = 90;
        }


      }
    }
    // winning point
    pointsMap[eyeX][eyeY] = 100;


    console.log(gridColumns);
    console.log(gridRows);

    /*
    * Konva Init
    * */
    var stage = new Konva.Stage({
      container: 'container',
      width: width * scale,
      height: height * scale
    });

    var layer = new Konva.Layer();



    var imageObj = new Image();
    imageObj.onload = function () {

      var elephant = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: width,
        height: height
      });

      // add the shape to the layer
      layer.add(elephant);

      // bouncing ball
      hexagon = new Konva.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: ballRadius,
        fill: '#b21605',
        stroke: 'black',
        strokeWidth: 1
      });

      layer.add(hexagon);


      // add the layer to the stage
      //stage.add(ballLayer);

      stage.add(layer);





      var anim = new Konva.Animation(function(frame) {

        var vec1 = new Victor(dx, dy);
        var dir = new Victor(directionX, directionY);
        directionX = 0; directionY = 0;
        var angle = dir.horizontalAngle();
        vec1 = vec1.rotate(angle);

        dx = vec1.x;
        dy = vec1.y;



        if(x + dx > width-ballRadius || x + dx < ballRadius) {
          dx = -dx;
        }
        if(y + dy > height-ballRadius || y + dy < ballRadius) {
          dy = -dy;
        }

        x += dx;
        y += dy;


        hexagon.setX(x);
        hexagon.setY(y);
    }, layer);

      anim.start();
    };
    imageObj.src = '/Screen-2-Elephant-v4.png';















    /*
    * Stage click listener
    * */
    stage.on('contentClick', () => {
      if (this.state.attempt <= 3) {
      //if (true) {
        clearInterval(this.interval);
        clearTimeout(this.timer);


        const xCord = Math.floor(hexagon.getX() / gridSize);
        const yCord = Math.floor(hexagon.getY() / gridSize);



        directionX= -1;
        directionY= 1;

        const prevAttempt = this.state.attempt;


        layer.add(this.drawEye(xCord, yCord));
        layer.draw();
        this.setState({points: this.state.points + pointsMap[xCord][yCord]})

        this.setState({attempt: this.state.attempt + 1});


        if ((prevAttempt + 1) <= 3) {
          this.startTimer();
        }
        else {
          // do not start timer
          setTimeout(() => {
            alert('game over');

          }, 1000);
        }


      }
      else {
        alert('game over')
      }
    });


    // start timer
    this.startTimer();
  }

  startTimer() {
    this.setState({remainingTime: 15});

    this.interval = setInterval(() => {
      this.setState({remainingTime: this.state.remainingTime - 1})
    }, 1000);

    this.timer = setTimeout(() => {
      const prevAttempt = this.state.attempt;

      clearInterval(this.interval);
      this.setState({attempt: this.state.attempt + 1})

      if ((prevAttempt + 1) > 3) {
        // game over
        alert('game over');
      }
      else {
        this.startTimer();

      }
      this.setState({remainingTime: 15});
    }, 15000)
  }

  render() {
    return (
      <div>
        <div id="container" className="canvas">

        </div>

        <div className="timer">
          <div><span className="attempts">{(this.state.attempt <= 3) ? this.state.attempt : 3}</span>&nbsp;&nbsp;
            Attempts
          </div>
          <div><span className="time">{this.state.remainingTime}</span>&nbsp;&nbsp;Sec</div>
          {
            /*
             <h3>{this.state.points + ' points'}</h3>
             */
          }
        </div>

        <div className="points-box">
          <div>Points</div>
          <div className="points">
            {this.state.points}
          </div>
        </div>
      </div>



    );
  }

  setupRealtime() {
    const io = socketClient();
    io.on('coordinate-change', (change) => {
      console.log('new_val - ', JSON.stringify(change.new_val));
    });
    return io;
  }

  savePlayer(username, points, x, y) {
    $.ajax({
      method: 'POST',
      url: '/leaderboard/add',
      data: {
        username: username,
        points: points,
        x: x,
        y: y }
      ,
      success: (data) => {
        removeUser();
        window.location.href = '/';
        console.log("savePlayer success");
      },
      error: (xhr, status, err) => {
        console.error('', status, err.toString());
      }
    });
  }
}

export default ElephantPage;
