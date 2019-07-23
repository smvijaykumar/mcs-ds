
CsvToHtmlTable.init({
    csv_path: 'data/uv_geo_new.csv',
    element: 'table-container',
    allow_download: true,
    csv_options: {separator: ',', delimiter: ','},
    datatables_options: {"paging": false}
});
