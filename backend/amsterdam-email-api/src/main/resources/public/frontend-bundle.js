/******/ var __webpack_modules__ = ({

/***/ "../../../node_modules/rxjs/dist/esm5/internal/NotificationFactories.js":
/*!******************************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/NotificationFactories.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COMPLETE_NOTIFICATION: () => (/* binding */ COMPLETE_NOTIFICATION),
/* harmony export */   createNotification: () => (/* binding */ createNotification),
/* harmony export */   errorNotification: () => (/* binding */ errorNotification),
/* harmony export */   nextNotification: () => (/* binding */ nextNotification)
/* harmony export */ });
var COMPLETE_NOTIFICATION = (function () { return createNotification('C', undefined, undefined); })();
function errorNotification(error) {
    return createNotification('E', undefined, error);
}
function nextNotification(value) {
    return createNotification('N', value, undefined);
}
function createNotification(kind, value, error) {
    return {
        kind: kind,
        value: value,
        error: error,
    };
}
//# sourceMappingURL=NotificationFactories.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/Subscriber.js":
/*!*******************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/Subscriber.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_OBSERVER: () => (/* binding */ EMPTY_OBSERVER),
/* harmony export */   SafeSubscriber: () => (/* binding */ SafeSubscriber),
/* harmony export */   Subscriber: () => (/* binding */ Subscriber)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/isFunction */ "../../../node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscription */ "../../../node_modules/rxjs/dist/esm5/internal/Subscription.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config */ "../../../node_modules/rxjs/dist/esm5/internal/config.js");
/* harmony import */ var _util_reportUnhandledError__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util/reportUnhandledError */ "../../../node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js");
/* harmony import */ var _util_noop__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./util/noop */ "../../../node_modules/rxjs/dist/esm5/internal/util/noop.js");
/* harmony import */ var _NotificationFactories__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NotificationFactories */ "../../../node_modules/rxjs/dist/esm5/internal/NotificationFactories.js");
/* harmony import */ var _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scheduler/timeoutProvider */ "../../../node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js");
/* harmony import */ var _util_errorContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/errorContext */ "../../../node_modules/rxjs/dist/esm5/internal/util/errorContext.js");









var Subscriber = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if ((0,_Subscription__WEBPACK_IMPORTED_MODULE_1__.isSubscription)(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) {
            handleStoppedNotification((0,_NotificationFactories__WEBPACK_IMPORTED_MODULE_2__.nextNotification)(value), this);
        }
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) {
            handleStoppedNotification((0,_NotificationFactories__WEBPACK_IMPORTED_MODULE_2__.errorNotification)(err), this);
        }
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) {
            handleStoppedNotification(_NotificationFactories__WEBPACK_IMPORTED_MODULE_2__.COMPLETE_NOTIFICATION, this);
        }
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(_Subscription__WEBPACK_IMPORTED_MODULE_1__.Subscription));

var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
}
var ConsumerObserver = (function () {
    function ConsumerObserver(partialObserver) {
        this.partialObserver = partialObserver;
    }
    ConsumerObserver.prototype.next = function (value) {
        var partialObserver = this.partialObserver;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    ConsumerObserver.prototype.error = function (err) {
        var partialObserver = this.partialObserver;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    };
    ConsumerObserver.prototype.complete = function () {
        var partialObserver = this.partialObserver;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    return ConsumerObserver;
}());
var SafeSubscriber = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var partialObserver;
        if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_3__.isFunction)(observerOrNext) || !observerOrNext) {
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            var context_1;
            if (_this && _config__WEBPACK_IMPORTED_MODULE_4__.config.useDeprecatedNextContext) {
                context_1 = Object.create(observerOrNext);
                context_1.unsubscribe = function () { return _this.unsubscribe(); };
                partialObserver = {
                    next: observerOrNext.next && bind(observerOrNext.next, context_1),
                    error: observerOrNext.error && bind(observerOrNext.error, context_1),
                    complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
                };
            }
            else {
                partialObserver = observerOrNext;
            }
        }
        _this.destination = new ConsumerObserver(partialObserver);
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));

function handleUnhandledError(error) {
    if (_config__WEBPACK_IMPORTED_MODULE_4__.config.useDeprecatedSynchronousErrorHandling) {
        (0,_util_errorContext__WEBPACK_IMPORTED_MODULE_5__.captureError)(error);
    }
    else {
        (0,_util_reportUnhandledError__WEBPACK_IMPORTED_MODULE_6__.reportUnhandledError)(error);
    }
}
function defaultErrorHandler(err) {
    throw err;
}
function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = _config__WEBPACK_IMPORTED_MODULE_4__.config.onStoppedNotification;
    onStoppedNotification && _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_7__.timeoutProvider.setTimeout(function () { return onStoppedNotification(notification, subscriber); });
}
var EMPTY_OBSERVER = {
    closed: true,
    next: _util_noop__WEBPACK_IMPORTED_MODULE_8__.noop,
    error: defaultErrorHandler,
    complete: _util_noop__WEBPACK_IMPORTED_MODULE_8__.noop,
};
//# sourceMappingURL=Subscriber.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/Subscription.js":
/*!*********************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/Subscription.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_SUBSCRIPTION: () => (/* binding */ EMPTY_SUBSCRIPTION),
/* harmony export */   Subscription: () => (/* binding */ Subscription),
/* harmony export */   isSubscription: () => (/* binding */ isSubscription)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isFunction */ "../../../node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/UnsubscriptionError */ "../../../node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js");
/* harmony import */ var _util_arrRemove__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/arrRemove */ "../../../node_modules/rxjs/dist/esm5/internal/util/arrRemove.js");




var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._finalizers = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__values)(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialFinalizer = this.initialTeardown;
            if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(initialFinalizer)) {
                try {
                    initialFinalizer();
                }
                catch (e) {
                    errors = e instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError ? e.errors : [e];
                }
            }
            var _finalizers = this._finalizers;
            if (_finalizers) {
                this._finalizers = null;
                try {
                    for (var _finalizers_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__values)(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                        var finalizer = _finalizers_1_1.value;
                        try {
                            execFinalizer(finalizer);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError) {
                                errors = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(errors)), (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execFinalizer(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            (0,_util_arrRemove__WEBPACK_IMPORTED_MODULE_3__.arrRemove)(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _finalizers = this._finalizers;
        _finalizers && (0,_util_arrRemove__WEBPACK_IMPORTED_MODULE_3__.arrRemove)(_finalizers, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());

var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.remove) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.add) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.unsubscribe)));
}
function execFinalizer(finalizer) {
    if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(finalizer)) {
        finalizer();
    }
    else {
        finalizer.unsubscribe();
    }
}
//# sourceMappingURL=Subscription.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/config.js":
/*!***************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/config.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config)
/* harmony export */ });
var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};
//# sourceMappingURL=config.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js":
/*!*************************************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OperatorSubscriber: () => (/* binding */ OperatorSubscriber),
/* harmony export */   createOperatorSubscriber: () => (/* binding */ createOperatorSubscriber)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../../../node_modules/rxjs/dist/esm5/internal/Subscriber.js");


function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(OperatorSubscriber, _super);
    function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
        var _this = _super.call(this, destination) || this;
        _this.onFinalize = onFinalize;
        _this.shouldUnsubscribe = shouldUnsubscribe;
        _this._next = onNext
            ? function (value) {
                try {
                    onNext(value);
                }
                catch (err) {
                    destination.error(err);
                }
            }
            : _super.prototype._next;
        _this._error = onError
            ? function (err) {
                try {
                    onError(err);
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._error;
        _this._complete = onComplete
            ? function () {
                try {
                    onComplete();
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._complete;
        return _this;
    }
    OperatorSubscriber.prototype.unsubscribe = function () {
        var _a;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            var closed_1 = this.closed;
            _super.prototype.unsubscribe.call(this);
            !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
        }
    };
    return OperatorSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__.Subscriber));

//# sourceMappingURL=OperatorSubscriber.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/operators/map.js":
/*!**********************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/operators/map.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   map: () => (/* binding */ map)
/* harmony export */ });
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "../../../node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OperatorSubscriber */ "../../../node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");


function map(project, thisArg) {
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        var index = 0;
        source.subscribe((0,_OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.createOperatorSubscriber)(subscriber, function (value) {
            subscriber.next(project.call(thisArg, value, index++));
        }));
    });
}
//# sourceMappingURL=map.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js":
/*!**********************************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   timeoutProvider: () => (/* binding */ timeoutProvider)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);

var timeoutProvider = {
    setTimeout: function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delegate = timeoutProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
            return delegate.setTimeout.apply(delegate, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([handler, timeout], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(args)));
        }
        return setTimeout.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([handler, timeout], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(args)));
    },
    clearTimeout: function (handle) {
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};
//# sourceMappingURL=timeoutProvider.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js":
/*!*********************************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UnsubscriptionError: () => (/* binding */ UnsubscriptionError)
/* harmony export */ });
/* harmony import */ var _createErrorClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createErrorClass */ "../../../node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js");

var UnsubscriptionError = (0,_createErrorClass__WEBPACK_IMPORTED_MODULE_0__.createErrorClass)(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/util/arrRemove.js":
/*!***********************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/util/arrRemove.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrRemove: () => (/* binding */ arrRemove)
/* harmony export */ });
function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}
//# sourceMappingURL=arrRemove.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js":
/*!******************************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createErrorClass: () => (/* binding */ createErrorClass)
/* harmony export */ });
function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}
//# sourceMappingURL=createErrorClass.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/util/errorContext.js":
/*!**************************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/util/errorContext.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureError: () => (/* binding */ captureError),
/* harmony export */   errorContext: () => (/* binding */ errorContext)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "../../../node_modules/rxjs/dist/esm5/internal/config.js");

var context = null;
function errorContext(cb) {
    if (_config__WEBPACK_IMPORTED_MODULE_0__.config.useDeprecatedSynchronousErrorHandling) {
        var isRoot = !context;
        if (isRoot) {
            context = { errorThrown: false, error: null };
        }
        cb();
        if (isRoot) {
            var _a = context, errorThrown = _a.errorThrown, error = _a.error;
            context = null;
            if (errorThrown) {
                throw error;
            }
        }
    }
    else {
        cb();
    }
}
function captureError(err) {
    if (_config__WEBPACK_IMPORTED_MODULE_0__.config.useDeprecatedSynchronousErrorHandling && context) {
        context.errorThrown = true;
        context.error = err;
    }
}
//# sourceMappingURL=errorContext.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/util/isFunction.js":
/*!************************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/util/isFunction.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isFunction: () => (/* binding */ isFunction)
/* harmony export */ });
function isFunction(value) {
    return typeof value === 'function';
}
//# sourceMappingURL=isFunction.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/util/lift.js":
/*!******************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/util/lift.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasLift: () => (/* binding */ hasLift),
/* harmony export */   operate: () => (/* binding */ operate)
/* harmony export */ });
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction */ "../../../node_modules/rxjs/dist/esm5/internal/util/isFunction.js");

function hasLift(source) {
    return (0,_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
    return function (source) {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}
//# sourceMappingURL=lift.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/util/noop.js":
/*!******************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/util/noop.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   noop: () => (/* binding */ noop)
/* harmony export */ });
function noop() { }
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "../../../node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js":
/*!**********************************************************************************!*\
  !*** ../../../node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reportUnhandledError: () => (/* binding */ reportUnhandledError)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "../../../node_modules/rxjs/dist/esm5/internal/config.js");
/* harmony import */ var _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/timeoutProvider */ "../../../node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js");


function reportUnhandledError(err) {
    _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_0__.timeoutProvider.setTimeout(function () {
        var onUnhandledError = _config__WEBPACK_IMPORTED_MODULE_1__.config.onUnhandledError;
        if (onUnhandledError) {
            onUnhandledError(err);
        }
        else {
            throw err;
        }
    });
}
//# sourceMappingURL=reportUnhandledError.js.map

/***/ }),

/***/ "./src/lib/amsterdam-emailapi-plugin-module.ts":
/*!*****************************************************!*\
  !*** ./src/lib/amsterdam-emailapi-plugin-module.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AmsterdamEmailapiPluginModule: () => (/* binding */ AmsterdamEmailapiPluginModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_amsterdam_emailapi_configuration_amsterdam_emailapi_configuration_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component */ "./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "@angular/common");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_angular_common__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _valtimo_plugin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @valtimo/plugin */ "@valtimo/plugin");
/* harmony import */ var _valtimo_plugin__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_valtimo_plugin__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "../../../node_modules/@angular/forms/fesm2022/forms.mjs");
/* harmony import */ var _valtimo_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @valtimo/components */ "@valtimo/components");
/* harmony import */ var _valtimo_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_valtimo_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_send_email_send_email_configuration_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/send-email/send-email-configuration.component */ "./src/lib/components/send-email/send-email-configuration.component.ts");
/* harmony import */ var _amsterdam_emailapi_plugin_specification__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./amsterdam-emailapi-plugin.specification */ "./src/lib/amsterdam-emailapi-plugin.specification.ts");
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */









let AmsterdamEmailapiPluginModule = class AmsterdamEmailapiPluginModule {
};
AmsterdamEmailapiPluginModule = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgModule)({
        declarations: [
            _components_amsterdam_emailapi_configuration_amsterdam_emailapi_configuration_component__WEBPACK_IMPORTED_MODULE_2__.AmsterdamEmailapiConfigurationComponent,
            _components_send_email_send_email_configuration_component__WEBPACK_IMPORTED_MODULE_6__.SendEmailConfigurationComponent
        ],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _valtimo_plugin__WEBPACK_IMPORTED_MODULE_4__.PluginTranslatePipeModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_5__.FormModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_5__.InputModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormsModule, _valtimo_plugin__WEBPACK_IMPORTED_MODULE_4__.PluginTranslatePipeModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_5__.FormModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_5__.FormModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_5__.FormModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_5__.FormModule],
        exports: [
            _components_amsterdam_emailapi_configuration_amsterdam_emailapi_configuration_component__WEBPACK_IMPORTED_MODULE_2__.AmsterdamEmailapiConfigurationComponent,
            _components_send_email_send_email_configuration_component__WEBPACK_IMPORTED_MODULE_6__.SendEmailConfigurationComponent
        ],
        providers: [
            {
                provide: _valtimo_plugin__WEBPACK_IMPORTED_MODULE_4__.PLUGINS_TOKEN,
                useValue: [
                    _amsterdam_emailapi_plugin_specification__WEBPACK_IMPORTED_MODULE_7__.amsterdamEmailapiPluginSpecification,
                ]
            }
        ]
    })
], AmsterdamEmailapiPluginModule);



/***/ }),

/***/ "./src/lib/amsterdam-emailapi-plugin.specification.ts":
/*!************************************************************!*\
  !*** ./src/lib/amsterdam-emailapi-plugin.specification.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   amsterdamEmailapiPluginSpecification: () => (/* binding */ amsterdamEmailapiPluginSpecification)
/* harmony export */ });
/* harmony import */ var _components_amsterdam_emailapi_configuration_amsterdam_emailapi_configuration_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component */ "./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.ts");
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets */ "./src/lib/assets/index.ts");
/* harmony import */ var _components_send_email_send_email_configuration_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/send-email/send-email-configuration.component */ "./src/lib/components/send-email/send-email-configuration.component.ts");
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */



const amsterdamEmailapiPluginSpecification = {
    pluginId: 'amsterdamemailapi',
    pluginConfigurationComponent: _components_amsterdam_emailapi_configuration_amsterdam_emailapi_configuration_component__WEBPACK_IMPORTED_MODULE_0__.AmsterdamEmailapiConfigurationComponent,
    pluginLogoBase64: _assets__WEBPACK_IMPORTED_MODULE_1__.AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'zend-email': _components_send_email_send_email_configuration_component__WEBPACK_IMPORTED_MODULE_2__.SendEmailConfigurationComponent
    },
    pluginTranslations: {
        nl: {
            title: 'Amsterdam Email API',
            description: 'Met de Amsterdam Email API plugin kun je in een process emails versturen',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip: 'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
            clientId: 'Client ID',
            clientIdTooltip: 'Vul hier het clientId in dat geconfigureerd staat in de autorisatie server waar de Email API naar kijkt. Gewoonlijk is dat Keycloak . Dit clientId moet de juiste autorisatie hebben voor de benodigde functionaliteit',
            clientSecret: 'Secret',
            clientSecretTooltip: 'Vul de secret in die hoort bij de clientId hierboven',
            emailApiBaseUrl: 'Email API base URL',
            emailApiBaseUrlTooltip: 'Vul hier de base url in van de Email API inclusief pad eindigend op ../mail',
            tokenEndpoint: 'Token endpoint',
            tokenEndpointTooltip: 'Vul hier het openid token endpoint om het token op te vragen',
            toEmail: "Email verzend adres",
            toName: "Naam van ontvanger",
            fromAddress: "Afzender",
            emailSubject: "Onderwerp",
            contentHtml: "body van email",
            ccEmail: "cc email",
            ccName: "cc naam",
            bccEmail: "bcc email",
            bccName: "bcc naam",
        },
        en: {
            title: 'Amsterdam Email API',
            description: 'Alfresco is a document management system that implements the Document API standard for case-oriented working (the ZGW APIs). With this plugin you can use OAuth client credentials to link with Alfresco',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip: 'Under this name, the plugin will be recognizable in the rest of the application',
            clientId: 'Client ID',
            clientIdTooltip: 'Enter the clientId here which is configured under OpenZaak management for Alfresco (see API authorizations > Applications). This clientId must have the correct authorizations for the required functionality',
            clientSecret: 'Secret',
            clientSecretTooltip: 'Enter the secret associated with the clientId above',
            emailApiBaseUrl: 'Email API base URL',
            emailApiBaseUrlTooltip: 'Enter the base URL of the Email API here, including the path ending in ../mail',
            tokenEndpoint: 'Token endpoint',
            tokenEndpointTooltip: 'Enter the openid token endpoint here to request the token',
            toEmail: "Email To address",
        },
        de: {
            title: 'Amsterdam Email API',
            description: 'OpenNotificaties ist eine document management system, die den Document API-Standard für fallorientiertes Arbeiten (die ZGW-APIs) implementiert. Mit diesem Plugin können Sie Client-Zugangsdaten über OAuth mit Alfresco verknüpfen',
            configurationTitle: 'Konfigurationsname',
            configurationTitleTooltip: 'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
            clientId: 'Client ID',
            clientIdTooltip: 'Geben Sie hier die clientId ein, die unter OpenZaak-Verwaltung konfiguriert fur Alfreco ist (siehe API-Berechtigungen > Anwendungen). Diese clientId muss die richtigen Berechtigungen für die erforderliche Funktionalität haben',
            clientSecret: 'Secret',
            clientSecretTooltip: 'Geben Sie das mit der obigen clientId verknüpfte Geheimnis ein',
            emailApiBaseUrl: 'Email API base URL',
            emailApiBaseUrlTooltip: 'Geben Sie hier die Basis-URL der E-Mail-API ein, einschließlich des Pfads, der auf ../mail endet',
            tokenEndpoint: 'Token endpoint',
            tokenEndpointTooltip: 'Geben Sie hier den OpenID-Token-Endpunkt ein, um das Token anzufordern',
        },
    },
};



/***/ }),

/***/ "./src/lib/assets/amsterdam-emailapi-plugin-logo.ts":
/*!**********************************************************!*\
  !*** ./src/lib/assets/amsterdam-emailapi-plugin-logo.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64: () => (/* binding */ AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64)
/* harmony export */ });
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
const AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64 = 'data:image/png;base64,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';



/***/ }),

/***/ "./src/lib/assets/index.ts":
/*!*********************************!*\
  !*** ./src/lib/assets/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64: () => (/* reexport safe */ _amsterdam_emailapi_plugin_logo__WEBPACK_IMPORTED_MODULE_0__.AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64)
/* harmony export */ });
/* harmony import */ var _amsterdam_emailapi_plugin_logo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./amsterdam-emailapi-plugin-logo */ "./src/lib/assets/amsterdam-emailapi-plugin-logo.ts");
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */



/***/ }),

/***/ "./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.ts":
/*!***********************************************************************************************************!*\
  !*** ./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.ts ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AmsterdamEmailapiConfigurationComponent: () => (/* binding */ AmsterdamEmailapiConfigurationComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "rxjs");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_2__);
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */



let AmsterdamEmailapiConfigurationComponent = class AmsterdamEmailapiConfigurationComponent {
    constructor() {
        this.valid = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
        this.configuration = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
        this.formValue$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(null);
        this.valid$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(false);
    }
    ngOnInit() {
        this.openSaveSubscription();
    }
    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }
    formValueChange(formValue) {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }
    handleValid(formValue) {
        const valid = !!(formValue.configurationTitle
            && formValue.clientId
            && formValue.clientSecret
            && formValue.emailApiBaseUrl
            && formValue.tokenEndpoint);
        this.valid$.next(valid);
        this.valid.emit(valid);
    }
    openSaveSubscription() {
        this.saveSubscription = this.save$?.subscribe(save => {
            (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.combineLatest)([this.formValue$, this.valid$])
                .pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.take)(1))
                .subscribe(([formValue, valid]) => {
                if (valid) {
                    this.configuration.emit(formValue);
                }
            });
        });
    }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], AmsterdamEmailapiConfigurationComponent.prototype, "save$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], AmsterdamEmailapiConfigurationComponent.prototype, "disabled$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], AmsterdamEmailapiConfigurationComponent.prototype, "pluginId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], AmsterdamEmailapiConfigurationComponent.prototype, "prefillConfiguration$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], AmsterdamEmailapiConfigurationComponent.prototype, "valid", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], AmsterdamEmailapiConfigurationComponent.prototype, "configuration", void 0);
AmsterdamEmailapiConfigurationComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Component)({
        selector: 'valtimo-amsterdam-emailapi-configuration',
        template: __webpack_require__(/*! ./amsterdam-emailapi-configuration.component.html */ "./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.html"),
        styles: [__webpack_require__(/*! ./amsterdam-emailapi-configuration.component.scss */ "./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.scss")],
    })
], AmsterdamEmailapiConfigurationComponent);



/***/ }),

/***/ "./src/lib/components/send-email/send-email-configuration.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/lib/components/send-email/send-email-configuration.component.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SendEmailConfigurationComponent: () => (/* binding */ SendEmailConfigurationComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "rxjs");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_2__);
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */



let SendEmailConfigurationComponent = class SendEmailConfigurationComponent {
    constructor() {
        this.configuration = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
        this.valid = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
        this.formValue$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(null);
        this.valid$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(false);
    }
    ngOnInit() {
        this.openSaveSubscription();
    }
    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }
    formValueChange(formValue) {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }
    handleValid(formValue) {
        const valid = !!(formValue.toEmail)
            && !!(formValue.emailSubject)
            && !!(formValue.contentHtml)
            && !!(formValue.fromAddress);
        this.valid$.next(valid);
        this.valid.emit(valid);
    }
    openSaveSubscription() {
        this.saveSubscription = this.save$?.subscribe(save => {
            (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.combineLatest)([this.formValue$, this.valid$])
                .pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.take)(1))
                .subscribe(([formValue, valid]) => {
                if (valid) {
                    this.configuration.emit(formValue);
                }
            });
        });
    }
};
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], SendEmailConfigurationComponent.prototype, "disabled$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], SendEmailConfigurationComponent.prototype, "pluginId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], SendEmailConfigurationComponent.prototype, "prefillConfiguration$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], SendEmailConfigurationComponent.prototype, "save$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], SendEmailConfigurationComponent.prototype, "configuration", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], SendEmailConfigurationComponent.prototype, "valid", void 0);
SendEmailConfigurationComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Component)({
        selector: 'valtimo-send-email-configuration',
        template: __webpack_require__(/*! ./send-email-configuration.component.html */ "./src/lib/components/send-email/send-email-configuration.component.html"),
        styles: [__webpack_require__(/*! ./send-email-configuration.component.scss */ "./src/lib/components/send-email/send-email-configuration.component.scss")],
    })
], SendEmailConfigurationComponent);



/***/ }),

/***/ "./src/lib/models/config.ts":
/*!**********************************!*\
  !*** ./src/lib/models/config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */



/***/ }),

/***/ "./src/lib/models/index.ts":
/*!*********************************!*\
  !*** ./src/lib/models/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./src/lib/models/config.ts");
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */



/***/ }),

/***/ "./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.html":
/*!*************************************************************************************************************!*\
  !*** ./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.html ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = "<!--\n  ~ Copyright 2015-2024. Ritense BV, the Netherlands.\n  ~\n  ~ Licensed under EUPL, Version 1.2 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~ https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" basis,\n  ~\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n  ~ express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  ~\n  -->\n\n<v-form\n        (valueChange)=\"formValueChange($event)\"\n        *ngIf=\"{\n    disabled: disabled$ | async,\n    prefill: prefillConfiguration$ ? (prefillConfiguration$ | async) : null\n  } as obs\"\n>\n  <v-input\n          name=\"configurationTitle\"\n          [title]=\"'configurationTitle' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [disabled]=\"obs.disabled\"\n          [defaultValue]=\"obs.prefill?.configurationTitle\"\n          [widthPx]=\"350\"\n          [required]=\"true\"\n          [tooltip]=\"'configurationTitleTooltip' | pluginTranslate: pluginId | async\"\n          placeholder=\"Email API plugin\"\n  >\n  </v-input>\n  <v-input\n          name=\"emailApiBaseUrl\"\n          [title]=\"'emailApiBaseUrl' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [disabled]=\"obs.disabled\"\n          [defaultValue]=\"obs.prefill?.emailApiBaseUrl\"\n          [widthPx]=\"350\"\n          [required]=\"true\"\n          [tooltip]=\"'emailApiBaseUrlTooltip' | pluginTranslate: pluginId | async\"\n          placeholder=\"emailApiBaseUrl\"\n  >\n  </v-input>\n  <v-input\n          name=\"clientId\"\n          [title]=\"'clientId' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [disabled]=\"obs.disabled\"\n          [defaultValue]=\"obs.prefill?.clientId\"\n          [widthPx]=\"350\"\n          [required]=\"true\"\n          [tooltip]=\"'clientIdTooltip' | pluginTranslate: pluginId | async\"\n          placeholder=\"client-id\"\n  >\n  </v-input>\n  <v-input\n          name=\"clientSecret\"\n          type=\"password\"\n          [title]=\"'clientSecret' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [disabled]=\"obs.disabled\"\n          [defaultValue]=\"obs.prefill?.clientSecret\"\n          [required]=\"true\"\n          [fullWidth]=\"true\"\n          [tooltip]=\"'clientSecretTooltip' | pluginTranslate: pluginId | async\"\n  >\n  </v-input>\n  <v-input\n          name=\"tokenEndpoint\"\n          [title]=\"'tokenEndpoint' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [disabled]=\"obs.disabled\"\n          [defaultValue]=\"obs.prefill?.tokenEndpoint\"\n          [widthPx]=\"350\"\n          [required]=\"true\"\n          [tooltip]=\"'tokenEndpointTooltip' | pluginTranslate: pluginId | async\"\n          placeholder=\"token-endpoint\"\n  >\n  </v-input>\n</v-form>\n";

/***/ }),

/***/ "./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.scss":
/*!*************************************************************************************************************!*\
  !*** ./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.scss ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = "/*!\n * Copyright 2015-2024. Ritense BV, the Netherlands.\n *\n * Licensed under EUPL, Version 1.2 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" basis,\n *\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n * express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n";

/***/ }),

/***/ "./src/lib/components/send-email/send-email-configuration.component.html":
/*!*******************************************************************************!*\
  !*** ./src/lib/components/send-email/send-email-configuration.component.html ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = "<!--\n  ~ Copyright 2015-2024. Ritense BV, the Netherlands.\n  ~\n  ~ Licensed under EUPL, Version 1.2 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~ https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" basis,\n  ~\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n  ~ express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  ~\n  -->\n\n<v-form\n  (valueChange)=\"formValueChange($event)\"\n  *ngIf=\"{\n    disabled: disabled$ | async,\n    prefill: prefillConfiguration$ ? (prefillConfiguration$ | async) : null\n  } as obs\"\n>\n  <v-input\n          name=\"toEmail\"\n          [title]=\"'toEmail' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.toEmail\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"true\"\n  >\n  </v-input>\n  <v-input\n          name=\"toName\"\n          [title]=\"'toName' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.toName\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"false\"\n  >\n  </v-input>\n  <v-input\n          name=\"emailSubject\"\n          [title]=\"'emailSubject' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.emailSubject\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"true\"\n  >\n  </v-input>\n  <v-input\n          name=\"fromAddress\"\n          [title]=\"'fromAddress' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.fromAddress\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"true\"\n  >\n  </v-input>\n  <v-input\n          name=\"ccEmail\"\n          [title]=\"'ccEmail' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.ccEmail\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"false\"\n  >\n  </v-input>\n  <v-input\n          name=\"ccName\"\n          [title]=\"'ccName' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.ccName\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"false\"\n  >\n  </v-input>\n  <v-input\n          name=\"bccEmail\"\n          [title]=\"'bccEmail' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.bccEmail\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"false\"\n  >\n  </v-input>\n  <v-input\n          name=\"bccName\"\n          [title]=\"'bccName' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.bccName\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"false\"\n  >\n  </v-input>\n  <v-input\n          name=\"contentHtml\"\n          [title]=\"'contentHtml' | pluginTranslate: pluginId | async\"\n          [margin]=\"true\"\n          [defaultValue]=\"obs.prefill?.contentHtml\"\n          [disabled]=\"obs.disabled\"\n          [required]=\"true\"\n  >\n  </v-input>\n</v-form>\n";

/***/ }),

/***/ "./src/lib/components/send-email/send-email-configuration.component.scss":
/*!*******************************************************************************!*\
  !*** ./src/lib/components/send-email/send-email-configuration.component.scss ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = "/*!\n * Copyright 2015-2024. Ritense BV, the Netherlands.\n *\n * Licensed under EUPL, Version 1.2 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" basis,\n *\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n * express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n";

/***/ }),

/***/ "@angular/common":
/*!**********************************!*\
  !*** external "@angular/common" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["@angular/common"];

/***/ }),

/***/ "@angular/core":
/*!********************************!*\
  !*** external "@angular/core" ***!
  \********************************/
/***/ ((module) => {

module.exports = window["@angular/core"];

/***/ }),

/***/ "@valtimo/components":
/*!**************************************!*\
  !*** external "@valtimo/components" ***!
  \**************************************/
/***/ ((module) => {

module.exports = window["@valtimo/components"];

/***/ }),

/***/ "@valtimo/plugin":
/*!**********************************!*\
  !*** external "@valtimo/plugin" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["@valtimo/plugin"];

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/***/ ((module) => {

module.exports = window["rxjs"];

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/***/ ((module) => {

module.exports = window["tslib"];

/***/ }),

/***/ "../../../node_modules/@angular/forms/fesm2022/forms.mjs":
/*!***************************************************************!*\
  !*** ../../../node_modules/@angular/forms/fesm2022/forms.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

var _angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbstractControl: () => (/* binding */ AbstractControl),
/* harmony export */   AbstractControlDirective: () => (/* binding */ AbstractControlDirective),
/* harmony export */   AbstractFormGroupDirective: () => (/* binding */ AbstractFormGroupDirective),
/* harmony export */   COMPOSITION_BUFFER_MODE: () => (/* binding */ COMPOSITION_BUFFER_MODE),
/* harmony export */   CheckboxControlValueAccessor: () => (/* binding */ CheckboxControlValueAccessor),
/* harmony export */   CheckboxRequiredValidator: () => (/* binding */ CheckboxRequiredValidator),
/* harmony export */   ControlContainer: () => (/* binding */ ControlContainer),
/* harmony export */   DefaultValueAccessor: () => (/* binding */ DefaultValueAccessor),
/* harmony export */   EmailValidator: () => (/* binding */ EmailValidator),
/* harmony export */   FormArray: () => (/* binding */ FormArray),
/* harmony export */   FormArrayName: () => (/* binding */ FormArrayName),
/* harmony export */   FormBuilder: () => (/* binding */ FormBuilder),
/* harmony export */   FormControl: () => (/* binding */ FormControl),
/* harmony export */   FormControlDirective: () => (/* binding */ FormControlDirective),
/* harmony export */   FormControlName: () => (/* binding */ FormControlName),
/* harmony export */   FormGroup: () => (/* binding */ FormGroup),
/* harmony export */   FormGroupDirective: () => (/* binding */ FormGroupDirective),
/* harmony export */   FormGroupName: () => (/* binding */ FormGroupName),
/* harmony export */   FormRecord: () => (/* binding */ FormRecord),
/* harmony export */   FormsModule: () => (/* binding */ FormsModule),
/* harmony export */   MaxLengthValidator: () => (/* binding */ MaxLengthValidator),
/* harmony export */   MaxValidator: () => (/* binding */ MaxValidator),
/* harmony export */   MinLengthValidator: () => (/* binding */ MinLengthValidator),
/* harmony export */   MinValidator: () => (/* binding */ MinValidator),
/* harmony export */   NG_ASYNC_VALIDATORS: () => (/* binding */ NG_ASYNC_VALIDATORS),
/* harmony export */   NG_VALIDATORS: () => (/* binding */ NG_VALIDATORS),
/* harmony export */   NG_VALUE_ACCESSOR: () => (/* binding */ NG_VALUE_ACCESSOR),
/* harmony export */   NgControl: () => (/* binding */ NgControl),
/* harmony export */   NgControlStatus: () => (/* binding */ NgControlStatus),
/* harmony export */   NgControlStatusGroup: () => (/* binding */ NgControlStatusGroup),
/* harmony export */   NgForm: () => (/* binding */ NgForm),
/* harmony export */   NgModel: () => (/* binding */ NgModel),
/* harmony export */   NgModelGroup: () => (/* binding */ NgModelGroup),
/* harmony export */   NgSelectOption: () => (/* binding */ NgSelectOption),
/* harmony export */   NonNullableFormBuilder: () => (/* binding */ NonNullableFormBuilder),
/* harmony export */   NumberValueAccessor: () => (/* binding */ NumberValueAccessor),
/* harmony export */   PatternValidator: () => (/* binding */ PatternValidator),
/* harmony export */   RadioControlValueAccessor: () => (/* binding */ RadioControlValueAccessor),
/* harmony export */   RangeValueAccessor: () => (/* binding */ RangeValueAccessor),
/* harmony export */   ReactiveFormsModule: () => (/* binding */ ReactiveFormsModule),
/* harmony export */   RequiredValidator: () => (/* binding */ RequiredValidator),
/* harmony export */   SelectControlValueAccessor: () => (/* binding */ SelectControlValueAccessor),
/* harmony export */   SelectMultipleControlValueAccessor: () => (/* binding */ SelectMultipleControlValueAccessor),
/* harmony export */   UntypedFormArray: () => (/* binding */ UntypedFormArray),
/* harmony export */   UntypedFormBuilder: () => (/* binding */ UntypedFormBuilder),
/* harmony export */   UntypedFormControl: () => (/* binding */ UntypedFormControl),
/* harmony export */   UntypedFormGroup: () => (/* binding */ UntypedFormGroup),
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   Validators: () => (/* binding */ Validators),
/* harmony export */   isFormArray: () => (/* binding */ isFormArray),
/* harmony export */   isFormControl: () => (/* binding */ isFormControl),
/* harmony export */   isFormGroup: () => (/* binding */ isFormGroup),
/* harmony export */   isFormRecord: () => (/* binding */ isFormRecord),
/* harmony export */   "ɵInternalFormsSharedModule": () => (/* binding */ ɵInternalFormsSharedModule),
/* harmony export */   "ɵNgNoValidate": () => (/* binding */ ɵNgNoValidate),
/* harmony export */   "ɵNgSelectMultipleOption": () => (/* binding */ ɵNgSelectMultipleOption)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "@angular/common");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "rxjs");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../../../node_modules/rxjs/dist/esm5/internal/operators/map.js");
/**
 * @license Angular v17.3.12
 * (c) 2010-2024 Google LLC. https://angular.io/
 * License: MIT
 */







/**
 * Base class for all ControlValueAccessor classes defined in Forms package.
 * Contains common logic and utility functions.
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
class BaseControlValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /**
         * The registered callback function called when a change or input event occurs on the input
         * element.
         * @nodoc
         */
        this.onChange = (_) => { };
        /**
         * The registered callback function called when a blur event occurs on the input element.
         * @nodoc
         */
        this.onTouched = () => { };
    }
    /**
     * Helper method that sets a property on a target element using the current Renderer
     * implementation.
     * @nodoc
     */
    setProperty(key, value) {
        this._renderer.setProperty(this._elementRef.nativeElement, key, value);
    }
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Sets the "disabled" property on the range input element.
     * @nodoc
     */
    setDisabledState(isDisabled) {
        this.setProperty('disabled', isDisabled);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: BaseControlValueAccessor, deps: [{ token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: BaseControlValueAccessor, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: BaseControlValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive
        }], ctorParameters: () => [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }] });
/**
 * Base class for all built-in ControlValueAccessor classes (except DefaultValueAccessor, which is
 * used in case no other CVAs can be found). We use this class to distinguish between default CVA,
 * built-in CVAs and custom CVAs, so that Forms logic can recognize built-in CVAs and treat custom
 * ones with higher priority (when both built-in and custom CVAs are present).
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
class BuiltInControlValueAccessor extends BaseControlValueAccessor {
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: BuiltInControlValueAccessor, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: BuiltInControlValueAccessor, usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: BuiltInControlValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive
        }] });
/**
 * Used to provide a `ControlValueAccessor` for form controls.
 *
 * See `DefaultValueAccessor` for how to implement one.
 *
 * @publicApi
 */
const NG_VALUE_ACCESSOR = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(ngDevMode ? 'NgValueAccessor' : '');

const CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => CheckboxControlValueAccessor),
    multi: true,
};
/**
 * @description
 * A `ControlValueAccessor` for writing a value and listening to changes on a checkbox input
 * element.
 *
 * @usageNotes
 *
 * ### Using a checkbox with a reactive form.
 *
 * The following example shows how to use a checkbox with a reactive form.
 *
 * ```ts
 * const rememberLoginControl = new FormControl();
 * ```
 *
 * ```
 * <input type="checkbox" [formControl]="rememberLoginControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class CheckboxControlValueAccessor extends BuiltInControlValueAccessor {
    /**
     * Sets the "checked" property on the input element.
     * @nodoc
     */
    writeValue(value) {
        this.setProperty('checked', value);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: CheckboxControlValueAccessor, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]", host: { listeners: { "change": "onChange($event.target.checked)", "blur": "onTouched()" } }, providers: [CHECKBOX_VALUE_ACCESSOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: CheckboxControlValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
                    host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
                    providers: [CHECKBOX_VALUE_ACCESSOR]
                }]
        }] });

const DEFAULT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => DefaultValueAccessor),
    multi: true
};
/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid() {
    const userAgent = (0,_angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵgetDOM"])() ? (0,_angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵgetDOM"])().getUserAgent() : '';
    return /android (\d+)/.test(userAgent.toLowerCase());
}
/**
 * @description
 * Provide this token to control if form directives buffer IME input until
 * the "compositionend" event occurs.
 * @publicApi
 */
const COMPOSITION_BUFFER_MODE = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(ngDevMode ? 'CompositionEventMode' : '');
/**
 * The default `ControlValueAccessor` for writing a value and listening to changes on input
 * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * {@searchKeywords ngDefaultControl}
 *
 * @usageNotes
 *
 * ### Using the default value accessor
 *
 * The following example shows how to use an input element that activates the default value accessor
 * (in this case, a text field).
 *
 * ```ts
 * const firstNameControl = new FormControl();
 * ```
 *
 * ```
 * <input type="text" [formControl]="firstNameControl">
 * ```
 *
 * This value accessor is used by default for `<input type="text">` and `<textarea>` elements, but
 * you could also use it for custom components that have similar behavior and do not require special
 * processing. In order to attach the default value accessor to a custom element, add the
 * `ngDefaultControl` attribute as shown below.
 *
 * ```
 * <custom-input-component ngDefaultControl [(ngModel)]="value"></custom-input-component>
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class DefaultValueAccessor extends BaseControlValueAccessor {
    constructor(renderer, elementRef, _compositionMode) {
        super(renderer, elementRef);
        this._compositionMode = _compositionMode;
        /** Whether the user is creating a composition string (IME events). */
        this._composing = false;
        if (this._compositionMode == null) {
            this._compositionMode = !_isAndroid();
        }
    }
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value) {
        const normalizedValue = value == null ? '' : value;
        this.setProperty('value', normalizedValue);
    }
    /** @internal */
    _handleInput(value) {
        if (!this._compositionMode || (this._compositionMode && !this._composing)) {
            this.onChange(value);
        }
    }
    /** @internal */
    _compositionStart() {
        this._composing = true;
    }
    /** @internal */
    _compositionEnd(value) {
        this._composing = false;
        this._compositionMode && this.onChange(value);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: DefaultValueAccessor, deps: [{ token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }, { token: COMPOSITION_BUFFER_MODE, optional: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]", host: { listeners: { "input": "$any(this)._handleInput($event.target.value)", "blur": "onTouched()", "compositionstart": "$any(this)._compositionStart()", "compositionend": "$any(this)._compositionEnd($event.target.value)" } }, providers: [DEFAULT_VALUE_ACCESSOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: DefaultValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
                    // TODO: vsavkin replace the above selector with the one below it once
                    // https://github.com/angular/angular/issues/3011 is implemented
                    // selector: '[ngModel],[formControl],[formControlName]',
                    host: {
                        '(input)': '$any(this)._handleInput($event.target.value)',
                        '(blur)': 'onTouched()',
                        '(compositionstart)': '$any(this)._compositionStart()',
                        '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
                    },
                    providers: [DEFAULT_VALUE_ACCESSOR]
                }]
        }], ctorParameters: () => [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [COMPOSITION_BUFFER_MODE]
                }] }] });

function isEmptyInputValue(value) {
    /**
     * Check if the object is a string or array before evaluating the length attribute.
     * This avoids falsely rejecting objects that contain a custom length attribute.
     * For example, the object {id: 1, length: 0, width: 0} should not be returned as empty.
     */
    return value == null ||
        ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
}
function hasValidLength(value) {
    // non-strict comparison is intentional, to check for both `null` and `undefined` values
    return value != null && typeof value.length === 'number';
}
/**
 * @description
 * An `InjectionToken` for registering additional synchronous validators used with
 * `AbstractControl`s.
 *
 * @see {@link NG_ASYNC_VALIDATORS}
 *
 * @usageNotes
 *
 * ### Providing a custom validator
 *
 * The following example registers a custom validator directive. Adding the validator to the
 * existing collection of validators requires the `multi: true` option.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customValidator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(control: AbstractControl): ValidationErrors | null {
 *     return { 'custom': true };
 *   }
 * }
 * ```
 *
 * @publicApi
 */
const NG_VALIDATORS = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(ngDevMode ? 'NgValidators' : '');
/**
 * @description
 * An `InjectionToken` for registering additional asynchronous validators used with
 * `AbstractControl`s.
 *
 * @see {@link NG_VALIDATORS}
 *
 * @usageNotes
 *
 * ### Provide a custom async validator directive
 *
 * The following example implements the `AsyncValidator` interface to create an
 * async validator directive with a custom error key.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customAsyncValidator]',
 *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 * true}]
 * })
 * class CustomAsyncValidatorDirective implements AsyncValidator {
 *   validate(control: AbstractControl): Promise<ValidationErrors|null> {
 *     return Promise.resolve({'custom': true});
 *   }
 * }
 * ```
 *
 * @publicApi
 */
const NG_ASYNC_VALIDATORS = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(ngDevMode ? 'NgAsyncValidators' : '');
/**
 * A regular expression that matches valid e-mail addresses.
 *
 * At a high level, this regexp matches e-mail addresses of the format `local-part@tld`, where:
 * - `local-part` consists of one or more of the allowed characters (alphanumeric and some
 *   punctuation symbols).
 * - `local-part` cannot begin or end with a period (`.`).
 * - `local-part` cannot be longer than 64 characters.
 * - `tld` consists of one or more `labels` separated by periods (`.`). For example `localhost` or
 *   `foo.com`.
 * - A `label` consists of one or more of the allowed characters (alphanumeric, dashes (`-`) and
 *   periods (`.`)).
 * - A `label` cannot begin or end with a dash (`-`) or a period (`.`).
 * - A `label` cannot be longer than 63 characters.
 * - The whole address cannot be longer than 254 characters.
 *
 * ## Implementation background
 *
 * This regexp was ported over from AngularJS (see there for git history):
 * https://github.com/angular/angular.js/blob/c133ef836/src/ng/directive/input.js#L27
 * It is based on the
 * [WHATWG version](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
 * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
 * lengths of different parts of the address). The main differences from the WHATWG version are:
 *   - Disallow `local-part` to begin or end with a period (`.`).
 *   - Disallow `local-part` length to exceed 64 characters.
 *   - Disallow total address length to exceed 254 characters.
 *
 * See [this commit](https://github.com/angular/angular.js/commit/f3f5cf72e) for more details.
 */
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/**
 * @description
 * Provides a set of built-in validators that can be used by form controls.
 *
 * A validator is a function that processes a `FormControl` or collection of
 * controls and returns an error map or null. A null map means that validation has passed.
 *
 * @see [Form Validation](/guide/form-validation)
 *
 * @publicApi
 */
class Validators {
    /**
     * @description
     * Validator that requires the control's value to be greater than or equal to the provided number.
     *
     * @usageNotes
     *
     * ### Validate against a minimum of 3
     *
     * ```typescript
     * const control = new FormControl(2, Validators.min(3));
     *
     * console.log(control.errors); // {min: {min: 3, actual: 2}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `min` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static min(min) {
        return minValidator(min);
    }
    /**
     * @description
     * Validator that requires the control's value to be less than or equal to the provided number.
     *
     * @usageNotes
     *
     * ### Validate against a maximum of 15
     *
     * ```typescript
     * const control = new FormControl(16, Validators.max(15));
     *
     * console.log(control.errors); // {max: {max: 15, actual: 16}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `max` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static max(max) {
        return maxValidator(max);
    }
    /**
     * @description
     * Validator that requires the control have a non-empty value.
     *
     * @usageNotes
     *
     * ### Validate that the field is non-empty
     *
     * ```typescript
     * const control = new FormControl('', Validators.required);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map with the `required` property
     * if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static required(control) {
        return requiredValidator(control);
    }
    /**
     * @description
     * Validator that requires the control's value be true. This validator is commonly
     * used for required checkboxes.
     *
     * @usageNotes
     *
     * ### Validate that the field value is true
     *
     * ```typescript
     * const control = new FormControl('some value', Validators.requiredTrue);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map that contains the `required` property
     * set to `true` if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static requiredTrue(control) {
        return requiredTrueValidator(control);
    }
    /**
     * @description
     * Validator that requires the control's value pass an email validation test.
     *
     * Tests the value using a [regular
     * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
     * pattern suitable for common use cases. The pattern is based on the definition of a valid email
     * address in the [WHATWG HTML
     * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
     * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
     * lengths of different parts of the address).
     *
     * The differences from the WHATWG version include:
     * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
     * - Disallow `local-part` to be longer than 64 characters.
     * - Disallow the whole address to be longer than 254 characters.
     *
     * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
     * validate the value against a different pattern.
     *
     * @usageNotes
     *
     * ### Validate that the field matches a valid email pattern
     *
     * ```typescript
     * const control = new FormControl('bad@', Validators.email);
     *
     * console.log(control.errors); // {email: true}
     * ```
     *
     * @returns An error map with the `email` property
     * if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static email(control) {
        return emailValidator(control);
    }
    /**
     * @description
     * Validator that requires the length of the control's value to be greater than or equal
     * to the provided minimum length. This validator is also provided by default if you use the
     * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
     * only for types that have a numeric `length` property, such as strings or arrays. The
     * `minLength` validator logic is also not invoked for values when their `length` property is 0
     * (for example in case of an empty string or an empty array), to support optional controls. You
     * can use the standard `required` validator if empty values should not be considered valid.
     *
     * @usageNotes
     *
     * ### Validate that the field has a minimum of 3 characters
     *
     * ```typescript
     * const control = new FormControl('ng', Validators.minLength(3));
     *
     * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
     * ```
     *
     * ```html
     * <input minlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `minlength` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static minLength(minLength) {
        return minLengthValidator(minLength);
    }
    /**
     * @description
     * Validator that requires the length of the control's value to be less than or equal
     * to the provided maximum length. This validator is also provided by default if you use the
     * the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
     * only for types that have a numeric `length` property, such as strings or arrays.
     *
     * @usageNotes
     *
     * ### Validate that the field has maximum of 5 characters
     *
     * ```typescript
     * const control = new FormControl('Angular', Validators.maxLength(5));
     *
     * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
     * ```
     *
     * ```html
     * <input maxlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `maxlength` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static maxLength(maxLength) {
        return maxLengthValidator(maxLength);
    }
    /**
     * @description
     * Validator that requires the control's value to match a regex pattern. This validator is also
     * provided by default if you use the HTML5 `pattern` attribute.
     *
     * @usageNotes
     *
     * ### Validate that the field only contains letters or spaces
     *
     * ```typescript
     * const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
     *
     * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
     * ```
     *
     * ```html
     * <input pattern="[a-zA-Z ]*">
     * ```
     *
     * ### Pattern matching with the global or sticky flag
     *
     * `RegExp` objects created with the `g` or `y` flags that are passed into `Validators.pattern`
     * can produce different results on the same input when validations are run consecutively. This is
     * due to how the behavior of `RegExp.prototype.test` is
     * specified in [ECMA-262](https://tc39.es/ecma262/#sec-regexpbuiltinexec)
     * (`RegExp` preserves the index of the last match when the global or sticky flag is used).
     * Due to this behavior, it is recommended that when using
     * `Validators.pattern` you **do not** pass in a `RegExp` object with either the global or sticky
     * flag enabled.
     *
     * ```typescript
     * // Not recommended (since the `g` flag is used)
     * const controlOne = new FormControl('1', Validators.pattern(/foo/g));
     *
     * // Good
     * const controlTwo = new FormControl('1', Validators.pattern(/foo/));
     * ```
     *
     * @param pattern A regular expression to be used as is to test the values, or a string.
     * If a string is passed, the `^` character is prepended and the `$` character is
     * appended to the provided string (if not already present), and the resulting regular
     * expression is used to test the values.
     *
     * @returns A validator function that returns an error map with the
     * `pattern` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static pattern(pattern) {
        return patternValidator(pattern);
    }
    /**
     * @description
     * Validator that performs no operation.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static nullValidator(control) {
        return nullValidator(control);
    }
    static compose(validators) {
        return compose(validators);
    }
    /**
     * @description
     * Compose multiple async validators into a single function that returns the union
     * of the individual error objects for the provided control.
     *
     * @returns A validator function that returns an error map with the
     * merged error objects of the async validators if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static composeAsync(validators) {
        return composeAsync(validators);
    }
}
/**
 * Validator that requires the control's value to be greater than or equal to the provided number.
 * See `Validators.min` for additional information.
 */
function minValidator(min) {
    return (control) => {
        if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
            return null; // don't validate empty values to allow optional controls
        }
        const value = parseFloat(control.value);
        // Controls with NaN values after parsing should be treated as not having a
        // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
        return !isNaN(value) && value < min ? { 'min': { 'min': min, 'actual': control.value } } : null;
    };
}
/**
 * Validator that requires the control's value to be less than or equal to the provided number.
 * See `Validators.max` for additional information.
 */
function maxValidator(max) {
    return (control) => {
        if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
            return null; // don't validate empty values to allow optional controls
        }
        const value = parseFloat(control.value);
        // Controls with NaN values after parsing should be treated as not having a
        // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
        return !isNaN(value) && value > max ? { 'max': { 'max': max, 'actual': control.value } } : null;
    };
}
/**
 * Validator that requires the control have a non-empty value.
 * See `Validators.required` for additional information.
 */
function requiredValidator(control) {
    return isEmptyInputValue(control.value) ? { 'required': true } : null;
}
/**
 * Validator that requires the control's value be true. This validator is commonly
 * used for required checkboxes.
 * See `Validators.requiredTrue` for additional information.
 */
function requiredTrueValidator(control) {
    return control.value === true ? null : { 'required': true };
}
/**
 * Validator that requires the control's value pass an email validation test.
 * See `Validators.email` for additional information.
 */
function emailValidator(control) {
    if (isEmptyInputValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
    }
    return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
}
/**
 * Validator that requires the length of the control's value to be greater than or equal
 * to the provided minimum length. See `Validators.minLength` for additional information.
 */
function minLengthValidator(minLength) {
    return (control) => {
        if (isEmptyInputValue(control.value) || !hasValidLength(control.value)) {
            // don't validate empty values to allow optional controls
            // don't validate values without `length` property
            return null;
        }
        return control.value.length < minLength ?
            { 'minlength': { 'requiredLength': minLength, 'actualLength': control.value.length } } :
            null;
    };
}
/**
 * Validator that requires the length of the control's value to be less than or equal
 * to the provided maximum length. See `Validators.maxLength` for additional information.
 */
function maxLengthValidator(maxLength) {
    return (control) => {
        return hasValidLength(control.value) && control.value.length > maxLength ?
            { 'maxlength': { 'requiredLength': maxLength, 'actualLength': control.value.length } } :
            null;
    };
}
/**
 * Validator that requires the control's value to match a regex pattern.
 * See `Validators.pattern` for additional information.
 */
function patternValidator(pattern) {
    if (!pattern)
        return nullValidator;
    let regex;
    let regexStr;
    if (typeof pattern === 'string') {
        regexStr = '';
        if (pattern.charAt(0) !== '^')
            regexStr += '^';
        regexStr += pattern;
        if (pattern.charAt(pattern.length - 1) !== '$')
            regexStr += '$';
        regex = new RegExp(regexStr);
    }
    else {
        regexStr = pattern.toString();
        regex = pattern;
    }
    return (control) => {
        if (isEmptyInputValue(control.value)) {
            return null; // don't validate empty values to allow optional controls
        }
        const value = control.value;
        return regex.test(value) ? null :
            { 'pattern': { 'requiredPattern': regexStr, 'actualValue': value } };
    };
}
/**
 * Function that has `ValidatorFn` shape, but performs no operation.
 */
function nullValidator(control) {
    return null;
}
function isPresent(o) {
    return o != null;
}
function toObservable(value) {
    const obs = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵisPromise"])(value) ? (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(value) : value;
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && !((0,_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵisSubscribable"])(obs))) {
        let errorMessage = `Expected async validator to return Promise or Observable.`;
        // A synchronous validator will return object or null.
        if (typeof value === 'object') {
            errorMessage +=
                ' Are you using a synchronous validator where an async validator is expected?';
        }
        throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](-1101 /* RuntimeErrorCode.WRONG_VALIDATOR_RETURN_TYPE */, errorMessage);
    }
    return obs;
}
function mergeErrors(arrayOfErrors) {
    let res = {};
    arrayOfErrors.forEach((errors) => {
        res = errors != null ? { ...res, ...errors } : res;
    });
    return Object.keys(res).length === 0 ? null : res;
}
function executeValidators(control, validators) {
    return validators.map(validator => validator(control));
}
function isValidatorFn(validator) {
    return !validator.validate;
}
/**
 * Given the list of validators that may contain both functions as well as classes, return the list
 * of validator functions (convert validator classes into validator functions). This is needed to
 * have consistent structure in validators list before composing them.
 *
 * @param validators The set of validators that may contain validators both in plain function form
 *     as well as represented as a validator class.
 */
function normalizeValidators(validators) {
    return validators.map(validator => {
        return isValidatorFn(validator) ?
            validator :
            ((c) => validator.validate(c));
    });
}
/**
 * Merges synchronous validators into a single validator function.
 * See `Validators.compose` for additional information.
 */
function compose(validators) {
    if (!validators)
        return null;
    const presentValidators = validators.filter(isPresent);
    if (presentValidators.length == 0)
        return null;
    return function (control) {
        return mergeErrors(executeValidators(control, presentValidators));
    };
}
/**
 * Accepts a list of validators of different possible shapes (`Validator` and `ValidatorFn`),
 * normalizes the list (converts everything to `ValidatorFn`) and merges them into a single
 * validator function.
 */
function composeValidators(validators) {
    return validators != null ? compose(normalizeValidators(validators)) : null;
}
/**
 * Merges asynchronous validators into a single validator function.
 * See `Validators.composeAsync` for additional information.
 */
function composeAsync(validators) {
    if (!validators)
        return null;
    const presentValidators = validators.filter(isPresent);
    if (presentValidators.length == 0)
        return null;
    return function (control) {
        const observables = executeValidators(control, presentValidators).map(toObservable);
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.forkJoin)(observables).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.map)(mergeErrors));
    };
}
/**
 * Accepts a list of async validators of different possible shapes (`AsyncValidator` and
 * `AsyncValidatorFn`), normalizes the list (converts everything to `AsyncValidatorFn`) and merges
 * them into a single validator function.
 */
function composeAsyncValidators(validators) {
    return validators != null ? composeAsync(normalizeValidators(validators)) :
        null;
}
/**
 * Merges raw control validators with a given directive validator and returns the combined list of
 * validators as an array.
 */
function mergeValidators(controlValidators, dirValidator) {
    if (controlValidators === null)
        return [dirValidator];
    return Array.isArray(controlValidators) ? [...controlValidators, dirValidator] :
        [controlValidators, dirValidator];
}
/**
 * Retrieves the list of raw synchronous validators attached to a given control.
 */
function getControlValidators(control) {
    return control._rawValidators;
}
/**
 * Retrieves the list of raw asynchronous validators attached to a given control.
 */
function getControlAsyncValidators(control) {
    return control._rawAsyncValidators;
}
/**
 * Accepts a singleton validator, an array, or null, and returns an array type with the provided
 * validators.
 *
 * @param validators A validator, validators, or null.
 * @returns A validators array.
 */
function makeValidatorsArray(validators) {
    if (!validators)
        return [];
    return Array.isArray(validators) ? validators : [validators];
}
/**
 * Determines whether a validator or validators array has a given validator.
 *
 * @param validators The validator or validators to compare against.
 * @param validator The validator to check.
 * @returns Whether the validator is present.
 */
function hasValidator(validators, validator) {
    return Array.isArray(validators) ? validators.includes(validator) : validators === validator;
}
/**
 * Combines two arrays of validators into one. If duplicates are provided, only one will be added.
 *
 * @param validators The new validators.
 * @param currentValidators The base array of current validators.
 * @returns An array of validators.
 */
function addValidators(validators, currentValidators) {
    const current = makeValidatorsArray(currentValidators);
    const validatorsToAdd = makeValidatorsArray(validators);
    validatorsToAdd.forEach((v) => {
        // Note: if there are duplicate entries in the new validators array,
        // only the first one would be added to the current list of validators.
        // Duplicate ones would be ignored since `hasValidator` would detect
        // the presence of a validator function and we update the current list in place.
        if (!hasValidator(current, v)) {
            current.push(v);
        }
    });
    return current;
}
function removeValidators(validators, currentValidators) {
    return makeValidatorsArray(currentValidators).filter(v => !hasValidator(validators, v));
}

/**
 * @description
 * Base class for control directives.
 *
 * This class is only used internally in the `ReactiveFormsModule` and the `FormsModule`.
 *
 * @publicApi
 */
class AbstractControlDirective {
    constructor() {
        /**
         * Set of synchronous validators as they were provided while calling `setValidators` function.
         * @internal
         */
        this._rawValidators = [];
        /**
         * Set of asynchronous validators as they were provided while calling `setAsyncValidators`
         * function.
         * @internal
         */
        this._rawAsyncValidators = [];
        /*
         * The set of callbacks to be invoked when directive instance is being destroyed.
         */
        this._onDestroyCallbacks = [];
    }
    /**
     * @description
     * Reports the value of the control if it is present, otherwise null.
     */
    get value() {
        return this.control ? this.control.value : null;
    }
    /**
     * @description
     * Reports whether the control is valid. A control is considered valid if no
     * validation errors exist with the current value.
     * If the control is not present, null is returned.
     */
    get valid() {
        return this.control ? this.control.valid : null;
    }
    /**
     * @description
     * Reports whether the control is invalid, meaning that an error exists in the input value.
     * If the control is not present, null is returned.
     */
    get invalid() {
        return this.control ? this.control.invalid : null;
    }
    /**
     * @description
     * Reports whether a control is pending, meaning that async validation is occurring and
     * errors are not yet available for the input value. If the control is not present, null is
     * returned.
     */
    get pending() {
        return this.control ? this.control.pending : null;
    }
    /**
     * @description
     * Reports whether the control is disabled, meaning that the control is disabled
     * in the UI and is exempt from validation checks and excluded from aggregate
     * values of ancestor controls. If the control is not present, null is returned.
     */
    get disabled() {
        return this.control ? this.control.disabled : null;
    }
    /**
     * @description
     * Reports whether the control is enabled, meaning that the control is included in ancestor
     * calculations of validity or value. If the control is not present, null is returned.
     */
    get enabled() {
        return this.control ? this.control.enabled : null;
    }
    /**
     * @description
     * Reports the control's validation errors. If the control is not present, null is returned.
     */
    get errors() {
        return this.control ? this.control.errors : null;
    }
    /**
     * @description
     * Reports whether the control is pristine, meaning that the user has not yet changed
     * the value in the UI. If the control is not present, null is returned.
     */
    get pristine() {
        return this.control ? this.control.pristine : null;
    }
    /**
     * @description
     * Reports whether the control is dirty, meaning that the user has changed
     * the value in the UI. If the control is not present, null is returned.
     */
    get dirty() {
        return this.control ? this.control.dirty : null;
    }
    /**
     * @description
     * Reports whether the control is touched, meaning that the user has triggered
     * a `blur` event on it. If the control is not present, null is returned.
     */
    get touched() {
        return this.control ? this.control.touched : null;
    }
    /**
     * @description
     * Reports the validation status of the control. Possible values include:
     * 'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
     * If the control is not present, null is returned.
     */
    get status() {
        return this.control ? this.control.status : null;
    }
    /**
     * @description
     * Reports whether the control is untouched, meaning that the user has not yet triggered
     * a `blur` event on it. If the control is not present, null is returned.
     */
    get untouched() {
        return this.control ? this.control.untouched : null;
    }
    /**
     * @description
     * Returns a multicasting observable that emits a validation status whenever it is
     * calculated for the control. If the control is not present, null is returned.
     */
    get statusChanges() {
        return this.control ? this.control.statusChanges : null;
    }
    /**
     * @description
     * Returns a multicasting observable of value changes for the control that emits every time the
     * value of the control changes in the UI or programmatically.
     * If the control is not present, null is returned.
     */
    get valueChanges() {
        return this.control ? this.control.valueChanges : null;
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return null;
    }
    /**
     * Sets synchronous validators for this directive.
     * @internal
     */
    _setValidators(validators) {
        this._rawValidators = validators || [];
        this._composedValidatorFn = composeValidators(this._rawValidators);
    }
    /**
     * Sets asynchronous validators for this directive.
     * @internal
     */
    _setAsyncValidators(validators) {
        this._rawAsyncValidators = validators || [];
        this._composedAsyncValidatorFn = composeAsyncValidators(this._rawAsyncValidators);
    }
    /**
     * @description
     * Synchronous validator function composed of all the synchronous validators registered with this
     * directive.
     */
    get validator() {
        return this._composedValidatorFn || null;
    }
    /**
     * @description
     * Asynchronous validator function composed of all the asynchronous validators registered with
     * this directive.
     */
    get asyncValidator() {
        return this._composedAsyncValidatorFn || null;
    }
    /**
     * Internal function to register callbacks that should be invoked
     * when directive instance is being destroyed.
     * @internal
     */
    _registerOnDestroy(fn) {
        this._onDestroyCallbacks.push(fn);
    }
    /**
     * Internal function to invoke all registered "on destroy" callbacks.
     * Note: calling this function also clears the list of callbacks.
     * @internal
     */
    _invokeOnDestroyCallbacks() {
        this._onDestroyCallbacks.forEach(fn => fn());
        this._onDestroyCallbacks = [];
    }
    /**
     * @description
     * Resets the control with the provided value if the control is present.
     */
    reset(value = undefined) {
        if (this.control)
            this.control.reset(value);
    }
    /**
     * @description
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * If no path is given, this method checks for the error on the current control.
     *
     * @returns whether the given error is present in the control at the given path.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode, path) {
        return this.control ? this.control.hasError(errorCode, path) : false;
    }
    /**
     * @description
     * Reports error data for the control with the given path.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * @returns error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode, path) {
        return this.control ? this.control.getError(errorCode, path) : null;
    }
}

/**
 * @description
 * A base class for directives that contain multiple registered instances of `NgControl`.
 * Only used by the forms module.
 *
 * @publicApi
 */
class ControlContainer extends AbstractControlDirective {
    /**
     * @description
     * The top-level form directive for the control.
     */
    get formDirective() {
        return null;
    }
    /**
     * @description
     * The path to this group.
     */
    get path() {
        return null;
    }
}

/**
 * @description
 * A base class that all `FormControl`-based directives extend. It binds a `FormControl`
 * object to a DOM element.
 *
 * @publicApi
 */
class NgControl extends AbstractControlDirective {
    constructor() {
        super(...arguments);
        /**
         * @description
         * The parent form for the control.
         *
         * @internal
         */
        this._parent = null;
        /**
         * @description
         * The name for the control
         */
        this.name = null;
        /**
         * @description
         * The value accessor for the control
         */
        this.valueAccessor = null;
    }
}

// DO NOT REFACTOR!
// Each status is represented by a separate function to make sure that
// advanced Closure Compiler optimizations related to property renaming
// can work correctly.
class AbstractControlStatus {
    constructor(cd) {
        this._cd = cd;
    }
    get isTouched() {
        return !!this._cd?.control?.touched;
    }
    get isUntouched() {
        return !!this._cd?.control?.untouched;
    }
    get isPristine() {
        return !!this._cd?.control?.pristine;
    }
    get isDirty() {
        return !!this._cd?.control?.dirty;
    }
    get isValid() {
        return !!this._cd?.control?.valid;
    }
    get isInvalid() {
        return !!this._cd?.control?.invalid;
    }
    get isPending() {
        return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
        // We check for the `submitted` field from `NgForm` and `FormGroupDirective` classes, but
        // we avoid instanceof checks to prevent non-tree-shakable references to those types.
        return !!this._cd?.submitted;
    }
}
const ngControlStatusHost = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
};
const ngGroupStatusHost = {
    ...ngControlStatusHost,
    '[class.ng-submitted]': 'isSubmitted',
};
/**
 * @description
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status.
 *
 * @usageNotes
 *
 * ### CSS classes applied
 *
 * The following classes are applied as the properties become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NgControlStatus extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgControlStatus, deps: [{ token: NgControl, self: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: NgControlStatus, selector: "[formControlName],[ngModel],[formControl]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending" } }, usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgControlStatus, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost }]
        }], ctorParameters: () => [{ type: NgControl, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }] }] });
/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc). On groups, this includes the additional
 * class ng-submitted.
 *
 * @see {@link NgControlStatus}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgControlStatusGroup, deps: [{ token: ControlContainer, optional: true, self: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending", "class.ng-submitted": "isSubmitted" } }, usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgControlStatusGroup, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                    host: ngGroupStatusHost
                }]
        }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }] }] });

const formControlNameExample = `
  <div [formGroup]="myGroup">
    <input formControlName="firstName">
  </div>

  In your class:

  this.myGroup = new FormGroup({
      firstName: new FormControl()
  });`;
const formGroupNameExample = `
  <div [formGroup]="myGroup">
      <div formGroupName="person">
        <input formControlName="firstName">
      </div>
  </div>

  In your class:

  this.myGroup = new FormGroup({
      person: new FormGroup({ firstName: new FormControl() })
  });`;
const formArrayNameExample = `
  <div [formGroup]="myGroup">
    <div formArrayName="cities">
      <div *ngFor="let city of cityArray.controls; index as i">
        <input [formControlName]="i">
      </div>
    </div>
  </div>

  In your class:

  this.cityArray = new FormArray([new FormControl('SF')]);
  this.myGroup = new FormGroup({
    cities: this.cityArray
  });`;
const ngModelGroupExample = `
  <form>
      <div ngModelGroup="person">
        <input [(ngModel)]="person.name" name="firstName">
      </div>
  </form>`;
const ngModelWithFormGroupExample = `
  <div [formGroup]="myGroup">
      <input formControlName="firstName">
      <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">
  </div>
`;

function controlParentException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1050 /* RuntimeErrorCode.FORM_CONTROL_NAME_MISSING_PARENT */, `formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

    Example:

    ${formControlNameExample}`);
}
function ngModelGroupException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1051 /* RuntimeErrorCode.FORM_CONTROL_NAME_INSIDE_MODEL_GROUP */, `formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents
      that also have a "form" prefix: formGroupName, formArrayName, or formGroup.

      Option 1:  Update the parent to be formGroupName (reactive form strategy)

      ${formGroupNameExample}

      Option 2: Use ngModel instead of formControlName (template-driven strategy)

      ${ngModelGroupExample}`);
}
function missingFormException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1052 /* RuntimeErrorCode.FORM_GROUP_MISSING_INSTANCE */, `formGroup expects a FormGroup instance. Please pass one in.

      Example:

      ${formControlNameExample}`);
}
function groupParentException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1053 /* RuntimeErrorCode.FORM_GROUP_NAME_MISSING_PARENT */, `formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup
    directive and pass it an existing FormGroup instance (you can create one in your class).

    Example:

    ${formGroupNameExample}`);
}
function arrayParentException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1054 /* RuntimeErrorCode.FORM_ARRAY_NAME_MISSING_PARENT */, `formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      Example:

      ${formArrayNameExample}`);
}
const disabledAttrWarning = `
  It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
  when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
  you. We recommend using this approach to avoid 'changed after checked' errors.

  Example:
  // Specify the \`disabled\` property at control creation time:
  form = new FormGroup({
    first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    last: new FormControl('Drew', Validators.required)
  });

  // Controls can also be enabled/disabled after creation:
  form.get('first')?.enable();
  form.get('last')?.disable();
`;
const asyncValidatorsDroppedWithOptsWarning = `
  It looks like you're constructing using a FormControl with both an options argument and an
  async validators argument. Mixing these arguments will cause your async validators to be dropped.
  You should either put all your validators in the options object, or in separate validators
  arguments. For example:

  // Using validators arguments
  fc = new FormControl(42, Validators.required, myAsyncValidator);

  // Using AbstractControlOptions
  fc = new FormControl(42, {validators: Validators.required, asyncValidators: myAV});

  // Do NOT mix them: async validators will be dropped!
  fc = new FormControl(42, {validators: Validators.required}, /* Oops! */ myAsyncValidator);
`;
function ngModelWarning(directiveName) {
    return `
  It looks like you're using ngModel on the same form field as ${directiveName}.
  Support for using the ngModel input property and ngModelChange event with
  reactive form directives has been deprecated in Angular v6 and will be removed
  in a future version of Angular.

  For more information on this, see our API docs here:
  https://angular.io/api/forms/${directiveName === 'formControl' ? 'FormControlDirective' : 'FormControlName'}#use-with-ngmodel
  `;
}
function describeKey(isFormGroup, key) {
    return isFormGroup ? `with name: '${key}'` : `at index: ${key}`;
}
function noControlsError(isFormGroup) {
    return `
    There are no form controls registered with this ${isFormGroup ? 'group' : 'array'} yet. If you're using ngModel,
    you may want to check next tick (e.g. use setTimeout).
  `;
}
function missingControlError(isFormGroup, key) {
    return `Cannot find form control ${describeKey(isFormGroup, key)}`;
}
function missingControlValueError(isFormGroup, key) {
    return `Must supply a value for form control ${describeKey(isFormGroup, key)}`;
}

/**
 * Reports that a control is valid, meaning that no errors exist in the input value.
 *
 * @see {@link status}
 */
const VALID = 'VALID';
/**
 * Reports that a control is invalid, meaning that an error exists in the input value.
 *
 * @see {@link status}
 */
const INVALID = 'INVALID';
/**
 * Reports that a control is pending, meaning that async validation is occurring and
 * errors are not yet available for the input value.
 *
 * @see {@link markAsPending}
 * @see {@link status}
 */
const PENDING = 'PENDING';
/**
 * Reports that a control is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * @see {@link markAsDisabled}
 * @see {@link status}
 */
const DISABLED = 'DISABLED';
/**
 * Gets validators from either an options object or given validators.
 */
function pickValidators(validatorOrOpts) {
    return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
}
/**
 * Creates validator function by combining provided validators.
 */
function coerceToValidator(validator) {
    return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
/**
 * Gets async validators from either an options object or given validators.
 */
function pickAsyncValidators(asyncValidator, validatorOrOpts) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        if (isOptionsObj(validatorOrOpts) && asyncValidator) {
            console.warn(asyncValidatorsDroppedWithOptsWarning);
        }
    }
    return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
/**
 * Creates async validator function by combining provided async validators.
 */
function coerceToAsyncValidator(asyncValidator) {
    return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) :
        asyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
    return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
        typeof validatorOrOpts === 'object';
}
function assertControlPresent(parent, isGroup, key) {
    const controls = parent.controls;
    const collection = isGroup ? Object.keys(controls) : controls;
    if (!collection.length) {
        throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1000 /* RuntimeErrorCode.NO_CONTROLS */, (typeof ngDevMode === 'undefined' || ngDevMode) ? noControlsError(isGroup) : '');
    }
    if (!controls[key]) {
        throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1001 /* RuntimeErrorCode.MISSING_CONTROL */, (typeof ngDevMode === 'undefined' || ngDevMode) ? missingControlError(isGroup, key) : '');
    }
}
function assertAllValuesPresent(control, isGroup, value) {
    control._forEachChild((_, key) => {
        if (value[key] === undefined) {
            throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1002 /* RuntimeErrorCode.MISSING_CONTROL_VALUE */, (typeof ngDevMode === 'undefined' || ngDevMode) ? missingControlValueError(isGroup, key) :
                '');
        }
    });
}
// clang-format on
/**
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * The first type parameter TValue represents the value type of the control (`control.value`).
 * The optional type parameter TRawValue  represents the raw value type (`control.getRawValue()`).
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 *
 * @publicApi
 */
class AbstractControl {
    /**
     * Initialize the AbstractControl instance.
     *
     * @param validators The function or array of functions that is used to determine the validity of
     *     this control synchronously.
     * @param asyncValidators The function or array of functions that is used to determine validity of
     *     this control asynchronously.
     */
    constructor(validators, asyncValidators) {
        /** @internal */
        this._pendingDirty = false;
        /**
         * Indicates that a control has its own pending asynchronous validation in progress.
         *
         * @internal
         */
        this._hasOwnPendingAsyncValidator = false;
        /** @internal */
        this._pendingTouched = false;
        /** @internal */
        this._onCollectionChange = () => { };
        this._parent = null;
        /**
         * A control is `pristine` if the user has not yet changed
         * the value in the UI.
         *
         * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
         * Programmatic changes to a control's value do not mark it dirty.
         */
        this.pristine = true;
        /**
         * True if the control is marked as `touched`.
         *
         * A control is marked `touched` once the user has triggered
         * a `blur` event on it.
         */
        this.touched = false;
        /** @internal */
        this._onDisabledChange = [];
        this._assignValidators(validators);
        this._assignAsyncValidators(asyncValidators);
    }
    /**
     * Returns the function that is used to determine the validity of this control synchronously.
     * If multiple validators have been added, this will be a single composed function.
     * See `Validators.compose()` for additional information.
     */
    get validator() {
        return this._composedValidatorFn;
    }
    set validator(validatorFn) {
        this._rawValidators = this._composedValidatorFn = validatorFn;
    }
    /**
     * Returns the function that is used to determine the validity of this control asynchronously.
     * If multiple validators have been added, this will be a single composed function.
     * See `Validators.compose()` for additional information.
     */
    get asyncValidator() {
        return this._composedAsyncValidatorFn;
    }
    set asyncValidator(asyncValidatorFn) {
        this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
    }
    /**
     * The parent control.
     */
    get parent() {
        return this._parent;
    }
    /**
     * A control is `valid` when its `status` is `VALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control has passed all of its validation tests,
     * false otherwise.
     */
    get valid() {
        return this.status === VALID;
    }
    /**
     * A control is `invalid` when its `status` is `INVALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control has failed one or more of its validation checks,
     * false otherwise.
     */
    get invalid() {
        return this.status === INVALID;
    }
    /**
     * A control is `pending` when its `status` is `PENDING`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control is in the process of conducting a validation check,
     * false otherwise.
     */
    get pending() {
        return this.status == PENDING;
    }
    /**
     * A control is `disabled` when its `status` is `DISABLED`.
     *
     * Disabled controls are exempt from validation checks and
     * are not included in the aggregate value of their ancestor
     * controls.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control is disabled, false otherwise.
     */
    get disabled() {
        return this.status === DISABLED;
    }
    /**
     * A control is `enabled` as long as its `status` is not `DISABLED`.
     *
     * @returns True if the control has any status other than 'DISABLED',
     * false if the status is 'DISABLED'.
     *
     * @see {@link AbstractControl.status}
     *
     */
    get enabled() {
        return this.status !== DISABLED;
    }
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
     * Programmatic changes to a control's value do not mark it dirty.
     */
    get dirty() {
        return !this.pristine;
    }
    /**
     * True if the control has not been marked as touched
     *
     * A control is `untouched` if the user has not yet triggered
     * a `blur` event on it.
     */
    get untouched() {
        return !this.touched;
    }
    /**
     * Reports the update strategy of the `AbstractControl` (meaning
     * the event on which the control updates itself).
     * Possible values: `'change'` | `'blur'` | `'submit'`
     * Default value: `'change'`
     */
    get updateOn() {
        return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
    }
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this overwrites any existing synchronous validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * If you want to add a new validator without affecting existing ones, consider
     * using `addValidators()` method instead.
     */
    setValidators(validators) {
        this._assignValidators(validators);
    }
    /**
     * Sets the asynchronous validators that are active on this control. Calling this
     * overwrites any existing asynchronous validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * If you want to add a new validator without affecting existing ones, consider
     * using `addAsyncValidators()` method instead.
     */
    setAsyncValidators(validators) {
        this._assignAsyncValidators(validators);
    }
    /**
     * Add a synchronous validator or validators to this control, without affecting other validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * Adding a validator that already exists will have no effect. If duplicate validator functions
     * are present in the `validators` array, only the first instance would be added to a form
     * control.
     *
     * @param validators The new validator function or functions to add to this control.
     */
    addValidators(validators) {
        this.setValidators(addValidators(validators, this._rawValidators));
    }
    /**
     * Add an asynchronous validator or validators to this control, without affecting other
     * validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * Adding a validator that already exists will have no effect.
     *
     * @param validators The new asynchronous validator function or functions to add to this control.
     */
    addAsyncValidators(validators) {
        this.setAsyncValidators(addValidators(validators, this._rawAsyncValidators));
    }
    /**
     * Remove a synchronous validator from this control, without affecting other validators.
     * Validators are compared by function reference; you must pass a reference to the exact same
     * validator function as the one that was originally set. If a provided validator is not found,
     * it is ignored.
     *
     * @usageNotes
     *
     * ### Reference to a ValidatorFn
     *
     * ```
     * // Reference to the RequiredValidator
     * const ctrl = new FormControl<string | null>('', Validators.required);
     * ctrl.removeValidators(Validators.required);
     *
     * // Reference to anonymous function inside MinValidator
     * const minValidator = Validators.min(3);
     * const ctrl = new FormControl<string | null>('', minValidator);
     * expect(ctrl.hasValidator(minValidator)).toEqual(true)
     * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
     *
     * ctrl.removeValidators(minValidator);
     * ```
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * @param validators The validator or validators to remove.
     */
    removeValidators(validators) {
        this.setValidators(removeValidators(validators, this._rawValidators));
    }
    /**
     * Remove an asynchronous validator from this control, without affecting other validators.
     * Validators are compared by function reference; you must pass a reference to the exact same
     * validator function as the one that was originally set. If a provided validator is not found, it
     * is ignored.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * @param validators The asynchronous validator or validators to remove.
     */
    removeAsyncValidators(validators) {
        this.setAsyncValidators(removeValidators(validators, this._rawAsyncValidators));
    }
    /**
     * Check whether a synchronous validator function is present on this control. The provided
     * validator must be a reference to the exact same function that was provided.
     *
     * @usageNotes
     *
     * ### Reference to a ValidatorFn
     *
     * ```
     * // Reference to the RequiredValidator
     * const ctrl = new FormControl<number | null>(0, Validators.required);
     * expect(ctrl.hasValidator(Validators.required)).toEqual(true)
     *
     * // Reference to anonymous function inside MinValidator
     * const minValidator = Validators.min(3);
     * const ctrl = new FormControl<number | null>(0, minValidator);
     * expect(ctrl.hasValidator(minValidator)).toEqual(true)
     * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
     * ```
     *
     * @param validator The validator to check for presence. Compared by function reference.
     * @returns Whether the provided validator was found on this control.
     */
    hasValidator(validator) {
        return hasValidator(this._rawValidators, validator);
    }
    /**
     * Check whether an asynchronous validator function is present on this control. The provided
     * validator must be a reference to the exact same function that was provided.
     *
     * @param validator The asynchronous validator to check for presence. Compared by function
     *     reference.
     * @returns Whether the provided asynchronous validator was found on this control.
     */
    hasAsyncValidator(validator) {
        return hasValidator(this._rawAsyncValidators, validator);
    }
    /**
     * Empties out the synchronous validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearValidators() {
        this.validator = null;
    }
    /**
     * Empties out the async validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearAsyncValidators() {
        this.asyncValidator = null;
    }
    /**
     * Marks the control as `touched`. A control is touched by focus and
     * blur events that do not change the value.
     *
     * @see {@link markAsUntouched()}
     * @see {@link markAsDirty()}
     * @see {@link markAsPristine()}
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsTouched(opts = {}) {
        this.touched = true;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsTouched(opts);
        }
    }
    /**
     * Marks the control and all its descendant controls as `touched`.
     * @see {@link markAsTouched()}
     */
    markAllAsTouched() {
        this.markAsTouched({ onlySelf: true });
        this._forEachChild((control) => control.markAllAsTouched());
    }
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, also marks all children as `untouched`
     * and recalculates the `touched` status of all parent controls.
     *
     * @see {@link markAsTouched()}
     * @see {@link markAsDirty()}
     * @see {@link markAsPristine()}
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after the marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsUntouched(opts = {}) {
        this.touched = false;
        this._pendingTouched = false;
        this._forEachChild((control) => {
            control.markAsUntouched({ onlySelf: true });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /**
     * Marks the control as `dirty`. A control becomes dirty when
     * the control's value is changed through the UI; compare `markAsTouched`.
     *
     * @see {@link markAsTouched()}
     * @see {@link markAsUntouched()}
     * @see {@link markAsPristine()}
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsDirty(opts = {}) {
        this.pristine = false;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsDirty(opts);
        }
    }
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, marks all children as `pristine`,
     * and recalculates the `pristine` status of all parent
     * controls.
     *
     * @see {@link markAsTouched()}
     * @see {@link markAsUntouched()}
     * @see {@link markAsDirty()}
     *
     * @param opts Configuration options that determine how the control emits events after
     * marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsPristine(opts = {}) {
        this.pristine = true;
        this._pendingDirty = false;
        this._forEachChild((control) => {
            control.markAsPristine({ onlySelf: true });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /**
     * Marks the control as `pending`.
     *
     * A control is pending while the control performs async validation.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configuration options that determine how the control propagates changes and
     * emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
     * observable emits an event with the latest status the control is marked pending.
     * When false, no events are emitted.
     *
     */
    markAsPending(opts = {}) {
        this.status = PENDING;
        if (opts.emitEvent !== false) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsPending(opts);
        }
    }
    /**
     * Disables the control. This means the control is exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children are also disabled.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configuration options that determine how the control propagates
     * changes and emits events after the control is disabled.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is disabled.
     * When false, no events are emitted.
     */
    disable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = DISABLED;
        this.errors = null;
        this._forEachChild((control) => {
            control.disable({ ...opts, onlySelf: true });
        });
        this._updateValue();
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        this._updateAncestors({ ...opts, skipPristineCheck });
        this._onDisabledChange.forEach((changeFn) => changeFn(true));
    }
    /**
     * Enables the control. This means the control is included in validation checks and
     * the aggregate value of its parent. Its status recalculates based on its value and
     * its validators.
     *
     * By default, if the control has children, all children are enabled.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configure options that control how the control propagates changes and
     * emits events when marked as untouched
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is enabled.
     * When false, no events are emitted.
     */
    enable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = VALID;
        this._forEachChild((control) => {
            control.enable({ ...opts, onlySelf: true });
        });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors({ ...opts, skipPristineCheck });
        this._onDisabledChange.forEach((changeFn) => changeFn(false));
    }
    _updateAncestors(opts) {
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
            if (!opts.skipPristineCheck) {
                this._parent._updatePristine();
            }
            this._parent._updateTouched();
        }
    }
    /**
     * Sets the parent of the control
     *
     * @param parent The new parent.
     */
    setParent(parent) {
        this._parent = parent;
    }
    /**
     * The raw value of this control. For most control implementations, the raw value will include
     * disabled children.
     */
    getRawValue() {
        return this.value;
    }
    /**
     * Recalculates the value and validation status of the control.
     *
     * By default, it also updates the value and validity of its ancestors.
     *
     * @param opts Configuration options determine how the control propagates changes and emits events
     * after updates and validity checks are applied.
     * * `onlySelf`: When true, only update this control. When false or not supplied,
     * update all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is updated.
     * When false, no events are emitted.
     */
    updateValueAndValidity(opts = {}) {
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
            this._cancelExistingSubscription();
            this.errors = this._runValidator();
            this.status = this._calculateStatus();
            if (this.status === VALID || this.status === PENDING) {
                this._runAsyncValidator(opts.emitEvent);
            }
        }
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
        }
    }
    /** @internal */
    _updateTreeValidity(opts = { emitEvent: true }) {
        this._forEachChild((ctrl) => ctrl._updateTreeValidity(opts));
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
    }
    _setInitialStatus() {
        this.status = this._allControlsDisabled() ? DISABLED : VALID;
    }
    _runValidator() {
        return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(emitEvent) {
        if (this.asyncValidator) {
            this.status = PENDING;
            this._hasOwnPendingAsyncValidator = true;
            const obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription = obs.subscribe((errors) => {
                this._hasOwnPendingAsyncValidator = false;
                // This will trigger the recalculation of the validation status, which depends on
                // the state of the asynchronous validation (whether it is in progress or not). So, it is
                // necessary that we have updated the `_hasOwnPendingAsyncValidator` boolean flag first.
                this.setErrors(errors, { emitEvent });
            });
        }
    }
    _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
            this._hasOwnPendingAsyncValidator = false;
        }
    }
    /**
     * Sets errors on a form control when running validations manually, rather than automatically.
     *
     * Calling `setErrors` also updates the validity of the parent control.
     *
     * @param opts Configuration options that determine how the control propagates
     * changes and emits events after the control errors are set.
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
     * observable emits an event after the errors are set.
     *
     * @usageNotes
     *
     * ### Manually set the errors for a control
     *
     * ```
     * const login = new FormControl('someLogin');
     * login.setErrors({
     *   notUnique: true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({ notUnique: true });
     *
     * login.setValue('someOtherLogin');
     *
     * expect(login.valid).toEqual(true);
     * ```
     */
    setErrors(errors, opts = {}) {
        this.errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false);
    }
    /**
     * Retrieves a child control given the control's name or path.
     *
     * @param path A dot-delimited string or array of string/number values that define the path to the
     * control. If a string is provided, passing it as a string literal will result in improved type
     * information. Likewise, if an array is provided, passing it `as const` will cause improved type
     * information to be available.
     *
     * @usageNotes
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name'] as const);` // `as const` gives improved typings
     *
     * ### Retrieve a control in a FormArray
     *
     * When accessing an element inside a FormArray, you can use an element index.
     * For example, to get a `price` control from the first element in an `items` array you can use:
     *
     * * `this.form.get('items.0.price');`
     *
     * -OR-
     *
     * * `this.form.get(['items', 0, 'price']);`
     */
    get(path) {
        let currPath = path;
        if (currPath == null)
            return null;
        if (!Array.isArray(currPath))
            currPath = currPath.split('.');
        if (currPath.length === 0)
            return null;
        return currPath.reduce((control, name) => control && control._find(name), this);
    }
    /**
     * @description
     * Reports error data for the control with the given path.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * @returns error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode, path) {
        const control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
    }
    /**
     * @description
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * If no path is given, this method checks for the error on the current control.
     *
     * @returns whether the given error is present in the control at the given path.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode, path) {
        return !!this.getError(errorCode, path);
    }
    /**
     * Retrieves the top-level ancestor of this control.
     */
    get root() {
        let x = this;
        while (x._parent) {
            x = x._parent;
        }
        return x;
    }
    /** @internal */
    _updateControlsErrors(emitEvent) {
        this.status = this._calculateStatus();
        if (emitEvent) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent);
        }
    }
    /** @internal */
    _initObservables() {
        this.valueChanges = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        this.statusChanges = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    }
    _calculateStatus() {
        if (this._allControlsDisabled())
            return DISABLED;
        if (this.errors)
            return INVALID;
        if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING))
            return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
            return INVALID;
        return VALID;
    }
    /** @internal */
    _anyControlsHaveStatus(status) {
        return this._anyControls((control) => control.status === status);
    }
    /** @internal */
    _anyControlsDirty() {
        return this._anyControls((control) => control.dirty);
    }
    /** @internal */
    _anyControlsTouched() {
        return this._anyControls((control) => control.touched);
    }
    /** @internal */
    _updatePristine(opts = {}) {
        this.pristine = !this._anyControlsDirty();
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /** @internal */
    _updateTouched(opts = {}) {
        this.touched = this._anyControlsTouched();
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /** @internal */
    _registerOnCollectionChange(fn) {
        this._onCollectionChange = fn;
    }
    /** @internal */
    _setUpdateStrategy(opts) {
        if (isOptionsObj(opts) && opts.updateOn != null) {
            this._updateOn = opts.updateOn;
        }
    }
    /**
     * Check to see if parent has been marked artificially dirty.
     *
     * @internal
     */
    _parentMarkedDirty(onlySelf) {
        const parentDirty = this._parent && this._parent.dirty;
        return !onlySelf && !!parentDirty && !this._parent._anyControlsDirty();
    }
    /** @internal */
    _find(name) {
        return null;
    }
    /**
     * Internal implementation of the `setValidators` method. Needs to be separated out into a
     * different method, because it is called in the constructor and it can break cases where
     * a control is extended.
     */
    _assignValidators(validators) {
        this._rawValidators = Array.isArray(validators) ? validators.slice() : validators;
        this._composedValidatorFn = coerceToValidator(this._rawValidators);
    }
    /**
     * Internal implementation of the `setAsyncValidators` method. Needs to be separated out into a
     * different method, because it is called in the constructor and it can break cases where
     * a control is extended.
     */
    _assignAsyncValidators(validators) {
        this._rawAsyncValidators = Array.isArray(validators) ? validators.slice() : validators;
        this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
    }
}

/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the four fundamental building blocks used to define forms in Angular,
 * along with `FormControl`, `FormArray`, and `FormRecord`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * `FormGroup` is intended for use cases where the keys are known ahead of time.
 * If you need to dynamically add and remove controls, use {@link FormRecord} instead.
 *
 * `FormGroup` accepts an optional type parameter `TControl`, which is an object type with inner
 * control types as values.
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * ### The type argument, and optional controls
 *
 * `FormGroup` accepts one generic argument, which is an object containing its inner controls.
 * This type will usually be inferred automatically, but you can always specify it explicitly if you
 * wish.
 *
 * If you have controls that are optional (i.e. they can be removed, you can use the `?` in the
 * type):
 *
 * ```
 * const form = new FormGroup<{
 *   first: FormControl<string|null>,
 *   middle?: FormControl<string|null>, // Middle name is optional.
 *   last: FormControl<string|null>,
 * }>({
 *   first: new FormControl('Nancy'),
 *   last: new FormControl('Drew'),
 * });
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * You include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
 * ```
 *
 * ### Set the updateOn property for all controls in a form group
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 *
 * ### Using a FormGroup with optional controls
 *
 * It is possible to have optional controls in a FormGroup. An optional control can be removed later
 * using `removeControl`, and can be omitted when calling `reset`. Optional controls must be
 * declared optional in the group's type.
 *
 * ```ts
 * const c = new FormGroup<{one?: FormControl<string>}>({
 *   one: new FormControl('')
 * });
 * ```
 *
 * Notice that `c.value.one` has type `string|null|undefined`. This is because calling `c.reset({})`
 * without providing the optional key `one` will cause it to become `null`.
 *
 * @publicApi
 */
class FormGroup extends AbstractControl {
    /**
     * Creates a new `FormGroup` instance.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        (typeof ngDevMode === 'undefined' || ngDevMode) && validateFormGroupControls(controls);
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
            // so we set `emitEvent` to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
    }
    registerControl(name, control) {
        if (this.controls[name])
            return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
    }
    addControl(name, control, options = {}) {
        this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Remove a control from this group. In a strongly-typed group, required controls cannot be
     * removed.
     *
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to remove from the collection
     * @param options Specifies whether this FormGroup instance should emit events after a
     *     control is removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * removed. When false, no events are emitted.
     */
    removeControl(name, options = {}) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    setControl(name, control, options = {}) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    contains(controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    }
    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * @usageNotes
     * ### Set the complete value for the form group
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl(),
     *   last: new FormControl()
     * });
     *
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.setValue({first: 'Nancy', last: 'Drew'});
     * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     * ```
     *
     * @throws When strict checks fail, such as setting the value of a control
     * that doesn't exist or if you exclude a value of a control that does exist.
     *
     * @param value The new value for the control that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     */
    setValue(value, options = {}) {
        assertAllValuesPresent(this, true, value);
        Object.keys(value).forEach(name => {
            assertControlPresent(this, true, name);
            this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormGroup`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     * @usageNotes
     * ### Patch the value for a form group
     *
     * ```
     * const form = new FormGroup({
     *    first: new FormControl(),
     *    last: new FormControl()
     * });
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.patchValue({first: 'Nancy'});
     * console.log(form.value);   // {first: 'Nancy', last: null}
     * ```
     *
     * @param value The object that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes and
     * emits events after the value is patched.
     * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control value
     * is updated. When false, no events are emitted. The configuration options are passed to
     * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
        // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
        // `patchValue` can be called recursively and inner data structures might have these values, so
        // we just ignore such cases when a field containing FormGroup instance receives `null` or
        // `undefined` as a value.
        if (value == null /* both `null` and `undefined` */)
            return;
        Object.keys(value).forEach(name => {
            // The compiler cannot see through the uninstantiated conditional type of `this.controls`, so
            // `as any` is required.
            const control = this.controls[name];
            if (control) {
                control.patchValue(
                /* Guaranteed to be present, due to the outer forEach. */ value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
     * the value of all descendants to their default values, or null if no defaults were provided.
     *
     * You reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * is a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * @param value Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the group is reset.
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * @usageNotes
     *
     * ### Reset the form group values
     *
     * ```ts
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * console.log(form.value);  // {first: 'first name', last: 'last name'}
     *
     * form.reset({ first: 'name', last: 'last name' });
     *
     * console.log(form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * ### Reset the form group values and disabled status
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(form.value);  // {last: 'last'}
     * console.log(form.get('first').status);  // 'DISABLED'
     * ```
     */
    reset(value = {}, options = {}) {
        this._forEachChild((control, name) => {
            control.reset(value ? value[name] : null, { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     */
    getRawValue() {
        return this._reduceChildren({}, (acc, control, name) => {
            acc[name] = control.getRawValue();
            return acc;
        });
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
            return child._syncPendingControls() ? true : updated;
        });
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _forEachChild(cb) {
        Object.keys(this.controls).forEach(key => {
            // The list of controls can change (for ex. controls might be removed) while the loop
            // is running (as a result of invoking Forms API in `valueChanges` subscription), so we
            // have to null check before invoking the callback.
            const control = this.controls[key];
            control && cb(control, key);
        });
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => {
            control.setParent(this);
            control._registerOnCollectionChange(this._onCollectionChange);
        });
    }
    /** @internal */
    _updateValue() {
        this.value = this._reduceValue();
    }
    /** @internal */
    _anyControls(condition) {
        for (const [controlName, control] of Object.entries(this.controls)) {
            if (this.contains(controlName) && condition(control)) {
                return true;
            }
        }
        return false;
    }
    /** @internal */
    _reduceValue() {
        let acc = {};
        return this._reduceChildren(acc, (acc, control, name) => {
            if (control.enabled || this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        });
    }
    /** @internal */
    _reduceChildren(initValue, fn) {
        let res = initValue;
        this._forEachChild((control, name) => {
            res = fn(res, control, name);
        });
        return res;
    }
    /** @internal */
    _allControlsDisabled() {
        for (const controlName of Object.keys(this.controls)) {
            if (this.controls[controlName].enabled) {
                return false;
            }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    }
    /** @internal */
    _find(name) {
        return this.controls.hasOwnProperty(name) ?
            this.controls[name] :
            null;
    }
}
/**
 * Will validate that none of the controls has a key with a dot
 * Throws other wise
 */
function validateFormGroupControls(controls) {
    const invalidKeys = Object.keys(controls).filter(key => key.includes('.'));
    if (invalidKeys.length > 0) {
        // TODO: make this an error once there are no more uses in G3
        console.warn(`FormGroup keys cannot include \`.\`, please replace the keys for: ${invalidKeys.join(',')}.`);
    }
}
const UntypedFormGroup = FormGroup;
/**
 * @description
 * Asserts that the given control is an instance of `FormGroup`
 *
 * @publicApi
 */
const isFormGroup = (control) => control instanceof FormGroup;
/**
 * Tracks the value and validity state of a collection of `FormControl` instances, each of which has
 * the same value type.
 *
 * `FormRecord` is very similar to {@link FormGroup}, except it can be used with a dynamic keys,
 * with controls added and removed as needed.
 *
 * `FormRecord` accepts one generic argument, which describes the type of the controls it contains.
 *
 * @usageNotes
 *
 * ```
 * let numbers = new FormRecord({bill: new FormControl('415-123-456')});
 * numbers.addControl('bob', new FormControl('415-234-567'));
 * numbers.removeControl('bill');
 * ```
 *
 * @publicApi
 */
class FormRecord extends FormGroup {
}
/**
 * @description
 * Asserts that the given control is an instance of `FormRecord`
 *
 * @publicApi
 */
const isFormRecord = (control) => control instanceof FormRecord;

/**
 * Token to provide to allow SetDisabledState to always be called when a CVA is added, regardless of
 * whether the control is disabled or enabled.
 *
 * @see {@link FormsModule#withconfig}
 */
const CALL_SET_DISABLED_STATE = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('CallSetDisabledState', { providedIn: 'root', factory: () => setDisabledStateDefault });
/**
 * Whether to use the fixed setDisabledState behavior by default.
 */
const setDisabledStateDefault = 'always';
function controlPath(name, parent) {
    return [...parent.path, name];
}
/**
 * Links a Form control and a Form directive by setting up callbacks (such as `onChange`) on both
 * instances. This function is typically invoked when form directive is being initialized.
 *
 * @param control Form control instance that should be linked.
 * @param dir Directive that should be linked with a given control.
 */
function setUpControl(control, dir, callSetDisabledState = setDisabledStateDefault) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        if (!control)
            _throwError(dir, 'Cannot find control with');
        if (!dir.valueAccessor)
            _throwMissingValueAccessorError(dir);
    }
    setUpValidators(control, dir);
    dir.valueAccessor.writeValue(control.value);
    // The legacy behavior only calls the CVA's `setDisabledState` if the control is disabled.
    // If the `callSetDisabledState` option is set to `always`, then this bug is fixed and
    // the method is always called.
    if (control.disabled || callSetDisabledState === 'always') {
        dir.valueAccessor.setDisabledState?.(control.disabled);
    }
    setUpViewChangePipeline(control, dir);
    setUpModelChangePipeline(control, dir);
    setUpBlurPipeline(control, dir);
    setUpDisabledChangeHandler(control, dir);
}
/**
 * Reverts configuration performed by the `setUpControl` control function.
 * Effectively disconnects form control with a given form directive.
 * This function is typically invoked when corresponding form directive is being destroyed.
 *
 * @param control Form control which should be cleaned up.
 * @param dir Directive that should be disconnected from a given control.
 * @param validateControlPresenceOnChange Flag that indicates whether onChange handler should
 *     contain asserts to verify that it's not called once directive is destroyed. We need this flag
 *     to avoid potentially breaking changes caused by better control cleanup introduced in #39235.
 */
function cleanUpControl(control, dir, validateControlPresenceOnChange = true) {
    const noop = () => {
        if (validateControlPresenceOnChange && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            _noControlError(dir);
        }
    };
    // The `valueAccessor` field is typically defined on FromControl and FormControlName directive
    // instances and there is a logic in `selectValueAccessor` function that throws if it's not the
    // case. We still check the presence of `valueAccessor` before invoking its methods to make sure
    // that cleanup works correctly if app code or tests are setup to ignore the error thrown from
    // `selectValueAccessor`. See https://github.com/angular/angular/issues/40521.
    if (dir.valueAccessor) {
        dir.valueAccessor.registerOnChange(noop);
        dir.valueAccessor.registerOnTouched(noop);
    }
    cleanUpValidators(control, dir);
    if (control) {
        dir._invokeOnDestroyCallbacks();
        control._registerOnCollectionChange(() => { });
    }
}
function registerOnValidatorChange(validators, onChange) {
    validators.forEach((validator) => {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(onChange);
    });
}
/**
 * Sets up disabled change handler function on a given form control if ControlValueAccessor
 * associated with a given directive instance supports the `setDisabledState` call.
 *
 * @param control Form control where disabled change handler should be setup.
 * @param dir Corresponding directive instance associated with this control.
 */
function setUpDisabledChangeHandler(control, dir) {
    if (dir.valueAccessor.setDisabledState) {
        const onDisabledChange = (isDisabled) => {
            dir.valueAccessor.setDisabledState(isDisabled);
        };
        control.registerOnDisabledChange(onDisabledChange);
        // Register a callback function to cleanup disabled change handler
        // from a control instance when a directive is destroyed.
        dir._registerOnDestroy(() => {
            control._unregisterOnDisabledChange(onDisabledChange);
        });
    }
}
/**
 * Sets up sync and async directive validators on provided form control.
 * This function merges validators from the directive into the validators of the control.
 *
 * @param control Form control where directive validators should be setup.
 * @param dir Directive instance that contains validators to be setup.
 */
function setUpValidators(control, dir) {
    const validators = getControlValidators(control);
    if (dir.validator !== null) {
        control.setValidators(mergeValidators(validators, dir.validator));
    }
    else if (typeof validators === 'function') {
        // If sync validators are represented by a single validator function, we force the
        // `Validators.compose` call to happen by executing the `setValidators` function with
        // an array that contains that function. We need this to avoid possible discrepancies in
        // validators behavior, so sync validators are always processed by the `Validators.compose`.
        // Note: we should consider moving this logic inside the `setValidators` function itself, so we
        // have consistent behavior on AbstractControl API level. The same applies to the async
        // validators logic below.
        control.setValidators([validators]);
    }
    const asyncValidators = getControlAsyncValidators(control);
    if (dir.asyncValidator !== null) {
        control.setAsyncValidators(mergeValidators(asyncValidators, dir.asyncValidator));
    }
    else if (typeof asyncValidators === 'function') {
        control.setAsyncValidators([asyncValidators]);
    }
    // Re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    const onValidatorChange = () => control.updateValueAndValidity();
    registerOnValidatorChange(dir._rawValidators, onValidatorChange);
    registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
}
/**
 * Cleans up sync and async directive validators on provided form control.
 * This function reverts the setup performed by the `setUpValidators` function, i.e.
 * removes directive-specific validators from a given control instance.
 *
 * @param control Form control from where directive validators should be removed.
 * @param dir Directive instance that contains validators to be removed.
 * @returns true if a control was updated as a result of this action.
 */
function cleanUpValidators(control, dir) {
    let isControlUpdated = false;
    if (control !== null) {
        if (dir.validator !== null) {
            const validators = getControlValidators(control);
            if (Array.isArray(validators) && validators.length > 0) {
                // Filter out directive validator function.
                const updatedValidators = validators.filter((validator) => validator !== dir.validator);
                if (updatedValidators.length !== validators.length) {
                    isControlUpdated = true;
                    control.setValidators(updatedValidators);
                }
            }
        }
        if (dir.asyncValidator !== null) {
            const asyncValidators = getControlAsyncValidators(control);
            if (Array.isArray(asyncValidators) && asyncValidators.length > 0) {
                // Filter out directive async validator function.
                const updatedAsyncValidators = asyncValidators.filter((asyncValidator) => asyncValidator !== dir.asyncValidator);
                if (updatedAsyncValidators.length !== asyncValidators.length) {
                    isControlUpdated = true;
                    control.setAsyncValidators(updatedAsyncValidators);
                }
            }
        }
    }
    // Clear onValidatorChange callbacks by providing a noop function.
    const noop = () => { };
    registerOnValidatorChange(dir._rawValidators, noop);
    registerOnValidatorChange(dir._rawAsyncValidators, noop);
    return isControlUpdated;
}
function setUpViewChangePipeline(control, dir) {
    dir.valueAccessor.registerOnChange((newValue) => {
        control._pendingValue = newValue;
        control._pendingChange = true;
        control._pendingDirty = true;
        if (control.updateOn === 'change')
            updateControl(control, dir);
    });
}
function setUpBlurPipeline(control, dir) {
    dir.valueAccessor.registerOnTouched(() => {
        control._pendingTouched = true;
        if (control.updateOn === 'blur' && control._pendingChange)
            updateControl(control, dir);
        if (control.updateOn !== 'submit')
            control.markAsTouched();
    });
}
function updateControl(control, dir) {
    if (control._pendingDirty)
        control.markAsDirty();
    control.setValue(control._pendingValue, { emitModelToViewChange: false });
    dir.viewToModelUpdate(control._pendingValue);
    control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
    const onChange = (newValue, emitModelEvent) => {
        // control -> view
        dir.valueAccessor.writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    };
    control.registerOnChange(onChange);
    // Register a callback function to cleanup onChange handler
    // from a control instance when a directive is destroyed.
    dir._registerOnDestroy(() => {
        control._unregisterOnChange(onChange);
    });
}
/**
 * Links a FormGroup or FormArray instance and corresponding Form directive by setting up validators
 * present in the view.
 *
 * @param control FormGroup or FormArray instance that should be linked.
 * @param dir Directive that provides view validators.
 */
function setUpFormContainer(control, dir) {
    if (control == null && (typeof ngDevMode === 'undefined' || ngDevMode))
        _throwError(dir, 'Cannot find control with');
    setUpValidators(control, dir);
}
/**
 * Reverts the setup performed by the `setUpFormContainer` function.
 *
 * @param control FormGroup or FormArray instance that should be cleaned up.
 * @param dir Directive that provided view validators.
 * @returns true if a control was updated as a result of this action.
 */
function cleanUpFormContainer(control, dir) {
    return cleanUpValidators(control, dir);
}
function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
function _throwError(dir, message) {
    const messageEnd = _describeControlLocation(dir);
    throw new Error(`${message} ${messageEnd}`);
}
function _describeControlLocation(dir) {
    const path = dir.path;
    if (path && path.length > 1)
        return `path: '${path.join(' -> ')}'`;
    if (path?.[0])
        return `name: '${path}'`;
    return 'unspecified name attribute';
}
function _throwMissingValueAccessorError(dir) {
    const loc = _describeControlLocation(dir);
    throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](-1203 /* RuntimeErrorCode.NG_MISSING_VALUE_ACCESSOR */, `No value accessor for form control ${loc}.`);
}
function _throwInvalidValueAccessorError(dir) {
    const loc = _describeControlLocation(dir);
    throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1200 /* RuntimeErrorCode.NG_VALUE_ACCESSOR_NOT_PROVIDED */, `Value accessor was not provided as an array for form control with ${loc}. ` +
        `Check that the \`NG_VALUE_ACCESSOR\` token is configured as a \`multi: true\` provider.`);
}
function isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model'))
        return false;
    const change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !Object.is(viewModel, change.currentValue);
}
function isBuiltInAccessor(valueAccessor) {
    // Check if a given value accessor is an instance of a class that directly extends
    // `BuiltInControlValueAccessor` one.
    return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
}
function syncPendingControls(form, directives) {
    form._syncPendingControls();
    directives.forEach((dir) => {
        const control = dir.control;
        if (control.updateOn === 'submit' && control._pendingChange) {
            dir.viewToModelUpdate(control._pendingValue);
            control._pendingChange = false;
        }
    });
}
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
function selectValueAccessor(dir, valueAccessors) {
    if (!valueAccessors)
        return null;
    if (!Array.isArray(valueAccessors) && (typeof ngDevMode === 'undefined' || ngDevMode))
        _throwInvalidValueAccessorError(dir);
    let defaultAccessor = undefined;
    let builtinAccessor = undefined;
    let customAccessor = undefined;
    valueAccessors.forEach((v) => {
        if (v.constructor === DefaultValueAccessor) {
            defaultAccessor = v;
        }
        else if (isBuiltInAccessor(v)) {
            if (builtinAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
                _throwError(dir, 'More than one built-in value accessor matches form control with');
            builtinAccessor = v;
        }
        else {
            if (customAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
                _throwError(dir, 'More than one custom value accessor matches form control with');
            customAccessor = v;
        }
    });
    if (customAccessor)
        return customAccessor;
    if (builtinAccessor)
        return builtinAccessor;
    if (defaultAccessor)
        return defaultAccessor;
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        _throwError(dir, 'No valid value accessor for form control with');
    }
    return null;
}
function removeListItem$1(list, el) {
    const index = list.indexOf(el);
    if (index > -1)
        list.splice(index, 1);
}
// TODO(kara): remove after deprecation period
function _ngModelWarning(name, type, instance, warningConfig) {
    if (warningConfig === 'never')
        return;
    if (((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce) ||
        (warningConfig === 'always' && !instance._ngModelWarningSent)) {
        console.warn(ngModelWarning(name));
        type._ngModelWarningSentOnce = true;
        instance._ngModelWarningSent = true;
    }
}

const formDirectiveProvider$1 = {
    provide: ControlContainer,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => NgForm)
};
const resolvedPromise$1 = (() => Promise.resolve())();
/**
 * @description
 * Creates a top-level `FormGroup` instance and binds it to a form
 * to track aggregate form value and validation status.
 *
 * As soon as you import the `FormsModule`, this directive becomes active by default on
 * all `<form>` tags.  You don't need to add a special selector.
 *
 * You optionally export the directive into a local template variable using `ngForm` as the key
 * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
 * `FormGroup` instance are duplicated on the directive itself, so a reference to it
 * gives you access to the aggregate value and validity status of the form, as well as
 * user interaction properties like `dirty` and `touched`.
 *
 * To register child controls with the form, use `NgModel` with a `name`
 * attribute. You may use `NgModelGroup` to create sub-groups within the form.
 *
 * If necessary, listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission. The `ngSubmit` event emits the original form
 * submission event.
 *
 * In template driven forms, all `<form>` tags are automatically tagged as `NgForm`.
 * To import the `FormsModule` but skip its usage in some forms,
 * for example, to use native HTML5 validation, add the `ngNoForm` and the `<form>`
 * tags won't create an `NgForm` directive. In reactive forms, using `ngNoForm` is
 * unnecessary because the `<form>` tags are inert. In that case, you would
 * refrain from using the `formGroup` directive.
 *
 * @usageNotes
 *
 * ### Listening for form submission
 *
 * The following example shows how to capture the form values from the "ngSubmit" event.
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Setting the update options
 *
 * The following example shows you how to change the "updateOn" option from its default using
 * ngFormOptions.
 *
 * ```html
 * <form [ngFormOptions]="{updateOn: 'blur'}">
 *    <input name="one" ngModel>  <!-- this ngModel will update on blur -->
 * </form>
 * ```
 *
 * ### Native DOM validation UI
 *
 * In order to prevent the native DOM form validation UI from interfering with Angular's form
 * validation, Angular automatically adds the `novalidate` attribute on any `<form>` whenever
 * `FormModule` or `ReactiveFormModule` are imported into the application.
 * If you want to explicitly enable native DOM validation UI with Angular forms, you can add the
 * `ngNativeValidate` attribute to the `<form>` element:
 *
 * ```html
 * <form ngNativeValidate>
 *   ...
 * </form>
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
class NgForm extends ControlContainer {
    constructor(validators, asyncValidators, callSetDisabledState) {
        super();
        this.callSetDisabledState = callSetDisabledState;
        /**
         * @description
         * Returns whether the form submission has been triggered.
         */
        this.submitted = false;
        this._directives = new Set();
        /**
         * @description
         * Event emitter for the "ngSubmit" event
         */
        this.ngSubmit = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        this.form =
            new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
    }
    /** @nodoc */
    ngAfterViewInit() {
        this._setUpdateStrategy();
    }
    /**
     * @description
     * The directive instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * The internal `FormGroup` instance.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it is always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Returns a map of the controls in this group.
     */
    get controls() {
        return this.form.controls;
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `NgModel` directive instance.
     */
    addControl(dir) {
        resolvedPromise$1.then(() => {
            const container = this._findContainer(dir.path);
            dir.control =
                container.registerControl(dir.name, dir.control);
            setUpControl(dir.control, dir, this.callSetDisabledState);
            dir.control.updateValueAndValidity({ emitEvent: false });
            this._directives.add(dir);
        });
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `NgModel` directive.
     *
     * @param dir The `NgModel` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `NgModel` instance from the internal list of directives
     *
     * @param dir The `NgModel` directive instance.
     */
    removeControl(dir) {
        resolvedPromise$1.then(() => {
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
            this._directives.delete(dir);
        });
    }
    /**
     * @description
     * Adds a new `NgModelGroup` directive instance to the form.
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    addFormGroup(dir) {
        resolvedPromise$1.then(() => {
            const container = this._findContainer(dir.path);
            const group = new FormGroup({});
            setUpFormContainer(group, dir);
            container.registerControl(dir.name, group);
            group.updateValueAndValidity({ emitEvent: false });
        });
    }
    /**
     * @description
     * Removes the `NgModelGroup` directive instance from the form.
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    removeFormGroup(dir) {
        resolvedPromise$1.then(() => {
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
        });
    }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `NgControl` directive.
     *
     * @param dir The `NgControl` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        resolvedPromise$1.then(() => {
            const ctrl = this.form.get(dir.path);
            ctrl.setValue(value);
        });
    }
    /**
     * @description
     * Sets the value for this `FormGroup`.
     *
     * @param value The new value
     */
    setValue(value) {
        this.control.setValue(value);
    }
    /**
     * @description
     * Method called when the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this._directives);
        this.ngSubmit.emit($event);
        // Forms with `method="dialog"` have some special behavior
        // that won't reload the page and that shouldn't be prevented.
        return $event?.target?.method === 'dialog';
    }
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset() {
        this.resetForm();
    }
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        this.submitted = false;
    }
    _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
            this.form._updateOn = this.options.updateOn;
        }
    }
    _findContainer(path) {
        path.pop();
        return path.length ? this.form.get(path) : this.form;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgForm, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: { options: ["ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider$1], exportAs: ["ngForm"], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgForm, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]',
                    providers: [formDirectiveProvider$1],
                    host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                    outputs: ['ngSubmit'],
                    exportAs: 'ngForm'
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [CALL_SET_DISABLED_STATE]
                }] }], propDecorators: { options: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['ngFormOptions']
            }] } });

function removeListItem(list, el) {
    const index = list.indexOf(el);
    if (index > -1)
        list.splice(index, 1);
}

function isFormControlState(formState) {
    return typeof formState === 'object' && formState !== null &&
        Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
}
const FormControl = (class FormControl extends AbstractControl {
    constructor(
    // formState and defaultValue will only be null if T is nullable
    formState = null, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        /** @publicApi */
        this.defaultValue = null;
        /** @internal */
        this._onChange = [];
        /** @internal */
        this._pendingChange = false;
        this._applyFormState(formState);
        this._setUpdateStrategy(validatorOrOpts);
        this._initObservables();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`.
            // The status should be broadcasted via the `statusChanges` observable, so we set
            // `emitEvent` to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
        if (isOptionsObj(validatorOrOpts) &&
            (validatorOrOpts.nonNullable || validatorOrOpts.initialValueIsDefault)) {
            if (isFormControlState(formState)) {
                this.defaultValue = formState.value;
            }
            else {
                this.defaultValue = formState;
            }
        }
    }
    setValue(value, options = {}) {
        this.value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
            this._onChange.forEach((changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
        }
        this.updateValueAndValidity(options);
    }
    patchValue(value, options = {}) {
        this.setValue(value, options);
    }
    reset(formState = this.defaultValue, options = {}) {
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
    }
    /**  @internal */
    _updateValue() { }
    /**  @internal */
    _anyControls(condition) {
        return false;
    }
    /**  @internal */
    _allControlsDisabled() {
        return this.disabled;
    }
    registerOnChange(fn) {
        this._onChange.push(fn);
    }
    /** @internal */
    _unregisterOnChange(fn) {
        removeListItem(this._onChange, fn);
    }
    registerOnDisabledChange(fn) {
        this._onDisabledChange.push(fn);
    }
    /** @internal */
    _unregisterOnDisabledChange(fn) {
        removeListItem(this._onDisabledChange, fn);
    }
    /** @internal */
    _forEachChild(cb) { }
    /** @internal */
    _syncPendingControls() {
        if (this.updateOn === 'submit') {
            if (this._pendingDirty)
                this.markAsDirty();
            if (this._pendingTouched)
                this.markAsTouched();
            if (this._pendingChange) {
                this.setValue(this._pendingValue, { onlySelf: true, emitModelToViewChange: false });
                return true;
            }
        }
        return false;
    }
    _applyFormState(formState) {
        if (isFormControlState(formState)) {
            this.value = this._pendingValue = formState.value;
            formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                this.enable({ onlySelf: true, emitEvent: false });
        }
        else {
            this.value = this._pendingValue = formState;
        }
    }
});
const UntypedFormControl = FormControl;
/**
 * @description
 * Asserts that the given control is an instance of `FormControl`
 *
 * @publicApi
 */
const isFormControl = (control) => control instanceof FormControl;

/**
 * @description
 * A base class for code shared between the `NgModelGroup` and `FormGroupName` directives.
 *
 * @publicApi
 */
class AbstractFormGroupDirective extends ControlContainer {
    /** @nodoc */
    ngOnInit() {
        this._checkParentType();
        // Register the group with its parent group.
        this.formDirective.addFormGroup(this);
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.formDirective) {
            // Remove the group from its parent group.
            this.formDirective.removeFormGroup(this);
        }
    }
    /**
     * @description
     * The `FormGroup` bound to this directive.
     */
    get control() {
        return this.formDirective.getFormGroup(this);
    }
    /**
     * @description
     * The path to this group from the top-level directive.
     */
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
    }
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /** @internal */
    _checkParentType() { }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: AbstractFormGroupDirective, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: AbstractFormGroupDirective, usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: AbstractFormGroupDirective, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive
        }] });

function modelParentException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1350 /* RuntimeErrorCode.NGMODEL_IN_FORM_GROUP */, `
    ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
    formGroup's partner directive "formControlName" instead.  Example:

    ${formControlNameExample}

    Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

    Example:

    ${ngModelWithFormGroupExample}`);
}
function formGroupNameException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1351 /* RuntimeErrorCode.NGMODEL_IN_FORM_GROUP_NAME */, `
    ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

    Option 1: Use formControlName instead of ngModel (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

    ${ngModelGroupExample}`);
}
function missingNameException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1352 /* RuntimeErrorCode.NGMODEL_WITHOUT_NAME */, `If ngModel is used within a form tag, either the name attribute must be set or the form
    control must be defined as 'standalone' in ngModelOptions.

    Example 1: <input [(ngModel)]="person.firstName" name="first">
    Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
}
function modelGroupParentException() {
    return new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1353 /* RuntimeErrorCode.NGMODELGROUP_IN_FORM_GROUP */, `
    ngModelGroup cannot be used with a parent formGroup directive.

    Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

    ${ngModelGroupExample}`);
}

const modelGroupProvider = {
    provide: ControlContainer,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => NgModelGroup)
};
/**
 * @description
 * Creates and binds a `FormGroup` instance to a DOM element.
 *
 * This directive can only be used as a child of `NgForm` (within `<form>` tags).
 *
 * Use this directive to validate a sub-group of your form separately from the
 * rest of your form, or if some values in your domain model make more sense
 * to consume together in a nested object.
 *
 * Provide a name for the sub-group and it will become the key
 * for the sub-group in the form's full value. If you need direct access, export the directive into
 * a local template variable using `ngModelGroup` (ex: `#myGroup="ngModelGroup"`).
 *
 * @usageNotes
 *
 * ### Consuming controls in a grouping
 *
 * The following example shows you how to combine controls together in a sub-group
 * of the form.
 *
 * {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
 *
 * @ngModule FormsModule
 * @publicApi
 */
class NgModelGroup extends AbstractFormGroupDirective {
    constructor(parent, validators, asyncValidators) {
        super();
        /**
         * @description
         * Tracks the name of the `NgModelGroup` bound to the directive. The name corresponds
         * to a key in the parent `NgForm`.
         */
        this.name = '';
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @internal */
    _checkParentType() {
        if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm) &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw modelGroupParentException();
        }
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgModelGroup, deps: [{ token: ControlContainer, host: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: NgModelGroup, selector: "[ngModelGroup]", inputs: { name: ["ngModelGroup", "name"] }, providers: [modelGroupProvider], exportAs: ["ngModelGroup"], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgModelGroup, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{ selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup' }]
        }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Host
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.SkipSelf
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }], propDecorators: { name: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['ngModelGroup']
            }] } });

const formControlBinding$1 = {
    provide: NgControl,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => NgModel)
};
/**
 * `ngModel` forces an additional change detection run when its inputs change:
 * E.g.:
 * ```
 * <div>{{myModel.valid}}</div>
 * <input [(ngModel)]="myValue" #myModel="ngModel">
 * ```
 * I.e. `ngModel` can export itself on the element and then be used in the template.
 * Normally, this would result in expressions before the `input` that use the exported directive
 * to have an old value as they have been
 * dirty checked before. As this is a very common case for `ngModel`, we added this second change
 * detection run.
 *
 * Notes:
 * - this is just one extra run no matter how many `ngModel`s have been changed.
 * - this is a general problem when using `exportAs` for directives!
 */
const resolvedPromise = (() => Promise.resolve())();
/**
 * @description
 * Creates a `FormControl` instance from a [domain
 * model](https://en.wikipedia.org/wiki/Domain_model) and binds it to a form control element.
 *
 * The `FormControl` instance tracks the value, user interaction, and
 * validation status of the control and keeps the view synced with the model. If used
 * within a parent form, the directive also registers itself with the form as a child
 * control.
 *
 * This directive is used by itself or as part of a larger form. Use the
 * `ngModel` selector to activate it.
 *
 * It accepts a domain model as an optional `Input`. If you have a one-way binding
 * to `ngModel` with `[]` syntax, changing the domain model's value in the component
 * class sets the value in the view. If you have a two-way binding with `[()]` syntax
 * (also known as 'banana-in-a-box syntax'), the value in the UI always syncs back to
 * the domain model in your class.
 *
 * To inspect the properties of the associated `FormControl` (like the validity state),
 * export the directive into a local template variable using `ngModel` as the key (ex:
 * `#myVar="ngModel"`). You can then access the control using the directive's `control` property.
 * However, the most commonly used properties (like `valid` and `dirty`) also exist on the control
 * for direct access. See a full list of properties directly available in
 * `AbstractControlDirective`.
 *
 * @see {@link RadioControlValueAccessor}
 * @see {@link SelectControlValueAccessor}
 *
 * @usageNotes
 *
 * ### Using ngModel on a standalone control
 *
 * The following examples show a simple standalone control using `ngModel`:
 *
 * {@example forms/ts/simpleNgModel/simple_ng_model_example.ts region='Component'}
 *
 * When using the `ngModel` within `<form>` tags, you'll also need to supply a `name` attribute
 * so that the control can be registered with the parent form under that name.
 *
 * In the context of a parent form, it's often unnecessary to include one-way or two-way binding,
 * as the parent form syncs the value for you. You access its properties by exporting it into a
 * local template variable using `ngForm` such as (`#f="ngForm"`). Use the variable where
 * needed on form submission.
 *
 * If you do need to populate initial values into your form, using a one-way binding for
 * `ngModel` tends to be sufficient as long as you use the exported form's value rather
 * than the domain model's value on submit.
 *
 * ### Using ngModel within a form
 *
 * The following example shows controls using `ngModel` within a form:
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Using a standalone ngModel within a group
 *
 * The following example shows you how to use a standalone ngModel control
 * within a form. This controls the display of the form, but doesn't contain form data.
 *
 * ```html
 * <form>
 *   <input name="login" ngModel placeholder="Login">
 *   <input type="checkbox" ngModel [ngModelOptions]="{standalone: true}"> Show more options?
 * </form>
 * <!-- form value: {login: ''} -->
 * ```
 *
 * ### Setting the ngModel `name` attribute through options
 *
 * The following example shows you an alternate way to set the name attribute. Here,
 * an attribute identified as name is used within a custom form control component. To still be able
 * to specify the NgModel's name, you must specify it using the `ngModelOptions` input instead.
 *
 * ```html
 * <form>
 *   <my-custom-form-control name="Nancy" ngModel [ngModelOptions]="{name: 'user'}">
 *   </my-custom-form-control>
 * </form>
 * <!-- form value: {user: ''} -->
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
class NgModel extends NgControl {
    constructor(parent, validators, asyncValidators, valueAccessors, _changeDetectorRef, callSetDisabledState) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this.callSetDisabledState = callSetDisabledState;
        this.control = new FormControl();
        /** @internal */
        this._registered = false;
        /**
         * @description
         * Tracks the name bound to the directive. If a parent form exists, it
         * uses this name as a key to retrieve this control's value.
         */
        this.name = '';
        /**
         * @description
         * Event emitter for producing the `ngModelChange` event after
         * the view model updates.
         */
        this.update = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this._checkForErrors();
        if (!this._registered || 'name' in changes) {
            if (this._registered) {
                this._checkName();
                if (this.formDirective) {
                    // We can't call `formDirective.removeControl(this)`, because the `name` has already been
                    // changed. We also can't reset the name temporarily since the logic in `removeControl`
                    // is inside a promise and it won't run immediately. We work around it by giving it an
                    // object with the same shape instead.
                    const oldName = changes['name'].previousValue;
                    this.formDirective.removeControl({ name: oldName, path: this._getPath(oldName) });
                }
            }
            this._setUpControl();
        }
        if ('isDisabled' in changes) {
            this._updateDisabled(changes);
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            this._updateValue(this.model);
            this.viewModel = this.model;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return this._getPath(this.name);
    }
    /**
     * @description
     * The top-level directive for this control if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value emitted by `ngModelChange`.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _setUpControl() {
        this._setUpdateStrategy();
        this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
        this._registered = true;
    }
    _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
            this.control._updateOn = this.options.updateOn;
        }
    }
    _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
    }
    _setUpStandalone() {
        setUpControl(this.control, this, this.callSetDisabledState);
        this.control.updateValueAndValidity({ emitEvent: false });
    }
    _checkForErrors() {
        if (!this._isStandalone()) {
            this._checkParentType();
        }
        this._checkName();
    }
    _checkParentType() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!(this._parent instanceof NgModelGroup) &&
                this._parent instanceof AbstractFormGroupDirective) {
                throw formGroupNameException();
            }
            else if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
                throw modelParentException();
            }
        }
    }
    _checkName() {
        if (this.options && this.options.name)
            this.name = this.options.name;
        if (!this._isStandalone() && !this.name && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw missingNameException();
        }
    }
    _updateValue(value) {
        resolvedPromise.then(() => {
            this.control.setValue(value, { emitViewToModelChange: false });
            this._changeDetectorRef?.markForCheck();
        });
    }
    _updateDisabled(changes) {
        const disabledValue = changes['isDisabled'].currentValue;
        // checking for 0 to avoid breaking change
        const isDisabled = disabledValue !== 0 && (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.booleanAttribute)(disabledValue);
        resolvedPromise.then(() => {
            if (isDisabled && !this.control.disabled) {
                this.control.disable();
            }
            else if (!isDisabled && this.control.disabled) {
                this.control.enable();
            }
            this._changeDetectorRef?.markForCheck();
        });
    }
    _getPath(controlName) {
        return this._parent ? controlPath(controlName, this._parent) : [controlName];
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgModel, deps: [{ token: ControlContainer, host: true, optional: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef, optional: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: { name: "name", isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"], options: ["ngModelOptions", "options"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding$1], exportAs: ["ngModel"], usesInheritance: true, usesOnChanges: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgModel, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: '[ngModel]:not([formControlName]):not([formControl])',
                    providers: [formControlBinding$1],
                    exportAs: 'ngModel'
                }]
        }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Host
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALUE_ACCESSOR]
                }] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [CALL_SET_DISABLED_STATE]
                }] }], propDecorators: { name: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }], isDisabled: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['disabled']
            }], model: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['ngModel']
            }], options: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['ngModelOptions']
            }], update: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output,
                args: ['ngModelChange']
            }] } });

/**
 * @description
 *
 * Adds `novalidate` attribute to all forms by default.
 *
 * `novalidate` is used to disable browser's native form validation.
 *
 * If you want to use native validation with Angular forms, just add `ngNativeValidate` attribute:
 *
 * ```
 * <form ngNativeValidate></form>
 * ```
 *
 * @publicApi
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 */
class ɵNgNoValidate {
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ɵNgNoValidate, deps: [], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])", host: { attributes: { "novalidate": "" } }, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ɵNgNoValidate, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
                    host: { 'novalidate': '' },
                }]
        }] });

const NUMBER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => NumberValueAccessor),
    multi: true
};
/**
 * @description
 * The `ControlValueAccessor` for writing a number value and listening to number input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a number input with a reactive form.
 *
 * The following example shows how to use a number input with a reactive form.
 *
 * ```ts
 * const totalCountControl = new FormControl();
 * ```
 *
 * ```
 * <input type="number" [formControl]="totalCountControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NumberValueAccessor extends BuiltInControlValueAccessor {
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value) {
        // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
        const normalizedValue = value == null ? '' : value;
        this.setProperty('value', normalizedValue);
    }
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn) {
        this.onChange = (value) => {
            fn(value == '' ? null : parseFloat(value));
        };
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NumberValueAccessor, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]", host: { listeners: { "input": "onChange($event.target.value)", "blur": "onTouched()" } }, providers: [NUMBER_VALUE_ACCESSOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NumberValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
                    host: { '(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                    providers: [NUMBER_VALUE_ACCESSOR]
                }]
        }] });

const RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => RadioControlValueAccessor),
    multi: true
};
function throwNameError() {
    throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1202 /* RuntimeErrorCode.NAME_AND_FORM_CONTROL_NAME_MUST_MATCH */, `
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
}
/**
 * @description
 * Class used by Angular to track radio buttons. For internal use only.
 */
class RadioControlRegistry {
    constructor() {
        this._accessors = [];
    }
    /**
     * @description
     * Adds a control to the internal registry. For internal use only.
     */
    add(control, accessor) {
        this._accessors.push([control, accessor]);
    }
    /**
     * @description
     * Removes a control from the internal registry. For internal use only.
     */
    remove(accessor) {
        for (let i = this._accessors.length - 1; i >= 0; --i) {
            if (this._accessors[i][1] === accessor) {
                this._accessors.splice(i, 1);
                return;
            }
        }
    }
    /**
     * @description
     * Selects a radio button. For internal use only.
     */
    select(accessor) {
        this._accessors.forEach((c) => {
            if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
                c[1].fireUncheck(accessor.value);
            }
        });
    }
    _isSameGroup(controlPair, accessor) {
        if (!controlPair[0].control)
            return false;
        return controlPair[0]._parent === accessor._control._parent &&
            controlPair[1].name === accessor.name;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RadioControlRegistry, deps: [], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Injectable }); }
    static { this.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareInjectable"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RadioControlRegistry, providedIn: 'root' }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RadioControlRegistry, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * @description
 * The `ControlValueAccessor` for writing radio control values and listening to radio control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using radio buttons with reactive form directives
 *
 * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
 * a reactive form, radio buttons in the same group should have the same `formControlName`.
 * Providing a `name` attribute is optional.
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class RadioControlValueAccessor extends BuiltInControlValueAccessor {
    constructor(renderer, elementRef, _registry, _injector) {
        super(renderer, elementRef);
        this._registry = _registry;
        this._injector = _injector;
        this.setDisabledStateFired = false;
        /**
         * The registered callback function called when a change event occurs on the input element.
         * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
         * to override the `onChange` function (which expects 1 argument) in the parent
         * `BaseControlValueAccessor` class.
         * @nodoc
         */
        this.onChange = () => { };
        this.callSetDisabledState = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(CALL_SET_DISABLED_STATE, { optional: true }) ?? setDisabledStateDefault;
    }
    /** @nodoc */
    ngOnInit() {
        this._control = this._injector.get(NgControl);
        this._checkName();
        this._registry.add(this._control, this);
    }
    /** @nodoc */
    ngOnDestroy() {
        this._registry.remove(this);
    }
    /**
     * Sets the "checked" property value on the radio input element.
     * @nodoc
     */
    writeValue(value) {
        this._state = value === this.value;
        this.setProperty('checked', this._state);
    }
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn) {
        this._fn = fn;
        this.onChange = () => {
            fn(this.value);
            this._registry.select(this);
        };
    }
    /** @nodoc */
    setDisabledState(isDisabled) {
        /**
         * `setDisabledState` is supposed to be called whenever the disabled state of a control changes,
         * including upon control creation. However, a longstanding bug caused the method to not fire
         * when an *enabled* control was attached. This bug was fixed in v15 in #47576.
         *
         * This had a side effect: previously, it was possible to instantiate a reactive form control
         * with `[attr.disabled]=true`, even though the corresponding control was enabled in the
         * model. This resulted in a mismatch between the model and the DOM. Now, because
         * `setDisabledState` is always called, the value in the DOM will be immediately overwritten
         * with the "correct" enabled value.
         *
         * However, the fix also created an exceptional case: radio buttons. Because Reactive Forms
         * models the entire group of radio buttons as a single `FormControl`, there is no way to
         * control the disabled state for individual radios, so they can no longer be configured as
         * disabled. Thus, we keep the old behavior for radio buttons, so that `[attr.disabled]`
         * continues to work. Specifically, we drop the first call to `setDisabledState` if `disabled`
         * is `false`, and we are not in legacy mode.
         */
        if (this.setDisabledStateFired || isDisabled ||
            this.callSetDisabledState === 'whenDisabledForLegacyCode') {
            this.setProperty('disabled', isDisabled);
        }
        this.setDisabledStateFired = true;
    }
    /**
     * Sets the "value" on the radio input element and unchecks it.
     *
     * @param value
     */
    fireUncheck(value) {
        this.writeValue(value);
    }
    _checkName() {
        if (this.name && this.formControlName && this.name !== this.formControlName &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwNameError();
        }
        if (!this.name && this.formControlName)
            this.name = this.formControlName;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RadioControlValueAccessor, deps: [{ token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }, { token: RadioControlRegistry }, { token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Injector }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: { name: "name", formControlName: "formControlName", value: "value" }, host: { listeners: { "change": "onChange()", "blur": "onTouched()" } }, providers: [RADIO_VALUE_ACCESSOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RadioControlValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
                    host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
                    providers: [RADIO_VALUE_ACCESSOR]
                }]
        }], ctorParameters: () => [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }, { type: RadioControlRegistry }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Injector }], propDecorators: { name: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }], formControlName: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }], value: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });

const RANGE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => RangeValueAccessor),
    multi: true
};
/**
 * @description
 * The `ControlValueAccessor` for writing a range value and listening to range input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and  `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a range input with a reactive form
 *
 * The following example shows how to use a range input with a reactive form.
 *
 * ```ts
 * const ageControl = new FormControl();
 * ```
 *
 * ```
 * <input type="range" [formControl]="ageControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class RangeValueAccessor extends BuiltInControlValueAccessor {
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value) {
        this.setProperty('value', parseFloat(value));
    }
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn) {
        this.onChange = (value) => {
            fn(value == '' ? null : parseFloat(value));
        };
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RangeValueAccessor, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: RangeValueAccessor, selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]", host: { listeners: { "change": "onChange($event.target.value)", "input": "onChange($event.target.value)", "blur": "onTouched()" } }, providers: [RANGE_VALUE_ACCESSOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RangeValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]',
                    host: {
                        '(change)': 'onChange($event.target.value)',
                        '(input)': 'onChange($event.target.value)',
                        '(blur)': 'onTouched()'
                    },
                    providers: [RANGE_VALUE_ACCESSOR]
                }]
        }] });

/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 */
const NG_MODEL_WITH_FORM_CONTROL_WARNING = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(ngDevMode ? 'NgModelWithFormControlWarning' : '');
const formControlBinding = {
    provide: NgControl,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => FormControlDirective)
};
/**
 * @description
 * Synchronizes a standalone `FormControl` instance to a form control element.
 *
 * Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives was deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link FormControl}
 * @see {@link AbstractControl}
 *
 * @usageNotes
 *
 * The following example shows how to register a standalone control and set its value.
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormControlDirective extends NgControl {
    /**
     * @description
     * Triggers a warning in dev mode that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            console.warn(disabledAttrWarning);
        }
    }
    /**
     * @description
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlDirective. Used to support warning config of "once".
     *
     * @internal
     */
    static { this._ngModelWarningSentOnce = false; }
    constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig, callSetDisabledState) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        this.callSetDisabledState = callSetDisabledState;
        /** @deprecated as of v6 */
        this.update = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        /**
         * @description
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular `FormControlDirective` instance. Used to support warning config of "always".
         *
         * @internal
         */
        this._ngModelWarningSent = false;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        if (this._isControlChanged(changes)) {
            const previousForm = changes['form'].previousValue;
            if (previousForm) {
                cleanUpControl(previousForm, this, /* validateControlPresenceOnChange */ false);
            }
            setUpControl(this.form, this, this.callSetDisabledState);
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                _ngModelWarning('formControl', FormControlDirective, this, this._ngModelWarningConfig);
            }
            this.form.setValue(this.model);
            this.viewModel = this.model;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.form) {
            cleanUpControl(this.form, this, /* validateControlPresenceOnChange */ false);
        }
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * The `FormControl` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _isControlChanged(changes) {
        return changes.hasOwnProperty('form');
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormControlDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: NG_MODEL_WITH_FORM_CONTROL_WARNING, optional: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: FormControlDirective, selector: "[formControl]", inputs: { form: ["formControl", "form"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormControlDirective, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{ selector: '[formControl]', providers: [formControlBinding], exportAs: 'ngForm' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALUE_ACCESSOR]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [CALL_SET_DISABLED_STATE]
                }] }], propDecorators: { form: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['formControl']
            }], isDisabled: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['disabled']
            }], model: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['ngModel']
            }], update: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output,
                args: ['ngModelChange']
            }] } });

const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => FormGroupDirective)
};
/**
 * @description
 *
 * Binds an existing `FormGroup` or `FormRecord` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`/`FormRecord`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link AbstractControl}
 *
 * @usageNotes
 * ### Register Form Group
 *
 * The following example registers a `FormGroup` with first name and last name controls,
 * and listens for the *ngSubmit* event when the button is clicked.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormGroupDirective extends ControlContainer {
    constructor(validators, asyncValidators, callSetDisabledState) {
        super();
        this.callSetDisabledState = callSetDisabledState;
        /**
         * @description
         * Reports whether the form submission has been triggered.
         */
        this.submitted = false;
        /**
         * Callback that should be invoked when controls in FormGroup or FormArray collection change
         * (added or removed). This callback triggers corresponding DOM updates.
         */
        this._onCollectionChange = () => this._updateDomValue();
        /**
         * @description
         * Tracks the list of added `FormControlName` instances
         */
        this.directives = [];
        /**
         * @description
         * Tracks the `FormGroup` bound to this directive.
         */
        this.form = null;
        /**
         * @description
         * Emits an event when the form submission has been triggered.
         */
        this.ngSubmit = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
            this._oldForm = this.form;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.form) {
            cleanUpValidators(this.form, this);
            // Currently the `onCollectionChange` callback is rewritten each time the
            // `_registerOnCollectionChange` function is invoked. The implication is that cleanup should
            // happen *only* when the `onCollectionChange` callback was set by this directive instance.
            // Otherwise it might cause overriding a callback of some other directive instances. We should
            // consider updating this logic later to make it similar to how `onChange` callbacks are
            // handled, see https://github.com/angular/angular/issues/39732 for additional info.
            if (this.form._onCollectionChange === this._onCollectionChange) {
                this.form._registerOnCollectionChange(() => { });
            }
        }
    }
    /**
     * @description
     * Returns this directive's instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * Returns the `FormGroup` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `FormControlName` directive instance.
     */
    addControl(dir) {
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir, this.callSetDisabledState);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `FormControlName` directive
     *
     * @param dir The `FormControlName` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `FormControlName` instance from the internal list of directives
     *
     * @param dir The `FormControlName` directive instance.
     */
    removeControl(dir) {
        cleanUpControl(dir.control || null, dir, /* validateControlPresenceOnChange */ false);
        removeListItem$1(this.directives, dir);
    }
    /**
     * Adds a new `FormGroupName` directive instance to the form.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    addFormGroup(dir) {
        this._setUpFormContainer(dir);
    }
    /**
     * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    removeFormGroup(dir) {
        this._cleanUpFormContainer(dir);
    }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
     *
     * @param dir The `FormGroupName` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    addFormArray(dir) {
        this._setUpFormContainer(dir);
    }
    /**
     * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    removeFormArray(dir) {
        this._cleanUpFormContainer(dir);
    }
    /**
     * @description
     * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    getFormArray(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `FormControlName` directive.
     *
     * @param dir The `FormControlName` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        const ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
    }
    /**
     * @description
     * Method called with the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        // Forms with `method="dialog"` have some special behavior that won't reload the page and that
        // shouldn't be prevented. Note that we need to null check the `event` and the `target`, because
        // some internal apps call this method directly with the wrong arguments.
        return $event?.target?.method === 'dialog';
    }
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset() {
        this.resetForm();
    }
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        this.submitted = false;
    }
    /** @internal */
    _updateDomValue() {
        this.directives.forEach(dir => {
            const oldCtrl = dir.control;
            const newCtrl = this.form.get(dir.path);
            if (oldCtrl !== newCtrl) {
                // Note: the value of the `dir.control` may not be defined, for example when it's a first
                // `FormControl` that is added to a `FormGroup` instance (via `addControl` call).
                cleanUpControl(oldCtrl || null, dir);
                // Check whether new control at the same location inside the corresponding `FormGroup` is an
                // instance of `FormControl` and perform control setup only if that's the case.
                // Note: we don't need to clear the list of directives (`this.directives`) here, it would be
                // taken care of in the `removeControl` method invoked when corresponding `formControlName`
                // directive instance is being removed (invoked from `FormControlName.ngOnDestroy`).
                if (isFormControl(newCtrl)) {
                    setUpControl(newCtrl, dir, this.callSetDisabledState);
                    dir.control = newCtrl;
                }
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    }
    _setUpFormContainer(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        // NOTE: this operation looks unnecessary in case no new validators were added in
        // `setUpFormContainer` call. Consider updating this code to match the logic in
        // `_cleanUpFormContainer` function.
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    _cleanUpFormContainer(dir) {
        if (this.form) {
            const ctrl = this.form.get(dir.path);
            if (ctrl) {
                const isControlUpdated = cleanUpFormContainer(ctrl, dir);
                if (isControlUpdated) {
                    // Run validity check only in case a control was updated (i.e. view validators were
                    // removed) as removing view validators might cause validity to change.
                    ctrl.updateValueAndValidity({ emitEvent: false });
                }
            }
        }
    }
    _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange);
        if (this._oldForm) {
            this._oldForm._registerOnCollectionChange(() => { });
        }
    }
    _updateValidators() {
        setUpValidators(this.form, this);
        if (this._oldForm) {
            cleanUpValidators(this._oldForm, this);
        }
    }
    _checkFormPresent() {
        if (!this.form && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw missingFormException();
        }
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormGroupDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: FormGroupDirective, selector: "[formGroup]", inputs: { form: ["formGroup", "form"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormGroupDirective, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: '[formGroup]',
                    providers: [formDirectiveProvider],
                    host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                    exportAs: 'ngForm'
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [CALL_SET_DISABLED_STATE]
                }] }], propDecorators: { form: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['formGroup']
            }], ngSubmit: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
            }] } });

const formGroupNameProvider = {
    provide: ControlContainer,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => FormGroupName)
};
/**
 * @description
 *
 * Syncs a nested `FormGroup` or `FormRecord` to a DOM element.
 *
 * This directive can only be used with a parent `FormGroupDirective`.
 *
 * It accepts the string name of the nested `FormGroup` or `FormRecord` to link, and
 * looks for a `FormGroup` or `FormRecord` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * Use nested form groups to validate a sub-group of a
 * form separately from the rest or to group the values of certain
 * controls into their own nested object.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @usageNotes
 *
 * ### Access the group by name
 *
 * The following example uses the `AbstractControl.get` method to access the
 * associated `FormGroup`
 *
 * ```ts
 *   this.form.get('name');
 * ```
 *
 * ### Access individual controls in the group
 *
 * The following example uses the `AbstractControl.get` method to access
 * individual controls within the group using dot syntax.
 *
 * ```ts
 *   this.form.get('name.first');
 * ```
 *
 * ### Register a nested `FormGroup`.
 *
 * The following example registers a nested *name* `FormGroup` within an existing `FormGroup`,
 * and provides methods to retrieve the nested `FormGroup` and individual controls.
 *
 * {@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormGroupName extends AbstractFormGroupDirective {
    constructor(parent, validators, asyncValidators) {
        super();
        /**
         * @description
         * Tracks the name of the `FormGroup` bound to the directive. The name corresponds
         * to a key in the parent `FormGroup` or `FormArray`.
         * Accepts a name as a string or a number.
         * The name in the form of a string is useful for individual forms,
         * while the numerical form allows for form groups to be bound
         * to indices when iterating over groups in a `FormArray`.
         */
        this.name = null;
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @internal */
    _checkParentType() {
        if (_hasInvalidParent(this._parent) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw groupParentException();
        }
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormGroupName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: FormGroupName, selector: "[formGroupName]", inputs: { name: ["formGroupName", "name"] }, providers: [formGroupNameProvider], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormGroupName, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] }]
        }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Host
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.SkipSelf
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }], propDecorators: { name: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['formGroupName']
            }] } });
const formArrayNameProvider = {
    provide: ControlContainer,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => FormArrayName)
};
/**
 * @description
 *
 * Syncs a nested `FormArray` to a DOM element.
 *
 * This directive is designed to be used with a parent `FormGroupDirective` (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the nested `FormArray` you want to link, and
 * will look for a `FormArray` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link AbstractControl}
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormArrayName extends ControlContainer {
    constructor(parent, validators, asyncValidators) {
        super();
        /**
         * @description
         * Tracks the name of the `FormArray` bound to the directive. The name corresponds
         * to a key in the parent `FormGroup` or `FormArray`.
         * Accepts a name as a string or a number.
         * The name in the form of a string is useful for individual forms,
         * while the numerical form allows for form arrays to be bound
         * to indices when iterating over arrays in a `FormArray`.
         */
        this.name = null;
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /**
     * A lifecycle method called when the directive's inputs are initialized. For internal use only.
     * @throws If the directive does not have a valid parent.
     * @nodoc
     */
    ngOnInit() {
        this._checkParentType();
        this.formDirective.addFormArray(this);
    }
    /**
     * A lifecycle method called before the directive's instance is destroyed. For internal use only.
     * @nodoc
     */
    ngOnDestroy() {
        if (this.formDirective) {
            this.formDirective.removeFormArray(this);
        }
    }
    /**
     * @description
     * The `FormArray` bound to this directive.
     */
    get control() {
        return this.formDirective.getFormArray(this);
    }
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
    }
    _checkParentType() {
        if (_hasInvalidParent(this._parent) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw arrayParentException();
        }
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormArrayName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: FormArrayName, selector: "[formArrayName]", inputs: { name: ["formArrayName", "name"] }, providers: [formArrayNameProvider], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormArrayName, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] }]
        }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Host
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.SkipSelf
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }], propDecorators: { name: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['formArrayName']
            }] } });
function _hasInvalidParent(parent) {
    return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) &&
        !(parent instanceof FormArrayName);
}

const controlNameBinding = {
    provide: NgControl,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => FormControlName)
};
/**
 * @description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link FormControl}
 * @see {@link AbstractControl}
 *
 * @usageNotes
 *
 * ### Register `FormControl` within a group
 *
 * The following example shows how to register multiple form controls within a form group
 * and set their value.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: `RadioControlValueAccessor`
 * * Selects: `SelectControlValueAccessor`
 *
 * ### Use with ngModel is deprecated
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 *
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormControlName extends NgControl {
    /**
     * @description
     * Triggers a warning in dev mode that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            console.warn(disabledAttrWarning);
        }
    }
    /**
     * @description
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlName. Used to support warning config of "once".
     *
     * @internal
     */
    static { this._ngModelWarningSentOnce = false; }
    constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        this._added = false;
        /**
         * @description
         * Tracks the name of the `FormControl` bound to the directive. The name corresponds
         * to a key in the parent `FormGroup` or `FormArray`.
         * Accepts a name as a string or a number.
         * The name in the form of a string is useful for individual forms,
         * while the numerical form allows for form controls to be bound
         * to indices when iterating over controls in a `FormArray`.
         */
        this.name = null;
        /** @deprecated as of v6 */
        this.update = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        /**
         * @description
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular FormControlName instance. Used to support warning config of "always".
         *
         * @internal
         */
        this._ngModelWarningSent = false;
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        if (!this._added)
            this._setUpControl();
        if (isPropertyUpdated(changes, this.viewModel)) {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                _ngModelWarning('formControlName', FormControlName, this, this._ngModelWarningConfig);
            }
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
    }
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    _checkParentType() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!(this._parent instanceof FormGroupName) &&
                this._parent instanceof AbstractFormGroupDirective) {
                throw ngModelGroupException();
            }
            else if (!(this._parent instanceof FormGroupName) &&
                !(this._parent instanceof FormGroupDirective) &&
                !(this._parent instanceof FormArrayName)) {
                throw controlParentException();
            }
        }
    }
    _setUpControl() {
        this._checkParentType();
        this.control = this.formDirective.addControl(this);
        this._added = true;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormControlName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: NG_MODEL_WITH_FORM_CONTROL_WARNING, optional: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: FormControlName, selector: "[formControlName]", inputs: { name: ["formControlName", "name"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, providers: [controlNameBinding], usesInheritance: true, usesOnChanges: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormControlName, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{ selector: '[formControlName]', providers: [controlNameBinding] }]
        }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Host
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.SkipSelf
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_VALUE_ACCESSOR]
                }] }, { type: undefined, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
                    args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
                }] }], propDecorators: { name: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['formControlName']
            }], isDisabled: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['disabled']
            }], model: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['ngModel']
            }], update: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output,
                args: ['ngModelChange']
            }] } });

const SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => SelectControlValueAccessor),
    multi: true
};
function _buildValueString$1(id, value) {
    if (id == null)
        return `${value}`;
    if (value && typeof value === 'object')
        value = 'Object';
    return `${id}: ${value}`.slice(0, 50);
}
function _extractId$1(valueString) {
    return valueString.split(':')[0];
}
/**
 * @description
 * The `ControlValueAccessor` for writing select control values and listening to select control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using select controls in a reactive form
 *
 * The following examples show how to use a select control in a reactive form.
 *
 * {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
 *
 * ### Using select controls in a template-driven form
 *
 * To use a select in a template-driven form, simply add an `ngModel` and a `name`
 * attribute to the main `<select>` tag.
 *
 * {@example forms/ts/selectControl/select_control_example.ts region='Component'}
 *
 * ### Customizing option selection
 *
 * Angular uses object identity to select option. It's possible for the identities of items
 * to change while the data does not. This can happen, for example, if the items are produced
 * from an RPC to the server, and that RPC is re-run. Even if the data hasn't changed, the
 * second response will produce objects with different identities.
 *
 * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
 * `compareWith` takes a **function** which has two arguments: `option1` and `option2`.
 * If `compareWith` is given, Angular selects option by the return value of the function.
 *
 * ```ts
 * const selectedCountriesControl = new FormControl();
 * ```
 *
 * ```
 * <select [compareWith]="compareFn"  [formControl]="selectedCountriesControl">
 *     <option *ngFor="let country of countries" [ngValue]="country">
 *         {{country.name}}
 *     </option>
 * </select>
 *
 * compareFn(c1: Country, c2: Country): boolean {
 *     return c1 && c2 ? c1.id === c2.id : c1 === c2;
 * }
 * ```
 *
 * **Note:** We listen to the 'change' event because 'input' events aren't fired
 * for selects in IE, see:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event#browser_compatibility
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class SelectControlValueAccessor extends BuiltInControlValueAccessor {
    constructor() {
        super(...arguments);
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this._compareWith = Object.is;
    }
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn) {
        if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1201 /* RuntimeErrorCode.COMPAREWITH_NOT_A_FN */, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }
    /**
     * Sets the "value" property on the select element.
     * @nodoc
     */
    writeValue(value) {
        this.value = value;
        const id = this._getOptionId(value);
        const valueString = _buildValueString$1(id, value);
        this.setProperty('value', valueString);
    }
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn) {
        this.onChange = (valueString) => {
            this.value = this._getOptionValue(valueString);
            fn(this.value);
        };
    }
    /** @internal */
    _registerOption() {
        return (this._idCounter++).toString();
    }
    /** @internal */
    _getOptionId(value) {
        for (const id of this._optionMap.keys()) {
            if (this._compareWith(this._optionMap.get(id), value))
                return id;
        }
        return null;
    }
    /** @internal */
    _getOptionValue(valueString) {
        const id = _extractId$1(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: SelectControlValueAccessor, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: { compareWith: "compareWith" }, host: { listeners: { "change": "onChange($event.target.value)", "blur": "onTouched()" } }, providers: [SELECT_VALUE_ACCESSOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: SelectControlValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
                    host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                    providers: [SELECT_VALUE_ACCESSOR]
                }]
        }], propDecorators: { compareWith: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });
/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see {@link SelectControlValueAccessor}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NgSelectOption {
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select)
            this.id = this._select._registerOption();
    }
    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    set ngValue(value) {
        if (this._select == null)
            return;
        this._select._optionMap.set(this.id, value);
        this._setElementValue(_buildValueString$1(this.id, value));
        this._select.writeValue(this._select.value);
    }
    /**
     * @description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     */
    set value(value) {
        this._setElementValue(value);
        if (this._select)
            this._select.writeValue(this._select.value);
    }
    /** @internal */
    _setElementValue(value) {
        this._renderer.setProperty(this._element.nativeElement, 'value', value);
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgSelectOption, deps: [{ token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }, { token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { token: SelectControlValueAccessor, host: true, optional: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: NgSelectOption, selector: "option", inputs: { ngValue: "ngValue", value: "value" }, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NgSelectOption, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{ selector: 'option' }]
        }], ctorParameters: () => [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { type: SelectControlValueAccessor, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Host
                }] }], propDecorators: { ngValue: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['ngValue']
            }], value: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['value']
            }] } });

const SELECT_MULTIPLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => SelectMultipleControlValueAccessor),
    multi: true
};
function _buildValueString(id, value) {
    if (id == null)
        return `${value}`;
    if (typeof value === 'string')
        value = `'${value}'`;
    if (value && typeof value === 'object')
        value = 'Object';
    return `${id}: ${value}`.slice(0, 50);
}
function _extractId(valueString) {
    return valueString.split(':')[0];
}
/** Mock interface for HTMLCollection */
class HTMLCollection {
}
/**
 * @description
 * The `ControlValueAccessor` for writing multi-select control values and listening to multi-select
 * control changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @see {@link SelectControlValueAccessor}
 *
 * @usageNotes
 *
 * ### Using a multi-select control
 *
 * The follow example shows you how to use a multi-select control with a reactive form.
 *
 * ```ts
 * const countryControl = new FormControl();
 * ```
 *
 * ```
 * <select multiple name="countries" [formControl]="countryControl">
 *   <option *ngFor="let country of countries" [ngValue]="country">
 *     {{ country.name }}
 *   </option>
 * </select>
 * ```
 *
 * ### Customizing option selection
 *
 * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
 * See the `SelectControlValueAccessor` for usage.
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor {
    constructor() {
        super(...arguments);
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this._compareWith = Object.is;
    }
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn) {
        if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw new _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵRuntimeError"](1201 /* RuntimeErrorCode.COMPAREWITH_NOT_A_FN */, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }
    /**
     * Sets the "value" property on one or of more of the select's options.
     * @nodoc
     */
    writeValue(value) {
        this.value = value;
        let optionSelectedStateSetter;
        if (Array.isArray(value)) {
            // convert values to ids
            const ids = value.map((v) => this._getOptionId(v));
            optionSelectedStateSetter = (opt, o) => {
                opt._setSelected(ids.indexOf(o.toString()) > -1);
            };
        }
        else {
            optionSelectedStateSetter = (opt, o) => {
                opt._setSelected(false);
            };
        }
        this._optionMap.forEach(optionSelectedStateSetter);
    }
    /**
     * Registers a function called when the control value changes
     * and writes an array of the selected options.
     * @nodoc
     */
    registerOnChange(fn) {
        this.onChange = (element) => {
            const selected = [];
            const selectedOptions = element.selectedOptions;
            if (selectedOptions !== undefined) {
                const options = selectedOptions;
                for (let i = 0; i < options.length; i++) {
                    const opt = options[i];
                    const val = this._getOptionValue(opt.value);
                    selected.push(val);
                }
            }
            // Degrade to use `options` when `selectedOptions` property is not available.
            // Note: the `selectedOptions` is available in all supported browsers, but the Domino lib
            // doesn't have it currently, see https://github.com/fgnass/domino/issues/177.
            else {
                const options = element.options;
                for (let i = 0; i < options.length; i++) {
                    const opt = options[i];
                    if (opt.selected) {
                        const val = this._getOptionValue(opt.value);
                        selected.push(val);
                    }
                }
            }
            this.value = selected;
            fn(selected);
        };
    }
    /** @internal */
    _registerOption(value) {
        const id = (this._idCounter++).toString();
        this._optionMap.set(id, value);
        return id;
    }
    /** @internal */
    _getOptionId(value) {
        for (const id of this._optionMap.keys()) {
            if (this._compareWith(this._optionMap.get(id)._value, value))
                return id;
        }
        return null;
    }
    /** @internal */
    _getOptionValue(valueString) {
        const id = _extractId(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id)._value : valueString;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: SelectMultipleControlValueAccessor, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: SelectMultipleControlValueAccessor, selector: "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]", inputs: { compareWith: "compareWith" }, host: { listeners: { "change": "onChange($event.target)", "blur": "onTouched()" } }, providers: [SELECT_MULTIPLE_VALUE_ACCESSOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: SelectMultipleControlValueAccessor, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
                    host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
                    providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
                }]
        }], propDecorators: { compareWith: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });
/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see {@link SelectMultipleControlValueAccessor}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class ɵNgSelectMultipleOption {
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select) {
            this.id = this._select._registerOption(this);
        }
    }
    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    set ngValue(value) {
        if (this._select == null)
            return;
        this._value = value;
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
    }
    /**
     * @description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     */
    set value(value) {
        if (this._select) {
            this._value = value;
            this._setElementValue(_buildValueString(this.id, value));
            this._select.writeValue(this._select.value);
        }
        else {
            this._setElementValue(value);
        }
    }
    /** @internal */
    _setElementValue(value) {
        this._renderer.setProperty(this._element.nativeElement, 'value', value);
    }
    /** @internal */
    _setSelected(selected) {
        this._renderer.setProperty(this._element.nativeElement, 'selected', selected);
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ɵNgSelectMultipleOption, deps: [{ token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }, { token: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { token: SelectMultipleControlValueAccessor, host: true, optional: true }], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: ɵNgSelectMultipleOption, selector: "option", inputs: { ngValue: "ngValue", value: "value" }, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ɵNgSelectMultipleOption, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{ selector: 'option' }]
        }], ctorParameters: () => [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2 }, { type: SelectMultipleControlValueAccessor, decorators: [{
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
                }, {
                    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Host
                }] }], propDecorators: { ngValue: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['ngValue']
            }], value: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
                args: ['value']
            }] } });

/**
 * Method that updates string to integer if not already a number
 *
 * @param value The value to convert to integer.
 * @returns value of parameter converted to number or integer.
 */
function toInteger(value) {
    return typeof value === 'number' ? value : parseInt(value, 10);
}
/**
 * Method that ensures that provided value is a float (and converts it to float if needed).
 *
 * @param value The value to convert to float.
 * @returns value of parameter converted to number or float.
 */
function toFloat(value) {
    return typeof value === 'number' ? value : parseFloat(value);
}
/**
 * A base class for Validator-based Directives. The class contains common logic shared across such
 * Directives.
 *
 * For internal use only, this class is not intended for use outside of the Forms package.
 */
class AbstractValidatorDirective {
    constructor() {
        this._validator = nullValidator;
    }
    /** @nodoc */
    ngOnChanges(changes) {
        if (this.inputName in changes) {
            const input = this.normalizeInput(changes[this.inputName].currentValue);
            this._enabled = this.enabled(input);
            this._validator = this._enabled ? this.createValidator(input) : nullValidator;
            if (this._onChange) {
                this._onChange();
            }
        }
    }
    /** @nodoc */
    validate(control) {
        return this._validator(control);
    }
    /** @nodoc */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
    /**
     * @description
     * Determines whether this validator should be active or not based on an input.
     * Base class implementation checks whether an input is defined (if the value is different from
     * `null` and `undefined`). Validator classes that extend this base class can override this
     * function with the logic specific to a particular validator directive.
     */
    enabled(input) {
        return input != null /* both `null` and `undefined` */;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: AbstractValidatorDirective, deps: [], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: AbstractValidatorDirective, usesOnChanges: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: AbstractValidatorDirective, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive
        }] });
/**
 * @description
 * Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const MAX_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => MaxValidator),
    multi: true
};
/**
 * A directive which installs the {@link MaxValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `max` attribute.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a max validator
 *
 * The following example shows how to add a max validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input type="number" ngModel max="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class MaxValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'max';
        /** @internal */
        this.normalizeInput = (input) => toFloat(input);
        /** @internal */
        this.createValidator = (max) => maxValidator(max);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: MaxValidator, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: { max: "max" }, host: { properties: { "attr.max": "_enabled ? max : null" } }, providers: [MAX_VALIDATOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: MaxValidator, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]',
                    providers: [MAX_VALIDATOR],
                    host: { '[attr.max]': '_enabled ? max : null' }
                }]
        }], propDecorators: { max: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });
/**
 * @description
 * Provider which adds `MinValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const MIN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => MinValidator),
    multi: true
};
/**
 * A directive which installs the {@link MinValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `min` attribute.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a min validator
 *
 * The following example shows how to add a min validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input type="number" ngModel min="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class MinValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'min';
        /** @internal */
        this.normalizeInput = (input) => toFloat(input);
        /** @internal */
        this.createValidator = (min) => minValidator(min);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: MinValidator, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: { min: "min" }, host: { properties: { "attr.min": "_enabled ? min : null" } }, providers: [MIN_VALIDATOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: MinValidator, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]',
                    providers: [MIN_VALIDATOR],
                    host: { '[attr.min]': '_enabled ? min : null' }
                }]
        }], propDecorators: { min: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });
/**
 * @description
 * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => RequiredValidator),
    multi: true
};
/**
 * @description
 * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => CheckboxRequiredValidator),
    multi: true
};
/**
 * @description
 * A directive that adds the `required` validator to any controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required validator using template-driven forms
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class RequiredValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'required';
        /** @internal */
        this.normalizeInput = _angular_core__WEBPACK_IMPORTED_MODULE_0__.booleanAttribute;
        /** @internal */
        this.createValidator = (input) => requiredValidator;
    }
    /** @nodoc */
    enabled(input) {
        return input;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RequiredValidator, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: { required: "required" }, host: { properties: { "attr.required": "_enabled ? \"\" : null" } }, providers: [REQUIRED_VALIDATOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: RequiredValidator, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                    providers: [REQUIRED_VALIDATOR],
                    host: { '[attr.required]': '_enabled ? "" : null' }
                }]
        }], propDecorators: { required: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required checkbox validator using template-driven forms
 *
 * The following example shows how to add a checkbox required validator to an input attached to an
 * ngModel binding.
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
class CheckboxRequiredValidator extends RequiredValidator {
    constructor() {
        super(...arguments);
        /** @internal */
        this.createValidator = (input) => requiredTrueValidator;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: CheckboxRequiredValidator, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: CheckboxRequiredValidator, selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]", host: { properties: { "attr.required": "_enabled ? \"\" : null" } }, providers: [CHECKBOX_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: CheckboxRequiredValidator, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                    providers: [CHECKBOX_REQUIRED_VALIDATOR],
                    host: { '[attr.required]': '_enabled ? "" : null' }
                }]
        }] });
/**
 * @description
 * Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => EmailValidator),
    multi: true
};
/**
 * A directive that adds the `email` validator to controls marked with the
 * `email` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * The email validation is based on the WHATWG HTML specification with some enhancements to
 * incorporate more RFC rules. More information can be found on the [Validators.email
 * page](api/forms/Validators#email).
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding an email validator
 *
 * The following example shows how to add an email validator to an input attached to an ngModel
 * binding.
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
class EmailValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'email';
        /** @internal */
        this.normalizeInput = _angular_core__WEBPACK_IMPORTED_MODULE_0__.booleanAttribute;
        /** @internal */
        this.createValidator = (input) => emailValidator;
    }
    /** @nodoc */
    enabled(input) {
        return input;
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: EmailValidator, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: EmailValidator, selector: "[email][formControlName],[email][formControl],[email][ngModel]", inputs: { email: "email" }, providers: [EMAIL_VALIDATOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: EmailValidator, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: '[email][formControlName],[email][formControl],[email][ngModel]',
                    providers: [EMAIL_VALIDATOR]
                }]
        }], propDecorators: { email: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });
/**
 * @description
 * Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => MinLengthValidator),
    multi: true
};
/**
 * A directive that adds minimum length validation to controls marked with the
 * `minlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a minimum length validator
 *
 * The following example shows how to add a minimum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel minlength="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class MinLengthValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'minlength';
        /** @internal */
        this.normalizeInput = (input) => toInteger(input);
        /** @internal */
        this.createValidator = (minlength) => minLengthValidator(minlength);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: MinLengthValidator, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: MinLengthValidator, selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]", inputs: { minlength: "minlength" }, host: { properties: { "attr.minlength": "_enabled ? minlength : null" } }, providers: [MIN_LENGTH_VALIDATOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: MinLengthValidator, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                    providers: [MIN_LENGTH_VALIDATOR],
                    host: { '[attr.minlength]': '_enabled ? minlength : null' }
                }]
        }], propDecorators: { minlength: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });
/**
 * @description
 * Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => MaxLengthValidator),
    multi: true
};
/**
 * A directive that adds maximum length validation to controls marked with the
 * `maxlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a maximum length validator
 *
 * The following example shows how to add a maximum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel maxlength="25">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class MaxLengthValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'maxlength';
        /** @internal */
        this.normalizeInput = (input) => toInteger(input);
        /** @internal */
        this.createValidator = (maxlength) => maxLengthValidator(maxlength);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: MaxLengthValidator, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: { maxlength: "maxlength" }, host: { properties: { "attr.maxlength": "_enabled ? maxlength : null" } }, providers: [MAX_LENGTH_VALIDATOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: MaxLengthValidator, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                    providers: [MAX_LENGTH_VALIDATOR],
                    host: { '[attr.maxlength]': '_enabled ? maxlength : null' }
                }]
        }], propDecorators: { maxlength: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });
/**
 * @description
 * Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => PatternValidator),
    multi: true
};
/**
 * @description
 * A directive that adds regex pattern validation to controls marked with the
 * `pattern` attribute. The regex must match the entire control value.
 * The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a pattern validator
 *
 * The following example shows how to add a pattern validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel pattern="[a-zA-Z ]*">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class PatternValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'pattern';
        /** @internal */
        this.normalizeInput = (input) => input;
        /** @internal */
        this.createValidator = (input) => patternValidator(input);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: PatternValidator, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Directive }); }
    static { this.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareDirective"]({ minVersion: "14.0.0", version: "17.3.12", type: PatternValidator, selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", inputs: { pattern: "pattern" }, host: { properties: { "attr.pattern": "_enabled ? pattern : null" } }, providers: [PATTERN_VALIDATOR], usesInheritance: true, ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))) }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: PatternValidator, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
            args: [{
                    selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                    providers: [PATTERN_VALIDATOR],
                    host: { '[attr.pattern]': '_enabled ? pattern : null' }
                }]
        }], propDecorators: { pattern: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
            }] } });

const SHARED_FORM_DIRECTIVES = [
    ɵNgNoValidate,
    NgSelectOption,
    ɵNgSelectMultipleOption,
    DefaultValueAccessor,
    NumberValueAccessor,
    RangeValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    SelectMultipleControlValueAccessor,
    RadioControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    MinLengthValidator,
    MaxLengthValidator,
    PatternValidator,
    CheckboxRequiredValidator,
    EmailValidator,
    MinValidator,
    MaxValidator,
];
const TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
const REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
class ɵInternalFormsSharedModule {
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ɵInternalFormsSharedModule, deps: [], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].NgModule }); }
    static { this.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareNgModule"]({ minVersion: "14.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ɵInternalFormsSharedModule, declarations: [ɵNgNoValidate,
            NgSelectOption,
            ɵNgSelectMultipleOption,
            DefaultValueAccessor,
            NumberValueAccessor,
            RangeValueAccessor,
            CheckboxControlValueAccessor,
            SelectControlValueAccessor,
            SelectMultipleControlValueAccessor,
            RadioControlValueAccessor,
            NgControlStatus,
            NgControlStatusGroup,
            RequiredValidator,
            MinLengthValidator,
            MaxLengthValidator,
            PatternValidator,
            CheckboxRequiredValidator,
            EmailValidator,
            MinValidator,
            MaxValidator], exports: [ɵNgNoValidate,
            NgSelectOption,
            ɵNgSelectMultipleOption,
            DefaultValueAccessor,
            NumberValueAccessor,
            RangeValueAccessor,
            CheckboxControlValueAccessor,
            SelectControlValueAccessor,
            SelectMultipleControlValueAccessor,
            RadioControlValueAccessor,
            NgControlStatus,
            NgControlStatusGroup,
            RequiredValidator,
            MinLengthValidator,
            MaxLengthValidator,
            PatternValidator,
            CheckboxRequiredValidator,
            EmailValidator,
            MinValidator,
            MaxValidator] }); }
    static { this.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareInjector"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ɵInternalFormsSharedModule }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ɵInternalFormsSharedModule, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
            args: [{
                    declarations: SHARED_FORM_DIRECTIVES,
                    exports: SHARED_FORM_DIRECTIVES,
                }]
        }] });

/**
 * Tracks the value and validity state of an array of `FormControl`,
 * `FormGroup` or `FormArray` instances.
 *
 * A `FormArray` aggregates the values of each child `FormControl` into an array.
 * It calculates its status by reducing the status values of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` accepts one generic argument, which is the type of the controls inside.
 * If you need a heterogenous array, use {@link UntypedFormArray}.
 *
 * `FormArray` is one of the four fundamental building blocks used to define forms in Angular,
 * along with `FormControl`, `FormGroup`, and `FormRecord`.
 *
 * @usageNotes
 *
 * ### Create an array of form controls
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy', Validators.minLength(2)),
 *   new FormControl('Drew'),
 * ]);
 *
 * console.log(arr.value);   // ['Nancy', 'Drew']
 * console.log(arr.status);  // 'VALID'
 * ```
 *
 * ### Create a form array with array-level validators
 *
 * You include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators are passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
 * ### Set the updateOn property for all controls in a form array
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const arr = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls from a form array
 *
 * To change the controls in the array, use the `push`, `insert`, `removeAt` or `clear` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that result in strange and unexpected behavior such
 * as broken change detection.
 *
 * @publicApi
 */
class FormArray extends AbstractControl {
    /**
     * Creates a new `FormArray` instance.
     *
     * @param controls An array of child controls. Each child control is given an index
     * where it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`.
            // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
            // to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
    }
    /**
     * Get the `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to retrieve the control. If `index` is negative, it will wrap
     *     around from the back, and if index is greatly negative (less than `-length`), the result is
     * undefined. This behavior is the same as `Array.at(index)`.
     */
    at(index) {
        return this.controls[this._adjustIndex(index)];
    }
    /**
     * Insert a new `AbstractControl` at the end of the array.
     *
     * @param control Form control to be inserted
     * @param options Specifies whether this FormArray instance should emit events after a new
     *     control is added.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * inserted. When false, no events are emitted.
     */
    push(control, options = {}) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Insert a new `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to insert the control. If `index` is negative, wraps around
     *     from the back. If `index` is greatly negative (less than `-length`), prepends to the array.
     * This behavior is the same as `Array.splice(index, 0, control)`.
     * @param control Form control to be inserted
     * @param options Specifies whether this FormArray instance should emit events after a new
     *     control is inserted.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * inserted. When false, no events are emitted.
     */
    insert(index, control, options = {}) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
    /**
     * Remove the control at the given `index` in the array.
     *
     * @param index Index in the array to remove the control.  If `index` is negative, wraps around
     *     from the back. If `index` is greatly negative (less than `-length`), removes the first
     *     element. This behavior is the same as `Array.splice(index, 1)`.
     * @param options Specifies whether this FormArray instance should emit events after a
     *     control is removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * removed. When false, no events are emitted.
     */
    removeAt(index, options = {}) {
        // Adjust the index, then clamp it at no less than 0 to prevent undesired underflows.
        let adjustedIndex = this._adjustIndex(index);
        if (adjustedIndex < 0)
            adjustedIndex = 0;
        if (this.controls[adjustedIndex])
            this.controls[adjustedIndex]._registerOnCollectionChange(() => { });
        this.controls.splice(adjustedIndex, 1);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
    /**
     * Replace an existing control.
     *
     * @param index Index in the array to replace the control. If `index` is negative, wraps around
     *     from the back. If `index` is greatly negative (less than `-length`), replaces the first
     *     element. This behavior is the same as `Array.splice(index, 1, control)`.
     * @param control The `AbstractControl` control to replace the existing control
     * @param options Specifies whether this FormArray instance should emit events after an
     *     existing control is replaced with a new one.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * replaced with a new one. When false, no events are emitted.
     */
    setControl(index, control, options = {}) {
        // Adjust the index, then clamp it at no less than 0 to prevent undesired underflows.
        let adjustedIndex = this._adjustIndex(index);
        if (adjustedIndex < 0)
            adjustedIndex = 0;
        if (this.controls[adjustedIndex])
            this.controls[adjustedIndex]._registerOnCollectionChange(() => { });
        this.controls.splice(adjustedIndex, 1);
        if (control) {
            this.controls.splice(adjustedIndex, 0, control);
            this._registerControl(control);
        }
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Length of the control array.
     */
    get length() {
        return this.controls.length;
    }
    /**
     * Sets the value of the `FormArray`. It accepts an array that matches
     * the structure of the control.
     *
     * This method performs strict checks, and throws an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     * @usageNotes
     * ### Set the values for the controls in the form array
     *
     * ```
     * const arr = new FormArray([
     *   new FormControl(),
     *   new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.setValue(['Nancy', 'Drew']);
     * console.log(arr.value);   // ['Nancy', 'Drew']
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    setValue(value, options = {}) {
        assertAllValuesPresent(this, false, value);
        value.forEach((newValue, index) => {
            assertControlPresent(this, false, index);
            this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormArray`. It accepts an array that matches the
     * structure of the control, and does its best to match the values to the correct
     * controls in the group.
     *
     * It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     * @usageNotes
     * ### Patch the values for controls in a form array
     *
     * ```
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.patchValue(['Nancy']);
     * console.log(arr.value);   // ['Nancy', null]
     * ```
     *
     * @param value Array of latest values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control
     * value is updated. When false, no events are emitted. The configuration options are passed to
     * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
        // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
        // `patchValue` can be called recursively and inner data structures might have these values,
        // so we just ignore such cases when a field containing FormArray instance receives `null` or
        // `undefined` as a value.
        if (value == null /* both `null` and `undefined` */)
            return;
        value.forEach((newValue, index) => {
            if (this.at(index)) {
                this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
     * value of all descendants to null or null maps.
     *
     * You reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state is a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * @usageNotes
     * ### Reset the values in a form array
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * arr.reset(['name', 'last name']);
     *
     * console.log(arr.value);  // ['name', 'last name']
     * ```
     *
     * ### Reset the values in a form array and the disabled status for the first control
     *
     * ```
     * arr.reset([
     *   {value: 'name', disabled: true},
     *   'last'
     * ]);
     *
     * console.log(arr.value);  // ['last']
     * console.log(arr.at(0).status);  // 'DISABLED'
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    reset(value = [], options = {}) {
        this._forEachChild((control, index) => {
            control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * Reports all values regardless of disabled status.
     */
    getRawValue() {
        return this.controls.map((control) => control.getRawValue());
    }
    /**
     * Remove all controls in the `FormArray`.
     *
     * @param options Specifies whether this FormArray instance should emit events after all
     *     controls are removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when all controls
     * in this FormArray instance are removed. When false, no events are emitted.
     *
     * @usageNotes
     * ### Remove all elements from a FormArray
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.length);  // 2
     *
     * arr.clear();
     * console.log(arr.length);  // 0
     * ```
     *
     * It's a simpler and more efficient alternative to removing all elements one by one:
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     *
     * while (arr.length) {
     *    arr.removeAt(0);
     * }
     * ```
     */
    clear(options = {}) {
        if (this.controls.length < 1)
            return;
        this._forEachChild((control) => control._registerOnCollectionChange(() => { }));
        this.controls.splice(0);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
    /**
     * Adjusts a negative index by summing it with the length of the array. For very negative
     * indices, the result may remain negative.
     * @internal
     */
    _adjustIndex(index) {
        return index < 0 ? index + this.length : index;
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this.controls.reduce((updated, child) => {
            return child._syncPendingControls() ? true : updated;
        }, false);
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _forEachChild(cb) {
        this.controls.forEach((control, index) => {
            cb(control, index);
        });
    }
    /** @internal */
    _updateValue() {
        this.value =
            this.controls.filter((control) => control.enabled || this.disabled)
                .map((control) => control.value);
    }
    /** @internal */
    _anyControls(condition) {
        return this.controls.some((control) => control.enabled && condition(control));
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => this._registerControl(control));
    }
    /** @internal */
    _allControlsDisabled() {
        for (const control of this.controls) {
            if (control.enabled)
                return false;
        }
        return this.controls.length > 0 || this.disabled;
    }
    _registerControl(control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
    }
    /** @internal */
    _find(name) {
        return this.at(name) ?? null;
    }
}
const UntypedFormArray = FormArray;
/**
 * @description
 * Asserts that the given control is an instance of `FormArray`
 *
 * @publicApi
 */
const isFormArray = (control) => control instanceof FormArray;

function isAbstractControlOptions(options) {
    return !!options &&
        (options.asyncValidators !== undefined ||
            options.validators !== undefined ||
            options.updateOn !== undefined);
}
// clang-format on
/**
 * @description
 * Creates an `AbstractControl` from a user-specified configuration.
 *
 * The `FormBuilder` provides syntactic sugar that shortens creating instances of a
 * `FormControl`, `FormGroup`, or `FormArray`. It reduces the amount of boilerplate needed to
 * build complex forms.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @publicApi
 */
class FormBuilder {
    constructor() {
        this.useNonNullable = false;
    }
    /**
     * @description
     * Returns a FormBuilder in which automatically constructed `FormControl` elements
     * have `{nonNullable: true}` and are non-nullable.
     *
     * **Constructing non-nullable controls**
     *
     * When constructing a control, it will be non-nullable, and will reset to its initial value.
     *
     * ```ts
     * let nnfb = new FormBuilder().nonNullable;
     * let name = nnfb.control('Alex'); // FormControl<string>
     * name.reset();
     * console.log(name); // 'Alex'
     * ```
     *
     * **Constructing non-nullable groups or arrays**
     *
     * When constructing a group or array, all automatically created inner controls will be
     * non-nullable, and will reset to their initial values.
     *
     * ```ts
     * let nnfb = new FormBuilder().nonNullable;
     * let name = nnfb.group({who: 'Alex'}); // FormGroup<{who: FormControl<string>}>
     * name.reset();
     * console.log(name); // {who: 'Alex'}
     * ```
     * **Constructing *nullable* fields on groups or arrays**
     *
     * It is still possible to have a nullable field. In particular, any `FormControl` which is
     * *already* constructed will not be altered. For example:
     *
     * ```ts
     * let nnfb = new FormBuilder().nonNullable;
     * // FormGroup<{who: FormControl<string|null>}>
     * let name = nnfb.group({who: new FormControl('Alex')});
     * name.reset(); console.log(name); // {who: null}
     * ```
     *
     * Because the inner control is constructed explicitly by the caller, the builder has
     * no control over how it is created, and cannot exclude the `null`.
     */
    get nonNullable() {
        const nnfb = new FormBuilder();
        nnfb.useNonNullable = true;
        return nnfb;
    }
    group(controls, options = null) {
        const reducedControls = this._reduceControls(controls);
        let newOptions = {};
        if (isAbstractControlOptions(options)) {
            // `options` are `AbstractControlOptions`
            newOptions = options;
        }
        else if (options !== null) {
            // `options` are legacy form group options
            newOptions.validators = options.validator;
            newOptions.asyncValidators = options.asyncValidator;
        }
        return new FormGroup(reducedControls, newOptions);
    }
    /**
     * @description
     * Constructs a new `FormRecord` instance. Accepts a single generic argument, which is an object
     * containing all the keys and corresponding inner control types.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param options Configuration options object for the `FormRecord`. The object should have the
     * `AbstractControlOptions` type and might contain the following fields:
     * * `validators`: A synchronous validator function, or an array of validator functions.
     * * `asyncValidators`: A single async validator or array of async validator functions.
     * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
     * | submit').
     */
    record(controls, options = null) {
        const reducedControls = this._reduceControls(controls);
        // Cast to `any` because the inferred types are not as specific as Element.
        return new FormRecord(reducedControls, options);
    }
    /**
     * @description
     * Constructs a new `FormControl` with the given state, validators and options. Sets
     * `{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
     * control will be nullable. Accepts a single generic argument, which is the type  of the
     * control's value.
     *
     * @param formState Initializes the control with an initial state value, or
     * with an object that contains both a value and a disabled status.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or a `FormControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator
     * functions.
     *
     * @usageNotes
     *
     * ### Initialize a control as disabled
     *
     * The following example returns a control with an initial value in a disabled state.
     *
     * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
     * </code-example>
     */
    control(formState, validatorOrOpts, asyncValidator) {
        let newOptions = {};
        if (!this.useNonNullable) {
            return new FormControl(formState, validatorOrOpts, asyncValidator);
        }
        if (isAbstractControlOptions(validatorOrOpts)) {
            // If the second argument is options, then they are copied.
            newOptions = validatorOrOpts;
        }
        else {
            // If the other arguments are validators, they are copied into an options object.
            newOptions.validators = validatorOrOpts;
            newOptions.asyncValidators = asyncValidator;
        }
        return new FormControl(formState, { ...newOptions, nonNullable: true });
    }
    /**
     * Constructs a new `FormArray` from the given array of configurations,
     * validators and options. Accepts a single generic argument, which is the type of each control
     * inside the array.
     *
     * @param controls An array of child controls or control configs. Each child control is given an
     *     index when it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of such functions, or an
     *     `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions.
     */
    array(controls, validatorOrOpts, asyncValidator) {
        const createdControls = controls.map(c => this._createControl(c));
        // Cast to `any` because the inferred types are not as specific as Element.
        return new FormArray(createdControls, validatorOrOpts, asyncValidator);
    }
    /** @internal */
    _reduceControls(controls) {
        const createdControls = {};
        Object.keys(controls).forEach(controlName => {
            createdControls[controlName] = this._createControl(controls[controlName]);
        });
        return createdControls;
    }
    /** @internal */
    _createControl(controls) {
        if (controls instanceof FormControl) {
            return controls;
        }
        else if (controls instanceof AbstractControl) { // A control; just return it
            return controls;
        }
        else if (Array.isArray(controls)) { // ControlConfig Tuple
            const value = controls[0];
            const validator = controls.length > 1 ? controls[1] : null;
            const asyncValidator = controls.length > 2 ? controls[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else { // T or FormControlState<T>
            return this.control(controls);
        }
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormBuilder, deps: [], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Injectable }); }
    static { this.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareInjectable"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormBuilder, providedIn: 'root' }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormBuilder, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * @description
 * `NonNullableFormBuilder` is similar to {@link FormBuilder}, but automatically constructed
 * {@link FormControl} elements have `{nonNullable: true}` and are non-nullable.
 *
 * @publicApi
 */
class NonNullableFormBuilder {
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NonNullableFormBuilder, deps: [], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Injectable }); }
    static { this.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareInjectable"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NonNullableFormBuilder, providedIn: 'root', useFactory: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(FormBuilder).nonNullable }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: NonNullableFormBuilder, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable,
            args: [{
                    providedIn: 'root',
                    useFactory: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(FormBuilder).nonNullable,
                }]
        }] });
/**
 * UntypedFormBuilder is the same as `FormBuilder`, but it provides untyped controls.
 */
class UntypedFormBuilder extends FormBuilder {
    group(controlsConfig, options = null) {
        return super.group(controlsConfig, options);
    }
    /**
     * Like `FormBuilder#control`, except the resulting control is untyped.
     */
    control(formState, validatorOrOpts, asyncValidator) {
        return super.control(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * Like `FormBuilder#array`, except the resulting array is untyped.
     */
    array(controlsConfig, validatorOrOpts, asyncValidator) {
        return super.array(controlsConfig, validatorOrOpts, asyncValidator);
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: UntypedFormBuilder, deps: null, target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].Injectable }); }
    static { this.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareInjectable"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: UntypedFormBuilder, providedIn: 'root' }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: UntypedFormBuilder, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * @module
 * @description
 * Entry point for all public APIs of the forms package.
 */
/**
 * @publicApi
 */
const VERSION = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.Version('17.3.12');

/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 *
 * @see [Forms Overview](/guide/forms-overview)
 * @see [Template-driven Forms Guide](/guide/forms)
 *
 * @publicApi
 */
class FormsModule {
    /**
     * @description
     * Provides options for configuring the forms module.
     *
     * @param opts An object of configuration options
     * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
     * correct, or to only call it `whenDisabled`, which is the legacy behavior.
     */
    static withConfig(opts) {
        return {
            ngModule: FormsModule,
            providers: [{
                    provide: CALL_SET_DISABLED_STATE,
                    useValue: opts.callSetDisabledState ?? setDisabledStateDefault
                }]
        };
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormsModule, deps: [], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].NgModule }); }
    static { this.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareNgModule"]({ minVersion: "14.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormsModule, declarations: [NgModel, NgModelGroup, NgForm], exports: [ɵInternalFormsSharedModule, NgModel, NgModelGroup, NgForm] }); }
    static { this.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareInjector"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormsModule, imports: [ɵInternalFormsSharedModule] }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: FormsModule, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
            args: [{
                    declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                    exports: [ɵInternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
                }]
        }] });
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 *
 * @see [Forms Overview](guide/forms-overview)
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @publicApi
 */
class ReactiveFormsModule {
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
     * binding is used with reactive form directives.
     * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
     * correct, or to only call it `whenDisabled`, which is the legacy behavior.
     */
    static withConfig(opts) {
        return {
            ngModule: ReactiveFormsModule,
            providers: [
                {
                    provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
                    useValue: opts.warnOnNgModelWithFormControl ?? 'always'
                },
                {
                    provide: CALL_SET_DISABLED_STATE,
                    useValue: opts.callSetDisabledState ?? setDisabledStateDefault
                }
            ]
        };
    }
    static { this.ɵfac = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareFactory"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ReactiveFormsModule, deps: [], target: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵFactoryTarget"].NgModule }); }
    static { this.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareNgModule"]({ minVersion: "14.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ReactiveFormsModule, declarations: [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName], exports: [ɵInternalFormsSharedModule, FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName] }); }
    static { this.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareInjector"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ReactiveFormsModule, imports: [ɵInternalFormsSharedModule] }); }
}
_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵngDeclareClassMetadata"]({ minVersion: "12.0.0", version: "17.3.12", ngImport: /*#__PURE__*/ (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_angular_core__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_angular_core__WEBPACK_IMPORTED_MODULE_0__, 2))), type: ReactiveFormsModule, decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
            args: [{
                    declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                    exports: [ɵInternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
                }]
        }] });

/**
 * @module
 * @description
 * This module is used for handling user input, by defining and building a `FormGroup` that
 * consists of `FormControl` objects, and mapping them onto the DOM. `FormControl`
 * objects can then be used to read information from the form DOM elements.
 *
 * Forms providers are not included in default providers; you must import these providers
 * explicitly.
 */

/**
 * @module
 * @description
 * Entry point for all public APIs of this package.
 */
// This file only reexports content of the `src` folder. Keep it that way.

// This file is not used to build this module. It is only used during editing

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=forms.mjs.map


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/create fake namespace object */
/******/ (() => {
/******/ 	var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 	var leafPrototypes;
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 16: return value when it's Promise-like
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = this(value);
/******/ 		if(mode & 8) return value;
/******/ 		if(typeof value === 'object' && value) {
/******/ 			if((mode & 4) && value.__esModule) return value;
/******/ 			if((mode & 16) && typeof value.then === 'function') return value;
/******/ 		}
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		var def = {};
/******/ 		leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 		for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 			Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 		}
/******/ 		def['default'] = () => (value);
/******/ 		__webpack_require__.d(ns, def);
/******/ 		return ns;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/public_api.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AmsterdamEmailapiConfigurationComponent: () => (/* reexport safe */ _lib_components_amsterdam_emailapi_configuration_amsterdam_emailapi_configuration_component__WEBPACK_IMPORTED_MODULE_4__.AmsterdamEmailapiConfigurationComponent),
/* harmony export */   AmsterdamEmailapiPluginModule: () => (/* reexport safe */ _lib_amsterdam_emailapi_plugin_module__WEBPACK_IMPORTED_MODULE_1__.AmsterdamEmailapiPluginModule),
/* harmony export */   SendEmailConfigurationComponent: () => (/* reexport safe */ _lib_components_send_email_send_email_configuration_component__WEBPACK_IMPORTED_MODULE_3__.SendEmailConfigurationComponent),
/* harmony export */   amsterdamEmailapiPluginSpecification: () => (/* reexport safe */ _lib_amsterdam_emailapi_plugin_specification__WEBPACK_IMPORTED_MODULE_2__.amsterdamEmailapiPluginSpecification)
/* harmony export */ });
/* harmony import */ var _lib_models_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/models/index */ "./src/lib/models/index.ts");
/* harmony import */ var _lib_amsterdam_emailapi_plugin_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/amsterdam-emailapi-plugin-module */ "./src/lib/amsterdam-emailapi-plugin-module.ts");
/* harmony import */ var _lib_amsterdam_emailapi_plugin_specification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/amsterdam-emailapi-plugin.specification */ "./src/lib/amsterdam-emailapi-plugin.specification.ts");
/* harmony import */ var _lib_components_send_email_send_email_configuration_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/components/send-email/send-email-configuration.component */ "./src/lib/components/send-email/send-email-configuration.component.ts");
/* harmony import */ var _lib_components_amsterdam_emailapi_configuration_amsterdam_emailapi_configuration_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component */ "./src/lib/components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component.ts");
/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/*
 * Public API Surface of slack
 */






})();

var __webpack_exports__AmsterdamEmailapiConfigurationComponent = __webpack_exports__.AmsterdamEmailapiConfigurationComponent;
var __webpack_exports__AmsterdamEmailapiPluginModule = __webpack_exports__.AmsterdamEmailapiPluginModule;
var __webpack_exports__SendEmailConfigurationComponent = __webpack_exports__.SendEmailConfigurationComponent;
var __webpack_exports__amsterdamEmailapiPluginSpecification = __webpack_exports__.amsterdamEmailapiPluginSpecification;
export { __webpack_exports__AmsterdamEmailapiConfigurationComponent as AmsterdamEmailapiConfigurationComponent, __webpack_exports__AmsterdamEmailapiPluginModule as AmsterdamEmailapiPluginModule, __webpack_exports__SendEmailConfigurationComponent as SendEmailConfigurationComponent, __webpack_exports__amsterdamEmailapiPluginSpecification as amsterdamEmailapiPluginSpecification };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQtYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFPLDJDQUEyQyx1REFBdUQ7QUFDbEc7QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNka0M7QUFDYTtBQUNlO0FBQzVCO0FBQ2lDO0FBQ2hDO0FBQ2tFO0FBQ3ZDO0FBQ1g7QUFDbkQ7QUFDQSxJQUFJLGdEQUFTO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw2REFBYztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyx3RUFBZ0I7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUVBQWlCO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUVBQXFCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQyx1REFBWTtBQUNRO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLElBQUksZ0RBQVM7QUFDYjtBQUNBO0FBQ0E7QUFDQSxZQUFZLDREQUFVO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsMkNBQU07QUFDL0I7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDeUI7QUFDMUI7QUFDQSxRQUFRLDJDQUFNO0FBQ2QsUUFBUSxnRUFBWTtBQUNwQjtBQUNBO0FBQ0EsUUFBUSxnRkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDJDQUFNO0FBQ3RDLDZCQUE2Qix1RUFBZSwwQkFBMEIseURBQXlEO0FBQy9IO0FBQ087QUFDUDtBQUNBLFVBQVUsNENBQUk7QUFDZDtBQUNBLGNBQWMsNENBQUk7QUFDbEI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkx3RDtBQUNUO0FBQ2tCO0FBQ3BCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsK0NBQVEsb0RBQW9ELHNCQUFzQjtBQUNsSTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxRQUFRO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDREQUFVO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLDBFQUFtQjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsK0NBQVEsdURBQXVELHVCQUF1QjtBQUNuSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsMEVBQW1CO0FBQ2xFLHlDQUF5QyxvREFBYSxDQUFDLG9EQUFhLEtBQUssNkNBQU0sV0FBVyw2Q0FBTTtBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxRQUFRO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiwwRUFBbUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLDBEQUFTO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDBEQUFTO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ3VCO0FBQ2pCO0FBQ0E7QUFDUDtBQUNBLHVDQUF1Qyw0REFBVSxrQkFBa0IsNERBQVUsZUFBZSw0REFBVTtBQUN0RztBQUNBO0FBQ0EsUUFBUSw0REFBVTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUM5SU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUGtDO0FBQ1M7QUFDcEM7QUFDUDtBQUNBO0FBQ0E7QUFDQSxJQUFJLGdEQUFTO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLG1EQUFVO0FBQ2tCO0FBQzlCOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUR1QztBQUN5QjtBQUN6RDtBQUNQLFdBQVcsbURBQU87QUFDbEI7QUFDQSx5QkFBeUIsNkVBQXdCO0FBQ2pEO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDVjhDO0FBQ3ZDO0FBQ1A7QUFDQTtBQUNBLHlCQUF5Qix1QkFBdUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsb0RBQWEscUJBQXFCLDZDQUFNO0FBQy9GO0FBQ0Esd0NBQXdDLG9EQUFhLHFCQUFxQiw2Q0FBTTtBQUNoRixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbkJzRDtBQUMvQywwQkFBMEIsbUVBQWdCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLDJHQUEyRyx1Q0FBdUM7QUFDbEo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7O0FDWE87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDTk87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZtQztBQUNuQztBQUNPO0FBQ1AsUUFBUSwyQ0FBTTtBQUNkO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsUUFBUSwyQ0FBTTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDM0JPO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDSDBDO0FBQ25DO0FBQ1AsV0FBVyx1REFBVTtBQUNyQjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbkJPO0FBQ1A7Ozs7Ozs7Ozs7Ozs7Ozs7QUNEbUM7QUFDNEI7QUFDeEQ7QUFDUCxJQUFJLHVFQUFlO0FBQ25CLCtCQUErQiwyQ0FBTTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7QUFFb0M7QUFDMEc7QUFDcEc7QUFDNEI7QUFFOUI7QUFDaUI7QUFDK0M7QUFDWjtBQXFCeEYsSUFBTSw2QkFBNkIsR0FBbkMsTUFBTSw2QkFBNkI7Q0FBRztBQUFoQyw2QkFBNkI7SUFuQnpDLHVEQUFRLENBQUM7UUFDUixZQUFZLEVBQUU7WUFDWiw0SkFBdUM7WUFDdkMsc0hBQStCO1NBQ2hDO1FBQ0QsT0FBTyxFQUFFLENBQUMseURBQVksRUFBRSxzRUFBeUIsRUFBRSwyREFBVSxFQUFFLDREQUFXLEVBQUUsdURBQVcsRUFBRSxzRUFBeUIsRUFBRSwyREFBVSxFQUFFLDJEQUFVLEVBQUUsMkRBQVUsRUFBRSwyREFBVSxDQUFDO1FBQ25LLE9BQU8sRUFBRTtZQUNQLDRKQUF1QztZQUN2QyxzSEFBK0I7U0FDaEM7UUFDRCxTQUFTLEVBQUU7WUFDVDtnQkFDRSxPQUFPLEVBQUUsMERBQWE7Z0JBQ3RCLFFBQVEsRUFBRTtvQkFDUiwwR0FBb0M7aUJBQ3JDO2FBQ0Y7U0FDRjtLQUNGLENBQUM7R0FDVyw2QkFBNkIsQ0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hEN0M7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBRzhJO0FBQ2xGO0FBQzRDO0FBRTNHLE1BQU0sb0NBQW9DLEdBQXdCO0lBQ2hFLFFBQVEsRUFBRSxtQkFBbUI7SUFDN0IsNEJBQTRCLEVBQUUsNEpBQXVDO0lBQ3JFLGdCQUFnQixFQUFFLDBFQUFxQztJQUN2RCwrQkFBK0IsRUFBRTtRQUMvQixZQUFZLEVBQUUsc0hBQStCO0tBQzlDO0lBQ0Qsa0JBQWtCLEVBQUU7UUFDbEIsRUFBRSxFQUFFO1lBQ0YsS0FBSyxFQUFFLHFCQUFxQjtZQUM1QixXQUFXLEVBQ1AsMEVBQTBFO1lBQzlFLGtCQUFrQixFQUFFLGtCQUFrQjtZQUN0Qyx5QkFBeUIsRUFDckIsOEVBQThFO1lBQ2xGLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLGVBQWUsRUFDWCx3TkFBd047WUFDNU4sWUFBWSxFQUFFLFFBQVE7WUFDdEIsbUJBQW1CLEVBQUUsc0RBQXNEO1lBQzNFLGVBQWUsRUFBRSxvQkFBb0I7WUFDckMsc0JBQXNCLEVBQUUsNkVBQTZFO1lBQ3JHLGFBQWEsRUFBRSxnQkFBZ0I7WUFDL0Isb0JBQW9CLEVBQUUsOERBQThEO1lBQ3BGLE9BQU8sRUFBRSxxQkFBcUI7WUFDOUIsTUFBTSxFQUFFLG9CQUFvQjtZQUM1QixXQUFXLEVBQUUsVUFBVTtZQUN2QixZQUFZLEVBQUUsV0FBVztZQUN6QixXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLE9BQU8sRUFBRSxVQUFVO1NBQ3BCO1FBQ0QsRUFBRSxFQUFFO1lBQ0YsS0FBSyxFQUFFLHFCQUFxQjtZQUM1QixXQUFXLEVBQ1AsME1BQTBNO1lBQzlNLGtCQUFrQixFQUFFLG9CQUFvQjtZQUN4Qyx5QkFBeUIsRUFDckIsaUZBQWlGO1lBQ3JGLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLGVBQWUsRUFDWCwrTUFBK007WUFDbk4sWUFBWSxFQUFFLFFBQVE7WUFDdEIsbUJBQW1CLEVBQUUscURBQXFEO1lBQzFFLGVBQWUsRUFBRSxvQkFBb0I7WUFDckMsc0JBQXNCLEVBQUUsZ0ZBQWdGO1lBQ3hHLGFBQWEsRUFBRSxnQkFBZ0I7WUFDL0Isb0JBQW9CLEVBQUUsMkRBQTJEO1lBQ2pGLE9BQU8sRUFBRSxrQkFBa0I7U0FDNUI7UUFDRCxFQUFFLEVBQUU7WUFDRixLQUFLLEVBQUUscUJBQXFCO1lBQzVCLFdBQVcsRUFDUCxxT0FBcU87WUFDek8sa0JBQWtCLEVBQUUsb0JBQW9CO1lBQ3hDLHlCQUF5QixFQUNyQix5RUFBeUU7WUFDN0UsUUFBUSxFQUFFLFdBQVc7WUFDckIsZUFBZSxFQUNYLG1PQUFtTztZQUN2TyxZQUFZLEVBQUUsUUFBUTtZQUN0QixtQkFBbUIsRUFBRSxnRUFBZ0U7WUFDckYsZUFBZSxFQUFFLG9CQUFvQjtZQUNyQyxzQkFBc0IsRUFBRSxrR0FBa0c7WUFDMUgsYUFBYSxFQUFFLGdCQUFnQjtZQUMvQixvQkFBb0IsRUFBRSx3RUFBd0U7U0FDL0Y7S0FDRjtDQUNGLENBQUM7QUFFNEM7Ozs7Ozs7Ozs7Ozs7OztBQ2hHOUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBRUgsTUFBTSxxQ0FBcUMsR0FDM0MsNGhWQUE0aFYsQ0FBQztBQUU5K1U7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Qi9DOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUU4Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkJqRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBRXFGO0FBRUo7QUFRN0UsSUFBTSx1Q0FBdUMsR0FBN0MsTUFBTSx1Q0FBdUM7SUFBN0M7UUFPSyxVQUFLLEdBQTBCLElBQUksdURBQVksRUFBVyxDQUFDO1FBQzNELGtCQUFhLEdBQ25CLElBQUksdURBQVksRUFBMkIsQ0FBQztRQUkvQixlQUFVLEdBQUcsSUFBSSxpREFBZSxDQUFpQyxJQUFJLENBQUMsQ0FBQztRQUN2RSxXQUFNLEdBQUcsSUFBSSxpREFBZSxDQUFVLEtBQUssQ0FBQyxDQUFDO0lBcUNoRSxDQUFDO0lBbkNDLFFBQVE7UUFDTixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsZUFBZSxDQUFDLFNBQWtDO1FBQ2hELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVPLFdBQVcsQ0FBQyxTQUFrQztRQUNwRCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCO2VBQ3RDLFNBQVMsQ0FBQyxRQUFRO2VBQ2xCLFNBQVMsQ0FBQyxZQUFZO2VBQ3RCLFNBQVMsQ0FBQyxlQUFlO2VBQ3pCLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuRCxtREFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3hDLElBQUksQ0FBQywwQ0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNiLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hDLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ1YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBaERVO0lBQVIsb0RBQUssRUFBRTtzRUFBeUI7QUFDeEI7SUFBUixvREFBSyxFQUFFOzBFQUFnQztBQUMvQjtJQUFSLG9EQUFLLEVBQUU7eUVBQWtCO0FBQ2pCO0lBQVIsb0RBQUssRUFBRTtzRkFBNEQ7QUFDMUQ7SUFBVCxxREFBTSxFQUFFO3NFQUE0RDtBQUMzRDtJQUFULHFEQUFNLEVBQUU7OEVBQ3VDO0FBVHJDLHVDQUF1QztJQUxuRCx3REFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLDBDQUEwQztRQUNwRCxRQUFRLEVBQUUsbUJBQU8sQ0FBQyxnS0FBbUQsQ0FBQztRQUN0RSxNQUFNLEVBQUUsQ0FBQyxtQkFBTyxDQUFDLGdLQUFtRCxDQUFDLENBQUM7S0FDdkUsQ0FBQztHQUNXLHVDQUF1QyxDQW1EbkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRkQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUVxRjtBQUVKO0FBUTdFLElBQU0sK0JBQStCLEdBQXJDLE1BQU0sK0JBQStCO0lBQXJDO1FBT0ssa0JBQWEsR0FBa0MsSUFBSSx1REFBWSxFQUFtQixDQUFDO1FBQ25GLFVBQUssR0FBMEIsSUFBSSx1REFBWSxFQUFXLENBQUM7UUFFcEQsZUFBVSxHQUFHLElBQUksaURBQWUsQ0FBeUIsSUFBSSxDQUFDLENBQUM7UUFFL0QsV0FBTSxHQUFHLElBQUksaURBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztJQW9DaEUsQ0FBQztJQWxDUSxRQUFRO1FBQ2IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVNLFdBQVc7UUFDaEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxlQUFlLENBQUMsU0FBMEI7UUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU8sV0FBVyxDQUFDLFNBQTBCO1FBQzVDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7ZUFDNUIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztlQUMxQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO2VBQ3pCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuRCxtREFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3hDLElBQUksQ0FBQywwQ0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNiLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hDLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ1YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBN0NVO0lBQVIsb0RBQUssRUFBRTtrRUFBZ0M7QUFDL0I7SUFBUixvREFBSyxFQUFFO2lFQUFrQjtBQUNqQjtJQUFSLG9EQUFLLEVBQUU7OEVBQW9EO0FBQ25EO0lBQVIsb0RBQUssRUFBRTs4REFBeUI7QUFDdkI7SUFBVCxxREFBTSxFQUFFO3NFQUFvRjtBQUNuRjtJQUFULHFEQUFNLEVBQUU7OERBQTREO0FBUjFELCtCQUErQjtJQUwzQyx3REFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGtDQUFrQztRQUM1QyxRQUFRLEVBQUUsbUJBQU8sQ0FBQywwSEFBMkMsQ0FBQztRQUM5RCxNQUFNLEVBQUUsQ0FBQyxtQkFBTyxDQUFDLDBIQUEyQyxDQUFDLENBQUM7S0FDL0QsQ0FBQztHQUNXLCtCQUErQixDQWdEM0M7Ozs7Ozs7Ozs7Ozs7QUM3RUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOzs7Ozs7Ozs7Ozs7OztBQ2pCSDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFFc0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25CekI7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRW9DO0FBQytOO0FBQ3pOO0FBQ0o7QUFDRDs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFlBQVksZ0VBQXFCLEdBQUcsb0RBQW9ELGlOQUFFLDJDQUEyQyxPQUFPLG9EQUFZLEVBQUUsSUFBSSxPQUFPLHFEQUFhLEVBQUUsV0FBVyw2REFBa0IsWUFBWTtBQUMxTyxhQUFhLFlBQVksa0VBQXVCLEdBQUcsb0ZBQW9GLGlOQUFFLEVBQUU7QUFDM0k7QUFDQSxzRUFBMkIsR0FBRyxvREFBb0QsaU5BQUU7QUFDcEYsa0JBQWtCLG9EQUFTO0FBQzNCLFNBQVMsNEJBQTRCLE1BQU0sb0RBQVksRUFBRSxJQUFJLE1BQU0scURBQWEsRUFBRSxHQUFHO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxZQUFZLGdFQUFxQixHQUFHLG9EQUFvRCxpTkFBRSx5REFBeUQsNkRBQWtCLFlBQVk7QUFDOUwsYUFBYSxZQUFZLGtFQUF1QixHQUFHLDhHQUE4RyxpTkFBRSxFQUFFO0FBQ3JLO0FBQ0Esc0VBQTJCLEdBQUcsb0RBQW9ELGlOQUFFO0FBQ3BGLGtCQUFrQixvREFBUztBQUMzQixTQUFTLEdBQUc7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix5REFBYzs7QUFFNUM7QUFDQTtBQUNBLGlCQUFpQix5REFBVTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFlBQVksZ0VBQXFCLEdBQUcsb0RBQW9ELGlOQUFFLDBEQUEwRCw2REFBa0IsWUFBWTtBQUMvTCxhQUFhLFlBQVksa0VBQXVCLEdBQUcseU1BQXlNLGFBQWEsc0VBQXNFLHlFQUF5RSxpTkFBRSxFQUFFO0FBQzVaO0FBQ0Esc0VBQTJCLEdBQUcsb0RBQW9ELGlOQUFFO0FBQ3BGLGtCQUFrQixvREFBUztBQUMzQjtBQUNBO0FBQ0EsNEJBQTRCLHdFQUF3RTtBQUNwRztBQUNBLGlCQUFpQjtBQUNqQixTQUFTLEdBQUc7O0FBRVo7QUFDQTtBQUNBLGlCQUFpQix5REFBVTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiwyREFBTyxLQUFLLDJEQUFPO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MseURBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxZQUFZLGdFQUFxQixHQUFHLG9EQUFvRCxpTkFBRSx1Q0FBdUMsT0FBTyxvREFBWSxFQUFFLElBQUksT0FBTyxxREFBYSxFQUFFLElBQUksZ0RBQWdELFdBQVcsNkRBQWtCLFlBQVk7QUFDMVIsYUFBYSxZQUFZLGtFQUF1QixHQUFHLHdTQUF3UyxhQUFhLDZNQUE2TSx3RUFBd0UsaU5BQUUsRUFBRTtBQUNqb0I7QUFDQSxzRUFBMkIsR0FBRyxvREFBb0QsaU5BQUU7QUFDcEYsa0JBQWtCLG9EQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCLFNBQVMsNEJBQTRCLE1BQU0sb0RBQVksRUFBRSxJQUFJLE1BQU0scURBQWEsRUFBRSxJQUFJO0FBQ3RGLDBCQUEwQixtREFBUTtBQUNsQyxpQkFBaUI7QUFDakIsMEJBQTBCLGlEQUFNO0FBQ2hDO0FBQ0EsaUJBQWlCLEdBQUcsR0FBRzs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsNEJBQTRCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsMkVBQTJFO0FBQzdGLElBQUk7QUFDSjtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQix5REFBYztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsUUFBUTtBQUNSLElBQUk7QUFDSjtBQUNBO0FBQ0EsK0JBQStCLGVBQWU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHlEQUFjO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixNQUFNLE9BQU8sS0FBSywyQkFBMkIsRUFBRSxrQ0FBa0MsRUFBRSxrQ0FBa0MsS0FBSyw2Q0FBNkMsS0FBSztBQUN4TTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUksTUFBTTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUksTUFBTTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxJQUFJLFlBQVk7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUksWUFBWTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxJQUFJLFVBQVU7QUFDbEQ7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsMkJBQTJCO0FBQzdELFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyQkFBMkI7QUFDN0QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0ZBQWtGO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGFBQWE7QUFDYixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSw2QkFBNkIsZ0JBQWdCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsYUFBYTtBQUNiLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLGdCQUFnQjtBQUN0RCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0EsYUFBYTtBQUNiLGFBQWE7QUFDYixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixhQUFhO0FBQ2IsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsZ0JBQWdCO0FBQ3JELFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIseUJBQXlCO0FBQ3ZELFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDRCQUE0QjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix5QkFBeUI7QUFDdEQsU0FBUztBQUNULHNDQUFzQywyQ0FBMkM7QUFDakYsZ0NBQWdDLDRCQUE0QjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxpQkFBaUI7QUFDbEQ7QUFDQSxzQ0FBc0MsMkNBQTJDO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsV0FBVztBQUNwRCxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0Esc0NBQXNDLGlCQUFpQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDJCQUEyQjtBQUM3RCxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyQkFBMkI7QUFDN0QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHVEQUFZO0FBQzVDLGlDQUFpQyx1REFBWTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsa0JBQWtCO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLDhCQUE4QixJQUFJLHNCQUFzQjtBQUN4RCw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLElBQUkscUVBQXFFO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxrQkFBa0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDBCQUEwQjtBQUN0RDtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0Esa0dBQWtHO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBLHNDQUFzQyw4QkFBOEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0Esc0NBQXNDLDhCQUE4QjtBQUNwRTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyw4QkFBOEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxrQ0FBa0MsSUFBSTtBQUN0QztBQUNBLHNCQUFzQiw2QkFBNkI7QUFDbkQsa0NBQWtDLElBQUk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRCwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQSx3REFBd0QsOENBQThDO0FBQ3RHLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixrQ0FBa0MsSUFBSTtBQUN0QztBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDLGtDQUFrQyxJQUFJO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxxRUFBcUU7QUFDakY7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUZBQXlGLDhDQUE4QztBQUN2STtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRCwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsaUNBQWlDLElBQUk7QUFDckM7QUFDQSxvQkFBb0Isa0NBQWtDO0FBQ3REO0FBQ0EsaUNBQWlDLElBQUk7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsaUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBLFFBQVE7QUFDUjtBQUNBLGlDQUFpQyxJQUFJO0FBQ3JDLCtDQUErQztBQUMvQztBQUNBO0FBQ0Esb0JBQW9CLGNBQWM7QUFDbEM7QUFDQSx3REFBd0QsOENBQThDO0FBQ3RHLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwwQ0FBMEMsZ0JBQWdCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRixzQkFBc0I7QUFDaEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxnQkFBZ0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMscUNBQXFDO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLG9DQUFvQyx5REFBYywyQkFBMkIsNERBQTREO0FBQ3pJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLDhCQUE4QjtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixTQUFTLEVBQUUsV0FBVztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixrQkFBa0I7QUFDM0M7QUFDQSx5QkFBeUIsS0FBSztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsMkRBQWEsK0ZBQStGLElBQUk7QUFDOUg7QUFDQTtBQUNBO0FBQ0EsY0FBYywyREFBYSxrSUFBa0ksSUFBSTtBQUNqSztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQix5REFBVTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsaUJBQWlCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdURBQVk7QUFDeEM7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxrQkFBa0I7QUFDbkU7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0EsMkNBQTJDLGtCQUFrQjtBQUM3RCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EsaUNBQWlDLFdBQVc7VUFDNUM7VUFDQTs7Ozs7VUNQQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxzREFBc0Q7VUFDdEQsc0NBQXNDLGlFQUFpRTtVQUN2RztVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7Ozs7O1VDekJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBRUg7O0dBRUc7QUFFZ0M7QUFDb0I7QUFDTztBQUNpQjtBQUM4QiIsInNvdXJjZXMiOlsid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9Ob3RpZmljYXRpb25GYWN0b3JpZXMuanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL1N1YnNjcmliZXIuanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL1N1YnNjcmlwdGlvbi5qcyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvY29uZmlnLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvT3BlcmF0b3JTdWJzY3JpYmVyLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvbWFwLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9zY2hlZHVsZXIvdGltZW91dFByb3ZpZGVyLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3IuanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvYXJyUmVtb3ZlLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2NyZWF0ZUVycm9yQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvZXJyb3JDb250ZXh0LmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvbGlmdC5qcyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9ub29wLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL3JlcG9ydFVuaGFuZGxlZEVycm9yLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4vc3JjL2xpYi9hbXN0ZXJkYW0tZW1haWxhcGktcGx1Z2luLW1vZHVsZS50cyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS8uL3NyYy9saWIvYW1zdGVyZGFtLWVtYWlsYXBpLXBsdWdpbi5zcGVjaWZpY2F0aW9uLnRzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4vc3JjL2xpYi9hc3NldHMvYW1zdGVyZGFtLWVtYWlsYXBpLXBsdWdpbi1sb2dvLnRzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4vc3JjL2xpYi9hc3NldHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvLi9zcmMvbGliL2NvbXBvbmVudHMvYW1zdGVyZGFtLWVtYWlsYXBpLWNvbmZpZ3VyYXRpb24vYW1zdGVyZGFtLWVtYWlsYXBpLWNvbmZpZ3VyYXRpb24uY29tcG9uZW50LnRzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4vc3JjL2xpYi9jb21wb25lbnRzL3NlbmQtZW1haWwvc2VuZC1lbWFpbC1jb25maWd1cmF0aW9uLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS8uL3NyYy9saWIvbW9kZWxzL2NvbmZpZy50cyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS8uL3NyYy9saWIvbW9kZWxzL2luZGV4LnRzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpL2V4dGVybmFsIHdpbmRvdyBcIkBhbmd1bGFyL2NvbW1vblwiIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpL2V4dGVybmFsIHdpbmRvdyBcIkBhbmd1bGFyL2NvcmVcIiIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS9leHRlcm5hbCB3aW5kb3cgXCJAdmFsdGltby9jb21wb25lbnRzXCIiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvZXh0ZXJuYWwgd2luZG93IFwiQHZhbHRpbW8vcGx1Z2luXCIiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvZXh0ZXJuYWwgd2luZG93IFwicnhqc1wiIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpL2V4dGVybmFsIHdpbmRvdyBcInRzbGliXCIiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2Zvcm1zL2Zlc20yMDIyL2Zvcm1zLm1qcyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS93ZWJwYWNrL3J1bnRpbWUvY3JlYXRlIGZha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9hbXN0ZXJkYW0tZW1haWxhcGkvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL2Ftc3RlcmRhbS1lbWFpbGFwaS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvYW1zdGVyZGFtLWVtYWlsYXBpLy4vc3JjL3B1YmxpY19hcGkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHZhciBDT01QTEVURV9OT1RJRklDQVRJT04gPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gY3JlYXRlTm90aWZpY2F0aW9uKCdDJywgdW5kZWZpbmVkLCB1bmRlZmluZWQpOyB9KSgpO1xuZXhwb3J0IGZ1bmN0aW9uIGVycm9yTm90aWZpY2F0aW9uKGVycm9yKSB7XG4gICAgcmV0dXJuIGNyZWF0ZU5vdGlmaWNhdGlvbignRScsIHVuZGVmaW5lZCwgZXJyb3IpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5leHROb3RpZmljYXRpb24odmFsdWUpIHtcbiAgICByZXR1cm4gY3JlYXRlTm90aWZpY2F0aW9uKCdOJywgdmFsdWUsIHVuZGVmaW5lZCk7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTm90aWZpY2F0aW9uKGtpbmQsIHZhbHVlLCBlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGtpbmQ6IGtpbmQsXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob3RpZmljYXRpb25GYWN0b3JpZXMuanMubWFwIiwiaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgaXNTdWJzY3JpcHRpb24sIFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IHJlcG9ydFVuaGFuZGxlZEVycm9yIH0gZnJvbSAnLi91dGlsL3JlcG9ydFVuaGFuZGxlZEVycm9yJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBuZXh0Tm90aWZpY2F0aW9uLCBlcnJvck5vdGlmaWNhdGlvbiwgQ09NUExFVEVfTk9USUZJQ0FUSU9OIH0gZnJvbSAnLi9Ob3RpZmljYXRpb25GYWN0b3JpZXMnO1xuaW1wb3J0IHsgdGltZW91dFByb3ZpZGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIvdGltZW91dFByb3ZpZGVyJztcbmltcG9ydCB7IGNhcHR1cmVFcnJvciB9IGZyb20gJy4vdXRpbC9lcnJvckNvbnRleHQnO1xudmFyIFN1YnNjcmliZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN1YnNjcmliZXIoZGVzdGluYXRpb24pIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIGlmIChkZXN0aW5hdGlvbikge1xuICAgICAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIGlmIChpc1N1YnNjcmlwdGlvbihkZXN0aW5hdGlvbikpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5hZGQoX3RoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBFTVBUWV9PQlNFUlZFUjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFN1YnNjcmliZXIuY3JlYXRlID0gZnVuY3Rpb24gKG5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFNhZmVTdWJzY3JpYmVyKG5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgaGFuZGxlU3RvcHBlZE5vdGlmaWNhdGlvbihuZXh0Tm90aWZpY2F0aW9uKHZhbHVlKSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgaGFuZGxlU3RvcHBlZE5vdGlmaWNhdGlvbihlcnJvck5vdGlmaWNhdGlvbihlcnIpLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24oQ09NUExFVEVfTk9USUZJQ0FUSU9OLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuX25leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLl9lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuX2NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU3Vic2NyaWJlcjtcbn0oU3Vic2NyaXB0aW9uKSk7XG5leHBvcnQgeyBTdWJzY3JpYmVyIH07XG52YXIgX2JpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZDtcbmZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gX2JpbmQuY2FsbChmbiwgdGhpc0FyZyk7XG59XG52YXIgQ29uc3VtZXJPYnNlcnZlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uc3VtZXJPYnNlcnZlcihwYXJ0aWFsT2JzZXJ2ZXIpIHtcbiAgICAgICAgdGhpcy5wYXJ0aWFsT2JzZXJ2ZXIgPSBwYXJ0aWFsT2JzZXJ2ZXI7XG4gICAgfVxuICAgIENvbnN1bWVyT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHBhcnRpYWxPYnNlcnZlciA9IHRoaXMucGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAocGFydGlhbE9ic2VydmVyLm5leHQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGFydGlhbE9ic2VydmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBDb25zdW1lck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIHBhcnRpYWxPYnNlcnZlciA9IHRoaXMucGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAocGFydGlhbE9ic2VydmVyLmVycm9yKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhcnRpYWxPYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29uc3VtZXJPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXJ0aWFsT2JzZXJ2ZXIgPSB0aGlzLnBhcnRpYWxPYnNlcnZlcjtcbiAgICAgICAgaWYgKHBhcnRpYWxPYnNlcnZlci5jb21wbGV0ZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGhhbmRsZVVuaGFuZGxlZEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIENvbnN1bWVyT2JzZXJ2ZXI7XG59KCkpO1xudmFyIFNhZmVTdWJzY3JpYmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2FmZVN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2FmZVN1YnNjcmliZXIob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICB2YXIgcGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkgfHwgIW9ic2VydmVyT3JOZXh0KSB7XG4gICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIgPSB7XG4gICAgICAgICAgICAgICAgbmV4dDogKG9ic2VydmVyT3JOZXh0ICE9PSBudWxsICYmIG9ic2VydmVyT3JOZXh0ICE9PSB2b2lkIDAgPyBvYnNlcnZlck9yTmV4dCA6IHVuZGVmaW5lZCksXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yICE9PSBudWxsICYmIGVycm9yICE9PSB2b2lkIDAgPyBlcnJvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGUgIT09IG51bGwgJiYgY29tcGxldGUgIT09IHZvaWQgMCA/IGNvbXBsZXRlIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjb250ZXh0XzE7XG4gICAgICAgICAgICBpZiAoX3RoaXMgJiYgY29uZmlnLnVzZURlcHJlY2F0ZWROZXh0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfMSA9IE9iamVjdC5jcmVhdGUob2JzZXJ2ZXJPck5leHQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfMS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnVuc3Vic2NyaWJlKCk7IH07XG4gICAgICAgICAgICAgICAgcGFydGlhbE9ic2VydmVyID0ge1xuICAgICAgICAgICAgICAgICAgICBuZXh0OiBvYnNlcnZlck9yTmV4dC5uZXh0ICYmIGJpbmQob2JzZXJ2ZXJPck5leHQubmV4dCwgY29udGV4dF8xKSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG9ic2VydmVyT3JOZXh0LmVycm9yICYmIGJpbmQob2JzZXJ2ZXJPck5leHQuZXJyb3IsIGNvbnRleHRfMSksXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBvYnNlcnZlck9yTmV4dC5jb21wbGV0ZSAmJiBiaW5kKG9ic2VydmVyT3JOZXh0LmNvbXBsZXRlLCBjb250ZXh0XzEpLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIgPSBvYnNlcnZlck9yTmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBDb25zdW1lck9ic2VydmVyKHBhcnRpYWxPYnNlcnZlcik7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFNhZmVTdWJzY3JpYmVyO1xufShTdWJzY3JpYmVyKSk7XG5leHBvcnQgeyBTYWZlU3Vic2NyaWJlciB9O1xuZnVuY3Rpb24gaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgY2FwdHVyZUVycm9yKGVycm9yKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlcG9ydFVuaGFuZGxlZEVycm9yKGVycm9yKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZWZhdWx0RXJyb3JIYW5kbGVyKGVycikge1xuICAgIHRocm93IGVycjtcbn1cbmZ1bmN0aW9uIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24obm90aWZpY2F0aW9uLCBzdWJzY3JpYmVyKSB7XG4gICAgdmFyIG9uU3RvcHBlZE5vdGlmaWNhdGlvbiA9IGNvbmZpZy5vblN0b3BwZWROb3RpZmljYXRpb247XG4gICAgb25TdG9wcGVkTm90aWZpY2F0aW9uICYmIHRpbWVvdXRQcm92aWRlci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIG9uU3RvcHBlZE5vdGlmaWNhdGlvbihub3RpZmljYXRpb24sIHN1YnNjcmliZXIpOyB9KTtcbn1cbmV4cG9ydCB2YXIgRU1QVFlfT0JTRVJWRVIgPSB7XG4gICAgY2xvc2VkOiB0cnVlLFxuICAgIG5leHQ6IG5vb3AsXG4gICAgZXJyb3I6IGRlZmF1bHRFcnJvckhhbmRsZXIsXG4gICAgY29tcGxldGU6IG5vb3AsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3Vic2NyaWJlci5qcy5tYXAiLCJpbXBvcnQgeyBfX3JlYWQsIF9fc3ByZWFkQXJyYXksIF9fdmFsdWVzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgVW5zdWJzY3JpcHRpb25FcnJvciB9IGZyb20gJy4vdXRpbC9VbnN1YnNjcmlwdGlvbkVycm9yJztcbmltcG9ydCB7IGFyclJlbW92ZSB9IGZyb20gJy4vdXRpbC9hcnJSZW1vdmUnO1xudmFyIFN1YnNjcmlwdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3Vic2NyaXB0aW9uKGluaXRpYWxUZWFyZG93bikge1xuICAgICAgICB0aGlzLmluaXRpYWxUZWFyZG93biA9IGluaXRpYWxUZWFyZG93bjtcbiAgICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGFyZW50YWdlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZmluYWxpemVycyA9IG51bGw7XG4gICAgfVxuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlXzEsIF9hLCBlXzIsIF9iO1xuICAgICAgICB2YXIgZXJyb3JzO1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICB2YXIgX3BhcmVudGFnZSA9IHRoaXMuX3BhcmVudGFnZTtcbiAgICAgICAgICAgIGlmIChfcGFyZW50YWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50YWdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfcGFyZW50YWdlKSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX3BhcmVudGFnZV8xID0gX192YWx1ZXMoX3BhcmVudGFnZSksIF9wYXJlbnRhZ2VfMV8xID0gX3BhcmVudGFnZV8xLm5leHQoKTsgIV9wYXJlbnRhZ2VfMV8xLmRvbmU7IF9wYXJlbnRhZ2VfMV8xID0gX3BhcmVudGFnZV8xLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRfMSA9IF9wYXJlbnRhZ2VfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF8xLnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9wYXJlbnRhZ2VfMV8xICYmICFfcGFyZW50YWdlXzFfMS5kb25lICYmIChfYSA9IF9wYXJlbnRhZ2VfMS5yZXR1cm4pKSBfYS5jYWxsKF9wYXJlbnRhZ2VfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF9wYXJlbnRhZ2UucmVtb3ZlKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpbml0aWFsRmluYWxpemVyID0gdGhpcy5pbml0aWFsVGVhcmRvd247XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihpbml0aWFsRmluYWxpemVyKSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxGaW5hbGl6ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gZSBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IgPyBlLmVycm9ycyA6IFtlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgX2ZpbmFsaXplcnMgPSB0aGlzLl9maW5hbGl6ZXJzO1xuICAgICAgICAgICAgaWYgKF9maW5hbGl6ZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmluYWxpemVycyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2ZpbmFsaXplcnNfMSA9IF9fdmFsdWVzKF9maW5hbGl6ZXJzKSwgX2ZpbmFsaXplcnNfMV8xID0gX2ZpbmFsaXplcnNfMS5uZXh0KCk7ICFfZmluYWxpemVyc18xXzEuZG9uZTsgX2ZpbmFsaXplcnNfMV8xID0gX2ZpbmFsaXplcnNfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaW5hbGl6ZXIgPSBfZmluYWxpemVyc18xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWNGaW5hbGl6ZXIoZmluYWxpemVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMgIT09IG51bGwgJiYgZXJyb3JzICE9PSB2b2lkIDAgPyBlcnJvcnMgOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChlcnJvcnMpKSwgX19yZWFkKGVyci5lcnJvcnMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlXzJfMSkgeyBlXzIgPSB7IGVycm9yOiBlXzJfMSB9OyB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2ZpbmFsaXplcnNfMV8xICYmICFfZmluYWxpemVyc18xXzEuZG9uZSAmJiAoX2IgPSBfZmluYWxpemVyc18xLnJldHVybikpIF9iLmNhbGwoX2ZpbmFsaXplcnNfMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVW5zdWJzY3JpcHRpb25FcnJvcihlcnJvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpcHRpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0ZWFyZG93bikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0ZWFyZG93biAmJiB0ZWFyZG93biAhPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgZXhlY0ZpbmFsaXplcih0ZWFyZG93bik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGVhcmRvd24gaW5zdGFuY2VvZiBTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlYXJkb3duLmNsb3NlZCB8fCB0ZWFyZG93bi5faGFzUGFyZW50KHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGVhcmRvd24uX2FkZFBhcmVudCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKHRoaXMuX2ZpbmFsaXplcnMgPSAoX2EgPSB0aGlzLl9maW5hbGl6ZXJzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXSkucHVzaCh0ZWFyZG93bik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUuX2hhc1BhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF9wYXJlbnRhZ2UgPSB0aGlzLl9wYXJlbnRhZ2U7XG4gICAgICAgIHJldHVybiBfcGFyZW50YWdlID09PSBwYXJlbnQgfHwgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkgJiYgX3BhcmVudGFnZS5pbmNsdWRlcyhwYXJlbnQpKTtcbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUuX2FkZFBhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF9wYXJlbnRhZ2UgPSB0aGlzLl9wYXJlbnRhZ2U7XG4gICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkgPyAoX3BhcmVudGFnZS5wdXNoKHBhcmVudCksIF9wYXJlbnRhZ2UpIDogX3BhcmVudGFnZSA/IFtfcGFyZW50YWdlLCBwYXJlbnRdIDogcGFyZW50O1xuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5fcmVtb3ZlUGFyZW50ID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3BhcmVudGFnZSA9IHRoaXMuX3BhcmVudGFnZTtcbiAgICAgICAgaWYgKF9wYXJlbnRhZ2UgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50YWdlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KF9wYXJlbnRhZ2UpKSB7XG4gICAgICAgICAgICBhcnJSZW1vdmUoX3BhcmVudGFnZSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAodGVhcmRvd24pIHtcbiAgICAgICAgdmFyIF9maW5hbGl6ZXJzID0gdGhpcy5fZmluYWxpemVycztcbiAgICAgICAgX2ZpbmFsaXplcnMgJiYgYXJyUmVtb3ZlKF9maW5hbGl6ZXJzLCB0ZWFyZG93bik7XG4gICAgICAgIGlmICh0ZWFyZG93biBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGVhcmRvd24uX3JlbW92ZVBhcmVudCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLkVNUFRZID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVtcHR5ID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgICBlbXB0eS5jbG9zZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgfSkoKTtcbiAgICByZXR1cm4gU3Vic2NyaXB0aW9uO1xufSgpKTtcbmV4cG9ydCB7IFN1YnNjcmlwdGlvbiB9O1xuZXhwb3J0IHZhciBFTVBUWV9TVUJTQ1JJUFRJT04gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5leHBvcnQgZnVuY3Rpb24gaXNTdWJzY3JpcHRpb24odmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uIHx8XG4gICAgICAgICh2YWx1ZSAmJiAnY2xvc2VkJyBpbiB2YWx1ZSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnJlbW92ZSkgJiYgaXNGdW5jdGlvbih2YWx1ZS5hZGQpICYmIGlzRnVuY3Rpb24odmFsdWUudW5zdWJzY3JpYmUpKSk7XG59XG5mdW5jdGlvbiBleGVjRmluYWxpemVyKGZpbmFsaXplcikge1xuICAgIGlmIChpc0Z1bmN0aW9uKGZpbmFsaXplcikpIHtcbiAgICAgICAgZmluYWxpemVyKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaW5hbGl6ZXIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdWJzY3JpcHRpb24uanMubWFwIiwiZXhwb3J0IHZhciBjb25maWcgPSB7XG4gICAgb25VbmhhbmRsZWRFcnJvcjogbnVsbCxcbiAgICBvblN0b3BwZWROb3RpZmljYXRpb246IG51bGwsXG4gICAgUHJvbWlzZTogdW5kZWZpbmVkLFxuICAgIHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmc6IGZhbHNlLFxuICAgIHVzZURlcHJlY2F0ZWROZXh0Q29udGV4dDogZmFsc2UsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uZmlnLmpzLm1hcCIsImltcG9ydCB7IF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9wZXJhdG9yU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgb25OZXh0LCBvbkNvbXBsZXRlLCBvbkVycm9yLCBvbkZpbmFsaXplKSB7XG4gICAgcmV0dXJuIG5ldyBPcGVyYXRvclN1YnNjcmliZXIoZGVzdGluYXRpb24sIG9uTmV4dCwgb25Db21wbGV0ZSwgb25FcnJvciwgb25GaW5hbGl6ZSk7XG59XG52YXIgT3BlcmF0b3JTdWJzY3JpYmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoT3BlcmF0b3JTdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE9wZXJhdG9yU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgb25OZXh0LCBvbkNvbXBsZXRlLCBvbkVycm9yLCBvbkZpbmFsaXplLCBzaG91bGRVbnN1YnNjcmliZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBkZXN0aW5hdGlvbikgfHwgdGhpcztcbiAgICAgICAgX3RoaXMub25GaW5hbGl6ZSA9IG9uRmluYWxpemU7XG4gICAgICAgIF90aGlzLnNob3VsZFVuc3Vic2NyaWJlID0gc2hvdWxkVW5zdWJzY3JpYmU7XG4gICAgICAgIF90aGlzLl9uZXh0ID0gb25OZXh0XG4gICAgICAgICAgICA/IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uTmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IF9zdXBlci5wcm90b3R5cGUuX25leHQ7XG4gICAgICAgIF90aGlzLl9lcnJvciA9IG9uRXJyb3JcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogX3N1cGVyLnByb3RvdHlwZS5fZXJyb3I7XG4gICAgICAgIF90aGlzLl9jb21wbGV0ZSA9IG9uQ29tcGxldGVcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogX3N1cGVyLnByb3RvdHlwZS5fY29tcGxldGU7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgT3BlcmF0b3JTdWJzY3JpYmVyLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkVW5zdWJzY3JpYmUgfHwgdGhpcy5zaG91bGRVbnN1YnNjcmliZSgpKSB7XG4gICAgICAgICAgICB2YXIgY2xvc2VkXzEgPSB0aGlzLmNsb3NlZDtcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUudW5zdWJzY3JpYmUuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICFjbG9zZWRfMSAmJiAoKF9hID0gdGhpcy5vbkZpbmFsaXplKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBPcGVyYXRvclN1YnNjcmliZXI7XG59KFN1YnNjcmliZXIpKTtcbmV4cG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T3BlcmF0b3JTdWJzY3JpYmVyLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgY3JlYXRlT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIG1hcChwcm9qZWN0LCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoZnVuY3Rpb24gKHNvdXJjZSwgc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKGNyZWF0ZU9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwcm9qZWN0LmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4KyspKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuZXhwb3J0IHZhciB0aW1lb3V0UHJvdmlkZXIgPSB7XG4gICAgc2V0VGltZW91dDogZnVuY3Rpb24gKGhhbmRsZXIsIHRpbWVvdXQpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlbGVnYXRlID0gdGltZW91dFByb3ZpZGVyLmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUgPT09IG51bGwgfHwgZGVsZWdhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlbGVnYXRlLnNldFRpbWVvdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5zZXRUaW1lb3V0LmFwcGx5KGRlbGVnYXRlLCBfX3NwcmVhZEFycmF5KFtoYW5kbGVyLCB0aW1lb3V0XSwgX19yZWFkKGFyZ3MpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtoYW5kbGVyLCB0aW1lb3V0XSwgX19yZWFkKGFyZ3MpKSk7XG4gICAgfSxcbiAgICBjbGVhclRpbWVvdXQ6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gdGltZW91dFByb3ZpZGVyLmRlbGVnYXRlO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuY2xlYXJUaW1lb3V0KSB8fCBjbGVhclRpbWVvdXQpKGhhbmRsZSk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVvdXRQcm92aWRlci5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi9jcmVhdGVFcnJvckNsYXNzJztcbmV4cG9ydCB2YXIgVW5zdWJzY3JpcHRpb25FcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiBVbnN1YnNjcmlwdGlvbkVycm9ySW1wbChlcnJvcnMpIHtcbiAgICAgICAgX3N1cGVyKHRoaXMpO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBlcnJvcnNcbiAgICAgICAgICAgID8gZXJyb3JzLmxlbmd0aCArIFwiIGVycm9ycyBvY2N1cnJlZCBkdXJpbmcgdW5zdWJzY3JpcHRpb246XFxuXCIgKyBlcnJvcnMubWFwKGZ1bmN0aW9uIChlcnIsIGkpIHsgcmV0dXJuIGkgKyAxICsgXCIpIFwiICsgZXJyLnRvU3RyaW5nKCk7IH0pLmpvaW4oJ1xcbiAgJylcbiAgICAgICAgICAgIDogJyc7XG4gICAgICAgIHRoaXMubmFtZSA9ICdVbnN1YnNjcmlwdGlvbkVycm9yJztcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG4gICAgfTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VW5zdWJzY3JpcHRpb25FcnJvci5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gYXJyUmVtb3ZlKGFyciwgaXRlbSkge1xuICAgIGlmIChhcnIpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gICAgICAgIDAgPD0gaW5kZXggJiYgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyUmVtb3ZlLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFcnJvckNsYXNzKGNyZWF0ZUltcGwpIHtcbiAgICB2YXIgX3N1cGVyID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIEVycm9yLmNhbGwoaW5zdGFuY2UpO1xuICAgICAgICBpbnN0YW5jZS5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICAgIH07XG4gICAgdmFyIGN0b3JGdW5jID0gY3JlYXRlSW1wbChfc3VwZXIpO1xuICAgIGN0b3JGdW5jLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgICBjdG9yRnVuYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yRnVuYztcbiAgICByZXR1cm4gY3RvckZ1bmM7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGVFcnJvckNsYXNzLmpzLm1hcCIsImltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG52YXIgY29udGV4dCA9IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gZXJyb3JDb250ZXh0KGNiKSB7XG4gICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHZhciBpc1Jvb3QgPSAhY29udGV4dDtcbiAgICAgICAgaWYgKGlzUm9vdCkge1xuICAgICAgICAgICAgY29udGV4dCA9IHsgZXJyb3JUaHJvd246IGZhbHNlLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG4gICAgICAgIGNiKCk7XG4gICAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IGNvbnRleHQsIGVycm9yVGhyb3duID0gX2EuZXJyb3JUaHJvd24sIGVycm9yID0gX2EuZXJyb3I7XG4gICAgICAgICAgICBjb250ZXh0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjYigpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlRXJyb3IoZXJyKSB7XG4gICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nICYmIGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dC5lcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIGNvbnRleHQuZXJyb3IgPSBlcnI7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3JDb250ZXh0LmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzRnVuY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gaGFzTGlmdChzb3VyY2UpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihzb3VyY2UgPT09IG51bGwgfHwgc291cmNlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzb3VyY2UubGlmdCk7XG59XG5leHBvcnQgZnVuY3Rpb24gb3BlcmF0ZShpbml0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgaWYgKGhhc0xpZnQoc291cmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KGZ1bmN0aW9uIChsaWZ0ZWRTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5pdChsaWZ0ZWRTb3VyY2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmFibGUgdG8gbGlmdCB1bmtub3duIE9ic2VydmFibGUgdHlwZScpO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1saWZ0LmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBub29wKCkgeyB9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub29wLmpzLm1hcCIsImltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyB0aW1lb3V0UHJvdmlkZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvdGltZW91dFByb3ZpZGVyJztcbmV4cG9ydCBmdW5jdGlvbiByZXBvcnRVbmhhbmRsZWRFcnJvcihlcnIpIHtcbiAgICB0aW1lb3V0UHJvdmlkZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvblVuaGFuZGxlZEVycm9yID0gY29uZmlnLm9uVW5oYW5kbGVkRXJyb3I7XG4gICAgICAgIGlmIChvblVuaGFuZGxlZEVycm9yKSB7XG4gICAgICAgICAgICBvblVuaGFuZGxlZEVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlcG9ydFVuaGFuZGxlZEVycm9yLmpzLm1hcCIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNS0yMDI0LiBSaXRlbnNlIEJWLCB0aGUgTmV0aGVybGFuZHMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgRVVQTCwgVmVyc2lvbiAxLjIgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwczovL2pvaW51cC5lYy5ldXJvcGEuZXUvY29sbGVjdGlvbi9ldXBsL2V1cGwtdGV4dC1ldXBsLTEyXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuICpcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QW1zdGVyZGFtRW1haWxhcGlDb25maWd1cmF0aW9uQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvYW1zdGVyZGFtLWVtYWlsYXBpLWNvbmZpZ3VyYXRpb24vYW1zdGVyZGFtLWVtYWlsYXBpLWNvbmZpZ3VyYXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtQTFVHSU5TX1RPS0VOLCBQbHVnaW5UcmFuc2xhdGVQaXBlTW9kdWxlfSBmcm9tICdAdmFsdGltby9wbHVnaW4nO1xuXG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7Rm9ybU1vZHVsZSwgSW5wdXRNb2R1bGV9IGZyb20gXCJAdmFsdGltby9jb21wb25lbnRzXCI7XG5pbXBvcnQge1NlbmRFbWFpbENvbmZpZ3VyYXRpb25Db21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudHMvc2VuZC1lbWFpbC9zZW5kLWVtYWlsLWNvbmZpZ3VyYXRpb24uY29tcG9uZW50XCI7XG5pbXBvcnQge2Ftc3RlcmRhbUVtYWlsYXBpUGx1Z2luU3BlY2lmaWNhdGlvbn0gZnJvbSAnLi9hbXN0ZXJkYW0tZW1haWxhcGktcGx1Z2luLnNwZWNpZmljYXRpb24nO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBbXN0ZXJkYW1FbWFpbGFwaUNvbmZpZ3VyYXRpb25Db21wb25lbnQsXG4gICAgU2VuZEVtYWlsQ29uZmlndXJhdGlvbkNvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBQbHVnaW5UcmFuc2xhdGVQaXBlTW9kdWxlLCBGb3JtTW9kdWxlLCBJbnB1dE1vZHVsZSwgRm9ybXNNb2R1bGUsIFBsdWdpblRyYW5zbGF0ZVBpcGVNb2R1bGUsIEZvcm1Nb2R1bGUsIEZvcm1Nb2R1bGUsIEZvcm1Nb2R1bGUsIEZvcm1Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgQW1zdGVyZGFtRW1haWxhcGlDb25maWd1cmF0aW9uQ29tcG9uZW50LFxuICAgIFNlbmRFbWFpbENvbmZpZ3VyYXRpb25Db21wb25lbnRcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogUExVR0lOU19UT0tFTixcbiAgICAgIHVzZVZhbHVlOiBbXG4gICAgICAgIGFtc3RlcmRhbUVtYWlsYXBpUGx1Z2luU3BlY2lmaWNhdGlvbixcbiAgICAgIF1cbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQW1zdGVyZGFtRW1haWxhcGlQbHVnaW5Nb2R1bGUge31cbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNS0yMDI0LiBSaXRlbnNlIEJWLCB0aGUgTmV0aGVybGFuZHMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgRVVQTCwgVmVyc2lvbiAxLjIgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwczovL2pvaW51cC5lYy5ldXJvcGEuZXUvY29sbGVjdGlvbi9ldXBsL2V1cGwtdGV4dC1ldXBsLTEyXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuICpcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge1BsdWdpblNwZWNpZmljYXRpb259IGZyb20gJ0B2YWx0aW1vL3BsdWdpbic7XG5pbXBvcnQge0Ftc3RlcmRhbUVtYWlsYXBpQ29uZmlndXJhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Ftc3RlcmRhbS1lbWFpbGFwaS1jb25maWd1cmF0aW9uL2Ftc3RlcmRhbS1lbWFpbGFwaS1jb25maWd1cmF0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQge0FNU1RFUkRBTV9FTUFJTEFQSV9QTFVHSU5fTE9HT19CQVNFNjR9IGZyb20gJy4vYXNzZXRzJztcbmltcG9ydCB7U2VuZEVtYWlsQ29uZmlndXJhdGlvbkNvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50cy9zZW5kLWVtYWlsL3NlbmQtZW1haWwtY29uZmlndXJhdGlvbi5jb21wb25lbnRcIjtcblxuY29uc3QgYW1zdGVyZGFtRW1haWxhcGlQbHVnaW5TcGVjaWZpY2F0aW9uOiBQbHVnaW5TcGVjaWZpY2F0aW9uID0ge1xuICBwbHVnaW5JZDogJ2Ftc3RlcmRhbWVtYWlsYXBpJyxcbiAgcGx1Z2luQ29uZmlndXJhdGlvbkNvbXBvbmVudDogQW1zdGVyZGFtRW1haWxhcGlDb25maWd1cmF0aW9uQ29tcG9uZW50LFxuICBwbHVnaW5Mb2dvQmFzZTY0OiBBTVNURVJEQU1fRU1BSUxBUElfUExVR0lOX0xPR09fQkFTRTY0LFxuICBmdW5jdGlvbkNvbmZpZ3VyYXRpb25Db21wb25lbnRzOiB7XG4gICAgJ3plbmQtZW1haWwnOiBTZW5kRW1haWxDb25maWd1cmF0aW9uQ29tcG9uZW50XG4gIH0sXG4gIHBsdWdpblRyYW5zbGF0aW9uczoge1xuICAgIG5sOiB7XG4gICAgICB0aXRsZTogJ0Ftc3RlcmRhbSBFbWFpbCBBUEknLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgJ01ldCBkZSBBbXN0ZXJkYW0gRW1haWwgQVBJIHBsdWdpbiBrdW4gamUgaW4gZWVuIHByb2Nlc3MgZW1haWxzIHZlcnN0dXJlbicsXG4gICAgICBjb25maWd1cmF0aW9uVGl0bGU6ICdDb25maWd1cmF0aWVuYWFtJyxcbiAgICAgIGNvbmZpZ3VyYXRpb25UaXRsZVRvb2x0aXA6XG4gICAgICAgICAgJ09uZGVyIGRlemUgbmFhbSB6YWwgZGUgcGx1Z2luIHRlIGhlcmtlbm5lbiB6aWpuIGluIGRlIHJlc3QgdmFuIGRlIGFwcGxpY2F0aWUnLFxuICAgICAgY2xpZW50SWQ6ICdDbGllbnQgSUQnLFxuICAgICAgY2xpZW50SWRUb29sdGlwOlxuICAgICAgICAgICdWdWwgaGllciBoZXQgY2xpZW50SWQgaW4gZGF0IGdlY29uZmlndXJlZXJkIHN0YWF0IGluIGRlIGF1dG9yaXNhdGllIHNlcnZlciB3YWFyIGRlIEVtYWlsIEFQSSBuYWFyIGtpamt0LiBHZXdvb25saWprIGlzIGRhdCBLZXljbG9hayAuIERpdCBjbGllbnRJZCBtb2V0IGRlIGp1aXN0ZSBhdXRvcmlzYXRpZSBoZWJiZW4gdm9vciBkZSBiZW5vZGlnZGUgZnVuY3Rpb25hbGl0ZWl0JyxcbiAgICAgIGNsaWVudFNlY3JldDogJ1NlY3JldCcsXG4gICAgICBjbGllbnRTZWNyZXRUb29sdGlwOiAnVnVsIGRlIHNlY3JldCBpbiBkaWUgaG9vcnQgYmlqIGRlIGNsaWVudElkIGhpZXJib3ZlbicsXG4gICAgICBlbWFpbEFwaUJhc2VVcmw6ICdFbWFpbCBBUEkgYmFzZSBVUkwnLFxuICAgICAgZW1haWxBcGlCYXNlVXJsVG9vbHRpcDogJ1Z1bCBoaWVyIGRlIGJhc2UgdXJsIGluIHZhbiBkZSBFbWFpbCBBUEkgaW5jbHVzaWVmIHBhZCBlaW5kaWdlbmQgb3AgLi4vbWFpbCcsXG4gICAgICB0b2tlbkVuZHBvaW50OiAnVG9rZW4gZW5kcG9pbnQnLFxuICAgICAgdG9rZW5FbmRwb2ludFRvb2x0aXA6ICdWdWwgaGllciBoZXQgb3BlbmlkIHRva2VuIGVuZHBvaW50IG9tIGhldCB0b2tlbiBvcCB0ZSB2cmFnZW4nLFxuICAgICAgdG9FbWFpbDogXCJFbWFpbCB2ZXJ6ZW5kIGFkcmVzXCIsXG4gICAgICB0b05hbWU6IFwiTmFhbSB2YW4gb250dmFuZ2VyXCIsXG4gICAgICBmcm9tQWRkcmVzczogXCJBZnplbmRlclwiLFxuICAgICAgZW1haWxTdWJqZWN0OiBcIk9uZGVyd2VycFwiLFxuICAgICAgY29udGVudEh0bWw6IFwiYm9keSB2YW4gZW1haWxcIixcbiAgICAgIGNjRW1haWw6IFwiY2MgZW1haWxcIixcbiAgICAgIGNjTmFtZTogXCJjYyBuYWFtXCIsXG4gICAgICBiY2NFbWFpbDogXCJiY2MgZW1haWxcIixcbiAgICAgIGJjY05hbWU6IFwiYmNjIG5hYW1cIixcbiAgICB9LFxuICAgIGVuOiB7XG4gICAgICB0aXRsZTogJ0Ftc3RlcmRhbSBFbWFpbCBBUEknLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgJ0FsZnJlc2NvIGlzIGEgZG9jdW1lbnQgbWFuYWdlbWVudCBzeXN0ZW0gdGhhdCBpbXBsZW1lbnRzIHRoZSBEb2N1bWVudCBBUEkgc3RhbmRhcmQgZm9yIGNhc2Utb3JpZW50ZWQgd29ya2luZyAodGhlIFpHVyBBUElzKS4gV2l0aCB0aGlzIHBsdWdpbiB5b3UgY2FuIHVzZSBPQXV0aCBjbGllbnQgY3JlZGVudGlhbHMgdG8gbGluayB3aXRoIEFsZnJlc2NvJyxcbiAgICAgIGNvbmZpZ3VyYXRpb25UaXRsZTogJ0NvbmZpZ3VyYXRpb24gbmFtZScsXG4gICAgICBjb25maWd1cmF0aW9uVGl0bGVUb29sdGlwOlxuICAgICAgICAgICdVbmRlciB0aGlzIG5hbWUsIHRoZSBwbHVnaW4gd2lsbCBiZSByZWNvZ25pemFibGUgaW4gdGhlIHJlc3Qgb2YgdGhlIGFwcGxpY2F0aW9uJyxcbiAgICAgIGNsaWVudElkOiAnQ2xpZW50IElEJyxcbiAgICAgIGNsaWVudElkVG9vbHRpcDpcbiAgICAgICAgICAnRW50ZXIgdGhlIGNsaWVudElkIGhlcmUgd2hpY2ggaXMgY29uZmlndXJlZCB1bmRlciBPcGVuWmFhayBtYW5hZ2VtZW50IGZvciBBbGZyZXNjbyAoc2VlIEFQSSBhdXRob3JpemF0aW9ucyA+IEFwcGxpY2F0aW9ucykuIFRoaXMgY2xpZW50SWQgbXVzdCBoYXZlIHRoZSBjb3JyZWN0IGF1dGhvcml6YXRpb25zIGZvciB0aGUgcmVxdWlyZWQgZnVuY3Rpb25hbGl0eScsXG4gICAgICBjbGllbnRTZWNyZXQ6ICdTZWNyZXQnLFxuICAgICAgY2xpZW50U2VjcmV0VG9vbHRpcDogJ0VudGVyIHRoZSBzZWNyZXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbGllbnRJZCBhYm92ZScsXG4gICAgICBlbWFpbEFwaUJhc2VVcmw6ICdFbWFpbCBBUEkgYmFzZSBVUkwnLFxuICAgICAgZW1haWxBcGlCYXNlVXJsVG9vbHRpcDogJ0VudGVyIHRoZSBiYXNlIFVSTCBvZiB0aGUgRW1haWwgQVBJIGhlcmUsIGluY2x1ZGluZyB0aGUgcGF0aCBlbmRpbmcgaW4gLi4vbWFpbCcsXG4gICAgICB0b2tlbkVuZHBvaW50OiAnVG9rZW4gZW5kcG9pbnQnLFxuICAgICAgdG9rZW5FbmRwb2ludFRvb2x0aXA6ICdFbnRlciB0aGUgb3BlbmlkIHRva2VuIGVuZHBvaW50IGhlcmUgdG8gcmVxdWVzdCB0aGUgdG9rZW4nLFxuICAgICAgdG9FbWFpbDogXCJFbWFpbCBUbyBhZGRyZXNzXCIsXG4gICAgfSxcbiAgICBkZToge1xuICAgICAgdGl0bGU6ICdBbXN0ZXJkYW0gRW1haWwgQVBJJyxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICdPcGVuTm90aWZpY2F0aWVzIGlzdCBlaW5lIGRvY3VtZW50IG1hbmFnZW1lbnQgc3lzdGVtLCBkaWUgZGVuIERvY3VtZW50IEFQSS1TdGFuZGFyZCBmw7xyIGZhbGxvcmllbnRpZXJ0ZXMgQXJiZWl0ZW4gKGRpZSBaR1ctQVBJcykgaW1wbGVtZW50aWVydC4gTWl0IGRpZXNlbSBQbHVnaW4ga8O2bm5lbiBTaWUgQ2xpZW50LVp1Z2FuZ3NkYXRlbiDDvGJlciBPQXV0aCBtaXQgQWxmcmVzY28gdmVya27DvHBmZW4nLFxuICAgICAgY29uZmlndXJhdGlvblRpdGxlOiAnS29uZmlndXJhdGlvbnNuYW1lJyxcbiAgICAgIGNvbmZpZ3VyYXRpb25UaXRsZVRvb2x0aXA6XG4gICAgICAgICAgJ1VudGVyIGRpZXNlbSBOYW1lbiB3aXJkIGRhcyBQbHVnaW4gaW0gUmVzdCBkZXIgQW53ZW5kdW5nIGVya2VubmJhciBzZWluJyxcbiAgICAgIGNsaWVudElkOiAnQ2xpZW50IElEJyxcbiAgICAgIGNsaWVudElkVG9vbHRpcDpcbiAgICAgICAgICAnR2ViZW4gU2llIGhpZXIgZGllIGNsaWVudElkIGVpbiwgZGllIHVudGVyIE9wZW5aYWFrLVZlcndhbHR1bmcga29uZmlndXJpZXJ0IGZ1ciBBbGZyZWNvIGlzdCAoc2llaGUgQVBJLUJlcmVjaHRpZ3VuZ2VuID4gQW53ZW5kdW5nZW4pLiBEaWVzZSBjbGllbnRJZCBtdXNzIGRpZSByaWNodGlnZW4gQmVyZWNodGlndW5nZW4gZsO8ciBkaWUgZXJmb3JkZXJsaWNoZSBGdW5rdGlvbmFsaXTDpHQgaGFiZW4nLFxuICAgICAgY2xpZW50U2VjcmV0OiAnU2VjcmV0JyxcbiAgICAgIGNsaWVudFNlY3JldFRvb2x0aXA6ICdHZWJlbiBTaWUgZGFzIG1pdCBkZXIgb2JpZ2VuIGNsaWVudElkIHZlcmtuw7xwZnRlIEdlaGVpbW5pcyBlaW4nLFxuICAgICAgZW1haWxBcGlCYXNlVXJsOiAnRW1haWwgQVBJIGJhc2UgVVJMJyxcbiAgICAgIGVtYWlsQXBpQmFzZVVybFRvb2x0aXA6ICdHZWJlbiBTaWUgaGllciBkaWUgQmFzaXMtVVJMIGRlciBFLU1haWwtQVBJIGVpbiwgZWluc2NobGllw59saWNoIGRlcyBQZmFkcywgZGVyIGF1ZiAuLi9tYWlsIGVuZGV0JyxcbiAgICAgIHRva2VuRW5kcG9pbnQ6ICdUb2tlbiBlbmRwb2ludCcsXG4gICAgICB0b2tlbkVuZHBvaW50VG9vbHRpcDogJ0dlYmVuIFNpZSBoaWVyIGRlbiBPcGVuSUQtVG9rZW4tRW5kcHVua3QgZWluLCB1bSBkYXMgVG9rZW4gYW56dWZvcmRlcm4nLFxuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQge2Ftc3RlcmRhbUVtYWlsYXBpUGx1Z2luU3BlY2lmaWNhdGlvbn07XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUtMjAyNC4gUml0ZW5zZSBCViwgdGhlIE5ldGhlcmxhbmRzLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIEVVUEwsIFZlcnNpb24gMS4yICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cHM6Ly9qb2ludXAuZWMuZXVyb3BhLmV1L2NvbGxlY3Rpb24vZXVwbC9ldXBsLXRleHQtZXVwbC0xMlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbiAqXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuY29uc3QgQU1TVEVSREFNX0VNQUlMQVBJX1BMVUdJTl9MT0dPX0JBU0U2NCA9XG4nZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFPRUFBQURoQ0FZQUFBQStzOUo2QUFBQUlHTklVazBBQUhvbUFBQ0FoQUFBK2dBQUFJRG9BQUIxTUFBQTZtQUFBRHFZQUFBWGNKeTZVVHdBQUFBR1lrdEhSQUQvQVA4QS82QzlwNU1BQUFBSmNFaFpjd0FBTGlNQUFDNGpBWGlsUDNZQUFBQUhkRWxOUlFmb0FSY09Md2pRTk9pTUFBQWVUVWxFUVZSNDJ1MmRlMVJUVjc3SHZ3a0pnVWdTSVFrSUJxUUlDRlNLbzRCZGdxS0MwZ2N5UG1aYXE3YTliZTNjMjNXZDY5UjE1eTY3NXJxbWE4MTB6YlRUMVZtZDJsbWQyN25PcW84MVR0dlJ1Wlhhb1ZnZG5XSmJIek1xRmhVc1ZVRGU0UkZLU0Fnazl3OGE1SkZBY3M1SjlrbnkrL3hWY2pibi9BN054LzM2N2IwbERvZkRBWUlwdHVFUkRGcHRHTEFNb2Q5c0JRRGNhdXNadTM2bnN3K0RWcHZYOTQxVXlERlhyeG43T1hsT05BQkFwVlJnVmtRNEloVnl5R1ZockY4LzVKR1FoUDVqMEdxRDJUSUVvOG1NOXU1djBOTnZSbk5uSCt1d1lOQnJFSzFTSWk0bUNscTFFc3B2QlNYOEEwbm9JK3gyQjNyNnpXanBNcUcxdXg4M203dFloK1ExcVFZZDRtTlVTTkNwRWExU1FpcVZzQTRwS0NFSkJjSnVkNkM5cHgvTkhYMW9hREhDYURLekRrbHd0R29sVWhLME1NUnFFQmV0SWlrRmdpVGt3YURWaHFhT1hseS8zU0dLWnFXL01lZzF5SmdYaThUWTJkUjg1UUZKNkNXRFZodHVObmVoOWxaN1VOWjJYTkdxbGNoS2prT3FRVWRDZWdsSjZBRWtubmVRa041QkVyckIyY2M3ZjYwcEpKdWFRbUhRYTVDWG1VaDl5R2tnQ1NkaEdyRGdSbU1ucm43ZHhtbHVqbkJOcEVLT2hmZk13WUlrUGRTeklsaUhJeXBJd204eDlnM2dZdDJkZ0p4S0NEUlNEVG9zU1o4THJXWVc2MUJFUVVoTDZHeHlucm5VUUgwOUJtalZTcXhZbEJMeVRkV1FsYkN1cVJQVk5iZW95U2tDSWhWeUZHUW5JejFSenpvVUpvU2NoSzFHRTlWOElzVlpNOFpyMWF4RDhTc2hJeUhKRnppRW1veEJMNkZwd0lMUGF4dHB3Q1VBU1RYb2NIOVdVdENQcGdhdGhMYmhFVnlxYjhINTYwMnNReUY0a3BlUmlFVnBDVUc3N0Nvb0phUkJsK0FqbUFkdmdrckNRYXNOVmVmcktNTWxpREhvTlZpVGx4NVU2WEJCSWFIZDdzRE5PMTA0Y2FHZWRTaUVueWpKVFVQcVhGMVF6QzhHdklSVSs0VXV3VklyQnJTRWRVMmRWUHNSS01sTkMraStZa0JLYUJzZXdhbC9ma1hURHNRWXFRWWRWbjFuZmtDT29BYWNoTWErQVh4UVhVc2puOFFVSWhWeWxCZGtCVnhpZUVCSlNNMVB3aE1DclhrYUVCTGE3UTVVMTl4Q1RVTXI2MUNJQUNFN0pSNEYyY2tCTVhvcWVna0hyVFo4OE9tWGxQTkplSTFXclVSNTRiMmlIejBWdFlTbUFRditmTHFHK244RVp5SVZjbXdxeWhaMS9xbG9KV3cxbW5EMHpGWFdZUkJCd29ZVkMwVzdLa09VRXRJQURPRUx4RHBnSXpvSnoxOXJvcFVQaE0vSXkwaEVYbVlpNnpBbUlHVWR3SGhJUU1MWG5ML2VoUFBYeFBVZEU0MkVKQ0RoTDhRbUl2UG1xTjN1UU1YWldrckFKdnlPUWE5QjJiSXM1bk9Kekd0Q0VwQmdSWE5uSHlyTzFySU9nNjJFdE1VOHdacm16ajdtVFZObUVsSWZrQkFMclB1SVRDUWtBUW14d1ZKRXYwdFkxOVJKQWhLaTVQejFKdFExZGZyOXVYNlZzTlZvb2t3WVF0U2N1RkNQVnFQSnI4LzBtNFNtQVF2bGdoSUJ3ZEV6VjJFYXNQanRlWDZSY05CcXc1OVAxL2p0cFFpQ0wvNWN2ZU56Q2UxMkJ6NzQ5RXRhamtRRUZNNTFySGE3NzNOWmZDNWhkYzB0V3BCTEJDUkdreG5WTmJkOC9oeWZTbGpYMUVsYlVoQUJUVTFEcTg5SFRIMG1vYkZ2Z0VaQ2lhRGd4SVY2R1BzR2ZIWi9uMGhvR3g3QkI5WHNjL0lJUWlnK3FLNkZiWGpFSi9mMmlZU24vdmtWRGNRUVFjV2cxWVpULy96S0ovY1dYTUs2cGs3YUdac0lTbTQyZC9ta2Z5aW9oSU5XRy9VRGlhRG14SVY2d1Z0NWdrbG90enRRZGI3TzczOFVndkEzVmVmckJKMC9GRXpDbTNlNmFHMGdFUkkwZC9iaDVoM2h1bHlDU0VqTlVDTFVFTEpaS29pRTFBd2xRaEdodnZlOEpheHI2cVJtS0JHU05IZjJDVEpheWt0QzIvQ0lYM0xyQ0VLc1ZOZmM0ajJKejB2Q1MvVXROQ2xQaERTRFZoc3UxYmZ3dWdkbkNVMERGdHFtZ2lBd3VpMEduMFhBbkNYOHZMYVI5YnNUaEdqZzR3TW5DVnVOSmtwTkk0aHgzR3p1NHJ3M0RTY0p6MXhxWVAzT0JDRTZ1SHJodFlTdFJoT3RsQ2NJRnhoTlprNjFvZGNTVWkxSUVPN2g0b2ZNbThKMVRaMmlyZ1ZWU2dYckVHWWtXaFVKaGR5clB6c3hpWDZ6RmIzZkRNSXlOTXc2bENrWVRXYlVOWFY2ZFNLd3g5OEd1OTBoeW9sNWlRUW9XWktHTkJFZWcwejRscWFPWGxTY3JZVzR6cG9lbmNCUG5hdnorTWcxajV1ajdUMzlvcHVZbDRWSjhlUUR1U1JnaUpJWU94c0YyY21zdzVqQ29OV0c5cDUrajh0N0xLRVkrNElKT2pXVUVlR3N3eUFZRXExU3NnN0JKZDc0NHBHRXhyNEJVZllGaytKbXN3NkJZSXhXTFU0SmpTYXp4enUwZVNUaHhibzdyTi9KSlpkdjBwNm1vYzZGRzgyc1EzQ0xwOTdNS0tGcHdDTGE3Smgrc3hYMURJNnlJc1NCMlRLRTY3YzdXSWZobHB2TlhSN2xsTTRvNFkxR2NYL0pUMXlzeDdscmxNY2FhalIxOU9MZ3gvL0E4SWlkZFNqVDRvay8wMHBvdHp0dzllczIxdTh4TFE0SGNPRjZNNGtZUWppbkpzUXVJQUJjL2JwdHhrMmhwcFZRak5NUzdpQVJRd094emcyNnc1UHBpbWtsWkhXR04xY3VYRyttL1c2Q21QcW16b0FTME1sTUhybVZjTkJxQzhpOVkrcWJ1M0NFRGlRTk9zNWRhMFRWaGZxQUV4QVkzWXRtdWhhbFd3bkZPaUxxQ1czZC9TUmlFSEh1V2lNdVhCZnZWSVFuVE9lVFd3bHJiN1d6anBzWFRoSE5saUhXb1JBOENBWUJnZWw5Y2luaG9OVW15Z3daYjJucjdzZmhUeTZSaUFIS2tkTTFRU0VnTUpwQjQ2NUo2bExDUUc2S1RzWXlORXdpQmlCSFR0ZWdyZHZ6Sk9oQXdKMVhMaVVNOUtib1pKd2lkdm53dEZWQ09JSlJRTUM5VjFNa0RKYW02R1FzUThONDc5UmxOSFgwc2c2RmNJUFpNb1REbjF3S1NnRUI5MDNTS1JJRzg1ZlU0UUFxenRZRzlUc0dLazRCdTRPd0FoaVBxKy9lRkFuRm5CQXJCQ1NpK0hBS0tNYnRLb1RHbFY4VEpMVGJIUUU1UWU4dERnZHdyTHFXMHR4RVFDZ0pDSXhPM0UvT0paMnd4NHczUy9LREFlZndkMzVtRXV0UVFwSkF5d01WaXZhZWZzUnIxV00vVDZnSm16dUN2eGFjRENWK3N5RlVCUVNtZWpaQndvWVdJK3Y0bUhEaGVqT2x1Zm1SVUJZUW1PclptSVIydXlNb3B5WThoZkpOL2NPVnIxcENXa0JnZEtwaWZMOXdyRS9ZMHgrNEFpNU1tWVBjQlFZb0k4Sng3bG9qYmpSMm90OXM5Zm8rVGhFM0ZtV3pmcVdnaEc4ZXFFUUNwTTdWb1NBN0dVYVRHViszZHVOcWc3Z1huYnVqcDk4TXJXWVdnSEUxWVVzWHR4TmxXTE13WlE1VzVLU01iWDJZbjVtRXgwdVhZRTZNaXRQOTJycjdjYUR5SXFXNUNZd1FBcFl0eThLYXZIUW9JOEtSR0RzYkszSlNFQ1BTM2RabVlyeHZZeEsyQm1pV1F1NENnOHZQTnhabGN4YXgzMnlsZkZNQjRTdGdSTGdNMzErVmc4VFkyVk91bFJka1FlTFpSdGVpWXJ4dll4SUdZdEoyUkxoczJzMS8rWWhJaWQvQ3dIY2xSRVM0REp1TEYwSDNiZE50TXNxSWNLVE8xYkYrVGE4Wjc1c1VRTURzSXpNWnVTeHN4akliaTdLeE1HVU9wL3RiaG9aeDhPTi9VSFlOUi9nbVlqc0ZETlpkMXAzZVNRRUUvYi8ySzNKU2tKdGg0UFM3d3lOMlNuUGpBRjhCNThTb2dscEE0SzUzVWdBaE1UV1JuNW5FV1VUS04vVWNzMlVJQnlvdjhoWndZMUYyVUFzSTNQVk9DZ0R0M2Qrd2pzY3ZPRVhrMHBGM2luamxxeGJXcnlGYW5IbWdYS2FIbkRnRkRBV2Mza21Cd0o0ajlKYjh6Q1NVTGVNMm91WndBSjlldVVWcGJpNFFJaEY3WWNxY2tCRVF1T3VkRkVCSXJKd1lUMkxzYk00aUFwUnZPcG11dmdIZUF1Wm1HTEFpSjRYMXEvZ1ZwM2RTMi9BSTYxaVlJSVNJWnk2TDc4eEdmOVBVMFl2M1RsM21MV0Nvcm1TeERZOUFHcWpURTBLUUdEc2IzMStWZzRod2JtZklYMjFvQytsOFU3NkoyQklKc0s0Z0syUUZCRWFuS2FRRFFUNDlNUk02elN4c0xsN0VXY1JRVGZ3V1FzQ3laVmt1czJCQ2lRSExFS1I4UnJLQ0JXVkV1Q0FpQnZ0OHE1TnoxeHBKUUlIb04xczlQN00rMkhHS3FGSXFPUDErcUd3MDdNd0Q1U3BnUkxnTVR6NlFTd0tPUTNxcnJZZDFES0pCR1JIT2F3VkdzT2ViQ3BHSUhleFpNTjV5cTYySGFrSlhVT0wzVk01Y2JpQUJmUVJKNkFhK0lyN3oxd3RCaytaMjVIUU5yOFd6YzJKVWVQcmhmQkxRRGRJN0lUWlI3dzE4Vm1BRVM3NnBFSW5Zb1pRRjR5MTNPdnNDZTU0d1doWHA4MmZ3V1lFUjZDS1NnTDVuMEdvRHR6RjVrYUNRK3lkODUyUXlsejZSYzZQaFFNb0tFU0lQTkpEZWx6VUJMYUUvY1g2aEx0N2dOandmS0JzTms0RCtod1ptdklEUENneEEvSW5mZkFXVVNFaEFMcENFWGlKRTRuZkYyVnJXcnpHRnBvNWUzZ0tXTFF2dFBGQ3VrSVFjNEN0aVkzdXZxUEpOblhtZ2ZBV2tMQmh1a0lRY1NZeWRqU2NmeUEzNHhHKytpZGl5TUNrSnlCT1NrQWRDSkg2enpLN2hLMkJFdUF6YjFpNG1BWGxDRXZLRXI0amRKak1URWM5ZGE4U3hhbjRDVWhxYU1KQ0VBdUFVa2V1VzdQN09OK1diaUsxU0traEFBU0VKQmNJcEl0L0ViMTluMS9BVmNFNk1DbytYTGlFQkJZUWtGQmkraWQrK1RIT3JPbC9IVzBCS1F4TWVrdEFIOEJIUlYvbW1SMDdYb0o3SGVTTkpjYk5KUUI4aGpWVElXY2NRbEd3c3l1YWQrRjNmMUNsSUxId1RzWE16RENoYmx1V1R2MU9vRTZtUVF6cFhyMkVkUjlEQ2QrdjlxZ3Yxdk5QY2hCQ1FzbUI4eDF5OWhoSzRmUTJmRlJqamY4OWJFWVRJQXkzSVRzWjk4eFA4K05jS1RVaENQNUNmbVlTSWNCbXFhMjV4WG9GaEdScjJlSWRxSVFTa0xCai9JVTJlRTgwNmhwRGd2dmtKdlBKTlBkMW9tQVFNTEpMblJOUG9xRC9obS9nOVU3NXBVMGN2RG43OEQ4NENSb1RMU0VBR1NMbnVzMGx3UXdnUkQxUmVuREJnMDlVM2dLcnpkYWc0VzR2aEVUdW4renJUMEVoQS82SlNLaUNiUlprUGZzZTVBb05yczdIZmJNV0Y2ODI0ZUtNWkNybU0xeXA0Z1BKQVdUSXJJcHptQ1ZuQk4vRWJHSjNHNEN0Z2pGcEpBaklrVWlHSFZDNExZeDFIeUNLRWlId0loWFBoeFk1Y0ZqWTZNR09nQ1h0bThGMkJ3UlhLQTJXUDB6c3BBRVNyL1BzRklDYkNkd1dHdDZRWmRDU2dDSEI2SndXQXVKZ28xdkVRNEpmNDdTbTVHUWFzeVV0bi9hb0U3bm9uQlFDdG41dENoSHY0YkwwL0hSSUpzQ1kzamZKQVJZVFRPeWtBNnBpTGpCVTVLVmhYa0NYWWdFMUV1QXpmWDVXRHRFUTk2MWNqeHVIMFRnYU1EcE1TNGlJeGRqYWVmamdmNTY0MTRsSjlDNmRKZUpWU2daelVlRXJDRmlsTzc4YitxVTAxNkhDVHg2SlB3amZrWnlZaFB6TUpWNzVxUVdON0wxcTZUTk1LR1JFdVEyeDBGQllrNnFubUV6R3BCdDNZZjQ5SkdCK2pJZ2xGekgzekU4WnFOTE5sQ0s2T3RKdXIxMURYSWtDSUh6Y0FOeVpoZ2s3Tk9pN0NRNVFSNFZUTEJUampmUnRiUlVGemhRVGhQOGI3TmlhaFZDcWhxUXFDOEFOYXRSSlM2ZDFsTkJQV0U2WWthRm5IUnhCQnoyVFBKa2hvaUtVY1VvTHdOWk05bXpBYkhCZnRPbVVxb3FzRGlwNXVSQnI1YmNIM041c0YvVndQUDNCQlU0d0tuZlh4THErcEpSS3NrUE5ic0J5Wm53ZUpVZ21aamxvSWhIQk05bXlDaEZLcEJBYTlCbmZhdXFGdXFFZmNoYk9JTzM4VzRYMjlnang4dDZrVDlTUDgxcjlOUnVKbWlYcW1WSWFqYXAyWGQzT1BjdVVLYVA5ckZ5THZ6eGMwZmlLME1PZzFFL3FEZ0l2ZDFqSWFiK0Nlbi95M1lPSUZDK2EvbllINWIyZWd1RGNMYzQvK2lXcEhnaE1aODJLbmZEYWhUMmg4NVRWZ3h3NW1BaVlrSkdEbnpwMHpsak1ZREhqa2tVZVl4R2o5c2hhM2x4ZkRXbnVOeWZPSndNYlZIajVqTmFIeGxkZGcvT1dyeklKTFQwOUhaV1Vsa3BLU0VCWVdodGRlZTgxbE9iMWVqNnFxS3FTbHBTRTJOaFp2dnZtbTMyTWRhZS9BN2NKaXBOVFZVSTFJZUl4V3JYU1pweTBGQU5QN1I1Z0tlUC85OStQMDZkTklTaHBkWnZQS0s2OWcrL2J0VThyTm5qMGJ4NDhmUjNwNk9pUVNDVjUvL1hXODlOSkx6T0p1KzhHL00zczJFWGhrSmNlNS9Gd0tBRDJ2LzNiQ2h4eDM0K05FV1ZrWlRwNDhpZGpZdTIxbGlVU0N0OTU2QzQ4OTl0allaMUZSVWZqb280K3dlUEhpQ2IrL2UvZHUvT0VQZjRCVTZ2OHRWTTEvTzRQQno4LzUvYmxFWURJK2FYczgwc0hQejhINlpTMnp3Sll2WHc2Rll1cFVna1Fpd2I1OSsxQlNVZ0taVElZLy9lbGQ1T2U3SHBsY3VYSWxZbUppbU1UZi8zOFZUSjVMQkJidW1xSUFJTzNkOXc3VDRIYnYzbzMvZWZ0dGw5ZkN3OE54OU9oUlZGWitqQWNlS0hWWnByMjlIYVdscGVqcVlyTUNwUGQzdjRkaldOaHBGeUw0Y05jVUJhWTVKTlJmVFZLSHc0SG4vdTNmY1BEUUlaZlhsVW9sVnE0c2NubXRwNmNISlNVbHFLdXI4MU8wcnJGYytBZlQ1eFBpeDExVEZBQ2svZThmWlIwZkFHRDdNOCtnc3ZKamo4dGJyVlpzMnJRSnRiWHNtdEpPYk0zY2o2QW0rTk52dHJJT1lWb01lczIwdTFkTU81cmh6d0VhbTgyR2pSczM0Szkvclp5eHJOVnF4ZmUrOXoyY1BuM2FqeEc2WitEalQxaUhFTkwwZmpQSU9vUnB5Y3RNblBhNnFFNWxzbGdzMkxoeHc0eTEyNDRkTzNEOCtISFc0UklpZ2U5UkFMNGtVaUYzbTVQdFJGUVNBc0NHRFJ1UWtaRXhiWmxkdTNaQnB4dHRZenNFVEFnbkFvLzZKbjZMQ256Tndudm1UTWtWbmN5TUV2cXpTYnA1ODJhODg4NDdNODc1WldabW9xcXFDbG90WmF1RU9oZnI3ckFPWVZvV0pNMjhEWWxvYXNMeThuTHMzNzhmTXBsbmUyM2VkOTk5T0hic0dKUktKZFdHSWNxNWE0M29OcGxaaCtHV1ZJTU82bGtSTTVielNFSmYxNGJMbGkzRG9VT0hFQmJtK29Tb3dVSFhIZStsUzVmaXozOCtndkR3Y0JJeHhPanFHOERGRytJZWxWNlNQdGVqY3N4cnd2ejhmSHo0NFlkUUtsM3ZiN04zNzE0c1hyd1lyYTJ0THErdlhic0crdzhjUUZoWUdJa1lJblQxRGVDRFQ3K0VtUDkzYTlWS2FEV3pQQ3Jyc1lTK3FnM1hyVnNIdGRyMWRvc0hEeDNDenAwN1VWZFhoNGNmZmhnbWs4bGx1Znk4UE1URmpXWWtrSWpCelpuTERYanYxR1ZSajRnQ3dJcEZLUjZYWlY0VDd0bXpCNis4OHNxVXowK2VQSVZueDYya3VIejVNc3JMeTZjMFRldnE2ckJ5NVVxMHRMU01mVVlpQmhkbXl4RHFtenB4b1BJaXJqYTBpYm9HQkR5YmxoaVBWeWVPU0FENDR2MWZlT0VGR0kxR3ZQenl5d0NBeno3N0hPdlhmeGREUTBNVHl2Mzk3My9INXMyYjhmNzc3ME11bDZPNitpeldyLzh1dXJ1N1hkN1hYLyt2Mm93bVhEM1BOblV1R0RHYXpEQU5XRGlkdzhHU2d1emtHYWNseHNQbW5HWVh2UHJxcXpBYWpYaisrZWRSWHI0T0F3TURMc3RWVkZUZzhjY2Z4NVl0VzdGbHkyTnVCMjM4U2IvWmlubzZRb0RBYUY4dzNjdmQwU1Uzb3VPOXJqQzQxakRyUE5qb1NTNlh3MmF6OGY1alpJWEpjVVRBalo2bW8zMXBJYTcrNEVkK2VSWWhiamFzV0loNHJYZEhTakR2RTA1R0NBRUpnZ1ZhdGRKckFRR09Fdm96aTRZZ0FnVnZSa1RISTdxYWtDQUNrVlNEamxNdENQQ1FrR3BEZ3JqTC9WbEpuSCtYYWtLQzRFbGVScUpIT2FMdTRDVWgxWVpFcUJPcGtHTlJXZ0t2ZS9DdUNVbEVJcFFweUU2R1hCYkc2eDdVSENVSWpoajBHcThuNWwwaGlJUlVHeEtoeUpxOGRFSHVJMWhOS0lTSTZlbnAyTFJwMDR6bHNyS3lVRkJRSUZUb0JPRTFKYmxwMCs2ZzVnMmlhWTR1WGJvVVo4K2V4ZUhEaDdGKy9YcTM1ZWJQbjQ5UFB2a0VWVlZWS0M4dlp4MDJFWUlZOUJxa3poVXVKVkpRQ2JuV2hxdFdyVUpsWlNXaW82TWhsVXB4OE9CQkZCWVdUaWtYR3h1TDQ4ZVBJelkyRmdxRkF1KysreTYyYk5raTVDc1F4SXlzeVV2M2FwWEVUQWhlRTNvYjJyWnQyM0Q4K0hHb1ZIZlhYMFZHUnFLaW9nSkxseTRkKzB5djErUEVpUk5JVFUwZCswd3VsMlAvL3YzNDhZOS9MUFJyRUlSTGhHeUdPbUhlSEMzLzduY1JIaDQrNVhPVlNvV0tpZ3BrWldVaEtpb0tIMzc0SWU2OTk5NHA1U1FTQ1I1NzdERkVSSENmTENVSVQwZzE2QVFaRFoyTVQ5WVRlclA0OTRuSEg0ZGVwOGVLRmN1blhJdUppVUZsWlNVYUdyN0draVZMWFA1K1kyTWp5c3JLWUxGWWZQRXFCQUZnZEZKKzFYZm0rK1RlUHFzSlBXMldXaXdXckZ0WGhyTm5QM041UFNFaEFZV0Zya2RDbTV1YlVWeGNQR0ZyQzRMd0JlVUZXYnduNWQzaDArYW9weUorODgwM1dMZXVERFUxTlI3ZnU3ZTNGdzg5OUJBYUdocDgrUW9FZ1pMY05JOTNUdU1DOHo2aGs5N2VYcFNXbG5wMHpObkF3QURLeXNydzVaZGZzZzZiQ0hLeVUrSjkwZzhjajg4bDlHYTB0TDI5SGNYRnhUQWFqZE9XZS9UUlIvSFpaNTk1ZUZlQzRJWldyVVJCZHJMUG4rT1htdEFiRWJkdTNUcmpHUlBQUDcvTDVSSGJCQ0VVa1FvNXlndnZGWFErMEIxK2E0NTY4aXJQUGZjY2Z2bkxYODVZcnJoNE5RNGYvcFBINTFZUWhMZHNLc29XZkQ3UUhhTHBFejc1NUpONDQ0MDNQQzVmWHI0Ty83dHZIeVFTU2g4bmhHWERpb1c4RnVsNml5Z2szTGh4STk1KysyMjNRbG10cm85RDNyWjFLOTc4N1c5WmgwOEVFU1c1YVp6M2l1R0szeVdjTE5ycTFhdW5QWkhweFJkZlJGbFptVnNSLy9VSFA4QlBmL3BUZjc4R0VZVGtaU1Q2ZkNUVUZVeHF3dkVpYm4vMldaZHBhd0R3bTkvOEJqLzcyYzl3OHVSSmJOdTJEU01qSXk3TGJkeTQwZTJwVGdUaENYa1ppVE9lTGU4cm1EVkhuU0krK2NRVGVQZTk5NlpjUDNqb0VIYnQyalgyODVFalIvRFVVMDlOT2V6bGl5Kyt3S3BWcTJBMmkvZXdTRUxjc0JRUVlOd25sRWdrc05sczJMcGxDL1lmT0REMitjY2ZWK0dacDUrZUl0eWhRNGV3ZS9mdXNaK3JxazZncEtURTdZRXdCREVUQnIyR3FZQ0FTQTZFc2R2dGVPYnBwOUhUM1kybFM1ZmlrVWUraitGaDEyZFd2UHJxcTlCb05KaVhuSXhudDI5MzIxY2tpSmt3NkRVb1c1YkZPZ3oyRWpxYnBYYTdIYnQyN1VKNGVQaVVJOUVtczJmUEh0WmhFd0VPNnlib2VFUXhSUUhjbFhFbUFRbUNMMklTRUJDUmhBQm80cDN3T1dJVEVCQkJjM1F5RW9tRWpyc21mRUpKYmhxVGVjQ1pFSjJFQUlsSUNBK1h3enY5aFNnbEJFaEVRaGdpRlhKc0tzcjJheTZvdDRoV1FvQkVKUGloVlN0UlhuaXYzMVpEY0VYVUVnSWtJc0dON0pSNEZHUW4rMlU5SUY5RU5Ub2FGaGFHNTU1N2JzbzZRWWxFTW1Ia1ZDYVRZY3VXTFRTYVNyaWtKRGNOeTNQdUNRZ0JBUkZKcUZRcWNlellNZXpkdXhmNzl1MXpXVVlpa1VBcWxXTC9nUU00Y09BQTN2cmQ3eUNWaXVZVkNNWkVLdVI0ZEhXT0tFZEFwME1VMzJDMVdvMlBQdm9JcGFXbEFFYTN1SGp0dGRkY2x2MzFyMytOUng5NUJBQ3cvWmxuOE1mRGg5MnV3aUJDaDFTRER0dldMdmJwcm1pK2dybUU4K2JOUTNWMTlaU3pKM2J1M0lrWFgzeHh3bWN2dmZRU2Z2akRIMDVvbm41djB5WlVWSHdJdFZxY3c4K0U3eW5KVGNQYXZIU2Y3UXZxYTVoTG1KK2ZqOHpNVEpmWDl1elpNN2FjNllVWFhwaXdnZ0s0bTJHemZIa2hGaTFheFBwVkNEOWowR3Z3MUVONUFkZjhuQXp6MGRIMzNuc1BjWEZ4ZVAzMTExMWUvOVd2Zm9VbFM1Wmc4K2JOTHE5TEpCSTgrK3l6T0hQbURPdFhJZnhJU1c0YVV1ZnFBbWJ3WlRxWVN3Z0FlL2Z1aFVxbHdzOS8vbk9YMTkwSjZIQTRzR1BIRGh3NmRJaW1Na0lFZzE2RE5YbnBvcC83OHdaUlNBZ0F2L2pGTHhBVkZUV2x5VGtkUC9uSlQvRFdXMitOL2V4c25wS013VWVrUW82QzdPU0FiM3E2UWpRU0FxTlNSVVZGWWNlT0hUT1dmZU9OTi9EeXl5Kzd2RWJ6aDhGRlhrWWlGcVVsQk96QXkweUlTa0pnZEZRMFBqNSsyclByMzMvL2Zmem9SeithOFY1T0ZhbGVERXhTRFRyY241VWs2cnhQSVJDZGhPbnA2U2dxS3BxMnpKbzFhNUNUazRQTGx5OTdkRStTTWJEUXFwVllzU2hGdEtzZWhFWlVFczZiTnc5VlZWWFE2WFRUbHROb05LaXNyRVJoWVNGdTNyenA4ZjFKUm5FVGF2STVFWTJFU1VsSk9IWHFGQXdHZzBmbDlYbzlLaXNyVVZSVWhPYm1acStlUlRLS2kyQWVkUEVFVVVpbzFXcFJXVm1KZWZQbXVidytORFRrTWpVdE9Ua1pKMCtlUkdGaElUbzZPcngrcmxBeTlzNWY0T2UvV0hEZ3JQbmlvbFZCTWQvSEZXbFlYQ3pUQUZRcUZTb3JLNUdlbnU3eStwVXJWN0Jnd1FLM3Avak9uejhmeDQ0ZDQ3VUR0d1RlSGQ4Mm1lRlpVWDc4aXdVK3FRWWRIbDJkZzBlTEZ5RmVxdzVwQVFGQU92dXBKNWdHVUZ4Y2pKeWNISmZYYnR5NGdiVnIxNkt4c1JFUFB2aWcyLzVmZG5ZMmxpMWJ4anNXcmpMMnBsSk5PQk9SQ2pueU1oS3hiZTFpck0xTEQ4aEVhMThoalNwN2tHa0FmL25MWDdCMTYxYlliTFlKbjdlMXRlSEJCeDlFWjJjbkFLQzF0UldyVjY5R1UxUFRoSEptc3hubDVlVTRjZUtFWURGSjRKMlFRNnJRR2tqd0JvTmVndzByRnVMSkIzS1JsNWtZOU5NTlhKQXBzaklSRmhlTGtYYnYrMVJDOGU2Nzc4Sm1zK0dQZi93ajVISTUrdnI2VUZwYWl0dTNiMDhvZCtmT0haU1ZsZUhNbVRQUWFEVG82ZW5Cd3c4L2pDKysrTUpuc2MzVWIyeGZXZ2k3Z3I1WTQ5R3FsY2hLamtPcVFSZFU2V1crUWdvQU1iditnM1VjT0hyMEtCNTY2Q0cwdHJaaS9mcjF1SHIxcXN0eVY2OWVSV2xwS2E1Y3VZS2lvaUtmQ2pnZWQ3WGp6WTFibVA3ZHhJSldyY1R5Kys3QlV3L2w0ZEhpUmNpZUgwOENlb2pFNFhBNEhNUERhTWpPOVhsdFdHYnF4RTM3eUxSbFBOa0czeE15cFRJY1ZldDQzMmM2MVAvNVBFeVAvd3V1Mys1QWMyZWZUNThsUmd4NkRUTG14U0l4ZGpZSnh3T0o0OXRzWjF0akV4cEwxL2xVUkU4a0ZBcGZTNmhjdVFLR0k0ZkhmcmJiSFdqdjZVZHpSeDhhV293d21vTHZxRGF0V29tVUJDME1zWnFRbjFZUWtqRUpBV0M0eTRqYnk0dDlKbUt3U0tqZC9aK0kyZlVma01qY1Q3UGE3UTcwOUp2UjBtVkNhM2MvYmpaMytlVzloU1RWb0VOOGpBb0pPaldpVlVxU3prZE1rQkFBN0FObTlMejVGbnIvc0Y5d0dRTmR3dG4vdWgzUnp6MExlUkszc3d3R3JUYVlMVU13bXN4bzcvNEdQZjFtVVRSakRYb05vbFZLeE1WRVFhdFdRaGtSVHMxTFB6SkZRaWVPNFdHWVB6Mkw0YVltV0M1ZXdraFBOOHpWbi9ONjJCTjlYZmphUHN6ckhwNnlJRXlHMy9PVVVGbHdQOEpUVXpIcndWSkVMTHB2MnBxUEQ3YmhFUXhhYlJpd0RLSGZQSHJlNHEyMm5ySHJkenI3TUdpMWVYM2ZTSVVjYy9XYXNaK1Q1MFFEQUZSS0JXWjlLMXF3TGc4S0pQNGZoWmhnMHBwRVl0c0FBQUFsZEVWWWRHUmhkR1U2WTNKbFlYUmxBREl3TWpRdE1ERXRNak5VTVRRNk5EYzZNRGdyTURBNk1EQkdkL3pqQUFBQUpYUkZXSFJrWVhSbE9tMXZaR2xtZVFBeU1ESTBMVEF4TFRJelZERTBPalEzT2pBNEt6QXdPakF3TnlwRVh3QUFBQ2gwUlZoMFpHRjBaVHAwYVcxbGMzUmhiWEFBTWpBeU5DMHdNUzB5TTFReE5EbzBOem93T0Nzd01Eb3dNR0EvWllBQUFBQUFTVVZPUks1Q1lJST0nO1xuXG5leHBvcnQge0FNU1RFUkRBTV9FTUFJTEFQSV9QTFVHSU5fTE9HT19CQVNFNjR9O1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1LTIwMjQuIFJpdGVuc2UgQlYsIHRoZSBOZXRoZXJsYW5kcy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciBFVVBMLCBWZXJzaW9uIDEuMiAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHBzOi8vam9pbnVwLmVjLmV1cm9wYS5ldS9jb2xsZWN0aW9uL2V1cGwvZXVwbC10ZXh0LWV1cGwtMTJcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG4gKlxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vYW1zdGVyZGFtLWVtYWlsYXBpLXBsdWdpbi1sb2dvJztcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNS0yMDI0LiBSaXRlbnNlIEJWLCB0aGUgTmV0aGVybGFuZHMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgRVVQTCwgVmVyc2lvbiAxLjIgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwczovL2pvaW51cC5lYy5ldXJvcGEuZXUvY29sbGVjdGlvbi9ldXBsL2V1cGwtdGV4dC1ldXBsLTEyXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuICpcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsdWdpbkNvbmZpZ3VyYXRpb25Db21wb25lbnR9IGZyb20gJ0B2YWx0aW1vL3BsdWdpbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCB0YWtlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7QW1zdGVyZGFtRW1haWxBcGlDb25maWd9IGZyb20gXCIuLi8uLi9tb2RlbHNcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndmFsdGltby1hbXN0ZXJkYW0tZW1haWxhcGktY29uZmlndXJhdGlvbicsXG4gIHRlbXBsYXRlOiByZXF1aXJlKCcuL2Ftc3RlcmRhbS1lbWFpbGFwaS1jb25maWd1cmF0aW9uLmNvbXBvbmVudC5odG1sJyksXG4gIHN0eWxlczogW3JlcXVpcmUoJy4vYW1zdGVyZGFtLWVtYWlsYXBpLWNvbmZpZ3VyYXRpb24uY29tcG9uZW50LnNjc3MnKV0sXG59KVxuZXhwb3J0IGNsYXNzIEFtc3RlcmRhbUVtYWlsYXBpQ29uZmlndXJhdGlvbkNvbXBvbmVudFxuICBpbXBsZW1lbnRzIFBsdWdpbkNvbmZpZ3VyYXRpb25Db21wb25lbnQsIE9uSW5pdCwgT25EZXN0cm95XG57XG4gIEBJbnB1dCgpIHNhdmUkOiBPYnNlcnZhYmxlPHZvaWQ+O1xuICBASW5wdXQoKSBkaXNhYmxlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gIEBJbnB1dCgpIHBsdWdpbklkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHByZWZpbGxDb25maWd1cmF0aW9uJDogT2JzZXJ2YWJsZTxBbXN0ZXJkYW1FbWFpbEFwaUNvbmZpZz47XG4gIEBPdXRwdXQoKSB2YWxpZDogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBAT3V0cHV0KCkgY29uZmlndXJhdGlvbjogRXZlbnRFbWl0dGVyPEFtc3RlcmRhbUVtYWlsQXBpQ29uZmlnPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPEFtc3RlcmRhbUVtYWlsQXBpQ29uZmlnPigpO1xuXG4gIHByaXZhdGUgc2F2ZVN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcblxuICBwcml2YXRlIHJlYWRvbmx5IGZvcm1WYWx1ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFtc3RlcmRhbUVtYWlsQXBpQ29uZmlnIHwgbnVsbD4obnVsbCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgdmFsaWQkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5vcGVuU2F2ZVN1YnNjcmlwdGlvbigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgZm9ybVZhbHVlQ2hhbmdlKGZvcm1WYWx1ZTogQW1zdGVyZGFtRW1haWxBcGlDb25maWcpOiB2b2lkIHtcbiAgICB0aGlzLmZvcm1WYWx1ZSQubmV4dChmb3JtVmFsdWUpO1xuICAgIHRoaXMuaGFuZGxlVmFsaWQoZm9ybVZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlVmFsaWQoZm9ybVZhbHVlOiBBbXN0ZXJkYW1FbWFpbEFwaUNvbmZpZyk6IHZvaWQge1xuICAgIGNvbnN0IHZhbGlkID0gISEoZm9ybVZhbHVlLmNvbmZpZ3VyYXRpb25UaXRsZVxuICAgICAgICAmJiBmb3JtVmFsdWUuY2xpZW50SWRcbiAgICAgICAgJiYgZm9ybVZhbHVlLmNsaWVudFNlY3JldFxuICAgICAgICAmJiBmb3JtVmFsdWUuZW1haWxBcGlCYXNlVXJsXG4gICAgICAgICYmIGZvcm1WYWx1ZS50b2tlbkVuZHBvaW50KTtcblxuICAgIHRoaXMudmFsaWQkLm5leHQodmFsaWQpO1xuICAgIHRoaXMudmFsaWQuZW1pdCh2YWxpZCk7XG4gIH1cblxuICBwcml2YXRlIG9wZW5TYXZlU3Vic2NyaXB0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbiA9IHRoaXMuc2F2ZSQ/LnN1YnNjcmliZShzYXZlID0+IHtcbiAgICAgIGNvbWJpbmVMYXRlc3QoW3RoaXMuZm9ybVZhbHVlJCwgdGhpcy52YWxpZCRdKVxuICAgICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgICAgLnN1YnNjcmliZSgoW2Zvcm1WYWx1ZSwgdmFsaWRdKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uLmVtaXQoZm9ybVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1LTIwMjQuIFJpdGVuc2UgQlYsIHRoZSBOZXRoZXJsYW5kcy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciBFVVBMLCBWZXJzaW9uIDEuMiAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHBzOi8vam9pbnVwLmVjLmV1cm9wYS5ldS9jb2xsZWN0aW9uL2V1cGwvZXVwbC10ZXh0LWV1cGwtMTJcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG4gKlxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RnVuY3Rpb25Db25maWd1cmF0aW9uQ29tcG9uZW50fSBmcm9tICdAdmFsdGltby9wbHVnaW4nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgdGFrZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1NlbmRFbWFpbENvbmZpZ30gZnJvbSBcIi4uLy4uL21vZGVsc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd2YWx0aW1vLXNlbmQtZW1haWwtY29uZmlndXJhdGlvbicsXG4gIHRlbXBsYXRlOiByZXF1aXJlKCcuL3NlbmQtZW1haWwtY29uZmlndXJhdGlvbi5jb21wb25lbnQuaHRtbCcpLFxuICBzdHlsZXM6IFtyZXF1aXJlKCcuL3NlbmQtZW1haWwtY29uZmlndXJhdGlvbi5jb21wb25lbnQuc2NzcycpXSxcbn0pXG5leHBvcnQgY2xhc3MgU2VuZEVtYWlsQ29uZmlndXJhdGlvbkNvbXBvbmVudFxuICBpbXBsZW1lbnRzIEZ1bmN0aW9uQ29uZmlndXJhdGlvbkNvbXBvbmVudCwgT25Jbml0LCBPbkRlc3Ryb3lcbntcbiAgQElucHV0KCkgZGlzYWJsZWQkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICBASW5wdXQoKSBwbHVnaW5JZDogc3RyaW5nO1xuICBASW5wdXQoKSBwcmVmaWxsQ29uZmlndXJhdGlvbiQ6IE9ic2VydmFibGU8U2VuZEVtYWlsQ29uZmlnPjtcbiAgQElucHV0KCkgc2F2ZSQ6IE9ic2VydmFibGU8dm9pZD47XG4gIEBPdXRwdXQoKSBjb25maWd1cmF0aW9uOiBFdmVudEVtaXR0ZXI8U2VuZEVtYWlsQ29uZmlnPiA9IG5ldyBFdmVudEVtaXR0ZXI8U2VuZEVtYWlsQ29uZmlnPigpO1xuICBAT3V0cHV0KCkgdmFsaWQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGZvcm1WYWx1ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFNlbmRFbWFpbENvbmZpZyB8IG51bGw+KG51bGwpO1xuICBwcml2YXRlIHNhdmVTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgcmVhZG9ubHkgdmFsaWQkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMub3BlblNhdmVTdWJzY3JpcHRpb24oKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwdWJsaWMgZm9ybVZhbHVlQ2hhbmdlKGZvcm1WYWx1ZTogU2VuZEVtYWlsQ29uZmlnKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtVmFsdWUkLm5leHQoZm9ybVZhbHVlKTtcbiAgICB0aGlzLmhhbmRsZVZhbGlkKGZvcm1WYWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVZhbGlkKGZvcm1WYWx1ZTogU2VuZEVtYWlsQ29uZmlnKTogdm9pZCB7XG4gICAgY29uc3QgdmFsaWQgPSAhIShmb3JtVmFsdWUudG9FbWFpbClcbiAgICAgICAgJiYgISEoZm9ybVZhbHVlLmVtYWlsU3ViamVjdClcbiAgICAgICAgJiYgISEoZm9ybVZhbHVlLmNvbnRlbnRIdG1sKVxuICAgICAgICAmJiAhIShmb3JtVmFsdWUuZnJvbUFkZHJlc3MpO1xuXG4gICAgdGhpcy52YWxpZCQubmV4dCh2YWxpZCk7XG4gICAgdGhpcy52YWxpZC5lbWl0KHZhbGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgb3BlblNhdmVTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9uID0gdGhpcy5zYXZlJD8uc3Vic2NyaWJlKHNhdmUgPT4ge1xuICAgICAgY29tYmluZUxhdGVzdChbdGhpcy5mb3JtVmFsdWUkLCB0aGlzLnZhbGlkJF0pXG4gICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKChbZm9ybVZhbHVlLCB2YWxpZF0pID0+IHtcbiAgICAgICAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uZW1pdChmb3JtVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUtMjAyNC4gUml0ZW5zZSBCViwgdGhlIE5ldGhlcmxhbmRzLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIEVVUEwsIFZlcnNpb24gMS4yICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cHM6Ly9qb2ludXAuZWMuZXVyb3BhLmV1L2NvbGxlY3Rpb24vZXVwbC9ldXBsLXRleHQtZXVwbC0xMlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbiAqXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtQbHVnaW5Db25maWd1cmF0aW9uRGF0YX0gZnJvbSAnQHZhbHRpbW8vcGx1Z2luJztcblxuaW50ZXJmYWNlIEFtc3RlcmRhbUVtYWlsQXBpQ29uZmlnIGV4dGVuZHMgUGx1Z2luQ29uZmlndXJhdGlvbkRhdGEge1xuICBlbWFpbEFwaUJhc2VVcmw6IHN0cmluZztcbiAgY2xpZW50SWQ6IHN0cmluZztcbiAgY2xpZW50U2VjcmV0OiBzdHJpbmc7XG4gIHRva2VuRW5kcG9pbnQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFNlbmRFbWFpbENvbmZpZyB7XG4gIHRvRW1haWw6IHN0cmluZztcbiAgdG9OYW1lOiBzdHJpbmc7XG4gIGZyb21BZGRyZXNzOiBzdHJpbmc7XG4gIGNjRW1haWw6IHN0cmluZztcbiAgY2NOYW1lOiBzdHJpbmc7XG4gIGJjY0VtYWlsOiBzdHJpbmc7XG4gIGJjY05hbWU6IHN0cmluZztcbiAgZW1haWxTdWJqZWN0OiBzdHJpbmc7XG4gIGNvbnRlbnRIdG1sOiBzdHJpbmc7XG59XG5cbmV4cG9ydCB7QW1zdGVyZGFtRW1haWxBcGlDb25maWcsIFNlbmRFbWFpbENvbmZpZ307XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUtMjAyNC4gUml0ZW5zZSBCViwgdGhlIE5ldGhlcmxhbmRzLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIEVVUEwsIFZlcnNpb24gMS4yICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cHM6Ly9qb2ludXAuZWMuZXVyb3BhLmV1L2NvbGxlY3Rpb24vZXVwbC9ldXBsLXRleHQtZXVwbC0xMlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbiAqXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9jb25maWcnO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3dbXCJAYW5ndWxhci9jb21tb25cIl07IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3dbXCJAYW5ndWxhci9jb3JlXCJdOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1wiQHZhbHRpbW8vY29tcG9uZW50c1wiXTsiLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvd1tcIkB2YWx0aW1vL3BsdWdpblwiXTsiLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvd1tcInJ4anNcIl07IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3dbXCJ0c2xpYlwiXTsiLCIvKipcbiAqIEBsaWNlbnNlIEFuZ3VsYXIgdjE3LjMuMTJcbiAqIChjKSAyMDEwLTIwMjQgR29vZ2xlIExMQy4gaHR0cHM6Ly9hbmd1bGFyLmlvL1xuICogTGljZW5zZTogTUlUXG4gKi9cblxuaW1wb3J0ICogYXMgaTAgZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEaXJlY3RpdmUsIEluamVjdGlvblRva2VuLCBmb3J3YXJkUmVmLCBPcHRpb25hbCwgSW5qZWN0LCDJtWlzUHJvbWlzZSwgybVpc1N1YnNjcmliYWJsZSwgybVSdW50aW1lRXJyb3IsIFNlbGYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIEhvc3QsIFNraXBTZWxmLCBib29sZWFuQXR0cmlidXRlLCBDaGFuZ2VEZXRlY3RvclJlZiwgT3V0cHV0LCBJbmplY3RhYmxlLCBpbmplY3QsIE5nTW9kdWxlLCBWZXJzaW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyDJtWdldERPTSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBmcm9tLCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBDb250cm9sVmFsdWVBY2Nlc3NvciBjbGFzc2VzIGRlZmluZWQgaW4gRm9ybXMgcGFja2FnZS5cbiAqIENvbnRhaW5zIGNvbW1vbiBsb2dpYyBhbmQgdXRpbGl0eSBmdW5jdGlvbnMuXG4gKlxuICogTm90ZTogdGhpcyBpcyBhbiAqaW50ZXJuYWwtb25seSogY2xhc3MgYW5kIHNob3VsZCBub3QgYmUgZXh0ZW5kZWQgb3IgdXNlZCBkaXJlY3RseSBpblxuICogYXBwbGljYXRpb25zIGNvZGUuXG4gKi9cbmNsYXNzIEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgY29uc3RydWN0b3IoX3JlbmRlcmVyLCBfZWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IF9yZW5kZXJlcjtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZiA9IF9lbGVtZW50UmVmO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBjaGFuZ2Ugb3IgaW5wdXQgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dFxuICAgICAgICAgKiBlbGVtZW50LlxuICAgICAgICAgKiBAbm9kb2NcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSAoXykgPT4geyB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBibHVyIGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICAgICAgICogQG5vZG9jXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9uVG91Y2hlZCA9ICgpID0+IHsgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGVscGVyIG1ldGhvZCB0aGF0IHNldHMgYSBwcm9wZXJ0eSBvbiBhIHRhcmdldCBlbGVtZW50IHVzaW5nIHRoZSBjdXJyZW50IFJlbmRlcmVyXG4gICAgICogaW1wbGVtZW50YXRpb24uXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCBpcyB0b3VjaGVkLlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuKSB7XG4gICAgICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIFwiZGlzYWJsZWRcIiBwcm9wZXJ0eSBvbiB0aGUgcmFuZ2UgaW5wdXQgZWxlbWVudC5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZXBzOiBbeyB0b2tlbjogaTAuUmVuZGVyZXIyIH0sIHsgdG9rZW46IGkwLkVsZW1lbnRSZWYgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogaTAuUmVuZGVyZXIyIH0sIHsgdHlwZTogaTAuRWxlbWVudFJlZiB9XSB9KTtcbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYWxsIGJ1aWx0LWluIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGNsYXNzZXMgKGV4Y2VwdCBEZWZhdWx0VmFsdWVBY2Nlc3Nvciwgd2hpY2ggaXNcbiAqIHVzZWQgaW4gY2FzZSBubyBvdGhlciBDVkFzIGNhbiBiZSBmb3VuZCkuIFdlIHVzZSB0aGlzIGNsYXNzIHRvIGRpc3Rpbmd1aXNoIGJldHdlZW4gZGVmYXVsdCBDVkEsXG4gKiBidWlsdC1pbiBDVkFzIGFuZCBjdXN0b20gQ1ZBcywgc28gdGhhdCBGb3JtcyBsb2dpYyBjYW4gcmVjb2duaXplIGJ1aWx0LWluIENWQXMgYW5kIHRyZWF0IGN1c3RvbVxuICogb25lcyB3aXRoIGhpZ2hlciBwcmlvcml0eSAod2hlbiBib3RoIGJ1aWx0LWluIGFuZCBjdXN0b20gQ1ZBcyBhcmUgcHJlc2VudCkuXG4gKlxuICogTm90ZTogdGhpcyBpcyBhbiAqaW50ZXJuYWwtb25seSogY2xhc3MgYW5kIHNob3VsZCBub3QgYmUgZXh0ZW5kZWQgb3IgdXNlZCBkaXJlY3RseSBpblxuICogYXBwbGljYXRpb25zIGNvZGUuXG4gKi9cbmNsYXNzIEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciBleHRlbmRzIEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZXBzOiBudWxsLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlXG4gICAgICAgIH1dIH0pO1xuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciBmb3JtIGNvbnRyb2xzLlxuICpcbiAqIFNlZSBgRGVmYXVsdFZhbHVlQWNjZXNzb3JgIGZvciBob3cgdG8gaW1wbGVtZW50IG9uZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNvbnN0IE5HX1ZBTFVFX0FDQ0VTU09SID0gbmV3IEluamVjdGlvblRva2VuKG5nRGV2TW9kZSA/ICdOZ1ZhbHVlQWNjZXNzb3InIDogJycpO1xuXG5jb25zdCBDSEVDS0JPWF9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yKSxcbiAgICBtdWx0aTogdHJ1ZSxcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciB3cml0aW5nIGEgdmFsdWUgYW5kIGxpc3RlbmluZyB0byBjaGFuZ2VzIG9uIGEgY2hlY2tib3ggaW5wdXRcbiAqIGVsZW1lbnQuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgVXNpbmcgYSBjaGVja2JveCB3aXRoIGEgcmVhY3RpdmUgZm9ybS5cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSBhIGNoZWNrYm94IHdpdGggYSByZWFjdGl2ZSBmb3JtLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCByZW1lbWJlckxvZ2luQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogYGBgXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgW2Zvcm1Db250cm9sXT1cInJlbWVtYmVyTG9naW5Db250cm9sXCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIFwiY2hlY2tlZFwiIHByb3BlcnR5IG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgnY2hlY2tlZCcsIHZhbHVlKTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBzZWxlY3RvcjogXCJpbnB1dFt0eXBlPWNoZWNrYm94XVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9Y2hlY2tib3hdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtuZ01vZGVsXVwiLCBob3N0OiB7IGxpc3RlbmVyczogeyBcImNoYW5nZVwiOiBcIm9uQ2hhbmdlKCRldmVudC50YXJnZXQuY2hlY2tlZClcIiwgXCJibHVyXCI6IFwib25Ub3VjaGVkKClcIiB9IH0sIHByb3ZpZGVyczogW0NIRUNLQk9YX1ZBTFVFX0FDQ0VTU09SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1jaGVja2JveF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1jaGVja2JveF1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICcoY2hhbmdlKSc6ICdvbkNoYW5nZSgkZXZlbnQudGFyZ2V0LmNoZWNrZWQpJywgJyhibHVyKSc6ICdvblRvdWNoZWQoKScgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbQ0hFQ0tCT1hfVkFMVUVfQUNDRVNTT1JdXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0gfSk7XG5cbmNvbnN0IERFRkFVTFRfVkFMVUVfQUNDRVNTT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGVmYXVsdFZhbHVlQWNjZXNzb3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBXZSBtdXN0IGNoZWNrIHdoZXRoZXIgdGhlIGFnZW50IGlzIEFuZHJvaWQgYmVjYXVzZSBjb21wb3NpdGlvbiBldmVudHNcbiAqIGJlaGF2ZSBkaWZmZXJlbnRseSBiZXR3ZWVuIGlPUyBhbmQgQW5kcm9pZC5cbiAqL1xuZnVuY3Rpb24gX2lzQW5kcm9pZCgpIHtcbiAgICBjb25zdCB1c2VyQWdlbnQgPSDJtWdldERPTSgpID8gybVnZXRET00oKS5nZXRVc2VyQWdlbnQoKSA6ICcnO1xuICAgIHJldHVybiAvYW5kcm9pZCAoXFxkKykvLnRlc3QodXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGUgdGhpcyB0b2tlbiB0byBjb250cm9sIGlmIGZvcm0gZGlyZWN0aXZlcyBidWZmZXIgSU1FIGlucHV0IHVudGlsXG4gKiB0aGUgXCJjb21wb3NpdGlvbmVuZFwiIGV2ZW50IG9jY3Vycy5cbiAqIEBwdWJsaWNBcGlcbiAqL1xuY29uc3QgQ09NUE9TSVRJT05fQlVGRkVSX01PREUgPSBuZXcgSW5qZWN0aW9uVG9rZW4obmdEZXZNb2RlID8gJ0NvbXBvc2l0aW9uRXZlbnRNb2RlJyA6ICcnKTtcbi8qKlxuICogVGhlIGRlZmF1bHQgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyBhIHZhbHVlIGFuZCBsaXN0ZW5pbmcgdG8gY2hhbmdlcyBvbiBpbnB1dFxuICogZWxlbWVudHMuIFRoZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IHRoZSBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBgRm9ybUNvbnRyb2xOYW1lYCwgYW5kXG4gKiBgTmdNb2RlbGAgZGlyZWN0aXZlcy5cbiAqXG4gKiB7QHNlYXJjaEtleXdvcmRzIG5nRGVmYXVsdENvbnRyb2x9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgVXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgYWNjZXNzb3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSBhbiBpbnB1dCBlbGVtZW50IHRoYXQgYWN0aXZhdGVzIHRoZSBkZWZhdWx0IHZhbHVlIGFjY2Vzc29yXG4gKiAoaW4gdGhpcyBjYXNlLCBhIHRleHQgZmllbGQpLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBmaXJzdE5hbWVDb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG4gKiBgYGBcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIFtmb3JtQ29udHJvbF09XCJmaXJzdE5hbWVDb250cm9sXCI+XG4gKiBgYGBcbiAqXG4gKiBUaGlzIHZhbHVlIGFjY2Vzc29yIGlzIHVzZWQgYnkgZGVmYXVsdCBmb3IgYDxpbnB1dCB0eXBlPVwidGV4dFwiPmAgYW5kIGA8dGV4dGFyZWE+YCBlbGVtZW50cywgYnV0XG4gKiB5b3UgY291bGQgYWxzbyB1c2UgaXQgZm9yIGN1c3RvbSBjb21wb25lbnRzIHRoYXQgaGF2ZSBzaW1pbGFyIGJlaGF2aW9yIGFuZCBkbyBub3QgcmVxdWlyZSBzcGVjaWFsXG4gKiBwcm9jZXNzaW5nLiBJbiBvcmRlciB0byBhdHRhY2ggdGhlIGRlZmF1bHQgdmFsdWUgYWNjZXNzb3IgdG8gYSBjdXN0b20gZWxlbWVudCwgYWRkIHRoZVxuICogYG5nRGVmYXVsdENvbnRyb2xgIGF0dHJpYnV0ZSBhcyBzaG93biBiZWxvdy5cbiAqXG4gKiBgYGBcbiAqIDxjdXN0b20taW5wdXQtY29tcG9uZW50IG5nRGVmYXVsdENvbnRyb2wgWyhuZ01vZGVsKV09XCJ2YWx1ZVwiPjwvY3VzdG9tLWlucHV0LWNvbXBvbmVudD5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgRGVmYXVsdFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCYXNlQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyLCBlbGVtZW50UmVmLCBfY29tcG9zaXRpb25Nb2RlKSB7XG4gICAgICAgIHN1cGVyKHJlbmRlcmVyLCBlbGVtZW50UmVmKTtcbiAgICAgICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlID0gX2NvbXBvc2l0aW9uTW9kZTtcbiAgICAgICAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgaXMgY3JlYXRpbmcgYSBjb21wb3NpdGlvbiBzdHJpbmcgKElNRSBldmVudHMpLiAqL1xuICAgICAgICB0aGlzLl9jb21wb3NpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX2NvbXBvc2l0aW9uTW9kZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9jb21wb3NpdGlvbk1vZGUgPSAhX2lzQW5kcm9pZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIFwidmFsdWVcIiBwcm9wZXJ0eSBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgICAgICB0aGlzLnNldFByb3BlcnR5KCd2YWx1ZScsIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfaGFuZGxlSW5wdXQodmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jb21wb3NpdGlvbk1vZGUgfHwgKHRoaXMuX2NvbXBvc2l0aW9uTW9kZSAmJiAhdGhpcy5fY29tcG9zaW5nKSkge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9jb21wb3NpdGlvblN0YXJ0KCkge1xuICAgICAgICB0aGlzLl9jb21wb3NpbmcgPSB0cnVlO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2NvbXBvc2l0aW9uRW5kKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2NvbXBvc2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9jb21wb3NpdGlvbk1vZGUgJiYgdGhpcy5vbkNoYW5nZSh2YWx1ZSk7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IERlZmF1bHRWYWx1ZUFjY2Vzc29yLCBkZXBzOiBbeyB0b2tlbjogaTAuUmVuZGVyZXIyIH0sIHsgdG9rZW46IGkwLkVsZW1lbnRSZWYgfSwgeyB0b2tlbjogQ09NUE9TSVRJT05fQlVGRkVSX01PREUsIG9wdGlvbmFsOiB0cnVlIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IERlZmF1bHRWYWx1ZUFjY2Vzc29yLCBzZWxlY3RvcjogXCJpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKVtmb3JtQ29udHJvbE5hbWVdLHRleHRhcmVhW2Zvcm1Db250cm9sTmFtZV0saW5wdXQ6bm90KFt0eXBlPWNoZWNrYm94XSlbZm9ybUNvbnRyb2xdLHRleHRhcmVhW2Zvcm1Db250cm9sXSxpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKVtuZ01vZGVsXSx0ZXh0YXJlYVtuZ01vZGVsXSxbbmdEZWZhdWx0Q29udHJvbF1cIiwgaG9zdDogeyBsaXN0ZW5lcnM6IHsgXCJpbnB1dFwiOiBcIiRhbnkodGhpcykuX2hhbmRsZUlucHV0KCRldmVudC50YXJnZXQudmFsdWUpXCIsIFwiYmx1clwiOiBcIm9uVG91Y2hlZCgpXCIsIFwiY29tcG9zaXRpb25zdGFydFwiOiBcIiRhbnkodGhpcykuX2NvbXBvc2l0aW9uU3RhcnQoKVwiLCBcImNvbXBvc2l0aW9uZW5kXCI6IFwiJGFueSh0aGlzKS5fY29tcG9zaXRpb25FbmQoJGV2ZW50LnRhcmdldC52YWx1ZSlcIiB9IH0sIHByb3ZpZGVyczogW0RFRkFVTFRfVkFMVUVfQUNDRVNTT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBEZWZhdWx0VmFsdWVBY2Nlc3NvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnaW5wdXQ6bm90KFt0eXBlPWNoZWNrYm94XSlbZm9ybUNvbnRyb2xOYW1lXSx0ZXh0YXJlYVtmb3JtQ29udHJvbE5hbWVdLGlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW2Zvcm1Db250cm9sXSx0ZXh0YXJlYVtmb3JtQ29udHJvbF0saW5wdXQ6bm90KFt0eXBlPWNoZWNrYm94XSlbbmdNb2RlbF0sdGV4dGFyZWFbbmdNb2RlbF0sW25nRGVmYXVsdENvbnRyb2xdJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogdnNhdmtpbiByZXBsYWNlIHRoZSBhYm92ZSBzZWxlY3RvciB3aXRoIHRoZSBvbmUgYmVsb3cgaXQgb25jZVxuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zMDExIGlzIGltcGxlbWVudGVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHNlbGVjdG9yOiAnW25nTW9kZWxdLFtmb3JtQ29udHJvbF0sW2Zvcm1Db250cm9sTmFtZV0nLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnKGlucHV0KSc6ICckYW55KHRoaXMpLl9oYW5kbGVJbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICcoY29tcG9zaXRpb25zdGFydCknOiAnJGFueSh0aGlzKS5fY29tcG9zaXRpb25TdGFydCgpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICcoY29tcG9zaXRpb25lbmQpJzogJyRhbnkodGhpcykuX2NvbXBvc2l0aW9uRW5kKCRldmVudC50YXJnZXQudmFsdWUpJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtERUZBVUxUX1ZBTFVFX0FDQ0VTU09SXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogaTAuUmVuZGVyZXIyIH0sIHsgdHlwZTogaTAuRWxlbWVudFJlZiB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW0NPTVBPU0lUSU9OX0JVRkZFUl9NT0RFXVxuICAgICAgICAgICAgICAgIH1dIH1dIH0pO1xuXG5mdW5jdGlvbiBpc0VtcHR5SW5wdXRWYWx1ZSh2YWx1ZSkge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBvYmplY3QgaXMgYSBzdHJpbmcgb3IgYXJyYXkgYmVmb3JlIGV2YWx1YXRpbmcgdGhlIGxlbmd0aCBhdHRyaWJ1dGUuXG4gICAgICogVGhpcyBhdm9pZHMgZmFsc2VseSByZWplY3Rpbmcgb2JqZWN0cyB0aGF0IGNvbnRhaW4gYSBjdXN0b20gbGVuZ3RoIGF0dHJpYnV0ZS5cbiAgICAgKiBGb3IgZXhhbXBsZSwgdGhlIG9iamVjdCB7aWQ6IDEsIGxlbmd0aDogMCwgd2lkdGg6IDB9IHNob3VsZCBub3QgYmUgcmV0dXJuZWQgYXMgZW1wdHkuXG4gICAgICovXG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgfHxcbiAgICAgICAgKCh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApO1xufVxuZnVuY3Rpb24gaGFzVmFsaWRMZW5ndGgodmFsdWUpIHtcbiAgICAvLyBub24tc3RyaWN0IGNvbXBhcmlzb24gaXMgaW50ZW50aW9uYWwsIHRvIGNoZWNrIGZvciBib3RoIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzXG4gICAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcic7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQW4gYEluamVjdGlvblRva2VuYCBmb3IgcmVnaXN0ZXJpbmcgYWRkaXRpb25hbCBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHVzZWQgd2l0aFxuICogYEFic3RyYWN0Q29udHJvbGBzLlxuICpcbiAqIEBzZWUge0BsaW5rIE5HX0FTWU5DX1ZBTElEQVRPUlN9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkaW5nIGEgY3VzdG9tIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSByZWdpc3RlcnMgYSBjdXN0b20gdmFsaWRhdG9yIGRpcmVjdGl2ZS4gQWRkaW5nIHRoZSB2YWxpZGF0b3IgdG8gdGhlXG4gKiBleGlzdGluZyBjb2xsZWN0aW9uIG9mIHZhbGlkYXRvcnMgcmVxdWlyZXMgdGhlIGBtdWx0aTogdHJ1ZWAgb3B0aW9uLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b21WYWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gKiAgICAgcmV0dXJuIHsgJ2N1c3RvbSc6IHRydWUgfTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jb25zdCBOR19WQUxJREFUT1JTID0gbmV3IEluamVjdGlvblRva2VuKG5nRGV2TW9kZSA/ICdOZ1ZhbGlkYXRvcnMnIDogJycpO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGBJbmplY3Rpb25Ub2tlbmAgZm9yIHJlZ2lzdGVyaW5nIGFkZGl0aW9uYWwgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdXNlZCB3aXRoXG4gKiBgQWJzdHJhY3RDb250cm9sYHMuXG4gKlxuICogQHNlZSB7QGxpbmsgTkdfVkFMSURBVE9SU31cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBQcm92aWRlIGEgY3VzdG9tIGFzeW5jIHZhbGlkYXRvciBkaXJlY3RpdmVcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW1wbGVtZW50cyB0aGUgYEFzeW5jVmFsaWRhdG9yYCBpbnRlcmZhY2UgdG8gY3JlYXRlIGFuXG4gKiBhc3luYyB2YWxpZGF0b3IgZGlyZWN0aXZlIHdpdGggYSBjdXN0b20gZXJyb3Iga2V5LlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b21Bc3luY1ZhbGlkYXRvcl0nLFxuICogICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTkdfQVNZTkNfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IEN1c3RvbUFzeW5jVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTpcbiAqIHRydWV9XVxuICogfSlcbiAqIGNsYXNzIEN1c3RvbUFzeW5jVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgQXN5bmNWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBQcm9taXNlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD4ge1xuICogICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeydjdXN0b20nOiB0cnVlfSk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY29uc3QgTkdfQVNZTkNfVkFMSURBVE9SUyA9IG5ldyBJbmplY3Rpb25Ub2tlbihuZ0Rldk1vZGUgPyAnTmdBc3luY1ZhbGlkYXRvcnMnIDogJycpO1xuLyoqXG4gKiBBIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IG1hdGNoZXMgdmFsaWQgZS1tYWlsIGFkZHJlc3Nlcy5cbiAqXG4gKiBBdCBhIGhpZ2ggbGV2ZWwsIHRoaXMgcmVnZXhwIG1hdGNoZXMgZS1tYWlsIGFkZHJlc3NlcyBvZiB0aGUgZm9ybWF0IGBsb2NhbC1wYXJ0QHRsZGAsIHdoZXJlOlxuICogLSBgbG9jYWwtcGFydGAgY29uc2lzdHMgb2Ygb25lIG9yIG1vcmUgb2YgdGhlIGFsbG93ZWQgY2hhcmFjdGVycyAoYWxwaGFudW1lcmljIGFuZCBzb21lXG4gKiAgIHB1bmN0dWF0aW9uIHN5bWJvbHMpLlxuICogLSBgbG9jYWwtcGFydGAgY2Fubm90IGJlZ2luIG9yIGVuZCB3aXRoIGEgcGVyaW9kIChgLmApLlxuICogLSBgbG9jYWwtcGFydGAgY2Fubm90IGJlIGxvbmdlciB0aGFuIDY0IGNoYXJhY3RlcnMuXG4gKiAtIGB0bGRgIGNvbnNpc3RzIG9mIG9uZSBvciBtb3JlIGBsYWJlbHNgIHNlcGFyYXRlZCBieSBwZXJpb2RzIChgLmApLiBGb3IgZXhhbXBsZSBgbG9jYWxob3N0YCBvclxuICogICBgZm9vLmNvbWAuXG4gKiAtIEEgYGxhYmVsYCBjb25zaXN0cyBvZiBvbmUgb3IgbW9yZSBvZiB0aGUgYWxsb3dlZCBjaGFyYWN0ZXJzIChhbHBoYW51bWVyaWMsIGRhc2hlcyAoYC1gKSBhbmRcbiAqICAgcGVyaW9kcyAoYC5gKSkuXG4gKiAtIEEgYGxhYmVsYCBjYW5ub3QgYmVnaW4gb3IgZW5kIHdpdGggYSBkYXNoIChgLWApIG9yIGEgcGVyaW9kIChgLmApLlxuICogLSBBIGBsYWJlbGAgY2Fubm90IGJlIGxvbmdlciB0aGFuIDYzIGNoYXJhY3RlcnMuXG4gKiAtIFRoZSB3aG9sZSBhZGRyZXNzIGNhbm5vdCBiZSBsb25nZXIgdGhhbiAyNTQgY2hhcmFjdGVycy5cbiAqXG4gKiAjIyBJbXBsZW1lbnRhdGlvbiBiYWNrZ3JvdW5kXG4gKlxuICogVGhpcyByZWdleHAgd2FzIHBvcnRlZCBvdmVyIGZyb20gQW5ndWxhckpTIChzZWUgdGhlcmUgZm9yIGdpdCBoaXN0b3J5KTpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvYmxvYi9jMTMzZWY4MzYvc3JjL25nL2RpcmVjdGl2ZS9pbnB1dC5qcyNMMjdcbiAqIEl0IGlzIGJhc2VkIG9uIHRoZVxuICogW1dIQVRXRyB2ZXJzaW9uXShodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbnB1dC5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzKSB3aXRoXG4gKiBzb21lIGVuaGFuY2VtZW50cyB0byBpbmNvcnBvcmF0ZSBtb3JlIFJGQyBydWxlcyAoc3VjaCBhcyBydWxlcyByZWxhdGVkIHRvIGRvbWFpbiBuYW1lcyBhbmQgdGhlXG4gKiBsZW5ndGhzIG9mIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgYWRkcmVzcykuIFRoZSBtYWluIGRpZmZlcmVuY2VzIGZyb20gdGhlIFdIQVRXRyB2ZXJzaW9uIGFyZTpcbiAqICAgLSBEaXNhbGxvdyBgbG9jYWwtcGFydGAgdG8gYmVnaW4gb3IgZW5kIHdpdGggYSBwZXJpb2QgKGAuYCkuXG4gKiAgIC0gRGlzYWxsb3cgYGxvY2FsLXBhcnRgIGxlbmd0aCB0byBleGNlZWQgNjQgY2hhcmFjdGVycy5cbiAqICAgLSBEaXNhbGxvdyB0b3RhbCBhZGRyZXNzIGxlbmd0aCB0byBleGNlZWQgMjU0IGNoYXJhY3RlcnMuXG4gKlxuICogU2VlIFt0aGlzIGNvbW1pdF0oaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9jb21taXQvZjNmNWNmNzJlKSBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG5jb25zdCBFTUFJTF9SRUdFWFAgPSAvXig/PS57MSwyNTR9JCkoPz0uezEsNjR9QClbYS16QS1aMC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtekEtWjAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXMgYSBzZXQgb2YgYnVpbHQtaW4gdmFsaWRhdG9ycyB0aGF0IGNhbiBiZSB1c2VkIGJ5IGZvcm0gY29udHJvbHMuXG4gKlxuICogQSB2YWxpZGF0b3IgaXMgYSBmdW5jdGlvbiB0aGF0IHByb2Nlc3NlcyBhIGBGb3JtQ29udHJvbGAgb3IgY29sbGVjdGlvbiBvZlxuICogY29udHJvbHMgYW5kIHJldHVybnMgYW4gZXJyb3IgbWFwIG9yIG51bGwuIEEgbnVsbCBtYXAgbWVhbnMgdGhhdCB2YWxpZGF0aW9uIGhhcyBwYXNzZWQuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXSgvZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgVmFsaWRhdG9ycyB7XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIG51bWJlci5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgVmFsaWRhdGUgYWdhaW5zdCBhIG1pbmltdW0gb2YgM1xuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woMiwgVmFsaWRhdG9ycy5taW4oMykpO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7bWluOiB7bWluOiAzLCBhY3R1YWw6IDJ9fVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgICAqIGBtaW5gIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIG1pbihtaW4pIHtcbiAgICAgICAgcmV0dXJuIG1pblZhbGlkYXRvcihtaW4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbnVtYmVyLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKlxuICAgICAqICMjIyBWYWxpZGF0ZSBhZ2FpbnN0IGEgbWF4aW11bSBvZiAxNVxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woMTYsIFZhbGlkYXRvcnMubWF4KDE1KSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHttYXg6IHttYXg6IDE1LCBhY3R1YWw6IDE2fX1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICAgKiBgbWF4YCBwcm9wZXJ0eSBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICAgKlxuICAgICAqL1xuICAgIHN0YXRpYyBtYXgobWF4KSB7XG4gICAgICAgIHJldHVybiBtYXhWYWxpZGF0b3IobWF4KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wgaGF2ZSBhIG5vbi1lbXB0eSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgaXMgbm9uLWVtcHR5XG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtyZXF1aXJlZDogdHJ1ZX1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEFuIGVycm9yIG1hcCB3aXRoIHRoZSBgcmVxdWlyZWRgIHByb3BlcnR5XG4gICAgICogaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCl9XG4gICAgICpcbiAgICAgKi9cbiAgICBzdGF0aWMgcmVxdWlyZWQoY29udHJvbCkge1xuICAgICAgICByZXR1cm4gcmVxdWlyZWRWYWxpZGF0b3IoY29udHJvbCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgYmUgdHJ1ZS4gVGhpcyB2YWxpZGF0b3IgaXMgY29tbW9ubHlcbiAgICAgKiB1c2VkIGZvciByZXF1aXJlZCBjaGVja2JveGVzLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKlxuICAgICAqICMjIyBWYWxpZGF0ZSB0aGF0IHRoZSBmaWVsZCB2YWx1ZSBpcyB0cnVlXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnc29tZSB2YWx1ZScsIFZhbGlkYXRvcnMucmVxdWlyZWRUcnVlKTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge3JlcXVpcmVkOiB0cnVlfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHJldHVybnMgQW4gZXJyb3IgbWFwIHRoYXQgY29udGFpbnMgdGhlIGByZXF1aXJlZGAgcHJvcGVydHlcbiAgICAgKiBzZXQgdG8gYHRydWVgIGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIHJlcXVpcmVkVHJ1ZShjb250cm9sKSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlZFRydWVWYWxpZGF0b3IoY29udHJvbCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgcGFzcyBhbiBlbWFpbCB2YWxpZGF0aW9uIHRlc3QuXG4gICAgICpcbiAgICAgKiBUZXN0cyB0aGUgdmFsdWUgdXNpbmcgYSBbcmVndWxhclxuICAgICAqIGV4cHJlc3Npb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvR3VpZGUvUmVndWxhcl9FeHByZXNzaW9ucylcbiAgICAgKiBwYXR0ZXJuIHN1aXRhYmxlIGZvciBjb21tb24gdXNlIGNhc2VzLiBUaGUgcGF0dGVybiBpcyBiYXNlZCBvbiB0aGUgZGVmaW5pdGlvbiBvZiBhIHZhbGlkIGVtYWlsXG4gICAgICogYWRkcmVzcyBpbiB0aGUgW1dIQVRXRyBIVE1MXG4gICAgICogc3BlY2lmaWNhdGlvbl0oaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5wdXQuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzcykgd2l0aFxuICAgICAqIHNvbWUgZW5oYW5jZW1lbnRzIHRvIGluY29ycG9yYXRlIG1vcmUgUkZDIHJ1bGVzIChzdWNoIGFzIHJ1bGVzIHJlbGF0ZWQgdG8gZG9tYWluIG5hbWVzIGFuZCB0aGVcbiAgICAgKiBsZW5ndGhzIG9mIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgYWRkcmVzcykuXG4gICAgICpcbiAgICAgKiBUaGUgZGlmZmVyZW5jZXMgZnJvbSB0aGUgV0hBVFdHIHZlcnNpb24gaW5jbHVkZTpcbiAgICAgKiAtIERpc2FsbG93IGBsb2NhbC1wYXJ0YCAodGhlIHBhcnQgYmVmb3JlIHRoZSBgQGAgc3ltYm9sKSB0byBiZWdpbiBvciBlbmQgd2l0aCBhIHBlcmlvZCAoYC5gKS5cbiAgICAgKiAtIERpc2FsbG93IGBsb2NhbC1wYXJ0YCB0byBiZSBsb25nZXIgdGhhbiA2NCBjaGFyYWN0ZXJzLlxuICAgICAqIC0gRGlzYWxsb3cgdGhlIHdob2xlIGFkZHJlc3MgdG8gYmUgbG9uZ2VyIHRoYW4gMjU0IGNoYXJhY3RlcnMuXG4gICAgICpcbiAgICAgKiBJZiB0aGlzIHBhdHRlcm4gZG9lcyBub3Qgc2F0aXNmeSB5b3VyIGJ1c2luZXNzIG5lZWRzLCB5b3UgY2FuIHVzZSBgVmFsaWRhdG9ycy5wYXR0ZXJuKClgIHRvXG4gICAgICogdmFsaWRhdGUgdGhlIHZhbHVlIGFnYWluc3QgYSBkaWZmZXJlbnQgcGF0dGVybi5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgbWF0Y2hlcyBhIHZhbGlkIGVtYWlsIHBhdHRlcm5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdiYWRAJywgVmFsaWRhdG9ycy5lbWFpbCk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtlbWFpbDogdHJ1ZX1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEFuIGVycm9yIG1hcCB3aXRoIHRoZSBgZW1haWxgIHByb3BlcnR5XG4gICAgICogaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCl9XG4gICAgICpcbiAgICAgKi9cbiAgICBzdGF0aWMgZW1haWwoY29udHJvbCkge1xuICAgICAgICByZXR1cm4gZW1haWxWYWxpZGF0b3IoY29udHJvbCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBsZW5ndGggb2YgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWxcbiAgICAgKiB0byB0aGUgcHJvdmlkZWQgbWluaW11bSBsZW5ndGguIFRoaXMgdmFsaWRhdG9yIGlzIGFsc28gcHJvdmlkZWQgYnkgZGVmYXVsdCBpZiB5b3UgdXNlIHRoZVxuICAgICAqIHRoZSBIVE1MNSBgbWlubGVuZ3RoYCBhdHRyaWJ1dGUuIE5vdGUgdGhhdCB0aGUgYG1pbkxlbmd0aGAgdmFsaWRhdG9yIGlzIGludGVuZGVkIHRvIGJlIHVzZWRcbiAgICAgKiBvbmx5IGZvciB0eXBlcyB0aGF0IGhhdmUgYSBudW1lcmljIGBsZW5ndGhgIHByb3BlcnR5LCBzdWNoIGFzIHN0cmluZ3Mgb3IgYXJyYXlzLiBUaGVcbiAgICAgKiBgbWluTGVuZ3RoYCB2YWxpZGF0b3IgbG9naWMgaXMgYWxzbyBub3QgaW52b2tlZCBmb3IgdmFsdWVzIHdoZW4gdGhlaXIgYGxlbmd0aGAgcHJvcGVydHkgaXMgMFxuICAgICAqIChmb3IgZXhhbXBsZSBpbiBjYXNlIG9mIGFuIGVtcHR5IHN0cmluZyBvciBhbiBlbXB0eSBhcnJheSksIHRvIHN1cHBvcnQgb3B0aW9uYWwgY29udHJvbHMuIFlvdVxuICAgICAqIGNhbiB1c2UgdGhlIHN0YW5kYXJkIGByZXF1aXJlZGAgdmFsaWRhdG9yIGlmIGVtcHR5IHZhbHVlcyBzaG91bGQgbm90IGJlIGNvbnNpZGVyZWQgdmFsaWQuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqXG4gICAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIGhhcyBhIG1pbmltdW0gb2YgMyBjaGFyYWN0ZXJzXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnbmcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgzKSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHttaW5sZW5ndGg6IHtyZXF1aXJlZExlbmd0aDogMywgYWN0dWFsTGVuZ3RoOiAyfX1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aW5wdXQgbWlubGVuZ3RoPVwiNVwiPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgICAqIGBtaW5sZW5ndGhgIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIG1pbkxlbmd0aChtaW5MZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1pbkxlbmd0aFZhbGlkYXRvcihtaW5MZW5ndGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgbGVuZ3RoIG9mIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIG9yIGVxdWFsXG4gICAgICogdG8gdGhlIHByb3ZpZGVkIG1heGltdW0gbGVuZ3RoLiBUaGlzIHZhbGlkYXRvciBpcyBhbHNvIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaWYgeW91IHVzZSB0aGVcbiAgICAgKiB0aGUgSFRNTDUgYG1heGxlbmd0aGAgYXR0cmlidXRlLiBOb3RlIHRoYXQgdGhlIGBtYXhMZW5ndGhgIHZhbGlkYXRvciBpcyBpbnRlbmRlZCB0byBiZSB1c2VkXG4gICAgICogb25seSBmb3IgdHlwZXMgdGhhdCBoYXZlIGEgbnVtZXJpYyBgbGVuZ3RoYCBwcm9wZXJ0eSwgc3VjaCBhcyBzdHJpbmdzIG9yIGFycmF5cy5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgaGFzIG1heGltdW0gb2YgNSBjaGFyYWN0ZXJzXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnQW5ndWxhcicsIFZhbGlkYXRvcnMubWF4TGVuZ3RoKDUpKTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge21heGxlbmd0aDoge3JlcXVpcmVkTGVuZ3RoOiA1LCBhY3R1YWxMZW5ndGg6IDd9fVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpbnB1dCBtYXhsZW5ndGg9XCI1XCI+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIHZhbGlkYXRvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZXJyb3IgbWFwIHdpdGggdGhlXG4gICAgICogYG1heGxlbmd0aGAgcHJvcGVydHkgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCl9XG4gICAgICpcbiAgICAgKi9cbiAgICBzdGF0aWMgbWF4TGVuZ3RoKG1heExlbmd0aCkge1xuICAgICAgICByZXR1cm4gbWF4TGVuZ3RoVmFsaWRhdG9yKG1heExlbmd0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gbWF0Y2ggYSByZWdleCBwYXR0ZXJuLiBUaGlzIHZhbGlkYXRvciBpcyBhbHNvXG4gICAgICogcHJvdmlkZWQgYnkgZGVmYXVsdCBpZiB5b3UgdXNlIHRoZSBIVE1MNSBgcGF0dGVybmAgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKlxuICAgICAqICMjIyBWYWxpZGF0ZSB0aGF0IHRoZSBmaWVsZCBvbmx5IGNvbnRhaW5zIGxldHRlcnMgb3Igc3BhY2VzXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnMScsIFZhbGlkYXRvcnMucGF0dGVybignW2EtekEtWiBdKicpKTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge3BhdHRlcm46IHtyZXF1aXJlZFBhdHRlcm46ICdeW2EtekEtWiBdKiQnLCBhY3R1YWxWYWx1ZTogJzEnfX1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aW5wdXQgcGF0dGVybj1cIlthLXpBLVogXSpcIj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqICMjIyBQYXR0ZXJuIG1hdGNoaW5nIHdpdGggdGhlIGdsb2JhbCBvciBzdGlja3kgZmxhZ1xuICAgICAqXG4gICAgICogYFJlZ0V4cGAgb2JqZWN0cyBjcmVhdGVkIHdpdGggdGhlIGBnYCBvciBgeWAgZmxhZ3MgdGhhdCBhcmUgcGFzc2VkIGludG8gYFZhbGlkYXRvcnMucGF0dGVybmBcbiAgICAgKiBjYW4gcHJvZHVjZSBkaWZmZXJlbnQgcmVzdWx0cyBvbiB0aGUgc2FtZSBpbnB1dCB3aGVuIHZhbGlkYXRpb25zIGFyZSBydW4gY29uc2VjdXRpdmVseS4gVGhpcyBpc1xuICAgICAqIGR1ZSB0byBob3cgdGhlIGJlaGF2aW9yIG9mIGBSZWdFeHAucHJvdG90eXBlLnRlc3RgIGlzXG4gICAgICogc3BlY2lmaWVkIGluIFtFQ01BLTI2Ml0oaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1yZWdleHBidWlsdGluZXhlYylcbiAgICAgKiAoYFJlZ0V4cGAgcHJlc2VydmVzIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBtYXRjaCB3aGVuIHRoZSBnbG9iYWwgb3Igc3RpY2t5IGZsYWcgaXMgdXNlZCkuXG4gICAgICogRHVlIHRvIHRoaXMgYmVoYXZpb3IsIGl0IGlzIHJlY29tbWVuZGVkIHRoYXQgd2hlbiB1c2luZ1xuICAgICAqIGBWYWxpZGF0b3JzLnBhdHRlcm5gIHlvdSAqKmRvIG5vdCoqIHBhc3MgaW4gYSBgUmVnRXhwYCBvYmplY3Qgd2l0aCBlaXRoZXIgdGhlIGdsb2JhbCBvciBzdGlja3lcbiAgICAgKiBmbGFnIGVuYWJsZWQuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gTm90IHJlY29tbWVuZGVkIChzaW5jZSB0aGUgYGdgIGZsYWcgaXMgdXNlZClcbiAgICAgKiBjb25zdCBjb250cm9sT25lID0gbmV3IEZvcm1Db250cm9sKCcxJywgVmFsaWRhdG9ycy5wYXR0ZXJuKC9mb28vZykpO1xuICAgICAqXG4gICAgICogLy8gR29vZFxuICAgICAqIGNvbnN0IGNvbnRyb2xUd28gPSBuZXcgRm9ybUNvbnRyb2woJzEnLCBWYWxpZGF0b3JzLnBhdHRlcm4oL2Zvby8pKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXR0ZXJuIEEgcmVndWxhciBleHByZXNzaW9uIHRvIGJlIHVzZWQgYXMgaXMgdG8gdGVzdCB0aGUgdmFsdWVzLCBvciBhIHN0cmluZy5cbiAgICAgKiBJZiBhIHN0cmluZyBpcyBwYXNzZWQsIHRoZSBgXmAgY2hhcmFjdGVyIGlzIHByZXBlbmRlZCBhbmQgdGhlIGAkYCBjaGFyYWN0ZXIgaXNcbiAgICAgKiBhcHBlbmRlZCB0byB0aGUgcHJvdmlkZWQgc3RyaW5nIChpZiBub3QgYWxyZWFkeSBwcmVzZW50KSwgYW5kIHRoZSByZXN1bHRpbmcgcmVndWxhclxuICAgICAqIGV4cHJlc3Npb24gaXMgdXNlZCB0byB0ZXN0IHRoZSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIHZhbGlkYXRvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZXJyb3IgbWFwIHdpdGggdGhlXG4gICAgICogYHBhdHRlcm5gIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIHBhdHRlcm4ocGF0dGVybikge1xuICAgICAgICByZXR1cm4gcGF0dGVyblZhbGlkYXRvcihwYXR0ZXJuKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVmFsaWRhdG9yIHRoYXQgcGVyZm9ybXMgbm8gb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIG51bGxWYWxpZGF0b3IoY29udHJvbCkge1xuICAgICAgICByZXR1cm4gbnVsbFZhbGlkYXRvcihjb250cm9sKTtcbiAgICB9XG4gICAgc3RhdGljIGNvbXBvc2UodmFsaWRhdG9ycykge1xuICAgICAgICByZXR1cm4gY29tcG9zZSh2YWxpZGF0b3JzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29tcG9zZSBtdWx0aXBsZSBhc3luYyB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB1bmlvblxuICAgICAqIG9mIHRoZSBpbmRpdmlkdWFsIGVycm9yIG9iamVjdHMgZm9yIHRoZSBwcm92aWRlZCBjb250cm9sLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgICAqIG1lcmdlZCBlcnJvciBvYmplY3RzIG9mIHRoZSBhc3luYyB2YWxpZGF0b3JzIGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIGNvbXBvc2VBc3luYyh2YWxpZGF0b3JzKSB7XG4gICAgICAgIHJldHVybiBjb21wb3NlQXN5bmModmFsaWRhdG9ycyk7XG4gICAgfVxufVxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbnVtYmVyLlxuICogU2VlIGBWYWxpZGF0b3JzLm1pbmAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIG1pblZhbGlkYXRvcihtaW4pIHtcbiAgICByZXR1cm4gKGNvbnRyb2wpID0+IHtcbiAgICAgICAgaWYgKGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpIHx8IGlzRW1wdHlJbnB1dFZhbHVlKG1pbikpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlRmxvYXQoY29udHJvbC52YWx1ZSk7XG4gICAgICAgIC8vIENvbnRyb2xzIHdpdGggTmFOIHZhbHVlcyBhZnRlciBwYXJzaW5nIHNob3VsZCBiZSB0cmVhdGVkIGFzIG5vdCBoYXZpbmcgYVxuICAgICAgICAvLyBtaW5pbXVtLCBwZXIgdGhlIEhUTUwgZm9ybXMgc3BlYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjYXR0ci1pbnB1dC1taW5cbiAgICAgICAgcmV0dXJuICFpc05hTih2YWx1ZSkgJiYgdmFsdWUgPCBtaW4gPyB7ICdtaW4nOiB7ICdtaW4nOiBtaW4sICdhY3R1YWwnOiBjb250cm9sLnZhbHVlIH0gfSA6IG51bGw7XG4gICAgfTtcbn1cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIG51bWJlci5cbiAqIFNlZSBgVmFsaWRhdG9ycy5tYXhgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBtYXhWYWxpZGF0b3IobWF4KSB7XG4gICAgcmV0dXJuIChjb250cm9sKSA9PiB7XG4gICAgICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSB8fCBpc0VtcHR5SW5wdXRWYWx1ZShtYXgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRyb2wudmFsdWUpO1xuICAgICAgICAvLyBDb250cm9scyB3aXRoIE5hTiB2YWx1ZXMgYWZ0ZXIgcGFyc2luZyBzaG91bGQgYmUgdHJlYXRlZCBhcyBub3QgaGF2aW5nIGFcbiAgICAgICAgLy8gbWF4aW11bSwgcGVyIHRoZSBIVE1MIGZvcm1zIHNwZWM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWF4XG4gICAgICAgIHJldHVybiAhaXNOYU4odmFsdWUpICYmIHZhbHVlID4gbWF4ID8geyAnbWF4JzogeyAnbWF4JzogbWF4LCAnYWN0dWFsJzogY29udHJvbC52YWx1ZSB9IH0gOiBudWxsO1xuICAgIH07XG59XG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sIGhhdmUgYSBub24tZW1wdHkgdmFsdWUuXG4gKiBTZWUgYFZhbGlkYXRvcnMucmVxdWlyZWRgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiByZXF1aXJlZFZhbGlkYXRvcihjb250cm9sKSB7XG4gICAgcmV0dXJuIGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpID8geyAncmVxdWlyZWQnOiB0cnVlIH0gOiBudWxsO1xufVxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIGJlIHRydWUuIFRoaXMgdmFsaWRhdG9yIGlzIGNvbW1vbmx5XG4gKiB1c2VkIGZvciByZXF1aXJlZCBjaGVja2JveGVzLlxuICogU2VlIGBWYWxpZGF0b3JzLnJlcXVpcmVkVHJ1ZWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIHJlcXVpcmVkVHJ1ZVZhbGlkYXRvcihjb250cm9sKSB7XG4gICAgcmV0dXJuIGNvbnRyb2wudmFsdWUgPT09IHRydWUgPyBudWxsIDogeyAncmVxdWlyZWQnOiB0cnVlIH07XG59XG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgcGFzcyBhbiBlbWFpbCB2YWxpZGF0aW9uIHRlc3QuXG4gKiBTZWUgYFZhbGlkYXRvcnMuZW1haWxgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBlbWFpbFZhbGlkYXRvcihjb250cm9sKSB7XG4gICAgaWYgKGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICB9XG4gICAgcmV0dXJuIEVNQUlMX1JFR0VYUC50ZXN0KGNvbnRyb2wudmFsdWUpID8gbnVsbCA6IHsgJ2VtYWlsJzogdHJ1ZSB9O1xufVxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgbGVuZ3RoIG9mIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsXG4gKiB0byB0aGUgcHJvdmlkZWQgbWluaW11bSBsZW5ndGguIFNlZSBgVmFsaWRhdG9ycy5taW5MZW5ndGhgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBtaW5MZW5ndGhWYWxpZGF0b3IobWluTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChjb250cm9sKSA9PiB7XG4gICAgICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSB8fCAhaGFzVmFsaWRMZW5ndGgoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICAgICAgICAgICAgLy8gZG9uJ3QgdmFsaWRhdGUgdmFsdWVzIHdpdGhvdXQgYGxlbmd0aGAgcHJvcGVydHlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250cm9sLnZhbHVlLmxlbmd0aCA8IG1pbkxlbmd0aCA/XG4gICAgICAgICAgICB7ICdtaW5sZW5ndGgnOiB7ICdyZXF1aXJlZExlbmd0aCc6IG1pbkxlbmd0aCwgJ2FjdHVhbExlbmd0aCc6IGNvbnRyb2wudmFsdWUubGVuZ3RoIH0gfSA6XG4gICAgICAgICAgICBudWxsO1xuICAgIH07XG59XG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBsZW5ndGggb2YgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gb3IgZXF1YWxcbiAqIHRvIHRoZSBwcm92aWRlZCBtYXhpbXVtIGxlbmd0aC4gU2VlIGBWYWxpZGF0b3JzLm1heExlbmd0aGAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIG1heExlbmd0aFZhbGlkYXRvcihtYXhMZW5ndGgpIHtcbiAgICByZXR1cm4gKGNvbnRyb2wpID0+IHtcbiAgICAgICAgcmV0dXJuIGhhc1ZhbGlkTGVuZ3RoKGNvbnRyb2wudmFsdWUpICYmIGNvbnRyb2wudmFsdWUubGVuZ3RoID4gbWF4TGVuZ3RoID9cbiAgICAgICAgICAgIHsgJ21heGxlbmd0aCc6IHsgJ3JlcXVpcmVkTGVuZ3RoJzogbWF4TGVuZ3RoLCAnYWN0dWFsTGVuZ3RoJzogY29udHJvbC52YWx1ZS5sZW5ndGggfSB9IDpcbiAgICAgICAgICAgIG51bGw7XG4gICAgfTtcbn1cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBtYXRjaCBhIHJlZ2V4IHBhdHRlcm4uXG4gKiBTZWUgYFZhbGlkYXRvcnMucGF0dGVybmAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIHBhdHRlcm5WYWxpZGF0b3IocGF0dGVybikge1xuICAgIGlmICghcGF0dGVybilcbiAgICAgICAgcmV0dXJuIG51bGxWYWxpZGF0b3I7XG4gICAgbGV0IHJlZ2V4O1xuICAgIGxldCByZWdleFN0cjtcbiAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlZ2V4U3RyID0gJyc7XG4gICAgICAgIGlmIChwYXR0ZXJuLmNoYXJBdCgwKSAhPT0gJ14nKVxuICAgICAgICAgICAgcmVnZXhTdHIgKz0gJ14nO1xuICAgICAgICByZWdleFN0ciArPSBwYXR0ZXJuO1xuICAgICAgICBpZiAocGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGggLSAxKSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVnZXhTdHIgKz0gJyQnO1xuICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVnZXhTdHIgPSBwYXR0ZXJuLnRvU3RyaW5nKCk7XG4gICAgICAgIHJlZ2V4ID0gcGF0dGVybjtcbiAgICB9XG4gICAgcmV0dXJuIChjb250cm9sKSA9PiB7XG4gICAgICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY29udHJvbC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QodmFsdWUpID8gbnVsbCA6XG4gICAgICAgICAgICB7ICdwYXR0ZXJuJzogeyAncmVxdWlyZWRQYXR0ZXJuJzogcmVnZXhTdHIsICdhY3R1YWxWYWx1ZSc6IHZhbHVlIH0gfTtcbiAgICB9O1xufVxuLyoqXG4gKiBGdW5jdGlvbiB0aGF0IGhhcyBgVmFsaWRhdG9yRm5gIHNoYXBlLCBidXQgcGVyZm9ybXMgbm8gb3BlcmF0aW9uLlxuICovXG5mdW5jdGlvbiBudWxsVmFsaWRhdG9yKGNvbnRyb2wpIHtcbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGlzUHJlc2VudChvKSB7XG4gICAgcmV0dXJuIG8gIT0gbnVsbDtcbn1cbmZ1bmN0aW9uIHRvT2JzZXJ2YWJsZSh2YWx1ZSkge1xuICAgIGNvbnN0IG9icyA9IMm1aXNQcm9taXNlKHZhbHVlKSA/IGZyb20odmFsdWUpIDogdmFsdWU7XG4gICAgaWYgKCh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpICYmICEoybVpc1N1YnNjcmliYWJsZShvYnMpKSkge1xuICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gYEV4cGVjdGVkIGFzeW5jIHZhbGlkYXRvciB0byByZXR1cm4gUHJvbWlzZSBvciBPYnNlcnZhYmxlLmA7XG4gICAgICAgIC8vIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIHdpbGwgcmV0dXJuIG9iamVjdCBvciBudWxsLlxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlICs9XG4gICAgICAgICAgICAgICAgJyBBcmUgeW91IHVzaW5nIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIHdoZXJlIGFuIGFzeW5jIHZhbGlkYXRvciBpcyBleHBlY3RlZD8nO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyDJtVJ1bnRpbWVFcnJvcigtMTEwMSAvKiBSdW50aW1lRXJyb3JDb2RlLldST05HX1ZBTElEQVRPUl9SRVRVUk5fVFlQRSAqLywgZXJyb3JNZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIG9icztcbn1cbmZ1bmN0aW9uIG1lcmdlRXJyb3JzKGFycmF5T2ZFcnJvcnMpIHtcbiAgICBsZXQgcmVzID0ge307XG4gICAgYXJyYXlPZkVycm9ycy5mb3JFYWNoKChlcnJvcnMpID0+IHtcbiAgICAgICAgcmVzID0gZXJyb3JzICE9IG51bGwgPyB7IC4uLnJlcywgLi4uZXJyb3JzIH0gOiByZXM7XG4gICAgfSk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHJlcykubGVuZ3RoID09PSAwID8gbnVsbCA6IHJlcztcbn1cbmZ1bmN0aW9uIGV4ZWN1dGVWYWxpZGF0b3JzKGNvbnRyb2wsIHZhbGlkYXRvcnMpIHtcbiAgICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHZhbGlkYXRvcihjb250cm9sKSk7XG59XG5mdW5jdGlvbiBpc1ZhbGlkYXRvckZuKHZhbGlkYXRvcikge1xuICAgIHJldHVybiAhdmFsaWRhdG9yLnZhbGlkYXRlO1xufVxuLyoqXG4gKiBHaXZlbiB0aGUgbGlzdCBvZiB2YWxpZGF0b3JzIHRoYXQgbWF5IGNvbnRhaW4gYm90aCBmdW5jdGlvbnMgYXMgd2VsbCBhcyBjbGFzc2VzLCByZXR1cm4gdGhlIGxpc3RcbiAqIG9mIHZhbGlkYXRvciBmdW5jdGlvbnMgKGNvbnZlcnQgdmFsaWRhdG9yIGNsYXNzZXMgaW50byB2YWxpZGF0b3IgZnVuY3Rpb25zKS4gVGhpcyBpcyBuZWVkZWQgdG9cbiAqIGhhdmUgY29uc2lzdGVudCBzdHJ1Y3R1cmUgaW4gdmFsaWRhdG9ycyBsaXN0IGJlZm9yZSBjb21wb3NpbmcgdGhlbS5cbiAqXG4gKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgc2V0IG9mIHZhbGlkYXRvcnMgdGhhdCBtYXkgY29udGFpbiB2YWxpZGF0b3JzIGJvdGggaW4gcGxhaW4gZnVuY3Rpb24gZm9ybVxuICogICAgIGFzIHdlbGwgYXMgcmVwcmVzZW50ZWQgYXMgYSB2YWxpZGF0b3IgY2xhc3MuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgIHJldHVybiB2YWxpZGF0b3JzLm1hcCh2YWxpZGF0b3IgPT4ge1xuICAgICAgICByZXR1cm4gaXNWYWxpZGF0b3JGbih2YWxpZGF0b3IpID9cbiAgICAgICAgICAgIHZhbGlkYXRvciA6XG4gICAgICAgICAgICAoKGMpID0+IHZhbGlkYXRvci52YWxpZGF0ZShjKSk7XG4gICAgfSk7XG59XG4vKipcbiAqIE1lcmdlcyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgdmFsaWRhdG9yIGZ1bmN0aW9uLlxuICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2VgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBjb21wb3NlKHZhbGlkYXRvcnMpIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHByZXNlbnRWYWxpZGF0b3JzID0gdmFsaWRhdG9ycy5maWx0ZXIoaXNQcmVzZW50KTtcbiAgICBpZiAocHJlc2VudFZhbGlkYXRvcnMubGVuZ3RoID09IDApXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiBmdW5jdGlvbiAoY29udHJvbCkge1xuICAgICAgICByZXR1cm4gbWVyZ2VFcnJvcnMoZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMpKTtcbiAgICB9O1xufVxuLyoqXG4gKiBBY2NlcHRzIGEgbGlzdCBvZiB2YWxpZGF0b3JzIG9mIGRpZmZlcmVudCBwb3NzaWJsZSBzaGFwZXMgKGBWYWxpZGF0b3JgIGFuZCBgVmFsaWRhdG9yRm5gKSxcbiAqIG5vcm1hbGl6ZXMgdGhlIGxpc3QgKGNvbnZlcnRzIGV2ZXJ5dGhpbmcgdG8gYFZhbGlkYXRvckZuYCkgYW5kIG1lcmdlcyB0aGVtIGludG8gYSBzaW5nbGVcbiAqIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgIHJldHVybiB2YWxpZGF0b3JzICE9IG51bGwgPyBjb21wb3NlKG5vcm1hbGl6ZVZhbGlkYXRvcnModmFsaWRhdG9ycykpIDogbnVsbDtcbn1cbi8qKlxuICogTWVyZ2VzIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgdmFsaWRhdG9yIGZ1bmN0aW9uLlxuICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2VBc3luY2AgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VBc3luYyh2YWxpZGF0b3JzKSB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PSAwKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNvbnRyb2wpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBleGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycykubWFwKHRvT2JzZXJ2YWJsZSk7XG4gICAgICAgIHJldHVybiBmb3JrSm9pbihvYnNlcnZhYmxlcykucGlwZShtYXAobWVyZ2VFcnJvcnMpKTtcbiAgICB9O1xufVxuLyoqXG4gKiBBY2NlcHRzIGEgbGlzdCBvZiBhc3luYyB2YWxpZGF0b3JzIG9mIGRpZmZlcmVudCBwb3NzaWJsZSBzaGFwZXMgKGBBc3luY1ZhbGlkYXRvcmAgYW5kXG4gKiBgQXN5bmNWYWxpZGF0b3JGbmApLCBub3JtYWxpemVzIHRoZSBsaXN0IChjb252ZXJ0cyBldmVyeXRoaW5nIHRvIGBBc3luY1ZhbGlkYXRvckZuYCkgYW5kIG1lcmdlc1xuICogdGhlbSBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZUFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSB7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnMgIT0gbnVsbCA/IGNvbXBvc2VBc3luYyhub3JtYWxpemVWYWxpZGF0b3JzKHZhbGlkYXRvcnMpKSA6XG4gICAgICAgIG51bGw7XG59XG4vKipcbiAqIE1lcmdlcyByYXcgY29udHJvbCB2YWxpZGF0b3JzIHdpdGggYSBnaXZlbiBkaXJlY3RpdmUgdmFsaWRhdG9yIGFuZCByZXR1cm5zIHRoZSBjb21iaW5lZCBsaXN0IG9mXG4gKiB2YWxpZGF0b3JzIGFzIGFuIGFycmF5LlxuICovXG5mdW5jdGlvbiBtZXJnZVZhbGlkYXRvcnMoY29udHJvbFZhbGlkYXRvcnMsIGRpclZhbGlkYXRvcikge1xuICAgIGlmIChjb250cm9sVmFsaWRhdG9ycyA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuIFtkaXJWYWxpZGF0b3JdO1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGNvbnRyb2xWYWxpZGF0b3JzKSA/IFsuLi5jb250cm9sVmFsaWRhdG9ycywgZGlyVmFsaWRhdG9yXSA6XG4gICAgICAgIFtjb250cm9sVmFsaWRhdG9ycywgZGlyVmFsaWRhdG9yXTtcbn1cbi8qKlxuICogUmV0cmlldmVzIHRoZSBsaXN0IG9mIHJhdyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGF0dGFjaGVkIHRvIGEgZ2l2ZW4gY29udHJvbC5cbiAqL1xuZnVuY3Rpb24gZ2V0Q29udHJvbFZhbGlkYXRvcnMoY29udHJvbCkge1xuICAgIHJldHVybiBjb250cm9sLl9yYXdWYWxpZGF0b3JzO1xufVxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGxpc3Qgb2YgcmF3IGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGF0dGFjaGVkIHRvIGEgZ2l2ZW4gY29udHJvbC5cbiAqL1xuZnVuY3Rpb24gZ2V0Q29udHJvbEFzeW5jVmFsaWRhdG9ycyhjb250cm9sKSB7XG4gICAgcmV0dXJuIGNvbnRyb2wuX3Jhd0FzeW5jVmFsaWRhdG9ycztcbn1cbi8qKlxuICogQWNjZXB0cyBhIHNpbmdsZXRvbiB2YWxpZGF0b3IsIGFuIGFycmF5LCBvciBudWxsLCBhbmQgcmV0dXJucyBhbiBhcnJheSB0eXBlIHdpdGggdGhlIHByb3ZpZGVkXG4gKiB2YWxpZGF0b3JzLlxuICpcbiAqIEBwYXJhbSB2YWxpZGF0b3JzIEEgdmFsaWRhdG9yLCB2YWxpZGF0b3JzLCBvciBudWxsLlxuICogQHJldHVybnMgQSB2YWxpZGF0b3JzIGFycmF5LlxuICovXG5mdW5jdGlvbiBtYWtlVmFsaWRhdG9yc0FycmF5KHZhbGlkYXRvcnMpIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpXG4gICAgICAgIHJldHVybiBbXTtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JzKSA/IHZhbGlkYXRvcnMgOiBbdmFsaWRhdG9yc107XG59XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIGFycmF5IGhhcyBhIGdpdmVuIHZhbGlkYXRvci5cbiAqXG4gKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gY29tcGFyZSBhZ2FpbnN0LlxuICogQHBhcmFtIHZhbGlkYXRvciBUaGUgdmFsaWRhdG9yIHRvIGNoZWNrLlxuICogQHJldHVybnMgV2hldGhlciB0aGUgdmFsaWRhdG9yIGlzIHByZXNlbnQuXG4gKi9cbmZ1bmN0aW9uIGhhc1ZhbGlkYXRvcih2YWxpZGF0b3JzLCB2YWxpZGF0b3IpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JzKSA/IHZhbGlkYXRvcnMuaW5jbHVkZXModmFsaWRhdG9yKSA6IHZhbGlkYXRvcnMgPT09IHZhbGlkYXRvcjtcbn1cbi8qKlxuICogQ29tYmluZXMgdHdvIGFycmF5cyBvZiB2YWxpZGF0b3JzIGludG8gb25lLiBJZiBkdXBsaWNhdGVzIGFyZSBwcm92aWRlZCwgb25seSBvbmUgd2lsbCBiZSBhZGRlZC5cbiAqXG4gKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgbmV3IHZhbGlkYXRvcnMuXG4gKiBAcGFyYW0gY3VycmVudFZhbGlkYXRvcnMgVGhlIGJhc2UgYXJyYXkgb2YgY3VycmVudCB2YWxpZGF0b3JzLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2YgdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCBjdXJyZW50VmFsaWRhdG9ycykge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBtYWtlVmFsaWRhdG9yc0FycmF5KGN1cnJlbnRWYWxpZGF0b3JzKTtcbiAgICBjb25zdCB2YWxpZGF0b3JzVG9BZGQgPSBtYWtlVmFsaWRhdG9yc0FycmF5KHZhbGlkYXRvcnMpO1xuICAgIHZhbGlkYXRvcnNUb0FkZC5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgIC8vIE5vdGU6IGlmIHRoZXJlIGFyZSBkdXBsaWNhdGUgZW50cmllcyBpbiB0aGUgbmV3IHZhbGlkYXRvcnMgYXJyYXksXG4gICAgICAgIC8vIG9ubHkgdGhlIGZpcnN0IG9uZSB3b3VsZCBiZSBhZGRlZCB0byB0aGUgY3VycmVudCBsaXN0IG9mIHZhbGlkYXRvcnMuXG4gICAgICAgIC8vIER1cGxpY2F0ZSBvbmVzIHdvdWxkIGJlIGlnbm9yZWQgc2luY2UgYGhhc1ZhbGlkYXRvcmAgd291bGQgZGV0ZWN0XG4gICAgICAgIC8vIHRoZSBwcmVzZW5jZSBvZiBhIHZhbGlkYXRvciBmdW5jdGlvbiBhbmQgd2UgdXBkYXRlIHRoZSBjdXJyZW50IGxpc3QgaW4gcGxhY2UuXG4gICAgICAgIGlmICghaGFzVmFsaWRhdG9yKGN1cnJlbnQsIHYpKSB7XG4gICAgICAgICAgICBjdXJyZW50LnB1c2godik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY3VycmVudDtcbn1cbmZ1bmN0aW9uIHJlbW92ZVZhbGlkYXRvcnModmFsaWRhdG9ycywgY3VycmVudFZhbGlkYXRvcnMpIHtcbiAgICByZXR1cm4gbWFrZVZhbGlkYXRvcnNBcnJheShjdXJyZW50VmFsaWRhdG9ycykuZmlsdGVyKHYgPT4gIWhhc1ZhbGlkYXRvcih2YWxpZGF0b3JzLCB2KSk7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBCYXNlIGNsYXNzIGZvciBjb250cm9sIGRpcmVjdGl2ZXMuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBvbmx5IHVzZWQgaW50ZXJuYWxseSBpbiB0aGUgYFJlYWN0aXZlRm9ybXNNb2R1bGVgIGFuZCB0aGUgYEZvcm1zTW9kdWxlYC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgb2Ygc3luY2hyb25vdXMgdmFsaWRhdG9ycyBhcyB0aGV5IHdlcmUgcHJvdmlkZWQgd2hpbGUgY2FsbGluZyBgc2V0VmFsaWRhdG9yc2AgZnVuY3Rpb24uXG4gICAgICAgICAqIEBpbnRlcm5hbFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IG9mIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZCB3aGlsZSBjYWxsaW5nIGBzZXRBc3luY1ZhbGlkYXRvcnNgXG4gICAgICAgICAqIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IFtdO1xuICAgICAgICAvKlxuICAgICAgICAgKiBUaGUgc2V0IG9mIGNhbGxiYWNrcyB0byBiZSBpbnZva2VkIHdoZW4gZGlyZWN0aXZlIGluc3RhbmNlIGlzIGJlaW5nIGRlc3Ryb3llZC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uRGVzdHJveUNhbGxiYWNrcyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbCBpZiBpdCBpcyBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wudmFsdWUgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgdmFsaWQuIEEgY29udHJvbCBpcyBjb25zaWRlcmVkIHZhbGlkIGlmIG5vXG4gICAgICogdmFsaWRhdGlvbiBlcnJvcnMgZXhpc3Qgd2l0aCB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICAgKiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBnZXQgdmFsaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wudmFsaWQgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gICAgICogSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IGludmFsaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuaW52YWxpZCA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlcG9ydHMgd2hldGhlciBhIGNvbnRyb2wgaXMgcGVuZGluZywgbWVhbmluZyB0aGF0IGFzeW5jIHZhbGlkYXRpb24gaXMgb2NjdXJyaW5nIGFuZFxuICAgICAqIGVycm9ycyBhcmUgbm90IHlldCBhdmFpbGFibGUgZm9yIHRoZSBpbnB1dCB2YWx1ZS4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXNcbiAgICAgKiByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBnZXQgcGVuZGluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5wZW5kaW5nIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLCBtZWFuaW5nIHRoYXQgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWRcbiAgICAgKiBpbiB0aGUgVUkgYW5kIGlzIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZCBleGNsdWRlZCBmcm9tIGFnZ3JlZ2F0ZVxuICAgICAqIHZhbHVlcyBvZiBhbmNlc3RvciBjb250cm9scy4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmRpc2FibGVkIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIGVuYWJsZWQsIG1lYW5pbmcgdGhhdCB0aGUgY29udHJvbCBpcyBpbmNsdWRlZCBpbiBhbmNlc3RvclxuICAgICAqIGNhbGN1bGF0aW9ucyBvZiB2YWxpZGl0eSBvciB2YWx1ZS4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IGVuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZW5hYmxlZCA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlcG9ydHMgdGhlIGNvbnRyb2wncyB2YWxpZGF0aW9uIGVycm9ycy4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IGVycm9ycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5lcnJvcnMgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgcHJpc3RpbmUsIG1lYW5pbmcgdGhhdCB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkXG4gICAgICogdGhlIHZhbHVlIGluIHRoZSBVSS4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IHByaXN0aW5lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnByaXN0aW5lIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIGRpcnR5LCBtZWFuaW5nIHRoYXQgdGhlIHVzZXIgaGFzIGNoYW5nZWRcbiAgICAgKiB0aGUgdmFsdWUgaW4gdGhlIFVJLiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBnZXQgZGlydHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZGlydHkgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgdG91Y2hlZCwgbWVhbmluZyB0aGF0IHRoZSB1c2VyIGhhcyB0cmlnZ2VyZWRcbiAgICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IHRvdWNoZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wudG91Y2hlZCA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlcG9ydHMgdGhlIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLiBQb3NzaWJsZSB2YWx1ZXMgaW5jbHVkZTpcbiAgICAgKiAnVkFMSUQnLCAnSU5WQUxJRCcsICdESVNBQkxFRCcsIGFuZCAnUEVORElORycuXG4gICAgICogSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IHN0YXR1cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5zdGF0dXMgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgdW50b3VjaGVkLCBtZWFuaW5nIHRoYXQgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgdHJpZ2dlcmVkXG4gICAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCB1bnRvdWNoZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wudW50b3VjaGVkIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSB2YWxpZGF0aW9uIHN0YXR1cyB3aGVuZXZlciBpdCBpc1xuICAgICAqIGNhbGN1bGF0ZWQgZm9yIHRoZSBjb250cm9sLiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBnZXQgc3RhdHVzQ2hhbmdlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5zdGF0dXNDaGFuZ2VzIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIG9mIHZhbHVlIGNoYW5nZXMgZm9yIHRoZSBjb250cm9sIHRoYXQgZW1pdHMgZXZlcnkgdGltZSB0aGVcbiAgICAgKiB2YWx1ZSBvZiB0aGUgY29udHJvbCBjaGFuZ2VzIGluIHRoZSBVSSBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCB2YWx1ZUNoYW5nZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wudmFsdWVDaGFuZ2VzIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgICAqIEVhY2ggaW5kZXggaXMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBjb250cm9sIG9uIHRoYXQgbGV2ZWwuXG4gICAgICovXG4gICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgZm9yIHRoaXMgZGlyZWN0aXZlLlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIF9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpIHtcbiAgICAgICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMgfHwgW107XG4gICAgICAgIHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gPSBjb21wb3NlVmFsaWRhdG9ycyh0aGlzLl9yYXdWYWxpZGF0b3JzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBmb3IgdGhpcyBkaXJlY3RpdmUuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgX3NldEFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSB7XG4gICAgICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMgfHwgW107XG4gICAgICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvbXBvc2VBc3luY1ZhbGlkYXRvcnModGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogU3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGNvbXBvc2VkIG9mIGFsbCB0aGUgc3luY2hyb25vdXMgdmFsaWRhdG9ycyByZWdpc3RlcmVkIHdpdGggdGhpc1xuICAgICAqIGRpcmVjdGl2ZS5cbiAgICAgKi9cbiAgICBnZXQgdmFsaWRhdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiB8fCBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGNvbXBvc2VkIG9mIGFsbCB0aGUgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgcmVnaXN0ZXJlZCB3aXRoXG4gICAgICogdGhpcyBkaXJlY3RpdmUuXG4gICAgICovXG4gICAgZ2V0IGFzeW5jVmFsaWRhdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuIHx8IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludGVybmFsIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyIGNhbGxiYWNrcyB0aGF0IHNob3VsZCBiZSBpbnZva2VkXG4gICAgICogd2hlbiBkaXJlY3RpdmUgaW5zdGFuY2UgaXMgYmVpbmcgZGVzdHJveWVkLlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIF9yZWdpc3Rlck9uRGVzdHJveShmbikge1xuICAgICAgICB0aGlzLl9vbkRlc3Ryb3lDYWxsYmFja3MucHVzaChmbik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludGVybmFsIGZ1bmN0aW9uIHRvIGludm9rZSBhbGwgcmVnaXN0ZXJlZCBcIm9uIGRlc3Ryb3lcIiBjYWxsYmFja3MuXG4gICAgICogTm90ZTogY2FsbGluZyB0aGlzIGZ1bmN0aW9uIGFsc28gY2xlYXJzIHRoZSBsaXN0IG9mIGNhbGxiYWNrcy5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBfaW52b2tlT25EZXN0cm95Q2FsbGJhY2tzKCkge1xuICAgICAgICB0aGlzLl9vbkRlc3Ryb3lDYWxsYmFja3MuZm9yRWFjaChmbiA9PiBmbigpKTtcbiAgICAgICAgdGhpcy5fb25EZXN0cm95Q2FsbGJhY2tzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlc2V0cyB0aGUgY29udHJvbCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZSBpZiB0aGUgY29udHJvbCBpcyBwcmVzZW50LlxuICAgICAqL1xuICAgIHJlc2V0KHZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2wpXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wucmVzZXQodmFsdWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aCBoYXMgdGhlIGVycm9yIHNwZWNpZmllZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgICAqIHRvIHRoZSBjb250cm9sIHRoYXQgc2hvdWxkIGJlIHF1ZXJpZWQgZm9yIGVycm9ycy5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogRm9yIGV4YW1wbGUsIGZvciB0aGUgZm9sbG93aW5nIGBGb3JtR3JvdXBgOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICAgKiB9KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAgICpcbiAgICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgICAqXG4gICAgICogMS4gQW4gYXJyYXkgb2Ygc3RyaW5nIGNvbnRyb2wgbmFtZXMsIGUuZy4gYFsnYWRkcmVzcycsICdzdHJlZXQnXWBcbiAgICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAgICpcbiAgICAgKiBJZiBubyBwYXRoIGlzIGdpdmVuLCB0aGlzIG1ldGhvZCBjaGVja3MgZm9yIHRoZSBlcnJvciBvbiB0aGUgY3VycmVudCBjb250cm9sLlxuICAgICAqXG4gICAgICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZXJyb3IgaXMgcHJlc2VudCBpbiB0aGUgY29udHJvbCBhdCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICAgKlxuICAgICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBmYWxzZSBpcyByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBoYXNFcnJvcihlcnJvckNvZGUsIHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5oYXNFcnJvcihlcnJvckNvZGUsIHBhdGgpIDogZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlcG9ydHMgZXJyb3IgZGF0YSBmb3IgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgICAqIHRvIHRoZSBjb250cm9sIHRoYXQgc2hvdWxkIGJlIHF1ZXJpZWQgZm9yIGVycm9ycy5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogRm9yIGV4YW1wbGUsIGZvciB0aGUgZm9sbG93aW5nIGBGb3JtR3JvdXBgOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICAgKiB9KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAgICpcbiAgICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgICAqXG4gICAgICogMS4gQW4gYXJyYXkgb2Ygc3RyaW5nIGNvbnRyb2wgbmFtZXMsIGUuZy4gYFsnYWRkcmVzcycsICdzdHJlZXQnXWBcbiAgICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBlcnJvciBkYXRhIGZvciB0aGF0IHBhcnRpY3VsYXIgZXJyb3IuIElmIHRoZSBjb250cm9sIG9yIGVycm9yIGlzIG5vdCBwcmVzZW50LFxuICAgICAqIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0RXJyb3IoZXJyb3JDb2RlLCBwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZ2V0RXJyb3IoZXJyb3JDb2RlLCBwYXRoKSA6IG51bGw7XG4gICAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBiYXNlIGNsYXNzIGZvciBkaXJlY3RpdmVzIHRoYXQgY29udGFpbiBtdWx0aXBsZSByZWdpc3RlcmVkIGluc3RhbmNlcyBvZiBgTmdDb250cm9sYC5cbiAqIE9ubHkgdXNlZCBieSB0aGUgZm9ybXMgbW9kdWxlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgQ29udHJvbENvbnRhaW5lciBleHRlbmRzIEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB7XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhlIHRvcC1sZXZlbCBmb3JtIGRpcmVjdGl2ZSBmb3IgdGhlIGNvbnRyb2wuXG4gICAgICovXG4gICAgZ2V0IGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgcGF0aCB0byB0aGlzIGdyb3VwLlxuICAgICAqL1xuICAgIGdldCBwYXRoKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGJhc2UgY2xhc3MgdGhhdCBhbGwgYEZvcm1Db250cm9sYC1iYXNlZCBkaXJlY3RpdmVzIGV4dGVuZC4gSXQgYmluZHMgYSBgRm9ybUNvbnRyb2xgXG4gKiBvYmplY3QgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIE5nQ29udHJvbCBleHRlbmRzIEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogVGhlIHBhcmVudCBmb3JtIGZvciB0aGUgY29udHJvbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGludGVybmFsXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRoZSBuYW1lIGZvciB0aGUgY29udHJvbFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBUaGUgdmFsdWUgYWNjZXNzb3IgZm9yIHRoZSBjb250cm9sXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBudWxsO1xuICAgIH1cbn1cblxuLy8gRE8gTk9UIFJFRkFDVE9SIVxuLy8gRWFjaCBzdGF0dXMgaXMgcmVwcmVzZW50ZWQgYnkgYSBzZXBhcmF0ZSBmdW5jdGlvbiB0byBtYWtlIHN1cmUgdGhhdFxuLy8gYWR2YW5jZWQgQ2xvc3VyZSBDb21waWxlciBvcHRpbWl6YXRpb25zIHJlbGF0ZWQgdG8gcHJvcGVydHkgcmVuYW1pbmdcbi8vIGNhbiB3b3JrIGNvcnJlY3RseS5cbmNsYXNzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoY2QpIHtcbiAgICAgICAgdGhpcy5fY2QgPSBjZDtcbiAgICB9XG4gICAgZ2V0IGlzVG91Y2hlZCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnRvdWNoZWQ7XG4gICAgfVxuICAgIGdldCBpc1VudG91Y2hlZCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnVudG91Y2hlZDtcbiAgICB9XG4gICAgZ2V0IGlzUHJpc3RpbmUoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5wcmlzdGluZTtcbiAgICB9XG4gICAgZ2V0IGlzRGlydHkoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5kaXJ0eTtcbiAgICB9XG4gICAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy52YWxpZDtcbiAgICB9XG4gICAgZ2V0IGlzSW52YWxpZCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LmludmFsaWQ7XG4gICAgfVxuICAgIGdldCBpc1BlbmRpbmcoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5wZW5kaW5nO1xuICAgIH1cbiAgICBnZXQgaXNTdWJtaXR0ZWQoKSB7XG4gICAgICAgIC8vIFdlIGNoZWNrIGZvciB0aGUgYHN1Ym1pdHRlZGAgZmllbGQgZnJvbSBgTmdGb3JtYCBhbmQgYEZvcm1Hcm91cERpcmVjdGl2ZWAgY2xhc3NlcywgYnV0XG4gICAgICAgIC8vIHdlIGF2b2lkIGluc3RhbmNlb2YgY2hlY2tzIHRvIHByZXZlbnQgbm9uLXRyZWUtc2hha2FibGUgcmVmZXJlbmNlcyB0byB0aG9zZSB0eXBlcy5cbiAgICAgICAgcmV0dXJuICEhdGhpcy5fY2Q/LnN1Ym1pdHRlZDtcbiAgICB9XG59XG5jb25zdCBuZ0NvbnRyb2xTdGF0dXNIb3N0ID0ge1xuICAgICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdpc1VudG91Y2hlZCcsXG4gICAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdpc1RvdWNoZWQnLFxuICAgICdbY2xhc3MubmctcHJpc3RpbmVdJzogJ2lzUHJpc3RpbmUnLFxuICAgICdbY2xhc3MubmctZGlydHldJzogJ2lzRGlydHknLFxuICAgICdbY2xhc3MubmctdmFsaWRdJzogJ2lzVmFsaWQnLFxuICAgICdbY2xhc3MubmctaW52YWxpZF0nOiAnaXNJbnZhbGlkJyxcbiAgICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ2lzUGVuZGluZycsXG59O1xuY29uc3QgbmdHcm91cFN0YXR1c0hvc3QgPSB7XG4gICAgLi4ubmdDb250cm9sU3RhdHVzSG9zdCxcbiAgICAnW2NsYXNzLm5nLXN1Ym1pdHRlZF0nOiAnaXNTdWJtaXR0ZWQnLFxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBjb250cm9scyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENTUyBjbGFzc2VzIGFwcGxpZWRcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGNsYXNzZXMgYXJlIGFwcGxpZWQgYXMgdGhlIHByb3BlcnRpZXMgYmVjb21lIHRydWU6XG4gKlxuICogKiBuZy12YWxpZFxuICogKiBuZy1pbnZhbGlkXG4gKiAqIG5nLXBlbmRpbmdcbiAqICogbmctcHJpc3RpbmVcbiAqICogbmctZGlydHlcbiAqICogbmctdW50b3VjaGVkXG4gKiAqIG5nLXRvdWNoZWRcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIE5nQ29udHJvbFN0YXR1cyBleHRlbmRzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoY2QpIHtcbiAgICAgICAgc3VwZXIoY2QpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOZ0NvbnRyb2xTdGF0dXMsIGRlcHM6IFt7IHRva2VuOiBOZ0NvbnRyb2wsIHNlbGY6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTmdDb250cm9sU3RhdHVzLCBzZWxlY3RvcjogXCJbZm9ybUNvbnRyb2xOYW1lXSxbbmdNb2RlbF0sW2Zvcm1Db250cm9sXVwiLCBob3N0OiB7IHByb3BlcnRpZXM6IHsgXCJjbGFzcy5uZy11bnRvdWNoZWRcIjogXCJpc1VudG91Y2hlZFwiLCBcImNsYXNzLm5nLXRvdWNoZWRcIjogXCJpc1RvdWNoZWRcIiwgXCJjbGFzcy5uZy1wcmlzdGluZVwiOiBcImlzUHJpc3RpbmVcIiwgXCJjbGFzcy5uZy1kaXJ0eVwiOiBcImlzRGlydHlcIiwgXCJjbGFzcy5uZy12YWxpZFwiOiBcImlzVmFsaWRcIiwgXCJjbGFzcy5uZy1pbnZhbGlkXCI6IFwiaXNJbnZhbGlkXCIsIFwiY2xhc3MubmctcGVuZGluZ1wiOiBcImlzUGVuZGluZ1wiIH0gfSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTmdDb250cm9sU3RhdHVzLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3sgc2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xOYW1lXSxbbmdNb2RlbF0sW2Zvcm1Db250cm9sXScsIGhvc3Q6IG5nQ29udHJvbFN0YXR1c0hvc3QgfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiBOZ0NvbnRyb2wsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9XSB9XSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBncm91cHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cyAodmFsaWQvaW52YWxpZC9kaXJ0eS9ldGMpLiBPbiBncm91cHMsIHRoaXMgaW5jbHVkZXMgdGhlIGFkZGl0aW9uYWxcbiAqIGNsYXNzIG5nLXN1Ym1pdHRlZC5cbiAqXG4gKiBAc2VlIHtAbGluayBOZ0NvbnRyb2xTdGF0dXN9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBOZ0NvbnRyb2xTdGF0dXNHcm91cCBleHRlbmRzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoY2QpIHtcbiAgICAgICAgc3VwZXIoY2QpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOZ0NvbnRyb2xTdGF0dXNHcm91cCwgZGVwczogW3sgdG9rZW46IENvbnRyb2xDb250YWluZXIsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IE5nQ29udHJvbFN0YXR1c0dyb3VwLCBzZWxlY3RvcjogXCJbZm9ybUdyb3VwTmFtZV0sW2Zvcm1BcnJheU5hbWVdLFtuZ01vZGVsR3JvdXBdLFtmb3JtR3JvdXBdLGZvcm06bm90KFtuZ05vRm9ybV0pLFtuZ0Zvcm1dXCIsIGhvc3Q6IHsgcHJvcGVydGllczogeyBcImNsYXNzLm5nLXVudG91Y2hlZFwiOiBcImlzVW50b3VjaGVkXCIsIFwiY2xhc3MubmctdG91Y2hlZFwiOiBcImlzVG91Y2hlZFwiLCBcImNsYXNzLm5nLXByaXN0aW5lXCI6IFwiaXNQcmlzdGluZVwiLCBcImNsYXNzLm5nLWRpcnR5XCI6IFwiaXNEaXJ0eVwiLCBcImNsYXNzLm5nLXZhbGlkXCI6IFwiaXNWYWxpZFwiLCBcImNsYXNzLm5nLWludmFsaWRcIjogXCJpc0ludmFsaWRcIiwgXCJjbGFzcy5uZy1wZW5kaW5nXCI6IFwiaXNQZW5kaW5nXCIsIFwiY2xhc3Mubmctc3VibWl0dGVkXCI6IFwiaXNTdWJtaXR0ZWRcIiB9IH0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nQ29udHJvbFN0YXR1c0dyb3VwLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdbZm9ybUdyb3VwTmFtZV0sW2Zvcm1BcnJheU5hbWVdLFtuZ01vZGVsR3JvdXBdLFtmb3JtR3JvdXBdLGZvcm06bm90KFtuZ05vRm9ybV0pLFtuZ0Zvcm1dJyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogbmdHcm91cFN0YXR1c0hvc3RcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgY3RvclBhcmFtZXRlcnM6ICgpID0+IFt7IHR5cGU6IENvbnRyb2xDb250YWluZXIsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfV0gfV0gfSk7XG5cbmNvbnN0IGZvcm1Db250cm9sTmFtZUV4YW1wbGUgPSBgXG4gIDxkaXYgW2Zvcm1Hcm91cF09XCJteUdyb3VwXCI+XG4gICAgPGlucHV0IGZvcm1Db250cm9sTmFtZT1cImZpcnN0TmFtZVwiPlxuICA8L2Rpdj5cblxuICBJbiB5b3VyIGNsYXNzOlxuXG4gIHRoaXMubXlHcm91cCA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAgZmlyc3ROYW1lOiBuZXcgRm9ybUNvbnRyb2woKVxuICB9KTtgO1xuY29uc3QgZm9ybUdyb3VwTmFtZUV4YW1wbGUgPSBgXG4gIDxkaXYgW2Zvcm1Hcm91cF09XCJteUdyb3VwXCI+XG4gICAgICA8ZGl2IGZvcm1Hcm91cE5hbWU9XCJwZXJzb25cIj5cbiAgICAgICAgPGlucHV0IGZvcm1Db250cm9sTmFtZT1cImZpcnN0TmFtZVwiPlxuICAgICAgPC9kaXY+XG4gIDwvZGl2PlxuXG4gIEluIHlvdXIgY2xhc3M6XG5cbiAgdGhpcy5teUdyb3VwID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgICBwZXJzb246IG5ldyBGb3JtR3JvdXAoeyBmaXJzdE5hbWU6IG5ldyBGb3JtQ29udHJvbCgpIH0pXG4gIH0pO2A7XG5jb25zdCBmb3JtQXJyYXlOYW1lRXhhbXBsZSA9IGBcbiAgPGRpdiBbZm9ybUdyb3VwXT1cIm15R3JvdXBcIj5cbiAgICA8ZGl2IGZvcm1BcnJheU5hbWU9XCJjaXRpZXNcIj5cbiAgICAgIDxkaXYgKm5nRm9yPVwibGV0IGNpdHkgb2YgY2l0eUFycmF5LmNvbnRyb2xzOyBpbmRleCBhcyBpXCI+XG4gICAgICAgIDxpbnB1dCBbZm9ybUNvbnRyb2xOYW1lXT1cImlcIj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuICBJbiB5b3VyIGNsYXNzOlxuXG4gIHRoaXMuY2l0eUFycmF5ID0gbmV3IEZvcm1BcnJheShbbmV3IEZvcm1Db250cm9sKCdTRicpXSk7XG4gIHRoaXMubXlHcm91cCA9IG5ldyBGb3JtR3JvdXAoe1xuICAgIGNpdGllczogdGhpcy5jaXR5QXJyYXlcbiAgfSk7YDtcbmNvbnN0IG5nTW9kZWxHcm91cEV4YW1wbGUgPSBgXG4gIDxmb3JtPlxuICAgICAgPGRpdiBuZ01vZGVsR3JvdXA9XCJwZXJzb25cIj5cbiAgICAgICAgPGlucHV0IFsobmdNb2RlbCldPVwicGVyc29uLm5hbWVcIiBuYW1lPVwiZmlyc3ROYW1lXCI+XG4gICAgICA8L2Rpdj5cbiAgPC9mb3JtPmA7XG5jb25zdCBuZ01vZGVsV2l0aEZvcm1Hcm91cEV4YW1wbGUgPSBgXG4gIDxkaXYgW2Zvcm1Hcm91cF09XCJteUdyb3VwXCI+XG4gICAgICA8aW5wdXQgZm9ybUNvbnRyb2xOYW1lPVwiZmlyc3ROYW1lXCI+XG4gICAgICA8aW5wdXQgWyhuZ01vZGVsKV09XCJzaG93TW9yZUNvbnRyb2xzXCIgW25nTW9kZWxPcHRpb25zXT1cIntzdGFuZGFsb25lOiB0cnVlfVwiPlxuICA8L2Rpdj5cbmA7XG5cbmZ1bmN0aW9uIGNvbnRyb2xQYXJlbnRFeGNlcHRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyDJtVJ1bnRpbWVFcnJvcigxMDUwIC8qIFJ1bnRpbWVFcnJvckNvZGUuRk9STV9DT05UUk9MX05BTUVfTUlTU0lOR19QQVJFTlQgKi8sIGBmb3JtQ29udHJvbE5hbWUgbXVzdCBiZSB1c2VkIHdpdGggYSBwYXJlbnQgZm9ybUdyb3VwIGRpcmVjdGl2ZS4gIFlvdSdsbCB3YW50IHRvIGFkZCBhIGZvcm1Hcm91cFxuICAgICAgZGlyZWN0aXZlIGFuZCBwYXNzIGl0IGFuIGV4aXN0aW5nIEZvcm1Hcm91cCBpbnN0YW5jZSAoeW91IGNhbiBjcmVhdGUgb25lIGluIHlvdXIgY2xhc3MpLlxuXG4gICAgRXhhbXBsZTpcblxuICAgICR7Zm9ybUNvbnRyb2xOYW1lRXhhbXBsZX1gKTtcbn1cbmZ1bmN0aW9uIG5nTW9kZWxHcm91cEV4Y2VwdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IMm1UnVudGltZUVycm9yKDEwNTEgLyogUnVudGltZUVycm9yQ29kZS5GT1JNX0NPTlRST0xfTkFNRV9JTlNJREVfTU9ERUxfR1JPVVAgKi8sIGBmb3JtQ29udHJvbE5hbWUgY2Fubm90IGJlIHVzZWQgd2l0aCBhbiBuZ01vZGVsR3JvdXAgcGFyZW50LiBJdCBpcyBvbmx5IGNvbXBhdGlibGUgd2l0aCBwYXJlbnRzXG4gICAgICB0aGF0IGFsc28gaGF2ZSBhIFwiZm9ybVwiIHByZWZpeDogZm9ybUdyb3VwTmFtZSwgZm9ybUFycmF5TmFtZSwgb3IgZm9ybUdyb3VwLlxuXG4gICAgICBPcHRpb24gMTogIFVwZGF0ZSB0aGUgcGFyZW50IHRvIGJlIGZvcm1Hcm91cE5hbWUgKHJlYWN0aXZlIGZvcm0gc3RyYXRlZ3kpXG5cbiAgICAgICR7Zm9ybUdyb3VwTmFtZUV4YW1wbGV9XG5cbiAgICAgIE9wdGlvbiAyOiBVc2UgbmdNb2RlbCBpbnN0ZWFkIG9mIGZvcm1Db250cm9sTmFtZSAodGVtcGxhdGUtZHJpdmVuIHN0cmF0ZWd5KVxuXG4gICAgICAke25nTW9kZWxHcm91cEV4YW1wbGV9YCk7XG59XG5mdW5jdGlvbiBtaXNzaW5nRm9ybUV4Y2VwdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IMm1UnVudGltZUVycm9yKDEwNTIgLyogUnVudGltZUVycm9yQ29kZS5GT1JNX0dST1VQX01JU1NJTkdfSU5TVEFOQ0UgKi8sIGBmb3JtR3JvdXAgZXhwZWN0cyBhIEZvcm1Hcm91cCBpbnN0YW5jZS4gUGxlYXNlIHBhc3Mgb25lIGluLlxuXG4gICAgICBFeGFtcGxlOlxuXG4gICAgICAke2Zvcm1Db250cm9sTmFtZUV4YW1wbGV9YCk7XG59XG5mdW5jdGlvbiBncm91cFBhcmVudEV4Y2VwdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IMm1UnVudGltZUVycm9yKDEwNTMgLyogUnVudGltZUVycm9yQ29kZS5GT1JNX0dST1VQX05BTUVfTUlTU0lOR19QQVJFTlQgKi8sIGBmb3JtR3JvdXBOYW1lIG11c3QgYmUgdXNlZCB3aXRoIGEgcGFyZW50IGZvcm1Hcm91cCBkaXJlY3RpdmUuICBZb3UnbGwgd2FudCB0byBhZGQgYSBmb3JtR3JvdXBcbiAgICBkaXJlY3RpdmUgYW5kIHBhc3MgaXQgYW4gZXhpc3RpbmcgRm9ybUdyb3VwIGluc3RhbmNlICh5b3UgY2FuIGNyZWF0ZSBvbmUgaW4geW91ciBjbGFzcykuXG5cbiAgICBFeGFtcGxlOlxuXG4gICAgJHtmb3JtR3JvdXBOYW1lRXhhbXBsZX1gKTtcbn1cbmZ1bmN0aW9uIGFycmF5UGFyZW50RXhjZXB0aW9uKCkge1xuICAgIHJldHVybiBuZXcgybVSdW50aW1lRXJyb3IoMTA1NCAvKiBSdW50aW1lRXJyb3JDb2RlLkZPUk1fQVJSQVlfTkFNRV9NSVNTSU5HX1BBUkVOVCAqLywgYGZvcm1BcnJheU5hbWUgbXVzdCBiZSB1c2VkIHdpdGggYSBwYXJlbnQgZm9ybUdyb3VwIGRpcmVjdGl2ZS4gIFlvdSdsbCB3YW50IHRvIGFkZCBhIGZvcm1Hcm91cFxuICAgICAgZGlyZWN0aXZlIGFuZCBwYXNzIGl0IGFuIGV4aXN0aW5nIEZvcm1Hcm91cCBpbnN0YW5jZSAoeW91IGNhbiBjcmVhdGUgb25lIGluIHlvdXIgY2xhc3MpLlxuXG4gICAgICBFeGFtcGxlOlxuXG4gICAgICAke2Zvcm1BcnJheU5hbWVFeGFtcGxlfWApO1xufVxuY29uc3QgZGlzYWJsZWRBdHRyV2FybmluZyA9IGBcbiAgSXQgbG9va3MgbGlrZSB5b3UncmUgdXNpbmcgdGhlIGRpc2FibGVkIGF0dHJpYnV0ZSB3aXRoIGEgcmVhY3RpdmUgZm9ybSBkaXJlY3RpdmUuIElmIHlvdSBzZXQgZGlzYWJsZWQgdG8gdHJ1ZVxuICB3aGVuIHlvdSBzZXQgdXAgdGhpcyBjb250cm9sIGluIHlvdXIgY29tcG9uZW50IGNsYXNzLCB0aGUgZGlzYWJsZWQgYXR0cmlidXRlIHdpbGwgYWN0dWFsbHkgYmUgc2V0IGluIHRoZSBET00gZm9yXG4gIHlvdS4gV2UgcmVjb21tZW5kIHVzaW5nIHRoaXMgYXBwcm9hY2ggdG8gYXZvaWQgJ2NoYW5nZWQgYWZ0ZXIgY2hlY2tlZCcgZXJyb3JzLlxuXG4gIEV4YW1wbGU6XG4gIC8vIFNwZWNpZnkgdGhlIFxcYGRpc2FibGVkXFxgIHByb3BlcnR5IGF0IGNvbnRyb2wgY3JlYXRpb24gdGltZTpcbiAgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woe3ZhbHVlOiAnTmFuY3knLCBkaXNhYmxlZDogdHJ1ZX0sIFZhbGlkYXRvcnMucmVxdWlyZWQpLFxuICAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnRHJldycsIFZhbGlkYXRvcnMucmVxdWlyZWQpXG4gIH0pO1xuXG4gIC8vIENvbnRyb2xzIGNhbiBhbHNvIGJlIGVuYWJsZWQvZGlzYWJsZWQgYWZ0ZXIgY3JlYXRpb246XG4gIGZvcm0uZ2V0KCdmaXJzdCcpPy5lbmFibGUoKTtcbiAgZm9ybS5nZXQoJ2xhc3QnKT8uZGlzYWJsZSgpO1xuYDtcbmNvbnN0IGFzeW5jVmFsaWRhdG9yc0Ryb3BwZWRXaXRoT3B0c1dhcm5pbmcgPSBgXG4gIEl0IGxvb2tzIGxpa2UgeW91J3JlIGNvbnN0cnVjdGluZyB1c2luZyBhIEZvcm1Db250cm9sIHdpdGggYm90aCBhbiBvcHRpb25zIGFyZ3VtZW50IGFuZCBhblxuICBhc3luYyB2YWxpZGF0b3JzIGFyZ3VtZW50LiBNaXhpbmcgdGhlc2UgYXJndW1lbnRzIHdpbGwgY2F1c2UgeW91ciBhc3luYyB2YWxpZGF0b3JzIHRvIGJlIGRyb3BwZWQuXG4gIFlvdSBzaG91bGQgZWl0aGVyIHB1dCBhbGwgeW91ciB2YWxpZGF0b3JzIGluIHRoZSBvcHRpb25zIG9iamVjdCwgb3IgaW4gc2VwYXJhdGUgdmFsaWRhdG9yc1xuICBhcmd1bWVudHMuIEZvciBleGFtcGxlOlxuXG4gIC8vIFVzaW5nIHZhbGlkYXRvcnMgYXJndW1lbnRzXG4gIGZjID0gbmV3IEZvcm1Db250cm9sKDQyLCBWYWxpZGF0b3JzLnJlcXVpcmVkLCBteUFzeW5jVmFsaWRhdG9yKTtcblxuICAvLyBVc2luZyBBYnN0cmFjdENvbnRyb2xPcHRpb25zXG4gIGZjID0gbmV3IEZvcm1Db250cm9sKDQyLCB7dmFsaWRhdG9yczogVmFsaWRhdG9ycy5yZXF1aXJlZCwgYXN5bmNWYWxpZGF0b3JzOiBteUFWfSk7XG5cbiAgLy8gRG8gTk9UIG1peCB0aGVtOiBhc3luYyB2YWxpZGF0b3JzIHdpbGwgYmUgZHJvcHBlZCFcbiAgZmMgPSBuZXcgRm9ybUNvbnRyb2woNDIsIHt2YWxpZGF0b3JzOiBWYWxpZGF0b3JzLnJlcXVpcmVkfSwgLyogT29wcyEgKi8gbXlBc3luY1ZhbGlkYXRvcik7XG5gO1xuZnVuY3Rpb24gbmdNb2RlbFdhcm5pbmcoZGlyZWN0aXZlTmFtZSkge1xuICAgIHJldHVybiBgXG4gIEl0IGxvb2tzIGxpa2UgeW91J3JlIHVzaW5nIG5nTW9kZWwgb24gdGhlIHNhbWUgZm9ybSBmaWVsZCBhcyAke2RpcmVjdGl2ZU5hbWV9LlxuICBTdXBwb3J0IGZvciB1c2luZyB0aGUgbmdNb2RlbCBpbnB1dCBwcm9wZXJ0eSBhbmQgbmdNb2RlbENoYW5nZSBldmVudCB3aXRoXG4gIHJlYWN0aXZlIGZvcm0gZGlyZWN0aXZlcyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIHdpbGwgYmUgcmVtb3ZlZFxuICBpbiBhIGZ1dHVyZSB2ZXJzaW9uIG9mIEFuZ3VsYXIuXG5cbiAgRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhpcywgc2VlIG91ciBBUEkgZG9jcyBoZXJlOlxuICBodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zLyR7ZGlyZWN0aXZlTmFtZSA9PT0gJ2Zvcm1Db250cm9sJyA/ICdGb3JtQ29udHJvbERpcmVjdGl2ZScgOiAnRm9ybUNvbnRyb2xOYW1lJ30jdXNlLXdpdGgtbmdtb2RlbFxuICBgO1xufVxuZnVuY3Rpb24gZGVzY3JpYmVLZXkoaXNGb3JtR3JvdXAsIGtleSkge1xuICAgIHJldHVybiBpc0Zvcm1Hcm91cCA/IGB3aXRoIG5hbWU6ICcke2tleX0nYCA6IGBhdCBpbmRleDogJHtrZXl9YDtcbn1cbmZ1bmN0aW9uIG5vQ29udHJvbHNFcnJvcihpc0Zvcm1Hcm91cCkge1xuICAgIHJldHVybiBgXG4gICAgVGhlcmUgYXJlIG5vIGZvcm0gY29udHJvbHMgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgJHtpc0Zvcm1Hcm91cCA/ICdncm91cCcgOiAnYXJyYXknfSB5ZXQuIElmIHlvdSdyZSB1c2luZyBuZ01vZGVsLFxuICAgIHlvdSBtYXkgd2FudCB0byBjaGVjayBuZXh0IHRpY2sgKGUuZy4gdXNlIHNldFRpbWVvdXQpLlxuICBgO1xufVxuZnVuY3Rpb24gbWlzc2luZ0NvbnRyb2xFcnJvcihpc0Zvcm1Hcm91cCwga2V5KSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgZmluZCBmb3JtIGNvbnRyb2wgJHtkZXNjcmliZUtleShpc0Zvcm1Hcm91cCwga2V5KX1gO1xufVxuZnVuY3Rpb24gbWlzc2luZ0NvbnRyb2xWYWx1ZUVycm9yKGlzRm9ybUdyb3VwLCBrZXkpIHtcbiAgICByZXR1cm4gYE11c3Qgc3VwcGx5IGEgdmFsdWUgZm9yIGZvcm0gY29udHJvbCAke2Rlc2NyaWJlS2V5KGlzRm9ybUdyb3VwLCBrZXkpfWA7XG59XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpcyB2YWxpZCwgbWVhbmluZyB0aGF0IG5vIGVycm9ycyBleGlzdCBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSB7QGxpbmsgc3RhdHVzfVxuICovXG5jb25zdCBWQUxJRCA9ICdWQUxJRCc7XG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSB7QGxpbmsgc3RhdHVzfVxuICovXG5jb25zdCBJTlZBTElEID0gJ0lOVkFMSUQnO1xuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIHBlbmRpbmcsIG1lYW5pbmcgdGhhdCBhc3luYyB2YWxpZGF0aW9uIGlzIG9jY3VycmluZyBhbmRcbiAqIGVycm9ycyBhcmUgbm90IHlldCBhdmFpbGFibGUgZm9yIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIHtAbGluayBtYXJrQXNQZW5kaW5nfVxuICogQHNlZSB7QGxpbmsgc3RhdHVzfVxuICovXG5jb25zdCBQRU5ESU5HID0gJ1BFTkRJTkcnO1xuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIGRpc2FibGVkLCBtZWFuaW5nIHRoYXQgdGhlIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gYW5jZXN0b3JcbiAqIGNhbGN1bGF0aW9ucyBvZiB2YWxpZGl0eSBvciB2YWx1ZS5cbiAqXG4gKiBAc2VlIHtAbGluayBtYXJrQXNEaXNhYmxlZH1cbiAqIEBzZWUge0BsaW5rIHN0YXR1c31cbiAqL1xuY29uc3QgRElTQUJMRUQgPSAnRElTQUJMRUQnO1xuLyoqXG4gKiBHZXRzIHZhbGlkYXRvcnMgZnJvbSBlaXRoZXIgYW4gb3B0aW9ucyBvYmplY3Qgb3IgZ2l2ZW4gdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gcGlja1ZhbGlkYXRvcnModmFsaWRhdG9yT3JPcHRzKSB7XG4gICAgcmV0dXJuIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSA/IHZhbGlkYXRvck9yT3B0cy52YWxpZGF0b3JzIDogdmFsaWRhdG9yT3JPcHRzKSB8fCBudWxsO1xufVxuLyoqXG4gKiBDcmVhdGVzIHZhbGlkYXRvciBmdW5jdGlvbiBieSBjb21iaW5pbmcgcHJvdmlkZWQgdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gY29lcmNlVG9WYWxpZGF0b3IodmFsaWRhdG9yKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsaWRhdG9yKSA/IGNvbXBvc2VWYWxpZGF0b3JzKHZhbGlkYXRvcikgOiB2YWxpZGF0b3IgfHwgbnVsbDtcbn1cbi8qKlxuICogR2V0cyBhc3luYyB2YWxpZGF0b3JzIGZyb20gZWl0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IG9yIGdpdmVuIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIHBpY2tBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgaWYgKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpICYmIGFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYXN5bmNWYWxpZGF0b3JzRHJvcHBlZFdpdGhPcHRzV2FybmluZyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSA/IHZhbGlkYXRvck9yT3B0cy5hc3luY1ZhbGlkYXRvcnMgOiBhc3luY1ZhbGlkYXRvcikgfHwgbnVsbDtcbn1cbi8qKlxuICogQ3JlYXRlcyBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb24gYnkgY29tYmluaW5nIHByb3ZpZGVkIGFzeW5jIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3IpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhc3luY1ZhbGlkYXRvcikgPyBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yKSA6XG4gICAgICAgIGFzeW5jVmFsaWRhdG9yIHx8IG51bGw7XG59XG5mdW5jdGlvbiBpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSB7XG4gICAgcmV0dXJuIHZhbGlkYXRvck9yT3B0cyAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHZhbGlkYXRvck9yT3B0cykgJiZcbiAgICAgICAgdHlwZW9mIHZhbGlkYXRvck9yT3B0cyA9PT0gJ29iamVjdCc7XG59XG5mdW5jdGlvbiBhc3NlcnRDb250cm9sUHJlc2VudChwYXJlbnQsIGlzR3JvdXAsIGtleSkge1xuICAgIGNvbnN0IGNvbnRyb2xzID0gcGFyZW50LmNvbnRyb2xzO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBpc0dyb3VwID8gT2JqZWN0LmtleXMoY29udHJvbHMpIDogY29udHJvbHM7XG4gICAgaWYgKCFjb2xsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgybVSdW50aW1lRXJyb3IoMTAwMCAvKiBSdW50aW1lRXJyb3JDb2RlLk5PX0NPTlRST0xTICovLCAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSA/IG5vQ29udHJvbHNFcnJvcihpc0dyb3VwKSA6ICcnKTtcbiAgICB9XG4gICAgaWYgKCFjb250cm9sc1trZXldKSB7XG4gICAgICAgIHRocm93IG5ldyDJtVJ1bnRpbWVFcnJvcigxMDAxIC8qIFJ1bnRpbWVFcnJvckNvZGUuTUlTU0lOR19DT05UUk9MICovLCAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSA/IG1pc3NpbmdDb250cm9sRXJyb3IoaXNHcm91cCwga2V5KSA6ICcnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBhc3NlcnRBbGxWYWx1ZXNQcmVzZW50KGNvbnRyb2wsIGlzR3JvdXAsIHZhbHVlKSB7XG4gICAgY29udHJvbC5fZm9yRWFjaENoaWxkKChfLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IMm1UnVudGltZUVycm9yKDEwMDIgLyogUnVudGltZUVycm9yQ29kZS5NSVNTSU5HX0NPTlRST0xfVkFMVUUgKi8sICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpID8gbWlzc2luZ0NvbnRyb2xWYWx1ZUVycm9yKGlzR3JvdXAsIGtleSkgOlxuICAgICAgICAgICAgICAgICcnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8gY2xhbmctZm9ybWF0IG9uXG4vKipcbiAqIFRoaXMgaXMgdGhlIGJhc2UgY2xhc3MgZm9yIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBhbmQgYEZvcm1BcnJheWAuXG4gKlxuICogSXQgcHJvdmlkZXMgc29tZSBvZiB0aGUgc2hhcmVkIGJlaGF2aW9yIHRoYXQgYWxsIGNvbnRyb2xzIGFuZCBncm91cHMgb2YgY29udHJvbHMgaGF2ZSwgbGlrZVxuICogcnVubmluZyB2YWxpZGF0b3JzLCBjYWxjdWxhdGluZyBzdGF0dXMsIGFuZCByZXNldHRpbmcgc3RhdGUuIEl0IGFsc28gZGVmaW5lcyB0aGUgcHJvcGVydGllc1xuICogdGhhdCBhcmUgc2hhcmVkIGJldHdlZW4gYWxsIHN1Yi1jbGFzc2VzLCBsaWtlIGB2YWx1ZWAsIGB2YWxpZGAsIGFuZCBgZGlydHlgLiBJdCBzaG91bGRuJ3QgYmVcbiAqIGluc3RhbnRpYXRlZCBkaXJlY3RseS5cbiAqXG4gKiBUaGUgZmlyc3QgdHlwZSBwYXJhbWV0ZXIgVFZhbHVlIHJlcHJlc2VudHMgdGhlIHZhbHVlIHR5cGUgb2YgdGhlIGNvbnRyb2wgKGBjb250cm9sLnZhbHVlYCkuXG4gKiBUaGUgb3B0aW9uYWwgdHlwZSBwYXJhbWV0ZXIgVFJhd1ZhbHVlICByZXByZXNlbnRzIHRoZSByYXcgdmFsdWUgdHlwZSAoYGNvbnRyb2wuZ2V0UmF3VmFsdWUoKWApLlxuICpcbiAqIEBzZWUgW0Zvcm1zIEd1aWRlXSgvZ3VpZGUvZm9ybXMpXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oL2d1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBbRHluYW1pYyBGb3JtcyBHdWlkZV0oL2d1aWRlL2R5bmFtaWMtZm9ybSlcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIEFic3RyYWN0Q29udHJvbCB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgQWJzdHJhY3RDb250cm9sIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIGZ1bmN0aW9uIG9yIGFycmF5IG9mIGZ1bmN0aW9ucyB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWxpZGl0eSBvZlxuICAgICAqICAgICB0aGlzIGNvbnRyb2wgc3luY2hyb25vdXNseS5cbiAgICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB2YWxpZGl0eSBvZlxuICAgICAqICAgICB0aGlzIGNvbnRyb2wgYXN5bmNocm9ub3VzbHkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzKSB7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fcGVuZGluZ0RpcnR5ID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZXMgdGhhdCBhIGNvbnRyb2wgaGFzIGl0cyBvd24gcGVuZGluZyBhc3luY2hyb25vdXMgdmFsaWRhdGlvbiBpbiBwcm9ncmVzcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGludGVybmFsXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSBmYWxzZTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLl9wZW5kaW5nVG91Y2hlZCA9IGZhbHNlO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSA9ICgpID0+IHsgfTtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgY29udHJvbCBpcyBgcHJpc3RpbmVgIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWRcbiAgICAgICAgICogdGhlIHZhbHVlIGluIHRoZSBVSS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkIHRoZSB2YWx1ZSBpbiB0aGUgVUk7IGNvbXBhcmUgYGRpcnR5YC5cbiAgICAgICAgICogUHJvZ3JhbW1hdGljIGNoYW5nZXMgdG8gYSBjb250cm9sJ3MgdmFsdWUgZG8gbm90IG1hcmsgaXQgZGlydHkuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnByaXN0aW5lID0gdHJ1ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRydWUgaWYgdGhlIGNvbnRyb2wgaXMgbWFya2VkIGFzIGB0b3VjaGVkYC5cbiAgICAgICAgICpcbiAgICAgICAgICogQSBjb250cm9sIGlzIG1hcmtlZCBgdG91Y2hlZGAgb25jZSB0aGUgdXNlciBoYXMgdHJpZ2dlcmVkXG4gICAgICAgICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50b3VjaGVkID0gZmFsc2U7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZSA9IFtdO1xuICAgICAgICB0aGlzLl9hc3NpZ25WYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgICAgICB0aGlzLl9hc3NpZ25Bc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2YgdGhpcyBjb250cm9sIHN5bmNocm9ub3VzbHkuXG4gICAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICAgKiBTZWUgYFZhbGlkYXRvcnMuY29tcG9zZSgpYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBnZXQgdmFsaWRhdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbjtcbiAgICB9XG4gICAgc2V0IHZhbGlkYXRvcih2YWxpZGF0b3JGbikge1xuICAgICAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IHZhbGlkYXRvckZuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWxpZGl0eSBvZiB0aGlzIGNvbnRyb2wgYXN5bmNocm9ub3VzbHkuXG4gICAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICAgKiBTZWUgYFZhbGlkYXRvcnMuY29tcG9zZSgpYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBnZXQgYXN5bmNWYWxpZGF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm47XG4gICAgfVxuICAgIHNldCBhc3luY1ZhbGlkYXRvcihhc3luY1ZhbGlkYXRvckZuKSB7XG4gICAgICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGFzeW5jVmFsaWRhdG9yRm47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBwYXJlbnQgY29udHJvbC5cbiAgICAgKi9cbiAgICBnZXQgcGFyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIGNvbnRyb2wgaXMgYHZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgVkFMSURgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIHBhc3NlZCBhbGwgb2YgaXRzIHZhbGlkYXRpb24gdGVzdHMsXG4gICAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGdldCB2YWxpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBWQUxJRDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBjb250cm9sIGlzIGBpbnZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgSU5WQUxJRGAuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgICAqXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIGNvbnRyb2wgaGFzIGZhaWxlZCBvbmUgb3IgbW9yZSBvZiBpdHMgdmFsaWRhdGlvbiBjaGVja3MsXG4gICAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGdldCBpbnZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IElOVkFMSUQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgY29udHJvbCBpcyBgcGVuZGluZ2Agd2hlbiBpdHMgYHN0YXR1c2AgaXMgYFBFTkRJTkdgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGlzIGluIHRoZSBwcm9jZXNzIG9mIGNvbmR1Y3RpbmcgYSB2YWxpZGF0aW9uIGNoZWNrLFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBnZXQgcGVuZGluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHVzID09IFBFTkRJTkc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgY29udHJvbCBpcyBgZGlzYWJsZWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBESVNBQkxFRGAuXG4gICAgICpcbiAgICAgKiBEaXNhYmxlZCBjb250cm9scyBhcmUgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAgICogYXJlIG5vdCBpbmNsdWRlZCBpbiB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZWlyIGFuY2VzdG9yXG4gICAgICogY29udHJvbHMuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgICAqXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBESVNBQkxFRDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBjb250cm9sIGlzIGBlbmFibGVkYCBhcyBsb25nIGFzIGl0cyBgc3RhdHVzYCBpcyBub3QgYERJU0FCTEVEYC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIGFueSBzdGF0dXMgb3RoZXIgdGhhbiAnRElTQUJMRUQnLFxuICAgICAqIGZhbHNlIGlmIHRoZSBzdGF0dXMgaXMgJ0RJU0FCTEVEJy5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgZW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHVzICE9PSBESVNBQkxFRDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBjb250cm9sIGlzIGBkaXJ0eWAgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlXG4gICAgICogaW4gdGhlIFVJLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgY2hhbmdlZCB0aGUgdmFsdWUgb2YgdGhpcyBjb250cm9sIGluIHRoZSBVSTsgY29tcGFyZSBgcHJpc3RpbmVgLlxuICAgICAqIFByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIGRvIG5vdCBtYXJrIGl0IGRpcnR5LlxuICAgICAqL1xuICAgIGdldCBkaXJ0eSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnByaXN0aW5lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBub3QgYmVlbiBtYXJrZWQgYXMgdG91Y2hlZFxuICAgICAqXG4gICAgICogQSBjb250cm9sIGlzIGB1bnRvdWNoZWRgIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IHRyaWdnZXJlZFxuICAgICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgICAqL1xuICAgIGdldCB1bnRvdWNoZWQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy50b3VjaGVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXBvcnRzIHRoZSB1cGRhdGUgc3RyYXRlZ3kgb2YgdGhlIGBBYnN0cmFjdENvbnRyb2xgIChtZWFuaW5nXG4gICAgICogdGhlIGV2ZW50IG9uIHdoaWNoIHRoZSBjb250cm9sIHVwZGF0ZXMgaXRzZWxmKS5cbiAgICAgKiBQb3NzaWJsZSB2YWx1ZXM6IGAnY2hhbmdlJ2AgfCBgJ2JsdXInYCB8IGAnc3VibWl0J2BcbiAgICAgKiBEZWZhdWx0IHZhbHVlOiBgJ2NoYW5nZSdgXG4gICAgICovXG4gICAgZ2V0IHVwZGF0ZU9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXBkYXRlT24gPyB0aGlzLl91cGRhdGVPbiA6ICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnVwZGF0ZU9uIDogJ2NoYW5nZScpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuICBDYWxsaW5nXG4gICAgICogdGhpcyBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzLlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAgICpcbiAgICAgKiBJZiB5b3Ugd2FudCB0byBhZGQgYSBuZXcgdmFsaWRhdG9yIHdpdGhvdXQgYWZmZWN0aW5nIGV4aXN0aW5nIG9uZXMsIGNvbnNpZGVyXG4gICAgICogdXNpbmcgYGFkZFZhbGlkYXRvcnMoKWAgbWV0aG9kIGluc3RlYWQuXG4gICAgICovXG4gICAgc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKSB7XG4gICAgICAgIHRoaXMuX2Fzc2lnblZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuIENhbGxpbmcgdGhpc1xuICAgICAqIG92ZXJ3cml0ZXMgYW55IGV4aXN0aW5nIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzLlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAgICpcbiAgICAgKiBJZiB5b3Ugd2FudCB0byBhZGQgYSBuZXcgdmFsaWRhdG9yIHdpdGhvdXQgYWZmZWN0aW5nIGV4aXN0aW5nIG9uZXMsIGNvbnNpZGVyXG4gICAgICogdXNpbmcgYGFkZEFzeW5jVmFsaWRhdG9ycygpYCBtZXRob2QgaW5zdGVhZC5cbiAgICAgKi9cbiAgICBzZXRBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgICAgICB0aGlzLl9hc3NpZ25Bc3luY1ZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgICAqXG4gICAgICogQWRkaW5nIGEgdmFsaWRhdG9yIHRoYXQgYWxyZWFkeSBleGlzdHMgd2lsbCBoYXZlIG5vIGVmZmVjdC4gSWYgZHVwbGljYXRlIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICAgKiBhcmUgcHJlc2VudCBpbiB0aGUgYHZhbGlkYXRvcnNgIGFycmF5LCBvbmx5IHRoZSBmaXJzdCBpbnN0YW5jZSB3b3VsZCBiZSBhZGRlZCB0byBhIGZvcm1cbiAgICAgKiBjb250cm9sLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIG5ldyB2YWxpZGF0b3IgZnVuY3Rpb24gb3IgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGlzIGNvbnRyb2wuXG4gICAgICovXG4gICAgYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsaWRhdG9ycyhhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd1ZhbGlkYXRvcnMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkIGFuIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyXG4gICAgICogdmFsaWRhdG9ycy5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgICAqXG4gICAgICogQWRkaW5nIGEgdmFsaWRhdG9yIHRoYXQgYWxyZWFkeSBleGlzdHMgd2lsbCBoYXZlIG5vIGVmZmVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBuZXcgYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBvciBmdW5jdGlvbnMgdG8gYWRkIHRvIHRoaXMgY29udHJvbC5cbiAgICAgKi9cbiAgICBhZGRBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgICAgICB0aGlzLnNldEFzeW5jVmFsaWRhdG9ycyhhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnJvbSB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyIHZhbGlkYXRvcnMuXG4gICAgICogVmFsaWRhdG9ycyBhcmUgY29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlOyB5b3UgbXVzdCBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lXG4gICAgICogdmFsaWRhdG9yIGZ1bmN0aW9uIGFzIHRoZSBvbmUgdGhhdCB3YXMgb3JpZ2luYWxseSBzZXQuIElmIGEgcHJvdmlkZWQgdmFsaWRhdG9yIGlzIG5vdCBmb3VuZCxcbiAgICAgKiBpdCBpcyBpZ25vcmVkLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKlxuICAgICAqICMjIyBSZWZlcmVuY2UgdG8gYSBWYWxpZGF0b3JGblxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogLy8gUmVmZXJlbmNlIHRvIHRoZSBSZXF1aXJlZFZhbGlkYXRvclxuICAgICAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2w8c3RyaW5nIHwgbnVsbD4oJycsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICAgICAqIGN0cmwucmVtb3ZlVmFsaWRhdG9ycyhWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAgICAgKlxuICAgICAqIC8vIFJlZmVyZW5jZSB0byBhbm9ueW1vdXMgZnVuY3Rpb24gaW5zaWRlIE1pblZhbGlkYXRvclxuICAgICAqIGNvbnN0IG1pblZhbGlkYXRvciA9IFZhbGlkYXRvcnMubWluKDMpO1xuICAgICAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2w8c3RyaW5nIHwgbnVsbD4oJycsIG1pblZhbGlkYXRvcik7XG4gICAgICogZXhwZWN0KGN0cmwuaGFzVmFsaWRhdG9yKG1pblZhbGlkYXRvcikpLnRvRXF1YWwodHJ1ZSlcbiAgICAgKiBleHBlY3QoY3RybC5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5taW4oMykpKS50b0VxdWFsKGZhbHNlKVxuICAgICAqXG4gICAgICogY3RybC5yZW1vdmVWYWxpZGF0b3JzKG1pblZhbGlkYXRvcik7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byByZW1vdmUuXG4gICAgICovXG4gICAgcmVtb3ZlVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsaWRhdG9ycyhyZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd1ZhbGlkYXRvcnMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnJvbSB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyIHZhbGlkYXRvcnMuXG4gICAgICogVmFsaWRhdG9ycyBhcmUgY29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlOyB5b3UgbXVzdCBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lXG4gICAgICogdmFsaWRhdG9yIGZ1bmN0aW9uIGFzIHRoZSBvbmUgdGhhdCB3YXMgb3JpZ2luYWxseSBzZXQuIElmIGEgcHJvdmlkZWQgdmFsaWRhdG9yIGlzIG5vdCBmb3VuZCwgaXRcbiAgICAgKiBpcyBpZ25vcmVkLlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgYXN5bmNocm9ub3VzIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHJlbW92ZS5cbiAgICAgKi9cbiAgICByZW1vdmVBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgICAgICB0aGlzLnNldEFzeW5jVmFsaWRhdG9ycyhyZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGlzIHByZXNlbnQgb24gdGhpcyBjb250cm9sLiBUaGUgcHJvdmlkZWRcbiAgICAgKiB2YWxpZGF0b3IgbXVzdCBiZSBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZSBmdW5jdGlvbiB0aGF0IHdhcyBwcm92aWRlZC5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgUmVmZXJlbmNlIHRvIGEgVmFsaWRhdG9yRm5cbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIC8vIFJlZmVyZW5jZSB0byB0aGUgUmVxdWlyZWRWYWxpZGF0b3JcbiAgICAgKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sPG51bWJlciB8IG51bGw+KDAsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICAgICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihWYWxpZGF0b3JzLnJlcXVpcmVkKSkudG9FcXVhbCh0cnVlKVxuICAgICAqXG4gICAgICogLy8gUmVmZXJlbmNlIHRvIGFub255bW91cyBmdW5jdGlvbiBpbnNpZGUgTWluVmFsaWRhdG9yXG4gICAgICogY29uc3QgbWluVmFsaWRhdG9yID0gVmFsaWRhdG9ycy5taW4oMyk7XG4gICAgICogY29uc3QgY3RybCA9IG5ldyBGb3JtQ29udHJvbDxudW1iZXIgfCBudWxsPigwLCBtaW5WYWxpZGF0b3IpO1xuICAgICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihtaW5WYWxpZGF0b3IpKS50b0VxdWFsKHRydWUpXG4gICAgICogZXhwZWN0KGN0cmwuaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMubWluKDMpKSkudG9FcXVhbChmYWxzZSlcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWxpZGF0b3IgVGhlIHZhbGlkYXRvciB0byBjaGVjayBmb3IgcHJlc2VuY2UuIENvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZS5cbiAgICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBwcm92aWRlZCB2YWxpZGF0b3Igd2FzIGZvdW5kIG9uIHRoaXMgY29udHJvbC5cbiAgICAgKi9cbiAgICBoYXNWYWxpZGF0b3IodmFsaWRhdG9yKSB7XG4gICAgICAgIHJldHVybiBoYXNWYWxpZGF0b3IodGhpcy5fcmF3VmFsaWRhdG9ycywgdmFsaWRhdG9yKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciBhbiBhc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGlzIHByZXNlbnQgb24gdGhpcyBjb250cm9sLiBUaGUgcHJvdmlkZWRcbiAgICAgKiB2YWxpZGF0b3IgbXVzdCBiZSBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZSBmdW5jdGlvbiB0aGF0IHdhcyBwcm92aWRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWxpZGF0b3IgVGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgdG8gY2hlY2sgZm9yIHByZXNlbmNlLiBDb21wYXJlZCBieSBmdW5jdGlvblxuICAgICAqICAgICByZWZlcmVuY2UuXG4gICAgICogQHJldHVybnMgV2hldGhlciB0aGUgcHJvdmlkZWQgYXN5bmNocm9ub3VzIHZhbGlkYXRvciB3YXMgZm91bmQgb24gdGhpcyBjb250cm9sLlxuICAgICAqL1xuICAgIGhhc0FzeW5jVmFsaWRhdG9yKHZhbGlkYXRvcikge1xuICAgICAgICByZXR1cm4gaGFzVmFsaWRhdG9yKHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycywgdmFsaWRhdG9yKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW1wdGllcyBvdXQgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvciBsaXN0LlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAgICpcbiAgICAgKi9cbiAgICBjbGVhclZhbGlkYXRvcnMoKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdG9yID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW1wdGllcyBvdXQgdGhlIGFzeW5jIHZhbGlkYXRvciBsaXN0LlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAgICpcbiAgICAgKi9cbiAgICBjbGVhckFzeW5jVmFsaWRhdG9ycygpIHtcbiAgICAgICAgdGhpcy5hc3luY1ZhbGlkYXRvciA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB0b3VjaGVkYC4gQSBjb250cm9sIGlzIHRvdWNoZWQgYnkgZm9jdXMgYW5kXG4gICAgICogYmx1ciBldmVudHMgdGhhdCBkbyBub3QgY2hhbmdlIHRoZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIG1hcmtBc1VudG91Y2hlZCgpfVxuICAgICAqIEBzZWUge0BsaW5rIG1hcmtBc0RpcnR5KCl9XG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzUHJpc3RpbmUoKX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgICAqL1xuICAgIG1hcmtBc1RvdWNoZWQob3B0cyA9IHt9KSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNUb3VjaGVkKG9wdHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoZSBjb250cm9sIGFuZCBhbGwgaXRzIGRlc2NlbmRhbnQgY29udHJvbHMgYXMgYHRvdWNoZWRgLlxuICAgICAqIEBzZWUge0BsaW5rIG1hcmtBc1RvdWNoZWQoKX1cbiAgICAgKi9cbiAgICBtYXJrQWxsQXNUb3VjaGVkKCkge1xuICAgICAgICB0aGlzLm1hcmtBc1RvdWNoZWQoeyBvbmx5U2VsZjogdHJ1ZSB9KTtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sKSA9PiBjb250cm9sLm1hcmtBbGxBc1RvdWNoZWQoKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB1bnRvdWNoZWRgLlxuICAgICAqXG4gICAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGFueSBjaGlsZHJlbiwgYWxzbyBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHVudG91Y2hlZGBcbiAgICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgdG91Y2hlZGAgc3RhdHVzIG9mIGFsbCBwYXJlbnQgY29udHJvbHMuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNUb3VjaGVkKCl9XG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzRGlydHkoKX1cbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNQcmlzdGluZSgpfVxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgICAqL1xuICAgIG1hcmtBc1VudG91Y2hlZChvcHRzID0ge30pIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdUb3VjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCkgPT4ge1xuICAgICAgICAgICAgY29udHJvbC5tYXJrQXNVbnRvdWNoZWQoeyBvbmx5U2VsZjogdHJ1ZSB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZChvcHRzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgZGlydHlgLiBBIGNvbnRyb2wgYmVjb21lcyBkaXJ0eSB3aGVuXG4gICAgICogdGhlIGNvbnRyb2wncyB2YWx1ZSBpcyBjaGFuZ2VkIHRocm91Z2ggdGhlIFVJOyBjb21wYXJlIGBtYXJrQXNUb3VjaGVkYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIG1hcmtBc1RvdWNoZWQoKX1cbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNVbnRvdWNoZWQoKX1cbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNQcmlzdGluZSgpfVxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAgICovXG4gICAgbWFya0FzRGlydHkob3B0cyA9IHt9KSB7XG4gICAgICAgIHRoaXMucHJpc3RpbmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc0RpcnR5KG9wdHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwcmlzdGluZWAuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHByaXN0aW5lYCxcbiAgICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgcHJpc3RpbmVgIHN0YXR1cyBvZiBhbGwgcGFyZW50XG4gICAgICogY29udHJvbHMuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNUb3VjaGVkKCl9XG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzVW50b3VjaGVkKCl9XG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzRGlydHkoKX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgZW1pdHMgZXZlbnRzIGFmdGVyXG4gICAgICogbWFya2luZyBpcyBhcHBsaWVkLlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgKi9cbiAgICBtYXJrQXNQcmlzdGluZShvcHRzID0ge30pIHtcbiAgICAgICAgdGhpcy5wcmlzdGluZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdEaXJ0eSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2wpID0+IHtcbiAgICAgICAgICAgIGNvbnRyb2wubWFya0FzUHJpc3RpbmUoeyBvbmx5U2VsZjogdHJ1ZSB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUob3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHBlbmRpbmdgLlxuICAgICAqXG4gICAgICogQSBjb250cm9sIGlzIHBlbmRpbmcgd2hpbGUgdGhlIGNvbnRyb2wgcGVyZm9ybXMgYXN5bmMgdmFsaWRhdGlvbi5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2BcbiAgICAgKiBvYnNlcnZhYmxlIGVtaXRzIGFuIGV2ZW50IHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgdGhlIGNvbnRyb2wgaXMgbWFya2VkIHBlbmRpbmcuXG4gICAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgICAqXG4gICAgICovXG4gICAgbWFya0FzUGVuZGluZyhvcHRzID0ge30pIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBQRU5ESU5HO1xuICAgICAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0NoYW5nZXMuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc1BlbmRpbmcob3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogRGlzYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAgICogZXhjbHVkZWQgZnJvbSB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGFueSBwYXJlbnQuIEl0cyBzdGF0dXMgaXMgYERJU0FCTEVEYC5cbiAgICAgKlxuICAgICAqIElmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBhbHNvIGRpc2FibGVkLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgICAqIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKi9cbiAgICBkaXNhYmxlKG9wdHMgPSB7fSkge1xuICAgICAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAgICAgLy8gcGFyZW50J3MgZGlydGluZXNzIGJhc2VkIG9uIHRoZSBjaGlsZHJlbi5cbiAgICAgICAgY29uc3Qgc2tpcFByaXN0aW5lQ2hlY2sgPSB0aGlzLl9wYXJlbnRNYXJrZWREaXJ0eShvcHRzLm9ubHlTZWxmKTtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBESVNBQkxFRDtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBudWxsO1xuICAgICAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2wpID0+IHtcbiAgICAgICAgICAgIGNvbnRyb2wuZGlzYWJsZSh7IC4uLm9wdHMsIG9ubHlTZWxmOiB0cnVlIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcbiAgICAgICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZXMuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzQ2hhbmdlcy5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoeyAuLi5vcHRzLCBza2lwUHJpc3RpbmVDaGVjayB9KTtcbiAgICAgICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4odHJ1ZSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbmFibGVzIHRoZSBjb250cm9sLiBUaGlzIG1lYW5zIHRoZSBjb250cm9sIGlzIGluY2x1ZGVkIGluIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgICAqIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgaXRzIHBhcmVudC4gSXRzIHN0YXR1cyByZWNhbGN1bGF0ZXMgYmFzZWQgb24gaXRzIHZhbHVlIGFuZFxuICAgICAqIGl0cyB2YWxpZGF0b3JzLlxuICAgICAqXG4gICAgICogQnkgZGVmYXVsdCwgaWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGVuYWJsZWQuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBjb250cm9sIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAgICogZW1pdHMgZXZlbnRzIHdoZW4gbWFya2VkIGFzIHVudG91Y2hlZFxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgZW5hYmxlZC5cbiAgICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICovXG4gICAgZW5hYmxlKG9wdHMgPSB7fSkge1xuICAgICAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAgICAgLy8gcGFyZW50J3MgZGlydGluZXNzIGJhc2VkIG9uIHRoZSBjaGlsZHJlbi5cbiAgICAgICAgY29uc3Qgc2tpcFByaXN0aW5lQ2hlY2sgPSB0aGlzLl9wYXJlbnRNYXJrZWREaXJ0eShvcHRzLm9ubHlTZWxmKTtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBWQUxJRDtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sKSA9PiB7XG4gICAgICAgICAgICBjb250cm9sLmVuYWJsZSh7IC4uLm9wdHMsIG9ubHlTZWxmOiB0cnVlIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgb25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnQgfSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUFuY2VzdG9ycyh7IC4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrIH0pO1xuICAgICAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLmZvckVhY2goKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbihmYWxzZSkpO1xuICAgIH1cbiAgICBfdXBkYXRlQW5jZXN0b3JzKG9wdHMpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cyk7XG4gICAgICAgICAgICBpZiAoIW9wdHMuc2tpcFByaXN0aW5lQ2hlY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBwYXJlbnQgb2YgdGhlIGNvbnRyb2xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnQgVGhlIG5ldyBwYXJlbnQuXG4gICAgICovXG4gICAgc2V0UGFyZW50KHBhcmVudCkge1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSByYXcgdmFsdWUgb2YgdGhpcyBjb250cm9sLiBGb3IgbW9zdCBjb250cm9sIGltcGxlbWVudGF0aW9ucywgdGhlIHJhdyB2YWx1ZSB3aWxsIGluY2x1ZGVcbiAgICAgKiBkaXNhYmxlZCBjaGlsZHJlbi5cbiAgICAgKi9cbiAgICBnZXRSYXdWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlY2FsY3VsYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgICAqXG4gICAgICogQnkgZGVmYXVsdCwgaXQgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgaXRzIGFuY2VzdG9ycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmQgZW1pdHMgZXZlbnRzXG4gICAgICogYWZ0ZXIgdXBkYXRlcyBhbmQgdmFsaWRpdHkgY2hlY2tzIGFyZSBhcHBsaWVkLlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBvbmx5IHVwZGF0ZSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgICAqIHVwZGF0ZSBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgdXBkYXRlZC5cbiAgICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICovXG4gICAgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzID0ge30pIHtcbiAgICAgICAgdGhpcy5fc2V0SW5pdGlhbFN0YXR1cygpO1xuICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuICAgICAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxFeGlzdGluZ1N1YnNjcmlwdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSB0aGlzLl9ydW5WYWxpZGF0b3IoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gdGhpcy5fY2FsY3VsYXRlU3RhdHVzKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFZBTElEIHx8IHRoaXMuc3RhdHVzID09PSBQRU5ESU5HKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcnVuQXN5bmNWYWxpZGF0b3Iob3B0cy5lbWl0RXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VzLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0NoYW5nZXMuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF91cGRhdGVUcmVlVmFsaWRpdHkob3B0cyA9IHsgZW1pdEV2ZW50OiB0cnVlIH0pIHtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjdHJsKSA9PiBjdHJsLl91cGRhdGVUcmVlVmFsaWRpdHkob3B0cykpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudCB9KTtcbiAgICB9XG4gICAgX3NldEluaXRpYWxTdGF0dXMoKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gdGhpcy5fYWxsQ29udHJvbHNEaXNhYmxlZCgpID8gRElTQUJMRUQgOiBWQUxJRDtcbiAgICB9XG4gICAgX3J1blZhbGlkYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yID8gdGhpcy52YWxpZGF0b3IodGhpcykgOiBudWxsO1xuICAgIH1cbiAgICBfcnVuQXN5bmNWYWxpZGF0b3IoZW1pdEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFBFTkRJTkc7XG4gICAgICAgICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgb2JzID0gdG9PYnNlcnZhYmxlKHRoaXMuYXN5bmNWYWxpZGF0b3IodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uID0gb2JzLnN1YnNjcmliZSgoZXJyb3JzKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIHRyaWdnZXIgdGhlIHJlY2FsY3VsYXRpb24gb2YgdGhlIHZhbGlkYXRpb24gc3RhdHVzLCB3aGljaCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAgICAgLy8gdGhlIHN0YXRlIG9mIHRoZSBhc3luY2hyb25vdXMgdmFsaWRhdGlvbiAod2hldGhlciBpdCBpcyBpbiBwcm9ncmVzcyBvciBub3QpLiBTbywgaXQgaXNcbiAgICAgICAgICAgICAgICAvLyBuZWNlc3NhcnkgdGhhdCB3ZSBoYXZlIHVwZGF0ZWQgdGhlIGBfaGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yYCBib29sZWFuIGZsYWcgZmlyc3QuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFcnJvcnMoZXJyb3JzLCB7IGVtaXRFdmVudCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9jYW5jZWxFeGlzdGluZ1N1YnNjcmlwdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGVycm9ycyBvbiBhIGZvcm0gY29udHJvbCB3aGVuIHJ1bm5pbmcgdmFsaWRhdGlvbnMgbWFudWFsbHksIHJhdGhlciB0aGFuIGF1dG9tYXRpY2FsbHkuXG4gICAgICpcbiAgICAgKiBDYWxsaW5nIGBzZXRFcnJvcnNgIGFsc28gdXBkYXRlcyB0aGUgdmFsaWRpdHkgb2YgdGhlIHBhcmVudCBjb250cm9sLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzXG4gICAgICogY2hhbmdlcyBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSBjb250cm9sIGVycm9ycyBhcmUgc2V0LlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBzdGF0dXNDaGFuZ2VzYFxuICAgICAqIG9ic2VydmFibGUgZW1pdHMgYW4gZXZlbnQgYWZ0ZXIgdGhlIGVycm9ycyBhcmUgc2V0LlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKlxuICAgICAqICMjIyBNYW51YWxseSBzZXQgdGhlIGVycm9ycyBmb3IgYSBjb250cm9sXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCBsb2dpbiA9IG5ldyBGb3JtQ29udHJvbCgnc29tZUxvZ2luJyk7XG4gICAgICogbG9naW4uc2V0RXJyb3JzKHtcbiAgICAgKiAgIG5vdFVuaXF1ZTogdHJ1ZVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogZXhwZWN0KGxvZ2luLnZhbGlkKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgKiBleHBlY3QobG9naW4uZXJyb3JzKS50b0VxdWFsKHsgbm90VW5pcXVlOiB0cnVlIH0pO1xuICAgICAqXG4gICAgICogbG9naW4uc2V0VmFsdWUoJ3NvbWVPdGhlckxvZ2luJyk7XG4gICAgICpcbiAgICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgc2V0RXJyb3JzKGVycm9ycywgb3B0cyA9IHt9KSB7XG4gICAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuICAgICAgICB0aGlzLl91cGRhdGVDb250cm9sc0Vycm9ycyhvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCBjb250cm9sIGdpdmVuIHRoZSBjb250cm9sJ3MgbmFtZSBvciBwYXRoLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhdGggQSBkb3QtZGVsaW1pdGVkIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmcvbnVtYmVyIHZhbHVlcyB0aGF0IGRlZmluZSB0aGUgcGF0aCB0byB0aGVcbiAgICAgKiBjb250cm9sLiBJZiBhIHN0cmluZyBpcyBwcm92aWRlZCwgcGFzc2luZyBpdCBhcyBhIHN0cmluZyBsaXRlcmFsIHdpbGwgcmVzdWx0IGluIGltcHJvdmVkIHR5cGVcbiAgICAgKiBpbmZvcm1hdGlvbi4gTGlrZXdpc2UsIGlmIGFuIGFycmF5IGlzIHByb3ZpZGVkLCBwYXNzaW5nIGl0IGBhcyBjb25zdGAgd2lsbCBjYXVzZSBpbXByb3ZlZCB0eXBlXG4gICAgICogaW5mb3JtYXRpb24gdG8gYmUgYXZhaWxhYmxlLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKiAjIyMgUmV0cmlldmUgYSBuZXN0ZWQgY29udHJvbFxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBuYW1lYCBjb250cm9sIG5lc3RlZCB3aXRoaW4gYSBgcGVyc29uYCBzdWItZ3JvdXA6XG4gICAgICpcbiAgICAgKiAqIGB0aGlzLmZvcm0uZ2V0KCdwZXJzb24ubmFtZScpO2BcbiAgICAgKlxuICAgICAqIC1PUi1cbiAgICAgKlxuICAgICAqICogYHRoaXMuZm9ybS5nZXQoWydwZXJzb24nLCAnbmFtZSddIGFzIGNvbnN0KTtgIC8vIGBhcyBjb25zdGAgZ2l2ZXMgaW1wcm92ZWQgdHlwaW5nc1xuICAgICAqXG4gICAgICogIyMjIFJldHJpZXZlIGEgY29udHJvbCBpbiBhIEZvcm1BcnJheVxuICAgICAqXG4gICAgICogV2hlbiBhY2Nlc3NpbmcgYW4gZWxlbWVudCBpbnNpZGUgYSBGb3JtQXJyYXksIHlvdSBjYW4gdXNlIGFuIGVsZW1lbnQgaW5kZXguXG4gICAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBwcmljZWAgY29udHJvbCBmcm9tIHRoZSBmaXJzdCBlbGVtZW50IGluIGFuIGBpdGVtc2AgYXJyYXkgeW91IGNhbiB1c2U6XG4gICAgICpcbiAgICAgKiAqIGB0aGlzLmZvcm0uZ2V0KCdpdGVtcy4wLnByaWNlJyk7YFxuICAgICAqXG4gICAgICogLU9SLVxuICAgICAqXG4gICAgICogKiBgdGhpcy5mb3JtLmdldChbJ2l0ZW1zJywgMCwgJ3ByaWNlJ10pO2BcbiAgICAgKi9cbiAgICBnZXQocGF0aCkge1xuICAgICAgICBsZXQgY3VyclBhdGggPSBwYXRoO1xuICAgICAgICBpZiAoY3VyclBhdGggPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY3VyclBhdGgpKVxuICAgICAgICAgICAgY3VyclBhdGggPSBjdXJyUGF0aC5zcGxpdCgnLicpO1xuICAgICAgICBpZiAoY3VyclBhdGgubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBjdXJyUGF0aC5yZWR1Y2UoKGNvbnRyb2wsIG5hbWUpID0+IGNvbnRyb2wgJiYgY29udHJvbC5fZmluZChuYW1lKSwgdGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlcG9ydHMgZXJyb3IgZGF0YSBmb3IgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgICAqIHRvIHRoZSBjb250cm9sIHRoYXQgc2hvdWxkIGJlIHF1ZXJpZWQgZm9yIGVycm9ycy5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogRm9yIGV4YW1wbGUsIGZvciB0aGUgZm9sbG93aW5nIGBGb3JtR3JvdXBgOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICAgKiB9KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAgICpcbiAgICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgICAqXG4gICAgICogMS4gQW4gYXJyYXkgb2Ygc3RyaW5nIGNvbnRyb2wgbmFtZXMsIGUuZy4gYFsnYWRkcmVzcycsICdzdHJlZXQnXWBcbiAgICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBlcnJvciBkYXRhIGZvciB0aGF0IHBhcnRpY3VsYXIgZXJyb3IuIElmIHRoZSBjb250cm9sIG9yIGVycm9yIGlzIG5vdCBwcmVzZW50LFxuICAgICAqIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0RXJyb3IoZXJyb3JDb2RlLCBwYXRoKSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSBwYXRoID8gdGhpcy5nZXQocGF0aCkgOiB0aGlzO1xuICAgICAgICByZXR1cm4gY29udHJvbCAmJiBjb250cm9sLmVycm9ycyA/IGNvbnRyb2wuZXJyb3JzW2Vycm9yQ29kZV0gOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aCBoYXMgdGhlIGVycm9yIHNwZWNpZmllZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgICAqIHRvIHRoZSBjb250cm9sIHRoYXQgc2hvdWxkIGJlIHF1ZXJpZWQgZm9yIGVycm9ycy5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogRm9yIGV4YW1wbGUsIGZvciB0aGUgZm9sbG93aW5nIGBGb3JtR3JvdXBgOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICAgKiB9KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAgICpcbiAgICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgICAqXG4gICAgICogMS4gQW4gYXJyYXkgb2Ygc3RyaW5nIGNvbnRyb2wgbmFtZXMsIGUuZy4gYFsnYWRkcmVzcycsICdzdHJlZXQnXWBcbiAgICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAgICpcbiAgICAgKiBJZiBubyBwYXRoIGlzIGdpdmVuLCB0aGlzIG1ldGhvZCBjaGVja3MgZm9yIHRoZSBlcnJvciBvbiB0aGUgY3VycmVudCBjb250cm9sLlxuICAgICAqXG4gICAgICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZXJyb3IgaXMgcHJlc2VudCBpbiB0aGUgY29udHJvbCBhdCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICAgKlxuICAgICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBmYWxzZSBpcyByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBoYXNFcnJvcihlcnJvckNvZGUsIHBhdGgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5nZXRFcnJvcihlcnJvckNvZGUsIHBhdGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHRvcC1sZXZlbCBhbmNlc3RvciBvZiB0aGlzIGNvbnRyb2wuXG4gICAgICovXG4gICAgZ2V0IHJvb3QoKSB7XG4gICAgICAgIGxldCB4ID0gdGhpcztcbiAgICAgICAgd2hpbGUgKHguX3BhcmVudCkge1xuICAgICAgICAgICAgeCA9IHguX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSB0aGlzLl9jYWxjdWxhdGVTdGF0dXMoKTtcbiAgICAgICAgaWYgKGVtaXRFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNDaGFuZ2VzLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlQ29udHJvbHNFcnJvcnMoZW1pdEV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2luaXRPYnNlcnZhYmxlcygpIHtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuc3RhdHVzQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB9XG4gICAgX2NhbGN1bGF0ZVN0YXR1cygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FsbENvbnRyb2xzRGlzYWJsZWQoKSlcbiAgICAgICAgICAgIHJldHVybiBESVNBQkxFRDtcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JzKVxuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIGlmICh0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgfHwgdGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKFBFTkRJTkcpKVxuICAgICAgICAgICAgcmV0dXJuIFBFTkRJTkc7XG4gICAgICAgIGlmICh0aGlzLl9hbnlDb250cm9sc0hhdmVTdGF0dXMoSU5WQUxJRCkpXG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgcmV0dXJuIFZBTElEO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sKSA9PiBjb250cm9sLnN0YXR1cyA9PT0gc3RhdHVzKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9hbnlDb250cm9sc0RpcnR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2wpID0+IGNvbnRyb2wuZGlydHkpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2FueUNvbnRyb2xzVG91Y2hlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sKSA9PiBjb250cm9sLnRvdWNoZWQpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3VwZGF0ZVByaXN0aW5lKG9wdHMgPSB7fSkge1xuICAgICAgICB0aGlzLnByaXN0aW5lID0gIXRoaXMuX2FueUNvbnRyb2xzRGlydHkoKTtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3VwZGF0ZVRvdWNoZWQob3B0cyA9IHt9KSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IHRoaXMuX2FueUNvbnRyb2xzVG91Y2hlZCgpO1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQob3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZShmbikge1xuICAgICAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPSBmbjtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9zZXRVcGRhdGVTdHJhdGVneShvcHRzKSB7XG4gICAgICAgIGlmIChpc09wdGlvbnNPYmoob3B0cykgJiYgb3B0cy51cGRhdGVPbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVPbiA9IG9wdHMudXBkYXRlT247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgdG8gc2VlIGlmIHBhcmVudCBoYXMgYmVlbiBtYXJrZWQgYXJ0aWZpY2lhbGx5IGRpcnR5LlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgX3BhcmVudE1hcmtlZERpcnR5KG9ubHlTZWxmKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudERpcnR5ID0gdGhpcy5fcGFyZW50ICYmIHRoaXMuX3BhcmVudC5kaXJ0eTtcbiAgICAgICAgcmV0dXJuICFvbmx5U2VsZiAmJiAhIXBhcmVudERpcnR5ICYmICF0aGlzLl9wYXJlbnQuX2FueUNvbnRyb2xzRGlydHkoKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9maW5kKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgc2V0VmFsaWRhdG9yc2AgbWV0aG9kLiBOZWVkcyB0byBiZSBzZXBhcmF0ZWQgb3V0IGludG8gYVxuICAgICAqIGRpZmZlcmVudCBtZXRob2QsIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGluIHRoZSBjb25zdHJ1Y3RvciBhbmQgaXQgY2FuIGJyZWFrIGNhc2VzIHdoZXJlXG4gICAgICogYSBjb250cm9sIGlzIGV4dGVuZGVkLlxuICAgICAqL1xuICAgIF9hc3NpZ25WYWxpZGF0b3JzKHZhbGlkYXRvcnMpIHtcbiAgICAgICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzLnNsaWNlKCkgOiB2YWxpZGF0b3JzO1xuICAgICAgICB0aGlzLl9jb21wb3NlZFZhbGlkYXRvckZuID0gY29lcmNlVG9WYWxpZGF0b3IodGhpcy5fcmF3VmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgc2V0QXN5bmNWYWxpZGF0b3JzYCBtZXRob2QuIE5lZWRzIHRvIGJlIHNlcGFyYXRlZCBvdXQgaW50byBhXG4gICAgICogZGlmZmVyZW50IG1ldGhvZCwgYmVjYXVzZSBpdCBpcyBjYWxsZWQgaW4gdGhlIGNvbnN0cnVjdG9yIGFuZCBpdCBjYW4gYnJlYWsgY2FzZXMgd2hlcmVcbiAgICAgKiBhIGNvbnRyb2wgaXMgZXh0ZW5kZWQuXG4gICAgICovXG4gICAgX2Fzc2lnbkFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSB7XG4gICAgICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzLnNsaWNlKCkgOiB2YWxpZGF0b3JzO1xuICAgICAgICB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGEgZ3JvdXAgb2YgYEZvcm1Db250cm9sYCBpbnN0YW5jZXMuXG4gKlxuICogQSBgRm9ybUdyb3VwYCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXMgb2YgZWFjaCBjaGlsZCBgRm9ybUNvbnRyb2xgIGludG8gb25lIG9iamVjdCxcbiAqIHdpdGggZWFjaCBjb250cm9sIG5hbWUgYXMgdGhlIGtleS4gIEl0IGNhbGN1bGF0ZXMgaXRzIHN0YXR1cyBieSByZWR1Y2luZyB0aGUgc3RhdHVzIHZhbHVlc1xuICogb2YgaXRzIGNoaWxkcmVuLiBGb3IgZXhhbXBsZSwgaWYgb25lIG9mIHRoZSBjb250cm9scyBpbiBhIGdyb3VwIGlzIGludmFsaWQsIHRoZSBlbnRpcmVcbiAqIGdyb3VwIGJlY29tZXMgaW52YWxpZC5cbiAqXG4gKiBgRm9ybUdyb3VwYCBpcyBvbmUgb2YgdGhlIGZvdXIgZnVuZGFtZW50YWwgYnVpbGRpbmcgYmxvY2tzIHVzZWQgdG8gZGVmaW5lIGZvcm1zIGluIEFuZ3VsYXIsXG4gKiBhbG9uZyB3aXRoIGBGb3JtQ29udHJvbGAsIGBGb3JtQXJyYXlgLCBhbmQgYEZvcm1SZWNvcmRgLlxuICpcbiAqIFdoZW4gaW5zdGFudGlhdGluZyBhIGBGb3JtR3JvdXBgLCBwYXNzIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scyBhcyB0aGUgZmlyc3RcbiAqIGFyZ3VtZW50LiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIHJlZ2lzdGVycyB0aGUgbmFtZSBmb3IgdGhlIGNvbnRyb2wuXG4gKlxuICogYEZvcm1Hcm91cGAgaXMgaW50ZW5kZWQgZm9yIHVzZSBjYXNlcyB3aGVyZSB0aGUga2V5cyBhcmUga25vd24gYWhlYWQgb2YgdGltZS5cbiAqIElmIHlvdSBuZWVkIHRvIGR5bmFtaWNhbGx5IGFkZCBhbmQgcmVtb3ZlIGNvbnRyb2xzLCB1c2Uge0BsaW5rIEZvcm1SZWNvcmR9IGluc3RlYWQuXG4gKlxuICogYEZvcm1Hcm91cGAgYWNjZXB0cyBhbiBvcHRpb25hbCB0eXBlIHBhcmFtZXRlciBgVENvbnRyb2xgLCB3aGljaCBpcyBhbiBvYmplY3QgdHlwZSB3aXRoIGlubmVyXG4gKiBjb250cm9sIHR5cGVzIGFzIHZhbHVlcy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGdyb3VwIHdpdGggMiBjb250cm9sc1xuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdOYW5jeScsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiB9KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q7ICdEcmV3J31cbiAqIGNvbnNvbGUubG9nKGZvcm0uc3RhdHVzKTsgIC8vICdWQUxJRCdcbiAqIGBgYFxuICpcbiAqICMjIyBUaGUgdHlwZSBhcmd1bWVudCwgYW5kIG9wdGlvbmFsIGNvbnRyb2xzXG4gKlxuICogYEZvcm1Hcm91cGAgYWNjZXB0cyBvbmUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgaXRzIGlubmVyIGNvbnRyb2xzLlxuICogVGhpcyB0eXBlIHdpbGwgdXN1YWxseSBiZSBpbmZlcnJlZCBhdXRvbWF0aWNhbGx5LCBidXQgeW91IGNhbiBhbHdheXMgc3BlY2lmeSBpdCBleHBsaWNpdGx5IGlmIHlvdVxuICogd2lzaC5cbiAqXG4gKiBJZiB5b3UgaGF2ZSBjb250cm9scyB0aGF0IGFyZSBvcHRpb25hbCAoaS5lLiB0aGV5IGNhbiBiZSByZW1vdmVkLCB5b3UgY2FuIHVzZSB0aGUgYD9gIGluIHRoZVxuICogdHlwZSk6XG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cDx7XG4gKiAgIGZpcnN0OiBGb3JtQ29udHJvbDxzdHJpbmd8bnVsbD4sXG4gKiAgIG1pZGRsZT86IEZvcm1Db250cm9sPHN0cmluZ3xudWxsPiwgLy8gTWlkZGxlIG5hbWUgaXMgb3B0aW9uYWwuXG4gKiAgIGxhc3Q6IEZvcm1Db250cm9sPHN0cmluZ3xudWxsPixcbiAqIH0+KHtcbiAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKSxcbiAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGdyb3VwIHdpdGggYSBncm91cC1sZXZlbCB2YWxpZGF0b3JcbiAqXG4gKiBZb3UgaW5jbHVkZSBncm91cC1sZXZlbCB2YWxpZGF0b3JzIGFzIHRoZSBzZWNvbmQgYXJnLCBvciBncm91cC1sZXZlbCBhc3luY1xuICogdmFsaWRhdG9ycyBhcyB0aGUgdGhpcmQgYXJnLiBUaGVzZSBjb21lIGluIGhhbmR5IHdoZW4geW91IHdhbnQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uXG4gKiB0aGF0IGNvbnNpZGVycyB0aGUgdmFsdWUgb2YgbW9yZSB0aGFuIG9uZSBjaGlsZCBjb250cm9sLlxuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBwYXNzd29yZDogbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIHBhc3N3b3JkQ29uZmlybTogbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiB9LCBwYXNzd29yZE1hdGNoVmFsaWRhdG9yKTtcbiAqXG4gKlxuICogZnVuY3Rpb24gcGFzc3dvcmRNYXRjaFZhbGlkYXRvcihnOiBGb3JtR3JvdXApIHtcbiAqICAgIHJldHVybiBnLmdldCgncGFzc3dvcmQnKS52YWx1ZSA9PT0gZy5nZXQoJ3Bhc3N3b3JkQ29uZmlybScpLnZhbHVlXG4gKiAgICAgICA/IG51bGwgOiB7J21pc21hdGNoJzogdHJ1ZX07XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBMaWtlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLCB5b3UgY2hvb3NlIHRvIHBhc3MgaW5cbiAqIHZhbGlkYXRvcnMgYW5kIGFzeW5jIHZhbGlkYXRvcnMgYXMgcGFydCBvZiBhbiBvcHRpb25zIG9iamVjdC5cbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgcGFzc3dvcmQ6IG5ldyBGb3JtQ29udHJvbCgnJylcbiAqICAgcGFzc3dvcmRDb25maXJtOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiB9LCB7IHZhbGlkYXRvcnM6IHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yczogb3RoZXJWYWxpZGF0b3IgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgU2V0IHRoZSB1cGRhdGVPbiBwcm9wZXJ0eSBmb3IgYWxsIGNvbnRyb2xzIGluIGEgZm9ybSBncm91cFxuICpcbiAqIFRoZSBvcHRpb25zIG9iamVjdCBpcyB1c2VkIHRvIHNldCBhIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggY2hpbGRcbiAqIGNvbnRyb2wncyBgdXBkYXRlT25gIHByb3BlcnR5LiBJZiB5b3Ugc2V0IGB1cGRhdGVPbmAgdG8gYCdibHVyJ2AgYXQgdGhlXG4gKiBncm91cCBsZXZlbCwgYWxsIGNoaWxkIGNvbnRyb2xzIGRlZmF1bHQgdG8gJ2JsdXInLCB1bmxlc3MgdGhlIGNoaWxkXG4gKiBoYXMgZXhwbGljaXRseSBzcGVjaWZpZWQgYSBkaWZmZXJlbnQgYHVwZGF0ZU9uYCB2YWx1ZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgYyA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBvbmU6IG5ldyBGb3JtQ29udHJvbCgpXG4gKiB9LCB7IHVwZGF0ZU9uOiAnYmx1cicgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNpbmcgYSBGb3JtR3JvdXAgd2l0aCBvcHRpb25hbCBjb250cm9sc1xuICpcbiAqIEl0IGlzIHBvc3NpYmxlIHRvIGhhdmUgb3B0aW9uYWwgY29udHJvbHMgaW4gYSBGb3JtR3JvdXAuIEFuIG9wdGlvbmFsIGNvbnRyb2wgY2FuIGJlIHJlbW92ZWQgbGF0ZXJcbiAqIHVzaW5nIGByZW1vdmVDb250cm9sYCwgYW5kIGNhbiBiZSBvbWl0dGVkIHdoZW4gY2FsbGluZyBgcmVzZXRgLiBPcHRpb25hbCBjb250cm9scyBtdXN0IGJlXG4gKiBkZWNsYXJlZCBvcHRpb25hbCBpbiB0aGUgZ3JvdXAncyB0eXBlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjID0gbmV3IEZvcm1Hcm91cDx7b25lPzogRm9ybUNvbnRyb2w8c3RyaW5nPn0+KHtcbiAqICAgb25lOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIE5vdGljZSB0aGF0IGBjLnZhbHVlLm9uZWAgaGFzIHR5cGUgYHN0cmluZ3xudWxsfHVuZGVmaW5lZGAuIFRoaXMgaXMgYmVjYXVzZSBjYWxsaW5nIGBjLnJlc2V0KHt9KWBcbiAqIHdpdGhvdXQgcHJvdmlkaW5nIHRoZSBvcHRpb25hbCBrZXkgYG9uZWAgd2lsbCBjYXVzZSBpdCB0byBiZWNvbWUgYG51bGxgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgRm9ybUdyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbnRyb2xzIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAgIHN1cGVyKHBpY2tWYWxpZGF0b3JzKHZhbGlkYXRvck9yT3B0cyksIHBpY2tBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykpO1xuICAgICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSAmJiB2YWxpZGF0ZUZvcm1Hcm91cENvbnRyb2xzKGNvbnRyb2xzKTtcbiAgICAgICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xuICAgICAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICAgICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICAgICAgdGhpcy5fc2V0VXBDb250cm9scygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe1xuICAgICAgICAgICAgb25seVNlbGY6IHRydWUsXG4gICAgICAgICAgICAvLyBJZiBgYXN5bmNWYWxpZGF0b3JgIGlzIHByZXNlbnQsIGl0IHdpbGwgdHJpZ2dlciBjb250cm9sIHN0YXR1cyBjaGFuZ2UgZnJvbSBgUEVORElOR2AgdG9cbiAgICAgICAgICAgIC8vIGBWQUxJRGAgb3IgYElOVkFMSURgLiBUaGUgc3RhdHVzIHNob3VsZCBiZSBicm9hZGNhc3RlZCB2aWEgdGhlIGBzdGF0dXNDaGFuZ2VzYCBvYnNlcnZhYmxlLFxuICAgICAgICAgICAgLy8gc28gd2Ugc2V0IGBlbWl0RXZlbnRgIHRvIGB0cnVlYCB0byBhbGxvdyB0aGF0IGR1cmluZyB0aGUgY29udHJvbCBjcmVhdGlvbiBwcm9jZXNzLlxuICAgICAgICAgICAgZW1pdEV2ZW50OiAhIXRoaXMuYXN5bmNWYWxpZGF0b3JcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbHNbbmFtZV07XG4gICAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0gPSBjb250cm9sO1xuICAgICAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICAgICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfVxuICAgIGFkZENvbnRyb2wobmFtZSwgY29udHJvbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJDb250cm9sKG5hbWUsIGNvbnRyb2wpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY29udHJvbCBmcm9tIHRoaXMgZ3JvdXAuIEluIGEgc3Ryb25nbHktdHlwZWQgZ3JvdXAsIHJlcXVpcmVkIGNvbnRyb2xzIGNhbm5vdCBiZVxuICAgICAqIHJlbW92ZWQuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiB0aGUgY29udHJvbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVtb3ZlIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1Hcm91cCBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYVxuICAgICAqICAgICBjb250cm9sIGlzIHJlbW92ZWQuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgICAqIHJlbW92ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKi9cbiAgICByZW1vdmVDb250cm9sKG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSlcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHsgfSk7XG4gICAgICAgIGRlbGV0ZSAodGhpcy5jb250cm9sc1tuYW1lXSk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICAgIH1cbiAgICBzZXRDb250cm9sKG5hbWUsIGNvbnRyb2wsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSlcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHsgfSk7XG4gICAgICAgIGRlbGV0ZSAodGhpcy5jb250cm9sc1tuYW1lXSk7XG4gICAgICAgIGlmIChjb250cm9sKVxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckNvbnRyb2wobmFtZSwgY29udHJvbCk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICAgIH1cbiAgICBjb250YWlucyhjb250cm9sTmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9scy5oYXNPd25Qcm9wZXJ0eShjb250cm9sTmFtZSkgJiYgdGhpcy5jb250cm9sc1tjb250cm9sTmFtZV0uZW5hYmxlZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLiBJdCBhY2NlcHRzIGFuIG9iamVjdCB0aGF0IG1hdGNoZXNcbiAgICAgKiB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cCwgd2l0aCBjb250cm9sIG5hbWVzIGFzIGtleXMuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqICMjIyBTZXQgdGhlIGNvbXBsZXRlIHZhbHVlIGZvciB0aGUgZm9ybSBncm91cFxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgpLFxuICAgICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKClcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogbnVsbCwgbGFzdDogbnVsbH1cbiAgICAgKlxuICAgICAqIGZvcm0uc2V0VmFsdWUoe2ZpcnN0OiAnTmFuY3knLCBsYXN0OiAnRHJldyd9KTtcbiAgICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J31cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEB0aHJvd3MgV2hlbiBzdHJpY3QgY2hlY2tzIGZhaWwsIHN1Y2ggYXMgc2V0dGluZyB0aGUgdmFsdWUgb2YgYSBjb250cm9sXG4gICAgICogdGhhdCBkb2Vzbid0IGV4aXN0IG9yIGlmIHlvdSBleGNsdWRlIGEgdmFsdWUgb2YgYSBjb250cm9sIHRoYXQgZG9lcyBleGlzdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgICAqXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgICAqIGZhbHNlLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKi9cbiAgICBzZXRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGFzc2VydEFsbFZhbHVlc1ByZXNlbnQodGhpcywgdHJ1ZSwgdmFsdWUpO1xuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIGFzc2VydENvbnRyb2xQcmVzZW50KHRoaXMsIHRydWUsIG5hbWUpO1xuICAgICAgICAgICAgdGhpcy5jb250cm9sc1tuYW1lXS5zZXRWYWx1ZSh2YWx1ZVtuYW1lXSwgeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudCB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGF0Y2hlcyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLiBJdCBhY2NlcHRzIGFuIG9iamVjdCB3aXRoIGNvbnRyb2xcbiAgICAgKiBuYW1lcyBhcyBrZXlzLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0IGNvbnRyb2xzXG4gICAgICogaW4gdGhlIGdyb3VwLlxuICAgICAqXG4gICAgICogSXQgYWNjZXB0cyBib3RoIHN1cGVyLXNldHMgYW5kIHN1Yi1zZXRzIG9mIHRoZSBncm91cCB3aXRob3V0IHRocm93aW5nIGFuIGVycm9yLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKiAjIyMgUGF0Y2ggdGhlIHZhbHVlIGZvciBhIGZvcm0gZ3JvdXBcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICAgKiAgICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gICAgICogICAgbGFzdDogbmV3IEZvcm1Db250cm9sKClcbiAgICAgKiB9KTtcbiAgICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6IG51bGwsIGxhc3Q6IG51bGx9XG4gICAgICpcbiAgICAgKiBmb3JtLnBhdGNoVmFsdWUoe2ZpcnN0OiAnTmFuY3knfSk7XG4gICAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OiBudWxsfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSBvYmplY3QgdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgaXMgcGF0Y2hlZC5cbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICAgKiB0cnVlLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWVcbiAgICAgKiBpcyB1cGRhdGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0b1xuICAgICAqIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHkgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgICAqL1xuICAgIHBhdGNoVmFsdWUodmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAvLyBFdmVuIHRob3VnaCB0aGUgYHZhbHVlYCBhcmd1bWVudCB0eXBlIGRvZXNuJ3QgYWxsb3cgYG51bGxgIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMsIHRoZVxuICAgICAgICAvLyBgcGF0Y2hWYWx1ZWAgY2FuIGJlIGNhbGxlZCByZWN1cnNpdmVseSBhbmQgaW5uZXIgZGF0YSBzdHJ1Y3R1cmVzIG1pZ2h0IGhhdmUgdGhlc2UgdmFsdWVzLCBzb1xuICAgICAgICAvLyB3ZSBqdXN0IGlnbm9yZSBzdWNoIGNhc2VzIHdoZW4gYSBmaWVsZCBjb250YWluaW5nIEZvcm1Hcm91cCBpbnN0YW5jZSByZWNlaXZlcyBgbnVsbGAgb3JcbiAgICAgICAgLy8gYHVuZGVmaW5lZGAgYXMgYSB2YWx1ZS5cbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgLyogYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgICovKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIC8vIFRoZSBjb21waWxlciBjYW5ub3Qgc2VlIHRocm91Z2ggdGhlIHVuaW5zdGFudGlhdGVkIGNvbmRpdGlvbmFsIHR5cGUgb2YgYHRoaXMuY29udHJvbHNgLCBzb1xuICAgICAgICAgICAgLy8gYGFzIGFueWAgaXMgcmVxdWlyZWQuXG4gICAgICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5jb250cm9sc1tuYW1lXTtcbiAgICAgICAgICAgIGlmIChjb250cm9sKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbC5wYXRjaFZhbHVlKFxuICAgICAgICAgICAgICAgIC8qIEd1YXJhbnRlZWQgdG8gYmUgcHJlc2VudCwgZHVlIHRvIHRoZSBvdXRlciBmb3JFYWNoLiAqLyB2YWx1ZVtuYW1lXSwgeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBgRm9ybUdyb3VwYCwgbWFya3MgYWxsIGRlc2NlbmRhbnRzIGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgIGFuZCBzZXRzXG4gICAgICogdGhlIHZhbHVlIG9mIGFsbCBkZXNjZW5kYW50cyB0byB0aGVpciBkZWZhdWx0IHZhbHVlcywgb3IgbnVsbCBpZiBubyBkZWZhdWx0cyB3ZXJlIHByb3ZpZGVkLlxuICAgICAqXG4gICAgICogWW91IHJlc2V0IHRvIGEgc3BlY2lmaWMgZm9ybSBzdGF0ZSBieSBwYXNzaW5nIGluIGEgbWFwIG9mIHN0YXRlc1xuICAgICAqIHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHlvdXIgZm9ybSwgd2l0aCBjb250cm9sIG5hbWVzIGFzIGtleXMuIFRoZSBzdGF0ZVxuICAgICAqIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZSBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkXG4gICAgICogc3RhdHVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFJlc2V0cyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgICAqIGFuZCBlbWl0cyBldmVudHMgd2hlbiB0aGUgZ3JvdXAgaXMgcmVzZXQuXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgICAqIGZhbHNlLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyByZXNldC5cbiAgICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqXG4gICAgICogIyMjIFJlc2V0IHRoZSBmb3JtIGdyb3VwIHZhbHVlc1xuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gICAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ2xhc3QgbmFtZScpXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ2ZpcnN0IG5hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICAgKlxuICAgICAqIGZvcm0ucmVzZXQoeyBmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJyB9KTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgLy8ge2ZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogIyMjIFJlc2V0IHRoZSBmb3JtIGdyb3VwIHZhbHVlcyBhbmQgZGlzYWJsZWQgc3RhdHVzXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gICAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ2xhc3QgbmFtZScpXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBmb3JtLnJlc2V0KHtcbiAgICAgKiAgIGZpcnN0OiB7dmFsdWU6ICduYW1lJywgZGlzYWJsZWQ6IHRydWV9LFxuICAgICAqICAgbGFzdDogJ2xhc3QnXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtsYXN0OiAnbGFzdCd9XG4gICAgICogY29uc29sZS5sb2coZm9ybS5nZXQoJ2ZpcnN0Jykuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICByZXNldCh2YWx1ZSA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBjb250cm9sLnJlc2V0KHZhbHVlID8gdmFsdWVbbmFtZV0gOiBudWxsLCB7IG9ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvdWNoZWQob3B0aW9ucyk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAsIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAgICpcbiAgICAgKiBSZXRyaWV2ZXMgYWxsIHZhbHVlcyByZWdhcmRsZXNzIG9mIGRpc2FibGVkIHN0YXR1cy5cbiAgICAgKi9cbiAgICBnZXRSYXdWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZHVjZUNoaWxkcmVuKHt9LCAoYWNjLCBjb250cm9sLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBhY2NbbmFtZV0gPSBjb250cm9sLmdldFJhd1ZhbHVlKCk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCkge1xuICAgICAgICBsZXQgc3VidHJlZVVwZGF0ZWQgPSB0aGlzLl9yZWR1Y2VDaGlsZHJlbihmYWxzZSwgKHVwZGF0ZWQsIGNoaWxkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQuX3N5bmNQZW5kaW5nQ29udHJvbHMoKSA/IHRydWUgOiB1cGRhdGVkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHN1YnRyZWVVcGRhdGVkKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgb25seVNlbGY6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9mb3JFYWNoQ2hpbGQoY2IpIHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5jb250cm9scykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgLy8gVGhlIGxpc3Qgb2YgY29udHJvbHMgY2FuIGNoYW5nZSAoZm9yIGV4LiBjb250cm9scyBtaWdodCBiZSByZW1vdmVkKSB3aGlsZSB0aGUgbG9vcFxuICAgICAgICAgICAgLy8gaXMgcnVubmluZyAoYXMgYSByZXN1bHQgb2YgaW52b2tpbmcgRm9ybXMgQVBJIGluIGB2YWx1ZUNoYW5nZXNgIHN1YnNjcmlwdGlvbiksIHNvIHdlXG4gICAgICAgICAgICAvLyBoYXZlIHRvIG51bGwgY2hlY2sgYmVmb3JlIGludm9raW5nIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2xzW2tleV07XG4gICAgICAgICAgICBjb250cm9sICYmIGNiKGNvbnRyb2wsIGtleSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3NldFVwQ29udHJvbHMoKSB7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCkgPT4ge1xuICAgICAgICAgICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICAgICAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSh0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF91cGRhdGVWYWx1ZSgpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX3JlZHVjZVZhbHVlKCk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfYW55Q29udHJvbHMoY29uZGl0aW9uKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2NvbnRyb2xOYW1lLCBjb250cm9sXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNvbnRyb2xzKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbnMoY29udHJvbE5hbWUpICYmIGNvbmRpdGlvbihjb250cm9sKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9yZWR1Y2VWYWx1ZSgpIHtcbiAgICAgICAgbGV0IGFjYyA9IHt9O1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oYWNjLCAoYWNjLCBjb250cm9sLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBhY2NbbmFtZV0gPSBjb250cm9sLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVkdWNlQ2hpbGRyZW4oaW5pdFZhbHVlLCBmbikge1xuICAgICAgICBsZXQgcmVzID0gaW5pdFZhbHVlO1xuICAgICAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2wsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIHJlcyA9IGZuKHJlcywgY29udHJvbCwgbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2FsbENvbnRyb2xzRGlzYWJsZWQoKSB7XG4gICAgICAgIGZvciAoY29uc3QgY29udHJvbE5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5jb250cm9scykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzW2NvbnRyb2xOYW1lXS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5sZW5ndGggPiAwIHx8IHRoaXMuZGlzYWJsZWQ7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmhhc093blByb3BlcnR5KG5hbWUpID9cbiAgICAgICAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0gOlxuICAgICAgICAgICAgbnVsbDtcbiAgICB9XG59XG4vKipcbiAqIFdpbGwgdmFsaWRhdGUgdGhhdCBub25lIG9mIHRoZSBjb250cm9scyBoYXMgYSBrZXkgd2l0aCBhIGRvdFxuICogVGhyb3dzIG90aGVyIHdpc2VcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVGb3JtR3JvdXBDb250cm9scyhjb250cm9scykge1xuICAgIGNvbnN0IGludmFsaWRLZXlzID0gT2JqZWN0LmtleXMoY29udHJvbHMpLmZpbHRlcihrZXkgPT4ga2V5LmluY2x1ZGVzKCcuJykpO1xuICAgIGlmIChpbnZhbGlkS2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFRPRE86IG1ha2UgdGhpcyBhbiBlcnJvciBvbmNlIHRoZXJlIGFyZSBubyBtb3JlIHVzZXMgaW4gRzNcbiAgICAgICAgY29uc29sZS53YXJuKGBGb3JtR3JvdXAga2V5cyBjYW5ub3QgaW5jbHVkZSBcXGAuXFxgLCBwbGVhc2UgcmVwbGFjZSB0aGUga2V5cyBmb3I6ICR7aW52YWxpZEtleXMuam9pbignLCcpfS5gKTtcbiAgICB9XG59XG5jb25zdCBVbnR5cGVkRm9ybUdyb3VwID0gRm9ybUdyb3VwO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFzc2VydHMgdGhhdCB0aGUgZ2l2ZW4gY29udHJvbCBpcyBhbiBpbnN0YW5jZSBvZiBgRm9ybUdyb3VwYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY29uc3QgaXNGb3JtR3JvdXAgPSAoY29udHJvbCkgPT4gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Hcm91cDtcbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdGUgb2YgYSBjb2xsZWN0aW9uIG9mIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLCBlYWNoIG9mIHdoaWNoIGhhc1xuICogdGhlIHNhbWUgdmFsdWUgdHlwZS5cbiAqXG4gKiBgRm9ybVJlY29yZGAgaXMgdmVyeSBzaW1pbGFyIHRvIHtAbGluayBGb3JtR3JvdXB9LCBleGNlcHQgaXQgY2FuIGJlIHVzZWQgd2l0aCBhIGR5bmFtaWMga2V5cyxcbiAqIHdpdGggY29udHJvbHMgYWRkZWQgYW5kIHJlbW92ZWQgYXMgbmVlZGVkLlxuICpcbiAqIGBGb3JtUmVjb3JkYCBhY2NlcHRzIG9uZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBkZXNjcmliZXMgdGhlIHR5cGUgb2YgdGhlIGNvbnRyb2xzIGl0IGNvbnRhaW5zLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogYGBgXG4gKiBsZXQgbnVtYmVycyA9IG5ldyBGb3JtUmVjb3JkKHtiaWxsOiBuZXcgRm9ybUNvbnRyb2woJzQxNS0xMjMtNDU2Jyl9KTtcbiAqIG51bWJlcnMuYWRkQ29udHJvbCgnYm9iJywgbmV3IEZvcm1Db250cm9sKCc0MTUtMjM0LTU2NycpKTtcbiAqIG51bWJlcnMucmVtb3ZlQ29udHJvbCgnYmlsbCcpO1xuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBGb3JtUmVjb3JkIGV4dGVuZHMgRm9ybUdyb3VwIHtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBc3NlcnRzIHRoYXQgdGhlIGdpdmVuIGNvbnRyb2wgaXMgYW4gaW5zdGFuY2Ugb2YgYEZvcm1SZWNvcmRgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jb25zdCBpc0Zvcm1SZWNvcmQgPSAoY29udHJvbCkgPT4gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1SZWNvcmQ7XG5cbi8qKlxuICogVG9rZW4gdG8gcHJvdmlkZSB0byBhbGxvdyBTZXREaXNhYmxlZFN0YXRlIHRvIGFsd2F5cyBiZSBjYWxsZWQgd2hlbiBhIENWQSBpcyBhZGRlZCwgcmVnYXJkbGVzcyBvZlxuICogd2hldGhlciB0aGUgY29udHJvbCBpcyBkaXNhYmxlZCBvciBlbmFibGVkLlxuICpcbiAqIEBzZWUge0BsaW5rIEZvcm1zTW9kdWxlI3dpdGhjb25maWd9XG4gKi9cbmNvbnN0IENBTExfU0VUX0RJU0FCTEVEX1NUQVRFID0gbmV3IEluamVjdGlvblRva2VuKCdDYWxsU2V0RGlzYWJsZWRTdGF0ZScsIHsgcHJvdmlkZWRJbjogJ3Jvb3QnLCBmYWN0b3J5OiAoKSA9PiBzZXREaXNhYmxlZFN0YXRlRGVmYXVsdCB9KTtcbi8qKlxuICogV2hldGhlciB0byB1c2UgdGhlIGZpeGVkIHNldERpc2FibGVkU3RhdGUgYmVoYXZpb3IgYnkgZGVmYXVsdC5cbiAqL1xuY29uc3Qgc2V0RGlzYWJsZWRTdGF0ZURlZmF1bHQgPSAnYWx3YXlzJztcbmZ1bmN0aW9uIGNvbnRyb2xQYXRoKG5hbWUsIHBhcmVudCkge1xuICAgIHJldHVybiBbLi4ucGFyZW50LnBhdGgsIG5hbWVdO1xufVxuLyoqXG4gKiBMaW5rcyBhIEZvcm0gY29udHJvbCBhbmQgYSBGb3JtIGRpcmVjdGl2ZSBieSBzZXR0aW5nIHVwIGNhbGxiYWNrcyAoc3VjaCBhcyBgb25DaGFuZ2VgKSBvbiBib3RoXG4gKiBpbnN0YW5jZXMuIFRoaXMgZnVuY3Rpb24gaXMgdHlwaWNhbGx5IGludm9rZWQgd2hlbiBmb3JtIGRpcmVjdGl2ZSBpcyBiZWluZyBpbml0aWFsaXplZC5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgbGlua2VkLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgdGhhdCBzaG91bGQgYmUgbGlua2VkIHdpdGggYSBnaXZlbiBjb250cm9sLlxuICovXG5mdW5jdGlvbiBzZXRVcENvbnRyb2woY29udHJvbCwgZGlyLCBjYWxsU2V0RGlzYWJsZWRTdGF0ZSA9IHNldERpc2FibGVkU3RhdGVEZWZhdWx0KSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICBpZiAoIWNvbnRyb2wpXG4gICAgICAgICAgICBfdGhyb3dFcnJvcihkaXIsICdDYW5ub3QgZmluZCBjb250cm9sIHdpdGgnKTtcbiAgICAgICAgaWYgKCFkaXIudmFsdWVBY2Nlc3NvcilcbiAgICAgICAgICAgIF90aHJvd01pc3NpbmdWYWx1ZUFjY2Vzc29yRXJyb3IoZGlyKTtcbiAgICB9XG4gICAgc2V0VXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpcik7XG4gICAgZGlyLnZhbHVlQWNjZXNzb3Iud3JpdGVWYWx1ZShjb250cm9sLnZhbHVlKTtcbiAgICAvLyBUaGUgbGVnYWN5IGJlaGF2aW9yIG9ubHkgY2FsbHMgdGhlIENWQSdzIGBzZXREaXNhYmxlZFN0YXRlYCBpZiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICAvLyBJZiB0aGUgYGNhbGxTZXREaXNhYmxlZFN0YXRlYCBvcHRpb24gaXMgc2V0IHRvIGBhbHdheXNgLCB0aGVuIHRoaXMgYnVnIGlzIGZpeGVkIGFuZFxuICAgIC8vIHRoZSBtZXRob2QgaXMgYWx3YXlzIGNhbGxlZC5cbiAgICBpZiAoY29udHJvbC5kaXNhYmxlZCB8fCBjYWxsU2V0RGlzYWJsZWRTdGF0ZSA9PT0gJ2Fsd2F5cycpIHtcbiAgICAgICAgZGlyLnZhbHVlQWNjZXNzb3Iuc2V0RGlzYWJsZWRTdGF0ZT8uKGNvbnRyb2wuZGlzYWJsZWQpO1xuICAgIH1cbiAgICBzZXRVcFZpZXdDaGFuZ2VQaXBlbGluZShjb250cm9sLCBkaXIpO1xuICAgIHNldFVwTW9kZWxDaGFuZ2VQaXBlbGluZShjb250cm9sLCBkaXIpO1xuICAgIHNldFVwQmx1clBpcGVsaW5lKGNvbnRyb2wsIGRpcik7XG4gICAgc2V0VXBEaXNhYmxlZENoYW5nZUhhbmRsZXIoY29udHJvbCwgZGlyKTtcbn1cbi8qKlxuICogUmV2ZXJ0cyBjb25maWd1cmF0aW9uIHBlcmZvcm1lZCBieSB0aGUgYHNldFVwQ29udHJvbGAgY29udHJvbCBmdW5jdGlvbi5cbiAqIEVmZmVjdGl2ZWx5IGRpc2Nvbm5lY3RzIGZvcm0gY29udHJvbCB3aXRoIGEgZ2l2ZW4gZm9ybSBkaXJlY3RpdmUuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHR5cGljYWxseSBpbnZva2VkIHdoZW4gY29ycmVzcG9uZGluZyBmb3JtIGRpcmVjdGl2ZSBpcyBiZWluZyBkZXN0cm95ZWQuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIHdoaWNoIHNob3VsZCBiZSBjbGVhbmVkIHVwLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgdGhhdCBzaG91bGQgYmUgZGlzY29ubmVjdGVkIGZyb20gYSBnaXZlbiBjb250cm9sLlxuICogQHBhcmFtIHZhbGlkYXRlQ29udHJvbFByZXNlbmNlT25DaGFuZ2UgRmxhZyB0aGF0IGluZGljYXRlcyB3aGV0aGVyIG9uQ2hhbmdlIGhhbmRsZXIgc2hvdWxkXG4gKiAgICAgY29udGFpbiBhc3NlcnRzIHRvIHZlcmlmeSB0aGF0IGl0J3Mgbm90IGNhbGxlZCBvbmNlIGRpcmVjdGl2ZSBpcyBkZXN0cm95ZWQuIFdlIG5lZWQgdGhpcyBmbGFnXG4gKiAgICAgdG8gYXZvaWQgcG90ZW50aWFsbHkgYnJlYWtpbmcgY2hhbmdlcyBjYXVzZWQgYnkgYmV0dGVyIGNvbnRyb2wgY2xlYW51cCBpbnRyb2R1Y2VkIGluICMzOTIzNS5cbiAqL1xuZnVuY3Rpb24gY2xlYW5VcENvbnRyb2woY29udHJvbCwgZGlyLCB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5vb3AgPSAoKSA9PiB7XG4gICAgICAgIGlmICh2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgICBfbm9Db250cm9sRXJyb3IoZGlyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gVGhlIGB2YWx1ZUFjY2Vzc29yYCBmaWVsZCBpcyB0eXBpY2FsbHkgZGVmaW5lZCBvbiBGcm9tQ29udHJvbCBhbmQgRm9ybUNvbnRyb2xOYW1lIGRpcmVjdGl2ZVxuICAgIC8vIGluc3RhbmNlcyBhbmQgdGhlcmUgaXMgYSBsb2dpYyBpbiBgc2VsZWN0VmFsdWVBY2Nlc3NvcmAgZnVuY3Rpb24gdGhhdCB0aHJvd3MgaWYgaXQncyBub3QgdGhlXG4gICAgLy8gY2FzZS4gV2Ugc3RpbGwgY2hlY2sgdGhlIHByZXNlbmNlIG9mIGB2YWx1ZUFjY2Vzc29yYCBiZWZvcmUgaW52b2tpbmcgaXRzIG1ldGhvZHMgdG8gbWFrZSBzdXJlXG4gICAgLy8gdGhhdCBjbGVhbnVwIHdvcmtzIGNvcnJlY3RseSBpZiBhcHAgY29kZSBvciB0ZXN0cyBhcmUgc2V0dXAgdG8gaWdub3JlIHRoZSBlcnJvciB0aHJvd24gZnJvbVxuICAgIC8vIGBzZWxlY3RWYWx1ZUFjY2Vzc29yYC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzQwNTIxLlxuICAgIGlmIChkaXIudmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBkaXIudmFsdWVBY2Nlc3Nvci5yZWdpc3Rlck9uQ2hhbmdlKG5vb3ApO1xuICAgICAgICBkaXIudmFsdWVBY2Nlc3Nvci5yZWdpc3Rlck9uVG91Y2hlZChub29wKTtcbiAgICB9XG4gICAgY2xlYW5VcFZhbGlkYXRvcnMoY29udHJvbCwgZGlyKTtcbiAgICBpZiAoY29udHJvbCkge1xuICAgICAgICBkaXIuX2ludm9rZU9uRGVzdHJveUNhbGxiYWNrcygpO1xuICAgICAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7IH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UodmFsaWRhdG9ycywgb25DaGFuZ2UpIHtcbiAgICB2YWxpZGF0b3JzLmZvckVhY2goKHZhbGlkYXRvcikgPT4ge1xuICAgICAgICBpZiAodmFsaWRhdG9yLnJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UpXG4gICAgICAgICAgICB2YWxpZGF0b3IucmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShvbkNoYW5nZSk7XG4gICAgfSk7XG59XG4vKipcbiAqIFNldHMgdXAgZGlzYWJsZWQgY2hhbmdlIGhhbmRsZXIgZnVuY3Rpb24gb24gYSBnaXZlbiBmb3JtIGNvbnRyb2wgaWYgQ29udHJvbFZhbHVlQWNjZXNzb3JcbiAqIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIGRpcmVjdGl2ZSBpbnN0YW5jZSBzdXBwb3J0cyB0aGUgYHNldERpc2FibGVkU3RhdGVgIGNhbGwuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIHdoZXJlIGRpc2FibGVkIGNoYW5nZSBoYW5kbGVyIHNob3VsZCBiZSBzZXR1cC5cbiAqIEBwYXJhbSBkaXIgQ29ycmVzcG9uZGluZyBkaXJlY3RpdmUgaW5zdGFuY2UgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29udHJvbC5cbiAqL1xuZnVuY3Rpb24gc2V0VXBEaXNhYmxlZENoYW5nZUhhbmRsZXIoY29udHJvbCwgZGlyKSB7XG4gICAgaWYgKGRpci52YWx1ZUFjY2Vzc29yLnNldERpc2FibGVkU3RhdGUpIHtcbiAgICAgICAgY29uc3Qgb25EaXNhYmxlZENoYW5nZSA9IChpc0Rpc2FibGVkKSA9PiB7XG4gICAgICAgICAgICBkaXIudmFsdWVBY2Nlc3Nvci5zZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQpO1xuICAgICAgICB9O1xuICAgICAgICBjb250cm9sLnJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShvbkRpc2FibGVkQ2hhbmdlKTtcbiAgICAgICAgLy8gUmVnaXN0ZXIgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjbGVhbnVwIGRpc2FibGVkIGNoYW5nZSBoYW5kbGVyXG4gICAgICAgIC8vIGZyb20gYSBjb250cm9sIGluc3RhbmNlIHdoZW4gYSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLlxuICAgICAgICBkaXIuX3JlZ2lzdGVyT25EZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnRyb2wuX3VucmVnaXN0ZXJPbkRpc2FibGVkQ2hhbmdlKG9uRGlzYWJsZWRDaGFuZ2UpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4vKipcbiAqIFNldHMgdXAgc3luYyBhbmQgYXN5bmMgZGlyZWN0aXZlIHZhbGlkYXRvcnMgb24gcHJvdmlkZWQgZm9ybSBjb250cm9sLlxuICogVGhpcyBmdW5jdGlvbiBtZXJnZXMgdmFsaWRhdG9ycyBmcm9tIHRoZSBkaXJlY3RpdmUgaW50byB0aGUgdmFsaWRhdG9ycyBvZiB0aGUgY29udHJvbC5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgd2hlcmUgZGlyZWN0aXZlIHZhbGlkYXRvcnMgc2hvdWxkIGJlIHNldHVwLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgaW5zdGFuY2UgdGhhdCBjb250YWlucyB2YWxpZGF0b3JzIHRvIGJlIHNldHVwLlxuICovXG5mdW5jdGlvbiBzZXRVcFZhbGlkYXRvcnMoY29udHJvbCwgZGlyKSB7XG4gICAgY29uc3QgdmFsaWRhdG9ycyA9IGdldENvbnRyb2xWYWxpZGF0b3JzKGNvbnRyb2wpO1xuICAgIGlmIChkaXIudmFsaWRhdG9yICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnRyb2wuc2V0VmFsaWRhdG9ycyhtZXJnZVZhbGlkYXRvcnModmFsaWRhdG9ycywgZGlyLnZhbGlkYXRvcikpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdmFsaWRhdG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBJZiBzeW5jIHZhbGlkYXRvcnMgYXJlIHJlcHJlc2VudGVkIGJ5IGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvbiwgd2UgZm9yY2UgdGhlXG4gICAgICAgIC8vIGBWYWxpZGF0b3JzLmNvbXBvc2VgIGNhbGwgdG8gaGFwcGVuIGJ5IGV4ZWN1dGluZyB0aGUgYHNldFZhbGlkYXRvcnNgIGZ1bmN0aW9uIHdpdGhcbiAgICAgICAgLy8gYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGF0IGZ1bmN0aW9uLiBXZSBuZWVkIHRoaXMgdG8gYXZvaWQgcG9zc2libGUgZGlzY3JlcGFuY2llcyBpblxuICAgICAgICAvLyB2YWxpZGF0b3JzIGJlaGF2aW9yLCBzbyBzeW5jIHZhbGlkYXRvcnMgYXJlIGFsd2F5cyBwcm9jZXNzZWQgYnkgdGhlIGBWYWxpZGF0b3JzLmNvbXBvc2VgLlxuICAgICAgICAvLyBOb3RlOiB3ZSBzaG91bGQgY29uc2lkZXIgbW92aW5nIHRoaXMgbG9naWMgaW5zaWRlIHRoZSBgc2V0VmFsaWRhdG9yc2AgZnVuY3Rpb24gaXRzZWxmLCBzbyB3ZVxuICAgICAgICAvLyBoYXZlIGNvbnNpc3RlbnQgYmVoYXZpb3Igb24gQWJzdHJhY3RDb250cm9sIEFQSSBsZXZlbC4gVGhlIHNhbWUgYXBwbGllcyB0byB0aGUgYXN5bmNcbiAgICAgICAgLy8gdmFsaWRhdG9ycyBsb2dpYyBiZWxvdy5cbiAgICAgICAgY29udHJvbC5zZXRWYWxpZGF0b3JzKFt2YWxpZGF0b3JzXSk7XG4gICAgfVxuICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9ycyA9IGdldENvbnRyb2xBc3luY1ZhbGlkYXRvcnMoY29udHJvbCk7XG4gICAgaWYgKGRpci5hc3luY1ZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgICAgICBjb250cm9sLnNldEFzeW5jVmFsaWRhdG9ycyhtZXJnZVZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzLCBkaXIuYXN5bmNWYWxpZGF0b3IpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGFzeW5jVmFsaWRhdG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb250cm9sLnNldEFzeW5jVmFsaWRhdG9ycyhbYXN5bmNWYWxpZGF0b3JzXSk7XG4gICAgfVxuICAgIC8vIFJlLXJ1biB2YWxpZGF0aW9uIHdoZW4gdmFsaWRhdG9yIGJpbmRpbmcgY2hhbmdlcywgZS5nLiBtaW5sZW5ndGg9MyAtPiBtaW5sZW5ndGg9NFxuICAgIGNvbnN0IG9uVmFsaWRhdG9yQ2hhbmdlID0gKCkgPT4gY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShkaXIuX3Jhd1ZhbGlkYXRvcnMsIG9uVmFsaWRhdG9yQ2hhbmdlKTtcbiAgICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGRpci5fcmF3QXN5bmNWYWxpZGF0b3JzLCBvblZhbGlkYXRvckNoYW5nZSk7XG59XG4vKipcbiAqIENsZWFucyB1cCBzeW5jIGFuZCBhc3luYyBkaXJlY3RpdmUgdmFsaWRhdG9ycyBvbiBwcm92aWRlZCBmb3JtIGNvbnRyb2wuXG4gKiBUaGlzIGZ1bmN0aW9uIHJldmVydHMgdGhlIHNldHVwIHBlcmZvcm1lZCBieSB0aGUgYHNldFVwVmFsaWRhdG9yc2AgZnVuY3Rpb24sIGkuZS5cbiAqIHJlbW92ZXMgZGlyZWN0aXZlLXNwZWNpZmljIHZhbGlkYXRvcnMgZnJvbSBhIGdpdmVuIGNvbnRyb2wgaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIGZyb20gd2hlcmUgZGlyZWN0aXZlIHZhbGlkYXRvcnMgc2hvdWxkIGJlIHJlbW92ZWQuXG4gKiBAcGFyYW0gZGlyIERpcmVjdGl2ZSBpbnN0YW5jZSB0aGF0IGNvbnRhaW5zIHZhbGlkYXRvcnMgdG8gYmUgcmVtb3ZlZC5cbiAqIEByZXR1cm5zIHRydWUgaWYgYSBjb250cm9sIHdhcyB1cGRhdGVkIGFzIGEgcmVzdWx0IG9mIHRoaXMgYWN0aW9uLlxuICovXG5mdW5jdGlvbiBjbGVhblVwVmFsaWRhdG9ycyhjb250cm9sLCBkaXIpIHtcbiAgICBsZXQgaXNDb250cm9sVXBkYXRlZCA9IGZhbHNlO1xuICAgIGlmIChjb250cm9sICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChkaXIudmFsaWRhdG9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCB2YWxpZGF0b3JzID0gZ2V0Q29udHJvbFZhbGlkYXRvcnMoY29udHJvbCk7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JzKSAmJiB2YWxpZGF0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGRpcmVjdGl2ZSB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcigodmFsaWRhdG9yKSA9PiB2YWxpZGF0b3IgIT09IGRpci52YWxpZGF0b3IpO1xuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVkVmFsaWRhdG9ycy5sZW5ndGggIT09IHZhbGlkYXRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ29udHJvbFVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sLnNldFZhbGlkYXRvcnModXBkYXRlZFZhbGlkYXRvcnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyLmFzeW5jVmFsaWRhdG9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBhc3luY1ZhbGlkYXRvcnMgPSBnZXRDb250cm9sQXN5bmNWYWxpZGF0b3JzKGNvbnRyb2wpO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXN5bmNWYWxpZGF0b3JzKSAmJiBhc3luY1ZhbGlkYXRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIEZpbHRlciBvdXQgZGlyZWN0aXZlIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVkQXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3JzLmZpbHRlcigoYXN5bmNWYWxpZGF0b3IpID0+IGFzeW5jVmFsaWRhdG9yICE9PSBkaXIuYXN5bmNWYWxpZGF0b3IpO1xuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVkQXN5bmNWYWxpZGF0b3JzLmxlbmd0aCAhPT0gYXN5bmNWYWxpZGF0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpc0NvbnRyb2xVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbC5zZXRBc3luY1ZhbGlkYXRvcnModXBkYXRlZEFzeW5jVmFsaWRhdG9ycyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIENsZWFyIG9uVmFsaWRhdG9yQ2hhbmdlIGNhbGxiYWNrcyBieSBwcm92aWRpbmcgYSBub29wIGZ1bmN0aW9uLlxuICAgIGNvbnN0IG5vb3AgPSAoKSA9PiB7IH07XG4gICAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShkaXIuX3Jhd1ZhbGlkYXRvcnMsIG5vb3ApO1xuICAgIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZGlyLl9yYXdBc3luY1ZhbGlkYXRvcnMsIG5vb3ApO1xuICAgIHJldHVybiBpc0NvbnRyb2xVcGRhdGVkO1xufVxuZnVuY3Rpb24gc2V0VXBWaWV3Q2hhbmdlUGlwZWxpbmUoY29udHJvbCwgZGlyKSB7XG4gICAgZGlyLnZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPbkNoYW5nZSgobmV3VmFsdWUpID0+IHtcbiAgICAgICAgY29udHJvbC5fcGVuZGluZ1ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UgPSB0cnVlO1xuICAgICAgICBjb250cm9sLl9wZW5kaW5nRGlydHkgPSB0cnVlO1xuICAgICAgICBpZiAoY29udHJvbC51cGRhdGVPbiA9PT0gJ2NoYW5nZScpXG4gICAgICAgICAgICB1cGRhdGVDb250cm9sKGNvbnRyb2wsIGRpcik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBzZXRVcEJsdXJQaXBlbGluZShjb250cm9sLCBkaXIpIHtcbiAgICBkaXIudmFsdWVBY2Nlc3Nvci5yZWdpc3Rlck9uVG91Y2hlZCgoKSA9PiB7XG4gICAgICAgIGNvbnRyb2wuX3BlbmRpbmdUb3VjaGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGNvbnRyb2wudXBkYXRlT24gPT09ICdibHVyJyAmJiBjb250cm9sLl9wZW5kaW5nQ2hhbmdlKVxuICAgICAgICAgICAgdXBkYXRlQ29udHJvbChjb250cm9sLCBkaXIpO1xuICAgICAgICBpZiAoY29udHJvbC51cGRhdGVPbiAhPT0gJ3N1Ym1pdCcpXG4gICAgICAgICAgICBjb250cm9sLm1hcmtBc1RvdWNoZWQoKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNvbnRyb2woY29udHJvbCwgZGlyKSB7XG4gICAgaWYgKGNvbnRyb2wuX3BlbmRpbmdEaXJ0eSlcbiAgICAgICAgY29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgIGNvbnRyb2wuc2V0VmFsdWUoY29udHJvbC5fcGVuZGluZ1ZhbHVlLCB7IGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UgfSk7XG4gICAgZGlyLnZpZXdUb01vZGVsVXBkYXRlKGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSk7XG4gICAgY29udHJvbC5fcGVuZGluZ0NoYW5nZSA9IGZhbHNlO1xufVxuZnVuY3Rpb24gc2V0VXBNb2RlbENoYW5nZVBpcGVsaW5lKGNvbnRyb2wsIGRpcikge1xuICAgIGNvbnN0IG9uQ2hhbmdlID0gKG5ld1ZhbHVlLCBlbWl0TW9kZWxFdmVudCkgPT4ge1xuICAgICAgICAvLyBjb250cm9sIC0+IHZpZXdcbiAgICAgICAgZGlyLnZhbHVlQWNjZXNzb3Iud3JpdGVWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICAgIC8vIGNvbnRyb2wgLT4gbmdNb2RlbFxuICAgICAgICBpZiAoZW1pdE1vZGVsRXZlbnQpXG4gICAgICAgICAgICBkaXIudmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWUpO1xuICAgIH07XG4gICAgY29udHJvbC5yZWdpc3Rlck9uQ2hhbmdlKG9uQ2hhbmdlKTtcbiAgICAvLyBSZWdpc3RlciBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGNsZWFudXAgb25DaGFuZ2UgaGFuZGxlclxuICAgIC8vIGZyb20gYSBjb250cm9sIGluc3RhbmNlIHdoZW4gYSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLlxuICAgIGRpci5fcmVnaXN0ZXJPbkRlc3Ryb3koKCkgPT4ge1xuICAgICAgICBjb250cm9sLl91bnJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2UpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBMaW5rcyBhIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgaW5zdGFuY2UgYW5kIGNvcnJlc3BvbmRpbmcgRm9ybSBkaXJlY3RpdmUgYnkgc2V0dGluZyB1cCB2YWxpZGF0b3JzXG4gKiBwcmVzZW50IGluIHRoZSB2aWV3LlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgbGlua2VkLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgdGhhdCBwcm92aWRlcyB2aWV3IHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIHNldFVwRm9ybUNvbnRhaW5lcihjb250cm9sLCBkaXIpIHtcbiAgICBpZiAoY29udHJvbCA9PSBudWxsICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKVxuICAgICAgICBfdGhyb3dFcnJvcihkaXIsICdDYW5ub3QgZmluZCBjb250cm9sIHdpdGgnKTtcbiAgICBzZXRVcFZhbGlkYXRvcnMoY29udHJvbCwgZGlyKTtcbn1cbi8qKlxuICogUmV2ZXJ0cyB0aGUgc2V0dXAgcGVyZm9ybWVkIGJ5IHRoZSBgc2V0VXBGb3JtQ29udGFpbmVyYCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtR3JvdXAgb3IgRm9ybUFycmF5IGluc3RhbmNlIHRoYXQgc2hvdWxkIGJlIGNsZWFuZWQgdXAuXG4gKiBAcGFyYW0gZGlyIERpcmVjdGl2ZSB0aGF0IHByb3ZpZGVkIHZpZXcgdmFsaWRhdG9ycy5cbiAqIEByZXR1cm5zIHRydWUgaWYgYSBjb250cm9sIHdhcyB1cGRhdGVkIGFzIGEgcmVzdWx0IG9mIHRoaXMgYWN0aW9uLlxuICovXG5mdW5jdGlvbiBjbGVhblVwRm9ybUNvbnRhaW5lcihjb250cm9sLCBkaXIpIHtcbiAgICByZXR1cm4gY2xlYW5VcFZhbGlkYXRvcnMoY29udHJvbCwgZGlyKTtcbn1cbmZ1bmN0aW9uIF9ub0NvbnRyb2xFcnJvcihkaXIpIHtcbiAgICByZXR1cm4gX3Rocm93RXJyb3IoZGlyLCAnVGhlcmUgaXMgbm8gRm9ybUNvbnRyb2wgaW5zdGFuY2UgYXR0YWNoZWQgdG8gZm9ybSBjb250cm9sIGVsZW1lbnQgd2l0aCcpO1xufVxuZnVuY3Rpb24gX3Rocm93RXJyb3IoZGlyLCBtZXNzYWdlKSB7XG4gICAgY29uc3QgbWVzc2FnZUVuZCA9IF9kZXNjcmliZUNvbnRyb2xMb2NhdGlvbihkaXIpO1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttZXNzYWdlfSAke21lc3NhZ2VFbmR9YCk7XG59XG5mdW5jdGlvbiBfZGVzY3JpYmVDb250cm9sTG9jYXRpb24oZGlyKSB7XG4gICAgY29uc3QgcGF0aCA9IGRpci5wYXRoO1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoID4gMSlcbiAgICAgICAgcmV0dXJuIGBwYXRoOiAnJHtwYXRoLmpvaW4oJyAtPiAnKX0nYDtcbiAgICBpZiAocGF0aD8uWzBdKVxuICAgICAgICByZXR1cm4gYG5hbWU6ICcke3BhdGh9J2A7XG4gICAgcmV0dXJuICd1bnNwZWNpZmllZCBuYW1lIGF0dHJpYnV0ZSc7XG59XG5mdW5jdGlvbiBfdGhyb3dNaXNzaW5nVmFsdWVBY2Nlc3NvckVycm9yKGRpcikge1xuICAgIGNvbnN0IGxvYyA9IF9kZXNjcmliZUNvbnRyb2xMb2NhdGlvbihkaXIpO1xuICAgIHRocm93IG5ldyDJtVJ1bnRpbWVFcnJvcigtMTIwMyAvKiBSdW50aW1lRXJyb3JDb2RlLk5HX01JU1NJTkdfVkFMVUVfQUNDRVNTT1IgKi8sIGBObyB2YWx1ZSBhY2Nlc3NvciBmb3IgZm9ybSBjb250cm9sICR7bG9jfS5gKTtcbn1cbmZ1bmN0aW9uIF90aHJvd0ludmFsaWRWYWx1ZUFjY2Vzc29yRXJyb3IoZGlyKSB7XG4gICAgY29uc3QgbG9jID0gX2Rlc2NyaWJlQ29udHJvbExvY2F0aW9uKGRpcik7XG4gICAgdGhyb3cgbmV3IMm1UnVudGltZUVycm9yKDEyMDAgLyogUnVudGltZUVycm9yQ29kZS5OR19WQUxVRV9BQ0NFU1NPUl9OT1RfUFJPVklERUQgKi8sIGBWYWx1ZSBhY2Nlc3NvciB3YXMgbm90IHByb3ZpZGVkIGFzIGFuIGFycmF5IGZvciBmb3JtIGNvbnRyb2wgd2l0aCAke2xvY30uIGAgK1xuICAgICAgICBgQ2hlY2sgdGhhdCB0aGUgXFxgTkdfVkFMVUVfQUNDRVNTT1JcXGAgdG9rZW4gaXMgY29uZmlndXJlZCBhcyBhIFxcYG11bHRpOiB0cnVlXFxgIHByb3ZpZGVyLmApO1xufVxuZnVuY3Rpb24gaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdmlld01vZGVsKSB7XG4gICAgaWYgKCFjaGFuZ2VzLmhhc093blByb3BlcnR5KCdtb2RlbCcpKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgY2hhbmdlID0gY2hhbmdlc1snbW9kZWwnXTtcbiAgICBpZiAoY2hhbmdlLmlzRmlyc3RDaGFuZ2UoKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuICFPYmplY3QuaXModmlld01vZGVsLCBjaGFuZ2UuY3VycmVudFZhbHVlKTtcbn1cbmZ1bmN0aW9uIGlzQnVpbHRJbkFjY2Vzc29yKHZhbHVlQWNjZXNzb3IpIHtcbiAgICAvLyBDaGVjayBpZiBhIGdpdmVuIHZhbHVlIGFjY2Vzc29yIGlzIGFuIGluc3RhbmNlIG9mIGEgY2xhc3MgdGhhdCBkaXJlY3RseSBleHRlbmRzXG4gICAgLy8gYEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvcmAgb25lLlxuICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWVBY2Nlc3Nvci5jb25zdHJ1Y3RvcikgPT09IEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3Nvcjtcbn1cbmZ1bmN0aW9uIHN5bmNQZW5kaW5nQ29udHJvbHMoZm9ybSwgZGlyZWN0aXZlcykge1xuICAgIGZvcm0uX3N5bmNQZW5kaW5nQ29udHJvbHMoKTtcbiAgICBkaXJlY3RpdmVzLmZvckVhY2goKGRpcikgPT4ge1xuICAgICAgICBjb25zdCBjb250cm9sID0gZGlyLmNvbnRyb2w7XG4gICAgICAgIGlmIChjb250cm9sLnVwZGF0ZU9uID09PSAnc3VibWl0JyAmJiBjb250cm9sLl9wZW5kaW5nQ2hhbmdlKSB7XG4gICAgICAgICAgICBkaXIudmlld1RvTW9kZWxVcGRhdGUoY29udHJvbC5fcGVuZGluZ1ZhbHVlKTtcbiAgICAgICAgICAgIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8gVE9ETzogdnNhdmtpbiByZW1vdmUgaXQgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zMDExIGlzIGltcGxlbWVudGVkXG5mdW5jdGlvbiBzZWxlY3RWYWx1ZUFjY2Vzc29yKGRpciwgdmFsdWVBY2Nlc3NvcnMpIHtcbiAgICBpZiAoIXZhbHVlQWNjZXNzb3JzKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVBY2Nlc3NvcnMpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKVxuICAgICAgICBfdGhyb3dJbnZhbGlkVmFsdWVBY2Nlc3NvckVycm9yKGRpcik7XG4gICAgbGV0IGRlZmF1bHRBY2Nlc3NvciA9IHVuZGVmaW5lZDtcbiAgICBsZXQgYnVpbHRpbkFjY2Vzc29yID0gdW5kZWZpbmVkO1xuICAgIGxldCBjdXN0b21BY2Nlc3NvciA9IHVuZGVmaW5lZDtcbiAgICB2YWx1ZUFjY2Vzc29ycy5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgIGlmICh2LmNvbnN0cnVjdG9yID09PSBEZWZhdWx0VmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICAgICAgZGVmYXVsdEFjY2Vzc29yID0gdjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc0J1aWx0SW5BY2Nlc3Nvcih2KSkge1xuICAgICAgICAgICAgaWYgKGJ1aWx0aW5BY2Nlc3NvciAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICAgICAgICAgICAgICBfdGhyb3dFcnJvcihkaXIsICdNb3JlIHRoYW4gb25lIGJ1aWx0LWluIHZhbHVlIGFjY2Vzc29yIG1hdGNoZXMgZm9ybSBjb250cm9sIHdpdGgnKTtcbiAgICAgICAgICAgIGJ1aWx0aW5BY2Nlc3NvciA9IHY7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY3VzdG9tQWNjZXNzb3IgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpXG4gICAgICAgICAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnTW9yZSB0aGFuIG9uZSBjdXN0b20gdmFsdWUgYWNjZXNzb3IgbWF0Y2hlcyBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICAgICAgICAgICAgY3VzdG9tQWNjZXNzb3IgPSB2O1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGN1c3RvbUFjY2Vzc29yKVxuICAgICAgICByZXR1cm4gY3VzdG9tQWNjZXNzb3I7XG4gICAgaWYgKGJ1aWx0aW5BY2Nlc3NvcilcbiAgICAgICAgcmV0dXJuIGJ1aWx0aW5BY2Nlc3NvcjtcbiAgICBpZiAoZGVmYXVsdEFjY2Vzc29yKVxuICAgICAgICByZXR1cm4gZGVmYXVsdEFjY2Vzc29yO1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnTm8gdmFsaWQgdmFsdWUgYWNjZXNzb3IgZm9yIGZvcm0gY29udHJvbCB3aXRoJyk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcmVtb3ZlTGlzdEl0ZW0kMShsaXN0LCBlbCkge1xuICAgIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKGVsKTtcbiAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xufVxuLy8gVE9ETyhrYXJhKTogcmVtb3ZlIGFmdGVyIGRlcHJlY2F0aW9uIHBlcmlvZFxuZnVuY3Rpb24gX25nTW9kZWxXYXJuaW5nKG5hbWUsIHR5cGUsIGluc3RhbmNlLCB3YXJuaW5nQ29uZmlnKSB7XG4gICAgaWYgKHdhcm5pbmdDb25maWcgPT09ICduZXZlcicpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAoKCh3YXJuaW5nQ29uZmlnID09PSBudWxsIHx8IHdhcm5pbmdDb25maWcgPT09ICdvbmNlJykgJiYgIXR5cGUuX25nTW9kZWxXYXJuaW5nU2VudE9uY2UpIHx8XG4gICAgICAgICh3YXJuaW5nQ29uZmlnID09PSAnYWx3YXlzJyAmJiAhaW5zdGFuY2UuX25nTW9kZWxXYXJuaW5nU2VudCkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKG5nTW9kZWxXYXJuaW5nKG5hbWUpKTtcbiAgICAgICAgdHlwZS5fbmdNb2RlbFdhcm5pbmdTZW50T25jZSA9IHRydWU7XG4gICAgICAgIGluc3RhbmNlLl9uZ01vZGVsV2FybmluZ1NlbnQgPSB0cnVlO1xuICAgIH1cbn1cblxuY29uc3QgZm9ybURpcmVjdGl2ZVByb3ZpZGVyJDEgPSB7XG4gICAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ0Zvcm0pXG59O1xuY29uc3QgcmVzb2x2ZWRQcm9taXNlJDEgPSAoKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCkpKCk7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIHRvcC1sZXZlbCBgRm9ybUdyb3VwYCBpbnN0YW5jZSBhbmQgYmluZHMgaXQgdG8gYSBmb3JtXG4gKiB0byB0cmFjayBhZ2dyZWdhdGUgZm9ybSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0dXMuXG4gKlxuICogQXMgc29vbiBhcyB5b3UgaW1wb3J0IHRoZSBgRm9ybXNNb2R1bGVgLCB0aGlzIGRpcmVjdGl2ZSBiZWNvbWVzIGFjdGl2ZSBieSBkZWZhdWx0IG9uXG4gKiBhbGwgYDxmb3JtPmAgdGFncy4gIFlvdSBkb24ndCBuZWVkIHRvIGFkZCBhIHNwZWNpYWwgc2VsZWN0b3IuXG4gKlxuICogWW91IG9wdGlvbmFsbHkgZXhwb3J0IHRoZSBkaXJlY3RpdmUgaW50byBhIGxvY2FsIHRlbXBsYXRlIHZhcmlhYmxlIHVzaW5nIGBuZ0Zvcm1gIGFzIHRoZSBrZXlcbiAqIChleDogYCNteUZvcm09XCJuZ0Zvcm1cImApLiBUaGlzIGlzIG9wdGlvbmFsLCBidXQgdXNlZnVsLiAgTWFueSBwcm9wZXJ0aWVzIGZyb20gdGhlIHVuZGVybHlpbmdcbiAqIGBGb3JtR3JvdXBgIGluc3RhbmNlIGFyZSBkdXBsaWNhdGVkIG9uIHRoZSBkaXJlY3RpdmUgaXRzZWxmLCBzbyBhIHJlZmVyZW5jZSB0byBpdFxuICogZ2l2ZXMgeW91IGFjY2VzcyB0byB0aGUgYWdncmVnYXRlIHZhbHVlIGFuZCB2YWxpZGl0eSBzdGF0dXMgb2YgdGhlIGZvcm0sIGFzIHdlbGwgYXNcbiAqIHVzZXIgaW50ZXJhY3Rpb24gcHJvcGVydGllcyBsaWtlIGBkaXJ0eWAgYW5kIGB0b3VjaGVkYC5cbiAqXG4gKiBUbyByZWdpc3RlciBjaGlsZCBjb250cm9scyB3aXRoIHRoZSBmb3JtLCB1c2UgYE5nTW9kZWxgIHdpdGggYSBgbmFtZWBcbiAqIGF0dHJpYnV0ZS4gWW91IG1heSB1c2UgYE5nTW9kZWxHcm91cGAgdG8gY3JlYXRlIHN1Yi1ncm91cHMgd2l0aGluIHRoZSBmb3JtLlxuICpcbiAqIElmIG5lY2Vzc2FyeSwgbGlzdGVuIHRvIHRoZSBkaXJlY3RpdmUncyBgbmdTdWJtaXRgIGV2ZW50IHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIHVzZXIgaGFzXG4gKiB0cmlnZ2VyZWQgYSBmb3JtIHN1Ym1pc3Npb24uIFRoZSBgbmdTdWJtaXRgIGV2ZW50IGVtaXRzIHRoZSBvcmlnaW5hbCBmb3JtXG4gKiBzdWJtaXNzaW9uIGV2ZW50LlxuICpcbiAqIEluIHRlbXBsYXRlIGRyaXZlbiBmb3JtcywgYWxsIGA8Zm9ybT5gIHRhZ3MgYXJlIGF1dG9tYXRpY2FsbHkgdGFnZ2VkIGFzIGBOZ0Zvcm1gLlxuICogVG8gaW1wb3J0IHRoZSBgRm9ybXNNb2R1bGVgIGJ1dCBza2lwIGl0cyB1c2FnZSBpbiBzb21lIGZvcm1zLFxuICogZm9yIGV4YW1wbGUsIHRvIHVzZSBuYXRpdmUgSFRNTDUgdmFsaWRhdGlvbiwgYWRkIHRoZSBgbmdOb0Zvcm1gIGFuZCB0aGUgYDxmb3JtPmBcbiAqIHRhZ3Mgd29uJ3QgY3JlYXRlIGFuIGBOZ0Zvcm1gIGRpcmVjdGl2ZS4gSW4gcmVhY3RpdmUgZm9ybXMsIHVzaW5nIGBuZ05vRm9ybWAgaXNcbiAqIHVubmVjZXNzYXJ5IGJlY2F1c2UgdGhlIGA8Zm9ybT5gIHRhZ3MgYXJlIGluZXJ0LiBJbiB0aGF0IGNhc2UsIHlvdSB3b3VsZFxuICogcmVmcmFpbiBmcm9tIHVzaW5nIHRoZSBgZm9ybUdyb3VwYCBkaXJlY3RpdmUuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgTGlzdGVuaW5nIGZvciBmb3JtIHN1Ym1pc3Npb25cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGNhcHR1cmUgdGhlIGZvcm0gdmFsdWVzIGZyb20gdGhlIFwibmdTdWJtaXRcIiBldmVudC5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybS9zaW1wbGVfZm9ybV9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiAjIyMgU2V0dGluZyB0aGUgdXBkYXRlIG9wdGlvbnNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgeW91IGhvdyB0byBjaGFuZ2UgdGhlIFwidXBkYXRlT25cIiBvcHRpb24gZnJvbSBpdHMgZGVmYXVsdCB1c2luZ1xuICogbmdGb3JtT3B0aW9ucy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8Zm9ybSBbbmdGb3JtT3B0aW9uc109XCJ7dXBkYXRlT246ICdibHVyJ31cIj5cbiAqICAgIDxpbnB1dCBuYW1lPVwib25lXCIgbmdNb2RlbD4gIDwhLS0gdGhpcyBuZ01vZGVsIHdpbGwgdXBkYXRlIG9uIGJsdXIgLS0+XG4gKiA8L2Zvcm0+XG4gKiBgYGBcbiAqXG4gKiAjIyMgTmF0aXZlIERPTSB2YWxpZGF0aW9uIFVJXG4gKlxuICogSW4gb3JkZXIgdG8gcHJldmVudCB0aGUgbmF0aXZlIERPTSBmb3JtIHZhbGlkYXRpb24gVUkgZnJvbSBpbnRlcmZlcmluZyB3aXRoIEFuZ3VsYXIncyBmb3JtXG4gKiB2YWxpZGF0aW9uLCBBbmd1bGFyIGF1dG9tYXRpY2FsbHkgYWRkcyB0aGUgYG5vdmFsaWRhdGVgIGF0dHJpYnV0ZSBvbiBhbnkgYDxmb3JtPmAgd2hlbmV2ZXJcbiAqIGBGb3JtTW9kdWxlYCBvciBgUmVhY3RpdmVGb3JtTW9kdWxlYCBhcmUgaW1wb3J0ZWQgaW50byB0aGUgYXBwbGljYXRpb24uXG4gKiBJZiB5b3Ugd2FudCB0byBleHBsaWNpdGx5IGVuYWJsZSBuYXRpdmUgRE9NIHZhbGlkYXRpb24gVUkgd2l0aCBBbmd1bGFyIGZvcm1zLCB5b3UgY2FuIGFkZCB0aGVcbiAqIGBuZ05hdGl2ZVZhbGlkYXRlYCBhdHRyaWJ1dGUgdG8gdGhlIGA8Zm9ybT5gIGVsZW1lbnQ6XG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0gbmdOYXRpdmVWYWxpZGF0ZT5cbiAqICAgLi4uXG4gKiA8L2Zvcm0+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTmdGb3JtIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciB7XG4gICAgY29uc3RydWN0b3IodmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzLCBjYWxsU2V0RGlzYWJsZWRTdGF0ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNhbGxTZXREaXNhYmxlZFN0YXRlID0gY2FsbFNldERpc2FibGVkU3RhdGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBmb3JtIHN1Ym1pc3Npb24gaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZGlyZWN0aXZlcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBFdmVudCBlbWl0dGVyIGZvciB0aGUgXCJuZ1N1Ym1pdFwiIGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5nU3VibWl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmZvcm0gPVxuICAgICAgICAgICAgbmV3IEZvcm1Hcm91cCh7fSwgY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9ycyksIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKSk7XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0IGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgaW50ZXJuYWwgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0IGNvbnRyb2woKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoaXMgZ3JvdXAuIEJlY2F1c2UgdGhpcyBkaXJlY3RpdmVcbiAgICAgKiBhbHdheXMgbGl2ZXMgYXQgdGhlIHRvcCBsZXZlbCBvZiBhIGZvcm0sIGl0IGlzIGFsd2F5cyBhbiBlbXB0eSBhcnJheS5cbiAgICAgKi9cbiAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXR1cm5zIGEgbWFwIG9mIHRoZSBjb250cm9scyBpbiB0aGlzIGdyb3VwLlxuICAgICAqL1xuICAgIGdldCBjb250cm9scygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybS5jb250cm9scztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogTWV0aG9kIHRoYXQgc2V0cyB1cCB0aGUgY29udHJvbCBkaXJlY3RpdmUgaW4gdGhpcyBncm91cCwgcmUtY2FsY3VsYXRlcyBpdHMgdmFsdWVcbiAgICAgKiBhbmQgdmFsaWRpdHksIGFuZCBhZGRzIHRoZSBpbnN0YW5jZSB0byB0aGUgaW50ZXJuYWwgbGlzdCBvZiBkaXJlY3RpdmVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBhZGRDb250cm9sKGRpcikge1xuICAgICAgICByZXNvbHZlZFByb21pc2UkMS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgICAgICAgZGlyLmNvbnRyb2wgPVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5yZWdpc3RlckNvbnRyb2woZGlyLm5hbWUsIGRpci5jb250cm9sKTtcbiAgICAgICAgICAgIHNldFVwQ29udHJvbChkaXIuY29udHJvbCwgZGlyLCB0aGlzLmNhbGxTZXREaXNhYmxlZFN0YXRlKTtcbiAgICAgICAgICAgIGRpci5jb250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aXZlcy5hZGQoZGlyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHJpZXZlcyB0aGUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSBmcm9tIHRoZSBwcm92aWRlZCBgTmdNb2RlbGAgZGlyZWN0aXZlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBnZXRDb250cm9sKGRpcikge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlbW92ZXMgdGhlIGBOZ01vZGVsYCBpbnN0YW5jZSBmcm9tIHRoZSBpbnRlcm5hbCBsaXN0IG9mIGRpcmVjdGl2ZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgcmVtb3ZlQ29udHJvbChkaXIpIHtcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlJDEudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ29udHJvbChkaXIubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3RpdmVzLmRlbGV0ZShkaXIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQWRkcyBhIG5ldyBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UgdG8gdGhlIGZvcm0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgYWRkRm9ybUdyb3VwKGRpcikge1xuICAgICAgICByZXNvbHZlZFByb21pc2UkMS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSBuZXcgRm9ybUdyb3VwKHt9KTtcbiAgICAgICAgICAgIHNldFVwRm9ybUNvbnRhaW5lcihncm91cCwgZGlyKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5yZWdpc3RlckNvbnRyb2woZGlyLm5hbWUsIGdyb3VwKTtcbiAgICAgICAgICAgIGdyb3VwLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVtb3ZlcyB0aGUgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlIGZyb20gdGhlIGZvcm0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgcmVtb3ZlRm9ybUdyb3VwKGRpcikge1xuICAgICAgICByZXNvbHZlZFByb21pc2UkMS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDb250cm9sKGRpci5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHJpZXZlcyB0aGUgYEZvcm1Hcm91cGAgZm9yIGEgcHJvdmlkZWQgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0Rm9ybUdyb3VwKGRpcikge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHByb3ZpZGVkIGBOZ0NvbnRyb2xgIGRpcmVjdGl2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBOZ0NvbnRyb2xgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGRpcmVjdGl2ZSdzIGNvbnRyb2wuXG4gICAgICovXG4gICAgdXBkYXRlTW9kZWwoZGlyLCB2YWx1ZSkge1xuICAgICAgICByZXNvbHZlZFByb21pc2UkMS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICAgICAgICAgIGN0cmwuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoaXMgYEZvcm1Hcm91cGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZVxuICAgICAqL1xuICAgIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgXCJzdWJtaXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAgICogVHJpZ2dlcnMgdGhlIGBuZ1N1Ym1pdGAgZW1pdHRlciB0byBlbWl0IHRoZSBcInN1Ym1pdFwiIGV2ZW50IGFzIGl0cyBwYXlsb2FkLlxuICAgICAqXG4gICAgICogQHBhcmFtICRldmVudCBUaGUgXCJzdWJtaXRcIiBldmVudCBvYmplY3RcbiAgICAgKi9cbiAgICBvblN1Ym1pdCgkZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzeW5jUGVuZGluZ0NvbnRyb2xzKHRoaXMuZm9ybSwgdGhpcy5fZGlyZWN0aXZlcyk7XG4gICAgICAgIHRoaXMubmdTdWJtaXQuZW1pdCgkZXZlbnQpO1xuICAgICAgICAvLyBGb3JtcyB3aXRoIGBtZXRob2Q9XCJkaWFsb2dcImAgaGF2ZSBzb21lIHNwZWNpYWwgYmVoYXZpb3JcbiAgICAgICAgLy8gdGhhdCB3b24ndCByZWxvYWQgdGhlIHBhZ2UgYW5kIHRoYXQgc2hvdWxkbid0IGJlIHByZXZlbnRlZC5cbiAgICAgICAgcmV0dXJuICRldmVudD8udGFyZ2V0Py5tZXRob2QgPT09ICdkaWFsb2cnO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIFwicmVzZXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAgICovXG4gICAgb25SZXNldCgpIHtcbiAgICAgICAgdGhpcy5yZXNldEZvcm0oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVzZXRzIHRoZSBmb3JtIHRvIGFuIGluaXRpYWwgdmFsdWUgYW5kIHJlc2V0cyBpdHMgc3VibWl0dGVkIHN0YXR1cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZm9ybS5cbiAgICAgKi9cbiAgICByZXNldEZvcm0odmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5mb3JtLnJlc2V0KHZhbHVlKTtcbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgX3NldFVwZGF0ZVN0cmF0ZWd5KCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy51cGRhdGVPbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm0uX3VwZGF0ZU9uID0gdGhpcy5vcHRpb25zLnVwZGF0ZU9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9maW5kQ29udGFpbmVyKHBhdGgpIHtcbiAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgcmV0dXJuIHBhdGgubGVuZ3RoID8gdGhpcy5mb3JtLmdldChwYXRoKSA6IHRoaXMuZm9ybTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTmdGb3JtLCBkZXBzOiBbeyB0b2tlbjogTkdfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfQVNZTkNfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogQ0FMTF9TRVRfRElTQUJMRURfU1RBVEUsIG9wdGlvbmFsOiB0cnVlIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IE5nRm9ybSwgc2VsZWN0b3I6IFwiZm9ybTpub3QoW25nTm9Gb3JtXSk6bm90KFtmb3JtR3JvdXBdKSxuZy1mb3JtLFtuZ0Zvcm1dXCIsIGlucHV0czogeyBvcHRpb25zOiBbXCJuZ0Zvcm1PcHRpb25zXCIsIFwib3B0aW9uc1wiXSB9LCBvdXRwdXRzOiB7IG5nU3VibWl0OiBcIm5nU3VibWl0XCIgfSwgaG9zdDogeyBsaXN0ZW5lcnM6IHsgXCJzdWJtaXRcIjogXCJvblN1Ym1pdCgkZXZlbnQpXCIsIFwicmVzZXRcIjogXCJvblJlc2V0KClcIiB9IH0sIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlciQxXSwgZXhwb3J0QXM6IFtcIm5nRm9ybVwiXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTmdGb3JtLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdmb3JtOm5vdChbbmdOb0Zvcm1dKTpub3QoW2Zvcm1Hcm91cF0pLG5nLWZvcm0sW25nRm9ybV0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtmb3JtRGlyZWN0aXZlUHJvdmlkZXIkMV0sXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJyhzdWJtaXQpJzogJ29uU3VibWl0KCRldmVudCknLCAnKHJlc2V0KSc6ICdvblJlc2V0KCknIH0sXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IFsnbmdTdWJtaXQnXSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0QXM6ICduZ0Zvcm0nXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfQVNZTkNfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW0NBTExfU0VUX0RJU0FCTEVEX1NUQVRFXVxuICAgICAgICAgICAgICAgIH1dIH1dLCBwcm9wRGVjb3JhdG9yczogeyBvcHRpb25zOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdGb3JtT3B0aW9ucyddXG4gICAgICAgICAgICB9XSB9IH0pO1xuXG5mdW5jdGlvbiByZW1vdmVMaXN0SXRlbShsaXN0LCBlbCkge1xuICAgIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKGVsKTtcbiAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG5mdW5jdGlvbiBpc0Zvcm1Db250cm9sU3RhdGUoZm9ybVN0YXRlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBmb3JtU3RhdGUgPT09ICdvYmplY3QnICYmIGZvcm1TdGF0ZSAhPT0gbnVsbCAmJlxuICAgICAgICBPYmplY3Qua2V5cyhmb3JtU3RhdGUpLmxlbmd0aCA9PT0gMiAmJiAndmFsdWUnIGluIGZvcm1TdGF0ZSAmJiAnZGlzYWJsZWQnIGluIGZvcm1TdGF0ZTtcbn1cbmNvbnN0IEZvcm1Db250cm9sID0gKGNsYXNzIEZvcm1Db250cm9sIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvLyBmb3JtU3RhdGUgYW5kIGRlZmF1bHRWYWx1ZSB3aWxsIG9ubHkgYmUgbnVsbCBpZiBUIGlzIG51bGxhYmxlXG4gICAgZm9ybVN0YXRlID0gbnVsbCwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgICBzdXBlcihwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHMpLCBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICAgICAgLyoqIEBwdWJsaWNBcGkgKi9cbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBudWxsO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX29uQ2hhbmdlID0gW107XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fcGVuZGluZ0NoYW5nZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hcHBseUZvcm1TdGF0ZShmb3JtU3RhdGUpO1xuICAgICAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgICAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtcbiAgICAgICAgICAgIG9ubHlTZWxmOiB0cnVlLFxuICAgICAgICAgICAgLy8gSWYgYGFzeW5jVmFsaWRhdG9yYCBpcyBwcmVzZW50LCBpdCB3aWxsIHRyaWdnZXIgY29udHJvbCBzdGF0dXMgY2hhbmdlIGZyb20gYFBFTkRJTkdgIHRvXG4gICAgICAgICAgICAvLyBgVkFMSURgIG9yIGBJTlZBTElEYC5cbiAgICAgICAgICAgIC8vIFRoZSBzdGF0dXMgc2hvdWxkIGJlIGJyb2FkY2FzdGVkIHZpYSB0aGUgYHN0YXR1c0NoYW5nZXNgIG9ic2VydmFibGUsIHNvIHdlIHNldFxuICAgICAgICAgICAgLy8gYGVtaXRFdmVudGAgdG8gYHRydWVgIHRvIGFsbG93IHRoYXQgZHVyaW5nIHRoZSBjb250cm9sIGNyZWF0aW9uIHByb2Nlc3MuXG4gICAgICAgICAgICBlbWl0RXZlbnQ6ICEhdGhpcy5hc3luY1ZhbGlkYXRvclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpICYmXG4gICAgICAgICAgICAodmFsaWRhdG9yT3JPcHRzLm5vbk51bGxhYmxlIHx8IHZhbGlkYXRvck9yT3B0cy5pbml0aWFsVmFsdWVJc0RlZmF1bHQpKSB7XG4gICAgICAgICAgICBpZiAoaXNGb3JtQ29udHJvbFN0YXRlKGZvcm1TdGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGZvcm1TdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gZm9ybVN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHNldFZhbHVlKHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBpZiAodGhpcy5fb25DaGFuZ2UubGVuZ3RoICYmIG9wdGlvbnMuZW1pdE1vZGVsVG9WaWV3Q2hhbmdlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UuZm9yRWFjaCgoY2hhbmdlRm4pID0+IGNoYW5nZUZuKHRoaXMudmFsdWUsIG9wdGlvbnMuZW1pdFZpZXdUb01vZGVsQ2hhbmdlICE9PSBmYWxzZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgICB9XG4gICAgcGF0Y2hWYWx1ZSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXNldChmb3JtU3RhdGUgPSB0aGlzLmRlZmF1bHRWYWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2FwcGx5Rm9ybVN0YXRlKGZvcm1TdGF0ZSk7XG4gICAgICAgIHRoaXMubWFya0FzUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgICAgIHRoaXMubWFya0FzVW50b3VjaGVkKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMudmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nQ2hhbmdlID0gZmFsc2U7XG4gICAgfVxuICAgIC8qKiAgQGludGVybmFsICovXG4gICAgX3VwZGF0ZVZhbHVlKCkgeyB9XG4gICAgLyoqICBAaW50ZXJuYWwgKi9cbiAgICBfYW55Q29udHJvbHMoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqICBAaW50ZXJuYWwgKi9cbiAgICBfYWxsQ29udHJvbHNEaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQ7XG4gICAgfVxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UucHVzaChmbik7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfdW5yZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG4gICAgICAgIHJlbW92ZUxpc3RJdGVtKHRoaXMuX29uQ2hhbmdlLCBmbik7XG4gICAgfVxuICAgIHJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShmbikge1xuICAgICAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLnB1c2goZm4pO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3VucmVnaXN0ZXJPbkRpc2FibGVkQ2hhbmdlKGZuKSB7XG4gICAgICAgIHJlbW92ZUxpc3RJdGVtKHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UsIGZuKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9mb3JFYWNoQ2hpbGQoY2IpIHsgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfc3luY1BlbmRpbmdDb250cm9scygpIHtcbiAgICAgICAgaWYgKHRoaXMudXBkYXRlT24gPT09ICdzdWJtaXQnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcGVuZGluZ0RpcnR5KVxuICAgICAgICAgICAgICAgIHRoaXMubWFya0FzRGlydHkoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wZW5kaW5nVG91Y2hlZClcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wZW5kaW5nQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLl9wZW5kaW5nVmFsdWUsIHsgb25seVNlbGY6IHRydWUsIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfYXBwbHlGb3JtU3RhdGUoZm9ybVN0YXRlKSB7XG4gICAgICAgIGlmIChpc0Zvcm1Db250cm9sU3RhdGUoZm9ybVN0YXRlKSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IGZvcm1TdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIGZvcm1TdGF0ZS5kaXNhYmxlZCA/IHRoaXMuZGlzYWJsZSh7IG9ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlIH0pIDpcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZSh7IG9ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IGZvcm1TdGF0ZTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuY29uc3QgVW50eXBlZEZvcm1Db250cm9sID0gRm9ybUNvbnRyb2w7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQXNzZXJ0cyB0aGF0IHRoZSBnaXZlbiBjb250cm9sIGlzIGFuIGluc3RhbmNlIG9mIGBGb3JtQ29udHJvbGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNvbnN0IGlzRm9ybUNvbnRyb2wgPSAoY29udHJvbCkgPT4gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBiYXNlIGNsYXNzIGZvciBjb2RlIHNoYXJlZCBiZXR3ZWVuIHRoZSBgTmdNb2RlbEdyb3VwYCBhbmQgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSBleHRlbmRzIENvbnRyb2xDb250YWluZXIge1xuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tQYXJlbnRUeXBlKCk7XG4gICAgICAgIC8vIFJlZ2lzdGVyIHRoZSBncm91cCB3aXRoIGl0cyBwYXJlbnQgZ3JvdXAuXG4gICAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRGb3JtR3JvdXAodGhpcyk7XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybURpcmVjdGl2ZSkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBncm91cCBmcm9tIGl0cyBwYXJlbnQgZ3JvdXAuXG4gICAgICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlRm9ybUdyb3VwKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSBgRm9ybUdyb3VwYCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICAgKi9cbiAgICBnZXQgY29udHJvbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybURpcmVjdGl2ZS5nZXRGb3JtR3JvdXAodGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSBwYXRoIHRvIHRoaXMgZ3JvdXAgZnJvbSB0aGUgdG9wLWxldmVsIGRpcmVjdGl2ZS5cbiAgICAgKi9cbiAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xQYXRoKHRoaXMubmFtZSA9PSBudWxsID8gdGhpcy5uYW1lIDogdGhpcy5uYW1lLnRvU3RyaW5nKCksIHRoaXMuX3BhcmVudCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSB0b3AtbGV2ZWwgZGlyZWN0aXZlIGZvciB0aGlzIGdyb3VwIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICAgICAqL1xuICAgIGdldCBmb3JtRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gdGhpcy5fcGFyZW50LmZvcm1EaXJlY3RpdmUgOiBudWxsO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2NoZWNrUGFyZW50VHlwZSgpIHsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlLCBkZXBzOiBudWxsLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZVxuICAgICAgICB9XSB9KTtcblxuZnVuY3Rpb24gbW9kZWxQYXJlbnRFeGNlcHRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyDJtVJ1bnRpbWVFcnJvcigxMzUwIC8qIFJ1bnRpbWVFcnJvckNvZGUuTkdNT0RFTF9JTl9GT1JNX0dST1VQICovLCBgXG4gICAgbmdNb2RlbCBjYW5ub3QgYmUgdXNlZCB0byByZWdpc3RlciBmb3JtIGNvbnRyb2xzIHdpdGggYSBwYXJlbnQgZm9ybUdyb3VwIGRpcmVjdGl2ZS4gIFRyeSB1c2luZ1xuICAgIGZvcm1Hcm91cCdzIHBhcnRuZXIgZGlyZWN0aXZlIFwiZm9ybUNvbnRyb2xOYW1lXCIgaW5zdGVhZC4gIEV4YW1wbGU6XG5cbiAgICAke2Zvcm1Db250cm9sTmFtZUV4YW1wbGV9XG5cbiAgICBPciwgaWYgeW91J2QgbGlrZSB0byBhdm9pZCByZWdpc3RlcmluZyB0aGlzIGZvcm0gY29udHJvbCwgaW5kaWNhdGUgdGhhdCBpdCdzIHN0YW5kYWxvbmUgaW4gbmdNb2RlbE9wdGlvbnM6XG5cbiAgICBFeGFtcGxlOlxuXG4gICAgJHtuZ01vZGVsV2l0aEZvcm1Hcm91cEV4YW1wbGV9YCk7XG59XG5mdW5jdGlvbiBmb3JtR3JvdXBOYW1lRXhjZXB0aW9uKCkge1xuICAgIHJldHVybiBuZXcgybVSdW50aW1lRXJyb3IoMTM1MSAvKiBSdW50aW1lRXJyb3JDb2RlLk5HTU9ERUxfSU5fRk9STV9HUk9VUF9OQU1FICovLCBgXG4gICAgbmdNb2RlbCBjYW5ub3QgYmUgdXNlZCB0byByZWdpc3RlciBmb3JtIGNvbnRyb2xzIHdpdGggYSBwYXJlbnQgZm9ybUdyb3VwTmFtZSBvciBmb3JtQXJyYXlOYW1lIGRpcmVjdGl2ZS5cblxuICAgIE9wdGlvbiAxOiBVc2UgZm9ybUNvbnRyb2xOYW1lIGluc3RlYWQgb2YgbmdNb2RlbCAocmVhY3RpdmUgc3RyYXRlZ3kpOlxuXG4gICAgJHtmb3JtR3JvdXBOYW1lRXhhbXBsZX1cblxuICAgIE9wdGlvbiAyOiAgVXBkYXRlIG5nTW9kZWwncyBwYXJlbnQgYmUgbmdNb2RlbEdyb3VwICh0ZW1wbGF0ZS1kcml2ZW4gc3RyYXRlZ3kpOlxuXG4gICAgJHtuZ01vZGVsR3JvdXBFeGFtcGxlfWApO1xufVxuZnVuY3Rpb24gbWlzc2luZ05hbWVFeGNlcHRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyDJtVJ1bnRpbWVFcnJvcigxMzUyIC8qIFJ1bnRpbWVFcnJvckNvZGUuTkdNT0RFTF9XSVRIT1VUX05BTUUgKi8sIGBJZiBuZ01vZGVsIGlzIHVzZWQgd2l0aGluIGEgZm9ybSB0YWcsIGVpdGhlciB0aGUgbmFtZSBhdHRyaWJ1dGUgbXVzdCBiZSBzZXQgb3IgdGhlIGZvcm1cbiAgICBjb250cm9sIG11c3QgYmUgZGVmaW5lZCBhcyAnc3RhbmRhbG9uZScgaW4gbmdNb2RlbE9wdGlvbnMuXG5cbiAgICBFeGFtcGxlIDE6IDxpbnB1dCBbKG5nTW9kZWwpXT1cInBlcnNvbi5maXJzdE5hbWVcIiBuYW1lPVwiZmlyc3RcIj5cbiAgICBFeGFtcGxlIDI6IDxpbnB1dCBbKG5nTW9kZWwpXT1cInBlcnNvbi5maXJzdE5hbWVcIiBbbmdNb2RlbE9wdGlvbnNdPVwie3N0YW5kYWxvbmU6IHRydWV9XCI+YCk7XG59XG5mdW5jdGlvbiBtb2RlbEdyb3VwUGFyZW50RXhjZXB0aW9uKCkge1xuICAgIHJldHVybiBuZXcgybVSdW50aW1lRXJyb3IoMTM1MyAvKiBSdW50aW1lRXJyb3JDb2RlLk5HTU9ERUxHUk9VUF9JTl9GT1JNX0dST1VQICovLCBgXG4gICAgbmdNb2RlbEdyb3VwIGNhbm5vdCBiZSB1c2VkIHdpdGggYSBwYXJlbnQgZm9ybUdyb3VwIGRpcmVjdGl2ZS5cblxuICAgIE9wdGlvbiAxOiBVc2UgZm9ybUdyb3VwTmFtZSBpbnN0ZWFkIG9mIG5nTW9kZWxHcm91cCAocmVhY3RpdmUgc3RyYXRlZ3kpOlxuXG4gICAgJHtmb3JtR3JvdXBOYW1lRXhhbXBsZX1cblxuICAgIE9wdGlvbiAyOiAgVXNlIGEgcmVndWxhciBmb3JtIHRhZyBpbnN0ZWFkIG9mIHRoZSBmb3JtR3JvdXAgZGlyZWN0aXZlICh0ZW1wbGF0ZS1kcml2ZW4gc3RyYXRlZ3kpOlxuXG4gICAgJHtuZ01vZGVsR3JvdXBFeGFtcGxlfWApO1xufVxuXG5jb25zdCBtb2RlbEdyb3VwUHJvdmlkZXIgPSB7XG4gICAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ01vZGVsR3JvdXApXG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW5kIGJpbmRzIGEgYEZvcm1Hcm91cGAgaW5zdGFuY2UgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBjYW4gb25seSBiZSB1c2VkIGFzIGEgY2hpbGQgb2YgYE5nRm9ybWAgKHdpdGhpbiBgPGZvcm0+YCB0YWdzKS5cbiAqXG4gKiBVc2UgdGhpcyBkaXJlY3RpdmUgdG8gdmFsaWRhdGUgYSBzdWItZ3JvdXAgb2YgeW91ciBmb3JtIHNlcGFyYXRlbHkgZnJvbSB0aGVcbiAqIHJlc3Qgb2YgeW91ciBmb3JtLCBvciBpZiBzb21lIHZhbHVlcyBpbiB5b3VyIGRvbWFpbiBtb2RlbCBtYWtlIG1vcmUgc2Vuc2VcbiAqIHRvIGNvbnN1bWUgdG9nZXRoZXIgaW4gYSBuZXN0ZWQgb2JqZWN0LlxuICpcbiAqIFByb3ZpZGUgYSBuYW1lIGZvciB0aGUgc3ViLWdyb3VwIGFuZCBpdCB3aWxsIGJlY29tZSB0aGUga2V5XG4gKiBmb3IgdGhlIHN1Yi1ncm91cCBpbiB0aGUgZm9ybSdzIGZ1bGwgdmFsdWUuIElmIHlvdSBuZWVkIGRpcmVjdCBhY2Nlc3MsIGV4cG9ydCB0aGUgZGlyZWN0aXZlIGludG9cbiAqIGEgbG9jYWwgdGVtcGxhdGUgdmFyaWFibGUgdXNpbmcgYG5nTW9kZWxHcm91cGAgKGV4OiBgI215R3JvdXA9XCJuZ01vZGVsR3JvdXBcImApLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENvbnN1bWluZyBjb250cm9scyBpbiBhIGdyb3VwaW5nXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHlvdSBob3cgdG8gY29tYmluZSBjb250cm9scyB0b2dldGhlciBpbiBhIHN1Yi1ncm91cFxuICogb2YgdGhlIGZvcm0uXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL25nTW9kZWxHcm91cC9uZ19tb2RlbF9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTmdNb2RlbEdyb3VwIGV4dGVuZHMgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgdmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgTmdNb2RlbEdyb3VwYCBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBUaGUgbmFtZSBjb3JyZXNwb25kc1xuICAgICAgICAgKiB0byBhIGtleSBpbiB0aGUgcGFyZW50IGBOZ0Zvcm1gLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gJyc7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICAgICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfY2hlY2tQYXJlbnRUeXBlKCkge1xuICAgICAgICBpZiAoISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBOZ01vZGVsR3JvdXApICYmICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgTmdGb3JtKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgICAgIHRocm93IG1vZGVsR3JvdXBQYXJlbnRFeGNlcHRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOZ01vZGVsR3JvdXAsIGRlcHM6IFt7IHRva2VuOiBDb250cm9sQ29udGFpbmVyLCBob3N0OiB0cnVlLCBza2lwU2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19BU1lOQ19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBOZ01vZGVsR3JvdXAsIHNlbGVjdG9yOiBcIltuZ01vZGVsR3JvdXBdXCIsIGlucHV0czogeyBuYW1lOiBbXCJuZ01vZGVsR3JvdXBcIiwgXCJuYW1lXCJdIH0sIHByb3ZpZGVyczogW21vZGVsR3JvdXBQcm92aWRlcl0sIGV4cG9ydEFzOiBbXCJuZ01vZGVsR3JvdXBcIl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nTW9kZWxHcm91cCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7IHNlbGVjdG9yOiAnW25nTW9kZWxHcm91cF0nLCBwcm92aWRlcnM6IFttb2RlbEdyb3VwUHJvdmlkZXJdLCBleHBvcnRBczogJ25nTW9kZWxHcm91cCcgfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiBDb250cm9sQ29udGFpbmVyLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBIb3N0XG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTa2lwU2VsZlxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX0FTWU5DX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfV0sIHByb3BEZWNvcmF0b3JzOiB7IG5hbWU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWyduZ01vZGVsR3JvdXAnXVxuICAgICAgICAgICAgfV0gfSB9KTtcblxuY29uc3QgZm9ybUNvbnRyb2xCaW5kaW5nJDEgPSB7XG4gICAgcHJvdmlkZTogTmdDb250cm9sLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nTW9kZWwpXG59O1xuLyoqXG4gKiBgbmdNb2RlbGAgZm9yY2VzIGFuIGFkZGl0aW9uYWwgY2hhbmdlIGRldGVjdGlvbiBydW4gd2hlbiBpdHMgaW5wdXRzIGNoYW5nZTpcbiAqIEUuZy46XG4gKiBgYGBcbiAqIDxkaXY+e3tteU1vZGVsLnZhbGlkfX08L2Rpdj5cbiAqIDxpbnB1dCBbKG5nTW9kZWwpXT1cIm15VmFsdWVcIiAjbXlNb2RlbD1cIm5nTW9kZWxcIj5cbiAqIGBgYFxuICogSS5lLiBgbmdNb2RlbGAgY2FuIGV4cG9ydCBpdHNlbGYgb24gdGhlIGVsZW1lbnQgYW5kIHRoZW4gYmUgdXNlZCBpbiB0aGUgdGVtcGxhdGUuXG4gKiBOb3JtYWxseSwgdGhpcyB3b3VsZCByZXN1bHQgaW4gZXhwcmVzc2lvbnMgYmVmb3JlIHRoZSBgaW5wdXRgIHRoYXQgdXNlIHRoZSBleHBvcnRlZCBkaXJlY3RpdmVcbiAqIHRvIGhhdmUgYW4gb2xkIHZhbHVlIGFzIHRoZXkgaGF2ZSBiZWVuXG4gKiBkaXJ0eSBjaGVja2VkIGJlZm9yZS4gQXMgdGhpcyBpcyBhIHZlcnkgY29tbW9uIGNhc2UgZm9yIGBuZ01vZGVsYCwgd2UgYWRkZWQgdGhpcyBzZWNvbmQgY2hhbmdlXG4gKiBkZXRlY3Rpb24gcnVuLlxuICpcbiAqIE5vdGVzOlxuICogLSB0aGlzIGlzIGp1c3Qgb25lIGV4dHJhIHJ1biBubyBtYXR0ZXIgaG93IG1hbnkgYG5nTW9kZWxgcyBoYXZlIGJlZW4gY2hhbmdlZC5cbiAqIC0gdGhpcyBpcyBhIGdlbmVyYWwgcHJvYmxlbSB3aGVuIHVzaW5nIGBleHBvcnRBc2AgZm9yIGRpcmVjdGl2ZXMhXG4gKi9cbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9ICgoKSA9PiBQcm9taXNlLnJlc29sdmUoKSkoKTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgYEZvcm1Db250cm9sYCBpbnN0YW5jZSBmcm9tIGEgW2RvbWFpblxuICogbW9kZWxdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0RvbWFpbl9tb2RlbCkgYW5kIGJpbmRzIGl0IHRvIGEgZm9ybSBjb250cm9sIGVsZW1lbnQuXG4gKlxuICogVGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgdHJhY2tzIHRoZSB2YWx1ZSwgdXNlciBpbnRlcmFjdGlvbiwgYW5kXG4gKiB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbCBhbmQga2VlcHMgdGhlIHZpZXcgc3luY2VkIHdpdGggdGhlIG1vZGVsLiBJZiB1c2VkXG4gKiB3aXRoaW4gYSBwYXJlbnQgZm9ybSwgdGhlIGRpcmVjdGl2ZSBhbHNvIHJlZ2lzdGVycyBpdHNlbGYgd2l0aCB0aGUgZm9ybSBhcyBhIGNoaWxkXG4gKiBjb250cm9sLlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHVzZWQgYnkgaXRzZWxmIG9yIGFzIHBhcnQgb2YgYSBsYXJnZXIgZm9ybS4gVXNlIHRoZVxuICogYG5nTW9kZWxgIHNlbGVjdG9yIHRvIGFjdGl2YXRlIGl0LlxuICpcbiAqIEl0IGFjY2VwdHMgYSBkb21haW4gbW9kZWwgYXMgYW4gb3B0aW9uYWwgYElucHV0YC4gSWYgeW91IGhhdmUgYSBvbmUtd2F5IGJpbmRpbmdcbiAqIHRvIGBuZ01vZGVsYCB3aXRoIGBbXWAgc3ludGF4LCBjaGFuZ2luZyB0aGUgZG9tYWluIG1vZGVsJ3MgdmFsdWUgaW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3Mgc2V0cyB0aGUgdmFsdWUgaW4gdGhlIHZpZXcuIElmIHlvdSBoYXZlIGEgdHdvLXdheSBiaW5kaW5nIHdpdGggYFsoKV1gIHN5bnRheFxuICogKGFsc28ga25vd24gYXMgJ2JhbmFuYS1pbi1hLWJveCBzeW50YXgnKSwgdGhlIHZhbHVlIGluIHRoZSBVSSBhbHdheXMgc3luY3MgYmFjayB0b1xuICogdGhlIGRvbWFpbiBtb2RlbCBpbiB5b3VyIGNsYXNzLlxuICpcbiAqIFRvIGluc3BlY3QgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGFzc29jaWF0ZWQgYEZvcm1Db250cm9sYCAobGlrZSB0aGUgdmFsaWRpdHkgc3RhdGUpLFxuICogZXhwb3J0IHRoZSBkaXJlY3RpdmUgaW50byBhIGxvY2FsIHRlbXBsYXRlIHZhcmlhYmxlIHVzaW5nIGBuZ01vZGVsYCBhcyB0aGUga2V5IChleDpcbiAqIGAjbXlWYXI9XCJuZ01vZGVsXCJgKS4gWW91IGNhbiB0aGVuIGFjY2VzcyB0aGUgY29udHJvbCB1c2luZyB0aGUgZGlyZWN0aXZlJ3MgYGNvbnRyb2xgIHByb3BlcnR5LlxuICogSG93ZXZlciwgdGhlIG1vc3QgY29tbW9ubHkgdXNlZCBwcm9wZXJ0aWVzIChsaWtlIGB2YWxpZGAgYW5kIGBkaXJ0eWApIGFsc28gZXhpc3Qgb24gdGhlIGNvbnRyb2xcbiAqIGZvciBkaXJlY3QgYWNjZXNzLiBTZWUgYSBmdWxsIGxpc3Qgb2YgcHJvcGVydGllcyBkaXJlY3RseSBhdmFpbGFibGUgaW5cbiAqIGBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmVgLlxuICpcbiAqIEBzZWUge0BsaW5rIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3J9XG4gKiBAc2VlIHtAbGluayBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvcn1cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBVc2luZyBuZ01vZGVsIG9uIGEgc3RhbmRhbG9uZSBjb250cm9sXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlcyBzaG93IGEgc2ltcGxlIHN0YW5kYWxvbmUgY29udHJvbCB1c2luZyBgbmdNb2RlbGA6XG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZU5nTW9kZWwvc2ltcGxlX25nX21vZGVsX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIFdoZW4gdXNpbmcgdGhlIGBuZ01vZGVsYCB3aXRoaW4gYDxmb3JtPmAgdGFncywgeW91J2xsIGFsc28gbmVlZCB0byBzdXBwbHkgYSBgbmFtZWAgYXR0cmlidXRlXG4gKiBzbyB0aGF0IHRoZSBjb250cm9sIGNhbiBiZSByZWdpc3RlcmVkIHdpdGggdGhlIHBhcmVudCBmb3JtIHVuZGVyIHRoYXQgbmFtZS5cbiAqXG4gKiBJbiB0aGUgY29udGV4dCBvZiBhIHBhcmVudCBmb3JtLCBpdCdzIG9mdGVuIHVubmVjZXNzYXJ5IHRvIGluY2x1ZGUgb25lLXdheSBvciB0d28td2F5IGJpbmRpbmcsXG4gKiBhcyB0aGUgcGFyZW50IGZvcm0gc3luY3MgdGhlIHZhbHVlIGZvciB5b3UuIFlvdSBhY2Nlc3MgaXRzIHByb3BlcnRpZXMgYnkgZXhwb3J0aW5nIGl0IGludG8gYVxuICogbG9jYWwgdGVtcGxhdGUgdmFyaWFibGUgdXNpbmcgYG5nRm9ybWAgc3VjaCBhcyAoYCNmPVwibmdGb3JtXCJgKS4gVXNlIHRoZSB2YXJpYWJsZSB3aGVyZVxuICogbmVlZGVkIG9uIGZvcm0gc3VibWlzc2lvbi5cbiAqXG4gKiBJZiB5b3UgZG8gbmVlZCB0byBwb3B1bGF0ZSBpbml0aWFsIHZhbHVlcyBpbnRvIHlvdXIgZm9ybSwgdXNpbmcgYSBvbmUtd2F5IGJpbmRpbmcgZm9yXG4gKiBgbmdNb2RlbGAgdGVuZHMgdG8gYmUgc3VmZmljaWVudCBhcyBsb25nIGFzIHlvdSB1c2UgdGhlIGV4cG9ydGVkIGZvcm0ncyB2YWx1ZSByYXRoZXJcbiAqIHRoYW4gdGhlIGRvbWFpbiBtb2RlbCdzIHZhbHVlIG9uIHN1Ym1pdC5cbiAqXG4gKiAjIyMgVXNpbmcgbmdNb2RlbCB3aXRoaW4gYSBmb3JtXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGNvbnRyb2xzIHVzaW5nIGBuZ01vZGVsYCB3aXRoaW4gYSBmb3JtOlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtL3NpbXBsZV9mb3JtX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqICMjIyBVc2luZyBhIHN0YW5kYWxvbmUgbmdNb2RlbCB3aXRoaW4gYSBncm91cFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyB5b3UgaG93IHRvIHVzZSBhIHN0YW5kYWxvbmUgbmdNb2RlbCBjb250cm9sXG4gKiB3aXRoaW4gYSBmb3JtLiBUaGlzIGNvbnRyb2xzIHRoZSBkaXNwbGF5IG9mIHRoZSBmb3JtLCBidXQgZG9lc24ndCBjb250YWluIGZvcm0gZGF0YS5cbiAqXG4gKiBgYGBodG1sXG4gKiA8Zm9ybT5cbiAqICAgPGlucHV0IG5hbWU9XCJsb2dpblwiIG5nTW9kZWwgcGxhY2Vob2xkZXI9XCJMb2dpblwiPlxuICogICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmdNb2RlbCBbbmdNb2RlbE9wdGlvbnNdPVwie3N0YW5kYWxvbmU6IHRydWV9XCI+IFNob3cgbW9yZSBvcHRpb25zP1xuICogPC9mb3JtPlxuICogPCEtLSBmb3JtIHZhbHVlOiB7bG9naW46ICcnfSAtLT5cbiAqIGBgYFxuICpcbiAqICMjIyBTZXR0aW5nIHRoZSBuZ01vZGVsIGBuYW1lYCBhdHRyaWJ1dGUgdGhyb3VnaCBvcHRpb25zXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHlvdSBhbiBhbHRlcm5hdGUgd2F5IHRvIHNldCB0aGUgbmFtZSBhdHRyaWJ1dGUuIEhlcmUsXG4gKiBhbiBhdHRyaWJ1dGUgaWRlbnRpZmllZCBhcyBuYW1lIGlzIHVzZWQgd2l0aGluIGEgY3VzdG9tIGZvcm0gY29udHJvbCBjb21wb25lbnQuIFRvIHN0aWxsIGJlIGFibGVcbiAqIHRvIHNwZWNpZnkgdGhlIE5nTW9kZWwncyBuYW1lLCB5b3UgbXVzdCBzcGVjaWZ5IGl0IHVzaW5nIHRoZSBgbmdNb2RlbE9wdGlvbnNgIGlucHV0IGluc3RlYWQuXG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0+XG4gKiAgIDxteS1jdXN0b20tZm9ybS1jb250cm9sIG5hbWU9XCJOYW5jeVwiIG5nTW9kZWwgW25nTW9kZWxPcHRpb25zXT1cIntuYW1lOiAndXNlcid9XCI+XG4gKiAgIDwvbXktY3VzdG9tLWZvcm0tY29udHJvbD5cbiAqIDwvZm9ybT5cbiAqIDwhLS0gZm9ybSB2YWx1ZToge3VzZXI6ICcnfSAtLT5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBOZ01vZGVsIGV4dGVuZHMgTmdDb250cm9sIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9ycywgdmFsdWVBY2Nlc3NvcnMsIF9jaGFuZ2VEZXRlY3RvclJlZiwgY2FsbFNldERpc2FibGVkU3RhdGUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYgPSBfY2hhbmdlRGV0ZWN0b3JSZWY7XG4gICAgICAgIHRoaXMuY2FsbFNldERpc2FibGVkU3RhdGUgPSBjYWxsU2V0RGlzYWJsZWRTdGF0ZTtcbiAgICAgICAgdGhpcy5jb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJlZCA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRyYWNrcyB0aGUgbmFtZSBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBJZiBhIHBhcmVudCBmb3JtIGV4aXN0cywgaXRcbiAgICAgICAgICogdXNlcyB0aGlzIG5hbWUgYXMgYSBrZXkgdG8gcmV0cmlldmUgdGhpcyBjb250cm9sJ3MgdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5hbWUgPSAnJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBFdmVudCBlbWl0dGVyIGZvciBwcm9kdWNpbmcgdGhlIGBuZ01vZGVsQ2hhbmdlYCBldmVudCBhZnRlclxuICAgICAgICAgKiB0aGUgdmlldyBtb2RlbCB1cGRhdGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICAgICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gICAgICAgIHRoaXMudmFsdWVBY2Nlc3NvciA9IHNlbGVjdFZhbHVlQWNjZXNzb3IodGhpcywgdmFsdWVBY2Nlc3NvcnMpO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgICAgICB0aGlzLl9jaGVja0ZvckVycm9ycygpO1xuICAgICAgICBpZiAoIXRoaXMuX3JlZ2lzdGVyZWQgfHwgJ25hbWUnIGluIGNoYW5nZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWdpc3RlcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tOYW1lKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybURpcmVjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBjYW4ndCBjYWxsIGBmb3JtRGlyZWN0aXZlLnJlbW92ZUNvbnRyb2wodGhpcylgLCBiZWNhdXNlIHRoZSBgbmFtZWAgaGFzIGFscmVhZHkgYmVlblxuICAgICAgICAgICAgICAgICAgICAvLyBjaGFuZ2VkLiBXZSBhbHNvIGNhbid0IHJlc2V0IHRoZSBuYW1lIHRlbXBvcmFyaWx5IHNpbmNlIHRoZSBsb2dpYyBpbiBgcmVtb3ZlQ29udHJvbGBcbiAgICAgICAgICAgICAgICAgICAgLy8gaXMgaW5zaWRlIGEgcHJvbWlzZSBhbmQgaXQgd29uJ3QgcnVuIGltbWVkaWF0ZWx5LiBXZSB3b3JrIGFyb3VuZCBpdCBieSBnaXZpbmcgaXQgYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gb2JqZWN0IHdpdGggdGhlIHNhbWUgc2hhcGUgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkTmFtZSA9IGNoYW5nZXNbJ25hbWUnXS5wcmV2aW91c1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlQ29udHJvbCh7IG5hbWU6IG9sZE5hbWUsIHBhdGg6IHRoaXMuX2dldFBhdGgob2xkTmFtZSkgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc2V0VXBDb250cm9sKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdpc0Rpc2FibGVkJyBpbiBjaGFuZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVEaXNhYmxlZChjaGFuZ2VzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdGhpcy52aWV3TW9kZWwpKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZSh0aGlzLm1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMudmlld01vZGVsID0gdGhpcy5tb2RlbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZSAmJiB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlQ29udHJvbCh0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgICAqIEVhY2ggaW5kZXggaXMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBjb250cm9sIG9uIHRoYXQgbGV2ZWwuXG4gICAgICovXG4gICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRQYXRoKHRoaXMubmFtZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSB0b3AtbGV2ZWwgZGlyZWN0aXZlIGZvciB0aGlzIGNvbnRyb2wgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAgICovXG4gICAgZ2V0IGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwgYW5kIGVtaXRzIGFuIGBuZ01vZGVsQ2hhbmdlYCBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBUaGUgbmV3IHZhbHVlIGVtaXR0ZWQgYnkgYG5nTW9kZWxDaGFuZ2VgLlxuICAgICAqL1xuICAgIHZpZXdUb01vZGVsVXBkYXRlKG5ld1ZhbHVlKSB7XG4gICAgICAgIHRoaXMudmlld01vZGVsID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlLmVtaXQobmV3VmFsdWUpO1xuICAgIH1cbiAgICBfc2V0VXBDb250cm9sKCkge1xuICAgICAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSgpO1xuICAgICAgICB0aGlzLl9pc1N0YW5kYWxvbmUoKSA/IHRoaXMuX3NldFVwU3RhbmRhbG9uZSgpIDogdGhpcy5mb3JtRGlyZWN0aXZlLmFkZENvbnRyb2wodGhpcyk7XG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgICBfc2V0VXBkYXRlU3RyYXRlZ3koKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnVwZGF0ZU9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbC5fdXBkYXRlT24gPSB0aGlzLm9wdGlvbnMudXBkYXRlT247XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2lzU3RhbmRhbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9wYXJlbnQgfHwgISEodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5zdGFuZGFsb25lKTtcbiAgICB9XG4gICAgX3NldFVwU3RhbmRhbG9uZSgpIHtcbiAgICAgICAgc2V0VXBDb250cm9sKHRoaXMuY29udHJvbCwgdGhpcywgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSk7XG4gICAgICAgIHRoaXMuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICB9XG4gICAgX2NoZWNrRm9yRXJyb3JzKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2lzU3RhbmRhbG9uZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGVja1BhcmVudFR5cGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jaGVja05hbWUoKTtcbiAgICB9XG4gICAgX2NoZWNrUGFyZW50VHlwZSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgICAgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgTmdNb2RlbEdyb3VwKSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZm9ybUdyb3VwTmFtZUV4Y2VwdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBOZ01vZGVsR3JvdXApICYmICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgTmdGb3JtKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG1vZGVsUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NoZWNrTmFtZSgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMubmFtZSlcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IHRoaXMub3B0aW9ucy5uYW1lO1xuICAgICAgICBpZiAoIXRoaXMuX2lzU3RhbmRhbG9uZSgpICYmICF0aGlzLm5hbWUgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgICAgIHRocm93IG1pc3NpbmdOYW1lRXhjZXB0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3VwZGF0ZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbC5zZXRWYWx1ZSh2YWx1ZSwgeyBlbWl0Vmlld1RvTW9kZWxDaGFuZ2U6IGZhbHNlIH0pO1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWY/Lm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3VwZGF0ZURpc2FibGVkKGNoYW5nZXMpIHtcbiAgICAgICAgY29uc3QgZGlzYWJsZWRWYWx1ZSA9IGNoYW5nZXNbJ2lzRGlzYWJsZWQnXS5jdXJyZW50VmFsdWU7XG4gICAgICAgIC8vIGNoZWNraW5nIGZvciAwIHRvIGF2b2lkIGJyZWFraW5nIGNoYW5nZVxuICAgICAgICBjb25zdCBpc0Rpc2FibGVkID0gZGlzYWJsZWRWYWx1ZSAhPT0gMCAmJiBib29sZWFuQXR0cmlidXRlKGRpc2FibGVkVmFsdWUpO1xuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNEaXNhYmxlZCAmJiAhdGhpcy5jb250cm9sLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sLmRpc2FibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFpc0Rpc2FibGVkICYmIHRoaXMuY29udHJvbC5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbC5lbmFibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmPy5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9nZXRQYXRoKGNvbnRyb2xOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyBjb250cm9sUGF0aChjb250cm9sTmFtZSwgdGhpcy5fcGFyZW50KSA6IFtjb250cm9sTmFtZV07XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nTW9kZWwsIGRlcHM6IFt7IHRva2VuOiBDb250cm9sQ29udGFpbmVyLCBob3N0OiB0cnVlLCBvcHRpb25hbDogdHJ1ZSB9LCB7IHRva2VuOiBOR19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19BU1lOQ19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19WQUxVRV9BQ0NFU1NPUiwgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogQ2hhbmdlRGV0ZWN0b3JSZWYsIG9wdGlvbmFsOiB0cnVlIH0sIHsgdG9rZW46IENBTExfU0VUX0RJU0FCTEVEX1NUQVRFLCBvcHRpb25hbDogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBOZ01vZGVsLCBzZWxlY3RvcjogXCJbbmdNb2RlbF06bm90KFtmb3JtQ29udHJvbE5hbWVdKTpub3QoW2Zvcm1Db250cm9sXSlcIiwgaW5wdXRzOiB7IG5hbWU6IFwibmFtZVwiLCBpc0Rpc2FibGVkOiBbXCJkaXNhYmxlZFwiLCBcImlzRGlzYWJsZWRcIl0sIG1vZGVsOiBbXCJuZ01vZGVsXCIsIFwibW9kZWxcIl0sIG9wdGlvbnM6IFtcIm5nTW9kZWxPcHRpb25zXCIsIFwib3B0aW9uc1wiXSB9LCBvdXRwdXRzOiB7IHVwZGF0ZTogXCJuZ01vZGVsQ2hhbmdlXCIgfSwgcHJvdmlkZXJzOiBbZm9ybUNvbnRyb2xCaW5kaW5nJDFdLCBleHBvcnRBczogW1wibmdNb2RlbFwiXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCB1c2VzT25DaGFuZ2VzOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTmdNb2RlbCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnW25nTW9kZWxdOm5vdChbZm9ybUNvbnRyb2xOYW1lXSk6bm90KFtmb3JtQ29udHJvbF0pJyxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbZm9ybUNvbnRyb2xCaW5kaW5nJDFdLFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRBczogJ25nTW9kZWwnXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiBDb250cm9sQ29udGFpbmVyLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSG9zdFxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX0FTWU5DX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19WQUxVRV9BQ0NFU1NPUl1cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IGkwLkNoYW5nZURldGVjdG9yUmVmLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbQ2hhbmdlRGV0ZWN0b3JSZWZdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtDQUxMX1NFVF9ESVNBQkxFRF9TVEFURV1cbiAgICAgICAgICAgICAgICB9XSB9XSwgcHJvcERlY29yYXRvcnM6IHsgbmFtZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0sIGlzRGlzYWJsZWQ6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWydkaXNhYmxlZCddXG4gICAgICAgICAgICB9XSwgbW9kZWw6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWyduZ01vZGVsJ11cbiAgICAgICAgICAgIH1dLCBvcHRpb25zOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdNb2RlbE9wdGlvbnMnXVxuICAgICAgICAgICAgfV0sIHVwZGF0ZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBPdXRwdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWyduZ01vZGVsQ2hhbmdlJ11cbiAgICAgICAgICAgIH1dIH0gfSk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQWRkcyBgbm92YWxpZGF0ZWAgYXR0cmlidXRlIHRvIGFsbCBmb3JtcyBieSBkZWZhdWx0LlxuICpcbiAqIGBub3ZhbGlkYXRlYCBpcyB1c2VkIHRvIGRpc2FibGUgYnJvd3NlcidzIG5hdGl2ZSBmb3JtIHZhbGlkYXRpb24uXG4gKlxuICogSWYgeW91IHdhbnQgdG8gdXNlIG5hdGl2ZSB2YWxpZGF0aW9uIHdpdGggQW5ndWxhciBmb3JtcywganVzdCBhZGQgYG5nTmF0aXZlVmFsaWRhdGVgIGF0dHJpYnV0ZTpcbiAqXG4gKiBgYGBcbiAqIDxmb3JtIG5nTmF0aXZlVmFsaWRhdGU+PC9mb3JtPlxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICovXG5jbGFzcyDJtU5nTm9WYWxpZGF0ZSB7XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogybVOZ05vVmFsaWRhdGUsIGRlcHM6IFtdLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IMm1TmdOb1ZhbGlkYXRlLCBzZWxlY3RvcjogXCJmb3JtOm5vdChbbmdOb0Zvcm1dKTpub3QoW25nTmF0aXZlVmFsaWRhdGVdKVwiLCBob3N0OiB7IGF0dHJpYnV0ZXM6IHsgXCJub3ZhbGlkYXRlXCI6IFwiXCIgfSB9LCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogybVOZ05vVmFsaWRhdGUsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2Zvcm06bm90KFtuZ05vRm9ybV0pOm5vdChbbmdOYXRpdmVWYWxpZGF0ZV0pJyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogeyAnbm92YWxpZGF0ZSc6ICcnIH0sXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0gfSk7XG5cbmNvbnN0IE5VTUJFUl9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOdW1iZXJWYWx1ZUFjY2Vzc29yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyBhIG51bWJlciB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIG51bWJlciBpbnB1dCBjaGFuZ2VzLlxuICogVGhlIHZhbHVlIGFjY2Vzc29yIGlzIHVzZWQgYnkgdGhlIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAsIGBGb3JtQ29udHJvbE5hbWVgLCBhbmQgYE5nTW9kZWxgXG4gKiBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIGEgbnVtYmVyIGlucHV0IHdpdGggYSByZWFjdGl2ZSBmb3JtLlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIGEgbnVtYmVyIGlucHV0IHdpdGggYSByZWFjdGl2ZSBmb3JtLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCB0b3RhbENvdW50Q29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogYGBgXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cIm51bWJlclwiIFtmb3JtQ29udHJvbF09XCJ0b3RhbENvdW50Q29udHJvbFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBOdW1iZXJWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBcInZhbHVlXCIgcHJvcGVydHkgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAvLyBUaGUgdmFsdWUgbmVlZHMgdG8gYmUgbm9ybWFsaXplZCBmb3IgSUU5LCBvdGhlcndpc2UgaXQgaXMgc2V0IHRvICdudWxsJyB3aGVuIG51bGxcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ3ZhbHVlJywgbm9ybWFsaXplZFZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGZuKHZhbHVlID09ICcnID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTnVtYmVyVmFsdWVBY2Nlc3NvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBOdW1iZXJWYWx1ZUFjY2Vzc29yLCBzZWxlY3RvcjogXCJpbnB1dFt0eXBlPW51bWJlcl1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPW51bWJlcl1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9bnVtYmVyXVtuZ01vZGVsXVwiLCBob3N0OiB7IGxpc3RlbmVyczogeyBcImlucHV0XCI6IFwib25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSlcIiwgXCJibHVyXCI6IFwib25Ub3VjaGVkKClcIiB9IH0sIHByb3ZpZGVyczogW05VTUJFUl9WQUxVRV9BQ0NFU1NPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE51bWJlclZhbHVlQWNjZXNzb3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9bnVtYmVyXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1udW1iZXJdW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogeyAnKGlucHV0KSc6ICdvbkNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW05VTUJFUl9WQUxVRV9BQ0NFU1NPUl1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSB9KTtcblxuY29uc3QgUkFESU9fVkFMVUVfQUNDRVNTT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG5mdW5jdGlvbiB0aHJvd05hbWVFcnJvcigpIHtcbiAgICB0aHJvdyBuZXcgybVSdW50aW1lRXJyb3IoMTIwMiAvKiBSdW50aW1lRXJyb3JDb2RlLk5BTUVfQU5EX0ZPUk1fQ09OVFJPTF9OQU1FX01VU1RfTUFUQ0ggKi8sIGBcbiAgICAgIElmIHlvdSBkZWZpbmUgYm90aCBhIG5hbWUgYW5kIGEgZm9ybUNvbnRyb2xOYW1lIGF0dHJpYnV0ZSBvbiB5b3VyIHJhZGlvIGJ1dHRvbiwgdGhlaXIgdmFsdWVzXG4gICAgICBtdXN0IG1hdGNoLiBFeDogPGlucHV0IHR5cGU9XCJyYWRpb1wiIGZvcm1Db250cm9sTmFtZT1cImZvb2RcIiBuYW1lPVwiZm9vZFwiPlxuICAgIGApO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENsYXNzIHVzZWQgYnkgQW5ndWxhciB0byB0cmFjayByYWRpbyBidXR0b25zLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gKi9cbmNsYXNzIFJhZGlvQ29udHJvbFJlZ2lzdHJ5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fYWNjZXNzb3JzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEFkZHMgYSBjb250cm9sIHRvIHRoZSBpbnRlcm5hbCByZWdpc3RyeS4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgICAqL1xuICAgIGFkZChjb250cm9sLCBhY2Nlc3Nvcikge1xuICAgICAgICB0aGlzLl9hY2Nlc3NvcnMucHVzaChbY29udHJvbCwgYWNjZXNzb3JdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVtb3ZlcyBhIGNvbnRyb2wgZnJvbSB0aGUgaW50ZXJuYWwgcmVnaXN0cnkuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICAgKi9cbiAgICByZW1vdmUoYWNjZXNzb3IpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2FjY2Vzc29ycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2FjY2Vzc29yc1tpXVsxXSA9PT0gYWNjZXNzb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBTZWxlY3RzIGEgcmFkaW8gYnV0dG9uLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAgICovXG4gICAgc2VsZWN0KGFjY2Vzc29yKSB7XG4gICAgICAgIHRoaXMuX2FjY2Vzc29ycy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNTYW1lR3JvdXAoYywgYWNjZXNzb3IpICYmIGNbMV0gIT09IGFjY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgY1sxXS5maXJlVW5jaGVjayhhY2Nlc3Nvci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfaXNTYW1lR3JvdXAoY29udHJvbFBhaXIsIGFjY2Vzc29yKSB7XG4gICAgICAgIGlmICghY29udHJvbFBhaXJbMF0uY29udHJvbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xQYWlyWzBdLl9wYXJlbnQgPT09IGFjY2Vzc29yLl9jb250cm9sLl9wYXJlbnQgJiZcbiAgICAgICAgICAgIGNvbnRyb2xQYWlyWzFdLm5hbWUgPT09IGFjY2Vzc29yLm5hbWU7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFJhZGlvQ29udHJvbFJlZ2lzdHJ5LCBkZXBzOiBbXSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5JbmplY3RhYmxlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtXByb3YgPSBpMC7Jtcm1bmdEZWNsYXJlSW5qZWN0YWJsZSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFJhZGlvQ29udHJvbFJlZ2lzdHJ5LCBwcm92aWRlZEluOiAncm9vdCcgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUmFkaW9Db250cm9sUmVnaXN0cnksIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBJbmplY3RhYmxlLFxuICAgICAgICAgICAgYXJnczogW3sgcHJvdmlkZWRJbjogJ3Jvb3QnIH1dXG4gICAgICAgIH1dIH0pO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciB3cml0aW5nIHJhZGlvIGNvbnRyb2wgdmFsdWVzIGFuZCBsaXN0ZW5pbmcgdG8gcmFkaW8gY29udHJvbFxuICogY2hhbmdlcy4gVGhlIHZhbHVlIGFjY2Vzc29yIGlzIHVzZWQgYnkgdGhlIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAsIGBGb3JtQ29udHJvbE5hbWVgLCBhbmRcbiAqIGBOZ01vZGVsYCBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIHJhZGlvIGJ1dHRvbnMgd2l0aCByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXNcbiAqXG4gKiBUaGUgZm9sbG93IGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSByYWRpbyBidXR0b25zIGluIGEgcmVhY3RpdmUgZm9ybS4gV2hlbiB1c2luZyByYWRpbyBidXR0b25zIGluXG4gKiBhIHJlYWN0aXZlIGZvcm0sIHJhZGlvIGJ1dHRvbnMgaW4gdGhlIHNhbWUgZ3JvdXAgc2hvdWxkIGhhdmUgdGhlIHNhbWUgYGZvcm1Db250cm9sTmFtZWAuXG4gKiBQcm92aWRpbmcgYSBgbmFtZWAgYXR0cmlidXRlIGlzIG9wdGlvbmFsLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9yZWFjdGl2ZVJhZGlvQnV0dG9ucy9yZWFjdGl2ZV9yYWRpb19idXR0b25fZXhhbXBsZS50cyByZWdpb249J1JlYWN0aXZlJ31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyLCBlbGVtZW50UmVmLCBfcmVnaXN0cnksIF9pbmplY3Rvcikge1xuICAgICAgICBzdXBlcihyZW5kZXJlciwgZWxlbWVudFJlZik7XG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5ID0gX3JlZ2lzdHJ5O1xuICAgICAgICB0aGlzLl9pbmplY3RvciA9IF9pbmplY3RvcjtcbiAgICAgICAgdGhpcy5zZXREaXNhYmxlZFN0YXRlRmlyZWQgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgY2hhbmdlIGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICAgICAgICogTm90ZTogd2UgZGVjbGFyZSBgb25DaGFuZ2VgIGhlcmUgKGFsc28gdXNlZCBhcyBob3N0IGxpc3RlbmVyKSBhcyBhIGZ1bmN0aW9uIHdpdGggbm8gYXJndW1lbnRzXG4gICAgICAgICAqIHRvIG92ZXJyaWRlIHRoZSBgb25DaGFuZ2VgIGZ1bmN0aW9uICh3aGljaCBleHBlY3RzIDEgYXJndW1lbnQpIGluIHRoZSBwYXJlbnRcbiAgICAgICAgICogYEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvcmAgY2xhc3MuXG4gICAgICAgICAqIEBub2RvY1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9ICgpID0+IHsgfTtcbiAgICAgICAgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSA9IGluamVjdChDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSwgeyBvcHRpb25hbDogdHJ1ZSB9KSA/PyBzZXREaXNhYmxlZFN0YXRlRGVmYXVsdDtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLl9jb250cm9sID0gdGhpcy5faW5qZWN0b3IuZ2V0KE5nQ29udHJvbCk7XG4gICAgICAgIHRoaXMuX2NoZWNrTmFtZSgpO1xuICAgICAgICB0aGlzLl9yZWdpc3RyeS5hZGQodGhpcy5fY29udHJvbCwgdGhpcyk7XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkucmVtb3ZlKHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBcImNoZWNrZWRcIiBwcm9wZXJ0eSB2YWx1ZSBvbiB0aGUgcmFkaW8gaW5wdXQgZWxlbWVudC5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gdmFsdWUgPT09IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ2NoZWNrZWQnLCB0aGlzLl9zdGF0ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgICAgICB0aGlzLl9mbiA9IGZuO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgZm4odGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RyeS5zZWxlY3QodGhpcyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBzZXREaXNhYmxlZFN0YXRlYCBpcyBzdXBwb3NlZCB0byBiZSBjYWxsZWQgd2hlbmV2ZXIgdGhlIGRpc2FibGVkIHN0YXRlIG9mIGEgY29udHJvbCBjaGFuZ2VzLFxuICAgICAgICAgKiBpbmNsdWRpbmcgdXBvbiBjb250cm9sIGNyZWF0aW9uLiBIb3dldmVyLCBhIGxvbmdzdGFuZGluZyBidWcgY2F1c2VkIHRoZSBtZXRob2QgdG8gbm90IGZpcmVcbiAgICAgICAgICogd2hlbiBhbiAqZW5hYmxlZCogY29udHJvbCB3YXMgYXR0YWNoZWQuIFRoaXMgYnVnIHdhcyBmaXhlZCBpbiB2MTUgaW4gIzQ3NTc2LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGhhZCBhIHNpZGUgZWZmZWN0OiBwcmV2aW91c2x5LCBpdCB3YXMgcG9zc2libGUgdG8gaW5zdGFudGlhdGUgYSByZWFjdGl2ZSBmb3JtIGNvbnRyb2xcbiAgICAgICAgICogd2l0aCBgW2F0dHIuZGlzYWJsZWRdPXRydWVgLCBldmVuIHRob3VnaCB0aGUgY29ycmVzcG9uZGluZyBjb250cm9sIHdhcyBlbmFibGVkIGluIHRoZVxuICAgICAgICAgKiBtb2RlbC4gVGhpcyByZXN1bHRlZCBpbiBhIG1pc21hdGNoIGJldHdlZW4gdGhlIG1vZGVsIGFuZCB0aGUgRE9NLiBOb3csIGJlY2F1c2VcbiAgICAgICAgICogYHNldERpc2FibGVkU3RhdGVgIGlzIGFsd2F5cyBjYWxsZWQsIHRoZSB2YWx1ZSBpbiB0aGUgRE9NIHdpbGwgYmUgaW1tZWRpYXRlbHkgb3ZlcndyaXR0ZW5cbiAgICAgICAgICogd2l0aCB0aGUgXCJjb3JyZWN0XCIgZW5hYmxlZCB2YWx1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogSG93ZXZlciwgdGhlIGZpeCBhbHNvIGNyZWF0ZWQgYW4gZXhjZXB0aW9uYWwgY2FzZTogcmFkaW8gYnV0dG9ucy4gQmVjYXVzZSBSZWFjdGl2ZSBGb3Jtc1xuICAgICAgICAgKiBtb2RlbHMgdGhlIGVudGlyZSBncm91cCBvZiByYWRpbyBidXR0b25zIGFzIGEgc2luZ2xlIGBGb3JtQ29udHJvbGAsIHRoZXJlIGlzIG5vIHdheSB0b1xuICAgICAgICAgKiBjb250cm9sIHRoZSBkaXNhYmxlZCBzdGF0ZSBmb3IgaW5kaXZpZHVhbCByYWRpb3MsIHNvIHRoZXkgY2FuIG5vIGxvbmdlciBiZSBjb25maWd1cmVkIGFzXG4gICAgICAgICAqIGRpc2FibGVkLiBUaHVzLCB3ZSBrZWVwIHRoZSBvbGQgYmVoYXZpb3IgZm9yIHJhZGlvIGJ1dHRvbnMsIHNvIHRoYXQgYFthdHRyLmRpc2FibGVkXWBcbiAgICAgICAgICogY29udGludWVzIHRvIHdvcmsuIFNwZWNpZmljYWxseSwgd2UgZHJvcCB0aGUgZmlyc3QgY2FsbCB0byBgc2V0RGlzYWJsZWRTdGF0ZWAgaWYgYGRpc2FibGVkYFxuICAgICAgICAgKiBpcyBgZmFsc2VgLCBhbmQgd2UgYXJlIG5vdCBpbiBsZWdhY3kgbW9kZS5cbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLnNldERpc2FibGVkU3RhdGVGaXJlZCB8fCBpc0Rpc2FibGVkIHx8XG4gICAgICAgICAgICB0aGlzLmNhbGxTZXREaXNhYmxlZFN0YXRlID09PSAnd2hlbkRpc2FibGVkRm9yTGVnYWN5Q29kZScpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXREaXNhYmxlZFN0YXRlRmlyZWQgPSB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBcInZhbHVlXCIgb24gdGhlIHJhZGlvIGlucHV0IGVsZW1lbnQgYW5kIHVuY2hlY2tzIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgZmlyZVVuY2hlY2sodmFsdWUpIHtcbiAgICAgICAgdGhpcy53cml0ZVZhbHVlKHZhbHVlKTtcbiAgICB9XG4gICAgX2NoZWNrTmFtZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubmFtZSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSAmJiB0aGlzLm5hbWUgIT09IHRoaXMuZm9ybUNvbnRyb2xOYW1lICYmXG4gICAgICAgICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgICAgdGhyb3dOYW1lRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubmFtZSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSlcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IHRoaXMuZm9ybUNvbnRyb2xOYW1lO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZXBzOiBbeyB0b2tlbjogaTAuUmVuZGVyZXIyIH0sIHsgdG9rZW46IGkwLkVsZW1lbnRSZWYgfSwgeyB0b2tlbjogUmFkaW9Db250cm9sUmVnaXN0cnkgfSwgeyB0b2tlbjogaTAuSW5qZWN0b3IgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvciwgc2VsZWN0b3I6IFwiaW5wdXRbdHlwZT1yYWRpb11bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPXJhZGlvXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1yYWRpb11bbmdNb2RlbF1cIiwgaW5wdXRzOiB7IG5hbWU6IFwibmFtZVwiLCBmb3JtQ29udHJvbE5hbWU6IFwiZm9ybUNvbnRyb2xOYW1lXCIsIHZhbHVlOiBcInZhbHVlXCIgfSwgaG9zdDogeyBsaXN0ZW5lcnM6IHsgXCJjaGFuZ2VcIjogXCJvbkNoYW5nZSgpXCIsIFwiYmx1clwiOiBcIm9uVG91Y2hlZCgpXCIgfSB9LCBwcm92aWRlcnM6IFtSQURJT19WQUxVRV9BQ0NFU1NPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9cmFkaW9dW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1yYWRpb11bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9cmFkaW9dW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogeyAnKGNoYW5nZSknOiAnb25DaGFuZ2UoKScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW1JBRElPX1ZBTFVFX0FDQ0VTU09SXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogaTAuUmVuZGVyZXIyIH0sIHsgdHlwZTogaTAuRWxlbWVudFJlZiB9LCB7IHR5cGU6IFJhZGlvQ29udHJvbFJlZ2lzdHJ5IH0sIHsgdHlwZTogaTAuSW5qZWN0b3IgfV0sIHByb3BEZWNvcmF0b3JzOiB7IG5hbWU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dLCBmb3JtQ29udHJvbE5hbWU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dLCB2YWx1ZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcblxuY29uc3QgUkFOR0VfVkFMVUVfQUNDRVNTT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmFuZ2VWYWx1ZUFjY2Vzc29yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyBhIHJhbmdlIHZhbHVlIGFuZCBsaXN0ZW5pbmcgdG8gcmFuZ2UgaW5wdXQgY2hhbmdlcy5cbiAqIFRoZSB2YWx1ZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IHRoZSBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBgRm9ybUNvbnRyb2xOYW1lYCwgYW5kICBgTmdNb2RlbGBcbiAqIGRpcmVjdGl2ZXMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgVXNpbmcgYSByYW5nZSBpbnB1dCB3aXRoIGEgcmVhY3RpdmUgZm9ybVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIGEgcmFuZ2UgaW5wdXQgd2l0aCBhIHJlYWN0aXZlIGZvcm0uXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGFnZUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAqIGBgYFxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJyYW5nZVwiIFtmb3JtQ29udHJvbF09XCJhZ2VDb250cm9sXCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIFJhbmdlVmFsdWVBY2Nlc3NvciBleHRlbmRzIEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgndmFsdWUnLCBwYXJzZUZsb2F0KHZhbHVlKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBmbih2YWx1ZSA9PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFJhbmdlVmFsdWVBY2Nlc3NvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBSYW5nZVZhbHVlQWNjZXNzb3IsIHNlbGVjdG9yOiBcImlucHV0W3R5cGU9cmFuZ2VdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1yYW5nZV1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9cmFuZ2VdW25nTW9kZWxdXCIsIGhvc3Q6IHsgbGlzdGVuZXJzOiB7IFwiY2hhbmdlXCI6IFwib25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSlcIiwgXCJpbnB1dFwiOiBcIm9uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpXCIsIFwiYmx1clwiOiBcIm9uVG91Y2hlZCgpXCIgfSB9LCBwcm92aWRlcnM6IFtSQU5HRV9WQUxVRV9BQ0NFU1NPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFJhbmdlVmFsdWVBY2Nlc3NvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1yYW5nZV1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPXJhbmdlXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1yYW5nZV1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnKGNoYW5nZSknOiAnb25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJyhpbnB1dCknOiAnb25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJyhibHVyKSc6ICdvblRvdWNoZWQoKSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbUkFOR0VfVkFMVUVfQUNDRVNTT1JdXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0gfSk7XG5cbi8qKlxuICogVG9rZW4gdG8gcHJvdmlkZSB0byB0dXJuIG9mZiB0aGUgbmdNb2RlbCB3YXJuaW5nIG9uIGZvcm1Db250cm9sIGFuZCBmb3JtQ29udHJvbE5hbWUuXG4gKi9cbmNvbnN0IE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW4obmdEZXZNb2RlID8gJ05nTW9kZWxXaXRoRm9ybUNvbnRyb2xXYXJuaW5nJyA6ICcnKTtcbmNvbnN0IGZvcm1Db250cm9sQmluZGluZyA9IHtcbiAgICBwcm92aWRlOiBOZ0NvbnRyb2wsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUNvbnRyb2xEaXJlY3RpdmUpXG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN5bmNocm9uaXplcyBhIHN0YW5kYWxvbmUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSB0byBhIGZvcm0gY29udHJvbCBlbGVtZW50LlxuICpcbiAqIE5vdGUgdGhhdCBzdXBwb3J0IGZvciB1c2luZyB0aGUgYG5nTW9kZWxgIGlucHV0IHByb3BlcnR5IGFuZCBgbmdNb2RlbENoYW5nZWAgZXZlbnQgd2l0aCByZWFjdGl2ZVxuICogZm9ybSBkaXJlY3RpdmVzIHdhcyBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIGlzIHNjaGVkdWxlZCBmb3IgcmVtb3ZhbCBpblxuICogYSBmdXR1cmUgdmVyc2lvbiBvZiBBbmd1bGFyLlxuICogRm9yIGRldGFpbHMsIHNlZSBbRGVwcmVjYXRlZCBmZWF0dXJlc10oZ3VpZGUvZGVwcmVjYXRpb25zI25nbW9kZWwtd2l0aC1yZWFjdGl2ZS1mb3JtcykuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSB7QGxpbmsgRm9ybUNvbnRyb2x9XG4gKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2x9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHJlZ2lzdGVyIGEgc3RhbmRhbG9uZSBjb250cm9sIGFuZCBzZXQgaXRzIHZhbHVlLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtQ29udHJvbC9zaW1wbGVfZm9ybV9jb250cm9sX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIEZvcm1Db250cm9sRGlyZWN0aXZlIGV4dGVuZHMgTmdDb250cm9sIHtcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUcmlnZ2VycyBhIHdhcm5pbmcgaW4gZGV2IG1vZGUgdGhhdCB0aGlzIGlucHV0IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIHJlYWN0aXZlIGZvcm1zLlxuICAgICAqL1xuICAgIHNldCBpc0Rpc2FibGVkKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGRpc2FibGVkQXR0cldhcm5pbmcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW55IG5nTW9kZWwgd2FybmluZ3MgaGF2ZSBiZWVuIHNlbnQgYWNyb3NzXG4gICAgICogYWxsIGluc3RhbmNlcyBvZiBGb3JtQ29udHJvbERpcmVjdGl2ZS4gVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwib25jZVwiLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgc3RhdGljIHsgdGhpcy5fbmdNb2RlbFdhcm5pbmdTZW50T25jZSA9IGZhbHNlOyB9XG4gICAgY29uc3RydWN0b3IodmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzLCB2YWx1ZUFjY2Vzc29ycywgX25nTW9kZWxXYXJuaW5nQ29uZmlnLCBjYWxsU2V0RGlzYWJsZWRTdGF0ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9uZ01vZGVsV2FybmluZ0NvbmZpZyA9IF9uZ01vZGVsV2FybmluZ0NvbmZpZztcbiAgICAgICAgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSA9IGNhbGxTZXREaXNhYmxlZFN0YXRlO1xuICAgICAgICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgICAgICAgdGhpcy51cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogSW5zdGFuY2UgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIGFuIG5nTW9kZWwgd2FybmluZyBoYXMgYmVlbiBzZW50IG91dCBmb3IgdGhpc1xuICAgICAgICAgKiBwYXJ0aWN1bGFyIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAgaW5zdGFuY2UuIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcImFsd2F5c1wiLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX25nTW9kZWxXYXJuaW5nU2VudCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgICAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gc2VsZWN0VmFsdWVBY2Nlc3Nvcih0aGlzLCB2YWx1ZUFjY2Vzc29ycyk7XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0NvbnRyb2xDaGFuZ2VkKGNoYW5nZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0Zvcm0gPSBjaGFuZ2VzWydmb3JtJ10ucHJldmlvdXNWYWx1ZTtcbiAgICAgICAgICAgIGlmIChwcmV2aW91c0Zvcm0pIHtcbiAgICAgICAgICAgICAgICBjbGVhblVwQ29udHJvbChwcmV2aW91c0Zvcm0sIHRoaXMsIC8qIHZhbGlkYXRlQ29udHJvbFByZXNlbmNlT25DaGFuZ2UgKi8gZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VXBDb250cm9sKHRoaXMuZm9ybSwgdGhpcywgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLmZvcm0udXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJvcGVydHlVcGRhdGVkKGNoYW5nZXMsIHRoaXMudmlld01vZGVsKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgICAgICAgIF9uZ01vZGVsV2FybmluZygnZm9ybUNvbnRyb2wnLCBGb3JtQ29udHJvbERpcmVjdGl2ZSwgdGhpcywgdGhpcy5fbmdNb2RlbFdhcm5pbmdDb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mb3JtLnNldFZhbHVlKHRoaXMubW9kZWwpO1xuICAgICAgICAgICAgdGhpcy52aWV3TW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybSkge1xuICAgICAgICAgICAgY2xlYW5VcENvbnRyb2wodGhpcy5mb3JtLCB0aGlzLCAvKiB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICovIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHRoYXQgcmVwcmVzZW50cyB0aGUgcGF0aCBmcm9tIHRoZSB0b3AtbGV2ZWwgZm9ybSB0byB0aGlzIGNvbnRyb2wuXG4gICAgICogRWFjaCBpbmRleCBpcyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGNvbnRyb2wgb24gdGhhdCBsZXZlbC5cbiAgICAgKi9cbiAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgYEZvcm1Db250cm9sYCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICAgKi9cbiAgICBnZXQgY29udHJvbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbCBhbmQgZW1pdHMgYW4gYG5nTW9kZWxDaGFuZ2VgIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIG5ld1ZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSB2aWV3IG1vZGVsLlxuICAgICAqL1xuICAgIHZpZXdUb01vZGVsVXBkYXRlKG5ld1ZhbHVlKSB7XG4gICAgICAgIHRoaXMudmlld01vZGVsID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlLmVtaXQobmV3VmFsdWUpO1xuICAgIH1cbiAgICBfaXNDb250cm9sQ2hhbmdlZChjaGFuZ2VzKSB7XG4gICAgICAgIHJldHVybiBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdmb3JtJyk7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1Db250cm9sRGlyZWN0aXZlLCBkZXBzOiBbeyB0b2tlbjogTkdfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfQVNZTkNfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfVkFMVUVfQUNDRVNTT1IsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsIG9wdGlvbmFsOiB0cnVlIH0sIHsgdG9rZW46IENBTExfU0VUX0RJU0FCTEVEX1NUQVRFLCBvcHRpb25hbDogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBGb3JtQ29udHJvbERpcmVjdGl2ZSwgc2VsZWN0b3I6IFwiW2Zvcm1Db250cm9sXVwiLCBpbnB1dHM6IHsgZm9ybTogW1wiZm9ybUNvbnRyb2xcIiwgXCJmb3JtXCJdLCBpc0Rpc2FibGVkOiBbXCJkaXNhYmxlZFwiLCBcImlzRGlzYWJsZWRcIl0sIG1vZGVsOiBbXCJuZ01vZGVsXCIsIFwibW9kZWxcIl0gfSwgb3V0cHV0czogeyB1cGRhdGU6IFwibmdNb2RlbENoYW5nZVwiIH0sIHByb3ZpZGVyczogW2Zvcm1Db250cm9sQmluZGluZ10sIGV4cG9ydEFzOiBbXCJuZ0Zvcm1cIl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgdXNlc09uQ2hhbmdlczogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1Db250cm9sRGlyZWN0aXZlLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3sgc2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xdJywgcHJvdmlkZXJzOiBbZm9ybUNvbnRyb2xCaW5kaW5nXSwgZXhwb3J0QXM6ICduZ0Zvcm0nIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX0FTWU5DX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19WQUxVRV9BQ0NFU1NPUl1cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkddXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtDQUxMX1NFVF9ESVNBQkxFRF9TVEFURV1cbiAgICAgICAgICAgICAgICB9XSB9XSwgcHJvcERlY29yYXRvcnM6IHsgZm9ybTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ2Zvcm1Db250cm9sJ11cbiAgICAgICAgICAgIH1dLCBpc0Rpc2FibGVkOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnZGlzYWJsZWQnXVxuICAgICAgICAgICAgfV0sIG1vZGVsOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdNb2RlbCddXG4gICAgICAgICAgICB9XSwgdXBkYXRlOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IE91dHB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ25nTW9kZWxDaGFuZ2UnXVxuICAgICAgICAgICAgfV0gfSB9KTtcblxuY29uc3QgZm9ybURpcmVjdGl2ZVByb3ZpZGVyID0ge1xuICAgIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUdyb3VwRGlyZWN0aXZlKVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQmluZHMgYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgb3IgYEZvcm1SZWNvcmRgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgYWNjZXB0cyBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCBpbnN0YW5jZS4gSXQgd2lsbCB0aGVuIHVzZSB0aGlzXG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSB0byBtYXRjaCBhbnkgY2hpbGQgYEZvcm1Db250cm9sYCwgYEZvcm1Hcm91cGAvYEZvcm1SZWNvcmRgLFxuICogYW5kIGBGb3JtQXJyYXlgIGluc3RhbmNlcyB0byBjaGlsZCBgRm9ybUNvbnRyb2xOYW1lYCwgYEZvcm1Hcm91cE5hbWVgLFxuICogYW5kIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmVzLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbH1cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIFJlZ2lzdGVyIEZvcm0gR3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmVnaXN0ZXJzIGEgYEZvcm1Hcm91cGAgd2l0aCBmaXJzdCBuYW1lIGFuZCBsYXN0IG5hbWUgY29udHJvbHMsXG4gKiBhbmQgbGlzdGVucyBmb3IgdGhlICpuZ1N1Ym1pdCogZXZlbnQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9zaW1wbGVfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBGb3JtR3JvdXBEaXJlY3RpdmUgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWxpZGF0b3JzLCBhc3luY1ZhbGlkYXRvcnMsIGNhbGxTZXREaXNhYmxlZFN0YXRlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2FsbFNldERpc2FibGVkU3RhdGUgPSBjYWxsU2V0RGlzYWJsZWRTdGF0ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGZvcm0gc3VibWlzc2lvbiBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgaW52b2tlZCB3aGVuIGNvbnRyb2xzIGluIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgY29sbGVjdGlvbiBjaGFuZ2VcbiAgICAgICAgICogKGFkZGVkIG9yIHJlbW92ZWQpLiBUaGlzIGNhbGxiYWNrIHRyaWdnZXJzIGNvcnJlc3BvbmRpbmcgRE9NIHVwZGF0ZXMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB0aGlzLl91cGRhdGVEb21WYWx1ZSgpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRyYWNrcyB0aGUgbGlzdCBvZiBhZGRlZCBgRm9ybUNvbnRyb2xOYW1lYCBpbnN0YW5jZXNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGlyZWN0aXZlcyA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRyYWNrcyB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZvcm0gPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIGZvcm0gc3VibWlzc2lvbiBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5nU3VibWl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLl9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgICAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tGb3JtUHJlc2VudCgpO1xuICAgICAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZm9ybScpKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVWYWxpZGF0b3JzKCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVEb21WYWx1ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVnaXN0cmF0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5fb2xkRm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgICAgICAgIGNsZWFuVXBWYWxpZGF0b3JzKHRoaXMuZm9ybSwgdGhpcyk7XG4gICAgICAgICAgICAvLyBDdXJyZW50bHkgdGhlIGBvbkNvbGxlY3Rpb25DaGFuZ2VgIGNhbGxiYWNrIGlzIHJld3JpdHRlbiBlYWNoIHRpbWUgdGhlXG4gICAgICAgICAgICAvLyBgX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlYCBmdW5jdGlvbiBpcyBpbnZva2VkLiBUaGUgaW1wbGljYXRpb24gaXMgdGhhdCBjbGVhbnVwIHNob3VsZFxuICAgICAgICAgICAgLy8gaGFwcGVuICpvbmx5KiB3aGVuIHRoZSBgb25Db2xsZWN0aW9uQ2hhbmdlYCBjYWxsYmFjayB3YXMgc2V0IGJ5IHRoaXMgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIGl0IG1pZ2h0IGNhdXNlIG92ZXJyaWRpbmcgYSBjYWxsYmFjayBvZiBzb21lIG90aGVyIGRpcmVjdGl2ZSBpbnN0YW5jZXMuIFdlIHNob3VsZFxuICAgICAgICAgICAgLy8gY29uc2lkZXIgdXBkYXRpbmcgdGhpcyBsb2dpYyBsYXRlciB0byBtYWtlIGl0IHNpbWlsYXIgdG8gaG93IGBvbkNoYW5nZWAgY2FsbGJhY2tzIGFyZVxuICAgICAgICAgICAgLy8gaGFuZGxlZCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzM5NzMyIGZvciBhZGRpdGlvbmFsIGluZm8uXG4gICAgICAgICAgICBpZiAodGhpcy5mb3JtLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPT09IHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4geyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXR1cm5zIHRoaXMgZGlyZWN0aXZlJ3MgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0IGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXR1cm5zIHRoZSBgRm9ybUdyb3VwYCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICAgKi9cbiAgICBnZXQgY29udHJvbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhpcyBncm91cC4gQmVjYXVzZSB0aGlzIGRpcmVjdGl2ZVxuICAgICAqIGFsd2F5cyBsaXZlcyBhdCB0aGUgdG9wIGxldmVsIG9mIGEgZm9ybSwgaXQgYWx3YXlzIGFuIGVtcHR5IGFycmF5LlxuICAgICAqL1xuICAgIGdldCBwYXRoKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIE1ldGhvZCB0aGF0IHNldHMgdXAgdGhlIGNvbnRyb2wgZGlyZWN0aXZlIGluIHRoaXMgZ3JvdXAsIHJlLWNhbGN1bGF0ZXMgaXRzIHZhbHVlXG4gICAgICogYW5kIHZhbGlkaXR5LCBhbmQgYWRkcyB0aGUgaW5zdGFuY2UgdG8gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBhZGRDb250cm9sKGRpcikge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICAgIHNldFVwQ29udHJvbChjdHJsLCBkaXIsIHRoaXMuY2FsbFNldERpc2FibGVkU3RhdGUpO1xuICAgICAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMucHVzaChkaXIpO1xuICAgICAgICByZXR1cm4gY3RybDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0cmlldmVzIHRoZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIGZyb20gdGhlIHByb3ZpZGVkIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZVxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGdldENvbnRyb2woZGlyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVtb3ZlcyB0aGUgYEZvcm1Db250cm9sTmFtZWAgaW5zdGFuY2UgZnJvbSB0aGUgaW50ZXJuYWwgbGlzdCBvZiBkaXJlY3RpdmVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgcmVtb3ZlQ29udHJvbChkaXIpIHtcbiAgICAgICAgY2xlYW5VcENvbnRyb2woZGlyLmNvbnRyb2wgfHwgbnVsbCwgZGlyLCAvKiB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICovIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlTGlzdEl0ZW0kMSh0aGlzLmRpcmVjdGl2ZXMsIGRpcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBuZXcgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSB0byB0aGUgZm9ybS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgYWRkRm9ybUdyb3VwKGRpcikge1xuICAgICAgICB0aGlzLl9zZXRVcEZvcm1Db250YWluZXIoZGlyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgdGhlIG5lY2Vzc2FyeSBjbGVhbnVwIHdoZW4gYSBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIGlzIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgKiB2aWV3LlxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICByZW1vdmVGb3JtR3JvdXAoZGlyKSB7XG4gICAgICAgIHRoaXMuX2NsZWFuVXBGb3JtQ29udGFpbmVyKGRpcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHJpZXZlcyB0aGUgYEZvcm1Hcm91cGAgZm9yIGEgcHJvdmlkZWQgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBnZXRGb3JtR3JvdXAoZGlyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgdGhlIG5lY2Vzc2FyeSBzZXR1cCB3aGVuIGEgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyBhZGRlZCB0byB0aGUgdmlldy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgYWRkRm9ybUFycmF5KGRpcikge1xuICAgICAgICB0aGlzLl9zZXRVcEZvcm1Db250YWluZXIoZGlyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgdGhlIG5lY2Vzc2FyeSBjbGVhbnVwIHdoZW4gYSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIGlzIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgKiB2aWV3LlxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICByZW1vdmVGb3JtQXJyYXkoZGlyKSB7XG4gICAgICAgIHRoaXMuX2NsZWFuVXBGb3JtQ29udGFpbmVyKGRpcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHJpZXZlcyB0aGUgYEZvcm1BcnJheWAgZm9yIGEgcHJvdmlkZWQgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0Rm9ybUFycmF5KGRpcikge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHByb3ZpZGVkIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGRpcmVjdGl2ZSdzIGNvbnRyb2wuXG4gICAgICovXG4gICAgdXBkYXRlTW9kZWwoZGlyLCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICAgIGN0cmwuc2V0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBNZXRob2QgY2FsbGVkIHdpdGggdGhlIFwic3VibWl0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgICAqIFRyaWdnZXJzIHRoZSBgbmdTdWJtaXRgIGVtaXR0ZXIgdG8gZW1pdCB0aGUgXCJzdWJtaXRcIiBldmVudCBhcyBpdHMgcGF5bG9hZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZXZlbnQgVGhlIFwic3VibWl0XCIgZXZlbnQgb2JqZWN0XG4gICAgICovXG4gICAgb25TdWJtaXQoJGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc3luY1BlbmRpbmdDb250cm9scyh0aGlzLmZvcm0sIHRoaXMuZGlyZWN0aXZlcyk7XG4gICAgICAgIHRoaXMubmdTdWJtaXQuZW1pdCgkZXZlbnQpO1xuICAgICAgICAvLyBGb3JtcyB3aXRoIGBtZXRob2Q9XCJkaWFsb2dcImAgaGF2ZSBzb21lIHNwZWNpYWwgYmVoYXZpb3IgdGhhdCB3b24ndCByZWxvYWQgdGhlIHBhZ2UgYW5kIHRoYXRcbiAgICAgICAgLy8gc2hvdWxkbid0IGJlIHByZXZlbnRlZC4gTm90ZSB0aGF0IHdlIG5lZWQgdG8gbnVsbCBjaGVjayB0aGUgYGV2ZW50YCBhbmQgdGhlIGB0YXJnZXRgLCBiZWNhdXNlXG4gICAgICAgIC8vIHNvbWUgaW50ZXJuYWwgYXBwcyBjYWxsIHRoaXMgbWV0aG9kIGRpcmVjdGx5IHdpdGggdGhlIHdyb25nIGFyZ3VtZW50cy5cbiAgICAgICAgcmV0dXJuICRldmVudD8udGFyZ2V0Py5tZXRob2QgPT09ICdkaWFsb2cnO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIFwicmVzZXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAgICovXG4gICAgb25SZXNldCgpIHtcbiAgICAgICAgdGhpcy5yZXNldEZvcm0oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVzZXRzIHRoZSBmb3JtIHRvIGFuIGluaXRpYWwgdmFsdWUgYW5kIHJlc2V0cyBpdHMgc3VibWl0dGVkIHN0YXR1cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZm9ybS5cbiAgICAgKi9cbiAgICByZXNldEZvcm0odmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5mb3JtLnJlc2V0KHZhbHVlKTtcbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF91cGRhdGVEb21WYWx1ZSgpIHtcbiAgICAgICAgdGhpcy5kaXJlY3RpdmVzLmZvckVhY2goZGlyID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9sZEN0cmwgPSBkaXIuY29udHJvbDtcbiAgICAgICAgICAgIGNvbnN0IG5ld0N0cmwgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICAgICAgICAgIGlmIChvbGRDdHJsICE9PSBuZXdDdHJsKSB7XG4gICAgICAgICAgICAgICAgLy8gTm90ZTogdGhlIHZhbHVlIG9mIHRoZSBgZGlyLmNvbnRyb2xgIG1heSBub3QgYmUgZGVmaW5lZCwgZm9yIGV4YW1wbGUgd2hlbiBpdCdzIGEgZmlyc3RcbiAgICAgICAgICAgICAgICAvLyBgRm9ybUNvbnRyb2xgIHRoYXQgaXMgYWRkZWQgdG8gYSBgRm9ybUdyb3VwYCBpbnN0YW5jZSAodmlhIGBhZGRDb250cm9sYCBjYWxsKS5cbiAgICAgICAgICAgICAgICBjbGVhblVwQ29udHJvbChvbGRDdHJsIHx8IG51bGwsIGRpcik7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBuZXcgY29udHJvbCBhdCB0aGUgc2FtZSBsb2NhdGlvbiBpbnNpZGUgdGhlIGNvcnJlc3BvbmRpbmcgYEZvcm1Hcm91cGAgaXMgYW5cbiAgICAgICAgICAgICAgICAvLyBpbnN0YW5jZSBvZiBgRm9ybUNvbnRyb2xgIGFuZCBwZXJmb3JtIGNvbnRyb2wgc2V0dXAgb25seSBpZiB0aGF0J3MgdGhlIGNhc2UuXG4gICAgICAgICAgICAgICAgLy8gTm90ZTogd2UgZG9uJ3QgbmVlZCB0byBjbGVhciB0aGUgbGlzdCBvZiBkaXJlY3RpdmVzIChgdGhpcy5kaXJlY3RpdmVzYCkgaGVyZSwgaXQgd291bGQgYmVcbiAgICAgICAgICAgICAgICAvLyB0YWtlbiBjYXJlIG9mIGluIHRoZSBgcmVtb3ZlQ29udHJvbGAgbWV0aG9kIGludm9rZWQgd2hlbiBjb3JyZXNwb25kaW5nIGBmb3JtQ29udHJvbE5hbWVgXG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0aXZlIGluc3RhbmNlIGlzIGJlaW5nIHJlbW92ZWQgKGludm9rZWQgZnJvbSBgRm9ybUNvbnRyb2xOYW1lLm5nT25EZXN0cm95YCkuXG4gICAgICAgICAgICAgICAgaWYgKGlzRm9ybUNvbnRyb2wobmV3Q3RybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VXBDb250cm9sKG5ld0N0cmwsIGRpciwgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGRpci5jb250cm9sID0gbmV3Q3RybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZvcm0uX3VwZGF0ZVRyZWVWYWxpZGl0eSh7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgfVxuICAgIF9zZXRVcEZvcm1Db250YWluZXIoZGlyKSB7XG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICAgICAgc2V0VXBGb3JtQ29udGFpbmVyKGN0cmwsIGRpcik7XG4gICAgICAgIC8vIE5PVEU6IHRoaXMgb3BlcmF0aW9uIGxvb2tzIHVubmVjZXNzYXJ5IGluIGNhc2Ugbm8gbmV3IHZhbGlkYXRvcnMgd2VyZSBhZGRlZCBpblxuICAgICAgICAvLyBgc2V0VXBGb3JtQ29udGFpbmVyYCBjYWxsLiBDb25zaWRlciB1cGRhdGluZyB0aGlzIGNvZGUgdG8gbWF0Y2ggdGhlIGxvZ2ljIGluXG4gICAgICAgIC8vIGBfY2xlYW5VcEZvcm1Db250YWluZXJgIGZ1bmN0aW9uLlxuICAgICAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgIH1cbiAgICBfY2xlYW5VcEZvcm1Db250YWluZXIoZGlyKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICAgICAgICAgIGlmIChjdHJsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb250cm9sVXBkYXRlZCA9IGNsZWFuVXBGb3JtQ29udGFpbmVyKGN0cmwsIGRpcik7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ29udHJvbFVwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUnVuIHZhbGlkaXR5IGNoZWNrIG9ubHkgaW4gY2FzZSBhIGNvbnRyb2wgd2FzIHVwZGF0ZWQgKGkuZS4gdmlldyB2YWxpZGF0b3JzIHdlcmVcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlZCkgYXMgcmVtb3ZpbmcgdmlldyB2YWxpZGF0b3JzIG1pZ2h0IGNhdXNlIHZhbGlkaXR5IHRvIGNoYW5nZS5cbiAgICAgICAgICAgICAgICAgICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3VwZGF0ZVJlZ2lzdHJhdGlvbnMoKSB7XG4gICAgICAgIHRoaXMuZm9ybS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICAgICAgaWYgKHRoaXMuX29sZEZvcm0pIHtcbiAgICAgICAgICAgIHRoaXMuX29sZEZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHsgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3VwZGF0ZVZhbGlkYXRvcnMoKSB7XG4gICAgICAgIHNldFVwVmFsaWRhdG9ycyh0aGlzLmZvcm0sIHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5fb2xkRm9ybSkge1xuICAgICAgICAgICAgY2xlYW5VcFZhbGlkYXRvcnModGhpcy5fb2xkRm9ybSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NoZWNrRm9ybVByZXNlbnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5mb3JtICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBtaXNzaW5nRm9ybUV4Y2VwdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1Hcm91cERpcmVjdGl2ZSwgZGVwczogW3sgdG9rZW46IE5HX1ZBTElEQVRPUlMsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IE5HX0FTWU5DX1ZBTElEQVRPUlMsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IENBTExfU0VUX0RJU0FCTEVEX1NUQVRFLCBvcHRpb25hbDogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBGb3JtR3JvdXBEaXJlY3RpdmUsIHNlbGVjdG9yOiBcIltmb3JtR3JvdXBdXCIsIGlucHV0czogeyBmb3JtOiBbXCJmb3JtR3JvdXBcIiwgXCJmb3JtXCJdIH0sIG91dHB1dHM6IHsgbmdTdWJtaXQ6IFwibmdTdWJtaXRcIiB9LCBob3N0OiB7IGxpc3RlbmVyczogeyBcInN1Ym1pdFwiOiBcIm9uU3VibWl0KCRldmVudClcIiwgXCJyZXNldFwiOiBcIm9uUmVzZXQoKVwiIH0gfSwgcHJvdmlkZXJzOiBbZm9ybURpcmVjdGl2ZVByb3ZpZGVyXSwgZXhwb3J0QXM6IFtcIm5nRm9ybVwiXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCB1c2VzT25DaGFuZ2VzOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRm9ybUdyb3VwRGlyZWN0aXZlLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdbZm9ybUdyb3VwXScsXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJyhzdWJtaXQpJzogJ29uU3VibWl0KCRldmVudCknLCAnKHJlc2V0KSc6ICdvblJlc2V0KCknIH0sXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydEFzOiAnbmdGb3JtJ1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX0FTWU5DX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtDQUxMX1NFVF9ESVNBQkxFRF9TVEFURV1cbiAgICAgICAgICAgICAgICB9XSB9XSwgcHJvcERlY29yYXRvcnM6IHsgZm9ybTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ2Zvcm1Hcm91cCddXG4gICAgICAgICAgICB9XSwgbmdTdWJtaXQ6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogT3V0cHV0XG4gICAgICAgICAgICB9XSB9IH0pO1xuXG5jb25zdCBmb3JtR3JvdXBOYW1lUHJvdmlkZXIgPSB7XG4gICAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBGb3JtR3JvdXBOYW1lKVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogU3luY3MgYSBuZXN0ZWQgYEZvcm1Hcm91cGAgb3IgYEZvcm1SZWNvcmRgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgY2FuIG9ubHkgYmUgdXNlZCB3aXRoIGEgcGFyZW50IGBGb3JtR3JvdXBEaXJlY3RpdmVgLlxuICpcbiAqIEl0IGFjY2VwdHMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBuZXN0ZWQgYEZvcm1Hcm91cGAgb3IgYEZvcm1SZWNvcmRgIHRvIGxpbmssIGFuZFxuICogbG9va3MgZm9yIGEgYEZvcm1Hcm91cGAgb3IgYEZvcm1SZWNvcmRgIHJlZ2lzdGVyZWQgd2l0aCB0aGF0IG5hbWUgaW4gdGhlIHBhcmVudFxuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgeW91IHBhc3NlZCBpbnRvIGBGb3JtR3JvdXBEaXJlY3RpdmVgLlxuICpcbiAqIFVzZSBuZXN0ZWQgZm9ybSBncm91cHMgdG8gdmFsaWRhdGUgYSBzdWItZ3JvdXAgb2YgYVxuICogZm9ybSBzZXBhcmF0ZWx5IGZyb20gdGhlIHJlc3Qgb3IgdG8gZ3JvdXAgdGhlIHZhbHVlcyBvZiBjZXJ0YWluXG4gKiBjb250cm9scyBpbnRvIHRoZWlyIG93biBuZXN0ZWQgb2JqZWN0LlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBY2Nlc3MgdGhlIGdyb3VwIGJ5IG5hbWVcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgdXNlcyB0aGUgYEFic3RyYWN0Q29udHJvbC5nZXRgIG1ldGhvZCB0byBhY2Nlc3MgdGhlXG4gKiBhc3NvY2lhdGVkIGBGb3JtR3JvdXBgXG4gKlxuICogYGBgdHNcbiAqICAgdGhpcy5mb3JtLmdldCgnbmFtZScpO1xuICogYGBgXG4gKlxuICogIyMjIEFjY2VzcyBpbmRpdmlkdWFsIGNvbnRyb2xzIGluIHRoZSBncm91cFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSB1c2VzIHRoZSBgQWJzdHJhY3RDb250cm9sLmdldGAgbWV0aG9kIHRvIGFjY2Vzc1xuICogaW5kaXZpZHVhbCBjb250cm9scyB3aXRoaW4gdGhlIGdyb3VwIHVzaW5nIGRvdCBzeW50YXguXG4gKlxuICogYGBgdHNcbiAqICAgdGhpcy5mb3JtLmdldCgnbmFtZS5maXJzdCcpO1xuICogYGBgXG4gKlxuICogIyMjIFJlZ2lzdGVyIGEgbmVzdGVkIGBGb3JtR3JvdXBgLlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSByZWdpc3RlcnMgYSBuZXN0ZWQgKm5hbWUqIGBGb3JtR3JvdXBgIHdpdGhpbiBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCxcbiAqIGFuZCBwcm92aWRlcyBtZXRob2RzIHRvIHJldHJpZXZlIHRoZSBuZXN0ZWQgYEZvcm1Hcm91cGAgYW5kIGluZGl2aWR1YWwgY29udHJvbHMuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL25lc3RlZEZvcm1Hcm91cC9uZXN0ZWRfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBGb3JtR3JvdXBOYW1lIGV4dGVuZHMgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgdmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgRm9ybUdyb3VwYCBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBUaGUgbmFtZSBjb3JyZXNwb25kc1xuICAgICAgICAgKiB0byBhIGtleSBpbiB0aGUgcGFyZW50IGBGb3JtR3JvdXBgIG9yIGBGb3JtQXJyYXlgLlxuICAgICAgICAgKiBBY2NlcHRzIGEgbmFtZSBhcyBhIHN0cmluZyBvciBhIG51bWJlci5cbiAgICAgICAgICogVGhlIG5hbWUgaW4gdGhlIGZvcm0gb2YgYSBzdHJpbmcgaXMgdXNlZnVsIGZvciBpbmRpdmlkdWFsIGZvcm1zLFxuICAgICAgICAgKiB3aGlsZSB0aGUgbnVtZXJpY2FsIGZvcm0gYWxsb3dzIGZvciBmb3JtIGdyb3VwcyB0byBiZSBib3VuZFxuICAgICAgICAgKiB0byBpbmRpY2VzIHdoZW4gaXRlcmF0aW5nIG92ZXIgZ3JvdXBzIGluIGEgYEZvcm1BcnJheWAuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgICAgIHRoaXMuX3NldEFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2NoZWNrUGFyZW50VHlwZSgpIHtcbiAgICAgICAgaWYgKF9oYXNJbnZhbGlkUGFyZW50KHRoaXMuX3BhcmVudCkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgICAgIHRocm93IGdyb3VwUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRm9ybUdyb3VwTmFtZSwgZGVwczogW3sgdG9rZW46IENvbnRyb2xDb250YWluZXIsIGhvc3Q6IHRydWUsIG9wdGlvbmFsOiB0cnVlLCBza2lwU2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19BU1lOQ19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBGb3JtR3JvdXBOYW1lLCBzZWxlY3RvcjogXCJbZm9ybUdyb3VwTmFtZV1cIiwgaW5wdXRzOiB7IG5hbWU6IFtcImZvcm1Hcm91cE5hbWVcIiwgXCJuYW1lXCJdIH0sIHByb3ZpZGVyczogW2Zvcm1Hcm91cE5hbWVQcm92aWRlcl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1Hcm91cE5hbWUsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbeyBzZWxlY3RvcjogJ1tmb3JtR3JvdXBOYW1lXScsIHByb3ZpZGVyczogW2Zvcm1Hcm91cE5hbWVQcm92aWRlcl0gfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiBDb250cm9sQ29udGFpbmVyLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSG9zdFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2tpcFNlbGZcbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19BU1lOQ19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH1dLCBwcm9wRGVjb3JhdG9yczogeyBuYW1lOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnZm9ybUdyb3VwTmFtZSddXG4gICAgICAgICAgICB9XSB9IH0pO1xuY29uc3QgZm9ybUFycmF5TmFtZVByb3ZpZGVyID0ge1xuICAgIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUFycmF5TmFtZSlcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFN5bmNzIGEgbmVzdGVkIGBGb3JtQXJyYXlgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgZGVzaWduZWQgdG8gYmUgdXNlZCB3aXRoIGEgcGFyZW50IGBGb3JtR3JvdXBEaXJlY3RpdmVgIChzZWxlY3RvcjpcbiAqIGBbZm9ybUdyb3VwXWApLlxuICpcbiAqIEl0IGFjY2VwdHMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBuZXN0ZWQgYEZvcm1BcnJheWAgeW91IHdhbnQgdG8gbGluaywgYW5kXG4gKiB3aWxsIGxvb2sgZm9yIGEgYEZvcm1BcnJheWAgcmVnaXN0ZXJlZCB3aXRoIHRoYXQgbmFtZSBpbiB0aGUgcGFyZW50XG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSB5b3UgcGFzc2VkIGludG8gYEZvcm1Hcm91cERpcmVjdGl2ZWAuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sfVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvbmVzdGVkRm9ybUFycmF5L25lc3RlZF9mb3JtX2FycmF5X2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIEZvcm1BcnJheU5hbWUgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9ycykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgYEZvcm1BcnJheWAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICAgICAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YC5cbiAgICAgICAgICogQWNjZXB0cyBhIG5hbWUgYXMgYSBzdHJpbmcgb3IgYSBudW1iZXIuXG4gICAgICAgICAqIFRoZSBuYW1lIGluIHRoZSBmb3JtIG9mIGEgc3RyaW5nIGlzIHVzZWZ1bCBmb3IgaW5kaXZpZHVhbCBmb3JtcyxcbiAgICAgICAgICogd2hpbGUgdGhlIG51bWVyaWNhbCBmb3JtIGFsbG93cyBmb3IgZm9ybSBhcnJheXMgdG8gYmUgYm91bmRcbiAgICAgICAgICogdG8gaW5kaWNlcyB3aGVuIGl0ZXJhdGluZyBvdmVyIGFycmF5cyBpbiBhIGBGb3JtQXJyYXlgLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLl9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgICAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBkaXJlY3RpdmUncyBpbnB1dHMgYXJlIGluaXRpYWxpemVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAgICogQHRocm93cyBJZiB0aGUgZGlyZWN0aXZlIGRvZXMgbm90IGhhdmUgYSB2YWxpZCBwYXJlbnQuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUuYWRkRm9ybUFycmF5KHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIGxpZmVjeWNsZSBtZXRob2QgY2FsbGVkIGJlZm9yZSB0aGUgZGlyZWN0aXZlJ3MgaW5zdGFuY2UgaXMgZGVzdHJveWVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS5yZW1vdmVGb3JtQXJyYXkodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhlIGBGb3JtQXJyYXlgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgICAqL1xuICAgIGdldCBjb250cm9sKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtRGlyZWN0aXZlLmdldEZvcm1BcnJheSh0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUgZm9yIHRoaXMgZ3JvdXAgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAgICovXG4gICAgZ2V0IGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgICAqL1xuICAgIGdldCBwYXRoKCkge1xuICAgICAgICByZXR1cm4gY29udHJvbFBhdGgodGhpcy5uYW1lID09IG51bGwgPyB0aGlzLm5hbWUgOiB0aGlzLm5hbWUudG9TdHJpbmcoKSwgdGhpcy5fcGFyZW50KTtcbiAgICB9XG4gICAgX2NoZWNrUGFyZW50VHlwZSgpIHtcbiAgICAgICAgaWYgKF9oYXNJbnZhbGlkUGFyZW50KHRoaXMuX3BhcmVudCkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgICAgIHRocm93IGFycmF5UGFyZW50RXhjZXB0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRm9ybUFycmF5TmFtZSwgZGVwczogW3sgdG9rZW46IENvbnRyb2xDb250YWluZXIsIGhvc3Q6IHRydWUsIG9wdGlvbmFsOiB0cnVlLCBza2lwU2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19BU1lOQ19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBGb3JtQXJyYXlOYW1lLCBzZWxlY3RvcjogXCJbZm9ybUFycmF5TmFtZV1cIiwgaW5wdXRzOiB7IG5hbWU6IFtcImZvcm1BcnJheU5hbWVcIiwgXCJuYW1lXCJdIH0sIHByb3ZpZGVyczogW2Zvcm1BcnJheU5hbWVQcm92aWRlcl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1BcnJheU5hbWUsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbeyBzZWxlY3RvcjogJ1tmb3JtQXJyYXlOYW1lXScsIHByb3ZpZGVyczogW2Zvcm1BcnJheU5hbWVQcm92aWRlcl0gfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiBDb250cm9sQ29udGFpbmVyLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSG9zdFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2tpcFNlbGZcbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19BU1lOQ19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH1dLCBwcm9wRGVjb3JhdG9yczogeyBuYW1lOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnZm9ybUFycmF5TmFtZSddXG4gICAgICAgICAgICB9XSB9IH0pO1xuZnVuY3Rpb24gX2hhc0ludmFsaWRQYXJlbnQocGFyZW50KSB7XG4gICAgcmV0dXJuICEocGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwTmFtZSkgJiYgIShwYXJlbnQgaW5zdGFuY2VvZiBGb3JtR3JvdXBEaXJlY3RpdmUpICYmXG4gICAgICAgICEocGFyZW50IGluc3RhbmNlb2YgRm9ybUFycmF5TmFtZSk7XG59XG5cbmNvbnN0IGNvbnRyb2xOYW1lQmluZGluZyA9IHtcbiAgICBwcm92aWRlOiBOZ0NvbnRyb2wsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUNvbnRyb2xOYW1lKVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBTeW5jcyBhIGBGb3JtQ29udHJvbGAgaW4gYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgdG8gYSBmb3JtIGNvbnRyb2xcbiAqIGVsZW1lbnQgYnkgbmFtZS5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIHtAbGluayBGb3JtQ29udHJvbH1cbiAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbH1cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBSZWdpc3RlciBgRm9ybUNvbnRyb2xgIHdpdGhpbiBhIGdyb3VwXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byByZWdpc3RlciBtdWx0aXBsZSBmb3JtIGNvbnRyb2xzIHdpdGhpbiBhIGZvcm0gZ3JvdXBcbiAqIGFuZCBzZXQgdGhlaXIgdmFsdWUuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9zaW1wbGVfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBUbyBzZWUgYGZvcm1Db250cm9sTmFtZWAgZXhhbXBsZXMgd2l0aCBkaWZmZXJlbnQgZm9ybSBjb250cm9sIHR5cGVzLCBzZWU6XG4gKlxuICogKiBSYWRpbyBidXR0b25zOiBgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvcmBcbiAqICogU2VsZWN0czogYFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yYFxuICpcbiAqICMjIyBVc2Ugd2l0aCBuZ01vZGVsIGlzIGRlcHJlY2F0ZWRcbiAqXG4gKiBTdXBwb3J0IGZvciB1c2luZyB0aGUgYG5nTW9kZWxgIGlucHV0IHByb3BlcnR5IGFuZCBgbmdNb2RlbENoYW5nZWAgZXZlbnQgd2l0aCByZWFjdGl2ZVxuICogZm9ybSBkaXJlY3RpdmVzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gQW5ndWxhciB2NiBhbmQgaXMgc2NoZWR1bGVkIGZvciByZW1vdmFsIGluXG4gKiBhIGZ1dHVyZSB2ZXJzaW9uIG9mIEFuZ3VsYXIuXG4gKlxuICogRm9yIGRldGFpbHMsIHNlZSBbRGVwcmVjYXRlZCBmZWF0dXJlc10oZ3VpZGUvZGVwcmVjYXRpb25zI25nbW9kZWwtd2l0aC1yZWFjdGl2ZS1mb3JtcykuXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgRm9ybUNvbnRyb2xOYW1lIGV4dGVuZHMgTmdDb250cm9sIHtcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUcmlnZ2VycyBhIHdhcm5pbmcgaW4gZGV2IG1vZGUgdGhhdCB0aGlzIGlucHV0IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIHJlYWN0aXZlIGZvcm1zLlxuICAgICAqL1xuICAgIHNldCBpc0Rpc2FibGVkKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGRpc2FibGVkQXR0cldhcm5pbmcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW55IG5nTW9kZWwgd2FybmluZ3MgaGF2ZSBiZWVuIHNlbnQgYWNyb3NzXG4gICAgICogYWxsIGluc3RhbmNlcyBvZiBGb3JtQ29udHJvbE5hbWUuIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcIm9uY2VcIi5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHN0YXRpYyB7IHRoaXMuX25nTW9kZWxXYXJuaW5nU2VudE9uY2UgPSBmYWxzZTsgfVxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgdmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzLCB2YWx1ZUFjY2Vzc29ycywgX25nTW9kZWxXYXJuaW5nQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX25nTW9kZWxXYXJuaW5nQ29uZmlnID0gX25nTW9kZWxXYXJuaW5nQ29uZmlnO1xuICAgICAgICB0aGlzLl9hZGRlZCA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgYEZvcm1Db250cm9sYCBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBUaGUgbmFtZSBjb3JyZXNwb25kc1xuICAgICAgICAgKiB0byBhIGtleSBpbiB0aGUgcGFyZW50IGBGb3JtR3JvdXBgIG9yIGBGb3JtQXJyYXlgLlxuICAgICAgICAgKiBBY2NlcHRzIGEgbmFtZSBhcyBhIHN0cmluZyBvciBhIG51bWJlci5cbiAgICAgICAgICogVGhlIG5hbWUgaW4gdGhlIGZvcm0gb2YgYSBzdHJpbmcgaXMgdXNlZnVsIGZvciBpbmRpdmlkdWFsIGZvcm1zLFxuICAgICAgICAgKiB3aGlsZSB0aGUgbnVtZXJpY2FsIGZvcm0gYWxsb3dzIGZvciBmb3JtIGNvbnRyb2xzIHRvIGJlIGJvdW5kXG4gICAgICAgICAqIHRvIGluZGljZXMgd2hlbiBpdGVyYXRpbmcgb3ZlciBjb250cm9scyBpbiBhIGBGb3JtQXJyYXlgLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovXG4gICAgICAgIHRoaXMudXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEluc3RhbmNlIHByb3BlcnR5IHVzZWQgdG8gdHJhY2sgd2hldGhlciBhbiBuZ01vZGVsIHdhcm5pbmcgaGFzIGJlZW4gc2VudCBvdXQgZm9yIHRoaXNcbiAgICAgICAgICogcGFydGljdWxhciBGb3JtQ29udHJvbE5hbWUgaW5zdGFuY2UuIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcImFsd2F5c1wiLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX25nTW9kZWxXYXJuaW5nU2VudCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgICAgIHRoaXMuX3NldEFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICAgICAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBzZWxlY3RWYWx1ZUFjY2Vzc29yKHRoaXMsIHZhbHVlQWNjZXNzb3JzKTtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hZGRlZClcbiAgICAgICAgICAgIHRoaXMuX3NldFVwQ29udHJvbCgpO1xuICAgICAgICBpZiAoaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdGhpcy52aWV3TW9kZWwpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICAgICAgICAgICAgX25nTW9kZWxXYXJuaW5nKCdmb3JtQ29udHJvbE5hbWUnLCBGb3JtQ29udHJvbE5hbWUsIHRoaXMsIHRoaXMuX25nTW9kZWxXYXJuaW5nQ29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudmlld01vZGVsID0gdGhpcy5tb2RlbDtcbiAgICAgICAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS51cGRhdGVNb2RlbCh0aGlzLCB0aGlzLm1vZGVsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS5yZW1vdmVDb250cm9sKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwgYW5kIGVtaXRzIGFuIGBuZ01vZGVsQ2hhbmdlYCBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbC5cbiAgICAgKi9cbiAgICB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLnZpZXdNb2RlbCA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZS5lbWl0KG5ld1ZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgICAqIEVhY2ggaW5kZXggaXMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBjb250cm9sIG9uIHRoYXQgbGV2ZWwuXG4gICAgICovXG4gICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgIHJldHVybiBjb250cm9sUGF0aCh0aGlzLm5hbWUgPT0gbnVsbCA/IHRoaXMubmFtZSA6IHRoaXMubmFtZS50b1N0cmluZygpLCB0aGlzLl9wYXJlbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgdG9wLWxldmVsIGRpcmVjdGl2ZSBmb3IgdGhpcyBncm91cCBpZiBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAgICAgKi9cbiAgICBnZXQgZm9ybURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudCA/IHRoaXMuX3BhcmVudC5mb3JtRGlyZWN0aXZlIDogbnVsbDtcbiAgICB9XG4gICAgX2NoZWNrUGFyZW50VHlwZSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgICAgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwTmFtZSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5nTW9kZWxHcm91cEV4Y2VwdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBGb3JtR3JvdXBOYW1lKSAmJlxuICAgICAgICAgICAgICAgICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwRGlyZWN0aXZlKSAmJlxuICAgICAgICAgICAgICAgICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUFycmF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBjb250cm9sUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3NldFVwQ29udHJvbCgpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tQYXJlbnRUeXBlKCk7XG4gICAgICAgIHRoaXMuY29udHJvbCA9IHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRDb250cm9sKHRoaXMpO1xuICAgICAgICB0aGlzLl9hZGRlZCA9IHRydWU7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1Db250cm9sTmFtZSwgZGVwczogW3sgdG9rZW46IENvbnRyb2xDb250YWluZXIsIGhvc3Q6IHRydWUsIG9wdGlvbmFsOiB0cnVlLCBza2lwU2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19BU1lOQ19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19WQUxVRV9BQ0NFU1NPUiwgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORywgb3B0aW9uYWw6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogRm9ybUNvbnRyb2xOYW1lLCBzZWxlY3RvcjogXCJbZm9ybUNvbnRyb2xOYW1lXVwiLCBpbnB1dHM6IHsgbmFtZTogW1wiZm9ybUNvbnRyb2xOYW1lXCIsIFwibmFtZVwiXSwgaXNEaXNhYmxlZDogW1wiZGlzYWJsZWRcIiwgXCJpc0Rpc2FibGVkXCJdLCBtb2RlbDogW1wibmdNb2RlbFwiLCBcIm1vZGVsXCJdIH0sIG91dHB1dHM6IHsgdXBkYXRlOiBcIm5nTW9kZWxDaGFuZ2VcIiB9LCBwcm92aWRlcnM6IFtjb250cm9sTmFtZUJpbmRpbmddLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIHVzZXNPbkNoYW5nZXM6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtQ29udHJvbE5hbWUsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbeyBzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdJywgcHJvdmlkZXJzOiBbY29udHJvbE5hbWVCaW5kaW5nXSB9XVxuICAgICAgICB9XSwgY3RvclBhcmFtZXRlcnM6ICgpID0+IFt7IHR5cGU6IENvbnRyb2xDb250YWluZXIsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBIb3N0XG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTa2lwU2VsZlxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX0FTWU5DX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19WQUxVRV9BQ0NFU1NPUl1cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkddXG4gICAgICAgICAgICAgICAgfV0gfV0sIHByb3BEZWNvcmF0b3JzOiB7IG5hbWU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWydmb3JtQ29udHJvbE5hbWUnXVxuICAgICAgICAgICAgfV0sIGlzRGlzYWJsZWQ6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWydkaXNhYmxlZCddXG4gICAgICAgICAgICB9XSwgbW9kZWw6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWyduZ01vZGVsJ11cbiAgICAgICAgICAgIH1dLCB1cGRhdGU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogT3V0cHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdNb2RlbENoYW5nZSddXG4gICAgICAgICAgICB9XSB9IH0pO1xuXG5jb25zdCBTRUxFQ1RfVkFMVUVfQUNDRVNTT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuZnVuY3Rpb24gX2J1aWxkVmFsdWVTdHJpbmckMShpZCwgdmFsdWUpIHtcbiAgICBpZiAoaWQgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpXG4gICAgICAgIHZhbHVlID0gJ09iamVjdCc7XG4gICAgcmV0dXJuIGAke2lkfTogJHt2YWx1ZX1gLnNsaWNlKDAsIDUwKTtcbn1cbmZ1bmN0aW9uIF9leHRyYWN0SWQkMSh2YWx1ZVN0cmluZykge1xuICAgIHJldHVybiB2YWx1ZVN0cmluZy5zcGxpdCgnOicpWzBdO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciB3cml0aW5nIHNlbGVjdCBjb250cm9sIHZhbHVlcyBhbmQgbGlzdGVuaW5nIHRvIHNlbGVjdCBjb250cm9sXG4gKiBjaGFuZ2VzLiBUaGUgdmFsdWUgYWNjZXNzb3IgaXMgdXNlZCBieSB0aGUgYEZvcm1Db250cm9sRGlyZWN0aXZlYCwgYEZvcm1Db250cm9sTmFtZWAsIGFuZFxuICogYE5nTW9kZWxgIGRpcmVjdGl2ZXMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgVXNpbmcgc2VsZWN0IGNvbnRyb2xzIGluIGEgcmVhY3RpdmUgZm9ybVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZXMgc2hvdyBob3cgdG8gdXNlIGEgc2VsZWN0IGNvbnRyb2wgaW4gYSByZWFjdGl2ZSBmb3JtLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9yZWFjdGl2ZVNlbGVjdENvbnRyb2wvcmVhY3RpdmVfc2VsZWN0X2NvbnRyb2xfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogIyMjIFVzaW5nIHNlbGVjdCBjb250cm9scyBpbiBhIHRlbXBsYXRlLWRyaXZlbiBmb3JtXG4gKlxuICogVG8gdXNlIGEgc2VsZWN0IGluIGEgdGVtcGxhdGUtZHJpdmVuIGZvcm0sIHNpbXBseSBhZGQgYW4gYG5nTW9kZWxgIGFuZCBhIGBuYW1lYFxuICogYXR0cmlidXRlIHRvIHRoZSBtYWluIGA8c2VsZWN0PmAgdGFnLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zZWxlY3RDb250cm9sL3NlbGVjdF9jb250cm9sX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqICMjIyBDdXN0b21pemluZyBvcHRpb24gc2VsZWN0aW9uXG4gKlxuICogQW5ndWxhciB1c2VzIG9iamVjdCBpZGVudGl0eSB0byBzZWxlY3Qgb3B0aW9uLiBJdCdzIHBvc3NpYmxlIGZvciB0aGUgaWRlbnRpdGllcyBvZiBpdGVtc1xuICogdG8gY2hhbmdlIHdoaWxlIHRoZSBkYXRhIGRvZXMgbm90LiBUaGlzIGNhbiBoYXBwZW4sIGZvciBleGFtcGxlLCBpZiB0aGUgaXRlbXMgYXJlIHByb2R1Y2VkXG4gKiBmcm9tIGFuIFJQQyB0byB0aGUgc2VydmVyLCBhbmQgdGhhdCBSUEMgaXMgcmUtcnVuLiBFdmVuIGlmIHRoZSBkYXRhIGhhc24ndCBjaGFuZ2VkLCB0aGVcbiAqIHNlY29uZCByZXNwb25zZSB3aWxsIHByb2R1Y2Ugb2JqZWN0cyB3aXRoIGRpZmZlcmVudCBpZGVudGl0aWVzLlxuICpcbiAqIFRvIGN1c3RvbWl6ZSB0aGUgZGVmYXVsdCBvcHRpb24gY29tcGFyaXNvbiBhbGdvcml0aG0sIGA8c2VsZWN0PmAgc3VwcG9ydHMgYGNvbXBhcmVXaXRoYCBpbnB1dC5cbiAqIGBjb21wYXJlV2l0aGAgdGFrZXMgYSAqKmZ1bmN0aW9uKiogd2hpY2ggaGFzIHR3byBhcmd1bWVudHM6IGBvcHRpb24xYCBhbmQgYG9wdGlvbjJgLlxuICogSWYgYGNvbXBhcmVXaXRoYCBpcyBnaXZlbiwgQW5ndWxhciBzZWxlY3RzIG9wdGlvbiBieSB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbi5cbiAqXG4gKiBgYGB0c1xuICogY29uc3Qgc2VsZWN0ZWRDb3VudHJpZXNDb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG4gKiBgYGBcbiAqXG4gKiBgYGBcbiAqIDxzZWxlY3QgW2NvbXBhcmVXaXRoXT1cImNvbXBhcmVGblwiICBbZm9ybUNvbnRyb2xdPVwic2VsZWN0ZWRDb3VudHJpZXNDb250cm9sXCI+XG4gKiAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgY291bnRyeSBvZiBjb3VudHJpZXNcIiBbbmdWYWx1ZV09XCJjb3VudHJ5XCI+XG4gKiAgICAgICAgIHt7Y291bnRyeS5uYW1lfX1cbiAqICAgICA8L29wdGlvbj5cbiAqIDwvc2VsZWN0PlxuICpcbiAqIGNvbXBhcmVGbihjMTogQ291bnRyeSwgYzI6IENvdW50cnkpOiBib29sZWFuIHtcbiAqICAgICByZXR1cm4gYzEgJiYgYzIgPyBjMS5pZCA9PT0gYzIuaWQgOiBjMSA9PT0gYzI7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiAqKk5vdGU6KiogV2UgbGlzdGVuIHRvIHRoZSAnY2hhbmdlJyBldmVudCBiZWNhdXNlICdpbnB1dCcgZXZlbnRzIGFyZW4ndCBmaXJlZFxuICogZm9yIHNlbGVjdHMgaW4gSUUsIHNlZTpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudC9pbnB1dF9ldmVudCNicm93c2VyX2NvbXBhdGliaWxpdHlcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLl9vcHRpb25NYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5faWRDb3VudGVyID0gMDtcbiAgICAgICAgdGhpcy5fY29tcGFyZVdpdGggPSBPYmplY3QuaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRyYWNrcyB0aGUgb3B0aW9uIGNvbXBhcmlzb24gYWxnb3JpdGhtIGZvciB0cmFja2luZyBpZGVudGl0aWVzIHdoZW5cbiAgICAgKiBjaGVja2luZyBmb3IgY2hhbmdlcy5cbiAgICAgKi9cbiAgICBzZXQgY29tcGFyZVdpdGgoZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IMm1UnVudGltZUVycm9yKDEyMDEgLyogUnVudGltZUVycm9yQ29kZS5DT01QQVJFV0lUSF9OT1RfQV9GTiAqLywgYGNvbXBhcmVXaXRoIG11c3QgYmUgYSBmdW5jdGlvbiwgYnV0IHJlY2VpdmVkICR7SlNPTi5zdHJpbmdpZnkoZm4pfWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIFwidmFsdWVcIiBwcm9wZXJ0eSBvbiB0aGUgc2VsZWN0IGVsZW1lbnQuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5fZ2V0T3B0aW9uSWQodmFsdWUpO1xuICAgICAgICBjb25zdCB2YWx1ZVN0cmluZyA9IF9idWlsZFZhbHVlU3RyaW5nJDEoaWQsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgndmFsdWUnLCB2YWx1ZVN0cmluZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gKHZhbHVlU3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5fZ2V0T3B0aW9uVmFsdWUodmFsdWVTdHJpbmcpO1xuICAgICAgICAgICAgZm4odGhpcy52YWx1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVnaXN0ZXJPcHRpb24oKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5faWRDb3VudGVyKyspLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZ2V0T3B0aW9uSWQodmFsdWUpIHtcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiB0aGlzLl9vcHRpb25NYXAua2V5cygpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29tcGFyZVdpdGgodGhpcy5fb3B0aW9uTWFwLmdldChpZCksIHZhbHVlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZ2V0T3B0aW9uVmFsdWUodmFsdWVTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaWQgPSBfZXh0cmFjdElkJDEodmFsdWVTdHJpbmcpO1xuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9uTWFwLmhhcyhpZCkgPyB0aGlzLl9vcHRpb25NYXAuZ2V0KGlkKSA6IHZhbHVlU3RyaW5nO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvciwgc2VsZWN0b3I6IFwic2VsZWN0Om5vdChbbXVsdGlwbGVdKVtmb3JtQ29udHJvbE5hbWVdLHNlbGVjdDpub3QoW211bHRpcGxlXSlbZm9ybUNvbnRyb2xdLHNlbGVjdDpub3QoW211bHRpcGxlXSlbbmdNb2RlbF1cIiwgaW5wdXRzOiB7IGNvbXBhcmVXaXRoOiBcImNvbXBhcmVXaXRoXCIgfSwgaG9zdDogeyBsaXN0ZW5lcnM6IHsgXCJjaGFuZ2VcIjogXCJvbkNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKVwiLCBcImJsdXJcIjogXCJvblRvdWNoZWQoKVwiIH0gfSwgcHJvdmlkZXJzOiBbU0VMRUNUX1ZBTFVFX0FDQ0VTU09SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ3NlbGVjdDpub3QoW211bHRpcGxlXSlbZm9ybUNvbnRyb2xOYW1lXSxzZWxlY3Q6bm90KFttdWx0aXBsZV0pW2Zvcm1Db250cm9sXSxzZWxlY3Q6bm90KFttdWx0aXBsZV0pW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogeyAnKGNoYW5nZSknOiAnb25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknLCAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJyB9LFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtTRUxFQ1RfVkFMVUVfQUNDRVNTT1JdXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIHByb3BEZWNvcmF0b3JzOiB7IGNvbXBhcmVXaXRoOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0XG4gICAgICAgICAgICB9XSB9IH0pO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1hcmtzIGA8b3B0aW9uPmAgYXMgZHluYW1pYywgc28gQW5ndWxhciBjYW4gYmUgbm90aWZpZWQgd2hlbiBvcHRpb25zIGNoYW5nZS5cbiAqXG4gKiBAc2VlIHtAbGluayBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvcn1cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIE5nU2VsZWN0T3B0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihfZWxlbWVudCwgX3JlbmRlcmVyLCBfc2VsZWN0KSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBfZWxlbWVudDtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBfcmVuZGVyZXI7XG4gICAgICAgIHRoaXMuX3NlbGVjdCA9IF9zZWxlY3Q7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QpXG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5fc2VsZWN0Ll9yZWdpc3Rlck9wdGlvbigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUcmFja3MgdGhlIHZhbHVlIGJvdW5kIHRvIHRoZSBvcHRpb24gZWxlbWVudC4gVW5saWtlIHRoZSB2YWx1ZSBiaW5kaW5nLFxuICAgICAqIG5nVmFsdWUgc3VwcG9ydHMgYmluZGluZyB0byBvYmplY3RzLlxuICAgICAqL1xuICAgIHNldCBuZ1ZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fc2VsZWN0Ll9vcHRpb25NYXAuc2V0KHRoaXMuaWQsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKF9idWlsZFZhbHVlU3RyaW5nJDEodGhpcy5pZCwgdmFsdWUpKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0LndyaXRlVmFsdWUodGhpcy5fc2VsZWN0LnZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVHJhY2tzIHNpbXBsZSBzdHJpbmcgdmFsdWVzIGJvdW5kIHRvIHRoZSBvcHRpb24gZWxlbWVudC5cbiAgICAgKiBGb3Igb2JqZWN0cywgdXNlIHRoZSBgbmdWYWx1ZWAgaW5wdXQgYmluZGluZy5cbiAgICAgKi9cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdClcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfc2V0RWxlbWVudFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWUpO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC5fb3B0aW9uTWFwLmRlbGV0ZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTmdTZWxlY3RPcHRpb24sIGRlcHM6IFt7IHRva2VuOiBpMC5FbGVtZW50UmVmIH0sIHsgdG9rZW46IGkwLlJlbmRlcmVyMiB9LCB7IHRva2VuOiBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvciwgaG9zdDogdHJ1ZSwgb3B0aW9uYWw6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTmdTZWxlY3RPcHRpb24sIHNlbGVjdG9yOiBcIm9wdGlvblwiLCBpbnB1dHM6IHsgbmdWYWx1ZTogXCJuZ1ZhbHVlXCIsIHZhbHVlOiBcInZhbHVlXCIgfSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nU2VsZWN0T3B0aW9uLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3sgc2VsZWN0b3I6ICdvcHRpb24nIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogaTAuRWxlbWVudFJlZiB9LCB7IHR5cGU6IGkwLlJlbmRlcmVyMiB9LCB7IHR5cGU6IFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSG9zdFxuICAgICAgICAgICAgICAgIH1dIH1dLCBwcm9wRGVjb3JhdG9yczogeyBuZ1ZhbHVlOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdWYWx1ZSddXG4gICAgICAgICAgICB9XSwgdmFsdWU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWyd2YWx1ZSddXG4gICAgICAgICAgICB9XSB9IH0pO1xuXG5jb25zdCBTRUxFQ1RfTVVMVElQTEVfVkFMVUVfQUNDRVNTT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG5mdW5jdGlvbiBfYnVpbGRWYWx1ZVN0cmluZyhpZCwgdmFsdWUpIHtcbiAgICBpZiAoaWQgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHZhbHVlID0gYCcke3ZhbHVlfSdgO1xuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKVxuICAgICAgICB2YWx1ZSA9ICdPYmplY3QnO1xuICAgIHJldHVybiBgJHtpZH06ICR7dmFsdWV9YC5zbGljZSgwLCA1MCk7XG59XG5mdW5jdGlvbiBfZXh0cmFjdElkKHZhbHVlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHZhbHVlU3RyaW5nLnNwbGl0KCc6JylbMF07XG59XG4vKiogTW9jayBpbnRlcmZhY2UgZm9yIEhUTUxDb2xsZWN0aW9uICovXG5jbGFzcyBIVE1MQ29sbGVjdGlvbiB7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIHdyaXRpbmcgbXVsdGktc2VsZWN0IGNvbnRyb2wgdmFsdWVzIGFuZCBsaXN0ZW5pbmcgdG8gbXVsdGktc2VsZWN0XG4gKiBjb250cm9sIGNoYW5nZXMuIFRoZSB2YWx1ZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IHRoZSBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBgRm9ybUNvbnRyb2xOYW1lYCwgYW5kXG4gKiBgTmdNb2RlbGAgZGlyZWN0aXZlcy5cbiAqXG4gKiBAc2VlIHtAbGluayBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvcn1cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBVc2luZyBhIG11bHRpLXNlbGVjdCBjb250cm9sXG4gKlxuICogVGhlIGZvbGxvdyBleGFtcGxlIHNob3dzIHlvdSBob3cgdG8gdXNlIGEgbXVsdGktc2VsZWN0IGNvbnRyb2wgd2l0aCBhIHJlYWN0aXZlIGZvcm0uXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvdW50cnlDb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG4gKiBgYGBcbiAqXG4gKiBgYGBcbiAqIDxzZWxlY3QgbXVsdGlwbGUgbmFtZT1cImNvdW50cmllc1wiIFtmb3JtQ29udHJvbF09XCJjb3VudHJ5Q29udHJvbFwiPlxuICogICA8b3B0aW9uICpuZ0Zvcj1cImxldCBjb3VudHJ5IG9mIGNvdW50cmllc1wiIFtuZ1ZhbHVlXT1cImNvdW50cnlcIj5cbiAqICAgICB7eyBjb3VudHJ5Lm5hbWUgfX1cbiAqICAgPC9vcHRpb24+XG4gKiA8L3NlbGVjdD5cbiAqIGBgYFxuICpcbiAqICMjIyBDdXN0b21pemluZyBvcHRpb24gc2VsZWN0aW9uXG4gKlxuICogVG8gY3VzdG9taXplIHRoZSBkZWZhdWx0IG9wdGlvbiBjb21wYXJpc29uIGFsZ29yaXRobSwgYDxzZWxlY3Q+YCBzdXBwb3J0cyBgY29tcGFyZVdpdGhgIGlucHV0LlxuICogU2VlIHRoZSBgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciB1c2FnZS5cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX29wdGlvbk1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLl9pZENvdW50ZXIgPSAwO1xuICAgICAgICB0aGlzLl9jb21wYXJlV2l0aCA9IE9iamVjdC5pcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVHJhY2tzIHRoZSBvcHRpb24gY29tcGFyaXNvbiBhbGdvcml0aG0gZm9yIHRyYWNraW5nIGlkZW50aXRpZXMgd2hlblxuICAgICAqIGNoZWNraW5nIGZvciBjaGFuZ2VzLlxuICAgICAqL1xuICAgIHNldCBjb21wYXJlV2l0aChmbikge1xuICAgICAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgybVSdW50aW1lRXJyb3IoMTIwMSAvKiBSdW50aW1lRXJyb3JDb2RlLkNPTVBBUkVXSVRIX05PVF9BX0ZOICovLCBgY29tcGFyZVdpdGggbXVzdCBiZSBhIGZ1bmN0aW9uLCBidXQgcmVjZWl2ZWQgJHtKU09OLnN0cmluZ2lmeShmbil9YCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29tcGFyZVdpdGggPSBmbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9uIG9uZSBvciBvZiBtb3JlIG9mIHRoZSBzZWxlY3QncyBvcHRpb25zLlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBsZXQgb3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlcjtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IHZhbHVlcyB0byBpZHNcbiAgICAgICAgICAgIGNvbnN0IGlkcyA9IHZhbHVlLm1hcCgodikgPT4gdGhpcy5fZ2V0T3B0aW9uSWQodikpO1xuICAgICAgICAgICAgb3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlciA9IChvcHQsIG8pID0+IHtcbiAgICAgICAgICAgICAgICBvcHQuX3NldFNlbGVjdGVkKGlkcy5pbmRleE9mKG8udG9TdHJpbmcoKSkgPiAtMSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlciA9IChvcHQsIG8pID0+IHtcbiAgICAgICAgICAgICAgICBvcHQuX3NldFNlbGVjdGVkKGZhbHNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb3B0aW9uTWFwLmZvckVhY2gob3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXNcbiAgICAgKiBhbmQgd3JpdGVzIGFuIGFycmF5IG9mIHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IFtdO1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gZWxlbWVudC5zZWxlY3RlZE9wdGlvbnM7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRPcHRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gc2VsZWN0ZWRPcHRpb25zO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHQgPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLl9nZXRPcHRpb25WYWx1ZShvcHQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRGVncmFkZSB0byB1c2UgYG9wdGlvbnNgIHdoZW4gYHNlbGVjdGVkT3B0aW9uc2AgcHJvcGVydHkgaXMgbm90IGF2YWlsYWJsZS5cbiAgICAgICAgICAgIC8vIE5vdGU6IHRoZSBgc2VsZWN0ZWRPcHRpb25zYCBpcyBhdmFpbGFibGUgaW4gYWxsIHN1cHBvcnRlZCBicm93c2VycywgYnV0IHRoZSBEb21pbm8gbGliXG4gICAgICAgICAgICAvLyBkb2Vzbid0IGhhdmUgaXQgY3VycmVudGx5LCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZnbmFzcy9kb21pbm8vaXNzdWVzLzE3Ny5cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBlbGVtZW50Lm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdCA9IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuX2dldE9wdGlvblZhbHVlKG9wdC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gc2VsZWN0ZWQ7XG4gICAgICAgICAgICBmbihzZWxlY3RlZCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVnaXN0ZXJPcHRpb24odmFsdWUpIHtcbiAgICAgICAgY29uc3QgaWQgPSAodGhpcy5faWRDb3VudGVyKyspLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuX29wdGlvbk1hcC5zZXQoaWQsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2dldE9wdGlvbklkKHZhbHVlKSB7XG4gICAgICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5fb3B0aW9uTWFwLmtleXMoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbXBhcmVXaXRoKHRoaXMuX29wdGlvbk1hcC5nZXQoaWQpLl92YWx1ZSwgdmFsdWUpKVxuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9nZXRPcHRpb25WYWx1ZSh2YWx1ZVN0cmluZykge1xuICAgICAgICBjb25zdCBpZCA9IF9leHRyYWN0SWQodmFsdWVTdHJpbmcpO1xuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9uTWFwLmhhcyhpZCkgPyB0aGlzLl9vcHRpb25NYXAuZ2V0KGlkKS5fdmFsdWUgOiB2YWx1ZVN0cmluZztcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBzZWxlY3RvcjogXCJzZWxlY3RbbXVsdGlwbGVdW2Zvcm1Db250cm9sTmFtZV0sc2VsZWN0W211bHRpcGxlXVtmb3JtQ29udHJvbF0sc2VsZWN0W211bHRpcGxlXVtuZ01vZGVsXVwiLCBpbnB1dHM6IHsgY29tcGFyZVdpdGg6IFwiY29tcGFyZVdpdGhcIiB9LCBob3N0OiB7IGxpc3RlbmVyczogeyBcImNoYW5nZVwiOiBcIm9uQ2hhbmdlKCRldmVudC50YXJnZXQpXCIsIFwiYmx1clwiOiBcIm9uVG91Y2hlZCgpXCIgfSB9LCBwcm92aWRlcnM6IFtTRUxFQ1RfTVVMVElQTEVfVkFMVUVfQUNDRVNTT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdzZWxlY3RbbXVsdGlwbGVdW2Zvcm1Db250cm9sTmFtZV0sc2VsZWN0W211bHRpcGxlXVtmb3JtQ29udHJvbF0sc2VsZWN0W211bHRpcGxlXVtuZ01vZGVsXScsXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQpJywgJyhibHVyKSc6ICdvblRvdWNoZWQoKScgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbU0VMRUNUX01VTFRJUExFX1ZBTFVFX0FDQ0VTU09SXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBwcm9wRGVjb3JhdG9yczogeyBjb21wYXJlV2l0aDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBNYXJrcyBgPG9wdGlvbj5gIGFzIGR5bmFtaWMsIHNvIEFuZ3VsYXIgY2FuIGJlIG5vdGlmaWVkIHdoZW4gb3B0aW9ucyBjaGFuZ2UuXG4gKlxuICogQHNlZSB7QGxpbmsgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3Nvcn1cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIMm1TmdTZWxlY3RNdWx0aXBsZU9wdGlvbiB7XG4gICAgY29uc3RydWN0b3IoX2VsZW1lbnQsIF9yZW5kZXJlciwgX3NlbGVjdCkge1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gX2VsZW1lbnQ7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyID0gX3JlbmRlcmVyO1xuICAgICAgICB0aGlzLl9zZWxlY3QgPSBfc2VsZWN0O1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5fc2VsZWN0Ll9yZWdpc3Rlck9wdGlvbih0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUcmFja3MgdGhlIHZhbHVlIGJvdW5kIHRvIHRoZSBvcHRpb24gZWxlbWVudC4gVW5saWtlIHRoZSB2YWx1ZSBiaW5kaW5nLFxuICAgICAqIG5nVmFsdWUgc3VwcG9ydHMgYmluZGluZyB0byBvYmplY3RzLlxuICAgICAqL1xuICAgIHNldCBuZ1ZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKF9idWlsZFZhbHVlU3RyaW5nKHRoaXMuaWQsIHZhbHVlKSk7XG4gICAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRyYWNrcyBzaW1wbGUgc3RyaW5nIHZhbHVlcyBib3VuZCB0byB0aGUgb3B0aW9uIGVsZW1lbnQuXG4gICAgICogRm9yIG9iamVjdHMsIHVzZSB0aGUgYG5nVmFsdWVgIGlucHV0IGJpbmRpbmcuXG4gICAgICovXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9zZXRFbGVtZW50VmFsdWUoX2J1aWxkVmFsdWVTdHJpbmcodGhpcy5pZCwgdmFsdWUpKTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRFbGVtZW50VmFsdWUodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfc2V0RWxlbWVudFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWUpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3NldFNlbGVjdGVkKHNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3NlbGVjdGVkJywgc2VsZWN0ZWQpO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC5fb3B0aW9uTWFwLmRlbGV0ZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogybVOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLCBkZXBzOiBbeyB0b2tlbjogaTAuRWxlbWVudFJlZiB9LCB7IHRva2VuOiBpMC5SZW5kZXJlcjIgfSwgeyB0b2tlbjogU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvciwgaG9zdDogdHJ1ZSwgb3B0aW9uYWw6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogybVOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLCBzZWxlY3RvcjogXCJvcHRpb25cIiwgaW5wdXRzOiB7IG5nVmFsdWU6IFwibmdWYWx1ZVwiLCB2YWx1ZTogXCJ2YWx1ZVwiIH0sIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb24sIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbeyBzZWxlY3RvcjogJ29wdGlvbicgfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiBpMC5FbGVtZW50UmVmIH0sIHsgdHlwZTogaTAuUmVuZGVyZXIyIH0sIHsgdHlwZTogU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEhvc3RcbiAgICAgICAgICAgICAgICB9XSB9XSwgcHJvcERlY29yYXRvcnM6IHsgbmdWYWx1ZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ25nVmFsdWUnXVxuICAgICAgICAgICAgfV0sIHZhbHVlOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsndmFsdWUnXVxuICAgICAgICAgICAgfV0gfSB9KTtcblxuLyoqXG4gKiBNZXRob2QgdGhhdCB1cGRhdGVzIHN0cmluZyB0byBpbnRlZ2VyIGlmIG5vdCBhbHJlYWR5IGEgbnVtYmVyXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGludGVnZXIuXG4gKiBAcmV0dXJucyB2YWx1ZSBvZiBwYXJhbWV0ZXIgY29udmVydGVkIHRvIG51bWJlciBvciBpbnRlZ2VyLlxuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogcGFyc2VJbnQodmFsdWUsIDEwKTtcbn1cbi8qKlxuICogTWV0aG9kIHRoYXQgZW5zdXJlcyB0aGF0IHByb3ZpZGVkIHZhbHVlIGlzIGEgZmxvYXQgKGFuZCBjb252ZXJ0cyBpdCB0byBmbG9hdCBpZiBuZWVkZWQpLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBmbG9hdC5cbiAqIEByZXR1cm5zIHZhbHVlIG9mIHBhcmFtZXRlciBjb252ZXJ0ZWQgdG8gbnVtYmVyIG9yIGZsb2F0LlxuICovXG5mdW5jdGlvbiB0b0Zsb2F0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyB2YWx1ZSA6IHBhcnNlRmxvYXQodmFsdWUpO1xufVxuLyoqXG4gKiBBIGJhc2UgY2xhc3MgZm9yIFZhbGlkYXRvci1iYXNlZCBEaXJlY3RpdmVzLiBUaGUgY2xhc3MgY29udGFpbnMgY29tbW9uIGxvZ2ljIHNoYXJlZCBhY3Jvc3Mgc3VjaFxuICogRGlyZWN0aXZlcy5cbiAqXG4gKiBGb3IgaW50ZXJuYWwgdXNlIG9ubHksIHRoaXMgY2xhc3MgaXMgbm90IGludGVuZGVkIGZvciB1c2Ugb3V0c2lkZSBvZiB0aGUgRm9ybXMgcGFja2FnZS5cbiAqL1xuY2xhc3MgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl92YWxpZGF0b3IgPSBudWxsVmFsaWRhdG9yO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5pbnB1dE5hbWUgaW4gY2hhbmdlcykge1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLm5vcm1hbGl6ZUlucHV0KGNoYW5nZXNbdGhpcy5pbnB1dE5hbWVdLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdGhpcy5lbmFibGVkKGlucHV0KTtcbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkYXRvciA9IHRoaXMuX2VuYWJsZWQgPyB0aGlzLmNyZWF0ZVZhbGlkYXRvcihpbnB1dCkgOiBudWxsVmFsaWRhdG9yO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgdmFsaWRhdGUoY29udHJvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsaWRhdG9yKGNvbnRyb2wpO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbikge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhpcyB2YWxpZGF0b3Igc2hvdWxkIGJlIGFjdGl2ZSBvciBub3QgYmFzZWQgb24gYW4gaW5wdXQuXG4gICAgICogQmFzZSBjbGFzcyBpbXBsZW1lbnRhdGlvbiBjaGVja3Mgd2hldGhlciBhbiBpbnB1dCBpcyBkZWZpbmVkIChpZiB0aGUgdmFsdWUgaXMgZGlmZmVyZW50IGZyb21cbiAgICAgKiBgbnVsbGAgYW5kIGB1bmRlZmluZWRgKS4gVmFsaWRhdG9yIGNsYXNzZXMgdGhhdCBleHRlbmQgdGhpcyBiYXNlIGNsYXNzIGNhbiBvdmVycmlkZSB0aGlzXG4gICAgICogZnVuY3Rpb24gd2l0aCB0aGUgbG9naWMgc3BlY2lmaWMgdG8gYSBwYXJ0aWN1bGFyIHZhbGlkYXRvciBkaXJlY3RpdmUuXG4gICAgICovXG4gICAgZW5hYmxlZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCAvKiBib3RoIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgKi87XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlLCBkZXBzOiBbXSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSwgdXNlc09uQ2hhbmdlczogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlXG4gICAgICAgIH1dIH0pO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1heFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5jb25zdCBNQVhfVkFMSURBVE9SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4VmFsaWRhdG9yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIHtAbGluayBNYXhWYWxpZGF0b3J9IGZvciBhbnkgYGZvcm1Db250cm9sTmFtZWAsXG4gKiBgZm9ybUNvbnRyb2xgLCBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWF4YCBhdHRyaWJ1dGUuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWF4IHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgbWF4IHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbmdNb2RlbCBtYXg9XCI0XCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIE1heFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmlucHV0TmFtZSA9ICdtYXgnO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMubm9ybWFsaXplSW5wdXQgPSAoaW5wdXQpID0+IHRvRmxvYXQoaW5wdXQpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yID0gKG1heCkgPT4gbWF4VmFsaWRhdG9yKG1heCk7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE1heFZhbGlkYXRvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBNYXhWYWxpZGF0b3IsIHNlbGVjdG9yOiBcImlucHV0W3R5cGU9bnVtYmVyXVttYXhdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1udW1iZXJdW21heF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9bnVtYmVyXVttYXhdW25nTW9kZWxdXCIsIGlucHV0czogeyBtYXg6IFwibWF4XCIgfSwgaG9zdDogeyBwcm9wZXJ0aWVzOiB7IFwiYXR0ci5tYXhcIjogXCJfZW5hYmxlZCA/IG1heCA6IG51bGxcIiB9IH0sIHByb3ZpZGVyczogW01BWF9WQUxJREFUT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBNYXhWYWxpZGF0b3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9bnVtYmVyXVttYXhdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1udW1iZXJdW21heF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9bnVtYmVyXVttYXhdW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbTUFYX1ZBTElEQVRPUl0sXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ1thdHRyLm1heF0nOiAnX2VuYWJsZWQgPyBtYXggOiBudWxsJyB9XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIHByb3BEZWNvcmF0b3JzOiB7IG1heDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNaW5WYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuY29uc3QgTUlOX1ZBTElEQVRPUiA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1pblZhbGlkYXRvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIEEgZGlyZWN0aXZlIHdoaWNoIGluc3RhbGxzIHRoZSB7QGxpbmsgTWluVmFsaWRhdG9yfSBmb3IgYW55IGBmb3JtQ29udHJvbE5hbWVgLFxuICogYGZvcm1Db250cm9sYCwgb3IgY29udHJvbCB3aXRoIGBuZ01vZGVsYCB0aGF0IGFsc28gaGFzIGEgYG1pbmAgYXR0cmlidXRlLlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIG1pbiB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1pbiB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG5nTW9kZWwgbWluPVwiNFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBNaW5WYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5pbnB1dE5hbWUgPSAnbWluJztcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZUlucHV0ID0gKGlucHV0KSA9PiB0b0Zsb2F0KGlucHV0KTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvciA9IChtaW4pID0+IG1pblZhbGlkYXRvcihtaW4pO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBNaW5WYWxpZGF0b3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTWluVmFsaWRhdG9yLCBzZWxlY3RvcjogXCJpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVttaW5dW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtuZ01vZGVsXVwiLCBpbnB1dHM6IHsgbWluOiBcIm1pblwiIH0sIGhvc3Q6IHsgcHJvcGVydGllczogeyBcImF0dHIubWluXCI6IFwiX2VuYWJsZWQgPyBtaW4gOiBudWxsXCIgfSB9LCBwcm92aWRlcnM6IFtNSU5fVkFMSURBVE9SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTWluVmFsaWRhdG9yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVttaW5dW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtuZ01vZGVsXScsXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW01JTl9WQUxJREFUT1JdLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICdbYXR0ci5taW5dJzogJ19lbmFibGVkID8gbWluIDogbnVsbCcgfVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBwcm9wRGVjb3JhdG9yczogeyBtaW46IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dIH0gfSk7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgUmVxdWlyZWRWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuY29uc3QgUkVRVUlSRURfVkFMSURBVE9SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmVxdWlyZWRWYWxpZGF0b3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuY29uc3QgQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBhbnkgY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcmVxdWlyZWRgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSByZXF1aXJlZCB2YWxpZGF0b3IgdXNpbmcgdGVtcGxhdGUtZHJpdmVuIGZvcm1zXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgbmFtZT1cImZ1bGxOYW1lXCIgbmdNb2RlbCByZXF1aXJlZD5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgUmVxdWlyZWRWYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5pbnB1dE5hbWUgPSAncmVxdWlyZWQnO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMubm9ybWFsaXplSW5wdXQgPSBib29sZWFuQXR0cmlidXRlO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yID0gKGlucHV0KSA9PiByZXF1aXJlZFZhbGlkYXRvcjtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIGVuYWJsZWQoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSZXF1aXJlZFZhbGlkYXRvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBSZXF1aXJlZFZhbGlkYXRvciwgc2VsZWN0b3I6IFwiOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bbmdNb2RlbF1cIiwgaW5wdXRzOiB7IHJlcXVpcmVkOiBcInJlcXVpcmVkXCIgfSwgaG9zdDogeyBwcm9wZXJ0aWVzOiB7IFwiYXR0ci5yZXF1aXJlZFwiOiBcIl9lbmFibGVkID8gXFxcIlxcXCIgOiBudWxsXCIgfSB9LCBwcm92aWRlcnM6IFtSRVFVSVJFRF9WQUxJREFUT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSZXF1aXJlZFZhbGlkYXRvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtSRVFVSVJFRF9WQUxJREFUT1JdLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICdbYXR0ci5yZXF1aXJlZF0nOiAnX2VuYWJsZWQgPyBcIlwiIDogbnVsbCcgfVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBwcm9wRGVjb3JhdG9yczogeyByZXF1aXJlZDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBjaGVja2JveCBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGByZXF1aXJlZGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIHJlcXVpcmVkIGNoZWNrYm94IHZhbGlkYXRvciB1c2luZyB0ZW1wbGF0ZS1kcml2ZW4gZm9ybXNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIGNoZWNrYm94IHJlcXVpcmVkIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJhY3RpdmVcIiBuZ01vZGVsIHJlcXVpcmVkPlxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5jbGFzcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgUmVxdWlyZWRWYWxpZGF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yID0gKGlucHV0KSA9PiByZXF1aXJlZFRydWVWYWxpZGF0b3I7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciwgc2VsZWN0b3I6IFwiaW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bbmdNb2RlbF1cIiwgaG9zdDogeyBwcm9wZXJ0aWVzOiB7IFwiYXR0ci5yZXF1aXJlZFwiOiBcIl9lbmFibGVkID8gXFxcIlxcXCIgOiBudWxsXCIgfSB9LCBwcm92aWRlcnM6IFtDSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ1thdHRyLnJlcXVpcmVkXSc6ICdfZW5hYmxlZCA/IFwiXCIgOiBudWxsJyB9XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0gfSk7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgRW1haWxWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuY29uc3QgRU1BSUxfVkFMSURBVE9SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRW1haWxWYWxpZGF0b3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGBlbWFpbGAgdmFsaWRhdG9yIHRvIGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYGVtYWlsYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogVGhlIGVtYWlsIHZhbGlkYXRpb24gaXMgYmFzZWQgb24gdGhlIFdIQVRXRyBIVE1MIHNwZWNpZmljYXRpb24gd2l0aCBzb21lIGVuaGFuY2VtZW50cyB0b1xuICogaW5jb3Jwb3JhdGUgbW9yZSBSRkMgcnVsZXMuIE1vcmUgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIG9uIHRoZSBbVmFsaWRhdG9ycy5lbWFpbFxuICogcGFnZV0oYXBpL2Zvcm1zL1ZhbGlkYXRvcnMjZW1haWwpLlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhbiBlbWFpbCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhbiBlbWFpbCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW4gbmdNb2RlbFxuICogYmluZGluZy5cbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgZW1haWw9XCJ0cnVlXCI+XG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBbZW1haWxdPVwidHJ1ZVwiPlxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5jbGFzcyBFbWFpbFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmlucHV0TmFtZSA9ICdlbWFpbCc7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5ub3JtYWxpemVJbnB1dCA9IGJvb2xlYW5BdHRyaWJ1dGU7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5jcmVhdGVWYWxpZGF0b3IgPSAoaW5wdXQpID0+IGVtYWlsVmFsaWRhdG9yO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgZW5hYmxlZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEVtYWlsVmFsaWRhdG9yLCBkZXBzOiBudWxsLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IEVtYWlsVmFsaWRhdG9yLCBzZWxlY3RvcjogXCJbZW1haWxdW2Zvcm1Db250cm9sTmFtZV0sW2VtYWlsXVtmb3JtQ29udHJvbF0sW2VtYWlsXVtuZ01vZGVsXVwiLCBpbnB1dHM6IHsgZW1haWw6IFwiZW1haWxcIiB9LCBwcm92aWRlcnM6IFtFTUFJTF9WQUxJREFUT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBFbWFpbFZhbGlkYXRvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnW2VtYWlsXVtmb3JtQ29udHJvbE5hbWVdLFtlbWFpbF1bZm9ybUNvbnRyb2xdLFtlbWFpbF1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtFTUFJTF9WQUxJREFUT1JdXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIHByb3BEZWNvcmF0b3JzOiB7IGVtYWlsOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0XG4gICAgICAgICAgICB9XSB9IH0pO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1pbkxlbmd0aFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5jb25zdCBNSU5fTEVOR1RIX1ZBTElEQVRPUiA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1pbkxlbmd0aFZhbGlkYXRvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWRkcyBtaW5pbXVtIGxlbmd0aCB2YWxpZGF0aW9uIHRvIGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYG1pbmxlbmd0aGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIG1pbmltdW0gbGVuZ3RoIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgbWluaW11bSBsZW5ndGggdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IG5hbWU9XCJmaXJzdE5hbWVcIiBuZ01vZGVsIG1pbmxlbmd0aD1cIjRcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTWluTGVuZ3RoVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuaW5wdXROYW1lID0gJ21pbmxlbmd0aCc7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5ub3JtYWxpemVJbnB1dCA9IChpbnB1dCkgPT4gdG9JbnRlZ2VyKGlucHV0KTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvciA9IChtaW5sZW5ndGgpID0+IG1pbkxlbmd0aFZhbGlkYXRvcihtaW5sZW5ndGgpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBNaW5MZW5ndGhWYWxpZGF0b3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTWluTGVuZ3RoVmFsaWRhdG9yLCBzZWxlY3RvcjogXCJbbWlubGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttaW5sZW5ndGhdW2Zvcm1Db250cm9sXSxbbWlubGVuZ3RoXVtuZ01vZGVsXVwiLCBpbnB1dHM6IHsgbWlubGVuZ3RoOiBcIm1pbmxlbmd0aFwiIH0sIGhvc3Q6IHsgcHJvcGVydGllczogeyBcImF0dHIubWlubGVuZ3RoXCI6IFwiX2VuYWJsZWQgPyBtaW5sZW5ndGggOiBudWxsXCIgfSB9LCBwcm92aWRlcnM6IFtNSU5fTEVOR1RIX1ZBTElEQVRPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE1pbkxlbmd0aFZhbGlkYXRvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnW21pbmxlbmd0aF1bZm9ybUNvbnRyb2xOYW1lXSxbbWlubGVuZ3RoXVtmb3JtQ29udHJvbF0sW21pbmxlbmd0aF1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtNSU5fTEVOR1RIX1ZBTElEQVRPUl0sXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ1thdHRyLm1pbmxlbmd0aF0nOiAnX2VuYWJsZWQgPyBtaW5sZW5ndGggOiBudWxsJyB9XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIHByb3BEZWNvcmF0b3JzOiB7IG1pbmxlbmd0aDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNYXhMZW5ndGhWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuY29uc3QgTUFYX0xFTkdUSF9WQUxJREFUT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXhMZW5ndGhWYWxpZGF0b3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgbWF4aW11bSBsZW5ndGggdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBtYXhsZW5ndGhgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBtYXhpbXVtIGxlbmd0aCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1heGltdW0gbGVuZ3RoIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBuYW1lPVwiZmlyc3ROYW1lXCIgbmdNb2RlbCBtYXhsZW5ndGg9XCIyNVwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBNYXhMZW5ndGhWYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5pbnB1dE5hbWUgPSAnbWF4bGVuZ3RoJztcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZUlucHV0ID0gKGlucHV0KSA9PiB0b0ludGVnZXIoaW5wdXQpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yID0gKG1heGxlbmd0aCkgPT4gbWF4TGVuZ3RoVmFsaWRhdG9yKG1heGxlbmd0aCk7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE1heExlbmd0aFZhbGlkYXRvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBNYXhMZW5ndGhWYWxpZGF0b3IsIHNlbGVjdG9yOiBcIlttYXhsZW5ndGhdW2Zvcm1Db250cm9sTmFtZV0sW21heGxlbmd0aF1bZm9ybUNvbnRyb2xdLFttYXhsZW5ndGhdW25nTW9kZWxdXCIsIGlucHV0czogeyBtYXhsZW5ndGg6IFwibWF4bGVuZ3RoXCIgfSwgaG9zdDogeyBwcm9wZXJ0aWVzOiB7IFwiYXR0ci5tYXhsZW5ndGhcIjogXCJfZW5hYmxlZCA/IG1heGxlbmd0aCA6IG51bGxcIiB9IH0sIHByb3ZpZGVyczogW01BWF9MRU5HVEhfVkFMSURBVE9SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTWF4TGVuZ3RoVmFsaWRhdG9yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttYXhsZW5ndGhdW2Zvcm1Db250cm9sXSxbbWF4bGVuZ3RoXVtuZ01vZGVsXScsXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW01BWF9MRU5HVEhfVkFMSURBVE9SXSxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogeyAnW2F0dHIubWF4bGVuZ3RoXSc6ICdfZW5hYmxlZCA/IG1heGxlbmd0aCA6IG51bGwnIH1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgcHJvcERlY29yYXRvcnM6IHsgbWF4bGVuZ3RoOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0XG4gICAgICAgICAgICB9XSB9IH0pO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYFBhdHRlcm5WYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuY29uc3QgUEFUVEVSTl9WQUxJREFUT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBQYXR0ZXJuVmFsaWRhdG9yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgcmVnZXggcGF0dGVybiB2YWxpZGF0aW9uIHRvIGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHBhdHRlcm5gIGF0dHJpYnV0ZS4gVGhlIHJlZ2V4IG11c3QgbWF0Y2ggdGhlIGVudGlyZSBjb250cm9sIHZhbHVlLlxuICogVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBwYXR0ZXJuIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgcGF0dGVybiB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgbmFtZT1cImZpcnN0TmFtZVwiIG5nTW9kZWwgcGF0dGVybj1cIlthLXpBLVogXSpcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgUGF0dGVyblZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmlucHV0TmFtZSA9ICdwYXR0ZXJuJztcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZUlucHV0ID0gKGlucHV0KSA9PiBpbnB1dDtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvciA9IChpbnB1dCkgPT4gcGF0dGVyblZhbGlkYXRvcihpbnB1dCk7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFBhdHRlcm5WYWxpZGF0b3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogUGF0dGVyblZhbGlkYXRvciwgc2VsZWN0b3I6IFwiW3BhdHRlcm5dW2Zvcm1Db250cm9sTmFtZV0sW3BhdHRlcm5dW2Zvcm1Db250cm9sXSxbcGF0dGVybl1bbmdNb2RlbF1cIiwgaW5wdXRzOiB7IHBhdHRlcm46IFwicGF0dGVyblwiIH0sIGhvc3Q6IHsgcHJvcGVydGllczogeyBcImF0dHIucGF0dGVyblwiOiBcIl9lbmFibGVkID8gcGF0dGVybiA6IG51bGxcIiB9IH0sIHByb3ZpZGVyczogW1BBVFRFUk5fVkFMSURBVE9SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUGF0dGVyblZhbGlkYXRvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnW3BhdHRlcm5dW2Zvcm1Db250cm9sTmFtZV0sW3BhdHRlcm5dW2Zvcm1Db250cm9sXSxbcGF0dGVybl1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtQQVRURVJOX1ZBTElEQVRPUl0sXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ1thdHRyLnBhdHRlcm5dJzogJ19lbmFibGVkID8gcGF0dGVybiA6IG51bGwnIH1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgcHJvcERlY29yYXRvcnM6IHsgcGF0dGVybjogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcblxuY29uc3QgU0hBUkVEX0ZPUk1fRElSRUNUSVZFUyA9IFtcbiAgICDJtU5nTm9WYWxpZGF0ZSxcbiAgICBOZ1NlbGVjdE9wdGlvbixcbiAgICDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb24sXG4gICAgRGVmYXVsdFZhbHVlQWNjZXNzb3IsXG4gICAgTnVtYmVyVmFsdWVBY2Nlc3NvcixcbiAgICBSYW5nZVZhbHVlQWNjZXNzb3IsXG4gICAgQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgTmdDb250cm9sU3RhdHVzLFxuICAgIE5nQ29udHJvbFN0YXR1c0dyb3VwLFxuICAgIFJlcXVpcmVkVmFsaWRhdG9yLFxuICAgIE1pbkxlbmd0aFZhbGlkYXRvcixcbiAgICBNYXhMZW5ndGhWYWxpZGF0b3IsXG4gICAgUGF0dGVyblZhbGlkYXRvcixcbiAgICBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLFxuICAgIEVtYWlsVmFsaWRhdG9yLFxuICAgIE1pblZhbGlkYXRvcixcbiAgICBNYXhWYWxpZGF0b3IsXG5dO1xuY29uc3QgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVMgPSBbTmdNb2RlbCwgTmdNb2RlbEdyb3VwLCBOZ0Zvcm1dO1xuY29uc3QgUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVMgPSBbRm9ybUNvbnRyb2xEaXJlY3RpdmUsIEZvcm1Hcm91cERpcmVjdGl2ZSwgRm9ybUNvbnRyb2xOYW1lLCBGb3JtR3JvdXBOYW1lLCBGb3JtQXJyYXlOYW1lXTtcbi8qKlxuICogSW50ZXJuYWwgbW9kdWxlIHVzZWQgZm9yIHNoYXJpbmcgZGlyZWN0aXZlcyBiZXR3ZWVuIEZvcm1zTW9kdWxlIGFuZCBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbmNsYXNzIMm1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSB7XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogybVJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBkZXBzOiBbXSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5OZ01vZHVsZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVtb2QgPSBpMC7Jtcm1bmdEZWNsYXJlTmdNb2R1bGUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiDJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIGRlY2xhcmF0aW9uczogW8m1TmdOb1ZhbGlkYXRlLFxuICAgICAgICAgICAgTmdTZWxlY3RPcHRpb24sXG4gICAgICAgICAgICDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb24sXG4gICAgICAgICAgICBEZWZhdWx0VmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgIE51bWJlclZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBSYW5nZVZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgIE5nQ29udHJvbFN0YXR1cyxcbiAgICAgICAgICAgIE5nQ29udHJvbFN0YXR1c0dyb3VwLFxuICAgICAgICAgICAgUmVxdWlyZWRWYWxpZGF0b3IsXG4gICAgICAgICAgICBNaW5MZW5ndGhWYWxpZGF0b3IsXG4gICAgICAgICAgICBNYXhMZW5ndGhWYWxpZGF0b3IsXG4gICAgICAgICAgICBQYXR0ZXJuVmFsaWRhdG9yLFxuICAgICAgICAgICAgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcixcbiAgICAgICAgICAgIEVtYWlsVmFsaWRhdG9yLFxuICAgICAgICAgICAgTWluVmFsaWRhdG9yLFxuICAgICAgICAgICAgTWF4VmFsaWRhdG9yXSwgZXhwb3J0czogW8m1TmdOb1ZhbGlkYXRlLFxuICAgICAgICAgICAgTmdTZWxlY3RPcHRpb24sXG4gICAgICAgICAgICDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb24sXG4gICAgICAgICAgICBEZWZhdWx0VmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgIE51bWJlclZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBSYW5nZVZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgIE5nQ29udHJvbFN0YXR1cyxcbiAgICAgICAgICAgIE5nQ29udHJvbFN0YXR1c0dyb3VwLFxuICAgICAgICAgICAgUmVxdWlyZWRWYWxpZGF0b3IsXG4gICAgICAgICAgICBNaW5MZW5ndGhWYWxpZGF0b3IsXG4gICAgICAgICAgICBNYXhMZW5ndGhWYWxpZGF0b3IsXG4gICAgICAgICAgICBQYXR0ZXJuVmFsaWRhdG9yLFxuICAgICAgICAgICAgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcixcbiAgICAgICAgICAgIEVtYWlsVmFsaWRhdG9yLFxuICAgICAgICAgICAgTWluVmFsaWRhdG9yLFxuICAgICAgICAgICAgTWF4VmFsaWRhdG9yXSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVpbmogPSBpMC7Jtcm1bmdEZWNsYXJlSW5qZWN0b3IoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiDJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogybVJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogTmdNb2R1bGUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnM6IFNIQVJFRF9GT1JNX0RJUkVDVElWRVMsXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHM6IFNIQVJFRF9GT1JNX0RJUkVDVElWRVMsXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0gfSk7XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdGUgb2YgYW4gYXJyYXkgb2YgYEZvcm1Db250cm9sYCxcbiAqIGBGb3JtR3JvdXBgIG9yIGBGb3JtQXJyYXlgIGluc3RhbmNlcy5cbiAqXG4gKiBBIGBGb3JtQXJyYXlgIGFnZ3JlZ2F0ZXMgdGhlIHZhbHVlcyBvZiBlYWNoIGNoaWxkIGBGb3JtQ29udHJvbGAgaW50byBhbiBhcnJheS5cbiAqIEl0IGNhbGN1bGF0ZXMgaXRzIHN0YXR1cyBieSByZWR1Y2luZyB0aGUgc3RhdHVzIHZhbHVlcyBvZiBpdHMgY2hpbGRyZW4uIEZvciBleGFtcGxlLCBpZiBvbmUgb2ZcbiAqIHRoZSBjb250cm9scyBpbiBhIGBGb3JtQXJyYXlgIGlzIGludmFsaWQsIHRoZSBlbnRpcmUgYXJyYXkgYmVjb21lcyBpbnZhbGlkLlxuICpcbiAqIGBGb3JtQXJyYXlgIGFjY2VwdHMgb25lIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIHRoZSB0eXBlIG9mIHRoZSBjb250cm9scyBpbnNpZGUuXG4gKiBJZiB5b3UgbmVlZCBhIGhldGVyb2dlbm91cyBhcnJheSwgdXNlIHtAbGluayBVbnR5cGVkRm9ybUFycmF5fS5cbiAqXG4gKiBgRm9ybUFycmF5YCBpcyBvbmUgb2YgdGhlIGZvdXIgZnVuZGFtZW50YWwgYnVpbGRpbmcgYmxvY2tzIHVzZWQgdG8gZGVmaW5lIGZvcm1zIGluIEFuZ3VsYXIsXG4gKiBhbG9uZyB3aXRoIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBhbmQgYEZvcm1SZWNvcmRgLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENyZWF0ZSBhbiBhcnJheSBvZiBmb3JtIGNvbnRyb2xzXG4gKlxuICogYGBgXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgbmV3IEZvcm1Db250cm9sKCdOYW5jeScsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiBdKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCAnRHJldyddXG4gKiBjb25zb2xlLmxvZyhhcnIuc3RhdHVzKTsgIC8vICdWQUxJRCdcbiAqIGBgYFxuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGFycmF5IHdpdGggYXJyYXktbGV2ZWwgdmFsaWRhdG9yc1xuICpcbiAqIFlvdSBpbmNsdWRlIGFycmF5LWxldmVsIHZhbGlkYXRvcnMgYW5kIGFzeW5jIHZhbGlkYXRvcnMuIFRoZXNlIGNvbWUgaW4gaGFuZHlcbiAqIHdoZW4geW91IHdhbnQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIHRoYXQgY29uc2lkZXJzIHRoZSB2YWx1ZSBvZiBtb3JlIHRoYW4gb25lIGNoaWxkXG4gKiBjb250cm9sLlxuICpcbiAqIFRoZSB0d28gdHlwZXMgb2YgdmFsaWRhdG9ycyBhcmUgcGFzc2VkIGluIHNlcGFyYXRlbHkgYXMgdGhlIHNlY29uZCBhbmQgdGhpcmQgYXJnXG4gKiByZXNwZWN0aXZlbHksIG9yIHRvZ2V0aGVyIGFzIHBhcnQgb2YgYW4gb3B0aW9ucyBvYmplY3QuXG4gKlxuICogYGBgXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgbmV3IEZvcm1Db250cm9sKCdOYW5jeScpLFxuICogICBuZXcgRm9ybUNvbnRyb2woJ0RyZXcnKVxuICogXSwge3ZhbGlkYXRvcnM6IG15VmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcnM6IG15QXN5bmNWYWxpZGF0b3J9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBTZXQgdGhlIHVwZGF0ZU9uIHByb3BlcnR5IGZvciBhbGwgY29udHJvbHMgaW4gYSBmb3JtIGFycmF5XG4gKlxuICogVGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQgdG8gc2V0IGEgZGVmYXVsdCB2YWx1ZSBmb3IgZWFjaCBjaGlsZFxuICogY29udHJvbCdzIGB1cGRhdGVPbmAgcHJvcGVydHkuIElmIHlvdSBzZXQgYHVwZGF0ZU9uYCB0byBgJ2JsdXInYCBhdCB0aGVcbiAqIGFycmF5IGxldmVsLCBhbGwgY2hpbGQgY29udHJvbHMgZGVmYXVsdCB0byAnYmx1cicsIHVubGVzcyB0aGUgY2hpbGRcbiAqIGhhcyBleHBsaWNpdGx5IHNwZWNpZmllZCBhIGRpZmZlcmVudCBgdXBkYXRlT25gIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gKiBdLCB7dXBkYXRlT246ICdibHVyJ30pO1xuICogYGBgXG4gKlxuICogIyMjIEFkZGluZyBvciByZW1vdmluZyBjb250cm9scyBmcm9tIGEgZm9ybSBhcnJheVxuICpcbiAqIFRvIGNoYW5nZSB0aGUgY29udHJvbHMgaW4gdGhlIGFycmF5LCB1c2UgdGhlIGBwdXNoYCwgYGluc2VydGAsIGByZW1vdmVBdGAgb3IgYGNsZWFyYCBtZXRob2RzXG4gKiBpbiBgRm9ybUFycmF5YCBpdHNlbGYuIFRoZXNlIG1ldGhvZHMgZW5zdXJlIHRoZSBjb250cm9scyBhcmUgcHJvcGVybHkgdHJhY2tlZCBpbiB0aGVcbiAqIGZvcm0ncyBoaWVyYXJjaHkuIERvIG5vdCBtb2RpZnkgdGhlIGFycmF5IG9mIGBBYnN0cmFjdENvbnRyb2xgcyB1c2VkIHRvIGluc3RhbnRpYXRlXG4gKiB0aGUgYEZvcm1BcnJheWAgZGlyZWN0bHksIGFzIHRoYXQgcmVzdWx0IGluIHN0cmFuZ2UgYW5kIHVuZXhwZWN0ZWQgYmVoYXZpb3Igc3VjaFxuICogYXMgYnJva2VuIGNoYW5nZSBkZXRlY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBGb3JtQXJyYXkgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1BcnJheWAgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29udHJvbHMgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMuIEVhY2ggY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhbiBpbmRleFxuICAgICAqIHdoZXJlIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAgIHN1cGVyKHBpY2tWYWxpZGF0b3JzKHZhbGlkYXRvck9yT3B0cyksIHBpY2tBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykpO1xuICAgICAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XG4gICAgICAgIHRoaXMuX2luaXRPYnNlcnZhYmxlcygpO1xuICAgICAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgICAgICB0aGlzLl9zZXRVcENvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7XG4gICAgICAgICAgICBvbmx5U2VsZjogdHJ1ZSxcbiAgICAgICAgICAgIC8vIElmIGBhc3luY1ZhbGlkYXRvcmAgaXMgcHJlc2VudCwgaXQgd2lsbCB0cmlnZ2VyIGNvbnRyb2wgc3RhdHVzIGNoYW5nZSBmcm9tIGBQRU5ESU5HYCB0b1xuICAgICAgICAgICAgLy8gYFZBTElEYCBvciBgSU5WQUxJRGAuXG4gICAgICAgICAgICAvLyBUaGUgc3RhdHVzIHNob3VsZCBiZSBicm9hZGNhc3RlZCB2aWEgdGhlIGBzdGF0dXNDaGFuZ2VzYCBvYnNlcnZhYmxlLCBzbyB3ZSBzZXQgYGVtaXRFdmVudGBcbiAgICAgICAgICAgIC8vIHRvIGB0cnVlYCB0byBhbGxvdyB0aGF0IGR1cmluZyB0aGUgY29udHJvbCBjcmVhdGlvbiBwcm9jZXNzLlxuICAgICAgICAgICAgZW1pdEV2ZW50OiAhIXRoaXMuYXN5bmNWYWxpZGF0b3JcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZXRyaWV2ZSB0aGUgY29udHJvbC4gSWYgYGluZGV4YCBpcyBuZWdhdGl2ZSwgaXQgd2lsbCB3cmFwXG4gICAgICogICAgIGFyb3VuZCBmcm9tIHRoZSBiYWNrLCBhbmQgaWYgaW5kZXggaXMgZ3JlYXRseSBuZWdhdGl2ZSAobGVzcyB0aGFuIGAtbGVuZ3RoYCksIHRoZSByZXN1bHQgaXNcbiAgICAgKiB1bmRlZmluZWQuIFRoaXMgYmVoYXZpb3IgaXMgdGhlIHNhbWUgYXMgYEFycmF5LmF0KGluZGV4KWAuXG4gICAgICovXG4gICAgYXQoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbHNbdGhpcy5fYWRqdXN0SW5kZXgoaW5kZXgpXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zZXJ0IGEgbmV3IGBBYnN0cmFjdENvbnRyb2xgIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIHRvIGJlIGluc2VydGVkXG4gICAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAgICogICAgIGNvbnRyb2wgaXMgYWRkZWQuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgICAqIGluc2VydGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICovXG4gICAgcHVzaChjb250cm9sLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5jb250cm9scy5wdXNoKGNvbnRyb2wpO1xuICAgICAgICB0aGlzLl9yZWdpc3RlckNvbnRyb2woY29udHJvbCk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgYSBuZXcgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byBpbnNlcnQgdGhlIGNvbnRyb2wuIElmIGBpbmRleGAgaXMgbmVnYXRpdmUsIHdyYXBzIGFyb3VuZFxuICAgICAqICAgICBmcm9tIHRoZSBiYWNrLiBJZiBgaW5kZXhgIGlzIGdyZWF0bHkgbmVnYXRpdmUgKGxlc3MgdGhhbiBgLWxlbmd0aGApLCBwcmVwZW5kcyB0byB0aGUgYXJyYXkuXG4gICAgICogVGhpcyBiZWhhdmlvciBpcyB0aGUgc2FtZSBhcyBgQXJyYXkuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKWAuXG4gICAgICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIHRvIGJlIGluc2VydGVkXG4gICAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAgICogICAgIGNvbnRyb2wgaXMgaW5zZXJ0ZWQuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgICAqIGluc2VydGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICovXG4gICAgaW5zZXJ0KGluZGV4LCBjb250cm9sLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5jb250cm9scy5zcGxpY2UoaW5kZXgsIDAsIGNvbnRyb2wpO1xuICAgICAgICB0aGlzLl9yZWdpc3RlckNvbnRyb2woY29udHJvbCk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgY29udHJvbCBhdCB0aGUgZ2l2ZW4gYGluZGV4YCBpbiB0aGUgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlbW92ZSB0aGUgY29udHJvbC4gIElmIGBpbmRleGAgaXMgbmVnYXRpdmUsIHdyYXBzIGFyb3VuZFxuICAgICAqICAgICBmcm9tIHRoZSBiYWNrLiBJZiBgaW5kZXhgIGlzIGdyZWF0bHkgbmVnYXRpdmUgKGxlc3MgdGhhbiBgLWxlbmd0aGApLCByZW1vdmVzIHRoZSBmaXJzdFxuICAgICAqICAgICBlbGVtZW50LiBUaGlzIGJlaGF2aW9yIGlzIHRoZSBzYW1lIGFzIGBBcnJheS5zcGxpY2UoaW5kZXgsIDEpYC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYVxuICAgICAqICAgICBjb250cm9sIGlzIHJlbW92ZWQuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgICAqIHJlbW92ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKi9cbiAgICByZW1vdmVBdChpbmRleCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIC8vIEFkanVzdCB0aGUgaW5kZXgsIHRoZW4gY2xhbXAgaXQgYXQgbm8gbGVzcyB0aGFuIDAgdG8gcHJldmVudCB1bmRlc2lyZWQgdW5kZXJmbG93cy5cbiAgICAgICAgbGV0IGFkanVzdGVkSW5kZXggPSB0aGlzLl9hZGp1c3RJbmRleChpbmRleCk7XG4gICAgICAgIGlmIChhZGp1c3RlZEluZGV4IDwgMClcbiAgICAgICAgICAgIGFkanVzdGVkSW5kZXggPSAwO1xuICAgICAgICBpZiAodGhpcy5jb250cm9sc1thZGp1c3RlZEluZGV4XSlcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHNbYWRqdXN0ZWRJbmRleF0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHsgfSk7XG4gICAgICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGFkanVzdGVkSW5kZXgsIDEpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXBsYWNlIGFuIGV4aXN0aW5nIGNvbnRyb2wuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlcGxhY2UgdGhlIGNvbnRyb2wuIElmIGBpbmRleGAgaXMgbmVnYXRpdmUsIHdyYXBzIGFyb3VuZFxuICAgICAqICAgICBmcm9tIHRoZSBiYWNrLiBJZiBgaW5kZXhgIGlzIGdyZWF0bHkgbmVnYXRpdmUgKGxlc3MgdGhhbiBgLWxlbmd0aGApLCByZXBsYWNlcyB0aGUgZmlyc3RcbiAgICAgKiAgICAgZWxlbWVudC4gVGhpcyBiZWhhdmlvciBpcyB0aGUgc2FtZSBhcyBgQXJyYXkuc3BsaWNlKGluZGV4LCAxLCBjb250cm9sKWAuXG4gICAgICogQHBhcmFtIGNvbnRyb2wgVGhlIGBBYnN0cmFjdENvbnRyb2xgIGNvbnRyb2wgdG8gcmVwbGFjZSB0aGUgZXhpc3RpbmcgY29udHJvbFxuICAgICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUFycmF5IGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhblxuICAgICAqICAgICBleGlzdGluZyBjb250cm9sIGlzIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAgKiByZXBsYWNlZCB3aXRoIGEgbmV3IG9uZS4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgICAqL1xuICAgIHNldENvbnRyb2woaW5kZXgsIGNvbnRyb2wsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAvLyBBZGp1c3QgdGhlIGluZGV4LCB0aGVuIGNsYW1wIGl0IGF0IG5vIGxlc3MgdGhhbiAwIHRvIHByZXZlbnQgdW5kZXNpcmVkIHVuZGVyZmxvd3MuXG4gICAgICAgIGxldCBhZGp1c3RlZEluZGV4ID0gdGhpcy5fYWRqdXN0SW5kZXgoaW5kZXgpO1xuICAgICAgICBpZiAoYWRqdXN0ZWRJbmRleCA8IDApXG4gICAgICAgICAgICBhZGp1c3RlZEluZGV4ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHNbYWRqdXN0ZWRJbmRleF0pXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzW2FkanVzdGVkSW5kZXhdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7IH0pO1xuICAgICAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShhZGp1c3RlZEluZGV4LCAxKTtcbiAgICAgICAgaWYgKGNvbnRyb2wpIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGFkanVzdGVkSW5kZXgsIDAsIGNvbnRyb2wpO1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMZW5ndGggb2YgdGhlIGNvbnRyb2wgYXJyYXkuXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbHMubGVuZ3RoO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzXG4gICAgICogdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbC5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHN0cmljdCBjaGVja3MsIGFuZCB0aHJvd3MgYW4gZXJyb3IgaWYgeW91IHRyeVxuICAgICAqIHRvIHNldCB0aGUgdmFsdWUgb2YgYSBjb250cm9sIHRoYXQgZG9lc24ndCBleGlzdCBvciBpZiB5b3UgZXhjbHVkZSB0aGVcbiAgICAgKiB2YWx1ZSBvZiBhIGNvbnRyb2wuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqICMjIyBTZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGNvbnRyb2xzIGluIHRoZSBmb3JtIGFycmF5XG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgICAqICAgbmV3IEZvcm1Db250cm9sKClcbiAgICAgKiBdKTtcbiAgICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFtudWxsLCBudWxsXVxuICAgICAqXG4gICAgICogYXJyLnNldFZhbHVlKFsnTmFuY3knLCAnRHJldyddKTtcbiAgICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCAnRHJldyddXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlc1xuICAgICAqXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdFxuICAgICAqIGlzIGZhbHNlLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICAgKi9cbiAgICBzZXRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGFzc2VydEFsbFZhbHVlc1ByZXNlbnQodGhpcywgZmFsc2UsIHZhbHVlKTtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCgobmV3VmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBhc3NlcnRDb250cm9sUHJlc2VudCh0aGlzLCBmYWxzZSwgaW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5hdChpbmRleCkuc2V0VmFsdWUobmV3VmFsdWUsIHsgb25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUFycmF5YC4gSXQgYWNjZXB0cyBhbiBhcnJheSB0aGF0IG1hdGNoZXMgdGhlXG4gICAgICogc3RydWN0dXJlIG9mIHRoZSBjb250cm9sLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0XG4gICAgICogY29udHJvbHMgaW4gdGhlIGdyb3VwLlxuICAgICAqXG4gICAgICogSXQgYWNjZXB0cyBib3RoIHN1cGVyLXNldHMgYW5kIHN1Yi1zZXRzIG9mIHRoZSBhcnJheSB3aXRob3V0IHRocm93aW5nIGFuIGVycm9yLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKiAjIyMgUGF0Y2ggdGhlIHZhbHVlcyBmb3IgY29udHJvbHMgaW4gYSBmb3JtIGFycmF5XG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKVxuICAgICAqIF0pO1xuICAgICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gW251bGwsIG51bGxdXG4gICAgICpcbiAgICAgKiBhcnIucGF0Y2hWYWx1ZShbJ05hbmN5J10pO1xuICAgICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gWydOYW5jeScsIG51bGxdXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgbGF0ZXN0IHZhbHVlcyBmb3IgdGhlIGNvbnRyb2xzXG4gICAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXNcbiAgICAgKlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICAgKiBpcyBmYWxzZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sXG4gICAgICogdmFsdWUgaXMgdXBkYXRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG9cbiAgICAgKiB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5IHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICAgKi9cbiAgICBwYXRjaFZhbHVlKHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgLy8gRXZlbiB0aG91Z2ggdGhlIGB2YWx1ZWAgYXJndW1lbnQgdHlwZSBkb2Vzbid0IGFsbG93IGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLCB0aGVcbiAgICAgICAgLy8gYHBhdGNoVmFsdWVgIGNhbiBiZSBjYWxsZWQgcmVjdXJzaXZlbHkgYW5kIGlubmVyIGRhdGEgc3RydWN0dXJlcyBtaWdodCBoYXZlIHRoZXNlIHZhbHVlcyxcbiAgICAgICAgLy8gc28gd2UganVzdCBpZ25vcmUgc3VjaCBjYXNlcyB3aGVuIGEgZmllbGQgY29udGFpbmluZyBGb3JtQXJyYXkgaW5zdGFuY2UgcmVjZWl2ZXMgYG51bGxgIG9yXG4gICAgICAgIC8vIGB1bmRlZmluZWRgIGFzIGEgdmFsdWUuXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIC8qIGJvdGggYG51bGxgIGFuZCBgdW5kZWZpbmVkYCAqLylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCgobmV3VmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdChpbmRleCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0KGluZGV4KS5wYXRjaFZhbHVlKG5ld1ZhbHVlLCB7IG9ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGBGb3JtQXJyYXlgIGFuZCBhbGwgZGVzY2VuZGFudHMgYXJlIG1hcmtlZCBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCwgYW5kIHRoZVxuICAgICAqIHZhbHVlIG9mIGFsbCBkZXNjZW5kYW50cyB0byBudWxsIG9yIG51bGwgbWFwcy5cbiAgICAgKlxuICAgICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhbiBhcnJheSBvZiBzdGF0ZXNcbiAgICAgKiB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbC4gVGhlIHN0YXRlIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZVxuICAgICAqIG9yIGEgZm9ybSBzdGF0ZSBvYmplY3Qgd2l0aCBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdHVzLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKiAjIyMgUmVzZXQgdGhlIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXlcbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICAgKiBdKTtcbiAgICAgKiBhcnIucmVzZXQoWyduYW1lJywgJ2xhc3QgbmFtZSddKTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAvLyBbJ25hbWUnLCAnbGFzdCBuYW1lJ11cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqICMjIyBSZXNldCB0aGUgdmFsdWVzIGluIGEgZm9ybSBhcnJheSBhbmQgdGhlIGRpc2FibGVkIHN0YXR1cyBmb3IgdGhlIGZpcnN0IGNvbnRyb2xcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGFyci5yZXNldChbXG4gICAgICogICB7dmFsdWU6ICduYW1lJywgZGlzYWJsZWQ6IHRydWV9LFxuICAgICAqICAgJ2xhc3QnXG4gICAgICogXSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgLy8gWydsYXN0J11cbiAgICAgKiBjb25zb2xlLmxvZyhhcnIuYXQoMCkuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBjb250cm9sc1xuICAgICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAgICpcbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0XG4gICAgICogaXMgZmFsc2UuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICAgKi9cbiAgICByZXNldCh2YWx1ZSA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29udHJvbC5yZXNldCh2YWx1ZVtpbmRleF0sIHsgb25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl91cGRhdGVQcmlzdGluZShvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVG91Y2hlZChvcHRpb25zKTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZSBhcnJheSwgaW5jbHVkaW5nIGFueSBkaXNhYmxlZCBjb250cm9scy5cbiAgICAgKlxuICAgICAqIFJlcG9ydHMgYWxsIHZhbHVlcyByZWdhcmRsZXNzIG9mIGRpc2FibGVkIHN0YXR1cy5cbiAgICAgKi9cbiAgICBnZXRSYXdWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbHMubWFwKChjb250cm9sKSA9PiBjb250cm9sLmdldFJhd1ZhbHVlKCkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIGNvbnRyb2xzIGluIHRoZSBgRm9ybUFycmF5YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUFycmF5IGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhbGxcbiAgICAgKiAgICAgY29udHJvbHMgYXJlIHJlbW92ZWQuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiBhbGwgY29udHJvbHNcbiAgICAgKiBpbiB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBhcmUgcmVtb3ZlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKiAjIyMgUmVtb3ZlIGFsbCBlbGVtZW50cyBmcm9tIGEgRm9ybUFycmF5XG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgICAqICAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAgICogXSk7XG4gICAgICogY29uc29sZS5sb2coYXJyLmxlbmd0aCk7ICAvLyAyXG4gICAgICpcbiAgICAgKiBhcnIuY2xlYXIoKTtcbiAgICAgKiBjb25zb2xlLmxvZyhhcnIubGVuZ3RoKTsgIC8vIDBcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEl0J3MgYSBzaW1wbGVyIGFuZCBtb3JlIGVmZmljaWVudCBhbHRlcm5hdGl2ZSB0byByZW1vdmluZyBhbGwgZWxlbWVudHMgb25lIGJ5IG9uZTpcbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICAgKiBdKTtcbiAgICAgKlxuICAgICAqIHdoaWxlIChhcnIubGVuZ3RoKSB7XG4gICAgICogICAgYXJyLnJlbW92ZUF0KDApO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBjbGVhcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubGVuZ3RoIDwgMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sKSA9PiBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7IH0pKTtcbiAgICAgICAgdGhpcy5jb250cm9scy5zcGxpY2UoMCk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkanVzdHMgYSBuZWdhdGl2ZSBpbmRleCBieSBzdW1taW5nIGl0IHdpdGggdGhlIGxlbmd0aCBvZiB0aGUgYXJyYXkuIEZvciB2ZXJ5IG5lZ2F0aXZlXG4gICAgICogaW5kaWNlcywgdGhlIHJlc3VsdCBtYXkgcmVtYWluIG5lZ2F0aXZlLlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIF9hZGp1c3RJbmRleChpbmRleCkge1xuICAgICAgICByZXR1cm4gaW5kZXggPCAwID8gaW5kZXggKyB0aGlzLmxlbmd0aCA6IGluZGV4O1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3N5bmNQZW5kaW5nQ29udHJvbHMoKSB7XG4gICAgICAgIGxldCBzdWJ0cmVlVXBkYXRlZCA9IHRoaXMuY29udHJvbHMucmVkdWNlKCh1cGRhdGVkLCBjaGlsZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLl9zeW5jUGVuZGluZ0NvbnRyb2xzKCkgPyB0cnVlIDogdXBkYXRlZDtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICBpZiAoc3VidHJlZVVwZGF0ZWQpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBvbmx5U2VsZjogdHJ1ZSB9KTtcbiAgICAgICAgcmV0dXJuIHN1YnRyZWVVcGRhdGVkO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2ZvckVhY2hDaGlsZChjYikge1xuICAgICAgICB0aGlzLmNvbnRyb2xzLmZvckVhY2goKGNvbnRyb2wsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjYihjb250cm9sLCBpbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3VwZGF0ZVZhbHVlKCkge1xuICAgICAgICB0aGlzLnZhbHVlID1cbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMuZmlsdGVyKChjb250cm9sKSA9PiBjb250cm9sLmVuYWJsZWQgfHwgdGhpcy5kaXNhYmxlZClcbiAgICAgICAgICAgICAgICAubWFwKChjb250cm9sKSA9PiBjb250cm9sLnZhbHVlKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9hbnlDb250cm9scyhjb25kaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbHMuc29tZSgoY29udHJvbCkgPT4gY29udHJvbC5lbmFibGVkICYmIGNvbmRpdGlvbihjb250cm9sKSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfc2V0VXBDb250cm9scygpIHtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sKSA9PiB0aGlzLl9yZWdpc3RlckNvbnRyb2woY29udHJvbCkpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2FsbENvbnRyb2xzRGlzYWJsZWQoKSB7XG4gICAgICAgIGZvciAoY29uc3QgY29udHJvbCBvZiB0aGlzLmNvbnRyb2xzKSB7XG4gICAgICAgICAgICBpZiAoY29udHJvbC5lbmFibGVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9scy5sZW5ndGggPiAwIHx8IHRoaXMuZGlzYWJsZWQ7XG4gICAgfVxuICAgIF9yZWdpc3RlckNvbnRyb2woY29udHJvbCkge1xuICAgICAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICAgICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9maW5kKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXQobmFtZSkgPz8gbnVsbDtcbiAgICB9XG59XG5jb25zdCBVbnR5cGVkRm9ybUFycmF5ID0gRm9ybUFycmF5O1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFzc2VydHMgdGhhdCB0aGUgZ2l2ZW4gY29udHJvbCBpcyBhbiBpbnN0YW5jZSBvZiBgRm9ybUFycmF5YFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY29uc3QgaXNGb3JtQXJyYXkgPSAoY29udHJvbCkgPT4gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1BcnJheTtcblxuZnVuY3Rpb24gaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gISFvcHRpb25zICYmXG4gICAgICAgIChvcHRpb25zLmFzeW5jVmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBvcHRpb25zLnZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgb3B0aW9ucy51cGRhdGVPbiAhPT0gdW5kZWZpbmVkKTtcbn1cbi8vIGNsYW5nLWZvcm1hdCBvblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW4gYEFic3RyYWN0Q29udHJvbGAgZnJvbSBhIHVzZXItc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogVGhlIGBGb3JtQnVpbGRlcmAgcHJvdmlkZXMgc3ludGFjdGljIHN1Z2FyIHRoYXQgc2hvcnRlbnMgY3JlYXRpbmcgaW5zdGFuY2VzIG9mIGFcbiAqIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBvciBgRm9ybUFycmF5YC4gSXQgcmVkdWNlcyB0aGUgYW1vdW50IG9mIGJvaWxlcnBsYXRlIG5lZWRlZCB0b1xuICogYnVpbGQgY29tcGxleCBmb3Jtcy5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBGb3JtQnVpbGRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudXNlTm9uTnVsbGFibGUgPSBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhIEZvcm1CdWlsZGVyIGluIHdoaWNoIGF1dG9tYXRpY2FsbHkgY29uc3RydWN0ZWQgYEZvcm1Db250cm9sYCBlbGVtZW50c1xuICAgICAqIGhhdmUgYHtub25OdWxsYWJsZTogdHJ1ZX1gIGFuZCBhcmUgbm9uLW51bGxhYmxlLlxuICAgICAqXG4gICAgICogKipDb25zdHJ1Y3Rpbmcgbm9uLW51bGxhYmxlIGNvbnRyb2xzKipcbiAgICAgKlxuICAgICAqIFdoZW4gY29uc3RydWN0aW5nIGEgY29udHJvbCwgaXQgd2lsbCBiZSBub24tbnVsbGFibGUsIGFuZCB3aWxsIHJlc2V0IHRvIGl0cyBpbml0aWFsIHZhbHVlLlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBsZXQgbm5mYiA9IG5ldyBGb3JtQnVpbGRlcigpLm5vbk51bGxhYmxlO1xuICAgICAqIGxldCBuYW1lID0gbm5mYi5jb250cm9sKCdBbGV4Jyk7IC8vIEZvcm1Db250cm9sPHN0cmluZz5cbiAgICAgKiBuYW1lLnJlc2V0KCk7XG4gICAgICogY29uc29sZS5sb2cobmFtZSk7IC8vICdBbGV4J1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogKipDb25zdHJ1Y3Rpbmcgbm9uLW51bGxhYmxlIGdyb3VwcyBvciBhcnJheXMqKlxuICAgICAqXG4gICAgICogV2hlbiBjb25zdHJ1Y3RpbmcgYSBncm91cCBvciBhcnJheSwgYWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpbm5lciBjb250cm9scyB3aWxsIGJlXG4gICAgICogbm9uLW51bGxhYmxlLCBhbmQgd2lsbCByZXNldCB0byB0aGVpciBpbml0aWFsIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICAgKiBsZXQgbmFtZSA9IG5uZmIuZ3JvdXAoe3dobzogJ0FsZXgnfSk7IC8vIEZvcm1Hcm91cDx7d2hvOiBGb3JtQ29udHJvbDxzdHJpbmc+fT5cbiAgICAgKiBuYW1lLnJlc2V0KCk7XG4gICAgICogY29uc29sZS5sb2cobmFtZSk7IC8vIHt3aG86ICdBbGV4J31cbiAgICAgKiBgYGBcbiAgICAgKiAqKkNvbnN0cnVjdGluZyAqbnVsbGFibGUqIGZpZWxkcyBvbiBncm91cHMgb3IgYXJyYXlzKipcbiAgICAgKlxuICAgICAqIEl0IGlzIHN0aWxsIHBvc3NpYmxlIHRvIGhhdmUgYSBudWxsYWJsZSBmaWVsZC4gSW4gcGFydGljdWxhciwgYW55IGBGb3JtQ29udHJvbGAgd2hpY2ggaXNcbiAgICAgKiAqYWxyZWFkeSogY29uc3RydWN0ZWQgd2lsbCBub3QgYmUgYWx0ZXJlZC4gRm9yIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIGxldCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCkubm9uTnVsbGFibGU7XG4gICAgICogLy8gRm9ybUdyb3VwPHt3aG86IEZvcm1Db250cm9sPHN0cmluZ3xudWxsPn0+XG4gICAgICogbGV0IG5hbWUgPSBubmZiLmdyb3VwKHt3aG86IG5ldyBGb3JtQ29udHJvbCgnQWxleCcpfSk7XG4gICAgICogbmFtZS5yZXNldCgpOyBjb25zb2xlLmxvZyhuYW1lKTsgLy8ge3dobzogbnVsbH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEJlY2F1c2UgdGhlIGlubmVyIGNvbnRyb2wgaXMgY29uc3RydWN0ZWQgZXhwbGljaXRseSBieSB0aGUgY2FsbGVyLCB0aGUgYnVpbGRlciBoYXNcbiAgICAgKiBubyBjb250cm9sIG92ZXIgaG93IGl0IGlzIGNyZWF0ZWQsIGFuZCBjYW5ub3QgZXhjbHVkZSB0aGUgYG51bGxgLlxuICAgICAqL1xuICAgIGdldCBub25OdWxsYWJsZSgpIHtcbiAgICAgICAgY29uc3Qgbm5mYiA9IG5ldyBGb3JtQnVpbGRlcigpO1xuICAgICAgICBubmZiLnVzZU5vbk51bGxhYmxlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5uZmI7XG4gICAgfVxuICAgIGdyb3VwKGNvbnRyb2xzLCBvcHRpb25zID0gbnVsbCkge1xuICAgICAgICBjb25zdCByZWR1Y2VkQ29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9scyk7XG4gICAgICAgIGxldCBuZXdPcHRpb25zID0ge307XG4gICAgICAgIGlmIChpc0Fic3RyYWN0Q29udHJvbE9wdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIC8vIGBvcHRpb25zYCBhcmUgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgXG4gICAgICAgICAgICBuZXdPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBgb3B0aW9uc2AgYXJlIGxlZ2FjeSBmb3JtIGdyb3VwIG9wdGlvbnNcbiAgICAgICAgICAgIG5ld09wdGlvbnMudmFsaWRhdG9ycyA9IG9wdGlvbnMudmFsaWRhdG9yO1xuICAgICAgICAgICAgbmV3T3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgPSBvcHRpb25zLmFzeW5jVmFsaWRhdG9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRm9ybUdyb3VwKHJlZHVjZWRDb250cm9scywgbmV3T3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1SZWNvcmRgIGluc3RhbmNlLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgYWxsIHRoZSBrZXlzIGFuZCBjb3JyZXNwb25kaW5nIGlubmVyIGNvbnRyb2wgdHlwZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAgICogdW5kZXIgd2hpY2ggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybVJlY29yZGAuIFRoZSBvYmplY3Qgc2hvdWxkIGhhdmUgdGhlXG4gICAgICogYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIHR5cGUgYW5kIG1pZ2h0IGNvbnRhaW4gdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gICAgICogKiBgdmFsaWRhdG9yc2A6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgICAqICogYGFzeW5jVmFsaWRhdG9yc2A6IEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgICAqICogYHVwZGF0ZU9uYDogVGhlIGV2ZW50IHVwb24gd2hpY2ggdGhlIGNvbnRyb2wgc2hvdWxkIGJlIHVwZGF0ZWQgKG9wdGlvbnM6ICdjaGFuZ2UnIHwgJ2JsdXInXG4gICAgICogfCBzdWJtaXQnKS5cbiAgICAgKi9cbiAgICByZWNvcmQoY29udHJvbHMsIG9wdGlvbnMgPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHJlZHVjZWRDb250cm9scyA9IHRoaXMuX3JlZHVjZUNvbnRyb2xzKGNvbnRyb2xzKTtcbiAgICAgICAgLy8gQ2FzdCB0byBgYW55YCBiZWNhdXNlIHRoZSBpbmZlcnJlZCB0eXBlcyBhcmUgbm90IGFzIHNwZWNpZmljIGFzIEVsZW1lbnQuXG4gICAgICAgIHJldHVybiBuZXcgRm9ybVJlY29yZChyZWR1Y2VkQ29udHJvbHMsIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtQ29udHJvbGAgd2l0aCB0aGUgZ2l2ZW4gc3RhdGUsIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuIFNldHNcbiAgICAgKiBge25vbk51bGxhYmxlOiB0cnVlfWAgaW4gdGhlIG9wdGlvbnMgdG8gZ2V0IGEgbm9uLW51bGxhYmxlIGNvbnRyb2wuIE90aGVyd2lzZSwgdGhlXG4gICAgICogY29udHJvbCB3aWxsIGJlIG51bGxhYmxlLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIHRoZSB0eXBlICBvZiB0aGVcbiAgICAgKiBjb250cm9sJ3MgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCBzdGF0ZSB2YWx1ZSwgb3JcbiAgICAgKiB3aXRoIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0dXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhIGBGb3JtQ29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICAgKiBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqXG4gICAgICogIyMjIEluaXRpYWxpemUgYSBjb250cm9sIGFzIGRpc2FibGVkXG4gICAgICpcbiAgICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmV0dXJucyBhIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlIGluIGEgZGlzYWJsZWQgc3RhdGUuXG4gICAgICpcbiAgICAgKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJmb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50c1wiIHJlZ2lvbj1cImRpc2FibGVkLWNvbnRyb2xcIj5cbiAgICAgKiA8L2NvZGUtZXhhbXBsZT5cbiAgICAgKi9cbiAgICBjb250cm9sKGZvcm1TdGF0ZSwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgICBsZXQgbmV3T3B0aW9ucyA9IHt9O1xuICAgICAgICBpZiAoIXRoaXMudXNlTm9uTnVsbGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKHZhbGlkYXRvck9yT3B0cykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBzZWNvbmQgYXJndW1lbnQgaXMgb3B0aW9ucywgdGhlbiB0aGV5IGFyZSBjb3BpZWQuXG4gICAgICAgICAgICBuZXdPcHRpb25zID0gdmFsaWRhdG9yT3JPcHRzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgdGhlIG90aGVyIGFyZ3VtZW50cyBhcmUgdmFsaWRhdG9ycywgdGhleSBhcmUgY29waWVkIGludG8gYW4gb3B0aW9ucyBvYmplY3QuXG4gICAgICAgICAgICBuZXdPcHRpb25zLnZhbGlkYXRvcnMgPSB2YWxpZGF0b3JPck9wdHM7XG4gICAgICAgICAgICBuZXdPcHRpb25zLmFzeW5jVmFsaWRhdG9ycyA9IGFzeW5jVmFsaWRhdG9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2woZm9ybVN0YXRlLCB7IC4uLm5ld09wdGlvbnMsIG5vbk51bGxhYmxlOiB0cnVlIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtQXJyYXlgIGZyb20gdGhlIGdpdmVuIGFycmF5IG9mIGNvbmZpZ3VyYXRpb25zLFxuICAgICAqIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuIEFjY2VwdHMgYSBzaW5nbGUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggaXMgdGhlIHR5cGUgb2YgZWFjaCBjb250cm9sXG4gICAgICogaW5zaWRlIHRoZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb250cm9scyBBbiBhcnJheSBvZiBjaGlsZCBjb250cm9scyBvciBjb250cm9sIGNvbmZpZ3MuIEVhY2ggY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhblxuICAgICAqICAgICBpbmRleCB3aGVuIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiBzdWNoIGZ1bmN0aW9ucywgb3IgYW5cbiAgICAgKiAgICAgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgICAqL1xuICAgIGFycmF5KGNvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAgIGNvbnN0IGNyZWF0ZWRDb250cm9scyA9IGNvbnRyb2xzLm1hcChjID0+IHRoaXMuX2NyZWF0ZUNvbnRyb2woYykpO1xuICAgICAgICAvLyBDYXN0IHRvIGBhbnlgIGJlY2F1c2UgdGhlIGluZmVycmVkIHR5cGVzIGFyZSBub3QgYXMgc3BlY2lmaWMgYXMgRWxlbWVudC5cbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtQXJyYXkoY3JlYXRlZENvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9yZWR1Y2VDb250cm9scyhjb250cm9scykge1xuICAgICAgICBjb25zdCBjcmVhdGVkQ29udHJvbHMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMoY29udHJvbHMpLmZvckVhY2goY29udHJvbE5hbWUgPT4ge1xuICAgICAgICAgICAgY3JlYXRlZENvbnRyb2xzW2NvbnRyb2xOYW1lXSA9IHRoaXMuX2NyZWF0ZUNvbnRyb2woY29udHJvbHNbY29udHJvbE5hbWVdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjcmVhdGVkQ29udHJvbHM7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfY3JlYXRlQ29udHJvbChjb250cm9scykge1xuICAgICAgICBpZiAoY29udHJvbHMgaW5zdGFuY2VvZiBGb3JtQ29udHJvbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbnRyb2xzIGluc3RhbmNlb2YgQWJzdHJhY3RDb250cm9sKSB7IC8vIEEgY29udHJvbDsganVzdCByZXR1cm4gaXRcbiAgICAgICAgICAgIHJldHVybiBjb250cm9scztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xzKSkgeyAvLyBDb250cm9sQ29uZmlnIFR1cGxlXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRyb2xzWzBdO1xuICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gY29udHJvbHMubGVuZ3RoID4gMSA/IGNvbnRyb2xzWzFdIDogbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9yID0gY29udHJvbHMubGVuZ3RoID4gMiA/IGNvbnRyb2xzWzJdIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wodmFsdWUsIHZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBUIG9yIEZvcm1Db250cm9sU3RhdGU8VD5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2woY29udHJvbHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1CdWlsZGVyLCBkZXBzOiBbXSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5JbmplY3RhYmxlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtXByb3YgPSBpMC7Jtcm1bmdEZWNsYXJlSW5qZWN0YWJsZSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1CdWlsZGVyLCBwcm92aWRlZEluOiAncm9vdCcgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRm9ybUJ1aWxkZXIsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBJbmplY3RhYmxlLFxuICAgICAgICAgICAgYXJnczogW3sgcHJvdmlkZWRJbjogJ3Jvb3QnIH1dXG4gICAgICAgIH1dIH0pO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIGBOb25OdWxsYWJsZUZvcm1CdWlsZGVyYCBpcyBzaW1pbGFyIHRvIHtAbGluayBGb3JtQnVpbGRlcn0sIGJ1dCBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdGVkXG4gKiB7QGxpbmsgRm9ybUNvbnRyb2x9IGVsZW1lbnRzIGhhdmUgYHtub25OdWxsYWJsZTogdHJ1ZX1gIGFuZCBhcmUgbm9uLW51bGxhYmxlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTm9uTnVsbGFibGVGb3JtQnVpbGRlciB7XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTm9uTnVsbGFibGVGb3JtQnVpbGRlciwgZGVwczogW10sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuSW5qZWN0YWJsZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVwcm92ID0gaTAuybXJtW5nRGVjbGFyZUluamVjdGFibGUoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOb25OdWxsYWJsZUZvcm1CdWlsZGVyLCBwcm92aWRlZEluOiAncm9vdCcsIHVzZUZhY3Rvcnk6ICgpID0+IGluamVjdChGb3JtQnVpbGRlcikubm9uTnVsbGFibGUgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTm9uTnVsbGFibGVGb3JtQnVpbGRlciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IEluamVjdGFibGUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICAgICAgICAgICAgICAgIHVzZUZhY3Rvcnk6ICgpID0+IGluamVjdChGb3JtQnVpbGRlcikubm9uTnVsbGFibGUsXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0gfSk7XG4vKipcbiAqIFVudHlwZWRGb3JtQnVpbGRlciBpcyB0aGUgc2FtZSBhcyBgRm9ybUJ1aWxkZXJgLCBidXQgaXQgcHJvdmlkZXMgdW50eXBlZCBjb250cm9scy5cbiAqL1xuY2xhc3MgVW50eXBlZEZvcm1CdWlsZGVyIGV4dGVuZHMgRm9ybUJ1aWxkZXIge1xuICAgIGdyb3VwKGNvbnRyb2xzQ29uZmlnLCBvcHRpb25zID0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuZ3JvdXAoY29udHJvbHNDb25maWcsIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMaWtlIGBGb3JtQnVpbGRlciNjb250cm9sYCwgZXhjZXB0IHRoZSByZXN1bHRpbmcgY29udHJvbCBpcyB1bnR5cGVkLlxuICAgICAqL1xuICAgIGNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb250cm9sKGZvcm1TdGF0ZSwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExpa2UgYEZvcm1CdWlsZGVyI2FycmF5YCwgZXhjZXB0IHRoZSByZXN1bHRpbmcgYXJyYXkgaXMgdW50eXBlZC5cbiAgICAgKi9cbiAgICBhcnJheShjb250cm9sc0NvbmZpZywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgICByZXR1cm4gc3VwZXIuYXJyYXkoY29udHJvbHNDb25maWcsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBVbnR5cGVkRm9ybUJ1aWxkZXIsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuSW5qZWN0YWJsZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVwcm92ID0gaTAuybXJtW5nRGVjbGFyZUluamVjdGFibGUoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBVbnR5cGVkRm9ybUJ1aWxkZXIsIHByb3ZpZGVkSW46ICdyb290JyB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBVbnR5cGVkRm9ybUJ1aWxkZXIsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBJbmplY3RhYmxlLFxuICAgICAgICAgICAgYXJnczogW3sgcHJvdmlkZWRJbjogJ3Jvb3QnIH1dXG4gICAgICAgIH1dIH0pO1xuXG4vKipcbiAqIEBtb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICogRW50cnkgcG9pbnQgZm9yIGFsbCBwdWJsaWMgQVBJcyBvZiB0aGUgZm9ybXMgcGFja2FnZS5cbiAqL1xuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNvbnN0IFZFUlNJT04gPSBuZXcgVmVyc2lvbignMTcuMy4xMicpO1xuXG4vKipcbiAqIEV4cG9ydHMgdGhlIHJlcXVpcmVkIHByb3ZpZGVycyBhbmQgZGlyZWN0aXZlcyBmb3IgdGVtcGxhdGUtZHJpdmVuIGZvcm1zLFxuICogbWFraW5nIHRoZW0gYXZhaWxhYmxlIGZvciBpbXBvcnQgYnkgTmdNb2R1bGVzIHRoYXQgaW1wb3J0IHRoaXMgbW9kdWxlLlxuICpcbiAqIEBzZWUgW0Zvcm1zIE92ZXJ2aWV3XSgvZ3VpZGUvZm9ybXMtb3ZlcnZpZXcpXG4gKiBAc2VlIFtUZW1wbGF0ZS1kcml2ZW4gRm9ybXMgR3VpZGVdKC9ndWlkZS9mb3JtcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIEZvcm1zTW9kdWxlIHtcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBQcm92aWRlcyBvcHRpb25zIGZvciBjb25maWd1cmluZyB0aGUgZm9ybXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgQW4gb2JqZWN0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgICAqICogYGNhbGxTZXREaXNhYmxlZFN0YXRlYCBDb25maWd1cmVzIHdoZXRoZXIgdG8gYGFsd2F5c2AgY2FsbCBgc2V0RGlzYWJsZWRTdGF0ZWAsIHdoaWNoIGlzIG1vcmVcbiAgICAgKiBjb3JyZWN0LCBvciB0byBvbmx5IGNhbGwgaXQgYHdoZW5EaXNhYmxlZGAsIHdoaWNoIGlzIHRoZSBsZWdhY3kgYmVoYXZpb3IuXG4gICAgICovXG4gICAgc3RhdGljIHdpdGhDb25maWcob3B0cykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmdNb2R1bGU6IEZvcm1zTW9kdWxlLFxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbe1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSxcbiAgICAgICAgICAgICAgICAgICAgdXNlVmFsdWU6IG9wdHMuY2FsbFNldERpc2FibGVkU3RhdGUgPz8gc2V0RGlzYWJsZWRTdGF0ZURlZmF1bHRcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3Jtc01vZHVsZSwgZGVwczogW10sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuTmdNb2R1bGUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1bW9kID0gaTAuybXJtW5nRGVjbGFyZU5nTW9kdWxlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRm9ybXNNb2R1bGUsIGRlY2xhcmF0aW9uczogW05nTW9kZWwsIE5nTW9kZWxHcm91cCwgTmdGb3JtXSwgZXhwb3J0czogW8m1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgTmdNb2RlbCwgTmdNb2RlbEdyb3VwLCBOZ0Zvcm1dIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWluaiA9IGkwLsm1ybVuZ0RlY2xhcmVJbmplY3Rvcih7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1zTW9kdWxlLCBpbXBvcnRzOiBbybVJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlXSB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3Jtc01vZHVsZSwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IE5nTW9kdWxlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zOiBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFUyxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0czogW8m1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVNdXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0gfSk7XG4vKipcbiAqIEV4cG9ydHMgdGhlIHJlcXVpcmVkIGluZnJhc3RydWN0dXJlIGFuZCBkaXJlY3RpdmVzIGZvciByZWFjdGl2ZSBmb3JtcyxcbiAqIG1ha2luZyB0aGVtIGF2YWlsYWJsZSBmb3IgaW1wb3J0IGJ5IE5nTW9kdWxlcyB0aGF0IGltcG9ydCB0aGlzIG1vZHVsZS5cbiAqXG4gKiBAc2VlIFtGb3JtcyBPdmVydmlld10oZ3VpZGUvZm9ybXMtb3ZlcnZpZXcpXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBSZWFjdGl2ZUZvcm1zTW9kdWxlIHtcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBQcm92aWRlcyBvcHRpb25zIGZvciBjb25maWd1cmluZyB0aGUgcmVhY3RpdmUgZm9ybXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgQW4gb2JqZWN0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgICAqICogYHdhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2xgIENvbmZpZ3VyZXMgd2hlbiB0byBlbWl0IGEgd2FybmluZyB3aGVuIGFuIGBuZ01vZGVsYFxuICAgICAqIGJpbmRpbmcgaXMgdXNlZCB3aXRoIHJlYWN0aXZlIGZvcm0gZGlyZWN0aXZlcy5cbiAgICAgKiAqIGBjYWxsU2V0RGlzYWJsZWRTdGF0ZWAgQ29uZmlndXJlcyB3aGV0aGVyIHRvIGBhbHdheXNgIGNhbGwgYHNldERpc2FibGVkU3RhdGVgLCB3aGljaCBpcyBtb3JlXG4gICAgICogY29ycmVjdCwgb3IgdG8gb25seSBjYWxsIGl0IGB3aGVuRGlzYWJsZWRgLCB3aGljaCBpcyB0aGUgbGVnYWN5IGJlaGF2aW9yLlxuICAgICAqL1xuICAgIHN0YXRpYyB3aXRoQ29uZmlnKG9wdHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5nTW9kdWxlOiBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HLFxuICAgICAgICAgICAgICAgICAgICB1c2VWYWx1ZTogb3B0cy53YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sID8/ICdhbHdheXMnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IENBTExfU0VUX0RJU0FCTEVEX1NUQVRFLFxuICAgICAgICAgICAgICAgICAgICB1c2VWYWx1ZTogb3B0cy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSA/PyBzZXREaXNhYmxlZFN0YXRlRGVmYXVsdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUmVhY3RpdmVGb3Jtc01vZHVsZSwgZGVwczogW10sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuTmdNb2R1bGUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1bW9kID0gaTAuybXJtW5nRGVjbGFyZU5nTW9kdWxlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUmVhY3RpdmVGb3Jtc01vZHVsZSwgZGVjbGFyYXRpb25zOiBbRm9ybUNvbnRyb2xEaXJlY3RpdmUsIEZvcm1Hcm91cERpcmVjdGl2ZSwgRm9ybUNvbnRyb2xOYW1lLCBGb3JtR3JvdXBOYW1lLCBGb3JtQXJyYXlOYW1lXSwgZXhwb3J0czogW8m1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgRm9ybUNvbnRyb2xEaXJlY3RpdmUsIEZvcm1Hcm91cERpcmVjdGl2ZSwgRm9ybUNvbnRyb2xOYW1lLCBGb3JtR3JvdXBOYW1lLCBGb3JtQXJyYXlOYW1lXSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVpbmogPSBpMC7Jtcm1bmdEZWNsYXJlSW5qZWN0b3IoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSZWFjdGl2ZUZvcm1zTW9kdWxlLCBpbXBvcnRzOiBbybVJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlXSB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSZWFjdGl2ZUZvcm1zTW9kdWxlLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogTmdNb2R1bGUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnM6IFtSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFU10sXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHM6IFvJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dIH0pO1xuXG4vKipcbiAqIEBtb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBtb2R1bGUgaXMgdXNlZCBmb3IgaGFuZGxpbmcgdXNlciBpbnB1dCwgYnkgZGVmaW5pbmcgYW5kIGJ1aWxkaW5nIGEgYEZvcm1Hcm91cGAgdGhhdFxuICogY29uc2lzdHMgb2YgYEZvcm1Db250cm9sYCBvYmplY3RzLCBhbmQgbWFwcGluZyB0aGVtIG9udG8gdGhlIERPTS4gYEZvcm1Db250cm9sYFxuICogb2JqZWN0cyBjYW4gdGhlbiBiZSB1c2VkIHRvIHJlYWQgaW5mb3JtYXRpb24gZnJvbSB0aGUgZm9ybSBET00gZWxlbWVudHMuXG4gKlxuICogRm9ybXMgcHJvdmlkZXJzIGFyZSBub3QgaW5jbHVkZWQgaW4gZGVmYXVsdCBwcm92aWRlcnM7IHlvdSBtdXN0IGltcG9ydCB0aGVzZSBwcm92aWRlcnNcbiAqIGV4cGxpY2l0bHkuXG4gKi9cblxuLyoqXG4gKiBAbW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqIEVudHJ5IHBvaW50IGZvciBhbGwgcHVibGljIEFQSXMgb2YgdGhpcyBwYWNrYWdlLlxuICovXG4vLyBUaGlzIGZpbGUgb25seSByZWV4cG9ydHMgY29udGVudCBvZiB0aGUgYHNyY2AgZm9sZGVyLiBLZWVwIGl0IHRoYXQgd2F5LlxuXG4vLyBUaGlzIGZpbGUgaXMgbm90IHVzZWQgdG8gYnVpbGQgdGhpcyBtb2R1bGUuIEl0IGlzIG9ubHkgdXNlZCBkdXJpbmcgZWRpdGluZ1xuXG4vKipcbiAqIEdlbmVyYXRlZCBidW5kbGUgaW5kZXguIERvIG5vdCBlZGl0LlxuICovXG5cbmV4cG9ydCB7IEFic3RyYWN0Q29udHJvbCwgQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlLCBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSwgQ09NUE9TSVRJT05fQlVGRkVSX01PREUsIENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3IsIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsIENvbnRyb2xDb250YWluZXIsIERlZmF1bHRWYWx1ZUFjY2Vzc29yLCBFbWFpbFZhbGlkYXRvciwgRm9ybUFycmF5LCBGb3JtQXJyYXlOYW1lLCBGb3JtQnVpbGRlciwgRm9ybUNvbnRyb2wsIEZvcm1Db250cm9sRGlyZWN0aXZlLCBGb3JtQ29udHJvbE5hbWUsIEZvcm1Hcm91cCwgRm9ybUdyb3VwRGlyZWN0aXZlLCBGb3JtR3JvdXBOYW1lLCBGb3JtUmVjb3JkLCBGb3Jtc01vZHVsZSwgTWF4TGVuZ3RoVmFsaWRhdG9yLCBNYXhWYWxpZGF0b3IsIE1pbkxlbmd0aFZhbGlkYXRvciwgTWluVmFsaWRhdG9yLCBOR19BU1lOQ19WQUxJREFUT1JTLCBOR19WQUxJREFUT1JTLCBOR19WQUxVRV9BQ0NFU1NPUiwgTmdDb250cm9sLCBOZ0NvbnRyb2xTdGF0dXMsIE5nQ29udHJvbFN0YXR1c0dyb3VwLCBOZ0Zvcm0sIE5nTW9kZWwsIE5nTW9kZWxHcm91cCwgTmdTZWxlY3RPcHRpb24sIE5vbk51bGxhYmxlRm9ybUJ1aWxkZXIsIE51bWJlclZhbHVlQWNjZXNzb3IsIFBhdHRlcm5WYWxpZGF0b3IsIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IsIFJhbmdlVmFsdWVBY2Nlc3NvciwgUmVhY3RpdmVGb3Jtc01vZHVsZSwgUmVxdWlyZWRWYWxpZGF0b3IsIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBVbnR5cGVkRm9ybUFycmF5LCBVbnR5cGVkRm9ybUJ1aWxkZXIsIFVudHlwZWRGb3JtQ29udHJvbCwgVW50eXBlZEZvcm1Hcm91cCwgVkVSU0lPTiwgVmFsaWRhdG9ycywgaXNGb3JtQXJyYXksIGlzRm9ybUNvbnRyb2wsIGlzRm9ybUdyb3VwLCBpc0Zvcm1SZWNvcmQsIMm1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgybVOZ05vVmFsaWRhdGUsIMm1TmdTZWxlY3RNdWx0aXBsZU9wdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9ybXMubWpzLm1hcFxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwidmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mID8gKG9iaikgPT4gKE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopKSA6IChvYmopID0+IChvYmouX19wcm90b19fKTtcbnZhciBsZWFmUHJvdG90eXBlcztcbi8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuLy8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4vLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbi8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuLy8gbW9kZSAmIDE2OiByZXR1cm4gdmFsdWUgd2hlbiBpdCdzIFByb21pc2UtbGlrZVxuLy8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuX193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcblx0aWYobW9kZSAmIDEpIHZhbHVlID0gdGhpcyh2YWx1ZSk7XG5cdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG5cdGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcblx0XHRpZigobW9kZSAmIDQpICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcblx0XHRpZigobW9kZSAmIDE2KSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHZhbHVlO1xuXHR9XG5cdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG5cdHZhciBkZWYgPSB7fTtcblx0bGVhZlByb3RvdHlwZXMgPSBsZWFmUHJvdG90eXBlcyB8fCBbbnVsbCwgZ2V0UHJvdG8oe30pLCBnZXRQcm90byhbXSksIGdldFByb3RvKGdldFByb3RvKV07XG5cdGZvcih2YXIgY3VycmVudCA9IG1vZGUgJiAyICYmIHZhbHVlOyB0eXBlb2YgY3VycmVudCA9PSAnb2JqZWN0JyAmJiAhfmxlYWZQcm90b3R5cGVzLmluZGV4T2YoY3VycmVudCk7IGN1cnJlbnQgPSBnZXRQcm90byhjdXJyZW50KSkge1xuXHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGN1cnJlbnQpLmZvckVhY2goKGtleSkgPT4gKGRlZltrZXldID0gKCkgPT4gKHZhbHVlW2tleV0pKSk7XG5cdH1cblx0ZGVmWydkZWZhdWx0J10gPSAoKSA9PiAodmFsdWUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGRlZik7XG5cdHJldHVybiBucztcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNS0yMDI0LiBSaXRlbnNlIEJWLCB0aGUgTmV0aGVybGFuZHMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgRVVQTCwgVmVyc2lvbiAxLjIgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwczovL2pvaW51cC5lYy5ldXJvcGEuZXUvY29sbGVjdGlvbi9ldXBsL2V1cGwtdGV4dC1ldXBsLTEyXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuICpcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG4vKlxuICogUHVibGljIEFQSSBTdXJmYWNlIG9mIHNsYWNrXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9saWIvbW9kZWxzL2luZGV4JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2Ftc3RlcmRhbS1lbWFpbGFwaS1wbHVnaW4tbW9kdWxlJztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2Ftc3RlcmRhbS1lbWFpbGFwaS1wbHVnaW4uc3BlY2lmaWNhdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9jb21wb25lbnRzL3NlbmQtZW1haWwvc2VuZC1lbWFpbC1jb25maWd1cmF0aW9uLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9jb21wb25lbnRzL2Ftc3RlcmRhbS1lbWFpbGFwaS1jb25maWd1cmF0aW9uL2Ftc3RlcmRhbS1lbWFpbGFwaS1jb25maWd1cmF0aW9uLmNvbXBvbmVudCc7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=