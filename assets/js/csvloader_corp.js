function loadCSV(csvName) {
    // Deactivate all buttons and remove 'primary' class
    let buttons = document.querySelectorAll(".button");
    buttons.forEach(btn => {
        btn.classList.remove("primary");
    });

    // Activate the clicked button by adding 'primary' class
    document.querySelector(`button[data-csv='${csvName}']`).classList.add("primary");

    // Column renaming mapping
    const columnRename = {
        "OriginalCol1": "NewCol1",
        "OriginalCol2": "NewCol2",
        // ... add other column names you want to rename
    };

    fetch(csvName)
        .then(response => response.text())
        .then(data => {
            let rows = data.split('\n');
            let html = '<thead><tr>';

            // Header
            let headers = rows[0].split(',');
            headers.forEach(header => {
                let trimmedHeader = header.replace(/"/g, '').trim();
                let renamedHeader = columnRename[trimmedHeader] || trimmedHeader; // Rename if mapping exists
                html += `<th>${renamedHeader}</th>`;
            });

            html += '</tr></thead><tbody>';
          


            // Data
            for (let i = 1; i < rows.length; i++) {
                let cells = rows[i].split(',');
                if (cells.length === headers.length) {
                    html += '<tr>';
                    cells.forEach((cell, cellIndex) => {
                        let formattedCell = cell.replace(/"/g, '').trim();
                        if (cellIndex === 1) {
                            // formattedCell = parseFloat(formattedCell).toFixed(2);
                        } else if (cellIndex === 3) {
                            formattedCell = parseFloat(formattedCell).toFixed(3);
                        }

                        // If it's the last cell, create a button with the link instead
                        if (cellIndex === cells.length - 1) {
                            // html += `<td><button onclick="window.open('${formattedCell}', '_blank')">HL Link</button></td>`;
                            // html += `<td><button class="hl-link-button" onclick="window.open('${formattedCell}', '_blank')">HL Link</button></td>`;
                            // html += `<td><button class="hl-link-button desktop-only" onclick="window.open('${formattedCell}', '_blank')">HL Link</button><span class="hl-link-text mobile-only" onclick="window.open('${formattedCell}', '_blank')">Click Here</span></td>`;
                            html += `<td>${formattedCell}</td>`;
                        } else {
                            html += `<td>${formattedCell}</td>`;
                        }
                    });
                    html += '</tr>';
                }
            }

            html += '</tbody>';
            document.getElementById("csvTable").innerHTML = html;

            // Adjust mobile header content
            let tdElems = document.querySelectorAll("td");
            tdElems.forEach((td, index) => {
                let colIndex = index % headers.length;
                let originalHeader = headers[colIndex].replace(/"/g, '').trim();
                let renamedHeader = columnRename[originalHeader] || originalHeader; // Rename if mapping exists
                td.setAttribute('data-header', renamedHeader);
            });
        });
}

// Load the bonds1.csv by default on page load
window.onload = function() {
    loadCSV('data/corp_bonds_a.csv');
}
