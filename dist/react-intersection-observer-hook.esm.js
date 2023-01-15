import { useRef, useState, useCallback, useEffect } from 'react';

var DEFAULT_ROOT_MARGIN = '0px';
var DEFAULT_THRESHOLD = [0]; // For more info:
// https://developers.google.com/web/updates/2016/04/intersectionobserver
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

function useIntersectionObserver(args) {
  var _args$rootMargin, _args$threshold;

  var rootMargin = (_args$rootMargin = args == null ? void 0 : args.rootMargin) != null ? _args$rootMargin : DEFAULT_ROOT_MARGIN;
  var threshold = (_args$threshold = args == null ? void 0 : args.threshold) != null ? _args$threshold : DEFAULT_THRESHOLD;
  var nodeRef = useRef(null);
  var rootRef = useRef(null);
  var observerRef = useRef(null);

  var _useState = useState(),
      entry = _useState[0],
      setEntry = _useState[1];

  var unobserve = useCallback(function () {
    // Disconnect the current observer (if there is one)
    var currentObserver = observerRef.current;
    currentObserver == null ? void 0 : currentObserver.disconnect();
    observerRef.current = null;
  }, []);
  var observe = useCallback(function () {
    try {
      var node = nodeRef.current;

      if (node) {
        var root = rootRef.current;
        var options = {
          root: root,
          rootMargin: rootMargin,
          threshold: threshold
        }; // Create a observer for current "node" with given options.

        var observer = new IntersectionObserver(function (_ref) {
          var newEntry = _ref[0];
          setEntry(newEntry);
        }, options);
        observer.observe(node);
        observerRef.current = observer;
      }
    } catch (exception) {
      console.log(exception);
    }
  }, [rootMargin, threshold]);
  var initializeObserver = useCallback(function () {
    unobserve();
    observe();
  }, [observe, unobserve]);
  var refCallback = useCallback(function (node) {
    nodeRef.current = node;
    initializeObserver();
  }, [initializeObserver]);
  var rootRefCallback = useCallback(function (rootNode) {
    rootRef.current = rootNode;
    initializeObserver();
  }, [initializeObserver]);
  useEffect(function () {
    // After React 18, StrictMode unmounts and mounts components to be sure
    // if they are resilient effects being mounted and destroyed multiple times.
    // This a behavior to be sure nothing breaks when off-screen components
    // can preserve their state with future React versions.
    // So in StrictMode, React unmounts the component, clean-up of this useEffect gets triggered and
    // we stop observing the node. But we need to start observing after component re-mounts with its preserved state.
    // So to handle this case, we call initializeObserver here.
    // https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-strict-mode
    initializeObserver();
    return function () {
      // We disconnect the observer on unmount to prevent memory leaks etc.
      unobserve();
    };
  }, [initializeObserver, unobserve]);
  return [refCallback, {
    entry: entry,
    rootRef: rootRefCallback
  }];
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function useTrackVisibility(args) {
  var _result$entry;

  var _useIntersectionObser = useIntersectionObserver(args),
      ref = _useIntersectionObser[0],
      result = _useIntersectionObser[1];

  var isVisible = Boolean((_result$entry = result.entry) == null ? void 0 : _result$entry.isIntersecting);

  var _useState = useState(isVisible),
      wasEverVisible = _useState[0],
      setWasEverVisible = _useState[1];

  if (isVisible && !wasEverVisible) {
    setWasEverVisible(true);
  }

  return [ref, _extends({}, result, {
    isVisible: isVisible,
    wasEverVisible: wasEverVisible
  })];
}

export { useIntersectionObserver, useTrackVisibility };
//# sourceMappingURL=react-intersection-observer-hook.esm.js.map
