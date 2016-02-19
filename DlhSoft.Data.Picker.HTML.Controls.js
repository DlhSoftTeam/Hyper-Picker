/* Assembly: DlhSoft.ProjectData.Picker.HTML.Controls,
   Company: DlhSoft,
   Product: Hyper Picker,
   Version: 5.0.0.0,
   Copyright: Copyright © 2016 DlhSoft,
   Title: Data Picker HTML Controls,
   Description: Generic picker HTML client components */
var DlhSoft;
(function (DlhSoft) {
    var Controls;
    (function (Controls) {
        var Picker;
        (function (Picker) {
            function initialize(element, value, popupContent, settings) {
                return new Element(element, value, popupContent, settings);
            }
            Picker.initialize = initialize;
            function get(element) {
                return element["component"];
            }
            Picker.get = get;
            var Element = (function () {
                function Element(host, value, popupContent, settings) {
                    this.host = host;
                    this.value = value;
                    this.popupContent = popupContent;
                    this.settings = settings;
                    this.isInitialized = false;
                    this.dropDownButtonElement = null;
                    this.host["component"] = this;
                    if (typeof settings === "undefined")
                        settings = {};
                    this.settings = settings;
                    Element.initializeSettings(this.settings);
                    var document = this.host.ownerDocument;
                    this.inputHost = host instanceof HTMLInputElement ? host : null;
                    if (this.inputHost) {
                        if (value == null) {
                            try {
                                value = this.inputHost.value;
                            }
                            catch (exc) { }
                        }
                        var internalHost = document.createElement("span");
                        if (this.inputHost.parentElement)
                            this.inputHost.parentElement.insertBefore(internalHost, this.inputHost);
                        this.host = internalHost;
                        this.host["component"] = this;
                    }
                    if (typeof value === "undefined")
                        value = null;
                    this.value = value;
                    this.refresh();
                    this.isInitialized = true;
                }
                Element.initializeSettings = function (settings) {
                    if (typeof settings.popupStyle === "undefined")
                        settings.popupStyle = "background-color: White; border: 1px solid " + (settings.theme == "Modern" ? "#e0e0e0" : "#707070") + "; font-family: Arial";
                    if (typeof settings.openDropDownOnInputClick === "undefined")
                        settings.openDropDownOnInputClick = true;
                    if (typeof settings.isDropDownButtonVisible === "undefined")
                        settings.isDropDownButtonVisible = false;
                    if (typeof settings.inputStyle === "undefined" && settings.theme == "Modern")
                        settings.inputStyle = "border: 1px solid #e0e0e0; background-color: White; color: #505050; font-family: Arial; font-size: 12px; padding: 4px";
                };
                Element.prototype.refresh = function () {
                    var _this = this;
                    var document = this.host.ownerDocument;
                    for (var n = this.host.childNodes.length; n-- > 0;)
                        this.host.removeChild(this.host.childNodes[n]);
                    var popupDefinitionElement = document.createElement("div");
                    popupDefinitionElement.setAttribute("style", "margin-top: -1px");
                    if (!this.inputHost) {
                        var popupSpan = document.createElement("span");
                        popupSpan.setAttribute("style", "display: inline-block");
                        var popupInput = document.createElement("input");
                        popupSpan.appendChild(popupInput);
                        popupSpan.appendChild(popupDefinitionElement);
                        this.host.appendChild(popupSpan);
                        var popupHost = this.host.firstChild;
                        this.inputElement = popupHost.firstChild;
                        this.popupElement = popupHost.childNodes[1];
                    }
                    else {
                        var popupSpan = document.createElement("span");
                        popupSpan.setAttribute("style", "display: inline-block");
                        popupSpan.appendChild(popupDefinitionElement);
                        this.host.appendChild(popupSpan);
                        var popupHost = this.host.firstChild;
                        this.popupElement = popupHost.firstChild;
                        if (this.inputHost.parentElement)
                            this.inputHost.parentElement.removeChild(this.inputHost);
                        if (this.popupElement && this.popupElement.parentElement)
                            this.popupElement.parentElement.insertBefore(this.inputHost, this.popupElement);
                        this.inputElement = this.inputHost;
                    }
                    if (this.popupElement) {
                        var popup = document.createElement("div");
                        popup.setAttribute("style", this.settings.popupStyle);
                        if (this.settings.popupClass)
                            popup.setAttribute("class", this.settings.popupClass);
                        this.popupElement.appendChild(popup);
                    }
                    if (this.inputElement) {
                        if (typeof this.settings.inputStyle !== "undefined")
                            this.inputElement.setAttribute("style", this.settings.inputStyle + (this.inputElement.getAttribute("style") ? ";" + this.inputElement.getAttribute("style") : ""));
                        if (this.settings.inputClass)
                            this.inputElement.setAttribute("class", this.settings.inputClass);
                    }
                    if (this.settings.isDropDownButtonVisible && this.settings.dropDownButtonDefinition) {
                        this.dropDownButtonElement = document.createElement("span");
                        this.dropDownButtonElement.setAttribute("style", "display: inline-block");
                        this.dropDownButtonElement.innerHTML = this.settings.dropDownButtonDefinition;
                        if (this.popupElement && this.popupElement.parentElement)
                            this.popupElement.parentElement.insertBefore(this.dropDownButtonElement, this.popupElement);
                    }
                    if (this.inputElement) {
                        this.inputElement["Picker"] = this;
                        this.setValue(this.value);
                        if (this.settings.isReadOnly)
                            this.inputElement.setAttribute("readonly", "readonly");
                    }
                    if (this.popupElement) {
                        var popupHost = this.popupElement.firstChild;
                        popupHost.appendChild(this.popupContent);
                    }
                    if (this.inputElement) {
                        this.inputElement.addEventListener("change", function (e) { _this.refreshValue(); }, true);
                        if (this.dropDownButtonElement)
                            this.dropDownButtonElement.onmousedown = function (e) { _this.recordClick(); _this.refreshValue(); setTimeout(function () { _this.toggleDropDown(); }, 0); };
                        if (this.popupElement) {
                            this.popupElement.style.position = "absolute";
                            this.popupElement.style.display = "none";
                            this.inputElement.addEventListener("focus", function (e) { if (!_this.settings.openDropDownOnInputClick)
                                return; _this.openDropDown(); _this["focusValue"] = _this.inputElement.value; }, true);
                            this.inputElement.addEventListener("blur", function (e) { if (!_this.settings.openDropDownOnInputClick)
                                return; if (typeof _this["focusValue"] !== "undefined")
                                delete _this["focusValue"]; }, true);
                            this.inputElement.addEventListener("keydown", function (e) {
                                if (e.keyCode == 13) {
                                    if (!_this.settings.openDropDownOnInputClick)
                                        return;
                                    _this.refreshValue();
                                }
                                else {
                                    _this.closeDropDown();
                                }
                            }, true);
                            this.inputElement.addEventListener("mousedown", function (e) { setTimeout(function () { if (!_this.settings.openDropDownOnInputClick || (typeof _this["focusValue"] !== "undefined" && _this.inputElement.value != _this["focusValue"]))
                                return; _this.refreshValue(); _this.openDropDown(); }, 0); _this.recordClick(); }, true);
                            this.inputElement.addEventListener("input", function (e) { _this.closeDropDown(); }, true);
                            this.popupElement.onmousedown = function (e) { _this.recordClick(); };
                            document.addEventListener("mousedown", function (e) { setTimeout(function () { if (_this.isDuringRecordedClick())
                                return; _this.closeDropDown(); }, 0); }, true);
                            document.addEventListener("mousewheel", function (e) { _this.closeDropDown(); }, true);
                            document.addEventListener("DOMMouseScroll", function (e) { _this.closeDropDown(); }, true);
                        }
                    }
                };
                Element.prototype.recordClick = function () {
                    var _this = this;
                    if (this["isDuringClick"])
                        return;
                    this["isDuringClick"] = true;
                    setTimeout(function () { delete _this["isDuringClick"]; }, 0);
                };
                Element.prototype.isDuringRecordedClick = function () {
                    return (typeof this["isDuringClick"] !== "undefined");
                };
                Element.prototype.getValue = function () {
                    return this.value;
                };
                Element.prototype.setValue = function (value) {
                    this.resetValue(value);
                };
                Element.prototype.refreshValue = function () {
                    this.resetValue();
                };
                Element.prototype.resetValue = function (value) {
                    if (this["isDuringInternalSetValue"])
                        return;
                    this["isDuringInternalSetValue"] = true;
                    this.closeDropDown();
                    var originalValue = this.value;
                    try {
                        this.value = value != null ? value : this.inputElement.value;
                    }
                    catch (exc) { }
                    var inputValue;
                    try {
                        inputValue = this.value;
                    }
                    catch (exc) {
                        inputValue = "";
                    }
                    if (inputValue != this.inputElement.value) {
                        this.inputElement.value = inputValue;
                        if (this.isInitialized) {
                            try {
                                var changeEvent = this.inputElement.ownerDocument.createEvent("HTMLEvents");
                                changeEvent.initEvent("change", true, true);
                                this.inputElement.dispatchEvent(changeEvent);
                            }
                            catch (exc) { }
                        }
                    }
                    if ((this.value && !originalValue) || (!this.value && originalValue) || (this.value && originalValue && this.value.valueOf() != originalValue.valueOf())) {
                        if (this.settings.valueChangeHandler)
                            this.settings.valueChangeHandler(this.value);
                    }
                    delete this["isDuringInternalSetValue"];
                };
                Element.prototype.openDropDown = function () {
                    if (!this.isOpen)
                        this.toggleDropDown();
                };
                Element.prototype.closeDropDown = function () {
                    if (this.isOpen)
                        this.toggleDropDown();
                };
                Element.prototype.toggleDropDown = function () {
                    var _this = this;
                    this.isOpen = !this.isOpen;
                    var updatePopupPosition = function () {
                        var inputRect = _this.inputElement.getBoundingClientRect();
                        _this.popupElement.style.position = "fixed";
                        _this.popupElement.style.zIndex = "1";
                        _this.popupElement.style.left = inputRect.left + "px";
                        _this.popupElement.style.top = (inputRect.top + inputRect.height) + "px";
                        _this.popupElement.style.display = _this.isOpen ? "block" : "none";
                        var popupClientRect = _this.popupElement.getBoundingClientRect();
                        if (popupClientRect.bottom > _this.popupElement.ownerDocument.documentElement.clientHeight && inputRect.top >= popupClientRect.height)
                            _this.popupElement.style.top = (inputRect.top - popupClientRect.height + 2) + "px";
                        if (popupClientRect.right > _this.popupElement.ownerDocument.documentElement.clientWidth && _this.popupElement.ownerDocument.documentElement.clientWidth >= popupClientRect.width)
                            _this.popupElement.style.left = (_this.popupElement.ownerDocument.documentElement.clientWidth - popupClientRect.width) + "px";
                    };
                    updatePopupPosition();
                    if (this.isOpen && this.settings.dropDownOpenedHandler)
                        this.settings.dropDownOpenedHandler();
                    else if (!this.isOpen && this.settings.dropDownClosedHandler)
                        this.settings.dropDownClosedHandler();
                    if (this.isOpen) {
                        var previousWidth = this.host.ownerDocument.documentElement.clientWidth, previousHeight = this.host.ownerDocument.documentElement.clientHeight, previousClientRect = this.host.getBoundingClientRect();
                        this["positionChangeHandlerTimer"] = setInterval(function () {
                            var width = _this.host.ownerDocument.documentElement.clientWidth, height = _this.host.ownerDocument.documentElement.clientHeight, clientRect = _this.host.getBoundingClientRect();
                            if (width != previousWidth || height != previousHeight)
                                _this.closeDropDown();
                            else if (clientRect.left != previousClientRect.left || clientRect.top != previousClientRect.top || clientRect.width != previousClientRect.width || clientRect.height != previousClientRect.height)
                                updatePopupPosition();
                            previousWidth = width;
                            previousHeight = height;
                            previousClientRect = clientRect;
                        }, 100);
                    }
                    else {
                        if (this["positionChangeHandlerTimer"]) {
                            clearInterval(this["positionChangeHandlerTimer"]);
                            delete this["positionChangeHandlerTimer"];
                        }
                    }
                };
                return Element;
            })();
            Picker.Element = Element;
        })(Picker = Controls.Picker || (Controls.Picker = {}));
    })(Controls = DlhSoft.Controls || (DlhSoft.Controls = {}));
})(DlhSoft || (DlhSoft = {}));
