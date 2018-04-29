import { Container } from 'container';

function ContainersAssert(env) {
  this.env = env;
}

const { ContainerTracking } = Container;

ContainersAssert.prototype = {
  reset: function() {},
  inject: function() {},
  assert: function() {
    if (ContainerTracking === undefined) return;
    let { config } = QUnit;
    let { testName, testId, module: { name: moduleName }, finish: originalFinish } = config.current;
    config.current.finish = function() {
      originalFinish.call(this);
      originalFinish = undefined;
      config.queue.unshift(function() {
        if (ContainerTracking.hasContainers()) {
          ContainerTracking.reset();
          /* eslint-disable no-console */
          console.assert(
            false,
            `Leaked container after test ${moduleName}: ${testName} testId=${testId}`
          );
          /* eslint-enable no-console */
        }
      });
    };
  },
  restore: function() {},
};

export default ContainersAssert;
