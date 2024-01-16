$(document).ready(function() {

    const tableR = document.querySelector('.tableR');
    var dialog = document.getElementById("payment-approval__dialog");

    var tableR2 = document.getElementById('payment-table');

    if(tableR) {
        if ($(this).innerHeight() > tableR2.offsetHeight) {
            var sortCol_1 = document.getElementById('sortCol-1').textContent
            // document.getElementById('sortCol-1').textContent = ''
            var page_url = document.URL.substring(document.URL.lastIndexOf('/')+1);
            if (page_url === 'payment-approval') {
                paymentApproval(sortCol_1);
            }
            else if (page_url === 'payment-pay') {
                paymentPay2(sortCol_1);
            }
            else if (page_url === 'payment-list') {
                paymentList2(sortCol_1);
            }
            else if (page_url === 'payment-approval-list') {
                paymentList2(sortCol_1);
            }
            else if (page_url === 'payment-paid-list') {
                paymentList2(sortCol_1);
            }
        }
    }

    tableR.addEventListener('scroll', function() {

        var sortCol_1 = document.getElementById('sortCol-1').textContent
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight && sortCol_1) {
            document.getElementById('sortCol-1').textContent = ''
            var page_url = document.URL.substring(document.URL.lastIndexOf('/')+1);
            if (page_url === 'payment-approval') {
                paymentApproval(sortCol_1);
            }
            else if (page_url === 'payment-pay') {
                paymentPay2(sortCol_1);
            }
            else if (page_url === 'payment-list') {
                paymentList2(sortCol_1);
            }
            else if (page_url === 'payment-approval-list') {
                paymentList2(sortCol_1);
            }
            else if (page_url === 'payment-paid-list') {
                paymentList2(sortCol_1);
            }
            if(tableR) {
                //  возвращает координаты в контексте окна для минимального по размеру прямоугольника tableR
                const rect = tableR.getBoundingClientRect();
            }

            return
        }
    });
});

var limit = 25

function paymentApproval(sortCol_1) {
    var sortCol_1_val = document.getElementById('sortCol-1_val').textContent;
    var sortCol_2 = document.getElementById('sortCol-2').textContent;
    var sortCol_2_val = document.getElementById('sortCol-2_val').textContent;
    var sortCol_id = document.getElementById('sortCol-id').textContent;
    var sortCol_id_val = document.getElementById('sortCol-id_val').textContent;

    var filter_input = document.querySelectorAll('[id*="filter-input-"]');
    var filterValsList = []; // Значения фильтров

    for (var i=0; i<filter_input.length; i++) {
        if (filter_input[i].value) {
            filterValsList.push([i, filter_input[i].value]);
        }
    }

    // Получили пустые данные - загрузили всю таблицу - ничего не делаем
    if (!sortCol_1) {
        return
    }
    else {

        fetch('/get-paymentApproval-pagination', {
            "headers": {
                'Content-Type': 'application/json'
            },
            "method": "POST",
            "body": JSON.stringify({
                'limit': limit,
                'sort_col_1': sortCol_1,
                'sort_col_1_val': sortCol_1_val,
                'sort_col_2': sortCol_2,
                'sort_col_2_val': sortCol_2_val,
                'sort_col_id': sortCol_2,
                'sort_col_id_val': sortCol_2_val,
                'filterValsList': filterValsList
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    if (!data.payment) {return}
                    document.getElementById('sortCol-1').textContent = data.sort_col['col_1'][0]
                    document.getElementById('sortCol-1_val').textContent = data.sort_col['col_1'][1]
                    document.getElementById('sortCol-2').textContent = data.sort_col['col_2'][0]
                    document.getElementById('sortCol-2_val').textContent = data.sort_col['col_2'][1]
                    document.getElementById('sortCol-id').textContent = data.sort_col['col_id'][0]
                    document.getElementById('sortCol-id_val').textContent = data.sort_col['col_id'][1]

                    const tab = document.getElementById("payment-table");
                    var tab_tr = tab.getElementsByTagName('tbody')[0];
                    var tab_numRow = tab.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

                    try {
                        var numRow = parseInt(tab_numRow[tab_numRow.length-1].getElementsByTagName('td')[0].getElementsByTagName('input')[0].value);
                    }
                    catch {
                        var numRow = 0;
                    }

                    var tab_tr0 = tab.getElementsByTagName('tbody')[0];

                    for (pmt of data.payment) {

                        numRow++;
                        // Вставляем ниже новую ячейку, копируя предыдущую
                        var table2 = document.getElementById("payment-table");
                        var rowCount = table2.rows.length;
                        var lastRow = table2.rows[rowCount - 1];

                        var row = tab_tr0.insertRow(numRow-1);

                        //////////////////////////////////////////
                        // Меняем данные в ячейке
                        //////////////////////////////////////////
                        // id
                        row.id = `row-${numRow}`;

                        //**************************************************
                        // Флажок выбора
                        var cellCheckbox = row.insertCell(0);
                        cellCheckbox.className = "th_select_i";
                        cellCheckbox.setAttribute("data-sort", "0");
                        data.setting_users.hasOwnProperty('0') ? cellCheckbox.hidden = true: 0;
                        var checkbox = document.createElement('input');
                        checkbox.type = "checkbox";
                        checkbox.id = `selectedRows-${numRow}`;
                        checkbox.name = "selectedRows";
                        checkbox.value = numRow;
                        checkbox.setAttribute("onchange", `paymentApprovalRecalcCards(${numRow}), paymentApprovalNoSelect(${numRow}), refreshSortValChb(${numRow})`)
                        cellCheckbox.appendChild(checkbox);

                        //**************************************************
                        // Описание
                        var cellDescription = row.insertCell(1);
                        cellDescription.className = "th_description_i";
                        cellDescription.setAttribute("data-sort", `${pmt['descr_part1']}: ${pmt['payment_description']}`);
                        data.setting_users.hasOwnProperty('1') ? cellDescription.hidden = true: 0;
                        cellDescription.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        cellDescription.title = `${pmt['descr_part1']}\n${pmt['payment_description']}`;
                        var spanBold = document.createElement('span');
                        spanBold.className = "paymentFormBold";
                        spanBold.innerHTML = pmt['descr_part1'] + ":<br>";
                        var textNode = document.createTextNode(pmt['payment_description_short']);
                        cellDescription.appendChild(spanBold);
                        cellDescription.appendChild(textNode);

                        //**************************************************
                        // Общая сумма
                        var cellPaymentSum = row.insertCell(2);
                        cellPaymentSum.className = "th_main_sum_i";
                        cellPaymentSum.setAttribute("data-sort", pmt['payment_sum']);
                        data.setting_users.hasOwnProperty('2') ? cellPaymentSum.hidden = true: 0;
                        cellPaymentSum.innerHTML = pmt['payment_sum_rub'];

                        //**************************************************
                        // Остаток к оплате
                        var cellSumRemain = row.insertCell(3);
                        cellSumRemain.className = "th_sum_remain_i";
                        cellSumRemain.setAttribute("data-sort", pmt['approval_sum']);
                        data.setting_users.hasOwnProperty('3') ? cellSumRemain.hidden = true: 0;
                        var inputApprovalSum = document.createElement('input');
                        inputApprovalSum.id = `approvalSum-${numRow}`;
                        inputApprovalSum.name = "approval_sum";
                        inputApprovalSum.value = pmt['approval_sum'];
                        inputApprovalSum.hidden = true;
                        inputApprovalSum.readOnly = true;
                        cellSumRemain.innerHTML = pmt['approval_sum_rub'];
                        cellSumRemain.appendChild(inputApprovalSum);

                        //**************************************************
                        // Согласованная сумма
                        var cellSumAgreed = row.insertCell(4);
                        cellSumAgreed.className = "th_sum_agreed_i";
                        cellSumAgreed.setAttribute("data-sort", pmt['amount']);
                        data.setting_users.hasOwnProperty('4') ? cellSumAgreed.hidden = true: 0;
                        var inputAmount = document.createElement('input');
                        inputAmount.id = `amount-${numRow}`;
                        inputAmount.name = "amount";
                        inputAmount.value = pmt['amount_rub'];
                        inputAmount.setAttribute("data-amount", 0);
                        inputAmount.setAttribute("onchange", `paymentApprovalRecalcCards(${numRow}), saveData(${numRow}, '${data.page}'), refreshSortValAmount(${numRow})`)
                        cellSumAgreed.appendChild(inputAmount);

                        //**************************************************
                        // Ответственный
                        var cellResponsible = row.insertCell(5);
                        cellResponsible.className = "th_responsible_i";
                        cellResponsible.setAttribute("data-sort", `${pmt['last_name']} ${pmt['first_name']}`);
                        data.setting_users.hasOwnProperty('5') ? cellResponsible.hidden = true: 0;
                        cellResponsible.innerHTML = `${pmt['last_name']} ${pmt['first_name'][0]}.`;

                        //**************************************************
                        // Срок оплаты
                        var cellPayDate = row.insertCell(6);
                        cellPayDate.className = "th_pay_date_i";
                        cellPayDate.setAttribute("data-sort", pmt['payment_due_date']);
                        data.setting_users.hasOwnProperty('6') ? cellPayDate.hidden = true: 0;
                        cellPayDate.innerHTML = pmt['payment_due_date_txt'];

                        //**************************************************
                        // Статус
                        var cellStatus = row.insertCell(7);
                        cellStatus.className = "th_status_i";
                        cellStatus.id = `status-${numRow}`;
                        cellStatus.setAttribute("data-sort", pmt['status_id']);
                        data.setting_users.hasOwnProperty('7') ? cellStatus.hidden = true: 0;
                        var selectStatus = document.createElement('select');
                        selectStatus.id = `status_id-${numRow}`;
                        selectStatus.name = "status_id";
                        selectStatus.setAttribute("onchange", `paymentApprovalRecalcCards(${numRow}), saveData(${numRow}, '${data.page}')`)
                        for (var j = 0; j < data.approval_statuses.length; j++) {
                            var option = document.createElement('option');
                            option.text = data.approval_statuses[j].payment_agreed_status_name;
                            selectStatus.appendChild(option);
                        }
                        selectStatus[0].selected = true;
                        for (let i = 0; i < selectStatus.length; i++) {
                            if (selectStatus[i].value === pmt['status_name'].toString()) {
                                selectStatus[i].selected = true;
                            }
                        }
                        cellStatus.appendChild(selectStatus);

                        //**************************************************
                        // Дата создания
                        var cellDateCreate = row.insertCell(8);
                        cellDateCreate.className = "th_date_create_i";
                        cellDateCreate.setAttribute("data-sort", pmt['payment_at']);
                        data.setting_users.hasOwnProperty('8') ? cellDateCreate.hidden = true: 0;
                        var inputPaymentNumber = document.createElement('input');
                        inputPaymentNumber.id = `paymentNumber-${numRow}`;
                        inputPaymentNumber.name = "payment_number";
                        inputPaymentNumber.value = pmt['payment_id'];
                        inputPaymentNumber.hidden = true;
                        inputPaymentNumber.readOnly = true;
                        cellDateCreate.innerHTML = pmt['payment_at_txt'];
                        cellDateCreate.appendChild(inputPaymentNumber);

                        //**************************************************
                        // До полной оплаты
                        var cellSavePay = row.insertCell(9);
                        cellSavePay.className = "th_save_pay_i";
                        cellSavePay.setAttribute("data-sort", pmt['payment_full_agreed_status'] ? "1" : "0");
                        data.setting_users.hasOwnProperty('9') ? cellSavePay.hidden = true: 0;
                        var checkboxPaymentFullStatus = document.createElement('input');
                        checkboxPaymentFullStatus.type = "checkbox";
                        checkboxPaymentFullStatus.id = `paymentFullStatus-${numRow}`;
                        checkboxPaymentFullStatus.name = "payment_full_agreed_status";
                        checkboxPaymentFullStatus.value = numRow;
                        if (pmt['payment_full_agreed_status']) {
                            checkboxPaymentFullStatus.checked = true;
                        }
                        checkboxPaymentFullStatus.setAttribute("onchange", `saveData(${numRow}, '${data.page}'), tabColorize(${numRow}), refreshSortValChb(${numRow})`);
                        cellSavePay.appendChild(checkboxPaymentFullStatus);

                        const scrollPercentage = ((rowCount) / data.tab_rows) * 100;
                        const progressBar = document.querySelector('.progress');
                        progressBar.style.width = scrollPercentage + '%';

                        tabColorize(numRow);
                    }
                    return
                }
                else if (data.status === 'error') {
                    alert(data.description)
                }
                else {
                    window.location.href = '/payment-approval';
                }
        })
        .catch(error => {
        console.error('Error:', error);
    });
    }
};

//function paymentPay(sortCol_1) {
//    var sortCol_1_val = document.getElementById('sortCol-1_val').textContent
//    var sortCol_2 = document.getElementById('sortCol-2').textContent
//    var sortCol_2_val = document.getElementById('sortCol-2_val').textContent
//    var sortCol_id = document.getElementById('sortCol-id').textContent
//    var sortCol_id_val = document.getElementById('sortCol-id_val').textContent
//
//    // Получили пустые данные - загрузили всю таблицу - ничего не делаем
//    if (!sortCol_1) {
//        return
//    }
//    else {
//
//        fetch('/get-paymentPay-pagination', {
//            "headers": {
//                'Content-Type': 'application/json'
//            },
//            "method": "POST",
//            "body": JSON.stringify({
//                'limit': limit,
//                'sort_col_1': sortCol_1,
//                'sort_col_1_val': sortCol_1_val,
//                'sort_col_2': sortCol_2,
//                'sort_col_2_val': sortCol_2_val,
//                'sort_col_id': sortCol_2,
//                'sort_col_id_val': sortCol_2_val,
//            })
//        })
//            .then(response => response.json())
//            .then(data => {
//                if (data.status === 'success') {
//                    if (!data.payment) {return}
//                    document.getElementById('sortCol-1').textContent = data.sort_col['col_1'][0]
//                    document.getElementById('sortCol-1_val').textContent = data.sort_col['col_1'][1]
//                    document.getElementById('sortCol-2').textContent = data.sort_col['col_2'][0]
//                    document.getElementById('sortCol-2_val').textContent = data.sort_col['col_2'][1]
//                    document.getElementById('sortCol-id').textContent = data.sort_col['col_id'][0]
//                    document.getElementById('sortCol-id_val').textContent = data.sort_col['col_id'][1]
//
//                    const tab = document.getElementById("payment-table");
//                    var tab_tr = tab.getElementsByTagName('tbody')[0];
//                    var tab_numRow = tab.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
//                    var numRow = parseInt(tab_numRow[tab_numRow.length-1].getElementsByTagName('td')[0].getElementsByTagName('input')[0].value)
//
//                    var tab_tr0 = tab.getElementsByTagName('tbody')[0]
//
//                    for (pmt of data.payment) {
//
//                        numRow++;
//                        // Вставляем ниже новую ячейку, копируя предыдущую
//                        var table2 = document.getElementById("payment-table");
//                        var rowCount = table2.rows.length;
//                        var lastRow = table2.rows[rowCount - 1];
//                        var newRow = lastRow.cloneNode(true);
//
//                        var td = newRow.getElementsByTagName('td'); // Ячейки новой строки
//
//                        //////////////////////////////////////////
//                        // Меняем данные в ячейке
//                        //////////////////////////////////////////
//                        // id
//                        newRow.id = `row-${numRow}`;
//
//                        // Флажок выбора
//                        td_0 = td[0];
//                        td_0_input = td_0.getElementsByTagName('input')[0];
//                        td_0.dataset.sort = '0';
//                        td_0_input.id = `selectedRows-${numRow}`;
//                        td_0_input.value  = numRow;
//                        td_0_input.setAttribute("onchange", `paymentApprovalRecalcCards(${numRow}), paymentApprovalNoSelect(${numRow}), refreshSortValChb(${numRow})`);
//                        td_0_input.checked = false;
//
//                        // Статья затрат
//                        td_1 = td[1];
//                        td_1.id = `category-${numRow}`;
//                        td_1.dataset.sort = pmt['cost_item_name'];
//                        td_1.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//                        var td_1_input = document.createElement("input");
//                        td_1_input.type = "text";
//                        td_1_input.id = `paymentNumber-${numRow}`;
//                        td_1_input.name = "payment_number";
//                        td_1_input.value = pmt['payment_id'];
//                        td_1_input.setAttribute('hidden', 'hidden');
//                        td_1_input.setAttribute('readonly', true);
//                        td_1.textContent = pmt['cost_item_name'];
//                        td_1.appendChild(td_1_input);
//
//                        // Номер платежа
//                        td_2 = td[2];
//                        td_2.dataset.sort = pmt['payment_id'];
//                        td_2.textContent = pmt['payment_number'];
//                        td_2.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//
//                        // Наименование платежей
//                        td_3 = td[3];
//                        td_3.dataset.sort = pmt['basis_of_payment'];
//                        td_3.setAttribute("title", pmt['basis_of_payment']);
//                        td_3.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//                        td_3.textContent = pmt['basis_of_payment'];
//                        td_3.addEventListener("click", function () {
//                            var bodyRef = document.getElementById('paid_history-table').getElementsByTagName('tbody')[0];
//                            bodyRef.innerHTML = ''
//                            var logDPage = document.getElementById('logDPage__content__text');
//                            logDPage.innerHTML = ''
//                            dialog.showModal();
//                        });
//
//                        // Описание
//                        td_4 = td[4];
//                        td_4.dataset.sort = `${pmt['basis_of_payment']}: ${pmt['payment_description']}`;
//                        td_4.setAttribute("title", pmt['payment_description']);
//                        td_4.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//                        td_4.textContent = '';
//                        var td_4_input = document.createElement("input");
//                        td_4_input.name = "contractor_id";
//                        td_4_input.value = pmt['contractor_id'];
//                        td_4_input.setAttribute('hidden', 'hidden');
//                        td_4_input.setAttribute('readonly', true);
//                        var td_4_span = document.createElement("span");
//                        td_4_span.classList.add("paymentFormBold");
//                        td_4_span.textContent = `${pmt['contractor_name']}: `;
//                        var td_4_textContent = document.createTextNode(pmt['payment_description']);
//                        td_4.appendChild(td_4_input);
//                        td_4.appendChild(td_4_span);
//                        td_4.appendChild(td_4_textContent);
//
//                        // Объект
//                        td_5 = td[5];
//                        td_5.dataset.sort = pmt['object_name'];
//                        td_5.textContent = pmt['object_name'];
//                        td_5.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//
//                        // Ответственный
//                        td_6 = td[6];
//                        td_6.dataset.sort = `${pmt['last_name']} ${pmt['first_name']}`;
//                        td_6.textContent = `${pmt['last_name']} ${pmt['first_name'][0]}.`;
//                        td_6.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//
//                        // Контрагент
//                        td_7 = td[7];
//                        td_7.dataset.sort = pmt['partner'];
//                        td_7.textContent = pmt['partner'];
//                        td_7.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//
//                        // Общая сумма
//                        td_8 = td[8];
//                        td_8.dataset.sort = pmt['payment_sum'];
//                        td_8.textContent = pmt['payment_sum_rub'];
//                        td_8.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//
//                        // Оплачено
//                        td_9 = td[9];
//                        td_9.dataset.sort = pmt['paid_sum'];
//                        td_9.textContent = pmt['paid_sum_rub'];
//                        td_9.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//
//                        // Согласованная сумма
//                        td_10 = td[10];
//                        td_10.dataset.sort = pmt['approval_sum'];
//                        td_10.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//                        var td_10_input = document.createElement("input");
//                        td_10_input.type = "text";
//                        td_10_input.id = `approvalSum-${numRow}`;
//                        td_10_input.name = "approval_sum";
//                        td_10_input.value = pmt['approval_sum'];
//                        td_10_input.setAttribute('hidden', 'hidden');
//                        td_10_input.setAttribute('readonly', true);
//                        td_10.textContent = pmt['approval_sum_rub'];
//                        td_10.appendChild(td_10_input);
//
//                        // Сумма к оплате
//                        td_11 = td[11];
//                        td_11.dataset.sort = pmt['amount'];
//                        td_11.textContent = ''
//                        var td_11_input = document.createElement("input");
//                        td_11_input.type = "text";
//                        td_11_input.id = `amount-${numRow}`;
//                        td_11_input.name = "amount";
//                        td_11_input.value = pmt['amount_rub'];
//                        td_11_input.dataset.amount = 0;
//                        td_11_input.setAttribute("onchange", `paymentApprovalRecalcCards(${numRow}), saveData(${numRow}, '${data.page}'), refreshSortValChb(${numRow})`)
//                        td_11.appendChild(td_11_input);
//
//                        // Срок оплаты
//                        td_12 = td[12];
//                        td_12.dataset.sort = pmt['payment_due_date'];
//                        td_12.textContent = pmt['payment_due_date_txt'];
//                        td_12.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//
//                        // Дата создания
//                        td_13 = td[13];
//                        td_13.dataset.sort = pmt['payment_at'];
//                        td_13.textContent = pmt['payment_at_txt'];
//                        td_13.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
//
//                        // До полной оплаты
//                        td_14 = td[14];
//                        td_14_input = td_14.getElementsByTagName('input')[0];
//                        pmt['payment_full_agreed_status']? td_14.dataset.sort=1:td_14.dataset.sort='0';
//                        td_14_input.id = `paymentFullStatus-${numRow}`;
//                        td_14_input.value  = numRow;
//                        td_14_input.setAttribute("onchange", `saveData(${numRow}, '${data.page}'), tabColorize(${numRow}), refreshSortValChb(${numRow})`);
//                        td_14_input.checked = pmt['payment_full_agreed_status'];
//
//                        tab_tr0.appendChild(newRow);
//
//                        const scrollPercentage = ((rowCount) / data.tab_rows) * 100;
//                        const progressBar = document.querySelector('.progress');
//                        progressBar.style.width = scrollPercentage + '%';
//
//                        tabColorize(numRow);
//                    }
//                    return
//                }
//                else if (data.status === 'error') {
//                    alert(data.description)
//                }
//                else {
//                    window.location.href = '/payment-pay';
//                }
//        })
//        .catch(error => {
//        console.error('Error:', error);
//    });
//    }
//}

function paymentPay2(sortCol_1) {
    var sortCol_1_val = document.getElementById('sortCol-1_val').textContent
    var sortCol_2 = document.getElementById('sortCol-2').textContent
    var sortCol_2_val = document.getElementById('sortCol-2_val').textContent
    var sortCol_id = document.getElementById('sortCol-id').textContent
    var sortCol_id_val = document.getElementById('sortCol-id_val').textContent

    var filter_input = document.querySelectorAll('[id*="filter-input-"]');
    var filterValsList = []; // Значения фильтров

    for (var i=0; i<filter_input.length; i++) {
        if (filter_input[i].value) {
            filterValsList.push([i, filter_input[i].value]);
        }
    }

    // Получили пустые данные - загрузили всю таблицу - ничего не делаем
    if (!sortCol_1) {
        return
    }
    else {

        fetch('/get-paymentPay-pagination', {
            "headers": {
                'Content-Type': 'application/json'
            },
            "method": "POST",
            "body": JSON.stringify({
                'limit': limit,
                'sort_col_1': sortCol_1,
                'sort_col_1_val': sortCol_1_val,
                'sort_col_2': sortCol_2,
                'sort_col_2_val': sortCol_2_val,
                'sort_col_id': sortCol_2,
                'sort_col_id_val': sortCol_2_val,
                'filterValsList': filterValsList
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    if (!data.payment) {return}
                    document.getElementById('sortCol-1').textContent = data.sort_col['col_1'][0]
                    document.getElementById('sortCol-1_val').textContent = data.sort_col['col_1'][1]
                    document.getElementById('sortCol-2').textContent = data.sort_col['col_2'][0]
                    document.getElementById('sortCol-2_val').textContent = data.sort_col['col_2'][1]
                    document.getElementById('sortCol-id').textContent = data.sort_col['col_id'][0]
                    document.getElementById('sortCol-id_val').textContent = data.sort_col['col_id'][1]

                    const tab = document.getElementById("payment-table");
                    var tab_tr = tab.getElementsByTagName('tbody')[0];
                    var tab_numRow = tab.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

//                    for (pmt of data.payment) {
                    try {
                        var numRow = parseInt(tab_numRow[tab_numRow.length-1].getElementsByTagName('td')[0].getElementsByTagName('input')[0].value)
                    }
                    catch {
                        var numRow = 0
                    }

                    var tab_tr0 = tab.getElementsByTagName('tbody')[0];

                    for (pmt of data.payment) {

                        numRow++;
                        // Вставляем ниже новую ячейку, копируя предыдущую
                        var table2 = document.getElementById("payment-table");
                        var rowCount = table2.rows.length;
                        var lastRow = table2.rows[rowCount - 1];

                        var row = tab_tr0.insertRow(numRow-1);

                        //////////////////////////////////////////
                        // Меняем данные в ячейке
                        //////////////////////////////////////////
                        // id
                        row.id = `row-${numRow}`;

                        //**************************************************
                        // Флажок выбора
                        var cellCheckbox = row.insertCell(0);
                        cellCheckbox.className = "th_select_i";
                        cellCheckbox.setAttribute("data-sort", "0");
                        data.setting_users.hasOwnProperty('0') ? cellCheckbox.hidden = true: 0;
                        var checkbox = document.createElement('input');
                        checkbox.type = "checkbox";
                        checkbox.id = `selectedRows-${numRow}`;
                        checkbox.name = "selectedRows";
                        checkbox.value = numRow;
                        checkbox.setAttribute("onchange", `paymentApprovalRecalcCards(${numRow}), paymentApprovalNoSelect(${numRow}), refreshSortValChb(${numRow})`)
                        cellCheckbox.appendChild(checkbox);

                        //**************************************************
                        // Статья затрат
                        var cellCostItemName = row.insertCell(1);
                        cellCostItemName.className = "th_category_i";
                        cellCostItemName.id = `category-${numRow}`;
                        cellCostItemName.setAttribute("data-sort", pmt['cost_item_name']);
                        cellCostItemName.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('1') ? cellCostItemName.hidden = true: 0;
                        cellCostItemName.innerHTML = pmt['cost_item_name'];
                        var input = document.createElement('input');
                        input.id = `paymentNumber-${numRow}`;
                        input.name = 'payment_number';
                        input.value = pmt['payment_id'];
                        input.hidden = true;
                        input.readOnly = true;
                        cellCostItemName.appendChild(input);

                        //**************************************************
                        // Номер платежа
                        var cellPayNumber = row.insertCell(2);
                        cellPayNumber.className = "th_payment_number_i"
                        cellPayNumber.setAttribute("data-sort", pmt['payment_id']);
                        cellPayNumber.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('2') ? cellPayNumber.hidden = true: 0;
                        cellPayNumber.innerHTML = pmt['payment_number'];

                        //**************************************************
                        // Наименование платежа
                        var cellPayName = row.insertCell(3);
                        cellPayName.className = "th_name_i"
                        cellPayName.setAttribute("data-sort", pmt['basis_of_payment']);
                        cellPayName.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        cellPayName.title = `${pmt['basis_of_payment']}`;
                        data.setting_users.hasOwnProperty('3') ? cellPayName.hidden = true: 0;
                        cellPayName.innerHTML = pmt['basis_of_payment'];

                        //**************************************************
                        // Описание
                        var cellPayName = row.insertCell(4);
                        cellPayName.className = "th_description_i";
                        cellPayName.setAttribute("data-sort", `${pmt['contractor_name']}: ${pmt['payment_description']}`);
                        cellPayName.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        cellPayName.title = `${pmt['payment_description']}`;
                        data.setting_users.hasOwnProperty('4') ? cellPayName.hidden = true: 0;
                        var spanBold = document.createElement('span');
                        spanBold.className = "paymentFormBold";
                        spanBold.innerHTML = pmt['contractor_name'] + ": ";
                        var textNode = document.createTextNode(pmt['payment_description']);
                        var input = document.createElement('input');
                        input.name = 'contractor_id';
                        input.value = pmt['contractor_id'];
                        input.hidden = true;
                        input.readOnly = true;
                        cellPayName.appendChild(input);

                        cellPayName.appendChild(spanBold);
                        cellPayName.appendChild(textNode);

                        //**************************************************
                        // Объект
                        var cellObject = row.insertCell(5);
                        cellObject.className = "th_object_i"
                        cellObject.setAttribute("data-sort", pmt['object_name']);
                        cellObject.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('5') ? cellObject.hidden = true: 0;
                        cellObject.innerHTML = pmt['object_name'];

                        //**************************************************
                        // Ответственный
                        var cellResponsible = row.insertCell(6);
                        cellResponsible.className = "th_responsible_i"
                        cellResponsible.setAttribute("data-sort", `${pmt['last_name']} ${pmt['first_name']}`);
                        cellResponsible.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('6') ? cellResponsible.hidden = true: 0;
                        cellResponsible.innerHTML = `${pmt['last_name']} ${pmt['first_name'][0]}`;

                        //**************************************************
                        // Контрагент
                        var cellContractor = row.insertCell(7);
                        cellContractor.className = "th_contractor_i"
                        cellContractor.setAttribute("data-sort", pmt['partner']);
                        cellContractor.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('7') ? cellContractor.hidden = true: 0;
                        cellContractor.innerHTML = pmt['partner'];

                        //**************************************************
                        // Общая сумма
                        var cellSumPay = row.insertCell(8);
                        cellSumPay.className = "th_main_sum_i"
                        cellSumPay.setAttribute("data-sort", pmt['payment_sum']);
                        cellSumPay.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('8') ? cellSumPay.hidden = true: 0;
                        cellSumPay.innerHTML = pmt['payment_sum_rub'];

                        //**************************************************
                        // Оплаченная сумма
                        var cellSumPaid = row.insertCell(9);
                        cellSumPaid.className = "th_paid_sum_i"
                        cellSumPaid.setAttribute("data-sort", pmt['paid_sum']);
                        cellSumPaid.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('9') ? cellSumPaid.hidden = true: 0;
                        cellSumPaid.innerHTML = pmt['paid_sum_rub'];

                        //**************************************************
                        // Согласованная сумма
                        var cellSumAgreed = row.insertCell(10);
                        cellSumAgreed.className = "th_sum_remain_i";
                        cellSumAgreed.setAttribute("data-sort", pmt['approval_sum']);
                        cellSumAgreed.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('10') ? cellSumAgreed.hidden = true: 0;
                        var input = document.createElement('input');
                        input.id = `approvalSum-${numRow}`;
                        input.name = 'approval_sum';
                        input.value = pmt['approval_sum'];
                        input.hidden = true;
                        input.readOnly = true;
                        cellSumAgreed.innerHTML = pmt['approval_sum_rub'];
                        cellSumAgreed.appendChild(input);

                        //**************************************************
                        // Сумма к оплате
                        var cellSumCurrent = row.insertCell(11);
                        cellSumCurrent.className = "th_sum_agreed";
                        cellSumCurrent.setAttribute("data-sort", pmt['amount']);
                        data.setting_users.hasOwnProperty('11') ? cellSumCurrent.hidden = true: 0;
                        var inputAmount = document.createElement('input');
                        inputAmount.id = `amount-${numRow}`;
                        inputAmount.name = "amount";
                        inputAmount.value = pmt['amount_rub'];
                        inputAmount.setAttribute("onchange", `paymentApprovalRecalcCards(${numRow}), saveData(${numRow}, '${data.page}')`)
                        cellSumCurrent.appendChild(inputAmount);

                        //**************************************************
                        // Срок оплаты
                        var cellPayDate = row.insertCell(12);
                        cellPayDate.className = "th_date_create_i";
                        cellPayDate.setAttribute("data-sort", pmt['payment_due_date']);
                        cellPayDate.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        data.setting_users.hasOwnProperty('12') ? cellPayDate.hidden = true: 0;
                        cellPayDate.innerHTML = pmt['payment_due_date_txt'];

                        //**************************************************
                        // Дата создания
                        var cellDateCreate = row.insertCell(13);
                        cellDateCreate.className = "th_date_create_i";
                        cellDateCreate.setAttribute("data-sort", pmt['payment_at']);
                        data.setting_users.hasOwnProperty('13') ? cellDateCreate.hidden = true: 0;
                        cellDateCreate.innerHTML = pmt['payment_at_txt'];

                        //**************************************************
                        // До полной оплаты
                        var cellSavePay = row.insertCell(14);
                        cellSavePay.className = "th_save_pay_i";
                        cellSavePay.setAttribute("data-sort", pmt['payment_full_agreed_status'] ? "1" : "0");
                        data.setting_users.hasOwnProperty('14') ? cellSavePay.hidden = true: 0;
                        var checkboxPaymentFullStatus = document.createElement('input');
                        checkboxPaymentFullStatus.type = "checkbox";
                        checkboxPaymentFullStatus.id = `paymentFullStatus-${numRow}`;
                        checkboxPaymentFullStatus.name = "payment_full_agreed_status";
                        checkboxPaymentFullStatus.value = numRow;
                        if (pmt['payment_full_agreed_status']) {
                            checkboxPaymentFullStatus.checked = true;
                        }
                        checkboxPaymentFullStatus.setAttribute("onchange", `saveData(${numRow}, '${data.page}'), tabColorize(${numRow}), refreshSortValChb(${numRow})`);
                        cellSavePay.appendChild(checkboxPaymentFullStatus);

                        const scrollPercentage = ((rowCount) / data.tab_rows) * 100;
                        const progressBar = document.querySelector('.progress');
                        progressBar.style.width = scrollPercentage + '%';

                        tabColorize(numRow);
                    }
                    return
                }
                else if (data.status === 'error') {
                    alert(data.description)
                }
                else {
                    window.location.href = '/payment-pay';
                }
        })
        .catch(error => {
        console.error('Error:', error);
    });
    }
}

function paymentList2(sortCol_1) {

    var sortCol_1_val = document.getElementById('sortCol-1_val').textContent;
    var sortCol_2 = document.getElementById('sortCol-2').textContent;
    var sortCol_2_val = document.getElementById('sortCol-2_val').textContent;
    var sortCol_id = document.getElementById('sortCol-id').textContent;
    var sortCol_id_val = document.getElementById('sortCol-id_val').textContent;
//    console.log('   paymentList2')

    var filter_input = document.querySelectorAll('[id*="filter-input-"]');
    var filterValsList = []; // Значения фильтров

    var fetchFunc = ''; // Название вызываемой функции в fetch
    var col_shift = 0; // Сдвиг колонок
    var col_shift2 = 0; // Сдвиг колонок
    var page_url = document.URL.substring(document.URL.lastIndexOf('/')+1);

    if (page_url == 'payment-list') {
        fetchFunc = '/get-paymentList-pagination';
    }
    else if (page_url == 'payment-approval-list') {
        fetchFunc = '/get-paymentApprovalList-pagination';
        col_shift = 1;
    }
    else if (page_url == 'payment-paid-list') {
        fetchFunc = '/get-paymentPaidList-pagination';
        col_shift = 1;
        col_shift2 = 1;
    }

    for (var i=0; i<filter_input.length; i++) {
        if (filter_input[i].value) {
            filterValsList.push([i, filter_input[i].value]);
        }
    }

    // Получили пустые данные - загрузили всю таблицу - ничего не делаем
    if (!sortCol_1) {
        return
    }
    else {

        fetch(fetchFunc, {
            "headers": {
                'Content-Type': 'application/json'
            },
            "method": "POST",
            "body": JSON.stringify({
                'limit': limit,
                'sort_col_1': sortCol_1,
                'sort_col_1_val': sortCol_1_val,
                'sort_col_2': sortCol_2,
                'sort_col_2_val': sortCol_2_val,
                'sort_col_id': sortCol_2,
                'sort_col_id_val': sortCol_2_val,
                'filterValsList': filterValsList,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    if (!data.payment) {return}
                    document.getElementById('sortCol-1').textContent = data.sort_col['col_1'][0]
                    document.getElementById('sortCol-1_val').textContent = data.sort_col['col_1'][1]
                    document.getElementById('sortCol-2').textContent = data.sort_col['col_2'][0]
                    document.getElementById('sortCol-2_val').textContent = data.sort_col['col_2'][1]
                    document.getElementById('sortCol-id').textContent = data.sort_col['col_id'][0]
                    document.getElementById('sortCol-id_val').textContent = data.sort_col['col_id'][1]

                    const tab = document.getElementById("payment-table");
                    var tab_tr = tab.getElementsByTagName('tbody')[0];
                    var tab_numRow = tab.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

                    try {
                        if (page_url == 'payment-list') {
                            var numRow = tab_numRow.length;
                        }
                        else if (page_url == 'payment-approval-list') {
                            var numRow = tab_numRow.length-1
                        }
                        else if (page_url == 'payment-paid-list') {
                            var numRow = parseInt(tab_numRow[tab_numRow.length-1].getElementsByTagName('td')[0].innerHTML)
                        }
//                        console.log(numRow, tab_numRow.length-1, tab_numRow[tab_numRow.length-1].getElementsByTagName('td')[0].innerHTML)
//                        var numRow = parseInt(tab_numRow[tab_numRow.length-1].getElementsByTagName('td')[0].getElementsByTagName('input')[0].value)

                    }
                    catch {
                        var numRow = 0
//                        console.log(numRow)
                    }



                    var tab_tr0 = tab.getElementsByTagName('tbody')[0]

                    for (pmt of data.payment) {

                        numRow++;
                        // Вставляем ниже новую ячейку, копируя предыдущую
                        var table2 = document.getElementById("payment-table");
                        var rowCount = table2.rows.length;
                        var lastRow = table2.rows[rowCount - 1];

                        var row = tab_tr0.insertRow(numRow-1);

                        //////////////////////////////////////////
                        // Меняем данные в ячейке
                        //////////////////////////////////////////
                        // id
                        row.id = `row-${numRow}`;

                        //**************************************************
                        // Номер строки
                        if (page_url == 'payment-paid-list') {
                            var cellNumber = row.insertCell(0);
                            cellNumber.className = "th_nnumber_i";
                            cellNumber.setAttribute("data-sort", numRow);
                            data.setting_users.hasOwnProperty('0') ? cellNumber.hidden = true: 0;
                            cellNumber.innerHTML = numRow;
                        }

                        //**************************************************
                        // Номер платежа
                        var i = 0+col_shift2
                        var cellPayNumber = row.insertCell(i);
                        cellPayNumber.className = "th_payment_number"
                        cellPayNumber.setAttribute("data-sort", pmt['payment_id']);
                        data.setting_users.hasOwnProperty(i) ? cellPayNumber.hidden = true: 0;
                        cellPayNumber.setAttribute("onclick", `getModal(${pmt['payment_id']})`);
                        cellPayNumber.innerHTML = pmt['payment_number'];

                        //**************************************************
                        // Статья затрат
                        var i = 1+col_shift2
                        var cellCostItemName = row.insertCell(i);
                        cellCostItemName.className = "th_category_i"
                        cellCostItemName.setAttribute("data-sort", pmt['cost_item_name']);
                        data.setting_users.hasOwnProperty(i) ? cellCostItemName.hidden = true: 0;
                        cellCostItemName.innerHTML = pmt['cost_item_name'];

                        //**************************************************
                        // Наименование платежа
                        var i = 2+col_shift2
                        var cellCostItemName = row.insertCell(i);
                        cellCostItemName.className = "th_name_i"
                        cellCostItemName.setAttribute("data-sort", pmt['basis_of_payment']);
                        cellCostItemName.title = `${pmt['basis_of_payment']}`;
                        data.setting_users.hasOwnProperty(i) ? cellCostItemName.hidden = true: 0;
                        cellCostItemName.innerHTML = pmt['basis_of_payment_short'];

                        //**************************************************
                        // Описание
                        var i = 3+col_shift2
                        var cellPayName = row.insertCell(i);
                        cellPayName.className = "th_description_i";
                        cellPayName.setAttribute("data-sort", `${pmt['contractor_name']}: ${pmt['payment_description_short']}`);
                        cellPayName.title = `${pmt['payment_description']}`;
                        data.setting_users.hasOwnProperty(i) ? cellPayName.hidden = true: 0;
                        var spanBold = document.createElement('span');
                        spanBold.className = "paymentFormBold";
                        spanBold.innerHTML = pmt['contractor_name'] + ": ";
                        var textNode = document.createTextNode(pmt['payment_description_short']);
                        cellPayName.appendChild(spanBold);
                        cellPayName.appendChild(textNode);

                        //**************************************************
                        // Объект
                        var i = 4+col_shift2
                        var cellObject = row.insertCell(i);
                        cellObject.className = "th_object_i"
                        cellObject.setAttribute("data-sort", pmt['object_name']);
                        data.setting_users.hasOwnProperty(i) ? cellObject.hidden = true: 0;
                        cellObject.innerHTML = pmt['object_name'];

                        //**************************************************
                        // Ответственный
                        var i = 5+col_shift2
                        var cellResponsible = row.insertCell(i);
                        cellResponsible.className = "th_responsible_i"
                        cellResponsible.setAttribute("data-sort", `${pmt['last_name']} ${pmt['first_name']}`);
                        data.setting_users.hasOwnProperty(i) ? cellResponsible.hidden = true: 0;
                        cellResponsible.innerHTML = `${pmt['last_name']} ${pmt['first_name'][0]}`;

                        //**************************************************
                        // Контрагент
                        var i = 6+col_shift2
                        var cellContractor = row.insertCell(i);
                        cellContractor.className = "th_contractor_i"
                        cellContractor.setAttribute("data-sort", pmt['partner']);
                        data.setting_users.hasOwnProperty(i) ? cellContractor.hidden = true: 0;
                        cellContractor.innerHTML = pmt['partner'];

                        //**************************************************
                        // Общая сумма
                        var i = 7+col_shift2
                        var cellSumPay = row.insertCell(i);
                        cellSumPay.className = "th_main_sum_i"
                        cellSumPay.setAttribute("data-sort", pmt['payment_sum']);
                        data.setting_users.hasOwnProperty(i) ? cellSumPay.hidden = true: 0;
                        cellSumPay.innerHTML = pmt['payment_sum_rub'];

                        //**************************************************
                        // Согласованная сумма
                        if (page_url == 'payment-approval-list' || page_url == 'payment-paid-list') {
                            var i = 7+col_shift+col_shift2
                            var cellSumRemain = row.insertCell(i);
                            cellSumRemain.className = "th_sum_remain_i"
                            cellSumRemain.setAttribute("data-sort", pmt['approval_sum']);
                            data.setting_users.hasOwnProperty(i) ? cellSumRemain.hidden = true: 0;
                            cellSumRemain.innerHTML = pmt['approval_sum_rub'];
                        }

                        //**************************************************
                        // Оплаченная сумма
                        var i = 8+col_shift+col_shift2
                        var cellSumPaid = row.insertCell(i);
                        cellSumPaid.className = "th_sum_remain_i"
                        cellSumPaid.setAttribute("data-sort", pmt['paid_sum']);
                        data.setting_users.hasOwnProperty(i) ? cellSumPaid.hidden = true: 0;
                        cellSumPaid.innerHTML = pmt['paid_sum_rub'];

                        //**************************************************
                        // Срок оплаты
                        var i = 9+col_shift+col_shift2
                        var cellDueDate = row.insertCell(i);
                        cellDueDate.className = "th_pay_date_i"
                        cellDueDate.setAttribute("data-sort", pmt['payment_due_date']);
                        data.setting_users.hasOwnProperty(i) ? cellDueDate.hidden = true: 0;
                        cellDueDate.innerHTML = pmt['payment_due_date_txt'];

                        //**************************************************
                        // Дата создания
                        var i = 10+col_shift+col_shift2
                        var cellAT = row.insertCell(i);
                        cellAT.className = "th_date_create_i"
                        cellAT.setAttribute("data-sort", pmt['payment_at']);
                        data.setting_users.hasOwnProperty(i) ? cellAT.hidden = true: 0;
                        cellAT.innerHTML = pmt['payment_at_txt'];

                        //**************************************************
                        // Дата согласования
                        if (page_url === 'payment-approval-list') {
                            var i = 11+col_shift+col_shift2
                            var cellSumRemain = row.insertCell(i);
                            cellSumRemain.className = "th_date_create_i"
                            cellSumRemain.setAttribute("data-sort", pmt['create_at']);
                            data.setting_users.hasOwnProperty(i) ? cellSumRemain.hidden = true: 0;
                            cellSumRemain.innerHTML = pmt['create_at_txt'];
                        }

                        //**************************************************
                        // Статус последней оплаты
                        if (page_url == 'payment-paid-list') {
                            var i = 11+col_shift+col_shift2
                            var cellLastPaymentStatus = row.insertCell(i);
                            cellLastPaymentStatus.className = "th_object_i";
                            cellLastPaymentStatus.setAttribute("data-sort", pmt['status_name']);
                            data.setting_users.hasOwnProperty(i) ? cellLastPaymentStatus.hidden = true: 0;
                            cellLastPaymentStatus.innerHTML = pmt['status_name'];
                        }

                        const scrollPercentage = ((rowCount) / data.tab_rows) * 100;
                        const progressBar = document.querySelector('.progress');
                        progressBar.style.width = scrollPercentage + '%';

                    }
                    return
                }
                else if (data.status === 'error') {
                    alert(data.description)
                }
                else {
                    window.location.href = `/${page_url}`;
                }
        })
        .catch(error => {
        console.error('Error:', error);
    });
    }
};

    function paymentList(sortCol_1) {
//        var limit = 2; // Number of contracts to load per request

        var sortCol_1_val = document.getElementById('sortCol-1_val').textContent
        var sortCol_2 = document.getElementById('sortCol-2').textContent
        var sortCol_2_val = document.getElementById('sortCol-2_val').textContent
        var sortCol_id = document.getElementById('sortCol-id').textContent
        var sortCol_id_val = document.getElementById('sortCol-id_val').textContent
        var fetchFunc = ''; // Название вызываемой функции в fetch
        var col_shift = 0; // Сдвиг колонок
        var col_shift2 = 0; // Сдвиг колонок
        var page_url = document.URL.substring(document.URL.lastIndexOf('/')+1);

        if (page_url == 'payment-list') {
            fetchFunc = '/get-paymentList-pagination';
        }
        else if (page_url == 'payment-approval-list') {
            fetchFunc = '/get-paymentApprovalList-pagination';
            col_shift = 1;
        }
        else if (page_url == 'payment-paid-list') {
            fetchFunc = '/get-paymentPaidList-pagination';
            col_shift = 1;
            col_shift2 = 1;
        }

        // Получили пустые данные - загрузили всю таблицу - ничего не делаем
        if (!sortCol_1) {
            return
        }
        else {

            fetch(fetchFunc, {
                "headers": {
                    'Content-Type': 'application/json'
                },
                "method": "POST",
                "body": JSON.stringify({
                    'limit': limit,
                    'sort_col_1': sortCol_1,
                    'sort_col_1_val': sortCol_1_val,
                    'sort_col_2': sortCol_2,
                    'sort_col_2_val': sortCol_2_val,
                    'sort_col_id': sortCol_2,
                    'sort_col_id_val': sortCol_2_val,
                    'filterValsList': filterValsList,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        if (!data.payment) {return}
                        document.getElementById('sortCol-1').textContent = data.sort_col['col_1'][0]
                        document.getElementById('sortCol-1_val').textContent = data.sort_col['col_1'][1]
                        document.getElementById('sortCol-2').textContent = data.sort_col['col_2'][0]
                        document.getElementById('sortCol-2_val').textContent = data.sort_col['col_2'][1]
                        document.getElementById('sortCol-id').textContent = data.sort_col['col_id'][0]
                        document.getElementById('sortCol-id_val').textContent = data.sort_col['col_id'][1]

                        const tab = document.getElementById("payment-table");
                        var tab_tr = tab.getElementsByTagName('tbody')[0];
                        var tab_numRow = tab.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                        var numRow = parseInt(tab_numRow[tab_numRow.length-1].dataset.sort)

                        var tab_tr0 = tab.getElementsByTagName('tbody')[0]

                        for (pmt of data.payment) {

                            numRow++;
                            // Вставляем ниже новую ячейку, копируя предыдущую
                            var table2 = document.getElementById("payment-table");
                            var rowCount = table2.rows.length;
                            var lastRow = table2.rows[rowCount - 1];
                            var newRow = lastRow.cloneNode(true);

                            var td = newRow.getElementsByTagName('td'); // Ячейки новой строки

                            //////////////////////////////////////////
                            // Меняем данные в ячейке
                            //////////////////////////////////////////
                            // id
                            newRow.id = `row-${numRow}`;
                            newRow.dataset.sort = numRow;

                            if (page_url == 'payment-paid-list') {
                                // Согласованная сумма
                                td_column_shift1 = td[0];
                                td_column_shift1.dataset.sort = numRow;
                                td_column_shift1.textContent = numRow;
                            }

                            // Номер платежа
                            td_0 = td[0+col_shift2];
                            td_0.dataset.sort = pmt['payment_id'];
                            td_0.textContent = pmt['payment_number'];

                            if (page_url == 'payment-approval-list') {
                                td_0.setAttribute("onclick", `getModal(${pmt['payment_id']})`);

                                td_0.addEventListener("click", function () {
                                    var bodyRef = document.getElementById('paid_history-table').getElementsByTagName('tbody')[0];
                                    bodyRef.innerHTML = ''
                                    var logDPage = document.getElementById('logDPage__content__text');
                                    logDPage.innerHTML = ''
                                    dialog.showModal();
                                });

                            }

                            // Статья затрат
                            td_1 = td[1+col_shift2];
                            td_1.dataset.sort = pmt['cost_item_name'];
                            td_1.textContent = pmt['cost_item_name'];

                            // Наименование платежа
                            td_2 = td[2+col_shift2];
                            td_2.dataset.sort = pmt['basis_of_payment'];
                            td_2.setAttribute("title", pmt['basis_of_payment']);
                            td_2.textContent = pmt['basis_of_payment_short'];

                            // Описание
                            td_3 = td[3+col_shift2];
                            td_3.dataset.sort = `${pmt['basis_of_payment']}: ${pmt['payment_description']}`;
                            td_3.setAttribute("title", pmt['payment_description']);
                            td_3.textContent = '';
                            var td_3_span = document.createElement("span");
                            td_3_span.classList.add("paymentFormBold");
                            td_3_span.textContent = `${pmt['contractor_name']}: `;
                            var td_3_textContent = document.createTextNode(pmt['payment_description_short']);
                            td_3.appendChild(td_3_span);
                            td_3.appendChild(td_3_textContent);

                            // Объект
                            td_4 = td[4+col_shift2];
                            td_4.dataset.sort = pmt['object_name'];
                            td_4.textContent = pmt['object_name'];

                            // Ответственный
                            td_5 = td[5+col_shift2];
                            td_5.dataset.sort = `${pmt['last_name']} ${pmt['first_name']}`;
                            td_5.textContent = `${pmt['last_name']} ${pmt['first_name'][0]}.`;

                            // Контрагент
                            td_6 = td[6+col_shift2];
                            td_6.dataset.sort = pmt['partner'];
                            td_6.textContent = pmt['partner'];

                            // Общая сумма
                            td_7 = td[7+col_shift2];
                            td_7.dataset.sort = pmt['payment_sum'];
                            td_7.textContent = pmt['payment_sum_rub'];

                            if (page_url == 'payment-approval-list' || page_url == 'payment-paid-list') {
                                // Согласованная сумма
                                td_column_shift1 = td[7+col_shift+col_shift2];
                                td_column_shift1.dataset.sort = pmt['approval_sum'];
                                td_column_shift1.textContent = pmt['approval_sum_rub'];
                            }

                            // Оплаченная сумма
                            td_8 = td[8+col_shift+col_shift2];
                            td_8.dataset.sort = pmt['paid_sum'];
                            td_8.textContent = pmt['paid_sum_rub'];

                            // Срок оплаты
                            td_9 = td[9+col_shift+col_shift2];
                            td_9.dataset.sort = pmt['payment_due_date'];
                            td_9.textContent = pmt['payment_due_date_txt'];

                            // Дата создания
                            td_10 = td[10+col_shift+col_shift2];
                            td_10.dataset.sort = pmt['payment_at'];
                            td_10.textContent = pmt['payment_at_txt'];

                            // Дата согласования
                            if (page_url === 'payment-approval-list') {
                                td_11 = td[11+col_shift+col_shift2];
                                td_11.dataset.sort = pmt['create_at'];
                                td_11.textContent = pmt['create_at_txt'];
                            }


                            tab_tr0.appendChild(newRow);

                            const scrollPercentage = ((rowCount) / data.tab_rows) * 100;
                            const progressBar = document.querySelector('.progress');
                            progressBar.style.width = scrollPercentage + '%';
                        }
                        return
                    }
                    else if (data.status === 'error') {
                        alert(data.description)
                    }
                    else {
                        window.location.href = '/payment-approval';
                    }
            })
            .catch(error => {
            console.error('Error:', error);
        });
        }
    }


