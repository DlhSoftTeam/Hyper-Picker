/// <reference path='./DlhSoft.Data.Picker.HTML.Controls.ts'/>
import Picker = DlhSoft.Controls.Picker;

window.onload = () => {
    var pickerValue = "Test";
    var pickerSettings = <Picker.Settings>{
        // Optionally, initialize a specific theme (supported values: Modern, Standard).
        // theme: "Standard",
        isDropDownButtonVisible: true
    };
    var pickerInput = <HTMLInputElement>document.querySelector("#picker");
    var picker = Picker.initialize(pickerInput, pickerValue, <HTMLElement>document.querySelector("#pickerPopup"), pickerSettings);

    // Define update value action that also closes the popup.
    var updateValueButton = document.querySelector("#updateValueButton");
    updateValueButton.addEventListener("click", () => {
        pickerInput.value = "Updated at " + new Date().toLocaleTimeString();
        picker.closeDropDown();
    });
};
