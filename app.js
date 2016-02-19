/// <reference path='./DlhSoft.Data.Picker.HTML.Controls.ts'/>
var Picker = DlhSoft.Controls.Picker;
window.onload = function () {
    var pickerValue = "Test";
    var pickerSettings = {
        // Optionally, initialize a specific theme (supported values: Modern, Standard).
        // theme: "Standard",
        isDropDownButtonVisible: true
    };
    var pickerInput = document.querySelector("#picker");
    var picker = Picker.initialize(pickerInput, pickerValue, document.querySelector("#pickerPopup"), pickerSettings);
    // Define update value action that also closes the popup.
    var updateValueButton = document.querySelector("#updateValueButton");
    updateValueButton.addEventListener("click", function () {
        pickerInput.value = "Updated at " + new Date().toLocaleTimeString();
        picker.closeDropDown();
    });
};
