function filterTable() {
//    var filter_input = document.querySelectorAll('[id*="filter-input-"]');
//    var filterValsList = []; // Значения фильтров
//    var filterCol = []; // Список фильтруемых столбцов
//
//    for (var i=0; i<filter_input.length; i++) {
//        filterValsList.push(filter_input[i].value.toUpperCase());
//        filter_input[i].value? filterCol.push(i): 1;
//    }
    var table = document.getElementById("payment-table");
    for (var i = 1; i<table.rows.length;) {
        table.deleteRow(i);
    }
    row_0 = table.getElementsByTagName("tr")[0];
    var col_cnt = row_0.getElementsByTagName("th").length
    for (var i = 0; i < col_cnt; i++) {
        row_0.getElementsByTagName("th")[i].getElementsByClassName("arrow_sort")[0].innerText = ''
    }
    var page_url = document.URL.substring(document.URL.lastIndexOf('/')+1);
    if (page_url === 'payment-approval') {
        row_0.getElementsByTagName("th")[6].getElementsByClassName("arrow_sort")[0].innerText = '▲';
    }
    else if (page_url === 'payment-approval-list') {
        row_0.getElementsByTagName("th")[12].getElementsByClassName("arrow_sort")[0].innerText = '▼';
    }
    else if (page_url === 'payment-paid-list') {
        row_0.getElementsByTagName("th")[12].getElementsByClassName("arrow_sort")[0].innerText = '▼';
    }
    else if (page_url === 'payment-list') {
        row_0.getElementsByTagName("th")[10].getElementsByClassName("arrow_sort")[0].innerText = '▼';
    }
    else if (page_url === 'payment-pay') {
        row_0.getElementsByTagName("th")[13].getElementsByClassName("arrow_sort")[0].innerText = '▲';
    }

    fetch('/get-first-pay', {
                "headers": {
                    'Content-Type': 'application/json'
                },
                "method": "POST",
                "body": JSON.stringify({
                    'page_url': page_url,
                })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('sortCol-1').textContent = data.sort_col['col_1'][0]
                document.getElementById('sortCol-1_val').textContent = data.sort_col['col_1'][1]
                document.getElementById('sortCol-2').textContent = data.sort_col['col_2'][0]
                document.getElementById('sortCol-2_val').textContent = data.sort_col['col_2'][1]
                document.getElementById('sortCol-id').textContent = data.sort_col['col_id'][0]
                document.getElementById('sortCol-id_val').textContent = data.sort_col['col_id'][1]

                if (page_url === 'payment-approval') {
                    paymentApproval(data.sort_col['col_1'][0]);
                }
                else if (
                        page_url === 'payment-approval-list' ||
                        page_url === 'payment-paid-list' ||
                        page_url === 'payment-list') {
                    paymentList2(data.sort_col['col_1'][0]);
                }
                else if (
                        page_url === 'payment-pay') {
                    paymentPay2(data.sort_col['col_1'][0]);
                }

            }
        });

}

