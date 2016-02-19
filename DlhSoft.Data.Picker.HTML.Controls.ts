/* Assembly: DlhSoft.ProjectData.Picker.HTML.Controls,
   Company: DlhSoft,
   Product: Hyper Picker,
   Version: 5.0.0.0,
   Copyright: Copyright © 2016 DlhSoft,
   Title: Data Picker HTML Controls,
   Description: Generic picker HTML client components */

module DlhSoft.Controls {
    export module Picker {
        export function initialize(element: HTMLElement, value?: any, popupContent?: HTMLElement, settings?: Settings): Element {
            return new Element(element, value, popupContent, settings);
        }
        export function get(element: HTMLElement): Element {
            return <Element>element["component"];
        }

        export class Element implements IControlElement, IEditor, IDropDown {
            constructor(public host: HTMLElement, public value?: any, public popupContent?: HTMLElement, public settings?: Settings) {
                this.host["component"] = this;

                if (typeof settings === "undefined")
                    settings = { };
                this.settings = settings;
                Element.initializeSettings(this.settings);

                var document = this.host.ownerDocument;
                this.inputHost = host instanceof HTMLInputElement ? <HTMLInputElement>host : null;
                if (this.inputHost) {
                    if (value == null) {
                        try { value = this.inputHost.value; }
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

            public isInitialized: boolean = false;

            static initializeSettings(settings: Settings): void {
                if (typeof settings.popupStyle === "undefined")
                    settings.popupStyle = "background-color: White; border: 1px solid " + (settings.theme == "Modern" ? "#e0e0e0" : "#707070") + "; font-family: Arial";
                if (typeof settings.openDropDownOnInputClick === "undefined")
                    settings.openDropDownOnInputClick = true;
                if (typeof settings.isDropDownButtonVisible === "undefined")
                    settings.isDropDownButtonVisible = false;
                if (typeof settings.inputStyle === "undefined" && settings.theme == "Modern")
                    settings.inputStyle = "border: 1px solid #e0e0e0; background-color: White; color: #505050; font-family: Arial; font-size: 12px; padding: 4px";
            }

            public refresh(): void {
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
                    var popupHost = <HTMLElement>this.host.firstChild;
                    this.inputElement = <HTMLInputElement>popupHost.firstChild;
                    this.popupElement = <HTMLElement>popupHost.childNodes[1];
                }
                else {
                    var popupSpan = document.createElement("span");
                    popupSpan.setAttribute("style", "display: inline-block");
                    popupSpan.appendChild(popupDefinitionElement);
                    this.host.appendChild(popupSpan);
                    var popupHost = <HTMLElement>this.host.firstChild;
                    this.popupElement = <HTMLElement>popupHost.firstChild;
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
                    var popupHost = <HTMLElement>this.popupElement.firstChild;
                    popupHost.appendChild(this.popupContent);
                }

                if (this.inputElement) {
                    this.inputElement.addEventListener("change", (e) => { this.refreshValue(); }, true);
                    if (this.dropDownButtonElement)
                        this.dropDownButtonElement.onmousedown = (e) => { this.recordClick(); this.refreshValue(); setTimeout(() => { this.toggleDropDown(); }, 0); };
                    if (this.popupElement) {
                        this.popupElement.style.position = "absolute";
                        this.popupElement.style.display = "none";
                        this.inputElement.addEventListener("focus", (e) => { if (!this.settings.openDropDownOnInputClick) return; this.openDropDown(); this["focusValue"] = this.inputElement.value; }, true);
                        this.inputElement.addEventListener("blur", (e) => { if (!this.settings.openDropDownOnInputClick) return; if (typeof this["focusValue"] !== "undefined") delete this["focusValue"]; }, true);
                        this.inputElement.addEventListener("keydown", (e) => {
                            if (e.keyCode == 13) { if (!this.settings.openDropDownOnInputClick) return; this.refreshValue(); } else { this.closeDropDown(); }
                        }, true);
                        this.inputElement.addEventListener("mousedown", (e) => { setTimeout(() => { if (!this.settings.openDropDownOnInputClick || (typeof this["focusValue"] !== "undefined" && this.inputElement.value != this["focusValue"])) return; this.refreshValue(); this.openDropDown(); }, 0); this.recordClick(); }, true);
                        this.inputElement.addEventListener("input", (e) => { this.closeDropDown(); }, true);
                        this.popupElement.onmousedown = (e) => { this.recordClick(); };
                        document.addEventListener("mousedown", (e) => { setTimeout(() => { if (this.isDuringRecordedClick()) return; this.closeDropDown(); }, 0); }, true);
                        document.addEventListener("mousewheel", (e) => { this.closeDropDown(); }, true);
                        document.addEventListener("DOMMouseScroll", (e) => { this.closeDropDown(); }, true);
                    }
                }
            }
            private recordClick(): void {
                if (this["isDuringClick"])
                    return;
                this["isDuringClick"] = true;
                setTimeout(() => { delete this["isDuringClick"]; }, 0);
            }
            private isDuringRecordedClick(): boolean {
                return (typeof this["isDuringClick"] !== "undefined");
            }

            public getValue(): any {
                return this.value;
            }
            public setValue(value: any): void {
                this.resetValue(value);
            }
            public refreshValue(): void {
                this.resetValue();
            }
            private resetValue(value?: any): void {
                if (this["isDuringInternalSetValue"])
                    return;
                this["isDuringInternalSetValue"] = true;
                this.closeDropDown();
                var originalValue = this.value;
                try { this.value = value != null ? value : this.inputElement.value; }
                catch (exc) { }
                var inputValue;
                try { inputValue = this.value; }
                catch (exc) { inputValue = ""; }
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
            }
            
            public openDropDown(): void {
                if (!this.isOpen)
                    this.toggleDropDown();
            }
            public closeDropDown(): void {
                if (this.isOpen)
                    this.toggleDropDown();
            }
            private toggleDropDown(): void {
                this.isOpen = !this.isOpen;

                var updatePopupPosition = () => {
                    var inputRect = this.inputElement.getBoundingClientRect();
                    this.popupElement.style.position = "fixed";
                    this.popupElement.style.zIndex = "1";
                    this.popupElement.style.left = inputRect.left + "px";
                    this.popupElement.style.top = (inputRect.top + inputRect.height) + "px";
                    this.popupElement.style.display = this.isOpen ? "block" : "none";
                    var popupClientRect = this.popupElement.getBoundingClientRect();
                    if (popupClientRect.bottom > this.popupElement.ownerDocument.documentElement.clientHeight && inputRect.top >= popupClientRect.height)
                        this.popupElement.style.top = (inputRect.top - popupClientRect.height + 2) + "px";
                    if (popupClientRect.right > this.popupElement.ownerDocument.documentElement.clientWidth && this.popupElement.ownerDocument.documentElement.clientWidth >= popupClientRect.width)
                        this.popupElement.style.left = (this.popupElement.ownerDocument.documentElement.clientWidth - popupClientRect.width) + "px";
                };
                updatePopupPosition();
                if (this.isOpen && this.settings.dropDownOpenedHandler)
                    this.settings.dropDownOpenedHandler();
                else if (!this.isOpen && this.settings.dropDownClosedHandler)
                    this.settings.dropDownClosedHandler();
                if (this.isOpen) {
                    var previousWidth = this.host.ownerDocument.documentElement.clientWidth, previousHeight = this.host.ownerDocument.documentElement.clientHeight, previousClientRect = this.host.getBoundingClientRect();
                    this["positionChangeHandlerTimer"] = setInterval(() => {
                        var width = this.host.ownerDocument.documentElement.clientWidth, height = this.host.ownerDocument.documentElement.clientHeight, clientRect = this.host.getBoundingClientRect();
                        if (width != previousWidth || height != previousHeight)
                            this.closeDropDown();
                        else if (clientRect.left != previousClientRect.left || clientRect.top != previousClientRect.top || clientRect.width != previousClientRect.width || clientRect.height != previousClientRect.height)
                            updatePopupPosition();
                        previousWidth = width;
                        previousHeight = height;
                        previousClientRect = clientRect;
                    }, 100);
                }
                else {
                    if (this["positionChangeHandlerTimer"]) {
                        clearInterval(this["positionChangeHandlerTimer"])
                        delete this["positionChangeHandlerTimer"];
                    }
                }
            }

            private inputHost: HTMLInputElement;
            public inputElement: HTMLInputElement;
            public dropDownButtonElement: HTMLElement = null;
            private popupElement: HTMLElement;

            public isOpen: boolean;
        }
        export interface Settings {
            theme?: string;

            isReadOnly?: boolean;

            openDropDownOnInputClick?: boolean;
            isDropDownButtonVisible?: boolean;
            dropDownButtonDefinition?: string;

            inputStyle?: string;
            inputClass?: string;
            popupStyle?: string;
            popupClass?: string;

            valueChangeHandler? (value: any): void;
            dropDownOpenedHandler? (): void;
            dropDownClosedHandler? (): void;
        }
    }

    export interface IElement {
        isInitialized: boolean;
    }
    export interface IControlElement extends IElement {
        refresh(): void;
    }
    export interface IEditor {
        getValue(): any;
        setValue(value: any): void;
    }
    export interface IDropDown {
        isOpen: boolean;
        openDropDown(): void;
        closeDropDown(): void;
    }
}
