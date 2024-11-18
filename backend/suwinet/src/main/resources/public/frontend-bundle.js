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

/***/ "./src/lib/assets/index.ts":
/*!*********************************!*\
  !*** ./src/lib/assets/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SUWINET_PLUGIN_LOGO_BASE64: () => (/* reexport safe */ _suwinet_plugin_logo__WEBPACK_IMPORTED_MODULE_0__.SUWINET_PLUGIN_LOGO_BASE64)
/* harmony export */ });
/* harmony import */ var _suwinet_plugin_logo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./suwinet-plugin-logo */ "./src/lib/assets/suwinet-plugin-logo.ts");
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

/***/ "./src/lib/assets/suwinet-plugin-logo.ts":
/*!***********************************************!*\
  !*** ./src/lib/assets/suwinet-plugin-logo.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SUWINET_PLUGIN_LOGO_BASE64: () => (/* binding */ SUWINET_PLUGIN_LOGO_BASE64)
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
const SUWINET_PLUGIN_LOGO_BASE64 = 'data:image/png;base64,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';



/***/ }),

/***/ "./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrpKinderenInfoComponent: () => (/* binding */ BrpKinderenInfoComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "rxjs");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_2__);
/*
 * Copyright 2015-2020 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



let BrpKinderenInfoComponent = class BrpKinderenInfoComponent {
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
        const valid = !!(formValue.kinderenBsns &&
            formValue.resultProcessVariableName);
        this.valid$.next(valid);
        this.valid.emit(valid);
    }
    openSaveSubscription() {
        this.saveSubscription = this.save$?.subscribe(() => {
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
], BrpKinderenInfoComponent.prototype, "save$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpKinderenInfoComponent.prototype, "disabled$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpKinderenInfoComponent.prototype, "pluginId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpKinderenInfoComponent.prototype, "prefillConfiguration$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], BrpKinderenInfoComponent.prototype, "valid", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], BrpKinderenInfoComponent.prototype, "configuration", void 0);
BrpKinderenInfoComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Component)({
        selector: 'brp-partner-info',
        template: __webpack_require__(/*! ./brp-kinderen-info.component.html */ "./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.html"),
        styles: [__webpack_require__(/*! ./brp-kinderen-info.component.scss */ "./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.scss")],
    })
], BrpKinderenInfoComponent);



/***/ }),

/***/ "./src/lib/components/brp-partner-info/brp-partner-info.component.ts":
/*!***************************************************************************!*\
  !*** ./src/lib/components/brp-partner-info/brp-partner-info.component.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrpPartnerInfoComponent: () => (/* binding */ BrpPartnerInfoComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "rxjs");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_2__);
/*
 * Copyright 2015-2020 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



let BrpPartnerInfoComponent = class BrpPartnerInfoComponent {
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
        const valid = !!(formValue.bsn &&
            formValue.resultProcessVariableName);
        this.valid$.next(valid);
        this.valid.emit(valid);
    }
    openSaveSubscription() {
        this.saveSubscription = this.save$?.subscribe(() => {
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
], BrpPartnerInfoComponent.prototype, "save$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpPartnerInfoComponent.prototype, "disabled$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpPartnerInfoComponent.prototype, "pluginId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpPartnerInfoComponent.prototype, "prefillConfiguration$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], BrpPartnerInfoComponent.prototype, "valid", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], BrpPartnerInfoComponent.prototype, "configuration", void 0);
BrpPartnerInfoComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Component)({
        selector: 'brp-partner-info',
        template: __webpack_require__(/*! ./brp-partner-info.component.html */ "./src/lib/components/brp-partner-info/brp-partner-info.component.html"),
        styles: [__webpack_require__(/*! ./brp-partner-info.component.scss */ "./src/lib/components/brp-partner-info/brp-partner-info.component.scss")],
    })
], BrpPartnerInfoComponent);



/***/ }),

/***/ "./src/lib/components/brp-persoon-info/brp-persoon-info.component.ts":
/*!***************************************************************************!*\
  !*** ./src/lib/components/brp-persoon-info/brp-persoon-info.component.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrpPersoonInfoComponent: () => (/* binding */ BrpPersoonInfoComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "rxjs");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_2__);
/*
 * Copyright 2015-2020 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



let BrpPersoonInfoComponent = class BrpPersoonInfoComponent {
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
        const valid = !!(formValue.bsn &&
            formValue.resultProcessVariableName);
        this.valid$.next(valid);
        this.valid.emit(valid);
    }
    openSaveSubscription() {
        this.saveSubscription = this.save$?.subscribe(() => {
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
], BrpPersoonInfoComponent.prototype, "save$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpPersoonInfoComponent.prototype, "disabled$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpPersoonInfoComponent.prototype, "pluginId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], BrpPersoonInfoComponent.prototype, "prefillConfiguration$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], BrpPersoonInfoComponent.prototype, "valid", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], BrpPersoonInfoComponent.prototype, "configuration", void 0);
BrpPersoonInfoComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Component)({
        selector: 'brp-persoon-info',
        template: __webpack_require__(/*! ./brp-persoon-info.component.html */ "./src/lib/components/brp-persoon-info/brp-persoon-info.component.html"),
        styles: [__webpack_require__(/*! ./brp-persoon-info.component.scss */ "./src/lib/components/brp-persoon-info/brp-persoon-info.component.scss")],
    })
], BrpPersoonInfoComponent);



/***/ }),

/***/ "./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SuwinetPluginConfigurationComponent: () => (/* binding */ SuwinetPluginConfigurationComponent)
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



let SuwinetPluginConfigurationComponent = class SuwinetPluginConfigurationComponent {
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
        const valid = !!(formValue.configurationTitle &&
            formValue.baseUrl);
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
], SuwinetPluginConfigurationComponent.prototype, "save$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], SuwinetPluginConfigurationComponent.prototype, "disabled$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], SuwinetPluginConfigurationComponent.prototype, "pluginId", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Input)()
], SuwinetPluginConfigurationComponent.prototype, "prefillConfiguration$", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], SuwinetPluginConfigurationComponent.prototype, "valid", void 0);
(0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Output)()
], SuwinetPluginConfigurationComponent.prototype, "configuration", void 0);
SuwinetPluginConfigurationComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Component)({
        selector: 'suwinet-plugin-configuration',
        template: __webpack_require__(/*! ./suwinet-plugin-configuration.component.html */ "./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.html"),
        styles: [__webpack_require__(/*! ./suwinet-plugin-configuration.component.scss */ "./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.scss")],
    })
], SuwinetPluginConfigurationComponent);



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

/***/ "./src/lib/suwinet-plugin-module.ts":
/*!******************************************!*\
  !*** ./src/lib/suwinet-plugin-module.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SuwinetPluginModule: () => (/* binding */ SuwinetPluginModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "@angular/common");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_angular_common__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _valtimo_plugin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @valtimo/plugin */ "@valtimo/plugin");
/* harmony import */ var _valtimo_plugin__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_valtimo_plugin__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "../../../node_modules/@angular/forms/fesm2022/forms.mjs");
/* harmony import */ var _valtimo_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @valtimo/components */ "@valtimo/components");
/* harmony import */ var _valtimo_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_valtimo_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_plugin_configuration_suwinet_plugin_configuration_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/plugin-configuration/suwinet-plugin-configuration.component */ "./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.ts");
/* harmony import */ var _components_brp_persoon_info_brp_persoon_info_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/brp-persoon-info/brp-persoon-info.component */ "./src/lib/components/brp-persoon-info/brp-persoon-info.component.ts");
/* harmony import */ var _components_brp_partner_info_brp_partner_info_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/brp-partner-info/brp-partner-info.component */ "./src/lib/components/brp-partner-info/brp-partner-info.component.ts");
/* harmony import */ var _components_brp_kinderen_info_brp_kinderen_info_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/brp-kinderen-info/brp-kinderen-info.component */ "./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.ts");
/* harmony import */ var _suwinet_plugin_specification__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./suwinet-plugin.specification */ "./src/lib/suwinet-plugin.specification.ts");
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











let SuwinetPluginModule = class SuwinetPluginModule {
};
SuwinetPluginModule = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgModule)({
        declarations: [
            _components_plugin_configuration_suwinet_plugin_configuration_component__WEBPACK_IMPORTED_MODULE_5__.SuwinetPluginConfigurationComponent,
            _components_brp_persoon_info_brp_persoon_info_component__WEBPACK_IMPORTED_MODULE_6__.BrpPersoonInfoComponent,
            _components_brp_partner_info_brp_partner_info_component__WEBPACK_IMPORTED_MODULE_7__.BrpPartnerInfoComponent,
            _components_brp_kinderen_info_brp_kinderen_info_component__WEBPACK_IMPORTED_MODULE_8__.BrpKinderenInfoComponent
        ],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _valtimo_plugin__WEBPACK_IMPORTED_MODULE_3__.PluginTranslatePipeModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_4__.FormModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_4__.InputModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _valtimo_plugin__WEBPACK_IMPORTED_MODULE_3__.PluginTranslatePipeModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_4__.FormModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_4__.FormModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_4__.FormModule, _valtimo_components__WEBPACK_IMPORTED_MODULE_4__.FormModule],
        exports: [
            _components_plugin_configuration_suwinet_plugin_configuration_component__WEBPACK_IMPORTED_MODULE_5__.SuwinetPluginConfigurationComponent,
            _components_brp_persoon_info_brp_persoon_info_component__WEBPACK_IMPORTED_MODULE_6__.BrpPersoonInfoComponent,
            _components_brp_partner_info_brp_partner_info_component__WEBPACK_IMPORTED_MODULE_7__.BrpPartnerInfoComponent,
            _components_brp_kinderen_info_brp_kinderen_info_component__WEBPACK_IMPORTED_MODULE_8__.BrpKinderenInfoComponent
        ],
        providers: [
            {
                provide: _valtimo_plugin__WEBPACK_IMPORTED_MODULE_3__.PLUGINS_TOKEN,
                useValue: [
                    _suwinet_plugin_specification__WEBPACK_IMPORTED_MODULE_9__.suwinetPluginSpecification,
                ]
            }
        ]
    })
], SuwinetPluginModule);



/***/ }),

/***/ "./src/lib/suwinet-plugin.specification.ts":
/*!*************************************************!*\
  !*** ./src/lib/suwinet-plugin.specification.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   suwinetPluginSpecification: () => (/* binding */ suwinetPluginSpecification)
/* harmony export */ });
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets */ "./src/lib/assets/index.ts");
/* harmony import */ var _components_plugin_configuration_suwinet_plugin_configuration_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/plugin-configuration/suwinet-plugin-configuration.component */ "./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.ts");
/* harmony import */ var _components_brp_persoon_info_brp_persoon_info_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/brp-persoon-info/brp-persoon-info.component */ "./src/lib/components/brp-persoon-info/brp-persoon-info.component.ts");
/* harmony import */ var _components_brp_partner_info_brp_partner_info_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/brp-partner-info/brp-partner-info.component */ "./src/lib/components/brp-partner-info/brp-partner-info.component.ts");
/* harmony import */ var _components_brp_kinderen_info_brp_kinderen_info_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/brp-kinderen-info/brp-kinderen-info.component */ "./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.ts");
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





const suwinetPluginSpecification = {
    pluginId: 'suwinet',
    pluginConfigurationComponent: _components_plugin_configuration_suwinet_plugin_configuration_component__WEBPACK_IMPORTED_MODULE_1__.SuwinetPluginConfigurationComponent,
    pluginLogoBase64: _assets__WEBPACK_IMPORTED_MODULE_0__.SUWINET_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'get-brp-persoonsgegevens': _components_brp_persoon_info_brp_persoon_info_component__WEBPACK_IMPORTED_MODULE_2__.BrpPersoonInfoComponent,
        'get-brp-partner-persoonsgegevens': _components_brp_partner_info_brp_partner_info_component__WEBPACK_IMPORTED_MODULE_3__.BrpPartnerInfoComponent,
        'get-brp-kinderen-persoonsgegevens': _components_brp_kinderen_info_brp_kinderen_info_component__WEBPACK_IMPORTED_MODULE_4__.BrpKinderenInfoComponent
    },
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip: 'Hier kunt je een eigen naam verzinnen. Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
            title: 'SuwiNet',
            description: 'Plugin om data uit Suwinet op te halen',
            url: 'URL',
            bsn: 'Burgerservicenummer',
            kenteken: 'Kenteken',
            bsnTooltip: 'De burgerservice nummer waarop een zoek gedaan wordt',
            pluginActionWarning: 'Fill in the required fields for this plugin action',
            resultProcessVariableName: 'Naam van de proces variabele voor het opslaan van de respons',
            resultProcessVariableNameTooltip: 'De naam van de proces variabele waar het resultaat in opgeslagen wordt. Zodoende kan deze variabele worden gebruikt in andere BPMN taken.',
            keystorePath: 'Keystore certificate path',
            keystoreSecret: 'Keystore certificate key',
            truststorePath: 'Truststore certificate path',
            truststoreSecret: 'Truststore certificate key',
            basicAuthName: 'Basic Authorization name',
            basicAuthSecret: 'Basic Authorization password',
            baseUrl: 'Base URL',
            connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
            receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
            'get-brp-persoonsgegevens': 'Ophalen BRP Persoonsgegevens',
            'get-brp-partner-persoonsgegevens': 'Ophalen BRP Partner info',
            'get-brp-kinderen-persoonsgegevens': 'Ophalen BRP Kinderen info'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip: 'Here you can enter a name for the plugin. This name will be used to recognize the plugin throughout the rest of the application',
            title: 'SuwiNet',
            description: 'This plugin makes it possible to communicate with SuwiNet.',
            url: 'URL',
            bsn: 'BSN',
            bsnTooltip: 'The burgerservicenummer for which the request should be made',
            resultProcessVariableName: 'Process variable name for storing the response',
            resultProcessVariableNameTooltip: 'The name of the process variable that the response should be saved to. This process variable can be used to access the response in another BPMN task.',
            keystorePath: 'Keystore certificate path',
            keystoreSecret: 'Keystore certificate key',
            truststorePath: 'Truststore certificate path',
            truststoreSecret: 'Truststore certificate key',
            basicAuthName: 'Basic Authorization name',
            basicAuthSecret: 'Basic Authorization password',
            baseUrl: 'Base URL',
            connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
            receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
            'get-brp-persoonsgegevens': 'Retrieve BRP Personal info',
            'get-brp-partner-persoonsgegevens': 'Retrieve BRP Partner info',
            'get-brp-kinderen-persoonsgegevens': 'Retrieve BRP children info'
        },
        de: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip: 'Here you can enter a name for the plugin. This name will be used to recognize the plugin throughout the rest of the application',
            title: 'SuwiNet',
            description: 'This plugin makes it possible to communicate with SuwiNet.',
            url: 'URL',
            bsn: 'BSN',
            bsnTooltip: 'The burgerservicenummer for which the request should be made',
            resultProcessVariableName: 'Process variable name for storing the response',
            resultProcessVariableNameTooltip: 'The name of the process variable that the response should be saved to. This process variable can be used to access the response in another BPMN task.',
            keystorePath: 'Keystore certificate path',
            keystoreSecret: 'Keystore certificate key',
            truststorePath: 'Truststore certificate path',
            truststoreSecret: 'Truststore certificate key',
            basicAuthName: 'Basic Authorization name',
            basicAuthSecret: 'Basic Authorization password',
            baseUrl: 'Base URL',
            connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
            receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
            'get-brp-persoonsgegevens': 'Retrieve BRP Personal info',
            'get-brp-partner-persoonsgegevens': 'Retrieve BRP Partner info',
            'get-brp-kinderen-persoonsgegevens': 'Retrieve BRP children info'
        },
    },
};



/***/ }),

/***/ "./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.html":
/*!*******************************************************************************!*\
  !*** ./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.html ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = "<!--\n  ~ Copyright 2015-2020 Ritense BV, the Netherlands.\n  ~\n  ~ Licensed under EUPL, Version 1.2 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~ https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" basis,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n<v-form\n    (valueChange)=\"formValueChange($event)\"\n        *ngIf=\"{\n    disabled: disabled$ | async,\n    prefill: prefillConfiguration$ ? (prefillConfiguration$ | async) : null\n  } as obs\"\n>\n    <v-input\n            name=\"kinderenBsns\"\n            [title]=\"'kinderenBsns' | pluginTranslate : pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill.bsn\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"true\"\n            [tooltip]=\"'kinderenBsnsTooltip' | pluginTranslate : pluginId | async\"\n    ></v-input>\n    <v-input\n            name=\"resultProcessVariableName\"\n            [title]=\"'resultProcessVariableName' | pluginTranslate : pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill.resultProcessVariableName\"\n            [disabled]=\"obs.disabled\"\n            [tooltip]=\"'resultProcessVariableNameTooltip' | pluginTranslate : pluginId | async\"\n            [required]=\"true\"\n    >\n    </v-input>\n</v-form>\n";

/***/ }),

/***/ "./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.scss":
/*!*******************************************************************************!*\
  !*** ./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.scss ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = "";

/***/ }),

/***/ "./src/lib/components/brp-partner-info/brp-partner-info.component.html":
/*!*****************************************************************************!*\
  !*** ./src/lib/components/brp-partner-info/brp-partner-info.component.html ***!
  \*****************************************************************************/
/***/ ((module) => {

module.exports = "<!--\n  ~ Copyright 2015-2020 Ritense BV, the Netherlands.\n  ~\n  ~ Licensed under EUPL, Version 1.2 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~ https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" basis,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n<v-form\n    (valueChange)=\"formValueChange($event)\"\n        *ngIf=\"{\n    disabled: disabled$ | async,\n    prefill: prefillConfiguration$ ? (prefillConfiguration$ | async) : null\n  } as obs\"\n>\n    <v-input\n            name=\"bsn\"\n            [title]=\"'bsn' | pluginTranslate : pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill.bsn\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"true\"\n            [tooltip]=\"'bsnTooltip' | pluginTranslate : pluginId | async\"\n    ></v-input>\n    <v-input\n            name=\"resultProcessVariableName\"\n            [title]=\"'resultProcessVariableName' | pluginTranslate : pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill.resultProcessVariableName\"\n            [disabled]=\"obs.disabled\"\n            [tooltip]=\"'resultProcessVariableNameTooltip' | pluginTranslate : pluginId | async\"\n            [required]=\"true\"\n    >\n    </v-input>\n</v-form>\n";

/***/ }),

/***/ "./src/lib/components/brp-partner-info/brp-partner-info.component.scss":
/*!*****************************************************************************!*\
  !*** ./src/lib/components/brp-partner-info/brp-partner-info.component.scss ***!
  \*****************************************************************************/
/***/ ((module) => {

module.exports = "";

/***/ }),

/***/ "./src/lib/components/brp-persoon-info/brp-persoon-info.component.html":
/*!*****************************************************************************!*\
  !*** ./src/lib/components/brp-persoon-info/brp-persoon-info.component.html ***!
  \*****************************************************************************/
/***/ ((module) => {

module.exports = "<!--\n  ~ Copyright 2015-2020 Ritense BV, the Netherlands.\n  ~\n  ~ Licensed under EUPL, Version 1.2 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~ https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" basis,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n<v-form\n    (valueChange)=\"formValueChange($event)\"\n        *ngIf=\"{\n    disabled: disabled$ | async,\n    prefill: prefillConfiguration$ ? (prefillConfiguration$ | async) : null\n  } as obs\"\n>\n    <v-input\n            name=\"bsn\"\n            [title]=\"'bsn' | pluginTranslate : pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill.bsn\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"true\"\n            [tooltip]=\"'bsnTooltip' | pluginTranslate : pluginId | async\"\n    ></v-input>\n    <v-input\n            name=\"resultProcessVariableName\"\n            [title]=\"'resultProcessVariableName' | pluginTranslate : pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill.resultProcessVariableName\"\n            [disabled]=\"obs.disabled\"\n            [tooltip]=\"'resultProcessVariableNameTooltip' | pluginTranslate : pluginId | async\"\n            [required]=\"true\"\n    >\n    </v-input>\n</v-form>\n";

/***/ }),

/***/ "./src/lib/components/brp-persoon-info/brp-persoon-info.component.scss":
/*!*****************************************************************************!*\
  !*** ./src/lib/components/brp-persoon-info/brp-persoon-info.component.scss ***!
  \*****************************************************************************/
/***/ ((module) => {

module.exports = "";

/***/ }),

/***/ "./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.html ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = "<!--\n  ~ Copyright 2015-2024. Ritense BV, the Netherlands.\n  ~\n  ~ Licensed under EUPL, Version 1.2 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~ https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" basis,\n  ~\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n  ~ express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  ~\n  -->\n\n<v-form\n        (valueChange)=\"formValueChange($event)\"\n        *ngIf=\"{\n        disabled: disabled$ | async,\n        prefill: prefillConfiguration$ ? (prefillConfiguration$ | async) : null\n    } as obs\"\n>\n    <v-input\n            name=\"configurationTitle\"\n            [title]=\"'configurationTitle' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.configurationTitle\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"true\"\n    >\n    </v-input>\n    <v-input\n            name=\"baseUrl\"\n            [title]=\"'baseUrl' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.baseUrl\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"true\"\n    >\n    </v-input>\n    <v-input\n            name=\"keystorePath\"\n            [title]=\"'keystorePath' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.keystorePath\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"false\"\n    >\n    </v-input>\n    <v-input\n            name=\"keystoreSecret\"\n            type=\"password\"\n            [title]=\"'keystoreSecret' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.keystoreSecret\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"false\"\n    >\n    </v-input>\n    <v-input\n            name=\"truststorePath\"\n            [title]=\"'truststorePath' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.truststorePath\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"false\"\n    >\n    </v-input>\n    <v-input\n            name=\"truststoreSecret\"\n            type=\"password\"\n            [title]=\"'truststoreSecret' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.truststoreSecret\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"false\"\n    >\n    </v-input>\n    <v-input\n            name=\"basicAuthName\"\n            [title]=\"'basicAuthName' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.basicAuthName\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"false\"\n    >\n    </v-input>\n    <v-input\n            name=\"basicAuthSecret\"\n            type=\"password\"\n            [title]=\"'basicAuthSecret' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.truststoreSecret\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"false\"\n    >\n    </v-input>\n    <v-input\n            name=\"connectionTimeout\"\n            type=\"number\"\n            [title]=\"'connectionTimeout' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.connectionTimeout\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"false\"\n    >\n    </v-input>\n    <v-input\n            name=\"receiveTimeout\"\n            type=\"number\"\n            [title]=\"'receiveTimeout' | pluginTranslate: pluginId | async\"\n            [margin]=\"true\"\n            [fullWidth]=\"true\"\n            [defaultValue]=\"obs.prefill?.receiveTimeout\"\n            [disabled]=\"obs.disabled\"\n            [required]=\"false\"\n    >\n    </v-input>\n</v-form>\n";

/***/ }),

/***/ "./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.scss":
/*!*********************************************************************************************!*\
  !*** ./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.scss ***!
  \*********************************************************************************************/
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
/* harmony export */   BrpKinderenInfoComponent: () => (/* reexport safe */ _lib_components_brp_kinderen_info_brp_kinderen_info_component__WEBPACK_IMPORTED_MODULE_4__.BrpKinderenInfoComponent),
/* harmony export */   BrpPartnerInfoComponent: () => (/* reexport safe */ _lib_components_brp_partner_info_brp_partner_info_component__WEBPACK_IMPORTED_MODULE_5__.BrpPartnerInfoComponent),
/* harmony export */   BrpPersoonInfoComponent: () => (/* reexport safe */ _lib_components_brp_persoon_info_brp_persoon_info_component__WEBPACK_IMPORTED_MODULE_6__.BrpPersoonInfoComponent),
/* harmony export */   SuwinetPluginConfigurationComponent: () => (/* reexport safe */ _lib_components_plugin_configuration_suwinet_plugin_configuration_component__WEBPACK_IMPORTED_MODULE_3__.SuwinetPluginConfigurationComponent),
/* harmony export */   SuwinetPluginModule: () => (/* reexport safe */ _lib_suwinet_plugin_module__WEBPACK_IMPORTED_MODULE_1__.SuwinetPluginModule),
/* harmony export */   suwinetPluginSpecification: () => (/* reexport safe */ _lib_suwinet_plugin_specification__WEBPACK_IMPORTED_MODULE_2__.suwinetPluginSpecification)
/* harmony export */ });
/* harmony import */ var _lib_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/models */ "./src/lib/models/index.ts");
/* harmony import */ var _lib_suwinet_plugin_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/suwinet-plugin-module */ "./src/lib/suwinet-plugin-module.ts");
/* harmony import */ var _lib_suwinet_plugin_specification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/suwinet-plugin.specification */ "./src/lib/suwinet-plugin.specification.ts");
/* harmony import */ var _lib_components_plugin_configuration_suwinet_plugin_configuration_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/components/plugin-configuration/suwinet-plugin-configuration.component */ "./src/lib/components/plugin-configuration/suwinet-plugin-configuration.component.ts");
/* harmony import */ var _lib_components_brp_kinderen_info_brp_kinderen_info_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/components/brp-kinderen-info/brp-kinderen-info.component */ "./src/lib/components/brp-kinderen-info/brp-kinderen-info.component.ts");
/* harmony import */ var _lib_components_brp_partner_info_brp_partner_info_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/components/brp-partner-info/brp-partner-info.component */ "./src/lib/components/brp-partner-info/brp-partner-info.component.ts");
/* harmony import */ var _lib_components_brp_persoon_info_brp_persoon_info_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/components/brp-persoon-info/brp-persoon-info.component */ "./src/lib/components/brp-persoon-info/brp-persoon-info.component.ts");
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

var __webpack_exports__BrpKinderenInfoComponent = __webpack_exports__.BrpKinderenInfoComponent;
var __webpack_exports__BrpPartnerInfoComponent = __webpack_exports__.BrpPartnerInfoComponent;
var __webpack_exports__BrpPersoonInfoComponent = __webpack_exports__.BrpPersoonInfoComponent;
var __webpack_exports__SuwinetPluginConfigurationComponent = __webpack_exports__.SuwinetPluginConfigurationComponent;
var __webpack_exports__SuwinetPluginModule = __webpack_exports__.SuwinetPluginModule;
var __webpack_exports__suwinetPluginSpecification = __webpack_exports__.suwinetPluginSpecification;
export { __webpack_exports__BrpKinderenInfoComponent as BrpKinderenInfoComponent, __webpack_exports__BrpPartnerInfoComponent as BrpPartnerInfoComponent, __webpack_exports__BrpPersoonInfoComponent as BrpPersoonInfoComponent, __webpack_exports__SuwinetPluginConfigurationComponent as SuwinetPluginConfigurationComponent, __webpack_exports__SuwinetPluginModule as SuwinetPluginModule, __webpack_exports__suwinetPluginSpecification as suwinetPluginSpecification };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxJQUFJLFlBQVk7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLElBQUksWUFBWTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxJQUFJLFVBQVU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsMkJBQTJCO0FBQzdELFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyQkFBMkI7QUFDN0QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0ZBQWtGO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGFBQWE7QUFDYixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSw2QkFBNkIsZ0JBQWdCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsYUFBYTtBQUNiLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLGdCQUFnQjtBQUN0RCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0EsYUFBYTtBQUNiLGFBQWE7QUFDYixhQUFhO0FBQ2I7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QUEyQjtBQUM3RCxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyQkFBMkI7QUFDN0QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHVEQUFZO0FBQzVDLGlDQUFpQyx1REFBWTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQix5REFBVTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsaUJBQWlCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdURBQVk7QUFDeEM7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHVEQUFZO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRDtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLGtCQUFrQjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxzREFBc0Q7VUFDdEQsc0NBQXNDLGlFQUFpRTtVQUN2RztVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7Ozs7O1VDekJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUVIOztHQUVHO0FBRTBCO0FBQ2U7QUFDTztBQUMwQztBQUNkO0FBQ0Y7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvTm90aWZpY2F0aW9uRmFjdG9yaWVzLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvU3Vic2NyaWJlci5qcyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL1N1YnNjcmlwdGlvbi5qcyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL29wZXJhdG9ycy9PcGVyYXRvclN1YnNjcmliZXIuanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0Ly4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvbWFwLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVyL3RpbWVvdXRQcm92aWRlci5qcyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvci5qcyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvYXJyUmVtb3ZlLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9jcmVhdGVFcnJvckNsYXNzLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9lcnJvckNvbnRleHQuanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0Ly4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0Ly4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2xpZnQuanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0Ly4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL25vb3AuanMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0Ly4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL3JlcG9ydFVuaGFuZGxlZEVycm9yLmpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uL3NyYy9saWIvYXNzZXRzL2luZGV4LnRzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uL3NyYy9saWIvYXNzZXRzL3N1d2luZXQtcGx1Z2luLWxvZ28udHMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0Ly4vc3JjL2xpYi9jb21wb25lbnRzL2JycC1raW5kZXJlbi1pbmZvL2JycC1raW5kZXJlbi1pbmZvLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvLi9zcmMvbGliL2NvbXBvbmVudHMvYnJwLXBhcnRuZXItaW5mby9icnAtcGFydG5lci1pbmZvLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvLi9zcmMvbGliL2NvbXBvbmVudHMvYnJwLXBlcnNvb24taW5mby9icnAtcGVyc29vbi1pbmZvLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvLi9zcmMvbGliL2NvbXBvbmVudHMvcGx1Z2luLWNvbmZpZ3VyYXRpb24vc3V3aW5ldC1wbHVnaW4tY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0Ly4vc3JjL2xpYi9tb2RlbHMvY29uZmlnLnRzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uL3NyYy9saWIvbW9kZWxzL2luZGV4LnRzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uL3NyYy9saWIvc3V3aW5ldC1wbHVnaW4tbW9kdWxlLnRzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uL3NyYy9saWIvc3V3aW5ldC1wbHVnaW4uc3BlY2lmaWNhdGlvbi50cyIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvZXh0ZXJuYWwgd2luZG93IFwiQGFuZ3VsYXIvY29tbW9uXCIiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0L2V4dGVybmFsIHdpbmRvdyBcIkBhbmd1bGFyL2NvcmVcIiIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvZXh0ZXJuYWwgd2luZG93IFwiQHZhbHRpbW8vY29tcG9uZW50c1wiIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC9leHRlcm5hbCB3aW5kb3cgXCJAdmFsdGltby9wbHVnaW5cIiIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvZXh0ZXJuYWwgd2luZG93IFwicnhqc1wiIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC9leHRlcm5hbCB3aW5kb3cgXCJ0c2xpYlwiIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvZm9ybXMvZmVzbTIwMjIvZm9ybXMubWpzIiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AdmFsdGltby1wbHVnaW5zL3N1d2luZXQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0L3dlYnBhY2svcnVudGltZS9jcmVhdGUgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0B2YWx0aW1vLXBsdWdpbnMvc3V3aW5ldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQHZhbHRpbW8tcGx1Z2lucy9zdXdpbmV0Ly4vc3JjL3B1YmxpY19hcGkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHZhciBDT01QTEVURV9OT1RJRklDQVRJT04gPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gY3JlYXRlTm90aWZpY2F0aW9uKCdDJywgdW5kZWZpbmVkLCB1bmRlZmluZWQpOyB9KSgpO1xuZXhwb3J0IGZ1bmN0aW9uIGVycm9yTm90aWZpY2F0aW9uKGVycm9yKSB7XG4gICAgcmV0dXJuIGNyZWF0ZU5vdGlmaWNhdGlvbignRScsIHVuZGVmaW5lZCwgZXJyb3IpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5leHROb3RpZmljYXRpb24odmFsdWUpIHtcbiAgICByZXR1cm4gY3JlYXRlTm90aWZpY2F0aW9uKCdOJywgdmFsdWUsIHVuZGVmaW5lZCk7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTm90aWZpY2F0aW9uKGtpbmQsIHZhbHVlLCBlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGtpbmQ6IGtpbmQsXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob3RpZmljYXRpb25GYWN0b3JpZXMuanMubWFwIiwiaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgaXNTdWJzY3JpcHRpb24sIFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IHJlcG9ydFVuaGFuZGxlZEVycm9yIH0gZnJvbSAnLi91dGlsL3JlcG9ydFVuaGFuZGxlZEVycm9yJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBuZXh0Tm90aWZpY2F0aW9uLCBlcnJvck5vdGlmaWNhdGlvbiwgQ09NUExFVEVfTk9USUZJQ0FUSU9OIH0gZnJvbSAnLi9Ob3RpZmljYXRpb25GYWN0b3JpZXMnO1xuaW1wb3J0IHsgdGltZW91dFByb3ZpZGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIvdGltZW91dFByb3ZpZGVyJztcbmltcG9ydCB7IGNhcHR1cmVFcnJvciB9IGZyb20gJy4vdXRpbC9lcnJvckNvbnRleHQnO1xudmFyIFN1YnNjcmliZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN1YnNjcmliZXIoZGVzdGluYXRpb24pIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIGlmIChkZXN0aW5hdGlvbikge1xuICAgICAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIGlmIChpc1N1YnNjcmlwdGlvbihkZXN0aW5hdGlvbikpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5hZGQoX3RoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBFTVBUWV9PQlNFUlZFUjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFN1YnNjcmliZXIuY3JlYXRlID0gZnVuY3Rpb24gKG5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFNhZmVTdWJzY3JpYmVyKG5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgaGFuZGxlU3RvcHBlZE5vdGlmaWNhdGlvbihuZXh0Tm90aWZpY2F0aW9uKHZhbHVlKSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgaGFuZGxlU3RvcHBlZE5vdGlmaWNhdGlvbihlcnJvck5vdGlmaWNhdGlvbihlcnIpLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24oQ09NUExFVEVfTk9USUZJQ0FUSU9OLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuX25leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLl9lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuX2NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU3Vic2NyaWJlcjtcbn0oU3Vic2NyaXB0aW9uKSk7XG5leHBvcnQgeyBTdWJzY3JpYmVyIH07XG52YXIgX2JpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZDtcbmZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gX2JpbmQuY2FsbChmbiwgdGhpc0FyZyk7XG59XG52YXIgQ29uc3VtZXJPYnNlcnZlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uc3VtZXJPYnNlcnZlcihwYXJ0aWFsT2JzZXJ2ZXIpIHtcbiAgICAgICAgdGhpcy5wYXJ0aWFsT2JzZXJ2ZXIgPSBwYXJ0aWFsT2JzZXJ2ZXI7XG4gICAgfVxuICAgIENvbnN1bWVyT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHBhcnRpYWxPYnNlcnZlciA9IHRoaXMucGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAocGFydGlhbE9ic2VydmVyLm5leHQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGFydGlhbE9ic2VydmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBDb25zdW1lck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIHBhcnRpYWxPYnNlcnZlciA9IHRoaXMucGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAocGFydGlhbE9ic2VydmVyLmVycm9yKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhcnRpYWxPYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29uc3VtZXJPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXJ0aWFsT2JzZXJ2ZXIgPSB0aGlzLnBhcnRpYWxPYnNlcnZlcjtcbiAgICAgICAgaWYgKHBhcnRpYWxPYnNlcnZlci5jb21wbGV0ZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGhhbmRsZVVuaGFuZGxlZEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIENvbnN1bWVyT2JzZXJ2ZXI7XG59KCkpO1xudmFyIFNhZmVTdWJzY3JpYmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2FmZVN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2FmZVN1YnNjcmliZXIob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICB2YXIgcGFydGlhbE9ic2VydmVyO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkgfHwgIW9ic2VydmVyT3JOZXh0KSB7XG4gICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIgPSB7XG4gICAgICAgICAgICAgICAgbmV4dDogKG9ic2VydmVyT3JOZXh0ICE9PSBudWxsICYmIG9ic2VydmVyT3JOZXh0ICE9PSB2b2lkIDAgPyBvYnNlcnZlck9yTmV4dCA6IHVuZGVmaW5lZCksXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yICE9PSBudWxsICYmIGVycm9yICE9PSB2b2lkIDAgPyBlcnJvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGUgIT09IG51bGwgJiYgY29tcGxldGUgIT09IHZvaWQgMCA/IGNvbXBsZXRlIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjb250ZXh0XzE7XG4gICAgICAgICAgICBpZiAoX3RoaXMgJiYgY29uZmlnLnVzZURlcHJlY2F0ZWROZXh0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfMSA9IE9iamVjdC5jcmVhdGUob2JzZXJ2ZXJPck5leHQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfMS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnVuc3Vic2NyaWJlKCk7IH07XG4gICAgICAgICAgICAgICAgcGFydGlhbE9ic2VydmVyID0ge1xuICAgICAgICAgICAgICAgICAgICBuZXh0OiBvYnNlcnZlck9yTmV4dC5uZXh0ICYmIGJpbmQob2JzZXJ2ZXJPck5leHQubmV4dCwgY29udGV4dF8xKSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG9ic2VydmVyT3JOZXh0LmVycm9yICYmIGJpbmQob2JzZXJ2ZXJPck5leHQuZXJyb3IsIGNvbnRleHRfMSksXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBvYnNlcnZlck9yTmV4dC5jb21wbGV0ZSAmJiBiaW5kKG9ic2VydmVyT3JOZXh0LmNvbXBsZXRlLCBjb250ZXh0XzEpLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsT2JzZXJ2ZXIgPSBvYnNlcnZlck9yTmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBDb25zdW1lck9ic2VydmVyKHBhcnRpYWxPYnNlcnZlcik7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFNhZmVTdWJzY3JpYmVyO1xufShTdWJzY3JpYmVyKSk7XG5leHBvcnQgeyBTYWZlU3Vic2NyaWJlciB9O1xuZnVuY3Rpb24gaGFuZGxlVW5oYW5kbGVkRXJyb3IoZXJyb3IpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgY2FwdHVyZUVycm9yKGVycm9yKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlcG9ydFVuaGFuZGxlZEVycm9yKGVycm9yKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZWZhdWx0RXJyb3JIYW5kbGVyKGVycikge1xuICAgIHRocm93IGVycjtcbn1cbmZ1bmN0aW9uIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24obm90aWZpY2F0aW9uLCBzdWJzY3JpYmVyKSB7XG4gICAgdmFyIG9uU3RvcHBlZE5vdGlmaWNhdGlvbiA9IGNvbmZpZy5vblN0b3BwZWROb3RpZmljYXRpb247XG4gICAgb25TdG9wcGVkTm90aWZpY2F0aW9uICYmIHRpbWVvdXRQcm92aWRlci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIG9uU3RvcHBlZE5vdGlmaWNhdGlvbihub3RpZmljYXRpb24sIHN1YnNjcmliZXIpOyB9KTtcbn1cbmV4cG9ydCB2YXIgRU1QVFlfT0JTRVJWRVIgPSB7XG4gICAgY2xvc2VkOiB0cnVlLFxuICAgIG5leHQ6IG5vb3AsXG4gICAgZXJyb3I6IGRlZmF1bHRFcnJvckhhbmRsZXIsXG4gICAgY29tcGxldGU6IG5vb3AsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3Vic2NyaWJlci5qcy5tYXAiLCJpbXBvcnQgeyBfX3JlYWQsIF9fc3ByZWFkQXJyYXksIF9fdmFsdWVzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgVW5zdWJzY3JpcHRpb25FcnJvciB9IGZyb20gJy4vdXRpbC9VbnN1YnNjcmlwdGlvbkVycm9yJztcbmltcG9ydCB7IGFyclJlbW92ZSB9IGZyb20gJy4vdXRpbC9hcnJSZW1vdmUnO1xudmFyIFN1YnNjcmlwdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3Vic2NyaXB0aW9uKGluaXRpYWxUZWFyZG93bikge1xuICAgICAgICB0aGlzLmluaXRpYWxUZWFyZG93biA9IGluaXRpYWxUZWFyZG93bjtcbiAgICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGFyZW50YWdlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZmluYWxpemVycyA9IG51bGw7XG4gICAgfVxuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlXzEsIF9hLCBlXzIsIF9iO1xuICAgICAgICB2YXIgZXJyb3JzO1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICB2YXIgX3BhcmVudGFnZSA9IHRoaXMuX3BhcmVudGFnZTtcbiAgICAgICAgICAgIGlmIChfcGFyZW50YWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50YWdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfcGFyZW50YWdlKSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX3BhcmVudGFnZV8xID0gX192YWx1ZXMoX3BhcmVudGFnZSksIF9wYXJlbnRhZ2VfMV8xID0gX3BhcmVudGFnZV8xLm5leHQoKTsgIV9wYXJlbnRhZ2VfMV8xLmRvbmU7IF9wYXJlbnRhZ2VfMV8xID0gX3BhcmVudGFnZV8xLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRfMSA9IF9wYXJlbnRhZ2VfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF8xLnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9wYXJlbnRhZ2VfMV8xICYmICFfcGFyZW50YWdlXzFfMS5kb25lICYmIChfYSA9IF9wYXJlbnRhZ2VfMS5yZXR1cm4pKSBfYS5jYWxsKF9wYXJlbnRhZ2VfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF9wYXJlbnRhZ2UucmVtb3ZlKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpbml0aWFsRmluYWxpemVyID0gdGhpcy5pbml0aWFsVGVhcmRvd247XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihpbml0aWFsRmluYWxpemVyKSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxGaW5hbGl6ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gZSBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IgPyBlLmVycm9ycyA6IFtlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgX2ZpbmFsaXplcnMgPSB0aGlzLl9maW5hbGl6ZXJzO1xuICAgICAgICAgICAgaWYgKF9maW5hbGl6ZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmluYWxpemVycyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2ZpbmFsaXplcnNfMSA9IF9fdmFsdWVzKF9maW5hbGl6ZXJzKSwgX2ZpbmFsaXplcnNfMV8xID0gX2ZpbmFsaXplcnNfMS5uZXh0KCk7ICFfZmluYWxpemVyc18xXzEuZG9uZTsgX2ZpbmFsaXplcnNfMV8xID0gX2ZpbmFsaXplcnNfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaW5hbGl6ZXIgPSBfZmluYWxpemVyc18xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWNGaW5hbGl6ZXIoZmluYWxpemVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMgIT09IG51bGwgJiYgZXJyb3JzICE9PSB2b2lkIDAgPyBlcnJvcnMgOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChlcnJvcnMpKSwgX19yZWFkKGVyci5lcnJvcnMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlXzJfMSkgeyBlXzIgPSB7IGVycm9yOiBlXzJfMSB9OyB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2ZpbmFsaXplcnNfMV8xICYmICFfZmluYWxpemVyc18xXzEuZG9uZSAmJiAoX2IgPSBfZmluYWxpemVyc18xLnJldHVybikpIF9iLmNhbGwoX2ZpbmFsaXplcnNfMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVW5zdWJzY3JpcHRpb25FcnJvcihlcnJvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpcHRpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0ZWFyZG93bikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0ZWFyZG93biAmJiB0ZWFyZG93biAhPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgZXhlY0ZpbmFsaXplcih0ZWFyZG93bik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGVhcmRvd24gaW5zdGFuY2VvZiBTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlYXJkb3duLmNsb3NlZCB8fCB0ZWFyZG93bi5faGFzUGFyZW50KHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGVhcmRvd24uX2FkZFBhcmVudCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKHRoaXMuX2ZpbmFsaXplcnMgPSAoX2EgPSB0aGlzLl9maW5hbGl6ZXJzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXSkucHVzaCh0ZWFyZG93bik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUuX2hhc1BhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF9wYXJlbnRhZ2UgPSB0aGlzLl9wYXJlbnRhZ2U7XG4gICAgICAgIHJldHVybiBfcGFyZW50YWdlID09PSBwYXJlbnQgfHwgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkgJiYgX3BhcmVudGFnZS5pbmNsdWRlcyhwYXJlbnQpKTtcbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUuX2FkZFBhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF9wYXJlbnRhZ2UgPSB0aGlzLl9wYXJlbnRhZ2U7XG4gICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkgPyAoX3BhcmVudGFnZS5wdXNoKHBhcmVudCksIF9wYXJlbnRhZ2UpIDogX3BhcmVudGFnZSA/IFtfcGFyZW50YWdlLCBwYXJlbnRdIDogcGFyZW50O1xuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5fcmVtb3ZlUGFyZW50ID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3BhcmVudGFnZSA9IHRoaXMuX3BhcmVudGFnZTtcbiAgICAgICAgaWYgKF9wYXJlbnRhZ2UgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50YWdlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KF9wYXJlbnRhZ2UpKSB7XG4gICAgICAgICAgICBhcnJSZW1vdmUoX3BhcmVudGFnZSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAodGVhcmRvd24pIHtcbiAgICAgICAgdmFyIF9maW5hbGl6ZXJzID0gdGhpcy5fZmluYWxpemVycztcbiAgICAgICAgX2ZpbmFsaXplcnMgJiYgYXJyUmVtb3ZlKF9maW5hbGl6ZXJzLCB0ZWFyZG93bik7XG4gICAgICAgIGlmICh0ZWFyZG93biBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGVhcmRvd24uX3JlbW92ZVBhcmVudCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLkVNUFRZID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVtcHR5ID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgICBlbXB0eS5jbG9zZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgfSkoKTtcbiAgICByZXR1cm4gU3Vic2NyaXB0aW9uO1xufSgpKTtcbmV4cG9ydCB7IFN1YnNjcmlwdGlvbiB9O1xuZXhwb3J0IHZhciBFTVBUWV9TVUJTQ1JJUFRJT04gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5leHBvcnQgZnVuY3Rpb24gaXNTdWJzY3JpcHRpb24odmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uIHx8XG4gICAgICAgICh2YWx1ZSAmJiAnY2xvc2VkJyBpbiB2YWx1ZSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnJlbW92ZSkgJiYgaXNGdW5jdGlvbih2YWx1ZS5hZGQpICYmIGlzRnVuY3Rpb24odmFsdWUudW5zdWJzY3JpYmUpKSk7XG59XG5mdW5jdGlvbiBleGVjRmluYWxpemVyKGZpbmFsaXplcikge1xuICAgIGlmIChpc0Z1bmN0aW9uKGZpbmFsaXplcikpIHtcbiAgICAgICAgZmluYWxpemVyKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaW5hbGl6ZXIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdWJzY3JpcHRpb24uanMubWFwIiwiZXhwb3J0IHZhciBjb25maWcgPSB7XG4gICAgb25VbmhhbmRsZWRFcnJvcjogbnVsbCxcbiAgICBvblN0b3BwZWROb3RpZmljYXRpb246IG51bGwsXG4gICAgUHJvbWlzZTogdW5kZWZpbmVkLFxuICAgIHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmc6IGZhbHNlLFxuICAgIHVzZURlcHJlY2F0ZWROZXh0Q29udGV4dDogZmFsc2UsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uZmlnLmpzLm1hcCIsImltcG9ydCB7IF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9wZXJhdG9yU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgb25OZXh0LCBvbkNvbXBsZXRlLCBvbkVycm9yLCBvbkZpbmFsaXplKSB7XG4gICAgcmV0dXJuIG5ldyBPcGVyYXRvclN1YnNjcmliZXIoZGVzdGluYXRpb24sIG9uTmV4dCwgb25Db21wbGV0ZSwgb25FcnJvciwgb25GaW5hbGl6ZSk7XG59XG52YXIgT3BlcmF0b3JTdWJzY3JpYmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoT3BlcmF0b3JTdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE9wZXJhdG9yU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgb25OZXh0LCBvbkNvbXBsZXRlLCBvbkVycm9yLCBvbkZpbmFsaXplLCBzaG91bGRVbnN1YnNjcmliZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBkZXN0aW5hdGlvbikgfHwgdGhpcztcbiAgICAgICAgX3RoaXMub25GaW5hbGl6ZSA9IG9uRmluYWxpemU7XG4gICAgICAgIF90aGlzLnNob3VsZFVuc3Vic2NyaWJlID0gc2hvdWxkVW5zdWJzY3JpYmU7XG4gICAgICAgIF90aGlzLl9uZXh0ID0gb25OZXh0XG4gICAgICAgICAgICA/IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uTmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IF9zdXBlci5wcm90b3R5cGUuX25leHQ7XG4gICAgICAgIF90aGlzLl9lcnJvciA9IG9uRXJyb3JcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogX3N1cGVyLnByb3RvdHlwZS5fZXJyb3I7XG4gICAgICAgIF90aGlzLl9jb21wbGV0ZSA9IG9uQ29tcGxldGVcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogX3N1cGVyLnByb3RvdHlwZS5fY29tcGxldGU7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgT3BlcmF0b3JTdWJzY3JpYmVyLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkVW5zdWJzY3JpYmUgfHwgdGhpcy5zaG91bGRVbnN1YnNjcmliZSgpKSB7XG4gICAgICAgICAgICB2YXIgY2xvc2VkXzEgPSB0aGlzLmNsb3NlZDtcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUudW5zdWJzY3JpYmUuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICFjbG9zZWRfMSAmJiAoKF9hID0gdGhpcy5vbkZpbmFsaXplKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBPcGVyYXRvclN1YnNjcmliZXI7XG59KFN1YnNjcmliZXIpKTtcbmV4cG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T3BlcmF0b3JTdWJzY3JpYmVyLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgY3JlYXRlT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIG1hcChwcm9qZWN0LCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoZnVuY3Rpb24gKHNvdXJjZSwgc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKGNyZWF0ZU9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwcm9qZWN0LmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4KyspKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuZXhwb3J0IHZhciB0aW1lb3V0UHJvdmlkZXIgPSB7XG4gICAgc2V0VGltZW91dDogZnVuY3Rpb24gKGhhbmRsZXIsIHRpbWVvdXQpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlbGVnYXRlID0gdGltZW91dFByb3ZpZGVyLmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUgPT09IG51bGwgfHwgZGVsZWdhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlbGVnYXRlLnNldFRpbWVvdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5zZXRUaW1lb3V0LmFwcGx5KGRlbGVnYXRlLCBfX3NwcmVhZEFycmF5KFtoYW5kbGVyLCB0aW1lb3V0XSwgX19yZWFkKGFyZ3MpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtoYW5kbGVyLCB0aW1lb3V0XSwgX19yZWFkKGFyZ3MpKSk7XG4gICAgfSxcbiAgICBjbGVhclRpbWVvdXQ6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gdGltZW91dFByb3ZpZGVyLmRlbGVnYXRlO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuY2xlYXJUaW1lb3V0KSB8fCBjbGVhclRpbWVvdXQpKGhhbmRsZSk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVvdXRQcm92aWRlci5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi9jcmVhdGVFcnJvckNsYXNzJztcbmV4cG9ydCB2YXIgVW5zdWJzY3JpcHRpb25FcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiBVbnN1YnNjcmlwdGlvbkVycm9ySW1wbChlcnJvcnMpIHtcbiAgICAgICAgX3N1cGVyKHRoaXMpO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBlcnJvcnNcbiAgICAgICAgICAgID8gZXJyb3JzLmxlbmd0aCArIFwiIGVycm9ycyBvY2N1cnJlZCBkdXJpbmcgdW5zdWJzY3JpcHRpb246XFxuXCIgKyBlcnJvcnMubWFwKGZ1bmN0aW9uIChlcnIsIGkpIHsgcmV0dXJuIGkgKyAxICsgXCIpIFwiICsgZXJyLnRvU3RyaW5nKCk7IH0pLmpvaW4oJ1xcbiAgJylcbiAgICAgICAgICAgIDogJyc7XG4gICAgICAgIHRoaXMubmFtZSA9ICdVbnN1YnNjcmlwdGlvbkVycm9yJztcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG4gICAgfTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VW5zdWJzY3JpcHRpb25FcnJvci5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gYXJyUmVtb3ZlKGFyciwgaXRlbSkge1xuICAgIGlmIChhcnIpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gICAgICAgIDAgPD0gaW5kZXggJiYgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyUmVtb3ZlLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFcnJvckNsYXNzKGNyZWF0ZUltcGwpIHtcbiAgICB2YXIgX3N1cGVyID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIEVycm9yLmNhbGwoaW5zdGFuY2UpO1xuICAgICAgICBpbnN0YW5jZS5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICAgIH07XG4gICAgdmFyIGN0b3JGdW5jID0gY3JlYXRlSW1wbChfc3VwZXIpO1xuICAgIGN0b3JGdW5jLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgICBjdG9yRnVuYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yRnVuYztcbiAgICByZXR1cm4gY3RvckZ1bmM7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGVFcnJvckNsYXNzLmpzLm1hcCIsImltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG52YXIgY29udGV4dCA9IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gZXJyb3JDb250ZXh0KGNiKSB7XG4gICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHZhciBpc1Jvb3QgPSAhY29udGV4dDtcbiAgICAgICAgaWYgKGlzUm9vdCkge1xuICAgICAgICAgICAgY29udGV4dCA9IHsgZXJyb3JUaHJvd246IGZhbHNlLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG4gICAgICAgIGNiKCk7XG4gICAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IGNvbnRleHQsIGVycm9yVGhyb3duID0gX2EuZXJyb3JUaHJvd24sIGVycm9yID0gX2EuZXJyb3I7XG4gICAgICAgICAgICBjb250ZXh0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjYigpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlRXJyb3IoZXJyKSB7XG4gICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nICYmIGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dC5lcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIGNvbnRleHQuZXJyb3IgPSBlcnI7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3JDb250ZXh0LmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzRnVuY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gaGFzTGlmdChzb3VyY2UpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihzb3VyY2UgPT09IG51bGwgfHwgc291cmNlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzb3VyY2UubGlmdCk7XG59XG5leHBvcnQgZnVuY3Rpb24gb3BlcmF0ZShpbml0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgaWYgKGhhc0xpZnQoc291cmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KGZ1bmN0aW9uIChsaWZ0ZWRTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5pdChsaWZ0ZWRTb3VyY2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmFibGUgdG8gbGlmdCB1bmtub3duIE9ic2VydmFibGUgdHlwZScpO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1saWZ0LmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBub29wKCkgeyB9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub29wLmpzLm1hcCIsImltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyB0aW1lb3V0UHJvdmlkZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvdGltZW91dFByb3ZpZGVyJztcbmV4cG9ydCBmdW5jdGlvbiByZXBvcnRVbmhhbmRsZWRFcnJvcihlcnIpIHtcbiAgICB0aW1lb3V0UHJvdmlkZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvblVuaGFuZGxlZEVycm9yID0gY29uZmlnLm9uVW5oYW5kbGVkRXJyb3I7XG4gICAgICAgIGlmIChvblVuaGFuZGxlZEVycm9yKSB7XG4gICAgICAgICAgICBvblVuaGFuZGxlZEVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlcG9ydFVuaGFuZGxlZEVycm9yLmpzLm1hcCIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNS0yMDI0LiBSaXRlbnNlIEJWLCB0aGUgTmV0aGVybGFuZHMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgRVVQTCwgVmVyc2lvbiAxLjIgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwczovL2pvaW51cC5lYy5ldXJvcGEuZXUvY29sbGVjdGlvbi9ldXBsL2V1cGwtdGV4dC1ldXBsLTEyXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuICpcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL3N1d2luZXQtcGx1Z2luLWxvZ28nO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1LTIwMjQuIFJpdGVuc2UgQlYsIHRoZSBOZXRoZXJsYW5kcy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciBFVVBMLCBWZXJzaW9uIDEuMiAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHBzOi8vam9pbnVwLmVjLmV1cm9wYS5ldS9jb2xsZWN0aW9uL2V1cGwvZXVwbC10ZXh0LWV1cGwtMTJcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG4gKlxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmNvbnN0IFNVV0lORVRfUExVR0lOX0xPR09fQkFTRTY0ID1cbiAgICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEOEFBQUE4Q0FZQUFBRFJ5Mkp4QUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBaEdWWVNXWk5UUUFxQUFBQUNBQUZBUklBQXdBQUFBRUFBUUFBQVJvQUJRQUFBQUVBQUFCS0FSc0FCUUFBQUFFQUFBQlNBU2dBQXdBQUFBRUFBZ0FBaDJrQUJBQUFBQUVBQUFCYUFBQUFBQUFBQVN3QUFBQUJBQUFCTEFBQUFBRUFBNkFCQUFNQUFBQUJBQUVBQUtBQ0FBUUFBQUFCQUFBQVA2QURBQVFBQUFBQkFBQUFQQUFBQUFCTm5LL3dBQUFBQ1hCSVdYTUFBQzRqQUFBdUl3RjRwVDkyQUFBQldXbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVdFMVFJRU52Y21VZ05pNHdMakFpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenAwYVdabVBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM1JwWm1Zdk1TNHdMeUkrQ2lBZ0lDQWdJQ0FnSUR4MGFXWm1Pazl5YVdWdWRHRjBhVzl1UGpFOEwzUnBabVk2VDNKcFpXNTBZWFJwYjI0K0NpQWdJQ0FnSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGdvZ0lDQThMM0prWmpwU1JFWStDand2ZURwNGJYQnRaWFJoUGdvWlh1RUhBQUFXN0VsRVFWUm8zcldiZTNCZDEzWGVmMnZ2Yys0REY1Y0VRSUFrQ0pJZ0tVcVVSTDBveVBLclNxQTJpbU83c1pQWWRDZDFQYWxubktZWk4zR2JUT3gwT3Ftb3FWdW5tZFpKMmpTWmFKdzBUVHA1TVhHc05yYWxLTGJwMkZZclM1UXJXWlFvdmttQklBbUNlRjBBOTU1N3p0NnJmK3h6THk1QWdJUTgxcGs1QTl6SE9XZXZ2ZGIrMXJlK3RhK3c0bEFRUURpSXJQeU13NmlBaHE5OWZ3OEZBd2lNeWxGcXk1NDlRbFVaaGFPMThQN0kwYU5ld045c0hQb05laEUySXd6aDJPa3pkaVBzRk9WV0RFWldHaTdyTUV4SFI2UHAyb1hLUXFIWmJkSzRtOWgza1VWbFk3S2l3VVRPcUJWVk1TSmVNWm5QTkRWV0UvSFNNRWk5cVZLdlNyeTQyRFBkMlBLeEt3MzVFTzU3bWpDbHlnUUR6REJFd2s1U2R1SFloV09ZakNFOG0zMHFmY1phUTlGRDBVTUtWSUJKbnJ2T3UvcnV2Y1dyazFtdmoyMi91bXhBUkRZYmtRRlY2VmUwVDVVZUk5S05hcGNYU3FJVUZDa0tHbm1JUmFXQWFCR2hoR2dab1J4Yk1RVWpSRVl3Z0ZkSVVxWGVVRStER1daa1VpL0tKT2cxUmFhQmFVVm1CWjB6NklJZ2k0cTYrR2ZTd1hobnVqdXF1bUZpdHdQTFZoSHRLMFVtTWtiQUM2VGhkSm1TS25qalVhdGVtK0lyOTA0cVNpb1Z1bnlkejBtbnQ2KzhiYzh2QUpzRm5YZWV4QmlwcVdkV2pac3huaGt2T3V0OVhPdGVUQllXU3I0eHptQTY4dnpSYk1YOEdZNGcvUForTTNaNDFpNVFpYnFSQWhUS0diNmFrZllWOFZ2c2dOdGhEdmc5WnJQZVpudmNIYVVLdzBVVmFBcVNDZXBBWGZnYm9sS3hFV0RCaVpJQm1TaVo5VkJVYjhyZTIyNm50dW93MVV4c1YxTk1LUk1UTzZTa3N2QnluNVIyem1HN3NwUnVZdWI1Vk5ReGFFSFZMRjdSUTd2UG5XdXNML0RHV1FVWjh1RWVDNE0rU3cremJNSXpTTVoyUER0UmRnTGJVUWFCZnBRZWxMU05KcnEwRGxVUjZYaUpnQlVvZ01FZ0NBSVlRbENGSTBjRDlmbG84bnY2SkZaYnlRd3BZSGd0UWtFZkk1SkRaS1lrYnVEdGJOU3pKRHcrRXZFelIxME9MS3V2dVVNWS9oNjl3SlpNMkM0d0xNSXVZSmZBVG1DYm5tV3pXT21tQkVUNTZRbmhpVUlXQnFpZFR4RmRDWWJMWHJSZlo3blBWbnlwUFZzb3FvSklnRk8vRUNzRGRhdUxna1I2SnBKd2JRYVFmZDBrVnlnV2Iva1RGSTZtQVBvOEcxbGdjK1laaW9RZEVJeERHUWFHRkxhZzlFYmwzTERjSmx4K1pvQlRkQjZQNUQ0UjhIVWpwdWdGd1NpSXlQZUFlRUxyZHF0RjRMS1prMGh4dFVpSlFSTW14VEFXNmRmb1RtYUtXNHIzSnBXWi85WVlxZDR5L2FDT01LWHpzaCtqZzh5eFJZVytxRUJFVEVoSW1uc3ZBOGtJNjdQZUdXRHRvUWlhaDJZSXo2amxHWFVXZFlyRWZxV2ozNVJEWWs5em9nZ1JDTHd1RHpFZEtUd1RWNXQzY3cycSt4ZXhzVUFYU0N1TFppQU9ORUZKMmdhMjVscG81MmZzMnQ2NTNoUHFERDYxUkFVZlFsN2VKS1B6U0RTeHg4OWF6WkhoTkVDRTBqUVZvRWt6OFJwbEZ5Ty9ZUStxZFFTRHFMWkRzdTI1TnE1b0Y2aFpNOTVFRWtTeTFTZEV3ZGRqcUtiZ3BHTk9EZDUzb1FoR0VrU2FLM0o3aE5keUh1b09JNHZyWWxBU08zVGVCbmdRUFFFUWllRVZEQ000eEJTODhmUFdkQWJ1amRhaWpSZHY3REVIem5WaHBINDlHUk53OHpGc1hwNGxSVHkyT0IvdTY4Qm5GaEdYRzE3RW1BUVQxNWJBTHpYY0FKUGJDQ25XNCtzSUthamhlTXZ6cDF2cldDS1BYekEzdmxmdU5xOFJyNTc3UVpLc2dEVStJR3JyVXhYaUtHT285endicTZmUVREcVFNTCtMVWZ4QzFJSEtGbU1jODQxaFhuNzlIcHkzN09pL3hNNytaL0hPb2hTd1VaM2F3aDYrZStJdUJLRllTTGh2K0Vta001eldHclZWdENtR3VtQWpQUm1NTjV6TWpSV3M0aGRieVUzWG9KUUdJdzRrNDlDVDkvQ1hmMU9GTFI2TzJlV3A2bDVIeitZSCtKUDNudUZIN2oyTWV0dVJnQUhyOFl2NVJBdWdGb3lqMXVqajdiOTFEN3dVODhWZkw3Sno2N080ZENOeE5FV1d4aHo2WCsvaHMzL1JCNUZ5OURQUFlTejRySWhJY3VQUU42ckdpL0VOczJCMnVQUEJlTXNad25WV3JGZE5STm9BcEdzRGtRRERHekxZN2ZqSCt4WjU2Q2RteWJ4Z1JabHR4RHorY2c5bkZ3M3YvdFhiZWY3ZnY1dVJXNytNU3lvWXN4QnVheFdmbU9YNUhURGl1WDE3eW5FRHBVSVd3TW9rSVBEWnB6N0taLy9QUnRpYjhlekhYdVQrMjU3RU5icHV2dTRWUk5RWGpGaWZtWEZ6aDdzU2pFOFpVMlZCQ2xRUTljRjRRYXpldE1UeEFPY3RCeDZlNTUrLzYvZmIzQTRENzduN0VlNzl3eEVZOUh6ejVIWkc5aExXcmtwTzJ4UnRDcXM5NjNRcVVCZWNEek52b3dYKzRPcy94YWVlR2dBRFR4dzh3NE8zZnhGWDc4YVkrZlZXalJwSFFHYlBpS1JlRDJJTm01bEF1VUlFSWlncFlZRHI1UmdST0c4Z0E1ZHR3S1ZWY0xCLys5UDh3MDFOV0JTOHJpaVlReGlpYVY2TXJEaUsrYzFWQTQvOXduTS95VWNQYndjTGo3OS9uUGU5NVUveFNSRXhpMitBREtFUmdqYk5DWUNqdlJnaisya2lYTWpabWE0MW9CdTUzNWhBSDQzTVlVd05GTDd4Mm8vejErZEtNQ084WTIrb0FaU29nM0lwdU56enNzcFlHOEtHY29NWGovOHdQLzY1VzZCYmVmUUhwdmpwMGYrZTg5RVdZVnlmMndYUURQeGk4WGpyN2NDNGtOTllIVVZSTWxDOWNZcHJIYWtYMk9aNDZ0UUdydnp4djhCNXdRaE1MRnIrNTVreWR3NmsvTjVQdjhoYjkzMFIxeXhoWkdGNUhEWmwxU2lyWlFMYk03NzA4bmErY0twSzcvYU02UVZETGJINU16UXdyL1hUWUZVdnRqRVBacUp3QXFDMkRZMENXZUdrRWNCTG5wYldMU1pBcEx4UXMzeGx2TnBCQUlDNjRiV3k0Y2hyMjdsbDh6ME05THgwSFNwcnRrWlNVYWdVbFg5M3RDZmN5OEZ0R3gyZmZiS1hkKy8vQ1g3b3dGL2lHaFdzcWEzYmVFSE00aVN1NjJ1VkN3Q2p4M0xqMWNzcFBLakt1aU1KSUxZS2x5My84cDFUZk9LUkowbXpDaUtLb0Z5NHRwTlAvZSs3K2RmL2VTdW5yejNNNzN6NE9KRko4QnFJRENxb2t6V3pTZG5BZ29GYnlvNi8rdkJSUHZQVVBad1lpUGlWdjkzRFcyL1pUYlhyTE40VnJtT0FhOU5KUWV2aWZTUEtsaWdWNERGbmFJQjZzV1J2c0tocUNsMnhaMlAxSFAwYmpyR3ArZ3A5M2E5eTM3Nm4rT1REWitDQmxNKzlYT0gweERzZ0NpeE5XbUNXcnAxSEYzT3U4Zm1mL0E1Mzcvc0svK3dkNXlDRC8zdWh3Qk12UEFRV1ZPUDFEOVFaZkNMYTZFMDB5Skc1OFhGYUhNTXpaMVZFczFhTnVNN0RCRmtLRDk0VlVTODR0d0U4YkNnM29CbHV0cENVODluS3laQVRORjJkUjFRaVpmRlN4T2QvOUFMMzdIMGFOOWZERDl6K1YzeDhwQVlGNVNOZjJjYjQxUWV3OFFKZVN6ZkR1bnlKR2Fpcmk4c3JQQy92bVo5RXVCUmhFSThYMFhYcHM5cXg5dFZENWt0a3JndFB5cldwTy9uejUvZEFyd2VCM3NwY2ZrRVdrTitaa09wRUEzWXNuMC93ME5QVkNKT3FFU2FHajQrK0hPNHhiL21qWjBaZ1BjVmdpNmlsRmxtVXpGZXpET0RnZmpUU1A4ZktoM0JZenFGbUgxNDhza1o1dWxyWUQyZDg5ZXdHenY3UnorTlUyc1R3eWZFU1kvTVdYcmY4cS9kTU05ei9MVFFqckZFQlRTMjR3UEZYSGxzanBWWlVmRjR4R21uZ215WHUyUEZWZnUwSDkvTEpyL2Z6eTgvMDhiNEREM1BIOE5kd2padVRIVTBOV2lQTDRpUmJTblY3TUlERGNJck12Z3RMdTBpNUdkS2ZuNDNoNVlpL21UZHd1V3RKNkRBYStINS94cWMvT01YSC84RlhNWVlBVUFUamZkT0NCekhMRWRhcjRlU2xDRjZNU1RMYlZtdGFJL3JJTzU3ams5LzhFWGcxNXBlZU9NQmZmT3dsU3ZFMXZJOVdMNTliL2s4czFHaHVIZTVPbHVYNUFOMmNwR0dRb29iQnJ5a08rSHdnRWIveXJtUDgwdC9QcTdvVjN5bkhUZm8zVExLNTU4VUF0aTFrMWhEcVByRmhzbG9UUnBianhDUXZmT0lvVGczYmVpYkNLc2wxQVovRmJPMzVEaWQrdnNwOG93dW5RcEwyVW9xdjNiU1BvZzBEU01LR1JnckFJWWlvdFcwNTVlWU0wcVZHREtwK3JlV2srYnJNdUcvUFUydFhraTNGTkkxUkRJWWtJTHdLb3FHY2xhTG02MThROFhodnFCUmY1OERlMTl2c01kVHpXVDZwS2Q1SDNEcjBkMHVMUFFQdlRWNDMzQUFFR2diUU90dkhtZ0NQQVJGWDg2RnY0TnpjcEVHNjFlYThVYTVETnVuNGE4RDdJa2hMRE9nVUVzTnJ4R1BpdEpOcmhOUlFnUFJ5QVhmWklnYWtvS2dEMFRBQm1wVERKRWtUb1JrbXJVTWhjVWtaeFFRZHpkUURiNUExSkxPYzF3ZmpaYUhWSFhvVU5PS1YzTFNkakdjVDlscGhvMjVDOGtYV3FkS3hKRnhxWnRETTROTkFVWDB6UXBzMi9KK2FvSzdrVFlkV21DTWdzU0pXY1RNUnlVc0Z0QTd6Myttbk9EeVA3V29pMW1Pc0I3T3c5RXhwaTlNZFJ0V1hqOGZuei9LaFZnaGlpVWVzTHZtaVlWQ29kWlpYRVkraUhBSVJwc2Nmak1hcUQ2ZWIybjdLYjZxcERRYW5ObitJQ1EvUlVBRnFYcVZKU2JGRkJlL0NkWmtKRTVJWXRHNXdVd1kzYldnK0d5TjU5MlhtRXh1eGIrL0c5Q2xTVnFTaVNKZGlTb29VRlNrb0Vpdll2SHRoMnEzVXRoNHZzY2VVUGJhU1lzb3BwcGgxUkVFdVl6VU5BdE01d1RFZkFoOHRDNVZ2bTZaOXJ3ZURxZ1lpZ2hjazhwallRWGN6cENhVEZ6Nnlpa0lyTjFGdVBmZ1BDSk9QN3dTVS9sKysxQ1lobXRtUWtseGVZMmhnZ3BKUExpWm9jUklyRWpsTXdTRUZoNGtkRXZubEVkb2hvcXVpMmhDSWRZb1VCa1lSanFEUll5M1pUVEVYUmF1VWZYdllVdWhFUGNtOUxJanpLd0pSMXBTOFZrZ2ZpSUFwSzlMdEtkemFKTjdhZ0tSREFGOFBjOUhscDJwSG8yUTVOcW1FbGxadDVpcTlzcGtaTGtLMU5pSndGUE5vNjRiL2xSZ281Y1l2ODFSWUpJcUl4NGdQRmtnSEpvaXVjb0t4cm4ySzBaelFhTWp2RVJTMkpRR3QwOEQydEptZkRjRTNESm9RSmlZQlRRanZOZkx2cElKbWVadHJaU2VobzF0RkJPcTRtbDJXR2Vsbk52VDdXMHp5VVA1ZnNpVUNLVWpKWFVmalZDTWF6UzAwbWx0b1pyM3IzSnVnTkxPZTluV3EwYklpUzEySXJKYVN1MnppakNMR2syazNEVGRBd3cyUTZZWkFpQXpMSnZpbTlEdnYwT2hGczZEZGZ1NDZHZzB3YzdFY3l3YU5LYXlzYVMxaU1uN2o2ZmRUL284ZjVUZWYvbUF1ZEFpS1diM1N3U0FDdi9XM0J5bC81cVA4NXRQdnozTzE1TXBDeUpBbUZ5aXZFNGUwQzRuZzNOWDdlZVIzZm9vSC9zcy81ZFdMRHlJeE55MWtWdm90RkY3bXRKeVd4SlIxRHVEb1N1UHJWNW9SRzRsTTBTMGJrUGRsSklMQkRRbDhvOGpmbmR2QVluTmJRRnFOVmxubmdiQTAwZ0crZGI0S1I0cHMzWkRrQXk5M1NOZWhUN2M2UVpJODRpemZQRmZrMlBFaVR1MDZBV0ZWcWUya2dqZFJVRDlHcWxWZFpyeGRLRm9wUTJiOGlpZUUwZTBidkFiN0hGK2FpcGhlMkFZbVRLdXFSYldZbjNrbjA4RHM0amErTlIzRFhZN2J0azR0R2RWdUg0VW15U3BONkJEU21xZXlpb2VOL3ZwY3Y5NkNPd1ZONWFSMEswNzgvS3BoWCsxSkk3MG1kVFdjempmcjVBc3lSTUsyM2tub2MvaUppSW5aVGNGNGpUSEdZYUlrbkRaRnRRZ0dydFg2dVRJUlFaOEwxNjVvb2tzYzFyWHFUYnFiVHZKZTNodHVYd2VrVDJtNnhKNWxxMXAxWmdIZ0NFY0Nvejk4TEJkTEtWaTVSaDNQLzhOd0N4S0dKVGh3c0tsN2pQY1BKanh4dXNMWWRDOEhGS0tveHFuTEQvRS92blUzWG9VZk8zQ1d0K3o5RWlpTXovVEFwT0Y5dDlYcHI0NEZoTytvdXFTZ1lON0VuclNpeElobVRCUVd5bU5TUmFqVEFCZ2R5SG5ad2YyNVQyeERGVTFGemN1NWcwSmhLdzVWUTZVNHh2MkRkWmdUemx6dERuRmg0T3ZIYitIVGY5RFBmM2lpajgrL3NMdmQ1enQvclFxVHd2MWI2MVJLcjZQZUlwSXVVZGJDbTdLamJmbEtqd0hoZ254NGRwb3lhaHZhWERYc2RkNTRCa1I5WWsrUTVoMWlVTUVIaEkzZ2pxMXpVSUx2WHFyZ0hEU1RYdjc2ZUIrRkI1dmNkVmVUWHp2UnpXVHRMbEE0TVZFQmdUc0dhMkFEY0M1cDlpM2ozOVFqNUhnNGxTZXRWSjM0bG42M0xNOFhTOFhVOUtqVFdud09tQlhib1NIa1RHM1h3RFQwZXc2UGwyaWtRNHhON2VjTHI1VnBlamlWQ3Y1Q3pLbkx1L0VPbnI5Y2hxM0s3b0dwVlNzdEtmcDFkNGErOTUwSllPQTFBR09vcjVhVUFaaHlhVW8zbWg0clRDQ2hmZFdHV0hIZ1lWdnZCR3pKbUxzVU1UVS94Q3NYaCtBN0ViOTRlNDJmM1RzUGs0YWo1N2R3clhZWFg1MklZVnNXcnZGQUsrUUpIWnBnL0p1MklTT2tvdEFYT0JGU3NDNks4WFpWNCtOYWxsRFU3T3B2RitlQTEzTVZMd2U5Sm5qb3E3ek9Cd2Fic0doNFpYd0gzejYzQ1JBK2VQOTVEdDUvSHE0SjM3NVE1Y1hYYjRWRnc0OXVTK2pydmhEQWpuUzVSNG8rVklieUpwa3VXQnFBY2pibkh6VWZTUUhnWUlmeENqQTRNdDZRQW8wWmVoS0UwOWdsejRzNHZDOVNMbDNod09BaWxKUS9mRzQ3ZjN5aUd4NUsyRGQ0aWp1R1hvT0hFdjVzdk1qdlA3c1RNdUhCb1VYS2hRbThqNi9UQlUzUmd6ZnJJeTV2SEI2OFJLQ2U2WVY2NVNLQWVHYThrZUtxbnBkRGVFVHJaUXFXaUJOTDA5SmliakVZdUdOd0RpTGw1SFNSMDljaURvM00wTnQ5bko3S0NSNGJtU1dwR1U1UEYwR1VPd2ZuUW5PQitEb0xUTW0xaFljYldoc3JGTjlZS3lHMDBRQVlxN3ozTFpONTJFK1JhUm1BcTZQU05yNmRjWVc1aU1VeU1hL2w1YUdzTEVsMzkwL0JTNWJuNWl3OEgvSEluV050SWZLUk84ZmdoWWh2ejFvNGJ0azFzSUxaZFlvTHhXenQ3Uzg1dmZWZVlEeUNFeEd1VlI2dkF5UkZBdElMbkJhT1pFRU9NRmV0TVJWWTJyMGRDZWpYUnJFY3dSdGxxc1RDUnFxYzVxclF1ZFZLSkFVSDIvc3U4bTkrYnBMWWdJeDQ3dHIrYXJ1T3ZuUG9WUjc3dVNGVURla0IyTkUzbm9OZGRwMWpUY0VGK1hwVmVodFlaVEZPK01WSHBraWRvYXZReURPRld5L2NnUVN3QzJHdkU2cDBkNWEwRVN3Vjkrck5aSXp2NHphZTE0czB4RkRTb0Z1SVNJcDZZYUQ2WFQ3OWdlOHUyM0hWRWhnM2xrL3hiMy9zMVBMUFhOaFN0cnhFem5sOTA2NjZubzAwMEV3WTduK0cvL1NQbmduV2VOQk1NTkpZWDVJTDl6M2VNWlFyaUd5K2JzMlB0TCtoRStZK3YwbUVSbXUzeHZKOVhvcGk4Rm1oZldvYkhHNzAyU3FqaTN3dUlhMkZkK0VENzJLOEs5eDB0OVYxZm05QzFpSTRvWWk4WWxRcnE1YTBBQzdsaW02a0wzOTVQamRlVjdKR2tXYjdYTDV3Yi9UWmlwMFN4b1AxTi91dEJDSnBmcTkxUTc2S3dXaENJeFhPTFlVOUUwZ0F2SkU5Ui8yUzhYbDlhNVVyVWN6R3ZHZC91cFhyMzVSVW5JdVI2dVg3bmVFMTUvU1h5aFV1dDk1T1RITVNNY0hldy9oY1Q0SERBMGMwSndLWEZha0FHTXZKM0hpZmJ3eFBnVFJuSy9sZTZvNG1tcjd4VXlMLy9hOXRCSjl2L1RrckQ1QnFMamNORFYrY1FkWHAvdjBGV1ZLNDRPRGhFSjhTNllSbVFaNXgrSmZzUElpbFNKbXd3MS95U002M2tvY2QxOXFKcmt2TFY1Yi9VR0JaRG00NXYrRG81SkVyUDE5OUs3bmVlTXRWQ0h0VTVReDQrUFh0UldWdktvZVBaSmZmcHJPWFN1a0dZSktnb2VaYUZ6QTUzelU5WU9wTkJjdkRmSmtqN0tERVpvUXRaRHFFWVR1ZUhTamJnU0VNVzRCTm9naGUyanEvYXQ3dzBCYlFvaGhWQk1uRlNoRlJ3U0FTSmsxYXpkSE9uMVVzaTZpYjJ0NXhmUWxNck44RWtGOFlxOE5ZNjB1TGhUZ1pBQ1pEbzdKemsrS3hZODNMYjl1MXdPaW9pQnh4d05qdk1uTGxiYVJqWFdRWENtUmJMVzZIdlU5M21XRzMxMjdTZmRMbFkwMmw0QmZ3TkVVMUVVT0dhQ1lSU3R4VkVsdUlnbjNxSVhQaDl6SE9LRm1zU01sN3FhZ3pYYXFtNGpBVkw5TGxqUzE3a1lJUHY1R0pGYXhmcHZLMkprbVZkcHRLblVFelkwc1hEVE92Vk41eWlUTFJxTy8zRFZGUlRWVG84cGxNQXp4MnFMT3BjeEFyaDNGWDNycjdJeXJTYjQwdVlIV3JqeVRDcUlxbGprcE5VcG5KYXN5WW96S2R3RnhHb1JiaFU0OVJ4YWdsTXdabk1teGNLUGhTL0U4V3QwWmJHVFpsdHd2TExsRjJlc2VRcHJKWlUra3BlME9jbXJEamNsRklhMEt6Qm1rTlhCM0ZTWWljU0tHQVVGQ1JJa2lzUWdFaFJxUVFXbHVtcEdxcUtxYkx1ZVNsNG0vb0s5SHpadEJmMUVWM01US0Z5VTNQbnBwck83b1R5RnR2WEgzbnZxcjRaQ2dUTzdWbHRqUWp4NDQxdjk5QXI0b0YrampORnVZWm9zRXdUWFo1eDI3eHNrT2RES25LZ0JXcFVKQzgvSklsdlBFQmJqTlZ4S2dUcTE2c1J5eU9pQkp3U2Q3SnRqWDJJcmFYK1UxL1ZLZ2dSMGF4bzdVUmFSR0VrV3BWeVRNRWg5ZFloWWVBWXdqN0VjYkR0VWNlcitvb1I5ek5mcmlvU3N3cmJHS3gvWXVzWGNBdVBMdnc3RkFZRk5oRVJKbENCMXRwQWlYQlgrTUYrME02Y3V6Zy9zS2QrNC81eHc3aEQ2MUNPbGJEVWpsOEVIUHdjS3NIK3owV2xXc2JKanlHOENod0dHRWdIOE1KaEVzb2gvQnlreDMvNDcrN3JhdDN6M2kvOVF3YXl3NXJHZmJLYmhHR1VBNkk4R1Y1bUo5VnhkeG9aK0gvQjRoRFloams0MmwyQUFBQUFFbEZUa1N1UW1DQyc7XG5cbmV4cG9ydCB7U1VXSU5FVF9QTFVHSU5fTE9HT19CQVNFNjR9O1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1LTIwMjAgUml0ZW5zZSBCViwgdGhlIE5ldGhlcmxhbmRzLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIEVVUEwsIFZlcnNpb24gMS4yICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cHM6Ly9qb2ludXAuZWMuZXVyb3BhLmV1L2NvbGxlY3Rpb24vZXVwbC9ldXBsLXRleHQtZXVwbC0xMlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGdW5jdGlvbkNvbmZpZ3VyYXRpb25Db21wb25lbnR9IGZyb20gJ0B2YWx0aW1vL3BsdWdpbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCB0YWtlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7QnJwS2luZGVyZW5JbmZvQ29uZmlnfSBmcm9tICcuLi8uLi9tb2RlbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2JycC1wYXJ0bmVyLWluZm8nLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2JycC1raW5kZXJlbi1pbmZvLmNvbXBvbmVudC5odG1sJyksXG4gICAgc3R5bGVzOiBbcmVxdWlyZSgnLi9icnAta2luZGVyZW4taW5mby5jb21wb25lbnQuc2NzcycpXSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBCcnBLaW5kZXJlbkluZm9Db21wb25lbnRcbiAgICBpbXBsZW1lbnRzIEZ1bmN0aW9uQ29uZmlndXJhdGlvbkNvbXBvbmVudCwgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIHNhdmUkOiBPYnNlcnZhYmxlPHZvaWQ+O1xuICAgIEBJbnB1dCgpIGRpc2FibGVkJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBASW5wdXQoKSBwbHVnaW5JZDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHByZWZpbGxDb25maWd1cmF0aW9uJDogT2JzZXJ2YWJsZTxCcnBLaW5kZXJlbkluZm9Db25maWc+O1xuICAgIEBPdXRwdXQoKSB2YWxpZDogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICAgIEBPdXRwdXQoKSBjb25maWd1cmF0aW9uOiBFdmVudEVtaXR0ZXI8QnJwS2luZGVyZW5JbmZvQ29uZmlnPiA9IG5ldyBFdmVudEVtaXR0ZXI8QnJwS2luZGVyZW5JbmZvQ29uZmlnPigpO1xuXG4gICAgcHJpdmF0ZSBzYXZlU3Vic2NyaXB0aW9uITogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZm9ybVZhbHVlJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QnJwS2luZGVyZW5JbmZvQ29uZmlnIHwgbnVsbD4obnVsbCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSB2YWxpZCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wZW5TYXZlU3Vic2NyaXB0aW9uKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBmb3JtVmFsdWVDaGFuZ2UoZm9ybVZhbHVlOiBCcnBLaW5kZXJlbkluZm9Db25maWcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb3JtVmFsdWUkLm5leHQoZm9ybVZhbHVlKTtcbiAgICAgICAgdGhpcy5oYW5kbGVWYWxpZChmb3JtVmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlVmFsaWQoZm9ybVZhbHVlOiBCcnBLaW5kZXJlbkluZm9Db25maWcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdmFsaWQgPSAhIShcbiAgICAgICAgICAgIGZvcm1WYWx1ZS5raW5kZXJlbkJzbnMgJiZcbiAgICAgICAgICAgIGZvcm1WYWx1ZS5yZXN1bHRQcm9jZXNzVmFyaWFibGVOYW1lXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy52YWxpZCQubmV4dCh2YWxpZCk7XG4gICAgICAgIHRoaXMudmFsaWQuZW1pdCh2YWxpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvcGVuU2F2ZVN1YnNjcmlwdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9uID0gdGhpcy5zYXZlJD8uc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGNvbWJpbmVMYXRlc3QoW3RoaXMuZm9ybVZhbHVlJCwgdGhpcy52YWxpZCRdKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoW2Zvcm1WYWx1ZSwgdmFsaWRdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uLmVtaXQoZm9ybVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUtMjAyMCBSaXRlbnNlIEJWLCB0aGUgTmV0aGVybGFuZHMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgRVVQTCwgVmVyc2lvbiAxLjIgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwczovL2pvaW51cC5lYy5ldXJvcGEuZXUvY29sbGVjdGlvbi9ldXBsL2V1cGwtdGV4dC1ldXBsLTEyXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Z1bmN0aW9uQ29uZmlndXJhdGlvbkNvbXBvbmVudH0gZnJvbSAnQHZhbHRpbW8vcGx1Z2luJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIHRha2V9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtCcnBQYXJ0bmVySW5mb0NvbmZpZ30gZnJvbSAnLi4vLi4vbW9kZWxzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdicnAtcGFydG5lci1pbmZvJyxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9icnAtcGFydG5lci1pbmZvLmNvbXBvbmVudC5odG1sJyksXG4gICAgc3R5bGVzOiBbcmVxdWlyZSgnLi9icnAtcGFydG5lci1pbmZvLmNvbXBvbmVudC5zY3NzJyldLFxufSlcblxuZXhwb3J0IGNsYXNzIEJycFBhcnRuZXJJbmZvQ29tcG9uZW50XG4gICAgaW1wbGVtZW50cyBGdW5jdGlvbkNvbmZpZ3VyYXRpb25Db21wb25lbnQsIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBzYXZlJDogT2JzZXJ2YWJsZTx2b2lkPjtcbiAgICBASW5wdXQoKSBkaXNhYmxlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgQElucHV0KCkgcGx1Z2luSWQ6IHN0cmluZztcbiAgICBASW5wdXQoKSBwcmVmaWxsQ29uZmlndXJhdGlvbiQ6IE9ic2VydmFibGU8QnJwUGFydG5lckluZm9Db25maWc+O1xuICAgIEBPdXRwdXQoKSB2YWxpZDogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICAgIEBPdXRwdXQoKSBjb25maWd1cmF0aW9uOiBFdmVudEVtaXR0ZXI8QnJwUGFydG5lckluZm9Db25maWc+ID0gbmV3IEV2ZW50RW1pdHRlcjxCcnBQYXJ0bmVySW5mb0NvbmZpZz4oKTtcblxuICAgIHByaXZhdGUgc2F2ZVN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZvcm1WYWx1ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEJycFBhcnRuZXJJbmZvQ29uZmlnIHwgbnVsbD4obnVsbCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSB2YWxpZCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wZW5TYXZlU3Vic2NyaXB0aW9uKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBmb3JtVmFsdWVDaGFuZ2UoZm9ybVZhbHVlOiBCcnBQYXJ0bmVySW5mb0NvbmZpZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvcm1WYWx1ZSQubmV4dChmb3JtVmFsdWUpO1xuICAgICAgICB0aGlzLmhhbmRsZVZhbGlkKGZvcm1WYWx1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVWYWxpZChmb3JtVmFsdWU6IEJycFBhcnRuZXJJbmZvQ29uZmlnKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHZhbGlkID0gISEoXG4gICAgICAgICAgICBmb3JtVmFsdWUuYnNuICYmXG4gICAgICAgICAgICBmb3JtVmFsdWUucmVzdWx0UHJvY2Vzc1ZhcmlhYmxlTmFtZVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMudmFsaWQkLm5leHQodmFsaWQpO1xuICAgICAgICB0aGlzLnZhbGlkLmVtaXQodmFsaWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb3BlblNhdmVTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbiA9IHRoaXMuc2F2ZSQ/LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLmZvcm1WYWx1ZSQsIHRoaXMudmFsaWQkXSlcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKFtmb3JtVmFsdWUsIHZhbGlkXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvbi5lbWl0KGZvcm1WYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1LTIwMjAgUml0ZW5zZSBCViwgdGhlIE5ldGhlcmxhbmRzLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIEVVUEwsIFZlcnNpb24gMS4yICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cHM6Ly9qb2ludXAuZWMuZXVyb3BhLmV1L2NvbGxlY3Rpb24vZXVwbC9ldXBsLXRleHQtZXVwbC0xMlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGdW5jdGlvbkNvbmZpZ3VyYXRpb25Db21wb25lbnR9IGZyb20gJ0B2YWx0aW1vL3BsdWdpbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCB0YWtlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7QnJwUGVyc29vbkluZm9Db25maWd9IGZyb20gJy4uLy4uL21vZGVscyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYnJwLXBlcnNvb24taW5mbycsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vYnJwLXBlcnNvb24taW5mby5jb21wb25lbnQuaHRtbCcpLFxuICAgIHN0eWxlczogW3JlcXVpcmUoJy4vYnJwLXBlcnNvb24taW5mby5jb21wb25lbnQuc2NzcycpXSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBCcnBQZXJzb29uSW5mb0NvbXBvbmVudFxuICAgIGltcGxlbWVudHMgRnVuY3Rpb25Db25maWd1cmF0aW9uQ29tcG9uZW50LCBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgc2F2ZSQ6IE9ic2VydmFibGU8dm9pZD47XG4gICAgQElucHV0KCkgZGlzYWJsZWQkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIEBJbnB1dCgpIHBsdWdpbklkOiBzdHJpbmc7XG4gICAgQElucHV0KCkgcHJlZmlsbENvbmZpZ3VyYXRpb24kOiBPYnNlcnZhYmxlPEJycFBlcnNvb25JbmZvQ29uZmlnPjtcbiAgICBAT3V0cHV0KCkgdmFsaWQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgICBAT3V0cHV0KCkgY29uZmlndXJhdGlvbjogRXZlbnRFbWl0dGVyPEJycFBlcnNvb25JbmZvQ29uZmlnPiA9IG5ldyBFdmVudEVtaXR0ZXI8QnJwUGVyc29vbkluZm9Db25maWc+KCk7XG5cbiAgICBwcml2YXRlIHNhdmVTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG4gICAgcHJpdmF0ZSByZWFkb25seSBmb3JtVmFsdWUkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxCcnBQZXJzb29uSW5mb0NvbmZpZyB8IG51bGw+KG51bGwpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgdmFsaWQkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vcGVuU2F2ZVN1YnNjcmlwdGlvbigpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgZm9ybVZhbHVlQ2hhbmdlKGZvcm1WYWx1ZTogQnJwUGVyc29vbkluZm9Db25maWcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb3JtVmFsdWUkLm5leHQoZm9ybVZhbHVlKTtcbiAgICAgICAgdGhpcy5oYW5kbGVWYWxpZChmb3JtVmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlVmFsaWQoZm9ybVZhbHVlOiBCcnBQZXJzb29uSW5mb0NvbmZpZyk6IHZvaWQge1xuICAgICAgICBjb25zdCB2YWxpZCA9ICEhKFxuICAgICAgICAgICAgZm9ybVZhbHVlLmJzbiAmJlxuICAgICAgICAgICAgZm9ybVZhbHVlLnJlc3VsdFByb2Nlc3NWYXJpYWJsZU5hbWVcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnZhbGlkJC5uZXh0KHZhbGlkKTtcbiAgICAgICAgdGhpcy52YWxpZC5lbWl0KHZhbGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9wZW5TYXZlU3Vic2NyaXB0aW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb24gPSB0aGlzLnNhdmUkPy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgY29tYmluZUxhdGVzdChbdGhpcy5mb3JtVmFsdWUkLCB0aGlzLnZhbGlkJF0pXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChbZm9ybVZhbHVlLCB2YWxpZF0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uZW1pdChmb3JtVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNS0yMDI0LiBSaXRlbnNlIEJWLCB0aGUgTmV0aGVybGFuZHMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgRVVQTCwgVmVyc2lvbiAxLjIgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwczovL2pvaW51cC5lYy5ldXJvcGEuZXUvY29sbGVjdGlvbi9ldXBsL2V1cGwtdGV4dC1ldXBsLTEyXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuICpcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsdWdpbkNvbmZpZ3VyYXRpb25Db21wb25lbnR9IGZyb20gJ0B2YWx0aW1vL3BsdWdpbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCB0YWtlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7U3V3aW5ldFBsdWdpbkNvbmZpZ30gZnJvbSBcIi4uLy4uL21vZGVsc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdzdXdpbmV0LXBsdWdpbi1jb25maWd1cmF0aW9uJyxcbiAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vc3V3aW5ldC1wbHVnaW4tY29uZmlndXJhdGlvbi5jb21wb25lbnQuaHRtbCcpLFxuICBzdHlsZXM6IFtyZXF1aXJlKCcuL3N1d2luZXQtcGx1Z2luLWNvbmZpZ3VyYXRpb24uY29tcG9uZW50LnNjc3MnKV0sXG59KVxuZXhwb3J0IGNsYXNzIFN1d2luZXRQbHVnaW5Db25maWd1cmF0aW9uQ29tcG9uZW50XG4gIGltcGxlbWVudHMgU3V3aW5ldFBsdWdpbkNvbmZpZ3VyYXRpb25Db21wb25lbnQsIE9uSW5pdCwgT25EZXN0cm95XG57XG4gIEBJbnB1dCgpIHNhdmUkOiBPYnNlcnZhYmxlPHZvaWQ+O1xuICBASW5wdXQoKSBkaXNhYmxlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gIEBJbnB1dCgpIHBsdWdpbklkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHByZWZpbGxDb25maWd1cmF0aW9uJDogT2JzZXJ2YWJsZTxTdXdpbmV0UGx1Z2luQ29uZmlnPjtcbiAgQE91dHB1dCgpIHZhbGlkOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIEBPdXRwdXQoKSBjb25maWd1cmF0aW9uOiBFdmVudEVtaXR0ZXI8U3V3aW5ldFBsdWdpbkNvbmZpZz4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxTdXdpbmV0UGx1Z2luQ29uZmlnPigpO1xuXG4gIHByaXZhdGUgc2F2ZVN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcblxuICBwcml2YXRlIHJlYWRvbmx5IGZvcm1WYWx1ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN1d2luZXRQbHVnaW5Db25maWcgfCBudWxsPihudWxsKTtcbiAgcHJpdmF0ZSByZWFkb25seSB2YWxpZCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm9wZW5TYXZlU3Vic2NyaXB0aW9uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBmb3JtVmFsdWVDaGFuZ2UoZm9ybVZhbHVlOiBTdXdpbmV0UGx1Z2luQ29uZmlnKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtVmFsdWUkLm5leHQoZm9ybVZhbHVlKTtcbiAgICB0aGlzLmhhbmRsZVZhbGlkKGZvcm1WYWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVZhbGlkKGZvcm1WYWx1ZTogU3V3aW5ldFBsdWdpbkNvbmZpZyk6IHZvaWQge1xuICAgIGNvbnN0IHZhbGlkID0gISEoXG4gICAgICAgIGZvcm1WYWx1ZS5jb25maWd1cmF0aW9uVGl0bGUgJiZcbiAgICAgICAgZm9ybVZhbHVlLmJhc2VVcmxcbiAgICApO1xuXG4gICAgdGhpcy52YWxpZCQubmV4dCh2YWxpZCk7XG4gICAgdGhpcy52YWxpZC5lbWl0KHZhbGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgb3BlblNhdmVTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9uID0gdGhpcy5zYXZlJD8uc3Vic2NyaWJlKHNhdmUgPT4ge1xuICAgICAgY29tYmluZUxhdGVzdChbdGhpcy5mb3JtVmFsdWUkLCB0aGlzLnZhbGlkJF0pXG4gICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKChbZm9ybVZhbHVlLCB2YWxpZF0pID0+IHtcbiAgICAgICAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uZW1pdChmb3JtVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUtMjAyNC4gUml0ZW5zZSBCViwgdGhlIE5ldGhlcmxhbmRzLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIEVVUEwsIFZlcnNpb24gMS4yICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cHM6Ly9qb2ludXAuZWMuZXVyb3BhLmV1L2NvbGxlY3Rpb24vZXVwbC9ldXBsLXRleHQtZXVwbC0xMlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbiAqXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtQbHVnaW5Db25maWd1cmF0aW9uRGF0YX0gZnJvbSAnQHZhbHRpbW8vcGx1Z2luJztcblxuZXhwb3J0IGludGVyZmFjZSBTdXdpbmV0UGx1Z2luQ29uZmlnIGV4dGVuZHMgUGx1Z2luQ29uZmlndXJhdGlvbkRhdGEge1xuICAgIGJhc2VVcmw6IHN0cmluZztcbiAgICBrZXlzdG9yZVBhdGg6IHN0cmluZztcbiAgICBrZXlzdG9yZVNlY3JldDogc3RyaW5nO1xuICAgIHRydXN0c3RvcmVQYXRoOiBzdHJpbmc7XG4gICAgdHJ1c3RzdG9yZVNlY3JldDogc3RyaW5nO1xuICAgIGJhc2ljQXV0aE5hbWU6IHN0cmluZztcbiAgICBiYXNpY0F1dGhTZWNyZXQ6IHN0cmluZztcbiAgICBjb25uZWN0aW9uVGltZW91dDogbnVtYmVyO1xuICAgIHJlY2VpdmVUaW1lb3V0OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnJwUGVyc29vbkluZm9Db25maWcge1xuICAgIGJzbjogc3RyaW5nO1xuICAgIHJlc3VsdFByb2Nlc3NWYXJpYWJsZU5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCcnBQYXJ0bmVySW5mb0NvbmZpZyB7XG4gICAgYnNuOiBzdHJpbmc7XG4gICAgcmVzdWx0UHJvY2Vzc1ZhcmlhYmxlTmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJycEtpbmRlcmVuSW5mb0NvbmZpZyB7XG4gICAga2luZGVyZW5Cc25zOiBzdHJpbmc7XG4gICAgcmVzdWx0UHJvY2Vzc1ZhcmlhYmxlTmFtZTogc3RyaW5nO1xufVxuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1LTIwMjQuIFJpdGVuc2UgQlYsIHRoZSBOZXRoZXJsYW5kcy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciBFVVBMLCBWZXJzaW9uIDEuMiAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHBzOi8vam9pbnVwLmVjLmV1cm9wYS5ldS9jb2xsZWN0aW9uL2V1cGwvZXVwbC10ZXh0LWV1cGwtMTJcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG4gKlxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vY29uZmlnJztcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNS0yMDI0LiBSaXRlbnNlIEJWLCB0aGUgTmV0aGVybGFuZHMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgRVVQTCwgVmVyc2lvbiAxLjIgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwczovL2pvaW51cC5lYy5ldXJvcGEuZXUvY29sbGVjdGlvbi9ldXBsL2V1cGwtdGV4dC1ldXBsLTEyXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuICpcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtQTFVHSU5TX1RPS0VOLCBQbHVnaW5UcmFuc2xhdGVQaXBlTW9kdWxlfSBmcm9tICdAdmFsdGltby9wbHVnaW4nO1xuXG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0Zvcm1Nb2R1bGUsIElucHV0TW9kdWxlfSBmcm9tICdAdmFsdGltby9jb21wb25lbnRzJztcbmltcG9ydCB7U3V3aW5ldFBsdWdpbkNvbmZpZ3VyYXRpb25Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9wbHVnaW4tY29uZmlndXJhdGlvbi9zdXdpbmV0LXBsdWdpbi1jb25maWd1cmF0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQge0JycFBlcnNvb25JbmZvQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvYnJwLXBlcnNvb24taW5mby9icnAtcGVyc29vbi1pbmZvLmNvbXBvbmVudCc7XG5pbXBvcnQge0JycFBhcnRuZXJJbmZvQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvYnJwLXBhcnRuZXItaW5mby9icnAtcGFydG5lci1pbmZvLmNvbXBvbmVudCc7XG5pbXBvcnQge0JycEtpbmRlcmVuSW5mb0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2JycC1raW5kZXJlbi1pbmZvL2JycC1raW5kZXJlbi1pbmZvLmNvbXBvbmVudCc7XG5pbXBvcnQge3N1d2luZXRQbHVnaW5TcGVjaWZpY2F0aW9ufSBmcm9tICcuL3N1d2luZXQtcGx1Z2luLnNwZWNpZmljYXRpb24nO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBTdXdpbmV0UGx1Z2luQ29uZmlndXJhdGlvbkNvbXBvbmVudCxcbiAgICAgICAgQnJwUGVyc29vbkluZm9Db21wb25lbnQsXG4gICAgICAgIEJycFBhcnRuZXJJbmZvQ29tcG9uZW50LFxuICAgICAgICBCcnBLaW5kZXJlbkluZm9Db21wb25lbnRcblxuICAgIF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUGx1Z2luVHJhbnNsYXRlUGlwZU1vZHVsZSwgRm9ybU1vZHVsZSwgSW5wdXRNb2R1bGUsIEZvcm1zTW9kdWxlLCBQbHVnaW5UcmFuc2xhdGVQaXBlTW9kdWxlLCBGb3JtTW9kdWxlLCBGb3JtTW9kdWxlLCBGb3JtTW9kdWxlLCBGb3JtTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIFN1d2luZXRQbHVnaW5Db25maWd1cmF0aW9uQ29tcG9uZW50LFxuICAgICAgICBCcnBQZXJzb29uSW5mb0NvbXBvbmVudCxcbiAgICAgICAgQnJwUGFydG5lckluZm9Db21wb25lbnQsXG4gICAgICAgIEJycEtpbmRlcmVuSW5mb0NvbXBvbmVudFxuXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogUExVR0lOU19UT0tFTixcbiAgICAgICAgICAgIHVzZVZhbHVlOiBbXG4gICAgICAgICAgICAgICAgc3V3aW5ldFBsdWdpblNwZWNpZmljYXRpb24sXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIFN1d2luZXRQbHVnaW5Nb2R1bGUge1xufVxuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1LTIwMjQuIFJpdGVuc2UgQlYsIHRoZSBOZXRoZXJsYW5kcy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciBFVVBMLCBWZXJzaW9uIDEuMiAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHBzOi8vam9pbnVwLmVjLmV1cm9wYS5ldS9jb2xsZWN0aW9uL2V1cGwvZXVwbC10ZXh0LWV1cGwtMTJcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG4gKlxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7UGx1Z2luU3BlY2lmaWNhdGlvbn0gZnJvbSAnQHZhbHRpbW8vcGx1Z2luJztcbmltcG9ydCB7U1VXSU5FVF9QTFVHSU5fTE9HT19CQVNFNjR9IGZyb20gJy4vYXNzZXRzJztcbmltcG9ydCB7XG4gIFN1d2luZXRQbHVnaW5Db25maWd1cmF0aW9uQ29tcG9uZW50XG59IGZyb20gXCIuL2NvbXBvbmVudHMvcGx1Z2luLWNvbmZpZ3VyYXRpb24vc3V3aW5ldC1wbHVnaW4tY29uZmlndXJhdGlvbi5jb21wb25lbnRcIjtcblxuaW1wb3J0IHtCcnBQZXJzb29uSW5mb0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2JycC1wZXJzb29uLWluZm8vYnJwLXBlcnNvb24taW5mby5jb21wb25lbnQnO1xuaW1wb3J0IHtCcnBQYXJ0bmVySW5mb0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2JycC1wYXJ0bmVyLWluZm8vYnJwLXBhcnRuZXItaW5mby5jb21wb25lbnQnO1xuaW1wb3J0IHtCcnBLaW5kZXJlbkluZm9Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9icnAta2luZGVyZW4taW5mby9icnAta2luZGVyZW4taW5mby5jb21wb25lbnQnO1xuXG5jb25zdCBzdXdpbmV0UGx1Z2luU3BlY2lmaWNhdGlvbjogUGx1Z2luU3BlY2lmaWNhdGlvbiA9IHtcbiAgcGx1Z2luSWQ6ICdzdXdpbmV0JyxcbiAgcGx1Z2luQ29uZmlndXJhdGlvbkNvbXBvbmVudDogU3V3aW5ldFBsdWdpbkNvbmZpZ3VyYXRpb25Db21wb25lbnQsXG4gIHBsdWdpbkxvZ29CYXNlNjQ6IFNVV0lORVRfUExVR0lOX0xPR09fQkFTRTY0LFxuICBmdW5jdGlvbkNvbmZpZ3VyYXRpb25Db21wb25lbnRzOiB7XG4gICAgJ2dldC1icnAtcGVyc29vbnNnZWdldmVucyc6IEJycFBlcnNvb25JbmZvQ29tcG9uZW50LFxuICAgICdnZXQtYnJwLXBhcnRuZXItcGVyc29vbnNnZWdldmVucyc6IEJycFBhcnRuZXJJbmZvQ29tcG9uZW50LFxuICAgICdnZXQtYnJwLWtpbmRlcmVuLXBlcnNvb25zZ2VnZXZlbnMnOiBCcnBLaW5kZXJlbkluZm9Db21wb25lbnRcbiAgfSxcbiAgcGx1Z2luVHJhbnNsYXRpb25zOiB7XG4gICAgbmw6IHtcbiAgICAgIGNvbmZpZ3VyYXRpb25UaXRsZTogJ0NvbmZpZ3VyYXRpZW5hYW0nLFxuICAgICAgY29uZmlndXJhdGlvblRpdGxlVG9vbHRpcDpcbiAgICAgICAgICAnSGllciBrdW50IGplIGVlbiBlaWdlbiBuYWFtIHZlcnppbm5lbi4gT25kZXIgZGV6ZSBuYWFtIHphbCBkZSBwbHVnaW4gdGUgaGVya2VubmVuIHppam4gaW4gZGUgcmVzdCB2YW4gZGUgYXBwbGljYXRpZScsXG4gICAgICB0aXRsZTogJ1N1d2lOZXQnLFxuICAgICAgZGVzY3JpcHRpb246ICdQbHVnaW4gb20gZGF0YSB1aXQgU3V3aW5ldCBvcCB0ZSBoYWxlbicsXG4gICAgICB1cmw6ICdVUkwnLFxuICAgICAgYnNuOiAnQnVyZ2Vyc2VydmljZW51bW1lcicsXG4gICAgICBrZW50ZWtlbjogJ0tlbnRla2VuJyxcbiAgICAgIGJzblRvb2x0aXA6ICdEZSBidXJnZXJzZXJ2aWNlIG51bW1lciB3YWFyb3AgZWVuIHpvZWsgZ2VkYWFuIHdvcmR0JyxcbiAgICAgIHBsdWdpbkFjdGlvbldhcm5pbmc6ICdGaWxsIGluIHRoZSByZXF1aXJlZCBmaWVsZHMgZm9yIHRoaXMgcGx1Z2luIGFjdGlvbicsXG4gICAgICByZXN1bHRQcm9jZXNzVmFyaWFibGVOYW1lOiAnTmFhbSB2YW4gZGUgcHJvY2VzIHZhcmlhYmVsZSB2b29yIGhldCBvcHNsYWFuIHZhbiBkZSByZXNwb25zJyxcbiAgICAgIHJlc3VsdFByb2Nlc3NWYXJpYWJsZU5hbWVUb29sdGlwOlxuICAgICAgICAgICdEZSBuYWFtIHZhbiBkZSBwcm9jZXMgdmFyaWFiZWxlIHdhYXIgaGV0IHJlc3VsdGFhdCBpbiBvcGdlc2xhZ2VuIHdvcmR0LiBab2RvZW5kZSBrYW4gZGV6ZSB2YXJpYWJlbGUgd29yZGVuIGdlYnJ1aWt0IGluIGFuZGVyZSBCUE1OIHRha2VuLicsXG4gICAgICBrZXlzdG9yZVBhdGg6ICdLZXlzdG9yZSBjZXJ0aWZpY2F0ZSBwYXRoJyxcbiAgICAgIGtleXN0b3JlU2VjcmV0OiAnS2V5c3RvcmUgY2VydGlmaWNhdGUga2V5JyxcbiAgICAgIHRydXN0c3RvcmVQYXRoOiAnVHJ1c3RzdG9yZSBjZXJ0aWZpY2F0ZSBwYXRoJyxcbiAgICAgIHRydXN0c3RvcmVTZWNyZXQ6ICdUcnVzdHN0b3JlIGNlcnRpZmljYXRlIGtleScsXG4gICAgICBiYXNpY0F1dGhOYW1lOiAnQmFzaWMgQXV0aG9yaXphdGlvbiBuYW1lJyxcbiAgICAgIGJhc2ljQXV0aFNlY3JldDogJ0Jhc2ljIEF1dGhvcml6YXRpb24gcGFzc3dvcmQnLFxuICAgICAgYmFzZVVybDogJ0Jhc2UgVVJMJyxcbiAgICAgIGNvbm5lY3Rpb25UaW1lb3V0OiAnY29ubmVjdGlvblRpbWVvdXQ6IFNwZWNpZmllcyB0aGUgYW1vdW50IG9mIHRpbWUsIGluIHNlY29uZHMsIHRoYXQgdGhlIGNvbnN1bWVyIHdpbGwgYXR0ZW1wdCB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uIGJlZm9yZSBpdCB0aW1lcyBvdXQuIDAgaXMgaW5maW5pdGUnLFxuICAgICAgcmVjZWl2ZVRpbWVvdXQ6ICdyZWNlaXZlVGltZW91dDogU3BlY2lmaWVzIHRoZSBhbW91bnQgb2YgdGltZSwgaW4gc2Vjb25kcywgdGhhdCB0aGUgY29uc3VtZXIgd2lsbCB3YWl0IGZvciBhIHJlc3BvbnNlIGJlZm9yZSBpdCB0aW1lcyBvdXQuIDAgaXMgaW5maW5pdGUuJyxcbiAgICAgICdnZXQtYnJwLXBlcnNvb25zZ2VnZXZlbnMnOiAnT3BoYWxlbiBCUlAgUGVyc29vbnNnZWdldmVucycsXG4gICAgICAnZ2V0LWJycC1wYXJ0bmVyLXBlcnNvb25zZ2VnZXZlbnMnOiAnT3BoYWxlbiBCUlAgUGFydG5lciBpbmZvJyxcbiAgICAgICdnZXQtYnJwLWtpbmRlcmVuLXBlcnNvb25zZ2VnZXZlbnMnOiAnT3BoYWxlbiBCUlAgS2luZGVyZW4gaW5mbydcbiAgICB9LFxuICAgIGVuOiB7XG4gICAgICBjb25maWd1cmF0aW9uVGl0bGU6ICdDb25maWd1cmF0aW9uIG5hbWUnLFxuICAgICAgY29uZmlndXJhdGlvblRpdGxlVG9vbHRpcDpcbiAgICAgICAgICAnSGVyZSB5b3UgY2FuIGVudGVyIGEgbmFtZSBmb3IgdGhlIHBsdWdpbi4gVGhpcyBuYW1lIHdpbGwgYmUgdXNlZCB0byByZWNvZ25pemUgdGhlIHBsdWdpbiB0aHJvdWdob3V0IHRoZSByZXN0IG9mIHRoZSBhcHBsaWNhdGlvbicsXG4gICAgICB0aXRsZTogJ1N1d2lOZXQnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGlzIHBsdWdpbiBtYWtlcyBpdCBwb3NzaWJsZSB0byBjb21tdW5pY2F0ZSB3aXRoIFN1d2lOZXQuJyxcbiAgICAgIHVybDogJ1VSTCcsXG4gICAgICBic246ICdCU04nLFxuICAgICAgYnNuVG9vbHRpcDogJ1RoZSBidXJnZXJzZXJ2aWNlbnVtbWVyIGZvciB3aGljaCB0aGUgcmVxdWVzdCBzaG91bGQgYmUgbWFkZScsXG4gICAgICByZXN1bHRQcm9jZXNzVmFyaWFibGVOYW1lOiAnUHJvY2VzcyB2YXJpYWJsZSBuYW1lIGZvciBzdG9yaW5nIHRoZSByZXNwb25zZScsXG4gICAgICByZXN1bHRQcm9jZXNzVmFyaWFibGVOYW1lVG9vbHRpcDpcbiAgICAgICAgICAnVGhlIG5hbWUgb2YgdGhlIHByb2Nlc3MgdmFyaWFibGUgdGhhdCB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHNhdmVkIHRvLiBUaGlzIHByb2Nlc3MgdmFyaWFibGUgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIHRoZSByZXNwb25zZSBpbiBhbm90aGVyIEJQTU4gdGFzay4nLFxuICAgICAga2V5c3RvcmVQYXRoOiAnS2V5c3RvcmUgY2VydGlmaWNhdGUgcGF0aCcsXG4gICAgICBrZXlzdG9yZVNlY3JldDogJ0tleXN0b3JlIGNlcnRpZmljYXRlIGtleScsXG4gICAgICB0cnVzdHN0b3JlUGF0aDogJ1RydXN0c3RvcmUgY2VydGlmaWNhdGUgcGF0aCcsXG4gICAgICB0cnVzdHN0b3JlU2VjcmV0OiAnVHJ1c3RzdG9yZSBjZXJ0aWZpY2F0ZSBrZXknLFxuICAgICAgYmFzaWNBdXRoTmFtZTogJ0Jhc2ljIEF1dGhvcml6YXRpb24gbmFtZScsXG4gICAgICBiYXNpY0F1dGhTZWNyZXQ6ICdCYXNpYyBBdXRob3JpemF0aW9uIHBhc3N3b3JkJyxcbiAgICAgIGJhc2VVcmw6ICdCYXNlIFVSTCcsXG4gICAgICBjb25uZWN0aW9uVGltZW91dDogJ2Nvbm5lY3Rpb25UaW1lb3V0OiBTcGVjaWZpZXMgdGhlIGFtb3VudCBvZiB0aW1lLCBpbiBzZWNvbmRzLCB0aGF0IHRoZSBjb25zdW1lciB3aWxsIGF0dGVtcHQgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbiBiZWZvcmUgaXQgdGltZXMgb3V0LiAwIGlzIGluZmluaXRlJyxcbiAgICAgIHJlY2VpdmVUaW1lb3V0OiAncmVjZWl2ZVRpbWVvdXQ6IFNwZWNpZmllcyB0aGUgYW1vdW50IG9mIHRpbWUsIGluIHNlY29uZHMsIHRoYXQgdGhlIGNvbnN1bWVyIHdpbGwgd2FpdCBmb3IgYSByZXNwb25zZSBiZWZvcmUgaXQgdGltZXMgb3V0LiAwIGlzIGluZmluaXRlLicsXG4gICAgICAnZ2V0LWJycC1wZXJzb29uc2dlZ2V2ZW5zJzogJ1JldHJpZXZlIEJSUCBQZXJzb25hbCBpbmZvJyxcbiAgICAgICdnZXQtYnJwLXBhcnRuZXItcGVyc29vbnNnZWdldmVucyc6ICdSZXRyaWV2ZSBCUlAgUGFydG5lciBpbmZvJyxcbiAgICAgICdnZXQtYnJwLWtpbmRlcmVuLXBlcnNvb25zZ2VnZXZlbnMnOiAnUmV0cmlldmUgQlJQIGNoaWxkcmVuIGluZm8nXG4gICAgfSxcbiAgICBkZToge1xuICAgICAgY29uZmlndXJhdGlvblRpdGxlOiAnQ29uZmlndXJhdGlvbiBuYW1lJyxcbiAgICAgIGNvbmZpZ3VyYXRpb25UaXRsZVRvb2x0aXA6XG4gICAgICAgICAgJ0hlcmUgeW91IGNhbiBlbnRlciBhIG5hbWUgZm9yIHRoZSBwbHVnaW4uIFRoaXMgbmFtZSB3aWxsIGJlIHVzZWQgdG8gcmVjb2duaXplIHRoZSBwbHVnaW4gdGhyb3VnaG91dCB0aGUgcmVzdCBvZiB0aGUgYXBwbGljYXRpb24nLFxuICAgICAgdGl0bGU6ICdTdXdpTmV0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBwbHVnaW4gbWFrZXMgaXQgcG9zc2libGUgdG8gY29tbXVuaWNhdGUgd2l0aCBTdXdpTmV0LicsXG4gICAgICB1cmw6ICdVUkwnLFxuICAgICAgYnNuOiAnQlNOJyxcbiAgICAgIGJzblRvb2x0aXA6ICdUaGUgYnVyZ2Vyc2VydmljZW51bW1lciBmb3Igd2hpY2ggdGhlIHJlcXVlc3Qgc2hvdWxkIGJlIG1hZGUnLFxuICAgICAgcmVzdWx0UHJvY2Vzc1ZhcmlhYmxlTmFtZTogJ1Byb2Nlc3MgdmFyaWFibGUgbmFtZSBmb3Igc3RvcmluZyB0aGUgcmVzcG9uc2UnLFxuICAgICAgcmVzdWx0UHJvY2Vzc1ZhcmlhYmxlTmFtZVRvb2x0aXA6XG4gICAgICAgICAgJ1RoZSBuYW1lIG9mIHRoZSBwcm9jZXNzIHZhcmlhYmxlIHRoYXQgdGhlIHJlc3BvbnNlIHNob3VsZCBiZSBzYXZlZCB0by4gVGhpcyBwcm9jZXNzIHZhcmlhYmxlIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgcmVzcG9uc2UgaW4gYW5vdGhlciBCUE1OIHRhc2suJyxcbiAgICAgIGtleXN0b3JlUGF0aDogJ0tleXN0b3JlIGNlcnRpZmljYXRlIHBhdGgnLFxuICAgICAga2V5c3RvcmVTZWNyZXQ6ICdLZXlzdG9yZSBjZXJ0aWZpY2F0ZSBrZXknLFxuICAgICAgdHJ1c3RzdG9yZVBhdGg6ICdUcnVzdHN0b3JlIGNlcnRpZmljYXRlIHBhdGgnLFxuICAgICAgdHJ1c3RzdG9yZVNlY3JldDogJ1RydXN0c3RvcmUgY2VydGlmaWNhdGUga2V5JyxcbiAgICAgIGJhc2ljQXV0aE5hbWU6ICdCYXNpYyBBdXRob3JpemF0aW9uIG5hbWUnLFxuICAgICAgYmFzaWNBdXRoU2VjcmV0OiAnQmFzaWMgQXV0aG9yaXphdGlvbiBwYXNzd29yZCcsXG4gICAgICBiYXNlVXJsOiAnQmFzZSBVUkwnLFxuICAgICAgY29ubmVjdGlvblRpbWVvdXQ6ICdjb25uZWN0aW9uVGltZW91dDogU3BlY2lmaWVzIHRoZSBhbW91bnQgb2YgdGltZSwgaW4gc2Vjb25kcywgdGhhdCB0aGUgY29uc3VtZXIgd2lsbCBhdHRlbXB0IHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24gYmVmb3JlIGl0IHRpbWVzIG91dC4gMCBpcyBpbmZpbml0ZScsXG4gICAgICByZWNlaXZlVGltZW91dDogJ3JlY2VpdmVUaW1lb3V0OiBTcGVjaWZpZXMgdGhlIGFtb3VudCBvZiB0aW1lLCBpbiBzZWNvbmRzLCB0aGF0IHRoZSBjb25zdW1lciB3aWxsIHdhaXQgZm9yIGEgcmVzcG9uc2UgYmVmb3JlIGl0IHRpbWVzIG91dC4gMCBpcyBpbmZpbml0ZS4nLFxuICAgICAgJ2dldC1icnAtcGVyc29vbnNnZWdldmVucyc6ICdSZXRyaWV2ZSBCUlAgUGVyc29uYWwgaW5mbycsXG4gICAgICAnZ2V0LWJycC1wYXJ0bmVyLXBlcnNvb25zZ2VnZXZlbnMnOiAnUmV0cmlldmUgQlJQIFBhcnRuZXIgaW5mbycsXG4gICAgICAnZ2V0LWJycC1raW5kZXJlbi1wZXJzb29uc2dlZ2V2ZW5zJzogJ1JldHJpZXZlIEJSUCBjaGlsZHJlbiBpbmZvJ1xuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQge3N1d2luZXRQbHVnaW5TcGVjaWZpY2F0aW9ufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1wiQGFuZ3VsYXIvY29tbW9uXCJdOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1wiQGFuZ3VsYXIvY29yZVwiXTsiLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvd1tcIkB2YWx0aW1vL2NvbXBvbmVudHNcIl07IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3dbXCJAdmFsdGltby9wbHVnaW5cIl07IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3dbXCJyeGpzXCJdOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1widHNsaWJcIl07IiwiLyoqXG4gKiBAbGljZW5zZSBBbmd1bGFyIHYxNy4zLjEyXG4gKiAoYykgMjAxMC0yMDI0IEdvb2dsZSBMTEMuIGh0dHBzOi8vYW5ndWxhci5pby9cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCAqIGFzIGkwIGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBJbmplY3Rpb25Ub2tlbiwgZm9yd2FyZFJlZiwgT3B0aW9uYWwsIEluamVjdCwgybVpc1Byb21pc2UsIMm1aXNTdWJzY3JpYmFibGUsIMm1UnVudGltZUVycm9yLCBTZWxmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBIb3N0LCBTa2lwU2VsZiwgYm9vbGVhbkF0dHJpYnV0ZSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE91dHB1dCwgSW5qZWN0YWJsZSwgaW5qZWN0LCBOZ01vZHVsZSwgVmVyc2lvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgybVnZXRET00gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgZnJvbSwgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhbGwgQ29udHJvbFZhbHVlQWNjZXNzb3IgY2xhc3NlcyBkZWZpbmVkIGluIEZvcm1zIHBhY2thZ2UuXG4gKiBDb250YWlucyBjb21tb24gbG9naWMgYW5kIHV0aWxpdHkgZnVuY3Rpb25zLlxuICpcbiAqIE5vdGU6IHRoaXMgaXMgYW4gKmludGVybmFsLW9ubHkqIGNsYXNzIGFuZCBzaG91bGQgbm90IGJlIGV4dGVuZGVkIG9yIHVzZWQgZGlyZWN0bHkgaW5cbiAqIGFwcGxpY2F0aW9ucyBjb2RlLlxuICovXG5jbGFzcyBCYXNlQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIGNvbnN0cnVjdG9yKF9yZW5kZXJlciwgX2VsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBfcmVuZGVyZXI7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYgPSBfZWxlbWVudFJlZjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgY2hhbmdlIG9yIGlucHV0IGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXRcbiAgICAgICAgICogZWxlbWVudC5cbiAgICAgICAgICogQG5vZG9jXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gKF8pID0+IHsgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgYmx1ciBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAgICAgICAqIEBub2RvY1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vblRvdWNoZWQgPSAoKSA9PiB7IH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEhlbHBlciBtZXRob2QgdGhhdCBzZXRzIGEgcHJvcGVydHkgb24gYSB0YXJnZXQgZWxlbWVudCB1c2luZyB0aGUgY3VycmVudCBSZW5kZXJlclxuICAgICAqIGltcGxlbWVudGF0aW9uLlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHNldFByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbikge1xuICAgICAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBjaGFuZ2VzLlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBcImRpc2FibGVkXCIgcHJvcGVydHkgb24gdGhlIHJhbmdlIGlucHV0IGVsZW1lbnQuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVwczogW3sgdG9rZW46IGkwLlJlbmRlcmVyMiB9LCB7IHRva2VuOiBpMC5FbGVtZW50UmVmIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZVxuICAgICAgICB9XSwgY3RvclBhcmFtZXRlcnM6ICgpID0+IFt7IHR5cGU6IGkwLlJlbmRlcmVyMiB9LCB7IHR5cGU6IGkwLkVsZW1lbnRSZWYgfV0gfSk7XG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBidWlsdC1pbiBDb250cm9sVmFsdWVBY2Nlc3NvciBjbGFzc2VzIChleGNlcHQgRGVmYXVsdFZhbHVlQWNjZXNzb3IsIHdoaWNoIGlzXG4gKiB1c2VkIGluIGNhc2Ugbm8gb3RoZXIgQ1ZBcyBjYW4gYmUgZm91bmQpLiBXZSB1c2UgdGhpcyBjbGFzcyB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIGRlZmF1bHQgQ1ZBLFxuICogYnVpbHQtaW4gQ1ZBcyBhbmQgY3VzdG9tIENWQXMsIHNvIHRoYXQgRm9ybXMgbG9naWMgY2FuIHJlY29nbml6ZSBidWlsdC1pbiBDVkFzIGFuZCB0cmVhdCBjdXN0b21cbiAqIG9uZXMgd2l0aCBoaWdoZXIgcHJpb3JpdHkgKHdoZW4gYm90aCBidWlsdC1pbiBhbmQgY3VzdG9tIENWQXMgYXJlIHByZXNlbnQpLlxuICpcbiAqIE5vdGU6IHRoaXMgaXMgYW4gKmludGVybmFsLW9ubHkqIGNsYXNzIGFuZCBzaG91bGQgbm90IGJlIGV4dGVuZGVkIG9yIHVzZWQgZGlyZWN0bHkgaW5cbiAqIGFwcGxpY2F0aW9ucyBjb2RlLlxuICovXG5jbGFzcyBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCYXNlQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3IsIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZVxuICAgICAgICB9XSB9KTtcbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3IgZm9ybSBjb250cm9scy5cbiAqXG4gKiBTZWUgYERlZmF1bHRWYWx1ZUFjY2Vzc29yYCBmb3IgaG93IHRvIGltcGxlbWVudCBvbmUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jb25zdCBOR19WQUxVRV9BQ0NFU1NPUiA9IG5ldyBJbmplY3Rpb25Ub2tlbihuZ0Rldk1vZGUgPyAnTmdWYWx1ZUFjY2Vzc29yJyA6ICcnKTtcblxuY29uc3QgQ0hFQ0tCT1hfVkFMVUVfQUNDRVNTT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvciksXG4gICAgbXVsdGk6IHRydWUsXG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyBhIHZhbHVlIGFuZCBsaXN0ZW5pbmcgdG8gY2hhbmdlcyBvbiBhIGNoZWNrYm94IGlucHV0XG4gKiBlbGVtZW50LlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIGEgY2hlY2tib3ggd2l0aCBhIHJlYWN0aXZlIGZvcm0uXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgYSBjaGVja2JveCB3aXRoIGEgcmVhY3RpdmUgZm9ybS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgcmVtZW1iZXJMb2dpbkNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAqIGBgYFxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIFtmb3JtQ29udHJvbF09XCJyZW1lbWJlckxvZ2luQ29udHJvbFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBcImNoZWNrZWRcIiBwcm9wZXJ0eSBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ2NoZWNrZWQnLCB2YWx1ZSk7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3Nvciwgc2VsZWN0b3I6IFwiaW5wdXRbdHlwZT1jaGVja2JveF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1jaGVja2JveF1bbmdNb2RlbF1cIiwgaG9zdDogeyBsaXN0ZW5lcnM6IHsgXCJjaGFuZ2VcIjogXCJvbkNoYW5nZSgkZXZlbnQudGFyZ2V0LmNoZWNrZWQpXCIsIFwiYmx1clwiOiBcIm9uVG91Y2hlZCgpXCIgfSB9LCBwcm92aWRlcnM6IFtDSEVDS0JPWF9WQUxVRV9BQ0NFU1NPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9Y2hlY2tib3hdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1jaGVja2JveF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9Y2hlY2tib3hdW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogeyAnKGNoYW5nZSknOiAnb25DaGFuZ2UoJGV2ZW50LnRhcmdldC5jaGVja2VkKScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW0NIRUNLQk9YX1ZBTFVFX0FDQ0VTU09SXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dIH0pO1xuXG5jb25zdCBERUZBVUxUX1ZBTFVFX0FDQ0VTU09SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERlZmF1bHRWYWx1ZUFjY2Vzc29yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbi8qKlxuICogV2UgbXVzdCBjaGVjayB3aGV0aGVyIHRoZSBhZ2VudCBpcyBBbmRyb2lkIGJlY2F1c2UgY29tcG9zaXRpb24gZXZlbnRzXG4gKiBiZWhhdmUgZGlmZmVyZW50bHkgYmV0d2VlbiBpT1MgYW5kIEFuZHJvaWQuXG4gKi9cbmZ1bmN0aW9uIF9pc0FuZHJvaWQoKSB7XG4gICAgY29uc3QgdXNlckFnZW50ID0gybVnZXRET00oKSA/IMm1Z2V0RE9NKCkuZ2V0VXNlckFnZW50KCkgOiAnJztcbiAgICByZXR1cm4gL2FuZHJvaWQgKFxcZCspLy50ZXN0KHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlIHRoaXMgdG9rZW4gdG8gY29udHJvbCBpZiBmb3JtIGRpcmVjdGl2ZXMgYnVmZmVyIElNRSBpbnB1dCB1bnRpbFxuICogdGhlIFwiY29tcG9zaXRpb25lbmRcIiBldmVudCBvY2N1cnMuXG4gKiBAcHVibGljQXBpXG4gKi9cbmNvbnN0IENPTVBPU0lUSU9OX0JVRkZFUl9NT0RFID0gbmV3IEluamVjdGlvblRva2VuKG5nRGV2TW9kZSA/ICdDb21wb3NpdGlvbkV2ZW50TW9kZScgOiAnJyk7XG4vKipcbiAqIFRoZSBkZWZhdWx0IGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIHdyaXRpbmcgYSB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIGNoYW5nZXMgb24gaW5wdXRcbiAqIGVsZW1lbnRzLiBUaGUgYWNjZXNzb3IgaXMgdXNlZCBieSB0aGUgYEZvcm1Db250cm9sRGlyZWN0aXZlYCwgYEZvcm1Db250cm9sTmFtZWAsIGFuZFxuICogYE5nTW9kZWxgIGRpcmVjdGl2ZXMuXG4gKlxuICoge0BzZWFyY2hLZXl3b3JkcyBuZ0RlZmF1bHRDb250cm9sfVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGFjY2Vzc29yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgYW4gaW5wdXQgZWxlbWVudCB0aGF0IGFjdGl2YXRlcyB0aGUgZGVmYXVsdCB2YWx1ZSBhY2Nlc3NvclxuICogKGluIHRoaXMgY2FzZSwgYSB0ZXh0IGZpZWxkKS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgZmlyc3ROYW1lQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogYGBgXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cInRleHRcIiBbZm9ybUNvbnRyb2xdPVwiZmlyc3ROYW1lQ29udHJvbFwiPlxuICogYGBgXG4gKlxuICogVGhpcyB2YWx1ZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IGRlZmF1bHQgZm9yIGA8aW5wdXQgdHlwZT1cInRleHRcIj5gIGFuZCBgPHRleHRhcmVhPmAgZWxlbWVudHMsIGJ1dFxuICogeW91IGNvdWxkIGFsc28gdXNlIGl0IGZvciBjdXN0b20gY29tcG9uZW50cyB0aGF0IGhhdmUgc2ltaWxhciBiZWhhdmlvciBhbmQgZG8gbm90IHJlcXVpcmUgc3BlY2lhbFxuICogcHJvY2Vzc2luZy4gSW4gb3JkZXIgdG8gYXR0YWNoIHRoZSBkZWZhdWx0IHZhbHVlIGFjY2Vzc29yIHRvIGEgY3VzdG9tIGVsZW1lbnQsIGFkZCB0aGVcbiAqIGBuZ0RlZmF1bHRDb250cm9sYCBhdHRyaWJ1dGUgYXMgc2hvd24gYmVsb3cuXG4gKlxuICogYGBgXG4gKiA8Y3VzdG9tLWlucHV0LWNvbXBvbmVudCBuZ0RlZmF1bHRDb250cm9sIFsobmdNb2RlbCldPVwidmFsdWVcIj48L2N1c3RvbS1pbnB1dC1jb21wb25lbnQ+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIERlZmF1bHRWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlciwgZWxlbWVudFJlZiwgX2NvbXBvc2l0aW9uTW9kZSkge1xuICAgICAgICBzdXBlcihyZW5kZXJlciwgZWxlbWVudFJlZik7XG4gICAgICAgIHRoaXMuX2NvbXBvc2l0aW9uTW9kZSA9IF9jb21wb3NpdGlvbk1vZGU7XG4gICAgICAgIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGlzIGNyZWF0aW5nIGEgY29tcG9zaXRpb24gc3RyaW5nIChJTUUgZXZlbnRzKS4gKi9cbiAgICAgICAgdGhpcy5fY29tcG9zaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlID0gIV9pc0FuZHJvaWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBcInZhbHVlXCIgcHJvcGVydHkgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eSgndmFsdWUnLCBub3JtYWxpemVkVmFsdWUpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2hhbmRsZUlucHV0KHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5fY29tcG9zaXRpb25Nb2RlIHx8ICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgJiYgIXRoaXMuX2NvbXBvc2luZykpIHtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfY29tcG9zaXRpb25TdGFydCgpIHtcbiAgICAgICAgdGhpcy5fY29tcG9zaW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9jb21wb3NpdGlvbkVuZCh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9jb21wb3NpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlICYmIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBEZWZhdWx0VmFsdWVBY2Nlc3NvciwgZGVwczogW3sgdG9rZW46IGkwLlJlbmRlcmVyMiB9LCB7IHRva2VuOiBpMC5FbGVtZW50UmVmIH0sIHsgdG9rZW46IENPTVBPU0lUSU9OX0JVRkZFUl9NT0RFLCBvcHRpb25hbDogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBEZWZhdWx0VmFsdWVBY2Nlc3Nvciwgc2VsZWN0b3I6IFwiaW5wdXQ6bm90KFt0eXBlPWNoZWNrYm94XSlbZm9ybUNvbnRyb2xOYW1lXSx0ZXh0YXJlYVtmb3JtQ29udHJvbE5hbWVdLGlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW2Zvcm1Db250cm9sXSx0ZXh0YXJlYVtmb3JtQ29udHJvbF0saW5wdXQ6bm90KFt0eXBlPWNoZWNrYm94XSlbbmdNb2RlbF0sdGV4dGFyZWFbbmdNb2RlbF0sW25nRGVmYXVsdENvbnRyb2xdXCIsIGhvc3Q6IHsgbGlzdGVuZXJzOiB7IFwiaW5wdXRcIjogXCIkYW55KHRoaXMpLl9oYW5kbGVJbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKVwiLCBcImJsdXJcIjogXCJvblRvdWNoZWQoKVwiLCBcImNvbXBvc2l0aW9uc3RhcnRcIjogXCIkYW55KHRoaXMpLl9jb21wb3NpdGlvblN0YXJ0KClcIiwgXCJjb21wb3NpdGlvbmVuZFwiOiBcIiRhbnkodGhpcykuX2NvbXBvc2l0aW9uRW5kKCRldmVudC50YXJnZXQudmFsdWUpXCIgfSB9LCBwcm92aWRlcnM6IFtERUZBVUxUX1ZBTFVFX0FDQ0VTU09SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRGVmYXVsdFZhbHVlQWNjZXNzb3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2lucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW2Zvcm1Db250cm9sTmFtZV0sdGV4dGFyZWFbZm9ybUNvbnRyb2xOYW1lXSxpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKVtmb3JtQ29udHJvbF0sdGV4dGFyZWFbZm9ybUNvbnRyb2xdLGlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW25nTW9kZWxdLHRleHRhcmVhW25nTW9kZWxdLFtuZ0RlZmF1bHRDb250cm9sXScsXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IHZzYXZraW4gcmVwbGFjZSB0aGUgYWJvdmUgc2VsZWN0b3Igd2l0aCB0aGUgb25lIGJlbG93IGl0IG9uY2VcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzAxMSBpcyBpbXBsZW1lbnRlZFxuICAgICAgICAgICAgICAgICAgICAvLyBzZWxlY3RvcjogJ1tuZ01vZGVsXSxbZm9ybUNvbnRyb2xdLFtmb3JtQ29udHJvbE5hbWVdJyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJyhpbnB1dCknOiAnJGFueSh0aGlzKS5faGFuZGxlSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJyhibHVyKSc6ICdvblRvdWNoZWQoKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnKGNvbXBvc2l0aW9uc3RhcnQpJzogJyRhbnkodGhpcykuX2NvbXBvc2l0aW9uU3RhcnQoKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnKGNvbXBvc2l0aW9uZW5kKSc6ICckYW55KHRoaXMpLl9jb21wb3NpdGlvbkVuZCgkZXZlbnQudGFyZ2V0LnZhbHVlKSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbREVGQVVMVF9WQUxVRV9BQ0NFU1NPUl1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgY3RvclBhcmFtZXRlcnM6ICgpID0+IFt7IHR5cGU6IGkwLlJlbmRlcmVyMiB9LCB7IHR5cGU6IGkwLkVsZW1lbnRSZWYgfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtDT01QT1NJVElPTl9CVUZGRVJfTU9ERV1cbiAgICAgICAgICAgICAgICB9XSB9XSB9KTtcblxuZnVuY3Rpb24gaXNFbXB0eUlucHV0VmFsdWUodmFsdWUpIHtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgb2JqZWN0IGlzIGEgc3RyaW5nIG9yIGFycmF5IGJlZm9yZSBldmFsdWF0aW5nIHRoZSBsZW5ndGggYXR0cmlidXRlLlxuICAgICAqIFRoaXMgYXZvaWRzIGZhbHNlbHkgcmVqZWN0aW5nIG9iamVjdHMgdGhhdCBjb250YWluIGEgY3VzdG9tIGxlbmd0aCBhdHRyaWJ1dGUuXG4gICAgICogRm9yIGV4YW1wbGUsIHRoZSBvYmplY3Qge2lkOiAxLCBsZW5ndGg6IDAsIHdpZHRoOiAwfSBzaG91bGQgbm90IGJlIHJldHVybmVkIGFzIGVtcHR5LlxuICAgICAqL1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsIHx8XG4gICAgICAgICgodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKTtcbn1cbmZ1bmN0aW9uIGhhc1ZhbGlkTGVuZ3RoKHZhbHVlKSB7XG4gICAgLy8gbm9uLXN0cmljdCBjb21wYXJpc29uIGlzIGludGVudGlvbmFsLCB0byBjaGVjayBmb3IgYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgIHZhbHVlc1xuICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGBJbmplY3Rpb25Ub2tlbmAgZm9yIHJlZ2lzdGVyaW5nIGFkZGl0aW9uYWwgc3luY2hyb25vdXMgdmFsaWRhdG9ycyB1c2VkIHdpdGhcbiAqIGBBYnN0cmFjdENvbnRyb2xgcy5cbiAqXG4gKiBAc2VlIHtAbGluayBOR19BU1lOQ19WQUxJREFUT1JTfVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGluZyBhIGN1c3RvbSB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmVnaXN0ZXJzIGEgY3VzdG9tIHZhbGlkYXRvciBkaXJlY3RpdmUuIEFkZGluZyB0aGUgdmFsaWRhdG9yIHRvIHRoZVxuICogZXhpc3RpbmcgY29sbGVjdGlvbiBvZiB2YWxpZGF0b3JzIHJlcXVpcmVzIHRoZSBgbXVsdGk6IHRydWVgIG9wdGlvbi5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICogICAgIHJldHVybiB7ICdjdXN0b20nOiB0cnVlIH07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY29uc3QgTkdfVkFMSURBVE9SUyA9IG5ldyBJbmplY3Rpb25Ub2tlbihuZ0Rldk1vZGUgPyAnTmdWYWxpZGF0b3JzJyA6ICcnKTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBbiBgSW5qZWN0aW9uVG9rZW5gIGZvciByZWdpc3RlcmluZyBhZGRpdGlvbmFsIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHVzZWQgd2l0aFxuICogYEFic3RyYWN0Q29udHJvbGBzLlxuICpcbiAqIEBzZWUge0BsaW5rIE5HX1ZBTElEQVRPUlN9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkZSBhIGN1c3RvbSBhc3luYyB2YWxpZGF0b3IgZGlyZWN0aXZlXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGltcGxlbWVudHMgdGhlIGBBc3luY1ZhbGlkYXRvcmAgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhblxuICogYXN5bmMgdmFsaWRhdG9yIGRpcmVjdGl2ZSB3aXRoIGEgY3VzdG9tIGVycm9yIGtleS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tQXN5bmNWYWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX0FTWU5DX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21Bc3luY1ZhbGlkYXRvckRpcmVjdGl2ZSwgbXVsdGk6XG4gKiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21Bc3luY1ZhbGlkYXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFzeW5jVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogUHJvbWlzZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+IHtcbiAqICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsnY3VzdG9tJzogdHJ1ZX0pO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNvbnN0IE5HX0FTWU5DX1ZBTElEQVRPUlMgPSBuZXcgSW5qZWN0aW9uVG9rZW4obmdEZXZNb2RlID8gJ05nQXN5bmNWYWxpZGF0b3JzJyA6ICcnKTtcbi8qKlxuICogQSByZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBtYXRjaGVzIHZhbGlkIGUtbWFpbCBhZGRyZXNzZXMuXG4gKlxuICogQXQgYSBoaWdoIGxldmVsLCB0aGlzIHJlZ2V4cCBtYXRjaGVzIGUtbWFpbCBhZGRyZXNzZXMgb2YgdGhlIGZvcm1hdCBgbG9jYWwtcGFydEB0bGRgLCB3aGVyZTpcbiAqIC0gYGxvY2FsLXBhcnRgIGNvbnNpc3RzIG9mIG9uZSBvciBtb3JlIG9mIHRoZSBhbGxvd2VkIGNoYXJhY3RlcnMgKGFscGhhbnVtZXJpYyBhbmQgc29tZVxuICogICBwdW5jdHVhdGlvbiBzeW1ib2xzKS5cbiAqIC0gYGxvY2FsLXBhcnRgIGNhbm5vdCBiZWdpbiBvciBlbmQgd2l0aCBhIHBlcmlvZCAoYC5gKS5cbiAqIC0gYGxvY2FsLXBhcnRgIGNhbm5vdCBiZSBsb25nZXIgdGhhbiA2NCBjaGFyYWN0ZXJzLlxuICogLSBgdGxkYCBjb25zaXN0cyBvZiBvbmUgb3IgbW9yZSBgbGFiZWxzYCBzZXBhcmF0ZWQgYnkgcGVyaW9kcyAoYC5gKS4gRm9yIGV4YW1wbGUgYGxvY2FsaG9zdGAgb3JcbiAqICAgYGZvby5jb21gLlxuICogLSBBIGBsYWJlbGAgY29uc2lzdHMgb2Ygb25lIG9yIG1vcmUgb2YgdGhlIGFsbG93ZWQgY2hhcmFjdGVycyAoYWxwaGFudW1lcmljLCBkYXNoZXMgKGAtYCkgYW5kXG4gKiAgIHBlcmlvZHMgKGAuYCkpLlxuICogLSBBIGBsYWJlbGAgY2Fubm90IGJlZ2luIG9yIGVuZCB3aXRoIGEgZGFzaCAoYC1gKSBvciBhIHBlcmlvZCAoYC5gKS5cbiAqIC0gQSBgbGFiZWxgIGNhbm5vdCBiZSBsb25nZXIgdGhhbiA2MyBjaGFyYWN0ZXJzLlxuICogLSBUaGUgd2hvbGUgYWRkcmVzcyBjYW5ub3QgYmUgbG9uZ2VyIHRoYW4gMjU0IGNoYXJhY3RlcnMuXG4gKlxuICogIyMgSW1wbGVtZW50YXRpb24gYmFja2dyb3VuZFxuICpcbiAqIFRoaXMgcmVnZXhwIHdhcyBwb3J0ZWQgb3ZlciBmcm9tIEFuZ3VsYXJKUyAoc2VlIHRoZXJlIGZvciBnaXQgaGlzdG9yeSk6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvYzEzM2VmODM2L3NyYy9uZy9kaXJlY3RpdmUvaW5wdXQuanMjTDI3XG4gKiBJdCBpcyBiYXNlZCBvbiB0aGVcbiAqIFtXSEFUV0cgdmVyc2lvbl0oaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5wdXQuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzcykgd2l0aFxuICogc29tZSBlbmhhbmNlbWVudHMgdG8gaW5jb3Jwb3JhdGUgbW9yZSBSRkMgcnVsZXMgKHN1Y2ggYXMgcnVsZXMgcmVsYXRlZCB0byBkb21haW4gbmFtZXMgYW5kIHRoZVxuICogbGVuZ3RocyBvZiBkaWZmZXJlbnQgcGFydHMgb2YgdGhlIGFkZHJlc3MpLiBUaGUgbWFpbiBkaWZmZXJlbmNlcyBmcm9tIHRoZSBXSEFUV0cgdmVyc2lvbiBhcmU6XG4gKiAgIC0gRGlzYWxsb3cgYGxvY2FsLXBhcnRgIHRvIGJlZ2luIG9yIGVuZCB3aXRoIGEgcGVyaW9kIChgLmApLlxuICogICAtIERpc2FsbG93IGBsb2NhbC1wYXJ0YCBsZW5ndGggdG8gZXhjZWVkIDY0IGNoYXJhY3RlcnMuXG4gKiAgIC0gRGlzYWxsb3cgdG90YWwgYWRkcmVzcyBsZW5ndGggdG8gZXhjZWVkIDI1NCBjaGFyYWN0ZXJzLlxuICpcbiAqIFNlZSBbdGhpcyBjb21taXRdKGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvY29tbWl0L2YzZjVjZjcyZSkgZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xuY29uc3QgRU1BSUxfUkVHRVhQID0gL14oPz0uezEsMjU0fSQpKD89LnsxLDY0fUApW2EtekEtWjAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXpBLVowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkBbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVzIGEgc2V0IG9mIGJ1aWx0LWluIHZhbGlkYXRvcnMgdGhhdCBjYW4gYmUgdXNlZCBieSBmb3JtIGNvbnRyb2xzLlxuICpcbiAqIEEgdmFsaWRhdG9yIGlzIGEgZnVuY3Rpb24gdGhhdCBwcm9jZXNzZXMgYSBgRm9ybUNvbnRyb2xgIG9yIGNvbGxlY3Rpb24gb2ZcbiAqIGNvbnRyb2xzIGFuZCByZXR1cm5zIGFuIGVycm9yIG1hcCBvciBudWxsLiBBIG51bGwgbWFwIG1lYW5zIHRoYXQgdmFsaWRhdGlvbiBoYXMgcGFzc2VkLlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oL2d1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIFZhbGlkYXRvcnMge1xuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwcm92aWRlZCBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqXG4gICAgICogIyMjIFZhbGlkYXRlIGFnYWluc3QgYSBtaW5pbXVtIG9mIDNcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKDIsIFZhbGlkYXRvcnMubWluKDMpKTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge21pbjoge21pbjogMywgYWN0dWFsOiAyfX1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICAgKiBgbWluYCBwcm9wZXJ0eSBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICAgKlxuICAgICAqL1xuICAgIHN0YXRpYyBtaW4obWluKSB7XG4gICAgICAgIHJldHVybiBtaW5WYWxpZGF0b3IobWluKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIG51bWJlci5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgVmFsaWRhdGUgYWdhaW5zdCBhIG1heGltdW0gb2YgMTVcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKDE2LCBWYWxpZGF0b3JzLm1heCgxNSkpO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7bWF4OiB7bWF4OiAxNSwgYWN0dWFsOiAxNn19XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIHZhbGlkYXRvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZXJyb3IgbWFwIHdpdGggdGhlXG4gICAgICogYG1heGAgcHJvcGVydHkgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCl9XG4gICAgICpcbiAgICAgKi9cbiAgICBzdGF0aWMgbWF4KG1heCkge1xuICAgICAgICByZXR1cm4gbWF4VmFsaWRhdG9yKG1heCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sIGhhdmUgYSBub24tZW1wdHkgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqXG4gICAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIGlzIG5vbi1lbXB0eVxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7cmVxdWlyZWQ6IHRydWV9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBtYXAgd2l0aCB0aGUgYHJlcXVpcmVkYCBwcm9wZXJ0eVxuICAgICAqIGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIHJlcXVpcmVkKGNvbnRyb2wpIHtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmVkVmFsaWRhdG9yKGNvbnRyb2wpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIGJlIHRydWUuIFRoaXMgdmFsaWRhdG9yIGlzIGNvbW1vbmx5XG4gICAgICogdXNlZCBmb3IgcmVxdWlyZWQgY2hlY2tib3hlcy5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgdmFsdWUgaXMgdHJ1ZVxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ3NvbWUgdmFsdWUnLCBWYWxpZGF0b3JzLnJlcXVpcmVkVHJ1ZSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtyZXF1aXJlZDogdHJ1ZX1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEFuIGVycm9yIG1hcCB0aGF0IGNvbnRhaW5zIHRoZSBgcmVxdWlyZWRgIHByb3BlcnR5XG4gICAgICogc2V0IHRvIGB0cnVlYCBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICAgKlxuICAgICAqL1xuICAgIHN0YXRpYyByZXF1aXJlZFRydWUoY29udHJvbCkge1xuICAgICAgICByZXR1cm4gcmVxdWlyZWRUcnVlVmFsaWRhdG9yKGNvbnRyb2wpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHBhc3MgYW4gZW1haWwgdmFsaWRhdGlvbiB0ZXN0LlxuICAgICAqXG4gICAgICogVGVzdHMgdGhlIHZhbHVlIHVzaW5nIGEgW3JlZ3VsYXJcbiAgICAgKiBleHByZXNzaW9uXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L0d1aWRlL1JlZ3VsYXJfRXhwcmVzc2lvbnMpXG4gICAgICogcGF0dGVybiBzdWl0YWJsZSBmb3IgY29tbW9uIHVzZSBjYXNlcy4gVGhlIHBhdHRlcm4gaXMgYmFzZWQgb24gdGhlIGRlZmluaXRpb24gb2YgYSB2YWxpZCBlbWFpbFxuICAgICAqIGFkZHJlc3MgaW4gdGhlIFtXSEFUV0cgSFRNTFxuICAgICAqIHNwZWNpZmljYXRpb25dKGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2lucHV0Lmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3MpIHdpdGhcbiAgICAgKiBzb21lIGVuaGFuY2VtZW50cyB0byBpbmNvcnBvcmF0ZSBtb3JlIFJGQyBydWxlcyAoc3VjaCBhcyBydWxlcyByZWxhdGVkIHRvIGRvbWFpbiBuYW1lcyBhbmQgdGhlXG4gICAgICogbGVuZ3RocyBvZiBkaWZmZXJlbnQgcGFydHMgb2YgdGhlIGFkZHJlc3MpLlxuICAgICAqXG4gICAgICogVGhlIGRpZmZlcmVuY2VzIGZyb20gdGhlIFdIQVRXRyB2ZXJzaW9uIGluY2x1ZGU6XG4gICAgICogLSBEaXNhbGxvdyBgbG9jYWwtcGFydGAgKHRoZSBwYXJ0IGJlZm9yZSB0aGUgYEBgIHN5bWJvbCkgdG8gYmVnaW4gb3IgZW5kIHdpdGggYSBwZXJpb2QgKGAuYCkuXG4gICAgICogLSBEaXNhbGxvdyBgbG9jYWwtcGFydGAgdG8gYmUgbG9uZ2VyIHRoYW4gNjQgY2hhcmFjdGVycy5cbiAgICAgKiAtIERpc2FsbG93IHRoZSB3aG9sZSBhZGRyZXNzIHRvIGJlIGxvbmdlciB0aGFuIDI1NCBjaGFyYWN0ZXJzLlxuICAgICAqXG4gICAgICogSWYgdGhpcyBwYXR0ZXJuIGRvZXMgbm90IHNhdGlzZnkgeW91ciBidXNpbmVzcyBuZWVkcywgeW91IGNhbiB1c2UgYFZhbGlkYXRvcnMucGF0dGVybigpYCB0b1xuICAgICAqIHZhbGlkYXRlIHRoZSB2YWx1ZSBhZ2FpbnN0IGEgZGlmZmVyZW50IHBhdHRlcm4uXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqXG4gICAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIG1hdGNoZXMgYSB2YWxpZCBlbWFpbCBwYXR0ZXJuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnYmFkQCcsIFZhbGlkYXRvcnMuZW1haWwpO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7ZW1haWw6IHRydWV9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBtYXAgd2l0aCB0aGUgYGVtYWlsYCBwcm9wZXJ0eVxuICAgICAqIGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIGVtYWlsKGNvbnRyb2wpIHtcbiAgICAgICAgcmV0dXJuIGVtYWlsVmFsaWRhdG9yKGNvbnRyb2wpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgbGVuZ3RoIG9mIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsXG4gICAgICogdG8gdGhlIHByb3ZpZGVkIG1pbmltdW0gbGVuZ3RoLiBUaGlzIHZhbGlkYXRvciBpcyBhbHNvIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaWYgeW91IHVzZSB0aGVcbiAgICAgKiB0aGUgSFRNTDUgYG1pbmxlbmd0aGAgYXR0cmlidXRlLiBOb3RlIHRoYXQgdGhlIGBtaW5MZW5ndGhgIHZhbGlkYXRvciBpcyBpbnRlbmRlZCB0byBiZSB1c2VkXG4gICAgICogb25seSBmb3IgdHlwZXMgdGhhdCBoYXZlIGEgbnVtZXJpYyBgbGVuZ3RoYCBwcm9wZXJ0eSwgc3VjaCBhcyBzdHJpbmdzIG9yIGFycmF5cy4gVGhlXG4gICAgICogYG1pbkxlbmd0aGAgdmFsaWRhdG9yIGxvZ2ljIGlzIGFsc28gbm90IGludm9rZWQgZm9yIHZhbHVlcyB3aGVuIHRoZWlyIGBsZW5ndGhgIHByb3BlcnR5IGlzIDBcbiAgICAgKiAoZm9yIGV4YW1wbGUgaW4gY2FzZSBvZiBhbiBlbXB0eSBzdHJpbmcgb3IgYW4gZW1wdHkgYXJyYXkpLCB0byBzdXBwb3J0IG9wdGlvbmFsIGNvbnRyb2xzLiBZb3VcbiAgICAgKiBjYW4gdXNlIHRoZSBzdGFuZGFyZCBgcmVxdWlyZWRgIHZhbGlkYXRvciBpZiBlbXB0eSB2YWx1ZXMgc2hvdWxkIG5vdCBiZSBjb25zaWRlcmVkIHZhbGlkLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKlxuICAgICAqICMjIyBWYWxpZGF0ZSB0aGF0IHRoZSBmaWVsZCBoYXMgYSBtaW5pbXVtIG9mIDMgY2hhcmFjdGVyc1xuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ25nJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMykpO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7bWlubGVuZ3RoOiB7cmVxdWlyZWRMZW5ndGg6IDMsIGFjdHVhbExlbmd0aDogMn19XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlucHV0IG1pbmxlbmd0aD1cIjVcIj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICAgKiBgbWlubGVuZ3RoYCBwcm9wZXJ0eSBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICAgKlxuICAgICAqL1xuICAgIHN0YXRpYyBtaW5MZW5ndGgobWluTGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBtaW5MZW5ndGhWYWxpZGF0b3IobWluTGVuZ3RoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGxlbmd0aCBvZiB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGxlc3MgdGhhbiBvciBlcXVhbFxuICAgICAqIHRvIHRoZSBwcm92aWRlZCBtYXhpbXVtIGxlbmd0aC4gVGhpcyB2YWxpZGF0b3IgaXMgYWxzbyBwcm92aWRlZCBieSBkZWZhdWx0IGlmIHlvdSB1c2UgdGhlXG4gICAgICogdGhlIEhUTUw1IGBtYXhsZW5ndGhgIGF0dHJpYnV0ZS4gTm90ZSB0aGF0IHRoZSBgbWF4TGVuZ3RoYCB2YWxpZGF0b3IgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZFxuICAgICAqIG9ubHkgZm9yIHR5cGVzIHRoYXQgaGF2ZSBhIG51bWVyaWMgYGxlbmd0aGAgcHJvcGVydHksIHN1Y2ggYXMgc3RyaW5ncyBvciBhcnJheXMuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqXG4gICAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIGhhcyBtYXhpbXVtIG9mIDUgY2hhcmFjdGVyc1xuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ0FuZ3VsYXInLCBWYWxpZGF0b3JzLm1heExlbmd0aCg1KSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHttYXhsZW5ndGg6IHtyZXF1aXJlZExlbmd0aDogNSwgYWN0dWFsTGVuZ3RoOiA3fX1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aW5wdXQgbWF4bGVuZ3RoPVwiNVwiPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgICAqIGBtYXhsZW5ndGhgIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIG1heExlbmd0aChtYXhMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1heExlbmd0aFZhbGlkYXRvcihtYXhMZW5ndGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIG1hdGNoIGEgcmVnZXggcGF0dGVybi4gVGhpcyB2YWxpZGF0b3IgaXMgYWxzb1xuICAgICAqIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaWYgeW91IHVzZSB0aGUgSFRNTDUgYHBhdHRlcm5gIGF0dHJpYnV0ZS5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgb25seSBjb250YWlucyBsZXR0ZXJzIG9yIHNwYWNlc1xuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJzEnLCBWYWxpZGF0b3JzLnBhdHRlcm4oJ1thLXpBLVogXSonKSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtwYXR0ZXJuOiB7cmVxdWlyZWRQYXR0ZXJuOiAnXlthLXpBLVogXSokJywgYWN0dWFsVmFsdWU6ICcxJ319XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlucHV0IHBhdHRlcm49XCJbYS16QS1aIF0qXCI+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiAjIyMgUGF0dGVybiBtYXRjaGluZyB3aXRoIHRoZSBnbG9iYWwgb3Igc3RpY2t5IGZsYWdcbiAgICAgKlxuICAgICAqIGBSZWdFeHBgIG9iamVjdHMgY3JlYXRlZCB3aXRoIHRoZSBgZ2Agb3IgYHlgIGZsYWdzIHRoYXQgYXJlIHBhc3NlZCBpbnRvIGBWYWxpZGF0b3JzLnBhdHRlcm5gXG4gICAgICogY2FuIHByb2R1Y2UgZGlmZmVyZW50IHJlc3VsdHMgb24gdGhlIHNhbWUgaW5wdXQgd2hlbiB2YWxpZGF0aW9ucyBhcmUgcnVuIGNvbnNlY3V0aXZlbHkuIFRoaXMgaXNcbiAgICAgKiBkdWUgdG8gaG93IHRoZSBiZWhhdmlvciBvZiBgUmVnRXhwLnByb3RvdHlwZS50ZXN0YCBpc1xuICAgICAqIHNwZWNpZmllZCBpbiBbRUNNQS0yNjJdKGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcmVnZXhwYnVpbHRpbmV4ZWMpXG4gICAgICogKGBSZWdFeHBgIHByZXNlcnZlcyB0aGUgaW5kZXggb2YgdGhlIGxhc3QgbWF0Y2ggd2hlbiB0aGUgZ2xvYmFsIG9yIHN0aWNreSBmbGFnIGlzIHVzZWQpLlxuICAgICAqIER1ZSB0byB0aGlzIGJlaGF2aW9yLCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHdoZW4gdXNpbmdcbiAgICAgKiBgVmFsaWRhdG9ycy5wYXR0ZXJuYCB5b3UgKipkbyBub3QqKiBwYXNzIGluIGEgYFJlZ0V4cGAgb2JqZWN0IHdpdGggZWl0aGVyIHRoZSBnbG9iYWwgb3Igc3RpY2t5XG4gICAgICogZmxhZyBlbmFibGVkLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIE5vdCByZWNvbW1lbmRlZCAoc2luY2UgdGhlIGBnYCBmbGFnIGlzIHVzZWQpXG4gICAgICogY29uc3QgY29udHJvbE9uZSA9IG5ldyBGb3JtQ29udHJvbCgnMScsIFZhbGlkYXRvcnMucGF0dGVybigvZm9vL2cpKTtcbiAgICAgKlxuICAgICAqIC8vIEdvb2RcbiAgICAgKiBjb25zdCBjb250cm9sVHdvID0gbmV3IEZvcm1Db250cm9sKCcxJywgVmFsaWRhdG9ycy5wYXR0ZXJuKC9mb28vKSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGF0dGVybiBBIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBiZSB1c2VkIGFzIGlzIHRvIHRlc3QgdGhlIHZhbHVlcywgb3IgYSBzdHJpbmcuXG4gICAgICogSWYgYSBzdHJpbmcgaXMgcGFzc2VkLCB0aGUgYF5gIGNoYXJhY3RlciBpcyBwcmVwZW5kZWQgYW5kIHRoZSBgJGAgY2hhcmFjdGVyIGlzXG4gICAgICogYXBwZW5kZWQgdG8gdGhlIHByb3ZpZGVkIHN0cmluZyAoaWYgbm90IGFscmVhZHkgcHJlc2VudCksIGFuZCB0aGUgcmVzdWx0aW5nIHJlZ3VsYXJcbiAgICAgKiBleHByZXNzaW9uIGlzIHVzZWQgdG8gdGVzdCB0aGUgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgICAqIGBwYXR0ZXJuYCBwcm9wZXJ0eSBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICAgKlxuICAgICAqL1xuICAgIHN0YXRpYyBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIHBhdHRlcm5WYWxpZGF0b3IocGF0dGVybik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFZhbGlkYXRvciB0aGF0IHBlcmZvcm1zIG5vIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICAgKlxuICAgICAqL1xuICAgIHN0YXRpYyBudWxsVmFsaWRhdG9yKGNvbnRyb2wpIHtcbiAgICAgICAgcmV0dXJuIG51bGxWYWxpZGF0b3IoY29udHJvbCk7XG4gICAgfVxuICAgIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnMpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2UodmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENvbXBvc2UgbXVsdGlwbGUgYXN5bmMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdW5pb25cbiAgICAgKiBvZiB0aGUgaW5kaXZpZHVhbCBlcnJvciBvYmplY3RzIGZvciB0aGUgcHJvdmlkZWQgY29udHJvbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICAgKiBtZXJnZWQgZXJyb3Igb2JqZWN0cyBvZiB0aGUgYXN5bmMgdmFsaWRhdG9ycyBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICAgKlxuICAgICAqL1xuICAgIHN0YXRpYyBjb21wb3NlQXN5bmModmFsaWRhdG9ycykge1xuICAgICAgICByZXR1cm4gY29tcG9zZUFzeW5jKHZhbGlkYXRvcnMpO1xuICAgIH1cbn1cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIG51bWJlci5cbiAqIFNlZSBgVmFsaWRhdG9ycy5taW5gIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBtaW5WYWxpZGF0b3IobWluKSB7XG4gICAgcmV0dXJuIChjb250cm9sKSA9PiB7XG4gICAgICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSB8fCBpc0VtcHR5SW5wdXRWYWx1ZShtaW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRyb2wudmFsdWUpO1xuICAgICAgICAvLyBDb250cm9scyB3aXRoIE5hTiB2YWx1ZXMgYWZ0ZXIgcGFyc2luZyBzaG91bGQgYmUgdHJlYXRlZCBhcyBub3QgaGF2aW5nIGFcbiAgICAgICAgLy8gbWluaW11bSwgcGVyIHRoZSBIVE1MIGZvcm1zIHNwZWM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWluXG4gICAgICAgIHJldHVybiAhaXNOYU4odmFsdWUpICYmIHZhbHVlIDwgbWluID8geyAnbWluJzogeyAnbWluJzogbWluLCAnYWN0dWFsJzogY29udHJvbC52YWx1ZSB9IH0gOiBudWxsO1xuICAgIH07XG59XG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwcm92aWRlZCBudW1iZXIuXG4gKiBTZWUgYFZhbGlkYXRvcnMubWF4YCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWF4VmFsaWRhdG9yKG1heCkge1xuICAgIHJldHVybiAoY29udHJvbCkgPT4ge1xuICAgICAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkgfHwgaXNFbXB0eUlucHV0VmFsdWUobWF4KSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdChjb250cm9sLnZhbHVlKTtcbiAgICAgICAgLy8gQ29udHJvbHMgd2l0aCBOYU4gdmFsdWVzIGFmdGVyIHBhcnNpbmcgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgbm90IGhhdmluZyBhXG4gICAgICAgIC8vIG1heGltdW0sIHBlciB0aGUgSFRNTCBmb3JtcyBzcGVjOiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1heFxuICAgICAgICByZXR1cm4gIWlzTmFOKHZhbHVlKSAmJiB2YWx1ZSA+IG1heCA/IHsgJ21heCc6IHsgJ21heCc6IG1heCwgJ2FjdHVhbCc6IGNvbnRyb2wudmFsdWUgfSB9IDogbnVsbDtcbiAgICB9O1xufVxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCBoYXZlIGEgbm9uLWVtcHR5IHZhbHVlLlxuICogU2VlIGBWYWxpZGF0b3JzLnJlcXVpcmVkYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gcmVxdWlyZWRWYWxpZGF0b3IoY29udHJvbCkge1xuICAgIHJldHVybiBpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSA/IHsgJ3JlcXVpcmVkJzogdHJ1ZSB9IDogbnVsbDtcbn1cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSBiZSB0cnVlLiBUaGlzIHZhbGlkYXRvciBpcyBjb21tb25seVxuICogdXNlZCBmb3IgcmVxdWlyZWQgY2hlY2tib3hlcy5cbiAqIFNlZSBgVmFsaWRhdG9ycy5yZXF1aXJlZFRydWVgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiByZXF1aXJlZFRydWVWYWxpZGF0b3IoY29udHJvbCkge1xuICAgIHJldHVybiBjb250cm9sLnZhbHVlID09PSB0cnVlID8gbnVsbCA6IHsgJ3JlcXVpcmVkJzogdHJ1ZSB9O1xufVxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHBhc3MgYW4gZW1haWwgdmFsaWRhdGlvbiB0ZXN0LlxuICogU2VlIGBWYWxpZGF0b3JzLmVtYWlsYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gZW1haWxWYWxpZGF0b3IoY29udHJvbCkge1xuICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgfVxuICAgIHJldHVybiBFTUFJTF9SRUdFWFAudGVzdChjb250cm9sLnZhbHVlKSA/IG51bGwgOiB7ICdlbWFpbCc6IHRydWUgfTtcbn1cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGxlbmd0aCBvZiB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbFxuICogdG8gdGhlIHByb3ZpZGVkIG1pbmltdW0gbGVuZ3RoLiBTZWUgYFZhbGlkYXRvcnMubWluTGVuZ3RoYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWluTGVuZ3RoVmFsaWRhdG9yKG1pbkxlbmd0aCkge1xuICAgIHJldHVybiAoY29udHJvbCkgPT4ge1xuICAgICAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkgfHwgIWhhc1ZhbGlkTGVuZ3RoKGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgICAgICAgIC8vIGRvbid0IHZhbGlkYXRlIHZhbHVlcyB3aXRob3V0IGBsZW5ndGhgIHByb3BlcnR5XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udHJvbC52YWx1ZS5sZW5ndGggPCBtaW5MZW5ndGggP1xuICAgICAgICAgICAgeyAnbWlubGVuZ3RoJzogeyAncmVxdWlyZWRMZW5ndGgnOiBtaW5MZW5ndGgsICdhY3R1YWxMZW5ndGgnOiBjb250cm9sLnZhbHVlLmxlbmd0aCB9IH0gOlxuICAgICAgICAgICAgbnVsbDtcbiAgICB9O1xufVxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgbGVuZ3RoIG9mIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIG9yIGVxdWFsXG4gKiB0byB0aGUgcHJvdmlkZWQgbWF4aW11bSBsZW5ndGguIFNlZSBgVmFsaWRhdG9ycy5tYXhMZW5ndGhgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBtYXhMZW5ndGhWYWxpZGF0b3IobWF4TGVuZ3RoKSB7XG4gICAgcmV0dXJuIChjb250cm9sKSA9PiB7XG4gICAgICAgIHJldHVybiBoYXNWYWxpZExlbmd0aChjb250cm9sLnZhbHVlKSAmJiBjb250cm9sLnZhbHVlLmxlbmd0aCA+IG1heExlbmd0aCA/XG4gICAgICAgICAgICB7ICdtYXhsZW5ndGgnOiB7ICdyZXF1aXJlZExlbmd0aCc6IG1heExlbmd0aCwgJ2FjdHVhbExlbmd0aCc6IGNvbnRyb2wudmFsdWUubGVuZ3RoIH0gfSA6XG4gICAgICAgICAgICBudWxsO1xuICAgIH07XG59XG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gbWF0Y2ggYSByZWdleCBwYXR0ZXJuLlxuICogU2VlIGBWYWxpZGF0b3JzLnBhdHRlcm5gIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBwYXR0ZXJuVmFsaWRhdG9yKHBhdHRlcm4pIHtcbiAgICBpZiAoIXBhdHRlcm4pXG4gICAgICAgIHJldHVybiBudWxsVmFsaWRhdG9yO1xuICAgIGxldCByZWdleDtcbiAgICBsZXQgcmVnZXhTdHI7XG4gICAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgICAgICByZWdleFN0ciA9ICcnO1xuICAgICAgICBpZiAocGF0dGVybi5jaGFyQXQoMCkgIT09ICdeJylcbiAgICAgICAgICAgIHJlZ2V4U3RyICs9ICdeJztcbiAgICAgICAgcmVnZXhTdHIgKz0gcGF0dGVybjtcbiAgICAgICAgaWYgKHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgIT09ICckJylcbiAgICAgICAgICAgIHJlZ2V4U3RyICs9ICckJztcbiAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4U3RyKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlZ2V4U3RyID0gcGF0dGVybi50b1N0cmluZygpO1xuICAgICAgICByZWdleCA9IHBhdHRlcm47XG4gICAgfVxuICAgIHJldHVybiAoY29udHJvbCkgPT4ge1xuICAgICAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KHZhbHVlKSA/IG51bGwgOlxuICAgICAgICAgICAgeyAncGF0dGVybic6IHsgJ3JlcXVpcmVkUGF0dGVybic6IHJlZ2V4U3RyLCAnYWN0dWFsVmFsdWUnOiB2YWx1ZSB9IH07XG4gICAgfTtcbn1cbi8qKlxuICogRnVuY3Rpb24gdGhhdCBoYXMgYFZhbGlkYXRvckZuYCBzaGFwZSwgYnV0IHBlcmZvcm1zIG5vIG9wZXJhdGlvbi5cbiAqL1xuZnVuY3Rpb24gbnVsbFZhbGlkYXRvcihjb250cm9sKSB7XG4gICAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBpc1ByZXNlbnQobykge1xuICAgIHJldHVybiBvICE9IG51bGw7XG59XG5mdW5jdGlvbiB0b09ic2VydmFibGUodmFsdWUpIHtcbiAgICBjb25zdCBvYnMgPSDJtWlzUHJvbWlzZSh2YWx1ZSkgPyBmcm9tKHZhbHVlKSA6IHZhbHVlO1xuICAgIGlmICgodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSAmJiAhKMm1aXNTdWJzY3JpYmFibGUob2JzKSkpIHtcbiAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9IGBFeHBlY3RlZCBhc3luYyB2YWxpZGF0b3IgdG8gcmV0dXJuIFByb21pc2Ugb3IgT2JzZXJ2YWJsZS5gO1xuICAgICAgICAvLyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciB3aWxsIHJldHVybiBvYmplY3Qgb3IgbnVsbC5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSArPVxuICAgICAgICAgICAgICAgICcgQXJlIHlvdSB1c2luZyBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciB3aGVyZSBhbiBhc3luYyB2YWxpZGF0b3IgaXMgZXhwZWN0ZWQ/JztcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgybVSdW50aW1lRXJyb3IoLTExMDEgLyogUnVudGltZUVycm9yQ29kZS5XUk9OR19WQUxJREFUT1JfUkVUVVJOX1RZUEUgKi8sIGVycm9yTWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBvYnM7XG59XG5mdW5jdGlvbiBtZXJnZUVycm9ycyhhcnJheU9mRXJyb3JzKSB7XG4gICAgbGV0IHJlcyA9IHt9O1xuICAgIGFycmF5T2ZFcnJvcnMuZm9yRWFjaCgoZXJyb3JzKSA9PiB7XG4gICAgICAgIHJlcyA9IGVycm9ycyAhPSBudWxsID8geyAuLi5yZXMsIC4uLmVycm9ycyB9IDogcmVzO1xuICAgIH0pO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhyZXMpLmxlbmd0aCA9PT0gMCA/IG51bGwgOiByZXM7XG59XG5mdW5jdGlvbiBleGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCB2YWxpZGF0b3JzKSB7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IoY29udHJvbCkpO1xufVxuZnVuY3Rpb24gaXNWYWxpZGF0b3JGbih2YWxpZGF0b3IpIHtcbiAgICByZXR1cm4gIXZhbGlkYXRvci52YWxpZGF0ZTtcbn1cbi8qKlxuICogR2l2ZW4gdGhlIGxpc3Qgb2YgdmFsaWRhdG9ycyB0aGF0IG1heSBjb250YWluIGJvdGggZnVuY3Rpb25zIGFzIHdlbGwgYXMgY2xhc3NlcywgcmV0dXJuIHRoZSBsaXN0XG4gKiBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zIChjb252ZXJ0IHZhbGlkYXRvciBjbGFzc2VzIGludG8gdmFsaWRhdG9yIGZ1bmN0aW9ucykuIFRoaXMgaXMgbmVlZGVkIHRvXG4gKiBoYXZlIGNvbnNpc3RlbnQgc3RydWN0dXJlIGluIHZhbGlkYXRvcnMgbGlzdCBiZWZvcmUgY29tcG9zaW5nIHRoZW0uXG4gKlxuICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIHNldCBvZiB2YWxpZGF0b3JzIHRoYXQgbWF5IGNvbnRhaW4gdmFsaWRhdG9ycyBib3RoIGluIHBsYWluIGZ1bmN0aW9uIGZvcm1cbiAqICAgICBhcyB3ZWxsIGFzIHJlcHJlc2VudGVkIGFzIGEgdmFsaWRhdG9yIGNsYXNzLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVWYWxpZGF0b3JzKHZhbGlkYXRvcnMpIHtcbiAgICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHtcbiAgICAgICAgcmV0dXJuIGlzVmFsaWRhdG9yRm4odmFsaWRhdG9yKSA/XG4gICAgICAgICAgICB2YWxpZGF0b3IgOlxuICAgICAgICAgICAgKChjKSA9PiB2YWxpZGF0b3IudmFsaWRhdGUoYykpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBNZXJnZXMgc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAqIFNlZSBgVmFsaWRhdG9ycy5jb21wb3NlYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZSh2YWxpZGF0b3JzKSB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PSAwKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNvbnRyb2wpIHtcbiAgICAgICAgcmV0dXJuIG1lcmdlRXJyb3JzKGV4ZWN1dGVWYWxpZGF0b3JzKGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKSk7XG4gICAgfTtcbn1cbi8qKlxuICogQWNjZXB0cyBhIGxpc3Qgb2YgdmFsaWRhdG9ycyBvZiBkaWZmZXJlbnQgcG9zc2libGUgc2hhcGVzIChgVmFsaWRhdG9yYCBhbmQgYFZhbGlkYXRvckZuYCksXG4gKiBub3JtYWxpemVzIHRoZSBsaXN0IChjb252ZXJ0cyBldmVyeXRoaW5nIHRvIGBWYWxpZGF0b3JGbmApIGFuZCBtZXJnZXMgdGhlbSBpbnRvIGEgc2luZ2xlXG4gKiB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VWYWxpZGF0b3JzKHZhbGlkYXRvcnMpIHtcbiAgICByZXR1cm4gdmFsaWRhdG9ycyAhPSBudWxsID8gY29tcG9zZShub3JtYWxpemVWYWxpZGF0b3JzKHZhbGlkYXRvcnMpKSA6IG51bGw7XG59XG4vKipcbiAqIE1lcmdlcyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAqIFNlZSBgVmFsaWRhdG9ycy5jb21wb3NlQXN5bmNgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBjb21wb3NlQXN5bmModmFsaWRhdG9ycykge1xuICAgIGlmICghdmFsaWRhdG9ycylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc1ByZXNlbnQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT0gMClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjb250cm9sKSB7XG4gICAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMpLm1hcCh0b09ic2VydmFibGUpO1xuICAgICAgICByZXR1cm4gZm9ya0pvaW4ob2JzZXJ2YWJsZXMpLnBpcGUobWFwKG1lcmdlRXJyb3JzKSk7XG4gICAgfTtcbn1cbi8qKlxuICogQWNjZXB0cyBhIGxpc3Qgb2YgYXN5bmMgdmFsaWRhdG9ycyBvZiBkaWZmZXJlbnQgcG9zc2libGUgc2hhcGVzIChgQXN5bmNWYWxpZGF0b3JgIGFuZFxuICogYEFzeW5jVmFsaWRhdG9yRm5gKSwgbm9ybWFsaXplcyB0aGUgbGlzdCAoY29udmVydHMgZXZlcnl0aGluZyB0byBgQXN5bmNWYWxpZGF0b3JGbmApIGFuZCBtZXJnZXNcbiAqIHRoZW0gaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgIHJldHVybiB2YWxpZGF0b3JzICE9IG51bGwgPyBjb21wb3NlQXN5bmMobm9ybWFsaXplVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSkgOlxuICAgICAgICBudWxsO1xufVxuLyoqXG4gKiBNZXJnZXMgcmF3IGNvbnRyb2wgdmFsaWRhdG9ycyB3aXRoIGEgZ2l2ZW4gZGlyZWN0aXZlIHZhbGlkYXRvciBhbmQgcmV0dXJucyB0aGUgY29tYmluZWQgbGlzdCBvZlxuICogdmFsaWRhdG9ycyBhcyBhbiBhcnJheS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VWYWxpZGF0b3JzKGNvbnRyb2xWYWxpZGF0b3JzLCBkaXJWYWxpZGF0b3IpIHtcbiAgICBpZiAoY29udHJvbFZhbGlkYXRvcnMgPT09IG51bGwpXG4gICAgICAgIHJldHVybiBbZGlyVmFsaWRhdG9yXTtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjb250cm9sVmFsaWRhdG9ycykgPyBbLi4uY29udHJvbFZhbGlkYXRvcnMsIGRpclZhbGlkYXRvcl0gOlxuICAgICAgICBbY29udHJvbFZhbGlkYXRvcnMsIGRpclZhbGlkYXRvcl07XG59XG4vKipcbiAqIFJldHJpZXZlcyB0aGUgbGlzdCBvZiByYXcgc3luY2hyb25vdXMgdmFsaWRhdG9ycyBhdHRhY2hlZCB0byBhIGdpdmVuIGNvbnRyb2wuXG4gKi9cbmZ1bmN0aW9uIGdldENvbnRyb2xWYWxpZGF0b3JzKGNvbnRyb2wpIHtcbiAgICByZXR1cm4gY29udHJvbC5fcmF3VmFsaWRhdG9ycztcbn1cbi8qKlxuICogUmV0cmlldmVzIHRoZSBsaXN0IG9mIHJhdyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBhdHRhY2hlZCB0byBhIGdpdmVuIGNvbnRyb2wuXG4gKi9cbmZ1bmN0aW9uIGdldENvbnRyb2xBc3luY1ZhbGlkYXRvcnMoY29udHJvbCkge1xuICAgIHJldHVybiBjb250cm9sLl9yYXdBc3luY1ZhbGlkYXRvcnM7XG59XG4vKipcbiAqIEFjY2VwdHMgYSBzaW5nbGV0b24gdmFsaWRhdG9yLCBhbiBhcnJheSwgb3IgbnVsbCwgYW5kIHJldHVybnMgYW4gYXJyYXkgdHlwZSB3aXRoIHRoZSBwcm92aWRlZFxuICogdmFsaWRhdG9ycy5cbiAqXG4gKiBAcGFyYW0gdmFsaWRhdG9ycyBBIHZhbGlkYXRvciwgdmFsaWRhdG9ycywgb3IgbnVsbC5cbiAqIEByZXR1cm5zIEEgdmFsaWRhdG9ycyBhcnJheS5cbiAqL1xuZnVuY3Rpb24gbWFrZVZhbGlkYXRvcnNBcnJheSh2YWxpZGF0b3JzKSB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKVxuICAgICAgICByZXR1cm4gW107XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzIDogW3ZhbGlkYXRvcnNdO1xufVxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyBhcnJheSBoYXMgYSBnaXZlbiB2YWxpZGF0b3IuXG4gKlxuICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIGNvbXBhcmUgYWdhaW5zdC5cbiAqIEBwYXJhbSB2YWxpZGF0b3IgVGhlIHZhbGlkYXRvciB0byBjaGVjay5cbiAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIHZhbGlkYXRvciBpcyBwcmVzZW50LlxuICovXG5mdW5jdGlvbiBoYXNWYWxpZGF0b3IodmFsaWRhdG9ycywgdmFsaWRhdG9yKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzLmluY2x1ZGVzKHZhbGlkYXRvcikgOiB2YWxpZGF0b3JzID09PSB2YWxpZGF0b3I7XG59XG4vKipcbiAqIENvbWJpbmVzIHR3byBhcnJheXMgb2YgdmFsaWRhdG9ycyBpbnRvIG9uZS4gSWYgZHVwbGljYXRlcyBhcmUgcHJvdmlkZWQsIG9ubHkgb25lIHdpbGwgYmUgYWRkZWQuXG4gKlxuICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIG5ldyB2YWxpZGF0b3JzLlxuICogQHBhcmFtIGN1cnJlbnRWYWxpZGF0b3JzIFRoZSBiYXNlIGFycmF5IG9mIGN1cnJlbnQgdmFsaWRhdG9ycy5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGFkZFZhbGlkYXRvcnModmFsaWRhdG9ycywgY3VycmVudFZhbGlkYXRvcnMpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gbWFrZVZhbGlkYXRvcnNBcnJheShjdXJyZW50VmFsaWRhdG9ycyk7XG4gICAgY29uc3QgdmFsaWRhdG9yc1RvQWRkID0gbWFrZVZhbGlkYXRvcnNBcnJheSh2YWxpZGF0b3JzKTtcbiAgICB2YWxpZGF0b3JzVG9BZGQuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICAvLyBOb3RlOiBpZiB0aGVyZSBhcmUgZHVwbGljYXRlIGVudHJpZXMgaW4gdGhlIG5ldyB2YWxpZGF0b3JzIGFycmF5LFxuICAgICAgICAvLyBvbmx5IHRoZSBmaXJzdCBvbmUgd291bGQgYmUgYWRkZWQgdG8gdGhlIGN1cnJlbnQgbGlzdCBvZiB2YWxpZGF0b3JzLlxuICAgICAgICAvLyBEdXBsaWNhdGUgb25lcyB3b3VsZCBiZSBpZ25vcmVkIHNpbmNlIGBoYXNWYWxpZGF0b3JgIHdvdWxkIGRldGVjdFxuICAgICAgICAvLyB0aGUgcHJlc2VuY2Ugb2YgYSB2YWxpZGF0b3IgZnVuY3Rpb24gYW5kIHdlIHVwZGF0ZSB0aGUgY3VycmVudCBsaXN0IGluIHBsYWNlLlxuICAgICAgICBpZiAoIWhhc1ZhbGlkYXRvcihjdXJyZW50LCB2KSkge1xuICAgICAgICAgICAgY3VycmVudC5wdXNoKHYpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGN1cnJlbnQ7XG59XG5mdW5jdGlvbiByZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIGN1cnJlbnRWYWxpZGF0b3JzKSB7XG4gICAgcmV0dXJuIG1ha2VWYWxpZGF0b3JzQXJyYXkoY3VycmVudFZhbGlkYXRvcnMpLmZpbHRlcih2ID0+ICFoYXNWYWxpZGF0b3IodmFsaWRhdG9ycywgdikpO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQmFzZSBjbGFzcyBmb3IgY29udHJvbCBkaXJlY3RpdmVzLlxuICpcbiAqIFRoaXMgY2xhc3MgaXMgb25seSB1c2VkIGludGVybmFsbHkgaW4gdGhlIGBSZWFjdGl2ZUZvcm1zTW9kdWxlYCBhbmQgdGhlIGBGb3Jtc01vZHVsZWAuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IG9mIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgYXMgdGhleSB3ZXJlIHByb3ZpZGVkIHdoaWxlIGNhbGxpbmcgYHNldFZhbGlkYXRvcnNgIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3Jhd1ZhbGlkYXRvcnMgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCBvZiBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBhcyB0aGV5IHdlcmUgcHJvdmlkZWQgd2hpbGUgY2FsbGluZyBgc2V0QXN5bmNWYWxpZGF0b3JzYFxuICAgICAgICAgKiBmdW5jdGlvbi5cbiAgICAgICAgICogQGludGVybmFsXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSBbXTtcbiAgICAgICAgLypcbiAgICAgICAgICogVGhlIHNldCBvZiBjYWxsYmFja3MgdG8gYmUgaW52b2tlZCB3aGVuIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyBiZWluZyBkZXN0cm95ZWQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkRlc3Ryb3lDYWxsYmFja3MgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgaWYgaXQgaXMgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnZhbHVlIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIHZhbGlkLiBBIGNvbnRyb2wgaXMgY29uc2lkZXJlZCB2YWxpZCBpZiBub1xuICAgICAqIHZhbGlkYXRpb24gZXJyb3JzIGV4aXN0IHdpdGggdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAgICogSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IHZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnZhbGlkIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0IHZhbHVlLlxuICAgICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCBpbnZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmludmFsaWQgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgYSBjb250cm9sIGlzIHBlbmRpbmcsIG1lYW5pbmcgdGhhdCBhc3luYyB2YWxpZGF0aW9uIGlzIG9jY3VycmluZyBhbmRcbiAgICAgKiBlcnJvcnMgYXJlIG5vdCB5ZXQgYXZhaWxhYmxlIGZvciB0aGUgaW5wdXQgdmFsdWUuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzXG4gICAgICogcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IHBlbmRpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wucGVuZGluZyA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlcG9ydHMgd2hldGhlciB0aGUgY29udHJvbCBpcyBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGRpc2FibGVkXG4gICAgICogaW4gdGhlIFVJIGFuZCBpcyBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcyBhbmQgZXhjbHVkZWQgZnJvbSBhZ2dyZWdhdGVcbiAgICAgKiB2YWx1ZXMgb2YgYW5jZXN0b3IgY29udHJvbHMuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5kaXNhYmxlZCA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlcG9ydHMgd2hldGhlciB0aGUgY29udHJvbCBpcyBlbmFibGVkLCBtZWFuaW5nIHRoYXQgdGhlIGNvbnRyb2wgaXMgaW5jbHVkZWQgaW4gYW5jZXN0b3JcbiAgICAgKiBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCBlbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmVuYWJsZWQgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHRoZSBjb250cm9sJ3MgdmFsaWRhdGlvbiBlcnJvcnMuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCBlcnJvcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZXJyb3JzIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIHByaXN0aW5lLCBtZWFuaW5nIHRoYXQgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZFxuICAgICAqIHRoZSB2YWx1ZSBpbiB0aGUgVUkuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCBwcmlzdGluZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5wcmlzdGluZSA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlcG9ydHMgd2hldGhlciB0aGUgY29udHJvbCBpcyBkaXJ0eSwgbWVhbmluZyB0aGF0IHRoZSB1c2VyIGhhcyBjaGFuZ2VkXG4gICAgICogdGhlIHZhbHVlIGluIHRoZSBVSS4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IGRpcnR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmRpcnR5IDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIHRvdWNoZWQsIG1lYW5pbmcgdGhhdCB0aGUgdXNlciBoYXMgdHJpZ2dlcmVkXG4gICAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCB0b3VjaGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnRvdWNoZWQgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIHRoZSB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC4gUG9zc2libGUgdmFsdWVzIGluY2x1ZGU6XG4gICAgICogJ1ZBTElEJywgJ0lOVkFMSUQnLCAnRElTQUJMRUQnLCBhbmQgJ1BFTkRJTkcnLlxuICAgICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldCBzdGF0dXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuc3RhdHVzIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIHVudG91Y2hlZCwgbWVhbmluZyB0aGF0IHRoZSB1c2VyIGhhcyBub3QgeWV0IHRyaWdnZXJlZFxuICAgICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBnZXQgdW50b3VjaGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnVudG91Y2hlZCA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYSBtdWx0aWNhc3Rpbmcgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGEgdmFsaWRhdGlvbiBzdGF0dXMgd2hlbmV2ZXIgaXQgaXNcbiAgICAgKiBjYWxjdWxhdGVkIGZvciB0aGUgY29udHJvbC4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgZ2V0IHN0YXR1c0NoYW5nZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuc3RhdHVzQ2hhbmdlcyA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYSBtdWx0aWNhc3Rpbmcgb2JzZXJ2YWJsZSBvZiB2YWx1ZSBjaGFuZ2VzIGZvciB0aGUgY29udHJvbCB0aGF0IGVtaXRzIGV2ZXJ5IHRpbWUgdGhlXG4gICAgICogdmFsdWUgb2YgdGhlIGNvbnRyb2wgY2hhbmdlcyBpbiB0aGUgVUkgb3IgcHJvZ3JhbW1hdGljYWxseS5cbiAgICAgKiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBnZXQgdmFsdWVDaGFuZ2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnZhbHVlQ2hhbmdlcyA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgICAqL1xuICAgIGdldCBwYXRoKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGZvciB0aGlzIGRpcmVjdGl2ZS5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBfc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKSB7XG4gICAgICAgIHRoaXMuX3Jhd1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzIHx8IFtdO1xuICAgICAgICB0aGlzLl9jb21wb3NlZFZhbGlkYXRvckZuID0gY29tcG9zZVZhbGlkYXRvcnModGhpcy5fcmF3VmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgZm9yIHRoaXMgZGlyZWN0aXZlLlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIF9zZXRBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgICAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzIHx8IFtdO1xuICAgICAgICB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBjb21wb3NlZCBvZiBhbGwgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgcmVnaXN0ZXJlZCB3aXRoIHRoaXNcbiAgICAgKiBkaXJlY3RpdmUuXG4gICAgICovXG4gICAgZ2V0IHZhbGlkYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gfHwgbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQXN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBjb21wb3NlZCBvZiBhbGwgdGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHJlZ2lzdGVyZWQgd2l0aFxuICAgICAqIHRoaXMgZGlyZWN0aXZlLlxuICAgICAqL1xuICAgIGdldCBhc3luY1ZhbGlkYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiB8fCBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB0byByZWdpc3RlciBjYWxsYmFja3MgdGhhdCBzaG91bGQgYmUgaW52b2tlZFxuICAgICAqIHdoZW4gZGlyZWN0aXZlIGluc3RhbmNlIGlzIGJlaW5nIGRlc3Ryb3llZC5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBfcmVnaXN0ZXJPbkRlc3Ryb3koZm4pIHtcbiAgICAgICAgdGhpcy5fb25EZXN0cm95Q2FsbGJhY2tzLnB1c2goZm4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB0byBpbnZva2UgYWxsIHJlZ2lzdGVyZWQgXCJvbiBkZXN0cm95XCIgY2FsbGJhY2tzLlxuICAgICAqIE5vdGU6IGNhbGxpbmcgdGhpcyBmdW5jdGlvbiBhbHNvIGNsZWFycyB0aGUgbGlzdCBvZiBjYWxsYmFja3MuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgX2ludm9rZU9uRGVzdHJveUNhbGxiYWNrcygpIHtcbiAgICAgICAgdGhpcy5fb25EZXN0cm95Q2FsbGJhY2tzLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgICAgIHRoaXMuX29uRGVzdHJveUNhbGxiYWNrcyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXNldHMgdGhlIGNvbnRyb2wgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWUgaWYgdGhlIGNvbnRyb2wgaXMgcHJlc2VudC5cbiAgICAgKi9cbiAgICByZXNldCh2YWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sKVxuICAgICAgICAgICAgdGhpcy5jb250cm9sLnJlc2V0KHZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGggaGFzIHRoZSBlcnJvciBzcGVjaWZpZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBjb2RlIG9mIHRoZSBlcnJvciB0byBjaGVja1xuICAgICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICAgKiAgIGFkZHJlc3M6IG5ldyBGb3JtR3JvdXAoeyBzdHJlZXQ6IG5ldyBGb3JtQ29udHJvbCgpIH0pXG4gICAgICogfSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgICAqXG4gICAgICogSXQgY2FuIGJlIHByb3ZpZGVkIHRvIHRoaXMgbWV0aG9kIGluIG9uZSBvZiB0d28gZm9ybWF0czpcbiAgICAgKlxuICAgICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAgICogMS4gQSBwZXJpb2QtZGVsaW1pdGVkIGxpc3Qgb2YgY29udHJvbCBuYW1lcyBpbiBvbmUgc3RyaW5nLCBlLmcuIGAnYWRkcmVzcy5zdHJlZXQnYFxuICAgICAqXG4gICAgICogSWYgbm8gcGF0aCBpcyBnaXZlbiwgdGhpcyBtZXRob2QgY2hlY2tzIGZvciB0aGUgZXJyb3Igb24gdGhlIGN1cnJlbnQgY29udHJvbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVycm9yIGlzIHByZXNlbnQgaW4gdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIHBhdGguXG4gICAgICpcbiAgICAgKiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgZmFsc2UgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgaGFzRXJyb3IoZXJyb3JDb2RlLCBwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuaGFzRXJyb3IoZXJyb3JDb2RlLCBwYXRoKSA6IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIGVycm9yIGRhdGEgZm9yIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGguXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBjb2RlIG9mIHRoZSBlcnJvciB0byBjaGVja1xuICAgICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICAgKiAgIGFkZHJlc3M6IG5ldyBGb3JtR3JvdXAoeyBzdHJlZXQ6IG5ldyBGb3JtQ29udHJvbCgpIH0pXG4gICAgICogfSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgICAqXG4gICAgICogSXQgY2FuIGJlIHByb3ZpZGVkIHRvIHRoaXMgbWV0aG9kIGluIG9uZSBvZiB0d28gZm9ybWF0czpcbiAgICAgKlxuICAgICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAgICogMS4gQSBwZXJpb2QtZGVsaW1pdGVkIGxpc3Qgb2YgY29udHJvbCBuYW1lcyBpbiBvbmUgc3RyaW5nLCBlLmcuIGAnYWRkcmVzcy5zdHJlZXQnYFxuICAgICAqXG4gICAgICogQHJldHVybnMgZXJyb3IgZGF0YSBmb3IgdGhhdCBwYXJ0aWN1bGFyIGVycm9yLiBJZiB0aGUgY29udHJvbCBvciBlcnJvciBpcyBub3QgcHJlc2VudCxcbiAgICAgKiBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldEVycm9yKGVycm9yQ29kZSwgcGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmdldEVycm9yKGVycm9yQ29kZSwgcGF0aCkgOiBudWxsO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgYmFzZSBjbGFzcyBmb3IgZGlyZWN0aXZlcyB0aGF0IGNvbnRhaW4gbXVsdGlwbGUgcmVnaXN0ZXJlZCBpbnN0YW5jZXMgb2YgYE5nQ29udHJvbGAuXG4gKiBPbmx5IHVzZWQgYnkgdGhlIGZvcm1zIG1vZHVsZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIENvbnRyb2xDb250YWluZXIgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUge1xuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSB0b3AtbGV2ZWwgZm9ybSBkaXJlY3RpdmUgZm9yIHRoZSBjb250cm9sLlxuICAgICAqL1xuICAgIGdldCBmb3JtRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhlIHBhdGggdG8gdGhpcyBncm91cC5cbiAgICAgKi9cbiAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBiYXNlIGNsYXNzIHRoYXQgYWxsIGBGb3JtQ29udHJvbGAtYmFzZWQgZGlyZWN0aXZlcyBleHRlbmQuIEl0IGJpbmRzIGEgYEZvcm1Db250cm9sYFxuICogb2JqZWN0IHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBOZ0NvbnRyb2wgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRoZSBwYXJlbnQgZm9ybSBmb3IgdGhlIGNvbnRyb2wuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbnRlcm5hbFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBUaGUgbmFtZSBmb3IgdGhlIGNvbnRyb2xcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogVGhlIHZhbHVlIGFjY2Vzc29yIGZvciB0aGUgY29udHJvbFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gbnVsbDtcbiAgICB9XG59XG5cbi8vIERPIE5PVCBSRUZBQ1RPUiFcbi8vIEVhY2ggc3RhdHVzIGlzIHJlcHJlc2VudGVkIGJ5IGEgc2VwYXJhdGUgZnVuY3Rpb24gdG8gbWFrZSBzdXJlIHRoYXRcbi8vIGFkdmFuY2VkIENsb3N1cmUgQ29tcGlsZXIgb3B0aW1pemF0aW9ucyByZWxhdGVkIHRvIHByb3BlcnR5IHJlbmFtaW5nXG4vLyBjYW4gd29yayBjb3JyZWN0bHkuXG5jbGFzcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKGNkKSB7XG4gICAgICAgIHRoaXMuX2NkID0gY2Q7XG4gICAgfVxuICAgIGdldCBpc1RvdWNoZWQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy50b3VjaGVkO1xuICAgIH1cbiAgICBnZXQgaXNVbnRvdWNoZWQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy51bnRvdWNoZWQ7XG4gICAgfVxuICAgIGdldCBpc1ByaXN0aW5lKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8ucHJpc3RpbmU7XG4gICAgfVxuICAgIGdldCBpc0RpcnR5KCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8uZGlydHk7XG4gICAgfVxuICAgIGdldCBpc1ZhbGlkKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8udmFsaWQ7XG4gICAgfVxuICAgIGdldCBpc0ludmFsaWQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5pbnZhbGlkO1xuICAgIH1cbiAgICBnZXQgaXNQZW5kaW5nKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8ucGVuZGluZztcbiAgICB9XG4gICAgZ2V0IGlzU3VibWl0dGVkKCkge1xuICAgICAgICAvLyBXZSBjaGVjayBmb3IgdGhlIGBzdWJtaXR0ZWRgIGZpZWxkIGZyb20gYE5nRm9ybWAgYW5kIGBGb3JtR3JvdXBEaXJlY3RpdmVgIGNsYXNzZXMsIGJ1dFxuICAgICAgICAvLyB3ZSBhdm9pZCBpbnN0YW5jZW9mIGNoZWNrcyB0byBwcmV2ZW50IG5vbi10cmVlLXNoYWthYmxlIHJlZmVyZW5jZXMgdG8gdGhvc2UgdHlwZXMuXG4gICAgICAgIHJldHVybiAhIXRoaXMuX2NkPy5zdWJtaXR0ZWQ7XG4gICAgfVxufVxuY29uc3QgbmdDb250cm9sU3RhdHVzSG9zdCA9IHtcbiAgICAnW2NsYXNzLm5nLXVudG91Y2hlZF0nOiAnaXNVbnRvdWNoZWQnLFxuICAgICdbY2xhc3MubmctdG91Y2hlZF0nOiAnaXNUb3VjaGVkJyxcbiAgICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICdpc1ByaXN0aW5lJyxcbiAgICAnW2NsYXNzLm5nLWRpcnR5XSc6ICdpc0RpcnR5JyxcbiAgICAnW2NsYXNzLm5nLXZhbGlkXSc6ICdpc1ZhbGlkJyxcbiAgICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ2lzSW52YWxpZCcsXG4gICAgJ1tjbGFzcy5uZy1wZW5kaW5nXSc6ICdpc1BlbmRpbmcnLFxufTtcbmNvbnN0IG5nR3JvdXBTdGF0dXNIb3N0ID0ge1xuICAgIC4uLm5nQ29udHJvbFN0YXR1c0hvc3QsXG4gICAgJ1tjbGFzcy5uZy1zdWJtaXR0ZWRdJzogJ2lzU3VibWl0dGVkJyxcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGlyZWN0aXZlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBBbmd1bGFyIGZvcm0gY29udHJvbHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDU1MgY2xhc3NlcyBhcHBsaWVkXG4gKlxuICogVGhlIGZvbGxvd2luZyBjbGFzc2VzIGFyZSBhcHBsaWVkIGFzIHRoZSBwcm9wZXJ0aWVzIGJlY29tZSB0cnVlOlxuICpcbiAqICogbmctdmFsaWRcbiAqICogbmctaW52YWxpZFxuICogKiBuZy1wZW5kaW5nXG4gKiAqIG5nLXByaXN0aW5lXG4gKiAqIG5nLWRpcnR5XG4gKiAqIG5nLXVudG91Y2hlZFxuICogKiBuZy10b3VjaGVkXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBOZ0NvbnRyb2xTdGF0dXMgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKGNkKSB7XG4gICAgICAgIHN1cGVyKGNkKTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTmdDb250cm9sU3RhdHVzLCBkZXBzOiBbeyB0b2tlbjogTmdDb250cm9sLCBzZWxmOiB0cnVlIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IE5nQ29udHJvbFN0YXR1cywgc2VsZWN0b3I6IFwiW2Zvcm1Db250cm9sTmFtZV0sW25nTW9kZWxdLFtmb3JtQ29udHJvbF1cIiwgaG9zdDogeyBwcm9wZXJ0aWVzOiB7IFwiY2xhc3MubmctdW50b3VjaGVkXCI6IFwiaXNVbnRvdWNoZWRcIiwgXCJjbGFzcy5uZy10b3VjaGVkXCI6IFwiaXNUb3VjaGVkXCIsIFwiY2xhc3MubmctcHJpc3RpbmVcIjogXCJpc1ByaXN0aW5lXCIsIFwiY2xhc3MubmctZGlydHlcIjogXCJpc0RpcnR5XCIsIFwiY2xhc3MubmctdmFsaWRcIjogXCJpc1ZhbGlkXCIsIFwiY2xhc3MubmctaW52YWxpZFwiOiBcImlzSW52YWxpZFwiLCBcImNsYXNzLm5nLXBlbmRpbmdcIjogXCJpc1BlbmRpbmdcIiB9IH0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nQ29udHJvbFN0YXR1cywgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7IHNlbGVjdG9yOiAnW2Zvcm1Db250cm9sTmFtZV0sW25nTW9kZWxdLFtmb3JtQ29udHJvbF0nLCBob3N0OiBuZ0NvbnRyb2xTdGF0dXNIb3N0IH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogTmdDb250cm9sLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfV0gfV0gfSk7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGlyZWN0aXZlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBBbmd1bGFyIGZvcm0gZ3JvdXBzIHRoYXQgc2V0cyBDU1MgY2xhc3Nlc1xuICogYmFzZWQgb24gY29udHJvbCBzdGF0dXMgKHZhbGlkL2ludmFsaWQvZGlydHkvZXRjKS4gT24gZ3JvdXBzLCB0aGlzIGluY2x1ZGVzIHRoZSBhZGRpdGlvbmFsXG4gKiBjbGFzcyBuZy1zdWJtaXR0ZWQuXG4gKlxuICogQHNlZSB7QGxpbmsgTmdDb250cm9sU3RhdHVzfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTmdDb250cm9sU3RhdHVzR3JvdXAgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKGNkKSB7XG4gICAgICAgIHN1cGVyKGNkKTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTmdDb250cm9sU3RhdHVzR3JvdXAsIGRlcHM6IFt7IHRva2VuOiBDb250cm9sQ29udGFpbmVyLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBOZ0NvbnRyb2xTdGF0dXNHcm91cCwgc2VsZWN0b3I6IFwiW2Zvcm1Hcm91cE5hbWVdLFtmb3JtQXJyYXlOYW1lXSxbbmdNb2RlbEdyb3VwXSxbZm9ybUdyb3VwXSxmb3JtOm5vdChbbmdOb0Zvcm1dKSxbbmdGb3JtXVwiLCBob3N0OiB7IHByb3BlcnRpZXM6IHsgXCJjbGFzcy5uZy11bnRvdWNoZWRcIjogXCJpc1VudG91Y2hlZFwiLCBcImNsYXNzLm5nLXRvdWNoZWRcIjogXCJpc1RvdWNoZWRcIiwgXCJjbGFzcy5uZy1wcmlzdGluZVwiOiBcImlzUHJpc3RpbmVcIiwgXCJjbGFzcy5uZy1kaXJ0eVwiOiBcImlzRGlydHlcIiwgXCJjbGFzcy5uZy12YWxpZFwiOiBcImlzVmFsaWRcIiwgXCJjbGFzcy5uZy1pbnZhbGlkXCI6IFwiaXNJbnZhbGlkXCIsIFwiY2xhc3MubmctcGVuZGluZ1wiOiBcImlzUGVuZGluZ1wiLCBcImNsYXNzLm5nLXN1Ym1pdHRlZFwiOiBcImlzU3VibWl0dGVkXCIgfSB9LCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOZ0NvbnRyb2xTdGF0dXNHcm91cCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnW2Zvcm1Hcm91cE5hbWVdLFtmb3JtQXJyYXlOYW1lXSxbbmdNb2RlbEdyb3VwXSxbZm9ybUdyb3VwXSxmb3JtOm5vdChbbmdOb0Zvcm1dKSxbbmdGb3JtXScsXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IG5nR3JvdXBTdGF0dXNIb3N0XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiBDb250cm9sQ29udGFpbmVyLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH1dIH1dIH0pO1xuXG5jb25zdCBmb3JtQ29udHJvbE5hbWVFeGFtcGxlID0gYFxuICA8ZGl2IFtmb3JtR3JvdXBdPVwibXlHcm91cFwiPlxuICAgIDxpbnB1dCBmb3JtQ29udHJvbE5hbWU9XCJmaXJzdE5hbWVcIj5cbiAgPC9kaXY+XG5cbiAgSW4geW91ciBjbGFzczpcblxuICB0aGlzLm15R3JvdXAgPSBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIGZpcnN0TmFtZTogbmV3IEZvcm1Db250cm9sKClcbiAgfSk7YDtcbmNvbnN0IGZvcm1Hcm91cE5hbWVFeGFtcGxlID0gYFxuICA8ZGl2IFtmb3JtR3JvdXBdPVwibXlHcm91cFwiPlxuICAgICAgPGRpdiBmb3JtR3JvdXBOYW1lPVwicGVyc29uXCI+XG4gICAgICAgIDxpbnB1dCBmb3JtQ29udHJvbE5hbWU9XCJmaXJzdE5hbWVcIj5cbiAgICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuICBJbiB5b3VyIGNsYXNzOlxuXG4gIHRoaXMubXlHcm91cCA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAgcGVyc29uOiBuZXcgRm9ybUdyb3VwKHsgZmlyc3ROYW1lOiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICB9KTtgO1xuY29uc3QgZm9ybUFycmF5TmFtZUV4YW1wbGUgPSBgXG4gIDxkaXYgW2Zvcm1Hcm91cF09XCJteUdyb3VwXCI+XG4gICAgPGRpdiBmb3JtQXJyYXlOYW1lPVwiY2l0aWVzXCI+XG4gICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBjaXR5IG9mIGNpdHlBcnJheS5jb250cm9sczsgaW5kZXggYXMgaVwiPlxuICAgICAgICA8aW5wdXQgW2Zvcm1Db250cm9sTmFtZV09XCJpXCI+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cbiAgSW4geW91ciBjbGFzczpcblxuICB0aGlzLmNpdHlBcnJheSA9IG5ldyBGb3JtQXJyYXkoW25ldyBGb3JtQ29udHJvbCgnU0YnKV0pO1xuICB0aGlzLm15R3JvdXAgPSBuZXcgRm9ybUdyb3VwKHtcbiAgICBjaXRpZXM6IHRoaXMuY2l0eUFycmF5XG4gIH0pO2A7XG5jb25zdCBuZ01vZGVsR3JvdXBFeGFtcGxlID0gYFxuICA8Zm9ybT5cbiAgICAgIDxkaXYgbmdNb2RlbEdyb3VwPVwicGVyc29uXCI+XG4gICAgICAgIDxpbnB1dCBbKG5nTW9kZWwpXT1cInBlcnNvbi5uYW1lXCIgbmFtZT1cImZpcnN0TmFtZVwiPlxuICAgICAgPC9kaXY+XG4gIDwvZm9ybT5gO1xuY29uc3QgbmdNb2RlbFdpdGhGb3JtR3JvdXBFeGFtcGxlID0gYFxuICA8ZGl2IFtmb3JtR3JvdXBdPVwibXlHcm91cFwiPlxuICAgICAgPGlucHV0IGZvcm1Db250cm9sTmFtZT1cImZpcnN0TmFtZVwiPlxuICAgICAgPGlucHV0IFsobmdNb2RlbCldPVwic2hvd01vcmVDb250cm9sc1wiIFtuZ01vZGVsT3B0aW9uc109XCJ7c3RhbmRhbG9uZTogdHJ1ZX1cIj5cbiAgPC9kaXY+XG5gO1xuXG5mdW5jdGlvbiBjb250cm9sUGFyZW50RXhjZXB0aW9uKCkge1xuICAgIHJldHVybiBuZXcgybVSdW50aW1lRXJyb3IoMTA1MCAvKiBSdW50aW1lRXJyb3JDb2RlLkZPUk1fQ09OVFJPTF9OQU1FX01JU1NJTkdfUEFSRU5UICovLCBgZm9ybUNvbnRyb2xOYW1lIG11c3QgYmUgdXNlZCB3aXRoIGEgcGFyZW50IGZvcm1Hcm91cCBkaXJlY3RpdmUuICBZb3UnbGwgd2FudCB0byBhZGQgYSBmb3JtR3JvdXBcbiAgICAgIGRpcmVjdGl2ZSBhbmQgcGFzcyBpdCBhbiBleGlzdGluZyBGb3JtR3JvdXAgaW5zdGFuY2UgKHlvdSBjYW4gY3JlYXRlIG9uZSBpbiB5b3VyIGNsYXNzKS5cblxuICAgIEV4YW1wbGU6XG5cbiAgICAke2Zvcm1Db250cm9sTmFtZUV4YW1wbGV9YCk7XG59XG5mdW5jdGlvbiBuZ01vZGVsR3JvdXBFeGNlcHRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyDJtVJ1bnRpbWVFcnJvcigxMDUxIC8qIFJ1bnRpbWVFcnJvckNvZGUuRk9STV9DT05UUk9MX05BTUVfSU5TSURFX01PREVMX0dST1VQICovLCBgZm9ybUNvbnRyb2xOYW1lIGNhbm5vdCBiZSB1c2VkIHdpdGggYW4gbmdNb2RlbEdyb3VwIHBhcmVudC4gSXQgaXMgb25seSBjb21wYXRpYmxlIHdpdGggcGFyZW50c1xuICAgICAgdGhhdCBhbHNvIGhhdmUgYSBcImZvcm1cIiBwcmVmaXg6IGZvcm1Hcm91cE5hbWUsIGZvcm1BcnJheU5hbWUsIG9yIGZvcm1Hcm91cC5cblxuICAgICAgT3B0aW9uIDE6ICBVcGRhdGUgdGhlIHBhcmVudCB0byBiZSBmb3JtR3JvdXBOYW1lIChyZWFjdGl2ZSBmb3JtIHN0cmF0ZWd5KVxuXG4gICAgICAke2Zvcm1Hcm91cE5hbWVFeGFtcGxlfVxuXG4gICAgICBPcHRpb24gMjogVXNlIG5nTW9kZWwgaW5zdGVhZCBvZiBmb3JtQ29udHJvbE5hbWUgKHRlbXBsYXRlLWRyaXZlbiBzdHJhdGVneSlcblxuICAgICAgJHtuZ01vZGVsR3JvdXBFeGFtcGxlfWApO1xufVxuZnVuY3Rpb24gbWlzc2luZ0Zvcm1FeGNlcHRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyDJtVJ1bnRpbWVFcnJvcigxMDUyIC8qIFJ1bnRpbWVFcnJvckNvZGUuRk9STV9HUk9VUF9NSVNTSU5HX0lOU1RBTkNFICovLCBgZm9ybUdyb3VwIGV4cGVjdHMgYSBGb3JtR3JvdXAgaW5zdGFuY2UuIFBsZWFzZSBwYXNzIG9uZSBpbi5cblxuICAgICAgRXhhbXBsZTpcblxuICAgICAgJHtmb3JtQ29udHJvbE5hbWVFeGFtcGxlfWApO1xufVxuZnVuY3Rpb24gZ3JvdXBQYXJlbnRFeGNlcHRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyDJtVJ1bnRpbWVFcnJvcigxMDUzIC8qIFJ1bnRpbWVFcnJvckNvZGUuRk9STV9HUk9VUF9OQU1FX01JU1NJTkdfUEFSRU5UICovLCBgZm9ybUdyb3VwTmFtZSBtdXN0IGJlIHVzZWQgd2l0aCBhIHBhcmVudCBmb3JtR3JvdXAgZGlyZWN0aXZlLiAgWW91J2xsIHdhbnQgdG8gYWRkIGEgZm9ybUdyb3VwXG4gICAgZGlyZWN0aXZlIGFuZCBwYXNzIGl0IGFuIGV4aXN0aW5nIEZvcm1Hcm91cCBpbnN0YW5jZSAoeW91IGNhbiBjcmVhdGUgb25lIGluIHlvdXIgY2xhc3MpLlxuXG4gICAgRXhhbXBsZTpcblxuICAgICR7Zm9ybUdyb3VwTmFtZUV4YW1wbGV9YCk7XG59XG5mdW5jdGlvbiBhcnJheVBhcmVudEV4Y2VwdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IMm1UnVudGltZUVycm9yKDEwNTQgLyogUnVudGltZUVycm9yQ29kZS5GT1JNX0FSUkFZX05BTUVfTUlTU0lOR19QQVJFTlQgKi8sIGBmb3JtQXJyYXlOYW1lIG11c3QgYmUgdXNlZCB3aXRoIGEgcGFyZW50IGZvcm1Hcm91cCBkaXJlY3RpdmUuICBZb3UnbGwgd2FudCB0byBhZGQgYSBmb3JtR3JvdXBcbiAgICAgIGRpcmVjdGl2ZSBhbmQgcGFzcyBpdCBhbiBleGlzdGluZyBGb3JtR3JvdXAgaW5zdGFuY2UgKHlvdSBjYW4gY3JlYXRlIG9uZSBpbiB5b3VyIGNsYXNzKS5cblxuICAgICAgRXhhbXBsZTpcblxuICAgICAgJHtmb3JtQXJyYXlOYW1lRXhhbXBsZX1gKTtcbn1cbmNvbnN0IGRpc2FibGVkQXR0cldhcm5pbmcgPSBgXG4gIEl0IGxvb2tzIGxpa2UgeW91J3JlIHVzaW5nIHRoZSBkaXNhYmxlZCBhdHRyaWJ1dGUgd2l0aCBhIHJlYWN0aXZlIGZvcm0gZGlyZWN0aXZlLiBJZiB5b3Ugc2V0IGRpc2FibGVkIHRvIHRydWVcbiAgd2hlbiB5b3Ugc2V0IHVwIHRoaXMgY29udHJvbCBpbiB5b3VyIGNvbXBvbmVudCBjbGFzcywgdGhlIGRpc2FibGVkIGF0dHJpYnV0ZSB3aWxsIGFjdHVhbGx5IGJlIHNldCBpbiB0aGUgRE9NIGZvclxuICB5b3UuIFdlIHJlY29tbWVuZCB1c2luZyB0aGlzIGFwcHJvYWNoIHRvIGF2b2lkICdjaGFuZ2VkIGFmdGVyIGNoZWNrZWQnIGVycm9ycy5cblxuICBFeGFtcGxlOlxuICAvLyBTcGVjaWZ5IHRoZSBcXGBkaXNhYmxlZFxcYCBwcm9wZXJ0eSBhdCBjb250cm9sIGNyZWF0aW9uIHRpbWU6XG4gIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICBmaXJzdDogbmV3IEZvcm1Db250cm9sKHt2YWx1ZTogJ05hbmN5JywgZGlzYWJsZWQ6IHRydWV9LCBWYWxpZGF0b3JzLnJlcXVpcmVkKSxcbiAgICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ0RyZXcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkKVxuICB9KTtcblxuICAvLyBDb250cm9scyBjYW4gYWxzbyBiZSBlbmFibGVkL2Rpc2FibGVkIGFmdGVyIGNyZWF0aW9uOlxuICBmb3JtLmdldCgnZmlyc3QnKT8uZW5hYmxlKCk7XG4gIGZvcm0uZ2V0KCdsYXN0Jyk/LmRpc2FibGUoKTtcbmA7XG5jb25zdCBhc3luY1ZhbGlkYXRvcnNEcm9wcGVkV2l0aE9wdHNXYXJuaW5nID0gYFxuICBJdCBsb29rcyBsaWtlIHlvdSdyZSBjb25zdHJ1Y3RpbmcgdXNpbmcgYSBGb3JtQ29udHJvbCB3aXRoIGJvdGggYW4gb3B0aW9ucyBhcmd1bWVudCBhbmQgYW5cbiAgYXN5bmMgdmFsaWRhdG9ycyBhcmd1bWVudC4gTWl4aW5nIHRoZXNlIGFyZ3VtZW50cyB3aWxsIGNhdXNlIHlvdXIgYXN5bmMgdmFsaWRhdG9ycyB0byBiZSBkcm9wcGVkLlxuICBZb3Ugc2hvdWxkIGVpdGhlciBwdXQgYWxsIHlvdXIgdmFsaWRhdG9ycyBpbiB0aGUgb3B0aW9ucyBvYmplY3QsIG9yIGluIHNlcGFyYXRlIHZhbGlkYXRvcnNcbiAgYXJndW1lbnRzLiBGb3IgZXhhbXBsZTpcblxuICAvLyBVc2luZyB2YWxpZGF0b3JzIGFyZ3VtZW50c1xuICBmYyA9IG5ldyBGb3JtQ29udHJvbCg0MiwgVmFsaWRhdG9ycy5yZXF1aXJlZCwgbXlBc3luY1ZhbGlkYXRvcik7XG5cbiAgLy8gVXNpbmcgQWJzdHJhY3RDb250cm9sT3B0aW9uc1xuICBmYyA9IG5ldyBGb3JtQ29udHJvbCg0Miwge3ZhbGlkYXRvcnM6IFZhbGlkYXRvcnMucmVxdWlyZWQsIGFzeW5jVmFsaWRhdG9yczogbXlBVn0pO1xuXG4gIC8vIERvIE5PVCBtaXggdGhlbTogYXN5bmMgdmFsaWRhdG9ycyB3aWxsIGJlIGRyb3BwZWQhXG4gIGZjID0gbmV3IEZvcm1Db250cm9sKDQyLCB7dmFsaWRhdG9yczogVmFsaWRhdG9ycy5yZXF1aXJlZH0sIC8qIE9vcHMhICovIG15QXN5bmNWYWxpZGF0b3IpO1xuYDtcbmZ1bmN0aW9uIG5nTW9kZWxXYXJuaW5nKGRpcmVjdGl2ZU5hbWUpIHtcbiAgICByZXR1cm4gYFxuICBJdCBsb29rcyBsaWtlIHlvdSdyZSB1c2luZyBuZ01vZGVsIG9uIHRoZSBzYW1lIGZvcm0gZmllbGQgYXMgJHtkaXJlY3RpdmVOYW1lfS5cbiAgU3VwcG9ydCBmb3IgdXNpbmcgdGhlIG5nTW9kZWwgaW5wdXQgcHJvcGVydHkgYW5kIG5nTW9kZWxDaGFuZ2UgZXZlbnQgd2l0aFxuICByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXMgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBBbmd1bGFyIHY2IGFuZCB3aWxsIGJlIHJlbW92ZWRcbiAgaW4gYSBmdXR1cmUgdmVyc2lvbiBvZiBBbmd1bGFyLlxuXG4gIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHRoaXMsIHNlZSBvdXIgQVBJIGRvY3MgaGVyZTpcbiAgaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy8ke2RpcmVjdGl2ZU5hbWUgPT09ICdmb3JtQ29udHJvbCcgPyAnRm9ybUNvbnRyb2xEaXJlY3RpdmUnIDogJ0Zvcm1Db250cm9sTmFtZSd9I3VzZS13aXRoLW5nbW9kZWxcbiAgYDtcbn1cbmZ1bmN0aW9uIGRlc2NyaWJlS2V5KGlzRm9ybUdyb3VwLCBrZXkpIHtcbiAgICByZXR1cm4gaXNGb3JtR3JvdXAgPyBgd2l0aCBuYW1lOiAnJHtrZXl9J2AgOiBgYXQgaW5kZXg6ICR7a2V5fWA7XG59XG5mdW5jdGlvbiBub0NvbnRyb2xzRXJyb3IoaXNGb3JtR3JvdXApIHtcbiAgICByZXR1cm4gYFxuICAgIFRoZXJlIGFyZSBubyBmb3JtIGNvbnRyb2xzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzICR7aXNGb3JtR3JvdXAgPyAnZ3JvdXAnIDogJ2FycmF5J30geWV0LiBJZiB5b3UncmUgdXNpbmcgbmdNb2RlbCxcbiAgICB5b3UgbWF5IHdhbnQgdG8gY2hlY2sgbmV4dCB0aWNrIChlLmcuIHVzZSBzZXRUaW1lb3V0KS5cbiAgYDtcbn1cbmZ1bmN0aW9uIG1pc3NpbmdDb250cm9sRXJyb3IoaXNGb3JtR3JvdXAsIGtleSkge1xuICAgIHJldHVybiBgQ2Fubm90IGZpbmQgZm9ybSBjb250cm9sICR7ZGVzY3JpYmVLZXkoaXNGb3JtR3JvdXAsIGtleSl9YDtcbn1cbmZ1bmN0aW9uIG1pc3NpbmdDb250cm9sVmFsdWVFcnJvcihpc0Zvcm1Hcm91cCwga2V5KSB7XG4gICAgcmV0dXJuIGBNdXN0IHN1cHBseSBhIHZhbHVlIGZvciBmb3JtIGNvbnRyb2wgJHtkZXNjcmliZUtleShpc0Zvcm1Hcm91cCwga2V5KX1gO1xufVxuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgdmFsaWQsIG1lYW5pbmcgdGhhdCBubyBlcnJvcnMgZXhpc3QgaW4gdGhlIGlucHV0IHZhbHVlLlxuICpcbiAqIEBzZWUge0BsaW5rIHN0YXR1c31cbiAqL1xuY29uc3QgVkFMSUQgPSAnVkFMSUQnO1xuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0IHZhbHVlLlxuICpcbiAqIEBzZWUge0BsaW5rIHN0YXR1c31cbiAqL1xuY29uc3QgSU5WQUxJRCA9ICdJTlZBTElEJztcbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpcyBwZW5kaW5nLCBtZWFuaW5nIHRoYXQgYXN5bmMgdmFsaWRhdGlvbiBpcyBvY2N1cnJpbmcgYW5kXG4gKiBlcnJvcnMgYXJlIG5vdCB5ZXQgYXZhaWxhYmxlIGZvciB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSB7QGxpbmsgbWFya0FzUGVuZGluZ31cbiAqIEBzZWUge0BsaW5rIHN0YXR1c31cbiAqL1xuY29uc3QgUEVORElORyA9ICdQRU5ESU5HJztcbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpcyBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yXG4gKiBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuXG4gKlxuICogQHNlZSB7QGxpbmsgbWFya0FzRGlzYWJsZWR9XG4gKiBAc2VlIHtAbGluayBzdGF0dXN9XG4gKi9cbmNvbnN0IERJU0FCTEVEID0gJ0RJU0FCTEVEJztcbi8qKlxuICogR2V0cyB2YWxpZGF0b3JzIGZyb20gZWl0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IG9yIGdpdmVuIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIHBpY2tWYWxpZGF0b3JzKHZhbGlkYXRvck9yT3B0cykge1xuICAgIHJldHVybiAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgPyB2YWxpZGF0b3JPck9wdHMudmFsaWRhdG9ycyA6IHZhbGlkYXRvck9yT3B0cykgfHwgbnVsbDtcbn1cbi8qKlxuICogQ3JlYXRlcyB2YWxpZGF0b3IgZnVuY3Rpb24gYnkgY29tYmluaW5nIHByb3ZpZGVkIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGNvZXJjZVRvVmFsaWRhdG9yKHZhbGlkYXRvcikge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbGlkYXRvcikgPyBjb21wb3NlVmFsaWRhdG9ycyh2YWxpZGF0b3IpIDogdmFsaWRhdG9yIHx8IG51bGw7XG59XG4vKipcbiAqIEdldHMgYXN5bmMgdmFsaWRhdG9ycyBmcm9tIGVpdGhlciBhbiBvcHRpb25zIG9iamVjdCBvciBnaXZlbiB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpIHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICAgIGlmIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSAmJiBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGFzeW5jVmFsaWRhdG9yc0Ryb3BwZWRXaXRoT3B0c1dhcm5pbmcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgPyB2YWxpZGF0b3JPck9wdHMuYXN5bmNWYWxpZGF0b3JzIDogYXN5bmNWYWxpZGF0b3IpIHx8IG51bGw7XG59XG4vKipcbiAqIENyZWF0ZXMgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uIGJ5IGNvbWJpbmluZyBwcm92aWRlZCBhc3luYyB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKGFzeW5jVmFsaWRhdG9yKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXN5bmNWYWxpZGF0b3IpID8gY29tcG9zZUFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcikgOlxuICAgICAgICBhc3luY1ZhbGlkYXRvciB8fCBudWxsO1xufVxuZnVuY3Rpb24gaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykge1xuICAgIHJldHVybiB2YWxpZGF0b3JPck9wdHMgIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JPck9wdHMpICYmXG4gICAgICAgIHR5cGVvZiB2YWxpZGF0b3JPck9wdHMgPT09ICdvYmplY3QnO1xufVxuZnVuY3Rpb24gYXNzZXJ0Q29udHJvbFByZXNlbnQocGFyZW50LCBpc0dyb3VwLCBrZXkpIHtcbiAgICBjb25zdCBjb250cm9scyA9IHBhcmVudC5jb250cm9scztcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gaXNHcm91cCA/IE9iamVjdC5rZXlzKGNvbnRyb2xzKSA6IGNvbnRyb2xzO1xuICAgIGlmICghY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IMm1UnVudGltZUVycm9yKDEwMDAgLyogUnVudGltZUVycm9yQ29kZS5OT19DT05UUk9MUyAqLywgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkgPyBub0NvbnRyb2xzRXJyb3IoaXNHcm91cCkgOiAnJyk7XG4gICAgfVxuICAgIGlmICghY29udHJvbHNba2V5XSkge1xuICAgICAgICB0aHJvdyBuZXcgybVSdW50aW1lRXJyb3IoMTAwMSAvKiBSdW50aW1lRXJyb3JDb2RlLk1JU1NJTkdfQ09OVFJPTCAqLywgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkgPyBtaXNzaW5nQ29udHJvbEVycm9yKGlzR3JvdXAsIGtleSkgOiAnJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gYXNzZXJ0QWxsVmFsdWVzUHJlc2VudChjb250cm9sLCBpc0dyb3VwLCB2YWx1ZSkge1xuICAgIGNvbnRyb2wuX2ZvckVhY2hDaGlsZCgoXywga2V5KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZVtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyDJtVJ1bnRpbWVFcnJvcigxMDAyIC8qIFJ1bnRpbWVFcnJvckNvZGUuTUlTU0lOR19DT05UUk9MX1ZBTFVFICovLCAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSA/IG1pc3NpbmdDb250cm9sVmFsdWVFcnJvcihpc0dyb3VwLCBrZXkpIDpcbiAgICAgICAgICAgICAgICAnJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIGNsYW5nLWZvcm1hdCBvblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIEl0IHByb3ZpZGVzIHNvbWUgb2YgdGhlIHNoYXJlZCBiZWhhdmlvciB0aGF0IGFsbCBjb250cm9scyBhbmQgZ3JvdXBzIG9mIGNvbnRyb2xzIGhhdmUsIGxpa2VcbiAqIHJ1bm5pbmcgdmFsaWRhdG9ycywgY2FsY3VsYXRpbmcgc3RhdHVzLCBhbmQgcmVzZXR0aW5nIHN0YXRlLiBJdCBhbHNvIGRlZmluZXMgdGhlIHByb3BlcnRpZXNcbiAqIHRoYXQgYXJlIHNoYXJlZCBiZXR3ZWVuIGFsbCBzdWItY2xhc3NlcywgbGlrZSBgdmFsdWVgLCBgdmFsaWRgLCBhbmQgYGRpcnR5YC4gSXQgc2hvdWxkbid0IGJlXG4gKiBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKlxuICogVGhlIGZpcnN0IHR5cGUgcGFyYW1ldGVyIFRWYWx1ZSByZXByZXNlbnRzIHRoZSB2YWx1ZSB0eXBlIG9mIHRoZSBjb250cm9sIChgY29udHJvbC52YWx1ZWApLlxuICogVGhlIG9wdGlvbmFsIHR5cGUgcGFyYW1ldGVyIFRSYXdWYWx1ZSAgcmVwcmVzZW50cyB0aGUgcmF3IHZhbHVlIHR5cGUgKGBjb250cm9sLmdldFJhd1ZhbHVlKClgKS5cbiAqXG4gKiBAc2VlIFtGb3JtcyBHdWlkZV0oL2d1aWRlL2Zvcm1zKVxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgW0R5bmFtaWMgRm9ybXMgR3VpZGVdKC9ndWlkZS9keW5hbWljLWZvcm0pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBBYnN0cmFjdENvbnRyb2wge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgdGhlIEFic3RyYWN0Q29udHJvbCBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2ZcbiAgICAgKiAgICAgdGhpcyBjb250cm9sIHN5bmNocm9ub3VzbHkuXG4gICAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9ycyBUaGUgZnVuY3Rpb24gb3IgYXJyYXkgb2YgZnVuY3Rpb25zIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdmFsaWRpdHkgb2ZcbiAgICAgKiAgICAgdGhpcyBjb250cm9sIGFzeW5jaHJvbm91c2x5LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9ycykge1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX3BlbmRpbmdEaXJ0eSA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGVzIHRoYXQgYSBjb250cm9sIGhhcyBpdHMgb3duIHBlbmRpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRpb24gaW4gcHJvZ3Jlc3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbnRlcm5hbFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fcGVuZGluZ1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7IH07XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGNvbnRyb2wgaXMgYHByaXN0aW5lYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkXG4gICAgICAgICAqIHRoZSB2YWx1ZSBpbiB0aGUgVUkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZCB0aGUgdmFsdWUgaW4gdGhlIFVJOyBjb21wYXJlIGBkaXJ0eWAuXG4gICAgICAgICAqIFByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIGRvIG5vdCBtYXJrIGl0IGRpcnR5LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wcmlzdGluZSA9IHRydWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGlzIG1hcmtlZCBhcyBgdG91Y2hlZGAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEEgY29udHJvbCBpcyBtYXJrZWQgYHRvdWNoZWRgIG9uY2UgdGhlIHVzZXIgaGFzIHRyaWdnZXJlZFxuICAgICAgICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudG91Y2hlZCA9IGZhbHNlO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UgPSBbXTtcbiAgICAgICAgdGhpcy5fYXNzaWduVmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICAgICAgdGhpcy5fYXNzaWduQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbCBzeW5jaHJvbm91c2x5LlxuICAgICAqIElmIG11bHRpcGxlIHZhbGlkYXRvcnMgaGF2ZSBiZWVuIGFkZGVkLCB0aGlzIHdpbGwgYmUgYSBzaW5nbGUgY29tcG9zZWQgZnVuY3Rpb24uXG4gICAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAgICovXG4gICAgZ2V0IHZhbGlkYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm47XG4gICAgfVxuICAgIHNldCB2YWxpZGF0b3IodmFsaWRhdG9yRm4pIHtcbiAgICAgICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gPSB2YWxpZGF0b3JGbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2YgdGhpcyBjb250cm9sIGFzeW5jaHJvbm91c2x5LlxuICAgICAqIElmIG11bHRpcGxlIHZhbGlkYXRvcnMgaGF2ZSBiZWVuIGFkZGVkLCB0aGlzIHdpbGwgYmUgYSBzaW5nbGUgY29tcG9zZWQgZnVuY3Rpb24uXG4gICAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAgICovXG4gICAgZ2V0IGFzeW5jVmFsaWRhdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuO1xuICAgIH1cbiAgICBzZXQgYXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3JGbikge1xuICAgICAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBhc3luY1ZhbGlkYXRvckZuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgcGFyZW50IGNvbnRyb2wuXG4gICAgICovXG4gICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBjb250cm9sIGlzIGB2YWxpZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYFZBTElEYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBwYXNzZWQgYWxsIG9mIGl0cyB2YWxpZGF0aW9uIHRlc3RzLFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBnZXQgdmFsaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gVkFMSUQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgY29udHJvbCBpcyBgaW52YWxpZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYElOVkFMSURgLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGhhcyBmYWlsZWQgb25lIG9yIG1vcmUgb2YgaXRzIHZhbGlkYXRpb24gY2hlY2tzLFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBnZXQgaW52YWxpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBJTlZBTElEO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIGNvbnRyb2wgaXMgYHBlbmRpbmdgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBQRU5ESU5HYC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgY29udHJvbCBpcyBpbiB0aGUgcHJvY2VzcyBvZiBjb25kdWN0aW5nIGEgdmFsaWRhdGlvbiBjaGVjayxcbiAgICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgZ2V0IHBlbmRpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PSBQRU5ESU5HO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIGNvbnRyb2wgaXMgYGRpc2FibGVkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgRElTQUJMRURgLlxuICAgICAqXG4gICAgICogRGlzYWJsZWQgY29udHJvbHMgYXJlIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgICAqIGFyZSBub3QgaW5jbHVkZWQgaW4gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGVpciBhbmNlc3RvclxuICAgICAqIGNvbnRyb2xzLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gRElTQUJMRUQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgY29udHJvbCBpcyBgZW5hYmxlZGAgYXMgbG9uZyBhcyBpdHMgYHN0YXR1c2AgaXMgbm90IGBESVNBQkxFRGAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBhbnkgc3RhdHVzIG90aGVyIHRoYW4gJ0RJU0FCTEVEJyxcbiAgICAgKiBmYWxzZSBpZiB0aGUgc3RhdHVzIGlzICdESVNBQkxFRCcuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IGVuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyAhPT0gRElTQUJMRUQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgY29udHJvbCBpcyBgZGlydHlgIGlmIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSB2YWx1ZVxuICAgICAqIGluIHRoZSBVSS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlIG9mIHRoaXMgY29udHJvbCBpbiB0aGUgVUk7IGNvbXBhcmUgYHByaXN0aW5lYC5cbiAgICAgKiBQcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSBkbyBub3QgbWFyayBpdCBkaXJ0eS5cbiAgICAgKi9cbiAgICBnZXQgZGlydHkoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5wcmlzdGluZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgbm90IGJlZW4gbWFya2VkIGFzIHRvdWNoZWRcbiAgICAgKlxuICAgICAqIEEgY29udHJvbCBpcyBgdW50b3VjaGVkYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCB0cmlnZ2VyZWRcbiAgICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC5cbiAgICAgKi9cbiAgICBnZXQgdW50b3VjaGVkKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMudG91Y2hlZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVwb3J0cyB0aGUgdXBkYXRlIHN0cmF0ZWd5IG9mIHRoZSBgQWJzdHJhY3RDb250cm9sYCAobWVhbmluZ1xuICAgICAqIHRoZSBldmVudCBvbiB3aGljaCB0aGUgY29udHJvbCB1cGRhdGVzIGl0c2VsZikuXG4gICAgICogUG9zc2libGUgdmFsdWVzOiBgJ2NoYW5nZSdgIHwgYCdibHVyJ2AgfCBgJ3N1Ym1pdCdgXG4gICAgICogRGVmYXVsdCB2YWx1ZTogYCdjaGFuZ2UnYFxuICAgICAqL1xuICAgIGdldCB1cGRhdGVPbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZU9uID8gdGhpcy5fdXBkYXRlT24gOiAodGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC51cGRhdGVPbiA6ICdjaGFuZ2UnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc3luY2hyb25vdXMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiAgQ2FsbGluZ1xuICAgICAqIHRoaXMgb3ZlcndyaXRlcyBhbnkgZXhpc3Rpbmcgc3luY2hyb25vdXMgdmFsaWRhdG9ycy5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgICAqXG4gICAgICogSWYgeW91IHdhbnQgdG8gYWRkIGEgbmV3IHZhbGlkYXRvciB3aXRob3V0IGFmZmVjdGluZyBleGlzdGluZyBvbmVzLCBjb25zaWRlclxuICAgICAqIHVzaW5nIGBhZGRWYWxpZGF0b3JzKClgIG1ldGhvZCBpbnN0ZWFkLlxuICAgICAqL1xuICAgIHNldFZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgICAgICB0aGlzLl9hc3NpZ25WYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiBDYWxsaW5nIHRoaXNcbiAgICAgKiBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycy5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgICAqXG4gICAgICogSWYgeW91IHdhbnQgdG8gYWRkIGEgbmV3IHZhbGlkYXRvciB3aXRob3V0IGFmZmVjdGluZyBleGlzdGluZyBvbmVzLCBjb25zaWRlclxuICAgICAqIHVzaW5nIGBhZGRBc3luY1ZhbGlkYXRvcnMoKWAgbWV0aG9kIGluc3RlYWQuXG4gICAgICovXG4gICAgc2V0QXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnMpIHtcbiAgICAgICAgdGhpcy5fYXNzaWduQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyIHZhbGlkYXRvcnMuXG4gICAgICpcbiAgICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICAgKlxuICAgICAqIEFkZGluZyBhIHZhbGlkYXRvciB0aGF0IGFscmVhZHkgZXhpc3RzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIElmIGR1cGxpY2F0ZSB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAgICogYXJlIHByZXNlbnQgaW4gdGhlIGB2YWxpZGF0b3JzYCBhcnJheSwgb25seSB0aGUgZmlyc3QgaW5zdGFuY2Ugd291bGQgYmUgYWRkZWQgdG8gYSBmb3JtXG4gICAgICogY29udHJvbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBuZXcgdmFsaWRhdG9yIGZ1bmN0aW9uIG9yIGZ1bmN0aW9ucyB0byBhZGQgdG8gdGhpcyBjb250cm9sLlxuICAgICAqL1xuICAgIGFkZFZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgICAgICB0aGlzLnNldFZhbGlkYXRvcnMoYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdWYWxpZGF0b3JzKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBhc3luY2hyb25vdXMgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlclxuICAgICAqIHZhbGlkYXRvcnMuXG4gICAgICpcbiAgICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICAgKlxuICAgICAqIEFkZGluZyBhIHZhbGlkYXRvciB0aGF0IGFscmVhZHkgZXhpc3RzIHdpbGwgaGF2ZSBubyBlZmZlY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgbmV3IGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gb3IgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGlzIGNvbnRyb2wuXG4gICAgICovXG4gICAgYWRkQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnMpIHtcbiAgICAgICAgdGhpcy5zZXRBc3luY1ZhbGlkYXRvcnMoYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZyb20gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlciB2YWxpZGF0b3JzLlxuICAgICAqIFZhbGlkYXRvcnMgYXJlIGNvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZTsgeW91IG11c3QgcGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZVxuICAgICAqIHZhbGlkYXRvciBmdW5jdGlvbiBhcyB0aGUgb25lIHRoYXQgd2FzIG9yaWdpbmFsbHkgc2V0LiBJZiBhIHByb3ZpZGVkIHZhbGlkYXRvciBpcyBub3QgZm91bmQsXG4gICAgICogaXQgaXMgaWdub3JlZC5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgUmVmZXJlbmNlIHRvIGEgVmFsaWRhdG9yRm5cbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIC8vIFJlZmVyZW5jZSB0byB0aGUgUmVxdWlyZWRWYWxpZGF0b3JcbiAgICAgKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sPHN0cmluZyB8IG51bGw+KCcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAgICAgKiBjdHJsLnJlbW92ZVZhbGlkYXRvcnMoVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gICAgICpcbiAgICAgKiAvLyBSZWZlcmVuY2UgdG8gYW5vbnltb3VzIGZ1bmN0aW9uIGluc2lkZSBNaW5WYWxpZGF0b3JcbiAgICAgKiBjb25zdCBtaW5WYWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1pbigzKTtcbiAgICAgKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sPHN0cmluZyB8IG51bGw+KCcnLCBtaW5WYWxpZGF0b3IpO1xuICAgICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihtaW5WYWxpZGF0b3IpKS50b0VxdWFsKHRydWUpXG4gICAgICogZXhwZWN0KGN0cmwuaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMubWluKDMpKSkudG9FcXVhbChmYWxzZSlcbiAgICAgKlxuICAgICAqIGN0cmwucmVtb3ZlVmFsaWRhdG9ycyhtaW5WYWxpZGF0b3IpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHJlbW92ZVZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgICAgICB0aGlzLnNldFZhbGlkYXRvcnMocmVtb3ZlVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdWYWxpZGF0b3JzKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBhc3luY2hyb25vdXMgdmFsaWRhdG9yIGZyb20gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlciB2YWxpZGF0b3JzLlxuICAgICAqIFZhbGlkYXRvcnMgYXJlIGNvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZTsgeW91IG11c3QgcGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZVxuICAgICAqIHZhbGlkYXRvciBmdW5jdGlvbiBhcyB0aGUgb25lIHRoYXQgd2FzIG9yaWdpbmFsbHkgc2V0LiBJZiBhIHByb3ZpZGVkIHZhbGlkYXRvciBpcyBub3QgZm91bmQsIGl0XG4gICAgICogaXMgaWdub3JlZC5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byByZW1vdmUuXG4gICAgICovXG4gICAgcmVtb3ZlQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnMpIHtcbiAgICAgICAgdGhpcy5zZXRBc3luY1ZhbGlkYXRvcnMocmVtb3ZlVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBpcyBwcmVzZW50IG9uIHRoaXMgY29udHJvbC4gVGhlIHByb3ZpZGVkXG4gICAgICogdmFsaWRhdG9yIG11c3QgYmUgYSByZWZlcmVuY2UgdG8gdGhlIGV4YWN0IHNhbWUgZnVuY3Rpb24gdGhhdCB3YXMgcHJvdmlkZWQuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqXG4gICAgICogIyMjIFJlZmVyZW5jZSB0byBhIFZhbGlkYXRvckZuXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiAvLyBSZWZlcmVuY2UgdG8gdGhlIFJlcXVpcmVkVmFsaWRhdG9yXG4gICAgICogY29uc3QgY3RybCA9IG5ldyBGb3JtQ29udHJvbDxudW1iZXIgfCBudWxsPigwLCBWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAgICAgKiBleHBlY3QoY3RybC5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5yZXF1aXJlZCkpLnRvRXF1YWwodHJ1ZSlcbiAgICAgKlxuICAgICAqIC8vIFJlZmVyZW5jZSB0byBhbm9ueW1vdXMgZnVuY3Rpb24gaW5zaWRlIE1pblZhbGlkYXRvclxuICAgICAqIGNvbnN0IG1pblZhbGlkYXRvciA9IFZhbGlkYXRvcnMubWluKDMpO1xuICAgICAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2w8bnVtYmVyIHwgbnVsbD4oMCwgbWluVmFsaWRhdG9yKTtcbiAgICAgKiBleHBlY3QoY3RybC5oYXNWYWxpZGF0b3IobWluVmFsaWRhdG9yKSkudG9FcXVhbCh0cnVlKVxuICAgICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihWYWxpZGF0b3JzLm1pbigzKSkpLnRvRXF1YWwoZmFsc2UpXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yIFRoZSB2YWxpZGF0b3IgdG8gY2hlY2sgZm9yIHByZXNlbmNlLiBDb21wYXJlZCBieSBmdW5jdGlvbiByZWZlcmVuY2UuXG4gICAgICogQHJldHVybnMgV2hldGhlciB0aGUgcHJvdmlkZWQgdmFsaWRhdG9yIHdhcyBmb3VuZCBvbiB0aGlzIGNvbnRyb2wuXG4gICAgICovXG4gICAgaGFzVmFsaWRhdG9yKHZhbGlkYXRvcikge1xuICAgICAgICByZXR1cm4gaGFzVmFsaWRhdG9yKHRoaXMuX3Jhd1ZhbGlkYXRvcnMsIHZhbGlkYXRvcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBpcyBwcmVzZW50IG9uIHRoaXMgY29udHJvbC4gVGhlIHByb3ZpZGVkXG4gICAgICogdmFsaWRhdG9yIG11c3QgYmUgYSByZWZlcmVuY2UgdG8gdGhlIGV4YWN0IHNhbWUgZnVuY3Rpb24gdGhhdCB3YXMgcHJvdmlkZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yIFRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9yIHRvIGNoZWNrIGZvciBwcmVzZW5jZS4gQ29tcGFyZWQgYnkgZnVuY3Rpb25cbiAgICAgKiAgICAgcmVmZXJlbmNlLlxuICAgICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIHByb3ZpZGVkIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igd2FzIGZvdW5kIG9uIHRoaXMgY29udHJvbC5cbiAgICAgKi9cbiAgICBoYXNBc3luY1ZhbGlkYXRvcih2YWxpZGF0b3IpIHtcbiAgICAgICAgcmV0dXJuIGhhc1ZhbGlkYXRvcih0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMsIHZhbGlkYXRvcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtcHRpZXMgb3V0IHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgbGlzdC5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgICAqXG4gICAgICovXG4gICAgY2xlYXJWYWxpZGF0b3JzKCkge1xuICAgICAgICB0aGlzLnZhbGlkYXRvciA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtcHRpZXMgb3V0IHRoZSBhc3luYyB2YWxpZGF0b3IgbGlzdC5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgICAqXG4gICAgICovXG4gICAgY2xlYXJBc3luY1ZhbGlkYXRvcnMoKSB7XG4gICAgICAgIHRoaXMuYXN5bmNWYWxpZGF0b3IgPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgdG91Y2hlZGAuIEEgY29udHJvbCBpcyB0b3VjaGVkIGJ5IGZvY3VzIGFuZFxuICAgICAqIGJsdXIgZXZlbnRzIHRoYXQgZG8gbm90IGNoYW5nZSB0aGUgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNVbnRvdWNoZWQoKX1cbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNEaXJ0eSgpfVxuICAgICAqIEBzZWUge0BsaW5rIG1hcmtBc1ByaXN0aW5lKCl9XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgKi9cbiAgICBtYXJrQXNUb3VjaGVkKG9wdHMgPSB7fSkge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQubWFya0FzVG91Y2hlZChvcHRzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXJrcyB0aGUgY29udHJvbCBhbmQgYWxsIGl0cyBkZXNjZW5kYW50IGNvbnRyb2xzIGFzIGB0b3VjaGVkYC5cbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNUb3VjaGVkKCl9XG4gICAgICovXG4gICAgbWFya0FsbEFzVG91Y2hlZCgpIHtcbiAgICAgICAgdGhpcy5tYXJrQXNUb3VjaGVkKHsgb25seVNlbGY6IHRydWUgfSk7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCkgPT4gY29udHJvbC5tYXJrQWxsQXNUb3VjaGVkKCkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgdW50b3VjaGVkYC5cbiAgICAgKlxuICAgICAqIElmIHRoZSBjb250cm9sIGhhcyBhbnkgY2hpbGRyZW4sIGFsc28gbWFya3MgYWxsIGNoaWxkcmVuIGFzIGB1bnRvdWNoZWRgXG4gICAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHRvdWNoZWRgIHN0YXR1cyBvZiBhbGwgcGFyZW50IGNvbnRyb2xzLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzVG91Y2hlZCgpfVxuICAgICAqIEBzZWUge0BsaW5rIG1hcmtBc0RpcnR5KCl9XG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzUHJpc3RpbmUoKX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgKi9cbiAgICBtYXJrQXNVbnRvdWNoZWQob3B0cyA9IHt9KSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wZW5kaW5nVG91Y2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2wpID0+IHtcbiAgICAgICAgICAgIGNvbnRyb2wubWFya0FzVW50b3VjaGVkKHsgb25seVNlbGY6IHRydWUgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQob3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYGRpcnR5YC4gQSBjb250cm9sIGJlY29tZXMgZGlydHkgd2hlblxuICAgICAqIHRoZSBjb250cm9sJ3MgdmFsdWUgaXMgY2hhbmdlZCB0aHJvdWdoIHRoZSBVSTsgY29tcGFyZSBgbWFya0FzVG91Y2hlZGAuXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBtYXJrQXNUb3VjaGVkKCl9XG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzVW50b3VjaGVkKCl9XG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzUHJpc3RpbmUoKX1cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgICAqL1xuICAgIG1hcmtBc0RpcnR5KG9wdHMgPSB7fSkge1xuICAgICAgICB0aGlzLnByaXN0aW5lID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNEaXJ0eShvcHRzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgcHJpc3RpbmVgLlxuICAgICAqXG4gICAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGFueSBjaGlsZHJlbiwgbWFya3MgYWxsIGNoaWxkcmVuIGFzIGBwcmlzdGluZWAsXG4gICAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHByaXN0aW5lYCBzdGF0dXMgb2YgYWxsIHBhcmVudFxuICAgICAqIGNvbnRyb2xzLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgbWFya0FzVG91Y2hlZCgpfVxuICAgICAqIEBzZWUge0BsaW5rIG1hcmtBc1VudG91Y2hlZCgpfVxuICAgICAqIEBzZWUge0BsaW5rIG1hcmtBc0RpcnR5KCl9XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIGVtaXRzIGV2ZW50cyBhZnRlclxuICAgICAqIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAgICovXG4gICAgbWFya0FzUHJpc3RpbmUob3B0cyA9IHt9KSB7XG4gICAgICAgIHRoaXMucHJpc3RpbmUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9wZW5kaW5nRGlydHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sKSA9PiB7XG4gICAgICAgICAgICBjb250cm9sLm1hcmtBc1ByaXN0aW5lKHsgb25seVNlbGY6IHRydWUgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKG9wdHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwZW5kaW5nYC5cbiAgICAgKlxuICAgICAqIEEgY29udHJvbCBpcyBwZW5kaW5nIHdoaWxlIHRoZSBjb250cm9sIHBlcmZvcm1zIGFzeW5jIHZhbGlkYXRpb24uXG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAgICogZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYHN0YXR1c0NoYW5nZXNgXG4gICAgICogb2JzZXJ2YWJsZSBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIHRoZSBjb250cm9sIGlzIG1hcmtlZCBwZW5kaW5nLlxuICAgICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKlxuICAgICAqL1xuICAgIG1hcmtBc1BlbmRpbmcob3B0cyA9IHt9KSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gUEVORElORztcbiAgICAgICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNDaGFuZ2VzLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNQZW5kaW5nKG9wdHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpc2FibGVzIHRoZSBjb250cm9sLiBUaGlzIG1lYW5zIHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgICAqIGV4Y2x1ZGVkIGZyb20gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiBhbnkgcGFyZW50LiBJdHMgc3RhdHVzIGlzIGBESVNBQkxFRGAuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgY29udHJvbCBoYXMgY2hpbGRyZW4sIGFsbCBjaGlsZHJlbiBhcmUgYWxzbyBkaXNhYmxlZC5cbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXNcbiAgICAgKiBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICovXG4gICAgZGlzYWJsZShvcHRzID0ge30pIHtcbiAgICAgICAgLy8gSWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkgd2UgZG9uJ3Qgd2FudCB0byByZS1jYWxjdWxhdGUgdGhlXG4gICAgICAgIC8vIHBhcmVudCdzIGRpcnRpbmVzcyBiYXNlZCBvbiB0aGUgY2hpbGRyZW4uXG4gICAgICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gRElTQUJMRUQ7XG4gICAgICAgIHRoaXMuZXJyb3JzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sKSA9PiB7XG4gICAgICAgICAgICBjb250cm9sLmRpc2FibGUoeyAuLi5vcHRzLCBvbmx5U2VsZjogdHJ1ZSB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG4gICAgICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VzLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0NoYW5nZXMuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlQW5jZXN0b3JzKHsgLi4ub3B0cywgc2tpcFByaXN0aW5lQ2hlY2sgfSk7XG4gICAgICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UuZm9yRWFjaCgoY2hhbmdlRm4pID0+IGNoYW5nZUZuKHRydWUpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW5hYmxlcyB0aGUgY29udHJvbC4gVGhpcyBtZWFucyB0aGUgY29udHJvbCBpcyBpbmNsdWRlZCBpbiB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICAgKiB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGl0cyBwYXJlbnQuIEl0cyBzdGF0dXMgcmVjYWxjdWxhdGVzIGJhc2VkIG9uIGl0cyB2YWx1ZSBhbmRcbiAgICAgKiBpdHMgdmFsaWRhdG9ycy5cbiAgICAgKlxuICAgICAqIEJ5IGRlZmF1bHQsIGlmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBlbmFibGVkLlxuICAgICAqXG4gICAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgY29udHJvbCBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgICAqIGVtaXRzIGV2ZW50cyB3aGVuIG1hcmtlZCBhcyB1bnRvdWNoZWRcbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGVuYWJsZWQuXG4gICAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgICAqL1xuICAgIGVuYWJsZShvcHRzID0ge30pIHtcbiAgICAgICAgLy8gSWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkgd2UgZG9uJ3Qgd2FudCB0byByZS1jYWxjdWxhdGUgdGhlXG4gICAgICAgIC8vIHBhcmVudCdzIGRpcnRpbmVzcyBiYXNlZCBvbiB0aGUgY2hpbGRyZW4uXG4gICAgICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gVkFMSUQ7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCkgPT4ge1xuICAgICAgICAgICAgY29udHJvbC5lbmFibGUoeyAuLi5vcHRzLCBvbmx5U2VsZjogdHJ1ZSB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IG9ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoeyAuLi5vcHRzLCBza2lwUHJpc3RpbmVDaGVjayB9KTtcbiAgICAgICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4oZmFsc2UpKTtcbiAgICB9XG4gICAgX3VwZGF0ZUFuY2VzdG9ycyhvcHRzKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHMpO1xuICAgICAgICAgICAgaWYgKCFvcHRzLnNraXBQcmlzdGluZUNoZWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgcGFyZW50IG9mIHRoZSBjb250cm9sXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50IFRoZSBuZXcgcGFyZW50LlxuICAgICAqL1xuICAgIHNldFBhcmVudChwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgcmF3IHZhbHVlIG9mIHRoaXMgY29udHJvbC4gRm9yIG1vc3QgY29udHJvbCBpbXBsZW1lbnRhdGlvbnMsIHRoZSByYXcgdmFsdWUgd2lsbCBpbmNsdWRlXG4gICAgICogZGlzYWJsZWQgY2hpbGRyZW4uXG4gICAgICovXG4gICAgZ2V0UmF3VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWNhbGN1bGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC5cbiAgICAgKlxuICAgICAqIEJ5IGRlZmF1bHQsIGl0IGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIGl0cyBhbmNlc3RvcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50c1xuICAgICAqIGFmdGVyIHVwZGF0ZXMgYW5kIHZhbGlkaXR5IGNoZWNrcyBhcmUgYXBwbGllZC5cbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgb25seSB1cGRhdGUgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICAgKiB1cGRhdGUgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHVwZGF0ZWQuXG4gICAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgICAqL1xuICAgIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX3NldEluaXRpYWxTdGF0dXMoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gdGhpcy5fcnVuVmFsaWRhdG9yKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IHRoaXMuX2NhbGN1bGF0ZVN0YXR1cygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBWQUxJRCB8fCB0aGlzLnN0YXR1cyA9PT0gUEVORElORykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3J1bkFzeW5jVmFsaWRhdG9yKG9wdHMuZW1pdEV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlcy5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNDaGFuZ2VzLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfdXBkYXRlVHJlZVZhbGlkaXR5KG9wdHMgPSB7IGVtaXRFdmVudDogdHJ1ZSB9KSB7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY3RybCkgPT4gY3RybC5fdXBkYXRlVHJlZVZhbGlkaXR5KG9wdHMpKTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgb25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnQgfSk7XG4gICAgfVxuICAgIF9zZXRJbml0aWFsU3RhdHVzKCkge1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHRoaXMuX2FsbENvbnRyb2xzRGlzYWJsZWQoKSA/IERJU0FCTEVEIDogVkFMSUQ7XG4gICAgfVxuICAgIF9ydW5WYWxpZGF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRvciA/IHRoaXMudmFsaWRhdG9yKHRoaXMpIDogbnVsbDtcbiAgICB9XG4gICAgX3J1bkFzeW5jVmFsaWRhdG9yKGVtaXRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5hc3luY1ZhbGlkYXRvcikge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBQRU5ESU5HO1xuICAgICAgICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9icyA9IHRvT2JzZXJ2YWJsZSh0aGlzLmFzeW5jVmFsaWRhdG9yKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbiA9IG9icy5zdWJzY3JpYmUoKGVycm9ycykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgd2lsbCB0cmlnZ2VyIHRoZSByZWNhbGN1bGF0aW9uIG9mIHRoZSB2YWxpZGF0aW9uIHN0YXR1cywgd2hpY2ggZGVwZW5kcyBvblxuICAgICAgICAgICAgICAgIC8vIHRoZSBzdGF0ZSBvZiB0aGUgYXN5bmNocm9ub3VzIHZhbGlkYXRpb24gKHdoZXRoZXIgaXQgaXMgaW4gcHJvZ3Jlc3Mgb3Igbm90KS4gU28sIGl0IGlzXG4gICAgICAgICAgICAgICAgLy8gbmVjZXNzYXJ5IHRoYXQgd2UgaGF2ZSB1cGRhdGVkIHRoZSBgX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvcmAgYm9vbGVhbiBmbGFnIGZpcnN0LlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RXJyb3JzKGVycm9ycywgeyBlbWl0RXZlbnQgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBlcnJvcnMgb24gYSBmb3JtIGNvbnRyb2wgd2hlbiBydW5uaW5nIHZhbGlkYXRpb25zIG1hbnVhbGx5LCByYXRoZXIgdGhhbiBhdXRvbWF0aWNhbGx5LlxuICAgICAqXG4gICAgICogQ2FsbGluZyBgc2V0RXJyb3JzYCBhbHNvIHVwZGF0ZXMgdGhlIHZhbGlkaXR5IG9mIHRoZSBwYXJlbnQgY29udHJvbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgICAqIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgY29udHJvbCBlcnJvcnMgYXJlIHNldC5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2BcbiAgICAgKiBvYnNlcnZhYmxlIGVtaXRzIGFuIGV2ZW50IGFmdGVyIHRoZSBlcnJvcnMgYXJlIHNldC5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICpcbiAgICAgKiAjIyMgTWFudWFsbHkgc2V0IHRoZSBlcnJvcnMgZm9yIGEgY29udHJvbFxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogY29uc3QgbG9naW4gPSBuZXcgRm9ybUNvbnRyb2woJ3NvbWVMb2dpbicpO1xuICAgICAqIGxvZ2luLnNldEVycm9ycyh7XG4gICAgICogICBub3RVbmlxdWU6IHRydWVcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbChmYWxzZSk7XG4gICAgICogZXhwZWN0KGxvZ2luLmVycm9ycykudG9FcXVhbCh7IG5vdFVuaXF1ZTogdHJ1ZSB9KTtcbiAgICAgKlxuICAgICAqIGxvZ2luLnNldFZhbHVlKCdzb21lT3RoZXJMb2dpbicpO1xuICAgICAqXG4gICAgICogZXhwZWN0KGxvZ2luLnZhbGlkKS50b0VxdWFsKHRydWUpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHNldEVycm9ycyhlcnJvcnMsIG9wdHMgPSB7fSkge1xuICAgICAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcbiAgICAgICAgdGhpcy5fdXBkYXRlQ29udHJvbHNFcnJvcnMob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGEgY2hpbGQgY29udHJvbCBnaXZlbiB0aGUgY29udHJvbCdzIG5hbWUgb3IgcGF0aC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXRoIEEgZG90LWRlbGltaXRlZCBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5nL251bWJlciB2YWx1ZXMgdGhhdCBkZWZpbmUgdGhlIHBhdGggdG8gdGhlXG4gICAgICogY29udHJvbC4gSWYgYSBzdHJpbmcgaXMgcHJvdmlkZWQsIHBhc3NpbmcgaXQgYXMgYSBzdHJpbmcgbGl0ZXJhbCB3aWxsIHJlc3VsdCBpbiBpbXByb3ZlZCB0eXBlXG4gICAgICogaW5mb3JtYXRpb24uIExpa2V3aXNlLCBpZiBhbiBhcnJheSBpcyBwcm92aWRlZCwgcGFzc2luZyBpdCBgYXMgY29uc3RgIHdpbGwgY2F1c2UgaW1wcm92ZWQgdHlwZVxuICAgICAqIGluZm9ybWF0aW9uIHRvIGJlIGF2YWlsYWJsZS5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogIyMjIFJldHJpZXZlIGEgbmVzdGVkIGNvbnRyb2xcbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlLCB0byBnZXQgYSBgbmFtZWAgY29udHJvbCBuZXN0ZWQgd2l0aGluIGEgYHBlcnNvbmAgc3ViLWdyb3VwOlxuICAgICAqXG4gICAgICogKiBgdGhpcy5mb3JtLmdldCgncGVyc29uLm5hbWUnKTtgXG4gICAgICpcbiAgICAgKiAtT1ItXG4gICAgICpcbiAgICAgKiAqIGB0aGlzLmZvcm0uZ2V0KFsncGVyc29uJywgJ25hbWUnXSBhcyBjb25zdCk7YCAvLyBgYXMgY29uc3RgIGdpdmVzIGltcHJvdmVkIHR5cGluZ3NcbiAgICAgKlxuICAgICAqICMjIyBSZXRyaWV2ZSBhIGNvbnRyb2wgaW4gYSBGb3JtQXJyYXlcbiAgICAgKlxuICAgICAqIFdoZW4gYWNjZXNzaW5nIGFuIGVsZW1lbnQgaW5zaWRlIGEgRm9ybUFycmF5LCB5b3UgY2FuIHVzZSBhbiBlbGVtZW50IGluZGV4LlxuICAgICAqIEZvciBleGFtcGxlLCB0byBnZXQgYSBgcHJpY2VgIGNvbnRyb2wgZnJvbSB0aGUgZmlyc3QgZWxlbWVudCBpbiBhbiBgaXRlbXNgIGFycmF5IHlvdSBjYW4gdXNlOlxuICAgICAqXG4gICAgICogKiBgdGhpcy5mb3JtLmdldCgnaXRlbXMuMC5wcmljZScpO2BcbiAgICAgKlxuICAgICAqIC1PUi1cbiAgICAgKlxuICAgICAqICogYHRoaXMuZm9ybS5nZXQoWydpdGVtcycsIDAsICdwcmljZSddKTtgXG4gICAgICovXG4gICAgZ2V0KHBhdGgpIHtcbiAgICAgICAgbGV0IGN1cnJQYXRoID0gcGF0aDtcbiAgICAgICAgaWYgKGN1cnJQYXRoID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGN1cnJQYXRoKSlcbiAgICAgICAgICAgIGN1cnJQYXRoID0gY3VyclBhdGguc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKGN1cnJQYXRoLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gY3VyclBhdGgucmVkdWNlKChjb250cm9sLCBuYW1lKSA9PiBjb250cm9sICYmIGNvbnRyb2wuX2ZpbmQobmFtZSksIHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXBvcnRzIGVycm9yIGRhdGEgZm9yIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGguXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBjb2RlIG9mIHRoZSBlcnJvciB0byBjaGVja1xuICAgICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICAgKiAgIGFkZHJlc3M6IG5ldyBGb3JtR3JvdXAoeyBzdHJlZXQ6IG5ldyBGb3JtQ29udHJvbCgpIH0pXG4gICAgICogfSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgICAqXG4gICAgICogSXQgY2FuIGJlIHByb3ZpZGVkIHRvIHRoaXMgbWV0aG9kIGluIG9uZSBvZiB0d28gZm9ybWF0czpcbiAgICAgKlxuICAgICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAgICogMS4gQSBwZXJpb2QtZGVsaW1pdGVkIGxpc3Qgb2YgY29udHJvbCBuYW1lcyBpbiBvbmUgc3RyaW5nLCBlLmcuIGAnYWRkcmVzcy5zdHJlZXQnYFxuICAgICAqXG4gICAgICogQHJldHVybnMgZXJyb3IgZGF0YSBmb3IgdGhhdCBwYXJ0aWN1bGFyIGVycm9yLiBJZiB0aGUgY29udHJvbCBvciBlcnJvciBpcyBub3QgcHJlc2VudCxcbiAgICAgKiBudWxsIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGdldEVycm9yKGVycm9yQ29kZSwgcGF0aCkge1xuICAgICAgICBjb25zdCBjb250cm9sID0gcGF0aCA/IHRoaXMuZ2V0KHBhdGgpIDogdGhpcztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2wgJiYgY29udHJvbC5lcnJvcnMgPyBjb250cm9sLmVycm9yc1tlcnJvckNvZGVdIDogbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGggaGFzIHRoZSBlcnJvciBzcGVjaWZpZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBjb2RlIG9mIHRoZSBlcnJvciB0byBjaGVja1xuICAgICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAgICpcbiAgICAgKiBAdXNhZ2VOb3Rlc1xuICAgICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICAgKiAgIGFkZHJlc3M6IG5ldyBGb3JtR3JvdXAoeyBzdHJlZXQ6IG5ldyBGb3JtQ29udHJvbCgpIH0pXG4gICAgICogfSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgICAqXG4gICAgICogSXQgY2FuIGJlIHByb3ZpZGVkIHRvIHRoaXMgbWV0aG9kIGluIG9uZSBvZiB0d28gZm9ybWF0czpcbiAgICAgKlxuICAgICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAgICogMS4gQSBwZXJpb2QtZGVsaW1pdGVkIGxpc3Qgb2YgY29udHJvbCBuYW1lcyBpbiBvbmUgc3RyaW5nLCBlLmcuIGAnYWRkcmVzcy5zdHJlZXQnYFxuICAgICAqXG4gICAgICogSWYgbm8gcGF0aCBpcyBnaXZlbiwgdGhpcyBtZXRob2QgY2hlY2tzIGZvciB0aGUgZXJyb3Igb24gdGhlIGN1cnJlbnQgY29udHJvbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVycm9yIGlzIHByZXNlbnQgaW4gdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIHBhdGguXG4gICAgICpcbiAgICAgKiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgZmFsc2UgaXMgcmV0dXJuZWQuXG4gICAgICovXG4gICAgaGFzRXJyb3IoZXJyb3JDb2RlLCBwYXRoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZ2V0RXJyb3IoZXJyb3JDb2RlLCBwYXRoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSB0b3AtbGV2ZWwgYW5jZXN0b3Igb2YgdGhpcyBjb250cm9sLlxuICAgICAqL1xuICAgIGdldCByb290KCkge1xuICAgICAgICBsZXQgeCA9IHRoaXM7XG4gICAgICAgIHdoaWxlICh4Ll9wYXJlbnQpIHtcbiAgICAgICAgICAgIHggPSB4Ll9wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfdXBkYXRlQ29udHJvbHNFcnJvcnMoZW1pdEV2ZW50KSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gdGhpcy5fY2FsY3VsYXRlU3RhdHVzKCk7XG4gICAgICAgIGlmIChlbWl0RXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzQ2hhbmdlcy5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKGVtaXRFdmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9pbml0T2JzZXJ2YWJsZXMoKSB7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLnN0YXR1c0NoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgfVxuICAgIF9jYWxjdWxhdGVTdGF0dXMoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkpXG4gICAgICAgICAgICByZXR1cm4gRElTQUJMRUQ7XG4gICAgICAgIGlmICh0aGlzLmVycm9ycylcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICBpZiAodGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yIHx8IHRoaXMuX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhQRU5ESU5HKSlcbiAgICAgICAgICAgIHJldHVybiBQRU5ESU5HO1xuICAgICAgICBpZiAodGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKElOVkFMSUQpKVxuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIHJldHVybiBWQUxJRDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9hbnlDb250cm9sc0hhdmVTdGF0dXMoc3RhdHVzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbCkgPT4gY29udHJvbC5zdGF0dXMgPT09IHN0YXR1cyk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfYW55Q29udHJvbHNEaXJ0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sKSA9PiBjb250cm9sLmRpcnR5KTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9hbnlDb250cm9sc1RvdWNoZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbCkgPT4gY29udHJvbC50b3VjaGVkKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF91cGRhdGVQcmlzdGluZShvcHRzID0ge30pIHtcbiAgICAgICAgdGhpcy5wcmlzdGluZSA9ICF0aGlzLl9hbnlDb250cm9sc0RpcnR5KCk7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUob3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF91cGRhdGVUb3VjaGVkKG9wdHMgPSB7fSkge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSB0aGlzLl9hbnlDb250cm9sc1RvdWNoZWQoKTtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlID0gZm47XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfc2V0VXBkYXRlU3RyYXRlZ3kob3B0cykge1xuICAgICAgICBpZiAoaXNPcHRpb25zT2JqKG9wdHMpICYmIG9wdHMudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlT24gPSBvcHRzLnVwZGF0ZU9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIHRvIHNlZSBpZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIF9wYXJlbnRNYXJrZWREaXJ0eShvbmx5U2VsZikge1xuICAgICAgICBjb25zdCBwYXJlbnREaXJ0eSA9IHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuZGlydHk7XG4gICAgICAgIHJldHVybiAhb25seVNlbGYgJiYgISFwYXJlbnREaXJ0eSAmJiAhdGhpcy5fcGFyZW50Ll9hbnlDb250cm9sc0RpcnR5KCk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYHNldFZhbGlkYXRvcnNgIG1ldGhvZC4gTmVlZHMgdG8gYmUgc2VwYXJhdGVkIG91dCBpbnRvIGFcbiAgICAgKiBkaWZmZXJlbnQgbWV0aG9kLCBiZWNhdXNlIGl0IGlzIGNhbGxlZCBpbiB0aGUgY29uc3RydWN0b3IgYW5kIGl0IGNhbiBicmVhayBjYXNlcyB3aGVyZVxuICAgICAqIGEgY29udHJvbCBpcyBleHRlbmRlZC5cbiAgICAgKi9cbiAgICBfYXNzaWduVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSB7XG4gICAgICAgIHRoaXMuX3Jhd1ZhbGlkYXRvcnMgPSBBcnJheS5pc0FycmF5KHZhbGlkYXRvcnMpID8gdmFsaWRhdG9ycy5zbGljZSgpIDogdmFsaWRhdG9ycztcbiAgICAgICAgdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IGNvZXJjZVRvVmFsaWRhdG9yKHRoaXMuX3Jhd1ZhbGlkYXRvcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYHNldEFzeW5jVmFsaWRhdG9yc2AgbWV0aG9kLiBOZWVkcyB0byBiZSBzZXBhcmF0ZWQgb3V0IGludG8gYVxuICAgICAqIGRpZmZlcmVudCBtZXRob2QsIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGluIHRoZSBjb25zdHJ1Y3RvciBhbmQgaXQgY2FuIGJyZWFrIGNhc2VzIHdoZXJlXG4gICAgICogYSBjb250cm9sIGlzIGV4dGVuZGVkLlxuICAgICAqL1xuICAgIF9hc3NpZ25Bc3luY1ZhbGlkYXRvcnModmFsaWRhdG9ycykge1xuICAgICAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSBBcnJheS5pc0FycmF5KHZhbGlkYXRvcnMpID8gdmFsaWRhdG9ycy5zbGljZSgpIDogdmFsaWRhdG9ycztcbiAgICAgICAgdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuID0gY29lcmNlVG9Bc3luY1ZhbGlkYXRvcih0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUcmFja3MgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBzdGF0ZSBvZiBhIGdyb3VwIG9mIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLlxuICpcbiAqIEEgYEZvcm1Hcm91cGAgYWdncmVnYXRlcyB0aGUgdmFsdWVzIG9mIGVhY2ggY2hpbGQgYEZvcm1Db250cm9sYCBpbnRvIG9uZSBvYmplY3QsXG4gKiB3aXRoIGVhY2ggY29udHJvbCBuYW1lIGFzIHRoZSBrZXkuICBJdCBjYWxjdWxhdGVzIGl0cyBzdGF0dXMgYnkgcmVkdWNpbmcgdGhlIHN0YXR1cyB2YWx1ZXNcbiAqIG9mIGl0cyBjaGlsZHJlbi4gRm9yIGV4YW1wbGUsIGlmIG9uZSBvZiB0aGUgY29udHJvbHMgaW4gYSBncm91cCBpcyBpbnZhbGlkLCB0aGUgZW50aXJlXG4gKiBncm91cCBiZWNvbWVzIGludmFsaWQuXG4gKlxuICogYEZvcm1Hcm91cGAgaXMgb25lIG9mIHRoZSBmb3VyIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyB1c2VkIHRvIGRlZmluZSBmb3JtcyBpbiBBbmd1bGFyLFxuICogYWxvbmcgd2l0aCBgRm9ybUNvbnRyb2xgLCBgRm9ybUFycmF5YCwgYW5kIGBGb3JtUmVjb3JkYC5cbiAqXG4gKiBXaGVuIGluc3RhbnRpYXRpbmcgYSBgRm9ybUdyb3VwYCwgcGFzcyBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMgYXMgdGhlIGZpcnN0XG4gKiBhcmd1bWVudC4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCByZWdpc3RlcnMgdGhlIG5hbWUgZm9yIHRoZSBjb250cm9sLlxuICpcbiAqIGBGb3JtR3JvdXBgIGlzIGludGVuZGVkIGZvciB1c2UgY2FzZXMgd2hlcmUgdGhlIGtleXMgYXJlIGtub3duIGFoZWFkIG9mIHRpbWUuXG4gKiBJZiB5b3UgbmVlZCB0byBkeW5hbWljYWxseSBhZGQgYW5kIHJlbW92ZSBjb250cm9scywgdXNlIHtAbGluayBGb3JtUmVjb3JkfSBpbnN0ZWFkLlxuICpcbiAqIGBGb3JtR3JvdXBgIGFjY2VwdHMgYW4gb3B0aW9uYWwgdHlwZSBwYXJhbWV0ZXIgYFRDb250cm9sYCwgd2hpY2ggaXMgYW4gb2JqZWN0IHR5cGUgd2l0aCBpbm5lclxuICogY29udHJvbCB0eXBlcyBhcyB2YWx1ZXMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBncm91cCB3aXRoIDIgY29udHJvbHNcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnRHJldycpLFxuICogfSk7XG4gKlxuICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OyAnRHJldyd9XG4gKiBjb25zb2xlLmxvZyhmb3JtLnN0YXR1cyk7ICAvLyAnVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiAjIyMgVGhlIHR5cGUgYXJndW1lbnQsIGFuZCBvcHRpb25hbCBjb250cm9sc1xuICpcbiAqIGBGb3JtR3JvdXBgIGFjY2VwdHMgb25lIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGl0cyBpbm5lciBjb250cm9scy5cbiAqIFRoaXMgdHlwZSB3aWxsIHVzdWFsbHkgYmUgaW5mZXJyZWQgYXV0b21hdGljYWxseSwgYnV0IHlvdSBjYW4gYWx3YXlzIHNwZWNpZnkgaXQgZXhwbGljaXRseSBpZiB5b3VcbiAqIHdpc2guXG4gKlxuICogSWYgeW91IGhhdmUgY29udHJvbHMgdGhhdCBhcmUgb3B0aW9uYWwgKGkuZS4gdGhleSBjYW4gYmUgcmVtb3ZlZCwgeW91IGNhbiB1c2UgdGhlIGA/YCBpbiB0aGVcbiAqIHR5cGUpOlxuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXA8e1xuICogICBmaXJzdDogRm9ybUNvbnRyb2w8c3RyaW5nfG51bGw+LFxuICogICBtaWRkbGU/OiBGb3JtQ29udHJvbDxzdHJpbmd8bnVsbD4sIC8vIE1pZGRsZSBuYW1lIGlzIG9wdGlvbmFsLlxuICogICBsYXN0OiBGb3JtQ29udHJvbDxzdHJpbmd8bnVsbD4sXG4gKiB9Pih7XG4gKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ05hbmN5JyksXG4gKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnRHJldycpLFxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBncm91cCB3aXRoIGEgZ3JvdXAtbGV2ZWwgdmFsaWRhdG9yXG4gKlxuICogWW91IGluY2x1ZGUgZ3JvdXAtbGV2ZWwgdmFsaWRhdG9ycyBhcyB0aGUgc2Vjb25kIGFyZywgb3IgZ3JvdXAtbGV2ZWwgYXN5bmNcbiAqIHZhbGlkYXRvcnMgYXMgdGhlIHRoaXJkIGFyZy4gVGhlc2UgY29tZSBpbiBoYW5keSB3aGVuIHlvdSB3YW50IHRvIHBlcmZvcm0gdmFsaWRhdGlvblxuICogdGhhdCBjb25zaWRlcnMgdGhlIHZhbHVlIG9mIG1vcmUgdGhhbiBvbmUgY2hpbGQgY29udHJvbC5cbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgcGFzc3dvcmQ6IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogICBwYXNzd29yZENvbmZpcm06IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogfSwgcGFzc3dvcmRNYXRjaFZhbGlkYXRvcik7XG4gKlxuICpcbiAqIGZ1bmN0aW9uIHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IoZzogRm9ybUdyb3VwKSB7XG4gKiAgICByZXR1cm4gZy5nZXQoJ3Bhc3N3b3JkJykudmFsdWUgPT09IGcuZ2V0KCdwYXNzd29yZENvbmZpcm0nKS52YWx1ZVxuICogICAgICAgPyBudWxsIDogeydtaXNtYXRjaCc6IHRydWV9O1xuICogfVxuICogYGBgXG4gKlxuICogTGlrZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlcywgeW91IGNob29zZSB0byBwYXNzIGluXG4gKiB2YWxpZGF0b3JzIGFuZCBhc3luYyB2YWxpZGF0b3JzIGFzIHBhcnQgb2YgYW4gb3B0aW9ucyBvYmplY3QuXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIHBhc3N3b3JkOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiAgIHBhc3N3b3JkQ29uZmlybTogbmV3IEZvcm1Db250cm9sKCcnKVxuICogfSwgeyB2YWxpZGF0b3JzOiBwYXNzd29yZE1hdGNoVmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcnM6IG90aGVyVmFsaWRhdG9yIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFNldCB0aGUgdXBkYXRlT24gcHJvcGVydHkgZm9yIGFsbCBjb250cm9scyBpbiBhIGZvcm0gZ3JvdXBcbiAqXG4gKiBUaGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZCB0byBzZXQgYSBkZWZhdWx0IHZhbHVlIGZvciBlYWNoIGNoaWxkXG4gKiBjb250cm9sJ3MgYHVwZGF0ZU9uYCBwcm9wZXJ0eS4gSWYgeW91IHNldCBgdXBkYXRlT25gIHRvIGAnYmx1cidgIGF0IHRoZVxuICogZ3JvdXAgbGV2ZWwsIGFsbCBjaGlsZCBjb250cm9scyBkZWZhdWx0IHRvICdibHVyJywgdW5sZXNzIHRoZSBjaGlsZFxuICogaGFzIGV4cGxpY2l0bHkgc3BlY2lmaWVkIGEgZGlmZmVyZW50IGB1cGRhdGVPbmAgdmFsdWUuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGMgPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgb25lOiBuZXcgRm9ybUNvbnRyb2woKVxuICogfSwgeyB1cGRhdGVPbjogJ2JsdXInIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFVzaW5nIGEgRm9ybUdyb3VwIHdpdGggb3B0aW9uYWwgY29udHJvbHNcbiAqXG4gKiBJdCBpcyBwb3NzaWJsZSB0byBoYXZlIG9wdGlvbmFsIGNvbnRyb2xzIGluIGEgRm9ybUdyb3VwLiBBbiBvcHRpb25hbCBjb250cm9sIGNhbiBiZSByZW1vdmVkIGxhdGVyXG4gKiB1c2luZyBgcmVtb3ZlQ29udHJvbGAsIGFuZCBjYW4gYmUgb21pdHRlZCB3aGVuIGNhbGxpbmcgYHJlc2V0YC4gT3B0aW9uYWwgY29udHJvbHMgbXVzdCBiZVxuICogZGVjbGFyZWQgb3B0aW9uYWwgaW4gdGhlIGdyb3VwJ3MgdHlwZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgYyA9IG5ldyBGb3JtR3JvdXA8e29uZT86IEZvcm1Db250cm9sPHN0cmluZz59Pih7XG4gKiAgIG9uZTogbmV3IEZvcm1Db250cm9sKCcnKVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBOb3RpY2UgdGhhdCBgYy52YWx1ZS5vbmVgIGhhcyB0eXBlIGBzdHJpbmd8bnVsbHx1bmRlZmluZWRgLiBUaGlzIGlzIGJlY2F1c2UgY2FsbGluZyBgYy5yZXNldCh7fSlgXG4gKiB3aXRob3V0IHByb3ZpZGluZyB0aGUgb3B0aW9uYWwga2V5IGBvbmVgIHdpbGwgY2F1c2UgaXQgdG8gYmVjb21lIGBudWxsYC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIEZvcm1Hcm91cCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb250cm9scyBBIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zIHZhbGlkYXRpb24gZnVuY3Rpb25zXG4gICAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAgICpcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgICBzdXBlcihwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHMpLCBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkgJiYgdmFsaWRhdGVGb3JtR3JvdXBDb250cm9scyhjb250cm9scyk7XG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcbiAgICAgICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gICAgICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KHZhbGlkYXRvck9yT3B0cyk7XG4gICAgICAgIHRoaXMuX3NldFVwQ29udHJvbHMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtcbiAgICAgICAgICAgIG9ubHlTZWxmOiB0cnVlLFxuICAgICAgICAgICAgLy8gSWYgYGFzeW5jVmFsaWRhdG9yYCBpcyBwcmVzZW50LCBpdCB3aWxsIHRyaWdnZXIgY29udHJvbCBzdGF0dXMgY2hhbmdlIGZyb20gYFBFTkRJTkdgIHRvXG4gICAgICAgICAgICAvLyBgVkFMSURgIG9yIGBJTlZBTElEYC4gVGhlIHN0YXR1cyBzaG91bGQgYmUgYnJvYWRjYXN0ZWQgdmlhIHRoZSBgc3RhdHVzQ2hhbmdlc2Agb2JzZXJ2YWJsZSxcbiAgICAgICAgICAgIC8vIHNvIHdlIHNldCBgZW1pdEV2ZW50YCB0byBgdHJ1ZWAgdG8gYWxsb3cgdGhhdCBkdXJpbmcgdGhlIGNvbnRyb2wgY3JlYXRpb24gcHJvY2Vzcy5cbiAgICAgICAgICAgIGVtaXRFdmVudDogISF0aGlzLmFzeW5jVmFsaWRhdG9yXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZWdpc3RlckNvbnRyb2wobmFtZSwgY29udHJvbCkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xzW25hbWVdO1xuICAgICAgICB0aGlzLmNvbnRyb2xzW25hbWVdID0gY29udHJvbDtcbiAgICAgICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH1cbiAgICBhZGRDb250cm9sKG5hbWUsIGNvbnRyb2wsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudCB9KTtcbiAgICAgICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNvbnRyb2wgZnJvbSB0aGlzIGdyb3VwLiBJbiBhIHN0cm9uZ2x5LXR5cGVkIGdyb3VwLCByZXF1aXJlZCBjb250cm9scyBjYW5ub3QgYmVcbiAgICAgKiByZW1vdmVkLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFcbiAgICAgKiAgICAgY29udHJvbCBpcyByZW1vdmVkLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAgKiByZW1vdmVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICovXG4gICAgcmVtb3ZlQ29udHJvbChuYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzW25hbWVdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7IH0pO1xuICAgICAgICBkZWxldGUgKHRoaXMuY29udHJvbHNbbmFtZV0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgICB9XG4gICAgc2V0Q29udHJvbChuYW1lLCBjb250cm9sLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzW25hbWVdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7IH0pO1xuICAgICAgICBkZWxldGUgKHRoaXMuY29udHJvbHNbbmFtZV0pO1xuICAgICAgICBpZiAoY29udHJvbClcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJDb250cm9sKG5hbWUsIGNvbnRyb2wpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgICB9XG4gICAgY29udGFpbnMoY29udHJvbE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbHMuaGFzT3duUHJvcGVydHkoY29udHJvbE5hbWUpICYmIHRoaXMuY29udHJvbHNbY29udHJvbE5hbWVdLmVuYWJsZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUdyb3VwYC4gSXQgYWNjZXB0cyBhbiBvYmplY3QgdGhhdCBtYXRjaGVzXG4gICAgICogdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAsIHdpdGggY29udHJvbCBuYW1lcyBhcyBrZXlzLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKiAjIyMgU2V0IHRoZSBjb21wbGV0ZSB2YWx1ZSBmb3IgdGhlIGZvcm0gZ3JvdXBcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICAgKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgpXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6IG51bGwsIGxhc3Q6IG51bGx9XG4gICAgICpcbiAgICAgKiBmb3JtLnNldFZhbHVlKHtmaXJzdDogJ05hbmN5JywgbGFzdDogJ0RyZXcnfSk7XG4gICAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OiAnRHJldyd9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIFdoZW4gc3RyaWN0IGNoZWNrcyBmYWlsLCBzdWNoIGFzIHNldHRpbmcgdGhlIHZhbHVlIG9mIGEgY29udHJvbFxuICAgICAqIHRoYXQgZG9lc24ndCBleGlzdCBvciBpZiB5b3UgZXhjbHVkZSBhIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXMgZXhpc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGNvbnRyb2wgdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICAgKlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICAgKiBmYWxzZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICovXG4gICAgc2V0VmFsdWUodmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBhc3NlcnRBbGxWYWx1ZXNQcmVzZW50KHRoaXMsIHRydWUsIHZhbHVlKTtcbiAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICBhc3NlcnRDb250cm9sUHJlc2VudCh0aGlzLCB0cnVlLCBuYW1lKTtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0uc2V0VmFsdWUodmFsdWVbbmFtZV0sIHsgb25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUdyb3VwYC4gSXQgYWNjZXB0cyBhbiBvYmplY3Qgd2l0aCBjb250cm9sXG4gICAgICogbmFtZXMgYXMga2V5cywgYW5kIGRvZXMgaXRzIGJlc3QgdG8gbWF0Y2ggdGhlIHZhbHVlcyB0byB0aGUgY29ycmVjdCBjb250cm9sc1xuICAgICAqIGluIHRoZSBncm91cC5cbiAgICAgKlxuICAgICAqIEl0IGFjY2VwdHMgYm90aCBzdXBlci1zZXRzIGFuZCBzdWItc2V0cyBvZiB0aGUgZ3JvdXAgd2l0aG91dCB0aHJvd2luZyBhbiBlcnJvci5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogIyMjIFBhdGNoIHRoZSB2YWx1ZSBmb3IgYSBmb3JtIGdyb3VwXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgICogICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgpLFxuICAgICAqICAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgpXG4gICAgICogfSk7XG4gICAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuICAgICAqXG4gICAgICogZm9ybS5wYXRjaFZhbHVlKHtmaXJzdDogJ05hbmN5J30pO1xuICAgICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogbnVsbH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGlzIHBhdGNoZWQuXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAgICogdHJ1ZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlXG4gICAgICogaXMgdXBkYXRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG9cbiAgICAgKiB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5IHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICAgKi9cbiAgICBwYXRjaFZhbHVlKHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgLy8gRXZlbiB0aG91Z2ggdGhlIGB2YWx1ZWAgYXJndW1lbnQgdHlwZSBkb2Vzbid0IGFsbG93IGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLCB0aGVcbiAgICAgICAgLy8gYHBhdGNoVmFsdWVgIGNhbiBiZSBjYWxsZWQgcmVjdXJzaXZlbHkgYW5kIGlubmVyIGRhdGEgc3RydWN0dXJlcyBtaWdodCBoYXZlIHRoZXNlIHZhbHVlcywgc29cbiAgICAgICAgLy8gd2UganVzdCBpZ25vcmUgc3VjaCBjYXNlcyB3aGVuIGEgZmllbGQgY29udGFpbmluZyBGb3JtR3JvdXAgaW5zdGFuY2UgcmVjZWl2ZXMgYG51bGxgIG9yXG4gICAgICAgIC8vIGB1bmRlZmluZWRgIGFzIGEgdmFsdWUuXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIC8qIGJvdGggYG51bGxgIGFuZCBgdW5kZWZpbmVkYCAqLylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICAvLyBUaGUgY29tcGlsZXIgY2Fubm90IHNlZSB0aHJvdWdoIHRoZSB1bmluc3RhbnRpYXRlZCBjb25kaXRpb25hbCB0eXBlIG9mIGB0aGlzLmNvbnRyb2xzYCwgc29cbiAgICAgICAgICAgIC8vIGBhcyBhbnlgIGlzIHJlcXVpcmVkLlxuICAgICAgICAgICAgY29uc3QgY29udHJvbCA9IHRoaXMuY29udHJvbHNbbmFtZV07XG4gICAgICAgICAgICBpZiAoY29udHJvbCkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2wucGF0Y2hWYWx1ZShcbiAgICAgICAgICAgICAgICAvKiBHdWFyYW50ZWVkIHRvIGJlIHByZXNlbnQsIGR1ZSB0byB0aGUgb3V0ZXIgZm9yRWFjaC4gKi8gdmFsdWVbbmFtZV0sIHsgb25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgYEZvcm1Hcm91cGAsIG1hcmtzIGFsbCBkZXNjZW5kYW50cyBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCBhbmQgc2V0c1xuICAgICAqIHRoZSB2YWx1ZSBvZiBhbGwgZGVzY2VuZGFudHMgdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZXMsIG9yIG51bGwgaWYgbm8gZGVmYXVsdHMgd2VyZSBwcm92aWRlZC5cbiAgICAgKlxuICAgICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhIG1hcCBvZiBzdGF0ZXNcbiAgICAgKiB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB5b3VyIGZvcm0sIHdpdGggY29udHJvbCBuYW1lcyBhcyBrZXlzLiBUaGUgc3RhdGVcbiAgICAgKiBpcyBhIHN0YW5kYWxvbmUgdmFsdWUgb3IgYSBmb3JtIHN0YXRlIG9iamVjdCB3aXRoIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZFxuICAgICAqIHN0YXR1cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBSZXNldHMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlLFxuICAgICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICAgKiBhbmQgZW1pdHMgZXZlbnRzIHdoZW4gdGhlIGdyb3VwIGlzIHJlc2V0LlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICAgKiBmYWxzZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKlxuICAgICAqICMjIyBSZXNldCB0aGUgZm9ybSBncm91cCB2YWx1ZXNcbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnZmlyc3QgbmFtZScpLFxuICAgICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7Zmlyc3Q6ICdmaXJzdCBuYW1lJywgbGFzdDogJ2xhc3QgbmFtZSd9XG4gICAgICpcbiAgICAgKiBmb3JtLnJlc2V0KHsgZmlyc3Q6ICduYW1lJywgbGFzdDogJ2xhc3QgbmFtZScgfSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqICMjIyBSZXNldCB0aGUgZm9ybSBncm91cCB2YWx1ZXMgYW5kIGRpc2FibGVkIHN0YXR1c1xuICAgICAqXG4gICAgICogYGBgXG4gICAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgICAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnZmlyc3QgbmFtZScpLFxuICAgICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogZm9ybS5yZXNldCh7XG4gICAgICogICBmaXJzdDoge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgICAgKiAgIGxhc3Q6ICdsYXN0J1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7bGFzdDogJ2xhc3QnfVxuICAgICAqIGNvbnNvbGUubG9nKGZvcm0uZ2V0KCdmaXJzdCcpLnN0YXR1cyk7ICAvLyAnRElTQUJMRUQnXG4gICAgICogYGBgXG4gICAgICovXG4gICAgcmVzZXQodmFsdWUgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgY29udHJvbC5yZXNldCh2YWx1ZSA/IHZhbHVlW25hbWVdIDogbnVsbCwgeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudCB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVByaXN0aW5lKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl91cGRhdGVUb3VjaGVkKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLCBpbmNsdWRpbmcgYW55IGRpc2FibGVkIGNvbnRyb2xzLlxuICAgICAqXG4gICAgICogUmV0cmlldmVzIGFsbCB2YWx1ZXMgcmVnYXJkbGVzcyBvZiBkaXNhYmxlZCBzdGF0dXMuXG4gICAgICovXG4gICAgZ2V0UmF3VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbih7fSwgKGFjYywgY29udHJvbCwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgYWNjW25hbWVdID0gY29udHJvbC5nZXRSYXdWYWx1ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfc3luY1BlbmRpbmdDb250cm9scygpIHtcbiAgICAgICAgbGV0IHN1YnRyZWVVcGRhdGVkID0gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oZmFsc2UsICh1cGRhdGVkLCBjaGlsZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLl9zeW5jUGVuZGluZ0NvbnRyb2xzKCkgPyB0cnVlIDogdXBkYXRlZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzdWJ0cmVlVXBkYXRlZClcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IG9ubHlTZWxmOiB0cnVlIH0pO1xuICAgICAgICByZXR1cm4gc3VidHJlZVVwZGF0ZWQ7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZm9yRWFjaENoaWxkKGNiKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIC8vIFRoZSBsaXN0IG9mIGNvbnRyb2xzIGNhbiBjaGFuZ2UgKGZvciBleC4gY29udHJvbHMgbWlnaHQgYmUgcmVtb3ZlZCkgd2hpbGUgdGhlIGxvb3BcbiAgICAgICAgICAgIC8vIGlzIHJ1bm5pbmcgKGFzIGEgcmVzdWx0IG9mIGludm9raW5nIEZvcm1zIEFQSSBpbiBgdmFsdWVDaGFuZ2VzYCBzdWJzY3JpcHRpb24pLCBzbyB3ZVxuICAgICAgICAgICAgLy8gaGF2ZSB0byBudWxsIGNoZWNrIGJlZm9yZSBpbnZva2luZyB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICBjb25zdCBjb250cm9sID0gdGhpcy5jb250cm9sc1trZXldO1xuICAgICAgICAgICAgY29udHJvbCAmJiBjYihjb250cm9sLCBrZXkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9zZXRVcENvbnRyb2xzKCkge1xuICAgICAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2wpID0+IHtcbiAgICAgICAgICAgIGNvbnRyb2wuc2V0UGFyZW50KHRoaXMpO1xuICAgICAgICAgICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfdXBkYXRlVmFsdWUoKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9yZWR1Y2VWYWx1ZSgpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2FueUNvbnRyb2xzKGNvbmRpdGlvbikge1xuICAgICAgICBmb3IgKGNvbnN0IFtjb250cm9sTmFtZSwgY29udHJvbF0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jb250cm9scykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGNvbnRyb2xOYW1lKSAmJiBjb25kaXRpb24oY29udHJvbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVkdWNlVmFsdWUoKSB7XG4gICAgICAgIGxldCBhY2MgPSB7fTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZHVjZUNoaWxkcmVuKGFjYywgKGFjYywgY29udHJvbCwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbnRyb2wuZW5hYmxlZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgYWNjW25hbWVdID0gY29udHJvbC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3JlZHVjZUNoaWxkcmVuKGluaXRWYWx1ZSwgZm4pIHtcbiAgICAgICAgbGV0IHJlcyA9IGluaXRWYWx1ZTtcbiAgICAgICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICByZXMgPSBmbihyZXMsIGNvbnRyb2wsIG5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9hbGxDb250cm9sc0Rpc2FibGVkKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGNvbnRyb2xOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9sc1tjb250cm9sTmFtZV0uZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb250cm9scykubGVuZ3RoID4gMCB8fCB0aGlzLmRpc2FibGVkO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2ZpbmQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9scy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzW25hbWVdIDpcbiAgICAgICAgICAgIG51bGw7XG4gICAgfVxufVxuLyoqXG4gKiBXaWxsIHZhbGlkYXRlIHRoYXQgbm9uZSBvZiB0aGUgY29udHJvbHMgaGFzIGEga2V5IHdpdGggYSBkb3RcbiAqIFRocm93cyBvdGhlciB3aXNlXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRm9ybUdyb3VwQ29udHJvbHMoY29udHJvbHMpIHtcbiAgICBjb25zdCBpbnZhbGlkS2V5cyA9IE9iamVjdC5rZXlzKGNvbnRyb2xzKS5maWx0ZXIoa2V5ID0+IGtleS5pbmNsdWRlcygnLicpKTtcbiAgICBpZiAoaW52YWxpZEtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBUT0RPOiBtYWtlIHRoaXMgYW4gZXJyb3Igb25jZSB0aGVyZSBhcmUgbm8gbW9yZSB1c2VzIGluIEczXG4gICAgICAgIGNvbnNvbGUud2FybihgRm9ybUdyb3VwIGtleXMgY2Fubm90IGluY2x1ZGUgXFxgLlxcYCwgcGxlYXNlIHJlcGxhY2UgdGhlIGtleXMgZm9yOiAke2ludmFsaWRLZXlzLmpvaW4oJywnKX0uYCk7XG4gICAgfVxufVxuY29uc3QgVW50eXBlZEZvcm1Hcm91cCA9IEZvcm1Hcm91cDtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBc3NlcnRzIHRoYXQgdGhlIGdpdmVuIGNvbnRyb2wgaXMgYW4gaW5zdGFuY2Ugb2YgYEZvcm1Hcm91cGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNvbnN0IGlzRm9ybUdyb3VwID0gKGNvbnRyb2wpID0+IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtR3JvdXA7XG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGEgY29sbGVjdGlvbiBvZiBgRm9ybUNvbnRyb2xgIGluc3RhbmNlcywgZWFjaCBvZiB3aGljaCBoYXNcbiAqIHRoZSBzYW1lIHZhbHVlIHR5cGUuXG4gKlxuICogYEZvcm1SZWNvcmRgIGlzIHZlcnkgc2ltaWxhciB0byB7QGxpbmsgRm9ybUdyb3VwfSwgZXhjZXB0IGl0IGNhbiBiZSB1c2VkIHdpdGggYSBkeW5hbWljIGtleXMsXG4gKiB3aXRoIGNvbnRyb2xzIGFkZGVkIGFuZCByZW1vdmVkIGFzIG5lZWRlZC5cbiAqXG4gKiBgRm9ybVJlY29yZGAgYWNjZXB0cyBvbmUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggZGVzY3JpYmVzIHRoZSB0eXBlIG9mIHRoZSBjb250cm9scyBpdCBjb250YWlucy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIGBgYFxuICogbGV0IG51bWJlcnMgPSBuZXcgRm9ybVJlY29yZCh7YmlsbDogbmV3IEZvcm1Db250cm9sKCc0MTUtMTIzLTQ1NicpfSk7XG4gKiBudW1iZXJzLmFkZENvbnRyb2woJ2JvYicsIG5ldyBGb3JtQ29udHJvbCgnNDE1LTIzNC01NjcnKSk7XG4gKiBudW1iZXJzLnJlbW92ZUNvbnRyb2woJ2JpbGwnKTtcbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgRm9ybVJlY29yZCBleHRlbmRzIEZvcm1Hcm91cCB7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQXNzZXJ0cyB0aGF0IHRoZSBnaXZlbiBjb250cm9sIGlzIGFuIGluc3RhbmNlIG9mIGBGb3JtUmVjb3JkYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY29uc3QgaXNGb3JtUmVjb3JkID0gKGNvbnRyb2wpID0+IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtUmVjb3JkO1xuXG4vKipcbiAqIFRva2VuIHRvIHByb3ZpZGUgdG8gYWxsb3cgU2V0RGlzYWJsZWRTdGF0ZSB0byBhbHdheXMgYmUgY2FsbGVkIHdoZW4gYSBDVkEgaXMgYWRkZWQsIHJlZ2FyZGxlc3Mgb2ZcbiAqIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQgb3IgZW5hYmxlZC5cbiAqXG4gKiBAc2VlIHtAbGluayBGb3Jtc01vZHVsZSN3aXRoY29uZmlnfVxuICovXG5jb25zdCBDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSA9IG5ldyBJbmplY3Rpb25Ub2tlbignQ2FsbFNldERpc2FibGVkU3RhdGUnLCB7IHByb3ZpZGVkSW46ICdyb290JywgZmFjdG9yeTogKCkgPT4gc2V0RGlzYWJsZWRTdGF0ZURlZmF1bHQgfSk7XG4vKipcbiAqIFdoZXRoZXIgdG8gdXNlIHRoZSBmaXhlZCBzZXREaXNhYmxlZFN0YXRlIGJlaGF2aW9yIGJ5IGRlZmF1bHQuXG4gKi9cbmNvbnN0IHNldERpc2FibGVkU3RhdGVEZWZhdWx0ID0gJ2Fsd2F5cyc7XG5mdW5jdGlvbiBjb250cm9sUGF0aChuYW1lLCBwYXJlbnQpIHtcbiAgICByZXR1cm4gWy4uLnBhcmVudC5wYXRoLCBuYW1lXTtcbn1cbi8qKlxuICogTGlua3MgYSBGb3JtIGNvbnRyb2wgYW5kIGEgRm9ybSBkaXJlY3RpdmUgYnkgc2V0dGluZyB1cCBjYWxsYmFja3MgKHN1Y2ggYXMgYG9uQ2hhbmdlYCkgb24gYm90aFxuICogaW5zdGFuY2VzLiBUaGlzIGZ1bmN0aW9uIGlzIHR5cGljYWxseSBpbnZva2VkIHdoZW4gZm9ybSBkaXJlY3RpdmUgaXMgYmVpbmcgaW5pdGlhbGl6ZWQuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIGluc3RhbmNlIHRoYXQgc2hvdWxkIGJlIGxpbmtlZC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIHRoYXQgc2hvdWxkIGJlIGxpbmtlZCB3aXRoIGEgZ2l2ZW4gY29udHJvbC5cbiAqL1xuZnVuY3Rpb24gc2V0VXBDb250cm9sKGNvbnRyb2wsIGRpciwgY2FsbFNldERpc2FibGVkU3RhdGUgPSBzZXREaXNhYmxlZFN0YXRlRGVmYXVsdCkge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgaWYgKCFjb250cm9sKVxuICAgICAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnQ2Fubm90IGZpbmQgY29udHJvbCB3aXRoJyk7XG4gICAgICAgIGlmICghZGlyLnZhbHVlQWNjZXNzb3IpXG4gICAgICAgICAgICBfdGhyb3dNaXNzaW5nVmFsdWVBY2Nlc3NvckVycm9yKGRpcik7XG4gICAgfVxuICAgIHNldFVwVmFsaWRhdG9ycyhjb250cm9sLCBkaXIpO1xuICAgIGRpci52YWx1ZUFjY2Vzc29yLndyaXRlVmFsdWUoY29udHJvbC52YWx1ZSk7XG4gICAgLy8gVGhlIGxlZ2FjeSBiZWhhdmlvciBvbmx5IGNhbGxzIHRoZSBDVkEncyBgc2V0RGlzYWJsZWRTdGF0ZWAgaWYgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAgLy8gSWYgdGhlIGBjYWxsU2V0RGlzYWJsZWRTdGF0ZWAgb3B0aW9uIGlzIHNldCB0byBgYWx3YXlzYCwgdGhlbiB0aGlzIGJ1ZyBpcyBmaXhlZCBhbmRcbiAgICAvLyB0aGUgbWV0aG9kIGlzIGFsd2F5cyBjYWxsZWQuXG4gICAgaWYgKGNvbnRyb2wuZGlzYWJsZWQgfHwgY2FsbFNldERpc2FibGVkU3RhdGUgPT09ICdhbHdheXMnKSB7XG4gICAgICAgIGRpci52YWx1ZUFjY2Vzc29yLnNldERpc2FibGVkU3RhdGU/Lihjb250cm9sLmRpc2FibGVkKTtcbiAgICB9XG4gICAgc2V0VXBWaWV3Q2hhbmdlUGlwZWxpbmUoY29udHJvbCwgZGlyKTtcbiAgICBzZXRVcE1vZGVsQ2hhbmdlUGlwZWxpbmUoY29udHJvbCwgZGlyKTtcbiAgICBzZXRVcEJsdXJQaXBlbGluZShjb250cm9sLCBkaXIpO1xuICAgIHNldFVwRGlzYWJsZWRDaGFuZ2VIYW5kbGVyKGNvbnRyb2wsIGRpcik7XG59XG4vKipcbiAqIFJldmVydHMgY29uZmlndXJhdGlvbiBwZXJmb3JtZWQgYnkgdGhlIGBzZXRVcENvbnRyb2xgIGNvbnRyb2wgZnVuY3Rpb24uXG4gKiBFZmZlY3RpdmVseSBkaXNjb25uZWN0cyBmb3JtIGNvbnRyb2wgd2l0aCBhIGdpdmVuIGZvcm0gZGlyZWN0aXZlLlxuICogVGhpcyBmdW5jdGlvbiBpcyB0eXBpY2FsbHkgaW52b2tlZCB3aGVuIGNvcnJlc3BvbmRpbmcgZm9ybSBkaXJlY3RpdmUgaXMgYmVpbmcgZGVzdHJveWVkLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB3aGljaCBzaG91bGQgYmUgY2xlYW5lZCB1cC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIHRoYXQgc2hvdWxkIGJlIGRpc2Nvbm5lY3RlZCBmcm9tIGEgZ2l2ZW4gY29udHJvbC5cbiAqIEBwYXJhbSB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlIEZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBvbkNoYW5nZSBoYW5kbGVyIHNob3VsZFxuICogICAgIGNvbnRhaW4gYXNzZXJ0cyB0byB2ZXJpZnkgdGhhdCBpdCdzIG5vdCBjYWxsZWQgb25jZSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLiBXZSBuZWVkIHRoaXMgZmxhZ1xuICogICAgIHRvIGF2b2lkIHBvdGVudGlhbGx5IGJyZWFraW5nIGNoYW5nZXMgY2F1c2VkIGJ5IGJldHRlciBjb250cm9sIGNsZWFudXAgaW50cm9kdWNlZCBpbiAjMzkyMzUuXG4gKi9cbmZ1bmN0aW9uIGNsZWFuVXBDb250cm9sKGNvbnRyb2wsIGRpciwgdmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZSA9IHRydWUpIHtcbiAgICBjb25zdCBub29wID0gKCkgPT4ge1xuICAgICAgICBpZiAodmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgICAgX25vQ29udHJvbEVycm9yKGRpcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vIFRoZSBgdmFsdWVBY2Nlc3NvcmAgZmllbGQgaXMgdHlwaWNhbGx5IGRlZmluZWQgb24gRnJvbUNvbnRyb2wgYW5kIEZvcm1Db250cm9sTmFtZSBkaXJlY3RpdmVcbiAgICAvLyBpbnN0YW5jZXMgYW5kIHRoZXJlIGlzIGEgbG9naWMgaW4gYHNlbGVjdFZhbHVlQWNjZXNzb3JgIGZ1bmN0aW9uIHRoYXQgdGhyb3dzIGlmIGl0J3Mgbm90IHRoZVxuICAgIC8vIGNhc2UuIFdlIHN0aWxsIGNoZWNrIHRoZSBwcmVzZW5jZSBvZiBgdmFsdWVBY2Nlc3NvcmAgYmVmb3JlIGludm9raW5nIGl0cyBtZXRob2RzIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHRoYXQgY2xlYW51cCB3b3JrcyBjb3JyZWN0bHkgaWYgYXBwIGNvZGUgb3IgdGVzdHMgYXJlIHNldHVwIHRvIGlnbm9yZSB0aGUgZXJyb3IgdGhyb3duIGZyb21cbiAgICAvLyBgc2VsZWN0VmFsdWVBY2Nlc3NvcmAuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy80MDUyMS5cbiAgICBpZiAoZGlyLnZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgZGlyLnZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPbkNoYW5nZShub29wKTtcbiAgICAgICAgZGlyLnZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPblRvdWNoZWQobm9vcCk7XG4gICAgfVxuICAgIGNsZWFuVXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpcik7XG4gICAgaWYgKGNvbnRyb2wpIHtcbiAgICAgICAgZGlyLl9pbnZva2VPbkRlc3Ryb3lDYWxsYmFja3MoKTtcbiAgICAgICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4geyB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKHZhbGlkYXRvcnMsIG9uQ2hhbmdlKSB7XG4gICAgdmFsaWRhdG9ycy5mb3JFYWNoKCh2YWxpZGF0b3IpID0+IHtcbiAgICAgICAgaWYgKHZhbGlkYXRvci5yZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKVxuICAgICAgICAgICAgdmFsaWRhdG9yLnJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2Uob25DaGFuZ2UpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBTZXRzIHVwIGRpc2FibGVkIGNoYW5nZSBoYW5kbGVyIGZ1bmN0aW9uIG9uIGEgZ2l2ZW4gZm9ybSBjb250cm9sIGlmIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gKiBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBkaXJlY3RpdmUgaW5zdGFuY2Ugc3VwcG9ydHMgdGhlIGBzZXREaXNhYmxlZFN0YXRlYCBjYWxsLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB3aGVyZSBkaXNhYmxlZCBjaGFuZ2UgaGFuZGxlciBzaG91bGQgYmUgc2V0dXAuXG4gKiBAcGFyYW0gZGlyIENvcnJlc3BvbmRpbmcgZGlyZWN0aXZlIGluc3RhbmNlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNvbnRyb2wuXG4gKi9cbmZ1bmN0aW9uIHNldFVwRGlzYWJsZWRDaGFuZ2VIYW5kbGVyKGNvbnRyb2wsIGRpcikge1xuICAgIGlmIChkaXIudmFsdWVBY2Nlc3Nvci5zZXREaXNhYmxlZFN0YXRlKSB7XG4gICAgICAgIGNvbnN0IG9uRGlzYWJsZWRDaGFuZ2UgPSAoaXNEaXNhYmxlZCkgPT4ge1xuICAgICAgICAgICAgZGlyLnZhbHVlQWNjZXNzb3Iuc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29udHJvbC5yZWdpc3Rlck9uRGlzYWJsZWRDaGFuZ2Uob25EaXNhYmxlZENoYW5nZSk7XG4gICAgICAgIC8vIFJlZ2lzdGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2xlYW51cCBkaXNhYmxlZCBjaGFuZ2UgaGFuZGxlclxuICAgICAgICAvLyBmcm9tIGEgY29udHJvbCBpbnN0YW5jZSB3aGVuIGEgZGlyZWN0aXZlIGlzIGRlc3Ryb3llZC5cbiAgICAgICAgZGlyLl9yZWdpc3Rlck9uRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgICBjb250cm9sLl91bnJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShvbkRpc2FibGVkQ2hhbmdlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLyoqXG4gKiBTZXRzIHVwIHN5bmMgYW5kIGFzeW5jIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIG9uIHByb3ZpZGVkIGZvcm0gY29udHJvbC5cbiAqIFRoaXMgZnVuY3Rpb24gbWVyZ2VzIHZhbGlkYXRvcnMgZnJvbSB0aGUgZGlyZWN0aXZlIGludG8gdGhlIHZhbGlkYXRvcnMgb2YgdGhlIGNvbnRyb2wuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIHdoZXJlIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIHNob3VsZCBiZSBzZXR1cC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIGluc3RhbmNlIHRoYXQgY29udGFpbnMgdmFsaWRhdG9ycyB0byBiZSBzZXR1cC5cbiAqL1xuZnVuY3Rpb24gc2V0VXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpcikge1xuICAgIGNvbnN0IHZhbGlkYXRvcnMgPSBnZXRDb250cm9sVmFsaWRhdG9ycyhjb250cm9sKTtcbiAgICBpZiAoZGlyLnZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgICAgICBjb250cm9sLnNldFZhbGlkYXRvcnMobWVyZ2VWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIGRpci52YWxpZGF0b3IpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHZhbGlkYXRvcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gSWYgc3luYyB2YWxpZGF0b3JzIGFyZSByZXByZXNlbnRlZCBieSBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb24sIHdlIGZvcmNlIHRoZVxuICAgICAgICAvLyBgVmFsaWRhdG9ycy5jb21wb3NlYCBjYWxsIHRvIGhhcHBlbiBieSBleGVjdXRpbmcgdGhlIGBzZXRWYWxpZGF0b3JzYCBmdW5jdGlvbiB3aXRoXG4gICAgICAgIC8vIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhhdCBmdW5jdGlvbi4gV2UgbmVlZCB0aGlzIHRvIGF2b2lkIHBvc3NpYmxlIGRpc2NyZXBhbmNpZXMgaW5cbiAgICAgICAgLy8gdmFsaWRhdG9ycyBiZWhhdmlvciwgc28gc3luYyB2YWxpZGF0b3JzIGFyZSBhbHdheXMgcHJvY2Vzc2VkIGJ5IHRoZSBgVmFsaWRhdG9ycy5jb21wb3NlYC5cbiAgICAgICAgLy8gTm90ZTogd2Ugc2hvdWxkIGNvbnNpZGVyIG1vdmluZyB0aGlzIGxvZ2ljIGluc2lkZSB0aGUgYHNldFZhbGlkYXRvcnNgIGZ1bmN0aW9uIGl0c2VsZiwgc28gd2VcbiAgICAgICAgLy8gaGF2ZSBjb25zaXN0ZW50IGJlaGF2aW9yIG9uIEFic3RyYWN0Q29udHJvbCBBUEkgbGV2ZWwuIFRoZSBzYW1lIGFwcGxpZXMgdG8gdGhlIGFzeW5jXG4gICAgICAgIC8vIHZhbGlkYXRvcnMgbG9naWMgYmVsb3cuXG4gICAgICAgIGNvbnRyb2wuc2V0VmFsaWRhdG9ycyhbdmFsaWRhdG9yc10pO1xuICAgIH1cbiAgICBjb25zdCBhc3luY1ZhbGlkYXRvcnMgPSBnZXRDb250cm9sQXN5bmNWYWxpZGF0b3JzKGNvbnRyb2wpO1xuICAgIGlmIChkaXIuYXN5bmNWYWxpZGF0b3IgIT09IG51bGwpIHtcbiAgICAgICAgY29udHJvbC5zZXRBc3luY1ZhbGlkYXRvcnMobWVyZ2VWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycywgZGlyLmFzeW5jVmFsaWRhdG9yKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBhc3luY1ZhbGlkYXRvcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29udHJvbC5zZXRBc3luY1ZhbGlkYXRvcnMoW2FzeW5jVmFsaWRhdG9yc10pO1xuICAgIH1cbiAgICAvLyBSZS1ydW4gdmFsaWRhdGlvbiB3aGVuIHZhbGlkYXRvciBiaW5kaW5nIGNoYW5nZXMsIGUuZy4gbWlubGVuZ3RoPTMgLT4gbWlubGVuZ3RoPTRcbiAgICBjb25zdCBvblZhbGlkYXRvckNoYW5nZSA9ICgpID0+IGNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZGlyLl9yYXdWYWxpZGF0b3JzLCBvblZhbGlkYXRvckNoYW5nZSk7XG4gICAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShkaXIuX3Jhd0FzeW5jVmFsaWRhdG9ycywgb25WYWxpZGF0b3JDaGFuZ2UpO1xufVxuLyoqXG4gKiBDbGVhbnMgdXAgc3luYyBhbmQgYXN5bmMgZGlyZWN0aXZlIHZhbGlkYXRvcnMgb24gcHJvdmlkZWQgZm9ybSBjb250cm9sLlxuICogVGhpcyBmdW5jdGlvbiByZXZlcnRzIHRoZSBzZXR1cCBwZXJmb3JtZWQgYnkgdGhlIGBzZXRVcFZhbGlkYXRvcnNgIGZ1bmN0aW9uLCBpLmUuXG4gKiByZW1vdmVzIGRpcmVjdGl2ZS1zcGVjaWZpYyB2YWxpZGF0b3JzIGZyb20gYSBnaXZlbiBjb250cm9sIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCBmcm9tIHdoZXJlIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIHNob3VsZCBiZSByZW1vdmVkLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgaW5zdGFuY2UgdGhhdCBjb250YWlucyB2YWxpZGF0b3JzIHRvIGJlIHJlbW92ZWQuXG4gKiBAcmV0dXJucyB0cnVlIGlmIGEgY29udHJvbCB3YXMgdXBkYXRlZCBhcyBhIHJlc3VsdCBvZiB0aGlzIGFjdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2xlYW5VcFZhbGlkYXRvcnMoY29udHJvbCwgZGlyKSB7XG4gICAgbGV0IGlzQ29udHJvbFVwZGF0ZWQgPSBmYWxzZTtcbiAgICBpZiAoY29udHJvbCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoZGlyLnZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9ycyA9IGdldENvbnRyb2xWYWxpZGF0b3JzKGNvbnRyb2wpO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgJiYgdmFsaWRhdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBkaXJlY3RpdmUgdmFsaWRhdG9yIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRWYWxpZGF0b3JzID0gdmFsaWRhdG9ycy5maWx0ZXIoKHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yICE9PSBkaXIudmFsaWRhdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlZFZhbGlkYXRvcnMubGVuZ3RoICE9PSB2YWxpZGF0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpc0NvbnRyb2xVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbC5zZXRWYWxpZGF0b3JzKHVwZGF0ZWRWYWxpZGF0b3JzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpci5hc3luY1ZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgYXN5bmNWYWxpZGF0b3JzID0gZ2V0Q29udHJvbEFzeW5jVmFsaWRhdG9ycyhjb250cm9sKTtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFzeW5jVmFsaWRhdG9ycykgJiYgYXN5bmNWYWxpZGF0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGRpcmVjdGl2ZSBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZEFzeW5jVmFsaWRhdG9ycyA9IGFzeW5jVmFsaWRhdG9ycy5maWx0ZXIoKGFzeW5jVmFsaWRhdG9yKSA9PiBhc3luY1ZhbGlkYXRvciAhPT0gZGlyLmFzeW5jVmFsaWRhdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlZEFzeW5jVmFsaWRhdG9ycy5sZW5ndGggIT09IGFzeW5jVmFsaWRhdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNDb250cm9sVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2wuc2V0QXN5bmNWYWxpZGF0b3JzKHVwZGF0ZWRBc3luY1ZhbGlkYXRvcnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBDbGVhciBvblZhbGlkYXRvckNoYW5nZSBjYWxsYmFja3MgYnkgcHJvdmlkaW5nIGEgbm9vcCBmdW5jdGlvbi5cbiAgICBjb25zdCBub29wID0gKCkgPT4geyB9O1xuICAgIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZGlyLl9yYXdWYWxpZGF0b3JzLCBub29wKTtcbiAgICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGRpci5fcmF3QXN5bmNWYWxpZGF0b3JzLCBub29wKTtcbiAgICByZXR1cm4gaXNDb250cm9sVXBkYXRlZDtcbn1cbmZ1bmN0aW9uIHNldFVwVmlld0NoYW5nZVBpcGVsaW5lKGNvbnRyb2wsIGRpcikge1xuICAgIGRpci52YWx1ZUFjY2Vzc29yLnJlZ2lzdGVyT25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBjb250cm9sLl9wZW5kaW5nQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgY29udHJvbC5fcGVuZGluZ0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKGNvbnRyb2wudXBkYXRlT24gPT09ICdjaGFuZ2UnKVxuICAgICAgICAgICAgdXBkYXRlQ29udHJvbChjb250cm9sLCBkaXIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gc2V0VXBCbHVyUGlwZWxpbmUoY29udHJvbCwgZGlyKSB7XG4gICAgZGlyLnZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPblRvdWNoZWQoKCkgPT4ge1xuICAgICAgICBjb250cm9sLl9wZW5kaW5nVG91Y2hlZCA9IHRydWU7XG4gICAgICAgIGlmIChjb250cm9sLnVwZGF0ZU9uID09PSAnYmx1cicgJiYgY29udHJvbC5fcGVuZGluZ0NoYW5nZSlcbiAgICAgICAgICAgIHVwZGF0ZUNvbnRyb2woY29udHJvbCwgZGlyKTtcbiAgICAgICAgaWYgKGNvbnRyb2wudXBkYXRlT24gIT09ICdzdWJtaXQnKVxuICAgICAgICAgICAgY29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB1cGRhdGVDb250cm9sKGNvbnRyb2wsIGRpcikge1xuICAgIGlmIChjb250cm9sLl9wZW5kaW5nRGlydHkpXG4gICAgICAgIGNvbnRyb2wubWFya0FzRGlydHkoKTtcbiAgICBjb250cm9sLnNldFZhbHVlKGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSwgeyBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlIH0pO1xuICAgIGRpci52aWV3VG9Nb2RlbFVwZGF0ZShjb250cm9sLl9wZW5kaW5nVmFsdWUpO1xuICAgIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHNldFVwTW9kZWxDaGFuZ2VQaXBlbGluZShjb250cm9sLCBkaXIpIHtcbiAgICBjb25zdCBvbkNoYW5nZSA9IChuZXdWYWx1ZSwgZW1pdE1vZGVsRXZlbnQpID0+IHtcbiAgICAgICAgLy8gY29udHJvbCAtPiB2aWV3XG4gICAgICAgIGRpci52YWx1ZUFjY2Vzc29yLndyaXRlVmFsdWUobmV3VmFsdWUpO1xuICAgICAgICAvLyBjb250cm9sIC0+IG5nTW9kZWxcbiAgICAgICAgaWYgKGVtaXRNb2RlbEV2ZW50KVxuICAgICAgICAgICAgZGlyLnZpZXdUb01vZGVsVXBkYXRlKG5ld1ZhbHVlKTtcbiAgICB9O1xuICAgIGNvbnRyb2wucmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZSk7XG4gICAgLy8gUmVnaXN0ZXIgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjbGVhbnVwIG9uQ2hhbmdlIGhhbmRsZXJcbiAgICAvLyBmcm9tIGEgY29udHJvbCBpbnN0YW5jZSB3aGVuIGEgZGlyZWN0aXZlIGlzIGRlc3Ryb3llZC5cbiAgICBkaXIuX3JlZ2lzdGVyT25EZXN0cm95KCgpID0+IHtcbiAgICAgICAgY29udHJvbC5fdW5yZWdpc3Rlck9uQ2hhbmdlKG9uQ2hhbmdlKTtcbiAgICB9KTtcbn1cbi8qKlxuICogTGlua3MgYSBGb3JtR3JvdXAgb3IgRm9ybUFycmF5IGluc3RhbmNlIGFuZCBjb3JyZXNwb25kaW5nIEZvcm0gZGlyZWN0aXZlIGJ5IHNldHRpbmcgdXAgdmFsaWRhdG9yc1xuICogcHJlc2VudCBpbiB0aGUgdmlldy5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtR3JvdXAgb3IgRm9ybUFycmF5IGluc3RhbmNlIHRoYXQgc2hvdWxkIGJlIGxpbmtlZC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIHRoYXQgcHJvdmlkZXMgdmlldyB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBzZXRVcEZvcm1Db250YWluZXIoY29udHJvbCwgZGlyKSB7XG4gICAgaWYgKGNvbnRyb2wgPT0gbnVsbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnQ2Fubm90IGZpbmQgY29udHJvbCB3aXRoJyk7XG4gICAgc2V0VXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpcik7XG59XG4vKipcbiAqIFJldmVydHMgdGhlIHNldHVwIHBlcmZvcm1lZCBieSB0aGUgYHNldFVwRm9ybUNvbnRhaW5lcmAgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybUdyb3VwIG9yIEZvcm1BcnJheSBpbnN0YW5jZSB0aGF0IHNob3VsZCBiZSBjbGVhbmVkIHVwLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgdGhhdCBwcm92aWRlZCB2aWV3IHZhbGlkYXRvcnMuXG4gKiBAcmV0dXJucyB0cnVlIGlmIGEgY29udHJvbCB3YXMgdXBkYXRlZCBhcyBhIHJlc3VsdCBvZiB0aGlzIGFjdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2xlYW5VcEZvcm1Db250YWluZXIoY29udHJvbCwgZGlyKSB7XG4gICAgcmV0dXJuIGNsZWFuVXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpcik7XG59XG5mdW5jdGlvbiBfbm9Db250cm9sRXJyb3IoZGlyKSB7XG4gICAgcmV0dXJuIF90aHJvd0Vycm9yKGRpciwgJ1RoZXJlIGlzIG5vIEZvcm1Db250cm9sIGluc3RhbmNlIGF0dGFjaGVkIHRvIGZvcm0gY29udHJvbCBlbGVtZW50IHdpdGgnKTtcbn1cbmZ1bmN0aW9uIF90aHJvd0Vycm9yKGRpciwgbWVzc2FnZSkge1xuICAgIGNvbnN0IG1lc3NhZ2VFbmQgPSBfZGVzY3JpYmVDb250cm9sTG9jYXRpb24oZGlyKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZX0gJHttZXNzYWdlRW5kfWApO1xufVxuZnVuY3Rpb24gX2Rlc2NyaWJlQ29udHJvbExvY2F0aW9uKGRpcikge1xuICAgIGNvbnN0IHBhdGggPSBkaXIucGF0aDtcbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCA+IDEpXG4gICAgICAgIHJldHVybiBgcGF0aDogJyR7cGF0aC5qb2luKCcgLT4gJyl9J2A7XG4gICAgaWYgKHBhdGg/LlswXSlcbiAgICAgICAgcmV0dXJuIGBuYW1lOiAnJHtwYXRofSdgO1xuICAgIHJldHVybiAndW5zcGVjaWZpZWQgbmFtZSBhdHRyaWJ1dGUnO1xufVxuZnVuY3Rpb24gX3Rocm93TWlzc2luZ1ZhbHVlQWNjZXNzb3JFcnJvcihkaXIpIHtcbiAgICBjb25zdCBsb2MgPSBfZGVzY3JpYmVDb250cm9sTG9jYXRpb24oZGlyKTtcbiAgICB0aHJvdyBuZXcgybVSdW50aW1lRXJyb3IoLTEyMDMgLyogUnVudGltZUVycm9yQ29kZS5OR19NSVNTSU5HX1ZBTFVFX0FDQ0VTU09SICovLCBgTm8gdmFsdWUgYWNjZXNzb3IgZm9yIGZvcm0gY29udHJvbCAke2xvY30uYCk7XG59XG5mdW5jdGlvbiBfdGhyb3dJbnZhbGlkVmFsdWVBY2Nlc3NvckVycm9yKGRpcikge1xuICAgIGNvbnN0IGxvYyA9IF9kZXNjcmliZUNvbnRyb2xMb2NhdGlvbihkaXIpO1xuICAgIHRocm93IG5ldyDJtVJ1bnRpbWVFcnJvcigxMjAwIC8qIFJ1bnRpbWVFcnJvckNvZGUuTkdfVkFMVUVfQUNDRVNTT1JfTk9UX1BST1ZJREVEICovLCBgVmFsdWUgYWNjZXNzb3Igd2FzIG5vdCBwcm92aWRlZCBhcyBhbiBhcnJheSBmb3IgZm9ybSBjb250cm9sIHdpdGggJHtsb2N9LiBgICtcbiAgICAgICAgYENoZWNrIHRoYXQgdGhlIFxcYE5HX1ZBTFVFX0FDQ0VTU09SXFxgIHRva2VuIGlzIGNvbmZpZ3VyZWQgYXMgYSBcXGBtdWx0aTogdHJ1ZVxcYCBwcm92aWRlci5gKTtcbn1cbmZ1bmN0aW9uIGlzUHJvcGVydHlVcGRhdGVkKGNoYW5nZXMsIHZpZXdNb2RlbCkge1xuICAgIGlmICghY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnbW9kZWwnKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGNoYW5nZSA9IGNoYW5nZXNbJ21vZGVsJ107XG4gICAgaWYgKGNoYW5nZS5pc0ZpcnN0Q2hhbmdlKCkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiAhT2JqZWN0LmlzKHZpZXdNb2RlbCwgY2hhbmdlLmN1cnJlbnRWYWx1ZSk7XG59XG5mdW5jdGlvbiBpc0J1aWx0SW5BY2Nlc3Nvcih2YWx1ZUFjY2Vzc29yKSB7XG4gICAgLy8gQ2hlY2sgaWYgYSBnaXZlbiB2YWx1ZSBhY2Nlc3NvciBpcyBhbiBpbnN0YW5jZSBvZiBhIGNsYXNzIHRoYXQgZGlyZWN0bHkgZXh0ZW5kc1xuICAgIC8vIGBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3JgIG9uZS5cbiAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlQWNjZXNzb3IuY29uc3RydWN0b3IpID09PSBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3I7XG59XG5mdW5jdGlvbiBzeW5jUGVuZGluZ0NvbnRyb2xzKGZvcm0sIGRpcmVjdGl2ZXMpIHtcbiAgICBmb3JtLl9zeW5jUGVuZGluZ0NvbnRyb2xzKCk7XG4gICAgZGlyZWN0aXZlcy5mb3JFYWNoKChkaXIpID0+IHtcbiAgICAgICAgY29uc3QgY29udHJvbCA9IGRpci5jb250cm9sO1xuICAgICAgICBpZiAoY29udHJvbC51cGRhdGVPbiA9PT0gJ3N1Ym1pdCcgJiYgY29udHJvbC5fcGVuZGluZ0NoYW5nZSkge1xuICAgICAgICAgICAgZGlyLnZpZXdUb01vZGVsVXBkYXRlKGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSk7XG4gICAgICAgICAgICBjb250cm9sLl9wZW5kaW5nQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIFRPRE86IHZzYXZraW4gcmVtb3ZlIGl0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzAxMSBpcyBpbXBsZW1lbnRlZFxuZnVuY3Rpb24gc2VsZWN0VmFsdWVBY2Nlc3NvcihkaXIsIHZhbHVlQWNjZXNzb3JzKSB7XG4gICAgaWYgKCF2YWx1ZUFjY2Vzc29ycylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlQWNjZXNzb3JzKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICAgICAgX3Rocm93SW52YWxpZFZhbHVlQWNjZXNzb3JFcnJvcihkaXIpO1xuICAgIGxldCBkZWZhdWx0QWNjZXNzb3IgPSB1bmRlZmluZWQ7XG4gICAgbGV0IGJ1aWx0aW5BY2Nlc3NvciA9IHVuZGVmaW5lZDtcbiAgICBsZXQgY3VzdG9tQWNjZXNzb3IgPSB1bmRlZmluZWQ7XG4gICAgdmFsdWVBY2Nlc3NvcnMuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBpZiAodi5jb25zdHJ1Y3RvciA9PT0gRGVmYXVsdFZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgICAgIGRlZmF1bHRBY2Nlc3NvciA9IHY7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNCdWlsdEluQWNjZXNzb3IodikpIHtcbiAgICAgICAgICAgIGlmIChidWlsdGluQWNjZXNzb3IgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpXG4gICAgICAgICAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnTW9yZSB0aGFuIG9uZSBidWlsdC1pbiB2YWx1ZSBhY2Nlc3NvciBtYXRjaGVzIGZvcm0gY29udHJvbCB3aXRoJyk7XG4gICAgICAgICAgICBidWlsdGluQWNjZXNzb3IgPSB2O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGN1c3RvbUFjY2Vzc29yICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKVxuICAgICAgICAgICAgICAgIF90aHJvd0Vycm9yKGRpciwgJ01vcmUgdGhhbiBvbmUgY3VzdG9tIHZhbHVlIGFjY2Vzc29yIG1hdGNoZXMgZm9ybSBjb250cm9sIHdpdGgnKTtcbiAgICAgICAgICAgIGN1c3RvbUFjY2Vzc29yID0gdjtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChjdXN0b21BY2Nlc3NvcilcbiAgICAgICAgcmV0dXJuIGN1c3RvbUFjY2Vzc29yO1xuICAgIGlmIChidWlsdGluQWNjZXNzb3IpXG4gICAgICAgIHJldHVybiBidWlsdGluQWNjZXNzb3I7XG4gICAgaWYgKGRlZmF1bHRBY2Nlc3NvcilcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRBY2Nlc3NvcjtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICAgIF90aHJvd0Vycm9yKGRpciwgJ05vIHZhbGlkIHZhbHVlIGFjY2Vzc29yIGZvciBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHJlbW92ZUxpc3RJdGVtJDEobGlzdCwgZWwpIHtcbiAgICBjb25zdCBpbmRleCA9IGxpc3QuaW5kZXhPZihlbCk7XG4gICAgaWYgKGluZGV4ID4gLTEpXG4gICAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbn1cbi8vIFRPRE8oa2FyYSk6IHJlbW92ZSBhZnRlciBkZXByZWNhdGlvbiBwZXJpb2RcbmZ1bmN0aW9uIF9uZ01vZGVsV2FybmluZyhuYW1lLCB0eXBlLCBpbnN0YW5jZSwgd2FybmluZ0NvbmZpZykge1xuICAgIGlmICh3YXJuaW5nQ29uZmlnID09PSAnbmV2ZXInKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKCgod2FybmluZ0NvbmZpZyA9PT0gbnVsbCB8fCB3YXJuaW5nQ29uZmlnID09PSAnb25jZScpICYmICF0eXBlLl9uZ01vZGVsV2FybmluZ1NlbnRPbmNlKSB8fFxuICAgICAgICAod2FybmluZ0NvbmZpZyA9PT0gJ2Fsd2F5cycgJiYgIWluc3RhbmNlLl9uZ01vZGVsV2FybmluZ1NlbnQpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihuZ01vZGVsV2FybmluZyhuYW1lKSk7XG4gICAgICAgIHR5cGUuX25nTW9kZWxXYXJuaW5nU2VudE9uY2UgPSB0cnVlO1xuICAgICAgICBpbnN0YW5jZS5fbmdNb2RlbFdhcm5pbmdTZW50ID0gdHJ1ZTtcbiAgICB9XG59XG5cbmNvbnN0IGZvcm1EaXJlY3RpdmVQcm92aWRlciQxID0ge1xuICAgIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdGb3JtKVxufTtcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSQxID0gKCgpID0+IFByb21pc2UucmVzb2x2ZSgpKSgpO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSB0b3AtbGV2ZWwgYEZvcm1Hcm91cGAgaW5zdGFuY2UgYW5kIGJpbmRzIGl0IHRvIGEgZm9ybVxuICogdG8gdHJhY2sgYWdncmVnYXRlIGZvcm0gdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzLlxuICpcbiAqIEFzIHNvb24gYXMgeW91IGltcG9ydCB0aGUgYEZvcm1zTW9kdWxlYCwgdGhpcyBkaXJlY3RpdmUgYmVjb21lcyBhY3RpdmUgYnkgZGVmYXVsdCBvblxuICogYWxsIGA8Zm9ybT5gIHRhZ3MuICBZb3UgZG9uJ3QgbmVlZCB0byBhZGQgYSBzcGVjaWFsIHNlbGVjdG9yLlxuICpcbiAqIFlvdSBvcHRpb25hbGx5IGV4cG9ydCB0aGUgZGlyZWN0aXZlIGludG8gYSBsb2NhbCB0ZW1wbGF0ZSB2YXJpYWJsZSB1c2luZyBgbmdGb3JtYCBhcyB0aGUga2V5XG4gKiAoZXg6IGAjbXlGb3JtPVwibmdGb3JtXCJgKS4gVGhpcyBpcyBvcHRpb25hbCwgYnV0IHVzZWZ1bC4gIE1hbnkgcHJvcGVydGllcyBmcm9tIHRoZSB1bmRlcmx5aW5nXG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSBhcmUgZHVwbGljYXRlZCBvbiB0aGUgZGlyZWN0aXZlIGl0c2VsZiwgc28gYSByZWZlcmVuY2UgdG8gaXRcbiAqIGdpdmVzIHlvdSBhY2Nlc3MgdG8gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdHVzIG9mIHRoZSBmb3JtLCBhcyB3ZWxsIGFzXG4gKiB1c2VyIGludGVyYWN0aW9uIHByb3BlcnRpZXMgbGlrZSBgZGlydHlgIGFuZCBgdG91Y2hlZGAuXG4gKlxuICogVG8gcmVnaXN0ZXIgY2hpbGQgY29udHJvbHMgd2l0aCB0aGUgZm9ybSwgdXNlIGBOZ01vZGVsYCB3aXRoIGEgYG5hbWVgXG4gKiBhdHRyaWJ1dGUuIFlvdSBtYXkgdXNlIGBOZ01vZGVsR3JvdXBgIHRvIGNyZWF0ZSBzdWItZ3JvdXBzIHdpdGhpbiB0aGUgZm9ybS5cbiAqXG4gKiBJZiBuZWNlc3NhcnksIGxpc3RlbiB0byB0aGUgZGlyZWN0aXZlJ3MgYG5nU3VibWl0YCBldmVudCB0byBiZSBub3RpZmllZCB3aGVuIHRoZSB1c2VyIGhhc1xuICogdHJpZ2dlcmVkIGEgZm9ybSBzdWJtaXNzaW9uLiBUaGUgYG5nU3VibWl0YCBldmVudCBlbWl0cyB0aGUgb3JpZ2luYWwgZm9ybVxuICogc3VibWlzc2lvbiBldmVudC5cbiAqXG4gKiBJbiB0ZW1wbGF0ZSBkcml2ZW4gZm9ybXMsIGFsbCBgPGZvcm0+YCB0YWdzIGFyZSBhdXRvbWF0aWNhbGx5IHRhZ2dlZCBhcyBgTmdGb3JtYC5cbiAqIFRvIGltcG9ydCB0aGUgYEZvcm1zTW9kdWxlYCBidXQgc2tpcCBpdHMgdXNhZ2UgaW4gc29tZSBmb3JtcyxcbiAqIGZvciBleGFtcGxlLCB0byB1c2UgbmF0aXZlIEhUTUw1IHZhbGlkYXRpb24sIGFkZCB0aGUgYG5nTm9Gb3JtYCBhbmQgdGhlIGA8Zm9ybT5gXG4gKiB0YWdzIHdvbid0IGNyZWF0ZSBhbiBgTmdGb3JtYCBkaXJlY3RpdmUuIEluIHJlYWN0aXZlIGZvcm1zLCB1c2luZyBgbmdOb0Zvcm1gIGlzXG4gKiB1bm5lY2Vzc2FyeSBiZWNhdXNlIHRoZSBgPGZvcm0+YCB0YWdzIGFyZSBpbmVydC4gSW4gdGhhdCBjYXNlLCB5b3Ugd291bGRcbiAqIHJlZnJhaW4gZnJvbSB1c2luZyB0aGUgYGZvcm1Hcm91cGAgZGlyZWN0aXZlLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIExpc3RlbmluZyBmb3IgZm9ybSBzdWJtaXNzaW9uXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBjYXB0dXJlIHRoZSBmb3JtIHZhbHVlcyBmcm9tIHRoZSBcIm5nU3VibWl0XCIgZXZlbnQuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm0vc2ltcGxlX2Zvcm1fZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogIyMjIFNldHRpbmcgdGhlIHVwZGF0ZSBvcHRpb25zXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHlvdSBob3cgdG8gY2hhbmdlIHRoZSBcInVwZGF0ZU9uXCIgb3B0aW9uIGZyb20gaXRzIGRlZmF1bHQgdXNpbmdcbiAqIG5nRm9ybU9wdGlvbnMuXG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0gW25nRm9ybU9wdGlvbnNdPVwie3VwZGF0ZU9uOiAnYmx1cid9XCI+XG4gKiAgICA8aW5wdXQgbmFtZT1cIm9uZVwiIG5nTW9kZWw+ICA8IS0tIHRoaXMgbmdNb2RlbCB3aWxsIHVwZGF0ZSBvbiBibHVyIC0tPlxuICogPC9mb3JtPlxuICogYGBgXG4gKlxuICogIyMjIE5hdGl2ZSBET00gdmFsaWRhdGlvbiBVSVxuICpcbiAqIEluIG9yZGVyIHRvIHByZXZlbnQgdGhlIG5hdGl2ZSBET00gZm9ybSB2YWxpZGF0aW9uIFVJIGZyb20gaW50ZXJmZXJpbmcgd2l0aCBBbmd1bGFyJ3MgZm9ybVxuICogdmFsaWRhdGlvbiwgQW5ndWxhciBhdXRvbWF0aWNhbGx5IGFkZHMgdGhlIGBub3ZhbGlkYXRlYCBhdHRyaWJ1dGUgb24gYW55IGA8Zm9ybT5gIHdoZW5ldmVyXG4gKiBgRm9ybU1vZHVsZWAgb3IgYFJlYWN0aXZlRm9ybU1vZHVsZWAgYXJlIGltcG9ydGVkIGludG8gdGhlIGFwcGxpY2F0aW9uLlxuICogSWYgeW91IHdhbnQgdG8gZXhwbGljaXRseSBlbmFibGUgbmF0aXZlIERPTSB2YWxpZGF0aW9uIFVJIHdpdGggQW5ndWxhciBmb3JtcywgeW91IGNhbiBhZGQgdGhlXG4gKiBgbmdOYXRpdmVWYWxpZGF0ZWAgYXR0cmlidXRlIHRvIHRoZSBgPGZvcm0+YCBlbGVtZW50OlxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtIG5nTmF0aXZlVmFsaWRhdGU+XG4gKiAgIC4uLlxuICogPC9mb3JtPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIE5nRm9ybSBleHRlbmRzIENvbnRyb2xDb250YWluZXIge1xuICAgIGNvbnN0cnVjdG9yKHZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9ycywgY2FsbFNldERpc2FibGVkU3RhdGUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSA9IGNhbGxTZXREaXNhYmxlZFN0YXRlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgZm9ybSBzdWJtaXNzaW9uIGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RpcmVjdGl2ZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogRXZlbnQgZW1pdHRlciBmb3IgdGhlIFwibmdTdWJtaXRcIiBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uZ1N1Ym1pdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5mb3JtID1cbiAgICAgICAgICAgIG5ldyBGb3JtR3JvdXAoe30sIGNvbXBvc2VWYWxpZGF0b3JzKHZhbGlkYXRvcnMpLCBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycykpO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGdldCBmb3JtRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhlIGludGVybmFsIGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGdldCBjb250cm9sKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGlzIGdyb3VwLiBCZWNhdXNlIHRoaXMgZGlyZWN0aXZlXG4gICAgICogYWx3YXlzIGxpdmVzIGF0IHRoZSB0b3AgbGV2ZWwgb2YgYSBmb3JtLCBpdCBpcyBhbHdheXMgYW4gZW1wdHkgYXJyYXkuXG4gICAgICovXG4gICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhIG1hcCBvZiB0aGUgY29udHJvbHMgaW4gdGhpcyBncm91cC5cbiAgICAgKi9cbiAgICBnZXQgY29udHJvbHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0uY29udHJvbHM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIE1ldGhvZCB0aGF0IHNldHMgdXAgdGhlIGNvbnRyb2wgZGlyZWN0aXZlIGluIHRoaXMgZ3JvdXAsIHJlLWNhbGN1bGF0ZXMgaXRzIHZhbHVlXG4gICAgICogYW5kIHZhbGlkaXR5LCBhbmQgYWRkcyB0aGUgaW5zdGFuY2UgdG8gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgYWRkQ29udHJvbChkaXIpIHtcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlJDEudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgICAgICAgIGRpci5jb250cm9sID1cbiAgICAgICAgICAgICAgICBjb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBkaXIuY29udHJvbCk7XG4gICAgICAgICAgICBzZXRVcENvbnRyb2woZGlyLmNvbnRyb2wsIGRpciwgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSk7XG4gICAgICAgICAgICBkaXIuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGl2ZXMuYWRkKGRpcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgZnJvbSB0aGUgcHJvdmlkZWQgYE5nTW9kZWxgIGRpcmVjdGl2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0Q29udHJvbChkaXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZW1vdmVzIHRoZSBgTmdNb2RlbGAgaW5zdGFuY2UgZnJvbSB0aGUgaW50ZXJuYWwgbGlzdCBvZiBkaXJlY3RpdmVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHJlbW92ZUNvbnRyb2woZGlyKSB7XG4gICAgICAgIHJlc29sdmVkUHJvbWlzZSQxLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fZmluZENvbnRhaW5lcihkaXIucGF0aCk7XG4gICAgICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNvbnRyb2woZGlyLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aXZlcy5kZWxldGUoZGlyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEFkZHMgYSBuZXcgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlIHRvIHRoZSBmb3JtLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGFkZEZvcm1Hcm91cChkaXIpIHtcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlJDEudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gbmV3IEZvcm1Hcm91cCh7fSk7XG4gICAgICAgICAgICBzZXRVcEZvcm1Db250YWluZXIoZ3JvdXAsIGRpcik7XG4gICAgICAgICAgICBjb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBncm91cCk7XG4gICAgICAgICAgICBncm91cC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlbW92ZXMgdGhlIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZSBmcm9tIHRoZSBmb3JtLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHJlbW92ZUZvcm1Hcm91cChkaXIpIHtcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlJDEudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ29udHJvbChkaXIubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtR3JvdXBgIGZvciBhIHByb3ZpZGVkIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGdldEZvcm1Hcm91cChkaXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBgTmdDb250cm9sYCBkaXJlY3RpdmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdDb250cm9sYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBkaXJlY3RpdmUncyBjb250cm9sLlxuICAgICAqL1xuICAgIHVwZGF0ZU1vZGVsKGRpciwgdmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlJDEudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjdHJsID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICAgICAgICBjdHJsLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFNldHMgdGhlIHZhbHVlIGZvciB0aGlzIGBGb3JtR3JvdXBgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWVcbiAgICAgKi9cbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIFwic3VibWl0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgICAqIFRyaWdnZXJzIHRoZSBgbmdTdWJtaXRgIGVtaXR0ZXIgdG8gZW1pdCB0aGUgXCJzdWJtaXRcIiBldmVudCBhcyBpdHMgcGF5bG9hZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZXZlbnQgVGhlIFwic3VibWl0XCIgZXZlbnQgb2JqZWN0XG4gICAgICovXG4gICAgb25TdWJtaXQoJGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc3luY1BlbmRpbmdDb250cm9scyh0aGlzLmZvcm0sIHRoaXMuX2RpcmVjdGl2ZXMpO1xuICAgICAgICB0aGlzLm5nU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICAgICAgLy8gRm9ybXMgd2l0aCBgbWV0aG9kPVwiZGlhbG9nXCJgIGhhdmUgc29tZSBzcGVjaWFsIGJlaGF2aW9yXG4gICAgICAgIC8vIHRoYXQgd29uJ3QgcmVsb2FkIHRoZSBwYWdlIGFuZCB0aGF0IHNob3VsZG4ndCBiZSBwcmV2ZW50ZWQuXG4gICAgICAgIHJldHVybiAkZXZlbnQ/LnRhcmdldD8ubWV0aG9kID09PSAnZGlhbG9nJztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBcInJlc2V0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgICAqL1xuICAgIG9uUmVzZXQoKSB7XG4gICAgICAgIHRoaXMucmVzZXRGb3JtKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlc2V0cyB0aGUgZm9ybSB0byBhbiBpbml0aWFsIHZhbHVlIGFuZCByZXNldHMgaXRzIHN1Ym1pdHRlZCBzdGF0dXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGZvcm0uXG4gICAgICovXG4gICAgcmVzZXRGb3JtKHZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZm9ybS5yZXNldCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgfVxuICAgIF9zZXRVcGRhdGVTdHJhdGVneSgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5mb3JtLl91cGRhdGVPbiA9IHRoaXMub3B0aW9ucy51cGRhdGVPbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfZmluZENvbnRhaW5lcihwYXRoKSB7XG4gICAgICAgIHBhdGgucG9wKCk7XG4gICAgICAgIHJldHVybiBwYXRoLmxlbmd0aCA/IHRoaXMuZm9ybS5nZXQocGF0aCkgOiB0aGlzLmZvcm07XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nRm9ybSwgZGVwczogW3sgdG9rZW46IE5HX1ZBTElEQVRPUlMsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IE5HX0FTWU5DX1ZBTElEQVRPUlMsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IENBTExfU0VUX0RJU0FCTEVEX1NUQVRFLCBvcHRpb25hbDogdHJ1ZSB9XSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBOZ0Zvcm0sIHNlbGVjdG9yOiBcImZvcm06bm90KFtuZ05vRm9ybV0pOm5vdChbZm9ybUdyb3VwXSksbmctZm9ybSxbbmdGb3JtXVwiLCBpbnB1dHM6IHsgb3B0aW9uczogW1wibmdGb3JtT3B0aW9uc1wiLCBcIm9wdGlvbnNcIl0gfSwgb3V0cHV0czogeyBuZ1N1Ym1pdDogXCJuZ1N1Ym1pdFwiIH0sIGhvc3Q6IHsgbGlzdGVuZXJzOiB7IFwic3VibWl0XCI6IFwib25TdWJtaXQoJGV2ZW50KVwiLCBcInJlc2V0XCI6IFwib25SZXNldCgpXCIgfSB9LCBwcm92aWRlcnM6IFtmb3JtRGlyZWN0aXZlUHJvdmlkZXIkMV0sIGV4cG9ydEFzOiBbXCJuZ0Zvcm1cIl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nRm9ybSwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnZm9ybTpub3QoW25nTm9Gb3JtXSk6bm90KFtmb3JtR3JvdXBdKSxuZy1mb3JtLFtuZ0Zvcm1dJyxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbZm9ybURpcmVjdGl2ZVByb3ZpZGVyJDFdLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICcoc3VibWl0KSc6ICdvblN1Ym1pdCgkZXZlbnQpJywgJyhyZXNldCknOiAnb25SZXNldCgpJyB9LFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBbJ25nU3VibWl0J10sXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydEFzOiAnbmdGb3JtJ1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX0FTWU5DX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtDQUxMX1NFVF9ESVNBQkxFRF9TVEFURV1cbiAgICAgICAgICAgICAgICB9XSB9XSwgcHJvcERlY29yYXRvcnM6IHsgb3B0aW9uczogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ25nRm9ybU9wdGlvbnMnXVxuICAgICAgICAgICAgfV0gfSB9KTtcblxuZnVuY3Rpb24gcmVtb3ZlTGlzdEl0ZW0obGlzdCwgZWwpIHtcbiAgICBjb25zdCBpbmRleCA9IGxpc3QuaW5kZXhPZihlbCk7XG4gICAgaWYgKGluZGV4ID4gLTEpXG4gICAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbn1cblxuZnVuY3Rpb24gaXNGb3JtQ29udHJvbFN0YXRlKGZvcm1TdGF0ZSkge1xuICAgIHJldHVybiB0eXBlb2YgZm9ybVN0YXRlID09PSAnb2JqZWN0JyAmJiBmb3JtU3RhdGUgIT09IG51bGwgJiZcbiAgICAgICAgT2JqZWN0LmtleXMoZm9ybVN0YXRlKS5sZW5ndGggPT09IDIgJiYgJ3ZhbHVlJyBpbiBmb3JtU3RhdGUgJiYgJ2Rpc2FibGVkJyBpbiBmb3JtU3RhdGU7XG59XG5jb25zdCBGb3JtQ29udHJvbCA9IChjbGFzcyBGb3JtQ29udHJvbCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgLy8gZm9ybVN0YXRlIGFuZCBkZWZhdWx0VmFsdWUgd2lsbCBvbmx5IGJlIG51bGwgaWYgVCBpcyBudWxsYWJsZVxuICAgIGZvcm1TdGF0ZSA9IG51bGwsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpIHtcbiAgICAgICAgc3VwZXIocGlja1ZhbGlkYXRvcnModmFsaWRhdG9yT3JPcHRzKSwgcGlja0FzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvciwgdmFsaWRhdG9yT3JPcHRzKSk7XG4gICAgICAgIC8qKiBAcHVibGljQXBpICovXG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gbnVsbDtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLl9vbkNoYW5nZSA9IFtdO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX3BlbmRpbmdDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXBwbHlGb3JtU3RhdGUoZm9ybVN0YXRlKTtcbiAgICAgICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICAgICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7XG4gICAgICAgICAgICBvbmx5U2VsZjogdHJ1ZSxcbiAgICAgICAgICAgIC8vIElmIGBhc3luY1ZhbGlkYXRvcmAgaXMgcHJlc2VudCwgaXQgd2lsbCB0cmlnZ2VyIGNvbnRyb2wgc3RhdHVzIGNoYW5nZSBmcm9tIGBQRU5ESU5HYCB0b1xuICAgICAgICAgICAgLy8gYFZBTElEYCBvciBgSU5WQUxJRGAuXG4gICAgICAgICAgICAvLyBUaGUgc3RhdHVzIHNob3VsZCBiZSBicm9hZGNhc3RlZCB2aWEgdGhlIGBzdGF0dXNDaGFuZ2VzYCBvYnNlcnZhYmxlLCBzbyB3ZSBzZXRcbiAgICAgICAgICAgIC8vIGBlbWl0RXZlbnRgIHRvIGB0cnVlYCB0byBhbGxvdyB0aGF0IGR1cmluZyB0aGUgY29udHJvbCBjcmVhdGlvbiBwcm9jZXNzLlxuICAgICAgICAgICAgZW1pdEV2ZW50OiAhIXRoaXMuYXN5bmNWYWxpZGF0b3JcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSAmJlxuICAgICAgICAgICAgKHZhbGlkYXRvck9yT3B0cy5ub25OdWxsYWJsZSB8fCB2YWxpZGF0b3JPck9wdHMuaW5pdGlhbFZhbHVlSXNEZWZhdWx0KSkge1xuICAgICAgICAgICAgaWYgKGlzRm9ybUNvbnRyb2xTdGF0ZShmb3JtU3RhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBmb3JtU3RhdGUudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGZvcm1TdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9wZW5kaW5nVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlLmxlbmd0aCAmJiBvcHRpb25zLmVtaXRNb2RlbFRvVmlld0NoYW5nZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlLmZvckVhY2goKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbih0aGlzLnZhbHVlLCBvcHRpb25zLmVtaXRWaWV3VG9Nb2RlbENoYW5nZSAhPT0gZmFsc2UpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gICAgfVxuICAgIHBhdGNoVmFsdWUodmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKHZhbHVlLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmVzZXQoZm9ybVN0YXRlID0gdGhpcy5kZWZhdWx0VmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9hcHBseUZvcm1TdGF0ZShmb3JtU3RhdGUpO1xuICAgICAgICB0aGlzLm1hcmtBc1ByaXN0aW5lKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm1hcmtBc1VudG91Y2hlZChvcHRpb25zKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ0NoYW5nZSA9IGZhbHNlO1xuICAgIH1cbiAgICAvKiogIEBpbnRlcm5hbCAqL1xuICAgIF91cGRhdGVWYWx1ZSgpIHsgfVxuICAgIC8qKiAgQGludGVybmFsICovXG4gICAgX2FueUNvbnRyb2xzKGNvbmRpdGlvbikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKiAgQGludGVybmFsICovXG4gICAgX2FsbENvbnRyb2xzRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkO1xuICAgIH1cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlLnB1c2goZm4pO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3VucmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgICAgICByZW1vdmVMaXN0SXRlbSh0aGlzLl9vbkNoYW5nZSwgZm4pO1xuICAgIH1cbiAgICByZWdpc3Rlck9uRGlzYWJsZWRDaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5wdXNoKGZuKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF91bnJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShmbikge1xuICAgICAgICByZW1vdmVMaXN0SXRlbSh0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLCBmbik7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZm9yRWFjaENoaWxkKGNiKSB7IH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3N5bmNQZW5kaW5nQ29udHJvbHMoKSB7XG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZU9uID09PSAnc3VibWl0Jykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3BlbmRpbmdEaXJ0eSlcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtBc0RpcnR5KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fcGVuZGluZ1RvdWNoZWQpXG4gICAgICAgICAgICAgICAgdGhpcy5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fcGVuZGluZ0NoYW5nZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5fcGVuZGluZ1ZhbHVlLCB7IG9ubHlTZWxmOiB0cnVlLCBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgX2FwcGx5Rm9ybVN0YXRlKGZvcm1TdGF0ZSkge1xuICAgICAgICBpZiAoaXNGb3JtQ29udHJvbFN0YXRlKGZvcm1TdGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9wZW5kaW5nVmFsdWUgPSBmb3JtU3RhdGUudmFsdWU7XG4gICAgICAgICAgICBmb3JtU3RhdGUuZGlzYWJsZWQgPyB0aGlzLmRpc2FibGUoeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZSB9KSA6XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGUoeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9wZW5kaW5nVmFsdWUgPSBmb3JtU3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbmNvbnN0IFVudHlwZWRGb3JtQ29udHJvbCA9IEZvcm1Db250cm9sO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFzc2VydHMgdGhhdCB0aGUgZ2l2ZW4gY29udHJvbCBpcyBhbiBpbnN0YW5jZSBvZiBgRm9ybUNvbnRyb2xgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jb25zdCBpc0Zvcm1Db250cm9sID0gKGNvbnRyb2wpID0+IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtQ29udHJvbDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgYmFzZSBjbGFzcyBmb3IgY29kZSBzaGFyZWQgYmV0d2VlbiB0aGUgYE5nTW9kZWxHcm91cGAgYW5kIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmVzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIHtcbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgICAgICAvLyBSZWdpc3RlciB0aGUgZ3JvdXAgd2l0aCBpdHMgcGFyZW50IGdyb3VwLlxuICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUuYWRkRm9ybUdyb3VwKHRoaXMpO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZ3JvdXAgZnJvbSBpdHMgcGFyZW50IGdyb3VwLlxuICAgICAgICAgICAgdGhpcy5mb3JtRGlyZWN0aXZlLnJlbW92ZUZvcm1Hcm91cCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAgICovXG4gICAgZ2V0IGNvbnRyb2woKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1EaXJlY3RpdmUuZ2V0Rm9ybUdyb3VwKHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgcGF0aCB0byB0aGlzIGdyb3VwIGZyb20gdGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUuXG4gICAgICovXG4gICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgIHJldHVybiBjb250cm9sUGF0aCh0aGlzLm5hbWUgPT0gbnVsbCA/IHRoaXMubmFtZSA6IHRoaXMubmFtZS50b1N0cmluZygpLCB0aGlzLl9wYXJlbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgdG9wLWxldmVsIGRpcmVjdGl2ZSBmb3IgdGhpcyBncm91cCBpZiBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAgICAgKi9cbiAgICBnZXQgZm9ybURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudCA/IHRoaXMuX3BhcmVudC5mb3JtRGlyZWN0aXZlIDogbnVsbDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9jaGVja1BhcmVudFR5cGUoKSB7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmVcbiAgICAgICAgfV0gfSk7XG5cbmZ1bmN0aW9uIG1vZGVsUGFyZW50RXhjZXB0aW9uKCkge1xuICAgIHJldHVybiBuZXcgybVSdW50aW1lRXJyb3IoMTM1MCAvKiBSdW50aW1lRXJyb3JDb2RlLk5HTU9ERUxfSU5fRk9STV9HUk9VUCAqLywgYFxuICAgIG5nTW9kZWwgY2Fubm90IGJlIHVzZWQgdG8gcmVnaXN0ZXIgZm9ybSBjb250cm9scyB3aXRoIGEgcGFyZW50IGZvcm1Hcm91cCBkaXJlY3RpdmUuICBUcnkgdXNpbmdcbiAgICBmb3JtR3JvdXAncyBwYXJ0bmVyIGRpcmVjdGl2ZSBcImZvcm1Db250cm9sTmFtZVwiIGluc3RlYWQuICBFeGFtcGxlOlxuXG4gICAgJHtmb3JtQ29udHJvbE5hbWVFeGFtcGxlfVxuXG4gICAgT3IsIGlmIHlvdSdkIGxpa2UgdG8gYXZvaWQgcmVnaXN0ZXJpbmcgdGhpcyBmb3JtIGNvbnRyb2wsIGluZGljYXRlIHRoYXQgaXQncyBzdGFuZGFsb25lIGluIG5nTW9kZWxPcHRpb25zOlxuXG4gICAgRXhhbXBsZTpcblxuICAgICR7bmdNb2RlbFdpdGhGb3JtR3JvdXBFeGFtcGxlfWApO1xufVxuZnVuY3Rpb24gZm9ybUdyb3VwTmFtZUV4Y2VwdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IMm1UnVudGltZUVycm9yKDEzNTEgLyogUnVudGltZUVycm9yQ29kZS5OR01PREVMX0lOX0ZPUk1fR1JPVVBfTkFNRSAqLywgYFxuICAgIG5nTW9kZWwgY2Fubm90IGJlIHVzZWQgdG8gcmVnaXN0ZXIgZm9ybSBjb250cm9scyB3aXRoIGEgcGFyZW50IGZvcm1Hcm91cE5hbWUgb3IgZm9ybUFycmF5TmFtZSBkaXJlY3RpdmUuXG5cbiAgICBPcHRpb24gMTogVXNlIGZvcm1Db250cm9sTmFtZSBpbnN0ZWFkIG9mIG5nTW9kZWwgKHJlYWN0aXZlIHN0cmF0ZWd5KTpcblxuICAgICR7Zm9ybUdyb3VwTmFtZUV4YW1wbGV9XG5cbiAgICBPcHRpb24gMjogIFVwZGF0ZSBuZ01vZGVsJ3MgcGFyZW50IGJlIG5nTW9kZWxHcm91cCAodGVtcGxhdGUtZHJpdmVuIHN0cmF0ZWd5KTpcblxuICAgICR7bmdNb2RlbEdyb3VwRXhhbXBsZX1gKTtcbn1cbmZ1bmN0aW9uIG1pc3NpbmdOYW1lRXhjZXB0aW9uKCkge1xuICAgIHJldHVybiBuZXcgybVSdW50aW1lRXJyb3IoMTM1MiAvKiBSdW50aW1lRXJyb3JDb2RlLk5HTU9ERUxfV0lUSE9VVF9OQU1FICovLCBgSWYgbmdNb2RlbCBpcyB1c2VkIHdpdGhpbiBhIGZvcm0gdGFnLCBlaXRoZXIgdGhlIG5hbWUgYXR0cmlidXRlIG11c3QgYmUgc2V0IG9yIHRoZSBmb3JtXG4gICAgY29udHJvbCBtdXN0IGJlIGRlZmluZWQgYXMgJ3N0YW5kYWxvbmUnIGluIG5nTW9kZWxPcHRpb25zLlxuXG4gICAgRXhhbXBsZSAxOiA8aW5wdXQgWyhuZ01vZGVsKV09XCJwZXJzb24uZmlyc3ROYW1lXCIgbmFtZT1cImZpcnN0XCI+XG4gICAgRXhhbXBsZSAyOiA8aW5wdXQgWyhuZ01vZGVsKV09XCJwZXJzb24uZmlyc3ROYW1lXCIgW25nTW9kZWxPcHRpb25zXT1cIntzdGFuZGFsb25lOiB0cnVlfVwiPmApO1xufVxuZnVuY3Rpb24gbW9kZWxHcm91cFBhcmVudEV4Y2VwdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IMm1UnVudGltZUVycm9yKDEzNTMgLyogUnVudGltZUVycm9yQ29kZS5OR01PREVMR1JPVVBfSU5fRk9STV9HUk9VUCAqLywgYFxuICAgIG5nTW9kZWxHcm91cCBjYW5ub3QgYmUgdXNlZCB3aXRoIGEgcGFyZW50IGZvcm1Hcm91cCBkaXJlY3RpdmUuXG5cbiAgICBPcHRpb24gMTogVXNlIGZvcm1Hcm91cE5hbWUgaW5zdGVhZCBvZiBuZ01vZGVsR3JvdXAgKHJlYWN0aXZlIHN0cmF0ZWd5KTpcblxuICAgICR7Zm9ybUdyb3VwTmFtZUV4YW1wbGV9XG5cbiAgICBPcHRpb24gMjogIFVzZSBhIHJlZ3VsYXIgZm9ybSB0YWcgaW5zdGVhZCBvZiB0aGUgZm9ybUdyb3VwIGRpcmVjdGl2ZSAodGVtcGxhdGUtZHJpdmVuIHN0cmF0ZWd5KTpcblxuICAgICR7bmdNb2RlbEdyb3VwRXhhbXBsZX1gKTtcbn1cblxuY29uc3QgbW9kZWxHcm91cFByb3ZpZGVyID0ge1xuICAgIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdNb2RlbEdyb3VwKVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGFuZCBiaW5kcyBhIGBGb3JtR3JvdXBgIGluc3RhbmNlIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgY2FuIG9ubHkgYmUgdXNlZCBhcyBhIGNoaWxkIG9mIGBOZ0Zvcm1gICh3aXRoaW4gYDxmb3JtPmAgdGFncykuXG4gKlxuICogVXNlIHRoaXMgZGlyZWN0aXZlIHRvIHZhbGlkYXRlIGEgc3ViLWdyb3VwIG9mIHlvdXIgZm9ybSBzZXBhcmF0ZWx5IGZyb20gdGhlXG4gKiByZXN0IG9mIHlvdXIgZm9ybSwgb3IgaWYgc29tZSB2YWx1ZXMgaW4geW91ciBkb21haW4gbW9kZWwgbWFrZSBtb3JlIHNlbnNlXG4gKiB0byBjb25zdW1lIHRvZ2V0aGVyIGluIGEgbmVzdGVkIG9iamVjdC5cbiAqXG4gKiBQcm92aWRlIGEgbmFtZSBmb3IgdGhlIHN1Yi1ncm91cCBhbmQgaXQgd2lsbCBiZWNvbWUgdGhlIGtleVxuICogZm9yIHRoZSBzdWItZ3JvdXAgaW4gdGhlIGZvcm0ncyBmdWxsIHZhbHVlLiBJZiB5b3UgbmVlZCBkaXJlY3QgYWNjZXNzLCBleHBvcnQgdGhlIGRpcmVjdGl2ZSBpbnRvXG4gKiBhIGxvY2FsIHRlbXBsYXRlIHZhcmlhYmxlIHVzaW5nIGBuZ01vZGVsR3JvdXBgIChleDogYCNteUdyb3VwPVwibmdNb2RlbEdyb3VwXCJgKS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDb25zdW1pbmcgY29udHJvbHMgaW4gYSBncm91cGluZ1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyB5b3UgaG93IHRvIGNvbWJpbmUgY29udHJvbHMgdG9nZXRoZXIgaW4gYSBzdWItZ3JvdXBcbiAqIG9mIHRoZSBmb3JtLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9uZ01vZGVsR3JvdXAvbmdfbW9kZWxfZ3JvdXBfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIE5nTW9kZWxHcm91cCBleHRlbmRzIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9ycykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgYE5nTW9kZWxHcm91cGAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICAgICAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgTmdGb3JtYC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmFtZSA9ICcnO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgICAgIHRoaXMuX3NldEFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2NoZWNrUGFyZW50VHlwZSgpIHtcbiAgICAgICAgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgTmdNb2RlbEdyb3VwKSAmJiAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nRm9ybSkgJiZcbiAgICAgICAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBtb2RlbEdyb3VwUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTmdNb2RlbEdyb3VwLCBkZXBzOiBbeyB0b2tlbjogQ29udHJvbENvbnRhaW5lciwgaG9zdDogdHJ1ZSwgc2tpcFNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfQVNZTkNfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTmdNb2RlbEdyb3VwLCBzZWxlY3RvcjogXCJbbmdNb2RlbEdyb3VwXVwiLCBpbnB1dHM6IHsgbmFtZTogW1wibmdNb2RlbEdyb3VwXCIsIFwibmFtZVwiXSB9LCBwcm92aWRlcnM6IFttb2RlbEdyb3VwUHJvdmlkZXJdLCBleHBvcnRBczogW1wibmdNb2RlbEdyb3VwXCJdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOZ01vZGVsR3JvdXAsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbeyBzZWxlY3RvcjogJ1tuZ01vZGVsR3JvdXBdJywgcHJvdmlkZXJzOiBbbW9kZWxHcm91cFByb3ZpZGVyXSwgZXhwb3J0QXM6ICduZ01vZGVsR3JvdXAnIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogQ29udHJvbENvbnRhaW5lciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSG9zdFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2tpcFNlbGZcbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19BU1lOQ19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH1dLCBwcm9wRGVjb3JhdG9yczogeyBuYW1lOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdNb2RlbEdyb3VwJ11cbiAgICAgICAgICAgIH1dIH0gfSk7XG5cbmNvbnN0IGZvcm1Db250cm9sQmluZGluZyQxID0ge1xuICAgIHByb3ZpZGU6IE5nQ29udHJvbCxcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ01vZGVsKVxufTtcbi8qKlxuICogYG5nTW9kZWxgIGZvcmNlcyBhbiBhZGRpdGlvbmFsIGNoYW5nZSBkZXRlY3Rpb24gcnVuIHdoZW4gaXRzIGlucHV0cyBjaGFuZ2U6XG4gKiBFLmcuOlxuICogYGBgXG4gKiA8ZGl2Pnt7bXlNb2RlbC52YWxpZH19PC9kaXY+XG4gKiA8aW5wdXQgWyhuZ01vZGVsKV09XCJteVZhbHVlXCIgI215TW9kZWw9XCJuZ01vZGVsXCI+XG4gKiBgYGBcbiAqIEkuZS4gYG5nTW9kZWxgIGNhbiBleHBvcnQgaXRzZWxmIG9uIHRoZSBlbGVtZW50IGFuZCB0aGVuIGJlIHVzZWQgaW4gdGhlIHRlbXBsYXRlLlxuICogTm9ybWFsbHksIHRoaXMgd291bGQgcmVzdWx0IGluIGV4cHJlc3Npb25zIGJlZm9yZSB0aGUgYGlucHV0YCB0aGF0IHVzZSB0aGUgZXhwb3J0ZWQgZGlyZWN0aXZlXG4gKiB0byBoYXZlIGFuIG9sZCB2YWx1ZSBhcyB0aGV5IGhhdmUgYmVlblxuICogZGlydHkgY2hlY2tlZCBiZWZvcmUuIEFzIHRoaXMgaXMgYSB2ZXJ5IGNvbW1vbiBjYXNlIGZvciBgbmdNb2RlbGAsIHdlIGFkZGVkIHRoaXMgc2Vjb25kIGNoYW5nZVxuICogZGV0ZWN0aW9uIHJ1bi5cbiAqXG4gKiBOb3RlczpcbiAqIC0gdGhpcyBpcyBqdXN0IG9uZSBleHRyYSBydW4gbm8gbWF0dGVyIGhvdyBtYW55IGBuZ01vZGVsYHMgaGF2ZSBiZWVuIGNoYW5nZWQuXG4gKiAtIHRoaXMgaXMgYSBnZW5lcmFsIHByb2JsZW0gd2hlbiB1c2luZyBgZXhwb3J0QXNgIGZvciBkaXJlY3RpdmVzIVxuICovXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSAoKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCkpKCk7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgZnJvbSBhIFtkb21haW5cbiAqIG1vZGVsXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Eb21haW5fbW9kZWwpIGFuZCBiaW5kcyBpdCB0byBhIGZvcm0gY29udHJvbCBlbGVtZW50LlxuICpcbiAqIFRoZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIHRyYWNrcyB0aGUgdmFsdWUsIHVzZXIgaW50ZXJhY3Rpb24sIGFuZFxuICogdmFsaWRhdGlvbiBzdGF0dXMgb2YgdGhlIGNvbnRyb2wgYW5kIGtlZXBzIHRoZSB2aWV3IHN5bmNlZCB3aXRoIHRoZSBtb2RlbC4gSWYgdXNlZFxuICogd2l0aGluIGEgcGFyZW50IGZvcm0sIHRoZSBkaXJlY3RpdmUgYWxzbyByZWdpc3RlcnMgaXRzZWxmIHdpdGggdGhlIGZvcm0gYXMgYSBjaGlsZFxuICogY29udHJvbC5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyB1c2VkIGJ5IGl0c2VsZiBvciBhcyBwYXJ0IG9mIGEgbGFyZ2VyIGZvcm0uIFVzZSB0aGVcbiAqIGBuZ01vZGVsYCBzZWxlY3RvciB0byBhY3RpdmF0ZSBpdC5cbiAqXG4gKiBJdCBhY2NlcHRzIGEgZG9tYWluIG1vZGVsIGFzIGFuIG9wdGlvbmFsIGBJbnB1dGAuIElmIHlvdSBoYXZlIGEgb25lLXdheSBiaW5kaW5nXG4gKiB0byBgbmdNb2RlbGAgd2l0aCBgW11gIHN5bnRheCwgY2hhbmdpbmcgdGhlIGRvbWFpbiBtb2RlbCdzIHZhbHVlIGluIHRoZSBjb21wb25lbnRcbiAqIGNsYXNzIHNldHMgdGhlIHZhbHVlIGluIHRoZSB2aWV3LiBJZiB5b3UgaGF2ZSBhIHR3by13YXkgYmluZGluZyB3aXRoIGBbKCldYCBzeW50YXhcbiAqIChhbHNvIGtub3duIGFzICdiYW5hbmEtaW4tYS1ib3ggc3ludGF4JyksIHRoZSB2YWx1ZSBpbiB0aGUgVUkgYWx3YXlzIHN5bmNzIGJhY2sgdG9cbiAqIHRoZSBkb21haW4gbW9kZWwgaW4geW91ciBjbGFzcy5cbiAqXG4gKiBUbyBpbnNwZWN0IHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBhc3NvY2lhdGVkIGBGb3JtQ29udHJvbGAgKGxpa2UgdGhlIHZhbGlkaXR5IHN0YXRlKSxcbiAqIGV4cG9ydCB0aGUgZGlyZWN0aXZlIGludG8gYSBsb2NhbCB0ZW1wbGF0ZSB2YXJpYWJsZSB1c2luZyBgbmdNb2RlbGAgYXMgdGhlIGtleSAoZXg6XG4gKiBgI215VmFyPVwibmdNb2RlbFwiYCkuIFlvdSBjYW4gdGhlbiBhY2Nlc3MgdGhlIGNvbnRyb2wgdXNpbmcgdGhlIGRpcmVjdGl2ZSdzIGBjb250cm9sYCBwcm9wZXJ0eS5cbiAqIEhvd2V2ZXIsIHRoZSBtb3N0IGNvbW1vbmx5IHVzZWQgcHJvcGVydGllcyAobGlrZSBgdmFsaWRgIGFuZCBgZGlydHlgKSBhbHNvIGV4aXN0IG9uIHRoZSBjb250cm9sXG4gKiBmb3IgZGlyZWN0IGFjY2Vzcy4gU2VlIGEgZnVsbCBsaXN0IG9mIHByb3BlcnRpZXMgZGlyZWN0bHkgYXZhaWxhYmxlIGluXG4gKiBgQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlYC5cbiAqXG4gKiBAc2VlIHtAbGluayBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yfVxuICogQHNlZSB7QGxpbmsgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3J9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgVXNpbmcgbmdNb2RlbCBvbiBhIHN0YW5kYWxvbmUgY29udHJvbFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZXMgc2hvdyBhIHNpbXBsZSBzdGFuZGFsb25lIGNvbnRyb2wgdXNpbmcgYG5nTW9kZWxgOlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVOZ01vZGVsL3NpbXBsZV9uZ19tb2RlbF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBXaGVuIHVzaW5nIHRoZSBgbmdNb2RlbGAgd2l0aGluIGA8Zm9ybT5gIHRhZ3MsIHlvdSdsbCBhbHNvIG5lZWQgdG8gc3VwcGx5IGEgYG5hbWVgIGF0dHJpYnV0ZVxuICogc28gdGhhdCB0aGUgY29udHJvbCBjYW4gYmUgcmVnaXN0ZXJlZCB3aXRoIHRoZSBwYXJlbnQgZm9ybSB1bmRlciB0aGF0IG5hbWUuXG4gKlxuICogSW4gdGhlIGNvbnRleHQgb2YgYSBwYXJlbnQgZm9ybSwgaXQncyBvZnRlbiB1bm5lY2Vzc2FyeSB0byBpbmNsdWRlIG9uZS13YXkgb3IgdHdvLXdheSBiaW5kaW5nLFxuICogYXMgdGhlIHBhcmVudCBmb3JtIHN5bmNzIHRoZSB2YWx1ZSBmb3IgeW91LiBZb3UgYWNjZXNzIGl0cyBwcm9wZXJ0aWVzIGJ5IGV4cG9ydGluZyBpdCBpbnRvIGFcbiAqIGxvY2FsIHRlbXBsYXRlIHZhcmlhYmxlIHVzaW5nIGBuZ0Zvcm1gIHN1Y2ggYXMgKGAjZj1cIm5nRm9ybVwiYCkuIFVzZSB0aGUgdmFyaWFibGUgd2hlcmVcbiAqIG5lZWRlZCBvbiBmb3JtIHN1Ym1pc3Npb24uXG4gKlxuICogSWYgeW91IGRvIG5lZWQgdG8gcG9wdWxhdGUgaW5pdGlhbCB2YWx1ZXMgaW50byB5b3VyIGZvcm0sIHVzaW5nIGEgb25lLXdheSBiaW5kaW5nIGZvclxuICogYG5nTW9kZWxgIHRlbmRzIHRvIGJlIHN1ZmZpY2llbnQgYXMgbG9uZyBhcyB5b3UgdXNlIHRoZSBleHBvcnRlZCBmb3JtJ3MgdmFsdWUgcmF0aGVyXG4gKiB0aGFuIHRoZSBkb21haW4gbW9kZWwncyB2YWx1ZSBvbiBzdWJtaXQuXG4gKlxuICogIyMjIFVzaW5nIG5nTW9kZWwgd2l0aGluIGEgZm9ybVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBjb250cm9scyB1c2luZyBgbmdNb2RlbGAgd2l0aGluIGEgZm9ybTpcbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybS9zaW1wbGVfZm9ybV9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiAjIyMgVXNpbmcgYSBzdGFuZGFsb25lIG5nTW9kZWwgd2l0aGluIGEgZ3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgeW91IGhvdyB0byB1c2UgYSBzdGFuZGFsb25lIG5nTW9kZWwgY29udHJvbFxuICogd2l0aGluIGEgZm9ybS4gVGhpcyBjb250cm9scyB0aGUgZGlzcGxheSBvZiB0aGUgZm9ybSwgYnV0IGRvZXNuJ3QgY29udGFpbiBmb3JtIGRhdGEuXG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0+XG4gKiAgIDxpbnB1dCBuYW1lPVwibG9naW5cIiBuZ01vZGVsIHBsYWNlaG9sZGVyPVwiTG9naW5cIj5cbiAqICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5nTW9kZWwgW25nTW9kZWxPcHRpb25zXT1cIntzdGFuZGFsb25lOiB0cnVlfVwiPiBTaG93IG1vcmUgb3B0aW9ucz9cbiAqIDwvZm9ybT5cbiAqIDwhLS0gZm9ybSB2YWx1ZToge2xvZ2luOiAnJ30gLS0+XG4gKiBgYGBcbiAqXG4gKiAjIyMgU2V0dGluZyB0aGUgbmdNb2RlbCBgbmFtZWAgYXR0cmlidXRlIHRocm91Z2ggb3B0aW9uc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyB5b3UgYW4gYWx0ZXJuYXRlIHdheSB0byBzZXQgdGhlIG5hbWUgYXR0cmlidXRlLiBIZXJlLFxuICogYW4gYXR0cmlidXRlIGlkZW50aWZpZWQgYXMgbmFtZSBpcyB1c2VkIHdpdGhpbiBhIGN1c3RvbSBmb3JtIGNvbnRyb2wgY29tcG9uZW50LiBUbyBzdGlsbCBiZSBhYmxlXG4gKiB0byBzcGVjaWZ5IHRoZSBOZ01vZGVsJ3MgbmFtZSwgeW91IG11c3Qgc3BlY2lmeSBpdCB1c2luZyB0aGUgYG5nTW9kZWxPcHRpb25zYCBpbnB1dCBpbnN0ZWFkLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtPlxuICogICA8bXktY3VzdG9tLWZvcm0tY29udHJvbCBuYW1lPVwiTmFuY3lcIiBuZ01vZGVsIFtuZ01vZGVsT3B0aW9uc109XCJ7bmFtZTogJ3VzZXInfVwiPlxuICogICA8L215LWN1c3RvbS1mb3JtLWNvbnRyb2w+XG4gKiA8L2Zvcm0+XG4gKiA8IS0tIGZvcm0gdmFsdWU6IHt1c2VyOiAnJ30gLS0+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTmdNb2RlbCBleHRlbmRzIE5nQ29udHJvbCB7XG4gICAgY29uc3RydWN0b3IocGFyZW50LCB2YWxpZGF0b3JzLCBhc3luY1ZhbGlkYXRvcnMsIHZhbHVlQWNjZXNzb3JzLCBfY2hhbmdlRGV0ZWN0b3JSZWYsIGNhbGxTZXREaXNhYmxlZFN0YXRlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmID0gX2NoYW5nZURldGVjdG9yUmVmO1xuICAgICAgICB0aGlzLmNhbGxTZXREaXNhYmxlZFN0YXRlID0gY2FsbFNldERpc2FibGVkU3RhdGU7XG4gICAgICAgIHRoaXMuY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyZWQgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBUcmFja3MgdGhlIG5hbWUgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gSWYgYSBwYXJlbnQgZm9ybSBleGlzdHMsIGl0XG4gICAgICAgICAqIHVzZXMgdGhpcyBuYW1lIGFzIGEga2V5IHRvIHJldHJpZXZlIHRoaXMgY29udHJvbCdzIHZhbHVlLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gJyc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogRXZlbnQgZW1pdHRlciBmb3IgcHJvZHVjaW5nIHRoZSBgbmdNb2RlbENoYW5nZWAgZXZlbnQgYWZ0ZXJcbiAgICAgICAgICogdGhlIHZpZXcgbW9kZWwgdXBkYXRlcy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgICAgIHRoaXMuX3NldEFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICAgICAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBzZWxlY3RWYWx1ZUFjY2Vzc29yKHRoaXMsIHZhbHVlQWNjZXNzb3JzKTtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tGb3JFcnJvcnMoKTtcbiAgICAgICAgaWYgKCF0aGlzLl9yZWdpc3RlcmVkIHx8ICduYW1lJyBpbiBjaGFuZ2VzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVnaXN0ZXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrTmFtZSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgY2FuJ3QgY2FsbCBgZm9ybURpcmVjdGl2ZS5yZW1vdmVDb250cm9sKHRoaXMpYCwgYmVjYXVzZSB0aGUgYG5hbWVgIGhhcyBhbHJlYWR5IGJlZW5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2hhbmdlZC4gV2UgYWxzbyBjYW4ndCByZXNldCB0aGUgbmFtZSB0ZW1wb3JhcmlseSBzaW5jZSB0aGUgbG9naWMgaW4gYHJlbW92ZUNvbnRyb2xgXG4gICAgICAgICAgICAgICAgICAgIC8vIGlzIGluc2lkZSBhIHByb21pc2UgYW5kIGl0IHdvbid0IHJ1biBpbW1lZGlhdGVseS4gV2Ugd29yayBhcm91bmQgaXQgYnkgZ2l2aW5nIGl0IGFuXG4gICAgICAgICAgICAgICAgICAgIC8vIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNoYXBlIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZE5hbWUgPSBjaGFuZ2VzWyduYW1lJ10ucHJldmlvdXNWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtRGlyZWN0aXZlLnJlbW92ZUNvbnRyb2woeyBuYW1lOiBvbGROYW1lLCBwYXRoOiB0aGlzLl9nZXRQYXRoKG9sZE5hbWUpIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3NldFVwQ29udHJvbCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnaXNEaXNhYmxlZCcgaW4gY2hhbmdlcykge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGlzYWJsZWQoY2hhbmdlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJvcGVydHlVcGRhdGVkKGNoYW5nZXMsIHRoaXMudmlld01vZGVsKSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUodGhpcy5tb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnZpZXdNb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUgJiYgdGhpcy5mb3JtRGlyZWN0aXZlLnJlbW92ZUNvbnRyb2wodGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgICAqL1xuICAgIGdldCBwYXRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0UGF0aCh0aGlzLm5hbWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgdG9wLWxldmVsIGRpcmVjdGl2ZSBmb3IgdGhpcyBjb250cm9sIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICAgICAqL1xuICAgIGdldCBmb3JtRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gdGhpcy5fcGFyZW50LmZvcm1EaXJlY3RpdmUgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSB2aWV3IG1vZGVsIGFuZCBlbWl0cyBhbiBgbmdNb2RlbENoYW5nZWAgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmV3VmFsdWUgVGhlIG5ldyB2YWx1ZSBlbWl0dGVkIGJ5IGBuZ01vZGVsQ2hhbmdlYC5cbiAgICAgKi9cbiAgICB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLnZpZXdNb2RlbCA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZS5lbWl0KG5ld1ZhbHVlKTtcbiAgICB9XG4gICAgX3NldFVwQ29udHJvbCgpIHtcbiAgICAgICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3koKTtcbiAgICAgICAgdGhpcy5faXNTdGFuZGFsb25lKCkgPyB0aGlzLl9zZXRVcFN0YW5kYWxvbmUoKSA6IHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRDb250cm9sKHRoaXMpO1xuICAgICAgICB0aGlzLl9yZWdpc3RlcmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgX3NldFVwZGF0ZVN0cmF0ZWd5KCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy51cGRhdGVPbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wuX3VwZGF0ZU9uID0gdGhpcy5vcHRpb25zLnVwZGF0ZU9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9pc1N0YW5kYWxvbmUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5fcGFyZW50IHx8ICEhKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuc3RhbmRhbG9uZSk7XG4gICAgfVxuICAgIF9zZXRVcFN0YW5kYWxvbmUoKSB7XG4gICAgICAgIHNldFVwQ29udHJvbCh0aGlzLmNvbnRyb2wsIHRoaXMsIHRoaXMuY2FsbFNldERpc2FibGVkU3RhdGUpO1xuICAgICAgICB0aGlzLmNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgfVxuICAgIF9jaGVja0ZvckVycm9ycygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc1N0YW5kYWxvbmUoKSkge1xuICAgICAgICAgICAgdGhpcy5fY2hlY2tQYXJlbnRUeXBlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2hlY2tOYW1lKCk7XG4gICAgfVxuICAgIF9jaGVja1BhcmVudFR5cGUoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nTW9kZWxHcm91cCkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRocm93IGZvcm1Hcm91cE5hbWVFeGNlcHRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgTmdNb2RlbEdyb3VwKSAmJiAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nRm9ybSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBtb2RlbFBhcmVudEV4Y2VwdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9jaGVja05hbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm5hbWUpXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdGlvbnMubmFtZTtcbiAgICAgICAgaWYgKCF0aGlzLl9pc1N0YW5kYWxvbmUoKSAmJiAhdGhpcy5uYW1lICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBtaXNzaW5nTmFtZUV4Y2VwdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF91cGRhdGVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wuc2V0VmFsdWUodmFsdWUsIHsgZW1pdFZpZXdUb01vZGVsQ2hhbmdlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmPy5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF91cGRhdGVEaXNhYmxlZChjaGFuZ2VzKSB7XG4gICAgICAgIGNvbnN0IGRpc2FibGVkVmFsdWUgPSBjaGFuZ2VzWydpc0Rpc2FibGVkJ10uY3VycmVudFZhbHVlO1xuICAgICAgICAvLyBjaGVja2luZyBmb3IgMCB0byBhdm9pZCBicmVha2luZyBjaGFuZ2VcbiAgICAgICAgY29uc3QgaXNEaXNhYmxlZCA9IGRpc2FibGVkVmFsdWUgIT09IDAgJiYgYm9vbGVhbkF0dHJpYnV0ZShkaXNhYmxlZFZhbHVlKTtcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzRGlzYWJsZWQgJiYgIXRoaXMuY29udHJvbC5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbC5kaXNhYmxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghaXNEaXNhYmxlZCAmJiB0aGlzLmNvbnRyb2wuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2wuZW5hYmxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZj8ubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfZ2V0UGF0aChjb250cm9sTmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gY29udHJvbFBhdGgoY29udHJvbE5hbWUsIHRoaXMuX3BhcmVudCkgOiBbY29udHJvbE5hbWVdO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOZ01vZGVsLCBkZXBzOiBbeyB0b2tlbjogQ29udHJvbENvbnRhaW5lciwgaG9zdDogdHJ1ZSwgb3B0aW9uYWw6IHRydWUgfSwgeyB0b2tlbjogTkdfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfQVNZTkNfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfVkFMVUVfQUNDRVNTT1IsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IENoYW5nZURldGVjdG9yUmVmLCBvcHRpb25hbDogdHJ1ZSB9LCB7IHRva2VuOiBDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSwgb3B0aW9uYWw6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTmdNb2RlbCwgc2VsZWN0b3I6IFwiW25nTW9kZWxdOm5vdChbZm9ybUNvbnRyb2xOYW1lXSk6bm90KFtmb3JtQ29udHJvbF0pXCIsIGlucHV0czogeyBuYW1lOiBcIm5hbWVcIiwgaXNEaXNhYmxlZDogW1wiZGlzYWJsZWRcIiwgXCJpc0Rpc2FibGVkXCJdLCBtb2RlbDogW1wibmdNb2RlbFwiLCBcIm1vZGVsXCJdLCBvcHRpb25zOiBbXCJuZ01vZGVsT3B0aW9uc1wiLCBcIm9wdGlvbnNcIl0gfSwgb3V0cHV0czogeyB1cGRhdGU6IFwibmdNb2RlbENoYW5nZVwiIH0sIHByb3ZpZGVyczogW2Zvcm1Db250cm9sQmluZGluZyQxXSwgZXhwb3J0QXM6IFtcIm5nTW9kZWxcIl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgdXNlc09uQ2hhbmdlczogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nTW9kZWwsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ1tuZ01vZGVsXTpub3QoW2Zvcm1Db250cm9sTmFtZV0pOm5vdChbZm9ybUNvbnRyb2xdKScsXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW2Zvcm1Db250cm9sQmluZGluZyQxXSxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0QXM6ICduZ01vZGVsJ1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogQ29udHJvbENvbnRhaW5lciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEhvc3RcbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19BU1lOQ19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMVUVfQUNDRVNTT1JdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiBpMC5DaGFuZ2VEZXRlY3RvclJlZiwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW0NoYW5nZURldGVjdG9yUmVmXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbQ0FMTF9TRVRfRElTQUJMRURfU1RBVEVdXG4gICAgICAgICAgICAgICAgfV0gfV0sIHByb3BEZWNvcmF0b3JzOiB7IG5hbWU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dLCBpc0Rpc2FibGVkOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnZGlzYWJsZWQnXVxuICAgICAgICAgICAgfV0sIG1vZGVsOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdNb2RlbCddXG4gICAgICAgICAgICB9XSwgb3B0aW9uczogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ25nTW9kZWxPcHRpb25zJ11cbiAgICAgICAgICAgIH1dLCB1cGRhdGU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogT3V0cHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdNb2RlbENoYW5nZSddXG4gICAgICAgICAgICB9XSB9IH0pO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEFkZHMgYG5vdmFsaWRhdGVgIGF0dHJpYnV0ZSB0byBhbGwgZm9ybXMgYnkgZGVmYXVsdC5cbiAqXG4gKiBgbm92YWxpZGF0ZWAgaXMgdXNlZCB0byBkaXNhYmxlIGJyb3dzZXIncyBuYXRpdmUgZm9ybSB2YWxpZGF0aW9uLlxuICpcbiAqIElmIHlvdSB3YW50IHRvIHVzZSBuYXRpdmUgdmFsaWRhdGlvbiB3aXRoIEFuZ3VsYXIgZm9ybXMsIGp1c3QgYWRkIGBuZ05hdGl2ZVZhbGlkYXRlYCBhdHRyaWJ1dGU6XG4gKlxuICogYGBgXG4gKiA8Zm9ybSBuZ05hdGl2ZVZhbGlkYXRlPjwvZm9ybT5cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqL1xuY2xhc3MgybVOZ05vVmFsaWRhdGUge1xuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IMm1TmdOb1ZhbGlkYXRlLCBkZXBzOiBbXSwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiDJtU5nTm9WYWxpZGF0ZSwgc2VsZWN0b3I6IFwiZm9ybTpub3QoW25nTm9Gb3JtXSk6bm90KFtuZ05hdGl2ZVZhbGlkYXRlXSlcIiwgaG9zdDogeyBhdHRyaWJ1dGVzOiB7IFwibm92YWxpZGF0ZVwiOiBcIlwiIH0gfSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IMm1TmdOb1ZhbGlkYXRlLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdmb3JtOm5vdChbbmdOb0Zvcm1dKTpub3QoW25nTmF0aXZlVmFsaWRhdGVdKScsXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ25vdmFsaWRhdGUnOiAnJyB9LFxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dIH0pO1xuXG5jb25zdCBOVU1CRVJfVkFMVUVfQUNDRVNTT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTnVtYmVyVmFsdWVBY2Nlc3NvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIHdyaXRpbmcgYSBudW1iZXIgdmFsdWUgYW5kIGxpc3RlbmluZyB0byBudW1iZXIgaW5wdXQgY2hhbmdlcy5cbiAqIFRoZSB2YWx1ZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IHRoZSBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBgRm9ybUNvbnRyb2xOYW1lYCwgYW5kIGBOZ01vZGVsYFxuICogZGlyZWN0aXZlcy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBVc2luZyBhIG51bWJlciBpbnB1dCB3aXRoIGEgcmVhY3RpdmUgZm9ybS5cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSBhIG51bWJlciBpbnB1dCB3aXRoIGEgcmVhY3RpdmUgZm9ybS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgdG90YWxDb3VudENvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAqIGBgYFxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJudW1iZXJcIiBbZm9ybUNvbnRyb2xdPVwidG90YWxDb3VudENvbnRyb2xcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTnVtYmVyVmFsdWVBY2Nlc3NvciBleHRlbmRzIEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgLy8gVGhlIHZhbHVlIG5lZWRzIHRvIGJlIG5vcm1hbGl6ZWQgZm9yIElFOSwgb3RoZXJ3aXNlIGl0IGlzIHNldCB0byAnbnVsbCcgd2hlbiBudWxsXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgICAgICB0aGlzLnNldFByb3BlcnR5KCd2YWx1ZScsIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBmbih2YWx1ZSA9PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE51bWJlclZhbHVlQWNjZXNzb3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTnVtYmVyVmFsdWVBY2Nlc3Nvciwgc2VsZWN0b3I6IFwiaW5wdXRbdHlwZT1udW1iZXJdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1udW1iZXJdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPW51bWJlcl1bbmdNb2RlbF1cIiwgaG9zdDogeyBsaXN0ZW5lcnM6IHsgXCJpbnB1dFwiOiBcIm9uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpXCIsIFwiYmx1clwiOiBcIm9uVG91Y2hlZCgpXCIgfSB9LCBwcm92aWRlcnM6IFtOVU1CRVJfVkFMVUVfQUNDRVNTT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOdW1iZXJWYWx1ZUFjY2Vzc29yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPW51bWJlcl1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPW51bWJlcl1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9bnVtYmVyXVtuZ01vZGVsXScsXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJyhpbnB1dCknOiAnb25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknLCAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJyB9LFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtOVU1CRVJfVkFMVUVfQUNDRVNTT1JdXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0gfSk7XG5cbmNvbnN0IFJBRElPX1ZBTFVFX0FDQ0VTU09SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuZnVuY3Rpb24gdGhyb3dOYW1lRXJyb3IoKSB7XG4gICAgdGhyb3cgbmV3IMm1UnVudGltZUVycm9yKDEyMDIgLyogUnVudGltZUVycm9yQ29kZS5OQU1FX0FORF9GT1JNX0NPTlRST0xfTkFNRV9NVVNUX01BVENIICovLCBgXG4gICAgICBJZiB5b3UgZGVmaW5lIGJvdGggYSBuYW1lIGFuZCBhIGZvcm1Db250cm9sTmFtZSBhdHRyaWJ1dGUgb24geW91ciByYWRpbyBidXR0b24sIHRoZWlyIHZhbHVlc1xuICAgICAgbXVzdCBtYXRjaC4gRXg6IDxpbnB1dCB0eXBlPVwicmFkaW9cIiBmb3JtQ29udHJvbE5hbWU9XCJmb29kXCIgbmFtZT1cImZvb2RcIj5cbiAgICBgKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDbGFzcyB1c2VkIGJ5IEFuZ3VsYXIgdG8gdHJhY2sgcmFkaW8gYnV0dG9ucy4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICovXG5jbGFzcyBSYWRpb0NvbnRyb2xSZWdpc3RyeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2FjY2Vzc29ycyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBZGRzIGEgY29udHJvbCB0byB0aGUgaW50ZXJuYWwgcmVnaXN0cnkuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICAgKi9cbiAgICBhZGQoY29udHJvbCwgYWNjZXNzb3IpIHtcbiAgICAgICAgdGhpcy5fYWNjZXNzb3JzLnB1c2goW2NvbnRyb2wsIGFjY2Vzc29yXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlbW92ZXMgYSBjb250cm9sIGZyb20gdGhlIGludGVybmFsIHJlZ2lzdHJ5LiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAgICovXG4gICAgcmVtb3ZlKGFjY2Vzc29yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9hY2Nlc3NvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY2Nlc3NvcnNbaV1bMV0gPT09IGFjY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzb3JzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogU2VsZWN0cyBhIHJhZGlvIGJ1dHRvbi4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgICAqL1xuICAgIHNlbGVjdChhY2Nlc3Nvcikge1xuICAgICAgICB0aGlzLl9hY2Nlc3NvcnMuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzU2FtZUdyb3VwKGMsIGFjY2Vzc29yKSAmJiBjWzFdICE9PSBhY2Nlc3Nvcikge1xuICAgICAgICAgICAgICAgIGNbMV0uZmlyZVVuY2hlY2soYWNjZXNzb3IudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2lzU2FtZUdyb3VwKGNvbnRyb2xQYWlyLCBhY2Nlc3Nvcikge1xuICAgICAgICBpZiAoIWNvbnRyb2xQYWlyWzBdLmNvbnRyb2wpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBjb250cm9sUGFpclswXS5fcGFyZW50ID09PSBhY2Nlc3Nvci5fY29udHJvbC5fcGFyZW50ICYmXG4gICAgICAgICAgICBjb250cm9sUGFpclsxXS5uYW1lID09PSBhY2Nlc3Nvci5uYW1lO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSYWRpb0NvbnRyb2xSZWdpc3RyeSwgZGVwczogW10sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuSW5qZWN0YWJsZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVwcm92ID0gaTAuybXJtW5nRGVjbGFyZUluamVjdGFibGUoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSYWRpb0NvbnRyb2xSZWdpc3RyeSwgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFJhZGlvQ29udHJvbFJlZ2lzdHJ5LCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogSW5qZWN0YWJsZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7IHByb3ZpZGVkSW46ICdyb290JyB9XVxuICAgICAgICB9XSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyByYWRpbyBjb250cm9sIHZhbHVlcyBhbmQgbGlzdGVuaW5nIHRvIHJhZGlvIGNvbnRyb2xcbiAqIGNoYW5nZXMuIFRoZSB2YWx1ZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IHRoZSBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBgRm9ybUNvbnRyb2xOYW1lYCwgYW5kXG4gKiBgTmdNb2RlbGAgZGlyZWN0aXZlcy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBVc2luZyByYWRpbyBidXR0b25zIHdpdGggcmVhY3RpdmUgZm9ybSBkaXJlY3RpdmVzXG4gKlxuICogVGhlIGZvbGxvdyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgcmFkaW8gYnV0dG9ucyBpbiBhIHJlYWN0aXZlIGZvcm0uIFdoZW4gdXNpbmcgcmFkaW8gYnV0dG9ucyBpblxuICogYSByZWFjdGl2ZSBmb3JtLCByYWRpbyBidXR0b25zIGluIHRoZSBzYW1lIGdyb3VwIHNob3VsZCBoYXZlIHRoZSBzYW1lIGBmb3JtQ29udHJvbE5hbWVgLlxuICogUHJvdmlkaW5nIGEgYG5hbWVgIGF0dHJpYnV0ZSBpcyBvcHRpb25hbC5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvcmVhY3RpdmVSYWRpb0J1dHRvbnMvcmVhY3RpdmVfcmFkaW9fYnV0dG9uX2V4YW1wbGUudHMgcmVnaW9uPSdSZWFjdGl2ZSd9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlciwgZWxlbWVudFJlZiwgX3JlZ2lzdHJ5LCBfaW5qZWN0b3IpIHtcbiAgICAgICAgc3VwZXIocmVuZGVyZXIsIGVsZW1lbnRSZWYpO1xuICAgICAgICB0aGlzLl9yZWdpc3RyeSA9IF9yZWdpc3RyeTtcbiAgICAgICAgdGhpcy5faW5qZWN0b3IgPSBfaW5qZWN0b3I7XG4gICAgICAgIHRoaXMuc2V0RGlzYWJsZWRTdGF0ZUZpcmVkID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBhIGNoYW5nZSBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAgICAgICAqIE5vdGU6IHdlIGRlY2xhcmUgYG9uQ2hhbmdlYCBoZXJlIChhbHNvIHVzZWQgYXMgaG9zdCBsaXN0ZW5lcikgYXMgYSBmdW5jdGlvbiB3aXRoIG5vIGFyZ3VtZW50c1xuICAgICAgICAgKiB0byBvdmVycmlkZSB0aGUgYG9uQ2hhbmdlYCBmdW5jdGlvbiAod2hpY2ggZXhwZWN0cyAxIGFyZ3VtZW50KSBpbiB0aGUgcGFyZW50XG4gICAgICAgICAqIGBCYXNlQ29udHJvbFZhbHVlQWNjZXNzb3JgIGNsYXNzLlxuICAgICAgICAgKiBAbm9kb2NcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSAoKSA9PiB7IH07XG4gICAgICAgIHRoaXMuY2FsbFNldERpc2FibGVkU3RhdGUgPSBpbmplY3QoQ0FMTF9TRVRfRElTQUJMRURfU1RBVEUsIHsgb3B0aW9uYWw6IHRydWUgfSkgPz8gc2V0RGlzYWJsZWRTdGF0ZURlZmF1bHQ7XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5fY29udHJvbCA9IHRoaXMuX2luamVjdG9yLmdldChOZ0NvbnRyb2wpO1xuICAgICAgICB0aGlzLl9jaGVja05hbWUoKTtcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuYWRkKHRoaXMuX2NvbnRyb2wsIHRoaXMpO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5LnJlbW92ZSh0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgXCJjaGVja2VkXCIgcHJvcGVydHkgdmFsdWUgb24gdGhlIHJhZGlvIGlucHV0IGVsZW1lbnQuXG4gICAgICogQG5vZG9jXG4gICAgICovXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IHZhbHVlID09PSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLnNldFByb3BlcnR5KCdjaGVja2VkJywgdGhpcy5fc3RhdGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBjaGFuZ2VzLlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5fZm4gPSBmbjtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGZuKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkuc2VsZWN0KHRoaXMpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgc2V0RGlzYWJsZWRTdGF0ZWAgaXMgc3VwcG9zZWQgdG8gYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiBhIGNvbnRyb2wgY2hhbmdlcyxcbiAgICAgICAgICogaW5jbHVkaW5nIHVwb24gY29udHJvbCBjcmVhdGlvbi4gSG93ZXZlciwgYSBsb25nc3RhbmRpbmcgYnVnIGNhdXNlZCB0aGUgbWV0aG9kIHRvIG5vdCBmaXJlXG4gICAgICAgICAqIHdoZW4gYW4gKmVuYWJsZWQqIGNvbnRyb2wgd2FzIGF0dGFjaGVkLiBUaGlzIGJ1ZyB3YXMgZml4ZWQgaW4gdjE1IGluICM0NzU3Ni5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBoYWQgYSBzaWRlIGVmZmVjdDogcHJldmlvdXNseSwgaXQgd2FzIHBvc3NpYmxlIHRvIGluc3RhbnRpYXRlIGEgcmVhY3RpdmUgZm9ybSBjb250cm9sXG4gICAgICAgICAqIHdpdGggYFthdHRyLmRpc2FibGVkXT10cnVlYCwgZXZlbiB0aG91Z2ggdGhlIGNvcnJlc3BvbmRpbmcgY29udHJvbCB3YXMgZW5hYmxlZCBpbiB0aGVcbiAgICAgICAgICogbW9kZWwuIFRoaXMgcmVzdWx0ZWQgaW4gYSBtaXNtYXRjaCBiZXR3ZWVuIHRoZSBtb2RlbCBhbmQgdGhlIERPTS4gTm93LCBiZWNhdXNlXG4gICAgICAgICAqIGBzZXREaXNhYmxlZFN0YXRlYCBpcyBhbHdheXMgY2FsbGVkLCB0aGUgdmFsdWUgaW4gdGhlIERPTSB3aWxsIGJlIGltbWVkaWF0ZWx5IG92ZXJ3cml0dGVuXG4gICAgICAgICAqIHdpdGggdGhlIFwiY29ycmVjdFwiIGVuYWJsZWQgdmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEhvd2V2ZXIsIHRoZSBmaXggYWxzbyBjcmVhdGVkIGFuIGV4Y2VwdGlvbmFsIGNhc2U6IHJhZGlvIGJ1dHRvbnMuIEJlY2F1c2UgUmVhY3RpdmUgRm9ybXNcbiAgICAgICAgICogbW9kZWxzIHRoZSBlbnRpcmUgZ3JvdXAgb2YgcmFkaW8gYnV0dG9ucyBhcyBhIHNpbmdsZSBgRm9ybUNvbnRyb2xgLCB0aGVyZSBpcyBubyB3YXkgdG9cbiAgICAgICAgICogY29udHJvbCB0aGUgZGlzYWJsZWQgc3RhdGUgZm9yIGluZGl2aWR1YWwgcmFkaW9zLCBzbyB0aGV5IGNhbiBubyBsb25nZXIgYmUgY29uZmlndXJlZCBhc1xuICAgICAgICAgKiBkaXNhYmxlZC4gVGh1cywgd2Uga2VlcCB0aGUgb2xkIGJlaGF2aW9yIGZvciByYWRpbyBidXR0b25zLCBzbyB0aGF0IGBbYXR0ci5kaXNhYmxlZF1gXG4gICAgICAgICAqIGNvbnRpbnVlcyB0byB3b3JrLiBTcGVjaWZpY2FsbHksIHdlIGRyb3AgdGhlIGZpcnN0IGNhbGwgdG8gYHNldERpc2FibGVkU3RhdGVgIGlmIGBkaXNhYmxlZGBcbiAgICAgICAgICogaXMgYGZhbHNlYCwgYW5kIHdlIGFyZSBub3QgaW4gbGVnYWN5IG1vZGUuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5zZXREaXNhYmxlZFN0YXRlRmlyZWQgfHwgaXNEaXNhYmxlZCB8fFxuICAgICAgICAgICAgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSA9PT0gJ3doZW5EaXNhYmxlZEZvckxlZ2FjeUNvZGUnKSB7XG4gICAgICAgICAgICB0aGlzLnNldFByb3BlcnR5KCdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0RGlzYWJsZWRTdGF0ZUZpcmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgXCJ2YWx1ZVwiIG9uIHRoZSByYWRpbyBpbnB1dCBlbGVtZW50IGFuZCB1bmNoZWNrcyBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIGZpcmVVbmNoZWNrKHZhbHVlKSB7XG4gICAgICAgIHRoaXMud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICAgIF9jaGVja05hbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLm5hbWUgJiYgdGhpcy5mb3JtQ29udHJvbE5hbWUgJiYgdGhpcy5uYW1lICE9PSB0aGlzLmZvcm1Db250cm9sTmFtZSAmJlxuICAgICAgICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgICAgIHRocm93TmFtZUVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLm5hbWUgJiYgdGhpcy5mb3JtQ29udHJvbE5hbWUpXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmZvcm1Db250cm9sTmFtZTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvciwgZGVwczogW3sgdG9rZW46IGkwLlJlbmRlcmVyMiB9LCB7IHRva2VuOiBpMC5FbGVtZW50UmVmIH0sIHsgdG9rZW46IFJhZGlvQ29udHJvbFJlZ2lzdHJ5IH0sIHsgdG9rZW46IGkwLkluamVjdG9yIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IsIHNlbGVjdG9yOiBcImlucHV0W3R5cGU9cmFkaW9dW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1yYWRpb11bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9cmFkaW9dW25nTW9kZWxdXCIsIGlucHV0czogeyBuYW1lOiBcIm5hbWVcIiwgZm9ybUNvbnRyb2xOYW1lOiBcImZvcm1Db250cm9sTmFtZVwiLCB2YWx1ZTogXCJ2YWx1ZVwiIH0sIGhvc3Q6IHsgbGlzdGVuZXJzOiB7IFwiY2hhbmdlXCI6IFwib25DaGFuZ2UoKVwiLCBcImJsdXJcIjogXCJvblRvdWNoZWQoKVwiIH0gfSwgcHJvdmlkZXJzOiBbUkFESU9fVkFMVUVfQUNDRVNTT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPXJhZGlvXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9cmFkaW9dW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPXJhZGlvXVtuZ01vZGVsXScsXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCknLCAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJyB9LFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtSQURJT19WQUxVRV9BQ0NFU1NPUl1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgY3RvclBhcmFtZXRlcnM6ICgpID0+IFt7IHR5cGU6IGkwLlJlbmRlcmVyMiB9LCB7IHR5cGU6IGkwLkVsZW1lbnRSZWYgfSwgeyB0eXBlOiBSYWRpb0NvbnRyb2xSZWdpc3RyeSB9LCB7IHR5cGU6IGkwLkluamVjdG9yIH1dLCBwcm9wRGVjb3JhdG9yczogeyBuYW1lOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0XG4gICAgICAgICAgICB9XSwgZm9ybUNvbnRyb2xOYW1lOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0XG4gICAgICAgICAgICB9XSwgdmFsdWU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dIH0gfSk7XG5cbmNvbnN0IFJBTkdFX1ZBTFVFX0FDQ0VTU09SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJhbmdlVmFsdWVBY2Nlc3NvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIHdyaXRpbmcgYSByYW5nZSB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIHJhbmdlIGlucHV0IGNoYW5nZXMuXG4gKiBUaGUgdmFsdWUgYWNjZXNzb3IgaXMgdXNlZCBieSB0aGUgYEZvcm1Db250cm9sRGlyZWN0aXZlYCwgYEZvcm1Db250cm9sTmFtZWAsIGFuZCAgYE5nTW9kZWxgXG4gKiBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIGEgcmFuZ2UgaW5wdXQgd2l0aCBhIHJlYWN0aXZlIGZvcm1cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSBhIHJhbmdlIGlucHV0IHdpdGggYSByZWFjdGl2ZSBmb3JtLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBhZ2VDb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG4gKiBgYGBcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBbZm9ybUNvbnRyb2xdPVwiYWdlQ29udHJvbFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBSYW5nZVZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIFwidmFsdWVcIiBwcm9wZXJ0eSBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ3ZhbHVlJywgcGFyc2VGbG9hdCh2YWx1ZSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBjaGFuZ2VzLlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgZm4odmFsdWUgPT0gJycgPyBudWxsIDogcGFyc2VGbG9hdCh2YWx1ZSkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSYW5nZVZhbHVlQWNjZXNzb3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogUmFuZ2VWYWx1ZUFjY2Vzc29yLCBzZWxlY3RvcjogXCJpbnB1dFt0eXBlPXJhbmdlXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9cmFuZ2VdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPXJhbmdlXVtuZ01vZGVsXVwiLCBob3N0OiB7IGxpc3RlbmVyczogeyBcImNoYW5nZVwiOiBcIm9uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpXCIsIFwiaW5wdXRcIjogXCJvbkNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKVwiLCBcImJsdXJcIjogXCJvblRvdWNoZWQoKVwiIH0gfSwgcHJvdmlkZXJzOiBbUkFOR0VfVkFMVUVfQUNDRVNTT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBSYW5nZVZhbHVlQWNjZXNzb3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9cmFuZ2VdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1yYW5nZV1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9cmFuZ2VdW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICcoaW5wdXQpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICcoYmx1ciknOiAnb25Ub3VjaGVkKCknXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW1JBTkdFX1ZBTFVFX0FDQ0VTU09SXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dIH0pO1xuXG4vKipcbiAqIFRva2VuIHRvIHByb3ZpZGUgdG8gdHVybiBvZmYgdGhlIG5nTW9kZWwgd2FybmluZyBvbiBmb3JtQ29udHJvbCBhbmQgZm9ybUNvbnRyb2xOYW1lLlxuICovXG5jb25zdCBOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HID0gbmV3IEluamVjdGlvblRva2VuKG5nRGV2TW9kZSA/ICdOZ01vZGVsV2l0aEZvcm1Db250cm9sV2FybmluZycgOiAnJyk7XG5jb25zdCBmb3JtQ29udHJvbEJpbmRpbmcgPSB7XG4gICAgcHJvdmlkZTogTmdDb250cm9sLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Db250cm9sRGlyZWN0aXZlKVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBTeW5jaHJvbml6ZXMgYSBzdGFuZGFsb25lIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgdG8gYSBmb3JtIGNvbnRyb2wgZWxlbWVudC5cbiAqXG4gKiBOb3RlIHRoYXQgc3VwcG9ydCBmb3IgdXNpbmcgdGhlIGBuZ01vZGVsYCBpbnB1dCBwcm9wZXJ0eSBhbmQgYG5nTW9kZWxDaGFuZ2VgIGV2ZW50IHdpdGggcmVhY3RpdmVcbiAqIGZvcm0gZGlyZWN0aXZlcyB3YXMgZGVwcmVjYXRlZCBpbiBBbmd1bGFyIHY2IGFuZCBpcyBzY2hlZHVsZWQgZm9yIHJlbW92YWwgaW5cbiAqIGEgZnV0dXJlIHZlcnNpb24gb2YgQW5ndWxhci5cbiAqIEZvciBkZXRhaWxzLCBzZWUgW0RlcHJlY2F0ZWQgZmVhdHVyZXNdKGd1aWRlL2RlcHJlY2F0aW9ucyNuZ21vZGVsLXdpdGgtcmVhY3RpdmUtZm9ybXMpLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUge0BsaW5rIEZvcm1Db250cm9sfVxuICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sfVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byByZWdpc3RlciBhIHN0YW5kYWxvbmUgY29udHJvbCBhbmQgc2V0IGl0cyB2YWx1ZS5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybUNvbnRyb2wvc2ltcGxlX2Zvcm1fY29udHJvbF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBGb3JtQ29udHJvbERpcmVjdGl2ZSBleHRlbmRzIE5nQ29udHJvbCB7XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVHJpZ2dlcnMgYSB3YXJuaW5nIGluIGRldiBtb2RlIHRoYXQgdGhpcyBpbnB1dCBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3Jtcy5cbiAgICAgKi9cbiAgICBzZXQgaXNEaXNhYmxlZChpc0Rpc2FibGVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihkaXNhYmxlZEF0dHJXYXJuaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIGFueSBuZ01vZGVsIHdhcm5pbmdzIGhhdmUgYmVlbiBzZW50IGFjcm9zc1xuICAgICAqIGFsbCBpbnN0YW5jZXMgb2YgRm9ybUNvbnRyb2xEaXJlY3RpdmUuIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcIm9uY2VcIi5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHN0YXRpYyB7IHRoaXMuX25nTW9kZWxXYXJuaW5nU2VudE9uY2UgPSBmYWxzZTsgfVxuICAgIGNvbnN0cnVjdG9yKHZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9ycywgdmFsdWVBY2Nlc3NvcnMsIF9uZ01vZGVsV2FybmluZ0NvbmZpZywgY2FsbFNldERpc2FibGVkU3RhdGUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fbmdNb2RlbFdhcm5pbmdDb25maWcgPSBfbmdNb2RlbFdhcm5pbmdDb25maWc7XG4gICAgICAgIHRoaXMuY2FsbFNldERpc2FibGVkU3RhdGUgPSBjYWxsU2V0RGlzYWJsZWRTdGF0ZTtcbiAgICAgICAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovXG4gICAgICAgIHRoaXMudXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEluc3RhbmNlIHByb3BlcnR5IHVzZWQgdG8gdHJhY2sgd2hldGhlciBhbiBuZ01vZGVsIHdhcm5pbmcgaGFzIGJlZW4gc2VudCBvdXQgZm9yIHRoaXNcbiAgICAgICAgICogcGFydGljdWxhciBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgIGluc3RhbmNlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJhbHdheXNcIi5cbiAgICAgICAgICpcbiAgICAgICAgICogQGludGVybmFsXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9uZ01vZGVsV2FybmluZ1NlbnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICAgICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gICAgICAgIHRoaXMudmFsdWVBY2Nlc3NvciA9IHNlbGVjdFZhbHVlQWNjZXNzb3IodGhpcywgdmFsdWVBY2Nlc3NvcnMpO1xuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5faXNDb250cm9sQ2hhbmdlZChjaGFuZ2VzKSkge1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNGb3JtID0gY2hhbmdlc1snZm9ybSddLnByZXZpb3VzVmFsdWU7XG4gICAgICAgICAgICBpZiAocHJldmlvdXNGb3JtKSB7XG4gICAgICAgICAgICAgICAgY2xlYW5VcENvbnRyb2wocHJldmlvdXNGb3JtLCB0aGlzLCAvKiB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICovIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFVwQ29udHJvbCh0aGlzLmZvcm0sIHRoaXMsIHRoaXMuY2FsbFNldERpc2FibGVkU3RhdGUpO1xuICAgICAgICAgICAgdGhpcy5mb3JtLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1Byb3BlcnR5VXBkYXRlZChjaGFuZ2VzLCB0aGlzLnZpZXdNb2RlbCkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgICAgICAgICBfbmdNb2RlbFdhcm5pbmcoJ2Zvcm1Db250cm9sJywgRm9ybUNvbnRyb2xEaXJlY3RpdmUsIHRoaXMsIHRoaXMuX25nTW9kZWxXYXJuaW5nQ29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZm9ybS5zZXRWYWx1ZSh0aGlzLm1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMudmlld01vZGVsID0gdGhpcy5tb2RlbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQG5vZG9jICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgICAgICAgIGNsZWFuVXBDb250cm9sKHRoaXMuZm9ybSwgdGhpcywgLyogdmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZSAqLyBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgICAqIEVhY2ggaW5kZXggaXMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBjb250cm9sIG9uIHRoYXQgbGV2ZWwuXG4gICAgICovXG4gICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhlIGBGb3JtQ29udHJvbGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAgICovXG4gICAgZ2V0IGNvbnRyb2woKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwgYW5kIGVtaXRzIGFuIGBuZ01vZGVsQ2hhbmdlYCBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbC5cbiAgICAgKi9cbiAgICB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLnZpZXdNb2RlbCA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZS5lbWl0KG5ld1ZhbHVlKTtcbiAgICB9XG4gICAgX2lzQ29udHJvbENoYW5nZWQoY2hhbmdlcykge1xuICAgICAgICByZXR1cm4gY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZm9ybScpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtQ29udHJvbERpcmVjdGl2ZSwgZGVwczogW3sgdG9rZW46IE5HX1ZBTElEQVRPUlMsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IE5HX0FTWU5DX1ZBTElEQVRPUlMsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IE5HX1ZBTFVFX0FDQ0VTU09SLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HLCBvcHRpb25hbDogdHJ1ZSB9LCB7IHRva2VuOiBDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSwgb3B0aW9uYWw6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogRm9ybUNvbnRyb2xEaXJlY3RpdmUsIHNlbGVjdG9yOiBcIltmb3JtQ29udHJvbF1cIiwgaW5wdXRzOiB7IGZvcm06IFtcImZvcm1Db250cm9sXCIsIFwiZm9ybVwiXSwgaXNEaXNhYmxlZDogW1wiZGlzYWJsZWRcIiwgXCJpc0Rpc2FibGVkXCJdLCBtb2RlbDogW1wibmdNb2RlbFwiLCBcIm1vZGVsXCJdIH0sIG91dHB1dHM6IHsgdXBkYXRlOiBcIm5nTW9kZWxDaGFuZ2VcIiB9LCBwcm92aWRlcnM6IFtmb3JtQ29udHJvbEJpbmRpbmddLCBleHBvcnRBczogW1wibmdGb3JtXCJdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIHVzZXNPbkNoYW5nZXM6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtQ29udHJvbERpcmVjdGl2ZSwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7IHNlbGVjdG9yOiAnW2Zvcm1Db250cm9sXScsIHByb3ZpZGVyczogW2Zvcm1Db250cm9sQmluZGluZ10sIGV4cG9ydEFzOiAnbmdGb3JtJyB9XVxuICAgICAgICB9XSwgY3RvclBhcmFtZXRlcnM6ICgpID0+IFt7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19BU1lOQ19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMVUVfQUNDRVNTT1JdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbQ0FMTF9TRVRfRElTQUJMRURfU1RBVEVdXG4gICAgICAgICAgICAgICAgfV0gfV0sIHByb3BEZWNvcmF0b3JzOiB7IGZvcm06IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWydmb3JtQ29udHJvbCddXG4gICAgICAgICAgICB9XSwgaXNEaXNhYmxlZDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ2Rpc2FibGVkJ11cbiAgICAgICAgICAgIH1dLCBtb2RlbDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ25nTW9kZWwnXVxuICAgICAgICAgICAgfV0sIHVwZGF0ZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBPdXRwdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWyduZ01vZGVsQ2hhbmdlJ11cbiAgICAgICAgICAgIH1dIH0gfSk7XG5cbmNvbnN0IGZvcm1EaXJlY3RpdmVQcm92aWRlciA9IHtcbiAgICBwcm92aWRlOiBDb250cm9sQ29udGFpbmVyLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Hcm91cERpcmVjdGl2ZSlcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEJpbmRzIGFuIGV4aXN0aW5nIGBGb3JtR3JvdXBgIG9yIGBGb3JtUmVjb3JkYCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGFjY2VwdHMgYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuIEl0IHdpbGwgdGhlbiB1c2UgdGhpc1xuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgdG8gbWF0Y2ggYW55IGNoaWxkIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgL2BGb3JtUmVjb3JkYCxcbiAqIGFuZCBgRm9ybUFycmF5YCBpbnN0YW5jZXMgdG8gY2hpbGQgYEZvcm1Db250cm9sTmFtZWAsIGBGb3JtR3JvdXBOYW1lYCxcbiAqIGFuZCBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlcy5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2x9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqICMjIyBSZWdpc3RlciBGb3JtIEdyb3VwXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJlZ2lzdGVycyBhIGBGb3JtR3JvdXBgIHdpdGggZmlyc3QgbmFtZSBhbmQgbGFzdCBuYW1lIGNvbnRyb2xzLFxuICogYW5kIGxpc3RlbnMgZm9yIHRoZSAqbmdTdWJtaXQqIGV2ZW50IHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtR3JvdXAvc2ltcGxlX2Zvcm1fZ3JvdXBfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgRm9ybUdyb3VwRGlyZWN0aXZlIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciB7XG4gICAgY29uc3RydWN0b3IodmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzLCBjYWxsU2V0RGlzYWJsZWRTdGF0ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNhbGxTZXREaXNhYmxlZFN0YXRlID0gY2FsbFNldERpc2FibGVkU3RhdGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBmb3JtIHN1Ym1pc3Npb24gaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIGludm9rZWQgd2hlbiBjb250cm9scyBpbiBGb3JtR3JvdXAgb3IgRm9ybUFycmF5IGNvbGxlY3Rpb24gY2hhbmdlXG4gICAgICAgICAqIChhZGRlZCBvciByZW1vdmVkKS4gVGhpcyBjYWxsYmFjayB0cmlnZ2VycyBjb3JyZXNwb25kaW5nIERPTSB1cGRhdGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlID0gKCkgPT4gdGhpcy5fdXBkYXRlRG9tVmFsdWUoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBUcmFja3MgdGhlIGxpc3Qgb2YgYWRkZWQgYEZvcm1Db250cm9sTmFtZWAgaW5zdGFuY2VzXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBUcmFja3MgdGhlIGBGb3JtR3JvdXBgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5mb3JtID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIHRoZSBmb3JtIHN1Ym1pc3Npb24gaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uZ1N1Ym1pdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICAgICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgICAgIHRoaXMuX2NoZWNrRm9ybVByZXNlbnQoKTtcbiAgICAgICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Zvcm0nKSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsaWRhdG9ycygpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRG9tVmFsdWUoKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJlZ2lzdHJhdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuX29sZEZvcm0gPSB0aGlzLmZvcm07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICAgICAgICBjbGVhblVwVmFsaWRhdG9ycyh0aGlzLmZvcm0sIHRoaXMpO1xuICAgICAgICAgICAgLy8gQ3VycmVudGx5IHRoZSBgb25Db2xsZWN0aW9uQ2hhbmdlYCBjYWxsYmFjayBpcyByZXdyaXR0ZW4gZWFjaCB0aW1lIHRoZVxuICAgICAgICAgICAgLy8gYF9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZWAgZnVuY3Rpb24gaXMgaW52b2tlZC4gVGhlIGltcGxpY2F0aW9uIGlzIHRoYXQgY2xlYW51cCBzaG91bGRcbiAgICAgICAgICAgIC8vIGhhcHBlbiAqb25seSogd2hlbiB0aGUgYG9uQ29sbGVjdGlvbkNoYW5nZWAgY2FsbGJhY2sgd2FzIHNldCBieSB0aGlzIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSBpdCBtaWdodCBjYXVzZSBvdmVycmlkaW5nIGEgY2FsbGJhY2sgb2Ygc29tZSBvdGhlciBkaXJlY3RpdmUgaW5zdGFuY2VzLiBXZSBzaG91bGRcbiAgICAgICAgICAgIC8vIGNvbnNpZGVyIHVwZGF0aW5nIHRoaXMgbG9naWMgbGF0ZXIgdG8gbWFrZSBpdCBzaW1pbGFyIHRvIGhvdyBgb25DaGFuZ2VgIGNhbGxiYWNrcyBhcmVcbiAgICAgICAgICAgIC8vIGhhbmRsZWQsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zOTczMiBmb3IgYWRkaXRpb25hbCBpbmZvLlxuICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5fb25Db2xsZWN0aW9uQ2hhbmdlID09PSB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHsgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyB0aGlzIGRpcmVjdGl2ZSdzIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGdldCBmb3JtRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAgICovXG4gICAgZ2V0IGNvbnRyb2woKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoaXMgZ3JvdXAuIEJlY2F1c2UgdGhpcyBkaXJlY3RpdmVcbiAgICAgKiBhbHdheXMgbGl2ZXMgYXQgdGhlIHRvcCBsZXZlbCBvZiBhIGZvcm0sIGl0IGFsd2F5cyBhbiBlbXB0eSBhcnJheS5cbiAgICAgKi9cbiAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBNZXRob2QgdGhhdCBzZXRzIHVwIHRoZSBjb250cm9sIGRpcmVjdGl2ZSBpbiB0aGlzIGdyb3VwLCByZS1jYWxjdWxhdGVzIGl0cyB2YWx1ZVxuICAgICAqIGFuZCB2YWxpZGl0eSwgYW5kIGFkZHMgdGhlIGluc3RhbmNlIHRvIHRoZSBpbnRlcm5hbCBsaXN0IG9mIGRpcmVjdGl2ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgYWRkQ29udHJvbChkaXIpIHtcbiAgICAgICAgY29uc3QgY3RybCA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgICAgICBzZXRVcENvbnRyb2woY3RybCwgZGlyLCB0aGlzLmNhbGxTZXREaXNhYmxlZFN0YXRlKTtcbiAgICAgICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICAgICAgdGhpcy5kaXJlY3RpdmVzLnB1c2goZGlyKTtcbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHJpZXZlcyB0aGUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSBmcm9tIHRoZSBwcm92aWRlZCBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBnZXRDb250cm9sKGRpcikge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlbW92ZXMgdGhlIGBGb3JtQ29udHJvbE5hbWVgIGluc3RhbmNlIGZyb20gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlc1xuICAgICAqXG4gICAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHJlbW92ZUNvbnRyb2woZGlyKSB7XG4gICAgICAgIGNsZWFuVXBDb250cm9sKGRpci5jb250cm9sIHx8IG51bGwsIGRpciwgLyogdmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZSAqLyBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUxpc3RJdGVtJDEodGhpcy5kaXJlY3RpdmVzLCBkaXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbmV3IGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UgdG8gdGhlIGZvcm0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGFkZEZvcm1Hcm91cChkaXIpIHtcbiAgICAgICAgdGhpcy5fc2V0VXBGb3JtQ29udGFpbmVyKGRpcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBuZWNlc3NhcnkgY2xlYW51cCB3aGVuIGEgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyByZW1vdmVkIGZyb20gdGhlXG4gICAgICogdmlldy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgcmVtb3ZlRm9ybUdyb3VwKGRpcikge1xuICAgICAgICB0aGlzLl9jbGVhblVwRm9ybUNvbnRhaW5lcihkaXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtR3JvdXBgIGZvciBhIHByb3ZpZGVkIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0Rm9ybUdyb3VwKGRpcikge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBuZWNlc3Nhcnkgc2V0dXAgd2hlbiBhIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UgaXMgYWRkZWQgdG8gdGhlIHZpZXcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGFkZEZvcm1BcnJheShkaXIpIHtcbiAgICAgICAgdGhpcy5fc2V0VXBGb3JtQ29udGFpbmVyKGRpcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBuZWNlc3NhcnkgY2xlYW51cCB3aGVuIGEgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyByZW1vdmVkIGZyb20gdGhlXG4gICAgICogdmlldy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgcmVtb3ZlRm9ybUFycmF5KGRpcikge1xuICAgICAgICB0aGlzLl9jbGVhblVwRm9ybUNvbnRhaW5lcihkaXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtQXJyYXlgIGZvciBhIHByb3ZpZGVkIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGdldEZvcm1BcnJheShkaXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBkaXJlY3RpdmUncyBjb250cm9sLlxuICAgICAqL1xuICAgIHVwZGF0ZU1vZGVsKGRpciwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgY3RybCA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgICAgICBjdHJsLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogTWV0aG9kIGNhbGxlZCB3aXRoIHRoZSBcInN1Ym1pdFwiIGV2ZW50IGlzIHRyaWdnZXJlZCBvbiB0aGUgZm9ybS5cbiAgICAgKiBUcmlnZ2VycyB0aGUgYG5nU3VibWl0YCBlbWl0dGVyIHRvIGVtaXQgdGhlIFwic3VibWl0XCIgZXZlbnQgYXMgaXRzIHBheWxvYWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGV2ZW50IFRoZSBcInN1Ym1pdFwiIGV2ZW50IG9iamVjdFxuICAgICAqL1xuICAgIG9uU3VibWl0KCRldmVudCkge1xuICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHN5bmNQZW5kaW5nQ29udHJvbHModGhpcy5mb3JtLCB0aGlzLmRpcmVjdGl2ZXMpO1xuICAgICAgICB0aGlzLm5nU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICAgICAgLy8gRm9ybXMgd2l0aCBgbWV0aG9kPVwiZGlhbG9nXCJgIGhhdmUgc29tZSBzcGVjaWFsIGJlaGF2aW9yIHRoYXQgd29uJ3QgcmVsb2FkIHRoZSBwYWdlIGFuZCB0aGF0XG4gICAgICAgIC8vIHNob3VsZG4ndCBiZSBwcmV2ZW50ZWQuIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIG51bGwgY2hlY2sgdGhlIGBldmVudGAgYW5kIHRoZSBgdGFyZ2V0YCwgYmVjYXVzZVxuICAgICAgICAvLyBzb21lIGludGVybmFsIGFwcHMgY2FsbCB0aGlzIG1ldGhvZCBkaXJlY3RseSB3aXRoIHRoZSB3cm9uZyBhcmd1bWVudHMuXG4gICAgICAgIHJldHVybiAkZXZlbnQ/LnRhcmdldD8ubWV0aG9kID09PSAnZGlhbG9nJztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBcInJlc2V0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgICAqL1xuICAgIG9uUmVzZXQoKSB7XG4gICAgICAgIHRoaXMucmVzZXRGb3JtKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlc2V0cyB0aGUgZm9ybSB0byBhbiBpbml0aWFsIHZhbHVlIGFuZCByZXNldHMgaXRzIHN1Ym1pdHRlZCBzdGF0dXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGZvcm0uXG4gICAgICovXG4gICAgcmVzZXRGb3JtKHZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZm9ybS5yZXNldCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfdXBkYXRlRG9tVmFsdWUoKSB7XG4gICAgICAgIHRoaXMuZGlyZWN0aXZlcy5mb3JFYWNoKGRpciA9PiB7XG4gICAgICAgICAgICBjb25zdCBvbGRDdHJsID0gZGlyLmNvbnRyb2w7XG4gICAgICAgICAgICBjb25zdCBuZXdDdHJsID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICAgICAgICBpZiAob2xkQ3RybCAhPT0gbmV3Q3RybCkge1xuICAgICAgICAgICAgICAgIC8vIE5vdGU6IHRoZSB2YWx1ZSBvZiB0aGUgYGRpci5jb250cm9sYCBtYXkgbm90IGJlIGRlZmluZWQsIGZvciBleGFtcGxlIHdoZW4gaXQncyBhIGZpcnN0XG4gICAgICAgICAgICAgICAgLy8gYEZvcm1Db250cm9sYCB0aGF0IGlzIGFkZGVkIHRvIGEgYEZvcm1Hcm91cGAgaW5zdGFuY2UgKHZpYSBgYWRkQ29udHJvbGAgY2FsbCkuXG4gICAgICAgICAgICAgICAgY2xlYW5VcENvbnRyb2wob2xkQ3RybCB8fCBudWxsLCBkaXIpO1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgbmV3IGNvbnRyb2wgYXQgdGhlIHNhbWUgbG9jYXRpb24gaW5zaWRlIHRoZSBjb3JyZXNwb25kaW5nIGBGb3JtR3JvdXBgIGlzIGFuXG4gICAgICAgICAgICAgICAgLy8gaW5zdGFuY2Ugb2YgYEZvcm1Db250cm9sYCBhbmQgcGVyZm9ybSBjb250cm9sIHNldHVwIG9ubHkgaWYgdGhhdCdzIHRoZSBjYXNlLlxuICAgICAgICAgICAgICAgIC8vIE5vdGU6IHdlIGRvbid0IG5lZWQgdG8gY2xlYXIgdGhlIGxpc3Qgb2YgZGlyZWN0aXZlcyAoYHRoaXMuZGlyZWN0aXZlc2ApIGhlcmUsIGl0IHdvdWxkIGJlXG4gICAgICAgICAgICAgICAgLy8gdGFrZW4gY2FyZSBvZiBpbiB0aGUgYHJlbW92ZUNvbnRyb2xgIG1ldGhvZCBpbnZva2VkIHdoZW4gY29ycmVzcG9uZGluZyBgZm9ybUNvbnRyb2xOYW1lYFxuICAgICAgICAgICAgICAgIC8vIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyBiZWluZyByZW1vdmVkIChpbnZva2VkIGZyb20gYEZvcm1Db250cm9sTmFtZS5uZ09uRGVzdHJveWApLlxuICAgICAgICAgICAgICAgIGlmIChpc0Zvcm1Db250cm9sKG5ld0N0cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFVwQ29udHJvbChuZXdDdHJsLCBkaXIsIHRoaXMuY2FsbFNldERpc2FibGVkU3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICBkaXIuY29udHJvbCA9IG5ld0N0cmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mb3JtLl91cGRhdGVUcmVlVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgIH1cbiAgICBfc2V0VXBGb3JtQ29udGFpbmVyKGRpcikge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICAgIHNldFVwRm9ybUNvbnRhaW5lcihjdHJsLCBkaXIpO1xuICAgICAgICAvLyBOT1RFOiB0aGlzIG9wZXJhdGlvbiBsb29rcyB1bm5lY2Vzc2FyeSBpbiBjYXNlIG5vIG5ldyB2YWxpZGF0b3JzIHdlcmUgYWRkZWQgaW5cbiAgICAgICAgLy8gYHNldFVwRm9ybUNvbnRhaW5lcmAgY2FsbC4gQ29uc2lkZXIgdXBkYXRpbmcgdGhpcyBjb2RlIHRvIG1hdGNoIHRoZSBsb2dpYyBpblxuICAgICAgICAvLyBgX2NsZWFuVXBGb3JtQ29udGFpbmVyYCBmdW5jdGlvbi5cbiAgICAgICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICB9XG4gICAgX2NsZWFuVXBGb3JtQ29udGFpbmVyKGRpcikge1xuICAgICAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICAgICAgICBjb25zdCBjdHJsID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICAgICAgICBpZiAoY3RybCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29udHJvbFVwZGF0ZWQgPSBjbGVhblVwRm9ybUNvbnRhaW5lcihjdHJsLCBkaXIpO1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbnRyb2xVcGRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB2YWxpZGl0eSBjaGVjayBvbmx5IGluIGNhc2UgYSBjb250cm9sIHdhcyB1cGRhdGVkIChpLmUuIHZpZXcgdmFsaWRhdG9ycyB3ZXJlXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZWQpIGFzIHJlbW92aW5nIHZpZXcgdmFsaWRhdG9ycyBtaWdodCBjYXVzZSB2YWxpZGl0eSB0byBjaGFuZ2UuXG4gICAgICAgICAgICAgICAgICAgIGN0cmwudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF91cGRhdGVSZWdpc3RyYXRpb25zKCkge1xuICAgICAgICB0aGlzLmZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgICAgIGlmICh0aGlzLl9vbGRGb3JtKSB7XG4gICAgICAgICAgICB0aGlzLl9vbGRGb3JtLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7IH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIF91cGRhdGVWYWxpZGF0b3JzKCkge1xuICAgICAgICBzZXRVcFZhbGlkYXRvcnModGhpcy5mb3JtLCB0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuX29sZEZvcm0pIHtcbiAgICAgICAgICAgIGNsZWFuVXBWYWxpZGF0b3JzKHRoaXMuX29sZEZvcm0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9jaGVja0Zvcm1QcmVzZW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuZm9ybSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgICAgdGhyb3cgbWlzc2luZ0Zvcm1FeGNlcHRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtR3JvdXBEaXJlY3RpdmUsIGRlcHM6IFt7IHRva2VuOiBOR19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBOR19BU1lOQ19WQUxJREFUT1JTLCBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9LCB7IHRva2VuOiBDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSwgb3B0aW9uYWw6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogRm9ybUdyb3VwRGlyZWN0aXZlLCBzZWxlY3RvcjogXCJbZm9ybUdyb3VwXVwiLCBpbnB1dHM6IHsgZm9ybTogW1wiZm9ybUdyb3VwXCIsIFwiZm9ybVwiXSB9LCBvdXRwdXRzOiB7IG5nU3VibWl0OiBcIm5nU3VibWl0XCIgfSwgaG9zdDogeyBsaXN0ZW5lcnM6IHsgXCJzdWJtaXRcIjogXCJvblN1Ym1pdCgkZXZlbnQpXCIsIFwicmVzZXRcIjogXCJvblJlc2V0KClcIiB9IH0sIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sIGV4cG9ydEFzOiBbXCJuZ0Zvcm1cIl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgdXNlc09uQ2hhbmdlczogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1Hcm91cERpcmVjdGl2ZSwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnW2Zvcm1Hcm91cF0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtmb3JtRGlyZWN0aXZlUHJvdmlkZXJdLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICcoc3VibWl0KSc6ICdvblN1Ym1pdCgkZXZlbnQpJywgJyhyZXNldCknOiAnb25SZXNldCgpJyB9LFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRBczogJ25nRm9ybSdcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgY3RvclBhcmFtZXRlcnM6ICgpID0+IFt7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19BU1lOQ19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbQ0FMTF9TRVRfRElTQUJMRURfU1RBVEVdXG4gICAgICAgICAgICAgICAgfV0gfV0sIHByb3BEZWNvcmF0b3JzOiB7IGZvcm06IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWydmb3JtR3JvdXAnXVxuICAgICAgICAgICAgfV0sIG5nU3VibWl0OiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IE91dHB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcblxuY29uc3QgZm9ybUdyb3VwTmFtZVByb3ZpZGVyID0ge1xuICAgIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUdyb3VwTmFtZSlcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFN5bmNzIGEgbmVzdGVkIGBGb3JtR3JvdXBgIG9yIGBGb3JtUmVjb3JkYCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGNhbiBvbmx5IGJlIHVzZWQgd2l0aCBhIHBhcmVudCBgRm9ybUdyb3VwRGlyZWN0aXZlYC5cbiAqXG4gKiBJdCBhY2NlcHRzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgbmVzdGVkIGBGb3JtR3JvdXBgIG9yIGBGb3JtUmVjb3JkYCB0byBsaW5rLCBhbmRcbiAqIGxvb2tzIGZvciBhIGBGb3JtR3JvdXBgIG9yIGBGb3JtUmVjb3JkYCByZWdpc3RlcmVkIHdpdGggdGhhdCBuYW1lIGluIHRoZSBwYXJlbnRcbiAqIGBGb3JtR3JvdXBgIGluc3RhbmNlIHlvdSBwYXNzZWQgaW50byBgRm9ybUdyb3VwRGlyZWN0aXZlYC5cbiAqXG4gKiBVc2UgbmVzdGVkIGZvcm0gZ3JvdXBzIHRvIHZhbGlkYXRlIGEgc3ViLWdyb3VwIG9mIGFcbiAqIGZvcm0gc2VwYXJhdGVseSBmcm9tIHRoZSByZXN0IG9yIHRvIGdyb3VwIHRoZSB2YWx1ZXMgb2YgY2VydGFpblxuICogY29udHJvbHMgaW50byB0aGVpciBvd24gbmVzdGVkIG9iamVjdC5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWNjZXNzIHRoZSBncm91cCBieSBuYW1lXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHVzZXMgdGhlIGBBYnN0cmFjdENvbnRyb2wuZ2V0YCBtZXRob2QgdG8gYWNjZXNzIHRoZVxuICogYXNzb2NpYXRlZCBgRm9ybUdyb3VwYFxuICpcbiAqIGBgYHRzXG4gKiAgIHRoaXMuZm9ybS5nZXQoJ25hbWUnKTtcbiAqIGBgYFxuICpcbiAqICMjIyBBY2Nlc3MgaW5kaXZpZHVhbCBjb250cm9scyBpbiB0aGUgZ3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgdXNlcyB0aGUgYEFic3RyYWN0Q29udHJvbC5nZXRgIG1ldGhvZCB0byBhY2Nlc3NcbiAqIGluZGl2aWR1YWwgY29udHJvbHMgd2l0aGluIHRoZSBncm91cCB1c2luZyBkb3Qgc3ludGF4LlxuICpcbiAqIGBgYHRzXG4gKiAgIHRoaXMuZm9ybS5nZXQoJ25hbWUuZmlyc3QnKTtcbiAqIGBgYFxuICpcbiAqICMjIyBSZWdpc3RlciBhIG5lc3RlZCBgRm9ybUdyb3VwYC5cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmVnaXN0ZXJzIGEgbmVzdGVkICpuYW1lKiBgRm9ybUdyb3VwYCB3aXRoaW4gYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAsXG4gKiBhbmQgcHJvdmlkZXMgbWV0aG9kcyB0byByZXRyaWV2ZSB0aGUgbmVzdGVkIGBGb3JtR3JvdXBgIGFuZCBpbmRpdmlkdWFsIGNvbnRyb2xzLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9uZXN0ZWRGb3JtR3JvdXAvbmVzdGVkX2Zvcm1fZ3JvdXBfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgRm9ybUdyb3VwTmFtZSBleHRlbmRzIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9ycykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICAgICAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YC5cbiAgICAgICAgICogQWNjZXB0cyBhIG5hbWUgYXMgYSBzdHJpbmcgb3IgYSBudW1iZXIuXG4gICAgICAgICAqIFRoZSBuYW1lIGluIHRoZSBmb3JtIG9mIGEgc3RyaW5nIGlzIHVzZWZ1bCBmb3IgaW5kaXZpZHVhbCBmb3JtcyxcbiAgICAgICAgICogd2hpbGUgdGhlIG51bWVyaWNhbCBmb3JtIGFsbG93cyBmb3IgZm9ybSBncm91cHMgdG8gYmUgYm91bmRcbiAgICAgICAgICogdG8gaW5kaWNlcyB3aGVuIGl0ZXJhdGluZyBvdmVyIGdyb3VwcyBpbiBhIGBGb3JtQXJyYXlgLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLl9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgICAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9jaGVja1BhcmVudFR5cGUoKSB7XG4gICAgICAgIGlmIChfaGFzSW52YWxpZFBhcmVudCh0aGlzLl9wYXJlbnQpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBncm91cFBhcmVudEV4Y2VwdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1Hcm91cE5hbWUsIGRlcHM6IFt7IHRva2VuOiBDb250cm9sQ29udGFpbmVyLCBob3N0OiB0cnVlLCBvcHRpb25hbDogdHJ1ZSwgc2tpcFNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfQVNZTkNfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogRm9ybUdyb3VwTmFtZSwgc2VsZWN0b3I6IFwiW2Zvcm1Hcm91cE5hbWVdXCIsIGlucHV0czogeyBuYW1lOiBbXCJmb3JtR3JvdXBOYW1lXCIsIFwibmFtZVwiXSB9LCBwcm92aWRlcnM6IFtmb3JtR3JvdXBOYW1lUHJvdmlkZXJdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtR3JvdXBOYW1lLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3sgc2VsZWN0b3I6ICdbZm9ybUdyb3VwTmFtZV0nLCBwcm92aWRlcnM6IFtmb3JtR3JvdXBOYW1lUHJvdmlkZXJdIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogQ29udHJvbENvbnRhaW5lciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEhvc3RcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNraXBTZWxmXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfQVNZTkNfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9XSwgcHJvcERlY29yYXRvcnM6IHsgbmFtZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ2Zvcm1Hcm91cE5hbWUnXVxuICAgICAgICAgICAgfV0gfSB9KTtcbmNvbnN0IGZvcm1BcnJheU5hbWVQcm92aWRlciA9IHtcbiAgICBwcm92aWRlOiBDb250cm9sQ29udGFpbmVyLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1BcnJheU5hbWUpXG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBTeW5jcyBhIG5lc3RlZCBgRm9ybUFycmF5YCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIGRlc2lnbmVkIHRvIGJlIHVzZWQgd2l0aCBhIHBhcmVudCBgRm9ybUdyb3VwRGlyZWN0aXZlYCAoc2VsZWN0b3I6XG4gKiBgW2Zvcm1Hcm91cF1gKS5cbiAqXG4gKiBJdCBhY2NlcHRzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgbmVzdGVkIGBGb3JtQXJyYXlgIHlvdSB3YW50IHRvIGxpbmssIGFuZFxuICogd2lsbCBsb29rIGZvciBhIGBGb3JtQXJyYXlgIHJlZ2lzdGVyZWQgd2l0aCB0aGF0IG5hbWUgaW4gdGhlIHBhcmVudFxuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgeW91IHBhc3NlZCBpbnRvIGBGb3JtR3JvdXBEaXJlY3RpdmVgLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbH1cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL25lc3RlZEZvcm1BcnJheS9uZXN0ZWRfZm9ybV9hcnJheV9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBGb3JtQXJyYXlOYW1lIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciB7XG4gICAgY29uc3RydWN0b3IocGFyZW50LCB2YWxpZGF0b3JzLCBhc3luY1ZhbGlkYXRvcnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBUcmFja3MgdGhlIG5hbWUgb2YgdGhlIGBGb3JtQXJyYXlgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAgICAgICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAuXG4gICAgICAgICAqIEFjY2VwdHMgYSBuYW1lIGFzIGEgc3RyaW5nIG9yIGEgbnVtYmVyLlxuICAgICAgICAgKiBUaGUgbmFtZSBpbiB0aGUgZm9ybSBvZiBhIHN0cmluZyBpcyB1c2VmdWwgZm9yIGluZGl2aWR1YWwgZm9ybXMsXG4gICAgICAgICAqIHdoaWxlIHRoZSBudW1lcmljYWwgZm9ybSBhbGxvd3MgZm9yIGZvcm0gYXJyYXlzIHRvIGJlIGJvdW5kXG4gICAgICAgICAqIHRvIGluZGljZXMgd2hlbiBpdGVyYXRpbmcgb3ZlciBhcnJheXMgaW4gYSBgRm9ybUFycmF5YC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICAgICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgbGlmZWN5Y2xlIG1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgZGlyZWN0aXZlJ3MgaW5wdXRzIGFyZSBpbml0aWFsaXplZC4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgICAqIEB0aHJvd3MgSWYgdGhlIGRpcmVjdGl2ZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcGFyZW50LlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLl9jaGVja1BhcmVudFR5cGUoKTtcbiAgICAgICAgdGhpcy5mb3JtRGlyZWN0aXZlLmFkZEZvcm1BcnJheSh0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCBiZWZvcmUgdGhlIGRpcmVjdGl2ZSdzIGluc3RhbmNlIGlzIGRlc3Ryb3llZC4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5mb3JtRGlyZWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlRm9ybUFycmF5KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSBgRm9ybUFycmF5YCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICAgKi9cbiAgICBnZXQgY29udHJvbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybURpcmVjdGl2ZS5nZXRGb3JtQXJyYXkodGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSB0b3AtbGV2ZWwgZGlyZWN0aXZlIGZvciB0aGlzIGdyb3VwIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICAgICAqL1xuICAgIGdldCBmb3JtRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gdGhpcy5fcGFyZW50LmZvcm1EaXJlY3RpdmUgOiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHRoYXQgcmVwcmVzZW50cyB0aGUgcGF0aCBmcm9tIHRoZSB0b3AtbGV2ZWwgZm9ybSB0byB0aGlzIGNvbnRyb2wuXG4gICAgICogRWFjaCBpbmRleCBpcyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGNvbnRyb2wgb24gdGhhdCBsZXZlbC5cbiAgICAgKi9cbiAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xQYXRoKHRoaXMubmFtZSA9PSBudWxsID8gdGhpcy5uYW1lIDogdGhpcy5uYW1lLnRvU3RyaW5nKCksIHRoaXMuX3BhcmVudCk7XG4gICAgfVxuICAgIF9jaGVja1BhcmVudFR5cGUoKSB7XG4gICAgICAgIGlmIChfaGFzSW52YWxpZFBhcmVudCh0aGlzLl9wYXJlbnQpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBhcnJheVBhcmVudEV4Y2VwdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1BcnJheU5hbWUsIGRlcHM6IFt7IHRva2VuOiBDb250cm9sQ29udGFpbmVyLCBob3N0OiB0cnVlLCBvcHRpb25hbDogdHJ1ZSwgc2tpcFNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfQVNZTkNfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfV0sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogRm9ybUFycmF5TmFtZSwgc2VsZWN0b3I6IFwiW2Zvcm1BcnJheU5hbWVdXCIsIGlucHV0czogeyBuYW1lOiBbXCJmb3JtQXJyYXlOYW1lXCIsIFwibmFtZVwiXSB9LCBwcm92aWRlcnM6IFtmb3JtQXJyYXlOYW1lUHJvdmlkZXJdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtQXJyYXlOYW1lLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3sgc2VsZWN0b3I6ICdbZm9ybUFycmF5TmFtZV0nLCBwcm92aWRlcnM6IFtmb3JtQXJyYXlOYW1lUHJvdmlkZXJdIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogQ29udHJvbENvbnRhaW5lciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEhvc3RcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNraXBTZWxmXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfQVNZTkNfVkFMSURBVE9SU11cbiAgICAgICAgICAgICAgICB9XSB9XSwgcHJvcERlY29yYXRvcnM6IHsgbmFtZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ2Zvcm1BcnJheU5hbWUnXVxuICAgICAgICAgICAgfV0gfSB9KTtcbmZ1bmN0aW9uIF9oYXNJbnZhbGlkUGFyZW50KHBhcmVudCkge1xuICAgIHJldHVybiAhKHBhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cE5hbWUpICYmICEocGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwRGlyZWN0aXZlKSAmJlxuICAgICAgICAhKHBhcmVudCBpbnN0YW5jZW9mIEZvcm1BcnJheU5hbWUpO1xufVxuXG5jb25zdCBjb250cm9sTmFtZUJpbmRpbmcgPSB7XG4gICAgcHJvdmlkZTogTmdDb250cm9sLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Db250cm9sTmFtZSlcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogU3luY3MgYSBgRm9ybUNvbnRyb2xgIGluIGFuIGV4aXN0aW5nIGBGb3JtR3JvdXBgIHRvIGEgZm9ybSBjb250cm9sXG4gKiBlbGVtZW50IGJ5IG5hbWUuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSB7QGxpbmsgRm9ybUNvbnRyb2x9XG4gKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2x9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUmVnaXN0ZXIgYEZvcm1Db250cm9sYCB3aXRoaW4gYSBncm91cFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gcmVnaXN0ZXIgbXVsdGlwbGUgZm9ybSBjb250cm9scyB3aXRoaW4gYSBmb3JtIGdyb3VwXG4gKiBhbmQgc2V0IHRoZWlyIHZhbHVlLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtR3JvdXAvc2ltcGxlX2Zvcm1fZ3JvdXBfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogVG8gc2VlIGBmb3JtQ29udHJvbE5hbWVgIGV4YW1wbGVzIHdpdGggZGlmZmVyZW50IGZvcm0gY29udHJvbCB0eXBlcywgc2VlOlxuICpcbiAqICogUmFkaW8gYnV0dG9uczogYFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3JgXG4gKiAqIFNlbGVjdHM6IGBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvcmBcbiAqXG4gKiAjIyMgVXNlIHdpdGggbmdNb2RlbCBpcyBkZXByZWNhdGVkXG4gKlxuICogU3VwcG9ydCBmb3IgdXNpbmcgdGhlIGBuZ01vZGVsYCBpbnB1dCBwcm9wZXJ0eSBhbmQgYG5nTW9kZWxDaGFuZ2VgIGV2ZW50IHdpdGggcmVhY3RpdmVcbiAqIGZvcm0gZGlyZWN0aXZlcyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIGlzIHNjaGVkdWxlZCBmb3IgcmVtb3ZhbCBpblxuICogYSBmdXR1cmUgdmVyc2lvbiBvZiBBbmd1bGFyLlxuICpcbiAqIEZvciBkZXRhaWxzLCBzZWUgW0RlcHJlY2F0ZWQgZmVhdHVyZXNdKGd1aWRlL2RlcHJlY2F0aW9ucyNuZ21vZGVsLXdpdGgtcmVhY3RpdmUtZm9ybXMpLlxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIEZvcm1Db250cm9sTmFtZSBleHRlbmRzIE5nQ29udHJvbCB7XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVHJpZ2dlcnMgYSB3YXJuaW5nIGluIGRldiBtb2RlIHRoYXQgdGhpcyBpbnB1dCBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3Jtcy5cbiAgICAgKi9cbiAgICBzZXQgaXNEaXNhYmxlZChpc0Rpc2FibGVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihkaXNhYmxlZEF0dHJXYXJuaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIGFueSBuZ01vZGVsIHdhcm5pbmdzIGhhdmUgYmVlbiBzZW50IGFjcm9zc1xuICAgICAqIGFsbCBpbnN0YW5jZXMgb2YgRm9ybUNvbnRyb2xOYW1lLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJvbmNlXCIuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBzdGF0aWMgeyB0aGlzLl9uZ01vZGVsV2FybmluZ1NlbnRPbmNlID0gZmFsc2U7IH1cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9ycywgdmFsdWVBY2Nlc3NvcnMsIF9uZ01vZGVsV2FybmluZ0NvbmZpZykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9uZ01vZGVsV2FybmluZ0NvbmZpZyA9IF9uZ01vZGVsV2FybmluZ0NvbmZpZztcbiAgICAgICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBUcmFja3MgdGhlIG5hbWUgb2YgdGhlIGBGb3JtQ29udHJvbGAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICAgICAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YC5cbiAgICAgICAgICogQWNjZXB0cyBhIG5hbWUgYXMgYSBzdHJpbmcgb3IgYSBudW1iZXIuXG4gICAgICAgICAqIFRoZSBuYW1lIGluIHRoZSBmb3JtIG9mIGEgc3RyaW5nIGlzIHVzZWZ1bCBmb3IgaW5kaXZpZHVhbCBmb3JtcyxcbiAgICAgICAgICogd2hpbGUgdGhlIG51bWVyaWNhbCBmb3JtIGFsbG93cyBmb3IgZm9ybSBjb250cm9scyB0byBiZSBib3VuZFxuICAgICAgICAgKiB0byBpbmRpY2VzIHdoZW4gaXRlcmF0aW5nIG92ZXIgY29udHJvbHMgaW4gYSBgRm9ybUFycmF5YC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgICAgIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqL1xuICAgICAgICB0aGlzLnVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBJbnN0YW5jZSBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW4gbmdNb2RlbCB3YXJuaW5nIGhhcyBiZWVuIHNlbnQgb3V0IGZvciB0aGlzXG4gICAgICAgICAqIHBhcnRpY3VsYXIgRm9ybUNvbnRyb2xOYW1lIGluc3RhbmNlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJhbHdheXNcIi5cbiAgICAgICAgICpcbiAgICAgICAgICogQGludGVybmFsXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9uZ01vZGVsV2FybmluZ1NlbnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLl9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgICAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gc2VsZWN0VmFsdWVBY2Nlc3Nvcih0aGlzLCB2YWx1ZUFjY2Vzc29ycyk7XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgICAgIGlmICghdGhpcy5fYWRkZWQpXG4gICAgICAgICAgICB0aGlzLl9zZXRVcENvbnRyb2woKTtcbiAgICAgICAgaWYgKGlzUHJvcGVydHlVcGRhdGVkKGNoYW5nZXMsIHRoaXMudmlld01vZGVsKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgICAgICAgIF9uZ01vZGVsV2FybmluZygnZm9ybUNvbnRyb2xOYW1lJywgRm9ybUNvbnRyb2xOYW1lLCB0aGlzLCB0aGlzLl9uZ01vZGVsV2FybmluZ0NvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnZpZXdNb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUudXBkYXRlTW9kZWwodGhpcywgdGhpcy5tb2RlbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5mb3JtRGlyZWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlQ29udHJvbCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSB2aWV3IG1vZGVsIGFuZCBlbWl0cyBhbiBgbmdNb2RlbENoYW5nZWAgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmV3VmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwuXG4gICAgICovXG4gICAgdmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWUpIHtcbiAgICAgICAgdGhpcy52aWV3TW9kZWwgPSBuZXdWYWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUuZW1pdChuZXdWYWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgICAqL1xuICAgIGdldCBwYXRoKCkge1xuICAgICAgICByZXR1cm4gY29udHJvbFBhdGgodGhpcy5uYW1lID09IG51bGwgPyB0aGlzLm5hbWUgOiB0aGlzLm5hbWUudG9TdHJpbmcoKSwgdGhpcy5fcGFyZW50KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUgZm9yIHRoaXMgZ3JvdXAgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAgICovXG4gICAgZ2V0IGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7XG4gICAgfVxuICAgIF9jaGVja1BhcmVudFR5cGUoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cE5hbWUpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50IGluc3RhbmNlb2YgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZ01vZGVsR3JvdXBFeGNlcHRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwTmFtZSkgJiZcbiAgICAgICAgICAgICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cERpcmVjdGl2ZSkgJiZcbiAgICAgICAgICAgICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1BcnJheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgY29udHJvbFBhcmVudEV4Y2VwdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9zZXRVcENvbnRyb2woKSB7XG4gICAgICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgICAgICB0aGlzLmNvbnRyb2wgPSB0aGlzLmZvcm1EaXJlY3RpdmUuYWRkQ29udHJvbCh0aGlzKTtcbiAgICAgICAgdGhpcy5fYWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtQ29udHJvbE5hbWUsIGRlcHM6IFt7IHRva2VuOiBDb250cm9sQ29udGFpbmVyLCBob3N0OiB0cnVlLCBvcHRpb25hbDogdHJ1ZSwgc2tpcFNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfQVNZTkNfVkFMSURBVE9SUywgb3B0aW9uYWw6IHRydWUsIHNlbGY6IHRydWUgfSwgeyB0b2tlbjogTkdfVkFMVUVfQUNDRVNTT1IsIG9wdGlvbmFsOiB0cnVlLCBzZWxmOiB0cnVlIH0sIHsgdG9rZW46IE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsIG9wdGlvbmFsOiB0cnVlIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IEZvcm1Db250cm9sTmFtZSwgc2VsZWN0b3I6IFwiW2Zvcm1Db250cm9sTmFtZV1cIiwgaW5wdXRzOiB7IG5hbWU6IFtcImZvcm1Db250cm9sTmFtZVwiLCBcIm5hbWVcIl0sIGlzRGlzYWJsZWQ6IFtcImRpc2FibGVkXCIsIFwiaXNEaXNhYmxlZFwiXSwgbW9kZWw6IFtcIm5nTW9kZWxcIiwgXCJtb2RlbFwiXSB9LCBvdXRwdXRzOiB7IHVwZGF0ZTogXCJuZ01vZGVsQ2hhbmdlXCIgfSwgcHJvdmlkZXJzOiBbY29udHJvbE5hbWVCaW5kaW5nXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCB1c2VzT25DaGFuZ2VzOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRm9ybUNvbnRyb2xOYW1lLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3sgc2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xOYW1lXScsIHByb3ZpZGVyczogW2NvbnRyb2xOYW1lQmluZGluZ10gfV1cbiAgICAgICAgfV0sIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiBbeyB0eXBlOiBDb250cm9sQ29udGFpbmVyLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSG9zdFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2tpcFNlbGZcbiAgICAgICAgICAgICAgICB9XSB9LCB7IHR5cGU6IHVuZGVmaW5lZCwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbGZcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW05HX1ZBTElEQVRPUlNdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTZWxmXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19BU1lOQ19WQUxJREFUT1JTXVxuICAgICAgICAgICAgICAgIH1dIH0sIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBPcHRpb25hbFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogSW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbTkdfVkFMVUVfQUNDRVNTT1JdXG4gICAgICAgICAgICAgICAgfV0gfSwgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HXVxuICAgICAgICAgICAgICAgIH1dIH1dLCBwcm9wRGVjb3JhdG9yczogeyBuYW1lOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnZm9ybUNvbnRyb2xOYW1lJ11cbiAgICAgICAgICAgIH1dLCBpc0Rpc2FibGVkOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnZGlzYWJsZWQnXVxuICAgICAgICAgICAgfV0sIG1vZGVsOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsnbmdNb2RlbCddXG4gICAgICAgICAgICB9XSwgdXBkYXRlOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IE91dHB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ25nTW9kZWxDaGFuZ2UnXVxuICAgICAgICAgICAgfV0gfSB9KTtcblxuY29uc3QgU0VMRUNUX1ZBTFVFX0FDQ0VTU09SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbmZ1bmN0aW9uIF9idWlsZFZhbHVlU3RyaW5nJDEoaWQsIHZhbHVlKSB7XG4gICAgaWYgKGlkID09IG51bGwpXG4gICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKVxuICAgICAgICB2YWx1ZSA9ICdPYmplY3QnO1xuICAgIHJldHVybiBgJHtpZH06ICR7dmFsdWV9YC5zbGljZSgwLCA1MCk7XG59XG5mdW5jdGlvbiBfZXh0cmFjdElkJDEodmFsdWVTdHJpbmcpIHtcbiAgICByZXR1cm4gdmFsdWVTdHJpbmcuc3BsaXQoJzonKVswXTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyBzZWxlY3QgY29udHJvbCB2YWx1ZXMgYW5kIGxpc3RlbmluZyB0byBzZWxlY3QgY29udHJvbFxuICogY2hhbmdlcy4gVGhlIHZhbHVlIGFjY2Vzc29yIGlzIHVzZWQgYnkgdGhlIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAsIGBGb3JtQ29udHJvbE5hbWVgLCBhbmRcbiAqIGBOZ01vZGVsYCBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIHNlbGVjdCBjb250cm9scyBpbiBhIHJlYWN0aXZlIGZvcm1cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGVzIHNob3cgaG93IHRvIHVzZSBhIHNlbGVjdCBjb250cm9sIGluIGEgcmVhY3RpdmUgZm9ybS5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvcmVhY3RpdmVTZWxlY3RDb250cm9sL3JlYWN0aXZlX3NlbGVjdF9jb250cm9sX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqICMjIyBVc2luZyBzZWxlY3QgY29udHJvbHMgaW4gYSB0ZW1wbGF0ZS1kcml2ZW4gZm9ybVxuICpcbiAqIFRvIHVzZSBhIHNlbGVjdCBpbiBhIHRlbXBsYXRlLWRyaXZlbiBmb3JtLCBzaW1wbHkgYWRkIGFuIGBuZ01vZGVsYCBhbmQgYSBgbmFtZWBcbiAqIGF0dHJpYnV0ZSB0byB0aGUgbWFpbiBgPHNlbGVjdD5gIHRhZy5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2VsZWN0Q29udHJvbC9zZWxlY3RfY29udHJvbF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiAjIyMgQ3VzdG9taXppbmcgb3B0aW9uIHNlbGVjdGlvblxuICpcbiAqIEFuZ3VsYXIgdXNlcyBvYmplY3QgaWRlbnRpdHkgdG8gc2VsZWN0IG9wdGlvbi4gSXQncyBwb3NzaWJsZSBmb3IgdGhlIGlkZW50aXRpZXMgb2YgaXRlbXNcbiAqIHRvIGNoYW5nZSB3aGlsZSB0aGUgZGF0YSBkb2VzIG5vdC4gVGhpcyBjYW4gaGFwcGVuLCBmb3IgZXhhbXBsZSwgaWYgdGhlIGl0ZW1zIGFyZSBwcm9kdWNlZFxuICogZnJvbSBhbiBSUEMgdG8gdGhlIHNlcnZlciwgYW5kIHRoYXQgUlBDIGlzIHJlLXJ1bi4gRXZlbiBpZiB0aGUgZGF0YSBoYXNuJ3QgY2hhbmdlZCwgdGhlXG4gKiBzZWNvbmQgcmVzcG9uc2Ugd2lsbCBwcm9kdWNlIG9iamVjdHMgd2l0aCBkaWZmZXJlbnQgaWRlbnRpdGllcy5cbiAqXG4gKiBUbyBjdXN0b21pemUgdGhlIGRlZmF1bHQgb3B0aW9uIGNvbXBhcmlzb24gYWxnb3JpdGhtLCBgPHNlbGVjdD5gIHN1cHBvcnRzIGBjb21wYXJlV2l0aGAgaW5wdXQuXG4gKiBgY29tcGFyZVdpdGhgIHRha2VzIGEgKipmdW5jdGlvbioqIHdoaWNoIGhhcyB0d28gYXJndW1lbnRzOiBgb3B0aW9uMWAgYW5kIGBvcHRpb24yYC5cbiAqIElmIGBjb21wYXJlV2l0aGAgaXMgZ2l2ZW4sIEFuZ3VsYXIgc2VsZWN0cyBvcHRpb24gYnkgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24uXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IHNlbGVjdGVkQ291bnRyaWVzQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogYGBgXG4gKlxuICogYGBgXG4gKiA8c2VsZWN0IFtjb21wYXJlV2l0aF09XCJjb21wYXJlRm5cIiAgW2Zvcm1Db250cm9sXT1cInNlbGVjdGVkQ291bnRyaWVzQ29udHJvbFwiPlxuICogICAgIDxvcHRpb24gKm5nRm9yPVwibGV0IGNvdW50cnkgb2YgY291bnRyaWVzXCIgW25nVmFsdWVdPVwiY291bnRyeVwiPlxuICogICAgICAgICB7e2NvdW50cnkubmFtZX19XG4gKiAgICAgPC9vcHRpb24+XG4gKiA8L3NlbGVjdD5cbiAqXG4gKiBjb21wYXJlRm4oYzE6IENvdW50cnksIGMyOiBDb3VudHJ5KTogYm9vbGVhbiB7XG4gKiAgICAgcmV0dXJuIGMxICYmIGMyID8gYzEuaWQgPT09IGMyLmlkIDogYzEgPT09IGMyO1xuICogfVxuICogYGBgXG4gKlxuICogKipOb3RlOioqIFdlIGxpc3RlbiB0byB0aGUgJ2NoYW5nZScgZXZlbnQgYmVjYXVzZSAnaW5wdXQnIGV2ZW50cyBhcmVuJ3QgZmlyZWRcbiAqIGZvciBzZWxlY3RzIGluIElFLCBzZWU6XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQvaW5wdXRfZXZlbnQjYnJvd3Nlcl9jb21wYXRpYmlsaXR5XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvciBleHRlbmRzIEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fb3B0aW9uTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX2lkQ291bnRlciA9IDA7XG4gICAgICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gT2JqZWN0LmlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUcmFja3MgdGhlIG9wdGlvbiBjb21wYXJpc29uIGFsZ29yaXRobSBmb3IgdHJhY2tpbmcgaWRlbnRpdGllcyB3aGVuXG4gICAgICogY2hlY2tpbmcgZm9yIGNoYW5nZXMuXG4gICAgICovXG4gICAgc2V0IGNvbXBhcmVXaXRoKGZuKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyDJtVJ1bnRpbWVFcnJvcigxMjAxIC8qIFJ1bnRpbWVFcnJvckNvZGUuQ09NUEFSRVdJVEhfTk9UX0FfRk4gKi8sIGBjb21wYXJlV2l0aCBtdXN0IGJlIGEgZnVuY3Rpb24sIGJ1dCByZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KGZuKX1gKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb21wYXJlV2l0aCA9IGZuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBcInZhbHVlXCIgcHJvcGVydHkgb24gdGhlIHNlbGVjdCBlbGVtZW50LlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuX2dldE9wdGlvbklkKHZhbHVlKTtcbiAgICAgICAgY29uc3QgdmFsdWVTdHJpbmcgPSBfYnVpbGRWYWx1ZVN0cmluZyQxKGlkLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ3ZhbHVlJywgdmFsdWVTdHJpbmcpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBjaGFuZ2VzLlxuICAgICAqIEBub2RvY1xuICAgICAqL1xuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9ICh2YWx1ZVN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2dldE9wdGlvblZhbHVlKHZhbHVlU3RyaW5nKTtcbiAgICAgICAgICAgIGZuKHRoaXMudmFsdWUpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3JlZ2lzdGVyT3B0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2lkQ291bnRlcisrKS50b1N0cmluZygpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2dldE9wdGlvbklkKHZhbHVlKSB7XG4gICAgICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5fb3B0aW9uTWFwLmtleXMoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbXBhcmVXaXRoKHRoaXMuX29wdGlvbk1hcC5nZXQoaWQpLCB2YWx1ZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2dldE9wdGlvblZhbHVlKHZhbHVlU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGlkID0gX2V4dHJhY3RJZCQxKHZhbHVlU3RyaW5nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbk1hcC5oYXMoaWQpID8gdGhpcy5fb3B0aW9uTWFwLmdldChpZCkgOiB2YWx1ZVN0cmluZztcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IsIHNlbGVjdG9yOiBcInNlbGVjdDpub3QoW211bHRpcGxlXSlbZm9ybUNvbnRyb2xOYW1lXSxzZWxlY3Q6bm90KFttdWx0aXBsZV0pW2Zvcm1Db250cm9sXSxzZWxlY3Q6bm90KFttdWx0aXBsZV0pW25nTW9kZWxdXCIsIGlucHV0czogeyBjb21wYXJlV2l0aDogXCJjb21wYXJlV2l0aFwiIH0sIGhvc3Q6IHsgbGlzdGVuZXJzOiB7IFwiY2hhbmdlXCI6IFwib25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSlcIiwgXCJibHVyXCI6IFwib25Ub3VjaGVkKClcIiB9IH0sIHByb3ZpZGVyczogW1NFTEVDVF9WQUxVRV9BQ0NFU1NPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdzZWxlY3Q6bm90KFttdWx0aXBsZV0pW2Zvcm1Db250cm9sTmFtZV0sc2VsZWN0Om5vdChbbXVsdGlwbGVdKVtmb3JtQ29udHJvbF0sc2VsZWN0Om5vdChbbXVsdGlwbGVdKVtuZ01vZGVsXScsXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJywgJyhibHVyKSc6ICdvblRvdWNoZWQoKScgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbU0VMRUNUX1ZBTFVFX0FDQ0VTU09SXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBwcm9wRGVjb3JhdG9yczogeyBjb21wYXJlV2l0aDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBNYXJrcyBgPG9wdGlvbj5gIGFzIGR5bmFtaWMsIHNvIEFuZ3VsYXIgY2FuIGJlIG5vdGlmaWVkIHdoZW4gb3B0aW9ucyBjaGFuZ2UuXG4gKlxuICogQHNlZSB7QGxpbmsgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3J9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBOZ1NlbGVjdE9wdGlvbiB7XG4gICAgY29uc3RydWN0b3IoX2VsZW1lbnQsIF9yZW5kZXJlciwgX3NlbGVjdCkge1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gX2VsZW1lbnQ7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyID0gX3JlbmRlcmVyO1xuICAgICAgICB0aGlzLl9zZWxlY3QgPSBfc2VsZWN0O1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0KVxuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMuX3NlbGVjdC5fcmVnaXN0ZXJPcHRpb24oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVHJhY2tzIHRoZSB2YWx1ZSBib3VuZCB0byB0aGUgb3B0aW9uIGVsZW1lbnQuIFVubGlrZSB0aGUgdmFsdWUgYmluZGluZyxcbiAgICAgKiBuZ1ZhbHVlIHN1cHBvcnRzIGJpbmRpbmcgdG8gb2JqZWN0cy5cbiAgICAgKi9cbiAgICBzZXQgbmdWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX3NlbGVjdC5fb3B0aW9uTWFwLnNldCh0aGlzLmlkLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZShfYnVpbGRWYWx1ZVN0cmluZyQxKHRoaXMuaWQsIHZhbHVlKSk7XG4gICAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRyYWNrcyBzaW1wbGUgc3RyaW5nIHZhbHVlcyBib3VuZCB0byB0aGUgb3B0aW9uIGVsZW1lbnQuXG4gICAgICogRm9yIG9iamVjdHMsIHVzZSB0aGUgYG5nVmFsdWVgIGlucHV0IGJpbmRpbmcuXG4gICAgICovXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QpXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHZhbHVlKTtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3QuX29wdGlvbk1hcC5kZWxldGUodGhpcy5pZCk7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5nU2VsZWN0T3B0aW9uLCBkZXBzOiBbeyB0b2tlbjogaTAuRWxlbWVudFJlZiB9LCB7IHRva2VuOiBpMC5SZW5kZXJlcjIgfSwgeyB0b2tlbjogU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IsIGhvc3Q6IHRydWUsIG9wdGlvbmFsOiB0cnVlIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IE5nU2VsZWN0T3B0aW9uLCBzZWxlY3RvcjogXCJvcHRpb25cIiwgaW5wdXRzOiB7IG5nVmFsdWU6IFwibmdWYWx1ZVwiLCB2YWx1ZTogXCJ2YWx1ZVwiIH0sIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBOZ1NlbGVjdE9wdGlvbiwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7IHNlbGVjdG9yOiAnb3B0aW9uJyB9XVxuICAgICAgICB9XSwgY3RvclBhcmFtZXRlcnM6ICgpID0+IFt7IHR5cGU6IGkwLkVsZW1lbnRSZWYgfSwgeyB0eXBlOiBpMC5SZW5kZXJlcjIgfSwgeyB0eXBlOiBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT3B0aW9uYWxcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEhvc3RcbiAgICAgICAgICAgICAgICB9XSB9XSwgcHJvcERlY29yYXRvcnM6IHsgbmdWYWx1ZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ25nVmFsdWUnXVxuICAgICAgICAgICAgfV0sIHZhbHVlOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IFsndmFsdWUnXVxuICAgICAgICAgICAgfV0gfSB9KTtcblxuY29uc3QgU0VMRUNUX01VTFRJUExFX1ZBTFVFX0FDQ0VTU09SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuZnVuY3Rpb24gX2J1aWxkVmFsdWVTdHJpbmcoaWQsIHZhbHVlKSB7XG4gICAgaWYgKGlkID09IG51bGwpXG4gICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKVxuICAgICAgICB2YWx1ZSA9IGAnJHt2YWx1ZX0nYDtcbiAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JylcbiAgICAgICAgdmFsdWUgPSAnT2JqZWN0JztcbiAgICByZXR1cm4gYCR7aWR9OiAke3ZhbHVlfWAuc2xpY2UoMCwgNTApO1xufVxuZnVuY3Rpb24gX2V4dHJhY3RJZCh2YWx1ZVN0cmluZykge1xuICAgIHJldHVybiB2YWx1ZVN0cmluZy5zcGxpdCgnOicpWzBdO1xufVxuLyoqIE1vY2sgaW50ZXJmYWNlIGZvciBIVE1MQ29sbGVjdGlvbiAqL1xuY2xhc3MgSFRNTENvbGxlY3Rpb24ge1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciB3cml0aW5nIG11bHRpLXNlbGVjdCBjb250cm9sIHZhbHVlcyBhbmQgbGlzdGVuaW5nIHRvIG11bHRpLXNlbGVjdFxuICogY29udHJvbCBjaGFuZ2VzLiBUaGUgdmFsdWUgYWNjZXNzb3IgaXMgdXNlZCBieSB0aGUgYEZvcm1Db250cm9sRGlyZWN0aXZlYCwgYEZvcm1Db250cm9sTmFtZWAsIGFuZFxuICogYE5nTW9kZWxgIGRpcmVjdGl2ZXMuXG4gKlxuICogQHNlZSB7QGxpbmsgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3J9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgVXNpbmcgYSBtdWx0aS1zZWxlY3QgY29udHJvbFxuICpcbiAqIFRoZSBmb2xsb3cgZXhhbXBsZSBzaG93cyB5b3UgaG93IHRvIHVzZSBhIG11bHRpLXNlbGVjdCBjb250cm9sIHdpdGggYSByZWFjdGl2ZSBmb3JtLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb3VudHJ5Q29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogYGBgXG4gKlxuICogYGBgXG4gKiA8c2VsZWN0IG11bHRpcGxlIG5hbWU9XCJjb3VudHJpZXNcIiBbZm9ybUNvbnRyb2xdPVwiY291bnRyeUNvbnRyb2xcIj5cbiAqICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgY291bnRyeSBvZiBjb3VudHJpZXNcIiBbbmdWYWx1ZV09XCJjb3VudHJ5XCI+XG4gKiAgICAge3sgY291bnRyeS5uYW1lIH19XG4gKiAgIDwvb3B0aW9uPlxuICogPC9zZWxlY3Q+XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3VzdG9taXppbmcgb3B0aW9uIHNlbGVjdGlvblxuICpcbiAqIFRvIGN1c3RvbWl6ZSB0aGUgZGVmYXVsdCBvcHRpb24gY29tcGFyaXNvbiBhbGdvcml0aG0sIGA8c2VsZWN0PmAgc3VwcG9ydHMgYGNvbXBhcmVXaXRoYCBpbnB1dC5cbiAqIFNlZSB0aGUgYFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3IgdXNhZ2UuXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLl9vcHRpb25NYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5faWRDb3VudGVyID0gMDtcbiAgICAgICAgdGhpcy5fY29tcGFyZVdpdGggPSBPYmplY3QuaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRyYWNrcyB0aGUgb3B0aW9uIGNvbXBhcmlzb24gYWxnb3JpdGhtIGZvciB0cmFja2luZyBpZGVudGl0aWVzIHdoZW5cbiAgICAgKiBjaGVja2luZyBmb3IgY2hhbmdlcy5cbiAgICAgKi9cbiAgICBzZXQgY29tcGFyZVdpdGgoZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IMm1UnVudGltZUVycm9yKDEyMDEgLyogUnVudGltZUVycm9yQ29kZS5DT01QQVJFV0lUSF9OT1RfQV9GTiAqLywgYGNvbXBhcmVXaXRoIG11c3QgYmUgYSBmdW5jdGlvbiwgYnV0IHJlY2VpdmVkICR7SlNPTi5zdHJpbmdpZnkoZm4pfWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIFwidmFsdWVcIiBwcm9wZXJ0eSBvbiBvbmUgb3Igb2YgbW9yZSBvZiB0aGUgc2VsZWN0J3Mgb3B0aW9ucy5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgbGV0IG9wdGlvblNlbGVjdGVkU3RhdGVTZXR0ZXI7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gY29udmVydCB2YWx1ZXMgdG8gaWRzXG4gICAgICAgICAgICBjb25zdCBpZHMgPSB2YWx1ZS5tYXAoKHYpID0+IHRoaXMuX2dldE9wdGlvbklkKHYpKTtcbiAgICAgICAgICAgIG9wdGlvblNlbGVjdGVkU3RhdGVTZXR0ZXIgPSAob3B0LCBvKSA9PiB7XG4gICAgICAgICAgICAgICAgb3B0Ll9zZXRTZWxlY3RlZChpZHMuaW5kZXhPZihvLnRvU3RyaW5nKCkpID4gLTEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvblNlbGVjdGVkU3RhdGVTZXR0ZXIgPSAob3B0LCBvKSA9PiB7XG4gICAgICAgICAgICAgICAgb3B0Ll9zZXRTZWxlY3RlZChmYWxzZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29wdGlvbk1hcC5mb3JFYWNoKG9wdGlvblNlbGVjdGVkU3RhdGVTZXR0ZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBjaGFuZ2VzXG4gICAgICogYW5kIHdyaXRlcyBhbiBhcnJheSBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9ucy5cbiAgICAgKiBAbm9kb2NcbiAgICAgKi9cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSAoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IGVsZW1lbnQuc2VsZWN0ZWRPcHRpb25zO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkT3B0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHNlbGVjdGVkT3B0aW9ucztcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0ID0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy5fZ2V0T3B0aW9uVmFsdWUob3B0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERlZ3JhZGUgdG8gdXNlIGBvcHRpb25zYCB3aGVuIGBzZWxlY3RlZE9wdGlvbnNgIHByb3BlcnR5IGlzIG5vdCBhdmFpbGFibGUuXG4gICAgICAgICAgICAvLyBOb3RlOiB0aGUgYHNlbGVjdGVkT3B0aW9uc2AgaXMgYXZhaWxhYmxlIGluIGFsbCBzdXBwb3J0ZWQgYnJvd3NlcnMsIGJ1dCB0aGUgRG9taW5vIGxpYlxuICAgICAgICAgICAgLy8gZG9lc24ndCBoYXZlIGl0IGN1cnJlbnRseSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mZ25hc3MvZG9taW5vL2lzc3Vlcy8xNzcuXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gZWxlbWVudC5vcHRpb25zO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHQgPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLl9nZXRPcHRpb25WYWx1ZShvcHQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHNlbGVjdGVkO1xuICAgICAgICAgICAgZm4oc2VsZWN0ZWQpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3JlZ2lzdGVyT3B0aW9uKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGlkID0gKHRoaXMuX2lkQ291bnRlcisrKS50b1N0cmluZygpO1xuICAgICAgICB0aGlzLl9vcHRpb25NYXAuc2V0KGlkLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9nZXRPcHRpb25JZCh2YWx1ZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGlkIG9mIHRoaXMuX29wdGlvbk1hcC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb21wYXJlV2l0aCh0aGlzLl9vcHRpb25NYXAuZ2V0KGlkKS5fdmFsdWUsIHZhbHVlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZ2V0T3B0aW9uVmFsdWUodmFsdWVTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaWQgPSBfZXh0cmFjdElkKHZhbHVlU3RyaW5nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbk1hcC5oYXMoaWQpID8gdGhpcy5fb3B0aW9uTWFwLmdldChpZCkuX3ZhbHVlIDogdmFsdWVTdHJpbmc7XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3Nvciwgc2VsZWN0b3I6IFwic2VsZWN0W211bHRpcGxlXVtmb3JtQ29udHJvbE5hbWVdLHNlbGVjdFttdWx0aXBsZV1bZm9ybUNvbnRyb2xdLHNlbGVjdFttdWx0aXBsZV1bbmdNb2RlbF1cIiwgaW5wdXRzOiB7IGNvbXBhcmVXaXRoOiBcImNvbXBhcmVXaXRoXCIgfSwgaG9zdDogeyBsaXN0ZW5lcnM6IHsgXCJjaGFuZ2VcIjogXCJvbkNoYW5nZSgkZXZlbnQudGFyZ2V0KVwiLCBcImJsdXJcIjogXCJvblRvdWNoZWQoKVwiIH0gfSwgcHJvdmlkZXJzOiBbU0VMRUNUX01VTFRJUExFX1ZBTFVFX0FDQ0VTU09SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnc2VsZWN0W211bHRpcGxlXVtmb3JtQ29udHJvbE5hbWVdLHNlbGVjdFttdWx0aXBsZV1bZm9ybUNvbnRyb2xdLHNlbGVjdFttdWx0aXBsZV1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICcoY2hhbmdlKSc6ICdvbkNoYW5nZSgkZXZlbnQudGFyZ2V0KScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW1NFTEVDVF9NVUxUSVBMRV9WQUxVRV9BQ0NFU1NPUl1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgcHJvcERlY29yYXRvcnM6IHsgY29tcGFyZVdpdGg6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dIH0gfSk7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogTWFya3MgYDxvcHRpb24+YCBhcyBkeW5hbWljLCBzbyBBbmd1bGFyIGNhbiBiZSBub3RpZmllZCB3aGVuIG9wdGlvbnMgY2hhbmdlLlxuICpcbiAqIEBzZWUge0BsaW5rIFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3J9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKF9lbGVtZW50LCBfcmVuZGVyZXIsIF9zZWxlY3QpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IF9lbGVtZW50O1xuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IF9yZW5kZXJlcjtcbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gX3NlbGVjdDtcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMuX3NlbGVjdC5fcmVnaXN0ZXJPcHRpb24odGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVHJhY2tzIHRoZSB2YWx1ZSBib3VuZCB0byB0aGUgb3B0aW9uIGVsZW1lbnQuIFVubGlrZSB0aGUgdmFsdWUgYmluZGluZyxcbiAgICAgKiBuZ1ZhbHVlIHN1cHBvcnRzIGJpbmRpbmcgdG8gb2JqZWN0cy5cbiAgICAgKi9cbiAgICBzZXQgbmdWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZShfYnVpbGRWYWx1ZVN0cmluZyh0aGlzLmlkLCB2YWx1ZSkpO1xuICAgICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUcmFja3Mgc2ltcGxlIHN0cmluZyB2YWx1ZXMgYm91bmQgdG8gdGhlIG9wdGlvbiBlbGVtZW50LlxuICAgICAqIEZvciBvYmplY3RzLCB1c2UgdGhlIGBuZ1ZhbHVlYCBpbnB1dCBiaW5kaW5nLlxuICAgICAqL1xuICAgIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKF9idWlsZFZhbHVlU3RyaW5nKHRoaXMuaWQsIHZhbHVlKSk7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHZhbHVlKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9zZXRTZWxlY3RlZChzZWxlY3RlZCkge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzZWxlY3RlZCcsIHNlbGVjdGVkKTtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3QuX29wdGlvbk1hcC5kZWxldGUodGhpcy5pZCk7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IMm1TmdTZWxlY3RNdWx0aXBsZU9wdGlvbiwgZGVwczogW3sgdG9rZW46IGkwLkVsZW1lbnRSZWYgfSwgeyB0b2tlbjogaTAuUmVuZGVyZXIyIH0sIHsgdG9rZW46IFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IsIGhvc3Q6IHRydWUsIG9wdGlvbmFsOiB0cnVlIH1dLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IMm1TmdTZWxlY3RNdWx0aXBsZU9wdGlvbiwgc2VsZWN0b3I6IFwib3B0aW9uXCIsIGlucHV0czogeyBuZ1ZhbHVlOiBcIm5nVmFsdWVcIiwgdmFsdWU6IFwidmFsdWVcIiB9LCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogybVOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3sgc2VsZWN0b3I6ICdvcHRpb24nIH1dXG4gICAgICAgIH1dLCBjdG9yUGFyYW1ldGVyczogKCkgPT4gW3sgdHlwZTogaTAuRWxlbWVudFJlZiB9LCB7IHR5cGU6IGkwLlJlbmRlcmVyMiB9LCB7IHR5cGU6IFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9wdGlvbmFsXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBIb3N0XG4gICAgICAgICAgICAgICAgfV0gfV0sIHByb3BEZWNvcmF0b3JzOiB7IG5nVmFsdWU6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXQsXG4gICAgICAgICAgICAgICAgYXJnczogWyduZ1ZhbHVlJ11cbiAgICAgICAgICAgIH1dLCB2YWx1ZTogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dCxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJ3ZhbHVlJ11cbiAgICAgICAgICAgIH1dIH0gfSk7XG5cbi8qKlxuICogTWV0aG9kIHRoYXQgdXBkYXRlcyBzdHJpbmcgdG8gaW50ZWdlciBpZiBub3QgYWxyZWFkeSBhIG51bWJlclxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBpbnRlZ2VyLlxuICogQHJldHVybnMgdmFsdWUgb2YgcGFyYW1ldGVyIGNvbnZlcnRlZCB0byBudW1iZXIgb3IgaW50ZWdlci5cbiAqL1xuZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyB2YWx1ZSA6IHBhcnNlSW50KHZhbHVlLCAxMCk7XG59XG4vKipcbiAqIE1ldGhvZCB0aGF0IGVuc3VyZXMgdGhhdCBwcm92aWRlZCB2YWx1ZSBpcyBhIGZsb2F0IChhbmQgY29udmVydHMgaXQgdG8gZmxvYXQgaWYgbmVlZGVkKS5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gZmxvYXQuXG4gKiBAcmV0dXJucyB2YWx1ZSBvZiBwYXJhbWV0ZXIgY29udmVydGVkIHRvIG51bWJlciBvciBmbG9hdC5cbiAqL1xuZnVuY3Rpb24gdG9GbG9hdCh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gdmFsdWUgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbn1cbi8qKlxuICogQSBiYXNlIGNsYXNzIGZvciBWYWxpZGF0b3ItYmFzZWQgRGlyZWN0aXZlcy4gVGhlIGNsYXNzIGNvbnRhaW5zIGNvbW1vbiBsb2dpYyBzaGFyZWQgYWNyb3NzIHN1Y2hcbiAqIERpcmVjdGl2ZXMuXG4gKlxuICogRm9yIGludGVybmFsIHVzZSBvbmx5LCB0aGlzIGNsYXNzIGlzIG5vdCBpbnRlbmRlZCBmb3IgdXNlIG91dHNpZGUgb2YgdGhlIEZvcm1zIHBhY2thZ2UuXG4gKi9cbmNsYXNzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdG9yID0gbnVsbFZhbGlkYXRvcjtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5wdXROYW1lIGluIGNoYW5nZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5ub3JtYWxpemVJbnB1dChjaGFuZ2VzW3RoaXMuaW5wdXROYW1lXS5jdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHRoaXMuZW5hYmxlZChpbnB1dCk7XG4gICAgICAgICAgICB0aGlzLl92YWxpZGF0b3IgPSB0aGlzLl9lbmFibGVkID8gdGhpcy5jcmVhdGVWYWxpZGF0b3IoaW5wdXQpIDogbnVsbFZhbGlkYXRvcjtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vbkNoYW5nZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIHZhbGlkYXRlKGNvbnRyb2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvcihjb250cm9sKTtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoaXMgdmFsaWRhdG9yIHNob3VsZCBiZSBhY3RpdmUgb3Igbm90IGJhc2VkIG9uIGFuIGlucHV0LlxuICAgICAqIEJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb24gY2hlY2tzIHdoZXRoZXIgYW4gaW5wdXQgaXMgZGVmaW5lZCAoaWYgdGhlIHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tXG4gICAgICogYG51bGxgIGFuZCBgdW5kZWZpbmVkYCkuIFZhbGlkYXRvciBjbGFzc2VzIHRoYXQgZXh0ZW5kIHRoaXMgYmFzZSBjbGFzcyBjYW4gb3ZlcnJpZGUgdGhpc1xuICAgICAqIGZ1bmN0aW9uIHdpdGggdGhlIGxvZ2ljIHNwZWNpZmljIHRvIGEgcGFydGljdWxhciB2YWxpZGF0b3IgZGlyZWN0aXZlLlxuICAgICAqL1xuICAgIGVuYWJsZWQoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgLyogYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgICovO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSwgZGVwczogW10sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUsIHVzZXNPbkNoYW5nZXM6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZVxuICAgICAgICB9XSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNYXhWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuY29uc3QgTUFYX1ZBTElEQVRPUiA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1heFZhbGlkYXRvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIEEgZGlyZWN0aXZlIHdoaWNoIGluc3RhbGxzIHRoZSB7QGxpbmsgTWF4VmFsaWRhdG9yfSBmb3IgYW55IGBmb3JtQ29udHJvbE5hbWVgLFxuICogYGZvcm1Db250cm9sYCwgb3IgY29udHJvbCB3aXRoIGBuZ01vZGVsYCB0aGF0IGFsc28gaGFzIGEgYG1heGAgYXR0cmlidXRlLlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIG1heCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1heCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG5nTW9kZWwgbWF4PVwiNFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBNYXhWYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5pbnB1dE5hbWUgPSAnbWF4JztcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZUlucHV0ID0gKGlucHV0KSA9PiB0b0Zsb2F0KGlucHV0KTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvciA9IChtYXgpID0+IG1heFZhbGlkYXRvcihtYXgpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBNYXhWYWxpZGF0b3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTWF4VmFsaWRhdG9yLCBzZWxlY3RvcjogXCJpbnB1dFt0eXBlPW51bWJlcl1bbWF4XVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVttYXhdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPW51bWJlcl1bbWF4XVtuZ01vZGVsXVwiLCBpbnB1dHM6IHsgbWF4OiBcIm1heFwiIH0sIGhvc3Q6IHsgcHJvcGVydGllczogeyBcImF0dHIubWF4XCI6IFwiX2VuYWJsZWQgPyBtYXggOiBudWxsXCIgfSB9LCBwcm92aWRlcnM6IFtNQVhfVkFMSURBVE9SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTWF4VmFsaWRhdG9yLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aXZlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPW51bWJlcl1bbWF4XVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVttYXhdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPW51bWJlcl1bbWF4XVtuZ01vZGVsXScsXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogW01BWF9WQUxJREFUT1JdLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICdbYXR0ci5tYXhdJzogJ19lbmFibGVkID8gbWF4IDogbnVsbCcgfVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBwcm9wRGVjb3JhdG9yczogeyBtYXg6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dIH0gfSk7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWluVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmNvbnN0IE1JTl9WQUxJREFUT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNaW5WYWxpZGF0b3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBBIGRpcmVjdGl2ZSB3aGljaCBpbnN0YWxscyB0aGUge0BsaW5rIE1pblZhbGlkYXRvcn0gZm9yIGFueSBgZm9ybUNvbnRyb2xOYW1lYCxcbiAqIGBmb3JtQ29udHJvbGAsIG9yIGNvbnRyb2wgd2l0aCBgbmdNb2RlbGAgdGhhdCBhbHNvIGhhcyBhIGBtaW5gIGF0dHJpYnV0ZS5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBtaW4gdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBtaW4gdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IHR5cGU9XCJudW1iZXJcIiBuZ01vZGVsIG1pbj1cIjRcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTWluVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuaW5wdXROYW1lID0gJ21pbic7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5ub3JtYWxpemVJbnB1dCA9IChpbnB1dCkgPT4gdG9GbG9hdChpbnB1dCk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5jcmVhdGVWYWxpZGF0b3IgPSAobWluKSA9PiBtaW5WYWxpZGF0b3IobWluKTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTWluVmFsaWRhdG9yLCBkZXBzOiBudWxsLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IE1pblZhbGlkYXRvciwgc2VsZWN0b3I6IFwiaW5wdXRbdHlwZT1udW1iZXJdW21pbl1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1udW1iZXJdW21pbl1bbmdNb2RlbF1cIiwgaW5wdXRzOiB7IG1pbjogXCJtaW5cIiB9LCBob3N0OiB7IHByb3BlcnRpZXM6IHsgXCJhdHRyLm1pblwiOiBcIl9lbmFibGVkID8gbWluIDogbnVsbFwiIH0gfSwgcHJvdmlkZXJzOiBbTUlOX1ZBTElEQVRPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE1pblZhbGlkYXRvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1udW1iZXJdW21pbl1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1udW1iZXJdW21pbl1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtNSU5fVkFMSURBVE9SXSxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogeyAnW2F0dHIubWluXSc6ICdfZW5hYmxlZCA/IG1pbiA6IG51bGwnIH1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgcHJvcERlY29yYXRvcnM6IHsgbWluOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6IElucHV0XG4gICAgICAgICAgICB9XSB9IH0pO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYFJlcXVpcmVkVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmNvbnN0IFJFUVVJUkVEX1ZBTElEQVRPUiA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmNvbnN0IENIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUiA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHJlcXVpcmVkYCB2YWxpZGF0b3IgdG8gYW55IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHJlcXVpcmVkYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcmVxdWlyZWQgdmFsaWRhdG9yIHVzaW5nIHRlbXBsYXRlLWRyaXZlbiBmb3Jtc1xuICpcbiAqIGBgYFxuICogPGlucHV0IG5hbWU9XCJmdWxsTmFtZVwiIG5nTW9kZWwgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIFJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuaW5wdXROYW1lID0gJ3JlcXVpcmVkJztcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZUlucHV0ID0gYm9vbGVhbkF0dHJpYnV0ZTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvciA9IChpbnB1dCkgPT4gcmVxdWlyZWRWYWxpZGF0b3I7XG4gICAgfVxuICAgIC8qKiBAbm9kb2MgKi9cbiAgICBlbmFibGVkKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUmVxdWlyZWRWYWxpZGF0b3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogUmVxdWlyZWRWYWxpZGF0b3IsIHNlbGVjdG9yOiBcIjpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW2Zvcm1Db250cm9sXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW25nTW9kZWxdXCIsIGlucHV0czogeyByZXF1aXJlZDogXCJyZXF1aXJlZFwiIH0sIGhvc3Q6IHsgcHJvcGVydGllczogeyBcImF0dHIucmVxdWlyZWRcIjogXCJfZW5hYmxlZCA/IFxcXCJcXFwiIDogbnVsbFwiIH0gfSwgcHJvdmlkZXJzOiBbUkVRVUlSRURfVkFMSURBVE9SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUmVxdWlyZWRWYWxpZGF0b3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJzpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW2Zvcm1Db250cm9sXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbUkVRVUlSRURfVkFMSURBVE9SXSxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogeyAnW2F0dHIucmVxdWlyZWRdJzogJ19lbmFibGVkID8gXCJcIiA6IG51bGwnIH1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSwgcHJvcERlY29yYXRvcnM6IHsgcmVxdWlyZWQ6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dIH0gfSk7XG4vKipcbiAqIEEgRGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHJlcXVpcmVkYCB2YWxpZGF0b3IgdG8gY2hlY2tib3ggY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcmVxdWlyZWRgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSByZXF1aXJlZCBjaGVja2JveCB2YWxpZGF0b3IgdXNpbmcgdGVtcGxhdGUtZHJpdmVuIGZvcm1zXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBjaGVja2JveCByZXF1aXJlZCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiYWN0aXZlXCIgbmdNb2RlbCByZXF1aXJlZD5cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuY2xhc3MgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciBleHRlbmRzIFJlcXVpcmVkVmFsaWRhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvciA9IChpbnB1dCkgPT4gcmVxdWlyZWRUcnVlVmFsaWRhdG9yO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLCBkZXBzOiBudWxsLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsIHNlbGVjdG9yOiBcImlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW25nTW9kZWxdXCIsIGhvc3Q6IHsgcHJvcGVydGllczogeyBcImF0dHIucmVxdWlyZWRcIjogXCJfZW5hYmxlZCA/IFxcXCJcXFwiIDogbnVsbFwiIH0gfSwgcHJvdmlkZXJzOiBbQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtDSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1JdLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICdbYXR0ci5yZXF1aXJlZF0nOiAnX2VuYWJsZWQgPyBcIlwiIDogbnVsbCcgfVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dIH0pO1xuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYEVtYWlsVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmNvbnN0IEVNQUlMX1ZBTElEQVRPUiA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEVtYWlsVmFsaWRhdG9yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgZW1haWxgIHZhbGlkYXRvciB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBlbWFpbGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIFRoZSBlbWFpbCB2YWxpZGF0aW9uIGlzIGJhc2VkIG9uIHRoZSBXSEFUV0cgSFRNTCBzcGVjaWZpY2F0aW9uIHdpdGggc29tZSBlbmhhbmNlbWVudHMgdG9cbiAqIGluY29ycG9yYXRlIG1vcmUgUkZDIHJ1bGVzLiBNb3JlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBvbiB0aGUgW1ZhbGlkYXRvcnMuZW1haWxcbiAqIHBhZ2VdKGFwaS9mb3Jtcy9WYWxpZGF0b3JzI2VtYWlsKS5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYW4gZW1haWwgdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYW4gZW1haWwgdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuIG5nTW9kZWxcbiAqIGJpbmRpbmcuXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBlbWFpbD5cbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPVwidHJ1ZVwiPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgW2VtYWlsXT1cInRydWVcIj5cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuY2xhc3MgRW1haWxWYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5pbnB1dE5hbWUgPSAnZW1haWwnO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMubm9ybWFsaXplSW5wdXQgPSBib29sZWFuQXR0cmlidXRlO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yID0gKGlucHV0KSA9PiBlbWFpbFZhbGlkYXRvcjtcbiAgICB9XG4gICAgLyoqIEBub2RvYyAqL1xuICAgIGVuYWJsZWQoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBFbWFpbFZhbGlkYXRvciwgZGVwczogbnVsbCwgdGFyZ2V0OiBpMC7Jtcm1RmFjdG9yeVRhcmdldC5EaXJlY3RpdmUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZGlyID0gaTAuybXJtW5nRGVjbGFyZURpcmVjdGl2ZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCB0eXBlOiBFbWFpbFZhbGlkYXRvciwgc2VsZWN0b3I6IFwiW2VtYWlsXVtmb3JtQ29udHJvbE5hbWVdLFtlbWFpbF1bZm9ybUNvbnRyb2xdLFtlbWFpbF1bbmdNb2RlbF1cIiwgaW5wdXRzOiB7IGVtYWlsOiBcImVtYWlsXCIgfSwgcHJvdmlkZXJzOiBbRU1BSUxfVkFMSURBVE9SXSwgdXNlc0luaGVyaXRhbmNlOiB0cnVlLCBuZ0ltcG9ydDogaTAgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRW1haWxWYWxpZGF0b3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ1tlbWFpbF1bZm9ybUNvbnRyb2xOYW1lXSxbZW1haWxdW2Zvcm1Db250cm9sXSxbZW1haWxdW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbRU1BSUxfVkFMSURBVE9SXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBwcm9wRGVjb3JhdG9yczogeyBlbWFpbDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNaW5MZW5ndGhWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuY29uc3QgTUlOX0xFTkdUSF9WQUxJREFUT1IgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNaW5MZW5ndGhWYWxpZGF0b3IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgbWluaW11bSBsZW5ndGggdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBtaW5sZW5ndGhgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBtaW5pbXVtIGxlbmd0aCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1pbmltdW0gbGVuZ3RoIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBuYW1lPVwiZmlyc3ROYW1lXCIgbmdNb2RlbCBtaW5sZW5ndGg9XCI0XCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIE1pbkxlbmd0aFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmlucHV0TmFtZSA9ICdtaW5sZW5ndGgnO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMubm9ybWFsaXplSW5wdXQgPSAoaW5wdXQpID0+IHRvSW50ZWdlcihpbnB1dCk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5jcmVhdGVWYWxpZGF0b3IgPSAobWlubGVuZ3RoKSA9PiBtaW5MZW5ndGhWYWxpZGF0b3IobWlubGVuZ3RoKTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTWluTGVuZ3RoVmFsaWRhdG9yLCBkZXBzOiBudWxsLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IE1pbkxlbmd0aFZhbGlkYXRvciwgc2VsZWN0b3I6IFwiW21pbmxlbmd0aF1bZm9ybUNvbnRyb2xOYW1lXSxbbWlubGVuZ3RoXVtmb3JtQ29udHJvbF0sW21pbmxlbmd0aF1bbmdNb2RlbF1cIiwgaW5wdXRzOiB7IG1pbmxlbmd0aDogXCJtaW5sZW5ndGhcIiB9LCBob3N0OiB7IHByb3BlcnRpZXM6IHsgXCJhdHRyLm1pbmxlbmd0aFwiOiBcIl9lbmFibGVkID8gbWlubGVuZ3RoIDogbnVsbFwiIH0gfSwgcHJvdmlkZXJzOiBbTUlOX0xFTkdUSF9WQUxJREFUT1JdLCB1c2VzSW5oZXJpdGFuY2U6IHRydWUsIG5nSW1wb3J0OiBpMCB9KTsgfVxufVxuaTAuybXJtW5nRGVjbGFyZUNsYXNzTWV0YWRhdGEoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBNaW5MZW5ndGhWYWxpZGF0b3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ1ttaW5sZW5ndGhdW2Zvcm1Db250cm9sTmFtZV0sW21pbmxlbmd0aF1bZm9ybUNvbnRyb2xdLFttaW5sZW5ndGhdW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbTUlOX0xFTkdUSF9WQUxJREFUT1JdLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICdbYXR0ci5taW5sZW5ndGhdJzogJ19lbmFibGVkID8gbWlubGVuZ3RoIDogbnVsbCcgfVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLCBwcm9wRGVjb3JhdG9yczogeyBtaW5sZW5ndGg6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dIH0gfSk7XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWF4TGVuZ3RoVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmNvbnN0IE1BWF9MRU5HVEhfVkFMSURBVE9SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4TGVuZ3RoVmFsaWRhdG9yKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIG1heGltdW0gbGVuZ3RoIHZhbGlkYXRpb24gdG8gY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgbWF4bGVuZ3RoYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWF4aW11bSBsZW5ndGggdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBtYXhpbXVtIGxlbmd0aCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgbmFtZT1cImZpcnN0TmFtZVwiIG5nTW9kZWwgbWF4bGVuZ3RoPVwiMjVcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgTWF4TGVuZ3RoVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuaW5wdXROYW1lID0gJ21heGxlbmd0aCc7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5ub3JtYWxpemVJbnB1dCA9IChpbnB1dCkgPT4gdG9JbnRlZ2VyKGlucHV0KTtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvciA9IChtYXhsZW5ndGgpID0+IG1heExlbmd0aFZhbGlkYXRvcihtYXhsZW5ndGgpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBNYXhMZW5ndGhWYWxpZGF0b3IsIGRlcHM6IG51bGwsIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWRpciA9IGkwLsm1ybVuZ0RlY2xhcmVEaXJlY3RpdmUoeyBtaW5WZXJzaW9uOiBcIjE0LjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgdHlwZTogTWF4TGVuZ3RoVmFsaWRhdG9yLCBzZWxlY3RvcjogXCJbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttYXhsZW5ndGhdW2Zvcm1Db250cm9sXSxbbWF4bGVuZ3RoXVtuZ01vZGVsXVwiLCBpbnB1dHM6IHsgbWF4bGVuZ3RoOiBcIm1heGxlbmd0aFwiIH0sIGhvc3Q6IHsgcHJvcGVydGllczogeyBcImF0dHIubWF4bGVuZ3RoXCI6IFwiX2VuYWJsZWQgPyBtYXhsZW5ndGggOiBudWxsXCIgfSB9LCBwcm92aWRlcnM6IFtNQVhfTEVOR1RIX1ZBTElEQVRPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE1heExlbmd0aFZhbGlkYXRvciwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IERpcmVjdGl2ZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnW21heGxlbmd0aF1bZm9ybUNvbnRyb2xOYW1lXSxbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbF0sW21heGxlbmd0aF1bbmdNb2RlbF0nLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtNQVhfTEVOR1RIX1ZBTElEQVRPUl0sXG4gICAgICAgICAgICAgICAgICAgIGhvc3Q6IHsgJ1thdHRyLm1heGxlbmd0aF0nOiAnX2VuYWJsZWQgPyBtYXhsZW5ndGggOiBudWxsJyB9XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIHByb3BEZWNvcmF0b3JzOiB7IG1heGxlbmd0aDogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBJbnB1dFxuICAgICAgICAgICAgfV0gfSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBQYXR0ZXJuVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmNvbnN0IFBBVFRFUk5fVkFMSURBVE9SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGF0dGVyblZhbGlkYXRvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHJlZ2V4IHBhdHRlcm4gdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBwYXR0ZXJuYCBhdHRyaWJ1dGUuIFRoZSByZWdleCBtdXN0IG1hdGNoIHRoZSBlbnRpcmUgY29udHJvbCB2YWx1ZS5cbiAqIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcGF0dGVybiB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIHBhdHRlcm4gdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IG5hbWU9XCJmaXJzdE5hbWVcIiBuZ01vZGVsIHBhdHRlcm49XCJbYS16QS1aIF0qXCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIFBhdHRlcm5WYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5pbnB1dE5hbWUgPSAncGF0dGVybic7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5ub3JtYWxpemVJbnB1dCA9IChpbnB1dCkgPT4gaW5wdXQ7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5jcmVhdGVWYWxpZGF0b3IgPSAoaW5wdXQpID0+IHBhdHRlcm5WYWxpZGF0b3IoaW5wdXQpO1xuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBQYXR0ZXJuVmFsaWRhdG9yLCBkZXBzOiBudWxsLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVkaXIgPSBpMC7Jtcm1bmdEZWNsYXJlRGlyZWN0aXZlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIHR5cGU6IFBhdHRlcm5WYWxpZGF0b3IsIHNlbGVjdG9yOiBcIltwYXR0ZXJuXVtmb3JtQ29udHJvbE5hbWVdLFtwYXR0ZXJuXVtmb3JtQ29udHJvbF0sW3BhdHRlcm5dW25nTW9kZWxdXCIsIGlucHV0czogeyBwYXR0ZXJuOiBcInBhdHRlcm5cIiB9LCBob3N0OiB7IHByb3BlcnRpZXM6IHsgXCJhdHRyLnBhdHRlcm5cIjogXCJfZW5hYmxlZCA/IHBhdHRlcm4gOiBudWxsXCIgfSB9LCBwcm92aWRlcnM6IFtQQVRURVJOX1ZBTElEQVRPUl0sIHVzZXNJbmhlcml0YW5jZTogdHJ1ZSwgbmdJbXBvcnQ6IGkwIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFBhdHRlcm5WYWxpZGF0b3IsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBEaXJlY3RpdmUsXG4gICAgICAgICAgICBhcmdzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ1twYXR0ZXJuXVtmb3JtQ29udHJvbE5hbWVdLFtwYXR0ZXJuXVtmb3JtQ29udHJvbF0sW3BhdHRlcm5dW25nTW9kZWxdJyxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbUEFUVEVSTl9WQUxJREFUT1JdLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiB7ICdbYXR0ci5wYXR0ZXJuXSc6ICdfZW5hYmxlZCA/IHBhdHRlcm4gOiBudWxsJyB9XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sIHByb3BEZWNvcmF0b3JzOiB7IHBhdHRlcm46IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogSW5wdXRcbiAgICAgICAgICAgIH1dIH0gfSk7XG5cbmNvbnN0IFNIQVJFRF9GT1JNX0RJUkVDVElWRVMgPSBbXG4gICAgybVOZ05vVmFsaWRhdGUsXG4gICAgTmdTZWxlY3RPcHRpb24sXG4gICAgybVOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLFxuICAgIERlZmF1bHRWYWx1ZUFjY2Vzc29yLFxuICAgIE51bWJlclZhbHVlQWNjZXNzb3IsXG4gICAgUmFuZ2VWYWx1ZUFjY2Vzc29yLFxuICAgIENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE5nQ29udHJvbFN0YXR1cyxcbiAgICBOZ0NvbnRyb2xTdGF0dXNHcm91cCxcbiAgICBSZXF1aXJlZFZhbGlkYXRvcixcbiAgICBNaW5MZW5ndGhWYWxpZGF0b3IsXG4gICAgTWF4TGVuZ3RoVmFsaWRhdG9yLFxuICAgIFBhdHRlcm5WYWxpZGF0b3IsXG4gICAgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcixcbiAgICBFbWFpbFZhbGlkYXRvcixcbiAgICBNaW5WYWxpZGF0b3IsXG4gICAgTWF4VmFsaWRhdG9yLFxuXTtcbmNvbnN0IFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTID0gW05nTW9kZWwsIE5nTW9kZWxHcm91cCwgTmdGb3JtXTtcbmNvbnN0IFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTID0gW0Zvcm1Db250cm9sRGlyZWN0aXZlLCBGb3JtR3JvdXBEaXJlY3RpdmUsIEZvcm1Db250cm9sTmFtZSwgRm9ybUdyb3VwTmFtZSwgRm9ybUFycmF5TmFtZV07XG4vKipcbiAqIEludGVybmFsIG1vZHVsZSB1c2VkIGZvciBzaGFyaW5nIGRpcmVjdGl2ZXMgYmV0d2VlbiBGb3Jtc01vZHVsZSBhbmQgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5jbGFzcyDJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUge1xuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IMm1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgZGVwczogW10sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuTmdNb2R1bGUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1bW9kID0gaTAuybXJtW5nRGVjbGFyZU5nTW9kdWxlKHsgbWluVmVyc2lvbjogXCIxNC4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogybVJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBkZWNsYXJhdGlvbnM6IFvJtU5nTm9WYWxpZGF0ZSxcbiAgICAgICAgICAgIE5nU2VsZWN0T3B0aW9uLFxuICAgICAgICAgICAgybVOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLFxuICAgICAgICAgICAgRGVmYXVsdFZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBOdW1iZXJWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgUmFuZ2VWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBOZ0NvbnRyb2xTdGF0dXMsXG4gICAgICAgICAgICBOZ0NvbnRyb2xTdGF0dXNHcm91cCxcbiAgICAgICAgICAgIFJlcXVpcmVkVmFsaWRhdG9yLFxuICAgICAgICAgICAgTWluTGVuZ3RoVmFsaWRhdG9yLFxuICAgICAgICAgICAgTWF4TGVuZ3RoVmFsaWRhdG9yLFxuICAgICAgICAgICAgUGF0dGVyblZhbGlkYXRvcixcbiAgICAgICAgICAgIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsXG4gICAgICAgICAgICBFbWFpbFZhbGlkYXRvcixcbiAgICAgICAgICAgIE1pblZhbGlkYXRvcixcbiAgICAgICAgICAgIE1heFZhbGlkYXRvcl0sIGV4cG9ydHM6IFvJtU5nTm9WYWxpZGF0ZSxcbiAgICAgICAgICAgIE5nU2VsZWN0T3B0aW9uLFxuICAgICAgICAgICAgybVOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLFxuICAgICAgICAgICAgRGVmYXVsdFZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBOdW1iZXJWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgUmFuZ2VWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICBOZ0NvbnRyb2xTdGF0dXMsXG4gICAgICAgICAgICBOZ0NvbnRyb2xTdGF0dXNHcm91cCxcbiAgICAgICAgICAgIFJlcXVpcmVkVmFsaWRhdG9yLFxuICAgICAgICAgICAgTWluTGVuZ3RoVmFsaWRhdG9yLFxuICAgICAgICAgICAgTWF4TGVuZ3RoVmFsaWRhdG9yLFxuICAgICAgICAgICAgUGF0dGVyblZhbGlkYXRvcixcbiAgICAgICAgICAgIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsXG4gICAgICAgICAgICBFbWFpbFZhbGlkYXRvcixcbiAgICAgICAgICAgIE1pblZhbGlkYXRvcixcbiAgICAgICAgICAgIE1heFZhbGlkYXRvcl0gfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1aW5qID0gaTAuybXJtW5nRGVjbGFyZUluamVjdG9yKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogybVJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IMm1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IE5nTW9kdWxlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zOiBTSEFSRURfRk9STV9ESVJFQ1RJVkVTLFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRzOiBTSEFSRURfRk9STV9ESVJFQ1RJVkVTLFxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dIH0pO1xuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGFuIGFycmF5IG9mIGBGb3JtQ29udHJvbGAsXG4gKiBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YCBpbnN0YW5jZXMuXG4gKlxuICogQSBgRm9ybUFycmF5YCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXMgb2YgZWFjaCBjaGlsZCBgRm9ybUNvbnRyb2xgIGludG8gYW4gYXJyYXkuXG4gKiBJdCBjYWxjdWxhdGVzIGl0cyBzdGF0dXMgYnkgcmVkdWNpbmcgdGhlIHN0YXR1cyB2YWx1ZXMgb2YgaXRzIGNoaWxkcmVuLiBGb3IgZXhhbXBsZSwgaWYgb25lIG9mXG4gKiB0aGUgY29udHJvbHMgaW4gYSBgRm9ybUFycmF5YCBpcyBpbnZhbGlkLCB0aGUgZW50aXJlIGFycmF5IGJlY29tZXMgaW52YWxpZC5cbiAqXG4gKiBgRm9ybUFycmF5YCBhY2NlcHRzIG9uZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyB0aGUgdHlwZSBvZiB0aGUgY29udHJvbHMgaW5zaWRlLlxuICogSWYgeW91IG5lZWQgYSBoZXRlcm9nZW5vdXMgYXJyYXksIHVzZSB7QGxpbmsgVW50eXBlZEZvcm1BcnJheX0uXG4gKlxuICogYEZvcm1BcnJheWAgaXMgb25lIG9mIHRoZSBmb3VyIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyB1c2VkIHRvIGRlZmluZSBmb3JtcyBpbiBBbmd1bGFyLFxuICogYWxvbmcgd2l0aCBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgYW5kIGBGb3JtUmVjb3JkYC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDcmVhdGUgYW4gYXJyYXkgb2YgZm9ybSBjb250cm9sc1xuICpcbiAqIGBgYFxuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnTmFuY3knLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnRHJldycpLFxuICogXSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbJ05hbmN5JywgJ0RyZXcnXVxuICogY29uc29sZS5sb2coYXJyLnN0YXR1cyk7ICAvLyAnVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBhcnJheSB3aXRoIGFycmF5LWxldmVsIHZhbGlkYXRvcnNcbiAqXG4gKiBZb3UgaW5jbHVkZSBhcnJheS1sZXZlbCB2YWxpZGF0b3JzIGFuZCBhc3luYyB2YWxpZGF0b3JzLiBUaGVzZSBjb21lIGluIGhhbmR5XG4gKiB3aGVuIHlvdSB3YW50IHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB0aGF0IGNvbnNpZGVycyB0aGUgdmFsdWUgb2YgbW9yZSB0aGFuIG9uZSBjaGlsZFxuICogY29udHJvbC5cbiAqXG4gKiBUaGUgdHdvIHR5cGVzIG9mIHZhbGlkYXRvcnMgYXJlIHBhc3NlZCBpbiBzZXBhcmF0ZWx5IGFzIHRoZSBzZWNvbmQgYW5kIHRoaXJkIGFyZ1xuICogcmVzcGVjdGl2ZWx5LCBvciB0b2dldGhlciBhcyBwYXJ0IG9mIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYFxuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKSxcbiAqICAgbmV3IEZvcm1Db250cm9sKCdEcmV3JylcbiAqIF0sIHt2YWxpZGF0b3JzOiBteVZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3JzOiBteUFzeW5jVmFsaWRhdG9yfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgU2V0IHRoZSB1cGRhdGVPbiBwcm9wZXJ0eSBmb3IgYWxsIGNvbnRyb2xzIGluIGEgZm9ybSBhcnJheVxuICpcbiAqIFRoZSBvcHRpb25zIG9iamVjdCBpcyB1c2VkIHRvIHNldCBhIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggY2hpbGRcbiAqIGNvbnRyb2wncyBgdXBkYXRlT25gIHByb3BlcnR5LiBJZiB5b3Ugc2V0IGB1cGRhdGVPbmAgdG8gYCdibHVyJ2AgYXQgdGhlXG4gKiBhcnJheSBsZXZlbCwgYWxsIGNoaWxkIGNvbnRyb2xzIGRlZmF1bHQgdG8gJ2JsdXInLCB1bmxlc3MgdGhlIGNoaWxkXG4gKiBoYXMgZXhwbGljaXRseSBzcGVjaWZpZWQgYSBkaWZmZXJlbnQgYHVwZGF0ZU9uYCB2YWx1ZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgICBuZXcgRm9ybUNvbnRyb2woKVxuICogXSwge3VwZGF0ZU9uOiAnYmx1cid9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBBZGRpbmcgb3IgcmVtb3ZpbmcgY29udHJvbHMgZnJvbSBhIGZvcm0gYXJyYXlcbiAqXG4gKiBUbyBjaGFuZ2UgdGhlIGNvbnRyb2xzIGluIHRoZSBhcnJheSwgdXNlIHRoZSBgcHVzaGAsIGBpbnNlcnRgLCBgcmVtb3ZlQXRgIG9yIGBjbGVhcmAgbWV0aG9kc1xuICogaW4gYEZvcm1BcnJheWAgaXRzZWxmLiBUaGVzZSBtZXRob2RzIGVuc3VyZSB0aGUgY29udHJvbHMgYXJlIHByb3Blcmx5IHRyYWNrZWQgaW4gdGhlXG4gKiBmb3JtJ3MgaGllcmFyY2h5LiBEbyBub3QgbW9kaWZ5IHRoZSBhcnJheSBvZiBgQWJzdHJhY3RDb250cm9sYHMgdXNlZCB0byBpbnN0YW50aWF0ZVxuICogdGhlIGBGb3JtQXJyYXlgIGRpcmVjdGx5LCBhcyB0aGF0IHJlc3VsdCBpbiBzdHJhbmdlIGFuZCB1bmV4cGVjdGVkIGJlaGF2aW9yIHN1Y2hcbiAqIGFzIGJyb2tlbiBjaGFuZ2UgZGV0ZWN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgRm9ybUFycmF5IGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGBGb3JtQXJyYXlgIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbnRyb2xzIEFuIGFycmF5IG9mIGNoaWxkIGNvbnRyb2xzLiBFYWNoIGNoaWxkIGNvbnRyb2wgaXMgZ2l2ZW4gYW4gaW5kZXhcbiAgICAgKiB3aGVyZSBpdCBpcyByZWdpc3RlcmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zIHZhbGlkYXRpb24gZnVuY3Rpb25zXG4gICAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAgICpcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgICBzdXBlcihwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHMpLCBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICAgICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xuICAgICAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICAgICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICAgICAgdGhpcy5fc2V0VXBDb250cm9scygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe1xuICAgICAgICAgICAgb25seVNlbGY6IHRydWUsXG4gICAgICAgICAgICAvLyBJZiBgYXN5bmNWYWxpZGF0b3JgIGlzIHByZXNlbnQsIGl0IHdpbGwgdHJpZ2dlciBjb250cm9sIHN0YXR1cyBjaGFuZ2UgZnJvbSBgUEVORElOR2AgdG9cbiAgICAgICAgICAgIC8vIGBWQUxJRGAgb3IgYElOVkFMSURgLlxuICAgICAgICAgICAgLy8gVGhlIHN0YXR1cyBzaG91bGQgYmUgYnJvYWRjYXN0ZWQgdmlhIHRoZSBgc3RhdHVzQ2hhbmdlc2Agb2JzZXJ2YWJsZSwgc28gd2Ugc2V0IGBlbWl0RXZlbnRgXG4gICAgICAgICAgICAvLyB0byBgdHJ1ZWAgdG8gYWxsb3cgdGhhdCBkdXJpbmcgdGhlIGNvbnRyb2wgY3JlYXRpb24gcHJvY2Vzcy5cbiAgICAgICAgICAgIGVtaXRFdmVudDogISF0aGlzLmFzeW5jVmFsaWRhdG9yXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGBBYnN0cmFjdENvbnRyb2xgIGF0IHRoZSBnaXZlbiBgaW5kZXhgIGluIHRoZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbmRleCBJbmRleCBpbiB0aGUgYXJyYXkgdG8gcmV0cmlldmUgdGhlIGNvbnRyb2wuIElmIGBpbmRleGAgaXMgbmVnYXRpdmUsIGl0IHdpbGwgd3JhcFxuICAgICAqICAgICBhcm91bmQgZnJvbSB0aGUgYmFjaywgYW5kIGlmIGluZGV4IGlzIGdyZWF0bHkgbmVnYXRpdmUgKGxlc3MgdGhhbiBgLWxlbmd0aGApLCB0aGUgcmVzdWx0IGlzXG4gICAgICogdW5kZWZpbmVkLiBUaGlzIGJlaGF2aW9yIGlzIHRoZSBzYW1lIGFzIGBBcnJheS5hdChpbmRleClgLlxuICAgICAqL1xuICAgIGF0KGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xzW3RoaXMuX2FkanVzdEluZGV4KGluZGV4KV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc2VydCBhIG5ldyBgQWJzdHJhY3RDb250cm9sYCBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUFycmF5IGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhIG5ld1xuICAgICAqICAgICBjb250cm9sIGlzIGFkZGVkLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAgKiBpbnNlcnRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgICAqL1xuICAgIHB1c2goY29udHJvbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMucHVzaChjb250cm9sKTtcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zZXJ0IGEgbmV3IGBBYnN0cmFjdENvbnRyb2xgIGF0IHRoZSBnaXZlbiBgaW5kZXhgIGluIHRoZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbmRleCBJbmRleCBpbiB0aGUgYXJyYXkgdG8gaW5zZXJ0IHRoZSBjb250cm9sLiBJZiBgaW5kZXhgIGlzIG5lZ2F0aXZlLCB3cmFwcyBhcm91bmRcbiAgICAgKiAgICAgZnJvbSB0aGUgYmFjay4gSWYgYGluZGV4YCBpcyBncmVhdGx5IG5lZ2F0aXZlIChsZXNzIHRoYW4gYC1sZW5ndGhgKSwgcHJlcGVuZHMgdG8gdGhlIGFycmF5LlxuICAgICAqIFRoaXMgYmVoYXZpb3IgaXMgdGhlIHNhbWUgYXMgYEFycmF5LnNwbGljZShpbmRleCwgMCwgY29udHJvbClgLlxuICAgICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUFycmF5IGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhIG5ld1xuICAgICAqICAgICBjb250cm9sIGlzIGluc2VydGVkLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAgKiBpbnNlcnRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgICAqL1xuICAgIGluc2VydChpbmRleCwgY29udHJvbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZW1vdmUgdGhlIGNvbnRyb2wuICBJZiBgaW5kZXhgIGlzIG5lZ2F0aXZlLCB3cmFwcyBhcm91bmRcbiAgICAgKiAgICAgZnJvbSB0aGUgYmFjay4gSWYgYGluZGV4YCBpcyBncmVhdGx5IG5lZ2F0aXZlIChsZXNzIHRoYW4gYC1sZW5ndGhgKSwgcmVtb3ZlcyB0aGUgZmlyc3RcbiAgICAgKiAgICAgZWxlbWVudC4gVGhpcyBiZWhhdmlvciBpcyB0aGUgc2FtZSBhcyBgQXJyYXkuc3BsaWNlKGluZGV4LCAxKWAuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFcbiAgICAgKiAgICAgY29udHJvbCBpcyByZW1vdmVkLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAgKiByZW1vdmVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICovXG4gICAgcmVtb3ZlQXQoaW5kZXgsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAvLyBBZGp1c3QgdGhlIGluZGV4LCB0aGVuIGNsYW1wIGl0IGF0IG5vIGxlc3MgdGhhbiAwIHRvIHByZXZlbnQgdW5kZXNpcmVkIHVuZGVyZmxvd3MuXG4gICAgICAgIGxldCBhZGp1c3RlZEluZGV4ID0gdGhpcy5fYWRqdXN0SW5kZXgoaW5kZXgpO1xuICAgICAgICBpZiAoYWRqdXN0ZWRJbmRleCA8IDApXG4gICAgICAgICAgICBhZGp1c3RlZEluZGV4ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHNbYWRqdXN0ZWRJbmRleF0pXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzW2FkanVzdGVkSW5kZXhdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7IH0pO1xuICAgICAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShhZGp1c3RlZEluZGV4LCAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudCB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZXBsYWNlIHRoZSBjb250cm9sLiBJZiBgaW5kZXhgIGlzIG5lZ2F0aXZlLCB3cmFwcyBhcm91bmRcbiAgICAgKiAgICAgZnJvbSB0aGUgYmFjay4gSWYgYGluZGV4YCBpcyBncmVhdGx5IG5lZ2F0aXZlIChsZXNzIHRoYW4gYC1sZW5ndGhgKSwgcmVwbGFjZXMgdGhlIGZpcnN0XG4gICAgICogICAgIGVsZW1lbnQuIFRoaXMgYmVoYXZpb3IgaXMgdGhlIHNhbWUgYXMgYEFycmF5LnNwbGljZShpbmRleCwgMSwgY29udHJvbClgLlxuICAgICAqIEBwYXJhbSBjb250cm9sIFRoZSBgQWJzdHJhY3RDb250cm9sYCBjb250cm9sIHRvIHJlcGxhY2UgdGhlIGV4aXN0aW5nIGNvbnRyb2xcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYW5cbiAgICAgKiAgICAgZXhpc3RpbmcgY29udHJvbCBpcyByZXBsYWNlZCB3aXRoIGEgbmV3IG9uZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzXG4gICAgICogcmVwbGFjZWQgd2l0aCBhIG5ldyBvbmUuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKi9cbiAgICBzZXRDb250cm9sKGluZGV4LCBjb250cm9sLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgLy8gQWRqdXN0IHRoZSBpbmRleCwgdGhlbiBjbGFtcCBpdCBhdCBubyBsZXNzIHRoYW4gMCB0byBwcmV2ZW50IHVuZGVzaXJlZCB1bmRlcmZsb3dzLlxuICAgICAgICBsZXQgYWRqdXN0ZWRJbmRleCA9IHRoaXMuX2FkanVzdEluZGV4KGluZGV4KTtcbiAgICAgICAgaWYgKGFkanVzdGVkSW5kZXggPCAwKVxuICAgICAgICAgICAgYWRqdXN0ZWRJbmRleCA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzW2FkanVzdGVkSW5kZXhdKVxuICAgICAgICAgICAgdGhpcy5jb250cm9sc1thZGp1c3RlZEluZGV4XS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4geyB9KTtcbiAgICAgICAgdGhpcy5jb250cm9scy5zcGxpY2UoYWRqdXN0ZWRJbmRleCwgMSk7XG4gICAgICAgIGlmIChjb250cm9sKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShhZGp1c3RlZEluZGV4LCAwLCBjb250cm9sKTtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGVuZ3RoIG9mIHRoZSBjb250cm9sIGFycmF5LlxuICAgICAqL1xuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmxlbmd0aDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtQXJyYXlgLiBJdCBhY2NlcHRzIGFuIGFycmF5IHRoYXQgbWF0Y2hlc1xuICAgICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBwZXJmb3JtcyBzdHJpY3QgY2hlY2tzLCBhbmQgdGhyb3dzIGFuIGVycm9yIGlmIHlvdSB0cnlcbiAgICAgKiB0byBzZXQgdGhlIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXNuJ3QgZXhpc3Qgb3IgaWYgeW91IGV4Y2x1ZGUgdGhlXG4gICAgICogdmFsdWUgb2YgYSBjb250cm9sLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKiAjIyMgU2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBjb250cm9scyBpbiB0aGUgZm9ybSBhcnJheVxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAgICogICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAgICogXSk7XG4gICAgICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbbnVsbCwgbnVsbF1cbiAgICAgKlxuICAgICAqIGFyci5zZXRWYWx1ZShbJ05hbmN5JywgJ0RyZXcnXSk7XG4gICAgICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbJ05hbmN5JywgJ0RyZXcnXVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIEFycmF5IG9mIHZhbHVlcyBmb3IgdGhlIGNvbnRyb2xzXG4gICAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXNcbiAgICAgKlxuICAgICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICAgKiBpcyBmYWxzZS5cbiAgICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAgICovXG4gICAgc2V0VmFsdWUodmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBhc3NlcnRBbGxWYWx1ZXNQcmVzZW50KHRoaXMsIGZhbHNlLCB2YWx1ZSk7XG4gICAgICAgIHZhbHVlLmZvckVhY2goKG5ld1ZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0Q29udHJvbFByZXNlbnQodGhpcywgZmFsc2UsIGluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuYXQoaW5kZXgpLnNldFZhbHVlKG5ld1ZhbHVlLCB7IG9ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzIHRoZVxuICAgICAqIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbCwgYW5kIGRvZXMgaXRzIGJlc3QgdG8gbWF0Y2ggdGhlIHZhbHVlcyB0byB0aGUgY29ycmVjdFxuICAgICAqIGNvbnRyb2xzIGluIHRoZSBncm91cC5cbiAgICAgKlxuICAgICAqIEl0IGFjY2VwdHMgYm90aCBzdXBlci1zZXRzIGFuZCBzdWItc2V0cyBvZiB0aGUgYXJyYXkgd2l0aG91dCB0aHJvd2luZyBhbiBlcnJvci5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogIyMjIFBhdGNoIHRoZSB2YWx1ZXMgZm9yIGNvbnRyb2xzIGluIGEgZm9ybSBhcnJheVxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICAgKiBdKTtcbiAgICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFtudWxsLCBudWxsXVxuICAgICAqXG4gICAgICogYXJyLnBhdGNoVmFsdWUoWydOYW5jeSddKTtcbiAgICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCBudWxsXVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIEFycmF5IG9mIGxhdGVzdCB2YWx1ZXMgZm9yIHRoZSBjb250cm9sc1xuICAgICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAgICpcbiAgICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0XG4gICAgICogaXMgZmFsc2UuXG4gICAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbFxuICAgICAqIHZhbHVlIGlzIHVwZGF0ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC4gVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvXG4gICAgICogdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAgICovXG4gICAgcGF0Y2hWYWx1ZSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIC8vIEV2ZW4gdGhvdWdoIHRoZSBgdmFsdWVgIGFyZ3VtZW50IHR5cGUgZG9lc24ndCBhbGxvdyBgbnVsbGAgYW5kIGB1bmRlZmluZWRgIHZhbHVlcywgdGhlXG4gICAgICAgIC8vIGBwYXRjaFZhbHVlYCBjYW4gYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5IGFuZCBpbm5lciBkYXRhIHN0cnVjdHVyZXMgbWlnaHQgaGF2ZSB0aGVzZSB2YWx1ZXMsXG4gICAgICAgIC8vIHNvIHdlIGp1c3QgaWdub3JlIHN1Y2ggY2FzZXMgd2hlbiBhIGZpZWxkIGNvbnRhaW5pbmcgRm9ybUFycmF5IGluc3RhbmNlIHJlY2VpdmVzIGBudWxsYCBvclxuICAgICAgICAvLyBgdW5kZWZpbmVkYCBhcyBhIHZhbHVlLlxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCAvKiBib3RoIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgKi8pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhbHVlLmZvckVhY2goKG5ld1ZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXQoaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdChpbmRleCkucGF0Y2hWYWx1ZShuZXdWYWx1ZSwgeyBvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBgRm9ybUFycmF5YCBhbmQgYWxsIGRlc2NlbmRhbnRzIGFyZSBtYXJrZWQgYHByaXN0aW5lYCBhbmQgYHVudG91Y2hlZGAsIGFuZCB0aGVcbiAgICAgKiB2YWx1ZSBvZiBhbGwgZGVzY2VuZGFudHMgdG8gbnVsbCBvciBudWxsIG1hcHMuXG4gICAgICpcbiAgICAgKiBZb3UgcmVzZXQgdG8gYSBzcGVjaWZpYyBmb3JtIHN0YXRlIGJ5IHBhc3NpbmcgaW4gYW4gYXJyYXkgb2Ygc3RhdGVzXG4gICAgICogdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wuIFRoZSBzdGF0ZSBpcyBhIHN0YW5kYWxvbmUgdmFsdWVcbiAgICAgKiBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXR1cy5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogIyMjIFJlc2V0IHRoZSB2YWx1ZXMgaW4gYSBmb3JtIGFycmF5XG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgICAqICAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAgICogXSk7XG4gICAgICogYXJyLnJlc2V0KFsnbmFtZScsICdsYXN0IG5hbWUnXSk7XG4gICAgICpcbiAgICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgLy8gWyduYW1lJywgJ2xhc3QgbmFtZSddXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiAjIyMgUmVzZXQgdGhlIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgYW5kIHRoZSBkaXNhYmxlZCBzdGF0dXMgZm9yIHRoZSBmaXJzdCBjb250cm9sXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBhcnIucmVzZXQoW1xuICAgICAqICAge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgICAgKiAgICdsYXN0J1xuICAgICAqIF0pO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgIC8vIFsnbGFzdCddXG4gICAgICogY29uc29sZS5sb2coYXJyLmF0KDApLnN0YXR1cyk7ICAvLyAnRElTQUJMRUQnXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlc1xuICAgICAqXG4gICAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdFxuICAgICAqIGlzIGZhbHNlLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyByZXNldC5cbiAgICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAgICovXG4gICAgcmVzZXQodmFsdWUgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnRyb2wucmVzZXQodmFsdWVbaW5kZXhdLCB7IG9ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvdWNoZWQob3B0aW9ucyk7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYXJyYXksIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAgICpcbiAgICAgKiBSZXBvcnRzIGFsbCB2YWx1ZXMgcmVnYXJkbGVzcyBvZiBkaXNhYmxlZCBzdGF0dXMuXG4gICAgICovXG4gICAgZ2V0UmF3VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLm1hcCgoY29udHJvbCkgPT4gY29udHJvbC5nZXRSYXdWYWx1ZSgpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBjb250cm9scyBpbiB0aGUgYEZvcm1BcnJheWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYWxsXG4gICAgICogICAgIGNvbnRyb2xzIGFyZSByZW1vdmVkLlxuICAgICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gYWxsIGNvbnRyb2xzXG4gICAgICogaW4gdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2UgYXJlIHJlbW92ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICAgKlxuICAgICAqIEB1c2FnZU5vdGVzXG4gICAgICogIyMjIFJlbW92ZSBhbGwgZWxlbWVudHMgZnJvbSBhIEZvcm1BcnJheVxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKVxuICAgICAqIF0pO1xuICAgICAqIGNvbnNvbGUubG9nKGFyci5sZW5ndGgpOyAgLy8gMlxuICAgICAqXG4gICAgICogYXJyLmNsZWFyKCk7XG4gICAgICogY29uc29sZS5sb2coYXJyLmxlbmd0aCk7ICAvLyAwXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBJdCdzIGEgc2ltcGxlciBhbmQgbW9yZSBlZmZpY2llbnQgYWx0ZXJuYXRpdmUgdG8gcmVtb3ZpbmcgYWxsIGVsZW1lbnRzIG9uZSBieSBvbmU6XG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgICAqICAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAgICogXSk7XG4gICAgICpcbiAgICAgKiB3aGlsZSAoYXJyLmxlbmd0aCkge1xuICAgICAqICAgIGFyci5yZW1vdmVBdCgwKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgY2xlYXIob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmxlbmd0aCA8IDEpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCkgPT4gY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4geyB9KSk7XG4gICAgICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKDApO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50IH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGp1c3RzIGEgbmVnYXRpdmUgaW5kZXggYnkgc3VtbWluZyBpdCB3aXRoIHRoZSBsZW5ndGggb2YgdGhlIGFycmF5LiBGb3IgdmVyeSBuZWdhdGl2ZVxuICAgICAqIGluZGljZXMsIHRoZSByZXN1bHQgbWF5IHJlbWFpbiBuZWdhdGl2ZS5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBfYWRqdXN0SW5kZXgoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4IDwgMCA/IGluZGV4ICsgdGhpcy5sZW5ndGggOiBpbmRleDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCkge1xuICAgICAgICBsZXQgc3VidHJlZVVwZGF0ZWQgPSB0aGlzLmNvbnRyb2xzLnJlZHVjZSgodXBkYXRlZCwgY2hpbGQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgaWYgKHN1YnRyZWVVcGRhdGVkKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgb25seVNlbGY6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9mb3JFYWNoQ2hpbGQoY2IpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy5mb3JFYWNoKChjb250cm9sLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY2IoY29udHJvbCwgaW5kZXgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF91cGRhdGVWYWx1ZSgpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLmZpbHRlcigoY29udHJvbCkgPT4gY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpXG4gICAgICAgICAgICAgICAgLm1hcCgoY29udHJvbCkgPT4gY29udHJvbC52YWx1ZSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfYW55Q29udHJvbHMoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLnNvbWUoKGNvbnRyb2wpID0+IGNvbnRyb2wuZW5hYmxlZCAmJiBjb25kaXRpb24oY29udHJvbCkpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3NldFVwQ29udHJvbHMoKSB7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCkgPT4gdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9hbGxDb250cm9sc0Rpc2FibGVkKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xuICAgICAgICAgICAgaWYgKGNvbnRyb2wuZW5hYmxlZClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbHMubGVuZ3RoID4gMCB8fCB0aGlzLmRpc2FibGVkO1xuICAgIH1cbiAgICBfcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpIHtcbiAgICAgICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0KG5hbWUpID8/IG51bGw7XG4gICAgfVxufVxuY29uc3QgVW50eXBlZEZvcm1BcnJheSA9IEZvcm1BcnJheTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBc3NlcnRzIHRoYXQgdGhlIGdpdmVuIGNvbnRyb2wgaXMgYW4gaW5zdGFuY2Ugb2YgYEZvcm1BcnJheWBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNvbnN0IGlzRm9ybUFycmF5ID0gKGNvbnRyb2wpID0+IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuICEhb3B0aW9ucyAmJlxuICAgICAgICAob3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgb3B0aW9ucy52YWxpZGF0b3JzICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIG9wdGlvbnMudXBkYXRlT24gIT09IHVuZGVmaW5lZCk7XG59XG4vLyBjbGFuZy1mb3JtYXQgb25cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGFuIGBBYnN0cmFjdENvbnRyb2xgIGZyb20gYSB1c2VyLXNwZWNpZmllZCBjb25maWd1cmF0aW9uLlxuICpcbiAqIFRoZSBgRm9ybUJ1aWxkZXJgIHByb3ZpZGVzIHN5bnRhY3RpYyBzdWdhciB0aGF0IHNob3J0ZW5zIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBhXG4gKiBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgb3IgYEZvcm1BcnJheWAuIEl0IHJlZHVjZXMgdGhlIGFtb3VudCBvZiBib2lsZXJwbGF0ZSBuZWVkZWQgdG9cbiAqIGJ1aWxkIGNvbXBsZXggZm9ybXMuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgRm9ybUJ1aWxkZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnVzZU5vbk51bGxhYmxlID0gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgYSBGb3JtQnVpbGRlciBpbiB3aGljaCBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdGVkIGBGb3JtQ29udHJvbGAgZWxlbWVudHNcbiAgICAgKiBoYXZlIGB7bm9uTnVsbGFibGU6IHRydWV9YCBhbmQgYXJlIG5vbi1udWxsYWJsZS5cbiAgICAgKlxuICAgICAqICoqQ29uc3RydWN0aW5nIG5vbi1udWxsYWJsZSBjb250cm9scyoqXG4gICAgICpcbiAgICAgKiBXaGVuIGNvbnN0cnVjdGluZyBhIGNvbnRyb2wsIGl0IHdpbGwgYmUgbm9uLW51bGxhYmxlLCBhbmQgd2lsbCByZXNldCB0byBpdHMgaW5pdGlhbCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICAgKiBsZXQgbmFtZSA9IG5uZmIuY29udHJvbCgnQWxleCcpOyAvLyBGb3JtQ29udHJvbDxzdHJpbmc+XG4gICAgICogbmFtZS5yZXNldCgpO1xuICAgICAqIGNvbnNvbGUubG9nKG5hbWUpOyAvLyAnQWxleCdcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqICoqQ29uc3RydWN0aW5nIG5vbi1udWxsYWJsZSBncm91cHMgb3IgYXJyYXlzKipcbiAgICAgKlxuICAgICAqIFdoZW4gY29uc3RydWN0aW5nIGEgZ3JvdXAgb3IgYXJyYXksIGFsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgaW5uZXIgY29udHJvbHMgd2lsbCBiZVxuICAgICAqIG5vbi1udWxsYWJsZSwgYW5kIHdpbGwgcmVzZXQgdG8gdGhlaXIgaW5pdGlhbCB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIGxldCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCkubm9uTnVsbGFibGU7XG4gICAgICogbGV0IG5hbWUgPSBubmZiLmdyb3VwKHt3aG86ICdBbGV4J30pOyAvLyBGb3JtR3JvdXA8e3dobzogRm9ybUNvbnRyb2w8c3RyaW5nPn0+XG4gICAgICogbmFtZS5yZXNldCgpO1xuICAgICAqIGNvbnNvbGUubG9nKG5hbWUpOyAvLyB7d2hvOiAnQWxleCd9XG4gICAgICogYGBgXG4gICAgICogKipDb25zdHJ1Y3RpbmcgKm51bGxhYmxlKiBmaWVsZHMgb24gZ3JvdXBzIG9yIGFycmF5cyoqXG4gICAgICpcbiAgICAgKiBJdCBpcyBzdGlsbCBwb3NzaWJsZSB0byBoYXZlIGEgbnVsbGFibGUgZmllbGQuIEluIHBhcnRpY3VsYXIsIGFueSBgRm9ybUNvbnRyb2xgIHdoaWNoIGlzXG4gICAgICogKmFscmVhZHkqIGNvbnN0cnVjdGVkIHdpbGwgbm90IGJlIGFsdGVyZWQuIEZvciBleGFtcGxlOlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBsZXQgbm5mYiA9IG5ldyBGb3JtQnVpbGRlcigpLm5vbk51bGxhYmxlO1xuICAgICAqIC8vIEZvcm1Hcm91cDx7d2hvOiBGb3JtQ29udHJvbDxzdHJpbmd8bnVsbD59PlxuICAgICAqIGxldCBuYW1lID0gbm5mYi5ncm91cCh7d2hvOiBuZXcgRm9ybUNvbnRyb2woJ0FsZXgnKX0pO1xuICAgICAqIG5hbWUucmVzZXQoKTsgY29uc29sZS5sb2cobmFtZSk7IC8vIHt3aG86IG51bGx9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBCZWNhdXNlIHRoZSBpbm5lciBjb250cm9sIGlzIGNvbnN0cnVjdGVkIGV4cGxpY2l0bHkgYnkgdGhlIGNhbGxlciwgdGhlIGJ1aWxkZXIgaGFzXG4gICAgICogbm8gY29udHJvbCBvdmVyIGhvdyBpdCBpcyBjcmVhdGVkLCBhbmQgY2Fubm90IGV4Y2x1ZGUgdGhlIGBudWxsYC5cbiAgICAgKi9cbiAgICBnZXQgbm9uTnVsbGFibGUoKSB7XG4gICAgICAgIGNvbnN0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKTtcbiAgICAgICAgbm5mYi51c2VOb25OdWxsYWJsZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBubmZiO1xuICAgIH1cbiAgICBncm91cChjb250cm9scywgb3B0aW9ucyA9IG51bGwpIHtcbiAgICAgICAgY29uc3QgcmVkdWNlZENvbnRyb2xzID0gdGhpcy5fcmVkdWNlQ29udHJvbHMoY29udHJvbHMpO1xuICAgICAgICBsZXQgbmV3T3B0aW9ucyA9IHt9O1xuICAgICAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICAvLyBgb3B0aW9uc2AgYXJlIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYFxuICAgICAgICAgICAgbmV3T3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gYG9wdGlvbnNgIGFyZSBsZWdhY3kgZm9ybSBncm91cCBvcHRpb25zXG4gICAgICAgICAgICBuZXdPcHRpb25zLnZhbGlkYXRvcnMgPSBvcHRpb25zLnZhbGlkYXRvcjtcbiAgICAgICAgICAgIG5ld09wdGlvbnMuYXN5bmNWYWxpZGF0b3JzID0gb3B0aW9ucy5hc3luY1ZhbGlkYXRvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEZvcm1Hcm91cChyZWR1Y2VkQ29udHJvbHMsIG5ld09wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtUmVjb3JkYCBpbnN0YW5jZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIGFsbCB0aGUga2V5cyBhbmQgY29ycmVzcG9uZGluZyBpbm5lciBjb250cm9sIHR5cGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbnRyb2xzIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1SZWNvcmRgLiBUaGUgb2JqZWN0IHNob3VsZCBoYXZlIHRoZVxuICAgICAqIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCB0eXBlIGFuZCBtaWdodCBjb250YWluIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgICAqICogYHZhbGlkYXRvcnNgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICAgKiAqIGBhc3luY1ZhbGlkYXRvcnNgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICAgKiAqIGB1cGRhdGVPbmA6IFRoZSBldmVudCB1cG9uIHdoaWNoIHRoZSBjb250cm9sIHNob3VsZCBiZSB1cGRhdGVkIChvcHRpb25zOiAnY2hhbmdlJyB8ICdibHVyJ1xuICAgICAqIHwgc3VibWl0JykuXG4gICAgICovXG4gICAgcmVjb3JkKGNvbnRyb2xzLCBvcHRpb25zID0gbnVsbCkge1xuICAgICAgICBjb25zdCByZWR1Y2VkQ29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9scyk7XG4gICAgICAgIC8vIENhc3QgdG8gYGFueWAgYmVjYXVzZSB0aGUgaW5mZXJyZWQgdHlwZXMgYXJlIG5vdCBhcyBzcGVjaWZpYyBhcyBFbGVtZW50LlxuICAgICAgICByZXR1cm4gbmV3IEZvcm1SZWNvcmQocmVkdWNlZENvbnRyb2xzLCBvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBgRm9ybUNvbnRyb2xgIHdpdGggdGhlIGdpdmVuIHN0YXRlLCB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLiBTZXRzXG4gICAgICogYHtub25OdWxsYWJsZTogdHJ1ZX1gIGluIHRoZSBvcHRpb25zIHRvIGdldCBhIG5vbi1udWxsYWJsZSBjb250cm9sLiBPdGhlcndpc2UsIHRoZVxuICAgICAqIGNvbnRyb2wgd2lsbCBiZSBudWxsYWJsZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyB0aGUgdHlwZSAgb2YgdGhlXG4gICAgICogY29udHJvbCdzIHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgc3RhdGUgdmFsdWUsIG9yXG4gICAgICogd2l0aCBhbiBvYmplY3QgdGhhdCBjb250YWlucyBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdHVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYSBgRm9ybUNvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWluc1xuICAgICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yXG4gICAgICogZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHVzYWdlTm90ZXNcbiAgICAgKlxuICAgICAqICMjIyBJbml0aWFsaXplIGEgY29udHJvbCBhcyBkaXNhYmxlZFxuICAgICAqXG4gICAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJldHVybnMgYSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSBpbiBhIGRpc2FibGVkIHN0YXRlLlxuICAgICAqXG4gICAgICogPGNvZGUtZXhhbXBsZSBwYXRoPVwiZm9ybXMvdHMvZm9ybUJ1aWxkZXIvZm9ybV9idWlsZGVyX2V4YW1wbGUudHNcIiByZWdpb249XCJkaXNhYmxlZC1jb250cm9sXCI+XG4gICAgICogPC9jb2RlLWV4YW1wbGU+XG4gICAgICovXG4gICAgY29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpIHtcbiAgICAgICAgbGV0IG5ld09wdGlvbnMgPSB7fTtcbiAgICAgICAgaWYgKCF0aGlzLnVzZU5vbk51bGxhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZvcm1Db250cm9sKGZvcm1TdGF0ZSwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyh2YWxpZGF0b3JPck9wdHMpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgc2Vjb25kIGFyZ3VtZW50IGlzIG9wdGlvbnMsIHRoZW4gdGhleSBhcmUgY29waWVkLlxuICAgICAgICAgICAgbmV3T3B0aW9ucyA9IHZhbGlkYXRvck9yT3B0cztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBvdGhlciBhcmd1bWVudHMgYXJlIHZhbGlkYXRvcnMsIHRoZXkgYXJlIGNvcGllZCBpbnRvIGFuIG9wdGlvbnMgb2JqZWN0LlxuICAgICAgICAgICAgbmV3T3B0aW9ucy52YWxpZGF0b3JzID0gdmFsaWRhdG9yT3JPcHRzO1xuICAgICAgICAgICAgbmV3T3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEZvcm1Db250cm9sKGZvcm1TdGF0ZSwgeyAuLi5uZXdPcHRpb25zLCBub25OdWxsYWJsZTogdHJ1ZSB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBgRm9ybUFycmF5YCBmcm9tIHRoZSBnaXZlbiBhcnJheSBvZiBjb25maWd1cmF0aW9ucyxcbiAgICAgKiB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIHRoZSB0eXBlIG9mIGVhY2ggY29udHJvbFxuICAgICAqIGluc2lkZSB0aGUgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29udHJvbHMgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMgb3IgY29udHJvbCBjb25maWdzLiBFYWNoIGNoaWxkIGNvbnRyb2wgaXMgZ2l2ZW4gYW5cbiAgICAgKiAgICAgaW5kZXggd2hlbiBpdCBpcyByZWdpc3RlcmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2Ygc3VjaCBmdW5jdGlvbnMsIG9yIGFuXG4gICAgICogICAgIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWluc1xuICAgICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICAgKi9cbiAgICBhcnJheShjb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgICBjb25zdCBjcmVhdGVkQ29udHJvbHMgPSBjb250cm9scy5tYXAoYyA9PiB0aGlzLl9jcmVhdGVDb250cm9sKGMpKTtcbiAgICAgICAgLy8gQ2FzdCB0byBgYW55YCBiZWNhdXNlIHRoZSBpbmZlcnJlZCB0eXBlcyBhcmUgbm90IGFzIHNwZWNpZmljIGFzIEVsZW1lbnQuXG4gICAgICAgIHJldHVybiBuZXcgRm9ybUFycmF5KGNyZWF0ZWRDb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVkdWNlQ29udHJvbHMoY29udHJvbHMpIHtcbiAgICAgICAgY29uc3QgY3JlYXRlZENvbnRyb2xzID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKGNvbnRyb2xzKS5mb3JFYWNoKGNvbnRyb2xOYW1lID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZWRDb250cm9sc1tjb250cm9sTmFtZV0gPSB0aGlzLl9jcmVhdGVDb250cm9sKGNvbnRyb2xzW2NvbnRyb2xOYW1lXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY3JlYXRlZENvbnRyb2xzO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2NyZWF0ZUNvbnRyb2woY29udHJvbHMpIHtcbiAgICAgICAgaWYgKGNvbnRyb2xzIGluc3RhbmNlb2YgRm9ybUNvbnRyb2wpIHtcbiAgICAgICAgICAgIHJldHVybiBjb250cm9scztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb250cm9scyBpbnN0YW5jZW9mIEFic3RyYWN0Q29udHJvbCkgeyAvLyBBIGNvbnRyb2w7IGp1c3QgcmV0dXJuIGl0XG4gICAgICAgICAgICByZXR1cm4gY29udHJvbHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjb250cm9scykpIHsgLy8gQ29udHJvbENvbmZpZyBUdXBsZVxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb250cm9sc1swXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRvciA9IGNvbnRyb2xzLmxlbmd0aCA+IDEgPyBjb250cm9sc1sxXSA6IG51bGw7XG4gICAgICAgICAgICBjb25zdCBhc3luY1ZhbGlkYXRvciA9IGNvbnRyb2xzLmxlbmd0aCA+IDIgPyBjb250cm9sc1syXSA6IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sKHZhbHVlLCB2YWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8gVCBvciBGb3JtQ29udHJvbFN0YXRlPFQ+XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sKGNvbnRyb2xzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1ZmFjID0gaTAuybXJtW5nRGVjbGFyZUZhY3RvcnkoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtQnVpbGRlciwgZGVwczogW10sIHRhcmdldDogaTAuybXJtUZhY3RvcnlUYXJnZXQuSW5qZWN0YWJsZSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVwcm92ID0gaTAuybXJtW5nRGVjbGFyZUluamVjdGFibGUoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3JtQnVpbGRlciwgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1CdWlsZGVyLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogSW5qZWN0YWJsZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7IHByb3ZpZGVkSW46ICdyb290JyB9XVxuICAgICAgICB9XSB9KTtcbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgTm9uTnVsbGFibGVGb3JtQnVpbGRlcmAgaXMgc2ltaWxhciB0byB7QGxpbmsgRm9ybUJ1aWxkZXJ9LCBidXQgYXV0b21hdGljYWxseSBjb25zdHJ1Y3RlZFxuICoge0BsaW5rIEZvcm1Db250cm9sfSBlbGVtZW50cyBoYXZlIGB7bm9uTnVsbGFibGU6IHRydWV9YCBhbmQgYXJlIG5vbi1udWxsYWJsZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmNsYXNzIE5vbk51bGxhYmxlRm9ybUJ1aWxkZXIge1xuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5vbk51bGxhYmxlRm9ybUJ1aWxkZXIsIGRlcHM6IFtdLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkluamVjdGFibGUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1cHJvdiA9IGkwLsm1ybVuZ0RlY2xhcmVJbmplY3RhYmxlKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogTm9uTnVsbGFibGVGb3JtQnVpbGRlciwgcHJvdmlkZWRJbjogJ3Jvb3QnLCB1c2VGYWN0b3J5OiAoKSA9PiBpbmplY3QoRm9ybUJ1aWxkZXIpLm5vbk51bGxhYmxlIH0pOyB9XG59XG5pMC7Jtcm1bmdEZWNsYXJlQ2xhc3NNZXRhZGF0YSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IE5vbk51bGxhYmxlRm9ybUJ1aWxkZXIsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBJbmplY3RhYmxlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgICAgICAgICAgICAgICAgICB1c2VGYWN0b3J5OiAoKSA9PiBpbmplY3QoRm9ybUJ1aWxkZXIpLm5vbk51bGxhYmxlLFxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dIH0pO1xuLyoqXG4gKiBVbnR5cGVkRm9ybUJ1aWxkZXIgaXMgdGhlIHNhbWUgYXMgYEZvcm1CdWlsZGVyYCwgYnV0IGl0IHByb3ZpZGVzIHVudHlwZWQgY29udHJvbHMuXG4gKi9cbmNsYXNzIFVudHlwZWRGb3JtQnVpbGRlciBleHRlbmRzIEZvcm1CdWlsZGVyIHtcbiAgICBncm91cChjb250cm9sc0NvbmZpZywgb3B0aW9ucyA9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmdyb3VwKGNvbnRyb2xzQ29uZmlnLCBvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGlrZSBgRm9ybUJ1aWxkZXIjY29udHJvbGAsIGV4Y2VwdCB0aGUgcmVzdWx0aW5nIGNvbnRyb2wgaXMgdW50eXBlZC5cbiAgICAgKi9cbiAgICBjb250cm9sKGZvcm1TdGF0ZSwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMaWtlIGBGb3JtQnVpbGRlciNhcnJheWAsIGV4Y2VwdCB0aGUgcmVzdWx0aW5nIGFycmF5IGlzIHVudHlwZWQuXG4gICAgICovXG4gICAgYXJyYXkoY29udHJvbHNDb25maWcsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFycmF5KGNvbnRyb2xzQ29uZmlnLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogVW50eXBlZEZvcm1CdWlsZGVyLCBkZXBzOiBudWxsLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0LkluamVjdGFibGUgfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1cHJvdiA9IGkwLsm1ybVuZ0RlY2xhcmVJbmplY3RhYmxlKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogVW50eXBlZEZvcm1CdWlsZGVyLCBwcm92aWRlZEluOiAncm9vdCcgfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogVW50eXBlZEZvcm1CdWlsZGVyLCBkZWNvcmF0b3JzOiBbe1xuICAgICAgICAgICAgdHlwZTogSW5qZWN0YWJsZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7IHByb3ZpZGVkSW46ICdyb290JyB9XVxuICAgICAgICB9XSB9KTtcblxuLyoqXG4gKiBAbW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqIEVudHJ5IHBvaW50IGZvciBhbGwgcHVibGljIEFQSXMgb2YgdGhlIGZvcm1zIHBhY2thZ2UuXG4gKi9cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5jb25zdCBWRVJTSU9OID0gbmV3IFZlcnNpb24oJzE3LjMuMTInKTtcblxuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBwcm92aWRlcnMgYW5kIGRpcmVjdGl2ZXMgZm9yIHRlbXBsYXRlLWRyaXZlbiBmb3JtcyxcbiAqIG1ha2luZyB0aGVtIGF2YWlsYWJsZSBmb3IgaW1wb3J0IGJ5IE5nTW9kdWxlcyB0aGF0IGltcG9ydCB0aGlzIG1vZHVsZS5cbiAqXG4gKiBAc2VlIFtGb3JtcyBPdmVydmlld10oL2d1aWRlL2Zvcm1zLW92ZXJ2aWV3KVxuICogQHNlZSBbVGVtcGxhdGUtZHJpdmVuIEZvcm1zIEd1aWRlXSgvZ3VpZGUvZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5jbGFzcyBGb3Jtc01vZHVsZSB7XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUHJvdmlkZXMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIGZvcm1zIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIEFuIG9iamVjdCBvZiBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICAgKiAqIGBjYWxsU2V0RGlzYWJsZWRTdGF0ZWAgQ29uZmlndXJlcyB3aGV0aGVyIHRvIGBhbHdheXNgIGNhbGwgYHNldERpc2FibGVkU3RhdGVgLCB3aGljaCBpcyBtb3JlXG4gICAgICogY29ycmVjdCwgb3IgdG8gb25seSBjYWxsIGl0IGB3aGVuRGlzYWJsZWRgLCB3aGljaCBpcyB0aGUgbGVnYWN5IGJlaGF2aW9yLlxuICAgICAqL1xuICAgIHN0YXRpYyB3aXRoQ29uZmlnKG9wdHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5nTW9kdWxlOiBGb3Jtc01vZHVsZSxcbiAgICAgICAgICAgIHByb3ZpZGVyczogW3tcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogQ0FMTF9TRVRfRElTQUJMRURfU1RBVEUsXG4gICAgICAgICAgICAgICAgICAgIHVzZVZhbHVlOiBvcHRzLmNhbGxTZXREaXNhYmxlZFN0YXRlID8/IHNldERpc2FibGVkU3RhdGVEZWZhdWx0XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIHsgdGhpcy7JtWZhYyA9IGkwLsm1ybVuZ0RlY2xhcmVGYWN0b3J5KHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRm9ybXNNb2R1bGUsIGRlcHM6IFtdLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0Lk5nTW9kdWxlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtW1vZCA9IGkwLsm1ybVuZ0RlY2xhcmVOZ01vZHVsZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IEZvcm1zTW9kdWxlLCBkZWNsYXJhdGlvbnM6IFtOZ01vZGVsLCBOZ01vZGVsR3JvdXAsIE5nRm9ybV0sIGV4cG9ydHM6IFvJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIE5nTW9kZWwsIE5nTW9kZWxHcm91cCwgTmdGb3JtXSB9KTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVpbmogPSBpMC7Jtcm1bmdEZWNsYXJlSW5qZWN0b3IoeyBtaW5WZXJzaW9uOiBcIjEyLjAuMFwiLCB2ZXJzaW9uOiBcIjE3LjMuMTJcIiwgbmdJbXBvcnQ6IGkwLCB0eXBlOiBGb3Jtc01vZHVsZSwgaW1wb3J0czogW8m1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZV0gfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogRm9ybXNNb2R1bGUsIGRlY29yYXRvcnM6IFt7XG4gICAgICAgICAgICB0eXBlOiBOZ01vZHVsZSxcbiAgICAgICAgICAgIGFyZ3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uczogVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVMsXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHM6IFvJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTXVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1dIH0pO1xuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBpbmZyYXN0cnVjdHVyZSBhbmQgZGlyZWN0aXZlcyBmb3IgcmVhY3RpdmUgZm9ybXMsXG4gKiBtYWtpbmcgdGhlbSBhdmFpbGFibGUgZm9yIGltcG9ydCBieSBOZ01vZHVsZXMgdGhhdCBpbXBvcnQgdGhpcyBtb2R1bGUuXG4gKlxuICogQHNlZSBbRm9ybXMgT3ZlcnZpZXddKGd1aWRlL2Zvcm1zLW92ZXJ2aWV3KVxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuY2xhc3MgUmVhY3RpdmVGb3Jtc01vZHVsZSB7XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUHJvdmlkZXMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHJlYWN0aXZlIGZvcm1zIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIEFuIG9iamVjdCBvZiBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICAgKiAqIGB3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sYCBDb25maWd1cmVzIHdoZW4gdG8gZW1pdCBhIHdhcm5pbmcgd2hlbiBhbiBgbmdNb2RlbGBcbiAgICAgKiBiaW5kaW5nIGlzIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXMuXG4gICAgICogKiBgY2FsbFNldERpc2FibGVkU3RhdGVgIENvbmZpZ3VyZXMgd2hldGhlciB0byBgYWx3YXlzYCBjYWxsIGBzZXREaXNhYmxlZFN0YXRlYCwgd2hpY2ggaXMgbW9yZVxuICAgICAqIGNvcnJlY3QsIG9yIHRvIG9ubHkgY2FsbCBpdCBgd2hlbkRpc2FibGVkYCwgd2hpY2ggaXMgdGhlIGxlZ2FjeSBiZWhhdmlvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgd2l0aENvbmZpZyhvcHRzKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuZ01vZHVsZTogUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORyxcbiAgICAgICAgICAgICAgICAgICAgdXNlVmFsdWU6IG9wdHMud2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbCA/PyAnYWx3YXlzJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSxcbiAgICAgICAgICAgICAgICAgICAgdXNlVmFsdWU6IG9wdHMuY2FsbFNldERpc2FibGVkU3RhdGUgPz8gc2V0RGlzYWJsZWRTdGF0ZURlZmF1bHRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyB7IHRoaXMuybVmYWMgPSBpMC7Jtcm1bmdEZWNsYXJlRmFjdG9yeSh7IG1pblZlcnNpb246IFwiMTIuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFJlYWN0aXZlRm9ybXNNb2R1bGUsIGRlcHM6IFtdLCB0YXJnZXQ6IGkwLsm1ybVGYWN0b3J5VGFyZ2V0Lk5nTW9kdWxlIH0pOyB9XG4gICAgc3RhdGljIHsgdGhpcy7JtW1vZCA9IGkwLsm1ybVuZ0RlY2xhcmVOZ01vZHVsZSh7IG1pblZlcnNpb246IFwiMTQuMC4wXCIsIHZlcnNpb246IFwiMTcuMy4xMlwiLCBuZ0ltcG9ydDogaTAsIHR5cGU6IFJlYWN0aXZlRm9ybXNNb2R1bGUsIGRlY2xhcmF0aW9uczogW0Zvcm1Db250cm9sRGlyZWN0aXZlLCBGb3JtR3JvdXBEaXJlY3RpdmUsIEZvcm1Db250cm9sTmFtZSwgRm9ybUdyb3VwTmFtZSwgRm9ybUFycmF5TmFtZV0sIGV4cG9ydHM6IFvJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIEZvcm1Db250cm9sRGlyZWN0aXZlLCBGb3JtR3JvdXBEaXJlY3RpdmUsIEZvcm1Db250cm9sTmFtZSwgRm9ybUdyb3VwTmFtZSwgRm9ybUFycmF5TmFtZV0gfSk7IH1cbiAgICBzdGF0aWMgeyB0aGlzLsm1aW5qID0gaTAuybXJtW5nRGVjbGFyZUluamVjdG9yKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUmVhY3RpdmVGb3Jtc01vZHVsZSwgaW1wb3J0czogW8m1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZV0gfSk7IH1cbn1cbmkwLsm1ybVuZ0RlY2xhcmVDbGFzc01ldGFkYXRhKHsgbWluVmVyc2lvbjogXCIxMi4wLjBcIiwgdmVyc2lvbjogXCIxNy4zLjEyXCIsIG5nSW1wb3J0OiBpMCwgdHlwZTogUmVhY3RpdmVGb3Jtc01vZHVsZSwgZGVjb3JhdG9yczogW3tcbiAgICAgICAgICAgIHR5cGU6IE5nTW9kdWxlLFxuICAgICAgICAgICAgYXJnczogW3tcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zOiBbUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVNdLFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRzOiBbybVJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFU11cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XSB9KTtcblxuLyoqXG4gKiBAbW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoaXMgbW9kdWxlIGlzIHVzZWQgZm9yIGhhbmRsaW5nIHVzZXIgaW5wdXQsIGJ5IGRlZmluaW5nIGFuZCBidWlsZGluZyBhIGBGb3JtR3JvdXBgIHRoYXRcbiAqIGNvbnNpc3RzIG9mIGBGb3JtQ29udHJvbGAgb2JqZWN0cywgYW5kIG1hcHBpbmcgdGhlbSBvbnRvIHRoZSBET00uIGBGb3JtQ29udHJvbGBcbiAqIG9iamVjdHMgY2FuIHRoZW4gYmUgdXNlZCB0byByZWFkIGluZm9ybWF0aW9uIGZyb20gdGhlIGZvcm0gRE9NIGVsZW1lbnRzLlxuICpcbiAqIEZvcm1zIHByb3ZpZGVycyBhcmUgbm90IGluY2x1ZGVkIGluIGRlZmF1bHQgcHJvdmlkZXJzOyB5b3UgbXVzdCBpbXBvcnQgdGhlc2UgcHJvdmlkZXJzXG4gKiBleHBsaWNpdGx5LlxuICovXG5cbi8qKlxuICogQG1vZHVsZVxuICogQGRlc2NyaXB0aW9uXG4gKiBFbnRyeSBwb2ludCBmb3IgYWxsIHB1YmxpYyBBUElzIG9mIHRoaXMgcGFja2FnZS5cbiAqL1xuLy8gVGhpcyBmaWxlIG9ubHkgcmVleHBvcnRzIGNvbnRlbnQgb2YgdGhlIGBzcmNgIGZvbGRlci4gS2VlcCBpdCB0aGF0IHdheS5cblxuLy8gVGhpcyBmaWxlIGlzIG5vdCB1c2VkIHRvIGJ1aWxkIHRoaXMgbW9kdWxlLiBJdCBpcyBvbmx5IHVzZWQgZHVyaW5nIGVkaXRpbmdcblxuLyoqXG4gKiBHZW5lcmF0ZWQgYnVuZGxlIGluZGV4LiBEbyBub3QgZWRpdC5cbiAqL1xuXG5leHBvcnQgeyBBYnN0cmFjdENvbnRyb2wsIEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSwgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUsIENPTVBPU0lUSU9OX0JVRkZFUl9NT0RFLCBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLCBDb250cm9sQ29udGFpbmVyLCBEZWZhdWx0VmFsdWVBY2Nlc3NvciwgRW1haWxWYWxpZGF0b3IsIEZvcm1BcnJheSwgRm9ybUFycmF5TmFtZSwgRm9ybUJ1aWxkZXIsIEZvcm1Db250cm9sLCBGb3JtQ29udHJvbERpcmVjdGl2ZSwgRm9ybUNvbnRyb2xOYW1lLCBGb3JtR3JvdXAsIEZvcm1Hcm91cERpcmVjdGl2ZSwgRm9ybUdyb3VwTmFtZSwgRm9ybVJlY29yZCwgRm9ybXNNb2R1bGUsIE1heExlbmd0aFZhbGlkYXRvciwgTWF4VmFsaWRhdG9yLCBNaW5MZW5ndGhWYWxpZGF0b3IsIE1pblZhbGlkYXRvciwgTkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SUywgTkdfVkFMVUVfQUNDRVNTT1IsIE5nQ29udHJvbCwgTmdDb250cm9sU3RhdHVzLCBOZ0NvbnRyb2xTdGF0dXNHcm91cCwgTmdGb3JtLCBOZ01vZGVsLCBOZ01vZGVsR3JvdXAsIE5nU2VsZWN0T3B0aW9uLCBOb25OdWxsYWJsZUZvcm1CdWlsZGVyLCBOdW1iZXJWYWx1ZUFjY2Vzc29yLCBQYXR0ZXJuVmFsaWRhdG9yLCBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBSYW5nZVZhbHVlQWNjZXNzb3IsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIFJlcXVpcmVkVmFsaWRhdG9yLCBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvciwgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvciwgVW50eXBlZEZvcm1BcnJheSwgVW50eXBlZEZvcm1CdWlsZGVyLCBVbnR5cGVkRm9ybUNvbnRyb2wsIFVudHlwZWRGb3JtR3JvdXAsIFZFUlNJT04sIFZhbGlkYXRvcnMsIGlzRm9ybUFycmF5LCBpc0Zvcm1Db250cm9sLCBpc0Zvcm1Hcm91cCwgaXNGb3JtUmVjb3JkLCDJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIMm1TmdOb1ZhbGlkYXRlLCDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvcm1zLm1qcy5tYXBcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsInZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiA/IChvYmopID0+IChPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSkgOiAob2JqKSA9PiAob2JqLl9fcHJvdG9fXyk7XG52YXIgbGVhZlByb3RvdHlwZXM7XG4vLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3Rcbi8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuLy8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4vLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3Rcbi8vIG1vZGUgJiAxNjogcmV0dXJuIHZhbHVlIHdoZW4gaXQncyBQcm9taXNlLWxpa2Vcbi8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbl9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG5cdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IHRoaXModmFsdWUpO1xuXHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuXHRpZih0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XG5cdFx0aWYoKG1vZGUgJiA0KSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYoKG1vZGUgJiAxNikgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbicpIHJldHVybiB2YWx1ZTtcblx0fVxuXHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuXHR2YXIgZGVmID0ge307XG5cdGxlYWZQcm90b3R5cGVzID0gbGVhZlByb3RvdHlwZXMgfHwgW251bGwsIGdldFByb3RvKHt9KSwgZ2V0UHJvdG8oW10pLCBnZXRQcm90byhnZXRQcm90byldO1xuXHRmb3IodmFyIGN1cnJlbnQgPSBtb2RlICYgMiAmJiB2YWx1ZTsgdHlwZW9mIGN1cnJlbnQgPT0gJ29iamVjdCcgJiYgIX5sZWFmUHJvdG90eXBlcy5pbmRleE9mKGN1cnJlbnQpOyBjdXJyZW50ID0gZ2V0UHJvdG8oY3VycmVudCkpIHtcblx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjdXJyZW50KS5mb3JFYWNoKChrZXkpID0+IChkZWZba2V5XSA9ICgpID0+ICh2YWx1ZVtrZXldKSkpO1xuXHR9XG5cdGRlZlsnZGVmYXVsdCddID0gKCkgPT4gKHZhbHVlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBkZWYpO1xuXHRyZXR1cm4gbnM7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKlxuICogQ29weXJpZ2h0IDIwMTUtMjAyNC4gUml0ZW5zZSBCViwgdGhlIE5ldGhlcmxhbmRzLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIEVVUEwsIFZlcnNpb24gMS4yICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cHM6Ly9qb2ludXAuZWMuZXVyb3BhLmV1L2NvbGxlY3Rpb24vZXVwbC9ldXBsLXRleHQtZXVwbC0xMlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbiAqXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuLypcbiAqIFB1YmxpYyBBUEkgU3VyZmFjZSBvZiBzbGFja1xuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL21vZGVscyc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9zdXdpbmV0LXBsdWdpbi1tb2R1bGUnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvc3V3aW5ldC1wbHVnaW4uc3BlY2lmaWNhdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9jb21wb25lbnRzL3BsdWdpbi1jb25maWd1cmF0aW9uL3N1d2luZXQtcGx1Z2luLWNvbmZpZ3VyYXRpb24uY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2NvbXBvbmVudHMvYnJwLWtpbmRlcmVuLWluZm8vYnJwLWtpbmRlcmVuLWluZm8uY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2NvbXBvbmVudHMvYnJwLXBhcnRuZXItaW5mby9icnAtcGFydG5lci1pbmZvLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9jb21wb25lbnRzL2JycC1wZXJzb29uLWluZm8vYnJwLXBlcnNvb24taW5mby5jb21wb25lbnQnO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9