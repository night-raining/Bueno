let API_URL = "http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1";

let allData;
let formattedOrganizationsData;
let totalDistricts;
let totalAreas;
let totalTypes;
let totalSocPrivileges;

let order_organization;
let order_options = [{ option: "На компанию. Количество всех заказанных сетов увеличивается в 5 раз. ", value: "+150%", isActive: false }, 
{ option: "Только горячим. Если заказ окажется холодным, получите скидку!", value: "-30%(Опционально)", isActive: false }];
let order_cost = 0;

let order_set1 = { count: 0 };
let order_set2 = { count: 0 };
let order_set3 = { count: 0 };
let order_set4 = { count: 0 };
let order_set5 = { count: 0 };
let order_set6 = { count: 0 };
let order_set7 = { count: 0 };
let order_set8 = { count: 0 };
let order_set9 = { count: 0 };
let order_set10 = { count: 0 };



let orderPrice;
// Расширяющая функция проверки наличия элемента в массиве
Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

function transformSocPrivValue(value) {
    console.log("get: " + value);
    switch (value) {
        case 0: return 'Нет'; break;
        case 1: return 'Да'; break;
        case 'Да': return 1; break;
        case 'Нет': return 0; break;
        default: return '';
    }
}

function getRestaurantById(restaurants, id) {
    for (let i = 0; i < restaurants.length; i++) {
        if (restaurants[i].id == id) return restaurants[i];
    }
}

function getSetsPrices(restaurant) {
    let prices = [];
    prices.set_1 = restaurant.set_1;
    order_set1.price = restaurant.set_1;
    prices.set_2 = restaurant.set_2;
    order_set2.price = restaurant.set_2;
    prices.set_3 = restaurant.set_3;
    order_set3.price = restaurant.set_3;
    prices.set_4 = restaurant.set_4;
    order_set4.price = restaurant.set_4;
    prices.set_5 = restaurant.set_5;
    order_set5.price = restaurant.set_5;
    prices.set_6 = restaurant.set_6;
    order_set6.price = restaurant.set_6;
    prices.set_7 = restaurant.set_7;
    order_set7.price = restaurant.set_7;
    prices.set_8 = restaurant.set_8;
    order_set8.price = restaurant.set_8;
    prices.set_9 = restaurant.set_9;
    order_set9.price = restaurant.set_9;
    prices.set_10 = restaurant.set_10;
    order_set10.price = restaurant.set_10;
    return prices;
}

function updateTotalCost() {
    let newResultCost = 0
    if (order_set1.count > 0) {
        newResultCost += order_set1.count * order_set1.price;
    }
    if (order_set2.count > 0) {
        newResultCost += order_set2.count * order_set2.price;
    }
    if (order_set3.count > 0) {
        newResultCost += order_set3.count * order_set3.price;
    }
    if (order_set4.count > 0) {
        newResultCost += order_set4.count * order_set4.price;
    }
    if (order_set5.count > 0) {
        newResultCost += order_set5.count * order_set5.price;
    }
    if (order_set6.count > 0) {
        newResultCost += order_set6.count * order_set6.price;
    }
    if (order_set7.count > 0) {
        newResultCost += order_set7.count * order_set7.price;
    }
    if (order_set8.count > 0) {
        newResultCost += order_set8.count * order_set8.price;
    }
    if (order_set9.count > 0) {
        newResultCost += order_set9.count * order_set9.price;
    }
    if (order_set10.count > 0) {
        newResultCost += order_set10.count * order_set10.price;
    }

    if(order_options[0].isActive) {
        newResultCost*=2.5;
    }
    changeTotalPriceToValue(newResultCost);
}

function fillMenu(prices) {
    console.log(prices);
    let menuBlock = document.getElementById('menu').hidden = false;
    document.getElementById('set_1_price').innerHTML = prices.set_1;
    document.getElementById('set_2_price').innerHTML = prices.set_2;
    document.getElementById('set_3_price').innerHTML = prices.set_3;
    document.getElementById('set_4_price').innerHTML = prices.set_4;
    document.getElementById('set_5_price').innerHTML = prices.set_5;
    document.getElementById('set_6_price').innerHTML = prices.set_6;
    document.getElementById('set_7_price').innerHTML = prices.set_7;
    document.getElementById('set_8_price').innerHTML = prices.set_8;
    document.getElementById('set_9_price').innerHTML = prices.set_9;
    document.getElementById('set_10_price').innerHTML = prices.set_10;
}



function selectRestaurant(event) {
    let id = event.target.value;
    let selectedRestaurant = getRestaurantById(formattedOrganizationsData, id);
    order_organization = selectedRestaurant;
    let restaurantSetsPrices = getSetsPrices(selectedRestaurant);
    fillMenu(restaurantSetsPrices);
    updateTotalCost();
}

function createRestaurantElement(restaurantObject) {
    let trow = document.createElement('tr');

    let column_name = document.createElement('th');
    column_name.id = "restaurant_name";
    column_name.innerHTML = restaurantObject.name;

    let column_type = document.createElement('td');
    column_type.id = "restaurant_type";
    column_type.innerHTML = restaurantObject.typeObject;

    let column_district = document.createElement('td');
    column_district.id = "restaurant_district";
    column_district.innerHTML = restaurantObject.district;

    let column_area = document.createElement('td');
    column_area.id = "restaurant_area";
    column_area.innerHTML = restaurantObject.admArea;

    let column_address = document.createElement('td');
    column_address.id = "restaurant_address";
    column_address.innerHTML = restaurantObject.address;

    let column_rating = document.createElement('td');
    column_rating.id = "restaurant_rating";
    column_rating.innerHTML = restaurantObject.rate;

    let column_havingSocPriv = document.createElement('td');
    column_havingSocPriv.id = "restaurant_havingSocPriv";
    column_havingSocPriv.innerHTML = transformSocPrivValue(restaurantObject.socialPrivileges);

    let column_selectOrg = document.createElement('td');
    let selectOrgBtn = document.createElement('button');
    selectOrgBtn.value = restaurantObject.id;
    selectOrgBtn.innerHTML = "Выбрать " + restaurantObject.id;
    selectOrgBtn.onclick = selectRestaurant;
    selectOrgBtn.classList.add('btn')
    column_selectOrg.append(selectOrgBtn);

    trow.append(column_name, column_type, column_district, column_area, column_address, column_rating, column_havingSocPriv, column_selectOrg);
    return trow;
}

function fillOrganizationsTable(restaurants) {
    let restaurantsTable = document.getElementById('table-restaurants');
    for (let i = 0; i < restaurants.length; i++) {
        let restaurantObject = createRestaurantElement(restaurants[i]);
        restaurantsTable.append(restaurantObject);
    }
}

function formOrganizationsData(district, area, type, socPriv) {
    console.log("Form params: district: " + district + "; area: " + area + "; type: " + type + "; socPriv: " + socPriv + ";");
    let tempFormattedData = [];
    for (let i = 0; i < allData.length; i++) {
        let curOrg = allData[i];
        if ((curOrg.district == district || district == "") &
            (curOrg.admArea == area || area == "") &
            (curOrg.typeObject == type || type == "") &
            (curOrg.socialPrivileges == socPriv || socPriv == "")) {
            console.log("curOrg.socialPrivileges:" + curOrg.socialPrivileges + "; socPrivValue - " + socPriv);
            console.log("Match:", curOrg);
            tempFormattedData.push(curOrg);
        }
    }
    return tempFormattedData;
}

function clearOrgTable() {
    let restaurantsTable = document.getElementById('table-restaurants');
    restaurantsTable.innerHTML = "";
}

// Подготовка данных и формирование запроса
function searchOrganizations(event) {
    clearOrgTable();

    let districtSelector = document.getElementById('district');
    let districtValue = districtSelector[districtSelector.selectedIndex].value;

    let areaSelector = document.getElementById('area');
    let areaValue = areaSelector[areaSelector.selectedIndex].value;

    let typeSelector = document.getElementById('type');
    let typeValue = typeSelector[typeSelector.selectedIndex].value;

    let socPrivSelector = document.getElementById('isSocialDiscount');
    let socPrivValue;

    switch (socPrivSelector[socPrivSelector.selectedIndex].value) {
        case 'Да':
            socPrivValue = "1";
            break;
        case 'Нет':
            socPrivValue = "0";
            break;
        case '':
            socPrivValue = "";
    }

    formattedOrganizationsData = formOrganizationsData(districtValue, areaValue, typeValue, socPrivValue);
    fillOrganizationsTable(formattedOrganizationsData);
}

// Перебирает массив данных, формирует массив неповторяющихся значений полей по переданному параметру field
function getDistinctFields(restaurants, field) {
    let t_totalFields = [];
    for (let i = 0; i < restaurants.length; i++) {
        if (!t_totalFields.contains(restaurants[i][field])) {
            t_totalFields.push(restaurants[i][field]);
        }
    }
    console.log(field);
    console.log(t_totalFields);
    return t_totalFields;
}

// Преобразует значения 0 и 1 в Да и Нет для заполнения данных о наличии соц. льгот в форме выбора предприятия
function formatSocPrivData(totalSocPrivileges) {
    let t_socPrivData = [];
    if (totalSocPrivileges.contains(0)) {
        t_socPrivData.push("Нет")
    }
    if (totalSocPrivileges.contains(1)) {
        t_socPrivData.push("Да")
    }
    return t_socPrivData;
}

// Устанавливает значения select элементу с viewId(заполняет возможные варианты выбора в форме для конкретного поля)
function setOrganizationFormFieldValues(dataOptions, elementId) {
    let selectElement = document.getElementById(elementId);
    for (let i = 0; i < dataOptions.length; i++) {
        let optionElement = document.createElement('option');
        optionElement.innerHTML = dataOptions[i];
        selectElement.append(optionElement);
    }
}

// Устанавливает значения элементам формы выбора предприятия
function setOrganizationFormValues(totalDistricts, totalAreas, totalTypes, totalSocPrivileges) {
    setOrganizationFormFieldValues(totalDistricts, "district");
    setOrganizationFormFieldValues(totalAreas, "area");
    setOrganizationFormFieldValues(totalTypes, "type");
    setOrganizationFormFieldValues(formatSocPrivData(totalSocPrivileges), "isSocialDiscount");
}

// Присваивание глобальным переменным неповторяющихся полей значений для формы выбора организации
function getTotalDistinctFields(data) {
    totalDistricts = getDistinctFields(data, "district");
    totalAreas = getDistinctFields(data, "admArea");
    totalTypes = getDistinctFields(data, "typeObject");
    totalSocPrivileges = getDistinctFields(data, "socialPrivileges");
    setOrganizationFormValues(totalDistricts, totalAreas, totalTypes, totalSocPrivileges);
}

// Загрузка общего массива данных
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

function getSetPriceById(targetSetCount) {
    switch (targetSetCount) {
        case 'set-1-count':
            return document.getElementById('set_1_price').innerHTML;
        case 'set-2-count':
            return document.getElementById('set_2_price').innerHTML;
        case 'set-3-count':
            return document.getElementById('set_3_price').innerHTML;
        case 'set-4-count':
            return document.getElementById('set_4_price').innerHTML;
        case 'set-5-count':
            return document.getElementById('set_5_price').innerHTML;
        case 'set-6-count':
            return document.getElementById('set_6_price').innerHTML;
        case 'set-7-count':
            return document.getElementById('set_7_price').innerHTML;
        case 'set-8-count':
            return document.getElementById('set_8_price').innerHTML;
        case 'set-9-count':
            return document.getElementById('set_9_price').innerHTML;
        case 'set-10-count':
            return document.getElementById('set_10_price').innerHTML;
    }
}

function changeTotalPrice(priceChangeBy, operation) {
    let totalPrice = document.getElementById('order-price');
    let totalPriceValue = Number(totalPrice.innerHTML);
    let tPriceToChange = Number(priceChangeBy);
    switch (operation) {
        case "+":
            totalPrice.innerHTML = totalPriceValue + tPriceToChange;
            order_cost = totalPrice.innerHTML;
            break;
        case "-":
            totalPrice.innerHTML = totalPriceValue - tPriceToChange;
            order_cost = totalPrice.innerHTML;
    }
}

function changeTotalPriceToValue(newPrice) {
    let totalPrice = document.getElementById('order-price');
    let tPriceToChange = Number(newPrice);
    totalPrice.innerHTML = tPriceToChange;
    order_cost = tPriceToChange;
}

function removeOrderSet(inputId) {
    switch (inputId) {
        case 'set-1-count':
            order_set1.count--;
            break;
        case 'set-2-count':
            order_set2.count--;
            break;
        case 'set-3-count':
            order_set3.count--;
            break;
        case 'set-4-count':
            order_set4.count--;
            break;
        case 'set-5-count':
            order_set5.count--;
            break;
        case 'set-6-count':
            order_set6.count--;
            break;
        case 'set-7-count':
            order_set7.count--;
            break;
        case 'set-8-count':
            order_set8.count--;
            break;
        case 'set-9-count':
            order_set9.count--;
            break;
        case 'set-10-count':
            order_set10.count--;
    }
}

function addOrderSet(inputId) {
    switch (inputId) {
        case 'set-1-count':
            order_set1.count++;
            break;
        case 'set-2-count':
            order_set2.count++;
            break;
        case 'set-3-count':
            order_set3.count++;
            break;
        case 'set-4-count':
            order_set4.count++;
            break;
        case 'set-5-count':
            order_set5.count++;
            break;
        case 'set-6-count':
            order_set6.count++;
            break;
        case 'set-7-count':
            order_set7.count++;
            break;
        case 'set-8-count':
            order_set8.count++;
            break;
        case 'set-9-count':
            order_set9.count++;
            break;
        case 'set-10-count':
            order_set10.count++;
    }
}

function changeSetsCount(event) {
    let targetSetCount = document.getElementById(event.target.value); // внутри кнопки value соответствует id input-а
    let tVal = targetSetCount.value;
    let targetSetPrice = getSetPriceById(targetSetCount.id);
    console.log("set price - " + targetSetPrice);
    if (event.target.innerHTML == '+') {
        tVal++;
        targetSetCount.value = tVal;
        changeTotalPrice(targetSetPrice, "+");
        addOrderSet(targetSetCount.id);
    } else {
        if (tVal > 0) {
            tVal--;
            targetSetCount.value = tVal;
            changeTotalPrice(targetSetPrice, "-");
            removeOrderSet(targetSetCount.id);
        }
    }
}

function fillGoodPositions() {
    let goods_list = document.querySelector("goods-list");
    if (order_set1.count > 0) {
        console.log("count set1-" + order_set1.count);
        document.getElementById('set1_order').hidden = false;
        document.getElementById('set1_count').innerHTML = order_set1.count;
        document.getElementById('set1_price').innerHTML = order_set1.price;
        document.getElementById('set1_totalPrice').innerHTML = order_set1.count * order_set1.price;
    }
    if (order_set2.count > 0) {
        document.getElementById('set2_order').hidden = false;
        document.getElementById('set2_count').innerHTML = order_set2.count;
        document.getElementById('set2_price').innerHTML = order_set2.price;
        document.getElementById('set2_totalPrice').innerHTML = order_set2.count * order_set2.price;
    }
    if (order_set3.count > 0) {
        document.getElementById('set3_order').hidden = false;
        document.getElementById('set3_count').innerHTML = order_set3.count;
        document.getElementById('set3_price').innerHTML = order_set3.price;
        document.getElementById('set3_totalPrice').innerHTML = order_set3.count * order_set3.price;
    }
    if (order_set4.count > 0) {
        document.getElementById('set4_order').hidden = false;
        document.getElementById('set4_count').innerHTML = order_set4.count;
        document.getElementById('set4_price').innerHTML = order_set4.price;
        document.getElementById('set4_totalPrice').innerHTML = order_set4.count * order_set4.price;
    }
    if (order_set5.count > 0) {
        document.getElementById('set5_order').hidden = false;
        document.getElementById('set5_count').innerHTML = order_set5.count;
        document.getElementById('set5_price').innerHTML = order_set5.price;
        document.getElementById('set5_totalPrice').innerHTML = order_set5.count * order_set5.price;
    }
    if (order_set6.count > 0) {
        document.getElementById('set6_order').hidden = false;
        document.getElementById('set6_count').innerHTML = order_set6.count;
        document.getElementById('set6_price').innerHTML = order_set6.price;
        document.getElementById('set6_totalPrice').innerHTML = order_set6.count * order_set6.price;
    }
    if (order_set7.count > 0) {
        document.getElementById('set7_order').hidden = false;
        document.getElementById('set7_count').innerHTML = order_set7.count;
        document.getElementById('set7_price').innerHTML = order_set7.price;
        document.getElementById('set7_totalPrice').innerHTML = order_set7.count * order_set7.price;
    }
    if (order_set8.count > 0) {
        document.getElementById('set8_order').hidden = false;
        document.getElementById('set8_count').innerHTML = order_set8.count;
        document.getElementById('set8_price').innerHTML = order_set8.price;
        document.getElementById('set8_totalPrice').innerHTML = order_set8.count * order_set8.price;
    }
    if (order_set9.count > 0) {
        document.getElementById('set9_order').hidden = false;
        document.getElementById('set9_count').innerHTML = order_set9.count;
        document.getElementById('set9_price').innerHTML = order_set9.price;
        document.getElementById('set9_totalPrice').innerHTML = order_set9.count * order_set9.price;
    }
    if (order_set10.count > 0) {
        document.getElementById('set10_order').hidden = false;
        document.getElementById('set10_count').innerHTML = order_set10.count;
        document.getElementById('set10_price').innerHTML = order_set10.price;
        document.getElementById('set10_totalPrice').innerHTML = order_set10.count * order_set10.price;
    }
}

function fillOptionsInfo() {
    let optionsList = document.getElementById('options-list');
    optionsList.innerHTML = ""; // Удаление прошлых опций
    if (order_options[0].isActive == true) {
        let fastDeliveryOption = document.createElement('div');
        fastDeliveryOption.classList.add("d-flex", "flex-row", "justify-content-between");
        let optionText = order_options[0].option;
        let optionValue = order_options[0].value;
        let optionTextObj = document.createElement('p');
        let optionValueObj = document.createElement('p');
        optionTextObj.innerHTML = optionText;
        optionValueObj.innerHTML = optionValue;
        fastDeliveryOption.append(optionTextObj);
        fastDeliveryOption.append(optionValueObj);
        optionsList.append(fastDeliveryOption);
    }
    if (order_options[1].isActive == true) {
        let getHotOption = document.createElement('div');
        getHotOption.classList.add("d-flex", "flex-row", "justify-content-between");
        let optionText = order_options[1].option;
        let optionValue = order_options[1].value;
        let optionTextObj = document.createElement('p');
        let optionValueObj = document.createElement('p');
        optionTextObj.innerHTML = optionText;
        optionValueObj.innerHTML = optionValue;
        getHotOption.append(optionTextObj);
        getHotOption.append(optionValueObj);
        optionsList.append(getHotOption);
    }
}

function fillOrganizationInfo() {
    document.getElementById('org_name').innerHTML = order_organization.name;
    document.getElementById('org_district').innerHTML = order_organization.district;
    document.getElementById('org_area').innerHTML = order_organization.admArea;
    document.getElementById('org_address').innerHTML = order_organization.address;
    document.getElementById('org_rating').innerHTML = order_organization.rate;
}

function fillTotalCost() {
    let deliveryCost = 250;
    let totalCost = Number(order_cost) + deliveryCost;
    document.getElementById('order_totalCost').innerHTML = totalCost;
}

function fillOrderModal() {
    fillGoodPositions();
    fillOptionsInfo();
    fillOrganizationInfo();
    fillTotalCost();
}

// Заполнение модального окна данными
function processOrder(event) {
    fillOrderModal();
}

function addCheckBoxesListeners() {
    var checkbox_fd = document.getElementById("checkbox_forCompany");
    var checkbox_gw = document.getElementById("checkbox_getWarm");
    checkbox_fd.addEventListener('change', function () {
        if (this.checked) {
            order_options[0].isActive = true;
            changeTotalPriceToValue(Math.round(order_cost * 2.5));
        } else {
            order_options[0].isActive = false;
            changeTotalPriceToValue(Math.round(order_cost / 2.5));
        }
    });
    checkbox_gw.addEventListener('change', function () {
        if (this.checked) {
            order_options[1].isActive = true;
        } else {
            order_options[1].isActive = false;
        }
    });
}

window.onload = function () {
    allData = loadAllData();
    document.getElementById("btnSearchOrganizations").onclick = searchOrganizations;
    let countBtns = document.querySelectorAll(".btn-count-change");
    for (let i = 0; i < countBtns.length; i++) {
        countBtns[i].onclick = changeSetsCount;
    }
    document.getElementById('btn-order-process').onclick = processOrder;
    addCheckBoxesListeners();
}

