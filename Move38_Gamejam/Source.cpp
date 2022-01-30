#define SIGNAL_START 4
#define SIGNAL_RESET 5

void setup() {
  randomize();
}

enum GAME_STATES {notHappening, starting, happening, reset};
byte gameState = notHappening;
byte health;
Timer timer;
bool flag = false;
byte max_adj = 0;
byte attack = 6;
byte probability = 0;

void loop() {
    // put your main code here, to run repeatedly:
  switch (gameState) {
    case notHappening:
      notHappeningLoop();
      break;
    case starting:
      startingLoop();
      break;
    case happening:
      happeningLoop();
      break;
    case reset:
      resetLoop();
      break;
  }
}

void notHappeningLoop() {
  health = 99;
  setColor(WHITE);

  FOREACH_FACE(f) {
    if (!flag && getLastValueReceivedOnFace(f) > 0 && !isValueReceivedOnFaceExpired(f)) {
      gameState = starting;
      timer.set(500);
    }
  }

  if (buttonDoubleClicked()) {
    flag = true;
    for (byte o = 0; o < 6; o += 2) {
      setColorOnFace(RED, o);
    }
    health = 1;
    gameState = happening;
    probability = 1;
    setValueSentOnAllFaces(SIGNAL_START);
  }
}

void startingLoop() {
  setColor(BLUE);
  if (timer.isExpired()) {
    health = max_adj;
     setValueSentOnAllFaces(max_adj);
    gameState = happening;
  }
  else {
    FOREACH_FACE(f) {
      if (getLastValueReceivedOnFace(f) > max_adj && !isValueReceivedOnFaceExpired(f)) {
        max_adj = (max_adj < 1) ? 1 : getLastValueReceivedOnFace(f)-1;
      }
    }
  }
}

void happeningLoop() {
  if (!flag) {
    switch (health) {
      case 0: 
        setColor(OFF); 
        break;
      case 1: 
        setColor(OFF);
        for (byte i = 0; i < 2; i++) {
        	setColorOnFace(ORANGE, i); 
        }
        probability = 4;
        break;
      case 2: 
        setColor(OFF);
        for (byte i = 0; i < 4; i++) {
        	setColorOnFace(YELLOW, i); 
        }
        probability = 3;
        break;
      case 3: 
        setColor(GREEN);
        probability = 2;
        break;
      default: setColor(WHITE);
    }
  }

  if (buttonMultiClicked()) {
    if (buttonClickCount() == 5) {
      setValueSentOnAllFaces(SIGNAL_RESET);
      gameState = reset;
      timer.set(1500);
    }
  }
  
  if (flag && health == 0) {
    setValueSentOnAllFaces(SIGNAL_RESET);
    gameState = reset;
    timer.set(1500);
  }
  FOREACH_FACE(f) {
    if (getLastValueReceivedOnFace(f) == SIGNAL_RESET) {
      setValueSentOnAllFaces(SIGNAL_RESET);
      gameState = reset;
      timer.set(1500);
    }
    else if (getLastValueReceivedOnFace(f) > 5 && health > 0 && didValueOnFaceChange(f)) {
      byte rng = random(20);
      if (rng < probability) {
      	health--;
      }
    }
  }
  
  if (buttonSingleClicked() && health > 0) {
     health--;
     attack = (attack == 6) ? 7 : 6;
     setValueSentOnAllFaces(attack);
  }
}

void resetLoop() {
  buttonSingleClicked();
  buttonDoubleClicked();
  buttonMultiClicked();
  setColor(MAGENTA);
  if (timer.isExpired()) {
    gameState = notHappening;
  }
  else if (timer.getRemaining() < 750) {
    setValueSentOnAllFaces(0);
    max_adj = 0;
    probability = 0;
    flag = false;
  }
}
