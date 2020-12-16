let API_URL = "http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1";
let API_KEY = "0398373c-6c5d-4813-b3c0-05d172a6c175";

// let HTML_infoIcon = '<a value="" href="" data-toggle="modal" data-target="#infoModal"><div class="mr-2"><img class="r-btn-img" src="content/options_icons/info.png" alt=""></div></a>';
let HTML_infoIcon = '<a value="" href="" data-toggle="modal"><div class="mr-2"><img class="r-btn-img" src="content/options_icons/info.png" alt=""></div></a>';
// let HTML_editIcon = '<a value="" href="" data-toggle="modal" data-target="#editModal"><div class="mr-2"><img class="r-btn-img" src="content/options_icons/edit.png" alt=""></div></a>';
let HTML_editIcon = '<a value="" href="" data-toggle="modal"><div class="mr-2"><img class="r-btn-img" src="content/options_icons/edit.png" alt=""></div></a>';
// let HTML_deleteIcon = '<a value="" href="" data-toggle="modal" data-target="#deleteModal"><div><img class="r-btn-img" src="content/options_icons/delete.png" alt=""></div></a>';
let HTML_deleteIcon = '<a value="" href="" data-toggle="modal"><div><img class="r-btn-img" src="content/options_icons/delete.png" alt=""></div></a>';

let currentRestaurant;
let allData;
let formatedData;

let totalDistricts;
let totalAreas;
let totalTypes;
let totalIsNetwork;
let totalSocPrivileges;
let totalCapacity = { min: -1, max: -1 }; // Для границ
let totalCreateData = { earlier: -1, latest: -1 }; // Для даты создания

let newElementId = 1342;

let dateRange = { min: 0, max: 0 };

// Расширяющая функция проверки наличия элемента в массиве
Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

Date.prototype.dateToInput = function () {
    return this.getFullYear() + '-' + ('0' + (this.getMonth() + 1)).substr(-2, 2) + '-' + ('0' + this.getDate()).substr(-2, 2);
}
Date.prototype.timeToInput = function () {
    return ('0' + (this.getHours())).substr(-2, 2) + ':' + ('0' + this.getMinutes()).substr(-2, 2);
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function transformBool(value) {
    switch (value) {
        case 0: return 'Нет'; break;
        case 1: return 'Да'; break;
        case 'Да': return 1; break;
        case 'Нет': return 0; break;
        default: return '';
    }
}

function formatBoolValues(data) {
    let formatedValues = [];
    if (data.contains(0)) {
        formatedValues.push("Нет")
    }
    if (data.contains(1)) {
        formatedValues.push("Да")
    }
    return formatedValues;
}

// Устанавливает значения select элементу с elementId(заполняет возможные варианты выбора в форме для конкретного поля)
function setSelectValues(dataOptions, elementId) {
    let selectElement = document.getElementById(elementId);
    // selectElement.innerHTML = "";
    for (let i = 0; i < dataOptions.length; i++) {
        let optionElement = document.createElement('option');
        optionElement.innerHTML = dataOptions[i];
        selectElement.append(optionElement);
    }
}

function updateDateRange(newDate, border) {
    console.log("newDate: " + newDate);
    switch (border) {
        case "max":
            dateRange.max = newDate;
            // dateRange.max_text = newDate.dateToInput();
            break;
        case "min":
            dateRange.min = newDate;
        // dateRange.min_text = newDate.dateToInput();
    }
}

function setBorderValues(bordersObj, key) {
    switch (key) {
        case "seatsCount":
            document.getElementById('border_minCapacity').value = bordersObj.min;
            document.getElementById('border_maxCapacity').value = bordersObj.max;
            break;
        case "created_at":
            document.getElementById('border_minDate').value = bordersObj.min.dateToInput();
            updateDateRange(bordersObj.min, "min");
            document.getElementById('border_maxDate').value = bordersObj.max.dateToInput();
            updateDateRange(bordersObj.max, "max");
    }
}

function setOrganizationFormValues(totalDistricts, totalAreas, totalTypes, totalIsNetwork, totalSocPrivileges, totalCapacity, totalCreateData) {
    setSelectValues(totalDistricts, "select-district");
    setSelectValues(totalAreas, "select-admArea");
    setSelectValues(totalTypes, "select-typeObject");
    setSelectValues(formatBoolValues(totalIsNetwork), "select-isNetObject");
    setSelectValues(formatBoolValues(totalSocPrivileges), "select-socialPrivileges");
    setBorderValues(totalCapacity, "seatsCount");
    setBorderValues(totalCreateData, "created_at");
}

function getDistinctFields(restaurants, field) {
    let t_totalFields = [];
    for (let i = 0; i < restaurants.length; i++) {
        if (!t_totalFields.contains(restaurants[i][field])) {
            t_totalFields.push(restaurants[i][field]);
        }
    }
    return t_totalFields;
}

function getMinAndMaxSeatsCount(restaurants) {
    let res = {};
    let biggest = -1;
    let lowest = 100000;
    restaurants.forEach(function (restaurant, index, array) {
        if (restaurant.seatsCount > biggest) biggest = restaurant.seatsCount;
        if (restaurant.seatsCount < lowest) lowest = restaurant.seatsCount;
    });
    res.min = lowest;
    res.max = biggest;
    return res;
}

function getMinAndMaxCreateDates(restaurants) {
    let res = {};
    let biggest = new Date(2000, 0, 0);
    let lowest = new Date(3000, 0, 0);
    restaurants.forEach(function (restaurant, index, array) {
        let restaurantDate = new Date(restaurant.created_at);
        if (restaurantDate > biggest) biggest = restaurantDate;
        if (restaurantDate < lowest) lowest = restaurantDate;
    });
    res.min = lowest;
    updateDateRange(Date(lowest), "min");
    res.max = biggest;
    updateDateRange(Date(biggest), "max");
    return res;
}

function getTotalDistinctFields(data) {
    totalDistricts = getDistinctFields(data, "district");
    totalAreas = getDistinctFields(data, "admArea");
    totalTypes = getDistinctFields(data, "typeObject");
    totalIsNetwork = getDistinctFields(data, "isNetObject");
    totalSocPrivileges = getDistinctFields(data, "socialPrivileges");
    totalCapacity = getMinAndMaxSeatsCount(data);
    totalCreateData = getMinAndMaxCreateDates(data);
    setOrganizationFormValues(totalDistricts, totalAreas, totalTypes, totalIsNetwork, totalSocPrivileges, totalCapacity, totalCreateData);
}

function loadAllData() {
    let apiUrl = new URL(API_URL);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        allData = this.response;
        getTotalDistinctFields(this.response);
        return this.response;
    }
}

function orgInDate(orgDate, minDate, maxDate) {
    orgDate = new Date(orgDate).dateToInput();
    console.log(orgDate, minDate, maxDate);
    if (orgDate >= minDate & orgDate <= maxDate) return true; else return false;
}

function orgInCapacity(orgCapacity, minCapacity, maxCapacity) {
    // console.log(orgCapacity, minCapacity, maxCapacity);
    if (orgCapacity >= minCapacity & orgCapacity <= maxCapacity) return true; else return false;
}

function formatData(name, district, area, isNet, type, socPriv, minCapacity, maxCapacity, minDate, maxDate) {
    // console.log("Form params: district: " + district + "; area: " + area + "; type: " + type + "; socPriv: " + socPriv + ";");

    let formatedData = [];
    // console.log(allData);
    for (let i = 0; i < allData.length; i++) {
        let curOrg = allData[i];
        if ((curOrg.name == name || name == "") &
            (curOrg.district == district || district == "") &
            (curOrg.admArea == area || area == "") &
            (curOrg.isNetObject == isNet || isNet == "") &
            (curOrg.typeObject == type || type == "") &
            (curOrg.socialPrivileges == socPriv || socPriv == "") &
            (orgInDate(Date(curOrg.created_at), minDate, maxDate)) &
            (orgInCapacity(curOrg.seatsCount, minCapacity, maxCapacity))) {
            formatedData.push(curOrg);
        }
    }
    console.log("Formated data: " + formatedData.length);
    return formatedData;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateId() {
    return newElementId++;
}

function createOrganization(event) {
    let newOrgMas = [];
    let newOrg = {};
    let id = generateId();
    let name = document.getElementById('modalEdit-input-name').value;
    let isNetObject;
    if (document.getElementById('modalEdit-input-isNetwork').checked == true) {
        isNetObject = 1;
    } else isNetObject = 0;
    let operatingCompany = document.getElementById('modalEdit-input-operatingCompany').value; 
    
    let typeObjectSelector = document.getElementById('modalEdit-select-typeObject');
    let typeObject = typeObjectSelector[typeObjectSelector.selectedIndex].value;
    
    let admAreaSelector = document.getElementById('modalEdit-select-admArea');
    let admArea = admAreaSelector[admAreaSelector.selectedIndex].value;

    let address = document.getElementById('modalEdit-input-address').value;
    let seatsCount = document.getElementById('modalEdit-input-seatsCount').value;

    let socialPrivileges;
    if (document.getElementById('modalEdit-checkbox-havingSocPriv').checked == true) {
        socialPrivileges = 1;
    } else socialPrivileges = 0;

    let coorX = document.getElementById('modalEdit-input-coordinateX').value;
    let coorY = document.getElementById('modalEdit-input-coordinateY').value;



    newOrg.id = id;
    newOrg.name = name;
    newOrg.isNetObject = isNetObject;
    newOrg.operatingCompany = operatingCompany;
    newOrg.typeObject =typeObject;
    newOrg.admArea = admArea;
    newOrg.address = address;
    newOrg.seatsCount = Number(seatsCount);
    newOrg.socialPrivileges =socialPrivileges;

    console.log("New org:",newOrg);

    let url = new URL(API_URL);
    let xhr = new XMLHttpRequest();
    
    xhr.responseType = 'json';

    var body = "name=" + newOrg.name;
    // "&address="+newOrg.address;
    console.log("body:",body);
    xhr.open("POST", url+"?api_key="+API_KEY+"&name="+newOrg.name);
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onreadystatechange = function() {
            console.log(xhr.response);
    }



}

function removeOrganization(event) {

}

function modifyOrganization(event) {

}

function fillData(modal) {
    console.log("fillData: currentRest: ", currentRestaurant);
    switch (modal) {
        case 'new':
            document.getElementById('modalEdit-text-title').innerHTML = "Создание новой записи";
            document.getElementById('modalEdit-input-name').value = "";
            document.getElementById('modalEdit-input-notNetwork').checked = false;
            document.getElementById('modalEdit-input-isNetwork').checked = false;
            document.getElementById('modalEdit-input-operatingCompany').value = "";
            setSelectValues(totalTypes, "modalEdit-select-typeObject");
            setSelectValues(totalDistricts, "modalEdit-select-district");
            setSelectValues(totalAreas, "modalEdit-select-admArea");
            document.getElementById('modalEdit-input-address').value = "";
            document.getElementById('modalEdit-input-seatsCount').value = "";
            document.getElementById('modalEdit-checkbox-havingSocPriv').checked = false;
            document.getElementById('modalEdit-checkbox-noSocPriv').checked = false;
            document.getElementById('modalEdit-input-publicPhone').value = "";

            document.getElementById('editModal-btn-process').onclick = createOrganization;
            break;
        case 'info':
            document.getElementById('modalInfo-text-name-h').innerHTML = currentRestaurant.name;
            document.getElementById('modalInfo-text-name').innerHTML = currentRestaurant.name;
            document.getElementById('modalInfo-text-isNetObject').innerHTML = transformBool(currentRestaurant.isNetObject);
            document.getElementById('modalInfo-text-typeObject').innerHTML = currentRestaurant.typeObject;
            document.getElementById('modalInfo-text-district').innerHTML = currentRestaurant.district;
            document.getElementById('modalInfo-text-admArea').innerHTML = currentRestaurant.admArea;
            document.getElementById('modalInfo-text-address').innerHTML = currentRestaurant.address;
            document.getElementById('modalInfo-text-seatsCount').innerHTML = currentRestaurant.seatsCount;
            document.getElementById('modalInfo-text-socialPrivileges').innerHTML = transformBool(currentRestaurant.socialPrivileges);
            document.getElementById('modalInfo-text-coordinates').innerHTML = currentRestaurant.coordinates;
            document.getElementById('modalInfo-text-publicPhone').innerHTML = currentRestaurant.publicPhone;
            break;
        case 'edit':
            document.getElementById('modalEdit-text-title').innerHTML = "Редактирование записи";
            document.getElementById('modalEdit-input-id').innerHTML = currentRestaurant.id;
            document.getElementById('modalEdit-input-name').value = currentRestaurant.name;
            if (currentRestaurant.isNetObject == 0) {
                document.getElementById('modalEdit-input-notNetwork').checked = true;
                document.getElementById('modalEdit-input-isNetwork').checked = false;
            } else {
                document.getElementById('modalEdit-input-isNetwork').checked = true;
                document.getElementById('modalEdit-input-notNetwork').checked = false;
            };
            document.getElementById('modalEdit-input-operatingCompany').value = currentRestaurant.operatingCompany;
            setSelectValues(totalTypes, "modalEdit-select-typeObject");
            setSelectValues(totalDistricts, "modalEdit-select-district");
            setSelectValues(totalAreas, "modalEdit-select-admArea");
            document.getElementById('modalEdit-input-address').value = currentRestaurant.address;
            document.getElementById('modalEdit-input-seatsCount').value = currentRestaurant.seatsCount;
            if (currentRestaurant.socialPrivileges == 0) {
                document.getElementById('modalEdit-checkbox-havingSocPriv').checked = false;
                document.getElementById('modalEdit-checkbox-noSocPriv').checked = true;
            } else {
                document.getElementById('modalEdit-checkbox-havingSocPriv').checked = true;
                document.getElementById('modalEdit-checkbox-noSocPriv').checked = false;
            };
            document.getElementById('modalEdit-input-publicPhone').value = currentRestaurant.publicPhone;
            break;
        case 'delete':
    }
}

function loadInfoModal(event) {
    let targetImg = event.target;
    let targetId = targetImg.value;

    let url = new URL(API_URL + "/" + targetId);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        currentRestaurant = this.response;
        console.log("info: ", currentRestaurant);
        fillData('info');
        $('#infoModal').modal('show');
    }
}

function loadCreateModal(event) {
    fillData('new');
    $('#editModal').modal('show');
}

function loadEditModal(event) {
    let targetImg = event.target;
    let targetId = targetImg.value;

    let url = new URL(API_URL + "/" + targetId);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        currentRestaurant = this.response;
        console.log("info: ", currentRestaurant);
        fillData('edit');
        $('#editModal').modal('show');
    }
}

function fillDeleteModal() {
    document.getElementById('modalDelete-text-name').innerText = currentRestaurant.name;
    document.getElementById('modalDelete-text-id').innerText = currentRestaurant.id;
    document.getElementById('modalDelete-btn-abort').onclick = function () {
        $('#deleteModal').modal('hide');
    };
    document.getElementById('modalDelete-btn-process').onclick = function () {
        deleteOrganization();
    }
}

function loadDeleteModal(event) {
    fillDeleteModal(event.target.value);
    $('#deleteModal').modal('show');
}

function createRestaurantElement(restaurantObject) {
    let trow = document.createElement('tr');
    trow.value = restaurantObject.id;

    let column_name = document.createElement('th');
    column_name.id = "r-name";
    column_name.innerHTML = restaurantObject.name;

    let column_type = document.createElement('td');
    column_type.id = "r-typeObject";
    column_type.innerHTML = restaurantObject.typeObject;

    let column_district = document.createElement('td');
    column_district.id = "r-district";
    column_district.innerHTML = restaurantObject.district;

    let column_area = document.createElement('td');
    column_area.id = "r-admArea";
    column_area.innerHTML = restaurantObject.admArea;

    let column_address = document.createElement('td');
    column_address.id = "r-address";
    column_address.innerHTML = restaurantObject.address;


    let column_isNet = document.createElement('td');
    column_isNet.id = "r-isNetObject";
    column_isNet.innerHTML = transformBool(restaurantObject.isNetObject);

    let column_socialPrivileges = document.createElement('td');
    column_socialPrivileges.id = "r-socialPrivileges";
    column_socialPrivileges.innerHTML = transformBool(restaurantObject.socialPrivileges);

    let column_createdAt = document.createElement('td');
    column_createdAt.id = "r-createdAt";
    let tDate = restaurantObject.created_at; // ?
    column_createdAt.innerHTML = tDate;

    let column_seatsCount = document.createElement('td');
    column_seatsCount.id = "r-seatsCount";
    column_seatsCount.innerHTML = restaurantObject.seatsCount;

    let column_btnPanel = document.createElement('td');
    column_btnPanel.classList.add('d-flex', 'flex-row');

    let infoLink = htmlToElement(HTML_infoIcon);
    let infoLinkImg = infoLink.querySelector('.r-btn-img');
    infoLinkImg.value = restaurantObject.id;
    infoLink.onclick = loadInfoModal;

    let editLink = htmlToElement(HTML_editIcon);
    let editLinkImg = editLink.querySelector('.r-btn-img');
    editLinkImg.value = restaurantObject.id;
    editLink.onclick = loadEditModal;

    let deleteLink = htmlToElement(HTML_deleteIcon);
    let deleteLinkImg = deleteLink.querySelector('.r-btn-img');
    deleteLinkImg.value = restaurantObject.id;
    deleteLink.onclick = loadDeleteModal;

    column_btnPanel.append(infoLink, editLink, deleteLink);

    trow.append(column_name, column_type, column_district, column_area, column_address, column_isNet, column_socialPrivileges, column_createdAt, column_seatsCount, column_btnPanel);
    return trow;
}

function fillOrgTable(restaurants) {
    let restaurantsTable = document.getElementById('table-restaurants');
    for (let i = 0; i < restaurants.length; i++) {
        let restaurantObject = createRestaurantElement(restaurants[i]);
        restaurantsTable.append(restaurantObject);
    }
}

function clearTable() {
    let restaurantsTable = document.getElementById('table-restaurants');
    restaurantsTable.innerHTML = "";
}

function getStringNum(bool) {
    switch (bool) {
        case 'Да': return '1';
        case 'Нет': return '0';
        case '': return "";
    }
}

function searchOrganizations(event) {
    clearTable();

    document.getElementById('table-restaurants-global').hidden = false;

    let nameSelector = document.getElementById('input-name');
    let nameValue = nameSelector.value;

    let districtSelector = document.getElementById('select-district');
    let districtValue = districtSelector[districtSelector.selectedIndex].value;

    let areaSelector = document.getElementById('select-admArea');
    let areaValue = areaSelector[areaSelector.selectedIndex].value;

    let isNetSelector = document.getElementById('select-isNetObject');
    let isNetValue = getStringNum(isNetSelector[isNetSelector.selectedIndex].value);

    let typeObjectSelector = document.getElementById('select-typeObject');
    let typeValue = typeObjectSelector[typeObjectSelector.selectedIndex].value;

    let socPrivSelector = document.getElementById('select-socialPrivileges');
    let socPrivValue = getStringNum(socPrivSelector[socPrivSelector.selectedIndex].value);

    let minCapacityInput = document.getElementById('border_minCapacity');
    let minCapacity = minCapacityInput.value;

    let maxCapacityInput = document.getElementById('border_maxCapacity');
    let maxCapacity = maxCapacityInput.value;

    let minDateInput = document.getElementById('border_minDate');
    let minDate = minDateInput.value;

    let maxDateInput = document.getElementById('border_maxDate');
    let maxDate = maxDateInput.value;

    console.log("name:" + nameValue + "; district: " + districtValue + "; area: " + areaValue + "; isNet: " + isNetValue + "; type: " + typeValue + "; socPriv: " + socPrivValue + "; minCapacity: " + minCapacity + "; maxCapacity: " + maxCapacity + "; minDate: " + minDate + "; maxDate: " + maxDate);
    formatedData = formatData(nameValue, districtValue, areaValue, isNetValue, typeValue, socPrivValue, minCapacity, maxCapacity, minDate, maxDate);
    fillOrgTable(formatedData);
}

function setMinDate(event) {
    updateDateRange(event.target.value, "min");
}

function setMaxDate(event) {
    updateDateRange(event.target.value, "max");
}

window.onload = function () {
    allData = loadAllData();
    document.getElementById('btn_formFormat').onclick = searchOrganizations;
    document.getElementById('border_minDate').oninput = setMinDate; // ?
    document.getElementById('border_maxDate').oninput = setMaxDate; // ?
    document.getElementById('createModal').onclick = loadCreateModal;
}
