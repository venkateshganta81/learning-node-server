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
db.inventories.createIndex({"OperatorName":1})
db.inventories.createIndex({"TicketAmount":1})

/**
 * Script to create aggregation of payment gateway collections by date
 */
db.pgDateAggregation.remove({})
db.inventories.aggregate([{ $match: {TicketAmount:{$ne :0} } },
    {$group: {_id: { PGType: "$PGType", BookedDate: "$BookedDate" },
            count: { $sum: 1 },TicketAmount: { $sum: "$TicketAmount" }}},]).forEach(function(data) {db.pgDateAggregation.insert(data)})



db.operatorAggregation.remove({})

db.inventories.aggregate([{ $match: {TicketAmount:{$ne :0} } },
    {$group: {_id: { OperatorName: "$OperatorName", BookedDate: "$BookedDate" },
            count:{$sum:1 },TicketAmount: { $sum: "$TicketAmount"}}}])
    .forEach(function(data) {db.operatorAggregation.insert(data)})

/**
 *  Script for reshuffling the data for Operatornames
 */

db.inventories.find({"OperatorName":/.*201.*/}).forEach(function(data) {
    db.inventories.update({
        "_id": data._id
    }, {
        "$set": {
            "PNR":data.Source,
            "Source" : data.Destination,
            "Destination" : data.DOJ,
            "DOJ" : data.OperatorName,
            "OperatorName" : data.BusType,
            "BusType" : data.ServiceType,
            "ServiceType" : data.BoardingPoint,
            "BoardingPoint" : data.BoardingTime,
            "BoardingTime" : data.DroppingPoint,
            "DroppingPoint" : data.DroppingTime,
            "DroppingTime" : data.Email,
            "Email" : data.Mobile,
            "Mobile" : data.Age,
            "Age" : data.Gender,
            "Gender" : data.Insurance
        }
    });
})

db.routeWiseSalesTotal.remove({})

db.inventories.createIndex({"Source":1,"Destination":1})
db.inventories.aggregate([
    {$group: {_id: { Source: "$Source", Destination: "$Destination" },
            count:{$sum:1 }, seats:{$sum:"$No_Of_Seats"},TicketAmount: { $sum: "$TicketAmount"}}}])
    .forEach(function(data) {db.routeWiseSalesTotal.insert(data)})

db.operatorSalesTotalByRoute.remove({})
db.inventories.aggregate([
    {$group: {_id: { Source: "$Source", Destination: "$Destination",OperatorName:"$OperatorName" },
            count:{$sum:1 }, seats:{$sum:"$No_Of_Seats"},TicketAmount: { $sum: "$TicketAmount"}}}])
    .forEach(function(data) {db.operatorSalesTotalByRoute.insert(data)})

db.operatorSalesTotalByRoute.createIndex({"_id.Source":1, "_id.Destination":1})

db.operatorSalesTotalByRouteByDate.remove({})
db.inventories.aggregate([
    {$group: {_id: { Source: "$Source", Destination: "$Destination",OperatorName:"$OperatorName", BookedDate:"$BookedDate"},
            count:{$sum:1 }, seats:{$sum:"$No_Of_Seats"},TicketAmount: { $sum: "$TicketAmount"}}}],{allowDiskUse:true})
    .forEach(function(data) {db.operatorSalesTotalByRouteByDate.insert(data)})

db.operatorSalesTotalByRouteByDate.createIndex({"_id.Source":1, "_id.Destination":1, "_id.OperatorName":1})
