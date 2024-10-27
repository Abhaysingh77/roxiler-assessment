const express = require("express");
const app = express();
const PORT = 8082;
const transactionRouter = require("./routes/transaction.routes");
const cors = require("cors")
app.use(cors())
app.use("/transaction", transactionRouter);

app.listen(PORT, ()=>{
    console.log("server is listening on port ", PORT);
})
