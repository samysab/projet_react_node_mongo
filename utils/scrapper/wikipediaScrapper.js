const Scrapper = require("./Scrapper");
const { JSDOM } = require("jsdom");

const scrap = new Scrapper(
    "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP",
    {
        method: "GET",
    },
    (result) => {
        const data = {};
        const dom = new JSDOM(result.result);
        const tables = dom.window.document.querySelectorAll("table.wikitable");
        tables.forEach((table) => {
            const rows = table.querySelectorAll("tr");
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].querySelectorAll("th, td");
                data[cells[0].textContent.trim()] = cells[1].textContent.trim();
            }
        });
        console.log(data);
    }
);

scrap.send();