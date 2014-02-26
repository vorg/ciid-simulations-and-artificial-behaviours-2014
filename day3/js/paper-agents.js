var Point = paper.Point;
Point.prototype.scale = function(t) {
  return new Point(this.x * t, this.y * t);
}

function Agent(position) {
  position = position || new Point(0, 0);
  Agent.list.push(this);

  this.position = position;
  this.prevPosition = position.clone();
  this.force = new Point();

  this.shape = new paper.Path.Circle(new Point(), 10);
  this.shape.position = position;
  this.shape.fillColor = 'black';
  this.rotation = 0;

  this.behaviours = [];

  if (!Agent.updateCalled) {
    Agent.updateCalled = true;
    Agent.update();
  }
}

Agent.prototype.setPath = function(shape) {
  this.shape.remove();
  this.shape = shape;
}

Agent.prototype.update = function(deltaTime, frame) {
  var self = this;
  this.force = this.force.scale(0);
  this.behaviours.forEach(function(behaviour) {
    behaviour.update(self, deltaTime, frame);
  });
  this.prevPosition = this.position.clone();
  this.position = this.position.add(this.force.scale(deltaTime));
  this.shape.position = this.position;
}

Agent.prototype.addBehaviour = function(behaviour) {
  this.behaviours.push(behaviour);
}

Agent.prototype.clone = function() {
  var a = new Agent(this.position.clone());
  a.behaviours = this.behaviours.map(function(b) { return b; });
  a.shape = this.shape.clone();
  a.prevPosition = this.position.clone();
  a.position = this.position.clone();
  return a;
}

Agent.list = [];
Agent.prevTime = Date.now();
Agent.frame = 0;

Agent.update = function() {
  if (!Agent.tool) {
    Agent.mousePos = new Point(paper.view.center.x, -100)
    Agent.tool = new paper.Tool();
    Agent.tool.onMouseMove = function(e) {
      Agent.mousePos = e.point;
    }
  }
  var now = Date.now();
  var deltaTime = (now - Agent.prevTime)/1000;
  Agent.prevTime = now;
  Agent.frame++;
  Agent.list.forEach(function(agent) {
    agent.update(deltaTime, Agent.frame);
  })
  window.requestAnimationFrame(Agent.update);
}

window.Agent = Agent;
window.Behaviour = Behaviour;

function Behaviour() {
  this.update = function() {};
}

Behaviour.Walk = function(direction) {
  direction = direction || new Point(0, -50)
  this.update = function(agent, deltaTime, frame) {
    agent.force = agent.force.add(direction);
  }
}

Behaviour.RandomWalk = function(probabilty, angle) {
  var direction = new Point(0, -50);
  angle = angle || 90;
  probabilty = probabilty || 0.05;

  this.update = function(agent, deltaTime, frame) {
    //if (frame % 30 == 0) {
    if (Math.random() > 1 - probabilty) {
      direction = direction.rotate(angle * Math.floor(Math.random()*3-1))
    }
    agent.force = agent.force.add(direction);
  }
}

Behaviour.SplitWalk = function(direction, time, angle, splits, speedRatio) {
  var splitTime = 0;
  time = time || 2;
  angle = angle || 30;
  var numSplits = (typeof(splits) == 'undefined') ? 5 : splits;
  speedRatio = speedRatio || 1;
  this.update = function(agent, deltaTime, frame) {
    if (numSplits > 0) {
      agent.force = agent.force.add(direction);
      splitTime += deltaTime;
      if (splitTime > time) {
        direction = direction.rotate(angle);
        splitTime = 0;
        numSplits--;
        var copy = agent.clone();
        for(var i=0; i<copy.behaviours.length; i++) {
          if (copy.behaviours[i] == this) {
            var walkClone = new Behaviour.SplitWalk(direction.rotate(-2*angle).scale(speedRatio), time, angle, numSplits)
            copy.behaviours.splice(i, 1, walkClone);
            break;
          }
        }
      }
    }
  }
}

Behaviour.Trace = function(color) {
  color = color || 'black'
  this.update = function(agent, deltaTime, frame) {
    if (!agent.trace) {
      agent.trace = new paper.Path();
      agent.trace.strokeColor = color;
    }
    agent.trace.add(agent.position);
    if (agent.trace.segments.length > 200) {
      agent.trace.removeSegment(0)
    }
  }
}

Behaviour.FollowMouse = function() {
  var ratio = 0.5 + 0.5 * Math.random();
  this.update = function(agent, deltaTime, frame) {
    agent.force = agent.force.add(Agent.mousePos.subtract(agent.position).scale(ratio));
  }
}

Behaviour.Shake = function(radius, speed) {
  speed = speed || 20;
  var time = Math.random() * Math.PI * 2
  this.update = function(agent, deltaTime, frame) {
    time += deltaTime * speed;
    agent.force = agent.force.add(new Point(radius * Math.sin(time), radius * Math.cos(time)));
  }
}

Behaviour.FollowPoint = function(point) {
  var ratio = 0.5 + 0.5 * Math.random();
  this.update = function(agent, deltaTime, frame) {
    agent.force = agent.force.add(point.subtract(agent.position).scale(ratio));
  }
}

Behaviour.Repulse = function(radius) {
  this.update = function(agent, deltaTime, frame) {
    var force = new Point(0, 0);
    var numNeighbours = 0;
    Agent.list.forEach(function(otherAgent) {
      if (agent != otherAgent) {
        var dist = otherAgent.position.subtract(agent.position);
        var len = dist.length;
        if (len < radius) {
          if (len > 0.2) {
            force = force.subtract(dist.scale(radius/len));
            numNeighbours++;
          }
        }
      }
    })
    if (numNeighbours > 0) {
      force = force.scale(1/numNeighbours);
      //agent.force += force.normalize() * radius * deltaTime;
      agent.force = agent.force.add(force);// * deltaTime;
    }
  }
}

Behaviour.RepulseMouse = function(radius) {
  this.update = function(agent, deltaTime, frame) {
    var force = new Point(0, 0);
    var dist = Agent.mousePos.subtract(agent.position);
    var len = dist.length;
    if (len < radius) {
      if (len > 0.2) {
        force = force.subtract(dist.scale(radius/len));
      }
    }
    agent.force  = agent.force.add(force);
  }
}

Behaviour.RepulsePoint = function(point) {
  this.update = function(agent, deltaTime, frame) {
    var force = new Point(0, 0);
    var dist = point.subtract(agent.position);
    var len = dist.length;
    if (len < radius) {
      if (len > 0.2) {
        force = force.subtract(dist.scale(radius/len));
      }
    }
    agent.force  = agent.force.add(force);
  }
}

Behaviour.FollowPath = function(path, loop, snapRadius) {
  loop = loop || false;
  snapRadius = snapRadius || 10;
  var activePointIndex = 0;
  this.update = function(agent, deltaTime, frame) {
    if (activePointIndex > path.segments.length - 1) {
      if (loop) {
        activePointIndex = 0;
      }
      else {
        return;
      }
    }
    var activePoint = path.segments[activePointIndex].point;
    var dist = activePoint.subtract(agent.position);
    //var ratio = 0.5 + 0.5 * Math.random();
    var speed = 100;
    agent.force = agent.force.add(activePoint.subtract(agent.position)).normalize().scale(speed);
    if (dist.length < snapRadius) {
      activePointIndex++;
    }
  }
}

Behaviour.Orient = function() {
  var agentRotation = 0;
  this.update = function(agent, deltaTime, frame) {
    var dir = agent.position.subtract(agent.prevPosition);
    if (dir.length > 0.1) {
      var rotation = Math.atan2(dir.y, dir.x) * 180 / Math.PI + 90;
      agent.shape.rotate(rotation - agentRotation);
      agentRotation = rotation;
    }
  }
}
