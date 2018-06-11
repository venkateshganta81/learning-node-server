/**
 * script to convert string data to numbers in inventories collection
 */
db.inventories.find({}).forEach(function(data) {
    db.inventories.update({
        "_id": data._id
    }, {
        "$set": {
            "TicketAmount": parseFloat(data.TicketAmount),
            "CancellationAmount": parseFloat(data.CancellationAmount)
        }
    });
})

/**
 * Create index on inventories collection
 */

db.inventories.createIndex({"BookedDate":1,"PGType":1})

/**
 * Script to create aggregation of payment gateway collections by date
 */
db.pgDateAggregation.remove({})
db.inventories.aggregate([{$group: {_id: { PGType: "$PGType", BookedDate: "$BookedDate" },
        count: { $sum: 1 },TicketAmount: { $sum: "$TicketAmount" }}}])
        .forEach(function(data) {db.pgDateAggregation.insert(data)})