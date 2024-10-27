const data = require("../data.json");

function getAll(req, res) {
    console.log(data.length);
    const searchText = req.query.search;
    if (searchText) {
        console.log(searchText)
        const filteredData = data.filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()) || item.description.toLowerCase().includes(searchText.toLowerCase()) || item.price === searchText)
        res.json(filteredData)
    } else {
        res.json(data);
    }
    return;
}

function getTransactionByMonth(req, res) {
    const { month } = req.params
    const months = {
        0: "january",
        1: "february",
        2: "march",
        3: "april",
        4: "may",
        5: "june",
        6: "july",
        7: "august",
        8: "september",
        9: "october",
        10: "november",
        11: "december"
    };
    const filteredData = data.filter(item => {
        const monthNumber = new Date(item.dateOfSale.split("T")[0]).getMonth();
        if (month.toLowerCase() === months[monthNumber]) {
            return item
        }
    })
    let totalSaleAmount = 0;
    filteredData.forEach(item => totalSaleAmount+=item.price)
    res.json({
        "totalSaleAmount": totalSaleAmount,
        "totalSoldItems": filteredData.filter(item => item.sold === true).length,
        "totalUnsoldItems": filteredData.filter(item => item.sold === false).length
    });
    // res.json(filteredData)
    // console.log(filteredData)
}

module.exports = { getAll, getTransactionByMonth }