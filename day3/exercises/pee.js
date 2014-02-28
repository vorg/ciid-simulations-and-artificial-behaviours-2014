var URINAL_LENGTH = Math.floor(Math.random()*3)+5;
/*function Agent(){
  return {};
}

function Path(){
  return {};
}*/


var queue = [],
    urinals = [];

function Person(){
 return {
    peeTime: Math.floor(Math.random() * 40)+5,       //seconds
    awkwardProba: 35, //percent
    maxWait: 60,      //seconds
    tested: false,
    state: 0,          //0: waiting, 1: peeing
    agent: new Agent(new Point(0,0), 10),
    target: new Point(0,0),
    moveForward: function(){
      if(this.state!==1){
        Timeline.anim(this.target).to({x: this.target.x , y: this.target.y-(Math.random()*5+3) }, 1);
      }
    },
    initAgent: function(i){ 
      this.target = new Point(390, 180+i*30);
      this.agent.position = this.target;
      this.agent.shape.strokeColor = "red";
      this.agent.addBehaviour(new Behaviour.FollowPoint(this.target));
      this.agent.addBehaviour(new Behaviour.Repulse(50));
      //this.agent.addBehaviour(new Behaviour.Trace("#DEDEDE"));
      this.agent.addBehaviour(new Behaviour.Shake(10, 40));
    },
    startPeeing: function(){
      this.state = 1;
    },
    shouldPee: function(){
      return (Math.random()*100 < this.awkwardProba);
    },
    animatePee: function(urinalIndex){
      var urinal = urinals[urinalIndex];

      Timeline.anim(this.target)
        .to({x: urinal.shape.position.x, y: urinal.shape.position.y}, 2.1)
        .to(this.peeTime, {x: 1000, y: 300}, 3)
        .onEnd(function(){
          urinal.free();
          this.state = 0;
          this.tested = false;
        });
    },
    destroy: function(){
      this.agent.remove();
      var i = persons.indexOf(this);
      if(i>-1){
        queues.splice(i, 1);
      }
    }
  };
}

function Urinal(){
  return {
    state: 0,       //0: free, 1: occupied
    shape: new Path.Rectangle(new Point(0,0), new Size(30, 30)),
    initShape: function(i){
      this.shape.position = new Point(i*50+300, 100); 
      this.shape.fillColor = "black";
      this.shape.opacity = 0.1;
    },
    occupy: function(){
      this.state = 1;
    },
    free: function(){
      this.state = 0;
    }
  };
}

function populateQueue(){
  var queue = [];
  for(var i=0; i<15; i+=1){
    queue.push(Person());
    queue[i].initAgent(i);
  }
  return queue;
}

function populateUrinals(){
  var urinals = [];
  for(var i=0; i<URINAL_LENGTH; i+=1){
    urinals.push(Urinal());
    urinals[i].initShape(i);
  }
  return urinals;
}

urinals = populateUrinals();
queue = populateQueue();


function onFrame(){
  Timeline.update();

  if(queue.length>0){
    var peerIndex = nextPeerIndex(queue),
        person = queue[peerIndex],
        freeUrinalIndex = getFreeUrinal(urinals),
        awkwardUrinalIndex = getAwkwardUrinal(urinals),
        urinal = null,
        urinalIndex;

    if(!person){
      queue = populateQueue();
      return;
    }

    if(typeof freeUrinalIndex === "number") {
      urinalIndex = freeUrinalIndex;
    } else if ((typeof awkwardUrinalIndex === "number") && person.shouldPee() && !person.tested){
      urinalIndex = awkwardUrinalIndex;
      person.agent.shape.fillColor = "red";
    }
    person.tested = true;

    urinal = urinals[urinalIndex];

    if(!!urinal){
      urinal.occupy();
      person.startPeeing();
      person.animatePee(urinalIndex);
    }
  }
}

function nextPeerIndex(queue){
  for(i=0; i<queue.length; i+=1){
    if(queue[i].state === 0){
      return i;
    }
  }
  return -1;
}

function getFreeUrinal(urinals){
  for(i=0; i<urinals.length; i+=1){
    if(i===0 && urinals[i].state === 0 && urinals[i+1].state === 0){
      return i;
    }
    if(i===(urinals.length-1) && urinals[i].state === 0 && urinals[i-1].state === 0){
      return i;
    }
    if((i>0) && urinals[i].state === 0 && urinals[i-1].state === 0 && urinals[i+1].state === 0){
      return i;
    }
  }
  return false;
}

function getAwkwardUrinal(urinals){
  for(i=0; i<urinals.length; i+=1){
    if(urinals[i].state === 0){
      return i;
    }
  }
  return false;
}

/* window.setInterval(function(){
  for(i=0; i<queue.length; i+=1){
    queue[i].moveForward();
  }
 }, 1000);*/

function onMouseDown(){
  urinals.push(Urinal());
  urinals[urinals.length-1].initShape(urinals.length-1);
}
