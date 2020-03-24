import store from '..'

export function onRobots(robots) {
  window.dispatch({ type: 'chat/onRobotsExt', robots });
}
